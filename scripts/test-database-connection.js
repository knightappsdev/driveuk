#!/usr/bin/env node

/**
 * PostgreSQL Connection Test Script
 * Tests database connection for DriveSchool Pro v3.2.0
 */

const postgres = require('postgres');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🔍 Testing PostgreSQL connection for DriveSchool Pro...\n');

  // Check environment variables (matching the actual .env structure)
  const requiredEnvVars = [
    'POSTGRES_HOST',
    'POSTGRES_PORT', 
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ];

  console.log('📋 Checking environment variables:');
  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      // Mask password for security
      const displayValue = varName === 'POSTGRES_PASSWORD' ? '*'.repeat(value.length) : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`   ❌ ${varName}: NOT SET`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`);
    console.log('\n📝 Your .env file should contain:');
    console.log('   POSTGRES_HOST=localhost');
    console.log('   POSTGRES_PORT=5432');
    console.log('   POSTGRES_USER=driveschool_user');
    console.log('   POSTGRES_PASSWORD=DriveSchool2024!');
    console.log('   POSTGRES_DATABASE=driveschool_pro_v3');
    console.log('   AUTH_SECRET=your-generated-secret-key');
    console.log('\n💡 Steps to fix:');
    console.log('   1. Copy .env.template to .env: cp .env.template .env');
    console.log('   2. Edit .env with your PostgreSQL credentials');
    console.log('   3. Generate AUTH_SECRET: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
    process.exit(1);
  }

  // Build connection string
  const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DATABASE}`;
  
  console.log(`\n🔗 Connection string: postgresql://${process.env.POSTGRES_USER}:***@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DATABASE}`);

  try {
    // Create connection
    console.log('\n⏳ Attempting to connect to PostgreSQL...');
    const sql = postgres(connectionString, { 
      max: 1,
      connect_timeout: 10,
      idle_timeout: 5
    });

    // Test basic query
    console.log('🔍 Running test query...');
    const result = await sql`SELECT version() as version, current_database() as database, current_user as user`;
    
    console.log('\n🎉 Connection successful!');
    console.log('📊 Database info:');
    console.log(`   Database: ${result[0].database}`);
    console.log(`   User: ${result[0].user}`);
    console.log(`   PostgreSQL Version: ${result[0].version}`);

    // Test database permissions
    console.log('\n🔐 Testing database permissions...');
    try {
      await sql`CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_value TEXT)`;
      await sql`INSERT INTO connection_test (test_value) VALUES ('test') ON CONFLICT DO NOTHING`;
      const testResult = await sql`SELECT COUNT(*) as count FROM connection_test`;
      await sql`DROP TABLE IF EXISTS connection_test`;
      
      console.log('   ✅ Create table: SUCCESS');
      console.log('   ✅ Insert data: SUCCESS');
      console.log('   ✅ Select data: SUCCESS');
      console.log('   ✅ Drop table: SUCCESS');
    } catch (permError) {
      console.log('   ❌ Permission test failed:', permError.message);
      console.log('   💡 You may need to grant additional permissions to your user.');
    }

    // Close connection
    await sql.end();
    
    console.log('\n🎉 PostgreSQL setup is ready for DriveSchool Pro!');
    console.log('\n🚀 Next steps to get your app running:');
    console.log('   1. npm install                    # Install dependencies');
    console.log('   2. npx drizzle-kit generate       # Generate database client');
    console.log('   3. npx drizzle-kit migrate        # Create database tables');
    console.log('   4. npm run db:seed               # Add sample data');
    console.log('   5. npm run dev                   # Start development server');
    console.log('\n🔍 Optional database tools:');
    console.log('   • npm run db:studio              # Open database GUI');
    console.log('   • psql -U driveschool_user -d driveschool_pro_v3 -h localhost  # Command line access');

  } catch (error) {
    console.log('\n❌ Connection failed!');
    console.log('🚨 Error:', error.message);
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Ensure PostgreSQL is running');
    console.log('   2. Verify database and user exist');
    console.log('   3. Check connection credentials in .env file');
    console.log('   4. Confirm PostgreSQL is accepting connections on port 5432');
    console.log('\n📄 Your .env file should contain these PostgreSQL variables:');
    console.log('   POSTGRES_HOST=localhost');
    console.log('   POSTGRES_PORT=5432');
    console.log('   POSTGRES_USER=driveschool_user');
    console.log('   POSTGRES_PASSWORD=DriveSchool2024!');
    console.log('   POSTGRES_DATABASE=driveschool_pro_v3');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused - PostgreSQL might not be running:');
      console.log('   Windows: net start postgresql-x64-16');
      console.log('   macOS: brew services start postgresql@16');
      console.log('   Linux: sudo systemctl start postgresql');
    }
    
    if (error.code === '28P01') {
      console.log('\n💡 Authentication failed - check username/password:');
      console.log('   1. Verify POSTGRES_USER and POSTGRES_PASSWORD in .env');
      console.log('   2. Ensure user exists in PostgreSQL');
      console.log('   3. Check pg_hba.conf authentication method');
    }
    
    if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   Connect as postgres user and run:');
      console.log('   CREATE DATABASE driveschool_pro_v3;');
    }

    process.exit(1);
  }
}

// Run the test
testDatabaseConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});