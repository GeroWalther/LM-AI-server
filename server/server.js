/**
 * Express Server
 * Multi-tenant AI Service
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const generateRoutes = require('./routes/generate');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files for generated images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', generateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`LM Studio API configured at: ${config.lmStudioApiUrl}`);
  console.log(
    `Stable Diffusion API configured at: ${config.stableDiffusionApiUrl}`
  );
});
