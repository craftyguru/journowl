import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Zap, HardDrive } from "lucide-react";

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

// Circular Progress Component
function CircularProgress({ percentage, children }: { percentage: number; children: React.ReactNode }) {
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-white text-opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-white"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function UsageMetersSection({ subscription, promptUsage, onUpgrade }: UsageMetersSectionProps) {
  const totalPrompts = 100; // Default for free tier
  const promptsRemaining = promptUsage?.promptsRemaining || 0;
  const promptPercentage = ((totalPrompts - promptsRemaining) / totalPrompts) * 100;
  
  // Storage data (mock for now)
  const totalStorage = 100; // MB
  const usedStorage = 1; // MB
  const availableStorage = totalStorage - usedStorage;
  const storagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* AI Prompts Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white text-opacity-90 text-sm font-medium">AI Prompts</span>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-white bg-opacity-20 text-white border-none">
              {subscription?.tier || 'free'} Plan
            </Badge>
          </div>
          <CardContent className="pt-16 pb-8 text-center">
            <CircularProgress percentage={(promptsRemaining / totalPrompts) * 100}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{promptsRemaining}</div>
                <div className="text-white text-opacity-70 text-xs">of {totalPrompts} prompts</div>
                <div className="text-white text-opacity-70 text-xs">Remaining</div>
              </div>
            </CircularProgress>
            
            <div className="text-white text-opacity-70 text-sm mb-4">
              Resets monthly • {totalPrompts - promptsRemaining}/100 left
            </div>
            
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white border-none"
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Off Prompts ($2.99)
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Storage Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-white" />
            <span className="text-white text-opacity-90 text-sm font-medium">Storage</span>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-white bg-opacity-20 text-white border-none">
              100 MB
            </Badge>
          </div>
          <CardContent className="pt-16 pb-8 text-center">
            <CircularProgress percentage={(availableStorage / totalStorage) * 100}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{availableStorage}</div>
                <div className="text-white text-opacity-70 text-xs">of {totalStorage} MB</div>
                <div className="text-white text-opacity-70 text-xs">Available</div>
              </div>
            </CircularProgress>
            
            <div className="text-white text-opacity-70 text-sm mb-4">
              Photos & files • {usedStorage}/100 MB used
            </div>
            
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none"
            >
              😊 Upgrade Subscription
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}