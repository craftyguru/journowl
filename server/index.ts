import dotenv from "dotenv";
dotenv.config();

// Only log Stripe key in development for security
if (process.env.NODE_ENV === "development") {
  console.log("STRIPE_SECRET_KEY loaded:", process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...");
}
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
  } else if (req.path.endsWith('.js') || req.path.includes('/assets/') && req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.path.endsWith('.css') || req.path.includes('/assets/') && req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
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

  // Serve PWA static files in development and production
  app.use('/manifest.json', express.static('client/public/manifest.json'));
  app.use('/service-worker.js', express.static('client/public/service-worker.js'));
  app.use('/offline.html', express.static('client/public/offline.html'));
  app.use('/icons', express.static('client/public/icons'));
  app.use('/adaptive-card.json', express.static('client/public/adaptive-card.json'));
  app.use('/stats-card.json', express.static('client/public/stats-card.json'));
  
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
  
  // Check if dist/public exists to determine if we should serve static files
  const fs = await import("fs");
  const path = await import("path");
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  
  // CHOOSE ONE MODE - NEVER MIX DEV AND PRODUCTION
  if (process.env.NODE_ENV === "production") {
    console.log("Production mode: serving static files from dist/public");
    
    if (!fs.existsSync(distPath)) {
      throw new Error(`Build files not found at ${distPath}. Run 'npm run build' first.`);
    }
    
    // Production: Only serve static files
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));

    // SPA fallback - only serve index.html for routes, NOT for assets
    app.get("*", (req, res) => {
      // Don't serve index.html for asset requests
      if (req.path.startsWith("/assets/") || 
          req.path.endsWith(".js") || 
          req.path.endsWith(".css") || 
          req.path.endsWith(".png") || 
          req.path.endsWith(".ico") || 
          req.path.endsWith(".json")) {
        res.status(404).end();
        return;
      }
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    console.log("Development mode: using Vite development server");
    // Development: Only use Vite dev server
    await setupVite(app, server);
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
