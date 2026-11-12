// ==========================================================================
// CLIENT-SIDE IMAGE COMPRESSOR & OPTIMIZER
// Melakukan kompresi dan downscaling otomatis pada gambar yang diunggah
// oleh Admin agar hemat penyimpanan (localStorage/IndexedDB) dan cepat dimuat.
// ==========================================================================

export function compressImageFile(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar ke kanvas pemroses.'));
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        let targetWidth = width;
        let targetHeight = height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          targetWidth = Math.round(width * ratio);
          targetHeight = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback ke raw dataUrl
          return resolve({
            dataUrl: e.target.result,
            width,
            height,
            originalSize: file.size,
            compressedSize: file.size,
            format: file.type
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Pertahankan PNG jika transparan atau sengaja dipilih
        const outputMime = file.type === 'image/png' && file.size < 800000 ? 'image/png' : mimeType;
        const dataUrl = canvas.toDataURL(outputMime, quality);
        const approxSize = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);

        resolve({
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          originalSize: file.size,
          compressedSize: approxSize,
          format: outputMime
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

