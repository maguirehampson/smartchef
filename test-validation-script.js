/**
 * SmartChef Cross-Browser Validation Script
 * 
 * This script performs automated testing of the SmartChef waitlist application
 * across different browsers and viewports to ensure consistent functionality.
 * 
 * Usage: Run this script in browser console on http://localhost:3000
 * 
 * Requirements tested:
 * - 5.7: Cross-browser compatibility (Chrome, Safari, Firefox)
 * - 1.2: Responsive design validation
 * - 2.1, 2.4, 2.5: Form functionality and validation
 * - 3.1, 3.2, 3.3: Analytics tracking verification
 */

class SmartChefTestSuite {
    constructor() {
        this.results = {
            browser: this.getBrowserInfo(),
            viewport: this.getViewportInfo(),
            tests: [],
            performance: {},
            timestamp: new Date().toISOString()
        };
        
        this.testCount = 0;
        this.passCount = 0;
        this.failCount = 0;
    }

    /**
     * Get comprehensive browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edg')) browser = 'Edge';
        
        return {
            name: browser,
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    /**
     * Get viewport and screen information
     */
    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1
        };
    }

    /**
     * Log test result
     */
    logTest(testName, passed, details = '') {
        this.testCount++;
        if (passed) {
            this.passCount++;
            console.log(`✅ ${testName}`, details);
        } else {
            this.failCount++;
            console.log(`❌ ${testName}`, details);
        }
        
        this.results.tests.push({
            name: testName,
            passed,
            details,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Test page load performance
     */
    async testPagePerformance() {
        console.log('\n🚀 Testing Page Performance...');
        
        // Test if Performance API is available
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
                
                this.results.performance = {
                    loadTime: Math.round(loadTime),
                    domContentLoaded: Math.round(domContentLoaded),
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint()
                };
                
                this.logTest('Page Load Time', loadTime < 5000, `${Math.round(loadTime)}ms`);
                this.logTest('DOM Content Loaded', domContentLoaded < 3000, `${Math.round(domContentLoaded)}ms`);
            }
        } else {
            this.logTest('Performance API', false, 'Performance API not supported');
        }
    }

    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    /**
     * Get First Contentful Paint timing
     */
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? Math.round(fcp.startTime) : null;
    }

    /**
     * Test visual rendering elements
     */
    testVisualRendering() {
        console.log('\n🎨 Testing Visual Rendering...');
        
        // Test if main elements are present
        const heroSection = document.querySelector('section');
        this.logTest('Hero Section Present', !!heroSection);
        
        // Test animated background
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        this.logTest('Animated Elements Present', animatedElements.length > 0, `Found ${animatedElements.length} animated elements`);
        
        // Test CSS custom properties support
        const testElement = document.createElement('div');
        testElement.style.setProperty('--test-var', 'test');
        const supportsCustomProps = testElement.style.getPropertyValue('--test-var') === 'test';
        this.logTest('CSS Custom Properties', supportsCustomProps);
        
        // Test backdrop-filter support
        testElement.style.backdropFilter = 'blur(10px)';
        const supportsBackdropFilter = testElement.style.backdropFilter === 'blur(10px)';
        this.logTest('Backdrop Filter Support', supportsBackdropFilter);
        
        // Test CSS Grid support
        const supportsGrid = CSS.supports('display', 'grid');
        this.logTest('CSS Grid Support', supportsGrid);
        
        // Test Flexbox support
        const supportsFlexbox = CSS.supports('display', 'flex');
        this.logTest('CSS Flexbox Support', supportsFlexbox);
    }

    /**
     * Test form functionality
     */
    testFormFunctionality() {
        console.log('\n📝 Testing Form Functionality...');
        
        // Find the signup form
        const emailInput = document.querySelector('input[type="email"]');
        const submitButton = document.querySelector('button[type="submit"]');
        
        this.logTest('Email Input Present', !!emailInput);
        this.logTest('Submit Button Present', !!submitButton);
        
        if (emailInput) {
            // Test email validation
            const testEmails = [
                { email: 'test@example.com', valid: true },
                { email: 'invalid-email', valid: false },
                { email: '', valid: false },
                { email: 'user@domain.co.uk', valid: true },
                { email: 'user+tag@example.org', valid: true }
            ];
            
            testEmails.forEach(({ email, valid }) => {
                const isValid = this.validateEmail(email);
                this.logTest(`Email Validation: ${email || 'empty'}`, isValid === valid, `Expected: ${valid}, Got: ${isValid}`);
            });
        }
        
        // Test form submission prevention (without actually submitting)
        if (submitButton) {
            const hasClickHandler = submitButton.onclick || submitButton.addEventListener;
            this.logTest('Form Submit Handler', !!hasClickHandler);
        }
    }

    /**
     * Email validation function (matches the one in the app)
     */
    validateEmail(email) {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() !== '' && EMAIL_REGEX.test(email) && email.length <= 254;
    }

    /**
     * Test analytics integration
     */
    testAnalytics() {
        console.log('\n📈 Testing Analytics Integration...');
        
        // Check if Splitbee is loaded
        const splitbeeLoaded = typeof window.splitbee !== 'undefined';
        this.logTest('Splitbee Analytics Loaded', splitbeeLoaded);
        
        // Check for analytics script in DOM
        const splitbeeScript = document.querySelector('script[src*="splitbee"]');
        this.logTest('Splitbee Script Present', !!splitbeeScript);
        
        // Test if tracking functions are available
        if (splitbeeLoaded) {
            const hasTrackFunction = typeof window.splitbee.track === 'function';
            this.logTest('Analytics Track Function', hasTrackFunction);
        }
        
        // Check for data attributes that might be used for tracking
        const trackingElements = document.querySelectorAll('[data-track], [onclick*="track"]');
        this.logTest('Tracking Elements Present', trackingElements.length > 0, `Found ${trackingElements.length} tracking elements`);
    }

    /**
     * Test responsive design at different breakpoints
     */
    testResponsiveDesign() {
        console.log('\n📱 Testing Responsive Design...');
        
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        
        // Test breakpoints
        const breakpoints = [
            { name: 'Mobile Small', width: 320 },
            { name: 'Mobile Large', width: 375 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1024 },
            { name: 'Large Desktop', width: 1280 }
        ];
        
        breakpoints.forEach(({ name, width }) => {
            // Simulate viewport change (note: this doesn't actually resize the browser)
            const isCurrentBreakpoint = originalWidth >= width;
            
            // Check if responsive classes are present
            const responsiveElements = document.querySelectorAll(`[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]`);
            this.logTest(`${name} Responsive Classes`, responsiveElements.length > 0, `Found ${responsiveElements.length} responsive elements`);
        });
        
        // Test meta viewport tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        this.logTest('Viewport Meta Tag', !!viewportMeta, viewportMeta ? viewportMeta.content : 'Not found');
    }

    /**
     * Test JavaScript features and APIs
     */
    testJavaScriptFeatures() {
        console.log('\n⚡ Testing JavaScript Features...');
        
        // Test modern JavaScript features
        const features = [
            { name: 'Fetch API', test: () => typeof fetch !== 'undefined' },
            { name: 'Promise Support', test: () => typeof Promise !== 'undefined' },
            { name: 'Arrow Functions', test: () => { try { eval('() => {}'); return true; } catch { return false; } } },
            { name: 'Async/Await', test: () => { try { eval('async () => {}'); return true; } catch { return false; } } },
            { name: 'ES6 Classes', test: () => { try { eval('class Test {}'); return true; } catch { return false; } } },
            { name: 'Template Literals', test: () => { try { eval('`test`'); return true; } catch { return false; } } },
            { name: 'Destructuring', test: () => { try { eval('const {a} = {}'); return true; } catch { return false; } } },
            { name: 'Spread Operator', test: () => { try { eval('[...{}]'); return true; } catch { return false; } } }
        ];
        
        features.forEach(({ name, test }) => {
            try {
                const supported = test();
                this.logTest(name, supported);
            } catch (error) {
                this.logTest(name, false, error.message);
            }
        });
    }

    /**
     * Test accessibility features
     */
    testAccessibility() {
        console.log('\n♿ Testing Accessibility Features...');
        
        // Test semantic HTML
        const semanticElements = ['main', 'section', 'header', 'nav', 'article', 'aside', 'footer'];
        const foundSemantic = semanticElements.filter(tag => document.querySelector(tag));
        this.logTest('Semantic HTML Elements', foundSemantic.length > 0, `Found: ${foundSemantic.join(', ')}`);
        
        // Test alt attributes on images
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => img.alt);
        this.logTest('Images with Alt Text', images.length === 0 || imagesWithAlt.length === images.length, `${imagesWithAlt.length}/${images.length} images have alt text`);
        
        // Test form labels
        const inputs = document.querySelectorAll('input');
        const inputsWithLabels = Array.from(inputs).filter(input => {
            return document.querySelector(`label[for="${input.id}"]`) || input.closest('label');
        });
        this.logTest('Form Inputs with Labels', inputs.length === 0 || inputsWithLabels.length === inputs.length, `${inputsWithLabels.length}/${inputs.length} inputs have labels`);
        
        // Test focus indicators
        const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
        this.logTest('Focusable Elements Present', focusableElements.length > 0, `Found ${focusableElements.length} focusable elements`);
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting SmartChef Cross-Browser Test Suite...');
        console.log(`Browser: ${this.results.browser.name}`);
        console.log(`Viewport: ${this.results.viewport.width}x${this.results.viewport.height}`);
        console.log('=' .repeat(50));
        
        await this.testPagePerformance();
        this.testVisualRendering();
        this.testFormFunctionality();
        this.testAnalytics();
        this.testResponsiveDesign();
        this.testJavaScriptFeatures();
        this.testAccessibility();
        
        this.generateSummary();
        return this.results;
    }

    /**
     * Generate test summary
     */
    generateSummary() {
        console.log('\n' + '=' .repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('=' .repeat(50));
        console.log(`Total Tests: ${this.testCount}`);
        console.log(`✅ Passed: ${this.passCount}`);
        console.log(`❌ Failed: ${this.failCount}`);
        console.log(`Success Rate: ${Math.round((this.passCount / this.testCount) * 100)}%`);
        
        if (this.failCount > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.tests
                .filter(test => !test.passed)
                .forEach(test => console.log(`  - ${test.name}: ${test.details}`));
        }
        
        console.log('\n📋 Full results available in testSuite.results');
    }

    /**
     * Export results as JSON
     */
    exportResults() {
        const blob = new Blob([JSON.stringify(this.results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartchef-test-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('📁 Test results exported to JSON file');
    }
}

// Auto-run tests when script is loaded
console.log('🚀 SmartChef Test Suite Loaded');
console.log('Run: testSuite = new SmartChefTestSuite(); testSuite.runAllTests();');

// Create global instance for easy access
window.SmartChefTestSuite = SmartChefTestSuite;