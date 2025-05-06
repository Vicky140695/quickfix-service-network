
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export type Tables = {
  users: {
    id: string;
    role: 'customer' | 'worker' | 'admin';
    phone_number: string;
    created_at: string;
    name?: string;
    address?: string;
    is_verified: boolean;
  };
  worker_profiles: {
    id: string;
    user_id: string;
    skills: string[];
    other_skill?: string;
    workers_count?: number;
    aadhaar_number?: string;
    aadhaar_verified: boolean;
    kyc_status: 'pending' | 'approved' | 'rejected';
    kyc_submitted_at?: string;
    available: boolean;
    payment_completed: boolean;
    agreed_to_terms: boolean;
    created_at: string;
  };
  bookings: {
    id: string;
    service: string;
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
  };
  wallet: {
    id: string;
    user_id: string;
    balance: number;
    referral_code: string;
    created_at: string;
  };
  transactions: {
    id: string;
    user_id: string;
    amount: number;
    type: 'credit' | 'debit';
    source: 'referral' | 'payment' | 'redemption';
    referred_user_id?: string;
    service_id?: string;
    description: string;
    created_at: string;
  };
  services: {
    id: string;
    name: string;
    icon: string;
    is_active: boolean;
  };
  estimation_items: {
    id: number;
    service: string;
    task: string;
    price: number;
  };
  estimation_requests: {
    id: string;
    customer_id: string;
    worker_id?: string;
    subtotal: number;
    tax: number;
    total: number;
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    notes?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    created_at: string;
  };
  estimation_request_items: {
    id: string;
    request_id: string;
    item_id: number;
    quantity: number;
  };
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  const errorMessage = error?.message || 'An unexpected error occurred';
  return errorMessage;
};
