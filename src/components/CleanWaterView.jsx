import React from 'react';
import { Droplets, CheckCircle, AlertCircle, Building, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_DATA } from '../data/bogorData';

export default function CleanWaterView() {
  const sortedByAir = [...KECAMATAN_DATA].sort((a, b) => b.airBersih - a.airBersih);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Detail Akses Air Bersih & Sanitasi</h1>
          <p>Pemantauan cakupan perpipaan PDAM Tirta Kahuripan, sumur terlindung, dan kualitas sanitasi perdesaan.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Export Data Air Bersih PDF...')}>
          <Download size={16} /> Export Data Sanitasi (PDF)
        </button>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card cyan">
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Akses Air Layak</span>
            <h3 className="sc-value">81.4% Populasi</h3>
            <span className="sc-desc">Target RPJMD 2026: 85%</span>
          </div>
        </div>
        <div className="stat-card emerald">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Cakupan Tertinggi (&gt;90%)</span>
            <h3 className="sc-value">Gunung Putri & Cibinong</h3>
            <span className="sc-desc">Sistem Perpipaan PDAM Terpadu</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><AlertCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Cakupan Terendah (&lt;60%)</span>
            <h3 className="sc-value">Nanggung & Tenjo</h3>
            <span className="sc-desc">Masih Membutuhkan Program PAMSIMAS</span>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Cakupan Akses Air Bersih Layak per Kecamatan (%)</h2>
            <p>Kecamatan di bawah 70% memerlukan percepatan pembangunan jaringan perpipaan desa</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByAir} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis dataKey="nama" type="category" stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="airBersih" name="Air Bersih (%)" radius={[0, 4, 4, 0]}>
                {sortedByAir.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.airBersih > 85 ? '#06b6d4' : entry.airBersih > 70 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
