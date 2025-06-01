
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SupabaseStatusBanner: React.FC = () => {
  // Check if we have the real Supabase credentials configured
  const hasSupabaseUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-url.supabase.co';
  const hasSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key';
  
  // Also check the integrated Supabase credentials
  const hasIntegratedSupabase = window.location.hostname.includes('lovableproject.com') || 
                               window.location.hostname.includes('lovable.app');

  // Only show if environment variables are missing AND we don't have integrated Supabase
  if ((hasSupabaseUrl && hasSupabaseKey) || hasIntegratedSupabase) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Supabase Configuration Missing</AlertTitle>
      <AlertDescription className="text-sm">
        <p>Your app is running with placeholder Supabase credentials.</p>
        <p className="mt-2">
          To enable database functionality, please connect to Supabase by clicking
          the green Supabase button in the top right corner.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseStatusBanner;
