
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WalletWidget from './WalletWidget';
import ReferralWidget from './ReferralWidget';

const services = [
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'plumbing', name: 'Plumbing', icon: '🚿' },
  { id: 'carpentry', name: 'Carpentry', icon: '🔨' },
  { id: 'painting', name: 'Painting', icon: '🖌️' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'ac-service', name: 'AC Service', icon: '❄️' },
  { id: 'washing-machine', name: 'Washing Machine', icon: '🧺' },
  { id: 'fridge-service', name: 'Fridge Service', icon: '🧊' }
];

const CustomerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleBookService = (serviceId: string) => {
    navigate(`/customer/book-service/${serviceId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
        <p className="text-gray-600">Find skilled professionals for your service needs</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('book_service')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card 
              key={service.id}
              className="cursor-pointer hover:shadow-md transition-shadow card-hover"
              onClick={() => handleBookService(service.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{service.icon}</div>
                <div className="font-medium">{service.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WalletWidget />
        <ReferralWidget />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>View your recent service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              You haven't booked any services yet
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('about_us')}</CardTitle>
            <CardDescription>Learn more about QuickFix</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              QuickFix connects you with skilled professionals for all your service needs. 
              Whether it's electrical work, plumbing, or carpentry, we've got you covered.
            </p>
            <Button variant="outline">Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
