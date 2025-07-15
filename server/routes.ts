import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateJournalPrompt, generatePersonalizedPrompt, generateInsight } from "./services/openai";
import { createUser, authenticateUser } from "./services/auth";
import { insertUserSchema, insertJournalEntrySchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend session types
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await createUser(userData);
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authenticateUser(email, password);
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Journal routes
  app.post("/api/journal/entries", requireAuth, async (req: any, res) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry({
        ...entryData,
        userId: req.session.userId,
      });
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/journal/entries", requireAuth, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const entries = await storage.getJournalEntries(req.session.userId, limit);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/journal/entries/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getJournalEntry(id, req.session.userId);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/journal/entries/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const entryData = insertJournalEntrySchema.partial().parse(req.body);
      await storage.updateJournalEntry(id, req.session.userId, entryData);
      res.json({ message: "Entry updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/journal/entries/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJournalEntry(id, req.session.userId);
      res.json({ message: "Entry deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI routes
  app.get("/api/ai/prompt", requireAuth, async (req: any, res) => {
    try {
      const prompt = await generateJournalPrompt();
      res.json({ prompt });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ai/personalized-prompt", requireAuth, async (req: any, res) => {
    try {
      const entries = await storage.getJournalEntries(req.session.userId, 3);
      const entryTexts = entries.map(entry => entry.content);
      const prompt = await generatePersonalizedPrompt(entryTexts);
      res.json({ prompt });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-prompt", requireAuth, async (req: any, res) => {
    try {
      const { recentEntries, mood } = req.body;
      const prompt = await generatePersonalizedPrompt(recentEntries || []);
      res.json({ prompt });
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      res.status(500).json({ message: "Failed to generate prompt" });
    }
  });

  app.post("/api/ai/chat", requireAuth, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      // Build context for AI
      let systemPrompt = `You are an AI writing assistant helping someone with their personal journal. Be supportive, insightful, and encouraging. Help them explore their thoughts and feelings deeper.

Current journal context:
- Title: ${context.title || 'Untitled'}
- Mood: ${context.mood}
- Current content: ${context.currentContent || 'No content yet'}`;

      if (context.photos && context.photos.length > 0) {
        systemPrompt += `\n- Photos analyzed: ${context.photos.map(p => p.description).join(', ')}`;
      }

      systemPrompt += `\n\nRespond naturally and helpfully. Ask follow-up questions, suggest writing prompts, or help them reflect on their experiences. Keep responses under 150 words.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      res.json({ reply });
    } catch (error: any) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.get("/api/ai/insight", requireAuth, async (req: any, res) => {
    try {
      const entries = await storage.getJournalEntries(req.session.userId, 5);
      const entriesWithDates = entries.filter(entry => entry.createdAt).map(entry => ({
        content: entry.content,
        mood: entry.mood,
        createdAt: entry.createdAt!
      }));
      const insight = await generateInsight(entriesWithDates);
      res.json({ insight });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Photo AI routes
  app.post("/api/ai/analyze-photo", requireAuth, async (req: any, res) => {
    try {
      const { base64Image, currentMood } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "Image data required" });
      }

      const { analyzePhoto } = await import("./services/photo-ai");
      const analysis = await analyzePhoto(base64Image);
      res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing photo:", error);
      res.status(500).json({ error: "Failed to analyze photo" });
    }
  });

  app.post("/api/ai/extract-insights", requireAuth, async (req: any, res) => {
    try {
      const { content, mood, photos, tags } = req.body;
      
      const { extractInsightsFromEntry } = await import("./services/photo-ai");
      const insights = await extractInsightsFromEntry({
        content,
        mood,
        photos,
        tags
      });
      
      res.json(insights);
    } catch (error: any) {
      console.error("Error extracting insights:", error);
      res.status(500).json({ error: "Failed to extract insights" });
    }
  });

  // Stats routes
  app.get("/api/stats", requireAuth, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats(req.session.userId);
      const achievements = await storage.getUserAchievements(req.session.userId);
      res.json({ stats, achievements });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
