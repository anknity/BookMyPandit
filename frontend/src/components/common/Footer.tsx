import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto hidden md:block relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 pr-4">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="BookMyPandit Logo" className="h-10 w-auto object-contain" />
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">BookMyPandit</h3>
                        </Link>
                        <p className="text-base text-slate-500 leading-relaxed max-w-sm">
                            Your trusted platform for booking verified pandits and spiritual services across India. Bringing divine blessings to your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                        <nav className="flex flex-col gap-4">
                            <Link to="/" className="text-slate-500 hover:text-primary transition-colors font-medium">Home</Link>
                            <Link to="/pujas" className="text-slate-500 hover:text-primary transition-colors font-medium">Book Puja</Link>
                            <Link to="/pandits" className="text-slate-500 hover:text-primary transition-colors font-medium">Find Pandits</Link>
                            <Link to="/astrology" className="text-slate-500 hover:text-primary transition-colors font-medium">Astrology</Link>
                        </nav>
                    </div>

                    {/* Support */}
                    <div className="lg:col-span-1">
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
                        <nav className="flex flex-col gap-4">
                            <Link to="/" className="text-slate-500 hover:text-primary transition-colors font-medium">Help Center</Link>
                            <a href="mailto:support@panditji.com" className="text-slate-500 hover:text-primary transition-colors font-medium">Contact Us</a>
                            <Link to="/privacy" className="text-slate-500 hover:text-primary transition-colors font-medium">Privacy Policy</Link>
                            <Link to="/terms" className="text-slate-500 hover:text-primary transition-colors font-medium">Terms of Service</Link>
                        </nav>
                    </div>

                    {/* Connect */}
                    <div className="lg:col-span-1">
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Connect</h4>
                        <div className="flex gap-4 mb-10 w-full justify-between sm:justify-start">
                            {/* Social Icons with precise styling matching screenshot */}
                            <a href="#" className="flex-shrink-0 size-10 rounded-full bg-white border border-[#E9EEF4] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm flex items-center justify-center">
                                <span className="font-bold text-[13px] text-[#556987] hover:text-primary transition-colors">F</span>
                            </a>
                            <a href="#" className="flex-shrink-0 size-10 rounded-full bg-white border border-[#E9EEF4] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm flex items-center justify-center">
                                <span className="font-bold text-[13px] text-[#556987] hover:text-primary transition-colors">T</span>
                            </a>
                            <a href="#" className="flex-shrink-0 size-10 rounded-full bg-white border border-[#E9EEF4] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm flex items-center justify-center">
                                <span className="font-bold text-[13px] text-[#556987] hover:text-primary transition-colors">I</span>
                            </a>
                            <a href="#" className="flex-shrink-0 size-10 rounded-full bg-white border border-[#E9EEF4] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm flex items-center justify-center">
                                <span className="font-bold text-[13px] text-[#556987] hover:text-primary transition-colors">Y</span>
                            </a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:support@panditji.com" className="group flex items-center gap-3 text-slate-600 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-colors">mail</span>
                                <span className="font-medium text-sm">support@bookmypandit.com</span>
                            </a>
                            <a href="tel:+919876543210" className="group flex items-center gap-3 text-slate-600 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-colors">call</span>
                                <span className="font-medium text-sm">+91 98765 43210</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-slate-200/80 bg-slate-100/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} BookMyPandit. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span>Made with</span>
                        <span className="material-symbols-outlined text-[16px] text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        <span>in India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
