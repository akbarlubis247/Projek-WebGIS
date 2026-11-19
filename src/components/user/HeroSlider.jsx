import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MountSalakSilhouette } from '../common/BogorDecorations';

import slideBogorAerial from '../../assets/slide-bogor-aerial.jpg';
import slideRiceFields from '../../assets/slide-rice-fields.jpg';
import slideWaterSource from '../../assets/slide-water-source.jpg';
import slideHealthActivity from '../../assets/slide-health-activity.jpg';

export const HERO_SLIDES = [
  {
    id: 1,
    tag: 'GEOSPATIAL INTELLIGENCE',
    badge: 'NutriMap Kota Bogor',
    title: 'Mengenal Potensi Wilayah Kota Bogor',
    desc: 'Eksplorasi data ketahanan pangan terpadu, akses air bersih, dan pemantauan gizi anak untuk mewujudkan kebijakan wilayah yang presisi.',
    ctaText: 'Eksplorasi Peta Spasial',
    targetLayer: 'stunting',
    bg: slideBogorAerial,
    alt: 'Foto aerial pemandangan Kota Bogor dan Gunung Salak',
    caption: 'Bentang Alam & Administrasi 6 Kecamatan Kota Bogor'
  },
  {
    id: 2,
    tag: 'KETAHANAN PANGAN',
    badge: 'NutriMap Kota Bogor',
    title: 'Memetakan Potensi Pangan Kota Bogor',
    desc: 'Informasi geografis komprehensif untuk memahami potensi ketersediaan, distribusi komoditas, dan persebaran sumber pangan masyarakat.',
    ctaText: 'Jelajahi Peta Pangan',
    targetLayer: 'pangan',
    bg: slideRiceFields,
    alt: 'Foto udara lahan pertanian dan persawahan hijau',
    caption: 'Lahan Pertanian & Distribusi Komoditas Pangan'
  },
  {
    id: 3,
    tag: 'SANITASI & AIR BERSIH',
    badge: 'NutriMap Kota Bogor',
    title: 'Memahami Akses Air Bersih Perkotaan',
    desc: 'Eksplorasi persebaran sumber air baku, instalasi pengolahan PDAM Tirta Pakuan, dan cakupan sambungan rumah layak bagi warga.',
    ctaText: 'Lihat Akses Air Bersih',
    targetLayer: 'air',
    bg: slideWaterSource,
    alt: 'Foto instalasi sumber dan penyaluran air bersih',
    caption: 'Infrastruktur Jaringan Air Bersih & Reservoir Kota'
  },
  {
    id: 4,
    tag: 'GIZI & KESEHATAN',
    badge: 'NutriMap Kota Bogor',
    title: 'Mendukung Generasi Bogor Bebas Stunting',
    desc: 'Visualisasi indikator kesehatan balita, sebaran posyandu, dan prevalensi stunting berbasis kelurahan untuk intervensi tepat sasaran.',
    ctaText: 'Pantau Indeks Stunting',
    targetLayer: 'stunting',
    bg: slideHealthActivity,
    alt: 'Foto aktivitas pelayanan kesehatan dan gizi masyarakat',
    caption: 'Intervensi Gizi Terintegrasi & Layanan Posyandu'
  }
];

export default function HeroSlider({ onActionClick }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (idx) => {
    setCurrent(idx);
  };

  // Autoplay otomatis tepat 5 detik (5000ms), jeda jika kursor hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, current]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <div
      className="hero-editorial-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="NutriMap Kota Bogor Editorial Hero"
    >
      {/* 1. GAMBAR SEBAGAI FULL LATAR BELAKANG CAROUSEL (CROSS-FADE ANIMATION) */}
      <div className="hero-bg-carousel-layer">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`hero-bg-slide-item ${isActive ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.bg})` }}
              role="img"
              aria-label={slide.alt}
            />
          );
        })}
      </div>

      {/* 2. OVERLAY GRADIENT EDITORIAL HIJAU GELAP AGAR TEKS SANGAT JELAS & ELEGAN */}
      <div className="hero-bg-editorial-overlay" />

      {/* 3. TOMBOL NAVIGASI DI UJUNG PALING KIRI */}
      <button
        type="button"
        className="hero-edge-nav-btn hero-edge-prev"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        title="Slide Sebelumnya"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 4. TOMBOL NAVIGASI DI UJUNG PALING KANAN */}
      <button
        type="button"
        className="hero-edge-nav-btn hero-edge-next"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        title="Slide Berikutnya"
      >
        <ChevronRight size={24} />
      </button>

      {/* 5. KONTEN TEKS & INFORMASI (FOREGROUND) */}
      <div className="hero-editorial-container">
        <div className="hero-editorial-content">
          {/* Eyebrow Label */}
          <div className="hero-editorial-eyebrow">
            <span className="eyebrow-accent-line" />
            <span className="eyebrow-text">
              KOTA BOGOR • {activeSlide.tag}
            </span>
          </div>

          {/* Large Serif Title */}
          <h1 key={`title-${current}`} className="hero-serif-heading animate-editorial-fade">
            {activeSlide.title}
          </h1>

          {/* Editorial Lead Description */}
          <p key={`desc-${current}`} className="hero-editorial-lead animate-editorial-fade">
            {activeSlide.desc}
          </p>

          {/* Slide Controls / Pagination */}
          <div className="hero-editorial-actions">
            <div className="hero-slider-pagination-wrap">
              <div className="hero-dots-row" role="tablist" aria-label="Pilih Slide">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Buka slide ${idx + 1}: ${slide.title}`}
                      className={`hero-dot-pill ${isActive ? 'active' : ''}`}
                      onClick={() => goToSlide(idx)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 6. ELEMEN DEKORATIF IDENTITAS BOGOR: SILUET GUNUNG SALAK */}
        <div className="hero-salak-ornament" aria-hidden="true">
          <MountSalakSilhouette width={160} height={52} color="#C9B98E" opacity={0.32} />
          <span className="hero-salak-label">GUNUNG SALAK • 2.211 MDPL</span>
        </div>
      </div>
    </div>
  );
}
