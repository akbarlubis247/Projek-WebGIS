import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="about-view-container animate-fade-in">
      <div className="about-grid">
        <div className="dash-card about-card">
          <div className="brand-badge-large">
            <Layers size={36} className="text-emerald" />
            <div>
              <h2>NutriMap Bogor</h2>
              <p>Prototipe akademik WebGIS · bukan portal resmi pemerintah</p>
            </div>
          </div>

          <h3>Tujuan Utama Platform NutriMap:</h3>
          <ul className="about-list">
            <li><CheckCircle2 size={18} className="text-emerald" /> Rancangan visualisasi enam kecamatan berdasarkan data contoh frontend.</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Visualisasi periodik indikator akses air bersih; bukan pemantauan jaringan PDAM real-time.</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Identifikasi awal wilayah yang memerlukan validasi lebih lanjut terkait stunting.</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Rancangan layer pasar tradisional setelah sumber dan koordinatnya diverifikasi.</li>
          </ul>

          <div className="about-partners">
            <h4>Sumber Data</h4>
            <div className="partner-tags"><span className="sumber-data-link"><ExternalLink size={14} /><span>Catatan sumber dan tahun masih perlu dilengkapi sebelum publikasi.</span></span></div>
          </div>
        </div>

        <div className="dash-card contact-card">
          <ShieldCheck size={24} className="text-emerald" />
          <h3>Catatan Prototipe</h3>
          <p>Halaman ini adalah rancangan akademik. Nilai, batas administrasi, dan lokasi fasilitas harus diverifikasi terhadap sumber resmi dan periode yang sesuai.</p>
        </div>
      </div>
    </div>
  );
}
