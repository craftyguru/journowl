import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, Underline, Type, Palette, Image as ImageIcon, 
  Brush, Save, Sparkles, Camera, Upload, Eye, EyeOff,
  Undo, Redo, Layers, Circle, Square, Minus
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { HexColorPicker } from "react-colorful";
// import CanvasDraw from "react-canvas-draw"; // Temporarily commented for compatibility
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
            body: JSON.stringify({ image: base64.split(',')[1] })
          });
          
          if (response.ok) {
            const analysis = await response.json();
            setPhotos(prev => prev.map(p => 
              p.id === newPhoto.id 
                ? { ...p, aiAnalysis: analysis }
                : p
            ));
            
            // Extract tags from analysis
            if (analysis.tags) {
              setTags(prev => [...new Set([...prev, ...analysis.tags])]);
            }
            
            toast({
              title: "Photo analyzed!",
              description: "AI has extracted insights from your photo.",
            });
          }
        } catch (error) {
          console.error('Error analyzing photo:', error);
          toast({
            title: "Analysis failed",
            description: "Could not analyze the photo. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const generateAIPrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const response = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mood, 
          previousContent: content,
          photos: photos.map(p => p.aiAnalysis).filter(Boolean),
          tags 
        })
      });
      
      if (response.ok) {
        const { prompt } = await response.json();
        setContent(prev => prev + (prev ? '\n\n' : '') + prompt);
        toast({
          title: "AI Prompt Generated!",
          description: "I've added some writing inspiration to your entry.",
        });
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Prompt generation failed",
        description: "Could not generate a writing prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const drawingData = canvasRef.current.getSaveData();
      setDrawings(prev => [...prev, {
        id: Date.now(),
        data: drawingData,
        createdAt: new Date().toISOString()
      }]);
      canvasRef.current.clear();
      toast({
        title: "Drawing saved!",
        description: "Your drawing has been added to the entry.",
      });
    }
  };

  const handleSave = () => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    const entryData = {
      id: entry?.id,
      title,
      content,
      mood,
      wordCount,
      fontFamily,
      fontSize,
      textColor,
      backgroundColor,
      drawings,
      photos,
      tags,
      aiInsights,
      isPrivate
    };
    
    onSave(entryData);
    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved successfully.",
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div className="w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar with tools */}
          <div className="w-80 bg-slate-800/50 border-r border-purple-500/20 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Smart Editor</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entry title..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Mood</label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{option.value}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Private Entry</label>
                  <Switch 
                    checked={isPrivate} 
                    onCheckedChange={setIsPrivate}
                  />
                </div>
              </div>

              <Separator className="bg-slate-600" />

              {/* Text Styling */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Text Styling</h4>
                
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Font</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Size: {fontSize}px</label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Text Color</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 p-0 border-slate-600"
                          style={{ backgroundColor: textColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <HexColorPicker color={textColor} onChange={setTextColor} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Background</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 p-0 border-slate-600"
                          style={{ backgroundColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-600" />

              {/* Media Tools */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Media & Drawing</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDrawing(!showDrawing)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Brush className="w-4 h-4 mr-2" />
                    Draw
                  </Button>
                </div>

                {showDrawing && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Brush Color</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-8 p-0 border-slate-600"
                            style={{ backgroundColor: brushColor }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker color={brushColor} onChange={setBrushColor} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Brush Size: {brushSize}px</label>
                      <Slider
                        value={[brushSize]}
                        onValueChange={(value) => setBrushSize(value[0])}
                        min={1}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              <Separator className="bg-slate-600" />

              {/* AI Tools */}
              <div className="space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Assistant
                </h4>
                
                <Button
                  onClick={generateAIPrompt}
                  disabled={isGeneratingPrompt}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGeneratingPrompt ? "Generating..." : "Generate Writing Prompt"}
                </Button>

                {tags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Extracted Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-600/20 text-purple-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>

          {/* Main editor area */}
          <div className="flex-1 flex flex-col">
            {/* Editor header */}
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {title || "Untitled Entry"}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-purple-500/20 text-purple-300">
                    {mood}
                  </Badge>
                  {isPrivate && (
                    <Badge variant="outline" className="border-red-500/20 text-red-300">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Editor content */}
            <div className="flex-1 p-4 overflow-hidden">
              <Tabs defaultValue="write" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="draw">Draw</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="flex-1 mt-4">
                  <div className="h-full rounded-lg overflow-hidden" style={editorStyles}>
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || "")}
                      height={500}
                      data-color-mode="dark"
                      visibleDragBar={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="draw" className="flex-1 mt-4">
                  <div className="h-full bg-white rounded-lg overflow-hidden">
                    <div className="p-2 bg-slate-800 flex items-center gap-2">
                      <Button size="sm" onClick={() => {}}>
                        <Square className="w-4 h-4" />
                        Clear
                      </Button>
                      <Button size="sm" onClick={() => {}}>
                        <Undo className="w-4 h-4" />
                        Undo
                      </Button>
                      <Button size="sm" onClick={saveDrawing}>
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                    <div className="flex items-center justify-center h-96 bg-gray-50 text-gray-500">
                      <div className="text-center">
                        <Brush className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Drawing tools coming soon!</p>
                        <p className="text-sm">Professional drawing canvas will be added in the next update.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="flex-1 mt-4">
                  <div className="h-full overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      {photos.map((photo) => (
                        <Card key={photo.id} className="bg-slate-800 border-slate-700">
                          <CardContent className="p-4">
                            <img
                              src={photo.url}
                              alt={photo.filename}
                              className="w-full h-40 object-cover rounded-lg mb-3"
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
                        <div className="col-span-2 text-center py-12 text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No photos uploaded yet</p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 border-slate-600 text-white hover:bg-slate-700"
                          >
                            Upload Photos
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 mt-4">
                  <div 
                    className="h-full p-6 rounded-lg overflow-y-auto prose prose-invert max-w-none"
                    style={editorStyles}
                  >
                    <h1>{title}</h1>
                    <MDEditor.Markdown source={content} />
                    
                    {drawings.length > 0 && (
                      <div className="mt-6">
                        <h3>Drawings</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {drawings.map((drawing, index) => (
                            <div key={drawing.id} className="bg-white rounded-lg p-2">
                              <p className="text-sm text-gray-600 mb-2">Drawing {index + 1}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {photos.length > 0 && (
                      <div className="mt-6">
                        <h3>Photos</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {photos.map((photo) => (
                            <div key={photo.id}>
                              <img
                                src={photo.url}
                                alt={photo.filename}
                                className="w-full rounded-lg"
                              />
                              {photo.aiAnalysis && (
                                <p className="text-sm mt-2 text-gray-400">
                                  {photo.aiAnalysis.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
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