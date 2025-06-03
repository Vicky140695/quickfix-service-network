
import { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Loader } from 'lucide-react';

const Index = () => {
  const { isVerified, role, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('Index page - isLoading:', isLoading, 'isVerified:', isVerified, 'role:', role, 'pathname:', location.pathname);
    
    // Only handle navigation if we're actually on the index page
    if (location.pathname !== '/') {
      return;
    }
    
    if (!isLoading) {
      if (isVerified && role === 'customer') {
        navigate('/customer/dashboard');
      } else if (isVerified && role === 'worker') {
        navigate('/worker/dashboard');
      } else if (isVerified && role === 'admin') {
        navigate('/admin/dashboard');
      } else if (!isVerified && !role) {
        // If user is not verified and has no role, start from language selection
        navigate('/language');
      } else if (!isVerified && role) {
        // If user has a role but is not verified, go to phone verification
        if (role === 'worker') {
          navigate('/worker/phone-verification');
        } else if (role === 'customer') {
          navigate('/customer/phone-verification');
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
  
  // If we're not on the index page, don't render anything (let the router handle it)
  if (location.pathname !== '/') {
    return null;
  }
  
  return null; // Redirects are handled in useEffect
};

export default Index;
