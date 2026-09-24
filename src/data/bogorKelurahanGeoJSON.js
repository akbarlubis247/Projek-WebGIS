import { KELURAHAN_68_BOGOR } from './bogorKelurahanData';

// Radius dasar per kecamatan agar batas kelurahan proporsional dan tidak bertumpuk janggal
const KEC_RADIUS_MAP = {
  'Bogor Tengah': 0.0058,
  'Bogor Utara': 0.0080,
  'Bogor Selatan': 0.0105,
  'Bogor Timur': 0.0088,
  'Bogor Barat': 0.0090,
  'Tanah Sareal': 0.0082
};

// Fungsi bantuan untuk membuat polygon perimeter kelurahan organik di sekitar titik pusat
function generateKelurahanPolygon(lat, lng, index, kecamatan) {
  const baseR = (KEC_RADIUS_MAP[kecamatan] || 0.0080) + ((index % 4) * 0.0006);
  // Gunakan 10 titik sudut (setiap 36 derajat) untuk bentuk poligon wilayah yang lebih halus
  const angles = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  
  const coords = angles.map((ang, i) => {
    const rad = (ang * Math.PI) / 180;
    const jitter = 0.88 + (((index * 7 + i * 11) % 24) / 100);
    const rLat = baseR * jitter * 0.88;
    const rLng = baseR * jitter * 1.08;
    return [
      Number((lng + rLng * Math.cos(rad)).toFixed(5)),
      Number((lat + rLat * Math.sin(rad)).toFixed(5))
    ];
  });
  
  // Tutup poligon kembali ke titik awal
  coords.push(coords[0]);
  return [coords];
}

export const BOGOR_KELURAHAN_GEOJSON = {
  type: "FeatureCollection",
  features: KELURAHAN_68_BOGOR.map((kel, idx) => ({
    type: "Feature",
    id: kel.id,
    properties: {
      id: kel.id,
      nama: kel.nama,
      kecamatan: kel.kecamatan,
      stunting: kel.stunting,
      kemiskinan: kel.kemiskinan,
      kerentananPangan: kel.kerentananPangan,
      airBersih: kel.airBersih,
      lat: kel.lat,
      lng: kel.lng
    },
    geometry: {
      type: "Polygon",
      coordinates: generateKelurahanPolygon(kel.lat, kel.lng, idx, kel.kecamatan)
    }
  }))
};
