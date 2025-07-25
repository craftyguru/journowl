import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, BookOpen, Camera, Mic, Calendar, Brain, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onNewEntry: () => void;
}

export default function QuickActions({ onNewEntry }: QuickActionsProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Ready to write today?
            </h2>
            <p className="text-muted-foreground">
              Capture your thoughts, memories, and moments
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={onNewEntry} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <Camera className="h-4 w-4 mr-2" />
                Photo Entry
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Brain className="h-4 w-4 mr-2" />
                AI Prompt
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}