import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Video, 
  Play, 
  CheckCircle2, 
  X, 
  Building2, 
  Calendar,
  MapPin,
  Award,
  Hash,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';
import type { User } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

type SelectedItem = 'nda' | 'mediation' | 'video1' | 'video2';

interface Props {
  activeUser: User;
  onClose: () => void;
  onOpenVideoPlayer?: (videoNum?: 1 | 2) => void;
}

function SignatureRenderer({ signature, fallbackName }: { signature?: string | null; fallbackName: string }) {
  if (!signature) {
    return (
      <span className="font-serif italic text-lg text-[#183d89] font-bold">
        {fallbackName}
      </span>
    );
  }

  // If signature is raw SVG string
  if (signature.trim().startsWith('<svg') || signature.includes('<svg')) {
    return (
      <div 
        className="h-14 w-full flex items-center justify-center mix-blend-multiply [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-h-14 pointer-events-none"
        dangerouslySetInnerHTML={{ __html: signature }} 
      />
    );
  }

  // If signature is data URL image
  if (signature.startsWith('data:image')) {
    return (
      <img src={signature} alt="Podpis" className="h-14 object-contain mix-blend-multiply pointer-events-none" />
    );
  }

  // Plain text fallback
  return (
    <span className="font-serif italic text-lg text-[#183d89] font-bold">
      {signature}
    </span>
  );
}

export default function OnboardingArchiveModal({ activeUser, onClose }: Props) {
  const { t, locale } = useI18n();
  const [selectedItem, setSelectedItem] = useState<SelectedItem>('nda');
  const [video1Lang, setVideo1Lang] = useState<'cz' | 'en'>(locale === 'en' ? 'en' : 'cz');
  const [video2Lang, setVideo2Lang] = useState<'cz' | 'en'>(locale === 'en' ? 'en' : 'cz');

  const CDN_BASE = 'https://github.com/louskac/treetino-pricing/releases/download/v1.0-videos';

  const video1Sources = {
    cz: `${CDN_BASE}/onboarding_1_cz.mp4`,
    en: `${CDN_BASE}/onboarding_1_en.mp4`
  };

  const video2Sources = {
    cz: `${CDN_BASE}/onboarding_2_cz.mp4`,
    en: `${CDN_BASE}/onboarding_2_en.mp4`
  };

  const ndaDownloadUrlCs = `${BACKEND_URL}/users/${activeUser.id}/nda/download?lang=cs`;
  const ndaDownloadUrlEn = `${BACKEND_URL}/users/${activeUser.id}/nda/download?lang=en`;
  const mediationDownloadUrlCs = `${BACKEND_URL}/users/${activeUser.id}/mediation/download?lang=cs`;
  const mediationDownloadUrlEn = `${BACKEND_URL}/users/${activeUser.id}/mediation/download?lang=en`;

  const commissionRate = activeUser.tier === 'Platinum' ? '12%' : activeUser.tier === 'Gold' ? '8%' : '5%';

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col h-screen overflow-hidden font-sans select-none">
      
      {/* ─── Top Header Bar ─── */}
      <header className="h-16 border-b border-black/10 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-white shadow-2xs">
        <div className="flex items-center gap-6">
          <LogoType className="h-5.5 w-auto text-black" />
          <div className="h-4 w-px bg-black/15 hidden sm:block" />
          <span className="text-xs font-semibold tracking-wider text-black/50 uppercase hidden sm:inline">
            {t('common.b2bPortal')} • {t('onboardingArchive.title')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#183d89]/10 text-[#183d89] border border-[#183d89]/20">
            <span>{activeUser.full_name || activeUser.username}</span>
            <span>•</span>
            <span>{activeUser.tier} Partner ({commissionRate})</span>
          </div>

          <div className="hidden sm:block">
            <LocaleSwitcher inverted />
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black/70 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <span>{t('onboardingArchive.closeBtn')}</span>
            <span>✕</span>
          </button>
        </div>
      </header>

      {/* ─── Main 2-Column Workspace ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT PANEL: Navigation Directory & Partner Summary
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[420px] xl:w-[460px] border-r border-black/10 bg-white flex flex-col justify-between shrink-0 overflow-y-auto p-6 sm:p-7">
          
          <div className="flex flex-col gap-6">
            
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] text-[10px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>{t('onboardingArchive.subtitle', { name: activeUser.full_name || activeUser.username })}</span>
              </div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight">
                {t('onboardingArchive.title')}
              </h1>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                {t('onboardingArchive.docsDesc')}
              </p>
            </div>

            {/* Section 1: Legal Documents */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                {t('onboardingArchive.tabDocs')} (2)
              </span>

              {/* 1. NDA Card */}
              <div
                onClick={() => setSelectedItem('nda')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedItem === 'nda'
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  selectedItem === 'nda' ? 'bg-[#183d89] text-white' : 'bg-stone-100 text-black/60'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('onboardingArchive.ndaTitle')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                      {t('onboardingArchive.completedStatus')}
                    </span>
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {activeUser.nda_company || activeUser.full_name || activeUser.username} • {activeUser.nda_signed_at || 'Podepsáno'}
                  </p>
                  
                  {/* Download Action Links */}
                  <div className="flex items-center gap-3 mt-2.5">
                    <a
                      href={ndaDownloadUrlCs}
                      download={`NDA_Treetino_${activeUser.username}_CS.pdf`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#183d89] hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      <span>{t('onboardingArchive.downloadNdaCs')}</span>
                    </a>
                    <span className="text-black/20 text-xs">|</span>
                    <a
                      href={ndaDownloadUrlEn}
                      download={`NDA_Treetino_${activeUser.username}_EN.pdf`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-black/60 hover:text-black"
                    >
                      <span>EN PDF</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. Mediation Agreement Card */}
              <div
                onClick={() => setSelectedItem('mediation')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedItem === 'mediation'
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  selectedItem === 'mediation' ? 'bg-[#183d89] text-white' : 'bg-stone-100 text-black/60'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('onboardingArchive.mediationTitle')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                      {t('onboardingArchive.completedStatus')}
                    </span>
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {activeUser.tier} Partner ({commissionRate}) • {activeUser.mediation_signed_at || 'Podepsáno'}
                  </p>
                  
                  {/* Download Action Links */}
                  <div className="flex items-center gap-3 mt-2.5">
                    <a
                      href={mediationDownloadUrlCs}
                      download={`Smlouva_Zprostredkovani_Treetino_${activeUser.username}_CS.pdf`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#183d89] hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      <span>{t('onboardingArchive.downloadMediationCs')}</span>
                    </a>
                    <span className="text-black/20 text-xs">|</span>
                    <a
                      href={mediationDownloadUrlEn}
                      download={`Mediation_Agreement_Treetino_${activeUser.username}_EN.pdf`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-black/60 hover:text-black"
                    >
                      <span>EN PDF</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Section 2: Video Modules */}
            <div className="space-y-3 pt-2 border-t border-black/10">
              <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                {t('onboardingArchive.tabVideos')} (2)
              </span>

              {/* Video 1 Card */}
              <div
                onClick={() => setSelectedItem('video1')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedItem === 'video1'
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  selectedItem === 'video1' ? 'bg-[#183d89] text-white' : 'bg-stone-100 text-black/60'
                }`}>
                  <Play className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('onboardingArchive.module1Title')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                      HD Video
                    </span>
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {t('onboardingArchive.module1Desc')}
                  </p>
                </div>
              </div>

              {/* Video 2 Card */}
              <div
                onClick={() => setSelectedItem('video2')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedItem === 'video2'
                    ? 'border-[#183d89] bg-blue-50/40 shadow-xs'
                    : 'border-black/10 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  selectedItem === 'video2' ? 'bg-[#183d89] text-white' : 'bg-stone-100 text-black/60'
                }`}>
                  <Play className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-black truncate">
                      {t('onboardingArchive.module2Title')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                      HD Video
                    </span>
                  </div>
                  <p className="text-[11px] text-black/60 mt-1 leading-snug">
                    {t('onboardingArchive.module2Desc')}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-black/60">
              <span>{t('onboardingArchive.legalRegistry')}</span>
              <span className="font-semibold text-emerald-700">✓ Vše aktivní</span>
            </div>

            <button
              onClick={onClose}
              className="w-full inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold bg-[#183d89] hover:bg-[#153475] text-white transition-all shadow-xs cursor-pointer"
            >
              {t('onboardingArchive.closeBtn')}
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT PANEL: Live Interactive Document or Video Viewer
           ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-stone-100/60 p-6 sm:p-10 lg:p-12 flex flex-col items-center overflow-y-auto">
          
          {/* VIEW: NDA Document Preview */}
          {selectedItem === 'nda' && (
            <div className="max-w-3xl w-full flex flex-col gap-4">
              
              {/* Document Header & Download Action Bar */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-black/10 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-black">
                    {t('onboardingArchive.ndaTitle')}
                  </h3>
                  <span className="text-[11px] text-black/50">
                    Podepsáno: {activeUser.nda_signed_at || 'Aktivní'} • {activeUser.nda_location || 'Praha'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={ndaDownloadUrlCs}
                    download={`NDA_Treetino_${activeUser.username}_CS.pdf`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#183d89] hover:bg-[#153475] text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('onboardingArchive.downloadNdaCs')}</span>
                  </a>

                  <a
                    href={ndaDownloadUrlEn}
                    download={`NDA_Treetino_${activeUser.username}_EN.pdf`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-black/15 text-xs font-medium text-black transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-black/40" />
                    <span>EN (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Paper NDA Sheet */}
              <div className="bg-white rounded-2xl border border-black/10 p-8 sm:p-12 shadow-md text-black/85 text-[11px] leading-relaxed font-sans space-y-6">
                
                <div className="text-center space-y-1 pb-4 border-b border-black/10">
                  <span className="text-[9px] uppercase tracking-widest text-[#183d89] font-bold block">
                    {locale === 'en' ? 'LEGAL DOCUMENT • NON-DISCLOSURE AGREEMENT (NDA)' : 'PRÁVNÍ DOKUMENT • NON-DISCLOSURE AGREEMENT (NDA)'}
                  </span>
                  <h2 className="text-base font-bold text-black font-display tracking-tight uppercase">
                    {locale === 'en' 
                      ? 'NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT'
                      : 'DOHODA O MLČENLIVOSTI, OCHRANĚ INFORMACÍ A ZÁKAZU JEJICH ZNEUŽITÍ'}
                  </h2>
                  <p className="text-[10px] text-black/50">
                    {locale === 'en'
                      ? 'entered into pursuant to Section 1746(2) and Section 1730 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended'
                      : 'uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů'}
                  </p>
                </div>

                {/* Smluvní strany */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">
                    {locale === 'en' ? 'I. Contracting Parties' : 'I. Smluvní strany'}
                  </h3>
                  <p className="text-[11px] text-black/70">
                    {locale === 'en'
                      ? 'On the date, month, and year indicated below, the following Contracting Parties enter into this Non-Disclosure and Confidentiality Agreement (hereinafter the "Agreement"):'
                      : 'Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Dohodu o mlčenlivosti, ochraně informací a zákazu jejich zneužití (dále jen „Dohoda“):'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-black/10 bg-stone-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-[#183d89] uppercase tracking-wider block">
                        {locale === 'en' ? '1.1 Disclosing Party (Treetino):' : '1.1 Poskytovatel (Treetino):'}
                      </span>
                      <div><strong>{locale === 'en' ? 'Company Name:' : 'Obchodní firma:'}</strong> Treetino corp s.r.o.</div>
                      <div><strong>{locale === 'en' ? 'Company ID (IČO):' : 'IČO:'}</strong> 10800107</div>
                      <div><strong>{locale === 'en' ? 'Registered Seat:' : 'Sídlo:'}</strong> Vlčetín 62, Bílá 463 43</div>
                      <div><strong>{locale === 'en' ? 'Represented by:' : 'Zastoupena:'}</strong> Dominik Mašek, {locale === 'en' ? 'Managing Director' : 'jednatel'}</div>
                      <div><strong>{locale === 'en' ? 'Registry:' : 'Rejstřík:'}</strong> KS v Ústí n. L., C 48430</div>
                      <div><strong>{locale === 'en' ? 'Email:' : 'E-mail:'}</strong> info@treetino.com</div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[#183d89]/30 bg-blue-50/20 space-y-1">
                      <span className="text-[10px] font-bold text-[#183d89] uppercase tracking-wider block">
                        {locale === 'en' ? '1.2 Receiving Party (Partner):' : '1.2 Příjemce (Partner / Prodejce):'}
                      </span>
                      <div><strong>{locale === 'en' ? 'Name / Company:' : 'Firma / Jméno:'}</strong> {activeUser.nda_company || activeUser.full_name || activeUser.username}</div>
                      <div><strong>{locale === 'en' ? 'ID / Date of Birth:' : 'IČO / Datum nar.:'}</strong> {activeUser.nda_ico_dob || '—'}</div>
                      <div><strong>{locale === 'en' ? 'Address / Office:' : 'Sídlo / Bydliště:'}</strong> {activeUser.nda_address || '—'}</div>
                      <div><strong>{locale === 'en' ? 'Represented by:' : 'Zastoupená:'}</strong> {activeUser.nda_representative || activeUser.full_name || activeUser.username}</div>
                      <div><strong>{locale === 'en' ? 'Email:' : 'E-mail:'}</strong> {activeUser.email || '—'}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-black/50 pt-0.5">
                    {locale === 'en' 
                      ? '(The Disclosing Party and the Receiving Party hereinafter collectively referred to as the "Parties", or individually as a "Party")'
                      : '(Poskytovatel a Příjemce dále společně také jen jako „Smluvní strany“, nebo každý samostatně jako „Smluvní strana“)'}
                  </p>
                </div>

                {/* Články */}
                <div className="space-y-4 text-black/75">
                  {locale === 'en' ? (
                    <>
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">II. Preamble and Purpose of the Agreement</h3>
                        <p><strong>2.1</strong> The Parties are engaged in mutual negotiations regarding the establishment and execution of commercial and technical collaboration, within which the Receiving Party, acting as a sales representative, commercial agent, distributor, or partner entity, will conduct business development activities, specifically identifying commercial opportunities, mediating sales, presenting, marketing, and securing distribution or installation of Treetino products and technologies (including autonomous solar and wind trees Treetino V1, Treetino V2, vertical wind microturbines T1, and related accessories), as well as utilizing Treetino's proprietary sales and calculation software (Treetino Pricing App, CRM, partner portal, and 3D configuration tools) – hereinafter referred to as „<strong>Mutual Collaboration</strong>“.</p>
                        <p><strong>2.2</strong> For the purpose of negotiating and performing the Mutual Collaboration, the Disclosing Party will provide the Receiving Party with highly confidential commercial, pricing, technical, developmental, strategic, customer, and operational information and know-how, which constitute valuable trade secrets and intellectual property of the Disclosing Party and hold essential economic and competitive value.</p>
                        <p><strong>2.3</strong> The purpose of this Agreement is to establish binding rules and legal framework for the protection of all Confidential Information and Trade Secrets of the Disclosing Party, define the Receiving Party's obligations in handling such information, prohibit any unauthorized disclosure, dissemination, or utilization thereof, and determine legal remedies and sanctions in the event of any breach.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">III. Definition of Confidential Information and Trade Secrets</h3>
                        <p><strong>3.1 „Confidential Information“</strong> for the purposes of this Agreement means any and all information, facts, data, documents, materials, designs, analyses, and know-how of any nature (technical, commercial, pricing, financial, legal, manufacturing, strategic, operational, or organizational), in tangible or intangible form, regardless of the manner or medium of transmission (oral, written, electronic, CAD/3D models, drawings, source/binary code, demonstration of prototypes, or software), that the Disclosing Party has directly or indirectly disclosed, provided, or made accessible to the Receiving Party, or of which the Receiving Party became aware in connection with the negotiations or Mutual Collaboration (hereinafter „<strong>Confidential Information</strong>“).</p>
                        <p><strong>3.2</strong> Confidential Information and <strong>Trade Secrets</strong> within the meaning of Section 504 and Section 1730 of the Civil Code include, without limitation:</p>
                        <ul className="list-disc pl-5 space-y-1 text-[11px]">
                          <li><strong>Commercial, pricing, and financial data:</strong> wholesale/retail price lists, margin and discount structures, sales representative commission schedules and compensation models, calculation matrices and formulas, customized quotes prepared for clients, commercial and marketing strategies, sales pipeline, and expansion plans;</li>
                          <li><strong>Customer and partner records:</strong> database of client inquiries, contact details and identities of existing and prospective customers, sales leads, negotiation history, CRM records, and terms negotiated with suppliers and sub-contractors;</li>
                          <li><strong>Technical documentation and know-how:</strong> engineering drawings, 3D CAD models, electrical wiring schematics, technical specifications of solar/wind trees, composite material specifications, aerodynamic profiles of microturbines, inverter integration, electronic controllers, and battery energy storage systems;</li>
                          <li><strong>Software, digital assets, and system credentials:</strong> source and binary code, database schemas, web and cloud applications (specifically Treetino Pricing / Sales App), API endpoints, and all user credentials (usernames, passwords, API tokens, and certificates) issued to the Receiving Party;</li>
                          <li><strong>Strategic and legal assets:</strong> information regarding pending patents, utility and industrial designs, investment discussions, corporate partnerships, and internal standard operating procedures.</li>
                        </ul>
                        <p><strong>3.3</strong> Confidential Information also includes the very existence of this Agreement, the fact that negotiations are taking place between the Parties, and all terms and parameters of the Mutual Collaboration.</p>
                        <p><strong>3.4</strong> All information specified in this Article is hereinafter collectively referred to as „<strong>Protected Information</strong>“. All information disclosed by the Disclosing Party shall be deemed Protected Information unless explicitly designated otherwise in writing by the Disclosing Party.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">IV. Obligations of the Receiving Party and Data Protection</h3>
                        <p><strong>4.1 The Receiving Party irrevocably covenants and agrees:</strong></p>
                        <ul className="list-disc pl-5 space-y-1 text-[11px]">
                          <li>To maintain the strictest confidentiality regarding all Protected Information and to protect it with the care of a prudent businessperson and the highest standard of professional diligence;</li>
                          <li>To use the Protected Information exclusively for the performance of the agreed Mutual Collaboration and solely for the benefit of the Disclosing Party;</li>
                          <li>Not to disclose, transfer, make accessible, disseminate, publish, or otherwise permit access to the Protected Information to any third party without the prior express written consent of the Disclosing Party;</li>
                          <li>Not to utilize the Protected Information (including acquired know-how, calculation models, and customer databases) for its own commercial benefit or for the benefit of any third party, in particular not to engage in direct or indirect competitive activity against the Disclosing Party nor develop or offer competing technical or commercial solutions;</li>
                          <li>Not to take any steps aimed at circumventing the Disclosing Party (<strong>non-circumvention obligation</strong>), in particular not to directly approach, contact, or solicit clients, prospects, or suppliers of the Disclosing Party discovered in the course of the Mutual Collaboration for the purpose of concluding transactions outside of the Disclosing Party.</li>
                        </ul>
                        <p><strong>4.2 Access Restriction:</strong> The Receiving Party may disclose Protected Information solely to its statutory representatives, employees, and professional advisors who strictly need to know such information for the purposes of the Mutual Collaboration (<em>need-to-know basis</em>). The Receiving Party must ensure that such individuals are bound by confidentiality obligations at least as stringent as those contained herein, and the Receiving Party remains fully liable for any breach committed by such individuals as if it had committed the breach itself.</p>
                        <p><strong>4.3 Technical Security Measures:</strong> The Receiving Party undertakes to secure all devices (computers, smartphones, tablets) used to access the Disclosing Party's software and systems with strong passwords, biometric authentication, and two-factor authentication (2FA). The Receiving Party shall not share its credentials with any third party and shall not store Protected Information on public or unencrypted cloud storage.</p>
                        <p><strong>4.4 Notification Duty:</strong> In the event of discovering any unauthorized access, breach, leakage, loss, or disclosure of Protected Information, the Receiving Party shall immediately (and no later than within 24 hours) notify the Disclosing Party in writing and provide all necessary assistance to mitigate damages.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">V. Exceptions to Confidentiality Obligations</h3>
                        <p><strong>5.1</strong> The confidentiality obligation under this Agreement shall not apply to information that: (a) was demonstrably publicly known at the time of disclosure, or became publicly known subsequent to disclosure other than through a breach of this Agreement by the Receiving Party; (b) was demonstrably and lawfully in the possession of the Receiving Party prior to disclosure by the Disclosing Party; (c) was released from confidentiality by prior written consent of the Disclosing Party; (d) the Receiving Party is obligated to disclose pursuant to mandatory legal provisions, a binding court judgment, or an order of a law enforcement or public authority (provided that the Receiving Party shall immediately notify the Disclosing Party in advance in writing, disclose only the minimum required scope, and request confidential treatment).</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VI. Intellectual Property and Return of Materials</h3>
                        <p><strong>6.1</strong> All intellectual property rights, trade secrets, patents, utility models, trademarks, copyrights, engineering designs, know-how, databases, and software tools remain the sole and exclusive property of the Disclosing Party. The provision of Protected Information conveys no license, patent right, or title to the Receiving Party.</p>
                        <p><strong>6.2 Return and Disposal of Materials:</strong> Upon written request by the Disclosing Party or at latest within 5 (five) business days following termination of the Mutual Collaboration, the Receiving Party shall return to the Disclosing Party all tangible materials, data carriers, drawings, samples, and documents containing Protected Information, and permanently and irrevocably erase/shred all digital copies and records from all its devices and servers.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VII. Contractual Penalty and Damages</h3>
                        <p><strong>7.1</strong> In the event of any breach by the Receiving Party of any obligation set forth in this Agreement (including breach of confidentiality, unauthorized disclosure, commercial misuse, breach of non-circumvention/non-compete covenants, or failure to return materials), the Receiving Party shall pay to the Disclosing Party a <strong>contractual penalty of €4,000 / CZK 100,000 (four thousand Euros / one hundred thousand Czech crowns)</strong> for each individual breach. In the case of a continuing breach, a contractual penalty of <strong>€200 / CZK 5,000</strong> shall be paid for each day or part thereof during which such breach continues.</p>
                        <p><strong>7.2</strong> The contractual penalty shall be due and payable within 14 (fourteen) calendar days following delivery of a written demand for payment to the Receiving Party.</p>
                        <p><strong>7.3 Damages:</strong> The agreement on and payment of a contractual penalty shall not affect or limit the Disclosing Party's right to full compensation for all damages, pecuniary and non-pecuniary losses, and lost profits in full. The Parties <strong>expressly exclude the application of Section 2050 of the Civil Code</strong> and agree that claims for damages remain enforceable in full alongside contractual penalties.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VIII. Duration and Effectiveness</h3>
                        <p><strong>8.1</strong> This Agreement takes effect upon its signature by both Parties and is entered into for an <strong>indefinite term</strong>.</p>
                        <p><strong>8.2</strong> The confidentiality obligations regarding Protected Information shall survive and remain in effect throughout the duration of negotiations and Mutual Collaboration and for a period of <strong>5 (five) years</strong> following the termination of all collaboration; with respect to information constituting trade secrets or proprietary know-how of the Disclosing Party, confidentiality obligations shall survive indefinitely for as long as such trade secrets exist.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">IX. Final Provisions</h3>
                        <p><strong>9.1</strong> Legal relations under this Agreement shall be governed by the laws of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code. Any disputes shall be submitted to the competent general courts of the Czech Republic having jurisdiction over the registered seat of the Disclosing Party.</p>
                        <p><strong>9.2</strong> Amendments to this Agreement must be made in writing in sequentially numbered addenda signed by both Parties. Should any provision be deemed invalid, the remaining provisions shall remain fully effective (severability clause).</p>
                        <p><strong>9.3</strong> This Agreement is executed in counterparts with the force of an original, or in an electronic format executed via recognized electronic signatures by both Parties.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">II. Preambule a účel dohody</h3>
                        <p><strong>2.1</strong> Smluvní strany vedou vzájemná jednání o navázání a realizaci obchodní a technické spolupráce, v jejímž rámci bude Příjemce jako obchodní zástupce, prodejce, distributor nebo partnerská společnost vyvíjet obchodní činnost, zejména vyhledávat obchodní příležitosti, zprostředkovávat prodej, prezentovat, propagovat a zajišťovat distribuci nebo instalaci produktů a technologií společnosti Treetino (zejména autonomních větrných a solárních stromů Treetino V1, Treetino V2, vertikálních větrných mikroturbín T1 a souvisejícího příslušenství) a využívat obchodní software a kalkulační nástroje Poskytovatele (Treetino Pricing App, CRM, partnerský portál a konfigurační nástroje) – dále jen „<strong>Vzájemná spolupráce</strong>“.</p>
                        <p><strong>2.2</strong> Za účelem jednání o Vzájemné spolupráci a jejího následného řádného výkonu bude Poskytovatel Příjemci zpřístupňovat vysoce důvěrné obchodní, cenové, technické, vývojové, strategické, klientské a provozní informace a know-how, které představují cenné obchodní tajemství a duševní vlastnictví Poskytovatele a mají zásadní hospodářskou hodnotu.</p>
                        <p><strong>2.3</strong> Účelem této Dohody je stanovení přesných a závazných podmínek pro ochranu důvěrných informací a obchodního tajemství Poskytovatele, vymezení povinností Příjemce při nakládání s těmito informacemi, zákaz jejich neoprávněného užití, vyzrazení, šíření či zpřístupnění třetím osobám a stanovení právních následků a sankcí v případě jejich porušení.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">III. Vymezení důvěrných informací a obchodního tajemství</h3>
                        <p><strong>3.1 Důvěrnými informacemi</strong> se pro účely této Dohody rozumí veškeré informace, skutečnosti, data, podklady, materiály a know-how jakékoliv povahy (technické, obchodní, finanční, cenové, právní, výrobní, strategické, provozní či organizační), bez ohledu na formu a způsob jejich zachycení nebo sdělení (ústně, písemně, elektronicky, v podobě výkresů, 3D CAD modelů, zdrojových kódů či předvedením prototypů a softwaru), které Poskytovatel Příjemci přímo či nepřímo zpřístupnil, sdělil, předal nebo které se Příjemce v souvislosti s jednáním či Vzájemnou spoluprací dozvěděl (dále jen „<strong>Důvěrné informace</strong>“).</p>
                        <p><strong>3.2</strong> Za Důvěrné informace a <strong>obchodní tajemství</strong> Poskytovatele ve smyslu ustanovení § 504 a § 1730 občanského zákoníku se považují zejména, nikoliv však výlučně:</p>
                        <ul className="list-disc pl-5 space-y-1 text-[11px]">
                          <li><strong>Obchodní, cenové a finanční informace:</strong> prodejní i nákupní ceníky, struktura marží a slev, provizní řády a odměňovací modely prodejců, kalkulační matice a vzorce, cenové nabídky připravované pro zákazníky, obchodní a marketingové strategie, obchodní pipeline a plány expanze na tuzemské i zahraniční trhy;</li>
                          <li><strong>Klientská a partnerská data:</strong> databáze poptávek, kontaktů a identifikačních údajů stávajících i potenciálních zákazníků, rozpracované obchodní případy (leads), historie komunikace s klienty, záznamy v CRM a obchodních evidencích, a podmínky sjednané s dodavateli;</li>
                          <li><strong>Technická dokumentace a know-how:</strong> výrobní a konstrukční výkresy, 3D CAD modely, schémata zapojení, technické parametry větrných a solárních stromů, materiálové specifikace kompozitů, aerodynamické profily mikroturbín, řešení střídačů, řídicí elektroniky a bateriových systémů;</li>
                          <li><strong>Software, digitální aktiva a přístupy:</strong> veškeré zdrojové i binární kódy, databázové struktury, webové a cloudové aplikace (zejména Treetino Pricing / Sales App), přístupová rozhraní (API), jakož i veškeré přístupové údaje (uživatelská jména, hesla, tokeny a certifikáty) přidělené Příjemci;</li>
                          <li><strong>Strategické a organizační informace:</strong> informace o patentech, užitných a průmyslových vzorech v přípravě, investičních jednáních, smluvních vztazích s partnery a interních provozních postupech.</li>
                        </ul>
                        <p><strong>3.3</strong> Důvěrnou informací je rovněž samotná existence této Dohody, skutečnost, že mezi Smluvními stranami probíhají jednání, a veškerý obsah a parametry Vzájemné spolupráce.</p>
                        <p><strong>3.4</strong> Veškeré informace uvedené v tomto článku jsou dále souhrnně označovány jako „<strong>Chráněné informace</strong>“. Má se za to, že veškeré informace předané Poskytovatelem Příjemci jsou Chráněnými informacemi, ledaže Poskytovatel výslovně písemně prohlásí opak.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">IV. Závazky Příjemce a pravidla ochrany informací</h3>
                        <p><strong>4.1 Příjemce se tímto neodvolatelně zavazuje:</strong></p>
                        <ul className="list-disc pl-5 space-y-1 text-[11px]">
                          <li>Zachovávat o všech Chráněných informacích nejpřísnější mlčenlivost a chránit je s péčí řádného hospodáře a nejvyšší možnou mírou obezřetnosti;</li>
                          <li>Užívat Chráněné informace výhradně a pouze za účelem plnění dohodnuté Vzájemné spolupráce a výhradně ve prospěch Poskytovatele;</li>
                          <li>Neposkytnout, nesdělit, nezpřístupnit, nerozšiřovat, nepublikovat ani neumožnit přístup k Chráněným informacím žádné třetí osobě bez předchozího výslovného písemného souhlasu Poskytovatele;</li>
                          <li>Nevyužít Chráněné informace (včetně získaného know-how, kalkulačních modelů a klientských databází) ve svůj vlastní prospěch ani ve prospěch jakékoliv třetí osoby, zejména nevyvíjet přímou ani nepřímou konkurenční činnost vůči Poskytovateli a nevyvíjet ani nenabízet obdobná technická či obchodní řešení;</li>
                          <li>Nečinit žádné kroky směřující k obcházení Poskytovatele (<strong>zákaz obcházení / non-circumvention</strong>), zejména nekontaktovat napřímo klienty, poptávající osoby či dodavatele Poskytovatele za účelem uzavření obchodu mimo Poskytovatele.</li>
                        </ul>
                        <p><strong>4.2 Omezení okruhu osob:</strong> Příjemce je oprávněn zpřístupnit Chráněné informace pouze těm svým statutárním orgánům, zaměstnancům a odborným poradcům, kteří tyto informace nezbytně nutně potřebují k výkonu Vzájemné spolupráce (princip <em>need-to-know</em>). Příjemce je povinen tyto osoby předem prokazatelně a písemně zavázat mlčenlivostí ve stejném rozsahu jako dle této Dohody, přičemž za jakékoliv porušení těmito osobami odpovídá Příjemce tak, jako by se porušení dopustil sám.</p>
                        <p><strong>4.3 Technická a bezpečnostní ochrana:</strong> Příjemce se zavazuje zabezpečit veškerá technická zařízení (počítače, mobilní telefony, tablety), ze kterých přistupuje k softwaru a systémům Poskytovatele, silnými přístupovými hesly a dvoufaktorovým ověřením (2FA). Příjemce nesmí sdělit své přístupové údaje žádné další osobě a nesmí ukládat Chráněné informace na veřejná či nezabezpečená cloudová úložiště.</p>
                        <p><strong>4.4 Oznamovací povinnost:</strong> V případě zjištění jakéhokoliv neoprávněného přístupu, úniku, ztráty či vyzrazení Chráněných informací je Příjemce povinen neprodleně (nejpozději do 24 hodin) písemně informovat Poskytovatele a poskytnout mu veškerou součinnost k nápravě.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">V. Výjimky ze závazku mlčenlivosti</h3>
                        <p><strong>5.1</strong> Povinnost mlčenlivosti dle této Dohody se nevztahuje na informace, které: (a) byly v době jejich zpřístupnění prokazatelně veřejně známé, nebo se staly veřejně známými po jejich zpřístupnění jinak než v důsledku porušení této Dohody či právních předpisů ze strany Příjemce; (b) měl Příjemce prokazatelně k dispozici již před jejich poskytnutím Poskytovatelem; (c) byly uvolněny ze závazku mlčenlivosti na základě předchozího písemného souhlasu Poskytovatele; (d) je Příjemce povinen zpřístupnit na základě kogentních právních předpisů, pravomocného rozhodnutí soudu, policejního orgánu nebo jiného věcně příslušného orgánu veřejné moci (s povinností předem písemně informovat Poskytovatele a minimalizovat rozsah sdělovaných dat).</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VI. Duševní vlastnictví a nakládání s podklady</h3>
                        <p><strong>6.1</strong> Veškerá práva k Chráněným informacím, obchodnímu tajemství, patentům, užitným vzorům, ochranným známkám, autorským dílům, konstrukčním řešením, know-how, databázím a softwarovým nástrojům zůstávají výlučným a neomezeným majetkem Poskytovatele. Poskytnutí Chráněných informací nezakládá žádné licenční oprávnění ani převod vlastnických práv.</p>
                        <p><strong>6.2 Vrácení a skartace podkladů:</strong> Příjemce je povinen na písemnou výzvu Poskytovatele nebo nejpozději do 5 (pěti) pracovních dnů od ukončení Vzájemné spolupráce vrátit Poskytovateli veškeré hmotné materiály, nosiče dat, výkresy, vzorky a dokumenty obsahující Chráněné informace a veškeré digitální kopie a záznamy trvale a nevratně vymazat/skartovat ze všech svých zařízení.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VII. Smluvní pokuta a odpovědnost za škodu</h3>
                        <p><strong>7.1</strong> Poruší-li Příjemce jakoukoliv povinnost stanovenou v této Dohodě (zejména poruší-li povinnost mlčenlivosti, zpřístupní-li Chráněné informace třetí osobě, zneužije-li Chráněné informace pro vlastní prospěch či prospěch třetích osob, poruší-li zákaz obcházení/konkurence nebo nesplní-li povinnost vrácení podkladů), je Příjemce povinen zaplatit Poskytovateli <strong>smluvní pokutu ve výši 100.000 Kč (slovy: jedno sto tisíc korun českých)</strong> za každý jednotlivý případ porušení. V případě trvajícího porušení se sjednává smluvní pokuta ve výši <strong>5.000 Kč</strong> za každý započatý den trvání porušení.</p>
                        <p><strong>7.2</strong> Smluvní pokuta je splatná do 14 (čtrnácti) kalendářních dnů ode dne doručení písemné výzvy k její úhradě Příjemci.</p>
                        <p><strong>7.3 Náhrada škody:</strong> Ujednáním o smluvní pokutě ani jejím zaplacením není nijak dotčeno ani omezeno právo Poskytovatele na náhradu způsobené škody, jiné majetkové i nemajetkové újmy a ušlého zisku v plné výši. Smluvní strany výslovně <strong>vylučují aplikaci ustanovení § 2050 občanského zákoníku</strong> a sjednávají, že náhrada škody je vymahatelná v plném rozsahu vedle smluvní pokuty.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">VIII. Doba trvání a účinnost dohody</h3>
                        <p><strong>8.1</strong> Tato Dohoda nabývá platnosti a účinnosti dnem jejího podpisu oběma Smluvními stranami a uzavírá se na <strong>dobu neurčitou</strong>.</p>
                        <p><strong>8.2</strong> Závazek k ochraně Chráněných informací a zachování mlčenlivosti trvá po celou dobu trvání jednání i samotné Vzájemné spolupráce Smluvních stran a dále po dobu <strong>5 (pěti) let</strong> od faktického ukončení veškeré Vzájemné spolupráce; v případě informací tvořících obchodní tajemství ve smyslu § 504 občanského zákoníku a know-how Poskytovatele trvá závazek mlčenlivosti po celou dobu existence tohoto obchodního tajemství bez časového omezení.</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#183d89]">IX. Závěrečná ustanovení</h3>
                        <p><strong>9.1</strong> Právní vztahy založené touto Dohodou se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Případné spory budou rozhodovány věcně a místně příslušnými obecnými soudy České republiky podle sídla Poskytovatele.</p>
                        <p><strong>9.2</strong> Veškeré změny a doplňky této Dohody vyžadují písemnou formu vzestupně číslovaných dodatků podepsaných oběma Smluvními stranami. Neplatnost některého ustanovení se nedotýká platnosti ostatních ustanovení (salvátorská klauzule).</p>
                        <p><strong>9.3</strong> Tato Dohoda je vyhotovena ve dvou stejnopisech s platností originálu (po jednom pro každou stranu), popřípadě v jednom elektronickém vyhotovení opatřeném elektronickými podpisy obou Smluvních stran.</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Signatures */}
                <div className="pt-6 border-t border-black/10 space-y-4">
                  <p className="text-[11px] font-bold text-black/80">
                    {locale === 'en'
                      ? 'In witness of their free, serious, and unambiguous intent, the Parties hereto attach their signatures:'
                      : 'Na důkaz svobodného, vážného a srozumitelného projevu vůle připojují Smluvní strany své podpisy:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-black/10 rounded-xl bg-stone-50/50 text-center space-y-1">
                      <span className="text-[10px] text-black/50 uppercase font-semibold block">
                        {locale === 'en' ? 'For Treetino corp s.r.o. (Disclosing Party)' : 'Za Treetino corp s.r.o. (Poskytovatel)'}
                      </span>
                      <span className="text-xs font-bold text-black block">Dominik Mašek</span>
                      <div className="h-16 flex items-center justify-center py-1">
                        <img src="/branding/signature_masek_2.png" alt="Dominik Mašek" className="h-14 object-contain mix-blend-multiply" />
                      </div>
                      <span className="text-[9px] text-black/40 font-mono block">
                        {locale === 'en' ? 'In Prague electronically' : 'V Praze elektronicky'}
                      </span>
                      <div className="text-[10px] text-black/60 pt-0.5">
                        <strong>Dominik Mašek</strong><br />
                        {locale === 'en' ? 'Managing Director (CEO), Treetino corp s.r.o.' : 'Jednatel, Treetino corp s.r.o.'}
                      </div>
                    </div>

                    <div className="p-4 border border-black/10 rounded-xl bg-stone-50/50 text-center space-y-1">
                      <span className="text-[10px] text-black/50 uppercase font-semibold block">
                        {locale === 'en' ? 'For Receiving Party (Commercial Partner)' : 'Za Příjemce (Obchodního partnera)'}
                      </span>
                      <span className="text-xs font-bold text-black block">
                        {activeUser.nda_representative || activeUser.full_name || activeUser.username}
                      </span>
                      <div className="h-16 flex items-center justify-center py-1">
                        <SignatureRenderer 
                          signature={activeUser.nda_signature} 
                          fallbackName={activeUser.nda_representative || activeUser.full_name || activeUser.username} 
                        />
                      </div>
                      <span className="text-[9px] text-black/40 font-mono block">
                        {locale === 'en'
                          ? `In ${activeUser.nda_location || 'Prague'} on ${activeUser.nda_signed_at || 'today'}`
                          : `V ${activeUser.nda_location || 'Praze'} dne ${activeUser.nda_signed_at || 'dnes'}`}
                      </span>
                      <div className="text-[10px] text-black/60 pt-0.5">
                        <strong>{activeUser.nda_representative || activeUser.full_name || activeUser.username}</strong><br />
                        {locale === 'en' ? 'Authorized Representative' : 'Oprávněný zástupce'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: Mediation Agreement Preview */}
          {selectedItem === 'mediation' && (
            <div className="max-w-3xl w-full flex flex-col gap-4">
              
              {/* Document Header & Download Action Bar */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-black/10 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-black">
                    {t('onboardingArchive.mediationTitle')}
                  </h3>
                  <span className="text-[11px] text-black/50">
                    Provizní třída: {activeUser.tier} ({commissionRate}) • Podepsáno: {activeUser.mediation_signed_at || 'Aktivní'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={mediationDownloadUrlCs}
                    download={`Smlouva_Zprostredkovani_Treetino_${activeUser.username}_CS.pdf`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#183d89] hover:bg-[#153475] text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('onboardingArchive.downloadMediationCs')}</span>
                  </a>

                  <a
                    href={mediationDownloadUrlEn}
                    download={`Mediation_Agreement_Treetino_${activeUser.username}_EN.pdf`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-black/15 text-xs font-medium text-black transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-black/40" />
                    <span>EN (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Paper Mediation Sheet */}
              <div className="bg-white rounded-2xl border border-black/10 p-8 sm:p-12 shadow-md text-black/85 text-[11px] leading-relaxed font-sans space-y-6">
                
                <div className="text-center space-y-1 pb-4 border-b border-black/10">
                  <span className="text-[9px] uppercase tracking-widest text-black/40 font-bold block">
                    TREETINO CORP S.R.O. • OBCHODNÍ DOKUMENTACE
                  </span>
                  <h2 className="text-base font-bold text-black font-display tracking-tight">
                    SMLOUVA O OBCHODNÍM ZPROSTŘEDKOVÁNÍ
                  </h2>
                  <p className="text-[10px] text-black/50">
                    uzavřená podle § 2445 a násl. zákona č. 89/2012 Sb., občanský zákoník
                  </p>
                </div>

                {/* Smluvní strany */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-black">I. Smluvní strany</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-black/10 bg-stone-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-[#183d89] uppercase tracking-wider block">1. Zájemce:</span>
                      <div><strong>Společnost:</strong> Treetino corp s.r.o.</div>
                      <div><strong>IČO:</strong> 10800107</div>
                      <div><strong>Sídlo:</strong> Vlčetín 62, Bílá 463 43</div>
                      <div><strong>Zastoupená:</strong> Dominik Mašek, jednatel</div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[#183d89]/30 bg-blue-50/20 space-y-1">
                      <span className="text-[10px] font-bold text-[#183d89] uppercase tracking-wider block">2. Zprostředkovatel:</span>
                      <div><strong>Firma / Jméno:</strong> {activeUser.mediation_company || activeUser.full_name || activeUser.username}</div>
                      <div><strong>IČO / Datum nar.:</strong> {activeUser.mediation_ico_dob || '—'}</div>
                      <div><strong>Třída partnera:</strong> {activeUser.tier} ({commissionRate})</div>
                      <div><strong>Zastoupená:</strong> {activeUser.mediation_representative || activeUser.full_name || activeUser.username}</div>
                    </div>
                  </div>
                </div>

                {/* Články */}
                <div className="space-y-3 text-black/70">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-black mb-1">II. Předmět smlouvy a provizní řád</h3>
                    <p>Předmětem smlouvy je zprostředkování obchodních příležitostí prodeje a instalace energetických stromů Treetino. Zprostředkovateli náleží provize ve výši <strong>{commissionRate}</strong> z celkového objemu realizované investice.</p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-6 border-t border-black/10 grid grid-cols-2 gap-6">
                  <div className="p-4 border border-black/10 rounded-xl bg-stone-50/50 text-center space-y-1">
                    <span className="text-[10px] text-black/50 uppercase font-semibold block">Za Treetino corp s.r.o.</span>
                    <span className="text-[10px] text-black/70 font-semibold block">Dominik Mašek, jednatel</span>
                    <div className="h-16 flex items-center justify-center py-1">
                      <img src="/branding/signature_masek_2.png" alt="Dominik Mašek" className="h-14 object-contain mix-blend-multiply" />
                    </div>
                    <span className="text-[9px] text-black/40 font-mono block">V Praze elektronicky</span>
                  </div>

                  <div className="p-4 border border-black/10 rounded-xl bg-stone-50/50 text-center space-y-1">
                    <span className="text-[10px] text-black/50 uppercase font-semibold block">Za zprostředkovatele</span>
                    <span className="text-[10px] text-black/70 font-semibold block">{activeUser.mediation_representative || activeUser.full_name || activeUser.username}</span>
                    <div className="h-16 flex items-center justify-center py-1">
                      <SignatureRenderer 
                        signature={activeUser.mediation_signature} 
                        fallbackName={activeUser.mediation_representative || activeUser.full_name || activeUser.username} 
                      />
                    </div>
                    <span className="text-[9px] text-black/40 font-mono block">
                      V {activeUser.mediation_location || 'Praze'} dne {activeUser.mediation_signed_at || 'dnes'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: Video 1 Player */}
          {selectedItem === 'video1' && (
            <div className="max-w-4xl w-full flex flex-col gap-4">
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-black/10 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-black">{t('onboardingArchive.module1Title')}</h3>
                  <span className="text-[11px] text-black/50">HD Video Školení</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-black/50 font-medium">Jazyk:</span>
                  <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-black/5">
                    <button
                      onClick={() => setVideo1Lang('cz')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        video1Lang === 'cz' ? 'bg-white text-black shadow-xs' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      CS
                    </button>
                    <button
                      onClick={() => setVideo1Lang('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        video1Lang === 'en' ? 'bg-white text-black shadow-xs' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/15 flex items-center justify-center">
                <video
                  key={`archive-v1-${video1Lang}`}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  <source src={video1Sources[video1Lang]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* VIEW: Video 2 Player */}
          {selectedItem === 'video2' && (
            <div className="max-w-4xl w-full flex flex-col gap-4">
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-black/10 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-black">{t('onboardingArchive.module2Title')}</h3>
                  <span className="text-[11px] text-black/50">HD Video Školení</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-black/50 font-medium">Jazyk:</span>
                  <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-100 border border-black/5">
                    <button
                      onClick={() => setVideo2Lang('cz')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        video2Lang === 'cz' ? 'bg-white text-black shadow-xs' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      CS
                    </button>
                    <button
                      onClick={() => setVideo2Lang('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        video2Lang === 'en' ? 'bg-white text-black shadow-xs' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/15 flex items-center justify-center">
                <video
                  key={`archive-v2-${video2Lang}`}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  <source src={video2Sources[video2Lang]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
