# Email Configuration Guide - macOS Icons

## Overview
macOS Icons sends emails for:
- 🎉 **Welcome Email** - When users register (no verification required)
- 🔑 **Password Reset** - When users forget password
- 🔐 **Two-Factor Authentication** - Setup codes

## Current Configuration

The app is currently configured to **log emails** instead of sending them. This is perfect for development/testing.

### View Sent Emails
All emails are logged to: `storage/logs/laravel.log`

Search for "Mail" in the log file to see email content.

## Production Setup Options

### Option 1: Gmail SMTP (Free, Easy)

Update your `.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="macOS Icons"
```

**Important:** Use [App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

### Option 2: Mailtrap (Development/Testing)

Perfect for testing without sending real emails:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=hello@macos-icons.test
MAIL_FROM_NAME="macOS Icons"
```

Get credentials from: https://mailtrap.io

### Option 3: SendGrid (Production)

Reliable for production:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="macOS Icons"
```

Get API key from: https://sendgrid.com

### Option 4: Mailgun (Production)

```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-api-key
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="macOS Icons"
```

## Testing Email Functionality

### 1. Test Welcome Email (Registration)
```bash
# Register a new user via the web interface
# Check storage/logs/laravel.log for the welcome email
# User can login immediately without verification
```

### 2. Test Password Reset Email
```bash
# Click "Forgot Password" on login page
# Enter email and submit
# Check storage/logs/laravel.log for the reset link
```

### 3. Test via Tinker
```bash
php artisan tinker

# Send a test email
Mail::raw('Test email from macOS Icons', function ($message) {
    $message->to('test@example.com')
            ->subject('Test Email');
});
```

## Email Templates Location

Email templates are located in:
- `resources/views/vendor/notifications/` (if customized)
- Laravel's default templates (if not customized)

## Customize Email Templates

To customize email templates:

```bash
php artisan vendor:publish --tag=laravel-notifications
php artisan vendor:publish --tag=laravel-mail
```

Then edit files in `resources/views/vendor/`

## Troubleshooting

### Emails not sending?
1. Check `storage/logs/laravel.log` for errors
2. Verify `.env` mail configuration
3. Clear config cache: `php artisan config:clear`
4. Test SMTP connection

### Gmail "Less secure app" error?
Use [App Passwords](https://support.google.com/accounts/answer/185833) instead of your regular password.

### Emails going to spam?
1. Use a proper domain email (not Gmail)
2. Set up SPF, DKIM, and DMARC records
3. Use a reputable email service (SendGrid, Mailgun)

## Email Queue (Optional)

For better performance, use queues:

```env
QUEUE_CONNECTION=database
```

Then run:
```bash
php artisan queue:table
php artisan migrate
php artisan queue:work
```

## Support

For more information, see:
- [Laravel Mail Documentation](https://laravel.com/docs/mail)
- [Laravel Fortify Documentation](https://laravel.com/docs/fortify)

