type ParseRequest = {
  provider?: string;
  text?: string;
  destination?: string;
  tripStartDate?: string;
  tripEndDate?: string;
};

type ParsedOrder = {
  provider?: string;
  category?: string;
  title?: string;
  date?: string;
  time?: string;
  amount?: number;
  paid?: number;
  payer?: string;
  address?: string;
  orderNo?: string;
  sourceUrl?: string;
  note?: string;
  confidence?: number;
  warnings?: string[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL_TIMEOUT_MS = 11000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function cleanText(value?: string) {
  return String(value || "").replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 6000);
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced || text.match(/\{[\s\S]*\}/)?.[0] || text;
  return JSON.parse(raw);
}

function normalizeTime(hour?: string, minute?: string) {
  if (!hour) return "";
  return `${hour.padStart(2, "0")}:${(minute || "00").padStart(2, "0")}`;
}

function normalizeDate(year: number, month?: string, day?: string) {
  if (!month || !day) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function fallbackParse(payload: ParseRequest): ParsedOrder {
  const text = cleanText(payload.text);
  const nowYear = new Date().getFullYear();
  const amountMatch = text.match(/(?:¥|￥|金额|房费|总价|合计|实付|支付|付款)[^\d]{0,8}(\d+(?:\.\d+)?)/);
  const timeMatch = text.match(/(?:\b|[^0-9])([01]?\d|2[0-3])[:：]([0-5]\d)(?:\b|[^0-9])/);
  const fullDateMatch = text.match(/(20\d{2})[年/\-.](\d{1,2})[月/\-.](\d{1,2})日?/);
  const dateMatch = text.match(/(\d{1,2})月(\d{1,2})日/);
  const addressMatch = text.match(/(?:地址|地点|位置|入住地址|到店地址|集合点)[:：\s]*(.+?)(?:\n|$)/);
  const titleMatch = text.match(/(?:商户|酒店|民宿|餐厅|名称|订单|项目|景点)[:：\s]*(.+?)(?:\n|$)/);
  const orderMatch = text.match(/(?:订单号|订单编号|券码|确认号|预订号)[:：\s]*([A-Za-z0-9-]{5,})/);
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  const lower = text.toLowerCase();
  const provider = payload.provider || (text.includes("美团") ? "美团/点评" : text.includes("携程") || lower.includes("trip.com") ? "携程/Trip.com" : text.includes("飞猪") ? "飞猪" : "");
  const category = /酒店|民宿|入住|离店|房型/.test(text)
    ? "住宿"
    : /航班|机票|登机|机场/.test(text)
    ? "交通"
    : /动车|高铁|火车|车次|12306/.test(text)
    ? "交通"
    : /餐厅|排队|到店|团购|套餐|美团|点评/.test(text)
    ? "餐饮"
    : /门票|景区|入园|预约/.test(text)
    ? "景点"
    : "其他";
  const date = fullDateMatch
    ? normalizeDate(Number(fullDateMatch[1]), fullDateMatch[2], fullDateMatch[3])
    : normalizeDate(nowYear, dateMatch?.[1], dateMatch?.[2]);
  const title = titleMatch?.[1]?.trim() || (category === "住宿" ? "住宿预订" : category === "餐饮" ? "餐厅预约" : category === "交通" ? "交通订单" : "外部订单");
  const warnings = ["正则解析结果，请导入前核对名称、日期、金额和地址。"];
  return {
    provider,
    category,
    title,
    date,
    time: normalizeTime(timeMatch?.[1], timeMatch?.[2]),
    amount: amountMatch ? Math.round(Number(amountMatch[1])) : 0,
    paid: amountMatch ? Math.round(Number(amountMatch[1])) : 0,
    address: addressMatch?.[1]?.trim() || "",
    orderNo: orderMatch?.[1] || "",
    sourceUrl: urlMatch?.[0] || "",
    note: text.slice(0, 900),
    confidence: 0.45,
    warnings,
  };
}

function sanitizeParsed(parsed: Record<string, unknown>, fallback: ParsedOrder): ParsedOrder {
  const category = String(parsed.category || fallback.category || "其他");
  const warnings = Array.isArray(parsed.warnings) ? parsed.warnings.map(String) : fallback.warnings || [];
  return {
    provider: String(parsed.provider || fallback.provider || ""),
    category: ["住宿", "餐饮", "交通", "景点", "其他"].includes(category) ? category : "其他",
    title: String(parsed.title || fallback.title || "外部订单"),
    date: String(parsed.date || fallback.date || ""),
    time: String(parsed.time || fallback.time || ""),
    amount: Number(parsed.amount ?? fallback.amount ?? 0) || 0,
    paid: Number(parsed.paid ?? fallback.paid ?? parsed.amount ?? fallback.amount ?? 0) || 0,
    payer: String(parsed.payer || fallback.payer || ""),
    address: String(parsed.address || fallback.address || ""),
    orderNo: String(parsed.orderNo || fallback.orderNo || ""),
    sourceUrl: String(parsed.sourceUrl || fallback.sourceUrl || ""),
    note: String(parsed.note || fallback.note || ""),
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence ?? fallback.confidence ?? 0.6))),
    warnings,
  };
}

async function parseWithModel(payload: ParseRequest, fallback: ParsedOrder) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return null;
  const baseUrl = Deno.env.get("OPENAI_BASE_URL") || "https://api.openai.com/v1";
  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "你是旅行计划 App 的订单文本解析器。只返回严格 JSON，不要解释。字段：provider, category(住宿/餐饮/交通/景点/其他), title, date(YYYY-MM-DD or empty), time(HH:mm or empty), amount(number), paid(number), payer, address, orderNo, sourceUrl, note, confidence(0-1), warnings(string[]). 只解析用户粘贴文本中能确认的信息，不要编造订单号和金额。",
        },
        {
          role: "user",
          content: JSON.stringify({
            provider: payload.provider,
            destination: payload.destination,
            tripStartDate: payload.tripStartDate,
            tripEndDate: payload.tripEndDate,
            fallback,
            text: cleanText(payload.text),
          }),
        },
      ],
    }),
  }).finally(() => clearTimeout(timer));
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `Model API HTTP ${response.status}`);
  }
  const content = String(data.choices?.[0]?.message?.content || "");
  return sanitizeParsed(extractJson(content), fallback);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const payload = (await req.json()) as ParseRequest;
    if (!cleanText(payload.text)) {
      return jsonResponse({ ok: false, error: "请先粘贴订单文本、短信、邮件或分享内容。" }, 400);
    }
    const fallback = fallbackParse(payload);
    try {
      const parsed = await parseWithModel(payload, fallback);
      if (parsed) {
        return jsonResponse({ ok: true, source: `AI · ${Deno.env.get("OPENAI_MODEL") || "model"}`, parsed });
      }
    } catch (error) {
      fallback.warnings = [
        ...(fallback.warnings || []),
        error instanceof Error ? `AI 解析失败：${error.message}` : "AI 解析失败，已使用本地规则。",
      ];
    }
    return jsonResponse({ ok: true, source: "local-regex", parsed: fallback });
  } catch (error) {
    return jsonResponse({ ok: false, error: error instanceof Error ? error.message : "Unknown parse error" }, 400);
  }
});
