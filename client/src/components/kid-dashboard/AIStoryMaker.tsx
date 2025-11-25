import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIStoryMakerProps {
  entries: any[];
  stats: any;
}

export function AIStoryMaker({ entries, stats }: AIStoryMakerProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('week');
  const [storyLength, setStoryLength] = useState('medium');
  const [selectedEntries, setSelectedEntries] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyFont, setStoryFont] = useState('Comic Sans MS');
  const [storyColor, setStoryColor] = useState('#4F46E5');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    const now = new Date();
    let startDate = new Date();
    
    switch (selectedDateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filtered = entries.filter(entry => 
      new Date(entry.createdAt) >= startDate
    );
    setSelectedEntries(filtered);
  }, [entries, selectedDateRange]);

  const generateStory = async () => {
    if (selectedEntries.length === 0) return;

    setIsGenerating(true);
    try {
      const entrySummaries = selectedEntries.map(entry => ({
        date: new Date(entry.createdAt).toLocaleDateString(),
        title: entry.title,
        content: entry.content?.substring(0, 200) || '',
        mood: entry.mood
      }));

      const prompt = `Create a fun, engaging ${storyLength} story based on these journal entries from a kid. Make it creative and narrative-style, connecting the events together into one cohesive adventure story. Include emotions and make it exciting to read!

Journal entries:
${entrySummaries.map(entry => 
  `Date: ${entry.date}
Title: ${entry.title}
Content: ${entry.content}
Mood: ${entry.mood}
---`
).join('\n')}

Story length: ${storyLength === 'short' ? '2-3 paragraphs' : storyLength === 'medium' ? '4-6 paragraphs' : '8-10 paragraphs'}
Make it sound like an adventure book for kids!`;

      const response = await apiRequest('POST', '/api/ai/generate-story', {
        prompt,
        entries: entrySummaries
      });

      setGeneratedStory((response as any).story);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-indigo-700">📅 Time Period</Label>
          <select 
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-indigo-200 bg-white text-indigo-800 font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="week">This Week 📆</option>
            <option value="month">This Month 🗓️</option>
            <option value="year">This Year 📅</option>
            <option value="all">My Whole Journey 🌟</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-indigo-700">📏 Story Length</Label>
          <select 
            value={storyLength}
            onChange={(e) => setStoryLength(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-indigo-200 bg-white text-indigo-800 font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="short">Short & Sweet 📝</option>
            <option value="medium">Just Right 📖</option>
            <option value="long">Epic Adventure 📚</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-indigo-700">🎨 Font Style</Label>
          <select 
            value={storyFont}
            onChange={(e) => setStoryFont(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-indigo-200 bg-white text-indigo-800 font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="Comic Sans MS">Comic Sans (Fun!) 😄</option>
            <option value="Georgia">Georgia (Classic) 📜</option>
            <option value="Times New Roman">Times (Formal) 🎓</option>
            <option value="Arial">Arial (Clean) ✨</option>
            <option value="Courier New">Typewriter (Cool!) 📰</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-indigo-700">🌈 Text Color</Label>
          <input 
            type="color"
            value={storyColor}
            onChange={(e) => setStoryColor(e.target.value)}
            className="w-full h-12 rounded-xl border-2 border-indigo-200 cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-200">
        <h4 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
          📋 Selected Entries ({selectedEntries.length})
        </h4>
        {selectedEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
            {selectedEntries.map((entry, index) => (
              <div key={entry.id} className="bg-white p-3 rounded-xl border border-indigo-200">
                <div className="font-semibold text-indigo-700 text-sm">{entry.title}</div>
                <div className="text-xs text-gray-600">{new Date(entry.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-indigo-600 mt-1">Mood: {entry.mood}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No entries found for this time period. Write some journal entries first!</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={generateStory}
            disabled={selectedEntries.length === 0 || isGenerating}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Creating Your Story... ✨
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-2" />
                🎨 Create My Amazing Story!
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {generatedStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border-2 border-indigo-300 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
              📚 Your Amazing Story!
            </h4>
            <Button
              onClick={() => navigator.clipboard.writeText(generatedStory)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-4 py-2 rounded-xl"
            >
              📋 Copy Story
            </Button>
          </div>
          <div 
            className="prose max-w-none p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-indigo-200"
            style={{ 
              fontFamily: storyFont, 
              color: storyColor,
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          >
            {generatedStory.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
