import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/layout/FloatingContact';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import AcademyPage from '@/pages/AcademyPage';
import ConsultingPage from '@/pages/ConsultingPage';
import JourneyPage from '@/pages/JourneyPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminDashboard from '@/pages/AdminDashboard';
import CareersPage from '@/pages/CareersPage';
import ServicesPage from '@/pages/ServicesPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import ResearchPage from '@/pages/ResearchPage';
import TrainingPage from '@/pages/TrainingPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SettingsPage from '@/pages/SettingsPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import MyCourses from '@/pages/dashboard/MyCourses';
import Progress from '@/pages/dashboard/Progress';
import Certificates from '@/pages/dashboard/Certificates';
import Notifications from '@/pages/dashboard/Notifications';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './styles/buttons.css';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { loading, isAuthenticated, isAdmin, profile } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading session...</div>;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (!profile && !loading) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function LayoutWrapper({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/academy" element={<AcademyPage />} />
                <Route path="/consulting" element={<ConsultingPage />} />
                <Route path="/journey" element={<JourneyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/my-courses" element={<MyCourses />} />
                    <Route path="/dashboard/progress" element={<Progress />} />
                    <Route path="/dashboard/certificates" element={<Certificates />} />
                    <Route path="/dashboard/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute adminOnly={true} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-dashboard/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </LayoutWrapper>
          </AuthProvider>
        </Router>
      </HelmetProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;