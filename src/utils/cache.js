const NodeCache = require('node-cache');

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Don't clone values (better performance)
});

// Cache keys
const CACHE_KEYS = {
  DASHBOARD_OVERVIEW: 'dashboard_overview',
  DASHBOARD_ANALYTICS: 'dashboard_analytics',
  MENTEE_LIST: 'mentee_list',
  SESSION_LIST: 'session_list',
  ASSIGNMENT_LIST: 'assignment_list',
  RESOURCE_LIST: 'resource_list'
};

// Get cached data
exports.getCache = (key) => {
  return cache.get(key);
};

// Set cached data
exports.setCache = (key, value, ttl = 300) => {
  return cache.set(key, value, ttl);
};

// Delete cached data
exports.deleteCache = (key) => {
  return cache.del(key);
};

// Clear all cache
exports.clearAllCache = () => {
  return cache.flushAll();
};

// Get cache stats
exports.getCacheStats = () => {
  return cache.getStats();
};

// Cache middleware
exports.cacheMiddleware = (key, ttl = 300) => {
  return (req, res, next) => {
    const cachedData = cache.get(key);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method
    res.json = (data) => {
      cache.set(key, data, ttl);
      originalJson.call(res, data);
    };
    
    next();
  };
};

// Cache keys for reference
exports.CACHE_KEYS = CACHE_KEYS; 