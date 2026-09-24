import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  Sparkles
} from 'lucide-react';
import introBgImg from '../../assets/intro-bg.png';

export default function IntroOverlay({ onFinish }) {
  const [countdown, setCountdown] = useState(5);
  const [isVisible, setIsVisible] = useState(true);

  // Element Refs
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const cardRef = useRef(null);
  const progressFillRef = useRef(null);

  // Flags & Animations
  const isExiting = useRef(false);
  const progressTweenRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const floatingTweensRef = useRef([]);

  // Trigger smooth theater curtain exit
  const triggerExit = () => {
    if (isExiting.current) return;
    isExiting.current = true;

    // Clear countdown & active tweens
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }
    floatingTweensRef.current.forEach((t) => t && t.kill());

    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }
    });

    // 1. Card & pins scale down and fade out
    exitTl.to(
      [cardRef.current, '.intro-gis-pin'],
      {
        scale: 0.85,
        opacity: 0,
        y: -15,
        duration: 0.45,
        ease: 'power2.in',
        stagger: 0.05
      }
    );

    // 2. Overlay curtains up like a theater curtain
    exitTl.to(
      overlayRef.current,
      {
        y: '-100%',
        duration: 0.95,
        ease: 'power4.inOut'
      },
      '-=0.15'
    );

    // 3. Main website smooth reveal
    exitTl.fromTo(
      '#main-website',
      {
        opacity: 0.7,
        scale: 0.985,
        filter: 'blur(3px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,filter,scale'
      },
      '-=0.65'
    );
  };

  useEffect(() => {
    // 1. Entrance Animation Timeline
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background smooth scale in
      entranceTl.fromTo(
        bgRef.current,
        { scale: 1.08, filter: 'blur(6px)' },
        { scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        0
      );

      // Main Modal Card Entrance (Zoom-in + Fade-in with elastic bounce)
      entranceTl.fromTo(
        cardRef.current,
        { scale: 0.65, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.0, ease: 'back.out(1.35)' },
        0.15
      );

      // Card Staggered text & items
      entranceTl.fromTo(
        '.intro-anim-item',
        { y: 22, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out'
        },
        0.45
      );

      // GIS Pins bounce-in
      entranceTl.fromTo(
        '.intro-gis-pin',
        { scale: 0, opacity: 0, y: -50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'bounce.out'
        },
        0.35
      );



      // Continuous Floating / Bouncing Animation for All 6 Pins
      const pinFloatConfigs = [
        { sel: '.intro-pin-blue', y: '-=12', dur: 2.3, delay: 0.0 },
        { sel: '.intro-pin-green', y: '+=10', dur: 2.6, delay: 0.4 },
        { sel: '.intro-pin-amber', y: '-=10', dur: 2.8, delay: 0.2 },
        { sel: '.intro-pin-amber2', y: '+=11', dur: 2.1, delay: 0.6 },
        { sel: '.intro-pin-teal', y: '-=9', dur: 2.4, delay: 0.3 },
        { sel: '.intro-pin-violet', y: '+=13', dur: 2.7, delay: 0.5 },
      ];
      pinFloatConfigs.forEach(({ sel, y, dur, delay }) => {
        floatingTweensRef.current.push(
          gsap.to(sel, { y, duration: dur, repeat: -1, yoyo: true, ease: 'sine.inOut', delay })
        );
      });

      // 5-Second Timer Progress Bar
      progressTweenRef.current = gsap.fromTo(
        progressFillRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 5.0,
          ease: 'linear',
          onComplete: () => {
            triggerExit();
          }
        }
      );
    }, overlayRef);

    // Countdown interval (5 down to 1)
    let timeLeft = 5;
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft >= 0) {
        setCountdown(timeLeft);
      }
    }, 1000);

    // Mouse Movement Parallax
    const handleMouseMove = (e) => {
      if (isExiting.current || !overlayRef.current) return;
      const { innerWidth, innerHeight } = window;
      const normX = e.clientX / innerWidth - 0.5;
      const normY = e.clientY / innerHeight - 0.5;

      gsap.to(bgRef.current, {
        x: -normX * 22,
        y: -normY * 22,
        duration: 0.6,
        ease: 'power1.out'
      });

      gsap.to('.intro-gis-pin', {
        x: normX * 32,
        y: normY * 32,
        duration: 0.6,
        ease: 'power1.out'
      });



      gsap.to(cardRef.current, {
        x: normX * 14,
        y: normY * 14,
        duration: 0.6,
        ease: 'power1.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="intro-overlay" className="intro-overlay" ref={overlayRef}>
      {/* Background Layer with GIS Landscape & Map Grid */}
      <div className="intro-bg-layer" ref={bgRef}>
        <img
          src={introBgImg}
          alt="WebGIS NutriMap Bogor Intro Background"
          className="intro-bg-img"
        />
        {/* Subtle Cyber Grid & Vignette Overlay */}
        <div className="intro-vignette-overlay" />
        <div className="intro-scanline-fx" />
      </div>

      {/* ============================================================
          FLOATING GIS MAP PINS (Blue, Green, Red) with Pulsing Halos
          ============================================================ */}

      {/* 1. BLUE GIS PIN (Top Center-Left) */}
      <div className="intro-gis-pin intro-pin-blue">
        <div className="pin-pulse-halo blue" />
        <div className="pin-pulse-halo blue delayed" />
        <div className="pin-svg-wrap">
          <svg width="46" height="58" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinBlueGrad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z"
              fill="url(#pinBlueGrad)"
              filter="url(#glowBlue)"
            />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#93C5FD" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge blue">
          <span className="dot" />
          <span>Bogor Tengah</span>
        </div>
      </div>

      {/* 2. GREEN GIS PIN (Top Center-Right) */}
      <div className="intro-gis-pin intro-pin-green">
        <div className="pin-pulse-halo green" />
        <div className="pin-pulse-halo green delayed" />
        <div className="pin-svg-wrap">
          <svg width="42" height="54" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinGreenGrad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10B981" floodOpacity="0.6" />
              </filter>
            </defs>
            <path
              d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z"
              fill="url(#pinGreenGrad)"
              filter="url(#glowGreen)"
            />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#A7F3D0" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge green">
          <span className="dot" />
          <span>Bogor Timur</span>
        </div>
      </div>

      {/* 3. AMBER GIS PIN — Bogor Selatan (Waspada) */}
      <div className="intro-gis-pin intro-pin-amber">
        <div className="pin-pulse-halo amber" />
        <div className="pin-pulse-halo amber delayed" />
        <div className="pin-svg-wrap">
          <svg width="40" height="52" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinAmberGrad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#F59E0B" floodOpacity="0.7" />
              </filter>
            </defs>
            <path d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z" fill="url(#pinAmberGrad)" filter="url(#glowAmber)" />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#FDE68A" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge amber">
          <span className="dot" />
          <span>Bogor Selatan</span>
        </div>
      </div>

      {/* 4. AMBER2 GIS PIN — Bogor Barat (Waspada) */}
      <div className="intro-gis-pin intro-pin-amber2">
        <div className="pin-pulse-halo amber" />
        <div className="pin-pulse-halo amber delayed" />
        <div className="pin-svg-wrap">
          <svg width="38" height="48" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinAmber2Grad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <filter id="glowAmber2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#FBBF24" floodOpacity="0.65" />
              </filter>
            </defs>
            <path d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z" fill="url(#pinAmber2Grad)" filter="url(#glowAmber2)" />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#FCD34D" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge amber">
          <span className="dot" />
          <span>Bogor Barat</span>
        </div>
      </div>

      {/* 5. TEAL GIS PIN — Bogor Utara (Aman) */}
      <div className="intro-gis-pin intro-pin-teal">
        <div className="pin-pulse-halo teal" />
        <div className="pin-pulse-halo teal delayed" />
        <div className="pin-svg-wrap">
          <svg width="40" height="52" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinTealGrad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
              <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#14B8A6" floodOpacity="0.65" />
              </filter>
            </defs>
            <path d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z" fill="url(#pinTealGrad)" filter="url(#glowTeal)" />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#99F6E4" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge teal">
          <span className="dot" />
          <span>Bogor Utara</span>
        </div>
      </div>

      {/* 6. VIOLET GIS PIN — Tanah Sareal (Aman) */}
      <div className="intro-gis-pin intro-pin-violet">
        <div className="pin-pulse-halo violet" />
        <div className="pin-pulse-halo violet delayed" />
        <div className="pin-svg-wrap">
          <svg width="40" height="52" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinVioletGrad" x1="23" y1="0" x2="23" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
              <filter id="glowViolet" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.65" />
              </filter>
            </defs>
            <path d="M23 0C10.2975 0 0 10.2975 0 23C0 39.5 23 58 23 58C23 58 46 39.5 46 23C46 10.2975 35.7025 0 23 0Z" fill="url(#pinVioletGrad)" filter="url(#glowViolet)" />
            <circle cx="23" cy="22" r="9" fill="#0A192F" stroke="#DDD6FE" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="pin-tag-badge violet">
          <span className="dot" />
          <span>Tanah Sareal</span>
        </div>
      </div>



      {/* ============================================================
          CENTER GLASSMORPHISM CARD (MAIN MODAL)
          ============================================================ */}
      <div className="intro-modal-card" ref={cardRef}>
        {/* Top Tech Badge */}
        <div className="intro-card-badge intro-anim-item">
          <span className="badge-glow-dot" />
          <span className="badge-text">SISTEM INFORMASI GEOGRAFIS • KOTA BOGOR</span>
        </div>

        {/* Heading 1: Sesuai Gambar */}
        <h1 className="intro-modal-title intro-anim-item">
          Selamat Datang<br />
          di Web GIS<br />
          Kelompok 12
        </h1>

        {/* Subheading: Sesuai Gambar */}
        <p className="intro-modal-subtitle intro-anim-item">
          Ketahanan Pangan Tangguh, Akses Air Bersih, dan Gizi Sehat Kota Bogor
        </p>

        {/* Timer Countdown & Progress Bar (5s) */}
        <div className="intro-timer-section intro-anim-item">
          <div className="intro-timer-header">
            <span className="timer-info-text">
              <Sparkles size={13} className="sparkle-icon" />
              <span>Memasuki WebGIS dalam</span>
            </span>
            <span className="timer-counter-pill">{countdown} Detik</span>
          </div>

          <div className="intro-progress-track">
            <div className="intro-progress-fill" ref={progressFillRef} />
            <div className="intro-progress-glow" />
          </div>
        </div>

        {/* Action Button: Skip / Masuk Ke Web */}
        <div className="intro-action-box intro-anim-item">
          <button
            type="button"
            className="intro-skip-button"
            onClick={triggerExit}
            aria-label="Lewati intro dan masuk ke WebGIS"
          >
            <span>Lewati / Masuk Ke Web</span>
            <ArrowRight size={18} className="skip-arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
