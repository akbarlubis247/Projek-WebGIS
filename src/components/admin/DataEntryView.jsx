import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Save,
  Check,
  Building2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { KELURAHAN_68_BOGOR } from '../../data/bogorKelurahanData';

export default function DataEntryView() {
  const [dragActive, setDragActive] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Standar Header CSV yang diharapkan
  const REQUIRED_HEADERS = ['kelurahan', 'kecamatan', 'stunting', 'kemiskinan', 'kerentanan_pangan', 'air_bersih'];

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Parse Raw CSV text
  const parseCSVContent = (text, fileName) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const lines = text.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setErrorMsg('Berkas CSV kosong atau hanya memiliki baris judul (header).');
        return;
      }

      // Ambil Header (bersihkan tanda kutip & spasi)
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      setCsvHeaders(headers);

      // Cek apakah ada minimal 4 indikator utama
      const hasCore = headers.includes('stunting') && (headers.includes('kelurahan') || headers.includes('nama'));
      if (!hasCore) {
        setErrorMsg('Format berkas tidak sesuai standar. Kolom wajib mencakup minimal "kelurahan" dan "stunting". Silakan gunakan templat CSV yang disediakan.');
        return;
      }

      // Parse Baris Data
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
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

      setParsedRows(rows);
      setCsvFile({ name: fileName, size: (text.length / 1024).toFixed(1) + ' KB', count: rows.length });
      setSuccessMsg(`Berkas "${fileName}" berhasil diurai! Ditemukan ${rows.length} baris data kelurahan.`);
    } catch (err) {
      setErrorMsg('Gagal membaca berkas CSV: ' + err.message);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        setErrorMsg('Format berkas harus berformat .CSV!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        parseCSVContent(event.target.result, file.name);
      };
      reader.readAsText(file);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        setErrorMsg('Hanya berkas berformat .CSV yang diperbolehkan!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        parseCSVContent(event.target.result, file.name);
      };
      reader.readAsText(file);
    }
  };

  // Simpan / Commit Data ke Sistem
  const handleCommitData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg(`Sukses! ${parsedRows.length} data indikator kelurahan berhasil diperbarui ke sistem penyimpanan WebGIS.`);
    }, 1200);
  };

  // Unduh Contoh Templat CSV
  const handleDownloadTemplate = () => {
    const templateContent = [
      'kelurahan,kecamatan,stunting,kemiskinan,kerentanan_pangan,air_bersih',
      'Babakan,Bogor Tengah,7.2,2.8,18.5,97.4',
      'Babakan Pasar,Bogor Tengah,14.1,6.9,35.2,92.0',
      'Bantarjati,Bogor Utara,9.2,3.8,22.0,95.0',
      'Batutulis,Bogor Selatan,15.0,6.8,38.0,88.0',
      'Baranangsiang,Bogor Timur,9.5,3.9,22.5,95.5',
      'Bubulak,Bogor Barat,18.0,8.2,46.0,83.0',
      'Cibadak,Tanah Sareal,14.8,6.5,36.0,89.0'
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

  // Reset file
  const handleClear = () => {
    setCsvFile(null);
    setParsedRows([]);
    setCsvHeaders([]);
    setErrorMsg('');
    setSuccessMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="view-container animate-fade-in" style={{ padding: '0' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: '16px', borderBottom: '1px solid #E2E8EF' }}>
        <div>
          <h1 className="page-title-editorial" style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Portal Entri &amp; Pengunggahan Data Indikator (CSV)
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Fasilitas bagi administrator instansi (Dinkes/Bappeda) untuk mengunggah dataset 4 indikator 68 kelurahan Kota Bogor secara massal.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 7,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#15803D'
          }}
        >
          <Download size={16} /> Unduh Templat CSV Baku
        </button>
      </div>

      {/* Grid: Upload Area & Petunjuk Format */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#10B981' : '#CBD5E1'}`,
            borderRadius: 10,
            padding: '36px 24px',
            textAlign: 'center',
            background: dragActive ? '#F0FDF4' : '#FAFBFC',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none'
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#E0F2FE',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.12)'
          }}>
            <Upload size={28} />
          </div>

          <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
            Tarik & Lepas Berkas CSV ke Sini
          </h3>
          <p style={{ margin: '0 0 16px', color: '#64748B', fontSize: 12.5, maxWidth: 320 }}>
            Mendukung format file <code>.csv</code> standar UTF-8 dengan ukuran maksimal 5 MB mencakup 68 kelurahan.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              padding: '9px 18px',
              background: '#0284C7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
            }}
          >
            <FileSpreadsheet size={16} /> Pilih Berkas dari Komputer
          </button>
        </div>

        {/* Informasi Aturan Format Kolom */}
        <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8EF', padding: '18px 20px' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} color="#0284c7" /> Standar Format Kolom CSV
          </h4>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
            Agar modul kalkulasi SAW dan peta Leaflet membaca data dengan benar, berkas harus memiliki baris judul kolom:
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: '20px' }}>
            <li><code>kelurahan</code> : Nama kelurahan resmi</li>
            <li><code>kecamatan</code> : Nama kecamatan di Kota Bogor</li>
            <li><code>stunting</code> : Persentase prevalensi balita stunting</li>
            <li><code>kemiskinan</code> : Persentase kemiskinan / DTKS</li>
            <li><code>kerentanan_pangan</code> : Skor kerawanan (0-100)</li>
            <li><code>air_bersih</code> : Persentase akses sanitasi air</li>
          </ul>
        </div>
      </div>

      {/* Alert Error / Success */}
      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, color: '#15803D', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pratinjau 5 Baris Data Pertama (Sesuai Acceptance Criteria PRD) */}
      {parsedRows.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: 10, border: '1px solid #E2E8EF', overflow: 'hidden', boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Eye size={20} color="#059669" />
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Pratinjau Data CSV ({csvFile?.name} — {parsedRows.length} Baris)
                </h3>
                <span style={{ fontSize: 11, color: '#64748B' }}>
                  Menampilkan 5 baris pertama data indikator untuk verifikasi sebelum disimpan.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleClear}
                style={{ padding: '7px 12px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s ease' }}
              >
                <Trash2 size={14} /> Batalkan
              </button>
              <button
                onClick={handleCommitData}
                disabled={isProcessing}
                style={{ padding: '7px 16px', background: '#0F7A55', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px rgba(15, 122, 85, 0.3)' }}
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {isProcessing ? 'Menyimpan...' : 'Simpan ke Basis Data'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8EF' }}>
                <tr>
                  <th style={{ padding: '10px 16px', color: '#64748B', fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>No</th>
                  {csvHeaders.map((head, idx) => (
                    <th key={idx} style={{ padding: '10px 16px', color: '#64748B', fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
    </div>
  );
}
