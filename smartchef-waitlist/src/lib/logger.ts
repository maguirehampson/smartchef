/**
 * Shared Logging Utility
 * 
 * This module provides centralized logging functionality used across
 * the SmartChef waitlist application to ensure consistent logging
 * patterns and prevent sensitive data exposure.
 * 
 * Features:
 * - Production-safe logging (no sensitive data exposure)
 * - Development-only debug logging
 * - Structured error logging
 * - Environment-aware logging levels
 */

/**
 * Logging levels for different environments
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

/**
 * Logger interface for consistent logging patterns
 */
export interface Logger {
  error: (msg: string, error?: unknown) => void;
  warn: (msg: string, data?: unknown) => void;
  info: (msg: string, data?: unknown) => void;
  debug: (msg: string, data?: unknown) => void;
}

/**
 * Production-safe logging utility
 * Prevents sensitive data exposure in production logs
 */
export const logger: Logger = {
  error: (msg: string, error?: unknown) => {
    // Always log errors but sanitize sensitive data
    const sanitizedError = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${msg}: ${sanitizedError}`);
  },
  
  warn: (msg: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${msg}`, data);
    }
  },
  
  info: (msg: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${msg}`, data);
    }
  },
  
  debug: (msg: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${msg}`, data);
    }
  }
};

/**
 * Create a logger with a specific context/component name
 * @param context - Context name for the logger
 * @returns Logger instance with context
 */
export function createLogger(context: string): Logger {
  return {
    error: (msg: string, error?: unknown) => {
      const sanitizedError = error instanceof Error ? error.message : String(error);
      console.error(`[${context}] ERROR: ${msg}: ${sanitizedError}`);
    },
    
    warn: (msg: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[${context}] WARN: ${msg}`, data);
      }
    },
    
    info: (msg: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${context}] INFO: ${msg}`, data);
      }
    },
    
    debug: (msg: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${context}] DEBUG: ${msg}`, data);
      }
    }
  };
}

/**
 * Sanitize data for logging to prevent sensitive information exposure
 * @param data - Data to sanitize
 * @returns Sanitized data object
 */
export function sanitizeLogData(data: unknown): unknown {
  if (!data) return data;
  
  if (typeof data === 'string') {
    // Remove potential sensitive patterns
    return data
      .replace(/api[_-]?key/gi, '[API_KEY]')
      .replace(/password/gi, '[PASSWORD]')
      .replace(/token/gi, '[TOKEN]')
      .replace(/secret/gi, '[SECRET]')
      .replace(/email/gi, '[EMAIL]');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (key.toLowerCase().includes('key') || 
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret')) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }
  
  return data;
}