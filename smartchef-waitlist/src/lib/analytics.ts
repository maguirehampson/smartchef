/**
 * Unified Analytics Utility
 * 
 * This utility provides a centralized interface for tracking analytics events
 * across multiple platforms (Vercel Analytics and Splitbee) to ensure
 * comprehensive data collection and redundancy.
 * 
 * Features:
 * - Unified tracking interface for both Vercel Analytics and Splitbee
 * - Automatic fallback if one platform is unavailable
 * - Type-safe event tracking with predefined event types
 * - Performance monitoring integration
 * - Development mode logging for debugging
 * 
 * @author SmartChef Team
 * @version 1.0.0
 */

'use client';

import { track as vercelTrack } from '@vercel/analytics';

/**
 * Analytics event types for type safety
 */
export type AnalyticsEvent = 
  | 'signup_event'
  | 'signup_error'
  | 'cta_click'
  | 'web_vital'
  | 'page_view'
  | 'thank_you_page_view';

/**
 * Analytics event properties interface
 */
export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Global window interface extension for Splitbee
 */
declare global {
  interface Window {
    splitbee?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Unified analytics tracking function
 * 
 * Tracks events across both Vercel Analytics and Splitbee platforms
 * for comprehensive data collection and redundancy.
 * 
 * @param event - The event name to track
 * @param properties - Optional properties to include with the event
 * @param options - Additional tracking options
 */
export function track(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
  options?: {
    /** Skip Vercel Analytics tracking */
    skipVercel?: boolean;
    /** Skip Splitbee tracking */
    skipSplitbee?: boolean;
  }
) {
  const { skipVercel = false, skipSplitbee = false } = options || {};

  // Filter out undefined values for Vercel Analytics compatibility
  const cleanProperties = properties ? Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean> : undefined;

  // Track with Vercel Analytics
  if (!skipVercel) {
    try {
      vercelTrack(event, cleanProperties);
    } catch (error) {
      console.warn('Vercel Analytics tracking failed:', error);
    }
  }

  // Track with Splitbee
  if (!skipSplitbee && typeof window !== 'undefined' && window.splitbee) {
    try {
      window.splitbee.track(event, properties);
    } catch (error) {
      console.warn('Splitbee tracking failed:', error);
    }
  }

  // Development mode logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}:`, properties);
  }
}

/**
 * Track signup events
 * 
 * @param properties - Signup event properties
 */
export function trackSignup(properties: {
  email_domain?: string;
  has_school?: boolean;
  subscriber_id?: string;
}) {
  track('signup_event', properties);
}

/**
 * Track signup errors
 * 
 * @param properties - Error event properties
 */
export function trackSignupError(properties: {
  error_type: string;
  email_domain?: string;
}) {
  track('signup_error', properties);
}

/**
 * Track call-to-action clicks
 * 
 * @param buttonName - Name of the button clicked
 * @param section - Page section where the button is located
 * @param additionalProps - Additional properties to track
 */
export function trackCTAClick(
  buttonName: string,
  section: string,
  additionalProps?: Record<string, unknown>
) {
  track('cta_click', {
    button_name: buttonName,
    section: section,
    ...additionalProps
  });
}

/**
 * Track web vitals performance metrics
 * 
 * @param properties - Web vitals metric properties
 */
export function trackWebVital(properties: {
  metric_name: string;
  metric_value: number;
  metric_rating: 'good' | 'needs-improvement' | 'poor';
  metric_id: string;
  metric_delta: number;
}) {
  track('web_vital', properties);
}

/**
 * Track page views
 * 
 * @param properties - Page view properties
 */
export function trackPageView(properties?: {
  page_title?: string;
  page_url?: string;
  referrer?: string;
}) {
  track('page_view', properties);
}

/**
 * Track thank you page views
 * 
 * @param properties - Thank you page properties
 */
export function trackThankYouPageView(properties?: {
  referrer?: string;
  time_on_page?: number;
}) {
  track('thank_you_page_view', properties);
}

/**
 * Check if analytics platforms are available
 */
export function getAnalyticsStatus() {
  const status = {
    vercel: true, // Vercel Analytics is always available when imported
    splitbee: typeof window !== 'undefined' && !!window.splitbee,
  };

  return status;
} 