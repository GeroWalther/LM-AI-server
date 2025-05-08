# Setting Up Uncensored Stable Diffusion

This guide will help you set up Stable Diffusion with uncensored models for the image generation part of our multi-tenant SaaS.

## Local Setup (for Testing)

### 1. Install AUTOMATIC1111 Web UI

```bash
# Clone the repository
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Run the installer (for Windows)
# For Windows, run webui-user.bat
# For Linux/Mac:
./webui.sh
```

### 2. Download Uncensored Models

Download one of these models for uncensored content:

- **AbyssOrangeMix (AOM)** - High-quality NSFW content
- **Anything v5** - Popular uncensored anime-style model
- **Chilloutmix** - Photorealistic uncensored model
- **Realistic Vision** - Photorealistic with good NSFW capabilities

Place the downloaded model file (.safetensors or .ckpt) in:

```
stable-diffusion-webui/models/Stable-diffusion/
```

### 3. Configure for Uncensored Use

Edit your launch script:

- **Windows**: Edit `webui-user.bat`
- **Linux/Mac**: Edit `webui-user.sh`

Add these arguments:

```
--api --no-half-vae --xformers --disable-safe-unpickle --enable-insecure-extension-access
```

### 4. Launch the Web UI

Run the startup script without the `--safe` flag to disable the safety filters.

### 5. Starting the API

To run the API for our Express server to connect to:

```bash
# Windows
webui.bat --api --no-half-vae --xformers --disable-safe-unpickle --enable-insecure-extension-access

# Linux/Mac
./webui.sh --api --no-half-vae --xformers --disable-safe-unpickle --enable-insecure-extension-access
```

The API will be available at `http://localhost:7860/api/v1`

## EC2 Setup

For EC2, follow the same steps, but:

1. Use a GPU-enabled instance (at least g4dn.xlarge)
2. Install the required dependencies for Stable Diffusion
3. Consider using Docker for easier deployment

### Docker Setup (Recommended for EC2)

```bash
docker run -p 7860:7860 \
  -v /path/to/models:/models \
  -e EXTRA_ARGS="--api --no-half-vae --xformers --disable-safe-unpickle --enable-insecure-extension-access" \
  ghcr.io/abetlen/stable-diffusion-webui:latest
```

## Testing the API

You can test the API using curl:

```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -H "x-api-key: pro987" \
  -d '{
    "prompt": "A beautiful sunset over the ocean, digital art",
    "negative_prompt": "blurry, low quality",
    "width": 512,
    "height": 512,
    "steps": 30
  }'
```

## Troubleshooting

- If you get CUDA errors, try reducing the image size or steps
- If the API returns 404, make sure you started with the `--api` flag
- For uncensored models, sometimes you need to add specific prompts like "NSFW" or "nude" to trigger the uncensored behavior
