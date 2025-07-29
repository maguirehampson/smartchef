/**
 * Savr Waitlist Signup API Route
 * 
 * This API route handles form submission to MailerLite API with proper error handling,
 * duplicate submission prevention, and environment variable configuration.
 * 
 * Requirements covered:
 * - 2.2: Send email to MailerLite API for storage
 * - 2.3: Redirect handled by client after successful response
 * - 2.4: Return error responses for client to display
 * - 2.6: Duplicate submission prevention handled by client
 * - 5.3: Environment variable configuration for API keys
 * - 5.6: Abstract sensitive values into .env variables
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware, addRateLimitHeaders } from '../../../lib/rateLimit';
import { validateEmailFormat, sanitizeInput } from '../../../lib/validation';
import { createLogger } from '../../../lib/logger';

// Configuration constants
const MAILERLITE_API_BASE_URL = 'https://api.mailerlite.com/api/v2';

// Error types for consistent error handling
const ERROR_TYPES = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  MISSING_CONFIG: 'MISSING_CONFIG',
  API_ERROR: 'API_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

// Request body interface
interface SignupRequest {
  email: string;
  school?: string;
}

// MailerLite API interfaces
interface MailerLiteSubscriber {
  email: string;
  fields?: {
    school?: string;
  };
  groups?: string[];
}

interface MailerLiteResponse {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
}

// Create logger for this module
const logger = createLogger('SignupAPI');

/**
 * Validates environment variables with proper format checking
 * @returns Configuration object with API credentials
 */
function validateEnvironmentVariables() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  
  // Check if environment variables exist
  if (!apiKey || !groupId) {
    logger.error('Missing required environment variables');
    throw new Error(ERROR_TYPES.MISSING_CONFIG);
  }
  
  // Check for placeholder values
  if (apiKey.startsWith('TODO_') || groupId.startsWith('TODO_')) {
    logger.error('Environment variables contain placeholder values');
    throw new Error(ERROR_TYPES.MISSING_CONFIG);
  }
  
  // Validate API key format (should be a reasonable length)
  if (apiKey.length < 10 || apiKey.length > 100) {
    logger.error('Invalid API key format');
    throw new Error(ERROR_TYPES.MISSING_CONFIG);
  }
  
  // Validate group ID format (should be numeric)
  if (!/^\d+$/.test(groupId)) {
    logger.error('Invalid group ID format');
    throw new Error(ERROR_TYPES.MISSING_CONFIG);
  }
  
  return { apiKey, groupId };
}

/**
 * Gets environment variables with validation
 * @returns Configuration object with API credentials
 */
function getConfig() {
  try {
    return validateEnvironmentVariables();
  } catch (error) {
    // Log generic error without exposing sensitive data
    logger.error('MailerLite API configuration validation failed');
    throw error;
  }
}

/**
 * Makes API request to MailerLite to add subscriber with enhanced security
 * @param subscriberData - Subscriber information
 * @returns API response
 */
async function addSubscriberToMailerLite(subscriberData: SignupRequest): Promise<MailerLiteResponse> {
  const config = getConfig();
  
  const requestBody: MailerLiteSubscriber = {
    email: subscriberData.email,
    fields: {},
    groups: [config.groupId]
  };

  // Add optional school field if provided
  if (subscriberData.school) {
    requestBody.fields!.school = subscriberData.school;
  }

  try {
    const response = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': config.apiKey,
        'Accept': 'application/json',
        'User-Agent': 'Savr-Waitlist/1.0'
      },
      body: JSON.stringify(requestBody),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    // Handle different response status codes
    if (response.status === 429) {
      logger.warn('Rate limit exceeded for MailerLite API');
      throw new Error(ERROR_TYPES.RATE_LIMITED);
    }

    if (response.status === 400) {
      const errorData = await response.json();
      // Check if it's a duplicate email error
      if (errorData.error && errorData.error.message && 
          errorData.error.message.includes('already exists')) {
        logger.info('Duplicate email attempt', { email: subscriberData.email.substring(0, 5) + '***' });
        throw new Error(ERROR_TYPES.DUPLICATE_EMAIL);
      }
      logger.error('MailerLite API validation error', errorData);
      throw new Error(ERROR_TYPES.API_ERROR);
    }

    if (!response.ok) {
      logger.error('MailerLite API error', { status: response.status });
      throw new Error(ERROR_TYPES.API_ERROR);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('MailerLite API request timeout');
      throw new Error(ERROR_TYPES.NETWORK_ERROR);
    }
    throw error;
  }
}

/**
 * POST handler for signup form submission with enhanced security
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse request body with size limit
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'INVALID_CONTENT_TYPE', message: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body: SignupRequest = await request.json();
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: ERROR_TYPES.INVALID_EMAIL, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const email = sanitizeInput(body.email);
    const school = body.school ? sanitizeInput(body.school) : undefined;

    // Validate email format
    if (!validateEmailFormat(email)) {
      return NextResponse.json(
        { error: ERROR_TYPES.INVALID_EMAIL, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate school field length if provided
    if (school && school.length > 100) {
      return NextResponse.json(
        { error: 'INVALID_SCHOOL', message: 'School name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Submit to MailerLite API
    const subscriberData = { email, school };
    const response = await addSubscriberToMailerLite(subscriberData);

    // Log successful signup (without sensitive data)
    logger.info('Successful signup', { 
      emailDomain: email.split('@')[1],
      hasSchool: !!school,
      subscriberId: response.id 
    });

    // Create success response
    const successResponse = NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      subscriber_id: response.id
    });

    // Add rate limit headers to successful response
    addRateLimitHeaders(successResponse, request);

    return successResponse;

  } catch (error) {
    logger.error('Signup API error', error);

    // Handle different error types
    if (error instanceof Error) {
      switch (error.message) {
        case ERROR_TYPES.MISSING_CONFIG:
          return NextResponse.json(
            { error: ERROR_TYPES.MISSING_CONFIG, message: 'Service temporarily unavailable. Please try again later.' },
            { status: 500 }
          );
        
        case ERROR_TYPES.DUPLICATE_EMAIL:
          return NextResponse.json(
            { error: ERROR_TYPES.DUPLICATE_EMAIL, message: 'This email is already on our waitlist!' },
            { status: 400 }
          );
        
        case ERROR_TYPES.RATE_LIMITED:
          return NextResponse.json(
            { error: ERROR_TYPES.RATE_LIMITED, message: 'Too many requests. Please wait a moment and try again.' },
            { status: 429 }
          );
        
        case ERROR_TYPES.NETWORK_ERROR:
          return NextResponse.json(
            { error: ERROR_TYPES.NETWORK_ERROR, message: 'Connection timeout. Please try again.' },
            { status: 500 }
          );
        
        case ERROR_TYPES.API_ERROR:
        default:
          return NextResponse.json(
            { error: ERROR_TYPES.API_ERROR, message: 'Something went wrong. Please try again later.' },
            { status: 500 }
          );
      }
    }

    // Fallback error response
    return NextResponse.json(
      { error: ERROR_TYPES.API_ERROR, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
    { status: 405 }
  );
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://savr-waitlist.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}