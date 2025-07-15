import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { type JournalEntry } from "@/lib/types";

interface MoodTrackerProps {
  onTrackMood: () => void;
}

export default function MoodTracker({ onTrackMood }: MoodTrackerProps) {
  const { data: entries = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  const getWeeklyMoods = () => {
    const today = new Date();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyMoods = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.toDateString() === date.toDateString();
      });
      
      weeklyMoods.push({
        day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
        mood: dayEntries.length > 0 ? dayEntries[0].mood : null,
        date: date.toISOString()
      });
    }

    return weeklyMoods;
  };

  const weeklyMoods = getWeeklyMoods();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weeklyMoods.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
              {day.mood ? (
                <span className="text-2xl emoji-hover cursor-pointer">{day.mood}</span>
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="text-muted-foreground text-sm">?</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onTrackMood}
          className="w-full bg-muted hover:bg-muted/80 text-foreground"
        >
          Track Today's Mood
        </Button>
      </CardContent>
    </Card>
  );
}
