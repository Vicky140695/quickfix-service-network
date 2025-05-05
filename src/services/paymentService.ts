
import { toast } from 'sonner';
import { addPaymentReward, useCoinsForPayment } from './walletService';

// We need to include Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // in rupees
  name: string;
  description: string;
  orderId?: string;
  serviceId: string;
  userId: string;
  workerInfo?: {
    id: string;
    name: string;
  };
  useCoins?: number; // Amount of QuickFix coins to use
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      toast.error('Failed to load Razorpay script. Please try again later.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Process payment with Razorpay
export const processPayment = async (options: PaymentOptions): Promise<PaymentResponse> => {
  // In production, order ID should be generated from your server
  const { amount, name, description, serviceId, userId, workerInfo, useCoins = 0 } = options;
  const finalAmount = Math.max(0, amount - useCoins);
  
  // If using coins for full payment
  if (finalAmount === 0) {
    try {
      // Process coin payment
      useCoinsForPayment(userId, serviceId, useCoins);
      
      // Also need to process worker commission in a real app
      if (workerInfo) {
        processWorkerCommission(serviceId, amount, workerInfo.id);
      }
      
      return {
        success: true,
        paymentId: `coins-${Date.now()}`,
        orderId: `order-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment with coins failed'
      };
    }
  }
  
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      return {
        success: false,
        error: 'Failed to load payment gateway'
      };
    }

    // If using partial coins
    if (useCoins > 0) {
      try {
        useCoinsForPayment(userId, serviceId, useCoins);
      } catch (error) {
        return {
          success: false,
          error: 'Failed to process coins payment'
        };
      }
    }

    // Generate a test order ID (in production, this should come from your backend)
    const orderId = `order_${Date.now()}`;

    return new Promise((resolve) => {
      const razorpayOptions = {
        key: "rzp_test_YourTestKey", // Replace with your actual Razorpay test key
        amount: finalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "QuickFix",
        description: description,
        order_id: orderId,
        handler: function (response: any) {
          // Add payment reward (1% of total bill amount)
          if (response.razorpay_payment_id) {
            addPaymentReward(userId, serviceId, amount);
            
            // Process worker commission
            if (workerInfo) {
              processWorkerCommission(serviceId, amount, workerInfo.id);
            }
          }

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: name,
        },
        notes: {
          serviceId: serviceId
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            resolve({
              success: false,
              error: "Payment cancelled by user"
            });
          }
        }
      };

      try {
        const paymentObject = new window.Razorpay(razorpayOptions);
        paymentObject.open();
      } catch (error) {
        resolve({
          success: false,
          error: error instanceof Error ? error.message : "Payment initialization failed"
        });
      }
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment processing failed"
    };
  }
};

// Process worker commission (10% of order value)
export const processWorkerCommission = (serviceId: string, amount: number, workerId: string): void => {
  try {
    const commission = amount * 0.1; // 10% commission
    
    // In a real app, this would update the worker's balance in the database
    // For now, we'll store it in localStorage
    const commissionKey = `worker-commission-${workerId}`;
    let workerCommissions = JSON.parse(localStorage.getItem(commissionKey) || "{}");
    
    workerCommissions[serviceId] = {
      amount: amount,
      commission: commission,
      timestamp: Date.now()
    };
    
    localStorage.setItem(commissionKey, JSON.stringify(workerCommissions));
    
    console.log(`Worker ${workerId} commission of ₹${commission} processed for service ${serviceId}`);
  } catch (error) {
    console.error("Error processing worker commission:", error);
  }
};

// Get worker commissions
export const getWorkerCommissions = (workerId: string): Record<string, { amount: number, commission: number, timestamp: number }> => {
  try {
    const commissionKey = `worker-commission-${workerId}`;
    return JSON.parse(localStorage.getItem(commissionKey) || "{}");
  } catch (error) {
    console.error("Error getting worker commissions:", error);
    return {};
  }
};

// Calculate worker earnings after commission
export const calculateWorkerEarnings = (workerId: string): { total: number, commission: number, earnings: number } => {
  try {
    const commissions = getWorkerCommissions(workerId);
    
    let total = 0;
    let totalCommission = 0;
    
    Object.values(commissions).forEach(item => {
      total += item.amount;
      totalCommission += item.commission;
    });
    
    return {
      total,
      commission: totalCommission,
      earnings: total - totalCommission
    };
  } catch (error) {
    console.error("Error calculating worker earnings:", error);
    return { total: 0, commission: 0, earnings: 0 };
  }
};
