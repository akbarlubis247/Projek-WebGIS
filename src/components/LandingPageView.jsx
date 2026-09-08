import React, { useState } from 'react';
import {
  MapPin,
  Utensils,
  Droplets,
  HeartPulse,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Users,
  ChevronRight,
  Mail,
  Phone,
  BarChart3,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import MapView from './MapView';
import {
  KOTA_BOGOR_STATS,
  KECAMATAN_KOTA_BOGOR,
  FOOD_SECURITY_CATEGORIES
} from '../data/bogorData';

export default function LandingPageView({ onOpenLogin }) {
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_KOTA_BOGOR[0]);
  const [searchTable, setSearchTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [activeChartMetric, setActiveChartMetric] = useState('panganSkor');

  // Filtered Table Data for Data Indikator Section
  const filteredData = KECAMATAN_KOTA_BOGOR.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTable.toLowerCase()) ||
      item.pusat.toLowerCase().includes(searchTable.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.panganStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleScrollToMap = (targetKec = null) => {
    if (targetKec) {
      setSelectedKec(targetKec);
    }
    const el = document.getElementById('peta-spasial');
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nama Kecamatan,Pusat,Penduduk,Status Pangan,Skor IKP,Air Bersih (%),Stunting (%),Kemiskinan,Faskes\n";
    filteredData.forEach(row => {
      csvContent += `${row.id},"${row.nama}","${row.pusat}",${row.penduduk},"${row.panganStatus}",${row.panganSkor},${row.airBersih},${row.stunting},"${row.tingkatKemiskinan}",${row.faskes}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NutriMap_Kota_Bogor_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="landing-single-page">
      {/* SECTION 1: PAGE HEADER & KPI SUMMARY */}
      <section id="beranda" className="landing-beranda-section">
        {/* Government Official Page Header */}
        <div className="gov-page-header">
          <div className="gov-header-eyebrow">
            <span>PEMERINTAH KOTA BOGOR</span>
            <span className="dot-sep">•</span>
            <span>SISTEM INFORMASI GEOGRAFIS</span>
          </div>

          <h1 className="gov-header-title">
            NutriMap Kota Bogor
          </h1>
          <p className="gov-header-subtitle">
            Pemantauan Ketahanan Pangan Berbasis Spasial
          </p>

          <p className="gov-header-desc">
            Visualisasi kondisi ketahanan pangan, akses air bersih, dan prevalensi stunting pada 6 kecamatan di Kota Bogor.
          </p>

          <div className="gov-header-meta">
            <div className="meta-updated">
              <Calendar size={14} className="meta-icon" />
              <span>Data terakhir diperbarui: <b>{KOTA_BOGOR_STATS.terakhirDiperbarui}</b></span>
            </div>
            <button className="primary-btn-sm header-action-btn" onClick={() => handleScrollToMap()}>
              <MapPin size={15} /> Jelajahi Peta Spasial
            </button>
          </div>
        </div>

        {/* Compact KPI / Indicator Summary (3 Primary Indicators) */}
        <div className="kpi-summary-grid">
          {/* IKP Metric */}
          <div className="kpi-card kpi-pangan">
            <div className="kpi-head">
              <div className="kpi-label-wrap">
                <Utensils size={15} className="text-primary-green" />
                <span className="kpi-label">Indeks Ketahanan Pangan (IKP)</span>
              </div>
              <span className="kpi-status-badge status-sangat-aman">Sangat Baik</span>
            </div>
            <div className="kpi-number-wrap">
              <span className="kpi-val">{KOTA_BOGOR_STATS.skorIKP}</span>
              <span className="kpi-unit">/ 100</span>
            </div>
            <div className="kpi-progress">
              <div className="kpi-progress-fill bg-green" style={{ width: `${KOTA_BOGOR_STATS.skorIKP}%` }} />
            </div>
            <div className="kpi-foot">
              <span className="kpi-trend positive">
                <ArrowUpRight size={13} /> +1.8% dari periode sebelumnya
              </span>
              <span className="kpi-target">Target Pemkot: &ge;85.0</span>
            </div>
          </div>

          {/* Air Bersih Metric */}
          <div className="kpi-card kpi-air">
            <div className="kpi-head">
              <div className="kpi-label-wrap">
                <Droplets size={15} className="text-water-cyan" />
                <span className="kpi-label">Akses Air Bersih Layak</span>
              </div>
              <span className="kpi-status-badge status-aman">Stabil</span>
            </div>
            <div className="kpi-number-wrap">
              <span className="kpi-val">{KOTA_BOGOR_STATS.aksesAirBersih}</span>
            </div>
            <div className="kpi-progress">
              <div className="kpi-progress-fill bg-cyan" style={{ width: '89.6%' }} />
            </div>
            <div className="kpi-foot">
              <span className="kpi-trend positive">
                <ArrowUpRight size={13} /> +1.8% dari periode sebelumnya
              </span>
              <span className="kpi-target">PDAM Tirta Pakuan</span>
            </div>
          </div>

          {/* Stunting Metric */}
          <div className="kpi-card kpi-stunting">
            <div className="kpi-head">
              <div className="kpi-label-wrap">
                <HeartPulse size={15} className="text-danger" />
                <span className="kpi-label">Prevalensi Stunting Balita</span>
              </div>
              <span className="kpi-status-badge status-waspada">Intervensi</span>
            </div>
            <div className="kpi-number-wrap">
              <span className="kpi-val">{KOTA_BOGOR_STATS.prevalensiStunting}</span>
            </div>
            <div className="kpi-progress">
              <div className="kpi-progress-fill bg-danger" style={{ width: '15.4%' }} />
            </div>
            <div className="kpi-foot">
              <span className="kpi-trend positive">
                <ArrowDownRight size={13} /> -2.1% dari periode sebelumnya
              </span>
              <span className="kpi-target">Target 2026: &lt;14.0%</span>
            </div>
          </div>
        </div>

        {/* Overview 6 Kecamatan (Clean Structured Data List/Table) */}
        <div className="gov-card overview-kecamatan-card">
          <div className="gov-card-header">
            <div>
              <h2 className="gov-card-title">Overview 6 Kecamatan Kota Bogor</h2>
              <p className="gov-card-desc">
                Ringkasan komparasi indikator ketahanan pangan, air, dan stunting lintas kecamatan. Klik baris atau "Fokus Peta" untuk analisis spasial.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Kecamatan</th>
                  <th style={{ width: '16%' }}>Status Ketahanan</th>
                  <th style={{ width: '14%' }}>Skor IKP</th>
                  <th style={{ width: '16%' }}>Akses Air Bersih</th>
                  <th style={{ width: '16%' }}>Prevalensi Stunting</th>
                  <th style={{ width: '16%', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {KECAMATAN_KOTA_BOGOR.map((kec) => {
                  const isSelected = selectedKec.id === kec.id;
                  const statusClass = kec.panganStatus.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr
                      key={kec.id}
                      className={`kec-data-row ${isSelected ? 'row-selected' : ''}`}
                      onClick={() => setSelectedKec(kec)}
                    >
                      <td>
                        <div className="kec-name-cell">
                          <span className="kec-title">Kec. {kec.nama}</span>
                          <span className="kec-pusat-sub">{kec.pusat}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${statusClass}`}>
                          {kec.panganStatus}
                        </span>
                      </td>
                      <td>
                        <div className="val-with-bar">
                          <span className="val-text font-mono"><b>{kec.panganSkor}</b> <small>/ 100</small></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-green" style={{ width: `${kec.panganSkor}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="val-with-bar">
                          <span className="val-text font-mono"><b>{kec.airBersih}%</b></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-cyan" style={{ width: `${kec.airBersih}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`stunting-val font-mono ${kec.stunting > 15 ? 'val-danger' : 'val-normal'}`}>
                          <b>{kec.stunting}%</b>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn-focus-map ${isSelected ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrollToMap(kec);
                          }}
                        >
                          <MapPin size={13} />
                          <span>Fokus Peta</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: HALAMAN PETA SPASIAL (MAP-FIRST LAYOUT) */}
      <section id="peta-spasial" className="single-page-section">
        <div className="section-head-clean">
          <div className="section-tag-wrap">
            <span className="gov-sec-tag">VISUALISASI GEOGRAFIS</span>
          </div>
          <h2>Peta Spasial Ketahanan Pangan</h2>
          <p>
            Analisis kondisi ketahanan pangan, akses air bersih, stunting, dan fasilitas pendukung di Kota Bogor.
          </p>
        </div>

        {/* 70% Map : 30% Analysis Sidebar Grid */}
        <div className="spatial-workspace-grid">
          {/* Main Map Canvas (70-75% Area) */}
          <div className="gov-card map-main-panel">
            <MapView
              selectedKecamatan={selectedKec}
              onSelectKecamatan={(kec) => setSelectedKec(kec)}
              height="580px"
            />
          </div>

          {/* Analysis Sidebar (25-30% Area) */}
          <div className="gov-card analysis-side-panel">
            <div className="analysis-header">
              <div className="ah-meta">
                <span className="ah-id-code font-mono">{selectedKec.id}</span>
                <span className={`status-badge status-${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedKec.panganStatus}
                </span>
              </div>
              <h3 className="ah-title">Kecamatan {selectedKec.nama}</h3>
              <p className="ah-sub">Pusat Wilayah: {selectedKec.pusat}</p>
            </div>

            <div className="analysis-divider" />

            <p className="analysis-description">
              {selectedKec.deskripsi}
            </p>

            <div className="analysis-divider" />

            {/* Core Spatial Indicators */}
            <div className="indicator-group-list">
              <span className="group-title">INDIKATOR UTAMA</span>

              <div className="indicator-row">
                <div className="ir-label">
                  <Utensils size={14} className="text-primary-green" />
                  <span>Indeks Ketahanan Pangan (IKP)</span>
                </div>
                <span className="ir-val font-mono"><b>{selectedKec.panganSkor}</b> / 100</span>
                <div className="ir-progress-track">
                  <div className="ir-progress-fill bg-green" style={{ width: `${selectedKec.panganSkor}%` }} />
                </div>
              </div>

              <div className="indicator-row">
                <div className="ir-label">
                  <Droplets size={14} className="text-water-cyan" />
                  <span>Akses Air Bersih Layak</span>
                </div>
                <span className="ir-val font-mono"><b>{selectedKec.airBersih}%</b></span>
                <div className="ir-progress-track">
                  <div className="ir-progress-fill bg-cyan" style={{ width: `${selectedKec.airBersih}%` }} />
                </div>
              </div>

              <div className="indicator-row">
                <div className="ir-label">
                  <HeartPulse size={14} className="text-danger" />
                  <span>Prevalensi Stunting</span>
                </div>
                <span className={`ir-val font-mono ${selectedKec.stunting > 15 ? 'text-danger fw-bold' : ''}`}>
                  <b>{selectedKec.stunting}%</b>
                </span>
                <div className="ir-progress-track">
                  <div
                    className="ir-progress-fill bg-danger"
                    style={{ width: `${Math.min((selectedKec.stunting / 25) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="analysis-divider" />

            {/* Demographic & Infrastructure Metadata */}
            <div className="meta-stats-section">
              <span className="group-title">PROFIL & FASILITAS</span>

              <div className="meta-data-row">
                <span className="md-label">Jumlah Penduduk</span>
                <span className="md-value font-mono">{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Fasilitas Kesehatan & Pasar</span>
                <span className="md-value font-mono">{selectedKec.faskes} Faskes • {selectedKec.pasarTradisional} Pasar</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Tingkat Kemiskinan</span>
                <span className="md-value font-mono">{selectedKec.tingkatKemiskinan}</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Sumber Air Dominan</span>
                <span className="md-value font-bold">{selectedKec.sumberAirDominan}</span>
              </div>
            </div>

            <div className="analysis-footer">
              <span className="af-coord font-mono">Lat: {selectedKec.lat}, Lng: {selectedKec.lng}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DATA INDIKATOR KOTA & VISUAL CHART */}
      <section id="data-indikator" className="single-page-section">
        <div className="section-head-clean">
          <div className="section-tag-wrap">
            <span className="gov-sec-tag">DATA & STATISTIK</span>
          </div>
          <h2>Data Indikator Kota Bogor</h2>
          <p>Tabel interaktif kependudukan dan indikator ketahanan pangan Kota Bogor.</p>
        </div>

        {/* Data Filter & Search Toolbar */}
        <div className="gov-card toolbar-card">
          <div className="filter-controls-row">
            {/* Search Input */}
            <div className="search-input-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Cari kecamatan atau pusat administrasi..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div className="filter-select-box">
              <Filter size={14} className="filter-icon" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>Semua Status</option>
                {FOOD_SECURITY_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button className="btn-export-green" onClick={handleExportCSV}>
              <FileSpreadsheet size={15} /> Unduh CSV
            </button>
          </div>
        </div>

        {/* Chart Card */}
        <div className="gov-card chart-section-card">
          <div className="chart-header-row">
            <div>
              <h3 className="chart-title">
                {activeChartMetric === 'panganSkor' && 'Peringkat Indeks Ketahanan Pangan (IKP) per Kecamatan'}
                {activeChartMetric === 'airBersih' && 'Peringkat Akses Air Bersih Layak (%) per Kecamatan'}
                {activeChartMetric === 'stunting' && 'Peringkat Prevalensi Stunting Balita (%) per Kecamatan'}
              </h3>
              <p className="chart-subtitle">Kota Bogor — Data Monitoring Spasial 2026</p>
            </div>

            <div className="chart-tab-group">
              <button
                className={`chart-tab ${activeChartMetric === 'panganSkor' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('panganSkor')}
              >
                <Utensils size={14} /> Skor IKP
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'airBersih' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('airBersih')}
              >
                <Droplets size={14} /> Air Bersih
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'stunting' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('stunting')}
              >
                <HeartPulse size={14} /> Stunting
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={KECAMATAN_KOTA_BOGOR} margin={{ top: 15, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE5E0" vertical={false} />
                <XAxis dataKey="nama" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172033',
                    borderColor: '#334155',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.82rem'
                  }}
                />
                <Bar dataKey={activeChartMetric} radius={[4, 4, 0, 0]}>
                  {KECAMATAN_KOTA_BOGOR.map((entry, index) => {
                    let fillColor = '#16A34A';
                    if (activeChartMetric === 'airBersih') {
                      fillColor = '#06B6D4';
                    } else if (activeChartMetric === 'stunting') {
                      fillColor = entry.stunting > 15 ? '#DC2626' : '#F59E0B';
                    }
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Indicators Data Table */}
        <div className="gov-card">
          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>Kode ID</th>
                  <th>Kecamatan & Pusat</th>
                  <th>Jumlah Penduduk</th>
                  <th>Status Pangan</th>
                  <th>Skor IKP</th>
                  <th>Akses Air</th>
                  <th>Stunting</th>
                  <th>Faskes & Pasar</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const statusClass = row.panganStatus.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr key={row.id}>
                      <td className="font-mono text-muted">{row.id}</td>
                      <td>
                        <div className="kec-name-cell">
                          <span className="kec-title">Kec. {row.nama}</span>
                          <span className="kec-pusat-sub">{row.pusat}</span>
                        </div>
                      </td>
                      <td className="font-mono">
                        {row.penduduk.toLocaleString('id-ID')} jiwa
                      </td>
                      <td>
                        <span className={`status-badge status-${statusClass}`}>
                          {row.panganStatus}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono"><b>{row.panganSkor}</b> / 100</span>
                      </td>
                      <td>
                        <span className="font-mono text-water-cyan"><b>{row.airBersih}%</b></span>
                      </td>
                      <td>
                        <span className={`font-mono ${row.stunting > 15 ? 'val-danger' : 'val-normal'}`}>
                          <b>{row.stunting}%</b>
                        </span>
                      </td>
                      <td>
                        <span>{row.faskes} Faskes • {row.pasarTradisional} Pasar</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-focus-map"
                          onClick={() => handleScrollToMap(row)}
                        >
                          <MapPin size={13} />
                          <span>Fokus Peta</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: TENTANG NUTRIMAP & MITRA */}
      <section id="tentang-nutrimap" className="single-page-section">
        <div className="section-head-clean">
          <div className="section-tag-wrap">
            <span className="gov-sec-tag">INFORMASI PLATFORM</span>
          </div>
          <h2>Tentang NutriMap Kota Bogor</h2>
          <p>Portal Sistem Informasi Geografis Pemantauan Ketahanan Pangan & Kesejahteraan Terpadu</p>
        </div>

        <div className="about-split-grid">
          <div className="gov-card about-info-panel">
            <div className="about-brand-header">
              <div className="about-logo-box">
                <Layers size={24} className="text-primary-green" />
              </div>
              <div>
                <h3>NutriMap Kota Bogor v2.4</h3>
                <p>Platform SIG Spasial Resmi Pemerintah Kota Bogor, Jawa Barat</p>
              </div>
            </div>

            <p className="about-paragraph">
              <b>NutriMap Kota Bogor</b> dikembangkan sebagai sarana pengambilan keputusan berbasis data geografis <i>(Data-Driven Spatial Policy)</i> untuk jajaran Pemerintah Kota Bogor (Bappeda, Dinas Ketahanan Pangan, Dinas Kesehatan) bekerja sama dengan Pusat Studi Pembangunan IPB University.
            </p>

            <h4 className="about-subhead">Sasaran & Cakupan Sistem:</h4>
            <ul className="about-bullet-list">
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-primary-green" />
                <span>Pemantauan indeks ketahanan pangan (IKP) berkala pada 6 kecamatan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-primary-green" />
                <span>Monitoring jangkauan pipa dan kualitas air bersih PDAM Tirta Pakuan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-primary-green" />
                <span>Deteksi dini dan penanganan prioritas stunting balita tingkat kecamatan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-primary-green" />
                <span>Transparansi pengawasan ketersediaan pasokan pangan di pasar tradisional.</span>
              </li>
            </ul>

            <div className="about-partners-wrap">
              <span className="partners-label">Kemitraan & Sumber Data:</span>
              <div className="partners-chips">
                <span className="partner-chip">Bappeda Kota Bogor</span>
                <span className="partner-chip">Dinas Ketahanan Pangan</span>
                <span className="partner-chip">Dinas Kesehatan</span>
                <span className="partner-chip">IPB University</span>
                <span className="partner-chip">BPS Kota Bogor</span>
                <span className="partner-chip">PDAM Tirta Pakuan</span>
              </div>
            </div>
          </div>

          <div className="gov-card about-contact-panel">
            <h3 className="contact-title">Kontak & Layanan Portal SIG</h3>

            <div className="contact-entry">
              <Building2 size={18} className="contact-icon text-primary-green" />
              <div>
                <b>Alamat Kantor Balai Kota:</b>
                <p>Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121</p>
              </div>
            </div>

            <div className="contact-entry">
              <Mail size={18} className="contact-icon text-primary-green" />
              <div>
                <b>Email Resmi Pelaporan GIS:</b>
                <p>sig.nutrimap@bogorkota.go.id</p>
              </div>
            </div>

            <div className="contact-entry">
              <Phone size={18} className="contact-icon text-primary-green" />
              <div>
                <b>Layanan Hotline / WhatsApp:</b>
                <p>+62 812-3456-7890</p>
              </div>
            </div>

            <div className="admin-shortcut-box">
              <span>Akses Aparatur / Pengelola Wilayah:</span>
              <button className="primary-btn-sm" onClick={onOpenLogin}>
                Login Panel Admin SIG
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Institutional Footer */}
      <footer className="gov-portal-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo-box">
              <Layers size={18} className="text-primary-green" />
            </div>
            <div>
              <div className="fb-title">NutriMap Kota Bogor</div>
              <div className="fb-sub">Sistem Informasi Geografis Pemantauan Ketahanan Pangan & Stunting Wilayah</div>
            </div>
          </div>
          <div className="footer-meta">
            <span>Pemerintah Kota Bogor • Bappeda • Dinas Ketahanan Pangan • Dinas Kesehatan</span>
            <span className="font-mono">v2.4.0-GIS • Data Spasial Resmi 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
