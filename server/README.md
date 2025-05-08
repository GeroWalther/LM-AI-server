# AI SaaS Express Server

A lightweight, multi-tenant Express.js server for AI text generation (and later image generation) using LM Studio and Stable Diffusion.

## Features

- API key-based multi-tenant access
- Text generation via LM Studio
- Plan-based restrictions (NSFW filtering, etc)
- Stateless architecture
- Ready for deployment to EC2 or other hosting

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- [LM Studio](https://lmstudio.ai/) installed locally

### Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Configure environment:

   - Create a `.env` file in the project root with:

   ```
   PORT=3000
   LM_STUDIO_API_URL=http://localhost:1234/v1
   ```

3. Setting up LM Studio:

   - Launch LM Studio
   - Load your preferred model
   - Go to "Local Server" tab
   - Click "Start Server"
   - Ensure the server is running on `http://localhost:1234`
   - The server should be OpenAI API compatible

4. Start the Express server:
   ```
   npm run dev
   ```

## API Endpoints

### Health Check

- `GET /health` - Check if the server is running

### Text Generation

- `POST /api/generate-text`
  - Headers: `x-api-key: your-api-key`
  - Body:
    ```json
    {
      "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "Hello, how are you?" }
      ],
      "temperature": 0.7,
      "max_tokens": 1024
    }
    ```

### Image Generation (Coming soon)

- `POST /api/generate-image`

## Deploying to EC2

When deploying to an EC2 instance:

1. Update the `.env` file with your EC2 instance's information:

   ```
   LM_STUDIO_API_URL=http://your-ec2-ip:1234/v1
   ```

2. Install and set up LM Studio on your EC2 instance
3. Ensure ports are open in your security groups
4. Use PM2 or similar for process management:
   ```
   npm install -g pm2
   pm2 start server.js
   ```

## Customizing Tenants

Edit the `config/tenants.js` file to add or modify API keys and permissions.
