# JournOwl TWA (Trusted Web Activity) Build Guide

## Overview
This guide shows how to create a Trusted Web Activity (TWA) wrapper for JournOwl so it can be published to Google Play Store while maintaining all PWA functionality.

## Prerequisites
- Android Studio (latest version)
- Java Development Kit (JDK 17 or higher)
- Android SDK with API level 34
- Git

## Step 1: Generate TWA Project using PWABuilder

### Option A: Using PWABuilder Website (Recommended)
1. Go to https://pwabuilder.com
2. Enter your PWA URL: `https://journowl.app`
3. Click "Start" and wait for analysis
4. Navigate to "Package For Stores" tab
5. Select "Android" → "Google Play"
6. Download the generated Android project ZIP

### Option B: Using PWABuilder CLI
```bash
npm install -g @pwabuilder/cli
pwa package https://journowl.app --platform android
```

## Step 2: Configure TWA Settings

Use the provided `twa-config.json` in your project root with these settings:
- **Package ID**: `com.journowl.app`
- **Host**: `journowl.app`
- **Icons**: All point to your owl mascot icons
- **Theme Colors**: Purple gradient matching your PWA
- **Shortcuts**: New Entry and Analytics shortcuts

## Step 3: Android Studio Setup

1. **Extract the generated project** to a new folder
2. **Open in Android Studio**
3. **Update app/build.gradle** with correct signing configuration
4. **Verify AndroidManifest.xml** contains correct TWA settings:
   ```xml
   <activity
       android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
       android:theme="@style/LauncherActivityTheme">
       <intent-filter>
           <action android:name="android.intent.action.MAIN" />
           <category android:name="android.intent.category.LAUNCHER" />
       </intent-filter>
       <intent-filter android:autoVerify="true">
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="https" android:host="journowl.app" />
       </intent-filter>
   </activity>
   ```

## Step 4: Digital Asset Links (Critical)

1. **Add to your website** at `https://journowl.app/.well-known/assetlinks.json`:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.journowl.app",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
     }
   }]
   ```

2. **Get SHA256 fingerprint** from your signing keystore:
   ```bash
   keytool -list -v -keystore your-keystore.jks -alias your-key-alias
   ```

## Step 5: Build and Sign APK/AAB

1. **Generate signing key** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore journowl-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias journowl-key
   ```

2. **Configure app/build.gradle** signing:
   ```gradle
   android {
       signingConfigs {
           release {
               keyAlias 'journowl-key'
               keyPassword 'your-key-password'
               storeFile file('journowl-release-key.jks')
               storePassword 'your-store-password'
           }
       }
   }
   ```

3. **Build release AAB**:
   ```bash
   ./gradlew bundleRelease
   ```

## Step 6: Google Play Console Upload

1. **Create new app** in Google Play Console
2. **Upload the generated AAB** file from `app/build/outputs/bundle/release/`
3. **Fill in store listing** with JournOwl details:
   - **App Name**: JournOwl - Your Wise Writing Companion
   - **Short Description**: AI-powered journaling with your wise owl mascot
   - **Full Description**: Use your existing PWA description
   - **Screenshots**: Take from https://journowl.app
   - **App Icon**: Use your owl mascot (512x512)

## Important Notes

- **Domain Verification**: The Digital Asset Links step is critical for TWA functionality
- **Icon Consistency**: Use the same owl mascot icons across PWA and TWA
- **URL Handling**: TWA will open your PWA URLs directly in the native-like wrapper
- **Updates**: TWA automatically reflects PWA updates without app store updates
- **Permissions**: Ensure your PWA's requested permissions are declared in AndroidManifest.xml

## Testing

1. **Install APK** on Android device for testing
2. **Verify URL handling** - links to journowl.app should open in your TWA
3. **Test offline functionality** - should work identically to PWA
4. **Verify shortcuts** - home screen shortcuts should work

## Files Included

- `twa-config.json` - Configuration for TWA generation
- This build guide with all necessary steps
- Compatible with your existing PWA at https://journowl.app

Your JournOwl PWA is already perfectly configured for TWA conversion with all necessary PWA features, manifest settings, and service worker functionality.