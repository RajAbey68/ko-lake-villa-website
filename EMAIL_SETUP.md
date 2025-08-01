# Email Setup for Ko Lake Villa Contact Form

## Overview
The contact form is configured to send emails to multiple recipients when a visitor submits a message through the website.

## Email Recipients
All contact form submissions are automatically sent to:
- contact@KolakeHouse.com
- RajAbey68@gmail.com
- Amir.laurie@gmail.com
- RajivAB@Hotmail.com
- contact.KoLac@gmail.com

## SMTP Configuration

### 1. Create a `.env.local` file in your project root:

```env
# Email Configuration for Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@kolakeHouse.com
SMTP_PASSWORD=your_app_password_here
```

### 2. Email Provider Setup

#### For Gmail (Recommended):
1. Enable 2-factor authentication on the sending Gmail account
2. Generate an "App Password" (not your regular password)
3. Use the app password in `SMTP_PASSWORD`
4. Set `SMTP_HOST=smtp.gmail.com` and `SMTP_PORT=587`

#### For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### For Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### 3. Security Notes
- Never commit `.env.local` to git (it's already in .gitignore)
- Use app passwords, not regular account passwords
- Ensure your SMTP account has sending permissions

## Email Template
The system sends formatted HTML emails with:
- Ko Lake Villa branding
- Contact details (name, email, phone, subject)
- Full message content
- Timestamp
- Reply-to functionality (recipients can reply directly to the customer)

## Testing
1. Deploy the application with proper environment variables
2. Submit a test message through the contact form
3. Check all recipient emails for delivery
4. Verify the email formatting and reply functionality

## Troubleshooting

### Common Issues:
1. **Email not sending**: Check SMTP credentials in `.env.local`
2. **Authentication failed**: Ensure you're using app passwords, not regular passwords
3. **Form submission timeout**: Check server logs for specific SMTP errors
4. **Emails in spam**: Consider using a dedicated email service like SendGrid for production

### Production Recommendations:
- Consider using SendGrid, Mailgun, or AWS SES for reliable delivery
- Set up SPF, DKIM, and DMARC records for your domain
- Monitor bounce rates and delivery metrics
- Implement rate limiting to prevent spam

## Alternative Configuration
For production environments, consider using dedicated email services:

### SendGrid Example:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### Mailgun Example:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_smtp_user
SMTP_PASSWORD=your_mailgun_smtp_password
``` 