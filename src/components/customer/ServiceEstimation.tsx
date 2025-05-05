
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
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

const defaultServices = [
  { id: 1, service: 'Electrical', task: 'Fan Installation', price: 350 },
  { id: 2, service: 'Electrical', task: 'Switch Board Repair', price: 250 },
  { id: 3, service: 'Plumbing', task: 'Tap Installation', price: 200 },
  { id: 4, service: 'Plumbing', task: 'Pipe Leakage Repair', price: 400 },
  { id: 5, service: 'AC Service', task: 'General Service', price: 600 },
  { id: 6, service: 'AC Service', task: 'Gas Refill', price: 1500 },
  { id: 7, service: 'Washing Machine', task: 'General Service', price: 500 },
  { id: 8, service: 'Carpentry', task: 'Door Repair', price: 450 },
  { id: 9, service: 'Carpentry', task: 'Furniture Assembly', price: 600 },
  { id: 10, service: 'Painting', task: 'Wall Painting (per sqft)', price: 15 }
];

const ServiceEstimation: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<Array<{id: number, service: string, task: string, price: number, quantity: number}>>([]);
  const [filterService, setFilterService] = useState('');
  const [otherWorkTitle, setOtherWorkTitle] = useState('');
  const [otherWorkDescription, setOtherWorkDescription] = useState('');
  const [otherWorkPrice, setOtherWorkPrice] = useState('');
  
  // Filter services based on search input
  const filteredServices = defaultServices.filter(service => 
    service.service.toLowerCase().includes(filterService.toLowerCase()) || 
    service.task.toLowerCase().includes(filterService.toLowerCase())
  );
  
  const handleAddService = (service: {id: number, service: string, task: string, price: number}) => {
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
    
    const newId = Math.max(0, ...selectedServices.map(s => s.id)) + 1;
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
  
  const handleRequestEstimate = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    // In a real app, send this to backend
    toast.success("Estimate requested successfully!");
    // Navigate to confirmation or dashboard
    setTimeout(() => navigate('/customer/dashboard'), 1500);
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
                disabled={selectedServices.length === 0}
              >
                Request Estimate
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
