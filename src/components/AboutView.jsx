import React from 'react';
import { Layers, MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="about-view-container animate-fade-in">
      <div className="about-grid">
        <div className="dash-card about-card">
          <div className="brand-badge-large">
            <Layers size={36} className="text-emerald" />
            <div>
              <h2>NutriMap Kota Bogor v2.4</h2>
              <p>Platform SIG Spasial Resmi Kota Bogor, Jawa Barat</p>
            </div>
          </div>

          <p className="about-text">
            <b>NutriMap Kota Bogor</b> dikembangkan sebagai sarana pengambilan keputusan berbasis data geografis (Data-Driven Policy) untuk jajaran Pemerintah Kota Bogor (Bappeda, Dinas Ketahanan Pangan, Dinas Kesehatan) bekerja sama dengan Pusat Studi Pembangunan IPB University.
          </p>

          <h3>Tujuan Utama Platform NutriMap:</h3>
          <ul className="about-list">
            <li><CheckCircle2 size={18} className="text-emerald" /> Pemetaan 6 Kecamatan di Kota Bogor berdasarkan Indeks Ketahanan Pangan (IKP).</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Monitoring real-time cakupan akses air bersih layak (PDAM Tirta Pakuan).</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Deteksi awal dan intervensi cepat pada kelurahan dengan angka stunting balita tinggi.</li>
            <li><CheckCircle2 size={18} className="text-emerald" /> Pengawasan dan transparansi sidak laboratorium keamanan pangan di pasar tradisional.</li>
          </ul>

          <div className="about-partners">
            <h4>Kemitraan & Sumber Data:</h4>
            <div className="partner-tags">
              <span>Bappeda Kota Bogor</span>
              <span>Dinas Ketahanan Pangan</span>
              <span>Dinas Kesehatan</span>
              <span>IPB University</span>
              <span>BPS Kota Bogor</span>
              <span>PDAM Tirta Pakuan</span>
            </div>
          </div>
        </div>

        <div className="dash-card contact-card">
          <h3>Kontak & Informasi Layanan SIG</h3>
          <div className="contact-item">
            <MapPin size={20} className="text-emerald" />
            <div>
              <b>Alamat Kantor:</b>
              <p>Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121</p>
            </div>
          </div>

          <div className="contact-item">
            <Mail size={20} className="text-cyan" />
            <div>
              <b>Email Portal SIG:</b>
              <p>sig.nutrimap@bogorkota.go.id</p>
            </div>
          </div>

          <div className="contact-item">
            <Phone size={20} className="text-emerald" />
            <div>
              <b>Nomor Telepon / WhatsApp:</b>
              <p>+62 812-3456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
