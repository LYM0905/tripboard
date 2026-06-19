type WeatherDay = {
  date?: string;
  text: string;
  weather?: string;
  summary?: string;
};

type AmapWeatherRequest = {
  destination?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  days?: number | Array<{ id?: string; date?: string; title?: string }>;
  testOnly?: boolean;
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

function cityCandidates(keyword: string) {
  const normalized = keyword.replace(/\s+/g, "");
  const candidates = [keyword, normalized];
  if (!/[市省区县州盟]$/.test(normalized)) {
    candidates.push(`${normalized}市`);
  }
  return Array.from(new Set(candidates.filter(Boolean)));
}

const knownAdcodes: Record<string, { adcode: string; city: string }> = {
  北京: { adcode: "110000", city: "北京市" },
  上海: { adcode: "310000", city: "上海市" },
  广州: { adcode: "440100", city: "广州市" },
  深圳: { adcode: "440300", city: "深圳市" },
  甘肃: { adcode: "620100", city: "兰州市" },
  兰州: { adcode: "620100", city: "兰州市" },
  张掖: { adcode: "620700", city: "张掖市" },
  敦煌: { adcode: "620982", city: "敦煌市" },
  嘉峪关: { adcode: "620200", city: "嘉峪关市" },
  酒泉: { adcode: "620900", city: "酒泉市" },
  西安: { adcode: "610100", city: "西安市" },
  成都: { adcode: "510100", city: "成都市" },
  重庆: { adcode: "500000", city: "重庆市" },
  杭州: { adcode: "330100", city: "杭州市" },
  南京: { adcode: "320100", city: "南京市" },
  青岛: { adcode: "370200", city: "青岛市" },
};

function knownCityAdcode(keyword: string) {
  const normalized = keyword.replace(/\s+/g, "").replace(/[市省]$/, "");
  const exact = knownAdcodes[normalized];
  if (exact) return exact;
  const match = Object.entries(knownAdcodes).find(([name]) => normalized.includes(name));
  return match ? match[1] : null;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateList(request: AmapWeatherRequest, count: number) {
  const requestDays = Array.isArray(request.days) ? request.days : [];
  const explicit = requestDays.map((day) => cleanText(day.date)).filter(Boolean);
  if (explicit.length) return explicit.slice(0, count);
  const start = request.startDate ? new Date(`${request.startDate}T00:00:00`) : new Date();
  return Array.from({ length: count }, (_, index) => formatDate(addDays(start, index)));
}

async function districtAdcode(key: string, keyword: string) {
  for (const candidate of cityCandidates(keyword)) {
    const query = new URLSearchParams({
      key,
      keywords: candidate,
      subdistrict: "0",
      extensions: "base",
      output: "json",
    });
    const response = await fetch(`https://restapi.amap.com/v3/config/district?${query.toString()}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || String(data.status) !== "1") {
      throw new Error(data.info || data.infocode || `Amap district HTTP ${response.status}`);
    }
    const district = Array.isArray(data.districts) ? data.districts[0] : null;
    const adcode = cleanText(district?.adcode);
    if (adcode) {
      return {
        adcode,
        city: cleanText(district?.name) || candidate,
      };
    }
  }
  return null;
}

async function placeAdcode(key: string, keyword: string) {
  const query = new URLSearchParams({
    key,
    keywords: keyword,
    citylimit: "false",
    offset: "1",
    page: "1",
    extensions: "base",
    output: "json",
  });
  const response = await fetch(`https://restapi.amap.com/v3/place/text?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || String(data.status) !== "1") {
    throw new Error(data.info || data.infocode || `Amap place HTTP ${response.status}`);
  }
  const poi = Array.isArray(data.pois) ? data.pois[0] : null;
  const adcode = cleanText(poi?.adcode);
  if (!adcode) return null;
  return {
    adcode,
    city: normalizeAddress(poi?.cityname) || normalizeAddress(poi?.adname) || keyword,
  };
}

async function cityAdcode(keyword: string) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) throw new Error("Missing AMAP_WEB_SERVICE_KEY in Supabase secrets.");
  const known = knownCityAdcode(keyword);
  if (known) return known;
  try {
    const fromDistrict = await districtAdcode(key, keyword);
    if (fromDistrict) return fromDistrict;
  } catch (error) {
    console.warn("Amap district lookup failed", error);
  }
  try {
    const fromPlace = await placeAdcode(key, keyword);
    if (fromPlace) return fromPlace;
  } catch (error) {
    console.warn("Amap place adcode lookup failed", error);
  }
  const fallbackKnown = knownCityAdcode(keyword);
  if (fallbackKnown) return fallbackKnown;
  throw new Error("Amap did not find a matching city adcode.");
}

async function amapWeather(adcode: string) {
  const key = Deno.env.get("AMAP_WEB_SERVICE_KEY");
  if (!key) throw new Error("Missing AMAP_WEB_SERVICE_KEY in Supabase secrets.");
  const query = new URLSearchParams({
    key,
    city: adcode,
    extensions: "all",
    output: "json",
  });
  const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?${query.toString()}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || String(data.status) !== "1") {
    throw new Error(data.info || data.infocode || `Amap weather HTTP ${response.status}`);
  }
  const forecasts = Array.isArray(data.forecasts) ? data.forecasts : [];
  const casts = Array.isArray(forecasts[0]?.casts) ? forecasts[0].casts : [];
  return {
    city: normalizeAddress(forecasts[0]?.city),
    days: casts,
  };
}

function normalizeWeatherDays(casts: Array<Record<string, unknown>>, request: AmapWeatherRequest): WeatherDay[] {
  const dates = dateList(request, casts.length);
  return casts.map((cast, index) => {
    const dayWeather = cleanText(cast.dayweather);
    const nightWeather = cleanText(cast.nightweather);
    const weather = dayWeather && nightWeather && dayWeather !== nightWeather ? `${dayWeather}转${nightWeather}` : dayWeather || nightWeather || "天气待确认";
    const temp = `${cleanText(cast.nighttemp) || "--"}-${cleanText(cast.daytemp) || "--"}°C`;
    const wind = cleanText(cast.daywind) ? ` · ${cleanText(cast.daywind)}风${cleanText(cast.daypower) || ""}级` : "";
    return {
      date: cleanText(cast.date) || dates[index],
      weather,
      summary: `${temp} ${weather}${wind}`,
      text: `${temp} ${weather}${wind}`,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const request = (await req.json()) as AmapWeatherRequest;
    const hasKey = Boolean(Deno.env.get("AMAP_WEB_SERVICE_KEY"));
    if (request.testOnly) {
      return jsonResponse({
        ok: hasKey,
        source: "amap-weather",
        message: hasKey ? "Amap weather key is configured." : "AMAP_WEB_SERVICE_KEY is missing.",
      });
    }
    const keyword = cleanText(request.city || request.destination);
    if (!keyword) throw new Error("Missing destination or city.");
    const district = await cityAdcode(keyword);
    const weather = await amapWeather(district.adcode);
    const days = normalizeWeatherDays(weather.days, request);
    return jsonResponse({
      ok: true,
      source: `高德天气 · ${weather.city || district.city}`,
      city: weather.city || district.city,
      adcode: district.adcode,
      days,
      message: days.length ? `Synced ${days.length} Amap weather days.` : "Amap returned no forecast days.",
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        source: "amap-weather",
        error: error instanceof Error ? error.message : "Unknown Amap weather error",
      },
      400,
    );
  }
});
