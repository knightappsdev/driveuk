import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { coursePurchases, courses } from '@/lib/db/schema';
import { desc, eq, gte, sql, and } from 'drizzle-orm';
import { validateApiAccess } from '@/lib/auth/auth-helpers';

// Get purchase statistics
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') || '24h';
    
    // Calculate time window
    const now = new Date();
    let startTime: Date;
    
    switch (timeframe) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get total purchases count
    const totalPurchasesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(coursePurchases);
    
    const totalPurchases = totalPurchasesResult[0]?.count || 0;

    // Get purchases in timeframe
    const recentPurchasesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(coursePurchases)
      .where(gte(coursePurchases.createdAt, startTime));
    
    const recentPurchases = recentPurchasesResult[0]?.count || 0;

    // Get recent purchase notifications (last 10)
    const recentNotifications = await db
      .select({
        id: coursePurchases.id,
        studentName: coursePurchases.studentName,
        location: coursePurchases.location,
        courseName: courses.title,
        createdAt: coursePurchases.createdAt,
        purchaseAmount: coursePurchases.purchaseAmount,
      })
      .from(coursePurchases)
      .leftJoin(courses, eq(coursePurchases.courseId, courses.id))
      .orderBy(desc(coursePurchases.createdAt))
      .limit(10);

    // Get purchases by course (top 5)
    const courseStats = await db
      .select({
        courseId: coursePurchases.courseId,
        courseName: courses.title,
        count: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(${coursePurchases.purchaseAmount})`,
      })
      .from(coursePurchases)
      .leftJoin(courses, eq(coursePurchases.courseId, courses.id))
      .groupBy(coursePurchases.courseId, courses.title)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        totalPurchases: Number(totalPurchases),
        recentPurchases: Number(recentPurchases),
        timeframe,
        recentNotifications: recentNotifications.map(notification => ({
          ...notification,
          purchaseAmount: Number(notification.purchaseAmount),
        })),
        courseStats: courseStats.map(stat => ({
          ...stat,
          count: Number(stat.count),
          totalRevenue: Number(stat.totalRevenue),
        })),
        lastUpdated: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching purchase statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase statistics' },
      { status: 500 }
    );
  }
}

// Add a new purchase (for testing or real purchases)
export async function POST(request: Request) {
  try {
    // Basic validation - in production you'd want proper authentication
    const { courseId, studentName, studentEmail, location, purchaseAmount, isRealPurchase = true } = await request.json();

    if (!courseId || !studentName || !purchaseAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseExists = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (courseExists.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Insert purchase
    const newPurchase = await db
      .insert(coursePurchases)
      .values({
        courseId,
        studentName,
        studentEmail: studentEmail || undefined,
        location: location || undefined,
        purchaseAmount: purchaseAmount.toString(),
        isRealPurchase,
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        },
      });

    return NextResponse.json({
      success: true,
      message: 'Purchase recorded successfully',
    });
  } catch (error) {
    console.error('Error recording purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record purchase' },
      { status: 500 }
    );
  }
}