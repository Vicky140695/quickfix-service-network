import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider } from "./contexts/UserContext";
import { WalletProvider } from "./contexts/WalletContext";
import { useEffect } from "react";
import { toast } from "sonner";
import SupabaseStatusBanner from "./components/SupabaseStatusBanner";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LanguageSelectionPage from "./pages/LanguageSelectionPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

// Worker Pages
import WorkerPhoneVerificationPage from "./pages/worker/WorkerPhoneVerificationPage";
import WorkerRegistrationPage from "./pages/worker/WorkerRegistrationPage";
import WorkerTermsPage from "./pages/worker/WorkerTermsPage";
import WorkerPaymentPage from "./pages/worker/WorkerPaymentPage";
import WorkerDashboardPage from "./pages/worker/WorkerDashboardPage";
import WorkerEarningsPage from "./pages/worker/WorkerEarningsPage";
import WorkerEstimationPage from "./pages/worker/WorkerEstimationPage";
import WorkerBillPage from "./pages/worker/WorkerBillPage";

// Customer Pages
import CustomerPhoneVerificationPage from "./pages/customer/CustomerPhoneVerificationPage";
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import BookServicePage from "./pages/customer/BookServicePage";
import BookingProgressPage from "./pages/customer/BookingProgressPage";
import ServiceTrackingPage from "./pages/customer/ServiceTrackingPage";
import ServiceBillPage from "./pages/customer/ServiceBillPage";
import WalletPage from "./pages/customer/WalletPage";
import EstimationPage from "./pages/customer/EstimationPage";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminWorkerApprovalsPage from "./pages/admin/AdminWorkerApprovalsPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Auth protection component
import { useUser } from "./contexts/UserContext";

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

// Route protection components
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: 'customer' | 'worker' | 'admin' }) => {
  const { isVerified, role, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isVerified) {
    return <Navigate to="/language" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    toast.error(`Access denied. This page is for ${requiredRole}s only.`);
    
    // Redirect based on actual role
    if (role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isVerified, role, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect authenticated users to their respective dashboards
  if (isVerified) {
    if (role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  return children;
};

// Check environment variables
const EnvChecker = () => {
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      toast.error(
        "Supabase environment variables are missing. Please check your configuration.",
        { duration: 10000 }
      );
    }
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <WalletProvider>
          <TooltipProvider>
            <EnvChecker />
            <Toaster />
            <Sonner />
            <div className="container mx-auto px-4 py-2">
              <SupabaseStatusBanner />
            </div>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Public Routes */}
              <Route path="/language" element={
                <PublicOnlyRoute>
                  <LanguageSelectionPage />
                </PublicOnlyRoute>
              } />
              
              <Route path="/role-selection" element={
                <PublicOnlyRoute>
                  <RoleSelectionPage />
                </PublicOnlyRoute>
              } />
              
              {/* Worker Routes */}
              <Route path="/worker/phone-verification" element={
                <PublicOnlyRoute>
                  <WorkerPhoneVerificationPage />
                </PublicOnlyRoute>
              } />
              
              <Route path="/worker/registration" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerRegistrationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/terms" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerTermsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/payment" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerPaymentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/dashboard" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerDashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/earnings" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerEarningsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/estimation" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerEstimationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/worker/bill" element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerBillPage />
                </ProtectedRoute>
              } />
              
              {/* Customer Routes */}
              <Route path="/customer/phone-verification" element={
                <PublicOnlyRoute>
                  <CustomerPhoneVerificationPage />
                </PublicOnlyRoute>
              } />
              
              <Route path="/customer/dashboard" element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/book-service/:serviceId" element={
                <ProtectedRoute requiredRole="customer">
                  <BookServicePage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/booking-progress" element={
                <ProtectedRoute requiredRole="customer">
                  <BookingProgressPage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/service-tracking" element={
                <ProtectedRoute requiredRole="customer">
                  <ServiceTrackingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/service-bill" element={
                <ProtectedRoute requiredRole="customer">
                  <ServiceBillPage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/wallet" element={
                <ProtectedRoute requiredRole="customer">
                  <WalletPage />
                </ProtectedRoute>
              } />
              
              <Route path="/customer/estimation" element={
                <ProtectedRoute requiredRole="customer">
                  <EstimationPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={
                <PublicOnlyRoute>
                  <AdminLoginPage />
                </PublicOnlyRoute>
              } />
              
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="worker-approvals" element={<AdminWorkerApprovalsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </WalletProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
