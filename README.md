# Unlimited Perfect Deals - Admin Panel

The administrative dashboard for managing deals, categories, and retailers. Built with Next.js 15, React 19, and Firebase.

## Overview

This is the admin-only application where authorized users can:
- Manage deals (create, edit, delete, activate/deactivate)
- Manage categories (create, edit, delete)
- Manage retailers (create, edit, delete)
- View analytics and metrics
- Seed test data for development

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Firebase Authentication (admin access control)
- Firebase Firestore (database)
- Firebase Admin SDK (server-side operations)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project configured (see `FIREBASE_SETUP.md` in root)
- Firebase Admin SDK service account key
- Environment variables set up

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Add your Firebase configuration to `.env.local`:
```
# Firebase Client Config (for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"
```

3. Place your Firebase Admin SDK service account JSON file in the root directory

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin panel.

### Seeding Test Data

To populate the database with test data:

```bash
npm run seed
```

This will create sample categories, retailers, and deals in your Firestore database.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── (auth)/
│   └── login/          # Login page
├── (dashboard)/
│   ├── categories/     # Category management
│   ├── deals/          # Deal management
│   └── page.tsx        # Dashboard home
└── api/
    └── auth/           # Authentication API routes

components/
├── auth/               # Authentication components
├── forms/              # Form components (Deal, Category)
├── layout/             # Layout components
└── ui/                 # Reusable UI components

lib/
├── actions/            # Server actions for CRUD operations
├── firebase/           # Firebase configuration (client & admin)
├── auth.ts             # Authentication utilities
├── types.ts            # Shared type definitions
├── utils.ts            # Utility functions
└── validations.ts      # Form validation schemas

scripts/
├── fixtures/           # Test data fixtures
├── seed.ts             # Database seeding script
└── seedData.ts         # Seed data logic

types/
├── deal.ts             # Deal type definitions
├── category.ts         # Category type definitions
├── retailer.ts         # Retailer type definitions
└── analytics.ts        # Analytics type definitions
```

## Key Features

### Authentication
- Firebase Authentication integration
- Protected routes with middleware
- Session management
- Admin-only access control

### Deal Management
- Create new deals with validation
- Edit existing deals
- Delete deals
- Activate/deactivate deals
- Image upload support
- Category and retailer assignment

### Category Management
- Create categories with icons
- Edit category details
- Delete categories (with validation)
- View deal count per category

### Retailer Management
- Create retailers with logos
- Edit retailer information
- Delete retailers (with validation)
- Track deals per retailer

### Data Seeding
- Automated test data generation
- Sample categories, retailers, and deals
- Useful for development and testing

## Authentication

The admin panel requires Firebase Authentication. To set up admin users:

1. Create users in Firebase Console
2. Assign appropriate roles/permissions
3. Users can log in via the `/login` page

## Deployment

See `DEPLOYMENT_INSTRUCTIONS.md` in the project root for deployment guidelines.

## Related Projects

- `user-web/` - Public-facing web application for browsing deals

## Implementation Status

See `IMPLEMENTATION_STATUS.md` for current feature completion status.
