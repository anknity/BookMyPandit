import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/authService';
import { ImageUpload } from '@/components/common/ImageUpload';
import { SmartStats } from '@/components/user/SmartStats';
import { EventCalendar } from '@/components/user/EventCalendar';
import api from '@/config/api';
import { toast } from 'react-hot-toast';

export function UserProfile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update failed', error);
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <Link to="/login" className="text-primary hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Fallback for avatar
  const avatarUrl = user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGmPLFfMAefuu-JSIOu3-QuczGWdV3osF2cmeJkHVoOSW8Q5dZl-bCDxBRWKpymkgMC2MA9RPBUZo_Dc0Zmn_56IMxzkzESGjbicEUNlcti6QtADDKBsz6mmJ42TcARRdmutv10O-3cwQOdLnzQE3CItKnNOsi_0DwTf2sGS3lM2wsut-kw2wwO02fMPpeuP5m482GEvh6xdu9hBTxXumyXQ_XOvTBUJ8lBGk8x8_V0wz5-h1rt9vD42VE0GRS6t6m6-AaBEg2lb8";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 pt-24">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="glass-card rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 relative mb-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-primary p-1 shadow-lg shadow-orange-200 overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-primary border-2 border-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <ImageUpload
                      onUpload={(url) => {
                        // Update user profile via API
                        api.put('/auth/profile', { avatar_url: url }).then(({ data }) => {
                          setUser(data.user);
                          toast.success('Avatar updated');
                        });
                      }}
                      label=""
                      className="w-8 h-8 opacity-0 hover:opacity-100 absolute inset-0 cursor-pointer"
                      shape="circle"
                    />
                    <div className="bg-white rounded-full p-1 shadow-md border border-slate-200 cursor-pointer pointer-events-none">
                      <span className="material-symbols-outlined text-sm text-slate-600">edit</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-500 truncate w-full text-center">{user.email}</p>
                <span className="mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full capitalize border border-slate-200">
                  {user.role}
                </span>
              </div>

              <nav className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold transition-colors text-left">
                  <span className="material-symbols-outlined">person</span>
                  Profile Details
                </button>
                {user.role === 'pandit' && (
                  <Link to="/pandit/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-orange-600 font-bold transition-colors text-left">
                    <span className="material-symbols-outlined">dashboard</span>
                    Pandit Dashboard
                  </Link>
                )}
                <Link to="/user/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-colors text-left">
                  <span className="material-symbols-outlined">history</span>
                  Booking History
                </Link>
                <Link to="/user/saved-pandits" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-colors text-left">
                  <span className="material-symbols-outlined">favorite</span>
                  Saved Pandits
                </Link>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-colors text-left">
                  <span className="material-symbols-outlined">settings</span>
                  Settings
                </button>
                <div className="h-px bg-slate-200 my-2"></div>
                <Link to="/terms" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors text-left text-sm">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors text-left text-sm">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                  Privacy Policy
                </Link>
                <div className="h-px bg-slate-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors text-left w-full"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-2xl p-8 bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-500 font-semibold text-sm hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-slate-800 font-medium text-lg border-b border-slate-200 pb-2">{user.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-slate-800 font-medium text-lg border-b border-slate-200 pb-2 bg-slate-50/50 cursor-not-allowed text-slate-500">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-slate-800 font-medium text-lg border-b border-slate-200 pb-2">{user.phone || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                <p className="text-slate-800 font-medium text-lg border-b border-slate-200 pb-2 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Become a Pandit CTA */}
          {user.role === 'user' && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 shadow-lg shadow-orange-200 text-white">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-9xl">temple_hindu</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Are you a qualified Pandit?</h3>
                <p className="mb-6 max-w-lg text-orange-50 font-medium">
                  Join our platform to reach thousands of devotees. Manage your bookings, set your rates, and grow your spiritual service.
                </p>
                <Link
                  to="/pandit-onboarding"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-md"
                >
                  Become a Pandit
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

          <SmartStats />
          <EventCalendar />

          <div className="glass-card rounded-2xl p-8 bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Saved Addresses</h2>
              <button className="flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
                <span className="material-symbols-outlined text-sm">add</span>
                Add New
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 text-center text-slate-500 text-sm">
                No addresses saved yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
