#!/usr/bin/env python3
"""
Treetino Ultra-Distilled High-Impact Sales Onepager (Luxury Dark Mode Edition)
- Dark Theme: Deep zinc-950 background (#09090b), sleek dark cards (#121215), electric cyan/blue accents (#38bdf8)
- Contemporary Fonts: Plus Jakarta Sans (headings, ratings, badges) & DM Sans (body, descriptions). Zero monospace font.
- Giant imagery: 260px product renders, 210px archetype photography
- Strictly 1 single page guaranteed per language
- Outputs only the 2 definitive PDFs to Desktop: EN and CS
"""

import os
import subprocess
import shutil
from PIL import Image, ImageOps
import qrcode
from pypdf import PdfReader

ROOT_DIR = "/Users/jakub/Projects/treetino-website-dev"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
SCRATCH_DIR = os.path.join(ROOT_DIR, "scratch")
DOCS_DIR = os.path.join(PUBLIC_DIR, "docs")
DESKTOP_DIR = "/Users/jakub/Desktop"
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(SCRATCH_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

def prepare_assets():
    """Extracts and crops ultra-clean dark studio renders with maximum resolution."""
    # 1. Tree V1 dark studio render crop
    v1_raw = os.path.join(PUBLIC_DIR, "img/hero-images/poster-v1_1.1.1.webp")
    v1_crop = os.path.join(SCRATCH_DIR, "onepager_v1.jpg")
    im1 = Image.open(v1_raw)
    im1 = ImageOps.exif_transpose(im1)
    c1 = im1.crop((400, 200, 2620, 2000))
    c1.save(v1_crop, quality=95)

    # 2. Tree V2 dark studio render crop
    v2_raw = os.path.join(PUBLIC_DIR, "img/hero-images/poster-v2_2.1.2.webp")
    v2_crop = os.path.join(SCRATCH_DIR, "onepager_v2.jpg")
    im2 = Image.open(v2_raw)
    im2 = ImageOps.exif_transpose(im2)
    c2 = im2.crop((410, 250, 2570, 2000))
    c2.save(v2_crop, quality=95)

    # 3. Archetype 1: Heavy Industry -> opp-metal.jpg
    m_raw = os.path.join(PUBLIC_DIR, "img/sales/opp-metal.jpg")
    m_crop = os.path.join(SCRATCH_DIR, "onepager_metal.jpg")
    im_m = Image.open(m_raw)
    im_m = ImageOps.exif_transpose(im_m)
    c_m = im_m.crop((0, 0, 1200, 896))
    c_m.save(m_crop, quality=95)

    # 4. Archetype 2: Corporate HQ -> opp-bank.jpg
    b_raw = os.path.join(PUBLIC_DIR, "img/sales/opp-bank.jpg")
    b_crop = os.path.join(SCRATCH_DIR, "onepager_bank.jpg")
    im_b = Image.open(b_raw)
    im_b = ImageOps.exif_transpose(im_b)
    c_b = im_b.crop((0, 0, 1200, 896))
    c_b.save(b_crop, quality=95)

    # 5. Archetype 3: Municipalities -> opp-village.jpg
    v_raw = os.path.join(PUBLIC_DIR, "img/sales/opp-village.jpg")
    v_crop = os.path.join(SCRATCH_DIR, "onepager_village.jpg")
    im_v = Image.open(v_raw)
    im_v = ImageOps.exif_transpose(im_v)
    c_v = im_v.crop((0, 0, 1200, 896))
    c_v.save(v_crop, quality=95)

    # 6. QR Code to live Sales Page (Sharp contrast for phone camera scanning)
    qr_path = os.path.join(SCRATCH_DIR, "sales_qr.png")
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    qr.add_data("https://treetino.eu/sales")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#09090b", back_color="white")
    qr_img.save(qr_path)

    print("All image assets & QR code generated in scratch/")

prepare_assets()

def uri(fpath):
    return f"file://{fpath}"

def get_logotype_svg(fill="#ffffff"):
    return f"""<svg style="height: 22px; width: auto; display: block;" viewBox="0 0 400 75.82" fill="{fill}" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.78,66.53c.06.03.12.05.19.05h0,0s-.09,0-.19-.05ZM25.97,66.58l-.19-.05c1.63.87,3.6.82,5.18-.13,1.58-.95,2.55-2.66,2.55-4.51v-5.02c0-1.36-.73-2.62-1.9-3.29l-6.55-3.78c-1.99-1.15-3.45-3.05-4.04-5.27-.59-2.22-.29-4.58.86-6.57l11.01,6.35c.13.07.29.07.42,0,.13-.07.21-.21.21-.37v-23.79h8.67v12.16c0,.15.08.29.21.37.13.07.29.07.42,0l10.53-6.08c1.14,1.99,1.45,4.36.86,6.57-.6,2.22-2.05,4.12-4.05,5.27l-6.08,3.51c-1.18.68-1.9,1.94-1.9,3.29v16.65c0,4.89-2.57,9.42-6.76,11.94-4.19,2.52-9.4,2.65-13.71.36h0c-8.08-4.3-16.06-10.37-18.38-14.39-2.06-3.57-3.33-11.73-3.33-19.93s1.27-16.36,3.33-19.93c2.06-3.57,8.49-8.75,15.6-12.85C26.03,2.98,33.73,0,37.85,0s12.01,3.26,19.2,7.52c7.19,4.26,13.61,9.46,15.32,12.41,1.7,2.95,2.85,11.42,2.85,19.93s-1.15,16.98-2.85,19.93c-.78,1.36-2.46,3.17-4.82,5.08-4.38,3.54-11.35,7.81-17.47,10.81l-.05-.11c-2.03-4.19-.52-9.23,3.48-11.62,2.45-1.46,4.8-2.99,6.79-4.45,2.18-1.6,3.94-2.97,4.57-4.05.43-.74.67-2.07.93-3.71.52-3.29.77-7.59.77-11.88s-.25-8.6-.77-11.89c-.26-1.64-.5-2.97-.93-3.71-.54-.94-1.73-2.1-3.33-3.37-2.34-1.85-5.56-3.94-8.9-5.91-5.61-3.32-11.58-6.31-14.79-6.31s-9.06,2.73-14.59,5.92c-5.53,3.19-10.82,6.9-12.42,9.68s-2.17,9.21-2.17,15.6.56,12.82,2.17,15.6c1.85,3.21,8.5,7.65,14.94,11.07l.19.05Z"/>
        <path d="M391.87,49.66v-12.82c0-1.95-1.1-2.89-3.29-2.89h-20.51c-2.15,0-3.24.95-3.24,2.89v12.82c0,1.9,1.1,2.89,3.24,2.89h20.51c2.2,0,3.29-1,3.29-2.89ZM400,36.83v12.82c0,6.44-5.09,11.03-11.43,11.03h-20.51c-6.29,0-11.38-4.54-11.38-11.03v-12.82c0-6.44,5.09-11.08,11.38-11.08h20.51c6.34,0,11.43,4.59,11.43,11.08ZM352.85,25.75v26.95c0,4.39-3.59,7.98-7.98,7.98h-.15l-21.01-23.5v15.52c0,4.39-3.59,8.03-7.98,8.03h-.15v-26.95c0-4.39,3.59-8.03,7.98-8.03h.15l21.01,23.4v-15.37c0-4.39,3.59-8.03,7.98-8.03h.15ZM311.73,33.79v26.95h-.15c-4.39,0-7.98-3.64-7.98-8.03v-26.95h.15c4.39,0,7.98,3.64,7.98,8.03ZM276.4,60.68v-26.75h-15.72c0-4.59,3.54-8.18,7.99-8.18h31.69c0,4.64-3.59,8.18-8.03,8.18h-7.73v18.76c0,4.44-3.59,7.98-8.18,7.98ZM231.11,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.98-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM221.58,33.94v-.15c0-4.39,3.59-8.03,7.98-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM188.84,47.31c-.75,0-1.4.65-1.4,1.45v3.79h30.29c0,4.59-3.54,8.18-7.98,8.18h-30.44v-13.57c0-4.39,3.59-7.98,7.99-7.98h30.44c0,4.59-3.54,8.13-7.98,8.13h-20.91ZM179.31,33.94v-.15c0-4.39,3.59-8.03,7.99-8.03h30.44v.2c0,4.39-3.59,7.98-7.98,7.98h-30.44ZM92.69,25.75h31.69c4.44,0,7.98,3.59,7.98,8.18h-15.72v18.76c0,4.44-3.59,7.98-8.18,7.98v-26.75h-7.73c-4.44,0-8.03-3.54-8.03-8.18ZM139.15,41.22h25.15c4.79,0,4.79-7.29,0-7.29h-22.7c-2.94,0-5.49-1.45-6.94-3.99l-2.3-4.19h31.94c6.49,0,11.78,5.34,11.78,11.83s-5.29,11.78-11.78,11.78h-.82l6.59,11.38h-9.43l-6.58-11.38h-6.72v11.38c-4.59,0-8.18-2.52-8.18-5.67v-5.7h0v-8.13Z"/>
    </svg>"""

COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@page {
  size: 210mm 297mm;
  margin: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 210mm;
  height: 297mm;
  max-width: 210mm;
  max-height: 297mm;
  overflow: hidden;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #f4f4f5;
  background-color: #09090b;
  -webkit-font-smoothing: antialiased;
}

.page-wrapper {
  width: 210mm;
  height: 297mm;
  padding: 8mm 14mm 7mm 14mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #09090b;
}

/* Header */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 5px;
}

.header-meta {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7.2pt;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #38bdf8;
  text-transform: uppercase;
}

/* Title Section */
.title-section {
  margin-top: 5px;
  margin-bottom: 7px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.title-h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18pt;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #ffffff;
  line-height: 1.1;
  margin: 0;
}

.title-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 8.8pt;
  color: #a1a1aa;
  font-weight: 400;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 3px;
  margin-bottom: 6px;
  gap: 12px;
}

.sec-tag {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 8.2pt;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f4f4f5;
  white-space: nowrap;
}

.sec-sub {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7pt;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #71717a;
  text-transform: uppercase;
  white-space: nowrap;
}

/* SECTION 1: PRODUCTS (2 Columns - GIANT 260px PICTURES) */
.products-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.product-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #121215;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.prod-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.prod-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 11pt;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.prod-power {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 11.5pt;
  font-weight: 800;
  color: #38bdf8;
}

/* 260px Giant Product Render */
.prod-img-box {
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 5px;
}

.prod-img-box img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

/* Minimal specs strip - perfectly contained in dark theme */
.prod-specs-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #18181e;
  padding: 3.5px 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 6.8pt;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 5px;
  white-space: nowrap;
}

.prod-dot {
  color: #64748b;
  font-weight: 400;
  font-size: 5.5pt;
}

.prod-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 4px;
}

.prod-price-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 7.6pt;
  color: #a1a1aa;
}

.prod-price-text b {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  color: #ffffff;
}

.commission-badge-inline {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2.5px 7px;
  white-space: nowrap;
}

/* SECTION 2: 3 BUYER ARCHETYPES (3 Columns - GIANT 210px PICTURES) */
.archetypes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 11px;
  margin-bottom: 8px;
}

.arch-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #121215;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 210px Giant Archetype Photo */
.arch-img-box {
  width: 100%;
  height: 210px;
  overflow: hidden;
  background: #000000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.arch-img-box img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  display: block;
}

.arch-body {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.arch-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 8.8pt;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 4px;
}

.arch-points {
  display: flex;
  flex-direction: column;
  gap: 2.5px;
  margin-bottom: 4px;
}

.arch-line {
  font-size: 7pt;
  line-height: 1.25;
}

.point-k {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #71717a;
}

.point-k.sol {
  color: #38bdf8;
}

.point-v {
  font-family: 'DM Sans', sans-serif;
  color: #d4d4d8;
}

.arch-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 3.5px;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 2.5px;
}

.deal-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'DM Sans', sans-serif;
  font-size: 6.8pt;
  color: #a1a1aa;
}

.deal-line b {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #ffffff;
  font-weight: 700;
}

.arch-payout-badge {
  display: block;
  text-align: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7.2pt;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2.5px 4px;
  white-space: nowrap;
}

/* SECTION 3: CLOSING PLAYBOOK & QR BAR (Bottom Strip) */
.closing-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.4fr);
  gap: 8px;
  background: #121215;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 5px 8px;
  align-items: center;
}

.close-col {
  display: flex;
  flex-direction: column;
}

.close-k {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #38bdf8;
  text-transform: uppercase;
  margin-bottom: 1px;
}

.close-v {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7.8pt;
  font-weight: 700;
  color: #ffffff;
}

.close-d {
  font-family: 'DM Sans', sans-serif;
  font-size: 6.4pt;
  color: #a1a1aa;
}

.qr-box {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #18181e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 6px;
}

.qr-img-wrapper {
  background: #ffffff;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qr-img-wrapper img {
  width: 36px;
  height: 36px;
  display: block;
}

.qr-text {
  display: flex;
  flex-direction: column;
}

.qr-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 6.5pt;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #38bdf8;
  text-transform: uppercase;
}

.qr-url {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 7.3pt;
  font-weight: 700;
  color: #ffffff;
}

.qr-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 6.2pt;
  color: #a1a1aa;
}

/* Footer */
.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 4px;
  margin-top: 3px;
  font-family: 'DM Sans', sans-serif;
  font-size: 6.8pt;
  color: #71717a;
}

.footer-row b {
  color: #d4d4d8;
}
"""

def build_english_html():
    v1_img = uri(os.path.join(SCRATCH_DIR, "onepager_v1.jpg"))
    v2_img = uri(os.path.join(SCRATCH_DIR, "onepager_v2.jpg"))
    metal_img = uri(os.path.join(SCRATCH_DIR, "onepager_metal.jpg"))
    bank_img = uri(os.path.join(SCRATCH_DIR, "onepager_bank.jpg"))
    village_img = uri(os.path.join(SCRATCH_DIR, "onepager_village.jpg"))
    qr_img = uri(os.path.join(SCRATCH_DIR, "sales_qr.png"))

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Treetino - Sales Cheatsheet (EN)</title>
<style>
{COMMON_CSS}
</style>
</head>
<body>
<div class="page-wrapper">

  <!-- Header -->
  <div>
    <div class="header-row">
      <div style="display: flex; align-items: center; gap: 10px;">
        {get_logotype_svg(fill="#ffffff")}
      </div>
      <div class="header-meta">
        COMMERCIAL PLAYBOOK // SALES CHEATSHEET &bull; 2026.1 &bull; CONFIDENTIAL
      </div>
    </div>

    <!-- Title Banner (Ultra-Distilled) -->
    <div class="title-section">
      <h1 class="title-h1">What We Sell & Who We Sell To</h1>
      <div class="title-sub">Turnkey solar + wind micro-power plants on a 1 m² footprint.</div>
    </div>
  </div>

  <!-- 01 / WHAT WE SELL -->
  <div>
    <div class="section-header">
      <span class="sec-tag">01 / WHAT WE SELL</span>
      <span class="sec-sub">Patented Hybrid Tech (EP 4 664 750 A1)</span>
    </div>

    <div class="products-row">
      <!-- Tree V1 -->
      <div class="product-card">
        <div class="prod-header">
          <div class="prod-name">Tree V1 Commercial</div>
          <div class="prod-power">49.8 kW Hybrid</div>
        </div>
        <div class="prod-img-box">
          <img src="{v1_img}" alt="Tree V1 Commercial" />
        </div>
        <div class="prod-specs-bar">
          <span>13.8 kWp Solar</span>
          <span class="prod-dot">•</span>
          <span>36 kW Wind</span>
          <span class="prod-dot">•</span>
          <span>22 kW EV</span>
          <span class="prod-dot">•</span>
          <span>1 m² Base</span>
        </div>
        <div class="prod-footer-row">
          <span class="prod-price-text">Price: <b>€200,000</b> (~4.9M CZK)</span>
          <span class="commission-badge-inline">COMMISSION: €20,000 (10%)</span>
        </div>
      </div>

      <!-- Tree V2 -->
      <div class="product-card">
        <div class="prod-header">
          <div class="prod-name">Tree V2 Compact</div>
          <div class="prod-power">6–12 kW Hybrid</div>
        </div>
        <div class="prod-img-box">
          <img src="{v2_img}" alt="Tree V2 Compact" />
        </div>
        <div class="prod-specs-bar">
          <span>3.5–7 kWp Solar</span>
          <span class="prod-dot">•</span>
          <span>3–5 kW Wind</span>
          <span class="prod-dot">•</span>
          <span>&lt; 35 dB</span>
          <span class="prod-dot">•</span>
          <span>0.5 m² Base</span>
        </div>
        <div class="prod-footer-row">
          <span class="prod-price-text">Price: <b>€45k–€75k</b> (~1.1–1.8M)</span>
          <span class="commission-badge-inline">COMMISSION: UP TO €7,500</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 02 / WHO WE ARE SELLING TO -->
  <div>
    <div class="section-header">
      <span class="sec-tag">02 / WHO WE SELL TO</span>
      <span class="sec-sub">Target Archetypes & Commission</span>
    </div>

    <div class="archetypes-grid">
      <!-- Archetype 1 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{metal_img}" alt="Heavy Industry" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">01 / Heavy Industry & Metalworks</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">TARGET: </span>
                <span class="point-v">Factories & workshops with existing rooftop solar.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">SOLUTION: </span>
                <span class="point-v">24/7 wind + solar cuts costly peak grid fees.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typical Deal:</span> <b>€600,000 (3× V1)</b></div>
            <span class="arch-payout-badge">Rep Commission: €60,000 (10%)</span>
          </div>
        </div>
      </div>

      <!-- Archetype 2 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{bank_img}" alt="Corporate Campus" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">02 / Corporate HQ & Logistics</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">TARGET: </span>
                <span class="point-v">Enterprise offices, logistics parks & data hubs.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">SOLUTION: </span>
                <span class="point-v">Biophilic entrance icon + 22 kW EV charging plaza.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typical Deal:</span> <b>€200k–€430k</b></div>
            <span class="arch-payout-badge">Rep Commission: €20k–€43k</span>
          </div>
        </div>
      </div>

      <!-- Archetype 3 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{village_img}" alt="Municipalities" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">03 / Municipalities & Campuses</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">TARGET: </span>
                <span class="point-v">Town squares, university campuses & smart cities.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">SOLUTION: </span>
                <span class="point-v">Up to 90% EU grants. Turnkey delivery in &lt;2 months.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typical Deal:</span> <b>€200k–€500k</b></div>
            <span class="arch-payout-badge">Rep Commission: €20k–€40k</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CLOSING PLAYBOOK & QR CODE -->
  <div>
    <div class="closing-row">
      <div class="close-col">
        <div class="close-k">Turnkey Delivery</div>
        <div class="close-v">&lt; 2 Months to Grid</div>
        <div class="close-d">EU manufactured; ground screws.</div>
      </div>
      <div class="close-col">
        <div class="close-k">Grants & Payback</div>
        <div class="close-v">2.5–4.5y Payback</div>
        <div class="close-d">Up to 90% EU green subsidies.</div>
      </div>
      <div class="close-col">
        <div class="close-k">Warranties</div>
        <div class="close-v">15y Frame • 25y PV</div>
        <div class="close-d">Automated wash; 0 scaffolding.</div>
      </div>
      <div class="qr-box">
        <div class="qr-img-wrapper">
          <img src="{qr_img}" alt="Scan for Sales Portal" />
        </div>
        <div class="qr-text">
          <div class="qr-title">SCAN SALES PORTAL</div>
          <div class="qr-url">treetino.eu/sales</div>
          <div class="qr-desc">3D simulator & ROI tool</div>
        </div>
      </div>
    </div>

    <div class="footer-row">
      <div><b>Treetino corp s.r.o.</b> &bull; Prague, Czech Republic &bull; www.treetino.eu</div>
      <div>Partner Portal: <b>app.treetino.com</b> &bull; Direct Support: <b>sales@treetino.com</b></div>
      <div>CONFIDENTIAL &bull; INTERNAL SALES CHEATSHEET &bull; PAGE 01 / 01</div>
    </div>
  </div>

</div>
</body>
</html>"""

def build_czech_html():
    v1_img = uri(os.path.join(SCRATCH_DIR, "onepager_v1.jpg"))
    v2_img = uri(os.path.join(SCRATCH_DIR, "onepager_v2.jpg"))
    metal_img = uri(os.path.join(SCRATCH_DIR, "onepager_metal.jpg"))
    bank_img = uri(os.path.join(SCRATCH_DIR, "onepager_bank.jpg"))
    village_img = uri(os.path.join(SCRATCH_DIR, "onepager_village.jpg"))
    qr_img = uri(os.path.join(SCRATCH_DIR, "sales_qr.png"))

    return f"""<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<title>Treetino - Obchodní přehled (CS)</title>
<style>
{COMMON_CSS}
</style>
</head>
<body>
<div class="page-wrapper">

  <!-- Header -->
  <div>
    <div class="header-row">
      <div style="display: flex; align-items: center; gap: 10px;">
        {get_logotype_svg(fill="#ffffff")}
      </div>
      <div class="header-meta">
        OBCHODNÍ PŘEHLED // PRODEJNÍ MANUÁL &bull; 2026.1 &bull; DŮVĚRNÉ
      </div>
    </div>

    <!-- Title Banner (Ultra-Distilled) -->
    <div class="title-section">
      <h1 class="title-h1">Co prodáváme a komu to prodáváme</h1>
      <div class="title-sub">Solárně-větrné mikroelektrárny na ploše 1 m² pro nepřetržitou čistou energii 24/7.</div>
    </div>
  </div>

  <!-- 01 / CO PRODÁVÁME -->
  <div>
    <div class="section-header">
      <span class="sec-tag">01 / CO PRODÁVÁME</span>
      <span class="sec-sub">Patentovaná technologie (EP 4 664 750 A1)</span>
    </div>

    <div class="products-row">
      <!-- Tree V1 -->
      <div class="product-card">
        <div class="prod-header">
          <div class="prod-name">Tree V1 Commercial</div>
          <div class="prod-power">49,8 kW Hybrid</div>
        </div>
        <div class="prod-img-box">
          <img src="{v1_img}" alt="Tree V1 Commercial" />
        </div>
        <div class="prod-specs-bar">
          <span>13,8 kWp solár</span>
          <span class="prod-dot">•</span>
          <span>36 kW vítr</span>
          <span class="prod-dot">•</span>
          <span>22 kW EV</span>
          <span class="prod-dot">•</span>
          <span>1 m² základna</span>
        </div>
        <div class="prod-footer-row">
          <span class="prod-price-text">Cena: <b>4,9 mil. Kč</b> (~€200k)</span>
          <span class="commission-badge-inline">PROVIZE: 490 000 Kč (10 %)</span>
        </div>
      </div>

      <!-- Tree V2 -->
      <div class="product-card">
        <div class="prod-header">
          <div class="prod-name">Tree V2 Compact</div>
          <div class="prod-power">6–12 kW Hybrid</div>
        </div>
        <div class="prod-img-box">
          <img src="{v2_img}" alt="Tree V2 Compact" />
        </div>
        <div class="prod-specs-bar">
          <span>3,5–7 kWp solár</span>
          <span class="prod-dot">•</span>
          <span>3–5 kW vítr</span>
          <span class="prod-dot">•</span>
          <span>&lt; 35 dB</span>
          <span class="prod-dot">•</span>
          <span>0,5 m² základna</span>
        </div>
        <div class="prod-footer-row">
          <span class="prod-price-text">Cena: <b>1,1–1,8 mil. Kč</b></span>
          <span class="commission-badge-inline">PROVIZE: AŽ 184 000 Kč</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 02 / KOMU TO PRODÁVÁME -->
  <div>
    <div class="section-header">
      <span class="sec-tag">02 / KOMU TO PRODÁVÁME</span>
      <span class="sec-sub">Nákupní archetypy a provize</span>
    </div>

    <div class="archetypes-grid">
      <!-- Archetype 1 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{metal_img}" alt="Těžký průmysl" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">01 / Těžký průmysl a výroba</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">CÍL: </span>
                <span class="point-v">Výrobní areály a kovovýroba s plnou střechou FVE.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">ŘEŠENÍ: </span>
                <span class="point-v">24/7 solár + vítr sráží drahé 15min špičky a noční odběr.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typický obchod:</span> <b>14,7 mil. Kč (3× V1)</b></div>
            <span class="arch-payout-badge">Provize: 1 470 000 Kč (10 %)</span>
          </div>
        </div>
      </div>

      <!-- Archetype 2 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{bank_img}" alt="Korporace a areály" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">02 / Centrály firem a logistika</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">CÍL: </span>
                <span class="point-v">Administrativní centra a logistické areály.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">ŘEŠENÍ: </span>
                <span class="point-v">Biofilní dominanta u vchodu + 22 kW EV hub pro VIP.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typický obchod:</span> <b>4,9 – 10,5 mil. Kč</b></div>
            <span class="arch-payout-badge">Provize: 490 000 – 1 050 000 Kč</span>
          </div>
        </div>
      </div>

      <!-- Archetype 3 -->
      <div class="arch-card">
        <div class="arch-img-box">
          <img src="{village_img}" alt="Města a obce" />
        </div>
        <div class="arch-body">
          <div>
            <div class="arch-title">03 / Města, obce a kampusy</div>
            <div class="arch-points">
              <div class="arch-line">
                <span class="point-k">CÍL: </span>
                <span class="point-v">Náměstí, univerzitní kampusy a chytrá města.</span>
              </div>
              <div class="arch-line">
                <span class="point-k sol">ŘEŠENÍ: </span>
                <span class="point-v">Až 90 % dotace EU. Dodání na klíč do sítě &lt;2 měsíce.</span>
              </div>
            </div>
          </div>
          <div class="arch-footer">
            <div class="deal-line"><span>Typický obchod:</span> <b>4,9 – 12 mil. Kč</b></div>
            <span class="arch-payout-badge">Provize: 490 000 – 980 000 Kč</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CLOSING PLAYBOOK & QR CODE -->
  <div>
    <div class="closing-row">
      <div class="close-col">
        <div class="close-k">Dodání na klíč</div>
        <div class="close-v">&lt; 2 měsíce do sítě</div>
        <div class="close-d">Výroba v ČR/EU; zemní vruty.</div>
      </div>
      <div class="close-col">
        <div class="close-k">Dotace a návratnost</div>
        <div class="close-v">Návratnost 2,5–4,5 roku</div>
        <div class="close-d">Až 90 % dotace z fondů EU.</div>
      </div>
      <div class="close-col">
        <div class="close-k">Záruky a servis</div>
        <div class="close-v">15 let konstrukce • 25 let FVE</div>
        <div class="close-d">Ostřik ze země; bez plošin.</div>
      </div>
      <div class="qr-box">
        <div class="qr-img-wrapper">
          <img src="{qr_img}" alt="QR kód prodejního portálu" />
        </div>
        <div class="qr-text">
          <div class="qr-title">SKENOVAT PORTÁL</div>
          <div class="qr-url">treetino.eu/sales</div>
          <div class="qr-desc">3D simulátor a ROI kalkulačka</div>
        </div>
      </div>
    </div>

    <div class="footer-row">
      <div><b>Treetino corp s.r.o.</b> &bull; Praha, Česká republika &bull; www.treetino.eu</div>
      <div>Partnerský portál: <b>app.treetino.com</b> &bull; Přímá podpora: <b>sales@treetino.com</b></div>
      <div>DŮVĚRNÉ &bull; INTERNÍ MANUÁL PRO OBCHODNÍKY &bull; STRANA 01 / 01</div>
    </div>
  </div>

</div>
</body>
</html>"""

def compile_all():
    tasks = [
        ("EN", build_english_html(), "Treetino_Sales_Onepager_EN.pdf", "Treetino_Sales_Onepager_EN_Preview.png"),
        ("CS", build_czech_html(), "Treetino_Sales_Onepager_CS.pdf", "Treetino_Sales_Onepager_CS_Preview.png"),
    ]

    for lang, html_content, pdf_name, png_name in tasks:
        html_file = os.path.join(SCRATCH_DIR, f"sales_onepager_{lang.lower()}.html")
        pdf_public = os.path.join(DOCS_DIR, pdf_name)
        pdf_desktop = os.path.join(DESKTOP_DIR, pdf_name)
        png_scratch = os.path.join(SCRATCH_DIR, png_name)

        with open(html_file, "w", encoding="utf-8") as f:
            f.write(html_content)

        # PDF Compilation
        subprocess.run([
            CHROME_BIN, "--headless=new", "--disable-gpu", "--no-sandbox",
            "--allow-file-access-from-files", "--run-all-compositor-stages-before-draw",
            f"--print-to-pdf={pdf_public}", "--print-to-pdf-no-header", html_file
        ], check=True)
        shutil.copyfile(pdf_public, pdf_desktop)

        # Screenshot Compilation (keep in scratch/ only)
        subprocess.run([
            CHROME_BIN, "--headless=new", "--disable-gpu", "--no-sandbox",
            "--allow-file-access-from-files", "--hide-scrollbars",
            "--window-size=794,1123", "--device-scale-factor=2",
            "--run-all-compositor-stages-before-draw",
            f"--screenshot={png_scratch}", html_file
        ], check=True)

        # Verify exact 1-page count
        reader = PdfReader(pdf_public)
        print(f"[{lang}] Generated {pdf_name}: {len(reader.pages)} page(s).")
        assert len(reader.pages) == 1, f"Error: {pdf_name} has {len(reader.pages)} pages instead of 1!"

    # Mirror EN to public/docs for web linking
    shutil.copyfile(os.path.join(DOCS_DIR, "Treetino_Sales_Onepager_EN.pdf"), os.path.join(DOCS_DIR, "Treetino_Sales_Onepager.pdf"))

    print("Only the 2 best PDFs delivered to Desktop: Treetino_Sales_Onepager_EN.pdf & Treetino_Sales_Onepager_CS.pdf")

if __name__ == "__main__":
    compile_all()
