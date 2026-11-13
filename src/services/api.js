const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'nutrimap_auth_token';

export function getStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredToken() {
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

async function requestJson(path, options = {}) {
  const { auth = false, body, headers: extraHeaders = {}, ...rest } = options;
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getStoredToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body && !isFormData && typeof body !== 'string' ? JSON.stringify(body) : body,
  });

  if (!res.ok) {
    if (res.status === 401 && auth && !path.startsWith('/api/auth/login')) {
      clearStoredToken();
    }
    let message = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.error?.message || errBody?.error || errBody?.message || message;
    } catch {
      // Ignore non-JSON error bodies
    }
    const error = new Error(typeof message === 'string' ? message : `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// ---- Public Endpoints ----

export async function fetchHealth({ signal } = {}) {
  return requestJson('/api/health', { signal });
}

export async function fetchAreasGeoJSON({ kecamatan, year, signal } = {}) {
  const params = new URLSearchParams();
  if (kecamatan) params.set('kecamatan', kecamatan);
  if (year) params.set('year', String(year));
  const qs = params.toString();
  return requestJson(`/api/areas${qs ? `?${qs}` : ''}`, { signal });
}

export async function fetchAreaById(id, { year, signal } = {}) {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  const qs = params.toString();
  return requestJson(`/api/areas/${encodeURIComponent(id)}${qs ? `?${qs}` : ''}`, { signal });
}

export async function fetchIndicatorLayer({ type, year, kecamatan, signal } = {}) {
  const params = new URLSearchParams({ type });
  if (year) params.set('year', String(year));
  if (kecamatan) params.set('kecamatan', kecamatan);
  return requestJson(`/api/indicators?${params.toString()}`, { signal });
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
    params.set('w_pangan', String(weights.kerentananPangan ?? weights.pangan ?? 20));
    params.set('w_air', String(weights.airBersih ?? weights.air ?? 15));
  }
  const qs = params.toString();
  return requestJson(`/api/rankings${qs ? `?${qs}` : ''}`, { signal });
}

// ---- Auth Endpoints ----

export async function loginApi(email, password) {
  const res = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (res?.token) setStoredToken(res.token);
  return res;
}

export async function fetchMeApi({ signal } = {}) {
  return requestJson('/api/auth/me', { auth: true, signal });
}

// ---- Admin / Superadmin Endpoints ----

export async function listUploadsApi({ signal } = {}) {
  return requestJson('/api/admin/uploads', { auth: true, signal });
}

export async function createUploadApi({ file, indicatorType, year, source }) {
  const form = new FormData();
  form.append('file', file);
  form.append('indicator_type', indicatorType);
  form.append('year', String(year));
  if (source) form.append('source', source);
  return requestJson('/api/admin/uploads', {
    method: 'POST',
    auth: true,
    body: form,
  });
}

export async function getUploadValidationApi(id, { signal } = {}) {
  return requestJson(`/api/admin/uploads/${encodeURIComponent(id)}/validation`, { auth: true, signal });
}

export async function publishUploadApi(id) {
  return requestJson(`/api/admin/uploads/${encodeURIComponent(id)}/publish`, {
    method: 'POST',
    auth: true,
    body: {},
  });
}

export async function rejectUploadApi(id) {
  return requestJson(`/api/admin/uploads/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    auth: true,
    body: {},
  });
}

export async function calculateSawRunApi({ year, weights, weightVersion } = {}) {
  return requestJson('/api/admin/saw/calculate', {
    method: 'POST',
    auth: true,
    body: {
      ...(year ? { year } : {}),
      ...(weights
        ? {
            weights: {
              stunting: weights.stunting,
              kemiskinan: weights.kemiskinan,
              pangan: weights.kerentananPangan ?? weights.pangan,
              air: weights.airBersih ?? weights.air,
            },
          }
        : {}),
      ...(weightVersion ? { weight_version: weightVersion } : {}),
    },
  });
}

export async function listAuditLogsApi({ limit = 50, signal } = {}) {
  return requestJson(`/api/admin/audit-logs?limit=${limit}`, { auth: true, signal });
}

export async function changePasswordApi({ currentPassword, newPassword }) {
  return requestJson('/api/auth/change-password', {
    method: 'POST',
    auth: true,
    body: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  });
}

export async function fetchAdminOverviewApi({ signal } = {}) {
  return requestJson('/api/admin/overview', { auth: true, signal });
}

export async function updateManualIndicatorApi({ areaId, indicatorType, year, value, source }) {
  return requestJson('/api/admin/indicators', {
    method: 'POST',
    auth: true,
    body: {
      area_id: areaId,
      indicator_type: indicatorType,
      year: Number(year),
      value: Number(value),
      ...(source ? { source } : {}),
    },
  });
}

export async function listUsersApi({ signal } = {}) {
  return requestJson('/api/admin/users', { auth: true, signal });
}

export async function createUserApi(payload) {
  return requestJson('/api/admin/users', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export async function updateUserApi(id, payload) {
  return requestJson(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

export async function deleteUserApi(id) {
  return requestJson(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}

// ---- Data Mappers ----

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
      : row.priority_level === 'tinggi' || row.zona === 'merah'
        ? 'red'
        : row.priority_level === 'sedang' || row.zona === 'kuning'
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

export function aggregateKecamatanFromKelurahan(kelurahanList, baseKecamatanList = []) {
  if (!Array.isArray(kelurahanList) || !kelurahanList.length) return baseKecamatanList;

  const grouped = new Map();
  for (const kel of kelurahanList) {
    const key = String(kel.kecamatan || '').trim().toLowerCase();
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(kel);
  }

  return baseKecamatanList.map((base) => {
    const items = grouped.get(String(base.nama || '').trim().toLowerCase());
    if (!items || !items.length) return base;

    const avg = (fn) => items.reduce((s, x) => s + Number(fn(x) || 0), 0) / items.length;
    const stunting = Number(avg((x) => x.stunting).toFixed(2));
    const kemiskinan = Number(avg((x) => x.kemiskinan).toFixed(2));
    const airBersih = Number(avg((x) => x.airBersih).toFixed(1));
    const kerentananPangan = Number(avg((x) => x.kerentananPangan).toFixed(2));
    const panganSkor = Number((100 - kerentananPangan).toFixed(1));

    const panganStatus =
      panganSkor >= 75 ? 'Sangat Aman' : panganSkor >= 71.5 ? 'Aman' : panganSkor >= 69.5 ? 'Waspada' : 'Rentan';
    const prioritas =
      stunting >= 3.2 || panganSkor < 69.5 || airBersih < 55
        ? 'Tinggi'
        : stunting >= 2.2 || panganSkor < 72 || airBersih < 75
          ? 'Sedang'
          : 'Rendah';

    return {
      ...base,
      jumlahKelurahan: items.length,
      stunting,
      kemiskinan,
      tingkatKemiskinan: `${kemiskinan}%`,
      airBersih,
      kerentananPangan,
      panganSkor,
      panganStatus,
      prioritas,
    };
  });
}
