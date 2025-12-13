import replicate
import httpx
from typing import Optional
from ..core.config import settings


class ReplicateService:
    """Service for Replicate API integration"""
    
    def __init__(self):
        self.client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
    
    async def generate_image(
        self, 
        prompt: str, 
        size: str = "1024x1024",
        style: str = "auto"
    ) -> str:
        """
        Generate image using SDXL or Flux model.
        Cost: ~$0.002 per image
        """
        # Parse size
        width, height = map(int, size.split("x"))
        
        # Add style modifiers to prompt
        style_prompts = {
            "minimal": "minimalist, clean, simple, modern design",
            "bold": "bold, vibrant colors, high contrast, impactful",
            "playful": "playful, fun, colorful, dynamic",
            "corporate": "professional, corporate, business, elegant",
            "auto": "high quality, professional"
        }
        
        enhanced_prompt = f"{prompt}, {style_prompts.get(style, style_prompts['auto'])}"
        
        try:
            # Using Flux model for high quality
            output = self.client.run(
                "black-forest-labs/flux-schnell",
                input={
                    "prompt": enhanced_prompt,
                    "num_outputs": 1,
                    "aspect_ratio": self._get_aspect_ratio(width, height),
                    "output_format": "png",
                    "output_quality": 90
                }
            )
            
            # Return first image URL
            if output and len(output) > 0:
                return str(output[0])
            raise Exception("No output generated")
            
        except Exception as e:
            raise Exception(f"Image generation failed: {str(e)}")
    
    async def remove_background(self, image_url: str) -> str:
        """
        Remove background from image using rembg.
        Cost: ~$0.001 per image
        """
        try:
            output = self.client.run(
                "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
                input={
                    "image": image_url
                }
            )
            
            if output:
                return str(output)
            raise Exception("No output generated")
            
        except Exception as e:
            raise Exception(f"Background removal failed: {str(e)}")
    
    async def generate_video(
        self,
        topic: str,
        script: Optional[str] = None,
        duration: int = 30,
        style: str = "modern"
    ) -> str:
        """
        Generate video using text-to-video model.
        Cost: ~$0.05 per video
        """
        try:
            # Create video prompt from topic
            video_prompt = script or f"A professional video about {topic}, {style} style, high quality cinematography"
            
            output = self.client.run(
                "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
                input={
                    "prompt": video_prompt,
                    "num_frames": min(duration * 8, 24),  # ~8 fps
                    "fps": 8
                }
            )
            
            if output:
                return str(output)
            raise Exception("No video generated")
            
        except Exception as e:
            raise Exception(f"Video generation failed: {str(e)}")
    
    def _get_aspect_ratio(self, width: int, height: int) -> str:
        """Convert dimensions to aspect ratio string"""
        ratio = width / height
        if ratio > 1.5:
            return "16:9"
        elif ratio < 0.7:
            return "9:16"
        elif ratio > 1.1:
            return "4:3"
        elif ratio < 0.9:
            return "3:4"
        else:
            return "1:1"


# Singleton instance
replicate_service = ReplicateService()
