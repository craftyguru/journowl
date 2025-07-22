import dotenv from "dotenv";
dotenv.config();
console.log("STRIPE_SECRET_KEY loaded:", process.env.STRIPE_SECRET_KEY);
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// PWA MIME type middleware - CRITICAL for PWABuilder compatibility
app.use((req, res, next) => {
  // Set correct MIME types for PWA files
  if (req.path === '/manifest.json' || req.path.startsWith('/manifest.json')) {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Force refresh for PWABuilder
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else if (req.path.endsWith('.png') && req.path.includes('/icons/')) {
    res.setHeader('Content-Type', 'image/png');
  } else if (req.path === '/service-worker.js') {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.path === '/adaptive-card.json' || req.path === '/stats-card.json') {
    res.setHeader('Content-Type', 'application/json');
  } else if (req.path === '/offline.html') {
    res.setHeader('Content-Type', 'text/html');
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Add a simple test route to verify server is working
  app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "JournOwl server is running!", timestamp: new Date().toISOString() });
  });

  // Remove the root route override - let Vite handle everything in development

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development" || process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    try {
      serveStatic(app);
    } catch (error) {
      console.warn("Static files not found, falling back to development mode");
      await setupVite(app, server);
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
