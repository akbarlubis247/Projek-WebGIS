import React, { useEffect, useState } from 'react';
import { Layers, MapPin, TableProperties, Info, Home, UserCheck, Menu, X } from 'lucide-react';

export const GUEST_NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'peta-spasial', label: 'Peta Spasial', icon: MapPin },
  { id: 'data-indikator', label: 'Data Indikator Kota', icon: TableProperties },
  { id: 'tentang-nutrimap', label: 'Tentang NutriMap', icon: Info },
];

export default function Navbar({ onOpenLogin }) {
  const [activeSection, setActiveSection] = useState('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const headerOffset = 76;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll Spy: Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = GUEST_NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(GUEST_NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <div className="nav-brand" onClick={() => handleNavClick('beranda')}>
          <div className="brand-logo-clean">
            <Layers size={20} className="brand-icon" />
          </div>
          <div className="nav-brand-text">
            <span className="n-title">NutriMap Kota Bogor</span>
            <span className="n-subtitle">Sistem Informasi Geografis Ketahanan Pangan</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links-desktop">
          {GUEST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Action & Mobile Toggle */}
        <div className="nav-actions">
          <button id="login-admin-btn" className="nav-login-btn" onClick={onOpenLogin}>
            <UserCheck size={16} />
            <span>Login Admin / SuperAdmin</span>
          </button>

          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          {GUEST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`m-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            className="m-login-btn"
            onClick={() => {
              onOpenLogin();
              setMobileMenuOpen(false);
            }}
          >
            <UserCheck size={16} /> Login Admin / SuperAdmin
          </button>
        </div>
      )}
    </nav>
  );
}
