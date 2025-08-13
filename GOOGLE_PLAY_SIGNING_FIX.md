# Fix Google Play Console Signing Error 🔐

## The Problem
Google Play Console shows: **"Your Android App bundle is signed with the wrong key"**

This happens because:
1. Google Play Console generated its own upload key when you created the app
2. Your AAB was signed with our custom keystore
3. The certificate fingerprints don't match

## Solution Options

### Option 1: Use Google Play App Signing (Recommended)
This is the easiest and most secure approach:

#### Step A: Enable Google Play App Signing
1. In Google Play Console, go to **Release > Setup > App integrity**
2. Click **"Use Google-generated key"** or **"Upload a key (not using a Java keystore)"**
3. This lets Google manage the signing keys automatically

#### Step B: Upload Our Certificate
1. Extract the certificate from our keystore:
```bash
keytool -export -alias journowl-key -keystore journowl-release-key.jks -file upload-certificate.pem -rfc
# Password: journowl2024
```

2. Upload `upload-certificate.pem` to Google Play Console
3. Google will use this as your upload certificate

### Option 2: Download Google's Upload Key
If Google already generated an upload key:

1. In Play Console: **Release > Setup > App integrity**
2. Download the **upload certificate** (usually a .pem file)
3. Convert it to a keystore format:
```bash
# Convert PEM to JKS keystore
keytool -import -alias upload -file google-upload-cert.pem -keystore google-upload-key.jks
```

4. Use this new keystore to sign your AAB

### Option 3: Reset App Signing (Nuclear Option)
If nothing else works:

1. Contact Google Play Support
2. Request to reset app signing for your app
3. Use our keystore as the new upload key

## Quick Fix Instructions

### If You Have Google's Upload Certificate
1. **Download** the upload certificate from Play Console
2. **Sign AAB** with Google's certificate instead of ours
3. **Re-upload** the newly signed AAB

### If You Want to Use Our Keystore
1. **Extract certificate** from our keystore:
```bash
cd deployment-package
keytool -export -alias journowl-key -keystore journowl-release-key.jks -file journowl-upload-cert.pem -rfc
# Enter password: journowl2024
```

2. **Upload certificate** to Play Console:
   - Go to Release > Setup > App integrity
   - Upload `journowl-upload-cert.pem`
   - Enable Google Play App Signing

3. **Rebuild and upload** your AAB (it should now be accepted)

## Current Keystore Info
Your current keystore details:
- **File**: `journowl-release-key.jks`
- **SHA1**: `40:2D:C9:41:8F:C7:CF:70:03:7E:51:E5:D5:8D:1E:18:A0:0B:6F:E3`
- **SHA256**: `BB:3B:1B:82:7B:BA:0C:9E:1F:99:A2:56:44:D0:FE:26:9C:87:90:20:E1:64:92:ED:65:25:EC:F8:26:AA:B5:A8`

## Next Steps
1. **Choose Option 1** (recommended) - Upload our certificate to Google Play
2. **Extract certificate** using the command above
3. **Upload to Play Console** and enable Google Play App Signing
4. **Re-upload AAB** - it should now be accepted

This is a common first-time setup issue and easily resolved!