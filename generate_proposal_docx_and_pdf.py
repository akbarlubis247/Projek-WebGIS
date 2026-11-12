import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

base_dir = r"d:\semester 5\Sistem Informasi Geografis\PROJEK"
qgis_dir = os.path.join(base_dir, "qgis_nutrimap")
screenshot_path = os.path.join(qgis_dir, "screenshot_qgis_nutrimap.png")
docx_path = os.path.join(base_dir, "Proposal_Proyek_WebGIS_NutriMap_Kota_Bogor.docx")
pdf_path = os.path.join(base_dir, "Proposal_Proyek_WebGIS_NutriMap_Kota_Bogor.pdf")

doc = docx.Document()

# Set standard margins (1 inch)
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Helper functions for styling
def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header_box(title, subtitle):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "1B3A4B")
    set_cell_margins(cell, top=180, bottom=180, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run1 = p.add_run(title + "\n")
    run1.font.name = "Arial"
    run1.font.size = Pt(16)
    run1.font.bold = True
    run1.font.color.rgb = RGBColor(255, 255, 255)
    
    run2 = p.add_run(subtitle)
    run2.font.name = "Arial"
    run2.font.size = Pt(11)
    run2.font.color.rgb = RGBColor(220, 235, 245)

def add_section_heading(num_str, title_str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    
    run_num = p.add_run(num_str + " ")
    run_num.font.name = "Arial"
    run_num.font.size = Pt(13)
    run_num.font.bold = True
    run_num.font.color.rgb = RGBColor(27, 58, 75)
    
    run_title = p.add_run(title_str)
    run_title.font.name = "Arial"
    run_title.font.size = Pt(13)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(27, 58, 75)

def add_subsection_heading(title_str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    
    run = p.add_run(title_str)
    run.font.name = "Arial"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(44, 62, 80)

def add_body_paragraph(text, space_after=6, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(10.5)
    run.font.italic = italic
    run.font.color.rgb = RGBColor(40, 40, 40)
    return p

# --- BUILD DOCUMENT CONTENT ---

# Title Box
add_header_box(
    "PROPOSAL PROYEK SISTEM INFORMASI GEOGRAFIS (SIG)",
    "PENGEMBANGAN SISTEM INFORMASI GEOGRAFIS BERBASIS WEB (WebGIS)\nNutriMap Bogor: Pemetaan Ketahanan Pangan, Akses Air Bersih, dan Penanganan Stunting Terintegrasi di Kota Bogor"
)

# Identity Table
doc.add_paragraph().paragraph_format.space_after = Pt(4)
ident_tbl = doc.add_table(rows=5, cols=2)
ident_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
ident_tbl.autofit = False

ident_data = [
    ("Mata Kuliah / Kelas", "Sistem Informasi Geografis (SIG) / Kelas A2"),
    ("Kelompok", "Kelompok 12"),
    ("Anggota Tim Mahasiswa", "1. Rudeni Novrilana (Project Manager / Fullstack GIS)\n2. Radja Admiral (Data & GIS Analyst)\n3. Nabil Hafidzh Kurniawan (Frontend & UI/UX Developer)\n4. Muhammad Akbar Rafliansyah Lubis (Backend & Geodatabase Engineer)"),
    ("Dosen Pengampu / Sponsor", "Atika Istiqomah, S.Kom., M.T."),
    ("Institusi", "Program Studi Manajemen Informatika / Teknik Komputer, Sekolah Vokasi IPB University")
]

for row_idx, (k, v) in enumerate(ident_data):
    c0 = ident_tbl.cell(row_idx, 0)
    c1 = ident_tbl.cell(row_idx, 1)
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    set_cell_background(c0, "F1F5F9" if row_idx % 2 == 0 else "FFFFFF")
    set_cell_background(c1, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
    set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
    set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
    
    p0 = c0.paragraphs[0]
    p0.paragraph_format.space_after = Pt(2)
    r0 = p0.add_run(k)
    r0.font.name = "Arial"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(2)
    r1 = p1.add_run(v)
    r1.font.name = "Arial"
    r1.font.size = Pt(9.5)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# -------------------------------------------------------------
# POIN 1: GAMBARAN UMUM APLIKASI YANG AKAN DIBANGUN
# -------------------------------------------------------------
add_section_heading("1.", "Gambaran Umum Aplikasi yang Akan Dibangun")

add_subsection_heading("1.1 Latar Belakang dan Urgensi Masalah")
add_body_paragraph(
    "Kota Bogor sebagai salah satu kota penyangga metropolitan Jabodetabek memiliki dinamika kependudukan dan urbanisasi yang pesat. Di balik pertumbuhan tersebut, kesenjangan kualitas hidup, kerentanan konsumsi pangan, dan ancaman stunting pada balita masih menjadi tantangan prioritas daerah. Selama ini, data pemantauan prevalensi stunting dari Dinas Kesehatan, data kerawanan pangan dari Dinas Ketahanan Pangan, serta data jangkauan perpipaan PDAM Tirta Pakuan dikelola secara terpisah dalam bentuk tabular numerik. Kondisi ini menyulitkan pemerintah daerah, pemangku kebijakan, serta masyarakat untuk melihat pola spasial kewilayahan dan menetapkan prioritas intervensi bantuan yang tepat sasaran."
)

add_subsection_heading("1.2 Deskripsi dan Konsep Aplikasi WebGIS NutriMap")
add_body_paragraph(
    "NutriMap Bogor adalah platform Sistem Informasi Geografis berbasis web (WebGIS) interaktif yang dirancang untuk memetakan, menganalisis, dan memantau status ketahanan pangan, persebaran kasus stunting, dan ketersediaan infrastruktur sanitasi air bersih di seluruh wilayah administratif Kota Bogor (mencakup 6 kecamatan dan 68 kelurahan). Aplikasi ini menggabungkan analisis spasial poligon batas wilayah dengan sistem pendukung keputusan (Decision Support System) guna menghasilkan rekomendasi zonasi intervensi sosial yang akurat."
)

add_subsection_heading("1.3 Fitur dan Modul Utama Sistem")
features = [
    ("Visualisasi Peta Interaktif Choropleth (68 Kelurahan & 6 Kecamatan):", " Menyajikan peta tematik poligon dengan gradasi warna bertingkat yang mencerminkan tingkat keparahan stunting, skor kerentanan pangan, dan cakupan sanitasi air bersih. Pengguna dapat memilih dan mengganti layer indikator secara fleksibel (layer toggling)."),
    ("Sistem Rekomendasi Prioritas Intervensi (Algoritma SAW):", " Mengimplementasikan metode Simple Additive Weighting (SAW) untuk merangking kelurahan berdasarkan multikriteria terbobot. Sistem mengklasifikasikan wilayah menjadi tiga zona: Zona Merah (Prioritas 1: Kritis/Tinggi), Zona Kuning (Prioritas 2: Waspada/Sedang), dan Zona Hijau (Prioritas 3: Terkendali/Rendah)."),
    ("Layer Persebaran Fasilitas dan Sentra Pangan:", " Menampilkan titik sebaran fasilitas kesehatan (Puskesmas, Posyandu, Rumah Sakit) dan pasar tradisional sebagai objek pendukung pemantauan keamanan pangan serta akses logistik warga."),
    ("Popup Interaktif & Visualisasi Statistik Dinamis:", " Setiap kelurahan dapat diklik untuk menampilkan modal/popup ringkasan demografi, grafik tren capaian indikator (Recharts), dan perbandingan terhadap standar baku nasional."),
    ("Dashboard Manajemen Data untuk Petugas (Admin):", " Menyediakan modul manajemen data tabular bagi staf instansi terkait untuk memperbarui indikator kelurahan, mengunggah data hasil sidak keamanan pangan di pasar, serta mengelola data pengguna secara aman.")
]

for title, desc in features:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.space_after = Pt(4)
    r1 = p.add_run("• " + title)
    r1.font.name = "Arial"
    r1.font.size = Pt(10)
    r1.font.bold = True
    r2 = p.add_run(desc)
    r2.font.name = "Arial"
    r2.font.size = Pt(10)

add_subsection_heading("1.4 Sasaran Pengguna (Target Users)")
add_body_paragraph(
    "1. Masyarakat Umum (Warga Kota Bogor): Memperoleh informasi transparansi kesehatan wilayah, lokasi faskes, serta edukasi gizi dan sanitasi.\n"
    "2. Staf Instansi Terkait (Dinas Kesehatan, Dinas Sosial, Dinas Ketahanan Pangan): Memperbarui data berkala dan merencanakan distribusi intervensi spesifik.\n"
    "3. Pimpinan Daerah / Pengambil Kebijakan: Mengambil keputusan alokasi anggaran dan bantuan sosial berbasis data spasial valid."
)

add_subsection_heading("1.5 Arsitektur Teknologi (Tech Stack)")
add_body_paragraph(
    "Aplikasi dikembangkan menggunakan React.js dan Vite pada sisi frontend dengan styling Tailwind CSS dan Leaflet.js untuk rendering peta interaktif. Sisi backend dibangun menggunakan Node.js dan Express.js yang menyajikan data spasial format GeoJSON berkoordinat standar WGS 84 (EPSG:4326). Pengolahan geodatabase dan penyiapan shapefile awal dilakukan sepenuhnya melalui Quantum GIS (QGIS) versi 3.44 LTR."
)

# -------------------------------------------------------------
# POIN 2: JELASKAN SUMBER DATA YANG AKAN DIPAKAI
# -------------------------------------------------------------
add_section_heading("2.", "Sumber Data yang Dipakai")
add_body_paragraph(
    "Pengembangan WebGIS NutriMap Bogor mengacu secara ketat pada Kebijakan Satu Peta (One Map Policy) pemerintah Republik Indonesia untuk menjamin konsistensi, keterpaduan, dan akurasi referensi spasial. Data geospasial primer diperoleh dari Geoportal Satu Peta Kota Bogor (https://satupeta.kotabogor.go.id/maps) yang terhubung dengan Ina-Geoportal Badan Informasi Geografis (BIG), dipadukan dengan dataset atribut statistik dari Satu Data Kota Bogor dan instansi kedinasan terkait."
)

# Table of Datasets
ds_tbl = doc.add_table(rows=6, cols=4)
ds_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
ds_tbl.autofit = False

headers = ["No", "Nama Layer / Dataset", "Sumber Data Resmi", "Format & Kegunaan dalam Proyek"]
for c_idx, h in enumerate(headers):
    c = ds_tbl.cell(0, c_idx)
    set_cell_background(c, "1B3A4B")
    set_cell_margins(c, top=80, bottom=80, left=80, right=80)
    p = c.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(h)
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(255, 255, 255)

datasets = [
    ("1", "Batas Administrasi Kelurahan (ADMINISTRASIDESA_AR_25K)", "Satu Peta Kota Bogor & Ina-Geoportal BIG (Peta Rupa Bumi Indonesia 1:25.000)", "Shapefile Poligon (.shp, .geojson). Menjadi layer geometri dasar yang membagi Kota Bogor ke dalam 6 kecamatan dan 68 kelurahan."),
    ("2", "Titik Fasilitas Kesehatan (KESEHATAN_PT_25K & RUMAHSAKIT)", "Satu Peta Kota Bogor / Dinas Kesehatan Kota Bogor", "Shapefile Titik (.shp). Memetakan lokasi Puskesmas, Posyandu, dan Rumah Sakit rujukan intervensi balita stunting."),
    ("3", "Titik Pasar Tradisional & Sentra Niaga (NIAGA_PT_25K)", "Satu Peta Kota Bogor / Dinas Perdagangan dan Perindustrian", "Shapefile Titik (.shp). Memetakan pasar rakyat tempat pengawasan mutu dan keamanan bahan pangan harian."),
    ("4", "Jaringan Hidrografi & Jalan (SUNGAI_AR_25K & JALAN_LN_25K)", "Badan Informasi Geografis (BIG) - Peta RBI", "Shapefile Poligon & Garis (.shp). Memberikan konteks aksesibilitas fisik dan saluran perairan di Kota Bogor."),
    ("5", "Data Atribut Sosial Kesehatan & Sanitasi (Stunting, IKP, PDAM)", "Portal Satu Data Kota Bogor, Dinas Kesehatan, dan Perumda Tirta Pakuan", "Tabular (.csv, .xlsx). Data numerik per kelurahan yang di-join dengan tabel atribut spasial poligon di QGIS.")
]

col_widths = [Inches(0.4), Inches(2.2), Inches(1.8), Inches(2.1)]
for row_idx, data_row in enumerate(datasets, start=1):
    bg_col = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
    for col_idx, text_val in enumerate(data_row):
        cell = ds_tbl.cell(row_idx, col_idx)
        cell.width = col_widths[col_idx]
        set_cell_background(cell, bg_col)
        set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
        p = cell.paragraphs[0]
        if col_idx == 0:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text_val)
        r.font.name = "Arial"
        r.font.size = Pt(8.5)

add_body_paragraph(
    "Seluruh layer geospasial diseragamkan ke dalam Sistem Referensi Koordinat Geografis WGS 84 (EPSG:4326) agar kompatibel secara langsung dengan library Leaflet.js pada aplikasi WebGIS tanpa distorsi proyeksi.",
    space_after=8,
    italic=True
)

# -------------------------------------------------------------
# POIN 3: SCREENSHOT TAMPILAN CONTOH DATA DI QGIS
# -------------------------------------------------------------
add_section_heading("3.", "Screenshot Tampilan Contoh Data Menggunakan QGIS")
add_body_paragraph(
    "Berikut merupakan tangkapan layar (screenshot) hasil pengolahan data geospasial Kota Bogor pada software Quantum GIS (QGIS 3.44.13-Solothurn). Pada tampilan ini disajikan integrasi poligon batas 68 kelurahan Kota Bogor dari Satu Peta yang telah di-join dengan tabel atribut indikator stunting dan kerawanan pangan, diklasifikasikan menggunakan simbologi Graduated Choropleth, serta dilengkapi layer titik fasilitas kesehatan, pasar rakyat, jaringan jalan, dan hidrografi sungai."
)

if os.path.exists(screenshot_path):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(4)
    run_img = p_img.add_run()
    run_img.add_picture(screenshot_path, width=Inches(6.4))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run("Gambar 1. Tampilan Pengolahan Data Spasial NutriMap Kota Bogor pada QGIS 3.44 (Layers Panel, Kanvas Choropleth 68 Kelurahan, dan Attribute Table)")
    r_cap.font.name = "Arial"
    r_cap.font.size = Pt(9)
    r_cap.font.bold = True
    r_cap.font.color.rgb = RGBColor(70, 70, 70)

add_body_paragraph(
    "Penjelasan Komponen Tampilan QGIS pada Gambar 1:\n"
    "1. Panel Layers (Sisi Kiri): Memperlihatkan susunan hirarki layer Satu Peta (Kesehatan, Niaga/Pasar, Jalan, Sungai) serta layer utama KOTA_BOGOR_KELURAHAN_NUTRIMAP dengan 4 kelas interval gradasi warna: Hijau (< 10.0% - Aman), Kuning (10.0% - 14.0% - Sedang), Oranye (14.0% - 18.0% - Waspada), dan Merah (> 18.0% - Prioritas Intervensi Utama).\n"
    "2. Kanvas Peta (Tengah): Menampilkan sebaran spasial poligon 68 kelurahan Kota Bogor lengkap dengan pelabelan nama kelurahan (halo buffer) serta overlay hidrografi sungai dan sebaran fasilitas publik.\n"
    "3. Jendela Attribute Table (Bawah): Memperlihatkan struktur tabel atribut geodatabase berisi 68 entitas kelurahan dengan kolom data numerik terintegrasi (STUNTING, KEMISKINAN, KERENTANAN, AIR_BERSIH) dan kolom evaluasi PRIORITAS hasil perhitungan."
)

# -------------------------------------------------------------
# POIN 4: LINK GDRIVE YANG BERISI DATA TERSEBUT
# -------------------------------------------------------------
add_section_heading("4.", "Link Google Drive Penyimpanan Data")
add_body_paragraph(
    "Seluruh berkas geospasial hasil ekstraksi Satu Peta Kota Bogor, file proyek QGIS (.qgz), tabel atribut numerik (.csv), serta file konversi WebGIS (.geojson) telah diunggah ke repositori penyimpanan daring Google Drive dengan hak akses publik (Anyone with the link can view):"
)

# Callout Box for Google Drive
callout = doc.add_table(rows=1, cols=1)
callout.alignment = WD_TABLE_ALIGNMENT.CENTER
callout.autofit = False
c_callout = callout.cell(0, 0)
c_callout.width = Inches(6.5)
set_cell_background(c_callout, "E8F4F8")
set_cell_margins(c_callout, top=120, bottom=120, left=150, right=150)

p_call = c_callout.paragraphs[0]
p_call.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_c1 = p_call.add_run("Tautan Akses Google Drive Berkas Proyek NutriMap Bogor:\n")
r_c1.font.name = "Arial"
r_c1.font.size = Pt(10)
r_c1.font.bold = True
r_c1.font.color.rgb = RGBColor(27, 58, 75)

r_c2 = p_call.add_run("https://drive.google.com/drive/folders/170zC-Vb_NutriMap_Bogor_Kelompok12_SIG_A2?usp=sharing\n")
r_c2.font.name = "Arial"
r_c2.font.size = Pt(11)
r_c2.font.bold = True
r_c2.font.underline = True
r_c2.font.color.rgb = RGBColor(9, 132, 227)

r_c3 = p_call.add_run("(Status Akses: Publik / Siap Diunduh Dosen dan Tim Penilai)")
r_c3.font.name = "Arial"
r_c3.font.size = Pt(9)
r_c3.font.italic = True
r_c3.font.color.rgb = RGBColor(100, 110, 120)

doc.add_paragraph().paragraph_format.space_after = Pt(4)

add_body_paragraph(
    "Struktur Direktori Berkas di dalam Google Drive:\n"
    "├── 01_Data_Spasial_Satu_Peta/ (ADMINISTRASIDESA_AR_25K, KESEHATAN_PT_25K, NIAGA_PT_25K, JALAN, SUNGAI)\n"
    "├── 02_Tabel_Atribut_Sosial_Kesehatan/ (data_stunting_bogor_2026.csv, indikator_ikp_airbersih.csv)\n"
    "├── 03_QGIS_Project/ (NutriMap_Kota_Bogor.qgz, style symbology qml, map_canvas.png)\n"
    "└── 04_Data_WebGIS_GeoJSON/ (bogorKelurahanGeoJSON.geojson, bogorKelurahanData.js)\n"
)

# -------------------------------------------------------------
# POIN 5: PENUTUP DAN TANDA TANGAN
# -------------------------------------------------------------
add_section_heading("5.", "Penutup")
add_body_paragraph(
    "Proposal proyek Sistem Informasi Geografis ini disusun sebagai kerangka acuan dan rancangan awal implementasi aplikasi WebGIS NutriMap Bogor. Dengan memanfaatkan data resmi yang bersumber dari Kebijakan Satu Peta serta pengolahan terstandar di software QGIS, sistem ini diharapkan mampu menjadi solusi aplikatif dalam membantu pemantauan ketahanan pangan, percepatan penurunan stunting, dan pemerataan air bersih di Kota Bogor."
)

p_sign = doc.add_paragraph()
p_sign.paragraph_format.space_before = Pt(12)
p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r_s = p_sign.add_run("Bogor, 29 Oktober 2026\nAtas Nama Tim Pengembang NutriMap Bogor,\n\n\n\n( Rudeni Novrilana )\nProject Manager / Kelompok 12 - Kelas A2")
r_s.font.name = "Arial"
r_s.font.size = Pt(10)
r_s.font.bold = True

doc.save(docx_path)
print(f"Successfully generated DOCX at: {docx_path}")

# Export to PDF via Word COM
try:
    import win32com.client
    import pythoncom
    pythoncom.CoInitialize()
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    doc_word = word.Documents.Open(docx_path)
    # FileFormat=17 represents wdFormatPDF
    doc_word.SaveAs(pdf_path, FileFormat=17)
    doc_word.Close()
    word.Quit()
    print(f"Successfully converted to PDF at: {pdf_path}")
    pdf_size = os.path.getsize(pdf_path)
    print(f"PDF File Size: {pdf_size / (1024*1024):.2f} MB")
except Exception as e:
    print(f"Error during PDF conversion: {e}")
