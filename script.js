const {
  STORAGE_KEY,
  PLAN_LIBRARY_KEY,
  CURRENT_PLAN_ID_KEY,
  CTRIP_CONFIG_KEY,
  MEMBER_PROFILE_KEY,
  SERVICE_CONFIG_KEY,
  EXTERNAL_IMPORT_CONFIG_KEY,
  EDIT_ACCESS_PREFIX,
  EDIT_KEY_VALUE_PREFIX,
  VERSION_PREFIX,
  PENDING_PLAN_UPDATES_PREFIX,
  COLLAPSED_BLOCKS_PREFIX,
  MAX_VERSION_HISTORY,
  MAX_PENDING_PLAN_UPDATES,
  PLAN_REPLACE_REASONS,
  EXTERNAL_IMPORT_TIMEOUT_MS,
  YJS_MODULE_URL,
  COLLAB_TEXT_FIELDS,
  COLLAB_TEXT_FIELD_BY_FIELD,
  COMMENT_FILTERS,
  COMMENT_INDEX_FILTERS,
  ACTIVITY_FILTERS,
  ACTIVITY_TYPE_LABELS,
  COLLAB_DAY_TEXT_FIELDS,
  COLLAB_PLAN_TEXT_PRESENCE_FIELDS,
  COLLAB_STRUCT_FIELDS,
  COLLAB_STRUCT_PRESENCE_FIELDS,
  COLLAB_PRESENCE_TEXT_FIELDS,
  COLLAB_PRESENCE_TEXT_FIELD_BY_FIELD,
  COLLAB_COMMENT_ANCHOR_FIELDS,
  COLLAB_STOP_COMMENT_ANCHOR_FIELDS,
  COLLAB_DAY_COMMENT_ANCHOR_FIELDS,
  PLAN_SETTING_FIELDS,
  PLAN_TEXT_SETTING_FIELDS,
  DAY_BLOCK_TYPES,
  DAY_BLOCK_COMMANDS,
} = window.TripboardConstants;

const LOCAL_IMAGE_VERSION = "stable-images-v1";
const PLACE_IMAGE_LOOKUP_VERSION = "real-photos-v2";

function localTripImage(name = "") {
  return `assets/trip-images/${name}.svg?v=${LOCAL_IMAGE_VERSION}`;
}

const LOCAL_TRIP_IMAGE_LABELS = {
  kyoto: ["京都", "寺院与街巷"],
  gansu: ["甘肃", "丝路、丹霞与沙漠"],
  city: ["城市", "城市漫游与集合"],
  food: ["美食", "餐饮与夜市"],
  train: ["交通", "机场、动车与转场"],
  museum: ["文化", "博物馆与历史街区"],
  qinghai: ["青海", "高原湖泊与盐湖"],
  qingdao: ["青岛", "海滨、老城与崂山"],
  "inner-mongolia": ["内蒙古", "草原、湿地与边境城市"],
  nature: ["自然", "山水与户外路线"],
  "mountain-lake": ["山湖", "高山湖泊与峡谷"],
  forest: ["森林", "林海、雪景与湿地"],
  jilin: ["吉林", "长白山与雾凇"],
  lodging: ["住宿", "酒店与民宿"],
  "changbai-mountain": ["长白山天池", "高山湖泊"],
  jingyuetan: ["净月潭", "森林公园"],
  "rime-island": ["雾凇岛", "冬季江畔"],
  "qinghai-museum": ["青海省博物馆", "文化展馆"],
  "qinghai-lake": ["青海湖", "高原湖泊"],
  "black-horse-river": ["黑马河", "环湖日落"],
  "chaka-salt-lake": ["茶卡盐湖", "天空之镜"],
  "taer-monastery": ["塔尔寺", "藏传佛教寺院"],
  "qilian-zhuoer": ["祁连卓尔山", "草原与山脊"],
  "riyue-mountain": ["日月山", "青海湖路上"],
  "dongguan-mosque": ["东关清真大寺", "西宁文化街区"],
  "mogao-caves": ["莫高窟", "敦煌石窟"],
  "zhangye-danxia": ["张掖七彩丹霞", "彩色丘陵"],
  "crescent-lake": ["鸣沙山月牙泉", "沙漠与泉"],
  "jiayuguan-fort": ["嘉峪关关城", "河西走廊"],
  "gansu-museum": ["甘肃省博物馆", "丝路文化"],
  "lanzhou-zhongshan-bridge": ["黄河铁桥", "兰州黄河"],
  "qingdao-zhanqiao": ["栈桥", "青岛海滨"],
  "qingdao-badaguan": ["八大关", "老城街区"],
  "qingdao-laoshan": ["崂山", "山海景区"],
  "qingdao-may-fourth": ["五四广场", "城市地标"],
  "hulunbuir-grassland": ["呼伦贝尔草原", "草原腹地"],
  "ergun-wetland": ["额尔古纳湿地", "湿地观景"],
  "manzhouli-square": ["满洲里套娃广场", "边境城市"],
  "arxan-forest": ["阿尔山森林公园", "火山森林"],
};

const images = {
  kyoto: localTripImage("kyoto"),
  gansu: localTripImage("gansu"),
  city: localTripImage("city"),
  food: localTripImage("food"),
  train: localTripImage("train"),
  museum: localTripImage("museum"),
  qinghai: localTripImage("qinghai"),
  qingdao: localTripImage("qingdao"),
  innerMongolia: localTripImage("inner-mongolia"),
  nature: localTripImage("nature"),
  mountainLake: localTripImage("mountain-lake"),
  forest: localTripImage("forest"),
  jilin: localTripImage("jilin"),
  lodging: localTripImage("lodging"),
};

const DESTINATION_IMAGE_RULES = [
  [/吉林|长春|长白山|天池|净月潭|雾凇|延吉|Jilin|Changbai/i, images.jilin],
  [/黑龙江|哈尔滨|雪乡|亚布力|漠河|东北|Harbin/i, images.forest],
  [/内蒙古|呼和浩特|呼伦贝尔|满洲里|额尔古纳|阿尔山|草原|Inner.?Mongolia/i, images.innerMongolia],
  [/甘肃|敦煌|张掖|嘉峪关|兰州|沙漠|丹霞|丝路|Gansu|Dunhuang/i, images.gansu],
  [/青海|西宁|茶卡|青海湖|Qinghai|Xining|Chaka/i, images.qinghai],
  [/青岛|厦门|三亚|海南|海口|舟山|珠海|海岛|海滨|Qingdao|Xiamen|Sanya/i, images.qingdao],
  [/云南|大理|丽江|香格里拉|昆明|桂林|阳朔|漓江|贵州|张家界|九寨沟|川西|稻城|Yunnan|Guilin|Zhangjiajie/i, images.nature],
  [/西藏|拉萨|林芝|新疆|喀纳斯|伊犁|赛里木湖|可可托海|Tibet|Xinjiang/i, images.mountainLake],
  [/北京|西安|洛阳|南京|开封|平遥|故宫|兵马俑|古城|Beijing|Xi.?an/i, images.museum],
  [/成都|重庆|四川|杭州|苏州|上海|广州|深圳|长沙|武汉|城市|Chengdu|Chongqing|Hangzhou|Shanghai/i, images.city],
];

const SPECIFIC_IMAGE_RULES = [
  [/长白山|天池|Changbai/i, localTripImage("changbai-mountain")],
  [/净月潭|Jingyue|Jingyuetan/i, localTripImage("jingyuetan")],
  [/雾凇|Rime/i, localTripImage("rime-island")],
  [/青海省博物馆|Qinghai Provincial Museum/i, localTripImage("qinghai-museum")],
  [/青海湖|二郎剑|Qinghai Lake/i, localTripImage("qinghai-lake")],
  [/黑马河|环湖住宿|Qinghai Lake.*2016/i, localTripImage("black-horse-river")],
  [/茶卡|盐湖|Chaka/i, localTripImage("chaka-salt-lake")],
  [/塔尔寺|Kumbum|Ta'?er/i, localTripImage("taer-monastery")],
  [/祁连|卓尔山|Qilian/i, localTripImage("qilian-zhuoer")],
  [/日月山|Riyue/i, localTripImage("riyue-mountain")],
  [/东关清真大寺|Dongguan.*Mosque/i, localTripImage("dongguan-mosque")],
  [/莫高窟|Mogao/i, localTripImage("mogao-caves")],
  [/七彩丹霞|张掖.*丹霞|丹霞.*张掖|Zhangye.*Danxia/i, localTripImage("zhangye-danxia")],
  [/鸣沙山|月牙泉|Mingsha|Crescent/i, localTripImage("crescent-lake")],
  [/嘉峪关|关城|Jiayu|悬壁长城/i, localTripImage("jiayuguan-fort")],
  [/甘肃省博物馆|Gansu.*Museum/i, localTripImage("gansu-museum")],
  [/中山桥|黄河铁桥|Zhongshan/i, localTripImage("lanzhou-zhongshan-bridge")],
  [/栈桥|Zhanqiao/i, localTripImage("qingdao-zhanqiao")],
  [/八大关|Badaguan/i, localTripImage("qingdao-badaguan")],
  [/崂山|Laoshan|Mount Lao/i, localTripImage("qingdao-laoshan")],
  [/五四广场|May Fourth/i, localTripImage("qingdao-may-fourth")],
  [/呼伦贝尔|草原|Hulunbuir/i, localTripImage("hulunbuir-grassland")],
  [/额尔古纳|湿地|Ergun/i, localTripImage("ergun-wetland")],
  [/满洲里|套娃|Manzhouli/i, localTripImage("manzhouli-square")],
  [/阿尔山|森林|Arxan/i, localTripImage("arxan-forest")],
];

function specificRuleImageForText(...values) {
  const text = values.map((value) => String(value || "")).filter(Boolean).join(" ");
  const matched = SPECIFIC_IMAGE_RULES.find(([pattern]) => pattern.test(text));
  return matched ? cleanImageUrl(matched[1]) : "";
}

function specificRuleImageForStop(stop = {}, destination = state.destination) {
  return specificRuleImageForText(
    destination,
    stop.title,
    stop.address,
    stop.type,
    stop.amapKeyword,
  );
}

const specificImageLookupCache = new Map();
const specificImageLookupPending = new Set();
const coverImageLookupPending = new Set();
const placeImageCache = new Map();
const PLACE_IMAGE_TYPES = /Scenic|Museum|Temple|Grottoes|Geopark|River|Lake|Canyon|Fortress|Great Wall|Desert|Heritage|Culture|Walk|Mountain|Park|Gallery|Zoo|Aquarium|View|Grassland|Wetland|Forest|MountainLake|景|景区|景点|博物馆|寺|寺院|石窟|湖|山|峡谷|公园|古城|遗址|文化|街区|广场|栈桥|丹霞|月牙泉|盐湖|花海|草原|湿地|森林/i;
const NON_PLACE_IMAGE_TYPES = /\b(?:Transit|Dinner|Lunch|Cafe|Market|Food|Hotel|Rest|Train|Flight|Airport|Station)\b|交通|餐|美食|夜市|住宿|酒店|民宿|休整|返程|机场|火车|高铁|动车/i;
const {
  uid,
  clone,
  safeJsonParse,
  serializePlan,
  sameSerialized,
  money,
  escapeHtml,
  numberValue,
  normalizeList,
  fetchWithTimeout,
  normalizeTags,
  clampDays,
  addDays,
  parseIsoDate,
  formatIsoDate,
  weekdayName,
  formatDisplayDate,
  formatDatedTitle,
  daysBetweenInclusive,
  dateRangeText,
} = window.TripboardUtils;

function planContentSnapshot(plan) {
  const snapshot = clone(plan || {});
  delete snapshot.planYjs;
  return snapshot;
}

function planVersionSnapshot(plan) {
  const snapshot = clone(plan || {});
  if (!snapshot.planYjs && plan === state) snapshot.planYjs = currentPlanYjsState();
  return snapshot;
}

function planVersionSerialized(plan) {
  return serializePlan(planContentSnapshot(plan));
}

function planYjsSnapshotFromPlan(plan) {
  if (!plan?.days?.length || !yjsModule) return plan?.planYjs || "";
  try {
    return bytesToBase64(buildInitialPlanUpdate(yjsModule, plan));
  } catch (error) {
    console.warn("Plan Yjs snapshot could not be generated", error);
    return plan?.planYjs || "";
  }
}

function samePlanContent(a, b) {
  return sameSerialized(planContentSnapshot(a), planContentSnapshot(b));
}

function planVersionStats(plan = {}) {
  const days = Array.isArray(plan.days) ? plan.days : [];
  const stops = days.flatMap((day) => day.stops || []);
  const blocks = days.flatMap((day) => day.blocks || []);
  const stopComments = stops.reduce((sum, stop) => sum + normalizeComments(stop.comments || []).length, 0);
  const dayComments = days.reduce((sum, day) => sum + normalizeComments(day.comments || []).length, 0);
  const blockComments = blocks.reduce((sum, block) => sum + normalizeComments(block.comments || []).length, 0);
  const budget = stops.reduce((sum, stop) => sum + numberValue(stop.budget), 0);
  return {
    days: days.length,
    stops: stops.length,
    blocks: blocks.length,
    comments: stopComments + dayComments + blockComments,
    quotes: normalizeTransportQuotes(plan.transportQuotes || []).length,
    candidates: normalizeCandidateStops(plan.candidates || []).length,
    budget,
  };
}

function versionStatDiffLabel(label, currentValue, versionValue, formatter = (value) => String(value)) {
  const delta = Number(versionValue || 0) - Number(currentValue || 0);
  if (!delta) return "";
  const direction = delta > 0 ? "+" : "";
  return `${label} ${direction}${formatter(delta)}`;
}

function moneyDiff(value) {
  const absValue = Math.abs(Number(value || 0));
  return `${value < 0 ? "-" : ""}${money(absValue)}`;
}

function versionDiffSummary(versionPlan = {}, currentPlan = state) {
  const currentStats = planVersionStats(currentPlan);
  const versionStats = planVersionStats(versionPlan);
  const labels = [
    versionStatDiffLabel("天数", currentStats.days, versionStats.days),
    versionStatDiffLabel("地点", currentStats.stops, versionStats.stops),
    versionStatDiffLabel("协作块", currentStats.blocks, versionStats.blocks),
    versionStatDiffLabel("批注", currentStats.comments, versionStats.comments),
    versionStatDiffLabel("交通报价", currentStats.quotes, versionStats.quotes),
    versionStatDiffLabel("备选", currentStats.candidates, versionStats.candidates),
    versionStatDiffLabel("预算", currentStats.budget, versionStats.budget, moneyDiff),
  ].filter(Boolean);
  if (sameSerialized(planContentSnapshot(versionPlan), planContentSnapshot(currentPlan))) return "与当前版本一致";
  return labels.length ? labels.slice(0, 4).join(" · ") : "内容有调整";
}

const PLAN_DIFF_FIELDS = [
  ["name", "行程名"],
  ["destination", "目的地"],
  ["origin", "出发地"],
  ["dateRange", "日期范围"],
  ["startDate", "开始日期"],
  ["endDate", "结束日期"],
  ["partySize", "同行人数"],
  ["budgetLimit", "预算上限"],
  ["cover", "封面"],
];

const DAY_DIFF_FIELDS = [
  ["date", "日期"],
  ["title", "标题"],
  ["route", "路线"],
  ["weather", "天气"],
  ["transport", "交通"],
  ["amapRoute", "高德路线"],
];

const STOP_DIFF_FIELDS = [
  ["time", "时间"],
  ["title", "名称"],
  ["type", "类型"],
  ["address", "地址"],
  ["note", "备注"],
  ["budget", "预算"],
  ["paid", "已付"],
  ["payer", "付款人"],
  ["lng", "经度"],
  ["lat", "纬度"],
  ["amapKeyword", "高德关键词"],
  ["image", "图片"],
  ["tags", "标签"],
  ["comments", "批注"],
  ["favorite", "收藏"],
  ["voters", "必去投票"],
  ["votes", "投票数"],
];

function diffItemKey(item = {}, prefix = "item", index = 0) {
  return String(item?.id || item?.date || item?.orderNo || item?.code || `${prefix}:${item?.title || item?.name || item?.text || index}`);
}

function shortDiffLabel(value = "", fallback = "") {
  const text = String(value || fallback || "").trim();
  if (!text) return fallback || "未命名";
  return text.length > 16 ? `${text.slice(0, 16)}...` : text;
}

function addDiffChange(changes, key, label) {
  if (!key || !label || changes.has(key)) return;
  changes.set(key, { label, value: undefined });
}

function addDiffFieldChange(changes, key, label, value) {
  if (!key || !label || changes.has(key)) return;
  changes.set(key, { label, value: clone(value) });
}

function collectListDiffChanges(changes, baseItems = [], nextItems = [], options = {}) {
  const {
    path = "list",
    label = "列表",
    prefix = "item",
    fields = [],
    itemLabel = (item, index) => shortDiffLabel(item?.title || item?.name || item?.text, `${label}${index + 1}`),
  } = options;
  const baseList = Array.isArray(baseItems) ? baseItems : [];
  const nextList = Array.isArray(nextItems) ? nextItems : [];
  const baseByKey = new Map(baseList.map((item, index) => [diffItemKey(item, prefix, index), { item, index }]));
  const nextByKey = new Map(nextList.map((item, index) => [diffItemKey(item, prefix, index), { item, index }]));
  nextByKey.forEach(({ item, index }, key) => {
    const title = itemLabel(item, index);
    if (!baseByKey.has(key)) {
      addDiffChange(changes, `${path}.${key}.added`, `${label} + ${title}`);
      return;
    }
    const baseItem = baseByKey.get(key).item;
    if (fields.length) {
      fields.forEach(([field, fieldLabel]) => {
        if (!sameSerialized(baseItem?.[field], item?.[field])) {
          addDiffFieldChange(changes, `${path}.${key}.${field}`, `${title} ${fieldLabel}`, item?.[field]);
        }
      });
    } else if (!sameSerialized(baseItem, item)) {
      addDiffChange(changes, `${path}.${key}.changed`, `${label} ${title}`);
    }
  });
  baseByKey.forEach(({ item, index }, key) => {
    if (!nextByKey.has(key)) addDiffChange(changes, `${path}.${key}.removed`, `${label} - ${itemLabel(item, index)}`);
  });
  if (!sameSerialized(baseList.map((item, index) => diffItemKey(item, prefix, index)), nextList.map((item, index) => diffItemKey(item, prefix, index)))) {
    addDiffChange(changes, `${path}.order`, `${label}顺序`);
  }
}

function collectPlanChangeMap(basePlan = {}, nextPlan = {}) {
  const changes = new Map();
  PLAN_DIFF_FIELDS.forEach(([field, label]) => {
    if (!sameSerialized(basePlan?.[field], nextPlan?.[field])) addDiffFieldChange(changes, `plan.${field}`, label, nextPlan?.[field]);
  });

  const baseDays = Array.isArray(basePlan?.days) ? basePlan.days : [];
  const nextDays = Array.isArray(nextPlan?.days) ? nextPlan.days : [];
  const baseDayByKey = new Map(baseDays.map((day, index) => [diffItemKey(day, "day", index), { day, index }]));
  const nextDayByKey = new Map(nextDays.map((day, index) => [diffItemKey(day, "day", index), { day, index }]));

  nextDayByKey.forEach(({ day, index }, dayKey) => {
    const dayLabel = shortDiffLabel(day?.title || day?.label || day?.date, `D${index + 1}`);
    if (!baseDayByKey.has(dayKey)) {
      addDiffChange(changes, `days.${dayKey}.added`, `日期 + ${dayLabel}`);
      return;
    }
    const baseDay = baseDayByKey.get(dayKey).day;
    DAY_DIFF_FIELDS.forEach(([field, label]) => {
      if (!sameSerialized(baseDay?.[field], day?.[field])) addDiffFieldChange(changes, `days.${dayKey}.${field}`, `${dayLabel} ${label}`, day?.[field]);
    });
    if (!sameSerialized(normalizeComments(baseDay?.comments || []), normalizeComments(day?.comments || []))) {
      addDiffFieldChange(changes, `days.${dayKey}.comments`, `${dayLabel} 当天批注`, normalizeComments(day?.comments || []));
    }
    collectListDiffChanges(changes, baseDay?.stops || [], day?.stops || [], {
      path: `days.${dayKey}.stops`,
      label: `${dayLabel} 地点`,
      prefix: "stop",
      fields: STOP_DIFF_FIELDS,
      itemLabel: (stop, stopIndex) => shortDiffLabel(stop?.title || stop?.address, `地点${stopIndex + 1}`),
    });
    collectListDiffChanges(changes, normalizeDayBlocks(baseDay?.blocks || []), normalizeDayBlocks(day?.blocks || []), {
      path: `days.${dayKey}.blocks`,
      label: `${dayLabel} 协作块`,
      prefix: "block",
      fields: [["type", "类型"], ["text", "文字"], ["done", "状态"], ["comments", "批注"]],
      itemLabel: (block, blockIndex) => shortDiffLabel(block?.text, `协作块${blockIndex + 1}`),
    });
  });
  baseDayByKey.forEach(({ day, index }, dayKey) => {
    if (!nextDayByKey.has(dayKey)) addDiffChange(changes, `days.${dayKey}.removed`, `日期 - ${shortDiffLabel(day?.title || day?.label || day?.date, `D${index + 1}`)}`);
  });
  if (!sameSerialized(baseDays.map((day, index) => diffItemKey(day, "day", index)), nextDays.map((day, index) => diffItemKey(day, "day", index)))) {
    addDiffChange(changes, "days.order", "日期顺序");
  }

  collectListDiffChanges(changes, normalizeTransportQuotes(basePlan?.transportQuotes || []), normalizeTransportQuotes(nextPlan?.transportQuotes || []), {
    path: "transportQuotes",
    label: "交通报价",
    prefix: "quote",
    itemLabel: (quote, index) => shortDiffLabel(`${quote?.from || ""}-${quote?.to || ""} ${quote?.price || ""}`.trim(), `报价${index + 1}`),
  });
  collectListDiffChanges(changes, normalizeCandidateStops(basePlan?.candidates || []), normalizeCandidateStops(nextPlan?.candidates || []), {
    path: "candidates",
    label: "备选地点",
    prefix: "candidate",
    itemLabel: (candidate, index) => shortDiffLabel(candidate?.title || candidate?.address, `备选${index + 1}`),
  });
  collectListDiffChanges(changes, normalizeActivities(basePlan?.activities || []), normalizeActivities(nextPlan?.activities || []), {
    path: "activities",
    label: "活动记录",
    prefix: "activity",
    itemLabel: (activity, index) => shortDiffLabel(activity?.text || activity?.label, `活动${index + 1}`),
  });
  return changes;
}

function diffValuePreview(value) {
  if (value === undefined) return "已变更";
  if (value === null) return "空";
  if (Array.isArray(value)) {
    const labels = value
      .slice(0, 3)
      .map((item, index) => shortDiffLabel(item?.title || item?.name || item?.text || item?.label || item?.code || item, `第 ${index + 1} 项`))
      .filter(Boolean);
    const extra = value.length > labels.length ? ` 等 ${value.length} 项` : "";
    return labels.length ? `${labels.join("、")}${extra}` : "空列表";
  }
  if (typeof value === "object") {
    const label = value.title || value.name || value.text || value.label || value.code || value.address;
    if (label) return shortDiffLabel(label, "对象");
    const keys = Object.keys(value || {}).slice(0, 4);
    return keys.length ? `包含 ${keys.join("、")}` : "空对象";
  }
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "空";
  return text.length > 48 ? `${text.slice(0, 48)}...` : text;
}

function conflictDiffSummary(conflict = {}) {
  const basePlan = conflict.base || lastSyncedState || {};
  const localChanges = collectPlanChangeMap(basePlan, conflict.local || state);
  const remoteChanges = collectPlanChangeMap(basePlan, conflict.remote || {});
  const overlapDetails = [...localChanges.keys()]
    .filter((key) => remoteChanges.has(key))
    .filter((key) => !sameSerialized(localChanges.get(key)?.value, remoteChanges.get(key)?.value))
    .map((key) => ({
      key,
      label: localChanges.get(key)?.label || remoteChanges.get(key)?.label || key,
      local: diffValuePreview(localChanges.get(key)?.value),
      remote: diffValuePreview(remoteChanges.get(key)?.value),
    }));
  return {
    local: [...localChanges.values()].map((entry) => entry.label).slice(0, 6),
    remote: [...remoteChanges.values()].map((entry) => entry.label).slice(0, 6),
    overlap: [...new Set(overlapDetails.map((entry) => entry.label))].slice(0, 6),
    overlapDetails: overlapDetails.slice(0, 4),
    localExtra: Math.max(0, localChanges.size - 6),
    remoteExtra: Math.max(0, remoteChanges.size - 6),
    overlapExtra: Math.max(0, overlapDetails.length - 4),
    overlapCount: overlapDetails.length,
  };
}

function versionPreviewSummary(versionPlan = {}, currentPlan = state) {
  const changes = collectPlanChangeMap(currentPlan, versionPlan);
  const currentChanges = collectPlanChangeMap(versionPlan, currentPlan);
  const details = [...changes.entries()]
    .filter(([, entry]) => entry.value !== undefined)
    .map(([key, entry]) => ({
      label: entry.label,
      current: diffValuePreview(currentChanges.get(key)?.value),
      restore: diffValuePreview(entry.value),
    }))
    .slice(0, 5);
  return {
    items: [...changes.values()].map((entry) => entry.label).slice(0, 8),
    details,
    extra: Math.max(0, changes.size - 8),
    detailExtra: Math.max(0, changes.size - details.length),
  };
}

function restoredVersionLabel(reason = "历史版本", at = "") {
  const restoredAt = at
    ? new Date(at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "";
  return [reason || "历史版本", restoredAt].filter(Boolean).join(" · ");
}

function inferActivityType(text = "") {
  const value = String(text || "");
  if (/恢复历史版本|历史版本|恢复前版本/.test(value)) return "restore";
  if (/冲突|合并|保留我的版本|云端版本/.test(value)) return "conflict";
  if (/批注|评论|回复|解决|重新打开/.test(value)) return "comment";
  if (/航班|动车|报价|交通|Google Flights|出发地/.test(value)) return "transport";
  if (/高德|路线|路径|地图|定位|AI 优化|优化当天/.test(value)) return "map";
  return "edit";
}

function activityTargetForType(type = "edit") {
  return {
    restore: ".version-panel",
    conflict: ".collab-panel",
    comment: ".comment-index-panel",
    transport: ".transport-panel",
    map: ".map-panel",
    edit: ".editor-panel",
  }[type] || ".activity-panel";
}

function memberActivityLabel(member = {}) {
  const textEditing = member.textEditing || (member.textSelection ? textSelectionLabel(member.textSelection) : "");
  if (textEditing) return textEditing;
  if (member.blockEditing) return `${member.blockEditing}：${member.activeBlockText || member.editing || "协作块"}`;
  if (member.activeCandidateId) return `正在编辑备选：${candidateLabel(member.activeCandidateId)}`;
  if (member.activeTransportQuoteId) return `正在编辑报价：${transportQuoteLabel(member.activeTransportQuoteId)}`;
  return `${member.lockMode === "editing" ? "正在编辑" : "浏览"}：${member.editing || member.activeDay || "计划"}`;
}

function versionRestoreImpactSummary() {
  const ownMemberId = memberProfile?.id || sessionId;
  const members = (onlineMembers.length ? onlineMembers : (memberProfile ? [presencePayload()] : []))
    .filter((member) => member && member.memberId !== sessionId && member.memberId !== ownMemberId && freshMember(member));
  return {
    members: members.slice(0, 4).map((member) => ({
      name: member.name || "匿名成员",
      activity: memberActivityLabel(member),
      day: member.activeDay || "在线",
    })),
    extra: Math.max(0, members.length - 4),
  };
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

async function sha256Text(value) {
  const text = String(value || "");
  if (window.crypto?.subtle && window.TextEncoder) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  text.split("").forEach((char) => {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return `fnv-${Math.abs(hash).toString(16)}`;
}

function stopVoters(stop = {}) {
  return normalizeList(stop.voters);
}

function normalizeStopVotes(stop = {}) {
  const voters = [...new Set(stopVoters(stop))];
  const legacyVotes = numberValue(stop.votes);
  return {
    voters,
    votes: Math.max(voters.length, legacyVotes),
    userVoted: voters.includes(collabActorId()) || Boolean(stop.userVoted && !voters.length),
  };
}

function toggleVoteValues(values = {}, actorId = collabActorId()) {
  const voters = new Set(stopVoters(values));
  const hasExplicitVote = voters.has(actorId);
  const hasLegacyVote = !voters.size && Boolean(values.userVoted);
  const hadVote = hasExplicitVote || hasLegacyVote;
  const currentVotes = Math.max(numberValue(values.votes), voters.size, hadVote ? 1 : 0);
  if (hadVote) {
    voters.delete(actorId);
    return {
      voters: [...voters],
      votes: Math.max(0, currentVotes - 1),
      userVoted: false,
    };
  }
  voters.add(actorId);
  return {
    voters: [...voters],
    votes: currentVotes + 1,
    userVoted: true,
  };
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
  return Object.fromEntries(
    PLAN_SETTING_FIELDS.map((meta) => [meta.field, planSettingValue(state, meta)]),
  );
}

function applyPlanMeta(meta = {}) {
  PLAN_SETTING_FIELDS.forEach((setting) => {
    if (Object.prototype.hasOwnProperty.call(meta, setting.field)) {
      state[setting.field] = normalizePlanSettingValue(setting.field, meta[setting.field]);
    }
  });
}

function planSettingValue(plan, { field, type }) {
  if (type === "integer") return Math.max(1, Number.parseInt(plan?.[field] || 1, 10) || 1);
  if (type === "number") return numberValue(plan?.[field]);
  return String(plan?.[field] || "").trim();
}

function planTextSettingValue(plan, field) {
  return String(plan?.[field] || "").trim();
}

function settingTextStateSnapshotFromPlan(plan = state, Y = null) {
  if (!Y) return {};
  return Object.fromEntries(
    PLAN_TEXT_SETTING_FIELDS.map((field) => {
      const existing = String(plan?.[`${field}Yjs`] || "");
      if (existing) return [field, existing];
      const doc = new Y.Doc();
      doc.clientID = stableTextClientId(`${tripId}:setting:${field}`);
      const text = doc.getText("text");
      const value = planTextSettingValue(plan, field);
      if (value) text.insert(0, value);
      const encoded = bytesToBase64(Y.encodeStateAsUpdate(doc));
      doc.destroy();
      return [field, encoded];
    }),
  );
}

function settingTextValueSnapshotFromPlan(plan = state) {
  return Object.fromEntries(PLAN_TEXT_SETTING_FIELDS.map((field) => [field, planTextSettingValue(plan, field)]));
}

function settingTextValueFromState(textState = "", fallback = "") {
  if (!textState || !yjsModule) return String(fallback || "");
  const doc = new yjsModule.Doc();
  try {
    yjsModule.applyUpdate(doc, base64ToBytes(textState), "read");
    return doc.getText("text").toString() || String(fallback || "");
  } catch (error) {
    console.warn("Plan setting text state could not be read", error);
    return String(fallback || "");
  } finally {
    doc.destroy();
  }
}

function settingTextStateFromYText(field, yText) {
  if (!yjsModule || !field || !yText) return "";
  const doc = new yjsModule.Doc();
  doc.clientID = stableTextClientId(`${tripId}:setting:${field}`);
  const text = doc.getText("text");
  const value = yText.toString();
  if (value) text.insert(0, value);
  const encoded = bytesToBase64(yjsModule.encodeStateAsUpdate(doc));
  doc.destroy();
  return encoded;
}

function normalizePlanSettingValue(field, value) {
  const meta = PLAN_SETTING_FIELDS.find((item) => item.field === field);
  if (!meta) return clone(value);
  if (meta.type === "integer") return Math.max(1, Number.parseInt(value || 1, 10) || 1);
  if (meta.type === "number") return numberValue(value);
  return String(value || "").trim();
}

function syncGuideStateFromPlan() {
  guideState.destination = state.destination || guideState.destination;
  guideState.origin = state.origin || guideState.origin;
  guideState.startDate = state.startDate || guideState.startDate;
  guideState.endDate = state.endDate || guideState.endDate;
  if (dom.destinationInput) dom.destinationInput.value = guideState.destination;
  if (dom.originInput) dom.originInput.value = guideState.origin;
  if (dom.startDateInput) dom.startDateInput.value = guideState.startDate;
  if (dom.endDateInput) dom.endDateInput.value = guideState.endDate;
  if (dom.dateScoutStart && !dom.dateScoutStart.value) {
    const defaults = defaultScoutDates();
    dom.dateScoutStart.value = guideState.startDate || defaults.startDate;
    dom.dateScoutEnd.value = guideState.endDate && parseIsoDate(guideState.endDate) > parseIsoDate(dom.dateScoutStart.value)
      ? guideState.endDate
      : defaults.endDate;
    dom.dateScoutDays.value = guideDayCount();
  }
  if (dom.transportFrom && !dom.transportFrom.value) dom.transportFrom.value = guideState.origin;
}

function defaultGuideDates() {
  const start = addDays(new Date(), 14);
  const end = addDays(start, 5);
  return {
    startDate: formatIsoDate(start),
    endDate: formatIsoDate(end),
  };
}

function defaultScoutDates() {
  const start = addDays(new Date(), 7);
  const end = addDays(start, 30);
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

function officialImageSearchUrl(stopOrKeyword = "") {
  const keyword = typeof stopOrKeyword === "string"
    ? stopOrKeyword
    : [stopOrKeyword?.address, stopOrKeyword?.title || stopOrKeyword?.amapKeyword, "官方 图片"].filter(Boolean).join(" ");
  return `https://www.baidu.com/s?wd=${encodeURIComponent(keyword || "景点 官方 图片")}`;
}

function candidateReferenceUrl(stop = {}) {
  const existing = String(stop.referenceUrl || stop.sourceUrl || stop.imagePageUrl || "").trim();
  if (existing) return existing;
  const keyword = [state.destination, stop.address, stop.title || stop.amapKeyword, "景点 介绍 攻略 门票"]
    .filter(Boolean)
    .join(" ");
  return `https://www.baidu.com/s?wd=${encodeURIComponent(keyword || "景点 介绍 攻略")}`;
}

function uniqueTexts(values = []) {
  const seen = new Set();
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

function amapCityHint(keyword = "") {
  const text = `${keyword || ""} ${state.destination || ""}`;
  const rules = [
    [/兰州|甘肃省博物馆|黄河铁桥|中山桥|张掖路/, "兰州"],
    [/敦煌|莫高窟|鸣沙山|月牙泉|阳关|玉门关|雅丹/, "敦煌"],
    [/张掖|七彩丹霞|马蹄寺|平山湖/, "张掖"],
    [/嘉峪关|关城|悬壁长城/, "嘉峪关"],
    [/酒泉/, "酒泉"],
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  if (matched) return matched[1];
  const cityMatch = text.match(/([\u4e00-\u9fa5]{2,12}(?:市|州|盟|县|区))/);
  if (cityMatch) return cityMatch[1].replace(/[县区]$/, "");
  if (state.destination && !/[省自治区]$/.test(state.destination)) return state.destination;
  return "";
}

function amapKeywordVariants(keyword = "") {
  const value = String(keyword || "").replace(/\s+/g, " ").trim();
  const destination = String(state.destination || "").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return uniqueTexts([
    value,
    destination && value.startsWith(destination) ? value.slice(destination.length).trim() : "",
    destination ? value.replace(destination, "").trim() : "",
    parts.length > 1 ? parts.at(-1) : "",
    value.replace(/^(甘肃|甘肃省|兰州|兰州市|敦煌|敦煌市|张掖|张掖市|嘉峪关|嘉峪关市)\s*/, "").trim(),
  ]);
}

function normalizeAmapPlace(place, keyword = "") {
  if (!place) return null;
  const photos = Array.isArray(place.photos) ? place.photos : [];
  const firstPhoto = photos.find((photo) => photo?.url || photo?.src || photo?.image);
  return {
    id: place.id || place.uid || "",
    title: place.title || place.name || keyword,
    address: place.address || place.formattedAddress || "",
    lng: String(place.lng || place.longitude || ""),
    lat: String(place.lat || place.latitude || ""),
    adcode: place.adcode || "",
    city: place.city || "",
    type: place.type || "",
    image: place.image || place.photo || firstPhoto?.url || firstPhoto?.src || firstPhoto?.image || "",
    photos,
    source: place.source || "高德 Web服务",
  };
}

async function lookupAmapPlaces(keyword, { limit = 6 } = {}) {
  if (!serviceConfig.amapEndpoint || !keyword) return null;
  const variants = amapKeywordVariants(keyword);
  const cityHints = uniqueTexts([amapCityHint(keyword), state.destination]).concat("");
  const seen = new Set();
  let lastError = "";
  for (const variant of variants) {
    for (const city of cityHints) {
      try {
        const data = await serviceApi.amap.lookupPlaces(serviceConfig.amapEndpoint, { keyword: variant, city, limit }, { timeoutMs: 6000 });
        const places = (Array.isArray(data.places) ? data.places : [data.place || data].filter(Boolean))
          .map((place) => normalizeAmapPlace(place, variant))
          .filter(Boolean)
          .filter((place) => {
            const key = place.id || `${place.title}:${place.lng}:${place.lat}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        if (places.length) return places.slice(0, limit);
      } catch (error) {
        lastError = error.message;
      }
    }
  }
  if (lastError) throw new Error(lastError);
  return [];
}

async function lookupAmapPlace(keyword) {
  const places = await lookupAmapPlaces(keyword, { limit: 1 });
  return Array.isArray(places) ? places[0] || null : null;
}

function hasAmapJsConfig() {
  return Boolean(String(serviceConfig.amapJsKey || "").trim());
}

function clearAmapOverlay() {
  amapMapMarkers.forEach((marker) => marker.setMap(null));
  amapMapPolylines.forEach((polyline) => polyline.setMap(null));
  amapMapMarkers = [];
  amapMapPolylines = [];
}

function destroyAmapMap() {
  if (!amapMap) return;
  clearAmapOverlay();
  amapMap.destroy();
  amapMap = null;
}

function coordinateForAmap(stop) {
  const lng = Number(stop?.lng);
  const lat = Number(stop?.lat);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return [lng, lat];
}

function legPathCoordinates(day, leg) {
  if (Array.isArray(leg?.path) && leg.path.length >= 2) {
    const path = leg.path
      .map((point) => (Array.isArray(point) ? point : [point?.lng, point?.lat]).map(Number))
      .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat));
    if (path.length >= 2) return path;
  }
  const fromIndex = day.stops.findIndex((stop) => stop.title === leg?.from);
  const toIndex = day.stops.findIndex((stop) => stop.title === leg?.to);
  const from = coordinateForAmap(day.stops[fromIndex]);
  const to = coordinateForAmap(day.stops[toIndex]);
  return from && to ? [from, to] : [];
}

function loadAmapSdk() {
  if (!hasAmapJsConfig()) return Promise.reject(new Error("未配置高德 JS Key"));
  const key = serviceConfig.amapJsKey.trim();
  if (window.AMap && amapLoadedKey === key) return Promise.resolve(window.AMap);
  if (amapLoaderPromise && amapLoadedKey === key) return amapLoaderPromise;
  if (serviceConfig.amapSecurityCode) {
    window._AMapSecurityConfig = {
      securityJsCode: serviceConfig.amapSecurityCode.trim(),
    };
  }
  amapLoadedKey = key;
  amapLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-amap-loader]");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.dataset.amapLoader = "true";
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&plugin=AMap.Scale,AMap.ToolBar`;
    script.async = true;
    script.onload = () => {
      if (window.AMap) resolve(window.AMap);
      else reject(new Error("高德 JS SDK 加载后未找到 AMap。"));
    };
    script.onerror = () => reject(new Error("高德 JS SDK 加载失败，请检查 Web 端 JS Key 和安全密钥。"));
    document.head.appendChild(script);
  });
  return amapLoaderPromise;
}

function renderFallbackMap(day) {
  if (!dom.mapCanvas) return;
  dom.mapCanvas.classList.remove("is-amap");
  dom.mapCanvas.innerHTML = `<div class="route-line"></div>`;
  if (dom.mapProviderStatus) dom.mapProviderStatus.textContent = hasAmapJsConfig() ? "SDK 待加载" : "坐标预览";
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

async function renderAmapSdkMap(day) {
  const AMap = await loadAmapSdk();
  const points = day.stops.map(coordinateForAmap);
  const validPoints = points.filter(Boolean);
  if (!validPoints.length) {
    destroyAmapMap();
    renderFallbackMap(day);
    if (dom.mapProviderStatus) dom.mapProviderStatus.textContent = "高德地图 · 待定位";
    return;
  }
  dom.mapCanvas.classList.add("is-amap");
  if (!amapMap) {
    dom.mapCanvas.innerHTML = "";
    amapMap = new AMap.Map(dom.mapCanvas, {
      zoom: validPoints.length === 1 ? 13 : 10,
      viewMode: "2D",
      resizeEnable: true,
      center: validPoints[0],
    });
    amapMap.addControl(new AMap.Scale());
    amapMap.addControl(new AMap.ToolBar({ position: "RB" }));
  }
  clearAmapOverlay();
  day.stops.forEach((stop, index) => {
    const position = points[index];
    if (!position) return;
    const marker = new AMap.Marker({
      position,
      title: stop.title,
      label: {
        content: `${index + 1}. ${stop.title}`,
        direction: "top",
      },
    });
    marker.on("click", () => {
      userSelectedStop = true;
      switchActiveStop(index);
    });
    amapMap.add(marker);
    amapMapMarkers.push(marker);
  });
  const routeLegs = Array.isArray(day.amapRoute?.legs) ? day.amapRoute.legs : [];
  routeLegs.forEach((leg) => {
    const path = legPathCoordinates(day, leg);
    if (path.length < 2) return;
    const polyline = new AMap.Polyline({
      path,
      strokeColor: "#24735c",
      strokeWeight: 6,
      strokeOpacity: 0.82,
      lineJoin: "round",
    });
    amapMap.add(polyline);
    amapMapPolylines.push(polyline);
  });
  if (!amapMapPolylines.length && validPoints.length >= 2) {
    const polyline = new AMap.Polyline({
      path: validPoints,
      strokeColor: "#dd6b4f",
      strokeWeight: 5,
      strokeStyle: "dashed",
      strokeOpacity: 0.72,
    });
    amapMap.add(polyline);
    amapMapPolylines.push(polyline);
  }
  amapMap.setFitView([...amapMapMarkers, ...amapMapPolylines], false, [32, 32, 32, 32]);
  if (dom.mapProviderStatus) {
    dom.mapProviderStatus.textContent = day.amapRoute?.legs?.length ? "高德地图 · 路线" : "高德地图 · 标记";
  }
}

function scheduleAmapRender(day) {
  if (amapRenderQueued) return;
  amapRenderQueued = true;
  window.requestAnimationFrame(() => {
    amapRenderQueued = false;
    renderAmapSdkMap(day).catch((error) => {
      if (dom.mapProviderStatus) dom.mapProviderStatus.textContent = `地图未启用`;
      console.warn("Amap SDK render failed", error);
    });
  });
}

async function requestAmapRoute(day, mode = "walking", strategy = "default") {
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
  return serviceApi.amap.route(serviceConfig.amapRouteEndpoint, {
      mode,
      strategy,
      destination: state.destination || "",
      city: state.destination || "",
      stops,
    });
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
  id = "",
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
  budgetSelected = true,
  votes = 1,
  userVoted = true,
  voters = [],
  comments = [],
  x = 50,
  y = 50,
  lng = "",
  lat = "",
  amapKeyword = "",
  image = images.city,
  imageSource = "",
  imageLicense = "",
  imageCreator = "",
  imagePageUrl = "",
  imageVerifiedAt = "",
  imageStatus = "",
  imageLookupVersion = "",
  imageCandidates = [],
  referenceUrl = "",
  selected = false,
} = {}) {
  return {
    id: id || uid(),
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
    budgetSelected: budgetSelected !== false,
    voters: normalizeList(voters),
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
    imageSource,
    imageLicense,
    imageCreator,
    imagePageUrl,
    imageVerifiedAt,
    imageStatus,
    imageLookupVersion,
    imageCandidates: Array.isArray(imageCandidates) ? imageCandidates.slice(0, 6) : [],
    referenceUrl,
    selected: Boolean(selected),
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
          makeStop({ time: "08:30", title: "清水寺", type: "Temple", address: "京都市东山区清水1丁目294", note: "早到避开人流，从二年坂上行。雨天缩短到 70 分钟。", tags: ["必去", "门票"], budget: 96, image: images.kyoto, comments: [{ author: "林", text: "门票预算已加上。" }], x: 64, y: 42 }),
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
          makeStop({ time: "15:00", title: "悬壁长城", type: "Great Wall", address: "嘉峪关市石关峡口北侧", note: "体力允许再去，风大时注意保暖和防晒。", tags: ["可选", "风大"], budget: 200, votes: 2, userVoted: false, image: localTripImage("jiayuguan-fort"), x: 62, y: 38 }),
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

function recommendedBudgetLimit(options = {}) {
  return options.budget === "品质" ? 14000 : options.budget === "节省" ? 8000 : 10000;
}

function destinationImageForText(...values) {
  const text = values.map((value) => String(value || "")).filter(Boolean).join(" ");
  const matched = DESTINATION_IMAGE_RULES.find(([pattern]) => pattern.test(text));
  return matched ? matched[1] : "";
}

function destinationDefaultImage(destination = "") {
  const image = destinationImageForText(destination);
  if (image) return image;
  return images.city;
}

function destinationProfile(destination = "") {
  const text = String(destination || "").trim();
  const cover = destinationDefaultImage(text);
  if (/吉林|长春|长白山|天池|净月潭|雾凇|延吉|Jilin|Changbai/i.test(text)) {
    return {
      cover,
      scenic: [
        { title: "长白山天池", type: "MountainLake", note: "吉林自然景观核心，强依赖天气，建议优先放在晴天窗口。", tags: ["自然", "必去"], budget: 260, keyword: "长白山天池" },
        { title: "净月潭国家森林公园", type: "Forest", note: "适合作为城市周边轻量自然线，冬季也可替换为冰雪项目。", tags: ["森林", "轻量"], budget: 120, keyword: "长春 净月潭国家森林公园" },
        { title: "吉林雾凇岛", type: "Scenic", note: "冬季特色明显，非冬季可替换为松花江沿线或市区文化点。", tags: ["季节性", "备选"], budget: 160, keyword: "吉林 雾凇岛" },
        { title: "延吉朝鲜族民俗园", type: "Culture", note: "适合加入餐饮、写真和城市文化体验。", tags: ["文化", "美食"], budget: 180, keyword: "延吉 朝鲜族民俗园" },
      ],
      food: "吉林铁锅炖/延吉冷面晚餐",
      cityWalk: "吉林市或长春核心区轻量探索",
      culture: "吉林地方文化街区",
      night: "松花江沿线夜间散步",
      transit: "吉林抵达与入住",
      routeFocus: "长白山 · 森林湖泊 · 东北城市体验",
    };
  }
  if (/内蒙古|呼和浩特|呼伦贝尔|满洲里|额尔古纳|阿尔山|草原|Inner.?Mongolia/i.test(text)) {
    return {
      cover,
      scenic: [
        { title: "呼伦贝尔大草原", type: "Grassland", note: "草原核心体验，适合安排骑马、牧场和日落。", tags: ["草原", "必去"], budget: 260, keyword: "呼伦贝尔大草原" },
        { title: "额尔古纳湿地", type: "Wetland", note: "俯瞰湿地和河谷曲线，晴天观景效果更好。", tags: ["自然", "观景"], budget: 160, keyword: "额尔古纳湿地景区" },
        { title: "满洲里套娃广场", type: "Scenic", note: "边境城市特色地标，适合夜景和轻量打卡。", tags: ["地标", "夜景"], budget: 120, keyword: "满洲里套娃广场" },
        { title: "阿尔山国家森林公园", type: "Forest", note: "适合 5 天以上版本加入，需要预留长车程和住宿。", tags: ["森林", "长车程"], budget: 380, keyword: "阿尔山国家森林公园" },
      ],
      food: "内蒙古手把肉/奶茶晚餐",
      cityWalk: "海拉尔或满洲里市区轻量探索",
      culture: "草原民俗体验",
      night: "满洲里夜景或草原星空",
      transit: "海拉尔/呼和浩特抵达与入住",
      routeFocus: "草原 · 湿地 · 边境城市",
    };
  }
  return {
    cover,
    scenic: [
      { title: `${text}核心景区`, type: "Scenic", note: "作为首个核心景点候选，建议用高德搜索替换为具体景区后再排入当天。", tags: ["核心", "待确认"], budget: 160, keyword: `${text} 必去景点` },
      { title: `${text}博物馆/文化馆`, type: "Museum", note: "雨天或低强度备选，适合了解当地历史文化。", tags: ["文化", "雨天"], budget: 80, keyword: `${text} 博物馆` },
      { title: `${text}老街/夜景`, type: "Walk", note: "适合作为晚间轻量行程，和餐饮或散步组合。", tags: ["散步", "夜景"], budget: 80, keyword: `${text} 老街 夜景` },
    ],
    food: `${text}当地特色餐厅`,
    cityWalk: `${text}城市核心区`,
    culture: `${text}文化街区`,
    night: `${text}夜间散步`,
    transit: `${text}抵达与入住`,
    routeFocus: "核心景点 · 文化街区 · 夜间散步",
  };
}

function profileStop(profile, item, overrides = {}) {
  return makeStop({
    title: item.title,
    type: item.type || "Scenic",
    address: item.address || item.keyword || item.title,
    note: item.note,
    tags: item.tags || ["备选"],
    budget: item.budget || 0,
    amapKeyword: item.keyword || item.title,
    image: item.image || profile.cover,
    ...overrides,
  });
}

function fillRecommendedDays(plan, dayCount, options = {}) {
  const destination = plan.destination || "自定义目的地";
  while (plan.days.length < dayCount) {
    const dayNumber = plan.days.length + 1;
    plan.days.push({
      id: uid(),
      label: `D${dayNumber}`,
      title: `第${dayNumber}天 ${destination}弹性探索`,
      route: `${destination}深度体验 · 备选景点组合`,
      weather: "天气待确认",
      transport: "市内交通 + 打车",
      stops: [
        makeStop({
          time: "10:00",
          title: `${destination}当地体验`,
          type: "Scenic",
          address: destination,
          note: "根据天气、营业时间和大家体力，把这段替换成更想去的景点或体验。",
          tags: ["弹性", "可替换"],
          budget: options.budget === "品质" ? 520 : options.budget === "节省" ? 160 : 280,
          amapKeyword: `${destination} 必去景点`,
          image: destinationDefaultImage(destination),
          x: 34 + ((dayNumber * 9) % 42),
          y: 34 + ((dayNumber * 7) % 36),
        }),
        makeStop({
          time: "18:30",
          title: `${destination}特色晚餐`,
          type: "Dinner",
          address: `${destination}市区`,
          note: "作为当天收尾，适合用投票确认餐厅和预算。",
          tags: ["美食", "可投票"],
          budget: options.budget === "品质" ? 480 : options.budget === "节省" ? 160 : 280,
          amapKeyword: `${destination} 特色餐厅`,
          image: images.food,
          x: 58 + ((dayNumber * 5) % 24),
          y: 44 + ((dayNumber * 6) % 26),
        }),
      ],
    });
  }
  plan.days = plan.days.slice(0, dayCount);
  return plan;
}

function buildQinghaiPlan(dayCount = 4, options = {}) {
  const plan = {
    name: `青海 ${dayCount} 日同行计划`,
    destination: "青海",
    dateRange: "自定义日期",
    budgetLimit: recommendedBudgetLimit(options),
    cover: images.qinghai,
    activities: [`生成青海 ${dayCount} 日推荐计划`, "西宁集散", "青海湖/茶卡方向"],
    candidates: [
      makeStop({ title: "青海省博物馆", type: "Museum", address: "西宁市城西区西关大街", note: "雨天或高原适应日可加入，适合先了解青海历史和民族文化。", tags: ["室内", "文化"], budget: 0, image: images.museum, lng: "101.744925", lat: "36.631599", amapKeyword: "青海省博物馆" }),
      makeStop({ title: "日月山", type: "Scenic", address: "青海省西宁市湟源县", note: "西宁去青海湖路上可顺路停留，适合轻量拍照。", tags: ["顺路", "高原"], budget: 80, image: images.qinghai, lng: "100.989879", lat: "36.465324", amapKeyword: "青海 日月山" }),
      makeStop({ title: "祁连卓尔山", type: "Scenic", address: "海北藏族自治州祁连县", note: "适合 5 天以上版本加入，需要单独预留长车程。", tags: ["自然", "长车程"], budget: 180, image: images.qinghai, lng: "100.253158", lat: "38.184351", amapKeyword: "祁连 卓尔山" }),
      makeStop({ title: "门源油菜花海", type: "Scenic", address: "海北藏族自治州门源回族自治县", note: "花期通常在夏季，出行前确认实时花况。", tags: ["季节限定", "备选"], budget: 80, image: images.qinghai, lng: "101.615738", lat: "37.376507", amapKeyword: "门源 油菜花海" }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: "第1天 西宁",
        route: "抵达西宁 · 塔尔寺 · 市区适应",
        weather: "天气待确认",
        transport: "飞机/动车 + 打车",
        stops: [
          makeStop({ time: "11:30", title: "西宁抵达与入住", type: "Transit", address: "西宁曹家堡国际机场 / 西宁站", note: "第一天降低强度，先完成集合、入住和高原适应。", tags: ["集合", "高原适应"], budget: 280, image: images.train, x: 24, y: 48, lng: "101.796029", lat: "36.623385", amapKeyword: "西宁站" }),
          makeStop({ time: "14:30", title: "塔尔寺", type: "Temple", address: "西宁市湟中区金塔路56号", note: "青海经典文化点，建议预留讲解时间；注意尊重寺院拍摄规则。", tags: ["文化", "门票"], budget: 280, image: images.museum, x: 44, y: 42, lng: "101.569402", lat: "36.489179", amapKeyword: "西宁 塔尔寺" }),
          makeStop({ time: "19:00", title: "水井巷/莫家街晚餐", type: "Dinner", address: "西宁市城中区水井巷周边", note: "第一晚用餐以清淡和补水为主，把第二天环湖交通确认好。", tags: ["美食", "集合复盘"], budget: 320, image: images.food, x: 58, y: 54, lng: "101.784047", lat: "36.618428", amapKeyword: "西宁 水井巷 美食" }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: "第2天 青海湖",
        route: "西宁 · 青海湖二郎剑 · 环湖观景",
        weather: "天气待确认",
        transport: "包车/拼车",
        stops: [
          makeStop({ time: "08:30", title: "前往青海湖", type: "Transit", address: "西宁 → 青海湖二郎剑景区", note: "车程较长，建议准备防晒、外套和补水；中途可根据体力加入日月山。", tags: ["长车程", "防晒"], budget: 520, image: images.train, x: 26, y: 46, lng: "101.778916", lat: "36.623178", amapKeyword: "西宁 到 青海湖" }),
          makeStop({ time: "12:30", title: "青海湖二郎剑景区", type: "Lake", address: "海南藏族自治州共和县109国道旁", note: "把主要拍照和湖边停留放在中午到下午，注意风大和紫外线。", tags: ["必去", "自然"], budget: 360, image: images.qinghai, x: 52, y: 42, lng: "100.479625", lat: "36.751796", amapKeyword: "青海湖二郎剑景区" }),
          makeStop({ time: "17:30", title: "黑马河日落备选", type: "Scenic", address: "海南藏族自治州共和县黑马河镇", note: "如果当天车程和天气允许，作为日落备选；否则直接回住宿点。", tags: ["日落", "可选"], budget: 120, image: images.qinghai, x: 62, y: 52, lng: "99.825418", lat: "36.738185", amapKeyword: "青海 黑马河 日落" }),
        ],
      },
      {
        id: uid(),
        label: "D3",
        title: "第3天 茶卡",
        route: "茶卡盐湖 · 环湖返程",
        weather: "天气待确认",
        transport: "包车",
        stops: [
          makeStop({ time: "09:30", title: "茶卡盐湖", type: "Scenic", address: "海西蒙古族藏族自治州乌兰县茶卡镇盐湖路9号", note: "晴天和低风更适合拍倒影，鞋套、小火车等项目现场决定。", tags: ["自然", "门票"], budget: 260, image: images.qinghai, x: 46, y: 44, lng: "99.078857", lat: "36.793847", amapKeyword: "茶卡盐湖景区" }),
          makeStop({ time: "16:30", title: "返程补给与休整", type: "Rest", address: "茶卡镇 / 西宁方向", note: "长车程后预留休整，不把晚上排满，避免高原疲劳。", tags: ["休整", "补给"], budget: 180, image: images.food, x: 60, y: 56, amapKeyword: "茶卡镇 餐厅" }),
        ],
      },
      {
        id: uid(),
        label: "D4",
        title: "第4天 西宁返程",
        route: "西宁市区 · 伴手礼 · 返程",
        weather: "天气待确认",
        transport: "市内交通 + 飞机/动车",
        stops: [
          makeStop({ time: "10:00", title: "东关清真大寺周边", type: "Culture", address: "西宁市城东区东关大街", note: "根据开放情况安排外观或周边街区散步，作为返程前轻量行程。", tags: ["文化", "轻量"], budget: 0, image: images.museum, x: 40, y: 42, lng: "101.798091", lat: "36.622376", amapKeyword: "西宁 东关清真大寺" }),
          makeStop({ time: "14:30", title: "返程缓冲", type: "Transit", address: "西宁曹家堡国际机场 / 西宁站", note: "最后一天至少预留 2 小时交通缓冲，避免市区到机场延误。", tags: ["返程", "缓冲"], budget: 420, image: images.train, x: 62, y: 50, lng: "101.796029", lat: "36.623385", amapKeyword: "西宁机场 西宁站" }),
        ],
      },
    ],
  };

  if (options.pace === "高强度" && plan.days[1]) {
    plan.days[1].stops.push(makeStop({ time: "19:20", title: "环湖住宿观星", type: "Hotel", address: "青海湖周边住宿", note: "高强度版本可住湖边，第二天去茶卡更顺；需提前确认供暖和海拔适应。", tags: ["住宿", "观星"], budget: 760, image: images.qinghai, x: 70, y: 58, amapKeyword: "青海湖 住宿" }));
  }

  return fillRecommendedDays(plan, dayCount, options);
}

function buildQingdaoPlan(dayCount = 3, options = {}) {
  const plan = {
    name: `青岛 ${dayCount} 日同行计划`,
    destination: "青岛",
    dateRange: "自定义日期",
    budgetLimit: recommendedBudgetLimit(options),
    cover: images.qingdao,
    activities: [`生成青岛 ${dayCount} 日推荐计划`, "海滨城区", "崂山备选"],
    candidates: [
      makeStop({ title: "小鱼山公园", type: "Scenic", address: "青岛市市南区福山支路24号", note: "适合俯瞰老城红瓦绿树，和八大关可组合。", tags: ["观景", "备选"], budget: 20, image: images.qingdao, lng: "120.331719", lat: "36.061722", amapKeyword: "青岛 小鱼山公园" }),
      makeStop({ title: "台东夜市", type: "Market", address: "青岛市市北区台东步行街", note: "适合作为晚间美食备选，注意人流和排队。", tags: ["夜市", "美食"], budget: 180, image: images.food, lng: "120.355336", lat: "36.085362", amapKeyword: "青岛 台东夜市" }),
      makeStop({ title: "青岛啤酒博物馆", type: "Museum", address: "青岛市市北区登州路56号", note: "雨天或市区半日可加入，适合预约讲解。", tags: ["室内", "门票"], budget: 120, image: images.museum, lng: "120.342941", lat: "36.080220", amapKeyword: "青岛啤酒博物馆" }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: "第1天 青岛老城",
        route: "抵达青岛 · 栈桥 · 八大关",
        weather: "天气待确认",
        transport: "动车/飞机 + 地铁",
        stops: [
          makeStop({ time: "11:30", title: "青岛抵达与入住", type: "Transit", address: "青岛站 / 青岛北站", note: "先寄存行李或入住，再进入老城海滨线。", tags: ["集合", "交通"], budget: 180, image: images.train, x: 24, y: 46, lng: "120.312900", lat: "36.063438", amapKeyword: "青岛站" }),
          makeStop({ time: "14:00", title: "栈桥", type: "Scenic", address: "青岛市市南区太平路12号", note: "适合第一站建立海滨城市印象，风大时缩短停留。", tags: ["海边", "经典"], budget: 0, image: images.qingdao, x: 42, y: 42, lng: "120.319224", lat: "36.061015", amapKeyword: "青岛 栈桥" }),
          makeStop({ time: "16:30", title: "八大关", type: "Walk", address: "青岛市市南区汇泉角东北部", note: "傍晚散步节奏更舒服，可和第二海水浴场组合。", tags: ["散步", "拍照"], budget: 0, image: images.qingdao, x: 58, y: 46, lng: "120.353098", lat: "36.053808", amapKeyword: "青岛 八大关" }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: "第2天 崂山",
        route: "崂山 · 海岸线",
        weather: "天气待确认",
        transport: "地铁 + 景区车/包车",
        stops: [
          makeStop({ time: "09:00", title: "崂山风景区", type: "Mountain", address: "青岛市崂山区崂山景区", note: "提前确认线路和门票，体力一般优先太清/仰口较轻路线。", tags: ["自然", "门票"], budget: 260, image: images.qingdao, x: 50, y: 40, lng: "120.608375", lat: "36.196595", amapKeyword: "青岛 崂山风景区" }),
          makeStop({ time: "18:30", title: "五四广场夜景", type: "Walk", address: "青岛市市南区东海西路", note: "从崂山回市区后轻量收尾，适合看灯光和海风散步。", tags: ["夜景", "轻量"], budget: 0, image: images.qingdao, x: 62, y: 50, lng: "120.384598", lat: "36.062183", amapKeyword: "青岛 五四广场" }),
        ],
      },
      {
        id: uid(),
        label: "D3",
        title: "第3天 市区返程",
        route: "啤酒博物馆 · 伴手礼 · 返程",
        weather: "天气待确认",
        transport: "地铁 + 动车/飞机",
        stops: [
          makeStop({ time: "10:00", title: "青岛啤酒博物馆", type: "Museum", address: "青岛市市北区登州路56号", note: "室内行程适合作为返程日前半天，注意预约和饮酒后交通。", tags: ["室内", "门票"], budget: 120, image: images.museum, x: 42, y: 42, lng: "120.342941", lat: "36.080220", amapKeyword: "青岛啤酒博物馆" }),
          makeStop({ time: "14:30", title: "返程缓冲", type: "Transit", address: "青岛站 / 青岛胶东国际机场", note: "预留取行李和跨城交通时间。", tags: ["返程", "缓冲"], budget: 260, image: images.train, x: 62, y: 48, amapKeyword: "青岛 返程 交通" }),
        ],
      },
    ],
  };

  return fillRecommendedDays(plan, dayCount, options);
}

function buildInnerMongoliaPlan(dayCount = 6, options = {}) {
  const profile = destinationProfile("内蒙古");
  const plan = {
    name: `内蒙古 ${dayCount} 日同行计划`,
    destination: "内蒙古",
    dateRange: "自定义日期",
    budgetLimit: recommendedBudgetLimit(options),
    cover: profile.cover,
    activities: [`生成内蒙古 ${dayCount} 日推荐计划`, "草原/湿地/边境城市", "长车程需确认包车"],
    candidates: [
      profileStop(profile, profile.scenic[2], { x: 68, y: 42 }),
      profileStop(profile, profile.scenic[3], { x: 54, y: 56 }),
      makeStop({ title: "草原骑马/牧场体验", type: "Experience", address: "呼伦贝尔草原", note: "适合作为半日活动，出行前确认安全、保险和天气。", tags: ["体验", "备选"], budget: 280, amapKeyword: "呼伦贝尔 草原 骑马 牧场", image: profile.cover, x: 42, y: 48 }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: "第1天 海拉尔抵达",
        route: "抵达海拉尔 · 市区适应 · 草原准备",
        weather: "天气待确认",
        transport: "飞机/动车 + 市内交通",
        stops: [
          makeStop({ time: "11:30", title: "海拉尔抵达与入住", type: "Transit", address: "呼伦贝尔海拉尔机场 / 海拉尔站", note: "先完成集合、入住和包车确认，准备防晒、防风衣物。", tags: ["集合", "入住"], budget: 260, image: images.train, x: 24, y: 44, amapKeyword: "海拉尔机场 海拉尔站" }),
          makeStop({ time: "15:30", title: "海拉尔市区轻量探索", type: "Walk", address: "呼伦贝尔市海拉尔区", note: "第一天不排长线，适合补给、确认路线和适应天气。", tags: ["轻量", "补给"], budget: 80, image: profile.cover, x: 46, y: 42, amapKeyword: "海拉尔 市区 景点" }),
          makeStop({ time: "19:00", title: "内蒙古手把肉/奶茶晚餐", type: "Dinner", address: "海拉尔区", note: "第一晚用餐确认口味和次日出发时间。", tags: ["美食", "投票"], budget: 320, image: images.food, x: 62, y: 54, amapKeyword: "海拉尔 手把肉 奶茶" }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: "第2天 呼伦贝尔草原",
        route: "呼伦贝尔大草原 · 莫日格勒河 · 草原日落",
        weather: "天气待确认",
        transport: "包车",
        stops: [
          makeStop({ time: "09:00", title: "呼伦贝尔大草原", type: "Grassland", address: "呼伦贝尔草原", note: "草原线核心日，预留拍照、牧场和午餐时间。", tags: ["草原", "必去"], budget: 260, image: profile.cover, x: 38, y: 42, amapKeyword: "呼伦贝尔大草原" }),
          makeStop({ time: "14:30", title: "莫日格勒河观景", type: "River", address: "陈巴尔虎旗", note: "看草原河曲线，天气好时适合长焦和无人机视角。", tags: ["观景", "自然"], budget: 120, image: profile.cover, x: 58, y: 48, amapKeyword: "莫日格勒河" }),
          makeStop({ time: "18:30", title: "草原日落/星空备选", type: "Scenic", address: "呼伦贝尔草原住宿区", note: "根据天气决定是否等日落或星空，不强行排满。", tags: ["日落", "可选"], budget: 120, image: profile.cover, x: 68, y: 56, amapKeyword: "呼伦贝尔 草原 日落 星空" }),
        ],
      },
      {
        id: uid(),
        label: "D3",
        title: "第3天 额尔古纳湿地",
        route: "额尔古纳湿地 · 白桦林 · 边境小城",
        weather: "天气待确认",
        transport: "包车",
        stops: [
          makeStop({ time: "10:00", title: "额尔古纳湿地", type: "Wetland", address: "额尔古纳市拉布大林街道", note: "湿地观景台适合上午或下午光线，注意防风。", tags: ["湿地", "观景"], budget: 160, image: profile.cover, x: 42, y: 42, amapKeyword: "额尔古纳湿地景区" }),
          makeStop({ time: "14:30", title: "白桦林景区", type: "Forest", address: "额尔古纳市", note: "作为湿地之后的轻量自然点，雨天视情况替换。", tags: ["森林", "轻量"], budget: 120, image: profile.cover, x: 58, y: 48, amapKeyword: "额尔古纳 白桦林景区" }),
        ],
      },
      {
        id: uid(),
        label: "D4",
        title: "第4天 满洲里",
        route: "满洲里 · 套娃广场 · 国门外观",
        weather: "天气待确认",
        transport: "包车/动车",
        stops: [
          makeStop({ time: "10:30", title: "满洲里套娃广场", type: "Scenic", address: "满洲里市华埠大街", note: "边境城市地标，傍晚或夜景更有辨识度。", tags: ["地标", "夜景"], budget: 120, image: profile.cover, x: 44, y: 42, amapKeyword: "满洲里套娃广场" }),
          makeStop({ time: "15:30", title: "满洲里国门景区外观", type: "Scenic", address: "满洲里市五道街", note: "根据开放、票价和时间决定是否入内。", tags: ["边境", "可选"], budget: 160, image: profile.cover, x: 62, y: 48, amapKeyword: "满洲里国门景区" }),
        ],
      },
      {
        id: uid(),
        label: "D5",
        title: "第5天 阿尔山备选",
        route: "阿尔山森林线或返程缓冲",
        weather: "天气待确认",
        transport: "包车/长途交通",
        stops: [
          makeStop({ time: "09:00", title: "阿尔山国家森林公园", type: "Forest", address: "兴安盟阿尔山市", note: "车程较长，适合 6 天以上且体力充足的版本；否则作为备选。", tags: ["森林", "长车程"], budget: 380, image: profile.cover, x: 42, y: 42, amapKeyword: "阿尔山国家森林公园" }),
          makeStop({ time: "17:00", title: "返程前休整", type: "Rest", address: "阿尔山/海拉尔方向", note: "长线后留足休息和交通缓冲。", tags: ["休整", "缓冲"], budget: 180, image: images.food, x: 62, y: 50, amapKeyword: "阿尔山 海拉尔 餐厅" }),
        ],
      },
      {
        id: uid(),
        label: "D6",
        title: "第6天 返程",
        route: "海拉尔/呼和浩特返程",
        weather: "天气待确认",
        transport: "飞机/动车",
        stops: [
          makeStop({ time: "10:00", title: "返程缓冲", type: "Transit", address: "海拉尔机场 / 呼和浩特白塔机场", note: "最后一天至少预留 2 小时交通缓冲，避免长距离转场延误。", tags: ["返程", "缓冲"], budget: 520, image: images.train, x: 48, y: 50, amapKeyword: "海拉尔机场 呼和浩特机场" }),
        ],
      },
    ],
  };

  return fillRecommendedDays(plan, dayCount, options);
}

function buildGenericRecommendedPlan(destination, dayCount = 3, options = {}) {
  const safeDestination = destination || "自定义目的地";
  const profile = destinationProfile(safeDestination);
  const cover = profile.cover;
  const primary = profile.scenic[0];
  const secondary = profile.scenic[1] || profile.scenic[0];
  const tertiary = profile.scenic[2] || profile.scenic[0];
  const plan = {
    name: `${safeDestination} ${dayCount} 日同行计划`,
    destination: safeDestination,
    dateRange: "自定义日期",
    budgetLimit: recommendedBudgetLimit(options),
    cover,
    activities: [`生成${safeDestination}${dayCount}日推荐计划`, "可继续替换景点", "支持高德定位补全"],
    candidates: [
      profileStop(profile, tertiary, { budget: options.budget === "品质" ? Math.max(tertiary.budget || 0, 260) : tertiary.budget || 120 }),
      makeStop({ title: profile.food, type: "Food", address: safeDestination, note: "用于投票确认餐厅、团购或预约信息。", tags: ["美食", "可投票"], budget: options.budget === "品质" ? 360 : 180, amapKeyword: `${safeDestination} 特色餐厅 美食`, image: images.food }),
      profileStop(profile, secondary, { tags: Array.from(new Set([...(secondary.tags || []), "备选"])), image: secondary.image || (secondary.type === "Museum" ? images.museum : cover) }),
    ],
    days: [
      {
        id: uid(),
        label: "D1",
        title: `第1天 ${safeDestination}抵达`,
        route: `抵达${safeDestination} · 入住 · 周边轻量探索`,
        weather: "天气待确认",
        transport: "机票/动车 + 市内交通",
        stops: [
          makeStop({ time: "11:30", title: profile.transit, type: "Transit", address: safeDestination, note: "第一天优先完成集合、入住、行李寄存和交通确认。", tags: ["集合", "入住"], budget: 260, amapKeyword: `${safeDestination} 机场 火车站 酒店`, image: cover, x: 24, y: 44 }),
          makeStop({ time: "15:30", title: profile.cityWalk, type: "Walk", address: safeDestination, note: "安排低强度城市漫步，作为初到目的地的适应段。", tags: ["轻量", "可替换"], budget: 80, amapKeyword: `${safeDestination} 市中心 景点`, image: cover, x: 46, y: 42 }),
          makeStop({ time: "19:00", title: profile.food, type: "Dinner", address: safeDestination, note: "用投票确定第一晚餐厅，并记录订单或团购信息。", tags: ["美食", "投票"], budget: options.budget === "品质" ? 420 : 220, amapKeyword: `${safeDestination} 特色美食`, image: images.food, x: 62, y: 54 }),
        ],
      },
      {
        id: uid(),
        label: "D2",
        title: `第2天 ${safeDestination}核心景点`,
        route: profile.routeFocus,
        weather: "天气待确认",
        transport: "市内交通 + 打车",
        stops: [
          profileStop(profile, primary, { time: "09:30", x: 42, y: 42 }),
          makeStop({ time: "14:30", title: profile.culture, type: "Culture", address: safeDestination, note: "适合接在主要景点之后，补充当地文化和步行体验。", tags: ["文化", "散步"], budget: 120, amapKeyword: `${safeDestination} 历史街区 文化`, image: images.museum, x: 58, y: 48 }),
          makeStop({ time: "19:30", title: profile.night, type: "Walk", address: safeDestination, note: "晚上不排高强度项目，留给夜景、补给和自由讨论。", tags: ["夜景", "轻量"], budget: 80, amapKeyword: `${safeDestination} 夜景`, image: cover, x: 68, y: 56 }),
        ],
      },
      {
        id: uid(),
        label: "D3",
        title: `第3天 ${safeDestination}返程`,
        route: `自由补完 · 伴手礼 · 返程缓冲`,
        weather: "天气待确认",
        transport: "市内交通 + 返程交通",
        stops: [
          makeStop({ time: "10:00", title: `${safeDestination}自由补完`, type: "Scenic", address: safeDestination, note: "补拍、购物或替换成还没有去成的备选景点。", tags: ["补完", "可替换"], budget: 160, amapKeyword: `${safeDestination} 伴手礼 景点`, image: cover, x: 42, y: 42 }),
          makeStop({ time: "14:30", title: `${safeDestination}返程缓冲`, type: "Transit", address: safeDestination, note: "预留取行李、打车、车站/机场安检时间。", tags: ["返程", "缓冲"], budget: 320, amapKeyword: `${safeDestination} 机场 火车站`, image: cover, x: 62, y: 50 }),
        ],
      },
    ],
  };

  return fillRecommendedDays(plan, dayCount, options);
}

function buildRecommendedPlan(destination, dayCount = 3, options = {}) {
  const safeDestination = destination || "甘肃";
  const plan = /甘肃|敦煌|张掖|嘉峪关|兰州|Gansu/i.test(safeDestination)
    ? buildGansuPlan(dayCount, options)
    : /青海|西宁|茶卡|青海湖|Qinghai|Xining|Chaka/i.test(safeDestination)
      ? buildQinghaiPlan(dayCount, options)
      : /青岛|Qingdao/i.test(safeDestination)
        ? buildQingdaoPlan(dayCount, options)
        : /内蒙古|呼和浩特|呼伦贝尔|满洲里|额尔古纳|阿尔山|草原|Inner.?Mongolia/i.test(safeDestination)
          ? buildInnerMongoliaPlan(dayCount, options)
          : buildGenericRecommendedPlan(safeDestination, dayCount, options);
  return normalizePlanCover(sanitizePlanImages(plan));
}

function buildBlankPlan(destination, dayCount = 3, options = {}) {
  const safeDestination = destination || "自定义目的地";
  const cover = destinationDefaultImage(safeDestination);
  return normalizePlanCover({
    name: `${safeDestination} ${dayCount} 日空白计划`,
    destination: safeDestination,
    dateRange: "自定义日期",
    budgetLimit: recommendedBudgetLimit(options),
    cover,
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
        image: cover,
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
          image: cover,
          x: 34 + ((index * 11) % 48),
          y: 32 + ((index * 9) % 38),
        }),
      ],
    })),
  });
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

function sanitizePlanImages(plan) {
  if (!plan || typeof plan !== "object") return plan;
  const currentCover = cleanImageUrl(plan.cover);
  plan.cover = currentCover && isDynamicPlaceImageCandidate(currentCover) && !isLegacyRemoteImageUrl(currentCover) ? currentCover : "";
  const clearStopImage = (stop) => {
    stop.image = "";
    stop.imageStatus = "";
    stop.imageSource = "";
    stop.imageCandidates = [];
    stop.imageLookupVersion = "";
    stop.imageVerifiedAt = "";
    stop.imagePageUrl = "";
    stop.imageLicense = "";
    stop.imageCreator = "";
  };
  const normalizeStopImage = (stop) => {
    if (!stop || typeof stop !== "object") return;
    const image = cleanImageUrl(stop.image);
    const text = `${stop.title || ""} ${stop.type || ""} ${(stop.tags || []).join(" ")}`;
    const shouldClear =
      (stop.image && (!image || !isDynamicPlaceImageCandidate(image) || isLegacyRemoteImageUrl(image))) ||
      isPlaceholderStop(stop, plan.destination || plan.name || "") ||
      NON_PLACE_IMAGE_TYPES.test(text) ||
      isLegacyRemoteImageUrl(image);
    if (shouldClear) {
      clearStopImage(stop);
      return;
    }
    stop.image = image && isDynamicPlaceImageCandidate(image) ? image : "";
    stop.imageCandidates = normalizedImageCandidateList(stop);
  };
  (plan.days || []).forEach((day) => (day.stops || []).forEach(normalizeStopImage));
  (plan.candidates || []).forEach(normalizeStopImage);
  return plan;
}

function repairKnownPlanStop(stop = {}, dayIndex = -1, plan = {}) {
  const destination = `${plan.destination || ""} ${plan.name || ""}`;
  if (!/青海/.test(destination) || !isPlaceholderStop(stop, plan.destination || plan.name || "")) return stop;
  const tags = (stop.tags || []).join(" ");
  const image = String(stop.image || "");
  if (dayIndex === 0 && /集合|高原适应/.test(tags)) {
    return {
      ...stop,
      title: "西宁集合与高原适应",
      type: "Transit",
      address: stop.address && stop.address !== "地址待确认" ? stop.address : "西宁市区",
      note: stop.note || "抵达后先集合、补水并适应海拔，把第二天环湖交通确认好。",
      amapKeyword: stop.amapKeyword || "西宁 市区",
    };
  }
  if (dayIndex === 0 && /文化|门票/.test(tags) && /a4aa82164c6240d1743bcf4470709678/.test(image)) {
    return {
      ...stop,
      title: "塔尔寺",
      type: "Temple",
      address: stop.address && stop.address !== "地址待确认" ? stop.address : "西宁市湟中区金塔路56号",
      note: stop.note || "青海经典文化点，建议预留讲解时间；注意尊重寺院拍摄规则。",
      amapKeyword: stop.amapKeyword || "青海 塔尔寺",
    };
  }
  if (dayIndex === 2 && /自然|门票/.test(tags)) {
    return {
      ...stop,
      title: "茶卡盐湖",
      type: "Lake",
      address: stop.address && stop.address !== "地址待确认" ? stop.address : "海西蒙古族藏族自治州乌兰县茶卡镇",
      note: stop.note || "天气好时倒影效果更好，建议穿防滑鞋并注意防晒。",
      amapKeyword: stop.amapKeyword || "青海 茶卡盐湖",
    };
  }
  if (dayIndex === 3 && /edit/i.test(String(stop.type || ""))) {
    return {
      ...stop,
      title: "西宁返程前自由补完",
      type: "Walk",
      address: stop.address && stop.address !== "地址待确认" ? stop.address : "西宁市区",
      note: stop.note || "预留补拍、购物或临时调整时间。",
      amapKeyword: stop.amapKeyword || "西宁 市区 景点",
    };
  }
  return stop;
}

function repairPlanStructure(plan = {}) {
  if (!plan || typeof plan !== "object") return plan;
  (plan.days || []).forEach((day, dayIndex) => {
    const seenIds = new Set();
    const seenSemantic = new Set();
    day.stops = (day.stops || [])
      .map((stop) => repairKnownPlanStop(stop, dayIndex, plan))
      .filter((stop) => {
        const id = String(stop?.id || "");
        const semantic = `${stop?.title || ""}|${stop?.type || ""}|${stop?.time || ""}|${stop?.address || ""}`.toLowerCase();
        if (id && seenIds.has(id)) return false;
        if (seenSemantic.has(semantic)) return false;
        if (id) seenIds.add(id);
        seenSemantic.add(semantic);
        return true;
      });
  });
  return sanitizePlanImages(plan);
}

function planStopsForCover(plan = {}) {
  const destination = plan.destination || plan.name || "";
  return [
    ...(plan.days || []).flatMap((day) => day.stops || []),
    ...(plan.candidates || []),
  ].filter((stop) => !isPlaceholderStop(stop, destination));
}

function preferredCoverForPlan(plan = {}) {
  const destination = plan.destination || plan.name || "";
  const stops = planStopsForCover(plan);
  const scenicStop = stops.find((stop) => /景区|Scenic|Mountain|Lake|Museum|Forest|Canyon|Grottoes|Geopark|Temple|Heritage|Grassland|Wetland|Desert/i.test(`${stop.type || ""} ${stop.title || ""}`));
  const orderedStops = scenicStop ? [scenicStop, ...stops.filter((stop) => stop !== scenicStop)] : stops;
  const stopImage = orderedStops
    .filter((stop) => hasVerifiedPlaceImage(stop))
    .map((stop) => cleanImageUrl(stop.image))
    .find((image) => image && isDynamicPlaceImageCandidate(image));
  if (stopImage) return stopImage;
  const currentCover = cleanImageUrl(plan.cover);
  return hasTrustedCoverImage(plan, currentCover) ? currentCover : "";
}

function normalizePlanCover(plan = {}) {
  if (!plan || typeof plan !== "object") return plan;
  plan.cover = preferredCoverForPlan(plan);
  return plan;
}

function ensurePlanDates(plan) {
  if (!plan?.days?.length) return plan;
  ensurePlanOrigin(plan);
  repairPlanStructure(plan);
  if (plan.startDate && plan.endDate && plan.days.every((day) => day.date)) return plan;
  const defaults = defaultGuideDates();
  const startDate = plan.startDate || defaults.startDate;
  const endDate = plan.endDate || formatIsoDate(addDays(parseIsoDate(startDate), plan.days.length - 1));
  return repairPlanStructure(applyPlanDates(plan, startDate, endDate));
}

function hasLocalChanges() {
  return Boolean(lastSyncedState && !samePlanContent(state, lastSyncedState));
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
  return normalizeComments([...(localComments || []), ...(remoteComments || [])]);
}

function commentRevisionTime(comment = {}) {
  return Math.max(
    new Date(comment.updatedAt || 0).getTime() || 0,
    new Date(comment.resolvedAt || 0).getTime() || 0,
    new Date(comment.at || 0).getTime() || 0,
  );
}

function mergeCommentEntry(first = {}, second = {}) {
  const firstTime = commentRevisionTime(first);
  const secondTime = commentRevisionTime(second);
  const base = secondTime >= firstTime ? second : first;
  const other = base === second ? first : second;
  const merged = { ...clone(other), ...clone(base) };
  if (base.resolved) {
    merged.resolved = true;
    merged.resolvedAt = base.resolvedAt || merged.resolvedAt || base.updatedAt || new Date().toISOString();
    merged.resolvedBy = base.resolvedBy || merged.resolvedBy || "";
  } else {
    delete merged.resolved;
    delete merged.resolvedAt;
    delete merged.resolvedBy;
  }
  return merged;
}

function commentCreatedTime(comment = {}) {
  return new Date(comment.at || 0).getTime() || 0;
}

function commentAnchorIdentity(anchor = null) {
  if (!anchor) return "";
  return JSON.stringify({
    scope: anchor.scope || "",
    field: anchor.field || "",
    start: Number(anchor.start || 0),
    end: Number(anchor.end || 0),
    dayId: anchor.dayId || "",
    stopId: anchor.stopId || "",
    blockId: anchor.blockId || "",
    excerpt: anchor.excerpt || "",
  });
}

function commentDuplicateKey(comment = {}) {
  return [
    comment.parentId || "root",
    String(comment.author || "").trim(),
    String(comment.text || "").trim(),
    commentAnchorIdentity(comment.anchor || null),
  ].join("|");
}

function shouldMergeCommentEntries(first = {}, second = {}) {
  if (first.id && second.id && first.id === second.id) return true;
  if (commentDuplicateKey(first) !== commentDuplicateKey(second)) return false;
  const createdDiff = Math.abs(commentCreatedTime(first) - commentCreatedTime(second));
  return createdDiff <= 24 * 60 * 60 * 1000 || first.resolved || second.resolved;
}

function mergeCommentListEntries(comments = []) {
  const result = [];
  comments.forEach((comment) => {
    const index = result.findIndex((existing) => shouldMergeCommentEntries(existing, comment));
    if (index < 0) result.push(comment);
    else result[index] = mergeCommentEntry(result[index], comment);
  });
  return result;
}

function mergeDayBlocks(localBlocks = [], remoteBlocks = []) {
  const localNormalized = normalizeDayBlocks(localBlocks || []);
  const remoteNormalized = normalizeDayBlocks(remoteBlocks || []);
  const remoteById = new Map(remoteNormalized.map((block) => [block.id, block]));
  const localIds = new Set(localNormalized.map((block) => block.id));
  const merged = localNormalized.map((block) => {
    const remoteBlock = remoteById.get(block.id);
    if (!remoteBlock) return block;
    return normalizeDayBlock({
      ...remoteBlock,
      ...block,
      done: block.done || remoteBlock.done,
      comments: mergeComments(block.comments || [], remoteBlock.comments || []),
      updatedAt: block.updatedAt || remoteBlock.updatedAt,
      updatedBy: block.updatedBy || remoteBlock.updatedBy,
    });
  });
  remoteNormalized.forEach((block) => {
    if (!localIds.has(block.id)) merged.push(block);
  });
  return normalizeDayBlocks(merged).slice(0, 80);
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
    "voters",
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
      comments: mergeComments(localDay.comments || [], remoteDay?.comments || []),
      blocks: mergeDayBlocks(localDay.blocks || [], remoteDay?.blocks || []),
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
  const normalizedMerged = ensurePlanDates(merged);
  const mergedPlanYjs = planYjsSnapshotFromPlan(normalizedMerged);
  if (mergedPlanYjs) normalizedMerged.planYjs = mergedPlanYjs;
  else clearPlanYjsState(normalizedMerged);
  return normalizedMerged;
}

function conflictSummary(conflict) {
  const who = conflict?.updatedBy || "其他成员";
  const when = conflict?.updatedAt ? new Date(conflict.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "刚刚";
  return `${who} 在 ${when} 保存了云端版本，同时你本地也有未同步修改。`;
}

function timestampValue(value = "") {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function isStaleRemoteUpdate(updatedAt = "") {
  const nextTime = timestampValue(updatedAt);
  const currentTime = timestampValue(lastRemoteUpdatedAt);
  return Boolean(nextTime && currentTime && nextTime <= currentTime);
}

function showConflictPanel(conflict) {
  pendingConflict = { ...conflict, base: conflict.base || clone(lastSyncedState || {}) };
  if (!dom.conflictPanel) return;
  dom.conflictPanel.hidden = false;
  dom.conflictText.textContent = conflictSummary(pendingConflict);
  if (dom.conflictDiff) {
    const diff = conflictDiffSummary(pendingConflict);
    dom.conflictDetail.textContent = diff.overlapCount
      ? `检测到 ${diff.overlapCount} 处同位置冲突。智能合并会尽量保留双方新增内容；同一字段冲突时会优先保留你的当前编辑。`
      : "请选择处理方式：智能合并会尽量保留双方新增的地点、评论、交通报价和活动记录。";
    const renderGroup = (title, items, extra, emptyText) => `
      <div class="conflict-diff-group">
        <strong>${escapeHtml(title)}</strong>
        <ul>
          ${items.length ? items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : `<li>${escapeHtml(emptyText)}</li>`}
          ${extra ? `<li>还有 ${extra} 项变化</li>` : ""}
        </ul>
      </div>
    `;
    const renderOverlapDetails = (items, extra) => items.length || extra ? `
      <div class="conflict-diff-group is-overlap-detail">
        <strong>字段级冲突</strong>
        <ul>
          ${items.map((item) => `
            <li>
              <span>${escapeHtml(item.label)}</span>
              <small>我：${escapeHtml(item.local)}</small>
              <small>云端：${escapeHtml(item.remote)}</small>
            </li>
          `).join("")}
          ${extra ? `<li><span>还有 ${extra} 处同位置冲突</span></li>` : ""}
        </ul>
      </div>
    ` : "";
    dom.conflictDiff.innerHTML = [
      renderGroup("我的修改", diff.local, diff.localExtra, "没有检测到本地内容变化"),
      renderGroup("云端修改", diff.remote, diff.remoteExtra, "没有检测到云端内容变化"),
      diff.overlap.length || diff.overlapExtra
        ? renderGroup("同位置冲突", diff.overlap, diff.overlapExtra, "")
        : "",
      renderOverlapDetails(diff.overlapDetails, diff.overlapExtra),
    ].join("");
  }
  dom.collabMode.textContent = "待处理冲突";
  dom.saveState.textContent = "发现协作冲突";
  refreshIcons();
}

function hideConflictPanel() {
  pendingConflict = null;
  if (dom.conflictPanel) dom.conflictPanel.hidden = true;
  if (dom.conflictDiff) dom.conflictDiff.innerHTML = "";
}

function setNoteCollabStatus(message) {
  if (dom.noteCollabStatus) dom.noteCollabStatus.textContent = message;
}

function collabTextFieldMeta(field) {
  return COLLAB_PRESENCE_TEXT_FIELD_BY_FIELD.get(field) || COLLAB_TEXT_FIELD_BY_FIELD.get(field) || null;
}

function currentFocusedTextField() {
  const activeElement = document.activeElement;
  return COLLAB_PRESENCE_TEXT_FIELDS.find(({ domKey }) => dom[domKey] === activeElement) || null;
}

function textSelectionPayload(fieldMeta) {
  const element = fieldMeta ? dom[fieldMeta.domKey] : null;
  if (!element || document.activeElement !== element) return null;
  const fallbackPosition = String(element.value || "").length;
  const start = typeof element.selectionStart === "number" ? element.selectionStart : fallbackPosition;
  const end = typeof element.selectionEnd === "number" ? element.selectionEnd : start;
  return {
    field: fieldMeta.field,
    scope: fieldMeta.scope || "stop",
    label: fieldMeta.label,
    start,
    end,
    length: String(element.value || "").length,
  };
}

function elementSelectionPayload(element, meta = {}) {
  if (!element || document.activeElement !== element) return null;
  const value = String(element.value || "");
  const fallbackPosition = value.length;
  const start = typeof element.selectionStart === "number" ? element.selectionStart : fallbackPosition;
  const end = typeof element.selectionEnd === "number" ? element.selectionEnd : start;
  return {
    field: meta.field || "",
    scope: meta.scope || "",
    label: meta.label || "",
    start,
    end,
    length: value.length,
  };
}

function selectionExcerptFromElement(element, selection = {}) {
  const value = String(element?.value || "");
  const start = Math.max(0, Math.min(Number(selection.start || 0), value.length));
  const end = Math.max(start, Math.min(Number(selection.end || start), value.length));
  const selectedText = value.slice(start, end).trim();
  if (selectedText) return selectedText.length > 48 ? `${selectedText.slice(0, 48)}...` : selectedText;
  const before = value.slice(Math.max(0, start - 12), start).trim();
  const after = value.slice(start, Math.min(value.length, start + 24)).trim();
  const context = `${before}${before && after ? " / " : ""}${after}`.trim();
  return context.length > 48 ? `${context.slice(0, 48)}...` : context;
}

function textSelectionExcerpt(fieldMeta, selection = {}) {
  const element = fieldMeta ? dom[fieldMeta.domKey] : null;
  return selectionExcerptFromElement(element, selection);
}

function normalizeCommentAnchor(anchor = null) {
  if (!anchor?.field) return null;
  const meta = collabTextFieldMeta(anchor.field);
  const blockScope = anchor.scope === "block" && anchor.blockId;
  if (!meta && !blockScope) return null;
  const scope = meta?.scope || "stop";
  const start = Math.max(0, Number(anchor.start || 0));
  const end = Math.max(start, Number(anchor.end || start));
  const normalized = {
    field: meta?.field || String(anchor.field || ""),
    label: anchor.label || meta?.label || (blockScope ? "协作块" : "字段"),
    scope: blockScope ? "block" : scope,
    start,
    end,
    length: Math.max(0, Number(anchor.length || 0)),
    excerpt: String(anchor.excerpt || "").trim(),
  };
  if (blockScope) {
    normalized.dayId = anchor.dayId || currentDay()?.id || "";
    normalized.blockId = anchor.blockId || "";
  } else if (scope === "day") normalized.dayId = anchor.dayId || currentDay()?.id || "";
  else normalized.stopId = anchor.stopId || currentStop()?.id || "";
  return normalized;
}

function buildCommentAnchorFromField(fieldMeta = currentFocusedTextField()) {
  if (!fieldMeta) return null;
  const selection = textSelectionPayload(fieldMeta);
  if (!selection) return null;
  const scope = fieldMeta.scope || "stop";
  const anchor = {
    ...selection,
    excerpt: textSelectionExcerpt(fieldMeta, selection),
  };
  if (scope === "day") anchor.dayId = currentDay()?.id || "";
  else anchor.stopId = currentStop()?.id || "";
  return normalizeCommentAnchor(anchor);
}

function buildBlockCommentAnchor(blockId = activeBlockPresenceId) {
  if (!blockId || !dom.dayBlockList) return null;
  const input = dom.dayBlockList.querySelector(`[data-edit-day-block="${CSS.escape(blockId)}"]`);
  const selection = elementSelectionPayload(input, {
    field: `block:${blockId}`,
    scope: "block",
    label: "协作块",
  });
  if (!selection) return null;
  const day = currentDay();
  return normalizeCommentAnchor({
    ...selection,
    dayId: day?.id || "",
    blockId,
    excerpt: selectionExcerptFromElement(input, selection),
  });
}

function captureCommentAnchor(fieldMeta = currentFocusedTextField()) {
  const anchor = buildCommentAnchorFromField(fieldMeta);
  if (anchor) {
    lastCommentAnchor = {
      ...anchor,
      capturedAt: Date.now(),
    };
    renderCommentAnchorHint();
  }
  return anchor;
}

function currentCommentAnchor(scope = "") {
  const focused = buildCommentAnchorFromField(currentFocusedTextField());
  if (focused) return scope && focused.scope !== scope ? null : focused;
  if (!lastCommentAnchor) return null;
  const anchorScope = lastCommentAnchor.scope || "stop";
  const sameScope =
    anchorScope === "day"
      ? lastCommentAnchor.dayId && lastCommentAnchor.dayId === currentDay()?.id
      : lastCommentAnchor.stopId && lastCommentAnchor.stopId === currentStop()?.id;
  const fresh = Date.now() - Number(lastCommentAnchor.capturedAt || 0) < 10 * 60 * 1000;
  const normalized = sameScope && fresh ? normalizeCommentAnchor(lastCommentAnchor) : null;
  if (!normalized || (scope && normalized.scope !== scope)) return null;
  return normalized;
}

function currentBlockCommentAnchor(blockId = activeBlockPresenceId) {
  const focused = buildBlockCommentAnchor(blockId);
  if (focused) return focused;
  if (!lastCommentAnchor) return null;
  const fresh = Date.now() - Number(lastCommentAnchor.capturedAt || 0) < 10 * 60 * 1000;
  const normalized = fresh ? normalizeCommentAnchor(lastCommentAnchor) : null;
  if (!normalized || normalized.scope !== "block" || normalized.blockId !== blockId || normalized.dayId !== currentDay()?.id) return null;
  return normalized;
}

function textSelectionLabel(selection = {}) {
  const label = selection.label || collabTextFieldMeta(selection.field)?.label || "文本";
  const start = Number(selection.start || 0);
  const end = Number(selection.end || start);
  if (end > start) return `${label} · 选中 ${end - start} 字`;
  return `${label} · 光标 ${start}`;
}

function escapeHtmlWithSpaces(value = "") {
  return escapeHtml(String(value || ""))
    .replace(/ /g, "&nbsp;")
    .replace(/\n$/g, "\n\u200b")
    .replace(/\n/g, "<br>");
}

function caretCoordinates(element, index = 0) {
  if (!element) return null;
  const value = String(element.value || "");
  const position = Math.max(0, Math.min(Number(index || 0), value.length));
  const style = window.getComputedStyle(element);
  const mirror = document.createElement("div");
  const marker = document.createElement("span");
  const properties = [
    "boxSizing",
    "width",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "textTransform",
    "lineHeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "whiteSpace",
    "wordBreak",
    "overflowWrap",
  ];
  properties.forEach((property) => {
    mirror.style[property] = style[property];
  });
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.left = "-9999px";
  mirror.style.top = "0";
  mirror.style.minHeight = `${element.clientHeight}px`;
  mirror.style.whiteSpace = element.tagName === "TEXTAREA" ? "pre-wrap" : "pre";
  mirror.style.overflowWrap = element.tagName === "TEXTAREA" ? "break-word" : "normal";
  mirror.style.overflow = "hidden";
  mirror.scrollTop = element.scrollTop || 0;
  mirror.scrollLeft = element.scrollLeft || 0;
  mirror.innerHTML = `${escapeHtmlWithSpaces(value.slice(0, position))}<span data-caret></span>${escapeHtmlWithSpaces(value.slice(position)) || "&nbsp;"}`;
  document.body.appendChild(mirror);
  const caret = mirror.querySelector("[data-caret]");
  marker.textContent = "\u200b";
  caret.appendChild(marker);
  const mirrorRect = mirror.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const x = markerRect.left - mirrorRect.left - (element.scrollLeft || 0);
  const y = markerRect.top - mirrorRect.top - (element.scrollTop || 0);
  const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.25 || 18;
  mirror.remove();
  return {
    x: Math.max(0, Math.min(element.clientWidth, Math.round(x))),
    y: Math.max(0, Math.min(element.clientHeight - 2, Math.round(y))),
    height: Math.max(14, Math.round(lineHeight)),
  };
}

function textPresenceGeometry(element, selection = {}) {
  const start = Number(selection.start || 0);
  const end = Number(selection.end || start);
  const anchor = caretCoordinates(element, start);
  const focus = caretCoordinates(element, end);
  if (!anchor || !focus) return null;
  const selected = end > start;
  const sameLine = Math.abs(focus.y - anchor.y) < Math.max(6, anchor.height * 0.5);
  const selectionLeft = selected ? Math.min(anchor.x, focus.x) : anchor.x;
  const selectionTop = selected ? Math.min(anchor.y, focus.y) : anchor.y;
  const selectionWidth = selected && sameLine ? Math.max(4, Math.abs(focus.x - anchor.x)) : selected ? Math.max(20, element.clientWidth - selectionLeft - 4) : 2;
  const selectionHeight = selected && !sameLine ? Math.max(anchor.height, focus.y - anchor.y + focus.height) : anchor.height;
  return {
    x: anchor.x,
    y: anchor.y,
    height: anchor.height,
    selectionLeft,
    selectionTop,
    selectionWidth,
    selectionHeight,
  };
}

function memberPresenceClass(member = {}, index = 0) {
  const key = String(member.memberId || member.name || index);
  const seed = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), index);
  return `a${(seed % 4) + 1}`;
}

function freshMember(member = {}, ttl = 45000) {
  const seenAt = Date.parse(member.seenAt || "");
  return Number.isNaN(seenAt) || Date.now() - seenAt < ttl;
}

function remoteTextEditorsForField(field, scope = "stop") {
  const stopId = currentStop()?.id || "";
  const dayId = currentDay()?.id || "";
  const ownMemberId = memberProfile?.id || sessionId;
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member)) return false;
    if (scope === "plan") {
      return member.textSelection?.field === field;
    }
    if (scope === "day") {
      if (member.activeDayId !== dayId) return false;
    } else if (member.activeStopId !== stopId) {
      return false;
    }
    return member.textSelection?.field === field;
  });
}

function confirmRemoteTextFieldEdit(fields = [], scope = "stop", action = "保存字段") {
  const fieldIds = (Array.isArray(fields) ? fields : [fields]).map((field) => String(field || "")).filter(Boolean);
  const uniqueFields = [...new Set(fieldIds)];
  if (!uniqueFields.length) return true;
  const lockKey = `field:${scope}:${uniqueFields.sort().join("|")}:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = uniqueFields.flatMap((field) => remoteTextEditorsForField(field, scope));
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const labels = uniqueFields
    .map((field) => COLLAB_PRESENCE_TEXT_FIELD_BY_FIELD.get(field)?.label || field)
    .slice(0, 4)
    .join("、");
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑${labels ? `「${labels}」` : "同一字段"}。继续${action}可能覆盖或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的字段`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑${labels ? `「${labels}」` : "同一字段"}，稍后再操作更稳妥。`;
  return false;
}

function currentFocusedBlockContext() {
  const active = document.activeElement;
  const focusedBlockElement = active && dom.dayBlockList?.contains(active) ? active.closest?.("[data-day-block]") : null;
  const blockId = focusedBlockElement?.dataset.dayBlock || activeBlockPresenceId || "";
  if (!blockId) return null;
  const day = currentDay();
  const block = normalizeDayBlocks(day?.blocks || []).find((item) => item.id === blockId);
  if (!day || !block) return null;
  const isComment = Boolean(focusedBlockElement && (active.closest?.("[data-block-comment-form]") || active.closest?.(".day-block-comments")));
  const isText = Boolean(focusedBlockElement && active.closest?.("[data-edit-day-block]"));
  const blockSelection = isText ? elementSelectionPayload(active, {
    field: `block:${blockId}`,
    scope: "block",
    label: "协作块",
  }) : null;
  return {
    dayId: day.id,
    blockId,
    blockText: block.text || dayBlockTypeLabel(block.type),
    mode: isComment ? "comment" : isText ? "text" : "block",
    blockSelection,
  };
}

function dayBlockSelectionForPresence(day = currentDay()) {
  const validIds = new Set(normalizeDayBlocks(day?.blocks || []).map((block) => block.id));
  const selectedIds = [...selectedDayBlockIds].filter((blockId) => validIds.has(blockId));
  return {
    ids: selectedIds.slice(0, 50),
    count: selectedIds.length,
  };
}

function blockEditingLabel(context = {}) {
  if (!context?.blockId) return "";
  if (context.mode === "comment") return "正在评论协作块";
  if (context.mode === "text") return "正在编辑协作块";
  return "正在查看协作块";
}

function remoteEditorsForBlock(blockId = "") {
  const dayId = currentDay()?.id || "";
  const ownMemberId = memberProfile?.id || sessionId;
  if (!blockId) return [];
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member)) return false;
    return member.activeDayId === dayId && member.activeBlockId === blockId;
  });
}

function remoteSelectorsForBlock(blockId = "") {
  const dayId = currentDay()?.id || "";
  const ownMemberId = memberProfile?.id || sessionId;
  if (!blockId) return [];
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member) || member.activeDayId !== dayId) return false;
    return Array.isArray(member.selectedDayBlockIds) && member.selectedDayBlockIds.includes(blockId);
  });
}

function remoteActiveEditorsForBlock(blockId = "") {
  return remoteEditorsForBlock(blockId).filter((member) => (
    member.blockSelection ||
    /编辑|评论/.test(member.blockEditing || "")
  ));
}

function remoteBlockEditorNames(blockId = "") {
  const names = [...new Set(remoteActiveEditorsForBlock(blockId).map((member) => member.name || "协作者"))];
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  return visible ? `${visible}${extra}` : "";
}

function remoteBlockSelectorNames(blockId = "") {
  const names = [...new Set(remoteSelectorsForBlock(blockId).map((member) => member.name || "协作者"))];
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  return visible ? `${visible}${extra}` : "";
}

function remoteActiveEditorsForRecord(field = "", ids = []) {
  const recordIds = new Set((Array.isArray(ids) ? ids : [ids]).map((id) => String(id || "")).filter(Boolean));
  if (!field || !recordIds.size) return [];
  const ownMemberId = memberProfile?.id || sessionId;
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member)) return false;
    return recordIds.has(String(member[field] || ""));
  });
}

function remoteActiveEditorsForStops(stopIds = []) {
  return remoteActiveEditorsForRecord("activeStopId", stopIds).filter((member) => (
    member.textSelection ||
    member.textEditing ||
    member.lockMode === "editing"
  ));
}

function remoteActiveEditorsForDays(dayIds = []) {
  const ids = new Set((Array.isArray(dayIds) ? dayIds : [dayIds]).map((id) => String(id || "")).filter(Boolean));
  const ownMemberId = memberProfile?.id || sessionId;
  if (!ids.size) return [];
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member) || !ids.has(String(member.activeDayId || ""))) return false;
    return (
      member.textSelection ||
      member.textEditing ||
      member.blockSelection ||
      member.blockEditing ||
      member.activeStopId ||
      member.activeBlockId ||
      member.lockMode === "editing"
    );
  });
}

function confirmRemoteRecordEdit(kind, ids = [], action = "操作记录") {
  const recordIds = (Array.isArray(ids) ? ids : [ids]).map((id) => String(id || "")).filter(Boolean);
  const uniqueIds = [...new Set(recordIds)];
  if (!uniqueIds.length) return true;
  const lockKey = `${kind}:${uniqueIds.sort().join("|")}:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const field = kind === "candidate" ? "activeCandidateId" : "activeTransportQuoteId";
  const label = kind === "candidate" ? "备选地点" : "交通报价";
  const editors = remoteActiveEditorsForRecord(field, uniqueIds);
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑相关${label}。继续${action}可能覆盖或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的${label}`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑相关${label}，稍后再操作更稳妥。`;
  return false;
}

function confirmRemoteStopEdit(stopIds = [], action = "操作地点") {
  const ids = (Array.isArray(stopIds) ? stopIds : [stopIds]).map((id) => String(id || "")).filter(Boolean);
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return true;
  const lockKey = `stop:${uniqueIds.sort().join("|")}:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = remoteActiveEditorsForStops(uniqueIds);
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑相关地点。继续${action}可能移动、覆盖或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的地点`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑相关地点，稍后再操作更稳妥。`;
  return false;
}

function confirmRemoteDayEdit(dayIds = [], action = "操作当天") {
  const ids = (Array.isArray(dayIds) ? dayIds : [dayIds]).map((id) => String(id || "")).filter(Boolean);
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return true;
  const lockKey = `day:${uniqueIds.sort().join("|")}:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = remoteActiveEditorsForDays(uniqueIds);
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在这个日期里编辑地点、当天文本或协作块。继续${action}可能移动、删除或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的日期内容`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑这个日期，稍后再操作更稳妥。`;
  return false;
}

function confirmRemoteDayBlockEdit(blockIds = [], action = "操作协作块") {
  const ids = (Array.isArray(blockIds) ? blockIds : [blockIds]).map((id) => String(id || "")).filter(Boolean);
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return true;
  const lockKey = `dayBlock:${uniqueIds.sort().join("|")}:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = uniqueIds.flatMap((blockId) => remoteActiveEditorsForBlock(blockId));
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑相关协作块。继续${action}可能移动、删除或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的协作块`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑相关协作块，稍后再操作更稳妥。`;
  return false;
}

function remoteActivePlanMembers() {
  const ownMemberId = memberProfile?.id || sessionId;
  return onlineMembers.filter((member) => {
    if (!member || member.memberId === sessionId || member.memberId === ownMemberId) return false;
    if (!freshMember(member)) return false;
    return (
      member.textSelection ||
      member.textEditing ||
      member.blockSelection ||
      member.blockEditing ||
      member.activeStopId ||
      member.activeBlockId ||
      member.activeCandidateId ||
      member.activeTransportQuoteId ||
      member.lockMode === "editing"
    );
  });
}

function confirmRemotePlanReplace(action = "替换整份计划") {
  const lockKey = `plan-replace:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = remoteActivePlanMembers();
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑这份计划。继续${action}会替换整份计划，可能覆盖或打断对方正在修改的内容，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的计划`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑计划，稍后再操作更稳妥。`;
  return false;
}

function confirmRemotePlanSettingEdit(action = "更新计划设置") {
  const lockKey = `plan-setting:${action}`;
  if (confirmedRemoteRecordEditUntil[lockKey] && confirmedRemoteRecordEditUntil[lockKey] > Date.now()) return true;
  const editors = remoteActivePlanMembers();
  const names = [...new Set(editors.map((member) => member.name || "协作者"))];
  if (!names.length) return true;
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  const ok = window.confirm(`${visible}${extra} 正在编辑这份计划。继续${action}可能影响预算、权限或计划基础设置，确定继续吗？`);
  if (ok) {
    confirmedRemoteRecordEditUntil[lockKey] = Date.now() + 30000;
    return true;
  }
  dom.saveState.textContent = `已取消${action}，保留协作者正在编辑的计划设置`;
  dom.collabStatus.textContent = `${visible}${extra} 仍在编辑计划，稍后再更新设置更稳妥。`;
  return false;
}

function confirmRemoteCandidateEdit(candidateIds = [], action = "操作备选地点") {
  return confirmRemoteRecordEdit("candidate", candidateIds, action);
}

function confirmRemoteTransportQuoteEdit(quoteIds = [], action = "操作交通报价") {
  return confirmRemoteRecordEdit("transportQuote", quoteIds, action);
}

function remoteRecordEditorNames(kind, ids = []) {
  const recordIds = (Array.isArray(ids) ? ids : [ids]).map((id) => String(id || "")).filter(Boolean);
  const field = kind === "candidate" ? "activeCandidateId" : "activeTransportQuoteId";
  const names = [...new Set(remoteActiveEditorsForRecord(field, recordIds).map((member) => member.name || "协作者"))];
  const visible = names.slice(0, 3).join("、");
  const extra = names.length > 3 ? ` 等 ${names.length} 人` : "";
  return visible ? `${visible}${extra}` : "";
}

function noteRemoteBlockEditors(blockId = "", action = "操作协作块") {
  const names = remoteBlockEditorNames(blockId);
  if (!names || !dom.saveState) return;
  dom.saveState.textContent = `${names} 正在同一协作块中，${action}前留意对方修改`;
}

function renderDayBlockTextPresence(block) {
  const editors = remoteEditorsForBlock(block.id)
    .filter((member) => member.blockSelection && member.activeBlockId === block.id)
    .slice(0, 3);
  if (!editors.length) return "";
  return `
    <span class="text-presence-inline day-block-text-presence" aria-hidden="true">
      ${editors.map((member, index) => {
        const selection = member.blockSelection || {};
        const input = dom.dayBlockList?.querySelector(`[data-edit-day-block="${CSS.escape(block.id)}"]`);
        const geometry = input ? textPresenceGeometry(input, selection) : null;
        if (!geometry) return "";
        const selected = Number(selection.end || 0) > Number(selection.start || 0);
        return `
          <span class="text-presence-inline-mark ${memberPresenceClass(member, index)}" style="--cursor-x:${geometry.x}px;--cursor-y:${geometry.y}px;--cursor-height:${geometry.height}px;--selection-x:${geometry.selectionLeft}px;--selection-y:${geometry.selectionTop}px;--selection-width:${selected ? geometry.selectionWidth : 2}px;--selection-height:${selected ? geometry.selectionHeight : geometry.height}px">
            <i class="text-presence-selection" aria-hidden="true"></i>
            <i class="text-presence-cursor" aria-hidden="true"></i>
            <b>${escapeHtml(memberInitial(member.name))}</b>
          </span>
        `;
      }).join("")}
    </span>
  `;
}

function renderDayBlockCommentHighlights(block) {
  const input = dom.dayBlockList?.querySelector(`[data-edit-day-block="${CSS.escape(block.id)}"]`);
  if (!input) return "";
  return commentRootsAndReplies(block.comments || []).roots
    .filter((comment) => normalizeCommentAnchor(comment.anchor)?.scope === "block" && comment.anchor?.blockId === block.id)
    .slice(0, 8)
    .map((comment, index) => renderCommentHighlight(comment, input, index))
    .join("");
}

function commentsForScope(scope = "stop") {
  return scope === "day" ? currentDay()?.comments || [] : currentStop()?.comments || [];
}

function commentAnchorsForField(field, comments = null) {
  const meta = collabTextFieldMeta(field);
  const scopedComments = comments || commentsForScope(meta?.scope || "stop");
  return commentRootsAndReplies(scopedComments || []).roots.filter((comment) => comment.anchor?.field === field);
}

function renderCommentHighlight(comment, element, index = 0) {
  const anchor = normalizeCommentAnchor(comment.anchor);
  if (!anchor || !element) return "";
  const valueLength = String(element.value || "").length;
  const rawStart = Math.max(0, Math.min(Number(anchor.start || 0), valueLength));
  const rawEnd = Math.max(rawStart, Math.min(Number(anchor.end || rawStart), valueLength));
  const start = rawStart;
  const end = rawEnd > rawStart ? rawEnd : Math.min(valueLength, rawStart + 1);
  const geometry = textPresenceGeometry(element, { start, end });
  if (!geometry) return "";
  const resolvedClass = comment.resolved ? " is-resolved" : "";
  return `
    <button type="button" class="comment-highlight${resolvedClass}" data-comment-highlight="${escapeHtml(comment.id || "")}" data-comment-scope="${escapeHtml(anchor.scope || "stop")}" style="--selection-x:${geometry.selectionLeft}px;--selection-y:${geometry.selectionTop}px;--selection-width:${geometry.selectionWidth}px;--selection-height:${geometry.selectionHeight}px;--comment-offset:${index * 3}px" title="${escapeHtml(comment.resolved ? "已解决批注" : "未解决批注")}">
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderTextPresence() {
  COLLAB_PRESENCE_TEXT_FIELDS.forEach(({ field, presenceId, domKey, scope }) => {
    const target = presenceId ? document.querySelector(`#${presenceId}`) : null;
    if (!target) return;
    const editors = remoteTextEditorsForField(field, scope || "stop");
    const element = dom[domKey];
    const commentHighlights = commentAnchorsForField(field, commentsForScope(scope || "stop"));
    target.hidden = !editors.length && !commentHighlights.length;
    const inlineMarks = editors
      .slice(0, 3)
      .map((member, index) => {
        const selection = member.textSelection || {};
        const start = Number(selection.start || 0);
        const end = Number(selection.end || start);
        const selected = end > start;
        const geometry = textPresenceGeometry(element, selection);
        if (!geometry) return "";
        const accentClass = memberPresenceClass(member, index);
        const initial = escapeHtml(memberInitial(member.name));
        return `
          <span class="text-presence-inline-mark ${accentClass}" style="--cursor-x:${geometry.x}px;--cursor-y:${geometry.y}px;--cursor-height:${geometry.height}px;--selection-x:${geometry.selectionLeft}px;--selection-y:${geometry.selectionTop}px;--selection-width:${selected ? geometry.selectionWidth : 2}px;--selection-height:${selected ? geometry.selectionHeight : geometry.height}px">
            <i class="text-presence-selection" aria-hidden="true"></i>
            <i class="text-presence-cursor" aria-hidden="true"></i>
            <b>${initial}</b>
          </span>
        `;
      })
      .join("");
    const highlightMarks = commentHighlights
      .slice(0, 8)
      .map((comment, index) => renderCommentHighlight(comment, element, index))
      .join("");
    const chips = editors
      .slice(0, 3)
      .map((member, index) => {
        const selection = member.textSelection || {};
        const start = Number(selection.start || 0);
        const end = Number(selection.end || start);
        const selected = end > start;
        const accentClass = memberPresenceClass(member, index);
        const initial = escapeHtml(memberInitial(member.name));
        return `
          <span class="text-presence-chip ${accentClass}">
            ${initial}
            <span>${escapeHtml(member.name || "协作者")} ${selected ? `选中 ${end - start} 字` : `光标 ${start}`}</span>
          </span>
        `;
      })
      .join("");
    const sizeClass = element?.tagName === "TEXTAREA" ? "is-textarea" : "is-input";
    target.innerHTML = `
      <span class="text-presence-inline ${sizeClass}">${highlightMarks}${inlineMarks}</span>
      <span class="text-presence-list">${chips}</span>
    `;
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

function refreshTextSelectionPresenceViews() {
  renderMembers();
  renderTextPresence();
  renderEditorLockState();
}

function currentTextRoomId(stopId = currentStop()?.id) {
  return tripId && stopId ? `text:${tripId}:${stopId}` : "";
}

function currentDayTextRoomId(dayId = currentDay()?.id) {
  return tripId && dayId ? `day-text:${tripId}:${dayId}` : "";
}

function dayBlockTextKey(dayId = "", blockId = "") {
  return dayId && blockId ? `${dayId}:${blockId}` : "";
}

function findStopLocation(stopId) {
  if (!stopId) return null;
  for (let dayIndex = 0; dayIndex < (state.days || []).length; dayIndex += 1) {
    const day = state.days[dayIndex];
    const stopIndex = (day?.stops || []).findIndex((stop) => stop?.id === stopId);
    if (stopIndex >= 0) return { day, stop: day.stops[stopIndex], dayIndex, stopIndex };
  }
  return null;
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

function buildInitialDayTextUpdate(Y, day) {
  const seedDoc = new Y.Doc();
  seedDoc.clientID = stableTextClientId(`${tripId}:day:${day.id}`);
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
    seedDoc.getText(docField).insert(0, day[docField] || "");
  });
  const commentArray = seedDoc.getArray("comments");
  commentArray.insert(0, normalizeComments(day.comments || []));
  const update = Y.encodeStateAsUpdate(seedDoc);
  seedDoc.destroy();
  return update;
}

function buildInitialDayBlockTextUpdate(Y, block = {}, dayId = "") {
  const seedDoc = new Y.Doc();
  seedDoc.clientID = stableTextClientId(`${tripId}:day-block:${dayId}:${block.id}`);
  seedDoc.getText("text").insert(0, block.text || "");
  const update = Y.encodeStateAsUpdate(seedDoc);
  seedDoc.destroy();
  return update;
}

function normalizeCollaborativeStop(stop = {}) {
  const normalizedVotes = normalizeStopVotes(stop);
  return {
    ...clone(stop),
    id: stop.id || uid(),
    time: String(stop.time || "").trim(),
    title: String(stop.title || "未命名地点").trim(),
    type: String(stop.type || "Place").trim(),
    address: String(stop.address || "地址待确认").trim(),
    note: String(stop.note || "").trim(),
    noteYjs: stop.noteYjs || "",
    textYjs: stop.textYjs || "",
    tags: normalizeTags(stop.tags || []),
    budget: numberValue(stop.budget),
    paid: numberValue(stop.paid),
    payer: String(stop.payer || "").trim(),
    budgetSelected: stop.budgetSelected !== false,
    voters: normalizedVotes.voters,
    votes: normalizedVotes.votes,
    userVoted: normalizedVotes.userVoted,
    favorite: Boolean(stop.favorite),
    comments: normalizeComments(stop.comments || []),
    x: Number.isFinite(Number(stop.x)) ? Number(stop.x) : 50,
    y: Number.isFinite(Number(stop.y)) ? Number(stop.y) : 50,
    lng: String(stop.lng || "").trim(),
    lat: String(stop.lat || "").trim(),
    amapKeyword: String(stop.amapKeyword || "").trim(),
    image: stop.image || "",
    imageSource: String(stop.imageSource || "").trim(),
    imageLicense: String(stop.imageLicense || "").trim(),
    imageCreator: String(stop.imageCreator || "").trim(),
    imagePageUrl: String(stop.imagePageUrl || "").trim(),
    imageVerifiedAt: String(stop.imageVerifiedAt || "").trim(),
    imageStatus: String(stop.imageStatus || "").trim(),
    imageLookupVersion: String(stop.imageLookupVersion || "").trim(),
    imageCandidates: normalizedImageCandidateList(stop).slice(0, 8),
    referenceUrl: String(stop.referenceUrl || "").trim(),
  };
}

function normalizeCollaborativeStopList(stops = []) {
  const seen = new Set();
  return (stops || [])
    .map((stop) => normalizeCollaborativeStop(stop))
    .filter((stop) => {
      if (!stop.id || seen.has(stop.id)) return false;
      seen.add(stop.id);
      return true;
    })
    .slice(0, 80);
}

function normalizeStopListsFromDays(days = []) {
  const lists = {};
  (days || []).forEach((day) => {
    if (!day?.id) return;
    lists[day.id] = normalizeCollaborativeStopList(day.stops || []);
  });
  return lists;
}

function normalizeStopTextStateEntries(entries = []) {
  const states = {};
  entries
    .filter(([stopId, textState]) => stopId && textState)
    .sort(([left], [right]) => String(left).localeCompare(String(right)))
    .forEach(([stopId, textState]) => {
      states[String(stopId)] = String(textState || "");
    });
  return states;
}

function normalizeDayTextStateEntries(entries = []) {
  const states = {};
  entries
    .filter(([dayId, textState]) => dayId && textState)
    .sort(([left], [right]) => String(left).localeCompare(String(right)))
    .forEach(([dayId, textState]) => {
      states[String(dayId)] = String(textState || "");
    });
  return states;
}

function stopTextStateSnapshotFromDays(days = [], Y = null) {
  const entries = [];
  (days || []).forEach((day) => {
    (day?.stops || []).forEach((stop) => {
      const textState = stop?.textYjs || stop?.noteYjs || (Y && stop?.id ? bytesToBase64(buildInitialTextUpdate(Y, stop)) : "");
      if (stop?.id && textState) entries.push([stop.id, textState]);
    });
  });
  return normalizeStopTextStateEntries(entries);
}

function dayTextStateSnapshotFromDays(days = [], Y = null) {
  const entries = [];
  (days || []).forEach((day) => {
    const textState = day?.dayTextYjs || day?.textYjs || (Y && day?.id ? bytesToBase64(buildInitialDayTextUpdate(Y, day)) : "");
    if (day?.id && textState) entries.push([day.id, textState]);
  });
  return normalizeDayTextStateEntries(entries);
}

function dayBlockTextStateSnapshotFromDays(days = [], Y = null) {
  const entries = [];
  (days || []).forEach((day) => {
    if (!day?.id) return;
    (day.blocks || []).forEach((block) => {
      const normalized = normalizeDayBlock(block);
      if (!normalized?.id) return;
      const textState = Y ? bytesToBase64(buildInitialDayBlockTextUpdate(Y, normalized, day.id)) : normalized.textYjs || "";
      if (textState) entries.push([dayBlockTextKey(day.id, normalized.id), textState]);
    });
  });
  return normalizeDayTextStateEntries(entries);
}

function dayBlockTextValueSnapshotFromDays(days = []) {
  const entries = [];
  (days || []).forEach((day) => {
    if (!day?.id) return;
    normalizeDayBlocks(day.blocks || []).forEach((block) => {
      entries.push([dayBlockTextKey(day.id, block.id), block.text || ""]);
    });
  });
  return normalizeDayTextStateEntries(entries);
}

function currentPlanRoomId() {
  return tripId ? `plan:${tripId}` : "";
}

function pendingPlanUpdatesKey(id = tripId) {
  return id ? `${PENDING_PLAN_UPDATES_PREFIX}${id}` : "";
}

function pendingPlanUpdates(id = tripId) {
  const key = pendingPlanUpdatesKey(id);
  if (!key) return [];
  return (safeJsonParse(localStorage.getItem(key), []) || [])
    .filter((entry) => entry?.update)
    .slice(-MAX_PENDING_PLAN_UPDATES);
}

function freshPendingPlanUpdatesForRemote(id = tripId) {
  const updates = pendingPlanUpdates(id);
  const remoteTime = timestampValue(lastRemoteUpdatedAt);
  if (!remoteTime || !updates.length) return updates;
  const fresh = updates.filter((entry) => {
    const entryTime = timestampValue(entry.at);
    return entryTime && entryTime > remoteTime;
  });
  if (fresh.length !== updates.length) savePendingPlanUpdates(fresh, id);
  return fresh;
}

function pendingPlanUpdateIds() {
  return new Set(pendingPlanUpdates().map((entry) => entry.id).filter(Boolean));
}

function savePendingPlanUpdates(updates = [], id = tripId) {
  const key = pendingPlanUpdatesKey(id);
  if (!key) return;
  const normalized = (updates || [])
    .filter((entry) => entry?.update)
    .slice(-MAX_PENDING_PLAN_UPDATES);
  if (normalized.length) {
    localStorage.setItem(key, JSON.stringify(normalized));
  } else {
    localStorage.removeItem(key);
  }
}

function clearPendingPlanUpdatesById(ids = new Set()) {
  if (!ids?.size) return;
  savePendingPlanUpdates(pendingPlanUpdates().filter((entry) => !ids.has(entry.id)));
}

function queuePendingPlanUpdate(updateBase64, origin = "local-plan-yjs") {
  if (!tripId || !updateBase64 || isReadonlyMode) return;
  const updates = pendingPlanUpdates();
  updates.push({
    id: uid(),
    update: updateBase64,
    origin,
    at: new Date().toISOString(),
    by: getCollabName(),
  });
  savePendingPlanUpdates(updates);
  dom.collabStatus.textContent = `网络不可用时已暂存 ${updates.length} 条计划协作更新，恢复连接后会自动同步。`;
}

async function flushPendingPlanUpdates(reason = "重试离线协作更新") {
  if (!tripId || !supabaseClient || isReadonlyMode || !canEdit() || pendingConflict) return false;
  const updates = freshPendingPlanUpdatesForRemote();
  if (!updates.length) return true;
  const replayedIds = new Set(updates.map((entry) => entry.id).filter(Boolean));
  await bindCollabPlanDoc();
  if (!collabPlanDoc) return false;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return false;
  }
  let applied = 0;
  isApplyingCollabPlanRemote = true;
  try {
    updates.forEach((entry) => {
      try {
        Y.applyUpdate(collabPlanDoc, base64ToBytes(entry.update), `pending:${entry.origin || "local"}`);
        applied += 1;
      } catch (error) {
        console.warn("Pending plan update could not be applied", error);
      }
    });
  } finally {
    isApplyingCollabPlanRemote = false;
  }
  if (!applied) return false;
  persistCurrentPlanFromDoc(`${reason}：已合并 ${applied} 条离线协作更新`);
  const pushed = await pushRemoteState(`${reason}：已同步 ${applied} 条离线协作更新`, { skipPendingFlush: true });
  if (pushed) {
    clearPendingPlanUpdatesById(replayedIds);
    if (collabTextDoc && collabTextStopId) {
      await persistCurrentTextFromDoc(`${reason}：当前地点文本协作快照已同步`);
    }
    dom.collabStatus.textContent = `${reason}：${applied} 条离线协作更新已同步到云端。`;
  }
  return pushed;
}

function normalizeTransportQuotes(quotes = []) {
  const seen = new Set();
  return (quotes || [])
    .filter(Boolean)
    .map((quote) => ({
      id: quote.id || uid(),
      dayId: quote.dayId || "",
      date: quote.date || "",
      type: quote.type === "train" ? "train" : "flight",
      code: String(quote.code || quote.flightNo || quote.trainNo || "").trim(),
      from: String(quote.from || "").trim(),
      to: String(quote.to || "").trim(),
      depart: quote.depart || quote.departTime || "--:--",
      arrive: quote.arrive || quote.arriveTime || "--:--",
      duration: Number(quote.duration || 0),
      price: numberValue(quote.price || quote.amount || quote.lowestPrice),
      source: quote.source || "手动保存",
      carrier: quote.carrier || quote.airline || "",
      stops: Number(quote.stops || 0),
      selected: Boolean(quote.selected),
      createdBy: quote.createdBy || "",
      createdAt: quote.createdAt || new Date().toISOString(),
      updatedBy: quote.updatedBy || "",
      updatedAt: quote.updatedAt || "",
    }))
    .filter((quote) => {
      if (!quote.code || !quote.price) return false;
      const key = quote.id || `${quote.date}:${quote.type}:${quote.code}:${quote.depart}:${quote.price}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 80);
}

function normalizeCandidateStops(candidates = []) {
  const seen = new Set();
  return (candidates || [])
    .filter(Boolean)
    .map((stop) => ({
      ...clone(stop),
      id: stop.id || uid(),
      title: String(stop.title || "备选地点").trim(),
      type: stop.type || "Idea",
      address: stop.address || state.destination || "地址待确认",
      note: stop.note || "备选池地点，可加入任意一天继续编辑。",
      tags: normalizeTags(stop.tags || ["备选"]),
      budget: numberValue(stop.budget),
      paid: numberValue(stop.paid),
      payer: String(stop.payer || "").trim(),
      selected: Boolean(stop.selected || stop.preselected),
      lng: String(stop.lng || "").trim(),
      lat: String(stop.lat || "").trim(),
      amapKeyword: String(stop.amapKeyword || "").trim(),
      image: stop.image || "",
      imageSource: String(stop.imageSource || "").trim(),
      imageLicense: String(stop.imageLicense || "").trim(),
      imageCreator: String(stop.imageCreator || "").trim(),
      imagePageUrl: String(stop.imagePageUrl || "").trim(),
      imageVerifiedAt: String(stop.imageVerifiedAt || "").trim(),
      imageStatus: String(stop.imageStatus || "").trim(),
      imageLookupVersion: String(stop.imageLookupVersion || "").trim(),
      imageCandidates: normalizedImageCandidateList(stop).slice(0, 8),
      referenceUrl: String(stop.referenceUrl || "").trim(),
      createdBy: stop.createdBy || "",
      createdAt: stop.createdAt || new Date().toISOString(),
      updatedBy: stop.updatedBy || "",
      updatedAt: stop.updatedAt || "",
    }))
    .filter((stop) => {
      if (!stop.title) return false;
      const key = stop.id || `${stop.title}:${stop.address}:${stop.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 80);
}

function normalizeActivities(activities = []) {
  const seen = new Set();
  return (activities || [])
    .filter(Boolean)
    .map((activity) => (typeof activity === "string" ? { text: activity } : activity))
    .map((activity) => ({
      id: activity.id || uid(),
      text: String(activity.text || "").trim(),
      type: activity.type || inferActivityType(activity.text || ""),
      target: activity.target && typeof activity.target === "object" ? clone(activity.target) : null,
      at: activity.at || new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      createdAt: activity.createdAt || new Date().toISOString(),
      createdBy: activity.createdBy || "",
    }))
    .filter((activity) => {
      if (!activity.text) return false;
      const key = activity.id || `${activity.text}:${activity.createdAt || activity.at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 20);
}

function normalizeDayBlock(block = {}) {
  if (!block) return null;
  const type = DAY_BLOCK_TYPES.includes(block.type) ? block.type : "todo";
  const text = String(block.text || block.title || "").trim();
  const comments = normalizeComments(block.comments || []);
  const level = Math.max(0, Math.min(Number(block.level) || 0, 3));
  if (!text && !block.id && !comments.length) return null;
  return {
    id: block.id || uid(),
    type,
    level,
    text,
    textYjs: block.textYjs || "",
    done: type === "divider" ? false : Boolean(block.done),
    comments,
    createdBy: block.createdBy || "",
    createdAt: block.createdAt || new Date().toISOString(),
    updatedBy: block.updatedBy || "",
    updatedAt: block.updatedAt || "",
  };
}

function normalizeDayBlocks(blocks = []) {
  const seen = new Set();
  return (blocks || [])
    .map((block) => normalizeDayBlock(block))
    .filter((block) => {
      if (!block?.id || seen.has(block.id)) return false;
      seen.add(block.id);
      return true;
    })
    .slice(0, 80);
}

function normalizeDayBlocksFromDays(days = []) {
  const lists = {};
  (days || []).forEach((day) => {
    if (!day?.id) return;
    lists[day.id] = normalizeDayBlocks(day.blocks || []);
  });
  return lists;
}

function sameDayBlockSetAndContent(a = [], b = []) {
  const first = normalizeDayBlocks(a);
  const second = normalizeDayBlocks(b);
  if (first.length !== second.length) return false;
  const secondById = new Map(second.map((block) => [block.id, block]));
  return first.every((block) => {
    const other = secondById.get(block.id);
    return other && sameSerialized(block, other);
  });
}

function dayBlockDeleteDiff(a = [], b = []) {
  const previous = normalizeDayBlocks(a);
  const next = normalizeDayBlocks(b);
  if (!previous.length || previous.length <= next.length) return null;
  const nextById = new Map(next.map((block) => [block.id, block]));
  const deletedIds = [];
  for (const block of previous) {
    const nextBlock = nextById.get(block.id);
    if (!nextBlock) {
      deletedIds.push(block.id);
      continue;
    }
    if (!sameSerialized(block, nextBlock)) return null;
  }
  return deletedIds.length ? deletedIds : null;
}

function dayBlockInsertDiff(a = [], b = []) {
  const previous = normalizeDayBlocks(a);
  const next = normalizeDayBlocks(b);
  if (next.length <= previous.length) return null;
  const previousById = new Map(previous.map((block) => [block.id, block]));
  const insertedIds = [];
  for (const block of next) {
    const previousBlock = previousById.get(block.id);
    if (!previousBlock) {
      insertedIds.push(block.id);
      continue;
    }
    if (!sameSerialized(block, previousBlock)) return null;
  }
  return insertedIds.length ? insertedIds : null;
}

function moveDayBlockList(blocks = [], blockId = "", direction = "down", patch = {}) {
  const normalized = normalizeDayBlocks(blocks);
  const index = normalized.findIndex((block) => block.id === blockId);
  const offset = direction === "up" ? -1 : 1;
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= normalized.length) return normalized;
  const nextBlocks = [...normalized];
  const [moved] = nextBlocks.splice(index, 1);
  nextBlocks.splice(targetIndex, 0, normalizeDayBlock({ ...moved, ...patch, id: moved.id }) || moved);
  return normalizeDayBlocks(nextBlocks);
}

function reorderDayBlockList(blocks = [], blockId = "", targetIndex = 0, patch = {}) {
  const normalized = normalizeDayBlocks(blocks);
  const index = normalized.findIndex((block) => block.id === blockId);
  if (index < 0) return normalized;
  const boundedIndex = Math.max(0, Math.min(Number(targetIndex) || 0, normalized.length - 1));
  if (index === boundedIndex) return normalized;
  const nextBlocks = [...normalized];
  const [moved] = nextBlocks.splice(index, 1);
  nextBlocks.splice(boundedIndex, 0, normalizeDayBlock({ ...moved, ...patch, id: moved.id }) || moved);
  return normalizeDayBlocks(nextBlocks);
}

function insertDayBlockList(blocks = [], block = {}, targetIndex = null) {
  const normalized = normalizeDayBlocks(blocks);
  const normalizedBlock = normalizeDayBlock(block);
  if (!normalizedBlock || normalized.some((item) => item.id === normalizedBlock.id)) return normalized;
  const insertIndex = targetIndex === null || targetIndex === undefined
    ? normalized.length
    : Math.max(0, Math.min(Number(targetIndex) || 0, normalized.length));
  const nextBlocks = [...normalized];
  nextBlocks.splice(insertIndex, 0, normalizedBlock);
  return normalizeDayBlocks(nextBlocks);
}

function normalizeDayMetas(days = []) {
  const seen = new Set();
  return (days || [])
    .filter(Boolean)
    .map((day, index) => ({
      id: day.id || uid(),
      label: day.label || `D${index + 1}`,
      date: day.date || "",
      title: day.title || day.label || `第${index + 1}天`,
      route: day.route || "待填写路线",
      weather: day.weather || "天气待确认",
      transport: day.transport || "交通待规划",
      comments: normalizeComments(day.comments || []),
      amapRoute: day.amapRoute || null,
    }))
    .filter((day) => {
      if (seen.has(day.id)) return false;
      seen.add(day.id);
      return true;
    })
    .slice(0, 30);
}

function buildInitialPlanUpdate(Y, plan) {
  const seedDoc = new Y.Doc();
  seedDoc.clientID = stableTextClientId(`${tripId}:plan`);
  const dayArray = seedDoc.getArray("dayMetas");
  const dayMetas = normalizeDayMetas(plan.days || []);
  if (dayMetas.length) dayArray.insert(0, dayMetas);
  const dayTextStatesMap = seedDoc.getMap("dayTextStates");
  Object.entries(dayTextStateSnapshotFromDays(plan.days || [], Y)).forEach(([dayId, textState]) => {
    dayTextStatesMap.set(dayId, textState);
  });
  const dayBlockTextStatesMap = seedDoc.getMap("dayBlockTextStates");
  Object.entries(dayBlockTextStateSnapshotFromDays(plan.days || [], Y)).forEach(([blockKey, textState]) => {
    dayBlockTextStatesMap.set(blockKey, textState);
  });
  const dayBlockTextsMap = seedDoc.getMap("dayBlockTexts");
  Object.entries(dayBlockTextValueSnapshotFromDays(plan.days || [])).forEach(([blockKey, text]) => {
    const yText = new Y.Text();
    if (text) yText.insert(0, text);
    dayBlockTextsMap.set(blockKey, yText);
  });
  const stopListsMap = seedDoc.getMap("stopLists");
  (plan.days || []).forEach((day) => {
    if (!day?.id) return;
    const stopArray = new Y.Array();
    const stops = normalizeStopListsFromDays([day])[day.id] || [];
    if (stops.length) stopArray.insert(0, stops);
    stopListsMap.set(day.id, stopArray);
  });
  const stopTextStatesMap = seedDoc.getMap("stopTextStates");
  Object.entries(stopTextStateSnapshotFromDays(plan.days || [], Y)).forEach(([stopId, textState]) => {
    stopTextStatesMap.set(stopId, textState);
  });
  const dayBlocksMap = seedDoc.getMap("dayBlocks");
  (plan.days || []).forEach((day) => {
    if (!day?.id) return;
    const blockArray = new Y.Array();
    const blocks = normalizeDayBlocks(day.blocks || []);
    if (blocks.length) blockArray.insert(0, blocks);
    dayBlocksMap.set(day.id, blockArray);
  });
  const quoteArray = seedDoc.getArray("transportQuotes");
  const quotes = normalizeTransportQuotes(plan.transportQuotes || []);
  if (quotes.length) quoteArray.insert(0, quotes);
  const candidateArray = seedDoc.getArray("candidates");
  const candidates = normalizeCandidateStops(plan.candidates || []);
  if (candidates.length) candidateArray.insert(0, candidates);
  const activityArray = seedDoc.getArray("activities");
  const activities = normalizeActivities(plan.activities || []);
  if (activities.length) activityArray.insert(0, activities);
  const settingsMap = seedDoc.getMap("settings");
  PLAN_SETTING_FIELDS.forEach((meta) => {
    settingsMap.set(meta.field, planSettingValue(plan, meta));
  });
  const settingTextStatesMap = seedDoc.getMap("settingTextStates");
  Object.entries(settingTextStateSnapshotFromPlan(plan, Y)).forEach(([field, textState]) => {
    settingTextStatesMap.set(field, textState);
  });
  const settingTextsMap = seedDoc.getMap("settingTexts");
  Object.entries(settingTextValueSnapshotFromPlan(plan)).forEach(([field, textValue]) => {
    const yText = new Y.Text();
    if (textValue) yText.insert(0, textValue);
    settingTextsMap.set(field, yText);
  });
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

async function persistCurrentTextFromDoc(label = "地点协作内容已实时同步", options = {}) {
  const { refreshViews = true, scheduleSave = true, updateStatus = true } = options;
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
  await syncStopSnapshotToPlanDoc(stop.id, "local-stop-detail-snapshot");
  applyStopRealtimeFields(stop);
  persistLocalState();
  if (updateStatus) setNoteCollabStatus(label);
  if (refreshViews && (textChanged || structChanged || commentsChanged)) refreshRealtimeStopViews();
  if (!scheduleSave) return;
  clearTimeout(collabTextSaveTimer);
  collabTextSaveTimer = setTimeout(() => {
    if (!canEdit() || !supabaseClient || !tripId || pendingConflict) return;
    pushRemoteState("地点协作内容已实时同步").then((pushed) => {
      if (pushed) return;
      const pendingCount = pendingPlanUpdates().length;
      if (pendingCount) {
        setNoteCollabStatus(`文本协作已暂存 ${pendingCount} 条结构更新，恢复网络后会自动同步`);
      }
    });
  }, 900);
}

async function persistCurrentDayTextFromDoc(label = "当天文本协作内容已实时同步", options = {}) {
  const { refreshViews = true, scheduleSave = true, updateStatus = true } = options;
  if (!collabDayTextDoc || !collabDayTextDayId) return;
  const day = state.days.find((item) => item.id === collabDayTextDayId);
  if (!day) return;
  const nextValues = dayTextValuesFromDoc();
  const nextComments = readDayCommentsFromDoc();
  const nextYjs = yjsModule ? bytesToBase64(yjsModule.encodeStateAsUpdate(collabDayTextDoc)) : day.textYjs || day.dayTextYjs || "";
  const textChanged = COLLAB_DAY_TEXT_FIELDS.some(({ docField }) => day[docField] !== nextValues[docField]);
  const commentsChanged = !sameSerialized(normalizeComments(day.comments || []), nextComments);
  const yjsChanged = day.textYjs !== nextYjs || day.dayTextYjs !== nextYjs;
  if (!textChanged && !commentsChanged && !yjsChanged) return;
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
    day[docField] = nextValues[docField];
  });
  day.comments = nextComments;
  day.textYjs = nextYjs;
  day.dayTextYjs = nextYjs;
  if (collabPlanDoc && !isApplyingCollabPlanRemote && (collabDayTextStatesMap || collabDayMetasArray)) {
    const planOrigin = isApplyingCollabDayTextRemote ? "remote" : "local-day-text-state";
    collabPlanDoc?.transact(() => {
      if (collabDayTextStatesMap && collabDayTextStatesMap.get(day.id) !== nextYjs) {
        collabDayTextStatesMap.set(day.id, nextYjs);
      }
      if (collabDayMetasArray) {
        const latestItems = collabDayMetasArray.toArray();
        const latestIndex = latestItems.findIndex((item) => item?.id === day.id);
        if (latestIndex >= 0) {
          const latest = normalizeDayMetas([latestItems[latestIndex]])[0];
          const merged = normalizeDayMetas([{
            ...latest,
            id: day.id,
            label: latest.label || day.label,
            ...nextValues,
            comments: nextComments,
          }])[0];
          if (!sameSerialized(latest, merged)) {
            collabDayMetasArray.delete(latestIndex, 1);
            collabDayMetasArray.insert(latestIndex, [merged]);
          }
        }
      }
    }, planOrigin);
  } else {
    patchDayMetaInDoc(day.id, nextValues, "local-day-text-meta-patch").catch((error) => {
      console.warn("Day text meta patch failed", error);
    });
  }
  persistLocalState();
  if (collabDayTextDayId === day.id) {
    COLLAB_DAY_TEXT_FIELDS.forEach(({ docField, domKey }) => {
      if (dom[domKey] && dom[domKey].value !== nextValues[docField]) dom[domKey].value = nextValues[docField];
    });
  }
  if (updateStatus) {
    dom.dayEditorStatus.textContent = tripId ? "逐字协作中" : "本地保存";
    dom.collabStatus.textContent = label;
  }
  if (refreshViews && (textChanged || commentsChanged)) {
    renderShell();
    renderDays();
    renderDaySummary();
    renderDayComments(day);
    renderAmapRouteReport(currentDay()?.amapRoute || null);
    refreshIcons();
  }
  if (!scheduleSave) return;
  clearTimeout(collabDayTextSaveTimer);
  collabDayTextSaveTimer = setTimeout(() => {
    if (!canEdit() || !supabaseClient || !tripId || pendingConflict) return;
    saveCollaborativePlanChange("当天文本协作内容已实时同步");
  }, 900);
}

function readTransportQuotesFromDoc() {
  return normalizeTransportQuotes(collabTransportQuotesArray ? collabTransportQuotesArray.toArray() : state.transportQuotes || []);
}

function readDayMetasFromDoc() {
  return normalizeDayMetas(collabDayMetasArray ? collabDayMetasArray.toArray() : state.days || []);
}

function readStopListsFromDoc() {
  if (!collabStopListsMap) return normalizeStopListsFromDays(state.days || []);
  const lists = {};
  const dayIds = new Set([
    ...(state.days || []).map((day) => day.id).filter(Boolean),
    ...Array.from(collabStopListsMap.keys()),
  ]);
  dayIds.forEach((dayId) => {
    const fallbackDay = state.days.find((day) => day.id === dayId);
    const stopArray = collabStopListsMap.get(dayId);
    lists[dayId] = stopArray && typeof stopArray.toArray === "function" ? stopArray.toArray().map((stop) => normalizeCollaborativeStop(stop)) : normalizeStopListsFromDays([fallbackDay])[dayId] || [];
  });
  return sanitizeStopListsForPlan(lists, state);
}

function readStopTextStatesFromDoc() {
  if (!collabStopTextStatesMap) return stopTextStateSnapshotFromDays(state.days || [], yjsModule);
  return normalizeStopTextStateEntries(Array.from(collabStopTextStatesMap.entries()));
}

function readDayTextStatesFromDoc() {
  if (!collabDayTextStatesMap) return dayTextStateSnapshotFromDays(state.days || [], yjsModule);
  return normalizeDayTextStateEntries(Array.from(collabDayTextStatesMap.entries()));
}

function readDayBlockTextStatesFromDoc() {
  if (!collabDayBlockTextStatesMap) return dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule);
  return normalizeDayTextStateEntries(Array.from(collabDayBlockTextStatesMap.entries()));
}

function readDayBlockTextValuesFromDoc() {
  if (!collabDayBlockTextsMap) return dayBlockTextValueSnapshotFromDays(state.days || []);
  const entries = Array.from(collabDayBlockTextsMap.entries())
    .filter(([blockKey, yText]) => blockKey && yText?.toString)
    .map(([blockKey, yText]) => [blockKey, yText.toString()]);
  return normalizeDayTextStateEntries(entries);
}

function readDayBlocksFromDoc() {
  const fallback = normalizeDayBlocksFromDays(state.days || []);
  if (!collabDayBlocksMap) return fallback;
  const lists = {};
  const dayIds = new Set([
    ...(state.days || []).map((day) => day.id).filter(Boolean),
    ...Array.from(collabDayBlocksMap.keys()),
  ]);
  dayIds.forEach((dayId) => {
    const blockArray = collabDayBlocksMap.get(dayId);
    lists[dayId] = blockArray && typeof blockArray.toArray === "function" ? normalizeDayBlocks(blockArray.toArray()) : fallback[dayId] || [];
  });
  return lists;
}

function readCandidatesFromDoc() {
  return sanitizedCandidatesForPlan(collabCandidatesArray ? collabCandidatesArray.toArray() : state.candidates || [], state);
}

function mergedTransportQuotesWithPatch(mode, quote = null, quoteId = "") {
  const latest = readTransportQuotesFromDoc();
  if (mode === "delete") return latest.filter((item) => item.id !== quoteId);
  if (mode === "update") {
    const targetId = quoteId || quote?.id || "";
    let found = false;
    const updated = latest.map((item) => {
      if (item.id !== targetId) return item;
      found = true;
      return normalizeTransportQuotes([{ ...item, ...quote, id: item.id }])[0];
    });
    const inserted = found ? updated : [normalizeTransportQuotes([{ ...quote, id: targetId || quote?.id || uid() }])[0], ...updated];
    return normalizeTransportQuotes(inserted).slice(0, 80);
  }
  const normalized = normalizeTransportQuotes([quote])[0];
  if (!normalized) return latest;
  const existingIds = new Set(latest.map((item) => item.id));
  const existingKeys = new Set(latest.map(transportOptionIdentity));
  if (existingIds.has(normalized.id) || existingKeys.has(transportOptionIdentity(normalized))) return latest;
  return normalizeTransportQuotes([normalized, ...latest]).slice(0, 80);
}

function mergedCandidatesWithPatch(mode, candidate = null, candidateId = "") {
  const latest = readCandidatesFromDoc();
  if (mode === "delete") return latest.filter((item) => item.id !== candidateId);
  if (mode === "update") {
    const targetId = candidateId || candidate?.id || "";
    let found = false;
    const updated = latest.map((item) => {
      if (item.id !== targetId) return item;
      found = true;
      return normalizeCandidateStops([{ ...item, ...candidate, id: item.id }])[0];
    });
    const inserted = found ? updated : [normalizeCandidateStops([{ ...candidate, id: targetId || candidate?.id || uid() }])[0], ...updated];
    return normalizeCandidateStops(inserted).slice(0, 80);
  }
  const normalized = normalizeCandidateStops([candidate])[0];
  if (!normalized) return latest;
  const existingIds = new Set(latest.map((item) => item.id));
  if (existingIds.has(normalized.id)) return latest;
  return normalizeCandidateStops([normalized, ...latest]).slice(0, 80);
}

function readActivitiesFromDoc() {
  return normalizeActivities(collabActivitiesArray ? collabActivitiesArray.toArray() : state.activities || []);
}

function readSettingsFromDoc() {
  const values = {};
  PLAN_SETTING_FIELDS.forEach((meta) => {
    const textValue = PLAN_TEXT_SETTING_FIELDS.includes(meta.field) ? collabSettingTextsMap?.get(meta.field)?.toString() : null;
    const value = textValue !== null && textValue !== undefined ? textValue : collabSettingsMap?.has(meta.field) ? collabSettingsMap.get(meta.field) : state[meta.field];
    values[meta.field] = normalizePlanSettingValue(meta.field, value);
  });
  values.partySize = Math.max(1, Number.parseInt(values.partySize || state.partySize || 1, 10) || 1);
  values.budgetLimit = numberValue(values.budgetLimit || state.budgetLimit || 10000);
  if (!values.dateRange && values.startDate && values.endDate) values.dateRange = dateRangeText(values.startDate, values.endDate);
  return values;
}

function readSettingTextStatesFromDoc() {
  if (!collabSettingTextStatesMap) return settingTextStateSnapshotFromPlan(state, yjsModule);
  return Object.fromEntries(PLAN_TEXT_SETTING_FIELDS.map((field) => [field, collabSettingTextStatesMap.get(field) || ""]));
}

function readSettingTextValuesFromDoc() {
  if (!collabSettingTextsMap) return settingTextValueSnapshotFromPlan(state);
  return Object.fromEntries(PLAN_TEXT_SETTING_FIELDS.map((field) => [field, collabSettingTextsMap.get(field)?.toString() || ""]));
}

function applyDayMetasToState(dayMetas = []) {
  const metas = normalizeDayMetas(dayMetas);
  const byExistingId = new Map((state.days || []).map((day) => [day.id, day]).filter(([id]) => id));
  const previousOrder = (state.days || []).map((day) => day.id);
  let changed = false;
  const nextDays = metas.map((meta) => {
    const day = byExistingId.get(meta.id) || {
      id: meta.id,
      label: meta.label,
      date: meta.date,
      title: meta.title,
      route: meta.route,
      weather: meta.weather,
      transport: meta.transport,
      amapRoute: meta.amapRoute || null,
      stops: [],
    };
    ["label", "date", "title", "route", "weather", "transport", "comments", "amapRoute"].forEach((field) => {
      if (!sameSerialized(day[field], meta[field])) {
        day[field] = clone(meta[field]);
        changed = true;
      }
    });
    return day;
  });
  if (nextDays.length && !sameSerialized(previousOrder, nextDays.map((day) => day.id))) {
    state.days = nextDays;
    changed = true;
  }
  if (changed) resequencePlanDays();
  return changed;
}

function applyStopListsToState(stopLists = {}) {
  let changed = false;
  const activeDayId = currentDay()?.id || "";
  const activeStopId = currentStop()?.id || "";
  state.days.forEach((day) => {
    const incoming = Array.isArray(stopLists[day.id]) ? stopLists[day.id].map((stop) => normalizeCollaborativeStop(stop)) : null;
    if (!incoming) return;
    const byExistingId = new Map((day.stops || []).map((stop) => [stop.id, stop]).filter(([id]) => id));
    const nextStops = incoming.map((remoteStop) => {
      const existing = byExistingId.get(remoteStop.id);
      if (!existing) return remoteStop;
      return {
        ...existing,
        ...remoteStop,
        id: remoteStop.id,
        textYjs: remoteStop.textYjs || existing.textYjs || "",
        noteYjs: remoteStop.noteYjs || remoteStop.textYjs || existing.noteYjs || existing.textYjs || "",
      };
    });
    if (!sameSerialized((day.stops || []).map((stop) => stop.id), nextStops.map((stop) => stop.id))) {
      changed = true;
    }
    if (!sameSerialized(normalizeStopListsFromDays([{ ...day, stops: day.stops || [] }])[day.id] || [], normalizeStopListsFromDays([{ ...day, stops: nextStops }])[day.id] || [])) {
      changed = true;
    }
    day.stops = nextStops.length ? nextStops : day.stops || [];
  });
  if (activeDayId) {
    const nextDayIndex = state.days.findIndex((day) => day.id === activeDayId);
    if (nextDayIndex >= 0) activeDay = nextDayIndex;
  }
  if (activeStopId && currentDay()?.stops?.length) {
    const nextStopIndex = currentDay().stops.findIndex((stop) => stop.id === activeStopId);
    activeStop = nextStopIndex >= 0 ? nextStopIndex : Math.min(activeStop, currentDay().stops.length - 1);
  } else {
    activeStop = Math.min(activeStop, currentDay()?.stops?.length - 1 || 0);
  }
  return changed;
}

function applyStopTextStatesToState(textStates = {}) {
  let changed = false;
  state.days.forEach((day) => {
    (day.stops || []).forEach((stop) => {
      const textState = textStates[stop.id];
      if (!textState || stop.textYjs === textState) return;
      stop.textYjs = textState;
      stop.noteYjs = textState;
      changed = true;
    });
  });
  return changed;
}

function applyDayTextStatesToState(textStates = {}) {
  let changed = false;
  state.days.forEach((day) => {
    const textState = textStates[day.id];
    if (!textState) return;
    if (day.textYjs !== textState || day.dayTextYjs !== textState) {
      day.textYjs = textState;
      day.dayTextYjs = textState;
      changed = true;
    }
    const nextValues = dayValuesFromTextState(textState, day);
    COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
      if (day[docField] !== nextValues[docField]) {
        day[docField] = nextValues[docField];
        changed = true;
      }
    });
  });
  return changed;
}

function dayBlockTextFromState(textState = "", fallback = "") {
  if (!textState || !yjsModule) return String(fallback || "");
  const tempDoc = new yjsModule.Doc();
  try {
    yjsModule.applyUpdate(tempDoc, base64ToBytes(textState), "read");
    return tempDoc.getText("text").toString();
  } catch (error) {
    console.warn("Stored day block Yjs text state could not be read", error);
    return String(fallback || "");
  } finally {
    tempDoc.destroy();
  }
}

function applyDayBlockTextStatesToState(textStates = {}) {
  let changed = false;
  state.days.forEach((day) => {
    if (!day?.id || !day.blocks?.length) return;
    day.blocks = normalizeDayBlocks(day.blocks.map((block) => {
      const textState = textStates[dayBlockTextKey(day.id, block.id)];
      if (!textState || block.textYjs === textState) return block;
      changed = true;
      return {
        ...block,
        text: dayBlockTextFromState(textState, block.text) || block.text,
        textYjs: textState,
      };
    }));
  });
  return changed;
}

function applyDayBlockTextValuesToState(textValues = {}) {
  let changed = false;
  state.days.forEach((day) => {
    if (!day?.id || !day.blocks?.length) return;
    day.blocks = normalizeDayBlocks(day.blocks.map((block) => {
      const key = dayBlockTextKey(day.id, block.id);
      if (!Object.prototype.hasOwnProperty.call(textValues, key) || block.text === textValues[key]) return block;
      changed = true;
      return { ...block, text: textValues[key] || block.text };
    }));
  });
  return changed;
}

function applyDayBlocksToState(dayBlocks = {}) {
  let changed = false;
  state.days.forEach((day) => {
    const nextBlocks = normalizeDayBlocks(dayBlocks[day.id] || []);
    if (!sameSerialized(normalizeDayBlocks(day.blocks || []), nextBlocks)) {
      day.blocks = nextBlocks;
      changed = true;
    }
  });
  return changed;
}

function stopListOrderSnapshot(stopLists = {}) {
  const snapshot = {};
  Object.entries(stopLists || {}).forEach(([dayId, stops]) => {
    snapshot[dayId] = (stops || []).map((stop) => stop.id).filter(Boolean);
  });
  return snapshot;
}

function sanitizeStopListsForPlan(stopLists = {}, plan = state) {
  const repairedPlan = repairPlanStructure({
    ...clone(plan || {}),
    days: (plan?.days || []).map((day) => ({
      ...day,
      stops: Array.isArray(stopLists?.[day.id]) ? clone(stopLists[day.id]) : clone(day.stops || []),
    })),
  });
  return normalizeStopListsFromDays(repairedPlan.days || []);
}

function sanitizedCandidatesForPlan(candidates = [], plan = state) {
  const repairedPlan = repairPlanStructure({
    ...clone(plan || {}),
    candidates: clone(candidates || []),
  });
  return normalizeCandidateStops(repairedPlan.candidates || []);
}

function refreshRealtimePlanViews() {
  renderShell();
  renderDays();
  renderDaySummary();
  renderTimeline();
  renderMap();
  renderDayEditor();
  renderDayComments(currentDay());
  renderDayBlocks(currentDay());
  renderTransport();
  renderCandidates();
  renderStayFoodBoards();
  renderActivities();
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
}

function persistCurrentPlanFromDoc(label = "计划结构协作内容已实时同步", options = {}) {
  const { refreshViews = true, scheduleSave = true, updateStatus = true } = options;
  if (!collabPlanDoc || !collabDayMetasArray || !collabDayTextStatesMap || !collabDayBlockTextStatesMap || !collabDayBlockTextsMap || !collabStopListsMap || !collabStopTextStatesMap || !collabDayBlocksMap || !collabTransportQuotesArray || !collabCandidatesArray || !collabActivitiesArray || !collabSettingsMap || !collabSettingTextStatesMap || !collabSettingTextsMap) return;
  const nextDayMetas = readDayMetasFromDoc();
  const nextDayTextStates = readDayTextStatesFromDoc();
  const nextDayBlockTextStates = readDayBlockTextStatesFromDoc();
  const nextDayBlockTextValues = readDayBlockTextValuesFromDoc();
  const nextSettingTextStates = readSettingTextStatesFromDoc();
  const nextSettingTextValues = readSettingTextValuesFromDoc();
  const nextStopLists = readStopListsFromDoc();
  const nextStopTextStates = readStopTextStatesFromDoc();
  const nextDayBlocks = readDayBlocksFromDoc();
  const nextQuotes = readTransportQuotesFromDoc();
  const nextCandidates = readCandidatesFromDoc();
  const nextActivities = readActivitiesFromDoc();
  const nextSettings = readSettingsFromDoc();
  const dayMetasChanged = !sameSerialized(normalizeDayMetas(state.days || []), nextDayMetas);
  const dayTextStatesChanged = !sameSerialized(dayTextStateSnapshotFromDays(state.days || [], yjsModule), nextDayTextStates);
  const dayBlockTextStatesChanged = !sameSerialized(dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule), nextDayBlockTextStates);
  const dayBlockTextValuesChanged = !sameSerialized(dayBlockTextValueSnapshotFromDays(state.days || []), nextDayBlockTextValues);
  const settingTextStatesChanged = !sameSerialized(settingTextStateSnapshotFromPlan(state, yjsModule), nextSettingTextStates);
  const settingTextValuesChanged = !sameSerialized(settingTextValueSnapshotFromPlan(state), nextSettingTextValues);
  const stopListsChanged = !sameSerialized(normalizeStopListsFromDays(state.days || []), nextStopLists);
  const stopTextStatesChanged = !sameSerialized(stopTextStateSnapshotFromDays(state.days || [], yjsModule), nextStopTextStates);
  const dayBlocksChanged = !sameSerialized(normalizeDayBlocksFromDays(state.days || []), nextDayBlocks);
  const quotesChanged = !sameSerialized(normalizeTransportQuotes(state.transportQuotes || []), nextQuotes);
  const candidatesChanged = !sameSerialized(normalizeCandidateStops(state.candidates || []), nextCandidates);
  const activitiesChanged = !sameSerialized(normalizeActivities(state.activities || []), nextActivities);
  const settingsChanged = PLAN_SETTING_FIELDS.some((meta) => !sameSerialized(planSettingValue(state, meta), nextSettings[meta.field]));
  const nextPlanYjs = currentPlanYjsState();
  const planYjsChanged = Boolean(nextPlanYjs && state.planYjs !== nextPlanYjs);
  const changed = dayMetasChanged || dayTextStatesChanged || dayBlockTextStatesChanged || dayBlockTextValuesChanged || settingTextStatesChanged || settingTextValuesChanged || stopListsChanged || stopTextStatesChanged || dayBlocksChanged || quotesChanged || candidatesChanged || activitiesChanged || settingsChanged || planYjsChanged;
  if (!changed) return;
  const visibleChanged = dayMetasChanged || dayTextStatesChanged || dayBlockTextStatesChanged || dayBlockTextValuesChanged || settingTextValuesChanged || stopListsChanged || dayBlocksChanged || quotesChanged || candidatesChanged || activitiesChanged || settingsChanged;
  const currentDayId = currentDay()?.id || "";
  const changedDayBlockKeys = new Set();
  const changedDayBlockTextKeys = new Set();
  const changedDayBlockCommentKeys = new Set();
  const changedDayBlockOrderKeys = new Set();
  const changedDayBlockDeleteKeys = new Map();
  const changedDayBlockInsertKeys = new Map();
  if (dayBlocksChanged) {
    const currentBlocks = normalizeDayBlocksFromDays(state.days || []);
    const nextBlocksByDay = nextDayBlocks || {};
    [...new Set([...Object.keys(currentBlocks), ...Object.keys(nextBlocksByDay)])].forEach((dayId) => {
      const currentDayBlocks = currentBlocks[dayId] || [];
      const nextDayBlocksForDay = nextBlocksByDay[dayId] || [];
      if (!sameSerialized(currentDayBlocks, nextDayBlocksForDay)) {
        changedDayBlockKeys.add(dayId);
        if (sameDayBlockSetAndContent(currentDayBlocks, nextDayBlocksForDay)) changedDayBlockOrderKeys.add(dayId);
        const deletedIds = dayBlockDeleteDiff(currentDayBlocks, nextDayBlocksForDay);
        if (deletedIds?.length) changedDayBlockDeleteKeys.set(dayId, deletedIds);
        const insertedIds = dayBlockInsertDiff(currentDayBlocks, nextDayBlocksForDay);
        if (insertedIds?.length) changedDayBlockInsertKeys.set(dayId, insertedIds);
      }
      const currentById = new Map(currentDayBlocks.map((block) => [block.id, block]));
      nextDayBlocksForDay.forEach((nextBlock) => {
        const currentBlock = currentById.get(nextBlock.id);
        if (!currentBlock) return;
        const currentWithoutComments = { ...currentBlock, comments: [] };
        const nextWithoutComments = { ...nextBlock, comments: [] };
        if (sameSerialized(currentWithoutComments, nextWithoutComments) && !sameSerialized(normalizeComments(currentBlock.comments || []), normalizeComments(nextBlock.comments || []))) {
          changedDayBlockCommentKeys.add(`${dayId}:${nextBlock.id}`);
        }
      });
    });
  }
  if (dayBlockTextStatesChanged || dayBlockTextValuesChanged) {
    const currentTextStates = dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule);
    const currentTextValues = dayBlockTextValueSnapshotFromDays(state.days || []);
    [...new Set([...Object.keys(currentTextStates), ...Object.keys(nextDayBlockTextStates), ...Object.keys(currentTextValues), ...Object.keys(nextDayBlockTextValues)])].forEach((key) => {
      if (currentTextStates[key] !== nextDayBlockTextStates[key] || currentTextValues[key] !== nextDayBlockTextValues[key]) {
        const [dayId, blockId] = String(key).split(":");
        if (dayId) changedDayBlockKeys.add(dayId);
        if (dayId && blockId) changedDayBlockTextKeys.add(`${dayId}:${blockId}`);
      }
    });
  }
  const dayBlockOnlyVisibleChange = visibleChanged && !dayMetasChanged && !dayTextStatesChanged && !settingTextValuesChanged && !stopListsChanged && !quotesChanged && !candidatesChanged && !activitiesChanged && !settingsChanged && !stopTextStatesChanged && (dayBlockTextStatesChanged || dayBlockTextValuesChanged || dayBlocksChanged);
  const currentDayBlockChanged = Boolean(currentDayId && changedDayBlockKeys.has(currentDayId));
  const currentDayChangedTextBlockIds = [...changedDayBlockTextKeys]
    .map((key) => key.split(":"))
    .filter(([dayId, blockId]) => dayId === currentDayId && blockId)
    .map(([, blockId]) => blockId);
  const currentDayChangedCommentBlockIds = [...changedDayBlockCommentKeys]
    .map((key) => key.split(":"))
    .filter(([dayId, blockId]) => dayId === currentDayId && blockId)
    .map(([, blockId]) => blockId);
  if (dayMetasChanged) applyDayMetasToState(nextDayMetas);
  if (dayTextStatesChanged) applyDayTextStatesToState(nextDayTextStates);
  if (stopListsChanged) applyStopListsToState(nextStopLists);
  if (stopTextStatesChanged) applyStopTextStatesToState(nextStopTextStates);
  if (dayBlocksChanged) applyDayBlocksToState(nextDayBlocks);
  if (dayBlockTextStatesChanged) applyDayBlockTextStatesToState(nextDayBlockTextStates);
  if (dayBlockTextValuesChanged) applyDayBlockTextValuesToState(nextDayBlockTextValues);
  state.transportQuotes = nextQuotes;
  state.candidates = nextCandidates;
  state.activities = nextActivities;
  if (nextPlanYjs) state.planYjs = nextPlanYjs;
  PLAN_SETTING_FIELDS.forEach((meta) => {
    state[meta.field] = clone(nextSettings[meta.field]);
  });
  PLAN_TEXT_SETTING_FIELDS.forEach((field) => {
    state[`${field}Yjs`] = nextSettingTextStates[field] || "";
  });
  if (!state.dateRange && state.startDate && state.endDate) state.dateRange = dateRangeText(state.startDate, state.endDate);
  repairPlanStructure(state);
  syncGuideStateFromPlan();
  persistLocalState();
  if (updateStatus) dom.collabStatus.textContent = label;
  if (refreshViews && visibleChanged) {
    if (dayBlockOnlyVisibleChange && currentDayBlockChanged) {
      const textOnlyCurrentDayChange = !dayBlocksChanged && currentDayChangedTextBlockIds.length > 0;
      const commentsOnlyCurrentDayChange = dayBlocksChanged && currentDayChangedCommentBlockIds.length > 0 && changedDayBlockKeys.size === 1 && changedDayBlockKeys.has(currentDayId) && currentDayChangedCommentBlockIds.length === changedDayBlockCommentKeys.size && !dayBlockTextStatesChanged && !dayBlockTextValuesChanged;
      const orderOnlyCurrentDayChange = dayBlocksChanged && changedDayBlockKeys.size === 1 && changedDayBlockOrderKeys.has(currentDayId) && !dayBlockTextStatesChanged && !dayBlockTextValuesChanged;
      const deleteOnlyCurrentDayChange = dayBlocksChanged && changedDayBlockKeys.size === 1 && changedDayBlockDeleteKeys.has(currentDayId) && !dayBlockTextStatesChanged && !dayBlockTextValuesChanged;
      const insertOnlyCurrentDayChange = dayBlocksChanged && changedDayBlockKeys.size === 1 && changedDayBlockInsertKeys.has(currentDayId) && !dayBlockTextStatesChanged && !dayBlockTextValuesChanged;
      if (textOnlyCurrentDayChange && refreshDayBlockTextDom(currentDay(), currentDayChangedTextBlockIds)) {
        // Text-only update handled without rebuilding the block list.
      } else if (commentsOnlyCurrentDayChange && currentDayChangedCommentBlockIds.every((blockId) => refreshDayBlockCommentsDom(currentDay(), blockId))) {
        // Comment-only update handled without rebuilding the block list.
      } else if (orderOnlyCurrentDayChange && refreshDayBlockOrderDom(currentDay())) {
        // Order-only update handled by moving existing block nodes.
      } else if (deleteOnlyCurrentDayChange && refreshDayBlockDeleteDom(currentDay(), changedDayBlockDeleteKeys.get(currentDayId))) {
        // Delete-only update handled by removing affected block nodes.
      } else if (insertOnlyCurrentDayChange && refreshDayBlockInsertDom(currentDay(), changedDayBlockInsertKeys.get(currentDayId))) {
        // Insert-only update handled by inserting new block nodes.
      } else {
        renderDayBlocks(currentDay());
      }
    } else if (dayBlockOnlyVisibleChange) {
      requestAnimationFrame(() => refreshDayBlockTextPresence());
    } else {
      refreshRealtimePlanViews();
    }
  }
  if (!scheduleSave) return;
  clearTimeout(collabPlanSaveTimer);
  collabPlanSaveTimer = setTimeout(() => {
    if (!canEdit() || !supabaseClient || !tripId || pendingConflict) return;
    pushRemoteState("计划结构协作内容已实时同步");
  }, 900);
}

async function saveCollaborativePlanChange(label = "计划结构协作内容已实时同步") {
  clearTimeout(collabPlanSaveTimer);
  collabPlanSaveTimer = null;
  await saveState(label);
}

function scheduleCollaborativePlanSave(label = "计划结构协作内容已实时同步", delay = 900) {
  clearTimeout(collabPlanSaveTimer);
  collabPlanSaveTimer = setTimeout(() => {
    if (!canEdit() || !supabaseClient || !tripId || pendingConflict) return;
    pushRemoteState(label);
  }, Math.max(0, Number(delay) || 0));
}

async function saveCollaborativeTextChange(label = "地点协作内容已实时同步") {
  clearTimeout(collabTextSaveTimer);
  collabTextSaveTimer = null;
  clearTimeout(collabPlanSaveTimer);
  collabPlanSaveTimer = null;
  if (collabTextDoc && collabTextStopId) {
    await persistCurrentTextFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  }
  if (collabDayTextDoc && collabDayTextDayId) {
    await persistCurrentDayTextFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  }
  await saveState(label);
}

async function refreshLiveCollabStateBeforeRemoteSave(label = "保存前已刷新协作快照") {
  if (!tripId || isReadonlyMode) return;
  if (collabTextDoc && collabTextStopId) {
    await persistCurrentTextFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  }
  if (collabDayTextDoc && collabDayTextDayId) {
    await persistCurrentDayTextFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  }
  if (!collabPlanDoc || collabPlanTripId !== tripId) {
    await bindCollabPlanDoc();
  }
  if (collabPlanDoc) {
    persistCurrentPlanFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  }
}

async function prepareStateForRemoteSave(label = "保存前已清理图片与协作快照") {
  repairPlanStructure(state);
  if (!tripId || isReadonlyMode || !canEdit()) return;
  try {
    await replacePlanCollabDoc("local-clean-remote-save", { allowReplace: true, reason: "conflict-keep" });
    persistCurrentPlanFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  } catch (error) {
    console.warn("Clean remote save snapshot rebuild failed", error);
    state.planYjs = planYjsSnapshotFromPlan(state);
  }
  repairPlanStructure(state);
}

async function ensureRemotePlanYjsSnapshot(label = "已补齐计划结构协作快照") {
  if (!tripId || !supabaseClient || isReadonlyMode || !canEdit() || pendingConflict || state.planYjs) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc) return false;
  persistCurrentPlanFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  if (!state.planYjs) return false;
  return pushRemoteState(label);
}

function currentPlanYjsState() {
  if (!collabPlanDoc || !yjsModule) return state.planYjs || "";
  try {
    return bytesToBase64(yjsModule.encodeStateAsUpdate(collabPlanDoc));
  } catch (error) {
    console.warn("Plan Yjs state could not be encoded", error);
    return state.planYjs || "";
  }
}

async function applyPlanYjsStateToCurrentPlan(planYjs, label = "已应用计划结构协作快照", options = {}) {
  if (!planYjs) return false;
  const { scheduleSave = true } = options;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return false;
  }
  const previousPlanDoc = collabPlanDoc;
  const previousRefs = {
    dayMetas: collabDayMetasArray,
    dayTextStates: collabDayTextStatesMap,
    dayBlockTextStates: collabDayBlockTextStatesMap,
    dayBlockTexts: collabDayBlockTextsMap,
    stopLists: collabStopListsMap,
    stopTextStates: collabStopTextStatesMap,
    dayBlocks: collabDayBlocksMap,
    transportQuotes: collabTransportQuotesArray,
    candidates: collabCandidatesArray,
    activities: collabActivitiesArray,
    settings: collabSettingsMap,
    settingTextStates: collabSettingTextStatesMap,
    settingTexts: collabSettingTextsMap,
  };
  const nextDoc = new Y.Doc();
  try {
    Y.applyUpdate(nextDoc, base64ToBytes(planYjs), "restore");
    collabPlanDoc = nextDoc;
    attachCollabPlanRefs();
    persistCurrentPlanFromDoc(label, { scheduleSave });
    state.planYjs = planYjs;
    return true;
  } catch (error) {
    console.warn("Plan Yjs replacement could not be applied", error);
    return false;
  } finally {
    collabPlanDoc = previousPlanDoc;
    collabDayMetasArray = previousRefs.dayMetas;
    collabDayTextStatesMap = previousRefs.dayTextStates;
    collabDayBlockTextStatesMap = previousRefs.dayBlockTextStates;
    collabDayBlockTextsMap = previousRefs.dayBlockTexts;
    collabStopListsMap = previousRefs.stopLists;
    collabStopTextStatesMap = previousRefs.stopTextStates;
    collabDayBlocksMap = previousRefs.dayBlocks;
    collabTransportQuotesArray = previousRefs.transportQuotes;
    collabCandidatesArray = previousRefs.candidates;
    collabActivitiesArray = previousRefs.activities;
    collabSettingsMap = previousRefs.settings;
    collabSettingTextStatesMap = previousRefs.settingTextStates;
    collabSettingTextsMap = previousRefs.settingTexts;
    nextDoc.destroy();
  }
}

async function replaceLivePlanDocWithYjsState(planYjs, label = "已替换计划结构协作快照") {
  if (!planYjs || !tripId || isReadonlyMode) return applyPlanYjsStateToCurrentPlan(planYjs, label, { scheduleSave: false });
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return false;
  }
  destroyCollabPlanDoc();
  collabPlanTripId = tripId;
  collabPlanDoc = new Y.Doc();
  try {
    Y.applyUpdate(collabPlanDoc, base64ToBytes(planYjs), "restore");
    attachCollabPlanRefs();
    seedMissingPlanDocContent(Y);
    state.planYjs = planYjs;
    attachCollabPlanDocObserver();
    persistCurrentPlanFromDoc(label, { scheduleSave: false });
    return true;
  } catch (error) {
    console.warn("Live plan Yjs replacement could not be applied", error);
    destroyCollabPlanDoc();
    return false;
  }
}

function clearPlanYjsState(plan = state) {
  if (plan && Object.prototype.hasOwnProperty.call(plan, "planYjs")) delete plan.planYjs;
  return plan;
}

function attachCollabPlanRefs() {
  collabDayMetasArray = collabPlanDoc.getArray("dayMetas");
  collabDayTextStatesMap = collabPlanDoc.getMap("dayTextStates");
  collabDayBlockTextStatesMap = collabPlanDoc.getMap("dayBlockTextStates");
  collabDayBlockTextsMap = collabPlanDoc.getMap("dayBlockTexts");
  collabStopListsMap = collabPlanDoc.getMap("stopLists");
  collabStopTextStatesMap = collabPlanDoc.getMap("stopTextStates");
  collabDayBlocksMap = collabPlanDoc.getMap("dayBlocks");
  collabTransportQuotesArray = collabPlanDoc.getArray("transportQuotes");
  collabCandidatesArray = collabPlanDoc.getArray("candidates");
  collabActivitiesArray = collabPlanDoc.getArray("activities");
  collabSettingsMap = collabPlanDoc.getMap("settings");
  collabSettingTextStatesMap = collabPlanDoc.getMap("settingTextStates");
  collabSettingTextsMap = collabPlanDoc.getMap("settingTexts");
}

function seedMissingPlanDocContent(Y) {
  collabPlanDoc.transact(() => {
    PLAN_SETTING_FIELDS.forEach((meta) => {
      if (!collabSettingsMap.has(meta.field)) collabSettingsMap.set(meta.field, planSettingValue(state, meta));
    });
    Object.entries(settingTextStateSnapshotFromPlan(state, Y)).forEach(([field, textState]) => {
      if (!collabSettingTextStatesMap.has(field)) collabSettingTextStatesMap.set(field, textState);
    });
    Object.entries(settingTextValueSnapshotFromPlan(state)).forEach(([field, textValue]) => {
      if (collabSettingTextsMap.has(field)) return;
      const yText = new Y.Text();
      const storedTextState = collabSettingTextStatesMap.get(field) || state[`${field}Yjs`] || "";
      const restoredText = settingTextValueFromState(storedTextState, textValue);
      if (restoredText) yText.insert(0, restoredText);
      collabSettingTextsMap.set(field, yText);
    });
    (state.days || []).forEach((day) => {
      if (!day?.id || collabStopListsMap.has(day.id)) return;
      const stopArray = new Y.Array();
      const stops = normalizeStopListsFromDays([day])[day.id] || [];
      if (stops.length) stopArray.insert(0, stops);
      collabStopListsMap.set(day.id, stopArray);
    });
    Object.entries(stopTextStateSnapshotFromDays(state.days || [], Y)).forEach(([stopId, textState]) => {
      if (!collabStopTextStatesMap.has(stopId)) collabStopTextStatesMap.set(stopId, textState);
    });
    Object.entries(dayTextStateSnapshotFromDays(state.days || [], Y)).forEach(([dayId, textState]) => {
      if (!collabDayTextStatesMap.has(dayId)) collabDayTextStatesMap.set(dayId, textState);
    });
    Object.entries(dayBlockTextStateSnapshotFromDays(state.days || [], Y)).forEach(([blockKey, textState]) => {
      if (!collabDayBlockTextStatesMap.has(blockKey)) collabDayBlockTextStatesMap.set(blockKey, textState);
    });
    Object.entries(dayBlockTextValueSnapshotFromDays(state.days || [])).forEach(([blockKey, text]) => {
      if (collabDayBlockTextsMap.has(blockKey)) return;
      const yText = new Y.Text();
      if (text) yText.insert(0, text);
      collabDayBlockTextsMap.set(blockKey, yText);
    });
    (state.days || []).forEach((day) => {
      if (!day?.id || collabDayBlocksMap.has(day.id)) return;
      const blockArray = new Y.Array();
      const blocks = normalizeDayBlocks(day.blocks || []);
      if (blocks.length) blockArray.insert(0, blocks);
      collabDayBlocksMap.set(day.id, blockArray);
    });
    (state.days || []).forEach((day) => {
      if (!day?.id) return;
      const stopArray = collabStopListsMap.get(day.id);
      if (!stopArray || typeof stopArray.toArray !== "function") return;
      const localStops = normalizeStopListsFromDays([day])[day.id] || [];
      const remoteStops = stopArray.toArray();
      if (!sameSerialized(remoteStops.map((stop) => stop?.id), localStops.map((stop) => stop?.id))) return;
      localStops.forEach((localStop, index) => {
        const remoteStop = normalizeCollaborativeStop(remoteStops[index] || {});
        if (sameSerialized(remoteStop, localStop)) return;
        stopArray.delete(index, 1);
        stopArray.insert(index, [localStop]);
      });
    });
    const cleanedStopLists = sanitizeStopListsForPlan(readStopListsFromDoc(), state);
    (state.days || []).forEach((day) => {
      if (!day?.id) return;
      let stopArray = collabStopListsMap.get(day.id);
      if (!stopArray || typeof stopArray.toArray !== "function") {
        stopArray = new Y.Array();
        collabStopListsMap.set(day.id, stopArray);
      }
      const cleanedStops = cleanedStopLists[day.id] || [];
      if (!sameSerialized(stopArray.toArray().map((stop) => normalizeCollaborativeStop(stop)), cleanedStops)) {
        stopArray.delete(0, stopArray.length);
        if (cleanedStops.length) stopArray.insert(0, cleanedStops);
      }
    });
    const rawCandidates = normalizeCandidateStops(collabCandidatesArray ? collabCandidatesArray.toArray() : state.candidates || []);
    const cleanedCandidates = sanitizedCandidatesForPlan(rawCandidates, state);
    if (collabCandidatesArray && !sameSerialized(rawCandidates, cleanedCandidates)) {
      collabCandidatesArray.delete(0, collabCandidatesArray.length);
      if (cleanedCandidates.length) collabCandidatesArray.insert(0, cleanedCandidates);
    }
  }, "restore");
}

function planDocMatchesCurrentState() {
  return (
    sameSerialized(normalizeDayMetas(state.days || []), readDayMetasFromDoc()) &&
    sameSerialized(dayTextStateSnapshotFromDays(state.days || [], yjsModule), readDayTextStatesFromDoc()) &&
    sameSerialized(dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule), readDayBlockTextStatesFromDoc()) &&
    sameSerialized(dayBlockTextValueSnapshotFromDays(state.days || []), readDayBlockTextValuesFromDoc()) &&
    sameSerialized(settingTextStateSnapshotFromPlan(state, yjsModule), readSettingTextStatesFromDoc()) &&
    sameSerialized(settingTextValueSnapshotFromPlan(state), readSettingTextValuesFromDoc()) &&
    sameSerialized(normalizeStopListsFromDays(state.days || []), readStopListsFromDoc()) &&
    sameSerialized(stopTextStateSnapshotFromDays(state.days || [], yjsModule), readStopTextStatesFromDoc()) &&
    sameSerialized(normalizeDayBlocksFromDays(state.days || []), readDayBlocksFromDoc()) &&
    sameSerialized(normalizeTransportQuotes(state.transportQuotes || []), readTransportQuotesFromDoc()) &&
    sameSerialized(normalizeCandidateStops(state.candidates || []), readCandidatesFromDoc()) &&
    sameSerialized(normalizeActivities(state.activities || []), readActivitiesFromDoc()) &&
    PLAN_SETTING_FIELDS.every((meta) => sameSerialized(planSettingValue(state, meta), readSettingsFromDoc()[meta.field]))
  );
}

function broadcastPlanYjsUpdate(update) {
  if (!realtimeChannel || !collabPlanDoc || !tripId || isApplyingCollabPlanRemote) return;
  const encodedUpdate = typeof update === "string" ? update : bytesToBase64(update);
  realtimeChannel.send({
    type: "broadcast",
    event: "plan-yjs-update",
    payload: {
      roomId: currentPlanRoomId(),
      update: encodedUpdate,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
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

function broadcastDayTextUpdate(update) {
  if (!realtimeChannel || !collabDayTextDayId || isApplyingCollabDayTextRemote) return;
  realtimeChannel.send({
    type: "broadcast",
    event: "day-text-yjs-update",
    payload: {
      roomId: currentDayTextRoomId(collabDayTextDayId),
      dayId: collabDayTextDayId,
      update: bytesToBase64(update),
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function structDomValue({ domKey, type }) {
  const element = dom[domKey];
  if (!element) return type === "number" ? 0 : type === "tags" || type === "list" ? [] : type === "boolean" ? false : "";
  if (type === "number") return numberValue(element.value);
  if (type === "tags") return normalizeTags(element.value);
  if (type === "list") return normalizeList(element.value);
  if (type === "boolean") return Boolean(element.checked);
  return String(element.value || "").trim();
}

function stopStructValue(stop, { field, type }) {
  if (field === "votes") return normalizeStopVotes(stop).votes;
  if (field === "userVoted") return normalizeStopVotes(stop).userVoted;
  if (field === "voters") return normalizeStopVotes(stop).voters;
  if (field === "budgetSelected") return stop?.budgetSelected !== false;
  if (type === "number") return numberValue(stop?.[field]);
  if (type === "tags") return normalizeTags(stop?.[field]);
  if (type === "list") return normalizeList(stop?.[field]);
  if (type === "boolean") return Boolean(stop?.[field]);
  return String(stop?.[field] || "").trim();
}

function structDisplayValue(value, type) {
  if (type === "tags") return normalizeTags(value).join(", ");
  if (type === "list") return normalizeList(value).join(", ");
  if (type === "number") return value || "";
  if (type === "boolean") return Boolean(value);
  return value || "";
}

function writeStructDomValue(meta, value) {
  const element = dom[meta.domKey];
  if (!element) return;
  if (meta.type === "boolean") {
    element.checked = meta.field === "budgetSelected" ? value !== false : Boolean(value);
    return;
  }
  element.value = structDisplayValue(value, meta.type);
}

function readStructFromDoc() {
  const values = {};
  if (!collabStructMap) return values;
  COLLAB_STRUCT_FIELDS.forEach(({ field, type }) => {
    const value = collabStructMap.get(field);
    values[field] = field === "budgetSelected" ? value !== false : type === "tags" ? normalizeTags(value) : type === "list" ? normalizeList(value) : type === "number" ? numberValue(value) : type === "boolean" ? Boolean(value) : String(value || "");
  });
  const normalizedVotes = normalizeStopVotes(values);
  values.voters = normalizedVotes.voters;
  values.votes = normalizedVotes.votes;
  values.userVoted = normalizedVotes.userVoted;
  return values;
}

function normalizeCommentEntry(comment = {}) {
  if (!comment) return null;
  const anchor = normalizeCommentAnchor(comment.anchor);
  const parentId = String(comment.parentId || "").trim();
  const normalized = {
    id: comment.id || uid(),
    author: comment.author || "我",
    text: String(comment.text || "").trim(),
    at: comment.at || new Date().toISOString(),
    updatedAt: comment.updatedAt || comment.resolvedAt || comment.at || new Date().toISOString(),
  };
  if (parentId && parentId !== normalized.id) normalized.parentId = parentId;
  if (!normalized.parentId && anchor) normalized.anchor = anchor;
  if (!normalized.parentId && comment.resolved === false) {
    delete normalized.resolved;
    delete normalized.resolvedAt;
    delete normalized.resolvedBy;
  } else if (!normalized.parentId && comment.resolved) {
    normalized.resolved = true;
    normalized.resolvedAt = comment.resolvedAt || new Date().toISOString();
    normalized.resolvedBy = comment.resolvedBy || "";
  }
  return normalized.text ? normalized : null;
}

function normalizeComments(comments = []) {
  const byKey = new Map();
  const order = [];
  (comments || [])
    .map((comment) => normalizeCommentEntry(comment))
    .filter((comment) => comment?.text)
    .forEach((comment) => {
      const key = comment.id || `${comment.author}:${comment.text}`;
      if (!byKey.has(key)) {
        order.push(key);
        byKey.set(key, comment);
        return;
      }
      byKey.set(key, mergeCommentEntry(byKey.get(key), comment));
    });
  const normalized = mergeCommentListEntries(order.map((key) => byKey.get(key)).filter(Boolean));
  const byId = new Map(normalized.map((comment) => [comment.id, comment]));
  return normalized.map((comment) => {
    if (!comment.parentId) return comment;
    const parent = byId.get(comment.parentId);
    if (!parent || parent.id === comment.id) {
      const { parentId, ...rootComment } = comment;
      return rootComment;
    }
    const rootParentId = parent.parentId && byId.has(parent.parentId) ? parent.parentId : parent.id;
    const { anchor, resolved, resolvedAt, resolvedBy, ...reply } = comment;
    return { ...reply, parentId: rootParentId };
  });
}

function readCommentsFromDoc() {
  return normalizeComments(collabCommentsArray ? collabCommentsArray.toArray() : []);
}

function readDayCommentsFromDoc() {
  return normalizeComments(collabDayCommentsArray ? collabDayCommentsArray.toArray() : []);
}

function commentsWithoutThread(comments = [], commentId = "") {
  const normalized = normalizeComments(comments);
  const target = normalized.find((comment) => comment.id === commentId);
  if (!target) return normalized;
  const removeIds = new Set([commentId]);
  if (!target.parentId) {
    normalized.forEach((comment) => {
      if (comment.parentId === commentId) removeIds.add(comment.id);
    });
  }
  return normalizeComments(normalized.filter((comment) => !removeIds.has(comment.id)));
}

function commentsWithUpdatedComment(comments = [], commentId = "", patch = {}) {
  return normalizeComments(
    normalizeComments(comments).map((comment) => {
      if (comment.id !== commentId) return comment;
      const next = { ...comment, ...patch };
      if (patch.resolved === false) {
        delete next.resolved;
        delete next.resolvedAt;
        delete next.resolvedBy;
      }
      return next;
    }),
  );
}

function commentRootsAndReplies(comments = []) {
  const normalized = normalizeComments(comments);
  const roots = [];
  const repliesByParent = new Map();
  normalized.forEach((comment) => {
    if (comment.parentId) {
      const replies = repliesByParent.get(comment.parentId) || [];
      replies.push(comment);
      repliesByParent.set(comment.parentId, replies);
    } else {
      roots.push(comment);
    }
  });
  return { roots, repliesByParent, normalized };
}

function commentStatsForField(comments = [], field = "") {
  const { roots, repliesByParent } = commentRootsAndReplies(comments);
  const related = roots.filter((comment) => comment.anchor?.field === field);
  const open = related.filter((comment) => !comment.resolved);
  return {
    total: related.length,
    open: open.length,
    replies: related.reduce((sum, comment) => sum + (repliesByParent.get(comment.id)?.length || 0), 0),
  };
}

function commentFilterCounts(comments = []) {
  const { roots } = commentRootsAndReplies(comments);
  return roots.reduce(
    (counts, comment) => {
      counts.all += 1;
      if (comment.resolved) counts.resolved += 1;
      else counts.open += 1;
      return counts;
    },
    { all: 0, open: 0, resolved: 0 },
  );
}

function commentIndexItems(plan = state) {
  const items = [];
  (plan.days || []).forEach((day, dayIndex) => {
    const dayLabel = day.title || day.label || `D${dayIndex + 1}`;
    const appendComment = (comment, context) => {
      const replies = context.repliesByParent.get(comment.id) || [];
      const anchor = comment.anchor
        ? normalizeCommentAnchor({
            ...comment.anchor,
            dayId: comment.anchor.dayId || context.dayId || day.id || "",
            stopId: comment.anchor.stopId || context.stopId || "",
            blockId: comment.anchor.blockId || context.blockId || "",
          })
        : null;
      items.push({
        id: comment.id,
        text: comment.text,
        author: comment.author || "我",
        at: comment.at || "",
        resolved: Boolean(comment.resolved),
        replies: replies.length,
        anchor,
        dayIndex,
        dayId: day.id || "",
        dayLabel,
        ...context,
      });
    };
    const dayThreads = commentRootsAndReplies(day.comments || []);
    dayThreads.roots.forEach((comment) => appendComment(comment, {
      scope: "day",
      scopeLabel: "当天",
      targetLabel: dayLabel,
      repliesByParent: dayThreads.repliesByParent,
    }));
    (day.stops || []).forEach((stop, stopIndex) => {
      const stopThreads = commentRootsAndReplies(stop.comments || []);
      stopThreads.roots.forEach((comment) => appendComment(comment, {
        scope: "stop",
        scopeLabel: "地点",
        targetLabel: stop.title || `地点 ${stopIndex + 1}`,
        stopIndex,
        stopId: stop.id || "",
        repliesByParent: stopThreads.repliesByParent,
      }));
    });
    normalizeDayBlocks(day.blocks || []).forEach((block) => {
      const blockThreads = commentRootsAndReplies(block.comments || []);
      blockThreads.roots.forEach((comment) => appendComment(comment, {
        scope: "block",
        scopeLabel: "协作块",
        targetLabel: block.text || dayBlockTypeLabel(block.type),
        blockId: block.id || "",
        blockType: block.type || "todo",
        repliesByParent: blockThreads.repliesByParent,
      }));
    });
  });
  return items.sort((a, b) => Number(a.resolved) - Number(b.resolved) || commentIndexTimeValue(b) - commentIndexTimeValue(a));
}

function commentIndexCounts(items = []) {
  return items.reduce(
    (counts, item) => {
      counts.all += 1;
      if (item.resolved) counts.resolved += 1;
      else counts.open += 1;
      return counts;
    },
    { all: 0, open: 0, resolved: 0 },
  );
}

function commentIndexTimeValue(item = {}) {
  const time = new Date(item.at || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function resolvedCommentPatch(isResolved) {
  const updatedAt = new Date().toISOString();
  return isResolved
    ? { resolved: false, updatedAt }
    : { resolved: true, resolvedAt: updatedAt, resolvedBy: getCollabName(), updatedAt };
}

function createCommentReply(parentId = "", text = "") {
  return normalizeCommentEntry({
    id: uid(),
    parentId,
    author: getCollabName(),
    text,
    at: new Date().toISOString(),
  });
}

function commentAnchorLabel(anchor = null) {
  if (!anchor?.field) return "";
  const meta = collabTextFieldMeta(anchor.field);
  const label = anchor.label || meta?.label || (anchor.scope === "block" ? "协作块" : "字段");
  const start = Number(anchor.start || 0);
  const end = Number(anchor.end || start);
  if (end > start) return `${label} · 选中 ${end - start} 字`;
  return `${label} · 光标 ${start}`;
}

function commentAnchorHint(anchor = null) {
  if (!anchor) return "选中名称、地址或备注里的文字后，可以把评论挂到对应位置。";
  const label = commentAnchorLabel(anchor);
  const excerpt = anchor.excerpt ? `「${anchor.excerpt}」` : "";
  return `将评论挂到：${label}${excerpt ? ` ${excerpt}` : ""}`;
}

function renderCommentAnchorHint() {
  if (!dom.commentAnchorHint) return;
  const replying = replyingCommentId ? normalizeComments(currentStop()?.comments || []).find((comment) => comment.id === replyingCommentId) : null;
  if (replying) {
    dom.commentAnchorHint.hidden = false;
    dom.commentAnchorHint.textContent = `正在回复 ${replying.author || "协作者"}：${replying.text.slice(0, 28)}`;
    return;
  }
  const anchor = currentCommentAnchor("stop");
  dom.commentAnchorHint.hidden = !anchor;
  dom.commentAnchorHint.textContent = anchor ? commentAnchorHint(anchor) : "";
}

function renderDayCommentAnchorHint() {
  if (!dom.dayCommentAnchorHint) return;
  const replying = dayReplyingCommentId ? normalizeComments(currentDay()?.comments || []).find((comment) => comment.id === dayReplyingCommentId) : null;
  if (replying) {
    dom.dayCommentAnchorHint.hidden = false;
    dom.dayCommentAnchorHint.textContent = `正在回复 ${replying.author || "协作者"}：${replying.text.slice(0, 28)}`;
    return;
  }
  const anchor = currentCommentAnchor("day");
  dom.dayCommentAnchorHint.hidden = !anchor;
  dom.dayCommentAnchorHint.textContent = anchor ? commentAnchorHint(anchor) : "";
}

function focusCommentAnchor(anchor = null) {
  const normalized = normalizeCommentAnchor(anchor);
  if (normalized?.scope === "block") {
    if (normalized.dayId && normalized.dayId !== currentDay()?.id) {
      const dayIndex = state.days.findIndex((day) => day.id === normalized.dayId);
      if (dayIndex >= 0) {
        activeDay = dayIndex;
        activeStop = 0;
        render();
      }
    }
    const input = dom.dayBlockList?.querySelector(`[data-edit-day-block="${CSS.escape(normalized.blockId || "")}"]`);
    if (!input) return false;
    input.focus();
    const valueLength = String(input.value || "").length;
    const start = Math.max(0, Math.min(Number(normalized.start || 0), valueLength));
    const end = Math.max(start, Math.min(Number(normalized.end || start), valueLength));
    if (typeof input.setSelectionRange === "function") input.setSelectionRange(start, end);
    activeBlockPresenceId = normalized.blockId || activeBlockPresenceId;
    lastCommentAnchor = { ...normalized, capturedAt: Date.now() };
    schedulePresenceTrack(0);
    refreshDayBlockTextPresence();
    return true;
  }
  const meta = normalized ? collabTextFieldMeta(normalized.field) : null;
  const element = meta ? dom[meta.domKey] : null;
  if (!element) return false;
  element.focus();
  const valueLength = String(element.value || "").length;
  const start = Math.max(0, Math.min(Number(normalized.start || 0), valueLength));
  const end = Math.max(start, Math.min(Number(normalized.end || start), valueLength));
  if (typeof element.setSelectionRange === "function") {
    element.setSelectionRange(start, end);
  }
  captureCommentAnchor(meta);
  schedulePresenceTrack(0);
  return true;
}

function formatCommentTime(value) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function commentAuthorInitial(name) {
  return escapeHtml(memberInitial(name || "我"));
}

function renderCommentReply(reply, editable, deleteAttr = "data-delete-comment") {
  return `
    <div class="comment-reply" data-comment="${escapeHtml(reply.id || "")}">
      <span class="avatar a3">${commentAuthorInitial(reply.author)}</span>
      <div class="comment-bubble">
        <div class="comment-meta">
          <strong>${escapeHtml(reply.author || "我")}</strong>
          ${reply.at ? `<time>${escapeHtml(formatCommentTime(reply.at))}</time>` : ""}
        </div>
        <p>${escapeHtml(reply.text)}</p>
      </div>
      ${editable ? `<button type="button" class="icon-btn subtle danger-icon" ${deleteAttr}="${escapeHtml(reply.id || "")}" aria-label="删除回复">${icon("trash-2")}</button>` : ""}
    </div>
  `;
}

function ensureFieldCommentMark(fieldMeta) {
  const field = fieldMeta?.field;
  const target = fieldMeta?.presenceId ? document.querySelector(`#${fieldMeta.presenceId}`) : null;
  const element = fieldMeta?.domKey ? dom[fieldMeta.domKey] : null;
  if (!field || !target || !element) return null;
  const markId = `fieldCommentMark-${String(field).replace(/[^a-z0-9_-]/gi, "-")}`;
  let mark = document.getElementById(markId);
  if (!mark) {
    mark = document.createElement("button");
    mark.id = markId;
    mark.type = "button";
    mark.className = "field-comment-mark";
    mark.dataset.fieldCommentMark = field;
    mark.title = "查看这个字段的批注";
    target.insertAdjacentElement("afterend", mark);
  }
  return mark;
}

function renderFieldCommentMarks(stop = currentStop()) {
  const comments = normalizeComments(stop?.comments || []);
  COLLAB_STOP_COMMENT_ANCHOR_FIELDS.forEach((fieldMeta) => {
    const mark = ensureFieldCommentMark(fieldMeta);
    if (!mark) return;
    const stats = commentStatsForField(comments, fieldMeta.field);
    mark.hidden = !stats.total;
    mark.classList.toggle("is-resolved", stats.total > 0 && stats.open === 0);
    mark.innerHTML = `${icon(stats.open ? "message-square-more" : "message-square-check")}<span>${stats.open || stats.total}</span>`;
    mark.title = stats.open
      ? `${fieldMeta.label}有 ${stats.open} 条未解决批注${stats.replies ? `，${stats.replies} 条回复` : ""}`
      : `${fieldMeta.label}的批注已解决`;
  });
}

function renderDayFieldCommentMarks(day = currentDay()) {
  const comments = normalizeComments(day?.comments || []);
  COLLAB_DAY_COMMENT_ANCHOR_FIELDS.forEach((fieldMeta) => {
    const mark = ensureFieldCommentMark(fieldMeta);
    if (!mark) return;
    const stats = commentStatsForField(comments, fieldMeta.field);
    mark.hidden = !stats.total;
    mark.classList.toggle("is-resolved", stats.total > 0 && stats.open === 0);
    mark.innerHTML = `${icon(stats.open ? "message-square-more" : "message-square-check")}<span>${stats.open || stats.total}</span>`;
    mark.title = stats.open
      ? `${fieldMeta.label}有 ${stats.open} 条未解决批注${stats.replies ? `，${stats.replies} 条回复` : ""}`
      : `${fieldMeta.label}的批注已解决`;
  });
}

function focusCommentThread(commentId = "") {
  if (!commentId) return false;
  const thread = Array.from(dom.commentList?.querySelectorAll("[data-comment]") || []).find((item) => item.dataset.comment === commentId);
  if (!thread) return false;
  thread.scrollIntoView({ block: "nearest", behavior: "smooth" });
  thread.classList.add("is-focused");
  setTimeout(() => thread.classList.remove("is-focused"), 1300);
  return true;
}

function focusDayCommentThread(commentId = "") {
  if (!commentId) return false;
  const thread = Array.from(dom.dayCommentList?.querySelectorAll("[data-comment]") || []).find((item) => item.dataset.comment === commentId);
  if (!thread) return false;
  thread.scrollIntoView({ block: "nearest", behavior: "smooth" });
  thread.classList.add("is-focused");
  setTimeout(() => thread.classList.remove("is-focused"), 1300);
  return true;
}

function dayTextValuesFromDoc(doc = collabDayTextDoc, fields = collabDayTextFields) {
  const values = {};
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
    values[docField] = fields[docField]?.toString?.() ?? doc?.getText?.(docField)?.toString?.() ?? "";
  });
  return values;
}

function dayValuesFromTextState(textState = "", fallbackDay = {}) {
  const values = {};
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
    values[docField] = String(fallbackDay?.[docField] || "");
  });
  if (!textState || !yjsModule) return values;
  const tempDoc = new yjsModule.Doc();
  try {
    yjsModule.applyUpdate(tempDoc, base64ToBytes(textState), "read");
    COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
      values[docField] = tempDoc.getText(docField).toString();
    });
  } catch (error) {
    console.warn("Stored day Yjs text state could not be read", error);
  } finally {
    tempDoc.destroy();
  }
  return values;
}

function renderCommentThreads(comments = [], options = {}) {
  const {
    filter = "all",
    filterAttr = "data-comment-filter",
    anchorAttr = "data-comment-anchor",
    replyAttr = "data-reply-comment",
    resolveAttr = "data-toggle-comment-resolved",
    deleteAttr = "data-delete-comment",
    emptyPrefix = "还没有评论",
  } = options;
  const editable = canEdit();
  const { roots, repliesByParent } = commentRootsAndReplies(comments || []);
  const counts = commentFilterCounts(comments || []);
  const activeFilter = counts[filter] ? filter : "all";
  const filters = COMMENT_FILTERS.map((item) => {
    const active = activeFilter === item.value ? " is-active" : "";
    return `<button type="button" class="comment-filter${active}" ${filterAttr}="${item.value}">${item.label}<span>${counts[item.value] || 0}</span></button>`;
  }).join("");
  const visibleRoots = roots.filter((comment) => activeFilter === "all" || (activeFilter === "open" ? !comment.resolved : comment.resolved));
  const threadHtml = visibleRoots
    .map((comment) => {
      const anchor = normalizeCommentAnchor(comment.anchor);
      const anchorLabel = commentAnchorLabel(anchor);
      const anchorExcerpt = anchor?.excerpt ? `<em>${escapeHtml(anchor.excerpt)}</em>` : "";
      const replies = repliesByParent.get(comment.id) || [];
      const resolvedClass = comment.resolved ? " is-resolved" : "";
      const resolvedText = comment.resolved ? `<span class="comment-state">${icon("check-circle-2")}已解决</span>` : "";
      return `
        <div class="comment-thread${resolvedClass}" data-comment="${escapeHtml(comment.id || "")}">
        <div class="comment-item">
          <span class="avatar a2">${commentAuthorInitial(comment.author)}</span>
          <div class="comment-bubble">
            ${anchor ? `<button type="button" class="comment-anchor" ${anchorAttr}="${escapeHtml(comment.id || "")}" title="回到评论位置">${escapeHtml(anchorLabel)}${anchorExcerpt}</button>` : ""}
            <div class="comment-meta">
              <strong>${escapeHtml(comment.author || "我")}</strong>
              ${comment.at ? `<time>${escapeHtml(formatCommentTime(comment.at))}</time>` : ""}
              ${resolvedText}
            </div>
            <p>${escapeHtml(comment.text)}</p>
            <div class="comment-actions">
              ${editable ? `<button type="button" class="comment-action" ${replyAttr}="${escapeHtml(comment.id || "")}">${icon("reply")}回复${replies.length ? ` ${replies.length}` : ""}</button>` : replies.length ? `<span>${replies.length} 条回复</span>` : ""}
              ${editable ? `<button type="button" class="comment-action" ${resolveAttr}="${escapeHtml(comment.id || "")}">${comment.resolved ? `${icon("rotate-ccw")}重新打开` : `${icon("check")}标记解决`}</button>` : ""}
            </div>
            ${replies.length ? `<div class="comment-replies">${replies.map((reply) => renderCommentReply(reply, editable, deleteAttr)).join("")}</div>` : ""}
          </div>
          ${editable ? `<button type="button" class="icon-btn subtle danger-icon" ${deleteAttr}="${escapeHtml(comment.id || "")}" aria-label="删除评论">${icon("trash-2")}</button>` : ""}
        </div>
        </div>
      `;
    })
    .join("");
  const emptyText = roots.length
    ? activeFilter === "open"
      ? "没有未解决批注。"
      : "没有已解决批注。"
    : emptyPrefix;
  return {
    html: `<div class="comment-filters">${filters}</div>${threadHtml || `<div class="comment-item"><span class="avatar a1">我</span><p>${emptyText}</p></div>`}`,
    filter: activeFilter,
    roots,
  };
}

function renderStopComments(stop) {
  const { roots } = commentRootsAndReplies(stop.comments || []);
  if (replyingCommentId && !roots.some((comment) => comment.id === replyingCommentId)) {
    replyingCommentId = "";
    if (dom.commentInput) dom.commentInput.placeholder = "添加同行意见或提醒";
  }
  const rendered = renderCommentThreads(stop.comments || [], {
    filter: commentFilter,
    emptyPrefix: "还没有评论，可以先添加同行意见。",
  });
  commentFilter = rendered.filter;
  dom.commentList.innerHTML = `
    ${rendered.html}
  `;
  renderCommentAnchorHint();
  renderFieldCommentMarks(stop);
  refreshIcons();
}

function renderDayComments(day = currentDay()) {
  if (!day || !dom.dayCommentList) return;
  const { roots } = commentRootsAndReplies(day.comments || []);
  if (dayReplyingCommentId && !roots.some((comment) => comment.id === dayReplyingCommentId)) {
    dayReplyingCommentId = "";
    if (dom.dayCommentInput) dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
  }
  const rendered = renderCommentThreads(day.comments || [], {
    filter: dayCommentFilter,
    filterAttr: "data-day-comment-filter",
    anchorAttr: "data-day-comment-anchor",
    replyAttr: "data-reply-day-comment",
    resolveAttr: "data-toggle-day-comment-resolved",
    deleteAttr: "data-delete-day-comment",
    emptyPrefix: "还没有当天批注，可以选中当天设置里的文字后添加。",
  });
  dayCommentFilter = rendered.filter;
  dom.dayCommentTitle.textContent = day.title || day.label || "当前日期";
  dom.dayCommentList.innerHTML = rendered.html;
  renderDayCommentAnchorHint();
  renderDayFieldCommentMarks(day);
  renderTextPresence();
  refreshIcons();
}

function refreshStopCommentMutationViews(stop = currentStop()) {
  if (!stop || !dom.commentList) return false;
  renderStopComments(stop);
  if (dom.commentCount) dom.commentCount.textContent = (stop.comments || []).length;
  renderCommentIndex();
  refreshIcons();
  return true;
}

function refreshDayCommentMutationViews(day = currentDay()) {
  if (!day || !dom.dayCommentList) return false;
  renderDayComments(day);
  renderCommentIndex();
  refreshIcons();
  return true;
}

function refreshStopInteractionViews(stop = currentStop()) {
  if (!stop) return false;
  dom.favoriteBtn?.classList.toggle("selected", Boolean(stop.favorite));
  dom.mustVote?.classList.toggle("is-active", Boolean(stop.userVoted));
  if (dom.voteCount) dom.voteCount.textContent = stop.votes || 0;
  if (dom.commentCount) dom.commentCount.textContent = (stop.comments || []).length;
  renderTimeline();
  refreshIcons();
  return true;
}

function dayBlockTypeLabel(type = "todo") {
  if (type === "checklist") return "检查清单";
  if (type === "divider") return "分隔线";
  if (type === "quote") return "引用";
  if (type === "callout") return "提醒";
  if (type === "heading") return "标题";
  if (type === "note") return "备注";
  if (type === "decision") return "决定";
  return "待办";
}

function dayBlockIcon(type = "todo") {
  if (type === "checklist") return "list-checks";
  if (type === "divider") return "minus";
  if (type === "quote") return "quote";
  if (type === "callout") return "info";
  if (type === "heading") return "heading-2";
  if (type === "note") return "notebook-text";
  if (type === "decision") return "badge-check";
  return "check-square";
}

function dayBlockTypeOptions(currentType = "todo") {
  return DAY_BLOCK_TYPES.map((type) => `<option value="${escapeHtml(type)}"${type === currentType ? " selected" : ""}>${escapeHtml(dayBlockTypeLabel(type))}</option>`).join("");
}

function dayBlockCommandTokens(command) {
  return [
    command.command,
    ...(command.aliases || []),
    command.label,
    command.description,
    ...(command.keywords || []),
    dayBlockTypeLabel(command.type),
  ].filter(Boolean).map((token) => String(token).toLowerCase());
}

function dayBlockSlashCommand(value = "") {
  const command = String(value || "").trim().toLowerCase();
  return DAY_BLOCK_COMMANDS.find((item) => [item.command, ...(item.aliases || [])].map((alias) => alias.toLowerCase()).includes(command))?.type || "";
}

function dayBlockCommandQueryFromValue(value = "") {
  const raw = String(value || "").trim();
  if (!raw.startsWith("/") || /\s/.test(raw.slice(1))) return "";
  return raw.toLowerCase();
}

function dayBlockCommandCandidates(query = "") {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized.startsWith("/")) return [];
  const keyword = normalized.slice(1);
  if (!keyword) return DAY_BLOCK_COMMANDS;
  return DAY_BLOCK_COMMANDS.filter((command) => dayBlockCommandTokens(command).some((token) => (
    token.startsWith(normalized) || token.replace(/^\//, "").includes(keyword)
  )));
}

function clearDayBlockCommandMenu() {
  activeDayBlockCommand = { blockId: "", index: 0, query: "" };
  dom.dayBlockList?.querySelectorAll(".day-block-command-menu").forEach((item) => item.remove());
}

function renderDayBlockCommandMenu(input) {
  dom.dayBlockList?.querySelectorAll(".day-block-command-menu").forEach((item) => item.remove());
  if (!input || isReadonlyMode || !canEdit()) {
    activeDayBlockCommand = { blockId: "", index: 0, query: "" };
    return [];
  }
  const blockId = input.dataset.editDayBlock || "";
  const query = dayBlockCommandQueryFromValue(input.value);
  const candidates = dayBlockCommandCandidates(query);
  const wrap = input.closest(".day-block-text-wrap");
  if (!blockId || !query || !candidates.length || !wrap) {
    activeDayBlockCommand = { blockId: "", index: 0, query: "" };
    return [];
  }
  const index = activeDayBlockCommand.blockId === blockId && activeDayBlockCommand.query === query
    ? Math.max(0, Math.min(activeDayBlockCommand.index, candidates.length - 1))
    : 0;
  activeDayBlockCommand = { blockId, index, query };
  const html = `
    <div class="day-block-command-menu" role="listbox" aria-label="协作块命令">
      <strong>块类型</strong>
      ${candidates.map((command, itemIndex) => `
        <button type="button" class="${itemIndex === index ? "is-active" : ""}" data-day-block-command="${escapeHtml(command.type)}" data-command-index="${itemIndex}" role="option" aria-selected="${itemIndex === index ? "true" : "false"}">
          ${icon(dayBlockIcon(command.type))}
          <span><b>${escapeHtml(command.label)}</b><small>${escapeHtml(command.command)} · ${escapeHtml(command.description)}</small></span>
        </button>
      `).join("")}
    </div>
  `;
  wrap.insertAdjacentHTML("beforeend", html);
  refreshIcons();
  return candidates;
}

function checklistLineParts(text = "") {
  return String(text || "")
    .split(/\r?\n/)
    .map((line, sourceIndex) => ({ line, sourceIndex, trimmed: line.trim() }))
    .filter((item) => item.trimmed)
    .map((item, visibleIndex) => {
      const done = /^[-*]?\s*\[[xX✓]\]\s*/.test(item.trimmed);
      const clean = item.trimmed.replace(/^[-*]?\s*\[[ xX✓]\]\s*/, "").replace(/^[-*]\s+/, "").trim();
      return { text: clean || item.trimmed, done, sourceIndex: item.sourceIndex, visibleIndex };
    });
}

function checklistLineWithDone(line = "", done = false) {
  const text = String(line || "").trim()
    .replace(/^[-*]?\s*\[[ xX✓]\]\s*/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
  return `- [${done ? "x" : " "}] ${text || "检查项"}`;
}

function checklistTextWithToggledItem(text = "", sourceIndex = 0) {
  const lines = String(text || "").split(/\r?\n/);
  const index = Math.max(0, Math.min(Number(sourceIndex) || 0, lines.length - 1));
  const current = lines[index] || "";
  const done = /^[-*]?\s*\[[xX✓]\]\s*/.test(current.trim());
  lines[index] = checklistLineWithDone(current, !done);
  return lines.join("\n").trim();
}

function checklistTextWithAddedItem(text = "", itemText = "") {
  const cleanText = String(itemText || "").trim();
  if (!cleanText) return String(text || "").trim();
  return [...String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean), checklistLineWithDone(cleanText, false)].join("\n").trim();
}

function checklistTextWithoutItem(text = "", sourceIndex = 0) {
  const lines = String(text || "").split(/\r?\n/);
  const index = Math.max(0, Math.min(Number(sourceIndex) || 0, lines.length - 1));
  lines.splice(index, 1);
  return lines.map((line) => line.trim()).filter(Boolean).join("\n").trim();
}

function checklistTextWithMovedItem(text = "", sourceIndex = 0, direction = "down") {
  const lines = String(text || "").split(/\r?\n/);
  const index = Math.max(0, Math.min(Number(sourceIndex) || 0, lines.length - 1));
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= lines.length) return lines.map((line) => line.trim()).filter(Boolean).join("\n").trim();
  const nextLines = [...lines];
  const [item] = nextLines.splice(index, 1);
  nextLines.splice(targetIndex, 0, item);
  return nextLines.map((line) => line.trim()).filter(Boolean).join("\n").trim();
}

function dayBlockFormattedText(value = "", start = 0, end = 0, format = "bold", options = {}) {
  const text = String(value || "");
  const formats = {
    bold: { open: "**", close: "**", sample: "重点" },
    italic: { open: "*", close: "*", sample: "说明" },
    code: { open: "`", close: "`", sample: "字段" },
    link: { open: "[", close: `](${options.url || "https://example.com"})`, sample: "链接" },
  };
  const marker = formats[format] || formats.bold;
  const from = Math.max(0, Math.min(Number(start) || 0, text.length));
  const to = Math.max(from, Math.min(Number(end) || from, text.length));
  const selected = text.slice(from, to);
  const content = selected || marker.sample;
  const nextText = `${text.slice(0, from)}${marker.open}${content}${marker.close}${text.slice(to)}`;
  const selectionStart = from + marker.open.length;
  const selectionEnd = selectionStart + content.length;
  return { text: nextText, selectionStart, selectionEnd };
}

function safeMarkdownUrl(url = "") {
  const value = String(url || "").trim();
  if (/^(https?:|mailto:|tel:)/i.test(value)) return escapeHtml(value);
  if (/^[./#]/.test(value)) return escapeHtml(value);
  return "#";
}

function renderInlineMarkdown(text = "") {
  const placeholders = [];
  const token = (html) => {
    const key = `\u0000${placeholders.length}\u0000`;
    placeholders.push(html);
    return key;
  };
  let escaped = escapeHtml(String(text || ""));
  escaped = escaped.replace(/`([^`\n]+)`/g, (_, value) => token(`<code>${value}</code>`));
  escaped = escaped.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, label, url) => token(`<a href="${safeMarkdownUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`));
  escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, (_, value) => token(`<strong>${value}</strong>`));
  escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*/g, (_, prefix, value) => `${prefix}${token(`<em>${value}</em>`)}`);
  placeholders.forEach((html, index) => {
    escaped = escaped.replaceAll(`\u0000${index}\u0000`, html);
  });
  return escaped;
}

function renderDayBlockMarkdownPreview(block, force = false) {
  if (!block?.text || block.type === "checklist" || block.type === "divider") return "";
  const hasMarkup = /(\[[^\]\n]+\]\([^)]+\)|\*\*[^*\n]+\*\*|(^|[^*])\*[^*\n]+\*|`[^`\n]+`)/.test(block.text);
  if (!force && !hasMarkup) return "";
  return `<div class="day-block-markdown-preview${force ? " is-full-preview" : ""}">${String(block.text).split(/\r?\n/).map((line) => `<p>${renderInlineMarkdown(line)}</p>`).join("")}</div>`;
}

function renderChecklistPreview(block) {
  if (block.type !== "checklist") return "";
  const items = checklistLineParts(block.text || "");
  return `
    <div class="day-block-checklist-preview${items.length ? "" : " is-empty"}" aria-label="检查清单项">
      ${items.length ? "" : `<p>每行一个检查项，可用 [x] 标记完成</p>`}
      ${items.slice(0, 6).map((item) => `
        <span class="day-block-checklist-row">
          <button type="button" class="${item.done ? "is-done" : ""}" data-toggle-checklist-item="${item.sourceIndex}" aria-label="${item.done ? "取消完成" : "标记完成"}：${escapeHtml(item.text)}">
            ${icon(item.done ? "check-square" : "square")}
            <b>${escapeHtml(item.text)}</b>
          </button>
          <span class="day-block-checklist-move">
            <button type="button" data-move-checklist-item="${item.sourceIndex}" data-direction="up" aria-label="上移检查项：${escapeHtml(item.text)}"${item.visibleIndex === 0 ? " disabled" : ""}>${icon("chevron-up")}</button>
            <button type="button" data-move-checklist-item="${item.sourceIndex}" data-direction="down" aria-label="下移检查项：${escapeHtml(item.text)}"${item.visibleIndex === items.length - 1 ? " disabled" : ""}>${icon("chevron-down")}</button>
          </span>
          <button type="button" class="day-block-checklist-delete" data-delete-checklist-item="${item.sourceIndex}" aria-label="删除检查项：${escapeHtml(item.text)}">${icon("x")}</button>
        </span>
      `).join("")}
      ${items.length > 6 ? `<small>还有 ${items.length - 6} 项</small>` : ""}
      <form class="day-block-checklist-add" data-add-checklist-item="${escapeHtml(block.id)}">
        <input type="text" data-add-checklist-input="${escapeHtml(block.id)}" placeholder="新增检查项" />
        <button type="submit" aria-label="新增检查项">${icon("plus")}</button>
      </form>
    </div>
  `;
}

function dayBlockMarkdownShortcut(value = "") {
  const command = String(value || "").trim().toLowerCase();
  const shortcuts = {
    "#": "heading",
    "##": "heading",
    "---": "divider",
    "***": "divider",
    ">": "callout",
    ">>": "quote",
    "\"": "quote",
    "“": "quote",
    "!": "callout",
    "- [ ]": "checklist",
    "-[]": "checklist",
    "check": "checklist",
    "-": "todo",
    "*": "todo",
    "[]": "todo",
    "[ ]": "todo",
  };
  return shortcuts[command] || "";
}

function renderDayBlockComments(block) {
  const rendered = renderCommentThreads(block.comments || [], {
    filter: blockCommentFilters[block.id] || "all",
    filterAttr: "data-block-comment-filter",
    anchorAttr: "data-block-comment-anchor",
    replyAttr: "data-reply-block-comment",
    resolveAttr: "data-toggle-block-comment-resolved",
    deleteAttr: "data-delete-block-comment",
    emptyPrefix: "还没有块级评论。",
  });
  blockCommentFilters[block.id] = rendered.filter;
  return `<div class="day-block-comments" data-block-comments="${escapeHtml(block.id)}">${rendered.html}</div>`;
}

function renderDayBlockPresence(block) {
  const editors = remoteActiveEditorsForBlock(block.id).slice(0, 3);
  const selectors = remoteSelectorsForBlock(block.id);
  const selectorOnly = selectors
    .filter((member) => !editors.some((editor) => editor.memberId === member.memberId))
    .slice(0, Math.max(0, 3 - editors.length));
  if (!editors.length && !selectors.length) return "";
  const names = remoteBlockEditorNames(block.id);
  const selectorNames = remoteBlockSelectorNames(block.id);
  return `
    <span class="day-block-presence" title="${escapeHtml([
      ...editors.map((member) => `${member.name || "协作者"} ${member.blockEditing || "正在编辑协作块"}`),
      ...selectorOnly.map((member) => `${member.name || "协作者"} 已选中此块`),
    ].join("、"))}">
      ${names ? `<span class="day-block-presence-warning">${escapeHtml(names)} 同块编辑中</span>` : ""}
      ${selectorNames ? `<span class="day-block-presence-warning is-selection">${escapeHtml(selectorNames)} 已选中此块</span>` : ""}
      ${editors.map((member, index) => `<span class="text-presence-chip ${memberPresenceClass(member, index)}">${escapeHtml(memberInitial(member.name))}<span>${escapeHtml(member.blockEditing || "正在编辑")}</span></span>`).join("")}
      ${selectorOnly.map((member, index) => `<span class="text-presence-chip ${memberPresenceClass(member, editors.length + index)}">${escapeHtml(memberInitial(member.name))}<span>已选中</span></span>`).join("")}
    </span>
  `;
}

function refreshDayBlockTextPresence() {
  dom.dayBlockList?.querySelectorAll("[data-day-block]").forEach((blockElement) => {
    const blockId = blockElement.dataset.dayBlock || "";
    const block = normalizeDayBlocks(currentDay()?.blocks || []).find((item) => item.id === blockId);
    if (block) refreshDayBlockOverlayDom(block);
  });
}

function selectedDayBlockList(blocks = normalizeDayBlocks(currentDay()?.blocks || [])) {
  return blocks.filter((block) => selectedDayBlockIds.has(block.id));
}

function clearSelectedDayBlocks() {
  selectedDayBlockIds.clear();
  lastSelectedDayBlockId = "";
}

function selectAllDayBlocks(blocks = normalizeDayBlocks(currentDay()?.blocks || [])) {
  selectedDayBlockIds = new Set(blocks.map((block) => block.id).filter(Boolean));
}

function setDayBlockRangeSelection(blocks = [], startId = "", endId = "", selected = true) {
  const startIndex = blocks.findIndex((block) => block.id === startId);
  const endIndex = blocks.findIndex((block) => block.id === endId);
  if (startIndex < 0 || endIndex < 0) return false;
  const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  blocks.slice(from, to + 1).forEach((block) => {
    if (!block.id) return;
    if (selected) selectedDayBlockIds.add(block.id);
    else selectedDayBlockIds.delete(block.id);
  });
  return true;
}

function syncSelectedDayBlocks(blocks = normalizeDayBlocks(currentDay()?.blocks || [])) {
  const validIds = new Set(blocks.map((block) => block.id));
  selectedDayBlockIds.forEach((blockId) => {
    if (!validIds.has(blockId)) selectedDayBlockIds.delete(blockId);
  });
}

function renderDayBlockBulkBar(blocks = []) {
  const selectedBlocks = selectedDayBlockList(blocks);
  if (!selectedBlocks.length) return "";
  const count = selectedBlocks.length;
  const disabledAttr = isReadonlyMode ? " disabled" : "";
  return `
    <div class="day-block-bulk-bar" role="toolbar" aria-label="协作块批量操作">
      <strong>${count} 个块已选择</strong>
      <button type="button" class="text-btn" data-day-block-bulk="all">${icon("list-checks")}全选</button>
      <button type="button" class="text-btn" data-day-block-bulk="copy"${disabledAttr}>${icon("copy")}复制</button>
      <button type="button" class="text-btn" data-day-block-bulk="done"${disabledAttr}>${icon("check-circle-2")}完成</button>
      <button type="button" class="text-btn" data-day-block-bulk="open"${disabledAttr}>${icon("circle")}重开</button>
      <button type="button" class="text-btn" data-day-block-bulk="todo"${disabledAttr}>${icon("check-square")}设为待办</button>
      <button type="button" class="text-btn" data-day-block-bulk="note"${disabledAttr}>${icon("notebook-text")}设为备注</button>
      <button type="button" class="text-btn" data-day-block-bulk="indent"${disabledAttr}>${icon("indent-increase")}缩进</button>
      <button type="button" class="text-btn" data-day-block-bulk="outdent"${disabledAttr}>${icon("indent-decrease")}取消缩进</button>
      <button type="button" class="text-btn danger-text" data-day-block-bulk="delete"${disabledAttr}>${icon("trash-2")}删除</button>
      <button type="button" class="text-btn" data-day-block-bulk="clear">${icon("x")}取消选择</button>
    </div>
  `;
}

function refreshDayBlockSelectionDom(day = currentDay()) {
  if (!day || !dom.dayBlockList) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  syncSelectedDayBlocks(blocks);
  let allBlocksFound = true;
  for (const block of blocks) {
    if (!block?.id) continue;
    const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(block.id)}"]`);
    if (!blockElement) {
      allBlocksFound = false;
      continue;
    }
    const selected = selectedDayBlockIds.has(block.id);
    blockElement.classList.toggle("is-selected", selected);
    const checkbox = blockElement.querySelector(`[data-select-day-block="${CSS.escape(block.id)}"]`);
    if (checkbox) checkbox.checked = selected;
  }
  const existingBulkBar = dom.dayBlockList.querySelector(".day-block-bulk-bar");
  const nextBulkBarHtml = renderDayBlockBulkBar(blocks);
  if (nextBulkBarHtml) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = nextBulkBarHtml.trim();
    const nextBulkBar = wrapper.firstElementChild;
    if (!nextBulkBar) return false;
    if (existingBulkBar) existingBulkBar.replaceWith(nextBulkBar);
    else dom.dayBlockList.insertAdjacentElement("afterbegin", nextBulkBar);
  } else if (existingBulkBar) {
    existingBulkBar.remove();
  }
  refreshIcons();
  return allBlocksFound;
}

function dayBlockFocusSnapshot() {
  const input = dom.dayBlockList?.querySelector("[data-edit-day-block]:focus");
  if (!input) return null;
  const blockId = input.dataset.editDayBlock || "";
  if (!blockId) return null;
  const valueLength = String(input.value || "").length;
  const start = typeof input.selectionStart === "number" ? input.selectionStart : valueLength;
  const end = typeof input.selectionEnd === "number" ? input.selectionEnd : start;
  return {
    blockId,
    value: String(input.value || ""),
    start: Math.max(0, Math.min(start, valueLength)),
    end: Math.max(0, Math.min(end, valueLength)),
    scrollTop: input.scrollTop || 0,
  };
}

function restoreDayBlockFocus(snapshot = null) {
  if (!snapshot?.blockId || !dom.dayBlockList || isReadonlyMode) return;
  requestAnimationFrame(() => {
    const input = dom.dayBlockList?.querySelector(`[data-edit-day-block="${CSS.escape(snapshot.blockId)}"]`);
    if (!input) return;
    const value = String(input.value || "");
    const valueLength = value.length;
    const start = transformTextPosition(snapshot.value || "", value, Number(snapshot.start) || 0);
    const end = transformTextPosition(snapshot.value || "", value, Number(snapshot.end) || start);
    const safeStart = Math.max(0, Math.min(start, valueLength));
    const safeEnd = Math.max(safeStart, Math.min(end, valueLength));
    input.focus({ preventScroll: true });
    input.setSelectionRange?.(safeStart, safeEnd);
    input.scrollTop = snapshot.scrollTop || 0;
    activeBlockPresenceId = snapshot.blockId;
    schedulePresenceTrack(90);
  });
}

function refreshDayBlockOverlayDom(block) {
  if (!block?.id || !dom.dayBlockList) return false;
  const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(block.id)}"]`);
  const wrap = blockElement?.querySelector(".day-block-text-wrap");
  if (!wrap) return false;
  wrap.querySelector(".day-block-text-presence")?.remove();
  wrap.querySelectorAll(".comment-highlight").forEach((item) => item.remove());
  wrap.insertAdjacentHTML("beforeend", renderDayBlockCommentHighlights(block));
  wrap.insertAdjacentHTML("beforeend", renderDayBlockTextPresence(block));
  return true;
}

function refreshDayBlockTextDom(day = currentDay(), blockIds = []) {
  if (!day || !dom.dayBlockList || !Array.isArray(blockIds) || !blockIds.length) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  let updated = false;
  for (const blockId of blockIds) {
    const block = blocks.find((item) => item.id === blockId);
    const blockElement = blockId ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`) : null;
    const input = blockElement?.querySelector("[data-edit-day-block]");
    if (!block || !blockElement || !input) return false;
    const focused = document.activeElement === input;
    if (!focused && input.value !== block.text) input.value = block.text || "";
    const previewMode = previewDayBlockIds.has(block.id);
    const textWrap = blockElement.querySelector(".day-block-text-wrap");
    const oldPreview = textWrap?.querySelector(".day-block-markdown-preview");
    const nextPreview = renderDayBlockMarkdownPreview(block, previewMode);
    if (oldPreview) oldPreview.remove();
    if (nextPreview && input) input.insertAdjacentHTML("afterend", nextPreview);
    const oldChecklistPreview = textWrap?.querySelector(".day-block-checklist-preview");
    const nextChecklistPreview = renderChecklistPreview(block);
    if (oldChecklistPreview) oldChecklistPreview.remove();
    if (nextChecklistPreview) {
      const previewElement = textWrap?.querySelector(".day-block-markdown-preview");
      (previewElement || input).insertAdjacentHTML("afterend", nextChecklistPreview);
    }
    const collapsedPreview = blockElement.querySelector(".day-block-collapsed-text");
    if (collapsedPreview) collapsedPreview.textContent = block.text ? block.text.replace(/\s+/g, " ").slice(0, 96) : dayBlockTypeLabel(block.type);
    const metaElement = blockElement.querySelector(".day-block-meta");
    if (metaElement) {
      metaElement.textContent = block.updatedBy || block.createdBy
        ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
        : dayBlockTypeLabel(block.type);
    }
    refreshDayBlockOverlayDom(block);
    updated = true;
  }
  if (updated) {
    refreshIcons();
    requestAnimationFrame(() => refreshDayBlockTextPresence());
  }
  return updated;
}

function refreshDayBlocksStatusText(blocks = normalizeDayBlocks(currentDay()?.blocks || [])) {
  if (!dom.dayBlocksStatus) return;
  const openCount = blocks.filter((block) => block.type === "todo" && !block.done).length;
  const commentCount = blocks.reduce((sum, block) => sum + commentRootsAndReplies(block.comments || []).roots.length, 0);
  dom.dayBlocksStatus.textContent = blocks.length ? `${blocks.length} 个块 · ${openCount} 个待办 · ${commentCount} 条评论` : "可添加块";
}

function refreshDayBlockDoneDom(day = currentDay(), blockIds = []) {
  if (!day || !dom.dayBlockList || !Array.isArray(blockIds) || !blockIds.length) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  let updated = false;
  for (const blockId of blockIds) {
    const block = blocks.find((item) => item.id === blockId);
    const blockElement = blockId ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`) : null;
    if (!block || !blockElement) return false;
    blockElement.classList.toggle("is-done", Boolean(block.done));
    const toggleButton = blockElement.querySelector(`[data-toggle-day-block="${CSS.escape(blockId)}"]`);
    if (toggleButton) {
      const toggleLabel = block.type === "divider" ? "分隔线" : block.done ? "标记未完成" : "标记完成";
      toggleButton.setAttribute("aria-label", toggleLabel);
      toggleButton.innerHTML = icon(block.done ? "check-circle-2" : dayBlockIcon(block.type));
    }
    const metaElement = blockElement.querySelector(".day-block-meta");
    if (metaElement) {
      metaElement.textContent = block.updatedBy || block.createdBy
        ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
        : dayBlockTypeLabel(block.type);
    }
    updated = true;
  }
  if (updated) {
    refreshDayBlocksStatusText(blocks);
    refreshDayBlockSelectionDom(day);
    refreshIcons();
    requestAnimationFrame(() => refreshDayBlockTextPresence());
  }
  return updated;
}

function refreshDayBlockLevelDom(day = currentDay(), blockIds = []) {
  if (!day || !dom.dayBlockList || !Array.isArray(blockIds) || !blockIds.length) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  let updated = false;
  for (const blockId of blockIds) {
    const block = blocks.find((item) => item.id === blockId);
    const blockElement = blockId ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`) : null;
    if (!block || !blockElement) return false;
    const level = Math.max(0, Math.min(Number(block.level) || 0, 3));
    blockElement.dataset.blockLevel = String(level);
    blockElement.style.setProperty("--block-level", String(level));
    const metaElement = blockElement.querySelector(".day-block-meta");
    if (metaElement) {
      metaElement.textContent = block.updatedBy || block.createdBy
        ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
        : dayBlockTypeLabel(block.type);
    }
    refreshDayBlockOverlayDom(block);
    updated = true;
  }
  if (updated) {
    refreshDayBlockSelectionDom(day);
    refreshIcons();
    requestAnimationFrame(() => refreshDayBlockTextPresence());
  }
  return updated;
}

function refreshDayBlockOrderDom(day = currentDay(), focusBlockId = "") {
  if (!day || !dom.dayBlockList) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  if (!blocks.length) return false;
  const focusSnapshot = dayBlockFocusSnapshot();
  const blockElements = new Map();
  for (const block of blocks) {
    const blockElement = block.id ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(block.id)}"]`) : null;
    if (!blockElement) return false;
    blockElements.set(block.id, blockElement);
  }
  const validIds = new Set(blocks.map((block) => block.id));
  dom.dayBlockList.querySelectorAll("[data-day-block]").forEach((blockElement) => {
    if (!validIds.has(blockElement.dataset.dayBlock || "")) blockElement.remove();
  });
  blocks.forEach((block, index) => {
    const blockElement = blockElements.get(block.id);
    blockElement.querySelectorAll(`[data-move-day-block="${CSS.escape(block.id)}"]`).forEach((button) => {
      const direction = button.dataset.direction === "up" ? "up" : "down";
      button.disabled = isReadonlyMode || (direction === "up" ? index === 0 : index === blocks.length - 1);
    });
    dom.dayBlockList.appendChild(blockElement);
    refreshDayBlockOverlayDom(block);
  });
  refreshDayBlocksStatusText(blocks);
  refreshDayBlockSelectionDom(day);
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
  if (focusSnapshot?.blockId) restoreDayBlockFocus(focusSnapshot);
  else if (focusBlockId) focusDayBlockInput(focusBlockId);
  return true;
}

function refreshDayBlockDeleteDom(day = currentDay(), deletedIds = []) {
  if (!day || !dom.dayBlockList || !Array.isArray(deletedIds) || !deletedIds.length) return false;
  let removed = false;
  deletedIds.forEach((blockId) => {
    if (!blockId) return;
    const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
    if (!blockElement) return;
    blockElement.remove();
    removed = true;
  });
  if (!removed) return false;
  deletedIds.forEach((blockId) => {
    selectedDayBlockIds.delete(blockId);
    previewDayBlockIds.delete(blockId);
    collapsedDayBlockIds.delete(blockId);
    delete blockCommentFilters[blockId];
  });
  if (deletedIds.includes(lastSelectedDayBlockId)) lastSelectedDayBlockId = "";
  if (deletedIds.includes(activeBlockPresenceId)) activeBlockPresenceId = "";
  const blocks = normalizeDayBlocks(day.blocks || []);
  if (!blocks.length) {
    renderDayBlocks(day);
    return true;
  }
  refreshDayBlockOrderDom(day);
  return true;
}

function refreshDayBlockInsertDom(day = currentDay(), insertedIds = [], focusBlockId = "") {
  if (!day || !dom.dayBlockList || !Array.isArray(insertedIds) || !insertedIds.length) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  const insertedSet = new Set(insertedIds.filter(Boolean));
  if (!blocks.length) return false;
  dom.dayBlockList.querySelector(".empty-state")?.remove();
  const disabledAttr = isReadonlyMode ? " disabled" : "";
  let inserted = false;
  for (const blockId of insertedSet) {
    const index = blocks.findIndex((block) => block.id === blockId);
    const block = index >= 0 ? blocks[index] : null;
    if (!block) return false;
    const existing = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
    if (existing) continue;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = renderDayBlockHtml(block, index, blocks, disabledAttr).trim();
    const blockElement = wrapper.firstElementChild;
    if (!blockElement) return false;
    const nextBlock = blocks.slice(index + 1).find((item) => !insertedSet.has(item.id));
    const nextElement = nextBlock?.id ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(nextBlock.id)}"]`) : null;
    if (nextElement) dom.dayBlockList.insertBefore(blockElement, nextElement);
    else dom.dayBlockList.appendChild(blockElement);
    inserted = true;
  }
  if (!inserted) return refreshDayBlockOrderDom(day, focusBlockId);
  refreshDayBlockOrderDom(day, focusBlockId);
  return true;
}

function dayBlockRowsForType(type = "todo") {
  if (type === "heading" || type === "divider") return 1;
  if (type === "checklist") return 3;
  return 2;
}

function dayBlockPlaceholderForType(type = "todo") {
  if (type === "divider") return "分隔线标题（可选）";
  if (type === "checklist") return "每行一个检查项，可写 [x] 表示已完成";
  return "";
}

function refreshDayBlockTypeDom(day = currentDay(), blockIds = []) {
  if (!day || !dom.dayBlockList || !Array.isArray(blockIds) || !blockIds.length) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  let updated = false;
  for (const blockId of blockIds) {
    const block = blocks.find((item) => item.id === blockId);
    const blockElement = blockId ? dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`) : null;
    const input = blockElement?.querySelector("[data-edit-day-block]");
    if (!block || !blockElement || !input) return false;
    DAY_BLOCK_TYPES.forEach((type) => blockElement.classList.toggle(`is-${type}`, type === block.type));
    blockElement.classList.toggle("is-done", Boolean(block.done));
    input.rows = dayBlockRowsForType(block.type);
    input.placeholder = dayBlockPlaceholderForType(block.type);
    input.setAttribute("aria-label", dayBlockTypeLabel(block.type));
    const typeSelect = blockElement.querySelector(`[data-day-block-type="${CSS.escape(blockId)}"]`);
    if (typeSelect) typeSelect.innerHTML = dayBlockTypeOptions(block.type);
    const toggleButton = blockElement.querySelector(`[data-toggle-day-block="${CSS.escape(blockId)}"]`);
    if (toggleButton) {
      const disabled = block.type === "divider" || isReadonlyMode;
      toggleButton.disabled = disabled;
      toggleButton.setAttribute("aria-label", block.type === "divider" ? "分隔线" : block.done ? "标记未完成" : "标记完成");
      toggleButton.innerHTML = icon(block.done ? "check-circle-2" : dayBlockIcon(block.type));
    }
    const collapsedPreview = blockElement.querySelector(".day-block-collapsed-text");
    if (collapsedPreview) collapsedPreview.textContent = block.text ? block.text.replace(/\s+/g, " ").slice(0, 96) : dayBlockTypeLabel(block.type);
    const metaElement = blockElement.querySelector(".day-block-meta");
    if (metaElement) {
      metaElement.textContent = block.updatedBy || block.createdBy
        ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
        : dayBlockTypeLabel(block.type);
    }
    if (!refreshDayBlockTextDom(day, [blockId])) return false;
    updated = true;
  }
  if (updated) {
    refreshDayBlocksStatusText(blocks);
    refreshDayBlockSelectionDom(day);
    refreshIcons();
    requestAnimationFrame(() => refreshDayBlockTextPresence());
  }
  return updated;
}

function refreshDayBlockPreviewDom(day = currentDay(), blockId = "") {
  if (!day || !dom.dayBlockList || !blockId) return false;
  const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
  const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
  const textWrap = blockElement?.querySelector(".day-block-text-wrap");
  const input = blockElement?.querySelector("[data-edit-day-block]");
  const button = blockElement?.querySelector(`[data-toggle-day-block-preview="${CSS.escape(blockId)}"]`);
  if (!block || !blockElement || !textWrap || !input || !button) return false;
  const previewMode = previewDayBlockIds.has(blockId);
  blockElement.classList.toggle("is-previewing", previewMode);
  const oldPreview = textWrap.querySelector(".day-block-markdown-preview");
  const nextPreview = renderDayBlockMarkdownPreview(block, previewMode);
  if (oldPreview) oldPreview.remove();
  if (nextPreview) input.insertAdjacentHTML("afterend", nextPreview);
  button.title = previewMode ? "编辑" : "预览";
  button.setAttribute("aria-label", previewMode ? "切回编辑" : "预览富文本");
  button.innerHTML = icon(previewMode ? "pencil" : "eye");
  refreshDayBlockOverlayDom(block);
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
  return true;
}

function refreshDayBlockCollapseDom(day = currentDay(), blockId = "") {
  if (!day || !dom.dayBlockList || !blockId) return false;
  const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
  const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
  if (!block || !blockElement) return false;
  const collapsed = collapsedDayBlockIds.has(blockId);
  blockElement.classList.toggle("is-collapsed", collapsed);
  const collapsedPreview = blockElement.querySelector(".day-block-collapsed-text");
  if (collapsedPreview) {
    collapsedPreview.textContent = block.text ? block.text.replace(/\s+/g, " ").slice(0, 96) : dayBlockTypeLabel(block.type);
  }
  blockElement.querySelectorAll(`[data-toggle-day-block-collapse="${CSS.escape(blockId)}"]`).forEach((button) => {
    const isSummaryButton = button.classList.contains("day-block-collapsed-text");
    button.setAttribute("aria-label", isSummaryButton || collapsed ? "展开协作块" : "折叠协作块");
    if (!isSummaryButton) button.innerHTML = icon(collapsed ? "chevrons-down-up" : "chevrons-up-down");
  });
  refreshDayBlockOverlayDom(block);
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
  return true;
}

function refreshDayBlockCommentsDom(day = currentDay(), blockId = "") {
  if (!day || !dom.dayBlockList || !blockId) return false;
  const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
  const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
  const commentsElement = blockElement?.querySelector(`[data-block-comments="${CSS.escape(blockId)}"]`);
  if (!block || !blockElement || !commentsElement) return false;
  const rendered = renderDayBlockComments(block);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = rendered;
  const nextCommentsElement = wrapper.firstElementChild;
  if (!nextCommentsElement) return false;
  commentsElement.replaceWith(nextCommentsElement);
  const openCommentCount = commentRootsAndReplies(block.comments || []).roots.filter((comment) => !comment.resolved).length;
  const toggleButton = blockElement.querySelector("[data-toggle-block-comments]");
  if (toggleButton) {
    toggleButton.innerHTML = `${icon("message-square")}评论${openCommentCount ? ` ${openCommentCount}` : ""}`;
  }
  const metaElement = blockElement.querySelector(".day-block-meta");
  if (metaElement) {
    metaElement.textContent = block.updatedBy || block.createdBy
      ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
      : dayBlockTypeLabel(block.type);
  }
  refreshDayBlockOverlayDom(block);
  refreshIcons();
  return true;
}

function refreshDayBlockCommentMutationViews(day = currentDay(), blockId = "") {
  const refreshed = refreshDayBlockCommentsDom(day, blockId);
  if (!refreshed) return false;
  refreshDayBlocksStatusText(normalizeDayBlocks(day.blocks || []));
  renderCommentIndex();
  refreshIcons();
  return true;
}

function refreshDayBlockPresenceDom(day = currentDay()) {
  if (!day || !dom.dayBlockList) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  let allBlocksFound = true;
  let updated = false;
  for (const block of blocks) {
    if (!block?.id) continue;
    const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(block.id)}"]`);
    if (!blockElement) {
      allBlocksFound = false;
      continue;
    }
    const remoteSelected = remoteSelectorsForBlock(block.id).length > 0;
    blockElement.classList.toggle("is-remote-selected", remoteSelected);
    blockElement.querySelector(".day-block-presence")?.remove();
    const presenceHtml = renderDayBlockPresence(block);
    if (presenceHtml) {
      const commentToggle = blockElement.querySelector(".day-block-comment-toggle");
      if (commentToggle) commentToggle.insertAdjacentHTML("beforebegin", presenceHtml);
      else blockElement.insertAdjacentHTML("beforeend", presenceHtml);
    }
    refreshDayBlockOverlayDom(block);
    updated = true;
  }
  if (updated) {
    refreshIcons();
    requestAnimationFrame(() => refreshDayBlockTextPresence());
  }
  return allBlocksFound;
}

function refreshRecordPresenceCards() {
  let updated = false;
  dom.transportList?.querySelectorAll("[data-quote]").forEach((card) => {
    const quoteId = card.dataset.quote || "";
    const editors = remoteRecordEditorNames("transportQuote", quoteId);
    card.classList.toggle("is-remote-editing", Boolean(editors));
    card.querySelector(".record-presence")?.remove();
    if (editors) {
      const detail = card.querySelector(":scope > div");
      detail?.insertAdjacentHTML("beforeend", `<small class="record-presence">${escapeHtml(editors)} 正在编辑这条报价</small>`);
    }
    updated = true;
  });
  dom.candidateGrid?.querySelectorAll("[data-candidate-id]").forEach((card) => {
    const candidateId = card.dataset.candidateId || "";
    const editors = remoteRecordEditorNames("candidate", candidateId);
    card.classList.toggle("is-remote-editing", Boolean(editors));
    card.querySelector(".record-presence")?.remove();
    if (editors) {
      const meta = card.querySelector(".candidate-meta");
      meta?.insertAdjacentHTML("afterend", `<span class="record-presence">${escapeHtml(editors)} 正在编辑</span>`);
    }
    updated = true;
  });
  return updated;
}

function refreshPresenceViews() {
  renderMembers();
  if (!refreshDayBlockPresenceDom(currentDay())) {
    renderDayBlocks(currentDay());
  }
  refreshRecordPresenceCards();
  renderEditorLockState();
}

function renderDayBlockHtml(block, index = 0, blocks = normalizeDayBlocks(currentDay()?.blocks || []), disabledAttr = isReadonlyMode ? " disabled" : "") {
  const doneClass = block.done ? " is-done" : "";
  const typeClass = ` is-${block.type || "todo"}`;
  const collapsed = collapsedDayBlockIds.has(block.id);
  const collapsedClass = collapsed ? " is-collapsed" : "";
  const selected = selectedDayBlockIds.has(block.id);
  const selectedClass = selected ? " is-selected" : "";
  const previewMode = previewDayBlockIds.has(block.id);
  const previewClass = previewMode ? " is-previewing" : "";
  const remoteSelectors = remoteSelectorsForBlock(block.id);
  const remoteSelectedClass = remoteSelectors.length ? " is-remote-selected" : "";
  const comments = normalizeComments(block.comments || []);
  const openCommentCount = commentRootsAndReplies(comments).roots.filter((comment) => !comment.resolved).length;
  const commentPanelId = `block-comments-${block.id}`;
  const meta = block.updatedBy || block.createdBy
    ? `${block.updatedBy ? `更新：${block.updatedBy}` : `创建：${block.createdBy}`}`
    : dayBlockTypeLabel(block.type);
  const upDisabled = isReadonlyMode || index === 0 ? " disabled" : "";
  const downDisabled = isReadonlyMode || index === blocks.length - 1 ? " disabled" : "";
  const replyTarget = blockReplyingCommentId ? comments.find((comment) => comment.id === blockReplyingCommentId && !comment.parentId) : null;
  const placeholder = replyTarget ? `回复 ${replyTarget.author || "成员"}：${replyTarget.text.slice(0, 18)}` : "评论这个协作块";
  const presenceHtml = renderDayBlockPresence(block);
  const rows = dayBlockRowsForType(block.type);
  const collapsedPreview = block.text ? block.text.replace(/\s+/g, " ").slice(0, 96) : dayBlockTypeLabel(block.type);
  const toggleDisabled = block.type === "divider" ? " disabled" : disabledAttr;
  const toggleLabel = block.type === "divider" ? "分隔线" : block.done ? "标记未完成" : "标记完成";
  const textPlaceholder = dayBlockPlaceholderForType(block.type);
  return `
    <article class="day-block${doneClass}${typeClass}${collapsedClass}${selectedClass}${previewClass}${remoteSelectedClass}" data-day-block="${escapeHtml(block.id)}" data-block-level="${block.level || 0}" style="--block-level:${block.level || 0}">
      <label class="day-block-select" title="选择协作块">
        <input type="checkbox" data-select-day-block="${escapeHtml(block.id)}" aria-label="选择协作块"${selected ? " checked" : ""} />
      </label>
      <button type="button" class="day-block-drag" data-drag-day-block="${escapeHtml(block.id)}" draggable="${isReadonlyMode ? "false" : "true"}" aria-label="拖拽排序协作块"${disabledAttr}>${icon("grip-vertical")}</button>
      <button type="button" class="day-block-toggle" data-toggle-day-block="${escapeHtml(block.id)}" aria-label="${toggleLabel}"${toggleDisabled}>${icon(block.done ? "check-circle-2" : dayBlockIcon(block.type))}</button>
      <span class="day-block-text-wrap">
        <span class="day-block-format-toolbar" role="toolbar" aria-label="协作块文字格式">
          <button type="button" data-format-day-block="${escapeHtml(block.id)}" data-format="bold" title="加粗" aria-label="加粗"${disabledAttr}>${icon("bold")}</button>
          <button type="button" data-format-day-block="${escapeHtml(block.id)}" data-format="italic" title="斜体" aria-label="斜体"${disabledAttr}>${icon("italic")}</button>
          <button type="button" data-format-day-block="${escapeHtml(block.id)}" data-format="code" title="行内代码" aria-label="行内代码"${disabledAttr}>${icon("code-2")}</button>
          <button type="button" data-format-day-block="${escapeHtml(block.id)}" data-format="link" title="链接" aria-label="链接"${disabledAttr}>${icon("link")}</button>
          <button type="button" data-toggle-day-block-preview="${escapeHtml(block.id)}" title="${previewMode ? "编辑" : "预览"}" aria-label="${previewMode ? "切回编辑" : "预览富文本"}">${icon(previewMode ? "pencil" : "eye")}</button>
        </span>
        <textarea class="day-block-text" data-edit-day-block="${escapeHtml(block.id)}" rows="${rows}" aria-label="${escapeHtml(dayBlockTypeLabel(block.type))}" placeholder="${escapeHtml(textPlaceholder)}"${disabledAttr}>${escapeHtml(block.text)}</textarea>
        ${renderDayBlockMarkdownPreview(block, previewMode)}
        ${renderChecklistPreview(block)}
        ${renderDayBlockTextPresence(block)}
      </span>
      <button type="button" class="day-block-collapsed-text" data-toggle-day-block-collapse="${escapeHtml(block.id)}" aria-label="展开协作块">${escapeHtml(collapsedPreview)}</button>
      <label class="day-block-type-control" title="切换块类型">
        <span>类型</span>
        <select data-day-block-type="${escapeHtml(block.id)}" aria-label="切换协作块类型"${disabledAttr}>${dayBlockTypeOptions(block.type)}</select>
      </label>
      <span class="day-block-meta">${escapeHtml(meta)}</span>
      ${presenceHtml}
      <button type="button" class="comment-action day-block-comment-toggle" data-toggle-block-comments="${escapeHtml(block.id)}" aria-controls="${escapeHtml(commentPanelId)}">${icon("message-square")}评论${openCommentCount ? ` ${openCommentCount}` : ""}</button>
      <span class="day-block-order">
        <button type="button" class="icon-btn subtle" data-move-day-block="${escapeHtml(block.id)}" data-direction="up" aria-label="上移协作块"${upDisabled}>${icon("chevron-up")}</button>
        <button type="button" class="icon-btn subtle" data-move-day-block="${escapeHtml(block.id)}" data-direction="down" aria-label="下移协作块"${downDisabled}>${icon("chevron-down")}</button>
        <button type="button" class="icon-btn subtle" data-duplicate-day-block="${escapeHtml(block.id)}" aria-label="复制协作块"${disabledAttr}>${icon("copy")}</button>
        <button type="button" class="icon-btn subtle" data-toggle-day-block-collapse="${escapeHtml(block.id)}" aria-label="${collapsed ? "展开协作块" : "折叠协作块"}">${icon(collapsed ? "chevrons-down-up" : "chevrons-up-down")}</button>
      </span>
      <button type="button" class="icon-btn subtle danger-icon" data-delete-day-block="${escapeHtml(block.id)}" aria-label="删除协作块"${disabledAttr}>${icon("trash-2")}</button>
      <div class="day-block-comment-panel" id="${escapeHtml(commentPanelId)}">
        ${renderDayBlockComments(block)}
        <form class="comment-form day-block-comment-form" data-block-comment-form="${escapeHtml(block.id)}">
          <input data-block-comment-input="${escapeHtml(block.id)}" placeholder="${escapeHtml(placeholder)}"${disabledAttr} />
          <button class="primary-btn" type="submit" aria-label="${replyTarget ? "回复块级评论" : "添加块级评论"}"${disabledAttr}>${icon(replyTarget ? "reply" : "send")}</button>
        </form>
      </div>
    </article>
  `;
}

function renderDayBlocks(day = currentDay()) {
  if (!day || !dom.dayBlockList) return;
  const focusSnapshot = dayBlockFocusSnapshot();
  const blocks = normalizeDayBlocks(day.blocks || []);
  const disabledAttr = isReadonlyMode ? " disabled" : "";
  const blockIds = new Set(blocks.map((block) => block.id));
  syncSelectedDayBlocks(blocks);
  Object.keys(blockCommentFilters).forEach((blockId) => {
    if (!blockIds.has(blockId)) delete blockCommentFilters[blockId];
  });
  previewDayBlockIds.forEach((blockId) => {
    if (!blockIds.has(blockId)) previewDayBlockIds.delete(blockId);
  });
  if (blockReplyingCommentId && !blocks.some((block) => normalizeComments(block.comments || []).some((comment) => comment.id === blockReplyingCommentId && !comment.parentId))) {
    blockReplyingCommentId = "";
  }
  dayBlockTextBaselines = Object.fromEntries(blocks.map((block) => [block.id, block.text || ""]));
  refreshDayBlocksStatusText(blocks);
  const blocksHtml = blocks.length
    ? blocks
        .map((block, index) => renderDayBlockHtml(block, index, blocks, disabledAttr))
        .join("")
    : `<div class="empty-state">还没有协作块，可以添加待办、备注、决定、标题或提醒。</div>`;
  dom.dayBlockList.innerHTML = `${renderDayBlockBulkBar(blocks)}${blocksHtml}`;
  refreshIcons();
  if (focusSnapshot && blocks.some((block) => block.id === focusSnapshot.blockId)) {
    restoreDayBlockFocus(focusSnapshot);
  }
  requestAnimationFrame(() => refreshDayBlockTextPresence());
}

function focusDayBlockInput(blockId = "") {
  if (!blockId || !dom.dayBlockList) return;
  requestAnimationFrame(() => {
    const input = dom.dayBlockList.querySelector(`[data-edit-day-block="${CSS.escape(blockId)}"]`);
    if (!input) return;
    input.focus();
    const length = input.value.length;
    input.setSelectionRange?.(length, length);
  });
}

async function applyDayBlockTypeChange(day, blockId, nextType, options = {}) {
  const {
    clearText = false,
    source = "local-day-block-type-change",
    fallbackSource = `${source}-fallback`,
    presence = "切换类型",
    action = "type-change",
    requireLabel = "切换协作块类型",
    status = "已切换协作块类型",
    focus = true,
  } = options;
  if (!day || !blockId || !DAY_BLOCK_TYPES.includes(nextType)) return false;
  const blocks = normalizeDayBlocks(day.blocks || []);
  const block = blocks.find((item) => item.id === blockId);
  if (!block) return false;
  const patch = clearText ? { type: nextType, text: "", textYjs: "" } : { type: nextType };
  const hasChange = block.type !== nextType || (clearText && (block.text || block.textYjs));
  if (!hasChange) {
    if (focus) focusDayBlockInput(blockId);
    return false;
  }
  if (!requireEdit(requireLabel)) return false;
  if (!confirmRemoteDayBlockEdit(blockId, presence)) return false;
  activeBlockPresenceId = blockId;
  schedulePresenceTrack(0);
  noteRemoteBlockEditors(blockId, presence);
  const updated = await updateDayBlockInDoc(day.id, blockId, patch, source);
  if (updated) {
    const visiblePatch = typeof updated === "object" ? { ...patch, ...updated } : patch;
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
      item.id === blockId ? { ...item, ...visiblePatch, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
    )));
    clearDayBlockCommandMenu();
    if (clearText || !refreshDayBlockTypeDom(day, [blockId])) renderDayBlocks(day);
    await logActivity(`切换协作块为${dayBlockTypeLabel(nextType)}`, { target: dayBlockActivityTarget(day.id, blockId, { action, blockType: nextType }) });
    await saveCollaborativePlanChange(status);
    if (focus) focusDayBlockInput(blockId);
    return true;
  }
  if (!mutate(requireLabel, () => {
    currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === blockId ? { ...item, ...patch } : item)));
  }, { requireUnlocked: false, save: false, render: false })) return false;
  await syncDayBlocksToDoc(day.id, fallbackSource);
  clearDayBlockCommandMenu();
  if (clearText || !refreshDayBlockTypeDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
  await logActivity(`切换协作块为${dayBlockTypeLabel(nextType)}`, { target: dayBlockActivityTarget(day.id, blockId, { action, blockType: nextType }) });
  await saveCollaborativePlanChange(status);
  if (focus) focusDayBlockInput(blockId);
  return true;
}

async function applyDayBlockCommandSelection(input, index = activeDayBlockCommand.index) {
  if (!input) return false;
  const day = currentDay();
  const blockId = input.dataset.editDayBlock || "";
  const candidates = dayBlockCommandCandidates(dayBlockCommandQueryFromValue(input.value));
  const command = candidates[Math.max(0, Math.min(index || 0, candidates.length - 1))];
  if (!day || !blockId || !command) return false;
  clearTimeout(dayBlockEditTimer);
  return applyDayBlockTypeChange(day, blockId, command.type, {
    clearText: true,
    source: "local-day-block-command-menu",
    fallbackSource: "local-day-block-command-menu-fallback",
    presence: "使用命令菜单",
    action: "command-menu",
    requireLabel: "使用协作块命令",
    status: "已使用协作块命令",
  });
}

async function saveDayBlockTextChange(day, block, nextText, action = "text-format", label = "协作块已更新") {
  if (!day || !block?.id || !requireEdit("更新协作块文本")) return false;
  activeBlockPresenceId = block.id;
  schedulePresenceTrack(0);
  noteRemoteBlockEditors(block.id, "更新文本");
  const origin = `local-day-block-${action}`;
  const updatedText = await updateDayBlockTextInDoc(day.id, block.id, nextText, origin);
  if (updatedText) {
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
      item.id === block.id ? { ...item, ...updatedText, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
    )));
    if (!refreshDayBlockTextDom(day, [block.id])) renderDayBlocks(day);
    await logActivity(`编辑协作块「${String(nextText || "").slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, block.id, { action }) });
    await saveCollaborativePlanChange(label);
    return true;
  }
  if (!mutate("更新协作块文本", () => {
    currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, text: nextText } : item)));
  }, { requireUnlocked: false, save: false, render: false })) return false;
  await syncDayBlocksToDoc(day.id, `${origin}-fallback`);
  await logActivity(`编辑协作块「${String(nextText || "").slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, block.id, { action }) });
  await saveCollaborativePlanChange(label);
  render();
  return true;
}

async function syncDayBlockInputText(day, blockId, text, input = null) {
  if (!day || !blockId) return false;
  const syncTask = async () => {
    const currentBlocks = normalizeDayBlocks(day.blocks || []);
    const baseText = Object.prototype.hasOwnProperty.call(dayBlockTextBaselines, blockId)
      ? dayBlockTextBaselines[blockId]
      : (currentBlocks.find((item) => item.id === blockId)?.text || "");
    const updatedText = await updateDayBlockTextInDoc(day.id, blockId, text, "local-day-block-text-realtime", { baseText });
    if (updatedText) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, ...updatedText, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      dayBlockTextBaselines[blockId] = updatedText.text || "";
      if (input && input.value.trim() !== (updatedText.text || "")) input.value = updatedText.text || "";
      const blockElement = dom.dayBlockList?.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
      const metaElement = blockElement?.querySelector(".day-block-meta");
      if (metaElement) metaElement.textContent = `更新：${getCollabName()}`;
      scheduleCollaborativePlanSave("协作块已更新", 1000);
      return updatedText;
    }
    const block = currentBlocks.find((item) => item.id === blockId);
    if (!block) return false;
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, text } : item)));
    await syncDayBlocksToDoc(day.id, "local-day-block-text-fallback");
    dayBlockTextBaselines[blockId] = text || "";
    scheduleCollaborativePlanSave("协作块已更新", 1000);
    return { text };
  };
  const previous = dayBlockTextSyncChains[blockId] || Promise.resolve();
  const next = previous.catch(() => false).then(syncTask);
  dayBlockTextSyncChains[blockId] = next.finally(() => {
    if (dayBlockTextSyncChains[blockId] === next) delete dayBlockTextSyncChains[blockId];
  });
  return next;
}

async function formatDayBlockInput(day, block, input, format = "bold") {
  if (!day || !block?.id || !input) return false;
  let formatOptions = {};
  if (format === "link") {
    const currentSelection = input.value.slice(input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length).trim();
    const url = window.prompt("输入链接地址", /^https?:\/\//i.test(currentSelection) ? currentSelection : "https://");
    if (url === null) return false;
    const safeUrl = safeMarkdownUrl(url);
    if (safeUrl === "#") {
      dom.saveState.textContent = "链接地址需要以 http、https、mailto、tel、/、. 或 # 开头";
      return false;
    }
    formatOptions = { url: safeUrl };
  }
  const formatted = dayBlockFormattedText(input.value, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, format, formatOptions);
  const saved = await saveDayBlockTextChange(day, block, formatted.text, `format-${format}`, "已格式化协作块文本");
  if (saved) {
    requestAnimationFrame(() => {
      const nextInput = dom.dayBlockList?.querySelector(`[data-edit-day-block="${CSS.escape(block.id)}"]`);
      if (!nextInput) return;
      nextInput.focus();
      nextInput.setSelectionRange?.(formatted.selectionStart, formatted.selectionEnd);
    });
  }
  return saved;
}

async function saveChecklistTextChange(day, block, nextText, action = "checklist-update") {
  if (!day || !block?.id || block.type !== "checklist" || !requireEdit("更新检查清单")) return false;
  activeBlockPresenceId = block.id;
  schedulePresenceTrack(0);
  noteRemoteBlockEditors(block.id, "更新检查清单");
  const origin = `local-day-block-${action}`;
  const updatedText = await updateDayBlockTextInDoc(day.id, block.id, nextText, origin);
  if (updatedText) {
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
      item.id === block.id ? { ...item, ...updatedText, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
    )));
    if (!refreshDayBlockTextDom(day, [block.id])) renderDayBlocks(day);
    await logActivity(`更新检查清单「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, block.id, { action }) });
    await saveCollaborativePlanChange("已更新检查清单");
    return true;
  }
  if (!mutate("更新检查清单", () => {
    currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, text: nextText } : item)));
  }, { requireUnlocked: false, save: false, render: false })) return false;
  await syncDayBlocksToDoc(day.id, `${origin}-fallback`);
  await logActivity(`更新检查清单「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, block.id, { action }) });
  await saveCollaborativePlanChange("已更新检查清单");
  render();
  return true;
}

async function moveDayBlockByDirection(day, blockId, direction = "down", action = "move") {
  const blocks = normalizeDayBlocks(day?.blocks || []);
  const block = blocks.find((item) => item.id === blockId);
  if (!day || !block || !requireEdit("排序协作块")) return false;
  const offset = direction === "up" ? -1 : 1;
  const index = blocks.findIndex((item) => item.id === blockId);
  const targetIndex = index + offset;
  if (targetIndex < 0 || targetIndex >= blocks.length) {
    dom.saveState.textContent = direction === "up" ? "已经是第一个协作块" : "已经是最后一个协作块";
    return false;
  }
  if (!confirmRemoteDayBlockEdit(blockId, action === "keyboard-move" ? "键盘排序" : "排序")) return false;
  activeBlockPresenceId = blockId;
  schedulePresenceTrack(0);
  noteRemoteBlockEditors(blockId, action === "keyboard-move" ? "键盘排序" : "排序");
  if (await moveDayBlockInDoc(day.id, blockId, direction, `local-day-block-${action}`)) {
    day.blocks = moveDayBlockList(day.blocks || [], blockId, direction, {
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!refreshDayBlockOrderDom(day, blockId)) renderDayBlocks(day);
    await logActivity(`排序协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, blockId, { action, direction }) });
    await saveCollaborativePlanChange("已排序协作块");
    return true;
  }
  if (!mutate("排序协作块", () => {
    currentDay().blocks = moveDayBlockList(currentDay().blocks || [], blockId, direction);
  }, { requireUnlocked: false, save: false, render: false })) return false;
  await syncDayBlocksToDoc(day.id, `local-day-block-${action}-fallback`);
  await logActivity(`排序协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, blockId, { action, direction }) });
  await saveCollaborativePlanChange("已排序协作块");
  if (!refreshDayBlockOrderDom(currentDay(), blockId)) renderDayBlocks(currentDay());
  return true;
}

async function setSelectedDayBlockType(day, nextType) {
  const selectedBlocks = selectedDayBlockList(normalizeDayBlocks(day?.blocks || []));
  if (!day || !selectedBlocks.length || !DAY_BLOCK_TYPES.includes(nextType) || !requireEdit("批量切换协作块类型")) return false;
  if (!confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量切换类型")) return false;
  let changedCount = 0;
  for (const block of selectedBlocks) {
    if (block.type === nextType) continue;
    noteRemoteBlockEditors(block.id, "批量切换类型");
    const updated = await updateDayBlockInDoc(day.id, block.id, { type: nextType }, "local-day-block-bulk-type");
    if (updated) {
      changedCount += 1;
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
        item.id === block.id ? { ...item, type: nextType, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
      )));
    }
  }
  if (!changedCount) {
    const fallbackBlocks = normalizeDayBlocks((day.blocks || []).map((block) => (
      selectedDayBlockIds.has(block.id) && block.type !== nextType ? { ...block, type: nextType } : block
    )));
    changedCount = fallbackBlocks.filter((block) => selectedDayBlockIds.has(block.id) && block.type === nextType).length;
    if (changedCount && mutate("批量切换协作块类型", () => {
      currentDay().blocks = fallbackBlocks;
    }, { requireUnlocked: false, save: false, render: false })) {
      await syncDayBlocksToDoc(currentDay().id, "local-day-block-bulk-type-fallback");
      day = currentDay();
    }
  }
  if (!changedCount) {
    dom.saveState.textContent = `所选块已经是${dayBlockTypeLabel(nextType)}`;
    return false;
  }
  activeBlockPresenceId = selectedBlocks[0]?.id || activeBlockPresenceId;
  const changedIds = selectedBlocks.map((block) => block.id).filter((blockId) => {
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    return block && block.type === nextType;
  });
  if (!refreshDayBlockTypeDom(day, changedIds)) renderDayBlocks(day);
  await logActivity(`批量切换 ${changedCount} 个协作块为${dayBlockTypeLabel(nextType)}`, { target: { type: "day", dayId: day.id || "", action: "bulk-block-type" } });
  await saveCollaborativePlanChange("已批量切换协作块类型");
  dom.saveState.textContent = `已批量切换 ${changedCount} 个块`;
  return true;
}

async function setSelectedDayBlockDone(day, done) {
  const selectedBlocks = selectedDayBlockList(normalizeDayBlocks(day?.blocks || []));
  if (!day || !selectedBlocks.length || !requireEdit(done ? "批量完成协作块" : "批量重新打开协作块")) return false;
  if (!confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), done ? "批量完成" : "批量重开")) return false;
  let changedCount = 0;
  for (const block of selectedBlocks) {
    if (Boolean(block.done) === Boolean(done)) continue;
    noteRemoteBlockEditors(block.id, done ? "批量完成" : "批量重开");
    const updated = await updateDayBlockInDoc(day.id, block.id, { done }, "local-day-block-bulk-done");
    if (updated) {
      changedCount += 1;
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
        item.id === block.id ? { ...item, done, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
      )));
    }
  }
  if (!changedCount) {
    const fallbackBlocks = normalizeDayBlocks((day.blocks || []).map((block) => (
      selectedDayBlockIds.has(block.id) && Boolean(block.done) !== Boolean(done) ? { ...block, done } : block
    )));
    changedCount = fallbackBlocks.filter((block) => selectedDayBlockIds.has(block.id) && Boolean(block.done) === Boolean(done)).length;
    if (changedCount && mutate(done ? "批量完成协作块" : "批量重新打开协作块", () => {
      currentDay().blocks = fallbackBlocks;
    }, { requireUnlocked: false, save: false, render: false })) {
      await syncDayBlocksToDoc(currentDay().id, "local-day-block-bulk-done-fallback");
      day = currentDay();
    }
  }
  if (!changedCount) {
    dom.saveState.textContent = done ? "所选待办已经完成" : "所选块已经重新打开";
    return false;
  }
  const changedIds = selectedBlocks.map((block) => block.id).filter((blockId) => {
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    return block && Boolean(block.done) === Boolean(done);
  });
  if (!refreshDayBlockDoneDom(day, changedIds)) renderDayBlocks(day);
  await logActivity(`${done ? "批量完成" : "批量重新打开"} ${changedCount} 个协作块`, { target: { type: "day", dayId: day.id || "", action: done ? "bulk-block-done" : "bulk-block-open" } });
  await saveCollaborativePlanChange(done ? "已批量完成协作块" : "已批量重新打开协作块");
  dom.saveState.textContent = done ? `已完成 ${changedCount} 个块` : `已重新打开 ${changedCount} 个块`;
  return true;
}

async function indentSelectedDayBlocks(day, delta = 1) {
  const selectedBlocks = selectedDayBlockList(normalizeDayBlocks(day?.blocks || []));
  const actionLabel = delta > 0 ? "批量增加协作块缩进" : "批量减少协作块缩进";
  if (!day || !selectedBlocks.length || !requireEdit(actionLabel)) return false;
  if (!confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), delta > 0 ? "批量缩进" : "批量取消缩进")) return false;
  let changedCount = 0;
  for (const block of selectedBlocks) {
    const nextLevel = Math.max(0, Math.min((Number(block.level) || 0) + delta, 3));
    if (nextLevel === (Number(block.level) || 0)) continue;
    noteRemoteBlockEditors(block.id, delta > 0 ? "批量缩进" : "批量取消缩进");
    const updated = await updateDayBlockInDoc(day.id, block.id, { level: nextLevel }, "local-day-block-bulk-indent");
    if (updated) {
      changedCount += 1;
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
        item.id === block.id ? { ...item, level: nextLevel, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
      )));
    }
  }
  if (!changedCount) {
    const previousLevels = new Map(normalizeDayBlocks(day.blocks || []).map((block) => [block.id, Number(block.level) || 0]));
    const fallbackBlocks = normalizeDayBlocks((day.blocks || []).map((block) => {
      if (!selectedDayBlockIds.has(block.id)) return block;
      const nextLevel = Math.max(0, Math.min((Number(block.level) || 0) + delta, 3));
      return nextLevel === (Number(block.level) || 0) ? block : { ...block, level: nextLevel };
    }));
    changedCount = fallbackBlocks.filter((block) => selectedDayBlockIds.has(block.id) && (Number(block.level) || 0) !== (previousLevels.get(block.id) || 0)).length;
    if (changedCount && mutate(actionLabel, () => {
      currentDay().blocks = fallbackBlocks;
    }, { requireUnlocked: false, save: false, render: false })) {
      await syncDayBlocksToDoc(currentDay().id, "local-day-block-bulk-indent-fallback");
      day = currentDay();
    }
  }
  if (!changedCount) {
    dom.saveState.textContent = delta > 0 ? "所选块已经达到最大缩进" : "所选块已经没有缩进";
    return false;
  }
  const changedIds = selectedBlocks.map((block) => block.id).filter((blockId) => {
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    return block && selectedDayBlockIds.has(block.id);
  });
  if (!refreshDayBlockLevelDom(day, changedIds)) renderDayBlocks(day);
  await logActivity(`${delta > 0 ? "批量增加" : "批量减少"} ${changedCount} 个协作块缩进`, { target: { type: "day", dayId: day.id || "", action: delta > 0 ? "bulk-block-indent" : "bulk-block-outdent" } });
  await saveCollaborativePlanChange(delta > 0 ? "已批量增加协作块缩进" : "已批量减少协作块缩进");
  dom.saveState.textContent = delta > 0 ? `已缩进 ${changedCount} 个块` : `已取消缩进 ${changedCount} 个块`;
  return true;
}

function duplicateDayBlockDraft(block) {
  return normalizeDayBlock({
    ...block,
    id: uid(),
    text: block.text ? `${block.text} 副本` : dayBlockTypeLabel(block.type),
    textYjs: "",
    comments: [],
    done: false,
    createdBy: getCollabName(),
    createdAt: new Date().toISOString(),
    updatedBy: "",
    updatedAt: "",
  });
}

async function duplicateSelectedDayBlocks(day) {
  const blocks = normalizeDayBlocks(day?.blocks || []);
  const selectedBlocks = selectedDayBlockList(blocks);
  if (!day || !selectedBlocks.length || !requireEdit("批量复制协作块")) return false;
  if (!confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量复制")) return false;
  let workingBlocks = blocks;
  let insertedCount = 0;
  let lastAddedId = "";
  const insertedIds = [];
  for (const block of selectedBlocks) {
    const sourceIndex = workingBlocks.findIndex((item) => item.id === block.id);
    if (sourceIndex < 0) continue;
    noteRemoteBlockEditors(block.id, "批量复制");
    const duplicateBlock = duplicateDayBlockDraft(block);
    if (!duplicateBlock) continue;
    const insertIndex = sourceIndex + 1;
    const added = await addDayBlockToDoc(day.id, duplicateBlock, "local-day-block-bulk-duplicate", insertIndex);
    if (!added) continue;
    const addedBlock = added === true ? duplicateBlock : added;
    workingBlocks = insertDayBlockList(workingBlocks, addedBlock, insertIndex);
    insertedCount += 1;
    lastAddedId = addedBlock.id;
    insertedIds.push(addedBlock.id);
  }
  if (!insertedCount) {
    let fallbackBlocks = blocks;
    for (const block of selectedBlocks) {
      const sourceIndex = fallbackBlocks.findIndex((item) => item.id === block.id);
      if (sourceIndex < 0) continue;
      const duplicateBlock = duplicateDayBlockDraft(block);
      if (!duplicateBlock) continue;
      fallbackBlocks = insertDayBlockList(fallbackBlocks, duplicateBlock, sourceIndex + 1);
      insertedCount += 1;
      lastAddedId = duplicateBlock.id;
      insertedIds.push(duplicateBlock.id);
    }
    if (insertedCount && mutate("批量复制协作块", () => {
      currentDay().blocks = fallbackBlocks;
    }, { requireUnlocked: false, save: false, render: false })) {
      await syncDayBlocksToDoc(currentDay().id, "local-day-block-bulk-duplicate-fallback");
      day = currentDay();
      workingBlocks = day.blocks;
    }
  }
  if (!insertedCount) {
    dom.saveState.textContent = "批量复制失败，请稍后再试";
    return false;
  }
  day.blocks = normalizeDayBlocks(workingBlocks);
  clearSelectedDayBlocks();
  activeBlockPresenceId = lastAddedId || activeBlockPresenceId;
  if (!refreshDayBlockInsertDom(day, insertedIds, lastAddedId)) renderDayBlocks(day);
  schedulePresenceTrack(0);
  if (lastAddedId) focusDayBlockInput(lastAddedId);
  await logActivity(`批量复制 ${insertedCount} 个协作块`, { target: { type: "day", dayId: day.id || "", action: "bulk-block-duplicate" } });
  await saveCollaborativePlanChange("已批量复制协作块");
  dom.saveState.textContent = `已复制 ${insertedCount} 个块`;
  return true;
}

async function deleteSelectedDayBlocks(day) {
  const selectedBlocks = selectedDayBlockList(normalizeDayBlocks(day?.blocks || []));
  if (!day || !selectedBlocks.length || !requireEdit("批量删除协作块")) return false;
  if (!confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量删除")) return false;
  let deletedCount = 0;
  const deletedIds = new Set();
  for (const block of selectedBlocks) {
    noteRemoteBlockEditors(block.id, "批量删除");
    const deleted = await deleteDayBlockFromDoc(day.id, block.id, "local-day-block-bulk-delete");
    if (deleted) {
      deletedIds.add(block.id);
      deletedCount += 1;
    }
  }
  if (!deletedCount) {
    const selectedIds = new Set(selectedBlocks.map((block) => block.id));
    const fallbackBlocks = normalizeDayBlocks((day.blocks || []).filter((block) => !selectedIds.has(block.id)));
    deletedCount = normalizeDayBlocks(day.blocks || []).length - fallbackBlocks.length;
    if (deletedCount && mutate("批量删除协作块", () => {
      currentDay().blocks = fallbackBlocks;
    }, { requireUnlocked: false, save: false, render: false })) {
      await syncDayBlocksToDoc(currentDay().id, "local-day-block-bulk-delete-fallback");
      day = currentDay();
    }
  }
  if (!deletedCount) {
    dom.saveState.textContent = "批量删除失败，请稍后再试";
    return false;
  }
  day.blocks = normalizeDayBlocks((day.blocks || []).filter((block) => !deletedIds.has(block.id)));
  clearSelectedDayBlocks();
  activeBlockPresenceId = "";
  if (!refreshDayBlockDeleteDom(day, [...deletedIds])) renderDayBlocks(day);
  schedulePresenceTrack(0);
  await logActivity(`批量删除 ${deletedCount} 个协作块`, { target: { type: "day", dayId: day.id || "", action: "bulk-block-delete", deleted: true } });
  await saveCollaborativePlanChange("已批量删除协作块");
  dom.saveState.textContent = `已删除 ${deletedCount} 个块`;
  return true;
}

function applyStopRealtimeFields(stop) {
  dom.placeType.textContent = stop.type || "Place";
  dom.placeTitle.textContent = stop.title || "未命名地点";
  dom.placeAddress.textContent = stop.address || "地址待确认";
  dom.placeNote.textContent = stop.note || "";
  dom.commentTitle.textContent = stop.title || "当前地点";
  applyPlacePhotoDisplay(stop);
  scheduleSpecificImageForStop(stop, { render: false, reason: "specific-image-realtime-stop" });
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
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-created",
    payload: {
      tripId,
      dayId,
      stop: clone(stop),
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastStopDeleted(dayId, stop) {
  if (!realtimeChannel || !tripId || !stop?.id) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "stop-deleted",
    payload: {
      tripId,
      dayId,
      stopId: stop.id,
      title: stop.title || "地点",
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastStopsReordered(dayId, stops) {
  if (!realtimeChannel || !tripId || !dayId) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "stops-reordered",
    payload: {
      tripId,
      dayId,
      stopOrder: (stops || []).map((stop) => stop.id).filter(Boolean),
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayUpdated(day) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  const planYjs = currentPlanYjsState();
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
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayCreated(day, index) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "day-created",
    payload: {
      tripId,
      day: clone(day),
      index,
      planMeta: currentPlanMeta(),
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDayDeleted(day, index = activeDay) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "day-deleted",
    payload: {
      tripId,
      dayId: day.id,
      title: day.title || day.label || "当天",
      index,
      planMeta: currentPlanMeta(),
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

function broadcastDaysReordered() {
  if (!realtimeChannel || !tripId) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "days-reordered",
    payload: {
      tripId,
      dayOrder: state.days.map((day) => day.id).filter(Boolean),
      planMeta: currentPlanMeta(),
      planYjs,
      memberId: memberProfile?.id || sessionId,
      name: getCollabName(),
      sentAt: new Date().toISOString(),
    },
  });
}

async function broadcastPlanReplaced(reason = "更新整份计划", meta = {}) {
  if (!realtimeChannel || !tripId || !state?.days?.length) return;
  const replacementType = meta?.replacementType || "";
  if (!PLAN_REPLACE_REASONS.has(replacementType)) {
    console.warn("Blocked full plan replacement broadcast without explicit type", { reason, replacementType });
    dom.collabStatus.textContent = "???????????????????";
    return;
  }
  await bindCollabPlanDoc();
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "plan-replaced",
    payload: {
      tripId,
      state: clone(state),
      planYjs,
      reason,
      ...clone(meta),
      replacementType,
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

function destroyCollabDayTextDoc() {
  clearTimeout(collabDayTextSaveTimer);
  collabDayTextSaveTimer = null;
  collabDayTextDayId = "";
  collabDayTextFields = {};
  collabDayCommentsArray = null;
  if (collabDayTextDoc) {
    collabDayTextDoc.destroy();
    collabDayTextDoc = null;
  }
}

function destroyCollabPlanDoc() {
  clearTimeout(collabPlanSaveTimer);
  collabPlanSaveTimer = null;
  Object.values(planMetaInputSyncTimers).forEach((timer) => clearTimeout(timer));
  planMetaInputSyncTimers = {};
  collabPlanTripId = "";
  collabDayMetasArray = null;
  collabDayTextStatesMap = null;
  collabDayBlockTextStatesMap = null;
  collabDayBlockTextsMap = null;
  collabStopListsMap = null;
  collabStopTextStatesMap = null;
  collabDayBlocksMap = null;
  collabTransportQuotesArray = null;
  collabCandidatesArray = null;
  collabActivitiesArray = null;
  collabSettingsMap = null;
  collabSettingTextStatesMap = null;
  collabSettingTextsMap = null;
  if (collabPlanDoc) {
    collabPlanDoc.destroy();
    collabPlanDoc = null;
  }
}

function attachCollabPlanDocObserver() {
  if (!collabPlanDoc) return;
  collabPlanDoc.on("update", (update, origin) => {
    if (origin === "remote") {
      persistCurrentPlanFromDoc("收到协作者计划结构更新", { scheduleSave: !pendingConflict });
      return;
    }
    if (origin === "restore" || String(origin || "").startsWith("pending:")) {
      persistCurrentPlanFromDoc(origin === "restore" ? "已载入计划结构协作状态" : "已重放离线协作更新");
      return;
    }
    const updateBase64 = bytesToBase64(update);
    queuePendingPlanUpdate(updateBase64, String(origin || "local-plan-yjs"));
    broadcastPlanYjsUpdate(updateBase64);
    persistCurrentPlanFromDoc("计划结构协作内容实时同步中");
  });
}

async function bindCollabPlanDoc() {
  if (!tripId || isReadonlyMode || collabPlanTripId === tripId) return;
  const requestId = collabPlanBindRequestId + 1;
  collabPlanBindRequestId = requestId;
  destroyCollabPlanDoc();
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  if (requestId !== collabPlanBindRequestId || !tripId || isReadonlyMode) return;
  collabPlanTripId = tripId;
  collabPlanDoc = new Y.Doc();
  let restored = false;
  if (state.planYjs) {
    try {
      Y.applyUpdate(collabPlanDoc, base64ToBytes(state.planYjs), "restore");
      restored = true;
    } catch (error) {
      console.warn("Stored Yjs plan state could not be restored", error);
    }
  }
  if (!restored) Y.applyUpdate(collabPlanDoc, buildInitialPlanUpdate(Y, state), "restore");
  attachCollabPlanRefs();
  seedMissingPlanDocContent(Y);
  if (restored && !planDocMatchesCurrentState()) {
    console.warn("Stored Yjs plan state did not match visible plan JSON; rebuilding from JSON");
    collabPlanDoc.destroy();
    collabPlanDoc = new Y.Doc();
    Y.applyUpdate(collabPlanDoc, buildInitialPlanUpdate(Y, state), "restore");
    attachCollabPlanRefs();
    seedMissingPlanDocContent(Y);
    restored = false;
  }
  attachCollabPlanDocObserver();
  persistCurrentPlanFromDoc("已载入计划结构协作状态");
  renderTransport();
  refreshIcons();
}

async function addCollaborativeTransportQuote(quote) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabTransportQuotesArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeTransportQuotes([{ ...quote, createdBy: getCollabName(), createdAt: new Date().toISOString() }])[0];
  if (!normalized) return true;
  const existingIds = new Set(readTransportQuotesFromDoc().map((item) => item.id));
  if (existingIds.has(normalized.id)) return true;
  collabPlanDoc.transact(() => {
    collabTransportQuotesArray.insert(0, [normalized]);
  }, "local-transport-quote");
  return true;
}

async function addCollaborativeTransportQuotes(quotes = [], origin = "local-transport-quotes-batch") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabTransportQuotesArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeTransportQuotes(
    quotes.map((quote) => ({
      ...quote,
      createdBy: quote.createdBy || getCollabName(),
      createdAt: quote.createdAt || new Date().toISOString(),
    })),
  );
  if (!normalized.length) return true;
  const existing = readTransportQuotesFromDoc();
  const existingIds = new Set(existing.map((item) => item.id));
  const existingKeys = new Set(existing.map(transportOptionIdentity));
  const additions = normalized.filter((quote) => !existingIds.has(quote.id) && !existingKeys.has(transportOptionIdentity(quote)));
  if (!additions.length) return true;
  collabPlanDoc.transact(() => {
    collabTransportQuotesArray.insert(0, additions);
    if (collabTransportQuotesArray.length > 80) {
      collabTransportQuotesArray.delete(80, collabTransportQuotesArray.length - 80);
    }
  }, origin);
  return true;
}

async function addCollaborativeCandidate(stop) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabCandidatesArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeCandidateStops([{ ...stop, createdBy: getCollabName(), createdAt: new Date().toISOString() }])[0];
  if (!normalized) return true;
  const existingIds = new Set(readCandidatesFromDoc().map((item) => item.id));
  if (existingIds.has(normalized.id)) return true;
  collabPlanDoc.transact(() => {
    collabCandidatesArray.insert(0, [normalized]);
  }, "local-candidate");
  return true;
}

async function deleteYArrayItemById(getYArray, itemId, origin = "local-array-delete") {
  if (!canEdit() || isReadonlyMode || !itemId) return false;
  await bindCollabPlanDoc();
  const yArray = typeof getYArray === "function" ? getYArray() : getYArray;
  if (!collabPlanDoc || !yArray || isApplyingCollabPlanRemote) return false;
  const index = yArray.toArray().findIndex((item) => item?.id === itemId);
  if (index < 0) return true;
  collabPlanDoc.transact(() => {
    yArray.delete(index, 1);
  }, origin);
  return true;
}

async function updateYArrayItemById(getYArray, itemId, updater, normalizeItem = (item) => item, origin = "local-array-update") {
  if (!canEdit() || isReadonlyMode || !itemId || typeof updater !== "function") return false;
  await bindCollabPlanDoc();
  const yArray = typeof getYArray === "function" ? getYArray() : getYArray;
  if (!collabPlanDoc || !yArray || isApplyingCollabPlanRemote) return false;
  const currentItems = yArray.toArray();
  const index = currentItems.findIndex((item) => item?.id === itemId);
  if (index < 0) return false;
  const current = currentItems[index];
  const next = normalizeItem(updater(clone(current)));
  if (!next?.id) return false;
  if (sameSerialized(normalizeItem(current), next)) return true;
  collabPlanDoc.transact(() => {
    const latestItems = yArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === itemId);
    if (latestIndex < 0) return;
    const latest = normalizeItem(updater(clone(latestItems[latestIndex])));
    if (!latest?.id || sameSerialized(normalizeItem(latestItems[latestIndex]), latest)) return;
    yArray.delete(latestIndex, 1);
    yArray.insert(latestIndex, [latest]);
  }, origin);
  return true;
}

async function deleteTransportQuoteFromDoc(quoteId) {
  return deleteYArrayItemById(() => collabTransportQuotesArray, quoteId, "local-transport-quote-delete");
}

async function deleteCandidateFromDoc(candidateId) {
  return deleteYArrayItemById(() => collabCandidatesArray, candidateId, "local-candidate-delete");
}

async function updateTransportQuoteInDoc(quoteId, patch = {}) {
  return updateYArrayItemById(
    () => collabTransportQuotesArray,
    quoteId,
    (quote) => ({
      ...quote,
      ...patch,
      id: quote.id,
      createdBy: quote.createdBy || getCollabName(),
      createdAt: quote.createdAt || new Date().toISOString(),
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    }),
    (quote) => normalizeTransportQuotes([quote])[0],
    "local-transport-quote-update",
  );
}

async function updateCandidateInDoc(candidateId, patch = {}) {
  return updateYArrayItemById(
    () => collabCandidatesArray,
    candidateId,
    (candidate) => ({
      ...candidate,
      ...patch,
      id: candidate.id,
      createdBy: candidate.createdBy || getCollabName(),
      createdAt: candidate.createdAt || new Date().toISOString(),
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    }),
    (candidate) => normalizeCandidateStops([candidate])[0],
    "local-candidate-update",
  );
}

async function addCollaborativeActivity(activityInput) {
  if (!canEdit() || isReadonlyMode || !tripId) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabActivitiesArray || isApplyingCollabPlanRemote) return false;
  const input = typeof activityInput === "string" ? { text: activityInput } : activityInput || {};
  const activity = normalizeActivities([{
    ...input,
    text: input.text,
    createdBy: input.createdBy || getCollabName(),
    createdAt: input.createdAt || new Date().toISOString(),
    at: input.at || new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  }])[0];
  if (!activity) return true;
  const existingIds = new Set(readActivitiesFromDoc().map((item) => item.id));
  if (existingIds.has(activity.id)) return true;
  collabPlanDoc.transact(() => {
    collabActivitiesArray.insert(0, [activity]);
    if (collabActivitiesArray.length > 20) {
      collabActivitiesArray.delete(20, collabActivitiesArray.length - 20);
    }
  }, "local-activity");
  return true;
}

async function syncPlanSettingToDoc(field, value) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabSettingsMap || isApplyingCollabPlanRemote) return false;
  const nextValue = normalizePlanSettingValue(field, value);
  const settingText = PLAN_TEXT_SETTING_FIELDS.includes(field) ? collabSettingTextsMap?.get(field) : null;
  if (settingText && sameSerialized(collabSettingsMap.get(field), nextValue) && settingText.toString() === nextValue) return true;
  if (!settingText && sameSerialized(collabSettingsMap.get(field), nextValue)) return true;
  collabPlanDoc.transact(() => {
    if (settingText) {
      applyTextDiff(settingText, nextValue);
      const textState = settingTextStateFromYText(field, settingText);
      if (collabSettingTextStatesMap && textState) collabSettingTextStatesMap.set(field, textState);
    }
    collabSettingsMap.set(field, nextValue);
  }, "local-setting");
  return true;
}

async function syncPlanMetaToDoc(origin = "local-plan-meta") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabSettingsMap || isApplyingCollabPlanRemote) return false;
  const entries = PLAN_SETTING_FIELDS.map((meta) => [meta.field, planSettingValue(state, meta)]);
  const changed = entries.some(([field, value]) => {
    const textValue = PLAN_TEXT_SETTING_FIELDS.includes(field) ? collabSettingTextsMap?.get(field)?.toString() : undefined;
    return !sameSerialized(collabSettingsMap.get(field), value) || (textValue !== undefined && textValue !== value);
  });
  if (!changed) return true;
  collabPlanDoc.transact(() => {
    entries.forEach(([field, value]) => {
      const settingText = PLAN_TEXT_SETTING_FIELDS.includes(field) ? collabSettingTextsMap?.get(field) : null;
      if (settingText) {
        applyTextDiff(settingText, String(value || ""));
        const textState = settingTextStateFromYText(field, settingText);
        if (collabSettingTextStatesMap && textState) collabSettingTextStatesMap.set(field, textState);
      }
      collabSettingsMap.set(field, clone(value));
    });
  }, origin);
  return true;
}

function syncYArrayById(yArray, nextItems = [], normalizeItem = (item) => item) {
  if (!yArray || typeof yArray.toArray !== "function") return false;
  const normalizedNext = (nextItems || []).map((item) => normalizeItem(item)).filter((item) => item?.id);
  const nextIds = new Set(normalizedNext.map((item) => item.id));
  let changed = false;

  for (let index = yArray.length - 1; index >= 0; index -= 1) {
    const item = yArray.get(index);
    if (!item?.id || !nextIds.has(item.id)) {
      yArray.delete(index, 1);
      changed = true;
    }
  }

  normalizedNext.forEach((desired, targetIndex) => {
    const currentItems = yArray.toArray();
    const currentAt = currentItems[targetIndex];
    if (currentAt?.id === desired.id) {
      if (!sameSerialized(normalizeItem(currentAt), desired)) {
        yArray.delete(targetIndex, 1);
        yArray.insert(targetIndex, [desired]);
        changed = true;
      }
      return;
    }
    const existingIndex = currentItems.findIndex((item) => item?.id === desired.id);
    if (existingIndex >= 0) {
      yArray.delete(existingIndex, 1);
      yArray.insert(Math.min(targetIndex, yArray.length), [desired]);
    } else {
      yArray.insert(Math.min(targetIndex, yArray.length), [desired]);
    }
    changed = true;
  });

  while (yArray.length > normalizedNext.length) {
    yArray.delete(yArray.length - 1, 1);
    changed = true;
  }
  return changed;
}

async function syncDayMetasToDoc(origin = "local-day-metas") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayMetasArray || isApplyingCollabPlanRemote) return false;
  const nextDayMetas = normalizeDayMetas(state.days || []);
  const nextDayTextStates = dayTextStateSnapshotFromDays(state.days || [], yjsModule);
  if (sameSerialized(readDayMetasFromDoc(), nextDayMetas) && sameSerialized(readDayTextStatesFromDoc(), nextDayTextStates)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(collabDayMetasArray, nextDayMetas, (day) => normalizeDayMetas([day])[0]);
    if (collabDayTextStatesMap) {
      Array.from(collabDayTextStatesMap.keys()).forEach((dayId) => {
        if (!Object.prototype.hasOwnProperty.call(nextDayTextStates, dayId)) collabDayTextStatesMap.delete(dayId);
      });
      Object.entries(nextDayTextStates).forEach(([dayId, textState]) => {
        if (collabDayTextStatesMap.get(dayId) !== textState) collabDayTextStatesMap.set(dayId, textState);
      });
    }
  }, origin);
  return true;
}

async function addDayMetaToDoc(day, index = -1, origin = "local-day-create") {
  if (!canEdit() || isReadonlyMode || !day?.id) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayMetasArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeDayMetas([day])[0];
  if (!normalized) return true;
  const existingItems = collabDayMetasArray.toArray();
  if (existingItems.some((item) => item?.id === normalized.id)) return true;
  const textState = dayTextStateSnapshotFromDays([day], yjsModule)[day.id] || "";
  collabPlanDoc.transact(() => {
    collabDayMetasArray.insert(Math.max(0, Math.min(index, collabDayMetasArray.length)), [normalized]);
    if (textState) collabDayTextStatesMap?.set(day.id, textState);
    if (collabDayBlocksMap && !collabDayBlocksMap.has(day.id)) {
      const blockArray = new yjsModule.Array();
      const blocks = normalizeDayBlocks(day.blocks || []);
      if (blocks.length) blockArray.insert(0, blocks);
      collabDayBlocksMap.set(day.id, blockArray);
      blocks.forEach((block) => {
        const key = dayBlockTextKey(day.id, block.id);
        if (!collabDayBlockTextsMap?.has(key)) {
          const yText = new yjsModule.Text();
          if (block.text) yText.insert(0, block.text);
          collabDayBlockTextsMap?.set(key, yText);
        }
        const textState = bytesToBase64(buildInitialDayBlockTextUpdate(yjsModule, block, day.id));
        collabDayBlockTextStatesMap?.set(key, textState);
      });
    }
  }, origin);
  return true;
}

async function reorderDayMetasInDoc(orderedDays = state.days || [], origin = "local-day-reorder") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayMetasArray || isApplyingCollabPlanRemote) return false;
  const desiredDays = normalizeDayMetas(orderedDays);
  if (!desiredDays.length) return false;
  const latestDays = normalizeDayMetas(collabDayMetasArray.toArray());
  const latestById = new Map(latestDays.map((day) => [day.id, day]));
  const desiredIds = new Set(desiredDays.map((day) => day.id));
  const orderedMerged = desiredDays.map((day) => latestById.get(day.id) || day);
  const preservedExtras = latestDays.filter((day) => !desiredIds.has(day.id));
  const nextDays = [...orderedMerged, ...preservedExtras];
  if (sameSerialized(latestDays, nextDays)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(collabDayMetasArray, nextDays, (day) => normalizeDayMetas([day])[0]);
  }, origin);
  return true;
}

async function patchDayMetaInDoc(dayId, patch = {}, origin = "local-day-meta-patch") {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayMetasArray || isApplyingCollabPlanRemote) return false;
  const localDay = state.days.find((day) => day.id === dayId);
  const sourceDay = localDay ? normalizeDayMetas([localDay])[0] : null;
  const allowedFields = new Set(["date", "title", "route", "weather", "transport", "comments", "amapRoute"]);
  const patchFields = Object.keys(patch).filter((field) => allowedFields.has(field));
  if (!sourceDay || !patchFields.length) return false;
  const currentItems = collabDayMetasArray.toArray();
  const index = currentItems.findIndex((day) => day?.id === dayId);
  if (index < 0) return syncDayMetasToDoc(origin);
  const current = normalizeDayMetas([currentItems[index]])[0];
  const next = normalizeDayMetas([{
    ...current,
    id: dayId,
    label: current.label || sourceDay.label,
    ...Object.fromEntries(patchFields.map((field) => [field, patch[field]])),
  }])[0];
  if (sameSerialized(current, next)) return true;
  collabPlanDoc.transact(() => {
    const latestItems = collabDayMetasArray.toArray();
    const latestIndex = latestItems.findIndex((day) => day?.id === dayId);
    if (latestIndex < 0) return;
    const latest = normalizeDayMetas([latestItems[latestIndex]])[0];
    const merged = normalizeDayMetas([{
      ...latest,
      id: dayId,
      label: latest.label || sourceDay.label,
      ...Object.fromEntries(patchFields.map((field) => [field, patch[field]])),
    }])[0];
    if (sameSerialized(latest, merged)) return;
    collabDayMetasArray.delete(latestIndex, 1);
    collabDayMetasArray.insert(latestIndex, [merged]);
  }, origin);
  return true;
}

async function syncStopTextStateToPlanDoc(stopId, textState, origin = "local-stop-text-state") {
  if (!canEdit() || isReadonlyMode || !stopId || !textState) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabStopTextStatesMap || isApplyingCollabPlanRemote) return false;
  if (collabStopTextStatesMap.get(stopId) === textState) return true;
  collabPlanDoc.transact(() => {
    collabStopTextStatesMap.set(stopId, textState);
  }, origin);
  return true;
}

async function syncStopSnapshotToPlanDoc(stopId, origin = "local-stop-snapshot") {
  if (!canEdit() || isReadonlyMode || !stopId) return false;
  await bindCollabPlanDoc();
  const location = findStopLocation(stopId);
  if (!location?.day?.id || !location.stop || !collabPlanDoc || !collabStopListsMap || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeCollaborativeStop(location.stop);
  const textState = normalized.textYjs || normalized.noteYjs || "";
  let stopArray = collabStopListsMap.get(location.day.id);
  const existingStops = stopArray && typeof stopArray.toArray === "function" ? stopArray.toArray() : [];
  const existingIndex = existingStops.findIndex((stop) => stop?.id === stopId);
  const existingStop = existingIndex >= 0 ? normalizeCollaborativeStop(existingStops[existingIndex]) : null;
  const stopChanged = !existingStop || !sameSerialized(existingStop, normalized);
  const textChanged = Boolean(textState && collabStopTextStatesMap?.get(stopId) !== textState);
  if (!stopChanged && !textChanged) return true;
  collabPlanDoc.transact(() => {
    if (!stopArray) {
      stopArray = new yjsModule.Array();
      collabStopListsMap.set(location.day.id, stopArray);
    }
    const freshStops = stopArray.toArray();
    const freshIndex = freshStops.findIndex((stop) => stop?.id === stopId);
    const freshStop = freshIndex >= 0 ? normalizeCollaborativeStop(freshStops[freshIndex]) : null;
    if (!freshStop || !sameSerialized(freshStop, normalized)) {
      if (freshIndex >= 0) stopArray.delete(freshIndex, 1);
      stopArray.insert(freshIndex >= 0 ? freshIndex : stopArray.length, [normalized]);
    }
    if (textState && collabStopTextStatesMap?.get(stopId) !== textState) {
      collabStopTextStatesMap.set(stopId, textState);
    }
  }, origin);
  return true;
}

function patchedStopTextState(stopId, fallbackStop = {}, patch = {}, Y = yjsModule) {
  if (!Y || !stopId) return "";
  const textFields = new Set(COLLAB_TEXT_FIELDS.map((field) => field.field));
  const structMetas = COLLAB_STRUCT_FIELDS.filter((meta) => Object.prototype.hasOwnProperty.call(patch, meta.field));
  const patchedTextFields = Object.keys(patch || {}).filter((field) => textFields.has(field));
  if (!patchedTextFields.length && !structMetas.length) return collabStopTextStatesMap?.get(stopId) || fallbackStop.textYjs || fallbackStop.noteYjs || "";
  const tempDoc = new Y.Doc();
  const baseState = collabStopTextStatesMap?.get(stopId) || fallbackStop.textYjs || fallbackStop.noteYjs || "";
  try {
    if (baseState) {
      Y.applyUpdate(tempDoc, base64ToBytes(baseState), "patch");
    } else {
      Y.applyUpdate(tempDoc, buildInitialTextUpdate(Y, fallbackStop), "patch");
    }
    tempDoc.transact(() => {
      patchedTextFields.forEach((field) => {
        applyTextDiff(tempDoc.getText(field), String(patch[field] || ""));
      });
      const structMap = tempDoc.getMap("struct");
      const patchedStop = { ...fallbackStop, ...patch, id: stopId };
      COLLAB_STRUCT_FIELDS.forEach((meta) => {
        if (Object.prototype.hasOwnProperty.call(patch, meta.field) || !structMap.has(meta.field)) {
          structMap.set(meta.field, stopStructValue(patchedStop, meta));
        }
      });
    }, "patch");
    return bytesToBase64(Y.encodeStateAsUpdate(tempDoc));
  } catch (error) {
    console.warn("Patched stop text state could not be encoded", error);
    return "";
  } finally {
    tempDoc.destroy();
  }
}

function patchActiveStopTextDoc(stopId, patch = {}, origin = "local-stop-patch-active-text") {
  if (!collabTextDoc || collabTextStopId !== stopId || isApplyingCollabTextRemote) return false;
  const textFields = new Set(COLLAB_TEXT_FIELDS.map((field) => field.field));
  const structMetas = COLLAB_STRUCT_FIELDS.filter((meta) => Object.prototype.hasOwnProperty.call(patch, meta.field));
  const patchedTextFields = Object.keys(patch || {}).filter((field) => textFields.has(field));
  if (!patchedTextFields.length && !structMetas.length) return false;
  const location = findStopLocation(stopId);
  const patchedStop = { ...(location?.stop || {}), ...patch, id: stopId };
  collabTextDoc.transact(() => {
    patchedTextFields.forEach((field) => {
      const yText = collabTextFields[field] || collabTextDoc.getText(field);
      collabTextFields[field] = yText;
      applyTextDiff(yText, String(patch[field] || ""));
    });
    if (collabStructMap) {
      structMetas.forEach((meta) => {
        collabStructMap.set(meta.field, stopStructValue(patchedStop, meta));
      });
    }
  }, origin);
  return true;
}

async function patchStopInDoc(stopId, patch = {}, origin = "local-stop-patch") {
  if (!canEdit() || isReadonlyMode || !stopId) return false;
  const patchFields = Object.keys(patch || {});
  if (!patchFields.length) return false;
  await bindCollabPlanDoc();
  let Y = yjsModule;
  if (!Y) {
    try {
      Y = await ensureYjs();
    } catch {
      Y = null;
    }
  }
  const location = findStopLocation(stopId);
  if (!location?.day?.id || !location.stop || !collabPlanDoc || !collabStopListsMap || isApplyingCollabPlanRemote) return false;
  const sourceStop = normalizeCollaborativeStop(location.stop);
  let stopArray = collabStopListsMap.get(location.day.id);
  const existingStops = stopArray && typeof stopArray.toArray === "function" ? stopArray.toArray() : [];
  const existingIndex = existingStops.findIndex((stop) => stop?.id === stopId);
  const current = existingIndex >= 0 ? normalizeCollaborativeStop(existingStops[existingIndex]) : sourceStop;
  const next = normalizeCollaborativeStop({ ...current, ...patch, id: stopId });
  const nextTextState = Y ? patchedStopTextState(stopId, next, patch, Y) : "";
  const textChanged = Boolean(nextTextState && collabStopTextStatesMap?.get(stopId) !== nextTextState);
  const stopChanged = !sameSerialized(current, next);
  if (!stopChanged && !textChanged) {
    patchActiveStopTextDoc(stopId, patch, `${origin}-active-text`);
    return true;
  }
  collabPlanDoc.transact(() => {
    if (!stopArray) {
      stopArray = new yjsModule.Array();
      collabStopListsMap.set(location.day.id, stopArray);
    }
    const freshStops = stopArray.toArray();
    const freshIndex = freshStops.findIndex((stop) => stop?.id === stopId);
    const freshCurrent = freshIndex >= 0 ? normalizeCollaborativeStop(freshStops[freshIndex]) : sourceStop;
    const freshNext = normalizeCollaborativeStop({ ...freshCurrent, ...patch, id: stopId });
    if (!sameSerialized(freshCurrent, freshNext)) {
      if (freshIndex >= 0) stopArray.delete(freshIndex, 1);
      stopArray.insert(freshIndex >= 0 ? freshIndex : stopArray.length, [freshNext]);
    }
    if (Y && collabStopTextStatesMap) {
      const textState = patchedStopTextState(stopId, freshNext, patch, Y);
      if (textState && collabStopTextStatesMap.get(stopId) !== textState) collabStopTextStatesMap.set(stopId, textState);
    }
  }, origin);
  patchActiveStopTextDoc(stopId, patch, `${origin}-active-text`);
  return true;
}

async function syncStopListToDoc(dayId, origin = "local-stop-list") {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabStopListsMap || isApplyingCollabPlanRemote) return false;
  const day = state.days.find((item) => item.id === dayId);
  if (!day) return false;
  let stopArray = collabStopListsMap.get(dayId);
  collabPlanDoc.transact(() => {
    if (!stopArray) {
      stopArray = new yjsModule.Array();
      collabStopListsMap.set(dayId, stopArray);
    }
    const nextStops = normalizeStopListsFromDays([day])[dayId] || [];
    if (sameSerialized(stopArray.toArray(), nextStops)) return;
    syncYArrayById(stopArray, nextStops, normalizeCollaborativeStop);
  }, origin);
  return true;
}

async function reorderStopListInDoc(dayId, orderedStops = [], origin = "local-stop-reorder", options = {}) {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  const stopArray = await ensureStopArrayForDay(dayId);
  if (!collabPlanDoc || !stopArray || isApplyingCollabPlanRemote) return false;
  const patchFields = Array.isArray(options.patchFields) ? options.patchFields : [];
  const desiredStops = normalizeCollaborativeStopList(orderedStops);
  if (!desiredStops.length) return false;
  const latestStops = normalizeCollaborativeStopList(stopArray.toArray());
  const latestById = new Map(latestStops.map((stop) => [stop.id, stop]));
  const desiredIds = new Set(desiredStops.map((stop) => stop.id));
  const patchByStopId = new Map();
  const orderedMerged = desiredStops.map((stop) => {
    const latest = latestById.get(stop.id);
    if (!latest) return stop;
    if (!patchFields.length) return latest;
    const patch = {};
    patchFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(stop, field)) patch[field] = stop[field];
    });
    if (Object.keys(patch).length) patchByStopId.set(latest.id, patch);
    return normalizeCollaborativeStop({ ...latest, ...patch, id: latest.id });
  });
  const preservedExtras = latestStops.filter((stop) => !desiredIds.has(stop.id));
  const nextStops = [...orderedMerged, ...preservedExtras];
  const textStateUpdates = [];
  let Y = yjsModule;
  if (patchByStopId.size && collabStopTextStatesMap && !Y) {
    try {
      Y = await ensureYjs();
    } catch {
      Y = null;
    }
  }
  if (patchByStopId.size && collabStopTextStatesMap && Y) {
    nextStops.forEach((stop) => {
      const patch = patchByStopId.get(stop.id);
      if (!patch) return;
      const textState = patchedStopTextState(stop.id, stop, patch, Y);
      if (textState && collabStopTextStatesMap.get(stop.id) !== textState) {
        textStateUpdates.push([stop.id, textState]);
      }
    });
  }
  if (sameSerialized(latestStops, nextStops) && !textStateUpdates.length) {
    patchByStopId.forEach((patch, stopId) => patchActiveStopTextDoc(stopId, patch, `${origin}-active-text`));
    return true;
  }
  collabPlanDoc.transact(() => {
    syncYArrayById(stopArray, nextStops, normalizeCollaborativeStop);
    textStateUpdates.forEach(([stopId, textState]) => {
      collabStopTextStatesMap?.set(stopId, textState);
    });
  }, origin);
  patchByStopId.forEach((patch, stopId) => patchActiveStopTextDoc(stopId, patch, `${origin}-active-text`));
  return true;
}

async function ensureStopArrayForDay(dayId) {
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabStopListsMap || !dayId) return null;
  let stopArray = collabStopListsMap.get(dayId);
  if (!stopArray) {
    collabPlanDoc.transact(() => {
      stopArray = new yjsModule.Array();
      collabStopListsMap.set(dayId, stopArray);
    }, "ensure-stop-list");
  }
  return stopArray;
}

async function addStopToDoc(dayId, stop, origin = "local-stop-insert") {
  if (!canEdit() || isReadonlyMode || !dayId || !stop?.id) return false;
  const stopArray = await ensureStopArrayForDay(dayId);
  if (!collabPlanDoc || !stopArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeCollaborativeStop(stop);
  if (stopArray.toArray().some((item) => item?.id === normalized.id)) return true;
  collabPlanDoc.transact(() => {
    stopArray.insert(stopArray.length, [normalized]);
    const textState = normalized.textYjs || normalized.noteYjs || "";
    if (textState) collabStopTextStatesMap?.set(normalized.id, textState);
  }, origin);
  return true;
}

async function applyStopCreateFromDoc(dayId, stopId, label = "计划结构协作内容已实时同步") {
  persistCurrentPlanFromDoc(label, { refreshViews: false, scheduleSave: false, updateStatus: false });
  const nextDayIndex = state.days.findIndex((day) => day.id === dayId);
  if (nextDayIndex < 0) return false;
  activeDay = nextDayIndex;
  const nextStopIndex = (state.days[nextDayIndex].stops || []).findIndex((stop) => stop.id === stopId);
  activeStop = nextStopIndex >= 0 ? nextStopIndex : Math.max(0, (state.days[nextDayIndex].stops || []).length - 1);
  clearCurrentAmapRoute();
  await patchDayMetaInDoc(dayId, { amapRoute: null }, "local-stop-create-route-clear");
  return true;
}

async function deleteStopFromDoc(dayId, stopId, origin = "local-stop-delete") {
  if (!canEdit() || isReadonlyMode || !dayId || !stopId) return false;
  const stopArray = await ensureStopArrayForDay(dayId);
  if (!collabPlanDoc || !stopArray || isApplyingCollabPlanRemote) return false;
  const index = stopArray.toArray().findIndex((stop) => stop?.id === stopId);
  if (index < 0) return true;
  collabPlanDoc.transact(() => {
    stopArray.delete(index, 1);
    collabStopTextStatesMap?.delete(stopId);
  }, origin);
  return true;
}

async function deleteDayFromDoc(dayId, origin = "local-day-delete") {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayMetasArray || !collabStopListsMap || isApplyingCollabPlanRemote) return false;
  const existingStops = collabStopListsMap.get(dayId)?.toArray?.() || [];
  const existingStopIds = existingStops.map((stop) => stop?.id).filter(Boolean);
  const existingBlocks = collabDayBlocksMap?.get(dayId)?.toArray?.() || [];
  const existingBlockIds = existingBlocks.map((block) => block?.id).filter(Boolean);
  const dayMetaIndex = collabDayMetasArray.toArray().findIndex((day) => day?.id === dayId);
  collabPlanDoc.transact(() => {
    if (dayMetaIndex >= 0) collabDayMetasArray.delete(dayMetaIndex, 1);
    collabDayTextStatesMap?.delete(dayId);
    collabDayBlocksMap?.delete(dayId);
    collabStopListsMap.delete(dayId);
    existingStopIds.forEach((stopId) => collabStopTextStatesMap?.delete(stopId));
    existingBlockIds.forEach((blockId) => {
      const key = dayBlockTextKey(dayId, blockId);
      collabDayBlockTextStatesMap?.delete(key);
      collabDayBlockTextsMap?.delete(key);
    });
  }, origin);
  return true;
}

async function ensureDayBlockArray(dayId) {
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayBlocksMap || !dayId) return null;
  let blockArray = collabDayBlocksMap.get(dayId);
  if (!blockArray) {
    collabPlanDoc.transact(() => {
      blockArray = new yjsModule.Array();
      collabDayBlocksMap.set(dayId, blockArray);
    }, "ensure-day-blocks");
  }
  return blockArray;
}

async function updateDayBlockTextInDoc(dayId, blockId, text, origin = "local-day-block-text-crdt", options = {}) {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || !collabDayBlockTextStatesMap || !collabDayBlockTextsMap || isApplyingCollabPlanRemote) return false;
  const items = normalizeDayBlocks(blockArray.toArray());
  const block = items.find((item) => item.id === blockId);
  if (!block) return false;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return false;
  }
  const nextText = String(text || "").trim();
  const localBaseText = Object.prototype.hasOwnProperty.call(options, "baseText") ? String(options.baseText || "").trim() : null;
  let changed = false;
  let nextState = "";
  let appliedText = nextText;
  collabPlanDoc.transact(() => {
    const key = dayBlockTextKey(dayId, blockId);
    let yText = collabDayBlockTextsMap.get(key);
    if (!yText) {
      yText = new Y.Text();
      const initialText = block.text || "";
      if (initialText) yText.insert(0, initialText);
      collabDayBlockTextsMap.set(key, yText);
    }
    changed = localBaseText !== null
      ? applyTextDiffFromBase(yText, localBaseText, nextText)
      : applyTextDiff(yText, nextText);
    const yTextValue = yText.toString();
    appliedText = yTextValue;
    nextState = bytesToBase64(buildInitialDayBlockTextUpdate(Y, { ...block, id: blockId, text: appliedText }, dayId));
    collabDayBlockTextStatesMap.set(key, nextState);
  }, origin);
  if (!changed && block.text === appliedText && block.textYjs === nextState) return true;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === blockId);
    if (latestIndex < 0) return;
    const latest = normalizeDayBlock(latestItems[latestIndex]);
    const next = normalizeDayBlock({
      ...latest,
      id: blockId,
      text: appliedText,
      textYjs: nextState,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!next || sameSerialized(latest, next)) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [next]);
  }, origin);
  return { text: appliedText, textYjs: nextState };
}

async function addDayBlockToDoc(dayId, block, origin = "local-day-block-add", insertIndex = null) {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const normalized = normalizeDayBlock({
    ...block,
    createdBy: block?.createdBy || getCollabName(),
    createdAt: block?.createdAt || new Date().toISOString(),
  });
  if (!normalized) return true;
  if (blockArray.toArray().some((item) => item?.id === normalized.id)) return true;
  const blockKey = dayBlockTextKey(dayId, normalized.id);
  let textState = normalized.textYjs || "";
  if (!textState) {
    let Y;
    try {
      Y = await ensureYjs();
      textState = bytesToBase64(buildInitialDayBlockTextUpdate(Y, normalized, dayId));
    } catch (error) {
      console.warn("Day block Yjs text state could not be initialized", error);
    }
  }
  if (textState) normalized.textYjs = textState;
  collabPlanDoc.transact(() => {
    if (!collabDayBlockTextsMap?.has(blockKey)) {
      const yText = new yjsModule.Text();
      if (normalized.text) yText.insert(0, normalized.text);
      collabDayBlockTextsMap?.set(blockKey, yText);
    }
    if (textState) collabDayBlockTextStatesMap?.set(blockKey, textState);
    const boundedIndex = insertIndex === null || insertIndex === undefined
      ? blockArray.length
      : Math.max(0, Math.min(Number(insertIndex) || 0, blockArray.length));
    blockArray.insert(boundedIndex, [normalized]);
  }, origin);
  return normalized;
}

async function updateDayBlockInDoc(dayId, blockId, patch = {}, origin = "local-day-block-update") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const patchHasText = Object.prototype.hasOwnProperty.call(patch, "text");
  let Y = null;
  if (patchHasText) {
    if (!collabDayBlockTextStatesMap || !collabDayBlockTextsMap) return false;
    try {
      Y = await ensureYjs();
    } catch {
      return false;
    }
  }
  const items = blockArray.toArray();
  const index = items.findIndex((block) => block?.id === blockId);
  if (index < 0) return false;
  const nextText = patchHasText ? String(patch.text || "").trim() : "";
  const nextTextState = patchHasText ? bytesToBase64(buildInitialDayBlockTextUpdate(Y, { ...items[index], ...patch, id: blockId, text: nextText }, dayId)) : "";
  const normalizedPatch = patchHasText ? { ...patch, text: nextText, textYjs: nextTextState } : patch;
  const next = normalizeDayBlock({
    ...items[index],
    ...normalizedPatch,
    id: blockId,
    updatedBy: getCollabName(),
    updatedAt: new Date().toISOString(),
  });
  if (!next) return false;
  const currentNormalized = normalizeDayBlock(items[index]);
  const sameVisibleBlock = sameSerialized(currentNormalized, next);
  const textKey = patchHasText ? dayBlockTextKey(dayId, blockId) : "";
  const currentYText = patchHasText ? collabDayBlockTextsMap.get(textKey) : null;
  const textSnapshotMatches = !patchHasText || (
    currentYText?.toString?.() === nextText &&
    collabDayBlockTextStatesMap.get(textKey) === nextTextState
  );
  if (sameVisibleBlock && textSnapshotMatches) return patchHasText ? { text: nextText, textYjs: nextTextState } : true;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((block) => block?.id === blockId);
    if (latestIndex < 0) return;
    const latest = normalizeDayBlock({
      ...latestItems[latestIndex],
      ...normalizedPatch,
      id: blockId,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!latest) return;
    const sameLatestVisibleBlock = sameSerialized(normalizeDayBlock(latestItems[latestIndex]), latest);
    if (patchHasText) {
      const key = dayBlockTextKey(dayId, blockId);
      let yText = collabDayBlockTextsMap.get(key);
      if (!yText) {
        yText = new Y.Text();
        collabDayBlockTextsMap.set(key, yText);
      }
      applyTextDiff(yText, nextText);
      collabDayBlockTextStatesMap.set(key, nextTextState);
    }
    if (sameLatestVisibleBlock) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [latest]);
  }, origin);
  return patchHasText ? { text: nextText, textYjs: nextTextState } : true;
}

async function deleteDayBlockFromDoc(dayId, blockId, origin = "local-day-block-delete") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const index = blockArray.toArray().findIndex((block) => block?.id === blockId);
  if (index < 0) return true;
  collabPlanDoc.transact(() => {
    const key = dayBlockTextKey(dayId, blockId);
    collabDayBlockTextStatesMap?.delete(key);
    collabDayBlockTextsMap?.delete(key);
    blockArray.delete(index, 1);
  }, origin);
  return true;
}

async function updateDayBlockCommentsInDoc(dayId, blockId, comments = [], origin = "local-day-block-comments") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const items = blockArray.toArray();
  const index = items.findIndex((block) => block?.id === blockId);
  if (index < 0) return false;
  const next = normalizeDayBlock({
    ...items[index],
    comments: normalizeComments(comments),
    updatedBy: getCollabName(),
    updatedAt: new Date().toISOString(),
  });
  if (!next) return false;
  if (sameSerialized(normalizeDayBlock(items[index]), next)) return true;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((block) => block?.id === blockId);
    if (latestIndex < 0) return;
    const latest = normalizeDayBlock({
      ...latestItems[latestIndex],
      comments: normalizeComments(comments),
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!latest || sameSerialized(normalizeDayBlock(latestItems[latestIndex]), latest)) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [latest]);
  }, origin);
  return next;
}

async function addDayBlockCommentToDoc(dayId, blockId, text, parentId = "", origin = "local-day-block-comment", anchor = null) {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const items = blockArray.toArray();
  const index = items.findIndex((block) => block?.id === blockId);
  if (index < 0) return false;
  const block = normalizeDayBlock(items[index]);
  if (!block) return false;
  const parent = parentId ? normalizeComments(block.comments || []).find((comment) => comment.id === parentId && !comment.parentId) : null;
  if (parentId && !parent) return false;
  const normalizedAnchor = parentId ? null : normalizeCommentAnchor(anchor);
  const comment = normalizeCommentEntry({
    id: uid(),
    parentId: parent?.id || "",
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
    ...(normalizedAnchor ? { anchor: normalizedAnchor } : {}),
  });
  if (!comment) return true;
  let didInsert = false;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === blockId);
    if (latestIndex < 0) return;
    const latestBlock = normalizeDayBlock(latestItems[latestIndex]);
    if (!latestBlock) return;
    const latestParent = comment.parentId ? normalizeComments(latestBlock.comments || []).find((item) => item.id === comment.parentId && !item.parentId) : null;
    if (comment.parentId && !latestParent) return;
    const latest = normalizeDayBlock({
      ...latestBlock,
      comments: normalizeComments([...(latestBlock.comments || []), comment]),
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!latest) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [latest]);
    didInsert = true;
  }, origin);
  return didInsert ? comment : false;
}

async function updateDayBlockCommentInDoc(dayId, blockId, commentId, patch = {}, origin = "local-day-block-comment-update") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId || !commentId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  let didUpdate = false;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === blockId);
    if (latestIndex < 0) return;
    const latestBlock = normalizeDayBlock(latestItems[latestIndex]);
    if (!latestBlock) return;
    const nextComments = commentsWithUpdatedComment(latestBlock.comments || [], commentId, patch);
    if (sameSerialized(normalizeComments(latestBlock.comments || []), nextComments)) return;
    const next = normalizeDayBlock({
      ...latestBlock,
      comments: nextComments,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!next) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [next]);
    didUpdate = true;
  }, origin);
  return didUpdate;
}

async function deleteDayBlockCommentFromDoc(dayId, blockId, commentId, origin = "local-day-block-comment-delete") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId || !commentId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  let didDelete = false;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === blockId);
    if (latestIndex < 0) return;
    const latestBlock = normalizeDayBlock(latestItems[latestIndex]);
    if (!latestBlock) return;
    const nextComments = commentsWithoutThread(latestBlock.comments || [], commentId);
    if (sameSerialized(normalizeComments(latestBlock.comments || []), nextComments)) return;
    const next = normalizeDayBlock({
      ...latestBlock,
      comments: nextComments,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!next) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [next]);
    didDelete = true;
  }, origin);
  return didDelete;
}

async function moveDayBlockInDoc(dayId, blockId, direction = "down", origin = "local-day-block-reorder") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const items = normalizeDayBlocks(blockArray.toArray());
  const index = items.findIndex((block) => block.id === blockId);
  const offset = direction === "up" ? -1 : 1;
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return true;
  const movedAt = new Date().toISOString();
  const nextBlocks = moveDayBlockList(items, blockId, direction, {
    updatedBy: getCollabName(),
    updatedAt: movedAt,
  });
  if (sameSerialized(items, nextBlocks)) return true;
  collabPlanDoc.transact(() => {
    const latestBlocks = normalizeDayBlocks(blockArray.toArray());
    const latestNext = moveDayBlockList(latestBlocks, blockId, direction, {
      updatedBy: getCollabName(),
      updatedAt: movedAt,
    });
    if (sameSerialized(latestBlocks, latestNext)) return;
    syncYArrayById(blockArray, latestNext, normalizeDayBlock);
  }, origin);
  return true;
}

async function reorderDayBlockInDoc(dayId, blockId, targetIndex = 0, origin = "local-day-block-drag-reorder") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const items = normalizeDayBlocks(blockArray.toArray());
  const index = items.findIndex((block) => block.id === blockId);
  if (index < 0) return false;
  const boundedIndex = Math.max(0, Math.min(Number(targetIndex) || 0, items.length - 1));
  if (index === boundedIndex) return true;
  const movedAt = new Date().toISOString();
  collabPlanDoc.transact(() => {
    const latestBlocks = normalizeDayBlocks(blockArray.toArray());
    const latestNext = reorderDayBlockList(latestBlocks, blockId, boundedIndex, {
      updatedBy: getCollabName(),
      updatedAt: movedAt,
    });
    if (sameSerialized(latestBlocks, latestNext)) return;
    syncYArrayById(blockArray, latestNext, normalizeDayBlock);
  }, origin);
  return true;
}

async function syncDayBlocksToDoc(dayId, origin = "local-day-blocks") {
  if (!canEdit() || isReadonlyMode || !dayId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || !collabDayBlockTextStatesMap || !collabDayBlockTextsMap || isApplyingCollabPlanRemote) return false;
  const day = state.days.find((item) => item.id === dayId);
  if (!day) return false;
  const nextBlocks = normalizeDayBlocks(day.blocks || []);
  const nextBlockKeys = new Set(nextBlocks.map((block) => dayBlockTextKey(dayId, block.id)));
  if (
    sameSerialized(normalizeDayBlocks(blockArray.toArray()), nextBlocks) &&
    nextBlocks.every((block) => collabDayBlockTextsMap.get(dayBlockTextKey(dayId, block.id))?.toString?.() === block.text)
  ) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(blockArray, nextBlocks, normalizeDayBlock);
    Array.from(collabDayBlockTextsMap.keys()).forEach((blockKey) => {
      if (blockKey.startsWith(`${dayId}:`) && !nextBlockKeys.has(blockKey)) {
        collabDayBlockTextsMap.delete(blockKey);
        collabDayBlockTextStatesMap.delete(blockKey);
      }
    });
    nextBlocks.forEach((block) => {
      const key = dayBlockTextKey(dayId, block.id);
      let yText = collabDayBlockTextsMap.get(key);
      if (!yText) {
        yText = new yjsModule.Text();
        collabDayBlockTextsMap.set(key, yText);
      }
      applyTextDiff(yText, block.text || "");
      const textState = bytesToBase64(buildInitialDayBlockTextUpdate(yjsModule, block, dayId));
      collabDayBlockTextStatesMap.set(key, textState);
    });
  }, origin);
  return true;
}

async function syncStopListsToDoc(origin = "local-stop-lists") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabStopListsMap || !collabStopTextStatesMap || isApplyingCollabPlanRemote) return false;
  const nextLists = normalizeStopListsFromDays(state.days || []);
  if (sameSerialized(readStopListsFromDoc(), nextLists)) return true;
  collabPlanDoc.transact(() => {
    const existingKeys = Array.from(collabStopListsMap.keys());
    existingKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(nextLists, key)) collabStopListsMap.delete(key);
    });
    Object.entries(nextLists).forEach(([dayId, stops]) => {
      let stopArray = collabStopListsMap.get(dayId);
      if (!stopArray) {
        stopArray = new yjsModule.Array();
        collabStopListsMap.set(dayId, stopArray);
      }
      if (sameSerialized(stopArray.toArray(), stops)) return;
      syncYArrayById(stopArray, stops, normalizeCollaborativeStop);
    });
    const nextTextStates = stopTextStateSnapshotFromDays(state.days || [], yjsModule);
    Array.from(collabStopTextStatesMap?.keys?.() || []).forEach((stopId) => {
      if (!Object.prototype.hasOwnProperty.call(nextTextStates, stopId)) collabStopTextStatesMap.delete(stopId);
    });
    Object.entries(nextTextStates).forEach(([stopId, textState]) => {
      if (collabStopTextStatesMap.get(stopId) !== textState) collabStopTextStatesMap.set(stopId, textState);
    });
  }, origin);
  return true;
}

async function syncAllDayBlocksToDoc(origin = "local-day-blocks-all") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabDayBlocksMap || !collabDayBlockTextStatesMap || !collabDayBlockTextsMap || isApplyingCollabPlanRemote) return false;
  const nextLists = normalizeDayBlocksFromDays(state.days || []);
  const nextTextStates = dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule);
  const nextTextValues = dayBlockTextValueSnapshotFromDays(state.days || []);
  if (
    sameSerialized(readDayBlocksFromDoc(), nextLists) &&
    sameSerialized(readDayBlockTextStatesFromDoc(), nextTextStates) &&
    sameSerialized(readDayBlockTextValuesFromDoc(), nextTextValues)
  ) return true;
  collabPlanDoc.transact(() => {
    Array.from(collabDayBlocksMap.keys()).forEach((dayId) => {
      if (!Object.prototype.hasOwnProperty.call(nextLists, dayId)) collabDayBlocksMap.delete(dayId);
    });
    Object.entries(nextLists).forEach(([dayId, blocks]) => {
      let blockArray = collabDayBlocksMap.get(dayId);
      if (!blockArray) {
        blockArray = new yjsModule.Array();
        collabDayBlocksMap.set(dayId, blockArray);
      }
      if (sameSerialized(normalizeDayBlocks(blockArray.toArray()), blocks)) return;
      syncYArrayById(blockArray, blocks, normalizeDayBlock);
    });
    const nextKeys = new Set(Object.keys(nextTextValues));
    Array.from(collabDayBlockTextStatesMap.keys()).forEach((blockKey) => {
      if (!nextKeys.has(blockKey)) collabDayBlockTextStatesMap.delete(blockKey);
    });
    Array.from(collabDayBlockTextsMap.keys()).forEach((blockKey) => {
      if (!nextKeys.has(blockKey)) collabDayBlockTextsMap.delete(blockKey);
    });
    Object.entries(nextTextValues).forEach(([blockKey, text]) => {
      let yText = collabDayBlockTextsMap.get(blockKey);
      if (!yText) {
        yText = new yjsModule.Text();
        collabDayBlockTextsMap.set(blockKey, yText);
      }
      applyTextDiff(yText, text || "");
    });
    Object.entries(nextTextStates).forEach(([blockKey, textState]) => {
      if (collabDayBlockTextStatesMap.get(blockKey) !== textState) collabDayBlockTextStatesMap.set(blockKey, textState);
    });
  }, origin);
  return true;
}

async function syncTransportQuotesToDoc(origin = "local-transport-quotes") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabTransportQuotesArray || isApplyingCollabPlanRemote) return false;
  const nextQuotes = normalizeTransportQuotes(state.transportQuotes || []);
  if (sameSerialized(readTransportQuotesFromDoc(), nextQuotes)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(collabTransportQuotesArray, nextQuotes, (quote) => normalizeTransportQuotes([quote])[0]);
  }, origin);
  return true;
}

async function syncCandidatesToDoc(origin = "local-candidates") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabCandidatesArray || isApplyingCollabPlanRemote) return false;
  const nextCandidates = normalizeCandidateStops(state.candidates || []);
  if (sameSerialized(readCandidatesFromDoc(), nextCandidates)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(collabCandidatesArray, nextCandidates, (candidate) => normalizeCandidateStops([candidate])[0]);
  }, origin);
  return true;
}

async function syncActivitiesToDoc(origin = "local-activities") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabActivitiesArray || isApplyingCollabPlanRemote) return false;
  const nextActivities = normalizeActivities(state.activities || []);
  if (sameSerialized(readActivitiesFromDoc(), nextActivities)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(collabActivitiesArray, nextActivities, (activity) => normalizeActivities([activity])[0]);
  }, origin);
  return true;
}

async function replacePlanCollabDoc(origin = "local-plan-replace", options = {}) {
  if (!canEdit() || isReadonlyMode) return false;
  const { allowReplace = false, reason = "" } = options || {};
  if (!allowReplace || !PLAN_REPLACE_REASONS.has(reason)) {
    console.warn("Blocked full plan collaboration replacement without explicit reason", { origin, reason });
    return false;
  }
  clearPlanYjsState();
  destroyCollabDayTextDoc();
  destroyCollabPlanDoc();
  await bindCollabPlanDoc();
  await syncDayMetasToDoc(`${origin}-days`);
  await syncStopListsToDoc(`${origin}-stops`);
  await syncAllDayBlocksToDoc(`${origin}-blocks`);
  await syncTransportQuotesToDoc(`${origin}-quotes`);
  await syncCandidatesToDoc(`${origin}-candidates`);
  await syncActivitiesToDoc(`${origin}-activities`);
  await syncPlanMetaToDoc(`${origin}-meta`);
  return true;
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
    if (!meta.domKey) return;
    const value = collabStructMap.get(meta.field);
    writeStructDomValue(meta, value);
  });
  const comments = readCommentsFromDoc();
  if (comments.length) {
    stop.comments = comments;
    renderStopComments(stop);
    dom.commentCount.textContent = comments.length;
  }
  collabTextDoc.on("update", (update, origin) => {
    if (origin === "remote") {
      persistCurrentTextFromDoc("收到协作者地点协作更新").catch((error) => console.warn("Persist remote text update failed", error));
      return;
    }
    broadcastTextUpdate(update);
    persistCurrentTextFromDoc("地点协作内容实时同步中").catch((error) => console.warn("Persist text update failed", error));
  });
  if (restored && COLLAB_TEXT_FIELDS.some(({ field }) => stop[field] !== collabTextFields[field].toString())) {
    persistCurrentTextFromDoc("已载入文本协作状态").catch((error) => console.warn("Persist restored text state failed", error));
  }
  setNoteCollabStatus("文本、结构字段与评论协作已开启");
}

async function bindCollabDayTextDoc() {
  const day = currentDay();
  if (!day?.id || collabDayTextDayId === day.id) return;
  const requestId = collabDayTextBindRequestId + 1;
  collabDayTextBindRequestId = requestId;
  destroyCollabDayTextDoc();
  if (!tripId || isReadonlyMode) {
    if (dom.dayEditorStatus) dom.dayEditorStatus.textContent = tripId ? "随计划保存" : "本地保存";
    return;
  }
  if (dom.dayEditorStatus) dom.dayEditorStatus.textContent = "逐字协作加载中";
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  await bindCollabPlanDoc();
  if (requestId !== collabDayTextBindRequestId || currentDay()?.id !== day.id) return;
  collabDayTextDayId = day.id;
  collabDayTextDoc = new Y.Doc();
  let restored = false;
  const storedTextState = day.dayTextYjs || day.textYjs || collabDayTextStatesMap?.get(day.id) || "";
  if (storedTextState) {
    try {
      Y.applyUpdate(collabDayTextDoc, base64ToBytes(storedTextState), "restore");
      restored = true;
    } catch (error) {
      console.warn("Stored Yjs day text state could not be restored", error);
    }
  }
  if (!restored) {
    Y.applyUpdate(collabDayTextDoc, buildInitialDayTextUpdate(Y, day), "restore");
    restored = true;
  }
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField }) => {
    collabDayTextFields[docField] = collabDayTextDoc.getText(docField);
  });
  collabDayCommentsArray = collabDayTextDoc.getArray("comments");
  collabDayTextDoc.transact(() => {
    if (collabDayCommentsArray.length === 0 && (day.comments || []).length) {
      collabDayCommentsArray.insert(0, normalizeComments(day.comments || []));
    }
  }, "restore");
  COLLAB_DAY_TEXT_FIELDS.forEach(({ docField, domKey }) => {
    const value = restored ? collabDayTextFields[docField].toString() : day[docField] || "";
    if (dom[domKey] && dom[domKey].value !== value) dom[domKey].value = value;
  });
  const comments = readDayCommentsFromDoc();
  if (comments.length) {
    day.comments = comments;
    renderDayComments(day);
  }
  collabDayTextDoc.on("update", (update, origin) => {
    if (origin === "remote") {
      persistCurrentDayTextFromDoc("收到协作者当天文本更新").catch((error) => console.warn("Persist remote day text update failed", error));
      return;
    }
    broadcastDayTextUpdate(update);
    persistCurrentDayTextFromDoc("当天文本协作内容实时同步中").catch((error) => console.warn("Persist day text update failed", error));
  });
  if (restored && COLLAB_DAY_TEXT_FIELDS.some(({ docField }) => day[docField] !== collabDayTextFields[docField].toString())) {
    persistCurrentDayTextFromDoc("已载入当天文本协作状态").catch((error) => console.warn("Persist restored day text state failed", error));
  }
  if (dom.dayEditorStatus) dom.dayEditorStatus.textContent = "逐字协作已开启";
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
      if (!meta.domKey) return;
      const nextValue = collabStructMap?.get(meta.field);
      writeStructDomValue(meta, nextValue);
    });
    const stop = currentStop();
    if (stop?.id === collabTextStopId) applyStopRealtimeFields({ ...stop, ...readStructFromDoc() });
    setNoteCollabStatus(`${payload.name || "协作者"} 正在同步地点协作内容`);
  } finally {
    isApplyingCollabTextRemote = false;
  }
}

async function applyRemoteDayTextUpdate(payload = {}) {
  if (!payload.update || payload.roomId !== currentDayTextRoomId()) return;
  if (!collabDayTextDoc || !Object.keys(collabDayTextFields).length || collabDayTextDayId !== payload.dayId) await bindCollabDayTextDoc();
  if (!collabDayTextDoc || collabDayTextDayId !== payload.dayId) return;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  isApplyingCollabDayTextRemote = true;
  try {
    Y.applyUpdate(collabDayTextDoc, base64ToBytes(payload.update), "remote");
    COLLAB_DAY_TEXT_FIELDS.forEach(({ docField, domKey }) => {
      const nextValue = collabDayTextFields[docField]?.toString() || "";
      if (dom[domKey] && dom[domKey].value !== nextValue) dom[domKey].value = nextValue;
    });
    if (currentDay()?.id === collabDayTextDayId) {
      currentDay().comments = readDayCommentsFromDoc();
      renderDayComments(currentDay());
      renderTextPresence();
    }
    if (dom.dayEditorStatus) dom.dayEditorStatus.textContent = `${payload.name || "协作者"} 正在同步`;
  } finally {
    isApplyingCollabDayTextRemote = false;
  }
}

async function applyRemotePlanYjsUpdate(payload = {}) {
  if (!payload.update || payload.roomId !== currentPlanRoomId()) return;
  if (!collabPlanDoc || collabPlanTripId !== tripId) await bindCollabPlanDoc();
  if (!collabPlanDoc) return;
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return;
  }
  isApplyingCollabPlanRemote = true;
  try {
    Y.applyUpdate(collabPlanDoc, base64ToBytes(payload.update), "remote");
    dom.collabStatus.textContent = `${payload.name || "协作者"} 正在同步计划结构`;
  } finally {
    isApplyingCollabPlanRemote = false;
  }
  if (pendingPlanUpdates().length && !pendingConflict) {
    flushPendingPlanUpdates("收到协作者更新后重放离线协作更新").catch((error) => {
      dom.collabStatus.textContent = `重放离线协作更新失败：${error.message}`;
    });
  }
}

async function mergePlanYjsStateIntoLiveDoc(planYjs, label = "已合并计划结构协作快照", options = {}) {
  if (!planYjs) return false;
  const { scheduleSave = true } = options;
  if (!collabPlanDoc || collabPlanTripId !== tripId) await bindCollabPlanDoc();
  if (!collabPlanDoc || isReadonlyMode) return applyPlanYjsStateToCurrentPlan(planYjs, label);
  let Y;
  try {
    Y = await ensureYjs();
  } catch {
    return false;
  }
  isApplyingCollabPlanRemote = true;
  try {
    Y.applyUpdate(collabPlanDoc, base64ToBytes(planYjs), "remote");
  } catch (error) {
    console.warn("Plan Yjs structure snapshot could not be merged", error);
    return false;
  } finally {
    isApplyingCollabPlanRemote = false;
  }
  persistCurrentPlanFromDoc(label, { scheduleSave });
  return true;
}

async function mergeConflictPlanYjsSnapshot(remotePlan = {}, label = "已通过协作快照合并冲突") {
  if (!remotePlan?.planYjs || !canEdit() || isReadonlyMode) return false;
  await refreshLiveCollabStateBeforeRemoteSave("合并冲突前已刷新本地协作快照");
  if (!collabPlanDoc || collabPlanTripId !== tripId) await bindCollabPlanDoc();
  if (!collabPlanDoc) return false;
  const merged = await mergePlanYjsStateIntoLiveDoc(remotePlan.planYjs, label, { scheduleSave: false });
  if (!merged) return false;
  state = ensurePlanDates(state);
  state.planYjs = currentPlanYjsState();
  persistLocalState();
  return true;
}

async function applyRemoteStructureSnapshot(payload = {}, label = "收到协作者结构快照") {
  if (!payload.planYjs || payload.tripId !== tripId) return false;
  const applied = await mergePlanYjsStateIntoLiveDoc(payload.planYjs, label);
  if (applied) {
    syncGuideStateFromPlan();
    persistLocalState();
  }
  return applied;
}

function stopExistsInPlan(stopId) {
  return Boolean(stopId && state.days.some((day) => (day.stops || []).some((stop) => stop.id === stopId)));
}

function stopOrderMatches(dayId, stopOrder = []) {
  const day = state.days.find((item) => item.id === dayId);
  if (!day || !Array.isArray(stopOrder) || !stopOrder.length) return false;
  const currentOrder = (day.stops || []).map((stop) => stop.id).filter((id) => stopOrder.includes(id));
  return sameSerialized(currentOrder, stopOrder.filter((id) => currentOrder.includes(id)));
}

function dayOrderMatches(dayOrder = []) {
  if (!Array.isArray(dayOrder) || !dayOrder.length) return false;
  const currentOrder = state.days.map((day) => day.id).filter((id) => dayOrder.includes(id));
  return sameSerialized(currentOrder, dayOrder.filter((id) => currentOrder.includes(id)));
}

async function applyRemoteStopCreated(payload = {}) {
  if (!payload.stop?.id || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: stopActivityTarget(payload.dayId || "", payload.stop.id || "", { action: "remote-create" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 新增地点协作快照`)) {
    if (stopExistsInPlan(payload.stop.id)) {
      logActivity(`${payload.name || "协作者"} 新增地点「${payload.stop.title || "未命名地点"}」`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照新增了「${payload.stop.title || "地点"}」`;
      render();
      return;
    }
  }
  if (state.days.some((day) => (day.stops || []).some((stop) => stop.id === payload.stop.id))) return;
  const day =
    state.days.find((item) => item.id === payload.dayId) ||
    state.days.find((item) => item.date && item.date === payload.dayDate) ||
    currentDay();
  if (!day) return;
  day.stops = [...(day.stops || []), clone(payload.stop)];
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 新增地点「${payload.stop.title || "未命名地点"}」`, { ...activityOptions, target: stopActivityTarget(day.id || payload.dayId || "", payload.stop.id || "", { action: "remote-create" }) });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了「${payload.stop.title || "地点"}」`;
  render();
}

async function applyRemoteStopDeleted(payload = {}) {
  if (!payload.stopId || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: stopActivityTarget(payload.dayId || "", payload.stopId || "", { deleted: true, action: "remote-delete" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 删除地点协作快照`)) {
    if (!stopExistsInPlan(payload.stopId)) {
      destroyCollabTextDoc();
      logActivity(`${payload.name || "协作者"} 删除地点「${payload.title || "地点"}」`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照删除了「${payload.title || "地点"}」`;
      render();
      return;
    }
  }
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
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 删除地点「${payload.title || "地点"}」`, { ...activityOptions, target: stopActivityTarget(day.id || payload.dayId || "", payload.stopId || "", { deleted: true, action: "remote-delete" }) });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了「${payload.title || "地点"}」`;
  render();
}

async function applyRemoteStopsReordered(payload = {}) {
  if (!payload.dayId || !Array.isArray(payload.stopOrder) || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: dayActivityTarget(payload.dayId || "", { action: "remote-stop-reorder" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 调整地点顺序协作快照`)) {
    if (stopOrderMatches(payload.dayId, payload.stopOrder)) {
      logActivity(`${payload.name || "协作者"} 调整地点顺序`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照调整了地点顺序`;
      render();
      return;
    }
  }
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
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 调整地点顺序`, activityOptions);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了地点顺序`;
  render();
}

async function applyRemoteDayUpdated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: dayActivityTarget(payload.day.id || payload.dayId || "", { action: "remote-settings" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 更新当天设置协作快照`)) {
    const day = state.days.find((item) => item.id === payload.day.id);
    if (day) {
      logActivity(`${payload.name || "协作者"} 更新当天设置`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照更新了 ${day.label}`;
      render();
      return;
    }
  }
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
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 更新当天设置`, activityOptions);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 更新了 ${state.days[index].label}`;
  render();
}

async function applyRemoteDayCreated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: dayActivityTarget(payload.day.id || "", { action: "remote-create" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 新增一天协作快照`)) {
    if (state.days.some((day) => day.id === payload.day.id)) {
      logActivity(`${payload.name || "协作者"} 新增一天「${payload.day.title || payload.day.label || "新日期"}」`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照新增了 ${payload.day.title || "一天"}`;
      render();
      return;
    }
  }
  if (state.days.some((day) => day.id === payload.day.id)) return;
  const activeDayId = currentDay()?.id || "";
  const nextIndex = Math.min(Math.max(Number(payload.index ?? state.days.length), 0), state.days.length);
  state.days.splice(nextIndex, 0, clone(payload.day));
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  activeStop = Math.min(activeStop, currentDay()?.stops?.length - 1 || 0);
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 新增一天「${payload.day.title || payload.day.label || "新日期"}」`, activityOptions);
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了 ${payload.day.title || "一天"}`;
  render();
}

async function applyRemoteDayDeleted(payload = {}) {
  if (!payload.dayId || payload.tripId !== tripId || state.days.length <= 1) return;
  const activityOptions = { broadcast: false, target: dayActivityTarget(payload.dayId || "", { deleted: true, action: "remote-delete", fallbackIndex: Number(payload.index ?? activeDay) }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 删除一天协作快照`)) {
    if (!state.days.some((day) => day.id === payload.dayId)) {
      destroyCollabTextDoc();
      logActivity(`${payload.name || "协作者"} 删除一天「${payload.title || "当天"}」`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照删除了 ${payload.title || "一天"}`;
      render();
      return;
    }
  }
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
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 删除一天「${payload.title || "当天"}」`, { ...activityOptions, target: dayActivityTarget(payload.dayId || "", { deleted: true, action: "remote-delete", fallbackIndex: index }) });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了 ${payload.title || "一天"}`;
  render();
}

async function applyRemoteDaysReordered(payload = {}) {
  if (!Array.isArray(payload.dayOrder) || payload.tripId !== tripId) return;
  const activityOptions = { broadcast: false, target: dayActivityTarget(currentDay()?.id || payload.dayOrder[0] || "", { action: "remote-day-reorder" }) };
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 调整日期顺序协作快照`)) {
    if (dayOrderMatches(payload.dayOrder)) {
      logActivity(`${payload.name || "协作者"} 调整日期顺序`, activityOptions);
      dom.collabStatus.textContent = `${payload.name || "协作者"} 通过协作快照调整了日期顺序`;
      render();
      return;
    }
  }
  const byId = new Map(state.days.map((day) => [day.id, day]).filter(([id]) => id));
  const ordered = payload.dayOrder.map((id) => byId.get(id)).filter(Boolean);
  const leftovers = state.days.filter((day) => !payload.dayOrder.includes(day.id));
  if (!ordered.length) return;
  const activeDayId = currentDay()?.id || "";
  state.days = [...ordered, ...leftovers];
  applyPlanMeta(payload.planMeta || {});
  resequencePlanDays();
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  persistLocalState();
  logActivity(`${payload.name || "协作者"} 调整日期顺序`, { ...activityOptions, target: dayActivityTarget(activeDayId || currentDay()?.id || "", { action: "remote-day-reorder" }) });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了日期顺序`;
  render();
}

async function applyRemotePlanReplaced(payload = {}) {
  if (payload.tripId !== tripId || (!payload.planYjs && !payload.state?.days?.length)) return;
  if (!PLAN_REPLACE_REASONS.has(payload.replacementType || "")) {
    dom.collabStatus.textContent = "Full plan update skipped: untrusted replacement type.";
    return;
  }
  const activeDayId = currentDay()?.id || "";
  const activeStopId = currentStop()?.id || "";
  let appliedYjs = false;
  if (payload.planYjs) {
    appliedYjs = await replaceLivePlanDocWithYjsState(payload.planYjs, `${payload.name || "协作者"} 更新了整份计划`);
  }
  if (!appliedYjs && payload.state?.days?.length) {
    state = ensurePlanDates(clone(payload.state));
  }
  if (!state?.days?.length) return;
  if (activeDayId) activeDay = Math.max(0, state.days.findIndex((day) => day.id === activeDayId));
  if (activeStopId && currentDay()?.stops?.length) {
    const nextStopIndex = currentDay().stops.findIndex((stop) => stop.id === activeStopId);
    activeStop = nextStopIndex >= 0 ? nextStopIndex : 0;
  } else {
    activeDay = Math.min(activeDay, state.days.length - 1);
    activeStop = 0;
  }
  syncGuideStateFromPlan();
  destroyCollabTextDoc();
  destroyCollabDayTextDoc();
  persistLocalState();
  if (!appliedYjs) {
    destroyCollabPlanDoc();
    bindCollabPlanDoc();
  }
  if (payload.replacementType === "version-restore") {
    const versionLabel = restoredVersionLabel(payload.restoredVersionReason || "历史版本", payload.restoredVersionAt || "");
    logActivity(`${payload.name || "协作者"} 恢复历史版本：${versionLabel}`, { broadcast: false });
    dom.saveState.textContent = "计划已被恢复到历史版本";
    dom.collabStatus.textContent = `${payload.name || "协作者"} 恢复了历史版本：${versionLabel}`;
  } else {
    logActivity(`${payload.name || "协作者"} ${payload.reason || "更新整份计划"}`, { broadcast: false });
    dom.collabStatus.textContent = appliedYjs ? `${payload.name || "协作者"} 通过协作快照更新了整份计划` : `${payload.name || "协作者"} 更新了整份计划`;
  }
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

function textDiffParts(baseValue = "", nextValue = "") {
  const baseText = String(baseValue || "");
  const nextText = String(nextValue || "");
  if (baseText === nextText) {
    return { index: 0, deleteLength: 0, insertText: "", changed: false };
  }
  let prefixLength = 0;
  const maxPrefix = Math.min(baseText.length, nextText.length);
  while (prefixLength < maxPrefix && baseText[prefixLength] === nextText[prefixLength]) {
    prefixLength += 1;
  }
  let suffixLength = 0;
  const maxSuffix = Math.min(baseText.length - prefixLength, nextText.length - prefixLength);
  while (
    suffixLength < maxSuffix &&
    baseText[baseText.length - 1 - suffixLength] === nextText[nextText.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }
  return {
    index: prefixLength,
    deleteLength: baseText.length - prefixLength - suffixLength,
    insertText: nextText.slice(prefixLength, nextText.length - suffixLength),
    changed: true,
  };
}

function transformTextPosition(baseValue = "", nextValue = "", position = 0) {
  const baseText = String(baseValue || "");
  const nextText = String(nextValue || "");
  const boundedPosition = Math.max(0, Math.min(Number(position) || 0, baseText.length));
  if (baseText === nextText) return boundedPosition;
  const diff = textDiffParts(baseText, nextText);
  if (!diff.changed) return Math.max(0, Math.min(boundedPosition, nextText.length));
  const changeStart = diff.index;
  const changeEnd = diff.index + diff.deleteLength;
  const insertedLength = diff.insertText.length;
  if (boundedPosition < changeStart) return boundedPosition;
  if (boundedPosition > changeEnd) return Math.max(0, Math.min(boundedPosition + insertedLength - diff.deleteLength, nextText.length));
  return Math.max(0, Math.min(changeStart + insertedLength, nextText.length));
}

function anchoredTextPatchPosition(currentValue = "", baseValue = "", diff = {}) {
  const currentText = String(currentValue || "");
  const baseText = String(baseValue || "");
  const index = Math.max(0, Math.min(Number(diff.index) || 0, currentText.length));
  const deletedText = baseText.slice(diff.index, diff.index + diff.deleteLength);
  const prefixText = baseText.slice(0, diff.index);
  const suffixText = baseText.slice(diff.index + diff.deleteLength);
  if (diff.deleteLength > 0 && deletedText) {
    let deleteIndex = currentText.indexOf(deletedText, index);
    if (deleteIndex < 0 && prefixText) {
      const prefixIndex = currentText.indexOf(prefixText);
      if (prefixIndex >= 0) deleteIndex = currentText.indexOf(deletedText, prefixIndex + prefixText.length);
    }
    if (deleteIndex < 0) deleteIndex = currentText.indexOf(deletedText);
    if (deleteIndex >= 0) {
      return {
        index: deleteIndex,
        deleteLength: Math.min(diff.deleteLength, currentText.length - deleteIndex),
      };
    }
  }
  if (diff.deleteLength === 0 && suffixText) {
    const suffixIndex = currentText.indexOf(suffixText, index);
    if (suffixIndex >= 0) return { index: suffixIndex, deleteLength: 0 };
    const anySuffixIndex = currentText.indexOf(suffixText);
    if (anySuffixIndex >= 0) return { index: anySuffixIndex, deleteLength: 0 };
  }
  if (prefixText) {
    const prefixIndex = currentText.lastIndexOf(prefixText, index);
    const anyPrefixIndex = prefixIndex >= 0 ? prefixIndex : currentText.lastIndexOf(prefixText);
    if (anyPrefixIndex >= 0) {
      const nextIndex = Math.min(currentText.length, anyPrefixIndex + prefixText.length);
      return {
        index: nextIndex,
        deleteLength: Math.min(diff.deleteLength, currentText.length - nextIndex),
      };
    }
  }
  const remoteDiff = textDiffParts(baseText, currentText);
  if (remoteDiff.changed) {
    const remoteStart = remoteDiff.index;
    const remoteEnd = remoteStart + remoteDiff.deleteLength;
    const remoteDelta = remoteDiff.insertText.length - remoteDiff.deleteLength;
    let transformedIndex = index;
    if (index > remoteEnd) {
      transformedIndex = index + remoteDelta;
    } else if (index === remoteStart || index === remoteEnd || (index > remoteStart && index < remoteEnd)) {
      transformedIndex = remoteStart + remoteDiff.insertText.length;
    }
    transformedIndex = Math.max(0, Math.min(transformedIndex, currentText.length));
    return {
      index: transformedIndex,
      deleteLength: Math.min(diff.deleteLength || 0, currentText.length - transformedIndex),
    };
  }
  return {
    index,
    deleteLength: Math.min(diff.deleteLength || 0, currentText.length - index),
  };
}

function applyTextDiffFromBase(yText, baseValue = "", nextValue = "") {
  const currentValue = yText.toString();
  const baseText = String(baseValue || "");
  const nextText = String(nextValue || "");
  if (currentValue === nextText) return false;
  if (currentValue === baseText) return applyTextDiff(yText, nextText);
  const diff = textDiffParts(baseText, nextText);
  if (!diff.changed) return false;
  const patch = anchoredTextPatchPosition(currentValue, baseText, diff);
  const index = Math.max(0, Math.min(patch.index, yText.length));
  const deleteLength = Math.max(0, Math.min(patch.deleteLength, yText.length - index));
  if (deleteLength > 0) yText.delete(index, deleteLength);
  if (diff.insertText) yText.insert(index, diff.insertText);
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

async function syncCollabDayTextFieldToDoc(field, value) {
  if (!canEdit() || isReadonlyMode) return;
  await bindCollabDayTextDoc();
  const yText = collabDayTextFields[field];
  if (!collabDayTextDoc || !yText || isApplyingCollabDayTextRemote) return;
  collabDayTextDoc.transact(() => {
    applyTextDiff(yText, value);
  }, "local-day-text-input");
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

async function syncCollabStructValuesToDoc(values = {}, origin = "local-struct-action") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabStructMap || isApplyingCollabTextRemote) return false;
  const entries = Object.entries(values).filter(([field]) => COLLAB_STRUCT_FIELDS.some((meta) => meta.field === field));
  if (!entries.length) return true;
  const changed = entries.some(([field, value]) => !sameSerialized(collabStructMap.get(field), value));
  if (!changed) return true;
  collabTextDoc.transact(() => {
    entries.forEach(([field, value]) => {
      collabStructMap.set(field, clone(value));
    });
  }, origin);
  return true;
}

async function addCollaborativeComment(text, anchor = null) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabCommentsArray || isApplyingCollabTextRemote) return false;
  const normalizedAnchor = normalizeCommentAnchor(anchor);
  const comment = {
    id: uid(),
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
    ...(normalizedAnchor ? { anchor: normalizedAnchor } : {}),
  };
  if (!comment.text) return true;
  collabTextDoc.transact(() => {
    collabCommentsArray.push([comment]);
  }, "local-comment-input");
  return comment;
}

async function addCollaborativeDayComment(text, anchor = null) {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabDayTextDoc();
  if (!collabDayTextDoc || !collabDayCommentsArray || isApplyingCollabDayTextRemote) return false;
  const normalizedAnchor = normalizeCommentAnchor(anchor);
  const comment = {
    id: uid(),
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
    ...(normalizedAnchor?.scope === "day" ? { anchor: normalizedAnchor } : {}),
  };
  if (!comment.text) return true;
  collabDayTextDoc.transact(() => {
    collabDayCommentsArray.push([comment]);
  }, "local-day-comment-input");
  return comment;
}

async function addCollaborativeCommentReply(parentId, text) {
  if (!canEdit() || isReadonlyMode || !parentId) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabCommentsArray || isApplyingCollabTextRemote) return false;
  const comments = normalizeComments(collabCommentsArray.toArray());
  const parent = comments.find((comment) => comment.id === parentId && !comment.parentId);
  if (!parent) return false;
  const reply = normalizeCommentEntry({
    id: uid(),
    parentId,
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
  });
  if (!reply) return true;
  collabTextDoc.transact(() => {
    collabCommentsArray.push([reply]);
  }, "local-comment-reply");
  return reply;
}

async function addCollaborativeDayCommentReply(parentId, text) {
  if (!canEdit() || isReadonlyMode || !parentId) return false;
  await bindCollabDayTextDoc();
  if (!collabDayTextDoc || !collabDayCommentsArray || isApplyingCollabDayTextRemote) return false;
  const comments = normalizeComments(collabDayCommentsArray.toArray());
  const parent = comments.find((comment) => comment.id === parentId && !comment.parentId);
  if (!parent) return false;
  const reply = normalizeCommentEntry({
    id: uid(),
    parentId,
    author: getCollabName(),
    text: String(text || "").trim(),
    at: new Date().toISOString(),
  });
  if (!reply) return true;
  collabDayTextDoc.transact(() => {
    collabDayCommentsArray.push([reply]);
  }, "local-day-comment-reply");
  return reply;
}

async function updateCollaborativeComment(commentId, patch = {}) {
  if (!canEdit() || isReadonlyMode || !commentId) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabCommentsArray || isApplyingCollabTextRemote) return false;
  const comments = collabCommentsArray.toArray();
  const index = comments.findIndex((comment) => comment?.id === commentId && !comment?.parentId);
  if (index < 0) return false;
  const next = normalizeCommentEntry({ ...comments[index], ...patch });
  if (!next) return false;
  collabTextDoc.transact(() => {
    collabCommentsArray.delete(index, 1);
    collabCommentsArray.insert(index, [next]);
  }, "local-comment-update");
  return next;
}

async function updateCollaborativeDayComment(commentId, patch = {}) {
  if (!canEdit() || isReadonlyMode || !commentId) return false;
  await bindCollabDayTextDoc();
  if (!collabDayTextDoc || !collabDayCommentsArray || isApplyingCollabDayTextRemote) return false;
  const comments = collabDayCommentsArray.toArray();
  const index = comments.findIndex((comment) => comment?.id === commentId && !comment?.parentId);
  if (index < 0) return false;
  const next = normalizeCommentEntry({ ...comments[index], ...patch });
  if (!next) return false;
  collabDayTextDoc.transact(() => {
    collabDayCommentsArray.delete(index, 1);
    collabDayCommentsArray.insert(index, [next]);
  }, "local-day-comment-update");
  return next;
}

async function deleteCollaborativeComment(commentId) {
  if (!canEdit() || isReadonlyMode || !commentId) return false;
  await bindCollabTextDoc();
  if (!collabTextDoc || !collabCommentsArray || isApplyingCollabTextRemote) return false;
  const comments = normalizeComments(collabCommentsArray.toArray());
  const target = comments.find((comment) => comment.id === commentId);
  if (!target) return true;
  const deleteIds = new Set([commentId]);
  if (!target.parentId) {
    comments.forEach((comment) => {
      if (comment.parentId === commentId) deleteIds.add(comment.id);
    });
  }
  collabTextDoc.transact(() => {
    for (let index = collabCommentsArray.length - 1; index >= 0; index -= 1) {
      const comment = collabCommentsArray.get(index);
      if (deleteIds.has(comment?.id)) collabCommentsArray.delete(index, 1);
    }
  }, "local-comment-delete");
  return true;
}

async function deleteCollaborativeDayComment(commentId) {
  if (!canEdit() || isReadonlyMode || !commentId) return false;
  await bindCollabDayTextDoc();
  if (!collabDayTextDoc || !collabDayCommentsArray || isApplyingCollabDayTextRemote) return false;
  const comments = normalizeComments(collabDayCommentsArray.toArray());
  const target = comments.find((comment) => comment.id === commentId);
  if (!target) return true;
  const deleteIds = new Set([commentId]);
  if (!target.parentId) {
    comments.forEach((comment) => {
      if (comment.parentId === commentId) deleteIds.add(comment.id);
    });
  }
  collabDayTextDoc.transact(() => {
    for (let index = collabDayCommentsArray.length - 1; index >= 0; index -= 1) {
      const comment = collabDayCommentsArray.get(index);
      if (deleteIds.has(comment?.id)) collabDayCommentsArray.delete(index, 1);
    }
  }, "local-day-comment-delete");
  return true;
}

async function applyRemotePlan(remotePlan, meta = {}) {
  isApplyingRemote = true;
  const activeStopId = currentStop()?.id || "";
  const remoteActiveStop = activeStopId ? remotePlan.days?.flatMap((day) => day.stops || []).find((stop) => stop.id === activeStopId) : null;
  const currentTextState = activeStopId === collabTextStopId ? currentStop()?.textYjs || currentStop()?.noteYjs || "" : "";
  const currentDayMetas = normalizeDayMetas(state.days || []);
  const currentDayBlocks = normalizeDayBlocksFromDays(state.days || []);
  const currentTransportQuotes = normalizeTransportQuotes(state.transportQuotes || []);
  const currentCandidates = normalizeCandidateStops(state.candidates || []);
  const currentActivities = normalizeActivities(state.activities || []);
  const currentSettings = {
    ...currentPlanMeta(),
    partySize: Math.max(1, Number.parseInt(state.partySize || 1, 10) || 1),
    budgetLimit: numberValue(state.budgetLimit || 10000),
  };
  const nextRemotePlan = ensurePlanDates(clone(remotePlan));
  state = nextRemotePlan;
  const appliedLivePlanYjs = state.planYjs
    ? await replaceLivePlanDocWithYjsState(state.planYjs, meta.label || "已应用云端计划结构协作快照")
    : false;
  if (!appliedLivePlanYjs && state.planYjs) {
    await applyPlanYjsStateToCurrentPlan(state.planYjs, meta.label || "已应用云端计划结构协作快照", { scheduleSave: false });
  }
  lastSyncedState = clone(state);
  lastRemoteUpdatedAt = meta.updatedAt || lastRemoteUpdatedAt;
  const remoteTextState = remoteActiveStop?.textYjs || remoteActiveStop?.noteYjs || "";
  if (remoteTextState && remoteTextState !== currentTextState) {
    destroyCollabTextDoc();
  }
  destroyCollabDayTextDoc();
  if (!appliedLivePlanYjs && (
    !sameSerialized(currentDayMetas, normalizeDayMetas(state.days || [])) ||
    !sameSerialized(currentDayBlocks, normalizeDayBlocksFromDays(state.days || [])) ||
    !sameSerialized(currentTransportQuotes, normalizeTransportQuotes(state.transportQuotes || [])) ||
    !sameSerialized(currentCandidates, normalizeCandidateStops(state.candidates || [])) ||
    !sameSerialized(currentActivities, normalizeActivities(state.activities || [])) ||
    !sameSerialized(currentSettings, {
      ...currentPlanMeta(),
      partySize: Math.max(1, Number.parseInt(state.partySize || 1, 10) || 1),
      budgetLimit: numberValue(state.budgetLimit || 10000),
    })
  )) {
    destroyCollabPlanDoc();
  }
  if (appliedLivePlanYjs) state.planYjs = currentPlanYjsState();
  persistLocalState();
  await refreshEditAccessFromUrl();
  isApplyingRemote = false;
}

async function resolveConflict(mode) {
  if (!pendingConflict || !requireEdit("处理协作冲突")) return;
  if (!confirmRemotePlanReplace(mode === "remote" ? "使用云端版本" : mode === "merge" ? "合并协作冲突" : "保留我的版本")) return;
  persistCurrentPlanFromDoc("处理冲突前已同步当前协作结构");
  const conflict = pendingConflict;
  const localPlan = clone(state);
  const remotePlan = ensurePlanDates(clone(conflict.remote));
  const basePlan = clone(conflict.base || lastSyncedState || {});
  isResolvingConflict = true;
  try {
    savePlanSnapshot(localPlan, "冲突处理前：我的版本");
    savePlanSnapshot(remotePlan, "冲突处理前：云端版本", conflict.updatedBy || "协作者");
    if (mode === "remote") {
      await applyRemotePlan(remotePlan, { updatedAt: conflict.updatedAt || "" });
      hideConflictPanel();
      dom.saveState.textContent = "已使用云端版本";
      dom.collabStatus.textContent = "已采用协作者保存的云端版本，你的旧版本已进入历史版本。";
      render();
      return;
    }
    let mergedWithYjsSnapshot = false;
    if (mode === "merge") {
      mergedWithYjsSnapshot = await mergeConflictPlanYjsSnapshot(remotePlan, "已通过协作快照合并冲突");
      if (!mergedWithYjsSnapshot) state = mergePlans(localPlan, remotePlan, basePlan);
    } else {
      state = ensurePlanDates(localPlan);
    }
    persistLocalState();
    lastRemoteUpdatedAt = conflict.updatedAt || lastRemoteUpdatedAt;
    hideConflictPanel();
    await logActivity(mergedWithYjsSnapshot ? "通过协作快照合并冲突" : mode === "merge" ? "合并协作冲突" : "保留本地版本解决冲突");
    if (!mergedWithYjsSnapshot) {
      await replacePlanCollabDoc(mode === "merge" ? "local-conflict-merge" : "local-conflict-keep", {
        allowReplace: true,
        reason: mode === "merge" ? "conflict-merge" : "conflict-keep",
      });
    }
    await pushRemoteState(mergedWithYjsSnapshot ? "已通过协作快照合并冲突" : mode === "merge" ? "已合并协作冲突" : "已保留我的版本");
    render();
  } catch (error) {
    pendingConflict = conflict;
    showConflictPanel(conflict);
    dom.collabStatus.textContent = `处理冲突失败：${error.message}`;
  } finally {
    isResolvingConflict = false;
  }
}

async function handleRemotePlanUpdate(next) {
  if (!next?.data?.days?.length || next.updated_at === lastRemoteUpdatedAt || isStaleRemoteUpdate(next.updated_at)) return;
  persistCurrentPlanFromDoc("收到云端更新前已同步当前协作结构");
  const remotePlan = ensurePlanDates(clone(next.data));
  if (pendingLocalRemoteUpdatedAt && next.updated_at === pendingLocalRemoteUpdatedAt && samePlanContent(state, remotePlan)) {
    lastRemoteUpdatedAt = next.updated_at || lastRemoteUpdatedAt;
    lastSyncedState = clone(remotePlan);
    pendingLocalRemoteUpdatedAt = "";
    hideConflictPanel();
    return;
  }
  if (remotePlan.planYjs) {
    const localHadChanges = hasLocalChanges();
    if (!localHadChanges) saveVersionSnapshot("协作者更新前版本");
    const appliedYjs = await mergePlanYjsStateIntoLiveDoc(remotePlan.planYjs, `${next.updated_by || "协作者"} 的云端协作快照已合并`);
    if (appliedYjs) {
      lastRemoteUpdatedAt = next.updated_at || lastRemoteUpdatedAt;
      if (!localHadChanges) lastSyncedState = clone(state);
      pendingLocalRemoteUpdatedAt = "";
      await refreshEditAccessFromUrl();
      persistLocalState();
      hideConflictPanel();
      dom.saveState.textContent = "收到协作者协作快照";
      dom.collabStatus.textContent = localHadChanges
        ? `${next.updated_by || "协作者"} 的协作快照已合并，本地修改会继续保留。`
        : next.updated_by
          ? `${next.updated_by} 刚刚同步了协作快照`
          : "共享计划协作快照已更新";
      render();
      if (localHadChanges && pendingPlanUpdates().length) {
        flushPendingPlanUpdates("合并云端协作快照后重放离线协作更新").catch((error) => {
          dom.collabStatus.textContent = `重放离线协作更新失败：${error.message}`;
        });
      }
      return;
    }
  }
  if (hasLocalChanges() && !samePlanContent(state, remotePlan)) {
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
  await applyRemotePlan(remotePlan, { updatedAt: next.updated_at || "" });
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
  copyInviteLinkBtn: document.querySelector("#copyInviteLinkBtn"),
  copyReadonlyLinkBtn: document.querySelector("#copyReadonlyLinkBtn"),
  editAccessForm: document.querySelector("#editAccessForm"),
  editAccessInput: document.querySelector("#editAccessInput"),
  editAccessBtn: document.querySelector("#editAccessBtn"),
  editAccessStatus: document.querySelector("#editAccessStatus"),
  conflictPanel: document.querySelector("#conflictPanel"),
  conflictText: document.querySelector("#conflictText"),
  conflictDiff: document.querySelector("#conflictDiff"),
  conflictDetail: document.querySelector("#conflictDetail"),
  mergeConflictBtn: document.querySelector("#mergeConflictBtn"),
  keepLocalConflictBtn: document.querySelector("#keepLocalConflictBtn"),
  useRemoteConflictBtn: document.querySelector("#useRemoteConflictBtn"),
  budgetTotal: document.querySelector("#budgetTotal"),
  budgetMeter: document.querySelector("#budgetMeter"),
  budgetGrid: document.querySelector("#budgetGrid"),
  budgetAdoptEstimatesBtn: document.querySelector("#budgetAdoptEstimatesBtn"),
  budgetEnrichPlacesBtn: document.querySelector("#budgetEnrichPlacesBtn"),
  partySizeInput: document.querySelector("#partySizeInput"),
  budgetLimitInput: document.querySelector("#budgetLimitInput"),
  budgetSettlement: document.querySelector("#budgetSettlement"),
  budgetCombo: document.querySelector("#budgetCombo"),
  versionCount: document.querySelector("#versionCount"),
  versionPreview: document.querySelector("#versionPreview"),
  versionList: document.querySelector("#versionList"),
  commentIndexCount: document.querySelector("#commentIndexCount"),
  commentIndexFilters: document.querySelector("#commentIndexFilters"),
  commentIndexList: document.querySelector("#commentIndexList"),
  dayList: document.querySelector("#dayList"),
  routeLabel: document.querySelector("#routeLabel"),
  dayTitle: document.querySelector("#dayTitle"),
  saveState: document.querySelector("#saveState"),
  presenceText: document.querySelector("#presenceText"),
  dayPills: document.querySelector("#dayPills"),
  flowTitle: document.querySelector("#flowTitle"),
  flowSteps: document.querySelector("#flowSteps"),
  flowHelper: document.querySelector("#flowHelper"),
  flowNextBtn: document.querySelector("#flowNextBtn"),
  flowAdvancedToggle: document.querySelector("#flowAdvancedToggle"),
  dayForm: document.querySelector("#dayForm"),
  dayEditorStatus: document.querySelector("#dayEditorStatus"),
  fieldDayDate: document.querySelector("#fieldDayDate"),
  fieldDayTitle: document.querySelector("#fieldDayTitle"),
  fieldDayRoute: document.querySelector("#fieldDayRoute"),
  fieldDayWeather: document.querySelector("#fieldDayWeather"),
  fieldDayTransport: document.querySelector("#fieldDayTransport"),
  dayCommentTitle: document.querySelector("#dayCommentTitle"),
  dayCommentList: document.querySelector("#dayCommentList"),
  dayCommentAnchorHint: document.querySelector("#dayCommentAnchorHint"),
  dayCommentForm: document.querySelector("#dayCommentForm"),
  dayCommentInput: document.querySelector("#dayCommentInput"),
  dayBlocksStatus: document.querySelector("#dayBlocksStatus"),
  dayBlockForm: document.querySelector("#dayBlockForm"),
  dayBlockType: document.querySelector("#dayBlockType"),
  dayBlockInput: document.querySelector("#dayBlockInput"),
  dayBlockList: document.querySelector("#dayBlockList"),
  addDayBtn: document.querySelector("#addDayBtn"),
  moveDayUpBtn: document.querySelector("#moveDayUpBtn"),
  moveDayDownBtn: document.querySelector("#moveDayDownBtn"),
  deleteDayBtn: document.querySelector("#deleteDayBtn"),
  timeline: document.querySelector("#timeline"),
  candidateGrid: document.querySelector("#candidateGrid"),
  stayFoodSummary: document.querySelector("#stayFoodSummary"),
  lodgingBoard: document.querySelector("#lodgingBoard"),
  diningBoard: document.querySelector("#diningBoard"),
  recommendLodgingBtn: document.querySelector("#recommendLodgingBtn"),
  addLodgingBtn: document.querySelector("#addLodgingBtn"),
  importLodgingBtn: document.querySelector("#importLodgingBtn"),
  recommendDiningBtn: document.querySelector("#recommendDiningBtn"),
  addDiningBtn: document.querySelector("#addDiningBtn"),
  importDiningBtn: document.querySelector("#importDiningBtn"),
  routeDistance: document.querySelector("#routeDistance"),
  routeDuration: document.querySelector("#routeDuration"),
  mapProviderStatus: document.querySelector("#mapProviderStatus"),
  mapCanvas: document.querySelector("#mapCanvas"),
  placePhoto: document.querySelector("#placePhoto"),
  placePhotoMeta: document.querySelector("#placePhotoMeta"),
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
  commentAnchorHint: document.querySelector("#commentAnchorHint"),
  commentForm: document.querySelector("#commentForm"),
  commentInput: document.querySelector("#commentInput"),
  stopForm: document.querySelector("#stopForm"),
  fieldTime: document.querySelector("#fieldTime"),
  fieldTitle: document.querySelector("#fieldTitle"),
  fieldType: document.querySelector("#fieldType"),
  fieldBudget: document.querySelector("#fieldBudget"),
  fieldPaid: document.querySelector("#fieldPaid"),
  fieldPayer: document.querySelector("#fieldPayer"),
  fieldBudgetSelected: document.querySelector("#fieldBudgetSelected"),
  fieldAddress: document.querySelector("#fieldAddress"),
  fieldAmapKeyword: document.querySelector("#fieldAmapKeyword"),
  fieldLng: document.querySelector("#fieldLng"),
  fieldLat: document.querySelector("#fieldLat"),
  fieldImage: document.querySelector("#fieldImage"),
  fieldReferenceUrl: document.querySelector("#fieldReferenceUrl"),
  fieldTags: document.querySelector("#fieldTags"),
  fieldNote: document.querySelector("#fieldNote"),
  noteCollabStatus: document.querySelector("#noteCollabStatus"),
  officialImageSearchLink: document.querySelector("#officialImageSearchLink"),
  editorPanel: document.querySelector(".editor-panel"),
  editorLockState: document.querySelector("#editorLockState"),
  editLockBanner: document.querySelector("#editLockBanner"),
  editLockText: document.querySelector("#editLockText"),
  addStopBtn: document.querySelector("#addStopBtn"),
  quickAddForm: document.querySelector("#quickAddForm"),
  quickPlaceName: document.querySelector("#quickPlaceName"),
  quickType: document.querySelector("#quickType"),
  quickAmapKeyword: document.querySelector("#quickAmapKeyword"),
  quickTime: document.querySelector("#quickTime"),
  quickBudget: document.querySelector("#quickBudget"),
  quickPaid: document.querySelector("#quickPaid"),
  quickPayer: document.querySelector("#quickPayer"),
  quickAddress: document.querySelector("#quickAddress"),
  quickSelected: document.querySelector("#quickSelected"),
  openAmapBtn: document.querySelector("#openAmapBtn"),
  addCandidateBtn: document.querySelector("#addCandidateBtn"),
  cancelCandidateEditBtn: document.querySelector("#cancelCandidateEditBtn"),
  quickAmapLink: document.querySelector("#quickAmapLink"),
  quickAmapCandidates: document.querySelector("#quickAmapCandidates"),
  optimizeRouteBtn: document.querySelector("#optimizeRouteBtn"),
  optimizeHint: document.querySelector("#optimizeHint"),
  aiRouteReport: document.querySelector("#aiRouteReport"),
  amapRouteMode: document.querySelector("#amapRouteMode"),
  amapRouteStrategy: document.querySelector("#amapRouteStrategy"),
  amapRouteBtn: document.querySelector("#amapRouteBtn"),
  amapRouteRetryBtn: document.querySelector("#amapRouteRetryBtn"),
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
  dateScoutStart: document.querySelector("#dateScoutStart"),
  dateScoutEnd: document.querySelector("#dateScoutEnd"),
  dateScoutDays: document.querySelector("#dateScoutDays"),
  dateScoutPriority: document.querySelector("#dateScoutPriority"),
  dateScoutSearchBtn: document.querySelector("#dateScoutSearchBtn"),
  dateScoutStatus: document.querySelector("#dateScoutStatus"),
  dateScoutResults: document.querySelector("#dateScoutResults"),
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
  manualQuoteSubmitBtn: document.querySelector("#manualQuoteSubmitBtn"),
  cancelQuoteEditBtn: document.querySelector("#cancelQuoteEditBtn"),
  amapLookupBtn: document.querySelector("#amapLookupBtn"),
  fieldAmapLink: document.querySelector("#fieldAmapLink"),
  fieldReferenceLink: document.querySelector("#fieldReferenceLink"),
  fieldAmapCandidates: document.querySelector("#fieldAmapCandidates"),
  exportBtn: document.querySelector("#exportBtn"),
  importJsonBtn: document.querySelector("#importJsonBtn"),
  importJsonInput: document.querySelector("#importJsonInput"),
  planSelect: document.querySelector("#planSelect"),
  newPlanBtn: document.querySelector("#newPlanBtn"),
  deletePlanBtn: document.querySelector("#deletePlanBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  importModal: document.querySelector("#importModal"),
  importTitle: document.querySelector("#importTitle"),
  importCopy: document.querySelector("#importCopy"),
  importForm: document.querySelector("#importForm"),
  importProvider: document.querySelector("#importProvider"),
  importCategory: document.querySelector("#importCategory"),
  importTarget: document.querySelector("#importTarget"),
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
  importSubmitBtn: document.querySelector("#importSubmitBtn"),
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
  amapJsKeyInput: document.querySelector("#amapJsKeyInput"),
  amapSecurityCodeInput: document.querySelector("#amapSecurityCodeInput"),
  weatherEndpointInput: document.querySelector("#weatherEndpointInput"),
  placeImageEndpointInput: document.querySelector("#placeImageEndpointInput"),
  saveServiceConfigBtn: document.querySelector("#saveServiceConfigBtn"),
  syncWeatherBtn: document.querySelector("#syncWeatherBtn"),
  serviceStatusText: document.querySelector("#serviceStatusText"),
  activityFilters: document.querySelector("#activityFilters"),
  activityList: document.querySelector("#activityList"),
};

const urlParams = new URLSearchParams(window.location.search);
const forceLocalMode = urlParams.get("local") === "1";
let tripId = urlParams.get("trip") || (forceLocalMode ? "" : localStorage.getItem("tripboard-current-trip-id")) || "";
let forcedReadonlyMode = urlParams.get("mode") === "readonly";
const planStore = window.createTripboardPlanStore({
  localStorage,
  storageKey: STORAGE_KEY,
  libraryKey: PLAN_LIBRARY_KEY,
  currentPlanIdKey: CURRENT_PLAN_ID_KEY,
  clone,
  uid,
  safeJsonParse,
  ensurePlanDates,
  buildFallbackPlan: buildKyotoPlan,
  getTripId: () => tripId,
});
let state = ensurePlanDates(loadState());
let activeDay = 0;
let activeStop = 0;
let userSelectedStop = false;
let pendingProvider = "";
let quickAmapPlace = null;
let lastAmapRouteRequest = null;
let transportFilterApplied = false;
let transportProviderItems = [];
let transportProviderSource = "";
let multiOriginComparisons = [];
let editingTransportQuoteId = "";
let dateScoutOptions = [];
let selectedDateScoutId = "";
const FLOW_UI_KEY = "tripboard-flow-ui-v2";
const FLOW_STEPS = [
  { id: "setup", title: "创建计划", short: "日期/目的地", helper: "先按天气和交通成本筛选出游日期，再生成推荐计划或空白模板。", selectors: [".guide-panel"] },
  { id: "itinerary", title: "安排每日路线", short: "日程/地点", helper: "查看每日路线，添加或调整当天地点。", selectors: [".timeline-wrap", ".day-editor-panel", ".day-blocks-panel", ".quick-add-panel", ".candidate-panel", ".map-panel", ".place-detail", ".editor-panel"] },
  { id: "booking", title: "交通住宿餐饮", short: "机票/订单", helper: "筛选交通报价，导入住宿和餐饮订单，先放备选池也可以。", selectors: [".transport-panel", ".stay-food-panel", ".candidate-panel"] },
  { id: "budget", title: "预算与协作", short: "分账/评论", helper: "检查预算组合、分账、批注和协作记录。", selectors: [".side-block", ".day-comments-panel", ".comments-panel", ".activity-panel"] },
  { id: "share", title: "发布共享", short: "接口/分享", helper: "最后再配置高级接口、天气、AI 或复制共享链接。", selectors: [".collab-panel", ".service-panel", ".sync-panel", ".activity-panel"] },
];
let flowUi = safeJsonParse(localStorage.getItem(FLOW_UI_KEY), { step: "", showAll: false, pinned: false }) || { step: "", showAll: false, pinned: false };
let editingCandidateId = "";
const serviceClient = window.createTripboardServiceClient({
  fetch,
  fetchWithTimeout,
  localStorage,
  safeJsonParse,
  serviceConfigKey: SERVICE_CONFIG_KEY,
  transportConfigKey: CTRIP_CONFIG_KEY,
  externalImportConfigKey: EXTERNAL_IMPORT_CONFIG_KEY,
  getAppConfig: () => window.TRIPBOARD_CONFIG || {},
});
let ctripConfig = serviceClient.loadTransportConfig();
let externalImportConfig = serviceClient.loadExternalImportConfig();
let lastParsedImport = null;
let serviceConfig = serviceClient.loadServiceConfig();
const serviceApi = window.createTripboardServiceApi({
  serviceClient,
  fetch,
});
let memberProfile = safeJsonParse(sessionStorage.getItem(MEMBER_PROFILE_KEY), null);
let onlineMembers = [];
const sessionId = crypto.randomUUID ? crypto.randomUUID() : uid();
let supabaseClient = null;
let realtimeChannel = null;
let editAccessGranted = false;
let editAccessRequired = false;
let isReadonlyMode = forcedReadonlyMode;
let isApplyingRemote = false;
let lastRemoteUpdatedAt = "";
let lastSyncedState = null;
let pendingLocalRemoteUpdatedAt = "";
let pendingConflict = null;
let confirmedRemoteRecordEditUntil = {};
let pendingVersionRestoreId = "";
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
let collabDayTextDoc = null;
let collabDayTextFields = {};
let collabDayTextDayId = "";
let collabDayCommentsArray = null;
let isApplyingCollabDayTextRemote = false;
let collabDayTextSaveTimer = null;
let collabPlanDoc = null;
let collabDayMetasArray = null;
let collabDayTextStatesMap = null;
let collabDayBlockTextStatesMap = null;
let collabDayBlockTextsMap = null;
let collabStopListsMap = null;
let collabStopTextStatesMap = null;
let collabDayBlocksMap = null;
let collabTransportQuotesArray = null;
let collabCandidatesArray = null;
let collabActivitiesArray = null;
let collabSettingsMap = null;
let collabSettingTextStatesMap = null;
let collabSettingTextsMap = null;
let collabPlanTripId = "";
let collabPlanSaveTimer = null;
let isApplyingCollabPlanRemote = false;
let collabPlanBindRequestId = 0;
let planMetaInputSyncTimers = {};
let dayFieldSyncTimer = null;
let dayBlockEditTimer = null;
let blockReplyingCommentId = "";
let blockCommentFilters = {};
let dayBlockTextBaselines = {};
let dayBlockTextSyncChains = {};
let activeBlockPresenceId = "";
let draggingDayBlockId = "";
let selectedDayBlockIds = new Set();
let lastSelectedDayBlockId = "";
let activeDayBlockCommand = { blockId: "", index: 0, query: "" };
let collapsedDayBlockIds = loadCollapsedDayBlocks();
let previewDayBlockIds = new Set();
let presenceTrackTimer = null;
let lastCommentAnchor = null;
let replyingCommentId = "";
let commentFilter = "all";
let dayReplyingCommentId = "";
let dayCommentFilter = "all";
let commentIndexFilter = "open";
let activityFilter = "all";
let yjsModule = null;
let yjsReadyPromise = null;
let collabTextBindRequestId = 0;
let collabDayTextBindRequestId = 0;
let amapMap = null;
let amapMapMarkers = [];
let amapMapPolylines = [];
let amapLoaderPromise = null;
let amapLoadedKey = "";
let amapRenderQueued = false;
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
  return planStore.loadState();
}

function newLocalPlanId() {
  return planStore.newLocalPlanId();
}

function sharedLocalPlanId(id = tripId) {
  return planStore.sharedLocalPlanId(id);
}

function currentLocalPlanId() {
  return planStore.currentLocalPlanId();
}

function setCurrentLocalPlanId(id = "") {
  planStore.setCurrentLocalPlanId(id);
}

function planLibrary() {
  return planStore.planLibrary();
}

function savePlanLibrary(list = []) {
  return planStore.savePlanLibrary(list);
}

function normalizePlanLibrary(list = []) {
  return planStore.normalizePlanLibrary(list);
}

function planRecordFromState(plan = state, id = currentLocalPlanId() || newLocalPlanId(), options = {}) {
  return planStore.planRecordFromPlan(plan, id, options);
}

function ensurePlanLibrary() {
  return planStore.ensurePlanLibrary();
}

function persistLocalState(plan = state, options = {}) {
  return planStore.persistLocalState(plan, options);
}

function renderPlanSwitcher() {
  if (!dom.planSelect) return;
  const library = planLibrary();
  const currentId = currentLocalPlanId();
  dom.planSelect.innerHTML = library
    .map((record) => {
      const suffix = record.tripId ? " · 共享" : " · 本地";
      const label = `${record.label || record.data?.name || "未命名计划"}${suffix}`;
      return `<option value="${escapeHtml(record.id)}">${escapeHtml(label)}</option>`;
    })
    .join("");
  if (currentId && library.some((record) => record.id === currentId)) dom.planSelect.value = currentId;
  if (dom.deletePlanBtn) dom.deletePlanBtn.disabled = isReadonlyMode || !library.length;
}

function resetUrlForLocalPlan() {
  const url = new URL(window.location.href);
  url.searchParams.delete("trip");
  url.searchParams.delete("mode");
  url.searchParams.delete("editKey");
  window.history.replaceState({}, "", url.toString());
  forcedReadonlyMode = false;
  isReadonlyMode = false;
}

function disconnectSharedSessionForLocalPlan() {
  if (realtimeChannel && supabaseClient) {
    supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  tripId = "";
  localStorage.removeItem("tripboard-current-trip-id");
  lastRemoteUpdatedAt = "";
  lastSyncedState = null;
  pendingLocalRemoteUpdatedAt = "";
  pendingConflict = null;
  editAccessGranted = false;
  editAccessRequired = false;
  if (!forcedReadonlyMode) isReadonlyMode = false;
  destroyCollabTextDoc();
  destroyCollabDayTextDoc();
  destroyCollabPlanDoc();
  hideConflictPanel();
}

function resetTransientPlanUi(message = "已切换计划") {
  activeDay = 0;
  activeStop = 0;
  transportFilterApplied = false;
  transportProviderItems = [];
  transportProviderSource = "";
  multiOriginComparisons = [];
  editingTransportQuoteId = "";
  lastAmapRouteRequest = null;
  clearDateScoutResults(message);
  collapsedDayBlockIds = loadCollapsedDayBlocks();
  syncGuideStateFromPlan();
  if (dom.transportFrom) dom.transportFrom.value = state.origin || guideState.origin || "";
  if (dom.transportTo) dom.transportTo.value = "";
}

function historyKey() {
  return `${VERSION_PREFIX}${tripId || "local"}`;
}

function collapsedDayBlocksKey() {
  return `${COLLAPSED_BLOCKS_PREFIX}${tripId || "local"}`;
}

function loadCollapsedDayBlocks() {
  const stored = safeJsonParse(localStorage.getItem(collapsedDayBlocksKey()), []);
  return new Set(Array.isArray(stored) ? stored.filter(Boolean) : []);
}

function saveCollapsedDayBlocks() {
  localStorage.setItem(collapsedDayBlocksKey(), JSON.stringify([...collapsedDayBlockIds]));
}

function editAccessKey() {
  return `${EDIT_ACCESS_PREFIX}${tripId || "local"}`;
}

function localEditAccessHash() {
  return localStorage.getItem(editAccessKey()) || "";
}

function editKeyValueKey() {
  return `${EDIT_KEY_VALUE_PREFIX}${tripId || "local"}`;
}

function currentEditKeyValue() {
  return sessionStorage.getItem(editKeyValueKey()) || "";
}

function setCurrentEditKeyValue(value = "") {
  if (!tripId || !value) return;
  sessionStorage.setItem(editKeyValueKey(), value);
}

function setLocalEditAccess(hash = "") {
  if (!tripId || !hash) return;
  localStorage.setItem(editAccessKey(), hash);
}

async function refreshEditAccessFromUrl() {
  const hash = state.editKeyHash || "";
  if (!hash || forcedReadonlyMode) {
    editAccessRequired = Boolean(hash) && forcedReadonlyMode;
    editAccessGranted = !forcedReadonlyMode && !hash;
    isReadonlyMode = forcedReadonlyMode;
    return;
  }
  editAccessRequired = true;
  editAccessGranted = localEditAccessHash() === hash;
  const editKey = urlParams.get("editKey") || "";
  if (!editAccessGranted && editKey) {
    const incomingHash = await sha256Text(`${tripId}:${editKey}`);
    editAccessGranted = incomingHash === hash;
    if (editAccessGranted) {
      setLocalEditAccess(hash);
      setCurrentEditKeyValue(editKey);
    }
  }
  isReadonlyMode = !editAccessGranted;
}

function versionHistory() {
  return safeJsonParse(localStorage.getItem(historyKey()), []) || [];
}

function savePlanSnapshot(plan, reason = "保存前版本", by = getCollabName()) {
  if (!plan?.days?.length) return;
  const history = versionHistory();
  const last = history[0];
  const snapshot = planVersionSnapshot(plan);
  const serialized = planVersionSerialized(snapshot);
  if (last?.serialized === serialized) return;
  const entry = {
    id: uid(),
    reason,
    at: new Date().toISOString(),
    by,
    serialized,
    data: snapshot,
  };
  const key = historyKey();
  let saved = false;
  for (let keep = Math.min(history.length, MAX_VERSION_HISTORY - 1); keep >= 0; keep -= 1) {
    try {
      localStorage.setItem(key, JSON.stringify([entry, ...history.slice(0, keep)]));
      saved = true;
      break;
    } catch (error) {
      if (error?.name !== "QuotaExceededError") {
        console.warn("Version snapshot could not be saved", error);
        break;
      }
    }
  }
  if (!saved) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Version history cleanup failed", error);
    }
    console.warn("Version snapshot skipped because local storage quota is full");
  }
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
      serialized: planVersionSerialized(entry.data),
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

function selectedVersionEntry(versionId = pendingVersionRestoreId) {
  return versionHistory().find((item) => item.id === versionId) || null;
}

function renderVersionPreview() {
  if (!dom.versionPreview) return;
  const entry = selectedVersionEntry();
  if (!entry?.data?.days?.length) {
    dom.versionPreview.hidden = true;
    dom.versionPreview.innerHTML = "";
    return;
  }
  const summary = versionPreviewSummary(entry.data, state);
  const impact = versionRestoreImpactSummary();
  const when = entry.at ? new Date(entry.at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "刚刚";
  dom.versionPreview.hidden = false;
  dom.versionPreview.innerHTML = `
    <strong>准备恢复：${escapeHtml(entry.reason || "历史版本")}</strong>
    <span>${escapeHtml(when)} · ${escapeHtml(entry.by || "未知成员")}</span>
    <small>${escapeHtml(versionDiffSummary(entry.data, state))}</small>
    <ul>
      ${summary.items.length ? summary.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>与当前版本一致</li>"}
      ${summary.extra ? `<li>还有 ${summary.extra} 项变化</li>` : ""}
    </ul>
    ${
      summary.details.length
        ? `<div class="version-restore-detail">
            <strong>字段级影响</strong>
            <ul>
              ${summary.details.map((item) => `
                <li>
                  <span>${escapeHtml(item.label)}</span>
                  <small>当前：${escapeHtml(item.current)}</small>
                  <small>恢复后：${escapeHtml(item.restore)}</small>
                </li>
              `).join("")}
              ${summary.detailExtra ? `<li><span>还有 ${summary.detailExtra} 项字段变化</span></li>` : ""}
            </ul>
          </div>`
        : ""
    }
    <div class="version-impact">
      <strong>${impact.members.length ? "将影响当前在线协作者" : "当前没有其他成员在线编辑"}</strong>
      <ul>
        ${impact.members.map((member) => `<li>${escapeHtml(member.name)} · ${escapeHtml(member.day)} · ${escapeHtml(member.activity)}</li>`).join("")}
        ${impact.extra ? `<li>还有 ${impact.extra} 位成员在线</li>` : ""}
        ${impact.members.length ? "" : "<li>恢复仍会写入共享计划，并同步给之后打开链接的成员。</li>"}
      </ul>
    </div>
    <div class="version-preview-actions">
      <button type="button" class="primary-btn" data-confirm-version-restore="${escapeHtml(entry.id)}">${icon("rotate-ccw")}确认恢复</button>
      <button type="button" class="text-btn" data-cancel-version-restore>${icon("x")}取消</button>
    </div>
  `;
}

async function restoreVersion(versionId) {
  if (!requireEdit("恢复历史版本")) return;
  const entry = versionHistory().find((item) => item.id === versionId);
  if (!entry?.data?.days?.length) return;
  if (!confirmRemotePlanReplace("恢复历史版本")) return;
  pendingVersionRestoreId = "";
  saveVersionSnapshot("恢复前版本");
  state = ensurePlanDates(clone(entry.data));
  activeDay = 0;
  activeStop = 0;
  const restoredPlanYjs = state.planYjs || "";
  const restoredFromYjs = restoredPlanYjs
    ? await replaceLivePlanDocWithYjsState(restoredPlanYjs, "已从历史版本恢复协作快照")
    : false;
  if (!restoredFromYjs) await replacePlanCollabDoc("local-version-restore", { allowReplace: true, reason: "version-restore" });
  const versionLabel = restoredVersionLabel(entry.reason || "历史版本", entry.at || "");
  await logActivity(`恢复历史版本：${versionLabel}`);
  await saveCollaborativePlanChange("已恢复历史版本");
  await broadcastPlanReplaced("恢复历史版本", {
    replacementType: "version-restore",
    restoredVersionReason: entry.reason || "历史版本",
    restoredVersionAt: entry.at || "",
    restoredVersionBy: entry.by || "",
  });
  render();
}

async function saveState(label = "已保存到本地") {
  if (!canEdit()) {
    dom.saveState.textContent = "只读模式未保存修改";
    return;
  }
  persistLocalState();
  dom.saveState.textContent = label;
  if (!isApplyingRemote && !isResolvingConflict && supabaseClient && tripId) {
    await pushRemoteState(label);
  }
}

function logActivity(text, options = {}) {
  const localActivity = normalizeActivities([{
    id: uid(),
    text,
    type: options.type || inferActivityType(text),
    target: options.target || null,
    at: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    createdAt: new Date().toISOString(),
    createdBy: getCollabName(),
  }])[0];
  if (!localActivity) return Promise.resolve(false);
  state.activities = normalizeActivities([localActivity, ...(state.activities || [])]).slice(0, 6);
  if (options.broadcast !== false && tripId && canEdit() && !isReadonlyMode) {
    return addCollaborativeActivity(localActivity).catch((error) => {
      console.warn("Collaborative activity failed", error);
      return false;
    });
  }
  return Promise.resolve(false);
}

function getCollabName() {
  const name = memberProfile?.name || dom.collabName.value.trim() || localStorage.getItem("tripboard-user-name") || "匿名成员";
  localStorage.setItem("tripboard-user-name", name);
  return name;
}

function collabActorId() {
  try {
    if (memberProfile?.id) return memberProfile.id;
  } catch {
    // Member profile can be in the temporal dead zone while the default plan is being built.
  }
  try {
    if (sessionId) return sessionId;
  } catch {
    // Session id is initialized after the default plan is loaded.
  }
  return localStorage.getItem("tripboard-user-name") || "local-user";
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
  const blockContext = currentFocusedBlockContext();
  const blockEditing = blockEditingLabel(blockContext);
  const dayBlockSelection = dayBlockSelectionForPresence(day);
  return {
    memberId: profile?.id || sessionId,
    name: profile?.name || "匿名成员",
    role: profile?.role || "同行成员",
    activeDay: day?.label || "D1",
    activeDayId: day?.id || "",
    activeStopId: stop?.id || "",
    activeCandidateId: editingCandidateId || "",
    activeTransportQuoteId: editingTransportQuoteId || "",
    activeBlockId: blockContext?.blockId || "",
    activeBlockText: blockContext?.blockText || "",
    blockSelection: blockContext?.blockSelection || null,
    selectedDayBlockIds: dayBlockSelection.ids,
    selectedDayBlockCount: dayBlockSelection.count,
    blockEditing,
    editing: blockEditing ? blockContext.blockText : stop?.title || "行程",
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
    .map((member, index) => `<span class="avatar a${(index % 4) + 1}" title="${escapeHtml(`${member.name || "匿名成员"} · ${member.role || "同行成员"} · ${memberActivityLabel(member)}`)}">${memberInitial(member.name)}</span>`)
    .join("") + (count ? `<span class="online-dot"></span>` : "");
  dom.memberList.innerHTML =
    members
      .map(
        (member, index) => {
          const textEditing = member.textEditing || (member.textSelection ? textSelectionLabel(member.textSelection) : "");
          const blockEditing = member.blockEditing ? `${member.blockEditing}：${member.activeBlockText || member.editing || "协作块"}` : "";
          const selectedBlocks = Number(member.selectedDayBlockCount || 0) > 0 ? `已选中 ${member.selectedDayBlockCount} 个协作块` : "";
          const recordEditing = member.activeCandidateId || member.activeTransportQuoteId ? memberActivityLabel(member) : "";
          const activeDetail = textEditing || blockEditing || selectedBlocks || recordEditing;
          const activity = activeDetail || memberActivityLabel(member);
          return `
          <div class="member-item ${activeDetail ? "is-text-editing" : ""}">
            <span class="avatar a${(index % 4) + 1}">${memberInitial(member.name)}</span>
            <p><strong>${escapeHtml(member.name || "匿名成员")}</strong><small>${escapeHtml(member.role || "同行成员")} · ${escapeHtml(member.activeDay || "在线")} · ${escapeHtml(activity)}</small></p>
            ${activeDetail ? `<em>${escapeHtml(member.editing || member.activeBlockText || selectedBlocks || recordEditing || "当前内容")}</em>` : ""}
          </div>
        `;
        },
      )
      .join("") || `<div class="member-empty">填写姓名后加入协作，在线成员会显示在这里。</div>`;
  renderTextPresence();
  refreshDayBlockTextPresence();
}

function renderEditAccessState() {
  if (!dom.editAccessStatus || !dom.editAccessBtn) return;
  if (!tripId) {
    dom.editAccessStatus.textContent = "创建共享计划后可设置编辑口令。";
    dom.editAccessBtn.innerHTML = `${icon("key-round")}设置口令`;
  } else if (state.editKeyHash && canEdit()) {
    dom.editAccessStatus.textContent = "已启用编辑口令；口令编辑链接需要输入口令，直入邀请会带密钥，请只发给可信成员。";
    dom.editAccessBtn.innerHTML = `${icon("key-round")}更新口令`;
  } else if (state.editKeyHash) {
    dom.editAccessStatus.textContent = state.editKeyHint ? `需要编辑口令，提示：${state.editKeyHint}` : "需要编辑口令才能修改计划。";
    dom.editAccessBtn.innerHTML = `${icon("unlock-keyhole")}解锁编辑`;
  } else {
    dom.editAccessStatus.textContent = "未设置编辑口令，编辑链接可直接修改；建议先设置口令再邀请成员。";
    dom.editAccessBtn.innerHTML = `${icon("key-round")}设置口令`;
  }
  refreshIcons();
}

function applyReadonlyUi() {
  document.body.classList.toggle("readonly-mode", isReadonlyMode);
  const writeControls = [
    dom.createSharedTripBtn,
    dom.partySizeInput,
    dom.budgetLimitInput,
    dom.addStopBtn,
    dom.addDayBtn,
    dom.moveDayUpBtn,
    dom.moveDayDownBtn,
    dom.deleteDayBtn,
    dom.addCandidateBtn,
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
    dom.newPlanBtn,
    dom.deletePlanBtn,
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
  dom.dayCommentForm?.querySelectorAll("input, button").forEach((control) => {
    control.disabled = isReadonlyMode;
  });
  dom.dayBlockForm?.querySelectorAll("input, select, button").forEach((control) => {
    control.disabled = isReadonlyMode;
  });
  dom.dayBlockList?.querySelectorAll("input, button").forEach((control) => {
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
  if (dom.editAccessInput) dom.editAccessInput.disabled = forcedReadonlyMode || !tripId;
  if (dom.editAccessBtn) dom.editAccessBtn.disabled = forcedReadonlyMode || !tripId;
  if (dom.copySharedLinkBtn) dom.copySharedLinkBtn.textContent = isReadonlyMode ? "复制当前只读链接" : state.editKeyHash ? "复制口令编辑链接" : "复制编辑链接";
  if (dom.copyInviteLinkBtn) {
    dom.copyInviteLinkBtn.hidden = !tripId || !state.editKeyHash || isReadonlyMode;
    dom.copyInviteLinkBtn.disabled = isReadonlyMode;
  }
  renderEditAccessState();
  if (pendingConflict) {
    dom.collabMode.textContent = "待处理冲突";
    dom.saveState.textContent = "发现协作冲突";
    return;
  }
  if (isReadonlyMode) {
    dom.collabMode.textContent = editAccessRequired ? "需口令编辑" : "只读查看";
    dom.saveState.textContent = editAccessRequired ? "需要编辑口令" : "只读模式";
    dom.presenceText.textContent = "你正在查看计划";
    dom.guideProgress.textContent = "只读";
  } else {
    dom.presenceText.textContent = "你正在编辑计划";
    dom.guideProgress.textContent = "可保存";
  }
}

function renderVersionHistory() {
  const history = versionHistory();
  if (pendingVersionRestoreId && !history.some((entry) => entry.id === pendingVersionRestoreId)) pendingVersionRestoreId = "";
  dom.versionCount.textContent = `${history.length} 条`;
  dom.versionList.innerHTML =
    history
      .map((entry) => {
        const date = new Date(entry.at);
        const time = Number.isNaN(date.getTime()) ? "刚刚" : date.toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
        return `
          <button class="version-item${pendingVersionRestoreId === entry.id ? " is-selected" : ""}" data-version="${entry.id}">
            <strong>${entry.reason || "历史版本"}</strong>
            <span>${time} · ${entry.by || "未知成员"}</span>
            <small class="version-diff">${escapeHtml(versionDiffSummary(entry.data, state))}</small>
          </button>
        `;
      })
      .join("") || `<div class="member-empty">开始编辑后会自动保存最近 ${MAX_VERSION_HISTORY} 个版本。</div>`;
  renderVersionPreview();
}

function renderCommentIndex() {
  if (!dom.commentIndexList || !dom.commentIndexCount || !dom.commentIndexFilters) return;
  const items = commentIndexItems();
  const counts = commentIndexCounts(items);
  if (!counts[commentIndexFilter] && commentIndexFilter !== "open") commentIndexFilter = "open";
  const visibleItems = items.filter((item) => commentIndexFilter === "all" || (commentIndexFilter === "open" ? !item.resolved : item.resolved));
  dom.commentIndexCount.textContent = `${counts.open} 未解决 / ${counts.all} 总计`;
  dom.commentIndexFilters.innerHTML = COMMENT_INDEX_FILTERS.map((filter) => `
    <button type="button" class="comment-filter${commentIndexFilter === filter.value ? " is-active" : ""}" data-comment-index-filter="${filter.value}">
      ${filter.label}<span>${counts[filter.value] || 0}</span>
    </button>
  `).join("");
  dom.commentIndexList.innerHTML = visibleItems
    .slice(0, 24)
    .map((item) => {
      const status = item.resolved ? "已解决" : "未解决";
      const anchorLabel = item.anchor ? commentAnchorLabel(item.anchor) : "";
      const replyText = item.replies ? ` · ${item.replies} 回复` : "";
      const meta = `${item.dayLabel} · ${item.scopeLabel}${anchorLabel ? ` · ${anchorLabel}` : ""}${replyText}`;
      return `
        <article class="comment-index-item${item.resolved ? " is-resolved" : ""}" data-comment-index-id="${escapeHtml(item.id)}" data-comment-index-scope="${escapeHtml(item.scope)}" role="button" tabindex="0">
          <span class="comment-index-status">${icon(item.resolved ? "check-circle-2" : "message-square-more")}${status}</span>
          <strong>${escapeHtml(item.targetLabel)}</strong>
          <p>${escapeHtml(item.text)}</p>
          <small>${escapeHtml(meta)}</small>
          ${canEdit() ? `<span class="comment-index-actions"><span class="comment-index-author">${escapeHtml(item.author || "我")}${item.at ? ` · ${escapeHtml(formatCommentTime(item.at))}` : ""}</span><button type="button" class="comment-action" data-comment-index-resolve="${escapeHtml(item.id)}">${item.resolved ? `${icon("rotate-ccw")}重新打开` : `${icon("check")}解决`}</button></span>` : ""}
          ${canEdit() ? `<form class="comment-index-reply-form" data-comment-index-reply="${escapeHtml(item.id)}"><input placeholder="回复这个批注" aria-label="回复批注" /><button type="submit" class="icon-btn subtle" aria-label="发送回复">${icon("send")}</button></form>` : ""}
        </article>
      `;
    })
    .join("") || `<div class="member-empty">${commentIndexFilter === "open" ? "当前没有未解决批注。" : "还没有批注记录。"}</div>`;
}

function refreshCommentIndexMutationViews(item = null) {
  renderCommentIndex();
  if (!item || typeof item !== "object") {
    refreshIcons();
    return false;
  }
  let refreshed = false;
  if (item.scope === "block" && item.dayId === currentDay()?.id && item.blockId) {
    refreshed = refreshDayBlockCommentsDom(currentDay(), item.blockId);
  } else if (item.scope === "day" && item.dayId === currentDay()?.id) {
    renderDayComments(currentDay());
    refreshed = true;
  } else if (item.scope === "stop" && item.stopId === currentStop()?.id) {
    renderStopComments(currentStop());
    refreshed = true;
  }
  refreshIcons();
  return refreshed;
}

async function toggleCommentIndexResolved(commentId = "") {
  const item = commentIndexItems().find((entry) => entry.id === commentId);
  if (!item || !requireEdit(item.resolved ? "重新打开批注" : "解决批注")) return false;
  const patch = resolvedCommentPatch(item.resolved);
  const actionText = item.resolved ? "重新打开" : "解决";
  const day = state.days[item.dayIndex] || state.days.find((entry) => entry.id === item.dayId);
  if (!day) return false;
  if (item.scope === "stop") {
    const stop = (day.stops || []).find((entry, index) => (item.stopId && entry.id === item.stopId) || index === item.stopIndex);
    if (!stop) return false;
    const wasCurrentStop = currentStop()?.id === stop.id;
    let updated = false;
    if (wasCurrentStop) updated = await updateCollaborativeComment(commentId, patch);
    stop.comments = commentsWithUpdatedComment(stop.comments || [], commentId, patch);
    await logActivity(`${actionText}批注「${stop.title || "地点"}」`, { target: { type: "comment", commentId, scope: "stop", stopId: stop.id || "" } });
    await syncStopSnapshotToPlanDoc(stop.id, updated ? "comment-index-stop-resolve-snapshot" : "comment-index-stop-resolve-fallback-snapshot");
    if (wasCurrentStop) await saveCollaborativeTextChange(`${actionText}批注「${stop.title || "地点"}」`);
    else await saveCollaborativePlanChange(`${actionText}批注「${stop.title || "地点"}」`);
  } else if (item.scope === "day") {
    const wasCurrentDay = currentDay()?.id === day.id;
    let updated = false;
    if (wasCurrentDay) updated = await updateCollaborativeDayComment(commentId, patch);
    day.comments = commentsWithUpdatedComment(day.comments || [], commentId, patch);
    await logActivity(`${actionText}当天批注「${day.title || day.label}」`, { target: { type: "comment", commentId, scope: "day", dayId: day.id || "" } });
    await patchDayMetaInDoc(day.id, { comments: day.comments }, updated ? "comment-index-day-resolve-snapshot" : "comment-index-day-resolve-fallback-snapshot");
    if (wasCurrentDay) await saveCollaborativeTextChange(`${actionText}当天批注「${day.title || day.label}」`);
    else await saveCollaborativePlanChange(`${actionText}当天批注「${day.title || day.label}」`);
  } else if (item.scope === "block") {
    const blocks = normalizeDayBlocks(day.blocks || []);
    const block = blocks.find((entry) => entry.id === item.blockId);
    if (!block) return false;
    const updated = await updateDayBlockCommentInDoc(day.id, block.id, commentId, patch, "comment-index-block-comment-resolve");
    day.blocks = normalizeDayBlocks(blocks.map((entry) => (
      entry.id === block.id
        ? { ...entry, comments: commentsWithUpdatedComment(entry.comments || [], commentId, patch), updatedBy: getCollabName(), updatedAt: new Date().toISOString() }
        : entry
    )));
    await logActivity(`${actionText}块级批注「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId, scope: "block", dayId: day.id || "", blockId: block.id || "" } });
    if (!updated) await syncDayBlocksToDoc(day.id, "comment-index-block-comment-resolve-fallback");
    await saveCollaborativePlanChange(`${actionText}块级批注`);
  }
  if (!refreshCommentIndexMutationViews(item)) render();
  dom.saveState.textContent = item.resolved ? "已重新打开批注" : "已标记批注解决";
  return true;
}

async function replyFromCommentIndex(commentId = "", text = "") {
  const item = commentIndexItems().find((entry) => entry.id === commentId);
  const replyText = String(text || "").trim();
  if (!item || !replyText || !requireEdit("回复批注")) return false;
  const day = state.days[item.dayIndex] || state.days.find((entry) => entry.id === item.dayId);
  if (!day) return false;
  if (item.scope === "stop") {
    const stop = (day.stops || []).find((entry, index) => (item.stopId && entry.id === item.stopId) || index === item.stopIndex);
    if (!stop) return false;
    const wasCurrentStop = currentStop()?.id === stop.id;
    let reply = false;
    if (wasCurrentStop) reply = await addCollaborativeCommentReply(item.id, replyText);
    const nextReply = reply || createCommentReply(item.id, replyText);
    stop.comments = normalizeComments([...(stop.comments || []), nextReply]);
    await logActivity(`回复批注「${stop.title || "地点"}」`, { target: { type: "comment", commentId: item.id, scope: "stop", stopId: stop.id || "" } });
    await syncStopSnapshotToPlanDoc(stop.id, reply ? "comment-index-stop-reply-snapshot" : "comment-index-stop-reply-fallback-snapshot");
    if (wasCurrentStop) await saveCollaborativeTextChange(`回复批注「${stop.title || "地点"}」`);
    else await saveCollaborativePlanChange(`回复批注「${stop.title || "地点"}」`);
  } else if (item.scope === "day") {
    const wasCurrentDay = currentDay()?.id === day.id;
    let reply = false;
    if (wasCurrentDay) reply = await addCollaborativeDayCommentReply(item.id, replyText);
    const nextReply = reply || createCommentReply(item.id, replyText);
    day.comments = normalizeComments([...(day.comments || []), nextReply]);
    await logActivity(`回复当天批注「${day.title || day.label}」`, { target: { type: "comment", commentId: item.id, scope: "day", dayId: day.id || "" } });
    await patchDayMetaInDoc(day.id, { comments: day.comments }, reply ? "comment-index-day-reply-snapshot" : "comment-index-day-reply-fallback-snapshot");
    if (wasCurrentDay) await saveCollaborativeTextChange(`回复当天批注「${day.title || day.label}」`);
    else await saveCollaborativePlanChange(`回复当天批注「${day.title || day.label}」`);
  } else if (item.scope === "block") {
    const blocks = normalizeDayBlocks(day.blocks || []);
    const block = blocks.find((entry) => entry.id === item.blockId);
    if (!block) return false;
    const reply = await addDayBlockCommentToDoc(day.id, block.id, replyText, item.id, "comment-index-block-comment-reply");
    const nextReply = reply || createCommentReply(item.id, replyText);
    day.blocks = normalizeDayBlocks(blocks.map((entry) => (
      entry.id === block.id
        ? { ...entry, comments: normalizeComments([...(entry.comments || []), nextReply]), updatedBy: getCollabName(), updatedAt: new Date().toISOString() }
        : entry
    )));
    await logActivity(`回复块级批注「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId: item.id, scope: "block", dayId: day.id || "", blockId: block.id || "" } });
    if (!reply) await syncDayBlocksToDoc(day.id, "comment-index-block-comment-reply-fallback");
    await saveCollaborativePlanChange("已回复块级批注");
  }
  if (!refreshCommentIndexMutationViews(item)) render();
  dom.saveState.textContent = "已回复批注";
  return true;
}

function focusCommentIndexItem(commentId = "") {
  const item = commentIndexItems().find((entry) => entry.id === commentId);
  if (!item) return false;
  const dayIndex = state.days.findIndex((day, index) => (item.dayId && day.id === item.dayId) || index === item.dayIndex);
  if (item.scope === "stop" && dayIndex === activeDay) {
    const day = currentDay();
    const stopIndex = (day?.stops || []).findIndex((stop, index) => (item.stopId && stop.id === item.stopId) || index === item.stopIndex);
    if (stopIndex >= 0 && stopIndex === activeStop) {
      commentFilter = item.resolved ? "resolved" : "open";
      renderStopComments(currentStop());
      let focused = false;
      if (item.anchor) focused = focusCommentAnchor(item.anchor);
      focused = focusCommentThread(item.id) || focused;
      renderCommentIndex();
      refreshIcons();
      dom.saveState.textContent = focused ? "已定位到批注" : "已切换到批注所在位置";
      return true;
    }
  }
  if (item.scope === "day" && dayIndex === activeDay) {
    activeStop = 0;
    dayCommentFilter = item.resolved ? "resolved" : "open";
    renderDayComments(currentDay());
    let focused = false;
    if (item.anchor) focused = focusCommentAnchor(item.anchor);
    focused = focusDayCommentThread(item.id) || focused;
    renderCommentIndex();
    refreshIcons();
    dom.saveState.textContent = focused ? "已定位到批注" : "已切换到批注所在位置";
    return true;
  }
  if (item.scope === "block" && dayIndex === activeDay && item.blockId) {
    activeStop = 0;
    blockCommentFilters[item.blockId] = item.resolved ? "resolved" : "open";
    activeBlockPresenceId = item.blockId || activeBlockPresenceId;
    if (!refreshDayBlockCommentsDom(currentDay(), item.blockId)) renderDayBlocks(currentDay());
    let focused = false;
    if (item.anchor) focused = focusCommentAnchor(item.anchor);
    const thread = Array.from(dom.dayBlockList?.querySelectorAll(`[data-block-comments="${CSS.escape(item.blockId || "")}"] [data-comment]`) || []).find((element) => element.dataset.comment === item.id);
    if (thread) {
      thread.scrollIntoView({ block: "nearest", behavior: "smooth" });
      thread.classList.add("is-focused");
      setTimeout(() => thread.classList.remove("is-focused"), 1300);
      focused = true;
    }
    renderCommentIndex();
    refreshIcons();
    dom.saveState.textContent = focused ? "已定位到批注" : "已切换到批注所在位置";
    return true;
  }
  if (dayIndex >= 0) activeDay = dayIndex;
  if (item.scope === "stop") {
    const day = currentDay();
    const stopIndex = (day?.stops || []).findIndex((stop, index) => (item.stopId && stop.id === item.stopId) || index === item.stopIndex);
    activeStop = stopIndex >= 0 ? stopIndex : 0;
    commentFilter = item.resolved ? "resolved" : "open";
  } else if (item.scope === "day") {
    activeStop = 0;
    dayCommentFilter = item.resolved ? "resolved" : "open";
  } else if (item.scope === "block") {
    activeStop = 0;
    if (item.blockId) blockCommentFilters[item.blockId] = item.resolved ? "resolved" : "open";
    activeBlockPresenceId = item.blockId || activeBlockPresenceId;
  }
  render();
  let focused = false;
  if (item.anchor) focused = focusCommentAnchor(item.anchor);
  if (item.scope === "stop") focused = focusCommentThread(item.id) || focused;
  if (item.scope === "day") focused = focusDayCommentThread(item.id) || focused;
  if (item.scope === "block") {
    const thread = Array.from(dom.dayBlockList?.querySelectorAll(`[data-block-comments="${CSS.escape(item.blockId || "")}"] [data-comment]`) || []).find((element) => element.dataset.comment === item.id);
    if (thread) {
      thread.scrollIntoView({ block: "nearest", behavior: "smooth" });
      thread.classList.add("is-focused");
      setTimeout(() => thread.classList.remove("is-focused"), 1300);
      focused = true;
    }
  }
  dom.saveState.textContent = focused ? "已定位到批注" : "已切换到批注所在位置";
  return true;
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
    if (!domKey) return;
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

function getShareUrl(options = {}) {
  if (!tripId) return "";
  const { includeEditKey = false } = options;
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  url.searchParams.delete("mode");
  const editKey = currentEditKeyValue();
  if (includeEditKey && state.editKeyHash && editKey) url.searchParams.set("editKey", editKey);
  else url.searchParams.delete("editKey");
  return url.toString();
}

function getInviteShareUrl() {
  return getShareUrl({ includeEditKey: true });
}

function getReadonlyShareUrl() {
  if (!tripId) return "";
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  url.searchParams.set("mode", "readonly");
  url.searchParams.delete("editKey");
  return url.toString();
}

function canEdit() {
  return !forcedReadonlyMode && !isReadonlyMode;
}

function requireEdit(actionLabel = "编辑") {
  if (canEdit()) return true;
  dom.saveState.textContent = editAccessRequired ? "需要编辑口令" : `只读模式不能${actionLabel}`;
  dom.collabStatus.textContent = editAccessRequired
    ? "当前计划已启用编辑口令。请输入口令解锁后才能修改行程。"
    : "当前是只读链接，可以查看计划和显示在线成员，但不能修改行程。";
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

async function pushRemoteState(label = "已同步云端", options = {}) {
  if (!supabaseClient || !tripId) return false;
  if (!canEdit()) {
    dom.collabStatus.textContent = editAccessRequired ? "需要编辑口令，不能向云端写入计划。" : "当前是只读链接，不能向云端写入计划。";
    return false;
  }
  if (pendingConflict) {
    showConflictPanel(pendingConflict);
    return false;
  }
  if (!options.skipPendingFlush && pendingPlanUpdates().length) {
    const flushed = await flushPendingPlanUpdates("保存前重放离线协作更新");
    if (flushed && !pendingPlanUpdates().length) return true;
    if (pendingConflict) {
      showConflictPanel(pendingConflict);
      return false;
    }
  }
  await refreshLiveCollabStateBeforeRemoteSave("保存云端前已刷新协作快照");
  await prepareStateForRemoteSave("保存云端前已清理图片与协作快照");
  const savingPendingIds = pendingPlanUpdateIds();
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
      if (remote?.error) return false;
      if (remote?.data?.days?.length) {
        const remotePlan = ensurePlanDates(clone(remote.data));
        if (samePlanContent(state, remotePlan)) {
          lastRemoteUpdatedAt = remote.updated_at || lastRemoteUpdatedAt;
          lastSyncedState = clone(remotePlan);
          dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "云端协作";
          dom.collabStatus.textContent = `${label}，共享链接可复制给其他成员。`;
          clearPendingPlanUpdatesById(savingPendingIds);
          return true;
        }
        if (remotePlan.planYjs && await mergePlanYjsStateIntoLiveDoc(remotePlan.planYjs, "保存前已合并云端协作快照", { scheduleSave: false })) {
          await refreshLiveCollabStateBeforeRemoteSave("重试保存前已刷新协作快照");
          payload.data = state;
          payload.updated_at = new Date().toISOString();
          pendingLocalRemoteUpdatedAt = payload.updated_at;
          const retryResult = await supabaseClient
            .from("trip_plans")
            .update(payload)
            .eq("id", tripId)
            .eq("updated_at", remote.updated_at || "")
            .select("data, updated_at, updated_by")
            .maybeSingle();
          error = retryResult.error;
          data = retryResult.data;
          if (!error && data) {
            lastRemoteUpdatedAt = data.updated_at || payload.updated_at;
            lastSyncedState = clone(state);
            clearPendingPlanUpdatesById(savingPendingIds);
            hideConflictPanel();
            dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "云端协作";
            dom.collabStatus.textContent = `${label}，已合并云端协作快照后同步。`;
            return true;
          }
        }
        showConflictPanel({
          remote: remotePlan,
          local: clone(state),
          base: clone(lastSyncedState || {}),
          updatedAt: remote.updated_at || "",
          updatedBy: remote.updated_by || "",
          reason: "save",
        });
        return false;
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
    const pendingCount = pendingPlanUpdates().length;
    dom.collabStatus.textContent = pendingCount
      ? `云端同步失败：${error.message}。已保留 ${pendingCount} 条本地协作更新，恢复连接后会重试。`
      : `云端同步失败：${error.message}`;
    return false;
  }
  lastRemoteUpdatedAt = data?.updated_at || payload.updated_at;
  lastSyncedState = clone(state);
  clearPendingPlanUpdatesById(savingPendingIds);
  hideConflictPanel();
  dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "云端协作";
  dom.collabStatus.textContent = `${label}，共享链接可复制给其他成员。`;
  return true;
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
    await applyRemotePlan(data.data, { updatedAt: data.updated_at || "" });
    dom.saveState.textContent = `已载入共享计划`;
    persistLocalState(state, { id: sharedLocalPlanId(), label: state.name || "共享计划", tripId });
    freshPendingPlanUpdatesForRemote();
    dom.collabStatus.textContent = isReadonlyMode
      ? data.updated_by
        ? `只读查看，最近由 ${data.updated_by} 更新`
        : "只读查看，已连接共享计划"
      : data.updated_by
        ? `最近由 ${data.updated_by} 更新`
        : `已连接共享计划`;
    render();
    await flushPendingPlanUpdates("载入共享计划后重放离线协作更新");
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
        handleRemotePlanUpdate(next).catch((error) => {
          dom.collabStatus.textContent = `处理远端更新失败：${error.message}`;
        });
      },
    )
    .on("broadcast", { event: "stop-text-yjs-update" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteTextUpdate(payload);
    })
    .on("broadcast", { event: "day-text-yjs-update" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayTextUpdate(payload);
    })
    .on("broadcast", { event: "plan-yjs-update" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemotePlanYjsUpdate(payload);
    })
    .on("broadcast", { event: "stop-text-selection-update" }, ({ payload }) => {
      if (!payload || payload.memberId === (memberProfile?.id || sessionId)) return;
      if (payload.roomId !== currentTextRoomId(payload.stopId)) return;
      upsertOnlineMember(payload);
      refreshTextSelectionPresenceViews();
    })
    .on("broadcast", { event: "stop-created" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopCreated(payload).catch((error) => {
        dom.collabStatus.textContent = `应用新增地点协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "stop-deleted" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopDeleted(payload).catch((error) => {
        dom.collabStatus.textContent = `应用删除地点协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "stops-reordered" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteStopsReordered(payload).catch((error) => {
        dom.collabStatus.textContent = `应用地点排序协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "day-updated" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayUpdated(payload).catch((error) => {
        dom.collabStatus.textContent = `应用当天设置协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "day-created" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayCreated(payload).catch((error) => {
        dom.collabStatus.textContent = `应用新增日期协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "day-deleted" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDayDeleted(payload).catch((error) => {
        dom.collabStatus.textContent = `应用删除日期协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "days-reordered" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemoteDaysReordered(payload).catch((error) => {
        dom.collabStatus.textContent = `应用日期排序协作快照失败：${error.message}`;
      });
    })
    .on("broadcast", { event: "plan-replaced" }, ({ payload }) => {
      if (payload?.memberId === (memberProfile?.id || sessionId)) return;
      applyRemotePlanReplaced(payload).catch((error) => {
        dom.collabStatus.textContent = `应用整份计划协作快照失败：${error.message}`;
      });
    })
    .on("presence", { event: "sync" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      refreshPresenceViews();
    })
    .on("presence", { event: "join" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      refreshPresenceViews();
    })
    .on("presence", { event: "leave" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      refreshPresenceViews();
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        dom.collabMode.textContent = isReadonlyMode ? "只读查看" : "实时同步";
        bindCollabTextDoc();
        bindCollabDayTextDoc();
        flushPendingPlanUpdates("实时通道恢复后重放离线协作更新").catch((error) => {
          dom.collabStatus.textContent = `重放离线协作更新失败：${error.message}`;
        });
        trackPresence();
      }
    });
}

async function connectSharedTrip(id) {
  tripId = id;
  lastRemoteUpdatedAt = "";
  lastSyncedState = null;
  collapsedDayBlockIds = loadCollapsedDayBlocks();
  destroyCollabPlanDoc();
  hideConflictPanel();
  localStorage.setItem("tripboard-current-trip-id", tripId);
  setCurrentLocalPlanId(sharedLocalPlanId());
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
  collapsedDayBlockIds = loadCollapsedDayBlocks();
  destroyCollabPlanDoc();
  hideConflictPanel();
  localStorage.setItem("tripboard-current-trip-id", tripId);
  setCurrentLocalPlanId(sharedLocalPlanId());
  editAccessGranted = true;
  editAccessRequired = Boolean(state.editKeyHash);
  isReadonlyMode = false;
  await pushRemoteState("已创建共享计划");
  persistLocalState(state, { id: sharedLocalPlanId(), label: state.name || "共享计划", tripId });
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

function stabilizeActiveStopForDetailImage() {
  const day = currentDay();
  const stops = Array.isArray(day?.stops) ? day.stops : [];
  if (!stops.length) return;
  activeStop = Math.max(0, Math.min(activeStop, stops.length - 1));
  if (userSelectedStop) return;
  const stop = stops[activeStop];
  if (hasVerifiedPlaceImage(stop)) return;
  const preferred = preferredDetailStop(day);
  const preferredIndex = preferred ? stops.findIndex((item) => item.id === preferred.id) : -1;
  if (preferredIndex >= 0 && preferredIndex !== activeStop && hasVerifiedPlaceImage(preferred)) activeStop = preferredIndex;
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
  const previousAmapJsKey = serviceConfig.amapJsKey || "";
  const previousAmapSecurityCode = serviceConfig.amapSecurityCode || "";
  serviceConfig = {
    aiEndpoint: dom.aiRouteEndpointInput.value.trim(),
    aiToken: dom.aiRouteTokenInput.value.trim(),
    amapEndpoint: dom.amapEndpointInput.value.trim(),
    amapRouteEndpoint: dom.amapRouteEndpointInput.value.trim(),
    amapJsKey: dom.amapJsKeyInput.value.trim(),
    amapSecurityCode: dom.amapSecurityCodeInput.value.trim(),
    weatherEndpoint: dom.weatherEndpointInput.value.trim(),
    placeImageEndpoint: dom.placeImageEndpointInput?.value.trim() || "",
  };
  serviceClient.saveServiceConfig(serviceConfig);
  const amapSdkConfigChanged =
    previousAmapJsKey !== serviceConfig.amapJsKey ||
    previousAmapSecurityCode !== serviceConfig.amapSecurityCode;
  if (amapSdkConfigChanged && amapMap) {
    clearAmapOverlay();
    amapMap.destroy();
    amapMap = null;
  }
  if (amapSdkConfigChanged) {
    amapLoadedKey = "";
    amapLoaderPromise = null;
  }
  renderServiceStatus();
  renderMap();
}

function serviceHeaders(token, endpoint = "") {
  return serviceClient.headers(token, endpoint);
}

function renderServiceStatus() {
  const connected = [
    serviceConfig.aiEndpoint && "AI",
    serviceConfig.amapEndpoint && "高德地点",
    serviceConfig.amapRouteEndpoint && "高德路线",
    serviceConfig.amapJsKey && "高德地图",
    serviceConfig.weatherEndpoint && "天气代理",
    serviceConfig.placeImageEndpoint && "实景图",
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
  return serviceApi.weather.geocode(query);
}

async function requestWeatherForecast() {
  const payload = {
    destination: state.destination,
    startDate: state.startDate,
    endDate: state.endDate,
    days: state.days.map((day) => ({ id: day.id, date: day.date, title: day.title })),
  };
  let proxyError = "";
  if (serviceConfig.weatherEndpoint) {
    try {
      const data = await serviceApi.weather.proxyForecast(serviceConfig.weatherEndpoint, payload);
      const days = Array.isArray(data.days) ? data.days : [];
      if (days.length) return { source: data.source || "weather-proxy", days };
      proxyError = data.message || "天气代理没有返回可用日期";
    } catch (error) {
      proxyError = error.message;
    }
  }

  const place = await geocodeDestination();
  if (!place) throw new Error("没有找到目的地坐标，请尝试填写更具体的城市名，或配置自己的天气代理。");
  const data = await serviceApi.weather.forecast(place, { forecastDays: 16 });
  const days = (data.daily?.time || []).map((date, index) => ({
    date,
    text: `${Math.round(data.daily.temperature_2m_min?.[index] ?? 0)}-${Math.round(data.daily.temperature_2m_max?.[index] ?? 0)}°C ${weatherLabel(data.daily.weather_code?.[index])} · 降水${Math.round(data.daily.precipitation_probability_max?.[index] ?? 0)}%`,
  }));
  const proxyHint = proxyError ? `（天气代理兜底：${proxyError}）` : "";
  return { source: `Open-Meteo · ${place.name}${proxyHint}`, days };
}

async function requestWeatherForDateRange(startDateValue, endDateValue) {
  const place = await geocodeDestination();
  if (!place) throw new Error("没有找到目的地坐标，请尝试填写更具体的城市名。");
  const start = parseIsoDate(startDateValue);
  const end = parseIsoDate(endDateValue);
  if (!start || !end) throw new Error("请先填写可出行日期范围。");
  const forecastDays = Math.min(16, Math.max(1, Math.round((end - new Date()) / 86400000) + 2));
  const data = await serviceApi.weather.forecast(place, { forecastDays });
  const days = (data.daily?.time || []).map((date, index) => ({
    date,
    code: Number(data.daily.weather_code?.[index] ?? 0),
    precipitation: Math.round(data.daily.precipitation_probability_max?.[index] ?? 0),
    tempMin: Math.round(data.daily.temperature_2m_min?.[index] ?? 0),
    tempMax: Math.round(data.daily.temperature_2m_max?.[index] ?? 0),
    text: `${Math.round(data.daily.temperature_2m_min?.[index] ?? 0)}-${Math.round(data.daily.temperature_2m_max?.[index] ?? 0)}°C ${weatherLabel(data.daily.weather_code?.[index])} · 降水${Math.round(data.daily.precipitation_probability_max?.[index] ?? 0)}%`,
  }));
  return { source: `Open-Meteo · ${place.name}`, days };
}

function weatherForDay(forecastDays, day, index) {
  const datedForecasts = forecastDays.filter((item) => item.date);
  if (day.date && datedForecasts.length) {
    return datedForecasts.find((item) => item.date === day.date) || null;
  }
  return forecastDays[index] || null;
}

function weatherScore(day = null) {
  if (!day) return 58;
  const precipitation = Number(day.precipitation ?? String(day.text || "").match(/降水(\d+)%/)?.[1] ?? 35);
  const code = Number(day.code ?? 0);
  const tempMax = Number(day.tempMax ?? String(day.text || "").match(/-(\d+)°C/)?.[1] ?? 24);
  let score = 100 - Math.min(70, precipitation * 0.75);
  if ([61, 63, 65, 80, 81, 82, 95].includes(code)) score -= 18;
  if ([71, 73, 75].includes(code)) score -= 12;
  if (tempMax >= 32) score -= (tempMax - 31) * 4;
  if (tempMax <= 5) score -= (6 - tempMax) * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function dateScoutRange() {
  const defaults = defaultScoutDates();
  const startValue = dom.dateScoutStart?.value || defaults.startDate;
  let endValue = dom.dateScoutEnd?.value || defaults.endDate;
  const start = parseIsoDate(startValue) || parseIsoDate(defaults.startDate);
  let end = parseIsoDate(endValue) || parseIsoDate(defaults.endDate);
  if (end < start) {
    end = addDays(start, 14);
    endValue = formatIsoDate(end);
    if (dom.dateScoutEnd) dom.dateScoutEnd.value = endValue;
  }
  return { start, end, startDate: formatIsoDate(start), endDate: formatIsoDate(end) };
}

function dateScoutDayCount() {
  return clampDays(dom.dateScoutDays?.value || guideDayCount() || 3);
}

function enumerateDateScoutWindows() {
  const { start, end } = dateScoutRange();
  const days = dateScoutDayCount();
  const windows = [];
  for (let cursor = new Date(start); addDays(cursor, days - 1) <= end && windows.length < 36; cursor = addDays(cursor, 1)) {
    const startDate = formatIsoDate(cursor);
    const endDate = formatIsoDate(addDays(cursor, days - 1));
    windows.push({
      id: `${startDate}:${endDate}`,
      startDate,
      endDate,
      days,
    });
  }
  return windows;
}

function weatherSummaryForWindow(forecastDays = [], option = {}) {
  const byDate = new Map((forecastDays || []).map((day) => [day.date, day]));
  const scores = [];
  const summaries = [];
  for (let index = 0; index < option.days; index += 1) {
    const date = formatIsoDate(addDays(parseIsoDate(option.startDate), index));
    const day = byDate.get(date) || null;
    scores.push(weatherScore(day));
    if (day?.text) summaries.push(`${formatDisplayDate(date)} ${day.text}`);
  }
  return {
    score: scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 58,
    text: summaries.slice(0, 2).join("；") || "天气超出免费预报范围，先按季节估算",
    coveredDays: summaries.length,
  };
}

function localScoutTransport(option = {}) {
  const fakeDay = { date: option.startDate, route: `抵达${guideState.destination || state.destination || "目的地"}` };
  const options = buildTransportOptions(fakeDay, 0).filter((item) => item.type === "flight");
  const sorted = options.sort((a, b) => Number(a.price) - Number(b.price));
  const best = sorted[0] || null;
  return {
    price: best ? Number(best.price) : 0,
    code: best?.code || "待查询",
    depart: best?.depart || "",
    arrive: best?.arrive || "",
    duration: best?.duration || 0,
    source: "本地估算",
    confidence: "estimate",
  };
}

function dateScoutScore(option = {}) {
  const priority = dom.dateScoutPriority?.value || "balanced";
  const weatherPart = Number(option.weatherScore || 0);
  const price = Number(option.flight?.price || option.estimatedFlight?.price || 0);
  const pricePart = price ? Math.max(0, 100 - Math.round(price / 18)) : 50;
  const weekendPenalty = [0, 6].includes(parseIsoDate(option.startDate)?.getDay()) ? 4 : 0;
  const weights = {
    weather: [0.72, 0.28],
    price: [0.32, 0.68],
    balanced: [0.52, 0.48],
  }[priority] || [0.52, 0.48];
  return Math.max(0, Math.round(weatherPart * weights[0] + pricePart * weights[1] - weekendPenalty));
}

async function fetchDateScoutFlight(option = {}) {
  if (!ctripConfig.endpoint) return null;
  const payload = {
    tripId,
    date: option.startDate,
    from: guideState.origin || state.origin || "",
    to: guideState.destination || state.destination || "",
    type: "flight",
    startTime: "",
    endTime: "",
  };
  const data = await fetchTransportQuotes(payload);
  const route = { from: payload.from, to: payload.to };
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
  const items = rawItems.map((item, index) => normalizeTransportItem(item, index, route)).filter((item) => item.type === "flight");
  const best = bestFlightOption(items);
  if (!best) return null;
  return {
    price: Number(best.price || 0),
    code: best.code || "航班",
    depart: best.depart || "",
    arrive: best.arrive || "",
    duration: best.duration || 0,
    source: data.source || best.source || "Google Flights",
    confidence: data.source === "demo" || /示例/.test(best.source || "") ? "demo" : "live",
  };
}

async function syncWeather() {
  if (!requireEdit("同步天气")) return;
  saveVersionSnapshot("同步天气前版本");
  dom.serviceStatusText.textContent = "正在同步天气...";
  try {
    const forecast = await requestWeatherForecast();
    let applied = 0;
    const weatherPatches = [];
    state.days.forEach((day, index) => {
      const match = weatherForDay(forecast.days, day, index);
      if (!match) return;
      const weather = match.text || match.weather || match.summary || day.weather;
      weatherPatches.push({ id: day.id, weather });
      applied += 1;
    });
    if (applied && !confirmRemoteDayEdit(weatherPatches.map((patch) => patch.id), "同步天气")) return;
    weatherPatches.forEach((patch) => {
      const day = state.days.find((item) => item.id === patch.id);
      if (day) day.weather = patch.weather;
    });
    logActivity(`同步天气 ${applied} 天`);
    if (applied) {
      await Promise.all(weatherPatches.map((patch) => patchDayMetaInDoc(patch.id, { weather: patch.weather }, "local-weather-sync-patch")));
      await syncPlanMetaToDoc("local-weather-sync-meta");
    }
    await saveCollaborativePlanChange("已同步天气");
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
    selected: Boolean(item.selected),
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

function transportQuoteIdFromItem(item, day, source = "external") {
  return [
    "quote",
    day?.id || day?.date || "day",
    source || "provider",
    item.type || "flight",
    item.code || "",
    item.from || "",
    item.to || "",
    item.depart || "",
    item.arrive || "",
    item.price || "",
  ]
    .map((part) => encodeURIComponent(String(part).trim().toLowerCase()))
    .join("-");
}

function transportQuoteFromProviderItem(item, day, source = "") {
  const normalizedSource = source || item.source || "Google Flights";
  return normalizeTransportQuotes([{
    ...item,
    id: transportQuoteIdFromItem(item, day, normalizedSource),
    dayId: day?.id || "",
    date: day?.date || "",
    source: normalizedSource,
    createdBy: getCollabName(),
    createdAt: new Date().toISOString(),
  }])[0];
}

function transportOptionIdentity(item) {
  return `${item.type || ""}:${item.code || ""}:${item.from || ""}:${item.to || ""}:${item.depart || ""}:${item.arrive || ""}`;
}

function setManualQuoteEditing(quote = null) {
  editingTransportQuoteId = quote?.id || "";
  if (quote) {
    dom.manualQuoteType.value = quote.type || "flight";
    dom.manualQuoteCode.value = quote.code || "";
    dom.manualQuoteDepart.value = quote.depart && quote.depart !== "--:--" ? quote.depart : "";
    dom.manualQuoteArrive.value = quote.arrive && quote.arrive !== "--:--" ? quote.arrive : "";
    dom.manualQuotePrice.value = quote.price || "";
    dom.transportFrom.value = quote.from || dom.transportFrom.value;
    dom.transportTo.value = quote.to || dom.transportTo.value;
  }
  if (dom.manualQuoteSubmitBtn) {
    dom.manualQuoteSubmitBtn.innerHTML = `${icon(quote ? "save" : "plus")}<span>${quote ? "更新报价" : "保存报价"}</span>`;
  }
  if (dom.cancelQuoteEditBtn) dom.cancelQuoteEditBtn.hidden = !quote;
  refreshIcons();
  schedulePresenceTrack(0);
}

function clearManualQuoteForm() {
  editingTransportQuoteId = "";
  dom.manualQuoteCode.value = "";
  dom.manualQuoteDepart.value = "";
  dom.manualQuoteArrive.value = "";
  dom.manualQuotePrice.value = "";
  setManualQuoteEditing(null);
}

function quoteDraftFromManualForm(existing = {}) {
  const day = currentDay();
  const route = defaultTransportRoute(day);
  return {
    ...existing,
    id: existing.id || uid(),
    dayId: existing.dayId || day.id,
    date: existing.date || day.date || "",
    type: dom.manualQuoteType.value,
    code: dom.manualQuoteCode.value.trim(),
    from: dom.transportFrom.value.trim() || route.from,
    to: dom.transportTo.value.trim() || route.to,
    depart: dom.manualQuoteDepart.value || "--:--",
    arrive: dom.manualQuoteArrive.value || "--:--",
    duration: durationFromTimes(dom.manualQuoteDepart.value, dom.manualQuoteArrive.value),
    price: numberValue(dom.manualQuotePrice.value),
    source: existing.source || "手动保存",
  };
}

function manualQuotePatchFromForm() {
  const route = defaultTransportRoute(currentDay());
  return {
    type: dom.manualQuoteType.value,
    code: dom.manualQuoteCode.value.trim(),
    from: dom.transportFrom.value.trim() || route.from,
    to: dom.transportTo.value.trim() || route.to,
    depart: dom.manualQuoteDepart.value || "--:--",
    arrive: dom.manualQuoteArrive.value || "--:--",
    duration: durationFromTimes(dom.manualQuoteDepart.value, dom.manualQuoteArrive.value),
    price: numberValue(dom.manualQuotePrice.value),
  };
}

function setCandidateEditing(candidate = null) {
  editingCandidateId = candidate?.id || "";
  if (candidate) {
    dom.quickPlaceName.value = candidate.title || "";
    if (dom.quickType) dom.quickType.value = quickTypeValue(candidate.type);
    dom.quickAmapKeyword.value = candidate.amapKeyword || `${state.destination || ""} ${candidate.title || ""}`.trim();
    dom.quickTime.value = candidate.time || "";
    dom.quickBudget.value = candidate.budget || "";
    if (dom.quickPaid) dom.quickPaid.value = candidate.paid || "";
    if (dom.quickPayer) dom.quickPayer.value = candidate.payer || "";
    dom.quickAddress.value = candidate.address || "";
    if (dom.quickSelected) dom.quickSelected.checked = Boolean(candidate.selected);
    quickAmapPlace = candidate.lng || candidate.lat ? {
      keyword: candidate.amapKeyword || "",
      title: candidate.title || "",
      address: candidate.address || "",
      lng: candidate.lng || "",
      lat: candidate.lat || "",
      image: candidate.image || "",
    } : null;
  }
  if (dom.addCandidateBtn) {
    dom.addCandidateBtn.innerHTML = `${icon(candidate ? "save" : "bookmark-plus")}<span>${candidate ? "更新备选" : "加入备选池"}</span>`;
  }
  if (dom.cancelCandidateEditBtn) dom.cancelCandidateEditBtn.hidden = !candidate;
  refreshIcons();
  schedulePresenceTrack(0);
}

function hideAmapCandidates(target = "both") {
  const targets = target === "both" ? ["quick", "field"] : [target];
  targets.forEach((scope) => {
    const container = scope === "quick" ? dom.quickAmapCandidates : dom.fieldAmapCandidates;
    if (!container) return;
    container.hidden = true;
    container.innerHTML = "";
  });
}

function placeCoordinateText(place) {
  return place?.lng && place?.lat ? `${place.lng}, ${place.lat}` : "坐标待确认";
}

function renderAmapCandidates(target, places = [], keyword = "") {
  const container = target === "field" ? dom.fieldAmapCandidates : dom.quickAmapCandidates;
  if (!container) return;
  if (!places.length) {
    container.hidden = false;
    container.innerHTML = `<p>高德没有返回候选地点，可以换一个关键词或直接打开高德搜索。</p>`;
    return;
  }
  container.hidden = false;
  container.innerHTML = `
    <div class="amap-place-results-head">
      <strong>高德候选地点</strong>
      <span>${escapeHtml(keyword)}</span>
    </div>
    <div class="amap-place-list">
      ${places
        .map(
          (place, index) => `
            <button type="button" class="amap-place-option" data-amap-target="${target}" data-amap-place-index="${index}">
              <strong>${escapeHtml(place.title || "候选地点")}</strong>
              <span>${escapeHtml(place.address || place.city || "地址待确认")}</span>
              <small>${escapeHtml([place.type, placeCoordinateText(place)].filter(Boolean).join(" · "))}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
  container._amapPlaces = places;
  refreshIcons();
}

function applyQuickAmapPlace(place, keyword = "") {
  if (!place) return;
  quickAmapPlace = { ...place, keyword };
  if (place.title && !dom.quickPlaceName.value.trim()) dom.quickPlaceName.value = place.title;
  if (keyword && !dom.quickAmapKeyword.value.trim()) dom.quickAmapKeyword.value = keyword;
  if (place.address) dom.quickAddress.value = place.address;
  dom.optimizeHint.textContent = place.lng && place.lat
    ? `已选择高德候选：${place.title || keyword}（${placeCoordinateText(place)}）。加入当天或备选池时会带入坐标。`
    : `已选择高德候选：${place.title || keyword}，但没有坐标。`;
}

async function applyFieldAmapPlace(place, keyword = "") {
  if (!place) return;
  const changedFields = [];
  if (place.title && !dom.fieldTitle.value.trim()) changedFields.push("title");
  if (place.address && dom.fieldAddress.value !== place.address) changedFields.push("address");
  if (place.lng && dom.fieldLng.value !== String(place.lng)) changedFields.push("struct:lng");
  if (place.lat && dom.fieldLat.value !== String(place.lat)) changedFields.push("struct:lat");
  if (place.image && !dom.fieldImage.value.trim()) changedFields.push("struct:image");
  if (keyword && !dom.fieldAmapKeyword.value.trim()) changedFields.push("amapKeyword");
  const stop = currentStop();
  if (stop && changedFields.length) {
    if (!confirmRemoteStopEdit(stop.id, "选择高德候选")) return;
    if (!confirmRemoteTextFieldEdit(changedFields, "stop", "选择高德候选")) return;
  }
  if (place.title && !dom.fieldTitle.value.trim()) dom.fieldTitle.value = place.title;
  if (place.address) dom.fieldAddress.value = place.address;
  if (place.lng) dom.fieldLng.value = place.lng;
  if (place.lat) dom.fieldLat.value = place.lat;
  if (place.image && !dom.fieldImage.value.trim()) dom.fieldImage.value = place.image;
  if (keyword && !dom.fieldAmapKeyword.value.trim()) dom.fieldAmapKeyword.value = keyword;
  await Promise.all([
    syncCollabTextFieldToDoc("title", dom.fieldTitle.value),
    syncCollabTextFieldToDoc("address", dom.fieldAddress.value),
    syncCollabTextFieldToDoc("amapKeyword", dom.fieldAmapKeyword.value),
    syncCollabStructValuesToDoc({ lng: dom.fieldLng.value, lat: dom.fieldLat.value, image: dom.fieldImage.value.trim() }, "local-amap-place-select"),
  ]);
  dom.saveState.textContent = place.lng && place.lat ? `已选择高德候选：${place.title || keyword}` : `已选择高德候选，但坐标待确认：${place.title || keyword}`;
}

function clearQuickPlaceForm({ keepCandidateEditing = false } = {}) {
  if (!keepCandidateEditing) editingCandidateId = "";
  dom.quickPlaceName.value = "";
  if (dom.quickType) dom.quickType.value = "Scenic";
  dom.quickAmapKeyword.value = "";
  dom.quickTime.value = "";
  dom.quickBudget.value = "";
  if (dom.quickPaid) dom.quickPaid.value = "";
  if (dom.quickPayer) dom.quickPayer.value = "";
  dom.quickAddress.value = "";
  if (dom.quickSelected) dom.quickSelected.checked = false;
  quickAmapPlace = null;
  hideAmapCandidates("quick");
  if (!keepCandidateEditing) setCandidateEditing(null);
}

function destinationName() {
  return String(state.destination || guideState.destination || state.name || "目的地").trim() || "目的地";
}

function serviceRecommendationTemplates(kind = "") {
  const destination = destinationName();
  if (kind === "lodging") {
    return [
      { title: `${destination}市中心住宿`, time: "15:00", budget: 520, tags: ["住宿", "交通便利", "待比价"], note: "优先查地铁/车站附近，适合作为多人集合和行李寄存点。" },
      { title: `${destination}景区附近酒店`, time: "15:00", budget: 680, tags: ["住宿", "近景点", "待比价"], note: "适合早出发或夜游，确认取消政策、早餐和停车/打车便利度。" },
      { title: `${destination}特色民宿`, time: "15:00", budget: 430, tags: ["民宿", "体验", "待确认"], note: "适合体验型住宿，导入真实订单后补充房型、入住人、押金和联系方式。" },
    ];
  }
  return [
    { title: `${destination}当地特色餐厅`, time: "18:30", budget: 180, tags: ["餐饮", "特色菜", "待预约"], note: "适合作为正餐候选，可粘贴大众点评/美团链接或团购信息后确认。" },
    { title: `${destination}小吃/夜市`, time: "20:00", budget: 90, tags: ["小吃", "夜市", "可选"], note: "适合弹性安排，注意营业时间、排队情况和返程交通。" },
    { title: `${destination}咖啡/休息点`, time: "14:30", budget: 55, tags: ["咖啡", "休息", "备选"], note: "用于行程间歇、集合等人或雨天备选。" },
  ];
}

function serviceRecommendationId(kind = "", template = {}) {
  return [
    "service",
    kind,
    destinationName(),
    template.title || "",
  ]
    .map((part) => encodeURIComponent(String(part).trim().toLowerCase()))
    .join("-");
}

function existingCandidateKeys() {
  return new Set((state.candidates || []).map((item) => `${quickTypeValue(item.type)}:${String(item.title || "").trim()}:${String(item.address || item.amapKeyword || "").trim()}`));
}

async function addServiceRecommendations(kind = "") {
  const label = serviceKindLabel(kind);
  if (!requireEdit(`推荐${label}`)) return;
  const existing = existingCandidateKeys();
  const destination = destinationName();
  const drafts = serviceRecommendationTemplates(kind)
    .map((template, index) => makeStop({
      id: serviceRecommendationId(kind, template),
      time: template.time,
      title: template.title,
      type: serviceKindType(kind),
      address: destination,
      note: template.note,
      tags: ["推荐", ...template.tags],
      budget: template.budget,
      amapKeyword: `${destination} ${template.title}`,
      image: serviceKindImage(kind),
      selected: false,
      x: 64 + index * 5,
      y: 42 + index * 4,
    }))
    .filter((draft) => !existing.has(`${quickTypeValue(draft.type)}:${draft.title}:${draft.address || draft.amapKeyword || ""}`))
    .slice(0, 3);
  if (!drafts.length) {
    dom.saveState.textContent = `${label}推荐已在备选池里，可以直接预选或加入当天。`;
    return;
  }
  saveVersionSnapshot(`推荐${label}`);
  await bindCollabPlanDoc();
  let added = 0;
  if (collabPlanDoc && collabCandidatesArray && canEdit() && !isReadonlyMode && !isApplyingCollabPlanRemote) {
    const current = readCandidatesFromDoc();
    const currentIds = new Set(current.map((item) => item.id));
    const additions = normalizeCandidateStops(drafts.filter((draft) => !currentIds.has(draft.id)));
    if (additions.length) {
      collabPlanDoc.transact(() => {
        collabCandidatesArray.insert(0, additions);
      }, `local-service-${kind}-recommendations`);
      persistCurrentPlanFromDoc("住宿餐饮推荐已实时同步");
      added = additions.length;
    }
  }
  if (!added) {
    state.candidates = normalizeCandidateStops([...drafts, ...(state.candidates || [])]).slice(0, 80);
    await syncCandidatesToDoc(`local-service-${kind}-recommendations-fallback`);
    added = drafts.length;
  }
  await logActivity(`生成${label}推荐 ${added} 项`, { target: candidateActivityTarget(drafts[0]?.id || "", { action: "service-recommend", serviceKind: kind }) });
  await saveCollaborativePlanChange(`生成${label}推荐`);
  dom.saveState.textContent = `已生成 ${added} 个${label}候选，可预选、编辑或加入当天。`;
  refreshRealtimePlanViews();
}

function prefillServiceQuickAdd(kind = "") {
  const label = serviceKindLabel(kind);
  if (!requireEdit(`添加${label}`)) return;
  const destination = destinationName();
  clearQuickPlaceForm();
  if (dom.quickType) dom.quickType.value = serviceKindType(kind);
  dom.quickPlaceName.value = kind === "lodging" ? `${destination}住宿` : `${destination}餐厅`;
  dom.quickAmapKeyword.value = kind === "lodging" ? `${destination} 酒店 民宿` : `${destination} 特色餐厅 美食`;
  dom.quickTime.value = kind === "lodging" ? "15:00" : "18:30";
  dom.quickBudget.value = kind === "lodging" ? "520" : "180";
  dom.quickSelected.checked = true;
  dom.quickAddress.value = destination;
  dom.quickPlaceName.focus();
  dom.quickAddForm.scrollIntoView({ block: "center", behavior: "smooth" });
  dom.optimizeHint.textContent = `已切到${label}录入。可先改名称、预算，再加入当天或备选池。`;
}

function openExternalImport(provider = "") {
  if (!requireEdit("导入外部记录")) return;
  pendingProvider = normalizeImportProvider(provider || "分享/截图");
  const defaults = providerDefaults(pendingProvider);
  lastParsedImport = null;
  if (dom.importProvider) dom.importProvider.value = pendingProvider;
  dom.importTitle.textContent = `下单后导入：${pendingProvider}`;
  dom.importCopy.textContent = externalImportConfig.endpoint
    ? "下单完成后复制订单详情、分享链接、短信或邮件，粘贴到这里解析；不会读取你的账号。"
    : "这里不连接或读取 App 账号，只把你粘贴的订单或分享内容写入计划。";
  dom.importCategory.value = defaults.category;
  if (dom.importTarget) dom.importTarget.value = defaults.category === "餐饮" || defaults.category === "住宿" ? "candidate" : "day";
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
  refreshImportTargetUi();
  dom.importModal.classList.add("is-open");
  dom.importModal.setAttribute("aria-hidden", "false");
  refreshIcons();
}

async function saveProviderTransportQuotes(items = [], day = currentDay(), source = "") {
  const incoming = items
    .map((item) => transportQuoteFromProviderItem(item, day, source))
    .filter(Boolean);
  if (!incoming.length) return 0;
  await bindCollabPlanDoc();
  const existing = readTransportQuotesFromDoc();
  const existingIds = new Set(existing.map((item) => item.id));
  const existingKeys = new Set(existing.map(transportOptionIdentity));
  const additions = incoming.filter((quote) => !existingIds.has(quote.id) && !existingKeys.has(transportOptionIdentity(quote)));
  if (!additions.length) return 0;
  if (await addCollaborativeTransportQuotes(additions, "local-provider-transport-quotes-batch")) {
    persistCurrentPlanFromDoc("交通报价协作内容已实时同步");
    return additions.length;
  }
  state.transportQuotes = normalizeTransportQuotes([...additions, ...existing]).slice(0, 80);
  await syncTransportQuotesToDoc("local-provider-transport-quotes-fallback");
  return additions.length;
}

async function toggleTransportQuoteSelection(quoteId) {
  const day = currentDay();
  const quote = (state.transportQuotes || []).find((item) => item.id === quoteId);
  if (!requireEdit("选择交通方案")) return;
  if (!quote) {
    const route = defaultTransportRoute(day);
    const option = [...transportProviderItems, ...buildTransportOptions(day, activeDay)].find((item) => item.id === quoteId);
    const draft = normalizeTransportQuotes([{
      ...(option || {}),
      id: option?.id || quoteId || uid(),
      dayId: day?.id || "",
      date: day?.date || "",
      from: option?.from || route.from,
      to: option?.to || route.to,
      selected: true,
      source: option?.source || "本地参考",
      createdBy: getCollabName(),
      createdAt: new Date().toISOString(),
    }])[0];
    if (!draft) return;
    if (await addCollaborativeTransportQuote(draft)) {
      persistCurrentPlanFromDoc("交通方案选择已同步");
      await logActivity(`选择交通 ${draft.code}`, { target: transportQuoteActivityTarget(draft.id, draft.dayId || "", { action: "select" }) });
      await saveCollaborativePlanChange("更新交通预选");
      refreshRealtimePlanViews();
      return;
    }
    mutate(`选择交通 ${draft.code}`, () => {
      state.transportQuotes = mergedTransportQuotesWithPatch("add", draft);
    }, { requireUnlocked: false, save: false, activityTarget: transportQuoteActivityTarget(draft.id, draft.dayId || "", { action: "select" }) });
    await syncTransportQuotesToDoc("local-transport-selection-add-fallback");
    await saveCollaborativePlanChange("更新交通预选");
    return;
  }
  const selected = !quote.selected;
  if (!confirmRemoteTransportQuoteEdit(quoteId, selected ? "选择交通方案" : "取消交通方案")) return;
  if (await updateTransportQuoteInDoc(quoteId, { selected })) {
    persistCurrentPlanFromDoc("交通方案选择已同步");
    await logActivity(`${selected ? "选择" : "取消"}交通 ${quote.code}`, { target: transportQuoteActivityTarget(quoteId, quote.dayId || "", { action: selected ? "select" : "unselect" }) });
    await saveCollaborativePlanChange("更新交通预选");
    refreshRealtimePlanViews();
    return;
  }
  mutate(`${selected ? "选择" : "取消"}交通 ${quote.code}`, () => {
    state.transportQuotes = mergedTransportQuotesWithPatch("update", { selected }, quoteId);
  }, { requireUnlocked: false, save: false, activityTarget: transportQuoteActivityTarget(quoteId, quote.dayId || "", { action: selected ? "select" : "unselect" }) });
  await syncTransportQuotesToDoc("local-transport-selection-fallback");
  await saveCollaborativePlanChange("更新交通预选");
}

async function toggleCandidateSelection(candidateId) {
  const candidate = (state.candidates || []).find((item) => item.id === candidateId);
  if (!candidate || !requireEdit("选择备选地点")) return;
  const selected = !candidate.selected;
  if (!confirmRemoteCandidateEdit(candidateId, selected ? "预选备选地点" : "取消预选备选地点")) return;
  if (await updateCandidateInDoc(candidateId, { selected })) {
    persistCurrentPlanFromDoc("备选预选已同步");
    await logActivity(`${selected ? "预选" : "取消预选"}${candidate.title}`, { target: candidateActivityTarget(candidateId, { action: selected ? "select" : "unselect" }) });
    await saveCollaborativePlanChange("更新备选预选");
    refreshRealtimePlanViews();
    return;
  }
  mutate(`${selected ? "预选" : "取消预选"}${candidate.title}`, () => {
    state.candidates = mergedCandidatesWithPatch("update", { selected }, candidateId);
  }, { requireUnlocked: false, save: false, activityTarget: candidateActivityTarget(candidateId, { action: selected ? "select" : "unselect" }) });
  await syncCandidatesToDoc("local-candidate-selection-fallback");
  await saveCollaborativePlanChange("更新备选预选");
}

async function addCandidateToCurrentDay(candidateId = "", sourceLabel = "备选") {
  const sourceCandidate = (state.candidates || []).find((item) => item.id === candidateId);
  if (!sourceCandidate || !requireEdit("加入备选地点")) return;
  const candidate = clone(sourceCandidate);
  candidate.id = uid();
  const createdDayId = currentDay()?.id || "";
  const label = `加入${sourceLabel}「${candidate.title}」`;
  saveVersionSnapshot(label);
  if (createdDayId && await addStopToDoc(createdDayId, candidate, "local-candidate-to-stop-yjs-first")) {
    await logActivity(label, { target: stopActivityTarget(createdDayId, candidate.id || "", { action: "candidate-add" }) });
    await applyStopCreateFromDoc(createdDayId, candidate.id, label);
    const syncedDay = currentDay();
    const insertedIndex = (syncedDay?.stops || []).findIndex((stop) => stop.id === candidate.id);
    if (insertedIndex >= 0) activeStop = insertedIndex;
    await saveCollaborativePlanChange(label);
    broadcastStopCreated(createdDayId, candidate);
    render();
    return;
  }
  const day = currentDay();
  if (!day) return;
  day.stops.push(candidate);
  activeStop = currentDay().stops.length - 1;
  clearCurrentAmapRoute();
  await logActivity(label, { target: stopActivityTarget(createdDayId, candidate.id || "", { action: "candidate-add", fallback: true }) });
  await syncStopListToDoc(createdDayId, "local-candidate-to-stop-fallback");
  await saveCollaborativePlanChange(label);
  broadcastStopCreated(createdDayId, candidate);
  render();
}

function manualTransportQuotes() {
  return state.transportQuotes || [];
}

function currentManualQuotes(day) {
  return manualTransportQuotes().filter((item) => item.dayId === day?.id || item.date === day?.date);
}

function quickTypeValue(type = "") {
  const text = String(type || "").trim();
  if (/hotel|住宿|民宿|酒店|客栈|入住|房/i.test(text)) return "Hotel";
  if (/food|餐饮|餐厅|咖啡|午餐|晚餐|早餐|美食|团购|Cafe|Dinner|Lunch|Market/i.test(text)) return "Food";
  if (/transport|交通|航班|机票|动车|高铁|火车|Transit|车站|机场/i.test(text)) return "Transport";
  if (/other|其他/i.test(text)) return "Other";
  return "Scenic";
}

function quickTypeLabel(type = "") {
  return {
    Scenic: "景点/门票",
    Hotel: "住宿",
    Food: "餐饮",
    Transport: "交通",
    Other: "其他",
  }[quickTypeValue(type)] || "景点/门票";
}

function serviceKindFromItem(item = {}) {
  const type = quickTypeValue(item.type);
  if (type === "Hotel") return "lodging";
  if (type === "Food") return "dining";
  const text = budgetTextForItem(item);
  if (/hotel|住宿|民宿|酒店|客栈|入住|离店|房型/.test(text)) return "lodging";
  if (/food|餐饮|餐厅|咖啡|午餐|晚餐|早餐|美食|团购|夜市|小吃|排队|到店|套餐|Dinner|Lunch|Market/i.test(text)) return "dining";
  return "";
}

function serviceKindLabel(kind = "") {
  return kind === "lodging" ? "住宿" : "餐饮";
}

function serviceKindType(kind = "") {
  return kind === "lodging" ? "Hotel" : "Food";
}

function serviceKindProvider(kind = "") {
  return kind === "lodging" ? "民宿/酒店" : "美团/点评";
}

function serviceKindIcon(kind = "") {
  return kind === "lodging" ? "bed-double" : "utensils";
}

function serviceKindImage(kind = "") {
  return kind === "lodging" ? providerDefaults("住宿").image : images.food;
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
    住宿: { title: "住宿入住", time: "15:00", image: images.lodging },
    餐饮: { title: "餐厅预约", time: "18:30", image: images.food },
    交通: { title: "交通订单", time: "09:00", image: images.train },
    景点: { title: "景点预约", time: "10:00", image: images.museum },
    其他: { title: "外部记录", time: "10:00", image: images.city },
  };
  return { category, ...defaults[category] };
}

function normalizeImportProvider(provider = "") {
  if (/美团|点评/.test(provider)) return "美团/点评";
  if (/民宿|酒店|住宿/.test(provider)) return "民宿/酒店";
  if (/分享|截图|短信|邮件/.test(provider)) return "分享/截图";
  return "其他";
}

function dayIndexByDate(dateValue) {
  if (!dateValue) return activeDay;
  const index = state.days.findIndex((day) => day.date === dateValue);
  return index >= 0 ? index : activeDay;
}

function importTargetLabel(target = dom.importTarget?.value || "day") {
  return target === "candidate" ? "备选池/预算组合" : "当天行程";
}

function importDateOptionsText(dateValue, target = dom.importTarget?.value || "day") {
  if (target === "candidate") return "备选池/预算组合";
  const exactIndex = dateValue ? state.days.findIndex((day) => day.date === dateValue) : -1;
  const index = exactIndex >= 0 ? exactIndex : activeDay;
  const day = state.days[index];
  const label = day?.date ? `${day.label} · ${formatDisplayDate(day.date)}` : currentDay()?.label || "当前天";
  return dateValue && exactIndex < 0 ? `未匹配计划日期，将导入 ${label}` : label;
}

function refreshImportTargetUi() {
  if (!dom.importSubmitBtn) return;
  const target = dom.importTarget?.value || "day";
  dom.importSubmitBtn.innerHTML = `${icon(target === "candidate" ? "bookmark-plus" : "file-plus-2")}导入到${target === "candidate" ? "备选池" : "当天"}`;
  if (dom.importDate) dom.importDate.disabled = target === "candidate";
  renderImportPreview(lastParsedImport?.parsed || null);
  refreshIcons();
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
      <div><dt>导入位置</dt><dd>${escapeHtml(importTargetLabel())}</dd></div>
      <div><dt>导入到</dt><dd>${escapeHtml(importDateOptionsText(parsed.date || dom.importDate.value, dom.importTarget?.value))}</dd></div>
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
  const data = await serviceApi.externalImport.parse(
    externalImportConfig,
    {
      provider: pendingProvider,
      destination: state.destination || "",
      tripStartDate: state.startDate || "",
      tripEndDate: state.endDate || "",
      text,
    },
    { timeoutMs: EXTERNAL_IMPORT_TIMEOUT_MS },
  );
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
  const savedQuoteKeys = new Set(manualQuotes.map(transportOptionIdentity));
  const providerOptions = transportProviderItems.filter((item) => !savedQuoteKeys.has(transportOptionIdentity(item)));
  const generatedOptions = buildTransportOptions(day, activeDay).filter((item) => !savedQuoteKeys.has(transportOptionIdentity(item)));
  const baseOptions = transportProviderItems.length ? providerOptions : generatedOptions;
  const options = [...manualQuotes, ...baseOptions];
  const filtered = options.filter(matchesTransportFilter);
  const visible = transportFilterApplied ? filtered : filtered.slice(0, 4);
  const manualQuoteIds = new Set(manualQuotes.map((item) => item.id));
  if (!dom.transportFrom.value) dom.transportFrom.value = route.from;
  if (!dom.transportTo.value) dom.transportTo.value = route.to;
  const links = officialTransportLinks(route, day);
  dom.openCtripSearchLink.href = links.ctrip;
  dom.openTripSearchLink.href = links.trip;
  dom.openRailSearchLink.href = links.rail;

  dom.flightAvgPrice.textContent = money(averagePrice(options, "flight"));
  dom.trainAvgPrice.textContent = money(averagePrice(options, "train"));
  const isDemoProxy = transportProviderSource === "demo" || transportProviderItems.some((item) => /示例/.test(item.source || ""));
  dom.transportProviderStatus.textContent = manualQuotes.length
    ? tripId && collabPlanDoc
      ? "协作报价"
      : "手动报价"
    : transportProviderItems.length
    ? isDemoProxy
      ? "代理示例"
      : "真实接口"
    : "本地示例";
  dom.transportDayHint.textContent = `${day?.date ? formatDisplayDate(day.date) : day?.label} · ${route.from} 到 ${route.to}，${
    manualQuotes.length
      ? `已保存 ${manualQuotes.length} 条手动报价；也可以继续打开官方页面查询。`
      : transportProviderItems.length
      ? isDemoProxy
        ? "后端已连通，但当前仍是代理示例数据。"
        : "当前显示后端真实接口返回的报价。"
      : "当前为本地生成的可筛选示例报价。"
  }`;
  if (editingTransportQuoteId && !manualQuoteIds.has(editingTransportQuoteId)) {
    setManualQuoteEditing(null);
  }
  dom.transportList.innerHTML =
    visible
      .map(
        (item) => {
          const selected = Boolean(item.selected);
          const remoteEditors = remoteRecordEditorNames("transportQuote", item.id);
          return `
          <article class="transport-item ${item.id === editingTransportQuoteId ? "is-editing" : ""}${selected ? " is-selected" : ""}${remoteEditors ? " is-remote-editing" : ""}" data-quote="${escapeHtml(item.id || "")}">
            <span class="transport-icon">${icon(item.type === "flight" ? "plane" : "train-front")}</span>
            <div>
              <strong>${escapeHtml(item.code)} · ${escapeHtml(item.from)} → ${escapeHtml(item.to)}</strong>
              <span>${escapeHtml(item.depart)} - ${escapeHtml(item.arrive)} · 约${Math.floor(item.duration / 60)}小时${item.duration % 60}分 · ${escapeHtml(item.source)}</span>
              ${remoteEditors ? `<small class="record-presence">${escapeHtml(remoteEditors)} 正在编辑这条报价</small>` : ""}
            </div>
            <em>${money(item.price)}</em>
            <span class="transport-actions">
              <button type="button" class="icon-btn subtle" data-toggle-quote-selected="${escapeHtml(item.id)}" aria-label="${selected ? "移出预算组合" : "纳入预算组合"}" title="${selected ? "移出预算组合" : "纳入预算组合"}">${icon(selected ? "check-circle-2" : "circle")}</button>
              ${manualQuoteIds.has(item.id) ? `
              <button type="button" class="icon-btn subtle" data-edit-quote="${escapeHtml(item.id)}" aria-label="编辑报价">${icon("pencil")}</button>
              <button type="button" class="icon-btn subtle danger-icon" data-delete-quote="${escapeHtml(item.id)}" aria-label="删除报价">${icon("trash-2")}</button>
              ` : ""}
            </span>
          </article>
        `;
        },
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
  serviceClient.saveTransportConfig(ctripConfig);
  dom.syncBadge.textContent = ctripConfig.endpoint ? "已配置接口" : "可手动导入";
}

function ctripHeaders() {
  return serviceClient.headers(ctripConfig.token, ctripConfig.endpoint);
}

async function fetchTransportQuotes(payload) {
  return serviceApi.transport.quotes(ctripConfig, payload);
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
  const day = currentDay();
  const route = defaultTransportRoute(day);
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.data) ? data.data : [];
  if (!rawItems.length) {
    transportProviderItems = [];
    setCtripStatus(data.message || "Google Flights 已响应，但没有返回匹配航班。请检查日期、城市/机场三字码和时间段。", "alert-circle");
    renderTransport();
    return;
  }
  transportProviderItems = rawItems.map((item, index) => normalizeTransportItem(item, index, route));
  transportProviderSource = data.source || "";
  const savedCount = await saveProviderTransportQuotes(transportProviderItems, day, transportProviderSource || "Google Flights");
  transportFilterApplied = true;
  const isDemoProxy = transportProviderSource === "demo" || transportProviderItems.some((item) => /示例/.test(item.source || ""));
  setCtripStatus(isDemoProxy ? `后端代理已连通，返回 ${transportProviderItems.length} 条示例交通数据，并保存 ${savedCount} 条到协作报价。` : `已同步 ${transportProviderItems.length} 条 Google Flights 航班报价，并保存 ${savedCount} 条到共享计划。`, isDemoProxy ? "info" : "check-circle-2");
  dom.syncBadge.textContent = isDemoProxy ? "代理示例" : "Google Flights";
  logActivity(`同步 Google Flights 航班报价 ${transportProviderItems.length} 条，保存 ${savedCount} 条`, { target: transportQuoteActivityTarget("", day.id || "", { action: "provider-sync" }) });
  await saveCollaborativePlanChange("已同步 Google Flights 报价");
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
  try {
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
    const bestQuotes = multiOriginComparisons
      .filter((item) => item.best)
      .map((item) => ({
        ...item.best,
        source: `${item.source || "Google Flights"} · ${item.name}`,
      }));
    const savedCount = await saveProviderTransportQuotes(bestQuotes, day, "Google Flights 多出发地");
    renderMultiOriginResults();
    renderTransport();
    refreshIcons();
    const matched = results.filter((item) => item.best).length;
    const total = results.reduce((sum, item) => sum + Number(item.best?.price || 0), 0);
    logActivity(`比较多人出发地航班 ${matched}/${results.length} 人，保存 ${savedCount} 条推荐报价`, { target: transportQuoteActivityTarget("", day.id || "", { action: "multi-origin-sync" }) });
    await saveCollaborativePlanChange("已保存多人出发地航班比较");
    setCtripStatus(`已完成多人出发地比较：${matched}/${results.length} 人匹配到航班，最低合计 ${money(total)}；已保存 ${savedCount} 条推荐报价到共享计划。`, matched ? "check-circle-2" : "alert-circle");
  } catch (error) {
    setCtripStatus(`多人出发地比较保存失败：${error.message}。已保留当前页面结果，可稍后重试。`, "alert-triangle");
  } finally {
    dom.compareOriginsBtn.disabled = false;
  }
}

async function scoutTripDates() {
  if (!dom.dateScoutSearchBtn) return;
  guideState.destination = dom.destinationInput.value.trim() || guideState.destination || "目的地";
  guideState.origin = dom.originInput.value.trim() || guideState.origin || "出发城市";
  state.destination = guideState.destination;
  state.origin = guideState.origin;
  const windows = enumerateDateScoutWindows();
  if (!windows.length) {
    dom.dateScoutStatus.textContent = "可出行范围太短";
    dom.dateScoutResults.innerHTML = `<p class="empty-state">请扩大可出行范围，或缩短旅行天数。</p>`;
    return;
  }
  dom.dateScoutSearchBtn.disabled = true;
  dom.dateScoutStatus.textContent = "正在评估天气和交通...";
  dom.dateScoutResults.innerHTML = `<p class="empty-state">正在筛选 ${windows.length} 个候选时间段。</p>`;
  let forecast = { source: "", days: [] };
  try {
    forecast = await requestWeatherForDateRange(dateScoutRange().startDate, dateScoutRange().endDate);
  } catch (error) {
    forecast = { source: `天气暂不可用：${error.message}`, days: [] };
  }
  try {
    let options = windows.map((window) => {
      const weather = weatherSummaryForWindow(forecast.days, window);
      const estimatedFlight = localScoutTransport(window);
      return {
        ...window,
        weatherScore: weather.score,
        weatherText: weather.text,
        weatherSource: forecast.source || "天气估算",
        estimatedFlight,
        flight: estimatedFlight,
      };
    });
    options = options
      .map((option) => ({ ...option, score: dateScoutScore(option) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    saveCtripConfig();
    if (ctripConfig.endpoint) {
      dom.dateScoutStatus.textContent = `正在查询前 ${Math.min(3, options.length)} 个候选日期的航班...`;
      for (let index = 0; index < Math.min(3, options.length); index += 1) {
        try {
          const flight = await fetchDateScoutFlight(options[index]);
          if (flight?.price) options[index] = { ...options[index], flight };
        } catch (error) {
          options[index] = {
            ...options[index],
            flight: {
              ...options[index].estimatedFlight,
              source: `接口失败，已用估算：${error.message}`,
              confidence: "estimate",
            },
          };
        }
      }
      options = options
        .map((option) => ({ ...option, score: dateScoutScore(option) }))
        .sort((a, b) => b.score - a.score);
    }
    dateScoutOptions = options;
    selectedDateScoutId = "";
    renderDateScoutResults();
  } finally {
    dom.dateScoutSearchBtn.disabled = false;
    refreshIcons();
  }
}

function selectedBudgetStops() {
  return (state.days || []).flatMap((day) =>
    (day.stops || [])
      .filter((stop) => stop.budgetSelected !== false)
      .map((stop) => ({ day, stop })),
  );
}

function excludedBudgetStops() {
  return (state.days || []).flatMap((day) =>
    (day.stops || [])
      .filter((stop) => stop.budgetSelected === false)
      .map((stop) => ({ day, stop })),
  );
}

function totalBudget() {
  return selectedBudgetStops().reduce((sum, { stop }) => sum + numberValue(stop.budget), 0);
}

function totalPaid() {
  return selectedBudgetStops().reduce((sum, { stop }) => sum + numberValue(stop.paid), 0);
}

function totalPlannedBudget() {
  return Math.max(totalBudget(), budgetComboSummary().total);
}

function totalPlannedPaid() {
  return Math.max(totalPaid(), budgetComboSummary().paid);
}

function partySize() {
  return Math.max(1, Number.parseInt(dom.partySizeInput.value || state.partySize || 1, 10) || 1);
}

function payerBudget() {
  const groups = {};
  selectedBudgetStops().forEach(({ stop }) => {
    const paid = numberValue(stop.paid);
    if (!paid) return;
    const payer = String(stop.payer || "未指定").trim() || "未指定";
    groups[payer] = (groups[payer] || 0) + paid;
  });
  (state.candidates || []).forEach((candidate) => {
    if (!candidate.selected) return;
    const paid = numberValue(candidate.paid);
    if (!paid) return;
    const payer = String(candidate.payer || "未指定").trim() || "未指定";
    groups[payer] = (groups[payer] || 0) + paid;
  });
  return groups;
}

function settlementSuggestions() {
  const total = totalPlannedBudget();
  const people = partySize();
  const perPerson = people ? Math.round(total / people) : 0;
  const paidBy = payerBudget();
  const participantNames = new Set(
    [
      memberProfile?.name,
      ...onlineMembers.map((member) => member.name),
      ...Object.keys(paidBy),
    ]
      .map((name) => String(name || "").trim())
      .filter(Boolean),
  );
  while (participantNames.size < people) {
    participantNames.add(`成员${participantNames.size + 1}`);
  }
  const balances = [...participantNames].map((name) => ({
    name,
    balance: numberValue(paidBy[name]) - perPerson,
  }));
  const debtors = balances.filter((item) => item.balance < -1).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter((item) => item.balance > 1).sort((a, b) => b.balance - a.balance);
  const transfers = [];
  let debtorIndex = 0;
  let creditorIndex = 0;
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(-debtor.balance, creditor.balance);
    if (amount > 1) transfers.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
    debtor.balance += amount;
    creditor.balance -= amount;
    if (debtor.balance >= -1) debtorIndex += 1;
    if (creditor.balance <= 1) creditorIndex += 1;
  }
  return {
    perPerson,
    transfers,
    missingPayer: numberValue(paidBy["未指定"]),
  };
}

function budgetTextForItem(item = {}) {
  return `${item.title || ""} ${item.type || ""} ${(item.tags || []).join(" ")} ${item.note || ""}`;
}

function budgetCategoryForItem(item = {}) {
  const normalizedType = quickTypeValue(item.type);
  if (normalizedType === "Hotel") return "住宿";
  if (normalizedType === "Transport") return "交通";
  if (normalizedType === "Food") return "餐饮";
  const text = budgetTextForItem(item);
  if (/hotel|住宿|民宿|酒店|客栈|入住|房/.test(text)) return "住宿";
  if (/flight|train|Transit|机票|航班|动车|高铁|火车|交通|打车|机场|车站/.test(text)) return "交通";
  if (/餐|饭|Cafe|Dinner|Lunch|Market|美食|午餐|晚餐|早餐|咖啡/.test(text)) return "餐饮";
  return "景点";
}

function inferTicketPrice(item = {}) {
  if (numberValue(item.budget)) return 0;
  const text = budgetTextForItem(item);
  if (/免费|免票|开放式|街区|公园免费/.test(text)) return 0;
  const rules = [
    [/莫高窟|石窟|Grottoes/i, 238],
    [/七彩丹霞|丹霞|雅丹|平山湖|Geopark|地质公园/i, 120],
    [/嘉峪关|关城|悬壁长城|长城|阳关|玉门关|Heritage|Fortress/i, 110],
    [/沙漠|鸣沙山|月牙泉|Desert/i, 110],
    [/博物馆|黄河铁桥|中山桥|夜市|步行街|Museum|Walk/i, 0],
    [/马蹄寺|寺|Temple|塔|宫|园|景区|门票|预约|Scenic/i, 80],
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  return matched ? matched[1] : 0;
}

function transportBudgetLabel(item = {}) {
  const type = item.type === "train" ? "动车/高铁" : "机票";
  return `${type} ${item.code || ""}`.trim();
}

function transportQuoteLabel(quoteId = "") {
  const quote = (state.transportQuotes || []).find((item) => item.id === quoteId);
  if (!quote) return "交通报价";
  return transportBudgetLabel(quote) || quote.code || "交通报价";
}

function candidateLabel(candidateId = "") {
  const candidate = (state.candidates || []).find((item) => item.id === candidateId);
  return candidate?.title || "备选地点";
}

function budgetComboItems() {
  const confirmedStops = selectedBudgetStops().map(({ day, stop }) => {
    const estimate = inferTicketPrice(stop);
    return {
      id: `stop-${day.id || day.label}-${stop.id || stop.title}`,
      refType: "stop",
      dayId: day.id || "",
      itemId: stop.id || "",
      label: stop.title || "地点",
      category: budgetCategoryForItem(stop),
      amount: numberValue(stop.budget) || estimate,
      paid: numberValue(stop.paid),
      source: "行程",
      estimated: !numberValue(stop.budget) && estimate > 0,
    };
  });
  const selectedQuotes = (state.transportQuotes || [])
    .filter((quote) => quote.selected)
    .map((quote) => ({
      id: `quote-${quote.id}`,
      refType: "quote",
      itemId: quote.id || "",
      label: transportBudgetLabel(quote),
      category: "交通",
      amount: numberValue(quote.price),
      paid: 0,
      source: "已选交通",
      estimated: false,
    }));
  const selectedCandidates = (state.candidates || [])
    .filter((candidate) => candidate.selected)
    .map((candidate) => {
      const estimate = inferTicketPrice(candidate);
      return {
        id: `candidate-${candidate.id}`,
        refType: "candidate",
        itemId: candidate.id || "",
        label: candidate.title || "备选地点",
        category: budgetCategoryForItem(candidate),
        amount: numberValue(candidate.budget) || estimate,
        paid: numberValue(candidate.paid),
        source: "预选",
        estimated: !numberValue(candidate.budget) && estimate > 0,
      };
    });
  return [...confirmedStops, ...selectedQuotes, ...selectedCandidates].filter((item) => item.amount || item.paid);
}

function budgetComboSummary() {
  const items = budgetComboItems();
  const total = items.reduce((sum, item) => sum + numberValue(item.amount), 0);
  const paid = items.reduce((sum, item) => sum + numberValue(item.paid), 0);
  const byCategory = items.reduce((groups, item) => {
    groups[item.category] = (groups[item.category] || 0) + numberValue(item.amount);
    return groups;
  }, {});
  const estimates = items.filter((item) => item.estimated);
  return { items, total, paid, unpaid: Math.max(0, total - paid), byCategory, estimates, excludedStops: excludedBudgetStops() };
}

function renderBudgetCombo() {
  const summary = budgetComboSummary();
  const people = partySize();
  const selectedTransportCount = (state.transportQuotes || []).filter((quote) => quote.selected).length;
  const selectedCandidateCount = (state.candidates || []).filter((candidate) => candidate.selected).length;
  const categoryRows = Object.entries(summary.byCategory)
    .map(([key, value]) => `<span>${escapeHtml(key)} ${money(value)}</span>`)
    .join("");
  const estimateRows = summary.estimates
    .slice(0, 4)
    .map((item) => `
      <span>
        <b>${escapeHtml(item.label)} 门票待确认 ${money(item.amount)}</b>
        ${canEdit() ? `<button type="button" class="mini-action" data-apply-budget-estimate="${escapeHtml(item.refType)}:${escapeHtml(item.dayId || "")}:${escapeHtml(item.itemId || "")}">采用</button>` : ""}
      </span>
    `)
    .join("");
  const itemRows = summary.items
    .slice(0, 8)
    .map((item) => `
      <span class="budget-combo-row">
        <b>${escapeHtml(item.source)} · ${escapeHtml(item.category)} · ${escapeHtml(item.label)} ${money(item.amount)}${item.estimated ? " 估" : ""}</b>
        ${item.refType === "stop" && canEdit() ? `<button type="button" class="mini-action" data-toggle-stop-budget="${escapeHtml(item.dayId)}:${escapeHtml(item.itemId)}:0">移出</button>` : ""}
      </span>
    `)
    .join("");
  const extraCount = Math.max(0, summary.items.length - 8);
  const excludedRows = summary.excludedStops
    .slice(0, 6)
    .map(({ day, stop }) => `
      <span class="budget-combo-row is-excluded">
        <b>${escapeHtml(day.label || day.title || "行程")} · ${escapeHtml(stop.title || "地点")} 已移出组合</b>
        ${canEdit() ? `<button type="button" class="mini-action" data-toggle-stop-budget="${escapeHtml(day.id || "")}:${escapeHtml(stop.id || "")}:1">纳入</button>` : ""}
      </span>
    `)
    .join("");
  return `
    <strong>预选组合</strong>
    <span>组合总额 ${money(summary.total)} · 人均 ${money(Math.round(summary.total / people))}</span>
    <span>已付 ${money(summary.paid)} · 待付 ${money(summary.unpaid)}</span>
    <span>已选交通 ${selectedTransportCount} 项 · 预选备选 ${selectedCandidateCount} 项 · 已排除行程 ${summary.excludedStops.length} 项</span>
    <div class="budget-combo-categories">${categoryRows || "<span>暂无可汇总项目</span>"}</div>
    <div class="budget-combo-items">${itemRows || "<span>勾选交通或备选地点后显示组合明细</span>"}${extraCount ? `<span>还有 ${extraCount} 项已纳入组合</span>` : ""}</div>
    ${excludedRows ? `<div class="budget-combo-items is-excluded-list">${excludedRows}</div>` : ""}
    ${estimateRows ? `<div class="budget-ticket-hints">${estimateRows}</div>` : "<div class=\"budget-ticket-hints\"><span><b>当前没有待采用的门票估算</b></span></div>"}
  `;
}

async function toggleStopBudgetSelection(token = "") {
  const [dayId, stopId, selectedValue] = String(token || "").split(":");
  const selected = selectedValue !== "0";
  if (!dayId || !stopId || !requireEdit(selected ? "纳入预算组合" : "移出预算组合")) return;
  const day = state.days.find((item) => item.id === dayId);
  const stop = day?.stops?.find((item) => item.id === stopId);
  if (!day || !stop) {
    dom.saveState.textContent = "没有找到这个预算项目，可能已被其他成员移动或删除。";
    return;
  }
  if (!confirmRemoteStopEdit(stop.id, selected ? "纳入预算组合" : "移出预算组合")) return;
  const patch = { budgetSelected: selected };
  stop.budgetSelected = selected;
  if (!(await patchStopInDoc(stop.id, patch, "local-stop-budget-selection"))) {
    await syncStopListToDoc(day.id, "local-stop-budget-selection-fallback");
  }
  await logActivity(`${selected ? "纳入" : "移出"}预算组合「${stop.title}」`, { target: stopActivityTarget(day.id, stop.id, { action: selected ? "budget-select" : "budget-exclude" }) });
  await saveCollaborativePlanChange(`${selected ? "纳入" : "移出"}预算组合`);
  render();
}

function budgetEstimateEntries() {
  return budgetComboSummary().estimates.filter((item) => item.refType === "stop" || item.refType === "candidate");
}

async function applyBudgetEstimateFromToken(token = "") {
  const [refType, dayId, itemId] = String(token || "").split(":");
  if (!requireEdit("采用预算估算")) return;
  if (refType === "stop") {
    const day = state.days.find((item) => item.id === dayId);
    const stop = day?.stops?.find((item) => item.id === itemId);
    const estimate = inferTicketPrice(stop);
    if (!day || !stop || !estimate) {
      dom.saveState.textContent = "没有找到可采用的门票估算。";
      return;
    }
    if (!confirmRemoteStopEdit(stop.id, "采用地点门票估算")) return;
    stop.budget = estimate;
    stop.tags = Array.from(new Set([...(stop.tags || []), "门票估算待确认"]));
    if (!(await syncStopSnapshotToPlanDoc(stop.id, "local-budget-estimate-stop"))) {
      await syncStopListToDoc(day.id, "local-budget-estimate-stop-fallback");
    }
    await logActivity(`采用门票估算「${stop.title}」${money(estimate)}`, { target: stopActivityTarget(day.id, stop.id, { action: "budget-estimate" }) });
    await saveCollaborativePlanChange(`采用门票估算「${stop.title}」`);
    render();
    dom.saveState.textContent = `已把「${stop.title}」预算设为 ${money(estimate)}，请出行前确认官方票价。`;
    return;
  }
  if (refType === "candidate") {
    const candidate = (state.candidates || []).find((item) => item.id === itemId);
    const estimate = inferTicketPrice(candidate);
    if (!candidate || !estimate) {
      dom.saveState.textContent = "没有找到可采用的备选估算。";
      return;
    }
    if (!confirmRemoteCandidateEdit(candidate.id, "采用备选门票估算")) return;
    const patch = {
      budget: estimate,
      tags: Array.from(new Set([...(candidate.tags || []), "门票估算待确认"])),
    };
    if (await updateCandidateInDoc(candidate.id, patch)) {
      persistCurrentPlanFromDoc("备选预算估算已实时同步");
    } else {
      state.candidates = mergedCandidatesWithPatch("update", patch, candidate.id);
      await syncCandidatesToDoc("local-budget-estimate-candidate-fallback");
    }
    await logActivity(`采用备选门票估算「${candidate.title}」${money(estimate)}`, { target: candidateActivityTarget(candidate.id, { action: "budget-estimate" }) });
    await saveCollaborativePlanChange(`采用备选门票估算「${candidate.title}」`);
    render();
    dom.saveState.textContent = `已把备选「${candidate.title}」预算设为 ${money(estimate)}，请出行前确认官方票价。`;
    return;
  }
  dom.saveState.textContent = "这条预算估算暂时不能自动采用。";
}

async function adoptAllBudgetEstimates() {
  if (!requireEdit("批量采用门票估算")) return;
  const entries = budgetEstimateEntries();
  if (!entries.length) {
    dom.saveState.textContent = "当前没有可采用的门票估算。";
    return;
  }
  const affectedStopIds = entries
    .filter((item) => item.refType === "stop")
    .map((item) => item.itemId)
    .filter(Boolean);
  if (!confirmRemoteStopEdit(affectedStopIds, "批量采用门票估算")) return;
  const affectedCandidateIds = entries
    .filter((item) => item.refType === "candidate")
    .map((item) => item.itemId)
    .filter(Boolean);
  if (!confirmRemoteCandidateEdit(affectedCandidateIds, "批量采用门票估算")) return;
  saveVersionSnapshot("批量采用门票估算前版本");
  let stopCount = 0;
  let candidateCount = 0;
  const fallbackDayIds = new Set();
  let candidateFallback = false;
  for (const item of entries) {
    if (item.refType === "stop") {
      const day = state.days.find((entry) => entry.id === item.dayId);
      const stop = day?.stops?.find((entry) => entry.id === item.itemId);
      const estimate = inferTicketPrice(stop);
      if (!day || !stop || !estimate || numberValue(stop.budget)) continue;
      const patch = {
        budget: estimate,
        tags: Array.from(new Set([...(stop.tags || []), "门票估算待确认"])),
      };
      Object.assign(stop, patch);
      if (!(await patchStopInDoc(stop.id, patch, "local-budget-estimate-stop-batch"))) {
        fallbackDayIds.add(day.id);
      }
      stopCount += 1;
    } else if (item.refType === "candidate") {
      const candidate = (state.candidates || []).find((entry) => entry.id === item.itemId);
      const estimate = inferTicketPrice(candidate);
      if (!candidate || !estimate || numberValue(candidate.budget)) continue;
      const patch = {
        budget: estimate,
        tags: Array.from(new Set([...(candidate.tags || []), "门票估算待确认"])),
      };
      Object.assign(candidate, patch);
      if (!(await updateCandidateInDoc(candidate.id, patch))) {
        state.candidates = mergedCandidatesWithPatch("update", patch, candidate.id);
        candidateFallback = true;
      }
      candidateCount += 1;
    }
  }
  if (!stopCount && !candidateCount) {
    dom.saveState.textContent = "没有新的门票估算需要写入。";
    return;
  }
  for (const dayId of fallbackDayIds) {
    await syncStopListToDoc(dayId, "local-budget-estimates-batch-fallback");
  }
  if (candidateFallback) await syncCandidatesToDoc("local-candidate-budget-estimates-batch-fallback");
  persistCurrentPlanFromDoc("门票估算已按单项协作同步", { refreshViews: false, scheduleSave: false, updateStatus: false });
  await logActivity(`批量采用门票估算 ${stopCount + candidateCount} 项`, { target: budgetSettingActivityTarget("budgetLimit", { action: "batch-estimate" }) });
  await saveCollaborativePlanChange("批量采用门票估算");
  render();
  dom.saveState.textContent = `已采用 ${stopCount + candidateCount} 项门票估算，请出行前核对官方票价。`;
}

function stopPlaceLookupKeyword(stop = {}) {
  return [stop.amapKeyword, stop.address, stop.title]
    .map((value) => String(value || "").trim())
    .find(Boolean) || "";
}

function isPlaceholderStop(stop = {}, destination = "") {
  const title = String(stop.title || "").trim();
  const keyword = String(stop.amapKeyword || "").trim();
  const type = String(stop.type || "").trim();
  const destinationText = destination || (typeof state !== "undefined" ? state.destination : "");
  return !title ||
    /未命名地点|新地点|待填写地点|备选景点|自由探索时段|返程缓冲|外部记录/.test(title) ||
    /Draft|Idea|Flexible/.test(type) ||
    (keyword && keyword === String(destinationText || "").trim());
}

function stopImageLookupKey(stop = {}) {
  return uniqueTexts([stop.title, stop.amapKeyword, stop.address, state.destination])
    .join(" ")
    .trim();
}

async function lookupSpecificImageForStop(stop = {}) {
  const key = stopImageLookupKey(stop);
  if (!key) return "";
  if (specificImageLookupCache.has(key)) return specificImageLookupCache.get(key);
  const dynamic = await lookupDynamicPlaceImageForStop(stop);
  const image = cleanImageUrl(dynamic?.image || "");
  specificImageLookupCache.set(key, image || "");
  return image || "";
}

function isDefaultTripboardImage(value = "") {
  const url = String(value || "").trim();
  if (!isUsableImageUrl(url)) return true;
  return Object.values(images).includes(url) || /assets\/trip-images\//.test(url) || /images\.unsplash\.com/i.test(url);
}

function isSpecificRuleImage(value = "") {
  const url = cleanImageUrl(value);
  return Boolean(url && SPECIFIC_IMAGE_RULES.some(([, image]) => image === url));
}

function isGeneratedFallbackImage(value = "") {
  return /^data:image\/svg\+xml/i.test(String(value || "").trim());
}

function isLegacyRemoteImageUrl(value = "") {
  return /images\.unsplash\.com|p\d+\.itc\.cn|k\.sinaimg\.cn|images\.weserv\.nl/i.test(String(value || ""));
}

function isDynamicPlaceImageCandidate(value = "") {
  const url = cleanImageUrl(value);
  if (!url || /^data:image\//i.test(url)) return false;
  if (/\.svg(?:[?#]|$)/i.test(url)) return false;
  return !isDefaultTripboardImage(url) && !isGeneratedFallbackImage(url) && !isLegacyRemoteImageUrl(url);
}

function hasSpecificImage(value = "") {
  const url = cleanImageUrl(value);
  return Boolean(url && !isDefaultTripboardImage(url) && !isGeneratedFallbackImage(url));
}

function imageCandidateInputUrl(candidate = {}) {
  if (typeof candidate === "string") return cleanImageUrl(candidate);
  if (!candidate || typeof candidate !== "object") return "";
  return cleanImageUrl(candidate.url || candidate.image || candidate.src || candidate.href || "");
}

function normalizedImageCandidateList(stop = {}) {
  const candidates = [
    ...(Array.isArray(stop.imageCandidates) ? stop.imageCandidates : []),
    stop.image ? {
      url: stop.image,
      source: stop.imageSource || "",
      license: stop.imageLicense || "",
      creator: stop.imageCreator || "",
      pageUrl: stop.imagePageUrl || "",
      title: stop.title || "",
      verifiedAt: stop.imageVerifiedAt || "",
    } : null,
  ]
    .filter(Boolean)
    .map((candidate) => {
      if (typeof candidate === "string") {
        return {
          url: candidate,
          source: stop.imageSource || "",
          title: stop.title || "",
          verifiedAt: cleanImageUrl(candidate) === cleanImageUrl(stop.image) ? stop.imageVerifiedAt || "" : "",
        };
      }
      return candidate;
    })
    .map(normalizePlaceImageCandidate)
    .filter(Boolean);
  return rankedImageCandidates(candidates).slice(0, 8);
}

function hasVerifiedPlaceImage(stop = {}) {
  if (isPlaceholderStop(stop)) return false;
  const image = cleanImageUrl(stop.image);
  if (!isDynamicPlaceImageCandidate(image)) return false;
  const status = String(stop.imageStatus || "").trim().toLowerCase();
  if (status === "manual") return true;
  if (status !== "verified") return false;
  const source = String(stop.imageSource || "").trim();
  return Boolean(stop.imageVerifiedAt || /Amap POI|Wikimedia Commons|Openverse|place-image-search/i.test(source));
}

function hasResolvedPlaceImageMiss(stop = {}) {
  return /^(missing|failed)$/i.test(String(stop.imageStatus || "")) &&
    stop.imageLookupVersion === PLACE_IMAGE_LOOKUP_VERSION;
}

function hasTrustedCoverImage(plan = {}, image = plan.cover) {
  const cover = cleanImageUrl(image);
  if (!isDynamicPlaceImageCandidate(cover)) return false;
  return allPlanStops(plan).some((stop) => hasVerifiedPlaceImage(stop) && cleanImageUrl(stop.image) === cover);
}

function hasStableDisplayImage(stop = {}) {
  return Boolean(hasVerifiedPlaceImage(stop));
}

function isUsableImageUrl(value = "") {
  const url = String(value || "").trim();
  if (!url) return false;
  if (/^(undefined|null|nan|false|true)$/i.test(url)) return false;
  if (/^\d{1,3}$/.test(url)) return false;
  if (/\s/.test(url) && !/^data:image\//i.test(url)) return false;
  if (/^data:image\/(svg\+xml|png|jpe?g|webp|gif);/i.test(url)) return true;
  if (/^blob:/i.test(url)) return true;
  if (/^https?:\/\/[^/]+\/.+/i.test(url)) return true;
  if (/^(\/|\.\/|\.\.\/|assets\/).+\.(svg|png|jpe?g|webp|gif)(\?|#|$)/i.test(url)) return true;
  return false;
}

function cleanImageUrl(value = "") {
  const url = String(value || "").trim();
  return isUsableImageUrl(url) ? url : "";
}

function cssImageUrl(value = "") {
  return `url("${String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`;
}

function svgText(value = "") {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 36);
}

function localImageNameFromUrl(value = "") {
  const match = String(value || "").match(/(?:^|\/)trip-images\/([^/?#]+)\.svg/i);
  return match ? decodeURIComponent(match[1]) : "";
}

function stableImageMetaFromUrl(value = "") {
  const key = localImageNameFromUrl(value);
  const [label = "", sublabel = ""] = LOCAL_TRIP_IMAGE_LABELS[key] || [];
  return key ? { key, label, sublabel } : null;
}

function imageIllustrationKind(label = "", sublabel = "") {
  const text = `${label} ${sublabel}`;
  if (/餐|食|面|夜市|咖啡|饭|美食|Dinner|Lunch|Cafe|Market/i.test(text)) return "food";
  if (/交通|高铁|动车|机场|火车|Transit|抵达|返程|转场/i.test(text)) return "transit";
  if (/住宿|酒店|民宿|入住|Hotel|Lodging/i.test(text)) return "lodging";
  if (/寺|庙|清真|博物馆|石窟|文化|关城|古城|Museum|Temple|Mosque|Caves|Fort/i.test(text)) return "culture";
  if (/海|湖|盐湖|泉|湿地|河|Lake|Wetland|River|Sea/i.test(text)) return "water";
  if (/沙漠|丹霞|戈壁|雅丹|Desert|Danxia|Canyon/i.test(text)) return "desert";
  if (/草原|牧场|Grassland|Hulunbuir/i.test(text)) return "grassland";
  if (/森林|雾凇|雪|Forest|Rime|Snow/i.test(text)) return "forest";
  if (/山|高原|峰|峡谷|Mountain|Qilian|Laoshan|Changbai/i.test(text)) return "mountain";
  return "city";
}

function illustrationPalette(kind = "city", hue = 206) {
  const palettes = {
    water: ["#0b5f89", "#4aa6c8", "#f4d58d", "#ffffff"],
    desert: ["#88451d", "#d89038", "#f6d27b", "#3d2c22"],
    grassland: ["#28624a", "#78aa57", "#e5cf78", "#ffffff"],
    forest: ["#123b35", "#2e7357", "#cfd9b7", "#ffffff"],
    mountain: ["#2d4b61", "#6f8fa7", "#f2c66d", "#ffffff"],
    culture: ["#71352f", "#b65d45", "#e6c98f", "#ffffff"],
    food: ["#7a2f25", "#d1643c", "#f5c66e", "#ffffff"],
    transit: ["#25364c", "#657e9d", "#d6e4f0", "#ffffff"],
    lodging: ["#3d4151", "#7d6e62", "#e3c79b", "#ffffff"],
    city: ["#26384f", "#617b91", "#e9b872", "#ffffff"],
  };
  return palettes[kind] || [`hsl(${hue} 58% 26%)`, `hsl(${(hue + 34) % 360} 54% 42%)`, `hsl(${(hue + 92) % 360} 48% 72%)`, "#ffffff"];
}

function illustrationScene(kind = "city", colors = []) {
  const [dark, mid, light, white] = colors;
  const sun = `<circle cx="708" cy="112" r="54" fill="${light}" opacity=".82"/>`;
  const scenes = {
    water: `${sun}<path d="M0 334 C136 268 244 286 380 238 C536 184 690 150 900 204 L900 540 L0 540 Z" fill="${mid}"/><path d="M0 390 C132 360 250 382 388 352 C552 318 690 310 900 344 L900 540 L0 540 Z" fill="${light}" opacity=".72"/><path d="M44 420 C180 392 296 434 440 404 C596 372 710 390 856 368" fill="none" stroke="${white}" stroke-width="10" opacity=".54"/>`,
    desert: `${sun}<path d="M0 306 C160 244 296 284 428 232 C602 166 718 174 900 124 L900 540 L0 540 Z" fill="${mid}"/><path d="M0 394 C162 326 318 344 476 300 C660 248 760 278 900 236 L900 540 L0 540 Z" fill="${light}" opacity=".84"/><path d="M120 414 C264 372 400 390 548 350 C670 318 760 328 842 300" fill="none" stroke="${dark}" stroke-width="7" opacity=".22"/>`,
    grassland: `${sun}<path d="M0 342 C146 278 278 306 420 262 C580 212 710 190 900 226 L900 540 L0 540 Z" fill="${mid}"/><path d="M0 418 C168 354 326 372 490 334 C664 292 760 306 900 280 L900 540 L0 540 Z" fill="${light}" opacity=".68"/><path d="M128 430 C214 384 284 388 362 430" fill="none" stroke="${white}" stroke-width="8" opacity=".42"/>`,
    forest: `${sun}<path d="M80 370 L150 210 L220 370 Z M202 380 L278 172 L360 380 Z M470 382 L548 190 L630 382 Z M614 388 L706 146 L800 388 Z" fill="${mid}"/><path d="M0 420 C170 360 320 384 480 346 C650 306 780 322 900 290 L900 540 L0 540 Z" fill="${light}" opacity=".6"/>`,
    mountain: `${sun}<path d="M0 374 L188 174 L310 342 L430 128 L620 376 L742 206 L900 374 L900 540 L0 540 Z" fill="${mid}"/><path d="M430 128 L494 258 L384 244 Z M188 174 L228 286 L150 262 Z M742 206 L786 302 L700 286 Z" fill="${white}" opacity=".68"/><path d="M0 430 C160 382 314 398 472 370 C626 342 750 356 900 326 L900 540 L0 540 Z" fill="${light}" opacity=".58"/>`,
    culture: `${sun}<path d="M86 396 L86 262 L206 198 L330 262 L330 396 Z M384 396 L384 230 L538 158 L700 230 L700 396 Z" fill="${mid}"/><path d="M66 262 L206 184 L348 262 Z M354 230 L538 140 L730 230 Z" fill="${light}"/><rect x="118" y="296" width="54" height="100" fill="${dark}" opacity=".56"/><rect x="448" y="286" width="58" height="110" fill="${dark}" opacity=".5"/><path d="M0 424 C160 388 330 400 490 376 C640 354 780 362 900 338 L900 540 L0 540 Z" fill="${dark}" opacity=".22"/>`,
    food: `${sun}<circle cx="380" cy="326" r="104" fill="${light}" opacity=".84"/><circle cx="380" cy="326" r="70" fill="${mid}"/><path d="M560 212 L560 410 M602 212 L602 410 M548 212 C568 260 596 260 616 212" fill="none" stroke="${white}" stroke-width="16" stroke-linecap="round"/><path d="M0 420 C150 380 310 398 470 372 C640 344 780 360 900 334 L900 540 L0 540 Z" fill="${dark}" opacity=".22"/>`,
    transit: `${sun}<path d="M96 340 C240 280 496 280 694 326 C748 338 790 370 804 410 L96 410 Z" fill="${mid}"/><circle cx="222" cy="410" r="42" fill="${dark}"/><circle cx="668" cy="410" r="42" fill="${dark}"/><path d="M180 330 L514 330" stroke="${white}" stroke-width="22" opacity=".58"/><path d="M0 442 L900 442" stroke="${light}" stroke-width="18" opacity=".7"/>`,
    lodging: `${sun}<path d="M154 396 L154 238 L298 150 L450 238 L450 396 Z" fill="${mid}"/><path d="M128 238 L298 130 L474 238 Z" fill="${light}"/><rect x="246" y="294" width="82" height="102" fill="${dark}" opacity=".56"/><rect x="582" y="218" width="116" height="178" fill="${mid}" opacity=".82"/><path d="M0 426 C172 378 332 398 496 368 C652 340 774 354 900 326 L900 540 L0 540 Z" fill="${dark}" opacity=".2"/>`,
    city: `${sun}<rect x="104" y="246" width="112" height="164" fill="${mid}"/><rect x="258" y="188" width="118" height="222" fill="${light}" opacity=".78"/><rect x="420" y="258" width="100" height="152" fill="${mid}"/><rect x="572" y="210" width="146" height="200" fill="${light}" opacity=".66"/><path d="M0 424 C160 386 326 400 488 374 C660 346 780 360 900 332 L900 540 L0 540 Z" fill="${dark}" opacity=".25"/>`,
  };
  return scenes[kind] || scenes.city;
}

function fallbackIllustrationImage(label = "", sublabel = "") {
  const title = svgText(label || state.destination || state.name || "Tripboard");
  const subtitle = svgText(sublabel || state.dateRange || "Travel plan");
  let hash = 0;
  `${title} ${subtitle}`.split("").forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  });
  const hue = hash || 206;
  const kind = imageIllustrationKind(title, subtitle);
  const colors = illustrationPalette(kind, hue);
  const scene = illustrationScene(kind, colors);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".58" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="18"/></filter><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="rgba(0,0,0,.08)"/><stop offset=".68" stop-color="rgba(0,0,0,.2)"/><stop offset="1" stop-color="rgba(0,0,0,.46)"/></linearGradient></defs><rect width="900" height="540" fill="url(#bg)"/><g filter="url(#soft)" opacity=".22"><circle cx="182" cy="126" r="92" fill="${colors[3]}"/><circle cx="746" cy="206" r="126" fill="${colors[3]}"/></g><g opacity=".92">${scene}</g><rect width="900" height="540" fill="url(#shade)"/><text x="54" y="90" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="26" font-weight="700" fill="rgba(255,255,255,.72)">TRIPBOARD</text><text x="54" y="406" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="56" font-weight="800" fill="white">${title}</text><text x="58" y="462" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="26" font-weight="600" fill="rgba(255,255,255,.84)">${subtitle}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function fallbackIllustrationForStop(stop = {}, sublabel = "地点图片待补全") {
  return fallbackIllustrationImage(
    stop.title || stop.amapKeyword || stop.address || state.destination || state.name || "Tripboard",
    sublabel,
  );
}

function missingPlaceImagePlaceholder(stop = {}) {
  return fallbackIllustrationImage(stop.title || stop.amapKeyword || "图片待补全", "未找到可用实景图");
}

function imageUrlReliabilityScore(value = "") {
  const url = cleanImageUrl(value);
  if (!url || /^data:image\//i.test(url) || /\.svg(?:[?#]|$)/i.test(url)) return -1000;
  if (/store\.is\.autonavi\.com\/showpic/i.test(url)) return 100;
  if (/upload\.wikimedia\.org/i.test(url)) return 86;
  if (/commons\.wikimedia\.org|wikimedia\.org|wikipedia\.org/i.test(url)) return 72;
  if (/aos-comment\.amap\.com|aos-cdn-image\.amap\.com/i.test(url)) return 46;
  if (/images\.unsplash\.com/i.test(url)) return 10;
  return 34;
}

function imageCandidateReliabilityScore(candidate = {}) {
  const record = typeof candidate === "string" ? { url: candidate } : candidate;
  let score = imageUrlReliabilityScore(record.url || record.image || "");
  const title = String(record.title || "").trim();
  const source = String(record.source || "").trim();
  if (/Amap POI/i.test(source)) score += 8;
  if (/Wikimedia Commons|Openverse/i.test(source)) score += 3;
  if (/停车场|售票|票务|游客中心|服务中心|公共厕所|出入口|公交|车站|酒店|餐厅|民宿/i.test(title)) score -= 30;
  if (/景区|风景区|博物馆|寺|湖|山|盐湖|花海|草原|湿地|森林/i.test(title)) score += 12;
  return score;
}

function rankedImageCandidates(candidates = []) {
  const seen = new Set();
  return (Array.isArray(candidates) ? candidates : [])
    .map(normalizePlaceImageCandidate)
    .filter(Boolean)
    .filter((candidate) => {
      const key = candidate.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => imageCandidateReliabilityScore(b) - imageCandidateReliabilityScore(a));
}

function imageCandidateUrlsForStop(stop = {}, preferred = stop.image) {
  const candidates = [
    ...(Array.isArray(stop.imageCandidates) ? stop.imageCandidates : []),
    preferred ? {
      url: preferred,
      source: stop.imageSource || "",
      title: stop.title || "",
      verifiedAt: stop.imageVerifiedAt || "",
    } : null,
  ].filter(Boolean);
  return uniqueTexts(rankedImageCandidates(candidates).map((candidate) => candidate.url)).filter(Boolean);
}

function encodeImageCandidateUrls(urls = []) {
  const cleaned = uniqueTexts((Array.isArray(urls) ? urls : []).map(cleanImageUrl)).filter(Boolean).slice(0, 8);
  return encodeURIComponent(JSON.stringify(cleaned));
}

function decodeImageCandidateUrls(value = "") {
  try {
    const parsed = JSON.parse(decodeURIComponent(String(value || "")));
    return Array.isArray(parsed) ? uniqueTexts(parsed.map(cleanImageUrl)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function fallbackSourceQueue(image) {
  const source = cleanImageUrl(image?.getAttribute("src"));
  const candidates = decodeImageCandidateUrls(image?.dataset?.imageCandidates || "");
  const fallback = cleanImageUrl(image?.dataset?.fallbackSrc);
  if (/^data:image\//i.test(source) && candidates.length) return uniqueTexts([...candidates, source, fallback]).filter(Boolean);
  return uniqueTexts([source, ...candidates, fallback]).filter(Boolean);
}

function advanceImageFallback(image) {
  if (!image?.isConnected) return;
  const queue = fallbackSourceQueue(image);
  const current = cleanImageUrl(image.getAttribute("src"));
  const currentIndex = Math.max(0, queue.indexOf(current));
  const next = queue.slice(currentIndex + 1).find((url) => url && url !== current);
  if (!next) return;
  image.dataset.fallbackCheckedSrc = "";
  image.setAttribute("src", next);
  validateFallbackImage(image);
}

function validateFallbackImage(image) {
  const source = cleanImageUrl(image?.getAttribute("src"));
  if (!source || image?.dataset?.fallbackCheckedSrc === source) return;
  if (/^data:image\//i.test(source)) {
    const next = fallbackSourceQueue(image).find((url) => url && url !== source && !/^data:image\//i.test(url));
    if (next) {
      image.dataset.fallbackCheckedSrc = "";
      image.setAttribute("src", next);
      validateFallbackImage(image);
    }
    return;
  }
  if (image.complete && image.naturalWidth) return;
  image.dataset.fallbackCheckedSrc = source;
  const trusted = image.dataset.trustedSrc === "true";
  testImageLoad(source, trusted ? 7800 : 4600).then((ok) => {
    if (!image.isConnected || image.getAttribute("src") !== source) return;
    if (ok || image.naturalWidth) return;
    advanceImageFallback(image);
  });
}

function bindImageFallbacks(root = document) {
  root.querySelectorAll?.("img[data-fallback-src]").forEach((image) => {
    if (image.dataset.fallbackBound !== "true") {
      image.dataset.fallbackBound = "true";
      image.addEventListener("error", () => advanceImageFallback(image));
    }
    if (image.complete && !image.naturalWidth) advanceImageFallback(image);
    else validateFallbackImage(image);
  });
}

function testImageLoad(url = "", timeout = 3200) {
  const candidate = cleanImageUrl(url);
  if (!candidate || /^data:image\//i.test(candidate)) return Promise.resolve(Boolean(candidate));
  if (typeof Image === "undefined") return Promise.resolve(true);
  if (!testImageLoad.cache) testImageLoad.cache = new Map();
  if (testImageLoad.cache.has(candidate)) return testImageLoad.cache.get(candidate);
  const promise = new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const done = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const timer = setTimeout(() => done(false), timeout);
    image.onload = () => {
      clearTimeout(timer);
      done(Boolean(image.naturalWidth || image.width));
    };
    image.onerror = () => {
      clearTimeout(timer);
      done(false);
    };
    image.referrerPolicy = "no-referrer";
    image.src = candidate;
  });
  testImageLoad.cache.set(candidate, promise);
  return promise;
}

function normalizePlaceImageCandidate(candidate = {}) {
  const record = typeof candidate === "string" ? { url: candidate } : candidate || {};
  const url = imageCandidateInputUrl(record);
  if (!isDynamicPlaceImageCandidate(url)) return null;
  return {
    url,
    source: String(record.source || "").trim(),
    license: String(record.license || "").trim(),
    creator: String(record.creator || "").trim(),
    pageUrl: String(record.pageUrl || record.foreign_landing_url || "").trim(),
    width: Number(record.width || 0) || 0,
    height: Number(record.height || 0) || 0,
    title: String(record.title || "").trim(),
    verifiedAt: String(record.verifiedAt || "").trim(),
  };
}

function placeImageLookupKey(stop = {}, destination = state.destination || guideState.destination || "") {
  return uniqueTexts([destination, stop.title, stop.address, stop.amapKeyword, stop.type]).join("|").toLowerCase();
}

async function lookupDynamicPlaceImageForStop(stop = {}, options = {}) {
  const destination = options.destination || state.destination || guideState.destination || "";
  if (!serviceConfig.placeImageEndpoint || !shouldLookupSpecificStopImage(stop, destination)) return null;
  const key = placeImageLookupKey(stop, destination);
  if (!key) return null;
  if (placeImageCache.has(key)) return placeImageCache.get(key);
  const payload = {
    destination,
    title: stop.title || "",
    address: stop.address || "",
    amapKeyword: stop.amapKeyword || stop.title || "",
    type: stop.type || "",
    limit: options.limit || 4,
  };
  try {
    const response = await fetchWithTimeout(serviceConfig.placeImageEndpoint, {
      method: "POST",
      headers: serviceClient.headers("", serviceConfig.placeImageEndpoint),
      body: JSON.stringify(payload),
    }, options.timeoutMs || 14000);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || `HTTP ${response.status}`);
    const candidates = (Array.isArray(data.candidates) ? data.candidates : [data.image ? data : null])
      .map(normalizePlaceImageCandidate)
      .filter(Boolean);
    const rankedCandidates = rankedImageCandidates(candidates);
    const verifiedCandidate =
      rankedCandidates.find((candidate) => candidate.verifiedAt) ||
      rankedCandidates[0];
    if (verifiedCandidate) {
      const result = {
        image: verifiedCandidate.url,
        imageSource: verifiedCandidate.source || data.source || "place-image-search",
        imageLicense: verifiedCandidate.license || data.license || "",
        imageCreator: verifiedCandidate.creator || data.creator || "",
        imagePageUrl: verifiedCandidate.pageUrl || data.pageUrl || "",
        imageVerifiedAt: verifiedCandidate.verifiedAt || data.verifiedAt || new Date().toISOString(),
        imageStatus: "verified",
        imageLookupVersion: PLACE_IMAGE_LOOKUP_VERSION,
        imageCandidates: rankedCandidates.slice(0, 8),
      };
      placeImageCache.set(key, result);
      return result;
    }
    const missing = {
      image: "",
      imageStatus: "missing",
      imageSource: data.source || "place-image-search",
      imageLookupVersion: PLACE_IMAGE_LOOKUP_VERSION,
      imageCandidates: rankedCandidates.slice(0, 8),
    };
    placeImageCache.set(key, missing);
    return missing;
  } catch (error) {
    console.warn("Dynamic place image lookup failed", payload, error);
    const failed = { image: "", imageStatus: "failed", imageSource: "place-image-search", imageLookupVersion: PLACE_IMAGE_LOOKUP_VERSION, imageCandidates: [] };
    placeImageCache.set(key, failed);
    return failed;
  }
}

async function mapWithConcurrency(items, limit, worker) {
  const results = [];
  let nextIndex = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function imagePatchFromLookup(result = {}) {
  if (!result) return null;
  if (result.image) {
    return {
      image: result.image,
      imageSource: result.imageSource || "",
      imageLicense: result.imageLicense || "",
      imageCreator: result.imageCreator || "",
      imagePageUrl: result.imagePageUrl || "",
      imageVerifiedAt: result.imageVerifiedAt || new Date().toISOString(),
      imageStatus: "verified",
      imageLookupVersion: PLACE_IMAGE_LOOKUP_VERSION,
      imageCandidates: result.imageCandidates || [],
    };
  }
  return {
    image: "",
    imageStatus: result.imageStatus || "missing",
    imageSource: result.imageSource || "place-image-search",
    imageLookupVersion: PLACE_IMAGE_LOOKUP_VERSION,
    imageCandidates: result.imageCandidates || [],
  };
}

function allPlanStops(plan = {}) {
  return [
    ...(plan.days || []).flatMap((day) => day.stops || []),
    ...(plan.candidates || []),
  ];
}

function markPendingPlaceImages(plan = {}) {
  allPlanStops(plan).forEach((stop) => {
    if (!shouldLookupSpecificStopImage(stop, plan.destination)) return;
    if (hasVerifiedPlaceImage(stop)) return;
    stop.image = "";
    stop.imageStatus = "pending";
    stop.imageLookupVersion = "";
  });
  if (isDefaultTripboardImage(plan.cover) || isGeneratedFallbackImage(plan.cover)) plan.cover = "";
  return plan;
}

async function enrichPlanImagesBeforeSave(plan = {}, options = {}) {
  if (!plan || !serviceConfig.placeImageEndpoint) return { checked: 0, imageCount: 0, missingCount: 0 };
  const stops = allPlanStops(plan)
    .filter((stop) => shouldLookupSpecificStopImage(stop, plan.destination))
    .slice(0, options.maxItems || 14);
  let imageCount = 0;
  let missingCount = 0;
  await mapWithConcurrency(stops, options.concurrency || 3, async (stop, index) => {
    if (options.onProgress) options.onProgress(index + 1, stops.length, stop);
    const result = await lookupDynamicPlaceImageForStop(stop, { destination: plan.destination, limit: 4, timeoutMs: 14000 });
    const patch = imagePatchFromLookup(result);
    if (!patch) return;
    Object.assign(stop, patch);
    if (patch.image) {
      imageCount += 1;
      if (!hasTrustedCoverImage(plan, plan.cover)) plan.cover = patch.image;
    } else {
      missingCount += 1;
    }
  });
  if (!hasTrustedCoverImage(plan, plan.cover)) {
    const firstImage = allPlanStops(plan).find((stop) => hasVerifiedPlaceImage(stop))?.image;
    plan.cover = firstImage || "";
  }
  return { checked: stops.length, imageCount, missingCount };
}

function setVerifiedBackgroundImage(element, cssVariable, imageUrl, fallbackUrl, label = "", options = {}) {
  if (!element) return "";
  const localMeta = stableImageMetaFromUrl(imageUrl) || stableImageMetaFromUrl(fallbackUrl);
  const finalFallback = fallbackIllustrationImage(localMeta?.label || label, localMeta?.sublabel || "");
  const fallback = cleanImageUrl(fallbackUrl) || finalFallback;
  const primary = cleanImageUrl(imageUrl);
  const optionCandidates = Array.isArray(options.candidates) ? options.candidates.map(cleanImageUrl).filter(Boolean) : [];
  const queue = uniqueTexts([
    ...(/^data:image\//i.test(primary) && optionCandidates.some((url) => !/^data:image\//i.test(url)) ? [] : [primary]),
    ...optionCandidates,
    ...(/^data:image\//i.test(primary) && optionCandidates.some((url) => !/^data:image\//i.test(url)) ? [primary] : []),
    fallback,
    finalFallback,
  ]).filter(Boolean);
  const candidate = queue[0] || fallback;
  const token = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (localMeta && isDefaultTripboardImage(candidate)) {
    element.dataset.imageToken = token;
    element.dataset.imageUrl = finalFallback;
    element.style.setProperty(cssVariable, cssImageUrl(finalFallback));
    return finalFallback;
  }
  element.dataset.imageToken = token;
  element.dataset.imageUrl = candidate;
  element.dataset.imageCandidates = encodeImageCandidateUrls(queue);
  element.style.setProperty(cssVariable, cssImageUrl(candidate));
  if (/^data:image\//i.test(candidate)) {
    testBackgroundImageQueue(element, cssVariable, token, options.trusted ? 7600 : 4200);
    return candidate;
  }
  testBackgroundImageQueue(element, cssVariable, token, options.trusted ? 7600 : 4200);
  return candidate;
}

function testBackgroundImageQueue(element, cssVariable, token, timeout = 4200) {
  const queue = decodeImageCandidateUrls(element?.dataset?.imageCandidates || "");
  const current = cleanImageUrl(element?.dataset?.imageUrl);
  if (!element || !current) return;
  if (/^data:image\//i.test(current)) {
    const next = queue.find((url) => url && url !== current && !/^data:image\//i.test(url));
    if (!next || element.dataset.imageToken !== token) return;
    element.dataset.imageUrl = next;
    element.style.setProperty(cssVariable, cssImageUrl(next));
    testBackgroundImageQueue(element, cssVariable, token, timeout);
    return;
  }
  testImageLoad(current, timeout).then((ok) => {
    if (ok || element.dataset.imageToken !== token || cleanImageUrl(element.dataset.imageUrl) !== current) return;
    const currentIndex = Math.max(0, queue.indexOf(current));
    const next = queue.slice(currentIndex + 1).find((url) => url && url !== current);
    if (!next) return;
    element.dataset.imageUrl = next;
    element.style.setProperty(cssVariable, cssImageUrl(next));
    if (!/^data:image\//i.test(next)) testBackgroundImageQueue(element, cssVariable, token, timeout);
  });
}

function displayFallbackImageForStop(stop = {}) {
  const stopText = `${stop.title || ""} ${stop.address || ""} ${stop.type || ""} ${stop.amapKeyword || ""}`;
  const destinationText = String(state.destination || "");
  if (/餐|食|面|夜市|Cafe|Dinner|Lunch|Market/.test(stopText)) return fallbackIllustrationImage(stop.title || "美食", "餐饮与夜市");
  const destinationImage = destinationImageForText(stopText, destinationText);
  if (/交通|高铁|动车|机场|火车|Transit|抵达|入住|返程/.test(stopText)) {
    const meta = stableImageMetaFromUrl(destinationImage || destinationDefaultImage(destinationText) || images.train);
    return fallbackIllustrationImage(stop.title || meta?.label || "交通", meta?.sublabel || "机场、动车与转场");
  }
  if (shouldLookupSpecificStopImage(stop)) return "";
  const fallbackLabel = stop.title || stop.amapKeyword || state.destination || state.name || "Tripboard";
  const fallbackSubLabel = /博物馆|Museum|寺|石窟|文化/.test(stopText)
    ? "文化地点 · 图片待补全"
    : /山|湖|海|岛|草原|森林|峡谷|沙漠|湿地|牧场|自然|户外/.test(stopText)
      ? "自然景点 · 图片待补全"
      : "地点图片待补全";
  return fallbackIllustrationImage(fallbackLabel, fallbackSubLabel);
}

function displayImageForStop(stop = {}) {
  const image = cleanImageUrl(stop.image);
  if (hasVerifiedPlaceImage(stop) && isDynamicPlaceImageCandidate(image)) return image;
  return displayFallbackImageForStop(stop);
}

function preferredDetailStop(day = currentDay()) {
  const stops = Array.isArray(day?.stops) ? day.stops : [];
  const concreteStops = stops.filter((stop) => !isPlaceholderStop(stop));
  return concreteStops.find((stop) => hasVerifiedPlaceImage(stop)) ||
    concreteStops.find((stop) => shouldLookupSpecificStopImage(stop)) ||
    concreteStops[0] ||
    stops[0] ||
    null;
}

function placeImageMetaText(stop = {}) {
  if (stop.imageStatus === "pending") return "正在查找实景图";
  if (stop.imageStatus === "missing") return "未找到可用实景图，可手动粘贴图片 URL 或重新查找";
  if (stop.imageStatus === "failed") return "实景图接口失败，可手动粘贴图片 URL 或重新查找";
  const source = String(stop.imageSource || "").trim();
  const license = String(stop.imageLicense || "").trim();
  if (source || license) return ["图片来源", source, license].filter(Boolean).join(" · ");
  if (shouldLookupSpecificStopImage(stop)) return serviceConfig.placeImageEndpoint ? "正在查找实景图" : "未配置实景图代理";
  return "";
}

function applyPlacePhotoDisplay(stop = {}) {
  const image = displayImageForStop(stop);
  const fallback = displayFallbackImageForStop(stop) || missingPlaceImagePlaceholder(stop);
  const trusted = hasVerifiedPlaceImage(stop) && cleanImageUrl(stop.image) === cleanImageUrl(image);
  setVerifiedBackgroundImage(dom.placePhoto, "--photo", image, fallback, stop.title || state.destination || state.name, {
    trusted,
    candidates: imageCandidateUrlsForStop(stop, image),
  });
  const hasRealImage = isDynamicPlaceImageCandidate(image);
  dom.placePhoto?.classList.toggle("is-missing-image", !hasRealImage && shouldLookupSpecificStopImage(stop));
  if (dom.placePhotoMeta) {
    const metaText = placeImageMetaText(stop);
    const pageUrl = String(stop.imagePageUrl || "").trim();
    dom.placePhotoMeta.innerHTML = pageUrl && hasRealImage
      ? `<a href="${escapeHtml(pageUrl)}" target="_blank" rel="noopener">${escapeHtml(metaText || "图片来源")}</a>`
      : escapeHtml(metaText);
  }
}

function shouldLookupSpecificStopImage(stop = {}, destination = state.destination) {
  if (!stop || isPlaceholderStop(stop)) return false;
  if (hasVerifiedPlaceImage(stop)) return false;
  const text = `${destination || ""} ${stop.title || ""} ${stop.address || ""} ${stop.type || ""} ${stop.amapKeyword || ""}`;
  if (NON_PLACE_IMAGE_TYPES.test(text)) return false;
  if (!PLACE_IMAGE_TYPES.test(text)) return false;
  return true;
}

async function updateStopImageAfterLookup(stop, image, reason = "specific-image-lookup") {
  if (!stop?.id || !hasSpecificImage(image) || hasSpecificImage(stop.image)) return false;
  stop.image = image;
  if (canEdit() && !isReadonlyMode) {
    try {
      if (findStopLocation(stop.id)) {
        if (!(await patchStopInDoc(stop.id, { image }, reason))) {
          await syncStopListToDoc(findStopLocation(stop.id)?.day?.id, `${reason}-fallback`);
        }
      } else if ((state.candidates || []).some((item) => item.id === stop.id)) {
        if (!(await updateCandidateInDoc(stop.id, { image }))) {
          state.candidates = mergedCandidatesWithPatch("update", { image }, stop.id);
          await syncCandidatesToDoc(`${reason}-candidate-fallback`);
        }
      }
    } catch (error) {
      console.warn("Specific image sync failed", stop.title, error);
    }
  }
  return true;
}

async function updateStopImagePatchAfterLookup(stop, patch = {}, reason = "dynamic-place-image-lookup") {
  if (!stop?.id || !patch || (!patch.image && !patch.imageStatus)) return false;
  const safePatch = { ...patch };
  Object.assign(stop, safePatch);
  if (canEdit() && !isReadonlyMode) {
    try {
      const location = findStopLocation(stop.id);
      if (location) {
        if (!(await patchStopInDoc(stop.id, safePatch, reason))) {
          await syncStopListToDoc(location.day?.id, `${reason}-fallback`);
        }
      } else if ((state.candidates || []).some((item) => item.id === stop.id)) {
        if (!(await updateCandidateInDoc(stop.id, safePatch))) {
          state.candidates = mergedCandidatesWithPatch("update", safePatch, stop.id);
          await syncCandidatesToDoc(`${reason}-candidate-fallback`);
        }
      }
    } catch (error) {
      console.warn("Dynamic image sync failed", stop.title, error);
    }
  }
  return true;
}

function scheduleSpecificImageForStop(stop = {}, options = {}) {
  if (!shouldLookupSpecificStopImage(stop)) return;
  const key = stopImageLookupKey(stop);
  if (!key || specificImageLookupPending.has(key)) return;
  specificImageLookupPending.add(key);
  lookupDynamicPlaceImageForStop(stop)
    .then(async (result) => {
      const patch = imagePatchFromLookup(result);
      if (!patch) return;
      const changed = await updateStopImagePatchAfterLookup(stop, patch, options.reason || "dynamic-place-image-lookup");
      if (changed && currentStop()?.id === stop.id) {
        applyPlacePhotoDisplay(stop);
        if (dom.fieldImage && dom.fieldImage.value !== stop.image) dom.fieldImage.value = stop.image || "";
      }
      if (changed && options.render !== false) {
        renderDays();
        renderTimeline();
        renderMap();
      }
    })
    .finally(() => specificImageLookupPending.delete(key));
}

function scheduleSpecificCoverImage() {
  if (hasTrustedCoverImage(state, state.cover)) return;
  const stops = (state.days || [])
    .flatMap((day) => day.stops || [])
    .filter((stop) => !isPlaceholderStop(stop) && shouldLookupSpecificStopImage(stop));
  const scenicStops = stops.filter((item) => /Scenic|Mountain|Lake|Museum|Forest|Canyon|Grottoes|Geopark|Temple|Heritage|Grassland|Wetland|Desert|\u666f\u533a|\u666f\u70b9|\u535a\u7269\u9986|\u5bfa|\u6e56|\u5c71|\u76d0\u6e56/i.test(`${item.type || ""} ${item.title || ""}`));
  const orderedStops = [...scenicStops, ...stops.filter((stop) => !scenicStops.includes(stop))].slice(0, 8);
  if (!orderedStops.length) return;
  const key = `cover:${orderedStops.map((stop) => stopImageLookupKey(stop)).join("|")}`;
  if (coverImageLookupPending.has(key)) return;
  coverImageLookupPending.add(key);
  (async () => {
    for (const stop of orderedStops) {
      if (hasTrustedCoverImage(state, state.cover)) return;
      const result = await lookupDynamicPlaceImageForStop(stop);
      const patch = imagePatchFromLookup(result);
      if (patch) await updateStopImagePatchAfterLookup(stop, patch, "specific-cover-image-stop-patch");
      const image = cleanImageUrl(patch?.image || result?.image || "");
      if (!isDynamicPlaceImageCandidate(image)) continue;
      state.cover = image;
      const fallback = fallbackIllustrationForStop(stop, "Trip cover image pending");
      const coverCandidates = imageCandidateUrlsForStop(stop, image);
      setVerifiedBackgroundImage(dom.tripCover, "--trip-cover", image, fallback, stop.title || state.destination || state.name, { trusted: true, candidates: coverCandidates });
      setVerifiedBackgroundImage(document.querySelector(".template-card"), "--template-cover", image, fallback, stop.title || state.destination || state.name, { trusted: true, candidates: coverCandidates });
      dom.tripCover?.classList.remove("is-missing-image");
      document.querySelector(".template-card")?.classList.remove("is-missing-image");
      if (canEdit() && !isReadonlyMode) {
        if (!(await syncPlanSettingToDoc("cover", image))) await syncPlanMetaToDoc("specific-cover-image-fallback");
      }
      return;
    }
  })()
    .finally(() => coverImageLookupPending.delete(key));
}
function displayCoverImage() {
  return preferredCoverForPlan(state);
}

function firstMeaningfulStopIndex(day = {}) {
  const stops = day?.stops || [];
  const index = stops.findIndex((stop) => shouldLookupSpecificStopImage(stop) || specificRuleImageForStop(stop));
  return index >= 0 ? index : 0;
}

function applyPlaceToStop(stop, place) {
  if (!stop || !place) return null;
  const patch = {};
  if (!stop.address && place.address) {
    stop.address = place.address;
    patch.address = place.address;
  }
  if (!stop.lng && place.lng) {
    stop.lng = place.lng;
    patch.lng = place.lng;
  }
  if (!stop.lat && place.lat) {
    stop.lat = place.lat;
    patch.lat = place.lat;
  }
  if (!stop.amapKeyword && (place.title || stop.title)) {
    stop.amapKeyword = place.title || stop.title;
    patch.amapKeyword = place.title || stop.title;
  }
  return Object.keys(patch).length ? patch : null;
}

function imageEnrichmentCandidates() {
  const candidates = [];
  state.days.forEach((day) => {
    (day.stops || []).forEach((stop) => {
      if (isPlaceholderStop(stop)) return;
      const needsPlace = !stop.lng || !stop.lat || !stop.address || shouldLookupSpecificStopImage(stop);
      const keyword = stopPlaceLookupKeyword(stop);
      if (needsPlace && keyword) candidates.push({ type: "stop", day, stop, keyword });
    });
  });
  (state.candidates || []).forEach((stop) => {
    if (isPlaceholderStop(stop)) return;
    const needsPlace = !stop.lng || !stop.lat || !stop.address || shouldLookupSpecificStopImage(stop);
    const keyword = stopPlaceLookupKeyword(stop);
    if (needsPlace && keyword) candidates.push({ type: "candidate", stop, keyword });
  });
  return candidates;
}

function shouldAutoEnrichImages() {
  return Boolean(imageEnrichmentCandidates().some((item) => !hasStableDisplayImage(item.stop) || (canEdit() && !isReadonlyMode && serviceConfig.amapEndpoint && (!item.stop?.lng || !item.stop?.lat || !item.stop?.address))));
}

async function enrichPlacesFromAmap(options = {}) {
  const auto = Boolean(options.auto);
  if (!auto && !requireEdit("补全地点图片")) return;
  const candidates = imageEnrichmentCandidates();
  if (!candidates.length) {
    if (!auto) dom.saveState.textContent = "当前地点已经有较完整的地址、坐标或图片信息。";
    return;
  }
  const affectedStopIds = candidates
    .filter((item) => item.type === "stop")
    .map((item) => item.stop?.id)
    .filter(Boolean);
  if (!auto && !confirmRemoteStopEdit(affectedStopIds, "补全行程地点图片和坐标")) return;
  const affectedCandidateIds = candidates
    .filter((item) => item.type === "candidate")
    .map((item) => item.stop?.id)
    .filter(Boolean);
  if (!auto && !confirmRemoteCandidateEdit(affectedCandidateIds, "补全备选地点图片和坐标")) return;
  if (!auto) saveVersionSnapshot("补全地点图片前版本");
  dom.saveState.textContent = serviceConfig.placeImageEndpoint
    ? auto ? "正在自动查找景点实景图..." : `正在查找并验证 ${Math.min(candidates.length, 12)} 个地点的实景图...`
    : `未配置实景图代理；将只补全坐标，景点图显示待补全。`;
  const fallbackDayIds = new Set();
  let candidateFallback = false;
  let changedStops = 0;
  let changedCandidates = 0;
  let imageCount = 0;
  let firstNewImage = "";
  let checked = 0;
  for (const item of candidates.slice(0, 12)) {
    checked += 1;
    try {
      const canSync = canEdit() && !isReadonlyMode;
      const places = canSync && serviceConfig.amapEndpoint ? await lookupAmapPlaces(item.keyword, { limit: 3 }) : [];
      const place = Array.isArray(places) ? places[0] : null;
      const dynamicImagePatch = !hasVerifiedPlaceImage(item.stop) && shouldLookupSpecificStopImage(item.stop)
        ? imagePatchFromLookup(await lookupDynamicPlaceImageForStop(item.stop))
        : null;
      if (!place && !dynamicImagePatch) continue;
      const hadRealImage = hasVerifiedPlaceImage(item.stop);
      const patch = place ? (applyPlaceToStop(item.stop, place) || {}) : {};
      if (dynamicImagePatch && !hasVerifiedPlaceImage(item.stop)) {
        Object.assign(item.stop, dynamicImagePatch);
        Object.assign(patch, dynamicImagePatch);
      }
      if (Object.keys(patch).length) {
        if (patch.image && !firstNewImage) firstNewImage = patch.image;
        if (canSync && item.type === "stop") {
          if (!(await patchStopInDoc(item.stop.id, patch, "local-amap-place-enrich-stop"))) {
            fallbackDayIds.add(item.day.id);
          }
          changedStops += 1;
        } else if (canSync) {
          if (!(await updateCandidateInDoc(item.stop.id, patch))) {
            state.candidates = mergedCandidatesWithPatch("update", patch, item.stop.id);
            candidateFallback = true;
          }
          changedCandidates += 1;
        } else {
          if (item.type === "stop") changedStops += 1;
          else changedCandidates += 1;
        }
        if (!hadRealImage && hasVerifiedPlaceImage(item.stop)) imageCount += 1;
      }
    } catch (error) {
      console.warn("Amap place enrichment failed", item.keyword, error);
    }
  }
  const coverChanged = Boolean(firstNewImage && !hasTrustedCoverImage(state, state.cover));
  if (coverChanged) {
    state.cover = firstNewImage;
    if (canEdit() && !isReadonlyMode && !(await syncPlanSettingToDoc("cover", firstNewImage))) {
      await syncPlanMetaToDoc("local-amap-place-cover-fallback");
    }
  }
  for (const dayId of fallbackDayIds) {
    await syncStopListToDoc(dayId, "local-amap-place-enrich-fallback");
  }
  if (candidateFallback) await syncCandidatesToDoc("local-amap-candidate-enrich-fallback");
  if (!changedStops && !changedCandidates) {
    if (!auto) dom.saveState.textContent = `已查询 ${checked} 个地点，没有返回可写入的新坐标或真实图片；景点图会显示待补全。`;
    return;
  }
  persistCurrentPlanFromDoc("高德地点资料已按单项协作同步", { refreshViews: false, scheduleSave: false, updateStatus: false });
  await logActivity(`${auto ? "自动" : ""}补全地点资料 ${changedStops + changedCandidates} 项，其中图片 ${imageCount} 张${coverChanged ? "，并更新封面" : ""}`);
  await saveCollaborativePlanChange(`${auto ? "自动" : ""}补全地点图片和坐标`);
  render();
  dom.saveState.textContent = `已补全 ${changedStops + changedCandidates} 个地点，其中新增真实图片 ${imageCount} 张${coverChanged ? "，并更新封面" : ""}；无真实图时显示待补全。`;
}

function scheduleAutoImageEnrichment(delay = 1200) {
  window.clearTimeout(scheduleAutoImageEnrichment.timer);
  scheduleAutoImageEnrichment.timer = window.setTimeout(() => {
    if (!shouldAutoEnrichImages()) return;
    enrichPlacesFromAmap({ auto: true }).catch((error) => {
      console.warn("Auto image enrichment failed", error);
    });
  }, delay);
}

function categoryBudget() {
  const groups = { 交通: 0, 餐饮: 0, 门票: 0, 住宿: 0 };
  selectedBudgetStops().forEach(({ stop }) => {
    const title = `${stop.title}${stop.type}${stop.tags.join("")}`;
    const value = numberValue(stop.budget) || inferTicketPrice(stop);
    if (/酒店|民宿|住宿|入住/.test(title)) groups.住宿 += value;
    else if (/餐|食|面|夜市|Cafe|Dinner|Lunch|Market/.test(title)) groups.餐饮 += value;
    else if (/交通|高铁|Transit|车|机场|返程/.test(title)) groups.交通 += value;
    else groups.门票 += value;
  });
  (state.transportQuotes || []).forEach((quote) => {
    if (quote.selected) groups.交通 += numberValue(quote.price);
  });
  (state.candidates || []).forEach((candidate) => {
    if (!candidate.selected) return;
    const value = numberValue(candidate.budget) || inferTicketPrice(candidate);
    const category = budgetCategoryForItem(candidate);
    if (category === "住宿") groups.住宿 += value;
    else if (category === "餐饮") groups.餐饮 += value;
    else if (category === "交通") groups.交通 += value;
    else groups.门票 += value;
  });
  return groups;
}

function renderShell() {
  ensurePlanOrigin(state);
  renderPlanSwitcher();
  const total = totalPlannedBudget();
  const confirmedTotal = totalBudget();
  const paid = totalPlannedPaid();
  const confirmedPaid = totalPaid();
  const people = partySize();
  const limit = Number(state.budgetLimit || 10000);
  const percent = Math.min(100, Math.round((total / limit) * 100));
  dom.tripName.textContent = state.name;
  dom.templateName.textContent = state.name;
  dom.tripDateRange.textContent = state.dateRange || "自定义日期";
  const coverImage = displayCoverImage();
  const coverFallback = fallbackIllustrationImage(state.destination || state.name || "封面图片待补全", "封面实景图待补全");
  const trustedCover = hasTrustedCoverImage(state, coverImage);
  const coverStop = allPlanStops(state).find((stop) => hasVerifiedPlaceImage(stop) && cleanImageUrl(stop.image) === cleanImageUrl(coverImage));
  const coverCandidates = coverStop ? imageCandidateUrlsForStop(coverStop, coverImage) : [];
  setVerifiedBackgroundImage(dom.tripCover, "--trip-cover", coverImage, coverFallback, state.destination || state.name, { trusted: trustedCover, candidates: coverCandidates });
  setVerifiedBackgroundImage(document.querySelector(".template-card"), "--template-cover", coverImage, coverFallback, state.destination || state.name, { trusted: trustedCover, candidates: coverCandidates });
  dom.tripCover?.classList.toggle("is-missing-image", !isDynamicPlaceImageCandidate(coverImage));
  document.querySelector(".template-card")?.classList.toggle("is-missing-image", !isDynamicPlaceImageCandidate(coverImage));
  scheduleSpecificCoverImage();
  dom.budgetTotal.textContent = `${money(total)} / ${money(limit)}`;
  dom.budgetMeter.style.width = `${percent}%`;
  const groups = categoryBudget();
  dom.budgetGrid.innerHTML = Object.entries(groups)
    .map(([key, value]) => `<span>${key} ${money(value)}</span>`)
    .join("");
  dom.partySizeInput.value = people;
  dom.budgetLimitInput.value = limit;
  const payerRows = Object.entries(payerBudget())
    .map(([payer, value]) => `<span>${payer} 已付 ${money(value)}</span>`)
    .join("");
  const settlement = settlementSuggestions();
  const transferRows = settlement.transfers
    .slice(0, 6)
    .map((item) => `<span>${escapeHtml(item.from)} 转给 ${escapeHtml(item.to)} ${money(item.amount)}</span>`)
    .join("");
  dom.budgetSettlement.innerHTML = `
    <span>已付 ${money(paid)}</span>
    <span>待付 ${money(Math.max(0, total - paid))}</span>
    <span>人均 ${money(Math.round(total / people))}</span>
    ${total !== confirmedTotal ? `<span>行程已确定 ${money(confirmedTotal)} · 已选组合 ${money(total)}</span>` : ""}
    ${paid !== confirmedPaid ? `<span>行程已付 ${money(confirmedPaid)} · 组合已付 ${money(paid)}</span>` : ""}
    ${payerRows || "<span>暂无付款记录</span>"}
    <strong>AA 结算建议</strong>
    ${transferRows || "<span>当前无需转账或付款人信息不足</span>"}
    ${settlement.missingPayer ? `<span>未指定付款人 ${money(settlement.missingPayer)}，建议先补充付款人</span>` : ""}
  `;
  if (dom.budgetCombo) dom.budgetCombo.innerHTML = renderBudgetCombo();
  if (dom.budgetAdoptEstimatesBtn) {
    const estimateCount = budgetEstimateEntries().length;
    dom.budgetAdoptEstimatesBtn.disabled = !canEdit() || !estimateCount;
    dom.budgetAdoptEstimatesBtn.innerHTML = `${icon("ticket-check")}<span>${estimateCount ? `采用 ${estimateCount} 项估算` : "无待采用估算"}</span>`;
  }
  if (dom.budgetEnrichPlacesBtn) {
    dom.budgetEnrichPlacesBtn.disabled = !canEdit();
    dom.budgetEnrichPlacesBtn.innerHTML = `${icon("image-plus")}<span>补全地点图片</span>`;
  }

}

function renderDays() {
  const editable = canEdit();
  dom.dayList.innerHTML = state.days
    .map(
      (day, index) => {
        const isActive = index === activeDay;
        const upDisabled = !editable || index === 0 ? " disabled" : "";
        const downDisabled = !editable || index >= state.days.length - 1 ? " disabled" : "";
        const dayBudget = (day.stops || []).reduce((sum, stop) => sum + Number(stop.budget || 0), 0);
        return `
        <div class="day-card ${isActive ? "is-active" : ""}" data-day-card="${index}">
          <button class="day-button ${isActive ? "is-active" : ""}" data-day="${index}">
            <span>${day.label}</span>
            <strong>${day.title}<small>${day.route}</small></strong>
            <em>${money(dayBudget)}</em>
          </button>
          ${
            editable
              ? `<div class="day-card-actions" aria-label="移动${escapeHtml(day.label || `D${index + 1}`)}">
                  <button type="button" class="icon-btn subtle" data-move-day-index="${index}" data-move-day-direction="up" title="上移当天"${upDisabled}>${icon("chevron-up")}</button>
                  <button type="button" class="icon-btn subtle" data-move-day-index="${index}" data-move-day-direction="down" title="下移当天"${downDisabled}>${icon("chevron-down")}</button>
                </div>`
              : ""
          }
        </div>
      `;
      },
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
  if (collabDayTextDayId !== day.id || !collabDayTextDoc) {
    dom.fieldDayTitle.value = day.title || "";
    dom.fieldDayRoute.value = day.route || "";
    dom.fieldDayWeather.value = day.weather || "";
    dom.fieldDayTransport.value = day.transport || "";
  }
  dom.dayEditorStatus.textContent = isReadonlyMode ? "只读" : tripId ? "实时协作" : "本地保存";
  const editable = canEdit();
  dom.moveDayUpBtn.disabled = !editable || activeDay === 0;
  dom.moveDayDownBtn.disabled = !editable || activeDay >= state.days.length - 1;
  dom.deleteDayBtn.disabled = !editable || state.days.length <= 1;
  renderDayFieldCommentMarks(day);
  if (dom.dayCommentTitle) dom.dayCommentTitle.textContent = day.title || day.label || "当前日期";
}

function dayEditorDraftValues(day = currentDay()) {
  const collabValues = collabDayTextDayId === day?.id && collabDayTextDoc ? dayTextValuesFromDoc() : null;
  const textValue = (field, domKey, fallback = "") => {
    if (collabValues && Object.prototype.hasOwnProperty.call(collabValues, field)) return collabValues[field];
    return dom[domKey].value.trim() || fallback;
  };
  return {
    date: dom.fieldDayDate.value || day.date || "",
    title: textValue("title", "fieldDayTitle", day.title || day.label) || day.label,
    route: textValue("route", "fieldDayRoute", "待填写路线") || "待填写路线",
    weather: textValue("weather", "fieldDayWeather", "天气待确认") || "天气待确认",
    transport: textValue("transport", "fieldDayTransport", "交通待规划") || "交通待规划",
  };
}

function dayEditorDraftChange(day = currentDay()) {
  if (!day) return { draft: {}, patch: {} };
  const draft = dayEditorDraftValues(day);
  const patch = {};
  ["date", "title", "route", "weather", "transport"].forEach((field) => {
    if (!sameSerialized(day[field], draft[field])) patch[field] = draft[field];
  });
  return { draft, patch };
}

function applyDayEditorDraftToState(nextValues = null) {
  const day = currentDay();
  if (!day) return null;
  const previousDate = day.date || state.startDate || formatIsoDate(new Date());
  const draft = nextValues || dayEditorDraftValues(day);
  const changed = ["date", "title", "route", "weather", "transport"].some((field) => day[field] !== draft[field]);
  if (!changed) return null;
  Object.assign(day, draft);
  if (day.date !== previousDate) {
    const changedDate = parseIsoDate(day.date);
    const nextStartDate = changedDate ? formatIsoDate(addDays(changedDate, -activeDay)) : state.startDate;
    reflowPlanDates(state, nextStartDate);
  } else {
    resequencePlanDays();
  }
  return clone(currentDay());
}

function renderTimeline() {
  const day = currentDay();
  const editable = canEdit();
  dom.timeline.innerHTML = day.stops
    .map(
      (stop, index) => {
        const stopImage = displayImageForStop(stop) || missingPlaceImagePlaceholder(stop);
        const stopFallback = displayFallbackImageForStop(stop) || missingPlaceImagePlaceholder(stop);
        const stopTrustedImage = hasVerifiedPlaceImage(stop) && cleanImageUrl(stop.image) === cleanImageUrl(stopImage);
        const stopImageQueue = encodeImageCandidateUrls(imageCandidateUrlsForStop(stop, stopImage));
        const commentRoots = commentRootsAndReplies(stop.comments || []).roots;
        const recentComments = commentRoots.slice(-2);
        const commentPreview = recentComments.length
          ? recentComments
            .map((comment) => `<span><strong>${escapeHtml(comment.author || "我")}</strong>${escapeHtml(comment.text)}</span>`)
            .join("")
          : `<span class="stop-comment-empty">还没有注释</span>`;
        const disabledAttr = editable ? "" : " disabled";
        scheduleSpecificImageForStop(stop, { render: true, reason: "specific-image-timeline-card" });
        return `
        <article class="stop-card ${index === activeStop ? "is-active" : ""}" data-stop="${index}">
          <label class="stop-time-control">
            <span>时间</span>
            <input class="stop-time-input" data-stop-time-index="${index}" value="${escapeHtml(stop.time || "")}" placeholder="--:--"${disabledAttr}>
          </label>
          <img class="stop-photo" src="${escapeHtml(stopImage)}" data-fallback-src="${escapeHtml(stopFallback)}" data-image-candidates="${escapeHtml(stopImageQueue)}" data-trusted-src="${stopTrustedImage ? "true" : "false"}" alt="" loading="lazy" aria-hidden="true">
          <div class="stop-card-main">
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
            ${editable ? `<button type="button" class="icon-btn subtle danger-icon stop-delete-btn" data-delete-stop-index="${index}" aria-label="删除${escapeHtml(stop.title || "地点")}" title="删除地点">${icon("trash-2")}</button>` : ""}
          </div>
          <div class="stop-card-comments">
            <div class="stop-comment-preview">${commentPreview}</div>
            ${
              editable
                ? `<form class="stop-comment-form" data-stop-card-comment="${index}">
                    <input type="text" data-stop-card-comment-input placeholder="给这个景点加注释">
                    <button type="button" class="icon-btn subtle" data-submit-stop-card-comment="${index}" title="添加注释">${icon("send")}</button>
                  </form>`
                : ""
            }
          </div>
        </article>
      `;
      },
    )
    .join("");
  bindImageFallbacks(dom.timeline);
}

function renderMap() {
  const day = currentDay();
  if (!hasAmapJsConfig()) {
    destroyAmapMap();
    renderFallbackMap(day);
    return;
  }
  if (!amapMap) renderFallbackMap(day);
  scheduleAmapRender(day);
}

function renderDetail() {
  const stop = currentStop();
  if (!stop) return;
  applyPlacePhotoDisplay(stop);
  scheduleSpecificImageForStop(stop, { render: false, reason: "specific-image-detail" });
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
    if (dom.fieldBudgetSelected) dom.fieldBudgetSelected.checked = stop.budgetSelected !== false;
    dom.fieldLng.value = stop.lng || "";
    dom.fieldLat.value = stop.lat || "";
    dom.fieldImage.value = stop.image || "";
    if (dom.fieldReferenceUrl) dom.fieldReferenceUrl.value = stop.referenceUrl || "";
    dom.fieldTags.value = (stop.tags || []).join(", ");
  }
  const detailKeyword = dom.fieldAmapKeyword.value || stop.title;
  dom.fieldAmapLink.href = amapSearchUrl(detailKeyword);
  dom.fieldAmapLink.textContent = `在高德搜索：${detailKeyword}`;
  if (dom.officialImageSearchLink) {
    dom.officialImageSearchLink.href = officialImageSearchUrl({ ...stop, title: dom.fieldTitle.value || stop.title, address: dom.fieldAddress.value || stop.address, amapKeyword: detailKeyword });
  }
  const referenceUrl = candidateReferenceUrl({ ...stop, referenceUrl: dom.fieldReferenceUrl?.value || stop.referenceUrl });
  if (dom.fieldReferenceLink) {
    dom.fieldReferenceLink.href = referenceUrl;
    dom.fieldReferenceLink.textContent = "打开参考介绍链接";
  }

  renderStopComments(stop);
}

function switchActiveStop(nextStopIndex, options = {}) {
  const day = currentDay();
  if (!day) return false;
  const stopCount = (day.stops || []).length;
  if (!stopCount) return false;
  const index = Math.max(0, Math.min(Number(nextStopIndex) || 0, stopCount - 1));
  const changed = activeStop !== index;
  activeStop = index;
  renderTimeline();
  renderMap();
  renderDetail();
  renderEditorLockState();
  bindCollabTextDoc();
  renderTextPresence();
  if (options.activities !== false) renderActivities();
  refreshIcons();
  if (options.track !== false) trackPresence();
  return changed;
}

function renderCandidates() {
  const editable = canEdit();
  if (editingCandidateId && !(state.candidates || []).some((item) => item.id === editingCandidateId)) {
    setCandidateEditing(null);
  }
  dom.candidateGrid.innerHTML = state.candidates
    .map(
      (stop, index) => {
        const selected = Boolean(stop.selected);
        const estimatedTicket = inferTicketPrice(stop);
        const category = budgetCategoryForItem(stop);
        const paid = numberValue(stop.paid);
        const payer = stop.payer ? ` · ${escapeHtml(stop.payer)}` : "";
        const amountText = money(numberValue(stop.budget) || estimatedTicket);
        const estimateText = !numberValue(stop.budget) && estimatedTicket ? " 估" : "";
        const remoteEditors = remoteRecordEditorNames("candidate", stop.id);
        const candidateImage = displayImageForStop(stop) || missingPlaceImagePlaceholder(stop);
        const candidateFallback = displayFallbackImageForStop(stop) || missingPlaceImagePlaceholder(stop);
        const candidateMissingImage = !isDynamicPlaceImageCandidate(candidateImage) && shouldLookupSpecificStopImage(stop);
        const candidateTrustedImage = hasVerifiedPlaceImage(stop) && cleanImageUrl(stop.image) === cleanImageUrl(candidateImage);
        const candidateImageQueue = encodeImageCandidateUrls(imageCandidateUrlsForStop(stop, candidateImage));
        const referenceUrl = candidateReferenceUrl(stop);
        scheduleSpecificImageForStop(stop, { render: true, reason: "specific-image-candidate-card" });
        return `
        <article class="candidate ${stop.id === editingCandidateId ? "is-editing" : ""}${selected ? " is-selected" : ""}${remoteEditors ? " is-remote-editing" : ""}${candidateMissingImage ? " is-missing-image" : ""}" data-candidate="${index}" data-candidate-id="${escapeHtml(stop.id || "")}" role="button" tabindex="${editable ? "0" : "-1"}" aria-disabled="${editable ? "false" : "true"}">
          <img class="candidate-photo" src="${escapeHtml(candidateImage)}" data-fallback-src="${escapeHtml(candidateFallback)}" data-image-candidates="${escapeHtml(candidateImageQueue)}" data-trusted-src="${candidateTrustedImage ? "true" : "false"}" alt="" loading="lazy" aria-hidden="true">
          <span class="candidate-main">
            <span class="candidate-kicker">${icon(category === "住宿" ? "bed-double" : category === "餐饮" ? "utensils" : category === "交通" ? "train-front" : "landmark")}${escapeHtml(category)}</span>
            <span class="candidate-title">${escapeHtml(stop.title)}</span>
            <span class="candidate-meta">${selected ? "已预选" : "可加入当天"}${paid ? ` · 已付 ${money(paid)}${payer}` : ""}</span>
            ${remoteEditors ? `<span class="record-presence">${escapeHtml(remoteEditors)} 正在编辑</span>` : ""}
            <a class="candidate-reference" href="${escapeHtml(referenceUrl)}" target="_blank" rel="noopener" aria-label="查看${escapeHtml(stop.title)}参考介绍">${icon("external-link")}参考介绍</a>
          </span>
          <span class="candidate-price">${amountText}${estimateText}</span>
          ${editable ? `<span class="candidate-actions">
            <button type="button" class="icon-btn subtle" data-toggle-candidate-selected="${escapeHtml(stop.id)}" aria-label="${selected ? "移出预选" : "加入预选"}" title="${selected ? "移出预选" : "加入预选"}">${icon(selected ? "check-circle-2" : "circle")}</button>
            <button type="button" class="icon-btn subtle" data-edit-candidate="${escapeHtml(stop.id)}" aria-label="编辑备选">${icon("pencil")}</button>
            <button type="button" class="icon-btn subtle danger-icon" data-delete-candidate="${escapeHtml(stop.id)}" aria-label="移除备选">${icon("trash-2")}</button>
          </span>` : ""}
        </article>
      `;
      },
    )
    .join("");
  bindImageFallbacks(dom.candidateGrid);
}

function serviceBoardItems(kind = "") {
  const items = [];
  (state.days || []).forEach((day, dayIndex) => {
    (day.stops || []).forEach((stop, stopIndex) => {
      if (serviceKindFromItem(stop) !== kind) return;
      items.push({
        source: "stop",
        day,
        dayIndex,
        stop,
        stopIndex,
        selected: stop.budgetSelected !== false,
      });
    });
  });
  (state.candidates || []).forEach((stop, candidateIndex) => {
    if (serviceKindFromItem(stop) !== kind) return;
    items.push({
      source: "candidate",
      stop,
      candidateIndex,
      selected: Boolean(stop.selected),
    });
  });
  return items;
}

function renderServiceBoard(kind = "") {
  const container = kind === "lodging" ? dom.lodgingBoard : dom.diningBoard;
  if (!container) return 0;
  const editable = canEdit();
  const items = serviceBoardItems(kind);
  const label = serviceKindLabel(kind);
  if (!items.length) {
    container.innerHTML = `<p class="empty-state">还没有${label}。可以点“推荐”生成候选，或点“添加/导入”录入真实预订。</p>`;
    return 0;
  }
  container.innerHTML = items
    .map((entry) => {
      const stop = entry.stop;
      const title = stop.title || label;
      const sourceText = entry.source === "stop"
        ? `${entry.day?.label || `D${entry.dayIndex + 1}`} · 已排入行程`
        : "备选池";
      const paid = numberValue(stop.paid);
      const budget = numberValue(stop.budget) || inferTicketPrice(stop);
      const payer = stop.payer ? ` · ${escapeHtml(stop.payer)}` : "";
      const amount = budget || paid;
      const meta = [
        sourceText,
        stop.time || "",
        stop.address || stop.amapKeyword || "",
      ].filter(Boolean).join(" · ");
      const action = entry.source === "candidate"
        ? `
          <button type="button" class="icon-btn subtle" data-service-toggle-candidate="${escapeHtml(stop.id || "")}" title="${entry.selected ? "移出预选" : "加入预选"}">${icon(entry.selected ? "check-circle-2" : "circle")}</button>
          <button type="button" class="icon-btn subtle" data-service-edit-candidate="${escapeHtml(stop.id || "")}" title="编辑">${icon("pencil")}</button>
          <button type="button" class="icon-btn subtle" data-service-add-candidate="${escapeHtml(stop.id || "")}" title="加入当天">${icon("calendar-plus")}</button>
        `
        : `<button type="button" class="icon-btn subtle" data-service-focus-stop="${entry.dayIndex}:${entry.stopIndex}" title="查看行程地点">${icon("locate-fixed")}</button>`;
      return `
        <article class="service-card${entry.selected ? " is-selected" : ""}">
          <span class="service-icon">${icon(serviceKindIcon(kind))}</span>
          <div>
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(meta)}</span>
            <small>${amount ? `${money(amount)}${paid ? ` · 已付 ${money(paid)}${payer}` : ""}` : "金额待确认"}</small>
          </div>
          ${editable ? `<div class="service-card-actions">${action}</div>` : ""}
        </article>
      `;
    })
    .join("");
  return items.length;
}

function renderStayFoodBoards() {
  const lodgingCount = renderServiceBoard("lodging");
  const diningCount = renderServiceBoard("dining");
  if (dom.stayFoodSummary) dom.stayFoodSummary.textContent = `${lodgingCount} 项住宿 · ${diningCount} 项餐饮`;
}

function renderActivities() {
  const list = normalizeActivities(state.activities || []);
  const counts = list.reduce((result, item) => {
    result.all += 1;
    result[item.type] = (result[item.type] || 0) + 1;
    return result;
  }, { all: 0 });
  if (activityFilter !== "all" && !counts[activityFilter]) activityFilter = "all";
  if (dom.activityFilters) {
    dom.activityFilters.innerHTML = ACTIVITY_FILTERS.map((filter) => `
      <button type="button" class="activity-filter${activityFilter === filter.value ? " is-active" : ""}" data-activity-filter="${filter.value}">
        ${filter.label}<span>${counts[filter.value] || 0}</span>
      </button>
    `).join("");
  }
  const visibleList = list.filter((item) => activityFilter === "all" || item.type === activityFilter);
  dom.activityList.innerHTML = visibleList
    .map((item) => {
      const entry = typeof item === "string" ? { text: item, at: "刚刚" } : item;
      const type = entry.type || inferActivityType(entry.text || "");
      const target = activityTargetForType(type);
      const detailTarget = entry.target ? encodeURIComponent(JSON.stringify(entry.target)) : "";
      return `<button type="button" class="activity-item" data-activity-type="${escapeHtml(type)}" data-activity-target="${escapeHtml(target)}" data-activity-detail="${escapeHtml(detailTarget)}"><span class="avatar a1">${escapeHtml((ACTIVITY_TYPE_LABELS[type] || "记").slice(0, 1))}</span><p><span class="activity-type">${escapeHtml(ACTIVITY_TYPE_LABELS[type] || "记录")}</span>${escapeHtml(entry.text)}<br><small>${escapeHtml(entry.at || "")}${entry.createdBy ? ` · ${escapeHtml(entry.createdBy)}` : ""}</small></p></button>`;
    })
    .join("") || `<div class="member-empty">${activityFilter === "all" ? "还没有操作记录。" : "当前类型暂无记录。"}</div>`;
}

function focusActivityTarget(targetSelector = "") {
  const target = targetSelector ? document.querySelector(targetSelector) : null;
  if (!target) {
    dom.saveState.textContent = "暂时无法定位这条记录";
    return false;
  }
  pulseActivityTarget(target);
  dom.saveState.textContent = "已定位到相关区域";
  return true;
}

function pulseActivityTarget(target, options = {}) {
  if (!target) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  if (options.focus && typeof target.focus === "function") target.focus({ preventScroll: true });
  return true;
}

function parseActivityDetail(value = "") {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

function focusActivityDetail(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  if (detail.commentId && focusCommentIndexItem(detail.commentId)) {
    dom.saveState.textContent = "已定位到活动对应批注";
    return true;
  }
  if (detail.commentId && detail.deleted && focusDeletedCommentActivityTarget(detail)) return true;
  if ((detail.type === "dayBlock" || detail.blockId) && focusDayBlockActivityTarget(detail)) return true;
  if ((detail.type === "transportQuote" || detail.quoteId) && focusTransportQuoteActivityTarget(detail)) return true;
  if ((detail.type === "candidate" || detail.candidateId) && focusCandidateActivityTarget(detail)) return true;
  if (detail.type === "budgetSetting" && focusBudgetSettingActivityTarget(detail)) return true;
  if (detail.type === "planMeta" && focusPlanMetaActivityTarget(detail)) return true;
  if ((detail.type === "stop" || detail.stopId) && focusStopActivityTarget(detail)) return true;
  if ((detail.type === "day" || detail.dayId) && focusDayActivityTarget(detail)) return true;
  return false;
}

function dayActivityTarget(dayId = "", extra = {}) {
  return {
    type: "day",
    dayId: dayId || "",
    ...extra,
  };
}

function stopActivityTarget(dayId = "", stopId = "", extra = {}) {
  return {
    type: "stop",
    dayId: dayId || "",
    stopId: stopId || "",
    ...extra,
  };
}

function candidateActivityTarget(candidateId = "", extra = {}) {
  return {
    type: "candidate",
    candidateId: candidateId || "",
    ...extra,
  };
}

function transportQuoteActivityTarget(quoteId = "", dayId = "", extra = {}) {
  return {
    type: "transportQuote",
    quoteId: quoteId || "",
    dayId: dayId || "",
    ...extra,
  };
}

function budgetSettingActivityTarget(field = "", extra = {}) {
  return {
    type: "budgetSetting",
    field: field || "",
    ...extra,
  };
}

function planMetaActivityTarget(field = "", extra = {}) {
  return {
    type: "planMeta",
    field: field || "",
    ...extra,
  };
}

function focusDayActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  let dayIndex = state.days.findIndex((day) => detail.dayId && day.id === detail.dayId);
  if (dayIndex < 0 && detail.deleted && state.days.length) {
    const fallbackIndex = Number.isFinite(Number(detail.fallbackIndex)) ? Number(detail.fallbackIndex) : activeDay;
    dayIndex = Math.max(0, Math.min(fallbackIndex, state.days.length - 1));
  }
  if (dayIndex < 0) return false;
  if (dayIndex === activeDay) {
    const target = document.querySelector(`[data-day="${CSS.escape(String(dayIndex))}"]`) || document.querySelector(".day-editor-panel") || dom.dayList;
    if (!target) return false;
    pulseActivityTarget(target);
    renderActivities();
    dom.saveState.textContent = detail.deleted ? "日期已删除，已定位到相邻日期" : "已定位到活动对应日期";
    return true;
  }
  activeDay = dayIndex;
  activeStop = 0;
  render();
  const target = document.querySelector(`[data-day="${CSS.escape(String(dayIndex))}"]`) || document.querySelector(".day-editor-panel") || dom.dayList;
  if (!target) return false;
  pulseActivityTarget(target);
  dom.saveState.textContent = detail.deleted ? "日期已删除，已定位到相邻日期" : "已定位到活动对应日期";
  return true;
}

function focusStopActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  const dayIndex = state.days.findIndex((day) => {
    if (detail.dayId && day.id === detail.dayId) return true;
    return detail.stopId && (day.stops || []).some((stop) => stop.id === detail.stopId);
  });
  if (dayIndex < 0) return false;
  const day = state.days[dayIndex];
  const stopIndex = (day.stops || []).findIndex((stop) => detail.stopId && stop.id === detail.stopId);
  if (dayIndex === activeDay && (stopIndex < 0 || stopIndex === activeStop)) {
    if (stopIndex >= 0) activeStop = stopIndex;
    const target = stopIndex >= 0
      ? dom.timeline?.querySelector(`[data-stop="${CSS.escape(String(stopIndex))}"]`) || document.querySelector(".editor-panel")
      : dom.timeline || document.querySelector(".editor-panel");
    if (!target) return false;
    pulseActivityTarget(target);
    renderActivities();
    dom.saveState.textContent = stopIndex >= 0 ? "已定位到活动对应地点" : "地点已不存在，已定位到原日期时间线";
    return true;
  }
  if (dayIndex === activeDay && stopIndex >= 0) {
    switchActiveStop(stopIndex, { activities: true });
    const target = dom.timeline?.querySelector(`[data-stop="${CSS.escape(String(stopIndex))}"]`) || document.querySelector(".editor-panel");
    if (!target) return false;
    pulseActivityTarget(target);
    dom.saveState.textContent = "已定位到活动对应地点";
    return true;
  }
  activeDay = dayIndex;
  activeStop = stopIndex >= 0 ? stopIndex : 0;
  render();
  const target = stopIndex >= 0
    ? dom.timeline?.querySelector(`[data-stop="${CSS.escape(String(stopIndex))}"]`) || document.querySelector(".editor-panel")
    : dom.timeline || document.querySelector(".editor-panel");
  if (!target) return false;
  pulseActivityTarget(target);
  dom.saveState.textContent = stopIndex >= 0 ? "已定位到活动对应地点" : "地点已不存在，已定位到原日期时间线";
  return true;
}

function focusCandidateActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  const candidateId = String(detail.candidateId || "");
  renderCandidates();
  const candidate = candidateId ? dom.candidateGrid?.querySelector(`[data-candidate-id="${CSS.escape(candidateId)}"]`) : null;
  const target = candidate || document.querySelector(".candidate-panel");
  if (!target) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  dom.saveState.textContent = candidate ? "已定位到活动对应备选地点" : "备选已不存在，已定位到备选池";
  return true;
}

function focusTransportQuoteActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  const dayIndex = state.days.findIndex((day) => detail.dayId && day.id === detail.dayId);
  if (dayIndex >= 0 && dayIndex !== activeDay) {
    activeDay = dayIndex;
    activeStop = 0;
    transportFilterApplied = true;
    render();
  } else {
    transportFilterApplied = true;
    renderTransport();
    renderActivities();
    refreshIcons();
  }
  const quoteId = String(detail.quoteId || "");
  const quote = quoteId ? dom.transportList?.querySelector(`[data-quote="${CSS.escape(quoteId)}"]`) : null;
  const target = quote || document.querySelector(".transport-panel");
  if (!target) return false;
  pulseActivityTarget(target);
  dom.saveState.textContent = quote ? "已定位到活动对应交通报价" : "报价已不存在，已定位到交通面板";
  return true;
}

function focusBudgetSettingActivityTarget(detail = null) {
  renderShell();
  const fieldTarget = detail?.field === "partySize" ? dom.partySizeInput : detail?.field === "budgetLimit" ? dom.budgetLimitInput : null;
  const target = fieldTarget || document.querySelector(".budget-tools") || dom.budgetSettlement;
  if (!target) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  fieldTarget?.focus();
  dom.saveState.textContent = "已定位到活动对应预算设置";
  return true;
}

function focusPlanMetaActivityTarget(detail = null) {
  syncGuideStateFromPlan();
  renderGuideResult();
  const fieldTarget = {
    destination: dom.destinationInput,
    origin: dom.originInput,
    startDate: dom.startDateInput,
    endDate: dom.endDateInput,
    dateRange: dom.startDateInput,
  }[detail?.field] || null;
  const target = fieldTarget || document.querySelector(".guide-controls");
  if (!target) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  fieldTarget?.focus();
  dom.saveState.textContent = "已定位到活动对应计划基础信息";
  return true;
}

function focusDeletedCommentActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  if (detail.scope === "block" && focusDayBlockActivityTarget({ type: "dayBlock", dayId: detail.dayId || "", blockId: detail.blockId || "", deletedComment: true })) {
    dom.saveState.textContent = "批注已删除，已定位到原协作块";
    return true;
  }
  const dayIndex = state.days.findIndex((day) => (detail.dayId && day.id === detail.dayId) || (detail.stopId && (day.stops || []).some((stop) => stop.id === detail.stopId)));
  if (dayIndex < 0) return false;
  if (dayIndex === activeDay) {
    if (detail.scope === "day") {
      renderDayComments(currentDay());
      renderCommentIndex();
      renderActivities();
      refreshIcons();
      const target = document.querySelector(".comment-index-panel") || document.querySelector(".day-comments-panel");
      if (!target) return false;
      pulseActivityTarget(target);
      dom.saveState.textContent = "批注已删除，已定位到当天批注总览";
      return true;
    }
    if (detail.scope === "stop") {
      const day = state.days[dayIndex];
      const stopIndex = (day.stops || []).findIndex((stop) => stop.id === detail.stopId);
      if (stopIndex >= 0 && stopIndex === activeStop) {
        renderStopComments(currentStop());
        renderCommentIndex();
        renderActivities();
        refreshIcons();
        const target = dom.commentList || document.querySelector(".comments-panel") || document.querySelector(".editor-panel");
        if (!target) return false;
        pulseActivityTarget(target);
        dom.saveState.textContent = "评论已删除，已定位到原地点评论区";
        return true;
      }
    }
  }
  activeDay = dayIndex;
  if (detail.scope === "stop") {
    const day = state.days[dayIndex];
    const stopIndex = (day.stops || []).findIndex((stop) => stop.id === detail.stopId);
    activeStop = stopIndex >= 0 ? stopIndex : 0;
  } else {
    activeStop = 0;
  }
  render();
  const target = detail.scope === "day" ? document.querySelector(".comment-index-panel") : dom.commentList || document.querySelector(".editor-panel");
  if (!target) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  dom.saveState.textContent = detail.scope === "day" ? "批注已删除，已定位到当天批注总览" : "评论已删除，已定位到原地点评论区";
  return true;
}

function dayBlockActivityTarget(dayId = "", blockId = "", extra = {}) {
  return {
    type: "dayBlock",
    dayId: dayId || "",
    blockId: blockId || "",
    ...extra,
  };
}

function focusDayBlockElement(blockId = "", options = {}) {
  const block = blockId ? dom.dayBlockList?.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`) : null;
  const target = block || document.querySelector(".day-blocks-panel");
  if (!target) return false;
  target.scrollIntoView({ block: options.block || "center", behavior: options.behavior || "smooth" });
  target.classList.add("activity-target-pulse");
  window.setTimeout(() => target.classList.remove("activity-target-pulse"), 1300);
  if (options.focusInput !== false) {
    const input = block?.querySelector("[data-edit-day-block]");
    input?.focus();
  }
  return Boolean(block);
}

function focusDayBlockActivityTarget(detail = null) {
  if (!detail || typeof detail !== "object") return false;
  const blockId = detail.blockId || "";
  const dayIndex = state.days.findIndex((day) => {
    if (detail.dayId && day.id === detail.dayId) return true;
    return blockId && normalizeDayBlocks(day.blocks || []).some((block) => block.id === blockId);
  });
  if (dayIndex < 0) return false;
  if (dayIndex === activeDay) {
    activeStop = 0;
    activeBlockPresenceId = blockId || activeBlockPresenceId;
    const focusedBlock = focusDayBlockElement(blockId);
    if (focusedBlock || !blockId) {
      refreshDayBlockPresenceDom(currentDay());
      renderActivities();
      dom.saveState.textContent = focusedBlock ? "已定位到活动对应协作块" : "协作块已不存在，已定位到当天协作块区域";
      return true;
    }
  }
  activeDay = dayIndex;
  activeStop = 0;
  activeBlockPresenceId = blockId || activeBlockPresenceId;
  render();
  const focusedBlock = focusDayBlockElement(blockId);
  dom.saveState.textContent = focusedBlock ? "已定位到活动对应协作块" : "协作块已不存在，已定位到当天协作块区域";
  return true;
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

function renderDateScoutResults() {
  if (!dom.dateScoutResults) return;
  if (!dateScoutOptions.length) {
    dom.dateScoutResults.innerHTML = `<p class="empty-state">先输入目的地和出发城市，再筛选适合出游的日期。</p>`;
    if (dom.dateScoutStatus) dom.dateScoutStatus.textContent = "按天气和交通成本给出候选";
    return;
  }
  const best = dateScoutOptions[0];
  if (dom.dateScoutStatus) {
    dom.dateScoutStatus.textContent = `推荐 ${formatDisplayDate(best.startDate)} 出发 · 综合 ${best.score} 分`;
  }
  dom.dateScoutResults.innerHTML = dateScoutOptions
    .map((option, index) => {
      const selected = option.id === selectedDateScoutId;
      const confidenceText = option.flight?.confidence === "live"
        ? "实时航班"
        : option.flight?.confidence === "demo"
          ? "代理示例"
          : "估算";
      const flightText = option.flight?.price
        ? `${money(option.flight.price)} · ${escapeHtml(option.flight.code || "航班")} ${escapeHtml(option.flight.depart || "")}${option.flight.arrive ? `-${escapeHtml(option.flight.arrive)}` : ""}`
        : "票价待查询";
      return `
        <article class="date-scout-card${selected ? " is-selected" : ""}" data-date-scout="${escapeHtml(option.id)}">
          <div>
            <b>${index === 0 ? "推荐" : `候选 ${index + 1}`}</b>
            <strong>${escapeHtml(formatDisplayDate(option.startDate))} - ${escapeHtml(formatDisplayDate(option.endDate))}</strong>
            <span>${option.days} 天 · 天气 ${option.weatherScore} 分 · 综合 ${option.score} 分</span>
          </div>
          <div>
            <em>${flightText}</em>
            <span>${confidenceText} · ${escapeHtml(option.weatherText || "天气待确认")}</span>
          </div>
          <button type="button" class="text-btn" data-apply-date-scout="${escapeHtml(option.id)}">${selected ? "已采用" : "采用日期"}</button>
        </article>
      `;
    })
    .join("");
  refreshIcons();
}

function clearDateScoutResults(message = "按天气和交通成本给出候选") {
  dateScoutOptions = [];
  selectedDateScoutId = "";
  if (dom.dateScoutStatus) dom.dateScoutStatus.textContent = message;
  renderDateScoutResults();
}

function applyDateScoutOption(optionId = "") {
  const option = dateScoutOptions.find((item) => item.id === optionId);
  if (!option) return;
  selectedDateScoutId = option.id;
  guideState.startDate = option.startDate;
  guideState.endDate = option.endDate;
  if (dom.startDateInput) dom.startDateInput.value = option.startDate;
  if (dom.endDateInput) dom.endDateInput.value = option.endDate;
  if (dom.dateScoutDays) dom.dateScoutDays.value = option.days;
  state.startDate = option.startDate;
  state.endDate = option.endDate;
  state.dateRange = dateRangeText(option.startDate, option.endDate);
  renderGuideResult();
  renderShell();
  renderDateScoutResults();
  schedulePlanMetaPatchInputSync("dateScout", {
    startDate: option.startDate,
    endDate: option.endDate,
    dateRange: dateRangeText(option.startDate, option.endDate),
  }, "采用出游日期", "startDate");
}

function flowCompletion() {
  const hasPlan = Boolean(state.destination && state.days?.length && !/^京都\s*6\s*日/.test(state.name || ""));
  const stopCount = (state.days || []).reduce((sum, day) => sum + (day.stops || []).filter((stop) => !/待填写地点|新地点/.test(stop.title || "")).length, 0);
  const hasBooking = Boolean((state.transportQuotes || []).some((item) => item.selected) || serviceBoardItems("lodging").length || serviceBoardItems("dining").length);
  const hasBudget = Boolean(numberValue(state.budgetLimit) || (state.candidates || []).some((item) => item.selected) || (state.activities || []).length > 1);
  return {
    setup: hasPlan,
    itinerary: hasPlan && stopCount > 1,
    booking: hasBooking,
    budget: hasBudget,
    share: Boolean(tripId),
  };
}

function defaultFlowStep(completion = flowCompletion()) {
  return completion.setup ? "itinerary" : "setup";
}

function saveFlowUi() {
  localStorage.setItem(FLOW_UI_KEY, JSON.stringify(flowUi));
}

function setFlowStep(stepId = "", options = {}) {
  if (!FLOW_STEPS.some((step) => step.id === stepId)) return;
  flowUi.step = stepId;
  flowUi.pinned = options.pinned !== false;
  if (typeof options.showAll === "boolean") flowUi.showAll = options.showAll;
  saveFlowUi();
  renderFlow();
}

function renderFlow() {
  if (!dom.flowSteps) return;
  const completion = flowCompletion();
  const validStepIds = new Set(FLOW_STEPS.map((step) => step.id));
  const firstIncompleteIndex = FLOW_STEPS.findIndex((step) => !completion[step.id]);
  const maxUnlockedIndex = firstIncompleteIndex === -1 ? FLOW_STEPS.length - 1 : firstIncompleteIndex;
  const currentIndex = FLOW_STEPS.findIndex((step) => step.id === flowUi.step);
  if (!flowUi.pinned || !validStepIds.has(flowUi.step)) flowUi.step = defaultFlowStep(completion);
  if (currentIndex > maxUnlockedIndex) flowUi.step = FLOW_STEPS[maxUnlockedIndex].id;
  const activeStep = FLOW_STEPS.find((step) => step.id === flowUi.step) || FLOW_STEPS[0];
  document.body.classList.toggle("guided-flow", true);
  document.body.classList.toggle("flow-show-all", Boolean(flowUi.showAll));
  FLOW_STEPS.flatMap((step) => step.selectors).forEach((selector) => {
    document.querySelectorAll(selector).forEach((panel) => {
      const belongsToActive = activeStep.selectors.includes(selector);
      panel.classList.toggle("flow-stage-hidden", !flowUi.showAll && !belongsToActive);
      panel.classList.toggle("flow-stage-dimmed", flowUi.showAll && !belongsToActive);
    });
  });
  const hasVisibleDetailPanel = activeStep.selectors.some((selector) => [".map-panel", ".place-detail", ".editor-panel", ".comments-panel"].includes(selector));
  document.body.classList.toggle("flow-hide-detail", !flowUi.showAll && !hasVisibleDetailPanel);
  dom.flowTitle.textContent = activeStep.title;
  dom.flowHelper.textContent = activeStep.helper;
  const activeIndex = FLOW_STEPS.findIndex((step) => step.id === activeStep.id);
  const nextStep = FLOW_STEPS[activeIndex + 1] || null;
  const canContinue = Boolean(completion[activeStep.id]);
  if (dom.flowNextBtn) {
    dom.flowNextBtn.hidden = !nextStep;
    dom.flowNextBtn.disabled = !canContinue;
    dom.flowNextBtn.title = canContinue ? "" : "完成当前步骤后再进入下一步";
    dom.flowNextBtn.innerHTML = `${icon("arrow-right")}${nextStep ? `下一步：${escapeHtml(nextStep.title)}` : "已完成"}`;
  }
  dom.flowAdvancedToggle.innerHTML = `${icon(flowUi.showAll ? "panel-top-close" : "sliders-horizontal")}${flowUi.showAll ? "收起到当前步骤" : "显示全部"}`;
  dom.flowSteps.innerHTML = FLOW_STEPS.map((step, index) => {
    const done = Boolean(completion[step.id]);
    const active = step.id === activeStep.id;
    const locked = index > maxUnlockedIndex && !active;
    return `
      <button type="button" class="flow-step${active ? " is-active" : ""}${done ? " is-done" : ""}${locked ? " is-locked" : ""}" data-flow-step="${step.id}" ${locked ? "aria-disabled=\"true\"" : ""}>
        <span>${done ? "已完成" : active ? "当前" : `第 ${index + 1} 步`}</span>
        <strong>${escapeHtml(step.title)}</strong>
        <span>${escapeHtml(step.short)}</span>
      </button>
    `;
  }).join("");
}

function render() {
  activeDay = Math.min(activeDay, state.days.length - 1);
  activeStop = Math.min(activeStop, currentDay().stops.length - 1);
  stabilizeActiveStopForDetailImage();
  renderShell();
  renderDays();
  renderDaySummary();
  renderTransport();
  renderTimeline();
  renderMap();
  renderDetail();
  renderCandidates();
  renderStayFoodBoards();
  renderActivities();
  renderGuideResult();
  renderDateScoutResults();
  renderAmapRouteReport(currentDay()?.amapRoute || null);
  renderMembers();
  renderVersionHistory();
  renderCommentIndex();
  applyReadonlyUi();
  renderDayEditor();
  renderDayComments(currentDay());
  renderDayBlocks(currentDay());
  renderEditorLockState();
  renderFlow();
  bindCollabPlanDoc();
  bindCollabTextDoc();
  bindCollabDayTextDoc();
  refreshIcons();
}

function mutate(label, action, options = {}) {
  if (!requireEdit(label)) return false;
  if (options.requireUnlocked !== false && !requireStopUnlocked(label)) return false;
  saveVersionSnapshot(label);
  action();
  const activityTarget = typeof options.activityTarget === "function" ? options.activityTarget() : options.activityTarget;
  logActivity(label, activityTarget ? { target: activityTarget } : {});
  if (options.save !== false) saveState(label);
  if (options.render !== false) render();
  return true;
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
    blocks: [
      normalizeDayBlock({
        type: "todo",
        text: "补充当天关键预订、集合点或分工",
        createdBy: getCollabName(),
      }),
    ].filter(Boolean),
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

function quickPlaceDraft(extra = {}) {
  const name = dom.quickPlaceName.value.trim();
  if (!name) return null;
  const keyword = dom.quickAmapKeyword.value.trim() || `${state.destination || ""} ${name}`.trim();
  const locatedPlace = quickAmapPlace && (quickAmapPlace.keyword === keyword || quickAmapPlace.title === name) ? quickAmapPlace : null;
  const type = extra.type || quickTypeValue(dom.quickType?.value || "Scenic");
  const typeLabel = quickTypeLabel(type);
  return makeStop({
    time: dom.quickTime.value.trim() || "10:00",
    title: name,
    type,
    address: dom.quickAddress.value.trim() || locatedPlace?.address || keyword,
    note: extra.note || `从快速录入加入。类型：${typeLabel}。高德关键词：${keyword}`,
    tags: extra.tags || ["自定义", typeLabel, "待优化"],
    budget: Number(dom.quickBudget.value || 0),
    paid: Number(dom.quickPaid?.value || 0),
    payer: dom.quickPayer?.value.trim() || "",
    amapKeyword: keyword,
    lng: locatedPlace?.lng || "",
    lat: locatedPlace?.lat || "",
    x: extra.x ?? 50,
    y: extra.y ?? 50,
    image: locatedPlace?.image || state.cover || images.city,
    selected: Boolean(extra.selected ?? dom.quickSelected?.checked),
  });
}

async function moveDayByIndex(dayIndex = activeDay, direction = "down") {
  const fromIndex = Math.max(0, Math.min(Number(dayIndex) || 0, state.days.length - 1));
  const offset = direction === "up" ? -1 : 1;
  const toIndex = fromIndex + offset;
  if (toIndex < 0 || toIndex >= state.days.length) return false;
  const movingDay = state.days[fromIndex];
  const targetDay = state.days[toIndex];
  if (!movingDay || !targetDay) return false;
  if (!confirmRemoteDayEdit([movingDay.id || "", targetDay.id || ""], direction === "up" ? "上移当天" : "下移当天")) return false;
  let changed = false;
  if (!mutate(direction === "up" ? "上移当天" : "下移当天", () => {
    [state.days[fromIndex], state.days[toIndex]] = [state.days[toIndex], state.days[fromIndex]];
    activeDay = toIndex;
    activeStop = 0;
    reflowPlanDates();
    changed = true;
  }, { requireUnlocked: false, save: false, render: false, activityTarget: dayActivityTarget(movingDay.id || "", { action: direction === "up" ? "move-up" : "move-down" }) })) return false;
  if (!changed) return false;
  if (!(await reorderDayMetasInDoc(state.days, "local-day-reorder"))) {
    await syncDayMetasToDoc("local-day-reorder-fallback");
  }
  await syncPlanMetaToDoc("local-day-reorder-meta");
  await saveCollaborativePlanChange(direction === "up" ? "上移当天" : "下移当天");
  broadcastDaysReordered();
  render();
  return true;
}

async function rebuildStopTextState(stop) {
  if (!stop?.id) return "";
  let Y = yjsModule;
  if (!Y) {
    try {
      Y = await ensureYjs();
    } catch {
      return "";
    }
  }
  const textState = bytesToBase64(buildInitialTextUpdate(Y, stop));
  stop.textYjs = textState;
  stop.noteYjs = textState;
  return textState;
}

async function updateTimelineStopTime(stopIndex, nextTime = "") {
  const day = currentDay();
  const index = Math.max(0, Math.min(Number(stopIndex) || 0, (day?.stops || []).length - 1));
  const stop = day?.stops?.[index];
  const time = String(nextTime || "").trim();
  if (!day || !stop || stop.time === time) return false;
  if (!confirmRemoteStopEdit(stop.id, "修改行程时间")) return false;
  if (!mutate(`修改「${stop.title || "地点"}」时间`, () => {
    stop.time = time;
    if (index === activeStop && dom.fieldTime) dom.fieldTime.value = time;
    clearCurrentAmapRoute();
  }, { requireUnlocked: false, save: false, render: false, activityTarget: stopActivityTarget(day.id || "", stop.id || "", { action: "time" }) })) return false;
  if (!(await patchStopInDoc(stop.id, { time }, "local-timeline-stop-time"))) {
    await syncStopSnapshotToPlanDoc(stop.id, "local-timeline-stop-time-fallback");
  }
  await saveCollaborativeTextChange(`修改「${stop.title || "地点"}」时间`);
  render();
  return true;
}

async function addTimelineStopComment(stopIndex, text = "") {
  const day = currentDay();
  const index = Math.max(0, Math.min(Number(stopIndex) || 0, (day?.stops || []).length - 1));
  const stop = day?.stops?.[index];
  const commentText = String(text || "").trim();
  if (!day || !stop || !commentText) return false;
  if (!confirmRemoteStopEdit(stop.id, "添加景点注释")) return false;
  if (stop.id === currentStop()?.id) {
    const collaborativeComment = await addCollaborativeComment(commentText, null);
    if (collaborativeComment) {
      stop.comments = normalizeComments([...(stop.comments || []), collaborativeComment]);
      await syncStopSnapshotToPlanDoc(stop.id, "local-timeline-comment-snapshot");
      await saveCollaborativeTextChange(`注释「${stop.title || "地点"}」`);
      render();
      return true;
    }
  }
  const fallbackComment = normalizeCommentEntry({
    id: uid(),
    author: getCollabName(),
    text: commentText,
    at: new Date().toISOString(),
  });
  if (!fallbackComment) return false;
  if (!mutate(`注释「${stop.title || "地点"}」`, () => {
    stop.comments = normalizeComments([...(stop.comments || []), fallbackComment]);
  }, { requireUnlocked: false, save: false, render: false, activityTarget: stopActivityTarget(day.id || "", stop.id || "", { action: "comment" }) })) return false;
  await rebuildStopTextState(stop);
  await syncStopSnapshotToPlanDoc(stop.id, "local-timeline-comment-fallback-snapshot");
  await saveCollaborativeTextChange(`注释「${stop.title || "地点"}」`);
  render();
  return true;
}

async function submitTimelineStopCommentForm(form) {
  if (!form) return false;
  const input = form.querySelector("[data-stop-card-comment-input]");
  const text = input?.value.trim() || "";
  if (!text) return false;
  const saved = await addTimelineStopComment(Number(form.dataset.stopCardComment), text);
  if (saved && input) input.value = "";
  return saved;
}

dom.dayList.addEventListener("click", async (event) => {
  const moveButton = event.target.closest("[data-move-day-index]");
  if (moveButton) {
    event.preventDefault();
    event.stopPropagation();
    await moveDayByIndex(Number(moveButton.dataset.moveDayIndex), moveButton.dataset.moveDayDirection || "down");
    return;
  }
  const button = event.target.closest("[data-day]");
  if (!button) return;
  activeDay = Number(button.dataset.day);
  activeStop = 0;
  userSelectedStop = false;
  render();
  trackPresence();
});

dom.timeline.addEventListener("click", async (event) => {
  const commentSubmitButton = event.target.closest("[data-submit-stop-card-comment]");
  if (commentSubmitButton) {
    event.preventDefault();
    event.stopPropagation();
    await submitTimelineStopCommentForm(commentSubmitButton.closest("[data-stop-card-comment]"));
    return;
  }
  const deleteButton = event.target.closest("[data-delete-stop-index]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    await deleteStopAtIndex(Number(deleteButton.dataset.deleteStopIndex));
    return;
  }
  if (event.target.closest("input, textarea, button, a, select, label")) return;
  const card = event.target.closest("[data-stop]");
  if (!card) return;
  userSelectedStop = true;
  switchActiveStop(Number(card.dataset.stop));
});

dom.timeline.addEventListener("pointerdown", async (event) => {
  const commentSubmitButton = event.target.closest("[data-submit-stop-card-comment]");
  if (!commentSubmitButton) return;
  event.preventDefault();
  event.stopPropagation();
  await submitTimelineStopCommentForm(commentSubmitButton.closest("[data-stop-card-comment]"));
});

dom.timeline.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-stop-time-index]");
  if (!input) return;
  await updateTimelineStopTime(Number(input.dataset.stopTimeIndex), input.value);
});

dom.timeline.addEventListener("focusout", async (event) => {
  const input = event.target.closest("[data-stop-time-index]");
  if (!input) return;
  await updateTimelineStopTime(Number(input.dataset.stopTimeIndex), input.value);
});

dom.timeline.addEventListener("keydown", async (event) => {
  const commentInput = event.target.closest("[data-stop-card-comment-input]");
  if (commentInput && event.key === "Enter") {
    event.preventDefault();
    await submitTimelineStopCommentForm(commentInput.closest("[data-stop-card-comment]"));
    return;
  }
  const input = event.target.closest("[data-stop-time-index]");
  if (!input) return;
  if (event.key === "Enter") {
    event.preventDefault();
    await updateTimelineStopTime(Number(input.dataset.stopTimeIndex), input.value);
    input.blur();
  }
  if (event.key === "Escape") {
    const stop = currentDay()?.stops?.[Number(input.dataset.stopTimeIndex)];
    input.value = stop?.time || "";
    input.blur();
  }
});

dom.timeline.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-stop-card-comment]");
  if (!form) return;
  event.preventDefault();
  await submitTimelineStopCommentForm(form);
});

dom.mapCanvas.addEventListener("click", (event) => {
  const pin = event.target.closest("[data-stop]");
  if (!pin) return;
  userSelectedStop = true;
  switchActiveStop(Number(pin.dataset.stop));
});

document.addEventListener("click", (event) => {
  const budgetEstimateButton = event.target.closest("[data-apply-budget-estimate]");
  if (budgetEstimateButton) {
    applyBudgetEstimateFromToken(budgetEstimateButton.dataset.applyBudgetEstimate);
    return;
  }

  const stopBudgetButton = event.target.closest("[data-toggle-stop-budget]");
  if (stopBudgetButton) {
    toggleStopBudgetSelection(stopBudgetButton.dataset.toggleStopBudget);
    return;
  }

  const option = event.target.closest("[data-amap-place-index]");
  if (!option) return;
  const target = option.dataset.amapTarget || "quick";
  const container = target === "field" ? dom.fieldAmapCandidates : dom.quickAmapCandidates;
  const places = container?._amapPlaces || [];
  const place = places[Number(option.dataset.amapPlaceIndex)];
  if (!place) return;
  if (target === "field") {
    applyFieldAmapPlace(place, dom.fieldAmapKeyword.value.trim()).catch((error) => {
      dom.saveState.textContent = `高德候选回填失败：${error.message}`;
    });
  } else {
    applyQuickAmapPlace(place, dom.quickAmapKeyword.value.trim());
  }
});

dom.dayForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let updatedDay = null;
  const dayId = currentDay()?.id || "";
  const { draft: dayDraft, patch: dayPatch } = dayEditorDraftChange();
  if (!confirmRemoteDayEdit(dayId, "保存当天设置")) return;
  const changedDayTextFields = Object.keys(dayPatch)
    .filter((field) => field !== "date")
    .map((field) => `day:${field}`);
  if (!confirmRemoteTextFieldEdit(changedDayTextFields, "day", "保存当天设置")) return;
  const changed = mutate("保存当天设置", () => {
    updatedDay = applyDayEditorDraftToState(dayDraft);
  }, { requireUnlocked: false, save: false, render: false, activityTarget: dayActivityTarget(dayId, { action: "settings" }) });
  if (updatedDay) {
    if (Object.prototype.hasOwnProperty.call(dayPatch, "date")) {
      await syncDayMetasToDoc("local-day-date-update");
    } else {
      await patchDayMetaInDoc(dayId, dayPatch, "local-day-update-patch");
    }
    await syncPlanMetaToDoc("local-day-date-meta");
    await saveCollaborativeTextChange("保存当天设置");
    broadcastDayUpdated(updatedDay);
    render();
  } else if (changed) {
    render();
  }
});

async function syncDayEditorDraftChange({ silent = false } = {}) {
  if (!requireEdit("同步当天设置")) return;
  if (!silent) saveVersionSnapshot("同步当天设置前版本");
  const dayId = currentDay()?.id || "";
  const { draft: dayDraft, patch: dayPatch } = dayEditorDraftChange();
  const updatedDay = applyDayEditorDraftToState(dayDraft);
  if (!updatedDay) return;
  if (!silent) logActivity("同步当天设置", { target: dayActivityTarget(dayId, { action: "settings" }) });
  if (Object.prototype.hasOwnProperty.call(dayPatch, "date")) {
    await syncDayMetasToDoc("local-day-date-field-change");
  } else {
    await patchDayMetaInDoc(dayId, dayPatch, "local-day-field-change-patch");
  }
  await syncPlanMetaToDoc("local-day-field-change-meta");
  await saveCollaborativeTextChange(silent ? "当天设置正在协作同步" : "已同步当天设置");
  broadcastDayUpdated(updatedDay);
  if (silent) {
    renderShell();
    renderDays();
    renderDaySummary();
    renderAmapRouteReport(currentDay()?.amapRoute || null);
    refreshIcons();
  } else {
    render();
  }
}

dom.fieldDayDate?.addEventListener("change", syncDayEditorDraftChange);

COLLAB_DAY_TEXT_FIELDS.forEach(({ field, domKey }) => {
  dom[domKey]?.addEventListener("change", syncDayEditorDraftChange);
});

COLLAB_DAY_TEXT_FIELDS.forEach(({ field, domKey }) => {
  const control = dom[domKey];
  control?.addEventListener("input", () => {
    if (!canEdit() || isReadonlyMode) return;
    const meta = COLLAB_DAY_TEXT_FIELDS.find((item) => item.field === field);
    syncCollabDayTextFieldToDoc(meta?.docField || field, control.value);
    if (meta) captureCommentAnchor(meta);
    schedulePresenceTrack();
    clearTimeout(dayFieldSyncTimer);
    dayFieldSyncTimer = setTimeout(() => {
      syncDayEditorDraftChange({ silent: true });
    }, 1200);
  });
  ["focus", "click", "keyup", "select"].forEach((eventName) => {
    control?.addEventListener(eventName, () => {
      const meta = COLLAB_DAY_TEXT_FIELDS.find((item) => item.field === field);
      if (meta) captureCommentAnchor(meta);
      schedulePresenceTrack(eventName === "focus" ? 0 : 90);
    });
  });
  control?.addEventListener("blur", () => schedulePresenceTrack(180));
});

dom.addDayBtn.addEventListener("click", async () => {
  let createdDay = null;
  let createdIndex = 0;
  if (!mutate("新增一天", () => {
    createdIndex = activeDay + 1;
    createdDay = makeBlankDay(createdIndex);
    state.days.splice(createdIndex, 0, createdDay);
    activeDay = createdIndex;
    activeStop = 0;
    reflowPlanDates();
    createdDay = clone(state.days[createdIndex]);
  }, { requireUnlocked: false, save: false, render: false, activityTarget: () => dayActivityTarget(createdDay?.id || "", { action: "create" }) })) return;
  if (createdDay) {
    if (!(await addDayMetaToDoc(createdDay, createdIndex, "local-day-create"))) {
      await syncDayMetasToDoc("local-day-create-fallback");
    }
    await syncStopListToDoc(createdDay.id, "local-day-create-stops");
    await syncPlanMetaToDoc("local-day-create-meta");
    await saveCollaborativePlanChange("新增一天");
    broadcastDayCreated(createdDay, createdIndex);
    render();
  }
});

dom.deleteDayBtn.addEventListener("click", async () => {
  if (state.days.length <= 1) {
    dom.saveState.textContent = "计划至少保留一天";
    return;
  }
  const deletedDay = clone(currentDay());
  const deletedDayIndex = activeDay;
  const label = `删除「${deletedDay.title || deletedDay.label}」`;
  if (!confirmRemoteDayEdit(deletedDay.id, "删除当天")) return;
  if (!mutate(label, () => {
    state.days.splice(activeDay, 1);
    activeDay = Math.max(0, Math.min(activeDay, state.days.length - 1));
    activeStop = 0;
    destroyCollabTextDoc();
    reflowPlanDates();
  }, { requireUnlocked: false, save: false, render: false, activityTarget: dayActivityTarget(deletedDay.id || "", { deleted: true, fallbackIndex: deletedDayIndex }) })) return;
  if (!(await deleteDayFromDoc(deletedDay.id, "local-day-delete"))) {
    await syncDayMetasToDoc("local-day-delete-fallback");
    await syncStopListsToDoc("local-day-delete-stops-fallback");
  }
  await syncPlanMetaToDoc("local-day-delete-meta");
  await saveCollaborativePlanChange(label);
  broadcastDayDeleted(deletedDay, deletedDayIndex);
  render();
});

dom.moveDayUpBtn.addEventListener("click", async () => {
  await moveDayByIndex(activeDay, "up");
});

dom.moveDayDownBtn.addEventListener("click", async () => {
  await moveDayByIndex(activeDay, "down");
});

dom.stopForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let dayId = currentDay()?.id || "";
  let savedStopId = currentStop()?.id || "";
  const initialStopId = savedStopId;
  const label = `保存「${dom.fieldTitle.value || "地点"}」`;
  const stopBeforeSave = currentStop();
  const stopTextValuesBeforeSave = stopBeforeSave && collabTextStopId === stopBeforeSave.id && collabTextDoc
    ? COLLAB_TEXT_FIELDS.reduce((values, { field }) => {
      values[field] = collabTextFields[field] ? collabTextFields[field].toString() : stopBeforeSave[field] || "";
      return values;
    }, {})
    : null;
  const stopStructValuesBeforeSave = stopBeforeSave && collabTextStopId === stopBeforeSave.id && collabStructMap ? readStructFromDoc() : null;
  const changedStopFields = stopBeforeSave ? [
    ...COLLAB_TEXT_FIELDS
      .filter(({ field, domKey }) => !sameSerialized(stopBeforeSave[field], stopTextValuesBeforeSave?.[field] ?? (dom[domKey]?.value.trim() || "")))
      .map(({ field }) => field),
    ...COLLAB_STRUCT_PRESENCE_FIELDS
      .filter(({ structField, domKey }) => {
        if (!domKey) return false;
        const currentValue = stopStructValuesBeforeSave && Object.prototype.hasOwnProperty.call(stopStructValuesBeforeSave, structField)
          ? stopStructValuesBeforeSave[structField]
          : structField === "tags" ? normalizeTags(dom[domKey].value) : dom[domKey].value.trim();
        return !sameSerialized(stopBeforeSave[structField], currentValue);
      })
      .map(({ field }) => field),
  ] : [];
  if (!confirmRemoteTextFieldEdit(changedStopFields, "stop", "保存地点详情")) return;
  if (!mutate(label, () => {
    const stop = currentStop();
    const collabValue = (field, domKey) => (collabTextStopId === stop.id && collabTextFields[field] ? collabTextFields[field].toString() : dom[domKey].value.trim());
    const structValues = collabTextStopId === stop.id && collabStructMap ? readStructFromDoc() : null;
    const structValue = (field, fallback) => structValues && Object.prototype.hasOwnProperty.call(structValues, field) ? structValues[field] : fallback();
    stop.title = collabValue("title", "fieldTitle") || "未命名地点";
    stop.type = collabValue("type", "fieldType") || "Place";
    stop.budget = structValue("budget", () => numberValue(dom.fieldBudget.value));
    stop.paid = structValue("paid", () => numberValue(dom.fieldPaid.value));
    stop.payer = structValue("payer", () => dom.fieldPayer.value.trim());
    stop.budgetSelected = structValue("budgetSelected", () => Boolean(dom.fieldBudgetSelected?.checked));
    stop.address = collabValue("address", "fieldAddress");
    stop.amapKeyword = collabValue("amapKeyword", "fieldAmapKeyword");
    stop.time = structValue("time", () => dom.fieldTime.value.trim());
    stop.lng = structValue("lng", () => dom.fieldLng.value.trim());
    stop.lat = structValue("lat", () => dom.fieldLat.value.trim());
    stop.image = structValue("image", () => dom.fieldImage.value.trim()) || stop.image || images.city;
    stop.tags = structValue("tags", () => normalizeTags(dom.fieldTags.value));
    stop.note = collabValue("note", "fieldNote");
    savedStopId = stop.id;
    dayId = currentDay()?.id || dayId;
    clearCurrentAmapRoute();
  }, { save: false, render: false, activityTarget: () => stopActivityTarget(dayId, savedStopId || initialStopId, { action: "save" }) })) return;
  if (!(await syncStopSnapshotToPlanDoc(savedStopId, "local-stop-detail-save"))) {
    await syncStopListToDoc(dayId, "local-stop-detail-save-fallback");
  }
  await saveCollaborativeTextChange(label);
  render();
});

COLLAB_TEXT_FIELDS.forEach(({ field, domKey }) => {
  dom[domKey]?.addEventListener("input", () => {
    syncCollabTextFieldToDoc(field, dom[domKey].value);
    captureCommentAnchor({ field, domKey, scope: "stop", label: COLLAB_TEXT_FIELD_BY_FIELD.get(field)?.label || field });
    schedulePresenceTrack();
  });
  ["focus", "click", "keyup", "select"].forEach((eventName) => {
    dom[domKey]?.addEventListener(eventName, () => {
      captureCommentAnchor({ field, domKey, scope: "stop", label: COLLAB_TEXT_FIELD_BY_FIELD.get(field)?.label || field });
      schedulePresenceTrack(eventName === "focus" ? 0 : 90);
    });
  });
  dom[domKey]?.addEventListener("blur", () => schedulePresenceTrack(180));
});

document.addEventListener("selectionchange", () => {
  const focused = currentFocusedTextField();
  if (focused) {
    captureCommentAnchor(focused);
    schedulePresenceTrack(90);
  }
});

COLLAB_STRUCT_FIELDS.forEach((meta) => {
  if (!meta.domKey) return;
  const anchorMeta = COLLAB_STRUCT_PRESENCE_FIELDS.find((field) => field.structField === meta.field) || null;
  ["input", "change"].forEach((eventName) => {
    dom[meta.domKey]?.addEventListener(eventName, () => {
      syncCollabStructFieldToDoc(meta);
      if (anchorMeta) captureCommentAnchor(anchorMeta);
      schedulePresenceTrack();
    });
  });
  ["focus", "click", "keyup", "select"].forEach((eventName) => {
    dom[meta.domKey]?.addEventListener(eventName, () => {
      if (anchorMeta) captureCommentAnchor(anchorMeta);
      schedulePresenceTrack(eventName === "focus" ? 0 : 90);
    });
  });
  dom[meta.domKey]?.addEventListener("blur", () => schedulePresenceTrack(180));
});

COLLAB_PLAN_TEXT_PRESENCE_FIELDS.forEach((meta) => {
  ["input", "change", "focus", "click", "keyup", "select"].forEach((eventName) => {
    dom[meta.domKey]?.addEventListener(eventName, () => {
      schedulePresenceTrack(eventName === "focus" ? 0 : 90);
    });
  });
  dom[meta.domKey]?.addEventListener("blur", () => schedulePresenceTrack(180));
});

dom.addStopBtn.addEventListener("click", async () => {
  const label = "新增地点";
  if (!requireEdit(label)) return;
  saveVersionSnapshot(label);
  const day = currentDay();
  const createdDayId = day?.id || "";
  const createdStop = makeStop({
    time: "18:00",
    title: "新地点",
    note: "在右侧编辑名称、地址、预算和备注。",
    tags: ["草稿"],
    budget: 0,
    x: 70,
    y: 32,
  });
  if (createdDayId && await addStopToDoc(createdDayId, createdStop, "local-stop-create-yjs-first")) {
    await logActivity(label, { target: stopActivityTarget(createdDayId, createdStop.id || "", { action: "create" }) });
    await applyStopCreateFromDoc(createdDayId, createdStop.id, label);
    await saveCollaborativePlanChange(label);
    broadcastStopCreated(createdDayId, createdStop);
    render();
    return;
  }
  const fallbackDay = currentDay();
  if (!fallbackDay) return;
  fallbackDay.stops.push(createdStop);
  activeStop = fallbackDay.stops.length - 1;
  clearCurrentAmapRoute();
  await logActivity(label, { target: stopActivityTarget(createdDayId, createdStop.id || "", { action: "create", fallback: true }) });
  await syncStopListToDoc(createdDayId, "local-stop-create-fallback");
  await saveCollaborativePlanChange(label);
  broadcastStopCreated(createdDayId, createdStop);
  render();
});

dom.quickAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const draft = quickPlaceDraft();
  if (!draft) return;
  const name = draft.title;
  const label = `加入景点「${name}」`;
  if (!requireEdit(label)) return;
  saveVersionSnapshot(label);
  const day = currentDay();
  const createdDayId = day?.id || "";
  const stopCount = day?.stops?.length || 0;
  const createdStop = {
    ...draft,
    x: 30 + ((stopCount * 17) % 52),
    y: 28 + ((stopCount * 13) % 42),
  };
  if (createdDayId && await addStopToDoc(createdDayId, createdStop, "local-quick-stop-create-yjs-first")) {
    await logActivity(label, { target: stopActivityTarget(createdDayId, createdStop.id || "", { action: "quick-add" }) });
    await applyStopCreateFromDoc(createdDayId, createdStop.id, label);
    clearQuickPlaceForm();
    await saveCollaborativePlanChange(label);
    broadcastStopCreated(createdDayId, createdStop);
    render();
    return;
  }
  const fallbackDay = currentDay();
  if (!fallbackDay) return;
  fallbackDay.stops.push(createdStop);
  activeStop = fallbackDay.stops.length - 1;
  clearCurrentAmapRoute();
  clearQuickPlaceForm();
  await logActivity(label, { target: stopActivityTarget(createdDayId, createdStop.id || "", { action: "quick-add", fallback: true }) });
  await syncStopListToDoc(createdDayId, "local-quick-stop-create-fallback");
  await saveCollaborativePlanChange(label);
  broadcastStopCreated(createdDayId, createdStop);
  render();
});

dom.addCandidateBtn.addEventListener("click", async () => {
  const draft = quickPlaceDraft({
    note: "从快速录入加入备选池，可稍后安排到任意一天。",
    tags: ["备选", "自定义"],
  });
  if (!draft || !requireEdit("加入备选池")) return;
  if (editingCandidateId) {
    if (!confirmRemoteCandidateEdit(editingCandidateId, "更新备选地点")) return;
    const existing = state.candidates.find((item) => item.id === editingCandidateId);
    if (!existing) {
      setCandidateEditing(null);
      dom.saveState.textContent = "这条备选已被其他成员移除，请重新选择。";
      return;
    }
    const patch = {
      title: draft.title,
      type: draft.type,
      address: draft.address,
      note: draft.note,
      tags: draft.tags,
      budget: draft.budget,
      paid: draft.paid,
      payer: draft.payer,
      selected: draft.selected,
      time: draft.time,
      amapKeyword: draft.amapKeyword,
      lng: draft.lng,
      lat: draft.lat,
      image: draft.image,
    };
    if (await updateCandidateInDoc(editingCandidateId, patch)) {
      persistCurrentPlanFromDoc("备选池协作内容已实时同步");
      await logActivity(`更新备选池「${draft.title}」`, { target: candidateActivityTarget(editingCandidateId, { action: "update" }) });
      clearQuickPlaceForm();
      await saveCollaborativePlanChange(`更新备选「${draft.title}」`);
      dom.saveState.textContent = `已更新备选「${draft.title}」`;
      refreshRealtimePlanViews();
      return;
    }
    mutate(`更新备选「${draft.title}」`, () => {
      state.candidates = mergedCandidatesWithPatch("update", patch, editingCandidateId);
      clearQuickPlaceForm();
    }, { requireUnlocked: false, save: false, activityTarget: candidateActivityTarget(editingCandidateId, { action: "update" }) });
    await syncCandidatesToDoc("local-candidate-update-fallback");
    await saveCollaborativePlanChange(`更新备选「${draft.title}」`);
    return;
  }
  if (await addCollaborativeCandidate(draft)) {
    persistCurrentPlanFromDoc("备选池协作内容已实时同步");
    await logActivity(`加入备选池「${draft.title}」`, { target: candidateActivityTarget(draft.id, { action: "create" }) });
    clearQuickPlaceForm();
    await saveCollaborativePlanChange(`加入备选池「${draft.title}」`);
    dom.saveState.textContent = `已加入备选池「${draft.title}」`;
    refreshRealtimePlanViews();
    return;
  }
  mutate(`加入备选池「${draft.title}」`, () => {
    state.candidates = mergedCandidatesWithPatch("add", draft);
    clearQuickPlaceForm();
  }, { requireUnlocked: false, save: false, activityTarget: candidateActivityTarget(draft.id, { action: "create" }) });
  await syncCandidatesToDoc("local-candidate-fallback");
  await saveCollaborativePlanChange(`加入备选池「${draft.title}」`);
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
    hideAmapCandidates("quick");
    dom.optimizeHint.textContent = `已生成高德链接：${keyword}。配置高德代理后可自动回填地址和经纬度。`;
    return;
  }
  try {
    const places = await lookupAmapPlaces(keyword, { limit: 6 });
    const firstPlace = Array.isArray(places) ? places[0] : null;
    renderAmapCandidates("quick", places || [], keyword);
    if (firstPlace) applyQuickAmapPlace(firstPlace, keyword);
    dom.optimizeHint.textContent = firstPlace?.lng && firstPlace?.lat
      ? `高德返回 ${places.length} 个候选，已先采用「${firstPlace.title}」（${placeCoordinateText(firstPlace)}）。可在候选列表里切换。`
      : `高德已响应，但没有返回可用坐标；已保留搜索链接。`;
  } catch (error) {
    hideAmapCandidates("quick");
    dom.optimizeHint.textContent = `高德代理调用失败：${error.message}。已保留高德搜索链接。`;
  }
});

dom.amapLookupBtn.addEventListener("click", async () => {
  const stop = currentStop();
  const keyword = dom.fieldAmapKeyword.value.trim() || `${state.destination || ""} ${stop.title}`.trim();
  dom.fieldAmapLink.href = amapSearchUrl(keyword);
  dom.fieldAmapLink.textContent = `打开高德搜索：${keyword}`;
  if (!serviceConfig.amapEndpoint) {
    hideAmapCandidates("field");
    dom.saveState.textContent = `已生成高德链接：${keyword}`;
    return;
  }
  try {
    const places = await lookupAmapPlaces(keyword, { limit: 6 });
    const firstPlace = Array.isArray(places) ? places[0] : null;
    renderAmapCandidates("field", places || [], keyword);
    if (firstPlace) await applyFieldAmapPlace(firstPlace, keyword);
    dom.saveState.textContent = firstPlace?.lng && firstPlace?.lat
      ? `高德返回 ${places.length} 个候选，已先回填「${firstPlace.title}」；可在候选列表里切换。`
      : `高德已响应，但没有返回可用坐标。`;
  } catch (error) {
    hideAmapCandidates("field");
    dom.saveState.textContent = `高德代理调用失败：${error.message}`;
  }
});

async function planAmapRouteForCurrentDay({ retry = false } = {}) {
  if (!requireEdit("高德规划路线")) return;
  const day = currentDay();
  if (day.stops.length < 2) {
    dom.optimizeHint.textContent = "至少需要 2 个地点才能用高德规划路线。";
    return;
  }
  if (!confirmRemoteStopEdit(day.stops.map((stop) => stop.id), retry ? "重试高德路线规划" : "高德规划路线")) return;
  const mode = retry && lastAmapRouteRequest?.mode ? lastAmapRouteRequest.mode : dom.amapRouteMode.value;
  const strategy = retry && lastAmapRouteRequest?.strategy ? lastAmapRouteRequest.strategy : dom.amapRouteStrategy.value;
  lastAmapRouteRequest = { dayId: day.id, mode, strategy };
  if (!retry) saveVersionSnapshot("高德规划路线前版本");
  dom.amapRouteBtn.disabled = true;
  if (dom.amapRouteRetryBtn) dom.amapRouteRetryBtn.disabled = true;
  dom.optimizeHint.textContent = retry ? "正在重试高德路线规划..." : "正在请求高德路线规划...";
  try {
    const result = await requestAmapRoute(day, mode, strategy);
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
      mode: result.mode || mode,
      strategy: result.strategy || strategy,
      distance: Number(result.distance || 0),
      duration: Number(result.duration || 0),
      legs: Array.isArray(result.legs) ? result.legs : [],
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
      updatedAt: new Date().toISOString(),
    };
    logActivity("高德规划当天路线");
    if (!(await patchDayMetaInDoc(day.id, { amapRoute: day.amapRoute }, "local-amap-route-day-patch"))) {
      await syncDayMetasToDoc("local-amap-route-day-fallback");
    }
    if (!(await reorderStopListInDoc(day.id, day.stops, "local-amap-route-stops", { patchFields: ["address", "lng", "lat", "amapKeyword"] }))) {
      await syncStopListToDoc(day.id, "local-amap-route-stops-fallback");
    }
    await saveCollaborativePlanChange("已用高德规划路线");
    render();
    dom.optimizeHint.textContent = `高德已规划 ${day.amapRoute.legs.length} 段路线：${formatDistanceText(day.amapRoute.distance)} · ${formatDurationText(day.amapRoute.duration)}。`;
    if (dom.amapRouteRetryBtn) dom.amapRouteRetryBtn.hidden = true;
  } catch (error) {
    dom.optimizeHint.textContent = `高德路线规划失败：${error.message}`;
    renderAmapRouteReport({
      source: "高德路线规划失败",
      mode,
      strategy,
      warnings: [error.message, "请检查 Supabase 函数是否部署、AMAP_WEB_SERVICE_KEY 是否配置，以及地点是否能搜索到坐标。"],
    });
    if (dom.amapRouteRetryBtn) dom.amapRouteRetryBtn.hidden = false;
  } finally {
    dom.amapRouteBtn.disabled = false;
    if (dom.amapRouteRetryBtn) dom.amapRouteRetryBtn.disabled = false;
    refreshIcons();
  }
}

dom.amapRouteBtn.addEventListener("click", () => {
  planAmapRouteForCurrentDay();
});

dom.amapRouteRetryBtn?.addEventListener("click", () => {
  planAmapRouteForCurrentDay({ retry: true });
});

async function deleteStopAtIndex(stopIndex = activeStop) {
  const day = currentDay();
  if (day.stops.length <= 1) {
    dom.saveState.textContent = "每天至少保留一个地点";
    return;
  }
  const index = Math.max(0, Math.min(Number(stopIndex) || 0, day.stops.length - 1));
  const deletedStop = clone(day.stops[index]);
  if (!deletedStop) return;
  const label = `删除「${deletedStop.title}」`;
  if (!confirmRemoteStopEdit(deletedStop.id, "删除地点")) return;
  if (!mutate(label, () => {
    day.stops.splice(index, 1);
    activeStop = Math.max(0, Math.min(index, day.stops.length - 1));
    clearCurrentAmapRoute();
  }, { save: false, render: false, activityTarget: stopActivityTarget(day.id, deletedStop.id || "", { deleted: true }) })) return;
  await deleteStopFromDoc(day.id, deletedStop.id, "local-stop-delete");
  await saveCollaborativePlanChange(label);
  broadcastStopDeleted(day.id, deletedStop);
  render();
}

dom.deleteStopBtn.addEventListener("click", async () => {
  await deleteStopAtIndex(activeStop);
});

dom.moveUpBtn.addEventListener("click", async () => {
  if (activeStop === 0) return;
  let dayId = "";
  let nextStops = [];
  const movingStopId = currentStop()?.id || "";
  if (!confirmRemoteStopEdit(movingStopId, "上移地点")) return;
  if (!mutate("上移地点", () => {
    const day = currentDay();
    const stops = day.stops;
    [stops[activeStop - 1], stops[activeStop]] = [stops[activeStop], stops[activeStop - 1]];
    activeStop -= 1;
    dayId = day.id;
    nextStops = [...stops];
    clearCurrentAmapRoute();
  }, { save: false, render: false, activityTarget: stopActivityTarget(currentDay()?.id || "", movingStopId, { action: "move-up" }) })) return;
  if (!(await reorderStopListInDoc(dayId, nextStops, "local-stop-reorder"))) {
    await syncStopListToDoc(dayId, "local-stop-reorder-fallback");
  }
  await saveCollaborativePlanChange("上移地点");
  broadcastStopsReordered(dayId, nextStops);
  render();
});

dom.moveDownBtn.addEventListener("click", async () => {
  const stops = currentDay().stops;
  if (activeStop >= stops.length - 1) return;
  let dayId = "";
  let nextStops = [];
  const movingStopId = currentStop()?.id || "";
  if (!confirmRemoteStopEdit(movingStopId, "下移地点")) return;
  if (!mutate("下移地点", () => {
    const day = currentDay();
    const dayStops = day.stops;
    [dayStops[activeStop + 1], dayStops[activeStop]] = [dayStops[activeStop], dayStops[activeStop + 1]];
    activeStop += 1;
    dayId = day.id;
    nextStops = [...dayStops];
    clearCurrentAmapRoute();
  }, { save: false, render: false, activityTarget: stopActivityTarget(currentDay()?.id || "", movingStopId, { action: "move-down" }) })) return;
  if (!(await reorderStopListInDoc(dayId, nextStops, "local-stop-reorder"))) {
    await syncStopListToDoc(dayId, "local-stop-reorder-fallback");
  }
  await saveCollaborativePlanChange("下移地点");
  broadcastStopsReordered(dayId, nextStops);
  render();
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
  const strategyText = amapRouteStrategyLabel(result.strategy, result.mode);
  dom.amapRouteReport.hidden = false;
  dom.amapRouteReport.innerHTML = `
    <div class="amap-route-summary">
      <strong>${escapeHtml(result.source || "高德路线规划")}</strong>
      <span>${escapeHtml([modeText, strategyText, formatDistanceText(result.distance), formatDurationText(result.duration)].filter(Boolean).join(" · "))}</span>
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

function amapRouteStrategyLabel(strategy, mode = "") {
  const common = {
    default: "默认路线",
    fastest: "时间优先",
    avoid_tolls: "少收费",
    avoid_congestion: "躲避拥堵",
    least_walking: "少步行",
    least_transfer: "少换乘",
  };
  if (!strategy || strategy === "default") return common.default;
  if (mode === "walking" && strategy !== "default") return "";
  return common[strategy] || "";
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
  const payload = {
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
  };
  let data;
  try {
    data = await serviceApi.ai.optimizeRoute(serviceConfig, payload);
  } catch (error) {
    data = error.data || {};
    if (Array.isArray(data.fallbackOrder) && data.fallbackOrder.length) {
      return {
        order: data.fallbackOrder,
        note: data.note || data.error || "AI ????????????????",
        reason: data.error || "",
        source: data.source || "AI ????",
        fallback: true,
      };
    }
    throw error;
  }
  const order = Array.isArray(data.order) ? data.order : Array.isArray(data.stopIds) ? data.stopIds : [];
  return {
    order,
    note: data.note || data.reason || "AI ???????",
    reason: data.reason || "",
    segments: Array.isArray(data.segments) ? data.segments : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
    source: data.source || "AI ??",
  };
}

async function optimizeCurrentDayRoute() {
  const day = currentDay();
  if (day.stops.length < 3) {
    dom.optimizeHint.textContent = "当前天少于 3 个地点，暂时不需要优化路径。";
    return;
  }

  if (!requireEdit("优化路径")) return;
  if (!confirmRemoteStopEdit(day.stops.map((stop) => stop.id), "优化路径")) return;
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
    const reorderOrigin = serviceConfig.aiEndpoint ? "local-ai-route-reorder" : "local-fallback-route-reorder";
    if (!(await reorderStopListInDoc(day.id, day.stops, reorderOrigin, { patchFields: ["tags"] }))) {
      await syncStopListToDoc(day.id, `${reorderOrigin}-fallback`);
    }
    await saveCollaborativePlanChange(serviceConfig.aiEndpoint ? "已用 AI 优化路径" : "已用本地距离优化路径");
    broadcastStopsReordered(day.id, day.stops);
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

dom.mustVote.addEventListener("click", async () => {
  if (!requireEdit("更新必去投票")) return;
  const stop = currentStop();
  const actorId = collabActorId();
  const currentValues = collabTextStopId === stop.id && collabStructMap ? readStructFromDoc() : stop;
  const nextVoteValues = toggleVoteValues(currentValues, actorId);
  if (await syncCollabStructValuesToDoc(nextVoteValues, "local-vote-toggle")) {
    await syncStopSnapshotToPlanDoc(stop.id, "local-vote-toggle-snapshot");
    await saveCollaborativeTextChange("更新必去投票");
    return;
  }
  if (!mutate("更新必去投票", () => {
    const fallbackStop = currentStop();
    const fallbackValues = toggleVoteValues(fallbackStop, actorId);
    fallbackStop.voters = fallbackValues.voters;
    fallbackStop.userVoted = fallbackValues.userVoted;
    fallbackStop.votes = fallbackValues.votes;
  }, { save: false, render: false })) return;
  await syncStopSnapshotToPlanDoc(currentStop().id, "local-vote-toggle-fallback");
  await saveCollaborativeTextChange("更新必去投票");
  refreshStopInteractionViews(currentStop());
});

dom.favoriteBtn.addEventListener("click", async () => {
  if (!requireEdit("更新收藏")) return;
  const stop = currentStop();
  const currentValues = collabTextStopId === stop.id && collabStructMap ? readStructFromDoc() : stop;
  if (await syncCollabStructValuesToDoc({ favorite: !Boolean(currentValues.favorite) }, "local-favorite-toggle")) {
    await syncStopSnapshotToPlanDoc(stop.id, "local-favorite-toggle-snapshot");
    await saveCollaborativeTextChange("更新收藏");
    return;
  }
  if (!mutate("更新收藏", () => {
    currentStop().favorite = !currentStop().favorite;
  }, { save: false, render: false })) return;
  await syncStopSnapshotToPlanDoc(currentStop().id, "local-favorite-toggle-fallback");
  await saveCollaborativeTextChange("更新收藏");
  refreshStopInteractionViews(currentStop());
});

dom.commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = dom.commentInput.value.trim();
  if (!text) return;
  if (replyingCommentId) {
    const parentId = replyingCommentId;
    const reply = await addCollaborativeCommentReply(parentId, text);
    if (reply) {
      const stop = currentStop();
      stop.comments = normalizeComments([...(stop.comments || []), reply]);
      replyingCommentId = "";
      dom.commentInput.value = "";
      dom.commentInput.placeholder = "添加同行意见或提醒";
      refreshStopCommentMutationViews(stop);
      await logActivity(`回复评论「${stop.title}」`, { target: { type: "comment", commentId: parentId, scope: "stop", stopId: stop.id || "" } });
      await syncStopSnapshotToPlanDoc(stop.id, "local-comment-reply-snapshot");
      await saveCollaborativeTextChange(`回复评论「${stop.title}」`);
      dom.saveState.textContent = `已回复「${stop.title}」的评论`;
      return;
    }
    const fallbackTitle = currentStop().title;
    const fallbackReply = createCommentReply(parentId, text);
    if (!mutate(`回复评论「${fallbackTitle}」`, () => {
      currentStop().comments = normalizeComments([...(currentStop().comments || []), fallbackReply]);
      replyingCommentId = "";
      dom.commentInput.value = "";
      dom.commentInput.placeholder = "添加同行意见或提醒";
    }, { save: false, render: false })) return;
    await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-reply-fallback-snapshot");
    await logActivity(`回复评论「${fallbackTitle}」`, { target: { type: "comment", commentId: parentId, scope: "stop", stopId: currentStop().id || "" } });
    await saveCollaborativeTextChange(`回复评论「${fallbackTitle}」`);
    refreshStopCommentMutationViews(currentStop());
    return;
  }
  const anchor = currentCommentAnchor("stop");
  const collaborativeComment = await addCollaborativeComment(text, anchor);
  if (collaborativeComment) {
    const stop = currentStop();
    stop.comments = normalizeComments([...(stop.comments || []), collaborativeComment]);
    dom.commentInput.value = "";
    refreshStopCommentMutationViews(stop);
    await logActivity(`评论「${stop.title}」`, { target: { type: "comment", commentId: collaborativeComment.id, scope: "stop", stopId: stop.id || "" } });
    await syncStopSnapshotToPlanDoc(stop.id, "local-comment-snapshot");
    await saveCollaborativeTextChange(`评论「${stop.title}」`);
    dom.saveState.textContent = `已评论「${stop.title}」`;
    return;
  }
  const fallbackTitle = currentStop().title;
  const fallbackComment = { id: uid(), author: getCollabName(), text, at: new Date().toISOString(), ...(anchor ? { anchor } : {}) };
  if (!mutate(`评论「${fallbackTitle}」`, () => {
    currentStop().comments = [...(currentStop().comments || []), fallbackComment];
    dom.commentInput.value = "";
  }, { save: false, render: false })) return;
  await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-fallback-snapshot");
  await logActivity(`评论「${fallbackTitle}」`, { target: { type: "comment", commentId: fallbackComment.id, scope: "stop", stopId: currentStop().id || "" } });
  await saveCollaborativeTextChange(`评论「${fallbackTitle}」`);
  refreshStopCommentMutationViews(currentStop());
});

dom.commentList.addEventListener("click", async (event) => {
  const filterButton = event.target.closest("[data-comment-filter]");
  if (filterButton) {
    event.preventDefault();
    commentFilter = filterButton.dataset.commentFilter || "all";
    renderStopComments(currentStop());
    return;
  }
  const anchorButton = event.target.closest("[data-comment-anchor]");
  if (anchorButton) {
    event.preventDefault();
    const comment = (currentStop()?.comments || []).find((item) => item.id === anchorButton.dataset.commentAnchor);
    if (comment?.anchor && focusCommentAnchor(comment.anchor)) {
      dom.saveState.textContent = "已定位到评论锚点";
    }
    return;
  }
  const replyButton = event.target.closest("[data-reply-comment]");
  if (replyButton) {
    event.preventDefault();
    const comment = normalizeComments(currentStop()?.comments || []).find((item) => item.id === replyButton.dataset.replyComment && !item.parentId);
    if (!comment || !requireEdit("回复评论")) return;
    replyingCommentId = comment.id;
    dom.commentInput.placeholder = `回复 ${comment.author || "协作者"}...`;
    dom.commentInput.focus();
    renderCommentAnchorHint();
    return;
  }
  const resolveButton = event.target.closest("[data-toggle-comment-resolved]");
  if (resolveButton) {
    event.preventDefault();
    const commentId = resolveButton.dataset.toggleCommentResolved;
    const stop = currentStop();
    const comment = normalizeComments(stop.comments || []).find((item) => item.id === commentId && !item.parentId);
    if (!comment || !requireEdit(comment.resolved ? "重新打开评论" : "标记评论已解决")) return;
    const nextPatch = resolvedCommentPatch(comment.resolved);
    const updated = await updateCollaborativeComment(commentId, nextPatch);
    if (updated) {
      stop.comments = commentsWithUpdatedComment(stop.comments || [], commentId, nextPatch);
      refreshStopCommentMutationViews(stop);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`, { target: { type: "comment", commentId, scope: "stop", stopId: stop.id || "" } });
      await syncStopSnapshotToPlanDoc(stop.id, "local-comment-resolve-snapshot");
      await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`);
      dom.saveState.textContent = comment.resolved ? "已重新打开评论" : "已标记评论解决";
      return;
    }
    if (!mutate(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`, () => {
      currentStop().comments = commentsWithUpdatedComment(currentStop().comments || [], commentId, nextPatch);
    }, { save: false, render: false })) return;
    await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-resolve-fallback-snapshot");
    await logActivity(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`, { target: { type: "comment", commentId, scope: "stop", stopId: currentStop().id || "" } });
    await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`);
    refreshStopCommentMutationViews(currentStop());
    return;
  }
  const deleteButton = event.target.closest("[data-delete-comment]");
  if (!deleteButton) return;
  event.preventDefault();
  const commentId = deleteButton.dataset.deleteComment;
  const stop = currentStop();
  const comment = (stop.comments || []).find((item) => item.id === commentId);
  if (!comment || !requireEdit("删除评论")) return;
  if (await deleteCollaborativeComment(commentId)) {
    stop.comments = commentsWithoutThread(stop.comments || [], commentId);
    if (replyingCommentId === commentId || !stop.comments.some((item) => item.id === replyingCommentId)) {
      replyingCommentId = "";
      dom.commentInput.placeholder = "添加同行意见或提醒";
    }
    refreshStopCommentMutationViews(stop);
    await logActivity(`删除评论「${stop.title}」`, { target: { type: "comment", commentId, scope: "stop", stopId: stop.id || "", deleted: true } });
    await syncStopSnapshotToPlanDoc(stop.id, "local-comment-delete-snapshot");
    await saveCollaborativeTextChange(`删除评论「${stop.title}」`);
    dom.saveState.textContent = `已删除「${stop.title}」的评论`;
    return;
  }
  if (!mutate(`删除评论「${stop.title}」`, () => {
    currentStop().comments = commentsWithoutThread(currentStop().comments || [], commentId);
    if (replyingCommentId === commentId || !currentStop().comments.some((item) => item.id === replyingCommentId)) {
      replyingCommentId = "";
      dom.commentInput.placeholder = "添加同行意见或提醒";
    }
  }, { save: false, render: false })) return;
  await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-delete-fallback-snapshot");
  await logActivity(`删除评论「${stop.title}」`, { target: { type: "comment", commentId, scope: "stop", stopId: currentStop().id || "", deleted: true } });
  await saveCollaborativeTextChange(`删除评论「${stop.title}」`);
  refreshStopCommentMutationViews(currentStop());
});

dom.dayCommentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = dom.dayCommentInput.value.trim();
  if (!text) return;
  if (dayReplyingCommentId) {
    const parentId = dayReplyingCommentId;
    const reply = await addCollaborativeDayCommentReply(parentId, text);
    if (reply) {
      const day = currentDay();
      day.comments = normalizeComments([...(day.comments || []), reply]);
      dayReplyingCommentId = "";
      dom.dayCommentInput.value = "";
      dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
      refreshDayCommentMutationViews(day);
      await logActivity(`回复当天批注「${day.title}」`, { target: { type: "comment", commentId: parentId, scope: "day", dayId: day.id || "" } });
      await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-reply-snapshot");
      await saveCollaborativeTextChange(`回复当天批注「${day.title}」`);
      dom.saveState.textContent = `已回复「${day.title}」的当天批注`;
      return;
    }
    const fallbackTitle = currentDay().title;
    const fallbackReply = createCommentReply(parentId, text);
    if (!mutate(`回复当天批注「${fallbackTitle}」`, () => {
      currentDay().comments = normalizeComments([...(currentDay().comments || []), fallbackReply]);
      dayReplyingCommentId = "";
      dom.dayCommentInput.value = "";
      dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
    }, { requireUnlocked: false, save: false, render: false })) return;
    await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-reply-fallback-snapshot");
    await logActivity(`回复当天批注「${fallbackTitle}」`, { target: { type: "comment", commentId: parentId, scope: "day", dayId: currentDay().id || "" } });
    await saveCollaborativeTextChange(`回复当天批注「${fallbackTitle}」`);
    refreshDayCommentMutationViews(currentDay());
    return;
  }
  const anchor = currentCommentAnchor("day");
  const collaborativeComment = await addCollaborativeDayComment(text, anchor);
  if (collaborativeComment) {
    const day = currentDay();
    day.comments = normalizeComments([...(day.comments || []), collaborativeComment]);
    dom.dayCommentInput.value = "";
    refreshDayCommentMutationViews(day);
    await logActivity(`当天批注「${day.title}」`, { target: { type: "comment", commentId: collaborativeComment.id, scope: "day", dayId: day.id || "" } });
    await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-snapshot");
    await saveCollaborativeTextChange(`当天批注「${day.title}」`);
    dom.saveState.textContent = `已批注「${day.title}」`;
    return;
  }
  const fallbackTitle = currentDay().title;
  const fallbackComment = { id: uid(), author: getCollabName(), text, at: new Date().toISOString(), ...(anchor ? { anchor } : {}) };
  if (!mutate(`当天批注「${fallbackTitle}」`, () => {
    currentDay().comments = normalizeComments([...(currentDay().comments || []), fallbackComment]);
    dom.dayCommentInput.value = "";
  }, { requireUnlocked: false, save: false, render: false })) return;
  await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-fallback-snapshot");
  await logActivity(`当天批注「${fallbackTitle}」`, { target: { type: "comment", commentId: fallbackComment.id, scope: "day", dayId: currentDay().id || "" } });
  await saveCollaborativeTextChange(`当天批注「${fallbackTitle}」`);
  refreshDayCommentMutationViews(currentDay());
});

dom.dayCommentList?.addEventListener("click", async (event) => {
  const filterButton = event.target.closest("[data-day-comment-filter]");
  if (filterButton) {
    event.preventDefault();
    dayCommentFilter = filterButton.dataset.dayCommentFilter || "all";
    renderDayComments(currentDay());
    return;
  }
  const anchorButton = event.target.closest("[data-day-comment-anchor]");
  if (anchorButton) {
    event.preventDefault();
    const comment = (currentDay()?.comments || []).find((item) => item.id === anchorButton.dataset.dayCommentAnchor);
    if (comment?.anchor && focusCommentAnchor(comment.anchor)) {
      dom.saveState.textContent = "已定位到当天批注锚点";
    }
    return;
  }
  const replyButton = event.target.closest("[data-reply-day-comment]");
  if (replyButton) {
    event.preventDefault();
    const comment = normalizeComments(currentDay()?.comments || []).find((item) => item.id === replyButton.dataset.replyDayComment && !item.parentId);
    if (!comment || !requireEdit("回复当天批注")) return;
    dayReplyingCommentId = comment.id;
    dom.dayCommentInput.placeholder = `回复 ${comment.author || "协作者"}...`;
    dom.dayCommentInput.focus();
    renderDayCommentAnchorHint();
    return;
  }
  const resolveButton = event.target.closest("[data-toggle-day-comment-resolved]");
  if (resolveButton) {
    event.preventDefault();
    const commentId = resolveButton.dataset.toggleDayCommentResolved;
    const day = currentDay();
    const comment = normalizeComments(day.comments || []).find((item) => item.id === commentId && !item.parentId);
    if (!comment || !requireEdit(comment.resolved ? "重新打开当天批注" : "标记当天批注已解决")) return;
    const nextPatch = resolvedCommentPatch(comment.resolved);
    const updated = await updateCollaborativeDayComment(commentId, nextPatch);
    if (updated) {
      day.comments = commentsWithUpdatedComment(day.comments || [], commentId, nextPatch);
      refreshDayCommentMutationViews(day);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`, { target: { type: "comment", commentId, scope: "day", dayId: day.id || "" } });
      await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-resolve-snapshot");
      await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`);
      dom.saveState.textContent = comment.resolved ? "已重新打开当天批注" : "已标记当天批注解决";
      return;
    }
    if (!mutate(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`, () => {
      currentDay().comments = commentsWithUpdatedComment(currentDay().comments || [], commentId, nextPatch);
    }, { requireUnlocked: false, save: false, render: false })) return;
    await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-resolve-fallback-snapshot");
    await logActivity(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`, { target: { type: "comment", commentId, scope: "day", dayId: currentDay().id || "" } });
    await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`);
    refreshDayCommentMutationViews(currentDay());
    return;
  }
  const deleteButton = event.target.closest("[data-delete-day-comment]");
  if (!deleteButton) return;
  event.preventDefault();
  const commentId = deleteButton.dataset.deleteDayComment;
  const day = currentDay();
  const comment = (day.comments || []).find((item) => item.id === commentId);
  if (!comment || !requireEdit("删除当天批注")) return;
  if (await deleteCollaborativeDayComment(commentId)) {
    day.comments = commentsWithoutThread(day.comments || [], commentId);
    if (dayReplyingCommentId === commentId || !day.comments.some((item) => item.id === dayReplyingCommentId)) {
      dayReplyingCommentId = "";
      dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
    }
    refreshDayCommentMutationViews(day);
    await logActivity(`删除当天批注「${day.title}」`, { target: { type: "comment", commentId, scope: "day", dayId: day.id || "", deleted: true } });
    await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-delete-snapshot");
    await saveCollaborativeTextChange(`删除当天批注「${day.title}」`);
    dom.saveState.textContent = `已删除「${day.title}」的当天批注`;
    return;
  }
  if (!mutate(`删除当天批注「${day.title}」`, () => {
    currentDay().comments = commentsWithoutThread(currentDay().comments || [], commentId);
    if (dayReplyingCommentId === commentId || !currentDay().comments.some((item) => item.id === dayReplyingCommentId)) {
      dayReplyingCommentId = "";
      dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
    }
  }, { requireUnlocked: false, save: false, render: false })) return;
  await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-delete-fallback-snapshot");
  await logActivity(`删除当天批注「${day.title}」`, { target: { type: "comment", commentId, scope: "day", dayId: currentDay().id || "", deleted: true } });
  await saveCollaborativeTextChange(`删除当天批注「${day.title}」`);
  refreshDayCommentMutationViews(currentDay());
});

dom.dayBlockForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const day = currentDay();
  const text = dom.dayBlockInput.value.trim();
  if (!day || !text || !requireEdit("添加协作块")) return;
  const block = normalizeDayBlock({
    id: uid(),
    type: dom.dayBlockType.value || "todo",
    text,
    createdBy: getCollabName(),
    createdAt: new Date().toISOString(),
  });
  if (!block) return;
  const added = await addDayBlockToDoc(day.id, block, "local-day-block-add");
  if (added) {
    const addedBlock = added === true ? block : added;
    day.blocks = normalizeDayBlocks([...(day.blocks || []), addedBlock]);
    dom.dayBlockInput.value = "";
    if (!refreshDayBlockInsertDom(day, [addedBlock.id], addedBlock.id)) renderDayBlocks(day);
    await logActivity(`添加协作块「${day.title}」`, { target: dayBlockActivityTarget(day.id, addedBlock.id) });
    await saveCollaborativePlanChange(`添加协作块「${day.title}」`);
    dom.saveState.textContent = "已添加协作块";
    return;
  }
  if (!mutate(`添加协作块「${day.title}」`, () => {
    currentDay().blocks = normalizeDayBlocks([...(currentDay().blocks || []), block]);
    dom.dayBlockInput.value = "";
  }, { requireUnlocked: false, save: false, render: false })) return;
  await syncDayBlocksToDoc(currentDay().id, "local-day-block-add-fallback");
  await logActivity(`添加协作块「${day.title}」`, { target: dayBlockActivityTarget(currentDay().id, block.id) });
  await saveCollaborativePlanChange(`添加协作块「${day.title}」`);
  if (!refreshDayBlockInsertDom(currentDay(), [block.id], block.id)) renderDayBlocks(currentDay());
  renderDaySummary();
  refreshIcons();
});

dom.dayBlockList?.addEventListener("change", async (event) => {
  const selectBlockInput = event.target.closest("[data-select-day-block]");
  if (selectBlockInput) {
    const blockId = selectBlockInput.dataset.selectDayBlock || "";
    const blocks = normalizeDayBlocks(currentDay()?.blocks || []);
    if (blockId && event.shiftKey && lastSelectedDayBlockId && setDayBlockRangeSelection(blocks, lastSelectedDayBlockId, blockId, selectBlockInput.checked)) {
      // Range selection handled by helper.
    } else if (blockId && selectBlockInput.checked) {
      selectedDayBlockIds.add(blockId);
    } else {
      selectedDayBlockIds.delete(blockId);
    }
    if (blockId) lastSelectedDayBlockId = blockId;
    if (!refreshDayBlockSelectionDom(currentDay())) renderDayBlocks(currentDay());
    schedulePresenceTrack(0);
    dom.saveState.textContent = selectedDayBlockIds.size ? `已选择 ${selectedDayBlockIds.size} 个协作块` : "已取消协作块选择";
    return;
  }
  const typeSelect = event.target.closest("[data-day-block-type]");
  if (!typeSelect || !canEdit() || isReadonlyMode) return;
  const day = currentDay();
  const blockId = typeSelect.dataset.dayBlockType || "";
  const block = normalizeDayBlocks(day?.blocks || []).find((item) => item.id === blockId);
  const nextType = DAY_BLOCK_TYPES.includes(typeSelect.value) ? typeSelect.value : "todo";
  if (!day || !block) return;
  if (nextType === block.type) return;
  const changed = await applyDayBlockTypeChange(day, blockId, nextType, {
    source: "local-day-block-type-change",
    fallbackSource: "local-day-block-type-change-fallback",
    presence: "切换类型",
    action: "type-change",
    requireLabel: "切换协作块类型",
    status: "已切换协作块类型",
  });
  if (!changed) {
    typeSelect.value = block.type || "todo";
  }
});

dom.dayBlockList?.addEventListener("click", async (event) => {
  const day = currentDay();
  if (!day) return;
  const commandButton = event.target.closest("[data-day-block-command]");
  if (commandButton) {
    event.preventDefault();
    const blockElement = commandButton.closest("[data-day-block]");
    const input = blockElement?.querySelector("[data-edit-day-block]");
    const index = Number(commandButton.dataset.commandIndex) || 0;
    if (input) await applyDayBlockCommandSelection(input, index);
    return;
  }
  const formatButton = event.target.closest("[data-format-day-block]");
  if (formatButton) {
    event.preventDefault();
    const blockId = formatButton.dataset.formatDayBlock || "";
    const blockElement = formatButton.closest("[data-day-block]");
    const input = blockElement?.querySelector("[data-edit-day-block]");
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!input || !block) return;
    await formatDayBlockInput(day, block, input, formatButton.dataset.format || "bold");
    return;
  }
  const previewButton = event.target.closest("[data-toggle-day-block-preview]");
  if (previewButton) {
    event.preventDefault();
    const blockId = previewButton.dataset.toggleDayBlockPreview || "";
    if (!blockId) return;
    if (previewDayBlockIds.has(blockId)) {
      previewDayBlockIds.delete(blockId);
      if (!refreshDayBlockPreviewDom(day, blockId)) renderDayBlocks(day);
      focusDayBlockInput(blockId);
    } else {
      previewDayBlockIds.add(blockId);
      if (!refreshDayBlockPreviewDom(day, blockId)) renderDayBlocks(day);
    }
    return;
  }
  const deleteChecklistButton = event.target.closest("[data-delete-checklist-item]");
  if (deleteChecklistButton) {
    event.preventDefault();
    event.stopPropagation();
    const blockElement = deleteChecklistButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || block.type !== "checklist") return;
    const nextText = checklistTextWithoutItem(block.text || "", deleteChecklistButton.dataset.deleteChecklistItem);
    await saveChecklistTextChange(day, block, nextText, "checklist-delete-item");
    return;
  }
  const moveChecklistButton = event.target.closest("[data-move-checklist-item]");
  if (moveChecklistButton) {
    event.preventDefault();
    event.stopPropagation();
    const blockElement = moveChecklistButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || block.type !== "checklist") return;
    const nextText = checklistTextWithMovedItem(block.text || "", moveChecklistButton.dataset.moveChecklistItem, moveChecklistButton.dataset.direction || "down");
    await saveChecklistTextChange(day, block, nextText, "checklist-move-item");
    return;
  }
  const checklistButton = event.target.closest("[data-toggle-checklist-item]");
  if (checklistButton) {
    event.preventDefault();
    const blockElement = checklistButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || block.type !== "checklist" || !requireEdit("更新检查清单")) return;
    const nextText = checklistTextWithToggledItem(block.text || "", checklistButton.dataset.toggleChecklistItem);
    await saveChecklistTextChange(day, block, nextText, "checklist-toggle");
    return;
  }
  const bulkButton = event.target.closest("[data-day-block-bulk]");
  if (bulkButton) {
    event.preventDefault();
    const action = bulkButton.dataset.dayBlockBulk || "";
    if (action === "all") {
      selectAllDayBlocks(normalizeDayBlocks(day.blocks || []));
      if (!refreshDayBlockSelectionDom(day)) renderDayBlocks(day);
      schedulePresenceTrack(0);
      dom.saveState.textContent = `已全选 ${selectedDayBlockIds.size} 个协作块`;
      return;
    }
    if (action === "clear") {
      clearSelectedDayBlocks();
      if (!refreshDayBlockSelectionDom(day)) renderDayBlocks(day);
      schedulePresenceTrack(0);
      dom.saveState.textContent = "已取消协作块选择";
      return;
    }
    if (!selectedDayBlockIds.size) return;
    if (action === "copy") {
      await duplicateSelectedDayBlocks(day);
      return;
    }
    if (action === "delete") {
      await deleteSelectedDayBlocks(day);
      return;
    }
    if (action === "done" || action === "open") {
      await setSelectedDayBlockDone(day, action === "done");
      return;
    }
    if (action === "indent" || action === "outdent") {
      await indentSelectedDayBlocks(day, action === "indent" ? 1 : -1);
      return;
    }
    if (DAY_BLOCK_TYPES.includes(action)) {
      await setSelectedDayBlockType(day, action);
      return;
    }
  }
  const filterBlockCommentButton = event.target.closest("[data-block-comment-filter]");
  if (filterBlockCommentButton) {
    event.preventDefault();
    const blockElement = filterBlockCommentButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    if (!blockId) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    blockCommentFilters[blockId] = filterBlockCommentButton.dataset.blockCommentFilter || "all";
    if (!refreshDayBlockCommentsDom(day, blockId)) renderDayBlocks(day);
    return;
  }
  const blockAnchorButton = event.target.closest("[data-block-comment-anchor]");
  if (blockAnchorButton) {
    event.preventDefault();
    const blockElement = blockAnchorButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    const comment = normalizeComments(block?.comments || []).find((item) => item.id === blockAnchorButton.dataset.blockCommentAnchor);
    if (comment?.anchor && focusCommentAnchor(comment.anchor)) {
      dom.saveState.textContent = "已定位到块级批注锚点";
    }
    return;
  }
  const focusBlockCommentButton = event.target.closest("[data-toggle-block-comments]");
  if (focusBlockCommentButton) {
    event.preventDefault();
    const blockId = focusBlockCommentButton.dataset.toggleBlockComments || "";
    const input = blockId ? dom.dayBlockList.querySelector(`[data-block-comment-input="${escapeHtml(blockId)}"]`) : null;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    input?.focus();
    return;
  }
  const collapseButton = event.target.closest("[data-toggle-day-block-collapse]");
  if (collapseButton) {
    event.preventDefault();
    const blockId = collapseButton.dataset.toggleDayBlockCollapse || "";
    if (!blockId) return;
    if (collapsedDayBlockIds.has(blockId)) {
      collapsedDayBlockIds.delete(blockId);
      dom.saveState.textContent = "已展开协作块";
    } else {
      collapsedDayBlockIds.add(blockId);
      dom.saveState.textContent = "已折叠协作块";
    }
    saveCollapsedDayBlocks();
    if (!refreshDayBlockCollapseDom(day, blockId)) renderDayBlocks(day);
    if (!collapsedDayBlockIds.has(blockId)) focusDayBlockInput(blockId);
    return;
  }
  const toggleButton = event.target.closest("[data-toggle-day-block]");
  if (toggleButton) {
    event.preventDefault();
    const blockId = toggleButton.dataset.toggleDayBlock;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || !requireEdit("更新协作块")) return;
    if (block.type === "divider") {
      dom.saveState.textContent = "分隔线不需要完成状态";
      return;
    }
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    const nextDone = !block.done;
    noteRemoteBlockEditors(blockId, nextDone ? "标记完成" : "重新打开");
    if (await updateDayBlockInDoc(day.id, blockId, { done: nextDone }, "local-day-block-toggle")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, done: nextDone, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      if (!refreshDayBlockDoneDom(day, [blockId])) renderDayBlocks(day);
      await logActivity(`${nextDone ? "完成" : "重新打开"}协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, blockId, { action: "toggle" }) });
      await saveCollaborativePlanChange("已更新协作块");
      return;
    }
    if (!mutate("更新协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === blockId ? { ...item, done: nextDone } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-toggle-fallback");
    await logActivity(`${nextDone ? "完成" : "重新打开"}协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(currentDay().id, blockId, { action: "toggle" }) });
    await saveCollaborativePlanChange("已更新协作块");
    if (!refreshDayBlockDoneDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
    return;
  }
  const replyBlockCommentButton = event.target.closest("[data-reply-block-comment]");
  if (replyBlockCommentButton) {
    event.preventDefault();
    const commentId = replyBlockCommentButton.dataset.replyBlockComment;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => normalizeComments(item.comments || []).some((comment) => comment.id === commentId && !comment.parentId));
    const comment = normalizeComments(block?.comments || []).find((item) => item.id === commentId && !item.parentId);
    if (!block || !comment || !requireEdit("回复块级评论")) return;
    activeBlockPresenceId = block.id;
    schedulePresenceTrack(0);
    blockReplyingCommentId = comment.id;
    if (!refreshDayBlockCommentsDom(day, block.id)) renderDayBlocks(day);
    const input = dom.dayBlockList.querySelector(`[data-block-comment-input="${escapeHtml(block.id)}"]`);
    input?.focus();
    return;
  }
  const resolveBlockCommentButton = event.target.closest("[data-toggle-block-comment-resolved]");
  if (resolveBlockCommentButton) {
    event.preventDefault();
    const commentId = resolveBlockCommentButton.dataset.toggleBlockCommentResolved;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => normalizeComments(item.comments || []).some((comment) => comment.id === commentId && !comment.parentId));
    const comment = normalizeComments(block?.comments || []).find((item) => item.id === commentId && !item.parentId);
    if (!block || !comment || !requireEdit("更新块级评论")) return;
    activeBlockPresenceId = block.id;
    schedulePresenceTrack(0);
    const patch = resolvedCommentPatch(comment.resolved);
    if (await updateDayBlockCommentInDoc(day.id, block.id, commentId, patch, "local-day-block-comment-resolve")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithUpdatedComment(item.comments || [], commentId, patch), updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      if (!refreshDayBlockCommentsDom(day, block.id)) renderDayBlocks(day);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}块级评论「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId, scope: "block", dayId: day.id || "", blockId: block.id || "" } });
      await saveCollaborativePlanChange("已更新块级评论");
      return;
    }
    if (!mutate("更新块级评论", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithUpdatedComment(item.comments || [], commentId, patch) } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-comment-resolve-fallback");
    await logActivity(`${comment.resolved ? "重新打开" : "解决"}块级评论「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId, scope: "block", dayId: currentDay().id || "", blockId: block.id || "" } });
    await saveCollaborativePlanChange("已更新块级评论");
    if (!refreshDayBlockCommentMutationViews(currentDay(), block.id)) renderDayBlocks(currentDay());
    return;
  }
  const deleteBlockCommentButton = event.target.closest("[data-delete-block-comment]");
  if (deleteBlockCommentButton) {
    event.preventDefault();
    const commentId = deleteBlockCommentButton.dataset.deleteBlockComment;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => normalizeComments(item.comments || []).some((comment) => comment.id === commentId));
    const comment = normalizeComments(block?.comments || []).find((item) => item.id === commentId);
    if (!block || !comment || !requireEdit("删除块级评论")) return;
    activeBlockPresenceId = block.id;
    schedulePresenceTrack(0);
    if (await deleteDayBlockCommentFromDoc(day.id, block.id, commentId, "local-day-block-comment-delete")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithoutThread(item.comments || [], commentId), updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      if (blockReplyingCommentId === commentId || !normalizeComments(currentDay()?.blocks?.find((item) => item.id === block.id)?.comments || []).some((item) => item.id === blockReplyingCommentId)) blockReplyingCommentId = "";
      if (!refreshDayBlockCommentsDom(day, block.id)) renderDayBlocks(day);
      await logActivity(`删除块级评论「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId, scope: "block", dayId: day.id || "", blockId: block.id || "", deleted: true } });
      await saveCollaborativePlanChange("已删除块级评论");
      return;
    }
    if (!mutate("删除块级评论", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithoutThread(item.comments || [], commentId) } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-comment-delete-fallback");
    await logActivity(`删除块级评论「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId, scope: "block", dayId: currentDay().id || "", blockId: block.id || "", deleted: true } });
    await saveCollaborativePlanChange("已删除块级评论");
    if (!refreshDayBlockCommentMutationViews(currentDay(), block.id)) renderDayBlocks(currentDay());
    return;
  }
  const moveButton = event.target.closest("[data-move-day-block]");
  if (moveButton) {
    event.preventDefault();
    const blockId = moveButton.dataset.moveDayBlock;
    const direction = moveButton.dataset.direction === "up" ? "up" : "down";
    await moveDayBlockByDirection(day, blockId, direction, "move");
    return;
  }
  const duplicateButton = event.target.closest("[data-duplicate-day-block]");
  if (duplicateButton) {
    event.preventDefault();
    const sourceBlockId = duplicateButton.dataset.duplicateDayBlock || "";
    const blocks = normalizeDayBlocks(day.blocks || []);
    const sourceIndex = blocks.findIndex((item) => item.id === sourceBlockId);
    const sourceBlock = sourceIndex >= 0 ? blocks[sourceIndex] : null;
    if (!sourceBlock || !requireEdit("复制协作块")) return;
    if (!confirmRemoteDayBlockEdit(sourceBlockId, "复制")) return;
    noteRemoteBlockEditors(sourceBlockId, "复制");
    const duplicateBlock = normalizeDayBlock({
      ...sourceBlock,
      id: uid(),
      text: sourceBlock.text ? `${sourceBlock.text} 副本` : dayBlockTypeLabel(sourceBlock.type),
      textYjs: "",
      comments: [],
      done: false,
      createdBy: getCollabName(),
      createdAt: new Date().toISOString(),
      updatedBy: "",
      updatedAt: "",
    });
    if (!duplicateBlock) return;
    activeBlockPresenceId = duplicateBlock.id;
    schedulePresenceTrack(0);
    const insertIndex = sourceIndex + 1;
    const added = await addDayBlockToDoc(day.id, duplicateBlock, "local-day-block-duplicate", insertIndex);
    if (added) {
      const addedBlock = added === true ? duplicateBlock : added;
      day.blocks = insertDayBlockList(day.blocks || [], addedBlock, insertIndex);
      if (!refreshDayBlockInsertDom(day, [addedBlock.id], addedBlock.id)) renderDayBlocks(day);
      focusDayBlockInput(addedBlock.id);
      await logActivity(`复制协作块「${sourceBlock.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, addedBlock.id, { action: "duplicate", sourceBlockId }) });
      await saveCollaborativePlanChange("已复制协作块");
      focusDayBlockInput(addedBlock.id);
      return;
    }
    if (!mutate("复制协作块", () => {
      currentDay().blocks = insertDayBlockList(currentDay().blocks || [], duplicateBlock, insertIndex);
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-duplicate-fallback");
    if (!refreshDayBlockInsertDom(currentDay(), [duplicateBlock.id], duplicateBlock.id)) renderDayBlocks(currentDay());
    focusDayBlockInput(duplicateBlock.id);
    await logActivity(`复制协作块「${sourceBlock.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, duplicateBlock.id, { action: "duplicate", sourceBlockId }) });
    await saveCollaborativePlanChange("已复制协作块");
    focusDayBlockInput(duplicateBlock.id);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-day-block]");
  if (deleteButton) {
    event.preventDefault();
    const blockId = deleteButton.dataset.deleteDayBlock;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || !requireEdit("删除协作块")) return;
    if (!confirmRemoteDayBlockEdit(blockId, "删除")) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    noteRemoteBlockEditors(blockId, "删除");
    if (await deleteDayBlockFromDoc(day.id, blockId, "local-day-block-delete")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).filter((item) => item.id !== blockId));
      if (!refreshDayBlockDeleteDom(day, [blockId])) renderDayBlocks(day);
      await logActivity(`删除协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, blockId, { deleted: true }) });
      await saveCollaborativePlanChange("已删除协作块");
      return;
    }
    if (!mutate("删除协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).filter((item) => item.id !== blockId));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-delete-fallback");
    await logActivity(`删除协作块「${block.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(currentDay().id, blockId, { deleted: true }) });
    await saveCollaborativePlanChange("已删除协作块");
    if (!refreshDayBlockDeleteDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
  }
});

dom.dayBlockList?.addEventListener("submit", async (event) => {
  const checklistForm = event.target.closest("[data-add-checklist-item]");
  if (checklistForm) {
    event.preventDefault();
    const day = currentDay();
    const blockId = checklistForm.dataset.addChecklistItem || "";
    const input = checklistForm.querySelector("[data-add-checklist-input]");
    const text = input?.value?.trim() || "";
    const block = normalizeDayBlocks(day?.blocks || []).find((item) => item.id === blockId);
    if (!text || !day || !block) return;
    const saved = await saveChecklistTextChange(day, block, checklistTextWithAddedItem(block.text || "", text), "checklist-add-item");
    if (saved && input) {
      input.value = "";
      requestAnimationFrame(() => {
        dom.dayBlockList?.querySelector(`[data-add-checklist-input="${CSS.escape(blockId)}"]`)?.focus();
      });
    }
    return;
  }
  const form = event.target.closest("[data-block-comment-form]");
  if (!form) return;
  event.preventDefault();
  const day = currentDay();
  const blockId = form.dataset.blockCommentForm || "";
  const input = form.querySelector("[data-block-comment-input]");
  const text = input?.value?.trim() || "";
  const block = normalizeDayBlocks(day?.blocks || []).find((item) => item.id === blockId);
  if (!day || !block || !text || !requireEdit(blockReplyingCommentId ? "回复块级评论" : "添加块级评论")) return;
  activeBlockPresenceId = block.id;
  schedulePresenceTrack(0);
  const parentId = blockReplyingCommentId && normalizeComments(block.comments || []).some((comment) => comment.id === blockReplyingCommentId && !comment.parentId)
    ? blockReplyingCommentId
    : "";
  const anchor = parentId ? null : currentBlockCommentAnchor(block.id);
  const collaborativeComment = await addDayBlockCommentToDoc(day.id, block.id, text, parentId, parentId ? "local-day-block-comment-reply" : "local-day-block-comment-add", anchor);
  if (collaborativeComment) {
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (
      item.id === block.id
        ? { ...item, comments: normalizeComments([...(item.comments || []), collaborativeComment]), updatedBy: getCollabName(), updatedAt: new Date().toISOString() }
        : item
    )));
    if (input) input.value = "";
    blockReplyingCommentId = "";
    if (!refreshDayBlockCommentsDom(day, block.id)) renderDayBlocks(day);
    await logActivity(`${parentId ? "回复" : "评论"}协作块「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId: parentId || collaborativeComment.id, scope: "block", dayId: day.id || "", blockId: block.id || "" } });
    await saveCollaborativePlanChange(parentId ? "已回复块级评论" : "已添加块级评论");
    return;
  }
  const fallbackAnchor = parentId ? null : normalizeCommentAnchor(anchor);
  const fallbackComment = normalizeCommentEntry({
    id: uid(),
    parentId,
    author: getCollabName(),
    text,
    at: new Date().toISOString(),
    ...(fallbackAnchor ? { anchor: fallbackAnchor } : {}),
  });
  if (!fallbackComment) return;
  if (!mutate(parentId ? "回复块级评论" : "添加块级评论", () => {
    currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (
      item.id === block.id
        ? { ...item, comments: normalizeComments([...(item.comments || []), fallbackComment]) }
        : item
    )));
    if (input) input.value = "";
    blockReplyingCommentId = "";
  }, { requireUnlocked: false, save: false, render: false })) return;
  await syncDayBlocksToDoc(currentDay().id, parentId ? "local-day-block-comment-reply-fallback" : "local-day-block-comment-add-fallback");
  await logActivity(`${parentId ? "回复" : "评论"}协作块「${block.text.slice(0, 18)}」`, { target: { type: "comment", commentId: parentId || fallbackComment.id, scope: "block", dayId: currentDay().id || "", blockId: block.id || "" } });
  await saveCollaborativePlanChange(parentId ? "已回复块级评论" : "已添加块级评论");
  if (!refreshDayBlockCommentMutationViews(currentDay(), block.id)) renderDayBlocks(currentDay());
});

dom.dayBlockList?.addEventListener("focusin", (event) => {
  const blockElement = event.target.closest?.("[data-day-block]");
  if (!blockElement?.dataset.dayBlock) return;
  activeBlockPresenceId = blockElement.dataset.dayBlock;
  schedulePresenceTrack(0);
});

dom.dayBlockList?.addEventListener("focusout", (event) => {
  const blockElement = event.target.closest?.("[data-day-block]");
  if (!blockElement?.dataset.dayBlock) return;
  window.setTimeout(() => {
    if (!dom.dayBlockList?.contains(document.activeElement)) clearDayBlockCommandMenu();
    if (dom.dayBlockList?.contains(document.activeElement)) {
      const nextBlock = document.activeElement.closest?.("[data-day-block]");
      activeBlockPresenceId = nextBlock?.dataset.dayBlock || "";
    } else {
      activeBlockPresenceId = "";
    }
    schedulePresenceTrack(80);
  }, 0);
});

function clearDayBlockDragState() {
  draggingDayBlockId = "";
  dom.dayBlockList?.querySelectorAll(".is-dragging, .is-drag-over").forEach((item) => {
    item.classList.remove("is-dragging", "is-drag-over");
  });
}

dom.dayBlockList?.addEventListener("dragstart", (event) => {
  const blockElement = event.target.closest?.("[data-day-block]");
  const dragHandle = event.target.closest?.("[data-drag-day-block]");
  if (!blockElement?.dataset.dayBlock || !dragHandle || isReadonlyMode || !canEdit()) {
    event.preventDefault();
    return;
  }
  draggingDayBlockId = blockElement.dataset.dayBlock;
  activeBlockPresenceId = draggingDayBlockId;
  blockElement.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggingDayBlockId);
  schedulePresenceTrack(0);
});

dom.dayBlockList?.addEventListener("dragover", (event) => {
  if (!draggingDayBlockId) return;
  const blockElement = event.target.closest?.("[data-day-block]");
  if (!blockElement?.dataset.dayBlock || blockElement.dataset.dayBlock === draggingDayBlockId) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  dom.dayBlockList.querySelectorAll(".is-drag-over").forEach((item) => item.classList.remove("is-drag-over"));
  blockElement.classList.add("is-drag-over");
});

dom.dayBlockList?.addEventListener("dragleave", (event) => {
  const blockElement = event.target.closest?.("[data-day-block]");
  if (!blockElement || blockElement.contains(event.relatedTarget)) return;
  blockElement.classList.remove("is-drag-over");
});

dom.dayBlockList?.addEventListener("drop", async (event) => {
  if (!draggingDayBlockId) return;
  const day = currentDay();
  const targetElement = event.target.closest?.("[data-day-block]");
  const targetBlockId = targetElement?.dataset.dayBlock || "";
  if (!day || !targetBlockId || targetBlockId === draggingDayBlockId || !requireEdit("拖拽排序协作块")) {
    clearDayBlockDragState();
    return;
  }
  event.preventDefault();
  const blocks = normalizeDayBlocks(day.blocks || []);
  const targetIndex = blocks.findIndex((block) => block.id === targetBlockId);
  const draggedBlock = blocks.find((block) => block.id === draggingDayBlockId);
  if (targetIndex < 0 || !draggedBlock) {
    clearDayBlockDragState();
    return;
  }
  const draggedId = draggingDayBlockId;
  if (!confirmRemoteDayBlockEdit([draggedId, targetBlockId], "拖拽排序")) {
    clearDayBlockDragState();
    return;
  }
  activeBlockPresenceId = draggedId;
  noteRemoteBlockEditors(draggedId, "拖拽排序");
  if (await reorderDayBlockInDoc(day.id, draggedId, targetIndex, "local-day-block-drag-reorder")) {
    day.blocks = reorderDayBlockList(day.blocks || [], draggedId, targetIndex, {
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    clearDayBlockDragState();
    if (!refreshDayBlockOrderDom(day, draggedId)) renderDayBlocks(day);
    await logActivity(`拖拽排序协作块「${draggedBlock.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(day.id, draggedId, { action: "drag", targetIndex }) });
    await saveCollaborativePlanChange("已拖拽排序协作块");
    return;
  }
  if (!mutate("拖拽排序协作块", () => {
    currentDay().blocks = reorderDayBlockList(currentDay().blocks || [], draggedId, targetIndex);
  }, { requireUnlocked: false, save: false, render: false })) {
    clearDayBlockDragState();
    return;
  }
  await syncDayBlocksToDoc(currentDay().id, "local-day-block-drag-reorder-fallback");
  clearDayBlockDragState();
  await logActivity(`拖拽排序协作块「${draggedBlock.text.slice(0, 18)}」`, { target: dayBlockActivityTarget(currentDay().id, draggedId, { action: "drag", targetIndex }) });
  await saveCollaborativePlanChange("已拖拽排序协作块");
  if (!refreshDayBlockOrderDom(currentDay(), draggedId)) renderDayBlocks(currentDay());
});

dom.dayBlockList?.addEventListener("dragend", () => {
  clearDayBlockDragState();
  schedulePresenceTrack(120);
});

dom.dayBlockList?.addEventListener("keydown", async (event) => {
  const input = event.target.closest("[data-edit-day-block]");
  if (!input || !canEdit() || isReadonlyMode) return;
  const day = currentDay();
  const blockId = input.dataset.editDayBlock;
  const blocks = normalizeDayBlocks(day?.blocks || []);
  const blockIndex = blocks.findIndex((block) => block.id === blockId);
  const block = blockIndex >= 0 ? blocks[blockIndex] : null;
  if (!day || !block) return;
  const shortcutKey = String(event.key || "").toLowerCase();
  const formatShortcut = (event.ctrlKey || event.metaKey) && !event.altKey
    ? shortcutKey === "b"
      ? "bold"
      : shortcutKey === "i"
        ? "italic"
        : shortcutKey === "k"
          ? "link"
          : shortcutKey === "e" || event.key === "`"
          ? "code"
          : ""
    : "";
  if (formatShortcut) {
    event.preventDefault();
    await formatDayBlockInput(day, block, input, formatShortcut);
    return;
  }
  if (event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
    event.preventDefault();
    await moveDayBlockByDirection(day, blockId, event.key === "ArrowUp" ? "up" : "down", "keyboard-move");
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    if (!requireEdit(event.shiftKey ? "减少协作块缩进" : "增加协作块缩进")) return;
    const nextLevel = Math.max(0, Math.min((Number(block.level) || 0) + (event.shiftKey ? -1 : 1), 3));
    if (nextLevel === (Number(block.level) || 0)) return;
    if (!confirmRemoteDayBlockEdit(blockId, event.shiftKey ? "减少缩进" : "增加缩进")) return;
    activeBlockPresenceId = blockId;
    const patch = { level: nextLevel };
    if (await updateDayBlockInDoc(day.id, blockId, patch, "local-day-block-indent")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, ...patch, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      if (!refreshDayBlockLevelDom(day, [blockId])) renderDayBlocks(day);
      focusDayBlockInput(blockId);
      await logActivity(`${event.shiftKey ? "减少" : "增加"}协作块缩进`, { target: dayBlockActivityTarget(day.id, blockId, { action: "indent", level: nextLevel }) });
      await saveCollaborativePlanChange("已调整协作块缩进");
      focusDayBlockInput(blockId);
      return;
    }
    if (!mutate(event.shiftKey ? "减少协作块缩进" : "增加协作块缩进", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === blockId ? { ...item, ...patch } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(day.id, "local-day-block-indent-fallback");
    if (!refreshDayBlockLevelDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
    focusDayBlockInput(blockId);
    await logActivity(`${event.shiftKey ? "减少" : "增加"}协作块缩进`, { target: dayBlockActivityTarget(day.id, blockId, { action: "indent", level: nextLevel }) });
    await saveCollaborativePlanChange("已调整协作块缩进");
    focusDayBlockInput(blockId);
    return;
  }
  const commandQuery = dayBlockCommandQueryFromValue(input.value);
  const commandCandidates = dayBlockCommandCandidates(commandQuery);
  if (commandQuery && commandCandidates.length) {
    if (event.key === "Escape") {
      event.preventDefault();
      clearDayBlockCommandMenu();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      activeDayBlockCommand = {
        blockId,
        query: commandQuery,
        index: (activeDayBlockCommand.index + direction + commandCandidates.length) % commandCandidates.length,
      };
      renderDayBlockCommandMenu(input);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      await applyDayBlockCommandSelection(input, activeDayBlockCommand.index);
      return;
    }
  } else if (activeDayBlockCommand.blockId === blockId) {
    clearDayBlockCommandMenu();
  }
  const slashType = dayBlockSlashCommand(input.value);
  if (slashType && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    clearTimeout(dayBlockEditTimer);
    await applyDayBlockTypeChange(day, blockId, slashType, {
      clearText: true,
      source: "local-day-block-slash-command",
      fallbackSource: "local-day-block-slash-command-fallback",
      presence: "使用斜杠命令",
      action: "slash-command",
      requireLabel: "切换协作块类型",
      status: "已切换协作块类型",
    });
    return;
  }
  const shortcutType = dayBlockMarkdownShortcut(input.value);
  if (shortcutType && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    clearTimeout(dayBlockEditTimer);
    await applyDayBlockTypeChange(day, blockId, shortcutType, {
      clearText: true,
      source: "local-day-block-markdown-shortcut",
      fallbackSource: "local-day-block-markdown-shortcut-fallback",
      presence: "使用快捷标记",
      action: "markdown-shortcut",
      requireLabel: "使用快捷标记切换协作块类型",
      status: "已用快捷标记切换协作块类型",
    });
    return;
  }
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    const cursorStart = input.selectionStart ?? input.value.length;
    const cursorEnd = input.selectionEnd ?? cursorStart;
    const beforeText = input.value.slice(0, cursorStart).trim();
    const afterText = input.value.slice(cursorEnd).trim();
    const newBlock = normalizeDayBlock({
      id: uid(),
      type: block.type || "note",
      level: block.level || 0,
      text: afterText,
      createdBy: getCollabName(),
      createdAt: new Date().toISOString(),
    });
    if (!newBlock || !requireEdit(afterText ? "拆分协作块" : "新增协作块")) return;
    if (!confirmRemoteDayBlockEdit(blockId, afterText ? "拆分" : "新增下方块")) return;
    activeBlockPresenceId = newBlock.id;
    noteRemoteBlockEditors(blockId, afterText ? "拆分" : "新增下方块");
    const insertIndex = blockIndex + 1;
    const splitPatch = { text: beforeText, textYjs: "" };
    let textUpdateResult = true;
    if (beforeText !== block.text) {
      textUpdateResult = await updateDayBlockTextInDoc(day.id, blockId, beforeText, "local-day-block-keyboard-split-text");
    }
    const textUpdated = Boolean(textUpdateResult);
    const visibleSplitPatch = typeof textUpdateResult === "object" ? { ...splitPatch, ...textUpdateResult } : splitPatch;
    const added = textUpdated ? await addDayBlockToDoc(day.id, newBlock, "local-day-block-keyboard-add", insertIndex) : false;
    if (added) {
      const addedBlock = added === true ? newBlock : added;
      const withSplitText = normalizeDayBlocks((day.blocks || []).map((item) => (
        item.id === blockId ? { ...item, ...visibleSplitPatch, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item
      )));
      day.blocks = insertDayBlockList(withSplitText, addedBlock, insertIndex);
      if (!refreshDayBlockTextDom(day, [blockId])) renderDayBlocks(day);
      if (!refreshDayBlockInsertDom(day, [addedBlock.id], addedBlock.id)) renderDayBlocks(day);
      focusDayBlockInput(addedBlock.id);
      await logActivity(afterText ? "用键盘拆分协作块" : "用键盘新增协作块", { target: dayBlockActivityTarget(day.id, addedBlock.id, { action: afterText ? "keyboard-split" : "keyboard-add" }) });
      await saveCollaborativePlanChange(afterText ? "已用键盘拆分协作块" : "已用键盘新增协作块");
      focusDayBlockInput(addedBlock.id);
      return;
    }
    if (!mutate(afterText ? "用键盘拆分协作块" : "用键盘新增协作块", () => {
      const splitBlocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (
        item.id === blockId ? { ...item, ...splitPatch } : item
      )));
      currentDay().blocks = insertDayBlockList(splitBlocks, newBlock, insertIndex);
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(day.id, "local-day-block-keyboard-add-fallback");
    if (!refreshDayBlockTextDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
    if (!refreshDayBlockInsertDom(currentDay(), [newBlock.id], newBlock.id)) renderDayBlocks(currentDay());
    focusDayBlockInput(newBlock.id);
    await logActivity(afterText ? "用键盘拆分协作块" : "用键盘新增协作块", { target: dayBlockActivityTarget(day.id, newBlock.id, { action: afterText ? "keyboard-split" : "keyboard-add" }) });
    await saveCollaborativePlanChange(afterText ? "已用键盘拆分协作块" : "已用键盘新增协作块");
    focusDayBlockInput(newBlock.id);
    return;
  }
  if (event.key === "Backspace" && !event.isComposing && !input.value.trim() && blocks.length > 1) {
    event.preventDefault();
    const previousBlockId = blocks[Math.max(0, blockIndex - 1)]?.id || blocks[blockIndex + 1]?.id || "";
    if (!requireEdit("删除空白协作块")) return;
    if (!confirmRemoteDayBlockEdit(blockId, "删除空白块")) return;
    if (await deleteDayBlockFromDoc(day.id, blockId, "local-day-block-keyboard-delete-empty")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).filter((item) => item.id !== blockId));
      activeBlockPresenceId = previousBlockId;
      if (!refreshDayBlockDeleteDom(day, [blockId])) renderDayBlocks(day);
      focusDayBlockInput(previousBlockId);
      await logActivity("删除空白协作块", { target: dayBlockActivityTarget(day.id, blockId, { deleted: true, action: "keyboard-delete-empty" }) });
      await saveCollaborativePlanChange("已删除空白协作块");
      focusDayBlockInput(previousBlockId);
      return;
    }
    if (!mutate("删除空白协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).filter((item) => item.id !== blockId));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(day.id, "local-day-block-keyboard-delete-empty-fallback");
    activeBlockPresenceId = previousBlockId;
    if (!refreshDayBlockDeleteDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
    focusDayBlockInput(previousBlockId);
    await logActivity("删除空白协作块", { target: dayBlockActivityTarget(day.id, blockId, { deleted: true, action: "keyboard-delete-empty" }) });
    await saveCollaborativePlanChange("已删除空白协作块");
    focusDayBlockInput(previousBlockId);
    return;
  }
  if (event.key === "Backspace" && !event.isComposing && input.selectionStart === 0 && input.selectionEnd === 0 && blockIndex > 0 && input.value.trim()) {
    event.preventDefault();
    const previousBlock = blocks[blockIndex - 1];
    if (!previousBlock || !requireEdit("合并协作块")) return;
    if (!confirmRemoteDayBlockEdit([blockId, previousBlock.id], "合并")) return;
    noteRemoteBlockEditors(blockId, "合并");
    noteRemoteBlockEditors(previousBlock.id, "合并");
    const mergedText = `${previousBlock.text || ""}${previousBlock.text ? " " : ""}${input.value.trim()}`.trim();
    const mergedComments = normalizeComments([...(previousBlock.comments || []), ...(block.comments || [])]);
    const previousPatch = { text: mergedText, textYjs: "", comments: mergedComments, level: previousBlock.level || 0 };
    const previousUpdated = await updateDayBlockInDoc(day.id, previousBlock.id, previousPatch, "local-day-block-keyboard-merge-previous");
    const deleted = previousUpdated ? await deleteDayBlockFromDoc(day.id, blockId, "local-day-block-keyboard-merge-delete") : false;
    if (deleted) {
      const visiblePreviousPatch = typeof previousUpdated === "object" ? { ...previousPatch, ...previousUpdated } : previousPatch;
      day.blocks = normalizeDayBlocks((day.blocks || [])
        .map((item) => (item.id === previousBlock.id ? { ...item, ...visiblePreviousPatch, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item))
        .filter((item) => item.id !== blockId));
      activeBlockPresenceId = previousBlock.id;
      if (!refreshDayBlockTextDom(day, [previousBlock.id])) renderDayBlocks(day);
      if (!refreshDayBlockCommentsDom(day, previousBlock.id)) renderDayBlocks(day);
      if (!refreshDayBlockDeleteDom(day, [blockId])) renderDayBlocks(day);
      focusDayBlockInput(previousBlock.id);
      await logActivity("用键盘合并协作块", { target: dayBlockActivityTarget(day.id, previousBlock.id, { action: "keyboard-merge", mergedBlockId: blockId }) });
      await saveCollaborativePlanChange("已用键盘合并协作块");
      focusDayBlockInput(previousBlock.id);
      return;
    }
    if (!mutate("用键盘合并协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || [])
        .map((item) => (item.id === previousBlock.id ? { ...item, ...previousPatch } : item))
        .filter((item) => item.id !== blockId));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(day.id, "local-day-block-keyboard-merge-fallback");
    activeBlockPresenceId = previousBlock.id;
    if (!refreshDayBlockTextDom(currentDay(), [previousBlock.id])) renderDayBlocks(currentDay());
    if (!refreshDayBlockCommentsDom(currentDay(), previousBlock.id)) renderDayBlocks(currentDay());
    if (!refreshDayBlockDeleteDom(currentDay(), [blockId])) renderDayBlocks(currentDay());
    focusDayBlockInput(previousBlock.id);
    await logActivity("用键盘合并协作块", { target: dayBlockActivityTarget(day.id, previousBlock.id, { action: "keyboard-merge", mergedBlockId: blockId }) });
    await saveCollaborativePlanChange("已用键盘合并协作块");
    focusDayBlockInput(previousBlock.id);
  }
});

dom.dayBlockList?.addEventListener("input", async (event) => {
  const input = event.target.closest("[data-edit-day-block]");
  if (!input || !canEdit() || isReadonlyMode) return;
  activeBlockPresenceId = input.closest("[data-day-block]")?.dataset.dayBlock || activeBlockPresenceId;
  renderDayBlockCommandMenu(input);
  schedulePresenceTrack(0);
  const day = currentDay();
  const blockId = input.dataset.editDayBlock;
  const text = input.value.trim();
  if (!day || !blockId) return;
  await syncDayBlockInputText(day, blockId, text, input);
  clearTimeout(dayBlockEditTimer);
  dayBlockEditTimer = setTimeout(async () => {
    const latestDay = currentDay();
    const latestText = input.value.trim();
    if (!latestDay || !blockId) return;
    await logActivity(`编辑协作块「${latestText.slice(0, 18)}」`, { target: dayBlockActivityTarget(latestDay.id, blockId, { action: "text" }) });
    scheduleCollaborativePlanSave("协作块已更新", 250);
  }, 650);
});

["focusin", "click", "keyup", "select"].forEach((eventName) => {
  dom.dayBlockList?.addEventListener(eventName, (event) => {
    const input = event.target.closest?.("[data-edit-day-block]");
    if (!input || isReadonlyMode) return;
    activeBlockPresenceId = input.closest("[data-day-block]")?.dataset.dayBlock || activeBlockPresenceId;
    if (eventName === "focusin" || eventName === "click" || eventName === "keyup") renderDayBlockCommandMenu(input);
    const anchor = buildBlockCommentAnchor(activeBlockPresenceId);
    if (anchor) lastCommentAnchor = { ...anchor, capturedAt: Date.now() };
    schedulePresenceTrack(eventName === "focusin" ? 0 : 90);
  });
});

document.addEventListener("click", (event) => {
  const highlight = event.target.closest("[data-comment-highlight]");
  if (highlight) {
    event.preventDefault();
    const scope = highlight.dataset.commentScope || "stop";
    const blockId = highlight.closest("[data-day-block]")?.dataset.dayBlock || "";
    const block = blockId ? normalizeDayBlocks(currentDay()?.blocks || []).find((item) => item.id === blockId) : null;
    const source = scope === "block" ? block?.comments || [] : scope === "day" ? currentDay()?.comments || [] : currentStop()?.comments || [];
    const comment = commentRootsAndReplies(source).roots.find((item) => item.id === highlight.dataset.commentHighlight);
    if (!comment) return;
    if (scope === "block") {
      blockCommentFilters[blockId] = comment.resolved ? "resolved" : "open";
      if (!refreshDayBlockCommentsDom(currentDay(), blockId)) renderDayBlocks(currentDay());
      const thread = Array.from(dom.dayBlockList?.querySelectorAll(`[data-block-comments="${CSS.escape(blockId)}"] [data-comment]`) || []).find((item) => item.dataset.comment === comment.id);
      if (thread) {
        thread.scrollIntoView({ block: "nearest", behavior: "smooth" });
        thread.classList.add("is-focused");
        setTimeout(() => thread.classList.remove("is-focused"), 1300);
        dom.saveState.textContent = `已定位到${commentAnchorLabel(comment.anchor)}的块级批注`;
      }
    } else if (scope === "day") {
      dayCommentFilter = comment.resolved ? "resolved" : "open";
      renderDayComments(currentDay());
      if (focusDayCommentThread(comment.id)) dom.saveState.textContent = `已定位到${commentAnchorLabel(comment.anchor)}的当天批注`;
    } else {
      commentFilter = comment.resolved ? "resolved" : "open";
      renderStopComments(currentStop());
      if (focusCommentThread(comment.id)) dom.saveState.textContent = `已定位到${commentAnchorLabel(comment.anchor)}的批注`;
    }
    return;
  }
  const mark = event.target.closest("[data-field-comment-mark]");
  if (!mark) return;
  event.preventDefault();
  const field = mark.dataset.fieldCommentMark;
  const meta = collabTextFieldMeta(field);
  const scope = meta?.scope || "stop";
  const { roots } = commentRootsAndReplies(scope === "day" ? currentDay()?.comments || [] : currentStop()?.comments || []);
  const matching = roots.filter((comment) => comment.anchor?.field === field);
  const firstOpen = matching.find((comment) => !comment.resolved);
  const target = firstOpen || matching[0];
  if (!target) return;
  if (scope === "day") {
    dayCommentFilter = firstOpen ? "open" : "all";
    renderDayComments(currentDay());
    if (focusDayCommentThread(target.id)) dom.saveState.textContent = `已定位到${commentAnchorLabel(target.anchor)}的当天批注`;
  } else {
    commentFilter = firstOpen ? "open" : "all";
    renderStopComments(currentStop());
    if (focusCommentThread(target.id)) dom.saveState.textContent = `已定位到${commentAnchorLabel(target.anchor)}的批注`;
  }
});

dom.commentFocusBtn.addEventListener("click", () => {
  dom.commentInput.focus();
});

dom.cancelCandidateEditBtn?.addEventListener("click", () => {
  clearQuickPlaceForm();
  renderCandidates();
  dom.saveState.textContent = "已取消编辑备选地点";
});

dom.recommendLodgingBtn?.addEventListener("click", () => {
  addServiceRecommendations("lodging").catch((error) => {
    dom.saveState.textContent = `生成住宿推荐失败：${error.message}`;
  });
});

dom.recommendDiningBtn?.addEventListener("click", () => {
  addServiceRecommendations("dining").catch((error) => {
    dom.saveState.textContent = `生成餐饮推荐失败：${error.message}`;
  });
});

dom.addLodgingBtn?.addEventListener("click", () => prefillServiceQuickAdd("lodging"));

dom.addDiningBtn?.addEventListener("click", () => prefillServiceQuickAdd("dining"));

dom.importLodgingBtn?.addEventListener("click", () => openExternalImport("民宿/酒店"));

dom.importDiningBtn?.addEventListener("click", () => openExternalImport("美团/点评"));

[dom.lodgingBoard, dom.diningBoard].forEach((board) => {
  board?.addEventListener("click", async (event) => {
    const toggleButton = event.target.closest("[data-service-toggle-candidate]");
    if (toggleButton) {
      event.preventDefault();
      await toggleCandidateSelection(toggleButton.dataset.serviceToggleCandidate);
      return;
    }
    const editButton = event.target.closest("[data-service-edit-candidate]");
    if (editButton) {
      event.preventDefault();
      const candidate = state.candidates.find((item) => item.id === editButton.dataset.serviceEditCandidate);
      if (!candidate || !requireEdit("编辑备选地点")) return;
      if (!confirmRemoteCandidateEdit(candidate.id, "编辑备选地点")) return;
      setCandidateEditing(candidate);
      renderCandidates();
      renderStayFoodBoards();
      dom.quickPlaceName.focus();
      dom.quickAddForm.scrollIntoView({ block: "center", behavior: "smooth" });
      dom.saveState.textContent = `正在编辑备选「${candidate.title}」`;
      return;
    }
    const addButton = event.target.closest("[data-service-add-candidate]");
    if (addButton) {
      event.preventDefault();
      await addCandidateToCurrentDay(addButton.dataset.serviceAddCandidate, "住宿餐饮备选");
      return;
    }
    const focusButton = event.target.closest("[data-service-focus-stop]");
    if (focusButton) {
      event.preventDefault();
      const [dayIndexText, stopIndexText] = String(focusButton.dataset.serviceFocusStop || "").split(":");
      const dayIndex = Number(dayIndexText);
      const stopIndex = Number(stopIndexText);
      if (!Number.isFinite(dayIndex) || !Number.isFinite(stopIndex) || !state.days[dayIndex]?.stops?.[stopIndex]) return;
      activeDay = dayIndex;
      activeStop = stopIndex;
      render();
      dom.saveState.textContent = "已定位到住宿/餐饮行程项";
    }
  });
});

dom.candidateGrid.addEventListener("click", async (event) => {
  const selectButton = event.target.closest("[data-toggle-candidate-selected]");
  if (selectButton) {
    event.preventDefault();
    event.stopPropagation();
    await toggleCandidateSelection(selectButton.dataset.toggleCandidateSelected);
    return;
  }
  const editButton = event.target.closest("[data-edit-candidate]");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const candidate = state.candidates.find((item) => item.id === editButton.dataset.editCandidate);
    if (!candidate || !requireEdit("编辑备选地点")) return;
    if (!confirmRemoteCandidateEdit(candidate.id, "编辑备选地点")) return;
    setCandidateEditing(candidate);
    renderCandidates();
    dom.quickPlaceName.focus();
    dom.saveState.textContent = `正在编辑备选「${candidate.title}」`;
    return;
  }
  const deleteButton = event.target.closest("[data-delete-candidate]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    const candidateId = deleteButton.dataset.deleteCandidate;
    const candidate = state.candidates.find((item) => item.id === candidateId);
    if (!candidate || !requireEdit("移除备选地点")) return;
    if (!confirmRemoteCandidateEdit(candidateId, "移除备选地点")) return;
    if (await deleteCandidateFromDoc(candidateId)) {
      if (editingCandidateId === candidateId) clearQuickPlaceForm();
      await logActivity(`移除备选「${candidate.title}」`, { target: candidateActivityTarget(candidateId, { deleted: true, action: "delete" }) });
      await saveCollaborativePlanChange(`移除备选「${candidate.title}」`);
      dom.saveState.textContent = `已移除备选「${candidate.title}」`;
      return;
    }
    mutate(`移除备选「${candidate.title}」`, () => {
      state.candidates = mergedCandidatesWithPatch("delete", null, candidateId);
      if (editingCandidateId === candidateId) clearQuickPlaceForm();
    }, { requireUnlocked: false, save: false, activityTarget: candidateActivityTarget(candidateId, { deleted: true, action: "delete" }) });
    await syncCandidatesToDoc("local-candidate-delete-fallback");
    await saveCollaborativePlanChange(`移除备选「${candidate.title}」`);
    return;
  }
  if (event.target.closest(".candidate-reference")) return;
  const button = event.target.closest("[data-candidate]");
  if (!button) return;
  const candidate = state.candidates[Number(button.dataset.candidate)];
  await addCandidateToCurrentDay(candidate?.id, "备选");
});

dom.candidateGrid.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const card = event.target.closest("[data-candidate]");
  if (!card || event.target.closest("[data-delete-candidate], [data-edit-candidate], [data-toggle-candidate-selected], .candidate-reference")) return;
  event.preventDefault();
  card.click();
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
    clearDateScoutResults("偏好已变化，请重新筛选日期");
  });
});

dom.dateScoutSearchBtn?.addEventListener("click", () => {
  scoutTripDates().catch((error) => {
    dom.dateScoutStatus.textContent = `筛选失败：${error.message}`;
    dom.dateScoutResults.innerHTML = `<p class="empty-state">暂时无法筛选日期。可以先手动选择日期，再继续创建计划。</p>`;
    dom.dateScoutSearchBtn.disabled = false;
    refreshIcons();
  });
});

dom.dateScoutResults?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-apply-date-scout]");
  const card = event.target.closest("[data-date-scout]");
  const optionId = button?.dataset.applyDateScout || card?.dataset.dateScout || "";
  if (!optionId) return;
  applyDateScoutOption(optionId);
});

dom.dateScoutDays?.addEventListener("input", () => {
  clearDateScoutResults("旅行天数已变化，请重新筛选日期");
});

dom.dateScoutStart?.addEventListener("input", () => {
  clearDateScoutResults("可出行范围已变化，请重新筛选日期");
});

dom.dateScoutEnd?.addEventListener("input", () => {
  clearDateScoutResults("可出行范围已变化，请重新筛选日期");
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
  if (dom.endDateInput.value !== end) dom.endDateInput.value = end;
  renderGuideResult();
  return {
    startDate: start,
    endDate: end,
    dateRange: dateRangeText(start, end),
  };
}

dom.transportFilterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  transportFilterApplied = true;
  renderTransport();
  refreshIcons();
});

dom.transportList.addEventListener("click", async (event) => {
  const selectButton = event.target.closest("[data-toggle-quote-selected]");
  if (selectButton) {
    event.preventDefault();
    event.stopPropagation();
    await toggleTransportQuoteSelection(selectButton.dataset.toggleQuoteSelected);
    return;
  }
  const editButton = event.target.closest("[data-edit-quote]");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const quote = (state.transportQuotes || []).find((item) => item.id === editButton.dataset.editQuote);
    if (!quote || !requireEdit("编辑交通报价")) return;
    if (!confirmRemoteTransportQuoteEdit(quote.id, "编辑交通报价")) return;
    setManualQuoteEditing(quote);
    renderTransport();
    dom.manualQuoteCode.focus();
    dom.saveState.textContent = `正在编辑报价「${quote.code}」`;
    return;
  }
  const deleteButton = event.target.closest("[data-delete-quote]");
  if (!deleteButton) return;
  event.preventDefault();
  event.stopPropagation();
  const quoteId = deleteButton.dataset.deleteQuote;
  const quote = (state.transportQuotes || []).find((item) => item.id === quoteId);
  if (!quote || !requireEdit("删除交通报价")) return;
  if (!confirmRemoteTransportQuoteEdit(quoteId, "删除交通报价")) return;
  if (await deleteTransportQuoteFromDoc(quoteId)) {
    transportFilterApplied = true;
    if (editingTransportQuoteId === quoteId) clearManualQuoteForm();
    await logActivity(`删除报价「${quote.code}」`, { target: transportQuoteActivityTarget(quoteId, quote.dayId || "", { deleted: true, action: "delete" }) });
    await saveCollaborativePlanChange(`删除报价「${quote.code}」`);
    dom.saveState.textContent = `已删除报价「${quote.code}」`;
    return;
  }
  mutate(`删除报价「${quote.code}」`, () => {
    state.transportQuotes = mergedTransportQuotesWithPatch("delete", null, quoteId);
    transportFilterApplied = true;
    if (editingTransportQuoteId === quoteId) clearManualQuoteForm();
  }, { requireUnlocked: false, save: false, activityTarget: transportQuoteActivityTarget(quoteId, quote.dayId || "", { deleted: true, action: "delete" }) });
  await syncTransportQuotesToDoc("local-transport-quote-delete-fallback");
  await saveCollaborativePlanChange(`删除报价「${quote.code}」`);
});

dom.cancelQuoteEditBtn?.addEventListener("click", () => {
  clearManualQuoteForm();
  renderTransport();
  dom.saveState.textContent = "已取消编辑交通报价";
});

dom.manualQuoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const existingQuote = editingTransportQuoteId ? (state.transportQuotes || []).find((item) => item.id === editingTransportQuoteId) : null;
  const quote = quoteDraftFromManualForm(existingQuote || {});
  const code = quote.code;
  const price = numberValue(quote.price);
  if (!code || !price) return;
  if (editingTransportQuoteId) {
    if (!confirmRemoteTransportQuoteEdit(editingTransportQuoteId, "更新交通报价")) return;
    if (!existingQuote) {
      clearManualQuoteForm();
      dom.saveState.textContent = "这条报价已被其他成员删除，请重新保存。";
      return;
    }
    if (await updateTransportQuoteInDoc(editingTransportQuoteId, quote)) {
      persistCurrentPlanFromDoc("交通报价协作内容已实时同步");
      await logActivity(`更新交通报价「${code}」`, { target: transportQuoteActivityTarget(editingTransportQuoteId, quote.dayId || "", { action: "update" }) });
      transportFilterApplied = true;
      clearManualQuoteForm();
      await saveCollaborativePlanChange(`更新交通报价「${code}」`);
      dom.saveState.textContent = `已更新交通报价「${code}」`;
      refreshRealtimePlanViews();
      return;
    }
    mutate(`更新交通报价「${code}」`, () => {
      state.transportQuotes = mergedTransportQuotesWithPatch("update", manualQuotePatchFromForm(), editingTransportQuoteId);
      transportFilterApplied = true;
      clearManualQuoteForm();
    }, { requireUnlocked: false, save: false, activityTarget: transportQuoteActivityTarget(editingTransportQuoteId, quote.dayId || "", { action: "update" }) });
    await syncTransportQuotesToDoc("local-transport-quote-update-fallback");
    await saveCollaborativePlanChange(`更新交通报价「${code}」`);
    return;
  }
  if (await addCollaborativeTransportQuote(quote)) {
    persistCurrentPlanFromDoc("交通报价协作内容已实时同步");
    await logActivity(`保存交通报价「${code}」`, { target: transportQuoteActivityTarget(quote.id, quote.dayId || "", { action: "create" }) });
    transportFilterApplied = true;
    clearManualQuoteForm();
    await saveCollaborativePlanChange(`保存交通报价「${code}」`);
    dom.saveState.textContent = `已保存交通报价「${code}」`;
    refreshRealtimePlanViews();
    return;
  }
  mutate(`保存交通报价「${code}」`, () => {
    state.transportQuotes = mergedTransportQuotesWithPatch("add", quote).slice(0, 40);
    transportFilterApplied = true;
    clearManualQuoteForm();
  }, { requireUnlocked: false, save: false, activityTarget: transportQuoteActivityTarget(quote.id, quote.dayId || "", { action: "create" }) });
  await syncTransportQuotesToDoc("local-transport-quote-fallback");
  await saveCollaborativePlanChange(`保存交通报价「${code}」`);
});

dom.budgetAdoptEstimatesBtn?.addEventListener("click", adoptAllBudgetEstimates);
dom.budgetEnrichPlacesBtn?.addEventListener("click", enrichPlacesFromAmap);

dom.partySizeInput.addEventListener("change", async () => {
  if (!requireEdit("更新同行人数")) return;
  if (!confirmRemotePlanSettingEdit("更新同行人数")) return;
  if (await syncPlanSettingToDoc("partySize", dom.partySizeInput.value)) {
    persistCurrentPlanFromDoc("预算设置协作内容已实时同步");
    await logActivity("更新同行人数", { target: budgetSettingActivityTarget("partySize", { action: "update" }) });
    await saveCollaborativePlanChange("更新同行人数");
    return;
  }
  mutate("更新同行人数", () => {
    state.partySize = partySize();
  }, { requireUnlocked: false, save: false, activityTarget: budgetSettingActivityTarget("partySize", { action: "update" }) });
  await syncPlanMetaToDoc("local-party-size-fallback");
  await saveCollaborativePlanChange("更新同行人数");
});

dom.budgetLimitInput.addEventListener("change", async () => {
  if (!requireEdit("更新预算上限")) return;
  if (!confirmRemotePlanSettingEdit("更新预算上限")) return;
  if (await syncPlanSettingToDoc("budgetLimit", dom.budgetLimitInput.value)) {
    persistCurrentPlanFromDoc("预算设置协作内容已实时同步");
    await logActivity("更新预算上限", { target: budgetSettingActivityTarget("budgetLimit", { action: "update" }) });
    await saveCollaborativePlanChange("更新预算上限");
    return;
  }
  mutate("更新预算上限", () => {
    state.budgetLimit = numberValue(dom.budgetLimitInput.value);
  }, { requireUnlocked: false, save: false, activityTarget: budgetSettingActivityTarget("budgetLimit", { action: "update" }) });
  await syncPlanMetaToDoc("local-budget-limit-fallback");
  await saveCollaborativePlanChange("更新预算上限");
});

async function syncPlanMetaFieldInput(field, value, label) {
  if (!canEdit() || isReadonlyMode) return;
  const planFieldMeta = COLLAB_PLAN_TEXT_PRESENCE_FIELDS.find((meta) => meta.planField === field);
  if (planFieldMeta && !confirmRemoteTextFieldEdit(planFieldMeta.field, "plan", label || "保存计划基础信息")) return;
  if (await syncPlanSettingToDoc(field, value)) {
    persistCurrentPlanFromDoc("计划基础信息协作内容已实时同步");
    await logActivity(label, { target: planMetaActivityTarget(field, { action: "update" }) });
    await saveCollaborativePlanChange(label);
    return;
  }
  state[field] = normalizePlanSettingValue(field, value);
  await syncPlanMetaToDoc(`local-plan-meta-${field}-fallback`);
  await logActivity(label, { target: planMetaActivityTarget(field, { action: "update" }) });
  await saveCollaborativePlanChange(label);
}

async function syncPlanMetaPatchInput(patch = {}, label, targetField = "") {
  if (!canEdit() || isReadonlyMode) return;
  await bindCollabPlanDoc();
  const entries = Object.entries(patch)
    .filter(([field]) => PLAN_SETTING_FIELDS.some((meta) => meta.field === field))
    .map(([field, value]) => [field, normalizePlanSettingValue(field, value)]);
  if (!entries.length) return;
  const changedPlanFields = entries
    .map(([field]) => COLLAB_PLAN_TEXT_PRESENCE_FIELDS.find((meta) => meta.planField === field)?.field || "")
    .filter(Boolean);
  if (!confirmRemoteTextFieldEdit(changedPlanFields, "plan", label || "保存计划基础信息")) return;
  const changed = collabSettingsMap
    ? entries.some(([field, value]) => {
      const settingTextValue = PLAN_TEXT_SETTING_FIELDS.includes(field) ? collabSettingTextsMap?.get(field)?.toString() : undefined;
      return !sameSerialized(collabSettingsMap.get(field), value) || (settingTextValue !== undefined && settingTextValue !== String(value || ""));
    })
    : entries.some(([field, value]) => !sameSerialized(state[field], value));
  if (!changed) return;
  if (collabPlanDoc && collabSettingsMap && !isApplyingCollabPlanRemote) {
    collabPlanDoc.transact(() => {
      entries.forEach(([field, value]) => {
        const settingText = PLAN_TEXT_SETTING_FIELDS.includes(field) ? collabSettingTextsMap?.get(field) : null;
        if (settingText) {
          applyTextDiff(settingText, String(value || ""));
          const textState = settingTextStateFromYText(field, settingText);
          if (collabSettingTextStatesMap && textState) collabSettingTextStatesMap.set(field, textState);
        }
        collabSettingsMap.set(field, clone(value));
      });
    }, "local-plan-meta-patch");
    persistCurrentPlanFromDoc("计划基础信息协作内容已实时同步");
  } else {
    entries.forEach(([field, value]) => {
      state[field] = clone(value);
    });
    await syncPlanMetaToDoc("local-plan-meta-patch-fallback");
  }
  await logActivity(label, { target: planMetaActivityTarget(targetField || entries[0][0], { action: "update", fields: entries.map(([field]) => field) }) });
  await saveCollaborativePlanChange(label);
}

function schedulePlanMetaInputSync(field, value, label) {
  clearTimeout(planMetaInputSyncTimers[field]);
  planMetaInputSyncTimers[field] = setTimeout(() => {
    delete planMetaInputSyncTimers[field];
    syncPlanMetaFieldInput(field, value, label).catch((error) => {
      console.warn("Plan meta field sync failed", error);
      dom.saveState.textContent = `${label}同步失败：${error.message}`;
    });
  }, 650);
}

function schedulePlanMetaPatchInputSync(timerKey, patch, label, targetField = "") {
  clearTimeout(planMetaInputSyncTimers[timerKey]);
  planMetaInputSyncTimers[timerKey] = setTimeout(() => {
    delete planMetaInputSyncTimers[timerKey];
    syncPlanMetaPatchInput(patch, label, targetField).catch((error) => {
      console.warn("Plan meta patch sync failed", error);
      dom.saveState.textContent = `${label}同步失败：${error.message}`;
    });
  }, 650);
}

dom.destinationInput.addEventListener("input", () => {
  const destination = dom.destinationInput.value.trim() || "自定义";
  guideState.destination = destination;
  state.destination = destination;
  renderGuideResult();
  clearDateScoutResults("目的地已变化，请重新筛选日期");
  renderShell();
  schedulePlanMetaInputSync("destination", destination, "更新目的地");
});

dom.originInput.addEventListener("input", () => {
  const origin = dom.originInput.value.trim() || "出发城市";
  guideState.origin = origin;
  state.origin = origin;
  dom.transportFrom.value = guideState.origin;
  renderGuideResult();
  clearDateScoutResults("出发城市已变化，请重新筛选日期");
  schedulePlanMetaInputSync("origin", origin, "更新出发地");
});

function handleGuideDateInput(event) {
  const patch = syncGuideDatesFromInputs();
  state.startDate = patch.startDate;
  state.endDate = patch.endDate;
  state.dateRange = patch.dateRange;
  renderShell();
  schedulePlanMetaPatchInputSync("dateRange", patch, "更新日期范围", event?.target === dom.endDateInput ? "endDate" : "startDate");
}

dom.startDateInput.addEventListener("input", handleGuideDateInput);
dom.endDateInput.addEventListener("input", handleGuideDateInput);

function closeCreateChoice() {
  dom.createChoiceModal.classList.remove("is-open");
  dom.createChoiceModal.setAttribute("aria-hidden", "true");
}

async function createRecommendedPlan() {
  if (!requireEdit("生成推荐计划")) return;
  if (!confirmRemotePlanReplace("生成推荐计划")) return;
  const destination = dom.destinationInput.value.trim() || "甘肃";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  dom.guideProgress.textContent = "正在生成路线";
  dom.saveState.textContent = "正在生成推荐路线...";
  if (!mutate(`生成${destination}${days}天计划`, () => {
    state = buildRecommendedPlan(destination, days, guideState);
    applyPlanDates(state, guideState.startDate, guideState.endDate);
    state.name = `${destination} ${days} 日同行计划`;
    state.origin = origin;
    state.activities = [`${origin}出发`, ...(state.activities || [])].slice(0, 6);
    activeDay = 0;
    activeStop = firstMeaningfulStopIndex(state.days?.[0]);
    dom.transportFrom.value = origin;
    dom.transportTo.value = "";
    transportFilterApplied = false;
    clearPlanYjsState();
  }, { requireUnlocked: false, save: false, render: false })) return;
  markPendingPlaceImages(state);
  render();
  dom.guideProgress.textContent = "正在查找实景图";
  dom.saveState.textContent = serviceConfig.placeImageEndpoint ? "正在查找并验证景点实景图..." : "未配置实景图代理，景点图片会显示待补全。";
  if (serviceConfig.placeImageEndpoint) {
    const imageSummary = await enrichPlanImagesBeforeSave(state, {
      maxItems: 14,
      concurrency: 3,
      onProgress: (current, total, stop) => {
        dom.guideProgress.textContent = `正在验证图片 ${current}/${total}`;
        dom.saveState.textContent = `正在验证 ${stop.title || "景点"} 的实景图...`;
      },
    });
    dom.saveState.textContent = `已找到 ${imageSummary.imageCount} 张实景图${imageSummary.missingCount ? `，${imageSummary.missingCount} 个地点待补全` : ""}。`;
  }
  await replacePlanCollabDoc("local-recommended-plan", { allowReplace: true, reason: "recommended-plan" });
  await saveCollaborativePlanChange("已生成推荐计划");
  await broadcastPlanReplaced("生成推荐计划", { replacementType: "recommended-plan" });
  setFlowStep("itinerary", { showAll: false, pinned: true });
  render();
  scheduleAutoImageEnrichment(600);
  closeCreateChoice();
}

async function createBlankTemplate() {
  if (!requireEdit("生成空白模板")) return;
  if (!confirmRemotePlanReplace("生成空白模板")) return;
  const destination = dom.destinationInput.value.trim() || "自定义目的地";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  if (!mutate(`创建${destination}${days}天空白模板`, () => {
    state = buildBlankPlan(destination, days, guideState);
    applyPlanDates(state, guideState.startDate, guideState.endDate);
    state.origin = origin;
    activeDay = 0;
    activeStop = 0;
    dom.transportFrom.value = origin;
    dom.transportTo.value = "";
    transportFilterApplied = false;
    clearPlanYjsState();
  }, { requireUnlocked: false, save: false, render: false })) return;
  await replacePlanCollabDoc("local-blank-plan", { allowReplace: true, reason: "blank-plan" });
  await saveCollaborativePlanChange("已生成空白模板");
  await broadcastPlanReplaced("生成空白模板", { replacementType: "blank-plan" });
  setFlowStep("itinerary", { showAll: false, pinned: true });
  render();
  scheduleAutoImageEnrichment(600);
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

async function switchLocalPlan(recordId = "") {
  const record = planLibrary().find((item) => item.id === recordId);
  if (!record?.data?.days?.length) return;
  if (canEdit()) persistLocalState();
  if (record.tripId) {
    await connectSharedTrip(record.tripId);
    return;
  }
  disconnectSharedSessionForLocalPlan();
  resetUrlForLocalPlan();
  setCurrentLocalPlanId(record.id);
  state = ensurePlanDates(clone(record.data));
  resetTransientPlanUi("已切换到本地计划");
  setFlowStep(defaultFlowStep(), { showAll: false, pinned: true });
  render();
  dom.saveState.textContent = `已切换到「${record.label || state.name || "计划"}」`;
}

function createNewLocalPlan() {
  if (!requireEdit("新建计划")) return;
  if (canEdit()) persistLocalState();
  disconnectSharedSessionForLocalPlan();
  resetUrlForLocalPlan();
  const defaults = defaultGuideDates();
  Object.assign(guideState, {
    destination: "自定义目的地",
    origin: state.origin || guideState.origin || "上海",
    startDate: defaults.startDate,
    endDate: defaults.endDate,
  });
  state = ensurePlanDates(buildBlankPlan(guideState.destination, guideDayCount(), guideState));
  applyPlanDates(state, guideState.startDate, guideState.endDate);
  state.name = "新的旅行计划";
  state.origin = guideState.origin;
  clearPlanYjsState();
  const record = persistLocalState(state, { id: newLocalPlanId(), label: state.name, tripId: "" });
  setCurrentLocalPlanId(record.id);
  resetTransientPlanUi("已新建空白计划，可重新筛选出游日期");
  setFlowStep("setup", { showAll: false, pinned: true });
  render();
  dom.saveState.textContent = "已新建计划；旧计划仍保存在下拉列表中";
}

function deleteCurrentLocalPlan() {
  if (!requireEdit("删除计划")) return;
  const library = planLibrary();
  const currentId = currentLocalPlanId();
  const currentRecord = library.find((record) => record.id === currentId);
  const planName = currentRecord?.label || state.name || state.destination || "当前计划";
  const sharedWarning = currentRecord?.tripId
    ? "\n\n这是共享计划。本操作只会从这个浏览器的计划列表移除，不会删除 Supabase 云端协作记录或别人手里的链接。"
    : "";
  const ok = window.confirm(`确定要删除「${planName}」吗？\n\n删除和新建已经分开：此操作只删除当前计划，不会自动新建覆盖旧内容。${sharedWarning}`);
  if (!ok) {
    dom.saveState.textContent = "已取消删除计划";
    return;
  }
  const remaining = library.filter((record) => record.id !== currentId);
  savePlanLibrary(remaining);
  if (currentRecord?.tripId) {
    disconnectSharedSessionForLocalPlan();
    resetUrlForLocalPlan();
  }
  const nextRecord = remaining[0];
  if (nextRecord?.data?.days?.length) {
    if (nextRecord.tripId) {
      connectSharedTrip(nextRecord.tripId).catch((error) => {
        dom.saveState.textContent = `切换共享计划失败：${error.message}`;
      });
      return;
    }
    setCurrentLocalPlanId(nextRecord.id);
    state = ensurePlanDates(clone(nextRecord.data));
  } else {
    disconnectSharedSessionForLocalPlan();
    resetUrlForLocalPlan();
    const defaults = defaultGuideDates();
    Object.assign(guideState, {
      destination: "自定义目的地",
      origin: guideState.origin || "上海",
      startDate: defaults.startDate,
      endDate: defaults.endDate,
    });
    state = ensurePlanDates(buildBlankPlan(guideState.destination, guideDayCount(), guideState));
    applyPlanDates(state, guideState.startDate, guideState.endDate);
    state.name = "新的旅行计划";
    const record = persistLocalState(state, { id: newLocalPlanId(), label: state.name, tripId: "" });
    setCurrentLocalPlanId(record.id);
  }
  resetTransientPlanUi("已删除当前计划");
  setFlowStep(defaultFlowStep(), { showAll: false, pinned: true });
  render();
  dom.saveState.textContent = "已删除当前计划；没有覆盖其他已保存计划";
}

dom.planSelect?.addEventListener("change", () => {
  switchLocalPlan(dom.planSelect.value).catch((error) => {
    dom.saveState.textContent = `切换计划失败：${error.message}`;
    renderPlanSwitcher();
  });
});

dom.newPlanBtn?.addEventListener("click", createNewLocalPlan);
dom.deletePlanBtn?.addEventListener("click", deleteCurrentLocalPlan);

dom.exportBtn.addEventListener("click", async () => {
  await refreshLiveCollabStateBeforeRemoteSave("导出前已刷新协作快照");
  const exportState = planVersionSnapshot(state);
  const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: "application/json" });
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

async function importPlanJsonFile(file) {
  if (!file || !requireEdit("导入 JSON")) return;
  if (!confirmRemotePlanReplace("导入 JSON")) return;
  let importedPlan = null;
  try {
    importedPlan = JSON.parse(await file.text());
  } catch {
    dom.saveState.textContent = "JSON 文件无法解析";
    return;
  }
  if (!importedPlan?.days?.length) {
    dom.saveState.textContent = "JSON 文件不是有效计划";
    return;
  }
  saveVersionSnapshot("导入 JSON 前版本");
  state = ensurePlanDates(clone(importedPlan));
  activeDay = 0;
  activeStop = 0;
  transportFilterApplied = false;
  const importedPlanYjs = state.planYjs || "";
  const restoredFromYjs = importedPlanYjs
    ? await replaceLivePlanDocWithYjsState(importedPlanYjs, "已从 JSON 导入协作快照")
    : false;
  if (!restoredFromYjs) await replacePlanCollabDoc("local-json-import", { allowReplace: true, reason: "json-import" });
  await logActivity(`导入 JSON「${file.name || "计划"}」`);
  await saveCollaborativePlanChange("已导入 JSON");
  await broadcastPlanReplaced("导入 JSON", { replacementType: "json-import", importedFileName: file.name || "" });
  render();
}

dom.importJsonBtn?.addEventListener("click", () => {
  if (!requireEdit("导入 JSON")) return;
  dom.importJsonInput.value = "";
  dom.importJsonInput.click();
});

dom.importJsonInput?.addEventListener("change", () => {
  const file = dom.importJsonInput.files?.[0];
  importPlanJsonFile(file).catch((error) => {
    dom.saveState.textContent = `导入 JSON 失败：${error.message}`;
  });
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
    dom.collabStatus.textContent = isReadonlyMode
      ? "只读链接已复制。"
      : state.editKeyHash
        ? "口令编辑链接已复制；对方需要输入编辑口令才能修改。"
        : "编辑链接已复制；当前未设置口令，拿到链接即可修改。";
  } catch {
    dom.collabStatus.textContent = url;
  }
});

dom.copyInviteLinkBtn?.addEventListener("click", async () => {
  if (!tripId) {
    dom.collabStatus.textContent = "请先创建共享计划，再复制直入邀请。";
    return;
  }
  if (!state.editKeyHash || !currentEditKeyValue()) {
    dom.collabStatus.textContent = "请先设置或输入编辑口令，再复制直入邀请。";
    return;
  }
  const url = getInviteShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    dom.collabStatus.textContent = "直入邀请已复制；此链接带编辑密钥，只发给可信成员。";
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

dom.editAccessForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!tripId) {
    dom.editAccessStatus.textContent = "请先创建共享计划，再设置编辑口令。";
    return;
  }
  if (forcedReadonlyMode) {
    dom.editAccessStatus.textContent = "当前是只读链接，不能解锁或设置编辑口令。";
    return;
  }
  const editKey = dom.editAccessInput.value.trim();
  if (!editKey) {
    dom.editAccessStatus.textContent = "请输入编辑口令。";
    return;
  }
  const hash = await sha256Text(`${tripId}:${editKey}`);
  if (state.editKeyHash && !canEdit()) {
    if (hash !== state.editKeyHash) {
      dom.editAccessStatus.textContent = "编辑口令不正确。";
      return;
    }
    setLocalEditAccess(hash);
    setCurrentEditKeyValue(editKey);
    editAccessGranted = true;
    isReadonlyMode = false;
    dom.editAccessInput.value = "";
    dom.collabStatus.textContent = "编辑已解锁，可以修改计划。";
    applyReadonlyUi();
    render();
    return;
  }
  if (!canEdit() && state.editKeyHash) {
    dom.editAccessStatus.textContent = "请先输入正确口令解锁，再更新口令。";
    return;
  }
  if (!confirmRemotePlanSettingEdit("更新编辑口令")) return;
  state.editKeyHash = hash;
  state.editKeyHint = editKey.length >= 2 ? `${editKey.slice(0, 1)}***${editKey.slice(-1)}` : "已设置";
  setLocalEditAccess(hash);
  setCurrentEditKeyValue(editKey);
  editAccessGranted = true;
  isReadonlyMode = false;
  dom.editAccessInput.value = "";
  await syncPlanMetaToDoc("local-edit-access");
  await saveCollaborativePlanChange("编辑口令已更新");
  dom.collabStatus.textContent = "编辑口令已更新；普通编辑链接需要口令，直入邀请才会带密钥。";
  applyReadonlyUi();
  render();
});

dom.mergeConflictBtn?.addEventListener("click", () => resolveConflict("merge"));
dom.keepLocalConflictBtn?.addEventListener("click", () => resolveConflict("local"));
dom.useRemoteConflictBtn?.addEventListener("click", () => resolveConflict("remote"));

dom.versionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-version]");
  if (!button) return;
  pendingVersionRestoreId = button.dataset.version || "";
  renderVersionHistory();
  dom.saveState.textContent = "请确认是否恢复该历史版本";
});

dom.versionPreview?.addEventListener("click", (event) => {
  const confirmButton = event.target.closest("[data-confirm-version-restore]");
  if (confirmButton) {
    restoreVersion(confirmButton.dataset.confirmVersionRestore || "");
    return;
  }
  if (event.target.closest("[data-cancel-version-restore]")) {
    pendingVersionRestoreId = "";
    renderVersionHistory();
    dom.saveState.textContent = "已取消恢复历史版本";
  }
});

dom.commentIndexFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-comment-index-filter]");
  if (!button) return;
  commentIndexFilter = button.dataset.commentIndexFilter || "open";
  renderCommentIndex();
  refreshIcons();
});

dom.activityFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-activity-filter]");
  if (!button) return;
  activityFilter = button.dataset.activityFilter || "all";
  renderActivities();
});

dom.activityList?.addEventListener("click", (event) => {
  const item = event.target.closest("[data-activity-target]");
  if (!item) return;
  const detail = parseActivityDetail(item.dataset.activityDetail || "");
  if (focusActivityDetail(detail)) return;
  focusActivityTarget(item.dataset.activityTarget || "");
});

dom.commentIndexList?.addEventListener("click", (event) => {
  if (event.target.closest("[data-comment-index-reply]")) return;
  const resolveButton = event.target.closest("[data-comment-index-resolve]");
  if (resolveButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleCommentIndexResolved(resolveButton.dataset.commentIndexResolve || "");
    return;
  }
  const button = event.target.closest("[data-comment-index-id]");
  if (!button) return;
  focusCommentIndexItem(button.dataset.commentIndexId || "");
});

dom.commentIndexList?.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  if (event.target.closest?.("[data-comment-index-reply]")) return;
  const item = event.target.closest("[data-comment-index-id]");
  if (!item || event.target.closest("[data-comment-index-resolve]")) return;
  event.preventDefault();
  focusCommentIndexItem(item.dataset.commentIndexId || "");
});

dom.commentIndexList?.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-comment-index-reply]");
  if (!form) return;
  event.preventDefault();
  const input = form.querySelector("input");
  const text = input?.value?.trim() || "";
  if (!text) return;
  const sent = await replyFromCommentIndex(form.dataset.commentIndexReply || "", text);
  if (sent && input) input.value = "";
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

document.querySelectorAll(".sync-card").forEach((card) => {
  card.addEventListener("click", () => {
    openExternalImport(card.dataset.provider);
  });
});

document.querySelectorAll("[data-close-import]").forEach((button) => {
  button.addEventListener("click", () => {
    dom.importModal.classList.remove("is-open");
    dom.importModal.setAttribute("aria-hidden", "true");
  });
});

dom.flowSteps?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-flow-step]");
  if (!button || button.getAttribute("aria-disabled") === "true") return;
  setFlowStep(button.dataset.flowStep, { showAll: false, pinned: true });
  document.querySelector(".flow-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
});

dom.flowAdvancedToggle?.addEventListener("click", () => {
  flowUi.showAll = !flowUi.showAll;
  saveFlowUi();
  renderFlow();
});

dom.flowNextBtn?.addEventListener("click", () => {
  const currentIndex = FLOW_STEPS.findIndex((step) => step.id === flowUi.step);
  const nextStep = FLOW_STEPS[Math.max(0, currentIndex) + 1];
  if (!nextStep) return;
  setFlowStep(nextStep.id, { showAll: false, pinned: true });
  document.querySelector(".flow-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
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
  refreshImportTargetUi();
});

dom.importProvider?.addEventListener("change", () => {
  pendingProvider = normalizeImportProvider(dom.importProvider.value);
  const defaults = providerDefaults(pendingProvider);
  dom.importTitle.textContent = `下单后导入：${pendingProvider}`;
  dom.importCategory.value = defaults.category;
  if (!dom.importName.value || ["外部记录", "餐厅预约", "住宿入住", "交通订单", "景点预约"].includes(dom.importName.value)) {
    dom.importName.value = defaults.title;
  }
  refreshImportTargetUi();
});

dom.importTarget?.addEventListener("change", refreshImportTargetUi);

async function importExternalCandidate(createdStop, label) {
  const draft = normalizeCandidateStops([{
    ...createdStop,
    selected: true,
    tags: Array.from(new Set([...(createdStop.tags || []), "备选", "预算组合"])),
  }])[0];
  if (!draft) return false;
  if (await addCollaborativeCandidate(draft)) {
    persistCurrentPlanFromDoc("外部订单已导入备选池");
    await logActivity(label, { target: candidateActivityTarget(draft.id || "", { action: "external-import" }) });
    await saveCollaborativePlanChange(label);
    refreshRealtimePlanViews();
    return true;
  }
  state.candidates = mergedCandidatesWithPatch("add", draft);
  await syncCandidatesToDoc("local-import-candidate-fallback");
  await logActivity(label, { target: candidateActivityTarget(draft.id || "", { action: "external-import", fallback: true }) });
  await saveCollaborativePlanChange(label);
  render();
  return true;
}

dom.importForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = dom.importName.value.trim() || "外部记录";
  pendingProvider = normalizeImportProvider(dom.importProvider?.value || pendingProvider);
  const category = normalizeImportCategory(dom.importCategory.value, pendingProvider);
  const targetMode = dom.importTarget?.value || "day";
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
  const label = `导入${pendingProvider}记录`;
  if (!requireEdit(label)) return;
  saveVersionSnapshot(label);
  const createdStop = makeStop({
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
  const finishImportUi = () => {
    dom.syncBadge.textContent = "已导入";
    const targetText = targetMode === "candidate" ? "备选池，可在住宿/餐饮板块预选或加入当天" : `${targetDay.label}，可在右侧继续编辑`;
    dom.syncStatus.innerHTML = `${icon("check-circle-2")}<span>${pendingProvider}记录已导入到${targetText}。</span>`;
    dom.importModal.classList.remove("is-open");
    dom.importModal.setAttribute("aria-hidden", "true");
  };
  if (targetMode === "candidate") {
    if (await importExternalCandidate(createdStop, label)) {
      finishImportUi();
      return;
    }
  }
  if (targetDay?.id && await addStopToDoc(targetDay.id, createdStop, "local-import-stop-yjs-first")) {
    await logActivity(label, { target: stopActivityTarget(targetDay.id, createdStop.id || "", { action: "external-import" }) });
    await applyStopCreateFromDoc(targetDay.id, createdStop.id, label);
    finishImportUi();
    await saveCollaborativePlanChange(label);
    broadcastStopCreated(targetDay.id, createdStop);
    render();
    return;
  }
  targetDay.stops.push(createdStop);
  activeDay = targetDayIndex;
  activeStop = targetDay.stops.length - 1;
  clearCurrentAmapRoute();
  await logActivity(label, { target: stopActivityTarget(targetDay.id, createdStop.id || "", { action: "external-import", fallback: true }) });
  finishImportUi();
  await syncStopListToDoc(targetDay.id, "local-import-stop-fallback");
  await saveCollaborativePlanChange(label);
  broadcastStopCreated(targetDay.id, createdStop);
  render();
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
    serviceClient.saveTransportConfig(ctripConfig);
  }
  if ((!externalImportConfig.endpoint || /your-project\.supabase\.co\/functions\/v1\/external-order-parse/.test(externalImportConfig.endpoint)) && appConfig.externalOrderParseProxyUrl) {
    externalImportConfig = { endpoint: appConfig.externalOrderParseProxyUrl, token: "" };
    serviceClient.saveExternalImportConfig(externalImportConfig);
  }
  const isPlaceholderAiEndpoint = /your-domain\.com\/api\/route-optimize/.test(serviceConfig.aiEndpoint || "");
  if ((!serviceConfig.aiEndpoint || isPlaceholderAiEndpoint) && appConfig.aiRouteProxyUrl) {
    serviceConfig = { ...serviceConfig, aiEndpoint: appConfig.aiRouteProxyUrl, aiToken: "" };
    serviceClient.saveServiceConfig(serviceConfig);
  }
  const isPlaceholderAmapEndpoint = /your-domain\.com\/api\/amap-place/.test(serviceConfig.amapEndpoint || "");
  if ((!serviceConfig.amapEndpoint || isPlaceholderAmapEndpoint) && appConfig.amapPlaceProxyUrl) {
    serviceConfig = { ...serviceConfig, amapEndpoint: appConfig.amapPlaceProxyUrl };
    serviceClient.saveServiceConfig(serviceConfig);
  }
  const isPlaceholderAmapRouteEndpoint = /your-project\.supabase\.co\/functions\/v1\/amap-route-plan/.test(serviceConfig.amapRouteEndpoint || "");
  if ((!serviceConfig.amapRouteEndpoint || isPlaceholderAmapRouteEndpoint) && appConfig.amapRouteProxyUrl) {
    serviceConfig = { ...serviceConfig, amapRouteEndpoint: appConfig.amapRouteProxyUrl };
    serviceClient.saveServiceConfig(serviceConfig);
  }
  const isPlaceholderWeatherEndpoint = /your-domain\.com\/api\/weather|your-project\.supabase\.co\/functions\/v1\/amap-weather/.test(serviceConfig.weatherEndpoint || "");
  if ((!serviceConfig.weatherEndpoint || isPlaceholderWeatherEndpoint) && appConfig.amapWeatherProxyUrl) {
    serviceConfig = { ...serviceConfig, weatherEndpoint: appConfig.amapWeatherProxyUrl };
    serviceClient.saveServiceConfig(serviceConfig);
  }
  const isPlaceholderPlaceImageEndpoint = /your-project\.supabase\.co\/functions\/v1\/place-image-search|juicyxqblnrmbhtuujez\.supabase\.co\/functions\/v1\/place-image-search/.test(serviceConfig.placeImageEndpoint || "");
  if ((!serviceConfig.placeImageEndpoint || isPlaceholderPlaceImageEndpoint) && appConfig.placeImageSearchProxyUrl) {
    serviceConfig = { ...serviceConfig, placeImageEndpoint: appConfig.placeImageSearchProxyUrl };
    serviceClient.saveServiceConfig(serviceConfig);
  }
  dom.ctripEndpointInput.value = ctripConfig.endpoint || "";
  dom.ctripTokenInput.value = ctripConfig.token || "";
  dom.aiRouteEndpointInput.value = serviceConfig.aiEndpoint || "";
  dom.aiRouteTokenInput.value = serviceConfig.aiToken || "";
  dom.amapEndpointInput.value = serviceConfig.amapEndpoint || "";
  dom.amapRouteEndpointInput.value = serviceConfig.amapRouteEndpoint || "";
  dom.amapJsKeyInput.value = serviceConfig.amapJsKey || "";
  dom.amapSecurityCodeInput.value = serviceConfig.amapSecurityCode || "";
  dom.weatherEndpointInput.value = serviceConfig.weatherEndpoint || "";
  if (dom.placeImageEndpointInput) dom.placeImageEndpointInput.value = serviceConfig.placeImageEndpoint || "";
  renderServiceStatus();
  if (ctripConfig.endpoint) {
    dom.syncBadge.textContent = "已配置接口";
    setCtripStatus("已读取本机保存的 Google Flights 航班代理地址。配置 Supabase 密钥后可测试连接并同步航班。", "plug-zap");
  }
  syncGuideStateFromPlan();
  dom.partySizeInput.value = state.partySize || 1;
  await refreshEditAccessFromUrl();
  initSupabaseClient();
  render();
  renderMembers();
  window.addEventListener("online", () => {
    flushPendingPlanUpdates("网络恢复后重放离线协作更新").catch((error) => {
      dom.collabStatus.textContent = `网络恢复后同步失败：${error.message}`;
    });
  });
  if (supabaseClient && tripId) {
    const pendingCount = pendingPlanUpdates().length;
    if (pendingCount) dom.collabStatus.textContent = `检测到 ${pendingCount} 条离线协作更新，连接共享计划后会自动同步。`;
    await connectSharedTrip(tripId);
    scheduleAutoImageEnrichment();
  } else {
    saveState();
    scheduleAutoImageEnrichment();
  }
}

boot();
