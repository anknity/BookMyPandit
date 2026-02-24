import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'BookMyPandit',
    supportEmail: 'support@bookmypandit.com',
    currency: 'INR',
    currencySymbol: '₹',
    autoApprovePandits: false,
    platformCommission: 15,
    minPanditExperience: 2,
    allowUserReviews: true,
    requireVerification: true,
    registrationOpen: true,
    maintenanceMode: false,
    socialLogin: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully! 🙏');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'pandits', label: 'Pandits', icon: 'diversity_1' },
    { id: 'users', label: 'Users', icon: 'group' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ];

  return (
    <div className="flex-1 min-w-0 pb-10 px-4 md:px-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure platform-wide permissions and details</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          {saving ? (
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="glass-panel rounded-2xl p-2 bg-white border border-slate-100 shadow-sm sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-orange-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          <div className="glass-panel bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">

            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-blue-50 text-blue-500 rounded-lg material-symbols-outlined">public</span>
                  Platform Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Platform Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Currency Code</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary outline-none bg-white"
                    >
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div>
                      <h4 className="font-bold text-slate-800">Maintenance Mode</h4>
                      <p className="text-xs text-slate-500">Temporarily disable public access to the platform</p>
                    </div>
                    <button
                      onClick={() => handleToggle('maintenanceMode')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.maintenanceMode ? "bg-red-500" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pandits' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-orange-50 text-orange-500 rounded-lg material-symbols-outlined">diversity_3</span>
                  Pandit Management Rules
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Platform Commission (%)</label>
                    <input
                      type="number"
                      value={settings.platformCommission}
                      onChange={(e) => handleInputChange('platformCommission', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Min. Experience (Years)</label>
                    <input
                      type="number"
                      value={settings.minPanditExperience}
                      onChange={(e) => handleInputChange('minPanditExperience', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Auto-Approve Applications</h4>
                      <p className="text-xs text-slate-500">Automatically approve new Pandit registrations</p>
                    </div>
                    <button
                      onClick={() => handleToggle('autoApprovePandits')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.autoApprovePandits ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.autoApprovePandits ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-green-50 text-green-500 rounded-lg material-symbols-outlined">person_pin</span>
                  User Experience & Permissions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Allow Public Reviews</h4>
                      <p className="text-xs text-slate-500">Users can rate and review services</p>
                    </div>
                    <button
                      onClick={() => handleToggle('allowUserReviews')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.allowUserReviews ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.allowUserReviews ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Public Registration</h4>
                      <p className="text-xs text-slate-500">Allow new users to sign up independently</p>
                    </div>
                    <button
                      onClick={() => handleToggle('registrationOpen')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.registrationOpen ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.registrationOpen ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Social Auth Integration</h4>
                      <p className="text-xs text-slate-500">Enable Google / Facebook login options</p>
                    </div>
                    <button
                      onClick={() => handleToggle('socialLogin')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.socialLogin ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.socialLogin ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-purple-50 text-purple-500 rounded-lg material-symbols-outlined">security</span>
                  Security & Verification
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Require Email Verification</h4>
                      <p className="text-xs text-slate-500">Users must verify email before booking</p>
                    </div>
                    <button
                      onClick={() => handleToggle('requireVerification')}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                        settings.requireVerification ? "bg-primary" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform",
                        settings.requireVerification ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-blue-500">info</span>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        Security settings are applied globally. Any change to verification requirements will affect new users immediately and existing unverified users on their next action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
