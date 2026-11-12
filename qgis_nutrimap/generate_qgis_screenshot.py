import os
from PIL import Image, ImageDraw, ImageFont

base_dir = r"d:\semester 5\Sistem Informasi Geografis\PROJEK\qgis_nutrimap"
map_img_path = os.path.join(base_dir, "map_canvas.png")

# Window Dimensions
W, H = 1600, 1000

# Colors for QGIS UI (Dark/Light modern theme or standard native QGIS theme)
BG_UI = "#f0f0f0"
HEADER_BG = "#2c3e50"
MENU_BG = "#ffffff"
PANEL_BG = "#ffffff"
BORDER_COL = "#dcdde1"
TEXT_DARK = "#2d3436"
TEXT_MUTED = "#636e72"
ACCENT_BLUE = "#0984e3"
ROW_EVEN = "#ffffff"
ROW_ODD = "#f8f9fa"
ROW_SEL = "#dff9fb"

# Fonts
def get_font(size, bold=False):
    try:
        font_name = "segoeuib.ttf" if bold else "segoeui.ttf"
        return ImageFont.truetype(font_name, size)
    except:
        return ImageFont.load_default()

font_title = get_font(13, True)
font_menu = get_font(12, False)
font_bold = get_font(12, True)
font_regular = get_font(11, False)
font_table = get_font(11, False)
font_table_bold = get_font(11, True)
font_small = get_font(10, False)

img = Image.new("RGB", (W, H), BG_UI)
draw = ImageDraw.Draw(img)

# 1. Window Title Bar
draw.rectangle([0, 0, W, 32], fill="#1e272e")
draw.text((12, 8), "NutriMap_Kota_Bogor.qgz - QGIS 3.44.13-Solothurn (EPSG:4326 - WGS 84)", fill="#ffffff", font=font_title)
# Window control buttons (min, max, close)
draw.ellipse([W - 75, 10, W - 63, 22], fill="#f39c12")
draw.ellipse([W - 50, 10, W - 38, 22], fill="#27ae60")
draw.ellipse([W - 25, 10, W - 13, 22], fill="#e74c3c")

# 2. Menu Bar
draw.rectangle([0, 32, W, 60], fill=MENU_BG)
draw.line([0, 60, W, 60], fill=BORDER_COL, width=1)
menus = ["Project", "Edit", "View", "Layer", "Settings", "Plugins", "Vector", "Raster", "Database", "Web", "Mesh", "Processing", "Help"]
x_menu = 15
for m in menus:
    draw.text((x_menu, 38), m, fill=TEXT_DARK, font=font_menu)
    bbox = font_menu.getbbox(m)
    x_menu += (bbox[2] - bbox[0]) + 18

# 3. Toolbar Row
draw.rectangle([0, 60, W, 92], fill="#f8f9fa")
draw.line([0, 92, W, 92], fill=BORDER_COL, width=1)

# Toolbar buttons simulated
tools = ["[New]", "[Open]", "[Save]", "|", "[Pan]", "[Zoom In]", "[Zoom Out]", "[Full Extent]", "|", "[Identify]", "[Select Features]", "[Open Attribute Table]", "[Field Calculator]"]
x_tool = 12
for t in tools:
    if t == "|":
        draw.line([x_tool + 4, 66, x_tool + 4, 86], fill="#cbd5e1", width=1)
        x_tool += 14
    else:
        # draw button pill
        bbox = font_small.getbbox(t)
        bw = bbox[2] - bbox[0] + 10
        draw.rounded_rectangle([x_tool, 65, x_tool + bw, 87], radius=3, fill="#e2e8f0", outline="#cbd5e1")
        draw.text((x_tool + 5, 69), t.strip("[]"), fill="#1e293b", font=font_small)
        x_tool += bw + 6

# 4. Left Dock: Layers Panel
layer_panel_w = 340
canvas_top = 92
canvas_h = 570
draw.rectangle([0, canvas_top, layer_panel_w, canvas_top + canvas_h], fill=PANEL_BG)
draw.line([layer_panel_w, canvas_top, layer_panel_w, H], fill=BORDER_COL, width=1)

# Panel Header
draw.rectangle([0, canvas_top, layer_panel_w, canvas_top + 28], fill="#f1f2f6")
draw.text((12, canvas_top + 7), "Layers Panel", fill=TEXT_DARK, font=font_bold)
draw.line([0, canvas_top + 28, layer_panel_w, canvas_top + 28], fill=BORDER_COL, width=1)

# Layers Items
y_l = canvas_top + 38

# Item 1: Kesehatan
draw.rectangle([14, y_l+2, 24, y_l+12], outline=TEXT_DARK, width=1)
draw.text((16, y_l+1), "v", fill=TEXT_DARK, font=font_small)
draw.text((32, y_l), "+", fill="#8e44ad", font=font_bold)
draw.text((46, y_l), "KESEHATAN_PT_25K (Puskesmas)", fill=TEXT_DARK, font=font_regular)
y_l += 24

# Item 2: Niaga
draw.rectangle([14, y_l+2, 24, y_l+12], outline=TEXT_DARK, width=1)
draw.text((16, y_l+1), "v", fill=TEXT_DARK, font=font_small)
draw.rectangle([32, y_l+3, 40, y_l+11], fill="#d35400")
draw.text((46, y_l), "NIAGA_PT_25K (Pasar Rakyat)", fill=TEXT_DARK, font=font_regular)
y_l += 24

# Item 3: Jalan
draw.rectangle([14, y_l+2, 24, y_l+12], outline=TEXT_DARK, width=1)
draw.text((16, y_l+1), "v", fill=TEXT_DARK, font=font_small)
draw.line([32, y_l+7, 42, y_l+7], fill="#95a5a6", width=2)
draw.text((46, y_l), "JALAN_LN_25K (Jaringan Jalan)", fill=TEXT_DARK, font=font_regular)
y_l += 24

# Item 4: Sungai
draw.rectangle([14, y_l+2, 24, y_l+12], outline=TEXT_DARK, width=1)
draw.text((16, y_l+1), "v", fill=TEXT_DARK, font=font_small)
draw.rectangle([32, y_l+3, 42, y_l+11], fill="#74b9ff", outline="#0984e3")
draw.text((46, y_l), "SUNGAI_AR_25K (Perairan)", fill=TEXT_DARK, font=font_regular)
y_l += 26

# Item 5: Main Choropleth Layer
draw.rectangle([14, y_l+2, 24, y_l+12], outline=TEXT_DARK, width=1)
draw.text((16, y_l+1), "v", fill=TEXT_DARK, font=font_small)
draw.text((32, y_l), "v", fill=TEXT_DARK, font=font_small)
draw.text((44, y_l), "KOTA_BOGOR_KELURAHAN_NUTRIMAP", fill="#1e272e", font=font_bold)
y_l += 18
draw.text((44, y_l), "[Choropleth: Prevalensi Stunting & IKP]", fill=TEXT_MUTED, font=font_small)
y_l += 20

legend_items = [
    ("#2ecc71", "< 10.0%  (Aman / Bebas Stunting)"),
    ("#f1c40f", "10.0% - 14.0%  (Sedang)"),
    ("#e67e22", "14.0% - 18.0%  (Waspada)"),
    ("#e74c3c", "> 18.0%  (Prioritas Intervensi Utama)")
]

for col, leg_txt in legend_items:
    draw.rectangle([48, y_l+2, 60, y_l+12], fill=col, outline="#2c3e50")
    draw.text((68, y_l), leg_txt, fill=TEXT_DARK, font=font_small)
    y_l += 20

# 5. Center Map Canvas
map_x = layer_panel_w
map_w = W - layer_panel_w
map_h = canvas_h

if os.path.exists(map_img_path):
    map_pil = Image.open(map_img_path)
    # Fit into map_w, map_h preserving aspect ratio or crop nicely
    map_pil_resized = map_pil.resize((map_w, map_h), Image.Resampling.LANCZOS)
    img.paste(map_pil_resized, (map_x, canvas_top))

# Draw map canvas scale & coordinate bar at bottom of canvas
draw.rectangle([map_x, canvas_top + map_h - 26, W, canvas_top + map_h], fill="#ffffff")
draw.line([map_x, canvas_top + map_h - 26, W, canvas_top + map_h - 26], fill=BORDER_COL, width=1)
draw.text((map_x + 15, canvas_top + map_h - 19), "Coordinate: 106°47'45\"E, 6°35'42\"S  |  Scale: 1:45,000  |  Magnifier: 100%  |  EPSG: 4326 (WGS 84)", fill=TEXT_DARK, font=font_small)

# 6. Bottom Dock: Attribute Table
tbl_top = canvas_top + canvas_h
tbl_h = H - tbl_top

draw.rectangle([0, tbl_top, W, H], fill="#ffffff")
draw.line([0, tbl_top, W, tbl_top], fill=BORDER_COL, width=2)

# Attribute Table Header Bar
draw.rectangle([0, tbl_top, W, tbl_top + 26], fill="#eef1f6")
draw.text((12, tbl_top + 6), "Attribute table - KOTA_BOGOR_KELURAHAN_NUTRIMAP :: Features Total: 68, Filtered: 68, Selected: 0", fill=TEXT_DARK, font=font_table_bold)
draw.line([0, tbl_top + 26, W, tbl_top + 26], fill=BORDER_COL, width=1)

# Columns definition
cols = [
    ("KODEPUM", 90),
    ("KELURAHAN", 140),
    ("KECAMATAN", 130),
    ("KOTA", 110),
    ("STUNTING (%)", 115),
    ("KEMISKINAN (%)", 125),
    ("KERENTANAN", 115),
    ("AIR_BERSIH (%)", 125),
    ("PRIORITAS INTERVENSI", 180)
]

# Table Column Header
y_tbl = tbl_top + 27
draw.rectangle([0, y_tbl, W, y_tbl + 24], fill="#f1f5f9")
x_c = 10
for col_name, col_w in cols:
    draw.text((x_c + 4, y_tbl + 5), col_name, fill="#334155", font=font_table_bold)
    draw.line([x_c + col_w, y_tbl, x_c + col_w, H], fill="#e2e8f0", width=1)
    x_c += col_w

draw.line([0, y_tbl + 24, W, y_tbl + 24], fill="#cbd5e1", width=1)
y_tbl += 25

# Table Sample Rows (11 sample rows to fill the table view)
sample_rows = [
    ("32.71.01", "Babakan", "Bogor Tengah", "Kota Bogor", "7.20", "2.80", "18.50", "97.40", "Prioritas 3 (Rendah)"),
    ("32.71.02", "Babakan Pasar", "Bogor Tengah", "Kota Bogor", "14.10", "6.90", "35.20", "92.00", "Prioritas 2 (Sedang)"),
    ("32.71.03", "Cibogor", "Bogor Tengah", "Kota Bogor", "9.80", "4.10", "24.00", "95.80", "Prioritas 3 (Rendah)"),
    ("32.71.20", "Batutulis", "Bogor Selatan", "Kota Bogor", "15.00", "6.80", "38.00", "88.00", "Prioritas 2 (Sedang)"),
    ("32.71.21", "Bojongkerta", "Bogor Selatan", "Kota Bogor", "22.40", "11.20", "58.00", "76.50", "Prioritas 1 (Tinggi)"),
    ("32.71.31", "Mulyaharja", "Bogor Selatan", "Kota Bogor", "23.80", "12.00", "62.00", "74.00", "Prioritas 1 (Tinggi)"),
    ("32.71.36", "Baranangsiang", "Bogor Timur", "Kota Bogor", "9.50", "3.90", "22.50", "95.50", "Prioritas 3 (Rendah)"),
    ("32.71.42", "Balungbangjaya", "Bogor Barat", "Kota Bogor", "16.80", "7.50", "42.50", "85.50", "Prioritas 2 (Sedang)"),
    ("32.71.46", "Curug", "Bogor Barat", "Kota Bogor", "19.50", "9.10", "50.00", "81.00", "Prioritas 1 (Tinggi)"),
    ("32.71.52", "Pasirjaya", "Bogor Barat", "Kota Bogor", "21.00", "10.40", "54.00", "79.00", "Prioritas 1 (Tinggi)"),
    ("32.71.60", "Kedungbadak", "Tanah Sareal", "Kota Bogor", "10.80", "4.60", "25.00", "94.50", "Prioritas 3 (Rendah)"),
]

for idx, row in enumerate(sample_rows):
    bg_row = ROW_SEL if idx == 5 else (ROW_EVEN if idx % 2 == 0 else ROW_ODD)
    draw.rectangle([0, y_tbl, W, y_tbl + 22], fill=bg_row)
    draw.line([0, y_tbl + 22, W, y_tbl + 22], fill="#e2e8f0", width=1)
    
    x_c = 10
    for val_idx, val in enumerate(row):
        col_w = cols[val_idx][1]
        
        # Color badge for priority column
        if val_idx == 8:
            if "Tinggi" in val:
                txt_col = "#c0392b"
            elif "Sedang" in val:
                txt_col = "#d35400"
            else:
                txt_col = "#27ae60"
            draw.text((x_c + 6, y_tbl + 4), val, fill=txt_col, font=font_table_bold)
        else:
            draw.text((x_c + 6, y_tbl + 4), str(val), fill=TEXT_DARK, font=font_table)
            
        x_c += col_w
    y_tbl += 22

output_screenshot = os.path.join(base_dir, "screenshot_qgis_nutrimap.png")
img.save(output_screenshot, "PNG", quality=95)
print(f"Generated QGIS screenshot composite: {output_screenshot}")
