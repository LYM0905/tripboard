type TransportRequest = {
  date?: string;
  from?: string;
  to?: string;
  type?: "all" | "flight" | "train";
  startTime?: string;
  endTime?: string;
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
  北京: "PEK,PKX",
  上海: "SHA,PVG",
  广州: "CAN",
  深圳: "SZX",
  成都: "CTU,TFU",
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
  苏州: "SHA,PVG,WUX",
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

function resolveAirportId(input = "") {
  const value = input.trim();
  const explicitCodes = value.match(/\b[A-Z]{3}\b/gi)?.map((code) => code.toUpperCase());
  if (explicitCodes?.length) return explicitCodes.join(",");
  const normalized = value.replace(/[市省自治区特别行政区\s]/g, "");
  for (const [city, code] of Object.entries(cityAirportCodes)) {
    if (normalized.includes(city)) return code;
  }
  return "";
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

function normalizeOffer(offer: Record<string, any>, request: TransportRequest, index: number): TransportItem | null {
  const flights = Array.isArray(offer.flights) ? offer.flights : [];
  if (!flights.length) return null;
  const first = flights[0];
  const last = flights[flights.length - 1];
  const depart = String(first.departure_airport?.time || "09:00").slice(0, 5);
  const arrive = String(last.arrival_airport?.time || "11:00").slice(0, 5);
  const code = flights
    .map((flight: Record<string, any>) => String(flight.flight_number || "").trim())
    .filter(Boolean)
    .join(" + ");
  const carriers = Array.from(new Set(flights.map((flight: Record<string, any>) => flight.airline).filter(Boolean)));
  return {
    type: "flight",
    code: code || `GF-${index + 1}`,
    from: request.from || String(first.departure_airport?.id || ""),
    to: request.to || String(last.arrival_airport?.id || ""),
    depart,
    arrive,
    duration: Number(offer.total_duration || first.duration || 0),
    price: Math.round(Number(offer.price || 0)),
    source: "Google Flights / SearchApi",
    carrier: carriers.join(" / "),
    stops: Math.max(0, flights.length - 1),
  };
}

async function searchFlightOffers(request: TransportRequest) {
  if (request.type === "train") return [];
  const apiKey = Deno.env.get("SEARCHAPI_API_KEY");
  if (!apiKey) {
    throw new Error("Missing SEARCHAPI_API_KEY in Supabase secrets.");
  }
  if (!request.date) {
    throw new Error("Missing travel date.");
  }
  const departureId = resolveAirportId(request.from || "");
  const arrivalId = resolveAirportId(request.to || "");
  if (!departureId || !arrivalId) {
    throw new Error("Missing airport code. Try entering values like 上海 SHA or 兰州 LHW.");
  }

  const endpoint = Deno.env.get("SEARCHAPI_BASE_URL") || "https://www.searchapi.io/api/v1/search";
  const query = new URLSearchParams({
    engine: "google_flights",
    flight_type: "one_way",
    departure_id: departureId,
    arrival_id: arrivalId,
    outbound_date: request.date,
    currency: "CNY",
    gl: "cn",
    hl: "zh-cn",
  });
  const response = await fetch(`${endpoint}?${query.toString()}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `SearchApi HTTP ${response.status}`);
  }

  const offers = [
    ...(Array.isArray(data.best_flights) ? data.best_flights : []),
    ...(Array.isArray(data.other_flights) ? data.other_flights : []),
  ];
  const items = offers
    .map((offer: Record<string, any>, index: number) => normalizeOffer(offer, request, index))
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
      const hasApiKey = Boolean(Deno.env.get("SEARCHAPI_API_KEY"));
      return jsonResponse({
        ok: hasApiKey,
        source: "searchapi-google-flights",
        message: hasApiKey
          ? "SearchApi key is configured. You can sync Google Flights offers."
          : "SearchApi endpoint is deployed, but SEARCHAPI_API_KEY is not configured yet.",
      });
    }

    const items = await searchFlightOffers(request);
    return jsonResponse({
      ok: true,
      source: "searchapi-google-flights",
      items,
      message: items.length ? `Synced ${items.length} Google Flights offers.` : "SearchApi returned no matching flight offers for this route and date.",
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "searchapi-google-flights",
        error: error instanceof Error ? error.message : "Unknown SearchApi error",
      },
      400,
    );
  }
});
