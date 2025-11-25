import { storage } from "./storage";

export class HeatmapService {
  static async getUserActivityHeatmap(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 365);
      const heatmapData: any = {};
      
      entries.forEach(entry => {
        const date = new Date(entry.createdAt).toISOString().split('T')[0];
        if (!heatmapData[date]) {
          heatmapData[date] = { date, count: 0, level: 0 };
        }
        heatmapData[date].count++;
      });

      // Calculate intensity levels
      const counts = Object.values(heatmapData as any).map((d: any) => d.count);
      const max = Math.max(...counts, 1);
      
      Object.values(heatmapData as any).forEach((d: any) => {
        d.level = Math.ceil((d.count / max) * 4);
      });

      return Object.values(heatmapData);
    } catch (e) {
      return [];
    }
  }
}
