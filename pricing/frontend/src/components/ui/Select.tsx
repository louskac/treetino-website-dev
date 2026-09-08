import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string | null;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      error,
      icon,
      children,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5 select-none"
          >
            {icon && <span className="text-[#183d89] shrink-0">{icon}</span>}
            <span>{label}</span>
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`w-full bg-black/50 border text-sm rounded-xl py-2.5 px-4 text-white focus:outline-none transition-colors cursor-pointer ${
            error
              ? 'border-rose-500/80 focus:border-rose-500'
              : 'border-white/15 focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#090d16] text-white">
                {opt.label}
              </option>
            ))
          )}
        </select>

        {error && (
          <span className="text-[10px] text-rose-400 font-medium block">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
