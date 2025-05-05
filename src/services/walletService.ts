
// Wallet service for managing QuickFix coins
import { toast } from 'sonner';

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number; // Amount in QuickFix coins
  type: 'credit' | 'debit';
  source: 'referral' | 'payment' | 'redemption';
  referredUserId?: string;
  serviceId?: string;
  timestamp: number;
  description: string;
}

export interface Wallet {
  userId: string;
  balance: number; // In QuickFix coins
  transactions: WalletTransaction[];
  referralCode: string;
}

// Generate a unique referral code
export const generateReferralCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters like 0, O, 1, I
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Initialize or get wallet
export const getWallet = (userId: string): Wallet => {
  try {
    const walletString = localStorage.getItem(`wallet-${userId}`);
    if (walletString) {
      return JSON.parse(walletString);
    }
    
    // Create new wallet if it doesn't exist
    const newWallet: Wallet = {
      userId,
      balance: 0,
      transactions: [],
      referralCode: generateReferralCode()
    };
    
    localStorage.setItem(`wallet-${userId}`, JSON.stringify(newWallet));
    return newWallet;
  } catch (error) {
    console.error("Error getting wallet:", error);
    toast.error("Error accessing wallet");
    
    // Return empty wallet on error
    return {
      userId,
      balance: 0,
      transactions: [],
      referralCode: generateReferralCode()
    };
  }
};

// Add transaction to wallet
export const addTransaction = (userId: string, transaction: Omit<WalletTransaction, 'id' | 'timestamp'>): WalletTransaction => {
  try {
    const wallet = getWallet(userId);
    
    const newTransaction: WalletTransaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now()
    };
    
    // Update balance
    if (transaction.type === 'credit') {
      wallet.balance += transaction.amount;
    } else {
      if (wallet.balance < transaction.amount) {
        throw new Error("Insufficient balance");
      }
      wallet.balance -= transaction.amount;
    }
    
    wallet.transactions.push(newTransaction);
    localStorage.setItem(`wallet-${userId}`, JSON.stringify(wallet));
    
    return newTransaction;
  } catch (error) {
    console.error("Error adding transaction:", error);
    toast.error(error instanceof Error ? error.message : "Transaction failed");
    throw error;
  }
};

// Add coins for referral (50 coins)
export const addReferralReward = (userId: string, referredUserId: string): WalletTransaction | null => {
  try {
    // Check if this referral has been rewarded already
    const wallet = getWallet(userId);
    const existingReferral = wallet.transactions.find(
      t => t.source === 'referral' && t.referredUserId === referredUserId
    );
    
    if (existingReferral) {
      // Referral already rewarded
      return null;
    }
    
    return addTransaction(userId, {
      userId,
      amount: 50, // 50 QuickFix coins
      type: 'credit',
      source: 'referral',
      referredUserId,
      description: 'Referral reward - new user registration'
    });
  } catch (error) {
    console.error("Error adding referral reward:", error);
    return null;
  }
};

// Add coins for payment (1% of bill amount)
export const addPaymentReward = (userId: string, serviceId: string, billAmount: number): WalletTransaction => {
  const rewardAmount = Math.floor(billAmount * 0.01); // 1% of bill amount
  
  return addTransaction(userId, {
    userId,
    amount: rewardAmount,
    type: 'credit',
    source: 'payment',
    serviceId,
    description: `Payment reward - 1% of bill ₹${billAmount}`
  });
};

// Use coins for bill payment
export const useCoinsForPayment = (userId: string, serviceId: string, amount: number): WalletTransaction => {
  return addTransaction(userId, {
    userId,
    amount,
    type: 'debit',
    source: 'redemption',
    serviceId,
    description: `Used coins for service payment - ₹${amount}`
  });
};

// Check if a user was referred
export const validateReferralCode = (referralCode: string): boolean => {
  // In a real app, this would check against the database of valid referral codes
  // For now, we'll simulate by checking the localStorage for any wallet with this code
  try {
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wallet-')) {
        const walletData = localStorage.getItem(key);
        if (walletData) {
          const wallet = JSON.parse(walletData);
          if (wallet.referralCode === referralCode) {
            return true;
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error validating referral code:", error);
    return false;
  }
};

// Get the user ID from a referral code
export const getUserIdFromReferralCode = (referralCode: string): string | null => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wallet-')) {
        const walletData = localStorage.getItem(key);
        if (walletData) {
          const wallet = JSON.parse(walletData);
          if (wallet.referralCode === referralCode) {
            return wallet.userId;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting userId from referral code:", error);
    return null;
  }
};
