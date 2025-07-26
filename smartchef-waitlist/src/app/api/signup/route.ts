/**
 * SmartChef Waitlist Signup API Route
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

/**
 * Validates email format using regex pattern
 * @param email - Email address to validate
 * @returns True if email is valid format
 */
function validateEmailFormat(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Sanitizes input data to prevent XSS and other security issues
 * @param input - Input string to sanitize
 * @returns Sanitized input
 */
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Gets environment variables with validation
 * @returns Configuration object with API credentials
 */
function getConfig() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  
  // Check if environment variables are properly configured
  if (!apiKey || !groupId || 
      apiKey.startsWith('TODO_') || groupId.startsWith('TODO_')) {
    console.error('MailerLite API configuration missing. Please set MAILERLITE_API_KEY and MAILERLITE_GROUP_ID in .env.local');
    throw new Error(ERROR_TYPES.MISSING_CONFIG);
  }
  
  return { apiKey, groupId };
}

/**
 * Makes API request to MailerLite to add subscriber
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

  const response = await fetch(`${MAILERLITE_API_BASE_URL}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MailerLite-ApiKey': config.apiKey,
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  // Handle different response status codes
  if (response.status === 429) {
    throw new Error(ERROR_TYPES.RATE_LIMITED);
  }

  if (response.status === 400) {
    const errorData = await response.json();
    // Check if it's a duplicate email error
    if (errorData.error && errorData.error.message && 
        errorData.error.message.includes('already exists')) {
      throw new Error(ERROR_TYPES.DUPLICATE_EMAIL);
    }
    throw new Error(ERROR_TYPES.API_ERROR);
  }

  if (!response.ok) {
    throw new Error(ERROR_TYPES.API_ERROR);
  }

  return await response.json();
}

/**
 * POST handler for signup form submission
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
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

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      subscriber_id: response.id
    });

  } catch (error) {
    console.error('Signup API error:', error);

    // Handle different error types
    if (error instanceof Error) {
      switch (error.message) {
        case ERROR_TYPES.MISSING_CONFIG:
          console.log('MailerLite configuration is missing. Please check your .env.local file.');
          return NextResponse.json(
            { error: ERROR_TYPES.MISSING_CONFIG, message: 'Service temporarily unavailable. Please check server configuration.' },
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