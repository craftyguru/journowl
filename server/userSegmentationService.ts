import { storage } from "./storage";

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minLevel?: number;
    maxLevel?: number;
    tier?: string;
    minStreak?: number;
    minEntries?: number;
    joinedBefore?: Date;
    joinedAfter?: Date;
  };
  userCount: number;
  targetFeatures: string[];
  createdAt: Date;
}

class SegmentStore {
  private segments: Map<string, UserSegment> = new Map();
  private segmentId = 0;

  constructor() {
    this.initializeDefaultSegments();
  }

  private initializeDefaultSegments() {
    const defaults = [
      {
        name: "Power Users",
        description: "Level 50+, 5+ entries/day",
        criteria: { minLevel: 50, minEntries: 5 },
        targetFeatures: ["all"]
      },
      {
        name: "Active Free Tier",
        description: "Free users with 7+ day streak",
        criteria: { tier: "free", minStreak: 7 },
        targetFeatures: ["tournaments", "leaderboards"]
      },
      {
        name: "Churning Users",
        description: "No entries in 7+ days",
        criteria: { minEntries: 1 },
        targetFeatures: ["email-reminders"]
      },
      {
        name: "New Users",
        description: "Joined in last 7 days",
        criteria: { minEntries: 0 },
        targetFeatures: ["onboarding", "daily-challenges"]
      },
      {
        name: "Premium Subscribers",
        description: "Pro or Power tier",
        criteria: { tier: "pro" },
        targetFeatures: ["extended-summaries", "ai-coaching"]
      }
    ];

    defaults.forEach(seg => {
      const id = `segment_${++this.segmentId}`;
      this.segments.set(id, {
        id,
        name: seg.name,
        description: seg.description,
        criteria: seg.criteria,
        userCount: 0,
        targetFeatures: seg.targetFeatures,
        createdAt: new Date()
      });
    });
  }

  getAll(): UserSegment[] {
    return Array.from(this.segments.values());
  }

  async calculateSegmentSize(segment: UserSegment): Promise<number> {
    try {
      const allUsers = await storage.getAllUsers();
      
      return allUsers.filter(user => {
        if (segment.criteria.minLevel && (user.level || 0) < segment.criteria.minLevel) return false;
        if (segment.criteria.maxLevel && (user.level || 0) > segment.criteria.maxLevel) return false;
        if (segment.criteria.tier && (user.currentPlan !== segment.criteria.tier)) return false;
        return true;
      }).length;
    } catch (e) {
      return 0;
    }
  }

  async updateSegmentCounts() {
    for (const segment of this.segments.values()) {
      segment.userCount = await this.calculateSegmentSize(segment);
    }
  }

  createSegment(name: string, description: string, criteria: any, targetFeatures: string[]): UserSegment {
    const id = `segment_${++this.segmentId}`;
    const segment: UserSegment = {
      id,
      name,
      description,
      criteria,
      userCount: 0,
      targetFeatures,
      createdAt: new Date()
    };
    this.segments.set(id, segment);
    return segment;
  }

  deleteSegment(id: string): boolean {
    return this.segments.delete(id);
  }
}

const segmentStore = new SegmentStore();

export class UserSegmentationService {
  static async getAllSegments(): Promise<UserSegment[]> {
    await segmentStore.updateSegmentCounts();
    return segmentStore.getAll();
  }

  static createSegment(name: string, description: string, criteria: any, targetFeatures: string[]): UserSegment {
    return segmentStore.createSegment(name, description, criteria, targetFeatures);
  }

  static deleteSegment(id: string): boolean {
    return segmentStore.deleteSegment(id);
  }

  static async getSegmentUsers(segmentId: string): Promise<number> {
    const segments = await this.getAllSegments();
    return segments.find(s => s.id === segmentId)?.userCount || 0;
  }
}
