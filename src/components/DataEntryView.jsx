import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
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
  FileCheck,
  Lock,
  ChevronDown
} from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';

export default function DataEntryView() {
  const [selectedKecId, setSelectedKecId] = useState(KECAMATAN_KOTA_BOGOR[0].id);

  const [formData, setFormData] = useState({
    nama: KECAMATAN_KOTA_BOGOR[0].nama,
    pusat: KECAMATAN_KOTA_BOGOR[0].pusat,
    lat: KECAMATAN_KOTA_BOGOR[0].lat.toString(),
    lng: KECAMATAN_KOTA_BOGOR[0].lng.toString(),
    penduduk: KECAMATAN_KOTA_BOGOR[0].penduduk,
    panganSkor: KECAMATAN_KOTA_BOGOR[0].panganSkor,
    airBersih: KECAMATAN_KOTA_BOGOR[0].airBersih,
    stunting: KECAMATAN_KOTA_BOGOR[0].stunting,
    deskripsi: KECAMATAN_KOTA_BOGOR[0].deskripsi
  });

  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  // Handle Kecamatan Selection Change
  const handleKecamatanSelect = (id) => {
    setSelectedKecId(id);
    if (id === 'NEW') {
      setFormData({
        nama: '',
        pusat: '',
        lat: '-6.5971',
        lng: '106.7949',
        penduduk: '',
        panganSkor: '',
        airBersih: '',
        stunting: '',
        deskripsi: ''
      });
    } else {
      const found = KECAMATAN_KOTA_BOGOR.find(k => k.id === id);
      if (found) {
        setFormData({
          nama: found.nama,
          pusat: found.pusat,
          lat: found.lat.toString(),
          lng: found.lng.toString(),
          penduduk: found.penduduk,
          panganSkor: found.panganSkor,
          airBersih: found.airBersih,
          stunting: found.stunting,
          deskripsi: found.deskripsi
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
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
          <CheckCircle2 size={20} /> Data Kecamatan {formData.nama || 'baru'} berhasil diperbarui ke database NutriMap Kota Bogor!
        </motion.div>
      )}

      <div className="modern-entry-grid">
        {/* Form Entry Card */}
        <div className="dash-card modern-form-card">
          <div className="dash-card-head">
            <div className="card-title-wrap">
              <MapPin size={22} className="text-emerald" />
              <div>
                <h2>Form Input & Update Data Kecamatan</h2>
                <p>Pilih kecamatan untuk mengisi nilai indikator terbaru secara otomatis</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="modern-entry-form">
            {/* Kecamatan Selector Dropdown */}
            <div className="form-field-group highlight-select-group">
              <label>Pilih Kecamatan yang Ingin Diperbarui Data-nya *</label>
              <div className="modern-select-wrap">
                <Building2 size={18} className="f-icon text-emerald" />
                <select
                  value={selectedKecId}
                  onChange={(e) => handleKecamatanSelect(e.target.value)}
                  className="kecamatan-dropdown-select"
                >
                  {KECAMATAN_KOTA_BOGOR.map((kec) => (
                    <option key={kec.id} value={kec.id}>
                      [{kec.id}] Kecamatan {kec.nama} — Pusat: {kec.pusat}
                    </option>
                  ))}
                  <option value="NEW">➕ Tambah Wilayah / Kecamatan Baru</option>
                </select>
                <ChevronDown size={18} className="select-arrow-icon" />
              </div>
            </div>

            {/* Readonly Geografis Info Notice */}
            <div className="geo-lock-notice font-mono">
              <Lock size={14} className="text-emerald" />
              <span>Koordinat & Pusat Wilayah Terkunci Otomatis (Geo-Reference Pemkot Bogor)</span>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label>Pusat Pemerintahan / Kelurahan</label>
                <div className="modern-input-wrap disabled">
                  <MapPin size={18} className="f-icon" />
                  <input
                    type="text"
                    readOnly={selectedKecId !== 'NEW'}
                    value={formData.pusat}
                    onChange={(e) => setFormData({ ...formData, pusat: e.target.value })}
                    placeholder="Pusat Wilayah"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Koordinat Lintang & Bujur (Lat, Lng)</label>
                <div className="modern-input-wrap disabled">
                  <Navigation size={18} className="f-icon" />
                  <input
                    type="text"
                    readOnly={selectedKecId !== 'NEW'}
                    value={`${formData.lat}, ${formData.lng}`}
                    placeholder="-6.5971, 106.7949"
                  />
                </div>
              </div>
            </div>

            {/* Editable Indicator Numbers */}
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
              <Save size={18} /> Simpan Pembaruan Data
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
