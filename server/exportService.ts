import { storage } from "./storage";

export class ExportService {
  static async exportAsJSON(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 1000);
      const stats = await storage.getUserStats(userId);
      const goals = await storage.getUserGoals(userId);
      const achievements = await storage.getUserAchievements(userId);

      const data = {
        exportedAt: new Date().toISOString(),
        stats,
        entries: entries.map(e => ({
          id: e.id,
          title: e.title,
          content: e.content,
          mood: e.mood,
          createdAt: e.createdAt,
          wordCount: e.wordCount
        })),
        goals,
        achievements
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw error;
    }
  }

  static async exportAsMarkdown(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 1000);
      let markdown = `# Journal Export\n\nExported: ${new Date().toISOString()}\n\n`;

      entries.forEach(e => {
        markdown += `## ${e.title || "Untitled"}\n`;
        markdown += `*${new Date(e.createdAt).toLocaleDateString()} - Mood: ${e.mood}*\n\n`;
        markdown += `${e.content}\n\n---\n\n`;
      });

      return markdown;
    } catch (error) {
      throw error;
    }
  }

  static async exportAsCSV(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 1000);
      let csv = "Date,Title,Mood,Word Count,Content\n";

      entries.forEach(e => {
        const date = new Date(e.createdAt).toISOString().split("T")[0];
        const title = (e.title || "").replace(/"/g, '""');
        const content = (e.content || "").replace(/"/g, '""').substring(0, 100);
        csv += `"${date}","${title}","${e.mood}",${e.wordCount},"${content}"\n`;
      });

      return csv;
    } catch (error) {
      throw error;
    }
  }
}
