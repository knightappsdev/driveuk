const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://driveschool_user:DriveSchool2024!@localhost:5432/driveschool_pro_v3';
const client = postgres(connectionString);
const db = drizzle(client);

async function addIsRecommendedColumn() {
  try {
    console.log('🚀 Adding isRecommended column to courses table...');

    // Add the isRecommended column to the courses table
    await client`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE;
    `;

    console.log('✅ Successfully added isRecommended column to courses table');

  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('⚠️  Column is_recommended already exists in courses table');
    } else {
      console.error('❌ Error adding isRecommended column:', error);
      throw error;
    }
  } finally {
    await client.end();
  }
}

addIsRecommendedColumn().then(() => {
  console.log('🏁 Migration completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});