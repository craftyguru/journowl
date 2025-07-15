import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, 
  Filter, Eye, Edit, Star, Camera, Palette, Heart, 
  Sparkles, Pin, Share, Download, Lock, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

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
  "😊": "bg-green-200 border-green-400",
  "😐": "bg-gray-200 border-gray-400", 
  "😔": "bg-blue-200 border-blue-400",
  "🤔": "bg-purple-200 border-purple-400",
  "😄": "bg-yellow-200 border-yellow-400",
  "🎉": "bg-pink-200 border-pink-400",
  "😠": "bg-red-200 border-red-400",
  "😴": "bg-indigo-200 border-indigo-400"
};

const moodEmojis = ["😊", "😐", "😔", "🤔", "😄", "🎉", "😠", "😴"];

export default function InteractiveCalendar({ entries, onDateSelect, onEntryEdit }: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState<string>("");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
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
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
              🔥 {calculateStreak()} day streak
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

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative h-20 border border-gray-200 rounded-lg cursor-pointer transition-all
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isSelected ? 'ring-2 ring-purple-400 bg-purple-50' : ''}
                    ${hasEntries ? (primaryMood ? moodColors[primaryMood as keyof typeof moodColors] : 'bg-blue-50') : ''}
                    hover:shadow-md
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="p-1 h-full flex flex-col">
                    <div className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {format(date, 'd')}
                    </div>
                    
                    {hasEntries && (
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs text-gray-600 mb-1">
                          {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                        </div>
                        
                        {/* Entry previews */}
                        <div className="space-y-1">
                          {dayEntries.slice(0, 2).map(entry => (
                            <div key={entry.id} className="flex items-center gap-1">
                              <span className="text-xs">{entry.mood}</span>
                              {entry.photos && entry.photos.length > 0 && (
                                <Camera className="w-2 h-2 text-gray-500" />
                              )}
                              {entry.isPinned && (
                                <Pin className="w-2 h-2 text-yellow-500" />
                              )}
                              {entry.isPrivate && (
                                <Lock className="w-2 h-2 text-red-500" />
                              )}
                            </div>
                          ))}
                          {dayEntries.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{dayEntries.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
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
      </div>
    </div>
  );
}