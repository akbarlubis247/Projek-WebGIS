import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  MapPin,
  X,
  Info,
  Building2,
  CalendarClock,
  MapPinned
} from 'lucide-react';
import MapView from './MapView';
import SpatialReadinessPanel from './SpatialReadinessPanel';
import { KECAMATAN_KOTA_BOGOR, FOOD_SECURITY_CATEGORIES } from '../data/bogorData';

export default function MapExplorerView() {
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_KOTA_BOGOR[0]);
  const [showDrawer, setShowDrawer] = useState(true);

  const filteredList = KECAMATAN_KOTA_BOGOR.filter((item) => {
    const matchesStatus = selectedStatus === 'Semua Status' || item.panganStatus === selectedStatus;
    return matchesStatus;
  });

  return (
    <div className="map-explorer-page animate-fade-in">
      <div className="map-explorer-brief">
        <div>
          <span className="map-explorer-eyebrow"><MapPinned size={14} /> Eksplorator spasial</span>
          <h1>Jelajahi indikator, pahami kesiapan datanya.</h1>
          <p>Penanda peta merepresentasikan ringkasan indikator tingkat kecamatan, bukan titik fasilitas ataupun batas layanan.</p>
        </div>
        <div className="map-explorer-brief-meta">
          <span><CalendarClock size={15} /> Data periodik</span>
          <span>Demo UI · belum real-time</span>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="explorer-top-bar modern-top-bar">
        <div className="et-search modern-et-search">
          <Building2 size={18} className="icon text-emerald" />
          <select
            className="kecamatan-map-select font-bold"
            value={selectedKec ? selectedKec.id : ''}
            onChange={(e) => {
              const found = KECAMATAN_KOTA_BOGOR.find((k) => k.id === e.target.value);
              if (found) {
                setSelectedKec(found);
                setShowDrawer(true);
              }
            }}
          >
            {KECAMATAN_KOTA_BOGOR.map((kec) => (
              <option key={kec.id} value={kec.id}>
                📍 Kecamatan {kec.nama} — Pusat: {kec.pusat}
              </option>
            ))}
          </select>
        </div>

        <div className="et-filters modern-et-filters">
          <label className="filter-select modern-select-pill">
            <Filter size={15} />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>Semua Status</option>
              {FOOD_SECURITY_CATEGORIES.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <motion.button
            className={`drawer-toggle-btn modern-pill-btn ${showDrawer ? 'active' : ''}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <Info size={15} /> Detail Panel
          </motion.button>

        </div>
      </div>

      {/* Main Map Body with Detail Drawer */}
      <div className="explorer-body">
        <div className="map-wrapper">
          <MapView
            selectedKecamatan={selectedKec}
            onSelectKecamatan={(kec) => {
              setSelectedKec(kec);
              setShowDrawer(true);
            }}
            activeLayerFilter="pangan"
            height="min(680px, calc(100vh - 245px))"
          />
        </div>

        {/* Floating Detail Drawer */}
        {showDrawer && selectedKec && (
          <motion.div
            className="explorer-detail-drawer modern-drawer animate-slide-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="drawer-head">
              <div>
                <span className="d-badge font-mono">{selectedKec.id}</span>
                <h2>Kecamatan {selectedKec.nama}</h2>
                <span className="d-sub">Pusat Wilayah: {selectedKec.pusat}</span>
              </div>
              <button className="d-close" onClick={() => setShowDrawer(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-content">
              {/* Status Header */}
              <div className="d-status-card modern-status-card">
                <span className="dsc-lbl">Status Ketahanan Pangan</span>
                <div className={`dsc-val ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedKec.panganStatus}
                </div>
                <div className="dsc-meter">
                  <motion.div
                    className="dsc-meter-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedKec.panganSkor}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <small className="font-mono">Skor IKP: {selectedKec.panganSkor} / 100</small>
              </div>

              {/* Description */}
              <p className="d-desc-text">{selectedKec.deskripsi}</p>

              {/* Statistics Grid */}
              <div className="d-stats-grid">
                <div className="ds-box">
                  <span className="ds-lbl">Jumlah Penduduk</span>
                  <span className="ds-val">{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Air Bersih Layak</span>
                  <span className="ds-val text-cyan">{selectedKec.airBersih}%</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Prevalensi Stunting</span>
                  <span className="ds-val text-danger">{selectedKec.stunting}%</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Tingkat Kemiskinan</span>
                  <span className="ds-val">{selectedKec.tingkatKemiskinan}</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Fasilitas Kesehatan</span>
                  <span className="ds-val">{selectedKec.faskes} Unit</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Pasar Tradisional</span>
                  <span className="ds-val">{selectedKec.pasarTradisional} Pasar</span>
                </div>
              </div>

              {/* District List Picker */}
              <div className="d-picker-section">
                <span className="dp-head">Pilih Kecamatan Lain ({filteredList.length})</span>
                <div className="dp-list">
                  {filteredList.map((item) => (
                    <motion.button
                      key={item.id}
                      className={`dp-item modern-dp-item ${selectedKec.id === item.id ? 'active' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedKec(item)}
                    >
                      <MapPin size={14} className="dp-icon" />
                      <div className="dp-meta">
                        <span className="dp-name">{item.nama}</span>
                        <small className={`dp-status ${item.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.panganStatus}
                        </small>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="drawer-data-context">
                <CalendarClock size={16} />
                <div>
                  <strong>Catatan pembacaan peta</strong>
                  <span>Indikator berasal dari data periodik. Tahun, sumber, dan definisi variabel perlu tersedia sebelum dipakai untuk keputusan.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <SpatialReadinessPanel />
    </div>
  );
}
