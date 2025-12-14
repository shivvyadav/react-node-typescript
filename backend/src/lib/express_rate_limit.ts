import { rateLimit } from 'express-rate-limit';

const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute time window for request limiting
  max: 100, // limit each IP to 100 requests per windowMs
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  standardHeaders: 'draft-8', // Enable the `RateLimit-*` headers
  message: {
    error: 'Too many requests, please try again later.',
  },
});

export default apiRateLimiter;
