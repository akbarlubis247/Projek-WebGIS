import React from 'react';
import { HeartPulse, Users, ShieldAlert, Award, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_DATA } from '../data/bogorData';

export default function WelfareView() {
  const sortedByStunting = [...KECAMATAN_DATA].sort((a, b) => b.stunting - a.stunting);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Detail Kesejahteraan & Prevalensi Stunting</h1>
          <p>Pemantauan tingkat stunting balita, kemiskinan ekstrem, dan penyaluran bantuan sosial Kabupaten Bogor.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Mengunduh Laporan Stunting PDF...')}>
          <Download size={16} /> Export Data Stunting (PDF)
        </button>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card rose">
          <div className="sc-icon"><HeartPulse size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Stunting Bogor</span>
            <h3 className="sc-value">18.2% Balita</h3>
            <span className="sc-desc">Target Nasional 2026: 14%</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><ShieldAlert size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Stunting Tinggi (&gt;25%)</span>
            <h3 className="sc-value">5 Kecamatan</h3>
            <span className="sc-desc">Nanggung (31.2%), Tenjo (29.4%), Pamijahan (28.5%)</span>
          </div>
        </div>
        <div className="stat-card emerald">
          <div className="sc-icon"><Award size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Bebas Stunting (&lt;10%)</span>
            <h3 className="sc-value">2 Kecamatan</h3>
            <span className="sc-desc">Gunung Putri (8.5%), Cibinong (9.8%)</span>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Prevalensi Stunting per Kecamatan (%)</h2>
            <p>Kecamatan dengan warna merah memerlukan percepatan pemberian makanan tambahan (PMT)</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByStunting} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 40]} unit="%" />
              <YAxis dataKey="nama" type="category" stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="stunting" name="Prevalensi Stunting (%)" radius={[0, 4, 4, 0]}>
                {sortedByStunting.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.stunting > 25 ? '#ef4444' : entry.stunting > 15 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
