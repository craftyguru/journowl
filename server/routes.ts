import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateJournalPrompt, generatePersonalizedPrompt, generateInsight } from "./services/openai";
import { createUser, authenticateUser } from "./services/auth";
import { insertUserSchema, insertJournalEntrySchema } from "@shared/schema";
import { EmailService } from "./email";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { setupOAuth, passport } from "./oauth";

// Extend session types
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const PgSession = ConnectPgSimple(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware with PostgreSQL store
  app.use(session({
    store: new PgSession({
      conString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }));

  // Initialize Passport OAuth
  setupOAuth();
  app.use(passport.initialize());
  app.use(passport.session());

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
      
      // Initialize user progress tracking
      try {
        await storage.createUserStats(user.id);
        const { AchievementTracker } = await import("./services/achievement-tracker");
        await AchievementTracker.initializeUserProgress(user.id);
      } catch (initError) {
        console.error('Failed to initialize user progress:', initError);
      }
      
      // Send welcome email
      try {
        await EmailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }
      
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp, role: user.role } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authenticateUser(email, password);
      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp, role: user.role } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.redirect('/');
      }
      res.redirect('/');
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        user: {
          id: user.id, 
          email: user.email, 
          username: user.username, 
          level: user.level, 
          xp: user.xp, 
          role: user.role 
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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

  // OAuth Routes
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth?error=google_failed' }),
    async (req: any, res) => {
      req.session.userId = req.user.id;
      
      // Send welcome email for new users and create initial data
      if (req.user.createdAt && new Date().getTime() - new Date(req.user.createdAt).getTime() < 60000) {
        // Create initial user stats
        try {
          await storage.createUserStats(req.user.id);
        } catch (statsError) {
          console.error('Failed to create user stats:', statsError);
        }
        
        // Create welcome achievement
        try {
          await storage.createAchievement({
            userId: req.user.id,
            title: "Welcome to JournOwl!",
            description: "You've taken your first step on the journey to wise journaling",
            icon: "🦉",
            category: "getting_started",
            rarity: "common",
            xpReward: 100,
            unlockedAt: new Date()
          });
        } catch (achievementError) {
          console.error('Failed to create welcome achievement:', achievementError);
        }
        
        await EmailService.sendWelcomeEmail(req.user);
      }
      
      res.redirect('/dashboard');
    }
  );

  app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth?error=facebook_failed' }),
    async (req: any, res) => {
      req.session.userId = req.user.id;
      
      if (req.user.createdAt && new Date().getTime() - new Date(req.user.createdAt).getTime() < 60000) {
        // Create initial user stats
        try {
          await storage.createUserStats(req.user.id);
        } catch (statsError) {
          console.error('Failed to create user stats:', statsError);
        }
        
        // Create welcome achievement
        try {
          await storage.createAchievement({
            userId: req.user.id,
            title: "Welcome to JournOwl!",
            description: "You've taken your first step on the journey to wise journaling",
            icon: "🦉",
            category: "getting_started",
            rarity: "common",
            xpReward: 100,
            unlockedAt: new Date()
          });
        } catch (achievementError) {
          console.error('Failed to create welcome achievement:', achievementError);
        }
        
        await EmailService.sendWelcomeEmail(req.user);
      }
      
      res.redirect('/dashboard');
    }
  );

  app.get('/api/auth/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/auth?error=linkedin_failed' }),
    async (req: any, res) => {
      req.session.userId = req.user.id;
      
      if (req.user.createdAt && new Date().getTime() - new Date(req.user.createdAt).getTime() < 60000) {
        // Create initial user stats
        try {
          await storage.createUserStats(req.user.id);
        } catch (statsError) {
          console.error('Failed to create user stats:', statsError);
        }
        
        // Create welcome achievement
        try {
          await storage.createAchievement({
            userId: req.user.id,
            title: "Welcome to JournOwl!",
            description: "You've taken your first step on the journey to wise journaling",
            icon: "🦉",
            category: "getting_started",
            rarity: "common",
            xpReward: 100,
            unlockedAt: new Date()
          });
        } catch (achievementError) {
          console.error('Failed to create welcome achievement:', achievementError);
        }
        
        await EmailService.sendWelcomeEmail(req.user);
      }
      
      res.redirect('/dashboard');
    }
  );

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp, role: user.role } });
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
      
      // Track the journal entry for achievements and goals
      const { AchievementTracker } = await import("./services/achievement-tracker");
      await AchievementTracker.trackJournalEntry(req.session.userId, entry);
      
      // Track mood if provided
      if (entry.mood) {
        await AchievementTracker.trackMoodEntry(req.session.userId, entry.mood);
      }
      
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

  // Stats endpoint
  app.get("/api/stats", requireAuth, async (req: any, res) => {
    try {
      let stats = await storage.getUserStats(req.session.userId);
      
      // Create stats if they don't exist
      if (!stats) {
        stats = await storage.createUserStats(req.session.userId);
      }
      
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Achievements endpoint
  app.get("/api/achievements", requireAuth, async (req: any, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.session.userId);
      res.json({ achievements });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Insights endpoint
  app.get("/api/insights", requireAuth, async (req: any, res) => {
    try {
      const entries = await storage.getJournalEntries(req.session.userId, 10);
      const stats = await storage.getUserStats(req.session.userId);
      
      // Generate basic insights based on user data
      const insights = [];
      
      if (entries.length === 0) {
        insights.push("Welcome to JournOwl! Start your first entry to unlock personalized insights.");
        insights.push("Regular journaling helps improve mental clarity and emotional well-being.");
        insights.push("Try writing about what you're grateful for today.");
      } else {
        if (stats?.currentStreak && stats.currentStreak > 0) {
          insights.push(`Great job! You're on a ${stats.currentStreak}-day writing streak. Keep it going!`);
        }
        
        if (stats?.totalWords && stats.totalWords > 1000) {
          insights.push(`You've written ${stats.totalWords.toLocaleString()} words so far. That's impressive progress!`);
        }
        
        if (entries.length >= 5) {
          insights.push("You're developing a consistent journaling habit. This self-reflection practice is valuable for personal growth.");
        }
        
        if (stats?.averageMood && stats.averageMood > 4) {
          insights.push("Your average mood is quite positive! Journaling might be helping you maintain a good outlook.");
        }
      }
      
      // Add wisdom prompts
      insights.push("🦉 Owl Wisdom: Regular reflection helps you understand patterns in your thoughts and emotions.");
      
      res.json({ insights });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get goals endpoint
  app.get('/api/goals', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const goals = await storage.getUserGoals(userId);
      const stats = await storage.getUserStats(userId);
      
      // Calculate progress for each goal based on current user stats
      const goalsWithProgress = goals.map(goal => {
        let currentValue = 0;
        let progress = 0;
        
        switch (goal.type) {
          case 'streak':
            currentValue = stats?.currentStreak || 0;
            break;
          case 'entries':
            currentValue = stats?.totalEntries || 0;
            break;
          case 'words':
            currentValue = stats?.totalWords || 0;
            break;
          case 'days':
            currentValue = stats?.totalEntries || 0; // Active days based on entries
            break;
          default:
            currentValue = 0;
        }
        
        progress = Math.min(100, Math.round((currentValue / goal.targetValue) * 100));
        
        return {
          ...goal,
          currentValue,
          progress,
          isCompleted: currentValue >= goal.targetValue
        };
      });
      
      res.json({ goals: goalsWithProgress });
    } catch (error: any) {
      console.error('Error getting goals:', error);
      res.status(500).json({ message: 'Failed to get goals' });
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

  app.post("/api/ai/generate-prompt", async (req: any, res) => {
    try {
      const { recentEntries, mood } = req.body;
      const prompt = await generatePersonalizedPrompt(recentEntries || []);
      res.json({ prompt });
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      res.status(500).json({ message: "Failed to generate prompt" });
    }
  });

  app.post("/api/ai/chat", async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      // Build context for AI
      let systemPrompt = `You are an AI writing assistant helping someone with their personal journal. Be supportive, insightful, and encouraging. Help them explore their thoughts and feelings deeper.

Current journal context:
- Title: ${context.title || 'Untitled'}
- Mood: ${context.mood}
- Current content: ${context.currentContent || 'No content yet'}`;

      if (context.photos && context.photos.length > 0) {
        systemPrompt += `\n- Photos analyzed: ${context.photos.map((p: any) => p.description).join(', ')}`;
      }

      systemPrompt += `\n\nRespond naturally and helpfully. Ask follow-up questions, suggest writing prompts, or help them reflect on their experiences. Keep responses under 150 words.`;

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.json({ 
          reply: "I'm sorry, but I need an OpenAI API key to provide intelligent responses. Please contact the administrator to set up the API key, or I can help you with basic writing prompts!" 
        });
      }

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
        const errorData = await response.text();
        console.error(`OpenAI API error: ${response.status} - ${errorData}`);
        
        // Provide helpful fallback responses based on the message
        const fallbackResponses = {
          "hello": "Hello! I'm your AI writing assistant. While I'm having trouble connecting to my main AI service right now, I can still help you brainstorm ideas for your journal. What would you like to write about today?",
          "help": "I'd love to help you with your journal! Even though my main AI is temporarily unavailable, I can suggest some great writing prompts: Try writing about your favorite memory from this week, or describe what made you smile today.",
          "ideas": "Here are some writing ideas to get you started: 1) Write about someone who inspired you recently, 2) Describe a place that makes you feel peaceful, 3) What's one thing you're grateful for today?",
          "default": "I'm having trouble connecting to my AI service right now, but I'm still here to help! Try writing about your day, your feelings, or anything on your mind. Sometimes the best journal entries come from just letting your thoughts flow freely."
        };
        
        const lowerMessage = message.toLowerCase();
        let fallback = fallbackResponses.default;
        
        for (const [key, response] of Object.entries(fallbackResponses)) {
          if (lowerMessage.includes(key)) {
            fallback = response;
            break;
          }
        }
        
        return res.json({ reply: fallback });
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
  app.post("/api/ai/analyze-photo", async (req: any, res) => {
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
      let stats = await storage.getUserStats(req.session.userId);
      
      // Create initial stats if they don't exist
      if (!stats) {
        stats = await storage.createUserStats(req.session.userId);
      }
      
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Achievement routes
  app.get("/api/achievements", requireAuth, async (req: any, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.session.userId);
      res.json({ achievements });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  };

  // Admin Routes
  app.get("/api/admin/users", requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users: users.map(u => ({ ...u, password: undefined })) });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/analytics", requireAdmin, async (req: any, res) => {
    try {
      const totalUsers = await storage.getAllUsers();
      const activeUsers = await storage.getActiveUsers();
      const recentLogs = await storage.getUserActivityLogs(undefined, 50);
      
      res.json({
        totalUsers: totalUsers.length,
        activeUsers: activeUsers.length,
        recentActivity: recentLogs
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Email Campaign Routes
  app.get("/api/admin/email-campaigns", requireAdmin, async (req: any, res) => {
    try {
      const campaigns = await storage.getEmailCampaigns();
      res.json({ campaigns });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/email-campaigns", requireAdmin, async (req: any, res) => {
    try {
      const { title, subject, content, htmlContent, targetAudience } = req.body;
      const campaign = await storage.createEmailCampaign({
        title,
        subject,
        content,
        htmlContent,
        targetAudience,
        createdBy: req.session.userId
      });
      res.json({ campaign });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/email-campaigns/:id/send", requireAdmin, async (req: any, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const result = await EmailService.sendEmailCampaign(campaignId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Site Settings Routes
  app.get("/api/admin/settings", requireAdmin, async (req: any, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({ settings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/settings/:key", requireAdmin, async (req: any, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      await storage.updateSiteSetting(key, value, req.session.userId);
      res.json({ message: "Setting updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Announcements Routes
  app.post("/api/admin/announcements", requireAdmin, async (req: any, res) => {
    try {
      const { title, content, type, targetAudience, expiresAt } = req.body;
      const announcement = await storage.createAnnouncement({
        title,
        content,
        type,
        targetAudience,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        createdBy: req.session.userId
      });
      res.json({ announcement });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/announcements", async (req: any, res) => {
    try {
      const announcements = await storage.getActiveAnnouncements('all');
      res.json({ announcements });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI-powered kid prompts endpoint
  app.post("/api/ai/kid-prompts", async (req, res) => {
    try {
      const { content, mood, hasPhotos, photoCount } = req.body;
      
      // Kid-friendly AI prompt generation
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a friendly AI writing assistant for kids aged 6-12. Generate 3-4 fun, encouraging writing prompts based on what the child has written and their mood. Make prompts:
              - Age-appropriate and positive
              - Creative and imaginative 
              - Related to their current content/mood
              - Encouraging and fun
              - Short and easy to understand
              Keep language simple and exciting!`
            },
            {
              role: "user",
              content: `Current mood: ${mood}
              What they've written so far: "${content || 'Nothing yet'}"
              ${hasPhotos ? `They've added ${photoCount} photos to their story.` : ''}
              
              Generate fun writing prompts to help them continue their story!`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      res.json({ 
        prompts: result.prompts || [
          "What happened next in your adventure?",
          "How did this make you feel inside?",
          "What would you tell your best friend about this?",
          "If you could do this again, what would you change?"
        ]
      });
    } catch (error) {
      console.error("AI prompt generation error:", error);
      res.json({ 
        prompts: [
          "What happened next in your adventure?",
          "How did this make you feel inside?",
          "What would you tell your best friend about this?",
          "If you could do this again, what would you change?"
        ]
      });
    }
  });

  // Support message routes
  app.post("/api/support/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { message, attachmentUrl, attachmentType } = req.body;
      
      const supportMessage = await storage.createSupportMessage({
        userId,
        message,
        sender: 'user',
        attachmentUrl,
        attachmentType
      });
      
      res.json(supportMessage);
    } catch (error) {
      console.error("Error creating support message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/support/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const messages = await storage.getSupportMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching support messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Admin support routes
  app.get("/api/admin/support/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const messages = await storage.getAllSupportMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching admin support messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/admin/support/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { userId: targetUserId, message, attachmentUrl, attachmentType } = req.body;
      
      const supportMessage = await storage.createSupportMessage({
        userId: targetUserId,
        message,
        sender: 'admin',
        attachmentUrl,
        attachmentType,
        adminName: user.username
      });
      
      res.json(supportMessage);
    } catch (error) {
      console.error("Error creating admin support message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
