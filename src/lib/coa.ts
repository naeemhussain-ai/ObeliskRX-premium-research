import coaRt20Page1 from "@/assets/certificates/COART20_page-1.jpg";
import coaRt20Page2 from "@/assets/certificates/COART20_page-2.jpg";
import coaNad1000 from "@/assets/certificates/COANAD1000.jpg";

export type CoaEntry = {
  purity: string;
  lot: string;
  tested: string;
  images: string[];
  fileTypes?: string[];
};

export type AdminCoaFile = {
  name: string;
  type: string;
  data: string; // base64
};

export type AdminCoaEntry = {
  slug: string;
  purity: string;
  lot: string;
  tested: string;
  files: AdminCoaFile[];
};

const ADMIN_COA_KEY = "obeliskrx-admin-coa";
const API_COA_KEY   = "obeliskrx-api-coa";
const API = import.meta.env.VITE_API_URL ?? "http://localhost/obeliskrx/backend/api";

// Static fallback COA data (bundled images)
export const coaData: Record<string, CoaEntry> = {
  "3r-peptide": { purity: "99.93%", lot: "RT20", tested: "Jul 30, 2026", images: [coaRt20Page1, coaRt20Page2] },
  nad: { purity: "99.86%", lot: "01", tested: "Jun 30, 2026", images: [coaNad1000] },
};

// React-admin (localStorage) COA helpers
export function getAdminCoaData(): Record<string, AdminCoaEntry> {
  try {
    const raw = localStorage.getItem(ADMIN_COA_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AdminCoaEntry>) : {};
  } catch {
    return {};
  }
}

export function saveAdminCoa(entry: AdminCoaEntry): void {
  const data = getAdminCoaData();
  data[entry.slug] = entry;
  localStorage.setItem(ADMIN_COA_KEY, JSON.stringify(data));
}

export function deleteAdminCoa(slug: string): void {
  const data = getAdminCoaData();
  delete data[slug];
  localStorage.setItem(ADMIN_COA_KEY, JSON.stringify(data));
}

// API COA cache helpers
type ApiCoaCache = Record<string, { purity: string; lot: string; tested: string; files: { url: string; type: string }[] }>;

function getApiCoaCache(): ApiCoaCache {
  try {
    const raw = localStorage.getItem(API_COA_KEY);
    return raw ? (JSON.parse(raw) as ApiCoaCache) : {};
  } catch {
    return {};
  }
}

export async function syncCoaFromAPI(): Promise<void> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/coa/`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const json = (await res.json()) as { data?: { coa: ApiCoaCache }; coa?: ApiCoaCache };
    const coa = json.data?.coa ?? (json as any).coa;
    if (coa && typeof coa === "object") {
      localStorage.setItem(API_COA_KEY, JSON.stringify(coa));
    }
  } catch {
    // Server unreachable   cache/static fallback use hoga
  }
}

// Priority: API cache → React admin localStorage → static bundled data
export const getCoa = (slug: string): CoaEntry | undefined => {
  // 1. Check API-synced data (PHP admin uploads)
  const apiCache = getApiCoaCache();
  if (apiCache[slug] && (apiCache[slug].purity || apiCache[slug].lot || apiCache[slug].tested || (apiCache[slug].files?.length ?? 0) > 0)) {
    const e = apiCache[slug];
    return {
      purity: e.purity,
      lot: e.lot,
      tested: e.tested,
      images: (e.files ?? []).map((f) => f.url),
      fileTypes: (e.files ?? []).map((f) => f.type),
    };
  }

  // 2. Check React admin localStorage uploads
  const adminData = getAdminCoaData();
  if (adminData[slug]) {
    const e = adminData[slug];
    return {
      purity: e.purity,
      lot: e.lot,
      tested: e.tested,
      images: e.files.map((f) => `data:${f.type};base64,${f.data}`),
      fileTypes: e.files.map((f) => f.type),
    };
  }

  // 3. Static bundled fallback
  return coaData[slug];
};
