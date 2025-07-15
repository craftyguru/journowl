import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Gift, Share2, Users, Sparkles, Mail, MessageCircle, Copy, Crown, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralCode: string;
  recentReferrals: Array<{
    id: number;
    email: string;
    status: 'pending' | 'completed';
    joinedAt: string;
    rewardClaimed: boolean;
  }>;
}

export default function ReferralPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch referral data
  const { data: referralData, isLoading } = useQuery({
    queryKey: ["/api/referrals"],
    queryFn: () => apiRequest("GET", "/api/referrals")
  });

  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const user = userResponse?.user;
  const stats: ReferralStats = referralData || {
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0,
    referralCode: user?.username ? `JOURNOWL${user.username.toUpperCase()}` : "JOURNOWL123",
    recentReferrals: []
  };

  // Send invitations mutation
  const sendInvitesMutation = useMutation({
    mutationFn: (data: { emails: string[], message: string }) => 
      apiRequest("POST", "/api/referrals/invite", data),
    onSuccess: () => {
      toast({
        title: "🎉 Invitations Sent!",
        description: "Your friends will receive their invitation emails shortly.",
      });
      setShowInviteModal(false);
      setInviteEmails("");
      setPersonalMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
    },
    onError: () => {
      toast({
        title: "Failed to Send Invitations",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "🔗 Link Copied!",
      description: "Share this link with friends to earn rewards.",
    });
  };

  const shareOnSocial = (platform: string) => {
    const referralLink = `${window.location.origin}/register?ref=${stats.referralCode}`;
    const message = `Join me on JournOwl 🦉 - the smartest journaling app with AI insights! Use my referral code and we both get 100 free AI prompts! ${referralLink}`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleSendInvites = () => {
    const emails = inviteEmails.split(',').map(email => email.trim()).filter(Boolean);
    if (emails.length === 0) {
      toast({
        title: "No Email Addresses",
        description: "Please enter at least one email address.",
        variant: "destructive",
      });
      return;
    }

    sendInvitesMutation.mutate({ emails, message: personalMessage });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-6xl">🎁</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Refer Friends & Earn!
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share the joy of journaling with JournOwl! For every friend who joins with your referral code, 
            <span className="font-bold text-purple-600"> both of you get 100 FREE AI prompts! </span>
            🦉✨
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Total Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalReferrals}</div>
                <p className="text-purple-100 text-sm">Friends invited</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5" />
                  Successful
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.successfulReferrals}</div>
                <p className="text-green-100 text-sm">Friends joined</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5" />
                  AI Prompts Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRewards}</div>
                <p className="text-orange-100 text-sm">Free prompts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="w-5 h-5" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingReferrals}</div>
                <p className="text-blue-100 text-sm">Awaiting signup</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Referral Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Referral Code */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-purple-700">
                  <Crown className="w-6 h-6" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border-2 border-purple-200">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-purple-700 font-mono tracking-wider">
                      {stats.referralCode}
                    </div>
                    <p className="text-purple-600">Share this code for instant rewards!</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={copyReferralLink}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Referral Link
                  </Button>
                  
                  <Button 
                    onClick={() => setShowShareModal(true)}
                    variant="outline"
                    className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-lg py-6"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share on Social Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Invite Friends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-xl border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
                  <Mail className="w-6 h-6" />
                  Invite Friends Directly
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-2 border-green-200">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">🎯</div>
                    <h3 className="text-xl font-bold text-green-800">100 AI Prompts Each!</h3>
                    <p className="text-green-600">Send personalized invitations via email</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowInviteModal(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Email Invitations
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => shareOnSocial('whatsapp')}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    📱 WhatsApp
                  </Button>
                  <Button 
                    onClick={() => shareOnSocial('telegram')}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    ✈️ Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-xl border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-orange-700">
                <Sparkles className="w-6 h-6" />
                How Referrals Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl text-white">1️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Share Your Code</h3>
                  <p className="text-gray-600">Send your unique referral code or link to friends and family</p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl text-white">2️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">They Sign Up</h3>
                  <p className="text-gray-600">Your friend creates a new JournOwl account using your referral code</p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl text-white">3️⃣</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Both Get Rewards!</h3>
                  <p className="text-gray-600">You and your friend each receive 100 free AI prompts instantly!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Referrals */}
        {stats.recentReferrals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6" />
                  Recent Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentReferrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {referral.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{referral.email}</p>
                          <p className="text-sm text-gray-500">{new Date(referral.joinedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                          {referral.status === 'completed' ? '✅ Joined' : '⏳ Pending'}
                        </Badge>
                        {referral.rewardClaimed && (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            🎁 Reward Claimed
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Email Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Mail className="w-6 h-6 text-green-600" />
              Send Email Invitations
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Friend's Email Addresses (comma-separated)
              </label>
              <Textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="friend1@email.com, friend2@email.com, friend3@email.com"
                className="min-h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <Textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Hey! I've been loving this journaling app called JournOwl. Want to try it together? We'll both get free AI prompts!"
                className="min-h-24"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Your friends will receive a beautiful invitation email with your referral code. 
                When they sign up, you'll both receive 100 free AI prompts!
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSendInvites}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={sendInvitesMutation.isPending}
              >
                {sendInvitesMutation.isPending ? "Sending..." : "Send Invitations 📨"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteModal(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Share2 className="w-6 h-6 text-purple-600" />
              Share on Social Media
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => shareOnSocial('twitter')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              🐦 Twitter
            </Button>
            <Button 
              onClick={() => shareOnSocial('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              📘 Facebook
            </Button>
            <Button 
              onClick={() => shareOnSocial('linkedin')}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              💼 LinkedIn
            </Button>
            <Button 
              onClick={() => shareOnSocial('whatsapp')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              📱 WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}