import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface WeatherPrompt {
  condition: string;
  mood_suggestion: string;
  emoji: string;
}

export function WeatherMoodPrompt() {
  const [prompt, setPrompt] = useState<WeatherPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setPrompt(data);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading || !prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{prompt.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80 capitalize">{prompt.condition}</p>
            <p className="text-sm text-white/70 italic">{prompt.mood_suggestion}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
