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
  Building2,
  Map as MapIcon
} from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR, FOOD_SECURITY_CATEGORIES } from '../data/bogorData';

// Basemap URL Providers (Clean & Free of Watermarks)
const BASEMAP_PROVIDERS = {
  light: {
    name: 'Light',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap kontributor'
  },
  street: {
    name: 'Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri & OpenStreetMap'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar'
  }
};

export default function MapView({ selectedKecamatan, onSelectKecamatan, activeLayerFilter, height = '560px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState(activeLayerFilter || 'pangan');
  const [activeBasemap, setActiveBasemap] = useState('light');
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Kota Bogor (-6.5971, 106.7949)
    const map = L.map(mapRef.current, {
      center: [-6.5971, 106.7949],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Add Initial Basemap Tile Layer
    const provider = BASEMAP_PROVIDERS.light;
    const tileLayer = L.tileLayer(provider.url, {
      maxZoom: 19,
      attribution: provider.attribution
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tile Layer when activeBasemap changes
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const provider = BASEMAP_PROVIDERS[activeBasemap] || BASEMAP_PROVIDERS.light;
    tileLayerRef.current.setUrl(provider.url);
  }, [activeBasemap]);

  // Update map markers when activeLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and circles
    markersRef.current.forEach(m => map.removeLayer(m));
    circlesRef.current.forEach(c => map.removeLayer(c));
    markersRef.current = [];
    circlesRef.current = [];

    KECAMATAN_KOTA_BOGOR.forEach(kec => {
      let color = '#16A34A';
      let radius = kec.penduduk / 500;

      if (activeLayer === 'pangan') {
        const cat = FOOD_SECURITY_CATEGORIES.find(c => c.label === kec.panganStatus);
        color = cat ? cat.color : '#16A34A';
      } else if (activeLayer === 'air') {
        color = kec.airBersih >= 92 ? '#06B6D4' : kec.airBersih >= 85 ? '#0284C7' : '#F59E0B';
      } else if (activeLayer === 'stunting') {
        color = kec.stunting < 10 ? '#16A34A' : kec.stunting < 15 ? '#F59E0B' : '#DC2626';
      } else if (activeLayer === 'faskes') {
        color = kec.faskes > 10 ? '#15803D' : '#F59E0B';
      }

      // Add Circle Buffer for spatial footprint representation
      const circle = L.circle([kec.lat, kec.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.16,
        radius: radius * 3.4,
        weight: 1.5
      }).addTo(map);
      circlesRef.current.push(circle);

      // Create Custom SVG Pin Marker
      const customIcon = L.divIcon({
        className: 'custom-map-pin-wrap',
        html: `
          <div class="custom-map-pin" style="background-color: ${color}">
            <div class="pin-inner"></div>
          </div>
          <div class="pin-label">${kec.nama}</div>
        `,
        iconSize: [28, 36],
        iconAnchor: [14, 36]
      });

      const marker = L.marker([kec.lat, kec.lng], { icon: customIcon }).addTo(map);

      // Bind Institutional Leaflet Popup
      const popupHtml = `
        <div class="leaflet-popup-card">
          <div class="l-pop-head">
            <strong>Kecamatan ${kec.nama}</strong>
            <span class="l-pop-badge" style="background-color: ${color}15; color: ${color}; border: 1px solid ${color}40;">
              ${kec.panganStatus}
            </span>
          </div>
          <p class="l-pop-desc">${kec.deskripsi}</p>
          <div class="l-pop-stats">
            <div><small>Penduduk</small><b>${kec.penduduk.toLocaleString('id-ID')} jiwa</b></div>
            <div><small>Skor IKP</small><b>${kec.panganSkor}</b></div>
            <div><small>Air Bersih</small><b>${kec.airBersih}%</b></div>
            <div><small>Stunting</small><b>${kec.stunting}%</b></div>
          </div>
          <div class="l-pop-foot">
            <span class="l-pop-center">Pusat: ${kec.pusat}</span>
            <span class="l-pop-faskes">Faskes: ${kec.faskes} Unit</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('click', () => {
        setSelectedDetails(kec);
        if (onSelectKecamatan) onSelectKecamatan(kec);
      });

      markersRef.current.push(marker);
    });

  }, [activeLayer, onSelectKecamatan]);

  // Center map when selectedKecamatan changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedKecamatan) return;
    mapInstanceRef.current.flyTo([selectedKecamatan.lat, selectedKecamatan.lng], 13, {
      duration: 1.0
    });
  }, [selectedKecamatan]);

  const handleZoomIn = () => mapInstanceRef.current && mapInstanceRef.current.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current && mapInstanceRef.current.zoomOut();
  const handleResetView = () => mapInstanceRef.current && mapInstanceRef.current.flyTo([-6.5971, 106.7949], 12);

  return (
    <div className="map-view-container" style={{ height }}>
      {/* Map Canvas */}
      <div ref={mapRef} className="leaflet-map-canvas" />

      {/* Clean Layer & Basemap Control Panel */}
      <div className="map-control-panel">
        {/* Layer Selection */}
        <div className="control-group">
          <span className="control-group-title">
            <Layers size={13} /> LAYERS
          </span>
          <div className="control-layer-list">
            <label className={`layer-option ${activeLayer === 'pangan' ? 'active' : ''}`}>
              <input
                type="radio"
                name="map-layer"
                checked={activeLayer === 'pangan'}
                onChange={() => setActiveLayer('pangan')}
              />
              <span className="radio-mark" />
              <span>Ketahanan Pangan</span>
            </label>

            <label className={`layer-option ${activeLayer === 'air' ? 'active' : ''}`}>
              <input
                type="radio"
                name="map-layer"
                checked={activeLayer === 'air'}
                onChange={() => setActiveLayer('air')}
              />
              <span className="radio-mark" />
              <span>Akses Air Bersih</span>
            </label>

            <label className={`layer-option ${activeLayer === 'stunting' ? 'active' : ''}`}>
              <input
                type="radio"
                name="map-layer"
                checked={activeLayer === 'stunting'}
                onChange={() => setActiveLayer('stunting')}
              />
              <span className="radio-mark" />
              <span>Prevalensi Stunting</span>
            </label>

            <label className={`layer-option ${activeLayer === 'faskes' ? 'active' : ''}`}>
              <input
                type="radio"
                name="map-layer"
                checked={activeLayer === 'faskes'}
                onChange={() => setActiveLayer('faskes')}
              />
              <span className="radio-mark" />
              <span>Fasilitas & Pasar</span>
            </label>
          </div>
        </div>

        <div className="control-divider" />

        {/* Basemap Selection */}
        <div className="control-group">
          <span className="control-group-title">
            <MapIcon size={13} /> BASEMAP
          </span>
          <div className="control-basemap-list">
            {Object.keys(BASEMAP_PROVIDERS).map((key) => (
              <label key={key} className={`basemap-option ${activeBasemap === key ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="basemap-layer"
                  checked={activeBasemap === key}
                  onChange={() => setActiveBasemap(key)}
                />
                <span className="radio-mark" />
                <span>{BASEMAP_PROVIDERS[key].name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Map Zoom Tools */}
      <div className="map-zoom-tools">
        <button onClick={handleZoomIn} title="Perbesar Peta">
          <ZoomIn size={16} />
        </button>
        <button onClick={handleZoomOut} title="Perkecil Peta">
          <ZoomOut size={16} />
        </button>
        <button onClick={handleResetView} title="Reset Posisi Kota Bogor">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Categorical Map Legend Overlay */}
      <div className="map-legend-card">
        <span className="legend-head">
          {activeLayer === 'pangan' && 'Klasifikasi Ketahanan Pangan'}
          {activeLayer === 'air' && 'Klasifikasi Akses Air Bersih'}
          {activeLayer === 'stunting' && 'Klasifikasi Stunting Balita'}
          {activeLayer === 'faskes' && 'Sebaran Fasilitas Kesehatan'}
        </span>

        {activeLayer === 'pangan' && (
          <div className="legend-items">
            {FOOD_SECURITY_CATEGORIES.map(cat => (
              <div key={cat.label} className="legend-row">
                <span className="legend-color-dot" style={{ backgroundColor: cat.color }} />
                <span className="legend-lbl">{cat.label}</span>
              </div>
            ))}
          </div>
        )}

        {activeLayer === 'air' && (
          <div className="legend-items">
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#06B6D4' }} />
              <span className="legend-lbl">Akses Layak (&gt;90%)</span>
            </div>
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#0284C7' }} />
              <span className="legend-lbl">Akses Cukup (85–90%)</span>
            </div>
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }} />
              <span className="legend-lbl">Akses Waspada (&lt;85%)</span>
            </div>
          </div>
        )}

        {activeLayer === 'stunting' && (
          <div className="legend-items">
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#16A34A' }} />
              <span className="legend-lbl">Rendah (&lt;10%)</span>
            </div>
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }} />
              <span className="legend-lbl">Sedang (10–15%)</span>
            </div>
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#DC2626' }} />
              <span className="legend-lbl">Tinggi (&gt;15%)</span>
            </div>
          </div>
        )}

        {activeLayer === 'faskes' && (
          <div className="legend-items">
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#15803D' }} />
              <span className="legend-lbl">Faskes Lengkap (&gt;10 Unit)</span>
            </div>
            <div className="legend-row">
              <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }} />
              <span className="legend-lbl">Faskes Terbatas (≤10 Unit)</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Coordinate Metadata Bar */}
      <div className="map-coord-bar">
        <span>Kota Bogor, Jawa Barat</span>
        <code>-6.5971° S, 106.7949° E</code>
      </div>
    </div>
  );
}
