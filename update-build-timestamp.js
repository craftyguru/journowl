#!/usr/bin/env node

/**
 * Auto-Update Service Worker Build Timestamp
 * This script automatically updates the service worker cache version
 * with the current build timestamp for Railway deployments
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_WORKER_PATH = path.join(__dirname, 'client/public/service-worker.js');
const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json');

function updateServiceWorkerTimestamp() {
  try {
    // Generate current timestamp
    const buildTimestamp = new Date().toISOString();
    
    // Read current service worker
    let serviceWorkerContent = fs.readFileSync(SERVICE_WORKER_PATH, 'utf8');
    
    // Update build timestamp in service worker
    const timestampRegex = /const BUILD_TIMESTAMP = '.*?';/;
    const newTimestampLine = `const BUILD_TIMESTAMP = '${buildTimestamp}'; // Updated automatically on build`;
    
    if (timestampRegex.test(serviceWorkerContent)) {
      serviceWorkerContent = serviceWorkerContent.replace(timestampRegex, newTimestampLine);
    } else {
      // If pattern not found, add it after the first line
      const lines = serviceWorkerContent.split('\n');
      lines.splice(1, 0, newTimestampLine);
      serviceWorkerContent = lines.join('\n');
    }
    
    // Write updated service worker
    fs.writeFileSync(SERVICE_WORKER_PATH, serviceWorkerContent);
    
    console.log('✅ Service Worker build timestamp updated:', buildTimestamp);
    
    // Also update package.json version if needed
    updatePackageVersion(buildTimestamp);
    
    return buildTimestamp;
  } catch (error) {
    console.error('❌ Failed to update service worker build timestamp:', error);
    process.exit(1);
  }
}

function updatePackageVersion(buildTimestamp) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    
    // Update version with timestamp-based micro version
    const baseVersion = packageJson.version.split('.').slice(0, 2).join('.');
    const microVersion = Math.floor(Date.now() / 1000) % 10000; // Last 4 digits of timestamp
    const newVersion = `${baseVersion}.${microVersion}`;
    
    packageJson.version = newVersion;
    packageJson.buildTimestamp = buildTimestamp;
    
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Package version updated:', newVersion);
  } catch (error) {
    console.warn('⚠️  Could not update package.json version:', error.message);
  }
}

// Run the update
if (import.meta.url === `file://${process.argv[1]}`) {
  const timestamp = updateServiceWorkerTimestamp();
  console.log(`🚀 Build ready for deployment with timestamp: ${timestamp}`);
}

export { updateServiceWorkerTimestamp };