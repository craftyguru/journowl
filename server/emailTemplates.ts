import sgMail from '@sendgrid/mail';

// Initialize SendGrid
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

export function createWelcomeEmailTemplate(userEmail: string, userName: string, verificationToken: string): EmailTemplate {
  const verificationUrl = `${process.env.BASE_URL || 'https://7ba85678f8f4b618.id.repl.co'}/api/auth/verify-email?token=${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to JournOwl! 🦉</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .owl-icon {
          font-size: 60px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .content {
          padding: 40px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
        }
        .feature-item {
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          border: 2px solid #f1f5f9;
          transition: transform 0.3s ease;
        }
        .feature-item:hover {
          transform: translateY(-5px);
        }
        .feature-purple { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white; }
        .feature-blue { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; }
        .feature-green { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; }
        .feature-orange { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; }
        .btn {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          transition: transform 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
        }
        .tips {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 20px;
          border-radius: 15px;
          margin: 20px 0;
          border-left: 5px solid #f59e0b;
        }
        @media (max-width: 600px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="owl-icon">🦉</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Welcome to JournOwl!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your Wise Writing Companion</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${userName}! 👋</h2>
          
          <p style="color: #475569; font-size: 16px; margin-bottom: 30px;">
            Welcome to JournOwl, where journaling becomes magical! We're thrilled to have you join our community of mindful writers and storytellers.
          </p>

          <!-- Verification Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" class="btn">
              ✅ Verify Your Email & Start Journaling!
            </a>
          </div>

          <!-- Features Grid -->
          <h3 style="color: #1e293b; text-align: center; margin: 40px 0 30px 0;">What makes JournOwl special? ✨</h3>
          
          <div class="feature-grid">
            <div class="feature-item feature-purple">
              <div style="font-size: 32px; margin-bottom: 10px;">🎨</div>
              <h4 style="margin: 0 0 10px 0;">Smart Editor</h4>
              <p style="margin: 0; font-size: 14px;">Beautiful fonts, colors, and AI writing prompts</p>
            </div>
            
            <div class="feature-item feature-blue">
              <div style="font-size: 32px; margin-bottom: 10px;">📸</div>
              <h4 style="margin: 0 0 10px 0;">Photo AI</h4>
              <p style="margin: 0; font-size: 14px;">Upload photos and get instant AI insights</p>
            </div>
            
            <div class="feature-item feature-green">
              <div style="font-size: 32px; margin-bottom: 10px;">🏆</div>
              <h4 style="margin: 0 0 10px 0;">Achievements</h4>
              <p style="margin: 0; font-size: 14px;">Level up with XP, streaks, and rewards</p>
            </div>
            
            <div class="feature-item feature-orange">
              <div style="font-size: 32px; margin-bottom: 10px;">🧠</div>
              <h4 style="margin: 0 0 10px 0;">AI Insights</h4>
              <p style="margin: 0; font-size: 14px;">Discover patterns in your writing journey</p>
            </div>
          </div>

          <!-- Subscription Information -->
          <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bbdefb 100%); padding: 20px; border-radius: 15px; margin: 20px 0; border-left: 5px solid #2196f3;">
            <h4 style="color: #1565c0; margin: 0 0 15px 0;">🎯 Your Free Account Includes:</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; color: #1565c0;">
              <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 5px;">✨</div>
                <strong>100 AI Prompts</strong><br>
                <small>Smart writing suggestions</small>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 5px;">☁️</div>
                <strong>50MB Storage</strong><br>
                <small>For photos & attachments</small>
              </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 10px; text-align: center;">
              <p style="margin: 0; color: #1565c0; font-weight: bold;">Need more? Upgrade anytime!</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                🚀 <strong>Pro Plan ($9.99/month):</strong> 1,000 prompts + 500MB<br>
                ⚡ <strong>Power Plan ($19.99/month):</strong> Unlimited everything
              </p>
            </div>
          </div>

          <!-- Quick Tips -->
          <div class="tips">
            <h4 style="color: #92400e; margin: 0 0 15px 0;">💡 Quick Start Tips:</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Start with a simple mood check-in</li>
              <li>Try uploading a photo for AI analysis</li>
              <li>Customize your writing style with fonts & colors</li>
              <li>Set your first journaling goal</li>
              <li>Explore the achievement system</li>
              <li><strong>Monitor your AI prompts</strong> - they refresh monthly!</li>
            </ul>
          </div>

          <p style="color: #475569; font-size: 16px; margin-top: 30px;">
            Ready to begin your mindful writing journey? Click the verification button above to activate your account and unlock all features!
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px;">
              Questions? Reply to this email - we're here to help! 💌
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0; font-size: 14px;">
            Happy journaling! 🦉✨<br>
            The JournOwl Team
          </p>
          <p style="margin: 15px 0 0 0; font-size: 12px;">
            You're receiving this because you signed up for JournOwl.<br>
            <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to JournOwl! 🦉

Hi ${userName}!

Welcome to JournOwl, your wise writing companion! We're thrilled to have you join our community of mindful writers.

Please verify your email to activate your account:
${verificationUrl}

What makes JournOwl special:
• Smart Editor with beautiful fonts, colors, and AI prompts
• Photo AI that analyzes your images and creates writing inspiration
• Achievement system with XP, levels, and rewards
• AI Insights that discover patterns in your writing

Your Free Account Includes:
✨ 100 AI Prompts per month - Smart writing suggestions
☁️ 50MB Storage - For photos and attachments
🎯 Full access to all core features

Need more? Upgrade anytime:
🚀 Pro Plan ($9.99/month): 1,000 prompts + 500MB storage
⚡ Power Plan ($19.99/month): Unlimited prompts + 5GB storage

Quick Start Tips:
- Start with a simple mood check-in
- Try uploading a photo for AI analysis  
- Customize your writing style
- Set your first journaling goal
- Explore achievements
- Monitor your AI prompts - they refresh monthly!

Ready to begin your mindful writing journey? Click the verification link above!

Questions? Just reply to this email - we're here to help!

Happy journaling! 🦉✨
The JournOwl Team
  `;

  return {
    to: userEmail,
    from: 'craftyguru@1ofakindpiece.com', // Using verified sender email
    subject: '🦉 Welcome to JournOwl - Verify Your Email & Start Your Journey!',
    html,
    text
  };
}

export async function sendWelcomeEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured, skipping email');
      return false;
    }

    const emailTemplate = createWelcomeEmailTemplate(userEmail, userName, verificationToken);
    await sgMail.send(emailTemplate);
    
    console.log(`Welcome email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export function createEmailVerificationTemplate(userEmail: string, userName: string, verificationToken: string): EmailTemplate {
  const verificationUrl = `${process.env.BASE_URL || 'https://7ba85678f8f4b618.id.repl.co'}/api/auth/verify-email?token=${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #1e293b;">🦉 Verify Your Email</h1>
        </div>
        <p>Hi ${userName},</p>
        <p>Please verify your email address to complete your JournOwl registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">This link will expire in 24 hours.</p>
      </div>
    </body>
    </html>
  `;

  return {
    to: userEmail,
    from: process.env.FROM_EMAIL || 'verify@journowl.com',
    subject: '🦉 Verify Your JournOwl Email Address',
    html,
    text: `Hi ${userName}, please verify your email: ${verificationUrl}`
  };
}