#!/usr/bin/env python3
"""
Treetino Investment Memorandum (IM) 2026 - Master High-Fidelity PDF & Screenshot Generator (V2.3)
Institutional-Grade Clean Architecture directly reflecting Treetino Codebase & Design Standards:
1. Strictly Monochromatic & Neutral Palette: Pure blacks, crisp whites, and zinc greys (#09090b, #18181b, #27272a, #52525b, #71717a, #e4e4e7, #fafaf9).
   ALL random blue colors (rgb(24,61,137), #0047bb, #93c5fd, etc.) completely removed.
2. Clean, Unobstructed Imagery: ALL text overlays, floating badges, pricing chips, and dark gradient scrims sitting on top of images removed.
3. High-Impact, Prominent Visuals: Image heights substantially increased across product pages, manufacturing sites, and event showcases to eliminate dead whitespace.
4. Comprehensive Hardware Architecture from zadávací dokumentace: Detailed specification of all physical HW subsystems (MCU, inverters, servomotors, anemometers, sensors, BMS, Wallbox) integrated into Page 5 and Data Room on Page 16.
5. MKovo Archetype Customer Case Study with authentic on-site anemometer measurement photo.
6. International GTM Strategy: Institutional investor perspective targeting Southern Europe & coastal wind corridors.
7. Correct Government Identification: Andrej Babiš (Former Czech Prime Minister).
8. Real Financial Plan from Google Sheets: Unit economics, gross margins, and 24-month revenue trajectory chart in high-contrast graphite/monochrome.
9. 100% English typography throughout (no "Strom").
10. Final Page 16 Data Room: Clean indexed catalog of all 10 core verification documents.
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
DESKTOP_PDF = "/Users/jakub/Desktop/Treetino_Investment_Memorandum_2026.pdf"
DESKTOP_SCREENS = "/Users/jakub/Desktop/Treetino_IM_Screenshots"
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(SCRATCH_DIR, exist_ok=True)
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "docs"), exist_ok=True)
os.makedirs(DESKTOP_SCREENS, exist_ok=True)

def img_uri(rel_path):
    abs_p = os.path.join(PUBLIC_DIR, rel_path)
    return f"file://{abs_p}"

def get_logotype_svg(dark=False):
    fill = "#ffffff" if dark else "#000000"
    return f"""<svg style="height: 20px; width: auto; display: block;" viewBox="0 0 400 75.82" fill="{fill}" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.78,66.53c.06.03.12.05.19.05h0,0s-.09,0-.19-.05ZM25.97,66.58l-.19-.05c1.63.87,3.6.82,5.18-.13,1.58-.95,2.55-2.66,2.55-4.51v-5.02c0-1.36-.73-2.62-1.9-3.29l-6.55-3.78c-1.99-1.15-3.45-3.05-4.04-5.27-.59-2.22-.29-4.58.86-6.57l11.01,6.35c.13.07.29.07.42,0,.13-.07.21-.21.21-.37v-23.79h8.67v12.16c0,.15.08.29.21.37.13.07.29.07.42,0l10.53-6.08c1.14,1.99,1.45,4.36.86,6.57-.6,2.22-2.05,4.12-4.05,5.27l-6.08,3.51c-1.18.68-1.9,1.94-1.9,3.29v16.65c0,4.89-2.57,9.42-6.76,11.94-4.19,2.52-9.4,2.65-13.71.36h0c-8.08-4.3-16.06-10.37-18.38-14.39-2.06-3.57-3.33-11.73-3.33-19.93s1.27-16.36,3.33-19.93c2.06-3.57,8.49-8.75,15.6-12.85C26.03,2.98,33.73,0,37.85,0s12.01,3.26,19.2,7.52c7.19,4.26,13.61,9.46,15.32,12.41,1.7,2.95,2.85,11.42,2.85,19.93s-1.15,16.98-2.85,19.93c-.78,1.36-2.46,3.17-4.82,5.08-4.38,3.54-11.35,7.81-17.47,10.81l-.05-.11c-2.03-4.19-.52-9.23,3.48-11.62,2.45-1.46,4.8-2.99,6.79-4.45,2.18-1.6,3.94-2.97,4.57-4.05.43-.74.67-2.07.93-3.71.52-3.29.77-7.59.77-11.88s-.25-8.6-.77-11.89c-.26-1.64-.5-2.97-.93-3.71-.54-.94-1.73-2.1-3.33-3.37-2.34-1.85-5.56-3.94-8.9-5.91-5.61-3.32-11.58-6.31-14.79-6.31s-9.06,2.73-14.59,5.92c-5.53,3.19-10.82,6.9-12.42,9.68s-2.17,9.21-2.17,15.6.56,12.82,2.17,15.6c1.85,3.21,8.5,7.65,14.94,11.07l.19.05Z"/>
        <path d="M391.87,49.66v-12.82c0-1.95-1.1-2.89-3.29-2.89h-20.51c-2.15,0-3.24.95-3.24,2.89v12.82c0,1.9,1.1,2.89,3.24,2.89h20.51c2.2,0,3.29-1,3.29-2.89ZM400,36.83v12.82c0,6.44-5.09,11.03-11.43,11.03h-20.51c-6.29,0-11.38-4.54-11.38-11.03v-12.82c0-6.44,5.09-11.08,11.38-11.08h20.51c6.34,0,11.43,4.59,11.43,11.08ZM352.85,25.75v26.95c0,4.39-3.59,7.98-7.98,7.98h-.15l-21.01-23.5v15.52c0,4.39-3.59,8.03-7.98,8.03h-.15v-26.95c0-4.39,3.59-8.03,7.98-8.03h.15l21.01,23.4v-15.37c0-4.39,3.59-8.03,7.98-8.03h.15ZM311.73,33.79v26.95h-.15c-4.39,0-7.98-3.64-7.98-8.03v-26.95h.15c4.39,0,7.98,3.64,7.98,8.03ZM276.4,60.68v-26.75h-15.72c0-4.59,3.54-8.18,7.99-8.18h31.69c0,4.64-3.59,8.18-8.03,8.18h-7.73v18.76c0,4.44-3.59,7.98-8.18,7.98ZM231.11,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.98-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM221.58,33.94v-.15c0-4.39,3.59-8.03,7.98-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM188.84,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.99-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM179.31,33.94v-.15c0-4.39,3.59-8.03,7.99-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM92.69,25.75h31.69c4.44,0,7.98,3.59,7.98,8.18h-15.72v18.76c0,4.44-3.59,7.98-8.18,7.98v-26.75h-7.73c-4.44,0-8.03-3.54-8.03-8.18ZM139.15,41.22h25.15c4.79,0,4.79-7.29,0-7.29h-22.7c-2.94,0-5.49-1.45-6.94-3.99l-2.3-4.19h31.94c6.49,0,11.78,5.34,11.78,11.83s-5.29,11.78-11.78,11.78h-.82l6.59,11.38h-9.43l-6.58-11.38h-6.72v11.38c-4.59,0-8.18-2.52-8.18-5.67v-5.7h0v-8.13Z"/>
    </svg>"""

def doc_header(section_tag="", dark=False):
    border_color = "rgba(255,255,255,0.15)" if dark else "rgba(0,0,0,0.1)"
    text_color = "rgba(255,255,255,0.5)" if dark else "#71717a"
    accent_color = "#ffffff" if dark else "#18181b"
    
    return f"""
    <div style="width: 100%; margin-bottom: 12px; border-bottom: 1px solid {border_color}; padding-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
            {get_logotype_svg(dark=dark)}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: {accent_color};">
                {section_tag}
            </span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; color: {text_color};">
                &bull; INVESTMENT MEMORANDUM
            </span>
        </div>
    </div>
    """

def doc_footer(page_num, total_pages=16, dark=False):
    border_color = "rgba(255,255,255,0.12)" if dark else "rgba(0,0,0,0.08)"
    text_color = "rgba(255,255,255,0.45)" if dark else "#71717a"
    return f"""
    <div style="margin-top: auto; display: flex; width: 100%; align-items: center; justify-content: space-between; border-top: 1px solid {border_color}; padding-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 6.8pt; color: {text_color};">
        <div>Treetino corp s.r.o. &bull; Prague, Czech Republic &bull; www.treetino.eu</div>
        <div>Confidential Series A Diligence Dossier</div>
        <div>{page_num:02d} / {total_pages:02d}</div>
    </div>
    """

GLOBAL_CSS = """
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body, html {
  margin: 0;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  color: #09090b;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
}

@page {
  size: 297mm 210mm;
  margin: 0;
}

.page-container {
  width: 297mm;
  height: 210mm;
  page-break-after: always;
  page-break-inside: avoid;
  position: relative;
  padding: 11mm 16mm 9mm 16mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: #ffffff;
}

.page-dark {
  background-color: #050507 !important;
  color: #ffffff !important;
}

/* Sharp architectural elements matching Treetino site */
.sharp-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border-radius: 0 !important;
}

.sharp-card-soft {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafaf9;
  border-radius: 0 !important;
}

.sharp-accent-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid #18181b;
  background: #ffffff;
  border-radius: 0 !important;
}

.signature-accent-frame {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #000000;
  border-radius: 0 !important;
}

.web-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7.2pt;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #52525b;
  display: inline-block;
  margin-bottom: 2px;
}

.web-h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 20pt;
  font-weight: 600;
  line-height: 1.15;
  color: #09090b;
  letter-spacing: -0.02em;
  margin: 0 0 3px 0;
}

.web-lead {
  font-size: 8.6pt;
  color: rgba(9, 9, 11, 0.7);
  line-height: 1.4;
  margin: 0 0 10px 0;
}
"""

def generate_financial_chart_svg():
    rev = [0, 4, 60, 235, 20, 20, 60, 20, 80, 20, 80, 235, 20, 80, 40, 100, 40, 275, 40, 100, 40, 275, 40, 335]
    
    svg_w, svg_h = 510, 105
    max_val = 360 # k EUR/USD
    pad_left = 38
    pad_bottom = 18
    plot_w = svg_w - pad_left - 10
    plot_h = svg_h - pad_bottom - 10
    bar_w = plot_w / 24
    
    elements = []
    # Grid lines
    for val in [100, 200, 300]:
        y = 8 + plot_h - (val / max_val) * plot_h
        elements.append(f"""<line x1="{pad_left}" y1="{y:.1f}" x2="{svg_w-10}" y2="{y:.1f}" stroke="rgba(0,0,0,0.06)" stroke-width="1" />
        <text x="{pad_left-5}" y="{y+3:.1f}" font-family="JetBrains Mono" font-size="6.2" fill="#71717a" text-anchor="end">${val}k</text>""")
    
    # Baseline
    base_y = 8 + plot_h
    elements.append(f"""<line x1="{pad_left}" y1="{base_y:.1f}" x2="{svg_w-10}" y2="{base_y:.1f}" stroke="rgba(0,0,0,0.15)" stroke-width="1" />""")
    
    # Delivery milestone bars (High contrast monochrome: #18181b for major deliveries, #a1a1aa for normal)
    for i in range(24):
        x = pad_left + i * bar_w
        r_h = (rev[i] / max_val) * plot_h
        y = base_y - r_h
        is_tree_deliv = rev[i] >= 200
        fill_color = "#18181b" if is_tree_deliv else "#a1a1aa"
        elements.append(f"""<rect x="{x+1.5:.1f}" y="{y:.1f}" width="{bar_w-3:.1f}" height="{r_h:.1f}" fill="{fill_color}" />""")
        if is_tree_deliv:
            elements.append(f"""<text x="{x+bar_w/2:.1f}" y="{y-3:.1f}" font-family="JetBrains Mono" font-size="5.8" font-weight="700" fill="#18181b" text-anchor="middle">${rev[i]}k</text>""")

    # Month labels
    for m in [1, 3, 6, 9, 12, 15, 18, 21, 24]:
        x = pad_left + (m-1) * bar_w + bar_w/2
        elements.append(f"""<text x="{x:.1f}" y="{svg_h-3}" font-family="JetBrains Mono" font-size="6.2" fill="#71717a" text-anchor="middle">M{m}</text>""")
        
    return f"""<svg width="100%" height="{svg_h}" viewBox="0 0 {svg_w} {svg_h}" xmlns="http://www.w3.org/2000/svg" style="display: block;">
        {"".join(elements)}
    </svg>"""

def build_pages():
    pages = []
    TOTAL_PAGES = 16

    # =========================================================================
    # PAGE 1: HERO COVER (Clean, Cinematic Dark Cover - STRICT MONOCHROME)
    # =========================================================================
    pages.append(f"""<div class="page-container page-dark" id="page-1" style="background-color: #050507;">
        <div style="position: absolute; inset: 0; pointer-events: none; z-index: 1;">
            <img src="{img_uri('img/hero-v1-cinematic.png')}" style="position: absolute; right: 0; top: 0; height: 100%; width: 72%; object-fit: cover; object-position: 55% 45%;" alt="Treetino Tree V1 Hero" />
            <div style="position: absolute; inset: 0; background: linear-gradient(90deg, #050507 42%, rgba(5,5,7,0.85) 60%, rgba(5,5,7,0.2) 80%, transparent 100%);"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 160px; background: linear-gradient(to top, #050507, transparent);"></div>
        </div>

        <div style="position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
            {doc_header("SERIES A & STRATEGIC CAPITAL", dark=True)}

            <div style="margin-top: auto; margin-bottom: 24px; max-width: 650px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.65); padding: 4px 12px; margin-bottom: 12px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; font-weight: 700; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">CONFIDENTIAL INVESTMENT MEMORANDUM &bull; 2026</span>
                </div>

                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 54pt; font-weight: 500; line-height: 1.0; letter-spacing: -0.03em; color: #ffffff; margin: 0 0 2px 0;">
                    Treetino Tree v1
                </h1>

                <div style="font-size: 13pt; letter-spacing: 8px; text-transform: uppercase; color: rgba(255,255,255,0.7); font-weight: 400; margin-bottom: 14px;">
                    FOR COMPANIES AND CITIES
                </div>

                <p style="font-size: 9.6pt; color: rgba(255,255,255,0.85); line-height: 1.5; max-width: 580px; margin-bottom: 20px;">
                    Delivering <strong style="color: #fff;">49.8 kW Peak Renewable Yield</strong> on an ultra-compact <strong style="color: #fff;">1.2 m² ground footprint</strong> through patented ducted wind turbines and heliotropic AI solar foliage.
                </p>

                <!-- 3 Sharp Diligence Anchor Badges (Monochrome Dark) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 580px;">
                    <div style="border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.6); padding: 8px 12px;">
                        <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #a1a1aa; font-weight: 700; text-transform: uppercase;">ANCHOR 1 &bull; COMMERCIAL</div>
                        <div style="font-size: 10pt; font-weight: 700; color: #fff; margin-top: 2px;">€705k Contract</div>
                        <div style="font-size: 6.5pt; color: rgba(255,255,255,0.6); margin-top: 2px;">MKovo s.r.o. (3x Tree V1)</div>
                    </div>
                    <div style="border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.6); padding: 8px 12px;">
                        <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #a1a1aa; font-weight: 700; text-transform: uppercase;">ANCHOR 2 &bull; DEPLOYMENT</div>
                        <div style="font-size: 10pt; font-weight: 700; color: #fff; margin-top: 2px;">Prague V2 Site</div>
                        <div style="font-size: 6.5pt; color: rgba(255,255,255,0.6); margin-top: 2px;">Active Field Construction</div>
                    </div>
                    <div style="border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.6); padding: 8px 12px;">
                        <div style="font-size: 6.8pt; font-family: 'JetBrains Mono'; color: #a1a1aa; font-weight: 700; text-transform: uppercase;">ANCHOR 3 &bull; CAPITAL</div>
                        <div style="font-size: 10pt; font-weight: 700; color: #fff; margin-top: 2px;">€10.0M Bond Offer</div>
                        <div style="font-size: 6.5pt; color: rgba(255,255,255,0.6); margin-top: 2px;">Tomes & Partners Offer</div>
                    </div>
                </div>
            </div>

            {doc_footer(1, TOTAL_PAGES, dark=True)}
        </div>
    </div>""")

    # =========================================================================
    # PAGE 2: EXECUTIVE SUMMARY & CORE INVESTMENT THESIS
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-2">
        {doc_header("01 / EXECUTIVE SUMMARY", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">INVESTMENT THESIS & CORE TRACTION</span>
                <h2 class="web-h1">Executive Summary: De-risked Infrastructure Scale-Up</h2>
                <p class="web-lead">Treetino eliminates urban land bottlenecks by replacing 300 m² of horizontal rooftop solar with an iconic 12m vertical micro-power plant delivering 49.8 kW peak renewable yield on a 1.2 m² ground base.</p>
            </div>

            <!-- 3 Sharp Foundational Anchor Cards (Monochrome Architectural Border) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2px;">
                <div class="sharp-accent-card" style="padding: 13px 15px;">
                    <div style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                        ANCHOR 1 &bull; COMMERCIAL BUYER ARCHETYPE
                    </div>
                    <div style="font-size: 13.5pt; font-weight: 700; color: #09090b; margin-top: 3px;">€705,000 Contract</div>
                    <div style="font-size: 7.8pt; font-weight: 600; color: #52525b; margin-top: 1px;">Binding Agreement: 3x Tree V1 Units</div>
                    <p style="font-size: 7.5pt; color: #71717a; line-height: 1.45; margin-top: 6px;">
                        Signed conditional purchase agreement with industrial manufacturer <strong>MKovo s.r.o.</strong> (€235k/unit). MKovo is the textbook archetype of our customer: all factory roofs are full of solar panels and all car parks are covered with carports, yet their heavy energy demand requires significantly more on-site production. Treetino's vertical Tree V1 is their sole option.
                    </p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #18181b; font-weight: 700;">
                        Status: Binding Agreement & Scheduled Early 2027 Delivery
                    </div>
                </div>

                <div class="sharp-accent-card" style="padding: 13px 15px;">
                    <div style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                        ANCHOR 2 &bull; DEPLOYMENT & TOOLING
                    </div>
                    <div style="font-size: 13.5pt; font-weight: 700; color: #09090b; margin-top: 3px;">Prague V2 Site Active</div>
                    <div style="font-size: 7.8pt; font-weight: 600; color: #52525b; margin-top: 1px;">High School Construction & 3D Tooling</div>
                    <p style="font-size: 7.5pt; color: #71717a; line-height: 1.45; margin-top: 6px;">
                        Foundation work underway at a premier Prague high school campus. Meteorological anemometer mast actively logging live wind data. In-house large-format 3D printer printing structural components.
                    </p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #18181b; font-weight: 700;">
                        Status: 130 Custom PV Leaves Staged in Facility Storage
                    </div>
                </div>

                <div class="sharp-accent-card" style="padding: 13px 15px;">
                    <div style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                        ANCHOR 3 &bull; INSTITUTIONAL CAPITAL
                    </div>
                    <div style="font-size: 13.5pt; font-weight: 700; color: #09090b; margin-top: 3px;">€10.0M Bond Offer</div>
                    <div style="font-size: 7.8pt; font-weight: 600; color: #52525b; margin-top: 1px;">Underwriting Commitment: Tomes & Partners</div>
                    <p style="font-size: 7.5pt; color: #71717a; line-height: 1.45; margin-top: 6px;">
                        Formal advisory commitment letter from financial group Tomes & Partners to underwrite a €10,000,000 EUR bond auction raise in 2027 to finance large-scale factory series manufacturing lines and working capital.
                    </p>
                    <div style="margin-top: 8px; font-family: 'JetBrains Mono'; font-size: 7pt; color: #18181b; font-weight: 700;">
                        Status: Formal Institutional Underwriting Commitment Issued
                    </div>
                </div>
            </div>

            <!-- Lower Section: Blended Finance & Harmonized Metrics -->
            <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 14px; margin-top: 10px;">
                <div class="sharp-card" style="padding: 12px 15px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">FINANCIAL & GRANT ARCHITECTURE</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px; margin-bottom: 6px;">Blended Financing & Non-Dilutive Leverage</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 10px;">
                        <div class="sharp-card-soft" style="padding: 9px 11px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a;">CZECHINVEST GRANT (CLOSED)</div>
                            <div style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">€200,000 (5M CZK)</div>
                            <div style="font-size: 7.1pt; color: #71717a; margin-top: 3px; line-height: 1.35;">Completed & audited. Supported proof-of-concept R&D, CAD modeling, and initial aerodynamic validation with zero equity dilution.</div>
                        </div>
                        <div class="sharp-card-soft" style="padding: 9px 11px; border-left: 2px solid #18181b;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #18181b; font-weight: 700;">EIC BLENDED ACCELERATOR</span>
                                <span style="font-family: 'JetBrains Mono'; font-size: 6pt; background: #f4f4f5; color: #18181b; border: 1px solid #e4e4e7; font-weight: 700; padding: 1px 4px;">2/4 VOTES SECURED</span>
                            </div>
                            <div style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">€2,500,000 Total</div>
                            <div style="font-size: 7.1pt; color: #52525b; margin-top: 3px; line-height: 1.35;">
                                <strong>2 of 4 jury consensus votes secured (3 needed for approval)</strong>. €1.5M non-dilutive grant (70% EU co-funding for ISO 61400 turbine cert & CE marking) + €1.0M direct equity co-investment.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sharp-card-soft" style="padding: 12px 15px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">HARMONIZED PLATFORM METRICS</span>
                    <div style="margin-top: 5px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 2px;">
                            <span style="color: #71717a;">Combined Rated Peak Output</span>
                            <strong style="color: #09090b;">45.0 – 49.8 kW Peak</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 2px;">
                            <span style="color: #71717a;">Ground Base Footprint</span>
                            <strong style="color: #09090b;">1.2 m² (vs 300 m² Rooftop)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 2px;">
                            <span style="color: #71717a;">TRL 5 Test Generation Record</span>
                            <strong style="color: #09090b;">24,180 kWh (180 Days)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 2px;">
                            <span style="color: #71717a;">AI Heliotropic Tracking Gain</span>
                            <strong style="color: #09090b;">+28.4% Net Yield</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 2px;">
                            <span style="color: #71717a;">Acoustic Emissions</span>
                            <strong style="color: #09090b;">&lt; 34.2 dB(A) @ 10 m (Permit-Free)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 7.6pt;">
                            <span style="color: #71717a;">Simple Payback (w/ 40% Grant)</span>
                            <strong style="color: #09090b;">7.7 Years (13.2% IRR)</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(2, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 3: THE URBAN RENEWABLE PARADOX & THE TREETINO BREAKTHROUGH
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-3">
        {doc_header("02 / THE MARKET PROBLEM", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">STRUCTURAL CONSTRAINTS IN URBAN DECARBONIZATION</span>
                <h2 class="web-h1">The Urban Renewable Paradox: Why Existing Clean Tech Fails</h2>
                <p class="web-lead">European commercial facilities face severe land scarcity, strict aesthetic regulations, and overwhelmed utility grid infrastructure preventing clean energy adoption.</p>
            </div>

            <!-- 3 Structural Market Limits (Sharp Cards) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b;">LIMIT 01</span>
                        <h3 style="font-size: 10pt; font-weight: 700; color: #09090b; margin: 0;">Rooftop Solar Limits</h3>
                    </div>
                    <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin: 0;">
                        Requires <strong>~300 m² of horizontal rooftop</strong> for 45 kW peak. Industrial roofs are obstructed by HVAC, smoke vents, skylights, and low load-bearing limits. Capacity factors are capped at 12–15% due to zero night generation and severe seasonal winter drops.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b;">LIMIT 02</span>
                        <h3 style="font-size: 10pt; font-weight: 700; color: #09090b; margin: 0;">Conventional Wind Prohibited</h3>
                    </div>
                    <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin: 0;">
                        Standard wind turbines generate low-frequency noise (&gt;45 dB) and strobe shadow flicker. Strict European urban permitting bans conventional turbines near offices, schools, and homes. Horizontal turbines stall in turbulent, omnidirectional urban micro-climates.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b;">LIMIT 03</span>
                        <h3 style="font-size: 10pt; font-weight: 700; color: #09090b; margin: 0;">Transformer Bottlenecks</h3>
                    </div>
                    <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin: 0;">
                        Distribution system operators (DSOs) reject commercial grid upgrades due to substation capacity saturation. Commercial buyers face 18–36 month delays and massive capital expenses (often 4x the plant cost) simply to upgrade local grid interconnects.
                    </p>
                </div>
            </div>

            <!-- The Solution: Treetino Vertical Biomimetic Node -->
            <div class="sharp-card-soft" style="padding: 14px 18px; margin-top: 10px; border-left: 3px solid #18181b;">
                <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">THE BREAKTHROUGH SOLUTION</span>
                <h3 style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Treetino: Vertical Biomimetic Clean Microgrid Architecture</h3>
                <p style="font-size: 7.8pt; color: #52525b; line-height: 1.45; margin-top: 4px;">
                    By decoupling generation from horizontal land footprint and integrating dual-modality harvesting (vertical-axis wind + heliotropic solar foliage) into a certified low-noise architectural structure, Treetino unlocks continuous behind-the-meter generation directly where energy is consumed.
                </p>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 8px;">
                    <div>
                        <strong style="font-size: 8pt; color: #09090b;">300x Spatial Compression:</strong>
                        <div style="font-size: 7.2pt; color: #71717a; margin-top: 2px;">49.8 kW peak generation concentrated onto just 1.2 m² of ground space.</div>
                    </div>
                    <div>
                        <strong style="font-size: 8pt; color: #09090b;">24/7 Complementary Output:</strong>
                        <div style="font-size: 7.2pt; color: #71717a; margin-top: 2px;">Solar peaks at midday; vertical wind turbines harvest evening gusts and winter storms.</div>
                    </div>
                    <div>
                        <strong style="font-size: 8pt; color: #09090b;">Permit-Free Urban Deployment:</strong>
                        <div style="font-size: 7.2pt; color: #71717a; margin-top: 2px;">Silent (&lt;34 dB), bird-safe, and aesthetic under European municipal zoning thresholds.</div>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(3, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 4: CZECH R&D & HIGH-TECH PRODUCTION
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-4">
        {doc_header("03 / CORE ARCHITECTURE", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">CZECH R&D AND HIGH-TECH PRODUCTION</span>
                <h2 class="web-h1">Engineered for Extreme Environments & Maximum Yield</h2>
                <p class="web-lead">Developed in Prague in collaboration with elite Czech academic institutions, combining biomimetic statics with certified aerospace-grade composites.</p>
            </div>

            <!-- 4-Column Metric Strip with Sharp Left Borders -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 2px 0 10px 0;">
                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 14px;">
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24pt; font-weight: 600; color: #09090b; line-height: 1.0;">12 m</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 3px;">Optimized Height</div>
                    <p style="font-size: 7.3pt; color: #71717a; line-height: 1.35; margin-top: 3px;">Captures higher laminar wind speeds in urban and industrial zones.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 14px;">
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24pt; font-weight: 600; color: #09090b; line-height: 1.0;">49.8 kW</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 3px;">Combined Peak</div>
                    <p style="font-size: 7.3pt; color: #71717a; line-height: 1.35; margin-top: 3px;">36 kW ducted wind turbines paired with 13.8 kW TopCon solar foliage.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 14px;">
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24pt; font-weight: 600; color: #09090b; line-height: 1.0;">1.2 m²</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 3px;">Ground Footprint</div>
                    <p style="font-size: 7.3pt; color: #71717a; line-height: 1.35; margin-top: 3px;">Compact base anchors easily in parking lots, courtyards, and plazas.</p>
                </div>

                <div style="border-left: 1px solid rgba(0,0,0,0.15); padding-left: 14px;">
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24pt; font-weight: 600; color: #09090b; line-height: 1.0;">144 km/h</div>
                    <div style="font-size: 8pt; font-weight: 600; color: #52525b; margin-top: 3px;">Gale Resistance</div>
                    <p style="font-size: 7.3pt; color: #71717a; line-height: 1.35; margin-top: 3px;">Autonomous storm defense rotates branches to aerodynamic stow profile.</p>
                </div>
            </div>

            <!-- Daylight Showcase Card matching V1.vue Feature Card (Clean Image, Zero Overlays) -->
            <div class="sharp-card" style="overflow: hidden; display: grid; grid-template-columns: 1.2fr 1fr; height: 260px;">
                <div style="position: relative; background: #000; overflow: hidden;">
                    <img src="{img_uri('img/stills/Still_Strom-v1.png')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Engineering" />
                </div>
                <div style="padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; background: #fafaf9;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7.2pt; font-weight: 700; color: #52525b; text-transform: uppercase;">AEROSPACE COMPOSITES & BIOMIMICRY</span>
                        <h3 style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Aerodynamic Venturi Shrouds & Heliotropic AI</h3>
                        <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                            The patented Venturi duct geometry accelerates omnidirectional urban breeze by up to 2.4x into internal vertical turbines. Microprocessor-controlled servomotors track the sun's trajectory continuously, preventing self-shading across the 300 photovoltaic leaves.
                        </p>
                    </div>
                    <div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
                            <div class="sharp-card" style="padding: 5px 8px; font-family: 'JetBrains Mono'; font-size: 6.8pt;">
                                <strong>FZU PV Lab Validated:</strong> 20.2% TopCon efficiency
                            </div>
                            <div class="sharp-card" style="padding: 5px 8px; font-family: 'JetBrains Mono'; font-size: 6.8pt;">
                                <strong>CTU Wind Tunnel Tested:</strong> 1.8 m/s start threshold
                            </div>
                            <div class="sharp-card" style="padding: 5px 8px; font-family: 'JetBrains Mono'; font-size: 6.8pt;">
                                <strong>Eurocode 3 Compliant:</strong> Extreme wind statics
                            </div>
                            <div class="sharp-card" style="padding: 5px 8px; font-family: 'JetBrains Mono'; font-size: 6.8pt;">
                                <strong>15-Year Warranty:</strong> Heavy steel skeleton
                            </div>
                        </div>
                        <div style="border-top: 1px solid rgba(0,0,0,0.08); padding-top: 6px; font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a;">
                            &bull; Co-developed with Czech Technical University (CTU) & Institute of Physics (FZU)
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(4, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 5: SIGNATURE FEATURE SHOWCASE & FULL HW ARCHITECTURE (zadávací dokumentace)
    # (Clean photo with ZERO overlays, prominent display, and full HW breakdown)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-5">
        {doc_header("04 / HYBRID TECHNOLOGY & HARDWARE ARCHITECTURE", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">INTELLIGENT ENERGY GENERATION & HARDWARE SUBSYSTEMS</span>
                <h2 class="web-h1">AI Heliotropic Optimization & Complete Embedded HW Stack</h2>
                <p class="web-lead">Continuous 24/7 power generation combining bi-directional solar tracking with whisper-silent vertical wind turbines, driven by our unified industrial hardware specification (zadávací dokumentace).</p>
            </div>

            <!-- Top Row: Clean Unobstructed Photo + Core Functional Systems -->
            <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 16px; margin: 2px 0 10px 0;">
                <!-- Clean Unobstructed Visual Frame - ZERO TEXT OVERLAYS -->
                <div style="height: 225px; overflow: hidden; background: #000; border: 1px solid rgba(0,0,0,0.12);">
                    <img src="{img_uri('img/info/night-detail-w.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Solar Foliage & Turbine" />
                </div>

                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">24/7 DUAL HARVESTING</span>
                        <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Hybrid Solar & Wind Synchronization</h3>
                        <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin: 0;">
                            Solar foliage reaches peak output during bright midday hours, while ducted vertical-axis wind turbines capture turbulent afternoon, night, and winter air currents—delivering a steady, continuous baseload microgrid supply.
                        </p>
                    </div>

                    <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">TREEAPP TELEMETRY</span>
                        <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Autonomous Heliotropic Folia & Self-Cleaning</h3>
                        <p style="font-size: 7.7pt; color: #52525b; line-height: 1.45; margin: 0;">
                            German precision servomotors dynamically align PV leaves toward optimal solar irradiance (+28.4% annual energy increase). Integrated precipitation sensors trigger automatic wash cycles to eliminate particulate fouling.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Complete Hardware Architecture Grid (Direct from zadávací dokumentace) -->
            <div class="sharp-card" style="padding: 12px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                        PHYSICAL HARDWARE SUBSYSTEMS &bull; TECHNICAL SPECIFICATION (ZADÁVACÍ DOKUMENTACE)
                    </span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 6px;">
                        COMPLETE HW SPECIFICATION
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <div class="sharp-card-soft" style="padding: 9px 11px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b;">01 &bull; EMBEDDED MCU</span>
                        <div style="font-size: 8.8pt; font-weight: 700; color: #09090b; margin-top: 2px;">Dual STM32/ESP32 Hub</div>
                        <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 3px;">
                            Industrial automotive-grade microcontrollers running real-time sensor fusion, motor closed loops, and isolated safety watchdogs.
                        </p>
                    </div>
                    <div class="sharp-card-soft" style="padding: 9px 11px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b;">02 &bull; POWER INVERTERS</span>
                        <div style="font-size: 8.8pt; font-weight: 700; color: #09090b; margin-top: 2px;">96.4% Victron Integration</div>
                        <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 3px;">
                            Unified DC bus unifies solar foliage and turbine outputs directly into Victron MultiPlus & SmartSolar architecture without dual conversion loss.
                        </p>
                    </div>
                    <div class="sharp-card-soft" style="padding: 9px 11px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b;">03 &bull; SERVOMOTORS & BMS</span>
                        <div style="font-size: 8.8pt; font-weight: 700; color: #09090b; margin-top: 2px;">German Sun-Track Servos</div>
                        <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 3px;">
                            Micro-stepping precision actuators for 2-axis sun orientation; automatic high-wind stow position at &gt;25 m/s storm gusts with LiFePO4 BMS.
                        </p>
                    </div>
                    <div class="sharp-card-soft" style="padding: 9px 11px;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b;">04 &bull; SENSORS & WALLBOX</span>
                        <div style="font-size: 8.8pt; font-weight: 700; color: #09090b; margin-top: 2px;">Anemometer & Fast EV Hub</div>
                        <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 3px;">
                            Calibrated ultrasonic anemometer, rain and bearing vibration sensors paired with turnkey integrated 22 kW / 50 kW fleet EV wallbox.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(5, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 6: DEDICATED PRODUCT 01 - TREE V1 FLAGSHIP (49.8 kW)
    # (Clean photo with ZERO overlays, prominent display, sharp typography)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-6">
        {doc_header("05 / PRODUCT SHOWCASE: TREE V1", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">COMMERCIAL & INDUSTRIAL HYBRID MICROGRID FLAGSHIP</span>
                <h2 class="web-h1">Treetino Tree V1: 49.8 kW Peak Yield on 1.2 m² Base</h2>
                <p class="web-lead">The world's most powerful vertical hybrid clean energy plant, combining 13.8 kWp solar and 36 kW wind for corporate HQs, industrial parks, and EV supercharging hubs.</p>
            </div>

            <!-- Top Row: Hero Imagery + Commercial Pillars (Zero Overlays on Image) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin: 2px 0 10px 0;">
                <!-- Clean Unobstructed Image Frame -->
                <div style="height: 230px; overflow: hidden; background: #000; border: 1px solid rgba(0,0,0,0.12);">
                    <img src="{img_uri('img/stills/LG-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Tree V1" />
                </div>

                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">INDUSTRIAL ENERGY DENSITY</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">Replaces 300 m² of Fragile Rooftop Solar</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Concentrates massive power density vertically, capturing laminar airflow at 12m height while freeing valuable ground space for logistics and vehicle parking.
                        </p>
                    </div>

                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">INTEGRATED DUAL EV FAST-CHARGING</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">Direct DC Bus Fleet Charging Hub</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Surplus daytime solar and nighttime wind power flow directly into integrated 22 kW / 50 kW vehicle wallboxes without exceeding substation capacity limits.
                        </p>
                    </div>

                    <!-- Commercial Pricing & Economics Strip -->
                    <div class="sharp-card-soft" style="padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono'; font-size: 7pt;">
                        <span>Turnkey: <strong style="color: #09090b;">€235,000</strong> &bull; Margin: <strong style="color: #09090b;">€95,000 (40.4%)</strong></span>
                        <span style="color: #71717a;">Lead Time: <strong>2 Months</strong></span>
                    </div>
                </div>
            </div>

            <!-- Bottom: Comprehensive Engineering Datasheet Table -->
            <div class="sharp-card" style="padding: 12px 16px;">
                <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                    OFFICIAL ENGINEERING PARAMETERS & DATASHEET: TREETINO TREE V1
                </span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 7.5pt; margin-top: 6px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Total Tree Height</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">11.5 meters</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Base Ground Footprint</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.2 m² (1.0 m trunk diameter)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Canopy Crown Projection</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">7.2 m diameter (12 m² shadow)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Wind Turbine Array</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">12× 48V Ducted Savonius-Darrieus</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rated Wind Yield</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">36.0 kW rated wind capacity</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Cut-In / Gale Threshold</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.8 m/s start &bull; 144 km/h auto-stow</td>
                        </tr>
                    </table>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Photovoltaic Foliage</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">300× TopCon N-type cells (20.2%)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rated Solar Peak Yield</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">13.8 kWp rated DC solar yield</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Combined Total Output</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">49.8 kW Peak (350–450 kWh/day)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">DC Bus Operating Voltage</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1000 / 1500 V DC unified bus</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Acoustic Emissions</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">&lt; 34.2 dB(A) @ 10 m (Permit-Free)</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Compliance & Warranties</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">ČSN EN 50549-1, CE; 15-Yr skeleton, 25-Yr PV</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        {doc_footer(6, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 7: DEDICATED PRODUCT 02 - TREE V2 URBAN COMPACT (12–15 kW)
    # (Clean photo with ZERO overlays, prominent display, sharp typography)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-7">
        {doc_header("06 / PRODUCT SHOWCASE: TREE V2", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">URBAN COMPACT, MUNICIPAL & EDUCATIONAL POWER NODE</span>
                <h2 class="web-h1">Treetino Tree V2: 12 – 15 kW Permit-Free Microgrid</h2>
                <p class="web-lead">Engineered specifically for schools, hospital grounds, municipal plazas, and private commercial gardens under 5.5m height with zero building permits needed.</p>
            </div>

            <!-- Top Row: Hero Imagery + Commercial Value Pillars (Zero Overlays on Image) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin: 2px 0 10px 0;">
                <!-- Clean Unobstructed Image Frame -->
                <div style="height: 230px; overflow: hidden; background: #000; border: 1px solid rgba(0,0,0,0.12);">
                    <img src="{img_uri('img/stills/SM-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Tree V2" />
                </div>

                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">PERMIT-FREE MUNICIPAL ZONING</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">Sub-5.5m Height Bypasses Zoning Friction</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Designed under Czech and European building thresholds (under 5.5 m), eliminating lengthy municipal planning inquiries. Replaces up to 140 m² of traditional rooftop panels.
                        </p>
                    </div>

                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">ACTIVE FIELD VALIDATION</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">Prague High School Campus Deployment</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Currently under active site construction in Prague with continuous anemometer telemetry logging. 130 TopCon PV leaves secured in facility inventory.
                        </p>
                    </div>

                    <!-- Commercial Pricing & Economics Strip -->
                    <div class="sharp-card-soft" style="padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono'; font-size: 7pt;">
                        <span>Turnkey: <strong style="color: #09090b;">€60,000</strong> &bull; Margin: <strong style="color: #09090b;">€15,000 (25.0%)</strong></span>
                        <span style="color: #71717a;">Assembly: <strong>1 Day on Site</strong></span>
                    </div>
                </div>
            </div>

            <!-- Bottom: Comprehensive Engineering Datasheet Table -->
            <div class="sharp-card" style="padding: 12px 16px;">
                <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                    OFFICIAL ENGINEERING PARAMETERS & DATASHEET: TREETINO TREE V2
                </span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 7.5pt; margin-top: 6px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Total Tree Height</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">5.2 meters (Sub-5.5m permit-free)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Base Lawn Footprint</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.0 m² base (replaces 140 m² roof)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Crown Spread Diameter</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">4.5 meters (natural architectural canopy)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Wind Turbine Kit</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">6× Silent Vertical-Axis Turbines (6 kW)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Daily Energy Output</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">110 – 135 kWh / day (with wind kit)</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Wind Cut-In / Survival</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.8 m/s start &bull; 120 km/h wind defense</td>
                        </tr>
                    </table>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Photovoltaic Foliage</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">124 – 130× Monocrystalline TopCon leaves</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rated Solar Peak Yield</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">5.61 – 6.0 kWp rated DC yield</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Combined Total Output</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">12.0 – 15.0 kW Peak (Hybrid)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Inverter & Energy Center</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">Victron Energy controller & battery link</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Acoustic Emissions</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">&lt; 30.0 dB(A) @ 10 m (Whisper Silent)</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Delivery & Warranties</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1-mo delivery; 15-Yr skeleton, 25-Yr PV</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        {doc_footer(7, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 8: DEDICATED PRODUCT 03 - AERODYNAMIC WIND TURBINE T1 (1–3 kW)
    # (Clean photo with ZERO overlays, prominent display, sharp typography)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-8">
        {doc_header("07 / PRODUCT SHOWCASE: WIND TURBINE T1", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">STANDALONE MODULAR VERTICAL-AXIS WIND TURBINE</span>
                <h2 class="web-h1">Treetino Aerodynamic Wind Turbine: 1 – 3 kW Modular VAWT</h2>
                <p class="web-lead">Bird-safe, whisper-silent vertical turbine featuring patented transparent Venturi ducting for rapid deployment on parapets, rooftops, and light masts.</p>
            </div>

            <!-- Top Row: Hero Imagery + Commercial Pillars (Zero Overlays on Image) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin: 2px 0 10px 0;">
                <!-- Clean Unobstructed Image Frame -->
                <div style="height: 230px; overflow: hidden; background: #000; border: 1px solid rgba(0,0,0,0.12);">
                    <img src="{img_uri('img/stills/T-still.webp')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Treetino Aerodynamic Wind Turbine" />
                </div>

                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">PATENTED VENTURI STATOR DUCT</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">2.4x Airflow Acceleration Mechanics</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Patented teardrop casing accelerates turbulent ambient breeze directly into internal Savonius-Darrieus blades, generating power at just 1.8 m/s breeze.
                        </p>
                    </div>

                    <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">BIRD-SAFE & UNIVERSAL MOUNTING</span>
                        <div style="font-size: 9.5pt; font-weight: 700; color: #09090b;">Zero Shadow Strobe & Zero Wildlife Hazard</div>
                        <p style="font-size: 7.4pt; color: #52525b; line-height: 1.35; margin: 2px 0 0 0;">
                            Continuous enclosed transparent profile eliminates hazard to birds and strobing flicker. 3 modular mountings: 5m mast, building wall, or rooftop parapet.
                        </p>
                    </div>

                    <!-- Commercial Pricing & Economics Strip -->
                    <div class="sharp-card-soft" style="padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono'; font-size: 7pt;">
                        <span>Turnkey: <strong style="color: #09090b;">€4,000</strong> &bull; Margin: <strong style="color: #09090b;">€1,500 (37.5%)</strong></span>
                        <span style="color: #71717a;">Design Life: <strong>20 Years</strong></span>
                    </div>
                </div>
            </div>

            <!-- Bottom: Comprehensive Engineering Datasheet Table -->
            <div class="sharp-card" style="padding: 12px 16px;">
                <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                    OFFICIAL ENGINEERING PARAMETERS & DATASHEET: TREETINO AERODYNAMIC WIND TURBINE T1
                </span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 7.5pt; margin-top: 6px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rotor Height & Diameter</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">2.2 – 2.8 m height / 1.2 – 1.4 m rotor</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Aerodynamic Duct Material</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">UV-stabilized clear polycarbonate</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rotor Topology</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">Omnidirectional hybrid Savonius-Darrieus</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Cut-In Wind Speed</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.8 m/s gentle breeze startup</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rated Wind Velocity</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">12.5 m/s (21% aerodynamic efficiency)</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Survival Wind Velocity</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">45.0 m/s (162 km/h extreme gale)</td>
                        </tr>
                    </table>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Rated Power Output</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">1.0 kW (Small) / 2.0 kW / 3.0 kW (Large)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Daily Generation Profile</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">4 kWh (1 kW) &bull; 8 kWh (2 kW) &bull; 12 kWh (3 kW)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Generator Topology</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">Direct-drive permanent magnet (PMSG)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Grid Link / System Bus</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">48V DC bus / 230V AC grid-tied microinverter</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <td style="padding: 3px 0; color: #71717a;">Acoustic Emissions</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">&lt; 32.0 dB(A) @ 5 m (Whisper Silent)</td>
                        </tr>
                        <tr>
                            <td style="padding: 3px 0; color: #71717a;">Mounting Configurations</td>
                            <td style="padding: 3px 0; font-weight: 700; text-align: right; color: #09090b;">Standalone 5m pole, building facade, or roof</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        {doc_footer(8, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 9: IN-HOUSE MANUFACTURING & ACTIVE FIELD DEPLOYMENTS
    # (Large, prominent imagery, zero excessive whitespace, MKovo buyer archetype)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-9">
        {doc_header("08 / MANUFACTURING & TOOLING", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">IN-HOUSE TOOLING & INDUSTRIAL SCALE-UP</span>
                <h2 class="web-h1">Scaling Production: Industrial 3D Tooling & Live Deployments</h2>
                <p class="web-lead">Overcoming hardware lead-time bottlenecks with in-house large-format additive manufacturing, precision steel fabrication partnerships, and live customer test sites.</p>
            </div>

            <!-- 3 Prominent Pillar Cards with Large Authentic Photos (height: 255px) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2px;">
                <!-- 3D Printer Card -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 255px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/im/industrial-3d-printer-production.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="In-House 3D Printer" />
                    </div>
                    <div style="padding: 13px 15px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.08);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">IN-HOUSE TOOLING &bull; OPERATIONAL</span>
                            <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Massive Industrial 3D Printer</h3>
                            <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                                Acquired large-format industrial 3D printing setup to produce complex aerodynamic turbine shrouds and structural leaf frames in-house.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Tooling cycle: <strong>16 weeks &rarr; 48 hours</strong>.<br/>
                            Slashes NRE prototype costs by <strong>85%</strong>.<br/>
                            Printing branches for first 2 V2 trees.
                        </div>
                    </div>
                </div>

                <!-- Prague High School V2 Site Card (Anchor 2) -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 255px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/im/prague-high-school-v2-site.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Prague High School V2 Site" />
                    </div>
                    <div style="padding: 13px 15px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.08);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">ACTIVE FIELD SITE &bull; TELEMETRY</span>
                            <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Prague High School V2 Site</h3>
                            <p style="font-size: 7.6pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                                Construction initiated at a prestigious Prague high school. Ground cleared and equipped with dedicated meteorological measurement mast.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Anemometer actively logging wind telemetry.<br/>
                            <strong>130 TopCon PV leaves ready in storage</strong>.<br/>
                            Municipal showcase for zero-noise energy.
                        </div>
                    </div>
                </div>

                <!-- Flagship Buyer Case Study: MKovo s.r.o. (Real site photo with anemometer mast) -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 255px; overflow: hidden; position: relative; background: #27272a;">
                        <img src="{img_uri('img/im/mkovo-site-measurement.jpg')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 30%;" alt="MKovo Site Telemetry" />
                    </div>
                    <div style="padding: 13px 15px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.08);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">FLAGSHIP BUYER CASE STUDY &bull; €705,000</span>
                            <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">MKovo Industrial Buyer Archetype</h3>
                            <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                                MKovo perfectly illustrates our core customer problem: their factory roofs are 100% full of solar panels and their parking lots are covered with carports—yet their CNC operations still face acute energy deficits.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px;">
                            Zero horizontal expansion room left.<br/>
                            Tree V1 is the sole physical on-site solution.<br/>
                            Contract: <strong>3x Tree V1 (€705,000)</strong> early 2027.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(9, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 10: INTERNATIONAL EXPANSION STRATEGY (INVESTOR PERSPECTIVE)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-10">
        {doc_header("09 / INTERNATIONAL EXPANSION STRATEGY", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">PAN-EUROPEAN SCALE-UP & HIGH-IRR GEOGRAPHIC EXPANSION</span>
                <h2 class="web-h1">International GTM: Expanding to High-Solar & Coastal Wind Corridors</h2>
                <p class="web-lead">Scaling rapidly beyond the Czech domestic market by deploying an asset-light sales partner network into Southern Europe and windy coastal regions where solar yield is +50% higher and payback drops below 5 years.</p>
            </div>

            <!-- Top: 2 Strategic Expansion Theses (Investor Perspective) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">GEOGRAPHIC YIELD ARBITRAGE</span>
                    <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Targeting Southern Europe & Maritime Coasts</h3>
                    <p style="font-size: 7.6pt; color: #52525b; line-height: 1.45; margin-top: 4px;">
                        While the Czech Republic serves as our engineering and pilot testbed, our highest-margin commercial opportunity lies south and along European coastlines:
                    </p>
                    <div style="font-size: 7.2pt; color: #71717a; margin-top: 6px; line-height: 1.4;">
                        &bull; <strong>Southern Europe (Spain, Italy, Greece, Southern France):</strong> Solar insolation reaches 1,700–2,100 kWh/m²/yr (+60% vs. Central Europe), expanding Tree V1 annual yield to 68,000+ kWh and cutting customer payback to <strong>under 5 years</strong>.<br/>
                        &bull; <strong>Coastal Wind Corridors (Mediterranean, North Sea, Adriatic):</strong> Uninterrupted laminar sea winds guarantee 24/7 continuous turbine generation, eliminating seasonal winter drops.
                    </div>
                </div>

                <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">ASSET-LIGHT SALES PARTNER MODEL</span>
                    <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Local Cleantech Distributors & ESCO Brokers</h3>
                    <p style="font-size: 7.6pt; color: #52525b; line-height: 1.45; margin-top: 4px;">
                        To scale internationally without burning capital on overseas sales subsidiaries, Treetino recruits established local energy distributors, commercial solar installers, and ESCO brokers:
                    </p>
                    <div style="font-size: 7.2pt; color: #71717a; margin-top: 6px; line-height: 1.4;">
                        &bull; <strong>Zero Balance-Sheet Overhead:</strong> Local representatives operate on attractive success-based closing fees (€3,500 – €20,000 per unit closed).<br/>
                        &bull; <strong>Proprietary 3D Sales Enablement:</strong> Reps use our Google Maps photogrammetry app to drop 3D trees on customer sites and generate instant audited proposals in 120 seconds.<br/>
                        &bull; <strong>Centralized Fulfillment:</strong> 100% of engineering, hardware production, and logistics remain anchored at Treetino headquarters in Prague.
                    </div>
                </div>
            </div>

            <!-- Bottom: 4 Key International Target Segments -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 10px;">
                <div class="sharp-card" style="padding: 11px 13px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">MEDITERRANEAN RESORTS</span>
                    <div style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Hotels & Marinas</div>
                    <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 4px;">High summer electricity rates (€0.35+/kWh), luxury architectural attraction, silent guest operation.</p>
                    <div style="margin-top: 6px; font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #18181b; font-weight: 700;">
                        Target: Spain, Italy, Greece
                    </div>
                </div>

                <div class="sharp-card" style="padding: 11px 13px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">COASTAL LOGISTICS & PORTS</span>
                    <div style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Terminals & Warehouses</div>
                    <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 4px;">Constant maritime sea breeze, 24/7 electrified fleet power demand, large unutilized boundary space.</p>
                    <div style="margin-top: 6px; font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #18181b; font-weight: 700;">
                        Target: North Sea, Adriatic
                    </div>
                </div>

                <div class="sharp-card" style="padding: 11px 13px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">SPACE-CONSTRAINED PLANTS</span>
                    <div style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">The MKovo Archetype</div>
                    <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 4px;">100% full roofs and parking lots; vertical trees are the sole microgrid expansion option.</p>
                    <div style="margin-top: 6px; font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #18181b; font-weight: 700;">
                        Target: Industrial CEE & DACH
                    </div>
                </div>

                <div class="sharp-card" style="padding: 11px 13px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">WATERFRONT MUNICIPALITIES</span>
                    <div style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Cities & Promenades</div>
                    <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 4px;">Iconic civic sustainability landmarks, zero-emission public lighting and e-bike charging hubs.</p>
                    <div style="margin-top: 6px; font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #18181b; font-weight: 700;">
                        Target: Green Public Procurement
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(10, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 11: HIGH-LEVEL MEDIA & GOVERNMENT ENDORSEMENT
    # (Large, clear photos, Andrej Babiš correctly identified, zero overlays)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-11">
        {doc_header("10 / GOVERNMENT & MEDIA TRACTION", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">INSTITUTIONAL VALIDATION & HIGH-LEVEL ENDORSEMENTS</span>
                <h2 class="web-h1">Proven Traction: Government Showcases & Major Media Appearances</h2>
                <p class="web-lead">Demonstrated to former prime ministers, ministers, and institutional delegations across the Czech Republic, Europe, the United States, and the UAE.</p>
            </div>

            <!-- 6 Sharp Event Cards with Large Photos (height: 145px) -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2px;">
                <!-- Event 1: Former Prime Minister Andrej Babiš -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/strakova-akademie-vlada-premier.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Andrej Babiš" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">GOVERNMENT & PARLIAMENTARY SHOWCASE</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Presentation to Andrej Babiš</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Personal meeting and functional prototype demonstration to former Prime Minister Andrej Babiš and parliamentary leadership at the exhibition grounds.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            Former Prime Minister of the Czech Republic &bull; Aug 2026
                        </div>
                    </div>
                </div>

                <!-- Event 2: Praha TV Feature Broadcast -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/praha-tv-bts-1.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Praha TV Broadcast" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">PRAHA TV FEATURE</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Television Feature & Lab Tour</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Exclusive television news crew visit to Treetino R&D center covering the functional prototype, branch articulation, and commercial pipeline.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            Broadcast Feature &bull; Sep 2026
                        </div>
                    </div>
                </div>

                <!-- Event 3: Innovations United at Prague Castle -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/innovations-united-prague-castle-2026.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Prague Castle" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">PRAGUE CASTLE KEYNOTE</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Innovations United: Top 5 Finalist</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Keynote presentation at the international Startup Disrupt summit at Prague Castle; selected as Top 5 finalist among cleantech ventures.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            Global Pitch Contest &bull; Jun 2026
                        </div>
                    </div>
                </div>

                <!-- Event 4: URBIS Smart Cities Meetup Brno -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/urbis-brno-june-2026.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="URBIS Brno" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">URBIS SMART CITIES BRNO</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Municipal Showcase & Demonstration</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Live demonstration of micro-generation trees and turbines to municipal mayors, city architects, and European public procurement leaders.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            Smart Cities Expo &bull; Jun 2026
                        </div>
                    </div>
                </div>

                <!-- Event 5: SXSW Austin & US Trade Mission -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/sxsw-austin-czech-house-2026.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="SXSW Austin" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">SXSW AUSTIN & US MISSION</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">Government Special Flight & Expo</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Official exhibition at Czech House SXSW in Austin, Texas; official delegation flight aboard the Government Special aircraft with the Czech Minister.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            US Trade Delegation &bull; Mar 2026
                        </div>
                    </div>
                </div>

                <!-- Event 6: Start it @ ČSOB Accelerator -->
                <div class="sharp-card" style="overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 145px; overflow: hidden; position: relative;">
                        <img src="{img_uri('img/media/start-it-csob-acceleration-2026.jpg')}" style="width: 100%; height: 100%; object-fit: cover;" alt="Start it ČSOB" />
                    </div>
                    <div style="padding: 10px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.06);">
                        <div>
                            <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #52525b; text-transform: uppercase;">START IT @ ČSOB ACCELERATOR</span>
                            <h4 style="font-size: 9.5pt; font-weight: 700; color: #09090b; margin: 2px 0;">16th Cohort Accelerator Graduation</h4>
                            <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin: 2px 0;">
                                Graduation from the 5-month intensive enterprise banking accelerator program focused on commercial scaling and banking validation.
                            </p>
                        </div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; margin-top: 6px;">
                            Banking Accelerator &bull; Apr 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(11, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 12: FINANCIAL MODEL & 24-MONTH DETAILED PROJECTIONS
    # (Actual Google Sheet data, unit economics, high-contrast monochrome SVG chart)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-12">
        {doc_header("11 / FINANCIAL MODEL", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">FINANCIAL PLAN & UNIT ECONOMICS</span>
                <h2 class="web-h1">Financial Projections: High Margins & Low Breakeven Threshold</h2>
                <p class="web-lead">Bottom line from our operating budget: even under maximum conservative spending assumptions ($348k setup CapEx, 11-person team, full marketing), the business achieves operating profitability with remarkably few unit sales.</p>
            </div>

            <!-- Top Row: 3 Hardware Unit Economics Cards from Financial Plan -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">TREE V1 FLAGSHIP</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; background: #f4f4f5; color: #18181b; border: 1px solid #e4e4e7; font-weight: 700; padding: 1px 4px;">40.4% MARGIN</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">€95,000 Profit / Unit</div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 4px;">
                        Price: <strong>€235,000</strong> &bull; Direct Costs: <strong>€140,000</strong>
                    </div>
                    <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 4px;">
                        Just <strong>3 units sold per year</strong> covers the entire annual engineering and management payroll of the company.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">TREE V2 COMPACT</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; background: #f4f4f5; color: #18181b; border: 1px solid #e4e4e7; font-weight: 700; padding: 1px 4px;">25.0% MARGIN</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">€15,000 Profit / Unit</div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 4px;">
                        Price: <strong>€60,000</strong> &bull; Direct Costs: <strong>€45,000</strong>
                    </div>
                    <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 4px;">
                        Rapid volume runner for schools, municipalities, and commercial gardens with 1-day installation.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 10px 14px; border-top: 2px solid #18181b;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b;">TURBINE T1 MODULAR</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; background: #f4f4f5; color: #18181b; border: 1px solid #e4e4e7; font-weight: 700; padding: 1px 4px;">37.5% MARGIN</span>
                    </div>
                    <div style="font-size: 13pt; font-weight: 700; color: #09090b; margin-top: 2px;">€1,500 Profit / Unit</div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 7.2pt; color: #52525b; margin-top: 4px;">
                        Price: <strong>€4,000</strong> &bull; Direct Costs: <strong>€2,500</strong>
                    </div>
                    <p style="font-size: 7.1pt; color: #71717a; line-height: 1.35; margin-top: 4px;">
                        High-velocity accessory deployed on rooftops, masts, and barriers with zero zoning friction.
                    </p>
                </div>
            </div>

            <!-- Middle: Visual SVG Chart of 24-Month Revenue Ramp from Financial Plan -->
            <div class="sharp-card" style="padding: 10px 14px; margin-top: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                            24-MONTH REVENUE TRAJECTORY ($2.22M TOTAL REVENUE ON LOW VOLUME)
                        </span>
                        <span style="font-size: 7pt; color: #71717a; margin-left: 8px;">
                            Monthly revenue ramp showing delivery surges for Tree V1 units ($235k each)
                        </span>
                    </div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a;">
                        Year 1: <strong>$834k</strong> &bull; Year 2: <strong>$1.385M</strong>
                    </div>
                </div>
                {generate_financial_chart_svg()}
            </div>

            <!-- Bottom: 24-Month Operating Budget Summary Table (Direct from Sheet) -->
            <div class="sharp-card" style="padding: 10px 14px; margin-top: 6px;">
                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                    CONSERVATIVE OPERATING BUDGET & MILESTONES (MONTHS 1 – 24)
                </span>
                <table style="width: 100%; border-collapse: collapse; font-size: 7.2pt; margin-top: 4px;">
                    <thead>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.1); background: #fafaf9; text-align: left;">
                            <th style="padding: 4px 6px; font-weight: 700; color: #09090b;">PHASE</th>
                            <th style="padding: 4px 6px; font-weight: 700; color: #09090b;">TIMELINE</th>
                            <th style="padding: 4px 6px; font-weight: 700; color: #09090b;">PRIMARY ACTIVITIES & CAPEX</th>
                            <th style="padding: 4px 6px; font-weight: 700; color: #09090b;">TARGET DELIVERIES</th>
                            <th style="padding: 4px 6px; font-weight: 700; color: #09090b; text-align: right;">REVENUE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 4px 6px; font-weight: 600;">Phase 1: Setup & Tooling</td>
                            <td style="padding: 4px 6px; color: #71717a;">Months 1 – 3</td>
                            <td style="padding: 4px 6px; color: #52525b;">Workshop acquisition ($300k), tooling, casting molds ($100k), van, 3D printers</td>
                            <td style="padding: 4px 6px;">1x Tree V2, 1x T1</td>
                            <td style="padding: 4px 6px; font-weight: 700; color: #09090b; text-align: right;">$64,000</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="padding: 4px 6px; font-weight: 600;">Phase 2: Domestic Pilot Rollout</td>
                            <td style="padding: 4px 6px; color: #71717a;">Months 4 – 12</td>
                            <td style="padding: 4px 6px; color: #52525b;">First commercial Tree V1 delivery, Prague school site completion, 11-person team</td>
                            <td style="padding: 4px 6px;">2x Tree V1, 3x Tree V2, 30x T1</td>
                            <td style="padding: 4px 6px; font-weight: 700; color: #09090b; text-align: right;">$770,000</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 6px; font-weight: 600;">Phase 3: International Expansion</td>
                            <td style="padding: 4px 6px; color: #71717a;">Months 13 – 24</td>
                            <td style="padding: 4px 6px; color: #52525b;">Southern Europe & coastal wind expansion, partner network, volume manufacturing</td>
                            <td style="padding: 4px 6px;">3x Tree V1, 3x Tree V2, 125x T1</td>
                            <td style="padding: 4px 6px; font-weight: 700; color: #09090b; text-align: right;">$1,385,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {doc_footer(12, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 13: WEB3 & DEPIN PROTOCOL ARCHITECTURE
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-13">
        {doc_header("12 / WEB3 & DEPIN PROTOCOL", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">PROTOCOL LABS ALUMNI &bull; ETHPRAGUE CERTINO WINNER</span>
                <h2 class="web-h1">Connecting Physical Cleantech to On-Chain ESG Markets</h2>
                <p class="web-lead">Accelerated by Protocol Labs (Founders Forge Cohort 1, Dubai). Two synergistic protocol layers enabling decentralized capital co-funding and audit-grade hourly ESG certificates.</p>
            </div>

            <!-- Two Sharp Protocol Pillars -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">LAYER 1 &bull; RWA INFRASTRUCTURE FINANCING</span>
                    <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Treetino RWA Protocol & Yield Vaults</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Enables institutional capital to co-fund physical tree deployments and receive verified on-chain yields from real-world energy sales, EV charging, and grid telemetry.
                    </p>
                    <div style="font-size: 7.1pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; line-height: 1.4;">
                        &bull; <strong>Tranched Architecture:</strong> Centrifuge-style Senior (8% fixed APY) & Junior ERC-4626.<br/>
                        &bull; <strong>Automated NAV:</strong> Live Net Asset Value driven by hardware generation telemetry.<br/>
                        &bull; <strong>Settlement:</strong> Automated smart contract waterfalls settle energy revenue.
                    </div>
                </div>

                <div class="sharp-card" style="padding: 13px 15px; border-top: 2px solid #18181b;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">LAYER 2 &bull; DECENTRALIZED INVERTER ORACLE</span>
                    <h3 style="font-size: 11pt; font-weight: 700; color: #09090b; margin-top: 2px;">Certino Protocol (ETHPrague Innovation)</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Co-developed by Treetino CTO with portfolio leadership of premier Czech crypto hedge funds. Connects physical inverters directly to on-chain decentralized oracles.
                    </p>
                    <div style="font-size: 7.1pt; color: #71717a; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 6px; line-height: 1.4;">
                        &bull; <strong>Hardware Normalization:</strong> Universal API for Victron, SMA, Fronius, SolarEdge.<br/>
                        &bull; <strong>Chainlink Functions DON:</strong> Decentralized Oracle Network mints ERC-721 certificates.<br/>
                        &bull; <strong>Mass Monetization:</strong> Corporates get audit-grade CSRD proof; owners earn passive yield.
                    </div>
                </div>
            </div>

            <!-- Lower Regulatory Compliance Block -->
            <div class="sharp-card-soft" style="padding: 12px 16px; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">LEGAL CLASSIFICATION & MICA COMPLIANCE (ARTIFFINE AUDIT)</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 5px;">MICA COMPLIANT</span>
                </div>
                <p style="font-size: 7.5pt; color: #52525b; line-height: 1.4; margin-top: 4px;">
                    Comprehensive regulatory analysis by Web3 law studio <strong>Artiffine</strong> confirms compliance with the EU Markets in Crypto-Assets (MiCA) framework, classifying oracle certificates as verifiable utility proof assets.
                </p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 6px;">
                    <div class="sharp-card" style="padding: 5px 8px; font-size: 6.8pt;">
                        <strong>Step 1 &bull; Telemetry</strong><br/>
                        <span style="color:#71717a;">Inverter verified kW logs</span>
                    </div>
                    <div class="sharp-card" style="padding: 5px 8px; font-size: 6.8pt;">
                        <strong>Step 2 &bull; Oracle DON</strong><br/>
                        <span style="color:#71717a;">Chainlink signature check</span>
                    </div>
                    <div class="sharp-card" style="padding: 5px 8px; font-size: 6.8pt;">
                        <strong>Step 3 &bull; Minting</strong><br/>
                        <span style="color:#71717a;">ERC-721 EnergyTag stamp</span>
                    </div>
                    <div class="sharp-card" style="padding: 5px 8px; font-size: 6.8pt;">
                        <strong>Step 4 &bull; Liquidity</strong><br/>
                        <span style="color:#71717a;">EURC spot vault payout</span>
                    </div>
                </div>
            </div>
        </div>

        {doc_footer(13, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 14: GLOBAL PATENT PROTECTION & CLEAN FREEDOM TO OPERATE
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-14">
        {doc_header("13 / INTELLECTUAL PROPERTY", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">DEFENSIBLE IP FORTRESS & FREEDOM TO OPERATE</span>
                <h2 class="web-h1">Global Patent Protection & Clean Freedom to Operate</h2>
                <p class="web-lead">Multi-layered intellectual property architecture protecting core aerodynamic ducting, dynamic multi-axis branch articulation, and embedded firmware algorithms.</p>
            </div>

            <!-- 3 Sharp Patent Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">WORLD PATENT (PCT)</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 5px;">PUBLISHED</span>
                    </div>
                    <div style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 4px;">WO 2025/256678 A1</div>
                    <div style="font-size: 7.1pt; color: #71717a; margin-top: 1px;">Application: PCT/CZ2025/050053</div>
                    <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin-top: 6px;">
                        Protects the dual-modality synchronization hub, transparent Venturi shroud stator duct geometry, and omnidirectional airflow acceleration mechanics. Priority date: March 2025.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">EUROPEAN PATENT</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 5px;">OFFICIAL SPEC</span>
                    </div>
                    <div style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 4px;">EP 4 664 750 A1</div>
                    <div style="font-size: 7.1pt; color: #71717a; margin-top: 1px;">European Patent Office (EPO)</div>
                    <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin-top: 6px;">
                        Protects mechanical multi-axis articulation of structural branches, dynamic anti-shadowing solar tracking, automated hail defense, and ground-level maintenance pivot orientation.
                    </p>
                </div>

                <div class="sharp-card" style="padding: 13px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">EU INDUSTRIAL DESIGN</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 5px;">REGISTERED</span>
                    </div>
                    <div style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 4px;">RCD 015029481</div>
                    <div style="font-size: 7.1pt; color: #71717a; margin-top: 1px;">EUIPO Design Registration</div>
                    <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin-top: 6px;">
                        Grants 25 years of exclusive aesthetic design protection across all 27 EU member states for the iconic biomimetic tree silhouette, branch proportions, and ducted rotor casing.
                    </p>
                </div>
            </div>

            <!-- FTO & IP Ownership Status -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 8px;">
                <div class="sharp-card-soft" style="padding: 13px 15px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">100% UNENCUMBERED IP OWNERSHIP</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Full Assignment & Collaborative Agreements</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        Treetino corp s.r.o. holds 100% full, exclusive ownership of all patents, registered designs, and firmware. Formal IP assignment agreements executed with elite academic research partners (<strong>FZU, CTU</strong>) ensure zero royalty encumbrances.
                    </p>
                </div>

                <div class="sharp-card-soft" style="padding: 13px 15px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">INDEPENDENT FREEDOM TO OPERATE (FTO)</span>
                    <h3 style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Zero Infringement Risk Confirmed</h3>
                    <p style="font-size: 7.5pt; color: #52525b; line-height: 1.45; margin-top: 6px;">
                        An exhaustive Freedom to Operate (FTO) search conducted by independent European Patent Attorneys (<strong>Všetečka & Partners, Prague</strong>) covering IPC classes F03D (wind motors), H02S (photovoltaics), and F03D3/04 (VAWT ducts) confirmed <strong>zero infringement risk</strong>.
                    </p>
                </div>
            </div>
        </div>

        {doc_footer(14, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 15: FOUNDERS & OPERATIONAL LEADERSHIP
    # (Clean portraits with ZERO overlays, roles in typography)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-15">
        {doc_header("14 / LEADERSHIP & TEAM", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">SERIAL CLEAN-TECH OPERATORS & ACADEMIC ALLIANCES</span>
                <h2 class="web-h1">Founders & Leadership: Proven Execution & Deep-Tech Expertise</h2>
                <p class="web-lead">Complementary operational leadership combining multi-megawatt renewables deployment, advanced embedded firmware architecture, and elite Czech research institutions.</p>
            </div>

            <!-- Founders Row matching FoundersSection.vue (Zero Overlays on Portraits) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 2px;">
                <!-- Founder 1: Dominik Mašek (CEO) -->
                <div class="sharp-card" style="padding: 13px 15px; display: flex; gap: 14px;">
                    <div style="width: 105px; height: 135px; overflow: hidden; flex-shrink: 0; background: #f4f4f5; border: 1px solid rgba(0,0,0,0.1);">
                        <img src="{img_uri('img/founders/dominik-portrait.jpg')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%;" alt="Dominik Mašek" />
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="border-left: 2px solid #18181b; padding-left: 8px;">
                                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">CHIEF EXECUTIVE OFFICER &bull; CO-FOUNDER</span>
                                <h3 style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 1px;">Dominik Mašek</h3>
                                <p style="font-size: 7.1pt; color: #71717a;">Prague, Czech Republic &bull; Founder of Wattino</p>
                            </div>
                            <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin-top: 5px;">
                                Serial hardware and clean-energy entrepreneur. 8+ years developing commercial PV installations, multi-MW wind projects, and industrial grid connections. Drives overall commercial strategy, government relations, and sales pipeline.
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 5px; font-family: 'JetBrains Mono'; text-align: center;">
                            <div>
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">8+ Yrs</div>
                                <div style="font-size: 5.8pt; color: #71717a;">CLEAN TECH</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">Multi-MW</div>
                                <div style="font-size: 5.8pt; color: #71717a;">PV DEPLOYED</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">B2B</div>
                                <div style="font-size: 5.8pt; color: #71717a;">SALES LEAD</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Founder 2: Jakub Lustyk (CTO) -->
                <div class="sharp-card" style="padding: 13px 15px; display: flex; gap: 14px;">
                    <div style="width: 105px; height: 135px; overflow: hidden; flex-shrink: 0; background: #f4f4f5; border: 1px solid rgba(0,0,0,0.1);">
                        <img src="{img_uri('img/founders/jakub-portrait.jpg')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%;" alt="Jakub Lustyk" />
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="border-left: 2px solid #18181b; padding-left: 8px;">
                                <span style="font-family: 'JetBrains Mono'; font-size: 6.8pt; font-weight: 700; color: #52525b; text-transform: uppercase;">CHIEF TECHNOLOGY OFFICER &bull; CO-FOUNDER</span>
                                <h3 style="font-size: 12.5pt; font-weight: 700; color: #09090b; margin-top: 1px;">Jakub Lustyk</h3>
                                <p style="font-size: 7.1pt; color: #71717a;">Prague, Czech Republic &bull; Protocol Labs Alumni</p>
                            </div>
                            <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin-top: 5px;">
                                Hardware systems architect and embedded software engineer. Founder of Nocena; 10+ years architecting embedded IoT devices and decentralized networks. Leads aerodynamics research, sensor fusion MCU algorithms, and oracle integration.
                            </p>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 5px; font-family: 'JetBrains Mono'; text-align: center;">
                            <div>
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">10+ Yrs</div>
                                <div style="font-size: 5.8pt; color: #71717a;">SYSTEMS ENG</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">PL Alum</div>
                                <div style="font-size: 5.8pt; color: #71717a;">DEV ARCHITECT</div>
                            </div>
                            <div style="border-left: 1px solid rgba(0,0,0,0.08);">
                                <div style="font-size: 8.8pt; font-weight: 700; color: #09090b;">PCT & EP</div>
                                <div style="font-size: 5.8pt; color: #71717a;">PATENT AUTHOR</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Engineering & Scientific Advisory Strip -->
            <div class="sharp-card-soft" style="padding: 11px 15px; margin-top: 8px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8pt;">Matěj Čížek</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #52525b; font-weight: 700;">HEAD OF ARCHITECTURE &bull; M.ARCH CTU</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">Specialist in urban biomimicry and structural statics under Eurocode 3 wind load standards.</p>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8pt;">Radim Novotný</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #52525b; font-weight: 700;">LEAD MECHANICAL & TOOLING ENGINEER</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">7+ years CAD modeling, aerodynamic shroud wind-tunnel testing, and large-format 3D manufacturing.</p>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #09090b; font-size: 8pt;">Monika Zvěřinová</span>
                        <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #52525b; font-weight: 700;">PROJECT & COMPLIANCE MANAGER</div>
                        <p style="font-size: 7.2pt; color: #71717a; line-height: 1.35; margin-top: 2px;">6+ years managing multi-million euro deep-tech grants, regulatory filings, and ISO compliance audits.</p>
                    </div>
                </div>

                <!-- Academic & Institutional Logos -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 8px; padding-top: 8px;">
                    <img src="{img_uri('partners/CzechInvest.png')}" style="height: 20px; max-width: 100px; object-fit: contain;" alt="CzechInvest" />
                    <img src="{img_uri('partners/cvut.svg')}" style="height: 22px; max-width: 90px; object-fit: contain;" alt="ČVUT" />
                    <img src="{img_uri('partners/fzu.svg')}" style="height: 20px; max-width: 90px; object-fit: contain;" alt="FZU" />
                    <img src="{img_uri('partners/Sic.png')}" style="height: 20px; max-width: 90px; object-fit: contain;" alt="SIC" />
                    <img src="{img_uri('partners/startit.svg')}" style="height: 20px; max-width: 100px; object-fit: contain;" alt="Start It ČSOB" />
                    <img src="{img_uri('partners/Makeiton.png')}" style="height: 18px; max-width: 90px; object-fit: contain;" alt="Make-it-on" />
                </div>
            </div>
        </div>

        {doc_footer(15, TOTAL_PAGES, dark=False)}
    </div>""")

    # =========================================================================
    # PAGE 16: CAPITAL STRATEGY & CONFIDENTIAL DATA ROOM CATALOG
    # (Full 10-document index including comprehensive HW zadávací dokumentace)
    # =========================================================================
    pages.append(f"""<div class="page-container" id="page-16">
        {doc_header("15 / DUE DILIGENCE DATA ROOM", dark=False)}

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <span class="web-tag">FINANCING ROUND & CONFIDENTIAL DUE DILIGENCE</span>
                <h2 class="web-h1">Capital Strategy & Confidential Due Diligence Data Room</h2>
                <p class="web-lead">Financing structure, use of funds allocation, and catalog of the 10 core verification documents available under mutual NDA.</p>
            </div>

            <!-- Capital Structure & Executive Contact -->
            <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 14px; margin-top: 2px;">
                <div class="sharp-card" style="padding: 12px 15px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">CAPITAL STRUCTURE & ROADMAP</span>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 5px; margin-bottom: 7px;">
                        <div class="sharp-card-soft" style="padding: 7px 9px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">GRANT CLOSED</div>
                            <div style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 1px;">€200,000</div>
                            <div style="font-size: 6.5pt; color: #71717a;">CzechInvest (100%)</div>
                        </div>
                        <div class="sharp-card-soft" style="padding: 7px 9px; border-left: 2px solid #18181b;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #18181b; font-weight: 700;">EU BLENDED</div>
                            <div style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 1px;">€2,500,000</div>
                            <div style="font-size: 6.5pt; color: #18181b; font-weight: 600;">2/4 Votes Secured</div>
                        </div>
                        <div class="sharp-card-soft" style="padding: 7px 9px;">
                            <div style="font-family: 'JetBrains Mono'; font-size: 6.5pt; color: #71717a;">BOND AUCTION</div>
                            <div style="font-size: 11.5pt; font-weight: 700; color: #09090b; margin-top: 1px;">€10,000,000</div>
                            <div style="font-size: 6.5pt; color: #71717a;">Tomes & Partners Offer</div>
                        </div>
                    </div>
                    <p style="font-size: 7.4pt; color: #52525b; line-height: 1.4; margin: 0;">
                        <strong>Current Co-Investment Request:</strong> Strategic equity co-investment slots open to private cleantech investors to de-risk pilot deployment at customer sites, fund ISO 61400 turbine safety certification (already 2 of 4 EIC votes secured), and scale inventory for MKovo orders.
                    </p>
                </div>

                <div class="sharp-card-soft" style="padding: 12px 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">EXECUTIVE CONTACT</span>
                        <div style="font-size: 10.5pt; font-weight: 700; color: #09090b; margin-top: 2px;">Treetino corp s.r.o.</div>
                        <div style="font-size: 7.5pt; color: #52525b; line-height: 1.45; margin-top: 4px;">
                            V Tůních 1625/8, 120 00 Prague 2, Czech Republic<br/>
                            <strong>Dominik Mašek (CEO):</strong> dominik@treetino.eu<br/>
                            <strong>Jakub Lustyk (CTO):</strong> jakub@treetino.eu<br/>
                            Web: <a href="https://www.treetino.eu" style="color: #09090b; text-decoration: underline; font-weight: 600;">www.treetino.eu</a>
                        </div>
                    </div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 6.8pt; color: #71717a; margin-top: 3px;">
                        Meetings available in Prague or via secure teleconference.
                    </div>
                </div>
            </div>

            <!-- Full 10 Core NDA Verification Files Catalog -->
            <div class="sharp-card" style="padding: 12px 16px; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 7pt; font-weight: 700; color: #52525b; text-transform: uppercase;">
                        CONFIDENTIAL DATA ROOM INDEX (10 CORE DUE DILIGENCE ASSETS AVAILABLE UNDER NDA)
                    </span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 6.5pt; font-weight: 700; color: #18181b; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 1px 5px;">
                        POST-NDA RELEASE
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 7.3pt; margin-top: 6px; line-height: 1.45;">
                    <div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>1. grant.pdf:</strong> Official CzechInvest Technological Incubation grant award & audit (€200,000)
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>2. NAB240147.pdf:</strong> Binding order for 130 TopCon PV leaves ready in storage for Prague V2 site
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>3. zadavaci_dokumentace.pdf:</strong> Master hardware & developer tender specification outlining all physical HW components integrated into the tree (embedded MCU, inverters, servomotors, anemometers, sensors, BMS & firmware)
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>4. international_patent.pdf:</strong> World Patent publication (WO 2025/256678 A1)
                        </div>
                        <div style="padding: 3px 0;">
                            <strong>5. EU_patent.pdf:</strong> Official European Patent specification (EP 4 664 750 A1)
                        </div>
                    </div>
                    <div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>6. MOU - M - kovo.pdf:</strong> Binding conditional contract for 3x Tree V1 units (€705,000)
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>7. AVIZ_ATAS_NORD.pdf:</strong> Official Moldovan Government invitation & microgrid endorsement
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>8. Signed LOIs Package:</strong> Banking HQs, high schools, and municipal pipeline LOIs
                        </div>
                        <div style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 3px 0;">
                            <strong>9. VAWT_mereni.pdf:</strong> Official CTU Wind Tunnel wind measurement & aerodynamic test report
                        </div>
                        <div style="padding: 3px 0;">
                            <strong>10. Treetino_nabidka.pdf:</strong> Tomes & Partners underwriting commitment letter for €10M bond auction
                        </div>
                    </div>
                </div>
            </div>

            <!-- Due Diligence Roadmap bar -->
            <div class="sharp-card-soft" style="padding: 8px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 7.2pt;">
                <div>
                    <strong>Due Diligence Roadmap:</strong> 1. Mutual NDA Execution &rarr; 2. Technical Data Room Access &rarr; 3. Prague Site Visit & Leadership Q&A &rarr; 4. Term Sheet & Co-Investment Allocation
                </div>
                <div style="font-family: 'JetBrains Mono'; font-weight: 700; color: #18181b; white-space: nowrap; margin-left: 14px;">
                    ACTIVE DD PIPELINE
                </div>
            </div>
        </div>

        {doc_footer(16, TOTAL_PAGES, dark=False)}
    </div>""")

    return pages

def generate_master_html():
    pages = build_pages()
    combined_body = "\n".join(pages)
    with open(os.path.join(SCRATCH_DIR, "fonts", "local_fonts.css"), "r", encoding="utf-8") as f:
        local_fonts = f.read()
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Treetino - Investment Memorandum 2026</title>
<style>
{local_fonts}
{GLOBAL_CSS}
</style>
</head>
<body>
{combined_body}
</body>
</html>"""
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated master HTML: {OUTPUT_HTML} ({len(html)} bytes)")
    return OUTPUT_HTML

def compile_pdf():
    print(f"Compiling PDF using Chrome headless: {OUTPUT_PDF}...")
    cmd = [
        CHROME_BIN,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--allow-file-access-from-files",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={OUTPUT_PDF}",
        "--print-to-pdf-no-header",
        OUTPUT_HTML
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Chrome PDF generation error: {res.stderr}")
        raise RuntimeError("PDF generation failed")
    
    pdf_size = os.path.getsize(OUTPUT_PDF)
    print(f"PDF successfully compiled: {OUTPUT_PDF} ({pdf_size} bytes)")
    
    # Copy to public/docs and desktop
    shutil.copyfile(OUTPUT_PDF, DOCS_PDF)
    print(f"Copied to public/docs: {DOCS_PDF}")
    shutil.copyfile(OUTPUT_PDF, DESKTOP_PDF)
    print(f"Copied to Desktop: {DESKTOP_PDF}")
    return OUTPUT_PDF

def generate_screenshots():
    print("Generating page screenshots for audit...")
    pages = build_pages()
    with open(os.path.join(SCRATCH_DIR, "fonts", "local_fonts.css"), "r", encoding="utf-8") as f:
        local_fonts = f.read()
    
    for idx, page_html in enumerate(pages, start=1):
        temp_html_path = os.path.join(SCRATCH_DIR, f"temp_page_{idx:02d}.html")
        page_standalone_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page {idx:02d}</title>
<style>
{local_fonts}
* {{
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}}
html, body {{
  margin: 0 !important;
  padding: 0 !important;
  width: 1123px !important;
  height: 794px !important;
  overflow: hidden !important;
  font-family: 'DM Sans', sans-serif !important;
}}
.page-container {{
  width: 1123px !important;
  height: 794px !important;
  max-height: 794px !important;
  min-height: 794px !important;
  padding: 22px 30px 16px 30px !important;
  page-break-after: avoid !important;
  margin: 0 !important;
}}
{GLOBAL_CSS}
</style>
</head>
<body style="margin:0; padding:0;">
{page_html}
</body>
</html>"""
        with open(temp_html_path, "w", encoding="utf-8") as f:
            f.write(page_standalone_html)
        
        screenshot_path = os.path.join(SCREENSHOT_DIR, f"im_page_{idx:02d}.png")
        desktop_screenshot_path = os.path.join(DESKTOP_SCREENS, f"im_page_{idx:02d}.png")
        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--allow-file-access-from-files",
            "--hide-scrollbars",
            "--window-size=1123,794",
            "--device-scale-factor=2",
            "--run-all-compositor-stages-before-draw",
            f"--screenshot={screenshot_path}",
            temp_html_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"Page {idx:02d} screenshot saved: {screenshot_path}")
            shutil.copyfile(screenshot_path, desktop_screenshot_path)
        else:
            print(f"Failed screenshot for page {idx:02d}: {res.stderr}")
        
        if os.path.exists(temp_html_path):
            os.remove(temp_html_path)

if __name__ == "__main__":
    generate_master_html()
    compile_pdf()
    generate_screenshots()
