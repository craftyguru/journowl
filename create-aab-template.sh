#!/bin/bash

# Create AAB template and deployment instructions for JournOwl

echo "🦉 Creating AAB Template and Deployment Guide for JournOwl..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📱 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Create deployment package directory
mkdir -p deployment-package
cd deployment-package

print_step "Creating deployment assets..."

# Create Digital Asset Links file
cat > assetlinks.json << 'EOF'
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.journowl.app",
    "sha256_cert_fingerprints": ["BB:3B:1B:82:7B:BA:0C:9E:1F:99:A2:56:44:D0:FE:26:9C:87:90:20:E1:64:92:ED:65:25:EC:F8:26:AA:B5:A8"]
  }
}]
EOF

# Download app icons
print_step "Downloading app icons from live site..."
mkdir -p icons
for size in 72 96 128 144 152 192 384 512; do
    curl -s "https://journowl.app/icons/icon-${size}x${size}.png" -o "icons/icon-${size}x${size}.png" || echo "Failed to download ${size}x${size} icon"
done

# Create app store listing content
cat > google-play-listing.md << 'EOF'
# JournOwl - Google Play Store Listing

## App Information
- **Package Name**: com.journowl.app
- **App Name**: JournOwl - Your Wise Writing Companion
- **Version**: 1.4.0 (140)
- **Category**: Productivity
- **Content Rating**: Everyone

## Short Description (80 characters max)
AI-powered journaling with your wise owl mascot companion

## Full Description
Transform your daily reflections with JournOwl, the intelligent journaling companion that brings wisdom to your writing journey.

🦉 **Your Wise Writing Companion**
Meet your personal owl mascot who guides you through meaningful journaling experiences with AI-powered insights and gentle encouragement.

✍️ **Smart Journal Features**
- AI-powered writing prompts and suggestions
- Photo analysis and emotional insights
- Intelligent tagging and organization
- Rich markdown editor with customization options

📊 **Personal Analytics Dashboard**
- Mood tracking and visualization
- Writing streaks and achievements
- Word count analytics and patterns
- Progress tracking with meaningful metrics

🎯 **Goal Setting & Achievements**
- Personalized journaling goals
- Achievement system with rare badges
- XP progression and level system
- Streak tracking and motivation

🌙 **Dual Mode Experience**
- Adult mode for sophisticated journaling
- Kid-friendly mode for young writers
- Adaptive interface for all ages
- Family-friendly content and themes

🔒 **Privacy & Security**
- Your data stays private and secure
- Local storage with cloud backup options
- No ads or tracking
- GDPR compliant

Start your journey of self-discovery with JournOwl today - where every entry becomes a stepping stone to personal growth.

## Keywords
journaling, diary, writing, AI, owl, productivity, mood tracking, goals, achievements, personal growth, mindfulness, reflection

## Screenshots Needed
1. Main dashboard with owl mascot
2. Writing interface with AI suggestions
3. Analytics dashboard with charts
4. Achievement gallery
5. Goal setting interface
6. Kid mode interface
7. Photo analysis feature
8. Mobile responsive design

## Contact Information
- **Developer**: JournOwl Team
- **Website**: https://journowl.app
- **Privacy Policy**: https://journowl.app/privacy
- **Terms of Service**: https://journowl.app/terms
EOF

# Create deployment instructions
cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# JournOwl Android App Deployment Instructions

## Overview
This package contains everything needed to deploy JournOwl to the Google Play Store as a Trusted Web Activity (TWA).

## Files Included
- `assetlinks.json` - Digital Asset Links for domain verification
- `icons/` - All app icons in required sizes
- `google-play-listing.md` - Complete store listing content
- `android-project/` - Android TWA project source code
- `journowl-release-key.jks` - Release signing keystore

## Step 1: Upload Digital Asset Links
Upload `assetlinks.json` to your website at:
```
https://journowl.app/.well-known/assetlinks.json
```

Verify it's accessible: https://journowl.app/.well-known/assetlinks.json

## Step 2: Build AAB Locally (Recommended)

### Prerequisites
- Android Studio (latest version)
- Java Development Kit (JDK 11 or higher)
- Android SDK with API level 34

### Build Steps
1. Open `android-project/` in Android Studio
2. Let Android Studio sync and download dependencies
3. Build > Generate Signed Bundle/APK
4. Select "Android App Bundle"
5. Use the provided keystore: `journowl-release-key.jks`
   - Keystore password: `journowl2024`
   - Key alias: `journowl-key`
   - Key password: `journowl2024`
6. Build release AAB

## Step 3: Alternative - PWABuilder Website

### Use PWABuilder.com (Easiest Method)
1. Go to https://pwabuilder.com
2. Enter your PWA URL: `https://journowl.app`
3. Click "Start" and wait for analysis
4. Navigate to "Package For Stores" tab
5. Select "Android" → "Google Play"
6. Configure settings:
   - Package ID: `com.journowl.app`
   - App Name: `JournOwl - Your Wise Writing Companion`
   - Version: `1.4.0`
   - Host: `journowl.app`
7. Download the generated Android project
8. Sign with the provided keystore

## Step 4: Google Play Console

### Create New App
1. Go to Google Play Console: https://play.google.com/console
2. Create new application
3. Fill in app details using `google-play-listing.md`

### Upload AAB
1. Go to Release > Production
2. Create new release
3. Upload your signed AAB file
4. Fill in release notes
5. Save and review

### Store Listing
Use the content from `google-play-listing.md`:
- App name, description, keywords
- Upload icons from `icons/` folder
- Add screenshots (take from https://journowl.app)
- Set content rating to "Everyone"
- Category: "Productivity"

### Review and Publish
1. Complete all required sections
2. Submit for review
3. Wait for Google's approval (usually 1-3 days)

## Important Notes

### Digital Asset Links (Critical)
- The `assetlinks.json` file MUST be uploaded to your website
- This enables deep linking and makes the app open your website seamlessly
- Verify the file is accessible before submitting to Google Play

### Keystore Security
- Keep `journowl-release-key.jks` safe and backed up
- You'll need this same keystore for all future updates
- Passwords: store=`journowl2024`, key=`journowl2024`

### App Updates
- TWA apps automatically reflect website updates
- Only need Play Store updates for version bumps or new TWA features
- Users see changes immediately when you update your website

## Troubleshooting

### Build Issues
- Ensure Android SDK is properly installed
- Check that keystore passwords are correct
- Verify Digital Asset Links are properly configured

### Store Rejection
- Most common issue: Digital Asset Links not properly configured
- Ensure all required metadata is complete
- Screenshots must show actual app functionality

## Support
If you need help with the deployment process, the generated Android project follows standard TWA patterns and can be built with any standard Android development environment.
EOF

# Copy keystore if it exists
if [ -f "../android-project/journowl-release-key.jks" ]; then
    cp "../android-project/journowl-release-key.jks" ./
    print_success "Keystore copied to deployment package"
fi

# Copy Android project
if [ -d "../android-project" ]; then
    cp -r "../android-project" ./
    print_success "Android project copied to deployment package"
fi

cd ..

print_success "Deployment package created successfully!"
echo ""
print_step "📦 Deployment Package Contents:"
echo "- Digital Asset Links file (assetlinks.json)"
echo "- App icons for all required sizes"
echo "- Complete Google Play Store listing content"
echo "- Android TWA project with signing keystore"
echo "- Detailed deployment instructions"
echo ""
print_warning "Next Steps:"
echo "1. Upload assetlinks.json to https://journowl.app/.well-known/assetlinks.json"
echo "2. Build AAB using Android Studio or PWABuilder.com"
echo "3. Create Google Play Console account and upload AAB"
echo "4. Use google-play-listing.md content for store listing"
echo ""
print_step "🎯 Ready for Google Play Store deployment!"