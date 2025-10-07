import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { courses } from '@/lib/db/schema';

// GET /api/courses - Public endpoint to fetch active courses for frontend display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    // Build the query conditions
    let whereConditions = eq(courses.isActive, true);
    
    if (level) {
      whereConditions = and(
        eq(courses.isActive, true),
        eq(courses.level, level)
      )!; // Add non-null assertion since we know this will be defined
    }

    // Fetch active courses from database
    const activeCourses = await db
      .select()
      .from(courses)
      .where(whereConditions)
      .orderBy(courses.createdAt);

    // Define features for each course based on course type and level
    const getCourseFeatures = (title: string, level: string) => {
      const commonFeatures = [
        'DVSA certified instructor',
        'Theory test support included',
        'Flexible scheduling available',
        'Progress tracking system'
      ];

      const levelSpecificFeatures = {
        'beginner': [
          'Basic vehicle controls',
          'Road safety fundamentals',
          'Traffic rules and signs',
          'Parking techniques'
        ],
        'intermediate': [
          'Advanced maneuvering',
          'Complex junction navigation',
          'Dual carriageway driving',
          'Night driving skills'
        ],
        'advanced': [
          'Test preparation focus',
          'Mock driving tests',
          'Advanced hazard perception',
          'Independent driving practice'
        ]
      };

      const titleSpecificFeatures: { [key: string]: string[] } = {
        'Absolute Beginner': [
          'Complete beginner-friendly approach',
          'Step-by-step learning progression',
          'Patient and encouraging instruction',
          'Vehicle familiarization'
        ],
        'Basic': [
          'Build on existing skills',
          'Road confidence building',
          'Essential driving techniques',
          'Safety-first approach'
        ],
        'Intensive Crash Course': [
          'Fast-track learning program',
          'Daily intensive lessons',
          'Quick test preparation',
          'Accelerated skill development'
        ],
        'Pass Plus Course': [
          'Post-test skill enhancement',
          'Insurance discount eligibility',
          'Advanced driving techniques',
          'Confidence in challenging conditions'
        ],
        'Refresher Course': [
          'Skill refreshment program',
          'Confidence restoration',
          'Updated road rules',
          'Personalized assessment'
        ],
        'Mock Test Preparation': [
          'Real test conditions practice',
          'Test route familiarization',
          'Examiner-style assessment',
          'Final preparation focus'
        ]
      };

      return titleSpecificFeatures[title] || levelSpecificFeatures[level as keyof typeof levelSpecificFeatures] || commonFeatures;
    };

    // Transform the data to match the frontend Course interface
    const transformedCourses = activeCourses.map(course => ({
      id: course.id.toString(), // Convert to string as expected by frontend
      title: course.title,
      description: course.description || '',
      level: course.level as 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced',
      totalHours: Math.round(course.duration / 60), // Convert minutes to hours
      price: parseFloat(course.price.toString()),
      features: getCourseFeatures(course.title, course.level),
      icon: undefined, // Will be handled by frontend
      color: course.level === 'beginner' ? 'blue' : 
             course.level === 'intermediate' ? 'orange' : 
             course.level === 'advanced' ? 'red' : 'green',
      recommended: course.isRecommended || false,
      studentCount: 200 // Set 200 students for all courses as requested
    }));

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      count: transformedCourses.length
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch courses',
      courses: [],
      count: 0
    }, { status: 500 });
  }
}