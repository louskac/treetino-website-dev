import { useCallback, useState, useEffect, useRef } from 'react';
import React from 'react';
import { APIProvider, Map3D, Marker3D, MapMode, AltitudeMode, Pin, useMap3D, Popover } from '@vis.gl/react-google-maps';
import { Globe } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { SelectedLocation, PinLocation, SpotPotential, Deal } from '../types';
import AddressSearch from './AddressSearch';
import { useI18n } from '../i18n';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string || 'DEMO_MAP_ID';
const HAS_KEY = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_key_here';

const INITIAL_VIEW = { lat: 50.0811, lng: 14.4512 }; // Prague (Supported 3D Mesh)


interface Props {
    selectedLocation: SelectedLocation | null;
    onLocationSelect: (loc: SelectedLocation) => void;
    onPinsChange?: (pins: PinLocation[]) => void;
    product?: string;
    allDeals?: Deal[];
    activeDeal?: Deal | null;
    onMapClick?: () => void;
    crmActive?: boolean;
}

export default function MapCanvas({ 
    onLocationSelect, 
    selectedLocation, 
    onPinsChange, 
    product,
    allDeals = [],
    activeDeal = null,
    onMapClick,
    crmActive = false
}: Props) {
    const [pins, setPins] = useState<PinLocation[]>(selectedLocation?.pins || []);
    const [searchPin, setSearchPin] = useState<{lat: number, lng: number} | null>(null);
    const [hoveredDealId, setHoveredDealId] = useState<number | null>(null);

    // Sync local pins with selected location
    useEffect(() => {
        if (selectedLocation) {
            setPins(selectedLocation.pins || []);
        } else {
            setPins([]);
        }
    }, [selectedLocation]);

    const handlePlaceSelect = useCallback((lat: number, lng: number) => {
        setSearchPin({ lat, lng });
        setTimeout(() => {
            setSearchPin(null);
        }, 10000);
    }, []);

    const handleClick = useCallback((e: any) => {
        if (!e.detail.latLng) return;
        const { lat, lng } = e.detail.latLng;
        
        const newPin: PinLocation = {
            id: uuidv4(),
            lat,
            lng,
            type: (product || 'main-tree') as any
        };
        
        const newPins = [...pins, newPin];
        setPins(newPins);
        onPinsChange?.(newPins);

        if (!selectedLocation) {
            onLocationSelect({
                lat: Math.round(lat * 10000) / 10000,
                lon: Math.round(lng * 10000) / 10000,
                pins: newPins,
                potential: undefined
            });
        }
    }, [pins, product, selectedLocation, onPinsChange, onLocationSelect]);

    const handleRemovePin = useCallback((id: string) => {
        const newPins = pins.filter(p => p.id !== id);
        setPins(newPins);
        onPinsChange?.(newPins);
    }, [pins, onPinsChange]);

    useEffect(() => {
        if (!HAS_KEY) return;
        const interval = setInterval(() => {
            const mapEl = document.querySelector('gmp-map-3d');
            if (mapEl && mapEl.shadowRoot) {
                if (!mapEl.shadowRoot.querySelector('#treetino-controls-style')) {
                    const style = document.createElement('style');
                    style.id = 'treetino-controls-style';
                    style.textContent = `
                        div[style*="right: 0"], div[style*="right: 10px"], div[style*="right: 16px"] {
                            right: 420px !important;
                        }
                        .gm-bundled-control, .gm-fullscreen-control, .gm-style-cc {
                            right: 420px !important;
                        }
                        .bottom.right, .top.right {
                            right: 420px !important;
                        }
                    `;
                    mapEl.shadowRoot.appendChild(style);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!HAS_KEY) {
        return <FallbackMap onClick={onMapClick} />;
    }

    // Filter deals that have saved coordinate configs only when in CRM mode
    const otherDeals = crmActive ? allDeals.filter(d => d.config && d.id !== activeDeal?.id) : [];
    const hoveredDeal = allDeals.find(d => d.id === hoveredDealId);

    return (
        <div className="absolute inset-0 map-container">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'maps3d', 'places']} version="alpha">
                <MapCameraController selectedLocation={selectedLocation} />
                


                <Map3D
                    defaultCenter={{ ...INITIAL_VIEW, altitude: 500 }}
                    defaultRange={1000}
                    defaultHeading={45}
                    defaultTilt={65}
                    mode={MapMode.SATELLITE}
                    onClick={(e: any) => {
                        // Prevent placing a unit if the user clicked on a marker
                        if (e.domEvent) {
                            const target = e.domEvent.target as HTMLElement;
                            if (target && target.closest && target.closest('gmp-marker-3d, gmp-marker-3d-interactive')) {
                                return;
                            }
                            const path = e.domEvent.path || (e.domEvent.composedPath && e.domEvent.composedPath());
                            if (path) {
                                const hasMarker = path.some((el: any) => 
                                    el.tagName && (
                                        el.tagName.toLowerCase() === 'gmp-marker-3d' || 
                                        el.tagName.toLowerCase() === 'gmp-marker-3d-interactive'
                                    )
                                );
                                if (hasMarker) return;
                            }
                        }

                        setHoveredDealId(null);
                        onMapClick?.();
                        const position = e.detail?.position;
                        if (!position) return;
                        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
                        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;
                        handleClick({ detail: { latLng: { lat, lng } } });
                    }}

                >
                    {/* Active Configuration Pins */}
                    {pins.map((pin) => (
                        <PinOverlay 
                            key={pin.id} 
                            pin={pin} 
                            potential={selectedLocation?.potential}
                            onRemove={() => handleRemovePin(pin.id)} 
                        />
                    ))}


                    {searchPin && (
                        <Marker3D
                            position={{ lat: searchPin.lat, lng: searchPin.lng }}
                            altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
                            drawsWhenOccluded={true}
                        >
                            <Pin
                                background="#ef4444"
                                borderColor="#b91c1c"
                                glyphColor="#ffffff"
                                scale={1.2}
                            />
                        </Marker3D>
                    )}
                </Map3D>
            </APIProvider>
        </div>
    );
}

function DealMarker({ 
    deal, 
    hoveredDealId, 
    setHoveredDealId 
}: { 
    deal: Deal; 
    hoveredDealId: number | null; 
    setHoveredDealId: (id: number | null) => void; 
}) {
    const { t, locale } = useI18n();
    const markerRef = useRef<any>(null);
    const config = deal.config!;

    useEffect(() => {
        const el = markerRef.current;
        if (!el) return;

        const handleOver = () => setHoveredDealId(deal.id);
        const handleOut = () => setHoveredDealId(null);

        el.addEventListener('pointerover', handleOver);
        el.addEventListener('pointerout', handleOut);

        return () => {
            el.removeEventListener('pointerover', handleOver);
            el.removeEventListener('pointerout', handleOut);
        };
    }, [deal.id, setHoveredDealId]);

    return (
        <React.Fragment>
            <Marker3D
                ref={markerRef}
                position={{ lat: config.lat, lng: config.lon, altitude: 0 }}
                altitudeMode={AltitudeMode.CLAMP_TO_GROUND}
                drawsWhenOccluded={true}
                onClick={(e: any) => {
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (e && e.preventDefault) e.preventDefault();
                    if (e && e.domEvent && e.domEvent.stopPropagation) e.domEvent.stopPropagation();
                    setHoveredDealId(hoveredDealId === deal.id ? null : deal.id);
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="68" viewBox="0 0 48 68" fill="none" style={{ pointerEvents: 'auto', cursor: 'pointer', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))' }}>
                    <line x1="24" y1="38" x2="24" y2="68" stroke="#183d89" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.85"/>
                    <circle cx="24" cy="20" r="18" fill="#ffffff" stroke="#183d89" strokeWidth="2.5"/>
                    <circle cx="24" cy="20" r="13" fill="#183d89" fillOpacity="0.08"/>
                    <circle cx="24" cy="20" r="6" fill="#183d89"/>
                </svg>
            </Marker3D>

            {hoveredDealId === deal.id && (
                <Popover
                    position={{ lat: config.lat, lng: config.lon, altitude: 15 }}
                >
                    <div 
                        className="p-5 w-76 text-left bg-white border border-black/10 rounded-2xl shadow-2xl text-slate-900"
                        style={{
                            pointerEvents: 'auto'
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] text-[9px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#183d89]" />
                                <span>{t('crm.savedOffer')}</span>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mb-1">{deal.client_name}</h3>
                        <p className="text-[11px] text-black/60 mb-3 leading-relaxed">
                            {t('crm.dealPartner')}: <span className="text-slate-900 font-semibold">{deal.partner_name}</span><br/>
                            {t('crm.dealSeller')}: <span className="text-slate-900 font-semibold">{deal.agent_name}</span>
                        </p>
                        
                        <div className="flex flex-col gap-2 bg-stone-50 p-3 rounded-xl border border-black/5">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-black/60 font-medium">{t('crm.dealStatus')}:</span>
                                <span className={`font-semibold uppercase text-[9px] px-2 py-0.5 rounded-md border ${
                                    deal.status === 'Won' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    deal.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                    deal.status === 'Lost' ? 'bg-stone-100 text-stone-600 border-stone-200' :
                                    'bg-blue-50 text-[#183d89] border-blue-200'
                                }`}>
                                    {deal.status === 'Won' ? t('crm.statusWon') :
                                     deal.status === 'Rejected' ? t('crm.statusRejected') :
                                     deal.status === 'Lost' ? t('crm.statusLost') :
                                     deal.status === 'In Progress' ? t('crm.statusInProgress') :
                                     deal.status === 'Stuck' ? t('crm.statusStuck') : t('crm.statusPrepared')}
                                </span>
                            </div>
                            {deal.config && (
                                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-black/5">
                                    <span className="text-black/60 font-medium">{t('analytics.totalInvestment')}:</span>
                                    <strong className="text-[#183d89] font-mono font-bold">
                                        {new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.config.total_price)}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </div>
                </Popover>
            )}
        </React.Fragment>
    );
}

function PinOverlay({ pin, potential, onRemove }: { pin: PinLocation, potential?: SpotPotential, onRemove: () => void }) {
    const [isHovered, setIsHovered] = useState(false);
    const markerRef = useRef<any>(null);

    const isSmall = pin.type === 'small-tree';
    const isTurbine = pin.type === 'standalone-turbine';

    const mainColor = isHovered ? "#ef4444" : (isSmall ? "#d97706" : (isTurbine ? "#0284c7" : "#183d89"));
    const bgColor = isHovered ? "#fef2f2" : "#ffffff";
    
    // Official Treetino Bionic Tree SVG Emblem Path
    const treetinoEmblemPath = "M25.78,66.53c.06.03.12.05.19.05h0,0s-.09,0-.19-.05ZM25.97,66.58l-.19-.05c1.63.87,3.6.82,5.18-.13,1.58-.95,2.55-2.66,2.55-4.51v-5.02c0-1.36-.73-2.62-1.9-3.29l-6.55-3.78c-1.99-1.15-3.45-3.05-4.04-5.27-.59-2.22-.29-4.58.86-6.57l11.01,6.35c.13.07.29.07.42,0,.13-.07.21-.21.21-.37v-23.79h8.67v12.16c0,.15.08.29.21.37.13.07.29.07.42,0l10.53-6.08c1.14,1.99,1.45,4.36.86,6.57-.6,2.22-2.05,4.12-4.05,5.27l-6.08,3.51c-1.18.68-1.9,1.94-1.9,3.29v16.65c0,4.89-2.57,9.42-6.76,11.94-4.19,2.52-9.4,2.65-13.71.36h0c-8.08-4.3-16.06-10.37-18.38-14.39-2.06-3.57-3.33-11.73-3.33-19.93s1.27-16.36,3.33-19.93c2.06-3.57,8.49-8.75,15.6-12.85C26.03,2.98,33.73,0,37.85,0s12.01,3.26,19.2,7.52c7.19,4.26,13.61,9.46,15.32,12.41,1.7,2.95,2.85,11.42,2.85,19.93s-1.15,16.98-2.85,19.93c-.78,1.36-2.46,3.17-4.82,5.08-4.38,3.54-11.35,7.81-17.47,10.81l-.05-.11c-2.03-4.19-.52-9.23,3.48-11.62,2.45-1.46,4.8-2.99,6.79-4.45,2.18-1.6,3.94-2.97,4.57-4.05.43-.74.67-2.07.93-3.71.52-3.29.77-7.59.77-11.88s-.25-8.6-.77-11.89c-.26-1.64-.5-2.97-.93-3.71-.54-.94-1.73-2.1-3.33-3.37-2.34-1.85-5.56-3.94-8.9-5.91-5.61-3.32-11.58-6.31-14.79-6.31s-9.06,2.73-14.59,5.92c-5.53,3.19-10.82,6.9-12.42,9.68s-2.17,9.21-2.17,15.6.56,12.82,2.17,15.6c1.85,3.21,8.5,7.65,14.94,11.07l.19.05Z";

    useEffect(() => {
        const el = markerRef.current;
        if (!el) return;

        const handleOver = () => setIsHovered(true);
        const handleOut = () => setIsHovered(false);

        el.addEventListener('pointerover', handleOver);
        el.addEventListener('pointerout', handleOut);

        return () => {
            el.removeEventListener('pointerover', handleOver);
            el.removeEventListener('pointerout', handleOut);
        };
    }, []);

    return (
        <Marker3D 
            ref={markerRef}
            position={{ lat: pin.lat, lng: pin.lng, altitude: 0 }}
            altitudeMode={AltitudeMode.CLAMP_TO_GROUND}
            drawsWhenOccluded={true}
            onClick={(e: any) => {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.domEvent && e.domEvent.stopPropagation) e.domEvent.stopPropagation();
                onRemove();
            }}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="88" 
                viewBox="0 0 64 88" 
                fill="none" 
                style={{ 
                    pointerEvents: 'auto', 
                    cursor: 'pointer',
                    filter: isHovered ? 'drop-shadow(0 6px 16px rgba(239,68,68,0.4))' : 'drop-shadow(0 6px 14px rgba(24,61,137,0.22))',
                    transition: 'all 0.2s ease'
                }}
            >
                {/* 1. Ground target anchor */}
                <ellipse cx="32" cy="84" rx="10" ry="3.5" fill={mainColor} fillOpacity="0.2" stroke={mainColor} strokeWidth="1.2"/>
                <circle cx="32" cy="84" r="2.5" fill={mainColor}/>

                {/* 2. Vertical beacon stem */}
                <line x1="32" y1="56" x2="32" y2="84" stroke={mainColor} strokeWidth="2" strokeDasharray="3 3" opacity="0.9"/>
                
                {/* 3. Outer lens circle */}
                <circle cx="32" cy="28" r="24" fill={bgColor} stroke={mainColor} strokeWidth="2.5" />
                <circle cx="32" cy="28" r="19" fill={mainColor} fillOpacity={isHovered ? "0.15" : "0.06"} />

                {/* 4. Inside Icon */}
                {isHovered ? (
                    /* Red Delete Trash Icon */
                    <g transform="translate(20, 16)" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                    </g>
                ) : isTurbine ? (
                    /* Aeroturbine Dual Rotor Icon */
                    <g transform="translate(19, 15)" stroke={mainColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                    </g>
                ) : (
                    /* Official Treetino Bionic Tree Emblem */
                    <g transform="translate(19.5, 15.5) scale(0.33)" fill={mainColor}>
                        <path d={treetinoEmblemPath} />
                    </g>
                )}
            </svg>
        </Marker3D>
    );
}

function FallbackMap({ onClick }: { onClick?: () => void }) {
    return (
        <div onClick={onClick} className="map-grid absolute inset-0 cursor-crosshair flex items-center justify-center bg-slate-900">
            <div className="flex flex-col items-center gap-2 text-slate-500 font-mono text-center">
                <Globe className="w-8 h-8 opacity-50 mb-4" />
                Není poskytnut Google Maps API klíč.<br/>
                Přidejte VITE_GOOGLE_MAPS_API_KEY and VITE_GOOGLE_MAP_ID do souboru .env.
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700/20" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700/20" />
        </div>
    );
}

function MapCameraController({ selectedLocation }: { selectedLocation: SelectedLocation | null }) {
    const map3D = useMap3D();

    useEffect(() => {
        if (!map3D || !selectedLocation) return;
        
        const lat = selectedLocation.lat;
        const lng = selectedLocation.lon;
        
        if (typeof map3D.flyCameraTo === 'function') {
            map3D.flyCameraTo({
                endCamera: {
                    center: { lat, lng, altitude: 500 },
                    tilt: 65,
                    heading: 45,
                    range: 1000
                },
                durationMillis: 1500
            });
        } else {
            map3D.center = { lat, lng, altitude: 500 };
        }
    }, [map3D, selectedLocation]);

    return null;
}
