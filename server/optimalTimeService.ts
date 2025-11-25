import { storage } from "./storage";

export class OptimalTimeService {
  static async getPredictedBestTime(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 30);
      const hourCounts: any = {};

      for (let h = 0; h < 24; h++) hourCounts[h] = 0;

      entries.forEach(e => {
        const hour = new Date(e.createdAt).getHours();
        hourCounts[hour]++;
      });

      const bestHour = Object.entries(hourCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 8;
      const nextReminder = this.getNextReminderTime(parseInt(bestHour));

      return {
        bestHour: parseInt(bestHour),
        prediction: `${bestHour}:00`,
        confidence: Math.min((hourCounts[bestHour] / entries.length) * 100, 95),
        nextReminder,
        message: `You write best at ${bestHour}:00 - we'll remind you!`
      };
    } catch (e) {
      return { bestHour: 8, prediction: "8:00", confidence: 0 };
    }
  }

  private static getNextReminderTime(hour: number): string {
    const now = new Date();
    const reminder = new Date();
    reminder.setHours(hour, 0, 0, 0);
    if (reminder <= now) reminder.setDate(reminder.getDate() + 1);
    return reminder.toLocaleString();
  }
}
