import React from 'react';
import { UserCheck, Shield, Plus, Key, CheckCircle, Lock } from 'lucide-react';
import { USER_ROLES } from '../data/bogorData';

export default function AdminDashboardView({ currentUser }) {
  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard & Manajemen Pengguna</h1>
          <p>Pengaturan hak akses, peran sistem (Role-Based Access Control), dan riwayat login pengguna NutriMap.</p>
        </div>
        <button className="primary-btn-sm" onClick={() => alert('Buka Form Tambah Pengguna Baru')}>
          <Plus size={16} /> Tambah Pengguna Baru
        </button>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card emerald">
          <div className="sc-icon"><UserCheck size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Pengguna Aktif Sistem</span>
            <h3 className="sc-value">12 Akun Terverifikasi</h3>
            <span className="sc-desc">Bappeda, Dinas Pangan, Analis IPB</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><Shield size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Level Hak Akses</span>
            <h3 className="sc-value">4 Peran (Roles)</h3>
            <span className="sc-desc">Super Admin, Surveyor, Analis, Public</span>
          </div>
        </div>
        <div className="stat-card rose">
          <div className="sc-icon"><Lock size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Keamanan Sesi</span>
            <h3 className="sc-value">Enkripsi SHA-256</h3>
            <span className="sc-desc">Token JWT Sesi Aktif</span>
          </div>
        </div>
      </div>

      <div className="dash-card table-card">
        <div className="dash-card-head">
          <div>
            <h2>Daftar Pengguna Pengelola SIG NutriMap Bogor</h2>
            <p>Pengelola dengan akses input data spasial dan verifikasi indikator</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pengguna</th>
                <th>Alamat Email</th>
                <th>Peran Access Role</th>
                <th>Instansi / Lembaga</th>
                <th>Status Account</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {USER_ROLES.map((u, i) => (
                <tr key={u.id}>
                  <td>0{i + 1}</td>
                  <td><b>{u.nama}</b></td>
                  <td className="font-mono text-muted">{u.email}</td>
                  <td>
                    <span className="role-pill font-mono">{u.role}</span>
                  </td>
                  <td>{u.instansi}</td>
                  <td>
                    <span className="badge sangat-aman">{u.status}</span>
                  </td>
                  <td>
                    <button className="table-action-btn" onClick={() => alert(`Mengedit hak akses untuk ${u.nama}`)}>
                      Kelola Hak Akses
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
