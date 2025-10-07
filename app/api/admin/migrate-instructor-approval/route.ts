import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
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
    
    return NextResponse.json({
      success: true,
      message: 'Successfully added is_approved column to instructors table'
    });
    
  } catch (error) {
    console.error('❌ Error adding instructor approval column:', error);
    return NextResponse.json(
      { success: false, message: 'Error adding instructor approval column', error: error.message },
      { status: 500 }
    );
  }
}