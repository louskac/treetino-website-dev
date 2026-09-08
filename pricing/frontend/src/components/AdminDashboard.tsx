import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Search, 
  FileText, 
  MapPin, 
  LogOut,
  ShieldCheck,
  Download,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Deal, User as UserType } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  activeUser: UserType | null;
  onLogout: () => void;
  viewMode: 'crm' | 'admin';
  setViewMode: (mode: 'crm' | 'admin') => void;
  onSelectDeal: (deal: Deal | null) => void;
  allDeals: Deal[];
  onRefreshDeals: () => Promise<void> | void;
}

function SignatureRenderer({ signature, fallbackName }: { signature?: string | null; fallbackName: string }) {
  if (!signature) {
    return (
      <span className="font-serif italic text-base text-[#183d89] font-bold">
        {fallbackName}
      </span>
    );
  }

  if (signature.trim().startsWith('<svg') || signature.includes('<svg')) {
    return (
      <div 
        className="h-10 w-full flex items-center justify-center mix-blend-multiply [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-h-10 pointer-events-none"
        dangerouslySetInnerHTML={{ __html: signature }} 
      />
    );
  }

  if (signature.startsWith('data:image')) {
    return (
      <img src={signature} alt="Podpis" className="h-10 object-contain mix-blend-multiply pointer-events-none" />
    );
  }

  return (
    <span className="font-serif italic text-base text-[#183d89] font-bold">
      {signature}
    </span>
  );
}

export default function AdminDashboard({
  activeUser,
  onLogout,
  viewMode,
  setViewMode,
  onSelectDeal,
  allDeals,
  onRefreshDeals
}: Props) {
  const { t, locale } = useI18n();
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Silver' | 'Gold' | 'Platinum'>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Fetch all users and their metrics
  const fetchAdminUsers = async () => {
    if (!activeUser) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/admin/users?user_id=${activeUser.id}`);
      setAdminUsers(data);
      
      if (selectedUser) {
        const updated = data.find((u: any) => u.id === selectedUser.id);
        if (updated) {
          setSelectedUser(updated);
        }
      }
    } catch (e) {
      console.error('Failed to fetch admin users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, [activeUser, allDeals]);

  // Update deal status directly from admin view
  const handleDealStatusChange = async (dealId: number, nextStatus: string) => {
    try {
      await axios.put(`${BACKEND_URL}/deals/${dealId}/status`, { status: nextStatus });
      await onRefreshDeals();
      await fetchAdminUsers();
    } catch (err) {
      console.error('Failed to update deal status', err);
    }
  };

  // Format money helper
  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return `0 ${t('common.currency')}`;
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'cs-CZ', { 
      style: 'currency', 
      currency: 'CZK', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Calculate platform totals
  const totalPlatformUsers = adminUsers.length;
  const totalDealsCount = adminUsers.reduce((sum, u) => sum + (u.deal_count || 0), 0);
  const totalDealsValue = adminUsers.reduce((sum, u) => sum + (u.total_deal_value || 0), 0);
  const totalCommissionsValue = adminUsers.reduce((sum, u) => sum + (u.total_commission || 0), 0);

  // Chart Data
  const chartData = useMemo(() => {
    return adminUsers
      .filter(u => (u.total_deal_value || 0) > 0 || (u.total_commission || 0) > 0)
      .map(u => ({
        name: u.username,
        turnover: Math.round((u.total_deal_value || 0) / 1000),
        commissions: u.total_commission || 0
      }))
      .slice(0, 7);
  }, [adminUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(u => {
      const q = searchQuery.toLowerCase();
      const matchesQuery = (
        u.username.toLowerCase().includes(q) ||
        (u.partner_name && u.partner_name.toLowerCase().includes(q)) ||
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.tier && u.tier.toLowerCase().includes(q))
      );

      if (!matchesQuery) return false;
      if (tierFilter === 'all') return true;
      return u.tier === tierFilter;
    });
  }, [adminUsers, searchQuery, tierFilter]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col h-screen overflow-hidden font-sans select-none text-slate-900">
      
      {/* ─── Top Header Bar (Identical to OnboardingArchiveModal & App Header) ─── */}
      <header className="h-16 border-b border-black/10 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-white shadow-2xs z-30">
        <div className="flex items-center gap-6">
          <LogoType className="h-5.5 w-auto text-black" />
          <div className="h-4 w-px bg-black/15 hidden sm:block" />
          <span className="text-xs font-semibold tracking-wider text-black/50 uppercase hidden sm:inline">
            {t('common.b2bPortal')} • {t('admin.hubTitle')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20">
            <span>{activeUser?.full_name || activeUser?.username}</span>
            <span>•</span>
            <span>{t('admin.administrator')}</span>
          </div>

          <div className="hidden sm:block">
            <LocaleSwitcher inverted />
          </div>

          <button
            onClick={() => setViewMode('crm')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black/70 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <span>{t('admin.clientCrmSection')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            title={t('crm.logout')}
            className="p-2 rounded-full bg-stone-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-black/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ─── Main 2-Column Split Workspace (Matching OnboardingArchiveModal Architecture) ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT PANEL: Navigation Directory & Partner List
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[440px] xl:w-[480px] border-r border-black/10 bg-white flex flex-col justify-between shrink-0 overflow-y-auto p-6 sm:p-7">
          
          <div className="flex flex-col gap-5">
            
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] text-[10px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>{t('admin.platformManagement')}</span>
              </div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight">
                {t('admin.salesTeamManagement')}
              </h1>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                Přehled obchodních partnerů, smluvní dokumentace a zakázek.
              </p>
            </div>

            {/* Executive Hero Metric (matching CRM executive style) */}
            <div className="border-l-2 border-[#183d89] pl-4 py-3 bg-stone-50/80 rounded-r-2xl border-y border-r border-black/10 shadow-xs space-y-1">
              <span className="text-xs text-black/60 uppercase tracking-widest font-medium block">
                {t('admin.pipelineTurnover')}
              </span>
              <div className="text-2xl font-medium tracking-tight text-black">
                {formatMoney(totalDealsValue)}
              </div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 pt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{totalDealsCount} {t('admin.totalDeals')} • Provize: {formatMoney(totalCommissionsValue)}</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-black/35 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('admin.searchSalesperson')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 pl-9.5 py-2 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs font-medium"
              />
            </div>

            {/* Tier Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-black/10">
              <button
                onClick={() => setTierFilter('all')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tierFilter === 'all'
                    ? 'bg-white text-[#183d89] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Vše ({adminUsers.length})
              </button>
              <button
                onClick={() => setTierFilter('Silver')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tierFilter === 'Silver'
                    ? 'bg-white text-[#183d89] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Silver
              </button>
              <button
                onClick={() => setTierFilter('Gold')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tierFilter === 'Gold'
                    ? 'bg-white text-[#183d89] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Gold
              </button>
              <button
                onClick={() => setTierFilter('Platinum')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tierFilter === 'Platinum'
                    ? 'bg-white text-[#183d89] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Platinum
              </button>
            </div>

            {/* Partners List */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                {t('admin.b2bPartners')} ({filteredUsers.length})
              </span>

              {loading ? (
                <div className="text-center py-8 text-xs text-black/50 font-medium">
                  Načítání partnerů...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-xs text-black/50 italic">
                  {t('admin.noMatches')}
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  const commRate = u.tier === 'Platinum' ? '12%' : u.tier === 'Gold' ? '8%' : '5%';

                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(isSelected ? null : u)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                          : 'border-black/10 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 font-mono text-xs font-bold ${
                        isSelected ? 'bg-[#183d89] text-white' : 'bg-stone-100 text-black/70'
                      }`}>
                        {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-black truncate">
                            {u.full_name || u.username}
                          </span>
                          <span className="text-[10px] font-semibold text-[#183d89] bg-[#183d89]/10 px-2 py-0.5 rounded-full shrink-0 border border-[#183d89]/20">
                            {u.is_superadmin ? 'ADMIN' : `${u.tier} (${commRate})`}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-black/60 mt-0.5 truncate">
                          {u.partner_name || t('admin.independentPartner')} • {u.deal_count} zakázek
                        </p>
                        
                        {/* Financial summary + contract indicators */}
                        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-black/5 text-[11px]">
                          <span className="font-semibold text-black">
                            {formatMoney(u.total_deal_value)}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {u.nda_signed && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                                NDA ✓
                              </span>
                            )}
                            {u.mediation_signed && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                                Smlouva ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-6 border-t border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-black/60">
              <span>Aktivní partneři v síti</span>
              <span className="font-semibold text-black">{totalPlatformUsers}</span>
            </div>

            <button
              onClick={() => setViewMode('crm')}
              className="w-full inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold bg-[#183d89] hover:bg-[#153475] text-white transition-all shadow-xs cursor-pointer gap-2"
            >
              <span>{t('admin.clientCrmSection')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT PANEL: Partner Detail Workspace OR Platform Overview
           ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-stone-100/60 p-6 sm:p-8 lg:p-10 flex flex-col items-center overflow-y-auto">
          
          {selectedUser ? (
            /* ─── A. SELECTED PARTNER DETAIL VIEW ─── */
            <div className="max-w-3xl w-full flex flex-col gap-6">
              
              {/* Partner Profile Header Card */}
              <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-black font-display">
                      {selectedUser.full_name || selectedUser.username}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20">
                      {selectedUser.is_superadmin ? 'ADMIN' : `${selectedUser.tier} Partner`}
                    </span>
                  </div>
                  <p className="text-xs text-black/60 mt-1">
                    {selectedUser.partner_name || t('admin.independentPartner')} • Uživatel: @{selectedUser.username} • ID #{selectedUser.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-black/70 transition-colors cursor-pointer"
                >
                  ✕ {t('common.deselect')}
                </button>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs">
                  <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                    {t('admin.dealsCol')}
                  </span>
                  <div className="text-2xl font-bold text-black mt-1 font-mono">
                    {selectedUser.deal_count}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs">
                  <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                    {t('admin.turnoverCol')}
                  </span>
                  <div className="text-xl font-bold text-black mt-1 font-mono">
                    {formatMoney(selectedUser.total_deal_value)}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs">
                  <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                    {t('admin.commissionsCol')}
                  </span>
                  <div className="text-xl font-bold text-[#183d89] mt-1 font-mono">
                    {formatMoney(selectedUser.total_commission)}
                  </div>
                </div>
              </div>

              {/* Legal Documentation Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider">
                  Smluvní Dokumentace a Podpisy
                </h3>

                {/* NDA Card */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-stone-100 text-black/70">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">Dohoda o mlčenlivosti (NDA)</h4>
                        <span className="text-[11px] text-black/50">
                          {selectedUser.nda_signed ? `Podepsáno: ${selectedUser.nda_signed_at}` : 'Nepodepsáno'}
                        </span>
                      </div>
                    </div>

                    {selectedUser.nda_signed && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`${BACKEND_URL}/users/${selectedUser.id}/nda/download?lang=cs`}
                          download={`NDA_Treetino_${selectedUser.username}_CS.pdf`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#183d89] hover:text-white text-xs font-semibold text-black transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>CS PDF</span>
                        </a>
                        <a
                          href={`${BACKEND_URL}/users/${selectedUser.id}/nda/download?lang=en`}
                          download={`NDA_Treetino_${selectedUser.username}_EN.pdf`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#183d89] hover:text-white text-xs font-semibold text-black transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>EN PDF</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedUser.nda_signed && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-black/5 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-black/50 block text-[10px] uppercase font-bold">Firma / Zástupce</span>
                        <span className="font-semibold text-black">{selectedUser.nda_company || selectedUser.nda_representative || '—'}</span>
                      </div>
                      <div>
                        <span className="text-black/50 block text-[10px] uppercase font-bold">IČO / Datum nar.</span>
                        <span className="font-semibold text-black">{selectedUser.nda_ico_dob || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-black/50 block text-[10px] uppercase font-bold">Podpis partnera</span>
                        <div className="h-10 flex items-center mt-1">
                          <SignatureRenderer signature={selectedUser.nda_signature} fallbackName={selectedUser.username} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mediation Card */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-stone-100 text-black/70">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">Smlouva o zprostředkování</h4>
                        <span className="text-[11px] text-black/50">
                          {selectedUser.mediation_signed ? `Podepsáno: ${selectedUser.mediation_signed_at}` : 'Nepodepsáno'}
                        </span>
                      </div>
                    </div>

                    {selectedUser.mediation_signed && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`${BACKEND_URL}/users/${selectedUser.id}/mediation/download?lang=cs`}
                          download={`Smlouva_Zprostredkovani_Treetino_${selectedUser.username}_CS.pdf`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#183d89] hover:text-white text-xs font-semibold text-black transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>CS PDF</span>
                        </a>
                        <a
                          href={`${BACKEND_URL}/users/${selectedUser.id}/mediation/download?lang=en`}
                          download={`Mediation_Agreement_Treetino_${selectedUser.username}_EN.pdf`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#183d89] hover:text-white text-xs font-semibold text-black transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>EN PDF</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedUser.mediation_signed && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-black/5 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-black/50 block text-[10px] uppercase font-bold">Firma / Zprostředkovatel</span>
                        <span className="font-semibold text-black">{selectedUser.mediation_company || selectedUser.mediation_representative || '—'}</span>
                      </div>
                      <div>
                        <span className="text-black/50 block text-[10px] uppercase font-bold">IČO / Datum nar.</span>
                        <span className="font-semibold text-black">{selectedUser.mediation_ico_dob || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-black/50 block text-[10px] uppercase font-bold">Podpis zprostředkovatele</span>
                        <div className="h-10 flex items-center mt-1">
                          <SignatureRenderer signature={selectedUser.mediation_signature} fallbackName={selectedUser.username} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Partner Deals List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-black/50 uppercase tracking-wider">
                  Zakázky Partnera ({selectedUser.deals?.length || 0})
                </h3>

                {(!selectedUser.deals || selectedUser.deals.length === 0) ? (
                  <div className="p-6 bg-white rounded-2xl border border-black/10 text-center text-xs text-black/50 italic">
                    Partner zatím nemá založené žádné zakázky.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedUser.deals.map((deal: any) => {
                      const parentDeal = allDeals.find(d => d.id === deal.id);
                      const hasConfig = !!parentDeal?.config;
                      const totalPrice = parentDeal?.config?.total_price;
                      const commForecast = parentDeal?.config?.commission_forecast;

                      return (
                        <div
                          key={deal.id}
                          className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-black">{deal.client_name}</h4>
                              <span className="text-xs text-black/50">
                                #{deal.id} • {new Date(deal.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'cs-CZ')}
                              </span>
                            </div>

                            <select
                              value={deal.status}
                              onChange={(e) => handleDealStatusChange(deal.id, e.target.value)}
                              className="text-xs font-semibold py-1 px-3 rounded-full bg-stone-100 border border-black/10 cursor-pointer focus:outline-none text-black"
                            >
                              <option value="Prepared">{t('crm.statusPrepared')}</option>
                              <option value="In Progress">{t('crm.statusInProgress')}</option>
                              <option value="Stuck">{t('crm.statusStuck')}</option>
                              <option value="Rejected">{t('crm.statusRejected')}</option>
                              <option value="Won">{t('crm.statusWon')}</option>
                              <option value="Lost">{t('crm.statusLost')}</option>
                            </select>
                          </div>

                          {hasConfig && (
                            <div className="p-3 bg-stone-50 rounded-xl border border-black/5 grid grid-cols-2 gap-2 text-xs font-mono">
                              <div>
                                <span className="text-black/50 text-[10px] block">Cena nabídky</span>
                                <span className="font-bold text-black">{formatMoney(totalPrice)}</span>
                              </div>
                              <div>
                                <span className="text-black/50 text-[10px] block">Provize partnera</span>
                                <span className="font-bold text-[#183d89]">{formatMoney(commForecast)}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                            {parentDeal?.pdf_path ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={`${BACKEND_URL}/deals/${parentDeal.id}/pdf?lang=cs`}
                                  download
                                  className="font-semibold text-[#183d89] hover:underline flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5" /> PDF (CS)
                                </a>
                                <span className="text-black/20">•</span>
                                <a
                                  href={`${BACKEND_URL}/deals/${parentDeal.id}/pdf?lang=en`}
                                  download
                                  className="font-semibold text-[#183d89] hover:underline flex items-center gap-1"
                                >
                                  PDF (EN)
                                </a>
                              </div>
                            ) : (
                              <span className="text-black/40 italic">Bez PDF nabídky</span>
                            )}

                            <button
                              onClick={() => {
                                if (parentDeal) {
                                  onSelectDeal(parentDeal);
                                  setViewMode('crm');
                                  setSelectedUser(null);
                                }
                              }}
                              className="font-semibold text-[#183d89] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{t('admin.loadOnMap')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* ─── B. OVERVIEW WORKSPACE (WHEN NO PARTNER IS SELECTED) ─── */
            <div className="max-w-3xl w-full flex flex-col gap-6">
              
              {/* Executive Overview Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-black/10 shadow-xs space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-black/70 font-medium">
                    {t('crm.executiveHeader')}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-black font-display mt-1">
                    Přehled Partnerské Sítě Treetino
                  </h2>
                  <p className="text-xs text-black/60 mt-1 leading-relaxed">
                    Vyberte partnera v levém panelu pro detailní kontrolu smluv, podpisů a aktivních zakázek.
                  </p>
                </div>

                {/* 2-Column Stats Grid (matching CRM panel) */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/10">
                  <div className="border-l border-black/15 pl-4">
                    <div className="text-2xl font-medium tracking-tight text-black">
                      {formatMoney(totalDealsValue)}
                    </div>
                    <h3 className="mt-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t('admin.pipelineTurnover')}</h3>
                    <p className="mt-1 text-xs text-black/60 leading-relaxed">Celkový objem vytvořených nabídek v síti.</p>
                  </div>

                  <div className="border-l border-black/15 pl-4">
                    <div className="text-2xl font-medium tracking-tight text-[#183d89]">
                      {formatMoney(totalCommissionsValue)}
                    </div>
                    <h3 className="mt-1 text-xs font-semibold text-[#183d89] uppercase tracking-wider">{t('admin.totalCommissions')}</h3>
                    <p className="mt-1 text-xs text-black/60 leading-relaxed">Celková provizní alokace pro partnery.</p>
                  </div>
                </div>
              </div>

              {/* Performance Bar Chart Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-black/10 shadow-xs flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-black font-display">
                    {t('admin.salesPerformance')}
                  </h3>
                  <span className="text-xs text-black/60">
                    {t('admin.commissionDist')} (CZK)
                  </span>
                </div>

                {chartData.length > 0 ? (
                  <div className="h-[240px] w-full select-none pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={40} />
                        <Tooltip 
                          contentStyle={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                          labelStyle={{ color: '#000000', fontSize: '11px', fontWeight: 'bold' }} 
                          itemStyle={{ fontSize: '11px', color: '#183d89' }}
                        />
                        <Bar dataKey="commissions" fill="#183d89" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-xs text-black/40 italic">
                    {t('admin.noChartData')}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}



