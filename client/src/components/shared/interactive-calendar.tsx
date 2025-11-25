import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, 
  Filter, Eye, Edit, Star, Camera, Palette, Heart, 
  Sparkles, Pin, Share, Download, Lock, Unlock, Plus,
  Mic, Sticker, Flame, Zap, Award, Image, Smile, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";

interface JournalEntry {
  id: number;
  date: Date;
  title: string;
  content: string;
  mood: string;
  photos?: string[];
  tags?: string[];
  isPrivate?: boolean;
  isPinned?: boolean;
  wordCount?: number;
}

interface InteractiveCalendarProps {
  entries: JournalEntry[];
  onDateSelect: (date: Date) => void;
  onEntryEdit: (entry: JournalEntry) => void;
  onEntryDelete?: (entryId: number) => void;
}

const moodColors = {
  "😊": "from-green-400 via-emerald-400 to-teal-400",
  "😐": "from-gray-400 via-slate-400 to-zinc-400", 
  "😔": "from-blue-400 via-indigo-400 to-purple-400",
  "🤔": "from-purple-400 via-violet-400 to-fuchsia-400",
  "😄": "from-yellow-400 via-amber-400 to-orange-400",
  "🎉": "from-pink-400 via-rose-400 to-red-400",
  "😠": "from-red-400 via-orange-400 to-yellow-400",
  "😴": "from-indigo-400 via-blue-400 to-cyan-400"
};

const moodBackgrounds = {
  "😊": "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300",
  "😐": "bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 border-gray-300", 
  "😔": "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-300",
  "🤔": "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 border-purple-300",
  "😄": "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-300",
  "🎉": "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-pink-300",
  "😠": "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-red-300",
  "😴": "bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-indigo-300"
};

const moodEmojis = ["😊", "😐", "😔", "🤔", "😄", "🎉", "😠", "😴"];

export default function InteractiveCalendar({ entries, onDateSelect, onEntryEdit, onEntryDelete }: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState<string>("");
  const [viewMode, setViewMode] = useState<"month" | "week" | "year">("month");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isRangeSelecting, setIsRangeSelecting] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showPrivateEntries, setShowPrivateEntries] = useState(true);
  const [calendarTheme, setCalendarTheme] = useState<"default" | "dark" | "colorful">("colorful");
  const [sortBy, setSortBy] = useState<"date" | "mood" | "wordCount" | "title">("date");
  const [showMiniPreview, setShowMiniPreview] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Calculate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({
    start: new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate() - monthStart.getDay()),
    end: new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + (6 - monthEnd.getDay()))
  });

  // Filter entries based on search and mood
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMood = !filterMood || entry.mood === filterMood;
      
      return matchesSearch && matchesMood;
    });
  }, [entries, searchTerm, filterMood]);

  // Get entries for a specific date
  const getEntriesForDate = (date: Date) => {
    return filteredEntries.filter(entry => isSameDay(entry.date, date));
  };

  // Get the primary mood for a date (most common mood)
  const getDateMood = (date: Date) => {
    const dayEntries = getEntriesForDate(date);
    if (dayEntries.length === 0) return null;
    
    const moodCounts = dayEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0][0];
  };

  // Calculate streak information
  const calculateStreak = () => {
    const sortedDates = [...new Set(entries.map(e => e.date.toDateString()))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 0;
    let lastDate = new Date();
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        lastDate = date;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  // Generate micro-summary for a date
  const getMicroSummary = (date: Date) => {
    const dayEntries = getEntriesForDate(date);
    if (dayEntries.length === 0) return null;
    
    const moods = [...new Set(dayEntries.map(e => e.mood))];
    const photoCount = dayEntries.reduce((sum, e) => sum + (e.photos?.length || 0), 0);
    const wordCount = dayEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
    
    const elements = [];
    if (moods.length > 0) elements.push(moods.slice(0, 3).join(" "));
    if (photoCount > 0) elements.push(`📸 ${photoCount}`);
    if (dayEntries.some(e => e.isPinned)) elements.push("⭐");
    if (wordCount > 500) elements.push("📝");
    
    return elements.join(" ");
  };

  // Quick add functions
  const handleQuickAdd = (date: Date, type: "entry" | "photo" | "voice") => {
    setShowQuickAdd(null);
    setSelectedDate(date);
    onDateSelect(date); // This will open the journal for new entry
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Only show the sidebar, don't automatically open journal
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [showMobileStats, setShowMobileStats] = useState(false);

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
      {/* Mobile-Optimized Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Memory Calendar</h2>
              <p className="text-purple-100 text-xs sm:text-sm hidden sm:block">Your journey through time</p>
            </div>
          </div>
          
          {/* Mobile Stats Toggle */}
          {isMobile ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="text-white hover:bg-white/10 p-2"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-lg px-3 py-1 text-sm font-bold shadow-lg"
              >
                🔥 {calculateStreak()} day streak
              </motion.div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                📊 {entries.length} memories
              </div>
            </div>
          )}
        </div>

        {/* Mobile Stats Dropdown */}
        {isMobile && showMobileStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 rounded-lg p-3 mt-3 flex gap-4 justify-around text-sm"
          >
            <div className="text-center">
              <div className="font-bold">🔥 {calculateStreak()}</div>
              <div className="text-purple-100 text-xs">Streak</div>
            </div>
            <div className="text-center">
              <div className="font-bold">📊 {entries.length}</div>
              <div className="text-purple-100 text-xs">Memories</div>
            </div>
            <div className="text-center">
              <div className="font-bold">📝 {entries.reduce((sum, e) => sum + (e.wordCount || 0), 0)}</div>
              <div className="text-purple-100 text-xs">Words</div>
            </div>
          </motion.div>
        )}

        {/* Advanced Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 justify-start"
              >
                <Filter className="w-4 h-4 mr-2" />
                {filterMood || "All Moods"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={!filterMood ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterMood("")}
                  className="h-10"
                >
                  All
                </Button>
                {moodEmojis.map((mood) => (
                  <Button
                    key={mood}
                    variant={filterMood === mood ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterMood(mood)}
                    className="h-10 text-lg"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="bg-white/10 hover:bg-white/20 text-white flex-1"
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="bg-white/10 hover:bg-white/20 text-white flex-1"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("year")}
              className="bg-white/10 hover:bg-white/20 text-white flex-1"
            >
              Year
            </Button>
          </div>

          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showHeatmap ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Flame className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Activity Heatmap</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showPrivateEntries ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowPrivateEntries(!showPrivateEntries)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  {showPrivateEntries ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Private Entries</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRangeSelecting(!isRangeSelecting)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Pin className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select Date Range</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-purple-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="hover:bg-purple-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="hover:bg-purple-50"
              >
                Today
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="hover:bg-purple-50">
                    <Palette className="w-4 h-4 mr-2" />
                    Theme
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-2">
                    {[
                      { key: "colorful", label: "Colorful", icon: "🌈" },
                      { key: "default", label: "Clean", icon: "⚪" },
                      { key: "dark", label: "Dark", icon: "🌙" }
                    ].map((theme) => (
                      <Button
                        key={theme.key}
                        variant={calendarTheme === theme.key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCalendarTheme(theme.key as any)}
                        className="w-full justify-start"
                      >
                        <span className="mr-2">{theme.icon}</span>
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Calendar Header Days */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const dayEntries = getEntriesForDate(date);
              const hasEntries = dayEntries.length > 0;
              const primaryMood = getDateMood(date);
              const microSummary = getMicroSummary(date);
              const isInRange = selectedRange.start && selectedRange.end && 
                date >= selectedRange.start && date <= selectedRange.end;

              return (
                <motion.div
                  key={index}
                  initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : false}
                  animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
                  transition={animationsEnabled ? { delay: index * 0.01 } : undefined}
                  whileHover={animationsEnabled ? { scale: 1.05, y: -2 } : undefined}
                  className={`
                    relative h-24 sm:h-28 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? 'border-gray-200' : 'border-gray-100 opacity-60'}
                    ${isSelected ? 'ring-4 ring-purple-300 border-purple-400' : ''}
                    ${isInRange ? 'bg-purple-100 border-purple-300' : ''}
                    ${isToday(date) ? 'ring-2 ring-amber-400 border-amber-300' : ''}
                    ${hasEntries ? 
                      (calendarTheme === 'colorful' && primaryMood ? 
                        `bg-gradient-to-br ${moodColors[primaryMood as keyof typeof moodColors]} opacity-80` : 
                        'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200') : 
                      'bg-white hover:bg-gray-50'}
                  `}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {/* Date Number */}
                  <div className={`
                    absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                    ${isToday(date) ? 'bg-amber-400 text-white' : 
                      hasEntries ? 'bg-white/80 text-gray-800' : 'text-gray-600'}
                  `}>
                    {format(date, 'd')}
                  </div>

                  {/* Entry Indicators */}
                  {hasEntries && (
                    <div className="absolute top-2 right-2">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${dayEntries.length > 3 ? 'bg-emerald-500' : 
                          dayEntries.length > 1 ? 'bg-blue-500' : 'bg-purple-500'}
                      `}>
                        <div className="absolute -top-1 -right-1 text-xs font-bold text-white bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center">
                          {dayEntries.length}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Micro Summary */}
                  {microSummary && showMiniPreview && (
                    <div className="absolute bottom-1 left-1 right-1 text-xs truncate text-center text-gray-700 bg-white/60 rounded px-1">
                      {microSummary}
                    </div>
                  )}

                  {/* Quick Add Button on Hover */}
                  {hoveredDate && isSameDay(hoveredDate, date) && !hasEntries && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-purple-500/10 rounded-xl"
                    >
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQuickAdd(date);
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Heatmap Overlay */}
                  {showHeatmap && hasEntries && (
                    <div className={`
                      absolute inset-0 rounded-xl opacity-60
                      ${dayEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) > 1000 ? 'bg-red-400' :
                        dayEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) > 500 ? 'bg-orange-400' :
                        dayEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) > 100 ? 'bg-yellow-400' : 'bg-green-400'}
                    `} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar for Selected Date */}
        {selectedDate && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(null)}
              >
                ✕
              </Button>
            </div>

            {selectedDateEntries.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="flex items-center gap-2 flex-1 cursor-pointer" 
                        onClick={() => onEntryEdit(entry)}
                      >
                        <span className="text-2xl">{entry.mood}</span>
                        <span className="text-sm font-medium text-gray-700">{entry.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.isPinned && <Star className="w-4 h-4 text-amber-500" />}
                        {entry.isPrivate && <Lock className="w-4 h-4 text-purple-500" />}
                        {onEntryDelete && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show colorful animated confirmation dialog
                              const confirmDiv = document.createElement('div');
                              confirmDiv.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center';
                              confirmDiv.innerHTML = `
                                <div class="bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 text-white p-8 rounded-3xl shadow-2xl border-2 border-red-300/30 backdrop-blur-lg max-w-md mx-4 animate-bounce">
                                  <div class="text-center">
                                    <div class="text-6xl mb-4 animate-pulse">🗑️</div>
                                    <div class="text-2xl font-bold mb-2">Delete Entry?</div>
                                    <div class="text-red-100 mb-6">Are you sure you want to delete "${entry.title}"? This action cannot be undone.</div>
                                    <div class="flex gap-4 justify-center">
                                      <button id="confirmDeleteEntry" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                                        🗑️ Delete
                                      </button>
                                      <button id="cancelDeleteEntry" class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                                        ❌ Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              `;
                              document.body.appendChild(confirmDiv);
                              
                              const handleConfirm = () => {
                                if (onEntryDelete) {
                                  onEntryDelete(entry.id);
                                }
                                document.body.removeChild(confirmDiv);
                              };
                              
                              document.getElementById('confirmDeleteEntry')?.addEventListener('click', handleConfirm);
                              
                              document.getElementById('cancelDeleteEntry')?.addEventListener('click', () => {
                                document.body.removeChild(confirmDiv);
                              });
                              
                              confirmDiv.addEventListener('click', (e) => {
                                if (e.target === confirmDiv) document.body.removeChild(confirmDiv);
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    <div onClick={() => onEntryEdit(entry)} className="cursor-pointer">
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {entry.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{entry.wordCount || 0} words</span>
                        <div className="flex gap-2">
                          {entry.photos && entry.photos.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {entry.photos.length}
                            </span>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <span>#</span>
                              {entry.tags.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No memories for this day</p>
                <Button
                  onClick={() => onDateSelect(selectedDate)}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Memory
                </Button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(selectedDate, "entry")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs">Write</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(selectedDate, "photo")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-xs">Photo</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Entry Popup */}
      {showQuickAdd && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowQuickAdd(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Quick Add - {format(showQuickAdd, 'MMM d')}</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleQuickAdd(showQuickAdd, "entry")}
                className="flex flex-col items-center gap-2 h-20 bg-purple-500 hover:bg-purple-600"
              >
                <Edit className="w-6 h-6" />
                <span className="text-sm">Journal Entry</span>
              </Button>
              <Button
                onClick={() => handleQuickAdd(showQuickAdd, "photo")}
                className="flex flex-col items-center gap-2 h-20 bg-blue-500 hover:bg-blue-600"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Photo Memory</span>
              </Button>
              <Button
                onClick={() => handleQuickAdd(showQuickAdd, "voice")}
                className="flex flex-col items-center gap-2 h-20 bg-green-500 hover:bg-green-600"
              >
                <Mic className="w-6 h-6" />
                <span className="text-sm">Voice Note</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Memories Ticker */}
      {entries.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Recent Memories</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {entries.slice(0, 8).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-lg shadow-md p-2 border-2 border-transparent hover:border-purple-300 group relative"
              >
                {onEntryDelete && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show colorful animated confirmation dialog
                      const confirmDiv = document.createElement('div');
                      confirmDiv.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center';
                      confirmDiv.innerHTML = `
                        <div class="bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 text-white p-8 rounded-3xl shadow-2xl border-2 border-red-300/30 backdrop-blur-lg max-w-md mx-4 animate-bounce">
                          <div class="text-center">
                            <div class="text-6xl mb-4 animate-pulse">🗑️</div>
                            <div class="text-2xl font-bold mb-2">Delete Entry?</div>
                            <div class="text-red-100 mb-6">Are you sure you want to delete "${entry.title}"? This action cannot be undone.</div>
                            <div class="flex gap-4 justify-center">
                              <button id="confirmDelete" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                                🗑️ Delete
                              </button>
                              <button id="cancelDelete" class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(confirmDiv);
                      
                      document.getElementById('confirmDelete')?.addEventListener('click', () => {
                        onEntryDelete(entry.id);
                        document.body.removeChild(confirmDiv);
                      });
                      
                      document.getElementById('cancelDelete')?.addEventListener('click', () => {
                        document.body.removeChild(confirmDiv);
                      });
                      
                      confirmDiv.addEventListener('click', (e) => {
                        if (e.target === confirmDiv) document.body.removeChild(confirmDiv);
                      });
                    }}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg z-10"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                )}
                <div className="cursor-pointer" onClick={() => onEntryEdit(entry)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{entry.mood}</span>
                    <div className="text-xs text-gray-500">
                      {format(entry.date, 'MMM d')}
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 line-clamp-2">
                    {entry.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {entry.wordCount} words
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add Memory Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-32 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-dashed border-purple-300 flex flex-col items-center justify-center cursor-pointer hover:from-purple-200 hover:to-pink-200"
              onClick={() => onDateSelect(new Date())}
            >
              <Plus className="w-6 h-6 text-purple-500 mb-1" />
              <span className="text-xs text-purple-600 font-medium">Add Memory</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
    </TooltipProvider>
  );
}
