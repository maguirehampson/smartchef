#!/usr/bin/env node

/**
 * SmartChef Waitlist Environment Setup Script
 * 
 * This script helps users quickly set up their environment variables
 * by creating a .env.local file with the correct structure.
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# SmartChef Waitlist - Environment Variables
# Copy this file to .env.local and update with your actual values

# MailerLite Configuration (REQUIRED)
# Get your API key from: https://app.mailerlite.com/integrations/api
MAILERLITE_API_KEY=your_mailerlite_api_key_here

# Get your Group ID from MailerLite dashboard: Subscribers > Groups
# The Group ID is the number in the URL when you click on a group
MAILERLITE_GROUP_ID=your_mailerlite_group_id_here

# Site Configuration (Optional)
# Set this to your production domain for CORS and meta tags
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics Configuration (Optional)
# Get your token from: https://splitbee.io/
NEXT_PUBLIC_SPLITBEE_TOKEN=your_splitbee_token_here

# Search Engine Verification (Optional)
# Add these if you want to verify your site with search engines
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code
`;

const envLocalPath = path.join(__dirname, '.env.local');

console.log('🚀 SmartChef Waitlist Environment Setup\n');

// Check if .env.local already exists
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('If you want to overwrite it, delete the file and run this script again.');
  console.log('Otherwise, manually edit the existing file with your MailerLite credentials.');
  process.exit(0);
}

try {
  // Create .env.local file
  fs.writeFileSync(envLocalPath, envTemplate);
  
  console.log('✅ Created .env.local file successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Edit .env.local and replace the placeholder values with your actual credentials');
  console.log('2. Get your MailerLite API key from: https://app.mailerlite.com/integrations/api');
  console.log('3. Get your MailerLite Group ID from your MailerLite dashboard');
  console.log('4. Restart your development server: npm run dev');
  console.log('');
  console.log('📖 For detailed instructions, see ENVIRONMENT_SETUP.md');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('');
  console.log('Please manually create a .env.local file in the project root with the following content:');
  console.log('');
  console.log(envTemplate);
  process.exit(1);
} 