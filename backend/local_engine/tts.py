import argparse
import asyncio
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import edge_tts
except ImportError:
    print("Error: edge-tts not installed. Please install with: pip install edge-tts")
    sys.exit(1)

async def generate_voice_async(text, voice_id, output_path):
    """
    Generate speech from text using Microsoft Edge TTS (High Quality, Free).
    """
    print(f"Generating Audio via Edge TTS...")
    print(f"Text: {text[:30]}...")
    
    # Map friendly names to Edge TTS voices (High Quality Neural Voices)
    VOICE_MAP = {
        "alloy": "en-US-GuyNeural",
        "echo": "en-US-MichelleNeural",
        "fable": "en-GB-SoniaNeural",
        "onyx": "en-US-ChristopherNeural",
        "nova": "en-US-AriaNeural",
        "shimmer": "en-US-EmmaNeural",
        "hindi_f": "hi-IN-SwaraNeural",
        "hindi_m": "hi-IN-MadhurNeural",
        "default": "en-US-ChristopherNeural"
    }

    # Select voice or fallback
    selected_voice = VOICE_MAP.get(voice_id, VOICE_MAP["default"])
    print(f"Using Voice: {selected_voice}")

    communicate = edge_tts.Communicate(text, selected_voice)
    await communicate.save(output_path)
    
    print(f"Success! Audio saved to {output_path}")

def generate_voice(text, voice_id, output_path):
    """Wrapper to run async function from sync context"""
    asyncio.run(generate_voice_async(text, voice_id, output_path))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Local TTS Engine (Edge-TTS)")
    parser.add_argument("--text", type=str, required=True, help="Text to speak")
    parser.add_argument("--voice", type=str, default="default", help="Voice ID")
    parser.add_argument("--output", type=str, required=True, help="Output wav/mp3 file path")
    
    args = parser.parse_args()
    
    generate_voice(args.text, args.voice, args.output)
