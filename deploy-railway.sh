#!/bin/bash

# Railway Deployment Script with PWA Auto-Update Support
# This script ensures your native Android PWA auto-updates when deployed to Railway

echo "🚀 Starting Railway Deployment with PWA Auto-Update..."

# Step 1: Update build timestamp for PWA cache busting
echo "📅 Updating build timestamp..."
node update-build-timestamp.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to update build timestamp"
    exit 1
fi

# Step 2: Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Railway deployment ready!"
echo ""
echo "📱 PWA Auto-Update Features:"
echo "   • Service worker will force cache refresh"
echo "   • Build timestamp: $(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"
echo "   • Native Android apps will auto-update within 15 minutes"
echo "   • Users will see update notifications"
echo ""
echo "🔄 To force immediate PWA updates:"
echo "   npm run force-update"
echo ""
echo "📋 Railway Environment Variables Needed:"
echo "   • GOOGLE_CLIENT_ID (for OAuth)"
echo "   • GOOGLE_CLIENT_SECRET (for OAuth)"  
echo "   • FACEBOOK_APP_ID (for OAuth)"
echo "   • FACEBOOK_APP_SECRET (for OAuth)"
echo "   • OPENAI_API_KEY (for AI features)"
echo "   • DATABASE_URL (already provided by Railway)"
echo ""
echo "🌐 After deployment, update OAuth redirect URLs to:"
echo "   • https://YOUR_RAILWAY_DOMAIN/auth/google/callback"
echo "   • https://YOUR_RAILWAY_DOMAIN/auth/facebook/callback"