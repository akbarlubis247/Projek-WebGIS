import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  X,
  ChevronRight,
  Download,
  Info,
  Building2,
  Utensils,
  Droplets,
  HeartPulse,
  Share2
} from 'lucide-react';
import MapView from './MapView';
import { KECAMATAN_DATA, FOOD_SECURITY_CATEGORIES } from '../data/bogorData';

export default function MapExplorerView({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedKec, setSelectedKec] = useState(KECAMATAN_DATA[0]);
  const [activeLayerFilter, setActiveLayerFilter] = useState('pangan');
  const [showDrawer, setShowDrawer] = useState(true);

  // Filtered dataset
  const filteredList = KECAMATAN_DATA.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'Semua Status' || item.panganStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="map-explorer-page animate-fade-in">
      {/* Top Filter Bar */}
      <div className="explorer-top-bar">
        <div className="et-search">
          <Search size={18} className="icon" />
          <input
            type="text"
            placeholder="Cari kecamatan di Kabupaten Bogor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}>×</button>}
        </div>

        <div className="et-filters">
          <label className="filter-select">
            <Filter size={16} />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>Semua Status</option>
              {FOOD_SECURITY_CATEGORIES.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`drawer-toggle-btn ${showDrawer ? 'active' : ''}`}
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <Info size={16} /> Detail Panel
          </button>

          <button
            className="export-btn-sm"
            onClick={() => alert('Mengunduh data Spasial GeoJSON Kabupaten Bogor...')}
          >
            <Download size={16} /> Export GeoJSON
          </button>
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
            activeLayerFilter={activeLayerFilter}
            height="calc(100vh - 170px)"
          />
        </div>

        {/* Floating Detail Drawer */}
        {showDrawer && selectedKec && (
          <div className="explorer-detail-drawer animate-slide-left">
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
              <div className="d-status-card">
                <span className="dsc-lbl">Status Ketahanan Pangan</span>
                <div className={`dsc-val ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedKec.panganStatus}
                </div>
                <div className="dsc-meter">
                  <div
                    className="dsc-meter-fill"
                    style={{ width: `${selectedKec.panganSkor}%` }}
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
                  <span className="ds-val">{selectedKec.airBersih}%</span>
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
                    <button
                      key={item.id}
                      className={`dp-item ${selectedKec.id === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedKec(item)}
                    >
                      <MapPin size={14} />
                      <span>{item.nama}</span>
                      <small>{item.panganStatus}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
