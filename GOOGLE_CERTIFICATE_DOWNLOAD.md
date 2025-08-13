# Download Google Play Console Upload Certificate

## The Mismatch Issue
Google Play Console expects these fingerprints:
- **MD5**: `60:23:1D:C4:4A:00:01:21:FA:16:21:BF:54:FC:95:DC`
- **SHA1**: `2B:FB:E8:F2:7B:2F:68:B0:2D:4C:D9:F7:E8:BD:4A:F5:14:86:65:4F`
- **SHA256**: `02:06:80:8F:4F:3C:A0:88:02:33:26:C0:54:15:59:42:80:D9:47:15:60:28:F3:D1:DA:05:F3:7C:3C:47:39:C4`

Our keystore has different fingerprints, which is why Google is rejecting the AAB.

## Solution: Download Google's Upload Certificate

### Step 1: Download Certificate from Google Play Console
1. **Go to**: Google Play Console > Release > Setup > App integrity
2. **Find**: "Upload key certificate" section
3. **Click**: "Download certificate" button (next to the fingerprints)
4. **Save as**: `google-upload-cert.pem`

### Step 2: Convert to Keystore Format
Once you have the certificate file, convert it:

```bash
cd deployment-package

# Convert Google's PEM certificate to JKS keystore
keytool -import -alias google-upload -file google-upload-cert.pem -keystore google-upload-key.jks -storepass journowl2024
```

### Step 3: Update Android Project Signing Config
Update `android-project/app/build.gradle`:

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

### Step 4: Rebuild AAB
```bash
cd android-project
./gradlew clean
./gradlew bundleRelease
```

### Step 5: Upload New AAB
Upload the newly built AAB - it should now have the correct signature that matches Google's expectations.

## Alternative: Use PWABuilder with Google's Certificate

1. **Download certificate** from Google Play Console as described above
2. **Go to**: https://pwabuilder.com
3. **Enter**: https://journowl.app
4. **Package for Android** with the Google certificate
5. **Upload** the generated AAB

## Manual Certificate Download Instructions

Since I can't directly download from Google Play Console, you need to:

1. **Login** to Google Play Console
2. **Navigate** to your JournOwl app
3. **Go to**: Release > Setup > App integrity
4. **Click** the download button next to "Upload key certificate"
5. **Save** the file as `google-upload-cert.pem`
6. **Follow** conversion steps above

This will ensure your AAB signature matches exactly what Google Play Console expects.