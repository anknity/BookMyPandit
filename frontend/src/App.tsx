import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthChange } from '@/services/authService';
import api from '@/config/api';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PanditLayout } from '@/layouts/PanditLayout';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import PujaListing from '@/pages/public/PujaListing';
import { PujaDetail } from '@/pages/public/PujaDetail';
import { PanditSelection } from '@/pages/PanditSelection';
import { PanditProfile } from '@/pages/PanditProfile';
import { AstrologyPage } from '@/pages/AstrologyPage';
import { SearchResults } from '@/pages/public/SearchResults';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AstrologerChat } from '@/pages/public/AstrologerChat';
import { BookingConfirmation } from '@/pages/BookingConfirmation';
import { UserProfile } from '@/pages/UserProfile';
import { PanditOnboarding } from '@/pages/PanditOnboarding';
import { TermsAndConditions } from '@/pages/TermsAndConditions';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { DestinationDetails } from '@/pages/public/DestinationDetails';

// AI Chatbot
import { AIChatbot } from '@/components/AIChatbot';

// Auth Pages
import { useAuthStore } from '@/store/authStore';
import { useFCMToken } from '@/hooks/useFCMToken';
import { Login } from '@/pages/public/Login';
import { Register } from '@/pages/public/Register';

// User Pages
import { BookingHistory } from '@/pages/user/BookingHistory';
import { SavedPandits } from '@/pages/user/SavedPandits';

// Pandit Pages
import { PanditDashboard } from '@/pages/pandit/PanditDashboard';
import { PanditProfilePage } from '@/pages/pandit/PanditProfile';
import { ManageBookings } from '@/pages/pandit/ManageBookings';
import { Earnings } from '@/pages/pandit/Earnings';
import { PanditChatInbox } from '@/pages/pandit/PanditChatInbox';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { PanditManagement as AdminPandits } from '@/pages/admin/AdminPandits';
import { AdminServices } from '@/pages/admin/AdminServices';
import { AdminServiceForm } from '@/pages/admin/AdminServiceForm';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminRevenue } from '@/pages/admin/AdminRevenue';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { UserManagement } from '@/pages/admin/UserManagement';
import { CouponManagement } from '@/pages/admin/CouponManagement';
import { PaymentManagement } from '@/pages/admin/PaymentManagement';
import { ReportsManagement } from '@/pages/admin/ReportsManagement';
import { AdminBannerEditor } from '@/pages/admin/AdminBannerEditor';

function App() {
  const { setLoading, setUser } = useAuthStore();
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
    <>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Public Flow (with Top Navbar & Unified Styles) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/pujas" element={<PujaListing />} />
          <Route path="/pujas/:id" element={<PujaDetail />} />
          <Route path="/pandits" element={<PanditSelection />} />
          <Route path="/pandits/:id" element={<PanditProfile />} />
          <Route path="/search" element={<SearchResults />} />
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
      <AIChatbot />
    </>
  );
}

export default App;
