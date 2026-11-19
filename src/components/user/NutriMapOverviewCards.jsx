import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { MountSalakSilhouette, KujangOrnament } from '../common/BogorDecorations';

import illPangan from '../../assets/ill_pangan_trans.png';
import illAir from '../../assets/ill_air_trans.png';
import illStunting from '../../assets/ill_stunting_trans.png';

export default function NutriMapOverviewCards({ onSelectCategory, overviewSection }) {
  const categories = [
    {
      id: 'pangan',
      tag: 'PILAR 01',
      title: 'Ketahanan Pangan',
      desc: 'Pemetaan komprehensif ketersediaan komoditas, sebaran pasar tradisional, dan indeks ketahanan pangan (IKP) wilayah.',
      cta: 'Jelajahi Data Pangan',
      layer: 'pangan',
      img: illPangan,
      cardClass: 'card-editorial-pangan',
      alt: 'Ilustrasi aneka komoditas pangan segar Kota Bogor'
    },
    {
      id: 'air',
      tag: 'PILAR 02',
      title: 'Akses Air Bersih',
      desc: 'Analisis jangkauan PDAM Tirta Pakuan, sebaran instalasi pengolahan air bersih, dan persentase sanitasi layak rumah tangga.',
      cta: 'Lihat Jaringan Air',
      layer: 'air',
      img: illAir,
      cardClass: 'card-editorial-air',
      alt: 'Ilustrasi instalasi aliran air bersih higienis'
    },
    {
      id: 'stunting',
      tag: 'PILAR 03',
      title: 'Gizi Sehat & Penanganan Stunting',
      desc: 'Monitoring prevalensi stunting balita, sebaran 64 faskes rujukan, dan intervensi gizi terpadu di 68 kelurahan.',
      cta: 'Pantau Sebaran Gizi',
      layer: 'stunting',
      img: illStunting,
      cardClass: 'card-editorial-stunting',
      alt: 'Ilustrasi keluarga sehat sejahtera Kota Bogor'
    }
  ];

  return (
    <section className="nutrimap-info-overview-section" aria-label="Kategori Informasi NutriMap">
      {/* Ornamen Siluet Gunung Salak di Area Kosong Kanan Atas (Sesuai Referensi Lingkaran Merah 1) */}
      <div className="overview-salak-ornament" aria-hidden="true">
        <MountSalakSilhouette width={160} height={52} color="#829783" opacity={0.25} />
        <span className="overview-salak-label">GUNUNG SALAK • 2.211 MDPL</span>
      </div>

      {/* Ornamen Kujang di Area Kosong Kiri Margin (Sesuai Referensi Lingkaran Merah 2) */}
      <div className="overview-kujang-ornament" aria-hidden="true">
        <KujangOrnament size={84} color="#C9B98E" opacity={0.22} />
      </div>

      <div className="overview-editorial-container">
        {/* Section Header */}
        <div className="editorial-section-header">
          {overviewSection?.eyebrow && (
            <div className="editorial-eyebrow">
              <span className="eyebrow-accent-line" />
              <span className="eyebrow-text">{overviewSection.eyebrow}</span>
            </div>
          )}
          <h2 className="editorial-section-title">
            {overviewSection?.title || 'Fokus Informasi & Intervensi NutriMap'}
          </h2>
          {overviewSection?.description && (
            <p className="editorial-section-desc">
              {overviewSection.description}
            </p>
          )}
        </div>

        {/* 3 Categories Cards Grid */}
        <div className="info-cards-editorial-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`info-overview-editorial-card ${cat.cardClass}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.layer)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onSelectCategory) onSelectCategory(cat.layer);
                }
              }}
              aria-label={`Buka data kategori ${cat.title}`}
            >
              <div className="card-illustration-frame">
                <span className="card-tag-pill">{cat.tag}</span>
                <img src={cat.img} alt={cat.alt} className="card-editorial-img" />
              </div>

              <div className="card-body-frame">
                <h3 className="card-serif-title">{cat.title}</h3>
                <p className="card-editorial-desc">{cat.desc}</p>
                <div className="card-action-editorial-btn">
                  <span>{cat.cta}</span>
                  <div className="action-circle-icon">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
