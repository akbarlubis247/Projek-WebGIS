const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody?.error) message = errBody.error;
    } catch {
      // Ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  return res.json();
}

export async function fetchAreasGeoJSON({ kecamatan, year, signal } = {}) {
  const params = new URLSearchParams();
  if (kecamatan) params.set('kecamatan', kecamatan);
  if (year) params.set('year', String(year));
  const qs = params.toString();
  return requestJson(`/api/areas${qs ? `?${qs}` : ''}`, { signal });
}

export async function fetchFacilitiesGeoJSON({ type, signal } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  const qs = params.toString();
  return requestJson(`/api/facilities${qs ? `?${qs}` : ''}`, { signal });
}

export async function fetchMetadata({ signal } = {}) {
  return requestJson('/api/metadata', { signal });
}

export async function fetchSawRankings({ weights, year, signal } = {}) {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  if (weights) {
    params.set('w_stunting', String(weights.stunting));
    params.set('w_kemiskinan', String(weights.kemiskinan));
    params.set('w_pangan', String(weights.kerentananPangan));
    params.set('w_air', String(weights.airBersih));
  }
  const qs = params.toString();
  return requestJson(`/api/rankings${qs ? `?${qs}` : ''}`, { signal });
}

export function extractKelurahanList(geoJson) {
  if (!geoJson || !Array.isArray(geoJson.features)) return [];
  return geoJson.features.map((feature, idx) => {
    const p = feature.properties || {};
    return {
      ...p,
      id: p.id || p.kode_wilayah || `KEL-${idx + 1}`,
      nama: p.nama || '',
      kecamatan: p.kecamatan || '',
      stunting: Number(p.stunting ?? 0),
      kemiskinan: Number(p.kemiskinan ?? 0),
      kerentananPangan: Number(p.kerentananPangan ?? 0),
      airBersih: Number(p.airBersih ?? 0),
      lat: Number(p.lat ?? -6.5971),
      lng: Number(p.lng ?? 106.806),
    };
  });
}

export function mapRankingRowToViewItem(row) {
  const zonaClass =
    row.zona === 'red' || row.zona === 'yellow' || row.zona === 'green'
      ? row.zona
      : row.priority_level === 'tinggi'
        ? 'red'
        : row.priority_level === 'sedang'
          ? 'yellow'
          : 'green';

  const zona =
    row.label ||
    (zonaClass === 'red'
      ? 'Zona Merah (Prioritas 1)'
      : zonaClass === 'yellow'
        ? 'Zona Kuning (Prioritas 2)'
        : 'Zona Hijau (Terkendali)');

  return {
    ...row,
    id: row.area_id || row.kode_wilayah || `KEL-${row.rank}`,
    stunting: Number(row.values?.stunting ?? 0),
    kemiskinan: Number(row.values?.kemiskinan ?? 0),
    kerentananPangan: Number(row.values?.pangan ?? 0),
    airBersih: Number(row.values?.air ?? 0),
    skorPreferensi: Number(row.intervention_score ?? 0),
    conditionScore: Number(row.condition_score ?? 0),
    zonaClass,
    zona,
  };
}
