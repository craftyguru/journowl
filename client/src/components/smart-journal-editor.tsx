import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, Underline, Type, Palette, Image as ImageIcon, 
  Brush, Save, Sparkles, Camera, Upload, Eye, EyeOff,
  Undo, Redo, Layers, Circle, Square, Minus, Video, PenTool,
  Eraser, Download, RotateCcw
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { HexColorPicker } from "react-colorful";
// React Sketch Canvas removed due to version conflicts - using HTML5 Canvas instead
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SmartJournalEditorProps {
  entry?: {
    id?: number;
    title: string;
    content: string;
    mood: string;
    fontFamily?: string;
    fontSize?: number;
    textColor?: string;
    backgroundColor?: string;
    drawings?: any[];
    photos?: any[];
    tags?: string[];
    aiInsights?: any;
    isPrivate?: boolean;
  };
  onSave: (entry: any) => void;
  onClose: () => void;
}

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Comic Sans MS", label: "Comic Sans" },
  { value: "Courier New", label: "Courier" },
  { value: "Playfair Display", label: "Playfair" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" }
];

const moodOptions = [
  { value: "😊", label: "Happy", color: "from-green-400 to-emerald-500" },
  { value: "😄", label: "Excited", color: "from-pink-400 to-rose-500" },
  { value: "😐", label: "Neutral", color: "from-gray-400 to-slate-500" },
  { value: "🤔", label: "Thoughtful", color: "from-yellow-400 to-orange-500" },
  { value: "😔", label: "Sad", color: "from-blue-400 to-indigo-500" },
  { value: "😠", label: "Angry", color: "from-red-400 to-red-600" },
  { value: "😴", label: "Tired", color: "from-purple-400 to-violet-500" },
  { value: "🎉", label: "Celebratory", color: "from-yellow-300 to-pink-400" },
  { value: "😎", label: "Cool", color: "from-sky-400 to-cyan-600" },
  { value: "😍", label: "Loving", color: "from-red-300 to-rose-300" },
  { value: "🤯", label: "Amazed", color: "from-orange-300 to-yellow-400" },
  { value: "😰", label: "Anxious", color: "from-zinc-400 to-gray-500" }
];

export default function SmartJournalEditor({ entry, onSave, onClose }: SmartJournalEditorProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Editor state
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState(entry?.mood || "😊");
  const [isPrivate, setIsPrivate] = useState(entry?.isPrivate || false);

  // Styling state
  const [fontFamily, setFontFamily] = useState(entry?.fontFamily || "Inter");
  const [fontSize, setFontSize] = useState(entry?.fontSize || 16);
  const [textColor, setTextColor] = useState(entry?.textColor || "#ffffff");
  const [backgroundColor, setBackgroundColor] = useState(entry?.backgroundColor || "#1e293b");

  // Drawing state
  const [showDrawing, setShowDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#8B5CF6");
  const [brushSize, setBrushSize] = useState(5);
  const [drawings, setDrawings] = useState(entry?.drawings || []);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');
  const [canvasBackground, setCanvasBackground] = useState("#1e293b");

  // Photo state
  const [photos, setPhotos] = useState(entry?.photos || []);
  const [videos, setVideos] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI state
  const [aiInsights, setAiInsights] = useState(entry?.aiInsights || null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [tags, setTags] = useState(entry?.tags || []);

  const handlePhotoUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const newPhoto = {
          id: Date.now() + i,
          url: base64,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          aiAnalysis: null
        };

        setPhotos(prev => [...prev, newPhoto]);

        // Start AI analysis
        setIsAnalyzing(true);
        try {
          const response = await fetch('/api/ai/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Image: base64.split(',')[1],
              prompt: "Analyze this image and extract emotions, objects, people, activities, and mood. Provide a brief description."
            })
          });

          if (response.ok) {
            const analysis = await response.json();
            setPhotos(prev => prev.map(p => 
              p.id === newPhoto.id 
                ? { ...p, aiAnalysis: analysis }
                : p
            ));

            // Extract tags from AI analysis
            if (analysis.tags) {
              setTags(prev => [...new Set([...prev, ...analysis.tags])]);
            }
          }
        } catch (error) {
          console.error('Photo analysis failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleVideoUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('video/')) continue;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newVideo = {
          id: Date.now() + i,
          url: base64,
          filename: file.name,
          uploadedAt: new Date().toISOString()
        };

        setVideos(prev => [...prev, newVideo]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const generateAIPrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const response = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          existingContent: content,
          photos: photos.map(p => p.aiAnalysis?.description).filter(Boolean),
          context: "journal entry"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setContent(prev => prev + (prev ? '\n\n' : '') + data.prompt);
        toast({
          title: "AI Prompt Generated",
          description: "Writing inspiration has been added to your entry!"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const saveDrawing = useCallback(async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvasData = canvasRef.current.toDataURL("image/png");
      const newDrawing = {
        id: Date.now(),
        data: canvasData,
        timestamp: new Date().toISOString(),
        brushColor,
        brushSize
      };
      
      setDrawings(prev => [...prev, newDrawing]);
      toast({
        title: "Drawing Saved",
        description: "Your drawing has been added to the entry."
      });
    } catch (error) {
      console.error('Failed to save drawing:', error);
      toast({
        title: "Error",
        description: "Failed to save drawing. Please try again.",
        variant: "destructive"
      });
    }
  }, [brushColor, brushSize, toast]);

  const clearCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  const undoDrawing = useCallback(() => {
    // Undo functionality would require drawing history implementation
    toast({
      title: "Undo",
      description: "Undo feature coming soon for HTML5 canvas!"
    });
  }, [toast]);

  const redoDrawing = useCallback(() => {
    // Redo functionality would require drawing history implementation
    toast({
      title: "Redo", 
      description: "Redo feature coming soon for HTML5 canvas!"
    });
  }, [toast]);

  const downloadDrawing = useCallback(async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const canvasData = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `journal-drawing-${Date.now()}.png`;
      link.href = canvasData;
      link.click();
      
      toast({
        title: "Drawing Downloaded",
        description: "Your drawing has been saved to your device."
      });
    } catch (error) {
      console.error('Failed to download drawing:', error);
      toast({
        title: "Error",
        description: "Failed to download drawing. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSave = () => {
    console.log("SmartJournalEditor handleSave called");
    console.log("Current state - title:", title);
    console.log("Current state - content:", content);
    console.log("Current state - mood:", mood);
    
    const entryData = {
      id: entry?.id,
      title,
      content,
      mood,
      fontFamily,
      fontSize,
      textColor,
      backgroundColor,
      drawings,
      photos,
      videos,
      tags,
      aiInsights,
      isPrivate,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      createdAt: entry?.id ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("SmartJournalEditor - prepared entry data:", JSON.stringify(entryData, null, 2));
    console.log("SmartJournalEditor - calling onSave function:", typeof onSave);
    
    onSave(entryData);
    
    console.log("SmartJournalEditor - onSave called, showing toast");
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved successfully!"
    });
  };

  const editorStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    backgroundColor,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <div className="w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Mobile-First Sidebar */}
          <div className="w-full sm:w-80 bg-slate-800/50 border-b sm:border-r sm:border-b-0 border-purple-500/20 p-2 sm:p-6 overflow-y-auto max-h-48 sm:max-h-none">
            {/* Mobile Header - Compact */}
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-1 sm:gap-2">
                📝 Journal
                <Badge className="bg-orange-500/20 text-orange-300 text-xs hidden sm:block">
                  AI-powered
                </Badge>
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-400 hover:text-white h-8 w-8 sm:h-10 sm:w-10"
              >
                ✕
              </Button>
            </div>

            {/* Essential Controls - Compact */}
            <div className="space-y-2 sm:space-y-4">
              {/* Title Input */}
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="📝 Entry title..."
                  className="bg-slate-700/80 border-slate-600 text-white text-sm h-8 sm:h-10 rounded-lg"
                />
              </div>

              {/* Mood Dropdown Selector */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-1 block">Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="w-full bg-slate-700/80 border-slate-600 text-white h-8 sm:h-12 rounded-lg text-sm">
                    <SelectValue placeholder="Select mood..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {moodOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.value}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between bg-slate-700/30 p-2 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                  Private
                </label>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              {/* Quick Tools - Hidden on Mobile */}
              <div className="space-y-2 hidden sm:block">
                <h4 className="font-medium text-white flex items-center gap-2">
                  🎨 Quick Tools
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 sm:h-10 border-slate-600 text-white hover:bg-slate-700 flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Upload className="w-5 h-5" />
                    Add Photo
                  </Button>

                  <Button
                    onClick={generateAIPrompt}
                    disabled={isGeneratingPrompt}
                    className="h-12 sm:h-10 bg-purple-600 hover:bg-purple-700 flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isGeneratingPrompt ? "..." : "AI Help"}
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    console.log("💾 Save Entry button clicked!");
                    handleSave();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-10"
                >
                  💾 Save Entry
                </Button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                className="hidden"
              />
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="p-3 sm:p-4 border-b border-purple-500/20 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                  {title || "✍️ New Entry"}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-purple-500/20 text-purple-300 text-xs sm:text-sm">
                    {mood}
                  </Badge>
                  {isPrivate && (
                    <Badge variant="outline" className="border-red-500/20 text-red-300 text-xs">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Tabs */}
            <div className="flex-1 p-2 sm:p-4 overflow-hidden">
              <Tabs defaultValue="write" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800 mb-4">
                  <TabsTrigger value="write" className="text-xs sm:text-sm">✍️ Write</TabsTrigger>
                  <TabsTrigger value="draw" className="text-xs sm:text-sm">🎨 Draw</TabsTrigger>
                  <TabsTrigger value="photos" className="text-xs sm:text-sm">📸 Photos</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs sm:text-sm">👁️ Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="flex-1">
                  <div className="h-full rounded-lg overflow-hidden" style={editorStyles}>
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || "")}
                      height={window.innerHeight > 600 ? 400 : 300}
                      data-color-mode="dark"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="draw" className="flex-1">
                  <div className="h-full flex flex-col">
                    {/* Drawing Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-800/50 rounded-lg mb-3">
                      {/* Tool Selection */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={drawingTool === 'pen' ? 'default' : 'outline'}
                          onClick={() => setDrawingTool('pen')}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <PenTool className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={drawingTool === 'eraser' ? 'default' : 'outline'}
                          onClick={() => setDrawingTool('eraser')}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Eraser className="w-4 h-4" />
                        </Button>
                      </div>

                      <Separator orientation="vertical" className="h-8" />

                      {/* Color Picker */}
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <div 
                            className="w-8 h-8 rounded border-2 border-white cursor-pointer"
                            style={{ backgroundColor: brushColor }}
                            onClick={() => {
                              const colors = ['#8B5CF6', '#EF4444', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#10B981', '#F97316'];
                              const currentIndex = colors.indexOf(brushColor);
                              const nextIndex = (currentIndex + 1) % colors.length;
                              setBrushColor(colors[nextIndex]);
                            }}
                            title="Click to cycle colors"
                          />
                        </div>
                        
                        {/* Quick Color Palette */}
                        <div className="flex gap-1">
                          {['#8B5CF6', '#EF4444', '#22C55E', '#3B82F6', '#F59E0B', '#FFFFFF', '#000000'].map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => setBrushColor(color)}
                            />
                          ))}
                        </div>
                      </div>

                      <Separator orientation="vertical" className="h-8" />

                      {/* Brush Size */}
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <label className="text-xs text-gray-300">Size</label>
                        <Slider
                          value={[brushSize]}
                          onValueChange={(value) => setBrushSize(value[0])}
                          max={50}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-300 w-8">{brushSize}</span>
                      </div>

                      <Separator orientation="vertical" className="h-8" />

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={undoDrawing}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          title="Undo"
                        >
                          <Undo className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={redoDrawing}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          title="Redo"
                        >
                          <Redo className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={clearCanvas}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          title="Clear Canvas"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={downloadDrawing}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          title="Download Drawing"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveDrawing}
                          className="h-8 px-3 sm:h-10 sm:px-4 bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Drawing Canvas */}
                    <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={400}
                        className="w-full h-full bg-white rounded-lg cursor-crosshair"
                        style={{ touchAction: 'none' }}
                      />
                    </div>

                    {/* Saved Drawings */}
                    {drawings.length > 0 && (
                      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
                        <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                          <Layers className="w-4 h-4 mr-2" />
                          Saved Drawings ({drawings.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {drawings.map((drawing) => (
                            <div key={drawing.id} className="relative group">
                              <img 
                                src={drawing.data} 
                                alt="Drawing" 
                                className="w-full aspect-square object-cover rounded border border-slate-600 hover:border-purple-400 cursor-pointer transition-colors"
                                onClick={() => {
                                  // Future: implement drawing preview modal
                                  toast({
                                    title: "Drawing Preview",
                                    description: "Drawing preview feature coming soon!"
                                  });
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="flex-1">
                  <div className="h-full overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {photos.map((photo) => (
                        <Card key={photo.id} className="bg-slate-800 border-slate-700">
                          <CardContent className="p-4">
                            <img
                              src={photo.url}
                              alt={photo.filename}
                              className="w-full h-48 sm:h-40 object-cover rounded-lg mb-3"
                            />
                            <p className="text-sm text-gray-300 mb-2">{photo.filename}</p>
                            {photo.aiAnalysis && (
                              <div className="text-xs text-gray-400">
                                <p><strong>AI Analysis:</strong> {photo.aiAnalysis.description}</p>
                                {photo.aiAnalysis.emotions && (
                                  <p><strong>Emotions:</strong> {photo.aiAnalysis.emotions.join(", ")}</p>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {photos.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">No photos yet</p>
                          <p className="text-sm mb-4">Add photos to capture your memories</p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 border-slate-600 text-white hover:bg-slate-700 h-12 px-6"
                          >
                            📸 Upload Photos
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-1">
                  <div className="h-full bg-slate-800/50 rounded-lg p-4 overflow-y-auto">
                    <div className="prose prose-invert max-w-none" style={editorStyles}>
                      <h1 className="text-2xl font-bold mb-4">{title || "Untitled Entry"}</h1>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">{mood}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: content.replace(/\n/g, '<br>') || "<p style='color: #9ca3af;'>Start writing to see preview...</p>"
                        }} 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Mobile Save Button - Always Visible */}
          <div className="p-4 border-t border-purple-500/20 bg-slate-800/50">
            <Button
              onClick={() => {
                console.log("📱 Mobile Save Entry button clicked!");
                handleSave();
              }}
              className="w-full bg-green-600 hover:bg-green-700 h-12 font-semibold"
            >
              💾 Save Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <Card className="bg-slate-800 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-white">AI is analyzing your photo...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}