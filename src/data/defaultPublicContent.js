// ==========================================================================
// DEFAULT PUBLIC CONTENT CONFIGURATION (NutriMap Kota Bogor)
// Seluruh konten teks, headline, narasi, dan metrik yang tampil di halaman
// umum (warga / publik tanpa role) disimpan di sini dan dapat diedit oleh Admin
// melalui Menu "Kelola Konten Publik (CMS)" tanpa perlu mengubah kode frontend.
// ==========================================================================

export const DEFAULT_PUBLIC_CONTENT = {
  images: {
    heroBanner: '', // string kosong = menggunakan file bawaan heroBg
    pdamFacility: '', // string kosong = menggunakan file bawaan pdamFacilityImg
    stuntingPrevention: '', // string kosong = menggunakan file bawaan stuntingImg
    foodInspection: '', // string kosong = menggunakan file bawaan foodInspectionImg
    introBg: '', // string kosong = menggunakan file bawaan introBgImg
  },
  gallery: [
    {
      id: 'gal-1',
      title: 'Instalasi Pengolahan Air Minum (IPA) Dekeng',
      category: 'Air Bersih',
      url: '/foto-info/pdam/pdam.jpeg',
      description: 'Unit sedimentasi dan pengolahan distribusi air bersih Perumda Tirta Pakuan Kota Bogor.'
    },
    {
      id: 'gal-2',
      title: 'Penimbangan & Deteksi Tumbuh Kembang Balita',
      category: 'Gizi & Stunting',
      url: '/foto-info/pos-yandu/pos-yandu.jpeg',
      description: 'Kegiatan rutin Posyandu terpadu untuk monitoring berat badan dan tinggi balita.'
    },
    {
      id: 'gal-3',
      title: 'Audit Higienitas & Sidak Uji Bahan Pangan Segar',
      category: 'Keamanan Pangan',
      url: '/foto-info/pasar/inspeksi-pangan.jpeg',
      description: 'Rapid test kit boraks, formalin, dan residu pestisida komoditas pasar rakyat.'
    },
    {
      id: 'gal-4',
      title: 'Sosialisasi Pencegahan Stunting & Pola Asuh Gizi',
      category: 'Gizi & Stunting',
      url: '/foto-info/pos-yandu/sosialiasi.jpeg',
      description: 'Penyuluhan gizi seimbang kader PKK dan Dinkes Kota Bogor bagi ibu hamil.'
    },
    {
      id: 'gal-5',
      title: 'Aktivitas Transaksi Komoditas Pangan Pasar Tradisional',
      category: 'Ketahanan Pangan',
      url: '/foto-info/pasar/pasar.jpeg',
      description: 'Pemantauan stabilitas pasokan pangan strategis di pasar tradisional Kota Bogor.'
    },
    {
      id: 'gal-6',
      title: 'Fasilitas Distribusi Pipa Jaringan PDAM',
      category: 'Air Bersih',
      url: '/foto-info/pdam/pdam-2.jpeg',
      description: 'Pemeriksaan debit dan kualitas pipa transmisi air bersih menuju 6 kecamatan.'
    }
  ],
  hero: {
    title: "Ketahanan Pangan Tangguh, Akses Air Bersih, dan Gizi Sehat Kota Bogor",
    subtitle: "NutriMap Bogor: proyek WebGIS interaktif berbasis teknologi geografis untuk pemetaan ketahanan pangan dan gizi sehat Kota Bogor.",
    badgeText: "Portal Resmi Geospasial Pemkot Bogor",
  },
  manifesto: {
    title: "Mewujudkan Kota Bogor Berketahanan Pangan Berbasis Data Geografis Nyata",
    text: "Sebagai sarana perumusan kebijakan berbasis spasial (Data-Driven Spatial Policy), NutriMap Kota Bogor menghubungkan data kependudukan, keterjangkauan komoditas pangan pokok, pengawasan keamanan pangan di pasar tradisional, dan indeks stunting pada 6 kecamatan. Menghadirkan informasi yang transparan, mudah diakses masyarakat, dan dapat dipertanggungjawabkan untuk kesejahteraan bersama.",
  },
  pillars: {
    sectionTitle: "4 Pilar Utama Pemantauan Spasial Kota",
    sectionSubtitle: "Indikator terukur yang menjadi acuan intervensi prioritas jajaran dinas terkait Pemerintah Kota Bogor.",
    ikp: {
      label: "Indeks Ketahanan Pangan (IKP)",
      value: "88.2",
      unit: "/ 100",
      badge: "Sangat Baik",
      badgeColor: "green",
    },
    air: {
      label: "Akses Air Bersih Layak",
      value: "89.6%",
      unit: "Populasi",
      badge: "Aman & Stabil",
      badgeColor: "teal",
    },
    stunting: {
      label: "Prevalensi Balita Stunting",
      value: "15.4%",
      unit: "Rata-rata",
      badge: "Perhatian Khusus",
      badgeColor: "orange",
    },
    pasar: {
      label: "Pengawasan Pasar Rakyat",
      value: "96%",
      unit: "Lolos Lab",
      badge: "Standar BPOM",
      badgeColor: "blue",
    },
  },
  spotlightPdam: {
    headline: "Instalasi Pengolahan Air (IPA) PDAM Tirta Pakuan",
    description: "Pusat pengolahan dan distribusi air minum terintegrasi yang menyuplai kebutuhan air bersih untuk 6 kecamatan di Kota Bogor. Terhubung dengan sistem pemantauan geospasial NutriMap guna menjamin kontinuitas debit air layak minum dan mendukung sanitasi keluarga sehat.",
    metric1Val: "89.6%",
    metric1Lbl: "Cakupan Akses Kota",
    metric2Val: "2.400 L/s",
    metric2Lbl: "Debit Air Terolah",
    metric3Val: "170.000+",
    metric3Lbl: "Sambungan Rumah (SR)",
    buttonText: "Lihat Sebaran Air Bersih di Peta Spasial",
    sourceText: "Sumber Data: Perumda Tirta Pakuan Kota Bogor",
  },
  spotlightStunting: {
    headline: "Sosialisasi & Deteksi Dini Pencegahan Stunting",
    description: "Gerakan terintegrasi jajaran Dinas Kesehatan, kader Posyandu, dan TP-PKK Kota Bogor dalam pemantauan rutin tumbuh kembang balita, deteksi dini risiko stunting, edukasi pola asuh gizi seimbang, serta pendistribusian makanan tambahan (PMT) kaya nutrisi di seluruh kelurahan.",
    targetVal: "< 10%",
    targetLbl: "Target: < 10%",
    subTargetLbl: "Prevalensi Balita Kota Bogor",
    posyanduVal: "863+",
    posyanduLbl: "68 Kelurahan",
    subPosyanduLbl: "Posyandu Aktif Terpadu",
    buttonText: "Lihat Grafik Komparasi Stunting",
    sourceText: "Sumber Data: Dinas Kesehatan Kota Bogor",
  },
  spotlightFood: {
    headline: "Pengawasan Pangan Terpadu di Pasar Tradisional",
    description: "Pelaksanaan audit higienitas serta uji sampel acak cepat (rapid test kit) residu pestisida, formalin, dan boraks pada komoditas pangan segar—seperti daging ayam potong, sayuran segar, ikan, dan bahan pokok—bersama Satgas Pangan & Balai POM di seluruh pasar rakyat Kota Bogor guna menjamin peredaran pangan yang aman dan bermutu bagi masyarakat.",
    auditVal: "48 Lokasi",
    auditLbl: "Audit Pasar 2026",
    passRateVal: "96% Lolos",
    passRateLbl: "Standar Higienis BPOM",
    marketCountVal: "4 Pasar",
    marketCountLbl: "Fokus Pantauan Rutin",
    marketChips: ["Pasar Anyar", "Pasar Bogor", "Pasar Sukasari", "Pasar Induk TU Kemang"],
    sourceText: "Sumber Data: Dinas Ketahanan Pangan & Balai POM",
  },
  spatialSection: {
    title: "Peta Spasial Ketahanan Pangan Kota Bogor",
    subtitle: "Eksplorasi kondisi 6 kecamatan Kota Bogor berdasarkan skor IKP, akses air minum layak, prevalensi stunting, dan sebaran fasilitas publik.",
  },
  indicatorSection: {
    title: "Data Indikator Kota Bogor",
    subtitle: "Tabel interaktif kependudukan dan komparasi grafis indikator ketahanan pangan lintas kecamatan.",
  },
  aboutSection: {
    title: "Tentang NutriMap Kota Bogor",
    subtitle: "Portal Sistem Informasi Geografis Pemantauan Ketahanan Pangan & Kesejahteraan Terpadu",
    description: "NutriMap Kota Bogor merupakan sistem informasi geospasial terintegrasi yang dikembangkan untuk mendukung pemantauan, analisis, dan pengambilan kebijakan berbasis data spasial terkait ketahanan pangan, akses sanitasi air bersih, serta prevalensi stunting balita di 6 kecamatan dan 68 kelurahan Kota Bogor.",
    objectives: [
      "Pemetaan 6 Kecamatan di Kota Bogor berdasarkan Indeks Ketahanan Pangan (IKP).",
      "Monitoring real-time cakupan akses air bersih layak (PDAM Tirta Pakuan).",
      "Deteksi awal dan intervensi cepat pada kelurahan dengan angka stunting balita tinggi.",
      "Pengawasan dan transparansi sidak laboratorium keamanan pangan di pasar tradisional.",
    ],
    address: "Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121",
    phone: "(0251) 8321075 / Call Center 112 Kota Bogor",
    email: "bappeda@kotabogor.go.id / dkp@kotabogor.go.id",
    officeHours: "Senin - Jumat: 08.00 - 16.00 WIB",
    sourceLinkTitle: "Peta | Satu Peta Kota Bogor",
    sourceLinkUrl: "https://satupeta.kotabogor.go.id/maps",
  },
  footer: {
    copyright: "© 2026 Pemerintah Kota Bogor - Bappeda & Dinas Ketahanan Pangan. Hak Cipta Dilindungi.",
    tagline: "Sistem Informasi Geografis Ketahanan Pangan & Pemantauan Kesejahteraan Warga",
  }
};

const STORAGE_KEY = 'nutrimap_public_content_v1';

export function getPublicContent() {
  if (typeof window === 'undefined') return DEFAULT_PUBLIC_CONTENT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PUBLIC_CONTENT;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_PUBLIC_CONTENT,
      ...parsed,
      images: {
        ...DEFAULT_PUBLIC_CONTENT.images,
        ...(parsed.images || {})
      },
      gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0
        ? parsed.gallery
        : DEFAULT_PUBLIC_CONTENT.gallery,
      hero: { ...DEFAULT_PUBLIC_CONTENT.hero, ...parsed.hero },
      manifesto: { ...DEFAULT_PUBLIC_CONTENT.manifesto, ...parsed.manifesto },
      pillars: {
        ...DEFAULT_PUBLIC_CONTENT.pillars,
        ...parsed.pillars,
        ikp: { ...DEFAULT_PUBLIC_CONTENT.pillars.ikp, ...(parsed.pillars && parsed.pillars.ikp) },
        air: { ...DEFAULT_PUBLIC_CONTENT.pillars.air, ...(parsed.pillars && parsed.pillars.air) },
        stunting: { ...DEFAULT_PUBLIC_CONTENT.pillars.stunting, ...(parsed.pillars && parsed.pillars.stunting) },
        pasar: { ...DEFAULT_PUBLIC_CONTENT.pillars.pasar, ...(parsed.pillars && parsed.pillars.pasar) },
      },
      spotlightPdam: { ...DEFAULT_PUBLIC_CONTENT.spotlightPdam, ...parsed.spotlightPdam },
      spotlightStunting: { ...DEFAULT_PUBLIC_CONTENT.spotlightStunting, ...parsed.spotlightStunting },
      spotlightFood: { ...DEFAULT_PUBLIC_CONTENT.spotlightFood, ...parsed.spotlightFood },
      spatialSection: { ...DEFAULT_PUBLIC_CONTENT.spatialSection, ...parsed.spatialSection },
      indicatorSection: { ...DEFAULT_PUBLIC_CONTENT.indicatorSection, ...parsed.indicatorSection },
      aboutSection: { ...DEFAULT_PUBLIC_CONTENT.aboutSection, ...parsed.aboutSection },
      footer: { ...DEFAULT_PUBLIC_CONTENT.footer, ...parsed.footer },
    };
  } catch (e) {
    console.error('Failed to parse public content from localStorage:', e);
    return DEFAULT_PUBLIC_CONTENT;
  }
}

export function savePublicContent(newContent) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    window.dispatchEvent(new Event('nutrimap_content_updated'));
  } catch (e) {
    console.error('Failed to save public content to localStorage:', e);
  }
}

export function resetPublicContent() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('nutrimap_content_updated'));
  } catch (e) {
    console.error('Failed to reset public content:', e);
  }
}

export function updatePublicImage(key, value) {
  const current = getPublicContent();
  const updated = {
    ...current,
    images: {
      ...current.images,
      [key]: value
    }
  };
  savePublicContent(updated);
  return updated;
}

export function resetPublicImage(key) {
  return updatePublicImage(key, '');
}

export function updatePublicGallery(galleryArray) {
  const current = getPublicContent();
  const updated = {
    ...current,
    gallery: galleryArray
  };
  savePublicContent(updated);
  return updated;
}


