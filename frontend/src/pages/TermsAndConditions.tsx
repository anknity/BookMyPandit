export function TermsAndConditions() {
    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 pt-24 pb-24 min-h-[calc(100vh-6rem)]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-6">Terms and Conditions</h1>
                <p className="text-slate-500 mb-8">Last Updated: February 20, 2026</p>

                <div className="prose prose-slate max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-slate-800">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            Welcome to BookMyPandit. By accessing our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">2. Pandit Services</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            The platform acts as an intermediary connecting users with verified Pandits. While we vet all practitioners, the actual spiritual services are provided directly by the Pandits, who operate as independent service providers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">3. Booking and Payments</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            All bookings must be confirmed through our secure payment gateway. Cancellations made 24 hours prior to the scheduled service will receive a full refund. Cancellations made within 24 hours may be subject to a cancellation fee.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800">4. User Conduct</h2>
                        <p className="text-slate-600 leading-relaxed mt-2">
                            Users are expected to provide accurate venue details and treat our partner Pandits with respect. Any misuse of the platform or inappropriate behavior will result in immediate account termination.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
