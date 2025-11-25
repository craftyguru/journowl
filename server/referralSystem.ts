import { storage } from './storage';

export class ReferralSystem {
  // Generate unique referral code for user
  static generateReferralCode(userId: number): string {
    return `JO${userId}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  // Track referral signup
  static async trackReferral(referrerUserId: number, newUserId: number) {
    try {
      // Award referrer XP
      const awardXp = 50;
      const user = await storage.getUser(referrerUserId);
      if (user) {
        await storage.updateUserXP(referrerUserId, (user.xp || 0) + awardXp);
      }
      console.log(`✅ Referral tracked: ${referrerUserId} → ${newUserId}, +${awardXp} XP`);
      return { success: true, xpAwarded: awardXp };
    } catch (error) {
      console.error('Referral tracking error:', error);
      return { success: false };
    }
  }

  // Get referral stats
  static async getReferralStats(userId: number) {
    try {
      // In a real app, you'd query a referrals table
      return {
        referralCode: ReferralSystem.generateReferralCode(userId),
        totalReferrals: 0,
        totalXpEarned: 0,
        link: `https://journowl.app/invite?code=${ReferralSystem.generateReferralCode(userId)}`
      };
    } catch (error) {
      return { referralCode: '', totalReferrals: 0, totalXpEarned: 0, link: '' };
    }
  }
}
