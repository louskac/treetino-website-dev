import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      rightElement,
      helperText,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5 select-none"
          >
            {icon && <span className="text-[#183d89] shrink-0">{icon}</span>}
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-black/50 border text-sm rounded-xl py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none transition-all duration-200 ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50'
                : 'border-white/15 focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89]'
            } ${rightElement ? 'pr-12' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <span className="text-[10px] text-rose-400 font-medium block">
            {error}
          </span>
        )}

        {helperText && !error && (
          <span className="text-[10px] text-slate-400 block">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
