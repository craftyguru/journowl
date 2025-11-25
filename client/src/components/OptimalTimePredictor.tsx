import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Bell } from "lucide-react";

interface OptimalTime {
  bestHour: number;
  prediction: string;
  confidence: number;
  message: string;
  nextReminder: string;
}

export function OptimalTimePredictor() {
  const { data: prediction } = useQuery<OptimalTime>({
    queryKey: ["/api/optimal-time"]
  });

  if (!prediction) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Optimal Writing Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center p-4 bg-white/10 rounded-lg"
        >
          <div className="text-4xl font-bold text-blue-300">{prediction.prediction}</div>
          <p className="text-xs text-white/60 mt-2">{prediction.message}</p>
          <div className="mt-2 text-xs text-white/50">
            {prediction.confidence.toFixed(0)}% confidence based on your patterns
          </div>
        </motion.div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm gap-2" data-testid="button-set-reminder">
          <Bell className="w-4 h-4" />
          Set Daily Reminder
        </Button>
      </CardContent>
    </Card>
  );
}
