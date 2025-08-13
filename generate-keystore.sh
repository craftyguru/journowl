#!/bin/bash

# Generate keystore for JournOwl Android app signing

echo "🔐 Generating JournOwl Release Keystore..."

# Set Java path
export PATH="/nix/store/2vwkssqpzykk37r996cafq7x63imf4sp-openjdk-21+35/bin:$PATH"

KEYSTORE_PATH="./android-project/journowl-release-key.jks"

# Generate keystore if it doesn't exist
if [ ! -f "$KEYSTORE_PATH" ]; then
    keytool -genkey -v -keystore "$KEYSTORE_PATH" \
        -alias journowl-key \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=JournOwl, OU=Development, O=JournOwl, L=City, S=State, C=US" \
        -storepass journowl2024 \
        -keypass journowl2024
    
    echo "✅ Keystore generated at: $KEYSTORE_PATH"
    
    # Generate SHA256 fingerprint
    echo ""
    echo "🔑 SHA256 Fingerprint (for Digital Asset Links):"
    keytool -list -v -keystore "$KEYSTORE_PATH" -alias journowl-key -storepass journowl2024 | grep "SHA256:" | sed 's/.*SHA256: //'
    
else
    echo "⚠️  Keystore already exists at: $KEYSTORE_PATH"
fi