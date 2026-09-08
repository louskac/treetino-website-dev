import { useEffect, useRef, useState } from 'react';
import { useMap3D, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';
import { useI18n } from '../i18n';

interface AddressSearchProps {
    onPlaceSelect?: (lat: number, lng: number) => void;
    className?: string;
}

export default function AddressSearch({ onPlaceSelect, className }: AddressSearchProps) {
    const { t } = useI18n();
    const inputRef = useRef<HTMLInputElement>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const placesLib = useMapsLibrary('places');
    const map3D = useMap3D();

    useEffect(() => {
        if (!placesLib || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        };

        const newAutocomplete = new placesLib.Autocomplete(inputRef.current, options);
        setAutocomplete(newAutocomplete);
    }, [placesLib]);

    useEffect(() => {
        if (!autocomplete || !map3D) return;

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            onPlaceSelect?.(lat, lng);

            if (typeof map3D.flyCameraTo === 'function') {
                map3D.flyCameraTo({
                    endCamera: {
                        center: { lat, lng, altitude: 500 },
                        tilt: 65,
                        heading: 45,
                        range: 1000
                    },
                    durationMillis: 2000
                });
            } else {
                map3D.center = { lat, lng, altitude: 500 };
            }
        });

        return () => {
            if (listener) {
                google.maps.event.removeListener(listener);
            }
        };
    }, [autocomplete, map3D]);

    return (
        <div className={`relative group ${className || ''}`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-[#183d89] transition-colors">
                <Search className="w-4 h-4" />
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder={t('common.searchAddressPlaceholder')}
                className="w-full bg-slate-50 border border-black/15 text-slate-900 text-xs rounded-xl focus:ring-1 focus:ring-[#183d89] focus:border-[#183d89] focus:bg-white block pl-9 pr-3 py-2 shadow-inner outline-none transition-all placeholder-slate-400 font-mono"
            />
        </div>
    );
}
