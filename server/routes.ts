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
