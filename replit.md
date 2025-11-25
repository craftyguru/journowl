# JournOwl Application

## Overview
JournOwl is a multi-dashboard journaling application that leverages AI to provide personalized experiences. It aims to encourage daily journaling through an inviting user interface, animated backgrounds, AI-powered insights, comprehensive analytics, and role-based dashboards. The project's vision is to combine intuitive design with advanced AI to create a unique and engaging journaling platform for diverse user types, fostering self-reflection and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Animated, colorful, inviting design that gets users excited to test and use the app regularly.

## ✅ SESSION 11 COMPLETE - 4 PREMIUM ENGAGEMENT FEATURES DEPLOYED (November 25, 2025)

### Four Major Premium Features - NOW LIVE 🎯

#### 1. **Shareable User Profiles** 👥
- **Public profile pages** (no auth required)
- **Stats dashboard** showing entries, words written, current/longest streaks
- **Achievement badges** (6 most recent)
- **Subscription tier indicator**
- **One-click share links** with copy-to-clipboard
- **Leaderboard integration** - click any user to view their profile
- **Public API** `/api/users/:userId/profile`

#### 2. **Smart Notifications Center** 🔔
- **Navbar bell icon** with unread count badge
- **Streak milestone celebrations** for 7, 14, 30, 60, 100-day streaks
- **Browser push notifications** with native OS integration
- **Toast alerts** for achievements
- **Personalized reminder messages** based on current/longest streak
- **Notifications dropdown** with dismiss/clear options
- **Real-time milestone detection** for entries, words, and achievements
- **Three API endpoints**:
  - `/api/notifications/subscribe` - push notification setup
  - `/api/notifications/streak-reminder` - reminder message generation
  - `/api/notifications/check-milestones` - milestone detection

#### 3. **AI Coaching System** ✨
- **Personalized daily prompts** analyzing last 30 days of entries
- **Mood trend analysis** (improving/declining/stable)
- **Smart growth recommendations** based on user stats
- **Three coaching focus areas**: Growth, Support, Reflection
- **Real-time mood pattern detection** from recent journal entries
- **Actionable tips** tailored to each user's journey
- **Live in journal tab** between AI Summary and Voice Journal
- **Backend service** `coachingService.ts` with mood analysis
- **API endpoint** `/api/coaching/daily-prompt`

#### 4. **PDF Export (Premium Feature)** 📄
- **Export button** in journal tab with professional styling
- **Time range filtering**: Last 7 Days, 30 Days, Year, or All Time
- **Export options**:
  - Include summary statistics (entries, words, streaks)
  - Include entry images and media
- **Beautiful PDF generation** using jsPDF library
- **Professional formatting** with:
  - Branded title page with JournOwl logo
  - Summary statistics section
  - Individual entry pages with mood indicators
  - Tags and metadata preserved
  - Word count tracking per entry
  - Professional footer with app branding
- **Auto-generated filenames** with export date
- **Toast notifications** for export status
- **Seamless download** experience

---

## ✅ SESSION 10 COMPLETE - ENGAGEMENT FEATURES DEPLOYED (November 25, 2025)

### Voice Journaling Feature - NOW LIVE 🎙️

**Complete Voice-to-Text Journal Entry System:**

#### Frontend Components:
- **VoiceJournal.tsx** (6,457 bytes)
  - Record/stop recording controls with animated mic icon
  - Real-time duration timer (MM:SS format)
  - Audio playback with HTML5 audio element
  - Discard/submit buttons with loading states
  - Toast notifications for user feedback
  - Mobile-friendly responsive design

#### Backend Services:
- **voiceService.ts** (3,214 bytes) - 3 AI-powered methods:
  1. `transcribeAudio()` - OpenAI Whisper API speech-to-text
  2. `detectMood()` - GPT-4o mood analysis from transcribed text
  3. `generateTags()` - GPT-4o auto-tagging of journal entries

#### API Integration:
- `POST /api/journal/voice` - Full voice entry pipeline
  - Audio file upload via multipart/form-data
  - Automatic transcription with Whisper
  - Mood detection and tagging
  - Journal entry creation with metadata
  - Temp file cleanup

---

## ✅ SESSION 8 COMPLETE - PREMIUM & MONETIZATION FEATURES DEPLOYED

### Core Improvements Delivered:
**1. Premium Feature Gating** ✨
**2. Referral System** 🎁
**3. Push Notifications** 📱
**4. Onboarding Flow** 🚀
**5. Stripe Payment Integration** 💳

---

## ✅ SESSION 7 COMPLETE - ENGAGEMENT FEATURES DEPLOYED

### Engagement System - NOW LIVE ✨
**3 Major Retention Features Added:**

#### 1. **Weekly Challenges System** ⚡
#### 2. **Mood Trends Analytics** 📊
#### 3. **Email Reminders System** 📧

---

## System Architecture

### Frontend Architecture
- **Frameworks**: React with TypeScript, Vite (build tool)
- **Styling**: Tailwind CSS with shadcn/ui components (30+ components), Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: React Query (@tanstack/react-query v5)
- **Charts**: Recharts for data visualization
- **PDF Export**: jsPDF + html2canvas for document generation
- **Visual Effects**: Custom animated backgrounds (smoke particles, starry night, animated owls)
- **Component Organization**: 7 logical folders + /ui for shadcn components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Replit, Drizzle ORM)
- **Session Management**: Express sessions with In-Memory store
- **Authentication**: Session-based, bcrypt, OAuth, CAPTCHA
- **Email Service**: SendGrid integration
- **WebSocket**: Real-time support chat
- **AI Services**: OpenAI Whisper (speech-to-text) + GPT-4o (analysis)

## External Dependencies
- Database: @neondatabase/serverless, drizzle-orm
- Auth: bcrypt, express-session, passport
- AI: OpenAI API (GPT-4o Vision + Whisper)
- Email: SendGrid
- Voice: Web Audio API, MediaRecorder
- PDF: jsPDF, html2canvas
- UI: @radix-ui, shadcn/ui, Tailwind CSS
- Charts: recharts
- Animations: Framer Motion
- Build: Vite, ESBuild

## Features by Tier

| Feature | Free | Pro | Power |
|---------|------|-----|-------|
| Voice Journal | ✓ | ✓ | ✓ |
| Text Journal | ✓ | ✓ | ✓ |
| AI Coaching | ✓ | ✓ | ✓ |
| AI Prompts | 100/mo | ∞ | ∞ |
| Mood Tracking | ✓ | ✓ | ✓ |
| Challenges | Limited | Full | Full |
| Analytics | Basic | Advanced | Advanced |
| Notifications | ✓ | ✓ | ✓ |
| Shareable Profiles | ✓ | ✓ | ✓ |
| PDF Export | ✗ | ✓ | ✓ |
| AI Coaching Premium | ✗ | ✗ | ✓ |
| Custom AI Personality | ✗ | ✗ | ✓ |
| Referral Program | ✓ | ✓ | ✓ |

## Recent Session Summary

**Session 11 Focus: Premium Monetization & Maximum Engagement**
- Built shareable user profiles with public API
- Implemented smart notifications center with streak milestones
- Created AI coaching system for personalized daily guidance
- Added PDF export for Pro/Power tiers to monetize premium users
- 100% production-ready with zero errors
- All features integrated and tested

## Next Steps (Future Sessions)
1. **Team/Family Shared Journals** - Collaborative journaling spaces
2. **Advanced Analytics** - Mood prediction and pattern analysis
3. **AI-Powered Summaries Premium** - Extended weekly/monthly reviews
4. **Global Leaderboards** - User competitions and challenges
5. **API Integrations** - Spotify, Weather, Google Calendar sync
6. **Mobile App** - Native iOS/Android apps for on-the-go journaling

## Build Status
✅ Zero TypeScript errors
✅ Production build successful (278.2kb)
✅ App running on port 5000
✅ All features mounted and functional
✅ PDF export fully integrated
✅ Ready for user testing and publishing

---
