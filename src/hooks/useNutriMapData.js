import { useEffect, useMemo, useState } from 'react';
import { BOGOR_KELURAHAN_GEOJSON } from '../data/bogorKelurahanGeoJSON';
import { KELURAHAN_68_BOGOR, calculateSAW } from '../data/bogorKelurahanData';
import {
  extractKelurahanList,
  fetchAreasGeoJSON,
  fetchFacilitiesGeoJSON,
  fetchMetadata,
  fetchSawRankings,
  mapRankingRowToViewItem,
} from '../services/api';

let cachedSnapshot = null;
let inflightPromise = null;

function loadSnapshotOnce() {
  if (cachedSnapshot) return Promise.resolve(cachedSnapshot);
  if (inflightPromise) return inflightPromise;

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
      return snapshot;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

/**
 * Mengambil data spasial 68 kelurahan & titik fasilitas dari backend API (/api/areas, /api/facilities),
 * dengan fallback otomatis ke data lokal apabila backend sedang offline.
 */
export function useNutriMapData() {
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
    if (cachedSnapshot) return undefined;

    let active = true;
    loadSnapshotOnce()
      .then((snapshot) => {
        if (!active) return;
        setState({
          ...snapshot,
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
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
    };
  }, []);

  const kelurahanList = useMemo(() => {
    const parsed = extractKelurahanList(state.areasGeoJson);
    return parsed.length ? parsed : KELURAHAN_68_BOGOR;
  }, [state.areasGeoJson]);

  return {
    ...state,
    kelurahanList,
  };
}

/**
 * Mengambil hasil pemeringkatan SAW dari GET /api/rankings sesuai bobot kriteria,
 * dengan fallback lokal calculateSAW apabila API tidak tersedia.
 */
export function useSawRankings(weights, kelurahanList) {
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
