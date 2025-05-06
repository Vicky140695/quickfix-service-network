
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Loader } from 'lucide-react';

const Index = () => {
  const { isVerified, role, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (isVerified && role === 'customer') {
        navigate('/customer/dashboard');
      } else if (isVerified && role === 'worker') {
        navigate('/worker/dashboard');
      } else if (isVerified && role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/language');
      }
    }
  }, [isVerified, role, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return null; // Redirects are handled in useEffect
};

export default Index;
