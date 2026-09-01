import React from 'react';
import { Droplets, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';

export default function CleanWaterView() {
  const sortedByAir = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => b.airBersih - a.airBersih);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Detail Akses Air Bersih & Sanitasi</h1>
          <p>Pemantauan cakupan perpipaan PDAM Tirta Pakuan, sumur terlindung, dan kualitas sanitasi Kota Bogor.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Export Data Air Bersih Kota Bogor (PDF)...')}>
          <Download size={16} /> Export Data Sanitasi (PDF)
        </button>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card cyan">
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Akses Air Layak</span>
            <h3 className="sc-value">90.8% Populasi</h3>
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
            <h3 className="sc-value">Bogor Selatan (81.5%)</h3>
            <span className="sc-desc">Masih Membutuhkan Perluasan Jaringan PDAM</span>
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
