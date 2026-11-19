import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  FileSpreadsheet,
  Sliders,
  RotateCcw,
  Search,
  MapPin,
  Info,
  Cpu,
  Calculator,
  Layers,
  RefreshCw,
  Check
} from 'lucide-react';
import { useNutriMapData, useSawRankings } from '../../hooks/useNutriMapData';

export default function PriorityAreasView({ onSelectKecamatan, onNavigate }) {
  const { kelurahanList } = useNutriMapData();

  // Mode Perhitungan: Default 'system' (Otomatis oleh Sistem) atau 'custom' (Simulasi Kustom)
  const [calculationMode, setCalculationMode] = useState('system'); // 'system' | 'custom'
  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'matrix_r' | 'matrix_x'
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastCalculatedTime, setLastCalculatedTime] = useState(() => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Bobot Standar Resmi Baku Sistem (sesuai Kebijakan Bappeda / PRD SPK)
  const SYSTEM_DEFAULT_WEIGHTS = {
    stunting: 40,
    kemiskinan: 25,
    kerentananPangan: 20,
    airBersih: 15
  };

  const [weights, setWeights] = useState(SYSTEM_DEFAULT_WEIGHTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZona, setFilterZona] = useState('ALL');
  const [selectedKelurahan, setSelectedKelurahan] = useState(null);

  // Hitung pemeringkatan SAW otomatis oleh sistem
  const activeWeights = calculationMode === 'system' ? SYSTEM_DEFAULT_WEIGHTS : weights;
  const { sawResults, isLive: isSawLive, totalWeight, isWeightValid } = useSawRankings(activeWeights, kelurahanList);

  // Nilai Ekstrem (Max / Min) yang dideteksi otomatis oleh sistem
  const extremes = useMemo(() => {
    if (!sawResults || sawResults.length === 0) {
      return { maxStunting: 18.0, maxKemiskinan: 8.5, maxPangan: 46.0, minAir: 82.0 };
    }
    return {
      maxStunting: Math.max(...sawResults.map(d => parseFloat(d.stunting) || 0)),
      maxKemiskinan: Math.max(...sawResults.map(d => parseFloat(d.kemiskinan) || 0)),
      maxPangan: Math.max(...sawResults.map(d => parseFloat(d.kerentananPangan) || 0)),
      minAir: Math.min(...sawResults.map(d => parseFloat(d.airBersih) || 100))
    };
  }, [sawResults]);

  // Statistik Zona
  const zonaMerahCount = sawResults.filter(r => r.zonaClass === 'red').length;
  const zonaKuningCount = sawResults.filter(r => r.zonaClass === 'yellow').length;
  const zonaHijauCount = sawResults.filter(r => r.zonaClass === 'green').length;

  // Filter Hasil Pencarian & Zona
  const filteredResults = useMemo(() => {
    return sawResults.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZona = filterZona === 'ALL' || item.zonaClass === filterZona;
      return matchSearch && matchZona;
    });
  }, [sawResults, searchTerm, filterZona]);

  // Trigger Hitung Ulang Otomatis oleh Sistem
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setLastCalculatedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 450);
  };

  // Reset ke bobot sistem
  const handleResetToSystem = () => {
    setWeights(SYSTEM_DEFAULT_WEIGHTS);
    setCalculationMode('system');
    handleRecalculate();
  };

  // Unduh CSV Hasil SAW (mencakup data mentah, normalisasi R, dan skor Vi)
  const handleExportCSV = () => {
    const headers = [
      'Peringkat', 'ID', 'Kelurahan', 'Kecamatan',
      'Stunting_X1(%)', 'Kemiskinan_X2(%)', 'Pangan_X3', 'AirBersih_X4(%)',
      'R_Stunting', 'R_Kemiskinan', 'R_Pangan', 'R_Air',
      'Skor_Preferensi(Vi)', 'Zona_Prioritas'
    ];
    const rows = sawResults.map(r => [
      r.rank,
      r.id,
      r.nama,
      r.kecamatan,
      r.stunting,
      r.kemiskinan,
      r.kerentananPangan,
      r.airBersih,
      r.rStunting ?? (r.stunting / extremes.maxStunting).toFixed(3),
      r.rKemiskinan ?? (r.kemiskinan / extremes.maxKemiskinan).toFixed(3),
      r.rPangan ?? (r.kerentananPangan / extremes.maxPangan).toFixed(3),
      r.rAir ?? (extremes.minAir / r.airBersih).toFixed(3),
      r.skorPreferensi,
      r.zona
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hasil_Kalkulasi_Otomatis_SAW_Bogor_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header Utama */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-title-editorial" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Sistem Rekomendasi Prioritas Intervensi (Algoritma SAW)
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Pemeringkatan 68 Kelurahan Kota Bogor dihitung secara otomatis oleh sistem menggunakan metode <em>Simple Additive Weighting</em> (SAW).
          </p>
        </div>
        <div className="export-action-group" style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn-export-excel"
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(5,150,105,0.25)'
            }}
          >
            <FileSpreadsheet size={16} /> Unduh CSV Hasil SAW
          </button>
        </div>
      </div>

      {/* Ringkasan Zona Prioritas */}
      <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 20 }}>
        <div className="stat-card rose" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #fecdd3', borderLeft: '6px solid #e11d48', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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

        <div className="stat-card amber" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #fed7aa', borderLeft: '6px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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

        <div className="stat-card cyan" style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #bbf7d0', borderLeft: '6px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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

      {/* PANEL PERHITUNGAN OTOMATIS SISTEM */}
      <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Status Perhitungan Sistem */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  Kalkulasi SAW Otomatis oleh Sistem
                </h3>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                  Sistem Otomatis Aktif
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#64748b' }}>
                Algoritma berjalan otomatis memproses {sawResults.length} kelurahan. Terakhir dikalkulasi: <strong>{lastCalculatedTime} WIB</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={isRecalculating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={isRecalculating ? 'animate-spin' : ''} />
              {isRecalculating ? 'Menghitung...' : 'Hitung Ulang Sistem'}
            </button>

            <button
              type="button"
              onClick={() => setCalculationMode(calculationMode === 'system' ? 'custom' : 'system')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                background: calculationMode === 'custom' ? '#e0f2fe' : '#ffffff',
                border: `1px solid ${calculationMode === 'custom' ? '#0284c7' : '#cbd5e1'}`,
                color: calculationMode === 'custom' ? '#0369a1' : '#64748b',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Sliders size={13} />
              {calculationMode === 'custom' ? 'Tutup Simulasi Bobot' : 'Simulasi Bobot Kustom'}
            </button>
          </div>
        </div>

        {/* 4 Kartu Parameter Bobot Resmi Baku Sistem */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {calculationMode === 'system' ? 'Bobot Kriteria Standar Baku Sistem (100%)' : 'Pengaturan Bobot Kustom (Simulasi Manual)'}
            </span>
            {calculationMode === 'custom' && (
              <button
                type="button"
                onClick={handleResetToSystem}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw size={12} /> Kembalikan ke Standar Baku Sistem
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {/* C1: Stunting */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', borderTop: '3px solid #e11d48' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>C1: Stunting</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#e11d48' }}>{activeWeights.stunting}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>Sifat: <strong>Benefit</strong> (Max)</span>
                <span>Max: <strong>{extremes.maxStunting}%</strong></span>
              </div>
              {calculationMode === 'custom' && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.stunting}
                  onChange={(e) => setWeights({ ...weights, stunting: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#e11d48', marginTop: 8 }}
                />
              )}
            </div>

            {/* C2: Kemiskinan */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', borderTop: '3px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>C2: Kemiskinan / DTKS</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#d97706' }}>{activeWeights.kemiskinan}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>Sifat: <strong>Benefit</strong> (Max)</span>
                <span>Max: <strong>{extremes.maxKemiskinan}%</strong></span>
              </div>
              {calculationMode === 'custom' && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.kemiskinan}
                  onChange={(e) => setWeights({ ...weights, kemiskinan: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#d97706', marginTop: 8 }}
                />
              )}
            </div>

            {/* C3: Kerentanan Pangan */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', borderTop: '3px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>C3: Kerentanan Pangan</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>{activeWeights.kerentananPangan}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>Sifat: <strong>Benefit</strong> (Max)</span>
                <span>Max: <strong>{extremes.maxPangan}</strong></span>
              </div>
              {calculationMode === 'custom' && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.kerentananPangan}
                  onChange={(e) => setWeights({ ...weights, kerentananPangan: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#2563eb', marginTop: 8 }}
                />
              )}
            </div>

            {/* C4: Sanitasi Air Bersih */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', borderTop: '3px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>C4: Sanitasi Air Bersih</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>{activeWeights.airBersih}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>Sifat: <strong>Cost</strong> (Min)</span>
                <span>Min: <strong>{extremes.minAir}%</strong></span>
              </div>
              {calculationMode === 'custom' && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.airBersih}
                  onChange={(e) => setWeights({ ...weights, airBersih: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#059669', marginTop: 8 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABEL HASIL PERHITUNGAN SISTEM DENGAN TAB STEP-BY-STEP */}
      <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Tab Switcher: Bukti Transparansi Rumus SAW Sistem */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#fafbfc', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab('ranking')}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'ranking' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: activeTab === 'ranking' ? '#e0f2fe' : '#ffffff',
                color: activeTab === 'ranking' ? '#0369a1' : '#475569'
              }}
            >
              🏆 Hasil Rekomendasi &amp; Ranking (Vi)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix_r')}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'matrix_r' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: activeTab === 'matrix_r' ? '#e0f2fe' : '#ffffff',
                color: activeTab === 'matrix_r' ? '#0369a1' : '#475569'
              }}
            >
              📊 Matriks Normalisasi (R)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix_x')}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'matrix_x' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: activeTab === 'matrix_x' ? '#e0f2fe' : '#ffffff',
                color: activeTab === 'matrix_x' ? '#0369a1' : '#475569'
              }}
            >
              📋 Matriks Keputusan Asal (X)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Cari kelurahan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '6px 10px 6px 32px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
            </div>

            <select
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: '#fff' }}
            >
              <option value="ALL">Semua Zona ({sawResults.length})</option>
              <option value="red">Zona Merah ({zonaMerahCount})</option>
              <option value="yellow">Zona Kuning ({zonaKuningCount})</option>
              <option value="green">Zona Hijau ({zonaHijauCount})</option>
            </select>
          </div>
        </div>

        {/* Info Penjelasan Tab Aktif */}
        <div style={{ padding: '8px 20px', background: '#f0f9ff', borderBottom: '1px solid #e0f2fe', fontSize: 12, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={14} />
          {activeTab === 'ranking' && (
            <span>Menampilkan skor preferensi akhir <strong>V<sub>i</sub> = Σ (w<sub>j</sub> × r<sub>ij</sub>)</strong> dan pembagian zona prioritas penanganan.</span>
          )}
          {activeTab === 'matrix_r' && (
            <span>Matriks Ternormalisasi R dihitung otomatis: Benefit <strong>r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>j</sub>)</strong> dan Cost <strong>r<sub>ij</sub> = min(x<sub>j</sub>) / x<sub>ij</sub></strong>.</span>
          )}
          {activeTab === 'matrix_x' && (
            <span>Data matriks keputusan asli (X) yang diekstrak langsung dari dataset 68 kelurahan Kota Bogor.</span>
          )}
        </div>

        {/* Tabel Data Sesuai Tab yang Dipilih */}
        <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
              {activeTab === 'ranking' && (
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Rank</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kelurahan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kecamatan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Stunting</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kemiskinan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kerentanan Pangan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Air Bersih</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0369a1' }}>Skor SAW (Vi)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Status Prioritas</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Aksi Peta</th>
                </tr>
              )}

              {activeTab === 'matrix_r' && (
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Rank</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kelurahan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kecamatan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#e11d48' }}>r₁ (Stunting)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#d97706' }}>r₂ (Kemiskinan)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb' }}>r₃ (Pangan)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>r₄ (Air Bersih)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: '#0369a1' }}>Skor Vi</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Zona</th>
                </tr>
              )}

              {activeTab === 'matrix_x' && (
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>No</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>ID Kelurahan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kelurahan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Kecamatan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>X₁: Stunting (%)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>X₂: Kemiskinan (%)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>X₃: Kerentanan Pangan</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>X₄: Air Bersih (%)</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredResults.map((item, idx) => {
                const rStuntingVal = item.rStunting ?? Number((item.stunting / extremes.maxStunting).toFixed(3));
                const rKemiskinanVal = item.rKemiskinan ?? Number((item.kemiskinan / extremes.maxKemiskinan).toFixed(3));
                const rPanganVal = item.rPangan ?? Number((item.kerentananPangan / extremes.maxPangan).toFixed(3));
                const rAirVal = item.rAir ?? Number((extremes.minAir / item.airBersih).toFixed(3));

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: selectedKelurahan?.id === item.id ? '#f0f9ff' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                  >
                    {activeTab === 'ranking' && (
                      <>
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
                            type="button"
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
                      </>
                    )}

                    {activeTab === 'matrix_r' && (
                      <>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#64748b' }}>#{item.rank}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{item.nama}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.kecamatan}</td>
                        <td style={{ padding: '12px 16px', color: '#e11d48', fontWeight: 600, fontFamily: 'monospace' }}>{rStuntingVal.toFixed(3)}</td>
                        <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: 600, fontFamily: 'monospace' }}>{rKemiskinanVal.toFixed(3)}</td>
                        <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 600, fontFamily: 'monospace' }}>{rPanganVal.toFixed(3)}</td>
                        <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600, fontFamily: 'monospace' }}>{rAirVal.toFixed(3)}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0284c7', fontSize: 13.5 }}>{item.skorPreferensi.toFixed(4)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background: item.zonaClass === 'red' ? '#ffe4e6' : (item.zonaClass === 'yellow' ? '#fef3c7' : '#dcfce7'),
                            color: item.zonaClass === 'red' ? '#e11d48' : (item.zonaClass === 'yellow' ? '#b45309' : '#15803d')
                          }}>
                            {item.zonaClass.toUpperCase()}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'matrix_x' && (
                      <>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>{item.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{item.nama}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.kecamatan}</td>
                        <td style={{ padding: '12px 16px', color: '#e11d48', fontWeight: 600 }}>{item.stunting}%</td>
                        <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: 600 }}>{item.kemiskinan}%</td>
                        <td style={{ padding: '12px 16px', color: '#2563eb' }}>{item.kerentananPangan}</td>
                        <td style={{ padding: '12px 16px', color: '#059669' }}>{item.airBersih}%</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
