import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { type JournalEntry, type UserStats } from "@/lib/types";

export default function InsightsPage() {
  const { data: entries = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  const { data: statsResponse } = useQuery<{ stats: UserStats }>({
    queryKey: ["/api/stats"],
  });

  const stats = statsResponse?.stats;

  // Process mood data for charts
  const moodData = entries.reduce((acc, entry) => {
    const mood = entry.mood;
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodChartData = Object.entries(moodData).map(([mood, count]) => ({
    mood,
    count,
  }));

  // Process daily writing activity
  const dailyData = entries.reduce((acc, entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + entry.wordCount;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyData)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-7)
    .map(([date, wordCount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      wordCount,
    }));

  const COLORS = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#F97316'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Insights & Analytics</h1>
        <p className="text-muted-foreground">Discover patterns in your journaling journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalEntries || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats?.totalWords || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.currentStreak || 0} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats?.longestStreak || 0} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Writing Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Writing Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wordCount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mood }) => mood}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {moodChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mood Calendar */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Mood Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {/* Generate calendar grid for current month */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + i - 34);
              const dayEntry = entries.find(entry => 
                new Date(entry.createdAt).toDateString() === date.toDateString()
              );
              
              return (
                <div key={i} className="aspect-square border border-border rounded-lg p-2 flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {date.getDate()}
                  </div>
                  {dayEntry && (
                    <div className="text-lg">{dayEntry.mood}</div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
