import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { Droplets, CheckCircle, AlertCircle, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';
import pdamFacilityImg from '../assets/pdam-facility.jpg';

export default function CleanWaterView() {
  const sortedByAir = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => b.airBersih - a.airBersih);

  const avgAirRef = useRef(null);
  const southAirRef = useRef(null);
  const heroProdRef = useRef(null);
  const heroKecRef = useRef(null);

  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.2, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(avgAirRef, 90.8, { decimalPlaces: 1, suffix: '%' });
    anim(southAirRef, 81.5, { decimalPlaces: 1, suffix: '%' });
    anim(heroProdRef, 2400, { formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' L/detik' });
    anim(heroKecRef, 6);
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
            <span className="sc-desc">Target RPJMD Kota Bogor 2026: 95%</span>
          </div>
        </div>
        <div className="stat-card emerald">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Cakupan Tertinggi (&gt;95%)</span>
            <h3 className="sc-value">Bogor Tengah & Bogor Timur</h3>
            <span className="sc-desc">Sistem Perpipaan PDAM Tirta Pakuan</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><AlertCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Cakupan Perhatian (&lt;85%)</span>
            <h3 className="sc-value">Bogor Selatan (<span ref={southAirRef}>81.5%</span>)</h3>
            <span className="sc-desc">Masih Membutuhkan Perluasan Jaringan PDAM</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Fasilitas PDAM */}
      <div className="cleanwater-hero-card">
        <div className="cwh-image-wrap">
          <img
            src={pdamFacilityImg}
            alt="Instalasi Pengolahan Air Bersih PDAM Tirta Pakuan Kota Bogor"
            className="cwh-img"
          />
        </div>
        <div className="cwh-body">
          <span className="cwh-tag">Perumda Tirta Pakuan Kota Bogor</span>
          <h2>Instalasi Pengolahan Air (IPA) Terpadu</h2>
          <p>
            Pusat penjernihan air baku menjadi air minum berkualitas tinggi yang disalurkan melalui jaringan perpipaan ke seluruh kecamatan Kota Bogor. Pemantauan geospasial dilakukan guna menjaga keandalan kontinuitas debit serta mutu fisik-kimiawi air secara real-time.
          </p>
          <div className="cwh-specs">
            <div className="spec-box">
              <span className="sb-val" ref={heroProdRef}>2.400 L/detik</span>
              <span className="sb-lbl">Total Kapasitas Produksi</span>
            </div>
            <div className="spec-box">
              <span className="sb-val"><span ref={heroKecRef}>6</span> Kecamatan</span>
              <span className="sb-lbl">Cakupan Wilayah Terlayani</span>
            </div>
            <div className="spec-box">
              <span className="sb-val">Permenkes 2/2023</span>
              <span className="sb-lbl">Standar Baku Mutu Air</span>
            </div>
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
