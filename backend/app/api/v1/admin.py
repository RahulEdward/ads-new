from fastapi import APIRouter, Depends, HTTPException
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ...core.database import get_db
from ...core.security import get_current_admin
from ...models.user import User, Generation
from ...schemas import UserResponse, AdminUserUpdate, AnalyticsResponse, CreditsUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    limit: int = 50,
    offset: int = 0,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all users (admin only)"""
    result = await db.execute(
        select(User)
        .order_by(User.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get user details (admin only)"""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    update_data: AdminUserUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update user (admin only)"""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if update_data.is_active is not None:
        user.is_active = update_data.is_active
    if update_data.role is not None:
        user.role = update_data.role
    if update_data.credits is not None:
        user.credits = update_data.credits
    
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/credits")
async def adjust_credits(
    user_id: str,
    credits_data: CreditsUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Adjust user credits (admin only)"""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.credits += credits_data.amount
    if user.credits < 0:
        user.credits = 0
    
    await db.commit()
    
    return {
        "user_id": user_id,
        "new_balance": user.credits,
        "adjustment": credits_data.amount,
        "reason": credits_data.reason
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Delete/deactivate user (admin only)"""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete - just deactivate
    user.is_active = False
    await db.commit()
    
    return {"message": "User deactivated", "user_id": user_id}


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get platform analytics (admin only)"""
    # Total users
    users_result = await db.execute(select(func.count(User.id)))
    total_users = users_result.scalar()
    
    # Active users
    active_result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = active_result.scalar()
    
    # Total generations
    gen_result = await db.execute(select(func.count(Generation.id)))
    total_generations = gen_result.scalar()
    
    # Credits consumed
    credits_result = await db.execute(
        select(func.sum(Generation.credits_used))
    )
    credits_consumed = credits_result.scalar() or 0
    
    # Popular types
    type_result = await db.execute(
        select(Generation.type, func.count(Generation.id))
        .group_by(Generation.type)
    )
    popular_types = {row[0]: row[1] for row in type_result}
    
    return AnalyticsResponse(
        total_users=total_users,
        active_users=active_users,
        total_generations=total_generations,
        credits_consumed=credits_consumed,
        popular_types=popular_types
    )
