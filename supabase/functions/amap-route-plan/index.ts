type AmapStop = {
  index?: number;
  title?: string;
  address?: string;
  amapKeyword?: string;
  lng?: string;
  lat?: string;
};

type AmapRouteRequest = {
  mode?: "walking" | "driving" | "transit";
  city?: string;
  destination?: string;
  stops?: AmapStop[];
  testOnly?: boolean;
};

type ResolvedStop = Required<Pick<AmapStop, "title" | "lng" | "lat">> & {
  index: number;
  address?: string;
  amapKeyword?: string;
};

type RouteLeg = {
  from: string;
  to: string;
  distance: number;
  duration: number;
  cost?: number;
  instruction?: string;
  path?: number[][];
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

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function normalizeAddress(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).join("");
  return cleanText(value);
}

function asNumber(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function coordinate(stop: Pick<ResolvedStop, "lng" | "lat">) {
  return `${stop.lng},${stop.lat}`;
}

function validCoordinate(lng?: string, lat?: string) {
  const x = Number(lng);
  const y = Number(lat);
  return Boolean(lng && lat && Number.isFinite(x) && Number.isFinite(y));
}

function firstInstruction(steps: unknown) {
  if (!Array.isArray(steps)) return "";
  return steps
    .map((step) => cleanText((step as Record<string, unknown>).instruction))
    .filter(Boolean)
    .slice(0, 3)
    .join("；");
}

function parsePolyline(polyline: unknown) {
  return cleanText(polyline)
    .split(";")
    .map((point) => point.split(",").map((value) => Number(value)))
    .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat));
}

function pathFromSteps(steps: unknown) {
  if (!Array.isArray(steps)) return [];
  const path: number[][] = [];
  steps.forEach((step) => {
    const stepPath = parsePolyline((step as Record<string, unknown>).polyline);
    stepPath.forEach((point) => path.push(point));
  });
  return path;
}

function transitInstruction(transit: Record<string, unknown>) {
  const segments = Array.isArray(transit.segments) ? transit.segments : [];
  const names = segments
    .map((segment) => {
      const bus = (segment as Record<string, unknown>).bus as Record<string, unknown> | undefined;
      const buslines = Array.isArray(bus?.buslines) ? bus?.buslines : [];
      const first = buslines[0] as Record<string, unknown> | undefined;
      const name = cleanText(first?.name);
      const walking = (segment as Record<string, unknown>).walking as Record<string, unknown> | undefined;
      const walkDistance = asNumber(walking?.distance);
      if (name) return name;
      if (walkDistance) return `步行 ${Math.round(walkDistance)} 米`;
      return "";
    })
    .filter(Boolean)
    .slice(0, 5);
  return names.join(" → ");
}

function pathFromTransit(transit: Record<string, unknown>) {
  const segments = Array.isArray(transit.segments) ? transit.segments : [];
  const path: number[][] = [];
  segments.forEach((segment) => {
    const record = segment as Record<string, unknown>;
    const walking = record.walking as Record<string, unknown> | undefined;
    pathFromSteps(walking?.steps).forEach((point) => path.push(point));
    const bus = record.bus as Record<string, unknown> | undefined;
    const buslines = Array.isArray(bus?.buslines) ? bus.buslines : [];
    buslines.forEach((line) => {
      parsePolyline((line as Record<string, unknown>).polyline).forEach((point) => path.push(point));
    });
  });
  return path;
}

async function searchPlace(key: string, stop: AmapStop, city = ""): Promise<ResolvedStop | null> {
  const keyword = cleanText(stop.amapKeyword) || cleanText(stop.address) || cleanText(stop.title);
  if (!keyword) return null;
  const endpoint = Deno.env.get("AMAP_PLACE_SEARCH_URL") || "https://restapi.amap.com/v3/place/text";
  const query = new URLSearchParams({
    key,
    keywords: keyword,
    city,
    citylimit: "false",
    offset: "1",
    page: "1",
    extensions: "base",
    output: "json",
  });
  const response = await fetch(`${endpoint}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || String(data.status) !== "1") return null;
  const poi = Array.isArray(data.pois) ? data.pois[0] : null;
  const location = cleanText(poi?.location);
  const [lng = "", lat = ""] = location.split(",");
  if (!validCoordinate(lng, lat)) return null;
  return {
    index: Number(stop.index || 0),
    title: cleanText(stop.title) || cleanText(poi?.name) || keyword,
    address: normalizeAddress(poi?.address) || normalizeAddress(poi?.pname) + normalizeAddress(poi?.cityname) + normalizeAddress(poi?.adname),
    amapKeyword: keyword,
    lng,
    lat,
  };
}

async function resolveStops(key: string, request: AmapRouteRequest) {
  const warnings: string[] = [];
  const city = cleanText(request.city || request.destination);
  const rawStops = Array.isArray(request.stops) ? request.stops.slice(0, 12) : [];
  const resolved: ResolvedStop[] = [];
  for (const [position, rawStop] of rawStops.entries()) {
    const index = Number(rawStop.index ?? position);
    const title = cleanText(rawStop.title) || `地点${position + 1}`;
    const lng = cleanText(rawStop.lng);
    const lat = cleanText(rawStop.lat);
    if (validCoordinate(lng, lat)) {
      resolved.push({
        index,
        title,
        address: cleanText(rawStop.address),
        amapKeyword: cleanText(rawStop.amapKeyword),
        lng,
        lat,
      });
      continue;
    }
    const found = await searchPlace(key, { ...rawStop, index, title }, city);
    if (found) {
      resolved.push(found);
    } else {
      warnings.push(`${title} 没有经纬度，且高德未搜索到匹配地点。`);
    }
  }
  return { resolved, warnings };
}

async function routeWalkingOrDriving(key: string, mode: "walking" | "driving", from: ResolvedStop, to: ResolvedStop): Promise<RouteLeg> {
  const endpoint =
    mode === "walking"
      ? Deno.env.get("AMAP_WALKING_ROUTE_URL") || "https://restapi.amap.com/v3/direction/walking"
      : Deno.env.get("AMAP_DRIVING_ROUTE_URL") || "https://restapi.amap.com/v3/direction/driving";
  const query = new URLSearchParams({
    key,
    origin: coordinate(from),
    destination: coordinate(to),
    output: "json",
    extensions: mode === "driving" ? "base" : "base",
  });
  const response = await fetch(`${endpoint}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || String(data.status) !== "1") {
    throw new Error(data.info || data.infocode || `Amap ${mode} route failed.`);
  }
  const path = Array.isArray(data.route?.paths) ? data.route.paths[0] : null;
  if (!path) throw new Error(`Amap returned no ${mode} route.`);
  return {
    from: from.title,
    to: to.title,
    distance: asNumber(path.distance),
    duration: asNumber(path.duration),
    cost: asNumber(path.tolls),
    instruction: firstInstruction(path.steps),
    path: pathFromSteps(path.steps),
  };
}

async function routeTransit(key: string, city: string, from: ResolvedStop, to: ResolvedStop): Promise<RouteLeg> {
  const endpoint = Deno.env.get("AMAP_TRANSIT_ROUTE_URL") || "https://restapi.amap.com/v3/direction/transit/integrated";
  const query = new URLSearchParams({
    key,
    origin: coordinate(from),
    destination: coordinate(to),
    city,
    cityd: city,
    output: "json",
    strategy: "0",
  });
  const response = await fetch(`${endpoint}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || String(data.status) !== "1") {
    throw new Error(data.info || data.infocode || "Amap transit route failed.");
  }
  const transit = Array.isArray(data.route?.transits) ? data.route.transits[0] : null;
  if (!transit) throw new Error("Amap returned no transit route.");
  return {
    from: from.title,
    to: to.title,
    distance: asNumber(transit.distance),
    duration: asNumber(transit.duration),
    cost: asNumber(transit.cost),
    instruction: transitInstruction(transit),
    path: pathFromTransit(transit),
  };
}

async function planRoute(request: AmapRouteRequest) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) throw new Error("Missing AMAP_WEB_SERVICE_KEY in Supabase secrets.");
  const mode = ["walking", "driving", "transit"].includes(cleanText(request.mode)) ? (request.mode as "walking" | "driving" | "transit") : "walking";
  const city = cleanText(request.city || request.destination);
  const { resolved, warnings } = await resolveStops(key, request);
  if (resolved.length < 2) {
    throw new Error("至少需要 2 个可定位地点才能规划路线。");
  }
  if (mode === "transit" && !city) {
    warnings.push("公交/地铁路线通常需要城市名；未提供城市时可能无法返回结果。");
  }

  const legs: RouteLeg[] = [];
  for (let index = 0; index < resolved.length - 1; index += 1) {
    const from = resolved[index];
    const to = resolved[index + 1];
    const leg = mode === "transit" ? await routeTransit(key, city, from, to) : await routeWalkingOrDriving(key, mode, from, to);
    legs.push(leg);
  }
  return {
    mode,
    stops: resolved,
    legs,
    distance: legs.reduce((sum, leg) => sum + leg.distance, 0),
    duration: legs.reduce((sum, leg) => sum + leg.duration, 0),
    warnings,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const request = (await req.json()) as AmapRouteRequest;
    if (request.testOnly) {
      const hasKey = Boolean(Deno.env.get("AMAP_WEB_SERVICE_KEY"));
      return jsonResponse({
        ok: hasKey,
        source: "amap-route-plan",
        message: hasKey
          ? "Amap Web Service key is configured for route planning."
          : "Amap route proxy is deployed, but AMAP_WEB_SERVICE_KEY is not configured yet.",
      });
    }
    const result = await planRoute(request);
    return jsonResponse({
      ok: true,
      source: "高德路线规划",
      ...result,
      message: `Planned ${result.legs.length} route legs with Amap.`,
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "amap-route-plan",
        error: error instanceof Error ? error.message : "Unknown Amap route error",
      },
      400,
    );
  }
});
