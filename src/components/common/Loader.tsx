export function Loader({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
    const sizeClasses = { sm: 'size-6', md: 'size-10', lg: 'size-16' };
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className={`${sizeClasses[size]} border-4 border-slate-200 border-t-primary rounded-full animate-spin`}></div>
            {text && <p className="text-sm text-slate-500 animate-pulse">{text}</p>}
        </div>
    );
}
