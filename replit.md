# JournOwl Application

## Overview

JournOwl is a comprehensive, multi-dashboard journaling application that combines the wisdom of an owl with AI-powered insights to provide personalized experiences for different user types. Features include animated backgrounds, AI-powered insights, comprehensive analytics, role-based dashboards, and an inviting user interface designed to encourage daily journaling habits.

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
- **Session Management**: Express sessions with PostgreSQL session store
- **Authentication**: Session-based authentication with bcrypt for password hashing + OAuth integration
- **Database Provider**: Replit PostgreSQL Database
- **Email Service**: SendGrid integration for welcome emails and campaigns

## Key Components

### Multi-Dashboard Architecture
- **Admin Dashboard**: Comprehensive analytics, user management, live activity feeds, AI insights, and platform metrics
- **Professional Dashboard**: Advanced features with analytics, goal tracking, achievements, mood trends, and personalized AI insights  
- **Kid Dashboard**: Colorful, safe interface with fun prompts, badges, simplified stats, and encouraging messaging
- **Account Selector**: Beautiful demo interface showcasing all dashboard types with live previews

### Smart Journal Editor - AI-Powered Writing Experience
- **Rich Text Editor**: Markdown-powered editor with live preview and extensive formatting options
- **Font & Color Customization**: 10+ font families, adjustable font sizes, custom text and background colors
- **Photo Upload & AI Analysis**: Drag-and-drop photo uploads with automatic AI content analysis
- **AI Photo Insights**: Extracts emotions, objects, people, activities, location, and mood from images
- **Intelligent Tagging**: Auto-generated tags from photos and content for easy organization
- **AI Writing Assistant**: Context-aware prompt generation based on mood, photos, and previous entries
- **Drawing Tools**: Built-in canvas for sketches and doodles (coming soon - professional drawing tools)
- **Private Entries**: Toggle for confidential journal entries with enhanced privacy
- **Multi-tab Interface**: Seamlessly switch between writing, drawing, photos, and preview modes
- **Real-time Word Count**: Live analytics showing reading time and word statistics

### Enhanced Database Schema
- **Users**: Extended with roles, themes, avatars, bios, quotes, preferences, and AI personality settings
- **Journal Entries**: Rich content with font styling, colors, drawings, photos, AI insights, tags, and privacy settings
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

### Advanced AI Integration
- **OpenAI GPT-4o Vision Model** for comprehensive content analysis:
  - **Photo Analysis**: Extracts emotions, objects, people, activities, locations, and contextual information
  - **Smart Journal Prompts**: Context-aware writing suggestions based on mood, photos, and previous entries  
  - **Content Insights**: Deep analysis of writing patterns, themes, and emotional trends
  - **Intelligent Tagging**: Automatic tag generation from photos and text content
  - **Personalized Recommendations**: Tailored prompts and insights based on user history and preferences
- **AI Sidekick Personality**: Configurable AI assistant with different personality types (friendly, professional, creative)
- **Memory Extraction**: AI identifies and highlights meaningful moments from photos for journaling inspiration

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

## Recent Changes

### July 15, 2025 - Smart Journal Full-Width Layout & Photo Editing Complete
- ✅ **Full-Width Smart Journal**: Expanded journal interface to use 95% of screen width for better usability
- ✅ **Enhanced Writing Area**: Writing area now uses 2/3 of available space with flex-[2] layout for more room
- ✅ **Calendar Widget Removed**: Removed bottom calendar widget as requested for cleaner interface
- ✅ **Photo Resizing Controls**: Added interactive width/height sliders (100-400px width, 100-300px height)
- ✅ **Photo Selection System**: Click any uploaded photo to select and edit it with visual selection indicators
- ✅ **Drawing on Photos**: Toggle drawing mode to annotate photos with canvas overlay functionality
- ✅ **Title Customization**: Added font family and color controls for journal entry titles
- ✅ **Prominent Date Display**: Date now shows in bright red neon with text shadow effects for high visibility
- ✅ **Enhanced Photo Editor**: Comprehensive photo editing interface with size controls and drawing tools
- ✅ **Real-Time Photo Resizing**: Photos dynamically resize as users adjust sliders with live preview

### July 15, 2025 - Achievement Progress Tracking Complete
- ✅ **Real Achievement Progress Display**: Each achievement now shows specific progress requirements (e.g., "0/100 words", "0/7 days", "0/10 photos")
- ✅ **Dynamic Progress Bars**: Progress bars now reflect actual user stats instead of hardcoded values
- ✅ **Real-Time Achievement Unlocking**: Achievements automatically unlock when user meets requirements based on actual stats
- ✅ **Specific Progress Tracking**: Different tracking for entries, words, streaks, photos, moods, etc. based on achievement type
- ✅ **Fresh User Data Display**: Removed all hardcoded progress values - achievements now start locked, goals at 0% progress
- ✅ **Fixed Insights Tab Error**: Resolved toLocaleString() error by adding proper null checks for undefined stats
- ✅ **Fixed "NaN%" Goal Progress**: Corrected progress calculation to use currentValue/targetValue instead of non-existent progress property
- ✅ **Real-Time Tracking Backend**: Implemented comprehensive AchievementTracker service that monitors user actions
- ✅ **Database Schema Updates**: Added tracking columns for achievement_id, rarity, target/current values for real progress monitoring
- ✅ **Frontend Data Consistency**: All defaultAchievements and defaultGoals now start completely fresh (locked/0% progress)
- ✅ **API Integration**: Enhanced tracking system automatically updates user XP, achievements, and goals based on journaling behavior

### July 15, 2025 - AI Prompt Tracking & Subscription Management Complete
- ✅ **Comprehensive AI Prompt Tracking**: Implemented trackable OpenAI calls across all 7 AI services (journal prompts, insights, photo analysis, chat responses, kids prompts, entry analysis)
- ✅ **Usage Meters Dashboard Component**: Created real-time usage meters showing AI prompts remaining (85/100) and storage usage with animated progress bars
- ✅ **Subscription API Integration**: Connected /api/subscription endpoint with proper authentication and real user data
- ✅ **AI Prompt Monetization**: Complete $2.99 for 100 additional prompts system with Stripe payment integration
- ✅ **Storage Tracking System**: Implemented photo/attachment storage monitoring with MB usage calculation
- ✅ **Usage Meters Always Visible**: Placed subscription management interface prominently at top of dashboard for maximum visibility
- ✅ **Prompt Usage Middleware**: Created trackableOpenAICall wrapper function to monitor and limit AI API consumption
- ✅ **Real-Time Subscription Data**: Usage meters display live data from database including tier, prompts remaining, storage used
- ✅ **Multi-Service AI Tracking**: All OpenAI calls now properly tracked: generateJournalPrompt, generatePersonalizedPrompt, generateInsight, photo analysis, chat responses, kids prompts
- ✅ **Enhanced Error Handling**: Improved subscription API error handling and authentication validation

### July 15, 2025 - Previous Core Features
- ✅ **Comprehensive Achievement System**: Expanded from 12 to 24 achievements with varied rarity levels (common, rare, epic, legendary)
- ✅ **Advanced Goals Tracking**: Expanded from 12 to 24 goals across multiple categories and difficulty levels (beginner, intermediate, advanced)
- ✅ **Enhanced Visual Design**: Goals now feature color-coded difficulty backgrounds and appropriate icons for each category
- ✅ **Achievement Rarity System**: Proper visual indicators with legendary golden effects, epic purple gradients, rare blue themes
- ✅ **Real-Time Progress Calculation**: Goals show accurate progress percentages based on current vs target values
- ✅ **Category-Based Organization**: Goals include streak, writing, mood, creative, reflection, mindfulness, adventure, social, memory, and dreams
- ✅ **Real-Time User Data Integration**: All new users now get completely fresh, personal data instead of demo content
- ✅ **Fresh User Stats Creation**: New registrations automatically create user stats and "Welcome to JournOwl!" achievement
- ✅ **Analytics Dashboard Connected**: All analytics cards now display real user data (entries, words, streaks, mood)
- ✅ **Insights API Implemented**: Real-time personalized insights based on user's actual journaling patterns
- ✅ **OAuth User Data**: Google, Facebook, LinkedIn login also creates fresh user stats and achievements
- ✅ **Input Field Interactivity Fixed**: Added pointerEvents CSS fixes to ensure form inputs are clickable
- ✅ **Backend API Endpoints**: Added /api/stats, /api/achievements, /api/insights for complete dashboard functionality

### July 15, 2025 - JournOwl Branding Complete
- ✅ **JournOwl Rebranding Complete**: Updated entire app to use clever "JournOwl" name (journal + owl for wisdom)
- ✅ **Owl Emoji Integration**: Added 🦉 emojis throughout interface for smart journaling theme
- ✅ **Landing Page Updated**: "JournOwl" branding with animated owl emoji and wisdom messaging
- ✅ **Auth Page Enhanced**: Beautiful "🦉 JournOwl" title with owl icon and "Your Wise Writing Companion" tagline
- ✅ **Dashboard Branding**: All dashboard types now feature JournOwl branding and owl elements
- ✅ **Admin Interface Updated**: Admin dashboard shows "🦉 JournOwl Admin Dashboard" with community messaging
- ✅ **Navigation Consistency**: Navbar and all components consistently use JournOwl branding
- ✅ **Critical Bug Fixed**: Resolved AuthPage duplicate landing page issue by setting showAuth state to true

### Previous Updates - July 15, 2025
- ✅ **Database Schema Fixed**: Resolved all column missing errors by updating PostgreSQL schema
- ✅ **Welcome Email System**: Implemented comprehensive, colorful welcome emails with app tutorial
- ✅ **Admin Account Created**: CraftyGuru@1ofakindpiece.com set up with admin privileges
- ✅ **Registration Flow**: Users now receive beautiful welcome emails upon signup
- ✅ **Session Storage**: Upgraded to PostgreSQL session store for production readiness
- ✅ **Enhanced Dashboard Default**: All new users now get the beautiful enhanced dashboard with animated cards, comprehensive analytics, and smart journal features
- ✅ **Admin Routing Fixed**: Admin users properly see management dashboard, regular users see enhanced journaling interface
- ✅ **Navigation Improvements**: Added logout button and fixed landing page accessibility
- ✅ **Admin Dashboard Purified**: Admin users see ONLY admin tools (no journaling, XP, streaks, entries)
- ✅ **Admin Name Display**: Shows clean "CraftyGuru" instead of "CraftyGuru_Admin" in all UI
- ✅ **Enhanced Dashboard Personalized**: New users get fresh personal data instead of Emma's demo data
- ✅ **Demo Mode Implementation**: Emma's demo data now shows with `?demo=true` URL parameter instead of username detection
- ✅ **Admin Card Removal**: Removed admin test account from public account selector for security
- ✅ **Enhanced Kids Dashboard**: Completely rebuilt with interactive features, real user data integration, and colorful design
- ✅ **Interface Switcher**: Added toggle between kid and adult modes with smooth transitions and context preservation
- ✅ **Kids Demo Data**: Little Timmy's demo content shows in demo mode with 23 entries, 8-day streak, and kid-friendly achievements
- ✅ **Interactive Prompts**: Random prompt generator with 10+ kid-friendly writing prompts and animated interactions
- ✅ **Multi-Mode Architecture**: Seamless switching between interfaces while maintaining user session and data

The application follows a typical full-stack architecture with clear separation between client and server code, shared types, and a PostgreSQL database for persistence. The AI integration, gamification features, and comprehensive email system make it more engaging than a basic journaling app.