
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, User, UserCheck } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface Worker {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  location: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
}

const MOCK_WORKERS: Worker[] = [
  { id: "w1", name: "John Smith", phone: "+91 98765 43210", skills: ["Plumbing", "Electrical"], rating: 4.8, status: "active", location: "Bangalore" },
  { id: "w2", name: "Raj Kumar", phone: "+91 87654 32109", skills: ["Carpentry", "Painting"], rating: 4.5, status: "active", location: "Delhi" },
  { id: "w3", name: "Priya Patel", phone: "+91 76543 21098", skills: ["Cleaning", "Gardening"], rating: 4.7, status: "inactive", location: "Mumbai" },
  { id: "w4", name: "Aisha Khan", phone: "+91 65432 10987", skills: ["Electrical", "AC Repair"], rating: 4.9, status: "active", location: "Chennai" },
  { id: "w5", name: "Vikram Singh", phone: "+91 54321 09876", skills: ["Plumbing", "Carpentry"], rating: 4.2, status: "pending", location: "Hyderabad" },
  { id: "w6", name: "Deepa Roy", phone: "+91 43210 98765", skills: ["Painting", "Cleaning"], rating: 4.6, status: "active", location: "Kolkata" },
  { id: "w7", name: "Amit Sharma", phone: "+91 32109 87654", skills: ["AC Repair", "Electrical"], rating: 4.3, status: "inactive", location: "Pune" },
  { id: "w8", name: "Neha Gupta", phone: "+91 21098 76543", skills: ["Gardening", "Cleaning"], rating: 4.4, status: "pending", location: "Ahmedabad" },
];

const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Ananya Reddy", phone: "+91 98765 43211", location: "Bangalore" },
  { id: "c2", name: "Varun Malhotra", phone: "+91 87654 32108", location: "Delhi" },
  { id: "c3", name: "Kavita Iyer", phone: "+91 76543 21097", location: "Mumbai" },
  { id: "c4", name: "Rajesh Kumar", phone: "+91 65432 10986", location: "Chennai" },
];

const AdminWorkerApprovalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    worker.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignWorker = () => {
    // In a real application, this would call an API to assign the worker
    toast.success(`Worker ${selectedWorker?.name} has been assigned to the customer successfully!`);
    setDialogOpen(false);
  };

  const approveWorker = (workerId: string) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, status: 'active' } : worker
    ));
    toast.success("Worker approved successfully!");
  };

  const rejectWorker = (workerId: string) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, status: 'inactive' } : worker
    ));
    toast.success("Worker rejected successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Worker Management</h1>
        <Button>Add New Worker</Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Worker Approvals</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                placeholder="Search by name, skill, location..." 
                className="w-full pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        {worker.name}
                      </div>
                    </TableCell>
                    <TableCell>{worker.phone}</TableCell>
                    <TableCell>{worker.skills.join(', ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {worker.rating}
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        worker.status === 'active' ? 'bg-green-100 text-green-800' : 
                        worker.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {worker.status === 'active' ? 'Active' : 
                        worker.status === 'inactive' ? 'Inactive' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>{worker.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {worker.status === 'pending' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 hover:bg-green-50 text-green-600"
                              onClick={() => approveWorker(worker.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-500 hover:bg-red-50 text-red-600"
                              onClick={() => rejectWorker(worker.id)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedWorker(worker);
                                setDialogOpen(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <UserCheck className="h-4 w-4" />
                              Assign
                            </Button>
                            <Button variant="outline" size="sm">View</Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredWorkers.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No workers found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker to Customer</DialogTitle>
            <DialogDescription>
              Assign {selectedWorker?.name} to a customer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Worker Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Name:</div>
                <div>{selectedWorker?.name}</div>
                <div className="font-semibold">Skills:</div>
                <div>{selectedWorker?.skills.join(', ')}</div>
                <div className="font-semibold">Rating:</div>
                <div>{selectedWorker?.rating} ★</div>
                <div className="font-semibold">Location:</div>
                <div>{selectedWorker?.location}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="customer" className="font-medium">Select Customer</label>
              <Select onValueChange={setSelectedCustomer} value={selectedCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CUSTOMERS.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignWorker} disabled={!selectedCustomer}>Assign Worker</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkerApprovalsPage;
