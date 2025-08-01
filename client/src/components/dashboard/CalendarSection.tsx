import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import type { JournalEntry } from "./types";

interface CalendarSectionProps {
  entries: JournalEntry[];
  onDateSelect: (date: Date) => void;
  onEntryEdit: (entry: JournalEntry) => void;
}

export function CalendarSection({ entries, onDateSelect, onEntryEdit }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const getEntryForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = targetDate.toISOString().split('T')[0];
    
    return entries.find(entry => {
      if (!entry.createdAt) return false;
      const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
      return entryDate === dateString;
    });
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const entry = getEntryForDate(day);
    
    if (entry) {
      onEntryEdit(entry);
    } else {
      onDateSelect(selectedDate);
    }
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 w-12"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = getEntryForDate(day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(day)}
          className={`
            h-12 w-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 relative
            ${entry 
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg' 
              : 'hover:bg-gray-100 text-gray-700'
            }
            ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          `}
        >
          {day}
          {entry && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs">{entry.mood}</span>
            </div>
          )}
        </motion.button>
      );
    }
    
    return days;
  };
  
  const getRecentEntries = () => {
    return entries
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Journal Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-gray-800 min-w-[120px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {renderCalendarDays()}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
                <span>Has entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 ring-2 ring-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="w-3 h-3" />
                <span>Click to add entry</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {getRecentEntries().length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No entries yet. Start writing to see them here!
            </div>
          ) : (
            <div className="space-y-3">
              {getRecentEntries().map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onEntryEdit(entry)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.mood}</span>
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {entry.title}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(entry.createdAt || '').toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {entry.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.wordCount || 0} words
                    </Badge>
                    {entry.photos && entry.photos.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        📸 {entry.photos.length}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}