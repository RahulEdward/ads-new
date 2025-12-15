import argparse
import os
import sys
import subprocess
from pathlib import Path

# This script acts as a wrapper around the Wav2Lip inference
# It assumes Wav2Lip is set up in a subdirectory or installed

def generate_lipsync(face_image, audio_file, output_file, checkpoint_path):
    """
    Generate lip-synced video using Wav2Lip.
    """
    print("Initializing Wav2Lip Inference...")
    
    # Path to the actual Wav2Lip inference script
    # We assume the user has cloned Wav2Lip into 'Wav2Lip' folder inside local_engine
    wav2lip_path = Path(os.path.dirname(os.path.abspath(__file__))) / "Wav2Lip"
    inference_script = wav2lip_path / "inference.py"
    
    if not inference_script.exists():
        print(f"Error: Wav2Lip not found at {wav2lip_path}")
        print("Please clone the repo: git clone https://github.com/Rudrabha/Wav2Lip")
        sys.exit(1)

    # Construct command for Wav2Lip
    # python inference.py --checkpoint_path <chk> --face <img/vid> --audio <audio> --outfile <out>
    
    cmd = [
        sys.executable, 
        str(inference_script),
        "--checkpoint_path", checkpoint_path,
        "--face", face_image,
        "--audio", audio_file,
        "--outfile", output_file,
        "--resize_factor", "1",
        "--nosmooth"
    ]
    
    try:
        # Execute the actual model script
        subprocess.check_call(cmd, cwd=wav2lip_path)
        print(f"Success! Video saved to {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error running Wav2Lip: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Local LipSync Engine (Wav2Lip)")
    parser.add_argument("--checkpoint_path", type=str, required=True, help="Path to .pth model")
    parser.add_argument("--face", type=str, required=True, help="Path to input image or video")
    parser.add_argument("--audio", type=str, required=True, help="Path to input audio")
    parser.add_argument("--outfile", type=str, required=True, help="Path to output video")
    
    args = parser.parse_args()
    
    generate_lipsync(args.face, args.audio, args.outfile, args.checkpoint_path)
