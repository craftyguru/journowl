# PWABuilder Keystore Error Fix

## The Error
```
Failed to load signer "signer #1": entry "journowl-release" does not contain a key
```

This means PWABuilder can't find the key alias `journowl-release` in the keystore.

## The Problem
Our keystore was created with a different alias name than what we're telling PWABuilder to use.

## The Solution

### Step 1: Check Our Keystore Alias
```bash
keytool -list -keystore deployment-package/journowl-release-key.jks -storepass journowl2024
```

### Step 2: Use Correct Alias in PWABuilder
Based on the actual alias in our keystore, use these values:

- **Key alias**: `[ACTUAL_ALIAS_FROM_KEYSTORE]`
- **Key password**: `journowl2024`  
- **Key store password**: `journowl2024`

### Step 3: Alternative - Create New Keystore with Correct Alias
```bash
cd deployment-package

# Create new keystore with specific alias for PWABuilder
keytool -genkeypair \
    -keystore pwabuilder-key.jks \
    -alias journowl-release \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass journowl2024 \
    -keypass journowl2024 \
    -dname "CN=JournOwl,OU=Development,O=JournOwl,L=City,ST=State,C=US"
```

Then upload `pwabuilder-key.jks` to PWABuilder with:
- **Key alias**: `journowl-release`
- **Key password**: `journowl2024`  
- **Key store password**: `journowl2024`

## Remember the Google Play Issue
Even if PWABuilder succeeds, the resulting AAB will still be rejected by Google Play Console because the certificate fingerprints don't match.

**Best approach**: Download Google's upload certificate from Play Console and use that with PWABuilder instead.