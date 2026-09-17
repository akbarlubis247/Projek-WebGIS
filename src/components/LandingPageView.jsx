import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin,
  Utensils,
  Droplets,
  HeartPulse,
  Calendar,
  Layers,
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
  Sparkles,
  Sprout,
  ShieldCheck,
  Award,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import MapView from './MapView';
import {
  KOTA_BOGOR_STATS,
  KECAMATAN_KOTA_BOGOR,
  FOOD_SECURITY_CATEGORIES
} from '../data/bogorData';
import heroBg from '../assets/hero-banner.png';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function LandingPageView({ onOpenLogin }) {
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_KOTA_BOGOR[0]);
  const [searchTable, setSearchTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [activeChartMetric, setActiveChartMetric] = useState('panganSkor');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Root Container Ref
  const landingRef = useRef(null);

  // Filtered Table Data for Data Indikator Section
  const filteredData = KECAMATAN_KOTA_BOGOR.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTable.toLowerCase()) ||
      item.pusat.toLowerCase().includes(searchTable.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.panganStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  // GSAP Smooth Modern Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline (Loads when page opens)
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl.fromTo(
        '.hero-showcase-container',
        { y: 35, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      );

      // 2. Manifesto ScrollTrigger Reveal
      gsap.fromTo(
        '.gsap-manifesto',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.ladang-manifesto-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 3. 4 Pillars Staggered Reveal
      gsap.fromTo(
        '.ladang-pillar-card',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.ladang-pillars-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 4. Comparison Table Card Reveal
      gsap.fromTo(
        '.gsap-table-box',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-table-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 5. Spatial Map & Side Panel Reveal
      gsap.fromTo(
        '.map-main-panel',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#peta-spasial',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.analysis-side-panel',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#peta-spasial',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 6. Data Indicator Toolbar & Chart Section Reveal
      gsap.fromTo(
        '.gsap-data-section',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#data-indikator',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 7. About Section Reveal
      gsap.fromTo(
        '.about-split-grid > div',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#tentang-nutrimap',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, landingRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToMap = (targetKec = null) => {
    if (targetKec) {
      setSelectedKec(targetKec);
    }
    const el = document.getElementById('peta-spasial');
    if (el) {
      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 96;
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
    <div className="landing-single-page" ref={landingRef}>
      {/* SECTION 1: HERO BANNER SHOWCASE (FULL BLEED EDGE-TO-EDGE) */}
      <section id="beranda" className="hero-showcase-section">
        <div className="hero-showcase-container">
          <div className="hero-banner-frame">
            <img
              src={heroBg}
              alt="NutriMap Kota Bogor - Ketahanan Pangan Tangguh, Akses Air Bersih & Gizi Sehat"
              className="hero-banner-image"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: EDITORIAL MANIFESTO STRIP (WARM LINEN STYLE) */}
      <section className="ladang-manifesto-section">
        <div className="ladang-manifesto-inner gsap-manifesto">
          <span className="ladang-pill-badge">KOMITMEN KEDAULATAN PANGAN</span>
          <h2 className="ladang-manifesto-title">
            Mewujudkan Kota Bogor Berketahanan Pangan Berbasis Data Geografis Nyata
          </h2>
          <p className="ladang-manifesto-text">
            Sebagai sarana perumusan kebijakan berbasis spasial <i>(Data-Driven Spatial Policy)</i>, <b>NutriMap Kota Bogor</b> menghubungkan data kependudukan, keterjangkauan komoditas pangan pokok, pengawasan keamanan pangan di pasar tradisional, dan indeks stunting pada 6 kecamatan. Menghadirkan informasi yang transparan, mudah diakses masyarakat, dan dapat dipertanggungjawabkan untuk kesejahteraan bersama.
          </p>
        </div>
      </section>

      {/* SECTION 3: 4 PILAR INDIKATOR UTAMA (ORGANIC METRIC CARDS) */}
      <section className="ladang-pillars-section">
        <div className="ladang-section-head">
          <span className="ladang-sub-tag">
            <Sparkles size={13} />
            <span>Indikator Kunci Wilayah</span>
          </span>
          <h2>4 Pilar Utama Pemantauan Spasial Kota</h2>
          <p>Indikator terukur yang menjadi acuan intervensi prioritas jajaran dinas terkait Pemerintah Kota Bogor.</p>
        </div>

        <div className="ladang-pillars-grid">
          {/* Pilar 1: IKP */}
          <div className="ladang-pillar-card p-green">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Utensils size={20} />
              </div>
              <span className="pillar-badge badge-green">Sangat Baik</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">Indeks Ketahanan Pangan (IKP)</span>
              <div className="pillar-val-row">
                <span className="pillar-val">{KOTA_BOGOR_STATS.skorIKP}</span>
                <span className="pillar-unit">/ 100</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-green" style={{ width: `${KOTA_BOGOR_STATS.skorIKP}%` }} />
              </div>
            </div>
          </div>

          {/* Pilar 2: Air Bersih */}
          <div className="ladang-pillar-card p-teal">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Droplets size={20} />
              </div>
              <span className="pillar-badge badge-teal">Aman & Stabil</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">Akses Air Bersih Layak</span>
              <div className="pillar-val-row">
                <span className="pillar-val">{KOTA_BOGOR_STATS.aksesAirBersih}</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-teal" style={{ width: '89.6%' }} />
              </div>
            </div>
          </div>

          {/* Pilar 3: Stunting */}
          <div className="ladang-pillar-card p-terracotta">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <HeartPulse size={20} />
              </div>
              <span className="pillar-badge badge-terracotta">Intervensi Aktif</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">Prevalensi Stunting Balita</span>
              <div className="pillar-val-row">
                <span className="pillar-val">{KOTA_BOGOR_STATS.prevalensiStunting}</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-terracotta" style={{ width: '15.4%' }} />
              </div>
            </div>
          </div>

          {/* Pilar 4: Fasilitas & Pasar */}
          <div className="ladang-pillar-card p-earth">
            <div className="pillar-top">
              <div className="pillar-icon-box">
                <Building2 size={20} />
              </div>
              <span className="pillar-badge badge-earth">100% Terverifikasi</span>
            </div>
            <div className="pillar-main">
              <span className="pillar-label">Faskes & Pasar Tradisional</span>
              <div className="pillar-val-row">
                <span className="pillar-val-small">14 Faskes • 4 Pasar</span>
              </div>
              <div className="pillar-track">
                <div className="pillar-fill fill-earth" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Overview 6 Kecamatan (Clean Editorial Table) */}
        <div className="ladang-card-box overview-kecamatan-card gsap-table-box">
          <div className="ladang-card-header">
            <div>
              <h3 className="ladang-card-title">Matriks Komparasi 6 Kecamatan Kota Bogor</h3>
              <p className="ladang-card-desc">
                Pilih kecamatan untuk fokus ke titik koordinat peta atau meninjau detail demografi dan fasilitas.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="ladang-table">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>Kecamatan</th>
                  <th style={{ width: '18%' }}>Status Ketahanan</th>
                  <th style={{ width: '16%' }}>Skor IKP</th>
                  <th style={{ width: '16%' }}>Akses Air Bersih</th>
                  <th style={{ width: '14%' }}>Prevalensi Stunting</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {KECAMATAN_KOTA_BOGOR.map((kec) => {
                  const isSelected = selectedKec.id === kec.id;
                  const statusClass = kec.panganStatus.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr
                      key={kec.id}
                      className={`ladang-row ${isSelected ? 'row-selected' : ''}`}
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
                          <span className="val-text"><b>{kec.panganSkor}</b> <small>/ 100</small></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-green" style={{ width: `${kec.panganSkor}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="val-with-bar">
                          <span className="val-text"><b>{kec.airBersih}%</b></span>
                          <div className="mini-bar-track">
                            <div className="mini-bar-fill bg-teal" style={{ width: `${kec.airBersih}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`stunting-val ${kec.stunting > 15 ? 'val-danger' : 'val-normal'}`}>
                          {kec.stunting}%
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

      {/* SECTION 4: PETA SPASIAL KETAHANAN PANGAN */}
      <section id="peta-spasial" className="single-page-section">
        <div className="ladang-section-head">
          <span className="ladang-sub-tag">
            <MapPin size={13} />
            <span>Visualisasi Geografis</span>
          </span>
          <h2>Peta Spasial Ketahanan Pangan Kota Bogor</h2>
          <p>
            Eksplorasi kondisi 6 kecamatan Kota Bogor berdasarkan skor IKP, akses air minum layak, prevalensi stunting, dan sebaran fasilitas publik.
          </p>
        </div>

        {/* 70% Map : 30% Analysis Sidebar Grid */}
        <div className="spatial-workspace-grid">
          {/* Main Map Canvas (70-75% Area) */}
          <div className="ladang-card-box map-main-panel">
            <MapView
              selectedKecamatan={selectedKec}
              onSelectKecamatan={(kec) => setSelectedKec(kec)}
              height={isMobile ? '420px' : '580px'}
            />
          </div>

          {/* Analysis Sidebar (25-30% Area) */}
          <div className="ladang-card-box analysis-side-panel">
            <div className="analysis-header">
              <div className="ah-meta">
                <span className="ah-id-code">{selectedKec.id}</span>
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
                <span className="ir-val"><b>{selectedKec.panganSkor}</b> / 100</span>
                <div className="ir-progress-track">
                  <div className="ir-progress-fill bg-green" style={{ width: `${selectedKec.panganSkor}%` }} />
                </div>
              </div>

              <div className="indicator-row">
                <div className="ir-label">
                  <Droplets size={14} className="text-water-cyan" />
                  <span>Akses Air Bersih Layak</span>
                </div>
                <span className="ir-val"><b>{selectedKec.airBersih}%</b></span>
                <div className="ir-progress-track">
                  <div className="ir-progress-fill bg-cyan" style={{ width: `${selectedKec.airBersih}%` }} />
                </div>
              </div>

              <div className="indicator-row">
                <div className="ir-label">
                  <HeartPulse size={14} className="text-danger" />
                  <span>Prevalensi Stunting</span>
                </div>
                <span className={`ir-val ${selectedKec.stunting > 15 ? 'text-danger fw-bold' : ''}`}>
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
                <span className="md-value">{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Fasilitas Kesehatan & Pasar</span>
                <span className="md-value">{selectedKec.faskes} Faskes • {selectedKec.pasarTradisional} Pasar</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Tingkat Kemiskinan</span>
                <span className="md-value">{selectedKec.tingkatKemiskinan}</span>
              </div>

              <div className="meta-data-row">
                <span className="md-label">Sumber Air Dominan</span>
                <span className="md-value">{selectedKec.sumberAirDominan}</span>
              </div>
            </div>

            <div className="analysis-footer">
              <span className="af-coord">Lat: {selectedKec.lat}, Lng: {selectedKec.lng}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: DATA INDIKATOR KOTA & VISUAL CHART */}
      <section id="data-indikator" className="single-page-section">
        <div className="ladang-section-head">
          <span className="ladang-sub-tag">
            <BarChart3 size={13} />
            <span>Data & Statistik Kota</span>
          </span>
          <h2>Data Indikator Kota Bogor</h2>
          <p>Tabel interaktif kependudukan dan komparasi grafis indikator ketahanan pangan lintas kecamatan.</p>
        </div>

        {/* Data Filter & Search Toolbar */}
        <div className="ladang-card-box toolbar-card gsap-data-section">
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
            <button className="ladang-btn-export" onClick={handleExportCSV}>
              <FileSpreadsheet size={15} />
              <span>Ekspor Data CSV</span>
            </button>
          </div>
        </div>

        {/* Chart Visualization Section */}
        <div className="ladang-card-box chart-section-card gsap-data-section">
          <div className="chart-header-row">
            <div>
              <h3 className="chart-title">
                {activeChartMetric === 'panganSkor' && 'Peringkat Indeks Ketahanan Pangan (IKP) per Kecamatan'}
                {activeChartMetric === 'airBersih' && 'Akses Air Bersih Layak (%) per Kecamatan'}
                {activeChartMetric === 'stunting' && 'Prevalensi Stunting Balita (%) per Kecamatan'}
              </h3>
              <p className="chart-subtitle">
                Grafik perbandingan skor indikator pada seluruh kecamatan di Kota Bogor.
              </p>
            </div>

            {/* Chart Metric Switcher Tabs */}
            <div className="chart-tab-group">
              <button
                className={`chart-tab ${activeChartMetric === 'panganSkor' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('panganSkor')}
              >
                <Utensils size={13} />
                <span>Skor IKP</span>
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'airBersih' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('airBersih')}
              >
                <Droplets size={13} />
                <span>Air Bersih</span>
              </button>
              <button
                className={`chart-tab ${activeChartMetric === 'stunting' ? 'active' : ''}`}
                onClick={() => setActiveChartMetric('stunting')}
              >
                <HeartPulse size={13} />
                <span>Stunting</span>
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: isMobile ? 310 : 380, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={KECAMATAN_KOTA_BOGOR}
                margin={isMobile ? { top: 28, right: 8, left: -22, bottom: 25 } : { top: 28, right: 25, left: -5, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradientIKP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D6A4F" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1B4332" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientAir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A9D8F" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D6F65" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientStunting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E76F51" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C86446" stopOpacity={0.92} />
                  </linearGradient>
                  <linearGradient id="barGradientStuntingHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E63946" stopOpacity={1} />
                    <stop offset="100%" stopColor="#A8201A" stopOpacity={0.92} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5DC" />
                <XAxis
                  dataKey="nama"
                  tick={{ fontSize: isMobile ? 10 : 13, fill: '#3E3431', fontWeight: 700 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E8E2D8' }}
                  dy={isMobile ? 2 : 6}
                  interval={0}
                  angle={isMobile ? -25 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 45 : 30}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#8C827A', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, activeChartMetric === 'stunting' ? 28 : 115]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(45, 90, 60, 0.05)', radius: 10 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      let label = 'Skor IKP';
                      let val = data.panganSkor + ' / 100';
                      if (activeChartMetric === 'airBersih') {
                        label = 'Akses Air Bersih';
                        val = data.airBersih + '%';
                      } else if (activeChartMetric === 'stunting') {
                        label = 'Prevalensi Stunting';
                        val = data.stunting + '%';
                      }
                      return (
                        <div className="ladang-chart-tooltip">
                          <span className="tt-kec">Kecamatan {data.nama}</span>
                          <span className="tt-val">{label}: <b>{val}</b></span>
                          <span className="tt-sub">Pusat: {data.pusat}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={activeChartMetric}
                  radius={[isMobile ? 8 : 12, isMobile ? 8 : 12, 0, 0]}
                  barSize={isMobile ? 32 : 68}
                  maxBarSize={isMobile ? 42 : 80}
                >
                  <LabelList
                    dataKey={activeChartMetric}
                    position="top"
                    formatter={(val) => {
                      if (activeChartMetric === 'panganSkor') return `${val}`;
                      return `${val}%`;
                    }}
                    style={{ fill: '#241D1B', fontSize: isMobile ? 10 : 13, fontWeight: 800 }}
                    offset={isMobile ? 6 : 10}
                  />
                  {KECAMATAN_KOTA_BOGOR.map((entry, index) => {
                    let fill = 'url(#barGradientIKP)';
                    if (activeChartMetric === 'airBersih') fill = 'url(#barGradientAir)';
                    if (activeChartMetric === 'stunting') {
                      fill = entry.stunting > 15 ? 'url(#barGradientStuntingHigh)' : 'url(#barGradientStunting)';
                    }
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 6: TENTANG NUTRIMAP & MITRA RESMI */}
      <section id="tentang-nutrimap" className="single-page-section">
        <div className="ladang-section-head">
          <span className="ladang-sub-tag">
            <Info size={13} />
            <span>Informasi Platform</span>
          </span>
          <h2>Tentang NutriMap Kota Bogor</h2>
          <p>Portal Sistem Informasi Geografis Pemantauan Ketahanan Pangan & Kesejahteraan Terpadu</p>
        </div>

        <div className="about-split-grid">
          <div className="ladang-card-box about-info-panel">
            <div className="about-brand-header">
              <div className="about-logo-box">
                <Sprout size={24} className="text-forest" />
              </div>
              <div>
                <h3>NutriMap Kota Bogor</h3>
                <p>Platform SIG Spasial Resmi Pemerintah Kota Bogor, Jawa Barat</p>
              </div>
            </div>

            <h4 className="about-subhead">Sasaran & Cakupan Sistem:</h4>
            <ul className="about-bullet-list">
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-forest" />
                <span>Pemantauan indeks ketahanan pangan (IKP) berkala pada 6 kecamatan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-forest" />
                <span>Monitoring jangkauan pipa dan kualitas air bersih PDAM Tirta Pakuan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-forest" />
                <span>Deteksi dini dan penanganan prioritas stunting balita tingkat kecamatan.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon text-forest" />
                <span>Transparansi pengawasan ketersediaan pasokan pangan di pasar tradisional.</span>
              </li>
            </ul>

            <div className="about-partners-wrap">
              <span className="partners-label">Sumber Data:</span>
              <a
                href="https://satupeta.kotabogor.go.id/maps"
                target="_blank"
                rel="noreferrer"
                className="sumber-data-link"
              >
                <ExternalLink size={14} />
                <span>Peta | Satu Peta Kota Bogor</span>
              </a>
            </div>
          </div>

          <div className="ladang-card-box about-contact-panel">
            <h3 className="contact-title">Kontak & Layanan Portal SIG</h3>

            <div className="contact-entry">
              <Building2 size={18} className="contact-icon text-forest" />
              <div>
                <b>Alamat Kantor Balai Kota:</b>
                <p>Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121</p>
              </div>
            </div>

            <div className="contact-entry">
              <Mail size={18} className="contact-icon text-forest" />
              <div>
                <b>Email Resmi Pelaporan GIS:</b>
                <p>sig.nutrimap@bogorkota.go.id</p>
              </div>
            </div>

            <div className="contact-entry">
              <Phone size={18} className="contact-icon text-forest" />
              <div>
                <b>Layanan Hotline / WhatsApp:</b>
                <p>+62 812-3456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL INSTITUTIONAL FOOTER (EARTHY COCOA THEME) */}
      <footer className="ladang-portal-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-logo-box">
                <Sprout size={20} className="text-white" />
              </div>
              <div>
                <div className="fb-title">NutriMap Kota Bogor</div>
                <div className="fb-sub">Sistem Informasi Geografis Ketahanan Pangan & Kesejahteraan</div>
              </div>
            </div>
            <p className="footer-brand-desc">
              Inisiatif geospasial Pemerintah Kota Bogor untuk transparansi data ketersediaan pangan pokok, akses air bersih, dan pemantauan kesehatan gizi masyarakat secara berkelanjutan.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>&copy; {new Date().getFullYear()} Pemerintah Kota Bogor • Bappeda • Dinas Ketahanan Pangan • Dinas Kesehatan. Seluruh Hak Cipta Dilindungi.</span>
        </div>
      </footer>
    </div>
  );
}
