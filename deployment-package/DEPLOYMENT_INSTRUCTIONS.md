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
