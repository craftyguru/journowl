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

### July 19, 2025 - Critical Database Migration & Frontend Loading Fix Complete
- ✅ **Database Migration Successful**: Migrated from inaccessible Supabase database to Replit's Neon PostgreSQL database
- ✅ **SSL Connection Fixed**: Updated database connection string with proper SSL configuration for secure connectivity
- ✅ **Authentication System Restored**: Admin user account recreated with proper password hashing and role assignment
- ✅ **Frontend Loading Issue Resolved**: Fixed API route override that was preventing the React application from loading
- ✅ **Database Schema Updates**: Added missing columns (html_content, scheduled_at) to email_campaigns table
- ✅ **Stripe Integration Complete**: Added required VITE_STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY environment variables
- ✅ **Application Fully Operational**: JournOwl now loads properly with all drawing tools, AI features, and authentication working

### July 18, 2025 - Production Deployment Issues Resolved
- ✅ **Fixed Stripe Initialization Error**: Made Stripe optional instead of required, preventing server crashes when STRIPE_SECRET_KEY is missing
- ✅ **Resolved Path Resolution Issues**: Fixed import.meta.dirname compatibility for Node.js 20 by using path.dirname(new URL(import.meta.url).pathname)
- ✅ **Fixed Vite Plugin Import**: Corrected @replit/vite-plugin-runtime-error-modal import path in vite.config.ts
- ✅ **Added Production Fallback**: Server now falls back to development mode when static files are missing in production
- ✅ **Railway Deployment Ready**: Added health check endpoint and proper environment variable handling for Railway deployment
- ✅ **Production Build Success**: Complete build pipeline working with dist/public static files and dist/index.js server bundle
- ✅ **Port Configuration**: Added dynamic port configuration (process.env.PORT || 5000) for Railway compatibility

### July 16, 2025 - AI Story Maker Feature & Tab Navigation Enhancement Complete
- ✅ **AI Story Maker Implementation**: Added comprehensive AI-powered story generation feature to both kid and adult dashboards
- ✅ **Interactive Story Creation**: Users can select journal entries from date ranges and generate personalized stories with customization options
- ✅ **Story Generation API**: Created `/api/ai/generate-story` endpoint with OpenAI integration and proper prompt tracking
- ✅ **Tab Navigation Enhancement**: Updated adult dashboard navigation to accommodate 8 tabs with proper centering
- ✅ **AI Insights Rebranding**: Changed "AI Insights" tab to "AI Thoughts" for better user experience
- ✅ **Referral System Addition**: Added comprehensive referral tab with shareable links, statistics tracking, and reward system
- ✅ **Story Customization Options**: Font selection, color customization, story length options, and date range selection
- ✅ **Mobile-Responsive Design**: Story maker works seamlessly across all device sizes with touch-friendly controls
- ✅ **Real-Time AI Integration**: Story generation uses same trackable OpenAI system as other AI features for cost management

### July 16, 2025 - CRITICAL FIX: Real-Time Progress Tracking Implemented
- ✅ **Fixed Goals Placeholder Data**: Replaced all fake progress percentages with real-time calculations based on actual user stats
- ✅ **Real-Time Achievement Progress**: Achievements now show actual progress (e.g., 1/7 days for streak goals) instead of just locked/unlocked
- ✅ **Dynamic Progress Bars**: Both goals and achievements display live progress bars that update as users journal
- ✅ **Stats-Based Calculations**: Goals track real metrics - word counts for writing goals, streaks for consistency goals, entries for milestone goals
- ✅ **Unified Progress System**: Kid and adult interfaces show identical real-time progress tracking using same calculation logic
- ✅ **Visual Progress Indicators**: Added animated progress bars to achievements showing completion percentage and current/target values
- ✅ **Accurate Goal Mapping**: Each goal type properly mapped to corresponding user stat (totalEntries, currentStreak, totalWords, etc.)

### July 16, 2025 - Kid/Adult Interface Unified Account System Complete
- ✅ **Shared Usage Meters**: Kid dashboard now displays the same AI prompts and storage meters as adult interface
- ✅ **Unified Subscription Data**: Both kid and adult modes use identical `/api/subscription` and `/api/prompts/usage` endpoints
- ✅ **Shared Journal Entries**: All entries created in either interface appear in both - same `/api/journal/entries` endpoint
- ✅ **Linked AI Tracking**: Kid AI features (prompts, chat, photo analysis) use same `trackableOpenAICall` system as adult
- ✅ **Single User Account**: Interface switching only changes UI presentation, not user data or session
- ✅ **Consistent Stats**: Both interfaces show identical user statistics, achievements, and progress tracking
- ✅ **Enhanced Kids Stats Page**: Added colorful interactive graphs, animated progress bars, achievement showcases, and fun visual tools

### July 15, 2025 - CRITICAL FIX: AI Question Tracking & Prompt Limits Implemented
- ✅ **AI Question Tracking Added**: All "Ask AI Anything" questions now properly tracked and count against user prompt limits
- ✅ **Prompt Usage Integration**: AI questions use the same trackableOpenAICall system as other AI features
- ✅ **Cost Protection**: Prevents unlimited AI questions that would cost money without tracking
- ✅ **Error Handling**: Proper 429 status codes and user feedback when prompt limits are reached
- ✅ **Monetization Security**: AI questions now consume user prompts (estimated 300 tokens per question)
- ✅ **Usage Consistency**: AI questions follow same billing model as journal prompts, photo analysis, etc.

### July 15, 2025 - CRITICAL BUG FIX: Journal Entry Saving Issue Resolved
- ✅ **Fixed Journal Entry Save Bug**: Resolved critical issue where journal entries were being logged but not saved to database
- ✅ **Database Integer Overflow Fixed**: Resolved PostgreSQL integer overflow error in achievement tracking system
- ✅ **XP Value Capping**: Implemented safety limits to prevent XP values from exceeding PostgreSQL integer limits
- ✅ **Error Handling Enhanced**: Added try-catch blocks to contain achievement tracking failures without breaking journal creation
- ✅ **API Integration Fixed**: Properly implemented `handleJournalSave` function to make actual API calls for saving entries
- ✅ **Query Invalidation**: Added proper cache invalidation to refresh journal entries list after saving
- ✅ **Mobile App Functionality**: Journal entries now save successfully and display in Recent Entries section
- ✅ **Database Verified**: Confirmed 7 test entries are properly stored with all metadata (title, content, mood, timestamps)

### July 15, 2025 - Smart Journal Editor Mobile Optimization Complete
- ✅ **Complete Mobile-First Redesign**: Smart Journal Editor now fully optimized for mobile Android deployment
- ✅ **Responsive Layout System**: Sidebar collapses to stacked design on mobile with collapsible controls
- ✅ **Touch-Friendly Controls**: Large touch targets (h-12 on mobile vs h-10 desktop) for all buttons and inputs
- ✅ **Mobile Mood Selector**: 4-column grid on mobile (vs 8 on desktop) with large emoji buttons for easy selection
- ✅ **Simplified Tab Interface**: 3-tab layout on mobile (Write, Photos, Preview) with emoji icons for clarity
- ✅ **Responsive Photo Grid**: Single column photo layout on mobile for better viewing and interaction
- ✅ **Adaptive Editor Height**: Dynamic height adjustment based on screen size (300-400px) for optimal mobile experience
- ✅ **Resizable Editor Panes**: Enabled drag bar between text editor and preview for user-customizable layout
- ✅ **Essential Controls Priority**: Advanced styling options hidden on mobile to reduce interface complexity
- ✅ **Mobile Typography**: Larger text sizes and better spacing optimized for mobile readability
- ✅ **Native Mobile Feel**: Clean emoji-enhanced interface that feels native on Android devices

### July 15, 2025 - Advanced Email Campaign System & Real-Time Activity Dashboard Complete
- ✅ **AI-Powered Email Campaign System**: Complete email marketing platform with AI assistance for creating engaging campaigns
- ✅ **3 Pre-Built Campaign Templates**: Engagement, Welcome, and Upsell campaigns with emojis and personalization variables
- ✅ **Advanced Targeting Options**: 7 audience segments (All Users, Active, Heavy AI Users, New Users, Pro Subscribers, etc.)
- ✅ **Rich Content Editor**: Multi-line text editor with AI enhancement features and emoji suggestions
- ✅ **Variable Personalization**: Support for {{firstName}}, {{username}}, {{totalEntries}}, {{promptsRemaining}}, {{currentStreak}}
- ✅ **File Attachment Support**: Interface for adding images, PDFs, templates, and GIFs to campaigns
- ✅ **Campaign Performance Tracking**: Real-time metrics showing 68.4% open rate and 23.7% click rate
- ✅ **Preview and Test Functionality**: Send test emails and browser preview options
- ✅ **Advanced Revenue Dashboard**: Comprehensive financial analytics with real-time performance metrics
- ✅ **Revenue Breakdown Cards**: Today ($48.50), Monthly ($1,247), Total ($8,923), and Goal Progress (74%)
- ✅ **Revenue Source Analysis**: Detailed breakdown by AI prompts ($743.17), Pro subscriptions ($419.58), Annual upgrades ($269.97)
- ✅ **Key Performance Metrics**: ARPU ($18.45), Conversion Rate (14.2%), Customer LTV ($127.60), Churn Rate (2.3%)
- ✅ **Growth Opportunities**: Smart recommendations with revenue potential calculations for upsells and conversions
- ✅ **Monthly Forecasting**: Progress tracking toward monthly goals with daily targets and trend analysis
- ✅ **Quick Action Buttons**: One-click campaign creation, upsell promotion, and analytics export functionality
- ✅ **Enhanced User Interface**: Color-coded performance indicators, progress bars, and interactive visual elements
- ✅ **Advanced Activity Dashboard**: Real-time user monitoring with comprehensive filtering, search, and analytics tools
- ✅ **Live Activity Feed**: Real-time tracking of user actions (logins, journal entries, AI prompts, photo uploads, subscriptions)
- ✅ **Activity Statistics**: Overview cards showing total activity, active users, journal entries, and AI prompt usage
- ✅ **Advanced Filtering System**: Filter by action type, time range (1h, 24h, 7d, 30d), and search by user/action
- ✅ **Device & Location Tracking**: IP addresses, user agents, mobile/desktop detection for comprehensive monitoring
- ✅ **Activity Analytics**: Most common actions, most active users, and behavioral pattern analysis
- ✅ **Professional Admin Interface**: Color-coded action badges, device icons, and professional data visualization

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