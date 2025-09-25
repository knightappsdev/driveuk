import { NextResponse } from 'next/server';
import { drivingCourses, getCoursesByLevel } from '@/lib/data/courses';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  try {
    if (level && ['absolute-beginner', 'beginner', 'intermediate', 'advanced'].includes(level)) {
      const courses = getCoursesByLevel(level as 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced');
      return NextResponse.json({ courses });
    }

    return NextResponse.json({ courses: drivingCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}