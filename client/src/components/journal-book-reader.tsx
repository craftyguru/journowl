import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Edit, BookOpen, Calendar, Search, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface JournalBookReaderProps {
  entries: any[];
  onClose: () => void;
  onEditEntry: (entry: any) => void;
  initialEntryIndex?: number;
}

export default function JournalBookReader({ entries, onClose, onEditEntry, initialEntryIndex = 0 }: JournalBookReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialEntryIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);


  // Filter entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    
    const query = searchQuery.toLowerCase();
    return entries.filter(entry => 
      entry.title?.toLowerCase().includes(query) ||
      entry.content?.toLowerCase().includes(query) ||
      entry.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
      new Date(entry.createdAt).toLocaleDateString().includes(query)
    );
  }, [entries, searchQuery]);

  // Update current page when search results change
  useEffect(() => {
    if (filteredEntries.length > 0 && currentPageIndex >= filteredEntries.length) {
      setCurrentPageIndex(0);
    }
  }, [filteredEntries.length, currentPageIndex]);

  // Update to show latest entry when entries change (new entries added)
  useEffect(() => {
    if (entries.length > 0 && !searchQuery.trim()) {
      // Show most recent entry when new entries are added
      setCurrentPageIndex(entries.length - 1);
    }
  }, [entries.length, searchQuery]);

  const currentEntry = filteredEntries[currentPageIndex];

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const entryDates = entries.map(entry => {
      const date = new Date(entry.createdAt);
      return {
        date: date.toDateString(),
        entry
      };
    });
    
    const groupedByDate = entryDates.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item.entry);
      return acc;
    }, {} as Record<string, any[]>);

    return groupedByDate;
  };

  const calendarData = generateCalendarDates();

  const handleDateClick = (date: string, entriesForDate: any[]) => {
    const entryIndex = entries.findIndex(entry => 
      new Date(entry.createdAt).toDateString() === date
    );
    if (entryIndex !== -1) {
      setCurrentPageIndex(entryIndex);
      setShowCalendar(false);
      setSearchQuery(""); // Clear search when navigating via calendar
    }
  };

  const handleAudioPlay = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < filteredEntries.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPageIndex(currentPageIndex + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPageIndex(currentPageIndex - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  if (!entries.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="text-center text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-2xl font-bold mb-2">Your Journal is Empty</h2>
          <p className="text-gray-300 mb-4">Start writing to fill the pages of your life book</p>
          <Button onClick={onClose} variant="outline" className="border-amber-500 text-amber-300">
            Close
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q50,25 100,0 T200,0 L200,100 Q150,75 100,100 T0,100 Z' fill='%23000000' opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}
    >
      {/* Journal Book */}
      <div className="relative w-full max-w-4xl h-[90vh] perspective-1000">
        {/* Book Cover/Pages */}
        <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl border-8 border-amber-900 overflow-hidden">
          {/* Book Binding */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-800 to-amber-700 border-r-4 border-amber-900">
            <div className="absolute top-1/4 left-1 w-2 h-8 bg-amber-900 rounded-r-full opacity-50" />
            <div className="absolute top-1/2 left-1 w-2 h-8 bg-amber-900 rounded-r-full opacity-50" />
            <div className="absolute top-3/4 left-1 w-2 h-8 bg-amber-900 rounded-r-full opacity-50" />
          </div>

          {/* Header Controls */}
          <div className="absolute top-2 left-12 right-4 z-10 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-amber-300 shadow-lg">
              <Search className="w-4 h-4 text-amber-700" />
              <Input
                placeholder="Search entries, words, dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent placeholder-amber-600 text-amber-800 focus-visible:ring-0 w-64"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-amber-200 text-amber-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEditEntry(currentEntry)}
                variant="ghost"
                className="bg-blue-500/80 hover:bg-blue-600 text-white border border-blue-400 h-10 px-4 rounded-full shadow-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="bg-red-500/80 hover:bg-red-600 text-white border border-red-400 h-10 w-10 p-0 rounded-full shadow-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Page Content */}
          <div className="pl-12 pr-8 pt-16 pb-8 h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageIndex}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="h-full flex flex-col"
              >
                {/* Page Header */}
                <div className="border-b-2 border-amber-300 pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 
                        className="text-3xl font-bold mb-2" 
                        style={{ 
                          fontFamily: currentEntry.titleFont || 'Inter',
                          color: currentEntry.titleColor || '#1f2937'
                        }}
                      >
                        {currentEntry.title || 'Untitled Entry'}
                      </h1>
                      <div className="flex items-center gap-4 text-amber-700">
                        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                          <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 hover:text-amber-900 transition-colors cursor-pointer">
                              <Calendar className="w-4 h-4" />
                              {formatEntryDate(currentEntry.createdAt)}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-lg mb-3">📅 Jump to Date</h4>
                              <div className="max-h-60 overflow-y-auto space-y-2">
                                {Object.entries(calendarData).map(([date, entriesForDate]) => (
                                  <div
                                    key={date}
                                    onClick={() => handleDateClick(date, entriesForDate)}
                                    className="flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors border border-amber-200"
                                  >
                                    <div>
                                      <div className="font-medium text-amber-800">
                                        {new Date(date).toLocaleDateString('en-US', { 
                                          weekday: 'short', 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}
                                      </div>
                                      <div className="text-sm text-amber-600">
                                        {entriesForDate.length} {entriesForDate.length === 1 ? 'entry' : 'entries'}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {entriesForDate.slice(0, 3).map((entry, idx) => (
                                        <span key={idx} className="text-lg">
                                          {entry.mood || '📝'}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <span className="text-2xl">{currentEntry.mood}</span>
                        {currentEntry.wordCount && (
                          <span className="text-sm">{currentEntry.wordCount} words</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-amber-600">
                      <div className="text-sm font-medium">Page</div>
                      <div className="text-2xl font-bold">{currentPageIndex + 1}</div>
                      <div className="text-xs">
                        of {filteredEntries.length}
                        {searchQuery && (
                          <div className="text-xs text-amber-500 mt-1">
                            (filtered)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                  <div 
                    className="prose prose-lg max-w-none leading-relaxed"
                    style={{
                      fontFamily: currentEntry.fontFamily || 'Inter',
                      fontSize: `${currentEntry.fontSize || 16}px`,
                      color: currentEntry.textColor || '#1f2937',
                      backgroundColor: currentEntry.backgroundColor === '#ffffff' ? 'transparent' : currentEntry.backgroundColor
                    }}
                  >
                    {/* Audio Recordings */}
                    {(currentEntry.audioUrl || (currentEntry.audioRecordings && currentEntry.audioRecordings.length > 0)) && (
                      <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300 shadow-lg">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                          🎵 Voice Memories 
                          <span className="text-sm bg-purple-200 px-2 py-1 rounded-full">
                            {currentEntry.audioUrl ? 1 : currentEntry.audioRecordings?.length || 0}
                          </span>
                        </h3>
                        <div className="space-y-3">
                          {/* Single audio URL (for saved entries) */}
                          {currentEntry.audioUrl && (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                  <Button
                                    onClick={() => handleAudioPlay(currentEntry.audioUrl)}
                                    variant="ghost"
                                    className="h-10 w-10 p-0 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700"
                                  >
                                    {playingAudio === currentEntry.audioUrl ? (
                                      <Pause className="w-5 h-5" />
                                    ) : (
                                      <Play className="w-5 h-5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex-1">
                                  <audio 
                                    controls 
                                    className="w-full h-8"
                                    style={{ filter: 'sepia(20%) saturate(70%) hue-rotate(315deg) brightness(1.1)' }}
                                  >
                                    <source src={currentEntry.audioUrl} type="audio/webm" />
                                    <source src={currentEntry.audioUrl} type="audio/wav" />
                                    <source src={currentEntry.audioUrl} type="audio/mp3" />
                                    Your browser does not support audio playback.
                                  </audio>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-purple-600 font-medium">
                                  Voice Recording
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Multiple audio recordings (for live/unsaved entries) */}
                          {currentEntry.audioRecordings && currentEntry.audioRecordings.map((audio: any, index: number) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                  <Button
                                    onClick={() => handleAudioPlay(audio.url)}
                                    variant="ghost"
                                    className="h-10 w-10 p-0 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700"
                                  >
                                    {playingAudio === audio.url ? (
                                      <Pause className="w-5 h-5" />
                                    ) : (
                                      <Play className="w-5 h-5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex-1">
                                  <audio 
                                    controls 
                                    className="w-full h-8"
                                    style={{ filter: 'sepia(20%) saturate(70%) hue-rotate(315deg) brightness(1.1)' }}
                                  >
                                    <source src={audio.url} type="audio/webm" />
                                    <source src={audio.url} type="audio/wav" />
                                    <source src={audio.url} type="audio/mp3" />
                                    Your browser does not support audio playback.
                                  </audio>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-purple-600 font-medium">
                                  Recording {index + 1}
                                </div>
                                {audio.duration && (
                                  <div className="text-xs text-purple-500">
                                    {Math.round(audio.duration)}s
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    {currentEntry.photos && currentEntry.photos.length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border-2 border-blue-200 shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          📸 Photo Memories
                          <span className="text-sm bg-blue-200 px-2 py-1 rounded-full">
                            {currentEntry.photos.length}
                          </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentEntry.photos.map((photo: any, index: number) => (
                            <div key={index} className="relative group">
                              <div className="relative overflow-hidden rounded-xl shadow-lg border-4 border-white hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                                <img
                                  src={photo.url || photo.src}
                                  alt={photo.caption || photo.analysis?.description || `Photo ${index + 1}`}
                                  className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {(photo.caption || photo.analysis?.description) && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                                  <p className="text-sm text-gray-700 italic text-center leading-relaxed">
                                    "{photo.caption || photo.analysis?.description}"
                                  </p>
                                  {photo.analysis && (
                                    <div className="mt-2 text-xs text-blue-600">
                                      AI Analysis: {photo.analysis.mood}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Entry Content */}
                    <div 
                      className="whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: currentEntry.content?.replace(/\n/g, '<br />') || 'This page is blank...' 
                      }}
                    />

                    {/* Tags */}
                    {currentEntry.tags && currentEntry.tags.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-amber-200">
                        <div className="flex flex-wrap gap-2">
                          {currentEntry.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm border border-amber-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            <Button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0 || isAnimating}
              variant="ghost"
              className="bg-amber-600/80 hover:bg-amber-700 text-white border border-amber-500 disabled:opacity-50 h-12 px-6 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="bg-white/90 rounded-full px-6 py-2 border-2 border-amber-300 shadow-lg">
              <span className="font-medium text-amber-800">
                Page {currentPageIndex + 1} of {filteredEntries.length}
                {searchQuery && (
                  <span className="text-xs text-amber-600 ml-2">
                    (filtered from {entries.length})
                  </span>
                )}
              </span>
            </div>

            <Button
              onClick={goToNextPage}
              disabled={currentPageIndex === filteredEntries.length - 1 || isAnimating}
              variant="ghost"
              className="bg-amber-600/80 hover:bg-amber-700 text-white border border-amber-500 disabled:opacity-50 h-12 px-6 rounded-full shadow-lg"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Page Shadow Effect */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-300/20 to-transparent pointer-events-none" />
        </div>

        {/* Instructions */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-white/80">
          <p className="text-sm">Use arrow keys or buttons to navigate • Press ESC to close</p>
        </div>
      </div>
    </motion.div>
  );
}