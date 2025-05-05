
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
