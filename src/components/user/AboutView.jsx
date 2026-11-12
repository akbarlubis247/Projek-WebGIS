import React, { useState, useEffect } from 'react';
import { Layers, MapPin, Mail, Phone, CheckCircle2, ExternalLink, Clock, Building2 } from 'lucide-react';
import { getPublicContent } from '../../data/defaultPublicContent';

export default function AboutView() {
  const [content, setContent] = useState(getPublicContent());

  useEffect(() => {
    const handleContentUpdate = () => {
      setContent(getPublicContent());
    };
    window.addEventListener('nutrimap_content_updated', handleContentUpdate);
    return () => window.removeEventListener('nutrimap_content_updated', handleContentUpdate);
  }, []);

  const about = content.aboutSection || {};

  return (
    <div className="about-view-container animate-fade-in">
      <div className="about-grid">
        <div className="dash-card about-card">
          <div className="brand-badge-large">
            <Layers size={36} className="text-emerald" />
            <div>
              <h2 className="page-title-editorial">{about.title || 'Tentang NutriMap Kota Bogor'}</h2>
              <p>{about.subtitle || 'Platform SIG Spasial Kota Bogor, Jawa Barat'}</p>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.68, margin: '16px 0' }}>
            {about.description}
          </p>

          <h3 className="section-title-editorial">Sasaran &amp; Cakupan Platform NutriMap:</h3>
          <ul className="about-list">
            {(about.objectives || []).map((obj, idx) => (
              <li key={idx}>
                <CheckCircle2 size={18} className="text-emerald" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>

          <div className="about-partners">
            <h4>Sumber Data:</h4>
            <div className="partner-tags">
              <a
                href={about.sourceLinkUrl || 'https://satupeta.kotabogor.go.id/maps'}
                target="_blank"
                rel="noreferrer"
                className="sumber-data-link"
              >
                <ExternalLink size={14} />
                <span>{about.sourceLinkTitle || 'Peta | Satu Peta Kota Bogor'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="dash-card contact-card">
          <h3 className="section-title-editorial">Kontak &amp; Informasi Layanan SIG</h3>
          <div className="contact-item">
            <Building2 size={20} className="text-emerald" />
            <div>
              <b>Alamat Kantor Balai Kota:</b>
              <p>{about.address || 'Gedung Balai Kota Bogor, Jl. Ir. H. Juanda No. 10, Kota Bogor, Jawa Barat 16121'}</p>
            </div>
          </div>

          <div className="contact-item">
            <Mail size={20} className="text-cyan" />
            <div>
              <b>Email Portal SIG:</b>
              <p>{about.email || 'bappeda@kotabogor.go.id / dkp@kotabogor.go.id'}</p>
            </div>
          </div>

          <div className="contact-item">
            <Phone size={20} className="text-emerald" />
            <div>
              <b>Nomor Telepon / Hotline:</b>
              <p>{about.phone || '(0251) 8321075 / Call Center 112 Kota Bogor'}</p>
            </div>
          </div>

          <div className="contact-item">
            <Clock size={20} className="text-cyan" />
            <div>
              <b>Jam Pelayanan Kantor:</b>
              <p>{about.officeHours || 'Senin - Jumat: 08.00 - 16.00 WIB'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
