import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const PAYMENT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  upi: { label: 'Paid via UPI / Net Banking', icon: 'account_balance', color: 'text-green-600 bg-green-50 border-green-200' },
  card: { label: 'Paid via Card', icon: 'credit_card', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  cash: { label: 'Cash on Service', icon: 'payments', color: 'text-amber-600 bg-amber-50 border-amber-200' },
};

export function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const breakdown = state?.priceBreakdown;
  const paymentMethod = state?.paymentMethod || booking?.payment_method || 'upi';
  const pujaImage = state?.pujaImage || booking?.services?.image_url;
  const pujaName = state?.pujaName || booking?.services?.name || 'Puja Service';
  const panditName = booking?.pandits?.users?.name || 'Your Pandit';

  useEffect(() => {
    if (!booking) {
      toast.error('No booking details found');
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const pm = PAYMENT_LABELS[paymentMethod] ?? PAYMENT_LABELS.upi;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-slate-50 flex items-start justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-2xl space-y-5">

        {/* Success Hero */}
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-400 to-yellow-400" />
          <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-white shadow-inner flex items-center justify-center border-4 border-white">
              <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 mb-2">
            Booking Confirmed! 🙏
          </h1>
          <p className="text-slate-500 text-base">
            Namaste! Your divine experience with <span className="font-bold text-slate-800">{panditName}</span> is scheduled.
          </p>

          {/* Booking ID */}
          <div className="mt-5 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-sm text-slate-400">confirmation_number</span>
            <span className="text-xs text-slate-500 font-medium">Booking ID:</span>
            <span className="font-mono font-bold text-slate-800">#{booking.id?.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* Puja Service Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Service Details</h2>
          <div className="flex items-start gap-4">
            {pujaImage ? (
              <img src={pujaImage} alt={pujaName} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl text-primary">temple_hindu</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{pujaName}</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm text-slate-600">
                  <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                  {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-600 capitalize">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  {booking.time_slot?.replace('_', ' ')}
                </span>
              </div>
              {booking.address && (
                <div className="flex items-start gap-1 mt-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
                  <span className="line-clamp-2">{booking.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pandit Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Your Pandit</h2>
          <div className="flex items-center gap-4">
            <img
              src={booking.pandits?.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(panditName)}&background=f97316&color=fff`}
              alt={panditName}
              className="size-14 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <p className="font-bold text-slate-900 text-base">{panditName}</p>
              {booking.pandits?.users?.phone && (
                <a href={`tel:${booking.pandits.users.phone}`}
                  className="text-sm text-primary flex items-center gap-1 mt-0.5 hover:underline">
                  <span className="material-symbols-outlined text-sm">call</span>
                  {booking.pandits.users.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Payment Summary</h2>

          {breakdown ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Service Fee</span>
                <span>₹{breakdown.base_amount?.toLocaleString('en-IN')}</span>
              </div>
              {breakdown.samagri_amount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Samagri Kit</span>
                  <span>₹{breakdown.samagri_amount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Platform Fee</span>
                <span>₹{breakdown.platform_fee}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18% on platform fee)</span>
                <span>₹{breakdown.gst}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-3 border-t border-slate-100">
                <span>Total</span>
                <span className="text-primary">₹{breakdown.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span className="text-primary">₹{booking.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Payment Method Badge */}
          <div className={cn('mt-4 flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border', pm.color)}>
            <span className="material-symbols-outlined text-base">{pm.icon}</span>
            {pm.label}
            {paymentMethod === 'cash' && (
              <span className="ml-auto text-xs font-normal text-amber-600">Pay when pandit arrives</span>
            )}
          </div>
        </div>

        {/* Status Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">notifications_active</span>
          <div className="text-sm text-slate-700">
            <p className="font-semibold">What's next?</p>
            <p className="text-slate-500 mt-0.5">Your pandit will confirm the booking shortly. You'll receive a notification once confirmed.</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/user/bookings"
            className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:shadow-orange-300 transition-all">
            <span className="material-symbols-outlined">event_note</span>
            View My Bookings
          </Link>
          <Link to="/pujas"
            className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all">
            <span className="material-symbols-outlined">explore</span>
            Browse More Pujas
          </Link>
        </div>

        <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-sm">mail</span>
          A confirmation will be sent to your registered email.
        </p>
      </div>
    </div>
  );
}
