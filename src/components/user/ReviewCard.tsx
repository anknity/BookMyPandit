interface ReviewCardProps {
    userName: string;
    rating: number;
    comment: string;
    date: string;
    avatarUrl?: string;
}

export function ReviewCard({ userName, rating, comment, date, avatarUrl }: ReviewCardProps) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-100 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                    {avatarUrl ? <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" /> : userName[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{userName}</h4>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`material-symbols-outlined text-[14px] ${star <= rating ? 'filled text-amber-400' : 'text-slate-200'}`}>star</span>
                        ))}
                        <span className="text-xs text-slate-400 ml-2">{date}</span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{comment}</p>
        </div>
    );
}
