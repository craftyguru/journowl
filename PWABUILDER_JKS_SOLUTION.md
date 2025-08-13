# PWABuilder JKS Solution

## The Issue
PWABuilder requires a JKS keystore file, not PEM certificates. We need to provide the right keystore format.

## Option 1: Use Our Working Keystore (RECOMMENDED)

**Upload this file**: `deployment-package/pwabuilder-compatible.jks`

**PWABuilder settings:**
- **Key file**: Upload `pwabuilder-compatible.jks`
- **Key alias**: `journowl-release`
- **Key password**: `journowl2024`
- **Key store password**: `journowl2024`

This will generate an AAB. Then:
1. Download the generated AAB
2. Try uploading to Google Play Console
3. If rejected, go to App integrity and upload the certificate to Google

## Option 2: Convert Google's Certificate (If Available)

If you can download a PEM certificate from Google Play Console:

```bash
# Convert Google's PEM to JKS
keytool -import -alias google-upload -file google-download.pem -keystore google-converted.jks -storepass journowl2024
```

Then use:
- **Key file**: Upload `google-converted.jks`
- **Key alias**: `google-upload`
- **Key password**: `journowl2024`
- **Key store password**: `journowl2024`

## Option 3: Generate New Keystore for Google Play

Create a fresh keystore specifically for this:

```bash
keytool -genkeypair -keystore google-play-key.jks -alias journowl-app -keyalg RSA -keysize 2048 -validity 10000 -storepass journowl2024 -keypass journowl2024 -dname "CN=JournOwl,OU=Development,O=JournOwl,L=City,ST=State,C=US"
```

## The Process
1. **Use PWABuilder** with one of the JKS files above
2. **Download the AAB** from PWABuilder
3. **Upload to Google Play Console**
4. **If rejected**: Go to App integrity section and upload the certificate
5. **Re-upload the AAB** - should now work

## Why This Will Work
Google Play Console accepts AABs when either:
- The certificate matches their expected fingerprint, OR
- You upload your certificate to their App integrity section

Since we can't match their fingerprint exactly, we upload our certificate to Google and then our AAB gets accepted.