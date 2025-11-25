import sgMail from "@sendgrid/mail";
import { DatabaseStorage } from "./storage";

export class ReminderService {
  static initializeSendGrid(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  static async sendStrengthReminder(user: any): Promise<boolean> {
    try {
      if (!user.email) return false;

      const message = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@journowl.app",
        subject: "Your JournOwl Streak is Waiting ✨",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Your Journal is Waiting 📔</h1>
            </div>
            <div style="background: #f7f7f7; padding: 40px; border-radius: 0 0 10px 10px;">
              <p style="color: #333; font-size: 16px;">Hi ${user.username},</p>
              <p style="color: #666; font-size: 15px; line-height: 1.6;">
                We noticed you haven't journaled with us lately. Even a few words can help clear your mind and track your growth.
              </p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${process.env.APP_URL || "https://journowl.app"}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; 
                           padding: 15px 40px; 
                           text-decoration: none; 
                           border-radius: 5px; 
                           font-weight: bold;
                           display: inline-block;">
                  Start Journaling Now
                </a>
              </div>
              <p style="color: #999; font-size: 13px; margin-top: 30px;">
                💡 Quick tip: Write about what you're grateful for today. It helps shift perspective!
              </p>
            </div>
          </div>
        `,
        text: `Hi ${user.username}, we miss you! Log in to JournOwl and write your next entry: ${process.env.APP_URL || "https://journowl.app"}/dashboard`
      };

      await sgMail.send(message);
      return true;
    } catch (error) {
      console.error("SendGrid reminder error:", error);
      return false;
    }
  }

  static async sendStreakMilestoneReminder(user: any, streak: number): Promise<boolean> {
    try {
      if (!user.email) return false;

      const milestones = {
        7: "Week Warrior",
        14: "Fortnight Master",
        30: "Monthly Champion",
        60: "Two-Month Legend",
        100: "Centennial Hero"
      };

      const title = milestones[streak as keyof typeof milestones] || `${streak}-Day Streaker`;
      const emoji = streak >= 100 ? "👑" : streak >= 60 ? "⭐" : streak >= 30 ? "🌟" : streak >= 14 ? "🔥" : "✨";

      const message = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@journowl.app",
        subject: `🎉 Amazing! You hit a ${streak}-day streak!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 48px;">${emoji}</h1>
              <p style="color: white; font-size: 24px; margin: 10px 0 0 0;">${title}</p>
            </div>
            <div style="background: #f7f7f7; padding: 40px; border-radius: 0 0 10px 10px; text-align: center;">
              <p style="color: #333; font-size: 18px; font-weight: bold;">Congratulations, ${user.username}!</p>
              <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                You've maintained a ${streak}-day journaling streak! This incredible consistency shows your dedication to self-reflection and personal growth.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 5px; border-left: 4px solid #f5576c;">
                <p style="color: #333; margin: 0; font-weight: bold;">Keep the momentum going! 🚀</p>
              </div>
            </div>
          </div>
        `,
        text: `Congratulations! You've hit a ${streak}-day streak on JournOwl. Keep up the amazing work!`
      };

      await sgMail.send(message);
      return true;
    } catch (error) {
      console.error("SendGrid milestone error:", error);
      return false;
    }
  }

  static async checkAndSendReminders(storage: DatabaseStorage) {
    try {
      const users = await storage.getAllUsers?.() || [];
      const now = new Date();

      for (const user of users) {
        const entries = await storage.getJournalEntries(user.id, 100);
        if (entries.length === 0) continue;

        // Get last entry date
        const lastEntry = entries[0];
        const lastEntryDate = new Date(lastEntry.createdAt);
        const daysSinceLastEntry = Math.floor(
          (now.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Send reminder if it's been 2+ days
        if (daysSinceLastEntry >= 2) {
          await this.sendStrengthReminder(user);
        }

        // Check for streak milestones
        const stats = await storage.getUserStats(user.id);
        if (stats?.currentStreak && [7, 14, 30, 60, 100].includes(stats.currentStreak)) {
          // Send milestone reminder (could add flag to prevent duplicates)
          await this.sendStreakMilestoneReminder(user, stats.currentStreak);
        }
      }

      return { processed: users.length };
    } catch (error) {
      console.error("Reminder batch process error:", error);
      return { processed: 0, error };
    }
  }
}
