
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const WorkerPayment: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  const navigate = useNavigate();
  
  const handlePayment = () => {
    // In a real app, we would integrate with a payment gateway
    toast.success("Payment processed successfully!");
    
    setUserProfile({
      ...userProfile,
      paymentCompleted: true
    });
    
    navigate('/worker/dashboard');
  };
  
  const handleSkip = () => {
    toast.info("You can complete the payment later");
    navigate('/worker/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-4">{t('registration_fee')}</h1>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-2">{t('payment_info')}</p>
              <p className="text-3xl font-bold text-primary">₹99</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Benefits:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access to job notifications within 10 km radius</li>
                <li>Visibility to potential customers</li>
                <li>In-app payment processing</li>
                <li>Build your profile and reputation with reviews</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
            
            <Button className="w-full" onClick={handlePayment}>
              {t('pay_now')}
            </Button>
            
            <Button variant="outline" className="w-full" onClick={handleSkip}>
              {t('skip_for_now')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerPayment;
