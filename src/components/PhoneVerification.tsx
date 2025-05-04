
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PhoneIcon, Check, X, RefreshCw, Loader } from 'lucide-react';

interface PhoneVerificationProps {
  workerRoute?: string;
  customerRoute?: string;
  skipRoute?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  workerRoute = '/worker/registration',
  customerRoute = '/customer/dashboard',
  skipRoute
}) => {
  const { t } = useLanguage();
  const { role, phoneNumber, setPhoneNumber, setIsVerified, userProfile } = useUser();
  const navigate = useNavigate();
  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Format phone number to ensure it has the +91 prefix
  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters except the + sign
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure the number starts with +91
    if (!cleaned.startsWith('+91')) {
      if (cleaned.startsWith('+')) {
        setPhoneNumber('+91' + cleaned.substring(1));
      } else if (cleaned.startsWith('91')) {
        setPhoneNumber('+' + cleaned);
      } else {
        setPhoneNumber('+91' + cleaned);
      }
    } else {
      setPhoneNumber(cleaned);
    }
  };

  // Handle resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30); // 30 seconds cooldown
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 13) { // +91 + 10 digits
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Supabase function to send OTP (this will be implemented after Supabase integration)
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        toast.success("OTP sent successfully!");
        setShowOtpInput(true);
        setIsLoading(false);
        startResendTimer();
      }, 1500);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Supabase function to verify OTP (this will be implemented after Supabase integration)
      // For now, we'll just simulate it
      setTimeout(() => {
        setIsVerified(true);
        toast.success("Phone number verified successfully!");
        setIsLoading(false);
        
        // Navigate based on role
        if (role === 'worker') {
          navigate(workerRoute);
        } else {
          navigate(customerRoute);
        }
      }, 1500);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendDisabled) return;
    handleSendOtp();
  };

  const handleSkip = () => {
    if (skipRoute) {
      navigate(skipRoute);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-center mb-8">{t('phone_verification')}</h1>
            
            {!showOtpInput ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    {t('enter_phone')}
                  </label>
                  <div className="flex items-center">
                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-l px-3 py-2">
                      <PhoneIcon className="h-5 w-5 text-gray-500 mr-1" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber || '+91'}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+91 9876543210"
                      className="rounded-l-none flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10 digits</p>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {t('send_otp')}
                    </div>
                  ) : (
                    t('send_otp')
                  )}
                </Button>
                
                {skipRoute && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleSkip}
                  >
                    {t('do_it_later')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    {t('enter_otp')}
                  </label>
                  <div className="flex justify-center mb-2">
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          className="w-10 h-10 text-center text-lg"
                          value={otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = otp.split('');
                            newOtp[index] = e.target.value.slice(-1);
                            setOtp(newOtp.join(''));
                            
                            // Auto-focus next input
                            if (e.target.value && index < 5) {
                              const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace to go to previous input
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
                              if (prevInput) prevInput.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500">A 6-digit code has been sent to your phone</p>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {t('verify_otp')}
                    </div>
                  ) : (
                    t('verify_otp')
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setShowOtpInput(false)}
                  disabled={isLoading}
                >
                  {t('back')}
                </Button>
                
                <div className="text-center text-sm">
                  Didn't receive the code?{" "}
                  <button 
                    className={`text-primary hover:underline ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    type="button"
                  >
                    {resendDisabled 
                      ? `Resend OTP in ${resendTimer}s` 
                      : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneVerification;
