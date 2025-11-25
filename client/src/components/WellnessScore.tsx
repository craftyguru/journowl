import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function WellnessScore() {
  const { data: score = 0 } = useQuery({
    queryKey: ["/api/wellness/score"]
  });

  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400";
  const bgColor = score >= 80 ? "from-green-500/20 to-green-600/20" : score >= 60 ? "from-yellow-500/20 to-yellow-600/20" : "from-red-500/20 to-red-600/20";

  return (
    <Card className={`bg-gradient-to-br ${bgColor} border-opacity-50`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Daily Wellness Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center justify-center"
        >
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>{score}</div>
            <p className="text-xs text-white/60 mt-1">/ 100</p>
          </div>
        </motion.div>
        <div className="w-full bg-white/10 rounded-full h-2 mt-4">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${scoreColor.includes("green") ? "from-green-400 to-green-500" : scoreColor.includes("yellow") ? "from-yellow-400 to-yellow-500" : "from-red-400 to-red-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
