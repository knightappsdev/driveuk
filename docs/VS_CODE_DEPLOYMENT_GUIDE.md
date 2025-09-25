# 🚀 DriveSchool Pro v3.2.0 - VS Code Deployment Guide

Complete step-by-step instructions to deploy and run DriveSchool Pro in Visual Studio Code.

## 📋 Prerequisites

### Required Software Installation

1. **Node.js (v18.17.0 or later)**
   ```bash
   # Check your current version
   node --version
   npm --version
   ```
   - Download from: https://nodejs.org/
   - Recommended: Use Node.js v20.x LTS for best compatibility

2. **Git**
   ```bash
   # Check if Git is installed
   git --version
   ```
   - Download from: https://git-scm.com/

3. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/
   - Install recommended extensions (see section below)

4. **PostgreSQL Database**
   - **Option A**: Local PostgreSQL installation
   - **Option B**: Cloud database (Supabase, Railway, Neon, etc.)
   - **Option C**: Docker PostgreSQL container

### VS Code Extensions (Recommended)

Install these extensions for optimal development experience:

```
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)
```

## 🔧 Step-by-Step Deployment

### Step 1: Clone the Repository

```bash
# Open terminal/command prompt and navigate to your desired directory
cd C:\your-projects-folder  # Windows
cd ~/your-projects-folder   # macOS/Linux

# Clone the repository
git clone https://github.com/knightappsdev/DriveSchool-Pro-ver3.git

# Navigate into the project directory
cd DriveSchool-Pro-ver3

# Verify you're on the latest version
git log --oneline -3
```

### Step 2: Open Project in VS Code

```bash
# Open VS Code from terminal (if code command is available)
code .

# OR manually open VS Code and use File > Open Folder
```

### Step 3: Install Dependencies

**⚠️ Important**: With v3.2.0, there are NO more dependency conflicts!

```bash
# Install all project dependencies
npm install

# This should complete without any peer dependency warnings
# No need for --legacy-peer-deps anymore!
```

**Expected Output:**
```
✅ Dependencies installed successfully
✅ No peer dependency conflicts
✅ Ready for development
```

### Step 4: Environment Configuration

1. **Create Environment File**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # OR on Windows
   copy .env.example .env
   ```

2. **Configure Database Connection**

   Open `.env` file in VS Code and update these variables:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/driveschool_db"
   
   # Alternative format for cloud databases
   # DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=require"
   
   # Application Settings
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # WhatsApp Integration (Optional)
   WHATSAPP_PHONE="+1234567890"
   WHATSAPP_MESSAGE="Hello! I'm interested in driving lessons."
   
   # Admin Settings
   ADMIN_EMAIL="admin@driveschool.com"
   ADMIN_PASSWORD="your-admin-password"
   ```

### Step 5: Database Setup

#### Option A: Local PostgreSQL Setup

1. **Install PostgreSQL locally**
   - Windows: Download from postgresql.org
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE driveschool_db;
   
   # Create user (optional)
   CREATE USER driveschool_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE driveschool_db TO driveschool_user;
   
   # Exit
   \q
   ```

#### Option B: Cloud Database (Recommended)

**Using Supabase (Free tier available):**

1. Go to https://supabase.com/
2. Create new project
3. Get connection string from Settings > Database
4. Update `.env` with the connection string

**Using Railway:**
1. Go to https://railway.app/
2. Create PostgreSQL service
3. Copy connection string to `.env`

### Step 6: Database Migration & Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed database with sample data
npm run db:seed
```

### Step 7: Verify Installation

```bash
# Check if everything is working
npm run build

# Expected output should show successful build
# ✅ Compiled successfully
```

### Step 8: Start Development Server

```bash
# Start the development server
npm run dev

# Alternative: Use VS Code integrated terminal
# Terminal > New Terminal, then run: npm run dev
```

### Step 9: Access Application

1. **Open Browser**: http://localhost:3000
2. **Verify Features Work**:
   - ✅ Homepage loads correctly
   - ✅ Course statistics display
   - ✅ Purchase counter functionality
   - ✅ WhatsApp integration works
   - ✅ Responsive design on mobile

### Step 10: VS Code Development Setup

#### Configure VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

#### Create Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "name": "Attach to Node",
      "port": 9229,
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

### Step 11: Verify Everything Works

#### Run Quality Checks

```bash
# Lint check
npm run lint

# Type checking
npm run type-check

# Build for production (optional)
npm run build

# Start production server (optional)
npm start
```

## 🎯 Key Features to Test

After successful deployment, verify these core features:

### 1. Purchase Counter System
- Visit homepage
- Refresh page to see counter increment (+2 per reload)
- Check social proof notifications appear

### 2. Course Statistics
- Open course modals
- Verify student count starts at 100+
- Check statistics update correctly

### 3. WhatsApp Integration
- Click "Book Now" buttons
- Verify WhatsApp opens with pre-filled message
- Test on both desktop and mobile

### 4. Responsive Design
- Test on different screen sizes
- Use Chrome DevTools device emulation
- Verify mobile navigation works

### 5. Database Connectivity
- Check if data persists between page reloads
- Verify purchase counter increments are saved

## 🔧 Development Workflow

### Daily Development Commands

```bash
# Start development (most common)
npm run dev

# Check for issues
npm run lint
npm run type-check

# Database operations
npx prisma studio          # Database GUI
npx prisma db push         # Apply schema changes
npx prisma generate        # Regenerate client

# Production build
npm run build
npm start
```

### Git Workflow

```bash
# Check current status
git status

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "Add: your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use
```bash
# Error: Port 3000 is already in use
# Solution: Kill the process or use different port
npx kill-port 3000
# OR
npm run dev -- -p 3001
```

#### 2. Database Connection Errors
```bash
# Error: Can't connect to database
# Solutions:
1. Check DATABASE_URL in .env is correct
2. Ensure PostgreSQL is running
3. Verify database exists
4. Check firewall/network settings
```

#### 3. Missing Dependencies
```bash
# Error: Module not found
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 5. Prisma Issues
```bash
# Reset Prisma
npx prisma generate
npx prisma db push
```

### Environment-Specific Issues

#### Windows Users
- Use Git Bash or PowerShell instead of Command Prompt
- Ensure Node.js is in PATH
- Use `copy` instead of `cp` for file operations

#### macOS Users
- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for package management
- Check PATH configuration for Node.js

#### Linux Users
- Install build essentials: `sudo apt-get install build-essential`
- Use correct PostgreSQL package for your distribution
- Check permissions for global npm packages

## 📱 Mobile Development Testing

### Browser DevTools Testing
1. Open Chrome DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Test different device sizes:
   - iPhone 12/13/14
   - Samsung Galaxy S20
   - iPad
   - Custom dimensions

### Real Device Testing
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access via: `http://your-ip:3000` from mobile device
3. Ensure both devices are on same network

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` file to Git
- Use strong passwords for database
- Generate secure `NEXTAUTH_SECRET`
- Use HTTPS in production

### Database Security
- Use connection pooling
- Enable SSL for cloud databases
- Regularly backup database
- Monitor for suspicious activity

## 📦 Production Deployment

### Preparation for Production
```bash
# Optimize for production
npm run build

# Test production build locally
npm start

# Check bundle size
npm run analyze
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**
- **AWS/Digital Ocean**

## 🆘 Need Help?

### Getting Support
1. **GitHub Issues**: Report bugs or request features
2. **Documentation**: Check project README and this guide
3. **Community**: Join Discord/Telegram if available
4. **Stack Overflow**: Tag questions with relevant technologies

### Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [VS Code Tips](https://code.visualstudio.com/docs)

---

## ✅ Success Checklist

Mark each item as you complete it:

- [ ] Node.js and npm installed
- [ ] VS Code with recommended extensions
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Prisma migrations completed
- [ ] Development server running
- [ ] Application accessible at localhost:3000
- [ ] All core features tested
- [ ] Git workflow configured

**🎉 Congratulations!** You've successfully deployed DriveSchool Pro v3.2.0 in VS Code!

---

*Last updated: DriveSchool Pro v3.2.0 - PWA-Free Release*
*This guide reflects the latest changes with all PWA functionality removed for optimal compatibility.*