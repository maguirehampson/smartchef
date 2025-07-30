# Environment Setup Guide

## Quick Fix for "Invalid API key format: undefined" Error

The error you're seeing indicates that the required environment variables are not configured. Follow these steps to fix it:

## Step 1: Create Environment File

**Option A: Quick Setup (Recommended)**
```bash
# In the smartchef-waitlist directory
npm run setup-env
```

**Option B: Manual Setup**
Create a `.env.local` file in the project root (`smartchef-waitlist/.env.local`):

```bash
# In the smartchef-waitlist directory
touch .env.local
```

## Step 2: Get MailerLite API Key

1. Log in to your [MailerLite account](https://app.mailerlite.com/)
2. Go to **Integrations** → **Developer API**
3. Copy your API key
4. Add it to `.env.local`:
   ```
   MAILERLITE_API_KEY=your_actual_api_key_here
   ```

## Step 3: Get MailerLite Group ID

1. In MailerLite, go to **Subscribers** → **Groups**
2. Create a new group called "SmartChef Waitlist" (or use existing)
3. Click on the group and copy the Group ID from the URL
   - The URL will look like: `https://app.mailerlite.com/subscribers/groups/123456`
   - The number at the end (e.g., `123456`) is your Group ID
4. Add it to `.env.local`:
   ```
   MAILERLITE_GROUP_ID=123456
   ```

## Step 4: Complete Environment File

Your `.env.local` file should look like this:

```env
# MailerLite Configuration (REQUIRED)
MAILERLITE_API_KEY=ml_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILERLITE_GROUP_ID=123456

# Site Configuration (Optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics Configuration (Optional)
NEXT_PUBLIC_SPLITBEE_TOKEN=your_splitbee_token_here
```

## Step 5: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Step 6: Test Configuration

Visit `http://localhost:3000` and test the signup form. The error should be resolved.

## Troubleshooting

### If you still get errors:

1. **Check file location**: Ensure `.env.local` is in the `smartchef-waitlist/` directory
2. **Check file format**: No spaces around the `=` sign
3. **Restart server**: Environment variables require a server restart
4. **Check API key format**: Should start with `ml_` and be ~40 characters
5. **Check Group ID**: Should be numeric only

### Common Issues:

- **"Invalid API key format"**: API key is too short/long or contains invalid characters
- **"Invalid group ID format"**: Group ID contains non-numeric characters
- **"Missing required environment variables"**: `.env.local` file is missing or variables are not set

## Production Deployment

For production deployment on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same variables:
   - `MAILERLITE_API_KEY`
   - `MAILERLITE_GROUP_ID`
4. Redeploy your application

## Security Notes

- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Use different API keys for development and production
- Regularly rotate your API keys for security

## Need Help?

If you're still having issues:

1. Check the server logs for detailed error messages
2. Verify your MailerLite account has API access enabled
3. Ensure your API key has the necessary permissions
4. Test your API key directly with MailerLite's API documentation 