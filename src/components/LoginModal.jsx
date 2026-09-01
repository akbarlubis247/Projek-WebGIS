import React, { useState } from 'react';
import { X, Lock, Mail, Layers, ShieldCheck, UserCheck, Key } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, adminsList }) {
  const [selectedRoleTab, setSelectedRoleTab] = useState('admin'); // 'admin' | 'superadmin'
  const [email, setEmail] = useState('admin@bogorkota.go.id');
  const [password, setPassword] = useState('admin123password');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (role) => {
    setSelectedRoleTab(role);
    setErrorMessage('');
    if (role === 'superadmin') {
      setEmail('superadmin@bogorkota.go.id');
      setPassword('superadmin123');
    } else {
      setEmail('admin@bogorkota.go.id');
      setPassword('admin123password');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRoleTab === 'superadmin') {
      if (email.toLowerCase() === 'superadmin@bogorkota.go.id' && password === 'superadmin123') {
        onLoginSuccess({
          name: 'Super Admin Utama',
          role: 'superadmin',
          email: email,
          isLoggedIn: true
        });
        onClose();
      } else {
        setErrorMessage('Email atau password Superadmin salah! (Gunakan: superadmin@bogorkota.go.id / superadmin123)');
      }
    } else {
      // Check in registered admins list or fallback
      const foundAdmin = adminsList.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (foundAdmin) {
        onLoginSuccess({
          name: foundAdmin.nama,
          role: 'admin',
          email: foundAdmin.email,
          isLoggedIn: true
        });
        onClose();
      } else if (email && password) {
        // Allow general admin login
        onLoginSuccess({
          name: 'Staff Admin Kota',
          role: 'admin',
          email: email,
          isLoggedIn: true
        });
        onClose();
      } else {
        setErrorMessage('Silakan masukkan email dan password admin!');
      }
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="login-modal-card animate-zoom-in">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="login-head">
          <div className="login-icon-box">
            <Layers size={28} className="text-emerald" />
          </div>
          <h2>Portal Login Admin / SuperAdmin</h2>
          <p>Sistem Informasi Geografis Ketahanan Pangan Kota Bogor</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="login-role-tabs">
          <button
            className={`l-tab ${selectedRoleTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            <UserCheck size={16} /> Login Admin
          </button>

          <button
            className={`l-tab ${selectedRoleTab === 'superadmin' ? 'active' : ''}`}
            onClick={() => handleTabChange('superadmin')}
          >
            <ShieldCheck size={16} /> Login Superadmin
          </button>
        </div>

        {errorMessage && (
          <div className="login-error-box">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email Login *
            <div className="input-wrap">
              <Mail size={18} className="i-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@bogorkota.go.id"
              />
            </div>
          </label>

          <label>
            Kata Sandi *
            <div className="input-wrap">
              <Key size={18} className="i-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
              />
            </div>
          </label>

          <div className="login-demo-notice">
            <ShieldCheck size={16} className="text-emerald" />
            <span>
              {selectedRoleTab === 'superadmin'
                ? 'Superadmin: Pengaturan daftar email & password admin saja.'
                : 'Staff Admin: Akses penuh fitur operasional SIG Kota Bogor.'}
            </span>
          </div>

          <button type="submit" className="primary-btn login-submit-btn">
            Masuk Sekarang ({selectedRoleTab === 'superadmin' ? 'Superadmin' : 'Admin'})
          </button>
        </form>
      </div>
    </div>
  );
}
