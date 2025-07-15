import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Circular Gauge Component
function CircularGauge({ 
  value, 
  max, 
  label, 
  unit = "",
  size = 120,
  strokeWidth = 12,
  colors = { low: "#ef4444", medium: "#f59e0b", high: "#10b981" }
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage * circumference);
  
  // Color based on percentage (inverted for usage meters - red when low)
  const getColor = () => {
    if (percentage > 0.6) return colors.high;   // Green when plenty left
    if (percentage > 0.3) return colors.medium; // Yellow when moderate
    return colors.low;  // Red when low
  };

  const center = size / 2;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-700/30"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-white">
          {Math.round(value)}
        </div>
        <div className="text-xs text-gray-300">
          of {max} {unit}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Prompts Usage Meter */}
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Prompts
              <Badge variant="outline" className="ml-auto border-purple-400 text-purple-300">
                {usage?.tier || 'Free'} Plan
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <CircularGauge
              value={usage?.promptsRemaining || 0}
              max={100}
              label="Remaining"
              unit="prompts"
              size={140}
              strokeWidth={14}
              colors={{ 
                low: "#ef4444",    // Red when low
                medium: "#f59e0b", // Yellow when moderate  
                high: "#8b5cf6"    // Purple when plenty
              }}
            />
            
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-300">
                Resets monthly • {usage?.promptsRemaining || 0}/100 left
              </div>
              <Button 
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Top Off Prompts ($2.99)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage Meter */}
        <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Cloud className="w-5 h-5 text-blue-400" />
              Storage
              <Badge variant="outline" className="ml-auto border-blue-400 text-blue-300">
                {usage?.storageLimit || 100} MB
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <CircularGauge
              value={(usage?.storageLimit || 100) - (usage?.storageUsed || 0)}
              max={usage?.storageLimit || 100}
              label="Available"
              unit="MB"
              size={140}
              strokeWidth={14}
              colors={{ 
                low: "#ef4444",    // Red when storage full
                medium: "#f59e0b", // Yellow when getting full
                high: "#06b6d4"    // Cyan when plenty
              }}
            />
            
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-300">
                Photos & files • {usage?.storageUsed || 0}/{usage?.storageLimit || 100} MB used
              </div>
              <Button 
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Storage
              </Button>
            </div>
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