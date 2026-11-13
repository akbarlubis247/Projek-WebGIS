// Standar Klasifikasi Indikator NutriMap Kota Bogor (5 Tingkat Sesuai Standar SIG)
// Menjamin sinkronisasi 100% antara Poligon Peta, Legenda Kanan Bawah, Pop-up Kelurahan, dan Panel Analisis Kanan.

export const LAYER_DEFINITIONS = {
  stunting: {
    id: 'stunting',
    propKey: 'stunting',
    label: 'Prevalensi Stunting (C1)',
    shortLabel: 'Stunting',
    unit: '%',
    type: 'benefit', // Semakin tinggi semakin butuh penanganan (merah)
    legendTitle: 'Prevalensi Stunting (%)',
    thresholds: [
      { min: 4.5, max: 100, label: '≥ 4.5% (Sangat Tinggi)', shortTier: 'Sangat Tinggi', status: 'Sangat Tinggi (Kritis)', color: '#991b1b', bg: '#fef2f2', border: '#fecaca', textBadge: '#991b1b' },
      { min: 3.5, max: 4.49, label: '3.5% - 4.4% (Tinggi)', shortTier: 'Tinggi', status: 'Tinggi (Prioritas)', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', textBadge: '#dc2626' },
      { min: 2.5, max: 3.49, label: '2.5% - 3.4% (Sedang)', shortTier: 'Sedang', status: 'Sedang (Waspada)', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textBadge: '#ea580c' },
      { min: 1.5, max: 2.49, label: '1.5% - 2.4% (Rendah)', shortTier: 'Rendah', status: 'Rendah (Terkendali)', color: '#facc15', bg: '#fefce8', border: '#fef08a', textBadge: '#ca8a04' },
      { min: 0, max: 1.49, label: '< 1.5% (Sangat Rendah)', shortTier: 'Sangat Rendah', status: 'Sangat Rendah (Aman)', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', textBadge: '#16a34a' }
    ]
  },
  kemiskinan: {
    id: 'kemiskinan',
    propKey: 'kemiskinan',
    label: 'Tingkat Kemiskinan / DTKS (C2)',
    shortLabel: 'Kemiskinan',
    unit: '%',
    type: 'benefit',
    legendTitle: 'Tingkat Kemiskinan (%)',
    thresholds: [
      { min: 10.0, max: 100, label: '≥ 10.0% (Kritis)', shortTier: 'Kritis', status: 'Kritis (Prioritas Utama)', color: '#991b1b', bg: '#fef2f2', border: '#fecaca', textBadge: '#991b1b' },
      { min: 7.5, max: 9.99, label: '7.5% - 9.9% (Tinggi)', shortTier: 'Tinggi', status: 'Tinggi (Perhatian)', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', textBadge: '#dc2626' },
      { min: 5.5, max: 7.49, label: '5.5% - 7.4% (Sedang)', shortTier: 'Sedang', status: 'Sedang', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textBadge: '#ea580c' },
      { min: 4.0, max: 5.49, label: '4.0% - 5.4% (Rendah)', shortTier: 'Rendah', status: 'Rendah', color: '#facc15', bg: '#fefce8', border: '#fef08a', textBadge: '#ca8a04' },
      { min: 0, max: 3.99, label: '< 4.0% (Sangat Rendah)', shortTier: 'Sangat Rendah', status: 'Sangat Rendah (Aman)', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', textBadge: '#16a34a' }
    ]
  },
  pangan: {
    id: 'pangan',
    propKey: 'kerentananPangan',
    label: 'Kerentanan Pangan (C3)',
    shortLabel: 'Kerentanan Pangan',
    unit: 'skor',
    type: 'benefit',
    legendTitle: 'Kerentanan Pangan (Skor 0-100)',
    thresholds: [
      { min: 32.0, max: 100, label: '≥ 32.0 (Sangat Rawan)', shortTier: 'Sangat Rawan', status: 'Sangat Rawan (Kritis)', color: '#991b1b', bg: '#fef2f2', border: '#fecaca', textBadge: '#991b1b' },
      { min: 30.0, max: 31.99, label: '30.0 - 31.9 (Rawan)', shortTier: 'Rawan', status: 'Rawan Pangan', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', textBadge: '#dc2626' },
      { min: 27.0, max: 29.99, label: '27.0 - 29.9 (Waspada)', shortTier: 'Waspada', status: 'Waspada Pangan', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textBadge: '#ea580c' },
      { min: 24.0, max: 26.99, label: '24.0 - 26.9 (Aman)', shortTier: 'Aman', status: 'Aman Pangan', color: '#facc15', bg: '#fefce8', border: '#fef08a', textBadge: '#ca8a04' },
      { min: 0, max: 23.99, label: '< 24.0 (Sangat Aman)', shortTier: 'Sangat Aman', status: 'Sangat Aman', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', textBadge: '#16a34a' }
    ]
  },
  air: {
    id: 'air',
    propKey: 'airBersih',
    label: 'Akses Sanitasi Air Bersih (C4)',
    shortLabel: 'Air Bersih',
    unit: '%',
    type: 'cost', // Semakin rendah persentase semakin merah (krisis air)
    legendTitle: 'Akses Air Bersih Layak (%)',
    thresholds: [
      { min: 0, max: 40.0, label: '≤ 40.0% (Krisis Air / Buruk)', shortTier: 'Krisis / Buruk', status: 'Krisis Air (Buruk)', color: '#991b1b', bg: '#fef2f2', border: '#fecaca', textBadge: '#991b1b' },
      { min: 40.01, max: 59.99, label: '40.1% - 59.9% (Rentan)', shortTier: 'Rentan', status: 'Rentan Air', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', textBadge: '#dc2626' },
      { min: 60.0, max: 79.99, label: '60.0% - 79.9% (Cukup)', shortTier: 'Cukup', status: 'Cukup', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textBadge: '#ea580c' },
      { min: 80.0, max: 94.99, label: '80.0% - 94.9% (Baik)', shortTier: 'Baik', status: 'Baik', color: '#facc15', bg: '#fefce8', border: '#fef08a', textBadge: '#ca8a04' },
      { min: 95.0, max: 100, label: '≥ 95.0% (Sangat Baik)', shortTier: 'Sangat Baik', status: 'Sangat Baik (Aman)', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', textBadge: '#16a34a' }
    ]
  }
};

/**
 * Dapatkan informasi klasifikasi, warna peta, warna badge teks, dan label status
 * yang sinkron 100% antara Peta, Legenda, Pop-up, dan Panel Kanan.
 */
export function getIndicatorClassification(layerKey, value) {
  const def = LAYER_DEFINITIONS[layerKey] || LAYER_DEFINITIONS.stunting;
  const val = Number(value) || 0;

  for (let i = 0; i < def.thresholds.length; i++) {
    const t = def.thresholds[i];
    if (def.type === 'cost') {
      if (val <= t.max && (t.min === 0 || val >= t.min)) {
        return { ...t, layerLabel: def.label, shortLabel: def.shortLabel, unit: def.unit, tierIndex: i };
      }
    } else {
      if (val >= t.min) {
        return { ...t, layerLabel: def.label, shortLabel: def.shortLabel, unit: def.unit, tierIndex: i };
      }
    }
  }

  const fallback = def.thresholds[def.thresholds.length - 1];
  return { ...fallback, layerLabel: def.label, shortLabel: def.shortLabel, unit: def.unit, tierIndex: def.thresholds.length - 1 };
}
