# 🚀 Production Deployment Guide - Version 2.2.0

This guide will help you deploy your driving school website to production with professional email automation.

---

## 📋 **Pre-Deployment Checklist**

### **✅ Required Setup**
- [ ] Resend account created and API key obtained
- [ ] Domain name purchased and DNS access available
- [ ] Hosting platform selected (Vercel recommended)
- [ ] GitHub repository access confirmed
- [ ] Email addresses `dsforms@ofemo.uk` and `support@ofemo.uk` ready

### **✅ Optional Setup**
- [ ] Google Analytics account (for traffic tracking)
- [ ] WhatsApp Business account (for customer service)
- [ ] SSL certificate (usually automatic with hosting platforms)

---

## 🌟 **Recommended Deployment: Vercel**

Vercel is the recommended platform as it's built by the Next.js team and offers seamless deployment.

### **Step 1: Prepare Repository**
```bash
# Ensure you're on the stable version
git checkout main
git pull origin main

# Verify stable tag exists
git tag -l | grep v2.2.0-stable
```

### **Step 2: Deploy to Vercel**

#### **Option A: GitHub Integration (Recommended)**
1. Visit [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account
3. Click "New Project"
4. Import `knightappsdev/driving_school` repository
5. Configure settings:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

#### **Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel --prod

# Follow prompts to configure deployment
```

### **Step 3: Environment Variables**
In your Vercel dashboard, add these environment variables:

```bash
# Required for email functionality
RESEND_API_KEY=re_your_actual_api_key_here

# Application settings
BASE_URL=https://your-domain.vercel.app
WHATSAPP_BUSINESS_NUMBER=447123456789

# Database (optional - not required for core functionality)
POSTGRES_URL=postgresql://your_db_url_here
AUTH_SECRET=your_secure_random_string_here
```

### **Step 4: Domain Configuration**
1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain: `yourdomain.com`
4. Update your DNS records as instructed by Vercel

---

## 📧 **Email Configuration for Production**

### **Step 1: Domain Verification with Resend**
1. Login to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain: `ofemo.uk`
4. Add the provided DNS records to your domain:

```dns
Type: TXT
Name: @
Value: resend-verify-xyz123...

Type: MX  
Name: @
Value: 10 mx.resend.com

Type: TXT
Name: @  
Value: "v=spf1 include:_spf.resend.com ~all"

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

### **Step 2: Email Address Setup**
Once domain is verified, your email addresses will work:
- ✅ `dsforms@ofemo.uk` - Receives all form submissions
- ✅ `support@ofemo.uk` - Sends automated responses

### **Step 3: Test Email Delivery**
```bash
# Test the email API in production
curl -X POST https://your-domain.com/api/email/send-form \
  -H "Content-Type: application/json" \
  -d '{
    "type": "general-inquiry",
    "data": {
      "name": "Production Test",
      "email": "your-test@email.com",
      "message": "Testing production email delivery"
    },
    "customerEmail": "your-test@email.com"
  }'
```

---

## 🌐 **Alternative Deployment Platforms**

### **Netlify Deployment**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
```

### **Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **DigitalOcean App Platform**

Create `app.yaml`:
```yaml
name: driving-school-website
services:
- name: web
  source_dir: /
  github:
    repo: knightappsdev/driving_school
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: RESEND_API_KEY
    value: ${RESEND_API_KEY}
  - key: BASE_URL
    value: ${_self.PUBLIC_URL}
```

---

## 🔧 **Performance Optimization**

### **Image Optimization**
All images are automatically optimized by Next.js, but ensure:
```bash
# Verify image formats are optimized
# PNG/JPG images will be converted to WebP automatically
# SVG icons are used where possible
```

### **Code Splitting**
```bash
# Verify bundle analysis
npm run build
# Check output for bundle sizes and optimization
```

### **Caching Strategy**
Add to `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

---

## 📊 **Monitoring & Analytics**

### **Google Analytics Setup**
1. Create Google Analytics 4 property
2. Add tracking code to `app/layout.tsx`:

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### **Error Monitoring**
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### **Uptime Monitoring**
Set up monitoring with services like:
- **UptimeRobot** (Free basic monitoring)
- **Pingdom** (Advanced monitoring)
- **StatusCake** (Comprehensive monitoring)

---

## 🔒 **Security Best Practices**

### **Environment Security**
```bash
# Never commit sensitive data
echo "RESEND_API_KEY=*" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### **Content Security Policy**
Add to `next.config.ts`:
```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### **Rate Limiting**
The email API includes basic rate limiting, but consider adding:
- Cloudflare for DDoS protection
- API rate limiting middleware
- Form submission throttling

---

## 🧪 **Production Testing**

### **Pre-Launch Testing Checklist**

#### **✅ Functionality Tests**
- [ ] Homepage loads correctly
- [ ] All forms submit successfully
- [ ] Emails are received at dsforms@ofemo.uk
- [ ] Auto-responses sent from support@ofemo.uk
- [ ] Push notifications work
- [ ] WhatsApp widget functions
- [ ] Mobile responsiveness verified

#### **✅ Performance Tests**
```bash
# Test with Lighthouse
npm install -g lighthouse
lighthouse https://your-domain.com --view

# Test Core Web Vitals
# Target scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >90
# SEO: >95
```

#### **✅ Email Tests**
```bash
# Test all form types
curl -X POST https://your-domain.com/api/email/send-form -H "Content-Type: application/json" -d '{"type":"instructor-registration","data":{"firstName":"Test","lastName":"User","email":"test@example.com"},"customerEmail":"test@example.com"}'

curl -X POST https://your-domain.com/api/email/send-form -H "Content-Type: application/json" -d '{"type":"exit-intent","data":{"name":"Test User","email":"test@example.com","phone":"+44 7123 456 789"},"customerEmail":"test@example.com"}'
```

#### **✅ Mobile Tests**
- Test on actual mobile devices
- Verify touch interactions
- Check form usability on small screens
- Confirm push notifications on mobile

---

## 📈 **Post-Launch Optimization**

### **SEO Optimization**
```typescript
// Add to app/layout.tsx
export const metadata = {
  title: 'Professional Driving School - Learn to Drive Safely',
  description: 'Expert driving instructors, high pass rates, flexible scheduling. Book your driving lessons today!',
  keywords: 'driving lessons, driving school, ADI instructor, UK driving test',
  openGraph: {
    title: 'Professional Driving School',
    description: 'Expert driving instructors with high pass rates',
    url: 'https://your-domain.com',
    siteName: 'Professional Driving School',
  }
}
```

### **Conversion Optimization**
- Monitor form conversion rates
- A/B test call-to-action buttons
- Optimize page load speeds
- Improve mobile user experience

### **Content Updates**
- Regular instructor profile updates
- Course information maintenance
- Blog posts for SEO (optional)
- Customer testimonials addition

---

## 🚨 **Troubleshooting Common Issues**

### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
npm run build
```

### **Email Not Sending**
1. Verify `RESEND_API_KEY` is set correctly
2. Check domain verification in Resend dashboard
3. Confirm email addresses exist
4. Check API endpoint logs for errors

### **Performance Issues**
```bash
# Analyze bundle size
npm run build
# Look for large bundles and optimize imports

# Check image optimization
# Ensure images are in WebP format where possible
```

### **DNS Issues**
```bash
# Check domain propagation
dig your-domain.com
nslookup your-domain.com

# Verify DNS records
dig MX ofemo.uk
dig TXT ofemo.uk
```

---

## 🎯 **Success Metrics**

### **Technical Metrics**
- **Uptime**: Target 99.9% availability
- **Page Load**: < 3 seconds on mobile
- **Core Web Vitals**: All green scores
- **Email Delivery**: >98% success rate

### **Business Metrics**
- **Form Conversions**: Track submission rates
- **Email Opens**: Monitor customer engagement
- **Lead Quality**: Assess inquiry relevance
- **Customer Response**: Measure follow-up success

---

## 📞 **Support & Maintenance**

### **Regular Tasks**
- **Weekly**: Review email delivery rates
- **Monthly**: Check performance metrics
- **Quarterly**: Update dependencies
- **Annually**: Review and update content

### **Emergency Contacts**
- **DNS Issues**: Contact domain registrar
- **Email Problems**: Resend support
- **Hosting Issues**: Platform support
- **Code Issues**: GitHub repository

---

## 🎉 **Launch Checklist**

### **Final Steps**
- [ ] All environment variables configured
- [ ] Domain DNS records updated
- [ ] Email addresses verified and tested  
- [ ] Performance tests passed
- [ ] Mobile responsiveness confirmed
- [ ] Analytics tracking enabled
- [ ] Backup procedures documented
- [ ] Team training completed

### **Go Live**
1. **Switch DNS** to point to new deployment
2. **Monitor closely** for first 24 hours
3. **Test all functionality** after DNS propagation
4. **Announce launch** to stakeholders
5. **Begin regular monitoring** routine

---

## 🏆 **Congratulations!**

Your professional driving school website is now live with:
- ✅ Professional email automation
- ✅ Modern responsive design
- ✅ PWA capabilities
- ✅ Comprehensive form management
- ✅ Production-grade performance

**🌐 Your website is ready to capture leads and grow your business!**

---

*Need help? Check the troubleshooting section or create an issue in the GitHub repository.*