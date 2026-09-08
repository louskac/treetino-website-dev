import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'panel' | 'card' | 'plate' | 'transparent';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'card', className = '', ...props }, ref) => {
    const variantStyles = {
      panel: 'neo-panel',
      card: 'neo-card',
      plate: 'neo-glass-plate',
      transparent: 'bg-slate-900/40 border border-slate-800/80 rounded-2xl'
    };

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
