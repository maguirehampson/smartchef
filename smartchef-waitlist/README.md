# SmartChef Waitlist Landing Page

A high-converting, production-ready Next.js landing page for the SmartChef AI cooking assistant waitlist. Features responsive design, animated UI elements, email capture with MailerLite integration, and comprehensive analytics tracking.

## 🚀 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Interactive Animations**: Smooth Framer Motion animations and transitions
- **Email Capture**: MailerLite API integration for waitlist management
- **Analytics Tracking**: Comprehensive analytics with Vercel Analytics, Speed Insights, and Splitbee
- **Performance Optimized**: <1.5s load time on 4G connections
- **SEO Optimized**: Complete meta tags, Open Graph, and Twitter Cards
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: WCAG compliant with proper semantic HTML

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom design system
- **Animations**: Framer Motion 12.x
- **Icons**: Lucide React
- **Analytics**: Triple analytics setup (Vercel Analytics + Speed Insights + Splitbee)
- **Email Service**: MailerLite API
- **Deployment**: Vercel (optimized)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- MailerLite account and API key
- Splitbee account (optional, for analytics)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartchef-waitlist
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Copy the environment template:
   ```bash
   cp .env.local.template .env.local
   ```

   **REQUIRED**: Update `.env.local` with your configuration:
   ```env
   # MailerLite Configuration (REQUIRED)
   MAILERLITE_API_KEY=your_mailerlite_api_key_here
   MAILERLITE_GROUP_ID=your_mailerlite_group_id_here
   
   # Analytics Configuration (Optional)
   NEXT_PUBLIC_SPLITBEE_TOKEN=your_splitbee_token_here
   ```

## 🔑 MailerLite Setup (REQUIRED)

### Step 1: Get Your API Key
1. Log in to your [MailerLite account](https://app.mailerlite.com/)
2. Go to **Integrations** → **Developer API**
3. Copy your API key
4. Add it to `.env.local` as `MAILERLITE_API_KEY`

### Step 2: Get Your Group ID
1. In MailerLite, go to **Subscribers** → **Groups**
2. Create a new group called "SmartChef Waitlist" (or use existing)
3. Click on the group and copy the Group ID from the URL
4. Add it to `.env.local` as `MAILERLITE_GROUP_ID`

### Step 3: Test Configuration
```bash
npm run dev
```
Visit `http://localhost:3000` and test the signup form to ensure MailerLite integration works.

## 📊 Analytics Setup

### Vercel Analytics (Automatic)
Vercel Analytics is automatically enabled when deployed to Vercel. It provides:
- **Page Views**: Automatic tracking of all page visits
- **Performance Metrics**: Core Web Vitals and performance data
- **User Behavior**: Click tracking and user journey analysis
- **Real-time Data**: Live dashboard in Vercel console
- **Zero Configuration**: Works out of the box with Vercel deployment

### Splitbee Configuration (Optional)
1. Sign up at [Splitbee](https://splitbee.io/)
2. Create a new project
3. Copy your project token
4. Add it to `.env.local` as `NEXT_PUBLIC_SPLITBEE_TOKEN`

### Tracked Events
- `pageView`: Automatic page view tracking (Vercel Analytics + Splitbee)
- `signup_event`: Successful email signups
- `signup_error`: Failed signup attempts
- `cta_click`: Call-to-action button clicks
- `thank_you_page_view`: Thank you page visits

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 📁 Project Structure

```
smartchef-waitlist/
├── src/
│   ├── app/
│   │   ├── api/signup/route.ts    # MailerLite API integration
│   │   ├── globals.css            # Global styles and theme
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── page.tsx               # Main landing page component
├── public/
│   ├── scripts/signup.js          # Client-side form handling
│   ├── style.css                  # Custom CSS utilities
│   └── thank-you.html             # Success confirmation page
├── .env.local.template            # Environment variables template
├── tailwind.config.ts             # Tailwind CSS configuration
└── next.config.ts                 # Next.js configuration
```

## 🎨 Design System

### Brand Colors
- **Primary**: Orange (#f2750a) - CTAs, brand elements
- **Secondary**: Blue (#0ea5e9) - Links, secondary CTAs
- **Accent**: Purple (#d946ef) - Highlights, gradients

### Typography
- **Primary**: Inter (Google Fonts)
- **Monospace**: Fira Code
- **Scale**: 9 sizes from xs (12px) to 9xl (128px)

### Animations
- Entrance animations (fade, slide)
- Continuous animations (float, pulse)
- Background gradients (dynamic)
- Performance optimized with CSS transforms

## 🔒 Security Considerations

- **Input Sanitization**: All form inputs are sanitized
- **Environment Variables**: Sensitive data stored securely
- **Rate Limiting**: API endpoints include rate limiting
- **XSS Prevention**: Proper data encoding throughout
- **HTTPS**: Enforced in production

## 📈 Performance Optimizations

- **Static Generation**: Next.js optimized builds
- **Image Optimization**: Automatic image optimization
- **Font Loading**: Optimized Google Fonts loading
- **CSS Purging**: Unused CSS removed in production
- **Bundle Splitting**: Automatic code splitting

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form submission with valid email
- [ ] Form validation with invalid email
- [ ] Network error handling
- [ ] Mobile responsiveness (320px+)
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox)
- [ ] Analytics event tracking
- [ ] Thank you page functionality

### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `MAILERLITE_API_KEY`
   - `MAILERLITE_GROUP_ID`
   - `NEXT_PUBLIC_SPLITBEE_TOKEN` (optional)
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
MAILERLITE_API_KEY=your_production_api_key
MAILERLITE_GROUP_ID=your_production_group_id
NEXT_PUBLIC_SPLITBEE_TOKEN=your_production_token
# Vercel Analytics is automatically configured when deployed to Vercel
```

## 🐛 Troubleshooting

### Common Issues

**"Service temporarily unavailable" error**
- Check that `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID` are set in `.env.local`
- Verify API key is valid in MailerLite dashboard
- Ensure Group ID exists and is accessible

**Form submission not working**
- Check browser console for JavaScript errors
- Verify API route is accessible at `/api/signup`
- Test with network tab open to see API responses

**Analytics not tracking**
- **Vercel Analytics**: Check Vercel dashboard for analytics data (automatic when deployed to Vercel)
- **Splitbee**: Verify Splitbee script is loading (check Network tab)
- **Splitbee**: Ensure `NEXT_PUBLIC_SPLITBEE_TOKEN` is set correctly
- **Splitbee**: Check Splitbee dashboard for incoming events

## 📝 TODO Items

### Before Production Deployment
- [ ] Update `MAILERLITE_API_KEY` in production environment
- [ ] Update `MAILERLITE_GROUP_ID` in production environment
- [ ] Create and add `og-image.png` (1200x630px) to public directory
- [ ] Add Google Search Console verification code
- [ ] Update Twitter handle in metadata
- [ ] Test email delivery from production environment
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain and SSL certificate

### Future Enhancements
- [ ] A/B testing framework integration
- [ ] Email service migration abstraction layer
- [ ] User authentication and profile management
- [ ] Internationalization (i18n) support
- [ ] Enhanced analytics with conversion funnels
- [ ] Content management system integration
- [ ] Progressive Web App (PWA) features

## 📄 License

This project is proprietary software owned by SmartChef. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or issues, contact the SmartChef development team.

## 📞 Support

For technical support or questions about this implementation:
- Review the troubleshooting section above
- Check the browser console for error messages
- Verify all environment variables are configured correctly
- Test the MailerLite API connection independently

---

**Built with ❤️ by the SmartChef Team**