import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { Droplets, CheckCircle, AlertCircle, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';
import pdamFacilityImg from '../assets/pdam-facility.jpg';

export default function CleanWaterView() {
  const sortedByAir = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => b.airBersih - a.airBersih);

  const avgAirRef = useRef(null);

  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.2, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(avgAirRef, 90.8, { decimalPlaces: 1, suffix: '%' });
  }, []);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Detail Akses Air Bersih & Sanitasi</h1>
        <div className="export-action-group">
          <button className="btn-export-excel" onClick={() => alert('Unduh CSV/Excel Data Air Bersih Kota Bogor...')}>
            <FileSpreadsheet size={16} /> Unduh CSV / Excel
          </button>
          <button className="btn-export-pdf" onClick={() => alert('Export Data Air Bersih Kota Bogor (PDF)...')}>
            <FileText size={16} /> Export PDF / Laporan
          </button>
        </div>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card cyan">
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Akses Air Layak</span>
            <h3 className="sc-value"><span ref={avgAirRef}>90.8%</span> Populasi</h3>
            <span className="sc-desc">Nilai contoh · perlu sumber dan tahun data</span>
          </div>
        </div>
        <div className="stat-card emerald">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Ringkasan nilai tertinggi pada data contoh</span>
            <h3 className="sc-value">Data ilustratif</h3>
            <span className="sc-desc">Bukan peta cakupan jaringan PDAM</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><AlertCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Perlu validasi lebih lanjut</span>
            <h3 className="sc-value">Data ilustratif</h3>
            <span className="sc-desc">Tidak menyimpulkan kebutuhan perluasan layanan</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Fasilitas PDAM */}
      <div className="cleanwater-hero-card">
        <div className="cwh-image-wrap">
          <img
            src={pdamFacilityImg}
            alt="Ilustrasi fasilitas air untuk rancangan tampilan NutriMap"
            className="cwh-img"
          />
        </div>
        <div className="cwh-body">
          <span className="cwh-tag">Layer fasilitas · belum diverifikasi</span>
          <h2>Air bersih: indikator dan aset perlu dibedakan.</h2>
          <p>
            Ilustrasi fasilitas pengolahan air untuk kebutuhan desain. Lokasi fasilitas, jaringan perpipaan, cakupan pelayanan, debit, dan mutu air belum dipetakan pada prototipe ini dan memerlukan data resmi.
          </p>
          <div className="cwh-specs">
            <div className="spec-box"><span className="sb-val">Titik fasilitas</span><span className="sb-lbl">Menunggu lokasi terverifikasi</span></div>
            <div className="spec-box"><span className="sb-val">Jaringan pipa</span><span className="sb-lbl">Tidak tersedia di peta ini</span></div>
            <div className="spec-box"><span className="sb-val">Cakupan layanan</span><span className="sb-lbl">Perlu data resmi terpisah</span></div>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Cakupan Akses Air Bersih Layak per Kecamatan (%)</h2>
            <p>Data persentase rumah tangga terlayani air bersih Kota Bogor</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByAir} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nama" stroke="#64748b" interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} stroke="#64748b" unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="airBersih" name="Air Bersih (%)" radius={[6, 6, 0, 0]}>
                {sortedByAir.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.airBersih >= 90 ? '#06b6d4' : entry.airBersih >= 85 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
