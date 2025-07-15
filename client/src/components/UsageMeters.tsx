import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Cloud, Zap, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SubscriptionManager from "./SubscriptionManager";

interface UsageData {
  tier: string;
  promptsRemaining: number;
  storageUsed: number;
  storageLimit: number;
}

export default function UsageMeters() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Get current usage data
  const { data: usage, isLoading } = useQuery<UsageData>({
    queryKey: ["/api/subscription"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const promptUsagePercentage = usage ? Math.max(0, Math.min(100, ((usage.promptsRemaining / 100) * 100))) : 0;
  const storageUsagePercentage = usage ? Math.max(0, Math.min(100, ((usage.storageUsed / usage.storageLimit) * 100))) : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Prompts Usage Meter */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Prompts Usage
              <Badge variant={usage?.tier === 'free' ? "secondary" : "default"} className="ml-auto">
                {usage?.tier || 'Free'} Plan
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prompts Remaining</span>
                <span className={`font-bold ${promptUsagePercentage < 20 ? 'text-red-600' : 'text-green-600'}`}>
                  {usage?.promptsRemaining || 0} / 100
                </span>
              </div>
              <Progress 
                value={promptUsagePercentage} 
                className="h-3"
              />
              <div className="text-xs text-gray-500">
                Resets monthly • {promptUsagePercentage.toFixed(0)}% remaining
              </div>
            </div>

            <Button 
              onClick={() => setShowSubscriptionModal(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Off Prompts ($2.99)
            </Button>
          </CardContent>
        </Card>

        {/* Storage Usage Meter */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              Storage Usage
              <Badge variant={usage?.tier === 'free' ? "secondary" : "default"} className="ml-auto">
                {usage?.storageLimit || 100} MB Limit
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span className={`font-bold ${storageUsagePercentage > 80 ? 'text-red-600' : 'text-green-600'}`}>
                  {usage?.storageUsed || 0} MB / {usage?.storageLimit || 100} MB
                </span>
              </div>
              <Progress 
                value={storageUsagePercentage} 
                className="h-3"
              />
              <div className="text-xs text-gray-500">
                Photos & attachments • {(100 - storageUsagePercentage).toFixed(1)}% available
              </div>
            </div>

            <Button 
              onClick={() => setShowSubscriptionModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Storage
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management Modal */}
      {showSubscriptionModal && (
        <SubscriptionManager onClose={() => setShowSubscriptionModal(false)} />
      )}
    </>
  );
}