# Download Google's Upload Certificate

## The Issue
Google Play Console doesn't let you upload PEM certificates - you must use their pre-generated certificate.

## Solution: Download Google's Certificate

### Step 1: Find the Download Option
In Google Play Console > Release > Setup > **App integrity**, look for:
- "Download upload certificate" button
- "Export upload certificate" 
- Small download icon next to the certificate fingerprints

### Step 2: Download the Certificate
Click the download button and save the file as `google-upload-key.pem`

### Step 3: Use with PWABuilder
1. Go back to PWABuilder.com
2. Enter: https://journowl.app  
3. Click "Package For Stores" → "Android"
4. When asked for signing options, upload the `google-upload-key.pem` file
5. Leave other fields blank (PWABuilder will extract details automatically)

### Step 4: Upload New AAB
Upload the newly generated AAB to Google Play Console - it should be accepted immediately.

## If No Download Option Exists

Some Google Play Console accounts don't show download options. In that case:

### Alternative: Reset App Signing
1. In App integrity section, look for "Reset upload key" 
2. Generate a new upload certificate
3. Use our existing keystore with the new certificate

### Alternative: Contact Google Support  
If neither option works, contact Google Play Console support to reset the upload certificate for your app.

## Quick Test
Before going through PWABuilder again, try simply re-uploading your existing AAB - sometimes Google Play Console accepts it on the second try after you've viewed the App integrity page.