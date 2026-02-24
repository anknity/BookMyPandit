export function PrivacyPolicy() {
    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 pt-24 pb-24 min-h-[calc(100vh-6rem)]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-6">Privacy Policy</h1>
                <p className="text-slate-500 mb-8">Last Updated: February 20, 2026</p>

                <div className="prose prose-slate max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-slate-800">1. Information We Collect</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            When you use BookMyPandit, we collect information that identifies, relates to, describes, or could reasonably be linked with you, including your name, email address, phone number, and physical addresses for puja services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">2. How We Use Your Data</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            We use your data primarily to facilitate bookings, communicate with you regarding your scheduled services, send push notifications, and process payments securely. We do not sell your personal data to third-party marketers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">3. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            Your payment information is handled securely by our payment partners (Stripe/Razorpay) using 256-bit SSL encryption. We implement robust security measures to protect your account details and booking history.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">4. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact our support team via the Help Center.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
