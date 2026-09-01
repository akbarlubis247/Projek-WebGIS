import React from 'react';
import { Utensils, ShieldCheck, AlertTriangle, TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_DATA } from '../data/bogorData';

export default function FoodSecurityView() {
  const sortedByIKP = [...KECAMATAN_DATA].sort((a, b) => b.panganSkor - a.panganSkor);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Detail Ketahanan Pangan (IKP)</h1>
          <p>Pemantauan Indeks Ketahanan Pangan, ketersediaan beras, dan stabilitas harga pasar Kabupaten Bogor.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Mencetak Laporan PDF Ketahanan Pangan...')}>
          <Download size={16} /> Export Laporan IKP (PDF)
        </button>
      </div>

      {/* Overview Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card emerald">
          <div className="sc-icon"><Utensils size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Skor IKP</span>
            <h3 className="sc-value">75.8 / 100</h3>
            <span className="sc-desc">Peringkat 6 di Jawa Barat</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><ShieldCheck size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Status Aman</span>
            <h3 className="sc-value">6 Kecamatan</h3>
            <span className="sc-desc">Cibinong, Gunung Putri, Dramaga, dll.</span>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Status Rawan</span>
            <h3 className="sc-value">5 Kecamatan</h3>
            <span className="sc-desc">Nanggung, Pamijahan, Leuwiliang, Tenjo, Rumpin</span>
          </div>
        </div>
      </div>

      {/* Chart Ranking */}
      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Peringkat Skor Indeks Ketahanan Pangan per Kecamatan</h2>
            <p>Skor IKP diukur berdasarkan Ketersediaan, Keterjangkauan, dan Pemanfaatan Pangan</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByIKP} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="nama" type="category" stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="panganSkor" name="Skor IKP" radius={[0, 4, 4, 0]}>
                {sortedByIKP.map((entry, index) => {
                  const color = entry.panganSkor > 85 ? '#10b981' : entry.panganSkor > 70 ? '#06b6d4' : entry.panganSkor > 60 ? '#f59e0b' : '#ef4444';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
