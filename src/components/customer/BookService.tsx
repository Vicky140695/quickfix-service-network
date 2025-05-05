
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
import { AirVent, WashingMachine, Refrigerator, CalendarDays, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, isBefore, isToday, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

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
  
  // New states for date and time selection
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    timePreference === 'now' ? new Date() : addDays(new Date(), 1)
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    timePreference === 'now' ? 'asap' : '10:00'
  );

  // Service mapping based on ID
  const serviceMap: Record<string, { name: string, icon: string, lucideIcon?: React.ReactNode }> = {
    'electrical': { name: 'Electrical', icon: '⚡' },
    'plumbing': { name: 'Plumbing', icon: '🚿' },
    'carpentry': { name: 'Carpentry', icon: '🔨' },
    'painting': { name: 'Painting', icon: '🖌️' },
    'cleaning': { name: 'Cleaning', icon: '🧹' },
    'ac-service': { 
      name: 'AC Service/Maintenance', 
      icon: '❄️',
      lucideIcon: <AirVent className="h-5 w-5" />
    },
    'washing-machine': { 
      name: 'Washing Machine Service', 
      icon: '🧺',
      lucideIcon: <WashingMachine className="h-5 w-5" />
    },
    'fridge-service': { 
      name: 'Fridge Service', 
      icon: '🧊',
      lucideIcon: <Refrigerator className="h-5 w-5" />
    }
  };
  
  const service = serviceId ? serviceMap[serviceId] : null;

  // Generate time slots from 8:00 AM to 8:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    if (timePreference === 'now') {
      slots.push({ value: 'asap', label: 'As soon as possible' });
    }
    
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      
      slots.push({ 
        value: `${hour}:00`, 
        label: `${formattedHour}:00 ${period}` 
      });
      
      if (hour < 20) {
        slots.push({ 
          value: `${hour}:30`, 
          label: `${formattedHour}:30 ${period}` 
        });
      }
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  // Disable past dates in the calendar
  const disableDates = (date: Date) => {
    if (timePreference === 'now') {
      return !isToday(date);
    }
    return isBefore(date, new Date()) && !isToday(date);
  };

  // Handle time preference change
  const handleTimePreferenceChange = (value: 'now' | 'later') => {
    setTimePreference(value);
    
    if (value === 'now') {
      setSelectedDate(new Date());
      setSelectedTime('asap');
    } else {
      // Default to tomorrow for scheduled services
      setSelectedDate(addDays(new Date(), 1));
      setSelectedTime('10:00');
    }
  };

  const handleCurrentLocation = () => {
    toast.info("Getting current location...");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use a reverse geocoding service here
          const mockAddress = "123 Main Street, Sample City";
          setAddress(mockAddress);
          toast.success("Location set successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };
  
  const handleBookNow = () => {
    if (!address) {
      toast.error("Please provide an address");
      return;
    }
    
    if (bookingType === 'other' && (!contactName || !contactPhone)) {
      toast.error("Please provide contact information");
      return;
    }
    
    if (timePreference === 'later' && (!selectedDate || !selectedTime)) {
      toast.error("Please select a date and time for the service");
      return;
    }
    
    // Format the selected date and time for display
    const scheduledDateTime = timePreference === 'now' 
      ? 'As soon as possible'
      : `${format(selectedDate as Date, 'PP')} at ${selectedTime.split(':')[0]}:${selectedTime.split(':')[1] || '00'}`;
    
    // Store the booking in local storage (simulating a backend)
    try {
      const bookings = JSON.parse(localStorage.getItem('quickfix-bookings') || '[]');
      
      const newBooking = {
        id: `booking-${Date.now()}`,
        service: service?.name,
        address,
        description,
        bookingType,
        timePreference,
        scheduledDateTime,
        contactName: bookingType === 'other' ? contactName : '',
        contactPhone: bookingType === 'other' ? contactPhone : '',
        status: 'pending',
        createdAt: Date.now()
      };
      
      bookings.push(newBooking);
      localStorage.setItem('quickfix-bookings', JSON.stringify(bookings));
      
      // Navigate to the booking confirmation/loading page
      navigate('/customer/booking-progress', { 
        state: newBooking
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Failed to save booking. Please try again.");
    }
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
            {service.lucideIcon ? (
              <span className="mr-2">{service.lucideIcon}</span>
            ) : (
              <span className="text-2xl mr-2">{service.icon}</span>
            )}
            <span>Book {service.name}</span>
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
              onValueChange={(value) => handleTimePreferenceChange(value as 'now' | 'later')}
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
          
          {timePreference === 'later' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PP') : 'Select a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={disableDates}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
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
            <Label htmlFor="description">
              Describe the issue <span className="text-gray-500 text-sm">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the service needed (optional)"
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
