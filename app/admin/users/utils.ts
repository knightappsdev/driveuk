import { ApiUser } from './types';

export const fetchUsers = async (): Promise<ApiUser[]> => {
  try {
    const response = await fetch('/api/admin/users');
    if (response.ok) {
      const data = await response.json();
      console.log('Users API Response:', data);
      
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
    console.error('Failed to fetch users:', error);
    return [];
  }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log(`User ${userId} deleted successfully`);
      return true;
    } else {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Failed to delete user:', error.message || response.statusText);
      throw new Error(error.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`User ${userId} status toggled successfully`);
      return true;
    } else {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Failed to toggle user status:', error.message || response.statusText);
      throw new Error(error.message || 'Failed to toggle user status');
    }
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const createUser = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  city?: string;
}): Promise<ApiUser | null> => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User created successfully:', result);
      return result.data || result;
    } else {
      const error = await response.json();
      console.error('Failed to create user:', error.message || response.statusText);
      throw new Error(error.message || 'Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, userData: {
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  city?: string;
}): Promise<ApiUser | null> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User updated successfully:', result);
      return result.data || result;
    } else {
      const error = await response.json();
      console.error('Failed to update user:', error.message || response.statusText);
      throw new Error(error.message || 'Failed to update user');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const fetchUserById = async (userId: number): Promise<ApiUser | null> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}`);
    
    if (response.ok) {
      const result = await response.json();
      return result.data || result;
    } else {
      console.error('Failed to fetch user:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const filterUsers = (
  users: ApiUser[], 
  searchTerm: string, 
  selectedRole: string,
  selectedStatus: string
): ApiUser[] => {
  return users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
};