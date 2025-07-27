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
    default: "SmartChef - AI That Gets Why You Eat",
    template: "%s | SmartChef"
  },
  description: "Join the waitlist for SmartChef, the first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
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
  authors: [{ name: "SmartChef Team", url: "https://smartchef.ai" }],
  creator: "SmartChef",
  publisher: "SmartChef",
  applicationName: "SmartChef Waitlist",
  
  // Disable automatic detection to prevent layout shifts
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Base URL for relative paths - production ready
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smartchef-waitlist.vercel.app'),
  
  // Canonical URL and alternates
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  
  // Enhanced Open Graph metadata
  openGraph: {
    title: "SmartChef - AI That Gets Why You Eat",
    description: "Join the waitlist for SmartChef, the first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
    url: '/',
    siteName: 'SmartChef',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'SmartChef - Contextual Culinary Intelligence',
        type: 'image/svg+xml',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
  },
  
  // Enhanced Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: "SmartChef - AI That Gets Why You Eat",
    description: "The first AI cooking assistant that understands your mood, budget, and cravings. Join the waitlist for contextual culinary intelligence.",
    images: ['/og-image.svg'],
    creator: '@smartchef',
    site: '@smartchef',
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
    title: 'SmartChef',
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
    'application-name': 'SmartChef Waitlist',
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
        <link rel="preload" href="/og-image.svg" as="image" type="image/svg+xml" />
        
        {/* Favicon and app icons for better branding */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
              "name": "SmartChef",
              "description": "The first AI cooking assistant that understands your mood, budget, and cravings. Contextual culinary intelligence for real life.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef-waitlist.vercel.app",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "SmartChef Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "SmartChef"
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
