# Server-Side Rate Limiting Setup Guide

## Overview
This implementation provides **server-side only** rate limiting. Users won't see any indicators or counters - they'll only get an error toast when they exceed the limit.

## Quick Setup

### 1. Install Dependencies

```bash
cd multi-image-external-api
npm install express-rate-limit
```

### 2. Create Rate Limiter Middleware

Create `multi-image-external-api/middleware/rateLimiter.js` (already provided in artifacts).

### 3. Update Server

Update `multi-image-external-api/server.js` to import and use the rate limiter (already provided in artifacts).

### 4. Update Client Service

Replace your `src/services/multi-image-processing/batch-processing.service.ts` with the simplified version (already provided in artifacts).

### 5. Update Controls Component

Update the error handling in `src/components/controls/controls.tsx` (changes provided in artifacts).

## Configuration Options

### Available Presets

In `server.js`, change the rate limiter:

```javascript
// Choose one of these:
app.use('/batch-compress', RateLimitPresets.VERY_STRICT);  // 3 per 5 minutes
app.use('/batch-compress', RateLimitPresets.STRICT);       // 5 per hour
app.use('/batch-compress', RateLimitPresets.MODERATE);     // 10 per hour (default)
app.use('/batch-compress', RateLimitPresets.LENIENT);      // 20 per hour
app.use('/batch-compress', RateLimitPresets.DAILY);        // 50 per day
```

### Custom Configuration

Create your own limits in `rateLimiter.js`:

```javascript
export const customLimit = createCustomRateLimiter({
    windowMinutes: 30,        // 30 minute window
    maxRequests: 15,          // 15 requests allowed
    message: 'Custom rate limit exceeded'
});
```

Then use it in `server.js`:

```javascript
import { customLimit } from "./middleware/rateLimiter.js";
app.use('/batch-compress', customLimit);
```

## How It Works

### Server-Side
1. Tracks requests by **IP address**
2. Stores request timestamps in **memory** (or Redis for production)
3. Rejects requests with **429 status code** when limit exceeded
4. Returns time until reset in response

### Client-Side
1. Sends batch processing request
2. If rate limited (429), catches `RateLimitError`
3. Shows **toast notification** with retry time
4. **No indicators, counters, or warnings** until limit is hit

## Rate Limit Response Structure

When limit is exceeded, server returns:

```json
{
  "success": false,
  "error": "You've reached your limit of 10 batch processes per hour. Please try again in 45 minutes.",
  "retryAfter": 2700,
  "limit": 10,
  "remaining": 0
}
```

## User Experience

### Normal Flow
1. User uploads multiple images
2. User clicks "Apply Resize"
3. Processing completes
4. User downloads results
5. ✅ **No rate limit indication shown**

### When Limit Reached
1. User uploads multiple images
2. User clicks "Apply Resize"
3. ❌ **Toast appears**: "Rate limit exceeded. Please try again in 45 minutes."
4. Processing stops
5. User must wait

### Single Image Processing
- **Never rate limited**
- Processes in browser
- Always available

## Production Deployment

### Memory-Based (Current Setup)
✅ **Pros:**
- Simple setup
- No additional services needed
- Works immediately

❌ **Cons:**
- Resets when server restarts
- Doesn't work with multiple server instances
- Limited to single server scaling

**Best for:** Single server, low traffic

### Redis-Based (Recommended for Production)

#### 1. Setup Redis

**Option A: Redis Cloud (Free tier)**
- Sign up at https://redis.com/try-free/
- Get connection URL
- Add to environment variables

**Option B: Local Redis**
```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

#### 2. Install Redis Client

```bash
npm install redis rate-limit-redis
```

#### 3. Update Environment Variables

Create `.env` file:

```env
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

#### 4. Use Redis Rate Limiter

In `server.js`:

```javascript
import { createRedisRateLimiter } from "./middleware/rateLimiter.js";

// Initialize Redis rate limiter
const rateLimiter = await createRedisRateLimiter();

app.use('/batch-compress', rateLimiter);
```

✅ **Pros:**
- Persists across server restarts
- Works with multiple servers
- Horizontal scaling ready
- Better performance

## Testing

### Test Rate Limit

```bash
# Send 11 requests quickly (limit is 10)
for i in {1..11}; do
  echo "Request $i"
  curl -X POST http://localhost:3000/batch-compress \
    -F "quality=80" \
    -F "resizeStrategy=original" \
    -F "format=jpg"
done
```

Expected: First 10 succeed, 11th returns 429.

### Test in Browser

```javascript
// Run in browser console
async function testRateLimit() {
    for (let i = 1; i <= 11; i++) {
        const formData = new FormData();
        formData.append('quality', '80');
        formData.append('resizeStrategy', 'original');
        formData.append('format', 'jpg');
        
        const response = await fetch('https://your-api.com/batch-compress', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        console.log(`Request ${i}:`, response.status, data);
    }
}

testRateLimit();
```

### Reset Rate Limit (Development)

Restart the server:
```bash
# Stop server (Ctrl+C)
# Start server
npm start
```

Or with Redis:
```bash
redis-cli FLUSHDB
```

## Monitoring

### Check Rate Limit Headers

```bash
curl -I http://localhost:3000/batch-compress
```

Response headers:
```
RateLimit-Limit: 10
RateLimit-Remaining: 7
RateLimit-Reset: 1704567890
```

### Log Rate Limit Hits

Add logging to `rateLimiter.js`:

```javascript
handler: (req, res) => {
    // Log rate limit hit
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    console.log(`Retry after: ${req.rateLimit.resetTime}`);
    
    // Your existing handler code...
}
```

## Advanced Configuration

### Different Limits for Different Endpoints

```javascript
// Strict limit for batch processing
app.use('/batch-compress', RateLimitPresets.STRICT);

// Lenient limit for single image
app.use('/single-compress', RateLimitPresets.LENIENT);
```

### Skip Rate Limiting for Authenticated Users

```javascript
const rateLimiter = rateLimit({
    // ... other options
    
    skip: (req) => {
        // Skip if user has premium account
        return req.user && req.user.isPremium;
    }
});
```

### Custom Key Generator (User ID instead of IP)

```javascript
const rateLimiter = rateLimit({
    // ... other options
    
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise IP
        return req.user?.id || req.ip;
    }
});
```

### Multiple Time Windows

```javascript
// 3 requests per minute AND 20 per hour
app.use('/batch-compress', 
    createCustomRateLimiter({ windowMinutes: 1, maxRequests: 3 }),
    createCustomRateLimiter({ windowMinutes: 60, maxRequests: 20 })
);
```

## Security Considerations

### IP Spoofing Protection

Configure Express to trust proxy headers correctly:

```javascript
// In server.js
app.set('trust proxy', 1); // Trust first proxy

// Or be more specific:
app.set('trust proxy', ['loopback', 'linklocal', '123.45.67.89']);
```

### Behind Load Balancer / CDN

If using Cloudflare, AWS, etc.:

```javascript
const rateLimiter = rateLimit({
    keyGenerator: (req) => {
        // Get real IP from headers
        return req.headers['cf-connecting-ip'] || // Cloudflare
               req.headers['x-real-ip'] ||          // Nginx
               req.headers['x-forwarded-for']?.split(',')[0] || // Load balancers
               req.ip;
    }
});
```

### Rate Limit Bypass Prevention

```javascript
// Don't expose rate limit details in production
const rateLimiter = rateLimit({
    standardHeaders: process.env.NODE_ENV !== 'production',
    
    // Generic message in production
    handler: (req, res) => {
        if (process.env.NODE_ENV === 'production') {
            res.status(429).json({
                success: false,
                error: 'Too many requests. Please try again later.'
            });
        } else {
            // Detailed message in development
            res.status(429).json({
                success: false,
                error: `Rate limit exceeded. Try again in ${retryMinutes} minutes.`,
                retryAfter: req.rateLimit.retryAfter
            });
        }
    }
});
```

## Troubleshooting

### Rate Limit Not Working

**Check:**
1. Middleware is applied before route handler
2. Express is configured to trust proxy
3. IP address is being captured correctly

**Debug:**
```javascript
app.use((req, res, next) => {
    console.log('Client IP:', req.ip);
    console.log('Headers:', req.headers);
    next();
});
```

### Rate Limit Too Strict/Lenient

**Adjust preset in server.js:**
```javascript
app.use('/batch-compress', RateLimitPresets.LENIENT); // Increase
app.use('/batch-compress', RateLimitPresets.STRICT);  // Decrease
```

### Different IPs Per Request

**Issue:** Users on mobile networks get different IPs

**Solution:** Use user authentication instead of IP:
```javascript
keyGenerator: (req) => req.user?.id || req.ip
```

## Best Practices

1. ✅ **Start Conservative**: Use STRICT preset initially
2. ✅ **Monitor Usage**: Log rate limit hits
3. ✅ **Use Redis**: For production with multiple servers
4. ✅ **Clear Messages**: Explain why and when users can retry
5. ✅ **Don't Expose Details**: Hide internal limits in production
6. ✅ **Combine with Auth**: Higher limits for authenticated users
7. ✅ **Test Thoroughly**: Verify limits work as expected

## Summary

### What You Get
- ✅ Server-side IP-based rate limiting
- ✅ No client-side UI (hidden until limit reached)
- ✅ Toast notification only when limit exceeded
- ✅ Configurable time windows and request counts
- ✅ Production-ready with Redis support
- ✅ Single image processing unaffected

### What Users See
- ✅ Normal processing most of the time
- ❌ Error toast when limit reached
- ❌ No counters or indicators
- ❌ No warnings before hitting limit

This approach is **clean and non-intrusive** for users while still protecting your server resources.