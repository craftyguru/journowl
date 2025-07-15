import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Camera, Palette, Type, Smile, Calendar, Sparkles, 
  MessageCircle, Star, Heart, BookOpen, Settings, Upload,
  Bold, Italic, Underline, List, Quote, Brush, Eraser,
  Undo, Redo, Download, Share, Plus, X
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const moodEmojis = ["😊", "😐", "😔", "🤔", "😄", "🎉", "😠", "😴", "💪", "🥰"];
const fontFamilies = [
  "Inter", "Georgia", "Times New Roman", "Arial", "Helvetica", 
  "Comic Sans MS", "Courier New", "Palatino", "Garamond", "Crimson Text"
];

interface UnifiedJournalProps {
  entry?: any;
  onSave: (entry: any) => void;
  onClose: () => void;
}

export default function UnifiedJournal({ entry, onSave, onClose }: UnifiedJournalProps) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState(entry?.mood || "😊");
  const [selectedFont, setSelectedFont] = useState(entry?.fontFamily || "Inter");
  const [fontSize, setFontSize] = useState(entry?.fontSize || 16);
  const [textColor, setTextColor] = useState(entry?.textColor || "#1f2937");
  const [backgroundColor, setBackgroundColor] = useState(entry?.backgroundColor || "#ffffff");
  const [isPrivate, setIsPrivate] = useState(entry?.isPrivate || false);
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [photos, setPhotos] = useState<any[]>(entry?.photos || []);
  const [drawings, setDrawings] = useState<any[]>(entry?.drawings || []);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{type: 'ai' | 'user', message: string}>>([
    { type: 'ai', message: 'Hey! Ready to capture today\'s adventure? ✨' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#000000");

  const handlePhotoUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const newPhoto = {
          id: Date.now() + i,
          src: base64,
          analysis: null
        };

        setPhotos(prev => [...prev, newPhoto]);

        // Trigger AI analysis
        try {
          const response = await fetch('/api/ai/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              base64Image: base64.split(',')[1],
              currentMood: mood 
            })
          });

          if (response.ok) {
            const analysis = await response.json();
            setPhotos(prev => prev.map(p => 
              p.id === newPhoto.id ? { ...p, analysis } : p
            ));
            
            // Add AI-generated tags
            if (analysis.tags) {
              setTags(prev => [...new Set([...prev, ...analysis.tags])]);
            }

            // Add AI message about the photo
            setAiMessages(prev => [...prev, {
              type: 'ai',
              message: `Amazing photo! I can see ${analysis.description}. ${analysis.journalPrompts?.[0] || 'What story does this moment tell?'}`
            }]);
          }
        } catch (error) {
          console.error('Photo analysis failed:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [mood]);

  const handleSave = () => {
    const entryData = {
      id: entry?.id,
      title: title || "Untitled Entry",
      content,
      mood,
      fontFamily: selectedFont,
      fontSize,
      textColor,
      backgroundColor,
      isPrivate,
      tags,
      photos,
      drawings,
      wordCount: content.split(' ').filter(word => word.length > 0).length,
      createdAt: entry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(entryData);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.strokeStyle = brushColor;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-7xl h-[90vh] bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paper' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0,0 L100,100 M100,0 L0,100' stroke='%23f59e0b' stroke-width='0.2' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Journal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Smart Journal</h1>
              <p className="text-amber-100">Your AI-powered writing companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Journal Layout - Open Book Spread */}
        <div className="flex h-full">
          {/* Left Page - Writing Area */}
          <div className="flex-1 p-8 border-r-4 border-amber-200 relative">
            {/* Page shadow effect */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-amber-300/20 to-transparent pointer-events-none" />
            
            {/* Entry Header */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="text-2xl font-bold border-none bg-transparent focus:ring-2 focus:ring-amber-300 rounded-lg"
                  style={{ fontFamily: selectedFont }}
                />
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Mood & Controls */}
              <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">Mood:</span>
                  <div className="flex gap-1">
                    {moodEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setMood(emoji)}
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          mood === emoji ? 'bg-amber-200 scale-110' : 'hover:bg-white/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font & Color Controls */}
                <div className="flex items-center gap-2 ml-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Type className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map(font => (
                              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div>
                          <label className="text-sm font-medium">Font Size: {fontSize}px</label>
                          <Slider
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                            min={12}
                            max={24}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Palette className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Text Color</label>
                          <HexColorPicker color={textColor} onChange={setTextColor} />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2">
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                    <span className="text-sm">Private</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(prev => prev.filter((_, i) => i !== index))}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div className="h-96">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                preview="edit"
                hideToolbar={false}
                visibleDragBar={false}
                data-color-mode="light"
                height={384}
                style={{
                  fontFamily: selectedFont,
                  fontSize: `${fontSize}px`,
                  color: textColor,
                }}
              />
            </div>

            {/* Word Count */}
            <div className="mt-4 text-sm text-gray-500">
              {content.split(' ').filter(word => word.length > 0).length} words
            </div>
          </div>

          {/* Right Page - Creative Area */}
          <div className="flex-1 p-8 relative">
            <div className="h-full flex flex-col space-y-6">
              {/* Drawing Canvas */}
              <Card className="flex-1 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      Drawing Canvas
                    </h3>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Palette className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="space-y-4">
                            <HexColorPicker color={brushColor} onChange={setBrushColor} />
                            <div>
                              <label className="text-sm font-medium">Brush Size: {brushSize}px</label>
                              <Slider
                                value={[brushSize]}
                                onValueChange={(value) => setBrushSize(value[0])}
                                min={1}
                                max={20}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button variant="outline" size="sm" onClick={() => {
                        const ctx = canvasRef.current?.getContext('2d');
                        if (ctx && canvasRef.current) {
                          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                      }}>
                        <Eraser className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border-2 border-dashed border-gray-300 rounded-lg w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </CardContent>
              </Card>

              {/* Photo Upload Area */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Photos & Media
                    </h3>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                    className="hidden"
                  />

                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.src}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          {photo.analysis && (
                            <div className="absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-2">
                              <p className="text-white text-xs">{photo.analysis.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Drop photos here or click to upload</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* AI Sidekick */}
        <AnimatePresence>
          {showAiChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-4 top-20 bottom-20 w-80 bg-white rounded-xl shadow-2xl border p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">AI Sidekick</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAiChat(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {aiMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'ai' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <Input
                placeholder="Chat with your AI sidekick..."
                className="w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const userMessage = e.currentTarget.value.trim();
                    setAiMessages(prev => [...prev, 
                      { type: 'user', message: userMessage },
                      { type: 'ai', message: "That's interesting! Tell me more about how that made you feel." }
                    ]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Sidekick Toggle */}
        <Button
          onClick={() => setShowAiChat(!showAiChat)}
          className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-14 h-14 shadow-2xl"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {/* Mini Calendar Widget */}
        <Card className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium">Quick Calendar</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="w-6 h-6 flex items-center justify-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                </div>
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <button
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs hover:bg-amber-100 ${
                    i === 13 ? 'bg-amber-200 font-bold' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}