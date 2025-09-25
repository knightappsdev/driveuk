#!/bin/bash

# DriveSchool Pro v3.0 - cPanel Deployment Preparation Script
echo "🚀 Preparing DriveSchool Pro v3.0 for cPanel deployment..."

# Create deployment directory
mkdir -p deployment

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🏗️ Building application..."
npm run build

# Copy necessary files for cPanel
echo "📂 Copying files for deployment..."

# Copy built application
cp -r .next deployment/
cp -r public deployment/
cp package.json deployment/
cp package-lock.json deployment/

# Create .htaccess for cPanel (if using Apache)
cat > deployment/.htaccess << 'EOF'
# Next.js redirects for cPanel hosting
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# Cache static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
</filesMatch>

# Compress text files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

# Create environment configuration for production
cat > deployment/.env.production << 'EOF'
# Production Environment Variables for cPanel
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
DATABASE_URL=postgresql://username:password@localhost:5432/driveschool_pro

# Update these with your actual production values
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-here

# Email configuration (if needed)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password

# Other production settings
NODE_ENV=production
EOF

# Create database migration script
cat > deployment/migrate-database.sql << 'EOF'
-- DriveSchool Pro v3.0 Database Setup for cPanel
-- Run this script in your cPanel PostgreSQL database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS driveschool_pro;

-- Use the database
\c driveschool_pro;

-- The actual tables will be created by Drizzle migrations
-- Run: npm run db:migrate after uploading files

-- Create a user for the application (optional)
-- CREATE USER 'driveschool_user'@'localhost' IDENTIFIED BY 'strong_password';
-- GRANT ALL PRIVILEGES ON driveschool_pro.* TO 'driveschool_user'@'localhost';
-- FLUSH PRIVILEGES;
EOF

# Create startup script for Node.js on cPanel
cat > deployment/app.js << 'EOF'
// DriveSchool Pro v3.0 - cPanel Node.js Entry Point
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> DriveSchool Pro ready on http://localhost:${PORT}`);
  });
});
EOF

# Create deployment instructions
cat > deployment/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# DriveSchool Pro v3.0 - cPanel Deployment Instructions

## Prerequisites
- cPanel hosting account with Node.js support
- PostgreSQL database access
- File Manager or FTP access

## Step 1: Database Setup
1. Create a PostgreSQL database in cPanel
2. Note down the database credentials
3. Update the DATABASE_URL in .env.production
4. Run the database migrations: `npm run db:migrate`

## Step 2: File Upload
1. Upload all files from the `deployment` folder to your cPanel public_html directory
2. Ensure .env.production is renamed to .env.local
3. Make sure app.js is in the root directory

## Step 3: Node.js Configuration
1. Go to cPanel > Node.js Apps
2. Create new Node.js app
3. Set Node.js version to 18+ (recommended)
4. Set Application Root to your domain directory
5. Set Application URL to your domain
6. Set Startup File to `app.js`
7. Click "Create"

## Step 4: Environment Variables
In cPanel Node.js app settings, add these environment variables:
- NODE_ENV=production
- DATABASE_URL=your_postgresql_connection_string
- NEXTAUTH_URL=https://yourdomain.com
- NEXTAUTH_SECRET=your_secret_key

## Step 5: Install Dependencies & Start
1. Access the terminal in cPanel
2. Navigate to your app directory
3. Run: `npm install --production`
4. Run: `npm run build`
5. Start the application from cPanel Node.js interface

## Step 6: Database Seeding (Optional)
Run these commands to seed initial data:
```bash
npm run seed:courses
npm run seed:students
npm run seed:instructors
npm run seed:purchases
```

## Troubleshooting
- Ensure Node.js version is 18+
- Check error logs in cPanel
- Verify database connection
- Ensure all environment variables are set correctly

## Performance Optimization
- Enable caching in cPanel
- Configure CDN if available
- Monitor database performance
- Set up regular backups
EOF

# Create package.json scripts for deployment
cat > deployment/scripts.json << 'EOF'
{
  "scripts": {
    "start": "node app.js",
    "build": "next build",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "seed:courses": "node lib/db/seed-courses.js",
    "seed:students": "node lib/db/seed-students.js",
    "seed:instructors": "node lib/db/seed-instructors.js",
    "seed:purchases": "node lib/db/seed-purchases.js",
    "seed:all": "node lib/db/seed-all.js"
  }
}
EOF

# Copy database files
mkdir -p deployment/lib/db
cp -r lib/db/* deployment/lib/db/

# Create ZIP file for easy upload
echo "📦 Creating deployment package..."
cd deployment
zip -r ../driveschool-pro-cpanel-deployment.zip .
cd ..

echo "✅ Deployment preparation complete!"
echo "📦 Upload 'driveschool-pro-cpanel-deployment.zip' to your cPanel"
echo "📖 Follow instructions in 'DEPLOYMENT_INSTRUCTIONS.md'"
echo ""
echo "🔑 Don't forget to:"
echo "  1. Update DATABASE_URL with your PostgreSQL credentials"
echo "  2. Set NEXTAUTH_SECRET to a secure random string"
echo "  3. Update domain URLs in environment variables"
echo "  4. Run database migrations after upload"
echo ""
echo "🚀 Your DriveSchool Pro v3.0 is ready for cPanel deployment!"