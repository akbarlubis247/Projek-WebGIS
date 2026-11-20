import React, { useEffect, useState } from 'react';
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
  Sparkles,
  ArrowLeft,
  Home,
  ChevronDown
} from 'lucide-react';
import MapView from '../common/MapView';
import { getIndicatorClassification } from '../../data/indicatorStandards';
import { useNutriMapData } from '../../hooks/useNutriMapData';

export default function MapExplorerView({ onNavigate }) {
  const { areasGeoJson, kelurahanList, facilitiesGeoJson } = useNutriMapData();
  const [search, setSearch] = useState('');
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState('Semua Kecamatan');
  const [selectedKel, setSelectedKel] = useState(null);
  const [activeLayerFilter, setActiveLayerFilter] = useState('stunting');
  const [showDrawer, setShowDrawer] = useState(true);

  // Sync selectedKel if list updates
  useEffect(() => {
    if (!kelurahanList.length || !selectedKel) return;
    const found =
      kelurahanList.find((k) => k.id === selectedKel.id) ||
      kelurahanList.find((k) => k.nama?.toLowerCase() === selectedKel.nama?.toLowerCase());
    if (found && found !== selectedKel) {
      setSelectedKel(found);
    }
  }, [kelurahanList]);

  // Daftar Kecamatan Unik
  const kecamatanList = ['Semua Kecamatan', 'Bogor Tengah', 'Bogor Utara', 'Bogor Selatan', 'Bogor Timur', 'Bogor Barat', 'Tanah Sareal'];

  // Filter 68 Kelurahan
  const filteredList = kelurahanList.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchesKec = selectedKecamatanFilter === 'Semua Kecamatan' || item.kecamatan === selectedKecamatanFilter;
    return matchesSearch && matchesKec;
  });

  // Statistik Agregat untuk Kecamatan / Kota
  const avgStunting = filteredList.length
    ? (filteredList.reduce((acc, k) => acc + (parseFloat(k.stunting) || 0), 0) / filteredList.length).toFixed(1)
    : '0.0';
  const avgKemiskinan = filteredList.length
    ? (filteredList.reduce((acc, k) => acc + (parseFloat(k.kemiskinan) || 0), 0) / filteredList.length).toFixed(1)
    : '0.0';
  const avgPangan = filteredList.length
    ? (filteredList.reduce((acc, k) => acc + (parseFloat(k.kerentananPangan) || 0), 0) / filteredList.length).toFixed(1)
    : '0.0';
  const avgAir = filteredList.length
    ? (filteredList.reduce((acc, k) => acc + (parseFloat(k.airBersih) || 0), 0) / filteredList.length).toFixed(1)
    : '0.0';

  // Handle Export GeoJSON Nyata
  const handleExportGeoJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(areasGeoJson, null, 2));
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
        {/* Tombol Navigasi Kembali ke Beranda */}
        <motion.button
          type="button"
          className="btn-back-to-home"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate && onNavigate('landing')}
          title="Kembali ke Halaman Beranda NutriMap"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </motion.button>

        <div className="et-search modern-et-search">
          <Building2 size={17} className="icon text-emerald" />
          <select
            className="kecamatan-map-select font-bold"
            value={selectedKel ? selectedKel.id : ''}
            onChange={(e) => {
              if (!e.target.value) {
                setSelectedKel(null);
                return;
              }
              const found = kelurahanList.find((k) => k.id === e.target.value);
              if (found) {
                setSelectedKel(found);
                setShowDrawer(true);
                if (found.kecamatan && selectedKecamatanFilter !== 'Semua Kecamatan' && selectedKecamatanFilter !== found.kecamatan) {
                  setSelectedKecamatanFilter(found.kecamatan);
                }
              }
            }}
          >
            <option value="">
              {selectedKecamatanFilter === 'Semua Kecamatan' ? 'Semua Kelurahan (Kota Bogor)' : `Semua Kelurahan (${selectedKecamatanFilter})`}
            </option>
            {filteredList.map((kel) => (
              <option key={kel.id} value={kel.id}>
                Kel. {kel.nama} (Kec. {kel.kecamatan})
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="select-chevron" />
        </div>

        <div className="et-filters modern-et-filters">
          <label className="filter-select modern-select-pill">
            <Filter size={15} className="filter-icon" />
            <select
              value={selectedKecamatanFilter}
              onChange={(e) => {
                const nextKec = e.target.value;
                setSelectedKecamatanFilter(nextKec);
                setSelectedKel(null);
              }}
            >
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="chevron-icon" />
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
            geoJsonData={areasGeoJson}
            kelurahanList={kelurahanList}
            facilitiesData={facilitiesGeoJson}
            selectedKecamatan={selectedKecamatanFilter}
            selectedKelurahan={selectedKel}
            onSelectKecamatan={(kec) => {
              const name = typeof kec === 'string' ? kec : kec?.nama;
              if (name) {
                setSelectedKecamatanFilter(name);
                setSelectedKel(null);
              }
            }}
            onSelectKelurahan={(kel) => {
              setSelectedKel(kel);
              if (kel) {
                setShowDrawer(true);
              }
            }}
            activeLayerFilter={activeLayerFilter}
            height="calc(100vh - 180px)"
          />
        </div>

        {/* Floating Detail Drawer */}
        {showDrawer && (
          <motion.div
            className="explorer-detail-drawer modern-drawer animate-slide-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="drawer-head">
              <div>
                <span className="d-badge font-mono">
                  {selectedKel ? selectedKel.id : (selectedKecamatanFilter !== 'Semua Kecamatan' ? selectedKecamatanFilter.toUpperCase() : 'KOTA BOGOR')}
                </span>
                <h2 className="section-title-editorial">
                  {selectedKel ? `Kelurahan ${selectedKel.nama}` : (selectedKecamatanFilter !== 'Semua Kecamatan' ? `Kecamatan ${selectedKecamatanFilter}` : 'Seluruh Wilayah Kota Bogor')}
                </h2>
                <span className="d-sub">
                  {selectedKel ? `Kecamatan: ${selectedKel.kecamatan}` : `${filteredList.length} Kelurahan Terdata`}
                </span>
              </div>
              <button className="d-close" onClick={() => setShowDrawer(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-content">
              {selectedKel ? (
                /* Detail Kelurahan Terpilih */
                <>
                  <div style={{ marginBottom: 12 }}>
                    <button
                      type="button"
                      onClick={() => setSelectedKel(null)}
                      style={{
                        padding: '5px 12px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <ArrowLeft size={13} /> Ringkasan Kecamatan ({filteredList.length} Kelurahan)
                    </button>
                  </div>

                  {(() => {
                    const stuntingClass = getIndicatorClassification('stunting', selectedKel.stunting);
                    return (
                      <div className="d-status-card modern-status-card">
                        <span className="dsc-lbl">Tingkat Prevalensi Balita Stunting</span>
                        <div className="dsc-val" style={{ color: stuntingClass.color }}>
                          {selectedKel.stunting}%
                        </div>
                        <div className="dsc-meter">
                          <motion.div
                            className="dsc-meter-fill"
                            style={{ background: stuntingClass.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((selectedKel.stunting / 6) * 100, 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <small className="font-mono">Kategori: {stuntingClass.status}</small>
                      </div>
                    );
                  })()}

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
                </>
              ) : (
                /* Ringkasan Agregat Kecamatan / Kota */
                <>
                  {(() => {
                    const stuntingClass = getIndicatorClassification('stunting', parseFloat(avgStunting));
                    return (
                      <div className="d-status-card modern-status-card">
                        <span className="dsc-lbl">Rata-rata Prevalensi Stunting</span>
                        <div className="dsc-val" style={{ color: stuntingClass.color }}>
                          {avgStunting}%
                        </div>
                        <div className="dsc-meter">
                          <motion.div
                            className="dsc-meter-fill"
                            style={{ background: stuntingClass.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((parseFloat(avgStunting) / 6) * 100, 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <small className="font-mono">Status Agregat: {stuntingClass.status}</small>
                      </div>
                    );
                  })()}

                  <div className="d-stats-grid">
                    <div className="ds-box">
                      <span className="ds-lbl">Rata-rata Stunting</span>
                      <span className="ds-val text-danger">{avgStunting}%</span>
                    </div>
                    <div className="ds-box">
                      <span className="ds-lbl">Rata-rata Kemiskinan</span>
                      <span className="ds-val" style={{ color: '#d97706' }}>{avgKemiskinan}%</span>
                    </div>
                    <div className="ds-box">
                      <span className="ds-lbl">Rata-rata Pangan</span>
                      <span className="ds-val" style={{ color: '#2563eb' }}>{avgPangan}</span>
                    </div>
                    <div className="ds-box">
                      <span className="ds-lbl">Rata-rata Air Bersih</span>
                      <span className="ds-val text-cyan">{avgAir}%</span>
                    </div>
                  </div>
                </>
              )}

              {/* Kelurahan List Picker */}
              <div className="d-picker-section">
                <span className="dp-head">
                  {selectedKecamatanFilter !== 'Semua Kecamatan'
                    ? `Daftar Kelurahan di ${selectedKecamatanFilter} (${filteredList.length})`
                    : `Daftar Kelurahan (${filteredList.length})`}
                </span>
                <div className="dp-list" style={{ maxHeight: 240, overflowY: 'auto' }}>
                  {filteredList.map((item) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`dp-item ${selectedKel?.id === item.id ? 'active' : ''}`}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        if (selectedKel?.id === item.id) {
                          setSelectedKel(null);
                        } else {
                          setSelectedKel(item);
                        }
                      }}
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
