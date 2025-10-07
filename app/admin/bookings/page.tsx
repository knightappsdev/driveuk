'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { Booking } from './types';
import { 
  fetchBookings, 
  deleteBooking, 
  updateBookingStatus,
  filterBookings 
} from './utils';
import StatsCards from './StatsCards';
import SearchFilters from './SearchFilters';
import BookingsTable from './BookingsTable';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await fetchBookings();
    setBookings(data);
    setLoading(false);
  };

  const filteredBookings = filterBookings(bookings, searchTerm, selectedStatus);

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    const success = await deleteBooking(bookingId);
    if (success) {
      alert('Booking deleted successfully');
      await loadBookings();
    } else {
      alert('Failed to delete booking');
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    const success = await updateBookingStatus(bookingId, status);
    if (success) {
      await loadBookings();
    }
  };

  const handleViewDetails = (booking: Booking) => {
    // TODO: Implement booking details modal
    console.log('View booking details:', booking);
    alert(`Viewing details for booking #${booking.id}`);
  };

  const handleEditBooking = (booking: Booking) => {
    // TODO: Implement booking edit modal
    console.log('Edit booking:', booking);
    alert(`Editing booking #${booking.id}`);
  };

  const handleCreateBooking = () => {
    // TODO: Implement booking creation modal
    console.log('Create booking');
    alert('Booking creation modal would open here');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage lesson bookings and schedules
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage lesson bookings and schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadBookings}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleCreateBooking}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Booking
          </Button>
        </div>
      </div>

      <StatsCards bookings={bookings} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <BookingsTable
        bookings={filteredBookings}
        onViewDetails={handleViewDetails}
        onEditBooking={handleEditBooking}
        onDeleteBooking={handleDeleteBooking}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
