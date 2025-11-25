export interface PushSubscription {
  userId: number;
  endpoint: string;
  auth: string;
  p256dh: string;
  createdAt: Date;
}

class PushStore {
  private subscriptions: Map<number, PushSubscription[]> = new Map();

  addSubscription(userId: number, subscription: Omit<PushSubscription, "userId" | "createdAt">) {
    const userSubs = this.subscriptions.get(userId) || [];
    userSubs.push({
      userId,
      ...subscription,
      createdAt: new Date()
    });
    this.subscriptions.set(userId, userSubs);
    return true;
  }

  removeSubscription(userId: number, endpoint: string) {
    const userSubs = this.subscriptions.get(userId) || [];
    const filtered = userSubs.filter(s => s.endpoint !== endpoint);
    this.subscriptions.set(userId, filtered);
    return true;
  }

  getSubscriptions(userId: number): PushSubscription[] {
    return this.subscriptions.get(userId) || [];
  }

  getAllSubscriptions(): PushSubscription[] {
    const all: PushSubscription[] = [];
    this.subscriptions.forEach(subs => all.push(...subs));
    return all;
  }
}

export const pushStore = new PushStore();

export class PushNotificationService {
  static sendStreakNotification(userId: number, streak: number, message: string) {
    const subs = pushStore.getSubscriptions(userId);
    
    for (const sub of subs) {
      // In production, would use web-push library to send actual push notifications
      console.log(`Push to ${userId}: ${message} (${streak}-day streak)`);
    }
    
    return { sent: subs.length };
  }

  static sendAchievementNotification(userId: number, achievement: string, title: string) {
    const subs = pushStore.getSubscriptions(userId);
    
    for (const sub of subs) {
      console.log(`Push to ${userId}: Achievement unlocked - ${achievement}: ${title}`);
    }
    
    return { sent: subs.length };
  }

  static broadcastAnnouncement(message: string, targetUserIds?: number[]) {
    let subs: PushSubscription[] = [];
    
    if (targetUserIds) {
      subs = targetUserIds.flatMap(id => pushStore.getSubscriptions(id));
    } else {
      subs = pushStore.getAllSubscriptions();
    }
    
    console.log(`Broadcasting to ${subs.length} users: ${message}`);
    return { sent: subs.length };
  }
}
