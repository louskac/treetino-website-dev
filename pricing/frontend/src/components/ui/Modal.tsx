import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = '4xl',
  children,
  className = '',
  showCloseButton = true
}) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl'
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 overflow-hidden"
          onClick={onClose}
        >
          {/* Subtle Ambient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#183d89]/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2762ad]/10 blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidthClass} bg-[#090d16] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative ${className}`}
          >
            {(title || showCloseButton) && (
              <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="p-2 rounded-xl bg-[#183d89]/15 border border-[#183d89]/30 text-blue-300 shrink-0">
                      {icon}
                    </div>
                  )}
                  <div>
                    {title && (
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5 font-mono">
                        {subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {showCloseButton && onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-black/40 border border-white/15 hover:border-white/30 text-slate-400 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
