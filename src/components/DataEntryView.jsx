import React, { useState } from 'react';
import { FilePlus, Upload, MapPin, Save, CheckCircle2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { KECAMATAN_DATA } from '../data/bogorData';

export default function DataEntryView() {
  const [formData, setFormData] = useState({
    nama: '',
    pusat: '',
    lat: '-6.5500',
    lng: '106.7800',
    penduduk: '',
    panganSkor: '',
    airBersih: '',
    stunting: '',
    tingkatKemiskinan: '',
    sumberAirDominan: 'PDAM',
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
        lat: '-6.5500',
        lng: '106.7800',
        penduduk: '',
        panganSkor: '',
        airBersih: '',
        stunting: '',
        tingkatKemiskinan: '',
        sumberAirDominan: 'PDAM',
        deskripsi: ''
      });
    }, 3000);
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
        <div className="alert-toast success animate-slide-down">
          <CheckCircle2 size={20} /> Data Kecamatan {formData.nama || 'baru'} berhasil disimpan ke database NutriMap!
        </div>
      )}

      <div className="entry-grid">
        {/* Form Entry */}
        <div className="dash-card form-card">
          <div className="dash-card-head">
            <div>
              <h2>Form Input Data Spasial Kecamatan</h2>
              <p>Masukkan koordinat geografis dan nilai indikator terbaru</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="entry-form">
            <div className="form-row">
              <label>
                Nama Kecamatan *
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sukaraja"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                />
              </label>

              <label>
                Pusat Pemerintahan / Kelurahan *
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nagrak"
                  value={formData.pusat}
                  onChange={e => setFormData({ ...formData, pusat: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Latitude (Garis Lintang) *
                <input
                  type="text"
                  required
                  placeholder="-6.5500"
                  value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: e.target.value })}
                />
              </label>

              <label>
                Longitude (Garis Bujur) *
                <input
                  type="text"
                  required
                  placeholder="106.7800"
                  value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Jumlah Penduduk (Jiwa) *
                <input
                  type="number"
                  required
                  placeholder="125000"
                  value={formData.penduduk}
                  onChange={e => setFormData({ ...formData, penduduk: e.target.value })}
                />
              </label>

              <label>
                Skor IKP Ketahanan Pangan (0-100) *
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="78.5"
                  value={formData.panganSkor}
                  onChange={e => setFormData({ ...formData, panganSkor: e.target.value })}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Persentase Air Bersih (%) *
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="82.4"
                  value={formData.airBersih}
                  onChange={e => setFormData({ ...formData, airBersih: e.target.value })}
                />
              </label>

              <label>
                Prevalensi Stunting (%) *
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="16.5"
                  value={formData.stunting}
                  onChange={e => setFormData({ ...formData, stunting: e.target.value })}
                />
              </label>
            </div>

            <label>
              Catatan Diagnosa Wilayah
              <textarea
                rows="3"
                placeholder="Tuliskan gambaran umum akses logistik, kondisi jalan, atau potensi kendala kekeringan..."
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </label>

            <button type="submit" className="primary-btn form-submit-btn">
              <Save size={18} /> Simpan Data Spasial
            </button>
          </form>
        </div>

        {/* Bulk CSV Upload Card */}
        <div className="dash-card bulk-card">
          <div className="dash-card-head">
            <div>
              <h2>Unggah Massal (CSV / Excel)</h2>
              <p>Impor puluhan data survei sekaligus dengan berkas tabel</p>
            </div>
          </div>

          <div
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload size={40} className="drop-icon" />
            <h3>Tarik & Lepas berkas CSV/XLSX ke sini</h3>
            <p>atau klik untuk memilih file dari komputer Anda</p>
            <input
              type="file"
              accept=".csv, .xlsx"
              style={{ display: 'none' }}
              id="csv-file-input"
              onChange={e => e.target.files && setCsvFile(e.target.files[0])}
            />
            <label htmlFor="csv-file-input" className="outline-btn-sm inline-btn">
              <FileSpreadsheet size={16} /> Pilih File CSV
            </label>
          </div>

          {csvFile && (
            <div className="file-preview-card">
              <FileSpreadsheet size={20} className="text-emerald" />
              <div>
                <strong>{csvFile.name}</strong>
                <small>{(csvFile.size / 1024).toFixed(1)} KB | Siap Diimpor</small>
              </div>
              <button className="primary-btn-sm" onClick={() => alert('Simulasi Impor CSV Berhasil!')}>
                Impor Data
              </button>
            </div>
          )}

          <div className="csv-template-box">
            <AlertCircle size={16} />
            <div>
              <b>Format Kolom CSV yang Diterima:</b>
              <code className="font-mono">nama, lat, lng, penduduk, ikp_skor, air_bersih, stunting</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
