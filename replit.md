# JournOwl Application

## Overview
JournOwl is a multi-dashboard journaling application that leverages AI to provide personalized experiences. It aims to encourage daily journaling through an inviting user interface, animated backgrounds, AI-powered insights, comprehensive analytics, and role-based dashboards. The project's vision is to combine intuitive design with advanced AI to create a unique and engaging journaling platform for diverse user types, fostering self-reflection and personal growth.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Animated, colorful, inviting design that gets users excited to test and use the app regularly.

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
- **Session Management**: Express sessions with PostgreSQL session store
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

## External Dependencies

- **Database**: @neondatabase/serverless (for PostgreSQL connection), drizzle-orm (ORM)
- **Authentication**: bcrypt (password hashing), express-session
- **AI**: OpenAI API (for GPT-4o Vision and other AI features)
- **Email**: SendGrid
- **UI/UX Components**: @radix-ui, shadcn/ui, Tailwind CSS
- **Charting**: recharts
- **Animations**: Framer Motion
- **Build Tools**: Vite, ESBuild
- **Payment Processing (planned)**: Stripe (currently optional, with robust error handling for missing keys)
- **PWA Tools**: PWABuilder (for validation)