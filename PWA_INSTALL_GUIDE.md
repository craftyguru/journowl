# JournOwl PWA Mobile Installation Guide

## 📱 **CRITICAL: Use Production Domain for Mobile Install**

For mobile PWA installation to work, you MUST access the app through the production domain:

**✅ CORRECT URL:** https://journowl.app
**❌ WRONG URL:** https://e9204149-ed5d-4c26-b940-3fdece41619d-00-18n96349e7ebd.riker.replit.dev

## Android Installation

### Method 1: Chrome Install Prompt
1. Open Chrome on your Android phone
2. Visit **https://journowl.app** (production domain)
3. Use the app for 30-60 seconds (browse, interact)
4. Wait for the install prompt to appear at the bottom
5. Tap "Install" when prompted

### Method 2: Manual Chrome Install
1. Open Chrome and visit **https://journowl.app**
2. Tap the three dots menu (⋮) in Chrome
3. Look for "Add to Home screen" or "Install app"
4. Tap it and confirm installation

### Method 3: Edge Browser
1. Open Microsoft Edge on Android
2. Visit **https://journowl.app**
3. Tap the three dots menu
4. Select "Add to phone"

## iPhone/iPad Installation

### Safari Manual Install
1. Open Safari and visit **https://journowl.app**
2. Tap the Share button (square with arrow up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

## Troubleshooting

### If install prompt doesn't appear:
1. **Check URL:** Must be https://journowl.app (not Replit dev domain)
2. **Clear browser data:** Clear cache/cookies and try again
3. **Use the app:** Interact with the app for 1-2 minutes first
4. **Try different browser:** Use Chrome, Edge, or Firefox
5. **Wait:** Sometimes takes multiple visits over days

### PWA Requirements Met:
- ✅ HTTPS enabled
- ✅ Valid manifest.json
- ✅ Service worker active
- ✅ 192x192 and 512x512 icons
- ✅ Start URL configured

## Features After Installation

Once installed, JournOwl will:
- ✅ Work offline (write entries without internet)
- ✅ Sync automatically when connection returns
- ✅ Send notifications for writing reminders
- ✅ Feel like a native app
- ✅ Have app shortcuts (New Entry, Analytics)
- ✅ Handle file sharing from other apps

## Debug Information

The app includes debug logging. Open browser dev tools (F12) to see:
- PWA install eligibility checks
- Service worker registration
- Install prompt triggers

## Production vs Development

**Production (https://journowl.app):**
- Full PWA functionality
- Mobile install prompts work
- Offline sync enabled
- Push notifications

**Development (Replit domain):**
- Limited PWA features
- No mobile install prompts
- For development only