import sgMail from '@sendgrid/mail';
import { storage } from './storage';
import type { EmailCampaign, User } from '@shared/schema';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export class EmailService {
  static async sendWelcomeEmail(user: User) {
    if (!SENDGRID_API_KEY) {
      console.log('SendGrid not configured, skipping welcome email');
      return;
    }

    const firstName = user.firstName || user.username;
    const welcomeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MoodJournal! 🌟</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.15);
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header p {
            margin: 0;
            font-size: 18px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-message {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .welcome-message h2 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 15px;
            padding: 25px 20px;
            text-align: center;
            border: 2px solid #e2e8f0;
        }
        
        .feature-icon {
            font-size: 40px;
            margin-bottom: 15px;
            display: block;
        }
        
        .feature-title {
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .feature-desc {
            color: #64748b;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: white;
            margin: 30px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
        }
        
        .tutorial-steps {
            background: #f8fafc;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .step:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .step-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .step-content h4 {
            margin: 0 0 8px 0;
            color: #334155;
            font-weight: 600;
        }
        
        .step-content p {
            margin: 0;
            color: #64748b;
            line-height: 1.5;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        
        @media (max-width: 600px) {
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">✨</div>
                <h1>MoodJournal</h1>
                <p>Your Personal Wellness Companion</p>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <div class="welcome-message">
                    <h2>Welcome aboard, ${firstName}! 🎉</h2>
                    <p style="font-size: 18px; color: #64748b; line-height: 1.6;">
                        We're absolutely thrilled to have you join our community of mindful journalers! 
                        Your journey toward better mental wellness and self-discovery starts now.
                    </p>
                </div>
                
                <!-- Feature Highlights -->
                <div class="feature-grid">
                    <div class="feature-card">
                        <span class="feature-icon">🧠</span>
                        <div class="feature-title">AI-Powered Insights</div>
                        <div class="feature-desc">Get personalized insights and prompts tailored to your mood and writing patterns</div>
                    </div>
                    
                    <div class="feature-card">
                        <span class="feature-icon">📊</span>
                        <div class="feature-title">Mood Analytics</div>
                        <div class="feature-desc">Track your emotional journey with beautiful charts and trending analysis</div>
                    </div>
                    
                    <div class="feature-card">
                        <span class="feature-icon">🎯</span>
                        <div class="feature-title">Achievement System</div>
                        <div class="feature-desc">Unlock badges and level up as you build consistent journaling habits</div>
                    </div>
                    
                    <div class="feature-card">
                        <span class="feature-icon">📸</span>
                        <div class="feature-title">Photo Integration</div>
                        <div class="feature-desc">Add photos to your entries and let AI analyze the emotions and memories</div>
                    </div>
                </div>
                
                <!-- Call to Action -->
                <div class="cta-section">
                    <h3 style="margin: 0 0 10px 0; font-size: 24px;">Ready to Start Your Journey?</h3>
                    <p style="margin: 0; opacity: 0.9;">Your personalized dashboard is waiting for you!</p>
                    <a href="${process.env.APP_URL || process.env.REPLIT_URL || 'https://your-app.replit.app'}" class="cta-button">
                        🚀 Open MoodJournal
                    </a>
                </div>
                
                <!-- Tutorial Steps -->
                <div class="tutorial-steps">
                    <h3 style="margin: 0 0 25px 0; color: #334155; text-align: center;">Quick Start Guide</h3>
                    
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Create Your First Entry</h4>
                            <p>Click the "New Entry" button and share what's on your mind. Don't worry about perfection - just be authentic!</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Set Your Mood</h4>
                            <p>Select your current mood using our colorful mood tracker. Watch how your emotional patterns emerge over time.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Explore AI Features</h4>
                            <p>Let our AI suggest writing prompts, analyze your photos, and provide personalized insights to enhance your journaling.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Track Your Progress</h4>
                            <p>Visit the Analytics tab to see your mood trends, writing streaks, and unlock achievements as you grow!</p>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 15px; padding: 25px; text-align: center; color: white; margin: 30px 0;">
                    <h4 style="margin: 0 0 10px 0;">🎁 Welcome Bonus</h4>
                    <p style="margin: 0; opacity: 0.9;">You've started with 100 XP points and your first achievement badge! Keep journaling to unlock more rewards.</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p style="margin: 0 0 10px 0; font-weight: 600;">Questions? We're here to help!</p>
                <p style="margin: 0; font-size: 14px;">
                    Follow us for tips and inspiration: 
                    <a href="#" style="color: #667eea;">@MoodJournal</a>
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                    You're receiving this email because you signed up for MoodJournal.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;

    const msg = {
      to: user.email,
      from: {
        email: 'welcome@moodjournal.app',
        name: 'MoodJournal Team'
      },
      subject: `🌟 Welcome to MoodJournal, ${firstName}! Your wellness journey starts now`,
      text: `Welcome to MoodJournal, ${firstName}! 

We're thrilled to have you join our community of mindful journalers!

🧠 AI-Powered Insights - Get personalized insights and prompts
📊 Mood Analytics - Track your emotional journey with beautiful charts  
🎯 Achievement System - Unlock badges and level up your journaling habits
📸 Photo Integration - Add photos and let AI analyze emotions and memories

Quick Start Guide:
1. Create Your First Entry - Share what's on your mind authentically
2. Set Your Mood - Use our colorful mood tracker 
3. Explore AI Features - Get writing prompts and photo analysis
4. Track Your Progress - See mood trends and unlock achievements

🎁 Welcome Bonus: You start with 100 XP points and your first achievement badge!

Ready to start? Visit: ${process.env.APP_URL || process.env.REPLIT_URL || 'https://your-app.replit.app'}

Questions? We're here to help!`,
      html: welcomeHtml
    };

    try {
      await sgMail.send(msg);
      console.log(`✨ Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  static async sendEmailCampaign(campaignId: number) {
    if (!SENDGRID_API_KEY) {
      console.log('SendGrid not configured, cannot send email campaign');
      return { success: false, error: 'SendGrid not configured' };
    }

    try {
      const campaign = await storage.getEmailCampaign(campaignId);
      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      // Get recipients based on target audience
      const recipients = await this.getEmailRecipients(campaign.targetAudience);
      
      if (recipients.length === 0) {
        return { success: false, error: 'No recipients found' };
      }

      // Update campaign status
      await storage.updateEmailCampaign(campaignId, {
        status: 'sending',
        recipientCount: recipients.length
      });

      // Send emails in batches to avoid rate limits
      const batchSize = 100;
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        const messages = batch.map(user => ({
          to: user.email,
          from: 'hello@moodjournal.app',
          subject: campaign.subject,
          html: this.personalizeEmail(campaign.htmlContent || campaign.content, user)
        }));

        try {
          await sgMail.send(messages);
          successCount += batch.length;
        } catch (error) {
          console.error('Batch email error:', error);
          failureCount += batch.length;
        }

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Update campaign with final status
      await storage.updateEmailCampaign(campaignId, {
        status: successCount > 0 ? 'sent' : 'failed',
        sentAt: new Date()
      });

      return { 
        success: true, 
        sent: successCount, 
        failed: failureCount,
        total: recipients.length 
      };

    } catch (error) {
      console.error('Email campaign error:', error);
      await storage.updateEmailCampaign(campaignId, { status: 'failed' });
      return { success: false, error: error.message };
    }
  }

  private static async getEmailRecipients(targetAudience: string): Promise<User[]> {
    switch (targetAudience) {
      case 'all':
        return await storage.getAllUsers();
      case 'active':
        return await storage.getActiveUsers();
      case 'inactive':
        return await storage.getInactiveUsers();
      case 'admins':
        return await storage.getUsersByRole('admin');
      case 'users':
        return await storage.getUsersByRole('user');
      default:
        return [];
    }
  }

  private static personalizeEmail(content: string, user: User): string {
    return content
      .replace(/{{name}}/g, user.firstName || user.username)
      .replace(/{{email}}/g, user.email)
      .replace(/{{username}}/g, user.username)
      .replace(/{{level}}/g, user.level?.toString() || '1')
      .replace(/{{xp}}/g, user.xp?.toString() || '0');
  }

  static async sendPasswordResetEmail(user: User, resetToken: string) {
    if (!SENDGRID_API_KEY) {
      console.log('SendGrid not configured, skipping password reset email');
      return;
    }

    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

    const msg = {
      to: user.email,
      from: 'hello@moodjournal.app',
      subject: '🔐 Reset Your MoodJournal Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">Password Reset Request</h2>
          <p>Hi ${user.firstName || user.username},</p>
          <p>You requested to reset your password for MoodJournal. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email.
            This link will expire in 1 hour.
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Or copy and paste this URL: ${resetUrl}
          </p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  static async sendAchievementEmail(user: User, achievement: { title: string, description: string, icon: string }) {
    if (!SENDGRID_API_KEY) return;

    const msg = {
      to: user.email,
      from: 'hello@moodjournal.app',
      subject: `🏆 Achievement Unlocked: ${achievement.title}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; padding: 20px;">
          <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 15px; padding: 30px; color: white;">
            <div style="font-size: 60px; margin-bottom: 10px;">${achievement.icon}</div>
            <h2 style="margin: 0;">Achievement Unlocked!</h2>
            <h3 style="margin: 10px 0;">${achievement.title}</h3>
            <p style="margin: 0; opacity: 0.9;">${achievement.description}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <p>Congratulations ${user.firstName || user.username}! Keep up the great work on your journaling journey!</p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending achievement email:', error);
    }
  }
}