import React from 'react';

/**
 * Ornamen Kujang — Simbol Khas & Ikon Pusaka Bersejarah Kota Bogor
 * Minimalist editorial line-art dengan bilah melengkung dan lubang mata kujang (tritangtu).
 */
export function KujangOrnament({
  className = '',
  size = 110,
  color = '#C9B98E',
  opacity = 0.18,
  style = {}
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 160"
      width={Math.round(size * 0.5)}
      height={size}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`bogor-deco-svg bogor-deco-kujang bogor-deco-float ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {/* Bilah Utama Melengkung Kujang Sunda */}
      <path
        d="M38 8 C43 22, 52 38, 58 56 C64 74, 60 94, 46 110 C38 118, 34 128, 36 142 C37 149, 35 156, 33 166"
        strokeWidth="1.4"
      />
      {/* Punggung & Tadah Khas Kujang */}
      <path
        d="M38 8 C30 28, 26 48, 32 68 C36 82, 28 92, 22 97 C15 102, 17 111, 24 117 C31 122, 33 128, 33 140"
        strokeWidth="1.4"
      />
      {/* Siih / Gigi Hiasan Punggung Kujang */}
      <path
        d="M30 58 C24 61, 20 67, 22 74 C24 79, 29 80, 33 80"
        strokeWidth="1.2"
      />
      {/* 3 Lubang Suci Khas Kujang (Mata Kujang) */}
      <circle cx="43" cy="62" r="2.8" strokeWidth="1.2" />
      <circle cx="42" cy="76" r="2.8" strokeWidth="1.2" />
      <circle cx="39" cy="90" r="2.8" strokeWidth="1.2" />
      {/* Aksen Kontur Bilah Dalam Halus */}
      <path
        d="M39 24 C43 40, 46 56, 46 72"
        strokeWidth="0.9"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      {/* Pangkal Gagang / Panyaluk */}
      <path
        d="M33 166 C30 171, 34 175, 40 173 C44 171, 42 165, 36 160"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/**
 * Siluet Gunung Salak — Panorama Pegunungan Ikonik Kota Bogor
 * Minimalist contour line-art menampilkan punggungan khas Gunung Salak & Kawah Ratu.
 */
export function MountSalakSilhouette({
  className = '',
  width = 150,
  height = 50,
  color = '#C9B98E',
  opacity = 0.22,
  style = {}
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 60"
      width={width}
      height={height}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`bogor-deco-svg bogor-deco-salak bogor-deco-float ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {/* Puncak Utama Salak I & Punggungan Kawah */}
      <path
        d="M4 56 Q30 52 50 44 Q70 36 84 22 Q96 12 104 10 Q112 16 120 25 Q132 30 148 42 Q164 50 176 56"
        strokeWidth="1.4"
      />
      {/* Ridge Kontur Sekunder (Puncak Salak II) */}
      <path
        d="M24 56 Q48 48 68 40 Q82 32 94 24 Q106 20 114 26 Q128 36 146 47 Q162 53 170 56"
        strokeWidth="1.1"
        opacity="0.75"
      />
      {/* Lereng Bawah Kawah Ratu & Kabut Tipis */}
      <path
        d="M44 56 Q66 50 82 46 Q96 42 108 43 Q122 47 138 52 Q152 55 160 56"
        strokeWidth="0.9"
        opacity="0.5"
      />
      {/* Garis Dasar Horison Minimalis */}
      <line
        x1="8"
        y1="56"
        x2="172"
        y2="56"
        strokeWidth="0.75"
        opacity="0.35"
      />
    </svg>
  );
}

/**
 * Ornamen Botanikal Kebun Raya Bogor
 * Daun tropis / pakis (fern & tropical leaf) melambangkan keanekaragaman flora Kota Hujan.
 */
export function BogorBotanicalOrnament({
  variant = 'fern',
  className = '',
  size = 78,
  color = '#829783',
  opacity = 0.2,
  style = {}
}) {
  if (variant === 'leaf') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`bogor-deco-svg bogor-deco-botanical bogor-deco-float ${className}`}
        style={{ opacity, ...style }}
        aria-hidden="true"
      >
        {/* Batang Utama Melengkung */}
        <path d="M16 86 Q36 64 54 44 Q70 24 86 12" />
        {/* Helai Daun Tropis */}
        <path d="M86 12 C62 15 42 32 34 54 C30 65 24 76 16 86" />
        <path d="M86 12 C82 36 68 56 50 68 C38 76 26 82 16 86" />
        {/* Tulang Daun Halus */}
        <path d="M44 53 Q54 45 66 42" strokeWidth="1" opacity="0.75" />
        <path d="M52 45 Q62 35 74 31" strokeWidth="1" opacity="0.75" />
        <path d="M36 63 Q48 56 58 56" strokeWidth="1" opacity="0.75" />
        <path d="M28 73 Q38 68 48 69" strokeWidth="1" opacity="0.75" />
      </svg>
    );
  }

  // Default: Fern / Pakis Kebun Raya Bogor
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`bogor-deco-svg bogor-deco-botanical bogor-deco-float ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {/* Batang Pakis Melengkung Organik */}
      <path d="M12 90 Q30 72 48 50 Q66 28 88 10" />
      {/* Pinna / Daun Pakis Kiri & Kanan Berpasangan */}
      <path d="M88 10 Q80 8 76 14 Q80 18 85 15" />
      <path d="M78 21 Q66 17 62 25 Q70 29 76 25" />
      <path d="M70 28 Q80 24 86 32 Q80 35 72 33" />
      <path d="M64 37 Q50 31 46 41 Q56 45 62 41" />
      <path d="M56 44 Q68 40 74 48 Q66 52 58 49" />
      <path d="M50 53 Q36 47 32 58 Q42 62 48 57" />
      <path d="M42 61 Q54 57 60 66 Q50 70 44 66" />
      <path d="M36 71 Q22 65 18 76 Q30 80 34 75" />
      <path d="M28 80 Q40 76 45 86 Q35 89 30 85" />
    </svg>
  );
}
