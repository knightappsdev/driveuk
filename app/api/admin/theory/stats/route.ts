import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { ukTheoryQuestions, ukTheoryCategories } from '@/lib/db/schema';
import { validateApiAccess } from '@/lib/auth/auth-helpers';
import { sql, eq, and, gte } from 'drizzle-orm';

// GET - Fetch theory test statistics for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const accessResult = await validateApiAccess();
    if (!accessResult.success) {
      return NextResponse.json(
        { success: false, error: accessResult.error },
        { status: accessResult.status }
      );
    }

    // Get basic statistics
    const totalQuestions = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryQuestions);

    const activeQuestions = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryQuestions)
      .where(eq(ukTheoryQuestions.isActive, true));

    const totalCategories = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryCategories);

    const activeCategories = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryCategories)
      .where(eq(ukTheoryCategories.isActive, true));

    // Get difficulty distribution
    const difficultyStats = await db
      .select({
        difficulty: ukTheoryQuestions.difficultyLevel,
        count: sql<number>`count(*)`
      })
      .from(ukTheoryQuestions)
      .groupBy(ukTheoryQuestions.difficultyLevel);

    // Get category statistics with question counts and accuracy
    const categoryStats = await db
      .select({
        id: ukTheoryCategories.id,
        categoryCode: ukTheoryCategories.categoryCode,
        categoryName: ukTheoryCategories.categoryName,
        totalQuestions: sql<number>`count(${ukTheoryQuestions.id})`,
        activeQuestions: sql<number>`count(case when ${ukTheoryQuestions.isActive} = true then 1 end)`,
        totalAttempts: sql<number>`sum(${ukTheoryQuestions.timesAsked})`,
        totalCorrect: sql<number>`sum(${ukTheoryQuestions.timesCorrect})`,
        avgAccuracy: sql<number>`round(
          case 
            when sum(${ukTheoryQuestions.timesAsked}) > 0 
            then (sum(${ukTheoryQuestions.timesCorrect}) * 100.0 / sum(${ukTheoryQuestions.timesAsked}))
            else 0 
          end, 2
        )`
      })
      .from(ukTheoryCategories)
      .leftJoin(ukTheoryQuestions, eq(ukTheoryCategories.id, ukTheoryQuestions.categoryId))
      .groupBy(ukTheoryCategories.id, ukTheoryCategories.categoryCode, ukTheoryCategories.categoryName)
      .orderBy(ukTheoryCategories.displayOrder, ukTheoryCategories.categoryName);

    // Get question type distribution
    const questionTypeStats = await db
      .select({
        questionType: ukTheoryQuestions.questionType,
        count: sql<number>`count(*)`
      })
      .from(ukTheoryQuestions)
      .groupBy(ukTheoryQuestions.questionType);

    // Get recent activity (questions created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentQuestions = await db
      .select({ count: sql<number>`count(*)` })
      .from(ukTheoryQuestions)
      .where(gte(ukTheoryQuestions.createdAt, thirtyDaysAgo));

    // Get most challenging questions (lowest accuracy rates with significant attempts)
    const challengingQuestions = await db
      .select({
        id: ukTheoryQuestions.id,
        categoryName: ukTheoryCategories.categoryName,
        questionText: sql<string>`substring(${ukTheoryQuestions.questionText}, 1, 100)`,
        timesAsked: ukTheoryQuestions.timesAsked,
        timesCorrect: ukTheoryQuestions.timesCorrect,
        accuracy: sql<number>`round(
          case 
            when ${ukTheoryQuestions.timesAsked} > 0 
            then (${ukTheoryQuestions.timesCorrect} * 100.0 / ${ukTheoryQuestions.timesAsked})
            else 0 
          end, 1
        )`
      })
      .from(ukTheoryQuestions)
      .leftJoin(ukTheoryCategories, eq(ukTheoryQuestions.categoryId, ukTheoryCategories.id))
      .where(and(
        gte(ukTheoryQuestions.timesAsked, 10), // At least 10 attempts
        eq(ukTheoryQuestions.isActive, true)
      ))
      .orderBy(sql`accuracy ASC`)
      .limit(10);

    // Get most popular questions (highest attempt counts)
    const popularQuestions = await db
      .select({
        id: ukTheoryQuestions.id,
        categoryName: ukTheoryCategories.categoryName,
        questionText: sql<string>`substring(${ukTheoryQuestions.questionText}, 1, 100)`,
        timesAsked: ukTheoryQuestions.timesAsked,
        timesCorrect: ukTheoryQuestions.timesCorrect,
        accuracy: sql<number>`round(
          case 
            when ${ukTheoryQuestions.timesAsked} > 0 
            then (${ukTheoryQuestions.timesCorrect} * 100.0 / ${ukTheoryQuestions.timesAsked})
            else 0 
          end, 1
        )`
      })
      .from(ukTheoryQuestions)
      .leftJoin(ukTheoryCategories, eq(ukTheoryQuestions.categoryId, ukTheoryCategories.id))
      .where(eq(ukTheoryQuestions.isActive, true))
      .orderBy(sql`${ukTheoryQuestions.timesAsked} DESC`)
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalQuestions: totalQuestions[0].count,
          activeQuestions: activeQuestions[0].count,
          totalCategories: totalCategories[0].count,
          activeCategories: activeCategories[0].count,
          recentQuestions: recentQuestions[0].count
        },
        difficultyDistribution: difficultyStats,
        questionTypeDistribution: questionTypeStats,
        categoryStats,
        challengingQuestions,
        popularQuestions
      }
    });
  } catch (error) {
    console.error('Error fetching theory statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theory statistics' },
      { status: 500 }
    );
  }
}