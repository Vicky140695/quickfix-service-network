
import React, { createContext, useState, useContext, ReactNode } from 'react';

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
}

export interface UserProfile {
  name?: string;
  age?: number;
  address?: string;
  skills?: string[];
  otherSkill?: string;
  agreedToTerms?: boolean;
  paymentCompleted?: boolean;
  available?: boolean;
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

  const resetUser = () => {
    setRole(null);
    setPhoneNumber('');
    setIsVerified(false);
    setUserProfile(null);
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
