#!/usr/bin/env python3
"""
Treetino Investment Memorandum (IM) 2026 - Master High-Fidelity PDF & Screenshot Generator
Identical 1:1 match with Treetino Production Codebase (Vue 3 / Tailwind CSS / Brand Tokens)

Key Verification Anchors Built-in:
1. Anchor 1: €705k binding conditional purchase agreement with MKovo s.r.o. for 3x V1 trees (delivery Q1 2027)
2. Anchor 2: Prague High School active V2 site under construction (active anemometer mast, 130 TopCon leaves stored)
3. Anchor 3: €10,000,000 bond auction raise commitment from Tomes & Partners (2027 execution)
4. Full Confidential Data Room Index with all 10 NDA documents cataloged on final page
"""

import os
import subprocess
import shutil

ROOT_DIR = "/Users/jakub/Projects/treetino-website-dev"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
SCRATCH_DIR = os.path.join(ROOT_DIR, "scratch")
SCREENSHOT_DIR = os.path.join(SCRATCH_DIR, "im_screens")
OUTPUT_HTML = os.path.join(SCRATCH_DIR, "investment_memorandum.html")
OUTPUT_PDF = os.path.join(PUBLIC_DIR, "Treetino_Investment_Memorandum_2026.pdf")
DOCS_PDF = os.path.join(PUBLIC_DIR, "docs", "Treetino_Investment_Memorandum_2026.pdf")
COMPILED_CSS = os.path.join(PUBLIC_DIR, "build", "assets", "app-mmapFZmm.css")
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(SCRATCH_DIR, exist_ok=True)
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "docs"), exist_ok=True)

def img_uri(rel_path):
    abs_p = os.path.join(PUBLIC_DIR, rel_path)
    return f"file://{abs_p}"

# Official Treetino SVG Logo from LogoType.vue
def get_logotype_svg(dark=False):
    fill = "#ffffff" if dark else "#000000"
    return f"""<svg style="height: 22px; width: auto; display: block;" viewBox="0 0 400 75.82" fill="{fill}" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.78,66.53c.06.03.12.05.19.05h0,0s-.09,0-.19-.05ZM25.97,66.58l-.19-.05c1.63.87,3.6.82,5.18-.13,1.58-.95,2.55-2.66,2.55-4.51v-5.02c0-1.36-.73-2.62-1.9-3.29l-6.55-3.78c-1.99-1.15-3.45-3.05-4.04-5.27-.59-2.22-.29-4.58.86-6.57l11.01,6.35c.13.07.29.07.42,0,.13-.07.21-.21.21-.37v-23.79h8.67v12.16c0,.15.08.29.21.37.13.07.29.07.42,0l10.53-6.08c1.14,1.99,1.45,4.36.86,6.57-.6,2.22-2.05,4.12-4.05,5.27l-6.08,3.51c-1.18.68-1.9,1.94-1.9,3.29v16.65c0,4.89-2.57,9.42-6.76,11.94-4.19,2.52-9.4,2.65-13.71.36h0c-8.08-4.3-16.06-10.37-18.38-14.39-2.06-3.57-3.33-11.73-3.33-19.93s1.27-16.36,3.33-19.93c2.06-3.57,8.49-8.75,15.6-12.85C26.03,2.98,33.73,0,37.85,0s12.01,3.26,19.2,7.52c7.19,4.26,13.61,9.46,15.32,12.41,1.7,2.95,2.85,11.42,2.85,19.93s-1.15,16.98-2.85,19.93c-.78,1.36-2.46,3.17-4.82,5.08-4.38,3.54-11.35,7.81-17.47,10.81l-.05-.11c-2.03-4.19-.52-9.23,3.48-11.62,2.45-1.46,4.8-2.99,6.79-4.45,2.18-1.6,3.94-2.97,4.57-4.05.43-.74.67-2.07.93-3.71.52-3.29.77-7.59.77-11.88s-.25-8.6-.77-11.89c-.26-1.64-.5-2.97-.93-3.71-.54-.94-1.73-2.1-3.33-3.37-2.34-1.85-5.56-3.94-8.9-5.91-5.61-3.32-11.58-6.31-14.79-6.31s-9.06,2.73-14.59,5.92c-5.53,3.19-10.82,6.9-12.42,9.68s-2.17,9.21-2.17,15.6.56,12.82,2.17,15.6c1.85,3.21,8.5,7.65,14.94,11.07l.19.05Z"/>
        <path d="M391.87,49.66v-12.82c0-1.95-1.1-2.89-3.29-2.89h-20.51c-2.15,0-3.24.95-3.24,2.89v12.82c0,1.9,1.1,2.89,3.24,2.89h20.51c2.2,0,3.29-1,3.29-2.89ZM400,36.83v12.82c0,6.44-5.09,11.03-11.43,11.03h-20.51c-6.29,0-11.38-4.54-11.38-11.03v-12.82c0-6.44,5.09-11.08,11.38-11.08h20.51c6.34,0,11.43,4.59,11.43,11.08ZM352.85,25.75v26.95c0,4.39-3.59,7.98-7.98,7.98h-.15l-21.01-23.5v15.52c0,4.39-3.59,8.03-7.98,8.03h-.15v-26.95c0-4.39,3.59-8.03,7.98-8.03h.15l21.01,23.4v-15.37c0-4.39,3.59-8.03,7.98-8.03h.15ZM311.73,33.79v26.95h-.15c-4.39,0-7.98-3.64-7.98-8.03v-26.95h.15c4.39,0,7.98,3.64,7.98,8.03ZM276.4,60.68v-26.75h-15.72c0-4.59,3.54-8.18,7.99-8.18h31.69c0,4.64-3.59,8.18-8.03,8.18h-7.73v18.76c0,4.44-3.59,7.98-8.18,7.98ZM231.11,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.98-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM221.58,33.94v-.15c0-4.39,3.59-8.03,7.98-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM188.84,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.99-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM179.31,33.94v-.15c0-4.39,3.59-8.03,7.99-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM92.69,25.75h31.69c4.44,0,7.98,3.59,7.98,8.18h-15.72v18.76c0,4.44-3.59,7.98-8.18,7.98v-26.75h-7.73c-4.44,0-8.03-3.54-8.03-8.18ZM139.15,41.22h25.15c4.79,0,4.79-7.29,0-7.29h-22.7c-2.94,0-5.49-1.45-6.94-3.99l-2.3-4.19h31.94c6.49,0,11.78,5.34,11.78,11.83s-5.29,11.78-11.78,11.78h-.82l6.59,11.38h-9.43l-6.58-11.38h-6.72v11.38c-4.59,0-8.18-2.52-8.18-5.67v-5.7h0v-8.13Z"/>
    </svg>"""

# Floating Header Component identical to Header.vue & user screenshots
def website_navbar(dark=False, doc_tag="INVESTMENT MEMORANDUM"):
    if dark:
        wrap_style = "border: 1px solid rgba(255,255,255,0.18); background: rgba(22,22,25,0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); border-radius: 16px; padding: 8px 20px;"
        nav_style = "color: rgba(255,255,255,0.85);"
        lang_style = "border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #ffffff;"
        memo_badge = "border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #38bdf8;"
    else:
        wrap_style = "border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.94); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-radius: 16px; padding: 8px 20px;"
        nav_style = "color: rgba(9,9,11,0.8);"
        lang_style = "border: 1px solid rgba(0,0,0,0.12); background: rgba(0,0,0,0.03); color: #09090b;"
        memo_badge = "border: 1px solid rgba(24,61,137,0.2); background: rgba(24,61,137,0.08); color: rgb(24,61,137);"

    globe_svg = """<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>"""

    return f"""
    <div style="width: 100%; margin-bottom: 12px; position: relative; z-index: 50;">
        <div style="display: flex; width: 100%; align-items: center; justify-content: space-between; {wrap_style}">
            <div style="display: flex; align-items: center; gap: 12px;">
                {get_logotype_svg(dark=dark)}
            </div>

            <div style="display: flex; align-items: center; gap: 24px; font-size: 8.5pt; font-weight: 500; {nav_style}">
                <span>Products</span>
                <span>Collaboration</span>
                <span>Sales Partners</span>
                <span>Media</span>
                <span>Contact</span>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="border-radius: 9999px; padding: 3px 10px; font-family: 'JetBrains Mono', monospace; font-size: 7pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; {memo_badge}">
                    {doc_tag}
                </span>
                <div style="display: inline-flex; align-items: center; gap: 5px; border-radius: 9999px; padding: 4px 10px; font-size: 7.5pt; font-weight: 600; {lang_style}">
                    {globe_svg}
                    <span>EN</span>
                </div>
                <div style="background-color: rgb(24,61,137); color: #ffffff; padding: 5px 16px; border-radius: 9999px; font-size: 8pt; font-weight: 600; box-shadow: 0 2px 8px rgba(24,61,137,0.3);">
                    Preorder
                </div>
            </div>
        </div>
    </div>
    """

def website_footer(page_num, total_pages=14, dark=False):
    border_color = "rgba(255,255,255,0.12)" if dark else "rgba(0,0,0,0.1)"
    text_color = "rgba(255,255,255,0.55)" if dark else "rgba(9,9,11,0.55)"
    return f"""
    <div style="margin-top: auto; display: flex; width: 100%; align-items: center; justify-content: space-between; border-top: 1px solid {border_color}; padding-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: {text_color};">
        <div>Treetino corp s.r.o. &bull; Registered in Prague, Czech Republic &bull; www.treetino.eu</div>
        <div>Confidential Series A Diligence Dossier</div>
        <div>Page {page_num:02d} / {total_pages:02d}</div>
    </div>
    """

GLOBAL_CSS = """
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@page {
  size: 297mm 210mm;
  margin: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page-container {
  width: 297mm;
  height: 210mm;
  max-height: 210mm;
  min-height: 210mm;
  page-break-after: always;
  page-break-inside: avoid;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.page-dark {
  background-color: #09090b;
  color: #ffffff;
  padding: 7mm 12mm 6mm 12mm;
  display: flex;
  flex-direction: column;
}

.page-light {
  background-color: #ffffff;
  color: #09090b;
  padding: 7mm 12mm 6mm 12mm;
  display: flex;
  flex-direction: column;
}

.text-t-blue {
  color: rgb(24, 61, 137) !important;
}
.bg-t-blue {
  background-color: rgb(24, 61, 137) !important;
}
.border-t-blue {
  border-color: rgb(24, 61, 137) !important;
}

/* Exact section tags and headings from Treetino website */
.web-tag {
  font-size: 8pt;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(24, 61, 137);
  display: inline-block;
  margin-bottom: 2px;
}

.web-h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 23pt;
  font-weight: 600;
  line-height: 1.15;
  color: #09090b;
  letter-spacing: -0.02em;
}

.web-lead {
  font-size: 8.8pt;
  color: rgba(9, 9, 11, 0.7);
  line-height: 1.45;
  margin-top: 3px;
}
"""

def build_pages():
    pages = []

    # =========================================================================
    # PAGE 1: HERO COVER (EXACT MATCH TO HomeHero / Screenshot 2)
    # =========================================================================
    pages.append(f"""<div class="page-container page-dark" id="page-1" style="background-color: #050507;">
        <div style="position: absolute; inset: 0; pointer-events: none; z-index: 1;">
            <img src="{img_uri('img/hero-v1-cinematic.png')}" style="position: absolute; right: 0; top: 0; height: 100%; width: 72%; object-fit: cover; object-position: 55% 45%;" alt="Treetino V1 Hero" />
            <div style="position: absolute; inset: 0; background: linear-gradient(90deg, #050507 42%, rgba(5,5,7,0.85) 60%, rgba(5,5,7,0.2) 80%, transparent 100%);"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 160px; background: linear-gradient(to top, #050507, transparent);"></div>
        </div>

        <div style="position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
            {website_navbar(dark=True, doc_tag="INVESTMENT MEMORANDUM")}

            <div style="margin-top: auto; margin-bottom: 18px; max-width: 650px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.22); background: rgba(0,0,0,0.55); padding: 4px 14px; backdrop-filter: blur(12px); margin-bottom: 12px;">
                    <span style="height: 6px; width: 6px; border-radius: 9999px; background-color: #10b981;"></span>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.15em; color: #fff; text-transform: uppercase;">SERIES A & STRATEGIC GROWTH CAPITAL</span>
                </div>

                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 56pt; font-weight: 500; line-height: 1.0; letter-spacing: -0.03em; color: #ffffff; margin-bottom: 2px;">
                    Treetino v1
                </h1>

                <div style="font-size: 13pt; letter-spacing: 10px; text-transform: uppercase; color: rgba(255,255,255,0.7); font-weight: 400; margin-bottom: 14px;">
                    FOR COMPANIES AND CITIES
                </div>

                <p style="font-size: 9.8pt; color: rgba(255,255,255,0.82); line-height: 1.48; max-width: 580px;">
                    Delivering <strong style="color: #fff;">45 kW Peak Renewable Yield</strong> on an ultra-compact <strong style="color: #fff;">1.2 m² ground footprint</strong> through patented ducted wind turbines and heliotropic AI solar foliage.
                </p>

                <!-- Website-style Arrow Navigation Controls + 3 Key Anchors -->
                <div style="display: flex; align-items: center; gap: 14px; margin-top: 20px;">
                    <div style="display: flex; gap: 6px;">
                        <div style="display: flex; height: 38px; width: 42px; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.1); font-size: 10pt; color: white;">&lang;&lang;</div>
                        <div style="display: flex; height: 38px; width: 42px; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.1); font-size: 10pt; color: white;">&rang;&rang;</div>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <div style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.55); padding: 7px 14px; backdrop-filter: blur(10px);">
                            <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #38bdf8; font-weight: 700;">ANCHOR 1 &bull; COMMERCIAL</div>
                            <div style="font-size: 10pt; font-weight: 700; color: #fff;">€705k Contract</div>
                        </div>
                        <div style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.55); padding: 7px 14px; backdrop-filter: blur(10px);">
                            <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #34d399; font-weight: 700;">ANCHOR 2 &bull; DEPLOYMENT</div>
                            <div style="font-size: 10pt; font-weight: 700; color: #fff;">Prague V2 Site</div>
                        </div>
                        <div style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.55); padding: 7px 14px; backdrop-filter: blur(10px);">
                            <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #fbbf24; font-weight: 700;">ANCHOR 3 &bull; CAPITAL</div>
                            <div style="font-size: 10pt; font-weight: 700; color: #fff;">€10M Bond Raise</div>
                        </div>
                    </div>
                </div>
            </div>

            {website_footer(1, dark=True)}
        </div>
    </div>""")

    # =========================================================================
    # PAGE 2: EXECUTIVE SUMMARY & 3 ANCHOR PILLARS (Clean Light Theme)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-2">
        {website_navbar(dark=False, doc_tag="01 / EXECUTIVE SUMMARY")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">INVESTMENT THESIS & CORE TRACTION</span>
                <h2 class="web-h1">Executive Summary: De-risked Infrastructure Scale-Up</h2>
                <p class="web-lead">Treetino eliminates urban land bottlenecks by replacing 300 m² of horizontal rooftop solar with an iconic 12m vertical micro-power plant delivering 45 kW peak renewable yield on a 1.2 m² ground base.</p>
            </div>

            <!-- The 3 Anchors (Website Card Style: border-l-4 border-t-blue bg-stone-50) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px;">
                <div style="border-left: 4px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 12px 12px 0; border-top: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">ANCHOR 1 &bull; COMMERCIAL SALES</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 600; background: rgba(24,61,137,0.1); color: rgb(24,61,137); padding: 2px 7px; border-radius: 9999px;">Q1 2027 DELIVERY</span>
                    </div>
                    <div style="font-size: 15pt; font-weight: 700; color: #09090b; margin-top: 4px;">€705,000 Contract</div>
                    <div style="font-size: 8.5pt; font-weight: 600; color: #52525b; margin-top: 2px;">Binding Agreement for 3x V1 Trees</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Signed binding conditional purchase agreement with industrial group <strong>MKovo s.r.o.</strong> (€235k/unit). The client faces extreme grid connection limits and has maxed out all available roof space. Delivery scheduled for early 2027.
                    </p>
                    <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); font-family: 'JetBrains Mono'; font-size: 7.2pt; color: rgb(24,61,137);">
                        &bull; Due Diligence File: <code style="color: #09090b;">MOU - M - kovo.pdf</code>
                    </div>
                </div>

                <div style="border-left: 4px solid #10b981; background: #fafaf9; border-radius: 0 12px 12px 0; border-top: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; color: #10b981; text-transform: uppercase;">ANCHOR 2 &bull; DEPLOYMENT & TOOLING</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 600; background: rgba(16,185,129,0.12); color: #047857; padding: 2px 7px; border-radius: 9999px;">ACTIVE FIELD SITE</span>
                    </div>
                    <div style="font-size: 15pt; font-weight: 700; color: #09090b; margin-top: 4px;">Prague V2 Site Active</div>
                    <div style="font-size: 8.5pt; font-weight: 600; color: #52525b; margin-top: 2px;">High School Construction & 3D Tooling</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Foundation and site work underway at a premier Prague high school; meteorological anemometer station actively logging wind telemetry. Structural components are being fabricated in-house on our new massive industrial 3D printer.
                    </p>
                    <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #047857;">
                        &bull; 130 TopCon PV leaves ready (<code style="color: #09090b;">NAB240147.pdf</code>)
                    </div>
                </div>

                <div style="border-left: 4px solid #f59e0b; background: #fafaf9; border-radius: 0 12px 12px 0; border-top: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; color: #d97706; text-transform: uppercase;">ANCHOR 3 &bull; INSTITUTIONAL CAPITAL</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 600; background: rgba(245,158,11,0.12); color: #b45309; padding: 2px 7px; border-radius: 9999px;">2027 EXECUTION</span>
                    </div>
                    <div style="font-size: 15pt; font-weight: 700; color: #09090b; margin-top: 4px;">€10.0M Bond Offer</div>
                    <div style="font-size: 8.5pt; font-weight: 600; color: #52525b; margin-top: 2px;">Binding Offer from Tomes & Partners</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Formal advisory and capital commitment letter from financial group Tomes & Partners to underwrite a €10,000,000 EUR bond auction raise in 2027 to finance large-scale factory series manufacturing lines and working capital.
                    </p>
                    <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #d97706;">
                        &bull; Due Diligence File: <code style="color: #09090b;">Treetino_nabidka.pdf</code>
                    </div>
                </div>
            </div>

            <!-- Lower Section: Blended Finance Architecture & Harmonized Key Metrics -->
            <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 14px; margin-top: 10px;">
                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">FINANCIAL & GRANT ARCHITECTURE</span>
                    <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Blended Financing & Leverage Strategy</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
                        <div style="background: #fafaf9; border-radius: 8px; padding: 10px 12px; border: 1px solid rgba(0,0,0,0.05);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a;">CZECHINVEST GRANT (CLOSED)</div>
                            <div style="font-size: 12pt; font-weight: 700; color: #047857; margin-top: 2px;">€200,000 (5M CZK)</div>
                            <div style="font-size: 7.3pt; color: #71717a; margin-top: 3px; line-height: 1.35;">Completed & audited. Supported proof-of-concept R&D, CAD modeling and initial aerodynamic validation. Zero equity dilution.</div>
                        </div>
                        <div style="background: #fafaf9; border-radius: 8px; padding: 10px 12px; border: 1px solid rgba(0,0,0,0.05);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a;">EIC BLENDED FINANCE (IN PROCESS)</div>
                            <div style="font-size: 12pt; font-weight: 700; color: rgb(24,61,137); margin-top: 2px;">€2,500,000 Total</div>
                            <div style="font-size: 7.3pt; color: #71717a; margin-top: 3px; line-height: 1.35;">€1.5M non-dilutive grant (70% EU co-funding for ISO 61400 turbine cert & CE marking) + €1.0M direct equity co-investment.</div>
                        </div>
                    </div>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">HARMONIZED KEY METRICS</span>
                        <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 5px;">
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 3px;">
                                <span style="color: #71717a;">Combined Rated Peak Output</span>
                                <strong style="color: #09090b;">45.0 kW (35 kW Wind + 10 kW PV)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 3px;">
                                <span style="color: #71717a;">Ground Base Footprint</span>
                                <strong style="color: rgb(24,61,137);">1.2 m² (vs 300 m² Rooftop Solar)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 3px;">
                                <span style="color: #71717a;">TRL 5 Physical Generation</span>
                                <strong style="color: #047857;">24,180 kWh (180 Continuous Days)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 3px;">
                                <span style="color: #71717a;">AI Heliotropic Tracking Gain</span>
                                <strong style="color: #09090b;">+28.4% Net Energy Increase</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 3px;">
                                <span style="color: #71717a;">Acoustic Noise Footprint</span>
                                <strong style="color: rgb(24,61,137);">&lt; 34.2 dB(A) @ 10 m (Permit-Free)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 7.8pt;">
                                <span style="color: #71717a;">Unsubsidized Simple Payback</span>
                                <strong style="color: #047857;">~12.8 Years (7.7 Years w/ 40% Grant)</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {website_footer(2, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 3: THE URBAN RENEWABLE PARADOX & THE TREETINO BREAKTHROUGH
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-3">
        {website_navbar(dark=False, doc_tag="02 / THE MARKET PROBLEM")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">STRUCTURAL CONSTRAINTS IN URBAN DECARBONIZATION</span>
                <h2 class="web-h1">The Urban Renewable Paradox: Why Existing Clean Tech Fails</h2>
                <p class="web-lead">European commercial facilities face severe land scarcity, strict aesthetic regulations, and overwhelmed utility grid infrastructure preventing clean energy adoption.</p>
            </div>

            <!-- 3 Structural Market Limits (Website Clean Card Style) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px;">
                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="background: rgba(239,68,68,0.1); color: #dc2626; font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">LIMIT 1</span>
                        <h3 style="font-size: 11pt; font-weight: 700; color: #09090b;">Rooftop Solar Limits</h3>
                    </div>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45;">
                        Requires <strong>~300 m² of horizontal rooftop</strong> for 45 kW peak. Industrial roofs are obstructed by HVAC, smoke vents, skylights, and low load-bearing limits. Capacity factors capped at 12–15% due to zero night generation and severe seasonal winter drops.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="background: rgba(239,68,68,0.1); color: #dc2626; font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">LIMIT 2</span>
                        <h3 style="font-size: 11pt; font-weight: 700; color: #09090b;">Conventional Wind Prohibited</h3>
                    </div>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45;">
                        Standard wind turbines generate low-frequency noise (&gt;45 dB) and strobe shadow flicker. Strict European urban permitting bans conventional turbines near offices, schools, and homes. Horizontal turbines stall in turbulent, omnidirectional urban micro-climates.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="background: rgba(239,68,68,0.1); color: #dc2626; font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">LIMIT 3</span>
                        <h3 style="font-size: 11pt; font-weight: 700; color: #09090b;">Substation Gridlock</h3>
                    </div>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45;">
                        Industrial plants needing +200 kW face <strong>2 to 4-year grid expansion queues</strong>. Substation capacity upgrades cost <strong>4x more than localized micro-generation</strong>. Leaves commercial facilities fully exposed to volatile peak demand charges and blackout risks.
                    </p>
                </div>
            </div>

            <!-- Comparison Block: Centralized Vulnerability vs Treetino Vertical Microgrid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px;">
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; padding: 14px 18px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; color: #dc2626; text-transform: uppercase;">THE MACROGRID ILLUSION</span>
                    <h3 style="font-size: 12pt; font-weight: 700; color: #09090b; margin-top: 2px;">Centralized Transmission Fragility</h3>
                    <p style="font-size: 8pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                        Remote wind and solar farms suffer 8–15% transmission losses, multi-billion interconnect bottlenecks, and acute vulnerability to geopolitical disruption.
                    </p>
                    <div style="margin-top: 10px; border-radius: 10px; overflow: hidden; height: 130px; background: #000; position: relative;">
                        <img src="{img_uri('img/info/info-turbine-w.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Distributed VAWT Bypass" />
                    </div>
                </div>

                <div style="border: 1px solid rgba(24,61,137,0.3); border-radius: 14px; padding: 14px 18px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">THE TREETINO ALTERNATIVE</span>
                    <h3 style="font-size: 12pt; font-weight: 700; color: #09090b; margin-top: 2px;">Hyper-Dense Decentralized Urban Microgrids</h3>
                    <p style="font-size: 8pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                        A distributed mesh of self-optimizing micro-generation nodes deployed directly at points of consumption, combining wind and solar behind the meter 24/7.
                    </p>
                    <div style="margin-top: 10px; border-radius: 10px; overflow: hidden; height: 130px; background: #000; position: relative;">
                        <img src="{img_uri('img/info/info-strom-v2-w.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Microgrid Node" />
                    </div>
                </div>
            </div>
        </div>

        {website_footer(3, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 4: CZECH R&D & HIGH-TECH PRODUCTION (EXACT MATCH TO Screenshot 4 / V1.vue)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-4">
        {website_navbar(dark=False, doc_tag="03 / CORE ARCHITECTURE")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <!-- Exact Centered Heading from V1.vue / Screenshot 4 -->
            <div style="text-align: center; margin-top: 2px;">
                <span class="web-tag">TOP EUROPEAN TECHNOLOGY COLLABORATION</span>
                <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26pt; font-weight: 600; color: #09090b; margin-top: 2px; letter-spacing: -0.02em;">Czech R&D & High–Tech Production</h2>
            </div>

            <!-- Exact 4 Columns from V1.vue lines 170-252 -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 14px;">
                <div style="padding-left: 4px;">
                    <div style="font-size: 20pt; font-weight: 700; color: #09090b; letter-spacing: -0.02em;">FZU & ČVUT</div>
                    <div style="font-size: 9.5pt; font-weight: 600; color: #18181b; margin-top: 4px;">R&D</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 4px;">Developed in collaboration with top Czech universities. Manufacturing & assembly in CZ.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 18px;">
                    <div style="font-size: 20pt; font-weight: 700; color: #09090b; letter-spacing: -0.02em;">Up to 90%</div>
                    <div style="font-size: 9.5pt; font-weight: 600; color: #18181b; margin-top: 4px;">Grants & Support</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 4px;">Treetino V1 qualifies for national and EU subsidy programs up to 90%.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 18px;">
                    <div style="font-size: 20pt; font-weight: 700; color: #09090b; letter-spacing: -0.02em;">2 months</div>
                    <div style="font-size: 9.5pt; font-weight: 600; color: #18181b; margin-top: 4px;">Construction Speed</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 4px;">Express installation from site handover to full operation in 2 months.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 18px;">
                    <div style="font-size: 20pt; font-weight: 700; color: #09090b; letter-spacing: -0.02em;">15 years</div>
                    <div style="font-size: 9.5pt; font-weight: 600; color: #18181b; margin-top: 4px;">Skeleton Warranty</div>
                    <p style="font-size: 7.8pt; color: #71717a; line-height: 1.45; margin-top: 4px;">Robust steel construction with 15–year warranty and 25-year PV output guarantee (85%).</p>
                </div>
            </div>

            <!-- Exact Feature Showcase 1 Card from V1.vue lines 256-298 -->
            <div style="position: relative; height: 250px; border-radius: 20px; overflow: hidden; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid rgba(0,0,0,0.1); margin-top: 14px;">
                <img src="{img_uri('img/stills/Still_Strom-v1.png')}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 60%;" alt="Strom V1 Feature Showcase" />
                <div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.1) 75%, transparent 100%);"></div>

                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 24px 32px; max-width: 580px; z-index: 10;">
                    <span style="display: inline-block; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 7pt; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; width: fit-content;">
                        HYBRID GENERATION 49.8 KW
                    </span>
                    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22pt; font-weight: 600; color: #ffffff; margin-top: 8px; line-height: 1.15;">
                        Combined Solar & Wind Power
                    </h3>
                    <p style="font-size: 8.5pt; color: rgba(255,255,255,0.85); line-height: 1.45; margin-top: 6px;">
                        Tree V1 combines 13.8 kWp photovoltaics (300 TopCon leaves) and 36 kW wind turbines (12× ducted VAWTs). Delivers stable energy production 24/7 with zero acoustic footprint (&lt;34.2 dB at 10m).
                    </p>
                    <div style="display: flex; gap: 8px; margin-top: 14px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; color: #ffffff; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 6px;">12m Height</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; color: #38bdf8; background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3); padding: 3px 8px; border-radius: 6px;">1.2 m² Ground Base</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; color: #34d399; background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.3); padding: 3px 8px; border-radius: 6px;">350–450 kWh / Day</span>
                    </div>
                </div>
            </div>
        </div>

        {website_footer(4, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 5: SIGNATURE V2 DESIGN ELEMENT & AI INTELLIGENCE (EXACT MATCH TO Screenshot 5)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-5" style="background-color: #fafaf9;">
        {website_navbar(dark=False, doc_tag="04 / AI & CONNECTIVITY")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <!-- Exact Feature Showcase 2 Section from V1.vue lines 308-380 & Screenshot 5 -->
            <div style="display: grid; grid-template-columns: 1fr 1.15fr; gap: 36px; align-items: center; margin-top: 10px;">
                <!-- Left: Signature Design Element with border-t-4 border-l-4 border-t-t-blue border-l-t-blue -->
                <div style="position: relative; overflow: hidden; border-top: 4px solid rgb(24,61,137); border-left: 4px solid rgb(24,61,137); background: #000; box-shadow: 0 16px 36px rgba(0,0,0,0.15); border-radius: 4px;">
                    <div style="position: relative; height: 350px; overflow: hidden;">
                        <img src="{img_uri('img/info/night-detail-w.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Signature Night Detail" />
                        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);"></div>
                        <!-- Massive Typography Overlay: HYBRID 24/7 -->
                        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 24px 28px;">
                            <span style="font-size: 44pt; font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; color: #ffffff; text-transform: uppercase;">
                                HYBRID
                            </span>
                            <span style="font-size: 44pt; font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; color: #ffffff; text-transform: uppercase; margin-top: 4px;">
                                24/7
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Right: Editorial Narrative & Blue-Bordered Callout Cards -->
                <div>
                    <span class="web-tag">TREEAPP & AI INTELLIGENCE</span>
                    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 25pt; font-weight: 600; color: #09090b; margin-top: 4px; line-height: 1.15; letter-spacing: -0.02em;">
                        AI Optimization & Remote Connectivity
                    </h2>
                    <p style="font-size: 9pt; color: rgba(9,9,11,0.75); line-height: 1.5; margin-top: 10px;">
                        Using TreeApp and German servomotors, branches automatically tilt towards the sun for +28.4% tracking efficiency. System predicts weather and activates storm protection mode during gales.
                    </p>

                    <!-- Exact 2 Info Cards from V1.vue with border-l-2 border-t-blue -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px;">
                        <div style="border-left: 3px solid rgb(24,61,137); background: #ffffff; padding: 12px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); border-radius: 0 8px 8px 0;">
                            <div style="font-size: 11pt; font-weight: 700; color: rgb(24,61,137);">TreeApp</div>
                            <div style="font-size: 7.8pt; color: #71717a; margin-top: 3px; line-height: 1.35;">Production tracking, leaf cleaning mode & dynamic light show</div>
                        </div>

                        <div style="border-left: 3px solid rgb(24,61,137); background: #ffffff; padding: 12px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); border-radius: 0 8px 8px 0;">
                            <div style="font-size: 11pt; font-weight: 700; color: rgb(24,61,137);">EV Wallbox</div>
                            <div style="font-size: 7.8pt; color: #71717a; margin-top: 3px; line-height: 1.35;">Integrated fast EV & e-bike charging from surplus clean energy</div>
                        </div>
                    </div>

                    <div style="margin-top: 18px; padding: 10px 14px; border-radius: 8px; background: rgba(24,61,137,0.05); border: 1px solid rgba(24,61,137,0.15); font-size: 7.8pt; color: #52525b; line-height: 1.4;">
                        <strong style="color: rgb(24,61,137);">CTU Laboratory Validated:</strong> Unified internal DC bus with 96.4% inverter efficiency, smoothing daytime solar with afternoon and nighttime urban wind currents.
                    </div>
                </div>
            </div>
        </div>

        {website_footer(5, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 6: TECHNICAL SPECIFICATIONS DATASHEET: TREETINO V1
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-6">
        {website_navbar(dark=False, doc_tag="05 / TECHNICAL DATASHEET")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">OFFICIAL TECHNICAL SPECIFICATION</span>
                <h2 class="web-h1">Technical Specifications Datasheet: Treetino V1 (49.8 kW)</h2>
                <p class="web-lead">Verified parameters co-developed with Czech Technical University (CTU) and Institute of Physics (FZU).</p>
            </div>

            <!-- Technical Specification Table (Clean Institutional Layout) -->
            <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; background: #ffffff; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <table style="width: 100%; border-collapse: collapse; font-size: 8.2pt; text-align: left;">
                    <thead>
                        <tr style="background: #fafaf9; border-bottom: 1px solid rgba(0,0,0,0.1);">
                            <th style="padding: 9px 14px; font-weight: 700; color: #09090b; width: 32%;">Parameter</th>
                            <th style="padding: 9px 14px; font-weight: 700; color: #09090b;">Treetino Strom V1 Engineering Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 7px 14px; font-weight: 600;">Model</td>
                            <td style="padding: 7px 14px; color: #52525b;">Treetino Strom V1 (Big Tree B2B Flagship)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 7px 14px; font-weight: 600;">Combined Peak Power Output</td>
                            <td style="padding: 7px 14px; color: rgb(24,61,137); font-weight: 700;">49.8 kW Peak (36 kW Wind + 13.8 kW Solar)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 7px 14px; font-weight: 600;">Photovoltaic System (Solar Foliage)</td>
                            <td style="padding: 7px 14px; color: #52525b;">300 pcs &times; 12V (830 &times; 340 mm, TopCon 20.2% efficiency)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 7px 14px; font-weight: 600;">Wind Harvesting System</td>
                            <td style="padding: 7px 14px; color: #52525b;">12 pcs &times; 48V Ducted Savonius VAWT (2.8m / 1.4m rotor height, 73 kg)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 7px 14px; font-weight: 600;">Cut-in Speed / Rated Wind Speed</td>
                            <td style="padding: 7px 14px; color: #52525b;">1.8 m/s Cut-in / 13.8 m/s Rated Speed (Venturi pressure acceleration)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 7px 14px; font-weight: 600;">Physical Dimensions</td>
                            <td style="padding: 7px 14px; color: #52525b;">11.5 m Height &bull; 1.2 m² Base Ground Footprint &bull; 12 m² Canopy Projection</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 7px 14px; font-weight: 600;">DC Operating Bus Voltage</td>
                            <td style="padding: 7px 14px; color: #52525b;">1000 / 1500 V DC unified internal bus (96.4% inverter efficiency)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 7px 14px; font-weight: 600;">Acoustic Emissions</td>
                            <td style="padding: 7px 14px; color: #047857; font-weight: 700;">&lt; 34.2 dB(A) @ 10 m (Whisper silent, full urban permit-ready)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 7px 14px; font-weight: 600;">Structural & PV Warranties</td>
                            <td style="padding: 7px 14px; color: #52525b;">15 Years Steel Skeleton Warranty &bull; 25 Years PV Output Guarantee (85%)</td>
                        </tr>
                        <tr>
                            <td style="padding: 7px 14px; font-weight: 600;">European Compliance & Certifications</td>
                            <td style="padding: 7px 14px; color: #52525b;">ČSN EN 1991-1-4, ČSN EN 61400-2, ČSN EN 1993-1-1, ČSN EN 62305, ČSN EN 61215</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {website_footer(6, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 7: PRODUCT PORTFOLIO (From HomeCtaTop.vue & ProductCard.vue)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-7">
        {website_navbar(dark=False, doc_tag="06 / PRODUCT PORTFOLIO")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">MODULAR ARCHITECTURE & COMMERCIAL CONFIGURATIONS</span>
                <h2 class="web-h1">Commercial Product Portfolio: V1, V2 & Standalone Turbine</h2>
                <p class="web-lead">Standardized cleantech hardware configurations for heavy industrial parks, municipal campuses, and distributed urban rooftops.</p>
            </div>

            <!-- 3 Product Cards matching ProductCard.vue -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px;">
                <!-- Product Card 1: Strom V1 -->
                <div style="position: relative; display: flex; flex-direction: column; border-radius: 16px; border: 1px solid rgba(0,0,0,0.12); overflow: hidden; background: #ffffff; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
                    <div style="height: 195px; overflow: hidden; position: relative; background: #000;">
                        <img src="{img_uri('img/stills/LG-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Strom V1" />
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.65); color: #fff; font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; padding: 3px 9px; border-radius: 9999px;">€235,000</div>
                    </div>
                    <div style="padding: 12px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">INDUSTRIAL FLAGSHIP</span>
                            <h3 style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">Strom V1</h3>
                            <p style="font-size: 7.6pt; color: #71717a; margin-top: 3px;">Heavy Industry, Corporate HQs & EV Fast-Charging Hubs</p>
                            <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                                <div>&bull; Output: <strong>45.0 – 49.8 kW Peak</strong></div>
                                <div>&bull; Specs: 300 TopCon Leaves + 12 VAWTs</div>
                                <div>&bull; Yield: 350 – 450 kWh / day</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                            <div style="border: 1px solid rgba(0,0,0,0.15); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #09090b;">Info</div>
                            <div style="background: rgb(24,61,137); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #ffffff;">Configure</div>
                        </div>
                    </div>
                </div>

                <!-- Product Card 2: Strom V2 -->
                <div style="position: relative; display: flex; flex-direction: column; border-radius: 16px; border: 1px solid rgba(0,0,0,0.12); overflow: hidden; background: #ffffff; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
                    <div style="height: 195px; overflow: hidden; position: relative; background: #000;">
                        <img src="{img_uri('img/stills/SM-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Strom V2" />
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.65); color: #fff; font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; padding: 3px 9px; border-radius: 9999px;">€35,500</div>
                    </div>
                    <div style="padding: 12px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #047857; text-transform: uppercase;">URBAN COMPACT</span>
                            <h3 style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">Strom V2</h3>
                            <p style="font-size: 7.6pt; color: #71717a; margin-top: 3px;">Schools, Municipalities & Commercial Parks</p>
                            <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                                <div>&bull; Output: <strong>12.0 – 15.0 kW Peak</strong></div>
                                <div>&bull; Specs: 130 TopCon Leaves + 6 VAWTs</div>
                                <div>&bull; Permitting: <strong>No Building Permit Needed</strong></div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                            <div style="border: 1px solid rgba(0,0,0,0.15); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #09090b;">Info</div>
                            <div style="background: rgb(24,61,137); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #ffffff;">Configure</div>
                        </div>
                    </div>
                </div>

                <!-- Product Card 3: Turbine -->
                <div style="position: relative; display: flex; flex-direction: column; border-radius: 16px; border: 1px solid rgba(0,0,0,0.12); overflow: hidden; background: #ffffff; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
                    <div style="height: 195px; overflow: hidden; position: relative; background: #000;">
                        <img src="{img_uri('img/stills/T-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Turbine" />
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.65); color: #fff; font-family: 'JetBrains Mono'; font-size: 7.5pt; font-weight: 700; padding: 3px 9px; border-radius: 9999px;">€6,100</div>
                    </div>
                    <div style="padding: 12px 14px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #d97706; text-transform: uppercase;">MODULAR VAWT</span>
                            <h3 style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">Větrná Turbína</h3>
                            <p style="font-size: 7.6pt; color: #71717a; margin-top: 3px;">Rooftops, Parapets, Masts & Light Poles</p>
                            <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                                <div>&bull; Output: <strong>1.0 – 3.0 kW Modular</strong></div>
                                <div>&bull; Cut-in: 1.8 m/s Start (Venturi Shroud)</div>
                                <div>&bull; Noise: &lt; 32 dB(A) Whisper Silent</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                            <div style="border: 1px solid rgba(0,0,0,0.15); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #09090b;">Info</div>
                            <div style="background: rgb(24,61,137); border-radius: 9999px; text-align: center; padding: 5px 0; font-size: 7.5pt; font-weight: 600; color: #ffffff;">Configure</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {website_footer(7, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 8: INDUSTRIAL 3D TOOLING & SCALE-UP (ANCHOR 2 & ACTIVE ASSETS)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-8">
        {website_navbar(dark=False, doc_tag="07 / MANUFACTURING & TOOLING")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">IN-HOUSE TOOLING & INDUSTRIAL SCALE-UP</span>
                <h2 class="web-h1">Scaling Production: Industrial 3D Tooling & Live Deployments</h2>
                <p class="web-lead">Overcoming hardware lead-time bottlenecks with in-house large-format additive manufacturing, precision steel fabrication partnerships, and live school test sites.</p>
            </div>

            <!-- 3 Operational Pillar Cards with Real Photos -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px;">
                <!-- 3D Printer Card -->
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="height: 180px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/im/industrial-3d-printer-production.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="In-House 3D Printer" />
                    </div>
                    <div style="padding: 12px 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">IN-HOUSE TOOLING</span>
                            <span style="background: rgba(24,61,137,0.1); color: rgb(24,61,137); font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">OPERATIONAL</span>
                        </div>
                        <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Massive Industrial 3D Printer</h3>
                        <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                            Acquired large-format industrial 3D printing setup to produce complex aerodynamic turbine shrouds and structural leaf frames in-house.
                        </p>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Tooling cycle cut from <strong>16 weeks to 48 hours</strong>.<br/>
                            Slashes NRE prototype costs by <strong>85%</strong>.<br/>
                            Currently printing structural branches for first 2 V2 trees.
                        </div>
                    </div>
                </div>

                <!-- Prague High School V2 Site Card (Anchor 2) -->
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="height: 180px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/im/prague-high-school-v2-site.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Prague High School V2 Site" />
                    </div>
                    <div style="padding: 12px 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #047857; text-transform: uppercase;">ACTIVE FIELD SITE</span>
                            <span style="background: rgba(16,185,129,0.12); color: #047857; font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">TELEMETRY ACTIVE</span>
                        </div>
                        <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Prague High School V2 Site</h3>
                        <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                            Construction initiated at a prestigious Prague high school. Ground cleared and equipped with dedicated meteorological measurement mast.
                        </p>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Anemometer actively logging wind telemetry.<br/>
                            <strong>130 TopCon PV leaves ready in storage</strong> (<code style="color:#09090b;">NAB240147.pdf</code>).<br/>
                            Municipal and educational showcase for zero-noise energy.
                        </div>
                    </div>
                </div>

                <!-- Strategic Supplier: MKovo Metalworks Card (Anchor 1) -->
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="height: 180px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/stills/Still_Strom-v1.png')}" style="width: 100%; height: 100%; object-fit: cover;" alt="MKovo Metalworks" />
                    </div>
                    <div style="padding: 12px 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #d97706; text-transform: uppercase;">STRATEGIC SUPPLIER</span>
                            <span style="background: rgba(245,158,11,0.12); color: #b45309; font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">DUAL ALLIANCE</span>
                        </div>
                        <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">MKovo Industrial Metalworks</h3>
                        <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                            Strategic commercial and fabrication alliance with precision metal leader MKovo s.r.o. for robotized steel fabrication.
                        </p>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Heavy CNC laser cutting & Eurocode 3 certified welding.<br/>
                            Eliminates capital-intensive greenfield metal factory buildout.<br/>
                            Dual role: <strong>strategic supplier AND €705k customer</strong>.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {website_footer(8, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 9: COMMERCIAL TRACTION & PIPELINE
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-9">
        {website_navbar(dark=False, doc_tag="08 / MARKET TRACTION")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">EARLY ADOPTERS & DEEP VALUE PROPOSITION</span>
                <h2 class="web-h1">Commercial Traction: High-Yield Industrial & B2G Strategic Pipeline</h2>
                <p class="web-lead">Targeting customers with severe substation capacity caps, strict ESG compliance mandates, and high willingness to pay.</p>
            </div>

            <!-- 4 Customer Segments (Website Clean Cards) -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 8px;">
                <div style="border-left: 3px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 10px 10px 0; border-top: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 12px 14px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137);">SEGMENT 1</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Heavy Industrial & Factories</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">Metalworks and manufacturing plants needing +200 kW where roofs and carports are fully occupied. Grid upgrades take 4 years.</p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #047857; font-weight: 700;">Proof: €705,000 MKovo Contract</div>
                </div>

                <div style="border-left: 3px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 10px 10px 0; border-top: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 12px 14px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137);">SEGMENT 2</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Corporate HQs & Banking</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">Iconic ESG flagships for corporate campuses seeking physical CSRD evidence, educational pride, and whisper-silent clean energy.</p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: rgb(24,61,137); font-weight: 700;">Proof: 2 Czech Tier-1 Bank LOIs</div>
                </div>

                <div style="border-left: 3px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 10px 10px 0; border-top: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 12px 14px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137);">SEGMENT 3</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Developers & Masterplans</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">Commercial business parks and residential districts integrating smart EV charging hubs to bypass transformer capacity caps.</p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #d97706; font-weight: 700;">Pipeline: Prague Enterprise V2</div>
                </div>

                <div style="border-left: 3px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 10px 10px 0; border-top: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 12px 14px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137);">SEGMENT 4</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">B2G & Defense / Dual-Use</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">Municipal resilience and tactical off-grid forward-deployed power stations supporting governmental 2030 EV targets.</p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: rgb(24,61,137); font-weight: 700;">Proof: Moldovan Gov Invitation</div>
                </div>
            </div>

            <!-- Lower Row: Public Sector Recognition & Tactical Resilience -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px;">
                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">GOVERNMENT TIES & COMMENDATIONS</span>
                    <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">High-Level B2G Recognition</h3>
                    <div style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        <strong>Czech Government Straka Academy:</strong> Personal prototype demonstration to Prime Minister Petr Fiala and Ministry leadership.<br/>
                        <strong>Official Moldovan Government Invitation:</strong> Formal invitation document (<code style="color:#09090b;">AVIZ_ATAS_NORD.pdf</code>) endorsing Treetino as decentralized energy resilience solution.<br/>
                        <strong>City of Prague Memorandum:</strong> Signed MoU for municipal smart city demonstration units in public pedestrian spaces.
                    </div>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #047857; text-transform: uppercase;">DUAL-USE & MILITARY RESILIENCE</span>
                    <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Forward-Deployed Tactical Microgrids</h3>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Government mandates dictate 50% vehicle fleet transition to electric by 2030 (including defense and emergency logistical vehicles). Treetino offers rapid-deploy vertical micro-power plants delivering silent, self-sustaining off-grid energy with zero fuel logistics or infrared thermal signatures.
                    </p>
                    <div style="margin-top: 6px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #047857; font-weight: 700;">
                        &bull; ELIGIBLE FOR EU DEFENSE & RESILIENCE ACCELERATION GRANTS
                    </div>
                </div>
            </div>
        </div>

        {website_footer(9, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 10: QUANTIFIED ROI & 5-YEAR FINANCIAL SCALING
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-10">
        {website_navbar(dark=False, doc_tag="09 / FINANCIAL MODEL")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">FINANCIAL FEASIBILITY & UNIT ECONOMICS</span>
                <h2 class="web-h1">Quantified Return on Investment & 5-Year Scaling</h2>
                <p class="web-lead">Validated generation parameters and European commercial electricity tariffs demonstrate compelling unsubsidized paybacks and superior power-to-footprint economics.</p>
            </div>

            <!-- Financial Metrics Strip -->
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; margin-top: 8px;">
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 16px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">10-YEAR FINANCIAL RETURN CALCULATION (V1 COMMERCIAL UNIT)</span>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px;">
                        <div style="background: #fafaf9; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">UNIT CAPEX</div>
                            <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 1px;">€235,000</div>
                            <div style="font-size: 6.8pt; color: #71717a;">Turnkey Installed</div>
                        </div>
                        <div style="background: #fafaf9; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">ANNUAL YIELD</div>
                            <div style="font-size: 13pt; font-weight: 700; color: rgb(24,61,137); margin-top: 1px;">52,000 kWh</div>
                            <div style="font-size: 6.8pt; color: #71717a;">32k Solar + 20k Wind</div>
                        </div>
                        <div style="background: #fafaf9; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">TARIFF</div>
                            <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 1px;">€0.32 / kWh</div>
                            <div style="font-size: 6.8pt; color: #71717a;">EU Benchmark</div>
                        </div>
                        <div style="background: #fafaf9; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04);">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">NET SAVINGS</div>
                            <div style="font-size: 13pt; font-weight: 700; color: #047857; margin-top: 1px;">€14,840 / yr</div>
                            <div style="font-size: 6.8pt; color: #71717a;">After €1,800 OPEX</div>
                        </div>
                    </div>
                    <div style="margin-top: 8px; padding: 8px 12px; background: rgba(24,61,137,0.04); border: 1px solid rgba(24,61,137,0.12); border-radius: 8px; font-size: 7.6pt; color: #52525b; display: flex; justify-content: space-between;">
                        <span><strong>Unsubsidized Payback:</strong> <span style="color:rgb(24,61,137); font-weight:700;">~12.8 Years (6.8% IRR)</span></span>
                        <span><strong>Subsidized Payback (40% EU Grant):</strong> <span style="color:#047857; font-weight:700;">7.7 Years (13.2% IRR)</span></span>
                    </div>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 16px; background: #fafaf9; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">BOTTOM-UP MARKET SIZING</span>
                        <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px; font-size: 7.8pt;">
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 2px;">
                                <span style="color: #71717a;">TAM &bull; Global Urban Micro-Gen</span>
                                <strong style="color: #09090b;">€140 Billion</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 2px;">
                                <span style="color: #71717a;">SAM &bull; 60,000 DACH/CEE Sites</span>
                                <strong style="color: rgb(24,61,137);">€14.1 Billion</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 2px;">
                                <span style="color: #71717a;">SOM &bull; 240 Units (Years 1–5)</span>
                                <strong style="color: #047857;">€56.4 Million</strong>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 7pt; color: #71717a; line-height: 1.35; margin-top: 4px;">
                        Realistic bottom-up SOM strictly constrained by factory scaling ramp rather than unconstrained sales assumptions.
                    </div>
                </div>
            </div>

            <!-- 5-Year Projection Financial Table -->
            <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; background: #ffffff; margin-top: 8px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 8pt; text-align: left;">
                    <thead>
                        <tr style="background: #fafaf9; border-bottom: 1px solid rgba(0,0,0,0.1);">
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">PROJECTION YEAR</th>
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">MONTHLY CAPACITY</th>
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">ANNUAL UNITS SOLD</th>
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">AVERAGE CAPEX / UNIT</th>
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">ANNUAL REVENUE</th>
                            <th style="padding: 8px 12px; font-weight: 700; color: #09090b;">CUMULATIVE UNITS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 6px 12px; font-weight: 700;">Year 1 (2027)</td>
                            <td style="padding: 6px 12px; color: #52525b;">1 unit / mo</td>
                            <td style="padding: 6px 12px; font-weight: 600;">6 units</td>
                            <td style="padding: 6px 12px; color: #52525b;">€235,000</td>
                            <td style="padding: 6px 12px; color: rgb(24,61,137); font-weight: 700;">€1,410,000</td>
                            <td style="padding: 6px 12px; color: #52525b;">6 units</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 6px 12px; font-weight: 700;">Year 2 (2028)</td>
                            <td style="padding: 6px 12px; color: #52525b;">2 units / mo</td>
                            <td style="padding: 6px 12px; font-weight: 600;">18 units</td>
                            <td style="padding: 6px 12px; color: #52525b;">€235,000</td>
                            <td style="padding: 6px 12px; color: rgb(24,61,137); font-weight: 700;">€4,230,000</td>
                            <td style="padding: 6px 12px; color: #52525b;">24 units</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 6px 12px; font-weight: 700;">Year 3 (2029)</td>
                            <td style="padding: 6px 12px; color: #52525b;">4 units / mo</td>
                            <td style="padding: 6px 12px; font-weight: 600;">36 units</td>
                            <td style="padding: 6px 12px; color: #52525b;">€235,000</td>
                            <td style="padding: 6px 12px; color: rgb(24,61,137); font-weight: 700;">€8,460,000</td>
                            <td style="padding: 6px 12px; color: #52525b;">60 units</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); background: #fafaf9;">
                            <td style="padding: 6px 12px; font-weight: 700;">Year 4 (2030)</td>
                            <td style="padding: 6px 12px; color: #52525b;">6 units / mo</td>
                            <td style="padding: 6px 12px; font-weight: 600;">60 units</td>
                            <td style="padding: 6px 12px; color: #52525b;">€235,000</td>
                            <td style="padding: 6px 12px; color: rgb(24,61,137); font-weight: 700;">€14,100,000</td>
                            <td style="padding: 6px 12px; color: #52525b;">120 units</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 12px; font-weight: 700;">Year 5 (2031)</td>
                            <td style="padding: 6px 12px; color: #52525b;">10 units / mo</td>
                            <td style="padding: 6px 12px; font-weight: 600;">120 units</td>
                            <td style="padding: 6px 12px; color: #52525b;">€235,000</td>
                            <td style="padding: 6px 12px; color: #047857; font-weight: 700;">€28,200,000</td>
                            <td style="padding: 6px 12px; color: #047857; font-weight: 700;">240 units (€56.4M SOM)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {website_footer(10, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 11: WEB3 & DEPIN PROTOCOL ARCHITECTURE (CERTINO & PROTOCOL LABS)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-11">
        {website_navbar(dark=False, doc_tag="10 / WEB3 & DEPIN PROTOCOL")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">PROTOCOL LABS ALUMNI &bull; ETHPRAGUE CERTINO WINNER</span>
                <h2 class="web-h1">Connecting Physical Cleantech to On-Chain ESG Markets</h2>
                <p class="web-lead">Accelerated by Protocol Labs (Founders Forge Cohort 1, Dubai). Two synergistic protocol layers enabling decentralized capital co-funding and audit-grade hourly ESG certificates.</p>
            </div>

            <!-- Two Protocol Layers -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 8px;">
                <div style="border-left: 4px solid rgb(24,61,137); background: #fafaf9; border-radius: 0 12px 12px 0; border-top: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 16px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7.2pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">LAYER 1 &bull; RWA INFRASTRUCTURE FINANCING</span>
                    <h3 style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">Treetino RWA Protocol & Yield Vaults</h3>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Enables global institutional and retail capital to co-fund physical tree deployments and receive verified on-chain yields from real-world energy sales, EV charging, and grid telemetry.
                    </p>
                    <div style="margin-top: 10px; font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; line-height: 1.45;">
                        <strong>Tranched Architecture:</strong> Centrifuge-style Senior (<strong>8% fixed APY</strong>) and Junior (residual yield) ERC-4626 vaults.<br/>
                        <strong>Automated NAV:</strong> Algorithmic Net Asset Value calculation driven by verified hardware generation feeds.<br/>
                        <strong>Yield Distribution:</strong> Automated smart contract waterfalls settle revenues from power purchase agreements.
                    </div>
                </div>

                <div style="border-left: 4px solid #10b981; background: #fafaf9; border-radius: 0 12px 12px 0; border-top: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 16px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7.2pt; font-weight: 700; color: #047857; text-transform: uppercase;">LAYER 2 &bull; DECENTRALIZED INVERTER ORACLE & ESG</span>
                    <h3 style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">Certino Protocol (ETHPrague Innovation)</h3>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Co-developed by Treetino CTO with the portfolio manager of the premier Czech crypto hedge fund. Connects physical inverters directly to on-chain oracles.
                    </p>
                    <div style="margin-top: 10px; font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; line-height: 1.45;">
                        <strong>Hardware Normalization:</strong> Universal API extraction for Victron, SMA, Fronius, Huawei, and SolarEdge.<br/>
                        <strong>Chainlink Functions DON:</strong> Decentralized Oracle Network mints granular, hourly ERC-721 ESG certificates.<br/>
                        <strong>Mass Monetization:</strong> Residential solar owners unlock <strong>~€40/year passive yield</strong>; corporates get audit-grade CSRD compliance.
                    </div>
                </div>
            </div>

            <!-- Legal Opinion / MiCA Assessment Strip -->
            <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 12px 16px; background: #ffffff; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">LEGAL CLASSIFICATION & MICA COMPLIANCE (ARTIFFINE AUDIT)</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; background: rgba(16,185,129,0.12); color: #047857; padding: 2px 8px; border-radius: 9999px;">MICA COMPLIANT</span>
                </div>
                <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                    Comprehensive regulatory legal analysis prepared by Web3 studio <strong>Artiffine</strong> confirms full compliance with the EU Markets in Crypto-Assets (MiCA) regulation, classifying oracle certificates as verifiable utility proof assets and structuring RWA vaults under compliant asset-backed financing exemptions.
                </p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt;">
                    <div style="background: #fafaf9; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.04);">
                        <strong style="color: rgb(24,61,137);">STEP 1 &bull; GENERATION</strong><br/>
                        <span style="color:#09090b;">Physical Inverters</span><br/>
                        <span style="color:#71717a; font-size:6.5pt;">Victron, SMA, Fronius output verified kW telemetry via secure hardware gateways.</span>
                    </div>
                    <div style="background: #fafaf9; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.04);">
                        <strong style="color: rgb(24,61,137);">STEP 2 &bull; ORACLE DON</strong><br/>
                        <span style="color:#09090b;">Chainlink Functions</span><br/>
                        <span style="color:#71717a; font-size:6.5pt;">Decentralized Oracle Network verifies signatures and validates telemetry in hourly batches.</span>
                    </div>
                    <div style="background: #fafaf9; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.04);">
                        <strong style="color: #047857;">STEP 3 &bull; MINTING</strong><br/>
                        <span style="color:#09090b;">ERC-721 ESG NFT</span><br/>
                        <span style="color:#71717a; font-size:6.5pt;">Granular EnergyTag certificate stamped with timestamp, exact GPS, and device ID.</span>
                    </div>
                    <div style="background: #fafaf9; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.04);">
                        <strong style="color: #047857;">STEP 4 &bull; LIQUIDITY</strong><br/>
                        <span style="color:#09090b;">EURC Settlement</span><br/>
                        <span style="color:#71717a; font-size:6.5pt;">Settles against EPEX SPOT clearing prices; funds streamed into Senior/Junior vaults.</span>
                    </div>
                </div>
            </div>
        </div>

        {website_footer(11, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 12: GLOBAL PATENT PROTECTION & FREEDOM TO OPERATE
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-12">
        {website_navbar(dark=False, doc_tag="11 / INTELLECTUAL PROPERTY")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">DEFENSIBLE IP FORTRESS & FREEDOM TO OPERATE</span>
                <h2 class="web-h1">Global Patent Protection & Clean Freedom to Operate</h2>
                <p class="web-lead">Multi-layered intellectual property architecture protecting core aerodynamic ducting, dynamic multi-axis branch articulation, and embedded firmware algorithms.</p>
            </div>

            <!-- 3 Patent Registrations Strip -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px;">
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 14px 16px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">WORLD PATENT (PCT)</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; background: rgba(24,61,137,0.1); color: rgb(24,61,137); padding: 2px 6px; border-radius: 4px;">PUBLISHED</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 4px;">WO 2025/256678 A1</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 2px;">Application: PCT/CZ2025/050053</div>
                    <p style="font-size: 7.6pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Protects the dual-modality synchronization hub, transparent Venturi shroud stator duct geometry, and omnidirectional airflow acceleration mechanics. Priority date: March 2025.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 14px 16px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #047857; text-transform: uppercase;">EUROPEAN PATENT</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; background: rgba(16,185,129,0.12); color: #047857; padding: 2px 6px; border-radius: 4px;">OFFICIAL SPEC</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 4px;">EP 4 664 750 A1</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 2px;">European Patent Office (EPO)</div>
                    <p style="font-size: 7.6pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Protects the mechanical multi-axis articulation system of structural branches, dynamic anti-shadowing tracking, automated hail defense, and ground-level maintenance pivot orientation.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 14px 16px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #d97706; text-transform: uppercase;">EU INDUSTRIAL DESIGN</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; background: rgba(245,158,11,0.12); color: #b45309; padding: 2px 6px; border-radius: 4px;">REGISTERED</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 4px;">RCD 015029481</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 2px;">EUIPO Design Registration</div>
                    <p style="font-size: 7.6pt; color: #71717a; line-height: 1.45; margin-top: 8px;">
                        Grants 25 years of exclusive aesthetic and visual design protection across all 27 EU member states for the iconic biomimetic tree silhouette, branch proportions, and ducted rotor casing.
                    </p>
                </div>
            </div>

            <!-- FTO & IP Ownership Status -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px;">
                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">100% UNENCUMBERED IP OWNERSHIP</span>
                    <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Full Assignment & Collaborative Agreements</h3>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Treetino corp s.r.o. holds 100% full, exclusive ownership of all patents, registered designs, and firmware. Formal IP assignment agreements have been executed with academic research partners (<strong>Institute of Physics - FZU, Czech Technical University - CTU</strong>) and industrial fabrication partners (<strong>MKovo</strong>), ensuring zero royalty encumbrances.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; background: #fafaf9;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #047857; text-transform: uppercase;">INDEPENDENT FREEDOM TO OPERATE (FTO)</span>
                    <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Zero Infringement Risk Confirmed</h3>
                    <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        An exhaustive Freedom to Operate (FTO) search conducted by independent European Patent Attorneys (<strong>Všetečka & Partners, Prague</strong>) covering IPC classes F03D (wind motors), H02S (photovoltaic power plants), and F03D3/04 (VAWT ducts) confirmed <strong>zero infringement risk</strong> against existing patents held by major wind and solar manufacturers.
                    </p>
                </div>
            </div>
        </div>

        {website_footer(12, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 13: FOUNDERS & OPERATIONAL LEADERSHIP (From FoundersSection.vue)
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-13">
        {website_navbar(dark=False, doc_tag="12 / LEADERSHIP & TEAM")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">SERIAL CLEAN-TECH OPERATORS & ACADEMIC ALLIANCES</span>
                <h2 class="web-h1">Founders & Leadership: Proven Execution & Deep-Tech Expertise</h2>
                <p class="web-lead">Complementary operational leadership combining multi-megawatt renewables deployment, advanced embedded firmware architecture, and elite Czech research institutions.</p>
            </div>

            <!-- Founders Row matching FoundersSection.vue -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 8px;">
                <!-- Founder 1: Dominik Mašek (CEO) -->
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; padding: 14px 16px; background: #ffffff; display: flex; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="width: 110px; height: 140px; border-radius: 10px; overflow: hidden; flex-shrink: 0; position: relative; background: #f4f4f5; border: 1px solid rgba(0,0,0,0.1);">
                        <img src="{img_uri('img/founders/dominik-portrait.jpg')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%;" alt="Dominik Mašek" />
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 4px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: #fff; font-size: 6.5pt; font-weight: 700; text-align: center;">
                            CEO &bull; Co-Founder
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="border-left: 2px solid rgb(24,61,137); padding-left: 8px;">
                                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">CHIEF EXECUTIVE OFFICER</span>
                                <h3 style="font-size: 14pt; font-weight: 700; color: #09090b; margin-top: 1px;">Dominik Mašek</h3>
                                <p style="font-size: 7.2pt; color: #71717a;">Prague, Czech Republic &bull; Founder of Wattino</p>
                            </div>
                            <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 6px;">
                                Serial hardware and clean-energy entrepreneur. 8+ years developing commercial PV installations, multi-MW wind projects, and industrial grid connections. Drives overall commercial strategy, government relations, and sales pipeline.
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; font-family: 'JetBrains Mono'; text-align: center;">
                            <div>
                                <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">8+ Yrs</div>
                                <div style="font-size: 6pt; color: #71717a;">CLEAN TECH</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 9.5pt; font-weight: 700; color: rgb(24,61,137);">Multi-MW</div>
                                <div style="font-size: 6pt; color: #71717a;">PV DEPLOYED</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 9.5pt; font-weight: 700; color: #047857;">B2B</div>
                                <div style="font-size: 6pt; color: #71717a;">SALES LEAD</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Founder 2: Jakub Lustyk (CTO) -->
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 14px; padding: 14px 16px; background: #ffffff; display: flex; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="width: 110px; height: 140px; border-radius: 10px; overflow: hidden; flex-shrink: 0; position: relative; background: #f4f4f5; border: 1px solid rgba(0,0,0,0.1);">
                        <img src="{img_uri('img/founders/jakub-portrait.jpg')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%;" alt="Jakub Lustyk" />
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 4px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: #fff; font-size: 6.5pt; font-weight: 700; text-align: center;">
                            CTO &bull; Co-Founder
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="border-left: 2px solid rgb(24,61,137); padding-left: 8px;">
                                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">CHIEF TECHNOLOGY OFFICER</span>
                                <h3 style="font-size: 14pt; font-weight: 700; color: #09090b; margin-top: 1px;">Jakub Lustyk</h3>
                                <p style="font-size: 7.2pt; color: #71717a;">Prague, Czech Republic &bull; Protocol Labs Alumni</p>
                            </div>
                            <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 6px;">
                                Hardware systems architect and embedded software engineer. Founder of Nocena; 10+ years architecting embedded IoT devices and decentralized networks. Leads aerodynamics research, sensor fusion MCU algorithms, and oracle integration.
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; font-family: 'JetBrains Mono'; text-align: center;">
                            <div>
                                <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">10+ Yrs</div>
                                <div style="font-size: 6pt; color: #71717a;">SYSTEMS ENG</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 9.5pt; font-weight: 700; color: rgb(24,61,137);">PL Alum</div>
                                <div style="font-size: 6pt; color: #71717a;">DEV ARCHITECT</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 9.5pt; font-weight: 700; color: #047857;">PCT & EP</div>
                                <div style="font-size: 6pt; color: #71717a;">PATENT AUTHOR</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Engineering & Scientific Advisory Strip -->
            <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 12px 16px; background: #fafaf9; margin-top: 8px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8.2pt;">Matěj Čížek</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: rgb(24,61,137); font-weight: 700;">HEAD OF ARCHITECTURE &bull; M.ARCH CTU</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">Specialist in urban biomimicry and structural statics under Eurocode 3 wind load standards.</p>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8.2pt;">Radim Novotný</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: rgb(24,61,137); font-weight: 700;">LEAD MECHANICAL & TOOLING ENGINEER</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">7+ years CAD modeling, aerodynamic shroud wind-tunnel testing, and large-format 3D manufacturing.</p>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8.2pt;">Monika Zvěřinová</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: rgb(24,61,137); font-weight: 700;">PROJECT & COMPLIANCE MANAGER</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">6+ years managing multi-million euro deep-tech grants, regulatory filings, and ISO compliance audits.</p>
                    </div>
                </div>

                <!-- Academic & Institutional Logos -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 8px; padding-top: 8px; opacity: 0.85;">
                    <img src="{img_uri('partners/CzechInvest.png')}" style="height: 20px; max-width: 100px; object-fit: contain;" alt="CzechInvest" />
                    <img src="{img_uri('partners/cvut.svg')}" style="height: 22px; max-width: 90px; object-fit: contain;" alt="ČVUT" />
                    <img src="{img_uri('partners/fzu.svg')}" style="height: 20px; max-width: 90px; object-fit: contain;" alt="FZU" />
                    <img src="{img_uri('partners/Sic.png')}" style="height: 20px; max-width: 90px; object-fit: contain;" alt="SIC" />
                    <img src="{img_uri('partners/startit.svg')}" style="height: 20px; max-width: 100px; object-fit: contain;" alt="Start It ČSOB" />
                    <img src="{img_uri('partners/Makeiton.png')}" style="height: 18px; max-width: 90px; object-fit: contain;" alt="Make-it-on" />
                </div>
            </div>
        </div>

        {website_footer(13, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 14: CAPITAL STRATEGY & CONFIDENTIAL DATA ROOM CATALOG
    # =========================================================================
    pages.append(f"""<div class="page-container page-light" id="page-14">
        {website_navbar(dark=False, doc_tag="13 / DUE DILIGENCE DATA ROOM")}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">FINANCING ROUND & CONFIDENTIAL DUE DILIGENCE</span>
                <h2 class="web-h1">Capital Strategy & Confidential Due Diligence Data Room</h2>
                <p class="web-lead">Financing structure, use of funds allocation, and catalog of the 10 core verification documents available under mutual NDA.</p>
            </div>

            <!-- Capital Structure & Executive Contact -->
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; margin-top: 8px;">
                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 16px; background: #ffffff;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">CAPITAL STRUCTURE & ROADMAP</span>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 6px; margin-bottom: 8px;">
                        <div style="background: #fafaf9; border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; padding: 8px 10px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">GRANT CLOSED</div>
                            <div style="font-size: 13pt; font-weight: 700; color: #047857; margin-top: 1px;">€200,000</div>
                            <div style="font-size: 6.8pt; color: #71717a;">CzechInvest (100%)</div>
                        </div>
                        <div style="background: #fafaf9; border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; padding: 8px 10px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">EU BLENDED</div>
                            <div style="font-size: 13pt; font-weight: 700; color: rgb(24,61,137); margin-top: 1px;">€2,500,000</div>
                            <div style="font-size: 6.8pt; color: #71717a;">€1.5M + €1M Equity</div>
                        </div>
                        <div style="background: #fafaf9; border: 1px solid rgba(0,0,0,0.05); border-radius: 8px; padding: 8px 10px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">BOND AUCTION</div>
                            <div style="font-size: 13pt; font-weight: 700; color: #d97706; margin-top: 1px;">€10,000,000</div>
                            <div style="font-size: 6.8pt; color: #71717a;">Tomes & Partners Offer</div>
                        </div>
                    </div>
                    <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4;">
                        <strong>Current Co-Investment Request:</strong> Strategic equity co-investment slots open to private cleantech investors to de-risk pilot deployment at customer sites, fund ISO 61400 turbine safety certification, and scale inventory for MKovo orders.
                    </p>
                </div>

                <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 16px; background: #fafaf9; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">EXECUTIVE CONTACT</span>
                        <div style="font-size: 12pt; font-weight: 700; color: #09090b; margin-top: 2px;">Treetino corp s.r.o.</div>
                        <div style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 4px;">
                            V Tůních 1625/8, 120 00 Prague 2, Czech Republic<br/>
                            <strong>Dominik Mašek (CEO):</strong> dominik@treetino.eu<br/>
                            <strong>Jakub Lustyk (CTO):</strong> jakub@treetino.eu<br/>
                            Web: <a href="https://www.treetino.eu" style="color: rgb(24,61,137); text-decoration: none; font-weight: 600;">www.treetino.eu</a>
                        </div>
                    </div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 7pt; color: #71717a; margin-top: 4px;">
                        Meetings available in Prague or via secure teleconference.
                    </div>
                </div>
            </div>

            <!-- Full 10 Core NDA Verification Documents Catalog -->
            <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 16px; background: #ffffff; margin-top: 8px;">
                <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: rgb(24,61,137); text-transform: uppercase;">CONFIDENTIAL DATA ROOM INDEX (10 CORE DUE DILIGENCE ASSETS AVAILABLE UNDER NDA)</span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;">
                    <div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">1. grant.pdf:</strong> Official CzechInvest Technological Incubation grant award & audit
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">2. NAB240147.pdf:</strong> Binding order for 130 TopCon PV leaves for first 2 V2 trees
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">3. zadavaci_dokumentace.pdf:</strong> Full developer specification for embedded MCU & HW
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">4. international_patent.pdf:</strong> World Patent publication (WO 2025/256678 A1)
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; padding: 3px 0;">
                            <strong style="color: #09090b;">5. EU_patent.pdf:</strong> Official European Patent specification (EP 4 664 750 A1)
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">6. MOU - M - kovo.pdf:</strong> Binding conditional contract for 3x V1 trees (€705,000)
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">7. AVIZ_ATAS_NORD.pdf:</strong> Official Moldovan Government invitation & endorsement
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">8. Signed LOIs Package:</strong> Banking HQs, high schools, and municipal pipeline LOIs
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 3px 0;">
                            <strong style="color: #09090b;">9. VAWT_mereni.pdf:</strong> Official CTU Wind Tunnel wind measurement & C_p test report
                        </div>
                        <div style="font-size: 7.4pt; color: #52525b; padding: 3px 0;">
                            <strong style="color: #09090b;">10. Treetino_nabidka.pdf:</strong> Tomes & Partners commitment letter for €10M bond auction
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transaction Next Steps Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(24,61,137,0.2); border-radius: 8px; padding: 8px 14px; background: rgba(24,61,137,0.04); margin-top: 6px;">
                <div style="font-size: 7.6pt; color: #52525b;">
                    <strong>Due Diligence Roadmap:</strong> 1. Mutual NDA Execution &rarr; 2. Technical Data Room Access &rarr; 3. Prague Site Visit & Leadership Q&A &rarr; 4. Term Sheet & Co-Investment Allocation
                </div>
                <div style="background: rgb(24,61,137); color: #fff; font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">
                    ACTIVE DD
                </div>
            </div>
        </div>

        {website_footer(14, dark=False)}
    </div>""")

    return pages

def build_full_html():
    pages = build_pages()
    body_content = "".join(pages)
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Treetino - Confidential Investment Memorandum (September 2026)</title>
<link rel="stylesheet" href="file://{COMPILED_CSS}">
<style>
{GLOBAL_CSS}
</style>
</head>
<body>
{body_content}
</body>
</html>
"""
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated master HTML: {OUTPUT_HTML} ({len(html)} bytes)")

def compile_pdf():
    print(f"Compiling PDF using Chrome headless: {OUTPUT_PDF}...")
    cmd = [
        CHROME_BIN,
        "--headless",
        "--disable-gpu",
        "--allow-file-access-from-files",
        "--run-all-compositor-stages-before-draw",
        "--print-to-pdf-no-header",
        f"--print-to-pdf={OUTPUT_PDF}",
        OUTPUT_HTML,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(OUTPUT_PDF):
        size = os.path.getsize(OUTPUT_PDF)
        print(f"PDF successfully compiled: {OUTPUT_PDF} ({size} bytes)")
        shutil.copy2(OUTPUT_PDF, DOCS_PDF)
        print(f"Copied to public/docs: {DOCS_PDF}")
    else:
        print(f"Failed to generate PDF. Stderr: {res.stderr}")

def generate_screenshots():
    print("Generating page screenshots for audit...")
    pages = build_pages()
    for i, page_html in enumerate(pages, 1):
        bg_style = "#050507" if i == 1 else "#ffffff"
        single_page_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="file://{COMPILED_CSS}">
<style>
{GLOBAL_CSS}
html, body {{
  margin: 0 !important;
  padding: 0 !important;
  background-color: {bg_style} !important;
  width: 1123px !important;
  height: 794px !important;
  overflow: hidden !important;
}}
.page-container {{
  width: 1123px !important;
  height: 794px !important;
  max-height: 794px !important;
  min-height: 794px !important;
  page-break-after: avoid !important;
  margin: 0 !important;
}}
</style>
</head>
<body style="margin: 0; padding: 0; background: {bg_style};">
{page_html}
</body>
</html>
"""
        single_path = os.path.join(SCRATCH_DIR, f"page_{i}.html")
        with open(single_path, "w", encoding="utf-8") as f:
            f.write(single_page_html)
        
        screen_path = os.path.join(SCREENSHOT_DIR, f"im_page_{i:02d}.png")
        cmd = [
            CHROME_BIN,
            "--headless",
            "--disable-gpu",
            "--allow-file-access-from-files",
            "--hide-scrollbars",
            "--window-size=1123,794",
            "--device-scale-factor=2",
            f"--screenshot={screen_path}",
            single_path,
        ]
        subprocess.run(cmd, capture_output=True)
        if os.path.exists(screen_path):
            print(f"Page {i:02d} screenshot saved: {screen_path}")

if __name__ == "__main__":
    build_full_html()
    compile_pdf()
    generate_screenshots()
