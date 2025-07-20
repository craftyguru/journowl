# Contributing to JournOwl

Thank you for considering contributing to JournOwl! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-username/journowl/issues)
2. Create a detailed bug report including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

### Suggesting Features

1. Check existing [Issues](https://github.com/your-username/journowl/issues) for similar suggestions
2. Create a feature request with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups or examples (if applicable)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📋 Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/journowl.git
   cd journowl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Follow existing type patterns
- Add proper type annotations

### React Components
- Use functional components with hooks
- Follow existing component structure
- Use Tailwind CSS for styling
- Implement proper error boundaries

### Database
- Use Drizzle ORM for database operations
- Follow existing schema patterns
- Add proper indexes for performance

### AI Integration
- Use the trackableOpenAICall wrapper for all AI requests
- Implement proper error handling
- Add usage tracking for cost management

## 🧪 Testing

- Test all changes thoroughly
- Ensure mobile responsiveness
- Test with different user roles (admin, professional, kid)
- Verify AI features work correctly
- Check database operations

## 📝 Commit Messages

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: changes description`
- `Remove: what was removed`
- `Refactor: what was refactored`

## 🔍 Pull Request Process

1. **Ensure your code follows the style guidelines**
2. **Update documentation if needed**
3. **Add tests if applicable**
4. **Ensure all existing tests pass**
5. **Request review from maintainers**
6. **Address review feedback promptly**

## 🏗️ Architecture Guidelines

### Frontend (client/)
- React components in `src/components/`
- Pages in `src/pages/`
- Shared utilities in `src/lib/`
- Use shadcn/ui components when possible

### Backend (server/)
- API routes in appropriate modules
- Database operations through storage layer
- Middleware for common functionality
- Proper error handling and logging

### Shared (shared/)
- Database schema definitions
- Type definitions
- Shared utilities

## 🚫 What Not to Contribute

- Breaking changes without discussion
- Features that compromise user privacy
- Code that doesn't follow the established patterns
- Dependencies that significantly increase bundle size
- Features that require paid services without free alternatives

## 📞 Getting Help

- Create an issue for questions
- Join discussions in existing issues
- Follow the project for updates

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for helping make JournOwl better! 🦉