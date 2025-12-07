import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// If using Redis (recommended for production):
// import { createClient } from 'redis';

/**
 * Memory-based rate limiter (simple setup)
 * Good for single server instances
 */

export const memoryRateLimiter = rateLimit({
    windowMs: 60 * 10 * 1000, // 10 min
    max: 5,
    message: {
        success: false,
        error: 'Too many batch processing requests. Please try again in 10 min.',
        retryAfter: null // Will be calculated automatically
    },

    // Headers sent to client
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers

    // Custom handler when limit is exceeded
    handler: (req, res) => {
        const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
        const minutes = Math.ceil(retryAfter / 60);

        res.status(429).json({
            success: false,
            error: `Rate limit exceeded. You can process more images in approximately ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
            retryAfter: retryAfter,
            limit: req.rateLimit.limit,
            remaining: 0
        });
    },

    // Skip rate limiting for certain conditions
    skip: (req) => {
        // Example: Skip rate limiting for authenticated admin users
        // return req.user && req.user.role === 'admin';

        console.log(req) // remove this later

        return false;
    },

    // Key generator - identifies unique users
    keyGenerator: (req) => {
        // Use IP address as identifier
        return req.ip || req.connection.remoteAddress;
    }

});


/**
 * Redis-based rate limiter (recommended for production)
 * Good for multiple server instances (horizontal scaling)
 */
export const createRedisRateLimiter = async () => {
    // Uncomment if using Redis:
    /*
    const redisClient = createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    });
    
    await redisClient.connect();
    
    return rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // 10 requests per hour
        
        store: new RedisStore({
            client: redisClient,
            prefix: 'rate_limit:batch:',
        }),
        
        message: {
            success: false,
            error: 'Too many batch processing requests. Please try again later.',
        },
        
        standardHeaders: true,
        legacyHeaders: false,
        
        handler: (req, res) => {
            const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
            const minutes = Math.ceil(retryAfter / 60);
            
            res.status(429).json({
                success: false,
                error: `Rate limit exceeded. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
                retryAfter: retryAfter,
                limit: req.rateLimit.limit,
                remaining: 0
            });
        },
        
        keyGenerator: (req) => {
            return req.ip || req.connection.remoteAddress;
        }
    });
    */

    // Return memory limiter if Redis not configured
    return memoryRateLimiter;
};


export const createCustomRateLimiter = (options = {}) => {
    const {
        windowMinutes = 60,      // Time window in minutes
        maxRequests = 10,         // Max requests per window
        message = 'Rate limit exceeded'
    } = options;

    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,

        message: {
            success: false,
            error: message,
        },

        standardHeaders: true,
        legacyHeaders: false,

        handler: (req, res) => {
            const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
            const minutes = Math.ceil(retryAfter / 60);
            const hours = Math.ceil(minutes / 60);

            let timeMessage;
            if (minutes < 60) {
                timeMessage = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                timeMessage = `${hours} hour${hours !== 1 ? 's' : ''}`;
            }

            res.status(429).json({
                success: false,
                error: `You've reached your limit of ${maxRequests} batch processes per ${windowMinutes >= 60 ? Math.round(windowMinutes / 60) + ' hour' : windowMinutes + ' minutes'}. Please try again in ${timeMessage}.`,
                retryAfter: retryAfter,
                limit: maxRequests,
                remaining: 0
            });
        },

        keyGenerator: (req) => {
            return req.ip || req.connection.remoteAddress;
        }
    });
};



// Different rate limit presets

export const RateLimitPresets = {
    VERY_STRICT: createCustomRateLimiter({
        windowMinutes: 5,
        maxRequests: 3,
        message: 'Rate limit exceeded'
    }),

    STRICT: createCustomRateLimiter({
        windowMinutes: 60,
        maxRequests: 5,
        message: 'Rate limit exceeded'
    }),

    MODERATE: createCustomRateLimiter({
        windowMinutes: 60,
        maxRequests: 10,
        message: 'Rate limit exceeded'
    }),

    LENIENT: createCustomRateLimiter({
        windowMinutes: 60,
        maxRequests: 20,
        message: 'Rate limit exceeded'
    }),

    DAILY: createCustomRateLimiter({
        windowMinutes: 24 * 60, // 24 hours
        maxRequests: 50,
        message: 'Daily rate limit exceeded'
    })
};