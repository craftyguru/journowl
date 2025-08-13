#!/bin/bash

# Create keystore that matches Google Play Console expectations
# This is an alternative approach if downloading Google's certificate doesn't work

echo "🔐 Creating keystore to match Google Play Console fingerprints..."

# Set Java path
export PATH="/nix/store/2vwkssqpzykk37r996cafq7x63imf4sp-openjdk-21+35/bin:$PATH"

KEYSTORE_PATH="./deployment-package/google-matching-key.jks"

# Remove existing keystore if it exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo "Removing existing keystore..."
    rm "$KEYSTORE_PATH"
fi

echo "📝 NOTE: This script creates a new keystore, but Google Play Console"
echo "    has already generated an upload certificate. You should instead:"
echo "    1. Download the upload certificate from Google Play Console"
echo "    2. Use that certificate to sign your AAB"
echo ""
echo "    This script is provided as a backup option only."
echo ""
read -p "Do you want to continue anyway? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled. Please download Google's upload certificate instead."
    exit 1
fi

# Generate new keystore (this won't match Google's fingerprints)
keytool -genkeypair \
    -keystore "$KEYSTORE_PATH" \
    -alias "google-upload" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "journowl2024" \
    -keypass "journowl2024" \
    -dname "CN=JournOwl,OU=Development,O=JournOwl,L=City,ST=State,C=US"

if [ $? -eq 0 ]; then
    echo "✅ New keystore generated at: $KEYSTORE_PATH"
    
    # Show fingerprints
    echo ""
    echo "🔑 New keystore fingerprints:"
    keytool -list -v -keystore "$KEYSTORE_PATH" -storepass "journowl2024" | grep -A2 "Certificate fingerprints:"
    
    echo ""
    echo "⚠️  WARNING: These fingerprints will NOT match Google Play Console."
    echo "   You'll need to upload the certificate to Google Play Console first."
    echo ""
    echo "💡 RECOMMENDED: Download Google's upload certificate instead:"
    echo "   1. Go to Google Play Console > Release > Setup > App integrity"
    echo "   2. Click 'Download certificate' next to Upload key certificate"
    echo "   3. Use that certificate to sign your AAB"
else
    echo "❌ Failed to generate keystore"
    exit 1
fi