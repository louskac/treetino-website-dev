import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import type { User as UserType } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  onLogin: (user: UserType, rememberMe: boolean) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { t } = useI18n();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login credentials
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Handle Login ──────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError(t('auth.fillLoginFields'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<UserType>(`${BACKEND_URL}/login`, {
        username: loginIdentifier.trim(),
        password: loginPassword.trim()
      });

      onLogin(data, rememberMe);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || t('auth.loginFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Registration ───────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Only email and passwords are required
    if (!email.trim() || !regPassword.trim() || !repeatPassword.trim()) {
      setError(t('auth.fillRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t('auth.invalidEmail'));
      return;
    }

    if (regPassword.length < 6) {
      setError(t('auth.passwordShort'));
      return;
    }

    if (regPassword !== repeatPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    const finalUsername = regUsername.trim() || email.trim().split('@')[0];

    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/register`, {
        full_name: fullName.trim() || null,
        email: email.trim(),
        username: finalUsername,
        password: regPassword.trim(),
        tier: 'Silver',
        partner_id: null
      });

      const { data } = await axios.post<UserType>(`${BACKEND_URL}/login`, {
        username: finalUsername,
        password: regPassword.trim()
      });

      onLogin(data, rememberMe);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || t('auth.registerFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-white p-6 md:p-10 select-none font-sans overflow-y-auto relative">
      
      {/* Top Right Locale Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LocaleSwitcher inverted />
      </div>

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full ${isRegistering ? 'max-w-md' : 'max-w-sm'} my-auto transition-all duration-300`}
      >
        <div className="flex flex-col gap-7">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="mb-2">
              <LogoType className="h-6 w-auto text-black" />
            </div>
            
            <div className="space-y-1 text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#183d89] uppercase block mb-1">
                {t('auth.portalSubtitle')}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-black font-display">
                {isRegistering ? t('auth.registerTitle') : t('auth.loginTitle')}
              </h1>
              <p className="text-sm text-black/60">
                {isRegistering 
                  ? t('auth.registerDesc') 
                  : t('auth.loginDesc')}
              </p>
            </div>
          </div>

          {/* Error Notification */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-xs bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl font-medium text-center shadow-xs">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── 1. LOGIN FORM ────────────────────────────────────── */}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              
              {/* Identifier */}
              <div className="grid gap-1.5 text-left">
                <label className="text-xs font-semibold text-black">
                  {t('auth.usernameOrEmail')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={t('auth.usernameOrEmailPlaceholder')}
                  required
                  autoFocus
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                />
              </div>

              {/* Password */}
              <div className="grid gap-1.5 text-left">
                <label className="text-xs font-semibold text-black">
                  {t('auth.password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                    className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 pr-10 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black p-1 transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-black/20 text-[#183d89] focus:ring-[#183d89] accent-[#183d89] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-medium text-black/70 select-none cursor-pointer hover:text-black transition-colors">
                  {t('auth.rememberMe')}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#183d89] hover:bg-[#153475] px-4 py-2.5 text-center text-sm font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? t('auth.loggingIn') : t('auth.loginBtn')}</span>
              </button>

              {/* Switch to Registration */}
              <div className="text-center text-xs text-black/60 pt-2">
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError(null);
                  }}
                  className="text-[#183d89] hover:underline font-semibold cursor-pointer"
                >
                  {t('auth.registerLink')}
                </button>
              </div>

            </form>
          ) : (

            /* ─── 2. REGISTRATION FORM ──────────────────────────────── */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              
              {/* Full Name (Optional) */}
              <div className="grid gap-1 text-left">
                <label className="text-xs font-semibold text-black">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('auth.fullNamePlaceholder')}
                  autoFocus
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                />
              </div>

              {/* Email (Required) */}
              <div className="grid gap-1 text-left">
                <label className="text-xs font-semibold text-black">
                  {t('auth.email')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                />
              </div>

              {/* Username (Optional) */}
              <div className="grid gap-1 text-left">
                <label className="text-xs font-semibold text-black">
                  {t('auth.username')}
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder={t('auth.usernamePlaceholder')}
                  className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                />
              </div>

              {/* Password & Confirm Password in One 2-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1 text-left">
                  <label className="text-xs font-semibold text-black">
                    {t('auth.password')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t('auth.passwordMinLength')}
                      required
                      className="h-10 w-full rounded-xl border border-black/15 bg-white px-3.5 pr-9 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-2 focus:ring-[#183d89]/15 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black p-1 transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-1 text-left">
                  <label className="text-xs font-semibold text-black">
                    {t('auth.confirmPassword')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                    className={`h-10 w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-black placeholder:text-black/35 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                      repeatPassword && regPassword !== repeatPassword
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-black/15 focus:border-[#183d89] focus:ring-[#183d89]/15'
                    }`}
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="border-l-2 border-[#183d89] pl-3 py-2 bg-stone-50/80 rounded-r-xl text-left mt-1">
                <p className="text-[11px] text-black/60 leading-relaxed font-medium">
                  {t('auth.adminNote')}
                </p>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#183d89] hover:bg-[#153475] px-4 py-2.5 text-center text-sm font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? t('auth.registering') : t('auth.registerBtn')}</span>
              </button>

              {/* Switch to Login */}
              <div className="text-center text-xs text-black/60 pt-2">
                {t('auth.haveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError(null);
                  }}
                  className="text-[#183d89] hover:underline font-semibold cursor-pointer"
                >
                  {t('auth.loginLink')}
                </button>
              </div>

            </form>
          )}

          {/* Footer Note */}
          <div className="text-center text-[10px] text-black/40 font-mono">
            {t('auth.footerTagline')}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
