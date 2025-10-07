import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { ukTheoryCategories, ukTheoryQuestions } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, desc, sql } from 'drizzle-orm';

// GET - Fetch theory categories for admin with question counts
export async function GET(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Fetch categories with question counts
    const categories = await db
      .select({
        id: ukTheoryCategories.id,
        categoryCode: ukTheoryCategories.categoryCode,
        categoryName: ukTheoryCategories.categoryName,
        description: ukTheoryCategories.description,
        passRequirement: ukTheoryCategories.passRequirement,
        displayOrder: ukTheoryCategories.displayOrder,
        isActive: ukTheoryCategories.isActive,
        createdAt: ukTheoryCategories.createdAt,
        updatedAt: ukTheoryCategories.updatedAt,
        totalQuestions: sql<number>`count(${ukTheoryQuestions.id})`,
        activeQuestions: sql<number>`count(case when ${ukTheoryQuestions.isActive} = true then 1 end)`
      })
      .from(ukTheoryCategories)
      .leftJoin(ukTheoryQuestions, eq(ukTheoryCategories.id, ukTheoryQuestions.categoryId))
      .groupBy(ukTheoryCategories.id)
      .orderBy(ukTheoryCategories.displayOrder, ukTheoryCategories.categoryName);

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching theory categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory categories' },
      { status: 500 }
    );
  }
}

// POST - Create new theory category
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
    const {
      categoryCode,
      categoryName,
      description,
      passRequirement,
      displayOrder,
      isActive
    } = body;

    // Validate required fields
    if (!categoryCode || !categoryName || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: categoryCode, categoryName, description' },
        { status: 400 }
      );
    }

    // Check if category code already exists
    const existingCategory = await db
      .select()
      .from(ukTheoryCategories)
      .where(eq(ukTheoryCategories.categoryCode, categoryCode))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category code already exists' },
        { status: 409 }
      );
    }

    // Create new category
    const newCategory = await db
      .insert(ukTheoryCategories)
      .values({
        categoryCode,
        categoryName,
        description,
        passRequirement: passRequirement || 8,
        displayOrder: displayOrder || 999,
        isActive: isActive !== undefined ? isActive : true
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Theory category created successfully',
      data: newCategory[0]
    });
  } catch (error) {
    console.error('Error creating theory category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create theory category' },
      { status: 500 }
    );
  }
}

// PUT - Update theory category
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // If updating category code, check for conflicts
    if (updateData.categoryCode) {
      const existingCategory = await db
        .select()
        .from(ukTheoryCategories)
        .where(eq(ukTheoryCategories.categoryCode, updateData.categoryCode))
        .limit(1);

      if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(id)) {
        return NextResponse.json(
          { success: false, error: 'Category code already exists' },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await db
      .update(ukTheoryCategories)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(ukTheoryCategories.id, parseInt(id)))
      .returning();

    if (updatedCategory.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Theory category updated successfully',
      data: updatedCategory[0]
    });
  } catch (error) {
    console.error('Error updating theory category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theory category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete theory category
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category has questions
    const questionsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryQuestions)
      .where(eq(ukTheoryQuestions.categoryId, parseInt(id)));

    if (questionsCount[0].count > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing questions. Please move or delete questions first.' },
        { status: 409 }
      );
    }

    // Delete category
    const deletedCategory = await db
      .delete(ukTheoryCategories)
      .where(eq(ukTheoryCategories.id, parseInt(id)))
      .returning();

    if (deletedCategory.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Theory category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theory category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete theory category' },
      { status: 500 }
    );
  }
}