/**
 * Analytics Integration for SmartChef Waitlist
 * 
 * This module provides unified analytics tracking across multiple platforms
 * (Vercel Analytics + Splitbee) with proper error handling and type safety.
 * 
 * Requirements covered:
 * - 3.1: Splitbee pageView tracking (automatic)
 * - 3.2: signup_event tracking for successful submissions
 * - 3.3: cta_click tracking for call-to-action buttons
 * - 3.4: Splitbee script inclusion
 */

import { createLogger } from './logger';

// Create logger for this module
const logger = createLogger('Analytics');

/**
 * Analytics event properties interface
 */
interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track signup events with unified analytics
 * @param properties - Event properties to track
 */
export function trackSignup(properties: AnalyticsProperties = {}): void {
  try {
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: 'signup_event', ...properties });
    }
    
    // Track with Splitbee
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('signup_event', properties);
    }
    
    logger.info('Signup event tracked', properties);
  } catch (error) {
    logger.error('Failed to track signup event', error);
  }
}

/**
 * Track signup error events
 * @param properties - Error properties to track
 */
export function trackSignupError(properties: AnalyticsProperties = {}): void {
  try {
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: 'signup_error', ...properties });
    }
    
    // Track with Splitbee
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('signup_error', properties);
    }
    
    logger.info('Signup error tracked', properties);
  } catch (error) {
    logger.error('Failed to track signup error', error);
  }
}

/**
 * Track call-to-action click events
 * @param buttonName - Name of the button clicked
 * @param section - Section where the button is located
 * @param additionalProps - Additional properties to track
 */
export function trackCTAClick(
  buttonName: string, 
  section: string, 
  additionalProps: AnalyticsProperties = {}
): void {
  try {
    const properties = {
      button_name: buttonName,
      section,
      timestamp: Date.now(),
      ...additionalProps
    };
    
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: 'cta_click', ...properties });
    }
    
    // Track with Splitbee
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('cta_click', properties);
    }
    
    logger.info('CTA click tracked', properties);
  } catch (error) {
    logger.error('Failed to track CTA click', error);
  }
}

/**
 * Track page view events
 * @param pageTitle - Title of the page
 * @param pageUrl - URL of the page
 * @param referrer - Referring page URL
 */
export function trackPageView(
  pageTitle: string, 
  pageUrl: string, 
  referrer?: string
): void {
  try {
    const properties = {
      page_title: pageTitle,
      page_url: pageUrl,
      referrer: referrer || '',
      timestamp: Date.now()
    };
    
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: 'page_view', ...properties });
    }
    
    // Track with Splitbee
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('page_view', properties);
    }
    
    logger.info('Page view tracked', properties);
  } catch (error) {
    logger.error('Failed to track page view', error);
  }
}

/**
 * Track web vitals performance metrics
 * @param metricName - Name of the performance metric
 * @param metricValue - Value of the metric
 * @param metricRating - Rating of the metric (good, needs-improvement, poor)
 */
export function trackWebVital(
  metricName: string, 
  metricValue: number, 
  metricRating: 'good' | 'needs-improvement' | 'poor'
): void {
  try {
    const properties = {
      metric_name: metricName,
      metric_value: metricValue,
      metric_rating: metricRating,
      timestamp: Date.now()
    };
    
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: 'web_vital', ...properties });
    }
    
    // Track with Splitbee
    if (typeof window !== 'undefined' && window.splitbee) {
      window.splitbee.track('web_vital', properties);
    }
    
    logger.info('Web vital tracked', properties);
  } catch (error) {
    logger.error('Failed to track web vital', error);
  }
}

/**
 * Initialize analytics tracking
 * This function should be called on app initialization
 */
export function initializeAnalytics(): void {
  try {
    // Track initial page view
    if (typeof window !== 'undefined') {
      trackPageView(
        document.title,
        window.location.href,
        document.referrer
      );
    }
    
    logger.info('Analytics initialized');
  } catch (error) {
    logger.error('Failed to initialize analytics', error);
  }
}

// Extend Window interface for TypeScript support
declare global {
  interface Window {
    va?: (event: string, properties?: Record<string, unknown>) => void;
    splitbee?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
} 