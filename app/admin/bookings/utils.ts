import { Booking } from './types';

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch('/api/admin/bookings');
    if (response.ok) {
      const data = await response.json();
      console.log('Bookings API Response:', data);
      
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
    console.error('Failed to fetch bookings:', error);
    return [];
  }
};

export const deleteBooking = async (bookingId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log(`Booking ${bookingId} deleted successfully`);
      return true;
    } else {
      console.error('Failed to delete booking:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
};

export const updateBookingStatus = async (bookingId: number, status: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      console.log(`Booking ${bookingId} status updated to ${status}`);
      return true;
    } else {
      console.error('Failed to update booking status:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

export const filterBookings = (
  bookings: Booking[], 
  searchTerm: string, 
  selectedStatus: string
): Booking[] => {
  return bookings.filter(booking => {
    const matchesSearch = 
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || booking.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
};