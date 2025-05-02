
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Mock bill data
const billData = {
  id: 'B12345',
  service: 'Electrical',
  workerId: 'W789',
  workerName: 'Rajesh Kumar',
  date: new Date().toLocaleDateString(),
  items: [
    { description: 'Electrical inspection', amount: 300 },
    { description: 'Outlet repair (2 units)', amount: 500 },
    { description: 'Materials', amount: 200 }
  ],
  subtotal: 1000,
  tax: 120,
  total: 1120
};

const ServiceBill: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const handlePayment = () => {
    toast.success("Payment successful!");
    setShowReviewForm(true);
  };
  
  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    toast.success("Thank you for your review!");
    navigate('/customer/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Bill</CardTitle>
          <CardDescription>Order #{billData.id} • {billData.date}</CardDescription>
        </CardHeader>
        <CardContent>
          {!showReviewForm ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Service Details</h3>
                <p className="text-gray-700">Service: {billData.service}</p>
                <p className="text-gray-700">Professional: {billData.workerName}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Bill Breakdown</h3>
                <div className="space-y-2">
                  {billData.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{item.description}</span>
                      <span className="font-medium">₹{item.amount}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-medium">₹{billData.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">GST (12%)</span>
                      <span className="font-medium">₹{billData.tax}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Total</span>
                      <span className="text-primary font-bold text-xl">₹{billData.total}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={handlePayment}>
                  Pay Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">{t('rate_review')}</h3>
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl px-1"
                      onClick={() => setRating(star)}
                    >
                      {star <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-center text-gray-600 mb-4">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="review">Write a review (optional)</Label>
                  <Textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="How was your experience?"
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={handleSubmitReview}>
                  {t('submit')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceBill;
