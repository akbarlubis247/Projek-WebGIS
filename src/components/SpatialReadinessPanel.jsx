import React from 'react';
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Database,
  Droplets,
  MapPinned,
  ShieldCheck,
  Sprout,
  Store,
  TriangleAlert
} from 'lucide-react';
import {
  DATA_GOVERNANCE_CHECKLIST,
  MAP_PRESENTATION_NOTICE,
  SPATIAL_LAYER_CATALOG
} from '../data/spatialLayers';
import './SpatialReadinessPanel.css';

const layerIcons = {
  administrasi: MapPinned,
  indikator: Database,
  pasar: Store,
  air: Droplets,
  kebun: Sprout
};

const statusIcons = {
  ready: CheckCircle2,
  prototype: CircleDashed,
  pending: CalendarClock,
  research: CircleDashed
};

export default function SpatialReadinessPanel() {
  return (
    <section className="spatial-readiness" aria-labelledby="spatial-readiness-title">
      <div className="spatial-readiness-intro">
        <div className="spatial-readiness-kicker">
          <ShieldCheck size={15} /> Tata kelola data spasial
        </div>
        <h2 id="spatial-readiness-title">Peta yang kaya perlu bukti yang jelas.</h2>
        <p>
          Tampilan ini memisahkan data yang sudah dapat ditampilkan dari layer yang masih
          menunggu verifikasi. Dengan begitu, desain tetap informatif tanpa mengklaim kondisi
          lapangan yang belum dibuktikan.
        </p>
      </div>

      <div className="spatial-notice" role="note">
        <TriangleAlert size={18} />
        <div>
          <strong>{MAP_PRESENTATION_NOTICE.title}</strong>
          <span>{MAP_PRESENTATION_NOTICE.description}</span>
        </div>
        <time>{MAP_PRESENTATION_NOTICE.updatedAt}</time>
      </div>

      <div className="spatial-layer-grid">
        {SPATIAL_LAYER_CATALOG.map((layer) => {
          const LayerIcon = layerIcons[layer.id] || Building2;
          const StatusIcon = statusIcons[layer.status] || CircleDashed;

          return (
            <article className={`spatial-layer-card is-${layer.status}`} key={layer.id}>
              <div className="spatial-layer-icon"><LayerIcon size={19} /></div>
              <div className="spatial-layer-content">
                <div className="spatial-layer-topline">
                  <span>{layer.category}</span>
                  <small className={`spatial-status status-${layer.status}`}>
                    <StatusIcon size={12} /> {layer.statusLabel}
                  </small>
                </div>
                <h3>{layer.label}</h3>
                <p>{layer.description}</p>
                <dl>
                  <div><dt>Cakupan</dt><dd>{layer.coverage}</dd></div>
                  <div><dt>Periode</dt><dd>{layer.period}</dd></div>
                  <div><dt>Sumber</dt><dd>{layer.source}</dd></div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>

      <div className="spatial-checklist">
        <div>
          <span className="spatial-readiness-kicker"><ShieldCheck size={15} /> Sebelum layer dipublikasikan</span>
          <h3>Daftar verifikasi singkat</h3>
        </div>
        <ul>
          {DATA_GOVERNANCE_CHECKLIST.map((item) => (
            <li key={item}><CheckCircle2 size={16} /> {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
