import { Course } from './types';

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch('/api/admin/courses');
    if (response.ok) {
      const data = await response.json();
      console.log('Courses API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.error('Invalid API response format:', data);
        return [];
      }
    } else {
      console.error('API request failed:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
};

export const deleteCourse = async (courseId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log(`Course ${courseId} deleted successfully`);
      return true;
    } else {
      console.error('Failed to delete course:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};

export const toggleRecommended = async (courseId: number, isRecommended: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRecommended: !isRecommended }),
    });

    if (response.ok) {
      console.log(`Course ${courseId} recommended status updated`);
      return true;
    } else {
      console.error('Failed to toggle recommended status:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error toggling recommended status:', error);
    return false;
  }
};

export const toggleActive = async (courseId: number, isActive: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: !isActive }),
    });

    if (response.ok) {
      console.log(`Course ${courseId} active status updated`);
      return true;
    } else {
      console.error('Failed to toggle active status:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error toggling active status:', error);
    return false;
  }
};

export const createCourse = async (courseData: Partial<Course>): Promise<Course | null> => {
  try {
    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Course created successfully:', data);
      return data.success ? data.data : null;
    } else {
      const errorData = await response.json();
      console.error('Failed to create course:', errorData.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating course:', error);
    return null;
  }
};

export const updateCourse = async (courseId: number, courseData: Partial<Course>): Promise<Course | null> => {
  try {
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Course updated successfully:', data);
      return data.success ? data.data : null;
    } else {
      const errorData = await response.json();
      console.error('Failed to update course:', errorData.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating course:', error);
    return null;
  }
};

export const filterCourses = (
  courses: Course[], 
  searchTerm: string, 
  selectedLevel: string,
  selectedStatus: string
): Course[] => {
  return courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && course.isActive) ||
      (selectedStatus === 'inactive' && !course.isActive) ||
      (selectedStatus === 'recommended' && course.isRecommended);
    
    return matchesSearch && matchesLevel && matchesStatus;
  });
};