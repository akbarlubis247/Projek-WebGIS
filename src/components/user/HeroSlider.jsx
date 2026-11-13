import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import slideBogorAerial from '../../assets/slide-bogor-aerial.jpg';
import slideRiceFields from '../../assets/slide-rice-fields.jpg';
import slideWaterSource from '../../assets/slide-water-source.jpg';
import slideHealthActivity from '../../assets/slide-health-activity.jpg';

export const HERO_SLIDES = [
  {
    id: 1,
    badge: 'NutriMap Bogor',
    title: 'Mengenal Potensi Wilayah Kota Bogor',
    desc: 'Eksplorasi data ketahanan pangan, akses air bersih, dan gizi untuk masa depan yang lebih sehat.',
    ctaText: 'Eksplorasi Peta Spasial',
    targetLayer: 'stunting',
    bg: slideBogorAerial,
    alt: 'Foto aerial pemandangan Kota Bogor dan Gunung Salak'
  },
  {
    id: 2,
    badge: 'NutriMap Bogor',
    title: 'Memetakan Potensi Pangan Kota Bogor',
    desc: 'Informasi geografis untuk memahami potensi dan persebaran sumber pangan masyarakat.',
    ctaText: 'Jelajahi Peta Pangan',
    targetLayer: 'pangan',
    bg: slideRiceFields,
    alt: 'Foto udara lahan pertanian dan persawahan hijau'
  },
  {
    id: 3,
    badge: 'NutriMap Bogor',
    title: 'Memahami Akses Air Bersih',
    desc: 'Eksplorasi persebaran sumber air dan informasi aksesibilitas jaringan air bersih kota.',
    ctaText: 'Lihat Akses Air Bersih',
    targetLayer: 'air',
    bg: slideWaterSource,
    alt: 'Foto instalasi sumber dan penyaluran air bersih'
  },
  {
    id: 4,
    badge: 'NutriMap Bogor',
    title: 'Mendukung Generasi Bogor yang Lebih Sehat',
    desc: 'Visualisasi informasi gizi dan stunting untuk mendukung pengambilan kebijakan terarah.',
    ctaText: 'Pantau Indeks Stunting',
    targetLayer: 'stunting',
    bg: slideHealthActivity,
    alt: 'Foto aktivitas pelayanan kesehatan dan gizi masyarakat'
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

  // Autoplay 6 seconds, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

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
      nextSlide(); // swipe left -> next
    } else if (diff < -minSwipeDistance) {
      prevSlide(); // swipe right -> prev
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Carousel Pemandangan dan Informasi NutriMap Bogor"
    >
      {/* Background Images with smooth fade and subtle Ken Burns zoom */}
      <div className="hero-slider-bg-layer">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`hero-slide-bg-item ${isActive ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.bg})`
              }}
              role="img"
              aria-label={slide.alt}
            />
          );
        })}
      </div>

      {/* Dark Green Gradient Left Overlay - Ensures 100% typography legibility */}
      <div className="hero-slider-gradient-overlay" />

      {/* Hero Content Container */}
      <div className="hero-slider-content-wrap">
        <div className="hero-slider-main-content">
          {/* Heading */}
          <h1 key={`title-${current}`} className="hero-editorial-title animate-title">
            {activeSlide.title}
          </h1>

          {/* Description */}
          <p key={`desc-${current}`} className="hero-editorial-desc animate-desc">
            {activeSlide.desc}
          </p>

          {/* CTA Action Button */}
          <div className="hero-cta-action">
            <button
              type="button"
              className="hero-primary-cta"
              onClick={() => onActionClick && onActionClick(activeSlide.targetLayer)}
            >
              <span>{activeSlide.ctaText}</span>
              <div className="cta-icon-circle">
                <ArrowRight size={15} />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Pagination Dots */}
        <div className="hero-slider-bottom-bar">
          <div className="hero-pagination-dots" role="tablist" aria-label="Pilih Slide">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Buka slide ${idx + 1}: ${slide.title}`}
                  className={`hero-dot ${isActive ? 'active' : ''}`}
                  onClick={() => goToSlide(idx)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Arrows: Left & Right */}
      <button
        type="button"
        className="hero-nav-arrow arrow-prev"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        className="hero-nav-arrow arrow-next"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

