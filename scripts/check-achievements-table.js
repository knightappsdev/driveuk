require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const client = postgres(process.env.DATABASE_URL);

async function checkAchievementsTable() {
  try {
    console.log('🔍 Checking achievements table structure...');
    
    const columns = await client`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'achievements' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Achievements table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });
    
    // Also check if achievements table exists and has data
    const count = await client`SELECT COUNT(*) as count FROM achievements`;
    console.log(`\n📊 Current achievements count: ${count[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAchievementsTable();