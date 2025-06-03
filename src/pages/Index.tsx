
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Loader } from 'lucide-react';

const Index = () => {
  const { isVerified, role, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only handle navigation if we're actually on the index page
    if (location.pathname !== '/') {
      return;
    }
    
    console.log('Index page navigation - isLoading:', isLoading, 'isVerified:', isVerified, 'role:', role);
    
    if (!isLoading) {
      if (isVerified && role === 'customer') {
        console.log('Navigating to customer dashboard');
        navigate('/customer/dashboard', { replace: true });
      } else if (isVerified && role === 'worker') {
        console.log('Navigating to worker dashboard');
        navigate('/worker/dashboard', { replace: true });
      } else if (isVerified && role === 'admin') {
        console.log('Navigating to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (!isVerified && !role) {
        console.log('No role, navigating to language selection');
        navigate('/language', { replace: true });
      } else if (!isVerified && role) {
        console.log('Has role but not verified, navigating to phone verification');
        if (role === 'worker') {
          navigate('/worker/phone-verification', { replace: true });
        } else if (role === 'customer') {
          navigate('/customer/phone-verification', { replace: true });
        }
      }
    }
  }, [isVerified, role, isLoading, navigate, location.pathname]);
  
  // Only show loading when we're on the actual index page
  if (location.pathname === '/' && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // If we're not on the index page, don't render anything
  if (location.pathname !== '/') {
    return null;
  }
  
  return null; // Redirects are handled in useEffect
};

export default Index;
