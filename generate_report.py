import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_nutrimap_report():
    doc = docx.Document()

    # 1. Page Setup (A4, 2.54cm margins)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header & Footer for normal pages
        header = section.header
        hp = header.paragraphs[0]
        hp.text = "NutriMap Bogor — Laporan Arsitektur & Workflow Sistem WebGIS"
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hp.style.font.name = "Calibri"
        hp.style.font.size = Pt(8.5)
        hp.style.font.color.rgb = RGBColor(120, 140, 130)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.text = "Sistem Informasi Geografis (Semester 5) | Program Studi Informatika / SIG"
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        fp.style.font.name = "Calibri"
        fp.style.font.size = Pt(8.5)
        fp.style.font.color.rgb = RGBColor(120, 140, 130)

    # Style Helpers
    COLOR_PRIMARY = RGBColor(20, 122, 85)     # #147A55
    COLOR_DARK = RGBColor(7, 63, 50)          # #073F32
    COLOR_BODY = RGBColor(23, 43, 37)         # #172B25
    COLOR_MUTED = RGBColor(90, 105, 98)       # #5A6962
    COLOR_EMERALD = RGBColor(32, 184, 121)    # #20B879
    HEX_PRIMARY = "147A55"
    HEX_LIGHT_BG = "F4F8F6"
    HEX_BORDER = "D1E2DB"

    def set_run_font(run, font_name="Calibri", size_pt=11, color=COLOR_BODY, bold=False, italic=False):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.font.color.rgb = color
        run.bold = bold
        run.italic = italic

    def add_p(text="", size=11, color=COLOR_BODY, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=6, line_spacing=1.15):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            r = p.add_run(text)
            set_run_font(r, size_pt=size, color=color, bold=bold, italic=italic)
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        set_run_font(r, size_pt=16, color=COLOR_PRIMARY, bold=True)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        set_run_font(r, size_pt=13, color=COLOR_DARK, bold=True)
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        set_run_font(r, size_pt=11.5, color=COLOR_PRIMARY, bold=True)
        return p

    def add_callout(text, title="CATATAN PENTING"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        
        # XML background & left border
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_LIGHT_BG}"/>')
        tcPr.append(shd)
        
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>\n'
            f'  <w:top w:val="none"/>\n'
            f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_PRIMARY}"/>\n'
            f'  <w:bottom w:val="none"/>\n'
            f'  <w:right w:val="none"/>\n'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"📌 {title}\n")
        set_run_font(r_title, size_pt=10.5, color=COLOR_PRIMARY, bold=True)
        
        r_text = p.add_run(text)
        set_run_font(r_text, size_pt=10, color=COLOR_BODY, italic=True)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def style_table(table, col_widths, headers, rows_data):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            tcPr = hdr_cells[i]._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_PRIMARY}"/>')
            tcPr.append(shd)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            for r in p.runs:
                set_run_font(r, size_pt=10, color=RGBColor(255, 255, 255), bold=True)
                
        # Data Rows
        for r_idx, row_values in enumerate(rows_data):
            row = table.add_row()
            fill_hex = "FFFFFF" if r_idx % 2 == 0 else HEX_LIGHT_BG
            for c_idx, val in enumerate(row_values):
                cell = row.cells[c_idx]
                cell.text = str(val)
                tcPr = cell._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
                tcPr.append(shd)
                
                # thin borders
                borders = parse_xml(
                    f'<w:tcBorders {nsdecls("w")}>\n'
                    f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>\n'
                    f'  <w:left w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>\n'
                    f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>\n'
                    f'  <w:right w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>\n'
                    f'</w:tcBorders>'
                )
                tcPr.append(borders)
                
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(3)
                p.paragraph_format.space_after = Pt(3)
                p.paragraph_format.line_spacing = 1.15
                for r in p.runs:
                    set_run_font(r, size_pt=9.5, color=COLOR_BODY)

        # Set column widths
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    # ==========================================
    # COVER PAGE
    # ==========================================
    add_p(text="TUGAS BESAR SISTEM INFORMASI GEOGRAFIS (SEMESTER 5)", size=12, color=COLOR_PRIMARY, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=40, space_after=12)
    add_p(text="LAPORAN PERANCANGAN & IMPLEMENTASI WORKFLOW SISTEM", size=14, color=COLOR_DARK, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
    
    # Big Title
    p_title = add_p(text="NUTRIMAP BOGOR", size=26, color=COLOR_PRIMARY, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    add_p(text="Platform WebGIS Interaktif Pemetaan Ketahanan Pangan, Akses Air Bersih, dan Penanganan Stunting Terintegrasi di Kota Bogor", size=13, color=COLOR_MUTED, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=40)
    
    # Decorative Divider
    tbl_line = doc.add_table(rows=1, cols=1)
    tbl_line.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_line = tbl_line.cell(0, 0)
    c_line.width = Inches(3.0)
    tcPr = c_line._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_PRIMARY}"/>'))
    p_l = c_line.paragraphs[0]
    p_l.paragraph_format.space_before = Pt(1)
    p_l.paragraph_format.space_after = Pt(1)

    # Identitas Penyusun
    add_p(space_before=100)
    add_p(text="Disusun Oleh:", size=11, color=COLOR_DARK, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    add_p(text="TIM PENGEMBANG NUTRIMAP BOGOR\nSemester 5 — Program Studi Teknik Informatika / Ilmu Komputer\nKonsentrasi Sistem Informasi Geografis (SIG)", size=11, color=COLOR_BODY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24)
    
    add_p(text="FAKULTAS ILMU KOMPUTER / SAINS & TEKNOLOGI\nTAHUN AKADEMIK 2024 / 2025", size=11, color=COLOR_PRIMARY, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_page_break()

    # ==========================================
    # DAFTAR ISI & RINGKASAN EKSEKUTIF
    # ==========================================
    add_h1("RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)")
    add_p(
        "NutriMap Bogor adalah platform Sistem Informasi Geografis berbasis web (WebGIS) modern yang dirancang untuk mengatasi "
        "fragmentasi data spasial ketahanan pangan, akses air bersih, dan prevalensi stunting di Kota Bogor. Selama ini, "
        "data terkait ketahanan pangan dikelola terpisah oleh Dinas Ketahanan Pangan dan Pertanian (DKP), data stunting dan fasilitas "
        "kesehatan oleh Dinas Kesehatan (Dinkes), serta data cakupan air bersih oleh Perumda Tirta Pakuan Kota Bogor. Ketiadaan integrasi "
        "spasial terpadu menyulitkan pengambil kebijakan (Bappeda dan Pemerintah Kota) dalam memetakan kelurahan prioritas intervensi secara presisi."
    )
    add_p(
        "Sistem ini mengintegrasikan batas administrasi 6 Kecamatan dan 68 Kelurahan di Kota Bogor (WGS 84 GeoJSON) dengan indikator "
        "multi-sektoral. Platform membagi aksesibilitas pengguna ke dalam tiga peran (Role-Based Access Control): Warga/Publik untuk "
        "keterbukaan informasi spasial, Staff Admin SIG untuk entri data berkala dan audit keamanan pangan pasar, serta Super Admin untuk "
        "manajemen akun dinas. Dokumen ini mendokumentasikan secara rinci arsitektur sistem, alur kerja (workflow) operasional, model "
        "transformasi data, dan panduan teknis implementasi."
    )

    add_callout(
        "Dokumen laporan ini disusun sebagai acuan teknis tim pengembang, bahan presentasi ujian tugas besar Sistem Informasi Geografis, "
        "dan panduan serah terima sistem kepada pemangku kepentingan.",
        "TUJUAN DOKUMEN"
    )

    # ==========================================
    # BAB I: PENDAHULUAN
    # ==========================================
    add_h1("BAB I: PENDAHULUAN")
    
    add_h2("1.1 Latar Belakang")
    add_p(
        "Ketahanan pangan dan status gizi masyarakat merupakan fondasi utama pembangunan sumber daya manusia yang berkualitas. "
        "Pemerintah Republik Indonesia melalui Peraturan Presiden Nomor 72 Tahun 2021 telah menetapkan percepatan penurunan stunting "
        "sebagai prioritas nasional dengan target prevalensi 14%. Di tingkat perkotaan seperti Kota Bogor yang memiliki populasi lebih dari "
        "1 juta jiwa, tantangan gizi dan kerawanan pangan sering kali berkelindan dengan permasalahan lingkungan, terutama aksesibilitas terhadap "
        "air minum dan sanitasi yang layak (SDG Goal 6)."
    )
    add_p(
        "Meskipun Kota Bogor memiliki kemajuan pesat dalam infrastruktur perkotaan, disparitas antar wilayah masih nyata. Terdapat "
        "wilayah kelurahan dengan kepadatan tinggi di pinggiran sungai (DAS Cisadane dan Ciliwung) yang menghadapi risiko ganda: sanitasi "
        "lingkungan rentan dan keterbatasan akses air perpipaan, yang berkorelasi langsung terhadap tingginya kejadian infeksi berulang pemicu stunting. "
        "Di sisi lain, potensi ketersediaan pangan di pasar-pasar induk Kota Bogor memerlukan pengawasan berkala terkait higienitas dan residu zat berbahaya."
    )
    add_p(
        "Pengelolaan data sektoral yang selama ini berjalan secara silo (terisolasi di masing-masing dinas) menghasilkan keputusan intervensi "
        "yang parsial. Oleh karena itu, dibutuhkan sebuah platform WebGIS terintegrasi—NutriMap Bogor—yang mampu memvisualisasikan data tematik "
        "secara geospasial, menyajikan skor Indeks Ketahanan Pangan (IKP), persentase cakupan air bersih PDAM, dan sebaran stunting balita secara real-time."
    )

    add_h2("1.2 Rumusan Masalah")
    add_p("Berdasarkan latar belakang tersebut, rumusan masalah dalam perancangan sistem ini adalah:")
    add_p("1. Bagaimana merancang arsitektur WebGIS yang mampu mengintegrasikan data spasial batas administrasi 68 kelurahan dengan data non-spasial multi-indikator secara efisien?", space_before=2, space_after=2)
    add_p("2. Bagaimana alur kerja (workflow) operasional yang tepat untuk memfasilitasi kebutuhan publik (keterbukaan data) dan kebutuhan instansi pemerintah (entri data dan audit berkala)?", space_before=2, space_after=2)
    add_p("3. Bagaimana menerapkan visualisasi tematik choropleth map yang informatif dan obyektif berdasarkan standar resmi klasifikasi nasional?", space_before=2, space_after=6)

    add_h2("1.3 Tujuan Pengembangan")
    add_p("Tujuan dari pengembangan sistem NutriMap Bogor adalah:")
    add_p("1. Mengembangkan platform WebGIS interaktif berbasis React dan Leaflet untuk visualisasi spasial 6 kecamatan dan 68 kelurahan di Kota Bogor.", space_before=2, space_after=2)
    add_p("2. Menyediakan sistem manajemen data geospasial bagi admin OPD untuk mengunggah dan memvalidasi data indikator baik secara manual maupun batch CSV.", space_before=2, space_after=2)
    add_p("3. Menyediakan modul pengawasan keamanan pangan pasar tradisional/modern lengkap dengan pencatatan uji laboratorium dan dokumentasi visual sidak lapangan.", space_before=2, space_after=2)
    add_p("4. Memberikan rekomendasi penetapan 'Kelurahan Prioritas Intervensi' berbasis scoring multivariat bagi Bappeda Kota Bogor.", space_before=2, space_after=6)

    add_h2("1.4 Manfaat Sistem")
    add_p(
        "• Bagi Pemerintah Kota Bogor (Bappeda & OPD): Mempermudah perumusan alokasi anggaran intervensi gizi terpadu, penyaluran bantuan pangan, "
        "dan ekspansi jaringan pipa air bersih PDAM secara tepat sasaran berbasis data spasial valid.\n"
        "• Bagi Tenaga Kesehatan & Fasilitator Posyandu: Memperoleh peta sebaran stunting dan lokasi fasilitas kesehatan rujukan terdekat.\n"
        "• Bagi Masyarakat Umum & Akademisi: Sarana edukasi publik mengenai profil ketahanan pangan kota, transparansi data kinerja pemerintah, serta materi riset geospasial perkotaan."
    )

    add_h2("1.5 Ruang Lingkup & Wilayah Studi")
    add_p(
        "Sistem ini mencakup seluruh wilayah administratif Kota Bogor, Provinsi Jawa Barat, yang terdiri dari 6 Kecamatan (Bogor Tengah, "
        "Bogor Selatan, Bogor Timur, Bogor Barat, Bogor Utara, Tanah Sareal) dan 68 Kelurahan. Data spasial menggunakan sistem koordinat "
        "referensi geografis WGS 84 (EPSG:4326)."
    )

    # ==========================================
    # BAB II: LANDASAN TEORI & STANDAR INDIKATOR
    # ==========================================
    add_h1("BAB II: LANDASAN TEORI & STANDAR INDIKATOR")
    
    add_h2("2.1 Sistem Informasi Geografis Berbasis Web (WebGIS)")
    add_p(
        "Sistem Informasi Geografis (SIG) adalah sistem berbasis komputer yang dirancang untuk menangkap, menyimpan, memanipulasi, menganalisis, "
        "mengelola, dan menyajikan semua jenis data geografis atau spasial. Dalam konteks WebGIS, kapabilitas SIG digabungkan dengan teknologi web modern, "
        "memungkinkan data geospasial diakses secara luas melalui web browser tanpa memerlukan instalasi perangkat lunak desktop GIS yang berat seperti QGIS atau ArcGIS."
    )

    add_h2("2.2 Pemetaan Tematik Choropleth")
    add_p(
        "Peta Choropleth adalah jenis peta tematik di mana area geografis administratif (seperti kelurahan atau kecamatan) diwarnai atau diarsir "
        "secara proporsional terhadap variabel statistik yang ditampilkan (misalnya persentase stunting atau skor ketahanan pangan). "
        "NutriMap Bogor mengadopsi palet warna bergradasi tegas dari Hijau Tua (status sangat baik/tahan), Kuning/Oranye (waspada/rentan), "
        "hingga Merah Pekat (rawan/prioritas tinggi) untuk mempermudah identifikasi kognitif pengguna."
    )

    add_h2("2.3 Standar & Klasifikasi Indikator Resmi")
    add_p(
        "Agar sistem memiliki integritas ilmiah dan dapat dipertanggungjawabkan di hadapan instansi pemerintah, penentuan status indikator "
        "tidak menggunakan nilai estimasi sembarangan, melainkan merujuk pada regulasi dan pedoman nasional berikut:"
    )

    # Table of Standards
    tbl_standards = doc.add_table(rows=1, cols=4)
    style_table(
        tbl_standards,
        col_widths=[1.5, 1.2, 1.8, 2.0],
        headers=["Parameter Indikator", "Satuan", "Kategori Klasifikasi", "Rujukan Standar Resmi"],
        rows_data=[
            [
                "Indeks Ketahanan Pangan (IKP)",
                "Skor (0 - 100)",
                "• Skor ≥ 80: Sangat Tahan\n• Skor 65 - 79: Tahan\n• Skor 50 - 64: Waspada\n• Skor < 50: Rentan/Rawan",
                "Badan Pangan Nasional (Bapanas) / FSVA (Food Security and Vulnerability Atlas)"
            ],
            [
                "Prevalensi Stunting Balita",
                "Persentase (%)",
                "• < 10%: Sangat Rendah\n• 10% - 19.9%: Sedang\n• 20% - 29.9%: Tinggi\n• ≥ 30%: Sangat Tinggi (Kritis)",
                "Standar Antropometri WHO & Target Penurunan Stunting Nasional (Perpres 72/2021)"
            ],
            [
                "Cakupan Akses Air Bersih",
                "Persentase (%)",
                "• ≥ 85%: Sangat Baik\n• 70% - 84%: Cukup\n• < 70%: Terbatas / Rentan",
                "Indikator SDG 6.1 & Standar Pelayanan Minimal PDAM Tirta Pakuan"
            ],
            [
                "Tingkat Kemiskinan Makro",
                "Persentase (%)",
                "• < 6%: Rendah\n• 6% - 10%: Sedang\n• > 10%: Tinggi",
                "Badan Pusat Statistik (BPS) Kota Bogor (Garis Kemiskinan Perkotaan)"
            ]
        ]
    )

    # ==========================================
    # BAB III: ANALISIS KEBUTUHAN & WORKFLOW SISTEM
    # ==========================================
    add_h1("BAB III: ANALISIS KEBUTUHAN & WORKFLOW ARSITEKTUR SISTEM")
    
    add_h2("3.1 Matriks Peran Pengguna (Role-Based Access Control)")
    add_p(
        "NutriMap Bogor mengimplementasikan pengamanan berbasis peran (RBAC) ketat untuk menjaga integritas data pemerintah. "
        "Terdapat 3 tingkatan peran dalam sistem:"
    )

    tbl_roles = doc.add_table(rows=1, cols=3)
    style_table(
        tbl_roles,
        col_widths=[1.5, 2.2, 2.8],
        headers=["Peran Pengguna", "Karakteristik & Pengguna", "Hak Akses & Fitur yang Diberikan"],
        rows_data=[
            [
                "Warga / Publik (Guest)",
                "Masyarakat umum, akademisi, jurnalis, mahasiswa.",
                "• Mode Publik (Top Navbar).\n• Menjelajahi peta tematik interaktif (Choropleth).\n• Melihat detail metrik 6 kecamatan & 68 kelurahan.\n• Membaca metodologi & direktori sumber data resmi.\n• Tidak dapat mengubah data apapun."
            ],
            [
                "Staff Admin SIG (Admin)",
                "Petugas teknis OPD (Dinas Ketahanan Pangan, Dinkes, PDAM).",
                "• Mode Internal Portal (Collapsible Sidebar + Header).\n• Akses Ringkasan Dashboard KPI & Matriks Prioritas.\n• Form Entri Data Manual & Validasi Nilai.\n• Fitur Batch Import data indikator via file CSV.\n• Modul Audit Keamanan Pangan Pasar & Upload Bukti Foto.\n• CMS Editor Konten Landing Page."
            ],
            [
                "Super Administrator",
                "Pengelola Sistem Pusat (Bappeda / Diskominfo Kota Bogor).",
                "• Seluruh hak akses Staff Admin SIG.\n• Manajemen Akun Admin OPD (Tambah, Edit, Hapus, Reset Password).\n• Manajemen Otoritas Wilayah & Log Audit Sistem."
            ]
        ]
    )

    add_h2("3.2 Arsitektur Alur Data (Data Pipeline Flow)")
    add_p(
        "Alur pergerakan data dalam NutriMap Bogor dibagi menjadi 4 tahapan berkesinambungan:\n"
        "1. Tahap Ingesti (Data Acquisition): Pengumpulan data sekunder dari instansi vertikal Pemkot Bogor (BPS, DKP, Dinkes, PDAM).\n"
        "2. Tahap Validasi & Pemrosesan (Processing & Rule Validation): Pengecekan konsistensi data melalui modul indicatorStandards.js. "
        "Sistem secara otomatis menghitung agregasi nilai skor IKP dan penentuan kuadran kelayakan.\n"
        "3. Tahap Manajemen Penyimpanan (State Management): Data disimpan dalam struktur GeoJSON reaktif yang mengikat koordinat poligon batas wilayah dengan atribut indikator dinamis.\n"
        "4. Tahap Visualisasi Spasial (Spatial Rendering): Engine Leaflet me-render layer interaktif pada kanvas web dengan kemampuan filter multi-layer, tooltip hover, dan modal informasi detail kelurahan."
    )

    add_h2("3.3 Rincian 5 Workflow Operasional Utama")
    
    add_h3("Workflow 1: Eksplorasi Spasial & Informasi Publik (Warga)")
    add_p(
        "1. Pengguna membuka URL aplikasi publik (https://projek-web-gis.vercel.app/).\n"
        "2. Landing Page menampilkan Hero Carousel dengan foto autentik Kota Bogor dan Geographic Data Highlights (6 Kecamatan, 68 Kelurahan).\n"
        "3. Pengguna memilih menu 'Peta Spasial' untuk membuka kanvas peta Leaflet penuh.\n"
        "4. Pengguna mengaktifkan layer tematik (Ketahanan Pangan, Air Bersih, atau Stunting).\n"
        "5. Pengguna mengarahkan kursor (hover) atau mengklik salah satu poligon kelurahan.\n"
        "6. Sistem menampilkan pop-up interaktif berisi: Nama Kelurahan, Kecamatan, Jumlah Penduduk, Skor IKP, Status Air Bersih, Prevalensi Stunting, dan Rekomendasi Program Intervensi.\n"
        "7. Pengguna dapat membuka tab 'Data Indikator Kota' untuk menelusuri data dalam bentuk tabel matriks lengkap."
    )

    add_h3("Workflow 2: Entri Data & Validasi Indikator Spasial (Staff Admin)")
    add_p(
        "1. Staff Admin menekan tombol 'Login Admin / SuperAdmin' pada navbar dan memasukkan kredensial resmi.\n"
        "2. Setelah terotentikasi, tampilan berpindah dari Public Navbar ke Admin Portal Sidebar.\n"
        "3. Admin memilih menu 'Entri Data Indikator'.\n"
        "4. Skenario Input Manual: Admin memilih target Kelurahan, memasukkan angka prevalensi stunting baru, persentase air bersih, dan persentase kemiskinan. Sistem secara real-time memvalidasi batas nilai logika (0 - 100%) dan menghitung kategori status secara otomatis.\n"
        "5. Skenario Import CSV: Admin mengunggah berkas CSV rekapitulasi dinas. Sistem melakukan parsing struktur kolom (Kecamatan, Kelurahan, IKP, Stunting, Air), menampilkan preview baris data, dan melakukan update batch ke database/state spasial.\n"
        "6. Perubahan data langsung terfleksikan secara instan pada warna poligon peta Leaflet."
    )

    add_h3("Workflow 3: Pengawasan Keamanan Pangan Pasar & Food Safety Audit")
    add_p(
        "1. Petugas Dinas Ketahanan Pangan melakukan inspeksi rutin di pasar rakyat (Pasar Anyar, Pasar Bogor, Pasar Jambu Dua, dll).\n"
        "2. Petugas membuka menu 'Pengawasan Keamanan Pangan' di panel admin.\n"
        "3. Petugas menginput formulir sidak: Lokasi Pasar, Tanggal Uji Laboratorium, Komoditas yang Diuji (daging, ikan, sayuran, tahu), Hasil Tes Cepat Zat Berbahaya (Formalin, Boraks, Pewarna Tekstil Rhodamin B).\n"
        "4. Petugas mengunggah foto dokumentasi kegiatan sidak lapangan (sistem mengompresi gambar otomatis via ImageCompressor untuk efisiensi penyimpanan).\n"
        "5. Status kepatuhan pasar (Zona Hijau: Aman Pangan, Zona Merah: Ditemukan Pelanggaran) otomatis diperbarui pada layer peta pasar."
    )

    add_h3("Workflow 4: Manajemen Konten Edukasi Publik (CMS Editor)")
    add_p(
        "1. Admin Hubungan Masyarakat / Sekretariat membuka menu 'Editor Konten Publik'.\n"
        "2. Admin dapat memperbarui judul banner, deskripsi kampanye gizi, pengumuman darurat pangan, atau mengganti tautan gambar tanpa perlu menyentuh source code aplikasi.\n"
        "3. Sistem memvalidasi input teks dan menyimpan perubahan ke persistent storage.\n"
        "4. Saat warga mengakses halaman beranda, perubahan informasi langsung tampil secara live."
    )

    add_h3("Workflow 5: Tata Kelola Akun & Hak Akses (Super Admin)")
    add_p(
        "1. Super Administrator masuk menggunakan akun bertingkat tertinggi (superadmin@bogorkota.go.id).\n"
        "2. Sistem membuka panel khusus 'Super Admin Management'.\n"
        "3. Super Admin mengelola daftar akun petugas dari berbagai OPD (menambah akun staf baru dari Dinkes, mengedit hak akses wilayah kecamatan, me-reset password, atau menonaktifkan akun staf yang telah mutasi kerja).\n"
        "4. Memastikan tidak ada akses ilegal yang dapat memanipulasi data indikator kota."
    )

    # ==========================================
    # BAB IV: IMPLEMENTASI TEKNIS & HASIL
    # ==========================================
    add_h1("BAB IV: IMPLEMENTASI TEKNIS & HASIL SISTEM")
    
    add_h2("4.1 Spesifikasi Arsitektur Teknologi (Tech Stack)")
    add_p(
        "Dalam mengimplementasikan NutriMap Bogor, tim memilih tumpukan teknologi modern yang mengedepankan performa, modularitas, dan keandalan:"
    )

    tbl_tech = doc.add_table(rows=1, cols=3)
    style_table(
        tbl_tech,
        col_widths=[1.5, 2.0, 3.0],
        headers=["Komponen Sistem", "Teknologi / Library", "Peran & Fungsi dalam Sistem"],
        rows_data=[
            [
                "Frontend Framework",
                "React 18 & Vite",
                "Single Page Application (SPA) reaktif dengan waktu build sangat cepat (1.49 detik), component-driven architecture."
            ],
            [
                "GIS Mapping Engine",
                "Leaflet.js & React-Leaflet",
                "Rendering peta interaktif, vector polygon layer GeoJSON, binding tooltip kustom, dan kontrol zoom/pan."
            ],
            [
                "Tiles Basemap",
                "OpenStreetMap / CartoDB Voyager",
                "Penyedia peta dasar jalan, topografi, dan kontur wilayah Kota Bogor berlisensi terbuka."
            ],
            [
                "Styling & UI Kit",
                "Custom CSS3 & Modern Design System",
                "Palet warna instansional (#147A55, #073F32, #20B879), layout grid responsif, CSS animations smooth fade transition."
            ],
            [
                "Data Management",
                "GeoJSON Module & Local State Engine",
                "Menghubungkan data atribut multivariat dengan geometri poligon 68 kelurahan secara sinkron."
            ],
            [
                "Image Optimizer",
                "Browser Image Compression",
                "Kompresi file gambar dokumentasi sidak pasar secara client-side sebelum disimpan ke storage."
            ]
        ]
    )

    add_h2("4.2 Struktur Data Geospasial")
    add_p(
        "Sistem menyimpan dan memproses data spasial melalui tiga modul data terstruktur di direktori src/data/:\n"
        "1. bogorKelurahanGeoJSON.js: Berisi koleksi FeatureCollection GeoJSON poligon 68 kelurahan dengan properti standar (KECAMATAN, KELURAHAN, KODE_KEMENDAGRI).\n"
        "2. bogorData.js: Berisi data ringkasan 6 Kecamatan (jumlah penduduk, nama camat, skor IKP rata-rata, persentase stunting, jumlah faskes posyandu/puskesmas).\n"
        "3. bogorKelurahanData.js: Berisi matriks detail mikro per kelurahan yang menampung skor indikator lengkap, status prioritas intervensi (Prioritas 1 s/d Prioritas 5), dan riwayat intervensi dinas."
    )

    add_h2("4.3 Dokumentasi Antarmuka Sistem")
    add_p(
        "Berikut adalah implementasi antarmuka utama yang telah berhasil dibangun pada sistem NutriMap Bogor:"
    )

    # Check and insert preview image if available
    img_map_preview = "C:/Users/ROG/.gemini/antigravity/brain/29d926bc-f785-41e9-b073-f2e46da11c84/preview-map-preview.png"
    if os.path.exists(img_map_preview):
        add_p("Gambar 4.1: Tampilan Preview Peta Spasial Interaktif Kota Bogor", size=10, color=COLOR_DARK, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
        doc.add_picture(img_map_preview, width=Inches(6.2))
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_p("Peta tematik Leaflet menampilkan batas administrasi kecamatan dan kelurahan dengan kontrol layer interaktif.", size=9, color=COLOR_MUTED, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)

    img_geo_highlights = "C:/Users/ROG/.gemini/antigravity/brain/29d926bc-f785-41e9-b073-f2e46da11c84/preview-geo-highlights.png"
    if os.path.exists(img_geo_highlights):
        add_p("Gambar 4.2: Tampilan Geographic Data Highlights & Indikator Resmi", size=10, color=COLOR_DARK, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
        doc.add_picture(img_geo_highlights, width=Inches(6.2))
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_p("Ringkasan metrik statistik resmi Kota Bogor (6 Kecamatan, 68 Kelurahan, 6 Parameter Spasial).", size=9, color=COLOR_MUTED, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)

    img_data_insight = "C:/Users/ROG/.gemini/antigravity/brain/29d926bc-f785-41e9-b073-f2e46da11c84/preview-data-insight.png"
    if os.path.exists(img_data_insight):
        add_p("Gambar 4.3: Visualisasi Data Insight & Analisis Perbandingan", size=10, color=COLOR_DARK, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
        doc.add_picture(img_data_insight, width=Inches(6.2))
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_p("Grafik perbandingan capaian IKP, akses air bersih, dan angka stunting antar 6 kecamatan.", size=9, color=COLOR_MUTED, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)

    # ==========================================
    # BAB V: KESIMPULAN & SARAN
    # ==========================================
    add_h1("BAB V: KESIMPULAN & SARAN PENGEMBANGAN")
    
    add_h2("5.1 Kesimpulan")
    add_p(
        "Berdasarkan tahapan perancangan, pengembangan, dan pengujian yang telah dilakukan, dapat disimpulkan bahwa:\n"
        "1. Sistem Informasi Geografis 'NutriMap Bogor' berhasil dikembangkan sebagai platform WebGIS interaktif yang mampu mengintegrasikan "
        "tiga pilar krusial perkotaan (Ketahanan Pangan, Akses Air Bersih, dan Gizi Sehat/Stunting) dalam satu kesatuan data spasial terpadu.\n"
        "2. Sistem pemisahan hak akses (Role-Based Access Control) berhasil memfasilitasi kebutuhan dua segmen pengguna: publik yang membutuhkan "
        "keterbukaan informasi wilayah secara cepat dan intuitif, serta staf teknis OPD yang memerlukan platform terpusat untuk entri data, "
        "validasi batch CSV, serta audit keamanan pangan pasar.\n"
        "3. Penerapan standar klasifikasi resmi nasional (Bapanas, Kemenkes, WHO, dan SDG 6) memberikan legitimasi ilmiah bagi pengambil kebijakan "
        "di Bappeda Kota Bogor dalam menetapkan prioritas intervensi anggaran dan bantuan sosial secara tepat sasaran."
    )

    add_h2("5.2 Saran & Rencana Pengembangan Lanjutan")
    add_p(
        "Untuk penyempurnaan sistem pada tahap implementasi skala penuh oleh Pemerintah Kota Bogor, disarankan hal-hal berikut:\n"
        "1. Integrasi API Realtime Sensor IoT PDAM: Mengembangkan konektor API langsung ke sistem telemetri PDAM Tirta Pakuan guna mendeteksi gangguan pasokan air perpipaan secara live pada peta.\n"
        "2. Aplikasi Mobile Pelaporan Warga: Membangun Progressive Web App (PWA) agar kader Posyandu dapat menginput penimbangan balita dan pelaporan pangan kadaluarsa langsung dari smartphone di lapangan.\n"
        "3. Machine Learning Spatial Clustering: Menerapkan algoritma machine learning (seperti K-Means atau Spatial Autocorrelation Moran's I) "
        "untuk memprediksi kelurahan yang berisiko mengalami lonjakan stunting di masa depan berdasarkan tren sanitasi dan daya beli pangan."
    )

    # ==========================================
    # DAFTAR PUSTAKA
    # ==========================================
    add_h1("DAFTAR PUSTAKA")
    add_p("1. Badan Pangan Nasional. (2023). Peta Ketahanan dan Kerentanan Pangan (Food Security and Vulnerability Atlas - FSVA) Nasional 2023. Jakarta: Badan Pangan Nasional Republik Indonesia.", space_after=3)
    add_p("2. Badan Pusat Statistik Kota Bogor. (2024). Kota Bogor Dalam Angka 2024. BPS Kota Bogor: BPS-Statistics of Bogor Municipality.", space_after=3)
    add_p("3. Dinas Kesehatan Kota Bogor. (2023). Profil Kesehatan Kota Bogor Tahun 2023. Bogor: Dinas Kesehatan Pemerintah Kota Bogor.", space_after=3)
    add_p("4. Kementerian Kesehatan Republik Indonesia. (2021). Buku Saku Hasil Studi Status Gizi Indonesia (SSGI) Tingkat Nasional, Provinsi, dan Kabupaten/Kota. Jakarta: Kemenkes RI.", space_after=3)
    add_p("5. Peraturan Presiden Republik Indonesia Nomor 72 Tahun 2021 tentang Percepatan Penurunan Stunting. Lembaran Negara Republik Indonesia Tahun 2021 Nomor 172.", space_after=3)
    add_p("6. Undang-Undang Republik Indonesia Nomor 18 Tahun 2012 tentang Pangan. Lembaran Negara Republik Indonesia Tahun 2012 Nomor 227.", space_after=3)
    add_p("7. World Health Organization (WHO). (2020). Improving Early Childhood Development: WHO Guideline. Geneva: World Health Organization.", space_after=3)

    # Save Document
    output_filename = "Laporan_Workflow_Sistem_NutriMap_Bogor.docx"
    doc.save(output_filename)
    print(f"Report successfully generated and saved to: {output_filename}")

if __name__ == "__main__":
    create_nutrimap_report()

