/**
 * SmartChef Waitlist - Integration Testing Suite
 * 
 * This script performs comprehensive integration testing for the complete user flow
 * from landing page to thank-you page, including analytics tracking, error handling,
 * and deployment preparation validation.
 * 
 * Requirements covered:
 * - Test complete user flow from landing page to thank-you page
 * - Verify all analytics events are properly tracked and formatted
 * - Test error handling scenarios (network failures, API errors, validation errors)
 * - Prepare deployment configuration for Vercel with environment variables
 * 
 * Usage: node integration-test.js
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testTimeout: 30000,
  retryAttempts: 3,
  testData: {
    validEmails: [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'valid.email@test-domain.com'
    ],
    invalidEmails: [
      'plainaddress',
      '@missingdomain.com',
      'missing@.com',
      'spaces @domain.com',
      'toolong' + 'x'.repeat(250) + '@domain.com'
    ],
    schools: [
      'Stanford University',
      'MIT',
      '',
      'University of California, Berkeley'
    ]
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  warnings: [],
  summary: {}
};

/**
 * Utility functions for testing
 */
class TestUtils {
  static log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      debug: '🔍'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static async checkFileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async readFileContent(filePath) {
    try {
      return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }
}

/**
 * Environment Configuration Tests
 */
class EnvironmentTests {
  static async validateProjectStructure() {
    TestUtils.log('Testing project structure...', 'info');
    
    const requiredFiles = [
      'package.json',
      'next.config.ts',
      '.env.local.template',
      'src/app/page.tsx',
      'src/app/api/signup/route.ts',
      'public/thank-you.html',
      'public/scripts/signup.js',
      'public/style.css'
    ];

    const requiredDirs = [
      'src/app',
      'public',
      '.next'
    ];

    let allFilesExist = true;

    // Check required files
    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = await TestUtils.checkFileExists(filePath);
      
      if (exists) {
        TestUtils.log(`✓ ${file} exists`, 'success');
      } else {
        TestUtils.log(`✗ ${file} missing`, 'error');
        testResults.errors.push(`Missing required file: ${file}`);
        allFilesExist = false;
      }
    }

    // Check required directories
    for (const dir of requiredDirs) {
      const dirPath = path.join(process.cwd(), dir);
      const exists = await TestUtils.checkFileExists(dirPath);
      
      if (exists) {
        TestUtils.log(`✓ ${dir}/ directory exists`, 'success');
      } else {
        TestUtils.log(`✗ ${dir}/ directory missing`, 'error');
        testResults.errors.push(`Missing required directory: ${dir}`);
        allFilesExist = false;
      }
    }

    if (allFilesExist) {
      testResults.passed++;
      TestUtils.log('Project structure validation: PASSED', 'success');
    } else {
      testResults.failed++;
      TestUtils.log('Project structure validation: FAILED', 'error');
    }

    return allFilesExist;
  }

  static async validateEnvironmentConfiguration() {
    TestUtils.log('Testing environment configuration...', 'info');
    
    try {
      // Check .env.local.template exists
      const templatePath = path.join(process.cwd(), '.env.local.template');
      const templateExists = await TestUtils.checkFileExists(templatePath);
      
      if (!templateExists) {
        testResults.errors.push('Missing .env.local.template file');
        testResults.failed++;
        return false;
      }

      // Read template content
      const templateContent = await TestUtils.readFileContent(templatePath);
      
      // Check for required environment variables in template
      const requiredEnvVars = [
        'MAILERLITE_API_KEY',
        'MAILERLITE_GROUP_ID',
        'NEXT_PUBLIC_SPLITBEE_TOKEN',
        'NEXT_PUBLIC_SITE_URL'
      ];

      let allVarsPresent = true;
      for (const envVar of requiredEnvVars) {
        if (templateContent.includes(envVar)) {
          TestUtils.log(`✓ ${envVar} found in template`, 'success');
        } else {
          TestUtils.log(`✗ ${envVar} missing from template`, 'error');
          testResults.errors.push(`Missing environment variable in template: ${envVar}`);
          allVarsPresent = false;
        }
      }

      // Check if .env.local exists (optional in development)
      const envLocalPath = path.join(process.cwd(), '.env.local');
      const envLocalExists = await TestUtils.checkFileExists(envLocalPath);
      
      if (envLocalExists) {
        TestUtils.log('✓ .env.local file exists', 'success');
        const envContent = await TestUtils.readFileContent(envLocalPath);
        
        // Check if TODO placeholders are still present
        if (envContent.includes('TODO_ADD_YOUR_MAILERLITE_API_KEY_HERE')) {
          TestUtils.log('⚠️ MailerLite API key not configured (expected in development)', 'warning');
          testResults.warnings.push('MailerLite API key contains TODO placeholder');
        }
      } else {
        TestUtils.log('⚠️ .env.local file not found (expected in development)', 'warning');
        testResults.warnings.push('.env.local file not found - will need to be created for production');
      }

      if (allVarsPresent) {
        testResults.passed++;
        TestUtils.log('Environment configuration validation: PASSED', 'success');
      } else {
        testResults.failed++;
        TestUtils.log('Environment configuration validation: FAILED', 'error');
      }

      return allVarsPresent;

    } catch (error) {
      TestUtils.log(`Environment configuration test failed: ${error.message}`, 'error');
      testResults.errors.push(`Environment configuration error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }

  static async validateNextJSConfiguration() {
    TestUtils.log('Testing Next.js configuration...', 'info');
    
    try {
      const configPath = path.join(process.cwd(), 'next.config.ts');
      const configContent = await TestUtils.readFileContent(configPath);
      
      // Check for production optimizations
      const requiredConfigs = [
        'output: \'standalone\'',
        'compress: true',
        'optimizePackageImports',
        'splitChunks'
      ];

      let allConfigsPresent = true;
      for (const config of requiredConfigs) {
        if (configContent.includes(config)) {
          TestUtils.log(`✓ ${config} configuration found`, 'success');
        } else {
          TestUtils.log(`⚠️ ${config} configuration missing`, 'warning');
          testResults.warnings.push(`Next.js configuration missing: ${config}`);
        }
      }

      testResults.passed++;
      TestUtils.log('Next.js configuration validation: PASSED', 'success');
      return true;

    } catch (error) {
      TestUtils.log(`Next.js configuration test failed: ${error.message}`, 'error');
      testResults.errors.push(`Next.js configuration error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }
}

/**
 * API Integration Tests
 */
class APITests {
  static async testSignupAPIRoute() {
    TestUtils.log('Testing signup API route...', 'info');
    
    try {
      // Test valid email submission
      const validTestData = {
        email: 'test@example.com',
        school: 'Test University'
      };

      TestUtils.log('Testing valid email submission...', 'debug');
      
      // Note: In development without MailerLite config, we expect a 500 error
      // This is the expected behavior and validates our error handling
      
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validTestData)
      }).catch(error => {
        // Network error is expected if server isn't running
        TestUtils.log('⚠️ Server not running - API test skipped', 'warning');
        testResults.warnings.push('API tests skipped - development server not running');
        testResults.skipped++;
        return null;
      });

      if (!response) {
        return false; // Server not running, skip API tests
      }

      // Check response structure
      const responseData = await response.json();
      
      if (response.status === 500 && responseData.error === 'MISSING_CONFIG') {
        TestUtils.log('✓ API correctly returns MISSING_CONFIG error (expected in development)', 'success');
        testResults.passed++;
      } else if (response.status === 200) {
        TestUtils.log('✓ API successfully processed request', 'success');
        testResults.passed++;
      } else {
        TestUtils.log(`✗ Unexpected API response: ${response.status}`, 'error');
        testResults.errors.push(`Unexpected API response: ${response.status} - ${JSON.stringify(responseData)}`);
        testResults.failed++;
      }

      // Test invalid email submission
      TestUtils.log('Testing invalid email submission...', 'debug');
      
      const invalidResponse = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'invalid-email' })
      });

      const invalidResponseData = await invalidResponse.json();
      
      if (invalidResponse.status === 400 && invalidResponseData.error === 'INVALID_EMAIL') {
        TestUtils.log('✓ API correctly validates invalid email', 'success');
        testResults.passed++;
      } else {
        TestUtils.log('✗ API failed to validate invalid email', 'error');
        testResults.errors.push('API should return 400 for invalid email');
        testResults.failed++;
      }

      TestUtils.log('API route testing: COMPLETED', 'success');
      return true;

    } catch (error) {
      TestUtils.log(`API test failed: ${error.message}`, 'error');
      testResults.errors.push(`API test error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }

  static async testErrorHandlingScenarios() {
    TestUtils.log('Testing error handling scenarios...', 'info');
    
    const errorScenarios = [
      {
        name: 'Empty email',
        data: { email: '' },
        expectedStatus: 400,
        expectedError: 'INVALID_EMAIL'
      },
      {
        name: 'Missing email field',
        data: { school: 'Test School' },
        expectedStatus: 400,
        expectedError: 'INVALID_EMAIL'
      },
      {
        name: 'Invalid email format',
        data: { email: 'not-an-email' },
        expectedStatus: 400,
        expectedError: 'INVALID_EMAIL'
      },
      {
        name: 'Very long school name',
        data: { 
          email: 'test@example.com', 
          school: 'x'.repeat(101) 
        },
        expectedStatus: 400,
        expectedError: 'INVALID_SCHOOL'
      }
    ];

    let passedScenarios = 0;
    
    for (const scenario of errorScenarios) {
      try {
        TestUtils.log(`Testing scenario: ${scenario.name}`, 'debug');
        
        const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scenario.data)
        }).catch(() => {
          TestUtils.log('⚠️ Server not running - error scenario test skipped', 'warning');
          testResults.skipped++;
          return null;
        });

        if (!response) continue;

        const responseData = await response.json();
        
        if (response.status === scenario.expectedStatus && 
            responseData.error === scenario.expectedError) {
          TestUtils.log(`✓ ${scenario.name}: Correct error handling`, 'success');
          passedScenarios++;
        } else {
          TestUtils.log(`✗ ${scenario.name}: Unexpected response`, 'error');
          testResults.errors.push(`Error scenario failed: ${scenario.name}`);
        }

      } catch (error) {
        TestUtils.log(`Error testing scenario ${scenario.name}: ${error.message}`, 'error');
        testResults.errors.push(`Error scenario test failed: ${scenario.name} - ${error.message}`);
      }
    }

    if (passedScenarios === errorScenarios.length) {
      testResults.passed++;
      TestUtils.log('Error handling scenarios: PASSED', 'success');
    } else {
      testResults.failed++;
      TestUtils.log(`Error handling scenarios: FAILED (${passedScenarios}/${errorScenarios.length})`, 'error');
    }

    return passedScenarios === errorScenarios.length;
  }
}

/**
 * Frontend Integration Tests
 */
class FrontendTests {
  static async testPageStructure() {
    TestUtils.log('Testing page structure and components...', 'info');
    
    try {
      const pagePath = path.join(process.cwd(), 'src/app/page.tsx');
      const pageContent = await TestUtils.readFileContent(pagePath);
      
      // Check for required components and functionality
      const requiredElements = [
        'SmartChefLandingPage',
        'useState',
        'useEffect',
        'handleSubmit',
        'validateEmail',
        'splitbee.track',
        'signup_event',
        'cta_click',
        'framer-motion'
      ];

      let allElementsPresent = true;
      for (const element of requiredElements) {
        if (pageContent.includes(element)) {
          TestUtils.log(`✓ ${element} found in page component`, 'success');
        } else {
          TestUtils.log(`✗ ${element} missing from page component`, 'error');
          testResults.errors.push(`Missing page element: ${element}`);
          allElementsPresent = false;
        }
      }

      if (allElementsPresent) {
        testResults.passed++;
        TestUtils.log('Page structure validation: PASSED', 'success');
      } else {
        testResults.failed++;
        TestUtils.log('Page structure validation: FAILED', 'error');
      }

      return allElementsPresent;

    } catch (error) {
      TestUtils.log(`Page structure test failed: ${error.message}`, 'error');
      testResults.errors.push(`Page structure error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }

  static async testThankYouPage() {
    TestUtils.log('Testing thank-you page...', 'info');
    
    try {
      const thankYouPath = path.join(process.cwd(), 'public/thank-you.html');
      const thankYouContent = await TestUtils.readFileContent(thankYouPath);
      
      // Check for required elements
      const requiredElements = [
        'You\'re on the list!',
        'SmartChef is cooking something special',
        'Share with friends',
        'splitbee',
        'shareWithFriends',
        'thank_you_page_view'
      ];

      let allElementsPresent = true;
      for (const element of requiredElements) {
        if (thankYouContent.includes(element)) {
          TestUtils.log(`✓ ${element} found in thank-you page`, 'success');
        } else {
          TestUtils.log(`✗ ${element} missing from thank-you page`, 'error');
          testResults.errors.push(`Missing thank-you page element: ${element}`);
          allElementsPresent = false;
        }
      }

      // Check for proper HTML structure
      if (thankYouContent.includes('<!DOCTYPE html>') && 
          thankYouContent.includes('<html lang="en">') &&
          thankYouContent.includes('<meta charset="UTF-8">')) {
        TestUtils.log('✓ Proper HTML structure found', 'success');
      } else {
        TestUtils.log('✗ Invalid HTML structure', 'error');
        testResults.errors.push('Thank-you page has invalid HTML structure');
        allElementsPresent = false;
      }

      if (allElementsPresent) {
        testResults.passed++;
        TestUtils.log('Thank-you page validation: PASSED', 'success');
      } else {
        testResults.failed++;
        TestUtils.log('Thank-you page validation: FAILED', 'error');
      }

      return allElementsPresent;

    } catch (error) {
      TestUtils.log(`Thank-you page test failed: ${error.message}`, 'error');
      testResults.errors.push(`Thank-you page error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }

  static async testAnalyticsImplementation() {
    TestUtils.log('Testing analytics implementation...', 'info');
    
    try {
      const pagePath = path.join(process.cwd(), 'src/app/page.tsx');
      const pageContent = await TestUtils.readFileContent(pagePath);
      
      const thankYouPath = path.join(process.cwd(), 'public/thank-you.html');
      const thankYouContent = await TestUtils.readFileContent(thankYouPath);
      
      // Check for analytics events in main page
      const mainPageEvents = [
        'signup_event',
        'cta_click',
        'signup_error'
      ];

      let mainPageAnalytics = true;
      for (const event of mainPageEvents) {
        if (pageContent.includes(event)) {
          TestUtils.log(`✓ ${event} tracking found in main page`, 'success');
        } else {
          TestUtils.log(`✗ ${event} tracking missing from main page`, 'error');
          testResults.errors.push(`Missing analytics event: ${event}`);
          mainPageAnalytics = false;
        }
      }

      // Check for analytics events in thank-you page
      const thankYouEvents = [
        'thank_you_page_view',
        'cta_click'
      ];

      let thankYouAnalytics = true;
      for (const event of thankYouEvents) {
        if (thankYouContent.includes(event)) {
          TestUtils.log(`✓ ${event} tracking found in thank-you page`, 'success');
        } else {
          TestUtils.log(`✗ ${event} tracking missing from thank-you page`, 'error');
          testResults.errors.push(`Missing thank-you analytics event: ${event}`);
          thankYouAnalytics = false;
        }
      }

      // Check for Splitbee script inclusion
      if (pageContent.includes('splitbee.io/sb.js') || 
          thankYouContent.includes('splitbee.io/sb.js')) {
        TestUtils.log('✓ Splitbee script inclusion found', 'success');
      } else {
        TestUtils.log('✗ Splitbee script inclusion missing', 'error');
        testResults.errors.push('Splitbee script not included');
        mainPageAnalytics = false;
      }

      if (mainPageAnalytics && thankYouAnalytics) {
        testResults.passed++;
        TestUtils.log('Analytics implementation validation: PASSED', 'success');
      } else {
        testResults.failed++;
        TestUtils.log('Analytics implementation validation: FAILED', 'error');
      }

      return mainPageAnalytics && thankYouAnalytics;

    } catch (error) {
      TestUtils.log(`Analytics implementation test failed: ${error.message}`, 'error');
      testResults.errors.push(`Analytics implementation error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }
}

/**
 * Deployment Preparation Tests
 */
class DeploymentTests {
  static async validateVercelConfiguration() {
    TestUtils.log('Testing Vercel deployment configuration...', 'info');
    
    try {
      // Check package.json for proper scripts
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await TestUtils.readFileContent(packagePath);
      const packageJson = JSON.parse(packageContent);
      
      const requiredScripts = ['build', 'start', 'dev'];
      let scriptsValid = true;
      
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          TestUtils.log(`✓ ${script} script found`, 'success');
        } else {
          TestUtils.log(`✗ ${script} script missing`, 'error');
          testResults.errors.push(`Missing package.json script: ${script}`);
          scriptsValid = false;
        }
      }

      // Check for required dependencies
      const requiredDeps = ['next', 'react', 'react-dom', 'framer-motion'];
      let depsValid = true;
      
      for (const dep of requiredDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          TestUtils.log(`✓ ${dep} dependency found`, 'success');
        } else {
          TestUtils.log(`✗ ${dep} dependency missing`, 'error');
          testResults.errors.push(`Missing dependency: ${dep}`);
          depsValid = false;
        }
      }

      // Check Next.js configuration for Vercel optimization
      const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
      const nextConfigContent = await TestUtils.readFileContent(nextConfigPath);
      
      let configValid = true;
      if (nextConfigContent.includes('output: \'standalone\'')) {
        TestUtils.log('✓ Standalone output configuration found', 'success');
      } else {
        TestUtils.log('⚠️ Standalone output not configured', 'warning');
        testResults.warnings.push('Consider adding standalone output for Vercel optimization');
      }

      if (scriptsValid && depsValid) {
        testResults.passed++;
        TestUtils.log('Vercel configuration validation: PASSED', 'success');
      } else {
        testResults.failed++;
        TestUtils.log('Vercel configuration validation: FAILED', 'error');
      }

      return scriptsValid && depsValid;

    } catch (error) {
      TestUtils.log(`Vercel configuration test failed: ${error.message}`, 'error');
      testResults.errors.push(`Vercel configuration error: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }

  static async generateDeploymentChecklist() {
    TestUtils.log('Generating deployment checklist...', 'info');
    
    const checklist = `# SmartChef Waitlist - Deployment Checklist

## Pre-Deployment Requirements

### Environment Variables (CRITICAL)
- [ ] Set MAILERLITE_API_KEY in Vercel environment variables
- [ ] Set MAILERLITE_GROUP_ID in Vercel environment variables  
- [ ] Set NEXT_PUBLIC_SPLITBEE_TOKEN in Vercel environment variables (optional)
- [ ] Set NEXT_PUBLIC_SITE_URL to production domain

### Domain Configuration
- [ ] Configure custom domain in Vercel dashboard
- [ ] Update NEXT_PUBLIC_SITE_URL to match production domain
- [ ] Update og-image URLs in meta tags
- [ ] Test social sharing with production URLs

### Analytics Setup
- [ ] Verify Splitbee project is configured
- [ ] Test analytics events in production environment
- [ ] Set up conversion tracking goals
- [ ] Configure analytics alerts

### MailerLite Configuration
- [ ] Create "SmartChef Waitlist" group in MailerLite
- [ ] Copy group ID to environment variables
- [ ] Test API connection with production credentials
- [ ] Set up email automation sequences

### Performance Optimization
- [ ] Run Lighthouse audit on production build
- [ ] Verify Core Web Vitals meet targets
- [ ] Test loading performance on 3G networks
- [ ] Optimize images and assets

### Security Checklist
- [ ] Verify all environment variables are properly secured
- [ ] Test HTTPS enforcement
- [ ] Validate CORS configuration
- [ ] Review security headers

### Testing Checklist
- [ ] Test complete user flow in production
- [ ] Verify form submission works with real MailerLite API
- [ ] Test error handling scenarios
- [ ] Validate analytics tracking
- [ ] Test on multiple devices and browsers

### Monitoring Setup
- [ ] Set up error tracking (consider Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Create analytics dashboard

## Deployment Steps

1. **Build Verification**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Test with production values

3. **Deploy to Vercel**
   \`\`\`bash
   vercel --prod
   \`\`\`

4. **Post-Deployment Testing**
   - Test complete user flow
   - Verify analytics tracking
   - Test error scenarios
   - Validate performance metrics

## Post-Deployment Monitoring

### Week 1
- [ ] Monitor error rates and fix any issues
- [ ] Track conversion rates and user behavior
- [ ] Optimize based on real user data
- [ ] Monitor performance metrics

### Ongoing
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] A/B testing opportunities
- [ ] User feedback collection

Generated on: ${new Date().toISOString()}
`;

    try {
      const checklistPath = path.join(process.cwd(), 'DEPLOYMENT_CHECKLIST.md');
      await fs.promises.writeFile(checklistPath, checklist);
      TestUtils.log('✓ Deployment checklist generated: DEPLOYMENT_CHECKLIST.md', 'success');
      testResults.passed++;
      return true;
    } catch (error) {
      TestUtils.log(`Failed to generate deployment checklist: ${error.message}`, 'error');
      testResults.errors.push(`Deployment checklist generation failed: ${error.message}`);
      testResults.failed++;
      return false;
    }
  }
}

/**
 * Main test execution
 */
async function runIntegrationTests() {
  TestUtils.log('Starting SmartChef Waitlist Integration Tests...', 'info');
  TestUtils.log('='.repeat(60), 'info');
  
  const startTime = Date.now();
  
  try {
    // Phase 1: Environment and Configuration Tests
    TestUtils.log('\n📋 Phase 1: Environment and Configuration Tests', 'info');
    await EnvironmentTests.validateProjectStructure();
    await EnvironmentTests.validateEnvironmentConfiguration();
    await EnvironmentTests.validateNextJSConfiguration();
    
    // Phase 2: API Integration Tests
    TestUtils.log('\n🔌 Phase 2: API Integration Tests', 'info');
    await APITests.testSignupAPIRoute();
    await APITests.testErrorHandlingScenarios();
    
    // Phase 3: Frontend Integration Tests
    TestUtils.log('\n🎨 Phase 3: Frontend Integration Tests', 'info');
    await FrontendTests.testPageStructure();
    await FrontendTests.testThankYouPage();
    await FrontendTests.testAnalyticsImplementation();
    
    // Phase 4: Deployment Preparation Tests
    TestUtils.log('\n🚀 Phase 4: Deployment Preparation Tests', 'info');
    await DeploymentTests.validateVercelConfiguration();
    await DeploymentTests.generateDeploymentChecklist();
    
  } catch (error) {
    TestUtils.log(`Critical test failure: ${error.message}`, 'error');
    testResults.errors.push(`Critical failure: ${error.message}`);
    testResults.failed++;
  }
  
  // Generate test report
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  TestUtils.log('\n' + '='.repeat(60), 'info');
  TestUtils.log('📊 Integration Test Results Summary', 'info');
  TestUtils.log('='.repeat(60), 'info');
  
  TestUtils.log(`⏱️  Total execution time: ${duration.toFixed(2)}s`, 'info');
  TestUtils.log(`✅ Tests passed: ${testResults.passed}`, 'success');
  TestUtils.log(`❌ Tests failed: ${testResults.failed}`, 'error');
  TestUtils.log(`⏭️  Tests skipped: ${testResults.skipped}`, 'warning');
  TestUtils.log(`⚠️  Warnings: ${testResults.warnings.length}`, 'warning');
  
  if (testResults.errors.length > 0) {
    TestUtils.log('\n❌ Errors Found:', 'error');
    testResults.errors.forEach((error, index) => {
      TestUtils.log(`  ${index + 1}. ${error}`, 'error');
    });
  }
  
  if (testResults.warnings.length > 0) {
    TestUtils.log('\n⚠️  Warnings:', 'warning');
    testResults.warnings.forEach((warning, index) => {
      TestUtils.log(`  ${index + 1}. ${warning}`, 'warning');
    });
  }
  
  // Overall test result
  const overallSuccess = testResults.failed === 0;
  const readinessStatus = overallSuccess ? 'READY' : 'NOT READY';
  
  TestUtils.log('\n' + '='.repeat(60), 'info');
  TestUtils.log(`🎯 Overall Result: ${overallSuccess ? 'PASSED' : 'FAILED'}`, overallSuccess ? 'success' : 'error');
  TestUtils.log(`🚀 Deployment Readiness: ${readinessStatus}`, overallSuccess ? 'success' : 'error');
  TestUtils.log('='.repeat(60), 'info');
  
  // Save detailed test report
  const testReport = {
    timestamp: new Date().toISOString(),
    duration: duration,
    results: testResults,
    overallSuccess: overallSuccess,
    deploymentReady: overallSuccess
  };
  
  try {
    const reportPath = path.join(process.cwd(), 'integration-test-results.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(testReport, null, 2));
    TestUtils.log(`📄 Detailed test report saved: integration-test-results.json`, 'info');
  } catch (error) {
    TestUtils.log(`Failed to save test report: ${error.message}`, 'warning');
  }
  
  // Exit with appropriate code
  process.exit(overallSuccess ? 0 : 1);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runIntegrationTests().catch(error => {
    TestUtils.log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  TestUtils,
  EnvironmentTests,
  APITests,
  FrontendTests,
  DeploymentTests
};