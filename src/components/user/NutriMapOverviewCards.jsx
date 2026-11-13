import React from 'react';
import { ArrowRight } from 'lucide-react';

import illPangan from '../../assets/ill_pangan_trans.png';
import illAir from '../../assets/ill_air_trans.png';
import illStunting from '../../assets/ill_stunting_trans.png';

export default function NutriMapOverviewCards({ onSelectCategory }) {
  const categories = [
    {
      id: 'pangan',
      title: 'Ketahanan Pangan',
      desc: 'Pemetaan potensi pangan di Kota Bogor.',
      cta: 'Jelajahi Data',
      layer: 'pangan',
      img: illPangan,
      cardClass: 'card-pangan',
      btnClass: 'btn-pangan',
      alt: 'Ilustrasi aneka komoditas pangan segar'
    },
    {
      id: 'air',
      title: 'Akses Air Bersih',
      desc: 'Informasi sumber dan akses air bersih.',
      cta: 'Lihat Peta',
      layer: 'air',
      img: illAir,
      cardClass: 'card-air',
      btnClass: 'btn-air',
      alt: 'Ilustrasi kran dan aliran air bersih higienis'
    },
    {
      id: 'stunting',
      title: 'Gizi Sehat & Penanganan Stunting',
      desc: 'Dukung generasi sehat untuk masa depan.',
      cta: 'Jelajahi Data',
      layer: 'stunting',
      img: illStunting,
      cardClass: 'card-stunting',
      btnClass: 'btn-stunting',
      alt: 'Ilustrasi keluarga sehat sejahtera Kota Bogor'
    }
  ];

  return (
    <section className="nutrimap-info-overview-section">
      <div className="overview-container">
        {/* Section Header */}
        <div className="info-overview-header">
          <h2 className="overview-title">Jelajahi Informasi NutriMap</h2>
          <p className="overview-subtitle">
            Akses data spasial untuk mendukung ketahanan pangan dan kesehatan di Kota Bogor
          </p>
        </div>

        {/* 3 Categories Cards Grid */}
        <div className="info-cards-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`info-overview-card ${cat.cardClass}`}
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
              <div className="card-illustration-wrap">
                <img src={cat.img} alt={cat.alt} className="card-ill-img" />
              </div>

              <div className="card-content-wrap">
                <h3 className="card-title">{cat.title}</h3>
                <p className="card-desc">{cat.desc}</p>
                <div className={`card-action-btn ${cat.btnClass}`}>
                  <span>{cat.cta}</span>
                  <div className="btn-arrow-circle">
                    <ArrowRight size={14} />
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

