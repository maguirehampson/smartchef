/**
 * Web Vitals Performance Monitoring Component
 * 
 * This component tracks Core Web Vitals metrics and sends them to analytics
 * platforms for performance monitoring and optimization.
 * 
 * Features:
 * - Tracks LCP, FID, CLS, FCP, and TTFB metrics
 * - Sends data to Vercel Analytics and Splitbee
 * - Provides performance insights for optimization
 * - Development mode logging for debugging
 */

'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import { trackWebVital } from '../../lib/analytics';
import { createLogger } from '../../lib/logger';

// Create logger for this module
const logger = createLogger('WebVitals');

/**
 * Get performance rating based on metric value and thresholds
 * @param value - Metric value
 * @param thresholds - Good and poor thresholds
 * @returns Performance rating
 */
function getRating(
  value: number, 
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Web Vitals metric thresholds
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Web Vitals component for performance monitoring
 */
export default function WebVitals() {
  useEffect(() => {
    // Track Largest Contentful Paint (LCP)
    onLCP((metric) => {
      try {
        const rating = getRating(metric.value, THRESHOLDS.LCP);
        
        trackWebVital('LCP', metric.value, rating);
        
        logger.info('LCP tracked', {
          value: metric.value,
          rating,
          id: metric.id,
          delta: metric.delta
        });
      } catch (error) {
        logger.error('Failed to track LCP', error);
      }
    });

    // Track Interaction to Next Paint (INP) - replaces FID
    onINP((metric) => {
      try {
        const rating = getRating(metric.value, THRESHOLDS.INP);
        
        trackWebVital('INP', metric.value, rating);
        
        logger.info('INP tracked', {
          value: metric.value,
          rating,
          id: metric.id,
          delta: metric.delta
        });
      } catch (error) {
        logger.error('Failed to track INP', error);
      }
    });

    // Track Cumulative Layout Shift (CLS)
    onCLS((metric) => {
      try {
        const rating = getRating(metric.value, THRESHOLDS.CLS);
        
        trackWebVital('CLS', metric.value, rating);
        
        logger.info('CLS tracked', {
          value: metric.value,
          rating,
          id: metric.id,
          delta: metric.delta
        });
      } catch (error) {
        logger.error('Failed to track CLS', error);
      }
    });

    // Track First Contentful Paint (FCP)
    onFCP((metric) => {
      try {
        const rating = getRating(metric.value, THRESHOLDS.FCP);
        
        trackWebVital('FCP', metric.value, rating);
        
        logger.info('FCP tracked', {
          value: metric.value,
          rating,
          id: metric.id,
          delta: metric.delta
        });
      } catch (error) {
        logger.error('Failed to track FCP', error);
      }
    });

    // Track Time to First Byte (TTFB)
    onTTFB((metric) => {
      try {
        const rating = getRating(metric.value, THRESHOLDS.TTFB);
        
        trackWebVital('TTFB', metric.value, rating);
        
        logger.info('TTFB tracked', {
          value: metric.value,
          rating,
          id: metric.id,
          delta: metric.delta
        });
      } catch (error) {
        logger.error('Failed to track TTFB', error);
      }
    });

    logger.info('Web Vitals monitoring initialized');
  }, []);

  // This component doesn't render anything
  return null;
}