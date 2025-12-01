# JournOwl Application - MULTI-MODE ENTERPRISE PLATFORM 🚀

## Overview
JournOwl is a multi-mode enterprise journaling platform designed with a single core engine that adapts its user experience, metrics, and AI tone based on user preferences. It offers advanced gamification, social engagement, premium monetization, multi-organization support, Role-Based Access Control (RBAC), AI governance, and comprehensive compliance and audit features. The platform serves 5 distinct use cases from a unified backend, targeting different market segments including personal wellness, creative productivity, financial trading, corporate team wellness, and clinical therapy.

## User Preferences
The agent should prioritize iterative development and provide detailed explanations when requested. I prefer to be asked before major changes are made to the codebase. Please do not make changes to files within the `Z` folder or to the file `Y`.

## System Architecture
JournOwl is built on a robust architecture supporting multi-tenancy and diverse user experiences.

### UI/UX Decisions
The platform offers five distinct interface modes (Wellness, Creator, Trader, Team, Therapy), each with tailored onboarding flows, specific dashboards, color schemes, default journal prompts, and key metrics display. The AI persona system adapts its tone (Warm, Analytical, Professional, Empathetic) based on the selected mode. A mode recommendation engine analyzes user behavior to suggest better-fitting modes.

### Technical Implementations
The frontend is developed using React, TypeScript, Vite, Tailwind CSS with shadcn/ui components, Framer Motion for animations, React Query v5 for state management, Wouter for routing, and Recharts for data visualization. An Enterprise Admin Console component manages organizational settings.

The backend is an Express.js and TypeScript application utilizing PostgreSQL with Drizzle ORM. It provides 217+ REST API endpoints and uses WebSockets for real-time features. Authentication is session-based with OAuth support.

### Feature Specifications
**Multi-Mode System:**
- Mode-specific onboarding and dashboards for Wellness, Creator, Trader, Team, and Therapy modes.
- AI Persona System with custom system prompts and response patterns per mode.
- Mode Recommendation Engine based on writing patterns, engagement, and emotional vs. analytical content.

**Enterprise Capabilities:**
- **Multi-Tenant Foundation:** Organizations table with plan tiers (free/pro/power/enterprise), members with 6 roles (owner, admin, coach, therapist, member, viewer), and global RBAC enforcement with `organization_id` scoping across all user data.
- **AI Governance Suite:** Organization-level AI policy settings (feature toggles, PII redaction, token limits, model whitelisting), a centralized AI Gateway Service with request auditing and cost tracking.
- **Enterprise Identity & SSO:** SAML 2.0 and OpenID Connect (OIDC) support for enterprise identity providers, with automatic user provisioning and SCIM 2.0-lite endpoints.
- **Compliance & Audit:** GDPR Article 17 (right to deletion) and CCPA data export compliance, data anonymization with audit trails, and a permanent compliance audit log (`audit_logs` table) with actor tracking.
- **Enterprise Admin Console:** UI for managing organization settings, AI policies, SSO providers, audit logs, and data export/anonymization controls.
- **Observability:** `/healthz` and `/readyz` probes for liveness and readiness, and structured logging.
- **Retention Loop Framework:** Mode-specific loops designed to enhance user engagement and retention.

### System Design Choices
- **Multi-Tenant Design:** Organizations are first-class entities with org-scoped data access.
- **RBAC System:** Granular permission enforcement across 6 role types.
- **AI Governance:** Centralized service for policy enforcement, PII redaction, and cost tracking.
- **Compliance:** Built-in features for GDPR/CCPA and a permanent audit trail.
- **Scalability:** Optimized database queries and indexed tables for multi-tenant performance.

## External Dependencies
- **Database:** PostgreSQL (with Drizzle ORM)
- **Email Service:** SendGrid
- **AI/NLP:** OpenAI GPT-4o
- **Payment Processing:** Stripe (for readiness probes)
- **Identity Providers:** SAML 2.0 and OpenID Connect compatible identity providers (e.g., Okta, Azure AD) for SSO.