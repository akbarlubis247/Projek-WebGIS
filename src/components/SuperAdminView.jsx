import React, { useState } from 'react';
import {
  UserPlus,
  Shield,
  Trash2,
  Edit,
  Search,
  Lock,
  Mail,
  User,
  CheckCircle,
  X,
  LogOut,
  Key,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function SuperAdminView({ admins, setAdmins, currentUser, onLogout }) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    status: 'Aktif'
  });

  const [notification, setNotification] = useState('');

  const filteredAdmins = admins.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingAdmin(null);
    setFormData({ nama: '', email: '', password: '', status: 'Aktif' });
    setShowModal(true);
  };

  const handleOpenEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      nama: admin.nama,
      email: admin.email,
      password: admin.password || '',
      status: admin.status || 'Aktif'
    });
    setShowModal(true);
  };

  const handleDeleteAdmin = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun admin "${nama}"?`)) {
      setAdmins(admins.filter((a) => a.id !== id));
      showToast(`Akun admin "${nama}" berhasil dihapus.`);
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (editingAdmin) {
      // Update existing admin
      setAdmins(
        admins.map((a) =>
          a.id === editingAdmin.id
            ? { ...a, nama: formData.nama, email: formData.email, password: formData.password, status: formData.status }
            : a
        )
      );
      showToast(`Data admin "${formData.nama}" berhasil diperbarui.`);
    } else {
      // Add new admin
      const newAdmin = {
        id: `ADM-00${admins.length + 1}`,
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        ditambahkan: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setAdmins([...admins, newAdmin]);
      showToast(`Admin baru "${formData.nama}" berhasil ditambahkan!`);
    }
    setShowModal(false);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="superadmin-container animate-fade-in">
      {/* Superadmin Top Banner */}
      <div className="superadmin-hero">
        <div className="sa-hero-left">
          <div className="sa-badge">
            <ShieldCheck size={16} /> Portal Khusus Super Admin
          </div>
          <h1>Manajemen Akun & Hak Akses Admin</h1>
          <p>
            Kelola daftar email dan kata sandi staff admin yang diberikan hak akses operasional SIG NutriMap Kota Bogor.
          </p>
        </div>

        <div className="sa-hero-right">
          <button className="primary-btn" onClick={handleOpenAddModal}>
            <UserPlus size={18} /> Tambah Admin Baru
          </button>

          <button className="logout-btn-large" onClick={onLogout}>
            <LogOut size={18} /> Keluar (Logout)
          </button>
        </div>
      </div>

      {notification && (
        <div className="alert-toast success animate-slide-down">
          <CheckCircle size={18} /> {notification}
        </div>
      )}

      {/* Admin Stats & List Table Card */}
      <div className="dash-card table-card">
        <div className="table-tools-header">
          <div className="t-search">
            <Search size={18} className="icon" />
            <input
              type="text"
              placeholder="Cari admin berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sa-total-badge">
            Total Admin Terdaftar: <strong>{admins.length} Akun</strong>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Admin</th>
                <th>Nama Lengkap Admin</th>
                <th>Alamat Email (Login)</th>
                <th>Kata Sandi</th>
                <th>Tanggal Pendaftaran</th>
                <th>Status Akses</th>
                <th style={{ textAlign: 'right' }}>Aksi Pengaturan</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-muted">{item.id}</td>
                    <td>
                      <b>{item.nama}</b>
                    </td>
                    <td className="font-mono text-emerald">{item.email}</td>
                    <td className="font-mono text-muted">
                      <code>{item.password ? '•••••••• (' + item.password + ')' : '••••••••'}</code>
                    </td>
                    <td className="text-muted">{item.ditambahkan || '01 Sep 2026'}</td>
                    <td>
                      <span className={`badge ${item.status === 'Aktif' ? 'sangat-aman' : 'sangat-rawan'}`}>
                        {item.status || 'Aktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="sa-table-actions">
                        <button
                          className="table-action-btn edit-btn"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Admin"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="table-action-btn delete-btn"
                          onClick={() => handleDeleteAdmin(item.id, item.nama)}
                          title="Hapus Admin"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Tidak ada data admin ditemukan dengan kata kunci "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin Modal */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="login-modal-card animate-zoom-in">
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>

            <div className="login-head">
              <div className="login-icon-box">
                <UserPlus size={28} className="text-emerald" />
              </div>
              <h2>{editingAdmin ? 'Edit Account Admin' : 'Tambah Admin Baru'}</h2>
              <p>Tentukan alamat email dan password untuk login admin</p>
            </div>

            <form onSubmit={handleSaveForm} className="login-form">
              <label>
                Nama Lengkap Admin *
                <div className="input-wrap">
                  <User size={18} className="i-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, ST"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                </div>
              </label>

              <label>
                Alamat Email Login *
                <div className="input-wrap">
                  <Mail size={18} className="i-icon" />
                  <input
                    type="email"
                    required
                    placeholder="admin@bogorkota.go.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </label>

              <label>
                Kata Sandi (Password) *
                <div className="input-wrap">
                  <Key size={18} className="i-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan kata sandi baru"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </label>

              <label>
                Status Akun Akses
                <select
                  className="status-select-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Aktif">Aktif (Dapat Login)</option>
                  <option value="Non-Aktif">Non-Aktif (Akses Diblokir)</option>
                </select>
              </label>

              <button type="submit" className="primary-btn login-submit-btn">
                {editingAdmin ? 'Simpan Perubahan' : 'Daftarkan Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
