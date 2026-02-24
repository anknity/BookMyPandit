import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { loginWithEmail, loginWithGoogle, sendPhoneOTP, verifyPhoneOTP } from '@/services/authService';
import { getRedirectPath } from '@/utils/roleCheck';
import type { ConfirmationResult } from 'firebase/auth';
import logo from '@/assets/logo.png';

type LoginMethod = 'email' | 'phone';

export function Login() {
    const [method, setMethod] = useState<LoginMethod>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await loginWithEmail(email, password);
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            const user = await loginWithGoogle();
            setUser(user);
            navigate(getRedirectPath(user.role));
        } catch (err: any) {
            setError(err.message || 'Google login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!phone || phone.length < 10) {
            setError('Please enter a valid phone number with country code (e.g. +91...)');
            return;
        }
        setIsLoading(true);
        try {
            const result = await sendPhoneOTP(phone, 'recaptcha-container');
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

    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative w-full">
            {/* Left Masked Dashed Grid */}
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

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src={logo} alt="BookMyPandit Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
                    <h1 className="text-3xl font-bold text-slate-900 font-display">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your BookMyPandit account</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-3xl p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Method Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setMethod('email'); setError(''); setOtpSent(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${method === 'email' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <span className="material-symbols-outlined text-lg">mail</span>
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMethod('phone'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${method === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <span className="material-symbols-outlined text-lg">phone_android</span>
                            Phone
                        </button>
                    </div>

                    {/* Email Login Form */}
                    {method === 'email' && (
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass} placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass} placeholder="••••••••" />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">login</span>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Phone Login Form */}
                    {method === 'phone' && !otpSent && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">phone</span>
                                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className={inputClass} placeholder="+91 98765 43210" />
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5 ml-1">Include country code (e.g. +91 for India)</p>
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">sms</span>
                                        Send OTP
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* OTP Verification Form */}
                    {method === 'phone' && otpSent && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="text-center mb-2">
                                <div className="size-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-green-600 text-2xl">mark_email_read</span>
                                </div>
                                <p className="text-sm text-slate-600">OTP sent to <span className="font-bold text-slate-800">{phone}</span></p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Enter 6-digit OTP</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">pin</span>
                                    <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className={`${inputClass} text-center tracking-[0.5em] text-lg font-mono`} placeholder="000000" />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">verified</span>
                                        Verify & Sign In
                                    </>
                                )}
                            </button>
                            <button type="button"
                                onClick={() => { setOtpSent(false); setOtp(''); setConfirmationResult(null); }}
                                className="w-full text-sm text-slate-500 hover:text-primary font-medium py-2 transition-colors">
                                ← Change phone number
                            </button>
                        </form>
                    )}

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs text-slate-400 font-medium uppercase">or continue with</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <button onClick={handleGoogleLogin} disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50">
                        <svg className="size-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>

                    <div id="recaptcha-container"></div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:text-orange-600 transition-colors">Create one</Link>
                </p>
            </div>
        </div>
    );
}
