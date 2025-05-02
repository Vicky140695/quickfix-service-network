
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const BookService: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [bookingType, setBookingType] = useState<'self' | 'other'>('self');
  const [timePreference, setTimePreference] = useState<'now' | 'later'>('now');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Service mapping based on ID
  const serviceMap: Record<string, { name: string, icon: string }> = {
    'electrical': { name: 'Electrical', icon: '⚡' },
    'plumbing': { name: 'Plumbing', icon: '🚿' },
    'carpentry': { name: 'Carpentry', icon: '🔨' },
    'painting': { name: 'Painting', icon: '🖌️' },
    'cleaning': { name: 'Cleaning', icon: '🧹' },
    'gardening': { name: 'Gardening', icon: '🌱' }
  };
  
  const service = serviceId ? serviceMap[serviceId] : null;

  const handleCurrentLocation = () => {
    toast.info("Getting current location...");
    setTimeout(() => {
      setAddress("123 Main Street, Sample City");
      toast.success("Location set successfully!");
    }, 1000);
  };
  
  const handleBookNow = () => {
    if (!address) {
      toast.error("Please provide an address");
      return;
    }
    
    if (!description) {
      toast.error("Please provide a description of the issue");
      return;
    }
    
    if (bookingType === 'other' && (!contactName || !contactPhone)) {
      toast.error("Please provide contact information");
      return;
    }
    
    // Navigate to the booking confirmation/loading page
    navigate('/customer/booking-progress', { 
      state: { 
        service: service?.name,
        address,
        description,
        bookingType,
        timePreference,
        contactName: bookingType === 'other' ? contactName : '',
        contactPhone: bookingType === 'other' ? contactPhone : ''
      }
    });
  };

  if (!service) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Service not found</h1>
        <Button onClick={() => navigate('/customer/dashboard')}>
          {t('back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">{service.icon}</span>
            <span>Book {service.name} Service</span>
          </CardTitle>
          <CardDescription>Fill in the details to book a service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">{t('book_service')}</h3>
            <RadioGroup
              value={bookingType}
              onValueChange={(value) => setBookingType(value as 'self' | 'other')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">{t('for_me')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">{t('for_someone_else')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          {bookingType === 'other' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium mb-3">When do you need the service?</h3>
            <RadioGroup
              value={timePreference}
              onValueChange={(value) => setTimePreference(value as 'now' | 'later')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now">{t('now')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="later" />
                <Label htmlFor="later">{t('later')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="address">{t('address')}</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter service address"
              rows={3}
            />
            <Button
              variant="outline"
              className="mt-2 text-sm"
              onClick={handleCurrentLocation}
            >
              {t('use_current_location')}
            </Button>
          </div>
          
          <div>
            <Label htmlFor="description">Describe the issue</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the service needed"
              rows={4}
            />
          </div>
          
          <Button className="w-full" onClick={handleBookNow}>
            {timePreference === 'now' ? 'Book Now' : 'Schedule Service'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookService;
