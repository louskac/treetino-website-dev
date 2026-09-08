import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Signature, AlertTriangle, ChevronRight, PenTool, RotateCcw } from 'lucide-react';
import type { User } from '../types';
import LogoType from './LogoType';
import LocaleSwitcher from './LocaleSwitcher';
import { useI18n } from '../i18n';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8001');

interface Props {
  activeUser: User;
  onNdaSigned: (updatedUser: User) => void;
}

export default function NdaModal({ activeUser, onNdaSigned }: Props) {
  const { t, locale } = useI18n();

  // Form fields
  const [company, setCompany] = useState(activeUser.full_name || activeUser.username);
  const [icoDob, setIcoDob] = useState('');
  const [address, setAddress] = useState('');
  const [representative, setRepresentative] = useState(activeUser.full_name || activeUser.username);
  const [location, setLocation] = useState(activeUser.nda_location || (locale === 'en' ? 'Prague' : 'Praze'));

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signatureSvg, setSignatureSvg] = useState<string>('');

  const todayStr = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'cs-CZ');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!company.trim()) return setError(t('onboarding.errCompany'));
    if (!icoDob.trim()) return setError(t('onboarding.errIco'));
    if (!address.trim()) return setError(t('onboarding.errAddress'));
    if (!representative.trim()) return setError(t('onboarding.errRepresentative'));
    if (!location.trim()) return setError(t('onboarding.errLocation'));
    if (!agreed) return setError(t('onboarding.errAgree'));
    if (!signatureSvg) return setError(t('onboarding.errSignature'));

    setLoading(true);

    try {
      const { data } = await axios.post<User>(`${BACKEND_URL}/users/${activeUser.id}/sign-nda`, {
        signature: signatureSvg,
        company: company.trim(),
        ico_dob: icoDob.trim(),
        address: address.trim(),
        representative: representative.trim(),
        location: location.trim(),
        lang: locale
      });

      // Trigger automatic PDF document download in active language
      const downloadUrl = `${BACKEND_URL}/users/${activeUser.id}/nda/download?lang=${locale}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = locale === 'en' 
        ? `NDA_Treetino_${activeUser.username}_EN.pdf` 
        : `NDA_Treetino_${activeUser.username}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onNdaSigned(data);
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
        setError(t('onboarding.errNdaSubmit'));
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
            {t('common.b2bPortal')} • {t('onboarding.step1Nda')}
          </span>
        </div>

        {/* Step Indicator & Locale Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183d89] text-white font-semibold text-[11px] whitespace-nowrap">
              <span>{t('onboarding.step1Nda')}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-black/40 font-medium text-[11px] whitespace-nowrap">
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
                <ShieldCheck className="w-3 h-3" />
                <span>{t('onboarding.step1Of3')}</span>
              </div>
              <h1 className="text-xl font-bold text-black font-display tracking-tight">
                {t('onboarding.ndaTitle')}
              </h1>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                {t('onboarding.ndaDesc')}
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
                id="nda-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/20 text-[#183d89] focus:ring-[#183d89] accent-[#183d89] cursor-pointer"
              />
              <label htmlFor="nda-agree" className="text-[11px] text-black/75 leading-tight cursor-pointer select-none font-medium">
                {t('onboarding.ndaAgreementCheck')}
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
              <span>{loading ? t('onboarding.signingAndGenerating') : t('onboarding.signAndContinue')}</span>
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
                {locale === 'en' ? 'LEGAL DOCUMENT • NON-DISCLOSURE AGREEMENT (NDA)' : 'PRÁVNÍ DOKUMENT • NON-DISCLOSURE AGREEMENT (NDA)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-tight font-display">
                {locale === 'en' 
                  ? 'NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT'
                  : 'DOHODA O MLČENLIVOSTI, OCHRANĚ INFORMACÍ A ZÁKAZU JEJICH ZNEUŽITÍ'}
              </h2>
              <p className="text-[11px] text-black/50 font-normal">
                {locale === 'en'
                  ? 'entered into pursuant to Section 1746(2) and Section 1730 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended'
                  : 'uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů'}
              </p>
            </div>

            {/* Parties */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                {locale === 'en' ? 'I. Contracting Parties' : 'I. Smluvní strany'}
              </h3>
              
              <p className="text-[11px] text-black/70">
                {locale === 'en'
                  ? 'On the date, month, and year indicated below, the following Contracting Parties enter into this Non-Disclosure and Confidentiality Agreement (hereinafter the "Agreement"):'
                  : 'Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Dohodu o mlčenlivosti, ochraně informací a zákazu jejich zneužití (dále jen „Dohoda“):'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Discloser / Poskytovatel */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-black/10 space-y-1.5">
                  <div className="font-bold text-[#183d89] text-[11px] uppercase tracking-wide">
                    {locale === 'en' ? '1.1 Disclosing Party (Treetino):' : '1.1 Poskytovatel (Treetino):'}
                  </div>
                  <div className="text-[11px] text-black/80 space-y-0.5">
                    <div>{locale === 'en' ? 'Company Name:' : 'Obchodní firma:'} <strong className="text-black">Treetino corp s.r.o.</strong></div>
                    <div>{locale === 'en' ? 'Company ID (IČO):' : 'IČO:'} <strong className="text-black">10800107</strong></div>
                    <div>{locale === 'en' ? 'Registered Seat:' : 'Sídlo:'} <strong className="text-black">Vlčetín 62, Bílá 463 43</strong></div>
                    <div>{locale === 'en' ? 'Represented by:' : 'Zastoupena:'} <strong className="text-black">Dominik Mašek, {locale === 'en' ? 'Managing Director' : 'jednatel'}</strong></div>
                    <div>{locale === 'en' ? 'Registry:' : 'Rejstřík:'} <strong className="text-black">KS v Ústí n. L., C 48430</strong></div>
                    <div>{locale === 'en' ? 'Email:' : 'E-mail:'} <strong className="text-black">info@treetino.com</strong></div>
                  </div>
                  <div className="text-[10px] text-black/50 italic pt-0.5">
                    {locale === 'en' ? '(hereinafter referred to as the "Disclosing Party" or "Treetino")' : '(dále jen jako „Poskytovatel“ nebo „Treetino“)'}
                  </div>
                </div>

                {/* 2. Recipient / Prijemce (Live reactive highlight) */}
                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-[#183d89]/25 space-y-1.5">
                  <div className="font-bold text-[#183d89] text-[11px] uppercase tracking-wide">
                    {locale === 'en' ? '1.2 Receiving Party (Partner):' : '1.2 Příjemce (Partner / Prodejce):'}
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
                    <div>{locale === 'en' ? 'Email:' : 'E-mail:'} <strong className="text-black">{activeUser.email || '—'}</strong></div>
                  </div>
                  <div className="text-[10px] text-black/50 italic pt-0.5">
                    {locale === 'en' ? '(hereinafter referred to as the "Receiving Party" or "Commercial Partner")' : '(dále jen jako „Příjemce“ nebo „Obchodní partner“)'}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-black/60 pt-1">
                {locale === 'en' 
                  ? '(The Disclosing Party and the Receiving Party hereinafter collectively referred to as the "Parties", or individually as a "Party")'
                  : '(Poskytovatel a Příjemce dále společně také jen jako „Smluvní strany“, nebo každý samostatně jako „Smluvní strana“)'}
              </p>
            </div>

            {/* Articles */}
            <div className="space-y-4 text-xs text-black/75">
              
              {locale === 'en' ? (
                <>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      II. Preamble and Purpose of the Agreement
                    </h3>
                    <p>
                      <strong>2.1</strong> The Parties are engaged in mutual negotiations regarding the establishment and execution of commercial and technical collaboration, within which the Receiving Party, acting as a sales representative, commercial agent, distributor, or partner entity, will conduct business development activities, specifically identifying commercial opportunities, mediating sales, presenting, marketing, and securing distribution or installation of Treetino products and technologies (including autonomous solar and wind trees Treetino V1, Treetino V2, vertical wind microturbines T1, and related accessories), as well as utilizing Treetino's proprietary sales and calculation software (Treetino Pricing App, CRM, partner portal, and 3D configuration tools) – hereinafter referred to as „<strong>Mutual Collaboration</strong>“.
                    </p>
                    <p>
                      <strong>2.2</strong> For the purpose of negotiating and performing the Mutual Collaboration, the Disclosing Party will provide the Receiving Party with highly confidential commercial, pricing, technical, developmental, strategic, customer, and operational information and know-how, which constitute valuable trade secrets and intellectual property of the Disclosing Party and hold essential economic and competitive value.
                    </p>
                    <p>
                      <strong>2.3</strong> The purpose of this Agreement is to establish binding rules and legal framework for the protection of all Confidential Information and Trade Secrets of the Disclosing Party, define the Receiving Party's obligations in handling such information, prohibit any unauthorized disclosure, dissemination, or utilization thereof, and determine legal remedies and sanctions in the event of any breach.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      III. Definition of Confidential Information and Trade Secrets
                    </h3>
                    <p>
                      <strong>3.1 „Confidential Information“</strong> for the purposes of this Agreement means any and all information, facts, data, documents, materials, designs, analyses, and know-how of any nature (technical, commercial, pricing, financial, legal, manufacturing, strategic, operational, or organizational), in tangible or intangible form, regardless of the manner or medium of transmission (oral, written, electronic, CAD/3D models, drawings, source/binary code, demonstration of prototypes, or software), that the Disclosing Party has directly or indirectly disclosed, provided, or made accessible to the Receiving Party, or of which the Receiving Party became aware in connection with the negotiations or Mutual Collaboration (hereinafter „<strong>Confidential Information</strong>“).
                    </p>
                    <p>
                      <strong>3.2</strong> Confidential Information and <strong>Trade Secrets</strong> within the meaning of Section 504 and Section 1730 of the Civil Code include, without limitation:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li><strong>Commercial, pricing, and financial data:</strong> wholesale/retail price lists, margin and discount structures, sales representative commission schedules and compensation models, calculation matrices and formulas, customized quotes prepared for clients, commercial and marketing strategies, sales pipeline, and expansion plans;</li>
                      <li><strong>Customer and partner records:</strong> database of client inquiries, contact details and identities of existing and prospective customers, sales leads, negotiation history, CRM records, and terms negotiated with suppliers and sub-contractors;</li>
                      <li><strong>Technical documentation and know-how:</strong> engineering drawings, 3D CAD models, electrical wiring schematics, technical specifications of solar/wind trees, composite material specifications, aerodynamic profiles of microturbines, inverter integration, electronic controllers, and battery energy storage systems;</li>
                      <li><strong>Software, digital assets, and system credentials:</strong> source and binary code, database schemas, web and cloud applications (specifically Treetino Pricing / Sales App), API endpoints, and all user credentials (usernames, passwords, API tokens, and certificates) issued to the Receiving Party;</li>
                      <li><strong>Strategic and legal assets:</strong> information regarding pending patents, utility and industrial designs, investment discussions, corporate partnerships, and internal standard operating procedures.</li>
                    </ul>
                    <p>
                      <strong>3.3</strong> Confidential Information also includes the very existence of this Agreement, the fact that negotiations are taking place between the Parties, and all terms and parameters of the Mutual Collaboration.
                    </p>
                    <p>
                      <strong>3.4</strong> All information specified in this Article is hereinafter collectively referred to as „<strong>Protected Information</strong>“. All information disclosed by the Disclosing Party shall be deemed Protected Information unless explicitly designated otherwise in writing by the Disclosing Party.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IV. Obligations of the Receiving Party and Data Protection
                    </h3>
                    <p>
                      <strong>4.1 The Receiving Party irrevocably covenants and agrees:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li>To maintain the strictest confidentiality regarding all Protected Information and to protect it with the care of a prudent businessperson and the highest standard of professional diligence;</li>
                      <li>To use the Protected Information exclusively for the performance of the agreed Mutual Collaboration and solely for the benefit of the Disclosing Party;</li>
                      <li>Not to disclose, transfer, make accessible, disseminate, publish, or otherwise permit access to the Protected Information to any third party without the prior express written consent of the Disclosing Party;</li>
                      <li>Not to utilize the Protected Information (including acquired know-how, calculation models, and customer databases) for its own commercial benefit or for the benefit of any third party, in particular not to engage in direct or indirect competitive activity against the Disclosing Party nor develop or offer competing technical or commercial solutions;</li>
                      <li>Not to take any steps aimed at circumventing the Disclosing Party (<strong>non-circumvention obligation</strong>), in particular not to directly approach, contact, or solicit clients, prospects, or suppliers of the Disclosing Party discovered in the course of the Mutual Collaboration for the purpose of concluding transactions outside of the Disclosing Party.</li>
                    </ul>
                    <p>
                      <strong>4.2 Access Restriction:</strong> The Receiving Party may disclose Protected Information solely to its statutory representatives, employees, and professional advisors who strictly need to know such information for the purposes of the Mutual Collaboration (<em>need-to-know basis</em>). The Receiving Party must ensure that such individuals are bound by confidentiality obligations at least as stringent as those contained herein, and the Receiving Party remains fully liable for any breach committed by such individuals as if it had committed the breach itself.
                    </p>
                    <p>
                      <strong>4.3 Technical Security Measures:</strong> The Receiving Party undertakes to secure all devices (computers, smartphones, tablets) used to access the Disclosing Party's software and systems with strong passwords, biometric authentication, and two-factor authentication (2FA). The Receiving Party shall not share its credentials with any third party and shall not store Protected Information on public or unencrypted cloud storage.
                    </p>
                    <p>
                      <strong>4.4 Notification Duty:</strong> In the event of discovering any unauthorized access, breach, leakage, loss, or disclosure of Protected Information, the Receiving Party shall immediately (and no later than within 24 hours) notify the Disclosing Party in writing and provide all necessary assistance to mitigate damages.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      V. Exceptions to Confidentiality Obligations
                    </h3>
                    <p>
                      <strong>5.1</strong> The confidentiality obligation under this Agreement shall not apply to information that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li>Was demonstrably publicly known at the time of disclosure, or became publicly known subsequent to disclosure other than through a breach of this Agreement by the Receiving Party;</li>
                      <li>Was demonstrably and lawfully in the possession of the Receiving Party prior to disclosure by the Disclosing Party;</li>
                      <li>Was released from confidentiality by prior written consent of the Disclosing Party;</li>
                      <li>The Receiving Party is obligated to disclose pursuant to mandatory legal provisions, a binding court judgment, or an order of a law enforcement or public authority (provided that the Receiving Party shall immediately notify the Disclosing Party in advance in writing, disclose only the minimum required scope, and request confidential treatment).</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VI. Intellectual Property and Return of Materials
                    </h3>
                    <p>
                      <strong>6.1</strong> All intellectual property rights, trade secrets, patents, utility models, trademarks, copyrights, engineering designs, know-how, databases, and software tools remain the sole and exclusive property of the Disclosing Party. The provision of Protected Information conveys no license, patent right, or title to the Receiving Party.
                    </p>
                    <p>
                      <strong>6.2 Return and Disposal of Materials:</strong> Upon written request by the Disclosing Party or at latest within 5 (five) business days following termination of the Mutual Collaboration, the Receiving Party shall return to the Disclosing Party all tangible materials, data carriers, drawings, samples, and documents containing Protected Information, and permanently and irrevocably erase/shred all digital copies and records from all its devices and servers.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VII. Contractual Penalty and Damages
                    </h3>
                    <p>
                      <strong>7.1</strong> In the event of any breach by the Receiving Party of any obligation set forth in this Agreement (including breach of confidentiality, unauthorized disclosure, commercial misuse, breach of non-circumvention/non-compete covenants, or failure to return materials), the Receiving Party shall pay to the Disclosing Party a <strong>contractual penalty of €4,000 / CZK 100,000 (four thousand Euros / one hundred thousand Czech crowns)</strong> for each individual breach. In the case of a continuing breach, a contractual penalty of <strong>€200 / CZK 5,000</strong> shall be paid for each day or part thereof during which such breach continues.
                    </p>
                    <p>
                      <strong>7.2</strong> The contractual penalty shall be due and payable within 14 (fourteen) calendar days following delivery of a written demand for payment to the Receiving Party.
                    </p>
                    <p>
                      <strong>7.3 Damages:</strong> The agreement on and payment of a contractual penalty shall not affect or limit the Disclosing Party's right to full compensation for all damages, pecuniary and non-pecuniary losses, and lost profits in full. The Parties <strong>expressly exclude the application of Section 2050 of the Civil Code</strong> and agree that claims for damages remain enforceable in full alongside contractual penalties.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VIII. Duration and Effectiveness
                    </h3>
                    <p>
                      <strong>8.1</strong> This Agreement takes effect upon its signature by both Parties and is entered into for an <strong>indefinite term</strong>.
                    </p>
                    <p>
                      <strong>8.2</strong> The confidentiality obligations regarding Protected Information shall survive and remain in effect throughout the duration of negotiations and Mutual Collaboration and for a period of <strong>5 (five) years</strong> following the termination of all collaboration; with respect to information constituting trade secrets or proprietary know-how of the Disclosing Party, confidentiality obligations shall survive indefinitely for as long as such trade secrets exist.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IX. Final Provisions
                    </h3>
                    <p>
                      <strong>9.1</strong> Legal relations under this Agreement shall be governed by the laws of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code. Any disputes shall be submitted to the competent general courts of the Czech Republic having jurisdiction over the registered seat of the Disclosing Party.
                    </p>
                    <p>
                      <strong>9.2</strong> Amendments to this Agreement must be made in writing in sequentially numbered addenda signed by both Parties. Should any provision be deemed invalid, the remaining provisions shall remain fully effective (severability clause).
                    </p>
                    <p>
                      <strong>9.3</strong> This Agreement is executed in counterparts with the force of an original, or in an electronic format executed via recognized electronic signatures by both Parties.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      II. Preambule a účel dohody
                    </h3>
                    <p>
                      <strong>2.1</strong> Smluvní strany vedou vzájemná jednání o navázání a realizaci obchodní a technické spolupráce, v jejímž rámci bude Příjemce jako obchodní zástupce, prodejce, distributor nebo partnerská společnost vyvíjet obchodní činnost, zejména vyhledávat obchodní příležitosti, zprostředkovávat prodej, prezentovat, propagovat a zajišťovat distribuci nebo instalaci produktů a technologií společnosti Treetino (zejména autonomních větrných a solárních stromů Treetino V1, Treetino V2, vertikálních větrných mikroturbín T1 a souvisejícího příslušenství) a využívat obchodní software a kalkulační nástroje Poskytovatele (Treetino Pricing App, CRM, partnerský portál a konfigurační nástroje) – dále jen „<strong>Vzájemná spolupráce</strong>“.
                    </p>
                    <p>
                      <strong>2.2</strong> Za účelem jednání o Vzájemné spolupráci a jejího následného řádného výkonu bude Poskytovatel Příjemci zpřístupňovat vysoce důvěrné obchodní, cenové, technické, vývojové, strategické, klientské a provozní informace a know-how, které představují cenné obchodní tajemství a duševní vlastnictví Poskytovatele a mají zásadní hospodářskou hodnotu.
                    </p>
                    <p>
                      <strong>2.3</strong> Účelem této Dohody je stanovení přesných a závazných podmínek pro ochranu důvěrných informací a obchodního tajemství Poskytovatele, vymezení povinností Příjemce při nakládání s těmito informacemi, zákaz jejich neoprávněného užití, vyzrazení, šíření či zpřístupnění třetím osobám a stanovení právních následků a sankcí v případě jejich porušení.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      III. Vymezení důvěrných informací a obchodního tajemství
                    </h3>
                    <p>
                      <strong>3.1 Důvěrnými informacemi</strong> se pro účely této Dohody rozumí veškeré informace, skutečnosti, data, podklady, materiály a know-how jakékoliv povahy (technické, obchodní, finanční, cenové, právní, výrobní, strategické, provozní či organizační), bez ohledu na formu a způsob jejich zachycení nebo sdělení (ústně, písemně, elektronicky, v podobě výkresů, 3D CAD modelů, zdrojových kódů či předvedením prototypů a softwaru), které Poskytovatel Příjemci přímo či nepřímo zpřístupnil, sdělil, předal nebo které se Příjemce v souvislosti s jednáním či Vzájemnou spoluprací dozvěděl (dále jen „<strong>Důvěrné informace</strong>“).
                    </p>
                    <p>
                      <strong>3.2</strong> Za Důvěrné informace a <strong>obchodní tajemství</strong> Poskytovatele ve smyslu ustanovení § 504 a § 1730 občanského zákoníku se považují zejména, nikoliv však výlučně:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li><strong>Obchodní, cenové a finanční informace:</strong> prodejní i nákupní ceníky, struktura marží a slev, provizní řády a odměňovací modely prodejců, kalkulační matice a vzorce, cenové nabídky připravované pro zákazníky, obchodní a marketingové strategie, obchodní pipeline a plány expanze na tuzemské i zahraniční trhy;</li>
                      <li><strong>Klientská a partnerská data:</strong> databáze poptávek, kontaktů a identifikačních údajů stávajících i potenciálních zákazníků, rozpracované obchodní případy (leads), historie komunikace s klienty, záznamy v CRM a obchodních evidencích, a podmínky sjednané s dodavateli;</li>
                      <li><strong>Technická dokumentace a know-how:</strong> výrobní a konstrukční výkresy, 3D CAD modely, schémata zapojení, technické parametry větrných a solárních stromů, materiálové specifikace kompozitů, aerodynamické profily mikroturbín, řešení střídačů, řídicí elektroniky a bateriových systémů;</li>
                      <li><strong>Software, digitální aktiva a přístupy:</strong> veškeré zdrojové i binární kódy, databázové struktury, webové a cloudové aplikace (zejména Treetino Pricing / Sales App), přístupová rozhraní (API), jakož i veškeré přístupové údaje (uživatelská jména, hesla, tokeny a certifikáty) přidělené Příjemci;</li>
                      <li><strong>Strategické a organizační informace:</strong> informace o patentech, užitných a průmyslových vzorech v přípravě, investičních jednáních, smluvních vztazích s partnery a interních provozních postupech.</li>
                    </ul>
                    <p>
                      <strong>3.3</strong> Důvěrnou informací je rovněž samotná existence této Dohody, skutečnost, že mezi Smluvními stranami probíhají jednání, a veškerý obsah a parametry Vzájemné spolupráce.
                    </p>
                    <p>
                      <strong>3.4</strong> Veškeré informace uvedené v tomto článku jsou dále souhrnně označovány jako „<strong>Chráněné informace</strong>“. Má se za to, že veškeré informace předané Poskytovatelem Příjemci jsou Chráněnými informacemi, ledaže Poskytovatel výslovně písemně prohlásí opak.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IV. Závazky Příjemce a pravidla ochrany informací
                    </h3>
                    <p>
                      <strong>4.1 Příjemce se tímto neodvolatelně zavazuje:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li>Zachovávat o všech Chráněných informacích nejpřísnější mlčenlivost a chránit je s péčí řádného hospodáře a nejvyšší možnou mírou obezřetnosti;</li>
                      <li>Užívat Chráněné informace výhradně a pouze za účelem plnění dohodnuté Vzájemné spolupráce a výhradně ve prospěch Poskytovatele;</li>
                      <li>Neposkytnout, nesdělit, nezpřístupnit, nerozšiřovat, nepublikovat ani neumožnit přístup k Chráněným informacím žádné třetí osobě bez předchozího výslovného písemného souhlasu Poskytovatele;</li>
                      <li>Nevyužít Chráněné informace (včetně získaného know-how, kalkulačních modelů a klientských databází) ve svůj vlastní prospěch ani ve prospěch jakékoliv třetí osoby, zejména nevyvíjet přímou ani nepřímou konkurenční činnost vůči Poskytovateli a nevyvíjet ani nenabízet obdobná technická či obchodní řešení;</li>
                      <li>Nečinit žádné kroky směřující k obcházení Poskytovatele (<strong>zákaz obcházení / non-circumvention</strong>), zejména nekontaktovat napřímo klienty, poptávající osoby či dodavatele Poskytovatele za účelem uzavření obchodu mimo Poskytovatele.</li>
                    </ul>
                    <p>
                      <strong>4.2 Omezení okruhu osob:</strong> Příjemce je oprávněn zpřístupnit Chráněné informace pouze těm svým statutárním orgánům, zaměstnancům a odborným poradcům, kteří tyto informace nezbytně nutně potřebují k výkonu Vzájemné spolupráce (princip <em>need-to-know</em>). Příjemce je povinen tyto osoby předem prokazatelně a písemně zavázat mlčenlivostí ve stejném rozsahu jako dle této Dohody, přičemž za jakékoliv porušení těmito osobami odpovídá Příjemce tak, jako by se porušení dopustil sám.
                    </p>
                    <p>
                      <strong>4.3 Technická a bezpečnostní ochrana:</strong> Příjemce se zavazuje zabezpečit veškerá technická zařízení (počítače, mobilní telefony, tablety), ze kterých přistupuje k softwaru a systémům Poskytovatele, silnými přístupovými hesly a dvoufaktorovým ověřením (2FA). Příjemce nesmí sdělit své přístupové údaje žádné další osobě a nesmí ukládat Chráněné informace na veřejná či nezabezpečená cloudová úložiště.
                    </p>
                    <p>
                      <strong>4.4 Oznamovací povinnost:</strong> V případě zjištění jakéhokoliv neoprávněného přístupu, úniku, ztráty či vyzrazení Chráněných informací je Příjemce povinen neprodleně (nejpozději do 24 hodin) písemně informovat Poskytovatele a poskytnout mu veškerou součinnost k nápravě.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      V. Výjimky ze závazku mlčenlivosti
                    </h3>
                    <p>
                      <strong>5.1</strong> Povinnost mlčenlivosti dle této Dohody se nevztahuje na informace, které:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                      <li>Byly v době jejich zpřístupnění prokazatelně veřejně známé, nebo se staly veřejně známými po jejich zpřístupnění jinak než v důsledku porušení této Dohody či právních předpisů ze strany Příjemce;</li>
                      <li>Měl Příjemce prokazatelně k dispozici již před jejich poskytnutím Poskytovatelem;</li>
                      <li>Byly uvolněny ze závazku mlčenlivosti na základě předchozího písemného souhlasu Poskytovatele;</li>
                      <li>Je Příjemce povinen zpřístupnit na základě kogentních právních předpisů, pravomocného rozhodnutí soudu, policejního orgánu nebo jiného věcně příslušného orgánu veřejné moci (s povinností předem písemně informovat Poskytovatele a minimalizovat rozsah sdělovaných dat).</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VI. Duševní vlastnictví a nakládání s podklady
                    </h3>
                    <p>
                      <strong>6.1</strong> Veškerá práva k Chráněným informacím, obchodnímu tajemství, patentům, užitným vzorům, ochranným známkám, autorským dílům, konstrukčním řešením, know-how, databázím a softwarovým nástrojům zůstávají výlučným a neomezeným majetkem Poskytovatele. Poskytnutí Chráněných informací nezakládá žádné licenční oprávnění ani převod vlastnických práv.
                    </p>
                    <p>
                      <strong>6.2 Vrácení a skartace podkladů:</strong> Příjemce je povinen na písemnou výzvu Poskytovatele nebo nejpozději do 5 (pěti) pracovních dnů od ukončení Vzájemné spolupráce vrátit Poskytovateli veškeré hmotné materiály, nosiče dat, výkresy, vzorky a dokumenty obsahující Chráněné informace a veškeré digitální kopie a záznamy trvale a nevratně vymazat/skartovat ze všech svých zařízení.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VII. Smluvní pokuta a odpovědnost za škodu
                    </h3>
                    <p>
                      <strong>7.1</strong> Poruší-li Příjemce jakoukoliv povinnost stanovenou v této Dohodě (zejména poruší-li povinnost mlčenlivosti, zpřístupní-li Chráněné informace třetí osobě, zneužije-li Chráněné informace pro vlastní prospěch či prospěch třetích osob, poruší-li zákaz obcházení/konkurence nebo nesplní-li povinnost vrácení podkladů), je Příjemce povinen zaplatit Poskytovateli <strong>smluvní pokutu ve výši 100.000 Kč (slovy: jedno sto tisíc korun českých)</strong> za každý jednotlivý případ porušení. V případě trvajícího porušení se sjednává smluvní pokuta ve výši <strong>5.000 Kč</strong> za každý započatý den trvání porušení.
                    </p>
                    <p>
                      <strong>7.2</strong> Smluvní pokuta je splatná do 14 (čtrnácti) kalendářních dnů ode dne doručení písemné výzvy k její úhradě Příjemci.
                    </p>
                    <p>
                      <strong>7.3 Náhrada škody:</strong> Ujednáním o smluvní pokutě ani jejím zaplacením není nijak dotčeno ani omezeno právo Poskytovatele na náhradu způsobené škody, jiné majetkové i nemajetkové újmy a ušlého zisku v plné výši. Smluvní strany výslovně <strong>vylučují aplikaci ustanovení § 2050 občanského zákoníku</strong> a sjednávají, že náhrada škody je vymahatelná v plném rozsahu vedle smluvní pokuty.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      VIII. Doba trvání a účinnost dohody
                    </h3>
                    <p>
                      <strong>8.1</strong> Tato Dohoda nabývá platnosti a účinnosti dnem jejího podpisu oběma Smluvními stranami a uzavírá se na <strong>dobu neurčitou</strong>.
                    </p>
                    <p>
                      <strong>8.2</strong> Závazek k ochraně Chráněných informací a zachování mlčenlivosti trvá po celou dobu trvání jednání i samotné Vzájemné spolupráce Smluvních stran a dále po dobu <strong>5 (pěti) let</strong> od faktického ukončení veškeré Vzájemné spolupráce; v případě informací tvořících obchodní tajemství ve smyslu § 504 občanského zákoníku a know-how Poskytovatele trvá závazek mlčenlivosti po celou dobu existence tohoto obchodního tajemství bez časového omezení.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-black uppercase text-[11px] tracking-wider text-[#183d89]">
                      IX. Závěrečná ustanovení
                    </h3>
                    <p>
                      <strong>9.1</strong> Právní vztahy založené touto Dohodou se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Případné spory budou rozhodovány věcně a místně příslušnými obecnými soudy České republiky podle sídla Poskytovatele.
                    </p>
                    <p>
                      <strong>9.2</strong> Veškeré změny a doplňky této Dohody vyžadují písemnou formu vzestupně číslovaných dodatků podepsaných oběma Smluvními stranami. Neplatnost některého ustanovení se nedotýká platnosti ostatních ustanovení (salvátorská klauzule).
                    </p>
                    <p>
                      <strong>9.3</strong> Tato Dohoda je vyhotovena ve dvou stejnopisech s platností originálu (po jednom pro každou stranu), popřípadě v jednom elektronickém vyhotovení opatřeném elektronickými podpisy obou Smluvních stran.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Document Signature Bottom preview */}
            <div className="pt-6 border-t border-black/10 space-y-4">
              <p className="text-[11px] font-bold text-black/80">
                {locale === 'en'
                  ? 'In witness of their free, serious, and unambiguous intent, the Parties hereto attach their signatures:'
                  : 'Na důkaz svobodného, vážného a srozumitelného projevu vůle připojují Smluvní strany své podpisy:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-black/15 shadow-2xs">
                  <span className="text-[10px] text-black/50 font-semibold block uppercase">
                    {locale === 'en' ? 'For Treetino corp s.r.o. (Disclosing Party)' : 'Za Treetino corp s.r.o. (Poskytovatel)'}
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
                  <div className="text-[10px] text-black/60 pt-1">
                    <strong>Dominik Mašek</strong><br />
                    {locale === 'en' ? 'Managing Director (CEO), Treetino corp s.r.o.' : 'Jednatel, Treetino corp s.r.o.'}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-black/15 shadow-2xs">
                  <span className="text-[10px] text-black/50 font-semibold block uppercase">
                    {locale === 'en' ? 'For Receiving Party (Commercial Partner)' : 'Za Příjemce (Obchodního partnera)'}
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
                  <div className="text-[10px] text-black/60 pt-1">
                    <strong>{representative || company || '—'}</strong><br />
                    {locale === 'en' ? 'Authorized Representative' : 'Oprávněný zástupce'}
                  </div>
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
