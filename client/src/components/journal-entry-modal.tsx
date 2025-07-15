import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Sparkles } from "lucide-react";
import { type MoodEmoji } from "@/lib/types";

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: {
    id: number;
    title: string;
    content: string;
    mood: string;
  };
}

const moodEmojis: MoodEmoji[] = ["😊", "😐", "😔", "🤔", "😄", "🎉", "😠", "😴"];

export default function JournalEntryModal({ isOpen, onClose, entry }: JournalEntryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodEmoji>("😊");
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promptResponse } = useQuery({
    queryKey: ["/api/ai/personalized-prompt"],
    enabled: isOpen && !entry,
  });

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedMood(entry.mood as MoodEmoji);
    } else {
      setTitle("");
      setContent("");
      setSelectedMood("😊");
    }
  }, [entry, isOpen]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; mood: string }) => {
      const response = await apiRequest("POST", "/api/journal/entries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      toast({ title: "Entry saved successfully!", description: "Your thoughts have been recorded." });
      onClose();
      // Trigger confetti
      if (typeof window !== "undefined" && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to save entry", variant: "destructive" });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; mood: string }) => {
      const response = await apiRequest("PUT", `/api/journal/entries/${entry?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      toast({ title: "Entry updated successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update entry", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "Please fill in both title and content", variant: "destructive" });
      return;
    }

    if (entry) {
      updateEntryMutation.mutate({ title, content, mood: selectedMood });
    } else {
      createEntryMutation.mutate({ title, content, mood: selectedMood });
    }
  };

  const useAiPrompt = () => {
    if (promptResponse?.prompt) {
      setContent(promptResponse.prompt + "\n\n");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {entry ? "Edit Journal Entry" : "New Journal Entry"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">How are you feeling today?</Label>
            <div className="flex space-x-2">
              {moodEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant="ghost"
                  size="lg"
                  className={`text-3xl emoji-hover hover:bg-muted p-2 rounded-lg transition-colors ${
                    selectedMood === emoji ? "bg-primary/20" : ""
                  }`}
                  onClick={() => setSelectedMood(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-sm font-medium mb-2 block">Your thoughts</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              rows={8}
              className="w-full resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {wordCount} words
            </p>
          </div>
          
          {!entry && promptResponse?.prompt && (
            <Card className="gradient-bg from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">AI Prompt</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {promptResponse.prompt}
                </p>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={useAiPrompt}
                  className="text-primary hover:text-primary/80"
                >
                  Use This Prompt
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-bg"
              disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
            >
              {entry ? "Update Entry" : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
