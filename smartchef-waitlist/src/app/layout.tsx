/**
 * SmartChef Waitlist Root Layout Component
 * 
 * This is the root layout component for the SmartChef waitlist application.
 * It defines the HTML structure, metadata, fonts, and global scripts that
 * are shared across all pages in the application.
 * 
 * Key Features:
 * - SEO-optimized metadata with Open Graph and Twitter Cards
 * - Google Fonts integration (Geist Sans and Geist Mono)
 * - Multi-analytics integration (Splitbee + Vercel Analytics + Speed Insights)
 * - Global CSS imports and styling
 * - Accessibility and performance optimizations
 * 
 * Requirements covered:
 * - 3.4: Multi-analytics integration (Splitbee + Vercel Analytics + Speed Insights)
 * - 6.4: Proper meta tags for SEO and social sharing
 * - 6.5: Open Graph and Twitter Card configurations
 * - 5.1: Next.js project structure and configuration
 * 
 * @author SmartChef Team
 * @version 1.0.0
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import WebVitals from './components/WebVitals';
import "./globals.css";

/**
 * Font Configuration
 * 
 * Google Fonts integration using Next.js optimized font loading.
 * Fonts are preloaded and optimized for performance.
 */

/** Primary sans-serif font for body text and UI elements */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improves loading performance
});

/** Monospace font for code snippets and technical content */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Improves loading performance
});

/**
 * SEO and Social Media Metadata Configuration
 * 
 * Comprehensive metadata setup for optimal search engine optimization
 * and social media sharing. Includes Open Graph, Twitter Cards, structured
 * data, and performance optimizations for better Core Web Vitals.
 * 
 * Performance Features:
 * - Optimized meta tags for faster parsing
 * - Preconnect hints for external resources
 * - DNS prefetch for critical domains
 * - Resource hints for improved loading
 * 
 * SEO Features:
 * - Complete Open Graph implementation
 * - Twitter Card optimization
 * - Structured data markup
 * - Canonical URLs and alternate languages
 * - Rich snippets support
 */
export const metadata: Metadata = {
  // Enhanced SEO metadata with performance considerations
  title: {
    default: "Savr - AI That Gets Why You Eat",
    template: "%s | Savr"
  },
  description: "Join the waitlist for Savr, the first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
  keywords: [
    "AI cooking assistant",
    "smart recipes", 
    "contextual cooking",
    "meal planning AI",
    "personalized recipes",
    "cooking AI",
    "food technology",
    "culinary intelligence",
    "recipe recommendations",
    "cooking chatbot"
  ],
  
  // Authorship and publication info
  authors: [{ name: "Savr Team", url: "https://savr.ai" }],
  creator: "Savr",
  publisher: "Savr",
  applicationName: "Savr Waitlist",
  
  // Disable automatic detection to prevent layout shifts
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Base URL for relative paths - production ready
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://savr-waitlist.vercel.app'),
  
  // Canonical URL and alternates
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  
  // Enhanced Open Graph metadata
  openGraph: {
    title: "Savr - AI That Gets Why You Eat",
    description: "Join the waitlist for SmartChef, the first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
    url: '/',
    siteName: 'SmartChef',
    images: [
      {
        url: '/savr-logo.png',
        width: 908,
        height: 640,
        alt: 'Savr - AI That Gets Why You Eat',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
  },
  
  // Enhanced Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: "Savr - AI That Gets Why You Eat",
    description: "The first AI cooking assistant that understands your mood, budget, and cravings. Join the waitlist for contextual culinary intelligence.",
    images: ['/savr-logo.png'],
    creator: '@savr',
    site: '@savr',
  },
  
  // Enhanced search engine crawler instructions
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Additional metadata for better SEO
  category: 'Technology',
  classification: 'AI Cooking Assistant',
  
  // App-specific metadata
  appleWebApp: {
    capable: true,
    title: 'Savr',
    statusBarStyle: 'black-translucent',
  },
  
  // Verification codes (to be updated with actual values)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  
  // Additional structured data
  other: {
    'application-name': 'Savr Waitlist',
    'msapplication-TileColor': '#7c3aed',
    'theme-color': '#000000',
  },
};

/**
 * Root Layout Component
 * 
 * The main layout wrapper that provides the HTML structure and global
 * configuration for all pages in the application.
 * 
 * Features:
 * - HTML lang attribute for accessibility
 * - Analytics script loading with optimal strategy
 * - Font variable CSS custom properties
 * - Hydration warning suppression for client-side dynamic content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root HTML structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimization: DNS prefetch and preconnect hints */}
        <link rel="dns-prefetch" href="//cdn.splitbee.io" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://cdn.splitbee.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/style.css" as="style" />
        <link rel="preload" href="/savr-logo.png" as="image" type="image/png" />
        
        {/* Favicon and app icons for better branding */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/savr-logo.png" type="image/png" />
        <link rel="icon" href="/savr-logo.png" type="image/png" />
        <link rel="icon" href="/savr-logo.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/savr-logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/savr-logo.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/savr-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance hint: Prefetch likely next page */}
        <link rel="prefetch" href="/thank-you.html" />
        
        {/* 
          Splitbee Analytics Integration
          
          Loads after the page becomes interactive to avoid blocking
          initial page load. This strategy ensures optimal performance
          while still capturing all user interactions.
          
          Requirements covered: 3.4 - Splitbee script inclusion
        */}
        <Script
          src="https://cdn.splitbee.io/sb.js"
          strategy="afterInteractive"
        />
        
        {/* Structured Data for Rich Snippets */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Savr",
              "description": "The first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://savr-waitlist.vercel.app",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Savr Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Savr"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* 
          Font Variables:
          - geistSans.variable: --font-geist-sans CSS custom property
          - geistMono.variable: --font-geist-mono CSS custom property
          
          Styling:
          - antialiased: Improves font rendering on various displays
          
          Hydration:
          - suppressHydrationWarning: Prevents warnings for client-side
            dynamic content like rotating messages and animations
        */}
        {children}
        
        {/* Web Vitals Performance Monitoring */}
        <WebVitals />
        
        {/* Vercel Analytics Integration */}
        <Analytics />
        
        {/* Vercel Speed Insights Integration */}
        <SpeedInsights />
      </body>
    </html>
  );
}
