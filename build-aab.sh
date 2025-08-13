#!/bin/bash

# JournOwl AAB Build Script for Google Play Store
# This script generates an Android App Bundle using PWABuilder

set -e  # Exit on any error

echo "🦉 JournOwl AAB Build Process Starting..."

# Configuration
APP_URL="https://journowl.app"  # Change to your deployed URL
LOCAL_URL="http://localhost:5000"  # Fallback to local development
OUTPUT_DIR="./android-build"
AAB_OUTPUT="./JournOwl.aab"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📱 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check if app is accessible
print_step "Checking app accessibility..."
if curl -s --head "$APP_URL" | head -n 1 | grep -q "200 OK"; then
    TARGET_URL="$APP_URL"
    print_success "Using deployed app: $APP_URL"
else
    print_warning "Deployed app not accessible, using local development server"
    TARGET_URL="$LOCAL_URL"
    
    # Check if local server is running
    if ! curl -s --head "$LOCAL_URL" | head -n 1 | grep -q "200"; then
        print_error "Local server not running. Please start your app with 'npm run dev'"
        exit 1
    fi
fi

# Step 2: Clean previous builds
print_step "Cleaning previous builds..."
rm -rf "$OUTPUT_DIR"
rm -f "$AAB_OUTPUT"
mkdir -p "$OUTPUT_DIR"

# Step 3: Generate Android project using PWABuilder
print_step "Generating Android project with PWABuilder..."
cd "$OUTPUT_DIR"

# Use PWABuilder CLI to generate Android project
npx @pwabuilder/cli create android "$TARGET_URL"

print_success "Android project generated"

# Step 4: Find the generated project directory
ANDROID_PROJECT_DIR=$(find . -name "*android*" -type d | head -1)
if [ -z "$ANDROID_PROJECT_DIR" ]; then
    print_error "Android project directory not found"
    exit 1
fi

print_step "Found Android project: $ANDROID_PROJECT_DIR"
cd "$ANDROID_PROJECT_DIR"

# Step 5: Configure signing (using debug key for now)
print_step "Configuring app signing..."

# Generate a keystore if it doesn't exist
KEYSTORE_PATH="journowl-release-key.jks"
if [ ! -f "$KEYSTORE_PATH" ]; then
    print_step "Generating release keystore..."
    keytool -genkey -v -keystore "$KEYSTORE_PATH" \
        -alias journowl-key \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=JournOwl, OU=Development, O=JournOwl, L=City, S=State, C=US" \
        -storepass journowl2024 \
        -keypass journowl2024
    print_success "Keystore generated"
fi

# Step 6: Update build.gradle with signing configuration
print_step "Updating build configuration..."
cat >> app/build.gradle << 'EOF'

android {
    signingConfigs {
        release {
            keyAlias 'journowl-key'
            keyPassword 'journowl2024'
            storeFile file('../journowl-release-key.jks')
            storePassword 'journowl2024'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
EOF

# Step 7: Build the AAB
print_step "Building Android App Bundle..."
if command -v ./gradlew &> /dev/null; then
    ./gradlew bundleRelease
elif command -v gradle &> /dev/null; then
    gradle bundleRelease
else
    print_error "Gradle not found. Please install Gradle."
    exit 1
fi

# Step 8: Copy AAB to root directory
AAB_FILE=$(find . -name "*.aab" | head -1)
if [ -f "$AAB_FILE" ]; then
    cp "$AAB_FILE" "../../$AAB_OUTPUT"
    print_success "AAB built successfully: $AAB_OUTPUT"
    
    # Get file size
    AAB_SIZE=$(du -h "../../$AAB_OUTPUT" | cut -f1)
    print_success "AAB size: $AAB_SIZE"
    
    # Show AAB info
    print_step "AAB Information:"
    if command -v aapt &> /dev/null; then
        aapt dump badging "../../$AAB_OUTPUT" | grep -E "package|application-label|application-icon"
    fi
else
    print_error "AAB file not found after build"
    exit 1
fi

# Step 9: Generate signing certificate fingerprint for Digital Asset Links
print_step "Generating SHA256 fingerprint for Digital Asset Links..."
SHA256_FINGERPRINT=$(keytool -list -v -keystore "$KEYSTORE_PATH" -alias journowl-key -storepass journowl2024 | grep "SHA256:" | sed 's/.*SHA256: //' | tr -d ' ' | tr '[:upper:]' '[:lower:]')

if [ ! -z "$SHA256_FINGERPRINT" ]; then
    print_success "SHA256 Fingerprint: $SHA256_FINGERPRINT"
    
    # Generate assetlinks.json content
    cat > "../../assetlinks.json" << EOF
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.journowl.app",
    "sha256_cert_fingerprints": ["$SHA256_FINGERPRINT"]
  }
}]
EOF
    
    print_success "Generated assetlinks.json for Digital Asset Links"
    print_warning "Please upload assetlinks.json to https://journowl.app/.well-known/assetlinks.json"
fi

cd ../..

# Step 10: Final instructions
print_step "Build Complete! 🎉"
echo ""
print_success "Your AAB is ready: $AAB_OUTPUT"
print_success "Keystore location: $OUTPUT_DIR/$ANDROID_PROJECT_DIR/$KEYSTORE_PATH"
echo ""
print_step "Next Steps for Google Play Store:"
echo "1. Upload the AAB file to Google Play Console"
echo "2. Upload assetlinks.json to your website at /.well-known/assetlinks.json"
echo "3. Fill in store listing details in Google Play Console"
echo "4. Submit for review"
echo ""
print_warning "Important: Keep your keystore file safe - you'll need it for future updates!"
echo ""
print_step "SHA256 Fingerprint for Digital Asset Links:"
echo "$SHA256_FINGERPRINT"