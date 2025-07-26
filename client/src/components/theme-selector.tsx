import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "./theme-provider";
import { Palette, Briefcase, Sun, Moon, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeSelector() {
  const { colorScheme, visualStyle, toggleColorScheme, toggleVisualStyle, setTheme } = useTheme();

  const themePresets = [
    {
      name: "Creative Light",
      colorScheme: "light" as const,
      visualStyle: "creative" as const,
      description: "Colorful, animated, and playful design",
      icon: <Palette className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
      previewElements: (
        <div className="absolute inset-2 bg-white/10 backdrop-blur-sm rounded border border-white/20 flex items-center justify-center">
          <div className="text-xs font-bold text-white">🎨 Colorful</div>
        </div>
      )
    },
    {
      name: "Creative Dark", 
      colorScheme: "dark" as const,
      visualStyle: "creative" as const,
      description: "Dark mode with vibrant accents",
      icon: <Palette className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
      previewElements: (
        <div className="absolute inset-2 bg-white/5 backdrop-blur-sm rounded border border-white/10 flex items-center justify-center">
          <div className="text-xs font-bold text-white">🌙 Dark</div>
        </div>
      )
    },
    {
      name: "Professional Light",
      colorScheme: "light" as const,
      visualStyle: "professional" as const,
      description: "Clean, minimal, and accessible",
      icon: <Briefcase className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200",
      previewElements: (
        <div className="absolute inset-2 bg-blue-50/80 backdrop-blur-sm rounded border border-blue-200 flex items-center justify-center">
          <div className="text-xs font-semibold text-blue-800">💼 Clean</div>
        </div>
      )
    },
    {
      name: "Professional Dark",
      colorScheme: "dark" as const,
      visualStyle: "professional" as const,
      description: "Dark mode with subtle contrast",
      icon: <Briefcase className="w-4 h-4" />,
      preview: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-slate-700",
      previewElements: (
        <div className="absolute inset-2 bg-slate-800/50 backdrop-blur-sm rounded border border-slate-600 flex items-center justify-center">
          <div className="text-xs font-semibold text-slate-200">🌑 Pro</div>
        </div>
      )
    }
  ];

  const currentTheme = themePresets.find(
    theme => theme.colorScheme === colorScheme && theme.visualStyle === visualStyle
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Theme Preferences
          </DialogTitle>
          <DialogDescription>
            Choose between creative and professional styles, with light or dark color schemes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Theme Display */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">
              Current Theme
            </Badge>
            <div className="text-lg font-semibold flex items-center justify-center gap-2">
              {currentTheme?.icon}
              {currentTheme?.name}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {currentTheme?.description}
            </p>
          </div>

          {/* Theme Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themePresets.map((theme, index) => (
              <motion.div key={theme.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    theme.colorScheme === colorScheme && theme.visualStyle === visualStyle 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setTheme(theme.colorScheme, theme.visualStyle)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {theme.icon}
                        {theme.name}
                      </CardTitle>
                      {theme.colorScheme === colorScheme && theme.visualStyle === visualStyle && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`h-16 rounded-lg ${theme.preview} relative overflow-hidden`}>
                      {theme.previewElements}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Toggle Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Visual Style</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={visualStyle === "creative" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVisualStyle()}
                  className="flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Creative
                </Button>
                <Button
                  variant={visualStyle === "professional" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVisualStyle()}
                  className="flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Professional
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Color Scheme</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={colorScheme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColorScheme()}
                  className="flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={colorScheme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColorScheme()}
                  className="flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
              </div>
            </div>
          </div>

          {/* Theme Benefits */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">Theme Benefits:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <strong>Creative:</strong> Engaging animations, colorful gradients, playful fonts
              </div>
              <div>
                <strong>Professional:</strong> Higher contrast ratios, minimal animations, clean typography
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}