import React from 'react';
import { Database, ExternalLink } from 'lucide-react';
import { KujangOrnament, BogorBotanicalOrnament } from '../common/BogorDecorations';

export default function DataSourceMethodology({ methodologySection }) {
  const sources = [
    {
      nama: 'Satu Peta Kota Bogor',
      url: 'https://satupeta.kotabogor.go.id/maps',
      tipe: 'Peta Geospasial & Batas Administrasi Wilayah',
      lembaga: 'Bappeda Kota Bogor'
    },
    {
      nama: 'Badan Pusat Statistik (BPS)',
      url: 'https://bogorkota.bps.go.id/',
      tipe: 'Data Kependudukan, Luas Wilayah & Kemiskinan Makro',
      lembaga: 'BPS Kota Bogor'
    },
    {
      nama: 'Dinas Ketahanan Pangan & Pertanian (DKP)',
      url: 'https://dkp.kotabogor.go.id/',
      tipe: 'Indeks Ketahanan Pangan (IKP) & Audit Keamanan Pasar',
      lembaga: 'Pemerintah Kota Bogor'
    },
    {
      nama: 'Dinas Kesehatan Kota Bogor',
      url: 'https://dinkes.kotabogor.go.id/',
      tipe: 'Prevalensi Balita Stunting (E-PPGBM) & Faskes',
      lembaga: 'Pemerintah Kota Bogor'
    },
    {
      nama: 'Perumda Tirta Pakuan Kota Bogor',
      url: 'https://tirtapakuan.co.id/',
      tipe: 'Cakupan & Jaringan Sambungan Rumah (SR) Air Bersih',
      lembaga: 'BUMD Air Minum Kota Bogor'
    }
  ];

  return (
    <section id="metodologi-sumber" className="methodology-section" aria-label="Sumber Data dan Metodologi Sistem">
      <div className="methodology-container" style={{ position: 'relative' }}>
        {/* Ornamen Botanikal Tropis di Area Kosong Kiri (Lingkaran Merah 3) */}
        <div className="methodology-deco-left" aria-hidden="true">
          <BogorBotanicalOrnament variant="leaf" size={82} color="#829783" opacity={0.28} />
        </div>

        {/* Ornamen Kujang di Area Kosong Kanan (Lingkaran Merah 4) */}
        <div className="methodology-deco-right" aria-hidden="true">
          <KujangOrnament size={88} color="#B89D62" opacity={0.32} />
        </div>

        {/* Section Header */}
        <div className="ladang-section-head">
          {methodologySection?.tag && (
            <span className="section-eyebrow">{methodologySection.tag}</span>
          )}
          <h2>{methodologySection?.title || 'Sumber Data Resmi Kota Bogor'}</h2>
          {methodologySection?.subtitle && (
            <p>{methodologySection.subtitle}</p>
          )}
        </div>

        {/* Official Sources Directory Table / Grid */}
        <div className="sources-directory-box">
          <div className="s-dir-header">
            <Database size={16} className="text-primary-green" />
            <h4 className="s-dir-title">Daftar Sumber Data Resmi &amp; Lembaga Penyedia</h4>
          </div>
          <div className="s-dir-grid">
            {sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="source-item-link"
                title={`Kunjungi portal resmi ${src.nama}`}
              >
                <div className="source-info">
                  <span className="source-name">{src.nama}</span>
                  <span className="source-type">{src.tipe}</span>
                  <span className="source-agency">{src.lembaga}</span>
                </div>
                <ExternalLink size={14} className="source-ext-icon" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

