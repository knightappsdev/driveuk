# DriveSchool Pro - Setup & Deployment Guide

## 🚀 Project Overview

DriveSchool Pro is a modern, responsive driving school website built with cutting-edge technologies and optimized for conversions. The project has been successfully imported from the original repository and is ready for deployment to a new GitHub repository.

### ✨ Key Features
- **Modern Tech Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: Drizzle ORM with PostgreSQL support
- **Styling**: Tailwind CSS 4.x with custom components
- **PWA Support**: Progressive Web App with offline capabilities
- **WhatsApp Integration**: CRM integration (+447756183484)
- **Animated UI**: Driving animations and smooth transitions
- **Lead Capture**: Exit intent popups and conversion optimization

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.0 (canary) with App Router
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.7
- **Database**: Drizzle ORM 0.43.1 with PostgreSQL
- **UI Components**: Custom component library with Radix UI
- **Icons**: Lucide React 0.511.0
- **PWA**: @ducanh2912/next-pwa 10.2.9
- **Authentication**: Jose (JWT handling)
- **Email**: Resend API integration
- **Validation**: Zod schema validation

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js 18+** (tested with latest LTS)
- **npm** or **yarn** package manager
- **PostgreSQL database** (local or hosted)
- **Git** for version control
- **Resend API key** (for email functionality)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone from your new repository
git clone <your-new-repository-url>
cd driving-school-pro
```

### 2. Install Dependencies

```bash
# Install with legacy peer deps to handle Next.js canary version
npm install --legacy-peer-deps

# Alternative with yarn
yarn install --legacy-peer-deps
```

### 3. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# Database Configuration
POSTGRES_URL=postgresql://username:password@host:port/database_name

# Application Configuration
BASE_URL=http://localhost:3000
AUTH_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Email Configuration (Resend API)
RESEND_API_KEY=re_your_resend_api_key_here

# WhatsApp Business Integration
WHATSAPP_BUSINESS_NUMBER=447756183484
```

### 4. Database Setup

```bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 5. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🗃 Database Configuration

### PostgreSQL Setup

The project uses Drizzle ORM with PostgreSQL. Ensure your database is created:

```sql
CREATE DATABASE driving_school;
```

### Database Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:seed` | Populate with sample data |
| `npm run db:studio` | Open Drizzle Studio (GUI) |

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BASE_URL` | Application base URL | `http://localhost:3000` |
| `AUTH_SECRET` | JWT signing secret (32+ chars) | Random string |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API_KEY` | Email service API key | Not set |
| `WHATSAPP_BUSINESS_NUMBER` | WhatsApp number for CRM | `447756183484` |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:setup` | Initialize database (custom script) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio |

## 🚀 Deployment Guide

### Build Verification

Before deploying, ensure everything builds correctly:

```bash
# Build the project
npm run build

# Test TypeScript compilation
npx tsc --noEmit

# Start production server locally
npm run start
```

### Platform-Specific Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Railway
1. Connect GitHub repository
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy

#### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configure environment variables

### Environment Variables for Production

```env
# Production Database
POSTGRES_URL=postgresql://username:password@production-host:5432/database

# Production Base URL
BASE_URL=https://your-domain.com

# Secure JWT Secret
AUTH_SECRET=production-secret-key-at-least-32-characters-long

# Email Service
RESEND_API_KEY=re_production_api_key

# WhatsApp Integration
WHATSAPP_BUSINESS_NUMBER=447756183484
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use secure connection strings in production
3. **JWT Secret**: Generate cryptographically secure secrets
4. **API Keys**: Rotate keys regularly
5. **CORS**: Configure allowed origins in production

## 🎯 Features Overview

### Core Functionality
- **Hero Section**: Animated driving scene with call-to-action buttons
- **Course Management**: Interactive course cards with modal details
- **Instructor Search**: Advanced filtering by location, transmission, etc.
- **WhatsApp CRM**: Direct messaging integration
- **Lead Capture**: Exit intent popup system

### Technical Features
- **PWA Support**: Installable web app with offline capabilities
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Next.js App Router with metadata API
- **Performance**: Optimized images, fonts, and bundle splitting
- **Type Safety**: Full TypeScript coverage

## 🛠 Customization

### WhatsApp Number
Update the WhatsApp number in:
1. Environment variables (`WHATSAPP_BUSINESS_NUMBER`)
2. Components using WhatsApp integration
3. Documentation and README files

### Branding
Customize in:
- `app/layout.tsx` - Site metadata
- `public/manifest.json` - PWA configuration
- `public/icons/` - App icons and favicons
- Tailwind configuration for colors and fonts

### Database Schema
Modify schema in:
- `lib/db/schema.ts` - Database tables
- Run `npm run db:generate` after changes
- Apply with `npm run db:migrate`

## 📝 Next Steps

1. **Domain Setup**: Configure your custom domain
2. **Email Integration**: Set up Resend API for contact forms
3. **Analytics**: Add Google Analytics or similar
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **SEO**: Configure sitemap and robots.txt
6. **Testing**: Add unit and integration tests

## 🐛 Troubleshooting

### Common Issues

**Dependency Conflicts**
```bash
npm install --legacy-peer-deps
```

**Database Connection Issues**
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists

**Build Failures**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install --legacy-peer-deps`

**TypeScript Errors**
- Run type check: `npx tsc --noEmit`
- Check for missing type definitions

## 📞 Support

For technical support or questions:
- Check existing documentation files
- Review GitHub issues
- Contact development team

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Generated**: $(date)
**Status**: ✅ Ready for production deployment
**Last Updated**: Project import and initial setup completed