
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from 'sonner';

// Types
export interface Booking {
  id: string;
  service: string | undefined;
  address: string;
  description: string;
  booking_type: 'self' | 'other';
  time_preference: 'now' | 'later';
  scheduled_date_time: string;
  contact_name?: string;
  contact_phone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  customer_id: string;
  worker_id?: string;
  worker_name?: string;
}

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error getting bookings:", error);
      toast.error("Failed to load bookings");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error getting bookings:", error);
    toast.error("Failed to load bookings");
    return [];
  }
};

// Get a single booking by ID
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error getting booking by ID:", error);
      toast.error("Failed to load booking details");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    toast.error("Failed to load booking details");
    return null;
  }
};

// Save a new booking
export const saveBooking = async (
  bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'customer_id'>, 
  customerId: string
): Promise<Booking | null> => {
  try {
    const newBooking = {
      ...bookingData,
      customer_id: customerId,
      status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(newBooking)
      .select()
      .single();
      
    if (error) {
      console.error("Error saving booking:", error);
      toast.error("Failed to save booking");
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error saving booking:", error);
    toast.error("Failed to save booking");
    return null;
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    toast.error("Failed to update booking status");
    return false;
  }
};

// Assign worker to booking
export const assignWorkerToBooking = async (
  bookingId: string, 
  workerId: string, 
  workerName: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        worker_id: workerId,
        worker_name: workerName,
        status: 'confirmed'
      })
      .eq('id', bookingId);
      
    if (error) {
      console.error("Error assigning worker:", error);
      toast.error("Failed to assign worker");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error assigning worker:", error);
    toast.error("Failed to assign worker");
    return false;
  }
};

// Get user's bookings
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`customer_id.eq.${userId},worker_id.eq.${userId}`)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error getting user bookings:", error);
      toast.error("Failed to load your bookings");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error getting user bookings:", error);
    toast.error("Failed to load your bookings");
    return [];
  }
};

// Admin functions

// Get bookings by status
export const getBookingsByStatus = async (status: Booking['status']): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error filtering bookings by status:", error);
      toast.error("Failed to filter bookings");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error filtering bookings by status:", error);
    toast.error("Failed to filter bookings");
    return [];
  }
};

// Get recent bookings (last 7 days)
export const getRecentBookings = async (): Promise<Booking[]> => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error getting recent bookings:", error);
      toast.error("Failed to load recent bookings");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    toast.error("Failed to load recent bookings");
    return [];
  }
};

// Get booking statistics
export const getBookingStatistics = async () => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('status');
      
    if (error) {
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
    
    const total = bookings?.length || 0;
    const pending = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmed = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const completed = bookings?.filter(b => b.status === 'completed').length || 0;
    const cancelled = bookings?.filter(b => b.status === 'cancelled').length || 0;
    
    // For demonstration, we'll use fixed percentage changes
    // In a real app, you'd compare with previous period statistics
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
export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    toast.error("Failed to delete booking");
    return false;
  }
};
