import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeatmapProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  calendarData: any[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export const CalendarHeatmap = ({ currentMonth, setCurrentMonth, calendarData, selectedDate, setSelectedDate }: CalendarHeatmapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              🗓️ Mood Calendar Heatmap
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium px-4">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-200 hover:shadow-lg
                  ${day.isCurrentMonth ? 'opacity-100' : 'opacity-40'}
                  ${day.isToday ? 'border-purple-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}
                  ${day.entries.length > 0 ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20' : 'bg-white dark:bg-gray-800'}
                `}
              >
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {day.date.getDate()}
                </div>
                {day.mood && (
                  <motion.div 
                    className="text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.01 + 0.2 }}
                  >
                    {day.mood}
                  </motion.div>
                )}
                {day.entries.length > 1 && (
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    +{day.entries.length - 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded border"></div>
              <span>No entries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded border border-gray-300"></div>
              <span>Has entries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
