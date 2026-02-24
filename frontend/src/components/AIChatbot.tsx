import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguageStore();

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = language === 'hi'
                ? "नमस्ते! मैं पंडितजी AI हूँ। मैं आपके राशिफल, मुहूर्त और भविष्य के बारे में सवालों के जवाब दे सकता हूँ। आप क्या जानना चाहते हैं?"
                : "Namaste! I am BookMyPandit AI. I can answer questions about your horoscope, muhurats, and future predictions based on Vedic Astrology. What would you like to know?";

            setMessages([{ role: 'assistant', content: greeting }]);
        }
    }, [isOpen, messages.length, language]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to UI immediately
        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/astrology/chat`, {
                message: userMessage,
                history: messages // pass previous conversation history to AI context
            });

            if (response.data && response.data.success) {
                setMessages([...newMessages, { role: 'assistant', content: response.data.data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: "Apologies, my vision is cloudy right now. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...newMessages, { role: 'assistant', content: "Apologies, the cosmic servers are unreachable. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div className={cn(
                "bg-white w-[350px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4 flex flex-col",
                isOpen ? "scale-100 opacity-100 h-[500px] max-h-[70vh]" : "scale-0 opacity-0 h-0 border-none"
            )}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-orange-400 p-4 shrink-0 flex items-center justify-between text-white shadow-md relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                            <span className="material-symbols-outlined text-white">psychology</span>
                        </div>
                        <div>
                            <h3 className="font-bold font-display leading-tight">BookMyPandit AI</h3>
                            <p className="text-[10px] uppercase font-bold text-white/80 tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> App Powered
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn(
                            "flex flex-col max-w-[85%]",
                            msg.role === 'user' ? "self-end items-end" : "self-start items-start"
                        )}>
                            <div className={cn(
                                "p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm w-full break-words",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white rounded-tr-sm"
                                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
                            )}>
                                <div
                                    className={cn(
                                        "flex flex-col space-y-2.5",
                                        "[&>p]:m-0 [&>p]:leading-relaxed",
                                        "[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:m-0 [&>ul>li]:pl-1 [&>ul>li]:mb-1 last:[&>ul>li]:mb-0",
                                        "[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:m-0 [&>ol>li]:pl-1 [&>ol>li]:mb-1 last:[&>ol>li]:mb-0",
                                        "[&>strong]:font-semibold [&>strong]:text-slate-900",
                                        msg.role === 'user' ? "[&>strong]:text-white" : ""
                                    )}
                                >
                                    <ReactMarkdown>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="self-start items-start flex max-w-[85%]">
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-primary/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={language === 'hi' ? "बुकमायपंडित से पूछें..." : "Ask BookMyPandit..."}
                            className="bg-transparent border-none outline-none resize-none flex-1 max-h-32 min-h-[40px] px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                        >
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full bg-slate-900 hover:bg-primary text-white shadow-2xl flex items-center justify-center transition-all duration-300 border-[3px] border-white z-50",
                    isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100 hover:scale-110 shadow-orange-900/20 hover:shadow-orange-500/30"
                )}
            >
                <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
            </button>
        </div>
    );
}
