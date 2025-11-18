//backend/src/utils/ratel

import rateLimit from 'express-rate-limit';


// General limiter for most routes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});


// Stricter limiter for auth endpoints to prevent brute force
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // allow only 10 requests per IP per window
    message: { message: 'Too many attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});


// Export a factory if you need dynamic window/max
export function createLimiter(opts) {
    return rateLimit(opts);
}