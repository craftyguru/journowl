import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, 
  Filter, Eye, Edit, Star, Camera, Palette, Heart, 
  Sparkles, Pin, Share, Download, Lock, Unlock, Plus,
  Mic, Sticker, Flame, Zap, Award, Image, Smile
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

export default function InteractiveCalendar({ entries, onDateSelect, onEntryEdit }: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState<string>("");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState<Date | null>(null);

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
    onDateSelect(date);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Memory Calendar</h2>
              <p className="text-purple-100 text-sm">Your journey through time</p>
            </div>
          </div>
          
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
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search entries, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-purple-200"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Mood
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={filterMood === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMood("")}
                  className="text-xs"
                >
                  All
                </Button>
                {moodEmojis.map(mood => (
                  <Button
                    key={mood}
                    variant={filterMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterMood(mood)}
                    className="text-lg"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h3 className="text-xl font-bold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dayEntries = getEntriesForDate(date);
              const primaryMood = getDateMood(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const hasEntries = dayEntries.length > 0;
              const isHovered = hoveredDate && isSameDay(date, hoveredDate);
              const isTodayDate = isToday(date);
              const microSummary = getMicroSummary(date);

              return (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    z: 10
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredDate(date)}
                  onHoverEnd={() => setHoveredDate(null)}
                  className={`
                    relative h-24 border-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group
                    ${isCurrentMonth ? 'opacity-100' : 'opacity-60'}
                    ${isSelected ? 'ring-4 ring-purple-400 shadow-2xl transform scale-105' : ''}
                    ${isTodayDate ? 'ring-2 ring-yellow-400 shadow-lg' : ''}
                    ${hasEntries && primaryMood ? 
                      moodBackgrounds[primaryMood as keyof typeof moodBackgrounds] : 
                      'bg-white border-gray-200'}
                    ${isHovered ? 'shadow-xl transform translate-y-1' : 'shadow-md'}
                    hover:shadow-2xl
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  {/* Gradient mood overlay */}
                  {hasEntries && primaryMood && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${moodColors[primaryMood as keyof typeof moodColors]} opacity-10 rounded-xl`} />
                  )}
                  
                  {/* Today indicator */}
                  {isTodayDate && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
                    />
                  )}

                  <div className="p-2 h-full flex flex-col relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`text-lg font-bold ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isTodayDate ? 'text-yellow-600' : ''}`}>
                        {format(date, 'd')}
                      </div>
                      
                      {/* Quick actions on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex gap-1"
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickAdd(date, "entry");
                                  }}
                                  className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Quick Add Entry</TooltipContent>
                            </Tooltip>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {hasEntries && (
                      <div className="flex-1 overflow-hidden">
                        {/* Micro-summary */}
                        {microSummary && (
                          <div className="text-xs bg-white/80 rounded px-2 py-1 mb-1 font-medium text-gray-700">
                            {microSummary}
                          </div>
                        )}
                        
                        {/* Entry count with animation */}
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs text-gray-600 mb-1 font-medium"
                        >
                          {dayEntries.length} {dayEntries.length === 1 ? 'memory' : 'memories'}
                        </motion.div>
                        
                        {/* Photo thumbnails */}
                        {dayEntries.some(e => e.photos && e.photos.length > 0) && (
                          <div className="flex gap-1 mb-1">
                            {dayEntries.slice(0, 3).map(entry => 
                              entry.photos?.slice(0, 2).map((photo, pIndex) => (
                                <div key={pIndex} className="w-4 h-4 bg-blue-200 rounded border overflow-hidden">
                                  <Image className="w-full h-full text-blue-600" />
                                </div>
                              ))
                            )}
                          </div>
                        )}
                        
                        {/* Special indicators */}
                        <div className="flex gap-1 items-center">
                          {dayEntries.some(e => e.isPinned) && (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                            </motion.div>
                          )}
                          {dayEntries.some(e => e.isPrivate) && (
                            <Lock className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Empty state with encourage action */}
                    {!hasEntries && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex-1 flex flex-col items-center justify-center text-center"
                      >
                        <Plus className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add memory</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Sidebar */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h3 className="font-bold text-lg">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <p className="text-purple-100 text-sm">
                  {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                {selectedDateEntries.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No entries for this day</p>
                    <Button 
                      className="mt-2" 
                      size="sm"
                      onClick={() => onDateSelect(selectedDate)}
                    >
                      Create Entry
                    </Button>
                  </div>
                ) : (
                  selectedDateEntries.map(entry => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{entry.mood}</span>
                            <h4 className="font-medium text-gray-900 truncate flex-1">
                              {entry.title}
                            </h4>
                          </div>
                          
                          <div className="flex gap-1">
                            {entry.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                            {entry.isPrivate && <Lock className="w-3 h-3 text-red-500" />}
                            {entry.photos && entry.photos.length > 0 && <Camera className="w-3 h-3 text-blue-500" />}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {entry.content}
                        </p>
                        
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {entry.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {entry.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{entry.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {entry.wordCount} words
                          </span>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEntryEdit(entry)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Memory Lane Timeline - Bottom Section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 bg-gradient-to-r from-purple-100 via-pink-50 to-blue-50 rounded-xl p-4 border border-purple-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-purple-800">🌟 Memory Lane</h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Recap This Month
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {entries.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-lg shadow-md p-2 cursor-pointer border-2 border-transparent hover:border-purple-300"
                onClick={() => onEntryEdit(entry)}
              >
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
      </div>
    </div>
    </TooltipProvider>
  );
}