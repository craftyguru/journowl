import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Image } from "lucide-react";

export function MomentCapture() {
  return (
    <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Moment Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-white/60">Attach photos/videos to your journal entries</p>

        <div className="grid grid-cols-2 gap-2">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              data-testid="button-capture-photo"
            >
              <Camera className="w-3 h-3 mr-1" />
              Take Photo
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              data-testid="button-upload-image"
            >
              <Image className="w-3 h-3 mr-1" />
              Upload
            </Button>
          </motion.div>
        </div>

        <div className="p-3 bg-white/5 rounded text-xs text-white/50">
          📸 Add visual memories to your entries
        </div>
      </CardContent>
    </Card>
  );
}
