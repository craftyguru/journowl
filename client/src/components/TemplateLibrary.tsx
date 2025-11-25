import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";

interface Template {
  id: string;
  title: string;
  mood: string;
  icon: string;
  prompts: string[];
}

export function TemplateLibrary() {
  const { data: templates = [] } = useQuery<Template[]>({ queryKey: ["/api/templates"] });

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BookMarked className="w-4 h-4" />
          🎨 Template Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-white/60">Choose a template to guide your journaling</p>

        <div className="grid grid-cols-2 gap-2">
          {templates.slice(0, 4).map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-auto py-2"
                data-testid={`button-template-${template.id}`}
              >
                <span className="text-lg">{template.icon}</span>
                <span className="ml-1">{template.title}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700 text-sm" data-testid="button-view-all-templates">
          View All Templates
        </Button>
      </CardContent>
    </Card>
  );
}
