import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit3, Heart, Smile, Meh, Frown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format, addDays, subDays, isToday, isPast } from "date-fns";

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: "😊" | "😐" | "😔" | "🤔" | "😄";
  wordCount: number;
}

const moodColors = {
  "😊": "from-green-400 to-emerald-500",
  "😐": "from-gray-400 to-slate-500", 
  "😔": "from-blue-400 to-indigo-500",
  "🤔": "from-yellow-400 to-orange-500",
  "😄": "from-pink-400 to-rose-500"
};

const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(2024, 0, 15),
    title: "Morning Reflections",
    content: "Today I woke up feeling grateful for the opportunity to start fresh. The sun streaming through my window reminded me of all the possibilities ahead...",
    mood: "😊",
    wordCount: 287
  },
  {
    id: "2", 
    date: new Date(2024, 0, 14),
    title: "Work Breakthrough",
    content: "Finally solved that challenging project I've been working on for weeks. The feeling of accomplishment is incredible and it reminded me why I love what I do...",
    mood: "😄",
    wordCount: 432
  },
  {
    id: "3",
    date: new Date(2024, 0, 13), 
    title: "Weekend Adventures",
    content: "Spent the day exploring the local farmers market. Met so many interesting people and tried foods I'd never had before. Sometimes the best adventures are right in our own neighborhood...",
    mood: "😊",
    wordCount: 356
  }
];

export default function InteractiveJournal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries] = useState(sampleEntries);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "😊" as const });

  const currentEntry = entries.find(entry => 
    format(entry.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
  );

  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
    setIsWriting(false);
  };

  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
    setIsWriting(false);
  };

  const startWriting = () => {
    setIsWriting(true);
    setNewEntry({ title: "", content: "", mood: "😊" });
  };

  const saveEntry = () => {
    // Here would be the API call to save the entry
    setIsWriting(false);
    setNewEntry({ title: "", content: "", mood: "😊" });
  };

  return (
    <div className="relative">
      {/* Journal Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousDay}
            className="text-purple-300 hover:text-white hover:bg-purple-500/20"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="text-center">
            <motion.h2 
              key={currentDate.toString()}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
            >
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </motion.h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">
                {isToday(currentDate) && "Today"}
                {isPast(currentDate) && !isToday(currentDate) && "Past Entry"}
                {!isPast(currentDate) && !isToday(currentDate) && "Future Planning"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextDay}
            className="text-purple-300 hover:text-white hover:bg-purple-500/20"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      {/* Journal Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentDate, 'yyyy-MM-dd')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentEntry && !isWriting ? (
            // Display existing entry
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-purple-500/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${moodColors[currentEntry.mood]} flex items-center justify-center text-2xl shadow-lg`}>
                      {currentEntry.mood}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{currentEntry.title}</CardTitle>
                      <p className="text-purple-300 text-sm">{currentEntry.wordCount} words</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWriting(true)}
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-gray-300 leading-relaxed">{currentEntry.content}</p>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            // Writing interface
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-purple-500/20 overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-purple-400" />
                    {currentEntry ? "Edit Entry" : "Write New Entry"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 text-sm">Mood:</span>
                    <select
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value as any }))}
                      className="bg-slate-700 text-white rounded-lg px-3 py-1 border border-purple-500/30"
                    >
                      <option value="😄">😄 Joyful</option>
                      <option value="😊">😊 Happy</option>
                      <option value="😐">😐 Neutral</option>
                      <option value="🤔">🤔 Thoughtful</option>
                      <option value="😔">😔 Reflective</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                />
                <Textarea
                  placeholder="What's on your mind today? Share your thoughts, feelings, experiences..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[200px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-purple-300 text-sm">
                    {newEntry.content.split(' ').filter(word => word.length > 0).length} words
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsWriting(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEntry}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Save Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Entry Button for empty days */}
          {!currentEntry && !isWriting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No entry for this day</h3>
                <p className="text-gray-400 mb-4">Start writing to capture your thoughts and memories</p>
                <Button
                  onClick={startWriting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Entry
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats for this day */}
      {currentEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-sm">Words</p>
            <p className="text-2xl font-bold text-white">{currentEntry.wordCount}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-xl p-4 border border-emerald-500/20">
            <p className="text-emerald-300 text-sm">Mood</p>
            <p className="text-2xl">{currentEntry.mood}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20">
            <p className="text-blue-300 text-sm">Reading Time</p>
            <p className="text-2xl font-bold text-white">{Math.ceil(currentEntry.wordCount / 200)}m</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}