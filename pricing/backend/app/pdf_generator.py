import io
import os
import base64
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

# A4 dimensions: 595.27 points wide by 841.89 points high
W, H = A4

def draw_page_1(c: canvas.Canvas, data: dict, assets_path: str):
    import reportlab.lib.utils as utils
    lang = data.get("lang", "cs")
    
    # 1. Main Cover Image (strom1.png) + Dark Overlay
    main_tree_path = os.path.join(assets_path, "products", "strom1.png")
    
    # Fill background with dark color
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    if os.path.exists(main_tree_path):
        img_cover = utils.ImageReader(main_tree_path)
        img_w, img_h = img_cover.getSize()
        
        # Fit tree in the lower/middle section
        target_w = W * 1.2
        target_h = (target_w / float(img_w)) * img_h
        x_pos = (W - target_w) / 2.0
        y_pos = (H - target_h) / 2.0 - 50
        
        c.drawImage(main_tree_path, x_pos, y_pos, width=target_w, height=target_h, mask='auto')
        
    # Dark slate overlay to make text pop and match other pages
    c.saveState()
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.75))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
        
    # Extract data
    location = data.get("location", {})
    pins = location.get("pins", [])
    unit_count = len(pins) if pins else 1
    client_name = str(data.get("clientName") or data.get("client_name") or ("CLIENT" if lang == "en" else "KLIENT")).upper()
    
    # User explicitly requested 49 kWp for V1 tree
    per_tree_power = 49

    # 2. Top Logo and Text
    logo_path = os.path.join(assets_path, "branding", "logo_horizontal.png")
    if not os.path.exists(logo_path):
        logo_path = os.path.join(assets_path, "branding", "logo.png")
        
    if os.path.exists(logo_path):
        img_logo = utils.ImageReader(logo_path)
        lw, lh = img_logo.getSize()
        scale_l = min(350.0 / float(lw), 70.0 / float(lh))
        fin_lw = lw * scale_l
        fin_lh = lh * scale_l
        c.drawImage(logo_path, (W - fin_lw) / 2.0, H - 120, width=fin_lw, height=fin_lh, mask='auto')
    
    c.setFont("Roboto-Bold", 22)
    c.setFillColor(colors.white)
    
    if lang == "en":
        if unit_count > 1:
            top_text = f"System with Capacity of {per_tree_power * unit_count} kW"
        else:
            top_text = f"Energy Tree with Capacity of {per_tree_power} kW"
    else:
        if unit_count > 1:
            top_text = f"Soustava s Výkonem {per_tree_power * unit_count} kW"
        else:
            top_text = f"Strom s Výkonem {per_tree_power} kW"
        
    c.drawCentredString(W / 2.0, H - 170, top_text)
    
    # 4. Text inside the overlay
    c.setFillColor(colors.white)
    c.setFont("Roboto-Bold", 20)
    
    if lang == "en":
        line1 = "Commercial proposal of an alternative hybrid solution of"
        line2 = f"capacity ({unit_count}x tree x {per_tree_power} kWp)"
    else:
        line1 = "Cenová nabídka alternativního hybridního řešení o"
        line2 = f"výkonu ({unit_count}x strom x {per_tree_power} kWp)"
    
    c.drawCentredString(W / 2.0, 180, line1)
    c.drawCentredString(W / 2.0, 150, line2)
    
    # Wrap client name if it's too long
    max_w = W - 100
    font_size = 32
    font_name = "Roboto-Bold"
    from reportlab.lib.utils import simpleSplit
    lines = simpleSplit(client_name, font_name, font_size, max_w)
    while font_size > 16 and len(lines) > 2:
        font_size -= 2
        lines = simpleSplit(client_name, font_name, font_size, max_w)
        
    pro_y = 50 + (len(lines) * font_size * 1.2) + 10
    
    c.setFont("Roboto-Bold", 24)
    c.drawCentredString(W / 2.0, pro_y, "For" if lang == "en" else "Pro")
        
    c.setFont(font_name, font_size)
    y_pos = pro_y - 40
    for ln in lines:
        c.drawCentredString(W / 2.0, y_pos, ln)
        y_pos -= font_size * 1.2
    
    c.showPage()


def draw_page_2(c: canvas.Canvas, data: dict, assets_path: str):
    from reportlab.lib.utils import simpleSplit
    import os
    import math
    from reportlab.lib import colors
    import reportlab.lib.utils as utils

    lang = data.get("lang", "cs")

    # 1. Dark Background with subtle tree overlay
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    
    main_tree_path = os.path.join(assets_path, "products", "strom3.png")
    if os.path.exists(main_tree_path):
        img_cover = utils.ImageReader(main_tree_path)
        img_w, img_h = img_cover.getSize()
        
        target_w = W * 1.5
        target_h = (target_w / float(img_w)) * img_h
        x_pos = (W - target_w) / 2.0
        y_pos = (H - target_h) / 2.0
        
        c.drawImage(main_tree_path, x_pos, y_pos, width=target_w, height=target_h, mask='auto')
        
    # Dark overlay to make text pop
    c.setFillColor(colors.HexColor("#000000"))
    c.setFillAlpha(0.85)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()

    # 2. Top Logo (White)
    logo_path = os.path.join(assets_path, "branding", "logo_horizontal.png")
    if not os.path.exists(logo_path):
        logo_path = os.path.join(assets_path, "branding", "logo.png")
        
    if os.path.exists(logo_path):
        img_logo = utils.ImageReader(logo_path)
        lw, lh = img_logo.getSize()
        scale_l = min(200.0 / float(lw), 40.0 / float(lh))
        fin_lw = lw * scale_l
        fin_lh = lh * scale_l
        c.drawImage(logo_path, 40, H - 60 - fin_lh/2.0, width=fin_lw, height=fin_lh, mask='auto')

    # 3. Headers
    y_pos = H - 120
    c.setFont("Roboto-Bold", 18)
    c.setFillColor(colors.white)
    c.drawCentredString(W / 2.0, y_pos, "The Solution We Offer" if lang == "en" else "Řešení které Vám nabízíme")
    
    y_pos -= 30
    if lang == "en":
        sub_text = (
            "Treetino – the most technologically advanced autonomous power station on "
            "the market, combining solar and wind energy in the design of a technological "
            "tree. It represents a direct response to rising energy costs and stricter ESG legislation."
        )
    else:
        sub_text = (
            "Treetino – technologicky nejpokročilejší autonomní elektrárnu na "
            "trhu, která kombinuje solární a větrnou energii v designu "
            "technologického stromu. Představuje přímou odpověď na rostoucí "
            "ceny energií a zpřísňující se ESG legislativu."
        )
    c.setFont("Roboto-Bold", 12)
    lines = simpleSplit(sub_text, "Roboto-Bold", 12, W - 100)
    for line in lines:
        c.drawCentredString(W / 2.0, y_pos, line)
        y_pos -= 18

    y_pos -= 20
    c.setFont("Roboto-Bold", 16)
    c.setFillColor(colors.HexColor("#00b4d8"))
    c.drawCentredString(W / 2.0, y_pos, "4 Key Capabilities of Our Technology" if lang == "en" else "4 klíčové schopnosti naší technologie")
    
    y_pos -= 40

    # 4. Content Blocks
    if lang == "en":
        blocks = [
            {
                "title": "1) Extreme Spatial Efficiency (Area Savings)",
                "text": "Reality: Conventional solar PV requires vast roofs or acres of land.\nTreetino Solution: Occupies only 1 m² of footprint on the ground, yet thanks to its 3D canopy architecture replaces up to 400 m² of standard solar panels. Delivers up to 49 kW (ideal for powering buildings, EV fleets, or charging stations)."
            },
            {
                "title": "2) Energy Stability 24/7 (Sun + Wind)",
                "text": "We eliminate the primary flaw of standard solar. Treetino combines smart solar leaves with integrated ultra-quiet vertical wind turbines. Generates green power for your company day and night, throughout winter and in adverse weather."
            },
            {
                "title": "3) Asset Protection & AI Optimization (Higher ROI)",
                "text": "Built-in Artificial Intelligence actively tilts leaves toward the sun, increasing energy yield by 30% compared to static systems. In case of approaching storms or severe hail, AI automatically points solar leaves safely downwards to prevent property damage."
            },
            {
                "title": "4) Tangible ESG Statement & PR (Reputational Value)",
                "text": "Unlike panels hidden on the roof, Treetino is positioned prominently in front of your headquarters or corporate park. It acts as an unmistakable visual landmark demonstrating to clients, investors, and auditors that your business leads in innovation and sustainability."
            }
        ]
    else:
        blocks = [
            {
                "title": "1) Extrémní prostorová efektivita (Úspora plochy)",
                "text": "Realita: Klasická fotovoltaika vyžaduje rozsáhlé střechy nebo pozemky.\nŘešení Treetino: Zabere pouhý 1 m² na zemi, ale díky 3D architektuře koruny nahradí až 400 m² běžných solárních panelů. Má výkon až 49 kW (ideální pro napájení budov nebo firemního fleetu / EV nabíječek)."
            },
            {
                "title": "2) Energetická stabilita 24/7 (Slunce + Vítr)",
                "text": "Eliminujeme hlavní nevýhodu běžného soláru. Treetino kombinuje chytré solární listy s integrovanými tichými větrnými turbínami. Energii pro vaši firmu vyrábí ve dne, v noci, v zimě i při zhoršeném počasí."
            },
            {
                "title": "3) Ochrana investice a AI optimalizace (Vyšší ROI)",
                "text": "Vestavěná umělá inteligence (AI) aktivně natáčí listy za sluncem, což zvyšuje energetický výnos o 30 % oproti statickým systémům. V případě blížící se bouře nebo krupobití AI otočí automaticky FVE listy k zemi, čímž předchází škodám na majetku."
            },
            {
                "title": "4) Hmatatelný důkaz vaší ESG strategie a PR (Reputační hodnota)",
                "text": "Na rozdíl od panelů schovaných na střeše je Treetino umístěné před vaší centrálou nebo na firemním parkovišti. Je to nepřehlédnutelný vizuální symbol, který klientům, investorům i auditorům okamžitě demonstruje, že vaše firma je lídrem v inovacích a udržitelnosti."
            }
        ]
    
    content_width = W * 0.62
    rx = W - 90
    for i, b in enumerate(blocks):
        block_start_y = y_pos
        c.setFont("Roboto-Bold", 12)
        c.setFillColor(colors.white)
        c.drawString(40, y_pos, b["title"])
        y_pos -= 18
        
        c.setFont("Roboto", 10)
        c.setFillColor(colors.HexColor("#e2e8f0"))
        
        for paragraph in b["text"].split("\n"):
            plines = simpleSplit(paragraph, "Roboto", 10, content_width)
            for pln in plines:
                c.drawString(40, y_pos, pln)
                y_pos -= 14
                
        block_end_y = y_pos
        block_center_y = (block_start_y + block_end_y) / 2.0
        
        # Dynamic Icons Alignment
        icon_size = 40
        if i == 0:
            c.setFont("Roboto-Bold", 26)
            c.setFillColor(colors.white)
            c.drawCentredString(rx, block_center_y + 10, "49 kW")
            c.drawCentredString(rx, block_center_y - 20, "1m²")
            
        elif i == 1:
            sun_path = os.path.join(assets_path, "icons", "sun.png")
            wind_path = os.path.join(assets_path, "icons", "wind.png")
            if os.path.exists(sun_path) and os.path.exists(wind_path):
                c.drawImage(sun_path, rx - icon_size/2.0, block_center_y, width=icon_size, height=icon_size, mask='auto')
                c.drawImage(wind_path, rx - icon_size/2.0, block_center_y - icon_size + 10, width=icon_size, height=icon_size, mask='auto')
            
        elif i == 2:
            cpu_path = os.path.join(assets_path, "icons", "cpu.png")
            if os.path.exists(cpu_path):
                c.drawImage(cpu_path, rx - (icon_size+10)/2.0, block_center_y - (icon_size+10)/2.0, width=icon_size+10, height=icon_size+10, mask='auto')
                c.setFont("Roboto-Bold", 14)
                c.setFillColor(colors.white)
                c.drawCentredString(rx, block_center_y - 4, "AI")
                
        elif i == 3:
            leaf_path = os.path.join(assets_path, "icons", "leaf.png")
            if os.path.exists(leaf_path):
                c.drawImage(leaf_path, rx - (icon_size+10)/2.0, block_center_y - (icon_size+10)/2.0, width=icon_size+10, height=icon_size+10, mask='auto')

        y_pos -= 30

    # Footer
    c.setFont("Roboto", 8)
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.drawString(40, 50, "Treetino corp s.r.o.")
    c.drawString(40, 40, "IČ: 10800107")
    c.drawString(40, 30, "DIČ: CZ10800107")
    c.drawString(40, 20, "Vlčetin 62, Bílá 463 43")
    
    c.drawCentredString(W / 2, 30, "2 of 8" if lang == "en" else "2 z 8")
    
    c.showPage()


def draw_page_3(c: canvas.Canvas, data: dict, assets_path: str):
    import requests
    import io
    import math
    from PIL import Image
    import reportlab.lib.utils as utils
    import os
    
    lang = data.get("lang", "cs")

    # 1. Background
    main_tree_path = os.path.join(assets_path, "products", "strom2.png")
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    
    if os.path.exists(main_tree_path):
        img_cover = utils.ImageReader(main_tree_path)
        img_w, img_h = img_cover.getSize()
        img_ratio = img_w / img_h
        page_ratio = W / H
        if img_ratio > page_ratio:
            draw_h = H
            draw_w = H * img_ratio
        else:
            draw_w = W
            draw_h = W / img_ratio
        
        offset_x = (W - draw_w) / 2
        offset_y = (H - draw_h) / 2
        c.drawImage(main_tree_path, offset_x, offset_y, width=draw_w, height=draw_h, preserveAspectRatio=True)
    
    # Heavier overlay for dashboard feel
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.92))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    # 2. Headers
    logo_path = os.path.join(assets_path, "branding", "logo_horizontal.png")
    if not os.path.exists(logo_path):
        logo_path = os.path.join(assets_path, "branding", "logo.png")
        
    if os.path.exists(logo_path):
        img_logo = utils.ImageReader(logo_path)
        lw, lh = img_logo.getSize()
        scale_l = min(150.0 / float(lw), 40.0 / float(lh))
        fin_lw = lw * scale_l
        fin_lh = lh * scale_l
        c.drawImage(logo_path, 40, H - 60 - fin_lh/2.0, width=fin_lw, height=fin_lh, mask='auto')

    c.setFont("Roboto-Bold", 9)
    c.setFillColor(colors.HexColor("#38bdf8")) # Accent blue
    c.drawString(40, H - 100, "TECHNICAL PERFORMANCE ANALYSIS" if lang == "en" else "TECHNICKÁ ANALÝZA VÝKONU")
    
    c.setFont("Roboto-Bold", 24)
    c.setFillColor(colors.white)
    prefix_str = "Simulation & ROI for " if lang == "en" else "Simulace a návratnost pro "
    c.drawString(40, H - 130, prefix_str)
    c.setFillColor(colors.HexColor("#38bdf8"))
    client_name = str(data.get("clientName") or data.get("client_name") or ("COMPANY NAME" if lang == "en" else "NÁZEV FIRMY"))
    c.drawString(40 + c.stringWidth(prefix_str, "Roboto-Bold", 24), H - 130, str(client_name))
    
    c.setFont("Roboto", 10)
    c.setFillColor(colors.HexColor("#94a3b8"))
    if lang == "en":
        desc = "Advanced autonomous power generator combining solar and wind energy."
        desc2 = "A direct answer to rising energy costs and stricter ESG legislation."
    else:
        desc = "Pokročilá autonomní elektrárna kombinující solární a větrnou energii."
        desc2 = "Přímá odpověď na rostoucí ceny energií a zpřísňující se ESG legislativu."
    c.drawString(40, H - 150, desc)
    c.drawString(40, H - 165, desc2)
    
    card_bg = colors.Color(0.12, 0.16, 0.23, alpha=0.8) # Slate 800 with opacity
    card_radius = 8
    
    # 3. Map Card
    map_w = 230
    map_h = 240
    map_x = 40
    map_y = H - 430
    
    c.setFillColor(card_bg)
    c.roundRect(map_x, map_y, map_w, map_h, card_radius, fill=1, stroke=0)
    
    try:
        import json
        location = data.get("location") or {}
        pins = location.get("pins", [])
        if not pins and data.get("pins_json"):
            try:
                pins = json.loads(data["pins_json"]) if isinstance(data["pins_json"], str) else data["pins_json"]
            except Exception:
                pass
        if not pins and (location.get("lat") or data.get("lat")):
            lat_val = location.get("lat") or data.get("lat")
            lon_val = location.get("lon") or location.get("lng") or data.get("lon") or data.get("lng")
            if lat_val and lon_val:
                pins = [{"lat": float(lat_val), "lng": float(lon_val)}]
            
        sw, sh = 500, 500
        if pins:
            center_lat = sum(p["lat"] for p in pins) / len(pins)
            center_lon = sum((p.get("lng") if p.get("lng") is not None else p.get("lon", 0)) for p in pins) / len(pins)
            zoom = 19.0
        else:
            center_lat, center_lon = 50.088, 14.42
            zoom = 19.0
        
        token = data.get("mapboxToken", "")
        if not token:
            token = os.environ.get("VITE_MAPBOX_TOKEN", "")
            if not token:
                env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
                if os.path.exists(env_path):
                    with open(env_path, "r") as f:
                        for line in f:
                            if line.startswith("VITE_MAPBOX_TOKEN="):
                                token = line.split("=", 1)[1].strip()
                                break
            
        url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{center_lon},{center_lat},{zoom},0/{sw}x{sh}@2x?access_token={token}"
        img = None
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
        except Exception:
            pass
        if img is None:
            img = Image.new("RGBA", (sw * 2, sh * 2), (18, 28, 42, 255))
        
        # Add pins
        map_image_path = os.path.join(assets_path, "products", "top_view.png")
        if not os.path.exists(map_image_path): map_image_path = os.path.join(assets_path, "top_view.png")
        if os.path.exists(map_image_path):
            img_w, img_h = img.size
            # Mapbox base tile size at scale 1 is 512 px. Since we request @2x, it is 512 * (img_w / sw) = 1024 px.
            physical_tile_size = 512 * (img_w / sw)
            
            # Tree is 17 meters wide
            meters_per_pixel = (40075016.686 * math.cos(math.radians(center_lat))) / (physical_tile_size * (2 ** zoom))
            pixels_per_meter = 1 / meters_per_pixel if meters_per_pixel > 0 else 1
            tree_size = max(10, int(17 * pixels_per_meter))
            
            tree_icon = Image.open(map_image_path).convert("RGBA")
            tree_icon = tree_icon.resize((tree_size, tree_size), Image.Resampling.LANCZOS)
            
            def latlon_to_pixels(lon, lat, z):
                n = 2.0 ** z
                x = (lon + 180.0) / 360.0 * n * physical_tile_size
                y = (1.0 - math.log(math.tan(math.radians(lat)) + (1.0 / math.cos(math.radians(lat)))) / math.pi) / 2.0 * n * physical_tile_size
                return x, y
                
            mcx, mcy = latlon_to_pixels(center_lon, center_lat, zoom)
            from PIL import ImageDraw
            
            # Draw glowing highlight overlays
            overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
            draw_overlay = ImageDraw.Draw(overlay)
            
            for p in pins:
                pin_lat = p["lat"]
                pin_lon = p.get("lng") if p.get("lng") is not None else p.get("lon", center_lon)
                px, py = latlon_to_pixels(pin_lon, pin_lat, zoom)
                ix = int(img_w / 2 + (px - mcx)) - tree_size // 2
                iy = int(img_h / 2 + (py - mcy)) - tree_size // 2
                
                # Center point of the tree pin
                cx = ix + tree_size // 2
                cy = iy + tree_size // 2
                
                # 1. Semi-transparent cyan spotlight glow
                glow_r = (tree_size // 2) + 24
                draw_overlay.ellipse(
                    [cx - glow_r, cy - glow_r, cx + glow_r, cy + glow_r],
                    fill=(56, 189, 248, 30),  # #38bdf8 with ~12% opacity
                    outline=None
                )
                
                # 2. Outer thin target ring
                outer_r = glow_r
                draw_overlay.ellipse(
                    [cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r],
                    outline=(56, 189, 248, 120),  # ~47% opacity
                    width=2
                )
                
                # 3. Inner solid highlight ring
                inner_r = (tree_size // 2) + 6
                draw_overlay.ellipse(
                    [cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
                    outline=(56, 189, 248, 255),  # Opaque cyan
                    width=4
                )
                
                # 4. Target locator crosshair ticks
                tick_len = 8
                # Top tick
                draw_overlay.line([cx, cy - outer_r - 2, cx, cy - outer_r + tick_len], fill=(56, 189, 248, 200), width=3)
                # Bottom tick
                draw_overlay.line([cx, cy + outer_r + 2, cx, cy + outer_r - tick_len], fill=(56, 189, 248, 200), width=3)
                # Left tick
                draw_overlay.line([cx - outer_r - 2, cy, cx - outer_r + tick_len, cy], fill=(56, 189, 248, 200), width=3)
                # Right tick
                draw_overlay.line([cx + outer_r + 2, cy, cx + outer_r - tick_len, cy], fill=(56, 189, 248, 200), width=3)
                
                img.paste(tree_icon, (ix, iy), tree_icon)
                
            img = Image.alpha_composite(img, overlay)
        
        final_io = io.BytesIO()
        img.convert("RGB").save(final_io, format="JPEG", quality=90)
        final_io.seek(0)
        
        c.saveState()
        path = c.beginPath()
        path.roundRect(map_x, map_y, map_w, map_h, card_radius)
        c.clipPath(path, stroke=0, fill=0)
        c.drawImage(utils.ImageReader(final_io), map_x, map_y, width=map_w, height=map_h, preserveAspectRatio=False)
        c.restoreState()
    except Exception as e:
        print("Map error:", e)

    # DATA
    result = data.get("result", {})
    annualYield = (result.get("annualSolarKwh", 0) + result.get("annualWindKwh", 0))
    spotreba_amount = data.get("consumptionOverride")
    if spotreba_amount is None:
        spotreba_amount = data.get("building_consumption") or result.get("buildingConsumption", 360.0)
    spotreba_amount = float(spotreba_amount)
    
    monthly = result.get("monthlyData", [])
    if not monthly:
        # Fallback monthly distribution for Central Europe
        solar_monthly_dist = [0.03, 0.05, 0.09, 0.11, 0.14, 0.14, 0.14, 0.12, 0.09, 0.06, 0.04, 0.03]
        wind_monthly_dist = [0.10, 0.095, 0.09, 0.08, 0.07, 0.065, 0.06, 0.065, 0.075, 0.09, 0.10, 0.11]
        base_solar = float(result.get("annualSolarKwh") or 13800.0)
        base_wind = float(result.get("annualWindKwh") or 46656.0)
        monthly = [
            {
                "month": ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"][i],
                "solar": base_solar * solar_monthly_dist[i],
                "wind": base_wind * wind_monthly_dist[i]
            }
            for i in range(12)
        ]
    
    # 4. Production Graph Card
    prod_x = 290
    prod_y = H - 430
    prod_w = W - 330
    prod_h = 240
    
    c.setFillColor(card_bg)
    c.roundRect(prod_x, prod_y, prod_w, prod_h, card_radius, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 12)
    c.setFillColor(colors.white)
    c.drawString(prod_x + 20, prod_y + prod_h - 25, "Estimated Monthly Energy" if lang == "en" else "Odhadovaná energie za měsíc")
    
    c.setFont("Roboto", 7)
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.drawRightString(prod_x + prod_w - 20, prod_y + prod_h - 25, "MWh / Month" if lang == "en" else "MWh / Měsíc")
    
    # Chart logic
    chart_x = prod_x + 20
    chart_w = prod_w - 40
    chart_y = prod_y + 30
    chart_h = prod_h - 75
    
    max_val_mwh = 0
    for m in monthly:
        s = m.get("solar", 0)/1000.0
        w = m.get("wind", 0)/1000.0
        cons = spotreba_amount / 12.0
        if (s+w) > max_val_mwh: max_val_mwh = s+w
        if cons > max_val_mwh: max_val_mwh = cons
    if max_val_mwh <= 0: max_val_mwh = 1
    max_val_rounded = int(math.ceil(max_val_mwh / 5.0) * 5)
    if max_val_rounded == 0: max_val_rounded = 5
    
    group_w = chart_w / 12.0
    bar_w = 12 
    
    for i, m in enumerate(monthly):
        s_mwh = m.get("solar", 0)/1000.0
        w_mwh = m.get("wind", 0)/1000.0
        cons_mwh = spotreba_amount / 12.0
        prod_total = s_mwh + w_mwh
        
        prod_h_px = (prod_total / max_val_rounded) * chart_h
        cons_h_px = (cons_mwh / max_val_rounded) * chart_h
        solar_h_px = (s_mwh / max_val_rounded) * chart_h
        wind_h_px = (w_mwh / max_val_rounded) * chart_h
        
        bx = chart_x + i * group_w + (group_w - bar_w) / 2.0
        
        # Consumption background bar (Grid used)
        c.setFillColor(colors.HexColor("#334155"))
        c.roundRect(bx, chart_y, bar_w, cons_h_px, 2, fill=1, stroke=0)
        
        # Production stacked: Solar bottom (navy), Wind top (cyan)
        if prod_total > 0:
            c.setFillColor(colors.HexColor("#1e3a8a"))
            c.roundRect(bx, chart_y, bar_w, solar_h_px, 1, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#38bdf8"))
            c.roundRect(bx, chart_y + solar_h_px, bar_w, wind_h_px, 1, fill=1, stroke=0)
        
        # X Axis labels
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.setFont("Roboto-Bold", 6)
        if lang == "en":
            months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        else:
            months = ["LED", "ÚNO", "BŘE", "DUB", "KVĚ", "ČVN", "ČVC", "SRP", "ZÁŘ", "ŘÍJ", "LIS", "PRO"]
        if i < len(months):
            c.drawCentredString(bx + bar_w/2, chart_y - 10, months[i])

    # 5. System Loss Diagram Card
    loss_x = 40
    loss_y = H - 760
    loss_w = W - 80
    loss_h = 310
    
    c.setFillColor(card_bg)
    c.roundRect(loss_x, loss_y, loss_w, loss_h, card_radius, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 12)
    c.setFillColor(colors.white)
    c.drawString(loss_x + 20, loss_y + loss_h - 25, "System Loss Diagram" if lang == "en" else "Diagram ztrát systému")
    
    c.setStrokeColor(colors.HexColor("#334155"))
    c.line(loss_x + 20, loss_y + loss_h - 35, loss_x + loss_w - 20, loss_y + loss_h - 35)
    
    vyroba_mwh_str = "{:.2f}".format(annualYield / 1000.0).replace(".", "," if lang != "en" else ".")
    if lang == "en":
        items = [
            ("Global horizontal irradiance (GHI)", "1.16 MWh/m²", 100, "+1.78%", True),
            ("Shading and horizon loss", "-4.88%", 95, None, False),
            ("Energy after PV conversion", "158.38 MWh", 95, None, True),
            ("Electrical shading mismatch loss", "-3.67%", 91, None, False),
            ("Ohmic wiring DC loss", "-0.57%", 91, None, False),
            ("Inverter conversion efficiency loss", "-2.28%", 89, None, False)
        ]
    else:
        items = [
            ("Globální záření na horizontální rovinu", "1,16 MWh/m²", 100, "+1.78%", True),
            ("Ztráta osvitu zastíněním", "-4,88%", 95, None, False),
            ("Energie po FV konverzi", "158,38 MWh", 95, None, True),
            ("Elektrické ztráty zastíněním", "-3,67%", 91, None, False),
            ("Ohmické ztráty na vedení DC", "-0,57%", 91, None, False),
            ("Ztráta - účinnost střídače", "-2,28%", 89, None, False)
        ]
    
    start_y = loss_y + loss_h - 65
    row_h = 36
    bar_track_h = 6
    
    for i, (label, val, pct, extra, is_main) in enumerate(items):
        cy = start_y - i * row_h
        
        c.setFont("Roboto-Bold" if is_main else "Roboto", 8)
        c.setFillColor(colors.white if is_main else colors.HexColor("#94a3b8"))
        c.drawString(loss_x + 20, cy, label)
        
        c.setFont("Roboto-Bold" if is_main else "Roboto", 8)
        c.setFillColor(colors.HexColor("#38bdf8") if is_main else colors.HexColor("#fda4af"))
        c.drawRightString(loss_x + loss_w - 20, cy, val)
        
        if is_main:
            c.setFillColor(colors.HexColor("#0f172a"))
            c.roundRect(loss_x + 20, cy - 10, loss_w - 40, bar_track_h, 3, fill=1, stroke=0)
            fill_w = (loss_w - 40) * (pct / 100.0)
            c.setFillColor(colors.HexColor("#38bdf8"))
            c.roundRect(loss_x + 20, cy - 10, fill_w, bar_track_h, 3, fill=1, stroke=0)
        else:
            c.setFillColor(colors.HexColor("#fda4af"))
            c.roundRect(loss_x + loss_w - 40, cy - 10, 20, bar_track_h, 3, fill=1, stroke=0)
            
    c.setStrokeColor(colors.HexColor("#334155"))
    c.line(loss_x + 20, loss_y + 35, loss_x + loss_w - 20, loss_y + 35)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(colors.white)
    c.drawString(loss_x + 20, loss_y + 15, "Total Annual Yield" if lang == "en" else "Vyrobená energie celkem")
    c.setFillColor(colors.HexColor("#38bdf8"))
    c.drawRightString(loss_x + loss_w - 20, loss_y + 15, f"{vyroba_mwh_str} MWh")

    # 6. Meteorological Station info
    location = data.get("location") or {}
    lat = float(location.get("lat") or data.get("lat") or 50.0880)
    lon = float(location.get("lon") or location.get("lng") or data.get("lon") or data.get("lng") or 14.4200)
    if lang == "en":
        station_text = f"Satellite Grid Location: {lat:.4f}°N, {lon:.4f}°E, Source: PVGIS & Open-Meteo"
    else:
        station_text = f"Satelitní grid lokalita: {lat:.4f}°N, {lon:.4f}°E, Zdroj: PVGIS & Open-Meteo"
    c.setFont("Roboto", 8)
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.drawCentredString(W/2, 60, station_text)

    # Footer
    c.setFont("Roboto", 8)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(40, 50, "Treetino corp s.r.o.")
    c.drawString(40, 40, "IČ: 10800107")
    c.drawString(40, 30, "DIČ: CZ10800107")
    c.drawString(40, 20, "Vlčetin 62, Bílá 463 43")
    
    c.drawCentredString(W / 2, 30, "3 of 8" if lang == "en" else "3 z 6")
    c.showPage()


def draw_page_4(c: canvas.Canvas, data: dict, assets_path: str):
    result = data.get("result", {})
    annualYield = (result.get("annualSolarKwh", 0) + result.get("annualWindKwh", 0))

    consumption_override = data.get("consumptionOverride", None)
    if consumption_override is not None:
        spotreba_amount = consumption_override
    else:
        spotreba_amount = result.get("buildingConsumption", 360.0)

    monthly = result.get("monthlyData", [])
    total_consumed_from_solar = 0
    total_production = 0
    
    for m in monthly:
        sol_mwh = m.get("solar", 0) / 1000.0
        wind_mwh = m.get("wind", 0) / 1000.0
        cons_mwh = spotreba_amount / 12.0
        
        prod_mwh = sol_mwh + wind_mwh
        total_production += prod_mwh
        
        local_used = min(prod_mwh, cons_mwh)
        total_consumed_from_solar += local_used

    vyroba_mwh = "{:.2f}".format(total_production).replace(".", ",")
    spotreba_mwh = "{:.2f}".format(spotreba_amount).replace(".", ",")
    
    do_budovy_val = total_consumed_from_solar
    do_site_val = total_production - total_consumed_from_solar
    
    z_sol_val = total_consumed_from_solar
    z_site_val = spotreba_amount - total_consumed_from_solar
    
    do_budovy = "{:.2f}".format(do_budovy_val).replace(".", ",")
    do_site = "{:.2f}".format(do_site_val).replace(".", ",")
    
    z_sol_mwh = "{:.2f}".format(z_sol_val).replace(".", ",")
    z_site_mwh = "{:.2f}".format(z_site_val).replace(".", ",")

    vyroba_pct = int((do_budovy_val / total_production * 100)) if total_production > 0 else 0
    spotreba_pct = int((z_sol_val / spotreba_amount * 100)) if spotreba_amount > 0 else 0
    
    # ------------------ 2. MONTHLY BAR CHART ------------------ #
    c.setFont("Roboto-Bold", 16) 
    c.setFillColor(colors.black)
    c.drawString(40, H - 50, "ODHADOVANÁ ENERGIE ZA MĚSÍC")
    
    max_val_mwh = 0
    for m in monthly:
        s = m.get("solar", 0)/1000.0
        w = m.get("wind", 0)/1000.0
        cmp_spotreba = spotreba_amount / 12.0
        if (s+w) > max_val_mwh: max_val_mwh = s+w
        if cmp_spotreba > max_val_mwh: max_val_mwh = cmp_spotreba
        
    if max_val_mwh <= 0: max_val_mwh = 1
    
    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.setLineWidth(0.5)
    c.setFont("Roboto", 8)
    c.setFillColor(colors.HexColor("#64748b"))
    
    import math
    max_val_rounded = int(math.ceil(max_val_mwh / 5.0) * 5)
    if max_val_rounded == 0: max_val_rounded = 5
    
    chart_h = 300
    chart_y = H - 420
    grid_lines = 7
    
    # Draw horizontal grid & labels
    for j in range(grid_lines + 1):
        y_pos = chart_y + j * (chart_h / float(grid_lines))
        c.line(70, y_pos, W - 200, y_pos) 
        
        label_val = int(round(j * (max_val_rounded / float(grid_lines))))
        c.drawRightString(60, y_pos - 3, f"{label_val} MWh")
    
    group_w = (W - 270) / 12.0
    bar_w = 10 
    pair_gap = 2
    
    for i, m in enumerate(monthly):
        s_mwh = m.get("solar", 0)/1000.0
        w_mwh = m.get("wind", 0)/1000.0
        cons_mwh = spotreba_amount / 12.0
        
        prod_total = s_mwh + w_mwh
        prod_s_h = (s_mwh / max_val_rounded) * chart_h
        prod_w_h = (w_mwh / max_val_rounded) * chart_h
        
        local_used = min(prod_total, cons_mwh)
        grid_used = cons_mwh - local_used
        cons_blue_h = (local_used / max_val_rounded) * chart_h
        cons_orng_h = (grid_used / max_val_rounded) * chart_h
        
        # Proper spacing math: total width utilized is bar_w + pair_gap + bar_w = 22.
        # Leaves group_w - 22 = 5px gap between months!
        x_left = 70 + i * group_w + (group_w - (bar_w * 2 + pair_gap)) / 2.0
        x_right = x_left + bar_w + pair_gap
        
        # Solar (Light Green) at bottom, Wind (Dark Green) stacked on top
        c.setFillColor(colors.HexColor("#6ee7b7"))
        c.rect(x_left, chart_y, bar_w, prod_s_h, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#10b981"))
        c.rect(x_left, chart_y + prod_s_h, bar_w, prod_w_h, fill=1, stroke=0)
        
        # Ze solaru (Blue) at bottom, From Grid (Orange) stacked on top
        c.setFillColor(colors.HexColor("#60a5fa"))
        c.rect(x_right, chart_y, bar_w, cons_blue_h, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#fbbf24"))
        c.rect(x_right, chart_y + cons_blue_h, bar_w, cons_orng_h, fill=1, stroke=0)
        
        c.setFillColor(colors.black)
        c.setFont("Roboto-Bold", 8)
        if i % 3 == 0:
            c.drawCentredString(x_left + bar_w + (pair_gap/2), chart_y - 15, str(m.get("month", "")))
            
    leg_x = W - 180
    leg_y = chart_y + chart_h - 40
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(colors.HexColor("#1e293b"))
    c.drawString(leg_x, leg_y, "Výroba")
    
    # 1. Dark Green - VTE (Turbine icon vector)
    c.setFillColor(colors.HexColor("#10b981"))
    c.circle(leg_x + 5, leg_y - 18, 3, fill=1, stroke=0)
    # Draw simple turbine
    bx, by = leg_x + 18, leg_y - 18
    c.setStrokeColor(colors.HexColor("#334155"))
    c.setLineWidth(1)
    c.line(bx, by-4, bx, by+2) # pole
    c.line(bx, by+2, bx-3, by+5) # left blade
    c.line(bx, by+2, bx+3, by+5) # right blade
    c.line(bx, by+2, bx, by-2) # down blade element
    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Roboto", 8)
    c.drawString(leg_x + 28, leg_y - 21, "VTE")
    
    # 2. Light Green - Do budovy (House icon vector)
    c.setFillColor(colors.HexColor("#6ee7b7"))
    c.circle(leg_x + 5, leg_y - 38, 3, fill=1, stroke=0)
    bx, by = leg_x + 18, leg_y - 38
    c.setStrokeColor(colors.HexColor("#334155"))
    c.rect(bx-4, by-4, 8, 5, stroke=1, fill=0) # house base
    c.line(bx-5, by+1, bx, by+5) # roof left
    c.line(bx, by+5, bx+5, by+1) # roof right
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(leg_x + 28, leg_y - 41, "Do budovy")
    
    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.line(leg_x, leg_y - 55, W - 40, leg_y - 55)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(colors.HexColor("#1e293b"))
    c.drawString(leg_x, leg_y - 75, "Spotřeba")
    
    # 3. Orange - From Grid (Pylon icon vector)
    c.setFillColor(colors.HexColor("#fbbf24"))
    c.circle(leg_x + 5, leg_y - 93, 3, fill=1, stroke=0)
    bx, by = leg_x + 18, leg_y - 93
    c.setStrokeColor(colors.HexColor("#334155"))
    c.line(bx-2, by-4, bx, by+4) # left strut
    c.line(bx+2, by-4, bx, by+4) # right strut
    c.line(bx-4, by+1, bx+4, by+1) # crossbar 1
    c.line(bx-3, by-1, bx+3, by-1) # crossbar 2
    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Roboto", 8)
    c.drawString(leg_x + 28, leg_y - 96, "Ze sítě")
    
    # 4. Blue - Ze solaru (Solar panel vector)
    c.setFillColor(colors.HexColor("#60a5fa"))
    c.circle(leg_x + 5, leg_y - 113, 3, fill=1, stroke=0)
    bx, by = leg_x + 18, leg_y - 113
    c.setStrokeColor(colors.HexColor("#334155"))
    c.rect(bx-4, by-3, 8, 6, stroke=1, fill=0) # panel box
    c.line(bx, by-3, bx, by+3) # middle split
    c.line(bx+1, by-3, bx+2, by+3)
    c.line(bx-4, by, bx+4, by) # cross split
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(leg_x + 28, leg_y - 116, "Ze solárů")

    # Company Signature block
    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Roboto", 8)
    sig_lines = [
        "Wattino",
        "Treetino corp s.r.o.",
        "IČ: 10800107",
        "DIČ:CZ10800107",
        "Český Šternberk 9, 257 26"
    ]
    for idx, s_line in enumerate(sig_lines):
        c.drawString(40, 80 - (idx * 12), s_line)

    # Page num
    c.setFillColor(colors.black)
    c.setFont("Roboto", 10)
    c.drawCentredString(W / 2, 30, "4 z 8")
    c.showPage()
    

def draw_page_5(c: canvas.Canvas, data: dict, assets_path: str):
    result = data.get("result", {})
    annualYield = float(result.get("annualSolarKwh", 0)) + float(result.get("annualWindKwh", 0))
    vyroba_mwh = "{:.2f}".format(annualYield / 1000.0).replace(".", ",")
    
    from datetime import datetime
    now = datetime.now()
    today_str = f"{now.day}. {now.month}. {now.year}"
    
    # Fonts & Colors
    TEXT_COLOR = colors.white
    MUTED_COLOR = colors.HexColor("#94a3b8")
    ACCENT_COLOR = colors.HexColor("#38bdf8")
    CARD_BG = colors.Color(0.12, 0.16, 0.23, alpha=0.8) # Slate 800 with opacity
    LINE_COLOR = colors.HexColor("#334155")
    RED_COLOR = colors.HexColor("#f43f5e")
    GREEN_COLOR = colors.HexColor("#10b981")
    
    # 1. Background
    import reportlab.lib.utils as utils
    from PIL import Image
    import io
    main_tree_path = os.path.join(assets_path, "products", "Still_Turbina.png")
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    
    if os.path.exists(main_tree_path):
        img_cover = utils.ImageReader(main_tree_path)
        c.drawImage(main_tree_path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    
    # Heavy overlay
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.92))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    # 2. HEADER
    c.setFont("Roboto-Bold", 8)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(40, H - 40, "SIMULAČNÍ PROTOKOL")
    
    c.setFont("Roboto-Bold", 28)
    c.setFillColor(TEXT_COLOR)
    c.drawString(40, H - 70, "ZTRÁTY & PARAMETRY")
    
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    c.drawString(40, H - 85, f"Detailní technická specifikace | {today_str}")
    
    # 3. DIAGRAM ZTRÁT SYSTÉMU (Waterfall)
    card1_y = H - 540
    card1_h = 420
    card_w = W - 80
    
    c.setFillColor(CARD_BG)
    c.roundRect(40, card1_y, card_w, card1_h, 6, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(TEXT_COLOR)
    c.drawString(60, card1_y + card1_h - 25, "Diagram ztrát systému")
    
    c.setStrokeColor(LINE_COLOR)
    c.line(40, card1_y + card1_h - 40, W - 40, card1_y + card1_h - 40)
    
    items = [
        ("Globální záření na horizontální rovinu", "1,16 MWh/m²", "+1,78%", True, 1.0, 1.02),
        ("Globální záření na fotovoltaické panely", "", "", False, 0, 0),
        ("Ztráta osvitu zastíněním", "", "-4,88%", False, 1.02, -0.05),
        ("Ztráta odrazem", "", "-4,02%", False, 0.97, -0.04),
        ("Energie po FV konverzi", "158,38 MWh", "", True, 0.93, 0.93),
        ("Ztráta - intenzita záření", "", "-1,71%", False, 0.93, -0.02),
        ("Teplotní ztráta", "", "-0,58%", False, 0.91, -0.01),
        ("Elektrické ztráty zastíněním", "", "-3,67%", False, 0.90, -0.04),
        ("Ztráta - kvalita panelu", "", "+0,25%", False, 0.86, 0.01),
        ("Ztráta - účinnost optimizéru", "", "-0,97%", False, 0.87, -0.01),
        ("Ohmické ztráty na vedení DC", "", "-0,57%", False, 0.86, -0.01),
        ("Energie po DC ztrátách", "147,17 MWh", "", True, 0.85, 0.85),
        ("Ztráta - účinnost střídače", "", "-2,28%", False, 0.85, -0.02),
        ("Vyrobená energie", f"{vyroba_mwh} MWh", "", True, 0.83, 0.83)
    ]
    
    y_start = card1_y + card1_h - 65
    bar_x = 320
    max_bar_w = W - 40 - bar_x - 50 # 185
    
    for idx, (label, val, diff, is_main, start_f, len_f) in enumerate(items):
        y = y_start - (idx * 24)
        
        if is_main:
            c.setFont("Roboto-Bold", 9)
            c.setFillColor(ACCENT_COLOR)
            c.drawString(60, y, label)
            c.setFillColor(TEXT_COLOR)
            c.drawRightString(280, y, val)
            if diff:
                c.setFillColor(GREEN_COLOR)
                c.drawRightString(310, y, diff)
                
            # Draw main bar
            c.setFillColor(colors.HexColor("#1e293b"))
            c.roundRect(bar_x, y - 2, max_bar_w, 10, 3, fill=1, stroke=0)
            c.setFillColor(ACCENT_COLOR)
            c.roundRect(bar_x, y - 2, max_bar_w * len_f, 10, 3, fill=1, stroke=0)
            
        else:
            c.setFont("Roboto", 9)
            c.setFillColor(MUTED_COLOR)
            c.drawString(60, y, label)
            
            if diff:
                c.setFillColor(RED_COLOR if "-" in diff else GREEN_COLOR)
                c.drawRightString(310, y, diff)
                
                # Draw waterfall delta block
                base_x = bar_x + (max_bar_w * start_f)
                block_w = max_bar_w * abs(len_f)
                c.setFillColor(RED_COLOR if "-" in diff else GREEN_COLOR)
                c.roundRect(base_x - (block_w if "-" in diff else 0), y - 1, block_w, 8, 2, fill=1, stroke=0)
    
    # 4. PARAMETRY SIMULACE
    card2_y = card1_y - 190
    card2_h = 170
    
    c.setFillColor(CARD_BG)
    c.roundRect(40, card2_y, card_w, card2_h, 6, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(TEXT_COLOR)
    c.drawString(60, card2_y + card2_h - 25, "Parametry simulace")
    
    c.setStrokeColor(LINE_COLOR)
    c.line(40, card2_y + card2_h - 40, W - 40, card2_y + card2_h - 40)
    
    # Left Column
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(60, card2_y + card2_h - 60, "POLOHA & SÍŤ")
    
    location = data.get("location", {})
    lat = location.get("lat", 0)
    lon = location.get("lon", 0)
    from datetime import datetime
    today_str = datetime.now().strftime("%d. %m. %Y")
    
    params_left = [
        ("Datum simulace", f"{today_str} (SEČ)"),
        ("Meteorologická stanice", f"Grid {lat:.4f}°N, {lon:.4f}°E"),
        ("Nadmořská výška stanice", "Dle digitálního modelu terénu"),
        ("Zdroj dat", "PVGIS SARAH2 & Open-Meteo ERA5"),
        ("Síť", "400V L-L, 230V L-N")
    ]
    
    for idx, (label, val) in enumerate(params_left):
        y = card2_y + card2_h - 80 - (idx * 16)
        c.setFont("Roboto", 8)
        c.setFillColor(MUTED_COLOR)
        c.drawString(60, y, label)
        c.setFillColor(TEXT_COLOR)
        c.drawRightString(280, y, val)
        
    # Divider
    c.setStrokeColor(LINE_COLOR)
    c.line(W/2, card2_y + 20, W/2, card2_y + card2_h - 50)
    
    # Right Column
    t1_x = W / 2 + 20
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(t1_x, card2_y + card2_h - 60, "FAKTORY ZTRÁT")
    
    params_right = [
        ("Blízké zastínění", "Povoleno"),
        ("Albedo", "0,20"),
        ("Bifaciální Albedo", "0,30"),
        ("Znečištění/Sníh", "0%"),
        ("Modifikátor úhlu dopadu (IAM)", "0,05"),
        ("Faktor tepelné ztráty Uc (const)", "20 (Zapuštěná montáž)"),
        ("Faktor tepelné ztráty Uc (const)", "29 (Montáž ve sklonu)")
    ]
    
    for idx, (label, val) in enumerate(params_right):
        y = card2_y + card2_h - 80 - (idx * 16)
        c.setFont("Roboto", 8)
        c.setFillColor(MUTED_COLOR)
        c.drawString(t1_x, y, label)
        c.setFillColor(TEXT_COLOR)
        c.drawRightString(W - 60, y, val)
        
    # 5. FOOTER
    c.setFillColor(MUTED_COLOR)
    c.setFont("Roboto", 9)
    sig_lines = [
        "Wattino",
        "Treetino corp s.r.o.",
        "(Wattino holding)",
        "IČ: 10800107",
        "DIČ: CZ10800107",
        "Český Šternberk 9, 257 26"
    ]
    for idx, s_line in enumerate(sig_lines):
        c.drawString(40, 80 - (idx * 11), s_line)

    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Roboto", 10)
    c.drawCentredString(W / 2, 25, "5 z 6")
    c.showPage()


def draw_page_6(c: canvas.Canvas, data: dict, assets_path: str):
    result = data.get("result", {})
    lang = data.get("lang", "cs")
    
    from datetime import datetime
    now = datetime.now()
    if lang == "en":
        today_str = f"{now.strftime('%B %d, %Y')}"
    else:
        today_str = f"{now.day}. {now.month}. {now.year}"
    
    # Fonts & Colors
    TEXT_COLOR = colors.white
    MUTED_COLOR = colors.HexColor("#94a3b8")
    ACCENT_COLOR = colors.HexColor("#38bdf8")
    CARD_BG = colors.Color(0.12, 0.16, 0.23, alpha=0.8)
    LINE_COLOR = colors.HexColor("#334155")
    
    def format_czk(val):
        if lang == "en":
            return "{:,.2f}".format(float(val)) + " CZK"
        return "{:,.2f}".format(float(val)).replace(",", " ").replace(".", ",") + " Kč"
        
    def format_units(val):
        if lang == "en":
            return "{:,.2f}".format(float(val))
        return "{:,.2f}".format(float(val)).replace(",", " ").replace(".", ",")

    location = data.get("location") or {}
    pins = location.get("pins", [])
    if not pins and data.get("pins_json"):
        try:
            import json
            pins = json.loads(data["pins_json"]) if isinstance(data["pins_json"], str) else data["pins_json"]
        except Exception:
            pass
    if not pins and (location.get("lat") or data.get("lat")):
        lat_val = location.get("lat") or data.get("lat")
        lon_val = location.get("lon") or location.get("lng") or data.get("lon") or data.get("lng")
        if lat_val and lon_val:
            pins = [{"lat": float(lat_val), "lng": float(lon_val)}]
    units_qty = len(pins) if pins else 1
    
    first_pin_type = pins[0].get("type", "main-tree") if pins else "main-tree"
    product_name_mapping = {
        "main-tree": "Treetino V1",
        "small-tree": "Treetino V2",
        "standalone-turbine": "Turbine T1"
    }
    product_name = product_name_mapping.get(first_pin_type, "Treetino V1")
    
    product_base_price = {
        "main-tree": 4900000.0,
        "small-tree": 1500000.0,
        "standalone-turbine": 100000.0
    }.get(first_pin_type, 4900000.0)

    total_before_discount = float(result.get("totalBeforeDiscount") or (product_base_price * units_qty))
    discount_percent = float(result.get('discountPercent') or data.get('discount') or 0.0)
    discount_amount = float(result.get("discountAmount") or (total_before_discount * (discount_percent / 100.0)))
    final_price = float(result.get("finalPrice") or (total_before_discount - discount_amount))
    vat_percent = 21.0
    vat_amount = final_price * (vat_percent / 100.0)
    final_price_vat = final_price + vat_amount
    subsidy_amount = final_price * 0.30
    subsidy_price = float(result.get("subsidyPrice") or (final_price * 0.70))
    unit_price = total_before_discount / max(1, units_qty)
    
    client_name = data.get("clientName") or data.get("client_name") or "M - KOVO s.r.o."
    client_address = data.get("clientAddress") or data.get("client_address") or ("Not specified" if lang == "en" else "Nezadáno")
    ico_val = data.get("ico", "") or ("Not specified" if lang == "en" else "Nezadáno")
    dic_val = data.get("dic", "") or ("Not specified" if lang == "en" else "Nezadáno")

    # 1. Background
    import reportlab.lib.utils as utils
    from PIL import Image
    import io
    main_tree_path = os.path.join(assets_path, "products", "Still_Strom-v2.png")
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    
    if os.path.exists(main_tree_path):
        img_cover = utils.ImageReader(main_tree_path)
        img_w, img_h = img_cover.getSize()
        img_ratio = img_w / img_h
        page_ratio = W / H
        if img_ratio > page_ratio:
            draw_h = H
            draw_w = H * img_ratio
        else:
            draw_w = W
            draw_h = W / img_ratio
        
        offset_x = (W - draw_w) / 2
        offset_y = (H - draw_h) / 2
        # Use preserveAspectRatio=False to stretch and cover
        c.drawImage(main_tree_path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.92))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    # 2. HEADER
    c.setFont("Roboto-Bold", 8)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(40, H - 40, "COMMERCIAL OFFER" if lang == "en" else "FORMÁLNÍ NABÍDKA")
    
    c.setFont("Roboto-Bold", 28)
    c.setFillColor(TEXT_COLOR)
    c.drawString(40, H - 70, "NAB-26-024")
    
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    c.drawString(40, H - 85, f"Issued: {today_str}" if lang == "en" else f"Vystaveno: {today_str}")
    
    import base64
    client_logo_b64 = data.get("clientLogoBase64") or data.get("client_logo_base64")
    if client_logo_b64:
        try:
            b64_data = client_logo_b64.split(",", 1)[1] if "," in client_logo_b64 else client_logo_b64
            img_data = base64.b64decode(b64_data)
            img_reader = utils.ImageReader(io.BytesIO(img_data))
            
            max_w, max_h = 100, 50
            iw, ih = img_reader.getSize()
            scale = min(max_w / float(iw), max_h / float(ih))
            w, h = iw * scale, ih * scale
            
            c.drawImage(img_reader, W - 40 - w, H - 40 - h + 8, width=w, height=h, mask='auto')
        except Exception as e:
            print("Failed to draw client logo:", e)
    
    # 3. TOP CARDS (Supplier & Client)
    card_y = H - 220
    card_h = 110
    card_w = (W - 100) / 2
    
    # Supplier Card
    c.setFillColor(CARD_BG)
    c.roundRect(40, card_y, card_w, card_h, 6, fill=1, stroke=0)
    
    col1 = 55
    col2 = 160
    
    c.setFillColor(TEXT_COLOR)
    c.setFont("Roboto-Bold", 11)
    c.drawString(col1, card_y + card_h - 25, "Treetino corp s.r.o.")
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    c.drawString(col1, card_y + card_h - 40, "Czech Republic" if lang == "en" else "Česká republika")
    
    c.setFont("Roboto-Bold", 8)
    c.drawString(col1, card_y + card_h - 60, "Registered Office" if lang == "en" else "Kancelář")
    c.setFont("Roboto", 8)
    c.setFillColor(TEXT_COLOR)
    c.drawString(col1, card_y + card_h - 72, "Vlčetín 62, Bílá 463 43")
    c.setFillColor(MUTED_COLOR)
    c.drawString(col1, card_y + card_h - 84, "ID: 10800107" if lang == "en" else "IČ: 10800107")
    
    c.setFont("Roboto-Bold", 8)
    c.drawString(col2, card_y + card_h - 25, "Contact Person" if lang == "en" else "Kontaktní osoba")
    c.setFillColor(TEXT_COLOR)
    c.drawString(col2, card_y + card_h - 37, "Dominik Mašek")
    c.setFont("Roboto", 8)
    c.setFillColor(MUTED_COLOR)
    c.drawString(col2, card_y + card_h - 49, "+420 730 587 857")
    c.setFillColor(ACCENT_COLOR)
    c.drawString(col2, card_y + card_h - 61, "info@treetino.com")
    
    # Client Card
    right_card_x = 40 + card_w + 20
    c.setFillColor(CARD_BG)
    c.roundRect(right_card_x, card_y, card_w, card_h, 6, fill=1, stroke=0)
    
    col3 = right_card_x + 15
    col4 = right_card_x + 130
    
    c.setFont("Roboto-Bold", 8)
    c.setFillColor(MUTED_COLOR)
    c.drawString(col3, card_y + card_h - 25, "Client / Customer" if lang == "en" else "Odběratel")
    
    c.setFont("Roboto-Bold", 11)
    c.setFillColor(TEXT_COLOR)
    c.drawString(col3, card_y + card_h - 40, str(client_name))
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    
    # Simple split for address if it's too long
    from reportlab.lib.utils import simpleSplit
    addr_lines = simpleSplit(client_address, "Roboto", 9, card_w - 20)
    ay = card_y + card_h - 55
    for al in addr_lines[:2]:
        c.drawString(col3, ay, al)
        ay -= 15
    
    c.setFont("Roboto-Bold", 8)
    c.drawString(col3, card_y + 20, "ID / Reg. No." if lang == "en" else "IČO")
    c.drawString(col4, card_y + 20, "VAT ID" if lang == "en" else "DIČ")
    c.setFillColor(TEXT_COLOR)
    c.drawString(col3, card_y + 8, str(ico_val))
    c.drawString(col4, card_y + 8, str(dic_val))
    
    # 4. DETAILED PRICE BREAKDOWN
    table_y = H - 380
    table_h = 130
    c.setFillColor(CARD_BG)
    c.roundRect(40, table_y, W - 80, table_h, 6, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(TEXT_COLOR)
    c.drawString(55, table_y + table_h - 25, "Detailed Price Breakdown" if lang == "en" else "Detailní rozpis ceny")
    c.setFont("Roboto-Bold", 7)
    c.setFillColor(MUTED_COLOR)
    c.drawRightString(W - 55, table_y + table_h - 25, "ALL PRICES IN CZK" if lang == "en" else "VŠECHNY CENY V CZK")
    
    c.setStrokeColor(LINE_COLOR)
    c.line(40, table_y + table_h - 40, W - 40, table_y + table_h - 40)
    
    # WELL SPACED RIGHT ALIGNED HEADERS
    header_y = table_y + table_h - 55
    c.setFont("Roboto-Bold", 7)
    c.setFillColor(MUTED_COLOR)
    c.drawString(55, header_y, "ITEM" if lang == "en" else "POLOŽKA")
    c.drawRightString(190, header_y, "QTY" if lang == "en" else "MNOŽ.")
    c.drawRightString(275, header_y, "UNIT PRICE" if lang == "en" else "CENA/JEDNOTKU")
    c.drawCentredString(308, header_y, "DISCOUNT" if lang == "en" else "SLEVA")
    c.drawRightString(390, header_y, "TOTAL EXCL. VAT" if lang == "en" else "CELKEM BEZ DPH")
    c.drawRightString(465, header_y, "VAT (21%)" if lang == "en" else "DPH (21%)")
    c.drawRightString(W - 55, header_y, "TOTAL INCL. VAT" if lang == "en" else "CELKEM S DPH")
    
    c.line(40, header_y - 10, W - 40, header_y - 10)
    
    row_y = header_y - 30
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(55, row_y, product_name)
    c.setFont("Roboto", 7)
    c.setFillColor(MUTED_COLOR)
    c.drawString(55, row_y - 10, "Kinetic Energy Generator Unit")
    
    c.setFont("Roboto", 8)
    c.setFillColor(TEXT_COLOR)
    c.drawRightString(190, row_y - 5, f"{units_qty} [1 set]" if lang == "en" else f"{units_qty} [1 kpl]")
    c.drawRightString(275, row_y - 5, format_czk(unit_price))
    
    c.setFillColor(colors.HexColor("#4c1d95"))
    c.roundRect(293, row_y - 10, 30, 12, 2, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#d8b4fe"))
    c.setFont("Roboto-Bold", 7)
    c.drawCentredString(308, row_y - 7, f"{format_units(discount_percent)}%")
    
    c.setFont("Roboto", 8)
    c.setFillColor(TEXT_COLOR)
    c.drawRightString(390, row_y - 5, format_czk(final_price))
    c.drawRightString(465, row_y - 5, format_czk(vat_amount))
    c.drawRightString(W - 55, row_y - 5, format_czk(final_price_vat))
    
    # 5. BOTTOM SECTION
    bottom_y = table_y - 200
    
    # Bottom Left - Expert Assessment
    c.setFillColor(CARD_BG)
    c.roundRect(40, bottom_y + 80, card_w, 100, 6, fill=1, stroke=0)
    c.setFillColor(ACCENT_COLOR)
    c.roundRect(40, bottom_y + 80, 4, 100, 2, fill=1, stroke=0)
    
    c.setFillColor(TEXT_COLOR)
    c.setFont("Roboto-Bold", 10)
    c.drawString(60, bottom_y + 155, "Expert Assessment" if lang == "en" else "Odborný posudek")
    
    c.setFont("Roboto", 8)
    c.setFillColor(MUTED_COLOR)
    if lang == "en":
        text_lines = [
            "This offer is predictive. An on-site technical inspection is",
            "required for final project engineering.",
            "Under the RES+ / Modernisation subsidy programs, we will",
            "gladly secure grants covering up to approx. 30% of eligible",
            "capital expenditures for your installation."
        ]
    else:
        text_lines = [
            "Cenová nabídka je prediktivní. Pro přesnou kalkulaci je",
            "nutná návštěva technika.",
            "V rámci podpory RES+ pro Vás rádi obstaráme dotaci",
            "v maximální možné výši, která se aktuálně pohybuje",
            "okolo 30 % na způsobilé náklady."
        ]
    for i, line in enumerate(text_lines):
        c.drawString(60, bottom_y + 135 - (i * 12), line)
        
    # Bottom Left - Estimated Savings
    c.setFillColor(CARD_BG)
    c.roundRect(40, bottom_y, card_w, 65, 6, fill=1, stroke=0)
    
    c.setFillColor(TEXT_COLOR)
    c.setFont("Roboto-Bold", 8)
    c.drawString(60, bottom_y + 45, "Estimated Investment After Subsidy" if lang == "en" else "Odhadovaná úspora po dotaci")
    c.setFont("Roboto", 7)
    c.setFillColor(MUTED_COLOR)
    if lang == "en":
        c.drawString(60, bottom_y + 30, "Net estimated investment after subsidy is")
        c.drawString(60, bottom_y + 20, f"approx. {format_czk(subsidy_price)} excl. VAT.")
    else:
        c.drawString(60, bottom_y + 30, "Po odečtení dotace by cena mohla být")
        c.drawString(60, bottom_y + 20, f"kolem {format_czk(subsidy_price)} bez DPH.")
    
    # Bottom Right - Totals
    c.setFillColor(CARD_BG)
    c.roundRect(right_card_x, bottom_y, card_w, 180, 6, fill=1, stroke=0)
    
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    c.drawString(right_card_x + 20, bottom_y + 150, "Price excl. VAT" if lang == "en" else "Cena bez DPH")
    c.drawRightString(right_card_x + card_w - 20, bottom_y + 150, format_czk(final_price))
    
    c.drawString(right_card_x + 20, bottom_y + 130, "VAT (21%)" if lang == "en" else "DPH (21%)")
    c.drawRightString(right_card_x + card_w - 20, bottom_y + 130, format_czk(vat_amount))
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(TEXT_COLOR)
    c.drawString(right_card_x + 20, bottom_y + 105, "Total Price (incl. VAT)" if lang == "en" else "Celková cena (vč. DPH)")
    c.drawRightString(right_card_x + card_w - 20, bottom_y + 105, format_czk(final_price_vat))
    
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(colors.HexColor("#f43f5e"))
    c.drawString(right_card_x + 20, bottom_y + 85, "Estimated Subsidy (-30%)" if lang == "en" else "Předpokládaná dotace (-30%)")
    c.drawRightString(right_card_x + card_w - 20, bottom_y + 85, f"- {format_czk(subsidy_amount)}")
    
    c.setFillColor(ACCENT_COLOR)
    c.roundRect(right_card_x, bottom_y + 15, card_w, 55, 6, fill=1, stroke=0)
    
    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Roboto-Bold", 8)
    c.drawString(right_card_x + 15, bottom_y + 50, "Final Net Price After Subsidy" if lang == "en" else "Finální cena po dotaci")
    c.setFont("Roboto", 6)
    c.drawString(right_card_x + 15, bottom_y + 38, "ESTIMATE AFTER SUBSIDY" if lang == "en" else "ODHAD PO ODEČTENÍ DOTACE")
    
    c.setFont("Roboto-Bold", 12)
    c.drawRightString(right_card_x + card_w - 15, bottom_y + 28, format_czk(subsidy_price))
    
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(colors.HexColor("#10b981"))
    if lang == "en":
        discount_msg = f"Total discount applied: {format_czk(discount_amount)}"
    else:
        discount_msg = f"Aplikována celková sleva: {format_czk(discount_amount)}"
    c.drawRightString(right_card_x + card_w, bottom_y - 12, discount_msg)
    
    # 6. BANNER SECTION (FULL WIDTH BLACK BOTTOM)
    c.setFillColor(colors.HexColor("#060b13"))
    c.rect(0, 0, W, 220, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 18)
    c.setFillColor(TEXT_COLOR)
    if lang == "en":
        c.drawString(40, 175, "Premium Connectivity")
        c.drawString(40, 153, "For 3 Months ")
        c.setFillColor(ACCENT_COLOR)
        c.drawString(40 + c.stringWidth("For 3 Months ", "Roboto-Bold", 18), 153, "Free")
        bullets = [
            "AI yield optimization engine",
            "Real-time meteorological response",
            "Dynamic light show control",
            "Energy sharing & Web3 analytics"
        ]
    else:
        c.drawString(40, 175, "Premiová konektivita")
        c.drawString(40, 153, "Na 3 měsíce ")
        c.setFillColor(ACCENT_COLOR)
        c.drawString(40 + c.stringWidth("Na 3 měsíce ", "Roboto-Bold", 18), 153, "Zdarma")
        bullets = [
            "AI systém optimalizace výroby",
            "Reakce na meteorologická data",
            "Světelná Show",
            "Možnosti sdílení"
        ]
    
    c.setFont("Roboto", 9)
    c.setFillColor(TEXT_COLOR)
    for idx, b in enumerate(bullets):
        by = 180 - (idx * 20)
        c.circle(230, by + 3, 2, fill=1, stroke=0)
        c.drawString(240, by, b)
        
    btn_y = 110
    c.setStrokeColor(TEXT_COLOR)
    c.roundRect(40, btn_y, 100, 25, 4, fill=0, stroke=1)
    c.setFont("Roboto-Bold", 8)
    c.drawCentredString(90, btn_y + 9, "Download App" if lang == "en" else "Stáhnout aplikaci")
    
    c.linkURL("https://www.treetino.com", (40, btn_y, 140, btn_y + 25), relative=1)
    
    # Phone image constrained to a bounding box
    phone_path = os.path.join(assets_path, "images", "phone.png")
    if os.path.exists(phone_path):
        c.drawImage(phone_path, W - 220, 10, width=200, height=200, preserveAspectRatio=True, mask='auto')

    # 7. FOOTER
    c.setFillColor(MUTED_COLOR)
    c.setFont("Roboto", 9)
    sig_lines = [
        "Wattino",
        "Treetino corp s.r.o.",
        "(Wattino holding)",
        "IČ: 10800107",
        "DIČ: CZ10800107",
        "Český Šternberk 9, 257 26"
    ]
    for idx, s_line in enumerate(sig_lines):
        c.drawString(40, 80 - (idx * 11), s_line)

    # Footer numbers
    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Roboto", 10)
    c.drawCentredString(W / 2, 25, "4 of 8" if lang == "en" else "4 z 6")
    c.showPage()


def draw_page_7(c: canvas.Canvas, data: dict, assets_path: str):
    lang = data.get("lang", "cs")
    TEXT_COLOR = colors.white
    MUTED_COLOR = colors.HexColor("#94a3b8")
    ACCENT_COLOR = colors.HexColor("#38bdf8")
    CARD_BG = colors.Color(0.12, 0.16, 0.23, alpha=0.8)
    LINE_COLOR = colors.HexColor("#334155")
    
    # 1. Background
    import reportlab.lib.utils as utils
    from PIL import Image
    import io
    main_tree_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public", "products", "Still_Turbina.png")
    c.saveState()
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    
    if os.path.exists(main_tree_path):
        c.drawImage(main_tree_path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    
    # Heavy overlay
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.92))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    # 2. HEADER
    c.setFont("Roboto-Bold", 8)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(40, H - 40, "TECHNICAL SPECIFICATIONS" if lang == "en" else "TECHNICKÁ SPECIFIKACE")
    
    c.setFont("Roboto-Bold", 28)
    c.setFillColor(TEXT_COLOR)
    c.drawString(40, H - 70, "TECHNOLOGY & STANDARDS" if lang == "en" else "TECHNOLOGIE & NORMY")
    
    c.setFont("Roboto", 9)
    c.setFillColor(MUTED_COLOR)
    c.drawString(40, H - 85, "Warranty conditions and quality standards" if lang == "en" else "Záruční podmínky a standardy kvality")
    
    # 3. MAIN CARD
    card_h = 440
    card_y = H - 120 - card_h
    card_w = W - 80
    
    c.setFillColor(CARD_BG)
    c.roundRect(40, card_y, card_w, card_h, 6, fill=1, stroke=0)
    
    col1_x = 60
    col2_x = W / 2
    
    c.setFillColor(TEXT_COLOR)
    c.setFont("Roboto-Bold", 11)
    c.drawString(col1_x, card_y + card_h - 30, "Technology" if lang == "en" else "Technologie")
    c.drawString(col2_x, card_y + card_h - 30, "Applicable Standards & Warranty" if lang == "en" else "Soubory norem (je-li relevantní)")
    
    c.setStrokeColor(LINE_COLOR)
    c.line(40, card_y + card_h - 45, W - 40, card_y + card_h - 45)
    c.line(col2_x - 15, card_y + 20, col2_x - 15, card_y + card_h - 45)
    
    # Row 1: Fotovoltaické moduly
    y = card_y + card_h - 75
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(col1_x, y, "Photovoltaic Modules" if lang == "en" else "Fotovoltaické moduly")
    
    t_obj = c.beginText(col2_x, y)
    t_obj.setFont("Roboto", 9)
    t_obj.setFillColor(TEXT_COLOR)
    t_obj.setLeading(14)
    if lang == "en":
        t_obj.textLine("- Complies with IEC 61215, IEC 61730")
        t_obj.textLine("  Efficiency ≈ 21%")
        t_obj.textLine("")
        t_obj.textLine("- 25-year linear performance warranty with max.")
        t_obj.textLine("  degradation to 80% guaranteed by manufacturer")
        t_obj.textLine("")
        t_obj.textLine("- 12-year full product warranty guaranteed")
        t_obj.textLine("  by manufacturer")
    else:
        t_obj.textLine("- splňují IEC 61215, IEC 61730")
        t_obj.textLine("  účinnost ≈ 21%")
        t_obj.textLine("")
        t_obj.textLine("- 25letá lineární záruka na výkon s max.")
        t_obj.textLine("  poklesem na 80 % původního výkonu")
        t_obj.textLine("  garantovanou výrobcem")
        t_obj.textLine("")
        t_obj.textLine("- 12letá produktová záruka garantovaná")
        t_obj.textLine("  výrobcem")
    c.drawText(t_obj)
    
    c.setStrokeColor(colors.Color(0.2, 0.25, 0.33, alpha=0.5))
    c.line(40, y - 110, W - 40, y - 110)
    
    # Row 2: Měniče
    y = y - 135
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(col1_x, y, "Hybrid Inverters" if lang == "en" else "Měniče")
    
    t_obj = c.beginText(col2_x, y)
    t_obj.setFont("Roboto", 9)
    t_obj.setFillColor(TEXT_COLOR)
    t_obj.setLeading(14)
    if lang == "en":
        t_obj.textLine("- Complies with IEC 61727, IEC 62116 or")
        t_obj.textLine("  EN 50549-1/EN50549-2, Tier 1 compliance")
        t_obj.textLine("")
        t_obj.textLine("- Efficiency 98.0% (European standard)")
        t_obj.textLine("")
        t_obj.textLine("- 10-year manufacturer replacement warranty")
        t_obj.textLine("  with prompt on-site servicing")
    else:
        t_obj.textLine("- splňují IEC 61727 nebo IEC 62116 nebo")
        t_obj.textLine("  EN 50549-1/EN50549-2, shoda dle")
        t_obj.textLine("  EN 50549-1 rovněž garantováno")
        t_obj.textLine("  označením Tier 1")
        t_obj.textLine("")
        t_obj.textLine("- účinnost 98,0 % (Euro účinnost)")
        t_obj.textLine("")
        t_obj.textLine("- záruka výrobce či dodavatele trvající")
        t_obj.textLine("  10 let na jeho bezodkladnou výměnu či")
        t_obj.textLine("  adekvátní náhradu v případě poruchy")
    c.drawText(t_obj)
    
    c.line(40, y - 135, W - 40, y - 135)
    
    # Row 3: VTE
    y = y - 160
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(col1_x, y, "Wind Turbines (WTG)" if lang == "en" else "VTE")
    
    t_obj = c.beginText(col2_x, y)
    t_obj.setFont("Roboto", 9)
    t_obj.setFillColor(TEXT_COLOR)
    t_obj.setLeading(14)
    if lang == "en":
        t_obj.textLine("- 3-year manufacturer warranty for prompt")
        t_obj.textLine("  replacement or adequate servicing in case of defect")
    else:
        t_obj.textLine("- záruka výrobce či dodavatele trvající")
        t_obj.textLine("  3 let na jeho bezodkladnou výměnu či")
        t_obj.textLine("  adekvátní náhradu v případě poruchy")
    c.drawText(t_obj)
    
    # 4. POZN BOX
    pozn_h = 130
    pozn_y = card_y - 30 - pozn_h
    c.setFillColor(CARD_BG)
    c.roundRect(40, pozn_y, card_w, pozn_h, 6, fill=1, stroke=0)
    c.setFillColor(ACCENT_COLOR)
    c.roundRect(40, pozn_y, 4, pozn_h, 2, fill=1, stroke=0)
    
    c.setFont("Roboto-Bold", 10)
    c.setFillColor(TEXT_COLOR)
    c.drawString(60, pozn_y + pozn_h - 25, "Note:" if lang == "en" else "Pozn:")
    
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import Paragraph
    styles = getSampleStyleSheet()
    
    from reportlab.pdfbase.ttfonts import TTFont
    import sys
    from pathlib import Path
    fonts_path = str(Path(__file__).parent / "fonts")
    try:
        pdfmetrics.registerFont(TTFont("Roboto-Italic", os.path.join(fonts_path, "Roboto-Italic.ttf")))
        italic_font = "Roboto-Italic"
    except:
        italic_font = "Roboto"
        
    p_style = ParagraphStyle(
        "Notes",
        parent=styles["Normal"],
        fontName=italic_font,
        fontSize=8,
        leading=12,
        textColor=MUTED_COLOR
    )
    
    if lang == "en":
        notes_text = (
            "The comprehensive warranty duration for the entire system as a technological whole will be "
            "stipulated in the final Contract for Work. Upon expiry of the general warranty period, any longer "
            "warranties provided by respective component manufacturers remain directly assertable by the Client.<br/>"
            "Specific component warranty certificates will be appended to the final Delivery Protocol."
        )
    else:
        notes_text = (
            "Délka záruční doby Díla jako technologického celku bude uvedena ve Smlouvě. Po uplynutí "
            "záruční doby dle případného smluvního vztahu, pokud výrobce příslušného komponentu pou"
            "žitého Zhotovitelem k provedení Díla stanoví delší záruční dobu vůči třetím osobám – všem "
            "nabyvatelům příslušného komponentu, než je záruční doba uvedená v první větě, vznikají Ob"
            "jednateli nároky z titulu záručních vad v době po uplynutí záruční doby poskytnuté Zhotovite"
            "lem dle Smlouvy výlučně vůči výrobci, resp. jeho příslušnému zástupci pro Českou republiku.<br/>"
            "Záruční doba na jednotlivé komponenty Díla garantovaná výrobci bude specifikována ve "
            "Smlouvě."
        )
    
    p = Paragraph(notes_text, p_style)
    p_w, p_h = p.wrap(card_w - 40, H)
    p.drawOn(c, 60, pozn_y + pozn_h - 35 - p_h)
    
    # 5. FOOTER INFO
    f_y = pozn_y - 30
    
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(TEXT_COLOR)
    c.drawString(40, f_y, "Supplier:" if lang == "en" else "Dodavatel:")
    
    c.setFont("Roboto", 8)
    c.setFillColor(MUTED_COLOR)
    c.drawString(100, f_y, "Company: Treetino corp s.r.o." if lang == "en" else "Firma: Treetino corp s.r.o.")
    c.drawString(40, f_y - 15, "ID: 10800107 VAT: CZ10800107 Seat: Český" if lang == "en" else "IČ: 10800107 DIČ: CZ10800107 Sídlo: Český")
    c.drawString(40, f_y - 30, "Šternberk 9, 257 26 Český Šternberk")
    
    c.setFont("Roboto-Bold", 9)
    c.setFillColor(ACCENT_COLOR)
    if lang == "en":
        c.drawCentredString(W / 2, f_y - 50, "Delivery schedule subject to agreement, site readiness and component availability.")
    else:
        c.drawCentredString(W / 2, f_y - 50, "Termín dodání dle dohody, připravenosti stanoviště a materiálu.")
    
    # Page num
    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Roboto", 10)
    c.drawCentredString(W / 2, 25, "5 of 8" if lang == "en" else "5 z 6")
    c.showPage()


def draw_page_8(c: canvas.Canvas, data: dict, assets_path: str):
    import os
    import reportlab.lib.utils as utils
    
    lang = data.get("lang", "cs")

    # 1. Background
    main_tree_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public", "products", "Still_Strom-v1.png")
    c.saveState()
    
    if os.path.exists(main_tree_path):
        c.drawImage(main_tree_path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    
    # Moderate overlay so text is readable but tree is visible
    c.setFillColor(colors.Color(0.06, 0.08, 0.12, alpha=0.75))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    
    # 2. LOGO
    logo_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public", "branding", "logo_horizontal.png")
    
    if os.path.exists(logo_path):
        c.drawImage(logo_path, W / 2 - 150, H / 2 + 50, width=300, preserveAspectRatio=True, mask='auto')
    else:
        c.setFillColor(colors.white)
        c.setFont("Roboto-Bold", 40)
        c.drawCentredString(W / 2, H / 2 + 50, "TREETINO")
    
    # 3. SLOGAN
    c.setFillColor(colors.white)
    c.setFont("Roboto-Bold", 22)
    if lang == "en":
        c.drawCentredString(W / 2, H / 2, "The future of energy rooted")
        c.drawCentredString(W / 2, H / 2 - 30, "in sustainability")
    else:
        c.drawCentredString(W / 2, H / 2, "Budoucnost energetiky zakořeněná")
        c.drawCentredString(W / 2, H / 2 - 30, "v udržitelnosti")
    
    # 4. FOOTER CONTACT
    c.setFont("Roboto-Bold", 16)
    c.drawCentredString(W / 2, 100, "www.treetino.eu")
    c.drawCentredString(W / 2, 75, "+420 730 587 857")
    c.drawCentredString(W / 2, 50, "info@treetino.com")
    
    c.showPage()


def generate_pdf(data: dict) -> bytes:
    buffer = io.BytesIO()
    
    # We need the path to assets to inject images
    import sys
    from pathlib import Path
    assets_path = str(Path(__file__).parent / "assets")
    fonts_path = str(Path(__file__).parent / "fonts")
    
    # Register Roboto Fonts
    try:
        pdfmetrics.registerFont(TTFont("Roboto", os.path.join(fonts_path, "Roboto-Regular.ttf")))
        pdfmetrics.registerFont(TTFont("Roboto-Bold", os.path.join(fonts_path, "Roboto-Bold.ttf")))
    except Exception as e:
        print("Could not register fonts:", e)
    
    c = canvas.Canvas(buffer, pagesize=A4)
    
    draw_page_1(c, data, assets_path)  # Cover
    draw_page_2(c, data, assets_path)  # Product
    draw_page_3(c, data, assets_path)  # Map & Analytics
    draw_page_6(c, data, assets_path)  # Pricing
    draw_page_7(c, data, assets_path)  # Tech Specs
    draw_page_8(c, data, assets_path)  # Outro
    
    c.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


# ─── NDA Document Generator ───

from reportlab.platypus import Flowable

class SvgSignatureFlowable(Flowable):
    def __init__(self, svg_string, width=150, height=60):
        Flowable.__init__(self)
        self.svg_string = svg_string
        self.width = width
        self.height = height
    def wrap(self, availWidth, availHeight):
        return self.width, self.height
    def draw(self):
        if not self.svg_string:
            return
        import re
        vb_match = re.search(r'viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"', self.svg_string)
        if vb_match:
            vb_w = float(vb_match.group(1))
            vb_h = float(vb_match.group(2))
        else:
            vb_w, vb_h = 600.0, 200.0

        paths = re.findall(r'd="([^"]+)"', self.svg_string)
        self.canv.saveState()
        self.canv.setStrokeColor(colors.HexColor("#183d89"))
        self.canv.setFillColor(colors.HexColor("#183d89"))
        self.canv.setLineWidth(1.5)
        self.canv.setLineCap(1) # Round
        self.canv.setLineJoin(1) # Round
        
        for path in paths:
            points = []
            tokens = path.strip().split()
            i = 0
            while i < len(tokens):
                cmd = tokens[i]
                if cmd in ('M', 'L'):
                    try:
                        x = float(tokens[i+1])
                        y = float(tokens[i+2])
                        points.append((x, y))
                        i += 3
                    except:
                        i += 1
                else:
                    i += 1
            if len(points) > 1:
                for p1, p2 in zip(points[:-1], points[1:]):
                    x1 = (p1[0] / vb_w) * self.width
                    y1 = ((vb_h - p1[1]) / vb_h) * self.height
                    x2 = (p2[0] / vb_w) * self.width
                    y2 = ((vb_h - p2[1]) / vb_h) * self.height
                    self.canv.line(x1, y1, x2, y2)
            elif len(points) == 1:
                p1 = points[0]
                x1 = (p1[0] / vb_w) * self.width
                y1 = ((vb_h - p1[1]) / vb_h) * self.height
                self.canv.circle(x1, y1, 0.75, fill=1, stroke=0)
        self.canv.restoreState()


def generate_nda_pdf(user_data: dict, lang: str = "cs") -> bytes:
    import io
    from datetime import datetime
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, Image
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    
    # Check if lang is passed inside user_data as well
    if not lang or lang == "cs":
        lang = user_data.get("lang", "cs")

    buffer = io.BytesIO()
    
    # Register fonts path
    fonts_path = os.path.join(os.path.dirname(__file__), "fonts")
    try:
        pdfmetrics.registerFont(TTFont("Roboto", os.path.join(fonts_path, "Roboto-Regular.ttf")))
        pdfmetrics.registerFont(TTFont("Roboto-Bold", os.path.join(fonts_path, "Roboto-Bold.ttf")))
    except:
        pass
        
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'NDATitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=12,
        leading=15,
        alignment=1, # Center
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        'NDASubTitle',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8,
        leading=10,
        alignment=1, # Center
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )
    
    section_title = ParagraphStyle(
        'NDASectionTitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=10,
        spaceAfter=5
    )
    
    body_style = ParagraphStyle(
        'NDABody',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )
    
    table_label_style = ParagraphStyle(
        'NDATableLabel',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor('#1e3a8a')
    )
    
    table_text_style = ParagraphStyle(
        'NDATableText',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )

    story = []
    
    # 1. Document Title
    if lang == "en":
        story.append(Paragraph("NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT", title_style))
        story.append(Paragraph("entered into pursuant to Section 1746(2) and Section 1730 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended.", subtitle_style))
        story.append(Paragraph("I. Contracting Parties", section_title))
        
        poskytovatel_data = [
            [Paragraph("1.1 Disclosing Party (Treetino):", table_label_style), ""],
            [Paragraph("Company Name:", table_text_style), Paragraph("Treetino corp s.r.o.", table_text_style)],
            [Paragraph("Company ID (IČO):", table_text_style), Paragraph("10800107", table_text_style)],
            [Paragraph("Registered Seat:", table_text_style), Paragraph("Vlčetín 62, Bílá 463 43, Czechia", table_text_style)],
            [Paragraph("Represented by:", table_text_style), Paragraph("Dominik Mašek, Managing Director", table_text_style)],
            [Paragraph("Registry:", table_text_style), Paragraph("Regional Court in Ústí n. L., C 48430", table_text_style)],
            [Paragraph("Email:", table_text_style), Paragraph("info@treetino.com", table_text_style)]
        ]
        prijemce_data = [
            [Paragraph("1.2 Receiving Party (Partner):", table_label_style), ""],
            [Paragraph("Name / Company:", table_text_style), Paragraph(user_data.get('nda_company') or user_data.get('username') or '', table_text_style)],
            [Paragraph("ID No. / Birth Date:", table_text_style), Paragraph(user_data.get('nda_ico_dob') or '', table_text_style)],
            [Paragraph("Seat / Residence:", table_text_style), Paragraph(user_data.get('nda_address') or '', table_text_style)],
            [Paragraph("Represented by:", table_text_style), Paragraph(user_data.get('nda_representative') or '', table_text_style)],
            [Paragraph("Email:", table_text_style), Paragraph(user_data.get('email') or '', table_text_style)]
        ]
    else:
        story.append(Paragraph("DOHODA O MLČENLIVOSTI, OCHRANĚ INFORMACÍ A ZÁKAZU JEJICH ZNEUŽITÍ", title_style))
        story.append(Paragraph("uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.", subtitle_style))
        story.append(Paragraph("I. Smluvní strany", section_title))
        
        poskytovatel_data = [
            [Paragraph("1.1 Poskytovatel (Treetino):", table_label_style), ""],
            [Paragraph("Obchodní firma:", table_text_style), Paragraph("Treetino corp s.r.o.", table_text_style)],
            [Paragraph("IČO:", table_text_style), Paragraph("10800107", table_text_style)],
            [Paragraph("Sídlo:", table_text_style), Paragraph("Vlčetín 62, Bílá 463 43", table_text_style)],
            [Paragraph("Zastoupena:", table_text_style), Paragraph("Dominikem Maškem, jednatelem", table_text_style)],
            [Paragraph("Rejstřík:", table_text_style), Paragraph("KS v Ústí n. L., C 48430", table_text_style)],
            [Paragraph("E-mail:", table_text_style), Paragraph("info@treetino.com", table_text_style)]
        ]
        prijemce_data = [
            [Paragraph("1.2 Příjemce (Partner / Prodejce):", table_label_style), ""],
            [Paragraph("Jméno / Firma:", table_text_style), Paragraph(user_data.get('nda_company') or user_data.get('username') or '', table_text_style)],
            [Paragraph("IČO / Datum nar.:", table_text_style), Paragraph(user_data.get('nda_ico_dob') or '', table_text_style)],
            [Paragraph("Sídlo / Bydliště:", table_text_style), Paragraph(user_data.get('nda_address') or '', table_text_style)],
            [Paragraph("Zastoupen/a:", table_text_style), Paragraph(user_data.get('nda_representative') or '', table_text_style)],
            [Paragraph("E-mail:", table_text_style), Paragraph(user_data.get('email') or '', table_text_style)]
        ]
    
    t1 = Table(poskytovatel_data, colWidths=[110, 385])
    t1.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t1)
    story.append(Spacer(1, 4))
    
    t2 = Table(prijemce_data, colWidths=[110, 385])
    t2.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t2)
    story.append(Spacer(1, 6))
    
    if lang == "en":
        story.append(Paragraph("On the date, month, and year indicated below, the following Contracting Parties enter into this Non-Disclosure and Confidentiality Agreement (hereinafter the &bdquo;<b>Agreement</b>&ldquo;):", body_style))
        
        # 3. Clauses EN
        story.append(Paragraph("II. Preamble and Purpose of the Agreement", section_title))
        story.append(Paragraph("<b>2.1</b> The Parties are engaged in mutual negotiations regarding the establishment and execution of commercial and technical collaboration, within which the Receiving Party, acting as a sales representative, commercial agent, distributor, or partner entity, will conduct business development activities, specifically identifying commercial opportunities, mediating sales, presenting, marketing, and securing distribution or installation of Treetino products and technologies (including autonomous solar and wind trees Treetino V1, Treetino V2, vertical wind microturbines T1, and related accessories), as well as utilizing Treetino's proprietary sales and calculation software (Treetino Pricing App, CRM, partner portal, and 3D configuration tools) – hereinafter referred to as &bdquo;<b>Mutual Collaboration</b>&ldquo;.", body_style))
        story.append(Paragraph("<b>2.2</b> For the purpose of negotiating and performing the Mutual Collaboration, the Disclosing Party will provide the Receiving Party with highly confidential commercial, pricing, technical, developmental, strategic, customer, and operational information and know-how, which constitute valuable trade secrets and intellectual property of the Disclosing Party and hold essential economic and competitive value.", body_style))
        story.append(Paragraph("<b>2.3</b> The purpose of this Agreement is to establish binding rules and legal framework for the protection of all Confidential Information and Trade Secrets of the Disclosing Party, define the Receiving Party's obligations in handling such information, prohibit any unauthorized disclosure, dissemination, or utilization thereof, and determine legal remedies and sanctions in the event of any breach.", body_style))
        
        story.append(Paragraph("III. Definition of Confidential Information and Trade Secrets", section_title))
        story.append(Paragraph("<b>3.1 &bdquo;Confidential Information&ldquo;</b> for the purposes of this Agreement means any and all information, facts, data, documents, materials, designs, analyses, and know-how of any nature (technical, commercial, pricing, financial, legal, manufacturing, strategic, operational, or organizational), in tangible or intangible form, regardless of the manner or medium of transmission (oral, written, electronic, CAD/3D models, drawings, source/binary code, demonstration of prototypes, or software), that the Disclosing Party has directly or indirectly disclosed, provided, or made accessible to the Receiving Party, or of which the Receiving Party became aware in connection with the negotiations or Mutual Collaboration (hereinafter &bdquo;<b>Confidential Information</b>&ldquo;).", body_style))
        story.append(Paragraph("<b>3.2</b> Confidential Information and <b>Trade Secrets</b> within the meaning of Section 504 and Section 1730 of the Civil Code include, without limitation:<br/>"
                               "&bull; <b>Commercial, pricing, and financial data:</b> wholesale/retail price lists, margin and discount structures, sales representative commission schedules and compensation models, calculation matrices and formulas, customized quotes prepared for clients, commercial and marketing strategies, sales pipeline, and expansion plans;<br/>"
                               "&bull; <b>Customer and partner records:</b> database of client inquiries, contact details and identities of existing and prospective customers, sales leads, negotiation history, CRM records, and terms negotiated with suppliers and sub-contractors;<br/>"
                               "&bull; <b>Technical documentation and know-how:</b> engineering drawings, 3D CAD models, electrical wiring schematics, technical specifications of solar/wind trees, composite material specifications, aerodynamic profiles of microturbines, inverter integration, electronic controllers, and battery energy storage systems;<br/>"
                               "&bull; <b>Software, digital assets, and system credentials:</b> source and binary code, database schemas, web and cloud applications (specifically Treetino Pricing / Sales App), API endpoints, and all user credentials (usernames, passwords, API tokens, and certificates) issued to the Receiving Party;<br/>"
                               "&bull; <b>Strategic and legal assets:</b> information regarding pending patents, utility and industrial designs, investment discussions, corporate partnerships, and internal standard operating procedures.", body_style))
        story.append(Paragraph("<b>3.3</b> Confidential Information also includes the very existence of this Agreement, the fact that negotiations are taking place between the Parties, and all terms and parameters of the Mutual Collaboration.", body_style))
        story.append(Paragraph("<b>3.4</b> All information specified in this Article is hereinafter collectively referred to as &bdquo;<b>Protected Information</b>&ldquo;. All information disclosed by the Disclosing Party shall be deemed Protected Information unless explicitly designated otherwise in writing by the Disclosing Party.", body_style))
        
        story.append(Paragraph("IV. Obligations of the Receiving Party and Data Protection", section_title))
        story.append(Paragraph("<b>4.1 The Receiving Party irrevocably covenants and agrees:</b><br/>"
                               "&bull; To maintain the strictest confidentiality regarding all Protected Information and to protect it with the care of a prudent businessperson and the highest standard of professional diligence;<br/>"
                               "&bull; To use the Protected Information exclusively for the performance of the agreed Mutual Collaboration and solely for the benefit of the Disclosing Party;<br/>"
                               "&bull; Not to disclose, transfer, make accessible, disseminate, publish, or otherwise permit access to the Protected Information to any third party without the prior express written consent of the Disclosing Party;<br/>"
                               "&bull; Not to utilize the Protected Information (including acquired know-how, calculation models, and customer databases) for its own commercial benefit or for the benefit of any third party, in particular not to engage in direct or indirect competitive activity against the Disclosing Party nor develop or offer competing technical or commercial solutions;<br/>"
                               "&bull; Not to take any steps aimed at circumventing the Disclosing Party (<b>non-circumvention obligation</b>), in particular not to directly approach, contact, or solicit clients, prospects, or suppliers of the Disclosing Party discovered in the course of the Mutual Collaboration for the purpose of concluding transactions outside of the Disclosing Party.", body_style))
        story.append(Paragraph("<b>4.2 Access Restriction:</b> The Receiving Party may disclose Protected Information solely to its statutory representatives, employees, and professional advisors who strictly need to know such information for the purposes of the Mutual Collaboration (<i>need-to-know basis</i>). The Receiving Party must ensure that such individuals are bound by confidentiality obligations at least as stringent as those contained herein, and the Receiving Party remains fully liable for any breach committed by such individuals as if it had committed the breach itself.", body_style))
        story.append(Paragraph("<b>4.3 Technical Security Measures:</b> The Receiving Party undertakes to secure all devices (computers, smartphones, tablets) used to access the Disclosing Party's software and systems with strong passwords, biometric authentication, and two-factor authentication (2FA). The Receiving Party shall not share its credentials with any third party and shall not store Protected Information on public or unencrypted cloud storage.", body_style))
        story.append(Paragraph("<b>4.4 Notification Duty:</b> In the event of discovering any unauthorized access, breach, leakage, loss, or disclosure of Protected Information, the Receiving Party shall immediately (and no later than within 24 hours) notify the Disclosing Party in writing and provide all necessary assistance to mitigate damages.", body_style))
        
        story.append(Paragraph("V. Exceptions to Confidentiality Obligations", section_title))
        story.append(Paragraph("<b>5.1</b> The confidentiality obligation under this Agreement shall not apply to information that: (a) was demonstrably publicly known at the time of disclosure, or became publicly known subsequent to disclosure other than through a breach of this Agreement by the Receiving Party; (b) was demonstrably and lawfully in the possession of the Receiving Party prior to disclosure by the Disclosing Party; (c) was released from confidentiality by prior written consent of the Disclosing Party; (d) the Receiving Party is obligated to disclose pursuant to mandatory legal provisions, a binding court judgment, or an order of a law enforcement or public authority (provided that the Receiving Party shall immediately notify the Disclosing Party in advance in writing, disclose only the minimum required scope, and request confidential treatment).", body_style))
        
        story.append(Paragraph("VI. Intellectual Property and Return of Materials", section_title))
        story.append(Paragraph("<b>6.1</b> All intellectual property rights, trade secrets, patents, utility models, trademarks, copyrights, engineering designs, know-how, databases, and software tools remain the sole and exclusive property of the Disclosing Party. The provision of Protected Information conveys no license, patent right, or title to the Receiving Party.", body_style))
        story.append(Paragraph("<b>6.2 Return and Disposal of Materials:</b> Upon written request by the Disclosing Party or at latest within 5 (five) business days following termination of the Mutual Collaboration, the Receiving Party shall return to the Disclosing Party all tangible materials, data carriers, drawings, samples, and documents containing Protected Information, and permanently and irrevocably erase/shred all digital copies and records from all its devices and servers.", body_style))
        
        story.append(Paragraph("VII. Contractual Penalty and Damages", section_title))
        story.append(Paragraph("<b>7.1</b> In the event of any breach by the Receiving Party of any obligation set forth in this Agreement (including breach of confidentiality, unauthorized disclosure, commercial misuse, breach of non-circumvention/non-compete covenants, or failure to return materials), the Receiving Party shall pay to the Disclosing Party a <b>contractual penalty of €4,000 / CZK 100,000 (four thousand Euros / one hundred thousand Czech crowns)</b> for each individual breach. In the case of a continuing breach, a contractual penalty of <b>€200 / CZK 5,000</b> shall be paid for each day or part thereof during which such breach continues.", body_style))
        story.append(Paragraph("<b>7.2</b> The contractual penalty shall be due and payable within 14 (fourteen) calendar days following delivery of a written demand for payment to the Receiving Party.", body_style))
        story.append(Paragraph("<b>7.3 Damages:</b> The agreement on and payment of a contractual penalty shall not affect or limit the Disclosing Party's right to full compensation for all damages, pecuniary and non-pecuniary losses, and lost profits in full. The Parties <b>expressly exclude the application of Section 2050 of the Civil Code</b> and agree that claims for damages remain enforceable in full alongside contractual penalties.", body_style))
        
        story.append(Paragraph("VIII. Duration and Effectiveness", section_title))
        story.append(Paragraph("<b>8.1</b> This Agreement takes effect upon its signature by both Parties and is entered into for an <b>indefinite term</b>.", body_style))
        story.append(Paragraph("<b>8.2</b> The confidentiality obligations regarding Protected Information shall survive and remain in effect throughout the duration of negotiations and Mutual Collaboration and for a period of <b>5 (five) years</b> following the termination of all collaboration; with respect to information constituting trade secrets or proprietary know-how of the Disclosing Party, confidentiality obligations shall survive indefinitely for as long as such trade secrets exist.", body_style))
        
        story.append(Paragraph("IX. Final Provisions", section_title))
        story.append(Paragraph("<b>9.1</b> Legal relations under this Agreement shall be governed by the laws of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code. Any disputes shall be submitted to the competent general courts of the Czech Republic having jurisdiction over the registered seat of the Disclosing Party.", body_style))
        story.append(Paragraph("<b>9.2</b> Amendments to this Agreement must be made in writing in sequentially numbered addenda signed by both Parties. Should any provision be deemed invalid, the remaining provisions shall remain fully effective (severability clause).", body_style))
        story.append(Paragraph("<b>9.3</b> This Agreement is executed in counterparts with the force of an original, or in an electronic format executed via recognized electronic signatures by both Parties.", body_style))
    else:
        story.append(Paragraph("Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Dohodu o mlčenlivosti, ochraně informací a zákazu jejich zneužití (dále jen „<b>Dohoda</b>“):", body_style))
        
        # 3. Clauses CS
        story.append(Paragraph("II. Preambule a účel dohody", section_title))
        story.append(Paragraph("<b>2.1</b> Smluvní strany vedou vzájemná jednání o navázání a realizaci obchodní a technické spolupráce, v jejímž rámci bude Příjemce jako obchodní zástupce, prodejce, distributor nebo partnerská společnost vyvíjet obchodní činnost, zejména vyhledávat obchodní příležitosti, zprostředkovávat prodej, prezentovat, propagovat a zajišťovat distribuci nebo instalaci produktů a technologií společnosti Treetino (zejména autonomních větrných a solárních stromů Treetino V1, Treetino V2, vertikálních větrných mikroturbín T1 a souvisejícího příslušenství) a využívat obchodní software a kalkulační nástroje Poskytovatele (Treetino Pricing App, CRM, partnerský portál a konfigurační nástroje) – dále jen „<b>Vzájemná spolupráce</b>“.", body_style))
        story.append(Paragraph("<b>2.2</b> Za účelem jednání o Vzájemné spolupráci a jejího následného řádného výkonu bude Poskytovatel Příjemci zpřístupňovat vysoce důvěrné obchodní, cenové, technické, vývojové, strategické, klientské a provozní informace a know-how, které představují cenné obchodní tajemství a duševní vlastnictví Poskytovatele a mají zásadní hospodářskou hodnotu.", body_style))
        story.append(Paragraph("<b>2.3</b> Účelem této Dohody je stanovení přesných a závazných podmínek pro ochranu důvěrných informací a obchodního tajemství Poskytovatele, vymezení povinností Příjemce při nakládání s těmito informacemi, zákaz jejich neoprávněného užití, vyzrazení, šíření či zpřístupnění třetím osobám a stanovení právních následků a sankcí v případě jejich porušení.", body_style))
        
        story.append(Paragraph("III. Vymezení důvěrných informací a obchodního tajemství", section_title))
        story.append(Paragraph("<b>3.1 Důvěrnými informacemi</b> se pro účely této Dohody rozumí veškeré informace, skutečnosti, data, podklady, materiály a know-how jakékoliv povahy (technické, obchodní, finanční, cenové, právní, výrobní, strategické, provozní či organizační), bez ohledu na formu a způsob jejich zachycení nebo sdělení (ústně, písemně, elektronicky, v podobě výkresů, 3D CAD modelů, zdrojových kódů či předvedením prototypů a softwaru), které Poskytovatel Příjemci přímo či nepřímo zpřístupnil, sdělil, předal nebo které se Příjemce v souvislosti s jednáním či Vzájemnou spoluprací dozvěděl (dále jen „<b>Důvěrné informace</b>“).", body_style))
        story.append(Paragraph("<b>3.2</b> Za Důvěrné informace a <b>obchodní tajemství</b> Poskytovatele ve smyslu ustanovení § 504 a § 1730 občanského zákoníku se považují zejména, nikoliv však výlučně:<br/>"
                               "&bull; <b>Obchodní, cenové a finanční informace:</b> prodejní i nákupní ceníky, struktura marží a slev, provizní řády a odměňovací modely prodejců, kalkulační matice a vzorce, cenové nabídky připravované pro zákazníky, obchodní a marketingové strategie, obchodní pipeline a plány expanze na tuzemské i zahraniční trhy;<br/>"
                               "&bull; <b>Klientská a partnerská data:</b> databáze poptávek, kontaktů a identifikačních údajů stávajících i potenciálních zákazníků, rozpracované obchodní případy (leads), historie komunikace s klienty, záznamy v CRM a obchodních evidencích, a podmínky sjednané s dodavateli;<br/>"
                               "&bull; <b>Technická dokumentace a know-how:</b> výrobní a konstrukční výkresy, 3D CAD modely, schémata zapojení, technické parametry větrných a solárních stromů, materiálové specifikace kompozitů, aerodynamické profily mikroturbín, řešení střídačů, řídicí elektroniky a bateriových systémů;<br/>"
                               "&bull; <b>Software, digitální aktiva a přístupy:</b> veškeré zdrojové i binární kódy, databázové struktury, webové a cloudové aplikace (zejména Treetino Pricing / Sales App), přístupová rozhraní (API), jakož i veškeré přístupové údaje (uživatelská jména, hesla, tokeny a certifikáty) přidělené Příjemci;<br/>"
                               "&bull; <b>Strategické a organizační informace:</b> informace o patentech, užitných a průmyslových vzorech v přípravě, investičních jednáních, smluvních vztazích s partnery a interních provozních postupech.", body_style))
        story.append(Paragraph("<b>3.3</b> Důvěrnou informací je rovněž samotná existence této Dohody, skutečnost, že mezi Smluvními stranami probíhají jednání, a veškerý obsah a parametry Vzájemné spolupráce.", body_style))
        story.append(Paragraph("<b>3.4</b> Veškeré informace uvedené v tomto článku jsou dále souhrnně označovány jako „<b>Chráněné informace</b>“. Má se za to, že veškeré informace předané Poskytovatelem Příjemci jsou Chráněnými informacemi, ledaže Poskytovatel výslovně písemně prohlásí opak.", body_style))
        
        story.append(Paragraph("IV. Závazky Příjemce a pravidla ochrany informací", section_title))
        story.append(Paragraph("<b>4.1 Příjemce se tímto neodvolatelně zavazuje:</b><br/>"
                               "&bull; Zachovávat o všech Chráněných informacích nejpřísnější mlčenlivost a chránit je s péčí řádného hospodáře a nejvyšší možnou mírou obezřetnosti;<br/>"
                               "&bull; Užívat Chráněné informace výhradně a pouze za účelem plnění dohodnuté Vzájemné spolupráce a výhradně ve prospěch Poskytovatele;<br/>"
                               "&bull; Neposkytnout, nesdělit, nezpřístupnit, nerozšiřovat, nepublikovat ani neumožnit přístup k Chráněným informacím žádné třetí osobě bez předchozího výslovného písemného souhlasu Poskytovatele;<br/>"
                               "&bull; Nevyužít Chráněné informace (včetně získaného know-how, kalkulačních modelů a klientských databází) ve svůj vlastní prospěch ani ve prospěch jakékoliv třetí osoby, zejména nevyvíjet přímou ani nepřímou konkurenční činnost vůči Poskytovateli a nevyvíjet ani nenabízet obdobná technická či obchodní řešení;<br/>"
                               "&bull; Nečinit žádné kroky směřující k obcházení Poskytovatele (<b>zákaz obcházení / non-circumvention</b>), zejména nekontaktovat napřímo klienty, poptávající osoby či dodavatele Poskytovatele za účelem uzavření obchodu mimo Poskytovatele.", body_style))
        story.append(Paragraph("<b>4.2 Omezení okruhu osob:</b> Příjemce je oprávněn zpřístupnit Chráněné informace pouze těm svým statutárním orgánům, zaměstnancům a odborným poradcům, kteří tyto informace nezbytně nutně potřebují k výkonu Vzájemné spolupráce (princip <i>need-to-know</i>). Příjemce je povinen tyto osoby předem prokazatelně a písemně zavázat mlčenlivostí ve stejném rozsahu jako dle této Dohody, přičemž za jakékoliv porušení těmito osobami odpovídá Příjemce tak, jako by se porušení dopustil sám.", body_style))
        story.append(Paragraph("<b>4.3 Technická a bezpečnostní ochrana:</b> Příjemce se zavazuje zabezpečit veškerá technická zařízení (počítače, mobilní telefony, tablety), ze kterých přistupuje k softwaru a systémům Poskytovatele, silnými přístupovými hesly a dvoufaktorovým ověřením (2FA). Příjemce nesmí sdělit své přístupové údaje žádné další osobě a nesmí ukládat Chráněné informace na veřejná či nezabezpečená cloudová úložiště.", body_style))
        story.append(Paragraph("<b>4.4 Oznamovací povinnost:</b> V případě zjištění jakéhokoliv neoprávněného přístupu, úniku, ztráty či vyzrazení Chráněných informací je Příjemce povinen neprodleně (nejpozději do 24 hodin) písemně informovat Poskytovatele a poskytnout mu veškerou součinnost k nápravě.", body_style))
        
        story.append(Paragraph("V. Výjimky ze závazku mlčenlivosti", section_title))
        story.append(Paragraph("<b>5.1</b> Povinnost mlčenlivosti dle této Dohody se nevztahuje na informace, které: (a) byly v době jejich zpřístupnění prokazatelně veřejně známé, nebo se staly veřejně známými po jejich zpřístupnění jinak než v důsledku porušení této Dohody či právních předpisů ze strany Příjemce; (b) měl Příjemce prokazatelně k dispozici již před jejich poskytnutím Poskytovatelem; (c) byly uvolněny ze závazku mlčenlivosti na základě předchozího písemného souhlasu Poskytovatele; (d) je Příjemce povinen zpřístupnit na základě kogentních právních předpisů, pravomocného rozhodnutí soudu, policejního orgánu nebo jiného věcně příslušného orgánu veřejné moci (s povinností předem písemně informovat Poskytovatele a minimalizovat rozsah sdělovaných dat).", body_style))
        
        story.append(Paragraph("VI. Duševní vlastnictví a nakládání s podklady", section_title))
        story.append(Paragraph("<b>6.1</b> Veškerá práva k Chráněným informacím, obchodnímu tajemství, patentům, užitným vzorům, ochranným známkám, autorským dílům, konstrukčním řešením, know-how, databázím a softwarovým nástrojům zůstávají výlučným a neomezeným majetkem Poskytovatele. Poskytnutí Chráněných informací nezakládá žádné licenční oprávnění ani převod vlastnických práv.", body_style))
        story.append(Paragraph("<b>6.2 Vrácení a skartace podkladů:</b> Příjemce je povinen na písemnou výzvu Poskytovatele nebo nejpozději do 5 (pěti) pracovních dnů od ukončení Vzájemné spolupráce vrátit Poskytovateli veškeré hmotné materiály, nosiče dat, výkresy, vzorky a dokumenty obsahující Chráněné informace a veškeré digitální kopie a záznamy trvale a nevratně vymazat/skartovat ze všech svých zařízení.", body_style))
        
        story.append(Paragraph("VII. Smluvní pokuta a odpovědnost za škodu", section_title))
        story.append(Paragraph("<b>7.1</b> Poruší-li Příjemce jakoukoliv povinnost stanovenou v této Dohodě (zejména poruší-li povinnost mlčenlivosti, zpřístupní-li Chráněné informace třetí osobě, zneužije-li Chráněné informace pro vlastní prospěch či prospěch třetích osob, poruší-li zákaz obcházení/konkurence nebo nesplní-li povinnost vrácení podkladů), je Příjemce povinen zaplatit Poskytovateli <b>smluvní pokutu ve výši 100.000 Kč (slovy: jedno sto tisíc korun českých)</b> za každý jednotlivý případ porušení. V případě trvajícího porušení se sjednává smluvní pokuta ve výši <b>5.000 Kč</b> za každý započatý den trvání porušení.", body_style))
        story.append(Paragraph("<b>7.2</b> Smluvní pokuta je splatná do 14 (čtrnácti) kalendářních dnů ode dne doručení písemné výzvy k její úhradě Příjemci.", body_style))
        story.append(Paragraph("<b>7.3 Náhrada škody:</b> Ujednáním o smluvní pokutě ani jejím zaplacením není nijak dotčeno ani omezeno právo Poskytovatele na náhradu způsobené škody, jiné majetkové i nemajetkové újmy a ušlého zisku v plné výši. Smluvní strany výslovně <b>vylučují aplikaci ustanovení § 2050 občanského zákoníku</b> a sjednávají, že náhrada škody je vymahatelná v plném rozsahu vedle smluvní pokuty.", body_style))
        
        story.append(Paragraph("VIII. Doba trvání a účinnost dohody", section_title))
        story.append(Paragraph("<b>8.1</b> Tato Dohoda nabývá platnosti a účinnosti dnem jejího podpisu oběma Smluvními stranami a uzavírá se na <b>dobu neurčitou</b>.", body_style))
        story.append(Paragraph("<b>8.2</b> Závazek k ochraně Chráněných informací a zachování mlčenlivosti trvá po celou dobu trvání jednání i samotné Vzájemné spolupráce Smluvních stran a dále po dobu <b>5 (pěti) let</b> od faktického ukončení veškeré Vzájemné spolupráce; v případě informací tvořících obchodní tajemství ve smyslu § 504 občanského zákoníku a know-how Poskytovatele trvá závazek mlčenlivosti po celou dobu existence tohoto obchodního tajemství bez časového omezení.", body_style))
        
        story.append(Paragraph("IX. Závěrečná ustanovení", section_title))
        story.append(Paragraph("<b>9.1</b> Právní vztahy založené touto Dohodou se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Případné spory budou rozhodovány věcně a místně příslušnými obecnými soudy České republiky podle sídla Poskytovatele.", body_style))
        story.append(Paragraph("<b>9.2</b> Veškeré změny a doplňky této Dohody vyžadují písemnou formu vzestupně číslovaných dodatků podepsaných oběma Smluvními stranami. Neplatnost některého ustanovení se nedotýká platnosti ostatních ustanovení (salvátorská klauzule).", body_style))
        story.append(Paragraph("<b>9.3</b> Tato Dohoda je vyhotovena ve dvou stejnopisech s platností originálu (po jednom pro každou stranu), popřípadě v jednom elektronickém vyhotovení opatřeném elektronickými podpisy obou Smluvních stran.", body_style))
    
    story.append(Spacer(1, 8))
    
    # 4. Signatures Box (using KeepTogether to prevent separation)
    sig_date_style = ParagraphStyle(
        'NDASigDate',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=5
    )
    
    sig_title_style = ParagraphStyle(
        'NDASigTitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e3a8a')
    )
    
    sig_name_style = ParagraphStyle(
        'NDASigName',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    # Dominik Masek Signature image handling
    masek_sig_flowable = ""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    masek_sig_path = os.path.join(base_dir, "frontend", "public", "branding", "signature_masek_2.png")
    if os.path.exists(masek_sig_path):
        masek_sig_flowable = Image(masek_sig_path, width=110, height=40)
    
    # Partner Canvas SVG signature path drawing flowable
    partner_sig_svg = user_data.get('nda_signature') or ''
    partner_sig_flowable = SvgSignatureFlowable(partner_sig_svg, width=150, height=50)
    
    formatted_sign_date = '29.06.2026'
    if user_data.get('nda_signed_at'):
        try:
            dt = datetime.strptime(user_data.get('nda_signed_at'), "%Y-%m-%d %H:%M:%S")
            if lang == "en":
                formatted_sign_date = dt.strftime("%B %d, %Y")
            else:
                formatted_sign_date = f"{dt.day}. {dt.month}. {dt.year}"
        except:
            formatted_sign_date = user_data.get('nda_signed_at')

    # Date headers directly above the signature box table
    if lang == "en":
        sig_table_data = [
            [
                Paragraph(f"In Prague on: {formatted_sign_date}", sig_date_style),
                Paragraph(f"In {user_data.get('nda_location') or '__________'} on: {formatted_sign_date}", sig_date_style)
            ],
            [
                masek_sig_flowable,
                partner_sig_flowable
            ],
            [
                Paragraph("Disclosing Party:", sig_title_style),
                Paragraph("Receiving Party:", sig_title_style)
            ],
            [
                Paragraph("Treetino corp s.r.o.", sig_name_style),
                Paragraph(user_data.get('nda_company') or user_data.get('username') or '', sig_name_style)
            ],
            [
                Paragraph("Represented by: Dominik Mašek, Managing Director", sig_name_style),
                Paragraph(f"Represented by: {user_data.get('nda_representative') or ''}", sig_name_style)
            ]
        ]
    else:
        sig_table_data = [
            [
                Paragraph(f"V Praze dne: {formatted_sign_date}", sig_date_style),
                Paragraph(f"V {user_data.get('nda_location') or '__________'} dne: {formatted_sign_date}", sig_date_style)
            ],
            [
                masek_sig_flowable,
                partner_sig_flowable
            ],
            [
                Paragraph("Poskytovatel:", sig_title_style),
                Paragraph("Příjemce:", sig_title_style)
            ],
            [
                Paragraph("Treetino corp s.r.o.", sig_name_style),
                Paragraph(user_data.get('nda_company') or user_data.get('username') or '', sig_name_style)
            ],
            [
                Paragraph("Zastoupen: Dominik Mašek, Jednatel", sig_name_style),
                Paragraph(f"Zastoupen: {user_data.get('nda_representative') or ''}", sig_name_style)
            ]
        ]
    
    sig_table = Table(sig_table_data, colWidths=[240, 255])
    sig_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 0.5, colors.HexColor('#cbd5e1')),
        ('LINEBELOW', (1, 0), (1, 0), 0.5, colors.HexColor('#cbd5e1')),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3),
        ('TOPPADDING', (0, 1), (-1, 1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    story.append(KeepTogether([sig_table]))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


# ─── Mediation Agreement PDF Generator ───

def generate_mediation_pdf(user_data: dict, lang: str = "cs") -> bytes:
    import io
    from datetime import datetime
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, Image
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    
    # Check if lang is passed inside user_data as well
    if not lang or lang == "cs":
        lang = user_data.get("lang", "cs")

    buffer = io.BytesIO()
    
    # Register fonts path
    fonts_path = os.path.join(os.path.dirname(__file__), "fonts")
    try:
        pdfmetrics.registerFont(TTFont("Roboto", os.path.join(fonts_path, "Roboto-Regular.ttf")))
        pdfmetrics.registerFont(TTFont("Roboto-Bold", os.path.join(fonts_path, "Roboto-Bold.ttf")))
    except:
        pass
        
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=45,
        bottomMargin=45
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'MediationTitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=13,
        leading=16,
        alignment=1, # Center
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        'MediationSubTitle',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8,
        leading=10,
        alignment=1, # Center
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )
    
    section_title = ParagraphStyle(
        'MediationSectionTitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'MediationBody',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )
    
    table_label_style = ParagraphStyle(
        'MediationTableLabel',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor('#1e3a8a')
    )
    
    table_text_style = ParagraphStyle(
        'MediationTableText',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )

    story = []
    
    # 1. Document Title
    if lang == "en":
        story.append(Paragraph("COMMERCIAL BROKERAGE AND MEDIATION AGREEMENT", title_style))
        story.append(Paragraph("concluded pursuant to Section 2445 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended", subtitle_style))
        story.append(Paragraph("I. Contracting Parties", section_title))
        
        poskytovatel_data = [
            [Paragraph("1. Principal:", table_label_style), ""],
            [Paragraph("Company Name:", table_text_style), Paragraph("Treetino corp s.r.o.", table_text_style)],
            [Paragraph("Company ID (IČO):", table_text_style), Paragraph("10800107", table_text_style)],
            [Paragraph("VAT ID (DIČ):", table_text_style), Paragraph("CZ10800107", table_text_style)],
            [Paragraph("Registered Seat:", table_text_style), Paragraph("Bílá - Vlčetín 62, 463 43 Bílá, Czech Republic", table_text_style)],
            [Paragraph("Represented by:", table_text_style), Paragraph("Dominik Mašek, Managing Director", table_text_style)]
        ]
        prijemce_data = [
            [Paragraph("2. Broker:", table_label_style), ""],
            [Paragraph("Name / Company:", table_text_style), Paragraph(user_data.get('mediation_company') or user_data.get('username') or '', table_text_style)],
            [Paragraph("ID No. / Birth Date:", table_text_style), Paragraph(user_data.get('mediation_ico_dob') or '', table_text_style)],
            [Paragraph("Seat / Residence:", table_text_style), Paragraph(user_data.get('mediation_address') or '', table_text_style)],
            [Paragraph("Represented by:", table_text_style), Paragraph(user_data.get('mediation_representative') or '', table_text_style)]
        ]
    else:
        story.append(Paragraph("SMLOUVA O ZPROSTŘEDKOVÁNÍ", title_style))
        story.append(Paragraph("uzavřená podle § 2445 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů", subtitle_style))
        story.append(Paragraph("I. Smluvní strany", section_title))
        
        poskytovatel_data = [
            [Paragraph("1. Zájemce:", table_label_style), ""],
            [Paragraph("Obchodní firma:", table_text_style), Paragraph("Treetino corp s.r.o.", table_text_style)],
            [Paragraph("IČO:", table_text_style), Paragraph("10800107", table_text_style)],
            [Paragraph("DIČ:", table_text_style), Paragraph("CZ10800107", table_text_style)],
            [Paragraph("Sídlo:", table_text_style), Paragraph("Bílá - Vlčetín 62, 463 43 Bílá", table_text_style)],
            [Paragraph("Zastoupená:", table_text_style), Paragraph("Dominikem Maškem, jednatel", table_text_style)]
        ]
        prijemce_data = [
            [Paragraph("2. Zprostředkovatel:", table_label_style), ""],
            [Paragraph("Jméno / Firma:", table_text_style), Paragraph(user_data.get('mediation_company') or user_data.get('username') or '', table_text_style)],
            [Paragraph("IČO / Datum nar.:", table_text_style), Paragraph(user_data.get('mediation_ico_dob') or '', table_text_style)],
            [Paragraph("Sídlo / Bydliště:", table_text_style), Paragraph(user_data.get('mediation_address') or '', table_text_style)],
            [Paragraph("Zastoupen/a:", table_text_style), Paragraph(user_data.get('mediation_representative') or '', table_text_style)]
        ]
    
    t1 = Table(poskytovatel_data, colWidths=[110, 385])
    t1.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t1)
    story.append(Spacer(1, 6))
    
    t2 = Table(prijemce_data, colWidths=[110, 385])
    t2.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))
    
    if lang == "en":
        story.append(Paragraph("(Principal and Broker hereinafter collectively referred to as 'Contracting Parties')", body_style))
        story.append(Paragraph("The Contracting Parties enter into this Mediation Agreement (hereinafter referred to as the 'Agreement') on the date indicated below.", body_style))
        
        # 3. Clauses EN
        story.append(Paragraph("II. Subject of Agreement", section_title))
        story.append(Paragraph("2.1 The Broker undertakes to carry out activities aimed at providing the Principal with opportunities to conclude contracts of sale or contracts for work with third parties (hereinafter 'Clients') for the supply of the Principal's products.", body_style))
        story.append(Paragraph("2.2 The subject of brokerage consists exclusively of the innovative products presented at www.treetino.eu, specifically the smart energy trees <b>Treetino V1</b>, <b>Treetino V2</b>, and <b>Wind Turbines</b> (hereinafter 'Products').", body_style))
        story.append(Paragraph("2.3 The Broker is authorized to actively market the Products. However, the Broker is not entitled to enter into contracts or accept performance on behalf of the Principal without prior written power of attorney.", body_style))
        
        story.append(Paragraph("III. Commission and Payment Terms", section_title))
        story.append(Paragraph("3.1 For procuring the opportunity to conclude a contract with a Client, the Broker is entitled to a commission of <b>3% of the net selling price excluding VAT</b> on each successfully realized transaction. This entitlement also arises if the Broker establishes the verified lead and the final sales negotiation is concluded by the Principal.", body_style))
        story.append(Paragraph("3.2 Entitlement to the commission arises exclusively upon full settlement by the Client of the initial invoice issued by the Principal for the given transaction.", body_style))
        story.append(Paragraph("3.3 The commission is payable within 14 days of receipt of payment from the Client into the Principal's bank account, based on a tax invoice duly issued by the Broker.", body_style))

        story.append(Paragraph("IV. Non-Disclosure Agreement (NDA) and IP Protection", section_title))
        story.append(Paragraph("4.1 The Broker acknowledges that the Products are subject to patent, industrial design, and trademark protections owned by the Principal. Reverse engineering, reproduction, or copying of the Products is strictly prohibited.", body_style))
        story.append(Paragraph("4.2 All commercial, technical, customer, and financial data constitute confidential trade secrets.", body_style))
        story.append(Paragraph("4.3 The Broker undertakes to maintain strict confidentiality during the term of this Agreement and for 5 (five) years following its termination.", body_style))

        story.append(Paragraph("V. Contractual Penalties and Damages", section_title))
        story.append(Paragraph("5.1 In the event of a breach of Article IV, the Broker shall pay a contractual penalty of <b>CZK 500,000</b> for each individual violation.", body_style))
        story.append(Paragraph("5.2 The right to claim full damages exceeding the contractual penalty remains unaffected.", body_style))
        
        story.append(Paragraph("VI. Final Provisions", section_title))
        story.append(Paragraph("6.1 Concluded for an indefinite duration, terminable by either party with 1 month's written notice.", body_style))
        story.append(Paragraph("6.2 Governed by the laws and Civil Code of the Czech Republic.", body_style))
        story.append(Paragraph("6.3 Executed in two counterparts.", body_style))
        story.append(Paragraph("6.4 The Parties declare that they have read and understood this Agreement and sign it freely.", body_style))
    else:
        story.append(Paragraph("(Zájemce a Zprostředkovatel dále společně též jako „Smluvní strany“)", body_style))
        story.append(Paragraph("Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Smlouvu o zprostředkování (dále jen „smlouva“).", body_style))
        
        # 3. Clauses CS
        story.append(Paragraph("II. Předmět smlouvy", section_title))
        story.append(Paragraph("2.1. Zprostředkovatel se touto smlouvou zavazuje, že bude vyvíjet činnost směřující k tomu, aby Zájemce měl příležitost uzavřít s třetími osobami (dále jen „Klienti“) kupní smlouvy nebo smlouvy o dílo na dodávku produktů Zájemce.", body_style))
        story.append(Paragraph("2.2. Předmětem zprostředkování jsou výhradně inovativní produkty Zájemce prezentované na webové stránce www.treetino.eu, a to konkrétně chytré stromy <b>Treetino V1</b>, <b>Treetino V2</b> a <b>Větrná turbína</b> (dále jen „Produkty“).", body_style))
        story.append(Paragraph("2.3. Zprostředkovatel je oprávněn Produkty aktivně nabízet a vyhledávat zájemce. Zprostředkovatel však není bez předchozí písemné plné moci oprávněn za Zájemce uzavírat jakékoliv smlouvy ani přijímat plnění.", body_style))
        
        story.append(Paragraph("III. Provize a platební podmínky", section_title))
        story.append(Paragraph("3.1. Za obstarání příležitosti k uzavření smlouvy s Klientem náleží Zprostředkovateli provize ve výši <b>3 % z čisté prodejní ceny bez DPH</b> u každého takto realizovaného obchodu. Nárok na tuto provizi vzniká Zprostředkovateli ve stejné výši i v případě, že pouze zajistí kontakt na Klienta a samotné smluvní jednání (prodej) dokončí Zájemce.", body_style))
        story.append(Paragraph("3.2. Nárok na provizi vzniká Zprostředkovateli výlučně v okamžiku, kdy Klient v plné výši uhradí Zájemci první vystavenou fakturu (např. zálohou fakturu či fakturu za první etapu plnění) vztahující se k danému obchodu.", body_style))
        story.append(Paragraph("3.3. Provize je splatná na základě daňového dokladu (faktury) řádně vystaveného Zprostředkovatelem. Lhůta splatnosti činí 14 dnů ode dne, kdy byla příslušná platba od Klienta prokazatelně připsána na bankovní účet Zájemce.", body_style))

        story.append(Paragraph("IV. Dohoda o mlčenlivosti (NDA) a ochrana práv", section_title))
        story.append(Paragraph("4.1. Zprostředkovatel výslovně bere na vědomí, že Produkty podléhají patentové ochraně a ochraně průmyslových vzorů, k nimž vykonává práva Zájemce. Zprostředkovatel nesmí Produkty jakýmkoliv způsobem napodobovat, zpětně analyzovat za účelem zjištění jejich konstrukce (reverse engineering), ani k takovému jednání poskytnout součinnost třetí straně.", body_style))
        story.append(Paragraph("4.2. Veškeré obchodní, technické a finanční informace, včetně informací o klientech, obchodních strategiích a cenotvorbě, se kterými se Zprostředkovatel při své činnosti seznámí, mají povahu důvěrných informací tvořících obchodní tajemství Zájemce.", body_style))
        story.append(Paragraph("4.3. Zprostředkovatel se zavazuje zachovávat absolutní mlčenlivost ohledně všech důvěrných informací. Tento závazek trvá po celou dobu trvání této smlouvy a dále po dobu 5 (pěti) let po jejím ukončení.", body_style))

        story.append(Paragraph("V. Smluvní pokuty a náhrada škody", section_title))
        story.append(Paragraph("5.1. V případě porušení jakékoliv povinnosti stanovené v čl. IV. této smlouvy ze strany Zprostředkovatele je Zprostředkovatel povinen uhradit Zájemci smluvní pokutu ve výši <b>500 000 Kč</b> (slovy: pět set tisíc korun českých) za každé jednotlivé porušení.", body_style))
        story.append(Paragraph("5.2. Ujednáním o smluvní pokutě ani jejím zaplacením není nijak dotčen nárok Zájemce na náhradu škody v plné výši, přesahuje-li výše škody sjednanou smluvní pokutu.", body_style))
        
        story.append(Paragraph("VI. Závěrečná ustanovení", section_title))
        story.append(Paragraph("6.1. Tato smlouva se uzavírá na dobu neurčitou. Smlouvu lze ukončit písemnou výpovědí kteroukoliv ze Smluvních stran i bez udání důvodu. Výpovědní doba činí 1 měsíc a počíná běžet prvním dnem kalendářního měsíce následujícího po doručení výpovědi druhé Smluvní straně.", body_style))
        story.append(Paragraph("6.2. Právní vztahy touto smlouvou výslovně neupravené se řídí příslušnými ustanoveními zákona č. 89/2012 Sb., občanský zákoník, v platném znění.", body_style))
        story.append(Paragraph("6.3. Smlouva je sepsána ve dvou vyhotoveních s platností originálu, z nichž každá Smluvní strana obdrží po jednom vyhotovení.", body_style))
        story.append(Paragraph("6.4. Smluvní strany prohlašují, že si tuto smlouvu před jejím podpisem přečetly, že byla uzavřena po vzájemném projednání, podle jejich pravé a svobodné vůle, určitě, vážně a srozumitelně, na důkaz čehož připojují své podpisy.", body_style))
    
    story.append(Spacer(1, 10))
    
    # 4. Signatures Box (using KeepTogether to prevent separation)
    sig_date_style = ParagraphStyle(
        'MediationSigDate',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=5
    )
    
    sig_title_style = ParagraphStyle(
        'MediationSigTitle',
        parent=styles['Normal'],
        fontName='Roboto-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e3a8a')
    )
    
    sig_name_style = ParagraphStyle(
        'MediationSigName',
        parent=styles['Normal'],
        fontName='Roboto',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    # Dominik Masek Signature image handling
    masek_sig_flowable = ""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    masek_sig_path = os.path.join(base_dir, "frontend", "public", "branding", "signature_masek_2.png")
    if os.path.exists(masek_sig_path):
        masek_sig_flowable = Image(masek_sig_path, width=110, height=40)
    
    # Partner Canvas SVG signature path drawing flowable
    partner_sig_svg = user_data.get('mediation_signature') or ''
    partner_sig_flowable = SvgSignatureFlowable(partner_sig_svg, width=150, height=50)
    
    formatted_sign_date = '29.06.2026'
    if user_data.get('mediation_signed_at'):
        try:
            dt = datetime.strptime(user_data.get('mediation_signed_at'), "%Y-%m-%d %H:%M:%S")
            if lang == "en":
                formatted_sign_date = dt.strftime("%B %d, %Y")
            else:
                formatted_sign_date = f"{dt.day}. {dt.month}. {dt.year}"
        except:
            formatted_sign_date = user_data.get('mediation_signed_at')

    # Date headers directly above the signature box table
    if lang == "en":
        sig_table_data = [
            [
                Paragraph(f"In Prague on: {formatted_sign_date}", sig_date_style),
                Paragraph(f"In {user_data.get('mediation_location') or '__________'} on: {formatted_sign_date}", sig_date_style)
            ],
            [
                masek_sig_flowable,
                partner_sig_flowable
            ],
            [
                Paragraph("For Principal (Treetino corp s.r.o.):", sig_title_style),
                Paragraph("For Broker:", sig_title_style)
            ],
            [
                Paragraph("Dominik Mašek (Managing Director)", sig_name_style),
                Paragraph(user_data.get('mediation_company') or user_data.get('username') or '', sig_name_style)
            ],
            [
                "",
                Paragraph(f"Represented by: {user_data.get('mediation_representative') or ''}", sig_name_style)
            ]
        ]
    else:
        sig_table_data = [
            [
                Paragraph(f"V Praze dne: {formatted_sign_date}", sig_date_style),
                Paragraph(f"V {user_data.get('mediation_location') or '__________'} dne: {formatted_sign_date}", sig_date_style)
            ],
            [
                masek_sig_flowable,
                partner_sig_flowable
            ],
            [
                Paragraph("Za Zájemce (Treetino corp s.r.o.):", sig_title_style),
                Paragraph("Za Zprostředkovatele:", sig_title_style)
            ],
            [
                Paragraph("Dominik Mašek (jednatel)", sig_name_style),
                Paragraph(user_data.get('mediation_company') or user_data.get('username') or '', sig_name_style)
            ],
            [
                "",
                Paragraph(f"Zastoupen: {user_data.get('mediation_representative') or ''}", sig_name_style)
            ]
        ]
    
    sig_table = Table(sig_table_data, colWidths=[240, 255])
    sig_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 0.5, colors.HexColor('#cbd5e1')),
        ('LINEBELOW', (1, 0), (1, 0), 0.5, colors.HexColor('#cbd5e1')),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3),
        ('TOPPADDING', (0, 1), (-1, 1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    story.append(KeepTogether([sig_table]))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
