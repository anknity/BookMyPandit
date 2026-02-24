import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1rem',
};

const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090
};

export function MapComponent({ lat, lng, pandits }: { lat?: number; lng?: number; pandits?: any[] }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || '',
    });

    const [map, setMap] = useState<any>(null);

    const onLoad = useCallback(function callback(map: any) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    const center = lat && lng ? { lat, lng } : defaultCenter;

    if (!apiKey || !isLoaded) {
        return (
            <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' fill=\'%233B82F6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 text-center">
                    <div className="size-16 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-3xl text-blue-600">map</span>
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Nearby Pandits Map</h3>
                    <p className="text-sm text-blue-600 mt-1">
                        {lat && lng ? `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Enable location to see nearby pandits'}
                    </p>
                    {pandits && pandits.length > 0 && (
                        <p className="text-sm text-blue-500 mt-2 font-medium">{pandits.length} pandits found nearby</p>
                    )}
                    <p className="text-xs text-blue-400 mt-3">Configure VITE_GOOGLE_MAPS_API_KEY for interactive map</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl overflow-hidden border border-slate-200">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {/* Current Location Marker */}
                {lat && lng && (
                    <Marker position={{ lat, lng }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
                )}

                {/* Pandit Markers */}
                {pandits?.map((pandit, index) => {
                    // Make sure pandit has lat/lng or generate mock ones around the user for display
                    const pLat = lat ? lat + (Math.random() - 0.5) * 0.05 : defaultCenter.lat + (Math.random() - 0.5) * 0.05;
                    const pLng = lng ? lng + (Math.random() - 0.5) * 0.05 : defaultCenter.lng + (Math.random() - 0.5) * 0.05;

                    return (
                        <Marker
                            key={pandit.id || index}
                            position={{ lat: pLat, lng: pLng }}
                            title={pandit.name || 'Pandit'}
                        />
                    );
                })}
            </GoogleMap>
        </div>
    );
}
