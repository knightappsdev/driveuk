# 📧 Email Setup Guide

This guide will help you configure email functionality for your driving school website to capture form submissions and send automated responses.

## 📋 Overview

The email system captures all form submissions and sends them to **dsforms@ofemo.uk**, while automated responses are sent from **support@ofemo.uk** to provide professional customer service.

## 🔧 Setup Steps

### 1. Get a Resend API Key

1. Visit [Resend.com](https://resend.com) and create an account
2. Go to [API Keys](https://resend.com/api-keys) 
3. Create a new API key
4. Copy the API key (it starts with `re_`)

### 2. Configure Environment Variables

Update your `.env` file with your Resend API key:

```bash
# Email Configuration (Resend API)
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Domain Verification (Production Only)

For production use, you'll need to verify your domain with Resend:

1. In your Resend dashboard, go to **Domains**
2. Add your domain (e.g., `ofemo.uk`)
3. Add the provided DNS records to your domain
4. Wait for verification (usually takes a few minutes)

**Note:** For development/testing, you can use the default `noreply@resend.dev` sender.

### 4. Update Email Addresses (Optional)

If you want to use different email addresses, update the configuration in `lib/email/config.ts`:

```typescript
export const EMAIL_CONFIG = {
  // Where form submissions are sent
  FORM_RECIPIENT: 'your-forms@yourdomain.com',
  // Where automated responses come from  
  SUPPORT_SENDER: 'support@yourdomain.com',
  // Fallback sender (always works)
  FALLBACK_SENDER: 'noreply@resend.dev',
} as const;
```

## 📝 Form Types Supported

The system automatically captures and emails all form submissions:

### 1. **Instructor Registration Form**
- **Path:** `/instructor-registration`
- **Captures:** Full instructor application with qualifications, experience, availability
- **Email Subject:** "New Instructor Application - [Name]"
- **Auto-Response:** Application confirmation with next steps

### 2. **Free Lesson Request (Exit Intent)**
- **Triggers:** When user tries to leave the site
- **Captures:** Name, email, phone number
- **Email Subject:** "New Free Lesson Request - [Name]"  
- **Auto-Response:** Lesson confirmation with scheduling info

### 3. **WhatsApp Contact Form**
- **Triggers:** When user provides contact info in WhatsApp widget
- **Captures:** Message, contact details, message type
- **Email Subject:** "New WhatsApp Contact - [Name]"
- **Auto-Response:** Contact confirmation

## 📧 Email Templates

### Submission Emails (to dsforms@ofemo.uk)
- Professional format with all form data
- Includes timestamp and technical information
- Clear next steps for your team
- Responsive HTML design

### Auto-Response Emails (from support@ofemo.uk)
- Branded with driving school information
- Personalized based on form type
- Clear expectations and contact information
- Mobile-friendly design

## 🔍 Testing the Setup

### 1. Test in Development

```bash
# Start the application
npm run dev

# Test forms:
# 1. Visit /instructor-registration and submit
# 2. Try to leave the page to trigger exit intent
# 3. Use WhatsApp widget with contact info
```

### 2. Check Email Delivery

1. Monitor your `dsforms@ofemo.uk` inbox for form submissions
2. Check that customers receive auto-responses from `support@ofemo.uk`
3. Verify emails are not going to spam folders

### 3. API Testing

You can also test the API directly:

```bash
curl -X POST http://localhost:3000/api/email/send-form \
  -H "Content-Type: application/json" \
  -d '{
    "type": "general-inquiry",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "message": "This is a test message"
    },
    "customerEmail": "test@example.com"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **"Missing API Key" Error**
   - Ensure `RESEND_API_KEY` is set in your `.env` file
   - Verify the API key starts with `re_`

2. **Emails Not Sending**
   - Check your Resend dashboard for error logs
   - Verify domain is properly configured for production
   - Ensure sender email is verified

3. **Auto-Responses Not Received**
   - Check customer's spam folder
   - Verify `customerEmail` field is provided in form submission
   - Test with a different email provider

4. **Form Submission Fails**
   - Check browser console for JavaScript errors
   - Verify API endpoint is accessible
   - Test API directly with curl

### Support

- **Resend Documentation:** [docs.resend.com](https://resend.com/docs)
- **API Reference:** [resend.com/docs/api-reference](https://resend.com/docs/api-reference)

## 🎯 Production Deployment

When deploying to production:

1. **Environment Variables:** Add `RESEND_API_KEY` to your hosting platform
2. **Domain Verification:** Verify your domain in Resend
3. **Email Testing:** Test all form types in production
4. **Monitoring:** Set up monitoring for email delivery

## 💡 Features

✅ **Automatic Form Capture** - All forms automatically send emails
✅ **Professional Templates** - Branded, responsive email templates  
✅ **Dual Email System** - Submissions to you, responses to customers
✅ **Error Handling** - Graceful fallbacks if email fails
✅ **Detailed Logging** - Full audit trail of form submissions
✅ **Mobile Optimized** - Perfect display on all devices

Your driving school website now has professional email automation! 🚗✨