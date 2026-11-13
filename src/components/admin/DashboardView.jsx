import React, { useState, useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import {
  Utensils,
  Droplets,
  HeartPulse,
  AlertOctagon,
  ChevronRight,
  MapPin,
  FileEdit,
  Camera,
  ShieldCheck,
  UserCheck,
  Users,
  FilePlus,
  Calculator,
  Activity,
  Key,
  X,
  CheckCircle2,
  Database
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import MapView from '../common/MapView';
import { MONTHLY_TREND } from '../../data/bogorData';
import { useNutriMapData } from '../../hooks/useNutriMapData';
import { changePasswordApi, fetchAdminOverviewApi } from '../../services/api';

export default function DashboardView({ currentUser, onNavigate, onSelectKecamatan }) {
  const { kecamatanList, kelurahanList, facilitiesGeoJson } = useNutriMapData();
  const [selectedKec, setSelectedKec] = useState(() => kecamatanList[0]);
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Ubah Password modal state
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    if (!kecamatanList.length) return;
    setSelectedKec((prev) => kecamatanList.find((k) => k.id === prev?.id) || kecamatanList[0]);
  }, [kecamatanList]);

  useEffect(() => {
    const controller = new AbortController();
    setOverviewLoading(true);
    fetchAdminOverviewApi({ signal: controller.signal })
      .then((res) => {
        setOverview(res?.data || null);
      })
      .catch(() => {
        // Abaikan jika request dibatalkan
      })
      .finally(() => {
        setOverviewLoading(false);
      });
    return () => controller.abort();
  }, [currentUser?.role]);

  // Live computed metrics from 68 kelurahan / 6 kecamatan
  const totalKelurahan = kelurahanList.length || 68;
  const avgIkp = kelurahanList.length
    ? Number((kelurahanList.reduce((s, k) => s + (100 - Number(k.kerentananPangan || 0)), 0) / kelurahanList.length).toFixed(1))
    : 70.8;
  const avgAir = kelurahanList.length
    ? Number((kelurahanList.reduce((s, k) => s + Number(k.airBersih || 0), 0) / kelurahanList.length).toFixed(1))
    : 55.7;
  const avgStunting = kelurahanList.length
    ? Number((kelurahanList.reduce((s, k) => s + Number(k.stunting || 0), 0) / kelurahanList.length).toFixed(2))
    : 3.19;

  const highRiskCount = kecamatanList.filter((k) => k.prioritas === 'Tinggi' || k.prioritas === 'Sedang').length;
  const safeCount = kecamatanList.filter((k) => k.panganStatus === 'Sangat Aman' || k.panganStatus === 'Aman').length;
  const totalFacilities = facilitiesGeoJson?.features?.length ?? overview?.facilities_count ?? 18;

  // CountUp Refs for Dashboard KPIs
  const heroIkpRef = useRef(null);
  const heroStuntingRef = useRef(null);
  const safeCountRef = useRef(null);
  const waterRef = useRef(null);
  const stuntingRef = useRef(null);
  const riskRef = useRef(null);

  // Per-kecamatan side panel refs
  const pmPendudukRef = useRef(null);
  const pmIkpRef = useRef(null);
  const pmAirRef = useRef(null);
  const pmStuntingRef = useRef(null);
  const pmFaskesRef = useRef(null);

  useEffect(() => {
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 0.9, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(heroIkpRef, avgIkp, { decimalPlaces: 1 });
    anim(heroStuntingRef, avgStunting, { decimalPlaces: 2, suffix: '%' });
    anim(safeCountRef, safeCount);
    anim(waterRef, avgAir, { decimalPlaces: 1, suffix: '%' });
    anim(stuntingRef, avgStunting, { decimalPlaces: 2, suffix: '%' });
    anim(riskRef, highRiskCount);
  }, [avgIkp, avgAir, avgStunting, safeCount, highRiskCount]);

  useEffect(() => {
    if (!selectedKec) return;
    const anim = (ref, val, opts = {}) => {
      if (!ref.current) return;
      const cu = new CountUp(ref.current, val, { startVal: 0, duration: 0.8, useEasing: true, ...opts });
      if (!cu.error) cu.start();
    };

    anim(pmPendudukRef, selectedKec.penduduk, { formattingFn: (n) => Math.round(n).toLocaleString('id-ID') + ' jiwa' });
    anim(pmIkpRef, selectedKec.panganSkor, { decimalPlaces: 1 });
    anim(pmAirRef, selectedKec.airBersih, { decimalPlaces: 1, suffix: '%' });
    anim(pmStuntingRef, selectedKec.stunting, { decimalPlaces: 2, suffix: '%' });
    anim(pmFaskesRef, selectedKec.faskes, { suffix: ' Puskesmas/Klinik' });
  }, [selectedKec]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    setIsChangingPwd(true);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword });
      setPwdSuccess(res?.message || 'Kata sandi berhasil diperbarui.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdError(err.message || 'Gagal memperbarui kata sandi');
    } finally {
      setIsChangingPwd(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Role-Adapted Hero Banner */}
      <div
        className="dash-hero"
        style={
          isSuperAdmin
            ? { background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid rgba(129, 140, 248, 0.25)' }
            : undefined
        }
      >
        <div className="hero-content">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: 10,
              background: isSuperAdmin ? 'rgba(129, 140, 248, 0.22)' : 'rgba(16, 185, 129, 0.2)',
              color: isSuperAdmin ? '#c7d2fe' : '#a7f3d0',
              border: isSuperAdmin ? '1px solid rgba(165, 180, 252, 0.35)' : '1px solid rgba(52, 211, 153, 0.35)',
            }}
          >
            {isSuperAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
            {isSuperAdmin
              ? 'SUPER ADMIN • KONTROL AKUN, AUDIT TRAIL & TATA KELOLA SISTEM'
              : 'STAFF ADMIN • OPERASIONAL DATA SPASIAL & ANALISIS SAW'}
          </div>

          <h1 className="page-title-editorial">
            {isSuperAdmin ? 'Dashboard Eksekutif Super Admin' : 'Dashboard Operasional SIG NutriMap'}
          </h1>
          <p>
            Selamat datang, <strong>{currentUser?.name || 'Pengelola'}</strong> ({currentUser?.agency || 'Pemerintah Kota Bogor'} • <code>{currentUser?.email}</code>).
            {isSuperAdmin
              ? ' Anda memiliki kendali penuh atas manajemen akun Supabase, audit sistem, validasi data CSV, serta publikasi konten.'
              : ' Kelola unggahan CSV 68 kelurahan, pembaruan indikator manual, perhitungan prioritas SAW, dan inspeksi lapangan.'}
          </p>

          <div className="hero-actions" style={{ flexWrap: 'wrap' }}>
            {isSuperAdmin ? (
              <>
                <button type="button" className="primary-btn" onClick={() => onNavigate('superadmin-mgmt')}>
                  <Users size={18} /> Kelola Akun &amp; Audit Log
                </button>
                <button type="button" className="outline-btn" onClick={() => onNavigate('data-entry')}>
                  <FilePlus size={18} /> Review Upload ({overview?.uploads_summary?.pending ?? 0} Pending)
                </button>
                <button type="button" className="outline-btn" onClick={() => onNavigate('content-mgmt')}>
                  <FileEdit size={18} /> Editor CMS
                </button>
              </>
            ) : (
              <>
                <button type="button" className="primary-btn" onClick={() => onNavigate('data-entry')}>
                  <FilePlus size={18} /> Input Data / Upload CSV
                </button>
                <button type="button" className="outline-btn" onClick={() => onNavigate('priority-areas')}>
                  <Calculator size={18} /> Analisis Prioritas SAW
                </button>
                <button type="button" className="outline-btn" onClick={() => onNavigate('map-explorer')}>
                  <MapPin size={18} /> Peta Interaktif
                </button>
              </>
            )}

            <button
              type="button"
              className="outline-btn"
              onClick={() => {
                setPwdError('');
                setPwdSuccess('');
                setShowPwdModal(true);
              }}
            >
              <Key size={16} /> Ubah Password Akun
            </button>
          </div>
        </div>

        <div className="hero-stats-mini">
          <div className="h-stat-card">
            <span>Skor Ketahanan (100 - KP)</span>
            <strong><span ref={heroIkpRef}>{avgIkp}</span> / 100</strong>
            <small className="good">Rata-rata live {totalKelurahan} kelurahan</small>
          </div>
          <div className="h-stat-card">
            <span>Rata-rata Stunting Kota</span>
            <strong ref={heroStuntingRef}>{avgStunting}%</strong>
            <small className="good">Sumber: {overview?.data_source || 'postgis'} • {totalFacilities} fasilitas</small>
          </div>
        </div>
      </div>

      {/* Role-Specific Governance / Operational Strip from /api/admin/overview */}
      <div className="dash-card" style={{ marginBottom: 22, padding: '18px 22px', borderLeft: `4px solid ${isSuperAdmin ? '#4f46e5' : '#059669'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 className="section-title-editorial" style={{ margin: 0, fontSize: 18 }}>
              {isSuperAdmin ? 'Ringkasan Tata Kelola & Akun Supabase' : 'Ringkasan Operasional Data & Antrean Kerja Admin'}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
              {overviewLoading
                ? 'Menyelaraskan metrik langsung dari Supabase...'
                : `Mode backend: ${overview?.data_source || 'postgis'} • Periode data aktif: ${(overview?.available_years || [2025]).join(', ')}`}
            </p>
          </div>
          {isSuperAdmin && (
            <button type="button" className="primary-btn-sm" onClick={() => onNavigate('superadmin-mgmt')}>
              Buka Portal Akun &amp; Audit <ChevronRight size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
          {isSuperAdmin ? (
            <>
              <div style={{ padding: 14, borderRadius: 10, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#4338ca' }}>AKUN SUPABASE AKTIF</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginTop: 4 }}>
                  {overview?.users_summary?.active ?? '-'} / {overview?.users_summary?.total ?? '-'}
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  {overview?.users_summary?.superadmins ?? 1} Super Admin • {overview?.users_summary?.admins ?? 1} Admin
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0284c7' }}>ANTREAN UPLOAD CSV</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {overview?.uploads_summary?.pending ?? 0} Pending
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  {overview?.uploads_summary?.published ?? 0} Published • {overview?.uploads_summary?.rejected ?? 0} Ditolak
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#059669' }}>SNAPSHOT SAW TERAKHIR</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
                  {overview?.latest_saw_run ? `${overview.latest_saw_run.weight_version}` : 'Belum ada snapshot'}
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  {overview?.latest_saw_run
                    ? `Periode ${overview.latest_saw_run.period} • ${new Date(overview.latest_saw_run.created_at).toLocaleDateString('id-ID')}`
                    : 'Simpan snapshot lewat menu SAW'}
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#b45309' }}>ENTITAS GEOSPASIAL</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {overview?.areas_count ?? totalKelurahan} Poligon
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>{totalFacilities} Titik Fasilitas RBI tervalidasi</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: 14, borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', cursor: 'pointer' }} onClick={() => onNavigate('data-entry')}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#047857' }}>STATUS UPLOAD DATASET</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#064e3b', marginTop: 4 }}>
                  {overview?.uploads_summary?.pending ?? 0} Pending
                </div>
                <span style={{ fontSize: 12, color: '#065f46' }}>
                  {overview?.uploads_summary?.published ?? 0} riwayat published • Klik untuk Entri Data
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => onNavigate('priority-areas')}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0284c7' }}>SNAPSHOT ANALISIS SAW</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
                  {overview?.latest_saw_run ? overview.latest_saw_run.weight_version : 'Default SAW v1'}
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  {overview?.latest_saw_run
                    ? `Disimpan ${new Date(overview.latest_saw_run.created_at).toLocaleDateString('id-ID')}`
                    : 'Klik untuk hitung & simpan snapshot SAW'}
                </span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7c3aed' }}>CAKUPAN DATABASE POSTGIS</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {overview?.areas_count ?? totalKelurahan} Kelurahan
                </div>
                <span style={{ fontSize: 12, color: '#475569' }}>4 Indikator × {totalKelurahan} wilayah + {totalFacilities} titik</span>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => onNavigate('food-safety')}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#b45309' }}>INSPEKSI &amp; KEAMANAN PANGAN</span>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Log Audit Pasar</div>
                <span style={{ fontSize: 12, color: '#475569' }}>Pantau uji lab &amp; cadangan pangan kota →</span>
              </div>
            </>
          )}
        </div>

        {isSuperAdmin && Array.isArray(overview?.recent_audit_logs) && overview.recent_audit_logs.length > 0 && (
          <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={14} color="#4f46e5" /> Aktivitas Sistem Terbaru (Real-Time Supabase)
              </span>
              <button type="button" className="link-btn" onClick={() => onNavigate('superadmin-mgmt')}>
                Audit Trail Lengkap <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 8 }}>
              {overview.recent_audit_logs.slice(0, 4).map((log) => (
                <div key={log.id} style={{ padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{log.action} <span style={{ fontWeight: 400, color: '#64748b' }}>• {log.resource}</span></div>
                  <div style={{ color: '#64748b', marginTop: 2 }}>
                    {log.user_email || `User #${log.user_id || '-'}`} • {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Spatial Metric Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card emerald" onClick={() => onNavigate('food-security')}>
          <div className="sc-icon"><Utensils size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Ketahanan Pangan Kecamatan</span>
            <h3 className="sc-value">
              <span ref={safeCountRef}>{safeCount}</span> dari {kecamatanList.length || 6} Kecamatan
            </h3>
            <span className="sc-desc font-mono">Skor Rata-Rata: {avgIkp} (Kelurahan Live)</span>
          </div>
        </div>

        <div className="stat-card cyan" onClick={() => onNavigate('clean-water')}>
          <div className="sc-icon"><Droplets size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Akses Air Bersih Layak</span>
            <h3 className="sc-value" ref={waterRef}>{avgAir}%</h3>
            <span className="sc-desc font-mono">Agregasi {totalKelurahan} kelurahan aktif</span>
          </div>
        </div>

        <div className="stat-card rose" onClick={() => onNavigate('welfare')}>
          <div className="sc-icon"><HeartPulse size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Prevalensi Stunting</span>
            <h3 className="sc-value" ref={stuntingRef}>{avgStunting}%</h3>
            <span className="sc-desc font-mono">Data Aksi Konvergensi per Kelurahan</span>
          </div>
        </div>

        <div className="stat-card amber" onClick={() => onNavigate('priority-areas')}>
          <div className="sc-icon"><AlertOctagon size={22} /></div>
          <div className="sc-info">
            <span className="sc-label">Kecamatan Intervensi Prioritas</span>
            <h3 className="sc-value">
              <span ref={riskRef}>{highRiskCount}</span> Kecamatan
            </h3>
            <span className="sc-desc font-mono">Peringkat SAW 68 Kelurahan →</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Preview & Region List */}
      <div className="dashboard-main-grid">
        <div className="dash-card map-panel">
          <div className="dash-card-head">
            <div>
              <h2 className="section-title-editorial">Sebaran Spasial Status Ketahanan Pangan</h2>
              <p>Klik poligon kelurahan untuk melihat data geospasial detail</p>
            </div>
            <button type="button" className="text-btn" onClick={() => onNavigate('map-explorer')}>
              Perbesar Peta <ChevronRight size={16} />
            </button>
          </div>
          <div className="map-view-wrapper">
            <MapView
              selectedKecamatan={selectedKec}
              onSelectKecamatan={setSelectedKec}
              activeLayer="pangan"
              height="380px"
            />
          </div>
        </div>

        {selectedKec && (
          <div className="dash-card region-detail-panel">
            <div className="dash-card-head">
              <div>
                <h2 className="section-title-editorial">Profil Wilayah Kecamatan</h2>
                <p>Agregasi live kelurahan di {selectedKec.nama}</p>
              </div>
            </div>

            <div className="panel-content">
              <div className="p-header">
                <h3>Kecamatan {selectedKec.nama}</h3>
                <span className={`status-pill ${selectedKec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedKec.panganStatus}
                </span>
              </div>

              <p className="p-desc">{selectedKec.deskripsi}</p>

              <div className="p-metrics-grid">
                <div className="pm-item">
                  <span>Jumlah Penduduk</span>
                  <strong ref={pmPendudukRef}>{selectedKec.penduduk.toLocaleString('id-ID')} jiwa</strong>
                </div>
                <div className="pm-item">
                  <span>Skor Ketahanan Pangan</span>
                  <strong><span ref={pmIkpRef}>{selectedKec.panganSkor}</span> / 100</strong>
                </div>
                <div className="pm-item">
                  <span>Akses Air Bersih</span>
                  <strong ref={pmAirRef}>{selectedKec.airBersih}%</strong>
                </div>
                <div className="pm-item">
                  <span>Prevalensi Stunting</span>
                  <strong ref={pmStuntingRef} className={selectedKec.stunting >= 3.2 ? 'text-danger' : ''}>{selectedKec.stunting}%</strong>
                </div>
                <div className="pm-item">
                  <span>Angka Kemiskinan</span>
                  <strong>{selectedKec.tingkatKemiskinan}</strong>
                </div>
                <div className="pm-item">
                  <span>Jumlah Faskes</span>
                  <strong ref={pmFaskesRef}>{selectedKec.faskes} Puskesmas/Klinik</strong>
                </div>
              </div>

              <div className="p-actions font-mono">
                <span>Sumber Air: <b>{selectedKec.sumberAirDominan}</b></span>
                <button
                  type="button"
                  className="primary-btn-sm"
                  onClick={() => {
                    if (onSelectKecamatan) onSelectKecamatan(selectedKec);
                    onNavigate('indicator-data');
                  }}
                >
                  Buka Data Lengkap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Grid */}
      <div className="dashboard-sub-grid">
        <div className="dash-card chart-card">
          <div className="dash-card-head">
            <div>
              <h2 className="section-title-editorial">Referensi Tren Bulanan Indikator</h2>
              <p>Kurva referensi historis Kota Bogor (Data utama DB dikelola per tahun)</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIKP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bulan" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }} />
                <Area type="monotone" dataKey="ikp" name="Indeks Pangan (IKP)" stroke="#10b981" fillOpacity={1} fill="url(#colorIKP)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="air" name="Akses Air Bersih (%)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAir)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card ranking-card">
          <div className="dash-card-head">
            <div>
              <h2 className="section-title-editorial">Kecamatan Butuh Intervensi Prioritas</h2>
              <p>Peringkat prioritas kecamatan hasil agregasi 68 kelurahan</p>
            </div>
            <button type="button" className="link-btn" onClick={() => onNavigate('priority-areas')}>
              Semua <ChevronRight size={16} />
            </button>
          </div>
          <div className="ranking-list">
            {kecamatanList
              .filter((k) => k.prioritas === 'Sangat Tinggi' || k.prioritas === 'Tinggi' || k.prioritas === 'Sedang')
              .slice(0, 4)
              .map((kec, idx) => (
                <div key={kec.id} className="rank-item" onClick={() => setSelectedKec(kec)}>
                  <div className="rank-num">0{idx + 1}</div>
                  <div className="rank-info">
                    <strong>Kecamatan {kec.nama}</strong>
                    <span>Pusat: {kec.pusat} • Stunting: {kec.stunting}%</span>
                  </div>
                  <span className={`status-pill-sm ${kec.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {kec.panganStatus}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick CMS Action Card */}
      <div
        className="dash-cms-banner"
        style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 12,
          padding: '20px 24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: 10, borderRadius: 10 }}>
            <FileEdit size={24} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
              Kelola Foto &amp; Konten Publik Halaman Warga (CMS)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Perbarui foto banner beranda, foto PDAM, foto stunting, dan dokumentasi lapangan langsung dari antarmuka {isSuperAdmin ? 'Super Admin' : 'Admin'}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('content-mgmt')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            background: '#047857',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(4, 120, 87, 0.3)'
          }}
        >
          <Camera size={16} /> Buka Editor Foto &amp; Konten
        </button>
      </div>

      {/* Modal Ubah Password Akun Saya (Supabase) */}
      {showPwdModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="login-modal-card animate-zoom-in">
            <button type="button" className="modal-close-btn" onClick={() => setShowPwdModal(false)}>
              <X size={20} />
            </button>
            <div className="login-head">
              <div className="login-icon-box">
                <Key size={26} className="text-emerald" />
              </div>
              <h2>Ubah Kata Sandi Akun</h2>
              <p>Memperbarui password akun <strong>{currentUser?.email}</strong> langsung di tabel <code>users</code> Supabase</p>
            </div>

            {pwdError && (
              <div style={{ padding: 10, borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div style={{ padding: 10, borderRadius: 8, background: '#dcfce7', color: '#15803d', fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} /> {pwdSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="login-form">
              <label>
                Kata Sandi Saat Ini *
                <div className="input-wrap">
                  <Key size={18} className="i-icon" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password sekarang"
                  />
                </div>
              </label>

              <label>
                Kata Sandi Baru (Minimal 6 karakter) *
                <div className="input-wrap">
                  <Database size={18} className="i-icon" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                  />
                </div>
              </label>

              <button type="submit" className="primary-btn login-submit-btn" disabled={isChangingPwd}>
                {isChangingPwd ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
