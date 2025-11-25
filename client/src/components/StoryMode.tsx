import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Download } from "lucide-react";

export function StoryMode() {
  const { data: narrative } = useQuery({ queryKey: ["/api/story/narrative"] });
  const { data: stats } = useQuery({ queryKey: ["/api/story/stats"] });

  return (
    <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          📖 Story Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {narrative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-white/5 rounded-lg border border-indigo-500/30 text-xs text-white/80 leading-relaxed max-h-48 overflow-y-auto"
            data-testid="story-narrative"
          >
            {narrative}
          </motion.div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white/5 rounded">
              <p className="text-white/60">Total Words</p>
              <p className="text-lg font-bold text-indigo-300">{stats.totalWords?.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <p className="text-white/60">Reading Time</p>
              <p className="text-lg font-bold text-indigo-300">{stats.readingTime}m</p>
            </div>
          </div>
        )}

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm gap-2" data-testid="button-download-story">
          <Download className="w-4 h-4" />
          Download Story
        </Button>
      </CardContent>
    </Card>
  );
}
