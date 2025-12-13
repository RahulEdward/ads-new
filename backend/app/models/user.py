from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Uuid
from datetime import datetime
import uuid

from ..core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    
    # Credits system
    credits = Column(Integer, default=100)
    
    # Role: user | admin
    role = Column(String(20), default="user")
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Profile
    avatar_url = Column(String(500), nullable=True)
    company = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User {self.email}>"


class Generation(Base):
    """Track all generations (images/videos)"""
    __tablename__ = "generations"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, index=True, nullable=False)
    
    # Type: image | video | logo | banner | background_removal | voiceover
    type = Column(String(50), nullable=False)
    
    # Status: pending | processing | completed | failed
    status = Column(String(20), default="pending")
    
    # Input
    prompt = Column(Text, nullable=True)
    settings = Column(Text, nullable=True)  # JSON string
    
    # Output
    output_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    
    # Cost
    credits_used = Column(Integer, default=0)
    
    # Error tracking
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Generation {self.type} - {self.status}>"
