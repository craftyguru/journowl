# 🦉 JournOwl - AI-Powered Journaling Platform

JournOwl is a comprehensive, multi-dashboard journaling application that combines the wisdom of an owl with AI-powered insights to provide personalized experiences for different user types. Features include animated backgrounds, AI-powered insights, comprehensive analytics, role-based dashboards, and an inviting user interface designed to encourage daily journaling habits.

## ✨ Features

### 🎯 Core Features
- **Multi-Dashboard Architecture**: Admin, Professional, and Kid-friendly interfaces
- **AI-Powered Writing Assistant**: Context-aware prompt generation and content analysis
- **Smart Journal Editor**: Rich text editor with photo uploads and AI insights
- **Interactive Memory Calendar**: Beautiful calendar view with mood tracking
- **Achievement System**: Gamified journaling with XP, streaks, and badges
- **Real-Time Analytics**: Comprehensive insights and progress tracking

### 🤖 AI Integration
- **OpenAI GPT-4o Vision Model** for comprehensive content analysis
- **Photo Analysis**: Extracts emotions, objects, people, activities, and locations
- **Smart Journal Prompts**: Context-aware writing suggestions
- **Content Insights**: Deep analysis of writing patterns and emotional trends
- **Intelligent Tagging**: Automatic tag generation from photos and text

### 🎨 User Experience
- **Animated Backgrounds**: Interactive smoke particles and visual effects
- **Mobile-Optimized**: Responsive design for all device sizes
- **Dark/Light Mode**: Theme switching with beautiful gradients
- **Touch-Friendly**: Optimized for mobile and tablet interactions

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and production builds
- **Tailwind CSS** with shadcn/ui components
- **Framer Motion** for smooth animations
- **React Query** for server state management
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Session-based Authentication** with bcrypt
- **OpenAI API** integration
- **SendGrid** for email services
- **Stripe** for payment processing (optional)

### Database
- **PostgreSQL** with comprehensive schema
- **Drizzle ORM** for type-safe database operations
- **Session store** with PostgreSQL backend

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- SendGrid API key (for emails)

### 1. Clone the Repository
```bash
git clone https://github.com/craftyguru/journowl.git
cd journowl
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/journowl
SESSION_SECRET=your-super-secure-session-secret-here
OPENAI_API_KEY=sk-your-openai-api-key-here
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
FROM_EMAIL=noreply@journowl.com
```

### 4. Database Setup
```bash
# Push schema to database
npm run db:push
```

### 5. Development
```bash
# Start development server
npm run dev
```

### 6. Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚂 Deployment

### Railway Deployment

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Railway will auto-detect the Node.js project

2. **Environment Variables**
   Set these in Railway dashboard:
   ```
   DATABASE_URL (Railway will provide PostgreSQL)
   SESSION_SECRET
   OPENAI_API_KEY
   SENDGRID_API_KEY
   FROM_EMAIL
   NODE_ENV=production
   ```

3. **Database Setup**
   ```bash
   # After deployment, run database migrations
   railway run npm run db:push
   ```

4. **Custom Domain** (Optional)
   - Configure custom domain in Railway dashboard
   - Update CORS settings if needed

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up PostgreSQL database**
   - Create database instance
   - Run `npm run db:push` to set up schema

3. **Configure environment variables**
   - Set all required environment variables
   - Ensure `NODE_ENV=production`

4. **Start the application**
   ```bash
   npm start
   ```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User accounts with roles and preferences
- **journal_entries**: Rich journal content with AI insights
- **user_stats**: Analytics and progress tracking
- **achievements**: Gamification and badge system
- **goals**: Personal goal setting and tracking
- **admin_analytics**: Platform-wide statistics

## 🔐 Authentication & Security

- **Session-based authentication** with secure cookies
- **Password hashing** with bcrypt
- **CORS protection** with proper origins
- **SQL injection protection** with parameterized queries
- **XSS protection** with input sanitization

## 🎮 User Roles & Dashboards

### Admin Dashboard
- User management and analytics
- Platform-wide statistics
- Email campaign management
- Revenue tracking and insights

### Professional Dashboard
- Advanced journaling features
- Comprehensive analytics
- AI-powered insights
- Goal tracking and achievements

### Kid Dashboard
- Colorful, safe interface
- Fun prompts and badges
- Simplified stats and progress
- Encouraging messaging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o Vision API
- Radix UI for accessible components
- Framer Motion for animations
- Tailwind CSS for styling
- Drizzle ORM for database operations

## 📞 Support

For support, email support@journowl.com or create an issue in this repository.

---

**Built with ❤️ and 🦉 wisdom**