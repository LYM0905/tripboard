type AmapPlaceRequest = {
  keyword?: string;
  city?: string;
  limit?: number;
  testOnly?: boolean;
};

type AmapPlace = {
  id: string;
  title: string;
  address: string;
  lng: string;
  lat: string;
  adcode?: string;
  city?: string;
  type?: string;
  image?: string;
  photos?: Array<{ title?: string; url: string }>;
  source: string;
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

function normalizeAddress(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).join("");
  return String(value || "");
}

function uniqueTexts(values: string[]) {
  const seen = new Set<string>();
  return values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function cityHint(keyword: string, city = "") {
  const text = `${keyword} ${city}`;
  const rules: Array<[RegExp, string]> = [
    [/兰州|甘肃省博物馆|黄河铁桥|中山桥|张掖路/, "兰州"],
    [/敦煌|莫高窟|鸣沙山|月牙泉|阳关|玉门关|雅丹/, "敦煌"],
    [/张掖|七彩丹霞|马蹄寺|平山湖/, "张掖"],
    [/嘉峪关|关城|悬壁长城/, "嘉峪关"],
    [/酒泉/, "酒泉"],
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  if (matched) return matched[1];
  return city;
}

function keywordVariants(keyword: string, city = "") {
  const value = String(keyword || "").replace(/\s+/g, " ").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return uniqueTexts([
    value,
    city && value.startsWith(city) ? value.slice(city.length).trim() : "",
    city ? value.replace(city, "").trim() : "",
    parts.length > 1 ? parts.at(-1) || "" : "",
    value.replace(/^(甘肃|甘肃省|兰州|兰州市|敦煌|敦煌市|张掖|张掖市|嘉峪关|嘉峪关市)\s*/, "").trim(),
  ]);
}

function normalizePhotos(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((photo) => {
      const record = photo as Record<string, unknown>;
      const url = String(record.url || "").trim();
      if (!url) return null;
      return {
        title: String(record.title || "").trim(),
        url,
      };
    })
    .filter(Boolean) as Array<{ title?: string; url: string }>;
}

function normalizePlace(poi: Record<string, any>): AmapPlace | null {
  const location = String(poi.location || "");
  const [lng = "", lat = ""] = location.split(",");
  if (!lng || !lat) return null;
  const photos = normalizePhotos(poi.photos);
  return {
    id: String(poi.id || ""),
    title: String(poi.name || ""),
    address: normalizeAddress(poi.address) || normalizeAddress(poi.pname) + normalizeAddress(poi.cityname) + normalizeAddress(poi.adname),
    lng,
    lat,
    adcode: String(poi.adcode || ""),
    city: normalizeAddress(poi.cityname),
    type: String(poi.type || ""),
    image: photos[0]?.url || "",
    photos,
    source: "高德 Web服务",
  };
}

async function searchAmapPlacesOnce(request: AmapPlaceRequest, keyword: string, city: string) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) {
    throw new Error("Missing AMAP_WEB_SERVICE_KEY in Supabase secrets.");
  }
  const endpoint = Deno.env.get("AMAP_PLACE_SEARCH_URL") || "https://restapi.amap.com/v3/place/text";
  const query = new URLSearchParams({
    key,
    keywords: keyword,
    city,
    citylimit: "false",
    offset: String(Math.min(Math.max(Number(request.limit || 8), 1), 20)),
    page: "1",
    extensions: "all",
    output: "json",
  });
  const response = await fetch(`${endpoint}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.info || data.error || `Amap HTTP ${response.status}`);
  }
  if (String(data.status) !== "1") {
    throw new Error(data.info || data.infocode || "Amap search failed.");
  }
  const places = (Array.isArray(data.pois) ? data.pois : [])
    .map((poi: Record<string, any>) => normalizePlace(poi))
    .filter(Boolean) as AmapPlace[];
  return places;
}

async function searchAmapPlaces(request: AmapPlaceRequest) {
  const keyword = String(request.keyword || "").trim();
  if (!keyword) {
    throw new Error("Missing keyword.");
  }
  const hintedCity = cityHint(keyword, String(request.city || "").trim());
  const cityCandidates = uniqueTexts([hintedCity, String(request.city || "").trim(), ""]);
  const variants = keywordVariants(keyword, hintedCity);
  const seen = new Set<string>();
  const collected: AmapPlace[] = [];
  let lastError = "";
  for (const variant of variants) {
    for (const city of cityCandidates) {
      try {
        const places = await searchAmapPlacesOnce(request, variant, city);
        for (const place of places) {
          const key = place.id || `${place.title}:${place.lng}:${place.lat}`;
          if (seen.has(key)) continue;
          seen.add(key);
          collected.push(place);
        }
        if (collected.length >= Number(request.limit || 8)) return collected.slice(0, Number(request.limit || 8));
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Amap search failed.";
      }
    }
  }
  if (collected.length) return collected;
  if (lastError) throw new Error(lastError);
  return [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const request = (await req.json()) as AmapPlaceRequest;
    if (request.testOnly) {
      const hasKey = Boolean(Deno.env.get("AMAP_WEB_SERVICE_KEY"));
      return jsonResponse({
        ok: hasKey,
        source: "amap-place-search",
        message: hasKey
          ? "Amap Web Service key is configured."
          : "Amap place proxy is deployed, but AMAP_WEB_SERVICE_KEY is not configured yet.",
      });
    }
    const places = await searchAmapPlaces(request);
    return jsonResponse({
      ok: true,
      source: "amap-place-search",
      places,
      place: places[0] || null,
      message: places.length ? `Found ${places.length} Amap places.` : "Amap returned no matching place.",
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "amap-place-search",
        error: error instanceof Error ? error.message : "Unknown Amap error",
      },
      400,
    );
  }
});
