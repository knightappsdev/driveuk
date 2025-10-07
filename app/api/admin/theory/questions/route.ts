import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { ukTheoryQuestions, ukTheoryCategories } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, like, and, desc, asc } from 'drizzle-orm';

// GET - Fetch theory questions for admin
export async function GET(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    // Build where conditions
    let whereConditions = [];
    if (categoryId && categoryId !== 'all') {
      whereConditions.push(eq(ukTheoryQuestions.categoryId, parseInt(categoryId)));
    }
    if (difficulty && difficulty !== 'all') {
      whereConditions.push(eq(ukTheoryQuestions.difficultyLevel, difficulty));
    }
    if (search) {
      whereConditions.push(like(ukTheoryQuestions.questionText, `%${search}%`));
    }

    const offset = (page - 1) * limit;

    // Fetch questions with category info
    const questions = await db
      .select({
        id: ukTheoryQuestions.id,
        categoryId: ukTheoryQuestions.categoryId,
        categoryName: ukTheoryCategories.categoryName,
        questionType: ukTheoryQuestions.questionType,
        difficultyLevel: ukTheoryQuestions.difficultyLevel,
        questionText: ukTheoryQuestions.questionText,
        questionImage: ukTheoryQuestions.questionImage,
        optionA: ukTheoryQuestions.optionA,
        optionB: ukTheoryQuestions.optionB,
        optionC: ukTheoryQuestions.optionC,
        optionD: ukTheoryQuestions.optionD,
        correctAnswer: ukTheoryQuestions.correctAnswer,
        explanation: ukTheoryQuestions.explanation,
        officialReference: ukTheoryQuestions.officialReference,
        isActive: ukTheoryQuestions.isActive,
        timesAsked: ukTheoryQuestions.timesAsked,
        timesCorrect: ukTheoryQuestions.timesCorrect,
        createdAt: ukTheoryQuestions.createdAt,
        updatedAt: ukTheoryQuestions.updatedAt
      })
      .from(ukTheoryQuestions)
      .leftJoin(ukTheoryCategories, eq(ukTheoryQuestions.categoryId, ukTheoryCategories.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(ukTheoryQuestions.updatedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: ukTheoryQuestions.id })
      .from(ukTheoryQuestions)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return NextResponse.json({
      success: true,
      data: {
        questions,
        pagination: {
          page,
          limit,
          total: totalCount.length,
          totalPages: Math.ceil(totalCount.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching theory questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory questions' },
      { status: 500 }
    );
  }
}

// POST - Create new theory question
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
      categoryId,
      questionType,
      difficultyLevel,
      questionText,
      questionImage,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      officialReference
    } = body;

    // Validate required fields
    if (!categoryId || !questionText || !optionA || !optionB || !correctAnswer || !explanation) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new question
    const newQuestion = await db
      .insert(ukTheoryQuestions)
      .values({
        categoryId: parseInt(categoryId),
        questionType: questionType || 'multiple_choice',
        difficultyLevel: difficultyLevel || 'foundation',
        questionText,
        questionImage: questionImage || null,
        optionA,
        optionB,
        optionC: optionC || null,
        optionD: optionD || null,
        correctAnswer,
        explanation,
        officialReference: officialReference || null,
        isActive: true
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Theory question created successfully',
      data: newQuestion[0]
    });
  } catch (error) {
    console.error('Error creating theory question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create theory question' },
      { status: 500 }
    );
  }
}

// PUT - Update theory question
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
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Update question
    const updatedQuestion = await db
      .update(ukTheoryQuestions)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(ukTheoryQuestions.id, parseInt(id)))
      .returning();

    if (updatedQuestion.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Theory question updated successfully',
      data: updatedQuestion[0]
    });
  } catch (error) {
    console.error('Error updating theory question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theory question' },
      { status: 500 }
    );
  }
}

// DELETE - Delete theory question
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
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Delete question
    const deletedQuestion = await db
      .delete(ukTheoryQuestions)
      .where(eq(ukTheoryQuestions.id, parseInt(id)))
      .returning();

    if (deletedQuestion.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Theory question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theory question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete theory question' },
      { status: 500 }
    );
  }
}