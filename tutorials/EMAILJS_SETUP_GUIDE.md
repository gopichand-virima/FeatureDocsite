# EmailJS Setup Guide for Feedback System

This guide will help you configure the email integration for the Virima documentation feedback system.

## Overview

The feedback system is now configured to send emails to **gopichand.y@virima.com** using EmailJS, a service that allows sending emails directly from client-side applications.

## Setup Steps

### 1. Create a Free EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Confirm your email address

### 2. Add an Email Service

1. After logging in, go to the **Email Services** section
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. **Copy the Service ID** (you'll need this later)

### 3. Create an Email Template

1. Go to the **Email Templates** section
2. Click "Create New Template"
3. Use the following template configuration:

**Template Name:** `virima_documentation_feedback`

**Template Content:**
```
Subject: 📝 New Documentation Feedback: {{feedback_type}}

From: {{from_name}}
Page: {{page_title}}
URL: {{page_url}}

Feedback Type: {{feedback_type}}
User Role: {{user_role}}
NPS Score: {{nps_score}}

Selected Reasons:
{{reasons}}

Comments:
{{comments}}

Submitted: {{timestamp}}
```

4. **Copy the Template ID** (you'll need this later)

### 4. Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** in the API Keys section
3. **Copy the Public Key**

### 5. Update the Code

Open `/components/FeedbackSection.tsx` and replace the placeholder values around line 137:

```typescript
await emailjs.send(
  'YOUR_SERVICE_ID',  // Replace with your Service ID from step 2
  'YOUR_TEMPLATE_ID', // Replace with your Template ID from step 3
  emailContent,
  'YOUR_PUBLIC_KEY'   // Replace with your Public Key from step 4
);
```

**Example:**
```typescript
await emailjs.send(
  'service_abc123',
  'template_xyz789',
  emailContent,
  'user_ABCDEFGHIJK123456'
);
```

## Email Content Structure

Each feedback submission will include:

- **Page URL**: The documentation page where feedback was submitted
- **Page Title**: The title of the documentation page
- **Feedback Type**: Positive (👍) or Negative (👎)
- **User Role**: The role selected by the user (Developer, Administrator, etc.)
- **Reasons**: Selected checkbox reasons for the feedback
- **Comments**: Additional comments provided by the user
- **NPS Score**: Net Promoter Score (0-10) for positive feedback only
- **Timestamp**: When the feedback was submitted

## Testing

After configuration:

1. Navigate to any documentation page (not the homepage)
2. Scroll to the bottom and click the feedback thumbs up/down
3. Fill out the form and submit
4. Check the inbox at gopichand.y@virima.com for the email

## Troubleshooting

### Emails not arriving?

1. Check your EmailJS dashboard to verify the service is active
2. Verify all three IDs (Service ID, Template ID, Public Key) are correct
3. Check the browser console for any error messages
4. Ensure your EmailJS account email is verified
5. Check spam/junk folders

### Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Standard email templates
- Basic analytics

For higher volumes, consider upgrading to a paid plan.

## Security Notes

- EmailJS Public Key is safe to use in client-side code
- The system includes warnings not to submit personal or sensitive information
- All feedback is sent to a single designated email address
- No PII (Personally Identifiable Information) is requested in the form

## Alternative Solutions

If you prefer a different approach, consider:

1. **Formspree**: Simple form-to-email service
2. **Supabase**: Full backend with database and email triggers
3. **Custom Backend**: Build your own API endpoint for email sending

## Support

For EmailJS-specific issues:
- Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

For Virima documentation feedback system issues:
- Review the code in `/components/FeedbackSection.tsx`
- Check browser console for errors
- Verify the form validation is working correctly
