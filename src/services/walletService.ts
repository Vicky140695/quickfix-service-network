
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from 'sonner';

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  source: 'referral' | 'payment' | 'redemption';
  referred_user_id?: string;
  service_id?: string;
  description: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  referral_code: string;
  created_at: string;
  transactions?: WalletTransaction[];
}

// Generate a unique referral code
export const generateReferralCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Get wallet for a user
export const getWallet = async (userId: string): Promise<Wallet | null> => {
  try {
    // Get wallet data
    const { data: walletData, error: walletError } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (walletError) {
      console.error('Error fetching wallet:', walletError);
      toast.error('Error accessing wallet');
      return null;
    }
    
    // Get transactions
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (txError) {
      console.error('Error fetching transactions:', txError);
    }
    
    return {
      ...walletData,
      transactions: transactions || []
    };
  } catch (error) {
    console.error('Error getting wallet:', error);
    toast.error('Error accessing wallet');
    return null;
  }
};

// Add transaction to wallet
export const addTransaction = async (transaction: Omit<WalletTransaction, 'id' | 'created_at'>): Promise<WalletTransaction | null> => {
  try {
    // Start a transaction
    const { data: walletData, error: walletError } = await supabase
      .from('wallet')
      .select('balance')
      .eq('user_id', transaction.user_id)
      .single();
    
    if (walletError) {
      toast.error('Wallet not found');
      return null;
    }
    
    let newBalance = walletData.balance;
    
    // Update balance
    if (transaction.type === 'credit') {
      newBalance += transaction.amount;
    } else {
      if (walletData.balance < transaction.amount) {
        toast.error('Insufficient balance');
        return null;
      }
      newBalance -= transaction.amount;
    }
    
    // Update wallet balance
    const { error: updateError } = await supabase
      .from('wallet')
      .update({ balance: newBalance })
      .eq('user_id', transaction.user_id);
    
    if (updateError) {
      toast.error('Failed to update wallet balance');
      return null;
    }
    
    // Insert transaction record
    const { data: newTransaction, error: txError } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (txError) {
      // Rollback wallet balance
      await supabase
        .from('wallet')
        .update({ balance: walletData.balance })
        .eq('user_id', transaction.user_id);
        
      toast.error('Transaction failed');
      return null;
    }
    
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
    toast.error(errorMessage);
    return null;
  }
};

// Add coins for referral (50 coins)
export const addReferralReward = async (userId: string, referredUserId: string): Promise<WalletTransaction | null> => {
  try {
    // Check if this referral has been rewarded already
    const { data: existingReferral, error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('source', 'referral')
      .eq('referred_user_id', referredUserId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking referral:', checkError);
      return null;
    }
    
    if (existingReferral) {
      // Referral already rewarded
      return null;
    }
    
    return await addTransaction({
      user_id: userId,
      amount: 50, // 50 QuickFix coins
      type: 'credit',
      source: 'referral',
      referred_user_id: referredUserId,
      description: 'Referral reward - new user registration'
    });
  } catch (error) {
    console.error('Error adding referral reward:', error);
    return null;
  }
};

// Add coins for payment (1% of bill amount)
export const addPaymentReward = async (userId: string, serviceId: string, billAmount: number): Promise<WalletTransaction | null> => {
  const rewardAmount = Math.floor(billAmount * 0.01); // 1% of bill amount
  
  return await addTransaction({
    user_id: userId,
    amount: rewardAmount,
    type: 'credit',
    source: 'payment',
    service_id: serviceId,
    description: `Payment reward - 1% of bill ₹${billAmount}`
  });
};

// Use coins for bill payment
export const useCoinsForPayment = async (userId: string, serviceId: string, amount: number): Promise<WalletTransaction | null> => {
  return await addTransaction({
    user_id: userId,
    amount,
    type: 'debit',
    source: 'redemption',
    service_id: serviceId,
    description: `Used coins for service payment - ₹${amount}`
  });
};

// Validate referral code
export const validateReferralCode = async (referralCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('wallet')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();
      
    if (error) {
      console.error('Error validating referral code:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error validating referral code:', error);
    return false;
  }
};

// Get the user ID from a referral code
export const getUserIdFromReferralCode = async (referralCode: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('wallet')
      .select('user_id')
      .eq('referral_code', referralCode)
      .maybeSingle();
      
    if (error || !data) {
      console.error('Error getting userId from referral code:', error);
      return null;
    }
    
    return data.user_id;
  } catch (error) {
    console.error('Error getting userId from referral code:', error);
    return null;
  }
};
