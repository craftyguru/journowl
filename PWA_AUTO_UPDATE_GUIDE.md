# PWA Auto-Update System for Railway Deployment

## 🚀 Overview

Your JournOwl PWA now has a comprehensive auto-update system that ensures native Android apps automatically receive updates when you deploy to Railway.

## ⚡ How It Works

### 1. **Build Timestamp System**
- Each deployment generates a unique build timestamp
- Service worker cache version is tied to this timestamp
- PWA clients compare their cached timestamp with server timestamp

### 2. **Aggressive Update Checking**
- Checks for updates every 10 minutes when app is active
- Service worker performs additional checks every 15 minutes
- Force-updates clear all caches and reload immediately

### 3. **Multi-Layer Detection**
- Version number changes (from package.json)
- Build timestamp changes (generated on each deploy)
- Service worker registration updates

## 📱 Native Android App Behavior

When you deploy to Railway:

1. **Within 15 minutes**, native Android PWAs will:
   - Check for server updates automatically
   - Display "New Version Available!" notification
   - Clear all caches
   - Force reload with fresh content

2. **User Experience**:
   - Green notification with rocket icon appears
   - "Updating JournOwl automatically..." message
   - App refreshes seamlessly with new features

## 🛠 Deployment Process

### For Railway Deployment:

```bash
# Option 1: Use the deployment script
./deploy-railway.sh

# Option 2: Manual deployment
node update-build-timestamp.js
npm run build
# Then deploy to Railway as usual
```

### Required Railway Environment Variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=auto_provided_by_railway
```

### OAuth Redirect URLs to Update:

After deploying to Railway, update these in your OAuth providers:

**Google OAuth Console:**
```
https://YOUR_RAILWAY_DOMAIN/auth/google/callback
```

**Facebook Developer Console:**
```
https://YOUR_RAILWAY_DOMAIN/auth/facebook/callback
```

## 🧪 Testing PWA Updates

### Force an Update Manually:
```bash
node update-build-timestamp.js
```

### Test Update Detection:
1. Deploy your app to Railway
2. Install the PWA on Android device
3. Make a small change and redeploy
4. Within 15 minutes, you should see the update notification

### Debug Update System:
Check browser console for these logs:
- `[PWA] Checking for updates...`
- `[PWA] App updated detected:`
- `[ServiceWorker] New version detected, forcing update...`

## 🔧 Technical Details

### Service Worker Cache Strategy:
- **Cache Name**: `journowl-cache-v{BUILD_TIMESTAMP}`
- **Update Frequency**: Every 10-15 minutes
- **Force Update**: Clears all caches and forces reload

### Version Endpoint:
```
GET /api/version
Response: {
  "version": "1.5.6",
  "buildTimestamp": "2025-07-31T23:19:01.533Z"
}
```

### Update Detection Logic:
1. Compare stored version vs server version
2. Compare stored build timestamp vs server build timestamp
3. If either changed: trigger force update
4. Clear caches, show notification, reload app

## 🎯 Benefits

✅ **Automatic Updates**: No user intervention required
✅ **Fast Propagation**: Updates reach users within 15 minutes
✅ **Cache Busting**: Ensures fresh content delivery
✅ **User Notifications**: Clear update progress indicators
✅ **Railway Optimized**: Designed specifically for Railway deployments

## 🔍 Troubleshooting

### Updates Not Working?
1. Check Railway logs for deployment success
2. Verify environment variables are set
3. Check browser console for PWA update logs
4. Test with `node update-build-timestamp.js`

### Android App Not Updating?
1. Ensure app is installed as PWA (not browser bookmark)
2. Check that device has internet connection
3. Try force-closing and reopening the app
4. Check if background app refresh is enabled

### Manual Force Update:
If needed, users can:
1. Go to browser settings
2. Clear site data for your domain
3. Revisit the app for fresh installation

## 📝 Next Steps

After Railway deployment:
1. Test PWA installation on Android
2. Deploy a small change to test auto-updates
3. Monitor Railway logs for any deployment issues
4. Update OAuth redirect URLs to Railway domain

Your PWA will now automatically keep users on the latest version! 🎉