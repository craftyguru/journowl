import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Search, Download, Share2, Plus, X,
  FileText, Globe, Printer, Sparkles
} from "lucide-react";
import { type JournalEntry, type UserStats } from "@/lib/types";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { InsightsSummary } from "@/components/insights/InsightsSummary";
import { InsightsCharts } from "@/components/insights/InsightsCharts";
import { CalendarHeatmap } from "@/components/insights/CalendarHeatmap";
import { AIInsightsPanel } from "@/components/insights/AIInsightsPanel";

// Real data from API

export default function InsightsPage() {
  const [viewMode, setViewMode] = useState<"week" | "month" | "year">("month");
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [selectedExportDates, setSelectedExportDates] = useState<Date[]>([]);
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Fetch real user data
  const { data: entriesData = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['/api/journal/entries'],
    retry: false,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    retry: false,
  });

  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/insights'],
    retry: false,
  });

  if (entriesLoading || statsLoading || insightsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const entries = (entriesData as any[]) || [];
  const stats = (statsData as any)?.stats || { totalEntries: 0, totalWords: 0, currentStreak: 0, longestStreak: 0 };

  // Process mood data for charts
  const moodData = entries.reduce((acc: any, entry: any) => {
    const mood = entry.mood;
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodChartData = Object.entries(moodData || {}).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round(((count as number) / (entries.length || 1)) * 100)
  }));

  // Process daily writing activity
  const dailyChartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayEntries = entries.filter(entry => 
      new Date(entry.createdAt).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      wordCount: dayEntries.reduce((sum, entry) => sum + entry.wordCount, 0),
      entries: dayEntries.length,
      mood: dayEntries[0]?.mood || null
    };
  });

  const MOOD_COLORS = {
    '😊': '#10B981', '🤔': '#8B5CF6', '😄': '#F59E0B', 
    '😐': '#6B7280', '🎉': '#F97316', '😔': '#EF4444'
  };

  const CHART_COLORS = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#F97316'];

  // Generate calendar data
  const generateCalendarData = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEntries = entries.filter(entry => 
        new Date(entry.createdAt).toDateString() === date.toDateString()
      );
      
      days.push({
        date,
        entries: dayEntries,
        mood: dayEntries[0]?.mood,
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  const calendarData = generateCalendarData();

  // Button handlers
  const handleAddEntry = () => {
    setLocation("/dashboard");
    toast({
      title: "Redirecting to Dashboard",
      description: "Opening Smart Journal to create a new entry",
    });
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleExportChoice = (format: string) => {
    setSelectedExportFormat(format);
    setShowExportModal(false);
    setShowDateSelector(true);
  };

  const handleDateToggle = (date: Date) => {
    const dateStr = date.toDateString();
    const isSelected = selectedExportDates.some(d => d.toDateString() === dateStr);
    
    if (isSelected) {
      setSelectedExportDates(selectedExportDates.filter(d => d.toDateString() !== dateStr));
    } else {
      setSelectedExportDates([...selectedExportDates, date]);
    }
  };

  const handleExportWithDates = () => {
    const selectedEntries = entries.filter(entry => 
      selectedExportDates.some(date => 
        new Date(entry.createdAt).toDateString() === date.toDateString()
      )
    );

    setShowDateSelector(false);
    setSelectedExportDates([]);
    
    if (selectedExportFormat === "json") {
      exportAsJSON(selectedEntries);
    } else if (selectedExportFormat === "html") {
      exportAsHTML(selectedEntries);
    } else if (selectedExportFormat === "text") {
      exportAsText(selectedEntries);
    }
  };

  const exportAsJSON = (selectedEntries = entries) => {
    const exportData = {
      stats: stats,
      entries: selectedEntries,
      insights: insightsData,
      exportDate: new Date().toISOString(),
      totalEntries: selectedEntries.length,
      totalWords: selectedEntries.reduce((sum, entry) => sum + entry.wordCount, 0),
      currentStreak: stats.currentStreak
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `journal-insights-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Export Complete",
      description: "Your journal data has been exported as JSON",
    });
  };

  const exportAsHTML = (selectedEntries = entries) => {
    const sortedEntries = [...selectedEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My JournOwl Journal</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #8B5CF6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #8B5CF6;
            font-size: 2.5em;
            margin: 0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #8B5CF6;
        }
        .entry {
            background: white;
            margin-bottom: 30px;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 5px solid #8B5CF6;
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .entry-title {
            font-size: 1.5em;
            font-weight: bold;
            color: #333;
        }
        .entry-date {
            color: #666;
            font-size: 0.9em;
        }
        .entry-mood {
            font-size: 1.5em;
            margin-left: 10px;
        }
        .entry-content {
            color: #444;
            font-size: 1.1em;
            line-height: 1.8;
        }
        .entry-meta {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #8B5CF6;
            color: #666;
        }
        @media print {
            body { background: white; }
            .entry { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🦉 My JournOwl Journal</h1>
        <p>A collection of my thoughts and reflections</p>
        <p><em>Exported on ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</em></p>
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value">${sortedEntries.length}</div>
            <div>Selected Entries</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${sortedEntries.reduce((sum, entry) => sum + entry.wordCount, 0)}</div>
            <div>Words Written</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.currentStreak}</div>
            <div>Current Streak</div>
        </div>
    </div>

    ${sortedEntries.map(entry => `
        <div class="entry">
            <div class="entry-header">
                <div>
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-date">
                        ${new Date(entry.createdAt).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        <span class="entry-mood">${entry.mood}</span>
                    </div>
                </div>
            </div>
            <div class="entry-content">
                ${entry.content.replace(/\n/g, '<br>')}
            </div>
            
            ${entry.photos && entry.photos.length > 0 ? `
            <div class="entry-photos" style="margin-top: 15px;">
                <strong>Photos:</strong><br>
                ${entry.photos.map(photo => `
                    <img src="${photo.url || photo.data}" alt="Journal photo" style="max-width: 300px; max-height: 200px; margin: 5px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                `).join('')}
            </div>
            ` : ''}
            
            ${entry.drawings && entry.drawings.length > 0 ? `
            <div class="entry-drawings" style="margin-top: 15px;">
                <strong>Drawings:</strong><br>
                ${entry.drawings.map(drawing => `
                    <img src="${drawing.dataUrl || drawing.data}" alt="Journal drawing" style="max-width: 300px; max-height: 200px; margin: 5px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                `).join('')}
            </div>
            ` : ''}
            
            <div class="entry-meta">
                <strong>Word Count:</strong> ${entry.wordCount} words
                ${entry.tags && entry.tags.length > 0 ? `<br><strong>Tags:</strong> ${entry.tags.join(', ')}` : ''}
            </div>
        </div>
    `).join('')}

    <div class="footer">
        <p><em>Created with JournOwl - Your AI-powered journaling companion</em></p>
        <p>Keep writing, keep growing! 🌱</p>
    </div>
</body>
</html>`;

    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    const exportFileDefaultName = `journal-${new Date().toISOString().split('T')[0]}.html`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Journal Export Complete",
      description: "Your journal has been exported as a readable HTML file",
    });
  };

  const exportAsText = (selectedEntries = entries) => {
    const sortedEntries = [...selectedEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const textContent = `
═══════════════════════════════════════════════════════════════════════════════
                            🦉 MY JOURNOWL JOURNAL
                        A Collection of My Thoughts & Reflections
                        
                        Exported on ${new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
═══════════════════════════════════════════════════════════════════════════════

📊 JOURNAL STATISTICS
──────────────────────────────────────────────────────────────────────────────
Selected Entries: ${sortedEntries.length}
Words Written: ${sortedEntries.reduce((sum, entry) => sum + entry.wordCount, 0)}
Current Streak: ${stats.currentStreak} days
Longest Streak: ${stats.longestStreak} days

${sortedEntries.map(entry => `
╔══════════════════════════════════════════════════════════════════════════════╗
║  ${entry.title.toUpperCase()}                                                
║  ${new Date(entry.createdAt).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} ${entry.mood}
╚══════════════════════════════════════════════════════════════════════════════╝

${entry.content}

${entry.photos && entry.photos.length > 0 ? `
📸 PHOTOS: ${entry.photos.length} attached
${entry.photos.map((photo, i) => `   Photo ${i + 1}: ${photo.url || 'Embedded image'}`).join('\n')}
` : ''}
${entry.drawings && entry.drawings.length > 0 ? `
🎨 DRAWINGS: ${entry.drawings.length} attached
${entry.drawings.map((drawing, i) => `   Drawing ${i + 1}: ${drawing.dataUrl ? 'Embedded drawing' : 'Drawing data'}`).join('\n')}
` : ''}
────────────────────────────────────────────────────────────────────────────── 
Word Count: ${entry.wordCount} words
${entry.tags && entry.tags.length > 0 ? `Tags: ${entry.tags.join(', ')}` : ''}
──────────────────────────────────────────────────────────────────────────────
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
                    Created with JournOwl - Your AI-powered journaling companion
                              Keep writing, keep growing! 🌱
═══════════════════════════════════════════════════════════════════════════════
`;

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
    const exportFileDefaultName = `journal-${new Date().toISOString().split('T')[0]}.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Print-Ready Export Complete",
      description: "Your journal has been exported as a formatted text file",
    });
  };

  const handleShare = async () => {
    const shareText = `📊 My JournOwl Journey\n\n✏️ ${stats.totalEntries} entries written\n📝 ${stats.totalWords} words total\n🔥 ${stats.currentStreak} day streak\n\nDiscover your own patterns with JournOwl!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My JournOwl Journey',
          text: shareText,
          url: window.location.href
        });
        toast({
          title: "Shared Successfully",
          description: "Your journal insights have been shared",
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to Clipboard",
          description: "Your journal insights have been copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Share Failed",
          description: "Unable to share insights. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsAskingAI(true);
    try {
      const response = await fetch('/api/ai/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: aiQuestion,
          entries: entries.slice(0, 10), // Send recent entries for context
          stats: stats
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          setAiResponse(errorData.error || 'You\'ve reached your AI prompt limit. Upgrade to continue asking questions or wait for your monthly reset.');
          toast({
            title: "Prompt Limit Reached",
            description: "Upgrade to get more AI prompts",
            variant: "destructive"
          });
          return;
        }
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.response);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your question has been analyzed",
      });
    } catch (error) {
      console.error('Error asking AI:', error);
      setAiResponse('Sorry, I encountered an error while analyzing your question. Please try again.');
      toast({
        title: "AI Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                📊 Insights & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover patterns in your journaling journey
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button 
                onClick={handleAddEntry}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search entries, moods, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="😊">😊 Happy</SelectItem>
                <SelectItem value="🤔">🤔 Thoughtful</SelectItem>
                <SelectItem value="😄">😄 Excited</SelectItem>
                <SelectItem value="😐">😐 Neutral</SelectItem>
                <SelectItem value="🎉">🎉 Celebratory</SelectItem>
              </SelectContent>
            </Select>
            <Select value={viewMode} onValueChange={(value: "week" | "month" | "year") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <InsightsSummary stats={stats} />

        <InsightsCharts 
          chartType={chartType}
          setChartType={setChartType}
          dailyChartData={dailyChartData}
          moodChartData={moodChartData}
          stats={stats}
        />

        <CalendarHeatmap 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          calendarData={calendarData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <AIInsightsPanel 
          stats={stats}
          aiQuestion={aiQuestion}
          setAiQuestion={setAiQuestion}
          isAskingAI={isAskingAI}
          aiResponse={aiResponse}
          onAskAI={handleAskAI}
        />

        {/* Selected Date Modal */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedDate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                    ✕
                  </Button>
                </div>
                
                {calendarData.find(d => d.date.toDateString() === selectedDate.toDateString())?.entries.map((entry, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{entry.mood}</span>
                      <h4 className="font-medium">{entry.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {entry.wordCount} words
                    </p>
                    {(entry as any).tags && (
                      <div className="flex gap-1">
                        {(entry as any).tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Modal */}
        <AnimatePresence>
          {showExportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowExportModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    📥 Export Your Journal
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowExportModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose how you'd like to export your journal entries:
                </p>

                <div className="space-y-4">
                  {/* JSON Export */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleExportChoice('json')}
                      className="w-full h-auto p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8" />
                        <div className="text-left">
                          <div className="font-semibold">Data Export (JSON)</div>
                          <div className="text-sm text-blue-100">
                            Technical backup with all your stats and entries
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>

                  {/* HTML Export */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleExportChoice('html')}
                      className="w-full h-auto p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <div className="flex items-center gap-4">
                        <Globe className="h-8 w-8" />
                        <div className="text-left">
                          <div className="font-semibold">Beautiful Journal (HTML)</div>
                          <div className="text-sm text-purple-100">
                            Styled format perfect for viewing and printing
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>

                  {/* Text Export */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleExportChoice('text')}
                      className="w-full h-auto p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <div className="flex items-center gap-4">
                        <Printer className="h-8 w-8" />
                        <div className="text-left">
                          <div className="font-semibold">Print-Ready Format</div>
                          <div className="text-sm text-green-100">
                            Clean text format ideal for physical journals
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Tip</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Choose HTML for a beautiful digital journal or Print-Ready for creating a physical book. JSON is perfect for backing up your data.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Selector Modal */}
        <AnimatePresence>
          {showDateSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDateSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    📅 Select Dates to Export
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDateSelector(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose which days you want to include in your {selectedExportFormat} export:
                </p>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExportDates(entries.map((e: any) => new Date(e.createdAt)))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExportDates([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lastWeek = new Date();
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      setSelectedExportDates(entries.filter(e => new Date(e.createdAt) >= lastWeek).map(e => new Date(e.createdAt)));
                    }}
                  >
                    Last Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lastMonth = new Date();
                      lastMonth.setMonth(lastMonth.getMonth() - 1);
                      setSelectedExportDates(entries.filter(e => new Date(e.createdAt) >= lastMonth).map(e => new Date(e.createdAt)));
                    }}
                  >
                    Last Month
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {calendarData.map((day, index) => {
                    const hasEntries = day.entries.length > 0;
                    const isSelected = selectedExportDates.some(date => 
                      date.toDateString() === day.date.toDateString()
                    );
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: hasEntries ? 1.1 : 1 }}
                        whileTap={{ scale: hasEntries ? 0.95 : 1 }}
                        className={`
                          aspect-square p-2 rounded-lg cursor-pointer text-center text-sm font-medium transition-all
                          ${hasEntries ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                          ${!day.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : ''}
                          ${day.isToday ? 'ring-2 ring-purple-500' : ''}
                          ${hasEntries && isSelected ? 'bg-purple-500 text-white' : ''}
                          ${hasEntries && !isSelected ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50' : ''}
                          ${!hasEntries ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : ''}
                        `}
                        onClick={() => hasEntries && handleDateToggle(day.date)}
                      >
                        <div className="text-xs mb-1">{day.date.getDate()}</div>
                        {hasEntries && (
                          <div className="flex justify-center items-center gap-0.5">
                            {day.entries.slice(0, 3).map((entry, i) => (
                              <span key={i} className="text-xs">{entry.mood}</span>
                            ))}
                            {day.entries.length > 3 && (
                              <span className="text-xs">+{day.entries.length - 3}</span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Count */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedExportDates.length} dates selected
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {entries.filter(entry => 
                      selectedExportDates.some(date => 
                        new Date(entry.createdAt).toDateString() === date.toDateString()
                      )
                    ).length} entries will be exported
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDateSelector(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExportWithDates}
                    disabled={selectedExportDates.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Export {selectedExportDates.length} Days
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Note</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Only days with journal entries can be selected. Photos and drawings will be included in your export.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
