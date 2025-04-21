import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import StudentOrders from "./pages/StudentOrders";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import StaffLogin from "./pages/StaffLogin";
import StaffSignup from "./pages/StaffSignup";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";
import { useUser } from "@/contexts/UserContext";
import Orders from "./pages/Orders";
import StaffProfile from '@/pages/StaffProfile';
import StudentProfile from '@/pages/StudentProfile';
import ForgotPassword from '@/components/auth/ForgotPassword';
import ResetPassword from '@/components/auth/ResetPassword';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<div>About Us</div>} />
                <Route path="/contact" element={<div>Contact Us</div>} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/login/staff" element={<StaffLogin />} />
                <Route path="/login/student" element={<StudentLogin />} />
                <Route path="/signup/staff" element={<StaffSignup />} />
                <Route path="/signup/student" element={<StudentSignup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Student Dashboard Routes */}
                <Route
                  path="/dashboard/student"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StudentDashboard />} />
                  <Route path="orders" element={<StudentOrders />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="profile" element={<StudentProfile />} />
                </Route>

                {/* Staff Dashboard Routes */}
                <Route
                  path="/dashboard/staff"
                  element={
                    <ProtectedRoute requiredRole="staff">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StaffDashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="profile" element={<StaffProfile />} />
                </Route>

                {/* Redirect /dashboard to the appropriate dashboard based on user role */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="any">
                      <DashboardRedirect />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Helper component to redirect to the appropriate dashboard
const DashboardRedirect = () => {
  const { user } = useUser();
  return <Navigate to={user?.role === 'student' ? '/dashboard/student' : '/dashboard/staff'} replace />;
};

export default App;
