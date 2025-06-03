
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Role = 'customer' | 'worker' | 'admin' | null;

interface UserContextType {
  role: Role;
  setRole: (role: Role) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  resetUser: () => void;
  isLoading: boolean;
  signOut: () => Promise<void>;
  userId: string | null;
}

export interface UserProfile {
  name?: string;
  age?: number;
  address?: string;
  skills?: string[];
  otherSkill?: string;
  workersCount?: number;
  agreedToTerms?: boolean;
  paymentCompleted?: boolean;
  available?: boolean;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  kycSubmittedAt?: string;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Simple initialization - check for existing session without interference
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('UserContext: Initializing auth state');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log('UserContext: Found existing session');
          setIsVerified(true);
          setUserId(session.user.id);
          
          // Get user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userError) {
            console.error('Error fetching user data:', userError);
            setIsLoading(false);
            return;
          }
          
          if (userData) {
            console.log('UserContext: Setting user data', userData);
            setRole(userData.role);
            setPhoneNumber(userData.phone_number);
            
            // Map database fields to userProfile format
            const mappedProfile: UserProfile = {};
            if (userData.name) mappedProfile.name = userData.name;
            if (userData.address) mappedProfile.address = userData.address;
            
            if (userData.role === 'worker') {
              // Fetch worker specific profile
              const { data: workerData, error: workerError } = await supabase
                .from('worker_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
                
              if (!workerError && workerData) {
                mappedProfile.skills = workerData.skills;
                mappedProfile.otherSkill = workerData.other_skill;
                mappedProfile.workersCount = workerData.workers_count;
                mappedProfile.agreedToTerms = workerData.agreed_to_terms;
                mappedProfile.paymentCompleted = workerData.payment_completed;
                mappedProfile.available = workerData.available;
                mappedProfile.aadhaarNumber = workerData.aadhaar_number;
                mappedProfile.aadhaarVerified = workerData.aadhaar_verified;
                mappedProfile.kycStatus = workerData.kyc_status;
                mappedProfile.kycSubmittedAt = workerData.kyc_submitted_at;
              }
            }
            
            setUserProfile(mappedProfile);
          }
        } else {
          console.log('UserContext: No existing session found');
        }
      } catch (error) {
        console.error('UserContext: Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state listener for sign in/out events only
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('UserContext: Auth state changed', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('UserContext: User signed out');
        resetUser();
      } else if (event === 'SIGNED_IN' && session) {
        console.log('UserContext: User signed in');
        setIsVerified(true);
        setUserId(session.user.id);
        // Note: Full user data fetching will happen on next page load/refresh
      }
    });
    
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const resetUser = () => {
    console.log('UserContext: Resetting user state');
    setRole(null);
    setPhoneNumber('');
    setIsVerified(false);
    setUserProfile(null);
    setUserId(null);
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(`Sign out failed: ${error.message}`);
        return;
      }
      
      toast.success('Signed out successfully');
      resetUser();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        phoneNumber,
        setPhoneNumber,
        isVerified,
        setIsVerified,
        userProfile,
        setUserProfile,
        resetUser,
        isLoading,
        signOut,
        userId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
