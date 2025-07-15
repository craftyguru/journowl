# MoodJournal Application

## Overview

This is a comprehensive, multi-dashboard journaling application that provides personalized experiences for different user types. Features include animated backgrounds, AI-powered insights, comprehensive analytics, role-based dashboards, and an inviting user interface designed to encourage daily journaling habits.

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX preferences: Animated, colorful, inviting design that gets users excited to test and use the app regularly.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth animations and transitions
- **State Management**: React Query (@tanstack/react-query) for server state
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Charts**: Recharts for data visualization
- **Visual Effects**: Custom animated background with interactive smoke particles

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with in-memory store
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **Database Provider**: Replit PostgreSQL Database

## Key Components

### Multi-Dashboard Architecture
- **Admin Dashboard**: Comprehensive analytics, user management, live activity feeds, AI insights, and platform metrics
- **Professional Dashboard**: Advanced features with analytics, goal tracking, achievements, mood trends, and personalized AI insights  
- **Kid Dashboard**: Colorful, safe interface with fun prompts, badges, simplified stats, and encouraging messaging
- **Account Selector**: Beautiful demo interface showcasing all dashboard types with live previews

### Enhanced Database Schema
- **Users**: Extended with roles (admin/user/kid), themes, avatars, bios, and quotes
- **Journal Entries**: Content, mood tracking, word counts, and timestamps
- **Achievements**: Comprehensive badge system with rarity levels and unlock conditions
- **User Stats**: Detailed analytics including streaks, word counts, and progress metrics
- **Goals**: Personal goal setting and tracking system
- **Mood Trends**: Time-series mood data for analytics
- **Journal Prompts**: Categorized prompts with difficulty levels and kid-friendly flags
- **Admin Analytics**: Platform-wide statistics and insights

### Authentication System
- Session-based authentication using express-session
- Password hashing with bcrypt
- Middleware for protecting routes
- User registration and login endpoints

### AI Integration
- OpenAI GPT-4o integration for:
  - Generating journal prompts
  - Creating personalized prompts based on recent entries
  - Providing insights and analysis of journal content

### Gamification Features
- XP system with levels (1000 XP per level)
- Achievement system for various milestones
- Streak tracking for consecutive days of journaling
- Progress visualization

## Data Flow

1. **User Authentication**: Users register/login through the auth endpoints
2. **Journal Creation**: Users write entries with mood selection and AI-generated prompts
3. **Data Storage**: Entries are stored in PostgreSQL with automatic word counting
4. **Statistics Update**: User stats are updated after each entry (XP, streaks, word counts)
5. **Insights Generation**: AI analyzes entries to provide personalized insights
6. **Progress Tracking**: Dashboard displays user progress, achievements, and mood trends

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm for database operations
- **Authentication**: bcrypt for password hashing
- **AI**: OpenAI API for prompt generation and insights
- **UI**: @radix-ui components for accessible UI primitives
- **Charts**: recharts for data visualization

### Development Tools
- **TypeScript**: For type safety across the stack
- **ESBuild**: For server-side bundling
- **Vite**: For client-side development and building
- **Tailwind CSS**: For utility-first styling

## Deployment Strategy

### Build Process
- **Client**: Built with Vite, outputs to `dist/public`
- **Server**: Bundled with ESBuild, outputs to `dist/index.js`
- **Database**: Migrations handled by Drizzle Kit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session signing
- `OPENAI_API_KEY`: OpenAI API key for AI features

### Production Setup
- Express server serves both API routes and static files
- Session store should be replaced with persistent storage (Redis/PostgreSQL)
- Database migrations run via `npm run db:push`

### Development vs Production
- Development uses Vite dev server with HMR
- Production serves built static files from Express
- Different session configurations for security

The application follows a typical full-stack architecture with clear separation between client and server code, shared types, and a PostgreSQL database for persistence. The AI integration and gamification features make it more engaging than a basic journaling app.