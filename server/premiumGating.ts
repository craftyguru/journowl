import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export const requirePremium = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user has premium plan
    if (user.currentPlan === 'free') {
      return res.status(403).json({ error: 'Premium subscription required', plan: user.currentPlan });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Premium check failed' });
  }
};

export const getAvailableFeatures = (plan: string) => {
  const features: Record<string, boolean> = {
    unlimited_prompts: plan !== 'free',
    advanced_analytics: plan === 'power',
    ai_coaching: plan === 'power',
    custom_personality: plan === 'power',
    pdf_export: plan !== 'free',
    api_access: plan === 'power',
    team_collaboration: plan === 'power',
  };
  return features;
};

export const checkFeatureAccess = async (userId: number, feature: string): Promise<boolean> => {
  const user = await storage.getUser(userId);
  if (!user) return false;
  const features = getAvailableFeatures(user.currentPlan);
  return features[feature] || false;
};
