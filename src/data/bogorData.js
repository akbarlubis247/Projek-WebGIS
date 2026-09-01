// Data NutriMap Kota Bogor - Sistem Informasi Geografis Ketahanan Pangan & Kesejahteraan Kota Bogor

export const KOTA_BOGOR_STATS = {
  totalPenduduk: "1.092.800",
  jumlahKecamatan: 6,
  jumlahKelurahan: 68,
  luasWilayah: "118.5 km²",
  skorIKP: 88.2, // Indeks Ketahanan Pangan Kota Bogor
  prevalensiStunting: "15.4%",
  aksesAirBersih: "89.6%",
  tingkatKerawanan: "2 Kecamatan Waspada",
  terakhirDiperbarui: "1 September 2026",
};

// Aliases for compatibility
export const KABUPATEN_BOGOR_STATS = KOTA_BOGOR_STATS;

export const KECAMATAN_KOTA_BOGOR = [
  {
    id: "BOG-01",
    nama: "Bogor Tengah",
    pusat: "Kebun Raya / Sempur",
    lat: -6.5971,
    lng: 106.7949,
    penduduk: 108500,
    panganStatus: "Sangat Aman",
    panganSkor: 94.8,
    airBersih: 96.2,
    stunting: 8.4,
    prioritas: "Rendah",
    tingkatKemiskinan: "3.2%",
    faskes: 14,
    pasarTradisional: 4,
    sumberAirDominan: "PDAM Tirta Pakuan",
    deskripsi: "Pusat kota dan kawasan administrasi Balai Kota Bogor. Akses jaringan logistik pangan dan air minum terpadu.",
  },
  {
    id: "BOG-02",
    nama: "Bogor Utara",
    pusat: "Tanah Baru / Cibuluh",
    lat: -6.5614,
    lng: 106.8122,
    penduduk: 192400,
    panganStatus: "Aman",
    panganSkor: 88.5,
    airBersih: 91.0,
    stunting: 12.6,
    prioritas: "Rendah",
    tingkatKemiskinan: "5.1%",
    faskes: 10,
    pasarTradisional: 2,
    sumberAirDominan: "PDAM Tirta Pakuan",
    deskripsi: "Kawasan hunian dan sentra kuliner. Distribusi bahan pokok stabil dan fasilitas sanitasi terjangkau.",
  },
  {
    id: "BOG-03",
    nama: "Bogor Selatan",
    pusat: "Batutulis / Bondongan",
    lat: -6.6264,
    lng: 106.8042,
    penduduk: 210800,
    panganStatus: "Waspada",
    panganSkor: 74.2,
    airBersih: 81.5,
    stunting: 19.8,
    prioritas: "Tinggi",
    tingkatKemiskinan: "8.9%",
    faskes: 8,
    pasarTradisional: 3,
    sumberAirDominan: "PDAM & Sumur Gali",
    deskripsi: "Wilayah perbukitan bagian selatan kota. Terdapat kantong pemukiman padat yang memerlukan penanganan stunting ekstra.",
  },
  {
    id: "BOG-04",
    nama: "Bogor Timur",
    pusat: "Tajur / Baranangsiang",
    lat: -6.6128,
    lng: 106.8286,
    penduduk: 109200,
    panganStatus: "Aman",
    panganSkor: 89.1,
    airBersih: 93.4,
    stunting: 11.2,
    prioritas: "Rendah",
    tingkatKemiskinan: "4.5%",
    faskes: 9,
    pasarTradisional: 2,
    sumberAirDominan: "PDAM Tirta Pakuan",
    deskripsi: "Pintu masuk tol Jagorawi dan kawasan perdagangan komersial dengan keterjangkauan ekonomi warga tinggi.",
  },
  {
    id: "BOG-05",
    nama: "Bogor Barat",
    pusat: "Bubulak / Cilendek",
    lat: -6.5786,
    lng: 106.7644,
    penduduk: 242600,
    panganStatus: "Waspada",
    panganSkor: 78.6,
    airBersih: 85.0,
    stunting: 17.5,
    prioritas: "Sedang",
    tingkatKemiskinan: "7.4%",
    faskes: 11,
    pasarTradisional: 3,
    sumberAirDominan: "PDAM & Sumur Bor",
    deskripsi: "Kecamatan dengan populasi terbesar di Kota Bogor. Sentra UMKM dan pengembangan jaringan pemukiman baru.",
  },
  {
    id: "BOG-06",
    nama: "Tanah Sareal",
    pusat: "Kebon Pedes / Kedung Badak",
    lat: -6.5581,
    lng: 106.7878,
    penduduk: 228700,
    panganStatus: "Aman",
    panganSkor: 86.4,
    airBersih: 90.2,
    stunting: 13.8,
    prioritas: "Rendah",
    tingkatKemiskinan: "5.8%",
    faskes: 12,
    pasarTradisional: 3,
    sumberAirDominan: "PDAM Tirta Pakuan",
    deskripsi: "Kawasan perumahan padat dan pusat transportasi Stasiun Cilebut. Pasokan pangan segar sangat stabil.",
  },
];

export const KECAMATAN_DATA = KECAMATAN_KOTA_BOGOR;

export const INITIAL_ADMINS_LIST = [
  { id: "ADM-001", nama: "Dr. Ahmad Ridwan", email: "admin@bogorkota.go.id", password: "admin123password", status: "Aktif", ditambahkan: "01 Sep 2026" },
  { id: "ADM-002", nama: "Siti Rahmawati, S.P.", email: "siti.rahma@bogorkota.go.id", password: "password123", status: "Aktif", ditambahkan: "15 Agu 2026" },
  { id: "ADM-003", nama: "Budi Santoso, ST", email: "budi.analis@bogorkota.go.id", password: "password123", status: "Aktif", ditambahkan: "20 Agu 2026" },
];

export const FOOD_SECURITY_CATEGORIES = [
  { label: "Sangat Aman", color: "#10b981", count: 1, desc: "Skor IKP > 90. Akses pangan sangat mandiri" },
  { label: "Aman", color: "#06b6d4", count: 3, desc: "Skor IKP 80-89. Akses air & pangan stabil" },
  { label: "Waspada", color: "#f59e0b", count: 2, desc: "Skor IKP 70-79. Perlu perhatian stunting & sanitasi" },
  { label: "Rawan", color: "#f97316", count: 0, desc: "Skor IKP 50-69. Memerlukan bantuan rutin" },
  { label: "Sangat Rawan", color: "#ef4444", count: 0, desc: "Skor IKP < 50. Prioritas utama bantuan" },
];

export const MONTHLY_TREND_KOTA = [
  { bulan: "Jan", ikp: 85.2, stunting: 17.5, air: 87.5 },
  { bulan: "Feb", ikp: 85.9, stunting: 17.0, air: 88.1 },
  { bulan: "Mar", ikp: 86.5, stunting: 16.6, air: 88.6 },
  { bulan: "Apr", ikp: 87.1, stunting: 16.2, air: 88.9 },
  { bulan: "Mei", ikp: 87.6, stunting: 15.9, air: 89.2 },
  { bulan: "Jun", ikp: 87.9, stunting: 15.7, air: 89.4 },
  { bulan: "Jul", ikp: 88.1, stunting: 15.5, air: 89.5 },
  { bulan: "Agus", ikp: 88.2, stunting: 15.4, air: 89.6 },
];

export const MONTHLY_TREND = MONTHLY_TREND_KOTA;

export const SECURITY_AUDITS = [
  { id: "AUD-KOTA-001", lokasi: "Pasar Kebon Kembang (Anyar)", tanggal: "28 Agu 2026", jenis: "Uji Sampel Daging & Daging Ayam", hasil: "Lolos (Bebas Formalin)", status: "Terverifikasi", pemeriksa: "Dinas Ketahanan Pangan Kota Bogor" },
  { id: "AUD-KOTA-002", lokasi: "Pasar Bogor (Otista)", tanggal: "25 Agu 2026", jenis: "Cek Residu Pestisida Sayuran", hasil: "Batas Aman (0.01 ppm)", status: "Terverifikasi", pemeriksa: "Lab Lingkungan Kota Bogor" },
  { id: "AUD-KOTA-003", lokasi: "Pasar Jembatan Merah", tanggal: "20 Agu 2026", jenis: "Pengawasan Ikan Asin Formalin", hasil: "Lolos Bebas Pengawet", status: "Terverifikasi", pemeriksa: "Satgas Pangan Kota" },
  { id: "AUD-KOTA-004", lokasi: "Pasar Gunung Batu", tanggal: "15 Agu 2026", jenis: "Inspeksi Stok Beras Cadangan Kota", hasil: "Stok Aman (8.200 Ton)", status: "Terverifikasi", pemeriksa: "Bappeda Kota Bogor" },
];
