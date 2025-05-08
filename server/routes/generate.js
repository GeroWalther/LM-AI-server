/**
 * Generation Routes
 * Handles text and image generation requests
 */
const express = require('express');
const router = express.Router();
const lmStudioService = require('../services/lmStudioService');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const fs = require('fs');
const path = require('path');
const stableDiffusionService = require('../services/stableDiffusionService');

// Apply API key authentication to all routes
router.use(apiKeyAuth);

/**
 * Text generation endpoint
 * Expects a chat completion format similar to OpenAI
 */
router.post('/generate-text', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: 'Valid messages array is required' });
    }

    // Check for NSFW content if tenant has restrictions
    if (!req.tenant.allowNSFW) {
      // Simple check - this could be replaced with a more sophisticated filter
      const lastMessage = messages[messages.length - 1].content.toLowerCase();
      const nsfwKeywords = ['porn', 'explicit', 'nude'];

      if (nsfwKeywords.some((keyword) => lastMessage.includes(keyword))) {
        return res.status(403).json({
          error: 'NSFW content is not allowed on your current plan',
        });
      }
    }

    // Prepare data for LM Studio
    const promptData = {
      messages,
      model: model || 'default', // LM Studio model name
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1024,
    };

    const result = await lmStudioService.generateText(promptData);

    // Return the generated text
    res.json(result);
  } catch (error) {
    console.error('Error in generate-text route:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Image generation endpoint
 * Uses Stable Diffusion API
 */
router.post('/generate-image', async (req, res) => {
  try {
    // Check plan permissions
    if (req.tenant.plan !== 'pro') {
      return res.status(403).json({
        error: 'Image generation is only available on the pro plan',
      });
    }

    const {
      prompt,
      negative_prompt,
      width,
      height,
      steps,
      cfg_scale,
      sampler_name,
    } = req.body;

    // Basic validation
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Content policy enforcement
    // Check for NSFW content if not allowed for this tenant
    if (!req.tenant.allowNSFW) {
      const nsfwKeywords = [
        'nude',
        'naked',
        'sex',
        'porn',
        'explicit',
        'nsfw',
        'gore',
        'blood',
        'murder',
        'kill',
        'death',
        'violent',
      ];

      if (
        nsfwKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))
      ) {
        return res.status(403).json({
          error: 'NSFW content is not allowed on your current plan',
        });
      }
    }
    // Create directory for images if it doesn't exist
    const imagesDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Generate unique filename based on timestamp
    const timestamp = new Date().getTime();
    const filename = `${timestamp}.png`;
    const outputPath = path.join(imagesDir, filename);

    // Generate the image
    await stableDiffusionService.generateImage(
      {
        prompt,
        negative_prompt,
        width: width || 512,
        height: height || 512,
        steps: steps || 30,
        cfg_scale: cfg_scale || 7,
        sampler_name: sampler_name || 'Euler a',
      },
      outputPath
    );

    // Return image data
    res.json({
      success: true,
      image_url: `/images/${filename}`,
      parameters: {
        prompt,
        negative_prompt,
        width: width || 512,
        height: height || 512,
        steps: steps || 30,
      },
    });
  } catch (error) {
    console.error('Error in generate-image route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
