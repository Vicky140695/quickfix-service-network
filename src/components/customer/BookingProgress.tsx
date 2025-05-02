
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookingState {
  service: string;
  address: string;
  description: string;
  bookingType: 'self' | 'other';
  timePreference: 'now' | 'later';
  contactName?: string;
  contactPhone?: string;
}

const BookingProgress: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as BookingState;
  
  const [status, setStatus] = useState<'searching' | 'found' | 'notFound'>('searching');
  const [countdown, setCountdown] = useState(60);
  
  // Simulate the search for a worker
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, this would be a response from the backend
      // For now, randomly decide if a worker was found
      const workerFound = Math.random() > 0.3;
      setStatus(workerFound ? 'found' : 'notFound');
      
      if (workerFound) {
        toast.success(`A ${bookingData.service} professional has accepted your request!`);
      } else {
        toast.error("No workers available right now");
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [bookingData.service]);
  
  // Countdown timer
  useEffect(() => {
    if (status !== 'searching') return;
    
    if (countdown <= 0) {
      setStatus('notFound');
      toast.error("No workers available right now");
      return;
    }
    
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdown, status]);
  
  const handleViewDetails = () => {
    navigate('/customer/service-tracking');
  };
  
  const handleTryAgain = () => {
    setStatus('searching');
    setCountdown(60);
    
    // Simulate search again
    setTimeout(() => {
      const workerFound = Math.random() > 0.3;
      setStatus(workerFound ? 'found' : 'notFound');
      
      if (workerFound) {
        toast.success(`A ${bookingData.service} professional has accepted your request!`);
      } else {
        toast.error("No workers available right now");
      }
    }, 5000);
  };
  
  const handleCancel = () => {
    navigate('/customer/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Booking {bookingData.service} Service</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          {status === 'searching' && (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin-slow mb-4"></div>
              <h2 className="text-xl font-medium mb-2">Finding a professional near you</h2>
              <p className="text-gray-500 mb-4">This may take a moment...</p>
              <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(60 - countdown) / 60 * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-500">Searching for {countdown} seconds</p>
              
              <div className="mt-8 space-y-3">
                <h3 className="font-medium">Service Details</h3>
                <p className="text-sm text-gray-600">Service: {bookingData.service}</p>
                <p className="text-sm text-gray-600">Address: {bookingData.address}</p>
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel Request
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {status === 'found' && (
            <>
              <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-2xl mb-4">
                ✓
              </div>
              <h2 className="text-xl font-medium mb-2">Professional Found!</h2>
              <p className="text-gray-500 mb-6">A qualified professional has accepted your service request.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full max-w-sm mb-6">
                <h3 className="font-medium mb-2">Professional Details</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="text-left">
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-gray-500">★★★★☆ (4.8)</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button onClick={handleViewDetails}>
                  Track Professional
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel Request
                </Button>
              </div>
            </>
          )}
          
          {status === 'notFound' && (
            <>
              <div className="w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center rounded-full text-2xl mb-4">
                ✗
              </div>
              <h2 className="text-xl font-medium mb-2">No Professionals Available</h2>
              <p className="text-gray-500 mb-6">We couldn't find any available professionals in your area right now.</p>
              
              <div className="space-y-4">
                <Button onClick={handleTryAgain}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Return to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingProgress;
