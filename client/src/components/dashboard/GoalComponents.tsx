import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle } from "lucide-react";

// New Goal Form Component
export function NewGoalForm({ onClose }: { onClose: () => void }) {
  const [goalType, setGoalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const trackableGoalTypes = [
    { value: "streak", label: "📅 Daily Writing Streak", description: "Track consecutive days of journaling", unit: "days" },
    { value: "words", label: "📝 Word Count Goal", description: "Reach a specific word count", unit: "words" },
    { value: "entries", label: "📚 Journal Entries", description: "Write a certain number of entries", unit: "entries" },
    { value: "mood", label: "😊 Mood Tracking", description: "Track mood for consecutive days", unit: "days" },
    { value: "photos", label: "📸 Photo Journaling", description: "Add photos to journal entries", unit: "photos" },
    { value: "reflection", label: "🧘 Deep Reflection", description: "Write thoughtful, reflective entries", unit: "entries" },
    { value: "creative", label: "🎨 Creative Writing", description: "Focus on creative expression", unit: "entries" },
    { value: "gratitude", label: "🙏 Gratitude Practice", description: "Write gratitude-focused entries", unit: "entries" },
    { value: "reading_time", label: "⏰ Reading Time", description: "Spend time reading past entries", unit: "minutes" },
    { value: "consistency", label: "⚡ Weekly Consistency", description: "Write at least X times per week", unit: "weeks" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the goal
    console.log("Creating goal:", { goalType, title, description, targetValue, difficulty });
    onClose();
  };

  const selectedGoalType = trackableGoalTypes.find(t => t.value === goalType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="goalType">Goal Type</Label>
          <Select value={goalType} onValueChange={setGoalType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a trackable goal type..." />
            </SelectTrigger>
            <SelectContent>
              {trackableGoalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span>{type.label}</span>
                    <span className="text-xs text-gray-500">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGoalType && (
            <p className="text-sm text-gray-600 mt-1">
              💡 This goal will track: {selectedGoalType.description}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={selectedGoalType ? `My ${selectedGoalType.label.split(' ').slice(1).join(' ')} Goal` : "Enter goal title..."}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to achieve and why it matters to you..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetValue">Target ({selectedGoalType?.unit || "value"})</Label>
            <Input
              id="targetValue"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={goalType === "streak" ? "7" : goalType === "words" ? "1000" : goalType === "entries" ? "10" : "Enter target..."}
              required
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Choose difficulty..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🟢 Beginner</SelectItem>
                <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                <SelectItem value="advanced">🔴 Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!goalType || !title || !targetValue || !difficulty} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </DialogFooter>
    </form>
  );
}

// Goal Details View Component
export function GoalDetailsView({ goal, onClose }: { goal: any; onClose: () => void }) {
  const progressPercentage = Math.round((goal.currentValue / goal.targetValue) * 100);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
            {goal.type === 'streak' ? '🔥' : goal.type === 'words' ? '📝' : goal.type === 'mood' ? '😊' : '🎯'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-800">{goal.title}</h3>
            <p className="text-blue-600">{goal.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{goal.currentValue}</div>
            <div className="text-sm text-blue-600">Current Progress</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{goal.targetValue}</div>
            <div className="text-sm text-blue-600">Target Goal</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">Progress</span>
            <span className="text-sm font-bold text-blue-800">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h4 className="font-bold text-green-800 mb-3">📊 Statistics & Insights</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-lg font-bold text-green-700">
              {goal.type === 'streak' ? `${goal.currentValue} days` : 
               goal.type === 'words' ? `${goal.currentValue} words` :
               goal.type === 'entries' ? `${goal.currentValue} entries` : `${goal.currentValue}`}
            </div>
            <div className="text-sm text-green-600">Current Achievement</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-lg font-bold text-green-700">
              {goal.targetValue - goal.currentValue > 0 ? 
                `${goal.targetValue - goal.currentValue} to go` : 
                'Goal Complete! 🎉'
              }
            </div>
            <div className="text-sm text-green-600">Remaining</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600">
          Close Details
        </Button>
      </div>
    </div>
  );
}

// Edit Goal Form Component
export function EditGoalForm({ goal, onClose }: { goal: any; onClose: () => void }) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [targetValue, setTargetValue] = useState(goal?.targetValue?.toString() || "");
  const [currentValue, setCurrentValue] = useState(goal?.currentValue?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the goal
    console.log("Updating goal:", { title, description, targetValue, currentValue });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="editTitle">Goal Title</Label>
          <Input
            id="editTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="editDescription">Description</Label>
          <Textarea
            id="editDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editCurrentValue">Current Progress</Label>
            <Input
              id="editCurrentValue"
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="editTargetValue">Target Value</Label>
            <Input
              id="editTargetValue"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-700">
            <strong>Progress Preview:</strong> {Math.round((parseInt(currentValue) / parseInt(targetValue)) * 100)}% complete
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          Update Goal
        </Button>
      </DialogFooter>
    </form>
  );
}