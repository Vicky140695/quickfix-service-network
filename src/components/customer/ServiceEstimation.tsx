
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getDefaultServices, saveEstimationRequest, EstimationItem } from '../../services/estimationService';

const ServiceEstimation: React.FC = () => {
  const { t } = useLanguage();
  const { phoneNumber } = useUser();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<EstimationItem[]>([]);
  const [filterService, setFilterService] = useState('');
  const [otherWorkTitle, setOtherWorkTitle] = useState('');
  const [otherWorkDescription, setOtherWorkDescription] = useState('');
  const [otherWorkPrice, setOtherWorkPrice] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState(phoneNumber || '');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default services from our service
  const defaultServices = getDefaultServices();
  
  // Filter services based on search input
  const filteredServices = defaultServices.filter(service => 
    service.service.toLowerCase().includes(filterService.toLowerCase()) || 
    service.task.toLowerCase().includes(filterService.toLowerCase())
  );
  
  const handleAddService = (service: Omit<EstimationItem, 'quantity'>) => {
    const existing = selectedServices.find(s => s.id === service.id);
    
    if (existing) {
      // Update quantity if already selected
      setSelectedServices(selectedServices.map(s => 
        s.id === service.id ? {...s, quantity: s.quantity + 1} : s
      ));
    } else {
      // Add new service with quantity 1
      setSelectedServices([...selectedServices, {...service, quantity: 1}]);
    }
    
    toast.success(`Added ${service.task} to your estimate`);
  };
  
  const handleRemoveService = (id: number) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };
  
  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedServices(selectedServices.map(s => 
      s.id === id ? {...s, quantity} : s
    ));
  };
  
  const handleAddOtherWork = () => {
    if (!otherWorkTitle || !otherWorkPrice) {
      toast.error("Please provide a title and price for the custom work");
      return;
    }
    
    const price = parseFloat(otherWorkPrice);
    if (isNaN(price)) {
      toast.error("Please enter a valid price");
      return;
    }
    
    const newId = Math.max(0, ...selectedServices.map(s => s.id), ...defaultServices.map(s => s.id)) + 1;
    setSelectedServices([
      ...selectedServices, 
      {
        id: newId, 
        service: 'Other', 
        task: otherWorkTitle, 
        price, 
        quantity: 1
      }
    ]);
    
    setOtherWorkTitle('');
    setOtherWorkDescription('');
    setOtherWorkPrice('');
    
    toast.success("Custom work added to estimate");
  };
  
  // Calculate totals
  const subtotal = selectedServices.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  
  const handleRequestEstimate = async () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save estimation request using our service
      await saveEstimationRequest({
        items: selectedServices,
        subtotal,
        tax,
        total,
        customerName,
        customerPhone,
        customerAddress,
        notes
      });
      
      toast.success("Estimate requested successfully!");
      // Navigate to confirmation or dashboard
      setTimeout(() => navigate('/customer/dashboard'), 1500);
    } catch (error) {
      console.error("Error requesting estimate:", error);
      toast.error("Failed to request estimate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Estimation</CardTitle>
          <CardDescription>Get an estimate for your service requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Services selection - Left side */}
            <div className="md:col-span-2 space-y-4">
              <Input
                placeholder="Search services..."
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="mb-4"
              />
              
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <h3 className="font-medium mb-3">Available Services</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead className="text-right">Price (₹)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.service}</TableCell>
                        <TableCell>{service.task}</TableCell>
                        <TableCell className="text-right">{service.price}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAddService(service)}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">+ Add Custom Work</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Work</DialogTitle>
                    <DialogDescription>
                      Describe the custom work you need for your estimate
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Work Title*</Label>
                      <Input
                        id="title"
                        value={otherWorkTitle}
                        onChange={(e) => setOtherWorkTitle(e.target.value)}
                        placeholder="e.g., Custom Shelving Installation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={otherWorkDescription}
                        onChange={(e) => setOtherWorkDescription(e.target.value)}
                        placeholder="Provide details about the custom work"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Estimated Price (₹)*</Label>
                      <Input
                        id="price"
                        value={otherWorkPrice}
                        onChange={(e) => setOtherWorkPrice(e.target.value)}
                        placeholder="Enter your budget"
                        type="number"
                      />
                    </div>
                    <Button onClick={handleAddOtherWork}>Add to Estimate</Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Customer Information - Added section */}
              <div className="space-y-4 pt-4 border-t mt-4">
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Your Name (optional)</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Your Phone (optional)</Label>
                    <Input
                      id="customer-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer-address">Service Address (optional)</Label>
                  <Textarea
                    id="customer-address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter service address"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-notes">Notes (optional)</Label>
                  <Textarea
                    id="customer-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information you'd like to provide"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            {/* Selected services and total - Right side */}
            <div className="space-y-4">
              <h3 className="font-medium mb-3">Your Estimate</h3>
              {selectedServices.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center mb-3 pb-2 border-b">
                      <div>
                        <p className="font-medium">{service.task}</p>
                        <p className="text-sm text-gray-500">{service.service}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(service.id, service.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{service.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(service.id, service.quantity + 1)}
                        >
                          +
                        </Button>
                        <span className="ml-2">₹{service.price * service.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500"
                          onClick={() => handleRemoveService(service.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST (18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total Estimate</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  No services selected yet. Add services from the list to generate an estimate.
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleRequestEstimate}
                disabled={selectedServices.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Request Estimate'}
              </Button>
              <p className="text-xs text-center text-gray-500">
                This is just an estimate. Final price may vary based on actual work required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceEstimation;
