export interface AdminStats {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  totalBookings: number;
  pendingBookings: number;
  completedLessons: number;
  totalRevenue: number;
  avgRating: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface CoursePopularity {
  courseTitle: string;
  bookings: number;
  revenue: number;
}

export interface InstructorPerformance {
  instructorName: string;
  totalLessons: number;
  totalRevenue: number;
  avgRating: number;
  completionRate: number;
}

export const statCategories = {
  users: 'Users & Growth',
  revenue: 'Revenue & Bookings',
  performance: 'Performance Metrics',
  courses: 'Course Analytics'
} as const;