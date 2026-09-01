import React from 'react';
import { Utensils, ShieldCheck, AlertTriangle, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';

export default function FoodSecurityView() {
  const sortedByIKP = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => b.panganSkor - a.panganSkor);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Detail Ketahanan Pangan (IKP)</h1>
        <div className="export-action-group">
          <button className="btn-export-excel" onClick={() => alert('Unduh CSV/Excel Data Ketahanan Pangan...')}>
            <FileSpreadsheet size={16} /> Unduh CSV / Excel
          </button>
          <button className="btn-export-pdf" onClick={() => alert('Mencetak Laporan PDF Ketahanan Pangan Kota Bogor...')}>
            <FileText size={16} /> Export PDF / Laporan
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card emerald">
          <div className="sc-icon"><Utensils size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Rata-Rata Skor IKP</span>
            <h3 className="sc-value">85.2 / 100</h3>
            <span className="sc-desc">Peringkat Top 3 di Jawa Barat</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><ShieldCheck size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Status Aman & Sangat Aman</span>
            <h3 className="sc-value">4 Kecamatan</h3>
            <span className="sc-desc">Bogor Tengah, Bogor Utara, Bogor Timur, Tanah Sareal</span>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Wilayah Status Perhatian (Waspada)</span>
            <h3 className="sc-value">2 Kecamatan</h3>
            <span className="sc-desc">Bogor Selatan (74.2), Bogor Barat (78.6)</span>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <div>
            <h2>Peringkat Skor Indeks Ketahanan Pangan (IKP) per Kecamatan</h2>
            <p>Data IKP Kota Bogor Tahun 2026 (0 = Rawan, 100 = Sangat Aman)</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={sortedByIKP} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nama" stroke="#64748b" interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="panganSkor" name="Skor IKP" radius={[6, 6, 0, 0]}>
                {sortedByIKP.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.panganSkor >= 90 ? '#10b981' : entry.panganSkor >= 80 ? '#06b6d4' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
