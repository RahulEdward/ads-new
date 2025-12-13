# Enterprise AI Content Platform - Detailed Implementation Plan

## 🎯 Executive Summary

Building a **cost-effective, high-performance** AI content platform with:
- **Image Module**: Banners, logos, background removal
- **Video Module**: YouTube, reels, courses, AI presenter
- **User System**: Multi-user + Admin dashboard

---

## 📐 Phase 1: Foundation Setup (Day 1)

### Step 1.1: Initialize Frontend (Next.js 14)

```bash
# Run in d:\ads-app
npx -y create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Files to create:**
| File | Purpose |
|------|---------|
| `frontend/src/lib/api.ts` | Axios client with interceptors |
| `frontend/src/lib/stores/authStore.ts` | Zustand auth state |
| `frontend/src/lib/stores/uiStore.ts` | UI state (modals, themes) |

### Step 1.2: Initialize Backend (FastAPI)

```bash
# Create backend structure
mkdir backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy asyncpg pydantic python-jose passlib bcrypt python-multipart celery redis replicate httpx boto3 python-dotenv
```

**Files to create:**
| File | Purpose |
|------|---------|
| `backend/app/__init__.py` | Package init |
| `backend/app/main.py` | FastAPI app entry |
| `backend/app/core/config.py` | Environment settings |
| `backend/app/core/database.py` | PostgreSQL connection |

### Step 1.3: Docker Setup

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: adsapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## 🔐 Phase 2: Authentication System (Day 2)

### Step 2.1: Database Models

**File: `backend/app/models/user.py`**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    credits = Column(Integer, default=100)  # Free credits
    role = Column(String, default="user")   # user | admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Step 2.2: Auth Endpoints

**File: `backend/app/api/v1/auth.py`**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create new user with 100 credits |
| `/auth/login` | POST | Return JWT token |
| `/auth/me` | GET | Get current user profile |
| `/auth/refresh` | POST | Refresh access token |

### Step 2.3: Frontend Auth Pages

| Page | Path | Components |
|------|------|------------|
| Login | `/login` | Email, Password, Remember me |
| Register | `/register` | Name, Email, Password, Confirm |
| Forgot Password | `/forgot-password` | Email reset flow |

---

## 🖼️ Phase 3: Image Generation Module (Day 3-4)

### Step 3.1: Replicate Service

**File: `backend/app/services/replicate_service.py`**

```python
class ReplicateService:
    async def generate_image(self, prompt: str, size: str = "1024x1024"):
        """SDXL/Flux image generation - $0.002/image"""
        
    async def remove_background(self, image_url: str):
        """rembg background removal - $0.001/image"""
        
    async def generate_logo(self, prompt: str, style: str):
        """Logo-specific generation with style presets"""
```

### Step 3.2: Image Endpoints

**File: `backend/app/api/v1/images.py`**
| Endpoint | Credits | Description |
|----------|---------|-------------|
| `POST /images/generate` | 5 | General image generation |
| `POST /images/banner` | 5 | Banner with presets (YouTube, Facebook, etc.) |
| `POST /images/logo` | 5 | Logo generation with style options |
| `POST /images/remove-bg` | 2 | Background removal |

### Step 3.3: Image Generation UI

**Components to build:**
```
frontend/src/components/generators/
├── ImageGenerator.tsx      # Main generation form
├── BannerGenerator.tsx     # Template-based banners
├── LogoGenerator.tsx       # Logo with style picker
├── BackgroundRemover.tsx   # Drag-drop upload
└── StylePicker.tsx         # Reusable style selector
```

---

## 🎬 Phase 4: Video Generation Module (Day 5-7)

### Step 4.1: Video Service Integration

| Provider | Use Case | Cost |
|----------|----------|------|
| Replicate (Runway ML) | Text-to-video clips | ~$0.05/video |
| ElevenLabs | AI voiceover | ~$0.015/1K chars |
| HeyGen | AI presenter videos | ~$0.10/min |
| OpenAI Whisper | Transcription | ~$0.006/min |

### Step 4.2: Video Endpoints

**File: `backend/app/api/v1/videos.py`**
| Endpoint | Credits | Description |
|----------|---------|-------------|
| `POST /videos/generate` | 50 | Text-to-video (30s) |
| `POST /videos/voiceover` | 10 | TTS audio generation |
| `POST /videos/presenter` | 100 | AI avatar video |
| `POST /videos/course` | 150 | Full course lesson |
| `GET /videos/{id}/status` | 0 | Check generation status |

### Step 4.3: Video UI Components

```
frontend/src/components/generators/
├── VideoGenerator.tsx       # Main video form
├── ScriptEditor.tsx         # AI-assisted script writing
├── VoiceSelector.tsx        # Voice/accent picker
├── AvatarPicker.tsx         # AI presenter selection
└── CourseBuilder.tsx        # Multi-lesson creator
```

---

## 🏠 Phase 5: Frontend Dashboard (Day 8-9)

### Step 5.1: Landing Page Sections

```
landing/
├── HeroSection.tsx          # Video background + split text
├── ShowcaseGrid.tsx         # Bento grid with samples
├── FeaturesCarousel.tsx     # Horizontal scroll
├── PricingCards.tsx         # Animated pricing
└── CTASection.tsx           # Full-width gradient
```

### Step 5.2: Dashboard Layout

```
(dashboard)/
├── layout.tsx               # Sidebar + Header
├── page.tsx                 # Overview cards
├── images/page.tsx          # Image generation
├── videos/page.tsx          # Video generation
├── templates/page.tsx       # Pre-built templates
└── history/page.tsx         # All generations
```

---

## 👑 Phase 6: Admin Panel (Day 10)

### Step 6.1: Admin Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /admin/users` | List all users with stats |
| `PATCH /admin/users/{id}/credits` | Adjust user credits |
| `DELETE /admin/users/{id}` | Suspend/delete user |
| `GET /admin/analytics` | Usage statistics |

### Step 6.2: Admin UI

```
admin/
├── page.tsx                 # Dashboard overview
├── users/page.tsx           # User management table
└── analytics/page.tsx       # Charts & graphs
```

---

## 📅 Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 1. Foundation | Day 1 | Project setup, Docker |
| 2. Auth | Day 2 | Login, Register, JWT |
| 3. Images | Day 3-4 | Banner, Logo, BG Removal |
| 4. Videos | Day 5-7 | YouTube, Reels, Courses |
| 5. Dashboard | Day 8-9 | Landing, User Dashboard |
| 6. Admin | Day 10 | Admin Panel, Analytics |

---

> [!IMPORTANT]
> **Ready to proceed?** Please confirm to start Phase 1!
