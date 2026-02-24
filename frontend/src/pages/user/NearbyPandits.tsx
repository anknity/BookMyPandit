import { useState, useEffect } from 'react';
import { MapComponent } from '@/components/user/MapComponent';
import { PanditCard } from '@/components/user/PanditCard';
import { getCurrentLocation } from '@/utils/locationHelper';

// TODO: Fetch real pandits based on location from backend
const PANDITS: any[] = [];

export function NearbyPandits() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentLocation()
            .then(setLocation)
            .catch(() => setLocation({ lat: 28.6139, lng: 77.2090 })) // Default: Delhi
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Nearby Pandits</h2>
                <p className="text-slate-500 mt-1">Find verified pandits near your location</p>
            </div>

            <MapComponent lat={location?.lat} lng={location?.lng} pandits={PANDITS} />

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Available Pandits</h3>
                {PANDITS.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No pandits found nearby</p>
                ) : (
                    PANDITS.map((pandit) => (
                        <div key={pandit.id} className="relative">
                            <PanditCard {...pandit} />
                            <span className="absolute top-4 right-16 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{pandit.distance}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
