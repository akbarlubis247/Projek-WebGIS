export const SPATIAL_LAYER_CATALOG = [
  { id: 'administrasi', label: 'Batas Administrasi', category: 'Fondasi peta', status: 'pending', statusLabel: 'Belum diintegrasikan', coverage: 'Batas kecamatan dan kelurahan', period: 'Dataset kandidat: 2014', source: 'CSV geometri pada repo backend · perlu validasi', description: 'Peta publik saat ini belum menggambar poligon batas; ia hanya menunjukkan pin representasi kecamatan.' },
  { id: 'indikator', label: 'Indikator Sosial', category: 'Agregat wilayah', status: 'prototype', statusLabel: 'Prototipe UI', coverage: 'Ringkasan tingkat kecamatan', period: 'CSV periodik · bukan real-time', source: 'Dataset kelompok NutriMap', description: 'Menampilkan ketahanan pangan, akses air bersih, kesejahteraan, dan stunting sebagai ringkasan analitis.' },
  { id: 'pasar', label: 'Pasar Tradisional', category: 'Fasilitas pangan', status: 'pending', statusLabel: 'Menunggu verifikasi', coverage: 'Titik lokasi pasar', period: 'Belum ditetapkan', source: 'Perlu sumber resmi atau data terbuka yang diverifikasi', description: 'Layer prioritas untuk menjelaskan akses dan distribusi pangan tanpa menyimpulkan kualitas ataupun kecukupan stok.' },
  { id: 'air', label: 'Aset Air & PDAM', category: 'Infrastruktur air', status: 'pending', statusLabel: 'Menunggu verifikasi', coverage: 'Titik fasilitas atau jaringan resmi', period: 'Belum ditetapkan', source: 'Perumda Tirta Pakuan / instansi terkait', description: 'Lokasi kantor atau instalasi tidak boleh dipakai untuk menyimpulkan cakupan layanan maupun jalur pipa.' },
  { id: 'kebun', label: 'Kebun & Lahan Produktif', category: 'Dukungan pangan', status: 'research', statusLabel: 'Tahap pencarian data', coverage: 'Poligon atau titik lahan produktif', period: 'Belum ditetapkan', source: 'Perlu dataset penggunaan lahan yang relevan', description: 'Dapat memperkaya konteks pangan setelah klasifikasi lahan dan tahun data diperiksa.' }
];

export const MAP_PRESENTATION_NOTICE = {
  title: 'Mode demonstrasi frontend',
  description: 'Peta saat ini memvisualisasikan indikator agregat untuk kebutuhan desain dan presentasi. Layer fasilitas baru diaktifkan setelah koordinat, sumber, dan periode datanya diverifikasi.',
  updatedAt: '28 September 2026'
};

export const DATA_GOVERNANCE_CHECKLIST = [
  'Nama wilayah dan kode join konsisten',
  'Koordinat atau geometri dapat ditelusuri sumbernya',
  'Tahun dan periode observasi dicantumkan',
  'Data faktual dibedakan dari skor hasil perhitungan',
  'Tidak menyimpulkan cakupan layanan dari satu titik fasilitas'
];
