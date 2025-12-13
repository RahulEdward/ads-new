from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...core.config import settings
from ...models.user import User, Generation
from ...schemas import VideoGenerateRequest, PresenterVideoRequest, VoiceoverRequest, GenerationResponse
from ...services.replicate_service import replicate_service
from ...services.elevenlabs_service import elevenlabs_service

router = APIRouter(prefix="/videos", tags=["Video Generation"])


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
async def generate_video(
    request: VideoGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a video from text/topic.
    Cost: 50 credits (30s video)
    """
    credits_cost = settings.CREDITS_VIDEO_GENERATION
    await deduct_credits(current_user, credits_cost, db)
    
    gen = await create_generation(
        current_user,
        "video",
        request.topic,
        {
            "duration": request.duration,
            "style": request.style,
            "voice": request.voice,
            "script": request.script
        },
        db
    )
    
    try:
        # Generate video
        output_url = await replicate_service.generate_video(
            topic=request.topic,
            script=request.script,
            duration=request.duration,
            style=request.style
        )
        
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


@router.post("/presenter", response_model=GenerationResponse)
async def generate_presenter_video(
    request: PresenterVideoRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a video with AI presenter.
    Cost: 100 credits
    """
    credits_cost = settings.CREDITS_VIDEO_PRESENTER
    await deduct_credits(current_user, credits_cost, db)
    
    gen = await create_generation(
        current_user,
        "presenter_video",
        request.script,
        {
            "avatar_id": request.avatar_id,
            "background": request.background,
            "voice_id": request.voice_id
        },
        db
    )
    
    try:
        # TODO: Integrate HeyGen API
        output_url = f"https://placeholder.video/{gen.id}"  # Placeholder
        
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


@router.post("/voiceover", response_model=GenerationResponse)
async def generate_voiceover(
    request: VoiceoverRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate AI voiceover from text.
    Cost: 10 credits
    """
    credits_cost = settings.CREDITS_VOICEOVER
    await deduct_credits(current_user, credits_cost, db)
    
    gen = await create_generation(
        current_user,
        "voiceover",
        request.text,
        {"voice": request.voice, "speed": request.speed},
        db
    )
    
    try:
        output_url = await elevenlabs_service.generate_speech(
            text=request.text,
            voice_id=request.voice,
            speed=request.speed
        )
        
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


@router.get("/{generation_id}/status", response_model=GenerationResponse)
async def get_video_status(
    generation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Check status of a video generation.
    """
    result = await db.execute(
        select(Generation)
        .where(Generation.id == generation_id)
        .where(Generation.user_id == current_user.id)
    )
    gen = result.scalar_one_or_none()
    
    if not gen:
        raise HTTPException(status_code=404, detail="Generation not found")
    
    return gen


@router.get("/history", response_model=list[GenerationResponse])
async def get_video_history(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's video generation history.
    """
    video_types = ["video", "presenter_video", "voiceover"]
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .where(Generation.type.in_(video_types))
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()
