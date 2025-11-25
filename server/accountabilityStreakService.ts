export interface AccountabilityCheckIn {
  id: string;
  userId: number;
  date: Date;
  completed: boolean;
  journalWritten: boolean;
  reflectionText: string;
  badge?: string;
}

class CheckInStore {
  private checkIns: Map<string, AccountabilityCheckIn> = new Map();
  private checkInId = 0;

  createCheckIn(userId: number): AccountabilityCheckIn {
    const id = `checkin_${++this.checkInId}`;
    const checkIn: AccountabilityCheckIn = {
      id,
      userId,
      date: new Date(),
      completed: false,
      journalWritten: false,
      reflectionText: ""
    };
    this.checkIns.set(id, checkIn);
    return checkIn;
  }

  completeCheckIn(checkInId: string, journalWritten: boolean, reflection: string): AccountabilityCheckIn | null {
    const checkIn = this.checkIns.get(checkInId);
    if (checkIn) {
      checkIn.completed = true;
      checkIn.journalWritten = journalWritten;
      checkIn.reflectionText = reflection;
      if (journalWritten) checkIn.badge = "✅";
      return checkIn;
    }
    return null;
  }

  getUserCheckIns(userId: number): AccountabilityCheckIn[] {
    return Array.from(this.checkIns.values()).filter(c => c.userId === userId);
  }
}

const checkInStore = new CheckInStore();

export class AccountabilityStreakService {
  static createCheckIn(userId: number): AccountabilityCheckIn {
    return checkInStore.createCheckIn(userId);
  }

  static completeCheckIn(checkInId: string, journalWritten: boolean, reflection: string): AccountabilityCheckIn | null {
    return checkInStore.completeCheckIn(checkInId, journalWritten, reflection);
  }

  static getUserCheckIns(userId: number): AccountabilityCheckIn[] {
    return checkInStore.getUserCheckIns(userId);
  }

  static getCurrentStreak(userId: number): number {
    const checkIns = checkInStore.getUserCheckIns(userId);
    let streak = 0;
    const sorted = checkIns.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    for (const checkIn of sorted) {
      if (checkIn.completed && checkIn.journalWritten) streak++;
      else break;
    }
    return streak;
  }
}
