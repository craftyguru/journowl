import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Camera, Palette, Type, Smile, Calendar, Sparkles, 
  MessageCircle, MessageSquare, Star, Heart, BookOpen, Settings, Upload,
  Bold, Italic, Underline, List, Quote, Brush, Eraser,
  Undo, Redo, Download, Share, Plus, X, Mic, MicOff, Send,
  Wand2, Eye, Brain, Lightbulb, Video
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import PromptPurchase from "@/components/PromptPurchase";
import { MergedHelpSupportBubble } from "@/components/MergedHelpSupportBubble";

const moodEmojis = ["😊", "😐", "😔", "🤔", "😄", "🎉", "😠", "😴", "💪", "🥰"];
const fontFamilies = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Courier New', 'Trebuchet MS', 'Arial Black', 'Impact', 'Comic Sans MS',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Century Gothic',
  'Franklin Gothic Medium', 'Lucida Console', 'Lucida Sans Unicode', 'Tahoma', 'Geneva',
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'
];

interface UnifiedJournalProps {
  entry?: any;
  allEntries?: any[];
  onSave: (entry: any) => void;
  onClose: () => void;
  onNavigateEntry?: (entry: any) => void;
}

export default function UnifiedJournal({ entry, allEntries = [], onSave, onClose, onNavigateEntry }: UnifiedJournalProps) {
  // Fetch user data for personalization
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch prompt usage for AI counter
  const { data: promptUsageData } = useQuery({
    queryKey: ["/api/prompts/usage"],
    retry: false,
  });

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
  
  // Update photos when entry changes
  useEffect(() => {
    if (entry) {
      setPhotos(entry.photos || []);
    }
  }, [entry]);
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
  const [aiMessages, setAiMessages] = useState<Array<{type: 'ai' | 'user', message: string, audioUrl?: string, audioDuration?: number, photoUrl?: string}>>([]);
  const [aiInput, setAiInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [showUsageWarning, setShowUsageWarning] = useState(false);
  const [isHoldingMic, setIsHoldingMic] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [promptUsage, setPromptUsage] = useState<{promptsRemaining: number; promptsUsedThisMonth: number} | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioRecordings, setAudioRecordings] = useState<{url: string, duration: number, timestamp: Date, blob?: Blob, analysis?: any}[]>(entry?.audioRecordings || []);
  const [recordingTimer, setRecordingTimer] = useState<number>(0);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [videoRecordings, setVideoRecordings] = useState<{url: string, duration: number, timestamp: Date, type: 'photo' | 'video'}[]>([]);
  const [showPromptPurchase, setShowPromptPurchase] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Journal Navigation Functions
  const getCurrentEntryIndex = () => {
    if (!entry || !allEntries.length) return -1;
    return allEntries.findIndex(e => e.id === entry.id);
  };

  const navigateToPreviousEntry = () => {
    const currentIndex = getCurrentEntryIndex();
    if (currentIndex > 0 && onNavigateEntry) {
      const previousEntry = allEntries[currentIndex - 1];
      onNavigateEntry(previousEntry);
    }
  };

  const navigateToNextEntry = () => {
    const currentIndex = getCurrentEntryIndex();
    if (currentIndex >= 0 && currentIndex < allEntries.length - 1 && onNavigateEntry) {
      const nextEntry = allEntries[currentIndex + 1];
      onNavigateEntry(nextEntry);
    }
  };

  const hasPreviousEntry = () => {
    const currentIndex = getCurrentEntryIndex();
    return currentIndex > 0;
  };

  const hasNextEntry = () => {
    const currentIndex = getCurrentEntryIndex();
    return currentIndex >= 0 && currentIndex < allEntries.length - 1;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#000000");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [initialMessageSet, setInitialMessageSet] = useState(false);

  // Set personalized welcome message when user data loads
  useEffect(() => {
    if (user && !initialMessageSet) {
      const userName = (user as any)?.username || (user as any)?.email?.split('@')[0] || 'there';
      const welcomeMessage = `Hi ${userName}! 🦉 Welcome to your AI-powered journal companion!

I CAN HELP YOU:
• Write journal entries with personalized prompts
• Capture and reflect emotions, memories, and story ideas  
• Suggest creative writing topics based on your mood
• Turn your daily moments into meaningful stories
• Enhance spiritual, divine your journaling with insights

IMPORTANT: Each AI interaction uses 1 prompt from your monthly limit. Check your remaining prompts in the dashboard above!

💡 Simply start writing, attach a photo, or click the sparkle icon for AI assistance!`;

      setAiMessages([{ type: 'ai', message: welcomeMessage }]);
      setInitialMessageSet(true);
    }
  }, [user, initialMessageSet]);

  // Auto-trigger AI analysis for dashboard recordings
  useEffect(() => {
    if (entry?.triggerAiAnalysis && entry?.audioRecordings?.length > 0) {
      const audioRecording = entry.audioRecordings[0];
      
      // Show AI chat automatically
      setShowAiChat(true);
      
      // Add audio message to chat
      setAiMessages(prev => [...prev, {
        type: 'user',
        message: `🎵 Dashboard Audio Recording (${audioRecording.duration}s)`,
        audioUrl: audioRecording.url,
        audioDuration: audioRecording.duration
      }]);
      
      // Add analyzing message
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: `🎵 Great audio recording! Analyzing with AI to help with your journaling...`
      }]);
      
      // Trigger AI analysis if blob exists
      if (audioRecording.blob) {
        analyzeAudioWithAI(audioRecording.blob, audioRecording.duration);
      }
    }
  }, [entry]);

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
          if (showAiChat) {
            // If AI chat is open, send the speech to AI for analysis
            setAiInput(finalTranscript);
            setTimeout(() => {
              sendToAi(finalTranscript);
            }, 500);
          } else {
            // Regular journal transcription
            setContent(prev => prev + ' ' + finalTranscript);
            setAiMessages(prev => [...prev, {
              type: 'ai',
              message: `Great! I heard: "${finalTranscript}". Keep talking or let me suggest what to write next!`
            }]);
          }
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

      // Initialize separate speech recognition for AI chat with mobile optimization
      const aiRecognitionInstance = new SpeechRecognition();
      
      // Detect if user is on mobile device
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile-optimized settings to prevent multiple partial messages
        aiRecognitionInstance.continuous = false;  // Single result mode for mobile
        aiRecognitionInstance.interimResults = false;  // No interim results on mobile
        aiRecognitionInstance.maxAlternatives = 1;
      } else {
        // Desktop settings with interim results
        aiRecognitionInstance.continuous = true;
        aiRecognitionInstance.interimResults = true;
      }
      
      aiRecognitionInstance.lang = 'en-US';

      aiRecognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else if (!isMobile) {
            // Only show interim results on desktop
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (isMobile) {
          // On mobile, only process final results and send immediately
          if (finalTranscript.trim()) {
            console.log('Mobile AI Recognition final:', finalTranscript);
            setAiInput(finalTranscript.trim());
            setLastFinalTranscript(finalTranscript.trim());
            
            // Auto-send on mobile after getting final result
            setTimeout(async () => {
              await sendToAi(finalTranscript.trim());
              setAiInput('');
              setLastFinalTranscript('');
              
              // In conversation mode, restart recognition for continuous chat
              if (isConversationMode && aiRecognitionInstance) {
                console.log('Mobile: Restarting recognition for conversation mode');
                setTimeout(() => {
                  try {
                    aiRecognitionInstance.start();
                    setIsAiListening(true);
                  } catch (error) {
                    console.log('Could not restart conversation mode:', error);
                  }
                }, 2000); // Wait 2 seconds before restarting
              }
            }, 100);
          }
        } else {
          // Desktop behavior with interim results
          setAiInput(lastFinalTranscript + finalTranscript + interimTranscript);
          
          if (finalTranscript && finalTranscript !== lastFinalTranscript) {
            const newContent = lastFinalTranscript + finalTranscript;
            setLastFinalTranscript(newContent);
            console.log('Desktop AI Recognition received:', newContent);
          }
        }
      };

      aiRecognitionInstance.onerror = (event) => {
        console.error('AI speech recognition error:', event.error);
        setIsAiListening(false);
      };

      aiRecognitionInstance.onend = () => {
        console.log('AI speech recognition ended');
        setIsAiListening(false);
        
        // On mobile, restart if no final transcript was received and still listening
        if (isMobile && isAiListening && !lastFinalTranscript) {
          console.log('Mobile: Restarting speech recognition for better results');
          setTimeout(() => {
            if (!isAiListening) {
              try {
                aiRecognitionInstance.start();
                setIsAiListening(true);
              } catch (error) {
                console.log('Could not restart speech recognition:', error);
              }
            }
          }, 100);
        }
      };

      setAiRecognition(aiRecognitionInstance);
      console.log('AI speech recognition initialized successfully');
    } else {
      console.error('Speech recognition not supported in this browser');
      setAiMessages([{
        type: 'ai',
        message: '❌ Speech recognition is not supported in your browser. You can still type messages to chat with me!'
      }]);
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
    if (content.length < 10) {
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: '💡 Start writing at least 10 characters and I\'ll give you personalized suggestions based on your content!'
      }]);
      setShowAiChat(true);
      return;
    }

    try {
      // Show loading state
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: '💭 Analyzing your writing... generating personalized suggestions!'
      }]);
      setShowAiChat(true);

      const response = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recentEntries: [content],
          mood,
          photos: photos.map(p => p.analysis?.description).filter(Boolean),
          title: title || "Untitled"
        })
      });

      if (response.ok) {
        const { prompt } = await response.json();
        setAiMessages(prev => [
          ...prev.slice(0, -1), // Remove loading message
          {
            type: 'ai',
            message: `💡 **Writing Suggestion Based on Your Content:**\n\n${prompt}\n\n🎯 This suggestion was crafted specifically for your current entry and mood (${mood}). Want more ideas or help developing this further?`
          }
        ]);
      } else {
        throw new Error('Failed to generate suggestion');
      }
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
      setAiMessages(prev => [
        ...prev.slice(0, -1), // Remove loading message
        {
          type: 'ai',
          message: '😅 I had trouble generating suggestions right now. Try again in a moment, or feel free to ask me for writing ideas directly!'
        }
      ]);
    }
  }, [content, mood, photos, title]);

  // Voice to Text for Journal Content - WORKING VERSION
  const toggleVoiceRecording = () => {
    console.log('🎤 toggleVoiceRecording called, isListening:', isListening, 'recognition:', !!recognition);
    
    if (isListening && recognition) {
      // Stop listening
      recognition.stop();
      setIsListening(false);
      console.log('🛑 Stopping voice recognition');
    } else {
      // Start listening
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();
        
        newRecognition.continuous = true;
        newRecognition.interimResults = true;
        newRecognition.lang = 'en-US';

        newRecognition.onstart = () => {
          setIsListening(true);
          console.log('🎤✅ Voice to Text started successfully');
        };

        newRecognition.onresult = (event: any) => {
          console.log('🎤📝 Speech recognition result event:', event);
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          console.log('🎤 Final transcript:', finalTranscript);
          console.log('🎤 Interim transcript:', interimTranscript);

          // Add final transcript to journal content immediately
          if (finalTranscript && finalTranscript.trim().length > 0) {
            console.log('✅ Adding to journal content:', finalTranscript);
            setContent(prev => {
              const newContent = prev + finalTranscript + ' ';
              console.log('📝 New content will be:', newContent);
              return newContent;
            });
          }
        };

        newRecognition.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          setIsListening(false);
          alert(`Speech recognition error: ${event.error}. Please try again.`);
        };

        newRecognition.onend = () => {
          setIsListening(false);
          console.log('🎤 Voice to Text ended');
        };

        setRecognition(newRecognition);
        newRecognition.start();
        console.log('🎤 Starting new speech recognition...');
        
      } else {
        alert('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      }
    }
  };



  // Enhanced audio recording that feeds into AI chat
  const startAudioRecordingForAI = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      if (showAiChat) {
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎵 Recording audio... I\'ll analyze it when you\'re done!'
        }]);
      }
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const actualDuration = Math.round((Date.now() - recordingStartTime) / 1000);
        
        // Add to audio recordings
        const newAudioRecording = {
          url: audioUrl,
          duration: actualDuration,
          timestamp: new Date(),
          blob: audioBlob
        };
        setAudioRecordings(prev => [...prev, newAudioRecording]);
        
        if (showAiChat) {
          // Add user audio message with playable audio
          setAiMessages(prev => [...prev, {
            type: 'user',
            message: `🎵 Audio Recording (${actualDuration}s)`,
            audioUrl: audioUrl,
            audioDuration: actualDuration
          }]);
          
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: `✅ Got your audio! Analyzing with AI...`
          }]);

          // Analyze the audio with AI
          console.log('🎤 About to analyze audio:', { audioBlob, actualDuration });
          analyzeAudioWithAI(audioBlob, actualDuration);
        }
        
        stream.getTracks().forEach(track => track.stop());
        setIsRecordingAudio(false);
        setRecordingTimer(0);
      };

      setMediaRecorder(recorder);
      setIsRecordingAudio(true);
      setRecordingStartTime(Date.now());
      
      let timer = 0;
      const interval = setInterval(() => {
        timer++;
        setRecordingTimer(timer);
        if (timer >= 60) { // Max 60 seconds
          recorder.stop();
          clearInterval(interval);
        }
      }, 1000);

      recorder.start();
    } catch (error) {
      console.error('Audio recording failed:', error);
      if (showAiChat) {
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎤 I need microphone permission to help with audio recording. Please allow microphone access and try again!'
        }]);
      }
    }
  };

  // Fetch prompt usage data
  const fetchPromptUsage = async () => {
    try {
      const response = await fetch('/api/prompts/usage');
      if (response.ok) {
        const data = await response.json();
        setPromptUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch prompt usage:', error);
    }
  };

  // Stop audio recording - unified function for both recording types
  const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecordingAudio(false);
      
      const duration = Math.round((Date.now() - recordingStartTime) / 1000);
      setRecordingDuration(duration);
    }
  };


  // AI Audio Analysis Function
  const analyzeAudioWithAI = async (audioBlob: Blob, duration: number) => {
    try {
      console.log('🎵 analyzeAudioWithAI called with:', {
        blobSize: audioBlob?.size || 'no blob',
        blobType: audioBlob?.type || 'no type',
        duration: duration
      });

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('No audio data to analyze');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, `audio-${Date.now()}.wav`);

      console.log('🎵 Sending audio for analysis...', formData);
      
      let response;
      try {
        response = await fetch('/api/ai/analyze-audio', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        console.log('📡 Audio analysis response received:', response.status, response.statusText);
      } catch (fetchError) {
        console.error('🚨 FETCH ERROR - Request failed:', fetchError);
        throw new Error(`Network request failed: ${fetchError.message}`);
      }

      if (response.ok) {
        const analysis = await response.json();
        
        // Update the most recent audio recording with analysis
        setAudioRecordings(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].analysis = analysis;
          }
          return updated;
        });

        // Display comprehensive analysis in AI chat
        const analysisMessage = `🎵 **Audio Analysis Complete!**

📝 **What you said:** "${analysis.transcription}"

📊 **Summary:** ${analysis.summary}

🎭 **Emotions:** ${analysis.emotions.join(', ')}
📋 **Topics:** ${analysis.keyTopics.join(', ')}
😊 **Mood:** ${analysis.mood}
⏱️ **Duration:** ${analysis.duration} | 📝 **Words:** ${analysis.wordCount}

💡 **Writing prompts based on your audio:**
${analysis.journalPrompts.map((prompt: string, i: number) => `${i + 1}. ${prompt}`).join('\n')}

🔍 **Key insights I noticed:**
${analysis.insights.map((insight: string, i: number) => `• ${insight}`).join('\n')}

Ready to turn your thoughts into a beautiful journal entry? I can help you expand on any of these themes!`;

        setAiMessages(prev => [...prev.slice(0, -1), {
          type: 'ai',
          message: analysisMessage
        }]);

        // MAIN FEATURE: Add transcribed speech directly to journal content  
        if (analysis.transcription && analysis.transcription.length > 5) {
          // Add the actual speech as main content
          const speechContent = `${analysis.transcription}\n\n`;
          setContent(prev => prev + speechContent);
          
          // Also add metadata in smaller text
          const metadata = `*[Voice note from ${new Date().toLocaleTimeString()}: ${analysis.keyTopics.join(', ')} | ${analysis.mood} mood]*\n\n`;
          setContent(prev => prev + metadata);
        }
        
      } else {
        let errorData;
        try {
          errorData = await response.text();
        } catch (e) {
          errorData = 'Could not read error response';
        }
        console.log('❌ Audio analysis failed with status:', response.status, 'Error:', errorData);
        throw new Error(`Failed to analyze audio: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('🔥 AUDIO ANALYSIS ERROR:', error);
      console.error('🔥 Error details:', error.message, error.stack);
      setAiMessages(prev => [...prev.slice(0, -1), {
        type: 'ai',
        message: '🎵 Audio recorded successfully! I had trouble analyzing it, but the recording is saved. You can still tell me about what you recorded!'
      }]);
    }
  };

  // Handle recording completion
  useEffect(() => {
    if (audioChunks.length > 0 && !isRecordingAudio) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioRecordings(prev => [...prev, {
        url: audioUrl,
        duration: recordingDuration,
        timestamp: new Date(),
        blob: audioBlob
      }]);
      
      setAudioChunks([]);
    }
  }, [audioChunks, isRecordingAudio, recordingDuration]);

  // Unified camera function with live preview
  const takeCameraPhoto = () => {
    setShowCameraModal(false); // Close modal first
    setTimeout(() => openCameraPreview(false), 100); // Small delay to ensure modal closes
  };

  // Enhanced camera function for AI
  const capturePhotoForAI = () => {
    openCameraPreview(true);
  };

  // Create camera preview with live video feed
  const openCameraPreview = async (enableAiAnalysis: boolean = false) => {
    console.log(`📸 Opening camera preview, AI: ${enableAiAnalysis}`);
    
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('❌ Camera not supported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      
      // Create full-screen camera overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: system-ui;
      `;
      
      // Title
      const title = document.createElement('div');
      title.innerHTML = enableAiAnalysis ? '🤖 AI Photo Analysis' : '📸 Take Photo';
      title.style.cssText = `
        color: white;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      `;
      
      // Video element with live preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.cssText = `
        width: 90%;
        max-width: 400px;
        border-radius: 15px;
        border: 3px solid white;
        margin-bottom: 20px;
      `;
      
      // Buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 20px;';
      
      const captureBtn = document.createElement('button');
      captureBtn.innerHTML = '📸 Capture';
      captureBtn.style.cssText = `
        padding: 15px 30px;
        font-size: 18px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
      `;
      
      const cancelBtn = document.createElement('button');
      cancelBtn.innerHTML = '❌ Cancel';
      cancelBtn.style.cssText = `
        padding: 15px 30px;
        font-size: 18px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
      `;
      
      // Handle capture
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0);
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = async (e) => {
                const base64 = e.target?.result as string;
                
                // Upload photo to storage first
                try {
                  const uploadResponse = await fetch('/api/upload/photo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      base64Image: base64,
                      filename: `camera-${Date.now()}.jpg`
                    })
                  });
                  
                  if (!uploadResponse.ok) {
                    throw new Error('Upload failed');
                  }
                  
                  const { url: storageUrl } = await uploadResponse.json();
                  console.log('✅ Photo uploaded to storage:', storageUrl);
                  
                  // Add photo to journal with storage URL
                  const newPhoto = {
                    id: Date.now(),
                    src: storageUrl, // Use storage URL instead of base64
                    timestamp: new Date(),
                    analysis: null
                  };
                  
                  setPhotos(prev => [...prev, newPhoto]);
                  
                  // ALWAYS trigger AI analysis for camera photos
                  if (showAiChat) {
                    // Add user message with photo
                    setAiMessages(prev => [...prev, {
                      type: 'user',
                      message: 'I just took a photo!',
                      photoUrl: storageUrl // Use storage URL
                    }]);
                    
                    setAiMessages(prev => [...prev, {
                      type: 'ai',
                      message: '📸 Analyzing your captured photo... This will help me suggest better writing prompts!'
                    }]);
                  }
                } catch (uploadError) {
                  console.error('❌ Photo upload failed:', uploadError);
                  // Fallback to base64 if upload fails
                  const newPhoto = {
                    id: Date.now(),
                    src: base64,
                    timestamp: new Date(),
                    analysis: null
                  };
                  
                  setPhotos(prev => [...prev, newPhoto]);
                  
                  if (showAiChat) {
                    setAiMessages(prev => [...prev, {
                      type: 'user',
                      message: 'I just took a photo!',
                      photoUrl: base64
                    }]);
                    
                    setAiMessages(prev => [...prev, {
                      type: 'ai',
                      message: '📸 Photo saved! Analyzing now...'
                    }]);
                  }
                }

                try {
                  // Get the latest photo
                  const latestPhoto = photos[photos.length - 1] || { src: base64 };
                  const isStorageUrl = latestPhoto.src && !latestPhoto.src.startsWith('data:');
                  
                  const response = await fetch('/api/ai/analyze-photo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ 
                      photoUrl: isStorageUrl ? latestPhoto.src : undefined,
                      base64Image: isStorageUrl ? undefined : (latestPhoto.src || base64).split(',')[1],
                      currentMood: mood 
                    })
                  });

                  if (response.ok) {
                    const analysis = await response.json();
                    
                    // Update the latest photo with analysis
                    setPhotos(prev => {
                      const updatedPhotos = [...prev];
                      if (updatedPhotos.length > 0) {
                        updatedPhotos[updatedPhotos.length - 1] = {
                          ...updatedPhotos[updatedPhotos.length - 1],
                          analysis
                        };
                      }
                      return updatedPhotos;
                    });
                    
                    // Add AI-generated tags
                    if (analysis.tags) {
                      setTags(prev => [...new Set([...prev, ...analysis.tags])]);
                    }

                    // Add detailed AI analysis message only if AI chat is open
                    if (showAiChat) {
                      setAiMessages(prev => [...prev, {
                        type: 'ai',
                        message: `📸 Perfect capture! I analyzed your photo:\n\n📝 ${analysis.description}\n🏷️ Key elements: ${analysis.tags?.slice(0, 3).join(', ')}\n💭 Writing prompt: ${analysis.journalPrompts?.[0] || 'What story does this moment tell?'}\n\nWant me to help you write about this?`
                      }]);
                    }
                  }
                } catch (error) {
                  console.error('❌ Camera photo analysis failed:', error);
                  if (showAiChat) {
                    setAiMessages(prev => [...prev, {
                      type: 'ai',
                      message: '😅 I had trouble analyzing that photo. But I can still help you write about it! What do you see in the image?'
                    }]);
                  }
                }
                
                // Cleanup
                stream.getTracks().forEach(track => track.stop());
                document.body.removeChild(overlay);
                setShowCameraModal(false);
              };
              reader.readAsDataURL(blob);
            }
          }, 'image/jpeg', 0.8);
        }
      };
      
      // Handle cancel
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
        setShowCameraModal(false);
      };
      
      // Build UI
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      overlay.appendChild(title);
      overlay.appendChild(video);
      overlay.appendChild(buttonContainer);
      document.body.appendChild(overlay);
      
      console.log('✅ Camera preview opened');
      
    } catch (error) {
      console.error('Camera failed:', error);
      if (enableAiAnalysis && showAiChat) {
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '📷 Camera access failed. Please allow camera permissions and try again!'
        }]);
      }
    }
  };

  // Handle AI photo analysis
  const handlePhotoAiAnalysis = async (base64: string) => {
    setAiMessages(prev => [...prev, {
      type: 'user',
      message: '📸 I just took a photo! Please analyze it.'
    }]);
    
    setAiMessages(prev => [...prev, {
      type: 'ai',
      message: '🔍 Analyzing your photo...'
    }]);

    try {
      const response = await fetch('/api/ai/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          base64Image: base64.split(',')[1],
          currentMood: mood 
        })
      });

      if (response.ok) {
        const analysis = await response.json();
        setPhotos(prev => prev.map(p => 
          p.src === base64 ? { ...p, analysis } : p
        ));
        
        const analysisMessage = `✨ Photo Analysis Complete!

📝 **Description:** ${analysis.description}
🎭 **Emotions:** ${analysis.emotions?.join(', ') || 'Peaceful'}
👥 **People:** ${analysis.people?.length > 0 ? analysis.people.join(', ') : 'None detected'}
🏷️ **Objects:** ${analysis.objects?.join(', ') || 'Various objects'}

🌟 **Journal Prompts:**
${analysis.journalPrompts?.map((prompt: string, i: number) => `${i + 1}. ${prompt}`).join('\n') || '1. What story does this image tell?'}

💭 Would you like me to help you write about this photo?`;

        setAiMessages(prev => [...prev.slice(0, -1), {
          type: 'ai',
          message: analysisMessage
        }]);

        if (analysis.tags) {
          setTags(prev => [...new Set([...prev, ...analysis.tags])]);
        }
      } else {
        setAiMessages(prev => [...prev.slice(0, -1), {
          type: 'ai',
          message: '😅 I had trouble analyzing your photo, but it looks great! Tell me about it.'
        }]);
      }
    } catch (error) {
      console.error('Photo analysis failed:', error);
      setAiMessages(prev => [...prev.slice(0, -1), {
        type: 'ai',
        message: '📸 Photo captured! I had a small issue analyzing it, but I can see you took a great shot!'
      }]);
    }
  };

  const startVideoRecording = async () => {
    setShowCameraModal(false); // Close modal first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoRecordings(prev => [...prev, {
          url: videoUrl,
          duration: 30, // Max 30 seconds for videos
          timestamp: new Date(),
          type: 'video'
        }]);
        stream.getTracks().forEach(track => track.stop());
        setShowCameraModal(false);
      };
      
      mediaRecorder.start();
      
      // Stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting video recording:', error);
    }
  };

  // Hold-to-talk voice recording for mobile optimization
  const handleVoiceStart = () => {
    console.log('Voice recording started (hold-to-talk)');
    if (aiRecognition && !isAiListening) {
      setAiInput('');
      setLastFinalTranscript('');
      try {
        aiRecognition.start();
        setIsAiListening(true);
        
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎤 Hold the button and speak... Release when done!'
        }]);
      } catch (error) {
        console.error('Error starting voice recording:', error);
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: '🎤 I need microphone permission. Please allow microphone access and try again!'
        }]);
      }
    }
  };

  const handleVoiceEnd = () => {
    console.log('Voice recording ended (hold-to-talk)');
    if (aiRecognition && isAiListening) {
      aiRecognition.stop();
      setIsAiListening(false);
      
      // Process the final transcript
      setTimeout(() => {
        const finalInput = lastFinalTranscript || aiInput;
        if (finalInput.trim()) {
          console.log('Sending voice message to AI:', finalInput);
          sendToAi(finalInput.trim());
          setAiInput('');
          setLastFinalTranscript('');
        } else {
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: '🤔 I didn\'t catch that. Please try again or type your message.'
          }]);
        }
      }, 500); // Small delay to ensure final transcript is captured
    }
  };

  // Enable full conversation mode
  const handleEnableConversation = async () => {
    console.log('Enabling full conversation mode...');
    await fetchPromptUsage();
    setShowUsageWarning(true);
  };

  // Start full conversation mode after warning confirmation with mobile optimization
  const startConversationMode = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (aiRecognition && !isAiListening) {
      setAiInput('');
      setLastFinalTranscript('');
      setIsConversationMode(true); // Enable conversation mode
      
      try {
        aiRecognition.start();
        setIsAiListening(true);
        
        if (isMobile) {
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: '🎤 Conversation mode active! On mobile, speak and I\'ll respond after each message. The mic will automatically restart for continuous conversation.'
          }]);
        } else {
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: '🎤 Conversation mode active! I\'m listening and will respond to everything you say.'
          }]);
        }
      } catch (error) {
        console.error('Error starting AI speech recognition:', error);
      }
    }
    setShowUsageWarning(false);
  };

  // Stop any active voice input
  const stopVoiceInput = () => {
    if (aiRecognition && isAiListening) {
      try {
        aiRecognition.stop();
        setIsAiListening(false);
        setIsConversationMode(false); // Disable conversation mode
        setAiInput('');
        setLastFinalTranscript('');
      } catch (error) {
        console.error('Error stopping AI speech recognition:', error);
        setIsAiListening(false);
        setIsConversationMode(false);
      }
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
        credentials: 'include', // Include cookies for session authentication
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
            conversationHistory: aiMessages.map(msg => `${msg.type}: ${msg.message}`).join('\n') // Full conversation context
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
        // Handle specific error types
        const errorData = await response.json().catch(() => ({}));
        console.error('AI chat error:', response.status, errorData);
        
        let errorMessage = 'I had trouble processing that. Can you try again?';
        
        if (response.status === 429 && errorData.promptsExhausted) {
          errorMessage = errorData.reply || '🚫 You\'ve used all your AI prompts! You need to purchase more prompts or upgrade your subscription to continue chatting with me. Check your subscription status in the dashboard.';
        } else if (response.status === 401) {
          errorMessage = '🔐 Please log in to use the AI Writing Assistant. You need to be authenticated to access AI features.';
        } else if (errorData.reply) {
          errorMessage = errorData.reply;
        }
        
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: errorMessage
        }]);
        return; // Exit early to avoid the catch block
      }
    } catch (error) {
      console.error('AI chat network error:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        message: 'I had trouble connecting to the AI service. Please check your internet connection and try again.ernet connection.'
      }]);
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Add AI response to journal content in a user-friendly format
  const addToJournal = (aiResponse: string) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Clean up the AI response for better journal formatting
    let cleanedResponse = aiResponse
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove markdown italics
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/^\d+\.\s/gm, '') // Remove numbered lists
      .replace(/^•\s/gm, '') // Remove bullet points
      .replace(/^-\s/gm, '') // Remove dashes
      .trim();
    
    // If it's a structured prompt, format it nicely
    if (cleanedResponse.includes('Reflect on') || cleanedResponse.includes('What inspired') || cleanedResponse.includes('Describe')) {
      // This is a writing prompt - format it as a journal reflection starter
      const journalEntry = `

📝 **Journal Reflection** (${currentTime})

${cleanedResponse}

---

*My thoughts:*

`;
      setContent(prev => prev + journalEntry);
    } else {
      // Regular AI response - add as a thoughtful note
      const journalEntry = `

💭 **AI Insight** (${currentTime})

${cleanedResponse}

`;
      setContent(prev => prev + journalEntry);
    }
    
    // Show success message
    setAiMessages(prev => [...prev, {
      type: 'ai',
      message: '✅ Added to your journal! You can now edit and expand on this content.'
    }]);
  };

  const handleMediaUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Handle images
      if (file.type.startsWith('image/')) {

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        console.log('📸 Photo loaded, base64 length:', base64?.length);
        console.log('📸 Base64 starts with:', base64?.substring(0, 50));
        
        // Upload photo to storage first
        try {
          const uploadResponse = await fetch('/api/upload/photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              base64Image: base64,
              filename: file.name
            })
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Upload failed');
          }
          
          const { url: storageUrl } = await uploadResponse.json();
          console.log('✅ Gallery photo uploaded to storage:', storageUrl);
          
          const newPhoto = {
            id: Date.now() + i,
            src: storageUrl, // Use storage URL
            analysis: null
          };
          
          console.log('📸 Created new photo object:', { 
            id: newPhoto.id, 
            srcLength: newPhoto.src?.length,
            srcPrefix: newPhoto.src?.substring(0, 50)
          });

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
              credentials: 'include', // Include cookies for session authentication
              body: JSON.stringify({ 
                photoUrl: storageUrl,
                currentMood: mood 
              })
            });

            if (response.ok) {
              const analysis = await response.json();
              // Update the latest photo with analysis
              setPhotos(prev => {
                const updatedPhotos = [...prev];
                if (updatedPhotos.length > 0) {
                  updatedPhotos[updatedPhotos.length - 1] = {
                    ...updatedPhotos[updatedPhotos.length - 1],
                    analysis
                  };
                }
                return updatedPhotos;
              });
              
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
          } catch (analysisError) {
            console.error('Photo analysis failed:', analysisError);
            setAiMessages(prev => [...prev, {
              type: 'ai',
              message: '😅 I had trouble analyzing that photo. But I can still help you write about it! What do you see in the image?'
            }]);
          }
        } catch (uploadError) {
          console.error('❌ Photo upload failed:', uploadError);
          // Fallback to base64
          const newPhoto = {
            id: Date.now() + i,
            src: base64,
            analysis: null
          };
          
          setPhotos(prev => [...prev, newPhoto]);
          
          setAiMessages(prev => [...prev, {
            type: 'ai',
            message: '📸 Photo saved! Analyzing now...'
          }]);

          try {
            const response = await fetch('/api/ai/analyze-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                base64Image: base64.split(',')[1],
                currentMood: mood 
              })
            });

            if (response.ok) {
              const analysis = await response.json();
              // Update the latest photo with analysis
              setPhotos(prev => {
                const updatedPhotos = [...prev];
                if (updatedPhotos.length > 0) {
                  updatedPhotos[updatedPhotos.length - 1] = {
                    ...updatedPhotos[updatedPhotos.length - 1],
                    analysis
                  };
                }
                return updatedPhotos;
              });
              
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
        }
      };

      reader.onerror = (error) => {
        console.error('❌ Failed to read file:', file.name, error);
        setAiMessages(prev => [...prev, {
          type: 'ai',
          message: `😅 I had trouble reading the file "${file.name}". Please try uploading the image again, or try a different file format (JPG, PNG).`
        }]);
      };

      reader.readAsDataURL(file);
      }
      
      // Handle videos
      else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;
          console.log('🎥 Video loaded, base64 length:', base64?.length);
          
          // Create video element to get duration
          const video = document.createElement('video');
          video.src = base64;
          
          video.onloadedmetadata = () => {
            const duration = Math.floor(video.duration);
            
            const newVideoRecording = {
              url: base64,
              duration: duration,
              timestamp: new Date(),
              type: 'video' as const
            };
            
            setVideoRecordings(prev => [...prev, newVideoRecording]);
            
            if (showAiChat) {
              setAiMessages(prev => [...prev, {
                type: 'user',
                message: `I just uploaded a video! (${duration}s)`
              }]);
              
              setAiMessages(prev => [...prev, {
                type: 'ai',
                message: '🎥 Great! I can see your video upload. Videos can capture so much emotion and movement - what was happening in this moment?'
              }]);
            }
            
            console.log('🎥 Video added to recordings');
          };
          
          video.onerror = () => {
            console.error('❌ Error loading video metadata');
            // Still add the video even if we can't get metadata
            const newVideoRecording = {
              url: base64,
              duration: 0,
              timestamp: new Date(),
              type: 'video' as const
            };
            
            setVideoRecordings(prev => [...prev, newVideoRecording]);
          };
        };
        reader.readAsDataURL(file);
      }
    }
  }, [mood, showAiChat, videoRecordings]);

  const handleSave = useCallback(() => {
    // Prevent multiple saves - debounce with immediate execution
    if (isSaving) {
      console.log("Save already in progress, ignoring duplicate call");
      return;
    }

    console.log("🔥 UnifiedJournal handleSave called!");
    console.log("UnifiedJournal - title:", title);
    console.log("UnifiedJournal - content:", content);
    console.log("UnifiedJournal - mood:", mood);
    
    setIsSaving(true);

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
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

    console.log("UnifiedJournal - prepared entry data:", JSON.stringify(entryData, null, 2));
    console.log("UnifiedJournal - calling onSave function:", typeof onSave);
    
    try {
      console.log("🔥 About to call onSave with entry data...");
      onSave(entryData);
      console.log("UnifiedJournal - onSave called successfully!");
      
      // Reset saving state after a brief delay to prevent rapid re-saves
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaving(false);
      }, 2000);
      
    } catch (error) {
      console.error("UnifiedJournal - Error calling onSave:", error);
      setIsSaving(false);
    }
  }, [title, content, mood, selectedFont, fontSize, textColor, backgroundColor, isPrivate, tags, photos, drawings, entry?.id, entry?.createdAt, onSave, isSaving]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Add keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log("🚨 KEYBOARD SAVE SHORTCUT USED!");
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, mood]);

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
        {/* Journal Header - Ultra Compact on Mobile */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-1 sm:p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-3">
            <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
            <div>
              <h1 className="text-sm sm:text-xl font-semibold sm:font-bold">📝 Journal</h1>
              <p className="text-amber-100 text-xs sm:text-sm hidden sm:block">Your AI-powered writing companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Journal Navigation */}
            {allEntries.length > 1 && entry && (
              <div className="hidden sm:flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                <Button
                  onClick={navigateToPreviousEntry}
                  disabled={!hasPreviousEntry()}
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/30 disabled:opacity-50 text-white"
                  title="Previous Entry"
                >
                  <span className="text-lg">📖</span>
                </Button>
                <span className="text-xs text-white/90 px-2">
                  {getCurrentEntryIndex() + 1}/{allEntries.length}
                </span>
                <Button
                  onClick={navigateToNextEntry}
                  disabled={!hasNextEntry()}
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/30 disabled:opacity-50 text-white"
                  title="Next Entry"
                >
                  <span className="text-lg">📚</span>
                </Button>
              </div>
            )}
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
              } text-white h-8 px-4 rounded text-sm font-medium flex items-center gap-2 z-50 relative transition-colors`}
              type="button"
              style={{ pointerEvents: 'all' }}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Entry'}</span>
              <span className="sm:hidden">💾</span>
            </button>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="bg-red-500/80 hover:bg-red-600 text-white border border-red-400 h-8 w-8 p-0 rounded-full flex items-center justify-center shadow-lg"
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
              
              {/* Mobile Basic Formatting Controls */}
              <div className="sm:hidden flex flex-wrap gap-2 p-2 bg-purple-50 rounded-lg">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" className="h-8 px-2 bg-purple-500 hover:bg-purple-600 text-white">
                      <Type className="w-3 h-3 mr-1" />
                      Font
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {[
                            'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
                            'Courier New', 'Trebuchet MS', 'Arial Black', 'Impact', 'Comic Sans MS',
                            'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Century Gothic',
                            'Franklin Gothic Medium', 'Lucida Console', 'Lucida Sans Unicode', 'Tahoma', 'Geneva',
                            'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'
                          ].map(font => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div>
                        <label className="text-xs">Size: {fontSize}px</label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={14}
                          max={20}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" className="h-8 px-2 bg-gray-700 hover:bg-gray-800 text-white">
                      <Palette className="w-3 h-3 mr-1" />
                      Color
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3">
                    <div className="space-y-3">
                      <HexColorPicker 
                        color={textColor} 
                        onChange={setTextColor}
                        style={{ width: '100%', height: '150px' }}
                      />
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" 
                          style={{ backgroundColor: textColor }}
                        />
                        <span className="text-xs text-gray-600 font-mono">
                          {textColor}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  size="sm" 
                  className="h-8 px-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    const textarea = document.querySelector('.w-md-editor-text-textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = content.substring(start, end);
                      const newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
                      setContent(newContent);
                    }
                  }}
                >
                  <Bold className="w-3 h-3" />
                </Button>
                
                <Button 
                  size="sm" 
                  className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    const textarea = document.querySelector('.w-md-editor-text-textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = content.substring(start, end);
                      const newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
                      setContent(newContent);
                    }
                  }}
                >
                  <Italic className="w-3 h-3" />
                </Button>
                
                <Button 
                  size="sm" 
                  className="h-8 px-2 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    setContent(prev => prev + '\n\n- ');
                  }}
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>

              {/* Desktop Advanced Controls */}
              <div className="space-y-2 hidden sm:block">
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

              {/* Mood & Controls - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 bg-white/50 rounded-lg backdrop-blur-sm text-sm">
                {/* Top Row - Mood Selection */}
                <div className="flex items-center gap-2 flex-1">
                  <Smile className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-xs font-medium whitespace-nowrap">Mood:</span>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger className="w-full sm:w-32 h-10 bg-white/70 border-amber-300 text-sm">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-amber-300">
                      {moodEmojis.map(emoji => (
                        <SelectItem 
                          key={emoji} 
                          value={emoji}
                          className="hover:bg-amber-50 focus:bg-amber-50"
                        >
                          <span className="text-lg">{emoji}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bottom Row - AI & Privacy Controls */}
                <div className="flex items-center gap-2 justify-between sm:justify-end">
                  <Button 
                    onClick={generateAiSuggestions}
                    variant="outline"
                    size="sm"
                    disabled={content.length < 10}
                    className="h-10 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-0 text-white font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={content.length < 10 ? "Write at least 10 characters to get AI suggestions" : "Generate AI writing suggestions based on your content"}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">AI Ideas</span>
                    <span className="sm:hidden">Ideas</span>
                  </Button>

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Private</span>
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

                {/* Rich Text Editor - Simplified on Mobile */}
                <div className="flex-1 min-h-0" style={{
                  fontFamily: selectedFont,
                  fontSize: `${fontSize}px`,
                  color: textColor
                }}>
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    preview="edit"
                    hideToolbar={true}
                    data-color-mode="light"
                    height="100%"
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      color: 'inherit',
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
                    onTouchStart={startDrawing as any}
                    onTouchMove={draw as any}
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
                        onClick={() => {
                          console.log('🔥 Upload button clicked');
                          console.log('🔥 fileInputRef.current:', fileInputRef.current);
                          fileInputRef.current?.click();
                        }}
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
                    accept="image/*,video/*"
                    onChange={(e) => {
                      console.log('🔥 File input changed:', e.target.files);
                      console.log('🔥 Files length:', e.target.files?.length);
                      if (e.target.files) {
                        handleMediaUpload(e.target.files);
                      }
                    }}
                    className="hidden"
                  />

                  {photos.length > 0 ? (
                    <div className="space-y-2">
                      {/* Photo Grid */}
                      <div className="grid grid-cols-2 gap-1">
                        {photos.slice(0, 4).map((photo, index) => (
                          <div key={photo.id || index} className="relative group">
                            <img
                              src={photo.src}
                              alt={`Photo ${index + 1}`}
                              className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                                selectedPhoto?.index === index ? 'ring-2 ring-amber-400' : ''
                              }`}
                              onClick={() => setSelectedPhoto({ ...photo, index })}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                              onLoad={() => {
                              }}
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
                      <p className="text-gray-500 text-xs">Upload photos & videos</p>
                    </div>
                  )}

                  {/* Audio Recordings Section */}
                  {audioRecordings.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        🎵 Audio Recordings
                        <Badge variant="secondary">{audioRecordings.length}</Badge>
                      </h3>
                      <div className="space-y-2">
                        {audioRecordings.map((recording, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">
                                Recording {index + 1} • {recording.duration}s
                                {recording.analysis && (
                                  <span className="ml-2 text-purple-600 font-medium">🤖 AI Analyzed</span>
                                )}
                              </span>
                              <span className="text-xs text-gray-400">
                                {recording.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <audio 
                              controls 
                              className="w-full h-8"
                              src={recording.url}
                            >
                              Your browser does not support audio playback.
                            </audio>
                            
                            {recording.analysis && (
                              <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                                <div className="font-medium text-purple-700 mb-1">AI Analysis:</div>
                                <div className="text-gray-700">
                                  <strong>Transcription:</strong> "{recording.analysis.transcription}"
                                  <br />
                                  <strong>Mood:</strong> {recording.analysis.mood} | <strong>Topics:</strong> {recording.analysis.keyTopics?.join(', ') || 'General'}
                                  <br />
                                  <strong>Words:</strong> {recording.analysis.wordCount} words
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Recordings Section */}
                  {videoRecordings.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        📹 Camera Captures
                        <Badge variant="secondary">{videoRecordings.length}</Badge>
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {videoRecordings.map((recording, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-2 border">
                            <div className="text-xs text-gray-500 mb-1">
                              {recording.type === 'photo' ? '📷' : '🎥'} {recording.type}
                            </div>
                            {recording.type === 'photo' ? (
                              <img 
                                src={recording.url}
                                alt={`Camera capture ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ) : (
                              <video 
                                controls 
                                className="w-full h-20 object-cover rounded"
                                src={recording.url}
                              >
                                Your browser does not support video playback.
                              </video>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              {recording.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
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

        {/* Professional Floating Action Buttons - 4 Evenly Spaced */}
        <div className="fixed bottom-4 left-0 right-0 z-[70]">
          <div className="flex justify-center items-center w-full px-1 sm:px-4">
            <div className="flex justify-between items-center w-full max-w-sm sm:max-w-xl gap-1 sm:gap-2">
            
            {/* 1. Voice/Microphone Button */}
            <motion.div
              className="group flex-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative flex justify-center">
                <Button
                  onClick={!showAiChat ? toggleVoiceRecording : undefined}
                  onMouseDown={showAiChat ? handleVoiceStart : undefined}
                  onMouseUp={showAiChat ? handleVoiceEnd : undefined}
                  onTouchStart={showAiChat ? handleVoiceStart : undefined}
                  onTouchEnd={showAiChat ? handleVoiceEnd : undefined}
                  onMouseLeave={showAiChat ? handleVoiceEnd : undefined}
                  onTouchCancel={showAiChat ? handleVoiceEnd : undefined}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 sm:border-4 border-white ${
                    isListening || isAiListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                      : showAiChat 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  } transition-all duration-300 hover:scale-110 ${showAiChat ? 'ring-2 ring-purple-300 ring-opacity-50' : ''}`}
                >
                  {(isListening || isAiListening) ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </Button>
                
                {isListening && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping z-20"></div>
                )}
                
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="flex flex-col items-center gap-1">
                    <span>{showAiChat ? '🎤 Hold to Talk' : '🎤 Voice to Text'}</span>
                    <span className="text-xs opacity-75">{showAiChat ? 'Press & hold to speak' : 'Convert speech'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Audio Recording Button */}
            <motion.div
              className="group flex-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex justify-center">
                <Button
                  onClick={isRecordingAudio ? stopAudioRecording : startAudioRecordingForAI}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 sm:border-4 border-white ${
                    isRecordingAudio 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : showAiChat
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } transition-all duration-300 hover:scale-110 ${showAiChat ? 'ring-2 ring-emerald-300 ring-opacity-50' : ''}`}
                >
                  {isRecordingAudio ? (
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  ) : (
                    <div className="w-4 h-4 bg-white rounded-full" />
                  )}
                </Button>
                
                {isRecordingAudio && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping z-20"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-mono z-20">
                      {Math.floor(recordingTimer / 60)}:{(recordingTimer % 60).toString().padStart(2, '0')}
                    </div>
                  </>
                )}
                
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="flex flex-col items-center gap-1">
                    <span>{showAiChat ? '🤖 AI Audio' : '🎵 Audio Record'}</span>
                    <span className="text-xs opacity-75">{showAiChat ? 'Record & Chat' : 'Save voice notes'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Camera/Upload Button (Merged) */}
            <motion.div
              className="group flex-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative flex justify-center">
                <Button
                  onClick={() => setShowCameraModal(true)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 sm:border-4 border-white ${
                    showAiChat
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                  } transition-all duration-300 hover:scale-110 ${showAiChat ? 'ring-2 ring-orange-300 ring-opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                    <Upload className="w-3 h-3 text-white ml-0.5" />
                  </div>
                </Button>
                
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="flex flex-col items-center gap-1">
                    <span>{showAiChat ? '🤖 AI Photo' : '📷 Camera & Upload'}</span>
                    <span className="text-xs opacity-75">{showAiChat ? 'Analyze & Chat' : 'Camera or Gallery'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. AI Chat Button - Improved Interface */}
            <motion.div
              className="group flex-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative flex justify-center">
                <Button
                  onClick={() => setShowAiChat(!showAiChat)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 sm:border-4 border-white ${
                    showAiChat 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 scale-90' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-bounce'
                  } transition-all duration-300 hover:scale-110`}
                >
                  {showAiChat ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Brain className="w-6 h-6 text-white" />
                  )}
                </Button>
                
                <div className="absolute bottom-16 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="flex flex-col items-center gap-1">
                    <span>{showAiChat ? '❌ Close AI' : '🧠 AI Writing Assistant'}</span>
                    <span className="text-xs opacity-75">{showAiChat ? 'Close chat' : 'Writing help & analysis'}</span>
                  </div>
                </div>
              </div>
            </motion.div>



            </div>
          </div>
        </div>

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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAiChat(false)}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-full w-8 h-8 p-0 flex items-center justify-center border border-gray-300 hover:border-red-300 bg-white/80 hover:bg-red-50"
                >
                  <X className="w-4 h-4 font-bold" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-gray-300">
                {aiMessages.map((msg, index) => {
                  const isProcessing = msg.type === 'ai' && (
                    msg.message.includes('Listening to your recording') ||
                    msg.message.includes('Transcribing your voice') ||
                    msg.message.includes('Analyzing content') ||
                    msg.message.includes('Creating personalized prompts') ||
                    msg.message.includes('Analyzing your photo')
                  );
                  
                  return (
                    <div key={index} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                        msg.type === 'ai' 
                          ? `bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 border border-purple-200 ${
                              isProcessing ? 'animate-pulse shadow-lg' : ''
                            }` 
                          : 'bg-blue-500 text-white'
                      } ${isProcessing ? 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-[length:200%_200%]' : ''}`}
                      style={isProcessing ? {
                        animation: 'gradientPulse 2s ease-in-out infinite, thinking 1.5s ease-in-out infinite'
                      } : {}}
                      >
                        <div className="whitespace-pre-wrap">{msg.message}</div>
                        {msg.photoUrl && (
                        <div className="mt-2">
                          <img 
                            src={msg.photoUrl} 
                            alt="User photo" 
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                      )}
                      {msg.audioUrl && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">🎵 Audio Recording ({msg.audioDuration}s)</span>
                          </div>
                          <audio controls className="w-full h-8" style={{ height: '32px' }}>
                            <source src={msg.audioUrl} type="audio/wav" />
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      )}
                      {msg.type === 'ai' && msg.message.length > 50 && !msg.message.includes('✅') && !msg.message.includes('🎤') && (
                        <Button 
                          onClick={() => addToJournal(msg.message)}
                          variant="ghost" 
                          size="sm"
                          className="mt-1 text-xs h-6 px-2 hover:bg-purple-200"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Journal
                        </Button>
                      )}
                      </div>
                    </div>
                  );
                })}
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
                  onClick={handleEnableConversation}
                  size="sm"
                  variant="outline"
                  className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  title="Enable conversation mode"
                >
                  <MessageSquare className="w-4 h-4" />
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
              <div className="flex gap-1 mt-2 flex-wrap items-center">
                <Button 
                  onClick={() => sendToAi("Create a journal writing prompt based on everything we've discussed in this conversation")}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Journal Prompt
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
                
                {/* Audio Analysis Button */}
                {(audioRecordings.length > 0 || entry?.audioUrl) && (
                  <Button 
                    onClick={async () => {
                      // Get audio from either source: journal recordings or dashboard recording
                      const latestRecording = audioRecordings[audioRecordings.length - 1];
                      const audioUrl = latestRecording?.url || entry?.audioUrl;
                      
                      if (audioUrl) {
                        // Show analyzing message
                        setAiMessages(prev => [...prev, {
                          type: 'user',
                          message: '🎵 Please analyze my voice recording and help me create a journal prompt!',
                          audioUrl: audioUrl
                        }]);
                        
                        setAiMessages(prev => [...prev, {
                          type: 'ai',
                          message: '🎧 Listening to your recording...'
                        }]);
                        
                        // Show processing phases with delays
                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev.slice(0, -1),
                            { type: 'ai', message: '🧠 Transcribing your voice...' }
                          ]);
                        }, 2000);
                        
                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev.slice(0, -1),
                            { type: 'ai', message: '🔍 Analyzing content and emotions...' }
                          ]);
                        }, 4000);
                        
                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev.slice(0, -1),
                            { type: 'ai', message: '✨ Creating personalized prompts...' }
                          ]);
                        }, 6000);

                        // Real audio analysis using the API
                        try {
                          // Convert base64 audio to blob for analysis
                          let audioBlob;
                          if (audioUrl.startsWith('data:audio')) {
                            // Base64 audio data
                            const base64Data = audioUrl.split(',')[1];
                            const binaryString = atob(base64Data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                              bytes[i] = binaryString.charCodeAt(i);
                            }
                            audioBlob = new Blob([bytes], { type: 'audio/wav' });
                          } else {
                            // URL reference - try to fetch
                            audioBlob = await fetch(audioUrl).then(r => r.blob());
                          }

                          const formData = new FormData();
                          formData.append('audio', audioBlob, 'recording.wav');

                          const response = await fetch('/api/ai/analyze-audio', {
                            method: 'POST',
                            body: formData
                          });

                          if (response.ok) {
                            const analysis = await response.json();
                            const durationText = latestRecording?.duration ? `${Math.floor(latestRecording.duration / 1000)}s` : 'Unknown duration';
                            
                            setAiMessages(prev => [...prev.slice(0, -1), {
                              type: 'ai',
                              message: `🎵 **Audio Recording Analysis Complete!**

🎙️ **Recording Duration:** ${durationText}

🎤 **What you said:** "${analysis.transcription || 'Audio processed successfully'}"

💭 **AI Analysis:** ${analysis.analysis || 'I can hear your voice and detect your emotional tone in this recording.'}

✨ **Personalized Journal Prompts:**
${analysis.prompts ? analysis.prompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n') : `1. What thoughts were going through your mind when you made this recording?
2. How did speaking out loud make you feel compared to writing?
3. What story does your voice tell about your current mood?
4. If you could expand on what you recorded, what would you add?
5. How does your voice recording reflect your personality today?`}

🏷️ **Suggested Tags:** ${analysis.tags ? analysis.tags.join(', ') : 'voice-recording, personal-moment, reflection'}

💡 Ready to turn your voice recording into a beautiful written journal entry? I can help guide your writing!`
                            }]);

                            // Add AI-generated tags
                            if (analysis.tags) {
                              setTags(prev => [...new Set([...prev, ...analysis.tags])]);
                            } else {
                              setTags(prev => [...new Set([...prev, 'voice-recording', 'spoken-thoughts', 'audio-journal'])]);
                            }
                          } else {
                            throw new Error('Analysis failed');
                          }
                        } catch (error) {
                          console.error('Audio analysis error:', error);
                          // Fallback to basic response if analysis fails
                          const durationText = latestRecording?.duration ? `${Math.floor(latestRecording.duration / 1000)}s` : 'Unknown duration';
                          setAiMessages(prev => [...prev.slice(0, -1), {
                            type: 'ai',
                            message: `🎵 **Audio Recording Detected!**

🎙️ **Recording Duration:** ${durationText}

💭 **Analysis:** I can detect your voice recording! While I can't fully process the audio content right now, I can help you with journal prompts.

✨ **Journal Prompts based on your recording:**
1. What thoughts were going through your mind when you made this recording?
2. How did speaking out loud make you feel compared to writing?
3. What story does your voice tell about your current mood?
4. If you could expand on what you recorded, what would you add?
5. How does your voice recording reflect your personality today?

💡 Ready to turn your voice recording into a beautiful written journal entry? I can help guide your writing!`
                          }]);

                          // Add audio-related tags even on error
                          setTags(prev => [...new Set([...prev, 'voice-recording', 'spoken-thoughts', 'audio-journal'])]);
                        }
                      }
                    }}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Mic className="w-3 h-3 mr-1" />
                    Audio Help
                  </Button>
                )}
                
                {/* AI Prompt Counter - Clickable to buy more */}
                {promptUsageData && (
                  <Button
                    onClick={() => setShowPromptPurchase(true)}
                    variant="outline"
                    size="sm"
                    className="ml-auto bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-200 hover:border-purple-300 transition-all duration-200"
                    title="Click to purchase more AI prompts ($2.99 for 100 prompts)"
                  >
                    <span className="text-xs font-medium text-purple-700">
                      ✨ {(promptUsageData as any)?.promptsRemaining || 0}/100
                    </span>
                  </Button>
                )}
                {photos.length > 0 && (
                  <Button 
                    onClick={async () => {
                      // Analyze the latest photo
                      const latestPhoto = photos[photos.length - 1];
                      if (latestPhoto?.src) {
                        // Show analyzing message
                        setAiMessages(prev => [...prev, {
                          type: 'user',
                          message: '📸 Please analyze this photo and tell me what you see!',
                          photoUrl: latestPhoto.src
                        }]);
                        
                        setAiMessages(prev => [...prev, {
                          type: 'ai',
                          message: '🔍 Analyzing your photo in detail...'
                        }]);

                        try {
                          const isStorageUrl = latestPhoto.src && !latestPhoto.src.startsWith('data:');
                          
                          const response = await fetch('/api/ai/analyze-photo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ 
                              photoUrl: isStorageUrl ? latestPhoto.src : undefined,
                              base64Image: isStorageUrl ? undefined : latestPhoto.src.split(',')[1],
                              currentMood: mood 
                            })
                          });

                          if (response.ok) {
                            const analysis = await response.json();
                            
                            // Update photo with analysis
                            setPhotos(prev => prev.map(p => 
                              p.id === latestPhoto.id ? { ...p, analysis } : p
                            ));
                            
                            // Add detailed analysis message
                            const analysisMessage = `📸 **Photo Analysis Complete!**

🖼️ **What I see:** ${analysis.description}

🎭 **Emotions & Mood:** ${analysis.emotions?.join(', ') || 'Peaceful, content'}

👥 **People:** ${analysis.people?.length > 0 ? analysis.people.join(', ') : 'No people detected'}

🏷️ **Key Objects:** ${analysis.objects?.join(', ') || 'Various interesting elements'}

🌈 **Colors & Setting:** ${analysis.colors || 'Rich, vibrant tones'}

✨ **Writing Prompts for you:**
${analysis.journalPrompts?.map((prompt: string, i: number) => `${i + 1}. ${prompt}`).join('\n') || '1. What story does this image tell?\n2. How does this moment make you feel?\n3. What memories does this bring up?'}

💭 Ready to write about this photo? I can help you craft the perfect journal entry!`;

                            setAiMessages(prev => [...prev.slice(0, -1), {
                              type: 'ai',
                              message: analysisMessage
                            }]);

                            // Add AI-generated tags
                            if (analysis.tags) {
                              setTags(prev => [...new Set([...prev, ...analysis.tags])]);
                            }
                          } else {
                            setAiMessages(prev => [...prev.slice(0, -1), {
                              type: 'ai',
                              message: '😅 I had trouble analyzing your photo, but it looks amazing! Tell me what you see and I can help you write about it.'
                            }]);
                          }
                        } catch (error) {
                          console.error('Photo analysis failed:', error);
                          setAiMessages(prev => [...prev.slice(0, -1), {
                            type: 'ai',
                            message: '🤔 Photo analysis isn\'t working right now, but I can still see your photo! Describe what\'s in it and I\'ll help you write a great journal entry.'
                          }]);
                        }
                      }
                    }}
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



        {/* Voice Recording Status */}
        {isListening && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Recording... Speak now!</span>
            </div>
          </div>
        )}

        {/* Conversation Mode Status */}
        {isConversationMode && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg z-50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Conversation Mode Active</span>
              <Button
                onClick={stopVoiceInput}
                size="sm"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-500 h-6 px-2 text-xs"
              >
                Stop
              </Button>
            </div>
          </div>
        )}

        {/* Usage Warning Dialog */}
        <AlertDialog open={showUsageWarning} onOpenChange={setShowUsageWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>🎤 Full Conversation Mode</AlertDialogTitle>
              <AlertDialogDescription>
                You're about to enter full conversation mode where I'll respond to everything you say. 
                This uses AI prompts continuously and can burn through your credits quickly.
                <br /><br />
                <strong>Your current usage:</strong> {promptUsage ? (
                  <>
                    You have <span className="text-green-600 font-semibold">{promptUsage.promptsRemaining}</span> AI prompts remaining.
                    <br />
                    You've used <span className="text-orange-600 font-semibold">{promptUsage.promptsUsedThisMonth}</span> prompts this month.
                  </>
                ) : (
                  'Loading usage data...'
                )}
                <br /><br />
                Would you like to continue or purchase more AI prompts?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowUsageWarning(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={startConversationMode}>
                Continue Conversation
              </AlertDialogAction>
              <AlertDialogAction onClick={() => window.location.href = '/upgrade'}>
                Buy More Prompts
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Camera Modal */}
        <AlertDialog open={showCameraModal} onOpenChange={setShowCameraModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>📷 Camera Options</AlertDialogTitle>
              <AlertDialogDescription>
                Choose how you'd like to capture media for your journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Button 
                onClick={takeCameraPhoto}
                className="flex items-center gap-3 h-12 justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                variant="outline"
              >
                <Camera className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Take Photo</div>
                  <div className="text-xs opacity-75">Capture a moment instantly</div>
                </div>
              </Button>
              
              <Button 
                onClick={startVideoRecording}
                className="flex items-center gap-3 h-12 justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                variant="outline"
              >
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Record Video</div>
                  <div className="text-xs opacity-75">Up to 30 seconds</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 h-12 justify-start bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                variant="outline"
              >
                <div className="flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Upload from Gallery</div>
                  <div className="text-xs opacity-75">Choose photos & videos</div>
                </div>
              </Button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCameraModal(false)}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Prompt Purchase Modal */}
        <AlertDialog open={showPromptPurchase} onOpenChange={setShowPromptPurchase}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Purchase AI Prompts
              </AlertDialogTitle>
              <AlertDialogDescription>
                Get more AI-powered features for your journaling experience
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <PromptPurchase />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowPromptPurchase(false)}>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>



      </motion.div>
    </motion.div>
  );
}