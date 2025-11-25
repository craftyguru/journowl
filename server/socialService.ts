import { db } from "./storage";
import { users } from "@shared/schema";
import { sql, eq, desc } from "drizzle-orm";

// Create follows table if needed (in-memory for now)
interface Follow {
  followerId: number;
  followingId: number;
  createdAt: Date;
}

interface Activity {
  id: string;
  userId: number;
  type: "entry" | "achievement" | "streak";
  title: string;
  description: string;
  createdAt: Date;
  metadata?: any;
}

class SocialStore {
  private follows: Map<string, Follow> = new Map();
  private activities: Activity[] = [];
  private activityId = 0;

  follow(followerId: number, followingId: number): boolean {
    if (followerId === followingId) return false;
    const key = `${followerId}-${followingId}`;
    if (this.follows.has(key)) return false;
    
    this.follows.set(key, {
      followerId,
      followingId,
      createdAt: new Date()
    });
    return true;
  }

  unfollow(followerId: number, followingId: number): boolean {
    const key = `${followerId}-${followingId}`;
    return this.follows.delete(key);
  }

  isFollowing(followerId: number, followingId: number): boolean {
    return this.follows.has(`${followerId}-${followingId}`);
  }

  getFollowers(userId: number): number[] {
    const followers: number[] = [];
    this.follows.forEach((follow) => {
      if (follow.followingId === userId) {
        followers.push(follow.followerId);
      }
    });
    return followers;
  }

  getFollowing(userId: number): number[] {
    const following: number[] = [];
    this.follows.forEach((follow) => {
      if (follow.followerId === userId) {
        following.push(follow.followingId);
      }
    });
    return following;
  }

  addActivity(userId: number, type: Activity["type"], title: string, description: string, metadata?: any): Activity {
    const activity: Activity = {
      id: `activity_${++this.activityId}`,
      userId,
      type,
      title,
      description,
      createdAt: new Date(),
      metadata
    };
    this.activities.unshift(activity);
    // Keep only last 1000 activities
    if (this.activities.length > 1000) {
      this.activities.pop();
    }
    return activity;
  }

  getFeed(userId: number, limit: number = 50): Activity[] {
    const following = this.getFollowing(userId);
    const userIds = [userId, ...following];

    return this.activities
      .filter(a => userIds.includes(a.userId))
      .slice(0, limit);
  }

  getGlobalFeed(limit: number = 100): Activity[] {
    return this.activities.slice(0, limit);
  }
}

export const socialStore = new SocialStore();

export class SocialService {
  static follow(followerId: number, followingId: number) {
    return socialStore.follow(followerId, followingId);
  }

  static unfollow(followerId: number, followingId: number) {
    return socialStore.unfollow(followerId, followingId);
  }

  static isFollowing(followerId: number, followingId: number): boolean {
    return socialStore.isFollowing(followerId, followingId);
  }

  static async getFollowerStats(userId: number) {
    const followers = socialStore.getFollowers(userId);
    const following = socialStore.getFollowing(userId);

    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      return {
        followerCount: followers.length,
        followingCount: following.length,
        isFollowedBack: followers.includes(userId) ? true : false,
        username: user[0]?.username,
        bio: user[0]?.bio
      };
    } catch (error) {
      return {
        followerCount: followers.length,
        followingCount: following.length,
        isFollowedBack: false,
        username: "User",
        bio: ""
      };
    }
  }

  static logEntry(userId: number, title: string, wordCount: number) {
    return socialStore.addActivity(userId, "entry", title, `Wrote ${wordCount} words`, { wordCount });
  }

  static logAchievement(userId: number, achievementName: string) {
    return socialStore.addActivity(userId, "achievement", "Achievement Unlocked!", achievementName, { achievementName });
  }

  static logStreak(userId: number, streakDays: number) {
    return socialStore.addActivity(userId, "streak", `${streakDays}-Day Streak! 🔥`, `Kept a ${streakDays}-day writing streak`, { streakDays });
  }

  static getPersonalFeed(userId: number, limit?: number) {
    return socialStore.getFeed(userId, limit);
  }

  static getGlobalFeed(limit?: number) {
    return socialStore.getGlobalFeed(limit);
  }
}
