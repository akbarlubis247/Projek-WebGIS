import React, { useState, useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import {
  Utensils,
  Droplets,
  HeartPulse,
  AlertOctagon,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CheckCircle2,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import MapView from './MapView';
import {
  KOTA_BOGOR_STATS,
  KECAMATAN_KOTA_BOGOR,
  MONTHLY_TREND,
  FOOD_SECURITY_CATEGORIES
} from '../data/bogorData';

export default function DashboardView({ onNavigate, onSelectKecamatan }) {
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_KOTA_BOGOR[0]);

  // Priority count
  const highRiskCount = KECAMATAN_KOTA_BOGOR.filter(k => k.prioritas === 'Tinggi' || k.prioritas === 'Sangat Tinggi').length;
  const safeCount = KECAMATAN_KOTA_BOGOR.filter(k => k.panganStatus === 'Sangat Aman' || k.panganStatus === 'Aman').length;

  // CountUp Refs for Dashboard KPIs
  const heroIkpRef = useRef(null);
  const heroStuntingRef = useRef(null);
  const safeCountRef = useRef(null);
  const waterRef = useRef(null);
  const stuntingRef = useRef(null);
  const riskRef = useRef(null);

  // Per-kecamatan side panel refs
  const pmPendudukRef = useRef(null);
  const pmIkpRef = useRef(null);
  const pmAirRef = useRef(null);
  const pmStuntingRef = useRef(null);
  const pmFaskesRef = useRef(null);

  // Animate Dashboard Top Stats on mount
  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.2, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(heroIkpRef, parseFloat(KOTA_BOGOR_STATS.skorIKP) || 88.4, { decimalPlaces: 1 });
    anim(heroStuntingRef, parseFloat(KOTA_BOGOR_STATS.prevalensiStunting) || 10.5, { decimalPlaces: 1, suffix: '%' });
    anim(safeCountRef, safeCount);
    anim(waterRef, parseFloat(KOTA_BOGOR_STATS.aksesAirBersih) || 89.6, { decimalPlaces: 1, suffix: '%' });
    anim(stuntingRef, parseFloat(KOTA_BOGOR_STATS.prevalensiStunting) || 10.5, { decimalPlaces: 1, suffix: '%' });
    anim(riskRef, highRiskCount);
  }, [safeCount, highRiskCount]);

  // Re-animate Selected Kecamatan metrics on change
  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.0, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(pmPendudukRef, selectedKec.penduduk, { formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' jiwa' });
    anim(pmIkpRef, selectedKec.panganSkor, { decimalPlaces: 1 });
    anim(pmAirRef, selectedKec.airBersih, { decimalPlaces: 1, suffix: '%' });
    anim(pmStuntingRef, selectedKec.stunting, { decimalPlaces: 1, suffix: '%' });
    anim(pmFaskesRef, selectedKec.faskes, { suffix: ' Puskesmas/Klinik' });
  }, [selectedKec]);

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Hero Banner */}
      <div className="dash-hero">
        <div className="hero-content">
          <h1>NutriMap Kota Bogor</h1>
          <p>
            Sistem Informasi Geografis Pemantauan Ketahanan Pangan, Akses Air Bersih, dan Penanganan Stunting Terpadu.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => onNavigate('map-explorer')}>
              <MapPin size={18} /> Buka Peta Interaktif
            </button>

            <button className="outline-btn" onClick={() => onNavigate('priority-areas')}>
              <AlertOctagon size={18} /> Lihat {highRiskCount} Wilayah Prioritas
            </button>
          </div>
        </div>
        <div className="hero-stats-mini">
          <div className="h-stat-card">
            <span>Indeks Ketahanan Pangan</span>
            <strong><span ref={heroIkpRef}>{KOTA_BOGOR_STATS.skorIKP}</span> / 100</strong>
            <small className="good"><ArrowUpRight size={14} /> +1.8% tahun ini</small>
          </div>
          <div className="h-stat-card">
            <span>Prevalensi Stunting</span>
            <strong ref={heroStuntingRef}>{KOTA_BOGOR_STATS.prevalensiStunting}</strong>
            <small className="good"><ArrowDownRight size={14} /> -2.4% target 2026</small>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card emerald" onClick={() => onNavigate('food-security')}>
          <div className="sc-icon"><Utensils size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Ketahanan Pangan (IKP)</span>
            <h3 className="sc-value">
              <span ref={safeCountRef}>{safeCount}</span> dari 6 Kecamatan
            </h3>
            <span className="sc-desc font-mono">Skor Rata-Rata: 85.2 (Kategori Baik)</span>
          </div>
        </div>

        <div className="stat-card cyan" onClick={() => onNavigate('clean-water')}>
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Akses Air Bersih Layak</span>
            <h3 className="sc-value" ref={waterRef}>{KOTA_BOGOR_STATS.aksesAirBersih}</h3>
            <span className="sc-desc font-mono">Target PDAM Tirta Pakuan: 95%</span>
          </div>
        </div>

        <div className="stat-card rose" onClick={() => onNavigate('welfare')}>
          <div className="sc-icon"><HeartPulse size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prevalensi Stunting</span>
            <h3 className="sc-value" ref={stuntingRef}>{KOTA_BOGOR_STATS.prevalensiStunting}</h3>
            <span className="sc-desc font-mono">2 Kecamatan Prioritas Khusus</span>
          </div>
        </div>

        <div className="stat-card amber" onClick={() => onNavigate('priority-areas')}>
          <div className="sc-icon"><AlertOctagon size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Intervensi Prioritas</span>
            <h3 className="sc-value">
              <span ref={riskRef}>{highRiskCount}</span> Kecamatan
            </h3>
            <span className="sc-desc font-mono">Bogor Selatan, Bogor Barat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Preview & Region List */}
      <div className="dashboard-main-grid">
        {/* Map Panel */}
        <div className="dash-card map-panel">
          <div className="dash-card-head">
            <div>
              <h2>Sebaran Spasial Status Ketahanan Pangan</h2>
              <p>Klik poligon kecamatan untuk melihat data geospasial detail</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate('map-explorer')}>
              Perbesar Peta <ChevronRight size={16} />
            </button>
          </div>
          <div className="map-view-wrapper">
            <MapView
              selectedKecamatan={selectedKec}
              onSelectKecamatan={setSelectedKec}
              activeLayer="pangan"
              height="380px"
            />
          </div>
        </div>

        {/* Region Detail Panel */}
        <div className="dash-card region-detail-panel">
          <div className="dash-card-head">
            <div>
              <h2>Profil Wilayah Kecamatan</h2>
              <p>Informasi ringkas demografi dan status pangan</p>
            </div>
          </div>

          <div className="panel-content">
            <div className="p-header">
              <h3>Kecamatan {selectedKec.nama}</h3>
              <span className={`status-pill ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedKec.panganStatus}
              </span>
            </div>

            <p className="p-desc">{selectedKec.deskripsi}</p>

            <div className="p-metrics-grid">
              <div className="pm-item">
                <span>Jumlah Penduduk</span>
                <strong ref={pmPendudukRef}>{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</strong>
              </div>
              <div className="pm-item">
                <span>Skor IKP Pangan</span>
                <strong><span ref={pmIkpRef}>{selectedKec.panganSkor}</span> / 100</strong>
              </div>
              <div className="pm-item">
                <span>Akses Air Bersih</span>
                <strong ref={pmAirRef}>{selectedKec.airBersih}%</strong>
              </div>
              <div className="pm-item">
                <span>Prevalensi Stunting</span>
                <strong ref={pmStuntingRef} className={selectedKec.stunting > 15 ? 'text-danger' : ''}>{selectedKec.stunting}%</strong>
              </div>
              <div className="pm-item">
                <span>Angka Kemiskinan</span>
                <strong>{selectedKec.tingkatKemiskinan}</strong>
              </div>
              <div className="pm-item">
                <span>Jumlah Faskes</span>
                <strong ref={pmFaskesRef}>{selectedKec.faskes} Puskesmas/Klinik</strong>
              </div>
            </div>

            <div className="p-actions font-mono">
              <span>Dominan Air: <b>{selectedKec.sumberAirDominan}</b></span>
              <button
                className="primary-btn-sm"
                onClick={() => {
                  if (onSelectKecamatan) onSelectKecamatan(selectedKec);
                  onNavigate('indicator-data');
                }}
              >
                Buka Data Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Analytics Chart & Recent Indicator Table */}
      <div className="dashboard-sub-grid">
        {/* Trend Chart */}
        <div className="dash-card chart-card">
          <div className="dash-card-head">
            <div>
              <h2>Tren Indikator Utama (8 Bulan Terakhir)</h2>
              <p>Perkembangan IKP, Stunting, dan Akses Air Bersih Kota Bogor</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIKP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bulan" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Area type="monotone" dataKey="ikp" name="Indeks Pangan (IKP)" stroke="#10b981" fillOpacity={1} fill="url(#colorIKP)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="air" name="Akses Air Bersih (%)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAir)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority District Ranking */}
        <div className="dash-card ranking-card">
          <div className="dash-card-head">
            <div>
              <h2>Kecamatan Butuh Intervensi</h2>
              <p>Peringkat kerawanan tertinggi di Kota Bogor</p>
            </div>
            <button className="link-btn" onClick={() => onNavigate('priority-areas')}>
              Semua <ChevronRight size={16} />
            </button>
          </div>
          <div className="ranking-list">
            {KECAMATAN_KOTA_BOGOR.filter(k => k.prioritas === 'Sangat Tinggi' || k.prioritas === 'Tinggi' || k.prioritas === 'Sedang')
              .slice(0, 4)
              .map((kec, idx) => (
                <div key={kec.id} className="rank-item" onClick={() => setSelectedKec(kec)}>
                  <div className="rank-num">0{idx + 1}</div>
                  <div className="rank-info">
                    <strong>Kecamatan {kec.nama}</strong>
                    <span>Pusat: {kec.pusat} • Stunting: {kec.stunting}%</span>
                  </div>
                  <span className={`status-pill-sm ${kec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {kec.panganStatus}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
