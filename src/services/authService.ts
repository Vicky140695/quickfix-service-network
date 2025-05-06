
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simulated OTP for testing purposes (in production this would come from SMS provider)
const TEST_OTP = '123456';

// Handle Supabase errors in a consistent way
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  const errorMessage = error?.message || 'An unexpected error occurred';
  return errorMessage;
};

// Phone authentication with Supabase using phone_confirm strategy
export const sendOTP = async (phoneNumber: string) => {
  try {
    console.log('Attempting to send OTP to:', phoneNumber);
    
    // For demo purposes, we're using a test OTP
    // In a real app, this would use Supabase auth.signInWithOtp()
    console.log(`🔒 Test OTP for ${phoneNumber}: ${TEST_OTP}`);
    
    return {
      success: true,
      verificationId: 'DEMO-' + Math.random().toString(36).substring(2, 10)
    };
    
    // In real implementation:
    // const { error } = await supabase.auth.signInWithOtp({
    //   phone: phoneNumber,
    // });
    //
    // if (error) {
    //   return { 
    //     success: false, 
    //     error: error.message 
    //   };
    // }
    //
    // return { success: true };
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      error: 'Failed to send OTP. Service currently unavailable.' 
    };
  }
};

export const verifyOTP = async (
  phoneNumber: string, 
  otp: string, 
  role: 'customer' | 'worker' | 'admin' | null
) => {
  try {
    // For demo purposes, check against the test OTP
    if (otp !== TEST_OTP) {
      return {
        success: false,
        error: 'Invalid OTP. Please check and try again.'
      };
    }
    
    console.log(`OTP verification successful for ${phoneNumber}`);
    
    // In a real app, we would verify with Supabase using the token
    // For demo, we'll sign in with email+password using a derived email
    
    // Create a pseudo-email from the phone number for Supabase auth
    // This is a workaround as Supabase doesn't natively support phone auth without SMS provider
    const pseudoEmail = `${phoneNumber.replace(/[^0-9]/g, '')}@quickfix.example.com`;
    const password = `${phoneNumber.replace(/[^0-9]/g, '')}_secure_pwd`;
    
    try {
      // Check if user exists
      console.log('Checking if user exists with phone:', phoneNumber);
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id, role')
        .eq('phone_number', phoneNumber)
        .maybeSingle();
      
      if (userCheckError) {
        console.error('Error checking existing user:', userCheckError);
        return {
          success: false,
          error: 'Failed to verify user. Please try again.'
        };
      }
      
      if (existingUser) {
        console.log('User exists, signing in:', existingUser);
        // User exists, sign them in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: pseudoEmail,
          password: password
        });
        
        if (error) {
          console.error('Sign in error:', error);
          return {
            success: false,
            error: 'Authentication failed. Please try again.'
          };
        }
        
        return {
          success: true,
          user: data.user,
          role: existingUser.role
        };
      } else {
        console.log('User does not exist, creating new user with role:', role);
        // Create new user
        if (!role) {
          return {
            success: false,
            error: 'User role is required for registration.'
          };
        }
        
        // Register with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: pseudoEmail,
          password: password,
          options: {
            data: {
              phone_number: phoneNumber
            }
          }
        });
        
        if (error) {
          console.error('Sign up error:', error);
          return {
            success: false,
            error: 'Registration failed. Please try again.'
          };
        }
        
        // Create user record in our users table
        if (data.user) {
          console.log('Creating user record in users table:', data.user.id);
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              phone_number: phoneNumber,
              role: role,
              is_verified: true
            });
          
          if (insertError) {
            console.error('User insert error:', insertError);
            // If we can't create a user record, delete the auth user
            const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
            if (deleteError) console.error('Error deleting auth user:', deleteError);
            
            return {
              success: false,
              error: 'User registration failed. Please try again.'
            };
          }
          
          // If the user is a worker, create an initial worker profile
          if (role === 'worker') {
            console.log('Creating worker profile for:', data.user.id);
            const { error: workerProfileError } = await supabase
              .from('worker_profiles')
              .insert({
                user_id: data.user.id,
                skills: [],
                aadhaar_verified: false,
                kyc_status: 'pending',
                available: true,
                payment_completed: false,
                agreed_to_terms: false
              });
            
            if (workerProfileError) {
              console.error('Worker profile creation error:', workerProfileError);
            }
          }
          
          // Initialize wallet for the user
          const referralCode = generateReferralCode();
          console.log('Creating wallet with referral code:', referralCode);
          const { error: walletError } = await supabase
            .from('wallet')
            .insert({
              user_id: data.user.id,
              balance: 0,
              referral_code: referralCode
            });
            
          if (walletError) {
            console.error('Wallet creation error:', walletError);
          }
        }
        
        return {
          success: true,
          user: data.user,
          role: role,
          isNewUser: true
        };
      }
    } catch (dbError) {
      console.error('Database interaction error:', dbError);
      return {
        success: false,
        error: 'Database error. Please try again.'
      };
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: 'Failed to verify OTP. Please try again.' 
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
