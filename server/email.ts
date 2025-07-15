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

    const msg = {
      to: user.email,
      from: 'hello@moodjournal.app', // Use your verified sender
      subject: '🌟 Welcome to MoodJournal - Your AI Writing Companion!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; overflow: hidden;">
          <div style="background: white; margin: 20px; border-radius: 10px; padding: 40px; text-align: center;">
            <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: bold; margin-bottom: 20px;">
              🎉 Welcome ${user.firstName || user.username}!
            </div>
            
            <p style="font-size: 18px; color: #333; line-height: 1.6;">
              You've just joined thousands of writers who are transforming their journaling experience with AI-powered insights!
            </p>
            
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #667eea; margin: 0 0 15px 0;">🚀 What's Next?</h3>
              <ul style="text-align: left; color: #555; line-height: 1.8;">
                <li>✨ Write your first journal entry</li>
                <li>📊 Track your mood and emotions</li>
                <li>🤖 Get AI-powered writing suggestions</li>
                <li>🏆 Unlock achievements and level up</li>
                <li>📈 Watch your progress grow</li>
              </ul>
            </div>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:5000'}" 
                 style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Writing Now! 🎯
              </a>
            </div>
            
            <p style="color: #888; font-size: 14px;">
              Happy writing!<br>
              The MoodJournal Team 💜
            </p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${user.email}`);
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