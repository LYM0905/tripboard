type TransportRequest = {
  date?: string;
  from?: string;
  to?: string;
  type?: "all" | "flight" | "train";
  startTime?: string;
  endTime?: string;
  adults?: number;
  testOnly?: boolean;
};

type TransportItem = {
  type: "flight";
  code: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: number;
  price: number;
  source: string;
  carrier?: string;
  stops?: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const cityAirportCodes: Record<string, string> = {
  北京: "BJS",
  上海: "SHA",
  广州: "CAN",
  深圳: "SZX",
  成都: "CTU",
  重庆: "CKG",
  杭州: "HGH",
  南京: "NKG",
  青岛: "TAO",
  厦门: "XMN",
  福州: "FOC",
  武汉: "WUH",
  长沙: "CSX",
  郑州: "CGO",
  西安: "XIY",
  昆明: "KMG",
  兰州: "LHW",
  甘肃: "LHW",
  西宁: "XNN",
  青海: "XNN",
  银川: "INC",
  乌鲁木齐: "URC",
  拉萨: "LXA",
  哈尔滨: "HRB",
  长春: "CGQ",
  沈阳: "SHE",
  大连: "DLC",
  天津: "TSN",
  济南: "TNA",
  太原: "TYN",
  呼和浩特: "HET",
  合肥: "HFE",
  南昌: "KHN",
  南宁: "NNG",
  桂林: "KWL",
  海口: "HAK",
  三亚: "SYX",
  贵阳: "KWE",
  丽江: "LJG",
  大理: "DLU",
  宁波: "NGB",
  温州: "WNZ",
  苏州: "SHA",
  无锡: "WUX",
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

function timeToMinutes(value = "") {
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function clockFromIso(value = "") {
  const match = value.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value.slice(0, 5) || "09:00";
}

function parseIsoDurationMinutes(value = "") {
  const match = value.match(/P(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return Number(match[1] || 0) * 60 + Number(match[2] || 0);
}

function resolveIata(input = "") {
  const value = input.trim();
  const embeddedCode = value.match(/\b[A-Z]{3}\b/i)?.[0]?.toUpperCase();
  if (embeddedCode) return embeddedCode;
  const normalized = value.replace(/[市省自治区特别行政区\s]/g, "");
  for (const [city, code] of Object.entries(cityAirportCodes)) {
    if (normalized.includes(city)) return code;
  }
  return "";
}

async function getAmadeusToken(baseUrl: string, clientId: string, clientSecret: string) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error_description || data.error || `Amadeus token HTTP ${response.status}`);
  }
  if (!data.access_token) {
    throw new Error("Amadeus did not return an access token.");
  }
  return String(data.access_token);
}

function normalizeOffer(offer: Record<string, any>, request: TransportRequest, index: number, dictionaries: Record<string, any>): TransportItem | null {
  const itinerary = offer.itineraries?.[0];
  const segments = Array.isArray(itinerary?.segments) ? itinerary.segments : [];
  if (!segments.length) return null;
  const first = segments[0];
  const last = segments[segments.length - 1];
  const carrierCode = String(first.carrierCode || "");
  const carrierName = dictionaries?.carriers?.[carrierCode] || carrierCode;
  const depart = clockFromIso(String(first.departure?.at || ""));
  const arrive = clockFromIso(String(last.arrival?.at || ""));
  const duration = parseIsoDurationMinutes(String(itinerary.duration || "")) || Math.max(0, (timeToMinutes(arrive) ?? 0) - (timeToMinutes(depart) ?? 0));
  const total = Number(offer.price?.grandTotal || offer.price?.total || 0);
  const code = segments
    .map((segment: Record<string, any>) => `${segment.carrierCode || ""}${segment.number || ""}`)
    .filter(Boolean)
    .join(" + ");

  return {
    type: "flight",
    code: code || `AM-${index + 1}`,
    from: request.from || String(first.departure?.iataCode || ""),
    to: request.to || String(last.arrival?.iataCode || ""),
    depart,
    arrive,
    duration,
    price: Math.round(total),
    source: baseUrlLabel(),
    carrier: carrierName,
    stops: Math.max(0, segments.length - 1),
  };
}

function baseUrlLabel() {
  const baseUrl = Deno.env.get("AMADEUS_BASE_URL") || "https://test.api.amadeus.com";
  return baseUrl.includes("test.api") ? "Amadeus 测试" : "Amadeus";
}

function filterByTime(items: TransportItem[], request: TransportRequest) {
  const start = timeToMinutes(request.startTime || "");
  const end = timeToMinutes(request.endTime || "");
  return items.filter((item) => {
    const depart = timeToMinutes(item.depart) ?? 0;
    if (start !== null && depart < start) return false;
    if (end !== null && depart > end) return false;
    return true;
  });
}

async function searchFlightOffers(request: TransportRequest) {
  if (request.type === "train") return [];
  const clientId = Deno.env.get("AMADEUS_CLIENT_ID");
  const clientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");
  const baseUrl = Deno.env.get("AMADEUS_BASE_URL") || "https://test.api.amadeus.com";
  if (!clientId || !clientSecret) {
    throw new Error("Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET in Supabase secrets.");
  }
  if (!request.date) {
    throw new Error("Missing travel date.");
  }
  const originLocationCode = resolveIata(request.from || "");
  const destinationLocationCode = resolveIata(request.to || "");
  if (!originLocationCode || !destinationLocationCode) {
    throw new Error("Missing IATA airport/city code. Try entering values like 上海 SHA or 兰州 LHW.");
  }

  const token = await getAmadeusToken(baseUrl, clientId, clientSecret);
  const query = new URLSearchParams({
    originLocationCode,
    destinationLocationCode,
    departureDate: request.date,
    adults: String(Math.max(1, Number(request.adults || 1))),
    currencyCode: "CNY",
    max: "20",
  });
  const response = await fetch(`${baseUrl}/v2/shopping/flight-offers?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(data.errors) ? data.errors.map((error: Record<string, unknown>) => error.detail || error.title).filter(Boolean).join("; ") : "";
    throw new Error(detail || data.error_description || data.error || `Amadeus flight offers HTTP ${response.status}`);
  }
  const items = (Array.isArray(data.data) ? data.data : [])
    .map((offer: Record<string, any>, index: number) => normalizeOffer(offer, request, index, data.dictionaries || {}))
    .filter(Boolean) as TransportItem[];
  return filterByTime(items, request);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const request = (await req.json()) as TransportRequest;
    if (request.testOnly) {
      const hasClientId = Boolean(Deno.env.get("AMADEUS_CLIENT_ID"));
      const hasClientSecret = Boolean(Deno.env.get("AMADEUS_CLIENT_SECRET"));
      return jsonResponse({
        ok: hasClientId && hasClientSecret,
        source: "amadeus",
        message: hasClientId && hasClientSecret
          ? "Amadeus secrets are configured. You can sync flight offers."
          : "Amadeus endpoint is deployed, but Supabase secrets are not configured yet.",
      });
    }

    const items = await searchFlightOffers(request);
    return jsonResponse({
      ok: true,
      source: "amadeus",
      items,
      message: items.length ? `Synced ${items.length} Amadeus flight offers.` : "Amadeus returned no matching flight offers for this date and route.",
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "amadeus",
        error: error instanceof Error ? error.message : "Unknown Amadeus error",
      },
      400,
    );
  }
});
