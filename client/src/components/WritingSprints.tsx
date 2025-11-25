import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";

export function WritingSprints() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const sprintOptions = [
    { duration: 5, label: "5 Min", target: "~100 words" },
    { duration: 10, label: "10 Min", target: "~200 words" },
    { duration: 30, label: "30 Min", target: "~600 words" }
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Writing Sprints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-white/60">Challenge yourself to write fast! Pick a sprint duration:</p>
        
        <div className="grid grid-cols-3 gap-2">
          {sprintOptions.map((sprint, idx) => (
            <motion.div
              key={sprint.duration}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                onClick={() => setSelectedDuration(sprint.duration)}
                variant={selectedDuration === sprint.duration ? "default" : "outline"}
                size="sm"
                className="w-full text-xs"
                data-testid={`button-sprint-${sprint.duration}`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {sprint.label}
              </Button>
            </motion.div>
          ))}
        </div>

        {selectedDuration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-white/10 rounded-lg text-xs text-white/70"
          >
            ⚡ Start a {selectedDuration}-min sprint - aim for {sprintOptions.find(s => s.duration === selectedDuration)?.target}
          </motion.div>
        )}

        <Button 
          className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
          disabled={!selectedDuration}
          data-testid="button-start-sprint"
        >
          Start Sprint Now
        </Button>
      </CardContent>
    </Card>
  );
}
