
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  const { role, phoneNumber, setPhoneNumber, setIsVerified, setUserProfile, userProfile } = useUser();
  const navigate = useNavigate();
  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      toast.success("OTP sent successfully!");
      setShowOtpInput(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification
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
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full"
                  />
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">
                    {t('enter_otp')}
                  </label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full"
                  />
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      {t('verify_otp')}
                    </div>
                  ) : (
                    t('verify_otp')
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowOtpInput(false)}
                  disabled={isLoading}
                >
                  {t('back')}
                </Button>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneVerification;
