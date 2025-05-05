
import { toast } from 'sonner';

// Types
export interface Booking {
  id: string;
  service: string | undefined;
  address: string;
  description: string;
  bookingType: 'self' | 'other';
  timePreference: 'now' | 'later';
  scheduledDateTime: string;
  contactName?: string;
  contactPhone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
  workerId?: string;
  workerName?: string;
}

// Local storage key
const BOOKINGS_KEY = 'quickfix-bookings';

// Get all bookings
export const getBookings = (): Booking[] => {
  try {
    const storedBookings = localStorage.getItem(BOOKINGS_KEY);
    return storedBookings ? JSON.parse(storedBookings) : [];
  } catch (error) {
    console.error("Error getting bookings:", error);
    toast.error("Failed to load bookings");
    return [];
  }
};

// Get a single booking by ID
export const getBookingById = (id: string): Booking | null => {
  try {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    return booking || null;
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    toast.error("Failed to load booking details");
    return null;
  }
};

// Save a new booking
export const saveBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking => {
  try {
    const bookings = getBookings();
    
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: Date.now()
    };
    
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    
    return newBooking;
  } catch (error) {
    console.error("Error saving booking:", error);
    toast.error("Failed to save booking");
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = (id: string, status: Booking['status']): boolean => {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
      return false;
    }
    
    bookings[index].status = status;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    toast.error("Failed to update booking status");
    return false;
  }
};

// Assign worker to booking
export const assignWorkerToBooking = (
  bookingId: string, 
  workerId: string, 
  workerName: string
): boolean => {
  try {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
      return false;
    }
    
    bookings[index].workerId = workerId;
    bookings[index].workerName = workerName;
    bookings[index].status = 'confirmed';
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    
    return true;
  } catch (error) {
    console.error("Error assigning worker:", error);
    toast.error("Failed to assign worker");
    return false;
  }
};

// Get user's bookings
export const getUserBookings = (userId: string): Booking[] => {
  // This is a placeholder - in a real app, you'd filter by userId
  // Since we're simulating a backend, we'll just return all bookings
  return getBookings();
};

// Admin functions

// Get bookings by status
export const getBookingsByStatus = (status: Booking['status']): Booking[] => {
  try {
    const bookings = getBookings();
    return bookings.filter(b => b.status === status);
  } catch (error) {
    console.error("Error filtering bookings by status:", error);
    toast.error("Failed to filter bookings");
    return [];
  }
};

// Get recent bookings (last 7 days)
export const getRecentBookings = (): Booking[] => {
  try {
    const bookings = getBookings();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return bookings.filter(b => b.createdAt >= sevenDaysAgo)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    toast.error("Failed to load recent bookings");
    return [];
  }
};

// Get booking statistics
export const getBookingStatistics = () => {
  try {
    const bookings = getBookings();
    
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    // Calculate percentage changes (demo data)
    const pendingChange = 5;
    const confirmedChange = 12;
    const completedChange = 18;
    const cancelledChange = -3;
    
    return {
      total,
      pending: { count: pending, change: pendingChange },
      confirmed: { count: confirmed, change: confirmedChange },
      completed: { count: completed, change: completedChange },
      cancelled: { count: cancelled, change: cancelledChange },
    };
  } catch (error) {
    console.error("Error calculating booking statistics:", error);
    toast.error("Failed to calculate booking statistics");
    return {
      total: 0,
      pending: { count: 0, change: 0 },
      confirmed: { count: 0, change: 0 },
      completed: { count: 0, change: 0 },
      cancelled: { count: 0, change: 0 },
    };
  }
};

// Delete a booking
export const deleteBooking = (id: string): boolean => {
  try {
    const bookings = getBookings();
    const filteredBookings = bookings.filter(b => b.id !== id);
    
    if (filteredBookings.length === bookings.length) {
      // No booking was removed
      return false;
    }
    
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filteredBookings));
    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    toast.error("Failed to delete booking");
    return false;
  }
};
