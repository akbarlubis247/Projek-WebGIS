import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Layers, MapPin, TableProperties, Info, Home, UserCheck, Menu, X, Sprout } from 'lucide-react';

export const GUEST_NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'peta-spasial', label: 'Peta Spasial', icon: MapPin },
  { id: 'data-indikator', label: 'Data Indikator Kota', icon: TableProperties },
  { id: 'tentang-nutrimap', label: 'Tentang NutriMap', icon: Info },
];

export default function Navbar({ onOpenLogin }) {
  const [activeSection, setActiveSection] = useState('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef(null);
  const navLinksRef = useRef(null);
  const itemRefs = useRef({});

  // GSAP Navbar entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', clearProps: 'transform' }
      );

      gsap.fromTo(
        '.nav-brand',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.nav-links-desktop button',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.nav-actions',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.5, ease: 'back.out(1.5)' }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll handler
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const headerOffset = 96;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll Spy + Indicator Line Following Scroll Position
  useEffect(() => {
    const updateNavProgress = () => {
      try {
        // 1. Overall page scroll progress
        const winScroll = window.scrollY || 0;
        const docHeight = (document.documentElement?.scrollHeight || 0) - (window.innerHeight || 0);
        if (docHeight > 0) {
          setScrollProgress((winScroll / docHeight) * 100);
        }

        // 2. Identify sections and calculate continuous indicator gliding
        const sectionsInfo = GUEST_NAV_ITEMS.map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          return {
            id: item.id,
            top: el.offsetTop - 120,
            bottom: el.offsetTop - 120 + el.offsetHeight,
            height: el.offsetHeight
          };
        }).filter(Boolean);

        const navContainer = navLinksRef.current;
        if (!navContainer || sectionsInfo.length === 0) return;

        const containerRect = navContainer.getBoundingClientRect();
        const currentScroll = window.scrollY || 0;

        // Find current section index
        let currentIndex = 0;
        for (let i = sectionsInfo.length - 1; i >= 0; i--) {
          if (currentScroll >= sectionsInfo[i].top) {
            currentIndex = i;
            break;
          }
        }

        const currItem = sectionsInfo[currentIndex];
        if (!currItem) return;

        setActiveSection(currItem.id);

        const nextItem = sectionsInfo[currentIndex + 1];
        const currBtn = itemRefs.current[currItem.id];
        if (!currBtn) return;

        const currRect = currBtn.getBoundingClientRect();
        const currLeft = currRect.left - containerRect.left;
        const currWidth = currRect.width;

        if (nextItem && itemRefs.current[nextItem.id]) {
          const nextBtn = itemRefs.current[nextItem.id];
          const nextRect = nextBtn.getBoundingClientRect();
          const nextLeft = nextRect.left - containerRect.left;
          const nextWidth = nextRect.width;

          const range = nextItem.top - currItem.top;
          const progress = Math.max(0, Math.min(1, (currentScroll - currItem.top) / (range || 1)));

          const targetLeft = currLeft + (nextLeft - currLeft) * progress;
          const targetWidth = currWidth + (nextWidth - currWidth) * progress;

          setIndicatorStyle({
            left: targetLeft,
            width: targetWidth,
            opacity: 1
          });
        } else {
          setIndicatorStyle({
            left: currLeft,
            width: currWidth,
            opacity: 1
          });
        }
      } catch (err) {
        console.warn('Nav progress error:', err);
      }
    };

    window.addEventListener('scroll', updateNavProgress, { passive: true });
    window.addEventListener('resize', updateNavProgress);
    const timer = setTimeout(updateNavProgress, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateNavProgress);
      window.removeEventListener('resize', updateNavProgress);
    };
  }, []);

  return (
    <nav className="public-navbar" ref={navRef}>
      {/* Top Global Scroll Progress Line */}
      <div
        className="nav-global-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <div className="nav-brand" onClick={() => handleNavClick('beranda')}>
          <div className="brand-logo-clean">
            <Sprout size={20} className="brand-icon" />
          </div>
          <div className="nav-brand-text">
            <div className="n-title-row">
              <span className="n-title">NutriMap</span>
              <span className="n-badge-city">BOGOR</span>
            </div>
            <span className="n-subtitle">Sistem Informasi Geografis Ketahanan Pangan</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links-desktop" ref={navLinksRef}>
          {GUEST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                className={`nav-item-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Animated Gliding Indicator Line that follows scroll smoothly */}
          <div
            className="nav-gliding-indicator"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }}
          >
            <div className="indicator-glow" />
          </div>
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
