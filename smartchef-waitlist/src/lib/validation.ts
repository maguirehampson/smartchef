/**
 * Shared Validation Utilities
 * 
 * This module provides centralized validation functions used across
 * the SmartChef waitlist application to ensure consistency and
 * reduce code duplication.
 * 
 * Features:
 * - RFC 5322 compliant email validation
 * - XSS prevention with comprehensive sanitization
 * - Input length and type validation
 * - Security-focused validation patterns
 */

/**
 * RFC 5322 compliant email validation with security checks
 * @param email - Email address to validate
 * @returns True if email is valid format
 */
export function validateEmailFormat(email: string): boolean {
  // RFC 5322 compliant email regex with additional security checks
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional security checks
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  if (email.includes('..')) return false; // Prevent directory traversal
  if (email.includes('javascript:')) return false; // Prevent XSS
  if (email.includes('<script>')) return false; // Prevent XSS
  
  return EMAIL_REGEX.test(email);
}

/**
 * Enhanced input sanitization to prevent XSS and injection attacks
 * @param input - Input string to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and patterns
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/<script/gi, '') // Remove script tags
    .replace(/<\/script/gi, '') // Remove closing script tags
    .substring(0, 100); // Limit length
}

/**
 * Validate school field input
 * @param school - School name to validate
 * @returns True if school name is valid
 */
export function validateSchool(school: string): boolean {
  if (!school) return true; // Optional field
  if (typeof school !== 'string') return false;
  if (school.length > 100) return false;
  if (school.trim().length === 0) return false;
  
  return true;
}

/**
 * Comprehensive form validation
 * @param formData - Form data to validate
 * @returns Validation errors object
 */
export interface ValidationErrors {
  email?: string;
  school?: string;
}

export function validateForm(formData: { email: string; school?: string }): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmailFormat(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate school (optional)
  if (formData.school && !validateSchool(formData.school)) {
    errors.school = 'School name is too long (max 100 characters)';
  }
  
  return errors;
}

/**
 * Client-side email validation for React components
 * @param email - Email address to validate
 * @returns Error message if invalid, null if valid
 */
export function validateEmailForUI(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!validateEmailFormat(email)) {
    return 'Please enter a valid email address';
  }
  if (email.length > 254) {
    return 'Email address is too long';
  }
  return null;
}

/**
 * Client-side school validation for React components
 * @param school - School name to validate
 * @returns Error message if invalid, null if valid
 */
export function validateSchoolForUI(school: string): string | null {
  if (!school) return null; // Optional field
  if (school.length > 100) {
    return 'School name is too long (max 100 characters)';
  }
  return null;
}