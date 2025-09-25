# 🗄️ PostgreSQL Local Setup for DriveSchool Pro v3.2.0

**Complete guide to install and configure PostgreSQL on your local machine for DriveSchool Pro development.**

---

## 📋 What We'll Install

- **PostgreSQL Server** (Database engine)
- **pgAdmin** (Database management GUI)
- **Create DriveSchool database and user**
- **Configure environment variables**
- **Test connection and run migrations**

---

# 🖥️ Installation by Operating System

## 🪟 Windows Installation

### Step 1: Download PostgreSQL

1. **Visit**: https://www.postgresql.org/download/windows/
2. **Click**: "Download the installer"
3. **Select**: Latest stable version (PostgreSQL 16.x recommended)
4. **Choose**: Windows x86-64 installer

### Step 2: Run the Installer

1. **Run** the downloaded `.exe` file as Administrator
2. **Installation Directory**: Keep default `C:\Program Files\PostgreSQL\16`
3. **Select Components**:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Stack Builder (optional)
   - ✅ Command Line Tools

4. **Data Directory**: Keep default `C:\Program Files\PostgreSQL\16\data`
5. **Superuser Password**: 
   - Create a strong password (e.g., `PostgreSQL2024!`)
   - ⚠️ **REMEMBER THIS PASSWORD** - you'll need it!
6. **Port**: Keep default `5432`
7. **Locale**: Keep default (your system locale)

### Step 3: Complete Installation

1. **Install** and wait for completion
2. **Uncheck** "Launch Stack Builder" (unless you need additional tools)
3. **Finish** the installation

### Step 4: Verify Installation (Windows)

```cmd
# Open Command Prompt as Administrator and test:
psql --version

# Should show something like:
# psql (PostgreSQL) 16.x
```

---

## 🍎 macOS Installation

### Method 1: Using Homebrew (Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

### Method 2: Using PostgreSQL.app

1. **Download**: https://postgresapp.com/
2. **Install**: Drag to Applications folder
3. **Open**: Postgres.app
4. **Initialize**: Click "Initialize" to create your first database

### Method 3: Official Installer

1. **Download**: https://www.postgresql.org/download/macosx/
2. **Run**: the `.dmg` installer
3. **Follow**: same steps as Windows installation

---

## 🐧 Linux Installation

### Ubuntu/Debian:

```bash
# Update package list
sudo apt update

# Install PostgreSQL and additional tools
sudo apt install postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### CentOS/RHEL/Fedora:

```bash
# Install PostgreSQL
sudo dnf install postgresql postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup --initdb

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Arch Linux:

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database
sudo -u postgres initdb -D /var/lib/postgres/data

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

# 🔧 Database Configuration

## Step 1: Access PostgreSQL

### Windows:
```cmd
# Option 1: Use pgAdmin (GUI)
# Search "pgAdmin" in Start Menu and open it

# Option 2: Command line
# Open Command Prompt as Administrator
psql -U postgres
# Enter the superuser password you set during installation
```

### macOS/Linux:
```bash
# Switch to postgres user
sudo -u postgres psql

# OR directly connect
psql -U postgres -h localhost
```

## Step 2: Create DriveSchool Database and User

```sql
-- Connect to PostgreSQL (you should see postgres=# prompt)

-- Create a dedicated user for DriveSchool Pro
CREATE USER driveschool_user WITH PASSWORD 'DriveSchool2024!';

-- Create the database
CREATE DATABASE driveschool_pro_v3 OWNER driveschool_user;

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON DATABASE driveschool_pro_v3 TO driveschool_user;

-- Grant schema privileges (important for Drizzle ORM)
\c driveschool_pro_v3
GRANT ALL ON SCHEMA public TO driveschool_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO driveschool_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO driveschool_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO driveschool_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO driveschool_user;

-- Verify the setup
\l  -- List all databases
\du -- List all users

-- Exit PostgreSQL
\q
```

## Step 3: Test Connection

```bash
# Test connection with the new user
psql -U driveschool_user -d driveschool_pro_v3 -h localhost

# If successful, you should see:
# driveschool_pro_v3=>

# Exit
\q
```

---

# ⚙️ Configure DriveSchool Pro Project

## Step 1: Update Environment Variables

In your DriveSchool Pro project directory:

```bash
# Navigate to your project
cd path/to/DriveSchool-Pro-ver3

# Copy environment file
cp .env.example .env

# Edit .env file
```

**Edit `.env` with these PostgreSQL settings:**

```env
# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=driveschool_user
POSTGRES_PASSWORD=DriveSchool2024!
POSTGRES_DATABASE=driveschool_pro_v3

# Application Settings
BASE_URL=http://localhost:3000
AUTH_SECRET=generate-a-super-secret-key-here-use-openssl-rand-base64-32

# Email Configuration (Optional)
RESEND_API_KEY=

# WhatsApp Configuration (Optional)
WHATSAPP_BUSINESS_NUMBER=
```

## Step 2: Generate Strong AUTH_SECRET

```bash
# Generate a secure auth secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# OR use OpenSSL
openssl rand -base64 32

# Copy the output to AUTH_SECRET in .env
```

## Step 3: Install Dependencies and Setup Database

```bash
# Make sure you're in the project directory
npm install

# Generate Drizzle client
npx drizzle-kit generate

# Run migrations to create tables
npx drizzle-kit migrate

# Seed database with sample data
npm run db:seed
```

## Step 4: Verify Setup

```bash
# Start the development server
npm run dev

# Open browser: http://localhost:3000
# You should see the DriveSchool Pro homepage
```

---

# 🔍 Database Management Tools

## Option 1: pgAdmin (GUI)

**Already installed with PostgreSQL on Windows/Mac**

1. **Open pgAdmin**
2. **Add Server**:
   - Name: DriveSchool Local
   - Host: localhost
   - Port: 5432
   - Username: driveschool_user
   - Password: DriveSchool2024!

## Option 2: Drizzle Studio (Built-in)

```bash
# Start Drizzle Studio (web-based database GUI)
npm run db:studio

# Opens: https://local.drizzle.studio
```

## Option 3: Command Line Tools

```bash
# Connect to database
psql -U driveschool_user -d driveschool_pro_v3 -h localhost

# Useful commands:
\dt          # List all tables
\d+ users    # Describe users table
SELECT * FROM users LIMIT 5;  # Query data
\q           # Exit
```

---

# 🚨 Troubleshooting

## Issue 1: PostgreSQL Service Not Running

### Windows:
```cmd
# Start PostgreSQL service
net start postgresql-x64-16

# OR use Services.msc
# Search "Services" > Find "postgresql-x64-16" > Right-click > Start
```

### macOS:
```bash
# Start with Homebrew
brew services start postgresql@16

# OR manually
pg_ctl -D /usr/local/var/postgres start
```

### Linux:
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl status postgresql
```

## Issue 2: Connection Refused

```bash
# Check if PostgreSQL is listening
# Windows:
netstat -an | findstr 5432

# macOS/Linux:
netstat -an | grep 5432

# Should show: 0.0.0.0:5432 or 127.0.0.1:5432
```

## Issue 3: Authentication Failed

1. **Verify password** is correct
2. **Check pg_hba.conf** file:
   - Windows: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - macOS: `/usr/local/var/postgres/pg_hba.conf`
   - Linux: `/etc/postgresql/16/main/pg_hba.conf`

3. **Ensure this line exists**:
   ```
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all             all                                     md5
   host    all             all             127.0.0.1/32            md5
   ```

## Issue 4: Permission Denied

```sql
-- Reconnect as postgres superuser and run:
psql -U postgres

-- Grant permissions again
GRANT ALL PRIVILEGES ON DATABASE driveschool_pro_v3 TO driveschool_user;
\c driveschool_pro_v3
GRANT ALL ON SCHEMA public TO driveschool_user;
```

## Issue 5: Port Already in Use

```bash
# Find what's using port 5432
# Windows:
netstat -ano | findstr 5432

# macOS/Linux:
lsof -i :5432

# Kill the process or change PostgreSQL port in postgresql.conf
```

---

# ✅ Final Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `driveschool_pro_v3` created
- [ ] User `driveschool_user` created with proper permissions
- [ ] Connection test successful
- [ ] `.env` file configured with correct credentials
- [ ] DriveSchool Pro dependencies installed
- [ ] Database migrations completed
- [ ] Seed data inserted
- [ ] Development server starts without errors
- [ ] Application accessible at http://localhost:3000

---

# 🎯 Next Steps

Once PostgreSQL is set up:

1. **Start Development**: `npm run dev`
2. **Access Database GUI**: `npm run db:studio`
3. **Begin Coding**: Your DriveSchool Pro project is ready!

---

# 📞 Need Help?

**Common PostgreSQL Resources:**
- [Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

**DriveSchool Pro Issues:**
- Check project README.md
- Review VS_CODE_DEPLOYMENT_GUIDE.md
- Search GitHub issues

---

*🎉 **Success!** Your local PostgreSQL is now ready for DriveSchool Pro v3.2.0 development!*