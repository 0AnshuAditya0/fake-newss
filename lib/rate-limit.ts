/**
 * Rate Limiting for Gemini API
 * Limits: 10 requests per minute per IP
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check if request is within rate limit
 * @param identifier - IP address or user identifier
 * @param limit - Max requests per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // No entry or expired - create new
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Within window - check limit
  if (entry.count < limit) {
    entry.count++;
    
    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
    retryAfter,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default (for development)
  return 'unknown';
}

/**
 * Get rate limit stats for monitoring
 */
export function getRateLimitStats() {
  const now = Date.now();
  const active = Array.from(rateLimitMap.entries())
    .filter(([_, entry]) => now <= entry.resetTime)
    .map(([ip, entry]) => ({
      ip: ip.slice(0, 10) + '...', // Anonymize
      count: entry.count,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }));

  return {
    totalTracked: rateLimitMap.size,
    activeClients: active.length,
    clients: active.slice(0, 10), // Top 10
  };
}
