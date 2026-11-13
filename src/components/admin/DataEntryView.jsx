import React, { useEffect, useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Save,
  Building2,
  RefreshCw,
  FileText,
  XCircle,
  Clock
} from 'lucide-react';
import {
  createUploadApi,
  listUploadsApi,
  publishUploadApi,
  rejectUploadApi,
  updateManualIndicatorApi
} from '../../services/api';
import { refreshNutriMapData, useNutriMapData } from '../../hooks/useNutriMapData';

const INDICATOR_OPTIONS = [
  { value: 'stunting', label: 'Prevalensi Stunting (%)', min: 0, max: 100 },
  { value: 'kemiskinan', label: 'Tingkat Kemiskinan / DTKS (%)', min: 0, max: 100 },
  { value: 'pangan', label: 'Kerentanan Pangan (Skor 0-100)', min: 0, max: 100 },
  { value: 'air', label: 'Akses Sanitasi Air Bersih (%)', min: 0, max: 100 }
];

export default function DataEntryView({ currentUser }) {
  const { kelurahanList } = useNutriMapData();
  const [entryMode, setEntryMode] = useState('csv'); // 'csv' | 'manual'
  const [dragActive, setDragActive] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [indicatorType, setIndicatorType] = useState('stunting');
  const [year, setYear] = useState(2025);
  const [sourceName, setSourceName] = useState('Dinas Kesehatan / Bappeda Kota Bogor');
  const [serverUpload, setServerUpload] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const fileInputRef = useRef(null);

  // Manual Entry State
  const [manualAreaId, setManualAreaId] = useState('');
  const [manualValue, setManualValue] = useState('');

  useEffect(() => {
    if (!manualAreaId && kelurahanList.length) {
      setManualAreaId(kelurahanList[0].id);
    }
  }, [kelurahanList, manualAreaId]);

  const selectedManualArea = kelurahanList.find((k) => k.id === manualAreaId) || kelurahanList[0] || null;

  const handleManualSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!selectedManualArea) {
      setErrorMsg('Pilih kelurahan terlebih dahulu.');
      return;
    }
    const numVal = Number(manualValue);
    if (!Number.isFinite(numVal) || numVal < 0 || numVal > 100) {
      setErrorMsg('Nilai indikator harus angka antara 0 dan 100.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await updateManualIndicatorApi({
        areaId: selectedManualArea.id,
        indicatorType,
        year,
        value: numVal,
        source: sourceName,
      });
      await refreshNutriMapData();
      setSuccessMsg(
        `Sukses! Indikator ${res.data.indicator_type} Kelurahan ${res.data.nama} (${res.data.kecamatan}) tahun ${res.data.year} diperbarui menjadi ${res.data.value} di Supabase.`
      );
      setManualValue('');
    } catch (err) {
      setErrorMsg(`Gagal menyimpan pembaruan manual: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await listUploadsApi();
      setUploadHistory(Array.isArray(res?.data) ? res.data : []);
    } catch {
      // Abaikan jika backend belum login / offline
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parseCSVContent = (text, file) => {
    setErrorMsg('');
    setSuccessMsg('');
    setServerUpload(null);

    try {
      const lines = text.trim().split(/\r\n|\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        setErrorMsg('Berkas CSV kosong atau hanya memiliki baris judul (header).');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      setCsvHeaders(headers);

      const hasArea = headers.some((h) =>
        ['kelurahan', 'nama_kelurahan', 'wadmkd', 'kode_wilayah', 'area_id', 'id', 'nama'].includes(h)
      );
      if (!hasArea) {
        setErrorMsg('Format berkas tidak sesuai standar. Kolom wajib mencakup minimal "kelurahan" atau "kode_wilayah".');
        return;
      }

      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
        if (values.length === headers.length) {
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx];
          });
          rows.push(rowObj);
        }
      }

      if (rows.length === 0) {
        setErrorMsg('Tidak ada baris data valid yang dapat diurai dari berkas CSV ini.');
        return;
      }

      setRawFile(file);
      setParsedRows(rows);
      setCsvFile({ name: file.name, size: (text.length / 1024).toFixed(1) + ' KB', count: rows.length });
      setSuccessMsg(`Berkas "${file.name}" siap diunggah (${rows.length} baris). Klik "Upload & Validasi Server" untuk memproses.`);
    } catch (err) {
      setErrorMsg('Gagal membaca berkas CSV: ' + err.message);
    }
  };

  const handleSelectedFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Format berkas harus berformat .CSV!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      parseCSVContent(event.target.result, file);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => handleSelectedFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleSelectedFile(e.dataTransfer.files?.[0]);
  };

  // Step 1: Upload CSV ke Backend (/api/admin/uploads) untuk validasi wilayah & rentang nilai
  const handleUploadAndValidate = async () => {
    if (!rawFile) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsProcessing(true);
    try {
      const res = await createUploadApi({
        file: rawFile,
        indicatorType,
        year,
        source: sourceName,
      });
      setServerUpload(res);
      setSuccessMsg(
        `Validasi server selesai (ID: ${res.data.id}): ${res.validation.summary.valid_row_count} valid, ` +
        `${res.validation.summary.invalid_row_count} tidak valid, ${res.validation.summary.unmatched_row_count} tidak cocok. Klik "Publikasikan" untuk memperbarui database.`
      );
      await loadHistory();
    } catch (err) {
      setErrorMsg(`Gagal mengunggah CSV ke server: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2a: Publikasikan Upload Pending -> PostGIS indicators + refresh cache UI
  const handlePublish = async (uploadId) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsProcessing(true);
    try {
      const res = await publishUploadApi(uploadId);
      await refreshNutriMapData();
      setServerUpload((prev) => (prev?.data?.id === uploadId ? { ...prev, data: res.data } : prev));
      setSuccessMsg(`Sukses! ${res.published_rows} baris indikator berhasil dipublikasikan ke PostGIS dan peta diperbarui.`);
      await loadHistory();
    } catch (err) {
      setErrorMsg(`Gagal mempublikasikan data: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2b: Tolak Upload Pending
  const handleReject = async (uploadId) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsProcessing(true);
    try {
      const res = await rejectUploadApi(uploadId);
      setServerUpload((prev) => (prev?.data?.id === uploadId ? { ...prev, data: res.data } : prev));
      setSuccessMsg(`Upload ${uploadId} ditandai sebagai ditolak.`);
      await loadHistory();
    } catch (err) {
      setErrorMsg(`Gagal menolak upload: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = [
      'kelurahan,kecamatan,stunting,kemiskinan,kerentanan_pangan,air_bersih',
      'Babakan,Bogor Tengah,5.08,5.94,29.95,7.26',
      'Babakan Pasar,Bogor Tengah,2.10,4.85,26.10,82.50',
      'Bantarjati,Bogor Utara,1.85,3.20,24.50,91.00',
      'Batutulis,Bogor Selatan,3.40,6.80,30.10,64.00',
      'Baranangsiang,Bogor Timur,2.20,3.90,25.40,85.00',
      'Bubulak,Bogor Barat,3.90,7.20,31.20,58.00',
      'Cibadak,Tanah Sareal,2.80,5.50,28.60,76.00'
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'templat_indikator_bogor.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setRawFile(null);
    setCsvFile(null);
    setParsedRows([]);
    setCsvHeaders([]);
    setServerUpload(null);
    setErrorMsg('');
    setSuccessMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title-editorial" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Portal Entri &amp; Pengunggahan Data Indikator (CSV)
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Alur terhubung API: Unggah CSV -&gt; Validasi Server (<code>pending</code>) -&gt; Publikasi ke Supabase PostGIS.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#334155'
          }}
        >
          <Download size={16} /> Unduh Templat CSV Baku
        </button>
      </div>

      {/* Mode Switcher: CSV Batch vs Input Manual Kelurahan */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => { setEntryMode('csv'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: entryMode === 'csv' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              background: entryMode === 'csv' ? '#0284c7' : '#ffffff',
              color: entryMode === 'csv' ? '#ffffff' : '#334155',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Upload size={15} /> Unggah Batch CSV
          </button>
          <button
            type="button"
            onClick={() => { setEntryMode('manual'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: entryMode === 'manual' ? '1px solid #059669' : '1px solid #cbd5e1',
              background: entryMode === 'manual' ? '#059669' : '#ffffff',
              color: entryMode === 'manual' ? '#ffffff' : '#334155',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Building2 size={15} /> Input Manual Kelurahan
          </button>
        </div>
        {currentUser?.role && (
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Akses Aktif: <strong>{currentUser.name}</strong> ({currentUser.role})
          </span>
        )}
      </div>

      {/* Metadata Parameter Upload / Input Manual */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20, background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Jenis Indikator *
          </label>
          <select
            value={indicatorType}
            onChange={(e) => setIndicatorType(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          >
            {INDICATOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Tahun Data *
          </label>
          <input
            type="number"
            min="2015"
            max="2035"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Sumber Data Resmi
          </label>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="FSVA / Aksi Konvergensi"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
          />
        </div>
      </div>

      {entryMode === 'manual' ? (
        <form
          onSubmit={handleManualSave}
          style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 22, marginBottom: 28 }}
        >
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Pembaruan Nilai Indikator Satu Kelurahan (Langsung ke Supabase PostGIS)
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>
            Pilih kelurahan sasaran dan masukkan nilai terbaru; perubahan langsung tercatat di audit log dan memperbarui peta choropleth serta SAW.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 14, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Pilih Kelurahan (68 Wilayah Kota Bogor) *
              </label>
              <select
                value={manualAreaId}
                onChange={(e) => setManualAreaId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                {kelurahanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.id} — Kel. {k.nama} (Kec. {k.kecamatan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Nilai Baru ({indicatorType}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                placeholder="Contoh: 4.25"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              style={{
                padding: '10px 18px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Save size={15} /> {isProcessing ? 'Menyimpan...' : 'Simpan ke Supabase'}
            </button>
          </div>

          {selectedManualArea && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: '#f8fafc', fontSize: 12.5, color: '#334155', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <span>Nilai Saat Ini ({selectedManualArea.nama}):</span>
              <span>Stunting: <b>{selectedManualArea.stunting}%</b></span>
              <span>Kemiskinan: <b>{selectedManualArea.kemiskinan}%</b></span>
              <span>Kerentanan Pangan: <b>{selectedManualArea.kerentananPangan}</b></span>
              <span>Air Bersih: <b>{selectedManualArea.airBersih}%</b></span>
            </div>
          )}
        </form>
      ) : (
        /* Grid: Upload Area & Petunjuk Format */
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#0284c7' : '#cbd5e1'}`,
            borderRadius: 12,
            padding: 36,
            textAlign: 'center',
            background: dragActive ? '#f0f9ff' : '#ffffff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 28, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Upload size={28} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Tarik &amp; Lepas Berkas CSV ke Sini
          </h3>
          <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: 13, maxWidth: 380 }}>
            Mendukung format <code>.csv</code> UTF-8 hingga 5 MB untuk memperbarui nilai indikator 68 kelurahan secara tervalidasi.
          </p>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ padding: '10px 20px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FileSpreadsheet size={16} /> Pilih Berkas dari Komputer
          </button>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} color="#0284c7" /> Standar Kolom Backend
          </h4>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
            Backend menerima kolom wilayah (<code>kelurahan</code> atau <code>kode_wilayah</code>) dan kolom nilai indikator:
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: '20px' }}>
            <li><code>kelurahan</code> / <code>kode_wilayah</code> : Pengenal wilayah resmi</li>
            <li><code>kecamatan</code> : Opsional, pembeda nama kelurahan</li>
            <li><code>value</code> atau kolom indikator (<code>stunting</code>, <code>kemiskinan</code>, <code>kerentanan_pangan</code>, <code>air_bersih</code>)</li>
          </ul>
        </div>
      </div>
      )}

      {errorMsg && (
        <div style={{ padding: 14, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 13 }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: 14, background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, color: '#15803d', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 13 }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pratinjau & Aksi Upload / Validasi / Publish */}
      {parsedRows.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Eye size={20} color="#059669" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  Pratinjau CSV ({csvFile?.name} — {parsedRows.length} Baris)
                </h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Target: <strong>{indicatorType}</strong> tahun <strong>{year}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleClear}
                disabled={isProcessing}
                style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={14} /> Reset
              </button>
              {!serverUpload && (
                <button
                  onClick={handleUploadAndValidate}
                  disabled={isProcessing}
                  style={{ padding: '8px 18px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {isProcessing ? 'Memvalidasi...' : 'Upload & Validasi Server'}
                </button>
              )}
              {serverUpload?.data?.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(serverUpload.data.id)}
                    disabled={isProcessing}
                    style={{ padding: '8px 14px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <XCircle size={14} /> Tolak
                  </button>
                  <button
                    onClick={() => handlePublish(serverUpload.data.id)}
                    disabled={isProcessing || !serverUpload.validation?.summary?.valid_row_count}
                    style={{ padding: '8px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <CheckCircle2 size={14} /> Publikasikan ke Supabase ({serverUpload.validation?.summary?.valid_row_count || 0})
                  </button>
                </>
              )}
            </div>
          </div>

          {serverUpload?.validation && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 12.5 }}>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                Valid: {serverUpload.validation.summary.valid_row_count}
              </span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                Invalid: {serverUpload.validation.summary.invalid_row_count}
              </span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                Unmatched: {serverUpload.validation.summary.unmatched_row_count}
              </span>
              <span style={{ padding: '4px 10px', borderRadius: 6, background: '#f1f5f9', color: '#334155', fontWeight: 700 }}>
                Status: {serverUpload.data.status}
              </span>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '10px 14px', color: '#475569' }}>No</th>
                  {csvHeaders.map((head, idx) => (
                    <th key={idx} style={{ padding: '10px 14px', color: '#475569', textTransform: 'capitalize' }}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                    {csvHeaders.map((head, hIdx) => (
                      <td key={hIdx} style={{ padding: '10px 14px', color: '#0f172a' }}>
                        {row[head] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Riwayat Upload Server */}
      <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="#0284c7" /> Riwayat Unggahan Dataset (Backend)
          </h3>
          <button
            onClick={loadHistory}
            disabled={isLoadingHistory}
            style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={13} /> Muat Ulang
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '10px 12px', color: '#475569' }}>ID</th>
                <th style={{ padding: '10px 12px', color: '#475569' }}>Berkas</th>
                <th style={{ padding: '10px 12px', color: '#475569' }}>Indikator / Tahun</th>
                <th style={{ padding: '10px 12px', color: '#475569' }}>Valid / Invalid / Unmatched</th>
                <th style={{ padding: '10px 12px', color: '#475569' }}>Status</th>
                <th style={{ padding: '10px 12px', color: '#475569' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.length ? (
                uploadHistory.slice(0, 10).map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>{u.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.filename}</td>
                    <td style={{ padding: '10px 12px' }}>{u.indicator_type} ({u.period})</td>
                    <td style={{ padding: '10px 12px' }}>{u.valid_row_count} / {u.invalid_row_count} / {u.unmatched_row_count}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: 11.5 }}>{u.status}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {u.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => handlePublish(u.id)}
                            disabled={isProcessing || !u.valid_row_count}
                            style={{ padding: '4px 10px', background: '#059669', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >
                            Publish
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            disabled={isProcessing}
                            style={{ padding: '4px 10px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: 12 }}>Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>
                    Belum ada riwayat unggahan CSV dari sesi admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
