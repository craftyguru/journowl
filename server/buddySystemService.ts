export interface JournalBuddy {
  id: string;
  userId: number;
  buddyId: number;
  status: "pending" | "active" | "inactive";
  connectedAt: Date;
  streakChallenge: boolean;
}

class BuddyStore {
  private buddies: Map<string, JournalBuddy> = new Map();
  private buddyId = 0;

  requestBuddy(userId: number, buddyId: number): JournalBuddy {
    const id = `buddy_${++this.buddyId}`;
    const buddy: JournalBuddy = {
      id,
      userId,
      buddyId,
      status: "pending",
      connectedAt: new Date(),
      streakChallenge: false
    };
    this.buddies.set(id, buddy);
    return buddy;
  }

  acceptBuddy(buddyId: string): JournalBuddy | null {
    const buddy = this.buddies.get(buddyId);
    if (buddy) {
      buddy.status = "active";
      return buddy;
    }
    return null;
  }

  getBuddies(userId: number): JournalBuddy[] {
    return Array.from(this.buddies.values()).filter(b => 
      (b.userId === userId || b.buddyId === userId) && b.status === "active"
    );
  }
}

const buddyStore = new BuddyStore();

export class BuddySystemService {
  static requestBuddy(userId: number, buddyId: number): JournalBuddy {
    return buddyStore.requestBuddy(userId, buddyId);
  }

  static acceptBuddy(buddyId: string): JournalBuddy | null {
    return buddyStore.acceptBuddy(buddyId);
  }

  static getBuddies(userId: number): JournalBuddy[] {
    return buddyStore.getBuddies(userId);
  }

  static startStreakChallenge(buddyId: string): boolean {
    const buddy = (buddyStore as any).buddies.get(buddyId);
    if (buddy) {
      buddy.streakChallenge = true;
      return true;
    }
    return false;
  }
}
