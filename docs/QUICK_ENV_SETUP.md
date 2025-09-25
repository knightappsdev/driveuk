# ⚡ Quick .env Setup for DriveSchool Pro v3.2.0

## 🔧 Step 1: Create Your .env File

Copy the template to create your actual environment file:

```bash
# In your DriveSchool Pro project directory
cp .env.template .env
```

## 📝 Step 2: Edit Your .env File

Open `.env` in your text editor and make sure it contains exactly this:

```env
# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=driveschool_user
POSTGRES_PASSWORD=DriveSchool2024!
POSTGRES_DATABASE=driveschool_pro_v3

# Application Configuration  
BASE_URL=http://localhost:3000
AUTH_SECRET=REPLACE_WITH_GENERATED_SECRET

# Optional: Email Configuration
RESEND_API_KEY=

# Optional: WhatsApp Configuration
WHATSAPP_BUSINESS_NUMBER=
```

## 🔐 Step 3: Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and replace `REPLACE_WITH_GENERATED_SECRET` in your `.env` file.

**Example output:** `xl8fJ9k2mN5pQ8rT1uY6vZ3wA7bC4dE0fG9hI2jK5lM8nO1pR4sT7uX0yZ3wA6b`

## ✅ Step 4: Test Your Configuration

Run the database connection test:

```bash
npm run db:test
```

**Expected Success Output:**
```
🔍 Testing PostgreSQL connection for DriveSchool Pro...

📋 Checking environment variables:
   ✅ POSTGRES_HOST: localhost
   ✅ POSTGRES_PORT: 5432
   ✅ POSTGRES_USER: driveschool_user
   ✅ POSTGRES_PASSWORD: ********************
   ✅ POSTGRES_DATABASE: driveschool_pro_v3

🔗 Connection string: postgresql://driveschool_user:***@localhost:5432/driveschool_pro_v3

⏳ Attempting to connect to PostgreSQL...
🔍 Running test query...

🎉 Connection successful!
📊 Database info:
   Database: driveschool_pro_v3
   User: driveschool_user
   PostgreSQL Version: PostgreSQL 16.x...

🔐 Testing database permissions...
   ✅ Create table: SUCCESS
   ✅ Insert data: SUCCESS
   ✅ Select data: SUCCESS
   ✅ Drop table: SUCCESS

🎉 PostgreSQL setup is ready for DriveSchool Pro!
```

## 🚨 If the Test Fails

### Missing Environment Variables:
```
❌ Missing environment variables: POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD

💡 Steps to fix:
   1. Copy .env.template to .env: cp .env.template .env
   2. Edit .env with your PostgreSQL credentials
   3. Generate AUTH_SECRET: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Solution:** Make sure your `.env` file exists and contains all required variables.

### Connection Refused:
```
❌ Connection failed!
🚨 Error: connect ECONNREFUSED 127.0.0.1:5432

💡 Connection refused - PostgreSQL might not be running:
   Windows: net start postgresql-x64-16
   macOS: brew services start postgresql@16
   Linux: sudo systemctl start postgresql
```

**Solution:** Start PostgreSQL service on your system.

### Authentication Failed:
```
❌ Connection failed!
🚨 Error: password authentication failed for user "driveschool_user"

💡 Authentication failed - check username/password:
   1. Verify POSTGRES_USER and POSTGRES_PASSWORD in .env
   2. Ensure user exists in PostgreSQL
   3. Check pg_hba.conf authentication method
```

**Solution:** Verify the database user exists and password is correct.

## 📄 Complete Working Example

Here's what your final `.env` file should look like (with real values):

```env
# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=driveschool_user
POSTGRES_PASSWORD=DriveSchool2024!
POSTGRES_DATABASE=driveschool_pro_v3

# Application Configuration
BASE_URL=http://localhost:3000
AUTH_SECRET=xl8fJ9k2mN5pQ8rT1uY6vZ3wA7bC4dE0fG9hI2jK5lM8nO1pR4sT7uX0yZ3wA6b

# Optional: Email Configuration (leave empty if not needed)
RESEND_API_KEY=

# Optional: WhatsApp Configuration (leave empty if not needed)  
WHATSAPP_BUSINESS_NUMBER=
```

## 🚀 Ready to Run!

Once your `.env` is configured and the test passes:

```bash
# Install dependencies
npm install

# Setup database
npx drizzle-kit generate
npx drizzle-kit migrate
npm run db:seed

# Start development server
npm run dev
```

Visit: http://localhost:3000

**Your DriveSchool Pro v3.2.0 should now be running perfectly! 🎉**