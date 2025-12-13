import httpx
from typing import Optional
from ..core.config import settings


class ElevenLabsService:
    """Service for ElevenLabs Text-to-Speech API"""
    
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1"
        
        # Default voice IDs
        self.voices = {
            "alloy": "21m00Tcm4TlvDq8ikWAM",  # Rachel - female
            "echo": "AZnzlk1XvdvUeBnXmlld",    # Domi - female
            "fable": "EXAVITQu4vr4xnSDxMaL",   # Bella - female
            "onyx": "ErXwobaYiN019PkySvjV",    # Antoni - male
            "nova": "MF3mGyEYCl7XYWbV9V6O",    # Elli - female
            "shimmer": "ThT5KcBeYPX3keUQqHPh"  # Dorothy - female
        }
    
    async def generate_speech(
        self,
        text: str,
        voice_id: str = "alloy",
        speed: float = 1.0
    ) -> str:
        """
        Generate speech from text.
        Cost: ~$0.015 per 1000 characters
        """
        # Map voice name to ID
        actual_voice_id = self.voices.get(voice_id, voice_id)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/text-to-speech/{actual_voice_id}",
                    headers={
                        "xi-api-key": self.api_key,
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": text,
                        "model_id": "eleven_monolingual_v1",
                        "voice_settings": {
                            "stability": 0.5,
                            "similarity_boost": 0.75,
                            "speed": speed
                        }
                    },
                    timeout=120.0
                )
                
                if response.status_code == 200:
                    # In production, upload to S3 and return URL
                    # For now, return a placeholder
                    return f"https://api.elevenlabs.io/audio/{actual_voice_id}"
                else:
                    raise Exception(f"ElevenLabs API error: {response.text}")
                    
        except Exception as e:
            raise Exception(f"Speech generation failed: {str(e)}")
    
    async def get_voices(self) -> list:
        """Get available voices"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/voices",
                    headers={"xi-api-key": self.api_key},
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json().get("voices", [])
                return []
                
        except Exception:
            return []


# Singleton instance
elevenlabs_service = ElevenLabsService()
