
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const WorkerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  const [available, setAvailable] = useState(userProfile?.available || false);
  
  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked);
    setUserProfile({
      ...userProfile,
      available: checked
    });
    
    toast.info(checked ? "You are now available for jobs" : "You are now unavailable for jobs");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('available')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="availability"
                checked={available}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="availability">
                {available ? "Available for jobs" : "Not available for jobs"}
              </Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.paymentCompleted ? (
              <div className="text-green-600 font-medium">Registration fee paid</div>
            ) : (
              <div>
                <div className="text-amber-600 font-medium mb-2">Registration fee pending</div>
                <Button size="sm" onClick={() => toast.info("Redirecting to payment")}>
                  Pay Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('nearby_jobs')}</CardTitle>
        </CardHeader>
        <CardContent>
          {!userProfile?.paymentCompleted && (
            <div className="text-center p-4 bg-amber-50 rounded-md mb-4">
              <p className="text-amber-600">
                Complete your payment to receive job notifications
              </p>
            </div>
          )}
          
          {!available && (
            <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
              <p className="text-gray-600">
                Toggle availability to receive job notifications
              </p>
            </div>
          )}
          
          {userProfile?.paymentCompleted && available && (
            <div className="text-center p-8">
              <p className="text-gray-500">No job requests at the moment</p>
              <p className="text-sm text-gray-400 mt-2">
                You'll be notified when a customer requests a service near you
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('past_work')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <p className="text-gray-500">No past work yet</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
