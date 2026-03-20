import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { loginWithEmail, loginWithGoogle, sendPhoneOTP, verifyPhoneOTP, registerWithEmail } from '@/services/authService';
import { getRedirectPath } from '@/utils/roleCheck';
import type { ConfirmationResult } from 'firebase/auth';

type AuthTab = 'login' | 'signup';
type LoginMethod = 'email' | 'phone';

export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AuthTab>(location.pathname === '/register' ? 'signup' : 'login');
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

    // Shared State
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuthStore();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginPhone, setLoginPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    // Register State
    const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' });

    useEffect(() => {
        if (location.pathname === '/register') setActiveTab('signup');
        else if (location.pathname === '/login') setActiveTab('login');
    }, [location.pathname]);

    // Handle Tab Switch
    const handleTabChange = (tab: AuthTab) => {
        setActiveTab(tab);
        setError('');
        // Update URL to match
        window.history.pushState(null, '', tab === 'signup' ? '/register' : '/login');
    };

    // --- LOGIN LOGIC ---
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setIsLoading(true);
        try {
            const user = await loginWithEmail(loginEmail, loginPassword);
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!loginPhone || loginPhone.length < 10) {
            setError('Please enter a valid phone number with country code (e.g. +91...)');
            return;
        }
        setIsLoading(true);
        try {
            const result = await sendPhoneOTP(loginPhone, 'recaptcha-container');
            setConfirmationResult(result);
            setOtpSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!otp || otp.length < 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }
        if (!confirmationResult) {
            setError('Session expired. Please request a new OTP.');
            return;
        }
        setIsLoading(true);
        try {
            const user = await verifyPhoneOTP(confirmationResult, otp);
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- REGISTER LOGIC ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (regData.password !== regData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (regData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            const user = await registerWithEmail(regData.email, regData.password, regData.name, regData.role, regData.phone);
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- SHARED GOOGLE AUTH ---
    const handleGoogleAuth = async () => {
        setError(''); setIsLoading(true);
        try {
            const user = await loginWithGoogle(activeTab === 'signup' ? regData.role : 'user');
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Google authentication failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F9F9FA] focus:bg-white focus:border-[#E85C27] focus:ring-2 focus:ring-[#E85C27]/20 outline-none text-sm transition-all";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            {/* Left Masked Dashed Grid (Background) */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                    linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
                    repeating-linear-gradient(
                    to right,
                    black 0px,
                    black 3px,
                    transparent 3px,
                    transparent 8px
                    ),
                    repeating-linear-gradient(
                    to bottom,
                    black 0px,
                    black 3px,
                    transparent 3px,
                    transparent 8px
                    )
                `,
                    WebkitMaskImage: `
                    repeating-linear-gradient(
                    to right,
                    black 0px,
                    black 3px,
                    transparent 3px,
                    transparent 8px
                    ),
                    repeating-linear-gradient(
                    to bottom,
                    black 0px,
                    black 3px,
                    transparent 3px,
                    transparent 8px
                    )
                `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            <div className="w-full max-w-[1100px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[600px] relative z-10">

                {/* LEFT PANE - Branding */}
                <div className="md:w-[45%] bg-[#FFF3EE] relative overflow-hidden flex flex-col p-8 lg:p-12 justify-between">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-6 z-10">
                        <span className="bg-white text-[#E85C27] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            TOP RATED SERVICE
                        </span>
                    </div>

                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FCE5D9] rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>
                    <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#FCE5D9] rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>

                    {/* Abstract Lotus Shape */}
                    <svg className="absolute top-10 left-10 w-64 h-64 text-[#FFE5D9] opacity-80 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M42.7,-68.8C54,-61.7,60.9,-46.8,68.6,-32C76.3,-17.2,84.7,-2.4,85.2,13C85.7,28.4,78.2,44.4,67.2,57C56.1,69.5,41.4,78.7,24.6,83.8C7.8,88.9,-11.1,90,-28.9,85.1C-46.7,80.1,-63.3,69.1,-73.4,53.4C-83.5,37.8,-87,17.4,-84.9,-1.9C-82.9,-21.2,-75.4,-39.4,-63,-51.7C-50.6,-64,-33.4,-70.4,-17.5,-73.2C-1.5,-75.9,13.2,-75,28.6,-70L42.7,-68.8Z" transform="translate(100 100)" />
                    </svg>

                    <div className="relative z-10 flex-1 flex flex-col justify-end pb-8">
                        <div className="w-12 h-1 bg-[#E85C27] mb-6 rounded-full"></div>
                        <h1 className="text-4xl lg:text-[44px] leading-[1.15] font-extrabold text-[#111827] mb-4 font-display">
                            Connect with Divine Grace
                        </h1>
                        <p className="text-slate-600 leading-relaxed text-[15px] pr-4">
                            Book verified Pandits for pujas, rituals, and spiritual guidance from the comfort of your home.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User" />
                            <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User" />
                            <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800 leading-none mb-1">10,000+ Believers</p>
                            <p className="text-[10px] text-slate-500 leading-none">Trusted our spiritual services</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANE - Forms */}
                <div className="md:w-[55%] p-8 lg:p-14 flex flex-col justify-center relative">

                    <div className="max-w-md w-full mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-[28px] font-bold text-[#111827] mb-2 font-display">
                                {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
                            </h2>
                            <p className="text-[#6B7280] text-sm">
                                {activeTab === 'login' ? 'Step into your spiritual journey' : 'Begin your spiritual journey with us'}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-8 relative">
                            <button
                                onClick={() => handleTabChange('login')}
                                className={`flex-1 pb-3 text-sm font-bold transition-all relative ${activeTab === 'login' ? 'text-[#E85C27]' : 'text-slate-400 hover:text-slate-600'}`}>
                                Login
                                {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E85C27] rounded-t-full"></div>}
                            </button>
                            <button
                                onClick={() => handleTabChange('signup')}
                                className={`flex-1 pb-3 text-sm font-bold transition-all relative ${activeTab === 'signup' ? 'text-[#E85C27]' : 'text-slate-400 hover:text-slate-600'}`}>
                                Sign Up
                                {activeTab === 'signup' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E85C27] rounded-t-full"></div>}
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {/* ===================== LOGIN VIEW ===================== */}
                        {activeTab === 'login' && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                {/* Login Method Toggle (Hidden heavily in UI but needed for existing func) */}
                                <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                                        <input type="radio" checked={loginMethod === 'email'} onChange={() => { setLoginMethod('email'); setError(''); setOtpSent(false) }} className="accent-[#E85C27]" />
                                        Use Email
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                                        <input type="radio" checked={loginMethod === 'phone'} onChange={() => { setLoginMethod('phone'); setError(''); }} className="accent-[#E85C27]" />
                                        Use Phone
                                    </label>
                                </div>

                                {loginMethod === 'email' ? (
                                    <form onSubmit={handleEmailLogin} className="space-y-5">
                                        <div>
                                            <label className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] mb-2 uppercase tracking-wide">
                                                <span className="material-symbols-outlined text-[16px]">mail</span> Email
                                            </label>
                                            <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                                                className={inputClass} placeholder="Enter your registered email" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] uppercase tracking-wide">
                                                    <span className="material-symbols-outlined text-[16px]">lock</span> Password
                                                </label>
                                                <Link to="#" className="text-[#E85C27] text-xs font-bold hover:underline">Forgot?</Link>
                                            </div>
                                            <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                                                className={inputClass} placeholder="••••••••" />
                                        </div>

                                        <button type="submit" disabled={isLoading}
                                            className="w-full bg-[#E55A24] hover:bg-[#D54A14] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isLoading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
                                            {!isLoading && <span className="material-symbols-outlined animate-pulse">arrow_forward</span>}
                                        </button>
                                    </form>
                                ) : (
                                    /* Phone OTP Login */
                                    !otpSent ? (
                                        <form onSubmit={handleSendOTP} className="space-y-5">
                                            <div>
                                                <label className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] mb-2 uppercase tracking-wide">
                                                    <span className="material-symbols-outlined text-[16px]">phone_android</span> Phone Number
                                                </label>
                                                <input type="tel" required value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)}
                                                    className={inputClass} placeholder="+91 98765 43210" />
                                            </div>
                                            <button type="submit" disabled={isLoading}
                                                className="w-full bg-[#E55A24] hover:bg-[#D54A14] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                                {isLoading ? 'Wait...' : 'Send OTP'}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                                            <div>
                                                <label className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] mb-2 uppercase tracking-wide">
                                                    <span className="material-symbols-outlined text-[16px]">pin</span> Enter OTP sent to {loginPhone}
                                                </label>
                                                <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className={`${inputClass} tracking-widest text-center`} placeholder="000000" />
                                            </div>
                                            <button type="submit" disabled={isLoading}
                                                className="w-full bg-[#E55A24] hover:bg-[#D54A14] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                                {isLoading ? 'Wait...' : 'Verify & Sign In'}
                                            </button>
                                        </form>
                                    )
                                )}
                            </div>
                        )}

                        {/* ===================== SIGNUP VIEW ===================== */}
                        {activeTab === 'signup' && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    {/* Role Selector */}
                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                        <button type="button" onClick={() => setRegData({ ...regData, role: 'user' })}
                                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${regData.role === 'user' ? 'border-[#E85C27] bg-[#E85C27]/5 text-[#E85C27]' : 'border-slate-200 text-slate-500'}`}>
                                            <span className="material-symbols-outlined text-[18px]">person</span> Book Pujas
                                        </button>
                                        <button type="button" onClick={() => setRegData({ ...regData, role: 'pandit' })}
                                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${regData.role === 'pandit' ? 'border-[#E85C27] bg-[#E85C27]/5 text-[#E85C27]' : 'border-slate-200 text-slate-500'}`}>
                                            <span className="material-symbols-outlined text-[18px]">temple_hindu</span> Offer Services
                                        </button>
                                    </div>

                                    <div>
                                        <input type="text" required value={regData.name} onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                                            className={inputClass} placeholder="Full Name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="email" required value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                            className={inputClass} placeholder="Email Address" />
                                        <input type="tel" value={regData.phone} onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                                            className={inputClass} placeholder="Phone Number" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="password" required value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                            className={inputClass} placeholder="Password" />
                                        <input type="password" required value={regData.confirmPassword} onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                                            className={inputClass} placeholder="Confirm Password" />
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                        className="w-full bg-[#E55A24] hover:bg-[#D54A14] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 mt-2">
                                        {isLoading ? 'Creating...' : 'Create Account'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Shared Social Logins */}
                        <div className="mt-8">
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                <div className="relative bg-white px-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Or Continue With
                                </div>
                            </div>

                            <button onClick={handleGoogleAuth} disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors">
                                <svg className="size-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Google
                            </button>
                        </div>

                        {/* Empty container for recaptcha */}
                        <div id="recaptcha-container" className="mt-4"></div>

                        {/* Footer mobile view fallback */}
                        <div className="mt-8 text-center text-sm font-medium text-slate-500 pt-6 border-t border-slate-100">
                            {activeTab === 'login' ? (
                                <>New to BookMyPandit? <button onClick={() => handleTabChange('signup')} className="text-[#E85C27] font-bold">Create an account</button></>
                            ) : (
                                <>Already have an account? <button onClick={() => handleTabChange('login')} className="text-[#E85C27] font-bold">Sign in</button></>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
