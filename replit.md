# JournOwl Application

## Overview
JournOwl is a multi-dashboard journaling application that leverages AI to provide personalized experiences. It aims to encourage daily journaling through an inviting user interface, animated backgrounds, AI-powered insights, comprehensive analytics, and role-based dashboards. The project's vision is to combine intuitive design with advanced AI to create a unique and engaging journaling platform for diverse user types, fostering self-reflection and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Animated, colorful, inviting design that gets users excited to test and use the app regularly.

## Current Modulization Status (November 25, 2025)

### ✅ COMPLETED MODULIZATION
- **Dashboard Components (13 files)**: StatsCards, JournalTabs, UsageMetersSection, EnhancedDashboard, AchievementsSection, GoalsSection, AnalyticsSection, InsightsSection, CalendarSection, CameraCapture, GoalComponents, TypewriterComponents, WelcomeBanner
- **UI Components**: Fully modularized shadcn/ui library (30+ components)
- **Core Pages**: auth.tsx, dashboard.tsx, email flows, privacy/terms pages
- **Editor**: SmartJournalEditor with AI features, drawing canvas, photo upload

### ⏳ NEEDS MODULIZATION
**High Priority:**
1. **auth.tsx** (35KB) - Needs to be split into: LoginForm, SignupForm, OAuthButtons, PasswordReset, EmailVerification
2. **insights.tsx** (65KB) - Needs: InsightsSummary, InsightsCharts, InsightsList, AIRecommendations
3. **dashboard.tsx** (17KB) - Needs: DashboardHeader, DashboardNav, DashboardContent, DashboardStats
4. **Large Components** (~50 files) - Need categorization into: interactive-journal, journal-editor, analytics, profile, settings, etc.

**Medium Priority:**
5. Admin dashboard components
6. Kid dashboard components  
7. Shared utility components
8. Forms library (standardized forms)
9. Animations library (reusable animations)

## System Architecture

### Frontend Architecture
- **Frameworks**: React with TypeScript, Vite (build tool)
- **Styling**: Tailwind CSS with shadcn/ui components, Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: React Query (@tanstack/react-query)
- **Charts**: Recharts for data visualization
- **Visual Effects**: Custom animated backgrounds (e.g., interactive smoke particles, starry night, animated owls)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Replit PostgreSQL Database, Drizzle ORM)
- **Session Management**: Express sessions with In-Memory store (for development stability)
- **Authentication**: Session-based authentication, bcrypt for password hashing, OAuth integration, CAPTCHA for registration.
- **Email Service**: SendGrid integration for transactional emails and campaigns.
- **WebSocket**: Real-time support chat system.

### Key Features & Design Patterns
- **Multi-Dashboard Architecture**: Admin, Professional, and Kid dashboards, each with tailored UI and features. An account selector allows live previews.
- **Smart Journal Editor**: Markdown-powered rich text editor with font/color customization, photo upload with AI analysis, intelligent tagging, AI writing assistant, and multi-tab interface.
- **Enhanced Database Schema**: Extended user profiles, rich journal entry content, achievement system, goal tracking, mood trends, and admin analytics.
- **Advanced AI Integration**: Utilizes OpenAI GPT-4o Vision for photo analysis, smart journal prompts, content insights, intelligent tagging, and personalized recommendations. Features an AI Sidekick with configurable personalities and memory extraction.
- **Gamification**: XP system, achievements with rarity levels, streak tracking, and progress visualization.
- **UI/UX Decisions**: Emphasizes animated, colorful, and inviting design. Includes features like animated modals, custom fonts (Rock Salt), and responsive layouts for mobile optimization. Implements full-screen animated installation guides for PWA.
- **PWA (Progressive Web App) Support**: Full PWA implementation with offline capabilities, background sync, home screen widgets, push notifications, and native Android app installation. Includes advanced caching strategies and file handling integration.
- **Real-Time Progress Tracking**: Goals and achievements update in real-time based on user activity.
- **Flexible Authentication**: Users can sign in with either email or username.
- **Comprehensive Signup Security**: Includes CAPTCHA, scroll-to-accept user agreements (Terms of Service and Privacy Policy), and enhanced password security.
- **Email Verification System**: Professional email templates and a robust verification flow.
- **Analytics Dashboard**: Comprehensive analytics tab with real-time data, mood trends, writing activity, word clouds, writing time heatmaps, and topic clustering.
- **Real-Time Support Chat System**: WebSocket-powered chat with admin and user interfaces.

## Modulization Roadmap

### Phase 1: Large File Decomposition (Priority)
```
auth.tsx (35KB) → components/auth/
├── LoginForm.tsx
├── SignupForm.tsx
├── OAuthButtons.tsx
├── PasswordReset.tsx
└── EmailVerification.tsx

insights.tsx (65KB) → components/insights/
├── InsightsSummary.tsx
├── InsightsCharts.tsx
├── InsightsList.tsx
└── AIRecommendations.tsx

dashboard.tsx (17KB) → components/professional-dashboard/
├── Header.tsx
├── Navigation.tsx
├── Content.tsx
└── Stats.tsx
```

### Phase 2: Dashboard Segregation
```
components/
├── professional-dashboard/ ✅ (13 files)
├── admin-dashboard/ (needs creation)
├── kid-dashboard/ (needs creation)
└── shared/ (common components)
```

### Phase 3: Feature Organization
```
components/
├── journal/ (all journal-related)
├── analytics/ (charts, insights)
├── profile/ (user profile, settings)
├── forms/ (form components)
├── animations/ (reusable animations)
└── ui/ ✅ (shadcn components)
```

## External Dependencies

- **Database**: @neondatabase/serverless (for PostgreSQL connection), drizzle-orm (ORM)
- **Authentication**: bcrypt (password hashing), express-session, memorystore
- **AI**: OpenAI API (for GPT-4o Vision and other AI features)
- **Email**: SendGrid
- **UI/UX Components**: @radix-ui, shadcn/ui, Tailwind CSS
- **Charting**: recharts
- **Animations**: Framer Motion
- **Build Tools**: Vite, ESBuild
- **Payment Processing (planned)**: Stripe (currently optional, with robust error handling for missing keys)
- **PWA Tools**: PWABuilder (for validation)

## Recent Session Fixes
- Fixed database SSL certificate authentication by switching to in-memory session store
- Restored all 8 dashboard tabs with full functionality
- Brought back SmartJournalEditor with drawing canvas and AI features
- Created professional mobile-friendly bottom navigation
- Fixed workflow configuration issues (server now runs successfully on port 5000)
