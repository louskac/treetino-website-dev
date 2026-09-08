import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles,
  Award,
  Video,
  Globe
} from 'lucide-react';
import type { User } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  activeUser: User;
  onVideosCompleted: (updatedUser: User) => void;
  // If true, this is opened in review/archive mode from the main app (not blocking entry)
  isReviewMode?: boolean;
  onCloseReview?: () => void;
}

export default function VideoOnboardingModal({ 
  activeUser, 
  onVideosCompleted, 
  isReviewMode = false,
  onCloseReview 
}: Props) {
  const { t, locale } = useI18n();
  const [selectedVideo, setSelectedVideo] = useState<1 | 2>(1);
  const [video1Lang, setVideo1Lang] = useState<'cz' | 'en'>(locale === 'en' ? 'en' : 'cz');
  const [video2Lang, setVideo2Lang] = useState<'cz' | 'en'>(locale === 'en' ? 'en' : 'cz');

  // Sync initial video lang when app locale changes
  useEffect(() => {
    setVideo1Lang(locale === 'en' ? 'en' : 'cz');
    setVideo2Lang(locale === 'en' ? 'en' : 'cz');
  }, [locale]);

  // Video completion tracking
  const [video1Watched, setVideo1Watched] = useState(isReviewMode || Boolean(activeUser.videos_completed));
  const [video2Watched, setVideo2Watched] = useState(isReviewMode || Boolean(activeUser.videos_completed));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const CDN_BASE = 'https://github.com/louskac/treetino-pricing/releases/download/v1.0-videos';

  // Video 1 Sources (Original 4K UHD with FastStart)
  const video1Sources = {
    cz: `${CDN_BASE}/onboarding_1_cz.mp4`,
    en: `${CDN_BASE}/onboarding_1_en.mp4`
  };

  // Video 2 Sources (Original 4K UHD with FastStart)
  const video2Sources = {
    cz: `${CDN_BASE}/onboarding_2_cz.mp4`,
    en: `${CDN_BASE}/onboarding_2_en.mp4`
  };

  // Track Video 1 progress
  const handleVideo1TimeUpdate = () => {
    if (!video1Ref.current) return;
    const { currentTime, duration } = video1Ref.current;
    if (duration > 0 && (currentTime / duration >= 0.90 || currentTime >= duration - 3)) {
      setVideo1Watched(true);
    }
  };

  const handleVideo1Ended = () => {
    setVideo1Watched(true);
  };

  // Track Video 2 progress
  const handleVideo2TimeUpdate = () => {
    if (!video2Ref.current) return;
    const { currentTime, duration } = video2Ref.current;
    if (duration > 0 && (currentTime / duration >= 0.90 || currentTime >= duration - 3)) {
      setVideo2Watched(true);
    }
  };

  const handleVideo2Ended = () => {
    setVideo2Watched(true);
  };

  // Handle final completion
  const handleFinishOnboarding = async () => {
    if (!video1Watched || !video2Watched) {
      setError(t('videoOnboarding.errorMustWatch'));
      return;
    }

    if (isReviewMode && onCloseReview) {
      onCloseReview();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<User>(`${BACKEND_URL}/users/${activeUser.id}/complete-video-onboarding`);
      
      // Update local storage
      const cached = localStorage.getItem('treetino_user') ? localStorage : sessionStorage;
      cached.setItem('treetino_user', JSON.stringify(data));

      onVideosCompleted(data);
    } catch (err: any) {
      console.error(err);
      setError('Nepodařilo se uložit dokončení školení. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const bothWatched = video1Watched && video2Watched;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col h-screen overflow-hidden font-sans select-none">
      
      {/* ─── Top Header Bar ─── */}
      <header className="h-16 border-b border-black/10 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-white shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-0">
          <LogoType className="h-5.5 w-auto text-black shrink-0" />
          <div className="h-4 w-px bg-black/15 hidden sm:block shrink-0" />
          <span className="text-xs font-semibold tracking-wider text-black/50 uppercase hidden md:inline whitespace-nowrap">
            {t('common.b2bPortal')} • {isReviewMode ? t('videoOnboarding.reviewModeTitle') : t('videoOnboarding.step3Header')}
          </span>
        </div>

        {/* Step Indicator or Close Review */}
        <div className="flex items-center gap-4 shrink-0">
          {!isReviewMode ? (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px] whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden lg:inline">{t('onboarding.step1NdaSigned')}</span>
                <span className="lg:hidden">{t('onboarding.step1Nda')}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px] whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden lg:inline">{t('onboarding.step2MediationSigned')}</span>
                <span className="lg:hidden">{t('onboarding.step2Mediation')}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183d89] text-white font-semibold text-[11px] whitespace-nowrap">
                <span>{t('onboarding.step3Video')}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onCloseReview}
              className="px-4 py-1.5 text-xs font-semibold text-black/70 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer whitespace-nowrap"
            >
              {t('videoOnboarding.closeReview')}
            </button>
          )}

          <div className="hidden sm:block shrink-0">
            <LocaleSwitcher inverted />
          </div>
        </div>
      </header>

      {/* ─── Main Screen Canvas (2 Columns) ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT PANEL: Video Playlist & Onboarding Progress
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[420px] xl:w-[460px] border-r border-black/10 bg-white flex flex-col justify-between shrink-0 overflow-y-auto p-6 sm:p-7">
          
          <div className="flex flex-col gap-6">
            
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Video className="w-3 h-3" />
                <span>{t('videoOnboarding.badgeIntro')}</span>
              </div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight">
                {t('videoOnboarding.heading')}
              </h1>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                {t('videoOnboarding.subheading')}
              </p>
            </div>

            {/* Video Modules Playlist */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                {t('videoOnboarding.modulesTitle')} (2)
              </span>

              {/* Module 1 Card */}
              <div
                onClick={() => setSelectedVideo(1)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedVideo === 1
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  video1Watched
                    ? 'bg-emerald-100 text-emerald-700'
                    : selectedVideo === 1
                    ? 'bg-[#183d89] text-white'
                    : 'bg-stone-100 text-black/60'
                }`}>
                  {video1Watched ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('videoOnboarding.module1Title')}
                    </span>
                    {video1Watched && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                        {t('videoOnboarding.watched')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {t('videoOnboarding.module1Desc')}
                  </p>
                  
                  {/* Language Pills */}
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-black/5 border border-black/5 mt-2.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVideo1Lang('cz'); setSelectedVideo(1); }}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider transition-all ${
                        video1Lang === 'cz'
                          ? 'bg-white text-black shadow-xs'
                          : 'text-black/50 hover:text-black'
                      }`}
                    >
                      CS
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVideo1Lang('en'); setSelectedVideo(1); }}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider transition-all ${
                        video1Lang === 'en'
                          ? 'bg-white text-black shadow-xs'
                          : 'text-black/50 hover:text-black'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              {/* Module 2 Card */}
              <div
                onClick={() => setSelectedVideo(2)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedVideo === 2
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  video2Watched
                    ? 'bg-emerald-100 text-emerald-700'
                    : selectedVideo === 2
                    ? 'bg-[#183d89] text-white'
                    : 'bg-stone-100 text-black/60'
                }`}>
                  {video2Watched ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('videoOnboarding.module2Title')}
                    </span>
                    {video2Watched && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                        {t('videoOnboarding.watched')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {t('videoOnboarding.module2Desc')}
                  </p>
                  
                  {/* Language Pills */}
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-black/5 border border-black/5 mt-2.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVideo2Lang('cz'); setSelectedVideo(2); }}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider transition-all ${
                        video2Lang === 'cz'
                          ? 'bg-white text-black shadow-xs'
                          : 'text-black/50 hover:text-black'
                      }`}
                    >
                      CS
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setVideo2Lang('en'); setSelectedVideo(2); }}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider transition-all ${
                        video2Lang === 'en'
                          ? 'bg-white text-black shadow-xs'
                          : 'text-black/50 hover:text-black'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Completion & CTA */}
          <div className="pt-6 border-t border-black/10 flex flex-col gap-3">
            
            {/* Progress status */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-black/60">{t('videoOnboarding.trainingStatus')}</span>
              <span className={bothWatched ? 'text-emerald-700 font-bold' : 'text-[#183d89]'}>
                {bothWatched 
                  ? t('videoOnboarding.allCompleted') 
                  : t('videoOnboarding.completedCount', { count: (video1Watched ? 1 : 0) + (video2Watched ? 1 : 0) })}
              </span>
            </div>

            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#183d89] h-full transition-all duration-500 rounded-full"
                style={{ width: bothWatched ? '100%' : video1Watched || video2Watched ? '50%' : '0%' }}
              />
            </div>

            {error && (
              <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleFinishOnboarding}
              disabled={loading || (!bothWatched && !isReviewMode)}
              className={`w-full inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all shadow-xs gap-2 ${
                bothWatched || isReviewMode
                  ? 'bg-[#183d89] hover:bg-[#153475] text-white cursor-pointer'
                  : 'bg-black/10 text-black/40 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>
                {loading 
                  ? t('videoOnboarding.activating') 
                  : isReviewMode 
                  ? t('videoOnboarding.finishBtnReview') 
                  : bothWatched 
                  ? t('videoOnboarding.finishBtnReady') 
                  : t('videoOnboarding.finishBtnNotReady')}
              </span>
            </button>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT PANEL: Cinema Video Player View
           ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-stone-100/60 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center overflow-y-auto">
          
          <div className="max-w-4xl w-full flex flex-col gap-4">
            
            {/* Player Title & Language Selector Bar */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-black/10 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-black">
                  {selectedVideo === 1 ? t('videoOnboarding.module1Title') : t('videoOnboarding.module2Title')}
                </h3>
                <span className="text-[11px] text-black/50">
                  {selectedVideo === 1 
                    ? (video1Lang === 'cz' ? t('videoOnboarding.versionCzHd') : t('videoOnboarding.versionEnHd'))
                    : (video2Lang === 'cz' ? t('videoOnboarding.versionCzHd') : t('videoOnboarding.versionEnHd'))}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-black/50 font-medium">{t('videoOnboarding.videoLang')}</span>
                <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-black/5">
                  <button
                    onClick={() => selectedVideo === 1 ? setVideo1Lang('cz') : setVideo2Lang('cz')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      (selectedVideo === 1 ? video1Lang === 'cz' : video2Lang === 'cz')
                        ? 'bg-white text-black shadow-xs'
                        : 'text-black/50 hover:text-black'
                    }`}
                  >
                    CS
                  </button>
                  <button
                    onClick={() => selectedVideo === 1 ? setVideo1Lang('en') : setVideo2Lang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      (selectedVideo === 1 ? video1Lang === 'en' : video2Lang === 'en')
                        ? 'bg-white text-black shadow-xs'
                        : 'text-black/50 hover:text-black'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>

            {/* Video Cinema Container */}
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/15 flex items-center justify-center">
              
              {selectedVideo === 1 ? (
                /* Native Video Player for Video 1 */
                <video
                  key={`v1-${video1Lang}`}
                  ref={video1Ref}
                  controls
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleVideo1TimeUpdate}
                  onEnded={handleVideo1Ended}
                  className="w-full h-full object-contain"
                >
                  <source src={video1Sources[video1Lang]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Native Video Player for Video 2 */
                <video
                  key={`v2-${video2Lang}`}
                  ref={video2Ref}
                  controls
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleVideo2TimeUpdate}
                  onEnded={handleVideo2Ended}
                  className="w-full h-full object-contain"
                >
                  <source src={video2Sources[video2Lang]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

            </div>

            {/* Bottom Quick Help Bar */}
            <div className="flex items-center justify-between text-xs text-black/50 px-2">
              <span>{t('videoOnboarding.bottomTip')}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
