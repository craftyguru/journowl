import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Users, Gift, Copy, TrendingUp } from "lucide-react";

interface User {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
  level?: number;
}

interface ReferralTabProps {
  user: User;
}

export default function ReferralTab({ user }: ReferralTabProps) {
  const copyReferralLink = () => {
    const referralLink = `https://journowl.com/join?ref=${user?.id || 'demo'}`;
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">🎁 Refer Friends & Earn AI Prompts!</h2>
          <p className="text-gray-300 text-lg">Share JournOwl with friends and get 100 free AI prompts for each successful referral!</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-white mb-4">📤 Your Referral Link</h3>
            <div className="flex gap-2">
              <Input 
                value={`https://journowl.com/join?ref=${user?.id || 'demo'}`}
                readOnly
                className="bg-slate-700/50 border-purple-400/30 text-white"
              />
              <Button 
                onClick={copyReferralLink}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-2">Share this link with friends to start earning rewards!</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-800/40 to-emerald-800/40 rounded-xl p-6 border border-green-400/30">
            <h3 className="text-xl font-bold text-white mb-4">🏆 Your Referral Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Referrals:</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">AI Prompts Earned:</span>
                <span className="text-green-400 font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pending Referrals:</span>
                <span className="text-yellow-400 font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-white mb-1">Step 1: Share</h4>
            <p className="text-gray-400 text-sm">Send your referral link to friends</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
            <div className="text-2xl mb-2">✨</div>
            <h4 className="font-semibold text-white mb-1">Step 2: They Join</h4>
            <p className="text-gray-400 text-sm">Friends sign up using your link</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
            <div className="text-2xl mb-2">🎁</div>
            <h4 className="font-semibold text-white mb-1">Step 3: Earn Rewards</h4>
            <p className="text-gray-400 text-sm">Get 100 AI prompts per referral</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}