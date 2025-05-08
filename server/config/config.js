/**
 * Server configuration
 * Can be overridden with environment variables
 */
module.exports = {
  port: process.env.PORT || 3030,
  lmStudioApiUrl: process.env.LM_STUDIO_API_URL || 'http://localhost:1234',
  stableDiffusionApiUrl:
    process.env.SD_API_URL || 'http://localhost:7860/api/v1',
  // Default timeouts
  requestTimeout: process.env.REQUEST_TIMEOUT || 60000, // 60 seconds
};
