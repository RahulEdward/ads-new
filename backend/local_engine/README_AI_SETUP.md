# Local AI Engine Setup

## 1. Install Dependencies
The backend requirements have been updated. Run:
```bash
pip install -r backend/requirements.txt
```
This installs `torch`, `edge-tts`, and other necessary libraries.

## 2. Download Wav2Lip Model
For Lip-Sync features to work, you need the pre-trained Wav2Lip model.

1. Download `wav2lip.pth` from this link: [Google Drive Link](https://drive.google.com/file/d/1tZpDWXz49W6wCc-FULxSeqAFGsW5hU7O/view?usp=sharing)
2. Place the file in: `backend/local_engine/checkpoints/wav2lip.pth`

## 3. Verify Setup
Run the `inference.py` script manually to test if everything is detected:
```bash
cd backend/local_engine
python inference.py --help
```

## Features
- **TTS**: Uses `edge-tts` (No extra download needed).
- **LipSync**: Uses `Wav2Lip` (Needs `wav2lip.pth`).
