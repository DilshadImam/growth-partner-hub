# 📧 Email Configuration for Railway

## Gmail App Password Setup

To enable email features (contact forms, booking notifications), you need to configure Gmail:

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select **App**: Mail
3. Select **Device**: Other (Custom name)
4. Enter name: "Railway Backend"
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Add to Railway Environment Variables

In Railway dashboard, add these variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop (16-char app password, no spaces)
EMAIL_FROM=noreply@yourdomain.com
BUSINESS_EMAIL=your-business@gmail.com
```

### Step 4: Redeploy

After adding variables, redeploy your Railway service.

## Testing Email

After deployment, test by:
1. Submitting a contact form on your website
2. Booking a service
3. Check your BUSINESS_EMAIL inbox

## Troubleshooting

### "Nodemailer not properly configured"
- This warning means email variables are missing
- Email features will be disabled but app will still work
- Add EMAIL_* variables to enable email

### "Invalid login"
- Make sure you're using App Password, not regular password
- Remove any spaces from the app password
- Verify EMAIL_USER is correct

### "Connection timeout"
- Check EMAIL_HOST and EMAIL_PORT are correct
- Verify your Railway service can access external SMTP

## Alternative: SendGrid (Recommended for Production)

For better deliverability, use SendGrid:

1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Get API key
3. Update Railway variables:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
BUSINESS_EMAIL=your-business@gmail.com
```

## Email Features

When configured, these features work:
- ✅ Contact form submissions
- ✅ Service booking notifications
- ✅ Lead notifications
- ✅ Welcome emails (if implemented)

## Optional: Skip Email Configuration

If you don't need email features:
- Don't add EMAIL_* variables
- App will work fine without email
- Forms will still save to database
- You can check submissions in admin panel
