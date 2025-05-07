import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
// Firebase imports will go here in the actual implementation
// We'll use a placeholder for now

// Handle Supabase errors in a consistent way
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  const errorMessage = error?.message || 'An unexpected error occurred';
  return errorMessage;
};

// Phone authentication using Firebase and our Supabase Edge Functions
export const sendOTP = async (phoneNumber: string) => {
  try {
    console.log('Preparing to send OTP to:', phoneNumber);
    
    // With Firebase, we don't actually send the OTP from the backend
    // The frontend will handle the OTP sending using Firebase recaptcha
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { phoneNumber }
    });
    
    if (error) {
      console.error('Error invoking send-otp function:', error);
      return {
        success: false,
        error: error.message || 'Failed to prepare OTP. Service currently unavailable.'
      };
    }
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Failed to prepare for OTP. Please check your phone number and try again.'
      };
    }
    
    return {
      success: true,
      phoneNumber: data.phoneNumber
    };
  } catch (error) {
    console.error('Error initiating OTP:', error);
    return { 
      success: false, 
      error: 'Failed to initiate OTP. Service currently unavailable.' 
    };
  }
};

export const verifyOTP = async (
  phoneNumber: string, 
  firebaseToken: string, // Changed from OTP to Firebase token
  role: 'customer' | 'worker' | 'admin' | null
) => {
  try {
    console.log(`Firebase token verification attempt for ${phoneNumber}`);
    
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: { phoneNumber, firebaseToken, role } // Changed parameter name
    });
    
    if (error) {
      console.error('Error invoking verify-otp function:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify phone. Service currently unavailable.'
      };
    }
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Invalid verification. Please check and try again.'
      };
    }

    // If we have an auth link, use it for passwordless sign-in
    if (data.authLink) {
      // In a real app, you'd use this link for sign-in via an invisible iframe
      // For now, we'll use signInWithPassword as we already have the credentials
      const pseudoEmail = `${phoneNumber.replace(/[^0-9]/g, '')}@quickfix.example.com`;
      const password = `${phoneNumber.replace(/[^0-9]/g, '')}_secure_pwd`;
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: pseudoEmail,
        password: password
      });
      
      if (signInError) {
        console.error('Sign in error:', signInError);
        return {
          success: false,
          error: 'Authentication failed. Please try again.'
        };
      }
    }
    
    return {
      success: true,
      user: data.user,
      role: data.role,
      isNewUser: data.isNewUser
    };
  } catch (error) {
    console.error('Error verifying phone:', error);
    return { 
      success: false, 
      error: 'Failed to verify phone. Please try again.' 
    };
  }
};

// Generate a unique referral code
export const generateReferralCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Update user profile information
export const updateUserProfile = async (
  userId: string,
  profileData: { [key: string]: any }
) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId);
      
    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: 'Failed to update user profile. Please try again.'
    };
  }
};

// Update worker profile information
export const updateWorkerProfile = async (
  userId: string,
  profileData: { [key: string]: any }
) => {
  try {
    const { error } = await supabase
      .from('worker_profiles')
      .update(profileData)
      .eq('user_id', userId);
      
    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error)
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating worker profile:', error);
    return {
      success: false,
      error: 'Failed to update worker profile. Please try again.'
    };
  }
};
