import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface Message {
  role: "user" | "coach";
  message: string;
}

export function CoachingChat() {
  const [input, setInput] = useState("");
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ["/api/coaching/chat"] });

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/coaching/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coaching/chat"] });
      setInput("");
    }
  });

  return (
    <Card className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          🤖 Coaching Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-32 overflow-y-auto space-y-2 bg-white/5 rounded p-2" data-testid="chat-messages">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs p-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-600/40 text-white ml-auto max-w-xs"
                  : "bg-rose-600/40 text-white mr-auto max-w-xs"
              }`}
            >
              {msg.message}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me how you're feeling..."
            className="text-xs"
            data-testid="input-chat-message"
            onKeyPress={(e) => {
              if (e.key === "Enter" && input.trim()) {
                sendMutation.mutate(input);
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => sendMutation.mutate(input)}
            disabled={!input.trim() || sendMutation.isPending}
            data-testid="button-send-message"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
