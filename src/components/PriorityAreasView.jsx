import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';

export default function PriorityAreasView({ onSelectKecamatan, onNavigate }) {
  // Sort priority: Sangat Tinggi > Tinggi > Sedang > Rendah > Sangat Rendah
  const priorityOrder = { 'Sangat Tinggi': 1, 'Tinggi': 2, 'Sedang': 3, 'Rendah': 4, 'Sangat Rendah': 5 };
  const sortedList = [...KECAMATAN_KOTA_BOGOR].sort((a, b) => priorityOrder[a.prioritas] - priorityOrder[b.prioritas]);

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Prioritas Wilayah Intervensi SIG</h1>
          <p>Pemetaan tingkat urgensi penanganan masalah pangan, kesehatan, dan infrastruktur air di Kota Bogor.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Mengunduh Matrix Intervensi Prioritas (PDF)...')}>
          <Download size={16} /> Unduh Matrix Prioritas (PDF)
        </button>
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
                <th>Status Pangan</th>
                <th>Stunting</th>
                <th>Air Bersih</th>
                <th>Kemiskinan</th>
                <th>Aksi Intervensi</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((kec, idx) => (
                <tr key={kec.id} className={kec.prioritas === 'Sangat Tinggi' ? 'row-alert' : ''}>
                  <td>
                    <span className="rank-badge">#{idx + 1}</span>
                  </td>
                  <td>
                    <b>{kec.nama}</b>
                    <br />
                    <small className="muted">Pusat: {kec.pusat}</small>
                  </td>
                  <td>
                    <span className={`priority-pill ${kec.prioritas.toLowerCase().replace(/\s+/g, '-')}`}>
                      {kec.prioritas}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${kec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {kec.panganStatus}
                    </span>
                  </td>
                  <td>
                    <span className={kec.stunting > 25 ? 'text-danger fw-bold' : ''}>{kec.stunting}%</span>
                  </td>
                  <td>{kec.airBersih}%</td>
                  <td>{kec.tingkatKemiskinan}</td>
                  <td>
                    <button
                      className="table-action-btn"
                      onClick={() => {
                        if (onSelectKecamatan) onSelectKecamatan(kec);
                        onNavigate('map-explorer');
                      }}
                    >
                      Buka Peta Spasial <ArrowRight size={14} />
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
