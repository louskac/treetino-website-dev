import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Car, TreePine, Shield, Zap, Sparkles, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CalcResult, ROIResult } from '../types';
import { useI18n } from '../i18n';

interface Props {
    result: CalcResult;
    energyCost: number;
    web3Enabled: boolean;
    esgEnabled: boolean;
    onExportPdf?: () => void;
}

export default function AnalyticsPanel({ result, energyCost, web3Enabled, esgEnabled, onExportPdf }: Props) {
    const { t, locale } = useI18n();
    const totalKwh = result.annualSolarKwh + result.annualWindKwh;
    const annualSavings = result.totalAnnualRevenue;
    const co2Offset = result.co2Savings;
    const treesEquiv = result.treesEquivalent;
    const evKm = Math.round(co2Offset * 8000).toLocaleString();

    // ROI
    const investment = result.investment;
    const paybackYears = result.paybackPeriod;
    const roiPercentage = result.roi;

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-6 w-full h-[320px]"
        >
            {/* Card 1: Production (Stacked Solar & Wind) */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl text-slate-900 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-16 h-16 text-[#183d89]" />
                </div>
                <EnergyChart data={result.monthlyData} totalKwh={totalKwh} lastWeekKwh={result.lastWeekKwh} />
            </div>

            {/* Card 2: Economics */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl text-slate-900 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[#183d89]" />
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('analytics.financialRoi')}</h3>
                    </div>
                    {onExportPdf && (
                        <button
                            onClick={onExportPdf}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#183d89] hover:bg-[#132f6b] active:bg-[#0f2452] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t('common.exportPdf')}</span>
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-black/10 bg-slate-50">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono mb-1">{t('analytics.payback')}</p>
                        <p className="text-3xl font-bold text-[#183d89]">
                            {paybackYears} <span className="text-xs uppercase text-slate-500 font-normal">{t('common.years')}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-700 font-mono">{roiPercentage}% {t('analytics.returnRate')}</span>
                            {web3Enabled && (
                                <span className="text-[9px] font-mono font-bold bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20 px-2 py-0.5 rounded-full uppercase">{t('analytics.p2pNetwork')}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-black/10">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">{t('analytics.totalInvestment')}</p>
                            <p className="text-sm font-bold text-slate-900 font-mono">{investment.toLocaleString()} {t('common.currency')}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">{t('analytics.savingsPerYear')}</p>
                            <p className="text-sm font-bold text-emerald-600 font-mono">{annualSavings.toLocaleString()} {t('common.currency')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3: ESG */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl text-slate-900 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Leaf className="w-5 h-5 text-[#183d89]" />
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('analytics.ecologicalImpact')}</h3>
                    </div>
                    {esgEnabled && <Shield className="w-4 h-4 text-[#183d89]" />}
                </div>

                <div className="space-y-5">
                    <div className="p-4 rounded-2xl border border-black/10 bg-slate-50">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono mb-1">{t('analytics.co2Savings')}</p>
                        <p className="text-3xl font-bold text-slate-900">
                            {co2Offset.toFixed(1)} <span className="text-xs uppercase text-slate-500 font-normal">{t('common.tonsPerYear')}</span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-[#183d89]/10 border border-[#183d89]/20 flex items-center justify-center shrink-0">
                                <TreePine className="w-4 h-4 text-[#183d89]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 leading-none font-mono">{treesEquiv.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t('analytics.plantedTrees')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-[#183d89]/10 border border-[#183d89]/20 flex items-center justify-center shrink-0">
                                <Car className="w-4 h-4 text-[#183d89]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 leading-none font-mono">{evKm} KM</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t('analytics.evMileage')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Energy Chart (Stacked Solar & Wind) ───────────────────
function EnergyChart({ data, totalKwh, lastWeekKwh }: { data: ROIResult['monthlyData']; totalKwh: number; lastWeekKwh: number }) {
    const { t, locale } = useI18n();

    const monthMapCsToEn: Record<string, string> = {
        'Led': 'Jan', 'Úno': 'Feb', 'Bře': 'Mar', 'Dub': 'Apr',
        'Kvě': 'May', 'Čvn': 'Jun', 'Čvc': 'Jul', 'Srp': 'Aug',
        'Zář': 'Sep', 'Říj': 'Oct', 'Lis': 'Nov', 'Pro': 'Dec'
    };

    const localizedData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            ...item,
            monthLabel: locale === 'en' ? (monthMapCsToEn[item.month] || item.month) : item.month
        }));
    }, [data, locale]);

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#183d89]/10 border border-[#183d89]/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#183d89]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('analytics.productionTitle')}</h3>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">{t('analytics.lastWeek')}</span>
                    <span className="text-sm font-bold text-[#183d89] font-mono">{lastWeekKwh.toLocaleString()} kWh</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 font-mono">{t('analytics.realData')}</span>
                </div>
            </div>

            <div className="flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={localizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="0" stroke="rgba(0, 0, 0, 0.06)" vertical={false} />
                        <XAxis
                            dataKey="monthLabel"
                            tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            tickFormatter={(v: number) => `${Math.round(v)}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                            contentStyle={{
                                background: '#ffffff',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '14px',
                                fontSize: '11px',
                                color: '#0f172a',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ fontWeight: 600, fontSize: '10px' }}
                            formatter={(v, name) => [`${Number(v).toLocaleString()} kWh`, name]}
                        />
                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '15px' }} iconType="rect" iconSize={8} />
                        <Bar dataKey="solar" name={t('analytics.solar')} stackId="a" fill="#183d89" />
                        <Bar dataKey="wind" name={t('analytics.wind')} stackId="a" fill="#60a5fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
