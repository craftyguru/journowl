export interface Moment {
  id: string;
  entryId: number;
  userId: number;
  imageUrl: string;
  caption: string;
  createdAt: Date;
}

class MomentStore {
  private moments: Map<string, Moment> = new Map();
  private momentId = 0;

  addMoment(entryId: number, userId: number, imageUrl: string, caption: string): Moment {
    const id = `moment_${++this.momentId}`;
    const moment: Moment = { id, entryId, userId, imageUrl, caption, createdAt: new Date() };
    this.moments.set(id, moment);
    return moment;
  }

  getMomentsForEntry(entryId: number): Moment[] {
    return Array.from(this.moments.values()).filter(m => m.entryId === entryId);
  }

  getUserMoments(userId: number): Moment[] {
    return Array.from(this.moments.values()).filter(m => m.userId === userId);
  }
}

const momentStore = new MomentStore();

export class MomentService {
  static addMoment(entryId: number, userId: number, imageUrl: string, caption: string): Moment {
    return momentStore.addMoment(entryId, userId, imageUrl, caption);
  }

  static getMomentsForEntry(entryId: number): Moment[] {
    return momentStore.getMomentsForEntry(entryId);
  }

  static getUserMoments(userId: number): Moment[] {
    return momentStore.getUserMoments(userId);
  }
}
