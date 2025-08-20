# Authentication Fix for Android App Blank Screen

## Problem Identified
The Android app (and web app for new users) was showing a blank screen because:

1. **Fatal 401 errors** - The `/api/auth/me` route returned 401 for new users
2. **React app crash** - 401 responses caused the app to fail during initialization  
3. **No graceful fallback** - New users couldn't reach the landing page

## Root Cause
The `/api/auth/me` route used `requireAuth` middleware that returned:
```
{"message":"Authentication required","debug":{"sessionExists":true,"sessionId":"..."}}
Status: 401
```

This caused the React app to crash before it could route to the login page.

## Complete Fix Applied

### 1. Safe Backend Routes
**New `/api/auth/me` route** (server/routes.ts):
- **Always returns 200** (never 401)
- **Returns `{loggedIn: false}`** for new users
- **Returns `{loggedIn: true, user: {...}}`** for authenticated users
- **Added alternative `/me` route** for compatibility

### 2. Safe Frontend Authentication
**Updated `getCurrentUser()`** (client/src/lib/auth.ts):
- **Checks `data.loggedIn`** instead of HTTP status codes
- **Graceful error handling** without throwing on 401s

**New `checkAuthStatus()`** (client/src/lib/authBoot.ts):
- **Safe authentication check** that never throws
- **Returns auth status object** instead of throwing errors
- **Fail-safe fallback** to `{loggedIn: false}`

### 3. Updated App Initialization
**Modified App.tsx**:
- **Uses `checkAuthStatus()`** instead of direct fetch calls
- **Safe error handling** during app initialization
- **Proper routing** for new vs authenticated users

### 4. Enhanced CSP for Stripe
**Updated Content Security Policy**:
- **Added `https://js.stripe.com`** to script-src
- **Unblocks Stripe** initialization and payment features

## Expected Results

### For New Users (First Time):
1. **Open app** → `/api/auth/me` returns `{loggedIn: false}` (200 status)
2. **App initializes** without crashing
3. **Routes to landing page** (`/`) for signup/login
4. **No more blank screens**

### For Android WebView:
1. **WebView loads** journowl.app successfully  
2. **No 401 errors** causing app crashes
3. **Service worker disabled** to prevent conflicts
4. **Error banner visible** if any issues occur

### For Existing Users:
1. **Authenticated sessions** continue working normally
2. **Returns user data** with `{loggedIn: true, user: {...}}`
3. **Dashboard access** maintained

## Test Steps

1. **Clear browser data** or use incognito mode
2. **Visit https://journowl.app** 
3. **Should see landing page** instead of blank screen
4. **Network tab shows** `/api/auth/me` → 200 with `{loggedIn: false}`
5. **Android app** should now show landing page instead of blank screen

## Files Modified
- ✅ `server/routes.ts` - Safe authentication routes
- ✅ `client/src/lib/auth.ts` - Updated getCurrentUser()
- ✅ `client/src/lib/authBoot.ts` - New safe auth functions  
- ✅ `client/src/App.tsx` - Safe app initialization
- ✅ `server/index.ts` - Enhanced CSP for Stripe
- ✅ `client/index.html` - Android WebView compatibility

The blank screen issue should now be completely resolved for both new users and Android app users.