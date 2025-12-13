from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


# ============ User Schemas ============

class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(min_length=8, description="Password must be at least 8 characters")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID
    credits: int
    role: str
    is_active: bool
    avatar_url: Optional[str] = None
    company: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    company: Optional[str] = None


# ============ Auth Schemas ============

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


# ============ Credits Schemas ============

class CreditsUpdate(BaseModel):
    amount: int = Field(description="Credits to add (positive) or remove (negative)")
    reason: str = Field(description="Reason for credit adjustment")


# ============ Generation Schemas ============

class GenerationBase(BaseModel):
    type: str
    prompt: Optional[str] = None
    settings: Optional[dict] = None


class GenerationCreate(GenerationBase):
    pass


class GenerationResponse(GenerationBase):
    id: UUID
    user_id: UUID
    status: str
    output_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    credits_used: int
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ Image Schemas ============

class ImageGenerateRequest(BaseModel):
    prompt: str = Field(min_length=3, description="Describe the image you want")
    size: str = Field(default="1024x1024", description="Image size")
    style: Optional[str] = Field(default="auto", description="Style preset")


class BannerGenerateRequest(BaseModel):
    title: str = Field(description="Main title text")
    subtitle: Optional[str] = Field(default=None, description="Subtitle or tagline")
    platform: str = Field(default="youtube", description="Target platform")
    style: str = Field(default="modern", description="Design style")
    colors: Optional[list] = Field(default=None, description="Brand colors")


class LogoGenerateRequest(BaseModel):
    brand_name: str = Field(description="Brand or company name")
    industry: str = Field(description="Business industry")
    style: str = Field(default="minimal", description="Logo style")
    colors: Optional[list] = Field(default=None, description="Brand colors")


class BackgroundRemoveRequest(BaseModel):
    image_url: str = Field(description="URL of image to process")


# ============ Video Schemas ============

class VideoGenerateRequest(BaseModel):
    topic: str = Field(description="Video topic or subject")
    script: Optional[str] = Field(default=None, description="Video script (auto-generated if empty)")
    duration: int = Field(default=30, description="Video duration in seconds")
    style: str = Field(default="modern", description="Visual style")
    voice: str = Field(default="alloy", description="Voice for narration")


class PresenterVideoRequest(BaseModel):
    script: str = Field(description="Full script for the presenter")
    avatar_id: str = Field(description="Avatar/presenter ID")
    background: str = Field(default="studio", description="Background setting")
    voice_id: Optional[str] = Field(default=None, description="Custom voice ID")


class VoiceoverRequest(BaseModel):
    text: str = Field(description="Text to convert to speech")
    voice: str = Field(default="alloy", description="Voice ID")
    speed: float = Field(default=1.0, description="Speech speed")


# ============ Admin Schemas ============

class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None
    credits: Optional[int] = None


class AnalyticsResponse(BaseModel):
    total_users: int
    active_users: int
    total_generations: int
    credits_consumed: int
    popular_types: dict
