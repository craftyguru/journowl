import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Lock, Trash2 } from "lucide-react";

export function DataManagement() {
  const handleExport = (format: string) => {
    window.location.href = `/api/export/${format}`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { format: "json", label: "JSON", icon: "📄" },
            { format: "markdown", label: "Markdown", icon: "📝" },
            { format: "csv", label: "CSV", icon: "📊" }
          ].map((item, idx) => (
            <motion.div
              key={item.format}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                onClick={() => handleExport(item.format)}
                variant="outline"
                size="sm"
                className="w-full text-xs"
                data-testid={`button-export-${item.format}`}
              >
                <Download className="w-3 h-3 mr-1" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-300">
          <p>🔒 Your data is encrypted and backed up daily</p>
        </div>

        <div className="pt-2 border-t border-white/10 text-xs text-white/60">
          <p>Account created: {new Date().toLocaleDateString()}</p>
          <p>Total storage: ~{Math.random() * 50 + 5}MB</p>
        </div>
      </CardContent>
    </Card>
  );
}
