import React from 'react';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, Download, FileText } from 'lucide-react';
import { SECURITY_AUDITS } from '../data/bogorData';

export default function FoodSafetyMgmtView() {
  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Manajemen Keamanan Pangan (Export PDF/CSV)</h1>
          <p>Hasil sidak laboratorium, residu kimia pestisida, dan pengawasan kualitas bahan segar di pasar tradisional Bogor.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Export Log Keamanan Pangan PDF...')}>
          <Download size={16} /> Unduh Laporan Pengawasan (PDF)
        </button>
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
            <h3 className="sc-value">Batas Safe (BMR)</h3>
            <span className="sc-desc">Laboratorium Uji Terpadu IPB</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Peringatan Kios Pasar</span>
            <h3 className="sc-value">2 Kasus Formalin</h3>
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
                <th>Petugas Pemeriksa</th>
                <th>Status Audit</th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_AUDITS.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-muted">{item.id}</td>
                  <td><b>{item.lokasi}</b></td>
                  <td>{item.tanggal}</td>
                  <td>{item.jenis}</td>
                  <td>{item.hasil}</td>
                  <td>{item.pemeriksa}</td>
                  <td>
                    <span className={`badge ${item.status === 'Terverifikasi' ? 'sangat-aman' : 'waspada'}`}>
                      {item.status}
                    </span>
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
