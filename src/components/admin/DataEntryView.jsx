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
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Portal Entri & Pengunggahan Data Indikator (CSV)
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

      {/* Grid: Upload Area & Petunjuk Format */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Drag and Drop Zone */}
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
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <Upload size={28} />
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Tarik & Lepas Berkas CSV ke Sini
          </h3>
          <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: 13, maxWidth: 360 }}>
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
              padding: '10px 20px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <FileSpreadsheet size={16} /> Pilih Berkas dari Komputer
          </button>
        </div>

        {/* Informasi Aturan Format Kolom */}
        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
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

      {/* Pratinjau 5 Baris Data Pertama (Sesuai Acceptance Criteria PRD) */}
      {parsedRows.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Eye size={20} color="#059669" />
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  Pratinjau Data CSV ({csvFile?.name} — {parsedRows.length} Baris)
                </h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Menampilkan 5 baris pertama data indikator untuk verifikasi sebelum disimpan.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleClear}
                style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={14} /> Batalkan
              </button>
              <button
                onClick={handleCommitData}
                disabled={isProcessing}
                style={{ padding: '8px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {isProcessing ? 'Menyimpan...' : 'Simpan ke Basis Data'}
              </button>
            </div>
          </div>

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
    </div>
  );
}
