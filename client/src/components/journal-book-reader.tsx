import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Edit, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalBookReaderProps {
  entries: any[];
  onClose: () => void;
  onEditEntry: (entry: any) => void;
  initialEntryIndex?: number;
}

export default function JournalBookReader({ entries, onClose, onEditEntry, initialEntryIndex = 0 }: JournalBookReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialEntryIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentEntry = entries[currentPageIndex];

  const goToNextPage = () => {
    if (currentPageIndex < entries.length - 1 && !isAnimating) {
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
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
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

          {/* Page Content */}
          <div className="pl-12 pr-8 py-8 h-full overflow-hidden">
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
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatEntryDate(currentEntry.createdAt)}
                        </span>
                        <span className="text-2xl">{currentEntry.mood}</span>
                        {currentEntry.wordCount && (
                          <span className="text-sm">{currentEntry.wordCount} words</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-amber-600">
                      <div className="text-sm font-medium">Page</div>
                      <div className="text-2xl font-bold">{currentPageIndex + 1}</div>
                      <div className="text-xs">of {entries.length}</div>
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
                    {currentEntry.audioRecordings && currentEntry.audioRecordings.length > 0 && (
                      <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">🎵 Audio Memories</h3>
                        <div className="space-y-2">
                          {currentEntry.audioRecordings.map((audio: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                              <audio controls className="flex-1">
                                <source src={audio.url} type="audio/webm" />
                                <source src={audio.url} type="audio/wav" />
                                Your browser does not support audio playback.
                              </audio>
                              <span className="text-xs text-purple-600">
                                {audio.duration ? `${Math.round(audio.duration)}s` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    {currentEntry.photos && currentEntry.photos.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentEntry.photos.map((photo: any, index: number) => (
                            <div key={index} className="relative">
                              <img
                                src={photo.url}
                                alt={photo.caption || `Photo ${index + 1}`}
                                className="w-full rounded-lg shadow-lg border-4 border-white"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                              />
                              {photo.caption && (
                                <p className="text-sm text-gray-600 mt-2 italic text-center">
                                  {photo.caption}
                                </p>
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
                Page {currentPageIndex + 1} of {entries.length}
              </span>
            </div>

            <Button
              onClick={goToNextPage}
              disabled={currentPageIndex === entries.length - 1 || isAnimating}
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