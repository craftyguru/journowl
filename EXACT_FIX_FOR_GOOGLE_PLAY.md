# EXACT FIX: Match Google Play Console Certificate

## The Problem
Google Play Console expects these specific fingerprints:
- **SHA1**: `2B:FB:E8:F2:7B:2F:68:B0:2D:4C:D9:F7:E8:BD:4A:F5:14:86:65:4F`
- **SHA256**: `02:06:80:8F:4F:3C:A0:88:02:33:26:C0:54:15:59:42:80:D9:47:15:60:28:F3:D1:DA:05:F3:7C:3C:47:39:C4`

Our keystore has different fingerprints, so Google rejects the AAB.

## The Fix (2 Steps)

### Step 1: Download Google's Upload Certificate
1. **Go to Google Play Console** > Release > Setup > **App integrity**
2. **Find** "Upload key certificate" section (where you see those fingerprints)
3. **Click** the download button (📥) next to the certificate fingerprints
4. **Save** the file as `google-upload-cert.pem`

### Step 2: Use PWABuilder with Google's Certificate
1. **Go to**: https://pwabuilder.com
2. **Enter**: `https://journowl.app`
3. **Click**: "Package For Stores" → "Android"
4. **Upload** the `google-upload-cert.pem` file when asked for signing
5. **Download** the generated AAB
6. **Upload** this new AAB to Google Play Console

## Alternative: Convert Google's Certificate to Keystore

If you prefer using Android Studio:

```bash
# After downloading google-upload-cert.pem from Play Console
cd deployment-package

# Import Google's certificate into a keystore
keytool -import -alias google-upload -file google-upload-cert.pem -keystore google-upload-key.jks -storepass journowl2024
```

Then update `android-project/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyAlias 'google-upload'
        keyPassword 'journowl2024'
        storeFile file('../google-upload-key.jks')
        storePassword 'journowl2024'
    }
}
```

Build new AAB:
```bash
cd android-project
./gradlew clean bundleRelease
```

## Why This Happens
Google Play Console automatically generates an upload certificate when you first create an app. Your AAB must be signed with that exact certificate, not a custom one.

## Quick Summary
1. **Download** Google's upload certificate from Play Console
2. **Use PWABuilder** or convert to keystore
3. **Sign AAB** with Google's certificate  
4. **Upload** - should now be accepted

The key is using Google's pre-generated certificate, not creating your own.