================================================================================
REPOSITORI SUMBER DATA - PROYEK WEBGIS NUTRIMAP KOTA BOGOR
Mata Kuliah : Sistem Informasi Geografis (SIG) - Kelas A2 / Kelompok 12
Topik       : WebGIS Ketahanan Pangan, Akses Air Bersih, dan Penanganan Stunting
================================================================================

Folder ini berisi seluruh dataset spasial dan tabular yang digunakan dalam
pengembangan WebGIS NutriMap Kota Bogor serta penyusunan proposal proyek:

STRUKTUR DIREKTORI:
-------------------
1. [01_Bahan_Mentah_Satu_Peta]
   Berisi Shapefile (SHP) resmi Peta Rupa Bumi Indonesia (RBI) skala 1:25.000 
   Kota Bogor yang diunduh dari:
   - Geoportal Satu Peta Kota Bogor: https://satupeta.kotabogor.go.id/maps
   - Ina-Geoportal Badan Informasi Geografis (BIG): https://tanahair.indonesia.go.id
   Layer penting:
   * ADMINISTRASIDESA_AR_25K.* : Poligon batas administrasi desa/kelurahan
   * ADMINISTRASI_LN_25K.*     : Garis batas administrasi
   * KESEHATAN_PT_25K.*        : Titik fasilitas kesehatan / Puskesmas
   * RUMAHSAKIT_PT_25K.*       : Titik rumah sakit
   * NIAGA_PT_25K.*            : Titik pasar tradisional & sentra niaga pangan
   * JALAN_LN_25K.*            : Jaringan jalan Kota Bogor
   * SUNGAI_AR_25K.*           : Poligon hidrografi sungai / perairan
   * PEMUKIMAN_AR_25K.*        : Poligon area pemukiman warga

2. [02_Data_Spasial_NutriMap_Olahan]
   Berisi hasil ekstraksi khusus 68 Kelurahan di 6 Kecamatan Kota Bogor yang telah 
   di-join dengan indikator sosial-kesehatan NutriMap:
   * KOTA_BOGOR_KELURAHAN_NUTRIMAP.shp (dan berkas pendukung .dbf, .shx, .prj)
   * KOTA_BOGOR_KELURAHAN_NUTRIMAP.geojson (format standar untuk Leaflet WebGIS)
   Sistem Koordinat: WGS 84 (EPSG:4326)

3. [03_Data_Tabular_Atribut]
   Berisi tabel indikator sosial dan kesehatan per kelurahan:
   * data_indikator_nutrimap_bogor_2026.csv
   Kolom data:
   - ID Kelurahan
   - KELURAHAN & KECAMATAN
   - PREVALENSI_STUNTING_PERSEN (Dinas Kesehatan Kota Bogor)
   - TINGKAT_KEMISKINAN_PERSEN (Dinas Sosial / DTKS)
   - SKOR_KERENTANAN_PANGAN (Dinas Ketahanan Pangan Kota Bogor)
   - AKSES_AIR_BERSIH_PDAM_PERSEN (Perumda Tirta Pakuan Kota Bogor)
   - PRIORITAS_INTERVENSI (Prioritas 1: Tinggi, Prioritas 2: Sedang, Prioritas 3: Rendah)

4. [04_QGIS_Project]
   * NutriMap_Kota_Bogor.qgz : File proyek QGIS yang sudah di-styling (Choropleth 
     gradasi warna stunting, label kelurahan dengan buffer, titik faskes, pasar, dll).
     Dapat langsung dibuka dengan klik dua kali menggunakan QGIS 3.x.
   * screenshot_qgis_nutrimap.png : Screenshot antarmuka QGIS untuk proposal.
   * map_canvas.png : Hasil render peta resolusi tinggi.

================================================================================
Kontak / Pengembang:
Kelompok 12 - Kelas A2
Sekolah Vokasi IPB University
================================================================================
