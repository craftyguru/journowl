import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, Underline, Type, Palette, Image as ImageIcon, 
  Brush, Save, Sparkles, Camera, Upload, Eye, EyeOff,
  Undo, Redo, Layers, Circle, Square, Minus, Video
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { HexColorPicker } from "react-colorful";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  { value: "🎉", label: "Celebratory", color: "from-yellow-300 to-pink-400" }
];

export default function SmartJournalEditor({ entry, onSave, onClose }: SmartJournalEditorProps) {
  const { toast } = useToast();
  const canvasRef = useRef<any>(null);
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

  const saveDrawing = () => {
    // Save canvas drawing functionality
    toast({
      title: "Drawing Saved",
      description: "Your drawing has been added to the entry."
    });
  };

  const handleSave = () => {
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

    onSave(entryData);
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
          <div className="w-full sm:w-80 bg-slate-800/50 border-b sm:border-r sm:border-b-0 border-purple-500/20 p-3 sm:p-6 overflow-y-auto max-h-64 sm:max-h-none">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📝 Smart Journal
                <Badge className="bg-orange-500/20 text-orange-300 text-xs hidden sm:block">
                  AI-powered
                </Badge>
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            {/* Essential Controls */}
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="📝 What's on your mind today?"
                  className="bg-slate-700/80 border-slate-600 text-white text-base sm:text-sm h-12 sm:h-10 rounded-lg"
                />
              </div>

              {/* Mobile-Friendly Mood Selector */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">How are you feeling?</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMood(option.value)}
                      className={`p-3 sm:p-2 rounded-lg border transition-all ${
                        mood === option.value 
                          ? 'border-purple-400 bg-purple-500/20 scale-110' 
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-600/50'
                      }`}
                    >
                      <div className="text-2xl sm:text-xl">{option.value}</div>
                      <div className="text-xs text-gray-400 mt-1 hidden sm:block">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  Private Entry
                </label>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              {/* Quick Tools */}
              <div className="space-y-3">
                <h4 className="font-medium text-white flex items-center gap-2">
                  🎨 Quick Tools
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 sm:h-10 border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2 text-sm"
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
                  onClick={handleSave}
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
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-4">
                  <TabsTrigger value="write" className="text-xs sm:text-sm">✍️ Write</TabsTrigger>
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
                      visibleDragBar={false}
                    />
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