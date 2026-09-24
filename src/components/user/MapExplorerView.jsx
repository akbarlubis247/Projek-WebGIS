import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  X,
  Download,
  Info,
  Building2,
  Utensils,
  Droplets,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import MapView from '../common/MapView';
import { KELURAHAN_68_BOGOR } from '../../data/bogorKelurahanData';
import { BOGOR_KELURAHAN_GEOJSON } from '../../data/bogorKelurahanGeoJSON';

export default function MapExplorerView({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState('Semua Kecamatan');
  const [selectedKel, setSelectedKel] = useState(KELURAHAN_68_BOGOR[0]);
  const [activeLayerFilter, setActiveLayerFilter] = useState('stunting');
  const [showDrawer, setShowDrawer] = useState(true);

  // Daftar Kecamatan Unik
  const kecamatanList = ['Semua Kecamatan', 'Bogor Tengah', 'Bogor Utara', 'Bogor Selatan', 'Bogor Timur', 'Bogor Barat', 'Tanah Sareal'];

  // Filter 68 Kelurahan
  const filteredList = KELURAHAN_68_BOGOR.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchesKec = selectedKecamatanFilter === 'Semua Kecamatan' || item.kecamatan === selectedKecamatanFilter;
    return matchesSearch && matchesKec;
  });

  // Handle Export GeoJSON Nyata
  const handleExportGeoJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(BOGOR_KELURAHAN_GEOJSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'bogor_68_kelurahan_geodata.geojson');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="map-explorer-page animate-fade-in">
      {/* Top Filter Bar */}
      <div className="explorer-top-bar modern-top-bar">
        <div className="et-search modern-et-search">
          <Building2 size={18} className="icon text-emerald" />
          <select
            className="kecamatan-map-select font-bold"
            value={selectedKel ? selectedKel.id : ''}
            onChange={(e) => {
              const found = KELURAHAN_68_BOGOR.find((k) => k.id === e.target.value);
              if (found) {
                setSelectedKel(found);
                setShowDrawer(true);
              }
            }}
          >
            {KELURAHAN_68_BOGOR.map((kel) => (
              <option key={kel.id} value={kel.id}>
                📍 Kel. {kel.nama} (Kec. {kel.kecamatan})
              </option>
            ))}
          </select>
        </div>

        <div className="et-filters modern-et-filters">
          <label className="filter-select modern-select-pill">
            <Filter size={15} />
            <select value={selectedKecamatanFilter} onChange={(e) => setSelectedKecamatanFilter(e.target.value)}>
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
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

          <motion.button
            className="export-btn-sm modern-primary-pill"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportGeoJSON}
          >
            <Download size={15} /> Export GeoJSON (68 Kelurahan)
          </motion.button>
        </div>
      </div>

      {/* Main Map Body with Detail Drawer */}
      <div className="explorer-body">
        <div className="map-wrapper">
          <MapView
            selectedKecamatan={selectedKecamatanFilter}
            selectedKelurahan={selectedKel}
            onSelectKecamatan={(kec) => {
              const name = typeof kec === 'string' ? kec : kec?.nama;
              if (name) setSelectedKecamatanFilter(name);
            }}
            onSelectKelurahan={(kel) => {
              if (kel) {
                setSelectedKel(kel);
                setShowDrawer(true);
              }
            }}
            activeLayerFilter={activeLayerFilter}
            height="calc(100vh - 180px)"
          />
        </div>

        {/* Floating Detail Drawer */}
        {showDrawer && selectedKel && (
          <motion.div
            className="explorer-detail-drawer modern-drawer animate-slide-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="drawer-head">
              <div>
                <span className="d-badge font-mono">{selectedKel.id}</span>
                <h2>Kelurahan {selectedKel.nama}</h2>
                <span className="d-sub">Kecamatan: {selectedKel.kecamatan}</span>
              </div>
              <button className="d-close" onClick={() => setShowDrawer(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-content">
              {/* Status Header */}
              <div className="d-status-card modern-status-card">
                <span className="dsc-lbl">Tingkat Prevalensi Balita Stunting</span>
                <div className="dsc-val" style={{ color: selectedKel.stunting >= 16 ? '#dc2626' : (selectedKel.stunting >= 12 ? '#f59e0b' : '#16a34a') }}>
                  {selectedKel.stunting}%
                </div>
                <div className="dsc-meter">
                  <motion.div
                    className="dsc-meter-fill"
                    style={{ background: selectedKel.stunting >= 16 ? '#dc2626' : (selectedKel.stunting >= 12 ? '#f59e0b' : '#16a34a') }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(selectedKel.stunting * 3.5, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <small className="font-mono">Kategori: {selectedKel.stunting >= 16 ? 'Tinggi (Prioritas 1)' : (selectedKel.stunting >= 12 ? 'Sedang' : 'Terkendali')}</small>
              </div>

              {/* Statistics Grid 4 Indikator PRD */}
              <div className="d-stats-grid">
                <div className="ds-box">
                  <span className="ds-lbl">Prevalensi Stunting</span>
                  <span className="ds-val text-danger">{selectedKel.stunting}%</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Tingkat Kemiskinan</span>
                  <span className="ds-val" style={{ color: '#d97706' }}>{selectedKel.kemiskinan}%</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Kerentanan Pangan</span>
                  <span className="ds-val" style={{ color: '#2563eb' }}>{selectedKel.kerentananPangan}</span>
                </div>
                <div className="ds-box">
                  <span className="ds-lbl">Akses Air Bersih</span>
                  <span className="ds-val text-cyan">{selectedKel.airBersih}%</span>
                </div>
              </div>

              {/* Kelurahan List Picker */}
              <div className="d-picker-section">
                <span className="dp-head">Kelurahan Terkait ({filteredList.length})</span>
                <div className="dp-list" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {filteredList.map((item) => (
                    <motion.button
                      key={item.id}
                      className={`dp-item ${selectedKel.id === item.id ? 'active' : ''}`}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedKel(item)}
                    >
                      <MapPin size={14} className="dp-icon" />
                      <div className="dp-info">
                        <strong>{item.nama}</strong>
                        <small>Stunting: {item.stunting}% | Air: {item.airBersih}%</small>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
