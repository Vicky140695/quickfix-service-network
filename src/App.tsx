
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider } from "./contexts/UserContext";

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

// Customer Pages
import CustomerPhoneVerificationPage from "./pages/customer/CustomerPhoneVerificationPage";
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import BookServicePage from "./pages/customer/BookServicePage";
import BookingProgressPage from "./pages/customer/BookingProgressPage";
import ServiceTrackingPage from "./pages/customer/ServiceTrackingPage";
import ServiceBillPage from "./pages/customer/ServiceBillPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/language" element={<LanguageSelectionPage />} />
              <Route path="/role-selection" element={<RoleSelectionPage />} />
              
              {/* Worker Routes */}
              <Route path="/worker/phone-verification" element={<WorkerPhoneVerificationPage />} />
              <Route path="/worker/registration" element={<WorkerRegistrationPage />} />
              <Route path="/worker/terms" element={<WorkerTermsPage />} />
              <Route path="/worker/payment" element={<WorkerPaymentPage />} />
              <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
              
              {/* Customer Routes */}
              <Route path="/customer/phone-verification" element={<CustomerPhoneVerificationPage />} />
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/book-service/:serviceId" element={<BookServicePage />} />
              <Route path="/customer/booking-progress" element={<BookingProgressPage />} />
              <Route path="/customer/service-tracking" element={<ServiceTrackingPage />} />
              <Route path="/customer/service-bill" element={<ServiceBillPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
