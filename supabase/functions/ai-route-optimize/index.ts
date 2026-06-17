type Stop = {
  id?: string;
  index?: number;
  title?: string;
  time?: string;
  type?: string;
  address?: string;
  note?: string;
  lng?: number | string;
  lat?: number | string;
  budget?: number;
  weather?: string;
  tags?: string[];
};

type RouteRequest = {
  tripId?: string;
  day?: string;
  date?: string;
  dayTitle?: string;
  pace?: string;
  budgetLimit?: number;
  weather?: string;
  destination?: string;
  origin?: string;
  stops?: Stop[];
  testOnly?: boolean;
};

type RouteSegment = {
  from?: string;
  to?: string;
  transport?: string;
  minutes?: number;
  note?: string;
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

function localDistanceSort(stops: Stop[]) {
  const parsed = stops.map((stop, index) => ({
    ...stop,
    index: stop.index ?? index,
    latNumber: Number(stop.lat),
    lngNumber: Number(stop.lng),
  }));
  if (parsed.length < 3 || parsed.some((stop) => Number.isNaN(stop.latNumber) || Number.isNaN(stop.lngNumber))) {
    return parsed.map((stop) => stop.id || stop.index);
  }
  const remaining = parsed.slice(1);
  const ordered = [parsed[0]];
  while (remaining.length) {
    const current = ordered[ordered.length - 1];
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((candidate, index) => {
      const distance = Math.hypot(current.latNumber - candidate.latNumber, current.lngNumber - candidate.lngNumber);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    ordered.push(remaining.splice(bestIndex, 1)[0]);
  }
  return ordered.map((stop) => stop.id || stop.index);
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced || text.match(/\{[\s\S]*\}/)?.[0] || text;
  return JSON.parse(raw);
}

function stopsFromOrder(order: unknown[], stops: Stop[]) {
  return order
    .map((key) => {
      const keyString = String(key);
      return stops.find((stop, index) => String(stop.id) === keyString || String(stop.index ?? index) === keyString);
    })
    .filter((stop): stop is Stop => Boolean(stop));
}

function normalizeSegments(segments: unknown, orderedStops: Stop[]) {
  if (orderedStops.length < 2) {
    return [];
  }
  const modelSegments = Array.isArray(segments) ? segments as RouteSegment[] : [];
  return orderedStops.slice(0, -1).map((stop, index) => {
    const modelSegment = modelSegments[index] || {};
    return {
      from: stop.title || modelSegment.from || `地点 ${index + 1}`,
      to: orderedStops[index + 1].title || modelSegment.to || `地点 ${index + 2}`,
      transport: modelSegment.transport || "taxi",
      minutes: Number(modelSegment.minutes) || undefined,
      note: modelSegment.note || "",
    };
  });
}

async function requestModel(payload: RouteRequest) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in Supabase secrets.");
  }
  const baseUrl = Deno.env.get("OPENAI_BASE_URL") || "https://api.openai.com/v1";
  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
  const stops = (payload.stops || []).map((stop, index) => ({
    id: stop.id,
    index: stop.index ?? index,
    title: stop.title,
    time: stop.time,
    type: stop.type,
    address: stop.address,
    note: stop.note,
    lng: stop.lng,
    lat: stop.lat,
    budget: stop.budget,
    weather: stop.weather,
    tags: stop.tags || [],
  }));
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You optimize same-day travel stop order for a collaborative Chinese travel planner. Return strict JSON only: {\"order\":[stop ids or indexes],\"note\":\"short Chinese summary\",\"reason\":\"why this order is better\",\"segments\":[{\"from\":\"title\",\"to\":\"title\",\"transport\":\"walk/taxi/transit/charter\",\"minutes\":30,\"note\":\"short Chinese note\"}],\"warnings\":[\"short Chinese risk\"]}. Consider geography, fixed time labels, meal times, opening/reservation hints, weather, backtracking, fatigue, budgets, and tags. Do not invent new stops.",
        },
        {
          role: "user",
          content: JSON.stringify({
            destination: payload.destination,
            origin: payload.origin,
            day: payload.day,
            date: payload.date,
            dayTitle: payload.dayTitle,
            pace: payload.pace,
            budgetLimit: payload.budgetLimit,
            weather: payload.weather,
            stops,
          }),
        },
      ],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `Model API HTTP ${response.status}`);
  }
  const content = String(data.choices?.[0]?.message?.content || "");
  const parsed = extractJson(content);
  const order = Array.isArray(parsed.order) ? parsed.order : [];
  if (!order.length) {
    throw new Error("Model returned no route order.");
  }
  const orderedStops = stopsFromOrder(order, stops);
  return {
    order,
    note: parsed.note || parsed.reason || "AI 已根据地点、时间和行程节奏优化顺序。",
    reason: parsed.reason || parsed.note || "",
    segments: normalizeSegments(parsed.segments, orderedStops),
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map(String) : [],
    source: `OpenAI compatible · ${model}`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  let payload: RouteRequest = {};
  try {
    payload = (await req.json()) as RouteRequest;
    if (payload.testOnly) {
      const hasKey = Boolean(Deno.env.get("OPENAI_API_KEY"));
      return jsonResponse({
        ok: hasKey,
        source: "ai-route-optimize",
        message: hasKey
          ? "AI route optimizer is configured."
          : "AI route optimizer is deployed, but OPENAI_API_KEY is not configured yet.",
      });
    }

    if (!Array.isArray(payload.stops) || payload.stops.length < 2) {
      return jsonResponse({ ok: true, source: "ai-route-optimize", order: [], note: "地点不足，无需优化。" });
    }
    const result = await requestModel(payload);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    const stops = Array.isArray(payload.stops) ? payload.stops : [];
    return jsonResponse(
      {
        ok: false,
        source: "ai-route-optimize",
        error: error instanceof Error ? error.message : "Unknown AI route error",
        fallbackOrder: localDistanceSort(stops),
        note: "AI 未配置或调用失败，前端可以使用本地距离排序兜底。",
      },
      400,
    );
  }
});
