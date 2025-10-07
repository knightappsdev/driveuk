import { AdminStats, RevenueData, CoursePopularity, InstructorPerformance } from './types';

export const fetchAnalyticsStats = async (): Promise<AdminStats | null> => {
  try {
    const response = await fetch('/api/admin/analytics');
    if (response.ok) {
      const data = await response.json();
      console.log('Analytics Stats API Response:', data);
      
      // Ensure all required properties exist
      if (data && typeof data.totalUsers === 'number') {
        return data;
      } else {
        console.error('Invalid analytics API response format:', data);
        return null;
      }
    } else {
      console.error('Stats API request failed:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return null;
  }
};

export const generateMockRevenueData = (): RevenueData[] => {
  return [
    { month: 'Jan', revenue: 12500, bookings: 45 },
    { month: 'Feb', revenue: 15200, bookings: 52 },
    { month: 'Mar', revenue: 18300, bookings: 61 },
    { month: 'Apr', revenue: 16800, bookings: 58 },
    { month: 'May', revenue: 21400, bookings: 67 },
    { month: 'Jun', revenue: 19600, bookings: 63 },
  ];
};

export const generateCoursePopularityData = async (): Promise<CoursePopularity[]> => {
  try {
    const response = await fetch('/api/admin/courses');
    if (response.ok) {
      const coursesData = await response.json();
      const courses = Array.isArray(coursesData) ? coursesData : coursesData.data || [];
      
      return courses.slice(0, 5).map((course: any) => ({
        courseTitle: course.title,
        bookings: Math.floor(Math.random() * 50) + 10,
        revenue: parseFloat(course.price) * (Math.floor(Math.random() * 50) + 10),
      }));
    } else {
      console.error('Courses API request failed');
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch course popularity data:', error);
    return [];
  }
};

export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}%`;
};