import React from 'react';

export interface BadgeProps {
  variant?: 'status' | 'tier' | 'custom';
  status?: 'Prepared' | 'In Progress' | 'Stuck' | 'Rejected' | 'Won' | 'Lost' | string;
  tier?: 'Silver' | 'Gold' | 'Platinum' | 'ADMIN' | string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'custom',
  status,
  tier,
  label,
  className = '',
  children
}) => {
  if (variant === 'status' && status) {
    const statusStyles: Record<string, string> = {
      Won: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      Rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      Lost: 'bg-slate-500/15 text-slate-400 border-white/10',
      Prepared: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      Stuck: 'bg-orange-500/15 text-orange-300 border-orange-500/30'
    };

    const statusLabels: Record<string, string> = {
      Prepared: 'Příprava',
      'In Progress': 'V jednání',
      Stuck: 'Zaseknuto',
      Rejected: 'Zamítnuto',
      Won: 'Vyhráno',
      Lost: 'Prohráno'
    };

    const currentStyle = statusStyles[status] || 'bg-slate-500/15 text-slate-400 border-white/10';
    const displayLabel = label || statusLabels[status] || status;

    return (
      <span className={`inline-flex items-center text-[9px] font-bold py-0.5 px-2.5 rounded-full border ${currentStyle} ${className}`}>
        {displayLabel}
      </span>
    );
  }

  if (variant === 'tier' && tier) {
    const tierStyles: Record<string, string> = {
      ADMIN: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      Platinum: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      Gold: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      Silver: 'bg-slate-500/15 text-slate-300 border-white/10'
    };

    const currentStyle = tierStyles[tier] || 'bg-slate-500/15 text-slate-300 border-white/10';

    return (
      <span className={`inline-flex items-center text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest font-mono ${currentStyle} ${className}`}>
        {label || tier}
      </span>
    );
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border border-[#183d89]/30 bg-[#183d89]/15 text-blue-300 font-mono ${className}`}>
      {children || label}
    </span>
  );
};
