import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Trash2, Plus, Save } from 'lucide-react';

const WorkerBillGenerator: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billItems, setBillItems] = useState<Array<{id: number, description: string, amount: number}>>([
    { id: 1, description: '', amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  
  const handleItemDescriptionChange = (id: number, description: string) => {
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, description } : item
    ));
  };
  
  const handleItemAmountChange = (id: number, amount: string) => {
    const numAmount = amount === '' ? 0 : parseFloat(amount);
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, amount: isNaN(numAmount) ? 0 : numAmount } : item
    ));
  };
  
  const handleAddItem = () => {
    const newId = Math.max(0, ...billItems.map(item => item.id)) + 1;
    setBillItems([...billItems, { id: newId, description: '', amount: 0 }]);
  };
  
  const handleRemoveItem = (id: number) => {
    if (billItems.length <= 1) {
      toast.error("Bill must have at least one item");
      return;
    }
    setBillItems(billItems.filter(item => item.id !== id));
  };
  
  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  const workerShare = total * 0.9; // 90% goes to worker
  
  const handleGenerateBill = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error("Please provide customer details");
      return;
    }
    
    if (billItems.some(item => !item.description || item.amount <= 0)) {
      toast.error("All bill items must have a description and a valid amount");
      return;
    }
    
    // In a real app, send this to backend
    toast.success("Bill generated and sent to customer!");
    // Navigate back to worker dashboard
    setTimeout(() => navigate('/worker/dashboard'), 1500);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Generate Bill
          </CardTitle>
          <CardDescription>Create a bill for the completed service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-name">Customer Name*</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customer-phone">Customer Phone*</Label>
                <Input
                  id="customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter customer phone"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customer-address">Service Address*</Label>
              <Textarea
                id="customer-address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter service address"
                rows={2}
              />
            </div>
          </div>
          
          {/* Bill Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Bill Items</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemDescriptionChange(item.id, e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.amount || ''}
                          onChange={(e) => handleItemAmountChange(item.id, e.target.value)}
                          placeholder="0.00"
                          type="number"
                          className="text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information for the customer"
              rows={2}
            />
          </div>
          
          {/* Bill Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Bill Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 pt-2">
                <p>Your earnings (after 10% platform fee): ₹{workerShare.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => navigate('/worker/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleGenerateBill}>
              <Save className="h-4 w-4 mr-2" /> Generate Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerBillGenerator;
