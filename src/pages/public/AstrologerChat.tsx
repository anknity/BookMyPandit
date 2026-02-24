import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from '@/config/socket';
import { useAuthStore } from '@/store/authStore';
import api from '@/config/api';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'astrologer';
    time: Date;
}

export function AstrologerChat() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const specificPanditId = queryParams.get('panditId');

    const { user } = useAuthStore();

    const [assignedPandit, setAssignedPandit] = useState<any>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const [callEnabled, setCallEnabled] = useState(false);
    const [isCalling, setIsCalling] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userMessageCount = messages.filter((m) => m.sender === 'user').length;
    const FREE_MESSAGES_LIMIT = 5;

    useEffect(() => {
        // Fetch available pandit or a specific one
        const fetchPandit = async () => {
            try {
                let pandit;

                if (specificPanditId) {
                    const { data } = await api.get(`/pandits/${specificPanditId}`);
                    pandit = data.pandit;
                } else {
                    const { data } = await api.get('/pandits');
                    if (data.pandits && data.pandits.length > 0) {
                        pandit = data.pandits[0]; // Auto-assign the first available pandit
                    }
                }

                if (pandit) {
                    setAssignedPandit(pandit);

                    const generatedRoomId = `chat_${user?.id || 'guest'}_pandit_${pandit.user_id}`;
                    setRoomId(generatedRoomId);

                    setMessages([{
                        id: '1',
                        text: `Hello! I am ${pandit.users?.name || 'Pandit'}. Welcome to BookMyPandit Astrology. How can I help you today?`,
                        sender: 'astrologer',
                        time: new Date(),
                    }]);
                } else {
                    toast.error('No astrologers currently available.');
                }
            } catch (err) {
                console.error("Failed to fetch pandit", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPandit();
    }, [user, specificPanditId]);

    useEffect(() => {
        if (!roomId) return;

        // Connect socket when component mounts
        socket.connect();
        socket.emit('join_chat', roomId);

        // Listen for new messages
        socket.on('receive_message', (data: any) => {
            // Because this is ephemeral, if it's from us, we already added it happily. 
            // So we only add if sender is astrologer (in a real app we'd compare senderId).
            if (data.sender === 'astrologer') {
                setMessages((prev) => [...prev, {
                    id: data.id,
                    text: data.text,
                    sender: 'astrologer',
                    time: new Date()
                }]);
            }
        });

        // Listen for unlock events
        socket.on('chat_unlocked', (data: any) => {
            setIsLocked(false);
            setHasPaid(true);
            setShowPaymentModal(false);
            if (data.type === 'call') setCallEnabled(true);
            toast.success('Chat Unlocked!');
        });

        // Listen for mock calls ringing
        socket.on('call_signal', (data: any) => {
            setIsCalling(true);
            setTimeout(() => {
                setIsCalling(false);
                toast('Call Ended', { icon: '📞' });
            }, 5000);
        });

        return () => {
            socket.off('receive_message');
            socket.off('chat_unlocked');
            socket.off('call_signal');
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        // Lock logic after 5 messages (increased from 2)
        if (userMessageCount >= FREE_MESSAGES_LIMIT && !hasPaid && !isLocked) {
            setTimeout(() => {
                setIsLocked(true);
                setShowPaymentModal(true);
            }, 1000);
        }
    }, [userMessageCount, hasPaid, isLocked]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLocked) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            time: new Date(),
        };

        // Update local state immediately for snappy UX
        setMessages((prev) => [...prev, newUserMsg]);
        setInputValue('');

        // Send to backend via Socket
        socket.emit('send_message', {
            roomId,
            id: newUserMsg.id,
            text: newUserMsg.text,
            sender: 'user',
            targetPanditId: assignedPandit?.user_id, // Essential: tells backend which pandit inbox to ping
            userId: user?.id || 'guest',
            userName: user?.name || 'Guest',
            userLocation: (user as any)?.city || 'Location unknown', // Pass location if available
            userAvatar: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
        });

        // Actual logic goes here (socket already emitted the message to backend/target pandit)
    };

    const handlePayment = async (type: 'chat' | 'call') => {
        if (!user) {
            toast.error('Please login to pay.');
            navigate('/login');
            return;
        }

        try {
            const amountCost = type === 'chat' ? 4 : 10;

            // 1. Create order on backend
            const { data: orderData } = await api.post('/payments/razorpay-chat', {
                amount: amountCost,
            });

            const RPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_your_key_here';

            // 2. Open Razorpay Checkbox
            const options = {
                key: RPAY_KEY,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'BookMyPandit Chat',
                description: `Unlock Premium ${type === 'chat' ? 'Chat' : 'Audio Call & Chat'}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment Signature
                        await api.post('/payments/razorpay-chat/verify', {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        // 4. Send socket signal globally to unlock
                        socket.emit('unlock_chat', { roomId, type });
                    } catch (err) {
                        toast.error('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.name || '',
                    email: user.email || '',
                    contact: user.phone || ''
                },
                theme: { color: '#f97316' }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (res: any) {
                toast.error(`Payment failed: ${res.error.description}`);
            });
            rzp.open();

        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to initiate payment.');
        }
    };

    const handleCall = () => {
        if (!callEnabled) {
            setShowPaymentModal(true);
            return;
        }

        // Broadcast the call signal to the other person
        socket.emit('call_signal', { roomId });

        setIsCalling(true);
        // Note: Real WebRTC or VoIP implementation needed here for MVP.
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative w-full pt-16 md:pt-20">
            {/* Background Grid */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #e7e5e4 1px, transparent 1px),
            linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 0',
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
                }}
            />

            {/* Main Chat Area */}
            <div className="relative z-10 flex-col flex flex-1 w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl md:my-6 md:rounded-3xl border border-slate-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </button>
                        <div className="relative">
                            <img
                                src={assignedPandit?.users?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCRQZAk1NOl0fM9bzNV5Tr9t2EXOHmCYXSR-AobE8pp8T93KJfxoRC8xd2OUe6K9v27vc5Mfpnw0QVMs9xBxq4dfB5H9oIDFbCCn1c-pdtn9ocX3-2G5LK_NeMkU5led-bYBNgy3GOwkWMUr52KL8Wxbn5T8ACiX2wfmyVbo58vmmCgWJWBoOL3l_QeGM8iZAv8dVQhnABWV5U0ea0QJvgSeV41tvoSwyjdgAjThkCerKZoOSMf4A1ANI7_M3bvKQ0SG3AlcjIgKDo"}
                                alt="Astrologer"
                                className="size-12 rounded-full object-cover border-2 border-primary/20"
                            />
                            <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg">{assignedPandit?.users?.name || 'Connecting...'}</h2>
                            <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Online
                            </p>
                        </div>
                    </div>

                    {/* Call Button */}
                    <button
                        onClick={handleCall}
                        aria-label="Audio Call"
                        className={`size-12 rounded-full flex items-center justify-center transition-all ${callEnabled
                            ? 'bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105 shadow-md shadow-green-200/50'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                    >
                        <span className="material-symbols-outlined text-2xl">call</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative hide-scrollbar">
                    <div className="text-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!isUser && (
                                        <img
                                            src={assignedPandit?.users?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCRQZAk1NOl0fM9bzNV5Tr9t2EXOHmCYXSR-AobE8pp8T93KJfxoRC8xd2OUe6K9v27vc5Mfpnw0QVMs9xBxq4dfB5H9oIDFbCCn1c-pdtn9ocX3-2G5LK_NeMkU5led-bYBNgy3GOwkWMUr52KL8Wxbn5T8ACiX2wfmyVbo58vmmCgWJWBoOL3l_QeGM8iZAv8dVQhnABWV5U0ea0QJvgSeV41tvoSwyjdgAjThkCerKZoOSMf4A1ANI7_M3bvKQ0SG3AlcjIgKDo"}
                                            alt="Pandit"
                                            className="size-8 rounded-full shadow-sm mb-1 object-cover"
                                        />
                                    )}
                                    <div className={`p-4 shadow-sm ${isUser
                                        ? 'bg-gradient-to-br from-primary to-orange-600 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                                        }`}>
                                        <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1.5 text-right font-medium ${isUser ? 'text-white/70' : 'text-slate-400'}`}>
                                            {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-2" />

                    {/* Lock Overlay within chat */}
                    {isLocked && (
                        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10 flex items-end justify-center pb-8">
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">lock</span>
                                Unlock Chat to Continue
                            </button>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 max-w-4xl mx-auto w-full sticky bottom-0 z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <button
                            type="button"
                            className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-100"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLocked}
                            placeholder={isLocked ? "Chat locked..." : "Type your message..."}
                            className="flex-1 bg-slate-100 border-none px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLocked}
                            className="p-3 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200 flex items-center justify-center h-12 w-12 shrink-0"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </form>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                                Premium Access
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <span className="material-symbols-outlined text-5xl text-primary mb-2">lock_open</span>
                                <h3 className="text-2xl font-bold text-slate-800">Unlock Consultation</h3>
                                <p className="text-slate-500 text-sm mt-2">Your {FREE_MESSAGES_LIMIT} free messages have ended. Pay to continue chatting or upgrade to a voice call.</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handlePayment('chat')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-primary/20 hover:border-primary bg-orange-50/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="bg-orange-100 text-primary p-2 rounded-xl">
                                            <span className="material-symbols-outlined">chat</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">Chat Only</h4>
                                            <p className="text-xs text-slate-500">Continue messaging</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-slate-800">₹4<span className="text-xs text-slate-400 font-medium">/min</span></span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handlePayment('call')}
                                    className="w-full relative flex items-center justify-between p-4 rounded-2xl border-2 border-green-200 hover:border-green-500 bg-green-50 overflow-hidden transition-all group"
                                >
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-bl-lg">
                                        Recommended
                                    </div>
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-green-600 transition-colors">Audio Call + Chat</h4>
                                            <p className="text-xs text-slate-500">Talk directly</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-slate-800">₹10<span className="text-xs text-slate-400 font-medium">/min</span></span>
                                    </div>
                                </button>
                            </div>

                            {/* Close Button, but typically they should pay. It's mock so let's allow close */}
                            {hasPaid ? (
                                <button onClick={() => setShowPaymentModal(false)} className="mt-6 w-full py-3 text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors">
                                    Close
                                </button>
                            ) : (
                                <button onClick={() => navigate(-1)} className="mt-6 w-full py-3 text-slate-400 hover:text-red-500 font-medium text-sm transition-colors">
                                    Cancel & Exit
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Incoming/Outgoing Call Overlay Mode (Mock) */}
                {isCalling && (
                    <div className="fixed inset-0 z-[60] bg-slate-900/90 flex flex-col items-center justify-center backdrop-blur-md">
                        <h2 className="text-white text-2xl font-bold mb-8">Calling Pandit Aacharya...</h2>
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRQZAk1NOl0fM9bzNV5Tr9t2EXOHmCYXSR-AobE8pp8T93KJfxoRC8xd2OUe6K9v27vc5Mfpnw0QVMs9xBxq4dfB5H9oIDFbCCn1c-pdtn9ocX3-2G5LK_NeMkU5led-bYBNgy3GOwkWMUr52KL8Wxbn5T8ACiX2wfmyVbo58vmmCgWJWBoOL3l_QeGM8iZAv8dVQhnABWV5U0ea0QJvgSeV41tvoSwyjdgAjThkCerKZoOSMf4A1ANI7_M3bvKQ0SG3AlcjIgKDo"
                                alt="Astrologer"
                                className="size-32 rounded-full object-cover border-4 border-green-500 relative z-10"
                            />
                        </div>
                        <button
                            onClick={() => setIsCalling(false)}
                            className="bg-red-500 hover:bg-red-600 text-white size-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        >
                            <span className="material-symbols-outlined text-3xl">call_end</span>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
