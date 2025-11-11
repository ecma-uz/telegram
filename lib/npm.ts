export type NpmSearchItem = {
  name: string;
  version: string;
  description?: string;
  npmUrl: string;
  repoUrl?: string;
  homeUrl?: string;
};

interface NpmsSearchResponse {
  total: number;
  results: Array<{
    package: {
      name: string;
      version: string;
      description?: string;
      date?: string;
      links: { npm: string; homepage?: string; repository?: string };
    };
    score: { final: number };
    searchScore: number;
  }>;
}

const PAGE_SIZE = 10;
const DOWNLOADS_BASE = "https://api.npmjs.org/downloads/point/last-week/";
const TYPES_REGISTRY = "https://registry.npmjs.org/@types%2F";

type CacheV<T> = { v: T; ts: number };
const CACHE_MS = 30_000;
const searchCache = new Map<string, CacheV<NpmsSearchResponse>>();
const downloadsCache = new Map<string, CacheV<number>>();
const typesCache = new Map<string, CacheV<boolean>>();

function getCached<T>(m: Map<string, CacheV<T>>, k: string): T | undefined {
  const c = m.get(k);
  if (c && Date.now() - c.ts < CACHE_MS) return c.v;
}
function setCached<T>(m: Map<string, CacheV<T>>, k: string, v: T) {
  m.set(k, { v, ts: Date.now() });
}

export async function searchNpms(query: string, from = 0) {
  const key = `${query}:${from}`;
  const cached = getCached(searchCache, key);
  if (cached) return cached;

  const url = `https://api.npms.io/v2/search?size=${PAGE_SIZE}&from=${from}&q=${
    encodeURIComponent(query)
  }`;
  const r = await fetch(url, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`npms ${r.status}`);
  const data = (await r.json()) as NpmsSearchResponse;
  setCached(searchCache, key, data);
  return data;
}

export async function fetchDownloads(
  name: string,
): Promise<number | undefined> {
  const c = getCached(downloadsCache, name);
  if (c != null) return c;

  try {
    const url = `${DOWNLOADS_BASE}${encodeURIComponent(name)}`;
    const r = await fetch(url, { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const j = await r.json();
    const n = Number(j.downloads);
    setCached(downloadsCache, name, n);
    return n;
  } catch {
    return;
  }
}

export async function hasTypes(name: string): Promise<boolean> {
  const c = getCached(typesCache, name);
  if (c != null) return c;

  try {
    const url = `${TYPES_REGISTRY}${encodeURIComponent(name)}`;
    const r = await fetch(url, { method: "GET" });
    const ok = r.ok;
    setCached(typesCache, name, ok);
    return ok;
  } catch {
    return false;
  }
}

export function getPackageLogo(packageName: string): string {
  return `https://img.shields.io/npm/v/${
    encodeURIComponent(packageName)
  }.png?style=flat-square&logo=npm&logoColor=white`;
}

export function mapItem(
  x: NpmsSearchResponse["results"][number],
): NpmSearchItem {
  const p = x.package;
  return {
    name: p.name,
    version: p.version,
    description: p.description,
    npmUrl: p.links.npm,
    repoUrl: p.links.repository,
    homeUrl: p.links.homepage,
  };
}
