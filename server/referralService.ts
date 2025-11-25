export interface Referral {
  id: string;
  referrerId: number;
  referredUserId: number;
  referralCode: string;
  bonusPromptsAwarded: number;
  createdAt: Date;
  completedAt?: Date;
}

class ReferralStore {
  private referrals: Map<string, Referral> = new Map();
  private codeToUser: Map<string, number> = new Map();
  private referralId = 0;

  generateCode(userId: number): string {
    const code = `JOW${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    this.codeToUser.set(code, userId);
    return code;
  }

  createReferral(referrerId: number, referredUserId: number, referralCode: string): Referral {
    const referral: Referral = {
      id: `ref_${++this.referralId}`,
      referrerId,
      referredUserId,
      referralCode,
      bonusPromptsAwarded: 50,
      createdAt: new Date()
    };
    this.referrals.set(referral.id, referral);
    return referral;
  }

  completeReferral(referralId: string): Referral | null {
    const referral = this.referrals.get(referralId);
    if (referral) {
      referral.completedAt = new Date();
      this.referrals.set(referralId, referral);
      return referral;
    }
    return null;
  }

  getUserReferrals(userId: number): Referral[] {
    const userReferrals: Referral[] = [];
    this.referrals.forEach(ref => {
      if (ref.referrerId === userId) {
        userReferrals.push(ref);
      }
    });
    return userReferrals;
  }

  getReferralByCode(code: string): number | null {
    return this.codeToUser.get(code) || null;
  }

  getStats(userId: number) {
    const referrals = this.getUserReferrals(userId);
    const completed = referrals.filter(r => r.completedAt).length;
    const totalBonus = completed * 50;

    return {
      totalReferrals: referrals.length,
      completedReferrals: completed,
      totalBonusPrompts: totalBonus,
      referralCode: `JOW${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      referralLevel: completed <= 5 ? "Advocate" : completed <= 20 ? "Ambassador" : "VIP"
    };
  }
}

export const referralStore = new ReferralStore();

export class ReferralService {
  static generateReferralCode(userId: number): string {
    return referralStore.generateCode(userId);
  }

  static createReferral(referrerId: number, referredUserId: number, referralCode: string): Referral {
    return referralStore.createReferral(referrerId, referredUserId, referralCode);
  }

  static completeReferral(referralId: string): Referral | null {
    return referralStore.completeReferral(referralId);
  }

  static getUserReferrals(userId: number): Referral[] {
    return referralStore.getUserReferrals(userId);
  }

  static getReferralByCode(code: string): number | null {
    return referralStore.getReferralByCode(code);
  }

  static getStats(userId: number) {
    return referralStore.getStats(userId);
  }
}
