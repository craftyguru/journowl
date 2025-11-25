import { storage } from "./storage";

export class GoalService {
  static getGoals(userId: number): any[] {
    // This is a wrapper around storage - just return what storage gives us
    return []; // In-memory fallback
  }

  static async getUserGoals(userId: number): Promise<any[]> {
    try {
      return await storage.getUserGoals(userId);
    } catch (error) {
      return [];
    }
  }

  static async createGoal(userId: number, data: any): Promise<any> {
    try {
      return await storage.createGoal({
        ...data,
        userId
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateGoal(userId: number, goalId: number, data: any): Promise<void> {
    try {
      await storage.updateGoal(goalId, userId, data);
    } catch (error) {
      throw error;
    }
  }
}
