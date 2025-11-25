import { storage } from "./storage";

export interface ChatMessage {
  id: string;
  userId: number;
  role: "user" | "coach";
  message: string;
  timestamp: Date;
}

class ChatStore {
  private messages: Map<string, ChatMessage> = new Map();
  private messageId = 0;

  addMessage(userId: number, role: "user" | "coach", message: string): ChatMessage {
    const id = `msg_${++this.messageId}`;
    const msg: ChatMessage = { id, userId, role, message, timestamp: new Date() };
    this.messages.set(id, msg);
    return msg;
  }

  getUserChat(userId: number): ChatMessage[] {
    return Array.from(this.messages.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

const chatStore = new ChatStore();

export class CoachingChatService {
  static async getCoachResponse(userId: number, userMessage: string): Promise<string> {
    chatStore.addMessage(userId, "user", userMessage);
    
    const responses: any = {
      "struggling": "That sounds challenging. What's one small thing you can do tomorrow to feel better?",
      "happy": "That's wonderful! How can you capture this feeling in your next entry?",
      "creative": "Your ideas are flowing! Let's channel this into a longer piece.",
      "stuck": "Writer's block is normal. Try a 5-minute sprint - just write freely without judging.",
      "progress": "Amazing growth! What's helped you the most on this journey?",
      "default": "I hear you. Tell me more - what's on your mind?"
    };

    let response = responses.default;
    Object.keys(responses).forEach(key => {
      if (userMessage.toLowerCase().includes(key)) response = responses[key];
    });

    chatStore.addMessage(userId, "coach", response);
    return response;
  }

  static getUserChat(userId: number): ChatMessage[] {
    return chatStore.getUserChat(userId);
  }
}
