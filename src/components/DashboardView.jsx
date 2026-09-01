import React, { useState } from 'react';
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

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Hero Banner */}
      <div className="dash-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <CheckCircle2 size={14} /> Official SIG Kota Bogor 2026
          </div>
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
            <strong>{KOTA_BOGOR_STATS.skorIKP} / 100</strong>
            <small className="good"><ArrowUpRight size={14} /> +1.8% tahun ini</small>
          </div>
          <div className="h-stat-card">
            <span>Prevalensi Stunting</span>
            <strong>{KOTA_BOGOR_STATS.prevalensiStunting}</strong>
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
            <h3 className="sc-value">{safeCount} dari 6 Kecamatan</h3>
            <span className="sc-desc font-mono">Skor Rata-Rata: 85.2 (Kategori Baik)</span>
          </div>
        </div>

        <div className="stat-card cyan" onClick={() => onNavigate('clean-water')}>
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Akses Air Bersih Layak</span>
            <h3 className="sc-value">{KOTA_BOGOR_STATS.aksesAirBersih}</h3>
            <span className="sc-desc font-mono">Target PDAM Tirta Pakuan: 95%</span>
          </div>
        </div>

        <div className="stat-card rose" onClick={() => onNavigate('welfare')}>
          <div className="sc-icon"><HeartPulse size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prevalensi Stunting</span>
            <h3 className="sc-value">{KOTA_BOGOR_STATS.prevalensiStunting}</h3>
            <span className="sc-desc font-mono">2 Kecamatan Prioritas Khusus</span>
          </div>
        </div>

        <div className="stat-card amber" onClick={() => onNavigate('priority-areas')}>
          <div className="sc-icon"><AlertOctagon size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Intervensi Prioritas</span>
            <h3 className="sc-value">{highRiskCount} Kecamatan</h3>
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
              <h2>Peta Persebaran Kerawanan Pangan & Stunting</h2>
              <p>Visualisasi spasial 6 Kecamatan di Kota Bogor</p>
            </div>
            <button className="link-btn" onClick={() => onNavigate('map-explorer')}>
              Layar Penuh <ChevronRight size={16} />
            </button>
          </div>
          <MapView
            selectedKecamatan={selectedKec}
            onSelectKecamatan={(kec) => {
              setSelectedKec(kec);
              if (onSelectKecamatan) onSelectKecamatan(kec);
            }}
            height="460px"
          />
        </div>

        {/* Selected Subdistrict Detail Card */}
        <div className="dash-card detail-side-panel">
          <div className="dash-card-head">
            <div>
              <h2>Detail Wilayah</h2>
              <p>Klik marker pada peta untuk informasi detail</p>
            </div>
          </div>

          <div className="kec-profile-wrap">
            <div className="profile-top">
              <span className="p-id">{selectedKec.id}</span>
              <h3>Kecamatan {selectedKec.nama}</h3>
              <span className={`status-pill ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedKec.panganStatus}
              </span>
            </div>

            <p className="p-desc">{selectedKec.deskripsi}</p>

            <div className="p-metrics-grid">
              <div className="pm-item">
                <span>Jumlah Penduduk</span>
                <strong>{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</strong>
              </div>
              <div className="pm-item">
                <span>Skor IKP Pangan</span>
                <strong>{selectedKec.panganSkor} / 100</strong>
              </div>
              <div className="pm-item">
                <span>Akses Air Bersih</span>
                <strong>{selectedKec.airBersih}%</strong>
              </div>
              <div className="pm-item">
                <span>Prevalensi Stunting</span>
                <strong className={selectedKec.stunting > 15 ? 'text-danger' : ''}>{selectedKec.stunting}%</strong>
              </div>
              <div className="pm-item">
                <span>Angka Kemiskinan</span>
                <strong>{selectedKec.tingkatKemiskinan}</strong>
              </div>
              <div className="pm-item">
                <span>Jumlah Faskes</span>
                <strong>{selectedKec.faskes} Puskesmas/Klinik</strong>
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
