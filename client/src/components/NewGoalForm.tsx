import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

interface NewGoalFormProps {
  onClose: () => void;
}

export default function NewGoalForm({ onClose }: NewGoalFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    targetValue: "",
    difficulty: "beginner"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          targetValue: parseInt(formData.targetValue),
          currentValue: 0,
          isCompleted: false
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
        onClose();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Write 500 words daily"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your goal..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Goal Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select goal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="streak">Streak</SelectItem>
            <SelectItem value="mood">Mood</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="reflection">Reflection</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetValue">Target Value</Label>
        <Input
          id="targetValue"
          type="number"
          value={formData.targetValue}
          onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
          placeholder="e.g., 30 for 30 days"
          required
        />
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
          Create Goal
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}