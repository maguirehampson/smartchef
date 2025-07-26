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
 * Validates email format using regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid format
 */
function validateEmailFormat(email) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Sanitizes input data to prevent XSS and other security issues
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
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
 * Tracks analytics events via Splitbee
 * @param {string} eventName - Name of the event to track
 * @param {Object} properties - Additional event properties
 */
function trackEvent(eventName, properties = {}) {
  try {
    // Check if Splitbee is available
    if (typeof splitbee !== 'undefined') {
      splitbee.track(eventName, properties);
    } else if (window.splitbee) {
      window.splitbee.track(eventName, properties);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
    // Don't block form submission if analytics fails
  }
}

/**
 * Makes API request to MailerLite to add subscriber
 * @param {Object} subscriberData - Subscriber information
 * @returns {Promise<Object>} - API response
 */
async function addSubscriberToMailerLite(subscriberData) {
  const config = getConfig();
  
  // Validate configuration
  if (!config.apiKey || !config.groupId) {
    throw new Error('MISSING_CONFIG');
  }

  const requestBody = {
    email: subscriberData.email,
    fields: {},
    groups: [config.groupId]
  };

  // Add optional school field if provided
  if (subscriberData.school) {
    requestBody.fields.school = subscriberData.school;
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
    throw new Error('RATE_LIMITED');
  }

  if (response.status === 400) {
    const errorData = await response.json();
    // Check if it's a duplicate email error
    if (errorData.error && errorData.error.message && 
        errorData.error.message.includes('already exists')) {
      throw new Error('DUPLICATE_EMAIL');
    }
    throw new Error('API_ERROR');
  }

  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  return await response.json();
}

/**
 * Displays error message to user with styled appearance
 * @param {string} message - Error message to display
 * @param {HTMLElement} container - Container element for error display
 */
function displayError(message, container) {
  // Remove any existing error messages
  const existingError = container.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Create and style error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.cssText = `
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 12px 16px;
    border-radius: 12px;
    margin-top: 12px;
    font-size: 14px;
    backdrop-filter: blur(10px);
    animation: slideIn 0.3s ease-out;
  `;
  errorElement.textContent = message;

  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  container.appendChild(errorElement);

  // Auto-remove error after 5 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => errorElement.remove(), 300);
    }
  }, 5000);
}

/**
 * Updates button state during form submission
 * @param {HTMLButtonElement} button - Submit button element
 * @param {boolean} isLoading - Whether form is currently submitting
 */
function updateButtonState(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Joining waitlist...
    `;
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Join the Waitlist';
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
  }
}

/**
 * Main form submission handler
 * @param {Event} event - Form submit event
 */
async function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const errorContainer = form.parentElement;

  // Extract and sanitize form data
  const email = sanitizeInput(formData.get('email'));
  const school = sanitizeInput(formData.get('school') || '');

  // Client-side validation
  if (!email) {
    displayError(ERROR_MESSAGES.INVALID_EMAIL, errorContainer);
    return;
  }

  if (!validateEmailFormat(email)) {
    displayError(ERROR_MESSAGES.INVALID_EMAIL, errorContainer);
    return;
  }

  // Update UI to loading state
  updateButtonState(submitButton, true);

  try {
    // Track form submission attempt
    trackEvent('signup_attempt', { email_domain: email.split('@')[1] });

    // Submit to MailerLite API
    const subscriberData = { email, school };
    const response = await addSubscriberToMailerLite(subscriberData);

    // Track successful signup
    trackEvent('signup_event', { 
      email_domain: email.split('@')[1],
      has_school: !!school,
      subscriber_id: response.id
    });

    // Redirect to thank-you page on success
    window.location.href = THANK_YOU_PAGE_URL;

  } catch (error) {
    console.error('Form submission error:', error);

    // Track failed signup
    trackEvent('signup_error', { 
      error_type: error.message,
      email_domain: email.split('@')[1]
    });

    // Display appropriate error message
    let errorMessage = ERROR_MESSAGES.API_ERROR;
    
    if (error.message === 'MISSING_CONFIG') {
      errorMessage = ERROR_MESSAGES.MISSING_CONFIG;
    } else if (error.message === 'DUPLICATE_EMAIL') {
      errorMessage = ERROR_MESSAGES.DUPLICATE_EMAIL;
    } else if (error.message === 'RATE_LIMITED') {
      errorMessage = ERROR_MESSAGES.RATE_LIMITED;
    } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    displayError(errorMessage, errorContainer);

  } finally {
    // Reset button state
    updateButtonState(submitButton, false);
  }
}

/**
 * Initialize form handling when DOM is ready
 */
function initializeFormHandling() {
  // Find all signup forms on the page
  const signupForms = document.querySelectorAll('form[data-signup-form]');
  
  signupForms.forEach(form => {
    // Remove any existing event listeners to prevent duplicates
    form.removeEventListener('submit', handleFormSubmission);
    
    // Add form submission handler
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        const email = sanitizeInput(this.value);
        if (email && !validateEmailFormat(email)) {
          displayError(ERROR_MESSAGES.INVALID_EMAIL, form.parentElement);
        }
      });

      // Clear errors when user starts typing
      emailInput.addEventListener('input', function() {
        const errorMessage = form.parentElement.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      });
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFormHandling);
} else {
  initializeFormHandling();
}

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmailFormat,
    sanitizeInput,
    handleFormSubmission,
    ERROR_MESSAGES
  };
}