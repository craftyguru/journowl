import { storage } from "./storage";
import { jsPDF } from "jspdf";

export class ExportService {
  static async exportAsJSON(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 999);
      const stats = await storage.getUserStats(userId);
      
      return JSON.stringify({
        exportDate: new Date().toISOString(),
        stats,
        entries
      }, null, 2);
    } catch (e) {
      return "{}";
    }
  }

  static async exportAsMarkdown(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 999);
      let markdown = `# Journal Export\n\nExported: ${new Date().toISOString()}\n\n`;

      entries.forEach(entry => {
        markdown += `## ${new Date(entry.createdAt).toLocaleDateString()}\n\n`;
        markdown += `${entry.content}\n\n`;
      });

      return markdown;
    } catch (e) {
      return "";
    }
  }

  static async exportAsCSV(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 999);
      let csv = "Date,Mood,Word Count,Content\n";

      entries.forEach(entry => {
        const date = new Date(entry.createdAt).toISOString();
        const content = (entry.content || "").replace(/"/g, '""');
        csv += `"${date}","${entry.mood || 'N/A'}","${entry.wordCount || 0}","${content}"\n`;
      });

      return csv;
    } catch (e) {
      return "";
    }
  }
}
