/**
 * Stable Diffusion Service
 * Handles communication with the Stable Diffusion API
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Create axios instance with base URL and defaults
const sdApi = axios.create({
  baseURL: config.stableDiffusionApiUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate image using Stable Diffusion
 * @param {Object} promptData - The image generation data
 * @param {String} outputPath - Where to save the image (optional)
 * @returns {Promise<Object>} - The generated image response
 */
async function generateImage(promptData, outputPath = null) {
  try {
    // Format the request as expected by Stable Diffusion API
    const payload = {
      prompt: promptData.prompt,
      negative_prompt: promptData.negative_prompt || '',
      steps: promptData.steps || 30,
      width: promptData.width || 512,
      height: promptData.height || 512,
      cfg_scale: promptData.cfg_scale || 7,
      sampler_name: promptData.sampler_name || 'Euler a',
    };

    const response = await sdApi.post('/txt2img', payload);

    // Response contains images as base64
    const images = response.data.images;

    // If outputPath provided, save the first image
    if (outputPath && images && images.length > 0) {
      const base64Data = images[0].replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, buffer);
    }

    return {
      images: images,
      parameters: response.data.parameters,
      info: response.data.info,
    };
  } catch (error) {
    console.error('Error calling Stable Diffusion API:', error.message);

    // Provide more detailed error information if available
    if (error.response) {
      throw new Error(
        `Stable Diffusion API error: ${
          error.response.status
        } - ${JSON.stringify(error.response.data)}`
      );
    }

    throw new Error(`Failed to connect to Stable Diffusion: ${error.message}`);
  }
}

module.exports = {
  generateImage,
};
