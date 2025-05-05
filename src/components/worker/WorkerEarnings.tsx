
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateWorkerEarnings, getWorkerCommissions } from '../../services/paymentService';

const WorkerEarnings: React.FC = () => {
  const { phoneNumber } = useUser();
  
  const commissions = getWorkerCommissions(phoneNumber);
  const earnings = calculateWorkerEarnings(phoneNumber);
  
  const hasEarnings = Object.keys(commissions).length > 0;
  
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Earnings</CardTitle>
          <CardDescription>Track your service payments and commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold">₹{earnings.earnings.toFixed(2)}</p>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{Object.keys(commissions).length}</p>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium">Platform Fee</p>
              <p className="text-2xl font-bold">₹{earnings.commission.toFixed(2)}</p>
              <p className="text-xs text-gray-500">(10% of order value)</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Service History</h3>
            {hasEarnings ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(commissions)
                  .sort(([, a], [, b]) => b.timestamp - a.timestamp)
                  .map(([serviceId, data]) => (
                  <div key={serviceId} className="border rounded-md p-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Service #{serviceId.substring(serviceId.length - 5)}</p>
                      <p className="text-sm">{new Date(data.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Order Amount</span>
                      <span>₹{data.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Fee (10%)</span>
                      <span className="text-red-500">₹{data.commission}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1 border-t pt-1">
                      <span>Your Earnings</span>
                      <span className="text-green-600">₹{(data.amount - data.commission).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No completed services yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerEarnings;
