/**
 * API Key Authentication Middleware
 * Validates the API key and attaches tenant information to the request
 */
const tenants = require('../config/tenants');

module.exports = function (req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  const tenant = tenants[apiKey];

  if (!tenant) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // Attach tenant info to the request for use in route handlers
  req.tenant = tenant;

  next();
};
