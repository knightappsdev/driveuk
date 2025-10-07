import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { customCourseSkills } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq } from 'drizzle-orm';

// POST - Create new skill
export async function POST(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const body = await request.json();
    console.log('Creating new skill:', body);

    // Validate required fields
    if (!body.skillId || !body.name || !body.category || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: skillId, name, category, description' },
        { status: 400 }
      );
    }

    // Check if skill already exists
    const existingSkill = await db
      .select()
      .from(customCourseSkills)
      .where(eq(customCourseSkills.skillId, body.skillId))
      .limit(1);

    if (existingSkill.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Skill with this ID already exists' },
        { status: 400 }
      );
    }

    // Create new skill
    const newSkill = await db
      .insert(customCourseSkills)
      .values({
        skillId: body.skillId,
        name: body.name,
        category: body.category,
        description: body.description,
        isActive: body.isActive !== undefined ? body.isActive : true,
        displayOrder: body.displayOrder || 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Skill created successfully',
      data: newSkill[0],
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

// PUT - Update existing skill
export async function PUT(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Update skill
    const updatedSkill = await db
      .update(customCourseSkills)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(customCourseSkills.id, id))
      .returning();

    if (updatedSkill.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill[0],
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE - Delete skill
export async function DELETE(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();

    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Delete skill
    const deletedSkill = await db
      .delete(customCourseSkills)
      .where(eq(customCourseSkills.id, parseInt(id)))
      .returning();

    if (deletedSkill.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}