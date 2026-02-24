import React, { useState, useEffect, useRef } from 'react';
import { socket } from '@/config/socket';
import { useAuthStore } from '@/store/authStore';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'astrologer';
    time: Date;
}

interface ActiveSession {
    roomId: string;
    userId: string;
    userName: string;
    userLocation?: string;
    userAvatar?: string;
    messages: Message[];
    lastMessageTime: Date;
    isCalling: boolean;
    unlocked: boolean;
}

export function PanditChatInbox() {
    const { user } = useAuthStore();
    const [sessions, setSessions] = useState<Record<string, ActiveSession>>({});
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user?.id) return;

        socket.connect();
        socket.emit('join_inbox', user.id);

        // Notify when a new chat request drops in
        socket.on('incoming_chat', (data: any) => {
            setSessions((prev) => {
                const existing = prev[data.roomId];
                if (!existing) {
                    // Create new session entry
                    // The pandit needs to actively join this room to send messages
                    socket.emit('join_chat', data.roomId);

                    return {
                        ...prev,
                        [data.roomId]: {
                            roomId: data.roomId,
                            userId: data.userId,
                            userName: data.userName,
                            userLocation: data.userLocation,
                            userAvatar: data.userAvatar,
                            messages: [{
                                id: Date.now().toString(),
                                text: data.firstMessage,
                                sender: 'user',
                                time: new Date()
                            }],
                            lastMessageTime: new Date(),
                            isCalling: false,
                            unlocked: false
                        }
                    };
                }
                return prev; // already exist via receive_message
            });
        });

        socket.on('receive_message', (data: any) => {
            if (data.sender === 'user') {
                setSessions((prev) => {
                    const session = prev[data.roomId];
                    if (!session) return prev; // If we don't know them, we can't receive it, wait for incoming_chat

                    return {
                        ...prev,
                        [data.roomId]: {
                            ...session,
                            messages: [...session.messages, {
                                id: data.id,
                                text: data.text,
                                sender: 'user',
                                time: new Date()
                            }],
                            lastMessageTime: new Date()
                        }
                    };
                });
            }
        });

        socket.on('call_signal', (data: any) => {
            setSessions((prev) => {
                const session = prev[data.roomId];
                if (!session) return prev;
                return {
                    ...prev,
                    [data.roomId]: { ...session, isCalling: true }
                };
            });
            // Note: Wait for backend call_ended event in real implementation
        });

        socket.on('chat_unlocked', (data: any) => {
            setSessions((prev) => {
                const session = prev[data.roomId];
                if (!session) return prev;
                return {
                    ...prev,
                    [data.roomId]: { ...session, unlocked: true }
                };
            });
        });

        return () => {
            socket.off('incoming_chat');
            socket.off('receive_message');
            socket.off('call_signal');
            socket.off('chat_unlocked');
            socket.disconnect();
        };
    }, [user]);

    const activeSession = activeRoomId ? sessions[activeRoomId] : null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeSession?.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeRoomId) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'astrologer',
            time: new Date(),
        };

        // Update local session
        setSessions((prev) => {
            const session = prev[activeRoomId];
            if (!session) return prev;
            return {
                ...prev,
                [activeRoomId]: {
                    ...session,
                    messages: [...session.messages, newUserMsg],
                    lastMessageTime: new Date()
                }
            };
        });
        setInputValue('');

        socket.emit('send_message', {
            roomId: activeRoomId,
            id: newUserMsg.id,
            text: newUserMsg.text,
            sender: 'astrologer'
        });
    };

    return (
        <div className="bg-white flex flex-col h-[calc(100vh-14rem)] rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <div className="flex flex-1 overflow-hidden h-full">
                {/* Sidebar: Active Sessions */}
                <div className="w-[300px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
                    {/* Sidebar Header (Empty/Reserved space in screenshot) */}
                    <div className="h-[60px] border-b border-orange-500 border-l-4"></div>

                    {Object.keys(sessions).length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No active chats</p>
                        </div>
                    ) : (
                        Object.values(sessions).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()).map((session) => (
                            <button
                                key={session.roomId}
                                onClick={() => setActiveRoomId(session.roomId)}
                                className={`w-full text-left p-4 hover:bg-orange-50/50 transition-colors flex gap-3 items-start ${activeRoomId === session.roomId ? 'bg-orange-50/50 border-l-4 border-orange-500' : 'border-l-4 border-transparent'}`}
                            >
                                <img
                                    src={session.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                                    alt={session.userName}
                                    className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-sm truncate pr-2">{session.userName}</h3>
                                        <span className="text-[10px] text-blue-400 font-medium whitespace-nowrap pt-1">
                                            {session.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mb-1">{session.userLocation || 'Location unknown'}</p>
                                    <p className="text-xs text-slate-600 truncate">{session.messages[session.messages.length - 1]?.text}</p>

                                    <div className="flex gap-2 mt-2">
                                        {session.isCalling && (
                                            <span className="inline-flex animate-pulse bg-green-100 text-green-700 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">Incoming Call</span>
                                        )}
                                        {session.unlocked && (
                                            <span className="inline-flex bg-orange-100 text-orange-700 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">PAID</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-[#F9FBFC] relative">
                    {activeSession ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 h-[70px] bg-white border-b border-slate-200 flex justify-between items-center z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={activeSession.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                                        alt={activeSession.userName}
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                    />
                                    <div>
                                        <h2 className="font-semibold text-slate-800 leading-tight">Chatting with {activeSession.userName}</h2>
                                        <p className="text-xs text-slate-500">{activeSession.userLocation || 'Location unknown'}</p>
                                    </div>
                                </div>
                                {activeSession.unlocked && <span className="text-orange-500 text-xs font-bold px-3 py-1 bg-orange-50 rounded flex items-center gap-1">Paid Session</span>}
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {activeSession.messages.map((msg) => {
                                    const isMe = msg.sender === 'astrologer';
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`px-4 py-3 max-w-[60%] flex flex-col shadow-sm border ${isMe ? 'bg-[#F98E2E] text-white border-[#F98E2E] rounded-2xl rounded-tr-md' : 'bg-white border-slate-200 text-slate-700 rounded-2xl rounded-tl-md'}`}>
                                                <p className="text-[15px]">{msg.text}</p>
                                                <span className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} className="h-2" />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                                <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your reply to the user..."
                                        className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="bg-[#F98E2E] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </form>
                            </div>

                            {/* Full Screen Call Overlay for Pandit */}
                            {activeSession.isCalling && (
                                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-40"></div>
                                        <div className="size-32 rounded-full bg-slate-800 border-4 border-green-500 flex items-center justify-center relative z-10 shadow-2xl">
                                            <span className="material-symbols-outlined text-6xl text-white">person</span>
                                        </div>
                                    </div>
                                    <h3 className="text-white text-3xl font-bold mb-2">{activeSession.userName} is Calling...</h3>
                                    <p className="text-green-400 font-medium mb-12">Incoming Audio Call</p>

                                    <div className="flex gap-8">
                                        <button className="bg-green-500 hover:bg-green-600 size-16 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-transform hover:scale-110 text-white">
                                            <span className="material-symbols-outlined text-3xl">call</span>
                                        </button>
                                    </div>
                                    <p className="text-white/50 text-xs mt-8">Note: Accept logic relies on real VoIP implementation.</p>
                                </div>
                            )}

                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                            <img src="https://illustrations.popsy.co/amber/online-chat.svg" alt="Chat" className="w-48 opacity-50 mb-4 grayscale" />
                            <p className="font-medium text-lg text-slate-500">Select a consultation to start messaging</p>
                            <p className="text-sm mt-2 max-w-sm">When a user initiates a chat request from the Astrology page, it will appear in your sidebar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
