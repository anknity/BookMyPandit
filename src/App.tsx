import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthChange } from '@/services/authService';
import api from '@/config/api';

// Auth Pages
import { useAuthStore } from '@/store/authStore';
import { useFCMToken } from '@/hooks/useFCMToken';
const MainLayout = lazy(() => import('@/layouts/MainLayout').then((mod) => ({ default: mod.MainLayout })));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout').then((mod) => ({ default: mod.AdminLayout })));
const PanditLayout = lazy(() => import('@/layouts/PanditLayout').then((mod) => ({ default: mod.PanditLayout })));

// Public Pages
const HomePage = lazy(() => import('@/pages/HomePage').then((mod) => ({ default: mod.HomePage })));
const PujaListing = lazy(() => import('@/pages/public/PujaListing'));
const PujaDetail = lazy(() => import('@/pages/public/PujaDetail').then((mod) => ({ default: mod.PujaDetail })));
const PanditSelection = lazy(() => import('@/pages/PanditSelection').then((mod) => ({ default: mod.PanditSelection })));
const PanditProfile = lazy(() => import('@/pages/PanditProfile').then((mod) => ({ default: mod.PanditProfile })));
const AstrologyPage = lazy(() => import('@/pages/AstrologyPage').then((mod) => ({ default: mod.AstrologyPage })));
const SearchResults = lazy(() => import('@/pages/public/SearchResults').then((mod) => ({ default: mod.SearchResults })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((mod) => ({ default: mod.CheckoutPage })));
const AstrologerChat = lazy(() => import('@/pages/public/AstrologerChat').then((mod) => ({ default: mod.AstrologerChat })));
const BookingConfirmation = lazy(() => import('@/pages/BookingConfirmation').then((mod) => ({ default: mod.BookingConfirmation })));
const UserProfile = lazy(() => import('@/pages/UserProfile').then((mod) => ({ default: mod.UserProfile })));
const AboutUs = lazy(() => import('@/pages/AboutUs').then((mod) => ({ default: mod.AboutUs })));
const PanditOnboarding = lazy(() => import('@/pages/PanditOnboarding').then((mod) => ({ default: mod.PanditOnboarding })));
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions').then((mod) => ({ default: mod.TermsAndConditions })));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then((mod) => ({ default: mod.PrivacyPolicy })));
const DestinationDetails = lazy(() => import('@/pages/public/DestinationDetails').then((mod) => ({ default: mod.DestinationDetails })));

// AI Chatbot
const AIChatbot = lazy(() => import('@/components/AIChatbot').then((mod) => ({ default: mod.AIChatbot })));

const AuthPage = lazy(() => import('@/pages/public/AuthPage').then((mod) => ({ default: mod.AuthPage })));

// User Pages
const BookingHistory = lazy(() => import('@/pages/user/BookingHistory').then((mod) => ({ default: mod.BookingHistory })));
const SavedPandits = lazy(() => import('@/pages/user/SavedPandits').then((mod) => ({ default: mod.SavedPandits })));

// Pandit Pages
const PanditDashboard = lazy(() => import('@/pages/pandit/PanditDashboard').then((mod) => ({ default: mod.PanditDashboard })));
const PanditProfilePage = lazy(() => import('@/pages/pandit/PanditProfile').then((mod) => ({ default: mod.PanditProfilePage })));
const ManageBookings = lazy(() => import('@/pages/pandit/ManageBookings').then((mod) => ({ default: mod.ManageBookings })));
const Earnings = lazy(() => import('@/pages/pandit/Earnings').then((mod) => ({ default: mod.Earnings })));
const PanditChatInbox = lazy(() => import('@/pages/pandit/PanditChatInbox').then((mod) => ({ default: mod.PanditChatInbox })));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard })));
const AdminPandits = lazy(() => import('@/pages/admin/AdminPandits').then((mod) => ({ default: mod.PanditManagement })));
const AdminServices = lazy(() => import('@/pages/admin/AdminServices').then((mod) => ({ default: mod.AdminServices })));
const AdminServiceForm = lazy(() => import('@/pages/admin/AdminServiceForm').then((mod) => ({ default: mod.AdminServiceForm })));
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings').then((mod) => ({ default: mod.AdminBookings })));
const AdminRevenue = lazy(() => import('@/pages/admin/AdminRevenue').then((mod) => ({ default: mod.AdminRevenue })));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings').then((mod) => ({ default: mod.AdminSettings })));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement').then((mod) => ({ default: mod.UserManagement })));
const CouponManagement = lazy(() => import('@/pages/admin/CouponManagement').then((mod) => ({ default: mod.CouponManagement })));
const PaymentManagement = lazy(() => import('@/pages/admin/PaymentManagement').then((mod) => ({ default: mod.PaymentManagement })));
const ReportsManagement = lazy(() => import('@/pages/admin/ReportsManagement').then((mod) => ({ default: mod.ReportsManagement })));
const AdminBannerEditor = lazy(() => import('@/pages/admin/AdminBannerEditor').then((mod) => ({ default: mod.AdminBannerEditor })));

const routeFallback = (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="size-10 border-4 border-orange-100 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Loading page...</p>
    </div>
  </div>
);

function App() {
  const { user, setLoading, setUser } = useAuthStore();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  useFCMToken(); // Start FCM listen loop automatically if logged in

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error("Failed to restore session", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setIsFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isFirebaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-orange-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading BookMyPandit...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Main Public Flow (with Top Navbar & Unified Styles) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/pujas" element={<PujaListing />} />
          <Route path="/pujas/:id" element={<PujaDetail />} />
          <Route path="/pandits" element={<PanditSelection />} />
          <Route path="/pandits/:id" element={<PanditProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/astrology" element={<AstrologyPage />} />
          <Route path="/astrologer-chat" element={<AstrologerChat />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/bookings" element={<BookingHistory />} />
          <Route path="/user/saved-pandits" element={<SavedPandits />} />
          <Route path="/pandit-onboarding" element={<PanditOnboarding />} />
        </Route>

        {/* Pandit Routes */}
        <Route path="/pandit" element={<PanditLayout />}>
          <Route path="dashboard" element={<PanditDashboard />} />
          <Route path="profile" element={<PanditProfilePage />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="inbox" element={<PanditChatInbox />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pandits" element={<AdminPandits />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/new" element={<AdminServiceForm />} />
          <Route path="services/:id" element={<AdminServiceForm />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="banner" element={<AdminBannerEditor />} />
        </Route>
      </Routes>
      {user && (
        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      )}
    </Suspense>
  );
}

export default App;
