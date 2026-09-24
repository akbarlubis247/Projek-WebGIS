import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Utensils,
  Droplets,
  HeartPulse,
  TrendingDown,
  Building2,
  Map as MapIcon,
  ChevronDown,
  Info
} from 'lucide-react';
import { BOGOR_KELURAHAN_GEOJSON } from '../../data/bogorKelurahanGeoJSON';
import { KECAMATAN_KOTA_BOGOR } from '../../data/bogorData';
import { KELURAHAN_68_BOGOR } from '../../data/bogorKelurahanData';
import { LAYER_DEFINITIONS, getIndicatorClassification } from '../../data/indicatorStandards';

// Basemap URL Providers (Bebas Watermark & Open Source)
const BASEMAP_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap (Standard)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor'
  },
  osmHot: {
    name: 'OSM Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap kontributor, Humanitarian Map Style'
  },
  satellite: {
    name: 'Esri Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics'
  }
};

// Metadata Pusat Koordinat & Kelurahan per Kecamatan
const KECAMATAN_LOCATIONS = {
  'Semua Kecamatan': { name: 'Semua Kecamatan (Kota Bogor)', center: [-6.5971, 106.7949], zoom: 13, count: 68 },
  'Bogor Tengah': { name: 'Kec. Bogor Tengah', center: [-6.5971, 106.7949], zoom: 14.2, count: 11 },
  'Bogor Utara': { name: 'Kec. Bogor Utara', center: [-6.5614, 106.8122], zoom: 14.2, count: 8 },
  'Bogor Selatan': { name: 'Kec. Bogor Selatan', center: [-6.6350, 106.8100], zoom: 13.5, count: 16 },
  'Bogor Timur': { name: 'Kec. Bogor Timur', center: [-6.6200, 106.8300], zoom: 14.2, count: 6 },
  'Bogor Barat': { name: 'Kec. Bogor Barat', center: [-6.5786, 106.7644], zoom: 13.6, count: 16 },
  'Tanah Sareal': { name: 'Kec. Tanah Sareal', center: [-6.5550, 106.7878], zoom: 14.0, count: 11 }
};

export default function MapView({
  selectedKecamatan,
  onSelectKecamatan,
  selectedKelurahan,
  onSelectKelurahan,
  activeLayerFilter,
  activeLayer: activeLayerProp,
  onActiveLayerChange,
  height = '600px'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);

  // State Layer Aktif & Filter Kecamatan
  const [activeLayer, setActiveLayer] = useState(activeLayerFilter || activeLayerProp || 'stunting');
  const [activeBasemap, setActiveBasemap] = useState('osm');
  const [selectedKecFilter, setSelectedKecFilter] = useState('Semua Kecamatan');
  const [hoveredKelurahan, setHoveredKelurahan] = useState(null);

  // Sinkronkan activeLayer jika prop berubah
  useEffect(() => {
    const l = activeLayerFilter || activeLayerProp;
    if (l) {
      setActiveLayer(l);
    }
  }, [activeLayerFilter, activeLayerProp]);

  // Handler ganti layer dengan sinkronisasi ke parent
  const handleSwitchLayer = (layerKey) => {
    setActiveLayer(layerKey);
    setLayerDropdownOpen(false);
    if (onActiveLayerChange) {
      onActiveLayerChange(layerKey);
    }
  };

  // Dropdown states
  const [layerDropdownOpen, setLayerDropdownOpen] = useState(false);
  const [basemapDropdownOpen, setBasemapDropdownOpen] = useState(false);
  const [kecDropdownOpen, setKecDropdownOpen] = useState(false);
  const layerDropdownRef = useRef(null);
  const basemapDropdownRef = useRef(null);
  const kecDropdownRef = useRef(null);

  const layerLabels = {
    stunting: 'Prevalensi Stunting (C1)',
    kemiskinan: 'Tingkat Kemiskinan / DTKS (C2)',
    pangan: 'Kerentanan Pangan (C3)',
    air: 'Akses Sanitasi Air Bersih (C4)'
  };

  // Target yang sedang aktif (terpilih atau sedang dihover kursor)
  const activeTarget = hoveredKelurahan || selectedKelurahan;
  const activeTargetVal = activeTarget
    ? activeTarget[LAYER_DEFINITIONS[activeLayer]?.propKey || 'stunting']
    : null;
  const activeTargetInfo = activeTargetVal !== null && activeTargetVal !== undefined
    ? getIndicatorClassification(activeLayer, activeTargetVal)
    : null;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (layerDropdownRef.current && !layerDropdownRef.current.contains(e.target)) {
        setLayerDropdownOpen(false);
      }
      if (basemapDropdownRef.current && !basemapDropdownRef.current.contains(e.target)) {
        setBasemapDropdownOpen(false);
      }
      if (kecDropdownRef.current && !kecDropdownRef.current.contains(e.target)) {
        setKecDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Window bridge untuk interaksi tombol di dalam Leaflet Popup HTML
  useEffect(() => {
    window.__nutrimap_select_kel = (kelId) => {
      const found = KELURAHAN_68_BOGOR.find((k) => k.id === kelId);
      if (found) {
        if (onSelectKelurahan) onSelectKelurahan(found);
        const parent = KECAMATAN_KOTA_BOGOR.find((k) => k.nama === found.kecamatan);
        if (parent && onSelectKecamatan) onSelectKecamatan(parent, found);
      }
    };
    return () => {
      delete window.__nutrimap_select_kel;
    };
  }, [onSelectKelurahan, onSelectKecamatan]);

  // Logika Pewarnaan Choropleth Bergradasi 5 Tingkat Berbasis Standar Tunggal
  const getChoroplethColor = (val, layer) => {
    return getIndicatorClassification(layer, val).color;
  };

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    // Titik Pusat Kota Bogor (-6.5971, 106.7949)
    const map = L.map(mapRef.current, {
      center: [-6.5971, 106.7949],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    const provider = BASEMAP_PROVIDERS.osm;
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap saat dipilih
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const provider = BASEMAP_PROVIDERS[activeBasemap];
    tileLayerRef.current.setUrl(provider.url);
  }, [activeBasemap]);

  // Handler Pilih Kecamatan: Menjamin sinkronisasi dropdown, zoom bounds, dan parent component
  const handleSelectKecamatan = (kecName) => {
    setSelectedKecFilter(kecName);
    setKecDropdownOpen(false);

    // 1. Cari data kecamatan lengkap dan kabarkan parent
    if (kecName === 'Semua Kecamatan') {
      if (onSelectKecamatan) {
        onSelectKecamatan(null);
      }
      if (onSelectKelurahan) {
        onSelectKelurahan(null);
      }
    } else {
      const matchedKec = KECAMATAN_KOTA_BOGOR.find((k) => k.nama === kecName);
      if (matchedKec && onSelectKecamatan) {
        onSelectKecamatan(matchedKec);
      }
      if (onSelectKelurahan) {
        onSelectKelurahan(null);
      }
    }

    // 2. Zoom kamera Leaflet tepat ke bounds kelurahan yang sesuai
    if (mapInstanceRef.current && geojsonLayerRef.current) {
      if (kecName === 'Semua Kecamatan') {
        mapInstanceRef.current.setView([-6.5971, 106.7949], 13);
      } else {
        const bounds = L.latLngBounds();
        let foundCount = 0;
        geojsonLayerRef.current.eachLayer((layer) => {
          if (layer.feature && layer.feature.properties && layer.feature.properties.kecamatan === kecName) {
            bounds.extend(layer.getBounds());
            foundCount++;
          }
        });
        if (foundCount > 0 && bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 14.5 });
        } else if (KECAMATAN_LOCATIONS[kecName]) {
          const loc = KECAMATAN_LOCATIONS[kecName];
          mapInstanceRef.current.flyTo(loc.center, loc.zoom, { duration: 1.2 });
        }
      }
    }
  };

  // Efek sinkronisasi: Jika selectedKecamatan diubah dari luar (misal klik tabel atau tombol kembali)
  useEffect(() => {
    if (!selectedKecamatan) {
      if (selectedKecFilter !== 'Semua Kecamatan') {
        setSelectedKecFilter('Semua Kecamatan');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([-6.5971, 106.7949], 13);
        }
      }
      return;
    }
    const kecName = typeof selectedKecamatan === 'string'
      ? selectedKecamatan
      : selectedKecamatan.kecamatan || selectedKecamatan.nama;
    if (kecName && KECAMATAN_LOCATIONS[kecName] && kecName !== selectedKecFilter) {
      setSelectedKecFilter(kecName);
    }
    if (mapInstanceRef.current && selectedKecamatan.lat && selectedKecamatan.lng) {
      mapInstanceRef.current.flyTo([selectedKecamatan.lat, selectedKecamatan.lng], 14.5, {
        duration: 1.2
      });
    }
  }, [selectedKecamatan]);

  // Efek sinkronisasi: Jika selectedKelurahan diubah dari luar (misal klik chip di panel kanan)
  useEffect(() => {
    if (!selectedKelurahan || !geojsonLayerRef.current || !mapInstanceRef.current) return;
    geojsonLayerRef.current.eachLayer((layer) => {
      if (layer.feature && layer.feature.properties && layer.feature.properties.id === selectedKelurahan.id) {
        layer.openPopup();
        mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 15.5 });
      }
    });
  }, [selectedKelurahan]);

  // Render Lapisan Poligon Choropleth 68 Kelurahan dengan Popup Interaktif Lengkap
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Hapus layer GeoJSON lama jika ada
    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    // Fungsi Style Dinamis Tiap Poligon dengan Dukungan Filter Kecamatan & Active Kelurahan
    const styleFeature = (feature) => {
      const p = feature.properties;
      let val = p.stunting;
      if (activeLayer === 'kemiskinan') val = p.kemiskinan;
      if (activeLayer === 'pangan') val = p.kerentananPangan;
      if (activeLayer === 'air') val = p.airBersih;

      const isMatchKec = selectedKecFilter === 'Semua Kecamatan' || p.kecamatan === selectedKecFilter;
      const isSelectedKel = selectedKelurahan && selectedKelurahan.id === p.id;
      const fillColor = getChoroplethColor(val, activeLayer);

      return {
        fillColor: fillColor,
        weight: isSelectedKel ? 3.5 : (isMatchKec ? 2 : 0.8),
        opacity: isSelectedKel ? 1 : (isMatchKec ? 1 : 0.35),
        color: isSelectedKel ? '#0284c7' : (isMatchKec ? '#ffffff' : '#94a3b8'),
        dashArray: isSelectedKel ? '' : (isMatchKec ? '1' : '3'),
        fillOpacity: isSelectedKel ? 0.95 : (isMatchKec ? 0.80 : 0.12)
      };
    };

    // Pasang GeoJSON Layer
    const geoLayer = L.geoJSON(BOGOR_KELURAHAN_GEOJSON, {
      style: styleFeature,
      onEachFeature: (feature, layer) => {
        const p = feature.properties;

        // Hover Effect
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 3.5,
              color: '#0f172a',
              dashArray: '',
              fillOpacity: 0.95
            });
            l.bringToFront();
            setHoveredKelurahan(p);
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
          },
          click: (e) => {
            const l = e.target;
            map.fitBounds(l.getBounds(), { padding: [60, 60], maxZoom: 15.5 });
            l.openPopup();

            // Panggil callback kelurahan
            if (onSelectKelurahan) onSelectKelurahan(p);

            // Sinkronkan juga objek kecamatan induknya ke parent
            const parentKec = KECAMATAN_KOTA_BOGOR.find((k) => k.nama === p.kecamatan);
            if (parentKec && onSelectKecamatan) {
              onSelectKecamatan(parentKec, p);
            }
          }
        });

        // Status klasifikasi kelurahan sesuai layer yang sedang aktif
        const valAktif = p[LAYER_DEFINITIONS[activeLayer]?.propKey || 'stunting'];
        const classAktif = getIndicatorClassification(activeLayer, valAktif);

        // Status klasifikasi masing-masing indikator
        const classStunt = getIndicatorClassification('stunting', p.stunting);
        const classKemiskinan = getIndicatorClassification('kemiskinan', p.kemiskinan);
        const classPangan = getIndicatorClassification('pangan', p.kerentananPangan);
        const classAir = getIndicatorClassification('air', p.airBersih);

        // Konten Pop-up Modern, Lengkap 4 Indikator + Action Button (FR-MAP-05)
        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; padding: 4px; min-width: 250px; max-width: 290px; color: #1e293b;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.5px;">${p.id}</span>
              <span style="font-size: 10px; font-weight: 700; background: ${classAktif.bg}; color: ${classAktif.textBadge}; padding: 2px 8px; border-radius: 9999px; border: 1px solid ${classAktif.border};">
                ${classAktif.status}
              </span>
            </div>
            
            <div style="border-bottom: 1.5px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px;">
              <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: 800; color: #0f172a; line-height: 1.2;">Kel. ${p.nama}</h4>
              <span style="font-size: 12px; color: #64748b; font-weight: 600;">Kecamatan ${p.kecamatan}, Kota Bogor</span>
            </div>

            <div style="font-size: 12px; display: grid; gap: 7px; margin-bottom: 12px;">
              <!-- 1. Stunting -->
              <div style="background: ${activeLayer === 'stunting' ? classStunt.bg : '#f8fafc'}; border: 1px solid ${activeLayer === 'stunting' ? classStunt.border : '#f1f5f9'}; padding: 6px 8px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                  <span style="color: #64748b; font-size: 11.5px;">🍼 Prevalensi Stunting</span>
                  <strong style="color: ${classStunt.color}; font-size: 13px;">${p.stunting}%</strong>
                </div>
                <div style="height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${Math.min((p.stunting / 25) * 100, 100)}%; background: ${classStunt.color}; border-radius: 3px;"></div>
                </div>
              </div>

              <!-- 2. Kemiskinan -->
              <div style="background: ${activeLayer === 'kemiskinan' ? classKemiskinan.bg : '#f8fafc'}; border: 1px solid ${activeLayer === 'kemiskinan' ? classKemiskinan.border : '#f1f5f9'}; padding: 6px 8px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                  <span style="color: #64748b; font-size: 11.5px;">👥 Tingkat Kemiskinan / DTKS</span>
                  <strong style="color: ${classKemiskinan.color}; font-size: 13px;">${p.kemiskinan}%</strong>
                </div>
                <div style="height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${Math.min((p.kemiskinan / 15) * 100, 100)}%; background: ${classKemiskinan.color}; border-radius: 3px;"></div>
                </div>
              </div>

              <!-- 3. Kerentanan Pangan -->
              <div style="background: ${activeLayer === 'pangan' ? classPangan.bg : '#f8fafc'}; border: 1px solid ${activeLayer === 'pangan' ? classPangan.border : '#f1f5f9'}; padding: 6px 8px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                  <span style="color: #64748b; font-size: 11.5px;">🌾 Kerentanan Pangan</span>
                  <strong style="color: ${classPangan.color}; font-size: 13px;">${p.kerentananPangan} <small style="color: #94a3b8; font-weight: normal;">/ 100</small></strong>
                </div>
                <div style="height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${Math.min(p.kerentananPangan, 100)}%; background: ${classPangan.color}; border-radius: 3px;"></div>
                </div>
              </div>

              <!-- 4. Air Bersih -->
              <div style="background: ${activeLayer === 'air' ? classAir.bg : '#f8fafc'}; border: 1px solid ${activeLayer === 'air' ? classAir.border : '#f1f5f9'}; padding: 6px 8px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                  <span style="color: #64748b; font-size: 11.5px;">💧 Akses Air Bersih Layak</span>
                  <strong style="color: ${classAir.color}; font-size: 13px;">${p.airBersih}%</strong>
                </div>
                <div style="height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${Math.min(p.airBersih, 100)}%; background: ${classAir.color}; border-radius: 3px;"></div>
                </div>
              </div>
            </div>

            <div style="padding-top: 6px; border-top: 1px solid #f1f5f9;">
              <button
                type="button"
                onclick="window.__nutrimap_select_kel && window.__nutrimap_select_kel('${p.id}')"
                style="width: 100%; padding: 7px 10px; background: #0284c7; hover: background: #0369a1; color: #ffffff; border: none; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 1px 2px rgba(2,132,199,0.3);"
              >
                <span>📌 Tampilkan Detail di Panel Samping</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        `;
        layer.bindPopup(popupContent, { maxWidth: 320 });
      }
    }).addTo(map);

    geojsonLayerRef.current = geoLayer;
  }, [activeLayer, selectedKecFilter, selectedKelurahan]);

  // Map Controls
  const handleZoomIn = () => mapInstanceRef.current && mapInstanceRef.current.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current && mapInstanceRef.current.zoomOut();
  const handleResetView = () => {
    setSelectedKecFilter('Semua Kecamatan');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-6.5971, 106.7949], 13);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: height, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
      {/* Wadah DOM Leaflet */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 0 }} />

      {/* Kontrol Kiri Atas: Pemilihan Kecamatan, Layer Indikator, dan Basemap */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 500, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {/* 1. Pemilihan Kecamatan (Kecamatan Selector) */}
        <div ref={kecDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setKecDropdownOpen(!kecDropdownOpen)}
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: selectedKecFilter !== 'Semua Kecamatan' ? '2px solid #0284c7' : '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: selectedKecFilter !== 'Semua Kecamatan' ? '#0369a1' : '#0f172a'
            }}
          >
            <Building2 size={16} color={selectedKecFilter !== 'Semua Kecamatan' ? '#0284c7' : '#64748b'} />
            <span>{selectedKecFilter === 'Semua Kecamatan' ? '📍 Pilih Kecamatan' : `📍 ${selectedKecFilter}`}</span>
            <ChevronDown size={14} />
          </button>

          {kecDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              width: 270,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 600
            }}>
              {Object.keys(KECAMATAN_LOCATIONS).map((k) => (
                <div
                  key={k}
                  onClick={() => handleSelectKecamatan(k)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    background: selectedKecFilter === k ? '#f0f9ff' : 'transparent',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: 13,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.15s'
                  }}
                >
                  <span style={{ fontWeight: selectedKecFilter === k ? 700 : 500, color: selectedKecFilter === k ? '#0284c7' : '#0f172a' }}>
                    {KECAMATAN_LOCATIONS[k].name}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                    {KECAMATAN_LOCATIONS[k].count} Kel
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Reset Filter jika sedang pilih kecamatan tertentu */}
        {selectedKecFilter !== 'Semua Kecamatan' && (
          <button
            onClick={() => handleSelectKecamatan('Semua Kecamatan')}
            style={{
              padding: '8px 12px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569'
            }}
          >
            ✕ Tampilkan Semua
          </button>
        )}

        {/* 2. Penggantian Lapisan Indikator (Layer Toggling) */}
        <div ref={layerDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#0f172a'
            }}
          >
            <Layers size={16} color="#0284c7" />
            <span>Layer: {layerLabels[activeLayer]}</span>
            <ChevronDown size={14} />
          </button>

          {layerDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: 240,
              overflow: 'hidden',
              zIndex: 600
            }}>
              <div
                onClick={() => handleSwitchLayer('stunting')}
                style={{ padding: '10px 14px', cursor: 'pointer', background: activeLayer === 'stunting' ? '#f0f9ff' : 'transparent', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: activeLayer === 'stunting' ? 700 : 500 }}
              >
                Prevalensi Stunting (%)
              </div>
              <div
                onClick={() => handleSwitchLayer('kemiskinan')}
                style={{ padding: '10px 14px', cursor: 'pointer', background: activeLayer === 'kemiskinan' ? '#f0f9ff' : 'transparent', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: activeLayer === 'kemiskinan' ? 700 : 500 }}
              >
                Tingkat Kemiskinan / DTKS (%)
              </div>
              <div
                onClick={() => handleSwitchLayer('pangan')}
                style={{ padding: '10px 14px', cursor: 'pointer', background: activeLayer === 'pangan' ? '#f0f9ff' : 'transparent', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: activeLayer === 'pangan' ? 700 : 500 }}
              >
                Kerentanan Pangan (Skor)
              </div>
              <div
                onClick={() => handleSwitchLayer('air')}
                style={{ padding: '10px 14px', cursor: 'pointer', background: activeLayer === 'air' ? '#f0f9ff' : 'transparent', fontSize: 13, fontWeight: activeLayer === 'air' ? 700 : 500 }}
              >
                Sanitasi Air Bersih (%)
              </div>
            </div>
          )}
        </div>

        {/* 3. Pemilihan Basemap */}
        <div ref={basemapDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setBasemapDropdownOpen(!basemapDropdownOpen)}
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#0f172a'
            }}
          >
            <MapIcon size={16} color="#64748b" />
            <span>Peta: {BASEMAP_PROVIDERS[activeBasemap].name}</span>
            <ChevronDown size={14} />
          </button>

          {basemapDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: 200,
              overflow: 'hidden',
              zIndex: 600
            }}>
              {Object.keys(BASEMAP_PROVIDERS).map((k) => (
                <div
                  key={k}
                  onClick={() => { setActiveBasemap(k); setBasemapDropdownOpen(false); }}
                  style={{ padding: '10px 14px', cursor: 'pointer', background: activeBasemap === k ? '#f0f9ff' : 'transparent', fontSize: 13 }}
                >
                  {BASEMAP_PROVIDERS[k].name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls di Kanan Atas */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 500, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={handleZoomIn} style={{ width: 34, height: 34, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ZoomIn size={16} />
        </button>
        <button onClick={handleZoomOut} style={{ width: 34, height: 34, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ZoomOut size={16} />
        </button>
        <button onClick={handleResetView} title="Reset Posisi Kota Bogor" style={{ width: 34, height: 34, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Info Card di Kiri Bawah (Tetap Aktif saat Ada Wilayah Terpilih atau Dihover) */}
      {activeTarget && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 16,
          zIndex: 500,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(6px)',
          border: `1.5px solid ${activeTargetInfo?.border || '#cbd5e1'}`,
          borderRadius: 10,
          padding: '11px 15px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          minWidth: 230
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.5px' }}>
              {hoveredKelurahan ? '👁️ Sorot Wilayah' : '📌 Wilayah Terpilih'}
            </span>
            {activeTargetInfo && (
              <span style={{ fontSize: 10, fontWeight: 700, background: activeTargetInfo.bg, color: activeTargetInfo.textBadge, padding: '1px 6px', borderRadius: 4, border: `1px solid ${activeTargetInfo.border}` }}>
                {activeTargetInfo.shortTier}
              </span>
            )}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Kel. {activeTarget.nama}</div>
          <div style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 600 }}>Kec. {activeTarget.kecamatan}</div>
          <div style={{ fontSize: 12.5, marginTop: 6, color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{LAYER_DEFINITIONS[activeLayer]?.shortLabel || 'Indikator'}:</span>
            <strong style={{ color: activeTargetInfo?.color || '#0f172a', fontSize: 14 }}>
              {activeTargetVal}{LAYER_DEFINITIONS[activeLayer]?.unit || ''}
            </strong>
          </div>
        </div>
      )}

      {/* Legenda Tematik Dinamis dengan Sinkronisasi Nilai Terpilih di Kanan Bawah */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 16,
        zIndex: 500,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(6px)',
        border: '1px solid #cbd5e1',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        fontSize: 12,
        minWidth: 260
      }}>
        <div style={{ fontWeight: 800, marginBottom: 8, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={14} color="#0284c7" />
            <span>Legenda: {LAYER_DEFINITIONS[activeLayer]?.shortLabel}</span>
          </div>
          {activeTargetInfo && (
            <span style={{ fontSize: 11, fontWeight: 800, color: activeTargetInfo.textBadge, background: activeTargetInfo.bg, border: `1px solid ${activeTargetInfo.border}`, padding: '1px 6px', borderRadius: 4 }}>
              {activeTargetVal}{LAYER_DEFINITIONS[activeLayer]?.unit}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gap: 4 }}>
          {LAYER_DEFINITIONS[activeLayer]?.thresholds.map((tier, idx) => {
            const isTargetTier = activeTargetInfo && activeTargetInfo.tierIndex === idx;
            return (
              <div
                key={tier.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '3px 6px',
                  borderRadius: 5,
                  background: isTargetTier ? tier.bg : 'transparent',
                  border: isTargetTier ? `1.5px solid ${tier.border}` : '1.5px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, background: tier.color, borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                  <span style={{ fontSize: 11.5, color: isTargetTier ? '#0f172a' : '#475569', fontWeight: isTargetTier ? 700 : 500 }}>
                    {tier.label}
                  </span>
                </div>
                {isTargetTier && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: tier.textBadge, background: '#ffffff', padding: '1px 5px', borderRadius: 4, border: `1px solid ${tier.border}`, flexShrink: 0 }}>
                    ◀ Terpilih
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
