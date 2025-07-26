# SmartChef Waitlist - Deployment Checklist

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
   ```bash
   npm run build
   npm run start
   ```

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Test with production values

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

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

Generated on: 2025-07-26T02:57:38.600Z
