import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { type JournalEntry } from "@/lib/types";

interface RecentEntriesProps {
  onEditEntry: (entry: JournalEntry) => void;
}

export default function RecentEntries({ onEditEntry }: RecentEntriesProps) {
  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Entries</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No entries yet. Start writing your first journal entry!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div 
                key={entry.id} 
                className="card-hover bg-muted/50 p-4 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl emoji-hover">{entry.mood}</span>
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {entry.wordCount} words
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEntry(entry)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
