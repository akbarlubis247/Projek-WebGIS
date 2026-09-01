import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  MapPin,
  Utensils,
  Droplets,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  LogIn,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle2,
  Building2,
  Users,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Mail,
  Phone,
  BookOpen,
  Sparkles,
  Activity,
  Award,
  BarChart3
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

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function LandingPageView({ onOpenLogin }) {
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_KOTA_BOGOR[0]);
  const [searchTable, setSearchTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [activeChartMetric, setActiveChartMetric] = useState('panganSkor');

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Filtered Table Data
  const filteredData = KECAMATAN_KOTA_BOGOR.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTable.toLowerCase()) ||
      item.pusat.toLowerCase().includes(searchTable.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || item.panganStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleScrollToMap = () => {
    const el = document.getElementById('peta-spasial');
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nama Kecamatan,Pusat,Penduduk,Status Pangan,Skor IKP,Air Bersih,Stunting,Kemiskinan\n";
    filteredData.forEach(row => {
      csvContent += `${row.id},"${row.nama}","${row.pusat}",${row.penduduk},"${row.panganStatus}",${row.panganSkor},${row.airBersih},${row.stunting},"${row.tingkatKemiskinan}"\n`;
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
      {/* Top Scroll Progress Indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* SECTION 1: HERO & BERANDA */}
      <section id="beranda" className="landing-hero-section">
        <motion.div
          className="landing-hero glow-effect"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Animated Background Mesh Orbs */}
          <div className="animated-bg-orb orb-1" />
          <div className="animated-bg-orb orb-2" />

          <div className="l-hero-content">

            <motion.h1 variants={fadeInUp} className="hero-gradient-title">
              NutriMap Kota Bogor
            </motion.h1>

            <motion.p variants={fadeInUp}>
              Sistem Informasi Geografis Pemantauan Spasial Ketahanan Pangan, Akses Air Bersih Layak, dan Penanganan Stunting 6 Kecamatan di Kota Bogor secara Real-Time & Transparan.
            </motion.p>

            <motion.div className="l-hero-actions" variants={fadeInUp}>
              <motion.button
                className="primary-btn hero-btn"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScrollToMap}
              >
                <MapPin size={20} /> Jelajahi Peta Spasial Interaktif
              </motion.button>


            </motion.div>
          </div>

          {/* Animated Live Metric Cards */}
          <motion.div className="l-hero-stats" variants={staggerContainer}>
            <motion.div
              className="l-stat-box animated-card"
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="stat-top">
                <Utensils size={20} className="text-emerald" />
                <span>Indeks Ketahanan Pangan (IKP)</span>
              </div>
              <strong>{KOTA_BOGOR_STATS.skorIKP} / 100</strong>
              <div className="stat-progress-bar">
                <motion.div
                  className="bar-fill emerald"
                  initial={{ width: 0 }}
                  animate={{ width: `${KOTA_BOGOR_STATS.skorIKP}%` }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />
              </div>
              <small className="good"><ArrowUpRight size={14} /> Kategori Sangat Baik (Pemkot Bogor)</small>
            </motion.div>

            <motion.div
              className="l-stat-box animated-card"
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="stat-top">
                <HeartPulse size={20} className="text-rose" />
                <span>Prevalensi Stunting Balita</span>
              </div>
              <strong>{KOTA_BOGOR_STATS.prevalensiStunting}</strong>
              <div className="stat-progress-bar">
                <motion.div
                  className="bar-fill rose"
                  initial={{ width: 0 }}
                  animate={{ width: '15.4%' }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
              </div>
              <small className="good"><ArrowDownRight size={14} /> -2.1% Penurunan Tahun 2026</small>
            </motion.div>

            <motion.div
              className="l-stat-box animated-card"
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="stat-top">
                <Droplets size={20} className="text-cyan" />
                <span>Akses Air Bersih Layak</span>
              </div>
              <strong>{KOTA_BOGOR_STATS.aksesAirBersih}</strong>
              <div className="stat-progress-bar">
                <motion.div
                  className="bar-fill cyan"
                  initial={{ width: 0 }}
                  animate={{ width: '89.6%' }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </div>
              <small className="good"><Award size={14} /> PDAM Tirta Pakuan Kota Bogor</small>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Kecamatan Cards Grid */}
        <motion.div
          className="landing-section-sub"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <div className="section-head-sm">
            <h3>Overview 6 Kecamatan Kota Bogor</h3>
            <p>Klik kecamatan untuk melihat analisis spasial & peta interaktif</p>
          </div>

          <div className="landing-kec-grid">
            {KECAMATAN_KOTA_BOGOR.map((kec) => (
              <motion.div
                key={kec.id}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)' }}
                whileTap={{ scale: 0.98 }}
                className={`landing-kec-card ${selectedKec.id === kec.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedKec(kec);
                  handleScrollToMap();
                }}
              >
                <div className="lkc-head">
                  <b>Kecamatan {kec.nama}</b>
                  <span className={`badge ${kec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {kec.panganStatus}
                  </span>
                </div>
                <p className="lkc-sub">Pusat Administrasi: {kec.pusat}</p>

                <div className="lkc-metrics-preview">
                  <div className="m-pill">
                    <span>IKP:</span> <strong>{kec.panganSkor}</strong>
                  </div>
                  <div className="m-pill">
                    <span>Air:</span> <strong>{kec.airBersih}%</strong>
                  </div>
                  <div className="m-pill">
                    <span>Stunting:</span> <strong className={kec.stunting > 15 ? 'text-danger' : ''}>{kec.stunting}%</strong>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: PETA SPASIAL */}
      <motion.section
        id="peta-spasial"
        className="single-page-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className="section-head">
          <h2>Peta Persebaran Ketahanan Pangan & Stunting Kota Bogor</h2>
          <p>Visualisasi GIS 6 Kecamatan Kota Bogor dengan layer tematik, radius buffer, dan profil kependudukan</p>
        </div>

        <div className="dashboard-main-grid">
          <div className="dash-card map-panel glow-card">
            <MapView
              selectedKecamatan={selectedKec}
              onSelectKecamatan={(kec) => setSelectedKec(kec)}
              height="520px"
            />
          </div>

          <motion.div className="dash-card detail-side-panel" variants={fadeInUp}>
            <div className="kec-profile-wrap">
              <div className="profile-top">
                <span className="p-id">{selectedKec.id}</span>
                <h3>Kecamatan {selectedKec.nama}</h3>
                <span className={`status-pill ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedKec.panganStatus}
                </span>
              </div>

              <p className="p-desc">{selectedKec.deskripsi}</p>

              {/* Animated Progress Gauges */}
              <div className="animated-gauges-list">
                <div className="gauge-item">
                  <div className="g-info">
                    <span>Skor Ketahanan Pangan (IKP)</span>
                    <strong>{selectedKec.panganSkor} / 100</strong>
                  </div>
                  <div className="gauge-bar">
                    <motion.div
                      className="gauge-fill emerald"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedKec.panganSkor}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="gauge-item">
                  <div className="g-info">
                    <span>Akses Air Bersih Layak</span>
                    <strong>{selectedKec.airBersih}%</strong>
                  </div>
                  <div className="gauge-bar">
                    <motion.div
                      className="gauge-fill cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedKec.airBersih}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="gauge-item">
                  <div className="g-info">
                    <span>Prevalensi Stunting Balita</span>
                    <strong className={selectedKec.stunting > 15 ? 'text-danger' : ''}>{selectedKec.stunting}%</strong>
                  </div>
                  <div className="gauge-bar">
                    <motion.div
                      className="gauge-fill rose"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedKec.stunting / 25) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-metrics-grid">
                <div className="pm-item">
                  <span>Jumlah Penduduk</span>
                  <strong>{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</strong>
                </div>
                <div className="pm-item">
                  <span>Jumlah Faskes & Pasar</span>
                  <strong>{selectedKec.faskes} Unit</strong>
                </div>
              </div>

              <div className="p-actions font-mono">
                <span>Sumber Air Dominan: <b>{selectedKec.sumberAirDominan}</b></span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 3: DATA INDIKATOR KOTA & VISUAL CHART */}
      <motion.section
        id="data-indikator"
        className="single-page-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className="section-head">
          <h2>Data Indikator & Grafik Perbandingan Kota Bogor</h2>
          <p>Tabel interaktif kependudukan dan grafik perbandingan 6 Kecamatan di Kota Bogor</p>
        </div>

        {/* Metric Selector Tabs for Chart */}
        <div className="chart-metric-selector">
          <button
            className={`c-tab ${activeChartMetric === 'panganSkor' ? 'active' : ''}`}
            onClick={() => setActiveChartMetric('panganSkor')}
          >
            <Utensils size={16} /> Skor IKP Pangan
          </button>
          <button
            className={`c-tab ${activeChartMetric === 'airBersih' ? 'active' : ''}`}
            onClick={() => setActiveChartMetric('airBersih')}
          >
            <Droplets size={16} /> Akses Air Bersih (%)
          </button>
          <button
            className={`c-tab ${activeChartMetric === 'stunting' ? 'active' : ''}`}
            onClick={() => setActiveChartMetric('stunting')}
          >
            <HeartPulse size={16} /> Prevalensi Stunting (%)
          </button>
        </div>

        {/* Animated Recharts Visual Bar Chart */}
        <div className="dash-card chart-card animate-zoom-in">
          <div className="chart-head">
            <h3>
              {activeChartMetric === 'panganSkor' && 'Perbandingan Indeks Ketahanan Pangan (IKP)'}
              {activeChartMetric === 'airBersih' && 'Perbandingan Akses Air Bersih Layak (%)'}
              {activeChartMetric === 'stunting' && 'Perbandingan Prevalensi Stunting Balita (%)'}
            </h3>
            <p>Peringkat 6 Kecamatan Kota Bogor Tahun 2026</p>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={KECAMATAN_KOTA_BOGOR} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nama" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey={activeChartMetric} radius={[6, 6, 0, 0]}>
                  {KECAMATAN_KOTA_BOGOR.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        activeChartMetric === 'panganSkor'
                          ? '#10b981'
                          : activeChartMetric === 'airBersih'
                          ? '#06b6d4'
                          : '#f43f5e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modern Data Table Component */}
        <div className="dash-card table-card modern-table-container glow-card">
          <div className="table-tools-header">
            <div className="t-search modern-search">
              <Search size={18} className="icon" />
              <input
                type="text"
                placeholder="Cari kecamatan atau pusat administrasi Kota Bogor..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>

            <div className="t-filters">
              <label className="select-wrap modern-select">
                <Filter size={14} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>Semua Status</option>
                  {FOOD_SECURITY_CATEGORIES.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <motion.button
                className="primary-btn-sm export-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleExportCSV}
              >
                <FileSpreadsheet size={16} /> Unduh Data CSV
              </motion.button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Kode ID</th>
                  <th>Kecamatan & Pusat</th>
                  <th>Jumlah Penduduk</th>
                  <th>Status Pangan</th>
                  <th>Skor IKP Pangan</th>
                  <th>Akses Air Bersih</th>
                  <th>Stunting Balita</th>
                  <th>Faskes & Pasar</th>
                  <th>Aksi Spasial</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="modern-row"
                  >
                    <td>
                      <span className="table-id-tag font-mono">{row.id}</span>
                    </td>
                    <td>
                      <div className="kec-cell">
                        <div className="kec-icon-dot">
                          <MapPin size={15} className="text-emerald" />
                        </div>
                        <div>
                          <b className="kec-name">Kec. {row.nama}</b>
                          <span className="sub-pusat">{row.pusat}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono fw-semibold">
                      {row.penduduk.toLocaleString('id-ID')} jiwa
                    </td>
                    <td>
                      <span className={`status-badge-pill ${row.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.panganStatus}
                      </span>
                    </td>
                    <td>
                      <div className="mini-progress-cell">
                        <div className="mp-val">
                          <strong>{row.panganSkor}</strong> <small>/ 100</small>
                        </div>
                        <div className="mp-bar">
                          <div className="mp-fill emerald" style={{ width: `${row.panganSkor}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="mini-progress-cell">
                        <div className="mp-val">
                          <strong>{row.airBersih}%</strong>
                        </div>
                        <div className="mp-bar">
                          <div className="mp-fill cyan" style={{ width: `${row.airBersih}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`stunting-pill ${row.stunting > 15 ? 'high' : 'normal'}`}>
                        {row.stunting}%
                      </span>
                    </td>
                    <td>
                      <span className="faskes-tag">{row.faskes} Unit</span>
                    </td>
                    <td>
                      <motion.button
                        className="table-action-btn-modern"
                        whileHover={{ scale: 1.05, backgroundColor: '#10b981', color: '#ffffff' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedKec(row);
                          handleScrollToMap();
                        }}
                      >
                        <MapPin size={13} /> Focus Peta
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4: TENTANG NUTRIMAP & KONTAK */}
      <motion.section
        id="tentang-nutrimap"
        className="single-page-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className="section-head">
          <h2>Tentang NutriMap Kota Bogor</h2>
          <p>Sistem Informasi Geografis resmi Pemkot Bogor untuk pemantauan ketahanan pangan & kesehatan</p>
        </div>

        <div className="about-grid">
          <motion.div
            className="dash-card about-card glow-card"
            whileHover={{ y: -4 }}
          >
            <div className="brand-badge-large">
              <Layers size={38} className="text-emerald" />
              <div>
                <h2>NutriMap Kota Bogor v2.4</h2>
                <p>Platform SIG Spasial Resmi Kota Bogor, Jawa Barat</p>
              </div>
            </div>

            <p className="about-text">
              <b>NutriMap Kota Bogor</b> dikembangkan sebagai sarana pengambilan keputusan berbasis data geografis (Data-Driven Policy) untuk jajaran Pemerintah Kota Bogor (Bappeda, Dinas Ketahanan Pangan, Dinas Kesehatan) bekerja sama dengan Pusat Studi Pembangunan IPB University.
            </p>

            <h3>Tujuan Utama Platform NutriMap:</h3>
            <ul className="about-list">
              <li><CheckCircle2 size={18} className="text-emerald" /> Pemetaan 6 Kecamatan di Kota Bogor berdasarkan Indeks Ketahanan Pangan (IKP).</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> Monitoring real-time cakupan akses air bersih layak (PDAM Tirta Pakuan).</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> Deteksi awal dan intervensi cepat pada kelurahan dengan angka stunting balita tinggi.</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> Pengawasan dan transparansi sidak laboratorium keamanan pangan di pasar tradisional.</li>
            </ul>

            <div className="about-partners">
              <h4>Kemitraan & Sumber Data:</h4>
              <div className="partner-tags">
                <span className="p-tag">Bappeda Kota Bogor</span>
                <span className="p-tag">Dinas Ketahanan Pangan</span>
                <span className="p-tag">Dinas Kesehatan</span>
                <span className="p-tag">IPB University</span>
                <span className="p-tag">BPS Kota Bogor</span>
                <span className="p-tag">PDAM Tirta Pakuan</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="dash-card contact-card"
            whileHover={{ y: -4 }}
          >
            <h3>Kontak & Informasi Layanan SIG</h3>
            <div className="contact-item">
              <MapPin size={22} className="text-emerald" />
              <div>
                <b>Alamat Kantor:</b>
                <p>Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121</p>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={22} className="text-cyan" />
              <div>
                <b>Email Portal SIG:</b>
                <p>sig.nutrimap@bogorkota.go.id</p>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={22} className="text-emerald" />
              <div>
                <b>Nomor Telepon / WhatsApp:</b>
                <p>+62 812-3456-7890</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
