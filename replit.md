# MoodJournal Application

## Overview

This is a full-stack journaling application built with React and Express that allows users to write journal entries, track their mood, and gain insights from their writing patterns. The app includes gamification features with XP, levels, and achievements to encourage regular journaling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with in-memory store
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **Database Provider**: Replit PostgreSQL Database

## Key Components

### Database Schema
- **Users**: Stores user credentials, level, and XP
- **Journal Entries**: Contains journal content, mood, word count, and timestamps
- **Achievements**: Tracks unlocked achievements for gamification
- **User Stats**: Aggregates user statistics like total entries, streaks, and word counts

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