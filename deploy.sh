#!/bin/bash

# JournOwl Production Deployment Script
echo "🦉 Building JournOwl for production deployment..."

# Clean previous build
rm -rf dist/

# Build the application
npm run build

echo "✅ Build complete!"
echo "📦 Files ready for deployment:"
ls -la dist/
ls -la dist/public/assets/

echo ""
echo "🔍 Verifying build output..."
echo "Build directory contents:"
find dist/ -type f -name "*.js" -o -name "*.css" | head -10

echo ""
echo "🚀 Ready for Railway deployment!"
echo "💡 Deploy with: railway up"
echo ""
echo "⚠️  CRITICAL: Make sure Railway uses NODE_ENV=production"