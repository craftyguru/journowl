import React from "react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onNewEntry: () => void;
  onNewGoal: () => void;
}

export default function QuickActions({ onNewEntry, onNewGoal }: QuickActionsProps) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
      <h3 className="text-lg font-bold text-white mb-4">🚀 Quick Actions</h3>
      <div className="flex gap-3">
        <Button onClick={onNewEntry} className="bg-purple-600 hover:bg-purple-700">
          ✍️ New Entry
        </Button>
        <Button onClick={onNewGoal} variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900">
          🎯 New Goal
        </Button>
      </div>
    </div>
  );
}