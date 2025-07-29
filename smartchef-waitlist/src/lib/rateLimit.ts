/**
 * Rate Limiting Utility for API Endpoints
 * 
 * This module provides rate limiting functionality to prevent abuse
 * and brute force attacks on the signup API endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Maximum 5 requests per window
  message: 'Too many signup attempts. Please wait 15 minutes before trying again.',
  statusCode: 429,
};

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns Client IP address
 */
function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection remote address
  return 'unknown';
}

/**
 * Check if request is within rate limit
 * @param clientIP - Client IP address
 * @returns Rate limit status
 */
function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  // const windowStart = now - RATE_LIMIT_CONFIG.windowMs; // Unused
  
  // Get existing rate limit data
  const existing = rateLimitStore.get(clientIP);
  
  if (!existing || existing.resetTime < now) {
    // No existing data or window has expired
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  }
  
  // Check if within limit
  if (existing.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }
  
  // Increment count
  existing.count++;
  rateLimitStore.set(clientIP, existing);
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Rate limiting middleware for API routes
 * @param request - Next.js request object
 * @returns NextResponse with rate limit headers or null if allowed
 */
export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP);
  
  if (!rateLimit.allowed) {
    // Clean up old entries to prevent memory leaks
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(ip);
      }
    }
    
    return new NextResponse(
      JSON.stringify({
        error: 'RATE_LIMITED',
        message: RATE_LIMIT_CONFIG.message,
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      }),
      {
        status: RATE_LIMIT_CONFIG.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  return null;
}

/**
 * Add rate limit headers to successful responses
 * @param response - NextResponse to modify
 * @param request - Original request for IP detection
 */
export function addRateLimitHeaders(response: NextResponse, request: NextRequest): void {
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP);
  
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}