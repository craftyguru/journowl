import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send, 
  Sparkles, 
  Crown, 
  Plus,
  FileImage,
  FileText,
  Upload,
  Eye,
  BarChart3
} from "lucide-react";

interface CampaignForm {
  title: string;
  subject: string;
  content: string;
  targetAudience: string;
}

interface EnhancedEmailCampaignsProps {
  campaignForm: CampaignForm;
  setCampaignForm: (form: CampaignForm) => void;
  sendEmailCampaign: () => void;
  campaigns: any[];
}

export default function EnhancedEmailCampaigns({ 
  campaignForm, 
  setCampaignForm, 
  sendEmailCampaign,
  campaigns 
}: EnhancedEmailCampaignsProps) {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* AI Email Assistant */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Email Campaign Assistant
          </CardTitle>
          <CardDescription>Let AI help you create engaging email campaigns with rich content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setCampaignForm({
                  ...campaignForm,
                  title: "🚀 Boost Your Journaling with AI Prompts",
                  subject: "Unlock Your Creative Potential - 100 Free AI Prompts Inside!",
                  content: `Hi {{firstName}}! 🌟

Ready to supercharge your journaling journey? We've got something special for you!

🎯 **What's Inside:**
• 100 FREE AI-generated writing prompts
• Personalized mood tracking insights
• Photo memory analysis tools
• Weekly writing challenges

✨ **Your Writing Stats:**
You've written {{totalEntries}} amazing entries so far! Keep up the incredible work.

🎁 **Special Offer:** Use code WRITE100 for 100 bonus AI prompts (worth $2.99) - FREE this week only!

Ready to dive deeper into your thoughts?

Happy Writing! ✍️
The JournOwl Team 🦉`
                });
                toast({
                  title: "AI Campaign Generated",
                  description: "Engagement campaign template created with emojis and personalization",
                });
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Engagement Campaign
            </Button>
            
            <Button
              onClick={() => {
                setCampaignForm({
                  ...campaignForm,
                  title: "🔥 Welcome to Your Journaling Adventure",
                  subject: "Welcome to JournOwl! Your wise writing companion awaits 🦉",
                  content: `Welcome to JournOwl, {{firstName}}! 🎉

We're thrilled to have you join our community of thoughtful writers and dreamers!

🦉 **Your Journey Starts Here:**
• AI-powered writing prompts tailored just for you
• Smart photo analysis to capture memories
• Mood tracking to understand your patterns
• Beautiful, private journaling space

📱 **Getting Started:**
1. Write your first entry (we've prepared a special prompt!)
2. Upload a photo and see our AI analysis magic
3. Track your mood and watch insights unfold
4. Explore our library of inspiring prompts

🎁 **Welcome Gift:** You start with 100 free AI prompts - that's weeks of inspiration!

Questions? Just reply to this email - we're here to help! 💙

Start writing your story today! ✨
The JournOwl Team`
                });
                toast({
                  title: "Welcome Campaign Generated",
                  description: "Onboarding email template created with step-by-step guidance",
                });
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Generate Welcome Series
            </Button>
            
            <Button
              onClick={() => {
                setCampaignForm({
                  ...campaignForm,
                  title: "💎 Upgrade to Pro - Special Offer Inside",
                  subject: "{{firstName}}, unlock unlimited journaling for just $8.99/month!",
                  content: `Hi {{firstName}}! 👋

We've noticed you're loving JournOwl ({{totalEntries}} entries - wow!), and we have an exclusive offer just for you.

⏰ **Limited Time: 10% OFF Annual Pro Subscription**

🌟 **What You'll Get:**
• Unlimited AI prompts (currently: {{promptsRemaining}}/100)
• Advanced photo analysis with emotion detection
• Premium writing templates and themes
• Priority customer support
• Export your journals to PDF
• Advanced analytics and insights

💰 **Your Savings:**
Regular: $107.88/year
Your Price: $97.09/year (Save $10.79!)

🎯 **Perfect for you because:**
You're already using {{promptsUsedThisMonth}} AI prompts this month - Pro gives you unlimited access!

Ready to unlock your full potential?

[UPGRADE NOW - 10% OFF] 🚀

Offer expires in 48 hours!

The JournOwl Team 🦉`
                });
                toast({
                  title: "Upsell Campaign Generated",
                  description: "Conversion-focused email with personalization and urgency",
                });
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Generate Upsell Campaign
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Campaign Builder */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Advanced Campaign Builder
            </CardTitle>
            <CardDescription>Create rich, personalized email campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                placeholder="🚀 Boost Your Journaling with AI Prompts"
              />
            </div>

            <div>
              <Label htmlFor="subject">Email Subject Line</Label>
              <Input
                id="subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                placeholder="Unlock Your Creative Potential - 100 Free AI Prompts Inside! ✨"
              />
              <div className="text-xs text-gray-500 mt-1">
                💡 Tip: Use emojis and personalization like {{firstName}} for better engagement
              </div>
            </div>

            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={campaignForm.targetAudience} onValueChange={(value) => setCampaignForm({...campaignForm, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌍 All Users</SelectItem>
                  <SelectItem value="active">🔥 Active Users (wrote in last 7 days)</SelectItem>
                  <SelectItem value="inactive">😴 Inactive Users (no entries in 14+ days)</SelectItem>
                  <SelectItem value="heavy_users">⚡ Heavy AI Users (80+ prompts used)</SelectItem>
                  <SelectItem value="new_users">🆕 New Users (joined in last 7 days)</SelectItem>
                  <SelectItem value="premium">👑 Pro Subscribers</SelectItem>
                  <SelectItem value="free">🆓 Free Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Rich Email Content</Label>
              <Textarea
                id="content"
                value={campaignForm.content}
                onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                placeholder="Hi {{firstName}}! 🌟&#10;&#10;Ready to supercharge your journaling journey?&#10;&#10;🎯 What's Inside:&#10;• 100 FREE AI-generated writing prompts&#10;• Personalized mood insights&#10;• Photo memory analysis&#10;&#10;✨ Your Stats: {{totalEntries}} entries so far!&#10;&#10;Happy Writing! ✍️&#10;The JournOwl Team 🦉"
                rows={12}
                className="font-mono text-sm"
              />
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <div><strong>Available Variables:</strong></div>
                <div>{{firstName}}, {{username}}, {{totalEntries}}, {{promptsRemaining}}, {{currentStreak}}</div>
                <div><strong>Emoji Tips:</strong> 🚀🌟✨🎯💎🔥⚡👑🦉✍️📱💙🎉👋🎁</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => {
                  // AI Content Enhancement
                  const enhanced = campaignForm.content
                    .replace(/\b(free|Free)\b/g, "🆓 FREE")
                    .replace(/\b(save|Save)\b/g, "💰 SAVE")
                    .replace(/\b(new|New)\b/g, "🆕 NEW")
                    .replace(/\b(limited|Limited)\b/g, "⏰ LIMITED")
                    .replace(/\b(bonus|Bonus)\b/g, "🎁 BONUS");
                  setCampaignForm({...campaignForm, content: enhanced});
                  toast({
                    title: "Content Enhanced",
                    description: "Added emojis and visual appeal to your email",
                  });
                }}
                variant="outline"
                className="border-purple-300 text-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance with AI
              </Button>
              
              <Button 
                onClick={sendEmailCampaign}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Campaign
              </Button>
            </div>

            {/* Rich Media Attachments */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">📎 Rich Media & Attachments</Label>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileImage className="w-3 h-3 mr-1" />
                    Add Hero Image
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Add PDF Guide
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="w-3 h-3 mr-1" />
                    Template File
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    GIF/Animation
                  </Button>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <div><strong>Supported Formats:</strong></div>
                    <div>Images: JPG, PNG, GIF (max 2MB)</div>
                    <div>Documents: PDF, DOCX (max 5MB)</div>
                    <div>💡 Rich emails with images have 42% higher engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Analytics & Recent Campaigns */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Campaign Performance
            </CardTitle>
            <CardDescription>Track your email campaign success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">Open Rate</div>
                  <div className="text-2xl font-bold text-green-600">68.4%</div>
                  <div className="text-xs text-green-600">+12% vs last month</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Click Rate</div>
                  <div className="text-2xl font-bold text-blue-600">23.7%</div>
                  <div className="text-xs text-blue-600">+8% vs last month</div>
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Campaigns</h4>
                {campaigns.length > 0 ? (
                  campaigns.slice(0, 3).map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{campaign.title}</div>
                        <div className="text-xs text-gray-500">{campaign.status} • {campaign.recipientCount} recipients</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No campaigns created yet</p>
                    <p className="text-xs">Use the AI assistant to get started!</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-3 h-3 mr-2" />
                  Preview Email in Browser
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Send className="w-3 h-3 mr-2" />
                  Send Test Email to Me
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}