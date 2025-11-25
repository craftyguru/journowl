import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Moon, Plus } from "lucide-react";

interface Dream {
  id: string;
  title: string;
  mood: string;
  vividness: number;
  themes: string[];
}

interface DreamAnalysis {
  totalDreams: number;
  commonThemes: [string, number][];
  averageVividness: number;
  recentMood: string;
}

export function DreamJournal() {
  const { data: dreams = [] } = useQuery<Dream[]>({ queryKey: ["/api/dreams"] });
  const { data: analysis } = useQuery<DreamAnalysis>({ queryKey: ["/api/dreams/analysis"] });

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Moon className="w-4 h-4" />
          🌙 Dream Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis && (
          <div className="p-2 bg-white/5 rounded text-xs text-white/70">
            <p>📊 Total dreams: <span className="font-semibold">{analysis.totalDreams}</span></p>
            <p>✨ Avg vividness: <span className="font-semibold">{analysis.averageVividness}/10</span></p>
          </div>
        )}

        {dreams.slice(0, 3).map((dream, idx) => (
          <motion.div
            key={dream.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-2 bg-white/5 rounded border border-purple-500/20"
            data-testid={`dream-${dream.id}`}
          >
            <p className="text-xs font-semibold text-white">{dream.title}</p>
            <p className="text-xs text-white/60 mt-1">{dream.mood} • Vividness: {dream.vividness}/10</p>
          </motion.div>
        ))}

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm gap-2" data-testid="button-add-dream">
          <Plus className="w-4 h-4" />
          Record Dream
        </Button>
      </CardContent>
    </Card>
  );
}
