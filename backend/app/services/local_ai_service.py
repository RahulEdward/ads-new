
import os
import asyncio
import uuid
from pathlib import Path
from ..core.config import settings

# Directory for local AI outputs
OUTPUT_DIR = Path("static/generations")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

class LocalAIService:
    """
    Service to manage local AI inference for TTS and Video Generation.
    This replaces external APIs with local Python scripts.
    """
    
    def __init__(self):
        self.engine_path = Path("local_engine")
        
    async def generate_audio(self, text: str, voice_id: str) -> str:
        """
        Generate audio using local TTS (Coqui/XTTS).
        Returns: URL path to the generated audio file.
        """
        filename = f"{uuid.uuid4()}.wav"
        output_path = OUTPUT_DIR / filename
        
        # Command to run local TTS script
        # In a real setup, this runs: python local_engine/tts.py --text "..." --out "..."
        cmd = f'python {self.engine_path}/tts.py --text "{text}" --voice "{voice_id}" --output "{output_path}"'
        
        print(f"Executing Local TTS: {cmd}")
        
        # Simulation for now (since we don't have the heavy weights installed)
        # We will create a dummy file if the script fails or is missing
        if not (self.engine_path / "tts.py").exists():
            print("Local TTS script not found. Using simulation.")
            await self._create_dummy_audio(output_path)
        else:
            # Run the actual process
            proc = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await proc.communicate()
            if proc.returncode != 0:
                raise Exception(f"Local TTS failed: {stderr.decode()}")

        return f"/static/generations/{filename}"

    async def generate_lip_sync(self, audio_url: str, avatar_id: str) -> str:
        """
        Generate video using Wav2Lip/SadTalker.
        Returns: URL path to the generated video file.
        """
        filename = f"{uuid.uuid4()}.mp4"
        output_path = OUTPUT_DIR / filename
        
        # Audio path resolution (convert URL to local path)
        audio_path = OUTPUT_DIR / Path(audio_url).name
        
        cmd = f'python {self.engine_path}/inference.py --checkpoint_path "checkpoints/wav2lip.pth" --face "{avatar_id}.jpg" --audio "{audio_path}" --outfile "{output_path}"'
        
        print(f"Executing Local LipSync: {cmd}")

        if not (self.engine_path / "inference.py").exists():
            print("Local Inference script not found. Using simulation.")
            await self._create_dummy_video(output_path)
        else:
             proc = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
             stdout, stderr = await proc.communicate()
             if proc.returncode != 0:
                raise Exception(f"Local LipSync failed: {stderr.decode()}")
                
        return f"/static/generations/{filename}"

    async def _create_dummy_audio(self, path: Path):
        """Creates a silent dummy audio file for testing"""
        # In a real app we might copy a sample file
        import shutil
        sample = Path("local_engine/sample.wav")
        if sample.exists():
            shutil.copy(sample, path)
        else:
             # Create an empty file
             with open(path, "wb") as f:
                 f.write(b"RIFF....WAVEfmt ....data....") # minimal wav header mock

    async def _create_dummy_video(self, path: Path):
        """Creates a dummy video file"""
        import shutil
        sample = Path("local_engine/sample.mp4")
        if sample.exists():
            shutil.copy(sample, path)
        else:
             with open(path, "wb") as f:
                 f.write(b"....") 

local_ai = LocalAIService()
