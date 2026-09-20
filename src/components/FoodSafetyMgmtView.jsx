import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, FileSpreadsheet, FileText } from 'lucide-react';
import { SECURITY_AUDITS } from '../data/bogorData';
import foodInspectionImg from '../assets/food-inspection.jpg';

export default function FoodSafetyMgmtView() {
  const auditCountRef = useRef(null);
  const labCountRef = useRef(null);
  const violationCountRef = useRef(null);
  const heroAuditRef = useRef(null);
  const heroBpomRef = useRef(null);
  const heroPasarRef = useRef(null);

  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 1.2, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(auditCountRef, 48);
    anim(labCountRef, 120);
    anim(violationCountRef, 2);
    anim(heroAuditRef, 48);
    anim(heroBpomRef, 96, { suffix: '%' });
    anim(heroPasarRef, 4);
  }, []);

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
            <h3 className="sc-value"><span ref={auditCountRef}>48</span> Lokasi Pasar</h3>
            <span className="sc-desc">96% Sampel Memenuhi Standar BPOM</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Uji Lab Residu Pestisida</span>
            <h3 className="sc-value"><span ref={labCountRef}>120</span> Sampel Sayur</h3>
            <span className="sc-desc">Tingkat Keamanan 98% Layak Konsumsi</span>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="sc-icon"><AlertTriangle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Temuan Pengawet Berbahaya</span>
            <h3 className="sc-value"><span ref={violationCountRef}>2</span> Pelanggaran</h3>
            <span className="sc-desc">Telah Diberikan Pembinaan & Sanksi</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Inspeksi Pasar Tradisional */}
      <div className="food-hero-card">
        <div className="fhc-image-wrap">
          <img
            src={foodInspectionImg}
            alt="Inspeksi Bahan Pangan Terpadu di Pasar Tradisional Kota Bogor"
            className="fhc-img"
          />
        </div>
        <div className="fhc-body">
          <span className="fhc-tag">Satgas Ketahanan Pangan & BPOM Kota Bogor</span>
          <h2>Inspeksi Pangan Terpadu di Pasar Tradisional</h2>
          <p>
            Pengawasan berkala dan pengambilan sampel acak komoditas pangan segar (sayuran, cabai, daging ayam, ikan, dan bahan pokok) di pasar-pasar tradisional Kota Bogor (Pasar Anyar, Pasar Bogor, Pasar Sukasari, dan Pasar Induk TU Kemang) guna menjamin standar keamanan pangan bebas formalin dan residu berbahaya.
          </p>
          <div className="fhc-specs">
            <div className="spec-box emerald">
              <span className="sb-val"><span ref={heroAuditRef}>48</span> Lokasi</span>
              <span className="sb-lbl">Total Audit Pasar 2026</span>
            </div>
            <div className="spec-box cyan">
              <span className="sb-val"><span ref={heroBpomRef}>96%</span> Lolos</span>
              <span className="sb-lbl">Standar Higienis BPOM</span>
            </div>
            <div className="spec-box amber">
              <span className="sb-val"><span ref={heroPasarRef}>4</span> Pasar Utama</span>
              <span className="sb-lbl">Fokus Pengawasan Rutin</span>
            </div>
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
                  <td><span className="audit-id-badge">{audit.id}</span></td>
                  <td><strong>{audit.lokasi}</strong></td>
                  <td>{audit.tanggal}</td>
                  <td>{audit.jenis}</td>
                  <td>
                    <span className={`audit-result-tag ${audit.hasil.includes('Lolos') || audit.hasil.includes('Aman') ? 'pass' : 'warning'}`}>
                      <CheckCircle size={14} />
                      {audit.hasil}
                    </span>
                  </td>
                  <td><span className="status-pill aman">{audit.status}</span></td>
                  <td><span className="text-muted" style={{ fontSize: '0.78rem' }}>{audit.pemeriksa}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
