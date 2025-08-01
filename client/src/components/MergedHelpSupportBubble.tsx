import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, HelpCircle, MessageCircle, User, ChevronLeft, ChevronRight, X, Paperclip, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SupportMessage {
  id: number;
  userId: number;
  message: string;
  sender: 'user' | 'admin';
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video';
  createdAt: string;
  adminName?: string;
}

const tourSteps = [
  {
    title: "Welcome to JournOwl! 🦉",
    content: "I'm your AI companion here to help you discover the magic of journaling. Let's take a quick tour of your new digital sanctuary!"
  },
  {
    title: "📚 Your Journal Book",
    content: "Click 'Open Journal Book' to access your unified writing space with AI analysis, photo uploads, mood tracking, and beautiful customization options."
  },
  {
    title: "📅 Memory Calendar",
    content: "Your calendar tab shows all your journal entries organized by date, with mood indicators and quick previews."
  },
  {
    title: "🎯 Goals & Achievements",
    content: "Set writing goals, track your streaks, and unlock achievements as you build your journaling habit!"
  },
  {
    title: "📊 Analytics & Insights", 
    content: "View detailed analytics about your writing patterns, mood trends, and get AI-powered insights about your entries."
  },
  {
    title: "📚 AI Stories",
    content: "Transform your journal entries into creative content like poems, letters, social posts, and more with AI assistance."
  },
  {
    title: "🎁 Referral Program",
    content: "Share JournOwl with friends and family to unlock premium features and rewards!"
  },
  {
    title: "✨ Ready to Begin!",
    content: "You're all set! Click 'Open Journal Book' or the floating + button to write your first entry and begin your JournOwl journey!"
  }
];

export function MergedHelpSupportBubble() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("help");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  // Get current user for WebSocket auth
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  }) as { data: any };

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Help Tour Navigation
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTour = () => {
    setCurrentStep(0);
  };

  // WebSocket connection for support chat
  const connectWebSocket = () => {
    if (!currentUser?.id) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/support`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Support WebSocket connected');
        setIsConnected(true);
        // Authenticate user immediately on connection
        ws.send(JSON.stringify({
          type: 'auth',
          userId: currentUser.id,
          isAdmin: false
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received support message:', data);
          
          if (data.type === 'new_message') {
            setMessages(prev => [...prev, data.message]);
          } else if (data.type === 'typing') {
            setIsTyping(data.isTyping);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Support WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (currentUser?.id) {
            connectWebSocket();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('Support WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  // Initialize support chat when tab is switched
  useEffect(() => {
    if (activeTab === 'support' && currentUser?.id && !wsRef.current) {
      loadSupportMessages();
      connectWebSocket();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [activeTab, currentUser]);

  // Load existing support messages
  const loadSupportMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/support/messages', {
        credentials: 'include'
      });
      const data = await response.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading support messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send support message
  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;
    
    console.log('Attempting to send message. WebSocket state:', wsRef.current?.readyState);
    console.log('WebSocket OPEN constant:', WebSocket.OPEN);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'chat_message',
        userId: currentUser.id,
        message: message.trim(),
        sender: 'user',
        createdAt: new Date().toISOString()
      };
      
      console.log('Sending message:', messageData);
      wsRef.current.send(JSON.stringify(messageData));
      setMessage('');
    } else {
      console.log('WebSocket not ready. Attempting to reconnect...');
      connectWebSocket();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        console.error('Upload failed:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const sendMessageWithFile = async () => {
    if (!currentUser || (!message.trim() && !selectedFile)) return;
    
    let attachmentUrl = null;
    let attachmentType = null;
    
    if (selectedFile) {
      attachmentUrl = await uploadFile(selectedFile);
      if (!attachmentUrl) {
        alert('Failed to upload file. Please try again.');
        return;
      }
      attachmentType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'chat_message',
        userId: currentUser.id,
        message: message.trim() || `Sent ${selectedFile?.name}`,
        sender: 'user',
        attachmentUrl,
        attachmentType,
        createdAt: new Date().toISOString()
      };
      
      wsRef.current.send(JSON.stringify(messageData));
      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300"
          >
            <div className="flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
          </motion.button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md h-[600px] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              Help & Support
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-4">
              <TabsTrigger value="help" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help Tour
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="help" className="flex-1 p-4 pt-2">
              <div className="h-full flex flex-col">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 flex-1">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🦉</div>
                    <div className="text-sm text-gray-500 mb-2">Step {currentStep + 1} of {tourSteps.length}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {tourSteps[currentStep].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tourSteps[currentStep].content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetTour}
                      className="text-gray-500"
                    >
                      Restart
                    </Button>
                    
                    {currentStep < tourSteps.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      >
                        Start Journaling!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="flex-1 flex flex-col p-4 pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-600 mb-2">Welcome to Support!</h3>
                      <p className="text-sm text-gray-500">Send a message and our team will help you right away.</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {msg.sender === 'admin' && (
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs">
                                  {msg.adminName ? msg.adminName[0].toUpperCase() : 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {msg.adminName || 'Support Team'}
                              </span>
                            </div>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          {msg.attachmentUrl && (
                            <div className="mt-2">
                              {msg.attachmentType === 'image' ? (
                                <img 
                                  src={msg.attachmentUrl} 
                                  alt="Attachment" 
                                  className="max-w-full h-auto rounded-lg border border-white/20"
                                />
                              ) : (
                                <a 
                                  href={msg.attachmentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs underline hover:opacity-80"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  View File
                                </a>
                              )}
                            </div>
                          )}
                          <div className={`text-xs mt-1 opacity-70 ${
                            msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-xs text-gray-500">Support is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-2">
                {/* File upload preview */}
                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeSelectedFile}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          selectedFile ? sendMessageWithFile() : sendMessage();
                        }
                      }}
                      className="flex-1"
                      disabled={!isConnected}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      disabled={!isConnected}
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={selectedFile ? sendMessageWithFile : sendMessage} 
                    disabled={(!message.trim() && !selectedFile) || !isConnected}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Our support team typically responds within a few minutes
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}