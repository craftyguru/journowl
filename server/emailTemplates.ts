import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}

function getBaseUrl() {
  if (process.env.REPLIT_DOMAINS) return `https://${process.env.REPLIT_DOMAINS}`;
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
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <body style="margin:0;padding:0;background:#f6f8fb;">
    <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 8px 30px #0001;font-family:Arial,sans-serif;">
      <div style="padding:40px 24px 24px 24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px 16px 0 0;color:#fff;text-align:center;">
        <div style="font-size:60px;margin-bottom:8px;">🦉</div>
        <h1 style="margin:0 0 8px 0;font-size:30px;">Welcome to JournOwl!</h1>
        <div style="font-size:18px;opacity:.94;">Your Wise Writing Companion</div>
      </div>
      <div style="padding:32px 24px 16px 24px;">
        <h2 style="color:#1e293b;font-size:21px;">Hi ${userName}!</h2>
        <p style="color:#475569;font-size:16px;margin-bottom:18px;">
          We're excited to have you join our mindful writing community! Let's get your account set up:
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${verificationUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#667eea,#a855f7);color:#fff;border-radius:40px;font-weight:bold;font-size:17px;text-decoration:none;">
            ✅ Verify Email & Start Journaling
          </a>
        </div>
        <h3 style="color:#5b21b6;text-align:center;margin:32px 0 16px 0;">Why you'll love JournOwl:</h3>
        <ul style="padding-left:18px;color:#3b3762;font-size:15px;line-height:1.6;">
          <li>🎨 Smart Editor: Beautiful fonts & creative prompts</li>
          <li>📸 Photo AI: Instant insights from your photos</li>
          <li>🏆 Achievements: XP, streaks, badges & rewards</li>
          <li>🧠 AI Insights: Discover writing patterns</li>
        </ul>
        <div style="background:#f3e8ff;padding:18px 20px;border-radius:12px;font-size:15px;margin:20px 0;">
          <b>Your Free Account Includes:</b><br>
          ✨ 100 AI Prompts/month &nbsp;|&nbsp; ☁️ 50MB Storage<br>
          🎯 Access to all essential features<br>
          <br>
          <b>Need more?</b><br>
          🚀 Pro: 1,000 prompts + 500MB ($9.99/mo)<br>
          ⚡ Power: Unlimited everything ($19.99/mo)
        </div>
        <div style="background:#fef3c7;padding:14px 16px;border-radius:10px;color:#92400e;font-size:15px;margin-bottom:12px;">
          <b>Quick Start Tips:</b>
          <ul style="margin:8px 0 0 18px;">
            <li>Start with a mood check-in</li>
            <li>Upload a photo for AI magic</li>
            <li>Set your first writing goal</li>
            <li>Unlock your first achievement</li>
          </ul>
        </div>
        <p style="color:#475569;font-size:15px;margin:24px 0 0 0;">
          Any questions? Just reply to this email — our team is here to help!
        </p>
      </div>
      <div style="background:#f8fafc;padding:20px 16px;border-radius:0 0 16px 16px;text-align:center;font-size:12px;color:#64748b;">
        Happy journaling! 🦉✨<br>
        The JournOwl Team<br>
        <span style="color:#a78bfa;">You’re receiving this because you signed up for JournOwl.</span>
        <div style="margin-top:8px;"><a href="#" style="color:#64748b;text-decoration:none;">Unsubscribe</a> | <a href="#" style="color:#64748b;text-decoration:none;">Privacy Policy</a></div>
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
Welcome to JournOwl! 🦉

Hi ${userName}!

We're excited to have you join our mindful writing community!

Please verify your email to activate your account:
${verificationUrl}

Why you'll love JournOwl:
- Smart Editor: Beautiful fonts & creative prompts
- Photo AI: Instant insights from your photos
- Achievements: XP, streaks, badges & rewards
- AI Insights: Discover writing patterns

Your Free Account Includes:
✨ 100 AI Prompts/month | ☁️ 50MB Storage | 🎯 All features

Need more? Upgrade anytime:
🚀 Pro: 1,000 prompts + 500MB ($9.99/mo)
⚡ Power: Unlimited everything ($19.99/mo)

Quick Start Tips:
- Start with a mood check-in
- Upload a photo for AI magic
- Set your first writing goal
- Unlock your first achievement

Questions? Reply to this email — we're here to help!

Happy journaling! 🦉✨
The JournOwl Team
  `;

  return {
    to: userEmail,
    from: 'craftyguru@1ofakindpiece.com', // Verified sender
    subject: 'Welcome to JournOwl – Verify Your Email!',
    html,
    text
  };
}

export async function sendWelcomeEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured!');
      return false;
    }
    const emailTemplate = createWelcomeEmailTemplate(userEmail, userName, verificationToken);
    const [response] = await sgMail.send(emailTemplate);
    console.log('Welcome email sent:', { status: response.statusCode, messageId: response.headers['x-message-id'] });
    return true;
  } catch (error: any) {
    console.error('Failed to send welcome email:', error?.response?.body || error);
    return false;
  }
}

export function createEmailVerificationTemplate(
  userEmail: string,
  userName: string,
  verificationToken: string
): EmailTemplate {
  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <body style="margin:0;padding:0;background:#f6f8fb;">
    <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 8px 30px #0001;font-family:Arial,sans-serif;">
      <div style="padding:36px 24px 18px 24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px 16px 0 0;color:#fff;text-align:center;">
        <div style="font-size:48px;margin-bottom:8px;">🦉</div>
        <h2 style="margin:0 0 6px 0;font-size:24px;">Verify Your Email</h2>
      </div>
      <div style="padding:32px 24px 16px 24px;">
        <p style="color:#1e293b;font-size:16px;">Hi ${userName},</p>
        <p style="color:#475569;font-size:16px;">
          Please verify your email address to complete your JournOwl registration:
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${verificationUrl}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#667eea,#a855f7);color:#fff;border-radius:40px;font-weight:bold;font-size:16px;text-decoration:none;">
            ✅ Verify Email Address
          </a>
        </div>
        <p style="color:#64748b;font-size:13px;">This link will expire in 24 hours.</p>
      </div>
      <div style="background:#f8fafc;padding:16px 14px;border-radius:0 0 16px 16px;text-align:center;font-size:11px;color:#64748b;">
        You’re receiving this because you signed up for JournOwl.
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
Hi ${userName},

Please verify your email address to complete your JournOwl registration:

${verificationUrl}

This link will expire in 24 hours.

You’re receiving this because you signed up for JournOwl.
  `;

  return {
    to: userEmail,
    from: 'craftyguru@1ofakindpiece.com',
    subject: '🦉 Verify Your JournOwl Email Address',
    html,
    text
  };
}
