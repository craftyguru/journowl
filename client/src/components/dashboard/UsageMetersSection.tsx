import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Zap, Crown, Gift } from "lucide-react";

interface UsageData {
  tier: string;
  status: string;
  expiresAt?: string;
}

interface PromptUsage {
  promptsRemaining: number;
  promptsUsedThisMonth: number;
}

interface UsageMetersSectionProps {
  subscription: UsageData;
  promptUsage: PromptUsage;
  onUpgrade: () => void;
}

export function UsageMetersSection({ subscription, promptUsage, onUpgrade }: UsageMetersSectionProps) {
  const totalPrompts = 100; // Default for free tier
  const usagePercentage = ((totalPrompts - (promptUsage?.promptsRemaining || 0)) / totalPrompts) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Zap className="w-5 h-5" />
            Usage & Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-gray-700">Current Plan</span>
            </div>
            <Badge 
              variant={subscription?.tier === 'premium' ? 'default' : 'secondary'}
              className={subscription?.tier === 'premium' ? 'bg-purple-600' : ''}
            >
              {subscription?.tier?.charAt(0).toUpperCase() + subscription?.tier?.slice(1) || 'Free'}
            </Badge>
          </div>

          {/* AI Prompts Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">AI Prompts This Month</span>
              <span className="text-sm text-gray-600">
                {promptUsage?.promptsUsedThisMonth || 0} / {totalPrompts}
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-2"
            />
            <div className="text-xs text-gray-500">
              {promptUsage?.promptsRemaining || totalPrompts} prompts remaining
            </div>
          </div>

          {/* Upgrade Button */}
          {subscription?.tier !== 'premium' && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}