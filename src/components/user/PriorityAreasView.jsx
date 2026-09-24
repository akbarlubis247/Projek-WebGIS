import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Sliders,
  RotateCcw,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Info
} from 'lucide-react';
import { KELURAHAN_68_BOGOR, calculateSAW } from '../../data/bogorKelurahanData';

export default function PriorityAreasView({ onSelectKecamatan, onNavigate }) {
  // 1. Bobot Kriteria SAW (Default sesuai PRD WBS 1.4.3.2)
  // Stunting 40%, Kemiskinan 25%, Kerentanan Pangan 20%, Air Bersih 15%
  const [weights, setWeights] = useState({
    stunting: 40,
    kemiskinan: 25,
    kerentananPangan: 20,
    airBersih: 15
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterZona, setFilterZona] = useState('ALL');
  const [selectedKelurahan, setSelectedKelurahan] = useState(null);

  // Total Bobot
  const totalWeight = weights.stunting + weights.kemiskinan + weights.kerentananPangan + weights.airBersih;
  const isWeightValid = totalWeight === 100;

  // Hitung Algoritma SAW secara reaktif
  const sawResults = useMemo(() => {
    return calculateSAW(KELURAHAN_68_BOGOR, weights);
  }, [weights]);

  // Statistik Zona
  const zonaMerahCount = sawResults.filter(r => r.zonaClass === 'red').length;
  const zonaKuningCount = sawResults.filter(r => r.zonaClass === 'yellow').length;
  const zonaHijauCount = sawResults.filter(r => r.zonaClass === 'green').length;

  // Filter Hasil
  const filteredResults = useMemo(() => {
    return sawResults.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZona = filterZona === 'ALL' || item.zonaClass === filterZona;
      return matchSearch && matchZona;
    });
  }, [sawResults, searchTerm, filterZona]);

  // Handle Reset Bobot
  const handleResetWeights = () => {
    setWeights({
      stunting: 40,
      kemiskinan: 25,
      kerentananPangan: 20,
      airBersih: 15
    });
  };

  // Unduh CSV Hasil SAW
  const handleExportCSV = () => {
    const headers = ['Peringkat', 'ID', 'Kelurahan', 'Kecamatan', 'Stunting (%)', 'Kemiskinan (%)', 'Kerentanan Pangan', 'Air Bersih (%)', 'Skor Preferensi (Vi)', 'Zona Prioritas'];
    const rows = sawResults.map(r => [
      r.rank,
      r.id,
      r.nama,
      r.kecamatan,
      r.stunting,
      r.kemiskinan,
      r.kerentananPangan,
      r.airBersih,
      r.skorPreferensi,
      r.zona
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Peringkat_Prioritas_SAW_Kota_Bogor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Sistem Rekomendasi Prioritas Intervensi (Algoritma SAW)
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Pemeringkatan 68 Kelurahan Kota Bogor berdasarkan kombinasi kriteria <em>Benefit</em> (Stunting, Kemiskinan, Kerentanan Pangan) dan <em>Cost</em> (Akses Air Bersih).
          </p>
        </div>
        <div className="export-action-group" style={{ display: 'flex', gap: 10 }}>
          <button className="btn-export-excel" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            <FileSpreadsheet size={16} /> Unduh CSV Hasil SAW
          </button>
        </div>
      </div>

      {/* Ringkasan Zona Prioritas */}
      <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
        <div className="stat-card rose" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #fecdd3', borderLeft: '6px solid #e11d48' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#ffe4e6', color: '#e11d48', padding: 10, borderRadius: 8 }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <span style={{ fontSize: 13, color: '#e11d48', fontWeight: 600 }}>ZONA MERAH (Prioritas 1)</span>
              <h3 style={{ fontSize: 24, margin: '4px 0 0', fontWeight: 700, color: '#0f172a' }}>{zonaMerahCount} Kelurahan</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>Intervensi Bansos & Penanganan Stunting Segera</span>
            </div>
          </div>
        </div>

        <div className="stat-card amber" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #fed7aa', borderLeft: '6px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: 10, borderRadius: 8 }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>ZONA KUNING (Prioritas 2)</span>
              <h3 style={{ fontSize: 24, margin: '4px 0 0', fontWeight: 700, color: '#0f172a' }}>{zonaKuningCount} Kelurahan</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>Perhatian Khusus & Pengawasan Sanitasi</span>
            </div>
          </div>
        </div>

        <div className="stat-card cyan" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #bbf7d0', borderLeft: '6px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#dcfce7', color: '#16a34a', padding: 10, borderRadius: 8 }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>ZONA HIJAU (Terkendali)</span>
              <h3 style={{ fontSize: 24, margin: '4px 0 0', fontWeight: 700, color: '#0f172a' }}>{zonaHijauCount} Kelurahan</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>Pemeliharaan Ketahanan Pangan Mandiri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrol Penyesuaian Bobot Kriteria SAW */}
      <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              Simulasi Penyesuaian Bobot Kriteria SAW (Total Wajib 100%)
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
              background: isWeightValid ? '#dcfce7' : '#fee2e2',
              color: isWeightValid ? '#15803d' : '#b91c1c'
            }}>
              Total: {totalWeight}% {isWeightValid ? '✓ Valid' : '✗ Tidak 100%'}
            </span>
            <button
              onClick={handleResetWeights}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <RotateCcw size={14} /> Reset Default
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {/* Bobot Stunting */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Prevalensi Stunting (C1)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e11d48' }}>{weights.stunting}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.stunting}
              onChange={(e) => setWeights({ ...weights, stunting: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#e11d48' }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>Sifat: Benefit (Maksimal)</span>
          </div>

          {/* Bobot Kemiskinan */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Kemiskinan / DTKS (C2)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#d97706' }}>{weights.kemiskinan}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.kemiskinan}
              onChange={(e) => setWeights({ ...weights, kemiskinan: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#d97706' }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>Sifat: Benefit (Maksimal)</span>
          </div>

          {/* Bobot Kerentanan Pangan */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Kerentanan Pangan (C3)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{weights.kerentananPangan}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.kerentananPangan}
              onChange={(e) => setWeights({ ...weights, kerentananPangan: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>Sifat: Benefit (Maksimal)</span>
          </div>

          {/* Bobot Akses Air Bersih */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Sanitasi Air Bersih (C4)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{weights.airBersih}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.airBersih}
              onChange={(e) => setWeights({ ...weights, airBersih: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#059669' }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>Sifat: Cost (Minimal)</span>
          </div>
        </div>
      </div>

      {/* Tabel Pemeringkatan 68 Kelurahan SAW */}
      <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Filter bar dalam tabel */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Cari kelurahan / kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <select
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }}
            >
              <option value="ALL">Semua Zona ({sawResults.length})</option>
              <option value="red">Zona Merah / Prioritas 1 ({zonaMerahCount})</option>
              <option value="yellow">Zona Kuning / Prioritas 2 ({zonaKuningCount})</option>
              <option value="green">Zona Hijau / Aman ({zonaHijauCount})</option>
            </select>
          </div>

          <span style={{ fontSize: 13, color: '#64748b' }}>
            Menampilkan <strong>{filteredResults.length}</strong> dari 68 kelurahan
          </span>
        </div>

        {/* Tabel Data */}
        <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Rank</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kelurahan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kecamatan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Stunting</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kemiskinan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kerentanan Pangan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Air Bersih</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0369a1' }}>Skor SAW (Vi)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Status Prioritas</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Aksi Peta</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: selectedKelurahan?.id === item.id ? '#f0f9ff' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    <span style={{
                      display: 'inline-block',
                      width: 28,
                      height: 28,
                      lineHeight: '28px',
                      textAlign: 'center',
                      borderRadius: 14,
                      background: item.rank <= 5 ? '#e11d48' : (item.rank <= 17 ? '#fed7aa' : '#f1f5f9'),
                      color: item.rank <= 5 ? '#fff' : '#1e293b',
                      fontSize: 12
                    }}>
                      #{item.rank}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{item.nama}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.kecamatan}</td>
                  <td style={{ padding: '12px 16px', color: '#e11d48', fontWeight: 600 }}>{item.stunting}%</td>
                  <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: 600 }}>{item.kemiskinan}%</td>
                  <td style={{ padding: '12px 16px', color: '#2563eb' }}>{item.kerentananPangan}</td>
                  <td style={{ padding: '12px 16px', color: '#059669' }}>{item.airBersih}%</td>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0284c7', fontSize: 14 }}>
                    {item.skorPreferensi.toFixed(4)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: item.zonaClass === 'red' ? '#ffe4e6' : (item.zonaClass === 'yellow' ? '#fef3c7' : '#dcfce7'),
                      color: item.zonaClass === 'red' ? '#e11d48' : (item.zonaClass === 'yellow' ? '#b45309' : '#15803d')
                    }}>
                      {item.zona}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedKelurahan(item);
                        if (onSelectKecamatan) onSelectKecamatan(item);
                        if (onNavigate) onNavigate('map-explorer');
                      }}
                      style={{
                        padding: '6px 10px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <MapPin size={13} /> Sorot di Peta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
