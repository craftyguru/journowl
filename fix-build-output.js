#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing production build output...');

const distDir = './dist';
const publicDir = './dist/public';

// Check if dist exists
if (!fs.existsSync(distDir)) {
  console.log('❌ No dist directory found');
  process.exit(1);
}

// Check if public subdirectory already exists
if (!fs.existsSync(publicDir)) {
  console.log('📁 Creating public subdirectory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Move all files from dist/ to dist/public/ except index.js
const files = fs.readdirSync(distDir);
for (const file of files) {
  if (file === 'public' || file === 'index.js') continue;
  
  const srcPath = path.join(distDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.statSync(srcPath).isDirectory()) {
    // Move directory
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true });
    }
    fs.renameSync(srcPath, destPath);
  } else {
    // Move file
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
    fs.renameSync(srcPath, destPath);
  }
  
  console.log(`✅ Moved ${file} to public/`);
}

console.log('🚀 Build output fixed for production!');