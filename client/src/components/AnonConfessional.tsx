import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Send } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface AnonPost {
  id: string;
  anonymousId: string;
  content: string;
  mood: string;
  likes: number;
}

export function AnonConfessional() {
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("neutral");
  const { data: posts = [] } = useQuery<AnonPost[]>({ queryKey: ["/api/anon-posts"] });

  const postMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/anon-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: input, mood, category: "general" })
      });
      return res.json();
    },
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/anon-posts"] });
    }
  });

  return (
    <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          💬 Anonymous Confessional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Textarea
            placeholder="Share anonymously..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-xs h-16"
            data-testid="textarea-anon-confession"
          />
          <Button
            size="sm"
            onClick={() => postMutation.mutate()}
            disabled={!input.trim() || postMutation.isPending}
            className="w-full bg-pink-600 hover:bg-pink-700 gap-2"
            data-testid="button-post-confession"
          >
            <Send className="w-3 h-3" />
            Post Anonymous
          </Button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {posts.slice(0, 5).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-2 bg-white/5 rounded border border-pink-500/20"
              data-testid={`anon-post-${post.id}`}
            >
              <p className="text-xs text-white/70">{post.content.substring(0, 60)}...</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-white/50">{post.anonymousId}</span>
                <button className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
