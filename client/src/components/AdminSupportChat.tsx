import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Users, MessageCircle, Clock, User } from "lucide-react";
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

interface ChatSession {
  userId: number;
  username: string;
  email: string;
  lastMessage: string;
  unreadCount: number;
  lastActivity: string;
}

export function AdminSupportChat() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  // Get current admin user
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  }) as { data: any };

  // Initialize WebSocket connection for admin
  useEffect(() => {
    if (currentUser?.role === 'admin' && !wsRef.current) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/support`;
      
      console.log('Admin connecting to support WebSocket:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Admin support WebSocket connected');
        setIsConnected(true);
        
        // Authenticate as admin
        wsRef.current?.send(JSON.stringify({
          type: 'auth',
          userId: currentUser.id,
          isAdmin: true
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          const newMessage = data.message;
          setMessages(prev => [...prev, newMessage]);
          
          // Update chat sessions with new message
          setChatSessions(prev => prev.map(session => 
            session.userId === newMessage.userId 
              ? {
                  ...session,
                  lastMessage: newMessage.message.substring(0, 50) + '...',
                  unreadCount: newMessage.sender === 'user' ? session.unreadCount + 1 : session.unreadCount,
                  lastActivity: newMessage.createdAt
                }
              : session
          ));
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('Admin support WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
      };
      
      wsRef.current.onerror = (error) => {
        console.error('Admin support WebSocket error:', error);
        setIsConnected(false);
      };
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
    };
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat sessions and messages
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      // Fetch all support messages for admin view
      fetch('/api/admin/support/messages', {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        setMessages(data || []);
        
        // Create chat sessions from messages
        const sessionsMap = new Map<number, ChatSession>();
        (data || []).forEach((msg: SupportMessage) => {
          if (!sessionsMap.has(msg.userId)) {
            sessionsMap.set(msg.userId, {
              userId: msg.userId,
              username: `User ${msg.userId}`,
              email: '',
              lastMessage: msg.message.substring(0, 50) + '...',
              unreadCount: msg.sender === 'user' ? 1 : 0,
              lastActivity: msg.createdAt
            });
          } else {
            const session = sessionsMap.get(msg.userId)!;
            session.lastMessage = msg.message.substring(0, 50) + '...';
            session.lastActivity = msg.createdAt;
            if (msg.sender === 'user') {
              session.unreadCount += 1;
            }
          }
        });
        
        setChatSessions(Array.from(sessionsMap.values()));
      })
      .catch(error => {
        console.error('Error fetching admin support messages:', error);
      });
    }
  }, [currentUser]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || !currentUser) return;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        userId: selectedUser,
        message: message,
        sender: 'admin',
        adminName: currentUser.username || currentUser.email
      }));
      setMessage("");
    } else {
      // Fallback to HTTP
      await fetch('/api/admin/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUser,
          message: message
        })
      });
      setMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getUserMessages = () => {
    return messages.filter(msg => msg.userId === selectedUser);
  };

  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat Sessions List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Support Chat Sessions
            <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
              {isConnected ? 'Online' : 'Connecting...'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active chat sessions</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {chatSessions.map((session) => (
                  <motion.div
                    key={session.userId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedUser === session.userId 
                        ? 'bg-blue-100 border-2 border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedUser(session.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">
                            {session.username}
                          </p>
                          {session.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              {session.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {session.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(session.lastActivity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {selectedUser ? `Chat with User ${selectedUser}` : 'Select a chat session'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {selectedUser ? (
            <>
              {/* Messages Area */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {getUserMessages().map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === 'admin' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.createdAt)}
                          {msg.sender === 'admin' && msg.adminName && (
                            <span className="ml-2">• {msg.adminName}</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your response..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[450px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">No Chat Selected</p>
                <p>Select a chat session from the left to start responding to users</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}