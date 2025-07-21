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
  // Always use production domain for email verification links in deployment
  if (process.env.BASE_URL) {
    console.log('Using BASE_URL for verification links:', process.env.BASE_URL);
    return process.env.BASE_URL;
  }
  
  // Force production domain for any Replit deployment
  if (process.env.REPLIT_DOMAINS) {
    console.log('Using production domain for Replit deployment: https://journowl.app');
    return 'https://journowl.app';
  }
  
  // Only use localhost in true local development
  console.log('Using localhost for local development');
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
  <title>Welcome to JournOwl - Verify Your Account</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f7fa;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:12px;box-shadow:0 8px 24px #0001;overflow:hidden;">
          <!-- Header with accent gradient bar -->
          <tr>
            <td style="background:#667eea;background:linear-gradient(90deg,#667eea 0,#764ba2 100%);padding:0;">
              <div style="height:7px;"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#667eea;padding:35px 15px 15px 15px;">
              <div style="font-size:48px;margin-bottom:10px;">🦉</div>
              <h1 style="font-size:2rem;margin:0 0 10px 0;font-family:Arial,sans-serif;color:#fff;">Welcome to JournOwl</h1>
              <p style="font-size:1.1rem;color:#e0e7ff;margin:0;">Your intelligent writing companion</p>
            </td>
          </tr>
          <!-- Main section -->
          <tr>
            <td style="padding:30px 32px 20px 32px;">
              <h2 style="font-size:1.25rem;margin:0 0 18px 0;color:#2d3748;">Hello <span style="color:#764ba2">${userName}</span>! 🎉</h2>
              <p style="font-size:1rem;color:#4a5568;line-height:1.7;">
                Welcome to <b style="color:#667eea">JournOwl</b> – your advanced AI-powered journaling platform.<br>
                Get ready to capture your thoughts, analyze your emotions, and unlock insights from your daily journey.
              </p>
              <!-- Call to action button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:30px auto;">
                <tr>
                  <td style="background:#764ba2;padding:14px 36px;border-radius:7px;">
                    <a href="${verificationUrl}" style="color:#fff;font-weight:bold;text-decoration:none;font-size:1.15rem;font-family:Arial,sans-serif;display:inline-block;">
                      ✅ Verify Your Account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:0.98rem;color:#667eea;text-align:center;margin-top:0;">Please verify your email to unlock all features.</p>
              <!-- Features List (Colorful Icons!) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0 0;">
                <tr>
                  <td style="background:#f7fafc;border-radius:9px;padding:18px;">
                    <h3 style="font-size:1.05rem;margin:0 0 10px 0;color:#333;font-family:Arial;">🚀 What's included with your account:</h3>
                    <table>
                      <tr><td>💡</td><td style="padding-left:9px;"><b>100 AI Writing Prompts</b> <span style="color:#667eea;">– Always inspired</span></td></tr>
                      <tr><td>📷</td><td style="padding-left:9px;"><b>50MB Photo Storage</b> <span style="color:#667eea;">– Save your memories</span></td></tr>
                      <tr><td>📊</td><td style="padding-left:9px;"><b>Smart Analytics</b> <span style="color:#667eea;">– Track your mood & trends</span></td></tr>
                      <tr><td>🏅</td><td style="padding-left:9px;"><b>Achievement Badges</b> <span style="color:#667eea;">– Level up as you journal</span></td></tr>
                      <tr><td>🔗</td><td style="padding-left:9px;"><b>Cross-Platform Sync</b> <span style="color:#667eea;">– Access anywhere</span></td></tr>
                      <tr><td>🔒</td><td style="padding-left:9px;"><b>Privacy First</b> <span style="color:#667eea;">– Your data is always safe</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Quick Start Guide (Highlight) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0 0;">
                <tr>
                  <td style="background:#667eea;color:#fff;border-radius:9px;padding:19px;text-align:center;">
                    <h3 style="margin:0 0 8px 0;">🎯 Quick Start Guide</h3>
                    <div style="font-size:0.98rem;line-height:1.7;">
                      1. Verify your email<br>
                      2. Set up your profile<br>
                      3. Write your first journal<br>
                      4. Explore AI-powered insights!
                    </div>
                  </td>
                </tr>
              </table>
              <!-- Upgrade Options -->
              <div style="text-align:center;margin:24px 0 0 0;">
                <span style="display:inline-block;padding:8px 15px;background:#e6fffa;color:#234e52;border-radius:6px;font-weight:600;margin:3px;font-size:0.97rem;">📈 PRO – $9.99/month</span>
                <span style="display:inline-block;padding:8px 15px;background:#fef5e7;color:#744210;border-radius:6px;font-weight:600;margin:3px;font-size:0.97rem;">⚡ POWER – $19.99/month</span>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:25px 20px 15px 20px;text-align:center;border-top:1px solid #ececec;">
              <p style="margin:0 0 10px 0;font-size:1rem;color:#718096;">
                <b>Need help?</b> We're here for you!
              </p>
              <div>
                <a href="mailto:support@journowl.app" style="color:#667eea;text-decoration:none;margin:0 8px;font-size:0.92rem;">Contact Support</a> |
                <a href="#" style="color:#667eea;text-decoration:none;margin:0 8px;font-size:0.92rem;">User Guide</a> |
                <a href="#" style="color:#667eea;text-decoration:none;margin:0 8px;font-size:0.92rem;">Privacy Policy</a>
              </div>
              <p style="margin:15px 0 0 0;color:#999;font-size:0.88rem;">
                © 2025 JournOwl. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const text = `Welcome to JournOwl, ${userName}!

  Your intelligent writing companion awaits.

  Please verify your email: ${verificationUrl}

  What's included with your account:
  - 100 AI Writing Prompts – Always inspired
  - 50MB Photo Storage – Save your memories
  - Smart Analytics – Track your mood & trends
  - Achievement Badges – Level up as you journal
  - Cross-Platform Sync – Access anywhere
  - Privacy First – Your data is always safe

  Quick Start Guide:
  1. Verify your email
  2. Set up your profile
  3. Write your first journal
  4. Explore AI-powered insights!

  Ready for more? Upgrade anytime:
  PRO – $9.99/month
  POWER – $19.99/month

  Need help? Email support@journowl.app

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
      text: template.text
    });

    console.log('SendGrid response status:', response[0]?.statusCode);
    return response[0]?.statusCode === 202;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response?.body?.errors) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
    }
    return false;
  }
}