const STORAGE_KEY = "tripboard-editable-v1";
const CTRIP_CONFIG_KEY = "tripboard-ctrip-connector-v1";
const MEMBER_PROFILE_KEY = "tripboard-member-profile-v1";
const SERVICE_CONFIG_KEY = "tripboard-service-connectors-v1";
const EXTERNAL_IMPORT_CONFIG_KEY = "tripboard-external-import-v1";
const VERSION_PREFIX = "tripboard-version-history:";
const MAX_VERSION_HISTORY = 12;
const EXTERNAL_IMPORT_TIMEOUT_MS = 12000;
const YJS_MODULE_URL = "https://cdn.jsdelivr.net/npm/yjs@13.6.27/+esm";
const COLLAB_TEXT_FIELDS = [
  { field: "title", domKey: "fieldTitle", label: "名称", presenceId: "fieldTitlePresence" },
  { field: "type", domKey: "fieldType", label: "类型", presenceId: "fieldTypePresence" },
  { field: "address", domKey: "fieldAddress", label: "地址", presenceId: "fieldAddressPresence" },
  { field: "amapKeyword", domKey: "fieldAmapKeyword", label: "高德关键词", presenceId: "fieldAmapKeywordPresence" },
  { field: "note", domKey: "fieldNote", label: "备注", presenceId: "fieldNotePresence" },
];
const COLLAB_TEXT_FIELD_BY_FIELD = new Map(COLLAB_TEXT_FIELDS.map((item) => [item.field, item]));
const COLLAB_STRUCT_FIELDS = [
  { field: "time", domKey: "fieldTime", type: "string" },
  { field: "budget", domKey: "fieldBudget", type: "number" },
  { field: "paid", domKey: "fieldPaid", type: "number" },
  { field: "payer", domKey: "fieldPayer", type: "string" },
  { field: "lng", domKey: "fieldLng", type: "string" },
  { field: "lat", domKey: "fieldLat", type: "string" },
  { field: "image", domKey: "fieldImage", type: "string" },
  { field: "tags", domKey: "fieldTags", type: "tags" },
];

const images = {
  kyoto:
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80",
  gansu:
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80",
  city:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
  food:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
  train:
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
  museum:
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
};

function uid() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function serializePlan(plan) {
  return JSON.stringify(plan || {});
}

function sameSerialized(a, b) {
  return serializePlan(a) === serializePlan(b);
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(String(value || ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function money(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function numberValue(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("请求超时，已切换本地解析。");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function clampDays(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 1;
  return Math.min(30, Math.max(1, parsed));
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function parseIsoDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekdayName(date) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
}

function formatDisplayDate(value) {
  const date = typeof value === "string" ? parseIsoDate(value) : value;
  if (!date) return "";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatDatedTitle(dateValue, originalTitle, index) {
  const date = parseIsoDate(dateValue);
  const suffix = String(originalTitle || "")
    .replace(/^第\d+天\s*/, "")
    .replace(/^\d+月\d+日\s*周[一二三四五六日]\s*[·-]?\s*/, "")
    .trim();
  return `${formatDisplayDate(date)} ${weekdayName(date)}${suffix ? ` · ${suffix}` : ` · 第${index + 1}天`}`;
}

function daysBetweenInclusive(startValue, endValue) {
  const start = parseIsoDate(startValue);
  const end = parseIsoDate(endValue);
  if (!start || !end) return 1;
  const diff = Math.round((end - start) / 86400000) + 1;
  return clampDays(diff);
}

function dateRangeText(startValue, endValue) {
  const start = parseIsoDate(startValue);
  const end = parseIsoDate(endValue);
  if (!start || !end) return "自定义日期";
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

function resequencePlanDays(plan = state) {
  if (!plan?.days?.length) return plan;
  plan.days.forEach((day, index) => {
    day.label = `D${index + 1}`;
  });
  const dates = plan.days.map((day) => day.date).filter(Boolean).sort();
  if (dates.length) {
    plan.startDate = dates[0];
    plan.endDate = dates[dates.length - 1];
    plan.dateRange = dateRangeText(plan.startDate, plan.endDate);
  } else if (plan.startDate) {
    plan.endDate = formatIsoDate(addDays(parseIsoDate(plan.startDate), plan.days.length - 1));
    plan.dateRange = dateRangeText(plan.startDate, plan.endDate);
  }
  return plan;
}

function reflowPlanDates(plan = state, startDateValue = plan?.startDate || plan?.days?.[0]?.date) {
  if (!plan?.days?.length) return plan;
  const start = parseIsoDate(startDateValue) || parseIsoDate(plan.days[0]?.date) || new Date();
  plan.days.forEach((day, index) => {
    const date = addDays(start, index);
    day.date = formatIsoDate(date);
    day.label = `D${index + 1}`;
    day.title = formatDatedTitle(day.date, day.title, index);
  });
  plan.startDate = formatIsoDate(start);
  plan.endDate = formatIsoDate(addDays(start, plan.days.length - 1));
  plan.dateRange = dateRangeText(plan.startDate, plan.endDate);
  return plan;
}

function currentPlanMeta() {
  return {
    name: state.name,
    destination: state.destination,
    origin: state.origin,
    dateRange: state.dateRange,
    startDate: state.startDate,
    endDate: state.endDate,
    budgetLimit: state.budgetLimit,
    partySize: state.partySize,
    cover: state.cover,
  };
}

function applyPlanMeta(meta = {}) {
  ["name", "destination", "origin", "dateRange", "startDate", "endDate", "budgetLimit", "partySize", "cover"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(meta, field)) state[field] = clone(meta[field]);
  });
}

function defaultGuideDates() {
  const start = addDays(new Date(), 14);
  const end = addDays(start, 5);
  return {
    startDate: formatIsoDate(start),
    endDate: formatIsoDate(end),
  };
}

function amapSearchUrl(keyword) {
  const query = encodeURIComponent(keyword || "");
  return `https://uri.amap.com/search?keyword=${query}&src=tripboard&coordinate=gaode&callnative=1`;
}

function amapMarkerUrl(stop) {
  const keyword = stop?.amapKeyword || stop?.title || "";
  const lng = String(stop?.lng || "").trim();
  const lat = String(stop?.lat || "").trim();
  if (lng && lat) {
    return `https://uri.amap.com/marker?position=${encodeURIComponent(`${lng},${lat}`)}&name=${encodeURIComponent(keyword)}&src=tripboard&coordinate=gaode&callnative=1`;
  }
  return amapSearchUrl(keyword);
}

async function lookupAmapPlace(keyword) {
  if (!serviceConfig.amapEndpoint || !keyword) return null;
  const response = await fetch(serviceConfig.amapEndpoint, {
    method: "POST",
    headers: serviceHeaders("", serviceConfig.amapEndpoint),
    body: JSON.stringify({ keyword, city: state.destination || "" }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || `HTTP ${response.status}`);
  const place = Array.isArray(data.places) ? data.places[0] : data.place || data;
  if (!place) return null;
  return {
    title: place.title || place.name || keyword,
    address: place.address || place.formattedAddress || "",
    lng: String(place.lng || place.longitude || ""),
    lat: String(place.lat || place.latitude || ""),
  };
}

async function requestAmapRoute(day, mode = "walking") {
  if (!serviceConfig.amapRouteEndpoint) {
    throw new Error("请先配置高德路线代理。");
  }
  const stops = day.stops
    .map((stop, index) => ({
      index,
      title: stop.title,
      address: stop.address,
      amapKeyword: stop.amapKeyword || `${state.destination || ""} ${stop.title}`.trim(),
      lng: stop.lng,
      lat: stop.lat,
    }))
    .filter((stop) => stop.title);
  if (stops.length < 2) {
    throw new Error("至少需要 2 个地点才能规划路线。");
  }
  const response = await fetch(serviceConfig.amapRouteEndpoint, {
    method: "POST",
    headers: serviceHeaders("", serviceConfig.amapRouteEndpoint),
    body: JSON.stringify({
      mode,
      destination: state.destination || "",
      city: state.destination || "",
      stops,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  return data;
}

function pointForStop(stop) {
  const lng = Number(stop.lng);
  const lat = Number(stop.lat);
  if (!Number.isNaN(lng) && !Number.isNaN(lat) && stop.lng !== "" && stop.lat !== "") {
    return { x: lng, y: lat };
  }
  return { x: Number(stop.x || 50), y: Number(stop.y || 50) };
}

function distanceBetween(a, b) {
  const pointA = pointForStop(a);
  const pointB = pointForStop(b);
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function makeStop({
  time = "09:00",
  title = "新地点",
  type = "Place",
  address = "待确认",
  note = "补充交通、预订和同行意见。",
  noteYjs = "",
  textYjs = "",
  tags = ["草稿"],
  budget = 0,
  paid = 0,
  payer = "",
  votes = 1,
  userVoted = true,
  comments = [],
  x = 50,
  y = 50,
  lng = "",
  lat = "",
  amapKeyword = "",
  image = images.city,
} = {}) {
  return {
    id: uid(),
    time,
    title,
    type,
    address,
    note,
    noteYjs,
    textYjs,
    tags: normalizeTags(tags),
    budget: Number(budget || 0),
    paid: Number(paid || 0),
    payer,
    votes,
    userVoted,
    favorite: userVoted,
    comments,
    x,
    y,
    lng,
    lat,
    amapKeyword,
    image,
  };
}

function buildKyotoPlan() {
  return {
    name: "京都 6 日同行计划",
    destination: "京都",
    dateRange: "6月4日 - 6月9日",
    budgetLimit: 10000,
    cover: images.kyoto,
    activities: ["打开京都示例计划"],
    candidates: [
      makeStop({ title: "% Arabica", type: "Cafe", note: "适合加入下午休息。", tags: ["咖啡", "备选"], budget: 90, image: images.food, x: 62, y: 32 }),
      makeStop({ title: "京都国立博物馆", type: "Museum", note: "雨天替代方案。", tags: ["文化", "雨天"], budget: 80, image: images.museum, x: 42, y: 50 }),
      makeStop({ title: "锦市场", type: "Market", note: "适合小吃和伴手礼。", tags: ["美食", "购物"], budget: 180, image: images.food, x: 35, y: 42 }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: "6月4日 周四",
        route: "抵达大阪 · 前往京都",
        weather: "24°C 多云",
        transport: "机场快线 + 步行",
        stops: [
          makeStop({ time: "13:20", title: "关西机场集合", type: "Transit", address: "Kansai International Airport T1", note: "航班落地后在 T1 到达层集合，确认机场快线班次。", tags: ["交通", "已确认"], budget: 420, image: images.train, x: 18, y: 68 }),
          makeStop({ time: "19:00", title: "先斗町晚餐", type: "Dinner", address: "京都市中京区柏屋町", note: "靠河一侧座位优先，预算控制在人均 ¥380 内。", tags: ["需预订", "美食"], budget: 1520, image: images.food, x: 68, y: 38 }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: "6月5日 周五",
        route: "东山 · 清水寺 · 祇园",
        weather: "22°C 少云",
        transport: "步行 + 地铁",
        stops: [
          makeStop({ time: "08:30", title: "清水寺", type: "Temple", address: "京都市东山区清水1丁目294", note: "早到避开人流，从二年坂上行。雨天缩短到 70 分钟。", tags: ["必去", "门票"], budget: 96, image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=80", comments: [{ author: "林", text: "门票预算已加上。" }], x: 64, y: 42 }),
          makeStop({ time: "10:30", title: "二年坂与三年坂", type: "Walk", address: "京都市东山区清水2丁目", note: "沿坡道慢走，预留甜品和手信时间。", tags: ["散步", "购物"], budget: 260, image: images.city, x: 58, y: 50 }),
          makeStop({ time: "12:20", title: "祇园午餐", type: "Lunch", address: "京都市东山区祇园町南侧", note: "两家候选店都支持预约，先用投票定。", tags: ["待投票", "美食"], budget: 720, votes: 2, userVoted: false, image: images.food, x: 46, y: 43 }),
        ],
      },
    ],
  };
}

function buildGansuPlan(dayCount = 6, options = {}) {
  const plan = {
    name: `甘肃 ${dayCount} 日丝路计划`,
    destination: "甘肃",
    dateRange: "自定义日期",
    budgetLimit: options.budget === "品质" ? 14000 : options.budget === "节省" ? 8000 : 10000,
    cover: images.gansu,
    activities: [`生成甘肃 ${dayCount} 日计划`],
    candidates: [
      makeStop({ title: "沙洲夜市", type: "Market", note: "适合敦煌晚上自由活动。", tags: ["美食", "夜市"], budget: 160, image: images.food, x: 72, y: 36 }),
      makeStop({ title: "敦煌书局", type: "Bookstore", note: "文化主题轻量备选。", tags: ["文化", "室内"], budget: 80, image: images.museum, x: 46, y: 48 }),
      makeStop({ title: "雅丹地质公园", type: "Geopark", note: "车程长，适合 8 天版本。", tags: ["自然", "长车程"], budget: 420, image: images.gansu, x: 58, y: 52 }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: "第1天 兰州",
        route: "抵达兰州 · 黄河风情线",
        weather: "25°C 晴",
        transport: "打车 + 步行",
        stops: [
          makeStop({ time: "14:30", title: "甘肃省博物馆", type: "Museum", address: "兰州市七里河区西津西路3号", note: "先建立丝路背景，重点看铜奔马、彩陶和佛教艺术展区。", tags: ["文化", "室内"], budget: 0, image: images.museum, x: 32, y: 44, lng: "103.774028", lat: "36.066431", amapKeyword: "甘肃省博物馆" }),
          makeStop({ time: "17:20", title: "黄河铁桥", type: "River", address: "兰州市城关区滨河路中段", note: "傍晚沿黄河风情线散步，适合第一天轻松收尾。", tags: ["散步", "日落"], budget: 0, image: images.city, x: 48, y: 38, lng: "103.825462", lat: "36.067584", amapKeyword: "兰州 黄河铁桥" }),
          makeStop({ time: "19:30", title: "兰州牛肉面与夜市", type: "Dinner", address: "兰州市城关区张掖路周边", note: "第一晚不排重行程，重点解决口味偏好和第二天交通。", tags: ["美食"], budget: 320, image: images.food, x: 56, y: 46, lng: "103.827113", lat: "36.061225", amapKeyword: "兰州 张掖路 夜市" }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: "第2天 张掖",
        route: "兰州 · 张掖 · 七彩丹霞",
        weather: "26°C 晴",
        transport: "高铁 + 包车",
        stops: [
          makeStop({ time: "08:20", title: "高铁前往张掖", type: "Transit", address: "兰州西站 → 张掖西站", note: "预留车站早餐和取票时间，抵达后先寄存行李。", tags: ["交通", "高铁"], budget: 760, image: images.train, x: 22, y: 56 }),
          makeStop({ time: "15:50", title: "张掖七彩丹霞", type: "Geopark", address: "张掖市临泽县倪家营镇", note: "把主观景台放在傍晚，颜色层次更容易出片。", tags: ["必去", "日落"], budget: 360, image: images.gansu, x: 62, y: 42, lng: "100.060650", lat: "38.906839", amapKeyword: "张掖七彩丹霞旅游景区" }),
        ],
      },
      {
        id: uid(),
        label: "D3",
        title: "第3天 张掖",
        route: "马蹄寺 · 平山湖大峡谷",
        weather: "24°C 多云",
        transport: "包车",
        stops: [
          makeStop({ time: "09:00", title: "马蹄寺石窟", type: "Grottoes", address: "张掖市肃南裕固族自治县", note: "文化线和自然线结合的一天，早上看石窟。", tags: ["文化", "轻徒步"], budget: 260, image: images.museum, x: 40, y: 36 }),
          makeStop({ time: "14:30", title: "平山湖大峡谷", type: "Canyon", address: "张掖市甘州区平山湖乡", note: "轻松节奏只走核心观景线，高强度可加深度徒步。", tags: ["自然", "备水"], budget: 360, image: images.gansu, x: 58, y: 60 }),
        ],
      },
      {
        id: uid(),
        label: "D4",
        title: "第4天 嘉峪关",
        route: "张掖 · 嘉峪关 · 天下雄关",
        weather: "23°C 晴",
        transport: "动车 + 打车",
        stops: [
          makeStop({ time: "10:30", title: "嘉峪关关城", type: "Fortress", address: "嘉峪关市峪泉镇", note: "河西走廊历史感很强的一站，适合安排讲解。", tags: ["历史", "门票"], budget: 440, image: images.city, x: 45, y: 44 }),
          makeStop({ time: "15:00", title: "悬壁长城", type: "Great Wall", address: "嘉峪关市石关峡口北侧", note: "体力允许再去，风大时注意保暖和防晒。", tags: ["可选", "风大"], budget: 200, votes: 2, userVoted: false, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80", x: 62, y: 38 }),
        ],
      },
      {
        id: uid(),
        label: "D5",
        title: "第5天 敦煌",
        route: "莫高窟 · 鸣沙山月牙泉",
        weather: "28°C 晴",
        transport: "包车",
        stops: [
          makeStop({ time: "09:00", title: "莫高窟", type: "Grottoes", address: "敦煌市东南25公里", note: "需要提前预约，出行前确认官方公告和场次。", tags: ["必去", "需预约"], budget: 952, image: images.museum, comments: [{ author: "周", text: "需要提前抢票，放到待办里。" }], x: 42, y: 48, lng: "94.809255", lat: "40.047261", amapKeyword: "敦煌 莫高窟" }),
          makeStop({ time: "17:40", title: "鸣沙山月牙泉", type: "Desert", address: "敦煌市鸣山路", note: "傍晚进景区，避开正午暴晒。沙漠项目现场决定。", tags: ["日落", "防晒"], budget: 440, image: images.gansu, x: 62, y: 62, lng: "94.663879", lat: "40.088540", amapKeyword: "鸣沙山月牙泉" }),
        ],
      },
      {
        id: uid(),
        label: "D6",
        title: "第6天 敦煌",
        route: "阳关 · 玉门关 · 返程",
        weather: "27°C 晴",
        transport: "包车 + 飞机",
        stops: [
          makeStop({ time: "09:30", title: "阳关遗址", type: "Heritage", address: "敦煌市阳关镇", note: "最后一天安排西线，节奏比东线更舒展。", tags: ["丝路", "包车"], budget: 240, image: images.gansu, x: 36, y: 44 }),
          makeStop({ time: "13:20", title: "玉门关", type: "Heritage", address: "敦煌市西北方向戈壁荒漠", note: "距离较远，关注返程交通时间。", tags: ["可选", "车程长"], budget: 240, votes: 2, userVoted: false, image: images.gansu, x: 58, y: 50 }),
        ],
      },
      {
        id: uid(),
        label: "D7",
        title: "第7天 敦煌",
        route: "雅丹地貌 · 沙洲夜市",
        weather: "26°C 晴",
        transport: "包车",
        stops: [
          makeStop({ time: "10:00", title: "敦煌雅丹地质公园", type: "Geopark", address: "敦煌市西北约180公里", note: "8天版本可加入这一站；5到6天版本建议作为备选。", tags: ["自然", "长车程"], budget: 520, image: images.gansu, x: 52, y: 44 }),
        ],
      },
      {
        id: uid(),
        label: "D8",
        title: "第8天 返程",
        route: "敦煌 · 兰州/西安",
        weather: "25°C 晴",
        transport: "飞机/火车",
        stops: [
          makeStop({ time: "10:30", title: "返程缓冲", type: "Transit", address: "敦煌机场 / 敦煌站", note: "最后一天留给伴手礼、补拍和交通延误缓冲。", tags: ["返程", "缓冲"], budget: 880, image: images.train, x: 48, y: 50 }),
        ],
      },
    ],
  };

  while (plan.days.length < dayCount) {
    const dayNumber = plan.days.length + 1;
    plan.days.push({
      id: uid(),
      label: `D${dayNumber}`,
      title: `第${dayNumber}天 自由探索`,
      route: dayNumber % 2 === 0 ? "当地深度体验 · 备选景点" : "交通缓冲 · 美食补完",
      weather: "天气待确认",
      transport: "待规划",
      stops: [
        makeStop({
          time: "10:00",
          title: "自由探索时段",
          type: "Flexible",
          address: "根据前几天体力和天气决定",
          note: "这是自动补齐的弹性日，可直接替换成你想去的景点。",
          tags: ["弹性", "待定"],
          budget: options.budget === "品质" ? 600 : options.budget === "节省" ? 200 : 360,
          image: images.gansu,
          x: 40 + (dayNumber % 5) * 8,
          y: 36 + (dayNumber % 4) * 7,
        }),
      ],
    });
  }

  plan.days = plan.days.slice(0, dayCount);

  if (options.pace === "高强度" && plan.days[2]) {
    plan.days[2].stops.push(makeStop({ time: "17:40", title: "张掖市区夜游", type: "Walk", address: "张掖市甘州区", note: "高强度版本增加晚间散步和小吃。", tags: ["夜游", "美食"], budget: 160, image: images.food, x: 68, y: 48 }));
  }

  return plan;
}

function buildBlankPlan(destination, dayCount = 3, options = {}) {
  const safeDestination = destination || "自定义目的地";
  return {
    name: `${safeDestination} ${dayCount} 日空白计划`,
    destination: safeDestination,
    dateRange: "自定义日期",
    budgetLimit: options.budget === "品质" ? 14000 : options.budget === "节省" ? 8000 : 10000,
    cover: safeDestination.includes("甘肃") ? images.gansu : images.city,
    activities: [`创建${safeDestination}${dayCount}天空白模板`],
    candidates: [
      makeStop({
        title: "备选景点",
        type: "Idea",
        address: safeDestination,
        note: "可以把临时想法先放到备选池，再加入某一天。",
        tags: ["备选", "待确认"],
        budget: 0,
        amapKeyword: safeDestination,
        image: safeDestination.includes("甘肃") ? images.gansu : images.city,
      }),
    ],
    days: Array.from({ length: dayCount }, (_, index) => ({
      id: uid(),
      label: `D${index + 1}`,
      title: `第${index + 1}天`,
      route: "待填写路线",
      weather: "天气待确认",
      transport: "交通待规划",
      stops: [
        makeStop({
          time: index === 0 ? "10:00" : "09:30",
          title: "待填写地点",
          type: "Draft",
          address: safeDestination,
          note: "在右侧编辑名称、地址、高德关键词、预算和备注。",
          tags: ["空白模板", "待填写"],
          budget: 0,
          amapKeyword: safeDestination,
          image: safeDestination.includes("甘肃") ? images.gansu : images.city,
          x: 34 + ((index * 11) % 48),
          y: 32 + ((index * 9) % 38),
        }),
      ],
    })),
  };
}

function applyPlanDates(plan, startDateValue) {
  const start = parseIsoDate(startDateValue) || parseIsoDate(formatIsoDate(new Date()));
  const dayCount = plan.days.length;
  const finalEndDate = formatIsoDate(addDays(start, dayCount - 1));
  plan.startDate = formatIsoDate(start);
  plan.endDate = finalEndDate;
  plan.dateRange = dateRangeText(plan.startDate, plan.endDate);
  plan.days.forEach((day, index) => {
    const date = addDays(start, index);
    day.date = formatIsoDate(date);
    day.label = `D${index + 1}`;
    day.title = formatDatedTitle(day.date, day.title, index);
  });
  return plan;
}

function ensurePlanOrigin(plan) {
  if (!plan) return plan;
  plan.origin = plan.origin || "上海";
  return plan;
}

function ensurePlanDates(plan) {
  if (!plan?.days?.length) return plan;
  ensurePlanOrigin(plan);
  if (plan.startDate && plan.endDate && plan.days.every((day) => day.date)) return plan;
  const defaults = defaultGuideDates();
  const startDate = plan.startDate || defaults.startDate;
  const endDate = plan.endDate || formatIsoDate(addDays(parseIsoDate(startDate), plan.days.length - 1));
  return applyPlanDates(plan, startDate, endDate);
}

function hasLocalChanges() {
  return Boolean(lastSyncedState && !sameSerialized(state, lastSyncedState));
}

function itemMergeKey(item, prefix = "item") {
  if (!item || typeof item !== "object") return `${prefix}:${String(item ?? "")}`;
  return String(item?.id || item?.orderNo || item?.code || `${prefix}:${item?.title || item?.name || ""}:${item?.date || item?.time || ""}:${item?.text || ""}`);
}

function mergeUniqueList(localItems = [], remoteItems = [], prefix = "item") {
  const result = [];
  const seen = new Set();
  [...localItems, ...remoteItems].forEach((item) => {
    if (!item) return;
    const key = itemMergeKey(item, prefix);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(clone(item));
  });
  return result;
}

function mergeComments(localComments = [], remoteComments = []) {
  const result = [];
  const seen = new Set();
  [...localComments, ...remoteComments].forEach((comment) => {
    if (!comment) return;
    const key = String(comment.id || `${comment.author || ""}:${comment.text || ""}`);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(clone(comment));
  });
  return result;
}

function mergeScalarField(baseValue, localValue, remoteValue) {
  const localChanged = !sameSerialized(localValue, baseValue);
  const remoteChanged = !sameSerialized(remoteValue, baseValue);
  if (localChanged && !remoteChanged) return clone(localValue);
  if (!localChanged && remoteChanged) return clone(remoteValue);
  if (localChanged && remoteChanged) return clone(localValue);
  return clone(localValue ?? remoteValue ?? baseValue);
}

function mergeStopFields(localStop = {}, remoteStop = {}, baseStop = {}) {
  const merged = { ...clone(remoteStop || {}), ...clone(localStop || {}) };
  [
    "time",
    "title",
    "type",
    "address",
    "note",
    "noteYjs",
    "textYjs",
    "budget",
    "paid",
    "payer",
    "votes",
    "userVoted",
    "favorite",
    "x",
    "y",
    "lng",
    "lat",
    "amapKeyword",
    "image",
  ].forEach((field) => {
    merged[field] = mergeScalarField(baseStop?.[field], localStop?.[field], remoteStop?.[field]);
  });
  merged.comments = mergeComments(localStop.comments || [], remoteStop.comments || []);
  merged.tags = mergeUniqueList((localStop.tags || []).map((tag) => ({ id: tag, title: tag })), (remoteStop.tags || []).map((tag) => ({ id: tag, title: tag })), "tag").map((tag) => tag.title);
  return merged;
}

function mergeStops(localStops = [], remoteStops = [], baseStops = []) {
  const result = [];
  const byLocalId = new Map(localStops.map((stop) => [stop.id, stop]).filter(([id]) => id));
  const addedRemote = new Set();
  localStops.forEach((localStop) => {
    const remoteStop = localStop.id ? remoteStops.find((stop) => stop.id === localStop.id) : null;
    const baseStop = localStop.id ? baseStops.find((stop) => stop.id === localStop.id) : null;
    if (remoteStop?.id) addedRemote.add(remoteStop.id);
    result.push(mergeStopFields(localStop, remoteStop || {}, baseStop || {}));
  });
  remoteStops.forEach((remoteStop) => {
    if (remoteStop.id && (byLocalId.has(remoteStop.id) || addedRemote.has(remoteStop.id))) return;
    result.push(clone(remoteStop));
  });
  return result;
}

function mergeDays(localDays = [], remoteDays = [], baseDays = []) {
  const result = [];
  const usedRemote = new Set();
  localDays.forEach((localDay, index) => {
    const remoteIndex = remoteDays.findIndex((day) => (localDay.id && day.id === localDay.id) || (localDay.date && day.date === localDay.date));
    const remoteDay = remoteIndex >= 0 ? remoteDays[remoteIndex] : remoteDays[index];
    const baseDay = baseDays.find((day) => (localDay.id && day.id === localDay.id) || (localDay.date && day.date === localDay.date)) || baseDays[index] || {};
    if (remoteDay?.id) usedRemote.add(remoteDay.id);
    result.push({
      ...clone(remoteDay || {}),
      ...clone(localDay),
      route: mergeScalarField(baseDay.route, localDay.route, remoteDay?.route),
      weather: mergeScalarField(baseDay.weather, localDay.weather, remoteDay?.weather),
      transport: mergeScalarField(baseDay.transport, localDay.transport, remoteDay?.transport),
      stops: mergeStops(localDay.stops || [], remoteDay?.stops || [], baseDay.stops || []),
      amapRoute: mergeScalarField(baseDay.amapRoute, localDay.amapRoute, remoteDay?.amapRoute) || null,
    });
  });
  remoteDays.forEach((remoteDay) => {
    if (remoteDay.id && usedRemote.has(remoteDay.id)) return;
    const alreadyIncluded = result.some((day) => (remoteDay.id && day.id === remoteDay.id) || (remoteDay.date && day.date === remoteDay.date));
    if (!alreadyIncluded) result.push(clone(remoteDay));
  });
  return result;
}

function mergePlans(localPlan, remotePlan, basePlan = lastSyncedState) {
  const merged = {
    ...clone(remotePlan || {}),
    ...clone(localPlan || {}),
    name: mergeScalarField(basePlan?.name, localPlan?.name, remotePlan?.name),
    destination: mergeScalarField(basePlan?.destination, localPlan?.destination, remotePlan?.destination),
    origin: mergeScalarField(basePlan?.origin, localPlan?.origin, remotePlan?.origin),
    dateRange: mergeScalarField(basePlan?.dateRange, localPlan?.dateRange, remotePlan?.dateRange),
    startDate: mergeScalarField(basePlan?.startDate, localPlan?.startDate, remotePlan?.startDate),
    endDate: mergeScalarField(basePlan?.endDate, localPlan?.endDate, remotePlan?.endDate),
    budgetLimit: mergeScalarField(basePlan?.budgetLimit, localPlan?.budgetLimit, remotePlan?.budgetLimit),
    partySize: mergeScalarField(basePlan?.partySize, localPlan?.partySize, remotePlan?.partySize),
    cover: mergeScalarField(basePlan?.cover, localPlan?.cover, remotePlan?.cover),
    days: mergeDays(localPlan?.days || [], remotePlan?.days || [], basePlan?.days || []),
    candidates: mergeUniqueList(localPlan?.candidates || [], remotePlan?.candidates || [], "candidate"),
    activities: mergeUniqueList(localPlan?.activities || [], remotePlan?.activities || [], "activity").slice(0, 10),
    transportQuotes: mergeUniqueList(localPlan?.transportQuotes || [], remotePlan?.transportQuotes || [], "quote").slice(0, 60),
  };
  return ensurePlanDates(merged);
}

function conflictSummary(conflict) {
  const who = conflict?.updatedBy || "其他成员";
  const when = conflict?.updatedAt ? new Date(conflict.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "刚刚";
  return `${who} 在 ${when} 保存了云端版本，同时你本地也有未同步修改。`;
}

function showConflictPanel(conflict) {
  pendingConflict = { ...conflict, base: conflict.base || clone(lastSyncedState || {}) };
  if (!dom.conflictPanel) return;
  dom.conflictPanel.hidden = false;
  dom.conflictText.textContent = conflictSummary(pendingConflict);
  dom.conflictDetail.textContent = "请选择处理方式：智能合并会尽量保留双方新增的地点、评论、交通报价和活动记录。";
  dom.collabMode.textContent = "待处理冲突";
  dom.saveState.textContent = "发现协作冲突";
  refreshIcons();
}

function hideConflictPanel() {
  pendingConflict = null;
  if (dom.conflictPanel) dom.conflictPanel.hidden = true;
}

function setNoteCollabStatus(message) {
  if (dom.noteCollabStatus) dom.noteCollabStatus.textContent = message;
}

function collabTextFieldMeta(field) {
  return COLLAB_TEXT_FIELD_BY_FIELD.get(field) || null;
}

function currentFocusedTextField() {
  const activeElement = document.activeElement;
  return COLLAB_TEXT_FIELDS.find(({ domKey }) => dom[domKey] === activeElement) || null;
}

function textSelectionPayload(fieldMeta) {
  const element = fieldMeta ? dom[fieldMeta.domKey] : null;
  if (!element || document.activeElement !== element) return null;
  return {
    field: fieldMeta.field,
    label: fieldMeta.label,
    start: element.selectionStart ?? 0,
    end: element.selectionEnd ?? element.selectionStart ?? 0,
    length: String(element.value || "").length,
  };
}

function textSelectionLabel(selection = {}) {
  const label = selection.label || collabTextFieldMeta(selection.field)?.label || "文本";
  const start = Number(selection.start || 0);
  const end = Number(selection.end || start);
  if (end > start) return `${label} · 选中 ${end - start} 字`;
  return `${label} · 光标 ${start}`;
}

function freshMember(member = {}, ttl = 45000) {
  const seenAt = Date.parse(member.seenAt || "");
  return Number.isNaN(seenAt) || Date.now() - seenAt < ttl;
}

function remoteTextEditorsForField(field) {
  const stopId = currentStop()?.id || "";
  const ownMemberId = memberProfile?.id || sessionId;
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member)) return false;
    if (member.activeStopId !== stopId) return false;
    return member.textSelection?.field === field;
  });
}

function renderTextPresence() {
  COLLAB_TEXT_FIELDS.forEach(({ field, presenceId }) => {
    const target = presenceId ? document.querySelector(`#${presenceId}`) : null;
    if (!target) return;
    const editors = remoteTextEditorsForField(field);
    target.hidden = !editors.length;
    target.innerHTML = editors
      .slice(0, 3)
      .map((member, index) => {
        const selected = (member.textSelection?.end || 0) > (member.textSelection?.start || 0);
        return `
          <span class="text-presence-chip a${(index % 4) + 1}">
            ${memberInitial(member.name)}
            <span>${escapeHtml(member.name || "协作者")} ${selected ? `选中 ${member.textSelection.end - member.textSelection.start} 字` : `光标 ${member.textSelection?.start ?? 0}`}</span>
          </span>
        `;
      })
      .join("");
  });
}

function upsertOnlineMember(member = {}) {
  if (!member.memberId) return;
  const index = onlineMembers.findIndex((item) => item.memberId === member.memberId);
  if (index >= 0) {
    onlineMembers[index] = { ...onlineMembers[index], ...member };
  } else {
    onlineMembers = [...onlineMembers, member];
  }
  onlineMembers = onlineMembers.filter((item) => freshMember(item));
}

function currentTextRoomId(stopId = currentStop()?.id) {
  return tripId && stopId ? `text:${tripId}:${stopId}` : "";
}

function stableTextClientId(value) {
  let hash = 2166136261;
  String(value || "tripboard-text").split("").forEach((char) => {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return Math.abs(hash) || 1;
}

function buildInitialTextUpdate(Y, stop) {
  const seedDoc = new Y.Doc();
  seedDoc.clientID = stableTextClientId(`${tripId}:${stop.id}`);
  COLLAB_TEXT_FIELDS.forEach(({ field }) => {
    seedDoc.getText(field).insert(0, stop[field] || "");
  });
  const structMap = seedDoc.getMap("struct");
  COLLAB_STRUCT_FIELDS.forEach((meta) => {
    structMap.set(meta.field, stopStructValue(stop, meta));
  });
  const commentArray = seedDoc.getArray("comments");
  commentArray.insert(0, normalizeComments(stop.comments || []));
  const update = Y.encodeStateAsUpdate(seedDoc);
  seedDoc.destroy();
  return update;
}

async function ensureYjs() {
  if (yjsModule) return yjsModule;
  if (!yjsReadyPromise) {
    yjsReadyPromise = import(YJS_MODULE_URL)
      .then((module) => {
        yjsModule = module;
        return module;
      })
      .catch((error) => {
        console.warn("Yjs load failed", error);
        setNoteCollabStatus("文本逐字协作加载失败，仍可随计划保存");
        yjsReadyPromise = null;
        throw error;
      });
  }
  return yjsReadyPromise;
}

function persistCurrentTextFromDoc(label = "地点协作内容已实时同步") {
  if (!collabTextDoc || !collabTextStopId) return;
  const stop = state.days.flatMap((day) => day.stops || []).find((item) => item.id === collabTextStopId);
  if (!stop) return;
  const nextValues = {};
  COLLAB_TEXT_FIELDS.forEach(({ field }) => {
    nextValues[field] = collabTextFields[field]?.toString() || "";
  });
  const nextStructValues = readStructFromDoc();
  const nextComments = readCommentsFromDoc();
  const nextYjs = yjsModule ? bytesToBase64(yjsModule.encodeStateAsUpdate(collabTextDoc)) : stop.textYjs || stop.noteYjs || "";
  const textChanged = COLLAB_TEXT_FIELDS.some(({ field }) => stop[field] !== nextValues[field]);
  const structChanged = COLLAB_STRUCT_FIELDS.some(({ field }) => !sameSerialized(stop[field], nextStructValues[field]));
  const commentsChanged = !sameSerialized(normalizeComments(stop.comments || []), nextComments);
  const changed = textChanged || structChanged || commentsChanged || stop.textYjs !== nextYjs;
  if (!changed) return;
  COLLAB_TEXT_FIELDS.forEach(({ field }) => {
    stop[field] = nextValues[field];
  });
  COLLAB_STRUCT_FIELDS.forEach(({ field }) => {
    stop[field] = clone(nextStructValues[field]);
  });
  stop.comments = nextComments;
  stop.textYjs = nextYjs;
  stop.noteYjs = nextYjs;
  applyStopRealtimeFields(stop);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setNoteCollabStatus(label);
  if (textChanged || structChanged || commentsChanged) refreshRealtimeStopViews();
  clearTimeout(collabTextSaveTimer);
  collabTextSaveTimer = setTimeout(() => {
    if (!canEdit() || !supabaseClient || !tripId || pendingConflict) return;
    pushRemoteState("地点协作内容已实时同步");
  }, 900);
}

function broadcastTextUpdate(update) {
  if (!realtimeChannel || !collabTextStopId || isApplyingCollabTextRemote) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-text-yjs-update",
    payload: {
      roomId: currentTextRoomId(collabTextStopId),
      stopId: collabTextStopId,
      update: bytesToBase64(update),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function structDomValue({ domKey, type }) {
  const element = dom[domKey];
  if (!element) return type === "number" ? 0 : type === "tags" ? [] : "";
  if (type === "number") return numberValue(element.value);
  if (type === "tags") return normalizeTags(element.value);
  return String(element.value || "").trim();
}

function stopStructValue(stop, { field, type }) {
  if (type === "number") return numberValue(stop?.[field]);
  if (type === "tags") return normalizeTags(stop?.[field]);
  return String(stop?.[field] || "").trim();
}

function structDisplayValue(value, type) {
  if (type === "tags") return normalizeTags(value).join(", ");
  if (type === "number") return value || "";
  return value || "";
}

function readStructFromDoc() {
  const values = {};
  if (!collabStructMap) return values;
  COLLAB_STRUCT_FIELDS.forEach(({ field, type }) => {
    const value = collabStructMap.get(field);
    values[field] = type === "tags" ? normalizeTags(value) : type === "number" ? numberValue(value) : String(value || "");
  });
  return values;
}

function normalizeComments(comments = []) {
  const seen = new Set();
  return (comments || [])
    .filter(Boolean)
    .map((comment) => ({
      id: comment.id || uid(),
      author: comment.author || "我",
      text: String(comment.text || "").trim(),
      at: comment.at || new Date().toISOString(),
    }))
    .filter((comment) => {
      if (!comment.text) return false;
      const key = comment.id || `${comment.author}:${comment.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function readCommentsFromDoc() {
  return normalizeComments(collabCommentsArray ? collabCommentsArray.toArray() : []);
}

function renderStopComments(stop) {
  dom.commentList.innerHTML = (stop.comments || [])
    .map((comment) => `<div class="comment-item"><span class="avatar a2">${escapeHtml(comment.author || "我")}</span><p>${escapeHtml(comment.text)}</p></div>`)
    .join("") || `<div class="comment-item"><span class="avatar a1">我</span><p>还没有评论，可以先添加同行意见。</p></div>`;
}

function applyStopRealtimeFields(stop) {
  dom.placeType.textContent = stop.type || "Place";
  dom.placeTitle.textContent = stop.title || "未命名地点";
  dom.placeAddress.textContent = stop.address || "地址待确认";
  dom.placeNote.textContent = stop.note || "";
  dom.commentTitle.textContent = stop.title || "当前地点";
  dom.placePhoto.style.setProperty("--photo", `url("${stop.image || images.city}")`);
  dom.favoriteBtn.classList.toggle("selected", Boolean(stop.favorite));
  dom.mustVote.classList.toggle("is-active", Boolean(stop.userVoted));
  dom.voteCount.textContent = stop.votes || 0;
  dom.commentCount.textContent = (stop.comments || []).length;
  renderStopComments(stop);
}

function refreshRealtimeStopViews() {
  renderShell();
  renderDays();
  renderDaySummary();
  renderTimeline();
  renderMap();
  renderAmapRouteReport(currentDay()?.amapRoute || null);
  refreshIcons();
}

function broadcastTextSelection() {
  if (!realtimeChannel || !memberProfile || !tripId) return;
  const payload = presencePayload();
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-text-selection-update",
    payload: {
      roomId: currentTextRoomId(payload.activeStopId),
      stopId: payload.activeStopId,
      memberId: payload.memberId,
      name: payload.name,
      role: payload.role,
      activeDay: payload.activeDay,
      activeDayId: payload.activeDayId,
      activeStopId: payload.activeStopId,
      editing: payload.editing,
      textSelection: payload.textSelection,
      textEditing: payload.textEditing,
      lockMode: payload.lockMode,
      seenAt: payload.seenAt,
    },
  });
}

function broadcastStopCreated(dayId, stop) {
  if (!realtimeChannel || !tripId || !stop?.id) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-created",
    payload: {
      tripId,
      dayId,
      stop: clone(stop),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastStopDeleted(dayId, stop) {
  if (!realtimeChannel || !tripId || !stop?.id) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-deleted",
    payload: {
      tripId,
      dayId,
      stopId: stop.id,
      title: stop.title || "地点",
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastStopsReordered(dayId, stops) {
  if (!realtimeChannel || !tripId || !dayId) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "stops-reordered",
    payload: {
      tripId,
      dayId,
      stopOrder: (stops || []).map((stop) => stop.id).filter(Boolean),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayUpdated(day) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "day-updated",
    payload: {
      tripId,
      dayId: day.id,
      day: clone({
        id: day.id,
        label: day.label,
        date: day.date || "",
        title: day.title || "",
        route: day.route || "",
        weather: day.weather || "",
        transport: day.transport || "",
      }),
      planMeta: currentPlanMeta(),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayCreated(day, index) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "day-created",
    payload: {
      tripId,
      day: clone(day),
      index,
      planMeta: currentPlanMeta(),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayDeleted(day) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "day-deleted",
    payload: {
      tripId,
      dayId: day.id,
      title: day.title || day.label || "当天",
      planMeta: currentPlanMeta(),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDaysReordered() {
  if (!realtimeChannel || !tripId) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "days-reordered",
    payload: {
      tripId,
      dayOrder: state.days.map((day) => day.id).filter(Boolean),
      planMeta: currentPlanMeta(),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastPlanReplaced(reason = "更新整份计划") {
  if (!realtimeChannel || !tripId || !state?.days?.length) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "plan-replaced",
    payload: {
      tripId,
      state: clone(state),
      reason,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function destroyCollabTextDoc() {
  clearTimeout(collabTextSaveTimer);
  collabTextSaveTimer = null;
  collabTextStopId = "";
  collabTextFields = {};
  collabStructMap = null;
  collabCommentsArray = null;
  if (collabTextDoc) {
    collabTextDoc.destroy();
    collabTextDoc = null;
  }
}

async function bindCollabTextDoc() {
  const stop = currentStop();
  if (!stop?.id || collabTextStopId === stop.id) return;
  const requestId = collabTextBindRequestId + 1;
  collabTextBindRequestId = requestId;
  destroyCollabTextDoc();
  if (!tripId || isReadonlyMode) {
    setNoteCollabStatus(tripId ? "文本会随计划保存" : "创建共享计划后可逐字协作");
    return;
  }
  setNoteCollabStatus("文本逐字协作加载中...");
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  if (requestId !== collabTextBindRequestId || currentStop()?.id !== stop.id) return;
  collabTextStopId = stop.id;
  collabTextDoc = new Y.Doc();
  let restored = false;
  if (stop.textYjs) {
    try {
      Y.applyUpdate(collabTextDoc, base64ToBytes(stop.textYjs), "restore");
      restored = true;
    } catch (error) {
      console.warn("Stored Yjs text state could not be restored", error);
    }
  } else if (stop.noteYjs) {
    try {
      const legacyDoc = new Y.Doc();
      Y.applyUpdate(legacyDoc, base64ToBytes(stop.noteYjs), "restore");
      const legacyNote = legacyDoc.getText("note").toString();
      legacyDoc.destroy();
      Y.applyUpdate(collabTextDoc, buildInitialTextUpdate(Y, { ...stop, note: legacyNote || stop.note }), "restore");
      restored = true;
    } catch (error) {
      console.warn("Legacy Yjs note state could not be migrated", error);
    }
  } else {
    Y.applyUpdate(collabTextDoc, buildInitialTextUpdate(Y, stop), "restore");
    restored = true;
  }
  COLLAB_TEXT_FIELDS.forEach(({ field }) => {
    collabTextFields[field] = collabTextDoc.getText(field);
  });
  collabStructMap = collabTextDoc.getMap("struct");
  collabCommentsArray = collabTextDoc.getArray("comments");
  collabTextDoc.transact(() => {
    COLLAB_STRUCT_FIELDS.forEach((meta) => {
      if (!collabStructMap.has(meta.field)) collabStructMap.set(meta.field, stopStructValue(stop, meta));
    });
    if (collabCommentsArray.length === 0 && (stop.comments || []).length) {
      collabCommentsArray.insert(0, normalizeComments(stop.comments || []));
    }
  }, "restore");
  COLLAB_TEXT_FIELDS.forEach(({ field, domKey }) => {
    const value = restored ? collabTextFields[field].toString() : stop[field] || "";
    if (dom[domKey] && dom[domKey].value !== value) dom[domKey].value = value;
  });
  COLLAB_STRUCT_FIELDS.forEach((meta) => {
    const value = collabStructMap.get(meta.field);
    if (dom[meta.domKey]) dom[meta.domKey].value = structDisplayValue(value, meta.type);
  });
  const comments = readCommentsFromDoc();
  if (comments.length) {
    stop.comments = comments;
    renderStopComments(stop);
    dom.commentCount.textContent = comments.length;
  }
  collabTextDoc.on("update", (update, origin) => {
    if (origin === "remote") {
      persistCurrentTextFromDoc("收到协作者地点协作更新");
      return;
    }
    broadcastTextUpdate(update);
    persistCurrentTextFromDoc("地点协作内容实时同步中");
  });
  if (restored && COLLAB_TEXT_FIELDS.some(({ field }) => stop[field] !== collabTextFields[field].toString())) {
    persistCurrentTextFromDoc("已载入文本协作状态");
  }
  setNoteCollabStatus("文本、结构字段与评论协作已开启");
}

async function applyRemoteTextUpdate(payload = {}) {
  if (!payload.update || payload.roomId !== currentTextRoomId()) return;
  if (!collabTextDoc || !Object.keys(collabTextFields).length || collabTextStopId !== payload.stopId) await bindCollabTextDoc();
  if (!collabTextDoc) return;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  isApplyingCollabTextRemote = true;
  try {
    Y.applyUpdate(collabTextDoc, base64ToBytes(payload.update), "remote");
    COLLAB_TEXT_FIELDS.forEach(({ field, domKey }) => {
      const nextValue = collabTextFields[field]?.toString() || "";
      if (dom[domKey] && dom[domKey].value !== nextValue) dom[domKey].value = nextValue;
    });
    COLLAB_STRUCT_FIELDS.forEach((meta) => {
      const nextValue = collabStructMap?.get(meta.field);
      if (dom[meta.domKey]) dom[meta.domKey].value = structDisplayValue(nextValue, meta.type);
    });
    setNoteCollabStatus(`${payload.name || "协作者"} 正在同步地点协作内容`);
  } finally {
    isApplyingCollabTextRemote = false;
  }
}

function applyRemoteStopCreated(payload = {}) {
  if (!payload.stop?.id || payload.tripId !== tripId) return;
  if (state.days.some((day) => (day.stops || []).some((stop) => stop.id === payload.stop.id))) return;
  const day =
    state.days.find((item) => item.id === payload.dayId) ||
    state.days.find((item) => item.date && item.date === payload.dayDate) ||
    currentDay();
  if (!day) return;
  day.stops = [...(day.stops || []), clone(payload.stop)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 新增地点「${payload.stop.title || "未命名地点"}」`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了「${payload.stop.title || "地点"}」`;
  render();
}

function applyRemoteStopDeleted(payload = {}) {
  if (!payload.stopId || payload.tripId !== tripId) return;
  const dayIndex = state.days.findIndex((day) => day.id === payload.dayId || (day.stops || []).some((stop) => stop.id === payload.stopId));
  if (dayIndex < 0) return;
  const day = state.days[dayIndex];
  const stopIndex = (day.stops || []).findIndex((stop) => stop.id === payload.stopId);
  if (stopIndex < 0 || day.stops.length <= 1) return;
  const wasActive = dayIndex === activeDay && stopIndex === activeStop;
  day.stops.splice(stopIndex, 1);
  if (dayIndex === activeDay) {
    activeStop = wasActive ? Math.min(stopIndex, day.stops.length - 1) : activeStop > stopIndex ? activeStop - 1 : activeStop;
    activeStop = Math.max(0, activeStop);
  }
  if (dayIndex === activeDay) clearCurrentAmapRoute();
  destroyCollabTextDoc();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 删除地点「${payload.title || "地点"}」`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了「${payload.title || "地点"}」`;
  render();
}

function applyRemoteStopsReordered(payload = {}) {
  if (!payload.dayId || !Array.isArray(payload.stopOrder) || payload.tripId !== tripId) return;
  const dayIndex = state.days.findIndex((day) => day.id === payload.dayId);
  if (dayIndex < 0) return;
  const day = state.days[dayIndex];
  const byId = new Map((day.stops || []).map((stop) => [stop.id, stop]).filter(([id]) => id));
  const ordered = payload.stopOrder.map((id) => byId.get(id)).filter(Boolean);
  const leftovers = (day.stops || []).filter((stop) => !payload.stopOrder.includes(stop.id));
  if (!ordered.length) return;
  const activeStopId = dayIndex === activeDay ? currentStop()?.id : "";
  day.stops = [...ordered, ...leftovers];
  if (dayIndex === activeDay && activeStopId) {
    activeStop = Math.max(0, day.stops.findIndex((stop) => stop.id === activeStopId));
  }
  if (dayIndex === activeDay) clearCurrentAmapRoute();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 调整地点顺序`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了地点顺序`;
  render();
}

function applyRemoteDayUpdated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  const index = state.days.findIndex((day) => day.id === payload.day.id);
  if (index < 0) return;
  const current = state.days[index];
  state.days[index] = {
    ...current,
    ...clone(payload.day),
    stops: current.stops || [],
    amapRoute: payload.day.amapRoute || current.amapRoute || null,
  };
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  guideState.destination = state.destination || guideState.destination;
  guideState.origin = state.origin || guideState.origin;
  guideState.startDate = state.startDate || guideState.startDate;
  guideState.endDate = state.endDate || guideState.endDate;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 更新当天设置`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 更新了 ${state.days[index].label}`;
  render();
}

function applyRemoteDayCreated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  if (state.days.some((day) => day.id === payload.day.id)) return;
  const activeDayId = currentDay()?.id || "";
  const nextIndex = Math.min(Math.max(Number(payload.index ?? state.days.length), 0), state.days.length);
  state.days.splice(nextIndex, 0, clone(payload.day));
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  activeStop = Math.min(activeStop, currentDay()?.stops?.length - 1 || 0);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 新增一天「${payload.day.title || payload.day.label || "新日期"}」`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了 ${payload.day.title || "一天"}`;
  render();
}

function applyRemoteDayDeleted(payload = {}) {
  if (!payload.dayId || payload.tripId !== tripId || state.days.length <= 1) return;
  const index = state.days.findIndex((day) => day.id === payload.dayId);
  if (index < 0) return;
  const activeDayId = currentDay()?.id || "";
  state.days.splice(index, 1);
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  if (activeDayId === payload.dayId) {
    activeDay = Math.min(index, state.days.length - 1);
    activeStop = 0;
    destroyCollabTextDoc();
  } else if (activeDayId) {
    activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 删除一天「${payload.title || "当天"}」`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了 ${payload.title || "一天"}`;
  render();
}

function applyRemoteDaysReordered(payload = {}) {
  if (!Array.isArray(payload.dayOrder) || payload.tripId !== tripId) return;
  const byId = new Map(state.days.map((day) => [day.id, day]).filter(([id]) => id));
  const ordered = payload.dayOrder.map((id) => byId.get(id)).filter(Boolean);
  const leftovers = state.days.filter((day) => !payload.dayOrder.includes(day.id));
  if (!ordered.length) return;
  const activeDayId = currentDay()?.id || "";
  state.days = [...ordered, ...leftovers];
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 调整日期顺序`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了日期顺序`;
  render();
}

function applyRemotePlanReplaced(payload = {}) {
  if (!payload.state?.days?.length || payload.tripId !== tripId) return;
  const activeDayId = currentDay()?.id || "";
  const activeStopId = currentStop()?.id || "";
  state = ensurePlanDates(clone(payload.state));
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  if (activeStopId && currentDay()?.stops?.length) {
    const nextStopIndex = currentDay().stops.findIndex((stop) => stop.id === activeStopId);
    activeStop = nextStopIndex >= 0 ? nextStopIndex : 0;
  } else {
    activeDay = Math.min(activeDay, state.days.length - 1);
    activeStop = 0;
  }
  guideState.destination = state.destination || guideState.destination;
  guideState.origin = state.origin || guideState.origin;
  guideState.startDate = state.startDate || guideState.startDate;
  guideState.endDate = state.endDate || guideState.endDate;
  destroyCollabTextDoc();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} ${payload.reason || "更新整份计划"}`);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 更新了整份计划`;
  render();
}

function applyTextDiff(yText, nextValue) {
  const currentValue = yText.toString();
  if (currentValue === nextValue) return false;
  let prefixLength = 0;
  const maxPrefix = Math.min(currentValue.length, nextValue.length);
  while (prefixLength < maxPrefix && currentValue[prefixLength] === nextValue[prefixLength]) {
    prefixLength += 1;
  }
  let suffixLength = 0;
  const maxSuffix = Math.min(currentValue.length - prefixLength, nextValue.length - prefixLength);
  while (
    suffixLength < maxSuffix &&
    currentValue[currentValue.length - 1 - suffixLength] === nextValue[nextValue.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }
  const deleteLength = currentValue.length - prefixLength - suffixLength;
  const insertText = nextValue.slice(prefixLength, nextValue.length - suffixLength);
  if (deleteLength > 0) yText.delete(prefixLength, deleteLength);
  if (insertText) yText.insert(prefixLength, insertText);
  return true;
}

async function syncCollabTextFieldToDoc(field, value) {
  if (!canEdit() || isReadonlyMode) return;
  await bindCollabTextDoc();
  const yText = collabTextFields[field];
  if (!collabTextDoc || !yText || isApplyingCollabTextRemote) return;
  collabTextDoc.transact(() => {
    applyTextDiff(yText, value);
  }, "local-input");
}

async function syncCollabStructFieldToDoc(meta) {
  if (!canEdit() || isReadonlyMode) return;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabStructMap || isApplyingCollabTextRemote) return;
  const nextValue = structDomValue(meta);
  if (sameSerialized(collabStructMap.get(meta.field), nextValue)) return;
  collabTextDoc.transact(() => {
    collabStructMap.set(meta.field, clone(nextValue));
  }, "local-struct-input");
}

async function addCollaborativeComment(text) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabCommentsArray || isApplyingCollabTextRemote) return false;
  const comment = {
    id: uid(),
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
  };
  if (!comment.text) return true;
  collabTextDoc.transact(() => {
    collabCommentsArray.push([comment]);
  }, "local-comment-input");
  return true;
}

function applyRemotePlan(remotePlan, meta = {}) {
  isApplyingRemote = true;
  const activeStopId = currentStop()?.id || "";
  const remoteActiveStop = activeStopId ? remotePlan.days?.flatMap((day) => day.stops || []).find((stop) => stop.id === activeStopId) : null;
  const currentTextState = activeStopId === collabTextStopId ? currentStop()?.textYjs || currentStop()?.noteYjs || "" : "";
  state = ensurePlanDates(clone(remotePlan));
  lastSyncedState = clone(state);
  lastRemoteUpdatedAt = meta.updatedAt || lastRemoteUpdatedAt;
  const remoteTextState = remoteActiveStop?.textYjs || remoteActiveStop?.noteYjs || "";
  if (remoteTextState && remoteTextState !== currentTextState) {
    destroyCollabTextDoc();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  isApplyingRemote = false;
}

async function resolveConflict(mode) {
  if (!pendingConflict || !requireEdit("处理协作冲突")) return;
  const conflict = pendingConflict;
  const localPlan = clone(conflict.local || state);
  const remotePlan = ensurePlanDates(clone(conflict.remote));
  const basePlan = clone(conflict.base || lastSyncedState || {});
  isResolvingConflict = true;
  try {
    savePlanSnapshot(localPlan, "冲突处理前：我的版本");
    savePlanSnapshot(remotePlan, "冲突处理前：云端版本", conflict.updatedBy || "协作者");
    if (mode === "remote") {
      applyRemotePlan(remotePlan, { updatedAt: conflict.updatedAt || "" });
      hideConflictPanel();
      dom.saveState.textContent = "已使用云端版本";
      dom.collabStatus.textContent = "已采用协作者保存的云端版本，你的旧版本已进入历史版本。";
      render();
      return;
    }
    state = mode === "merge" ? mergePlans(localPlan, remotePlan, basePlan) : ensurePlanDates(localPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lastRemoteUpdatedAt = conflict.updatedAt || lastRemoteUpdatedAt;
    hideConflictPanel();
    logActivity(mode === "merge" ? "合并协作冲突" : "保留本地版本解决冲突");
    await pushRemoteState(mode === "merge" ? "已合并协作冲突" : "已保留我的版本");
    render();
  } catch (error) {
    pendingConflict = conflict;
    showConflictPanel(conflict);
    dom.collabStatus.textContent = `处理冲突失败：${error.message}`;
  } finally {
    isResolvingConflict = false;
  }
}

function handleRemotePlanUpdate(next) {
  if (!next?.data?.days?.length || next.updated_at === lastRemoteUpdatedAt) return;
  const remotePlan = ensurePlanDates(clone(next.data));
  if (pendingLocalRemoteUpdatedAt && next.updated_at === pendingLocalRemoteUpdatedAt && sameSerialized(state, remotePlan)) {
    lastRemoteUpdatedAt = next.updated_at || lastRemoteUpdatedAt;
    lastSyncedState = clone(remotePlan);
    pendingLocalRemoteUpdatedAt = "";
    hideConflictPanel();
    return;
  }
  if (hasLocalChanges() && !sameSerialized(state, remotePlan)) {
    savePlanSnapshot(remotePlan, "待合并的云端版本", next.updated_by || "协作者");
    showConflictPanel({
      remote: remotePlan,
      local: clone(state),
      base: clone(lastSyncedState || {}),
      updatedAt: next.updated_at || "",
      updatedBy: next.updated_by || "",
      reason: "realtime",
    });
    return;
  }
  saveVersionSnapshot("协作者更新前版本");
  applyRemotePlan(remotePlan, { updatedAt: next.updated_at || "" });
  dom.saveState.textContent = "收到协作者更新";
  dom.collabStatus.textContent = next.updated_by ? `${next.updated_by} 刚刚更新了计划` : "共享计划已更新";
  render();
}

const dom = {
  tripName: document.querySelector("#tripName"),
  templateName: document.querySelector("#templateName"),
  tripCover: document.querySelector("#tripCover"),
  tripDateRange: document.querySelector("#tripDateRange"),
  onlineCountText: document.querySelector("#onlineCountText"),
  onlineAvatars: document.querySelector("#onlineAvatars"),
  collabMode: document.querySelector("#collabMode"),
  memberForm: document.querySelector("#memberForm"),
  collabName: document.querySelector("#collabName"),
  collabRole: document.querySelector("#collabRole"),
  memberList: document.querySelector("#memberList"),
  collabStatus: document.querySelector("#collabStatus"),
  createSharedTripBtn: document.querySelector("#createSharedTripBtn"),
  copySharedLinkBtn: document.querySelector("#copySharedLinkBtn"),
  copyReadonlyLinkBtn: document.querySelector("#copyReadonlyLinkBtn"),
  conflictPanel: document.querySelector("#conflictPanel"),
  conflictText: document.querySelector("#conflictText"),
  conflictDetail: document.querySelector("#conflictDetail"),
  mergeConflictBtn: document.querySelector("#mergeConflictBtn"),
  keepLocalConflictBtn: document.querySelector("#keepLocalConflictBtn"),
  useRemoteConflictBtn: document.querySelector("#useRemoteConflictBtn"),
  budgetTotal: document.querySelector("#budgetTotal"),
  budgetMeter: document.querySelector("#budgetMeter"),
  budgetGrid: document.querySelector("#budgetGrid"),
  partySizeInput: document.querySelector("#partySizeInput"),
  budgetSettlement: document.querySelector("#budgetSettlement"),
  versionCount: document.querySelector("#versionCount"),
  versionList: document.querySelector("#versionList"),
  dayList: document.querySelector("#dayList"),
  routeLabel: document.querySelector("#routeLabel"),
  dayTitle: document.querySelector("#dayTitle"),
  saveState: document.querySelector("#saveState"),
  presenceText: document.querySelector("#presenceText"),
  dayPills: document.querySelector("#dayPills"),
  dayForm: document.querySelector("#dayForm"),
  dayEditorStatus: document.querySelector("#dayEditorStatus"),
  fieldDayDate: document.querySelector("#fieldDayDate"),
  fieldDayTitle: document.querySelector("#fieldDayTitle"),
  fieldDayRoute: document.querySelector("#fieldDayRoute"),
  fieldDayWeather: document.querySelector("#fieldDayWeather"),
  fieldDayTransport: document.querySelector("#fieldDayTransport"),
  addDayBtn: document.querySelector("#addDayBtn"),
  moveDayUpBtn: document.querySelector("#moveDayUpBtn"),
  moveDayDownBtn: document.querySelector("#moveDayDownBtn"),
  deleteDayBtn: document.querySelector("#deleteDayBtn"),
  timeline: document.querySelector("#timeline"),
  candidateGrid: document.querySelector("#candidateGrid"),
  routeDistance: document.querySelector("#routeDistance"),
  routeDuration: document.querySelector("#routeDuration"),
  mapCanvas: document.querySelector("#mapCanvas"),
  placePhoto: document.querySelector("#placePhoto"),
  placeType: document.querySelector("#placeType"),
  placeTitle: document.querySelector("#placeTitle"),
  placeAddress: document.querySelector("#placeAddress"),
  placeNote: document.querySelector("#placeNote"),
  favoriteBtn: document.querySelector("#favoriteBtn"),
  mustVote: document.querySelector("#mustVote"),
  commentFocusBtn: document.querySelector("#commentFocusBtn"),
  voteCount: document.querySelector("#voteCount"),
  commentCount: document.querySelector("#commentCount"),
  commentTitle: document.querySelector("#commentTitle"),
  commentList: document.querySelector("#commentList"),
  commentForm: document.querySelector("#commentForm"),
  commentInput: document.querySelector("#commentInput"),
  stopForm: document.querySelector("#stopForm"),
  fieldTime: document.querySelector("#fieldTime"),
  fieldTitle: document.querySelector("#fieldTitle"),
  fieldType: document.querySelector("#fieldType"),
  fieldBudget: document.querySelector("#fieldBudget"),
  fieldPaid: document.querySelector("#fieldPaid"),
  fieldPayer: document.querySelector("#fieldPayer"),
  fieldAddress: document.querySelector("#fieldAddress"),
  fieldAmapKeyword: document.querySelector("#fieldAmapKeyword"),
  fieldLng: document.querySelector("#fieldLng"),
  fieldLat: document.querySelector("#fieldLat"),
  fieldImage: document.querySelector("#fieldImage"),
  fieldTags: document.querySelector("#fieldTags"),
  fieldNote: document.querySelector("#fieldNote"),
  noteCollabStatus: document.querySelector("#noteCollabStatus"),
  editorPanel: document.querySelector(".editor-panel"),
  editorLockState: document.querySelector("#editorLockState"),
  editLockBanner: document.querySelector("#editLockBanner"),
  editLockText: document.querySelector("#editLockText"),
  addStopBtn: document.querySelector("#addStopBtn"),
  quickAddForm: document.querySelector("#quickAddForm"),
  quickPlaceName: document.querySelector("#quickPlaceName"),
  quickAmapKeyword: document.querySelector("#quickAmapKeyword"),
  quickTime: document.querySelector("#quickTime"),
  quickBudget: document.querySelector("#quickBudget"),
  quickAddress: document.querySelector("#quickAddress"),
  openAmapBtn: document.querySelector("#openAmapBtn"),
  quickAmapLink: document.querySelector("#quickAmapLink"),
  optimizeRouteBtn: document.querySelector("#optimizeRouteBtn"),
  optimizeHint: document.querySelector("#optimizeHint"),
  aiRouteReport: document.querySelector("#aiRouteReport"),
  amapRouteMode: document.querySelector("#amapRouteMode"),
  amapRouteBtn: document.querySelector("#amapRouteBtn"),
  amapRouteReport: document.querySelector("#amapRouteReport"),
  moveUpBtn: document.querySelector("#moveUpBtn"),
  moveDownBtn: document.querySelector("#moveDownBtn"),
  deleteStopBtn: document.querySelector("#deleteStopBtn"),
  applyGuideBtn: document.querySelector("#applyGuideBtn"),
  guideResult: document.querySelector("#guideResult"),
  destinationInput: document.querySelector("#destinationInput"),
  originInput: document.querySelector("#originInput"),
  startDateInput: document.querySelector("#startDateInput"),
  endDateInput: document.querySelector("#endDateInput"),
  tripLengthHint: document.querySelector("#tripLengthHint"),
  transportProviderStatus: document.querySelector("#transportProviderStatus"),
  flightAvgPrice: document.querySelector("#flightAvgPrice"),
  trainAvgPrice: document.querySelector("#trainAvgPrice"),
  transportDayHint: document.querySelector("#transportDayHint"),
  transportFilterForm: document.querySelector("#transportFilterForm"),
  transportType: document.querySelector("#transportType"),
  transportFrom: document.querySelector("#transportFrom"),
  transportTo: document.querySelector("#transportTo"),
  transportStartTime: document.querySelector("#transportStartTime"),
  transportEndTime: document.querySelector("#transportEndTime"),
  transportList: document.querySelector("#transportList"),
  multiOriginInput: document.querySelector("#multiOriginInput"),
  multiOriginExampleBtn: document.querySelector("#multiOriginExampleBtn"),
  compareOriginsBtn: document.querySelector("#compareOriginsBtn"),
  multiOriginResults: document.querySelector("#multiOriginResults"),
  openCtripSearchLink: document.querySelector("#openCtripSearchLink"),
  openTripSearchLink: document.querySelector("#openTripSearchLink"),
  openRailSearchLink: document.querySelector("#openRailSearchLink"),
  manualQuoteForm: document.querySelector("#manualQuoteForm"),
  manualQuoteType: document.querySelector("#manualQuoteType"),
  manualQuoteCode: document.querySelector("#manualQuoteCode"),
  manualQuoteDepart: document.querySelector("#manualQuoteDepart"),
  manualQuoteArrive: document.querySelector("#manualQuoteArrive"),
  manualQuotePrice: document.querySelector("#manualQuotePrice"),
  amapLookupBtn: document.querySelector("#amapLookupBtn"),
  fieldAmapLink: document.querySelector("#fieldAmapLink"),
  exportBtn: document.querySelector("#exportBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  importModal: document.querySelector("#importModal"),
  importTitle: document.querySelector("#importTitle"),
  importCopy: document.querySelector("#importCopy"),
  importForm: document.querySelector("#importForm"),
  importCategory: document.querySelector("#importCategory"),
  importDate: document.querySelector("#importDate"),
  importName: document.querySelector("#importName"),
  importTime: document.querySelector("#importTime"),
  importBudget: document.querySelector("#importBudget"),
  importPaid: document.querySelector("#importPaid"),
  importPayer: document.querySelector("#importPayer"),
  importAddress: document.querySelector("#importAddress"),
  importOrderNo: document.querySelector("#importOrderNo"),
  importSourceUrl: document.querySelector("#importSourceUrl"),
  importNote: document.querySelector("#importNote"),
  importPreview: document.querySelector("#importPreview"),
  parseImportBtn: document.querySelector("#parseImportBtn"),
  createChoiceModal: document.querySelector("#createChoiceModal"),
  createChoiceTitle: document.querySelector("#createChoiceTitle"),
  createChoiceCopy: document.querySelector("#createChoiceCopy"),
  recommendedPlanBtn: document.querySelector("#recommendedPlanBtn"),
  blankPlanBtn: document.querySelector("#blankPlanBtn"),
  guideProgress: document.querySelector(".guide-progress"),
  syncBadge: document.querySelector("#syncBadge"),
  syncStatus: document.querySelector("#syncStatus"),
  ctripLoginBtn: document.querySelector("#ctripLoginBtn"),
  ctripConnectPanel: document.querySelector("#ctripConnectPanel"),
  ctripConnectForm: document.querySelector("#ctripConnectForm"),
  ctripEndpointInput: document.querySelector("#ctripEndpointInput"),
  ctripTokenInput: document.querySelector("#ctripTokenInput"),
  ctripTestBtn: document.querySelector("#ctripTestBtn"),
  ctripSyncTransportBtn: document.querySelector("#ctripSyncTransportBtn"),
  ctripSpecBtn: document.querySelector("#ctripSpecBtn"),
  ctripSpecBox: document.querySelector("#ctripSpecBox"),
  ctripStatus: document.querySelector("#ctripStatus"),
  serviceConfigStatus: document.querySelector("#serviceConfigStatus"),
  aiRouteEndpointInput: document.querySelector("#aiRouteEndpointInput"),
  aiRouteTokenInput: document.querySelector("#aiRouteTokenInput"),
  amapEndpointInput: document.querySelector("#amapEndpointInput"),
  amapRouteEndpointInput: document.querySelector("#amapRouteEndpointInput"),
  weatherEndpointInput: document.querySelector("#weatherEndpointInput"),
  saveServiceConfigBtn: document.querySelector("#saveServiceConfigBtn"),
  syncWeatherBtn: document.querySelector("#syncWeatherBtn"),
  serviceStatusText: document.querySelector("#serviceStatusText"),
  activityList: document.querySelector("#activityList"),
};

let state = ensurePlanDates(loadState());
let activeDay = 0;
let activeStop = 0;
let pendingProvider = "";
let quickAmapPlace = null;
let transportFilterApplied = false;
let transportProviderItems = [];
let transportProviderSource = "";
let multiOriginComparisons = [];
let ctripConfig = safeJsonParse(localStorage.getItem(CTRIP_CONFIG_KEY), { endpoint: "", token: "" }) || { endpoint: "", token: "" };
let externalImportConfig = safeJsonParse(localStorage.getItem(EXTERNAL_IMPORT_CONFIG_KEY), { endpoint: "", token: "" }) || { endpoint: "", token: "" };
let lastParsedImport = null;
let serviceConfig = safeJsonParse(localStorage.getItem(SERVICE_CONFIG_KEY), { aiEndpoint: "", aiToken: "", amapEndpoint: "", amapRouteEndpoint: "", weatherEndpoint: "" }) || {
  aiEndpoint: "",
  aiToken: "",
  amapEndpoint: "",
  amapRouteEndpoint: "",
  weatherEndpoint: "",
};
let memberProfile = safeJsonParse(sessionStorage.getItem(MEMBER_PROFILE_KEY), null);
let onlineMembers = [];
const sessionId = crypto.randomUUID ? crypto.randomUUID() : uid();
let supabaseClient = null;
let realtimeChannel = null;
const urlParams = new URLSearchParams(window.location.search);
let tripId = urlParams.get("trip") || localStorage.getItem("tripboard-current-trip-id") || "";
const isReadonlyMode = urlParams.get("mode") === "readonly";
let isApplyingRemote = false;
let lastRemoteUpdatedAt = "";
let lastSyncedState = null;
let pendingLocalRemoteUpdatedAt = "";
let pendingConflict = null;
let isResolvingConflict = false;
let editLockEnabled = true;
let remoteVersionHistoryEnabled = true;
let collabTextDoc = null;
let collabTextFields = {};
let collabStructMap = null;
let collabCommentsArray = null;
let collabTextStopId = "";
let isApplyingCollabTextRemote = false;
let collabTextSaveTimer = null;
let presenceTrackTimer = null;
let yjsModule = null;
let yjsReadyPromise = null;
let collabTextBindRequestId = 0;
const initialGuideDates = defaultGuideDates();
const guideState = {
  destination: "甘肃",
  origin: "上海",
  startDate: initialGuideDates.startDate,
  endDate: initialGuideDates.endDate,
  pace: "轻松",
  budget: "舒适",
  interests: ["文化", "美食"],
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.days?.length) return stored;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return buildKyotoPlan();
}

function historyKey() {
  return `${VERSION_PREFIX}${tripId || "local"}`;
}

function versionHistory() {
  return safeJsonParse(localStorage.getItem(historyKey()), []) || [];
}

function savePlanSnapshot(plan, reason = "保存前版本", by = getCollabName()) {
  if (!plan?.days?.length) return;
  const history = versionHistory();
  const last = history[0];
  const serialized = serializePlan(plan);
  if (last?.serialized === serialized) return;
  const entry = {
    id: uid(),
    reason,
    at: new Date().toISOString(),
    by,
    serialized,
    data: clone(plan),
  };
  localStorage.setItem(historyKey(), JSON.stringify([entry, ...history].slice(0, MAX_VERSION_HISTORY)));
  queueRemoteVersionSnapshot(entry);
}

function saveVersionSnapshot(reason = "保存前版本") {
  savePlanSnapshot(state, reason);
}

function queueRemoteVersionSnapshot(entry) {
  if (!canEdit() || !supabaseClient || !tripId || !remoteVersionHistoryEnabled) return;
  supabaseClient
    .from("trip_plan_versions")
    .insert({
      trip_id: tripId,
      data: entry.data,
      reason: entry.reason,
      created_by: entry.by,
    })
    .then(({ error }) => {
      if (error) remoteVersionHistoryEnabled = false;
    });
}

async function loadRemoteVersionHistory() {
  if (!supabaseClient || !tripId || !remoteVersionHistoryEnabled) return;
  const { data, error } = await supabaseClient
    .from("trip_plan_versions")
    .select("id, data, reason, created_at, created_by")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false })
    .limit(MAX_VERSION_HISTORY);
  if (error) {
    remoteVersionHistoryEnabled = false;
    return;
  }
  const remoteEntries = (data || [])
    .filter((entry) => entry.data?.days?.length)
    .map((entry) => ({
      id: entry.id,
      reason: entry.reason || "云端历史版本",
      at: entry.created_at,
      by: entry.created_by || "未知成员",
      serialized: JSON.stringify(entry.data),
      data: entry.data,
    }));
  const merged = [...remoteEntries, ...versionHistory()];
  const deduped = [];
  const seen = new Set();
  merged.forEach((entry) => {
    if (seen.has(entry.serialized)) return;
    seen.add(entry.serialized);
    deduped.push(entry);
  });
  localStorage.setItem(historyKey(), JSON.stringify(deduped.slice(0, MAX_VERSION_HISTORY)));
}

function restoreVersion(versionId) {
  if (!requireEdit("恢复历史版本")) return;
  const entry = versionHistory().find((item) => item.id === versionId);
  if (!entry?.data?.days?.length) return;
  saveVersionSnapshot("恢复前版本");
  state = ensurePlanDates(clone(entry.data));
  activeDay = 0;
  activeStop = 0;
  logActivity(`恢复历史版本：${entry.reason || "旧版本"}`);
  saveState("已恢复历史版本");
  render();
}

async function saveState(label = "已保存到本地") {
  if (!canEdit()) {
    dom.saveState.textContent = "只读模式未保存修改";
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  dom.saveState.textContent = label;
  if (!isApplyingRemote && !isResolvingConflict && supabaseClient && tripId) {
    await pushRemoteState(label);
  }
}

function logActivity(text) {
  state.activities = [{ text, at: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) }, ...(state.activities || [])].slice(0, 6);
}

function getCollabName() {
  const name = memberProfile?.name || dom.collabName.value.trim() || localStorage.getItem("tripboard-user-name") || "匿名成员";
  localStorage.setItem("tripboard-user-name", name);
  return name;
}

function memberInitial(name) {
  const trimmed = String(name || "我").trim();
  return trimmed.slice(0, 1).toUpperCase();
}

function normalizeMemberProfile(profile = {}) {
  const name = String(profile.name || "").trim();
  const role = String(profile.role || "").trim();
  if (!name) return null;
  return {
    id: sessionId,
    name,
    role: role || "同行成员",
    joinedAt: profile.joinedAt || new Date().toISOString(),
  };
}

function saveMemberProfile(profile) {
  memberProfile = normalizeMemberProfile(profile);
  if (!memberProfile) return false;
  sessionStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(memberProfile));
  localStorage.setItem("tripboard-user-name", memberProfile.name);
  localStorage.setItem("tripboard-user-role", memberProfile.role);
  dom.collabName.value = memberProfile.name;
  dom.collabRole.value = memberProfile.role;
  return true;
}

function presencePayload() {
  const profile = memberProfile || normalizeMemberProfile({ name: dom.collabName.value.trim() || "匿名成员", role: dom.collabRole.value.trim() || "同行成员" });
  const stop = currentStop();
  const day = currentDay();
  const focusedTextField = currentFocusedTextField();
  const textSelection = textSelectionPayload(focusedTextField);
  return {
    memberId: profile?.id || sessionId,
    name: profile?.name || "匿名成员",
    role: profile?.role || "同行成员",
    activeDay: day?.label || "D1",
    activeDayId: day?.id || "",
    activeStopId: stop?.id || "",
    editing: stop?.title || "行程",
    textSelection,
    textEditing: textSelection ? textSelectionLabel(textSelection) : "",
    lockStopId: editLockEnabled && canEdit() ? stop?.id || "" : "",
    lockMode: editLockEnabled && canEdit() ? "editing" : "viewing",
    joinedAt: profile?.joinedAt || new Date().toISOString(),
    seenAt: new Date().toISOString(),
  };
}

function uniqueMembersFromPresence(presenceState) {
  const flattened = Object.values(presenceState || {}).flat().map((item) => item || {});
  const byId = new Map();
  flattened.forEach((item) => {
    const id = item.memberId || item.id || item.name || sessionId;
    const previous = byId.get(id);
    if (!previous || String(item.seenAt || "") > String(previous.seenAt || "")) {
      byId.set(id, item);
    }
  });
  return [...byId.values()];
}

function lockOwnerForStop(stopId = currentStop()?.id) {
  if (!stopId || !editLockEnabled || isReadonlyMode) return null;
  const ownMemberId = memberProfile?.id || sessionId;
  return onlineMembers.find((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (member.lockStopId !== stopId || member.lockMode !== "editing") return false;
    return freshMember(member);
  }) || null;
}

function requireStopUnlocked(actionLabel = "编辑这个地点") {
  const owner = lockOwnerForStop();
  if (!owner) return true;
  dom.saveState.textContent = `${owner.name || "其他成员"} 正在编辑`;
  dom.collabStatus.textContent = `${owner.name || "其他成员"} 正在编辑「${currentStop()?.title || "当前地点"}」，暂时不能${actionLabel}。`;
  return false;
}

function renderMembers() {
  const fallback = memberProfile ? [presencePayload()] : [];
  const members = onlineMembers.length ? onlineMembers : fallback;
  const count = members.length;
  dom.onlineCountText.textContent = count ? `${count} 位成员在线协作` : "填写信息后加入协作";
  dom.onlineAvatars.innerHTML = members
    .slice(0, 5)
    .map((member, index) => `<span class="avatar a${(index % 4) + 1}" title="${member.name} · ${member.role || "同行成员"}">${memberInitial(member.name)}</span>`)
    .join("") + (count ? `<span class="online-dot"></span>` : "");
  dom.memberList.innerHTML =
    members
      .map(
        (member, index) => {
          const textEditing = member.textEditing || (member.textSelection ? textSelectionLabel(member.textSelection) : "");
          const activity = textEditing || `${member.lockMode === "editing" ? "正在编辑" : "浏览"}：${member.editing || "计划"}`;
          return `
          <div class="member-item ${textEditing ? "is-text-editing" : ""}">
            <span class="avatar a${(index % 4) + 1}">${memberInitial(member.name)}</span>
            <p><strong>${escapeHtml(member.name || "匿名成员")}</strong><small>${escapeHtml(member.role || "同行成员")} · ${escapeHtml(member.activeDay || "在线")} · ${escapeHtml(activity)}</small></p>
            ${textEditing ? `<em>${escapeHtml(member.editing || "当前地点")}</em>` : ""}
          </div>
        `;
        },
      )
      .join("") || `<div class="member-empty">填写姓名后加入协作，在线成员会显示在这里。</div>`;
  renderTextPresence();
}

function applyReadonlyUi() {
  document.body.classList.toggle("readonly-mode", isReadonlyMode);
  const writeControls = [
    dom.createSharedTripBtn,
    dom.partySizeInput,
    dom.addStopBtn,
    dom.addDayBtn,
    dom.moveDayUpBtn,
    dom.moveDayDownBtn,
    dom.deleteDayBtn,
    dom.applyGuideBtn,
    dom.recommendedPlanBtn,
    dom.blankPlanBtn,
    dom.optimizeRouteBtn,
    dom.amapRouteBtn,
    dom.deleteStopBtn,
    dom.moveUpBtn,
    dom.moveDownBtn,
    dom.favoriteBtn,
    dom.mustVote,
    dom.ctripSyncTransportBtn,
    dom.resetBtn,
    dom.saveServiceConfigBtn,
    dom.syncWeatherBtn,
  ];
  writeControls.forEach((control) => {
    if (control) control.disabled = isReadonlyMode;
  });
  [
    dom.stopForm,
    dom.dayForm,
    dom.quickAddForm,
    dom.importForm,
    dom.manualQuoteForm,
  ].forEach((form) => {
    form?.querySelectorAll("input, textarea, select, button").forEach((control) => {
      control.disabled = isReadonlyMode;
    });
  });
  dom.commentForm?.querySelectorAll("input, button").forEach((control) => {
    control.disabled = isReadonlyMode;
  });
  document.querySelectorAll(".guide-controls input, .guide-controls button, .choice-card").forEach((control) => {
    control.disabled = isReadonlyMode;
  });
  document.querySelectorAll(".connector-grid input, .connector-grid button").forEach((control) => {
    control.disabled = isReadonlyMode;
  });
  dom.candidateGrid.querySelectorAll("button").forEach((button) => {
    button.disabled = isReadonlyMode;
  });
  document.querySelectorAll(".sync-card").forEach((button) => {
    button.disabled = isReadonlyMode;
  });
  dom.copySharedLinkBtn.textContent = isReadonlyMode ? "复制当前只读链接" : "复制编辑链接";
  if (pendingConflict) {
    dom.collabMode.textContent = "待处理冲突";
    dom.saveState.textContent = "发现协作冲突";
    return;
  }
  if (isReadonlyMode) {
    dom.collabMode.textContent = "只读查看";
    dom.saveState.textContent = "只读模式";
    dom.presenceText.textContent = "你正在查看计划";
    dom.guideProgress.textContent = "只读";
  } else {
    dom.presenceText.textContent = "你正在编辑计划";
    dom.guideProgress.textContent = "可保存";
  }
}

function renderVersionHistory() {
  const history = versionHistory();
  dom.versionCount.textContent = `${history.length} 条`;
  dom.versionList.innerHTML =
    history
      .map((entry) => {
        const date = new Date(entry.at);
        const time = Number.isNaN(date.getTime()) ? "刚刚" : date.toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
        return `
          <button class="version-item" data-version="${entry.id}">
            <strong>${entry.reason || "历史版本"}</strong>
            <span>${time} · ${entry.by || "未知成员"}</span>
          </button>
        `;
      })
      .join("") || `<div class="member-empty">开始编辑后会自动保存最近 ${MAX_VERSION_HISTORY} 个版本。</div>`;
}

function renderEditorLockState() {
  const owner = lockOwnerForStop();
  const locked = Boolean(owner);
  dom.editorPanel?.classList.toggle("is-locked", locked);
  if (dom.editLockBanner) dom.editLockBanner.hidden = !locked;
  if (dom.editLockText) dom.editLockText.textContent = locked ? `${owner.name || "其他成员"} 正在编辑「${currentStop()?.title || "当前地点"}」，此处已临时锁定。` : "";
  if (dom.editorLockState) dom.editorLockState.textContent = locked ? "协作锁定" : "保存后立即更新";
  [
    dom.stopForm,
  ].forEach((form) => {
    form?.querySelectorAll("input, textarea, select, button").forEach((control) => {
      control.disabled = isReadonlyMode || locked;
    });
  });
  COLLAB_TEXT_FIELDS.forEach(({ domKey }) => {
    if (dom[domKey]) dom[domKey].disabled = isReadonlyMode;
  });
  COLLAB_STRUCT_FIELDS.forEach(({ domKey }) => {
    if (dom[domKey]) dom[domKey].disabled = isReadonlyMode;
  });
  if (locked && dom.noteCollabStatus && !isReadonlyMode) {
    dom.noteCollabStatus.textContent = "移动、删除和回填操作已锁定，地点详情字段仍可多人实时协作";
  }
  [
    dom.amapLookupBtn,
    dom.moveUpBtn,
    dom.moveDownBtn,
    dom.deleteStopBtn,
  ].forEach((button) => {
    if (button) button.disabled = isReadonlyMode || locked;
  });
}

async function trackPresence() {
  if (!realtimeChannel || !memberProfile) {
    renderMembers();
    renderEditorLockState();
    return;
  }
  const payload = presencePayload();
  await realtimeChannel.track(payload);
  upsertOnlineMember(payload);
  broadcastTextSelection();
  renderMembers();
  renderEditorLockState();
}

function schedulePresenceTrack(delay = 120) {
  clearTimeout(presenceTrackTimer);
  presenceTrackTimer = setTimeout(() => {
    trackPresence();
  }, delay);
}

function getShareUrl() {
  if (!tripId) return "";
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  url.searchParams.delete("mode");
  return url.toString();
}

function getReadonlyShareUrl() {
  if (!tripId) return "";
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  url.searchParams.set("mode", "readonly");
  return url.toString();
}

function canEdit() {
  return !isReadonlyMode;
}

function requireEdit(actionLabel = "编辑") {
  if (canEdit()) return true;
  dom.saveState.textContent = `只读模式不能${actionLabel}`;
  dom.collabStatus.textContent = "当前是只读链接，可以查看计划和显示在线成员，但不能修改行程。";
  return false;
}

function initSupabaseClient() {
  const config = window.TRIPBOARD_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase?.createClient) {
    dom.collabMode.textContent = "本地模式";
    dom.collabStatus.textContent = "未配置 Supabase，当前计划只保存在这个浏览器。";
    return;
  }
  supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  dom.collabMode.textContent = isReadonlyMode ? "只读查看" : tripId ? "云端协作" : "可创建共享";
  dom.collabStatus.textContent = isReadonlyMode ? "当前是只读链接，可以查看计划和显示在线成员。" : tripId ? `已连接计划：${tripId}` : "已配置云端，可创建共享计划。";
}

async function pushRemoteState(label = "已同步云端") {
  if (!supabaseClient || !tripId) return;
  if (!canEdit()) {
    dom.collabStatus.textContent = "当前是只读链接，不能向云端写入计划。";
    return;
  }
  if (pendingConflict) {
    showConflictPanel(pendingConflict);
    return;
  }
  const payload = {
    id: tripId,
    data: state,
    updated_at: new Date().toISOString(),
    updated_by: getCollabName(),
  };
  pendingLocalRemoteUpdatedAt = payload.updated_at;
  let error = null;
  let data = null;
  if (lastRemoteUpdatedAt) {
    const result = await supabaseClient
      .from("trip_plans")
      .update(payload)
      .eq("id", tripId)
      .eq("updated_at", lastRemoteUpdatedAt)
      .select("data, updated_at, updated_by")
      .maybeSingle();
    error = result.error;
    data = result.data;
    if (!error && !data) {
      const remote = await fetchRemotePlan();
      if (remote?.error) return;
      if (remote?.data?.days?.length) {
        const remotePlan = ensurePlanDates(clone(remote.data));
        if (sameSerialized(state, remotePlan)) {
          lastRemoteUpdatedAt = remote.updated_at || lastRemoteUpdatedAt;
          lastSyncedState = clone(remotePlan);
          dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "云端协作";
          dom.collabStatus.textContent = `${label}，共享链接可复制给其他成员。`;
          return;
        }
        showConflictPanel({
          remote: remotePlan,
          local: clone(state),
          base: clone(lastSyncedState || {}),
          updatedAt: remote.updated_at || "",
          updatedBy: remote.updated_by || "",
          reason: "save",
        });
        return;
      }
      const insertResult = await supabaseClient.from("trip_plans").upsert(payload, { onConflict: "id" }).select("data, updated_at, updated_by").maybeSingle();
      error = insertResult.error;
      data = insertResult.data;
    }
  } else {
    const result = await supabaseClient.from("trip_plans").upsert(payload, { onConflict: "id" }).select("data, updated_at, updated_by").maybeSingle();
    error = result.error;
    data = result.data;
  }
  if (error) {
    pendingLocalRemoteUpdatedAt = "";
    dom.collabStatus.textContent = `云端同步失败：${error.message}`;
    return;
  }
  lastRemoteUpdatedAt = data?.updated_at || payload.updated_at;
  lastSyncedState = clone(state);
  hideConflictPanel();
  dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "云端协作";
  dom.collabStatus.textContent = `${label}，共享链接可复制给其他成员。`;
}

async function fetchRemotePlan() {
  if (!supabaseClient || !tripId) return null;
  const { data, error } = await supabaseClient.from("trip_plans").select("data, updated_at, updated_by").eq("id", tripId).maybeSingle();
  if (error) {
    dom.collabStatus.textContent = `读取共享计划失败：${error.message}`;
    return { error };
  }
  return data;
}

async function loadRemoteState() {
  if (!supabaseClient || !tripId) return;
  const data = await fetchRemotePlan();
  if (data?.data?.days?.length) {
    saveVersionSnapshot("载入云端前版本");
    applyRemotePlan(data.data, { updatedAt: data.updated_at || "" });
    dom.saveState.textContent = `已载入共享计划`;
    dom.collabStatus.textContent = isReadonlyMode
      ? data.updated_by
        ? `只读查看，最近由 ${data.updated_by} 更新`
        : "只读查看，已连接共享计划"
      : data.updated_by
        ? `最近由 ${data.updated_by} 更新`
        : `已连接共享计划`;
    render();
  } else if (!isReadonlyMode) {
    await pushRemoteState("已创建共享计划");
  } else {
    dom.saveState.textContent = "只读模式";
    dom.collabStatus.textContent = "这个只读链接暂时没有找到对应的共享计划，请向创建者确认链接。";
  }
}

function subscribeRemoteState() {
  if (!supabaseClient || !tripId) return;
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }
  realtimeChannel = supabaseClient
    .channel(`trip-plan-${tripId}`, {
      config: {
        presence: {
          key: sessionId,
        },
        broadcast: {
          self: false,
        },
      },
    })
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_plans", filter: `id=eq.${tripId}` },
      (payload) => {
        const next = payload.new;
        handleRemotePlanUpdate(next);
      },
    )
    .on("broadcast", { event: "stop-text-yjs-update" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteTextUpdate(payload);
    })
    .on("broadcast", { event: "stop-text-selection-update" }, ({ payload }) => {
      if (!payload || payload.memberId === (memberProfile?.id || sessionId)) return;
      if (payload.roomId !== currentTextRoomId(payload.stopId)) return;
      upsertOnlineMember(payload);
      renderMembers();
      renderEditorLockState();
    })
    .on("broadcast", { event: "stop-created" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopCreated(payload);
    })
    .on("broadcast", { event: "stop-deleted" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopDeleted(payload);
    })
    .on("broadcast", { event: "stops-reordered" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopsReordered(payload);
    })
    .on("broadcast", { event: "day-updated" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayUpdated(payload);
    })
    .on("broadcast", { event: "day-created" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayCreated(payload);
    })
    .on("broadcast", { event: "day-deleted" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayDeleted(payload);
    })
    .on("broadcast", { event: "days-reordered" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDaysReordered(payload);
    })
    .on("broadcast", { event: "plan-replaced" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemotePlanReplaced(payload);
    })
    .on("presence", { event: "sync" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      renderMembers();
      renderEditorLockState();
    })
    .on("presence", { event: "join" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      renderMembers();
      renderEditorLockState();
    })
    .on("presence", { event: "leave" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      renderMembers();
      renderEditorLockState();
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "实时同步";
        bindCollabTextDoc();
        trackPresence();
      }
    });
}

async function connectSharedTrip(id) {
  tripId = id;
  lastRemoteUpdatedAt = "";
  lastSyncedState = null;
  hideConflictPanel();
  localStorage.setItem("tripboard-current-trip-id", tripId);
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  window.history.replaceState({}, "", url.toString());
  await loadRemoteState();
  await loadRemoteVersionHistory();
  renderVersionHistory();
  subscribeRemoteState();
  if (!memberProfile) {
    dom.collabStatus.textContent = "请填写姓名和身份，然后点击“加入协作”，其他成员就能看到你在线。";
  }
}

async function createSharedTrip() {
  if (!requireEdit("创建共享计划")) return;
  if (!supabaseClient) {
    dom.collabStatus.textContent = "请先配置 config.js 里的 Supabase URL 和 anon key。";
    return;
  }
  const id = crypto.randomUUID ? crypto.randomUUID() : uid();
  tripId = id;
  lastRemoteUpdatedAt = "";
  lastSyncedState = null;
  hideConflictPanel();
  localStorage.setItem("tripboard-current-trip-id", tripId);
  await pushRemoteState("已创建共享计划");
  subscribeRemoteState();
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  window.history.replaceState({}, "", url.toString());
  dom.collabStatus.textContent = "共享计划已创建，可以复制链接给其他成员。";
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function refreshIcons() {
  window.lucide?.createIcons();
}

function currentDay() {
  return state.days[activeDay] || state.days[0];
}

function currentStop() {
  const day = currentDay();
  return day?.stops[activeStop] || day?.stops[0];
}

function guideDayCount() {
  return daysBetweenInclusive(guideState.startDate, guideState.endDate);
}

function timeToMinutes(value) {
  if (!value) return null;
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function addMinutesToTime(value, minutes) {
  const base = timeToMinutes(value) ?? 0;
  const next = (base + minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
}

function stableNumber(input) {
  return Array.from(String(input || "")).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function defaultTransportRoute(day) {
  const text = day?.route || day?.title || "";
  const parts = text
    .split(/[·→\-—]/)
    .map((item) => item.trim())
    .filter(Boolean);
  let from = parts[0] || state.origin || "出发城市";
  let to = parts[1] || state.destination || "目的地";
  if (from.startsWith("抵达")) {
    to = from.replace(/^抵达/, "").trim() || state.destination || "目的地";
    from = state.origin || "出发城市";
  }
  if (/返程|返回/.test(text)) {
    from = parts[0]?.replace(/返程|返回/g, "").trim() || state.destination || "目的地";
    to = state.origin || "返回城市";
  }
  return { from, to };
}

function transportDuration(type, seed) {
  return type === "flight" ? 105 + (seed % 70) : 145 + (seed % 110);
}

function buildTransportOptions(day, index) {
  const { from, to } = defaultTransportRoute(day);
  const seed = stableNumber(`${state.destination}-${day?.date || index}-${day?.route || ""}`);
  const flightCodes = ["MU", "CA", "CZ", "HO", "3U", "9C"];
  const trainCodes = ["G", "D", "C", "G", "D", "G"];
  const flightTimes = ["07:35", "09:50", "12:20", "15:40", "18:15", "21:05"];
  const trainTimes = ["06:58", "08:46", "11:18", "14:05", "16:42", "19:30"];
  const flightBase = 520 + (seed % 360) + index * 28;
  const trainBase = 180 + (seed % 190) + index * 16;

  const makeOption = (type, time, optionIndex) => {
    const optionSeed = seed + optionIndex * 37 + (type === "flight" ? 100 : 20);
    const duration = transportDuration(type, optionSeed);
    const priceBase = type === "flight" ? flightBase : trainBase;
    const price = priceBase + optionIndex * (type === "flight" ? 76 : 34) + (optionSeed % (type === "flight" ? 90 : 46));
    const code =
      type === "flight"
        ? `${flightCodes[optionIndex % flightCodes.length]}${1300 + ((seed + optionIndex * 47) % 760)}`
        : `${trainCodes[optionIndex % trainCodes.length]}${120 + ((seed + optionIndex * 29) % 760)}`;
    return {
      id: `${type}-${day?.date || index}-${optionIndex}`,
      type,
      code,
      from,
      to,
      depart: time,
      arrive: addMinutesToTime(time, duration),
      duration,
      price,
      source: "示例报价",
    };
  };

  return [
    ...flightTimes.map((time, optionIndex) => makeOption("flight", time, optionIndex)),
    ...trainTimes.map((time, optionIndex) => makeOption("train", time, optionIndex)),
  ];
}

function averagePrice(options, type) {
  const scoped = options.filter((item) => item.type === type);
  if (!scoped.length) return 0;
  return Math.round(scoped.reduce((sum, item) => sum + item.price, 0) / scoped.length);
}

function saveServiceConfig() {
  serviceConfig = {
    aiEndpoint: dom.aiRouteEndpointInput.value.trim(),
    aiToken: dom.aiRouteTokenInput.value.trim(),
    amapEndpoint: dom.amapEndpointInput.value.trim(),
    amapRouteEndpoint: dom.amapRouteEndpointInput.value.trim(),
    weatherEndpoint: dom.weatherEndpointInput.value.trim(),
  };
  localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
  renderServiceStatus();
}

function serviceHeaders(token, endpoint = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const appConfig = window.TRIPBOARD_CONFIG || {};
  if (!token && endpoint.includes("supabase.co/functions/v1") && appConfig.supabaseAnonKey) {
    headers.apikey = appConfig.supabaseAnonKey;
    headers.Authorization = `Bearer ${appConfig.supabaseAnonKey}`;
  }
  return headers;
}

function renderServiceStatus() {
  const connected = [
    serviceConfig.aiEndpoint && "AI",
    serviceConfig.amapEndpoint && "高德地点",
    serviceConfig.amapRouteEndpoint && "高德路线",
    serviceConfig.weatherEndpoint && "天气代理",
  ].filter(Boolean);
  dom.serviceConfigStatus.textContent = connected.length ? `已配置 ${connected.join(" / ")}` : "本地兜底";
  dom.serviceStatusText.textContent = connected.length
    ? `已保存 ${connected.join("、")} 接口。密钥只放在后端代理；AI 或高德未配置密钥时会保留本地兜底能力。`
    : "AI、高德需要后端代理保存密钥；天气未配置代理时使用 Open-Meteo 免费接口。";
}

function weatherLabel(code) {
  const map = {
    0: "晴",
    1: "少云",
    2: "多云",
    3: "阴",
    45: "雾",
    48: "雾凇",
    51: "小毛毛雨",
    53: "毛毛雨",
    55: "强毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    80: "阵雨",
    81: "强阵雨",
    82: "暴雨",
    95: "雷雨",
  };
  return map[Number(code)] || "天气待确认";
}

async function geocodeDestination() {
  const query = state.destination || guideState.destination || "";
  if (!query) return null;
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=zh&format=json`;
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.reason || data.error || `HTTP ${response.status}`);
  const result = data.results?.[0];
  if (!result) return null;
  return { latitude: result.latitude, longitude: result.longitude, name: result.name };
}

async function requestWeatherForecast() {
  const payload = {
    destination: state.destination,
    startDate: state.startDate,
    endDate: state.endDate,
    days: state.days.map((day) => ({ id: day.id, date: day.date, title: day.title })),
  };
  if (serviceConfig.weatherEndpoint) {
    const response = await fetch(serviceConfig.weatherEndpoint, {
      method: "POST",
      headers: serviceHeaders("", serviceConfig.weatherEndpoint),
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || `HTTP ${response.status}`);
    return { source: data.source || "weather-proxy", days: Array.isArray(data.days) ? data.days : [] };
  }

  const place = await geocodeDestination();
  if (!place) throw new Error("没有找到目的地坐标，请尝试填写更具体的城市名，或配置自己的天气代理。");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=16`;
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.reason || data.error || `HTTP ${response.status}`);
  const days = (data.daily?.time || []).map((date, index) => ({
    date,
    text: `${Math.round(data.daily.temperature_2m_min?.[index] ?? 0)}-${Math.round(data.daily.temperature_2m_max?.[index] ?? 0)}°C ${weatherLabel(data.daily.weather_code?.[index])} · 降水${Math.round(data.daily.precipitation_probability_max?.[index] ?? 0)}%`,
  }));
  return { source: `Open-Meteo · ${place.name}`, days };
}

async function syncWeather() {
  if (!requireEdit("同步天气")) return;
  saveVersionSnapshot("同步天气前版本");
  dom.serviceStatusText.textContent = "正在同步天气...";
  try {
    const forecast = await requestWeatherForecast();
    let applied = 0;
    state.days.forEach((day, index) => {
      const match = forecast.days.find((item) => item.date && item.date === day.date) || forecast.days[index];
      if (!match) return;
      day.weather = match.text || match.weather || match.summary || day.weather;
      applied += 1;
    });
    logActivity(`同步天气 ${applied} 天`);
    saveState("已同步天气");
    dom.serviceStatusText.textContent = `已同步 ${applied} 天天气，来源：${forecast.source || "天气接口"}。`;
    render();
  } catch (error) {
    dom.serviceStatusText.textContent = `天气同步失败：${error.message}`;
  }
}

function normalizeTransportItem(item, index, fallbackRoute) {
  const type = item.type === "train" || item.type === "flight" ? item.type : String(item.type || "").includes("train") ? "train" : "flight";
  const depart = item.depart || item.departTime || item.startTime || "09:00";
  const arrive = item.arrive || item.arriveTime || item.endTime || addMinutesToTime(depart, Number(item.duration || 120));
  const duration = Number(item.duration || Math.max(30, (timeToMinutes(arrive) ?? 0) - (timeToMinutes(depart) ?? 0)) || 120);
  const stops = Number(item.stops ?? item.stopCount ?? 0);
  return {
    id: item.id || `provider-${Date.now()}-${index}`,
    type,
    code: item.code || item.flightNo || item.trainNo || `${type === "flight" ? "Flight" : "Train"} ${index + 1}`,
    from: item.from || fallbackRoute.from,
    to: item.to || fallbackRoute.to,
    depart,
    arrive,
    duration,
    price: Number(item.price || item.amount || item.lowestPrice || 0),
    source: item.source || "外部接口",
    carrier: item.carrier || item.airline || "",
    stops: Number.isFinite(stops) ? Math.max(0, stops) : 0,
  };
}

function officialTransportLinks(route, day) {
  const date = day?.date || "";
  const from = encodeURIComponent(route.from || "");
  const to = encodeURIComponent(route.to || "");
  const query = encodeURIComponent(`${route.from} 到 ${route.to} ${date} 机票 火车票`);
  return {
    ctrip: `https://www.ctrip.com/search2/?word=${query}`,
    trip: `https://www.trip.com/search?keyword=${query}`,
    rail: `https://www.12306.cn/index/`,
  };
}

function durationFromTimes(depart, arrive) {
  const start = timeToMinutes(depart);
  const end = timeToMinutes(arrive);
  if (start === null || end === null) return 0;
  return Math.max(0, end >= start ? end - start : end + 24 * 60 - start);
}

function manualTransportQuotes() {
  return state.transportQuotes || [];
}

function currentManualQuotes(day) {
  return manualTransportQuotes().filter((item) => item.date === day?.date || (!item.date && item.dayId === day?.id));
}

function normalizeImportCategory(value, provider = "") {
  const text = `${value || ""} ${provider || ""}`;
  if (/住宿|酒店|民宿|入住|离店|房型/.test(text)) return "住宿";
  if (/交通|航班|机票|动车|高铁|火车|车次|机场|车站/.test(text)) return "交通";
  if (/景点|门票|入园|预约|景区/.test(text)) return "景点";
  if (/餐饮|餐厅|美团|点评|团购|套餐|到店|排队/.test(text)) return "餐饮";
  return ["住宿", "餐饮", "交通", "景点", "其他"].includes(value) ? value : "其他";
}

function providerDefaults(provider = "") {
  const category = normalizeImportCategory("", provider);
  const defaults = {
    住宿: { title: "住宿入住", time: "15:00", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" },
    餐饮: { title: "餐厅预约", time: "18:30", image: images.food },
    交通: { title: "交通订单", time: "09:00", image: images.train },
    景点: { title: "景点预约", time: "10:00", image: images.museum },
    其他: { title: "外部记录", time: "10:00", image: images.city },
  };
  return { category, ...defaults[category] };
}

function dayIndexByDate(dateValue) {
  if (!dateValue) return activeDay;
  const index = state.days.findIndex((day) => day.date === dateValue);
  return index >= 0 ? index : activeDay;
}

function importDateOptionsText(dateValue) {
  const exactIndex = dateValue ? state.days.findIndex((day) => day.date === dateValue) : -1;
  const index = exactIndex >= 0 ? exactIndex : activeDay;
  const day = state.days[index];
  const label = day?.date ? `${day.label} · ${formatDisplayDate(day.date)}` : currentDay()?.label || "当前天";
  return dateValue && exactIndex < 0 ? `未匹配计划日期，将导入 ${label}` : label;
}

function parseMultiOrigins(value) {
  return String(value || "")
    .split(/[\n;；,，]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((entry, index) => {
      const parts = entry.split(/[:：]/);
      if (parts.length > 1) {
        return { name: parts[0].trim() || `成员${index + 1}`, from: parts.slice(1).join(":").trim() };
      }
      return { name: `成员${index + 1}`, from: entry };
    })
    .filter((item) => item.from);
}

function transportDurationText(minutes) {
  const duration = Number(minutes || 0);
  if (!duration) return "时长待确认";
  return `约${Math.floor(duration / 60)}小时${duration % 60}分`;
}

function bestFlightOption(items) {
  const flights = items
    .filter((item) => item.type === "flight")
    .filter((item) => Number(item.price) > 0)
    .sort((a, b) => {
      const priceGap = Number(a.price) - Number(b.price);
      if (priceGap) return priceGap;
      const stopsGap = Number(a.stops || 0) - Number(b.stops || 0);
      if (stopsGap) return stopsGap;
      return Number(a.duration || 0) - Number(b.duration || 0);
    });
  return flights[0] || items.filter((item) => item.type === "flight")[0] || null;
}

function compareScore(option) {
  if (!option) return Number.POSITIVE_INFINITY;
  return Number(option.price || 99999) + Number(option.duration || 0) * 1.6 + Number(option.stops || 0) * 180;
}

function renderMultiOriginResults() {
  if (!multiOriginComparisons.length) {
    dom.multiOriginResults.innerHTML = "";
    return;
  }
  const successful = multiOriginComparisons.filter((item) => item.best);
  const total = successful.reduce((sum, item) => sum + Number(item.best.price || 0), 0);
  const average = successful.length ? Math.round(total / successful.length) : 0;
  const bestScore = successful.length ? Math.min(...successful.map((item) => compareScore(item.best))) : Number.POSITIVE_INFINITY;
  const earliestArrive = successful
    .map((item) => item.best.arrive)
    .filter(Boolean)
    .sort()[0];
  const latestArrive = successful
    .map((item) => item.best.arrive)
    .filter(Boolean)
    .sort()
    .at(-1);
  dom.multiOriginResults.innerHTML = `
    <div class="multi-origin-summary">
      <strong>${successful.length}/${multiOriginComparisons.length} 人已匹配航班</strong>
      <span>合计最低预算 ${money(total)} · 人均 ${money(average)}${earliestArrive ? ` · 抵达 ${earliestArrive}${latestArrive && latestArrive !== earliestArrive ? `-${latestArrive}` : ""}` : ""}</span>
    </div>
    ${multiOriginComparisons
      .map((item) => {
        if (item.loading) {
          return `
            <article class="multi-origin-item is-loading">
              <strong>${escapeHtml(item.name)} · ${escapeHtml(item.from)}</strong>
              <span>正在查询 ${escapeHtml(item.from)} → ${escapeHtml(item.to)} 的航班报价...</span>
            </article>
          `;
        }
        if (!item.best) {
          return `
            <article class="multi-origin-item is-empty">
              <strong>${escapeHtml(item.name)} · ${escapeHtml(item.from)}</strong>
              <span>${escapeHtml(item.error || "没有匹配航班，可调整机场码或日期。")}</span>
            </article>
          `;
        }
        const score = compareScore(item.best);
        const tag = score === bestScore ? "推荐" : score <= bestScore * 1.25 ? "备选" : "成本偏高";
        const carrier = item.best.carrier ? ` · ${escapeHtml(item.best.carrier)}` : "";
        return `
          <article class="multi-origin-item">
            <div>
              <strong>${escapeHtml(item.name)} · ${escapeHtml(item.from)} → ${escapeHtml(item.to)}</strong>
              <span>${escapeHtml(item.best.code)} · ${escapeHtml(item.best.depart)} - ${escapeHtml(item.best.arrive)} · ${transportDurationText(item.best.duration)} · ${item.best.stops || 0}次经停${carrier}</span>
            </div>
            <em>${money(item.best.price)}</em>
            <b>${tag}</b>
          </article>
        `;
      })
      .join("")}
  `;
}

function parseExternalOrderText(text, provider = pendingProvider) {
  const source = String(text || "");
  const currentYear = new Date().getFullYear();
  const amountMatch = source.match(/(?:¥|￥|金额|房费|总价|合计|实付|支付|付款)[^\d]{0,8}(\d+(?:\.\d+)?)/);
  const timeMatch = source.match(/(?:\b|[^0-9])([01]?\d|2[0-3])[:：]([0-5]\d)(?:\b|[^0-9])/);
  const fullDateMatch = source.match(/(20\d{2})[年/\-.](\d{1,2})[月/\-.](\d{1,2})日?/);
  const dateMatch = source.match(/(\d{1,2})月(\d{1,2})日/);
  const dateTimeMatch = source.match(/(\d{1,2})月(\d{1,2})日[^0-9]{0,8}([01]?\d|2[0-3])[:：]([0-5]\d)/);
  const addressMatch = source.match(/(?:地址|地点|位置|入住地址|到店地址|集合点)[:：\s]*(.+?)(?:\n|$)/);
  const titleMatch = source.match(/(?:商户|酒店|民宿|餐厅|名称|订单|项目|景点)[:：\s]*(.+?)(?:\n|$)/);
  const orderMatch = source.match(/(?:订单号|订单编号|券码|确认号|预订号)[:：\s]*([A-Za-z0-9-]{5,})/);
  const urlMatch = source.match(/https?:\/\/[^\s]+/);
  const category = normalizeImportCategory(source, provider);
  const defaults = providerDefaults(provider || category);
  const date = fullDateMatch
    ? `${fullDateMatch[1]}-${fullDateMatch[2].padStart(2, "0")}-${fullDateMatch[3].padStart(2, "0")}`
    : dateMatch
    ? `${currentYear}-${dateMatch[1].padStart(2, "0")}-${dateMatch[2].padStart(2, "0")}`
    : "";
  const budget = amountMatch ? Math.round(Number(amountMatch[1])) : 0;
  return {
    provider,
    category,
    title: titleMatch?.[1]?.trim() || defaults.title,
    date,
    time: dateTimeMatch ? `${dateTimeMatch[3].padStart(2, "0")}:${dateTimeMatch[4]}` : timeMatch ? `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}` : "",
    budget,
    paid: budget,
    address: addressMatch?.[1]?.trim(),
    orderNo: orderMatch?.[1] || "",
    sourceUrl: urlMatch?.[0] || "",
    note: source.slice(0, 900),
    confidence: 0.45,
    warnings: ["本地规则解析结果，请核对后导入。"],
  };
}

function applyParsedImport(parsed = {}, source = "本地解析") {
  const category = normalizeImportCategory(parsed.category, pendingProvider);
  const defaults = providerDefaults(category);
  dom.importCategory.value = category;
  if (parsed.date) dom.importDate.value = parsed.date;
  if (parsed.title) dom.importName.value = parsed.title;
  else if (!dom.importName.value) dom.importName.value = defaults.title;
  if (parsed.time) dom.importTime.value = parsed.time;
  if (Number(parsed.amount ?? parsed.budget)) dom.importBudget.value = Math.round(Number(parsed.amount ?? parsed.budget));
  if (Number(parsed.paid ?? parsed.amount ?? parsed.budget)) dom.importPaid.value = Math.round(Number(parsed.paid ?? parsed.amount ?? parsed.budget));
  if (parsed.payer) dom.importPayer.value = parsed.payer;
  if (parsed.address) dom.importAddress.value = parsed.address;
  if (parsed.orderNo) dom.importOrderNo.value = parsed.orderNo;
  if (parsed.sourceUrl) dom.importSourceUrl.value = parsed.sourceUrl;
  lastParsedImport = { ...parsed, category, source };
  renderImportPreview(lastParsedImport);
}

function renderImportPreview(parsed) {
  if (!dom.importPreview) return;
  if (!parsed) {
    dom.importPreview.hidden = true;
    dom.importPreview.innerHTML = "";
    return;
  }
  const confidence = Math.round(Number(parsed.confidence || 0) * 100);
  const warnings = Array.isArray(parsed.warnings) ? parsed.warnings : [];
  dom.importPreview.hidden = false;
  dom.importPreview.innerHTML = `
    <div class="import-preview-head">
      <strong>${escapeHtml(parsed.source || "解析结果")}</strong>
      <span>${confidence ? `可信度 ${confidence}%` : "请人工核对"}</span>
    </div>
    <dl>
      <div><dt>类别</dt><dd>${escapeHtml(parsed.category || dom.importCategory.value || "其他")}</dd></div>
      <div><dt>日期</dt><dd>${escapeHtml(parsed.date || dom.importDate.value || "按当前天")}</dd></div>
      <div><dt>名称</dt><dd>${escapeHtml(parsed.title || dom.importName.value || "外部记录")}</dd></div>
      <div><dt>金额</dt><dd>${money(parsed.amount ?? parsed.budget ?? dom.importBudget.value)}</dd></div>
      <div><dt>地址</dt><dd>${escapeHtml(parsed.address || dom.importAddress.value || "待确认")}</dd></div>
      <div><dt>导入到</dt><dd>${escapeHtml(importDateOptionsText(parsed.date || dom.importDate.value))}</dd></div>
    </dl>
    ${warnings.length ? `<ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>` : ""}
  `;
}

async function requestExternalOrderParse() {
  const text = dom.importNote.value.trim();
  if (!text) throw new Error("请先粘贴订单短信、邮件、分享文本或截图识别出的文字。");
  if (!externalImportConfig.endpoint) {
    return { source: "本地规则", parsed: parseExternalOrderText(text, pendingProvider) };
  }
  const response = await fetchWithTimeout(externalImportConfig.endpoint, {
    method: "POST",
    headers: serviceHeaders(externalImportConfig.token, externalImportConfig.endpoint),
    body: JSON.stringify({
      provider: pendingProvider,
      destination: state.destination || "",
      tripStartDate: state.startDate || "",
      tripEndDate: state.endDate || "",
      text,
    }),
  }, EXTERNAL_IMPORT_TIMEOUT_MS);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  return { source: data.source || "AI 解析", parsed: data.parsed || data };
}

function matchesTransportFilter(option) {
  const type = dom.transportType.value;
  const from = dom.transportFrom.value.trim();
  const to = dom.transportTo.value.trim();
  const start = timeToMinutes(dom.transportStartTime.value);
  const end = timeToMinutes(dom.transportEndTime.value);
  const depart = timeToMinutes(option.depart);
  if (type !== "all" && option.type !== type) return false;
  if (from && !option.from.includes(from)) return false;
  if (to && !option.to.includes(to)) return false;
  if (start !== null && depart < start) return false;
  if (end !== null && depart > end) return false;
  return true;
}

function renderTransport() {
  const day = currentDay();
  ensurePlanOrigin(state);
  const route = defaultTransportRoute(day);
  const manualQuotes = currentManualQuotes(day);
  const baseOptions = transportProviderItems.length ? transportProviderItems : buildTransportOptions(day, activeDay);
  const options = [...manualQuotes, ...baseOptions];
  const filtered = options.filter(matchesTransportFilter);
  const visible = transportFilterApplied ? filtered : filtered.slice(0, 4);
  if (!dom.transportFrom.value) dom.transportFrom.value = route.from;
  if (!dom.transportTo.value) dom.transportTo.value = route.to;
  const links = officialTransportLinks(route, day);
  dom.openCtripSearchLink.href = links.ctrip;
  dom.openTripSearchLink.href = links.trip;
  dom.openRailSearchLink.href = links.rail;

  dom.flightAvgPrice.textContent = money(averagePrice(options, "flight"));
  dom.trainAvgPrice.textContent = money(averagePrice(options, "train"));
  const isDemoProxy = transportProviderSource === "demo" || transportProviderItems.some((item) => /示例/.test(item.source || ""));
  dom.transportProviderStatus.textContent = manualQuotes.length ? "手动报价" : transportProviderItems.length ? (isDemoProxy ? "代理示例" : "真实接口") : "本地示例";
  dom.transportDayHint.textContent = `${day?.date ? formatDisplayDate(day.date) : day?.label} · ${route.from} 到 ${route.to}，${
    manualQuotes.length
      ? `已保存 ${manualQuotes.length} 条手动报价；也可以继续打开官方页面查询。`
      : transportProviderItems.length
      ? isDemoProxy
        ? "后端已连通，但当前仍是代理示例数据。"
        : "当前显示后端真实接口返回的报价。"
      : "当前为本地生成的可筛选示例报价。"
  }`;
  dom.transportList.innerHTML =
    visible
      .map(
        (item) => `
          <article class="transport-item">
            <span class="transport-icon">${icon(item.type === "flight" ? "plane" : "train-front")}</span>
            <div>
              <strong>${item.code} · ${item.from} → ${item.to}</strong>
              <span>${item.depart} - ${item.arrive} · 约${Math.floor(item.duration / 60)}小时${item.duration % 60}分 · ${item.source}</span>
            </div>
            <em>${money(item.price)}</em>
          </article>
        `,
      )
      .join("") || `<p class="empty-state">这个时间段暂时没有匹配班次，可以放宽时间或切换类型。</p>`;
}

function setCtripStatus(message, iconName = "info") {
  dom.ctripStatus.innerHTML = `${icon(iconName)}<span>${message}</span>`;
  refreshIcons();
}

function getCtripPayload() {
  const day = currentDay();
  const route = defaultTransportRoute(day);
  return {
    tripId,
    date: day?.date || "",
    from: dom.transportFrom.value.trim() || route.from,
    to: dom.transportTo.value.trim() || route.to,
    type: dom.transportType.value || "all",
    startTime: dom.transportStartTime.value || "",
    endTime: dom.transportEndTime.value || "",
  };
}

function saveCtripConfig() {
  ctripConfig = {
    endpoint: dom.ctripEndpointInput.value.trim(),
    token: dom.ctripTokenInput.value.trim(),
  };
  localStorage.setItem(CTRIP_CONFIG_KEY, JSON.stringify(ctripConfig));
  dom.syncBadge.textContent = ctripConfig.endpoint ? "已配置接口" : "可手动导入";
}

function ctripHeaders() {
  const headers = { "Content-Type": "application/json" };
  const appConfig = window.TRIPBOARD_CONFIG || {};
  if (ctripConfig.token) {
    headers.Authorization = `Bearer ${ctripConfig.token}`;
  } else if (ctripConfig.endpoint.includes("supabase.co/functions/v1") && appConfig.supabaseAnonKey) {
    headers.apikey = appConfig.supabaseAnonKey;
    headers.Authorization = `Bearer ${appConfig.supabaseAnonKey}`;
  }
  return headers;
}

async function fetchTransportQuotes(payload) {
  const response = await fetch(ctripConfig.endpoint, {
    method: "POST",
    headers: ctripHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  return data;
}

async function requestCtripTransport({ testOnly = false } = {}) {
  saveCtripConfig();
  if (!ctripConfig.endpoint) {
    setCtripStatus("请先填写后端代理接口地址。SearchApi API Key 只应保存在后端环境变量里。", "alert-circle");
    return null;
  }
  const payload = { ...getCtripPayload(), testOnly };
  setCtripStatus(testOnly ? "正在测试 Google Flights 航班代理连接..." : "正在通过 Google Flights 同步当天航班报价...", "loader");
  try {
    return await fetchTransportQuotes(payload);
  } catch (error) {
    setCtripStatus(`连接失败：${error.message}。请确认 Google Flights / SearchApi 代理函数已经部署到 Supabase，且函数允许当前网页跨域访问；如果接口在本地，公开页面无法直接访问你的本机服务。`, "alert-triangle");
    return null;
  }
}

async function testCtripConnection() {
  const data = await requestCtripTransport({ testOnly: true });
  if (!data) return;
  setCtripStatus(data.message || "连接成功。现在可以点击“同步当天航班”拉取报价。", data.ok === false ? "alert-circle" : "check-circle-2");
  dom.syncBadge.textContent = data.ok === false ? "待配置密钥" : "接口可用";
}

async function syncCtripTransport() {
  if (!requireEdit("同步交通报价")) return;
  if (dom.transportType.value === "train") {
    setCtripStatus("当前个人接口只提供航班报价。动车/高铁请用 12306 查询后手动保存报价，或以后接入有授权的火车票 API。", "train-front");
    return;
  }
  const data = await requestCtripTransport();
  if (!data) return;
  const route = defaultTransportRoute(currentDay());
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
  if (!rawItems.length) {
    transportProviderItems = [];
    setCtripStatus(data.message || "Google Flights 已响应，但没有返回匹配航班。请检查日期、城市/机场三字码和时间段。", "alert-circle");
    renderTransport();
    return;
  }
  transportProviderItems = rawItems.map((item, index) => normalizeTransportItem(item, index, route));
  transportProviderSource = data.source || "";
  transportFilterApplied = true;
  const isDemoProxy = transportProviderSource === "demo" || transportProviderItems.some((item) => /示例/.test(item.source || ""));
  setCtripStatus(isDemoProxy ? `后端代理已连通，返回 ${transportProviderItems.length} 条示例交通数据。` : `已同步 ${transportProviderItems.length} 条 Google Flights 航班报价，并更新当前交通列表。`, isDemoProxy ? "info" : "check-circle-2");
  dom.syncBadge.textContent = isDemoProxy ? "代理示例" : "Google Flights";
  logActivity(`同步 Google Flights 航班报价 ${transportProviderItems.length} 条`);
  saveState("已同步 Google Flights 报价");
  render();
}

async function compareMultiOrigins() {
  saveCtripConfig();
  if (!ctripConfig.endpoint) {
    setCtripStatus("请先保存 Google Flights / SearchApi 后端代理接口地址，再比较多人出发地。", "alert-circle");
    return;
  }
  if (dom.transportType.value === "train") {
    setCtripStatus("多人出发地比较目前使用 Google Flights 航班数据。动车/高铁仍需要 12306 查询后手动保存。", "train-front");
    return;
  }
  const origins = parseMultiOrigins(dom.multiOriginInput.value);
  if (!origins.length) {
    dom.multiOriginInput.focus();
    setCtripStatus("请先填写多人出发地，例如：林: SHA; 王: PEK; 周: CAN。", "alert-circle");
    return;
  }
  const day = currentDay();
  const route = defaultTransportRoute(day);
  const to = dom.transportTo.value.trim() || route.to;
  if (!to) {
    dom.transportTo.focus();
    setCtripStatus("请先填写共同到达地，例如：兰州 LHW。", "alert-circle");
    return;
  }
  const payloadBase = {
    tripId,
    date: day?.date || "",
    to,
    type: "flight",
    startTime: dom.transportStartTime.value || "",
    endTime: dom.transportEndTime.value || "",
  };
  multiOriginComparisons = origins.map((origin) => ({ ...origin, to, loading: true }));
  renderMultiOriginResults();
  refreshIcons();
  dom.compareOriginsBtn.disabled = true;
  setCtripStatus(`正在比较 ${origins.length} 个出发地；每个出发地会消耗 1 次航班查询。`, "loader");
  const results = [];
  for (const [index, origin] of origins.entries()) {
    try {
      setCtripStatus(`正在查询 ${origin.name}：${origin.from} → ${to}（${index + 1}/${origins.length}）`, "loader");
      const data = await fetchTransportQuotes({ ...payloadBase, from: origin.from });
      const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
      const items = rawItems.map((item, itemIndex) => normalizeTransportItem(item, itemIndex, { from: origin.from, to }));
      results.push({
        ...origin,
        to,
        items,
        best: bestFlightOption(items),
        source: data.source || "",
        count: items.length,
      });
    } catch (error) {
      results.push({
        ...origin,
        to,
        items: [],
        best: null,
        count: 0,
        error: error.message,
      });
    }
    multiOriginComparisons = [...results, ...origins.slice(index + 1).map((pending) => ({ ...pending, to, loading: true }))];
    renderMultiOriginResults();
  }
  multiOriginComparisons = results.sort((a, b) => compareScore(a.best) - compareScore(b.best));
  renderMultiOriginResults();
  refreshIcons();
  const matched = results.filter((item) => item.best).length;
  const total = results.reduce((sum, item) => sum + Number(item.best?.price || 0), 0);
  setCtripStatus(`已完成多人出发地比较：${matched}/${results.length} 人匹配到航班，最低合计 ${money(total)}。`, matched ? "check-circle-2" : "alert-circle");
  dom.compareOriginsBtn.disabled = false;
}

function totalBudget() {
  return state.days.reduce((sum, day) => sum + day.stops.reduce((daySum, stop) => daySum + numberValue(stop.budget), 0), 0);
}

function totalPaid() {
  return state.days.reduce((sum, day) => sum + day.stops.reduce((daySum, stop) => daySum + numberValue(stop.paid), 0), 0);
}

function partySize() {
  return Math.max(1, Number.parseInt(dom.partySizeInput.value || state.partySize || 1, 10) || 1);
}

function payerBudget() {
  const groups = {};
  state.days.forEach((day) => {
    day.stops.forEach((stop) => {
      const paid = numberValue(stop.paid);
      if (!paid) return;
      const payer = String(stop.payer || "未指定").trim() || "未指定";
      groups[payer] = (groups[payer] || 0) + paid;
    });
  });
  return groups;
}

function categoryBudget() {
  const groups = { 交通: 0, 餐饮: 0, 门票: 0, 住宿: 0 };
  state.days.forEach((day) => {
    day.stops.forEach((stop) => {
      const title = `${stop.title}${stop.type}${stop.tags.join("")}`;
      const value = numberValue(stop.budget);
      if (/酒店|民宿|住宿|入住/.test(title)) groups.住宿 += value;
      else if (/餐|食|面|夜市|Cafe|Dinner|Lunch|Market/.test(title)) groups.餐饮 += value;
      else if (/交通|高铁|Transit|车|机场|返程/.test(title)) groups.交通 += value;
      else groups.门票 += value;
    });
  });
  return groups;
}

function renderShell() {
  ensurePlanOrigin(state);
  const total = totalBudget();
  const paid = totalPaid();
  const people = partySize();
  const limit = Number(state.budgetLimit || 10000);
  const percent = Math.min(100, Math.round((total / limit) * 100));
  dom.tripName.textContent = state.name;
  dom.templateName.textContent = state.name;
  dom.tripDateRange.textContent = state.dateRange || "自定义日期";
  dom.tripCover.style.setProperty("--trip-cover", `url("${state.cover || images.city}")`);
  document.querySelector(".template-card").style.setProperty("--template-cover", `url("${state.cover || images.city}")`);
  dom.budgetTotal.textContent = `${money(total)} / ${money(limit)}`;
  dom.budgetMeter.style.width = `${percent}%`;
  const groups = categoryBudget();
  dom.budgetGrid.innerHTML = Object.entries(groups)
    .map(([key, value]) => `<span>${key} ${money(value)}</span>`)
    .join("");
  dom.partySizeInput.value = people;
  const payerRows = Object.entries(payerBudget())
    .map(([payer, value]) => `<span>${payer} 已付 ${money(value)}</span>`)
    .join("");
  dom.budgetSettlement.innerHTML = `
    <span>已付 ${money(paid)}</span>
    <span>待付 ${money(Math.max(0, total - paid))}</span>
    <span>人均 ${money(Math.round(total / people))}</span>
    ${payerRows || "<span>暂无付款记录</span>"}
  `;
}

function renderDays() {
  dom.dayList.innerHTML = state.days
    .map(
      (day, index) => `
        <button class="day-button ${index === activeDay ? "is-active" : ""}" data-day="${index}">
          <span>${day.label}</span>
          <strong>${day.title}<small>${day.route}</small></strong>
          <em>${money(day.stops.reduce((sum, stop) => sum + Number(stop.budget || 0), 0))}</em>
        </button>
      `,
    )
    .join("");
}

function renderDaySummary() {
  const day = currentDay();
  const dayBudget = day.stops.reduce((sum, stop) => sum + Number(stop.budget || 0), 0);
  dom.dayTitle.textContent = day.title;
  dom.routeLabel.textContent = `${day.label} · ${day.route}`;
  dom.dayPills.innerHTML = [
    ["cloud-sun", day.weather || "天气待确认"],
    ["train-front", day.transport || "交通待确认"],
    ["wallet-cards", `当日 ${money(dayBudget)}`],
  ]
    .map(([name, text]) => `<span class="status-pill">${icon(name)}${text}</span>`)
    .join("");
  dom.routeDistance.textContent = day.amapRoute?.distance ? formatDistanceText(day.amapRoute.distance) : `${Math.max(1, day.stops.length * 3.4).toFixed(1)} km`;
  dom.routeDuration.textContent = day.amapRoute?.duration ? formatDurationText(day.amapRoute.duration) : `${Math.max(25, day.stops.length * 22)} min`;
}

function renderDayEditor() {
  const day = currentDay();
  if (!day) return;
  dom.fieldDayDate.value = day.date || "";
  dom.fieldDayTitle.value = day.title || "";
  dom.fieldDayRoute.value = day.route || "";
  dom.fieldDayWeather.value = day.weather || "";
  dom.fieldDayTransport.value = day.transport || "";
  dom.dayEditorStatus.textContent = isReadonlyMode ? "只读" : tripId ? "实时协作" : "本地保存";
  dom.moveDayUpBtn.disabled = isReadonlyMode || activeDay === 0;
  dom.moveDayDownBtn.disabled = isReadonlyMode || activeDay >= state.days.length - 1;
  dom.deleteDayBtn.disabled = isReadonlyMode || state.days.length <= 1;
}

function renderTimeline() {
  const day = currentDay();
  dom.timeline.innerHTML = day.stops
    .map(
      (stop, index) => `
        <article class="stop-card ${index === activeStop ? "is-active" : ""}" data-stop="${index}">
          <time class="stop-time">${stop.time || "--:--"}</time>
          <div>
            <h4>${stop.title}</h4>
            <p>${stop.note || ""}</p>
            <div class="stop-tags">
              ${stop.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
              <span class="tag">${money(stop.budget || 0)}</span>
            </div>
          </div>
          <div class="stop-actions">
            <span>${icon("thumbs-up")} ${stop.votes || 0}</span>
            <span>${icon("message-square")} ${(stop.comments || []).length}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderMap() {
  const day = currentDay();
  dom.mapCanvas.innerHTML = `<div class="route-line"></div>`;
  day.stops.forEach((stop, index) => {
    const pin = document.createElement("button");
    pin.className = `map-pin ${index === activeStop ? "is-active" : ""}`;
    pin.style.left = `${stop.x}%`;
    pin.style.top = `${stop.y}%`;
    pin.setAttribute("aria-label", stop.title);
    pin.dataset.stop = index;
    pin.innerHTML = `<span>${index + 1}</span>`;
    dom.mapCanvas.appendChild(pin);
  });
}

function renderDetail() {
  const stop = currentStop();
  if (!stop) return;
  dom.placePhoto.style.setProperty("--photo", `url("${stop.image || images.city}")`);
  dom.placeType.textContent = stop.type || "Place";
  dom.placeTitle.textContent = stop.title;
  dom.placeAddress.textContent = stop.address || "地址待确认";
  dom.placeNote.textContent = stop.note || "";
  dom.favoriteBtn.classList.toggle("selected", Boolean(stop.favorite));
  dom.mustVote.classList.toggle("is-active", Boolean(stop.userVoted));
  dom.voteCount.textContent = stop.votes || 0;
  dom.commentCount.textContent = (stop.comments || []).length;
  dom.commentTitle.textContent = stop.title;

  if (collabTextStopId !== stop.id || !collabTextDoc) {
    dom.fieldTime.value = stop.time || "";
    dom.fieldTitle.value = stop.title || "";
    dom.fieldType.value = stop.type || "";
    dom.fieldAddress.value = stop.address || "";
    dom.fieldAmapKeyword.value = stop.amapKeyword || `${state.destination || ""} ${stop.title}`.trim();
    dom.fieldNote.value = stop.note || "";
    dom.fieldBudget.value = stop.budget || "";
    dom.fieldPaid.value = stop.paid || "";
    dom.fieldPayer.value = stop.payer || "";
    dom.fieldLng.value = stop.lng || "";
    dom.fieldLat.value = stop.lat || "";
    dom.fieldImage.value = stop.image || "";
    dom.fieldTags.value = (stop.tags || []).join(", ");
  }
  const detailKeyword = dom.fieldAmapKeyword.value || stop.title;
  dom.fieldAmapLink.href = amapSearchUrl(detailKeyword);
  dom.fieldAmapLink.textContent = `在高德搜索：${detailKeyword}`;

  renderStopComments(stop);
}

function renderCandidates() {
  dom.candidateGrid.innerHTML = state.candidates
    .map(
      (stop, index) => `
        <button class="candidate" data-candidate="${index}">
          ${icon(stop.type === "Market" ? "shopping-bag" : stop.type === "Cafe" ? "coffee" : "landmark")}
          ${stop.title}
          <span>${money(stop.budget)}</span>
        </button>
      `,
    )
    .join("");
}

function renderActivities() {
  const list = state.activities || [];
  dom.activityList.innerHTML = list
    .map((item) => {
      const entry = typeof item === "string" ? { text: item, at: "刚刚" } : item;
      return `<div class="activity-item"><span class="avatar a1">我</span><p>${entry.text}<br><small>${entry.at || ""}</small></p></div>`;
    })
    .join("");
}

function renderGuideResult() {
  const days = guideDayCount();
  const range = dateRangeText(guideState.startDate, guideState.endDate);
  dom.guideResult.textContent = `${guideState.origin}出发，${guideState.destination}${range}，共${days}天，${guideState.pace}节奏，偏好${guideState.interests.join(" / ")}，${guideState.budget}预算。`;
  dom.originInput.value = guideState.origin;
  dom.startDateInput.value = guideState.startDate;
  dom.endDateInput.value = guideState.endDate;
  dom.tripLengthHint.textContent = `共 ${days} 天，按出发日到返程日生成。最多支持 30 天。`;
}

function render() {
  activeDay = Math.min(activeDay, state.days.length - 1);
  activeStop = Math.min(activeStop, currentDay().stops.length - 1);
  renderShell();
  renderDays();
  renderDaySummary();
  renderTransport();
  renderTimeline();
  renderMap();
  renderDetail();
  renderCandidates();
  renderActivities();
  renderGuideResult();
  renderAmapRouteReport(currentDay()?.amapRoute || null);
  renderMembers();
  renderVersionHistory();
  applyReadonlyUi();
  renderDayEditor();
  renderEditorLockState();
  bindCollabTextDoc();
  refreshIcons();
}

function mutate(label, action, options = {}) {
  if (!requireEdit(label)) return;
  if (options.requireUnlocked !== false && !requireStopUnlocked(label)) return;
  saveVersionSnapshot(label);
  action();
  logActivity(label);
  saveState(label);
  render();
}

function clearCurrentAmapRoute() {
  const day = currentDay();
  if (day) day.amapRoute = null;
}

function makeBlankDay(index = state.days.length) {
  const baseDate = currentDay()?.date || state.endDate || state.startDate || formatIsoDate(new Date());
  const nextDate = parseIsoDate(baseDate) ? formatIsoDate(addDays(parseIsoDate(baseDate), 1)) : "";
  const destination = state.destination || guideState.destination || "目的地";
  return {
    id: uid(),
    label: `D${index + 1}`,
    date: nextDate,
    title: nextDate ? formatDatedTitle(nextDate, `第${index + 1}天`, index) : `第${index + 1}天`,
    route: "待填写路线",
    weather: "天气待确认",
    transport: "交通待规划",
    stops: [
      makeStop({
        time: "10:00",
        title: "待填写地点",
        type: "Draft",
        address: destination,
        note: "新增日期后，可在右侧继续补充地点、预算和备注。",
        tags: ["新日期", "待填写"],
        amapKeyword: destination,
        image: state.cover || images.city,
      }),
    ],
  };
}

dom.dayList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  activeDay = Number(button.dataset.day);
  activeStop = 0;
  render();
  trackPresence();
});

dom.timeline.addEventListener("click", (event) => {
  const card = event.target.closest("[data-stop]");
  if (!card) return;
  activeStop = Number(card.dataset.stop);
  render();
  trackPresence();
});

dom.mapCanvas.addEventListener("click", (event) => {
  const pin = event.target.closest("[data-stop]");
  if (!pin) return;
  activeStop = Number(pin.dataset.stop);
  render();
  trackPresence();
});

dom.dayForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let updatedDay = null;
  mutate("保存当天设置", () => {
    const day = currentDay();
    const previousDate = day.date || state.startDate || formatIsoDate(new Date());
    day.date = dom.fieldDayDate.value || day.date || "";
    day.title = dom.fieldDayTitle.value.trim() || day.title || day.label;
    day.route = dom.fieldDayRoute.value.trim() || "待填写路线";
    day.weather = dom.fieldDayWeather.value.trim() || "天气待确认";
    day.transport = dom.fieldDayTransport.value.trim() || "交通待规划";
    if (day.date !== previousDate) {
      const changedDate = parseIsoDate(day.date);
      const nextStartDate = changedDate ? formatIsoDate(addDays(changedDate, -activeDay)) : state.startDate;
      reflowPlanDates(state, nextStartDate);
    } else {
      resequencePlanDays();
    }
    updatedDay = clone(currentDay());
  }, { requireUnlocked: false });
  if (updatedDay) broadcastDayUpdated(updatedDay);
});

dom.addDayBtn.addEventListener("click", () => {
  let createdDay = null;
  let createdIndex = 0;
  mutate("新增一天", () => {
    createdIndex = activeDay + 1;
    createdDay = makeBlankDay(createdIndex);
    state.days.splice(createdIndex, 0, createdDay);
    activeDay = createdIndex;
    activeStop = 0;
    reflowPlanDates();
    createdDay = clone(state.days[createdIndex]);
  }, { requireUnlocked: false });
  if (createdDay) broadcastDayCreated(createdDay, createdIndex);
});

dom.deleteDayBtn.addEventListener("click", () => {
  if (state.days.length <= 1) {
    dom.saveState.textContent = "计划至少保留一天";
    return;
  }
  const deletedDay = clone(currentDay());
  mutate(`删除「${deletedDay.title || deletedDay.label}」`, () => {
    state.days.splice(activeDay, 1);
    activeDay = Math.max(0, Math.min(activeDay, state.days.length - 1));
    activeStop = 0;
    destroyCollabTextDoc();
    reflowPlanDates();
  }, { requireUnlocked: false });
  broadcastDayDeleted(deletedDay);
});

dom.moveDayUpBtn.addEventListener("click", () => {
  if (activeDay <= 0) return;
  let changed = false;
  mutate("上移当天", () => {
    [state.days[activeDay - 1], state.days[activeDay]] = [state.days[activeDay], state.days[activeDay - 1]];
    activeDay -= 1;
    activeStop = 0;
    reflowPlanDates();
    changed = true;
  }, { requireUnlocked: false });
  if (changed) broadcastDaysReordered();
});

dom.moveDayDownBtn.addEventListener("click", () => {
  if (activeDay >= state.days.length - 1) return;
  let changed = false;
  mutate("下移当天", () => {
    [state.days[activeDay + 1], state.days[activeDay]] = [state.days[activeDay], state.days[activeDay + 1]];
    activeDay += 1;
    activeStop = 0;
    reflowPlanDates();
    changed = true;
  }, { requireUnlocked: false });
  if (changed) broadcastDaysReordered();
});

dom.stopForm.addEventListener("submit", (event) => {
  event.preventDefault();
  mutate(`保存「${dom.fieldTitle.value || "地点"}」`, () => {
    const stop = currentStop();
    const collabValue = (field, domKey) => (collabTextStopId === stop.id && collabTextFields[field] ? collabTextFields[field].toString() : dom[domKey].value.trim());
    const structValues = collabTextStopId === stop.id && collabStructMap ? readStructFromDoc() : null;
    const structValue = (field, fallback) => structValues && Object.prototype.hasOwnProperty.call(structValues, field) ? structValues[field] : fallback();
    stop.title = collabValue("title", "fieldTitle") || "未命名地点";
    stop.type = collabValue("type", "fieldType") || "Place";
    stop.budget = structValue("budget", () => numberValue(dom.fieldBudget.value));
    stop.paid = structValue("paid", () => numberValue(dom.fieldPaid.value));
    stop.payer = structValue("payer", () => dom.fieldPayer.value.trim());
    stop.address = collabValue("address", "fieldAddress");
    stop.amapKeyword = collabValue("amapKeyword", "fieldAmapKeyword");
    stop.time = structValue("time", () => dom.fieldTime.value.trim());
    stop.lng = structValue("lng", () => dom.fieldLng.value.trim());
    stop.lat = structValue("lat", () => dom.fieldLat.value.trim());
    stop.image = structValue("image", () => dom.fieldImage.value.trim()) || stop.image || images.city;
    stop.tags = structValue("tags", () => normalizeTags(dom.fieldTags.value));
    stop.note = collabValue("note", "fieldNote");
    clearCurrentAmapRoute();
  });
});

COLLAB_TEXT_FIELDS.forEach(({ field, domKey }) => {
  dom[domKey]?.addEventListener("input", () => {
    syncCollabTextFieldToDoc(field, dom[domKey].value);
    schedulePresenceTrack();
  });
  ["focus", "click", "keyup", "select"].forEach((eventName) => {
    dom[domKey]?.addEventListener(eventName, () => schedulePresenceTrack(eventName === "focus" ? 0 : 90));
  });
  dom[domKey]?.addEventListener("blur", () => schedulePresenceTrack(180));
});

document.addEventListener("selectionchange", () => {
  if (currentFocusedTextField()) schedulePresenceTrack(90);
});

COLLAB_STRUCT_FIELDS.forEach((meta) => {
  ["input", "change"].forEach((eventName) => {
    dom[meta.domKey]?.addEventListener(eventName, () => {
      syncCollabStructFieldToDoc(meta);
      schedulePresenceTrack();
    });
  });
});

dom.addStopBtn.addEventListener("click", () => {
  let createdStop = null;
  let createdDayId = "";
  mutate("新增地点", () => {
    const day = currentDay();
    createdStop = makeStop({
      time: "18:00",
      title: "新地点",
      note: "在右侧编辑名称、地址、预算和备注。",
      tags: ["草稿"],
      budget: 0,
      x: 70,
      y: 32,
    });
    createdDayId = day.id;
    day.stops.push(createdStop);
    activeStop = day.stops.length - 1;
    clearCurrentAmapRoute();
  }, { requireUnlocked: false });
  if (createdStop) broadcastStopCreated(createdDayId, createdStop);
});

dom.quickAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = dom.quickPlaceName.value.trim();
  if (!name) return;
  const keyword = dom.quickAmapKeyword.value.trim() || `${state.destination || ""} ${name}`.trim();
  const locatedPlace = quickAmapPlace && (quickAmapPlace.keyword === keyword || quickAmapPlace.title === name) ? quickAmapPlace : null;
  let createdStop = null;
  let createdDayId = "";
  mutate(`加入景点「${name}」`, () => {
    const day = currentDay();
    createdStop = makeStop({
      time: dom.quickTime.value.trim() || "10:00",
      title: name,
      type: "Scenic",
      address: dom.quickAddress.value.trim() || locatedPlace?.address || keyword,
      note: `从快速录入加入。高德关键词：${keyword}`,
      tags: ["自定义", "待优化"],
      budget: Number(dom.quickBudget.value || 0),
      amapKeyword: keyword,
      lng: locatedPlace?.lng || "",
      lat: locatedPlace?.lat || "",
      x: 30 + ((day.stops.length * 17) % 52),
      y: 28 + ((day.stops.length * 13) % 42),
      image: state.cover || images.city,
    });
    createdDayId = day.id;
    day.stops.push(createdStop);
    activeStop = day.stops.length - 1;
    clearCurrentAmapRoute();
    dom.quickPlaceName.value = "";
    dom.quickAmapKeyword.value = "";
    dom.quickTime.value = "";
    dom.quickBudget.value = "";
    dom.quickAddress.value = "";
    quickAmapPlace = null;
  }, { requireUnlocked: false });
  if (createdStop) broadcastStopCreated(createdDayId, createdStop);
});

dom.openAmapBtn.addEventListener("click", async () => {
  const keyword =
    dom.quickAmapKeyword.value.trim() ||
    `${state.destination || ""} ${dom.quickPlaceName.value.trim()}`.trim() ||
    state.destination ||
    "景点";
  dom.quickAmapLink.href = amapSearchUrl(keyword);
  dom.quickAmapLink.textContent = `打开高德搜索：${keyword}`;
  if (!serviceConfig.amapEndpoint) {
    dom.optimizeHint.textContent = `已生成高德链接：${keyword}。配置高德代理后可自动回填地址和经纬度。`;
    return;
  }
  try {
    const place = await lookupAmapPlace(keyword);
    if (place?.address) dom.quickAddress.value = place.address;
    quickAmapPlace = place ? { ...place, keyword } : null;
    dom.optimizeHint.textContent = place?.lng && place?.lat ? `高德代理已定位：${place.address || keyword}（${place.lng}, ${place.lat}）。加入后可在右侧保存坐标。` : `高德代理已响应，但没有返回经纬度；已保留搜索链接。`;
  } catch (error) {
    dom.optimizeHint.textContent = `高德代理调用失败：${error.message}。已保留高德搜索链接。`;
  }
});

dom.amapLookupBtn.addEventListener("click", async () => {
  const stop = currentStop();
  const keyword = dom.fieldAmapKeyword.value.trim() || `${state.destination || ""} ${stop.title}`.trim();
  dom.fieldAmapLink.href = amapSearchUrl(keyword);
  dom.fieldAmapLink.textContent = `打开高德搜索：${keyword}`;
  if (!serviceConfig.amapEndpoint) {
    dom.saveState.textContent = `已生成高德链接：${keyword}`;
    return;
  }
  try {
    const place = await lookupAmapPlace(keyword);
    if (place?.address) dom.fieldAddress.value = place.address;
    if (place?.lng) dom.fieldLng.value = place.lng;
    if (place?.lat) dom.fieldLat.value = place.lat;
    await Promise.all([
      place?.address ? syncCollabTextFieldToDoc("address", dom.fieldAddress.value) : Promise.resolve(),
      ...COLLAB_STRUCT_FIELDS.filter(({ field }) => ["lng", "lat"].includes(field)).map((meta) => syncCollabStructFieldToDoc(meta)),
    ]);
    dom.saveState.textContent = place?.lng && place?.lat ? `高德代理已回填定位：${keyword}` : `高德代理已响应：${keyword}`;
  } catch (error) {
    dom.saveState.textContent = `高德代理调用失败：${error.message}`;
  }
});

dom.amapRouteBtn.addEventListener("click", async () => {
  if (!requireEdit("高德规划路线")) return;
  const day = currentDay();
  if (day.stops.length < 2) {
    dom.optimizeHint.textContent = "至少需要 2 个地点才能用高德规划路线。";
    return;
  }
  saveVersionSnapshot("高德规划路线前版本");
  dom.amapRouteBtn.disabled = true;
  dom.optimizeHint.textContent = "正在请求高德路线规划...";
  try {
    const result = await requestAmapRoute(day, dom.amapRouteMode.value);
    const resolvedStops = Array.isArray(result.stops) ? result.stops : [];
    resolvedStops.forEach((resolved) => {
      const stop = day.stops[Number(resolved.index)];
      if (!stop) return;
      if (resolved.address && !stop.address) stop.address = resolved.address;
      if (resolved.lng) stop.lng = String(resolved.lng);
      if (resolved.lat) stop.lat = String(resolved.lat);
      if (resolved.amapKeyword && !stop.amapKeyword) stop.amapKeyword = resolved.amapKeyword;
    });
    day.amapRoute = {
      source: result.source || "高德路线规划",
      mode: result.mode || dom.amapRouteMode.value,
      distance: Number(result.distance || 0),
      duration: Number(result.duration || 0),
      legs: Array.isArray(result.legs) ? result.legs : [],
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
      updatedAt: new Date().toISOString(),
    };
    logActivity("高德规划当天路线");
    saveState("已用高德规划路线");
    render();
    dom.optimizeHint.textContent = `高德已规划 ${day.amapRoute.legs.length} 段路线：${formatDistanceText(day.amapRoute.distance)} · ${formatDurationText(day.amapRoute.duration)}。`;
  } catch (error) {
    dom.optimizeHint.textContent = `高德路线规划失败：${error.message}`;
    renderAmapRouteReport({
      source: "高德路线规划失败",
      mode: dom.amapRouteMode.value,
      warnings: [error.message, "请检查 Supabase 函数是否部署、AMAP_WEB_SERVICE_KEY 是否配置，以及地点是否能搜索到坐标。"],
    });
  } finally {
    dom.amapRouteBtn.disabled = false;
    refreshIcons();
  }
});

dom.deleteStopBtn.addEventListener("click", () => {
  const day = currentDay();
  if (day.stops.length <= 1) {
    dom.saveState.textContent = "每天至少保留一个地点";
    return;
  }
  const deletedStop = clone(currentStop());
  mutate(`删除「${deletedStop.title}」`, () => {
    day.stops.splice(activeStop, 1);
    activeStop = Math.max(0, activeStop - 1);
    clearCurrentAmapRoute();
  });
  broadcastStopDeleted(day.id, deletedStop);
});

dom.moveUpBtn.addEventListener("click", () => {
  if (activeStop === 0) return;
  let dayId = "";
  let nextStops = [];
  mutate("上移地点", () => {
    const day = currentDay();
    const stops = day.stops;
    [stops[activeStop - 1], stops[activeStop]] = [stops[activeStop], stops[activeStop - 1]];
    activeStop -= 1;
    dayId = day.id;
    nextStops = [...stops];
    clearCurrentAmapRoute();
  });
  broadcastStopsReordered(dayId, nextStops);
});

dom.moveDownBtn.addEventListener("click", () => {
  const stops = currentDay().stops;
  if (activeStop >= stops.length - 1) return;
  let dayId = "";
  let nextStops = [];
  mutate("下移地点", () => {
    const day = currentDay();
    const dayStops = day.stops;
    [dayStops[activeStop + 1], dayStops[activeStop]] = [dayStops[activeStop], dayStops[activeStop + 1]];
    activeStop += 1;
    dayId = day.id;
    nextStops = [...dayStops];
    clearCurrentAmapRoute();
  });
  broadcastStopsReordered(dayId, nextStops);
});

function localOptimizeStops(stops) {
  const [start, ...rest] = stops;
  const optimized = [start];
  const remaining = [...rest];

  while (remaining.length) {
    const current = optimized[optimized.length - 1];
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((stop, index) => {
      const distance = distanceBetween(current, stop);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    optimized.push(remaining.splice(bestIndex, 1)[0]);
  }

  return optimized;
}

function renderAiRouteReport(result, day, optimizedStops) {
  if (!dom.aiRouteReport) return;
  if (!result && !optimizedStops?.length) {
    dom.aiRouteReport.hidden = true;
    dom.aiRouteReport.innerHTML = "";
    return;
  }
  const sourceLabel = result?.fallback ? "本地兜底" : result?.source || (serviceConfig.aiEndpoint ? "AI 代理" : "本地距离排序");
  const note = result?.note || "已应用新的地点顺序。";
  const reason = result?.reason || (result?.fallback ? "模型密钥未配置或调用失败，已按地点坐标和地图位置做最近邻排序。" : "");
  const segments = Array.isArray(result?.segments) ? result.segments.slice(0, 6) : [];
  const warnings = Array.isArray(result?.warnings) ? result.warnings.slice(0, 4) : [];
  const order = (optimizedStops || day.stops || []).map((stop, index) => `${index + 1}. ${escapeHtml(stop.title)}`).join(" → ");
  dom.aiRouteReport.hidden = false;
  dom.aiRouteReport.innerHTML = `
    <div class="ai-route-report-head">
      <strong>${escapeHtml(sourceLabel)}</strong>
      <span>${escapeHtml(day.date ? formatDisplayDate(day.date) : day.label || "当天")}</span>
    </div>
    <p>${escapeHtml(note)}</p>
    ${reason ? `<p>${escapeHtml(reason)}</p>` : ""}
    <div class="ai-route-order">${order}</div>
    ${
      segments.length
        ? `<div class="ai-route-segments">
            ${segments
              .map(
                (segment) => `
                  <span>${escapeHtml(segment.from || "")} → ${escapeHtml(segment.to || "")}${segment.transport ? ` · ${escapeHtml(segment.transport)}` : ""}${segment.minutes ? ` · 约${Number(segment.minutes)}分钟` : ""}${segment.note ? ` · ${escapeHtml(segment.note)}` : ""}</span>
                `,
              )
              .join("")}
          </div>`
        : ""
    }
    ${
      warnings.length
        ? `<ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>`
        : ""
    }
  `;
}

function renderAmapRouteReport(result) {
  if (!dom.amapRouteReport) return;
  if (!result) {
    dom.amapRouteReport.hidden = true;
    dom.amapRouteReport.innerHTML = "";
    return;
  }
  const legs = Array.isArray(result.legs) ? result.legs : [];
  const warnings = Array.isArray(result.warnings) ? result.warnings : [];
  const modeText = {
    walking: "步行",
    driving: "驾车",
    transit: "公交/地铁",
  }[result.mode] || "路线";
  dom.amapRouteReport.hidden = false;
  dom.amapRouteReport.innerHTML = `
    <div class="amap-route-summary">
      <strong>${escapeHtml(result.source || "高德路线规划")}</strong>
      <span>${escapeHtml(modeText)} · ${formatDistanceText(result.distance)} · ${formatDurationText(result.duration)}</span>
    </div>
    ${
      legs.length
        ? `<div class="amap-route-legs">
            ${legs
              .map(
                (leg, index) => `
                  <div class="amap-route-leg">
                    <strong>${index + 1}. ${escapeHtml(leg.from || "")} → ${escapeHtml(leg.to || "")}</strong>
                    <span>${formatDistanceText(leg.distance)} · ${formatDurationText(leg.duration)}${leg.cost ? ` · 约${money(leg.cost)}` : ""}</span>
                    ${leg.instruction ? `<span>${escapeHtml(leg.instruction)}</span>` : ""}
                  </div>
                `,
              )
              .join("")}
          </div>`
        : `<p>高德已响应，但没有返回可展示的分段路线。</p>`
    }
    ${warnings.length ? `<p>${warnings.map((warning) => escapeHtml(warning)).join("；")}</p>` : ""}
  `;
}

function formatDistanceText(value) {
  const meters = Number(value || 0);
  if (!meters) return "距离待确认";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function formatDurationText(value) {
  const seconds = Number(value || 0);
  if (!seconds) return "时长待确认";
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

async function requestAiRoute(day) {
  if (!serviceConfig.aiEndpoint) return null;
  const response = await fetch(serviceConfig.aiEndpoint, {
    method: "POST",
    headers: serviceHeaders(serviceConfig.aiToken, serviceConfig.aiEndpoint),
    body: JSON.stringify({
      tripId,
      day: day.date || day.label,
      date: day.date || "",
      dayTitle: day.title || "",
      pace: guideState.pace,
      budgetLimit: state.budgetLimit || 0,
      weather: day.weather || "",
      destination: state.destination,
      origin: state.origin,
      stops: day.stops.map((stop, index) => ({
        index,
        id: stop.id,
        title: stop.title,
        time: stop.time,
        type: stop.type,
        address: stop.address,
        note: stop.note,
        lng: stop.lng,
        lat: stop.lat,
        budget: stop.budget || 0,
        weather: day.weather || "",
        tags: stop.tags || [],
      })),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (Array.isArray(data.fallbackOrder) && data.fallbackOrder.length) {
      return {
        order: data.fallbackOrder,
        note: data.note || data.error || "AI 未配置，已使用后端本地兜底顺序。",
        reason: data.error || "",
        source: data.source || "AI 代理兜底",
        fallback: true,
      };
    }
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  const order = Array.isArray(data.order) ? data.order : Array.isArray(data.stopIds) ? data.stopIds : [];
  return {
    order,
    note: data.note || data.reason || "AI 已返回优化顺序",
    reason: data.reason || "",
    segments: Array.isArray(data.segments) ? data.segments : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
    source: data.source || "AI 代理",
  };
}

async function optimizeCurrentDayRoute() {
  const day = currentDay();
  if (day.stops.length < 3) {
    dom.optimizeHint.textContent = "当前天少于 3 个地点，暂时不需要优化路径。";
    return;
  }

  if (!requireEdit("优化路径")) return;
  saveVersionSnapshot("优化路径前版本");
  try {
    dom.optimizeHint.textContent = serviceConfig.aiEndpoint ? "正在请求 AI 路径代理..." : "未配置 AI 代理，使用本地距离排序。";
    renderAiRouteReport(null);
    const aiResult = await requestAiRoute(day);
    let optimized = null;
    if (aiResult?.order?.length) {
      const byId = new Map(day.stops.map((stop, index) => [stop.id, { stop, index }]));
      const byIndex = day.stops.map((stop, index) => ({ stop, index }));
      const picked = aiResult.order
        .map((key) => byId.get(String(key))?.stop || byIndex[Number(key)]?.stop)
        .filter(Boolean);
      const pickedIds = new Set(picked.map((stop) => stop.id));
      optimized = [...picked, ...day.stops.filter((stop) => !pickedIds.has(stop.id))];
    }
    let routeResult = aiResult;
    if (!optimized) {
      optimized = localOptimizeStops(day.stops);
      routeResult = routeResult || {
        fallback: true,
        source: "本地距离排序",
        note: "未配置 AI 代理，已按地点坐标/地图位置做最近邻排序。",
        reason: "本地兜底只考虑坐标距离，不会判断营业时间、排队、实时交通和天气。",
        warnings: ["本地兜底结果适合作为初稿，建议人工核对交通和开放时间。"],
      };
    }
    day.stops = optimized.map((stop, index) => ({
      ...stop,
      tags: Array.from(
        new Set([
          ...(stop.tags || []).filter((tag) => !["待优化", "已优化", "AI优化", "兜底优化"].includes(tag)),
          index === 0 ? "起点" : routeResult?.fallback ? "兜底优化" : serviceConfig.aiEndpoint ? "AI优化" : "已优化",
        ]),
      ),
    }));
    day.amapRoute = null;
    activeStop = 0;
    logActivity(serviceConfig.aiEndpoint ? "AI 优化当天路径" : "本地优化当天路径");
    saveState(serviceConfig.aiEndpoint ? "已用 AI 优化路径" : "已用本地距离优化路径");
    dom.optimizeHint.textContent = serviceConfig.aiEndpoint
      ? `${routeResult?.fallback ? "AI 代理未配置，已兜底优化" : "AI 已优化"} ${day.stops.length} 个地点：${routeResult?.note || "已应用返回顺序"}`
      : `已按 ${day.stops.length} 个地点的坐标/地图位置做本地距离排序；配置 AI 代理后可考虑营业时间、交通方式、天气和体力。`;
    renderAiRouteReport(routeResult, day, day.stops);
    render();
  } catch (error) {
    dom.optimizeHint.textContent = `AI 代理调用失败：${error.message}。已保留原顺序，可检查后端地址或令牌。`;
    renderAiRouteReport(
      {
        fallback: true,
        source: "调用失败",
        note: "AI 代理调用失败，未改动当前顺序。",
        reason: error.message,
        warnings: ["请检查 Supabase 函数是否部署、OPENAI_API_KEY 是否配置、代理地址和访问令牌是否正确。"],
      },
      day,
      day.stops,
    );
  }
}

dom.optimizeRouteBtn.addEventListener("click", optimizeCurrentDayRoute);

dom.saveServiceConfigBtn.addEventListener("click", () => {
  if (!requireEdit("保存接口配置")) return;
  saveServiceConfig();
  dom.saveState.textContent = "接口配置已保存到当前浏览器";
});

dom.syncWeatherBtn.addEventListener("click", syncWeather);

dom.mustVote.addEventListener("click", () => {
  mutate("更新必去投票", () => {
    const stop = currentStop();
    stop.userVoted = !stop.userVoted;
    stop.votes = Math.max(0, Number(stop.votes || 0) + (stop.userVoted ? 1 : -1));
  });
});

dom.favoriteBtn.addEventListener("click", () => {
  mutate("更新收藏", () => {
    currentStop().favorite = !currentStop().favorite;
  });
});

dom.commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = dom.commentInput.value.trim();
  if (!text) return;
  if (await addCollaborativeComment(text)) {
    dom.commentInput.value = "";
    return;
  }
  mutate(`评论「${currentStop().title}」`, () => {
    currentStop().comments = [...(currentStop().comments || []), { id: uid(), author: getCollabName(), text, at: new Date().toISOString() }];
    dom.commentInput.value = "";
  });
});

dom.commentFocusBtn.addEventListener("click", () => {
  dom.commentInput.focus();
});

dom.candidateGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-candidate]");
  if (!button) return;
  const candidate = clone(state.candidates[Number(button.dataset.candidate)]);
  candidate.id = uid();
  let createdDayId = "";
  mutate(`加入备选「${candidate.title}」`, () => {
    const day = currentDay();
    createdDayId = day.id;
    day.stops.push(candidate);
    activeStop = currentDay().stops.length - 1;
  });
  broadcastStopCreated(createdDayId, candidate);
});

document.querySelectorAll("[data-guide-group]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const option = event.target.closest("[data-guide-option]");
    if (!option) return;
    const groupName = group.dataset.guideGroup;
    if (groupName === "interest") {
      option.classList.toggle("is-active");
      guideState.interests = [...group.querySelectorAll(".is-active")].map((item) => item.dataset.guideOption);
      if (!guideState.interests.length) {
        option.classList.add("is-active");
        guideState.interests = [option.dataset.guideOption];
      }
    } else {
      group.querySelectorAll("[data-guide-option]").forEach((item) => item.classList.toggle("is-active", item === option));
      guideState[groupName] = option.dataset.guideOption;
    }
    renderGuideResult();
  });
});

function syncGuideDatesFromInputs() {
  const start = dom.startDateInput.value || guideState.startDate;
  let end = dom.endDateInput.value || guideState.endDate;
  const startDate = parseIsoDate(start);
  const endDate = parseIsoDate(end);
  if (startDate && endDate && endDate < startDate) {
    end = start;
  }
  const days = daysBetweenInclusive(start, end);
  if (days >= 30 && parseIsoDate(start)) {
    end = formatIsoDate(addDays(parseIsoDate(start), 29));
  }
  guideState.startDate = start;
  guideState.endDate = end;
  renderGuideResult();
}

dom.startDateInput.addEventListener("input", syncGuideDatesFromInputs);
dom.endDateInput.addEventListener("input", syncGuideDatesFromInputs);

dom.transportFilterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  transportFilterApplied = true;
  renderTransport();
  refreshIcons();
});

dom.manualQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = dom.manualQuoteCode.value.trim();
  const price = numberValue(dom.manualQuotePrice.value);
  if (!code || !price) return;
  const day = currentDay();
  const route = defaultTransportRoute(day);
  mutate(`保存交通报价「${code}」`, () => {
    state.transportQuotes = [
      {
        id: uid(),
        dayId: day.id,
        date: day.date || "",
        type: dom.manualQuoteType.value,
        code,
        from: dom.transportFrom.value.trim() || route.from,
        to: dom.transportTo.value.trim() || route.to,
        depart: dom.manualQuoteDepart.value || "--:--",
        arrive: dom.manualQuoteArrive.value || "--:--",
        duration: durationFromTimes(dom.manualQuoteDepart.value, dom.manualQuoteArrive.value),
        price,
        source: "手动保存",
      },
      ...manualTransportQuotes(),
    ].slice(0, 40);
    transportFilterApplied = true;
    dom.manualQuoteCode.value = "";
    dom.manualQuoteDepart.value = "";
    dom.manualQuoteArrive.value = "";
    dom.manualQuotePrice.value = "";
  }, { requireUnlocked: false });
});

dom.partySizeInput.addEventListener("change", () => {
  if (!requireEdit("更新同行人数")) return;
  mutate("更新同行人数", () => {
    state.partySize = partySize();
  }, { requireUnlocked: false });
});

dom.destinationInput.addEventListener("input", () => {
  guideState.destination = dom.destinationInput.value.trim() || "自定义";
  renderGuideResult();
});

dom.originInput.addEventListener("input", () => {
  guideState.origin = dom.originInput.value.trim() || "出发城市";
  dom.transportFrom.value = guideState.origin;
  renderGuideResult();
});

function closeCreateChoice() {
  dom.createChoiceModal.classList.remove("is-open");
  dom.createChoiceModal.setAttribute("aria-hidden", "true");
}

function createRecommendedPlan() {
  if (!requireEdit("生成推荐计划")) return;
  const destination = dom.destinationInput.value.trim() || "甘肃";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  mutate(`生成${destination}${days}天计划`, () => {
    if (destination.includes("甘肃")) {
      state = buildGansuPlan(days, guideState);
    } else {
      state = buildBlankPlan(destination, days, guideState);
      state.name = `${destination} ${days} 日同行计划`;
      state.destination = destination;
      state.activities = [`生成${destination}计划模板`];
      state.days.forEach((day, index) => {
        day.route = index === 0 ? `抵达${destination} · 入住与周边探索` : `${destination}自由探索 · 备选景点`;
        day.transport = index === 0 ? "机票/动车 + 市内交通" : "市内交通";
      });
    }
    applyPlanDates(state, guideState.startDate, guideState.endDate);
    state.name = `${destination} ${days} 日同行计划`;
    state.origin = origin;
    state.activities = [`${origin}出发`, ...(state.activities || [])].slice(0, 6);
    activeDay = 0;
    activeStop = 0;
    dom.transportFrom.value = origin;
    dom.transportTo.value = "";
    transportFilterApplied = false;
  }, { requireUnlocked: false });
  broadcastPlanReplaced("生成推荐计划");
  closeCreateChoice();
}

function createBlankTemplate() {
  if (!requireEdit("生成空白模板")) return;
  const destination = dom.destinationInput.value.trim() || "自定义目的地";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  mutate(`创建${destination}${days}天空白模板`, () => {
    state = buildBlankPlan(destination, days, guideState);
    applyPlanDates(state, guideState.startDate, guideState.endDate);
    state.origin = origin;
    activeDay = 0;
    activeStop = 0;
    dom.transportFrom.value = origin;
    dom.transportTo.value = "";
    transportFilterApplied = false;
  }, { requireUnlocked: false });
  broadcastPlanReplaced("生成空白模板");
  closeCreateChoice();
}

dom.applyGuideBtn.addEventListener("click", () => {
  if (!requireEdit("创建计划")) return;
  const destination = dom.destinationInput.value.trim() || "自定义目的地";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  dom.createChoiceTitle.textContent = `为「${destination}」创建计划`;
  dom.createChoiceCopy.textContent = `${origin}出发，${dateRangeText(guideState.startDate, guideState.endDate)}，共${days}天，${guideState.pace}节奏，偏好${guideState.interests.join(" / ")}，${guideState.budget}预算。`;
  dom.createChoiceModal.classList.add("is-open");
  dom.createChoiceModal.setAttribute("aria-hidden", "false");
  renderGuideResult();
  refreshIcons();
});

dom.recommendedPlanBtn.addEventListener("click", createRecommendedPlan);
dom.blankPlanBtn.addEventListener("click", createBlankTemplate);

document.querySelectorAll("[data-close-create]").forEach((button) => {
  button.addEventListener("click", closeCreateChoice);
});

dom.exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.name.replace(/\s+/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
  if (!isReadonlyMode) {
    logActivity("导出计划 JSON");
    saveState("已导出 JSON");
    renderActivities();
  } else {
    dom.saveState.textContent = "已导出 JSON";
  }
});

dom.shareBtn.addEventListener("click", async () => {
  const text = `${state.name}\n${state.days.map((day) => `${day.title}: ${day.route}`).join("\n")}`;
  try {
    await navigator.clipboard.writeText(text);
    dom.saveState.textContent = "分享摘要已复制";
  } catch {
    dom.saveState.textContent = "浏览器未允许复制，已生成分享摘要";
  }
});

dom.createSharedTripBtn.addEventListener("click", createSharedTrip);

dom.copySharedLinkBtn.addEventListener("click", async () => {
  if (!tripId) {
    dom.collabStatus.textContent = "请先创建共享计划，再复制链接。";
    return;
  }
  const url = isReadonlyMode ? getReadonlyShareUrl() : getShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    dom.collabStatus.textContent = isReadonlyMode ? "只读链接已复制。" : "编辑链接已复制。";
  } catch {
    dom.collabStatus.textContent = url;
  }
});

dom.copyReadonlyLinkBtn.addEventListener("click", async () => {
  if (!tripId) {
    dom.collabStatus.textContent = "请先创建共享计划，再复制只读链接。";
    return;
  }
  const url = getReadonlyShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    dom.collabStatus.textContent = "只读链接已复制，打开后只能查看不能编辑。";
  } catch {
    dom.collabStatus.textContent = url;
  }
});

dom.mergeConflictBtn?.addEventListener("click", () => resolveConflict("merge"));
dom.keepLocalConflictBtn?.addEventListener("click", () => resolveConflict("local"));
dom.useRemoteConflictBtn?.addEventListener("click", () => resolveConflict("remote"));

dom.versionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-version]");
  if (!button) return;
  restoreVersion(button.dataset.version);
});

dom.memberForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const saved = saveMemberProfile({
    name: dom.collabName.value,
    role: dom.collabRole.value,
  });
  if (!saved) {
    dom.collabStatus.textContent = "请先填写你的名字，再加入协作。";
    return;
  }
  dom.collabStatus.textContent = tripId ? `${memberProfile.name} 已加入协作。` : `${memberProfile.name} 已准备加入，创建或打开共享链接后会显示在线。`;
  renderMembers();
  trackPresence();
  refreshIcons();
});

dom.collabName.addEventListener("input", () => {
  localStorage.setItem("tripboard-user-name", dom.collabName.value.trim());
});

dom.collabRole.addEventListener("input", () => {
  if (!memberProfile) return;
  saveMemberProfile({ ...memberProfile, role: dom.collabRole.value });
  trackPresence();
});

dom.ctripLoginBtn.addEventListener("click", () => {
  const nextOpen = dom.ctripConnectPanel.hidden;
  dom.ctripConnectPanel.hidden = !nextOpen;
  dom.syncBadge.textContent = ctripConfig.endpoint ? "已配置接口" : "等待配置";
  setCtripStatus(
    nextOpen
      ? "请填写 Google Flights 航班代理接口，然后点击“测试连接”。SearchApi Key 只放在后端环境变量里。"
      : "航班报价接入配置已收起。",
    nextOpen ? "plug-zap" : "info",
  );
});

dom.ctripConnectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCtripConfig();
  setCtripStatus(ctripConfig.endpoint ? "接入地址已保存。下一步点击“测试连接”。" : "请填写后端代理接口地址。", ctripConfig.endpoint ? "check-circle-2" : "alert-circle");
});

dom.ctripTestBtn.addEventListener("click", testCtripConnection);

dom.ctripSyncTransportBtn.addEventListener("click", syncCtripTransport);

dom.multiOriginExampleBtn.addEventListener("click", () => {
  dom.multiOriginInput.value = "林: SHA; 王: PEK; 周: CAN";
  setCtripStatus("已填入多人出发地示例。到达地可填 LHW 或 兰州，然后点击“综合比较”。", "users");
});

dom.compareOriginsBtn.addEventListener("click", compareMultiOrigins);

dom.ctripSpecBtn.addEventListener("click", async () => {
  const spec = dom.ctripSpecBox.textContent.trim();
  try {
    await navigator.clipboard.writeText(spec);
    setCtripStatus("接口规范已复制。把这个规范给后端或 Supabase Edge Function 使用。", "copy-check");
  } catch {
    setCtripStatus("浏览器未允许复制，你可以直接选中规范文本。", "info");
  }
});

dom.resetBtn.addEventListener("click", () => {
  if (!requireEdit("重置计划")) return;
  saveVersionSnapshot("重置前版本");
  state = ensurePlanDates(buildKyotoPlan());
  activeDay = 0;
  activeStop = 0;
  transportFilterApplied = false;
  saveState("已重置示例");
  render();
  broadcastPlanReplaced("重置示例计划");
});

document.querySelectorAll(".sync-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!requireEdit("导入外部记录")) return;
    pendingProvider = card.dataset.provider;
    const defaults = providerDefaults(pendingProvider);
    lastParsedImport = null;
    dom.importTitle.textContent = `从${pendingProvider}导入`;
    dom.importCopy.textContent = externalImportConfig.endpoint
      ? "粘贴订单文本后可用 AI 解析，再写入计划；不会读取你的账号。"
      : "这里不会读取你的账号，只把你录入或粘贴的订单信息写入计划。";
    dom.importCategory.value = defaults.category;
    dom.importDate.value = currentDay()?.date || "";
    dom.importName.value = defaults.title;
    dom.importTime.value = defaults.time;
    dom.importBudget.value = "";
    dom.importPaid.value = "";
    dom.importPayer.value = memberProfile?.name || "";
    dom.importAddress.value = "";
    dom.importOrderNo.value = "";
    dom.importSourceUrl.value = "";
    dom.importNote.value = "";
    renderImportPreview(null);
    dom.importModal.classList.add("is-open");
    dom.importModal.setAttribute("aria-hidden", "false");
    refreshIcons();
  });
});

document.querySelectorAll("[data-close-import]").forEach((button) => {
  button.addEventListener("click", () => {
    dom.importModal.classList.remove("is-open");
    dom.importModal.setAttribute("aria-hidden", "true");
  });
});

dom.parseImportBtn.addEventListener("click", () => {
  dom.parseImportBtn.disabled = true;
  dom.syncStatus.innerHTML = `${icon("scan-text")}<span>正在解析外部订单文本...</span>`;
  requestExternalOrderParse()
    .then(({ source, parsed }) => {
      applyParsedImport(parsed, source);
      dom.syncStatus.innerHTML = `${icon("scan-text")}<span>已解析订单字段，请检查预览后导入。</span>`;
    })
    .catch((error) => {
      const parsed = parseExternalOrderText(dom.importNote.value, pendingProvider);
      applyParsedImport(parsed, "本地规则兜底");
      dom.syncStatus.innerHTML = `${icon("info")}<span>AI 解析不可用：${escapeHtml(error.message)}。已使用本地规则。</span>`;
    })
    .finally(() => {
      dom.parseImportBtn.disabled = false;
      refreshIcons();
    });
});

dom.importCategory.addEventListener("change", () => {
  const defaults = providerDefaults(dom.importCategory.value);
  if (!dom.importName.value || ["外部记录", "餐厅预约", "住宿入住", "交通订单", "景点预约"].includes(dom.importName.value)) {
    dom.importName.value = defaults.title;
  }
});

dom.importForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = dom.importName.value.trim() || "外部记录";
  const category = normalizeImportCategory(dom.importCategory.value, pendingProvider);
  const targetDayIndex = dayIndexByDate(dom.importDate.value);
  const targetDay = state.days[targetDayIndex] || currentDay();
  const defaults = providerDefaults(category);
  const metadataLines = [
    `来源：${pendingProvider || "外部导入"}`,
    `类别：${category}`,
    dom.importOrderNo.value.trim() ? `订单号：${dom.importOrderNo.value.trim()}` : "",
    dom.importSourceUrl.value.trim() ? `链接：${dom.importSourceUrl.value.trim()}` : "",
    lastParsedImport?.source ? `解析：${lastParsedImport.source}` : "",
  ].filter(Boolean);
  const rawNote = dom.importNote.value.trim();
  const note = [metadataLines.join("\n"), rawNote].filter(Boolean).join("\n\n");
  let createdStop = null;
  mutate(`导入${pendingProvider}记录`, () => {
    createdStop = makeStop({
      time: dom.importTime.value.trim() || "18:30",
      title,
      type: category,
      address: dom.importAddress.value.trim() || "地址待确认",
      note: note || `${pendingProvider}记录，后续可继续补充订单详情。`,
      tags: ["已导入", pendingProvider, category].filter(Boolean),
      budget: numberValue(dom.importBudget.value),
      paid: numberValue(dom.importPaid.value),
      payer: dom.importPayer.value.trim(),
      image: defaults.image,
      x: 78,
      y: 60,
    });
    targetDay.stops.push(createdStop);
    activeDay = targetDayIndex;
    activeStop = targetDay.stops.length - 1;
    dom.syncBadge.textContent = "已导入";
    dom.syncStatus.innerHTML = `${icon("check-circle-2")}<span>${pendingProvider}记录已加入 ${targetDay.label}，可在右侧继续编辑。</span>`;
    dom.importModal.classList.remove("is-open");
    dom.importModal.setAttribute("aria-hidden", "true");
  }, { requireUnlocked: false });
  if (createdStop) broadcastStopCreated(targetDay.id, createdStop);
});

async function boot() {
  if (memberProfile) {
    memberProfile = normalizeMemberProfile(memberProfile);
    sessionStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(memberProfile));
  }
  dom.collabName.value = memberProfile?.name || localStorage.getItem("tripboard-user-name") || "";
  dom.collabRole.value = memberProfile?.role || localStorage.getItem("tripboard-user-role") || "";
  const appConfig = window.TRIPBOARD_CONFIG || {};
  const isLegacyTransportEndpoint =
    ctripConfig.endpoint &&
    (ctripConfig.endpoint === appConfig.ctripProxyUrl ||
      ctripConfig.endpoint === appConfig.amadeusFlightProxyUrl ||
      /\/functions\/v1\/(?:ctrip-transport|amadeus-flight-offers)\b/.test(ctripConfig.endpoint));
  const isPlaceholderEndpoint = /example\.com\/api\/ctrip\/transport|your-project\.supabase\.co\/functions\/v1\/(?:amadeus-flight-offers|searchapi-flight-offers)/.test(ctripConfig.endpoint || "");
  const defaultTransportEndpoint = appConfig.searchApiFlightProxyUrl || appConfig.amadeusFlightProxyUrl || appConfig.ctripProxyUrl || "";
  if ((!ctripConfig.endpoint || isPlaceholderEndpoint || isLegacyTransportEndpoint) && defaultTransportEndpoint) {
    ctripConfig = { endpoint: defaultTransportEndpoint, token: "" };
    localStorage.setItem(CTRIP_CONFIG_KEY, JSON.stringify(ctripConfig));
  }
  if ((!externalImportConfig.endpoint || /your-project\.supabase\.co\/functions\/v1\/external-order-parse/.test(externalImportConfig.endpoint)) && appConfig.externalOrderParseProxyUrl) {
    externalImportConfig = { endpoint: appConfig.externalOrderParseProxyUrl, token: "" };
    localStorage.setItem(EXTERNAL_IMPORT_CONFIG_KEY, JSON.stringify(externalImportConfig));
  }
  const isPlaceholderAiEndpoint = /your-domain\.com\/api\/route-optimize/.test(serviceConfig.aiEndpoint || "");
  if ((!serviceConfig.aiEndpoint || isPlaceholderAiEndpoint) && appConfig.aiRouteProxyUrl) {
    serviceConfig = { ...serviceConfig, aiEndpoint: appConfig.aiRouteProxyUrl, aiToken: "" };
    localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
  }
  const isPlaceholderAmapEndpoint = /your-domain\.com\/api\/amap-place/.test(serviceConfig.amapEndpoint || "");
  if ((!serviceConfig.amapEndpoint || isPlaceholderAmapEndpoint) && appConfig.amapPlaceProxyUrl) {
    serviceConfig = { ...serviceConfig, amapEndpoint: appConfig.amapPlaceProxyUrl };
    localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
  }
  const isPlaceholderAmapRouteEndpoint = /your-project\.supabase\.co\/functions\/v1\/amap-route-plan/.test(serviceConfig.amapRouteEndpoint || "");
  if ((!serviceConfig.amapRouteEndpoint || isPlaceholderAmapRouteEndpoint) && appConfig.amapRouteProxyUrl) {
    serviceConfig = { ...serviceConfig, amapRouteEndpoint: appConfig.amapRouteProxyUrl };
    localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
  }
  dom.ctripEndpointInput.value = ctripConfig.endpoint || "";
  dom.ctripTokenInput.value = ctripConfig.token || "";
  dom.aiRouteEndpointInput.value = serviceConfig.aiEndpoint || "";
  dom.aiRouteTokenInput.value = serviceConfig.aiToken || "";
  dom.amapEndpointInput.value = serviceConfig.amapEndpoint || "";
  dom.amapRouteEndpointInput.value = serviceConfig.amapRouteEndpoint || "";
  dom.weatherEndpointInput.value = serviceConfig.weatherEndpoint || "";
  renderServiceStatus();
  if (ctripConfig.endpoint) {
    dom.syncBadge.textContent = "已配置接口";
    setCtripStatus("已读取本机保存的 Google Flights 航班代理地址。配置 Supabase 密钥后可测试连接并同步航班。", "plug-zap");
  }
  guideState.destination = state.destination || guideState.destination;
  guideState.origin = state.origin || guideState.origin;
  guideState.startDate = state.startDate || guideState.startDate;
  guideState.endDate = state.endDate || guideState.endDate;
  dom.destinationInput.value = guideState.destination;
  dom.originInput.value = guideState.origin;
  dom.partySizeInput.value = state.partySize || 1;
  if (!dom.transportFrom.value) dom.transportFrom.value = guideState.origin;
  initSupabaseClient();
  render();
  renderMembers();
  if (supabaseClient && tripId) {
    await connectSharedTrip(tripId);
  } else {
    saveState();
  }
}

boot();
