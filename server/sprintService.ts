export interface WritingSprint {
  id: string;
  userId: number;
  duration: number; // minutes
  wordsTarget: number;
  wordsWritten: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

class SprintStore {
  private sprints: Map<string, WritingSprint> = new Map();
  private sprintId = 0;

  createSprint(userId: number, duration: number): WritingSprint {
    const id = `sprint_${++this.sprintId}`;
    const wordsTarget = Math.round((duration / 5) * 100); // ~100 words per 5 min
    const sprint: WritingSprint = {
      id,
      userId,
      duration,
      wordsTarget,
      wordsWritten: 0,
      startTime: new Date(),
      completed: false
    };
    this.sprints.set(id, sprint);
    return sprint;
  }

  getUserSprints(userId: number): WritingSprint[] {
    return Array.from(this.sprints.values()).filter(s => s.userId === userId);
  }

  completeSprint(sprintId: string, wordsWritten: number): WritingSprint | null {
    const sprint = this.sprints.get(sprintId);
    if (sprint) {
      sprint.completed = true;
      sprint.wordsWritten = wordsWritten;
      sprint.endTime = new Date();
      return sprint;
    }
    return null;
  }
}

const sprintStore = new SprintStore();

export class SprintService {
  static createSprint(userId: number, duration: number): WritingSprint {
    return sprintStore.createSprint(userId, duration);
  }

  static getUserSprints(userId: number): WritingSprint[] {
    return sprintStore.getUserSprints(userId);
  }

  static completeSprint(sprintId: string, wordsWritten: number): WritingSprint | null {
    return sprintStore.completeSprint(sprintId, wordsWritten);
  }
}
