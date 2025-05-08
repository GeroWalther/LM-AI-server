/**
 * LM Studio Service
 * Handles communication with the LM Studio API
 */
const axios = require('axios');
const config = require('../config/config');

// Create axios instance with base URL and defaults
const lmStudioApi = axios.create({
  baseURL: config.lmStudioApiUrl,
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate text using LM Studio
 * @param {Object} promptData - The chat completion data
 * @returns {Promise<Object>} - The generated text response
 */
async function generateText(promptData) {
  try {
    // Format the request as expected by OpenAI-compatible API
    const response = await lmStudioApi.post('/v1/chat/completions', promptData);
    return response.data;
  } catch (error) {
    console.error('Error calling LM Studio API:', error.message);

    // Provide more detailed error information if available
    if (error.response) {
      throw new Error(
        `LM Studio API error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    }

    throw new Error(`Failed to connect to LM Studio: ${error.message}`);
  }
}

module.exports = {
  generateText,
};
