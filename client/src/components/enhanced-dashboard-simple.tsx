import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus, CheckCircle, ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import InteractiveJournal from "./interactive-journal";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";
import PromptPurchase from "./PromptPurchase";
import UsageMeters from "./UsageMeters";
import { AIStoryMaker } from "./kid-dashboard";

interface EnhancedDashboardProps {
  onSwitchToKid: () => void;
  initialTab?: string;
}

export default function EnhancedDashboard({ onSwitchToKid, initialTab = "journal" }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🦉 JournOwl Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Your intelligent journaling companion</p>
          </div>
          
          {/* Usage Meters */}
          <div className="w-full sm:w-auto">
            <UsageMeters />
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            <TabsTrigger value="journal">📝 Journal</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Achievements</TabsTrigger>
            <TabsTrigger value="goals">🎯 Goals</TabsTrigger>
            <TabsTrigger value="calendar">📅 Calendar</TabsTrigger>
            <TabsTrigger value="insights">🤖 AI Thoughts</TabsTrigger>
            <TabsTrigger value="story-maker">📚 AI Stories</TabsTrigger>
            <TabsTrigger value="referrals">👥 Referrals</TabsTrigger>
          </TabsList>

          {/* Journal Tab */}
          <TabsContent value="journal">
            <div className="space-y-6">
              <Card className="shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    Smart Journal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowUnifiedJournal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Open Journal Book
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Writing Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics content will go here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs... */}
          <TabsContent value="achievements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🏆 Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Achievements will be displayed here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Your Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Goals will be displayed here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📅 Memory Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Enhanced calendar with interactive tools will go here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🤖 AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">AI-powered insights will be displayed here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="story-maker">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📚 AI Story Maker</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIStoryMaker />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>👥 Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Referral system will be displayed here...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Journal Editor Modal */}
        {showUnifiedJournal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <h2 className="text-lg font-bold">📖 Smart Journal Editor</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUnifiedJournal(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
              <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                <SmartJournalEditor onClose={() => setShowUnifiedJournal(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}