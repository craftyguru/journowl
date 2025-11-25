import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function LocationTags() {
  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-white/60">Tag where you're journaling</p>

        <div className="grid grid-cols-2 gap-2">
          {["☕ Cafe", "🏠 Home", "🌳 Park", "🏢 Office"].map((place, idx) => (
            <motion.div
              key={place}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                data-testid={`button-location-${place.split(" ")[1].toLowerCase()}`}
              >
                {place}
              </Button>
            </motion.div>
          ))}
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-sm"
          data-testid="button-use-gps"
        >
          📍 Use GPS
        </Button>
      </CardContent>
    </Card>
  );
}
