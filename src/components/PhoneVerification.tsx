
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
import { sendOTP, verifyOTP } from '@/services/authService';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// !! Note: In a real application, you would add the Firebase SDK here !!
// firebase/app, firebase/auth
// For this demo, we'll use a placeholder to show the implementation structure

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
  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
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

  // Initialize Firebase recaptcha when component mounts
  useEffect(() => {
    // In a real app, you would initialize Firebase here
    // For example:
    // if (typeof window !== 'undefined' && !recaptchaVerifier) {
    //   const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    //     'size': 'invisible',
    //   });
    //   setRecaptchaVerifier(verifier);
    // }
    
    // For this demo, we'll just create a placeholder
    if (!recaptchaVerifier) {
      setRecaptchaVerifier({});
      console.log("Firebase RecaptchaVerifier would be initialized here");
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 13) { // +91 + 10 digits
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Initiating Firebase phone auth for:", phoneNumber);
      
      // Step 1: Call our backend to prepare for OTP
      const result = await sendOTP(phoneNumber);
      
      if (!result.success) {
        toast.error(result.error || "Failed to initiate verification. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: In a real app, you would use Firebase to send the OTP
      // For example:
      // const confirmation = await firebase.auth().signInWithPhoneNumber(
      //   phoneNumber,
      //   recaptchaVerifier
      // );
      // setConfirmationResult(confirmation);
      
      // For this demo, we'll simulate Firebase behavior
      setConfirmationResult({});
      toast.success("Verification code sent to your phone.");
      setShowOtpInput(true);
      
      // In development mode, simulate an OTP for testing
      const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Development mode: Simulated OTP:", simulatedOtp);
      toast.info(`Development mode: OTP code is ${simulatedOtp}`);
      
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("Service unavailable. Please try again later.");
    } finally {
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
      // In a real app, you would verify the OTP with Firebase
      // For example:
      // const credential = await confirmationResult.confirm(otp);
      // const firebaseToken = await credential.user.getIdToken();
      
      // For this demo, we'll simulate a Firebase token
      const simulatedToken = "firebase-auth-token-" + Date.now();
      setFirebaseToken(simulatedToken);
      
      console.log("Verifying with token for phone:", phoneNumber);
      const result = await verifyOTP(phoneNumber, simulatedToken, role);
      
      if (result.success) {
        setIsVerified(true);
        toast.success("Phone number verified successfully!");
        
        // Navigate based on role
        if (role === 'worker') {
          navigate(workerRoute);
        } else {
          navigate(customerRoute);
        }
      } else {
        toast.error(result.error || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(''); // Clear previous OTP
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
                
                {/* This div is where Firebase will render the invisible reCAPTCHA */}
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
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2">
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
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
