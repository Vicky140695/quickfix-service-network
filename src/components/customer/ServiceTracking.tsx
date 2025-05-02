
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock data for service tracking
const serviceData = {
  id: '12345',
  service: 'Electrical',
  status: 'in-progress',
  worker: {
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    rating: 4.8,
    eta: '15 minutes'
  },
  location: {
    address: '123 Main Street, Sample City',
    distance: '2.5 km'
  }
};

const ServiceTracking: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tracking');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate the worker progressing toward the location
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success("Professional has arrived at your location!");
          return 100;
        }
        return prev + 5;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCallWorker = () => {
    toast.info(`Calling ${serviceData.worker.name}...`);
  };
  
  const handleCancelService = () => {
    toast.error("Service canceled successfully");
    navigate('/customer/dashboard');
  };
  
  const handleCompleteService = () => {
    navigate('/customer/service-bill');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{serviceData.service} Service</CardTitle>
          <CardDescription>
            Order #{serviceData.id} • {serviceData.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracking">{t('tracking')}</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tracking" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Professional Location</h3>
                <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
                  {/* This would be a real map in production */}
                  <p className="text-gray-600">Interactive Map View</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Professional is on the way</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">ETA:</span> {serviceData.worker.eta}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Distance:</span> {serviceData.location.distance}
                    </p>
                  </div>
                  
                  {progress === 100 && (
                    <div className="text-center p-3 bg-green-50 rounded-md text-green-700">
                      <p className="font-medium">Professional has arrived</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleCallWorker}>
                  Call
                </Button>
                {progress < 100 ? (
                  <Button variant="destructive" className="flex-1" onClick={handleCancelService}>
                    Cancel
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={handleCompleteService}>
                    Service Complete
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="py-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Professional Details</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">{serviceData.worker.name}</p>
                      <p className="text-sm text-gray-500">★★★★☆ ({serviceData.worker.rating})</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Service Location</h3>
                  <p className="text-gray-700">{serviceData.location.address}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Service Description</h3>
                  <p className="text-gray-700">Electrical inspection and repair of power outlets</p>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleCallWorker}>
                    Call
                  </Button>
                  {progress < 100 ? (
                    <Button variant="destructive" className="flex-1" onClick={handleCancelService}>
                      Cancel
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={handleCompleteService}>
                      Service Complete
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceTracking;
