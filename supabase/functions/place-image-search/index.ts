type PlaceImageRequest = {
  destination?: string;
  title?: string;
  address?: string;
  amapKeyword?: string;
  type?: string;
  limit?: number;
  testOnly?: boolean;
  debug?: boolean;
};

type PlaceImageCandidate = {
  url: string;
  source: string;
  license?: string;
  creator?: string;
  pageUrl?: string;
  width?: number;
  height?: number;
  title?: string;
  verifiedAt?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function text(value: unknown) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeAddress(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).join("");
  return text(value);
}

function uniqueTexts(values: Array<unknown>) {
  const seen = new Set<string>();
  return values
    .map((value) => text(value))
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function clampLimit(value: unknown) {
  const parsed = Number(value || 4);
  if (!Number.isFinite(parsed)) return 4;
  return Math.min(Math.max(Math.round(parsed), 1), 8);
}

function queryTerms(request: PlaceImageRequest) {
  const destination = text(request.destination);
  const title = text(request.title);
  const address = text(request.address);
  const amapKeyword = text(request.amapKeyword);
  const type = text(request.type);
  return uniqueTexts([
    [destination, title, "实景"].filter(Boolean).join(" "),
    [amapKeyword, "景区 照片"].filter(Boolean).join(" "),
    [address, title].filter(Boolean).join(" "),
    [destination, title].filter(Boolean).join(" "),
    [title, type].filter(Boolean).join(" "),
    title,
    amapKeyword,
  ]);
}

function amapQueryTerms(request: PlaceImageRequest) {
  const destination = text(request.destination);
  const title = text(request.title);
  const address = text(request.address);
  const amapKeyword = text(request.amapKeyword);
  return uniqueTexts([
    amapKeyword,
    title,
    [destination, title].filter(Boolean).join(" "),
    [address, title].filter(Boolean).join(" "),
    address,
  ]);
}

function publicImageQueryTerms(request: PlaceImageRequest) {
  const destination = text(request.destination);
  const title = text(request.title);
  const address = text(request.address);
  const amapKeyword = text(request.amapKeyword);
  return uniqueTexts([
    [destination, title].filter(Boolean).join(" "),
    amapKeyword,
    [address, title].filter(Boolean).join(" "),
    title,
  ]);
}

function relevanceTokens(request: PlaceImageRequest) {
  const stopWords = new Set(["景区", "景点", "照片", "图片", "实景", "旅游", "公园", "风景区", "省", "市", "县", "区"]);
  const source = uniqueTexts([
    request.title,
    request.amapKeyword,
    request.address,
    request.destination,
  ]).join(" ");
  const tokens = source
    .split(/[\s,，/／·.-]+/)
    .flatMap((part) => {
      const value = text(part).replace(/[省市县区]$/g, "");
      if (!value || stopWords.has(value)) return [];
      const compact = value.replace(/(景区|风景区|旅游区|公园|博物馆|寺|寺院|广场|盐湖|湖)$/g, "");
      return uniqueTexts([value, compact]).filter((token) => token.length >= 2 && !stopWords.has(token));
    });
  return uniqueTexts(tokens).slice(0, 8);
}

function primaryRelevanceTokens(request: PlaceImageRequest) {
  const stopWords = new Set(["景区", "景点", "照片", "图片", "实景", "旅游", "公园", "风景区"]);
  const source = uniqueTexts([
    request.title,
    request.amapKeyword,
  ]).join(" ");
  const tokens = source
    .split(/[\s,，/／·.-]+/)
    .flatMap((part) => {
      const value = text(part).replace(/[省市县区]$/g, "");
      if (!value || stopWords.has(value)) return [];
      const compact = value.replace(/(国家重点风景名胜区|国家级自然保护区|景区|风景区|旅游区|公园|博物馆|寺|寺院|广场|盐湖|湖)$/g, "");
      return uniqueTexts([value, compact]).filter((token) => token.length >= 2 && !stopWords.has(token));
    });
  return uniqueTexts(tokens).slice(0, 6);
}

function isRelevantCandidate(candidate: PlaceImageCandidate, request: PlaceImageRequest) {
  const tokens = relevanceTokens(request);
  if (!tokens.length) return true;
  const haystack = text([candidate.title, candidate.pageUrl, candidate.creator].join(" ")).toLowerCase();
  return tokens.some((token) => haystack.includes(token.toLowerCase()));
}

function amapPoiPenalty(poi: Record<string, unknown>) {
  const haystack = text([poi.name, poi.type, poi.address].join(" "));
  if (/停车场|公交|地铁|客运站|火车站|机场|售票处|票务|服务中心|信息咨询|旅行社|住宅|小区|楼宇|大厦|宾馆|酒店|民宿|政府机关|公司|购物|餐饮|厕所|卫生间|出入口/.test(haystack)) {
    return 70;
  }
  return 0;
}

function amapPoiBonus(poi: Record<string, unknown>) {
  const haystack = text([poi.name, poi.type].join(" "));
  let score = 0;
  if (/风景名胜|国家级景点|省级景点|旅游景点|自然地名|湖泊|山|峡谷|沙漠|寺庙道观|文物古迹|博物馆|纪念馆|科技馆|展览馆|公园广场/.test(haystack)) score += 35;
  if (/国家级景点|省级景点|风景名胜;风景名胜/.test(haystack)) score += 15;
  if (Array.isArray(poi.photos) && poi.photos.length) score += Math.min(poi.photos.length, 3) * 5;
  return score;
}

function amapPoiScore(poi: Record<string, unknown>, request: PlaceImageRequest) {
  const tokens = primaryRelevanceTokens(request);
  if (!tokens.length) return amapPoiBonus(poi) - amapPoiPenalty(poi);
  const name = text(poi.name).toLowerCase();
  const haystack = text([
    poi.name,
    poi.address,
    poi.pname,
    poi.cityname,
    poi.adname,
    poi.type,
  ].join(" ")).toLowerCase();
  let score = amapPoiBonus(poi) - amapPoiPenalty(poi);
  let matched = false;
  for (const token of tokens) {
    const normalized = token.toLowerCase();
    if (!normalized) continue;
    if (name === normalized) {
      score += 90;
      matched = true;
    } else if (name.includes(normalized)) {
      score += 55;
      matched = true;
    } else if (haystack.includes(normalized)) {
      score += 20;
      matched = true;
    }
  }
  if (!matched) return Number.NEGATIVE_INFINITY;
  return score;
}

function isRelevantAmapPoi(poi: Record<string, unknown>, request: PlaceImageRequest) {
  return amapPoiScore(poi, request) > 0;
}

function isProbablyImageUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/\.svg(?:[?#]|$)/i.test(url)) return false;
  if (/maps\.google|baidu\.com|bing\.com/i.test(url)) return false;
  return true;
}

function normalizeImageUrl(value: unknown) {
  const url = text(value);
  if (url.startsWith("//")) return `https:${url}`;
  if (/^http:\/\//i.test(url)) return url.replace(/^http:/i, "https:");
  return url;
}

function normalizePhotos(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((photo) => {
      const record = photo as Record<string, unknown>;
      const url = normalizeImageUrl(record.url);
      if (!isProbablyImageUrl(url)) return null;
      return {
        url,
        source: "Amap POI",
        license: "Amap POI",
        creator: "",
        pageUrl: "",
        title: text(record.title),
      } satisfies PlaceImageCandidate;
    })
    .filter(Boolean) as PlaceImageCandidate[];
}

function normalizeAmapAddress(value: unknown) {
  const record = value as Record<string, unknown>;
  return normalizeAddress(record.address) || normalizeAddress(record.pname) + normalizeAddress(record.cityname) + normalizeAddress(record.adname);
}

async function searchAmap(request: PlaceImageRequest, limit: number) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) return { enabled: false, candidates: [] as PlaceImageCandidate[] };
  const endpoint = Deno.env.get("AMAP_PLACE_SEARCH_URL") || "https://restapi.amap.com/v3/place/text";
  const candidates: PlaceImageCandidate[] = [];
  const seen = new Set<string>();
  for (const keyword of amapQueryTerms(request).slice(0, 5)) {
    const query = new URLSearchParams({
      key,
      keywords: keyword,
      city: text(request.destination),
      citylimit: "false",
      offset: "8",
      page: "1",
      extensions: "all",
      output: "json",
    });
    try {
      const response = await fetch(`${endpoint}?${query.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || String(data.status) !== "1") continue;
      const pois = (Array.isArray(data.pois) ? data.pois : [])
        .map((poi: Record<string, unknown>) => ({
          poi,
          score: amapPoiScore(poi, request),
        }))
        .filter((item: { poi: Record<string, unknown>; score: number }) => item.score > 0)
        .sort((a: { score: number }, b: { score: number }) => b.score - a.score);
      for (const { poi: poiRecord } of pois) {
        const photos = normalizePhotos(poiRecord.photos);
        const poiName = text(poiRecord.name);
        const address = normalizeAmapAddress(poiRecord);
        for (const photo of photos) {
          const key = photo.url.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          candidates.push({
            ...photo,
            title: photo.title || poiName,
            pageUrl: photo.pageUrl || (poiName ? `https://uri.amap.com/search?keyword=${encodeURIComponent(`${address} ${poiName}`.trim())}` : ""),
          });
          if (candidates.length >= limit) return { enabled: true, candidates };
        }
      }
    } catch {
      // Try the next public source.
    }
  }
  return { enabled: true, candidates };
}

async function debugAmap(request: PlaceImageRequest) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) return { enabled: false, queries: [] };
  const endpoint = Deno.env.get("AMAP_PLACE_SEARCH_URL") || "https://restapi.amap.com/v3/place/text";
  const queries = [];
  for (const keyword of amapQueryTerms(request).slice(0, 5)) {
    const query = new URLSearchParams({
      key,
      keywords: keyword,
      city: text(request.destination),
      citylimit: "false",
      offset: "5",
      page: "1",
      extensions: "all",
      output: "json",
    });
    const response = await fetch(`${endpoint}?${query.toString()}`);
    const data = await response.json().catch(() => ({}));
    const pois = Array.isArray(data.pois) ? data.pois.slice(0, 5) : [];
    queries.push({
      keyword,
      ok: response.ok && String(data.status) === "1",
      info: text(data.info),
      pois: pois.map((poi: Record<string, unknown>) => ({
        name: text(poi.name),
        address: normalizeAmapAddress(poi),
        type: text(poi.type),
        photoCount: Array.isArray(poi.photos) ? poi.photos.length : 0,
        score: amapPoiScore(poi, request),
        relevant: isRelevantAmapPoi(poi, request),
      })),
    });
  }
  return { enabled: true, queries };
}

function commonsFilePage(title: string) {
  const normalized = title.startsWith("File:") ? title : `File:${title}`;
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(normalized).replace(/%2F/g, "/")}`;
}

function extMetaText(value: unknown) {
  const record = value as Record<string, unknown>;
  return text(record?.value).replace(/<[^>]+>/g, "").trim();
}

async function searchWikimedia(request: PlaceImageRequest, limit: number) {
  const results: PlaceImageCandidate[] = [];
  const seen = new Set<string>();
  for (const query of publicImageQueryTerms(request).slice(0, 4)) {
    const searchParams = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrnamespace: "6",
      gsrlimit: String(limit * 3),
      gsrsearch: query,
      prop: "imageinfo",
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: "1200",
    });
    try {
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?${searchParams.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) continue;
      const pages = Object.values((data.query?.pages || {}) as Record<string, any>);
      for (const page of pages) {
        const info = Array.isArray(page.imageinfo) ? page.imageinfo[0] : null;
        const url = text(info?.thumburl || info?.url);
        const mime = text(info?.mime);
        if (!url || (mime && !mime.startsWith("image/")) || !isProbablyImageUrl(url)) continue;
        const key = url.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const metadata = info?.extmetadata || {};
        const candidate = {
          url,
          source: "Wikimedia Commons",
          license: extMetaText(metadata.LicenseShortName) || extMetaText(metadata.UsageTerms),
          creator: extMetaText(metadata.Artist) || extMetaText(metadata.Credit),
          pageUrl: text(info?.descriptionurl) || commonsFilePage(text(page.title)),
          width: Number(info?.thumbwidth || info?.width || 0) || undefined,
          height: Number(info?.thumbheight || info?.height || 0) || undefined,
          title: text(page.title).replace(/^File:/i, ""),
        };
        if (!isRelevantCandidate(candidate, request)) continue;
        results.push(candidate);
        if (results.length >= limit) return results;
      }
    } catch {
      // Try next query/source.
    }
  }
  return results;
}

async function searchOpenverse(request: PlaceImageRequest, limit: number) {
  const results: PlaceImageCandidate[] = [];
  const seen = new Set<string>();
  for (const query of publicImageQueryTerms(request).slice(0, 3)) {
    const params = new URLSearchParams({
      q: query,
      page_size: String(Math.min(limit * 3, 20)),
      mature: "false",
    });
    try {
      const response = await fetch(`https://api.openverse.engineering/v1/images/?${params.toString()}`, {
        headers: { "User-Agent": "Tripboard place-image-search" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) continue;
      for (const item of Array.isArray(data.results) ? data.results : []) {
        const url = text(item.thumbnail || item.url);
        if (!isProbablyImageUrl(url)) continue;
        const key = url.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const candidate = {
          url,
          source: "Openverse",
          license: text([item.license, item.license_version].filter(Boolean).join(" ")),
          creator: text(item.creator),
          pageUrl: text(item.foreign_landing_url || item.url),
          width: Number(item.width || 0) || undefined,
          height: Number(item.height || 0) || undefined,
          title: text(item.title),
        };
        if (!isRelevantCandidate(candidate, request)) continue;
        results.push(candidate);
        if (results.length >= limit) return results;
      }
    } catch {
      // Try next query/source.
    }
  }
  return results;
}

async function verifyImage(candidate: PlaceImageCandidate, timeoutMs = 4500) {
  if (!isProbablyImageUrl(candidate.url)) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let usedGet = false;
    let response = await fetch(candidate.url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" },
    }).catch(() => null);
    if (!response || response.status === 405 || response.status === 403) {
      usedGet = true;
      response = await fetch(candidate.url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          Range: "bytes=0-8191",
        },
      }).catch(() => null);
    }
    if (!response || !response.ok) return null;
    const contentType = text(response.headers.get("content-type")).toLowerCase();
    if (contentType.includes("svg")) return null;
    if (contentType && !contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      if (/html|json|xml|text\//i.test(contentType)) return null;
    }
    const length = Number(response.headers.get("content-length") || 0);
    if (length && length < 4096) return null;
    if (!length || usedGet) {
      const reader = response.body?.getReader();
      if (reader) {
        let sampled = 0;
        while (sampled < 4096) {
          const { done, value } = await reader.read();
          if (done) break;
          sampled += value?.byteLength || 0;
        }
        reader.cancel().catch(() => {});
        if (sampled < 4096) return null;
      }
    }
    return {
      ...candidate,
      verifiedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function verifiedCandidates(rawCandidates: PlaceImageCandidate[], limit: number) {
  const results: PlaceImageCandidate[] = [];
  const seen = new Set<string>();
  for (const candidate of rawCandidates) {
    const key = text(candidate.url).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const verified = await verifyImage(candidate);
    if (!verified) continue;
    results.push(verified);
    if (results.length >= limit) break;
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  try {
    const request = (await req.json()) as PlaceImageRequest;
    const limit = clampLimit(request.limit);
    if (request.testOnly) {
      const amap = await searchAmap({ title: "塔尔寺", destination: "青海", amapKeyword: "西宁 塔尔寺", limit: 1 }, 3);
      const amapVerified = await verifiedCandidates(amap.candidates, 1);
      const commons = await searchWikimedia({ title: "Kumbum Monastery", destination: "Qinghai", limit: 1 }, 2);
      const openverse = await searchOpenverse({ title: "Qinghai Lake", destination: "Qinghai", limit: 1 }, 2);
      return jsonResponse({
        ok: true,
        source: "place-image-search",
        sources: {
          amap: { enabled: amap.enabled, count: amap.candidates.length, verified: amapVerified.length },
          wikimedia: { enabled: true, count: commons.length },
          openverse: { enabled: true, count: openverse.length },
        },
      });
    }
    if (!text(request.title) && !text(request.amapKeyword) && !text(request.address)) {
      return jsonResponse({ ok: false, error: "Missing title, amapKeyword or address." }, 400);
    }
    if (request.debug) {
      return jsonResponse({
        ok: true,
        source: "place-image-search",
        amap: await debugAmap(request),
        tokens: relevanceTokens(request),
        publicQueries: publicImageQueryTerms(request),
      });
    }

    const rawCandidates: PlaceImageCandidate[] = [];
    const amap = await searchAmap(request, limit * 2);
    rawCandidates.push(...amap.candidates);
    if (rawCandidates.length < limit * 2) rawCandidates.push(...await searchWikimedia(request, limit * 2));
    if (rawCandidates.length < limit * 2) rawCandidates.push(...await searchOpenverse(request, limit * 2));

    const candidates = await verifiedCandidates(rawCandidates, limit);
    return jsonResponse({
      ok: Boolean(candidates.length),
      image: candidates[0]?.url || "",
      candidates,
      source: candidates[0]?.source || "",
      license: candidates[0]?.license || "",
      creator: candidates[0]?.creator || "",
      pageUrl: candidates[0]?.pageUrl || "",
      verifiedAt: candidates[0]?.verifiedAt || "",
      message: candidates.length ? `Found ${candidates.length} verified image candidate(s).` : "No verified real photo candidate found.",
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "place-image-search",
        error: error instanceof Error ? error.message : "Unknown image search error",
      },
      400,
    );
  }
});
