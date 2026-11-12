import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  X
} from 'lucide-react';
import { compressImageFile, formatFileSize } from '../../utils/imageCompressor';

export default function ImageFieldUploader({
  label,
  description,
  currentValue,
  defaultAsset,
  recommendedRatio = '16:9 (Landscape)',
  onChange,
  maxDimension = 1600,
  quality = 0.82
}) {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressStats, setCompressStats] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const activeSrc = currentValue && currentValue.trim() !== '' ? currentValue : defaultAsset;
  const isCustomActive = Boolean(currentValue && currentValue.trim() !== '');

  // Handle local file selection with client-side canvas compression
  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('File yang dipilih harus berupa format gambar (PNG, JPG, JPEG, WebP).');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setCompressStats(null);

    try {
      const result = await compressImageFile(file, {
        maxWidth: maxDimension,
        maxHeight: Math.round(maxDimension * 0.75),
        quality
      });

      onChange(result.dataUrl);
      setCompressStats({
        orig: formatFileSize(result.originalSize),
        comp: formatFileSize(result.compressedSize),
        dimensions: `${result.width} × ${result.height} px`
      });
      setIsUrlMode(false);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage(err.message || 'Gagal memproses gambar. Silakan coba file lain.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setIsUrlMode(false);
    setCompressStats(null);
  };

  const handleResetToDefault = () => {
    onChange('');
    setCompressStats(null);
    setErrorMessage('');
  };

  return (
    <div
      className="image-field-uploader-card"
      style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'grid',
        gap: 16
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>{label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#1e40af',
                background: '#dbeafe',
                padding: '2px 8px',
                borderRadius: 9999,
                border: '1px solid #bfdbfe',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              📷 1 Foto Tunggal
            </span>
            {isCustomActive ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#047857',
                  background: '#d1fae5',
                  padding: '3px 8px',
                  borderRadius: 9999,
                  border: '1px solid #a7f3d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <CheckCircle2 size={12} /> Foto Kustom Aktif
              </span>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#64748b',
                  background: '#f1f5f9',
                  padding: '3px 8px',
                  borderRadius: 9999,
                  border: '1px solid #e2e8f0'
                }}
              >
                Foto Bawaan Sistem
              </span>
            )}
          </div>
          {description && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{description}</p>
          )}
        </div>

        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '4px 10px', borderRadius: 6, border: '1px solid #ccfbf1' }}>
          📐 {recommendedRatio}
        </span>
      </div>

      {/* Main Preview Box with Drag & Drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          borderRadius: 10,
          overflow: 'hidden',
          border: isDragging ? '2px dashed #0284c7' : '1.5px solid #cbd5e1',
          background: isDragging ? '#f0f9ff' : '#0f172a',
          minHeight: 180,
          maxHeight: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {activeSrc ? (
          <img
            src={activeSrc}
            alt={label}
            style={{
              width: '100%',
              height: 240,
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            <ImageIcon size={40} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: 13 }}>Belum ada foto yang dipilih</p>
          </div>
        )}

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              gap: 10,
              backdropFilter: 'blur(3px)'
            }}
          >
            <div className="spinner-border animate-spin" style={{ width: 32, height: 32, border: '3px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Mengompres &amp; Mengoptimalkan Foto...</span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        {activeSrc && !isProcessing && (
          <button
            type="button"
            onClick={() => setPreviewModal(true)}
            title="Lihat Pratinjau Resolusi Penuh"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backdropFilter: 'blur(4px)'
            }}
          >
            <Maximize2 size={13} /> Perbesar
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Compression Stats info banner */}
      {compressStats && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, color: '#065f46', fontSize: 12.5, fontWeight: 600 }}>
          <Sparkles size={14} style={{ color: '#059669' }} />
          <span>Foto teroptimasi: <strong>{compressStats.orig}</strong> → <strong>{compressStats.comp}</strong> ({compressStats.dimensions})</span>
        </div>
      )}

      {/* Action Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            background: '#047857',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <Upload size={15} /> Unggah 1 Foto dari Perangkat
        </button>

        {/* URL Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 14px',
            background: isUrlMode ? '#e0f2fe' : '#f8fafc',
            color: isUrlMode ? '#0284c7' : '#475569',
            border: '1.5px solid #cbd5e1',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <LinkIcon size={14} /> {isUrlMode ? 'Tutup Input URL' : 'Gunakan Tautan/URL (1 Foto)'}
        </button>

        {/* Reset to Default Button */}
        {isCustomActive && (
          <button
            type="button"
            onClick={handleResetToDefault}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 14px',
              background: '#fff1f2',
              color: '#e11d48',
              border: '1px solid #fecdd3',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Kembalikan ke Bawaan
          </button>
        )}
      </div>

      <div style={{ fontSize: 12, color: '#64748b', background: '#f8fafc', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>ℹ️</span>
        <span>Setiap frame hanya memuat <strong>1 foto tunggal</strong>. Foto baru yang diunggah akan langsung menggantikan foto aktif (tidak digabung/di-merge).</span>
      </div>

      {/* URL Input Form */}
      {isUrlMode && (
        <div style={{ display: 'flex', gap: 8, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <input
            type="url"
            placeholder="Tempelkan tautan gambar (https://... /foto-info/...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              border: '1.5px solid #cbd5e1',
              fontSize: 13,
              color: '#0f172a'
            }}
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            style={{
              padding: '8px 16px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Terapkan URL
          </button>
        </div>
      )}

      {/* Full Preview Lightbox Modal */}
      {previewModal && (
        <div
          onClick={() => setPreviewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backdropFilter: 'blur(5px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#0f172a',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <button
              type="button"
              onClick={() => setPreviewModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>
            <img
              src={activeSrc}
              alt={label}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <div style={{ padding: '12px 18px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{isCustomActive ? 'Foto Kustom' : 'Foto Bawaan'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

