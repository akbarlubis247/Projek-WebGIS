import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import {
  Layers,
  User,
  Lock,
  ArrowLeft,
  LogIn,
  ShieldAlert,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, adminsList }) {
  const [selectedRoleTab, setSelectedRoleTab] = useState('admin'); // 'admin' | 'superadmin'
  const [email, setEmail] = useState('admin@bogorkota.go.id');
  const [password, setPassword] = useState('admin123password');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Refs untuk GSAP Selector
  const modalBodyRef = useRef(null);
  const tabPillRef = useRef(null);
  const formHeadingRef = useRef(null);
  const submitBtnTextRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Set posisi pill saat modal pertama kali terbuka
  useEffect(() => {
    if (isOpen && tabPillRef.current) {
      gsap.set(tabPillRef.current, {
        xPercent: selectedRoleTab === 'superadmin' ? 100 : 0
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. Fungsi Animasi Switch Tab GSAP
  const switchTab = (role) => {
    if (selectedRoleTab === role || isAnimatingRef.current) return; // kalau klik tab yang sama, abaikan
    isAnimatingRef.current = true;

    const isSuper = role === 'superadmin';

    // Timeline untuk koordinasi animasi
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        isAnimatingRef.current = false;
      }
    });

    // A. Geser Background Pill Indicator (0% ke 100% atau sebaliknya)
    if (tabPillRef.current) {
      tl.to(tabPillRef.current, {
        xPercent: isSuper ? 100 : 0,
        duration: 0.35,
      });
    }

    // B. Efek Fade-out singkat pada konten form yang berubah
    const animateItems = modalBodyRef.current?.querySelectorAll('.animate-on-change');
    if (animateItems && animateItems.length > 0) {
      tl.to(
        animateItems,
        {
          opacity: 0,
          y: -5,
          duration: 0.1,
          onComplete: () => {
            // Ubah teks & state saat elemen tidak terlihat
            setSelectedRoleTab(role);
            setErrorMessage('');
            if (isSuper) {
              setEmail('superadmin@bogorkota.go.id');
              setPassword('superadmin123');
            } else {
              setEmail('admin@bogorkota.go.id');
              setPassword('admin123password');
            }

            if (formHeadingRef.current) {
              formHeadingRef.current.textContent = isSuper
                ? 'Masuk ke Panel Super Admin'
                : 'Masuk ke Panel Admin';
            }
            if (submitBtnTextRef.current) {
              submitBtnTextRef.current.textContent = isSuper
                ? 'Masuk sebagai Super Admin'
                : 'Masuk sebagai Admin';
            }
          }
        },
        '<'
      ); // Jalan bersamaan dengan pergeseran pill

      // C. Efek Fade-in kembali dengan subtle slide-up
      tl.to(animateItems, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.04
      });
    } else {
      setSelectedRoleTab(role);
      setErrorMessage('');
      if (isSuper) {
        setEmail('superadmin@bogorkota.go.id');
        setPassword('superadmin123');
      } else {
        setEmail('admin@bogorkota.go.id');
        setPassword('admin123password');
      }
      isAnimatingRef.current = false;
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
      <div className="login-split-card">
        {/* LEFT COLUMN: Dark Emerald Map Hero Panel */}
        <motion.div
          className="login-hero-panel"
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Watermark Contours Background Overlay */}
          <div className="topographic-pattern-overlay" />

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
        </motion.div>

        {/* RIGHT COLUMN: Clean White Form Panel */}
        <motion.div
          className="login-form-panel"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Bar Link */}
          <div className="form-panel-top">
            <button className="back-to-public-btn" onClick={onClose}>
              <ArrowLeft size={16} /> Kembali ke Beranda Publik
            </button>
          </div>

          <div className="form-panel-body" ref={modalBodyRef}>
            {/* Role Tabs dengan Background Pill Indicator Geser */}
            <div className="split-role-tabs">
              <div className="tab-pill-indicator" ref={tabPillRef} />

              <button
                id="btn-staff"
                type="button"
                className={`s-tab ${selectedRoleTab === 'admin' ? 'active' : ''}`}
                onClick={() => switchTab('admin')}
              >
                <UserCheck size={16} /> Staff Admin
              </button>
              <button
                id="btn-super"
                type="button"
                className={`s-tab ${selectedRoleTab === 'superadmin' ? 'active' : ''}`}
                onClick={() => switchTab('superadmin')}
              >
                <ShieldCheck size={16} /> Super Admin
              </button>
            </div>

            <div className="form-head animate-on-change">
              <h2 id="form-title" ref={formHeadingRef}>
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
              <div className="form-group animate-on-change">
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

              <div className="form-group animate-on-change">
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

              <div className="forgot-pass-wrap animate-on-change">
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
                <span id="submit-btn-text" ref={submitBtnTextRef} className="animate-on-change">
                  {selectedRoleTab === 'superadmin' ? 'Masuk sebagai Super Admin' : 'Masuk sebagai Admin'}
                </span>
                <LogIn size={16} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
