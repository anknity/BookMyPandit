import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface Pandit {
  id: string;
  user_id: string;
  users: { name: string; avatar_url: string; email: string; phone: string };
  rating: number;
  pandit_services: { custom_price: number }[];
}

const PLATFORM_FEE = 99;
const GST = 18;
const SAMAGRI_PRICE = 1500;

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / Net Banking', sub: 'PhonePe, GPay, Paytm, NEFT', icon: 'account_balance' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay', icon: 'credit_card' },
  { id: 'cash', label: 'Cash on Service', sub: 'Pay in cash when pandit arrives', icon: 'payments' },
];

export function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!state?.puja) navigate('/pujas');
  }, [state, navigate]);

  const bookingData = state || {};
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [selectedPandit, setSelectedPandit] = useState<Pandit | null>(null);
  const [loadingPandits, setLoadingPandits] = useState(true);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        if (!bookingData.puja?.id) return;

        // 1. Try to fetch pandits strictly mapped to this service
        let { data } = await api.get(`/pandits?service=${bookingData.puja.id}`);
        let fetchedPandits = data?.pandits || [];

        // 2. Fallback: If no strict matches, fetch all verified pandits
        if (fetchedPandits.length === 0) {
          const fallbackRes = await api.get('/pandits');
          fetchedPandits = fallbackRes.data?.pandits || [];
        }

        setPandits(fetchedPandits);

        // Auto-select if only 1 is available
        if (fetchedPandits.length === 1) {
          setSelectedPandit(fetchedPandits[0]);
        }
      } catch (err: any) {
        console.error('Failed to load pandits:', err);
        toast.error('Failed to find pandits for this puja');
      } finally {
        setLoadingPandits(false);
      }
    };
    fetchPandits();
  }, [bookingData.puja?.id]);

  // Price calculation
  const basePrice = selectedPandit?.pandit_services?.[0]?.custom_price || Number(bookingData.puja?.base_price) || 0;
  const samagriAmount = bookingData.includeSamagri ? SAMAGRI_PRICE : 0;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const { data } = await api.post('/bookings/validate-coupon', {
        code: couponCode,
        amount: basePrice
      });
      setAppliedCoupon(data.coupon);
      setCouponDiscount(data.discountAmount);
      toast.success('Coupon applied successfully!');
    } catch (error: any) {
      setCouponError(error.response?.data?.error || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
  };

  const subtotal = basePrice - couponDiscount;
  const totalPrice = Math.max(subtotal + samagriAmount + PLATFORM_FEE + GST, 0);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: '/checkout', bookingData } });
      return;
    }
    if (!selectedPandit) { toast.error('Please select a pandit'); return; }
    if (!address.trim()) { toast.error('Venue address is required'); return; }

    try {
      setIsProcessing(true);
      // 1. Create the booking in DB
      const { data: bookingRes } = await api.post('/bookings', {
        pandit_id: selectedPandit.id,
        service_id: bookingData.puja.id,
        date: bookingData.date,
        time_slot: bookingData.timeSlot,
        address,
        notes,
        payment_method: paymentMethod,
        include_samagri: bookingData.includeSamagri,
        coupon_code: appliedCoupon?.code,
      });

      const { booking } = bookingRes;

      // 2. If Cash, navigate immediately
      if (paymentMethod === 'cash') {
        navigate('/confirmation', {
          state: {
            booking: booking,
            priceBreakdown: booking.price_breakdown,
            paymentMethod,
            pujaImage: bookingData.puja.image_url,
            pujaName: bookingData.puja.name,
          }
        });
        toast.success('Booking confirmed! 🙏');
        return;
      }

      // 3. For online payments (UPI, Card), trigger Razorpay flow
      const { data: orderData } = await api.post('/payments/razorpay', {
        booking_id: booking.id,
        amount: totalPrice,
      });

      const RPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_your_razorpay_key';

      const options = {
        key: RPAY_KEY,
        amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: orderData.currency,
        name: 'BookMyPandit Booking',
        description: `Booking for ${bookingData.puja.name}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3593/3593678.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 4. Verify Payment Integrity via Backend
          try {
            await api.post('/payments/razorpay/verify', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.success('Payment successful & Booking confirmed! 🙏');
            navigate('/confirmation', {
              state: {
                booking: booking,
                priceBreakdown: booking.price_breakdown,
                paymentMethod,
                pujaImage: bookingData.puja.image_url,
                pujaName: bookingData.puja.name,
              }
            });
          } catch (err) {
            console.error('Payment Verification Failed', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#f97316' // Tailwind primary orange
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData.puja) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8 pb-32 pt-10 min-h-screen">
      {/* Header */}
      <div className="mb-1">
        <Link to={`/pujas/${bookingData.puja.id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-1 transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Details
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Your Booking</h1>
        <p className="text-slate-500 mt-1">{bookingData.puja.name} · {new Date(bookingData.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Step 1: Pandit Selection */}
          {!selectedPandit && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">1</span>
                Choose Your Pandit
              </h2>
              {loadingPandits ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
              ) : pandits.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-300 block mb-2">person_off</span>
                  <p className="text-slate-500">No pandits available for this service right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pandits.map((p) => (
                    <button key={p.id} onClick={() => setSelectedPandit(p)}
                      className="cursor-pointer group text-left bg-white border-2 border-slate-200 hover:border-primary rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-orange-100/50">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.users?.name || 'P')}&background=f97316&color=fff`}
                          alt={p.users?.name} className="size-14 rounded-full object-cover border-2 border-slate-100 group-hover:border-primary/20 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{p.users?.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-yellow-500 mt-0.5">
                            <span className="material-symbols-outlined text-base">star</span>
                            <span className="font-medium text-slate-700">{p.rating || 'New'}</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                      </div>
                      {p.pandit_services?.[0]?.custom_price > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                          <span className="text-slate-500">Custom Price</span>
                          <span className="font-bold text-primary">₹{p.pandit_services[0].custom_price.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Selected Pandit + Address */}
          {selectedPandit && (
            <>
              {/* Selected Pandit Card */}
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 relative shadow-sm">
                <div className="absolute top-4 right-4">
                  <button onClick={() => setSelectedPandit(null)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Change
                  </button>
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-[10px]">✓</span>
                  Pandit Selected
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPandit.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPandit.users?.name || 'P')}&background=f97316&color=fff`}
                    alt="Pandit" className="size-16 rounded-full object-cover ring-2 ring-primary/30" />
                  <div>
                    <p className="text-slate-900 font-bold text-lg leading-tight">{selectedPandit.users?.name}</p>
                    <p className="text-slate-500 text-sm mt-0.5">Performing: <span className="font-semibold text-primary">{bookingData.puja.name}</span></p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                        {new Date(bookingData.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span className="flex items-center gap-1 capitalize">
                        <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                        {bookingData.timeSlot?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address & Notes */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">2</span>
                  Venue & Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Venue Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none transition-all text-sm"
                      placeholder="House/Flat No., Street, City, Pincode..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Special Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none transition-all text-sm"
                      placeholder="Any specific requirements or instructions..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Summary & Payment */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">

          {/* Puja Summary Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            {bookingData.puja.image_url ? (
              <img src={bookingData.puja.image_url} alt={bookingData.puja.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">temple_hindu</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">{bookingData.puja.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{bookingData.puja.category} · {bookingData.puja.duration}</p>
              <span className="inline-block mt-1 text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full capitalize">
                {bookingData.timeSlot?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">local_activity</span>
              Apply Coupon
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-700 uppercase">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600 font-medium">Saved ₹{couponDiscount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase pr-2">
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupan code"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase placeholder:normal-case placeholder:font-normal focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplyingCoupon}
                    className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/80">
            <h3 className="text-base font-bold text-slate-800 mb-4">Price Breakdown</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">temple_hindu</span>
                  Service Fee
                </span>
                <span className="font-medium">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium bg-green-50/50 p-2 -mx-2 rounded-lg">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">local_offer</span>
                    Coupon ({appliedCoupon.code})
                  </span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {bookingData.includeSamagri && (
                <div className="flex justify-between text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">shopping_bag</span>
                    Samagri Kit
                  </span>
                  <span className="font-medium">₹{SAMAGRI_PRICE.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">receipt</span>
                  Platform Fee
                </span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">percent</span>
                  GST (18% on platform fee)
                </span>
                <span>₹{GST}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base py-3 border-t border-slate-100 mt-1">
                <span>Total Payable</span>
                <span className="text-primary text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Payment Method</label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                      paymentMethod === pm.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    )}>
                    <input type="radio" name="payment" value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="sr-only" />
                    <div className={cn(
                      'size-9 rounded-xl flex items-center justify-center flex-shrink-0',
                      paymentMethod === pm.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                    )}>
                      <span className="material-symbols-outlined text-[20px]">{pm.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-semibold', paymentMethod === pm.id ? 'text-primary' : 'text-slate-700')}>{pm.label}</p>
                      <p className="text-xs text-slate-400 truncate">{pm.sub}</p>
                    </div>
                    <div className={cn(
                      'size-4 rounded-full border-2 flex-shrink-0',
                      paymentMethod === pm.id ? 'border-primary bg-primary' : 'border-slate-300'
                    )} />
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedPandit || isProcessing}
              className="mt-5 w-full bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-200 hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">{paymentMethod === 'cash' ? 'payments' : 'lock'}</span>
                  {paymentMethod === 'cash' ? `Confirm Booking · ₹${totalPrice.toLocaleString('en-IN')}` : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </>
              )}
            </button>
            {paymentMethod === 'cash' && (
              <p className="text-xs text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm text-amber-500">info</span>
                You'll pay cash when the pandit arrives at your venue
              </p>
            )}
            {paymentMethod !== 'cash' && (
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secure 256-bit SSL Encrypted
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
