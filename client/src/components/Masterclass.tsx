import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, ChevronRight } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: number;
  tips: string[];
  example: string;
}

export function Masterclass() {
  const { data: lessons = [] } = useQuery<Lesson[]>({ queryKey: ["/api/masterclass/lessons"] });

  return (
    <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          📚 Masterclass
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lessons.slice(0, 3).map((lesson, idx) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 bg-white/5 rounded border border-cyan-500/20 cursor-pointer hover:border-cyan-500/50 transition"
            data-testid={`lesson-${lesson.id}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{lesson.title}</p>
                <p className="text-xs text-white/60 mt-1">{lesson.category}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-white/50 mt-2">{lesson.duration} min read</p>
          </motion.div>
        ))}
        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-sm" data-testid="button-view-all-lessons">
          View All Lessons
        </Button>
      </CardContent>
    </Card>
  );
}
