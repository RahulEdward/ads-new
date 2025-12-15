# Local AI Engine Setup

This directory contains the Python scripts and models required to run the "Self- Hosted HeyGen" features (LipSync and TTS).

## ✅ Installed & Ready
- **TTS (Voice):** Uses Microsoft Edge TTS (Neural Voices). High quality, free, installed.
- **LipSync (Video):** Uses Wav2Lip.

## 🚀 Final Setup Step (Required for Video)

To make the AI VIDEO work, you need to download **ONE** file:

1.  **Download Wav2Lip Model:**
    *   Download [wav2lip_gan.pth](https://huggingface.co/camenduru/Wav2Lip/resolve/main/checkpoints/wav2lip_gan.pth) (Link is safe).
    *   Place it in: `backend/local_engine/checkpoints/wav2lip_gan.pth`
    *(Create the `checkpoints` folder if it doesn't exist)*

2.  **Clone Wav2Lip Repo:**
    ```bash
    cd backend/local_engine
    git clone https://github.com/Rudrabha/Wav2Lip
    ```

Once you do this, the "Simulate" mode will turn into **Real Mode** automating the lip-sync!
