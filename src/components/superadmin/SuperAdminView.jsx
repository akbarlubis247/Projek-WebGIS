import React, { useState, useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import {
  UserPlus,
  Trash2,
  Edit,
  Search,
  Mail,
  User,
  CheckCircle,
  X,
  Key,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Activity,
  Building2,
  Power,
  ArrowLeft
} from 'lucide-react';
import {
  listAuditLogsApi,
  listUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi
} from '../../services/api';

export default function SuperAdminView({ currentUser, onNavigate }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    agency: 'Bappeda Kota Bogor',
    is_active: true,
  });

  const adminCountRef = useRef(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3800);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');
    try {
      const res = await listUsersApi();
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setUsersError(err.message || 'Gagal memuat daftar akun dari Supabase');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingLogs(true);
    setLogsError('');
    try {
      const res = await listAuditLogsApi({ limit: 30 });
      setAuditLogs(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setLogsError(err.message || 'Gagal memuat audit log backend');
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadUsers(), loadAuditLogs()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (adminCountRef.current) {
      const cu = new CountUp(adminCountRef.current, users.length, { startVal: 0, duration: 0.8, useEasing: true });
      if (!cu.error) cu.start();
    }
  }, [users.length]);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.agency || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter((u) => u.is_active !== false).length;
  const superadminCount = users.filter((u) => u.role === 'superadmin').length;

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setModalError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      agency: 'Bappeda Kota Bogor',
      is_active: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setModalError('');
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'admin',
      agency: user.agency || 'Pemerintah Kota Bogor',
      is_active: user.is_active !== false,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (user) => {
    if (Number(user.id) === Number(currentUser?.id)) {
      setUsersError('Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang login.');
      return;
    }
    try {
      const nextState = user.is_active === false;
      await updateUserApi(user.id, { is_active: nextState });
      showToast(`Akun "${user.name}" berhasil ${nextState ? 'diaktifkan' : 'dinonaktifkan'} di Supabase.`);
      await refreshAll();
    } catch (err) {
      setUsersError(err.message || 'Gagal mengubah status akun');
    }
  };

  const handleDeleteUser = async (user) => {
    if (Number(user.id) === Number(currentUser?.id)) {
      setUsersError('Anda tidak dapat menghapus akun Anda sendiri yang sedang login.');
      return;
    }
    if (!window.confirm(`Apakah Anda yakin ingin menghapus permanen akun "${user.name}" (${user.email}) dari Supabase?`)) {
      return;
    }
    try {
      await deleteUserApi(user.id);
      showToast(`Akun "${user.name}" berhasil dihapus dari database.`);
      await refreshAll();
    } catch (err) {
      setUsersError(err.message || 'Gagal menghapus akun');
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSaving(true);
    try {
      if (editingUser) {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          agency: formData.agency.trim(),
          is_active: formData.is_active,
        };
        if (formData.password.trim()) {
          payload.password = formData.password;
        }
        await updateUserApi(editingUser.id, payload);
        showToast(`Data akun "${payload.name}" berhasil diperbarui di Supabase.`);
      } else {
        await createUserApi({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          agency: formData.agency.trim(),
          is_active: formData.is_active,
        });
        showToast(`Akun baru "${formData.name.trim()}" (${formData.role}) berhasil disimpan ke Supabase!`);
      }
      setShowModal(false);
      await refreshAll();
    } catch (err) {
      setModalError(err.message || 'Gagal menyimpan data akun ke server');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="superadmin-container animate-fade-in">
      {/* Superadmin Top Banner */}
      <div className="superadmin-hero">
        <div className="sa-hero-left">
          <div className="sa-badge">
            <ShieldCheck size={16} /> Portal Tata Kelola Akun &amp; Audit Supabase
          </div>
          <h1 className="page-title-editorial">
            Manajemen Akun &amp; Hak Akses Sistem
          </h1>
          <p>
            Seluruh akun pengelola SIG NutriMap tersimpan terenkripsi (bcrypt) di tabel <code>users</code> Supabase PostgreSQL dan tercatat pada Audit Trail sistem.
          </p>
        </div>

        <div className="sa-hero-right" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {onNavigate && (
            <button type="button" className="outline-btn" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft size={16} /> Dashboard Eksekutif
            </button>
          )}
          <button type="button" className="primary-btn" onClick={handleOpenAddModal}>
            <UserPlus size={18} /> Tambah Akun Baru
          </button>
        </div>
      </div>

      {notification && (
        <div className="alert-toast success animate-slide-down">
          <CheckCircle size={18} /> {notification}
        </div>
      )}

      {usersError && (
        <div className="alert-toast" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', marginBottom: 16 }}>
          <AlertCircle size={18} /> {usersError}
        </div>
      )}

      {/* Ringkasan Akun Live */}
      <div className="stat-cards-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card emerald">
          <div className="sc-icon"><User size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Total Akun Terdaftar</span>
            <h3 className="sc-value"><span ref={adminCountRef}>{users.length}</span> Akun</h3>
            <span className="sc-desc">Tabel Supabase <code>public.users</code></span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="sc-icon"><CheckCircle size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Status Aktif / Non-Aktif</span>
            <h3 className="sc-value">{activeCount} Aktif / {users.length - activeCount} Non-Aktif</h3>
            <span className="sc-desc">Kontrol akses login JWT real-time</span>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="sc-icon"><ShieldCheck size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Distribusi Role RBAC</span>
            <h3 className="sc-value">{superadminCount} Super Admin • {users.length - superadminCount} Staff Admin</h3>
            <span className="sc-desc">Otorisasi endpoint berjenjang</span>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="dash-card table-card">
        <div className="table-tools-header" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div className="t-search">
            <Search size={18} className="icon" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, atau instansi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            >
              <option value="all">Semua Role</option>
              <option value="admin">Staff Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <button type="button" className="table-action-btn edit-btn" onClick={refreshAll} disabled={loadingUsers}>
              <RefreshCw size={14} /> {loadingUsers ? 'Memuat...' : 'Sync Supabase'}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama &amp; Instansi</th>
                <th>Email Login</th>
                <th>Role</th>
                <th>Login Terakhir</th>
                <th>Status Akses</th>
                <th style={{ textAlign: 'right' }}>Aksi Pengaturan</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Memuat daftar akun dari Supabase...</td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((item) => {
                  const isSelf = Number(item.id) === Number(currentUser?.id);
                  const isActive = item.is_active !== false;
                  return (
                    <tr key={item.id}>
                      <td className="text-muted font-mono">#{item.id}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span className="font-bold text-main">
                            {item.name} {isSelf && <span style={{ fontSize: 11, color: '#0284c7' }}>(Anda)</span>}
                          </span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{item.agency || 'Pemerintah Kota Bogor'}</span>
                        </div>
                      </td>
                      <td className="text-emerald font-medium font-mono">{item.email}</td>
                      <td>
                        <span
                          className="role-pill font-mono"
                          style={{
                            padding: '3px 9px',
                            borderRadius: 999,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background: item.role === 'superadmin' ? '#e0e7ff' : '#ecfdf5',
                            color: item.role === 'superadmin' ? '#3730a3' : '#047857',
                          }}
                        >
                          {item.role === 'superadmin' ? 'superadmin' : 'admin'}
                        </span>
                      </td>
                      <td className="text-muted" style={{ fontSize: 12 }}>
                        {item.last_login_at ? new Date(item.last_login_at).toLocaleString('id-ID') : 'Belum pernah login'}
                      </td>
                      <td>
                        <span className={`badge ${isActive ? 'sangat-aman' : 'sangat-rawan'}`}>
                          {isActive ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="sa-table-actions">
                          <button
                            type="button"
                            className="table-action-btn edit-btn"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Akun & Password"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="table-action-btn"
                            disabled={isSelf}
                            onClick={() => handleToggleActive(item)}
                            title={isSelf ? 'Akun sendiri aktif' : isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            style={{ opacity: isSelf ? 0.45 : 1 }}
                          >
                            <Power size={14} /> {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            type="button"
                            className="table-action-btn delete-btn"
                            disabled={isSelf}
                            onClick={() => handleDeleteUser(item)}
                            title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Akun'}
                            style={{ opacity: isSelf ? 0.45 : 1 }}
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Tidak ada akun yang sesuai dengan filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Aktivitas Sistem dari Backend (/api/admin/audit-logs) */}
      <div className="sa-card table-card" style={{ marginTop: 24 }}>
        <div className="sa-table-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#0284c7" />
            <h3 style={{ margin: 0 }}>Log Aktivitas Sistem (Supabase Audit Trail)</h3>
          </div>
          <button
            type="button"
            className="table-action-btn edit-btn"
            onClick={loadAuditLogs}
            disabled={loadingLogs}
          >
            <RefreshCw size={14} /> {loadingLogs ? 'Memuat...' : 'Refresh Log'}
          </button>
        </div>

        {logsError && (
          <div style={{ padding: '10px 16px', color: '#b91c1c', fontSize: 13 }}>{logsError}</div>
        )}

        <div className="sa-table-wrapper">
          <table className="sa-data-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aktor</th>
                <th>Aksi</th>
                <th>Resource</th>
                <th>Resource ID</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log, idx) => (
                  <tr key={log.id || idx}>
                    <td style={{ fontSize: 12 }}>{log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}</td>
                    <td style={{ fontSize: 12 }}>
                      {log.user_name ? `${log.user_name} (${log.user_email || `#${log.user_id}`})` : log.user_email || (log.user_id ? `User #${log.user_id}` : 'Sistem')}
                    </td>
                    <td><strong>{log.action}</strong></td>
                    <td>{log.resource || '-'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.resource_id || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {loadingLogs ? 'Memuat audit log...' : 'Belum ada catatan audit log.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="login-modal-card animate-zoom-in">
            <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>

            <div className="login-head">
              <div className="login-icon-box">
                <UserPlus size={28} className="text-emerald" />
              </div>
              <h2>{editingUser ? `Edit Akun #${editingUser.id}` : 'Tambah Akun Pengelola Baru'}</h2>
              <p>Disimpan permanen ke tabel <code>users</code> Supabase dengan hash bcrypt</p>
            </div>

            {modalError && (
              <div style={{ padding: 10, borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveForm} className="login-form">
              <label>
                Nama Lengkap *
                <div className="input-wrap">
                  <User size={18} className="i-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.T."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="staff@nutrimap.test"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </label>

              <label>
                Instansi / Perangkat Daerah *
                <div className="input-wrap">
                  <Building2 size={18} className="i-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Bappeda / Dinas Kesehatan Kota Bogor"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  />
                </div>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label>
                  Role Sistem *
                  <select
                    className="status-select-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="admin">Staff Admin (admin)</option>
                    <option value="superadmin">Super Admin (superadmin)</option>
                  </select>
                </label>

                <label>
                  Status Akses
                  <select
                    className="status-select-input"
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                  >
                    <option value="active">Aktif (Dapat Login)</option>
                    <option value="inactive">Non-Aktif (Diblokir)</option>
                  </select>
                </label>
              </div>

              <label>
                {editingUser ? 'Kata Sandi Baru (Opsional — kosongkan bila tetap)' : 'Kata Sandi (Minimal 6 karakter) *'}
                <div className="input-wrap">
                  <Key size={18} className="i-icon" />
                  <input
                    type="password"
                    required={!editingUser}
                    minLength={editingUser ? undefined : 6}
                    placeholder={editingUser ? 'Biarkan kosong jika tidak diubah' : 'Minimal 6 karakter'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </label>

              <button type="submit" className="primary-btn login-submit-btn" disabled={isSaving}>
                {isSaving ? 'Menyimpan ke Supabase...' : editingUser ? 'Simpan Perubahan Akun' : 'Daftarkan Akun ke Supabase'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
