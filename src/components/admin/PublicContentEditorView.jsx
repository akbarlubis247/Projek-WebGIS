import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  FileText,
  Droplets,
  HeartPulse,
  Utensils,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  AlertCircle,
  Image as ImageIcon,
  Camera,
  FolderPlus,
  Maximize2
} from 'lucide-react';
import {
  DEFAULT_PUBLIC_CONTENT,
  getPublicContent,
  savePublicContent,
  resetPublicContent
} from '../../data/defaultPublicContent';
import ImageFieldUploader from './ImageFieldUploader';

// Default Asset References
import heroBg from '../../assets/hero-banner.png';
import pdamFacilityImg from '../../assets/pdam-facility.jpg';
import stuntingImg from '../../assets/stunting-prevention.jpg';
import foodInspectionImg from '../../assets/food-inspection.jpg';
import introBgImg from '../../assets/intro-bg.png';

// Presets from official project documentation photos
const PDAM_PRESETS = [
  { label: 'Intake PDAM Dekeng', url: '/foto-info/pdam/pdam.jpeg', category: 'Instalasi IPA' },
  { label: 'Pipa Jaringan Transmisi', url: '/foto-info/pdam/pdam-2.jpeg', category: 'Transmisi Pipa' },
  { label: 'Reservoar Air Bersih', url: '/foto-info/pdam/pdam3.jpeg', category: 'Reservoar' },
  { label: 'Peralatan Teknis IPA', url: '/foto-info/pdam/d62626ed-8791-4462-9cf5-e923e6389f28.jpeg', category: 'Teknis' }
];

const STUNTING_PRESETS = [
  { label: 'Penimbangan Balita Posyandu', url: '/foto-info/pos-yandu/pos-yandu.jpeg', category: 'Posyandu Terpadu' },
  { label: 'Sosialisasi Gizi Balita Dinkes', url: '/foto-info/pos-yandu/sosialiasi.jpeg', category: 'Dinkes & PKK' },
  { label: 'Pemeriksaan Kesehatan Anak', url: '/foto-info/pos-yandu/pos-yandu1.jpeg', category: 'Puskesmas' },
  { label: 'Pemberian Makanan Tambahan', url: '/foto-info/pos-yandu/pos-yandu2.jpeg', category: 'PMT Gizi' }
];

const FOOD_PRESETS = [
  { label: 'Sidak Uji Lab Pasar Anyar', url: '/foto-info/pasar/inspeksi-pangan.jpeg', category: 'Sidak BPOM' },
  { label: 'Pasar Tradisional Kota Bogor', url: '/foto-info/pasar/pasar.jpeg', category: 'Komoditas' },
  { label: 'Kios Sayur & Daging Segar', url: '/foto-info/pasar/pasar2.jpeg', category: 'Pasar Rakyat' }
];

export default function PublicContentEditorView({ onNavigate }) {
  const [content, setContent] = useState(DEFAULT_PUBLIC_CONTENT);
  const [activeTab, setActiveTab] = useState('photos');
  const [toastMessage, setToastMessage] = useState('');
  const [newChip, setNewChip] = useState('');
  const [newObjective, setNewObjective] = useState('');

  // Gallery item form state
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('Ketahanan Pangan');
  const [newGalUrl, setNewGalUrl] = useState('');
  const [newGalDesc, setNewGalDesc] = useState('');

  useEffect(() => {
    setContent(getPublicContent());
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    savePublicContent(content);
    showToast('Seluruh perubahan foto & konten publik berhasil disimpan dan aktif di halaman warga!');
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh foto dan teks ke pengaturan awal bawaan sistem?')) {
      resetPublicContent();
      setContent(DEFAULT_PUBLIC_CONTENT);
      showToast('Seluruh foto dan teks berhasil di-reset ke nilai bawaan sistem.');
    }
  };

  // Deep update helper for text fields
  const updateField = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Image update helper
  const updateImage = (imageKey, value) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        images: {
          ...(prev.images || {}),
          [imageKey]: value
        }
      };
      // Auto save so image changes take effect immediately
      savePublicContent(updated);
      return updated;
    });
    showToast(`Foto berhasil diperbarui dan diterapkan ke halaman publik!`);
  };

  const updatePillar = (pillarKey, field, value) => {
    setContent((prev) => ({
      ...prev,
      pillars: {
        ...prev.pillars,
        [pillarKey]: {
          ...prev.pillars[pillarKey],
          [field]: value
        }
      }
    }));
  };

  const handleAddChip = () => {
    if (!newChip.trim()) return;
    setContent((prev) => ({
      ...prev,
      spotlightFood: {
        ...prev.spotlightFood,
        marketChips: [...prev.spotlightFood.marketChips, newChip.trim()]
      }
    }));
    setNewChip('');
  };

  const handleRemoveChip = (index) => {
    setContent((prev) => ({
      ...prev,
      spotlightFood: {
        ...prev.spotlightFood,
        marketChips: prev.spotlightFood.marketChips.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setContent((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        objectives: [...prev.aboutSection.objectives, newObjective.trim()]
      }
    }));
    setNewObjective('');
  };

  const handleRemoveObjective = (index) => {
    setContent((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        objectives: prev.aboutSection.objectives.filter((_, i) => i !== index)
      }
    }));
  };

  // Gallery handlers
  const handleAddGalleryItem = (e) => {
    if (e) e.preventDefault();
    if (!newGalTitle.trim() || !newGalUrl.trim()) {
      showToast('Harap isi judul dan foto/URL dokumentasi galeri.');
      return;
    }
    const newItem = {
      id: 'gal-' + Date.now(),
      title: newGalTitle.trim(),
      category: newGalCategory,
      url: newGalUrl.trim(),
      description: newGalDesc.trim() || 'Dokumentasi kegiatan pemantauan geospasial Kota Bogor.'
    };
    setContent((prev) => {
      const updated = {
        ...prev,
        gallery: [...(prev.gallery || []), newItem]
      };
      savePublicContent(updated);
      return updated;
    });
    setNewGalTitle('');
    setNewGalUrl('');
    setNewGalDesc('');
    showToast('Foto dokumentasi baru berhasil ditambahkan ke galeri publik!');
  };

  const handleRemoveGalleryItem = (id) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        gallery: (prev.gallery || []).filter((g) => g.id !== id)
      };
      savePublicContent(updated);
      return updated;
    });
    showToast('Foto dokumentasi berhasil dihapus dari galeri.');
  };

  const tabs = [
    { id: 'photos', label: '📸 Galeri & Foto Halaman', icon: Camera },
    { id: 'hero', label: '1. Hero & Banner', icon: Sparkles },
    { id: 'manifesto', label: '2. Visi & Manifesto', icon: FileText },
    { id: 'pillars', label: '3. 4 Pilar Indikator', icon: Layers },
    { id: 'pdam', label: '4. Spotlight PDAM', icon: Droplets },
    { id: 'stunting', label: '5. Spotlight Stunting', icon: HeartPulse },
    { id: 'food', label: '6. Keamanan Pangan', icon: ShieldCheck },
    { id: 'sections', label: '7. Judul Peta & Data', icon: MapPin },
    { id: 'about', label: '8. Kontak & Balai Kota', icon: Building2 },
  ];

  return (
    <div className="view-container animate-fade-in cms-editor-container" style={{ padding: '24px 32px' }}>
      {/* Top Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title-editorial" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Manajemen Foto &amp; Konten Publik WebGIS (CMS)
            </h1>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#047857', background: '#d1fae5', padding: '4px 10px', borderRadius: 9999, border: '1px solid #a7f3d0' }}>
              ✦ Live CMS
            </span>
          </div>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Role Admin dapat memperbarui foto judul/hero banner, foto spotlight fasilitas, foto sidak pasar, serta seluruh teks narasi halaman warga tanpa perlu mengubah kode frontend.
          </p>
        </div>

        <div className="export-action-group" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="outline-btn"
            onClick={() => onNavigate && onNavigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 8, cursor: 'pointer', fontWeight: 700, color: '#334155' }}
          >
            <Eye size={16} /> Pratinjau Halaman Warga
          </button>

          <button
            type="button"
            className="outline-btn"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 8, cursor: 'pointer', fontWeight: 700, color: '#b91c1c' }}
          >
            <RotateCcw size={16} /> Reset Default
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0f172a', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 800, color: '#ffffff', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}
          >
            <Save size={16} /> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', color: '#065f46', padding: '14px 20px', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Navigation Pill Strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, borderBottom: '2px solid #e2e8f0', marginBottom: 24 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? '#0f172a' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: 13.5,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? '#38bdf8' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

        {/* ============================================================ */}
        {/* TAB 0: CENTRAL PHOTO & DOCUMENTATION GALLERY MANAGEMENT       */}
        {/* ============================================================ */}
        {activeTab === 'photos' && (
          <div style={{ display: 'grid', gap: 28 }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Camera size={22} color="#0f766e" />
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pusat Pengelolaan Foto &amp; Galeri Halaman Publik
                </h3>
              </div>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: '6px 0 0' }}>
                Setiap slot di bawah ini memuat <strong>1 foto tunggal</strong>. Anda cukup mengunggah 1 file foto dari komputer/HP (otomatis dikompres &amp; dioptimalkan oleh sistem) untuk langsung memperbarui gambar yang tampil di web publik.
              </p>
            </div>

            {/* Grid 5 Foto Utama */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24 }}>
              {/* 1. Hero Banner */}
              <div style={{ gridColumn: '1 / -1' }}>
                <ImageFieldUploader
                  label="1. Foto Utama Banner Beranda (Judul Hero WebGIS)"
                  description="Foto panorama & judul besar di posisi paling atas halaman beranda portal NutriMap."
                  currentValue={content.images?.heroBanner || ''}
                  defaultAsset={heroBg}
                  recommendedRatio="16:9 Landscape • Min 1648 × 768 px"
                  maxDimension={1920}
                  quality={0.88}
                  onChange={(val) => updateImage('heroBanner', val)}
                />
              </div>

              {/* 2. Spotlight PDAM */}
              <ImageFieldUploader
                label="2. Foto Fasilitas PDAM Tirta Pakuan (Air Bersih)"
                description="Tampil di kartu Spotlight PDAM Beranda & Halaman Akses Air Bersih."
                currentValue={content.images?.pdamFacility || ''}
                defaultAsset={pdamFacilityImg}
                recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
                maxDimension={1200}
                onChange={(val) => updateImage('pdamFacility', val)}
              />

              {/* 3. Spotlight Stunting */}
              <ImageFieldUploader
                label="3. Foto Sosialisasi & Deteksi Stunting (Posyandu)"
                description="Tampil di kartu Spotlight Stunting Beranda & Halaman Kesejahteraan."
                currentValue={content.images?.stuntingPrevention || ''}
                defaultAsset={stuntingImg}
                recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
                maxDimension={1200}
                onChange={(val) => updateImage('stuntingPrevention', val)}
              />

              {/* 4. Spotlight Pasar */}
              <ImageFieldUploader
                label="4. Foto Sidak Pengawasan Pangan Pasar Rakyat"
                description="Tampil di kartu Spotlight Pengawasan Pangan Pasar Tradisional Beranda."
                currentValue={content.images?.foodInspection || ''}
                defaultAsset={foodInspectionImg}
                recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
                maxDimension={1200}
                onChange={(val) => updateImage('foodInspection', val)}
              />

              {/* 5. Intro Background */}
              <ImageFieldUploader
                label="5. Foto Background Layar Pembuka (Intro Portal)"
                description="Latar animasi pembuka saat warga pertama kali membuka website NutriMap."
                currentValue={content.images?.introBg || ''}
                defaultAsset={introBgImg}
                recommendedRatio="16:9 Landscape • Min 1920 × 1080 px"
                maxDimension={1920}
                onChange={(val) => updateImage('introBg', val)}
              />
            </div>

            {/* SEKSI GALERI DOKUMENTASI LAPANGAN PUBLIK */}
            <div style={{ marginTop: 16, borderTop: '2px solid #f1f5f9', paddingTop: 24, display: 'grid', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Koleksi Galeri Dokumentasi Lapangan Publik
                  </h4>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                    Foto-foto kegiatan lapangan yang tampil pada seksi galeri beranda untuk transparansi intervensi gizi dan pangan.
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '4px 12px', borderRadius: 9999, border: '1px solid #ccfbf1' }}>
                  Total: {content.gallery?.length || 0} Foto Galeri
                </span>
              </div>

              {/* Grid Kartu Galeri Saat Ini */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {content.gallery?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', height: 160, background: '#0f172a' }}>
                      <img
                        src={item.url}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4
                        }}
                      >
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(item.id)}
                        title="Hapus foto ini dari galeri"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>
                          {item.title}
                        </h5>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Tambah Foto Galeri Baru */}
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: 20 }}>
                <h5 style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FolderPlus size={16} color="#0f766e" /> Tambah Foto Dokumentasi Baru ke Galeri
                </h5>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Judul Dokumentasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sidak Komoditas Pasar Bogor"
                      value={newGalTitle}
                      onChange={(e) => setNewGalTitle(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Kategori</label>
                    <select
                      value={newGalCategory}
                      onChange={(e) => setNewGalCategory(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    >
                      <option value="Ketahanan Pangan">Ketahanan Pangan</option>
                      <option value="Air Bersih">Air Bersih (PDAM)</option>
                      <option value="Gizi & Stunting">Gizi &amp; Stunting</option>
                      <option value="Keamanan Pangan">Keamanan Pangan</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Tautan Gambar / URL Foto</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="url"
                        placeholder="Tempelkan URL gambar (https://... /foto-info/...)"
                        value={newGalUrl}
                        onChange={(e) => setNewGalUrl(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        style={{
                          padding: '8px 16px',
                          background: '#047857',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Plus size={15} /> Tambahkan
                      </button>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Keterangan Singkat</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pengujian sampel komoditas pangan segar di los pasar."
                      value={newGalDesc}
                      onChange={(e) => setNewGalDesc(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: HERO & BANNER (TEXT & IMAGE)                          */}
        {/* ============================================================ */}
        {activeTab === 'hero' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Banner Beranda &amp; Headline Utama</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Kelola foto banner utama dan teks judul besar pada bagian teratas portal NutriMap.</p>
            </div>

            {/* Banner Image Uploader integrated right here */}
            <ImageFieldUploader
              label="Foto Banner Utama Beranda (Hero Showcase)"
              description="Perbarui foto latar / ilustrasi banner utama yang membentang di bagian atas beranda."
              currentValue={content.images?.heroBanner || ''}
              defaultAsset={heroBg}
              recommendedRatio="16:9 Landscape • Min 1648 × 768 px"
              maxDimension={1920}
              quality={0.88}
              onChange={(val) => updateImage('heroBanner', val)}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Badge Identitas Portal</label>
              <input
                type="text"
                value={content.hero?.badgeText || ''}
                onChange={(e) => updateField('hero', 'badgeText', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Judul Utama Banner WebGIS</label>
              <input
                type="text"
                value={content.hero?.title || ''}
                onChange={(e) => updateField('hero', 'title', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700, color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Subjudul Narasi Banner</label>
              <textarea
                rows={3}
                value={content.hero?.subtitle || ''}
                onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6, color: '#334155' }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MANIFESTO */}
        {activeTab === 'manifesto' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Teks Narasi Manifesto &amp; Kebijakan Spasial</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Paragraf manifesto yang tampil tepat di bawah banner beranda untuk menjelaskan komitmen data geografis Kota Bogor.</p>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Judul Utama Manifesto</label>
              <input
                type="text"
                value={content.manifesto.title}
                onChange={(e) => updateField('manifesto', 'title', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700, color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Paragraf Narasi Manifesto (Data-Driven Spatial Policy)</label>
              <textarea
                rows={4}
                value={content.manifesto.text}
                onChange={(e) => updateField('manifesto', 'text', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6, color: '#334155' }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: 4 PILAR INDIKATOR */}
        {activeTab === 'pillars' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Pengaturan 4 Pilar Utama Pemantauan Kota</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Kelola judul bab, label metrik, angka ringkasan, dan badge capaian kota.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Judul Bagian Pilar</label>
                <input
                  type="text"
                  value={content.pillars.sectionTitle}
                  onChange={(e) => updateField('pillars', 'sectionTitle', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Subjudul Bagian Pilar</label>
                <input
                  type="text"
                  value={content.pillars.sectionSubtitle}
                  onChange={(e) => updateField('pillars', 'sectionSubtitle', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5, marginTop: 4 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {/* Pilar IKP */}
              <div style={{ border: '1.5px solid #bbf7d0', background: '#f0fdf4', padding: 18, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>Pilar 1: Skor IKP</span>
                <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                  <input
                    type="text"
                    value={content.pillars.ikp.label}
                    onChange={(e) => updatePillar('ikp', 'label', e.target.value)}
                    placeholder="Nama Label"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={content.pillars.ikp.value}
                      onChange={(e) => updatePillar('ikp', 'value', e.target.value)}
                      placeholder="Nilai (misal 88.2)"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 800 }}
                    />
                    <input
                      type="text"
                      value={content.pillars.ikp.badge}
                      onChange={(e) => updatePillar('ikp', 'badge', e.target.value)}
                      placeholder="Badge Status"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Pilar Air */}
              <div style={{ border: '1.5px solid #99f6e4', background: '#f0fdfa', padding: 18, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Pilar 2: Air Bersih</span>
                <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                  <input
                    type="text"
                    value={content.pillars.air.label}
                    onChange={(e) => updatePillar('air', 'label', e.target.value)}
                    placeholder="Nama Label"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={content.pillars.air.value}
                      onChange={(e) => updatePillar('air', 'value', e.target.value)}
                      placeholder="Nilai (misal 89.6%)"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 800 }}
                    />
                    <input
                      type="text"
                      value={content.pillars.air.badge}
                      onChange={(e) => updatePillar('air', 'badge', e.target.value)}
                      placeholder="Badge Status"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Pilar Stunting */}
              <div style={{ border: '1.5px solid #fed7aa', background: '#fff7ed', padding: 18, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>Pilar 3: Prevalensi Stunting</span>
                <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                  <input
                    type="text"
                    value={content.pillars.stunting.label}
                    onChange={(e) => updatePillar('stunting', 'label', e.target.value)}
                    placeholder="Nama Label"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={content.pillars.stunting.value}
                      onChange={(e) => updatePillar('stunting', 'value', e.target.value)}
                      placeholder="Nilai (misal 15.4%)"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 800 }}
                    />
                    <input
                      type="text"
                      value={content.pillars.stunting.badge}
                      onChange={(e) => updatePillar('stunting', 'badge', e.target.value)}
                      placeholder="Badge Status"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* Pilar Pasar */}
              <div style={{ border: '1.5px solid #bfdbfe', background: '#eff6ff', padding: 18, borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>Pilar 4: Pengawasan Pasar</span>
                <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                  <input
                    type="text"
                    value={content.pillars.pasar.label}
                    onChange={(e) => updatePillar('pasar', 'label', e.target.value)}
                    placeholder="Nama Label"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 700 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={content.pillars.pasar.value}
                      onChange={(e) => updatePillar('pasar', 'value', e.target.value)}
                      placeholder="Nilai (misal 96%)"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 800 }}
                    />
                    <input
                      type="text"
                      value={content.pillars.pasar.badge}
                      onChange={(e) => updatePillar('pasar', 'badge', e.target.value)}
                      placeholder="Badge Status"
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPOTLIGHT PDAM */}
        {activeTab === 'pdam' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Spotlight Fasilitas Air Bersih (PDAM Tirta Pakuan)</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Perbarui foto instalasi pengolahan air bersih, narasi profil fasilitas, kapasitas debit terolah, dan jumlah sambungan rumah.</p>
            </div>

            {/* PDAM Image Uploader */}
            <ImageFieldUploader
              label="Foto Fasilitas PDAM Tirta Pakuan"
              description="Foto fasilitas pengolahan air minum yang tampil pada kartu sorotan Beranda & Peta Air Bersih."
              currentValue={content.images?.pdamFacility || ''}
              defaultAsset={pdamFacilityImg}
              recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
              maxDimension={1200}
              onChange={(val) => updateImage('pdamFacility', val)}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Headline Kartu PDAM</label>
              <input
                type="text"
                value={content.spotlightPdam.headline}
                onChange={(e) => updateField('spotlightPdam', 'headline', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Paragraf Deskripsi Fasilitas</label>
              <textarea
                rows={3}
                value={content.spotlightPdam.description}
                onChange={(e) => updateField('spotlightPdam', 'description', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Metrik 1 (Cakupan Akses)</label>
                <input
                  type="text"
                  value={content.spotlightPdam.metric1Val}
                  onChange={(e) => updateField('spotlightPdam', 'metric1Val', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Metrik 2 (Debit Air Terolah)</label>
                <input
                  type="text"
                  value={content.spotlightPdam.metric2Val}
                  onChange={(e) => updateField('spotlightPdam', 'metric2Val', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Metrik 3 (Sambungan Rumah)</label>
                <input
                  type="text"
                  value={content.spotlightPdam.metric3Val}
                  onChange={(e) => updateField('spotlightPdam', 'metric3Val', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Keterangan Sumber Data Resmi</label>
              <input
                type="text"
                value={content.spotlightPdam.sourceText}
                onChange={(e) => updateField('spotlightPdam', 'sourceText', e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>
          </div>
        )}

        {/* TAB 5: SPOTLIGHT STUNTING */}
        {activeTab === 'stunting' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Spotlight Sosialisasi &amp; Deteksi Dini Stunting</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Perbarui foto Posyandu/Dinkes, narasi program terpadu, target prevalensi, dan jaringan Posyandu aktif.</p>
            </div>

            {/* Stunting Image Uploader */}
            <ImageFieldUploader
              label="Foto Sosialisasi & Deteksi Stunting (Posyandu/Dinkes)"
              description="Foto kegiatan pemantauan balita & penyuluhan gizi yang tampil di Beranda & Halaman Kesejahteraan."
              currentValue={content.images?.stuntingPrevention || ''}
              defaultAsset={stuntingImg}
              recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
              maxDimension={1200}
              onChange={(val) => updateImage('stuntingPrevention', val)}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Headline Kartu Stunting</label>
              <input
                type="text"
                value={content.spotlightStunting.headline}
                onChange={(e) => updateField('spotlightStunting', 'headline', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Paragraf Narasi Sosialisasi &amp; Intervensi</label>
              <textarea
                rows={3}
                value={content.spotlightStunting.description}
                onChange={(e) => updateField('spotlightStunting', 'description', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 8, background: '#fafafa' }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Target Prevalensi</label>
                <input
                  type="text"
                  value={content.spotlightStunting.targetVal}
                  onChange={(e) => updateField('spotlightStunting', 'targetVal', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>

              <div style={{ border: '1px solid #e2e8f0', padding: 14, borderRadius: 8, background: '#fafafa' }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Total Posyandu Aktif</label>
                <input
                  type="text"
                  value={content.spotlightStunting.posyanduVal}
                  onChange={(e) => updateField('spotlightStunting', 'posyanduVal', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Keterangan Sumber Data Resmi</label>
              <input
                type="text"
                value={content.spotlightStunting.sourceText}
                onChange={(e) => updateField('spotlightStunting', 'sourceText', e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>
          </div>
        )}

        {/* TAB 6: KEAMANAN PANGAN */}
        {activeTab === 'food' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Pengawasan Mutu &amp; Keamanan Pangan Pasar</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Perbarui foto sidak pasar, audit laboratorium formalin/pestisida, dan daftar pasar rakyat yang dipantau.</p>
            </div>

            {/* Food Image Uploader */}
            <ImageFieldUploader
              label="Foto Sidak Pengawasan Pangan Pasar Tradisional"
              description="Foto pengujian rapid test kit di los pasar rakyat yang tampil di Beranda."
              currentValue={content.images?.foodInspection || ''}
              defaultAsset={foodInspectionImg}
              recommendedRatio="4:3 / 16:9 • Min 800 × 600 px"
              maxDimension={1200}
              onChange={(val) => updateImage('foodInspection', val)}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Headline Kartu Keamanan Pangan</label>
              <input
                type="text"
                value={content.spotlightFood.headline}
                onChange={(e) => updateField('spotlightFood', 'headline', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Paragraf Deskripsi Audit &amp; Laboratorium</label>
              <textarea
                rows={3}
                value={content.spotlightFood.description}
                onChange={(e) => updateField('spotlightFood', 'description', e.target.value)}
                style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Total Lokasi Audit</label>
                <input
                  type="text"
                  value={content.spotlightFood.auditVal}
                  onChange={(e) => updateField('spotlightFood', 'auditVal', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Persentase Lolos BPOM</label>
                <input
                  type="text"
                  value={content.spotlightFood.passRateVal}
                  onChange={(e) => updateField('spotlightFood', 'passRateVal', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Jumlah Pasar Utama</label>
                <input
                  type="text"
                  value={content.spotlightFood.marketCountVal}
                  onChange={(e) => updateField('spotlightFood', 'marketCountVal', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 800, marginTop: 4 }}
                />
              </div>
            </div>

            {/* Chips Pasar */}
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Daftar Pasar Rakyat yang Dipantau</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                {content.spotlightFood.marketChips.map((chip, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#334155'
                    }}
                  >
                    <span>{chip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChip(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                      title="Hapus pasar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="Tambah nama pasar baru (contoh: Pasar Tanah Baru)"
                  value={newChip}
                  onChange={(e) => setNewChip(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChip();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddChip}
                  style={{
                    padding: '8px 16px',
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Plus size={15} /> Tambah Pasar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: JUDUL PETA & DATA */}
        {activeTab === 'sections' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Judul &amp; Subjudul Bagian Peta &amp; Indikator</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Sesuaikan judul bab yang membimbing warga saat meninjau peta spasial dan tabel data kependudukan.</p>
            </div>

            <div style={{ display: 'grid', gap: 16, border: '1px solid #e2e8f0', padding: 18, borderRadius: 10, background: '#fafafa' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Bagian Peta Spasial Beranda</span>
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>Judul Peta Spasial</label>
                <input
                  type="text"
                  value={content.spatialSection.title}
                  onChange={(e) => updateField('spatialSection', 'title', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>Subjudul Narasi Peta</label>
                <input
                  type="text"
                  value={content.spatialSection.subtitle}
                  onChange={(e) => updateField('spatialSection', 'subtitle', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, border: '1px solid #e2e8f0', padding: 18, borderRadius: 10, background: '#fafafa' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>Bagian Tabel Indikator Kota</span>
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>Judul Tabel Indikator</label>
                <input
                  type="text"
                  value={content.indicatorSection.title}
                  onChange={(e) => updateField('indicatorSection', 'title', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
                />
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>Subjudul Tabel Indikator</label>
                <input
                  type="text"
                  value={content.indicatorSection.subtitle}
                  onChange={(e) => updateField('indicatorSection', 'subtitle', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: KONTAK & BALAI KOTA */}
        {activeTab === 'about' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Profil Tentang NutriMap &amp; Kontak Balai Kota</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>Kelola teks halaman Tentang Kami, alamat gedung Balai Kota Bogor, nomor telepon darurat, dan jam layanan.</p>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Judul Halaman Tentang Kami</label>
              <input
                type="text"
                value={content.aboutSection.title}
                onChange={(e) => updateField('aboutSection', 'title', e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Subjudul Portal</label>
              <input
                type="text"
                value={content.aboutSection.subtitle}
                onChange={(e) => updateField('aboutSection', 'subtitle', e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Deskripsi Lengkap Sistem NutriMap</label>
              <textarea
                rows={4}
                value={content.aboutSection.description}
                onChange={(e) => updateField('aboutSection', 'description', e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            {/* List Tujuan Sistem */}
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Poin-Poin Tujuan Utama Sistem</label>
              <div style={{ display: 'grid', gap: 8 }}>
                {content.aboutSection.objectives.map((obj, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', width: 20 }}>{idx + 1}.</span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => {
                        const updated = [...content.aboutSection.objectives];
                        updated[idx] = e.target.value;
                        updateField('aboutSection', 'objectives', updated);
                      }}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '8px 10px', cursor: 'pointer' }}
                      title="Hapus poin tujuan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="Tambah poin tujuan baru..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddObjective();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddObjective}
                  style={{
                    padding: '8px 16px',
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Plus size={15} /> Tambah Poin
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Alamat Balai Kota</label>
                <input
                  type="text"
                  value={content.aboutSection.address}
                  onChange={(e) => updateField('aboutSection', 'address', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Nomor Telepon / Call Center</label>
                <input
                  type="text"
                  value={content.aboutSection.phone}
                  onChange={(e) => updateField('aboutSection', 'phone', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Email Resmi Pemkot</label>
                <input
                  type="email"
                  value={content.aboutSection.email}
                  onChange={(e) => updateField('aboutSection', 'email', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Jam Operasional Pelayanan</label>
                <input
                  type="text"
                  value={content.aboutSection.officeHours}
                  onChange={(e) => updateField('aboutSection', 'officeHours', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, marginTop: 4 }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
