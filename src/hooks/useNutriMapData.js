import { useEffect, useMemo, useState } from 'react';
import { BOGOR_KELURAHAN_GEOJSON } from '../data/bogorKelurahanGeoJSON';
import { KELURAHAN_68_BOGOR, calculateSAW } from '../data/bogorKelurahanData';
import { KECAMATAN_KOTA_BOGOR } from '../data/bogorData';
import {
  aggregateKecamatanFromKelurahan,
  extractKelurahanList,
  fetchAreasGeoJSON,
  fetchFacilitiesGeoJSON,
  fetchMetadata,
  fetchSawRankings,
  mapRankingRowToViewItem,
} from '../services/api';

let cachedSnapshot = null;
let inflightPromise = null;
let globalRefreshNonce = 0;
const listeners = new Set();

function notifyListeners(snapshot) {
  for (const listener of listeners) {
    listener(snapshot, globalRefreshNonce);
  }
}

function loadSnapshotOnce(force = false) {
  if (cachedSnapshot && !force) return Promise.resolve(cachedSnapshot);
  if (inflightPromise && !force) return inflightPromise;

  inflightPromise = Promise.all([
    fetchAreasGeoJSON(),
    fetchFacilitiesGeoJSON().catch(() => ({
      data: { type: 'FeatureCollection', features: [] },
      meta: {},
    })),
    fetchMetadata().catch(() => null),
  ])
    .then(([areasRes, facilitiesRes, metaRes]) => {
      const nextAreas = areasRes?.data?.features?.length
        ? areasRes.data
        : BOGOR_KELURAHAN_GEOJSON;
      const nextFacilities = facilitiesRes?.data?.features
        ? facilitiesRes.data
        : { type: 'FeatureCollection', features: [] };

      const snapshot = {
        areasGeoJson: nextAreas,
        facilitiesGeoJson: nextFacilities,
        metadata: metaRes?.data || null,
        isLive: Boolean(areasRes?.data?.features?.length && !areasRes?.meta?.is_dummy),
        dataSource: areasRes?.meta?.data_source || 'postgis',
      };
      cachedSnapshot = snapshot;
      notifyListeners(snapshot);
      return snapshot;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

/**
 * Memicu muat ulang seluruh cache data spasial & ranking setelah admin mempublikasikan dataset baru.
 */
export async function refreshNutriMapData() {
  globalRefreshNonce += 1;
  cachedSnapshot = null;
  return loadSnapshotOnce(true);
}

/**
 * Mengambil data spasial 68 kelurahan, agregat 6 kecamatan, & titik fasilitas dari backend API,
 * dengan fallback otomatis ke data lokal apabila backend sedang offline.
 */
export function useNutriMapData() {
  const [refreshNonce, setRefreshNonce] = useState(globalRefreshNonce);
  const [state, setState] = useState(() => ({
    areasGeoJson: cachedSnapshot?.areasGeoJson || BOGOR_KELURAHAN_GEOJSON,
    facilitiesGeoJson: cachedSnapshot?.facilitiesGeoJson || { type: 'FeatureCollection', features: [] },
    metadata: cachedSnapshot?.metadata || null,
    isLive: Boolean(cachedSnapshot?.isLive),
    dataSource: cachedSnapshot?.dataSource || 'local-fallback',
    isLoading: !cachedSnapshot,
    error: null,
  }));

  useEffect(() => {
    const onUpdate = (snapshot, nextNonce) => {
      setRefreshNonce(nextNonce);
      setState({
        ...snapshot,
        isLoading: false,
        error: null,
      });
    };
    listeners.add(onUpdate);

    if (!cachedSnapshot) {
      let active = true;
      loadSnapshotOnce().catch((err) => {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLive: false,
          dataSource: 'local-fallback',
          error: err.message || 'Gagal menghubungi API NutriMap',
        }));
      });
      return () => {
        active = false;
        listeners.delete(onUpdate);
      };
    }

    return () => {
      listeners.delete(onUpdate);
    };
  }, []);

  const kelurahanList = useMemo(() => {
    const parsed = extractKelurahanList(state.areasGeoJson);
    return parsed.length ? parsed : KELURAHAN_68_BOGOR;
  }, [state.areasGeoJson]);

  const kecamatanList = useMemo(() => {
    return aggregateKecamatanFromKelurahan(kelurahanList, KECAMATAN_KOTA_BOGOR);
  }, [kelurahanList]);

  return {
    ...state,
    kelurahanList,
    kecamatanList,
    refreshNonce,
    refresh: refreshNutriMapData,
  };
}

/**
 * Mengambil hasil pemeringkatan SAW dari GET /api/rankings sesuai bobot kriteria,
 * dengan fallback lokal calculateSAW apabila API tidak tersedia.
 */
export function useSawRankings(weights, kelurahanList, refreshNonce = 0) {
  const totalWeight =
    Number(weights.stunting || 0) +
    Number(weights.kemiskinan || 0) +
    Number(weights.kerentananPangan || 0) +
    Number(weights.airBersih || 0);
  const isWeightValid = totalWeight === 100;

  const fallbackResults = useMemo(() => {
    const sourceList = kelurahanList?.length ? kelurahanList : KELURAHAN_68_BOGOR;
    return calculateSAW(sourceList, weights);
  }, [kelurahanList, weights]);

  const [apiState, setApiState] = useState({
    results: null,
    isLive: false,
    isLoading: false,
    year: null,
  });

  useEffect(() => {
    if (!isWeightValid) return undefined;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setApiState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await fetchSawRankings({ weights, signal: controller.signal });
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setApiState({
            results: res.data.map(mapRankingRowToViewItem),
            isLive: !res?.meta?.is_dummy,
            isLoading: false,
            year: res.year || null,
          });
          return;
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
      setApiState({
        results: null,
        isLive: false,
        isLoading: false,
        year: null,
      });
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    isWeightValid,
    refreshNonce,
    weights.stunting,
    weights.kemiskinan,
    weights.kerentananPangan,
    weights.airBersih,
  ]);

  return {
    sawResults: apiState.results || fallbackResults,
    isLive: Boolean(apiState.results && apiState.isLive),
    isLoading: apiState.isLoading,
    year: apiState.year,
    totalWeight,
    isWeightValid,
  };
}
