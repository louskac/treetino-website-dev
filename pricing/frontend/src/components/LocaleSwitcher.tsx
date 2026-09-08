import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, type Locale } from '../i18n';

interface LocaleSwitcherProps {
  inverted?: boolean;
  className?: string;
}

export default function LocaleSwitcher({ inverted = false, className = '' }: LocaleSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales: Locale[] = ['cs', 'en'];
  const formatLocale = (value: string) => value.toUpperCase();

  const handleSelect = (targetLocale: Locale) => {
    setIsOpen(false);
    if (targetLocale !== locale) {
      setLocale(targetLocale);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        aria-label="Change language"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex h-[40px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition focus:ring-2 focus:outline-none ${
          inverted
            ? 'border-black/10 bg-black/5 text-black hover:bg-black/10 focus:ring-black/10'
            : 'border-white/20 bg-white/15 text-white hover:bg-white/25 focus:ring-white/20'
        }`}
      >
        <Globe className="w-4 h-4 shrink-0" strokeWidth={2} />
        <span>{formatLocale(locale)}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute right-0 z-50 mt-2 min-w-28 overflow-hidden rounded-xl p-1 shadow-xl backdrop-blur ${
              inverted
                ? 'border border-black/10 bg-white text-black'
                : 'border border-white/10 bg-neutral-950/95 text-white'
            }`}
          >
            {locales.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  inverted
                    ? item === locale
                      ? 'bg-black/10 hover:bg-black/10'
                      : 'hover:bg-black/5'
                    : item === locale
                    ? 'bg-white/10 hover:bg-white/10'
                    : 'hover:bg-white/10'
                }`}
              >
                <span>{formatLocale(item)}</span>
                {item === locale && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      inverted ? 'bg-black' : 'bg-white'
                    }`}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
