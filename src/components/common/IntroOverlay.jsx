import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { MountSalakSilhouette } from './BogorDecorations';
import slideBogorAerial from '../../assets/slide-bogor-aerial.jpg';

/**
 * Cinematic Documentary Intro — Bogor Geographic Identity
 * Durasi maksimal: 5.00 detik.
 * 
 * Konsep:
 * - 0.00–1.00s: Opening Atmosphere (Lanskap Kota Bogor & siluet Gunung Salak fade-in lembut, slow zoom)
 * - 1.00–2.50s: Geographic Identity (Koordinat geografis, elevasi, dan siluet Gunung Salak khas Bogor)
 * - 2.00–4.00s: Brand Reveal (Judul editorial NUTRIMAP & Subtitle Sistem Informasi Geospasial Kota Bogor)
 * - 4.10–5.00s: Seamless Transition (Dissolve/fade out halus menuju website utama tanpa blank screen)
 * 
 * Interaktivitas & Aksesibilitas:
 * - Tombol "Lewati Intro" (Skip) & tombol keyboard "Escape" langsung mempercepat transisi (0.25s).
 * - Mendukung prefers-reduced-motion (otomatis langsung masuk website tanpa animasi).
 * - Session persistence: otomatis ditandai di sessionStorage setelah selesai/dilewati.
 */
export default function IntroOverlay({ onFinish }) {
  const overlayRef = useRef(null);
  const bgImgRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const identityClusterRef = useRef(null);
  const brandClusterRef = useRef(null);
  const progressFillRef = useRef(null);
  const skipBtnRef = useRef(null);

  const isExiting = useRef(false);
  const tlRef = useRef(null);

  const triggerExit = useCallback((isImmediate = false) => {
    if (isExiting.current) return;
    isExiting.current = true;

    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (!overlayRef.current) {
      if (onFinish) onFinish();
      return;
    }

    // Segera matikan pointer-events agar website di baliknya langsung responsif
    overlayRef.current.style.pointerEvents = 'none';

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: isImmediate ? 0.25 : 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onFinish) onFinish();
      }
    });
  }, [onFinish]);

  const handleSkip = useCallback(() => {
    triggerExit(true);
  }, [triggerExit]);

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      triggerExit(true);
      return;
    }

    // 2. Keyboard Accessibility: Tombol Escape untuk melewati intro
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Focus skip button for keyboard navigation accessibility
    if (skipBtnRef.current) {
      skipBtnRef.current.focus();
    }

    // 4. GSAP Cinematic Documentary Timeline (Total Durasi: 5.00 Detik)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          triggerExit(false);
        }
      });
      tlRef.current = tl;

      // 0.00 - 5.00s: Continuous slow camera zoom (Ken Burns documentary effect)
      gsap.fromTo(
        bgImgRef.current,
        { scale: 1.08, y: 0 },
        { scale: 1.01, y: -6, duration: 5.0, ease: 'sine.out' }
      );

      // 0.00 - 5.00s: Timeline progress bar tracking from 0% to 100%
      gsap.fromTo(
        progressFillRef.current,
        { width: '0%' },
        { width: '100%', duration: 5.0, ease: 'linear' }
      );

      // 0.00 - 0.70s: Initial Overlay Fade-In
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      );

      // 0.40 - 1.10s: Top Bar & Bottom Coordinates Fade-In
      tl.fromTo(
        [topBarRef.current, bottomBarRef.current],
        { opacity: 0, y: (i) => (i === 0 ? -10 : 10) },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.4
      );

      // 0.90 - 2.00s: Geographic Identity (Mount Salak silhouette & Eyebrow text)
      tl.fromTo(
        identityClusterRef.current,
        { opacity: 0, y: 14, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power2.out' },
        0.9
      );

      // 1.80 - 3.20s: Brand Reveal (NUTRIMAP & Subtitle) with soft tracking
      tl.fromTo(
        brandClusterRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power2.out' },
        1.8
      );

      // 4.15 - 5.00s: Seamless Cinematic Dissolve to Main Website
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.85,
          ease: 'power2.inOut',
          onStart: () => {
            if (overlayRef.current) {
              overlayRef.current.style.pointerEvents = 'none';
            }
          }
        },
        4.15
      );
    }, overlayRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [handleSkip, triggerExit]);

  return (
    <div
      id="cinematic-intro"
      className="cinematic-intro-root"
      ref={overlayRef}
      role="dialog"
      aria-label="Pengantar Sinematik NutriMap Kota Bogor"
      aria-modal="true"
    >
      {/* 1. Cinematic Background Layer with Ken Burns slow zoom */}
      <div className="cinematic-bg-wrap">
        <img
          src={slideBogorAerial}
          alt="Lanskap Udara Kota Bogor dan Gunung Salak"
          className="cinematic-bg-img"
          ref={bgImgRef}
        />
        {/* Forest Green Documentary Grade & Soft Vignette */}
        <div className="cinematic-overlay-grade" />
      </div>

      {/* 2. Minimalist Cartographic Reticles / Lines (Bogor Geographic Identity) */}
      <div className="cinematic-reticle-layer" aria-hidden="true">
        <div className="cinematic-reticle-corner top-left" />
        <div className="cinematic-reticle-corner top-right" />
        <div className="cinematic-reticle-corner bottom-left" />
        <div className="cinematic-reticle-corner bottom-right" />
      </div>

      {/* 3. Top Institutional Coordinates Header Bar */}
      <header className="cinematic-top-bar" ref={topBarRef}>
        <div className="cinematic-top-left">
          <span className="cinematic-coord-badge">
            <span className="coord-dot" />
            KOTA BOGOR · 6° 35′ 47″ LS &nbsp;106° 47′ 54″ BT
          </span>
          <span className="cinematic-elev-badge">ELEVASI 265 — 2.211 MDPL</span>
        </div>

        {/* Skip Intro Button */}
        <div className="cinematic-top-right">
          <button
            type="button"
            className="cinematic-skip-btn"
            onClick={handleSkip}
            ref={skipBtnRef}
            aria-label="Lewati Intro (Tekan tombol Escape)"
          >
            <span>Lewati Intro</span>
            <span className="skip-kbd-hint">Esc</span>
          </button>
        </div>
      </header>

      {/* 4. Center Documentary Content Container */}
      <main className="cinematic-center-stage">
        {/* Identity Crest: Siluet Gunung Salak & Eyebrow */}
        <div className="cinematic-identity-cluster" ref={identityClusterRef}>
          <div className="cinematic-salak-frame" aria-hidden="true">
            <MountSalakSilhouette width={170} height={52} color="#C9B98E" opacity={0.65} />
          </div>
          <div className="cinematic-eyebrow">
            <span className="cinematic-eyebrow-line" />
            <span className="cinematic-eyebrow-text">KOTA BOGOR · INFORMASI GEOSPASIAL</span>
            <span className="cinematic-eyebrow-line" />
          </div>
        </div>

        {/* Brand Title & Subtitle */}
        <div className="cinematic-brand-cluster" ref={brandClusterRef}>
          <h1 className="cinematic-brand-title">NUTRIMAP</h1>
          <p className="cinematic-brand-subtitle">Sistem Informasi Geospasial Kota Bogor</p>
          <div className="cinematic-pillars-row">
            <span>Ketahanan Pangan</span>
            <span className="pillar-bullet">•</span>
            <span>Akses Air Bersih</span>
            <span className="pillar-bullet">•</span>
            <span>Pemantauan Gizi Terpadu</span>
          </div>
        </div>
      </main>

      {/* 5. Bottom Timeline / Elapsed 5-Second Bar */}
      <footer className="cinematic-bottom-bar" ref={bottomBarRef}>
        <div className="cinematic-meta-tag">
          <span>PEMERINTAH KOTA BOGOR · SATU DATA SPASIAL</span>
        </div>
        <div className="cinematic-progress-track" aria-hidden="true">
          <div className="cinematic-progress-fill" ref={progressFillRef} />
        </div>
      </footer>
    </div>
  );
}
