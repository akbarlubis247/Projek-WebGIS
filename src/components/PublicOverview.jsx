import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, Database, Droplets, HeartPulse, MapPinned, Search, ShieldCheck, Sprout, Store } from 'lucide-react';
import MapView from './MapView';
import SpatialReadinessPanel from './SpatialReadinessPanel';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';
import heroImage from '../assets/hero-banner.png';
import './PublicOverview.css';

const indicators = [
  { name: 'Ketahanan pangan', detail: 'Skor IKP per wilayah', icon: Sprout, color: 'green' },
  { name: 'Akses air bersih', detail: 'Persentase rumah tangga', icon: Droplets, color: 'blue' },
  { name: 'Stunting', detail: 'Prevalensi balita', icon: HeartPulse, color: 'coral' },
  { name: 'Kesejahteraan', detail: 'Konteks sosial-ekonomi', icon: ShieldCheck, color: 'violet' }
];

export default function PublicOverview({ onOpenLogin }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState(KECAMATAN_KOTA_BOGOR[0]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('nama');

  const districtList = useMemo(() => {
    const matches = KECAMATAN_KOTA_BOGOR.filter((district) => district.nama.toLowerCase().includes(query.toLowerCase()));
    return [...matches].sort((first, second) => {
      if (sortBy === 'stunting') return second.stunting - first.stunting;
      if (sortBy === 'pangan') return second.panganSkor - first.panganSkor;
      return first.nama.localeCompare(second.nama, 'id');
    });
  }, [query, sortBy]);

  const goToMap = () => document.getElementById('peta-spasial')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="nm-page">
      <section id="beranda" className="nm-hero single-page-section">
        <div className="nm-hero-copy">
          <div className="nm-eyebrow"><span /> Prototipe WebGIS · Kota Bogor</div>
          <h1>Memahami kota lewat <em>peta</em> dan data yang jujur.</h1>
          <p className="nm-hero-description">
            Eksplorasi ketahanan pangan, air bersih, stunting, dan kesejahteraan dalam satu pengalaman spasial. Dibuat untuk membantu diskusi dan perencanaan, bukan keputusan otomatis.
          </p>
          <div className="nm-hero-actions">
            <button className="nm-button nm-button-primary" onClick={goToMap}><MapPinned size={17} /> Jelajahi peta <ArrowRight size={17} /></button>
            <a className="nm-button nm-button-secondary" href="#data-indikator">Lihat indikator <ArrowDownRight size={17} /></a>
          </div>
          <div className="nm-hero-foot"><Database size={15} /> Tampilan demonstrasi. Nilai contoh belum menjadi rujukan kebijakan.</div>
        </div>
        <div className="nm-hero-visual">
          <img src={heroImage} alt="Ilustrasi Kota Bogor untuk prototipe NutriMap" />
          <div className="nm-visual-overlay">
            <span className="nm-visual-pin"><MapPinned size={19} /></span>
            <div><span>Fokus wilayah</span><strong>Kota Bogor, Jawa Barat</strong></div>
            <span className="nm-visual-tag">6 kecamatan</span>
          </div>
        </div>
      </section>

      <div className="nm-prototype-strip" role="note">
        <div><ShieldCheck size={18} /><strong>Transparansi data</strong></div>
        <p>Visual saat ini memakai data contoh yang tersedia di frontend. CSV periodik bukan feed real-time; layer fasilitas belum ditampilkan sebelum lokasi dan sumbernya terverifikasi.</p>
      </div>

      <section className="nm-section nm-indicators" aria-labelledby="nm-indicators-title">
        <div className="nm-section-heading"><span className="nm-section-index">01 / GAMBARAN UMUM</span><h2 id="nm-indicators-title">Empat sudut pandang, satu kota.</h2><p>Setiap indikator memberi konteks berbeda. Prioritas wilayah perlu dibaca sebagai kombinasi, bukan kesimpulan dari satu angka.</p></div>
        <div className="nm-indicator-grid">
          {indicators.map(({ name, detail, icon: Icon, color }, index) => (
            <article key={name} className={`nm-indicator-card nm-${color}`}>
              <div className="nm-indicator-number">0{index + 1}</div>
              <div className="nm-indicator-icon"><Icon size={22} /></div>
              <h3>{name}</h3><p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="peta-spasial" className="nm-section nm-map-section single-page-section" aria-labelledby="nm-map-title">
        <div className="nm-section-heading nm-map-heading"><div><span className="nm-section-index">02 / EKSPLORASI WILAYAH</span><h2 id="nm-map-title">Bogor, dalam satu pandangan.</h2><p>Pilih kecamatan untuk melihat ringkasan data contoh. Pin menunjukkan titik representasi wilayah, bukan poligon atau cakupan layanan.</p></div><span className="nm-demo-label">MODE DEMO · AGREGAT KECAMATAN</span></div>
        <div className="nm-map-layout">
          <div className="nm-map-shell"><MapView selectedKecamatan={selectedKecamatan} onSelectKecamatan={setSelectedKecamatan} height="540px" /></div>
          <aside className="nm-district-card" aria-label="Detail kecamatan terpilih">
            <div className="nm-district-top"><span>WILAYAH TERPILIH</span><span className="nm-district-code">{selectedKecamatan.id}</span></div>
            <h3>Kecamatan <br /><em>{selectedKecamatan.nama}</em></h3>
            <p>{selectedKecamatan.deskripsi}</p>
            <div className="nm-district-stats">
              <div><span>Indeks pangan</span><strong>{selectedKecamatan.panganSkor}<small> / 100</small></strong></div>
              <div><span>Akses air</span><strong>{selectedKecamatan.airBersih}<small>%</small></strong></div>
              <div><span>Stunting</span><strong>{selectedKecamatan.stunting}<small>%</small></strong></div>
              <div><span>Status pangan</span><strong className="nm-district-status">{selectedKecamatan.panganStatus}</strong></div>
            </div>
            <div className="nm-district-note">Angka pada prototipe ini belum memiliki metadata sumber dan periode lengkap; jangan digunakan sebagai data resmi.</div>
          </aside>
        </div>
      </section>

      <section id="data-indikator" className="nm-section nm-data-section single-page-section" aria-labelledby="nm-data-title">
        <div className="nm-section-heading"><span className="nm-section-index">03 / DATA INDIKATOR</span><h2 id="nm-data-title">Bandingkan wilayah dengan mudah.</h2><p>Cari dan urutkan ringkasan kecamatan. Tabel ini hanya menampilkan data contoh frontend dan tidak menyatakan prioritas SAW.</p></div>
        <div className="nm-table-card">
          <div className="nm-table-toolbar"><label className="nm-search"><Search size={17} /><span className="sr-only">Cari kecamatan</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kecamatan..." /></label><label className="nm-sort"><span>Urutkan</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="nama">Nama wilayah</option><option value="pangan">Skor pangan tertinggi</option><option value="stunting">Stunting tertinggi</option></select></label></div>
          <div className="nm-table-scroll"><table><thead><tr><th>Wilayah</th><th>Skor pangan</th><th>Air bersih</th><th>Stunting</th><th>Status pangan</th><th></th></tr></thead><tbody>{districtList.map((district) => <tr key={district.id}><td><strong>{district.nama}</strong><small>{district.id}</small></td><td>{district.panganSkor} / 100</td><td>{district.airBersih}%</td><td>{district.stunting}%</td><td><span className="nm-table-status">{district.panganStatus}</span></td><td><button className="nm-table-action" onClick={() => { setSelectedKecamatan(district); goToMap(); }} aria-label={`Lihat ${district.nama} di peta`}><ArrowRight size={16} /></button></td></tr>)}</tbody></table></div>
          {districtList.length === 0 && <div className="nm-empty">Tidak ada kecamatan yang cocok dengan pencarian.</div>}
          <div className="nm-table-foot">6 kecamatan · data contoh untuk visualisasi antarmuka</div>
        </div>
      </section>

      <section id="tentang-nutrimap" className="nm-section nm-about-section single-page-section" aria-labelledby="nm-about-title">
        <div className="nm-section-heading"><span className="nm-section-index">04 / LANGKAH BERIKUTNYA</span><h2 id="nm-about-title">Spasial yang dapat dipertanggungjawabkan.</h2><p>Pasar menjadi kandidat layer fasilitas pertama; PDAM dan kebun tetap menunggu arahan dan data yang dapat diverifikasi.</p></div>
        <SpatialReadinessPanel />
        <div className="nm-about-cta"><div><Store size={20} /><h3>Ruang kerja tim NutriMap</h3><p>Dashboard pengelolaan berikut masih berupa demonstrasi antarmuka. Autentikasi dan publikasi data menunggu backend.</p></div><button className="nm-button nm-button-secondary" onClick={onOpenLogin}>Lihat demo admin <ArrowRight size={17} /></button></div>
      </section>

      <footer className="nm-footer"><div><Sprout size={20} /><strong>NutriMap Bogor</strong></div><p>Prototipe akademik WebGIS · bukan portal resmi pemerintah atau sumber data kebijakan.</p><span>© {new Date().getFullYear()} Tim NutriMap</span></footer>
    </div>
  );
}
