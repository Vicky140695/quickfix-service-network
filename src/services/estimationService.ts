
import { toast } from 'sonner';

// Types
export interface EstimationItem {
  id: number;
  service: string;
  task: string;
  price: number;
  quantity: number;
}

export interface EstimationRequest {
  id: string;
  items: EstimationItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

// Local storage keys
const ESTIMATION_REQUESTS_KEY = 'quickfix-estimation-requests';
const DEFAULT_SERVICES_KEY = 'quickfix-default-services';

// Get default services
export const getDefaultServices = (): Array<Omit<EstimationItem, 'quantity'>> => {
  try {
    const storedServices = localStorage.getItem(DEFAULT_SERVICES_KEY);
    if (storedServices) {
      return JSON.parse(storedServices);
    }
    
    // Default services if none in storage
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
    
    localStorage.setItem(DEFAULT_SERVICES_KEY, JSON.stringify(defaultServices));
    return defaultServices;
  } catch (error) {
    console.error("Error getting default services:", error);
    toast.error("Failed to load service list");
    return [];
  }
};

// Get all estimation requests
export const getEstimationRequests = (): EstimationRequest[] => {
  try {
    const storedRequests = localStorage.getItem(ESTIMATION_REQUESTS_KEY);
    return storedRequests ? JSON.parse(storedRequests) : [];
  } catch (error) {
    console.error("Error getting estimation requests:", error);
    toast.error("Failed to load estimation requests");
    return [];
  }
};

// Save an estimation request
export const saveEstimationRequest = (request: Omit<EstimationRequest, 'id' | 'createdAt' | 'status'>): EstimationRequest => {
  try {
    const requests = getEstimationRequests();
    
    const newRequest: EstimationRequest = {
      ...request,
      id: `est-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      status: 'pending'
    };
    
    requests.push(newRequest);
    localStorage.setItem(ESTIMATION_REQUESTS_KEY, JSON.stringify(requests));
    
    return newRequest;
  } catch (error) {
    console.error("Error saving estimation request:", error);
    toast.error("Failed to save estimation request");
    throw error;
  }
};

// Get a single estimation request by ID
export const getEstimationById = (id: string): EstimationRequest | null => {
  try {
    const requests = getEstimationRequests();
    const request = requests.find(req => req.id === id);
    return request || null;
  } catch (error) {
    console.error("Error getting estimation by ID:", error);
    toast.error("Failed to load estimation details");
    return null;
  }
};

// Update the status of an estimation request
export const updateEstimationStatus = (id: string, status: EstimationRequest['status']): boolean => {
  try {
    const requests = getEstimationRequests();
    const index = requests.findIndex(req => req.id === id);
    
    if (index === -1) {
      return false;
    }
    
    requests[index].status = status;
    localStorage.setItem(ESTIMATION_REQUESTS_KEY, JSON.stringify(requests));
    
    return true;
  } catch (error) {
    console.error("Error updating estimation status:", error);
    toast.error("Failed to update estimation status");
    return false;
  }
};

// Delete an estimation request
export const deleteEstimation = (id: string): boolean => {
  try {
    const requests = getEstimationRequests();
    const filteredRequests = requests.filter(req => req.id !== id);
    
    localStorage.setItem(ESTIMATION_REQUESTS_KEY, JSON.stringify(filteredRequests));
    return true;
  } catch (error) {
    console.error("Error deleting estimation:", error);
    toast.error("Failed to delete estimation");
    return false;
  }
};
