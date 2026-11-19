import React from 'react';
import { Sprout, MapPin, Mail, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { KujangOrnament } from './BogorDecorations';

export default function Footer({ onNavigate }) {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="nutrimap-pro-footer" aria-label="Footer Resmi NutriMap Kota Bogor">
      <div className="pro-footer-container">
        {/* 4 Columns Top Grid */}
        <div className="pro-footer-grid">
          {/* Column 1: Brand & Overview */}
          <div className="pro-footer-brand">
            <div className="pf-brand-logo">
              <div className="pf-logo-badge">
                <Sprout size={20} />
              </div>
              <span className="pf-logo-text">NutriMap Kota Bogor</span>
            </div>
            <p className="pf-desc">
              Platform Sistem Informasi Geografis (SIG) Pemerintah Kota Bogor untuk pemantauan terpadu ketahanan pangan, keterjangkauan air bersih, dan percepatan penurunan stunting berbasis bukti spasial.
            </p>
            <div className="pf-gov-badge">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Portal Geospasial Resmi Kota Bogor</span>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div className="pro-footer-col">
            <h4 className="pf-col-title">Navigasi Platform</h4>
            <ul className="pf-nav-list">
              <li>
                <button type="button" onClick={() => handleScroll('beranda')}>Beranda</button>
              </li>
              <li>
                <button type="button" onClick={() => handleScroll('peta-spasial')}>Peta Spasial</button>
              </li>
              <li>
                <button type="button" onClick={() => handleScroll('data-indikator')}>Data Indikator Kota</button>
              </li>
              <li>
                <button type="button" onClick={() => handleScroll('metodologi-sumber')}>Sumber Data Resmi</button>
              </li>
              <li>
                <button type="button" onClick={() => handleScroll('tentang-nutrimap')}>Tentang NutriMap</button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('nutrimap_replay_intro'));
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  title="Putar ulang intro sinematik"
                >
                  Putar Ulang Intro
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Sumber Data Resmi */}
          <div className="pro-footer-col">
            <h4 className="pf-col-title">Sumber Data Resmi</h4>
            <ul className="pf-nav-list">
              <li>
                <a href="https://satupeta.kotabogor.go.id/maps" target="_blank" rel="noreferrer">
                  <span>Satu Peta Kota Bogor</span>
                  <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
              <li>
                <a href="https://bogorkota.bps.go.id/" target="_blank" rel="noreferrer">
                  <span>Badan Pusat Statistik (BPS)</span>
                  <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
              <li>
                <a href="https://dkp.kotabogor.go.id/" target="_blank" rel="noreferrer">
                  <span>Dinas Ketahanan Pangan (DKP)</span>
                  <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
              <li>
                <a href="https://dinkes.kotabogor.go.id/" target="_blank" rel="noreferrer">
                  <span>Dinas Kesehatan Kota Bogor</span>
                  <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
              <li>
                <a href="https://tirtapakuan.co.id/" target="_blank" rel="noreferrer">
                  <span>Perumda Tirta Pakuan</span>
                  <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Pengembang & Layanan */}
          <div className="pro-footer-col">
            <h4 className="pf-col-title">Pengembang &amp; Kontak</h4>
            <div className="pf-contact-list">
              <div className="pf-contact-item">
                <MapPin size={16} className="pf-contact-icon" />
                <span>Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121</span>
              </div>
              <div className="pf-contact-item">
                <Mail size={16} className="pf-contact-icon" />
                <span>bappeda@kotabogor.go.id / dkp@kotabogor.go.id</span>
              </div>
              <div className="pf-contact-item">
                <Phone size={16} className="pf-contact-icon" />
                <span>Hotline 112 / (0251) 8321075</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row with Bogor Identity Kujang Seal */}
        <div className="pro-footer-bottom">
          <span>&copy; {new Date().getFullYear()} NutriMap Kota Bogor</span>
          <div className="pf-bottom-kujang-seal" aria-hidden="true" title="Ikon Pusaka Kujang Kota Bogor">
            <KujangOrnament size={36} color="#C9B98E" opacity={0.36} />
            <span className="pf-kujang-label">KOTA BOGOR</span>
          </div>
          <span>Dikelola oleh Tim Pengembang Kelompok 12 A2 Tugas SIG x Manpro</span>
        </div>
      </div>
    </footer>
  );
}

