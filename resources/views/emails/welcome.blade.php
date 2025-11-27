<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to macOS Icons</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo img {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
        }
        .logo-text {
            font-size: 24px;
            font-weight: 600;
            color: #1b1b18;
            margin: 0;
        }
        .greeting {
            font-size: 18px;
            color: #1b1b18;
            margin-bottom: 20px;
        }
        .content {
            color: #666;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1b1b18;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .feature {
            margin-bottom: 15px;
        }
        .feature-title {
            font-weight: 600;
            color: #1b1b18;
            margin-bottom: 5px;
        }
        .feature-description {
            color: #666;
            font-size: 14px;
        }
        .tips {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .tips ul {
            margin: 0;
            padding-left: 20px;
        }
        .tips li {
            margin-bottom: 8px;
            color: #666;
        }
        .button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Logo -->
        <div class="logo">
            <img src="{{ $logoUrl }}" alt="macOS Icons Logo">
            <p class="logo-text">macOS Icons</p>
        </div>

        <!-- Greeting -->
        <div class="greeting">
            Hello {{ $userName }}! 👋
        </div>

        <!-- Welcome Message -->
        <div class="content">
            <p>Welcome to <strong>macOS Icons</strong> - Your ultimate destination for beautiful, high-quality macOS-style icons!</p>
            <p>We're thrilled to have you join our creative community of designers and developers.</p>
        </div>

        <!-- What You Can Do -->
        <div class="section-title">🚀 What You Can Do Now:</div>

        <div class="feature">
            <div class="feature-title">📤 Upload Your Icons</div>
            <div class="feature-description">Share your stunning macOS-style icon designs with the community. Support for SVG and ICNS formats.</div>
        </div>

        <div class="feature">
            <div class="feature-title">🔍 Browse & Download</div>
            <div class="feature-description">Explore thousands of beautiful macOS-style icons created by talented designers worldwide.</div>
        </div>

        <div class="feature">
            <div class="feature-title">💼 Manage Your Collection</div>
            <div class="feature-description">Keep track of all your uploaded icons in one convenient dashboard.</div>
        </div>

        <div class="feature">
            <div class="feature-title">📊 Track Performance</div>
            <div class="feature-description">See how many times your icons have been downloaded and appreciated.</div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center;">
            <a href="{{ url('/dashboard') }}" class="button">🎨 Go to Dashboard</a>
        </div>

        <!-- Quick Tips -->
        <div class="section-title">💡 Quick Tips:</div>
        <div class="tips">
            <ul>
                <li>Use descriptive names for your icons to help others find them</li>
                <li>Add relevant tags and categories for better discoverability</li>
                <li>High-quality macOS-style icons get more downloads!</li>
            </ul>
        </div>

        <!-- Help Section -->
        <div class="section-title">🆘 Need Help?</div>
        <div class="content">
            <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this email or visit our help center.</p>
        </div>

        <!-- Closing -->
        <div class="content" style="margin-top: 30px;">
            <p>Happy designing! We can't wait to see what you create! 🎨✨</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Best regards,</strong><br>
            <strong>The macOS Icons Team</strong><br>
            <em>Building the world's best macOS icon library, together.</em></p>
        </div>
    </div>
</body>
</html>

