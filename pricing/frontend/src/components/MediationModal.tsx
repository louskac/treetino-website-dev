import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FileText, Signature, AlertTriangle, ChevronRight, CheckCircle2, PenTool, RotateCcw } from 'lucide-react';
import type { User } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  activeUser: User;
  onMediationSigned: (updatedUser: User) => void;
}

export default function MediationModal({ activeUser, onMediationSigned }: Props) {
  const { t, locale } = useI18n();

  // Form fields pre-populated from NDA
  const [company, setCompany] = useState(activeUser.nda_company || activeUser.full_name || activeUser.username);
  const [icoDob, setIcoDob] = useState(activeUser.nda_ico_dob || '');
  const [address, setAddress] = useState(activeUser.nda_address || '');
  const [representative, setRepresentative] = useState(activeUser.nda_representative || activeUser.full_name || activeUser.username);
  const [location, setLocation] = useState(activeUser.nda_location || (locale === 'en' ? 'Prague' : 'Praze'));

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signatureSvg, setSignatureSvg] = useState<string>('');

  const todayStr = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'cs-CZ');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim()) return setError(t('onboarding.errCompany'));
    if (!icoDob.trim()) return setError(t('onboarding.errIco'));
    if (!address.trim()) return setError(t('onboarding.errAddress'));
    if (!representative.trim()) return setError(t('onboarding.errRepresentative'));
    if (!location.trim()) return setError(t('onboarding.errLocation'));

    if (!agreed) {
      return setError(t('onboarding.errAgree'));
    }

    if (!signatureSvg) {
      return setError(t('onboarding.errSignature'));
    }

    setLoading(true);

    try {
      const { data } = await axios.post<User>(`${BACKEND_URL}/users/${activeUser.id}/sign-mediation`, {
        signature: signatureSvg,
        company: company.trim(),
        ico_dob: icoDob.trim(),
        address: address.trim(),
        representative: representative.trim(),
        location: location.trim(),
        lang: locale
      });

      // Trigger automatic PDF document download in active language
      const downloadUrl = `${BACKEND_URL}/users/${activeUser.id}/mediation/download?lang=${locale}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = locale === 'en' 
        ? `Mediation_Agreement_Treetino_${activeUser.username}.pdf` 
        : `Smlouva_Zprostredkovani_Treetino_${activeUser.username}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onMediationSigned(data);
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response && [401, 404].includes(err.response.status)) {
        localStorage.removeItem('treetino_user');
        sessionStorage.removeItem('treetino_user');
        if (activeUser) {
          localStorage.removeItem(`treetino_draft_${activeUser.id}`);
          localStorage.removeItem(`treetino_deals_${activeUser.id}`);
        }
        window.location.reload();
      } else {
        setError(t('onboarding.errMediationSubmit'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col h-screen overflow-hidden font-sans select-none">
      
      {/* ─── Top Header Bar ─── */}
      <header className="h-16 border-b border-black/10 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-white shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-0">
          <LogoType className="h-5.5 w-auto text-black shrink-0" />
          <div className="h-4 w-px bg-black/15 hidden sm:block shrink-0" />
          <span className="text-xs font-semibold tracking-wider text-black/50 uppercase hidden md:inline whitespace-nowrap">
            {t('common.b2bPortal')} • {t('onboarding.step2Mediation')}
          </span>
        </div>

        {/* Step Indicator & Locale Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden lg:inline">{t('onboarding.step1NdaSigned')}</span>
              <span className="lg:hidden">{t('onboarding.step1Nda')}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183d89] text-white font-semibold text-[11px] whitespace-nowrap">
              <span>{t('onboarding.step2Mediation')}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-black/40 font-medium text-[11px] whitespace-nowrap">
              <span>{t('onboarding.step3Video')}</span>
            </div>
          </div>

          <div className="hidden sm:block shrink-0">
            <LocaleSwitcher inverted />
          </div>
        </div>
      </header>

      {/* ─── Main Screen (Zero Window Scroll, 2 Independent Panels) ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* ══════════════════════════════════════════════════════════════
            LEFT PANEL: Compact Form & Action Sidebar (Fixed / Self-scrolling)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[480px] xl:w-[520px] border-r border-black/10 bg-white flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <form onSubmit={handleSign} className="p-6 sm:p-7 flex flex-col gap-5">
            
            {/* Header Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183d89]/10 text-[#183d89] text-[10px] font-bold uppercase tracking-wider mb-2">
                <FileText className="w-3 h-3" />
                <span>{t('onboarding.step2Of3')}</span>
              </div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight">
                {t('onboarding.mediationTitle')}
              </h1>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                {t('onboarding.mediationDesc')}
              </p>
            </div>

            {/* Input Form Grid */}
            <div className="space-y-3 pt-1">
              
              {/* Company / Name */}
              <div className="grid gap-1 text-left">
                <label className="text-[11px] font-semibold text-black">
                  {t('onboarding.companyOrName')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('onboarding.companyOrNamePlaceholder')}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-9 w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89] transition-all"
                />
              </div>

              {/* ICO & City in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1 text-left">
                  <label className="text-[11px] font-semibold text-black">
                    {t('onboarding.icoOrDob')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('onboarding.icoOrDobPlaceholder')}
                    value={icoDob}
                    onChange={(e) => setIcoDob(e.target.value)}
                    className="h-9 w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89] transition-all"
                  />
                </div>

                <div className="grid gap-1 text-left">
                  <label className="text-[11px] font-semibold text-black">
                    {t('onboarding.signingLocation')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('onboarding.signingLocationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89] transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid gap-1 text-left">
                <label className="text-[11px] font-semibold text-black">
                  {t('onboarding.address')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('onboarding.addressPlaceholder')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9 w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89] transition-all"
                />
              </div>

              {/* Representative */}
              <div className="grid gap-1 text-left">
                <label className="text-[11px] font-semibold text-black">
                  {t('onboarding.representative')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('onboarding.representativePlaceholder')}
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                  className="h-9 w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-[#183d89] focus:ring-1 focus:ring-[#183d89] transition-all"
                />
              </div>

            </div>

            {/* Signature Section */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-black uppercase tracking-wider">
                  {t('onboarding.signatureLabel')} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-black/40 font-mono">
                  {location 
                    ? t('onboarding.signedInOn', { city: location, date: todayStr })
                    : t('onboarding.signedOn', { date: todayStr })}
                </span>
              </div>

              {/* Signature Canvas Box */}
              <div className="relative h-28 bg-stone-50 border border-black/15 rounded-xl overflow-hidden cursor-crosshair">
                <SignaturePadInner 
                  onSignatureChange={setSignatureSvg} 
                  placeholder={t('onboarding.signatureInstructions')}
                />
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="mediation-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/20 text-[#183d89] focus:ring-[#183d89] accent-[#183d89] cursor-pointer"
              />
              <label htmlFor="mediation-agree" className="text-[11px] text-black/75 leading-tight cursor-pointer select-none font-medium">
                {t('onboarding.mediationAgreementCheck')}
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#183d89] hover:bg-[#153475] px-4 py-2.5 text-center text-sm font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 gap-2"
            >
              <Signature className="w-4 h-4" />
              <span>{loading ? t('onboarding.activationInFlight') : t('onboarding.signAndActivate')}</span>
            </button>

          </form>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT PANEL: Seamless Paper Legal Document (Scrollable internally)
           ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-stone-100/50 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          
          <div className="max-w-3xl mx-auto bg-white border border-black/10 rounded-2xl p-8 sm:p-12 shadow-xs text-black/85 font-sans leading-relaxed space-y-7">
            
            {/* Header */}
            <div className="text-center pb-6 border-b border-black/10 space-y-1.5">
              <span className="text-[10px] font-bold text-[#183d89] tracking-widest uppercase block">
                {locale === 'en' ? 'TREETINO CORP S.R.O. • LEGAL DOCUMENTATION' : 'TREETINO CORP S.R.O. • PRÁVNÍ DOKUMENTACE'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-tight font-display">
                {locale === 'en' 
                  ? 'COMMERCIAL MEDIATION AND BROKERAGE AGREEMENT'
                  : 'SMLOUVA O ZPROSTŘEDKOVÁNÍ'}
              </h2>
              <p className="text-[11px] text-black/50 font-normal">
                {locale === 'en'
                  ? 'concluded pursuant to Section 2445 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended'
                  : 'uzavřená dle ustanovení § 2445 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů'}
              </p>
            </div>

            {/* Parties */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                {locale === 'en' ? 'I. Contracting Parties' : 'I. Smluvní strany'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Client / Zajemce */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-black/10 space-y-1">
                  <div className="font-bold text-[#183d89] text-[11px] uppercase tracking-wide">
                    {locale === 'en' ? '1. Principal (Company):' : '1. Zájemce:'}
                  </div>
                  <div className="text-[11px] text-black/80 space-y-0.5">
                    <div>{locale === 'en' ? 'Company:' : 'Firma:'} <strong className="text-black">Treetino corp s.r.o.</strong></div>
                    <div>{locale === 'en' ? 'Company ID:' : 'IČO:'} <strong className="text-black">10800107</strong></div>
                    <div>{locale === 'en' ? 'Registered Office:' : 'Sídlo:'} <strong className="text-black">Vlčetín 62, Bílá 46343</strong></div>
                    <div>{locale === 'en' ? 'Represented by:' : 'Zastoupena:'} <strong className="text-black">Dominik Mašek</strong></div>
                  </div>
                </div>

                {/* 2. Broker / Zprostredkovatel (Live reactive highlight) */}
                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-[#183d89]/25 space-y-1">
                  <div className="font-bold text-[#183d89] text-[11px] uppercase tracking-wide">
                    {locale === 'en' ? '2. Broker (Partner):' : '2. Zprostředkovatel:'}
                  </div>
                  <div className="text-[11px] text-black/80 space-y-0.5">
                    <div>{locale === 'en' ? 'Name / Company:' : 'Jméno / Firma:'} <strong className={company ? "text-black" : "text-amber-600 font-medium italic"}>
                      {company || (locale === 'en' ? '[ Fill in on the left ]' : '[ Doplňte vlevo ]')}
                    </strong></div>
                    <div>{locale === 'en' ? 'ID / Date of Birth:' : 'IČO / Datum nar.:'} <strong className={icoDob ? "text-black" : "text-amber-600 font-medium italic"}>
                      {icoDob || (locale === 'en' ? '[ Fill in on the left ]' : '[ Doplňte vlevo ]')}
                    </strong></div>
                    <div>{locale === 'en' ? 'Address / Office:' : 'Sídlo / Bydliště:'} <strong className={address ? "text-black" : "text-amber-600 font-medium italic"}>
                      {address || (locale === 'en' ? '[ Fill in on the left ]' : '[ Doplňte vlevo ]')}
                    </strong></div>
                    <div>{locale === 'en' ? 'Representative:' : 'Zástupce:'} <strong className={representative ? "text-black" : "text-amber-600 font-medium italic"}>
                      {representative || (locale === 'en' ? '[ Fill in on the left ]' : '[ Doplňte vlevo ]')}
                    </strong></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-black/60 pt-1">
                {locale === 'en' 
                  ? '(hereinafter jointly referred to as the "Parties", or each individually as a "Party")'
                  : '(dále společně jen jako „Smluvní strany“, každý samostatně pak jako „Smluvní strana“)'}
              </p>
            </div>

            {/* Articles */}
            <div className="space-y-4 text-xs text-black/75">
              
              {locale === 'en' ? (
                <>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      II. Subject of Agreement
                    </h3>
                    <p>
                      <strong>2.1</strong> The Broker hereby undertakes to carry out activities on behalf of the Principal aimed at enabling the Principal to conclude purchase contracts and supply contracts for Treetino autonomous solar and wind trees with third-party clients.
                    </p>
                    <p>
                      <strong>2.2</strong> The Principal undertakes to pay the Broker a commission for this commercial mediation activity in accordance with the terms of this Agreement and the B2B portal commission rules.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      III. Commission Terms & Payouts
                    </h3>
                    <p>
                      <strong>3.1</strong> The Broker becomes entitled to the commission upon the formal conclusion of the mediated supply contract between the Principal and the third party, and the receipt of the purchase price or deposit from the client.
                    </p>
                    <p>
                      <strong>3.2</strong> The commission rate and discount thresholds are determined by the Broker's assigned performance tier (Silver, Gold, Platinum).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IV. Final Provisions
                    </h3>
                    <p>
                      <strong>4.1</strong> This Agreement enters into force and takes effect on the date of its electronic signing by both Parties.
                    </p>
                    <p>
                      <strong>4.2</strong> This Agreement is concluded for an indefinite period.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      II. Předmět smlouvy
                    </h3>
                    <p>
                      <strong>2.1</strong> Zprostředkovatel se touto smlouvou zavazuje vyvíjet pro Zájemce činnost směřující k tomu, aby Zájemce měl příležitost uzavřít kupní smlouvy či smlouvy o dílo na dodávku autonomních solárních a větrných stromů Treetino s třetími osobami.
                    </p>
                    <p>
                      <strong>2.2</strong> Zájemce se zavazuje zaplatit Zprostředkovateli za tuto činnost provizi v souladu s podmínkami stanovenými v této smlouvě a platným provizním řádem B2B portálu.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      III. Provizní podmínky
                    </h3>
                    <p>
                      <strong>3.1</strong> Nárok na provizi vzniká Zprostředkovateli okamžikem řádného uzavření zprostředkovávané smlouvy mezi Zájemcem a třetí osobou a uhrazením kupní ceny nebo zálohy třetí osobou.
                    </p>
                    <p>
                      <strong>3.2</strong> Výše provize a slevový rámec se řídí zařazením Zprostředkovatele v příslušné výkonnostní třídě (Silver, Gold, Platinum).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IV. Závěrečná ustanovení
                    </h3>
                    <p>
                      <strong>4.1</strong> Tato smlouva nabývá platnosti a účinnosti dnem jejího elektronického podpisu oběma smluvními stranami.
                    </p>
                    <p>
                      <strong>4.2</strong> Smlouva se uzavírá na dobu neurčitou.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Document Signature Bottom preview */}
            <div className="pt-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-black/15 shadow-2xs">
                <span className="text-[10px] text-black/50 font-semibold block uppercase">
                  {locale === 'en' ? 'For Treetino corp s.r.o.' : 'Za Treetino corp s.r.o.'}
                </span>
                <span className="text-xs font-bold text-black block mt-0.5">Dominik Mašek</span>
                <div className="text-[10px] text-black/40 font-mono mt-0.5">
                  {locale === 'en' ? `In Prague on: ${todayStr}` : `V Praze dne: ${todayStr}`}
                </div>
                <div className="mt-2 h-24 sm:h-28 flex items-center justify-center bg-stone-50/50 rounded-lg border border-dashed border-black/10 p-2">
                  <img 
                    src="/branding/signature_masek_2.png" 
                    alt="Podpis Dominik Mašek" 
                    className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply pointer-events-none" 
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-black/15 shadow-2xs">
                <span className="text-[10px] text-black/50 font-semibold block uppercase">
                  {locale === 'en' ? 'For Broker (Partner)' : 'Za Zprostředkovatele'}
                </span>
                <span className="text-xs font-bold text-black block mt-0.5">{representative || company || (locale === 'en' ? 'Partner' : 'Partner')}</span>
                <div className="text-[10px] text-black/40 font-mono mt-0.5">
                  {locale === 'en' 
                    ? `In ${location.trim() || '__________'} on: ${todayStr}`
                    : `V ${location.trim() || '__________'} dne: ${todayStr}`}
                </div>
                <div className="mt-2 h-24 sm:h-28 flex items-center justify-center bg-blue-50/30 rounded-lg border border-dashed border-[#183d89]/20 p-2">
                  {signatureSvg ? (
                    <div 
                      className="h-20 sm:h-24 w-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: signatureSvg }}
                    />
                  ) : (
                    <span className="text-xs text-black/40 italic font-sans text-center">
                      {locale === 'en' ? 'Awaiting electronic signature on the left...' : 'Čeká na elektronický podpis vlevo...'}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// ─── Inline Signature Pad Component ─────────────────────────────
function SignaturePadInner({ 
  onSignatureChange, 
  placeholder 
}: { 
  onSignatureChange: (svg: string) => void;
  placeholder: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokesRef = useRef<{ x: number; y: number }[][]>([]);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const [hasStrokes, setHasStrokes] = useState(false);

  const strokeColor = '#183d89';
  const strokeWidth = 2.8;

  const initContext = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      initContext(ctx);
    }
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
    const clientX = 'touches' in nativeEvent && nativeEvent.touches.length > 0 
      ? nativeEvent.touches[0].clientX 
      : (nativeEvent as MouseEvent).clientX;
    const clientY = 'touches' in nativeEvent && nativeEvent.touches.length > 0 
      ? nativeEvent.touches[0].clientY 
      : (nativeEvent as MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const generateSvg = (allStrokes: { x: number; y: number }[][]) => {
    if (allStrokes.length === 0) return '';
    const paths = allStrokes.map(stroke => {
      if (stroke.length === 0) return '';
      if (stroke.length === 1) {
        const pt = stroke[0];
        return `<path d="M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} L ${(pt.x + 0.1).toFixed(1)} ${(pt.y + 0.1).toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
      }
      const d = stroke.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
      return `<path d="${d}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
    }).filter(Boolean).join('');

    return `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${paths}</svg>`;
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    initContext(ctx);
    const p = getPos(e);
    currentStrokeRef.current = [p];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = getPos(e);
    currentStrokeRef.current.push(p);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const handleEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push([...currentStrokeRef.current]);
      currentStrokeRef.current = [];
      const svg = generateSvg(strokesRef.current);
      onSignatureChange(svg);
      setHasStrokes(true);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    strokesRef.current = [];
    currentStrokeRef.current = [];
    isDrawingRef.current = false;
    onSignatureChange('');
    setHasStrokes(false);
  };

  return (
    <div className="w-full h-full relative group">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        className="w-full h-full block touch-none"
      />
      {!hasStrokes && (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] text-black/30 pointer-events-none select-none">
          <PenTool className="w-3.5 h-3.5 text-[#183d89]/40 mr-1.5" />
          <span>{placeholder}</span>
        </div>
      )}
      {hasStrokes && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-stone-100/95 hover:bg-stone-200 border border-black/10 text-[10px] font-semibold text-[#183d89] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Smazat</span>
        </button>
      )}
    </div>
  );
}
