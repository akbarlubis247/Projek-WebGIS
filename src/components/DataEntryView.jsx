import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FilePlus,
  Upload,
  MapPin,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Navigation,
  Users,
  Utensils,
  Droplets,
  HeartPulse,
  AlignLeft,
  FileCheck
} from 'lucide-react';

export default function DataEntryView() {
  const [formData, setFormData] = useState({
    nama: '',
    pusat: '',
    lat: '-6.5971',
    lng: '106.7949',
    penduduk: '',
    panganSkor: '',
    airBersih: '',
    stunting: '',
    tingkatKemiskinan: '4.5%',
    sumberAirDominan: 'PDAM Tirta Pakuan',
    deskripsi: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nama: '',
        pusat: '',
        lat: '-6.5971',
        lng: '106.7949',
        penduduk: '',
        panganSkor: '',
        airBersih: '',
        stunting: '',
        tingkatKemiskinan: '4.5%',
        sumberAirDominan: 'PDAM Tirta Pakuan',
        deskripsi: ''
      });
    }, 3500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCsvFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <h1>Entri Data Spasial & Indikator (Manual & CSV)</h1>
      </div>

      {submitted && (
        <motion.div
          className="alert-toast success animate-slide-down"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle2 size={20} /> Data Kecamatan {formData.nama || 'baru'} berhasil disimpan ke database NutriMap Kota Bogor!
        </motion.div>
      )}

      <div className="modern-entry-grid">
        {/* Form Entry Card */}
        <div className="dash-card modern-form-card">
          <div className="dash-card-head">
            <div className="card-title-wrap">
              <MapPin size={22} className="text-emerald" />
              <div>
                <h2>Form Input Data Spasial Kecamatan</h2>
                <p>Masukkan koordinat geografis dan nilai indikator terbaru Kota Bogor</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="modern-entry-form">
            <div className="form-grid-2col">
              <div className="form-field-group">
                <label>Nama Kecamatan *</label>
                <div className="modern-input-wrap">
                  <Building2 size={18} className="f-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bogor Tengah"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Pusat Pemerintahan / Kelurahan *</label>
                <div className="modern-input-wrap">
                  <MapPin size={18} className="f-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kebun Raya / Sempur"
                    value={formData.pusat}
                    onChange={(e) => setFormData({ ...formData, pusat: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label>Latitude (Garis Lintang) *</label>
                <div className="modern-input-wrap">
                  <Navigation size={18} className="f-icon" />
                  <input
                    type="text"
                    required
                    placeholder="-6.5971"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Longitude (Garis Bujur) *</label>
                <div className="modern-input-wrap">
                  <Navigation size={18} className="f-icon" />
                  <input
                    type="text"
                    required
                    placeholder="106.7949"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label>Jumlah Penduduk (Jiwa) *</label>
                <div className="modern-input-wrap">
                  <Users size={18} className="f-icon" />
                  <input
                    type="number"
                    required
                    placeholder="108500"
                    value={formData.penduduk}
                    onChange={(e) => setFormData({ ...formData, penduduk: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Skor IKP Ketahanan Pangan (0-100) *</label>
                <div className="modern-input-wrap">
                  <Utensils size={18} className="f-icon text-emerald" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="94.8"
                    value={formData.panganSkor}
                    onChange={(e) => setFormData({ ...formData, panganSkor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label>Persentase Air Bersih (%) *</label>
                <div className="modern-input-wrap">
                  <Droplets size={18} className="f-icon text-cyan" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="96.2"
                    value={formData.airBersih}
                    onChange={(e) => setFormData({ ...formData, airBersih: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Prevalensi Stunting (%) *</label>
                <div className="modern-input-wrap">
                  <HeartPulse size={18} className="f-icon text-danger" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="8.4"
                    value={formData.stunting}
                    onChange={(e) => setFormData({ ...formData, stunting: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label>Catatan Diagnosa Wilayah</label>
              <div className="modern-input-wrap align-top">
                <AlignLeft size={18} className="f-icon textarea-icon" />
                <textarea
                  rows="3"
                  placeholder="Tuliskan gambaran umum akses logistik, kondisi jalan, atau potensi kendala kekeringan..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="save-spatial-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={18} /> Simpan Data Spasial
            </motion.button>
          </form>
        </div>

        {/* Bulk CSV Upload Card */}
        <div className="dash-card modern-bulk-card">
          <div className="dash-card-head">
            <div className="card-title-wrap">
              <Upload size={22} className="text-cyan" />
              <div>
                <h2>Unggah Massal (CSV / Excel)</h2>
                <p>Impor puluhan data survei sekaligus dengan berkas tabel</p>
              </div>
            </div>
          </div>

          <div
            className={`modern-drop-zone ${dragActive ? 'active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="drop-cloud-circle">
              <Upload size={32} className="cloud-icon" />
            </div>
            <h3>Tarik & Lepas berkas CSV/XLSX ke sini</h3>
            <p>atau klik untuk memilih file dari komputer Anda</p>
            <input
              type="file"
              accept=".csv, .xlsx"
              style={{ display: 'none' }}
              id="csv-file-input"
              onChange={(e) => e.target.files && setCsvFile(e.target.files[0])}
            />
            <label htmlFor="csv-file-input" className="select-csv-btn">
              <FileSpreadsheet size={16} /> Pilih File CSV
            </label>
          </div>

          {csvFile && (
            <motion.div
              className="file-preview-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FileCheck size={24} className="text-emerald" />
              <div className="file-info">
                <strong>{csvFile.name}</strong>
                <small>{(csvFile.size / 1024).toFixed(1)} KB | Siap Diimpor</small>
              </div>
              <button className="primary-btn-sm" onClick={() => alert('Simulasi Impor CSV Berhasil!')}>
                Impor Data
              </button>
            </motion.div>
          )}

          <div className="csv-template-box">
            <AlertCircle size={18} className="text-indigo" />
            <div>
              <b>Format Kolom CSV yang Diterima:</b>
              <div className="csv-code-pill font-mono">
                nama, lat, lng, penduduk, ikp_skor, air_bersih, stunting
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
