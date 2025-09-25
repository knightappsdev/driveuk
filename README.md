# 🚗 DriveSchool Pro v3.0

**The Complete Driving School Management Platform**

A modern, full-stack web application built with Next.js 15, React 19, TypeScript, and PostgreSQL for driving schools to manage courses, instructors, students, and bookings.

![Next.js](https://img.shields.io/badge/Next.js-15.4.0-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Key Features

### 🎯 **Core Functionality**
- **Complete Course Management** - Beginner to advanced driving courses
- **Instructor Directory** - Qualified instructors with detailed profiles  
- **Real-time Booking System** - Schedule lessons with availability tracking
- **Student Dashboard** - Progress tracking and lesson history
- **Multi-transmission Support** - Manual and automatic driving lessons

### 🚀 **Advanced Features**
- **Real-time Purchase Counter** - Live social proof with course enrollment stats
- **Progressive Web App (PWA)** - Install on mobile devices
- **WhatsApp Integration** - Direct booking via WhatsApp Business
- **Push Notifications** - Lesson reminders and booking confirmations
- **Exit Intent Marketing** - Capture leaving visitors with special offers
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### 📊 **Marketing & Analytics**
- **Live Statistics Dashboard** - Real-time course enrollment tracking
- **Social Proof System** - Dynamic purchase notifications
- **Course Performance Metrics** - Student success rates and reviews
- **Instructor Analytics** - Performance and booking statistics

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 with Hooks
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + Custom Components
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library

### **Backend**
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: NextAuth.js for secure user management
- **API**: RESTful APIs with TypeScript validation

### **Development Tools**
- **Build System**: Next.js with Webpack 5
- **Code Quality**: ESLint + Prettier for code formatting
- **Database Tools**: Drizzle Kit for migrations and studio
- **Development**: Hot reloading with Fast Refresh

### **Deployment**
- **Production**: Optimized for cPanel hosting
- **Database**: Production PostgreSQL setup
- **Static Assets**: CDN-optimized public assets
- **Environment**: Production environment configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/knightappsdev/DriveSchool-Pro-ver3.git
   cd DriveSchool-Pro-ver3
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your database credentials and API keys
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed sample data (optional)
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   ```
   http://localhost:3000
   ```

> 📚 **Need more help?** See our comprehensive [Documentation Index](./DOCS.md) for detailed setup guides, deployment instructions, and technical documentation.

## 📁 Project Structure

```
driveschool-pro-v3/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── stats/                # Statistics endpoints
│   │   └── user/                 # User management
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable UI components
│   ├── driving-school/           # Domain-specific components
│   │   ├── courses/              # Course management
│   │   ├── instructors/          # Instructor profiles
│   │   ├── landing/              # Landing page sections
│   │   └── retargeting/          # Marketing components
│   └── ui/                       # Generic UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── data/                     # Static data and constants
│   ├── db/                       # Database configuration and seeds
│   └── services/                 # Business logic services
├── public/                       # Static assets
├── scripts/                      # Build and deployment scripts
└── types/                        # TypeScript type definitions
```

## 🗄️ Database Schema

### **Core Tables**
- **users** - User accounts (students, instructors, admins)
- **instructors** - Instructor profiles and qualifications  
- **students** - Student information and progress
- **courses** - Available driving courses
- **bookings** - Lesson bookings and scheduling
- **lessons** - Individual lesson records
- **reviews** - Student feedback and ratings

### **Analytics Tables**
- **coursePurchases** - Real-time purchase tracking
- **activityLogs** - User activity monitoring
- **settings** - Application configuration

## 🔧 Available Scripts

### **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### **Database**
```bash
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run seed:courses # Seed sample courses
npm run seed:all     # Seed all sample data
```

### **Deployment**
```bash
npm run deploy:cpanel    # Prepare cPanel deployment
npm run build:production # Production build with optimizations
```

## 🌐 Deployment

### **cPanel Hosting**
1. Run the deployment preparation script:
   ```bash
   npm run deploy:cpanel
   ```
2. Upload the generated `driveschool-pro-cpanel-deployment.zip` to your cPanel
3. Follow the instructions in `DEPLOYMENT_INSTRUCTIONS.md`

### **Environment Variables**
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Application Settings  
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Optional Integrations
RESEND_API_KEY=your-resend-api-key
WHATSAPP_BUSINESS_NUMBER=your-whatsapp-number
```

## 📊 Features Overview

### **Student Experience**
- Browse available courses with real-time enrollment stats
- View instructor profiles with ratings and specialties
- Book lessons with flexible scheduling options
- Track learning progress and lesson history
- Receive push notifications for reminders

### **Instructor Dashboard**
- Manage availability and scheduling
- Track student progress and performance
- Handle bookings and lesson confirmations
- View earnings and statistics
- Communicate with students via integrated messaging

### **Admin Panel**
- Complete course management system
- Instructor approval and verification
- Student progress monitoring
- Financial reporting and analytics
- System configuration and settings

### **Marketing Features**
- **Real-time Social Proof**: Live purchase notifications
- **Course Statistics**: Dynamic enrollment counters  
- **Exit Intent Capture**: Special offers for leaving visitors
- **WhatsApp Integration**: Instant booking and communication
- **PWA Support**: Mobile app-like experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For deployment platform and tools
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Drizzle Team** - For the type-safe ORM

## 📞 Support

- **Documentation**: [Wiki Pages](../../wiki)
- **Issues**: [GitHub Issues](../../issues)
- **Email**: developer@driveschoolpro.com
- **WhatsApp**: +44 7756 183 484

---

**Built with ❤️ for the UK driving education community**

*DriveSchool Pro v3.0 - Empowering the next generation of drivers*