import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, FileText, Calendar, Download, User, Building, MapPin, Upload, CheckCircle2 } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { CalcResult, SelectedLocation, Deal, User as UserType } from '../types';
import { useAresLookup } from '../hooks/useAresLookup';
import { Button } from './ui/Button';
import { useI18n } from '../i18n';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string || 'DEMO_MAP_ID';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
    result: CalcResult;
    location: SelectedLocation;
    energyCost: number;
    web3Enabled: boolean;
    esgEnabled: boolean;
    onClose: () => void;
    activeDeal?: Deal | null;
    activeUser?: UserType | null;
    onRefreshDeals?: () => void;
}

export default function OfferModal({ 
    result, 
    location, 
    energyCost, 
    web3Enabled, 
    esgEnabled, 
    onClose, 
    activeDeal, 
    activeUser,
    onRefreshDeals
}: Props) {
    const { t, locale } = useI18n();
    const totalKwh = result.annualSolarKwh + result.annualWindKwh;
    const roi = result.paybackPeriod;

    const [clientName, setClientName] = useState(activeDeal?.client_name || '');
    const [clientAddress, setClientAddress] = useState(activeDeal?.client_address || '');
    const [clientLogoBase64, setClientLogoBase64] = useState<string | null>(activeDeal?.client_logo || null);
    const [consumptionValue, setConsumptionValue] = useState<number>(result.buildingConsumption);
    const [consumptionUnit, setConsumptionUnit] = useState<'kWh' | 'MWh' | 'GWh'>('MWh');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingSecondary, setIsGeneratingSecondary] = useState(false);
    const [ico, setIco] = useState(activeDeal?.ico || '');
    const [dic, setDic] = useState(activeDeal?.dic || '');

    const { isFetchingIco, fetchIcoDetails } = useAresLookup();

    const handleIcoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value.replace(/\D/g, '');
        setIco(newVal);

        if (newVal.length === 8) {
            const data = await fetchIcoDetails(newVal);
            if (data) {
                if (data.clientName) setClientName(data.clientName);
                if (data.clientAddress) setClientAddress(data.clientAddress);
                if (data.dic) setDic(data.dic);
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert(t('offer.errLogoSize'));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setClientLogoBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearLogo = () => {
        setClientLogoBase64(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGeneratePdf = async (targetLang: 'cs' | 'en') => {
        if (targetLang === locale) {
            setIsGenerating(true);
        } else {
            setIsGeneratingSecondary(true);
        }

        try {
            let normalizedMwh = consumptionValue;
            if (consumptionUnit === 'kWh') normalizedMwh = consumptionValue / 1000;
            else if (consumptionUnit === 'GWh') normalizedMwh = consumptionValue * 1000;

            const payload = {
                clientName: clientName || 'Klient',
                client_name: clientName || 'Klient',
                clientAddress: clientAddress || '',
                client_address: clientAddress || '',
                clientLogoBase64: clientLogoBase64,
                client_logo_base64: clientLogoBase64,
                ico: ico || '',
                dic: dic || '',
                consumptionOverride: normalizedMwh,
                building_consumption: normalizedMwh,
                result: result,
                location: {
                    lat: location.lat,
                    lon: location.lon,
                    pins: location.pins || [{ lat: location.lat, lng: location.lon, type: 'main-tree' }]
                },
                lat: location.lat,
                lon: location.lon,
                energyCost: energyCost,
                energy_price: energyCost,
                sunnyDays: 200,
                sunny_days: 200,
                windyDays: 180,
                windy_days: 180,
                windHours: 8,
                wind_hours: 8,
                pins_json: JSON.stringify(location.pins || []),
                aiOptimization: true,
                ai_optimization: true,
                web3Enabled: web3Enabled,
                web3_enabled: web3Enabled,
                esgEnabled: esgEnabled,
                deal_id: activeDeal?.id || null,
                user_id: activeUser?.id || null,
                partner_id: activeUser?.partner_id || null,
                agent_name: activeUser?.full_name || activeUser?.username || 'Dominik Mašek',
                partner_name: activeUser?.partner_name || activeUser?.full_name || activeUser?.username || 'Treetino Partner',
                lang: targetLang
            };

            const response = await fetch(`${BACKEND_URL}/generate-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.detail || t('offer.errPdfGenerate'));
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (clientName || 'Klient').trim().replace(/\s+/g, '_');
            a.download = targetLang === 'en'
                ? `Treetino_Offer_${safeName}_EN.pdf`
                : `Nabidka_Treetino_${safeName}_CS.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            if (onRefreshDeals) {
                onRefreshDeals();
            }
        } catch (error: any) {
            console.error('PDF Generation failed:', error);
            alert(`${t('offer.errPdfGenerate')}: ${error.message}`);
        } finally {
            setIsGenerating(false);
            setIsGeneratingSecondary(false);
        }
    };

    const secondaryLang = locale === 'cs' ? 'en' : 'cs';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.94, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto relative text-slate-900"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-black transition-colors cursor-pointer"
                    title={t('common.close') || 'Zavřít'}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3.5 pr-10">
                    <div className="p-3 rounded-2xl bg-[#183d89]/10 text-[#183d89] shrink-0">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#183d89] uppercase tracking-wider bg-[#183d89]/10 px-2 py-0.5 rounded-full">
                                {t('offer.officialBadge') || 'B2B Nabídka'}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 mt-0.5">
                            {t('offer.title') || 'Generovat Obchodní Nabídku'}
                        </h2>
                    </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-black/10 flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                            {t('offer.investment') || 'Investice'}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 font-mono mt-0.5">
                            {(result.finalPrice ?? result.investment).toLocaleString()} {t('common.currency')}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-black/10 flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                            {t('offer.annualProduction') || 'Roční výroba'}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 font-mono mt-0.5">
                            {Math.round(totalKwh).toLocaleString()} kWh
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-[#183d89]/20 flex flex-col">
                        <span className="text-[10px] text-[#183d89] font-bold uppercase tracking-wider font-mono">
                            {t('offer.payback') || 'Návratnost'}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-[#183d89] font-mono mt-0.5">
                            {roi} {t('common.years')}
                        </span>
                    </div>
                </div>

                {/* Standout Form Fields */}
                <div className="space-y-4 pt-1">
                    {/* Row 1: IČO & DIČ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* IČO Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Building className="w-3.5 h-3.5 text-[#183d89]" />
                                    <span>{t('offer.icoLabel') || 'IČO (ARES Auto-fill)'}</span>
                                </span>
                                {isFetchingIco && (
                                    <span className="text-[#183d89] text-[10px] font-mono font-semibold animate-pulse">
                                        Načítám ARES...
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={ico}
                                    onChange={handleIcoChange}
                                    placeholder="Např. 12345678"
                                    maxLength={8}
                                    className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white border-2 border-black/15 focus:border-[#183d89] rounded-2xl px-4 py-3 text-slate-900 text-sm font-semibold placeholder:text-black/35 transition-all shadow-xs outline-none font-mono"
                                />
                                {ico.length === 8 && !isFetchingIco && clientName && (
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DIČ Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-slate-500" />
                                <span>DIČ (nepovinné)</span>
                            </label>
                            <input
                                type="text"
                                value={dic}
                                onChange={(e) => setDic(e.target.value)}
                                placeholder="Např. CZ12345678"
                                className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white border-2 border-black/15 focus:border-[#183d89] rounded-2xl px-4 py-3 text-slate-900 text-sm font-semibold placeholder:text-black/35 transition-all shadow-xs outline-none font-mono"
                            />
                        </div>
                    </div>

                    {/* Row 2: Client Name & Client Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Client Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#183d89]" />
                                <span>{t('offer.clientName') || 'Název klienta / firmy'}</span>
                            </label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Např. ACME Energy s.r.o."
                                className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white border-2 border-black/15 focus:border-[#183d89] rounded-2xl px-4 py-3 text-slate-900 text-sm font-semibold placeholder:text-black/35 transition-all shadow-xs outline-none"
                            />
                        </div>

                        {/* Client Address Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#183d89]" />
                                <span>Sídlo / Adresa klienta</span>
                            </label>
                            <input
                                type="text"
                                value={clientAddress}
                                onChange={(e) => setClientAddress(e.target.value)}
                                placeholder="Např. Václavské náměstí 1, Praha"
                                className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white border-2 border-black/15 focus:border-[#183d89] rounded-2xl px-4 py-3 text-slate-900 text-sm font-semibold placeholder:text-black/35 transition-all shadow-xs outline-none"
                            />
                        </div>
                    </div>

                    {/* Row 3: Annual Consumption & Client Logo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Consumption Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-[#183d89]" />
                                <span>{t('offer.estimatedConsumption') || 'Roční spotřeba klienta'}</span>
                            </label>
                            <div className="flex bg-stone-50 hover:bg-stone-100/70 focus-within:bg-white border-2 border-black/15 focus-within:border-[#183d89] rounded-2xl overflow-hidden shadow-xs transition-all">
                                <input
                                    type="number"
                                    min={0}
                                    step="any"
                                    value={consumptionValue}
                                    onChange={(e) => setConsumptionValue(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-transparent px-4 py-3 text-slate-900 text-sm font-bold font-mono outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (consumptionUnit === 'MWh') {
                                            setConsumptionUnit('GWh');
                                            setConsumptionValue(Number((consumptionValue / 1000).toFixed(2)));
                                        } else if (consumptionUnit === 'GWh') {
                                            setConsumptionUnit('kWh');
                                            setConsumptionValue(Number((consumptionValue * 1000000).toFixed(2)));
                                        } else {
                                            setConsumptionUnit('MWh');
                                            setConsumptionValue(Number((consumptionValue / 1000).toFixed(2)));
                                        }
                                    }}
                                    className="px-4 border-l border-black/15 text-xs font-bold text-[#183d89] hover:bg-black/5 transition-colors cursor-pointer font-mono select-none"
                                >
                                    {consumptionUnit} ▾
                                </button>
                            </div>
                        </div>

                        {/* Client Logo Upload Box */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-[#183d89]" />
                                <span>{t('offer.clientLogo') || 'Logo klienta (volitelné)'}</span>
                            </label>
                            
                            {clientLogoBase64 ? (
                                <div className="flex items-center justify-between bg-stone-50 border-2 border-black/15 rounded-2xl p-2 px-3 shadow-xs h-[48px]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-7 rounded-xl bg-white border border-black/10 p-0.5 flex items-center justify-center overflow-hidden">
                                            <img src={clientLogoBase64} alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-700">Logo nahráno</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={clearLogo}
                                        className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                                        title={t('offer.removeLogo') || 'Odstranit logo'}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100/80 border-2 border-dashed border-black/20 hover:border-[#183d89] rounded-2xl px-4 py-3 cursor-pointer transition-all shadow-xs text-xs font-semibold text-slate-700 h-[48px]"
                                >
                                    <Upload className="w-4 h-4 text-[#183d89]" />
                                    <span>Vybrat soubor loga</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl hover:bg-stone-100 text-xs font-semibold text-slate-600 hover:text-black transition-colors cursor-pointer"
                    >
                        {t('common.cancel') || 'Zrušit'}
                    </button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {/* Secondary language PDF download */}
                        <button
                            type="button"
                            onClick={() => handleGeneratePdf(secondaryLang)}
                            disabled={isGeneratingSecondary}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 border-2 border-black/15 text-xs font-bold text-slate-800 transition-all shadow-xs cursor-pointer disabled:opacity-50 font-mono"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isGeneratingSecondary ? '...' : (secondaryLang === 'en' ? 'EN (PDF)' : 'CS (PDF)')}</span>
                        </button>

                        {/* Primary localized download button */}
                        <Button
                            onClick={() => handleGeneratePdf(locale)}
                            disabled={isGenerating}
                            isLoading={isGenerating}
                            variant="primary"
                            size="lg"
                            icon={<Download className="w-4 h-4" />}
                            className="flex-1 sm:flex-initial px-6 py-3.5 text-sm font-semibold"
                        >
                            {locale === 'cs' ? 'Stáhnout PDF Nabídku (Česky)' : 'Download PDF Offer (EN)'}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

