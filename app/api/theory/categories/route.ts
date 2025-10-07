import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { ukTheoryCategories, ukTheoryQuestions, studentTheoryProgress, userPoints } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { eq, and, sql, desc, asc } from 'drizzle-orm';

// GET - Fetch theory categories with progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch all active theory categories
    const categories = await db
      .select()
      .from(ukTheoryCategories)
      .where(eq(ukTheoryCategories.isActive, true))
      .orderBy(ukTheoryCategories.displayOrder);

    // If userId provided, fetch progress for each category
    let categoriesWithProgress = categories;
    if (userId) {
      const progressData = await db
        .select()
        .from(studentTheoryProgress)
        .where(eq(studentTheoryProgress.studentId, parseInt(userId)));

      categoriesWithProgress = categories.map(category => {
        const progress = progressData.find(p => p.categoryId === category.id);
        return {
          ...category,
          progress: progress ? {
            questionsAttempted: progress.questionsAttempted,
            questionsCorrect: progress.questionsCorrect,
            accuracyPercentage: progress.accuracyPercentage,
            isReadyForTest: progress.isReadyForTest,
            lastPracticeDate: progress.lastPracticeDate
          } : null
        };
      });
    }

    return NextResponse.json({
      success: true,
      data: categoriesWithProgress
    });
  } catch (error) {
    console.error('Error fetching theory categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory categories' },
      { status: 500 }
    );
  }
}

// POST - Start a new practice session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, categoryId, questionCount = 10, difficulty = 'all' } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build query conditions
    let whereConditions = [eq(ukTheoryQuestions.isActive, true)];
    
    if (categoryId && categoryId !== 'all') {
      whereConditions.push(eq(ukTheoryQuestions.categoryId, parseInt(categoryId)));
    }

    if (difficulty !== 'all') {
      whereConditions.push(eq(ukTheoryQuestions.difficultyLevel, difficulty));
    }

    // Fetch random questions
    const questions = await db
      .select({
        id: ukTheoryQuestions.id,
        categoryId: ukTheoryQuestions.categoryId,
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
        officialReference: ukTheoryQuestions.officialReference
      })
      .from(ukTheoryQuestions)
      .where(and(...whereConditions))
      .orderBy(sql`RANDOM()`)
      .limit(questionCount);

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions found for the specified criteria' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: `session_${Date.now()}_${userId}`,
        questions: questions,
        totalQuestions: questions.length,
        timeLimit: questions.length * 120, // 2 minutes per question
        categoryId: categoryId
      }
    });
  } catch (error) {
    console.error('Error starting practice session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start practice session' },
      { status: 500 }
    );
  }
}