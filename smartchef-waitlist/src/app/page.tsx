/**
 * Savr Waitlist Landing Page
 *
 * This is the main landing page component for the Savr waitlist application.
 * It provides a comprehensive marketing experience with animated sections, interactive
 * chat demo, email signup form, and analytics tracking.
 * 
 * Key Features:
 * - Responsive design optimized for mobile, tablet, and desktop
 * - Animated background effects using Framer Motion
 * - Interactive chat demo with rotating message sets
 * - Email signup form with client-side validation
 * - Splitbee analytics integration for conversion tracking
 * - Smooth scroll navigation between sections
 * - Performance optimized with Next.js best practices
 * 
 * Requirements covered:
 * - 1.1: Complete Savr landing page with all sections
 * - 1.2: Responsive design for all device sizes
 * - 1.3: Smooth animations and transitions
 * - 1.4: Smooth scroll navigation
 * - 1.5: Performance optimization for <1.5s load time
 * - 2.1: Email format validation
 * - 2.5: Client-side validation with error display
 * - 3.1: Splitbee pageView tracking (automatic)
 * - 3.2: signup_event tracking for successful submissions
 * - 3.3: cta_click tracking for call-to-action buttons
 * - 3.4: Splitbee script inclusion
 * - 5.4: TypeScript for type safety
 * 
 * @author Savr Team
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Script from 'next/script';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Zap, 
  Users, 
  ArrowRight, 
  Target, 
  Sparkles,
  Play
} from 'lucide-react';
import { validateEmailForUI, validateSchoolForUI } from '../lib/validation';

// Lazy load non-critical components for better performance
const LazyTargetAudienceSection = lazy(() => import('./components/TargetAudienceSection'));

/**
 * TypeScript interfaces for component state and data structures
 * These interfaces ensure type safety throughout the component
 */

/**
 * Represents a single message in the chat demo
 * @interface DemoMessage
 */
interface DemoMessage {
  /** The type of message sender - either user input or bot response */
  type: 'user' | 'bot';
  /** The actual message content to display */
  text: string;
}

/**
 * State management interface for the signup form
 * @interface SignupFormState
 */
interface SignupFormState {
  /** User's email address input */
  email: string;
  /** Optional school/university field */
  school: string;
  /** Whether the form has been successfully submitted */
  isSubmitted: boolean;
  /** Loading state during API submission */
  isLoading: boolean;
  /** Error message to display to user, null if no error */
  error: string | null;
}

/**
 * Form validation error messages
 * @interface FormValidationErrors
 */
interface FormValidationErrors {
  /** Email validation error message */
  email?: string;
  /** School field validation error message */
  school?: string;
}

/**
 * Clean form data structure for API submission
 * @interface FormData
 */
interface FormData {
  /** Validated email address */
  email: string;
  /** Optional school field, undefined if not provided */
  school?: string;
}

/**
 * Extend the global Window interface to include Splitbee analytics
 * This allows TypeScript to recognize the splitbee object on window
 */
declare global {
  interface Window {
    splitbee?: {
      /** Track analytics events with optional properties */
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

/**
  * Savr Landing Page Component
 *
 * Main React component that renders the complete Savr waitlist landing page.
 * Handles user interactions, form submission, analytics tracking, and animated UI elements.
 * 
 * Component Architecture:
 * - Uses React hooks for state management (useState, useEffect)
 * - Integrates Framer Motion for smooth animations
 * - Implements client-side form validation
 * - Tracks user interactions with Splitbee analytics
 * - Responsive design with Tailwind CSS
 * 
 * Data Flow:
 * 1. User interacts with form or CTA buttons
 * 2. Client-side validation occurs before submission
 * 3. API call made to Next.js API route (/api/signup)
 * 4. Analytics events tracked throughout user journey
 * 5. Success/error states managed and displayed to user
 * 
 * @returns {JSX.Element} The complete landing page with all sections
 */
export default function SavrLandingPage() {
  // Configuration constants
  /** Initial signup count displayed in hero section for social proof */
  const initialSignupCount = 2847;
  
  /**
   * Demo message sets for the interactive chat demonstration
   * 
   * These message sets showcase Savr's contextual understanding by
   * demonstrating different user scenarios and appropriate AI responses.
   * Each set represents a complete conversation flow that highlights
   * the product's ability to understand mood, budget, and context.
   * 
   * Message Set Themes:
   * 1. Hungover Sunday - Low energy, limited budget comfort food
   * 2. Finals stress - Student budget, brain food needs
   * 3. Date night - Nervous cooking, impressive but simple
   * 4. Happy mood - Adventurous cooking, trying something new
   * 
   * Uses React.useMemo for performance optimization to prevent
   * unnecessary re-creation of message arrays on each render.
   */
  const demoMessageSets: DemoMessage[][] = React.useMemo(() => [
    [
      { type: 'user', text: "It's Sunday, I'm hungover, I've got $10 and no energy 😵‍💫" },
      { type: 'bot', text: "Gotcha. Comfort food that won't wreck you. How about crispy rice with egg + sriracha? 15 mins, $8 total 🍳" },
      { type: 'user', text: "that sounds perfect actually" },
      { type: 'bot', text: "Sending you the recipe + grocery list. Pro tip: get extra eggs for tomorrow's hangover breakfast 🥚✨" }
    ],
    [
      { type: 'user', text: "I'm stressed about finals and have $5 left until Friday 😭" },
      { type: 'bot', text: "Finals fuel mode activated! Peanut butter banana toast + coffee = brain food under $3. Want the recipe? ☕📚" },
      { type: 'user', text: "yes please, I need all the help I can get" },
      { type: 'bot', text: "Sent! Plus a study snack playlist. You've got this - one bite and one page at a time 💪✨" }
    ],
    [
      { type: 'user', text: "Date night but I can't cook and I'm nervous 😅" },
      { type: 'bot', text: "Romantic + foolproof = pasta aglio e olio. 4 ingredients, looks fancy, impossible to mess up 🍝❤️" },
      { type: 'user', text: "wait that actually sounds doable" },
      { type: 'bot', text: "Trust me on this one! Sending the recipe + playlist. They'll think you're a culinary genius 😉🎵" }
    ],
    [
      { type: 'user', text: "I'm happy today and want to try something new! 🌟" },
      { type: 'bot', text: "Love the energy! How about Korean corn dogs? Crispy, cheesy, and totally Instagram-worthy 📸✨" },
      { type: 'user', text: "omg yes that sounds amazing" },
      { type: 'bot', text: "Recipe incoming! Fair warning: you might become obsessed. Don't say I didn't warn you 😄🧀" }
    ]
  ], []);

  /**
   * Validates entire form data and returns all errors
   * @param {FormData} formData - Form data to validate
   * @returns {FormValidationErrors} Object containing all validation errors
   */
  const validateForm = (formData: FormData): FormValidationErrors => {
    const errors: FormValidationErrors = {};
    
    const emailError = validateEmailForUI(formData.email);
    if (emailError) errors.email = emailError;
    
    const schoolError = validateSchoolForUI(formData.school || '');
    if (schoolError) errors.school = schoolError;
    
    return errors;
  };

  /**
   * Component State Management
   * 
   * All state variables use TypeScript interfaces for type safety
   * and are managed with React hooks for optimal performance.
   */

  /** Main signup form state including input values and submission status */
  const [signupForm, setSignupForm] = useState<SignupFormState>({
    email: '',
    school: '',
    isSubmitted: false,
    isLoading: false,
    error: null
  });

  /** Form validation errors displayed to user in real-time */
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});

  /** Current demo message set index (0-3) for rotation */
  const [currentDemoSet, setCurrentDemoSet] = useState(0);

  /** Current message index within the active demo set */
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  /** Dynamic signup count for social proof (increments on successful signup) */
  const [signupCount, setSignupCount] = useState(initialSignupCount);

  /** Client-side rendering flag to prevent hydration mismatches */
  const [isClient, setIsClient] = useState(false);

  /** Typing indicator state for bot messages in chat demo */
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Client-side rendering effect
   * 
   * Ensures that dynamic content (like rotating messages) only renders
   * on the client side to prevent hydration mismatches between server
   * and client rendering. This is crucial for Next.js SSR compatibility.
   */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Demo message rotation effect with typing animation
   * 
   * Manages the automatic rotation of chat demo messages to showcase
   * different user scenarios. Includes typing indicators for bot responses
   * to create a more realistic chat experience.
   * 
   * Timing Strategy:
   * - 3.5 second intervals between messages for readability
   * - 800ms typing indicator for bot responses
   * - Automatic progression through all message sets
   * 
   * Performance Considerations:
   * - Only runs on client side (isClient check)
   * - Cleans up interval on component unmount
   * - Dependencies array prevents unnecessary re-runs
   */
  useEffect(() => {
    if (!isClient) return;
    
    const currentMessages = demoMessageSets[currentDemoSet];
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        // If we've shown all messages in current set, move to next set
        if (nextIndex >= currentMessages.length) {
          setCurrentDemoSet((prevSet) => (prevSet + 1) % demoMessageSets.length);
          return 0;
        }
        
        // Show typing indicator for bot messages to simulate real chat
        if (currentMessages[nextIndex]?.type === 'bot') {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 800);
        }
        
        return nextIndex;
      });
    }, 3500); // 3.5 second interval optimized for reading comprehension
    
    // Cleanup interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [currentDemoSet, isClient, demoMessageSets]);

  /**
   * Form submission handler
   * 
   * Handles the complete form submission flow including validation,
   * API communication, analytics tracking, and user feedback.
   * 
   * Submission Flow:
   * 1. Prevent default form submission behavior
   * 2. Clear any previous validation errors
   * 3. Sanitize and validate form data
   * 4. Display validation errors if any exist
   * 5. Set loading state and make API call
   * 6. Handle API response (success/error)
   * 7. Track analytics events
   * 8. Update UI with appropriate feedback
   * 9. Redirect to thank-you page on success
   * 
   * Error Handling:
   * - Client-side validation errors (displayed immediately)
   * - Network connectivity issues
   * - API rate limiting (429 status)
   * - Duplicate email detection (400 status)
   * - Server configuration issues (500 status)
   * 
   * Analytics Tracking:
   * - signup_event: Successful form submissions
   * - signup_error: Failed submissions with error details
   * 
   * Security Considerations:
   * - Input sanitization (trim whitespace)
   * - XSS prevention through proper data handling
   * - Rate limiting handled by API layer
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors to start fresh
    setValidationErrors({});
    
    // Sanitize and prepare form data for validation
    const formData: FormData = {
      email: signupForm.email.trim(),
      school: signupForm.school.trim() || undefined
    };
    
    // Run client-side validation
    const errors = validateForm(formData);
    
    // If validation fails, display errors and prevent submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Set loading state and clear any previous errors
    setSignupForm(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Make API call to Next.js API route for MailerLite integration
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          school: formData.school
        }),
      });

      const result = await response.json();

      // Handle non-successful responses with specific error messages
      if (!response.ok || !result.success) {
        let errorMessage = 'Something went wrong. Please try again.';
        
        // Provide specific error messages based on response status and error type
        if (response.status === 400 && result.error === 'DUPLICATE_EMAIL') {
          errorMessage = 'This email is already on our waitlist!';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status === 500 && result.error === 'MISSING_CONFIG') {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (!navigator.onLine) {
          errorMessage = 'Connection issue. Please check your internet and try again.';
        } else if (result.error) {
          errorMessage = result.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      // Track successful signup with detailed analytics
      if (typeof window !== 'undefined' && window.splitbee) {
        window.splitbee.track('signup_event', {
          email_domain: formData.email.split('@')[1], // Track domain for insights
          has_school: !!formData.school, // Track if school field was filled
          subscriber_id: result.subscriber_id // Track MailerLite subscriber ID
        });
      }
      
      // Update UI to success state
      setSignupForm(prev => ({ ...prev, isSubmitted: true, isLoading: false }));
      setSignupCount(prev => prev + 1); // Increment social proof counter
      
    } catch (error) {
      // Track failed signup attempts for debugging and optimization
      if (typeof window !== 'undefined' && window.splitbee) {
        window.splitbee.track('signup_error', {
          error_type: error instanceof Error ? error.message : 'unknown',
          email_domain: formData.email.split('@')[1]
        });
      }
      
      // Update UI with error state and user-friendly message
      setSignupForm(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      }));
    }
  };
  
  /**
   * Input change handlers
   * 
   * These handlers manage form input changes and provide real-time
   * user experience improvements by clearing validation errors as
   * the user types, indicating that they're addressing the issue.
   */

  /**
   * Handles email input changes and clears related validation errors
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupForm(prev => ({ ...prev, email: value }));
    
    // Clear email validation error when user starts typing
    // This provides immediate feedback that they're addressing the issue
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
  };
  
  /**
   * Handles school input changes and clears related validation errors
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupForm(prev => ({ ...prev, school: value }));
    
    // Clear school validation error when user starts typing
    if (validationErrors.school) {
      setValidationErrors(prev => ({ ...prev, school: undefined }));
    }
  };

  /**
   * Analytics tracking helper function
   * 
   * Centralized function for tracking call-to-action button clicks
   * throughout the landing page. Provides consistent event structure
   * and handles cases where analytics might not be available.
   * 
   * @param {string} buttonName - Unique identifier for the button clicked
   * @param {string} section - Page section where the button is located
   * @param {Record<string, unknown>} additionalProps - Optional additional event properties
   */
  const trackCTAClick = (buttonName: string, section: string, additionalProps?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('cta_click', { 
        button_name: buttonName,
        section: section,
        ...additionalProps
      });
    }
  };

  /**
   * Analytics tracking helper for CTA clicks
   * 
   * Handles tracking of call-to-action button clicks throughout the page.
   * Since the signup form is now in the header, we don't need to scroll.
   * 
   * @param {string} buttonName - Identifier for analytics tracking
   * @param {string} section - Section where the CTA was clicked
   */
  const handleCTAClick = (buttonName = 'join_waitlist_hero', section = 'hero') => {
    // Track CTA click event for conversion analysis
    trackCTAClick(buttonName, section);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Enhanced Animated Background Effects with Multiple Blur Layers */}
      <div className="fixed inset-0 opacity-40">
        {/* Base gradient layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 animate-gradient-xy"></div>
        
        {/* Multiple animated blur layers */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-gradient-radial from-pink-500/25 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.5, 0.25],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Additional floating blur elements */}
        <motion.div 
          className="absolute top-3/4 right-1/3 w-32 h-32 md:w-48 md:h-48 bg-gradient-radial from-cyan-500/15 to-transparent rounded-full blur-2xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 30, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute top-1/6 left-2/3 w-24 h-24 md:w-36 md:h-36 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -25, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Enhanced Hero Section with Advanced Animations */}
        <section className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 pt-40 sm:pt-64 relative">
          <div className="max-w-6xl mx-auto text-center">
            {/* Header with Logo and Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8 sm:mb-12"
            >
              <motion.div 
                className="flex items-center justify-center h-16 px-4 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.img
                  src="/savr-logo.png"
                  alt="Savr - AI That Gets Why You Eat"
                  className="w-[360px] h-[360px]"
                  animate={{ 
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
              
              {/* Main Headline with Word-by-Word Animation */}
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  The first AI that gets{' '}
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  why you eat
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  the way you do.
                </motion.span>
              </motion.h2>
              
              {/* Subheadline with Emotional Words Animation */}
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                You&apos;re not just hungry. You&apos;re{' '}
                <motion.em 
                  className="text-red-400"
                  animate={{ 
                    color: ["#f87171", "#ef4444", "#dc2626", "#f87171"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  tired
                </motion.em>
                . You&apos;re{' '}
                <motion.em 
                  className="text-orange-400"
                  animate={{ 
                    color: ["#fb923c", "#f97316", "#ea580c", "#fb923c"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  broke
                </motion.em>
                . You&apos;re{' '}
                <motion.em 
                  className="text-blue-400"
                  animate={{ 
                    color: ["#60a5fa", "#3b82f6", "#2563eb", "#60a5fa"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                >
                  stressed
                </motion.em>
                .<br />
                <motion.span 
                  className="text-white font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                >
                  Let&apos;s cook for that.
                </motion.span>
              </motion.p>

              {/* Badge with Floating Animation */}
              <motion.div 
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium backdrop-blur-sm rounded-full inline-flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -5, 0]
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 2.2 },
                  scale: { duration: 0.6, delay: 2.2 },
                  y: { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                </motion.div>
                Contextual Culinary Intelligence
              </motion.div>

              {/* Waitlist Form in Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
                className="mb-8 sm:mb-12 max-w-md mx-auto"
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <form onSubmit={handleSubmit} data-signup-form className="space-y-4 sm:space-y-6">
                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={handleEmailChange}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-base sm:text-lg backdrop-blur-sm transition-colors duration-200 ${
                          validationErrors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-white/20 focus:ring-purple-500'
                        }`}
                        disabled={signupForm.isLoading}
                        aria-invalid={!!validationErrors.email}
                        aria-describedby={validationErrors.email ? 'email-error' : undefined}
                      />
                      {validationErrors.email && (
                        <motion.p
                          id="email-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-red-400 text-sm font-medium"
                        >
                          {validationErrors.email}
                        </motion.p>
                      )}
                    </div>
                    
                    {/* School Input */}
                    <div>
                      <input
                        type="text"
                        name="school"
                        placeholder="School (optional)"
                        value={signupForm.school}
                        onChange={handleSchoolChange}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-base sm:text-lg backdrop-blur-sm transition-colors duration-200 ${
                          validationErrors.school 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-white/20 focus:ring-purple-500'
                        }`}
                        disabled={signupForm.isLoading}
                        aria-invalid={!!validationErrors.school}
                        aria-describedby={validationErrors.school ? 'school-error' : undefined}
                      />
                      {validationErrors.school && (
                        <motion.p
                          id="school-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-red-400 text-sm font-medium"
                        >
                          {validationErrors.school}
                        </motion.p>
                      )}
                    </div>
                    
                    {/* General Error Display */}
                    {signupForm.error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-medium">
                        {signupForm.error}
                      </div>
                    )}
                    
                    {/* Success Message */}
                    {signupForm.isSubmitted && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-green-400 text-sm font-medium text-center">
                        ✨ Welcome to the waitlist! You&apos;ll be the first to know when Savr is ready.
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      onClick={() => trackCTAClick('join_waitlist_header', 'hero')}
                      disabled={signupForm.isLoading || signupForm.isSubmitted}
                      className={`w-full font-semibold text-lg sm:text-xl px-8 py-4 sm:py-6 rounded-2xl shadow-2xl border-0 backdrop-blur-sm transition-all duration-300 relative overflow-hidden ${
                        signupForm.isSubmitted
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-default'
                          : signupForm.isLoading
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer shadow-purple-500/25'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {signupForm.isLoading && (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Joining...
                          </>
                        )}
                        {signupForm.isSubmitted && (
                          <>
                            <span>✨</span>
                            Welcome to the waitlist!
                          </>
                        )}
                        {!signupForm.isLoading && !signupForm.isSubmitted && (
                          <>
                            Join the Waitlist
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                </div>
              </motion.div>

            {/* Stats with Staggered Entrance */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-400 px-4"
            >
              {[
                { icon: Users, text: `${signupCount.toLocaleString()} humans waiting`, color: "text-purple-400", delay: 0 },
                { icon: Target, text: "100 beta testers needed", color: "text-pink-400", delay: 0.1 },
                { icon: Heart, text: "Free to try", color: "text-red-400", delay: 0.2 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 2.8 + stat.delay,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
                  </motion.div>
                  <span className="whitespace-nowrap">{stat.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-8 sm:mb-12 tracking-tight px-2">
                🍽️ Meals aren&apos;t made with{' '}
                <span className="line-through text-gray-500">recipes</span>
              </h2>
              
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 sm:mb-16 space-y-2 sm:space-y-4 font-light">
                <p>They&apos;re made with:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16">
                {[
                  { text: "Friday night moods", icon: "🎉", color: "from-purple-500 to-pink-500" },
                  { text: "$14 in your bank account", icon: "💸", color: "from-red-500 to-orange-500" },
                  { text: "that weird leftover rice", icon: "🍚", color: "from-yellow-500 to-orange-500" },
                  { text: "a craving you can't quite name", icon: "🤔", color: "from-blue-500 to-purple-500" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`bg-gradient-to-r ${item.color} p-3 sm:p-4 rounded-xl text-xl sm:text-2xl shadow-lg shrink-0`}>
                          {item.icon}
                        </div>
                        <span className="text-base sm:text-lg md:text-xl font-medium text-white text-left">
                          {item.text}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed">
                  Savr is your <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Contextual Culinary Intelligence</span> copilot —<br className="hidden sm:block" />
                  a personalized cooking experience that knows your <em className="text-purple-400">vibe</em>, not just your ingredients.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem/Solution */}
        <section className="py-16 sm:py-24 lg:py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-8 sm:mb-12 tracking-tight px-2">
                🤯 Old apps treat cooking like a{' '}
                <span className="line-through text-gray-500">checklist</span>
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 sm:mb-16 text-white px-2">
                We treat it like a <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">moment in your life</span>
              </h3>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-16">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 sm:mb-8 font-light leading-relaxed">
                  &quot;What should I eat?&quot; isn&apos;t a recipe question —<br className="hidden sm:block" />
                  it&apos;s a question about <span className="text-purple-400 font-medium">mood</span>, <span className="text-pink-400 font-medium">motivation</span>, <span className="text-orange-400 font-medium">money</span>, and <span className="text-blue-400 font-medium">meaning</span>.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                  Savr looks at your context — not just your fridge — and serves up food that actually fits your day.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Chat Demo Section */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-6 tracking-tight px-2">
                🔥 How it 
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> works</span>
              </h2>
            </motion.div>

            {/* Step by Step */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {[
                {
                  step: "🧠 Step 1",
                  title: "Tell Savr how you're feeling",
                  description: "\"It's Sunday, I'm hungover, I've got $10 and no energy.\"",
                  icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                },
                {
                  step: "🍜 Step 2", 
                  title: "Get a recipe that fits your real life",
                  description: "Mood-matching meals. Budget-aware. 15-min max. Zero food guilt.",
                  icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
                },
                {
                  step: "📦 Step 3",
                  title: "Grocery list? Sorted. Leftovers? Optimized.",
                  description: "Savr helps you stretch your pantry, not your wallet.",
                  icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center sm:col-span-2 lg:col-span-1 last:sm:col-start-1 last:sm:col-end-3 last:lg:col-start-auto last:lg:col-end-auto"
                >
                  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 h-full hover:bg-white/10 transition-all duration-300">
                    <div className="text-purple-400 mb-4 flex justify-center">
                      {item.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-purple-400">
                      {item.step}
                    </h3>
                    <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Interactive Chat Demo */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">Savr</h3>
                    <p className="text-purple-300 text-xs sm:text-sm">Your Contextual Culinary Intelligence</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6 h-72 sm:h-80 flex flex-col justify-end overflow-hidden">
                  {isClient ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentDemoSet}-${currentMessageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        {demoMessageSets[currentDemoSet].slice(0, currentMessageIndex + 1).map((msg, index) => (
                          <motion.div
                            key={`${currentDemoSet}-${index}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.1,
                              ease: "easeOut"
                            }}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs sm:max-w-sm px-4 sm:px-6 py-3 sm:py-4 rounded-3xl text-sm sm:text-base lg:text-lg relative ${
                                msg.type === 'user'
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/25'
                                  : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm shadow-lg'
                              }`}
                            >
                              {msg.type === 'bot' && (
                                <div className="flex items-center gap-2 mb-2">
                                  <motion.div 
                                    className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                                    animate={{ 
                                      scale: [1, 1.1, 1],
                                      rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    <Brain className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                  </motion.div>
                                  <span className="text-xs sm:text-sm text-purple-400 font-medium">Savr</span>
                                </div>
                              )}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              >
                                {msg.text}
                              </motion.div>
                              
                              {/* Message tail */}
                              <div className={`absolute top-4 ${
                                msg.type === 'user' 
                                  ? 'right-0 translate-x-1/2' 
                                  : 'left-0 -translate-x-1/2'
                              }`}>
                                <div className={`w-3 h-3 rotate-45 ${
                                  msg.type === 'user'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    : 'bg-white/10 border-l border-t border-white/20'
                                }`}></div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-start"
                          >
                            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl px-4 sm:px-6 py-3 sm:py-4 relative">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <Brain className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm text-purple-400 font-medium">Savr</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex gap-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="w-2 h-2 bg-purple-400 rounded-full"
                                      animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-400 text-sm ml-2">typing...</span>
                              </div>
                              
                              {/* Typing indicator tail */}
                              <div className="absolute top-4 left-0 -translate-x-1/2">
                                <div className="w-3 h-3 rotate-45 bg-white/10 border-l border-t border-white/20"></div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {demoMessageSets[0].slice(0, 1).map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-sm px-4 sm:px-6 py-3 sm:py-4 rounded-3xl text-sm sm:text-base lg:text-lg ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-lg'
                                : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
                            }`}
                          >
                            {msg.type === 'bot' && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <Brain className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm text-purple-400 font-medium">Savr</span>
                              </div>
                            )}
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chat Input (Visual Only) */}
              <div className="border-t border-white/10 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <span className="text-gray-400 text-sm">Try Savr yourself...</span>
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emotional Intelligence */}
        <section className="py-16 sm:py-24 lg:py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-6 sm:mb-8 tracking-tight px-2">
                💡 This isn&apos;t just cooking.
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 sm:mb-16 px-2">
                It&apos;s <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">emotional intelligence</span> — served hot.
              </h3>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 sm:mb-16">
                <h4 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white">Savr learns:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { text: "Your exam season snacks", icon: "📚", mood: "stressed" },
                    { text: "Your Sunday comfort cravings", icon: "☕", mood: "cozy" },
                    { text: "Your midnight post-party munchies", icon: "🌙", mood: "recovery" },
                    { text: "Your broke-but-healthy stretch weeks", icon: "💪", mood: "resourceful" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10"
                    >
                      <div className="text-2xl sm:text-3xl shrink-0">{item.icon}</div>
                      <span className="text-base sm:text-lg font-medium text-white text-left">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed px-2">
                We&apos;re not here to tell you what&apos;s &quot;healthy.&quot;<br />
                We&apos;re here to help you <span className="font-semibold text-purple-400">feel good</span> about what you eat — every day.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 30 Day Challenge */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium backdrop-blur-sm rounded-full inline-flex items-center">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Launching Soon
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-6 sm:mb-8 tracking-tight px-2">
                🎥 ⚡️ 30 Days of Contextual Cooking ⚡️
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-300 mb-8 sm:mb-12 font-light px-2">
                Can an AI understand your appetite better than you can?
              </p>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12">
                <p className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 leading-relaxed">
                  We&apos;re inviting <span className="font-bold text-pink-400">100 early users</span> to let Savr decide their meals for a full month —<br className="hidden sm:block" />
                  based on mood, schedule, budget, and vibe.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 font-light">
                  → Daily TikToks. Real meals. No filters. Just context-first cooking.
                </p>
              </div>

              <button 
                onClick={() => handleCTAClick('join_challenge', '30_day_challenge')}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl w-full sm:w-auto shadow-2xl shadow-red-500/25 border-0 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center"
              >
                Join the Challenge
                <Target className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Target Audience - Lazy Loaded */}
        <Suspense fallback={
          <div className="py-16 sm:py-24 px-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        }>
          <LazyTargetAudienceSection />
        </Suspense>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <img 
                src="/savr-logo.png" 
                alt="Savr Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40"
              />
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Contextual Culinary Intelligence for real life.
            </p>
          </div>
        </footer>
      </div>
      
      {/* Signup Form Handler Script */}
      <Script
        src="/scripts/signup.js"
        strategy="afterInteractive"
      />
      </div>
    </LazyMotion>
  );
}
