import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Stats {
  currentStreak?: number;
}

interface CalendarEntry {
  id: number;
  title?: string;
  content?: string;
}

interface KidCalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedCalendarDate: number | null;
  calendarEntries: { [key: number]: CalendarEntry };
  stats: Stats;
  onMonthChange: (month: number, year: number) => void;
  onDateClick: (day: number) => void;
  onDateClear: () => void;
  onWriteToday: () => void;
}

export function KidCalendar({
  currentMonth,
  currentYear,
  selectedCalendarDate,
  calendarEntries,
  stats,
  onMonthChange,
  onDateClick,
  onDateClear,
  onWriteToday,
}: KidCalendarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-bold text-purple-800 mb-2">My Writing Calendar</h3>
        <p className="text-purple-600 mb-4">Track your amazing writing adventures!</p>
      </div>

      <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-4 border-3 border-purple-300 shadow-lg">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            onMonthChange(newMonth, newYear);
          }}
          className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg border-2 border-white min-h-[44px] flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Last Month</span>
        </motion.button>
        
        <div className="text-center">
          <h4 className="text-xl font-bold text-purple-800">
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h4>
          <p className="text-purple-600 text-sm">Click days to write!</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            onMonthChange(newMonth, newYear);
          }}
          className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg border-2 border-white min-h-[44px] flex items-center gap-2"
        >
          <span className="text-sm">Next Month</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="bg-white rounded-3xl p-4 md:p-6 border-3 border-purple-300 shadow-xl">
        <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold text-purple-700 py-1 md:py-2 text-xs md:text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {(() => {
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const today = new Date();
            const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();
            
            const days = [];
            
            for (let i = 0; i < firstDay; i++) {
              days.push(
                <div key={`empty-${i}`} className="aspect-square min-h-[40px]"></div>
              );
            }
            
            for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
              const hasEntry = calendarEntries[dayNumber];
              const isToday = isCurrentMonth && dayNumber === today.getDate();
              const isSelected = selectedCalendarDate === dayNumber;
              
              days.push(
                <motion.div 
                  key={`day-${dayNumber}`}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDateClick(dayNumber)}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-all min-h-[40px] ${
                    isSelected
                      ? "bg-gradient-to-br from-purple-400 to-pink-400 border-purple-500 shadow-xl scale-105"
                      : isToday 
                        ? "bg-gradient-to-br from-yellow-300 to-orange-300 border-orange-400 shadow-lg" 
                        : hasEntry 
                          ? "bg-gradient-to-br from-green-200 to-emerald-200 border-green-400 shadow-md" 
                          : "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:from-purple-200 hover:to-pink-200 hover:shadow-md"
                  }`}
                >
                  <span className={
                    isSelected 
                      ? "text-white" 
                      : isToday 
                        ? "text-orange-800" 
                        : hasEntry 
                          ? "text-green-800" 
                          : "text-purple-700"
                  }>
                    {dayNumber}
                  </span>
                  {hasEntry && (
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs"
                      title={hasEntry.title ? `"${hasEntry.title}"` : "Journal entry"}
                    >
                      ✨
                    </motion.span>
                  )}
                  {isToday && (
                    <motion.span 
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xs"
                    >
                      📝
                    </motion.span>
                  )}
                  {isSelected && <span className="text-xs text-white">👆</span>}
                </motion.div>
              );
            }
            
            return days;
          })()}
        </div>
        
        <div className="flex justify-center gap-3 md:gap-4 mt-6 flex-wrap">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-lg border-2 border-orange-400 shadow-sm"
            ></motion.div>
            <span className="text-xs md:text-sm text-purple-700 font-medium">📝 Today</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-5 h-5 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg border-2 border-green-400 shadow-sm"
            ></motion.div>
            <span className="text-xs md:text-sm text-purple-700 font-medium">✨ Story Written</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 shadow-sm"></div>
            <span className="text-xs md:text-sm text-purple-700 font-medium">📅 Available</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWriteToday}
            className="bg-gradient-to-r from-green-400 to-cyan-400 p-4 rounded-2xl border-3 border-green-500 cursor-pointer shadow-lg text-center"
          >
            <div className="text-2xl mb-2">✍️</div>
            <p className="text-white font-bold text-sm">Write Today!</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDateClear}
            className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-2xl border-3 border-purple-500 cursor-pointer shadow-lg text-center"
          >
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-white font-bold text-sm">Clear Selection</p>
          </motion.div>
        </div>
        
        {selectedCalendarDate && calendarEntries[selectedCalendarDate] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-200 rounded-2xl p-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📖</div>
              <h4 className="font-bold text-green-800 mb-2">
                {calendarEntries[selectedCalendarDate].title || `Entry for Day ${selectedCalendarDate}`}
              </h4>
              <p className="text-green-600 text-sm mb-3">
                {calendarEntries[selectedCalendarDate].content?.substring(0, 100)}
                {calendarEntries[selectedCalendarDate].content?.length! > 100 ? "..." : ""}
              </p>
              <Button 
                onClick={() => onDateClick(selectedCalendarDate)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                ✏️ Edit This Story
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 border-3 border-pink-300 text-center mt-6"
      >
        <div className="text-4xl mb-2">🔥</div>
        <h4 className="text-xl font-bold text-purple-800 mb-1">{stats.currentStreak || 0} Day Streak!</h4>
        <p className="text-purple-600">Keep writing every day to grow your streak!</p>
      </motion.div>
    </motion.div>
  );
}
