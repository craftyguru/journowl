#!/bin/bash

# JournOwl Android Project Creator
# Creates a basic Android project for TWA (Trusted Web Activity)

set -e

echo "🦉 Creating Android TWA Project for JournOwl..."

# Configuration
PROJECT_NAME="JournOwl"
PACKAGE_NAME="com.journowl.app"
APP_NAME="JournOwl - Your Wise Writing Companion"
TARGET_URL="https://journowl.app"
THEME_COLOR="#764ba2"
OUTPUT_DIR="./android-project"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📱 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Clean and create project directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

# Create Android project structure
print_step "Creating Android project structure..."

mkdir -p app/src/main/java/com/journowl/app
mkdir -p app/src/main/res/{values,drawable,mipmap-hdpi,mipmap-mdpi,mipmap-xhdpi,mipmap-xxhdpi,mipmap-xxxhdpi}

# Create build.gradle (Project level)
cat > build.gradle << 'EOF'
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.5.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
EOF

# Create settings.gradle
cat > settings.gradle << 'EOF'
include ':app'
rootProject.name = "JournOwl"
EOF

# Create gradle.properties
cat > gradle.properties << 'EOF'
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
org.gradle.parallel=true
EOF

# Create app/build.gradle
cat > app/build.gradle << EOF
plugins {
    id 'com.android.application'
}

android {
    namespace '$PACKAGE_NAME'
    compileSdk 34

    defaultConfig {
        applicationId "$PACKAGE_NAME"
        minSdk 24
        targetSdk 34
        versionCode 140
        versionName "1.4.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

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
            minifyEnabled false
            signingConfig signingConfigs.release
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    implementation 'androidx.browser:browser:1.6.0'
}
EOF

# Create AndroidManifest.xml
cat > app/src/main/AndroidManifest.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.JournOwl"
        tools:targetApi="31">

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/LauncherActivityTheme">

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="$TARGET_URL" />

            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />

            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/colorPrimary" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_IMAGE_DRAWABLE"
                android:resource="@drawable/splash" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_BACKGROUND_COLOR"
                android:resource="@color/colorPrimary" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_FADE_OUT_DURATION"
                android:value="300" />

            <meta-data
                android:name="android.support.customtabs.trusted.FILE_PROVIDER_AUTHORITY"
                android:value="$PACKAGE_NAME.fileprovider" />

            <intent-filter android:autoVerify="true">
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

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="$PACKAGE_NAME.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>
</manifest>
EOF

# Create strings.xml
cat > app/src/main/res/values/strings.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">$APP_NAME</string>
    <string name="asset_statements">
        [{
            "relation": ["delegate_permission/common.handle_all_urls"],
            "target": {
                "namespace": "android_app",
                "package_name": "$PACKAGE_NAME",
                "sha256_cert_fingerprints": ["SHA256_FINGERPRINT_PLACEHOLDER"]
            }
        }]
    </string>
</resources>
EOF

# Create colors.xml
cat > app/src/main/res/values/colors.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">$THEME_COLOR</color>
    <color name="colorPrimaryDark">#5a4891</color>
    <color name="colorAccent">#667eea</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>
EOF

# Create themes.xml
cat > app/src/main/res/values/themes.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.JournOwl" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="LauncherActivityTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/splash</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
    </style>
</resources>
EOF

# Create splash drawable
cat > app/src/main/res/drawable/splash.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/colorPrimary" />
    <item android:gravity="center">
        <bitmap android:src="@mipmap/ic_launcher"
            android:gravity="center" />
    </item>
</layer-list>
EOF

# Create file paths for file provider
mkdir -p app/src/main/res/xml
cat > app/src/main/res/xml/file_paths.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-files-path name="my_images" path="Pictures" />
</paths>
EOF

# Create backup rules
cat > app/src/main/res/xml/backup_rules.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <!-- Exclude internal database -->
    <exclude domain="database" />
</full-backup-content>
EOF

# Create data extraction rules
cat > app/src/main/res/xml/data_extraction_rules.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <!-- Exclude internal database -->
        <exclude domain="database" />
    </cloud-backup>
    <device-transfer>
        <!-- Exclude internal database -->
        <exclude domain="database" />
    </device-transfer>
</data-extraction-rules>
EOF

# Create proguard rules
touch app/proguard-rules.pro

# Create Gradle wrapper
mkdir -p gradle/wrapper
cat > gradle/wrapper/gradle-wrapper.properties << 'EOF'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOF

# Create gradlew script
cat > gradlew << 'EOF'
#!/usr/bin/env sh
exec gradle "$@"
EOF
chmod +x gradlew

print_success "Android project structure created!"
print_step "Now downloading app icons..."

# Download icons from the live app
for size in 72 96 128 144 152 192 384 512; do
    echo "Downloading ${size}x${size} icon..."
    curl -s "https://journowl.app/icons/icon-${size}x${size}.png" -o "app/src/main/res/mipmap-hdpi/ic_launcher.png" 2>/dev/null || echo "Icon download failed for ${size}x${size}"
done

# Use the 192x192 as the main launcher icon
curl -s "https://journowl.app/icons/icon-192x192.png" -o "app/src/main/res/mipmap-hdpi/ic_launcher.png" 2>/dev/null
curl -s "https://journowl.app/icons/icon-192x192.png" -o "app/src/main/res/mipmap-mdpi/ic_launcher.png" 2>/dev/null
curl -s "https://journowl.app/icons/icon-192x192.png" -o "app/src/main/res/mipmap-xhdpi/ic_launcher.png" 2>/dev/null
curl -s "https://journowl.app/icons/icon-192x192.png" -o "app/src/main/res/mipmap-xxhdpi/ic_launcher.png" 2>/dev/null
curl -s "https://journowl.app/icons/icon-192x192.png" -o "app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" 2>/dev/null

print_success "Icons downloaded!"

cd ..
print_success "Android project created successfully at: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Generate keystore: ./generate-keystore.sh"
echo "2. Build AAB: ./build-aab-final.sh"
echo "3. Upload to Google Play Console"