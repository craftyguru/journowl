import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

const levelColors = {
  0: "bg-white/10",
  1: "bg-green-900",
  2: "bg-green-700",
  3: "bg-green-500",
  4: "bg-green-400"
};

export function JournalHeatmap() {
  const { data: heatmapData = [] } = useQuery<HeatmapData[]>({
    queryKey: ["/api/heatmap/activity"]
  });

  // Group by weeks
  const weeks: any[] = [];
  let currentWeek: any[] = [];

  heatmapData.forEach((day, idx) => {
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Journaling Activity
        </CardTitle>
        <CardDescription>Last 365 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weeks.map((week, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className="flex gap-1"
            >
              {week.map((day: any) => (
                <motion.div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${levelColors[day.level as keyof typeof levelColors]}`}
                  title={`${day.date}: ${day.count} entries`}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-white/60 mt-4">Darker green = more entries</p>
      </CardContent>
    </Card>
  );
}
