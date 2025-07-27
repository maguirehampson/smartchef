/**
 * Vercel Analytics Diagnostic Test
 * 
 * This script tests and diagnoses Vercel Analytics integration issues.
 * Run with: node test-vercel-analytics.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Analytics Diagnostic Test');
console.log('=====================================\n');

// Test 1: Check package installation
console.log('📦 Test 1: Package Installation');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const analyticsVersion = packageJson.dependencies['@vercel/analytics'];
  const speedInsightsVersion = packageJson.dependencies['@vercel/speed-insights'];
  
  if (analyticsVersion) {
    console.log(`✅ @vercel/analytics installed: ${analyticsVersion}`);
  } else {
    console.log('❌ @vercel/analytics not found in dependencies');
  }
  
  if (speedInsightsVersion) {
    console.log(`✅ @vercel/speed-insights installed: ${speedInsightsVersion}`);
  } else {
    console.log('❌ @vercel/speed-insights not found in dependencies');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n📄 Test 2: Layout Implementation');
try {
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  
  // Check imports
  const hasAnalyticsImport = layoutContent.includes("import { Analytics } from '@vercel/analytics/react'");
  const hasSpeedInsightsImport = layoutContent.includes("import { SpeedInsights } from '@vercel/speed-insights/next'");
  
  // Check component usage
  const hasAnalyticsComponent = layoutContent.includes('<Analytics />');
  const hasSpeedInsightsComponent = layoutContent.includes('<SpeedInsights />');
  
  console.log(`${hasAnalyticsImport ? '✅' : '❌'} Analytics import: ${hasAnalyticsImport}`);
  console.log(`${hasSpeedInsightsImport ? '✅' : '❌'} SpeedInsights import: ${hasSpeedInsightsImport}`);
  console.log(`${hasAnalyticsComponent ? '✅' : '❌'} Analytics component: ${hasAnalyticsComponent}`);
  console.log(`${hasSpeedInsightsComponent ? '✅' : '❌'} SpeedInsights component: ${hasSpeedInsightsComponent}`);
  
} catch (error) {
  console.log('❌ Error reading layout.tsx:', error.message);
}

console.log('\n🌐 Test 3: Environment & Deployment');
const nodeEnv = process.env.NODE_ENV || 'development';
const vercelEnv = process.env.VERCEL_ENV;
const vercelUrl = process.env.VERCEL_URL;

console.log(`📍 NODE_ENV: ${nodeEnv}`);
console.log(`📍 VERCEL_ENV: ${vercelEnv || 'not set (local development)'}`);
console.log(`📍 VERCEL_URL: ${vercelUrl || 'not set (local development)'}`);

console.log('\n🔧 Test 4: Common Issues Check');

// Check for common issues
const issues = [];

if (nodeEnv === 'development') {
  issues.push('⚠️  Running in development mode - Vercel Analytics may not track in dev');
}

if (!vercelEnv) {
  issues.push('⚠️  Not deployed to Vercel - Analytics only works on Vercel-hosted sites');
}

try {
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  if (nextConfig.includes('output: \'export\'')) {
    issues.push('❌ Static export detected - Vercel Analytics doesn\'t work with static exports');
  }
} catch (error) {
  // next.config.ts might not exist
}

if (issues.length === 0) {
  console.log('✅ No common issues detected');
} else {
  issues.forEach(issue => console.log(issue));
}

console.log('\n🎯 Test 5: Deployment URL Analysis');
const deploymentUrl = 'https://smartchef-tau.vercel.app/';
console.log(`🔗 Deployment URL: ${deploymentUrl}`);

// Extract project info from URL
const urlMatch = deploymentUrl.match(/https:\/\/([^-]+)-([^.]+)\.vercel\.app/);
if (urlMatch) {
  const [, projectName, hash] = urlMatch;
  console.log(`📝 Project name from URL: ${projectName}`);
  console.log(`🔑 Deployment hash: ${hash}`);
} else {
  console.log('⚠️  URL doesn\'t match expected Vercel pattern');
}

console.log('\n📊 Test 6: Analytics Script Detection');
console.log('To test if analytics is working on your live site:');
console.log('1. Open browser dev tools (F12)');
console.log('2. Go to Network tab');
console.log('3. Visit your site: https://smartchef-tau.vercel.app/');
console.log('4. Look for requests to:');
console.log('   - vitals.vercel-analytics.com');
console.log('   - vitals.vercel-insights.com');
console.log('5. Check Console for any Vercel Analytics errors');

console.log('\n🔍 Diagnostic Summary');
console.log('====================');
console.log('If analytics still isn\'t working:');
console.log('1. Ensure you\'re testing on the live Vercel deployment');
console.log('2. Check Vercel dashboard > Analytics tab');
console.log('3. Analytics data may take 5-10 minutes to appear');
console.log('4. Verify the project is linked to your Vercel account');
console.log('5. Check browser console for JavaScript errors');

console.log('\n✨ Next Steps:');
console.log('- Visit your live site and perform some actions');
console.log('- Wait 5-10 minutes for data to appear');
console.log('- Check Vercel dashboard > Project > Analytics');
console.log('- If still no data, check browser network requests');