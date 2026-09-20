import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { HeartPulse, Users, ShieldAlert, Award, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';
import stuntingImg from '../assets/stunting-prevention.jpg';

export default function WelfareView() {
  const sortedByStunting = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => b.stunting - a.stunting);

  const avgStuntingRef = useRef(null);
  const warnKecRef = useRef(null);
  const lowKecRef = useRef(null);
  const heroStuntingRef = useRef(null);
  const heroTargetRef = useRef(null);
  const heroPosyanduRef = useRef(null);

  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.2, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(avgStuntingRef, 12.4, { decimalPlaces: 1, suffix: '%' });
    anim(warnKecRef, 2);
    anim(lowKecRef, 1);
    anim(heroStuntingRef, 12.4, { decimalPlaces: 1, suffix: '%' });
    anim(heroTargetRef, 10, { suffix: '%' });
    anim(heroPosyanduRef, 863);
  }, []);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Detail Kesejahteraan & Prevalensi Stunting</h1>
        <div className="export-action-group">
          <button className="btn-export-excel" onClick={() => alert('Unduh CSV/Excel Data Stunting Kota Bogor...')}>
            <FileSpreadsheet size={16} /> Unduh CSV / Excel
          </button>
          <button className="btn-export-pdf" onClick={() => alert('Mengunduh Laporan Stunting Kota Bogor (PDF)...')}>
            <FileText size={16} /> Export PDF / Laporan
          </button>
        </div>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card rose">
          <div className="sc-icon"><HeartPulse size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Stunting Kota Bogor</span>
            <h3 className="sc-value"><span ref={avgStuntingRef}>12.4%</span> Balita</h3>
            <span className="sc-desc">Target Kota Bogor 2026: &lt;10%</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><ShieldAlert size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Stunting Perhatian (&gt;15%)</span>
            <h3 className="sc-value"><span ref={warnKecRef}>2</span> Kecamatan</h3>
            <span className="sc-desc">Bogor Selatan (19.8%), Bogor Barat (17.5%)</span>
          </div>
        </div>
        <div className="stat-card emerald">
          <div className="sc-icon"><Award size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Stunting Rendah (&lt;10%)</span>
            <h3 className="sc-value"><span ref={lowKecRef}>1</span> Kecamatan</h3>
            <span className="sc-desc">Bogor Tengah (8.4%)</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Sosialisasi Stunting */}
      <div className="welfare-hero-card">
        <div className="whc-image-wrap">
          <img
            src={stuntingImg}
            alt="Sosialisasi Pencegahan Stunting Kota Bogor di Posyandu"
            className="whc-img"
          />
        </div>
        <div className="whc-body">
          <span className="whc-tag">Dinas Kesehatan & Gerakan Posyandu Kota Bogor</span>
          <h2>Sosialisasi Terpadu Pencegahan Stunting Balita</h2>
          <p>
            Pendampingan intensif bagi ibu dan balita melalui penimbangan rutin, pengukuran kurva pertumbuhan antropometri, edukasi pola asuh gizi seimbang, serta distribusi paket pangan padat gizi (PMT). Intervensi difokuskan secara geospasial pada kelurahan dengan angka prevalensi balita di atas ambang batas.
          </p>
          <div className="whc-specs">
            <div className="spec-box rose">
              <span className="sb-val" ref={heroStuntingRef}>12.4%</span>
              <span className="sb-lbl">Rata-Rata Kota Bogor</span>
            </div>
            <div className="spec-box amber">
              <span className="sb-val">&lt; <span ref={heroTargetRef}>10%</span></span>
              <span className="sb-lbl">Target RPJMD 2026</span>
            </div>
            <div className="spec-box emerald">
              <span className="sb-val"><span ref={heroPosyanduRef}>863</span> Posyandu</span>
              <span className="sb-lbl">Layanan Pemantauan Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Grafik Perbandingan Prevalensi Stunting per Kecamatan (%)</h2>
            <p>Data urut dari angka stunting tertinggi di Kota Bogor</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByStunting} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nama" stroke="#64748b" interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="stunting" name="Stunting (%)" radius={[6, 6, 0, 0]}>
                {sortedByStunting.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.stunting > 15 ? '#ef4444' : entry.stunting > 12 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
