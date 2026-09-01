import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle, FileSpreadsheet, FileText } from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';

export default function PriorityAreasView({ onSelectKecamatan, onNavigate }) {
  const priorityOrder = { 'Sangat Tinggi': 1, 'Tinggi': 2, 'Sedang': 3, 'Rendah': 4, 'Sangat Rendah': 5 };
  const sortedList = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => priorityOrder[a.prioritas] - priorityOrder[b.prioritas]);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Prioritas Wilayah Intervensi SIG</h1>
        <div className="export-action-group">
          <button className="btn-export-excel" onClick={() => alert('Unduh CSV/Excel Matrix Prioritas Kota Bogor...')}>
            <FileSpreadsheet size={16} /> Unduh CSV / Excel
          </button>
          <button className="btn-export-pdf" onClick={() => alert('Mengunduh Matrix Intervensi Prioritas (PDF)...')}>
            <FileText size={16} /> Export PDF / Laporan
          </button>
        </div>
      </div>

      {/* Priority Matrix Summary Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card rose">
          <div className="sc-icon"><AlertOctagon size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prioritas 1 (Sangat Tinggi / Waspada)</span>
            <h3 className="sc-value">1 Kecamatan</h3>
            <span className="sc-desc">Bogor Selatan (Skor IKP 74.2, Stunting 19.8%)</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prioritas 2 (Tinggi / Perhatian)</span>
            <h3 className="sc-value">1 Kecamatan</h3>
            <span className="sc-desc">Bogor Barat (Skor IKP 78.6, Stunting 17.5%)</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prioritas 3 (Aman & Sangat Aman)</span>
            <h3 className="sc-value">4 Kecamatan</h3>
            <span className="sc-desc">Bogor Tengah, Bogor Utara, Bogor Timur, Tanah Sareal</span>
          </div>
        </div>
      </div>

      {/* Priority Table */}
      <div className="dash-card table-card">
        <div className="dash-card-head">
          <div>
            <h2>Matriks Penilaian Intervensi Wilayah</h2>
            <p>Disusun berdasarkan kombinasi Skor IKP, Stunting, Air Bersih, dan Angka Kemiskinan</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Peringkat</th>
                <th>Kecamatan</th>
                <th>Tingkat Prioritas</th>
                <th>Skor IKP</th>
                <th>Stunting</th>
                <th>Akses Air</th>
                <th>Rekomendasi Program Intervensi</th>
                <th>Aksi Spasial</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((kec, idx) => (
                <tr key={kec.id}>
                  <td><b>#0{idx + 1}</b></td>
                  <td>
                    <strong>Kecamatan {kec.nama}</strong>
                    <br />
                    <small className="text-muted">Pusat: {kec.pusat}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${kec.prioritas.toLowerCase().replace(/\s+/g, '-')}`}>
                      {kec.prioritas}
                    </span>
                  </td>
                  <td><b>{kec.panganSkor}</b> / 100</td>
                  <td className={kec.stunting > 15 ? 'text-danger font-bold' : ''}>{kec.stunting}%</td>
                  <td>{kec.airBersih}%</td>
                  <td>
                    <small className="font-mono">
                      {kec.prioritas === 'Sangat Tinggi'
                        ? 'Bantuan Beras + Program PMT Stunting Intensif + Perluasan PDAM'
                        : kec.prioritas === 'Tinggi'
                        ? 'Peningkatan Faskes + Monitoring Pasar Tradisional'
                        : 'Pemeliharaan Logistik & Sanitasi Terpadu'}
                    </small>
                  </td>
                  <td>
                    <button
                      className="primary-btn-sm"
                      onClick={() => {
                        if (onSelectKecamatan) onSelectKecamatan(kec);
                        onNavigate('map-explorer');
                      }}
                    >
                      Focus Peta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
