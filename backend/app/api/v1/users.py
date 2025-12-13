from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User, Generation
from ...schemas import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""
    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.avatar_url:
        current_user.avatar_url = update_data.avatar_url
    if update_data.company:
        current_user.company = update_data.company
    
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/credits")
async def get_credits(current_user: User = Depends(get_current_user)):
    """Get current credit balance"""
    return {
        "credits": current_user.credits,
        "user_id": str(current_user.id)
    }


@router.get("/history")
async def get_all_history(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all generation history for current user"""
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    generations = result.scalars().all()
    
    return {
        "total": len(generations),
        "items": generations
    }


@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's usage statistics"""
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .where(Generation.status == "completed")
    )
    generations = result.scalars().all()
    
    stats = {
        "total_generations": len(generations),
        "credits_used": sum(g.credits_used for g in generations),
        "by_type": {}
    }
    
    for gen in generations:
        if gen.type not in stats["by_type"]:
            stats["by_type"][gen.type] = 0
        stats["by_type"][gen.type] += 1
    
    return stats
