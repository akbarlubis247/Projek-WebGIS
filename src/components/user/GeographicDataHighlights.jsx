import React from 'react';
import { MapPin, Building2, Layers, ShieldCheck } from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR, FOOD_SECURITY_CATEGORIES } from '../../data/bogorData';
import { KELURAHAN_68_BOGOR } from '../../data/bogorKelurahanData';
import { LAYER_DEFINITIONS } from '../../data/indicatorStandards';

export default function GeographicDataHighlights() {
  const highlights = [
    {
      id: 'kecamatan',
      value: KECAMATAN_KOTA_BOGOR.length, // 6
      unit: 'Kecamatan',
      label: 'Wilayah Administratif',
      desc: 'B. Tengah, Utara, Selatan, Timur, Barat, T. Sareal',
      icon: MapPin
    },
    {
      id: 'kelurahan',
      value: KELURAHAN_68_BOGOR.length, // 68
      unit: 'Kelurahan',
      label: 'Cakupan Kelurahan',
      desc: 'Batas spasial digital terpetakan lengkap',
      icon: Building2
    },
    {
      id: 'indikator',
      value: Object.keys(LAYER_DEFINITIONS).length + 2, // 6
      unit: 'Indikator Utama',
      label: 'Parameter Terintegrasi',
      desc: 'IKP, Air Bersih, Stunting, Faskes & Pasar',
      icon: Layers
    },
    {
      id: 'kategori',
      value: FOOD_SECURITY_CATEGORIES.length, // 5
      unit: 'Kategori Status',
      label: 'Klasifikasi Ketahanan',
      desc: 'Sangat Aman hingga Sangat Rawan Pangan',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="editorial-kpi-strip" aria-label="Ringkasan Data Geografis Kota Bogor">
      <div className="editorial-kpi-container">
        <div className="editorial-kpi-grid">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="editorial-kpi-item">
                <div className="kpi-metric-row">
                  <span className="kpi-serif-number">{item.value}</span>
                  <div className="kpi-unit-col">
                    <span className="kpi-unit-text">{item.unit}</span>
                    <Icon size={14} className="kpi-mini-icon" />
                  </div>
                </div>
                <div className="kpi-label-row">
                  <h3 className="kpi-title">{item.label}</h3>
                  <p className="kpi-subtext">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
