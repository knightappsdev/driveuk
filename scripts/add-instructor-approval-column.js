const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addInstructorApprovalColumn() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Adding is_approved column to instructors table...');
    
    // Add the column if it doesn't exist
    await pool.query(`
      ALTER TABLE instructors 
      ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
    `);
    
    // Update existing instructors to be pending approval  
    const result = await pool.query(`
      UPDATE instructors 
      SET is_approved = FALSE 
      WHERE is_approved IS NULL;
    `);
    
    console.log('✅ Successfully added is_approved column to instructors table');
    console.log(`✅ Updated ${result.rowCount} existing instructors to pending approval`);
    
  } catch (error) {
    console.error('❌ Error adding instructor approval column:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
addInstructorApprovalColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });