/**
 * Tenant configuration
 * Each API key corresponds to a tenant with specific permissions
 */
module.exports = {
  abc123: {
    plan: 'free',
    allowNSFW: false,
  },
  pro987: {
    plan: 'pro',
    allowNSFW: true,
  },
};
