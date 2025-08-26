// server/index.ts
import dotenv from "dotenv";
dotenv.config();

// Bypass SSL certificate verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";

const app = express();

// ---------- Core middleware ----------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Security + PWA MIME headers (kept tight for PWABuilder compatibility)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Force HTTPS headers when behind a proxy (Railway)
  if (process.env.NODE_ENV === "production" && req.header("x-forwarded-proto") !== "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // CSP (relaxed enough for Vite/prod assets and fonts)
 // Disable CSP in development to prevent preview issues
 if (process.env.NODE_ENV !== 'production') {
   // Very permissive CSP for development/Replit preview
   res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src * ws: wss:; frame-ancestors *;");
 } else {
   res.setHeader('Content-Security-Policy', [
     "default-src 'self' https:",
     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://js.stripe.com",
     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
     "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
     "img-src 'self' data: https: blob:",
     "connect-src 'self' https: wss:",
     "object-src 'none'",
     "frame-ancestors 'self' *.replit.dev *.replit.com",
     "base-uri 'self'"
   ].join('; '));
 }


  // Correct MIME for PWA bits
  const p = req.path;
  if (p === "/manifest.json" || p.startsWith("/manifest.json")) {
    res.setHeader("Content-Type", "application/manifest+json");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  } else if (p === "/service-worker.js") {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "no-cache");
  } else if (p.endsWith(".png") && p.includes("/icons/")) {
    res.setHeader("Content-Type", "image/png");
  } else if (p.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (p.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (p === "/offline.html") {
    res.setHeader("Content-Type", "text/html");
  } else if (p === "/adaptive-card.json" || p === "/stats-card.json") {
    res.setHeader("Content-Type", "application/json");
  }

  next();
});

// Trimmed API access log (keeps console readable)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let captured: unknown;

  const orig = res.json.bind(res);
  (res as any).json = (body: unknown, ...args: any[]) => {
    captured = body;
    return orig(body, ...args);
  };

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;
    const ms = Date.now() - start;
    let line = `${req.method} ${path} ${res.statusCode} in ${ms}ms`;
    if (captured) {
      const s = JSON.stringify(captured);
      if (s && s.length < 120) line += ` :: ${s}`;
    }
    log(line);
  });

  next();
});

(async () => {
  // Mount API routes (and get an http server if your registerRoutes returns one)
  const server = await registerRoutes(app);

  // Health probes
  app.get("/health", (_req, res) => {
    res.json({ status: "OK", message: "JournOwl server is running!", timestamp: new Date().toISOString() });
  });
  app.get("/healthz", (_req, res) => res.status(200).send("ok"));

  // PWA assets from repo (not the Vite build)
  app.use("/manifest.json", express.static("client/public/manifest.json"));
  app.use("/service-worker.js", express.static("client/public/service-worker.js"));
  app.use("/offline.html", express.static("client/public/offline.html"));
  app.use("/icons", express.static("client/public/icons"));
  app.use("/adaptive-card.json", express.static("client/public/adaptive-card.json"));
  app.use("/stats-card.json", express.static("client/public/stats-card.json"));

  // --------- Choose serving mode ----------
  // PRODUCTION: serve built client (auto-detect dist path) + SPA fallback
  // DEVELOPMENT: hand off to Vite dev server
  const fs = await import("fs");
  const path = await import("path");
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  if (process.env.NODE_ENV === "production") {
    const candidates = [
      path.resolve(__dirname, "..", "dist", "public"), // if you ever keep this layout
      path.resolve(__dirname, "..", "dist"), // Vite default
    ];
    const distPath = candidates.find((p) => fs.existsSync(p));

    if (!distPath) {
      throw new Error(
        `Build files not found in any of: ${candidates.join(", ")}. Did you run 'pnpm run build' before deploy?`
      );
    }
    console.log("🔧 Serving static client from:", distPath);

    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".js")) res.setHeader("Content-Type", "application/javascript");
          else if (filePath.endsWith(".css")) res.setHeader("Content-Type", "text/css");
        },
      })
    );

    // SPA history fallback (don’t hijack API or asset requests)
    app.get("*", (req, res, next) => {
      if (
        req.path.startsWith("/api") ||
        req.path.startsWith("/assets/") ||
        req.path.match(/\.(js|css|png|ico|json|svg|jpg|jpeg|webp|txt|map)$/)
      ) {
        return next();
      }
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    console.log("🧪 Development mode: using Vite dev server");
    await setupVite(app, server);
  }

  // Global error handler (after routes/middleware)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    try {
      res.status(status).json({ message });
    } catch {}
    // surface to logs
    console.error(err);
  });

  // Start
  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => log(`🚀 Serving on port ${port} (mode=${process.env.NODE_ENV || "development"})`)
  );
})();
