# Google Play Console Upload Key Verification Guide

## JournOwl Keystore Information

### Generated Keystore Details
- **File**: `journowl-release-key.jks`
- **Key Alias**: `journowl-key`
- **Store Password**: `journowl2024`
- **Key Password**: `journowl2024`

### Certificate Fingerprints
```
SHA1: 40:2D:C9:41:8F:C7:CF:70:03:7E:51:E5:D5:8D:1E:18:A0:0B:6F:E3
SHA256: BB:3B:1B:82:7B:BA:0C:9E:1F:99:A2:56:44:D0:FE:26:9C:87:90:20:E1:64:92:ED:65:25:EC:F8:26:AA:B5:A8
```

## Step 1: Verify Upload Key in Google Play Console

### Check Expected Key Fingerprint
1. Go to Google Play Console: https://play.google.com/console
2. Navigate to: **Release > Setup > App integrity**
3. Find **Upload key certificate** section
4. Copy the SHA-1 fingerprint shown

### Compare with Our Keystore
Our keystore SHA-1: `40:2D:C9:41:8F:C7:CF:70:03:7E:51:E5:D5:8D:1E:18:A0:0B:6F:E3`

**If they match**: ✅ You're using the correct keystore
**If they don't match**: ❌ You need to use our keystore or update Play Console

## Step 2: Build AAB with Correct Signing

### Option A: Android Studio (Recommended)
1. Open `deployment-package/android-project/` in Android Studio
2. Wait for Gradle sync to complete
3. Go to **Build > Generate Signed Bundle/APK**
4. Select **Android App Bundle**
5. Choose existing keystore: `journowl-release-key.jks`
6. Enter credentials:
   - **Keystore password**: `journowl2024`
   - **Key alias**: `journowl-key` 
   - **Key password**: `journowl2024`
7. Build release AAB

### Option B: Command Line (Gradle)
```bash
cd deployment-package/android-project
./gradlew clean
./gradlew bundleRelease
```
The AAB will be created at: `app/build/outputs/bundle/release/app-release.aab`

### Option C: PWABuilder (Easiest)
1. Go to https://pwabuilder.com
2. Enter: `https://journowl.app`
3. Click **Package For Stores** → **Android**
4. Download the generated project
5. Sign with our keystore using method A or B above

## Step 3: Upload to Google Play Console

### Create New Release
1. Go to **Release > Production**
2. Click **Create new release**
3. Upload your signed `app-release.aab`

### First Time App Setup
If this is your first upload:
1. Complete **App content** section
2. Fill in **Store listing** using content from `google-play-listing.md`
3. Upload screenshots and icons from `deployment-package/icons/`
4. Set **Content rating** to "Everyone"
5. Select **Category**: "Productivity"

## Step 4: Digital Asset Links Verification

### Verify File is Live
The Digital Asset Links file is already uploaded:
- **URL**: https://journowl.app/.well-known/assetlinks.json
- **Contains**: SHA256 fingerprint matching our keystore

### Test Verification
```bash
curl https://journowl.app/.well-known/assetlinks.json
```
Should return JSON with package name `com.journowl.app`

## Troubleshooting

### If Upload Key Doesn't Match
**Scenario 1**: Google Play shows different SHA-1
- Use the keystore we generated (`journowl-release-key.jks`)
- The signing is already configured in `build.gradle`

**Scenario 2**: You have existing app in Play Console
- Contact Google Play Support to reset upload key
- Or create new app listing with our keystore

### If Build Fails
**Missing Android SDK**: Install Android Studio first
**Gradle issues**: Clean project and rebuild
**Signing errors**: Double-check keystore password

### If AAB Upload Fails
**Invalid signature**: Ensure you're using the correct keystore
**Package name conflict**: Verify no existing app with `com.journowl.app`
**Digital Asset Links**: Confirm file is accessible at the URL above

## Verification Commands

### Check our keystore fingerprint
```bash
keytool -list -v -keystore journowl-release-key.jks -storepass journowl2024
```

### Check AAB signature (after building)
```bash
# Extract and verify AAB signature
unzip -l app-release.aab
```

### Test Digital Asset Links
```bash
curl -s https://journowl.app/.well-known/assetlinks.json | jq .
```

## Next Steps After Upload

1. **Submit for Review**: Click "Send X release to review"
2. **Wait for Approval**: Usually 1-3 business days
3. **Monitor Status**: Check Play Console for review feedback
4. **Publish**: Once approved, your app goes live

## Important Notes

- **Keep keystore safe**: You need this exact file for all future updates
- **Backup keystore**: Store securely - if lost, you can't update the app
- **Password security**: Change passwords after deployment if needed
- **Digital Asset Links**: Must remain accessible at the URL for TWA functionality

Your JournOwl Android app is properly configured and ready for Google Play Store deployment!