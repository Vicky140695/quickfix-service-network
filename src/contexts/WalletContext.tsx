
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { Wallet, getWallet, generateReferralCode } from '../services/walletService';

interface WalletContextType {
  wallet: Wallet | null;
  refreshWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userId, phoneNumber, role } = useUser();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWallet = async () => {
    if (!userId) {
      setWallet(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const walletData = await getWallet(userId);
      setWallet(walletData);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchWallet = async () => {
      await refreshWallet();
    };
    
    fetchWallet();
  }, [userId]);

  return (
    <WalletContext.Provider value={{ wallet, refreshWallet, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
