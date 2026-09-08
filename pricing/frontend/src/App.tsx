import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  MapPin, 
  FileText, 
  Briefcase, 
  Sliders,
  Globe,
  ArrowLeft,
  Check,
  Search
} from 'lucide-react';
import { APIProvider } from '@vis.gl/react-google-maps';
import type { CalcResult, ProductType, SelectedLocation, User, Deal } from './types';
import { runQuickScan, calculateROI } from './api';

import MapCanvas from './components/MapCanvas';
import AddressSearch from './components/AddressSearch';
import AnalyticsPanel from './components/AnalyticsPanel';
import OfferModal from './components/OfferModal';
import LoginScreen from './components/LoginScreen';
import NdaModal from './components/NdaModal';
import MediationModal from './components/MediationModal';
import VideoOnboardingModal from './components/VideoOnboardingModal';
import OnboardingArchiveModal from './components/OnboardingArchiveModal';
import CrmPanel from './components/CrmPanel';
import AdminDashboard from './components/AdminDashboard';
import { Button } from './components/ui/Button';
import LocaleSwitcher from './components/LocaleSwitcher';
import LogoType from './components/LogoType';
import { useI18n } from './i18n';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface ProductConfigSpec {
  id: ProductType;
  name: string;
  label: string;
  image: string;
  power: string;
  dailyProd: string;
  roi: string;
}

export default function App() {
  const { t, locale } = useI18n();

  const PRODUCTS: ProductConfigSpec[] = useMemo(() => [
    { 
      id: 'main-tree', 
      name: t('products.mainTree.name'), 
      label: t('products.mainTree.label'), 
      image: '/products/LG-still.webp',
      power: t('products.mainTree.power'),
      dailyProd: t('products.mainTree.dailyProd'),
      roi: t('products.mainTree.roi')
    },
    { 
      id: 'small-tree', 
      name: t('products.smallTree.name'), 
      label: t('products.smallTree.label'), 
      image: '/products/SM-still.webp',
      power: t('products.smallTree.power'),
      dailyProd: t('products.smallTree.dailyProd'),
      roi: t('products.smallTree.roi')
    },
    { 
      id: 'standalone-turbine', 
      name: t('products.standaloneTurbine.name'), 
      label: t('products.standaloneTurbine.label'), 
      image: '/products/info-turbine-w.webp',
      power: t('products.standaloneTurbine.power'),
      dailyProd: t('products.standaloneTurbine.dailyProd'),
      roi: t('products.standaloneTurbine.roi')
    }
  ], [t]);

  // ─── Core Calculator & Layout State ─────────────────────
  const [product, setProduct] = useState<ProductType>('main-tree');
  const [unitCount, setUnitCount] = useState(1);
  const [energyCost, setEnergyCost] = useState(5.50);
  const [sunnyDays, setSunnyDays] = useState(220);
  const [windyDays, setWindyDays] = useState(180);
  const [windHours, setWindHours] = useState(8);
  const [aiOptimization, setAiOptimization] = useState(true);
  const [web3Enabled, setWeb3Enabled] = useState(true);
  const [esgEnabled, setEsgEnabled] = useState(true);
  const [buildingConsumption, setBuildingConsumption] = useState(360);
  const [discount, setDiscount] = useState(0);
  const [showFutureRevenue, setShowFutureRevenue] = useState(true);

  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── CRM & Partner Portal State ───────────────────────
  const [crmActive, setCrmActive] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'crm' | 'admin'>('crm');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [reviewVideoNum, setReviewVideoNum] = useState<1 | 2 | null>(null);
  
  // All deals in database
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [crmPreviewLocation, setCrmPreviewLocation] = useState<SelectedLocation | null>(null);

  const selectedProductSpec = PRODUCTS.find(p => p.id === product) || PRODUCTS[0];

  // ─── Load Session from localStorage ──────────────────
  useEffect(() => {
    const cachedUserObj = localStorage.getItem('treetino_user') || sessionStorage.getItem('treetino_user');
    
    if (cachedUserObj) {
      try {
        const user = JSON.parse(cachedUserObj);
        setActiveUser(user);
      } catch (e) {
        console.error('Failed to parse cached session', e);
      }
    }
  }, []);

  // ─── Fetch All Deals ──────────────────────────────────
  const fetchAllDeals = async () => {
    if (!activeUser) return;
    try {
      const { data } = await axios.get<Deal[]>(`${BACKEND_URL}/deals?user_id=${activeUser.id}`);
      
      const localDealsStr = localStorage.getItem(`treetino_deals_${activeUser.id}`);
      const localDeals: Deal[] = localDealsStr ? JSON.parse(localDealsStr) : [];
      
      if (localDeals.length > 0) {
        const serverHasAll = localDeals.every(ld => 
          data.some(sd => sd.client_name === ld.client_name && sd.created_at === ld.created_at)
        );
        
        if (!serverHasAll) {
          await axios.post(`${BACKEND_URL}/deals/sync`, {
            user_id: activeUser.id,
            deals: localDeals.map(ld => ({
              client_name: ld.client_name,
              agent_name: ld.agent_name,
              status: ld.status,
              created_at: ld.created_at,
              updated_at: ld.updated_at,
              ico: ld.ico,
              dic: ld.dic,
              client_logo: ld.client_logo,
              pdf_path: ld.pdf_path,
              config: ld.config
            }))
          });
          
          const { data: updatedData } = await axios.get<Deal[]>(`${BACKEND_URL}/deals?user_id=${activeUser.id}`);
          setAllDeals(updatedData);
          localStorage.setItem(`treetino_deals_${activeUser.id}`, JSON.stringify(updatedData));
          return;
        }
      }
      
      setAllDeals(data);
      localStorage.setItem(`treetino_deals_${activeUser.id}`, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to fetch all deals', e);
    }
  };

  useEffect(() => {
    fetchAllDeals();
  }, [activeUser]);

  // ─── Login & Logout Handlers ───────────────────────────
  const handleLogin = (user: User, rememberMe: boolean) => {
    setActiveUser(user);
    if (rememberMe) {
      localStorage.setItem('treetino_user', JSON.stringify(user));
      sessionStorage.removeItem('treetino_user');
    } else {
      sessionStorage.setItem('treetino_user', JSON.stringify(user));
      localStorage.removeItem('treetino_user');
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setActiveDeal(null);
    setLocation(null);
    setResult(null);
    localStorage.removeItem('treetino_user');
    sessionStorage.removeItem('treetino_user');
    setCrmActive(false);
  };

  useEffect(() => {
    if (location?.pins && location.pins.length > 0) {
      setUnitCount(location.pins.length);
    } else {
      setUnitCount(0);
    }
  }, [location]);

  const handleLocationSelect = useCallback((loc: SelectedLocation) => {
    setLocation(loc);
    setResult(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!location || location.potential) return;
    let isMounted = true;
    const triggerScan = async () => {
      try {
        const potential = await runQuickScan(location.lat, location.lon);
        if (isMounted) setLocation(prev => prev ? { ...prev, potential } : null);
      } catch (e) {
        console.error('Quick scan failed', e);
      }
    };
    triggerScan();
    return () => { isMounted = false; };
  }, [location]);

  const handlePreviewDeal = useCallback((deal: Deal | null) => {
    if (deal && deal.config) {
      try {
        const pins = JSON.parse(deal.config.pins_json);
        setCrmPreviewLocation({
          lat: deal.config.lat,
          lon: deal.config.lon,
          pins: pins,
          potential: undefined
        });
      } catch (e) {
        console.error('Failed to parse preview pins', e);
        setCrmPreviewLocation(null);
      }
    } else {
      setCrmPreviewLocation(null);
    }
  }, []);

  const handleSelectDeal = useCallback((deal: Deal | null) => {
    setActiveDeal(deal);
    setCrmPreviewLocation(null);
    if (!deal) {
      setLocation(null);
      setResult(null);
      setUnitCount(0);
      setDiscount(0);
      return;
    }
    
    if (deal.config) {
      const cfg = deal.config;
      setEnergyCost(cfg.energy_price);
      setSunnyDays(cfg.sunny_days);
      setWindyDays(cfg.windy_days);
      setWindHours(cfg.wind_hours);
      setAiOptimization(cfg.ai_optimization === 1);
      setWeb3Enabled(cfg.web3_enabled === 1);
      setBuildingConsumption(cfg.building_consumption);
      setDiscount(cfg.discount);
      
      try {
        const pins = JSON.parse(cfg.pins_json);
        setLocation({
          lat: cfg.lat,
          lon: cfg.lon,
          pins: pins,
          potential: undefined
        });
      } catch (err) {
        console.error('Failed to parse saved pins json', err);
      }
    } else {
      setLocation(null);
      setResult(null);
      setUnitCount(0);
      setDiscount(0);
    }
  }, []);

  const handleCalculate = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const pins = location.pins || [];
      const productCounts = pins.reduce((acc, pin) => {
          acc[pin.type] = (acc[pin.type] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      if (Object.keys(productCounts).length === 0) {
          productCounts[product] = 1;
      }

      let commissionRate = 5.0;
      if (activeUser?.tier === 'Gold') commissionRate = 8.0;
      else if (activeUser?.tier === 'Platinum') commissionRate = 12.0;

      const calcParams = {
        productCounts,
        energyPrice: energyCost,
        sunnyDays,
        windyDays,
        windHours,
        aiOptimization,
        web3Enabled,
        showFutureRevenue,
        carsPerDay: 0,
        carbonCreditPercentage: 0,
        heliumHotspots: 0,
        buildingConsumption,
        discount,
        commissionRate
      };

      const res = await calculateROI(calcParams, location.lat, location.lon);
      setResult(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('configurator.calculationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const maxDiscount = activeUser ? (activeUser.tier === 'Silver' ? 10 : activeUser.tier === 'Gold' ? 20 : 30) : 30;

  if (!activeUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (activeUser && !activeUser.nda_signed && activeUser.is_superadmin !== 1) {
    return (
      <NdaModal
        activeUser={activeUser}
        onNdaSigned={(updatedUser) => setActiveUser(updatedUser)}
      />
    );
  }

  if (activeUser && activeUser.nda_signed && !activeUser.mediation_signed && activeUser.is_superadmin !== 1) {
    return (
      <MediationModal
        activeUser={activeUser}
        onMediationSigned={(updatedUser) => setActiveUser(updatedUser)}
      />
    );
  }

  if (activeUser && activeUser.nda_signed && activeUser.mediation_signed && !activeUser.videos_completed && activeUser.is_superadmin !== 1) {
    return (
      <VideoOnboardingModal
        activeUser={activeUser}
        onVideosCompleted={(updatedUser) => setActiveUser(updatedUser)}
      />
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 select-none">
      
      {/* 1. MAP CANVAS (Background) */}
      <MapCanvas
        onLocationSelect={handleLocationSelect}
        selectedLocation={crmActive ? (crmPreviewLocation || location) : location}
        onPinsChange={(pins) => {
          setUnitCount(pins.length);
          setLocation(prev => prev ? { ...prev, pins } : null);
        }}
        product={product}
        allDeals={allDeals}
        activeDeal={activeDeal}
        onMapClick={() => {
          setCrmActive(false);
          setCrmPreviewLocation(null);
        }}
        crmActive={crmActive}
      />

      {/* 2. FLOATING WEBSITE HEADER (Matching Header.vue from treetino-website-dev) */}
      <div className={`absolute top-6 left-6 z-30 pointer-events-none transition-all duration-500 ease-in-out ${
        crmActive ? 'right-[670px] xl:right-[730px]' : 'right-[480px]'
      }`}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <div className="w-full flex items-center justify-between bg-white border border-black/10 rounded-2xl px-6 py-3.5 shadow-lg text-slate-900 pointer-events-auto">
            
            {/* Left: Clean Black Logo & CRM Tag */}
            <div className="flex items-center gap-3 shrink-0">
              <LogoType className="h-6 w-auto text-black" />
              <div className="h-4 w-px bg-black/15" />
              <span className="text-[10px] font-mono font-bold bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('common.crm')}
              </span>
            </div>

            {/* Center: Address Search Bar */}
            <div className="w-64 mx-4">
              <AddressSearch 
                onPlaceSelect={(lat, lng) => {
                  setLocation({
                    lat,
                    lon: lng,
                    pins: [],
                    potential: undefined
                  });
                }} 
              />
            </div>

            {/* Right: Actions & Locale Switcher */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowArchiveModal(true)}
                className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 hover:text-black hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
                title={t('common.docsAndTrainingTooltip')}
              >
                <FileText className="w-3.5 h-3.5 text-[#183d89]" />
                <span className="hidden md:inline">{t('common.docsAndTraining')}</span>
              </button>

              <button
                onClick={() => setCrmActive(!crmActive)}
                className={`text-xs font-bold font-mono px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  crmActive
                    ? 'bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20'
                    : 'text-slate-700 hover:text-black hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t('common.deals')} ({allDeals.length})</span>
              </button>

              <button
                onClick={() => setCrmActive(!crmActive)}
                className="bg-[#183d89] hover:bg-[#153475] text-white font-semibold rounded-full px-5 py-2 text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{crmActive ? t('common.closePortal') : t('common.partnerPortal')}</span>
              </button>

              <LocaleSwitcher inverted />
            </div>

          </div>
        </APIProvider>
      </div>

      {/* 3. CONFIGURATOR RIGHT SIDEBAR (Clean White Surface + Royal Blue Accents) */}
      <motion.aside
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute top-0 right-0 bottom-0 z-40 bg-white border-l border-black/10 text-slate-900 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          crmActive ? 'w-[640px] xl:w-[700px]' : 'w-[440px]'
        }`}
      >
        {crmActive ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-7">
            <CrmPanel
              activeUser={activeUser}
              onLogout={handleLogout}
              activeDeal={activeDeal}
              onSelectDeal={handleSelectDeal}
              onPreviewDeal={handlePreviewDeal}
              currentResult={result}
              currentLocation={location}
              energyCost={energyCost}
              sunnyDays={sunnyDays}
              windyDays={windyDays}
              windHours={windHours}
              aiOptimization={aiOptimization}
              web3Enabled={web3Enabled}
              buildingConsumption={buildingConsumption}
              discount={discount}
              deals={activeUser.is_superadmin === 1 ? allDeals : allDeals.filter(d => d.user_id === activeUser.id)}
              onRefreshDeals={fetchAllDeals}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onClosePortal={() => {
                setCrmActive(false);
                setCrmPreviewLocation(null);
              }}
              onOpenArchive={() => setShowArchiveModal(true)}
            />
          </div>
        ) : (
          <>
            {/* Scrollable Configuration Parameters Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 flex flex-col gap-6">
              
              {/* Modern Segmented Product Model Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-2xl border border-black/10">
                {PRODUCTS.map((prod) => {
                  const isSelected = product === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setProduct(prod.id);
                        setResult(null);
                      }}
                      className={`py-2 px-1 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer truncate ${
                        isSelected 
                          ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                          : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      {prod.name}
                    </button>
                  );
                })}
              </div>

              {/* Active Deal Banner (If editing a saved deal) */}
              {activeDeal && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 border border-[#183d89]/20 text-xs shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#183d89] animate-pulse" />
                    <span className="font-semibold text-black">{t('common.activeDeal')}: {activeDeal.client_name}</span>
                  </div>
                  <button
                    onClick={() => handleSelectDeal(null)}
                    className="text-[11px] text-[#183d89] hover:underline font-bold cursor-pointer"
                  >
                    {t('common.deselect')}
                  </button>
                </div>
              )}

              {/* Model Header Title & Hero Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display tracking-tight text-slate-900 leading-tight">
                    {selectedProductSpec.name}
                  </h2>
                  <span className="text-[10px] font-mono font-bold bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20 px-2.5 py-0.5 rounded-full uppercase">
                    Bionic Tree
                  </span>
                </div>
                
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-black/10 relative group shadow-sm">
                  <img 
                    src={selectedProductSpec.image} 
                    alt={selectedProductSpec.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>

              {/* 3 Bento Metric Chips for Specs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-stone-50 rounded-2xl border border-black/10 text-center shadow-2xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                    {t('products.specs.ratedPower')}
                  </span>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">
                    {selectedProductSpec.power}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-black/10 text-center shadow-2xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                    {t('products.specs.dailyProduction')}
                  </span>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">
                    {selectedProductSpec.dailyProd}
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-2xl border border-[#183d89]/20 text-center shadow-2xs">
                  <span className="text-[9px] text-[#183d89] font-bold uppercase tracking-wider block font-mono">
                    {t('products.specs.averageRoi')}
                  </span>
                  <div className="text-xs font-bold text-[#183d89] font-mono mt-1">
                    {selectedProductSpec.roi}
                  </div>
                </div>
              </div>

              {/* SECTION 01 — Location & Environment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-[#183d89] rounded-full inline-block" />
                    <span className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
                      {t('configurator.step1Title')}
                    </span>
                  </div>
                  {location && (
                    <button 
                      onClick={() => {
                        setLocation(null);
                        setResult(null);
                        setUnitCount(0);
                        setActiveDeal(null);
                      }}
                      className="text-[11px] text-[#183d89] hover:underline cursor-pointer font-semibold"
                    >
                      {t('common.cleanMap')}
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-3xl border border-black/10 bg-stone-50/70 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#183d89]/10 text-[#183d89] flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{t('configurator.locationAnalysis')}</span>
                    </div>
                    {location && (
                      <span className="text-[10px] font-mono bg-white border border-black/10 px-2 py-0.5 rounded-lg text-slate-600 font-semibold shadow-2xs">
                        {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                      </span>
                    )}
                  </div>

                  {location ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-3 rounded-2xl bg-white border border-black/10 shadow-2xs">
                        <span className="text-[9px] text-slate-500 font-mono font-bold uppercase block">{t('configurator.solarPotential')}</span>
                        <strong className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                          {location.potential ? `${Math.round(location.potential.solarIndex)}%` : '—'}
                        </strong>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-black/10 shadow-2xs">
                        <span className="text-[9px] text-slate-500 font-mono font-bold uppercase block">{t('configurator.windSpeed')}</span>
                        <strong className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                          {location.potential ? `${location.potential.avgWindSpeed.toFixed(1)} m/s` : '—'}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white border border-dashed border-black/15 text-center text-xs text-slate-500">
                      {t('common.clickMapInstruction')}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 02 — Parameters & Sliders */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#183d89] rounded-full inline-block" />
                  <span className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
                    {t('configurator.step2Title')}
                  </span>
                </div>

                <div className="p-5 rounded-3xl border border-black/10 bg-stone-50/70 space-y-4 text-xs shadow-2xs">
                  {location && (
                    <div className="space-y-2 pb-3 border-b border-black/10">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-xs text-slate-900">{t('configurator.extractedUnits')}</span>
                        <span className="font-bold text-slate-900 font-mono bg-white px-2.5 py-1 rounded-xl border border-black/10 shadow-2xs">
                          {unitCount}x {selectedProductSpec.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-semibold">{t('configurator.energyCost')}</span>
                      <span className="font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded-lg border border-black/10 shadow-2xs">
                        {energyCost.toFixed(2)} CZK
                      </span>
                    </div>
                    <input type="range" min={1.0} max={15.0} step={0.1} value={energyCost} 
                      onChange={(e) => setEnergyCost(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer accent-[#183d89]" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-semibold">{t('configurator.annualConsumption')}</span>
                      <span className="font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded-lg border border-black/10 shadow-2xs">
                        {buildingConsumption} MWh
                      </span>
                    </div>
                    <input type="range" min={10} max={5000} step={10} value={buildingConsumption} 
                      onChange={(e) => setBuildingConsumption(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer accent-[#183d89]" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-semibold">{t('configurator.discount')} ({t('configurator.tierLimit')}: {maxDiscount}%)</span>
                      <span className="font-bold text-[#183d89] font-mono bg-white px-2 py-0.5 rounded-lg border border-[#183d89]/20 shadow-2xs">
                        {discount.toFixed(1)}%
                      </span>
                    </div>
                    <input type="range" min={0} max={maxDiscount} step={0.5} value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer accent-[#183d89]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Pinned Bottom Action Bar */}
            <div className="shrink-0 p-6 bg-white/95 backdrop-blur-md border-t border-black/10 flex flex-col gap-2.5 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
              <Button
                onClick={handleCalculate}
                disabled={!location}
                isLoading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="py-3.5 rounded-2xl shadow-sm"
              >
                {loading ? t('configurator.calculating') : t('configurator.calculateRoi')}
              </Button>

              {result && (
                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<FileText className="w-4 h-4 text-[#183d89]" />}
                  className="py-3 rounded-2xl shadow-xs"
                >
                  {t('common.exportPdf')}
                </Button>
              )}
            </div>
          </>
        )}
      </motion.aside>

      {/* 4. ANALYTICS BENTO GRID (Clean White Glass Surface) */}
      <AnimatePresence>
        {result && (
          <div className={`absolute bottom-8 left-6 z-30 transition-all duration-500 ease-in-out ${
            crmActive ? 'right-[670px] xl:right-[730px]' : 'right-[480px]'
          }`}>
            <AnalyticsPanel 
              result={result} 
              energyCost={energyCost} 
              web3Enabled={web3Enabled} 
              esgEnabled={esgEnabled} 
              onExportPdf={() => setShowModal(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 5. OFFER MODAL */}
      <AnimatePresence>
        {showModal && result && location && (
          <OfferModal 
            result={result} 
            location={location} 
            energyCost={energyCost}
            web3Enabled={web3Enabled} 
            esgEnabled={esgEnabled} 
            activeDeal={activeDeal}
            activeUser={activeUser}
            onRefreshDeals={fetchAllDeals}
            onClose={() => setShowModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* 6. SUPERADMIN DASHBOARD OVERLAY */}
      <AnimatePresence>
        {crmActive && activeUser?.is_superadmin === 1 && viewMode === 'admin' && (
          <AdminDashboard
            activeUser={activeUser}
            onLogout={handleLogout}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSelectDeal={handleSelectDeal}
            allDeals={allDeals}
            onRefreshDeals={fetchAllDeals}
          />
        )}
      </AnimatePresence>

      {/* 7. PARTNER ONBOARDING ARCHIVE MODAL (Review Signed Documents & Videos) */}
      <AnimatePresence>
        {showArchiveModal && activeUser && (
          <OnboardingArchiveModal
            activeUser={activeUser}
            onClose={() => setShowArchiveModal(false)}
            onOpenVideoPlayer={(num) => {
              setShowArchiveModal(false);
              setReviewVideoNum(num || 1);
            }}
          />
        )}
      </AnimatePresence>

      {/* 8. REVIEW VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {reviewVideoNum !== null && activeUser && (
          <VideoOnboardingModal
            activeUser={activeUser}
            onVideosCompleted={() => setReviewVideoNum(null)}
            isReviewMode={true}
            onCloseReview={() => setReviewVideoNum(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

