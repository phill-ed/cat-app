import { RateLimiterMemory } from "rate-limiter-flexible"

// Rate limiter for API routes
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

// Stricter limiter for auth endpoints
const authRateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // Per 15 minutes
})

export async function checkRateLimit(
  identifier: string,
  type: "api" | "auth" = "api"
): Promise<{ success: boolean; remaining?: number; retryAfter?: number }> {
  const limiter = type === "auth" ? authRateLimiter : rateLimiter

  try {
    const res = await limiter.consume(identifier)
    return {
      success: true,
      remaining: res.remainingPoints
    }
  } catch (retryAfter) {
    return {
      success: false,
      retryAfter: retryAfter as number
    }
  }
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
}

// Validate and sanitize object
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  allowedFields: string[]
): Partial<T> {
  const sanitized: Partial<T> = {}
  
  for (const key of allowedFields) {
    if (obj[key] !== undefined) {
      const value = obj[key]
      if (typeof value === "string") {
        sanitized[key] = sanitizeInput(value) as T[keyof T]
      } else {
        sanitized[key] = value
      }
    }
  }
  
  return sanitized
}

// Security headers for responses
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  }
}
