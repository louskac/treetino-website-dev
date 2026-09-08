import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

    const variantStyles = {
      primary: 'bg-[#183d89] hover:bg-[#132f6b] active:bg-[#0f2452] text-white shadow-[0_4px_15px_rgba(24,61,137,0.25)] hover:shadow-[0_6px_20px_rgba(24,61,137,0.35)]',
      secondary: 'bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-slate-800 hover:text-black border border-black/10 shadow-xs',
      white: 'bg-white hover:bg-stone-50 active:bg-stone-100 text-slate-950 font-bold border border-black/10 shadow-md',
      outline: 'bg-white hover:bg-stone-50 active:bg-stone-100 border border-black/15 hover:border-black/30 text-slate-800 hover:text-black shadow-xs',
      ghost: 'bg-transparent hover:bg-black/5 active:bg-black/10 text-slate-700 hover:text-black',
      danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-[0_4px_15px_rgba(225,29,72,0.3)]',
      accent: 'bg-[#183d89] hover:bg-[#132f6b] active:bg-[#0f2452] text-white shadow-[0_4px_20px_rgba(24,61,137,0.35)]'
    };

    const sizeStyles = {
      sm: 'min-h-9 py-1.5 px-3.5 text-xs rounded-xl gap-1.5',
      md: 'min-h-11 py-2.5 px-5 text-xs sm:text-sm rounded-xl gap-2',
      lg: 'min-h-12 py-3 px-6 text-sm sm:text-base rounded-2xl gap-2.5'
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
