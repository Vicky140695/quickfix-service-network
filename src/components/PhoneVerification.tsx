
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PhoneIcon, Check, X, RefreshCw, Loader } from 'lucide-react';
import { sendOTP, verifyOTP } from '@/services/authService';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/integrations/firebase/client';

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
  const { role, phoneNumber, setPhoneNumber, setIsVerified } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  // Initialize Firebase recaptcha when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            console.log('reCAPTCHA solved');
          }
        });
        setRecaptchaVerifier(verifier);
        console.log("Firebase RecaptchaVerifier initialized");
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
      }
    }
  }, []);
  
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

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 13) { // +91 + 10 digits
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!recaptchaVerifier) {
      toast.error("reCAPTCHA not initialized. Please refresh and try again.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("PhoneVerification: Initiating Firebase phone auth for:", phoneNumber);
      
      // Step 1: Call our backend to prepare for OTP
      const result = await sendOTP(phoneNumber);
      
      if (!result.success) {
        toast.error(result.error || "Failed to initiate verification. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: Use Firebase to send the OTP
      const confirmation = await signInWithPhoneNumber(
        firebaseAuth,
        phoneNumber,
        recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      toast.success("Verification code sent to your phone.");
      setShowOtpInput(true);
      
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      if (error.code === 'auth/too-many-requests') {
        toast.error("Too many requests. Please try again later.");
      } else if (error.code === 'auth/invalid-phone-number') {
        toast.error("Invalid phone number format.");
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    if (!confirmationResult) {
      toast.error("No verification session found. Please resend OTP.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("PhoneVerification: Verifying OTP");
      
      // Verify the OTP with Firebase
      const credential = await confirmationResult.confirm(otp);
      const firebaseToken = await credential.user.getIdToken();
      
      console.log("PhoneVerification: Verifying with backend for phone:", phoneNumber);
      const result = await verifyOTP(phoneNumber, firebaseToken, role);
      
      if (result.success) {
        console.log("PhoneVerification: Verification successful, updating state");
        setIsVerified(true);
        toast.success("Phone number verified successfully!");
        
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          // Navigate based on role
          if (role === 'worker') {
            console.log("PhoneVerification: Navigating to worker route");
            navigate(workerRoute, { replace: true });
          } else {
            console.log("PhoneVerification: Navigating to customer route");
            navigate(customerRoute, { replace: true });
          }
        }, 100);
      } else {
        toast.error(result.error || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      if (error.code === 'auth/invalid-verification-code') {
        toast.error("Invalid verification code. Please check and try again.");
      } else if (error.code === 'auth/code-expired') {
        toast.error("Verification code has expired. Please resend OTP.");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(''); // Clear previous OTP
    setShowOtpInput(false);
    setConfirmationResult(null);
    handleSendOtp();
  };

  const handleSkip = () => {
    if (skipRoute) {
      navigate(skipRoute, { replace: true });
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
                
                {/* Firebase reCAPTCHA container */}
                <div id="recaptcha-container"></div>
                
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
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
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
                    className="text-primary hover:underline"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    type="button"
                  >
                    Resend OTP
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
