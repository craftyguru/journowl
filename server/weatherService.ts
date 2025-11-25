export class WeatherService {
  static async getWeatherContext(lat?: number, lon?: number): Promise<{
    condition: string;
    mood_suggestion: string;
    emoji: string;
  }> {
    try {
      // If no coordinates, return default
      if (!lat || !lon) {
        return {
          condition: "partly cloudy",
          mood_suggestion: "A day full of possibilities awaits",
          emoji: "🌤️"
        };
      }

      // In production, would use real weather API
      // For now, return contextual weather-based suggestions
      const weatherPatterns = [
        {
          condition: "sunny",
          emoji: "☀️",
          mood_suggestions: [
            "Bright day, bright thoughts! Perfect for reflecting on positive moments",
            "Sunny weather energizes the soul - capture that joy in your journal",
            "Vitamin D boost! Write about what makes you feel alive today"
          ]
        },
        {
          condition: "rainy",
          emoji: "🌧️",
          mood_suggestions: [
            "Rainy days are perfect for deep reflection and introspection",
            "Let the rain inspire you - write about emotions flowing freely",
            "Cozy weather calls for honest, vulnerable journaling"
          ]
        },
        {
          condition: "cloudy",
          emoji: "☁️",
          mood_suggestions: [
            "Overcast skies invite quiet contemplation",
            "Write about the gray areas and complexities of life",
            "Perfect weather for processing mixed emotions"
          ]
        },
        {
          condition: "snowy",
          emoji: "❄️",
          mood_suggestions: [
            "Fresh snow, fresh perspective - write about new beginnings",
            "Cold weather warms the heart - journal about what matters",
            "Quiet snow day - perfect for deep reflection"
          ]
        },
        {
          condition: "stormy",
          emoji: "⛈️",
          mood_suggestions: [
            "Storms rage outside and in - let your journal be your shelter",
            "Channeling chaotic energy into written expression",
            "Write through the storm - clarity often follows turbulence"
          ]
        }
      ];

      // Randomly select a weather pattern
      const random = Math.random();
      const selected = weatherPatterns[Math.floor(random * weatherPatterns.length)];
      const moodSuggestion = selected.mood_suggestions[Math.floor(random * selected.mood_suggestions.length)];

      return {
        condition: selected.condition,
        mood_suggestion: moodSuggestion,
        emoji: selected.emoji
      };
    } catch (error) {
      console.error("Weather service error:", error);
      return {
        condition: "unknown",
        mood_suggestion: "Whatever the weather, your journal awaits",
        emoji: "📖"
      };
    }
  }
}
