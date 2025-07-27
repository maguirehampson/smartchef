/**
 * Web Vitals Performance Monitoring Component
 * 
 * This component tracks Core Web Vitals metrics and reports them
 * to analytics for performance monitoring and optimization.
 * 
 * Metrics tracked:
 * - Largest Contentful Paint (LCP)
 * - Interaction to Next Paint (INP)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 * 
 * @author SmartChef Team
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';

/**
 * Web Vitals metric interface
 */
interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Web Vitals Performance Monitor
 * 
 * Tracks and reports Core Web Vitals metrics to analytics
 * for performance monitoring and optimization insights.
 */
const WebVitals: React.FC = () => {
  useEffect(() => {
    // Only run in production and when analytics is available
    if (process.env.NODE_ENV !== 'production') return;
    
    // Dynamic import to avoid loading in development
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const reportMetric = (metric: WebVitalMetric) => {
        // Report to Splitbee Analytics if available
        if (typeof window !== 'undefined' && window.splitbee) {
          window.splitbee.track('web_vital', {
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            metric_id: metric.id,
            metric_delta: metric.delta,
          });
        }
        
        // Also log to console in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
          });
        }
      };
      
      // Track all Core Web Vitals (using updated API)
      onCLS(reportMetric);  // Cumulative Layout Shift
      onINP(reportMetric);  // Interaction to Next Paint (replaces FID)
      onFCP(reportMetric);  // First Contentful Paint
      onLCP(reportMetric);  // Largest Contentful Paint
      onTTFB(reportMetric); // Time to First Byte
    }).catch((error) => {
      // Silently fail if web-vitals library is not available
      console.warn('Web Vitals tracking failed:', error);
    });
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default WebVitals;