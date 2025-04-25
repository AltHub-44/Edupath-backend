const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication rate limiter (more strict)
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: 'Too many login attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
});

// File upload rate limiter
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: 'Too many file uploads, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
});

// Message sending rate limiter
exports.messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 messages per minute
  message: 'Too many messages sent, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false
});

// Session creation rate limiter
exports.sessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 session creations per hour
  message: 'Too many session creations, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
}); 