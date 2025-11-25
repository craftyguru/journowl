export interface Goal {
  id: string;
  userId: number;
  title: string;
  type: "words" | "frequency" | "streak" | "custom";
  target: number;
  current: number;
  unit: string;
  createdAt: Date;
  deadline?: Date;
  completed: boolean;
}

class GoalStore {
  private goals: Map<string, Goal> = new Map();
  private goalId = 0;

  createGoal(userId: number, title: string, type: any, target: number, unit: string): Goal {
    const id = `goal_${++this.goalId}`;
    const goal: Goal = {
      id,
      userId,
      title,
      type,
      target,
      current: 0,
      unit,
      createdAt: new Date(),
      completed: false
    };
    this.goals.set(id, goal);
    return goal;
  }

  getGoals(userId: number): Goal[] {
    return Array.from(this.goals.values()).filter(g => g.userId === userId);
  }

  updateProgress(goalId: string, progress: number): Goal | null {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.current = progress;
      goal.completed = progress >= goal.target;
      return goal;
    }
    return null;
  }

  deleteGoal(id: string): boolean {
    return this.goals.delete(id);
  }
}

const goalStore = new GoalStore();

export class GoalService {
  static createGoal(userId: number, title: string, type: any, target: number, unit: string): Goal {
    return goalStore.createGoal(userId, title, type, target, unit);
  }

  static getGoals(userId: number): Goal[] {
    return goalStore.getGoals(userId);
  }

  static updateProgress(goalId: string, progress: number): Goal | null {
    return goalStore.updateProgress(goalId, progress);
  }

  static deleteGoal(id: string): boolean {
    return goalStore.deleteGoal(id);
  }
}
