/**
 * SmartChef Waitlist Signup Handler
 * 
 * This script handles form submission to MailerLite API with proper error handling,
 * duplicate submission prevention, and analytics tracking.
 * 
 * CONFIGURATION REQUIRED:
 * Before deployment, ensure the following environment variables are set in .env.local:
 * - MAILERLITE_API_KEY: Your MailerLite API key from https://app.mailerlite.com/integrations/api
 * - MAILERLITE_GROUP_ID: Your MailerLite group ID from your dashboard
 * - NEXT_PUBLIC_SPLITBEE_TOKEN: (Optional) Your Splitbee analytics token
 * 
 * Requirements covered:
 * - 2.2: Send email to MailerLite API for storage
 * - 2.3: Redirect to thank-you page on success
 * - 2.4: Display error messages on failure
 * - 2.6: Prevent duplicate submissions with button disable logic
 * - 5.3: Environment variable configuration for API keys
 * - 5.6: Abstract sensitive values into .env variables
 */

// Configuration constants
const MAILERLITE_API_BASE_URL = 'https://api.mailerlite.com/api/v2';
const THANK_YOU_PAGE_URL = '/thank-you.html';

// Error message constants for consistent user experience
const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  NETWORK_ERROR: 'Connection issue. Please try again.',
  API_ERROR: 'Something went wrong. Please try again later.',
  DUPLICATE_EMAIL: 'This email is already on our waitlist!',
  MISSING_CONFIG: 'Service temporarily unavailable. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.'
};

/**
 * RFC 5322 compliant email validation with security checks
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid format
 */
function validateEmailFormat(email) {
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
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
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
 * Gets environment variables from Next.js runtime config
 * In production, these should be set in Vercel environment variables
 * @returns {Object} - Configuration object with API credentials
 */
function getConfig() {
  // In Next.js, environment variables are available via process.env
  // For client-side access, we need to use NEXT_PUBLIC_ prefix or server-side API
  // Since this is a client-side script, we'll need to make API calls through Next.js API routes
  return {
    apiKey: process.env.MAILERLITE_API_KEY,
    groupId: process.env.MAILERLITE_GROUP_ID,
    splitbeeToken: process.env.NEXT_PUBLIC_SPLITBEE_TOKEN
  };
}

/**
 * Tracks analytics events with error handling
 * @param {string} eventName - Name of the event to track
 * @param {Object} properties - Event properties
 */
function trackAnalytics(eventName, properties = {}) {
  try {
    // Track with Splitbee if available
    if (window.splitbee) {
      window.splitbee.track(eventName, properties);
    }
    
    // Track with Vercel Analytics if available
    if (window.va) {
      window.va('event', eventName, properties);
    }
  } catch (error) {
    // Silently fail analytics tracking to not block form submission
  }
}

/**
 * Displays error message to user
 * @param {string} message - Error message to display
 * @param {string} field - Field name for specific error display
 */
function showError(message, field = null) {
  // Clear previous errors
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.remove());
  
  // Create error element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
    color: #ef4444;
    font-size: 14px;
    margin-top: 8px;
    padding: 8px 12px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    margin-bottom: 12px;
  `;
  errorDiv.textContent = message;
  
  // Insert error message
  if (field) {
    const fieldElement = document.querySelector(`[name="${field}"]`);
    if (fieldElement) {
      fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
    }
  } else {
    const form = document.querySelector('[data-signup-form]');
    if (form) {
      form.insertBefore(errorDiv, form.firstChild);
    }
  }
}

/**
 * Shows success message and redirects to thank you page
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  // Create success element
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = `
    color: #10b981;
    font-size: 14px;
    margin-top: 8px;
    padding: 8px 12px;
    background-color: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 8px;
    margin-bottom: 12px;
  `;
  successDiv.textContent = message;
  
  // Insert success message
  const form = document.querySelector('[data-signup-form]');
  if (form) {
    form.insertBefore(successDiv, form.firstChild);
  }
  
  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = THANK_YOU_PAGE_URL;
  }, 2000);
}

/**
 * Handles form submission with validation and API call
 * @param {Event} event - Form submission event
 */
async function handleSubmit(event) {
  event.preventDefault();
  
  // Get form elements
  const form = event.target;
  const emailInput = form.querySelector('[name="email"]');
  const schoolInput = form.querySelector('[name="school"]');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!emailInput || !submitButton) {
    return;
  }
  
  // Get and sanitize form data
  const email = sanitizeInput(emailInput.value);
  const school = schoolInput ? sanitizeInput(schoolInput.value) : '';
  
  // Validate email
  if (!email) {
    showError(ERROR_MESSAGES.INVALID_EMAIL, 'email');
    return;
  }
  
  if (!validateEmailFormat(email)) {
    showError(ERROR_MESSAGES.INVALID_EMAIL, 'email');
    return;
  }
  
  // Validate school field length
  if (school && school.length > 100) {
    showError('School name is too long (max 100 characters)', 'school');
    return;
  }
  
  // Disable submit button to prevent duplicate submissions
  submitButton.disabled = true;
  submitButton.textContent = 'Joining...';
  
  try {
    // Track signup attempt
    trackAnalytics('signup_attempt', {
      email_domain: email.split('@')[1],
      has_school: !!school
    });
    
    // Make API call to Next.js API route
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        school: school || undefined
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      // Handle different error types
      let errorMessage = ERROR_MESSAGES.API_ERROR;
      
      if (response.status === 400) {
        if (result.error === 'DUPLICATE_EMAIL') {
          errorMessage = ERROR_MESSAGES.DUPLICATE_EMAIL;
        } else if (result.error === 'INVALID_EMAIL') {
          errorMessage = ERROR_MESSAGES.INVALID_EMAIL;
        }
      } else if (response.status === 429) {
        errorMessage = ERROR_MESSAGES.RATE_LIMITED;
      } else if (response.status === 500) {
        if (result.error === 'MISSING_CONFIG') {
          errorMessage = ERROR_MESSAGES.MISSING_CONFIG;
        }
      }
      
      // Track signup error
      trackAnalytics('signup_error', {
        error_type: result.error || 'unknown',
        email_domain: email.split('@')[1],
        status_code: response.status
      });
      
      showError(errorMessage);
      
    } else {
      // Success - track signup event
      trackAnalytics('signup_event', {
        email_domain: email.split('@')[1],
        has_school: !!school,
        subscriber_id: result.subscriber_id
      });
      
      showSuccess('Successfully joined the waitlist! Redirecting...');
    }
    
  } catch (error) {
    // Network or other error
    trackAnalytics('signup_error', {
      error_type: 'network_error',
      email_domain: email.split('@')[1]
    });
    
    showError(ERROR_MESSAGES.NETWORK_ERROR);
    
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Join the Waitlist';
  }
}

/**
 * Initialize form handling when DOM is ready
 */
function initializeForm() {
  const form = document.querySelector('[data-signup-form]');
  
  if (form) {
    // Add submit event listener
    form.addEventListener('submit', handleSubmit);
    
    // Add input event listeners to clear errors on typing
    const emailInput = form.querySelector('[name="email"]');
    const schoolInput = form.querySelector('[name="school"]');
    
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        const errorElement = emailInput.parentNode.querySelector('.error-message');
        if (errorElement) {
          errorElement.remove();
        }
      });
    }
    
    if (schoolInput) {
      schoolInput.addEventListener('input', () => {
        const errorElement = schoolInput.parentNode.querySelector('.error-message');
        if (errorElement) {
          errorElement.remove();
        }
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeForm);
} else {
  initializeForm();
}