import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinations } from '@/data/destinations';

export function DestinationDetails() {
    const { id } = useParams<{ id: string }>();
    const destination = destinations.find(d => d.id === id);

    const [wikiContent, setWikiContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!destination?.wikiTitle) return;

        const fetchWiki = async () => {
            setLoading(true);
            setError('');
            try {
                const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${destination.wikiTitle}&explaintext=1&format=json&origin=*`;
                const res = await fetch(url);
                const data = await res.json();

                const pages = data.query?.pages;
                if (!pages) throw new Error('No pages returned');

                const pageId = Object.keys(pages)[0];
                const extract = pages[pageId].extract;

                if (!extract) throw new Error('No extract found');
                setWikiContent(extract);
            } catch (err: any) {
                console.error('Wiki fetch error:', err);
                setError('Failed to load historical details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchWiki();
    }, [destination?.wikiTitle]);

    if (!destination) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-slate-50">
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">Destination Not Found</h1>
                <Link to="/" className="text-primary mt-4 font-bold hover:underline">Return Home</Link>
            </div>
        );
    }

    // Helper to split text into array of paragraphs
    const formatWikiContent = (text: string) => {
        // Basic formatting: split by double newlines, filter empty, ignoring == Sections ==
        return text.split('\n\n')
            .filter(p => p.trim())
            .map((p, idx) => {
                if (p.startsWith('==') && p.endsWith('==')) {
                    const title = p.replace(/=/g, '').trim();
                    return (
                        <h3 key={idx} className="text-3xl font-bold text-slate-800 mt-12 mb-6 font-serif border-b pb-2 border-slate-200/60 inline-block">
                            {title}
                        </h3>
                    );
                }

                // Add Drop Cap to the very first paragraph
                if (idx === 0) {
                    return (
                        <p key={idx} className="text-slate-700 mb-6 leading-relaxed text-lg font-serif tracking-wide text-justify indent-0 first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                            {p.trim()}
                        </p>
                    );
                }

                return (
                    <p key={idx} className="text-slate-700 mb-6 leading-relaxed text-lg font-serif tracking-wide text-justify indent-8">
                        {p.trim()}
                    </p>
                );
            });
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 font-sans pb-24">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] min-h-[400px]">
                <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="absolute top-24 left-4 md:left-8 z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Home
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-[1200px] mx-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {destination.tags.map((tag, idx) => (
                            <span key={idx} className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {tag.label}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight mb-2">
                        {destination.name}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined">location_on</span>
                        {destination.location}
                    </p>
                </div>
            </div>

            {/* Main Content (Classic Book Style) */}
            <div className="max-w-[900px] mx-auto px-4 mt-[-60px] relative z-20">
                {/* Book Cover / Pages styling */}
                <div className="bg-[#FAF9F6] rounded-t-sm p-8 md:p-14 shadow-2xl border-t-8 border-[#E5E0D5] relative overflow-hidden">
                    {/* Spine shading effect */}
                    <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

                    <div className="flex flex-col items-center justify-center mb-12 pb-10 border-b-2 border-dashed border-[#dcd7cb]">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1024px-Wikipedia-logo-v2.svg.png"
                            alt="Wikipedia"
                            className="w-12 h-12 object-contain opacity-60 mb-4 sepia-[0.3]"
                        />
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8C8473] font-serif">The Historical Archives</p>
                        <p className="text-xs italic text-[#A69E8F] font-serif mt-1">Excerpt from the Wikipedia Encyclopedia</p>
                    </div>

                    {loading ? (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="h-4 bg-[#E5E0D5] rounded w-full animate-pulse" />
                            <div className="h-4 bg-[#E5E0D5] rounded w-[90%] animate-pulse" />
                            <div className="h-4 bg-[#E5E0D5] rounded w-[95%] animate-pulse" />
                            <div className="h-4 bg-[#E5E0D5] rounded w-[80%] animate-pulse" />
                            <div className="h-8 bg-[#E5E0D5] rounded w-[30%] animate-pulse mt-12" />
                            <div className="h-4 bg-[#E5E0D5] rounded w-full animate-pulse" />
                            <div className="h-4 bg-[#E5E0D5] rounded w-[85%] animate-pulse" />
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 max-w-2xl mx-auto">
                            <span className="material-symbols-outlined">error</span>
                            <p className="font-medium font-serif">{error}</p>
                        </div>
                    ) : wikiContent ? (
                        <article className="prose prose-slate max-w-3xl mx-auto">
                            {formatWikiContent(wikiContent)}

                            {/* Decorative end mark */}
                            <div className="flex justify-center mt-16 mb-8 opacity-40">
                                <span className="material-symbols-outlined text-[#8C8473]">eco</span>
                            </div>
                        </article>
                    ) : (
                        <p className="text-slate-500 text-center font-serif italic">No content available in the archives.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
