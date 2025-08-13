#!/bin/bash

# Build AAB for JournOwl

echo "🦉 Building JournOwl Android App Bundle..."

# Set Java path
export PATH="/nix/store/2vwkssqpzykk37r996cafq7x63imf4sp-openjdk-21+35/bin:$PATH"

cd android-project

# Check if keystore exists
if [ ! -f "journowl-release-key.jks" ]; then
    echo "❌ Keystore not found. Run ./generate-keystore.sh first"
    exit 1
fi

# Build the AAB
if command -v ./gradlew &> /dev/null; then
    ./gradlew bundleRelease
elif command -v gradle &> /dev/null; then
    gradle bundleRelease
else
    echo "❌ Gradle not found. Installing gradle..."
    exit 1
fi

# Find and copy the AAB
AAB_FILE=$(find . -name "*.aab" | head -1)
if [ -f "$AAB_FILE" ]; then
    cp "$AAB_FILE" "../JournOwl.aab"
    echo "✅ AAB built successfully: JournOwl.aab"
    
    # Get file size
    AAB_SIZE=$(du -h "../JournOwl.aab" | cut -f1)
    echo "📱 AAB size: $AAB_SIZE"
    
    # Generate assetlinks.json
    SHA256_FINGERPRINT=$(keytool -list -v -keystore "journowl-release-key.jks" -alias journowl-key -storepass journowl2024 | grep "SHA256:" | sed 's/.*SHA256: //' | tr -d ' ')
    
    cat > "../assetlinks.json" << EOF
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.journowl.app",
    "sha256_cert_fingerprints": ["$SHA256_FINGERPRINT"]
  }
}]
EOF
    
    echo "✅ Digital Asset Links file created: assetlinks.json"
    echo ""
    echo "🎉 Ready for Google Play Store!"
    echo "Upload JournOwl.aab to Google Play Console"
    echo "Upload assetlinks.json to https://journowl.app/.well-known/assetlinks.json"
    
else
    echo "❌ AAB build failed"
    exit 1
fi