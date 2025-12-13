from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...core.config import settings
from ...models.user import User, Generation
from ...schemas import ImageGenerateRequest, BannerGenerateRequest, LogoGenerateRequest, BackgroundRemoveRequest, GenerationResponse
from ...services.replicate_service import replicate_service

router = APIRouter(prefix="/images", tags=["Image Generation"])


async def deduct_credits(user: User, amount: int, db: AsyncSession):
    """Deduct credits from user account"""
    if user.credits < amount:
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Need {amount}, have {user.credits}")
    user.credits -= amount
    await db.commit()


async def create_generation(user: User, gen_type: str, prompt: str, settings_dict: dict, db: AsyncSession) -> Generation:
    """Create a generation record"""
    gen = Generation(
        user_id=user.id,
        type=gen_type,
        prompt=prompt,
        settings=json.dumps(settings_dict),
        status="processing"
    )
    db.add(gen)
    await db.commit()
    await db.refresh(gen)
    return gen


@router.post("/generate", response_model=GenerationResponse)
async def generate_image(
    request: ImageGenerateRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate an image from a text prompt.
    Cost: 5 credits
    """
    credits_cost = settings.CREDITS_IMAGE_GENERATION
    await deduct_credits(current_user, credits_cost, db)
    
    # Create generation record
    gen = await create_generation(
        current_user, 
        "image", 
        request.prompt,
        {"size": request.size, "style": request.style},
        db
    )
    
    try:
        # Generate image
        output_url = await replicate_service.generate_image(
            prompt=request.prompt,
            size=request.size,
            style=request.style
        )
        
        # Update generation
        gen.status = "completed"
        gen.output_url = output_url
        gen.credits_used = credits_cost
        gen.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(gen)
        
    except Exception as e:
        gen.status = "failed"
        gen.error_message = str(e)
        # Refund credits on failure
        current_user.credits += credits_cost
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return gen


@router.post("/banner", response_model=GenerationResponse)
async def generate_banner(
    request: BannerGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a banner for social media platforms.
    Cost: 5 credits
    """
    credits_cost = settings.CREDITS_IMAGE_GENERATION
    await deduct_credits(current_user, credits_cost, db)
    
    # Build banner prompt
    platform_sizes = {
        "youtube": "1280x720",
        "facebook": "1200x630",
        "instagram": "1080x1080",
        "twitter": "1500x500",
        "linkedin": "1584x396"
    }
    
    size = platform_sizes.get(request.platform, "1280x720")
    
    prompt = f"""Professional {request.platform} banner design:
Title: "{request.title}"
{f'Subtitle: "{request.subtitle}"' if request.subtitle else ''}
Style: {request.style}, modern, eye-catching
High quality, professional design, clean typography"""
    
    gen = await create_generation(
        current_user,
        "banner",
        prompt,
        {"platform": request.platform, "size": size, "style": request.style},
        db
    )
    
    try:
        output_url = await replicate_service.generate_image(prompt=prompt, size=size)
        gen.status = "completed"
        gen.output_url = output_url
        gen.credits_used = credits_cost
        gen.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(gen)
    except Exception as e:
        gen.status = "failed"
        gen.error_message = str(e)
        current_user.credits += credits_cost
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return gen


@router.post("/logo", response_model=GenerationResponse)
async def generate_logo(
    request: LogoGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a logo for a brand.
    Cost: 5 credits
    """
    credits_cost = settings.CREDITS_IMAGE_GENERATION
    await deduct_credits(current_user, credits_cost, db)
    
    prompt = f"""Professional logo design for "{request.brand_name}":
Industry: {request.industry}
Style: {request.style}, clean, memorable, vector-style
{f'Colors: {", ".join(request.colors)}' if request.colors else 'Modern color palette'}
Simple, scalable, professional brand identity"""
    
    gen = await create_generation(
        current_user,
        "logo",
        prompt,
        {"brand": request.brand_name, "industry": request.industry, "style": request.style},
        db
    )
    
    try:
        output_url = await replicate_service.generate_image(prompt=prompt, size="1024x1024")
        gen.status = "completed"
        gen.output_url = output_url
        gen.credits_used = credits_cost
        gen.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(gen)
    except Exception as e:
        gen.status = "failed"
        gen.error_message = str(e)
        current_user.credits += credits_cost
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return gen


@router.post("/remove-background", response_model=GenerationResponse)
async def remove_background(
    request: BackgroundRemoveRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Remove background from an image.
    Cost: 2 credits
    """
    credits_cost = settings.CREDITS_BACKGROUND_REMOVAL
    await deduct_credits(current_user, credits_cost, db)
    
    gen = await create_generation(
        current_user,
        "background_removal",
        request.image_url,
        {},
        db
    )
    
    try:
        output_url = await replicate_service.remove_background(image_url=request.image_url)
        gen.status = "completed"
        gen.output_url = output_url
        gen.credits_used = credits_cost
        gen.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(gen)
    except Exception as e:
        gen.status = "failed"
        gen.error_message = str(e)
        current_user.credits += credits_cost
        await db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return gen


@router.get("/history", response_model=list[GenerationResponse])
async def get_image_history(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's image generation history.
    """
    image_types = ["image", "banner", "logo", "background_removal"]
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .where(Generation.type.in_(image_types))
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()
