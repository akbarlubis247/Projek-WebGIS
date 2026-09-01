import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  User,
  Lock,
  ArrowLeft,
  LogIn,
  ShieldAlert,
  Building2,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

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
        setErrorMessage('Email atau kata sandi Superadmin salah! (Gunakan: superadmin@bogorkota.go.id / superadmin123)');
      }
    } else {
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
        onLoginSuccess({
          name: 'Staff Admin Kota',
          role: 'admin',
          email: email,
          isLoggedIn: true
        });
        onClose();
      } else {
        setErrorMessage('Silakan masukkan email dan kata sandi admin!');
      }
    }
  };

  return (
    <div className="login-overlay-fullscreen animate-fade-in">
      <div className="login-split-card animate-zoom-in">
        {/* LEFT COLUMN: Dark Emerald Map Hero Panel */}
        <div className="login-hero-panel">
          {/* Watermark Contours Background Overlay */}
          <div className="topographic-pattern-overlay" />
          <div className="hero-top-watermark font-mono">
            BOGOR CITY - TOPOGRAPHIC & ADMINISTRATIVE MAP
          </div>

          <div className="hero-center-content">
            <div className="brand-hero-logo">
              <div className="b-icon-glow">
                <Layers size={36} className="text-emerald" />
              </div>
              <h2>NutriMap Bogor</h2>
            </div>

            <h1>Sistem Informasi Geografis & Analisis Indikator Kesejahteraan</h1>

            <p>
              Platform manajemen data spasial untuk pemetaan prioritas wilayah, ketahanan pangan, dan stunting Kota Bogor.
            </p>
          </div>

          <div className="hero-bottom-watermark font-mono">
            Kota Bogor, Jawa Barat - Indonesia
          </div>
        </div>

        {/* RIGHT COLUMN: Clean White Form Panel */}
        <div className="login-form-panel">
          {/* Top Bar Link */}
          <div className="form-panel-top">
            <button className="back-to-public-btn" onClick={onClose}>
              <ArrowLeft size={16} /> Kembali ke Beranda Publik
            </button>
          </div>

          <div className="form-panel-body">
            {/* Role Tabs */}
            <div className="split-role-tabs">
              <button
                className={`s-tab ${selectedRoleTab === 'admin' ? 'active' : ''}`}
                onClick={() => handleTabChange('admin')}
              >
                <UserCheck size={16} /> Staff Admin
              </button>
              <button
                className={`s-tab ${selectedRoleTab === 'superadmin' ? 'active' : ''}`}
                onClick={() => handleTabChange('superadmin')}
              >
                <ShieldCheck size={16} /> Super Admin
              </button>
            </div>

            <div className="form-head">
              <h2>
                {selectedRoleTab === 'superadmin' ? 'Masuk ke Panel Super Admin' : 'Masuk ke Panel Admin'}
              </h2>
              <p>Silakan masukkan kredensial Anda untuk mengelola data indikator dan wilayah.</p>
            </div>

            {errorMessage && (
              <div className="login-error-alert">
                <ShieldAlert size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="split-login-form">
              <div className="form-group">
                <label>Email / Username</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bogor.go.id"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Kata Sandi</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="forgot-pass-wrap">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      selectedRoleTab === 'superadmin'
                        ? 'Akun Demo Superadmin:\nEmail: superadmin@bogorkota.go.id\nPassword: superadmin123'
                        : 'Akun Demo Staff Admin:\nEmail: admin@bogorkota.go.id\nPassword: admin123password'
                    );
                  }}
                >
                  Lupa kata sandi?
                </a>
              </div>

              <motion.button
                type="submit"
                className="dark-emerald-submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>
                  {selectedRoleTab === 'superadmin' ? 'Masuk sebagai Super Admin' : 'Masuk sebagai Admin'}
                </span>
                <LogIn size={16} />
              </motion.button>
            </form>


          </div>

          {/* Form Panel Footer */}
          <div className="form-panel-footer">
            <div className="foot-left">
              <Building2 size={16} />
              <span>Pemerintah Kota Bogor</span>
            </div>
            <div className="foot-right font-mono">
              © 2026 NutriMap Bogor. v2.4.0-GIS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
