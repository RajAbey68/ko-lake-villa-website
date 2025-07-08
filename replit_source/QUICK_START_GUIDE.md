# Ko Lake Villa - Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Environment Setup
Copy these to Replit Secrets or `.env`:
```
DATABASE_URL=your_postgres_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Installation
```bash
npm install
npm run db:push
npm run dev
```

### 3. Access Points
- **Website**: http://localhost:5000
- **Admin**: http://localhost:5000/admin
- **API**: http://localhost:5000/api

### 4. Admin Login
- Email: contact@KoLakeHouse.com or RajAbey68@gmail.com
- Use Firebase Authentication

## Core Features Overview

### Gallery Management
- Upload images/videos via admin panel
- Automatic categorization with AI
- Bulk upload support
- WebP optimization

### Accommodation System
- 4 room types with dynamic pricing
- Real-time availability
- Booking management
- Payment integration ready

### Content Management
- Virtual tours with authentic photos
- Local experiences database
- Newsletter system
- Analytics dashboard

## Development Workflow

### Making Changes
1. Edit files in `client/src` for frontend
2. Edit files in `server/` for backend
3. Schema changes in `shared/schema.ts`
4. Push DB changes: `npm run db:push`

### Testing
```bash
npm run test              # Unit tests
npm run test:e2e         # End-to-end tests
```

### Production Build
```bash
npm run build
npm start
```

## File Structure Quick Reference

```
client/src/
├── pages/           # Main pages (Home, Gallery, Booking, etc.)
├── pages/admin/     # Admin dashboard
├── components/      # Reusable UI components
├── lib/            # Utilities and API clients
└── contexts/       # React contexts (Auth, etc.)

server/
├── routes.ts       # API endpoints
├── storage.ts      # Database operations
└── index.ts        # Server entry point

shared/
└── schema.ts       # Database schema and types
```

## Common Commands

```bash
# Development
npm run dev

# Database
npm run db:push
npm run db:generate

# Build & Deploy
npm run build
npm start

# Testing
npm run test
npm run test:e2e
```

## Need Help?

### Quick Fixes
- **Build fails**: Check environment variables
- **Auth issues**: Verify Firebase config  
- **DB errors**: Run `npm run db:push`
- **Images not loading**: Check Firebase Storage setup

### Documentation
- Full details: `HANDOVER_DOCUMENT.md`
- Deployment: `DEPLOYMENT_CHECKLIST.md`
- API docs: Built-in at `/api/docs`

---
**Ready to Deploy**: All authentication issues resolved ✅