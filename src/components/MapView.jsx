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
  Building2
} from 'lucide-react';
import { KECAMATAN_KOTA_BOGOR, FOOD_SECURITY_CATEGORIES } from '../data/bogorData';

export default function MapView({ selectedKecamatan, onSelectKecamatan, activeLayerFilter, height = '520px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState(activeLayerFilter || 'pangan');
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

    // CartoDB Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when activeLayer or kecamatan data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and circles
    markersRef.current.forEach(m => map.removeLayer(m));
    circlesRef.current.forEach(c => map.removeLayer(c));
    markersRef.current = [];
    circlesRef.current = [];

    KECAMATAN_KOTA_BOGOR.forEach(kec => {
      let color = '#10b981';
      let radius = kec.penduduk / 500;

      if (activeLayer === 'pangan') {
        const cat = FOOD_SECURITY_CATEGORIES.find(c => c.label === kec.panganStatus);
        color = cat ? cat.color : '#10b981';
      } else if (activeLayer === 'air') {
        color = kec.airBersih > 90 ? '#06b6d4' : kec.airBersih > 85 ? '#3b82f6' : '#f59e0b';
      } else if (activeLayer === 'stunting') {
        color = kec.stunting < 10 ? '#10b981' : kec.stunting < 15 ? '#f59e0b' : '#ef4444';
      } else if (activeLayer === 'faskes') {
        color = kec.faskes > 10 ? '#8b5cf6' : '#ec4899';
      }

      // Add Circle Buffer for area representation
      const circle = L.circle([kec.lat, kec.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: radius * 3.5,
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

      // Bind Popup with stylized HTML
      const popupHtml = `
        <div class="leaflet-popup-card">
          <div class="l-pop-head">
            <strong>Kecamatan ${kec.nama}</strong>
            <span class="l-pop-badge" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}60;">
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

  // Center map if selectedKecamatan changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedKecamatan) return;
    mapInstanceRef.current.flyTo([selectedKecamatan.lat, selectedKecamatan.lng], 13, {
      duration: 1.2
    });
  }, [selectedKecamatan]);

  const handleZoomIn = () => mapInstanceRef.current && mapInstanceRef.current.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current && mapInstanceRef.current.zoomOut();
  const handleResetView = () => mapInstanceRef.current && mapInstanceRef.current.flyTo([-6.5971, 106.7949], 12);

  return (
    <div className="map-view-container" style={{ height }}>
      {/* Map Element */}
      <div ref={mapRef} className="leaflet-map-canvas" />

      {/* Floating Layer Controls */}
      <div className="map-layer-selector">
        <span className="layer-title">
          <Layers size={14} /> Layer Tematik
        </span>
        <div className="layer-buttons">
          <button
            className={`layer-btn ${activeLayer === 'pangan' ? 'active' : ''}`}
            onClick={() => setActiveLayer('pangan')}
          >
            <Utensils size={14} /> Ketahanan Pangan
          </button>
          <button
            className={`layer-btn ${activeLayer === 'air' ? 'active' : ''}`}
            onClick={() => setActiveLayer('air')}
          >
            <Droplets size={14} /> Air Bersih
          </button>
          <button
            className={`layer-btn ${activeLayer === 'stunting' ? 'active' : ''}`}
            onClick={() => setActiveLayer('stunting')}
          >
            <HeartPulse size={14} /> Prevalensi Stunting
          </button>
          <button
            className={`layer-btn ${activeLayer === 'faskes' ? 'active' : ''}`}
            onClick={() => setActiveLayer('faskes')}
          >
            <Building2 size={14} /> Faskes & Pasar
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="map-zoom-tools">
        <button onClick={handleZoomIn} title="Zoom Dalam">
          <ZoomIn size={18} />
        </button>
        <button onClick={handleZoomOut} title="Zoom Luar">
          <ZoomOut size={18} />
        </button>
        <button onClick={handleResetView} title="Reset Posisi Kota Bogor">
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="map-legend-card">
        <span className="legend-head">Legenda Peta Kota Bogor</span>
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
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#06b6d4' }} /> Akses Layak &gt;90%</div>
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#3b82f6' }} /> Akses Cukup 85-90%</div>
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#f59e0b' }} /> Akses Minim &lt;85%</div>
          </div>
        )}
        {activeLayer === 'stunting' && (
          <div className="legend-items">
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#10b981' }} /> Stunting Low &lt;10%</div>
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#f59e0b' }} /> Stunting Mod 10-15%</div>
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#ef4444' }} /> Stunting High &gt;15%</div>
          </div>
        )}
        {activeLayer === 'faskes' && (
          <div className="legend-items">
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#8b5cf6' }} /> Faskes Lengkap &gt;10</div>
            <div className="legend-row"><span className="legend-color-dot" style={{ backgroundColor: '#ec4899' }} /> Faskes Terbatas ≤10</div>
          </div>
        )}
      </div>

      {/* Coordinate Indicator */}
      <div className="map-coord-bar">
        <span>Kota Bogor, Jawa Barat</span>
        <code>-6.5971° S, 106.7949° E</code>
      </div>
    </div>
  );
}
