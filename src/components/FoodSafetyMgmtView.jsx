import React from 'react';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, FileSpreadsheet, FileText } from 'lucide-react';
import { SECURITY_AUDITS } from '../data/bogorData';

export default function FoodSafetyMgmtView() {
  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Manajemen Keamanan Pangan</h1>
        <div className="export-action-group">
          <button className="btn-export-excel" onClick={() => alert('Unduh CSV/Excel Log Keamanan Pangan...')}>
            <FileSpreadsheet size={16} /> Unduh CSV / Excel
          </button>
          <button className="btn-export-pdf" onClick={() => alert('Export Log Keamanan Pangan Kota Bogor (PDF)...')}>
            <FileText size={16} /> Export PDF / Laporan
          </button>
        </div>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card emerald">
          <div className="sc-icon"><ShieldCheck size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Total Inspeksi Pasar (2026)</span>
            <h3 className="sc-value">48 Lokasi Pasar</h3>
            <span className="sc-desc">96% Sampel Memenuhi Standar BPOM</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Uji Lab Residu Pestisida</span>
            <h3 className="sc-value">120 Sampel Sayur</h3>
            <span className="sc-desc">Tingkat Keamanan 98% Layak Konsumsi</span>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Temuan Pengawet Berbahaya</span>
            <h3 className="sc-value">2 Pelanggaran</h3>
            <span className="sc-desc">Telah Diberikan Pembinaan & Sanksi</span>
          </div>
        </div>
      </div>

      <div className="dash-card table-card">
        <div className="dash-card-head">
          <div>
            <h2>Log Hasil Inspeksi Keamanan Pangan Terbaru</h2>
            <p>Data pemeriksaan berkala oleh Dinas Ketahanan Pangan & Satgas Pangan Kota Bogor</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Audit</th>
                <th>Lokasi Inspeksi</th>
                <th>Tanggal</th>
                <th>Jenis Pengujian</th>
                <th>Hasil Laboratorium</th>
                <th>Status Audit</th>
                <th>Petugas Pemeriksa</th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_AUDITS.map((audit) => (
                <tr key={audit.id}>
                  <td><b>{audit.id}</b></td>
                  <td><strong>{audit.lokasi}</strong></td>
                  <td>{audit.tanggal}</td>
                  <td>{audit.jenis}</td>
                  <td><span className="text-emerald font-bold">{audit.hasil}</span></td>
                  <td><span className="status-pill aman">{audit.status}</span></td>
                  <td><small className="text-muted">{audit.pemeriksa}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
