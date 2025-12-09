import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { storage } from './storage';
import type { User } from '@shared/schema';

// OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';

// Determine the base URL for OAuth callbacks
const getOAuthBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://journowl.app';
  }
  // For development, use the request origin
  return process.env.OAUTH_CALLBACK_URL || 'http://localhost:5000';
};

const OAUTH_BASE_URL = getOAuthBaseURL();

export function setupOAuth() {
  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy - Always register with error handling for missing credentials
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID || 'placeholder',
    clientSecret: GOOGLE_CLIENT_SECRET || 'placeholder',
    callbackURL: `${OAUTH_BASE_URL}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    // Check if OAuth is properly configured
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return done(new Error('Google OAuth credentials not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment variables.'), null);
    }
    
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Google info
        await storage.updateUser(user.id, {
          provider: 'google',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          lastLoginAt: new Date(),
          emailVerified: true
        });
        user = await storage.getUser(user.id);
      } else {
        // Create new user - consent will be set on first successful login
        user = await storage.createUser({
          email,
          username: email.split('@')[0] + '_' + Date.now(),
          provider: 'google',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          emailVerified: true,
          lastLoginAt: new Date()
        });
        
        // Create user stats
        await storage.createUserStats(user.id);
      }

      // Log activity
      await storage.logUserActivity(user.id, 'oauth_login', { provider: 'google' });
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

  // Facebook OAuth Strategy - Always register with error handling for missing credentials
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID || 'placeholder',
    clientSecret: FACEBOOK_APP_SECRET || 'placeholder',
    callbackURL: `${OAUTH_BASE_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    // Check if OAuth is properly configured
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      return done(new Error('Facebook OAuth credentials not configured. Please add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to environment variables.'), null);
    }
    
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Facebook profile'), null);
      }

      let user = await storage.getUserByEmail(email);
      
      if (user) {
        await storage.updateUser(user.id, {
          provider: 'facebook',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          lastLoginAt: new Date(),
          emailVerified: true
        });
        user = await storage.getUser(user.id);
      } else {
        user = await storage.createUser({
          email,
          username: email.split('@')[0] + '_' + Date.now(),
          provider: 'facebook',
          providerId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          emailVerified: true,
          lastLoginAt: new Date()
        });
        
        await storage.createUserStats(user.id);
      }

      await storage.logUserActivity(user.id, 'oauth_login', { provider: 'facebook' });
      
      return done(null, user);
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      return done(error, null);
    }
  }));
}

export { passport };