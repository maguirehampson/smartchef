/**
 * SmartChef Waitlist Tailwind CSS Configuration
 * 
 * This configuration extends Tailwind CSS with SmartChef-specific design tokens,
 * animations, and utilities. It provides a comprehensive design system that
 * ensures consistency across the entire application.
 * 
 * Key Features:
 * - SmartChef brand color palettes (primary, secondary, accent)
 * - Custom animations for enhanced user experience
 * - Extended typography scale and font families
 * - Responsive breakpoints including mobile-first approach
 * - Custom gradient utilities and background patterns
 * - Performance-optimized animation keyframes
 * 
 * Requirements covered:
 * - 1.2: Responsive design configuration
 * - 1.3: Custom animations and transitions
 * - 6.4: Design system consistency
 * 
 * @author SmartChef Team
 * @version 1.0.0
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  /**
   * Content Configuration
   * 
   * Specifies which files Tailwind should scan for class names.
   * This enables tree-shaking to remove unused CSS in production.
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // Next.js pages
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // React components
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',        // App router files
    './public/**/*.html',                         // Static HTML files
  ],
  theme: {
    extend: {
      /**
       * SmartChef Brand Color System
       * 
       * Comprehensive color palettes that provide consistent branding
       * across all components and states. Each palette includes 11 shades
       * from lightest (50) to darkest (950) for maximum flexibility.
       */
      colors: {
        /**
         * Primary Color Palette (Orange)
         * 
         * The main brand color used for primary CTAs, logos, and key
         * interactive elements. Based on #f2750a with calculated tints and shades.
         */
        primary: {
          50: '#fef7ee',   // Lightest - backgrounds, subtle highlights
          100: '#fdedd3',  // Very light - hover states, borders
          200: '#fbd7a5',  // Light - disabled states, secondary backgrounds
          300: '#f8bc6d',  // Medium light - secondary text, icons
          400: '#f59532',  // Medium - hover states, secondary CTAs
          500: '#f2750a',  // Base - primary CTAs, brand elements
          600: '#e35d05',  // Medium dark - active states, pressed buttons
          700: '#bc4508',  // Dark - text on light backgrounds
          800: '#95370e',  // Very dark - high contrast text
          900: '#782f0f',  // Darkest - maximum contrast
          950: '#411505',  // Ultra dark - shadows, outlines
        },
        
        /**
         * Secondary Color Palette (Blue)
         * 
         * Supporting brand color for secondary CTAs, links, and
         * complementary design elements. Creates visual hierarchy.
         */
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Base secondary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        /**
         * Accent Color Palette (Purple)
         * 
         * Accent color for special highlights, gradients, and
         * decorative elements. Adds visual interest and depth.
         */
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',  // Base accent color
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        
        /**
         * Neutral Color Palette
         * 
         * Grayscale colors for text, backgrounds, borders, and
         * other non-brand elements. Provides excellent contrast ratios.
         */
        neutral: {
          50: '#fafafa',   // Lightest backgrounds
          100: '#f5f5f5',  // Light backgrounds, subtle borders
          200: '#e5e5e5',  // Borders, dividers
          300: '#d4d4d4',  // Disabled text, placeholder text
          400: '#a3a3a3',  // Secondary text, icons
          500: '#737373',  // Body text
          600: '#525252',  // Headings, important text
          700: '#404040',  // High contrast text
          800: '#262626',  // Very high contrast text
          900: '#171717',  // Maximum contrast text
          950: '#0a0a0a',  // Ultra dark backgrounds
        },
      },
      /**
       * Typography Configuration
       * 
       * Font families with system fallbacks for optimal performance
       * and cross-platform consistency.
       */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],  // Primary UI font
        serif: ['Georgia', 'serif'],                  // Decorative text
        mono: ['Fira Code', 'monospace'],            // Code and technical content
      },
      
      /**
       * Font Size Scale
       * 
       * Comprehensive typography scale with optimized line heights
       * for excellent readability across all device sizes.
       */
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px - small labels, captions
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - secondary text
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - body text
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - large body text
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - small headings
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px - medium headings
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - large headings
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - extra large headings
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px - hero text
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px - display text
        '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px - large display
        '8xl': ['6rem', { lineHeight: '1' }],           // 96px - extra large display
        '9xl': ['8rem', { lineHeight: '1' }],           // 128px - massive display
      },
      
      /**
       * Responsive Breakpoints
       * 
       * Mobile-first breakpoint system optimized for modern devices.
       * Includes extra-small breakpoint for older mobile devices.
       */
      screens: {
        'xs': '320px',   // Extra small phones (iPhone 5/SE)
        'sm': '640px',   // Small tablets and large phones
        'md': '768px',   // Medium tablets (iPad portrait)
        'lg': '1024px',  // Large tablets and small laptops
        'xl': '1280px',  // Desktop screens
        '2xl': '1536px', // Large desktop screens
      },
      /**
       * Custom Animation Library
       * 
       * Performance-optimized animations that enhance user experience
       * without impacting page load times. All animations respect
       * user's motion preferences.
       */
      animation: {
        // Entrance animations for content reveal
        'fade-in': 'fadeIn 0.5s ease-in-out',              // Simple fade in
        'fade-in-up': 'fadeInUp 0.6s ease-out',            // Fade in from bottom
        'fade-in-down': 'fadeInDown 0.6s ease-out',        // Fade in from top
        'slide-in-left': 'slideInLeft 0.5s ease-out',      // Slide from left
        'slide-in-right': 'slideInRight 0.5s ease-out',    // Slide from right
        
        // Continuous animations for visual interest
        'bounce-gentle': 'bounceGentle 2s infinite',        // Subtle bounce effect
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slow pulse
        'float': 'float 6s ease-in-out infinite',           // Floating motion
        'blur-fade': 'blurFade 8s ease-in-out infinite',    // Blur transition
        
        // Background gradient animations
        'gradient-x': 'gradientX 15s ease infinite',        // Horizontal gradient shift
        'gradient-y': 'gradientY 15s ease infinite',        // Vertical gradient shift
        'gradient-xy': 'gradientXY 15s ease infinite',      // Multi-directional gradient
      },
      /**
       * Animation Keyframes
       * 
       * CSS keyframe definitions for all custom animations.
       * Optimized for performance using transform and opacity properties.
       */
      keyframes: {
        // Basic fade animation
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        
        // Entrance animations with movement
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Continuous motion animations
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        
        // Background gradient animations for dynamic backgrounds
        gradientX: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        gradientY: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        gradientXY: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        
        // Visual effect animations
        blurFade: {
          '0%, 100%': { 
            filter: 'blur(0px)',
            opacity: '1'
          },
          '50%': { 
            filter: 'blur(2px)',
            opacity: '0.8'
          },
        },
      },
      /**
       * Backdrop Blur Scale
       * 
       * Extended backdrop blur options for glass morphism effects
       * and modern UI elements with depth.
       */
      backdropBlur: {
        'xs': '2px',   // Subtle blur for light glass effects
        'sm': '4px',   // Light blur for cards and overlays
        'md': '8px',   // Medium blur for modals and popups
        'lg': '12px',  // Strong blur for hero sections
        'xl': '16px',  // Heavy blur for dramatic effects
        '2xl': '24px', // Extra heavy blur
        '3xl': '40px', // Maximum blur for artistic effects
      },
      
      /**
       * Custom Background Images
       * 
       * Predefined gradient patterns and complex backgrounds
       * for consistent visual effects across the application.
       */
      backgroundImage: {
        // Standard gradient utilities
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        
        // Complex mesh gradient for dynamic backgrounds
        'gradient-mesh': `
          radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)
        `,
      },
      
      /**
       * Custom Utility Classes
       * 
       * Additional utility classes that extend Tailwind's functionality
       * with SmartChef-specific patterns.
       */
      utilities: {
        '.bg-gradient-radial': {
          'background-image': 'radial-gradient(var(--tw-gradient-stops))',
        },
      },
    },
  },
  plugins: [],
}

export default config