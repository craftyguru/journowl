import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Send, Paperclip, Image, Video, Smile, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export function SupportChatBubble() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  // Get current user for WebSocket auth
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  }) as { data: any };

  // Initialize WebSocket connection when chat opens
  useEffect(() => {
    if (open && currentUser?.id && !wsRef.current) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/support`;
      
      console.log('Connecting to support WebSocket:', wsUrl, 'for user:', currentUser.id);
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Support WebSocket connected for user:', currentUser.id);
        setIsConnected(true);
        
        // Authenticate user immediately on connection
        const authMessage = {
          type: 'auth',
          userId: currentUser.id,
          isAdmin: false
        };
        console.log('Sending auth message:', authMessage);
        wsRef.current?.send(JSON.stringify(authMessage));
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, data.message]);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('Support WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
      };
      
      wsRef.current.onerror = (error) => {
        console.error('Support WebSocket error:', error);
        setIsConnected(false);
      };
    }
    
    return () => {
      if (!open && wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
    };
  }, [open, currentUser]);

  // Fetch initial messages when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setIsLoading(true);
      fetch('/api/support/messages', {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        setMessages(data || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      });
    }
  }, [open]);

  // Send message via WebSocket
  const sendMessage = async (messageData: { message: string; attachmentUrl?: string; attachmentType?: string }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentUser?.id) {
      console.log('Sending WebSocket message from user:', currentUser.id);
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        userId: currentUser.id,
        message: messageData.message,
        sender: 'user',
        attachmentUrl: messageData.attachmentUrl,
        attachmentType: messageData.attachmentType
      }));
      setMessage("");
    } else {
      console.log('Falling back to HTTP API for message');
      // Fallback to HTTP if WebSocket not available
      await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messageData)
      });
      setMessage("");
      // Refresh messages
      const response = await fetch('/api/support/messages', { credentials: 'include' });
      const data = await response.json();
      setMessages(data || []);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    await sendMessage({ message });
    setIsTyping(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would typically upload to your storage service
    // For now, we'll simulate with a placeholder
    const attachmentUrl = URL.createObjectURL(file);
    const attachmentType = file.type.startsWith('image/') ? 'image' : 'video';
    
    sendMessage({
      message: `Sent a ${attachmentType}`,
      attachmentUrl,
      attachmentType
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed right-2 sm:right-4 bottom-4 z-50 group">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-tr from-blue-400 to-green-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl border-4 border-white relative overflow-hidden"
        onClick={() => setOpen(!open)}
        aria-label="Support Chat"
      >
        <motion.div
          animate={{ 
            background: [
              "linear-gradient(135deg, #3b82f6, #10b981)",
              "linear-gradient(135deg, #10b981, #06b6d4)",
              "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              "linear-gradient(135deg, #8b5cf6, #3b82f6)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0"
        />
        <span className="relative z-10">💬</span>
        
        {/* Notification badge for new messages */}
        {((messages as any) || []).some((msg: SupportMessage) => msg.sender === 'admin' && !msg.adminName) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            !
          </motion.div>
        )}
        
        {/* Pulsing ring animation */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-blue-400 opacity-20"
        />
      </motion.button>
      
      {/* Custom Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          💬 Support Chat
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className="absolute right-0 sm:right-20 bottom-0 w-[95vw] max-w-sm sm:w-96"
          >
            <Card className="shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-600 opacity-10" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                      💬
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        Support Chat
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {isConnected ? 'Online' : 'Connecting...'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages container */}
                <div className="h-60 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (messages as any)?.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🦉</div>
                      <h3 className="font-semibold text-gray-800 mb-2">Welcome to JournOwl Support!</h3>
                      <p className="text-gray-600 text-sm">
                        Hi there! I'm here to help with any questions about your journaling journey. 
                        Feel free to ask about features, troubleshooting, or just say hello!
                      </p>
                    </div>
                  ) : (
                    ((messages as any) || []).map((msg: SupportMessage) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-xl ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {msg.sender === 'admin' && (
                            <div className="text-xs text-gray-600 mb-1 font-semibold">
                              JournOwl Support
                            </div>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          
                          {msg.attachmentUrl && (
                            <div className="mt-2">
                              {msg.attachmentType === 'image' ? (
                                <img 
                                  src={msg.attachmentUrl} 
                                  alt="Attachment"
                                  className="rounded-lg max-w-full h-auto"
                                />
                              ) : (
                                <video 
                                  src={msg.attachmentUrl}
                                  className="rounded-lg max-w-full h-auto"
                                  controls
                                />
                              )}
                            </div>
                          )}
                          
                          <div className={`text-xs mt-1 flex items-center gap-1 ${
                            msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {formatMessageTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-xs text-gray-600 ml-2">Typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Mobile-Optimized Message input */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="pr-10 text-sm sm:text-base"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isTyping}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 sm:px-4"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2"
                    >
                      <Image className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Photo</span>
                      <span className="sm:hidden">📷</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2"
                    >
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Video</span>
                      <span className="sm:hidden">🎥</span>
                    </Button>
                    <div className="text-xs text-gray-500 ml-auto">
                      <span className="hidden sm:inline">We typically reply within minutes!</span>
                      <span className="sm:hidden">Quick reply!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}