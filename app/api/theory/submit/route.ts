import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { 
  studentTheoryProgress, 
  mockTheoryTests, 
  userPoints, 
  userAchievements,
  achievements,
  theoryTestStats,
  ukTheoryQuestions
} from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// POST - Submit practice session results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      sessionId, 
      categoryId, 
      results, 
      timeSpent, 
      sessionType = 'practice' 
    } = body;

    if (!userId || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission data' },
        { status: 400 }
      );
    }

    const totalQuestions = results.length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const accuracyPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // Update question statistics
    for (const result of results) {
      await db
        .insert(theoryTestStats)
        .values({
          questionId: result.questionId,
          timesShown: 1,
          timesCorrect: result.isCorrect ? 1 : 0,
          timesIncorrect: result.isCorrect ? 0 : 1,
          averageTimeSpent: result.timeSpent || 0
        })
        .onConflictDoUpdate({
          target: [theoryTestStats.questionId],
          set: {
            timesShown: sql`${theoryTestStats.timesShown} + 1`,
            timesCorrect: sql`${theoryTestStats.timesCorrect} + ${result.isCorrect ? 1 : 0}`,
            timesIncorrect: sql`${theoryTestStats.timesIncorrect} + ${result.isCorrect ? 0 : 1}`,
            averageTimeSpent: sql`(${theoryTestStats.averageTimeSpent} * ${theoryTestStats.timesShown} + ${result.timeSpent || 0}) / (${theoryTestStats.timesShown} + 1)`,
            lastUpdated: new Date()
          }
        });
    }

    // Update or create student progress
    if (categoryId && categoryId !== 'all') {
      await db
        .insert(studentTheoryProgress)
        .values({
          studentId: parseInt(userId),
          categoryId: parseInt(categoryId),
          questionsAttempted: totalQuestions,
          questionsCorrect: correctAnswers,
          accuracyPercentage: accuracyPercentage,
          lastPracticeDate: new Date(),
          totalPracticeTime: timeSpent || 0,
          isReadyForTest: parseFloat(accuracyPercentage) >= 80
        })
        .onConflictDoUpdate({
          target: [studentTheoryProgress.studentId, studentTheoryProgress.categoryId],
          set: {
            questionsAttempted: sql`${studentTheoryProgress.questionsAttempted} + ${totalQuestions}`,
            questionsCorrect: sql`${studentTheoryProgress.questionsCorrect} + ${correctAnswers}`,
            accuracyPercentage: sql`ROUND((${studentTheoryProgress.questionsCorrect} + ${correctAnswers}) * 100.0 / (${studentTheoryProgress.questionsAttempted} + ${totalQuestions}), 2)`,
            lastPracticeDate: new Date(),
            totalPracticeTime: sql`${studentTheoryProgress.totalPracticeTime} + ${timeSpent || 0}`,
            isReadyForTest: sql`CASE WHEN ROUND((${studentTheoryProgress.questionsCorrect} + ${correctAnswers}) * 100.0 / (${studentTheoryProgress.questionsAttempted} + ${totalQuestions}), 2) >= 80 THEN true ELSE false END`,
            updatedAt: new Date()
          }
        });
    }

    // Calculate points earned
    let pointsEarned = 0;
    pointsEarned += correctAnswers * 10; // 10 points per correct answer
    if (parseFloat(accuracyPercentage) >= 90) pointsEarned += 50; // Bonus for excellence
    if (parseFloat(accuracyPercentage) >= 80) pointsEarned += 25; // Bonus for passing
    if (timeSpent && timeSpent < totalQuestions * 60) pointsEarned += 20; // Speed bonus

    // Update user points
    await db
      .insert(userPoints)
      .values({
        userId: parseInt(userId),
        totalPoints: pointsEarned,
        theoryPoints: pointsEarned,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date()
      })
      .onConflictDoUpdate({
        target: [userPoints.userId],
        set: {
          totalPoints: sql`${userPoints.totalPoints} + ${pointsEarned}`,
          theoryPoints: sql`${userPoints.theoryPoints} + ${pointsEarned}`,
          currentStreak: sql`CASE WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE - INTERVAL '1 day' THEN ${userPoints.currentStreak} + 1 WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE THEN ${userPoints.currentStreak} ELSE 1 END`,
          longestStreak: sql`CASE WHEN (CASE WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE - INTERVAL '1 day' THEN ${userPoints.currentStreak} + 1 WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE THEN ${userPoints.currentStreak} ELSE 1 END) > ${userPoints.longestStreak} THEN (CASE WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE - INTERVAL '1 day' THEN ${userPoints.currentStreak} + 1 WHEN DATE(${userPoints.lastActivityDate}) = CURRENT_DATE THEN ${userPoints.currentStreak} ELSE 1 END) ELSE ${userPoints.longestStreak} END`,
          lastActivityDate: new Date(),
          updatedAt: new Date()
        }
      });

    // Check for achievements
    const newAchievements = await checkAchievements(userId, {
      accuracyPercentage: parseFloat(accuracyPercentage),
      correctAnswers,
      totalQuestions,
      categoryId: categoryId !== 'all' ? parseInt(categoryId) : null
    });

    // Record the session
    await db.insert(mockTheoryTests).values({
      studentId: parseInt(userId),
      testName: `Practice Session - ${new Date().toLocaleDateString()}`,
      testType: sessionType,
      totalQuestions,
      questionsCorrect: correctAnswers,
      scorePercentage: accuracyPercentage,
      timeSpent: Math.ceil((timeSpent || 0) / 60), // Convert to minutes
      status: 'completed',
      questionsData: results,
      overallResult: parseFloat(accuracyPercentage) >= 80 ? 'pass' : 'fail',
      startedAt: new Date(Date.now() - (timeSpent || 0) * 1000),
      completedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: {
        score: correctAnswers,
        totalQuestions,
        accuracyPercentage: parseFloat(accuracyPercentage),
        pointsEarned,
        result: parseFloat(accuracyPercentage) >= 80 ? 'pass' : 'fail',
        newAchievements,
        feedback: generateFeedback(parseFloat(accuracyPercentage), results)
      }
    });
  } catch (error) {
    console.error('Error submitting practice session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit practice session' },
      { status: 500 }
    );
  }
}

async function checkAchievements(userId: string, sessionData: any) {
  const newAchievements = [];
  
  // Check for accuracy-based achievements
  if (sessionData.accuracyPercentage >= 100) {
    // Perfect Score achievement
    await awardAchievement(userId, 'perfect_score', newAchievements);
  } else if (sessionData.accuracyPercentage >= 90) {
    // Excellence achievement
    await awardAchievement(userId, 'excellence', newAchievements);
  }

  // Check for streak achievements
  const userPointsData = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, parseInt(userId)))
    .limit(1);

  if (userPointsData.length > 0) {
    const streak = userPointsData[0].currentStreak;
    if (streak >= 7) {
      await awardAchievement(userId, 'week_streak', newAchievements);
    }
    if (streak >= 30) {
      await awardAchievement(userId, 'month_streak', newAchievements);
    }
  }

  return newAchievements;
}

async function awardAchievement(userId: string, achievementKey: string, newAchievements: any[]) {
  // This would check if the achievement exists and award it if not already earned
  // For now, just add to the array
  newAchievements.push({
    name: getAchievementName(achievementKey),
    description: getAchievementDescription(achievementKey),
    points: getAchievementPoints(achievementKey)
  });
}

function getAchievementName(key: string): string {
  const names: Record<string, string> = {
    'perfect_score': 'Perfect Score!',
    'excellence': 'Excellence',
    'week_streak': 'Week Warrior',
    'month_streak': 'Month Master'
  };
  return names[key] || 'Achievement';
}

function getAchievementDescription(key: string): string {
  const descriptions: Record<string, string> = {
    'perfect_score': 'Scored 100% on a practice session',
    'excellence': 'Scored 90% or higher on a practice session',
    'week_streak': 'Practiced for 7 days in a row',
    'month_streak': 'Practiced for 30 days in a row'
  };
  return descriptions[key] || 'Achievement unlocked';
}

function getAchievementPoints(key: string): number {
  const points: Record<string, number> = {
    'perfect_score': 100,
    'excellence': 50,
    'week_streak': 200,
    'month_streak': 500
  };
  return points[key] || 10;
}

function generateFeedback(accuracyPercentage: number, results: any[]): string {
  if (accuracyPercentage >= 90) {
    return "Excellent work! You're ready for the official test. Keep practicing to maintain this level.";
  } else if (accuracyPercentage >= 80) {
    return "Good job! You're at passing level. Focus on your weak areas to improve further.";
  } else if (accuracyPercentage >= 70) {
    return "You're making progress! Review the explanations for incorrect answers and practice more.";
  } else {
    return "Keep practicing! Focus on understanding the Highway Code and review explanations carefully.";
  }
}