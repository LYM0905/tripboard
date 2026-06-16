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
  type: "flight" | "train";
  code: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: number;
  price: number;
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

function timeToMinutes(value = "") {
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function addMinutes(time: string, minutes: number) {
  const base = timeToMinutes(time) ?? 0;
  const next = (base + minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
}

function stableNumber(input: string) {
  return Array.from(input).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function buildDemoItems(request: TransportRequest): TransportItem[] {
  const from = request.from || "出发城市";
  const to = request.to || "目的地";
  const seed = stableNumber(`${request.date || ""}-${from}-${to}`);
  const flights = ["08:15", "10:40", "14:20", "18:05"].map((depart, index) => ({
    type: "flight" as const,
    code: `MU${1200 + ((seed + index * 57) % 800)}`,
    from,
    to,
    depart,
    arrive: addMinutes(depart, 120 + ((seed + index * 23) % 70)),
    duration: 120 + ((seed + index * 23) % 70),
    price: 620 + ((seed + index * 91) % 520),
    source: "代理示例",
  }));
  const trains = ["07:12", "09:35", "13:48", "17:22"].map((depart, index) => ({
    type: "train" as const,
    code: `${index % 2 ? "D" : "G"}${240 + ((seed + index * 37) % 700)}`,
    from,
    to,
    depart,
    arrive: addMinutes(depart, 180 + ((seed + index * 31) % 120)),
    duration: 180 + ((seed + index * 31) % 120),
    price: 220 + ((seed + index * 46) % 260),
    source: "代理示例",
  }));
  const allItems = [...flights, ...trains];
  const typedItems = request.type && request.type !== "all" ? allItems.filter((item) => item.type === request.type) : allItems;
  const start = timeToMinutes(request.startTime || "");
  const end = timeToMinutes(request.endTime || "");
  return typedItems.filter((item) => {
    const depart = timeToMinutes(item.depart) ?? 0;
    if (start !== null && depart < start) return false;
    if (end !== null && depart > end) return false;
    return true;
  });
}

async function requestTripComTransport(request: TransportRequest): Promise<TransportItem[] | null> {
  const appKey = Deno.env.get("TRIPCOM_APP_KEY");
  const appSecret = Deno.env.get("TRIPCOM_APP_SECRET");
  const apiEndpoint = Deno.env.get("TRIPCOM_TRANSPORT_API_URL");

  if (!appKey || !appSecret || !apiEndpoint) {
    return null;
  }

  // Replace this block with the exact signed request required by the product
  // you open in Trip.com/Ctrip. Different products use different payloads.
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tripboard-App-Key": appKey,
    },
    body: JSON.stringify({
      date: request.date,
      from: request.from,
      to: request.to,
      type: request.type || "all",
      startTime: request.startTime || "",
      endTime: request.endTime || "",
      // Do not send appSecret directly unless the official API requires it.
      // Usually it is used to create a signature on the server.
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Trip.com API HTTP ${response.status}`);
  }

  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
  return items.map((item: Record<string, unknown>, index: number) => ({
    type: item.type === "train" ? "train" : "flight",
    code: String(item.code || item.flightNo || item.trainNo || `TRIP-${index + 1}`),
    from: String(item.from || request.from || "出发城市"),
    to: String(item.to || request.to || "目的地"),
    depart: String(item.depart || item.departTime || item.startTime || "09:00"),
    arrive: String(item.arrive || item.arriveTime || item.endTime || "11:00"),
    duration: Number(item.duration || 120),
    price: Number(item.price || item.amount || item.lowestPrice || 0),
    source: String(item.source || "携程"),
  }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const request = (await req.json()) as TransportRequest;
    if (request.testOnly) {
      return jsonResponse({
        ok: true,
        message: "后端代理连接成功。已准备接收 Tripboard 交通同步请求。",
      });
    }

    const tripComItems = await requestTripComTransport(request);
    const items = tripComItems?.length ? tripComItems : buildDemoItems(request);
    return jsonResponse({
      ok: true,
      source: tripComItems?.length ? "trip.com" : "demo",
      items,
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
