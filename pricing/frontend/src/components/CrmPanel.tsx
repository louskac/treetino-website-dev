import { useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  TrendingUp, 
  LogOut,
  FileText,
  DollarSign,
  Briefcase,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import type { Deal, CalcResult, SelectedLocation, User as UserType } from '../types';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  activeUser: UserType | null;
  onLogout: () => void;
  activeDeal: Deal | null;
  onSelectDeal: (deal: Deal | null) => void;
  onPreviewDeal?: (deal: Deal | null) => void;
  currentResult: CalcResult | null;
  currentLocation: SelectedLocation | null;
  energyCost: number;
  sunnyDays: number;
  windyDays: number;
  windHours: number;
  aiOptimization: boolean;
  web3Enabled: boolean;
  buildingConsumption: number;
  discount: number;
  deals: Deal[];
  onRefreshDeals: () => Promise<void> | void;
  viewMode: 'crm' | 'admin';
  setViewMode: (mode: 'crm' | 'admin') => void;
  onClosePortal?: () => void;
  onOpenArchive?: () => void;
}

export default function CrmPanel({
  activeUser,
  onLogout,
  activeDeal,
  onSelectDeal,
  onPreviewDeal,
  currentResult,
  currentLocation,
  energyCost,
  sunnyDays,
  windyDays,
  windHours,
  aiOptimization,
  web3Enabled,
  buildingConsumption,
  discount,
  deals,
  onRefreshDeals,
  viewMode,
  setViewMode,
  onClosePortal,
  onOpenArchive
}: Props) {
  const { t, locale } = useI18n();
  const [savingConfig, setSavingConfig] = useState(false);
  const [selectedCrmDealId, setSelectedCrmDealId] = useState<number | null>(activeDeal?.id || null);
  const [stageFilter, setStageFilter] = useState<'all' | 'Won' | 'In Progress' | 'Prepared' | 'Stuck'>('all');

  // ─── Save Layout Configuration ────────────────────────
  const handleSaveConfig = async () => {
    if (!activeDeal || !currentResult || !currentLocation) return;
    setSavingConfig(true);
    try {
      const forecastVal = currentResult.commissionForecast || 0;
      
      await axios.post(`${BACKEND_URL}/deals/${activeDeal.id}/config`, {
        lat: currentLocation.lat,
        lon: currentLocation.lon,
        pins_json: JSON.stringify(currentLocation.pins),
        energy_price: energyCost,
        sunny_days: sunnyDays,
        windy_days: windyDays,
        wind_hours: windHours,
        ai_optimization: aiOptimization,
        web3_enabled: web3Enabled,
        building_consumption: buildingConsumption,
        discount: discount,
        total_price: currentResult.finalPrice,
        commission_forecast: forecastVal
      });
      
      await onRefreshDeals();
      
      onSelectDeal({
        ...activeDeal,
        status: 'In Progress',
        config: {
          id: 0,
          deal_id: activeDeal.id,
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          pins_json: JSON.stringify(currentLocation.pins),
          energy_price: energyCost,
          sunny_days: sunnyDays,
          windy_days: windyDays,
          wind_hours: windHours,
          ai_optimization: aiOptimization ? 1 : 0,
          web3_enabled: web3Enabled ? 1 : 0,
          building_consumption: buildingConsumption,
          discount: discount,
          total_price: currentResult.finalPrice,
          commission_forecast: forecastVal,
          pdf_path: ''
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingConfig(false);
    }
  };

  // ─── Update Deal Status ──────────────────────────────
  const handleStatusChange = async (dealId: number, nextStatus: string) => {
    try {
      await axios.put(`${BACKEND_URL}/deals/${dealId}/status`, { status: nextStatus });
      await onRefreshDeals();
      if (activeDeal && activeDeal.id === dealId) {
        onSelectDeal({ ...activeDeal, status: nextStatus as any });
      }
    } catch (err) {
      console.error('Failed to update deal status', err);
    }
  };

  // ─── Financial calculations ─────
  const paidTotal = useMemo(() => deals
    .filter(d => d.commission && d.commission.status === 'Paid')
    .reduce((sum, d) => sum + d.commission!.amount_czk, 0), [deals]);

  const pendingTotal = useMemo(() => deals
    .filter(d => d.commission && d.commission.status === 'Pending')
    .reduce((sum, d) => sum + d.commission!.amount_czk, 0), [deals]);

  const forecastedTotal = useMemo(() => deals
    .filter(d => (!d.commission || d.commission.status === 'Forecasted') && d.status !== 'Won' && d.status !== 'Lost' && d.status !== 'Rejected')
    .reduce((sum, d) => sum + (d.config?.commission_forecast || d.commission?.amount_czk || 0), 0), [deals]);

  const totalPipelineTurnover = useMemo(() => deals
    .reduce((sum, d) => sum + (d.config?.total_price || 0), 0), [deals]);

  const wonDealsCount = useMemo(() => deals.filter(d => d.status === 'Won').length, [deals]);
  const inProgressDealsCount = useMemo(() => deals.filter(d => d.status === 'In Progress').length, [deals]);
  const preparedDealsCount = useMemo(() => deals.filter(d => d.status === 'Prepared').length, [deals]);
  const stuckDealsCount = useMemo(() => deals.filter(d => d.status === 'Stuck').length, [deals]);

  // Format currency helper
  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return `0 ${t('common.currency')}`;
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'cs-CZ', { 
      style: 'currency', 
      currency: 'CZK', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const commissionRate = activeUser?.tier === 'Platinum' ? '12%' : activeUser?.tier === 'Gold' ? '8%' : '5%';

  // ─── Chart Data (Harmonic 2-color Treetino Blue Palette) ──
  const monthlyChartData = useMemo(() => {
    const monthsCs = ['Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj'];
    const monthsEn = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const activeMonths = locale === 'en' ? monthsEn : monthsCs;

    return [
      {
        month: activeMonths[0],
        earned: 0,
        pipeline: 80000
      },
      {
        month: activeMonths[1],
        earned: 0,
        pipeline: 240000
      },
      {
        month: activeMonths[2],
        earned: 420000,
        pipeline: 180000
      },
      {
        month: activeMonths[3],
        earned: 282500,
        pipeline: 340000
      },
      {
        month: activeMonths[4],
        earned: 0,
        pipeline: 410000
      },
      {
        month: activeMonths[5],
        earned: 0,
        pipeline: 280000
      }
    ];
  }, [locale]);

  // ─── Filtered Deals List ──────────────────────────────
  const filteredDeals = useMemo(() => {
    if (stageFilter === 'all') return deals;
    return deals.filter(d => d.status === stageFilter);
  }, [deals, stageFilter]);

  // Helper to extract unit summary string from pins
  const getDealUnitSummary = (deal: Deal) => {
    if (!deal.config?.pins_json) return null;
    try {
      const pins = JSON.parse(deal.config.pins_json);
      if (!Array.isArray(pins) || pins.length === 0) return null;
      
      const counts: Record<string, number> = {};
      pins.forEach((p: any) => {
        const type = p.type || 'main-tree';
        counts[type] = (counts[type] || 0) + 1;
      });

      const parts: string[] = [];
      if (counts['main-tree']) parts.push(`${counts['main-tree']}x Tree V1`);
      if (counts['small-tree']) parts.push(`${counts['small-tree']}x Tree V2`);
      if (counts['standalone-turbine']) parts.push(`${counts['standalone-turbine']}x Turbína`);

      return parts.join(' + ');
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-900 font-sans select-none">
      
      {/* 1. EXECUTIVE HEADER */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-black/70 font-medium font-mono">
          {t('crm.executiveHeader')}
        </p>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black font-display leading-none">
            {t('crm.salesHub')}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20 font-mono">
              {activeUser?.tier || 'Silver'} ({commissionRate})
            </span>
            <button 
              onClick={onLogout}
              title={t('crm.logout')}
              className="p-2 rounded-full bg-stone-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-black/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User Identity Stripe (Matching App Style) */}
        <div className="border-l-2 border-[#183d89] pl-4 py-2.5 bg-stone-50/80 rounded-r-2xl flex items-center justify-between border border-black/5 shadow-2xs">
          <div>
            <span className="text-sm font-bold text-black block leading-snug">
              {activeUser?.full_name || activeUser?.username}
            </span>
            <span className="text-xs text-black/60 font-medium">
              {activeUser?.partner_name || 'EcoSystems s.r.o.'} • {activeUser?.is_superadmin === 1 ? t('crm.superadminRole') : t('crm.partnerRole')}
            </span>
          </div>

          {onOpenArchive && (
            <button
              type="button"
              onClick={onOpenArchive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/15 hover:border-black/30 text-xs font-semibold text-black shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#183d89]" />
              <span>{t('common.docsAndTraining')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Mode Switcher Tabs (Only if superadmin) */}
      {activeUser?.is_superadmin === 1 && (
        <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-2xl border border-black/10">
          <button
            onClick={() => setViewMode('crm')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'crm' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            {t('crm.clientPortalTab')}
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'admin' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            {t('crm.adminTab')}
          </button>
        </div>
      )}

      {/* SECTION 01 — Overview & Financial Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#183d89] rounded-full inline-block" />
            <span className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
              01 — {t('crm.commissionOverview')}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20 px-2.5 py-0.5 rounded-full uppercase">
            B2B Commercial
          </span>
        </div>

        {/* Hero Pipeline Card */}
        <div className="p-5 rounded-3xl border border-black/10 bg-stone-50/70 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              {t('crm.pipelineVolume')}
            </span>
            <span className="text-[10px] font-mono bg-white border border-black/10 px-2 py-0.5 rounded-lg text-slate-600 font-semibold shadow-2xs">
              Turnover: {formatMoney(totalPipelineTurnover)}
            </span>
          </div>

          <div className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            {formatMoney(paidTotal + pendingTotal + forecastedTotal)}
          </div>

          <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 pt-0.5 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-[#183d89]" />
            <span>{t('crm.activeProjectsCount', { count: deals.length })}</span>
          </div>
        </div>

        {/* 3 Bento Metric Chips (Matching Configurator Style) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-black/10 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              {t('crm.paid')}
            </span>
            <div className="text-xs font-bold text-slate-900 font-mono mt-1">
              {formatMoney(paidTotal)}
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-black/10 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              {t('crm.pending')}
            </span>
            <div className="text-xs font-bold text-slate-900 font-mono mt-1">
              {formatMoney(pendingTotal)}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-[#183d89]/20 text-center shadow-2xs">
            <span className="text-[9px] text-[#183d89] font-bold uppercase tracking-wider block font-mono">
              {t('crm.forecasted')}
            </span>
            <div className="text-xs font-bold text-[#183d89] font-mono mt-1">
              {formatMoney(forecastedTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 02 — Monthly Trajectory Chart */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-[#183d89] rounded-full inline-block" />
          <span className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
            02 — {t('crm.monthlyTrajectory')}
          </span>
        </div>

        <div className="p-5 rounded-3xl border border-black/10 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#183d89]/10 text-[#183d89] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                  Vývoj provizního fondu (CZK)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                  Uzavřené zakázky vs. Pipeline
                </span>
              </div>
            </div>
          </div>

          {/* Simple 2-Color Treetino Chart */}
          <div className="h-[180px] w-full pt-1 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false} 
                  tickLine={false} 
                  width={40}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: '1px solid rgba(0, 0, 0, 0.1)', 
                    borderRadius: '14px', 
                    fontSize: '11px',
                    color: '#0f172a',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                  }}
                  itemStyle={{ fontWeight: 600, fontSize: '10px' }}
                  formatter={(val, name) => [
                    `${Number(val).toLocaleString()} CZK`, 
                    name === 'earned' ? 'Uzavřené provize' : 'Očekávaná pipeline'
                  ]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', paddingTop: '10px' }} 
                  iconType="rect"
                  iconSize={8}
                  formatter={(val) => val === 'earned' ? 'Uzavřené provize (Paid/Pending)' : 'Pipeline v jednání'}
                />
                <Bar dataKey="earned" name="earned" stackId="a" fill="#183d89" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pipeline" name="pipeline" stackId="a" fill="#60a5fa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE CONFIGURED DEAL ACTION BANNER (If editing) */}
      <AnimatePresence>
        {activeDeal && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-l-2 border-t-[#183d89] border-l-[#183d89] bg-stone-50/90 p-4 rounded-br-2xl border-b border-r border-black/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.2em] text-[#183d89] uppercase font-mono">
                  {t('crm.activeDealBanner')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#183d89] text-white px-2.5 py-0.5 rounded-full font-mono">
                    #{activeDeal.id}
                  </span>
                  <button
                    onClick={() => onSelectDeal(null)}
                    className="text-[11px] text-[#183d89] hover:underline font-semibold cursor-pointer"
                  >
                    {t('common.deselect')}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-black font-display">{activeDeal.client_name}</h4>
                <p className="text-xs text-black/60 mt-0.5 leading-relaxed">
                  {t('crm.editDealHelp')}
                </p>
              </div>
              
              <button
                onClick={handleSaveConfig}
                disabled={!currentResult || !currentLocation}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-[#183d89] px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-[#153475] disabled:opacity-50 cursor-pointer shadow-xs gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${savingConfig ? 'animate-spin' : ''}`} />
                <span>{t('crm.saveConfigAndRecalc')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 03 — Deals List & Management */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#183d89] rounded-full inline-block" />
            <span className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">
              03 — {t('crm.dealsListTitle', { count: filteredDeals.length })}
            </span>
          </div>
          <button
            onClick={() => {
              onSelectDeal(null);
              onClosePortal?.();
            }}
            className="text-xs text-[#183d89] hover:underline font-bold cursor-pointer"
          >
            {t('crm.newCalc')}
          </button>
        </div>

        {/* Clean Segmented Filter Bar (Matching Configurator Products Selector) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-2xl border border-black/10 text-xs">
          <button
            onClick={() => setStageFilter('all')}
            className={`py-2 px-1 text-center font-semibold rounded-xl transition-all cursor-pointer truncate ${
              stageFilter === 'all' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Vše ({deals.length})
          </button>
          <button
            onClick={() => setStageFilter('Won')}
            className={`py-2 px-1 text-center font-semibold rounded-xl transition-all cursor-pointer truncate ${
              stageFilter === 'Won' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Won ({wonDealsCount})
          </button>
          <button
            onClick={() => setStageFilter('In Progress')}
            className={`py-2 px-1 text-center font-semibold rounded-xl transition-all cursor-pointer truncate ${
              stageFilter === 'In Progress' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            In Prog ({inProgressDealsCount})
          </button>
          <button
            onClick={() => setStageFilter('Prepared')}
            className={`py-2 px-1 text-center font-semibold rounded-xl transition-all cursor-pointer truncate ${
              stageFilter === 'Prepared' 
                ? 'bg-white text-[#183d89] font-bold shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Prep ({preparedDealsCount})
          </button>
        </div>

        {/* Minimalist Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {filteredDeals.length === 0 ? (
            <div className="text-center text-xs text-black/50 py-8 bg-stone-50 rounded-2xl border border-black/10">
              {t('crm.noDeals')}
            </div>
          ) : (
            filteredDeals.map((deal) => {
              const isSelected = selectedCrmDealId === deal.id;
              const isLoadedInMap = activeDeal?.id === deal.id;
              const hasConfig = !!deal.config;
              const unitSummary = getDealUnitSummary(deal);
              
              return (
                <div 
                  key={deal.id}
                  onClick={() => {
                    const nextSelected = isSelected ? null : deal.id;
                    setSelectedCrmDealId(nextSelected);
                    onPreviewDeal?.(nextSelected ? deal : null);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-2.5 ${
                    isSelected 
                      ? 'border-[#183d89] bg-blue-50/40 shadow-xs ring-1 ring-[#183d89]/20' 
                      : 'border-black/10 hover:border-black/30 bg-white shadow-2xs'
                  }`}
                >
                  {/* Top Row: Client Name & Status Pill */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {deal.client_name}
                    </span>

                    <select
                      value={deal.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(deal.id, e.target.value)}
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer focus:outline-none transition-colors shrink-0 ${
                        deal.status === 'Won' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60 font-bold' 
                          : deal.status === 'Rejected' || deal.status === 'Lost'
                          ? 'bg-stone-100 text-slate-500 border-black/10'
                          : deal.status === 'In Progress'
                          ? 'bg-blue-50 text-[#183d89] border-[#183d89]/20 font-bold'
                          : 'bg-stone-50 text-slate-700 border-black/10'
                      }`}
                    >
                      <option value="Prepared">{t('crm.statusPrepared')}</option>
                      <option value="In Progress">{t('crm.statusInProgress')}</option>
                      <option value="Stuck">{t('crm.statusStuck')}</option>
                      <option value="Rejected">{t('crm.statusRejected')}</option>
                      <option value="Won">{t('crm.statusWon')}</option>
                      <option value="Lost">{t('crm.statusLost')}</option>
                    </select>
                  </div>

                  {/* Metadata & Installation Value */}
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-black/50 font-mono">
                      {deal.ico ? `IČO: ${deal.ico}` : `ID #${deal.id}`}
                      {unitSummary && ` • ${unitSummary}`}
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {hasConfig ? formatMoney(deal.config?.total_price) : t('crm.notConfigured')}
                    </span>
                  </div>

                  {/* Expected Commission */}
                  {hasConfig && (
                    <div className="flex items-center justify-between text-xs pt-0.5 border-t border-black/5">
                      <span className="text-black/50">{t('crm.expectedCommission')}</span>
                      <span className="font-bold text-[#183d89] font-mono">
                        +{formatMoney(deal.config?.commission_forecast || deal.commission?.amount_czk)}
                      </span>
                    </div>
                  )}

                  {/* Bottom Actions: PDF & Open in Map */}
                  <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                    {deal.pdf_path ? (
                      <div className="flex items-center gap-2">
                        <a 
                          href={`${BACKEND_URL}/deals/${deal.id}/pdf?lang=cs`} 
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-[#183d89] hover:underline font-semibold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#183d89]" /> {t('crm.downloadPdf')} (CS)
                        </a>
                        <span className="text-black/20">•</span>
                        <a 
                          href={`${BACKEND_URL}/deals/${deal.id}/pdf?lang=en`} 
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-black/50 hover:text-[#183d89] hover:underline"
                        >
                          EN
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-black/35 italic">{t('crm.noPdf')}</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDeal(deal);
                        onClosePortal?.();
                      }}
                      className="text-xs font-semibold text-[#183d89] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isLoadedInMap ? t('crm.editOnMap') : t('crm.openInMap')}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}


