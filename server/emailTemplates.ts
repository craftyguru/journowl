import { MailService } from '@sendgrid/mail';

export interface EmailTemplate {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

// Get base URL for verification links
function getBaseUrl(): string {
  // Use REPLIT_DOMAINS for production deployment compatibility
  if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    return `https://${domains[0]}`;
  }
  if (process.env.BASE_URL) return process.env.BASE_URL;
  return 'http://localhost:5000';
}

export function createWelcomeEmailTemplate(
  userEmail: string,
  userName: string,
  verificationToken: string
): EmailTemplate {
  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JournOwl - Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Professional Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
      <div style="font-size: 48px; margin-bottom: 10px;">🦉</div>
      <h1 style="font-size: 28px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Welcome to JournOwl</h1>
      <p style="font-size: 16px; margin: 8px 0 0 0; opacity: 0.9;">Your intelligent writing companion awaits</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px 30px;">
      <h2 style="font-size: 24px; color: #1a202c; margin: 0 0 20px 0; font-weight: 600;">Hello ${userName}! 🎉</h2>
      
      <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
        Welcome to <span style="color: #667eea; font-weight: 600;">JournOwl</span> - the most advanced AI-powered journaling platform. 
        We're excited to help you capture your thoughts, analyze your emotions, and unlock powerful insights from your daily experiences.
      </p>

      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102,126,234,0.4); margin: 20px 0;">
          ✅ Verify Your Account
        </a>
        <p style="font-size: 14px; color: #718096; margin: 15px 0 0 0;">
          Please verify your email to access all features
        </p>
      </div>

      <!-- Features Highlight -->
      <div style="background: #f7fafc; padding: 25px; border-radius: 12px; margin: 30px 0;">
        <h3 style="color: #2d3748; font-size: 18px; margin: 0 0 15px 0;">🚀 What's included with your account:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li style="margin-bottom: 8px;"><strong>100 AI Writing Prompts</strong> - Never run out of inspiration</li>
          <li style="margin-bottom: 8px;"><strong>50MB Photo Storage</strong> - Upload and analyze your memories</li>
          <li style="margin-bottom: 8px;"><strong>Smart Analytics</strong> - Track mood patterns and writing trends</li>
          <li style="margin-bottom: 8px;"><strong>Achievement System</strong> - Unlock badges as you journal</li>
          <li style="margin-bottom: 8px;"><strong>Cross-Platform Sync</strong> - Access anywhere, anytime</li>
          <li style="margin-bottom: 8px;"><strong>Privacy First</strong> - Your thoughts remain completely private</li>
        </ul>
      </div>

      <!-- Getting Started -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; color: white; text-align: center; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; font-size: 20px;">🎯 Quick Start Guide</h3>
        <p style="margin: 0; line-height: 1.6; font-size: 15px;">
          1. Verify your email (click button above)<br>
          2. Complete your profile setup<br>
          3. Write your first journal entry<br>
          4. Explore AI-powered insights
        </p>
      </div>

      <!-- Upgrade Options -->
      <div style="text-align: center; margin: 25px 0;">
        <p style="color: #4a5568; margin-bottom: 15px;">Ready for more? Upgrade anytime:</p>
        <span style="display: inline-block; padding: 8px 16px; margin: 5px; border-radius: 6px; font-size: 14px; font-weight: 600; background: #e6fffa; color: #234e52;">📈 PRO - $9.99/month</span>
        <span style="display: inline-block; padding: 8px 16px; margin: 5px; border-radius: 6px; font-size: 14px; font-weight: 600; background: #fef5e7; color: #744210;">⚡ POWER - $19.99/month</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #edf2f7; padding: 25px; text-align: center; color: #718096; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">
        <strong>Need help?</strong> We're here for you!
      </p>
      <div>
        <a href="mailto:support@journowl.app" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact Support</a>
        <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">User Guide</a>
        <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      </div>
      <p style="margin: 15px 0 0 0; font-size: 12px;">
        © 2025 JournOwl. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `Welcome to JournOwl, ${userName}!

Your intelligent writing companion awaits. We're excited to help you capture your thoughts, analyze your emotions, and unlock powerful insights from your daily experiences.

VERIFY YOUR ACCOUNT: ${verificationUrl}

What's included with your account:
- 100 AI Writing Prompts - Never run out of inspiration
- 50MB Photo Storage - Upload and analyze your memories  
- Smart Analytics - Track mood patterns and writing trends
- Achievement System - Unlock badges as you journal
- Cross-Platform Sync - Access anywhere, anytime
- Privacy First - Your thoughts remain completely private

Quick Start Guide:
1. Verify your email (click link above)
2. Complete your profile setup
3. Write your first journal entry
4. Explore AI-powered insights

Ready for more? Upgrade anytime:
- PRO: $9.99/month
- POWER: $19.99/month

Need help? Contact us at support@journowl.app

© 2025 JournOwl. All rights reserved.`;

  return {
    to: userEmail,
    from: 'archimedes@journowl.app',
    replyTo: 'support@journowl.app',
    subject: 'Welcome to JournOwl - Verify Your Account',
    html,
    text
  };
}

export async function sendEmailWithSendGrid(template: EmailTemplate): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable must be set');
    }

    const mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);

    const response = await mailService.send({
      to: template.to,
      from: template.from,
      replyTo: template.replyTo,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log('SendGrid response status:', response[0]?.statusCode);
    return response[0]?.statusCode === 202;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}