import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function addInstructorApprovalColumn() {
  try {
    console.log('Adding is_approved column to instructors table...');
    
    // Add the column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE instructors 
      ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
    `);
    
    // Update existing instructors to be pending approval  
    await db.execute(sql`
      UPDATE instructors 
      SET is_approved = FALSE 
      WHERE is_approved IS NULL;
    `);
    
    console.log('✅ Successfully added is_approved column to instructors table');
    console.log('✅ All existing instructors set to pending approval');
    
  } catch (error) {
    console.error('❌ Error adding instructor approval column:', error);
    throw error;
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