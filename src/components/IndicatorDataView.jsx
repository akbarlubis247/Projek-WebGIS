import React, { useState, useMemo } from 'react';
import { TableProperties, Search, Filter, Download, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { KECAMATAN_DATA, FOOD_SECURITY_CATEGORIES } from '../data/bogorData';

export default function IndicatorDataView() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterPrioritas, setFilterPrioritas] = useState('Semua Prioritas');
  const [exportNotification, setExportNotification] = useState('');

  const filteredData = useMemo(() => {
    return KECAMATAN_DATA.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.pusat.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'Semua Status' || item.panganStatus === filterStatus;
      const matchPrioritas = filterPrioritas === 'Semua Prioritas' || item.prioritas === filterPrioritas;
      return matchSearch && matchStatus && matchPrioritas;
    });
  }, [search, filterStatus, filterPrioritas]);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nama Kecamatan,Pusat,Penduduk,Status Pangan,Skor IKP,Air Bersih,Stunting,Kemiskinan,Prioritas\n";
    filteredData.forEach(row => {
      csvContent += `${row.id},"${row.nama}","${row.pusat}",${row.penduduk},"${row.panganStatus}",${row.panganSkor},${row.airBersih},${row.stunting},"${row.tingkatKemiskinan}","${row.prioritas}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NutriMap_Bogor_Indikator_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification('File CSV berhasil diunduh!');
    setTimeout(() => setExportNotification(''), 3000);
  };

  const handleExportPDF = () => {
    setExportNotification('Memproses dokumen Laporan PDF NutriMap Bogor...');
    setTimeout(() => {
      window.print();
      setExportNotification('');
    }, 1000);
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Data Indikator NutriMap Kota Bogor</h1>
          <p>Tabel lengkap indikator spasial ketahanan pangan, sanitasi air, dan kesehatan balita Kota Bogor.</p>
        </div>
        <div className="export-action-group">
          <button className="outline-btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> Unduh CSV
          </button>
          <button className="primary-btn-sm" onClick={handleExportPDF}>
            <FileText size={16} /> Cetak PDF / Laporan
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="alert-toast animate-slide-down">
          <Check size={18} /> {exportNotification}
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="dash-card table-card">
        <div className="table-tools-header">
          <div className="t-search">
            <Search size={18} className="icon" />
            <input
              type="text"
              placeholder="Cari nama kecamatan atau desa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="t-filters">
            <label className="select-wrap">
              <Filter size={14} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option>Semua Status Pangan</option>
                {FOOD_SECURITY_CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
              </select>
            </label>

            <label className="select-wrap">
              <select value={filterPrioritas} onChange={e => setFilterPrioritas(e.target.value)}>
                <option>Semua Prioritas</option>
                <option value="Sangat Tinggi">Prioritas Sangat Tinggi</option>
                <option value="Tinggi">Prioritas Tinggi</option>
                <option value="Sedang">Prioritas Sedang</option>
                <option value="Rendah">Prioritas Rendah</option>
              </select>
            </label>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Kode</th>
                <th>Kecamatan</th>
                <th>Jumlah Penduduk</th>
                <th>Status Pangan</th>
                <th>Skor IKP</th>
                <th>Air Bersih</th>
                <th>Stunting</th>
                <th>Faskes</th>
                <th>Kemiskinan</th>
                <th>Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(row => (
                  <tr key={row.id}>
                    <td className="font-mono text-muted">{row.id}</td>
                    <td>
                      <b>Kec. {row.nama}</b>
                      <br />
                      <small className="muted">{row.pusat}</small>
                    </td>
                    <td>{row.penduduk.toLocaleString('id-ID')} jiwa</td>
                    <td>
                      <span className={`badge ${row.panganStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.panganStatus}
                      </span>
                    </td>
                    <td>
                      <strong>{row.panganSkor}</strong> / 100
                    </td>
                    <td>{row.airBersih}%</td>
                    <td className={row.stunting > 20 ? 'text-danger fw-bold' : ''}>{row.stunting}%</td>
                    <td>{row.faskes} Unit</td>
                    <td>{row.tingkatKemiskinan}</td>
                    <td>
                      <span className={`priority-pill ${row.prioritas.toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.prioritas}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    Data tidak ditemukan untuk kriteria pencarian "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="table-pagination">
          <span className="pagination-info">
            Menampilkan {filteredData.length} dari {KECAMATAN_DATA.length} kecamatan
          </span>
          <div className="pagination-btns">
            <button disabled><ChevronLeft size={16} /></button>
            <button className="active">1</button>
            <button disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
