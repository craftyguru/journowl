import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Camera, Palette, Type, Smile, Calendar, Sparkles, 
  MessageCircle, Star, Heart, BookOpen, Settings, Upload,
  Bold, Italic, Underline, List, Quote, Brush, Eraser,
  Undo, Redo, Download, Share, Plus, X, Mic, MicOff, Send,
  Wand2, Eye, Brain, Lightbulb
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [photoCanvasRef, setPhotoCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawingOnPhoto, setIsDrawingOnPhoto] = useState(false);
  const [photoDrawingMode, setPhotoDrawingMode] = useState(false);
  const [photoSize, setPhotoSize] = useState({ width: 300, height: 200 });
  const [titleFont, setTitleFont] = useState(entry?.titleFont || "Inter");
  const [titleColor, setTitleColor] = useState(entry?.titleColor || "#1f2937");
  const [editingTarget, setEditingTarget] = useState<'title' | 'content'>('title');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiChat, setShowAiChat] = useState(true);
  const [isAiListening, setIsAiListening] = useState(false);
  const [aiRecognition, setAiRecognition] = useState<any>(null);
  const [aiMessages, setAiMessages] = useState<Array<{type: 'ai' | 'user', message: string}>>([
    { type: 'ai', message: 'Hey! Ready to capture today\'s adventure? I can help you write, analyze photos, and suggest ideas!' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#000000");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setContent(prev => prev + ' ' + finalTranscript);
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: `Great! I heard: "${finalTranscript}". Keep talking or let me suggest what to write next!`
          }]);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);

      // Initialize separate speech recognition for AI chat
      const aiRecognitionInstance = new SpeechRecognition();
      aiRecognitionInstance.continuous = true;
      aiRecognitionInstance.interimResults = true;
      aiRecognitionInstance.lang = 'en-US';

      aiRecognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Show interim results in the input field
        setAiInput(lastFinalTranscript + finalTranscript + interimTranscript);
        
        // When we get final transcript, send it to AI for interactive response
        if (finalTranscript && finalTranscript !== lastFinalTranscript) {
          const newContent = lastFinalTranscript + finalTranscript;
          setLastFinalTranscript(newContent);
          
          // Send the complete message to AI for real-time interaction
          setTimeout(() => {
            sendToAi(newContent);
            setAiInput(''); // Clear input after sending
            setLastFinalTranscript(''); // Reset for next interaction
          }, 500);
        }
      };

      aiRecognitionInstance.onerror = (event) => {
        console.error('AI speech recognition error:', event.error);
        setIsAiListening(false);
      };

      aiRecognitionInstance.onend = () => {
        setIsAiListening(false);
      };

      setAiRecognition(aiRecognitionInstance);
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  // Generate AI suggestions based on content
  const generateAiSuggestions = useCallback(async () => {
    if (content.length > 10) {
      try {
        const response = await fetch('/api/ai/generate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            recentEntries: [content],
            mood,
            photos: photos.map(p => p.analysis?.description).filter(Boolean)
          })
        });

        if (response.ok) {
          const { prompt } = await response.json();
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: `💡 Writing suggestion: ${prompt}`
          }]);
        }
      } catch (error) {
        console.error('Failed to generate AI suggestion:', error);
      }
    }
  }, [content, mood, photos]);

  // Start/stop voice recording for journal
  const toggleVoiceRecording = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎤 Listening... Start speaking and I\'ll transcribe your thoughts!'
        }]);
      }
    } else {
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: 'Sorry, voice recognition is not supported in your browser. Try using Chrome or Edge!'
      }]);
    }
  };

  // Start/stop voice recording for AI chat
  const toggleAiVoiceInput = () => {
    if (aiRecognition) {
      if (isAiListening) {
        aiRecognition.stop();
        setIsAiListening(false);
        setAiInput('');
        setLastFinalTranscript('');
      } else {
        setAiInput('');
        setLastFinalTranscript('');
        aiRecognition.start();
        setIsAiListening(true);
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎤 I\'m listening... Start speaking and I\'ll respond to what you say!'
        }]);
      }
    } else {
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: 'Voice input is not supported in your browser. Please try Chrome or Edge!'
      }]);
    }
  };

  // Send message to AI
  const sendToAi = async (message: string) => {
    if (!message.trim()) return;

    setAiMessages(prev => [...prev, { type: 'user', message }]);
    setAiInput('');
    setAiAnalyzing(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          context: {
            currentContent: content,
            mood,
            title,
            photos: photos.map(p => ({
              description: p.analysis?.description,
              tags: p.analysis?.tags
            })).filter(p => p.description),
            previousMessages: aiMessages.slice(-5) // Last 5 messages for context
          }
        })
      });

      if (response.ok) {
        const { reply } = await response.json();
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: reply
        }]);
      } else {
        throw new Error('AI service unavailable');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: 'I had trouble processing that. Can you try again? Make sure you\'re logged in and have an active internet connection.'
      }]);
    } finally {
      setAiAnalyzing(false);
    }
  };

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
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '📸 Analyzing your photo... This will help me suggest better writing prompts!'
        }]);

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

            // Add detailed AI analysis message
            setAiMessages(prev => [...prev, {
              type: 'ai',
              message: `🔍 I analyzed your photo and found:\n\n📝 ${analysis.description}\n🏷️ Key elements: ${analysis.tags?.slice(0, 3).join(', ')}\n💭 Writing prompt: ${analysis.journalPrompts?.[0] || 'What story does this moment tell?'}\n\nWant me to help you write about this?`
            }]);
          }
        } catch (error) {
          console.error('Photo analysis failed:', error);
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: '😅 I had trouble analyzing that photo. But I can still help you write about it! What do you see in the image?'
          }]);
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

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const { x, y } = getCanvasCoordinates(e);
    
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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-[95vw] h-[95vh] bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paper' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0,0 L100,100 M100,0 L0,100' stroke='%23f59e0b' stroke-width='0.2' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Journal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Smart Journal</h1>
              <p className="text-amber-100 text-sm">Your AI-powered writing companion</p>
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

        {/* Main Journal Layout - Full Width */}
        <div className="flex flex-1 min-h-0">
          <PanelGroup direction="horizontal" className="w-full">
            {/* Left Page - Writing Area (Expanded) */}
            <Panel defaultSize={65} minSize={0}>
              <div className="p-4 relative flex flex-col overflow-hidden h-full">
                {/* Page shadow effect */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-amber-300/20 to-transparent pointer-events-none" />
                
                {/* Entry Header */}
                <div className="space-y-3 mb-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Entry title..."
                      className="text-lg font-bold border-none bg-transparent focus:ring-2 focus:ring-amber-300 rounded-lg"
                      style={{ 
                        fontFamily: titleFont,
                        color: titleColor
                      }}
                    />
                    <div className="text-lg font-bold whitespace-nowrap" style={{
                      color: '#ff0040',
                      textShadow: '0 0 5px #ff0040, 0 0 10px #ff0040, 0 0 15px #ff0040',
                      fontFamily: 'Arial, sans-serif'
                    }}>
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
              
              {/* Unified Font & Color Controls */}
              <div className="space-y-2">
                {/* Target Selector */}
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setEditingTarget('title')}
                      variant={editingTarget === 'title' ? 'default' : 'outline'}
                      size="sm"
                      className={`h-8 px-3 text-xs ${
                        editingTarget === 'title' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'border-purple-300 text-purple-800 hover:bg-purple-50'
                      }`}
                    >
                      Title
                    </Button>
                    <Button
                      onClick={() => setEditingTarget('content')}
                      variant={editingTarget === 'content' ? 'default' : 'outline'}
                      size="sm"
                      className={`h-8 px-3 text-xs ${
                        editingTarget === 'content' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'border-purple-300 text-purple-800 hover:bg-purple-50'
                      }`}
                    >
                      Content
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-10 px-4 rounded-lg font-medium">
                          <Type className="w-4 h-4 mr-2" />
                          Font
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700">
                            {editingTarget === 'title' ? 'Title' : 'Content'} Font
                          </label>
                          <Select 
                            value={editingTarget === 'title' ? titleFont : selectedFont} 
                            onValueChange={editingTarget === 'title' ? setTitleFont : setSelectedFont}
                          >
                            <SelectTrigger className="h-10">
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
                          
                          {editingTarget === 'content' && (
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Size: {fontSize}px</label>
                              <Slider
                                value={[fontSize]}
                                onValueChange={(value) => setFontSize(value[0])}
                                min={12}
                                max={24}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="bg-gray-800 hover:bg-gray-900 text-white h-10 px-4 rounded-lg font-medium">
                          <Palette className="w-4 h-4 mr-2" />
                          Color
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700">
                            {editingTarget === 'title' ? 'Title' : 'Content'} Color
                          </label>
                          <HexColorPicker 
                            color={editingTarget === 'title' ? titleColor : textColor} 
                            onChange={editingTarget === 'title' ? setTitleColor : setTextColor} 
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" 
                              style={{ backgroundColor: editingTarget === 'title' ? titleColor : textColor }}
                            />
                            <span className="text-xs text-gray-600 font-mono">
                              {editingTarget === 'title' ? titleColor : textColor}
                            </span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Mood & Controls */}
              <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg backdrop-blur-sm text-sm">
                <div className="flex items-center gap-1">
                  <Smile className="w-3 h-3 text-amber-600" />
                  <span className="text-xs font-medium">Mood:</span>
                  <div className="flex gap-1">
                    {moodEmojis.slice(0, 6).map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setMood(emoji)}
                        className={`p-1 rounded text-sm transition-all hover:scale-110 ${
                          mood === emoji ? 'bg-amber-200 scale-110' : 'hover:bg-white/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI & Privacy Controls */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    onClick={generateAiSuggestions}
                    variant="outline"
                    size="sm"
                    disabled={content.length < 10}
                    className="h-10 px-3 bg-gray-100 hover:bg-gray-200 border-gray-300"
                    title="Generate AI writing suggestions based on your content"
                  >
                    <Lightbulb className="w-4 h-4 text-gray-600" />
                  </Button>

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                    <span className="text-sm font-medium text-gray-700">Private</span>
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
                <div className="flex-1 min-h-0">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    preview="edit"
                    hideToolbar={false}
                    data-color-mode="light"
                    height="100%"
                    style={{
                      fontFamily: selectedFont,
                      fontSize: `${fontSize}px`,
                      color: textColor,
                      height: '100%'
                    }}
                  />
                </div>

                {/* Word Count */}
                <div className="mt-2 text-xs text-gray-500 flex-shrink-0">
                  {content.split(' ').filter(word => word.length > 0).length} words
                </div>
              </div>
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle className="w-2 bg-amber-300 hover:bg-amber-400 transition-colors cursor-col-resize flex items-center justify-center">
              <div className="h-8 w-1 bg-amber-600 rounded-full"></div>
            </PanelResizeHandle>

            {/* Right Page - Creative Area with Resizable Panels */}
            <Panel defaultSize={35} minSize={0}>
              <div className="p-4 relative overflow-hidden h-full">
                <PanelGroup direction="vertical" className="h-full">
              {/* Drawing Canvas Panel */}
              <Panel defaultSize={60} minSize={30}>
                <Card className="h-full bg-white/80 backdrop-blur-sm">
                <CardContent className="p-3 h-full flex flex-col">
                  <div className="mb-2 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold flex items-center gap-1">
                        <Brush className="w-3 h-3" />
                        Drawing Canvas
                      </h3>
                    </div>
                    
                    {/* Mobile-Friendly Controls */}
                    <div className="space-y-2">
                      {/* Top Row - Main Tools */}
                      <div className="grid grid-cols-3 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-12 px-2 w-full">
                              <div className="flex flex-col items-center gap-1">
                                <Palette className="w-4 h-4" />
                                <span className="text-xs">Color</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <div className="space-y-2">
                              <HexColorPicker color={brushColor} onChange={setBrushColor} />
                              <div>
                                <label className="text-xs font-medium">Size: {brushSize}px</label>
                                <Slider
                                  value={[brushSize]}
                                  onValueChange={(value) => setBrushSize(value[0])}
                                  min={1}
                                  max={15}
                                  step={1}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-12 px-2 w-full"
                          onClick={() => {
                            // Undo functionality - you'll need to implement canvas history
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Undo className="w-4 h-4" />
                            <span className="text-xs">Undo</span>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-12 px-2 w-full"
                          onClick={() => {
                            // Redo functionality - you'll need to implement canvas history
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Redo className="w-4 h-4" />
                            <span className="text-xs">Redo</span>
                          </div>
                        </Button>
                      </div>
                      
                      {/* Bottom Row - Secondary Tools */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-12 px-2 w-full"
                          onClick={() => {
                            const ctx = canvasRef.current?.getContext('2d');
                            if (ctx && canvasRef.current) {
                              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            }
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Eraser className="w-4 h-4" />
                            <span className="text-xs">Clear</span>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-12 px-2 w-full"
                          onClick={() => {
                            const canvas = canvasRef.current;
                            if (canvas) {
                              const link = document.createElement('a');
                              link.download = 'drawing.png';
                              link.href = canvas.toDataURL();
                              link.click();
                            }
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span className="text-xs">Save</span>
                          </div>
                        </Button>
                        
                        <div className="flex flex-col items-center justify-center gap-1 p-2 bg-gray-50 rounded-lg">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm" 
                            style={{ backgroundColor: brushColor }}
                          />
                          <span className="text-xs text-gray-600">{brushSize}px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="border-2 border-dashed border-gray-300 rounded-lg w-full flex-1 cursor-crosshair bg-white min-h-[100px] max-h-[200px]"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ touchAction: 'none' }}
                  />
                </CardContent>
                </Card>
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="h-2 bg-amber-300 hover:bg-amber-400 transition-colors cursor-row-resize flex items-center justify-center">
                <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
              </PanelResizeHandle>

              {/* Photo Upload & Edit Panel */}
              <Panel defaultSize={40} minSize={20}>
                <Card className="h-full bg-white/80 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Photos & Media
                    </h3>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                      {selectedPhoto && (
                        <Button
                          onClick={() => setPhotoDrawingMode(!photoDrawingMode)}
                          variant={photoDrawingMode ? "default" : "outline"}
                          size="sm"
                        >
                          <Brush className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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
                    <div className="space-y-2">
                      {/* Photo Grid */}
                      <div className="grid grid-cols-2 gap-1">
                        {photos.slice(0, 4).map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo.src}
                              alt={`Upload ${index + 1}`}
                              className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                                selectedPhoto?.index === index ? 'ring-2 ring-amber-400' : ''
                              }`}
                              onClick={() => setSelectedPhoto({ ...photo, index })}
                            />
                            {photo.analysis && (
                              <div className="absolute inset-0 bg-black/70 rounded opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                <p className="text-white text-xs">{photo.analysis.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Selected Photo Editor */}
                      {selectedPhoto && (
                        <div className="border-2 border-amber-300 rounded-lg p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Edit Photo</span>
                            <Button
                              onClick={() => setSelectedPhoto(null)}
                              variant="ghost"
                              size="sm"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          {/* Photo Size Controls */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium">Photo Size</label>
                              <span className="text-xs text-gray-600">{photoSize.width}x{photoSize.height}px</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-12">Width:</span>
                                <Slider
                                  value={[photoSize.width]}
                                  onValueChange={(value) => setPhotoSize(prev => ({ ...prev, width: value[0] }))}
                                  min={100}
                                  max={400}
                                  step={10}
                                  className="flex-1"
                                />
                                <span className="text-xs w-8">{photoSize.width}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-12">Height:</span>
                                <Slider
                                  value={[photoSize.height]}
                                  onValueChange={(value) => setPhotoSize(prev => ({ ...prev, height: value[0] }))}
                                  min={100}
                                  max={300}
                                  step={10}
                                  className="flex-1"
                                />
                                <span className="text-xs w-8">{photoSize.height}</span>
                              </div>
                            </div>
                          </div>

                          {/* Resizable Photo with Drawing Overlay */}
                          <div className="relative">
                            <img
                              src={selectedPhoto.src}
                              alt="Selected photo"
                              className="rounded border"
                              style={{
                                width: photoSize.width,
                                height: photoSize.height,
                                objectFit: 'cover'
                              }}
                            />
                            {photoDrawingMode && (
                              <canvas
                                ref={setPhotoCanvasRef}
                                width={photoSize.width}
                                height={photoSize.height}
                                className="absolute inset-0 cursor-crosshair"
                                onMouseDown={(e) => {
                                  setIsDrawingOnPhoto(true);
                                  if (photoCanvasRef) {
                                    const rect = photoCanvasRef.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    const ctx = photoCanvasRef.getContext('2d');
                                    if (ctx) {
                                      ctx.beginPath();
                                      ctx.moveTo(x, y);
                                    }
                                  }
                                }}
                                onMouseMove={(e) => {
                                  if (!isDrawingOnPhoto || !photoCanvasRef) return;
                                  const rect = photoCanvasRef.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const y = e.clientY - rect.top;
                                  const ctx = photoCanvasRef.getContext('2d');
                                  if (ctx) {
                                    ctx.lineWidth = brushSize;
                                    ctx.lineCap = 'round';
                                    ctx.strokeStyle = brushColor;
                                    ctx.lineTo(x, y);
                                    ctx.stroke();
                                  }
                                }}
                                onMouseUp={() => setIsDrawingOnPhoto(false)}
                                onMouseLeave={() => setIsDrawingOnPhoto(false)}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-gray-500 text-xs">Upload photos</p>
                    </div>
                  )}
                </CardContent>
                </Card>
              </Panel>
                </PanelGroup>
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {/* Voice Recording Bubble - Left of Support Chat bubble */}
        <motion.div
          className="fixed bottom-4 right-20 sm:right-24 z-40 group"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <Button
              onClick={toggleVoiceRecording}
              className={`w-14 h-14 rounded-full shadow-2xl border-4 border-white ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              } transition-all duration-300 hover:scale-110`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>
            
            {/* Voice recording indicator */}
            {isListening && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {isListening ? (
                <div className="flex flex-col items-center gap-1">
                  <span>Recording...</span>
                  <span className="text-xs opacity-75">Click to stop</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span>🎤 Voice Input</span>
                  <span className="text-xs opacity-75">Record audio for journal</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Sidekick - Centered */}
        <AnimatePresence>
          {showAiChat && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <div className="w-full max-w-md h-[500px] bg-white rounded-xl shadow-2xl border p-3 flex flex-col">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm">AI Writing Assistant</span>
                    <p className="text-xs text-gray-500">Photo analyzer • Idea generator</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAiChat(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-gray-300">
                {aiMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                      msg.type === 'ai' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 border border-purple-200' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  </div>
                ))}
                {aiAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 border border-purple-200 p-2 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={isAiListening ? "Listening..." : "Ask me anything or request help..."}
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendToAi(aiInput);
                    }
                  }}
                  disabled={isAiListening}
                />
                <Button 
                  onClick={toggleAiVoiceInput}
                  size="sm"
                  variant={isAiListening ? "default" : "outline"}
                  className={isAiListening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : ""}
                  title={isAiListening ? "Stop voice input" : "Voice input"}
                >
                  {isAiListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={() => sendToAi(aiInput)}
                  size="sm"
                  disabled={!aiInput.trim() || aiAnalyzing || isAiListening}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick AI Actions */}
              <div className="flex gap-1 mt-2 flex-wrap">
                <Button 
                  onClick={() => sendToAi("Suggest writing prompts based on my content")}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Ideas
                </Button>
                <Button 
                  onClick={() => sendToAi("Help me improve this entry")}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Review
                </Button>
                {photos.length > 0 && (
                  <Button 
                    onClick={() => sendToAi("Tell me more about my photos and suggest related writing topics")}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Photo Help
                  </Button>
                )}
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Sidekick Toggle - Center Bottom */}
        <Button
          onClick={() => setShowAiChat(!showAiChat)}
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-12 h-12 shadow-2xl z-40 ${
            showAiChat ? 'scale-90' : 'animate-bounce'
          }`}
        >
          {showAiChat ? <X className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
        </Button>

        {/* Voice Recording Status */}
        {isListening && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Recording... Speak now!</span>
            </div>
          </div>
        )}


      </motion.div>
    </motion.div>
  );
}