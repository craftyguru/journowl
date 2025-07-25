import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  photos?: Array<string> | Array<{ url: string; timestamp: string }>;
  drawings?: Array<any>;
  tags?: string[];
  date?: string;
  wordCount?: number;
  photoAnalysis?: any;
}

interface JournalEntriesListProps {
  entries: JournalEntry[];
  onEntrySelect: (entry: JournalEntry) => void;
  onEntryDelete?: (entryId: number) => void;
}

export default function JournalEntriesList({ entries, onEntrySelect, onEntryDelete }: JournalEntriesListProps) {
  const queryClient = useQueryClient();

  const handleDeleteEntry = async (entryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await apiRequest(`/api/journal/entries/${entryId}`, 'DELETE');
      
      queryClient.invalidateQueries({ queryKey: ['/api/journal/entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/journal/stats'] });
      
      if (onEntryDelete) {
        onEntryDelete(entryId);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'excited': '🤩',
      'calm': '😌',
      'angry': '😠',
      'anxious': '😰',
      'grateful': '🙏',
      'confused': '🤔',
      'content': '😊',
      'frustrated': '😤'
    };
    return moodMap[mood?.toLowerCase()] || '😐';
  };

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No entries yet</h3>
            <p className="text-sm text-muted-foreground">Start your journaling journey by creating your first entry!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Recent Entries
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {entries.slice(0, 5).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onEntrySelect(entry)}
              className="group p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {entry.title || 'Untitled Entry'}
                    </h4>
                    {entry.tags && entry.tags.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {entry.tags[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {entry.content?.substring(0, 120)}...
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                    {entry.wordCount && (
                      <div>{entry.wordCount} words</div>
                    )}
                    {entry.photos && entry.photos.length > 0 && (
                      <div>📸 {entry.photos.length}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteEntry(entry.id, e)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}