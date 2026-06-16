const STORAGE_KEY = "tripboard-editable-v1";
const CTRIP_CONFIG_KEY = "tripboard-ctrip-connector-v1";

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
  return JSON.parse(JSON.stringify(value));
}

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function money(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
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
  tags = ["草稿"],
  budget = 0,
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
    tags: normalizeTags(tags),
    budget: Number(budget || 0),
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

const dom = {
  tripName: document.querySelector("#tripName"),
  templateName: document.querySelector("#templateName"),
  tripCover: document.querySelector("#tripCover"),
  tripDateRange: document.querySelector("#tripDateRange"),
  collabMode: document.querySelector("#collabMode"),
  collabName: document.querySelector("#collabName"),
  collabStatus: document.querySelector("#collabStatus"),
  createSharedTripBtn: document.querySelector("#createSharedTripBtn"),
  copySharedLinkBtn: document.querySelector("#copySharedLinkBtn"),
  budgetTotal: document.querySelector("#budgetTotal"),
  budgetMeter: document.querySelector("#budgetMeter"),
  budgetGrid: document.querySelector("#budgetGrid"),
  dayList: document.querySelector("#dayList"),
  routeLabel: document.querySelector("#routeLabel"),
  dayTitle: document.querySelector("#dayTitle"),
  saveState: document.querySelector("#saveState"),
  dayPills: document.querySelector("#dayPills"),
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
  fieldAddress: document.querySelector("#fieldAddress"),
  fieldAmapKeyword: document.querySelector("#fieldAmapKeyword"),
  fieldLng: document.querySelector("#fieldLng"),
  fieldLat: document.querySelector("#fieldLat"),
  fieldTags: document.querySelector("#fieldTags"),
  fieldNote: document.querySelector("#fieldNote"),
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
  amapLookupBtn: document.querySelector("#amapLookupBtn"),
  fieldAmapLink: document.querySelector("#fieldAmapLink"),
  exportBtn: document.querySelector("#exportBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  importModal: document.querySelector("#importModal"),
  importTitle: document.querySelector("#importTitle"),
  importCopy: document.querySelector("#importCopy"),
  importForm: document.querySelector("#importForm"),
  importName: document.querySelector("#importName"),
  importTime: document.querySelector("#importTime"),
  importBudget: document.querySelector("#importBudget"),
  importAddress: document.querySelector("#importAddress"),
  importNote: document.querySelector("#importNote"),
  createChoiceModal: document.querySelector("#createChoiceModal"),
  createChoiceTitle: document.querySelector("#createChoiceTitle"),
  createChoiceCopy: document.querySelector("#createChoiceCopy"),
  recommendedPlanBtn: document.querySelector("#recommendedPlanBtn"),
  blankPlanBtn: document.querySelector("#blankPlanBtn"),
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
  activityList: document.querySelector("#activityList"),
};

let state = ensurePlanDates(loadState());
let activeDay = 0;
let activeStop = 0;
let pendingProvider = "";
let transportFilterApplied = false;
let transportProviderItems = [];
let ctripConfig = safeJsonParse(localStorage.getItem(CTRIP_CONFIG_KEY), { endpoint: "", token: "" }) || { endpoint: "", token: "" };
let supabaseClient = null;
let realtimeChannel = null;
let tripId = new URLSearchParams(window.location.search).get("trip") || localStorage.getItem("tripboard-current-trip-id") || "";
let isApplyingRemote = false;
let lastRemoteUpdatedAt = "";
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

async function saveState(label = "已保存到本地") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  dom.saveState.textContent = label;
  if (!isApplyingRemote && supabaseClient && tripId) {
    await pushRemoteState(label);
  }
}

function logActivity(text) {
  state.activities = [{ text, at: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) }, ...(state.activities || [])].slice(0, 6);
}

function getCollabName() {
  const name = dom.collabName.value.trim() || localStorage.getItem("tripboard-user-name") || "匿名成员";
  localStorage.setItem("tripboard-user-name", name);
  return name;
}

function getShareUrl() {
  if (!tripId) return "";
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  return url.toString();
}

function initSupabaseClient() {
  const config = window.TRIPBOARD_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase?.createClient) {
    dom.collabMode.textContent = "本地模式";
    dom.collabStatus.textContent = "未配置 Supabase，当前计划只保存在这个浏览器。";
    return;
  }
  supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  dom.collabMode.textContent = tripId ? "云端协作" : "可创建共享";
  dom.collabStatus.textContent = tripId ? `已连接计划：${tripId}` : "已配置云端，可创建共享计划。";
}

async function pushRemoteState(label = "已同步云端") {
  if (!supabaseClient || !tripId) return;
  const payload = {
    id: tripId,
    data: state,
    updated_at: new Date().toISOString(),
    updated_by: getCollabName(),
  };
  const { error } = await supabaseClient.from("trip_plans").upsert(payload, { onConflict: "id" });
  if (error) {
    dom.collabStatus.textContent = `云端同步失败：${error.message}`;
    return;
  }
  dom.collabMode.textContent = "云端协作";
  dom.collabStatus.textContent = `${label}，共享链接可复制给其他成员。`;
}

async function loadRemoteState() {
  if (!supabaseClient || !tripId) return;
  const { data, error } = await supabaseClient.from("trip_plans").select("data, updated_at, updated_by").eq("id", tripId).maybeSingle();
  if (error) {
    dom.collabStatus.textContent = `读取共享计划失败：${error.message}`;
    return;
  }
  if (data?.data?.days?.length) {
    isApplyingRemote = true;
    state = data.data;
    ensurePlanDates(state);
    lastRemoteUpdatedAt = data.updated_at || "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    dom.saveState.textContent = `已载入共享计划`;
    dom.collabStatus.textContent = data.updated_by ? `最近由 ${data.updated_by} 更新` : `已连接共享计划`;
    render();
    isApplyingRemote = false;
  } else {
    await pushRemoteState("已创建共享计划");
  }
}

function subscribeRemoteState() {
  if (!supabaseClient || !tripId) return;
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }
  realtimeChannel = supabaseClient
    .channel(`trip-plan-${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_plans", filter: `id=eq.${tripId}` },
      (payload) => {
        const next = payload.new;
        if (!next?.data?.days?.length || next.updated_at === lastRemoteUpdatedAt) return;
        lastRemoteUpdatedAt = next.updated_at;
        isApplyingRemote = true;
        state = next.data;
        ensurePlanDates(state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        dom.saveState.textContent = "收到协作者更新";
        dom.collabStatus.textContent = next.updated_by ? `${next.updated_by} 刚刚更新了计划` : "共享计划已更新";
        render();
        isApplyingRemote = false;
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        dom.collabMode.textContent = "实时同步";
      }
    });
}

async function connectSharedTrip(id) {
  tripId = id;
  localStorage.setItem("tripboard-current-trip-id", tripId);
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  window.history.replaceState({}, "", url.toString());
  await loadRemoteState();
  subscribeRemoteState();
}

async function createSharedTrip() {
  if (!supabaseClient) {
    dom.collabStatus.textContent = "请先配置 config.js 里的 Supabase URL 和 anon key。";
    return;
  }
  const id = crypto.randomUUID ? crypto.randomUUID() : uid();
  tripId = id;
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

function normalizeTransportItem(item, index, fallbackRoute) {
  const type = item.type === "train" || item.type === "flight" ? item.type : String(item.type || "").includes("train") ? "train" : "flight";
  const depart = item.depart || item.departTime || item.startTime || "09:00";
  const arrive = item.arrive || item.arriveTime || item.endTime || addMinutesToTime(depart, Number(item.duration || 120));
  const duration = Number(item.duration || Math.max(30, (timeToMinutes(arrive) ?? 0) - (timeToMinutes(depart) ?? 0)) || 120);
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
    source: item.source || "携程",
  };
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
  const options = transportProviderItems.length ? transportProviderItems : buildTransportOptions(day, activeDay);
  const filtered = options.filter(matchesTransportFilter);
  const visible = transportFilterApplied ? filtered : filtered.slice(0, 4);
  if (!dom.transportFrom.value) dom.transportFrom.value = route.from;
  if (!dom.transportTo.value) dom.transportTo.value = route.to;

  dom.flightAvgPrice.textContent = money(averagePrice(options, "flight"));
  dom.trainAvgPrice.textContent = money(averagePrice(options, "train"));
  dom.transportProviderStatus.textContent = transportProviderItems.length ? "携程已同步" : "携程 API 待接入";
  dom.transportDayHint.textContent = `${day?.date ? formatDisplayDate(day.date) : day?.label} · ${route.from} 到 ${route.to}，${transportProviderItems.length ? "当前显示后端同步报价。" : "当前为可筛选示例报价。"}`;
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

async function requestCtripTransport({ testOnly = false } = {}) {
  saveCtripConfig();
  if (!ctripConfig.endpoint) {
    setCtripStatus("请先填写你的后端代理接口地址。这个地址由你控制，负责安全保存携程密钥并调用官方 API。", "alert-circle");
    return null;
  }
  const payload = { ...getCtripPayload(), testOnly };
  setCtripStatus(testOnly ? "正在测试后端代理连接..." : "正在通过后端代理同步携程交通报价...", "loader");
  try {
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
  } catch (error) {
    setCtripStatus(`连接失败：${error.message}。如果接口在本地，请先部署为 HTTPS 后端或 Supabase Edge Function，公开页面无法直接访问你的本机服务。`, "alert-triangle");
    return null;
  }
}

async function testCtripConnection() {
  const data = await requestCtripTransport({ testOnly: true });
  if (!data) return;
  setCtripStatus(data.message || "连接成功。现在可以点击“同步当天交通”拉取报价。", "check-circle-2");
  dom.syncBadge.textContent = "接口可用";
}

async function syncCtripTransport() {
  const data = await requestCtripTransport();
  if (!data) return;
  const route = defaultTransportRoute(currentDay());
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
  if (!rawItems.length) {
    transportProviderItems = [];
    setCtripStatus("后端已响应，但没有返回班次。请检查日期、城市、时间段，或确认你的携程 API 权限是否包含机票/火车票报价。", "alert-circle");
    renderTransport();
    return;
  }
  transportProviderItems = rawItems.map((item, index) => normalizeTransportItem(item, index, route));
  transportFilterApplied = true;
  setCtripStatus(`已同步 ${transportProviderItems.length} 条携程交通报价，并更新当前交通列表。`, "check-circle-2");
  dom.syncBadge.textContent = "携程已同步";
  logActivity(`同步携程交通报价 ${transportProviderItems.length} 条`);
  saveState("已同步携程报价");
  render();
}

function totalBudget() {
  return state.days.reduce((sum, day) => sum + day.stops.reduce((daySum, stop) => daySum + Number(stop.budget || 0), 0), 0);
}

function categoryBudget() {
  const groups = { 交通: 0, 餐饮: 0, 门票: 0, 住宿: 0 };
  state.days.forEach((day) => {
    day.stops.forEach((stop) => {
      const title = `${stop.title}${stop.type}${stop.tags.join("")}`;
      const value = Number(stop.budget || 0);
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
  dom.routeDistance.textContent = `${Math.max(1, day.stops.length * 3.4).toFixed(1)} km`;
  dom.routeDuration.textContent = `${Math.max(25, day.stops.length * 22)} min`;
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

  dom.fieldTime.value = stop.time || "";
  dom.fieldTitle.value = stop.title || "";
  dom.fieldType.value = stop.type || "";
  dom.fieldBudget.value = stop.budget || "";
  dom.fieldAddress.value = stop.address || "";
  dom.fieldAmapKeyword.value = stop.amapKeyword || `${state.destination || ""} ${stop.title}`.trim();
  dom.fieldLng.value = stop.lng || "";
  dom.fieldLat.value = stop.lat || "";
  const detailKeyword = dom.fieldAmapKeyword.value || stop.title;
  dom.fieldAmapLink.href = amapSearchUrl(detailKeyword);
  dom.fieldAmapLink.textContent = `在高德搜索：${detailKeyword}`;
  dom.fieldTags.value = (stop.tags || []).join(", ");
  dom.fieldNote.value = stop.note || "";

  dom.commentList.innerHTML = (stop.comments || [])
    .map((comment) => `<div class="comment-item"><span class="avatar a2">${comment.author || "我"}</span><p>${comment.text}</p></div>`)
    .join("") || `<div class="comment-item"><span class="avatar a1">我</span><p>还没有评论，可以先添加同行意见。</p></div>`;
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
  refreshIcons();
}

function mutate(label, action) {
  action();
  logActivity(label);
  saveState(label);
  render();
}

dom.dayList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  activeDay = Number(button.dataset.day);
  activeStop = 0;
  render();
});

dom.timeline.addEventListener("click", (event) => {
  const card = event.target.closest("[data-stop]");
  if (!card) return;
  activeStop = Number(card.dataset.stop);
  render();
});

dom.mapCanvas.addEventListener("click", (event) => {
  const pin = event.target.closest("[data-stop]");
  if (!pin) return;
  activeStop = Number(pin.dataset.stop);
  render();
});

dom.stopForm.addEventListener("submit", (event) => {
  event.preventDefault();
  mutate(`保存「${dom.fieldTitle.value || "地点"}」`, () => {
    const stop = currentStop();
    stop.time = dom.fieldTime.value.trim();
    stop.title = dom.fieldTitle.value.trim() || "未命名地点";
    stop.type = dom.fieldType.value.trim() || "Place";
    stop.budget = Number(dom.fieldBudget.value || 0);
    stop.address = dom.fieldAddress.value.trim();
    stop.amapKeyword = dom.fieldAmapKeyword.value.trim();
    stop.lng = dom.fieldLng.value.trim();
    stop.lat = dom.fieldLat.value.trim();
    stop.tags = normalizeTags(dom.fieldTags.value);
    stop.note = dom.fieldNote.value.trim();
  });
});

dom.addStopBtn.addEventListener("click", () => {
  mutate("新增地点", () => {
    const day = currentDay();
    day.stops.push(
      makeStop({
        time: "18:00",
        title: "新地点",
        note: "在右侧编辑名称、地址、预算和备注。",
        tags: ["草稿"],
        budget: 0,
        x: 70,
        y: 32,
      }),
    );
    activeStop = day.stops.length - 1;
  });
});

dom.quickAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = dom.quickPlaceName.value.trim();
  if (!name) return;
  const keyword = dom.quickAmapKeyword.value.trim() || `${state.destination || ""} ${name}`.trim();
  mutate(`加入景点「${name}」`, () => {
    const day = currentDay();
    day.stops.push(
      makeStop({
        time: dom.quickTime.value.trim() || "10:00",
        title: name,
        type: "Scenic",
        address: dom.quickAddress.value.trim() || keyword,
        note: `从快速录入加入。高德关键词：${keyword}`,
        tags: ["自定义", "待优化"],
        budget: Number(dom.quickBudget.value || 0),
        amapKeyword: keyword,
        x: 30 + ((day.stops.length * 17) % 52),
        y: 28 + ((day.stops.length * 13) % 42),
        image: state.cover || images.city,
      }),
    );
    activeStop = day.stops.length - 1;
    dom.quickPlaceName.value = "";
    dom.quickAmapKeyword.value = "";
    dom.quickTime.value = "";
    dom.quickBudget.value = "";
    dom.quickAddress.value = "";
  });
});

dom.openAmapBtn.addEventListener("click", () => {
  const keyword =
    dom.quickAmapKeyword.value.trim() ||
    `${state.destination || ""} ${dom.quickPlaceName.value.trim()}`.trim() ||
    state.destination ||
    "景点";
  dom.quickAmapLink.href = amapSearchUrl(keyword);
  dom.quickAmapLink.textContent = `打开高德搜索：${keyword}`;
  dom.optimizeHint.textContent = `已生成高德链接：${keyword}`;
});

dom.amapLookupBtn.addEventListener("click", () => {
  const stop = currentStop();
  const keyword = dom.fieldAmapKeyword.value.trim() || `${state.destination || ""} ${stop.title}`.trim();
  dom.fieldAmapLink.href = amapSearchUrl(keyword);
  dom.fieldAmapLink.textContent = `打开高德搜索：${keyword}`;
  dom.saveState.textContent = `已生成高德链接：${keyword}`;
});

dom.deleteStopBtn.addEventListener("click", () => {
  const day = currentDay();
  if (day.stops.length <= 1) {
    dom.saveState.textContent = "每天至少保留一个地点";
    return;
  }
  const title = currentStop().title;
  mutate(`删除「${title}」`, () => {
    day.stops.splice(activeStop, 1);
    activeStop = Math.max(0, activeStop - 1);
  });
});

dom.moveUpBtn.addEventListener("click", () => {
  if (activeStop === 0) return;
  mutate("上移地点", () => {
    const stops = currentDay().stops;
    [stops[activeStop - 1], stops[activeStop]] = [stops[activeStop], stops[activeStop - 1]];
    activeStop -= 1;
  });
});

dom.moveDownBtn.addEventListener("click", () => {
  const stops = currentDay().stops;
  if (activeStop >= stops.length - 1) return;
  mutate("下移地点", () => {
    [stops[activeStop + 1], stops[activeStop]] = [stops[activeStop], stops[activeStop + 1]];
    activeStop += 1;
  });
});

function optimizeCurrentDayRoute() {
  const day = currentDay();
  if (day.stops.length < 3) {
    dom.optimizeHint.textContent = "当前天少于 3 个地点，暂时不需要优化路径。";
    return;
  }

  mutate("AI 优化当天路径", () => {
    const [start, ...rest] = day.stops;
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

    day.stops = optimized.map((stop, index) => ({
      ...stop,
      tags: Array.from(new Set([...(stop.tags || []).filter((tag) => tag !== "待优化"), index === 0 ? "起点" : "已优化"])),
    }));
    activeStop = 0;
    dom.optimizeHint.textContent = `已按${day.stops.length}个地点的地图位置优化顺序；接入后端 AI 后可进一步考虑营业时间、交通方式和停留时长。`;
  });
}

dom.optimizeRouteBtn.addEventListener("click", optimizeCurrentDayRoute);

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

dom.commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = dom.commentInput.value.trim();
  if (!text) return;
  mutate(`评论「${currentStop().title}」`, () => {
    currentStop().comments = [...(currentStop().comments || []), { author: "我", text }];
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
  mutate(`加入备选「${candidate.title}」`, () => {
    currentDay().stops.push(candidate);
    activeStop = currentDay().stops.length - 1;
  });
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
  transportProviderItems = [];
  transportFilterApplied = true;
  renderTransport();
  refreshIcons();
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
  });
  closeCreateChoice();
}

function createBlankTemplate() {
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
  });
  closeCreateChoice();
}

dom.applyGuideBtn.addEventListener("click", () => {
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
  logActivity("导出计划 JSON");
  saveState("已导出 JSON");
  renderActivities();
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
  const url = getShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    dom.collabStatus.textContent = "共享链接已复制。";
  } catch {
    dom.collabStatus.textContent = url;
  }
});

dom.collabName.addEventListener("input", () => {
  localStorage.setItem("tripboard-user-name", dom.collabName.value.trim());
});

dom.ctripLoginBtn.addEventListener("click", () => {
  const nextOpen = dom.ctripConnectPanel.hidden;
  dom.ctripConnectPanel.hidden = !nextOpen;
  dom.syncBadge.textContent = ctripConfig.endpoint ? "已配置接口" : "等待配置";
  setCtripStatus(
    nextOpen
      ? "请填写你的后端代理接口，然后点击“测试连接”。携程密钥只放在后端环境变量里。"
      : "携程接入配置已收起。",
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
  state = ensurePlanDates(buildKyotoPlan());
  activeDay = 0;
  activeStop = 0;
  transportFilterApplied = false;
  saveState("已重置示例");
  render();
});

document.querySelectorAll(".sync-card").forEach((card) => {
  card.addEventListener("click", () => {
    pendingProvider = card.dataset.provider;
    dom.importTitle.textContent = `从${pendingProvider}导入`;
    dom.importCopy.textContent = "这里不会读取你的账号，只把你录入或粘贴的订单信息写入当天行程。";
    dom.importName.value = pendingProvider.includes("民宿") ? "民宿入住" : pendingProvider.includes("美团") ? "餐厅预约" : "外部记录";
    dom.importTime.value = pendingProvider.includes("民宿") ? "15:00" : "18:30";
    dom.importBudget.value = "";
    dom.importAddress.value = "";
    dom.importNote.value = "";
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

dom.importForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = dom.importName.value.trim() || "外部记录";
  mutate(`导入${pendingProvider}记录`, () => {
    const stop = makeStop({
      time: dom.importTime.value.trim() || "18:30",
      title,
      type: "Synced",
      address: dom.importAddress.value.trim() || "地址待确认",
      note: dom.importNote.value.trim() || `${pendingProvider}记录，后续可继续补充订单详情。`,
      tags: ["已导入", pendingProvider],
      budget: Number(dom.importBudget.value || 0),
      image: pendingProvider.includes("民宿") ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" : images.food,
      x: 78,
      y: 60,
    });
    currentDay().stops.push(stop);
    activeStop = currentDay().stops.length - 1;
    dom.syncBadge.textContent = "已导入";
    dom.syncStatus.innerHTML = `${icon("check-circle-2")}<span>${pendingProvider}记录已加入当天行程，可在右侧继续编辑。</span>`;
    dom.importModal.classList.remove("is-open");
    dom.importModal.setAttribute("aria-hidden", "true");
  });
});

async function boot() {
  dom.collabName.value = localStorage.getItem("tripboard-user-name") || "";
  const appConfig = window.TRIPBOARD_CONFIG || {};
  const isPlaceholderEndpoint = /example\.com\/api\/ctrip\/transport/.test(ctripConfig.endpoint || "");
  if ((!ctripConfig.endpoint || isPlaceholderEndpoint) && appConfig.ctripProxyUrl) {
    ctripConfig = { endpoint: appConfig.ctripProxyUrl, token: "" };
    localStorage.setItem(CTRIP_CONFIG_KEY, JSON.stringify(ctripConfig));
  }
  dom.ctripEndpointInput.value = ctripConfig.endpoint || "";
  dom.ctripTokenInput.value = ctripConfig.token || "";
  if (ctripConfig.endpoint) {
    dom.syncBadge.textContent = "已配置接口";
    setCtripStatus("已读取本机保存的携程后端代理地址，可测试连接或同步当天交通。", "plug-zap");
  }
  guideState.destination = state.destination || guideState.destination;
  guideState.origin = state.origin || guideState.origin;
  guideState.startDate = state.startDate || guideState.startDate;
  guideState.endDate = state.endDate || guideState.endDate;
  dom.destinationInput.value = guideState.destination;
  dom.originInput.value = guideState.origin;
  if (!dom.transportFrom.value) dom.transportFrom.value = guideState.origin;
  initSupabaseClient();
  render();
  if (supabaseClient && tripId) {
    await connectSharedTrip(tripId);
  } else {
    saveState();
  }
}

boot();
