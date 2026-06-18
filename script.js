const STORAGE_KEY = "tripboard-editable-v1";
const CTRIP_CONFIG_KEY = "tripboard-ctrip-connector-v1";
const MEMBER_PROFILE_KEY = "tripboard-member-profile-v1";
const SERVICE_CONFIG_KEY = "tripboard-service-connectors-v1";
const EXTERNAL_IMPORT_CONFIG_KEY = "tripboard-external-import-v1";
const EDIT_ACCESS_PREFIX = "tripboard-edit-access:";
const EDIT_KEY_VALUE_PREFIX = "tripboard-edit-key-value:";
const VERSION_PREFIX = "tripboard-version-history:";
const PENDING_PLAN_UPDATES_PREFIX = "tripboard-pending-plan-yjs:";
const MAX_VERSION_HISTORY = 12;
const MAX_PENDING_PLAN_UPDATES = 160;
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
const COMMENT_FILTERS = [
  { value: "all", label: "全部" },
  { value: "open", label: "未解决" },
  { value: "resolved", label: "已解决" },
];
const COMMENT_INDEX_FILTERS = [
  { value: "open", label: "未解决" },
  { value: "all", label: "全部" },
  { value: "resolved", label: "已解决" },
];
const COLLAB_DAY_TEXT_FIELDS = [
  { field: "day:title", docField: "title", domKey: "fieldDayTitle", label: "当天标题", presenceId: "fieldDayTitlePresence", scope: "day" },
  { field: "day:route", docField: "route", domKey: "fieldDayRoute", label: "当天路线", presenceId: "fieldDayRoutePresence", scope: "day" },
  { field: "day:weather", docField: "weather", domKey: "fieldDayWeather", label: "天气", presenceId: "fieldDayWeatherPresence", scope: "day" },
  { field: "day:transport", docField: "transport", domKey: "fieldDayTransport", label: "交通", presenceId: "fieldDayTransportPresence", scope: "day" },
];
const COLLAB_STRUCT_FIELDS = [
  { field: "time", domKey: "fieldTime", type: "string", label: "时间", presenceId: "fieldTimePresence" },
  { field: "budget", domKey: "fieldBudget", type: "number", label: "预算", presenceId: "fieldBudgetPresence" },
  { field: "paid", domKey: "fieldPaid", type: "number", label: "已付", presenceId: "fieldPaidPresence" },
  { field: "payer", domKey: "fieldPayer", type: "string", label: "付款人", presenceId: "fieldPayerPresence" },
  { field: "lng", domKey: "fieldLng", type: "string", label: "经度", presenceId: "fieldLngPresence" },
  { field: "lat", domKey: "fieldLat", type: "string", label: "纬度", presenceId: "fieldLatPresence" },
  { field: "image", domKey: "fieldImage", type: "string", label: "图片 URL", presenceId: "fieldImagePresence" },
  { field: "tags", domKey: "fieldTags", type: "tags", label: "标签", presenceId: "fieldTagsPresence" },
  { field: "voters", type: "list" },
  { field: "votes", type: "number" },
  { field: "userVoted", type: "boolean" },
  { field: "favorite", type: "boolean" },
];
const COLLAB_STRUCT_PRESENCE_FIELDS = COLLAB_STRUCT_FIELDS
  .filter((field) => field.domKey && field.presenceId)
  .map((field) => ({ ...field, field: `struct:${field.field}`, structField: field.field, scope: "stop" }));
const COLLAB_PRESENCE_TEXT_FIELDS = [
  ...COLLAB_TEXT_FIELDS.map((field) => ({ ...field, scope: "stop" })),
  ...COLLAB_STRUCT_PRESENCE_FIELDS,
  ...COLLAB_DAY_TEXT_FIELDS,
];
const COLLAB_PRESENCE_TEXT_FIELD_BY_FIELD = new Map(COLLAB_PRESENCE_TEXT_FIELDS.map((item) => [item.field, item]));
const COLLAB_COMMENT_ANCHOR_FIELDS = COLLAB_PRESENCE_TEXT_FIELDS.filter((item) => item.domKey && item.presenceId);
const COLLAB_STOP_COMMENT_ANCHOR_FIELDS = COLLAB_COMMENT_ANCHOR_FIELDS.filter((item) => item.scope === "stop");
const COLLAB_DAY_COMMENT_ANCHOR_FIELDS = COLLAB_COMMENT_ANCHOR_FIELDS.filter((item) => item.scope === "day");
const PLAN_SETTING_FIELDS = [
  { field: "name", type: "string" },
  { field: "destination", type: "string" },
  { field: "origin", type: "string" },
  { field: "dateRange", type: "string" },
  { field: "startDate", type: "string" },
  { field: "endDate", type: "string" },
  { field: "cover", type: "string" },
  { field: "partySize", type: "integer" },
  { field: "budgetLimit", type: "number" },
  { field: "editKeyHash", type: "string" },
  { field: "editKeyHint", type: "string" },
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

function planContentSnapshot(plan) {
  const snapshot = clone(plan || {});
  delete snapshot.planYjs;
  return snapshot;
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

function conflictDiffSummary(conflict = {}) {
  const basePlan = conflict.base || lastSyncedState || {};
  const localChanges = collectPlanChangeMap(basePlan, conflict.local || state);
  const remoteChanges = collectPlanChangeMap(basePlan, conflict.remote || {});
  const overlap = [...localChanges.keys()]
    .filter((key) => remoteChanges.has(key))
    .filter((key) => !sameSerialized(localChanges.get(key)?.value, remoteChanges.get(key)?.value))
    .map((key) => localChanges.get(key)?.label);
  return {
    local: [...localChanges.values()].map((entry) => entry.label).slice(0, 6),
    remote: [...remoteChanges.values()].map((entry) => entry.label).slice(0, 6),
    overlap: [...new Set(overlap)].slice(0, 6),
    localExtra: Math.max(0, localChanges.size - 6),
    remoteExtra: Math.max(0, remoteChanges.size - 6),
    overlapExtra: Math.max(0, overlap.length - 6),
  };
}

function versionPreviewSummary(versionPlan = {}, currentPlan = state) {
  const changes = collectPlanChangeMap(currentPlan, versionPlan);
  return {
    items: [...changes.values()].map((entry) => entry.label).slice(0, 8),
    extra: Math.max(0, changes.size - 8),
  };
}

function memberActivityLabel(member = {}) {
  const textEditing = member.textEditing || (member.textSelection ? textSelectionLabel(member.textSelection) : "");
  if (textEditing) return textEditing;
  if (member.blockEditing) return `${member.blockEditing}：${member.activeBlockText || member.editing || "协作块"}`;
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

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function planSettingValue(plan, { field, type }) {
  if (type === "integer") return Math.max(1, Number.parseInt(plan?.[field] || 1, 10) || 1);
  if (type === "number") return numberValue(plan?.[field]);
  return String(plan?.[field] || "").trim();
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

function hasAmapJsConfig() {
  return Boolean(String(serviceConfig.amapJsKey || "").trim());
}

function clearAmapOverlay() {
  amapMapMarkers.forEach((marker) => marker.setMap(null));
  amapMapPolylines.forEach((polyline) => polyline.setMap(null));
  amapMapMarkers = [];
  amapMapPolylines = [];
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
      activeStop = index;
      render();
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
  voters = [],
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
  clearPlanYjsState(merged);
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
  if (dom.conflictDiff) {
    const diff = conflictDiffSummary(pendingConflict);
    const renderGroup = (title, items, extra, emptyText) => `
      <div class="conflict-diff-group">
        <strong>${escapeHtml(title)}</strong>
        <ul>
          ${items.length ? items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : `<li>${escapeHtml(emptyText)}</li>`}
          ${extra ? `<li>还有 ${extra} 项变化</li>` : ""}
        </ul>
      </div>
    `;
    dom.conflictDiff.innerHTML = [
      renderGroup("我的修改", diff.local, diff.localExtra, "没有检测到本地内容变化"),
      renderGroup("云端修改", diff.remote, diff.remoteExtra, "没有检测到云端内容变化"),
      diff.overlap.length || diff.overlapExtra
        ? renderGroup("同位置冲突", diff.overlap, diff.overlapExtra, "")
        : "",
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
    if (scope === "day") {
      if (member.activeDayId !== dayId) return false;
    } else if (member.activeStopId !== stopId) {
      return false;
    }
    return member.textSelection?.field === field;
  });
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
    image: stop.image || state.cover || images.city,
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
  const updates = pendingPlanUpdates();
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
      image: stop.image || state.cover || images.city,
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
  const type = ["todo", "note", "decision"].includes(block.type) ? block.type : "todo";
  const text = String(block.text || block.title || "").trim();
  if (!text) return null;
  return {
    id: block.id || uid(),
    type,
    text,
    textYjs: block.textYjs || "",
    done: Boolean(block.done),
    comments: normalizeComments(block.comments || []),
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  return lists;
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
  return normalizeCandidateStops(collabCandidatesArray ? collabCandidatesArray.toArray() : state.candidates || []);
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
    const value = collabSettingsMap?.has(meta.field) ? collabSettingsMap.get(meta.field) : state[meta.field];
    values[meta.field] = normalizePlanSettingValue(meta.field, value);
  });
  values.partySize = Math.max(1, Number.parseInt(values.partySize || state.partySize || 1, 10) || 1);
  values.budgetLimit = numberValue(values.budgetLimit || state.budgetLimit || 10000);
  if (!values.dateRange && values.startDate && values.endDate) values.dateRange = dateRangeText(values.startDate, values.endDate);
  return values;
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
  renderActivities();
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
}

function persistCurrentPlanFromDoc(label = "计划结构协作内容已实时同步", options = {}) {
  const { refreshViews = true, scheduleSave = true, updateStatus = true } = options;
  if (!collabPlanDoc || !collabDayMetasArray || !collabDayTextStatesMap || !collabDayBlockTextStatesMap || !collabDayBlockTextsMap || !collabStopListsMap || !collabStopTextStatesMap || !collabDayBlocksMap || !collabTransportQuotesArray || !collabCandidatesArray || !collabActivitiesArray || !collabSettingsMap) return;
  const nextDayMetas = readDayMetasFromDoc();
  const nextDayTextStates = readDayTextStatesFromDoc();
  const nextDayBlockTextStates = readDayBlockTextStatesFromDoc();
  const nextDayBlockTextValues = readDayBlockTextValuesFromDoc();
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
  const stopListsChanged = !sameSerialized(normalizeStopListsFromDays(state.days || []), nextStopLists);
  const stopTextStatesChanged = !sameSerialized(stopTextStateSnapshotFromDays(state.days || [], yjsModule), nextStopTextStates);
  const dayBlocksChanged = !sameSerialized(normalizeDayBlocksFromDays(state.days || []), nextDayBlocks);
  const quotesChanged = !sameSerialized(normalizeTransportQuotes(state.transportQuotes || []), nextQuotes);
  const candidatesChanged = !sameSerialized(normalizeCandidateStops(state.candidates || []), nextCandidates);
  const activitiesChanged = !sameSerialized(normalizeActivities(state.activities || []), nextActivities);
  const settingsChanged = PLAN_SETTING_FIELDS.some((meta) => !sameSerialized(planSettingValue(state, meta), nextSettings[meta.field]));
  const nextPlanYjs = currentPlanYjsState();
  const planYjsChanged = Boolean(nextPlanYjs && state.planYjs !== nextPlanYjs);
  const changed = dayMetasChanged || dayTextStatesChanged || dayBlockTextStatesChanged || dayBlockTextValuesChanged || stopListsChanged || stopTextStatesChanged || dayBlocksChanged || quotesChanged || candidatesChanged || activitiesChanged || settingsChanged || planYjsChanged;
  if (!changed) return;
  const visibleChanged = dayMetasChanged || dayTextStatesChanged || dayBlockTextStatesChanged || dayBlockTextValuesChanged || stopListsChanged || dayBlocksChanged || quotesChanged || candidatesChanged || activitiesChanged || settingsChanged;
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
  if (!state.dateRange && state.startDate && state.endDate) state.dateRange = dateRangeText(state.startDate, state.endDate);
  syncGuideStateFromPlan();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (updateStatus) dom.collabStatus.textContent = label;
  if (refreshViews && visibleChanged) refreshRealtimePlanViews();
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

function currentPlanYjsState() {
  if (!collabPlanDoc || !yjsModule) return state.planYjs || "";
  try {
    return bytesToBase64(yjsModule.encodeStateAsUpdate(collabPlanDoc));
  } catch (error) {
    console.warn("Plan Yjs state could not be encoded", error);
    return state.planYjs || "";
  }
}

async function applyPlanYjsStateToCurrentPlan(planYjs, label = "已应用计划结构协作快照") {
  if (!planYjs) return false;
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
  };
  const nextDoc = new Y.Doc();
  try {
    Y.applyUpdate(nextDoc, base64ToBytes(planYjs), "restore");
    collabPlanDoc = nextDoc;
    attachCollabPlanRefs();
    persistCurrentPlanFromDoc(label);
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
    nextDoc.destroy();
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
}

function seedMissingPlanDocContent(Y) {
  collabPlanDoc.transact(() => {
    PLAN_SETTING_FIELDS.forEach((meta) => {
      if (!collabSettingsMap.has(meta.field)) collabSettingsMap.set(meta.field, planSettingValue(state, meta));
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
  }, "restore");
}

function planDocMatchesCurrentState() {
  return (
    sameSerialized(normalizeDayMetas(state.days || []), readDayMetasFromDoc()) &&
    sameSerialized(dayTextStateSnapshotFromDays(state.days || [], yjsModule), readDayTextStatesFromDoc()) &&
    sameSerialized(dayBlockTextStateSnapshotFromDays(state.days || [], yjsModule), readDayBlockTextStatesFromDoc()) &&
    sameSerialized(dayBlockTextValueSnapshotFromDays(state.days || []), readDayBlockTextValuesFromDoc()) &&
    sameSerialized(stopListOrderSnapshot(normalizeStopListsFromDays(state.days || [])), stopListOrderSnapshot(readStopListsFromDoc())) &&
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

function readStructFromDoc() {
  const values = {};
  if (!collabStructMap) return values;
  COLLAB_STRUCT_FIELDS.forEach(({ field, type }) => {
    const value = collabStructMap.get(field);
    values[field] = type === "tags" ? normalizeTags(value) : type === "list" ? normalizeList(value) : type === "number" ? numberValue(value) : type === "boolean" ? Boolean(value) : String(value || "");
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

function dayBlockTypeLabel(type = "todo") {
  if (type === "note") return "备注";
  if (type === "decision") return "决定";
  return "待办";
}

function dayBlockIcon(type = "todo") {
  if (type === "note") return "notebook-text";
  if (type === "decision") return "badge-check";
  return "check-square";
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
  const editors = remoteEditorsForBlock(block.id).slice(0, 3);
  if (!editors.length) return "";
  return `
    <span class="day-block-presence" title="${escapeHtml(editors.map((member) => `${member.name || "协作者"} ${member.blockEditing || "正在编辑协作块"}`).join("、"))}">
      ${editors.map((member, index) => `<span class="text-presence-chip ${memberPresenceClass(member, index)}">${escapeHtml(memberInitial(member.name))}<span>${escapeHtml(member.blockEditing || "正在编辑")}</span></span>`).join("")}
    </span>
  `;
}

function refreshDayBlockTextPresence() {
  dom.dayBlockList?.querySelectorAll("[data-day-block]").forEach((blockElement) => {
    const blockId = blockElement.dataset.dayBlock || "";
    const block = normalizeDayBlocks(currentDay()?.blocks || []).find((item) => item.id === blockId);
    const wrap = blockElement.querySelector(".day-block-text-wrap");
    if (!block || !wrap) return;
    wrap.querySelector(".day-block-text-presence")?.remove();
    wrap.querySelectorAll(".comment-highlight").forEach((item) => item.remove());
    wrap.insertAdjacentHTML("beforeend", renderDayBlockCommentHighlights(block));
    wrap.insertAdjacentHTML("beforeend", renderDayBlockTextPresence(block));
  });
}

function renderDayBlocks(day = currentDay()) {
  if (!day || !dom.dayBlockList) return;
  const blocks = normalizeDayBlocks(day.blocks || []);
  const disabledAttr = isReadonlyMode ? " disabled" : "";
  const blockIds = new Set(blocks.map((block) => block.id));
  Object.keys(blockCommentFilters).forEach((blockId) => {
    if (!blockIds.has(blockId)) delete blockCommentFilters[blockId];
  });
  if (blockReplyingCommentId && !blocks.some((block) => normalizeComments(block.comments || []).some((comment) => comment.id === blockReplyingCommentId && !comment.parentId))) {
    blockReplyingCommentId = "";
  }
  if (dom.dayBlocksStatus) {
    const openCount = blocks.filter((block) => block.type === "todo" && !block.done).length;
    const commentCount = blocks.reduce((sum, block) => sum + commentRootsAndReplies(block.comments || []).roots.length, 0);
    dom.dayBlocksStatus.textContent = blocks.length ? `${blocks.length} 个块 · ${openCount} 个待办 · ${commentCount} 条评论` : "可添加块";
  }
  dom.dayBlockList.innerHTML = blocks.length
    ? blocks
        .map((block, index) => {
          const doneClass = block.done ? " is-done" : "";
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
          return `
            <article class="day-block${doneClass}" data-day-block="${escapeHtml(block.id)}">
              <button type="button" class="day-block-drag" data-drag-day-block="${escapeHtml(block.id)}" draggable="${isReadonlyMode ? "false" : "true"}" aria-label="拖拽排序协作块"${disabledAttr}>${icon("grip-vertical")}</button>
              <button type="button" class="day-block-toggle" data-toggle-day-block="${escapeHtml(block.id)}" aria-label="${block.done ? "标记未完成" : "标记完成"}"${disabledAttr}>${icon(block.done ? "check-circle-2" : dayBlockIcon(block.type))}</button>
              <span class="day-block-text-wrap">
                <input class="day-block-text" data-edit-day-block="${escapeHtml(block.id)}" value="${escapeHtml(block.text)}" aria-label="${escapeHtml(dayBlockTypeLabel(block.type))}"${disabledAttr} />
                ${renderDayBlockTextPresence(block)}
              </span>
              <span class="day-block-meta">${escapeHtml(meta)}</span>
              ${presenceHtml}
              <button type="button" class="comment-action day-block-comment-toggle" data-toggle-block-comments="${escapeHtml(block.id)}" aria-controls="${escapeHtml(commentPanelId)}">${icon("message-square")}评论${openCommentCount ? ` ${openCommentCount}` : ""}</button>
              <span class="day-block-order">
                <button type="button" class="icon-btn subtle" data-move-day-block="${escapeHtml(block.id)}" data-direction="up" aria-label="上移协作块"${upDisabled}>${icon("chevron-up")}</button>
                <button type="button" class="icon-btn subtle" data-move-day-block="${escapeHtml(block.id)}" data-direction="down" aria-label="下移协作块"${downDisabled}>${icon("chevron-down")}</button>
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
        })
        .join("")
    : `<div class="empty-state">还没有协作块，可以添加待办、备注或决定。</div>`;
  refreshIcons();
  requestAnimationFrame(() => refreshDayBlockTextPresence());
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

function broadcastDayDeleted(day) {
  if (!realtimeChannel || !tripId || !day?.id) return;
  const planYjs = currentPlanYjsState();
  realtimeChannel.send({
    type: "broadcast",
    event: "day-deleted",
    payload: {
      tripId,
      dayId: day.id,
      title: day.title || day.label || "当天",
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

async function broadcastPlanReplaced(reason = "更新整份计划") {
  if (!realtimeChannel || !tripId || !state?.days?.length) return;
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
  if (collabPlanDoc) {
    collabPlanDoc.destroy();
    collabPlanDoc = null;
  }
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
  collabPlanDoc.on("update", (update, origin) => {
    if (origin === "remote") {
      persistCurrentPlanFromDoc("收到协作者计划结构更新");
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
  if (sameSerialized(collabSettingsMap.get(field), nextValue)) return true;
  collabPlanDoc.transact(() => {
    collabSettingsMap.set(field, nextValue);
  }, "local-setting");
  return true;
}

async function syncPlanMetaToDoc(origin = "local-plan-meta") {
  if (!canEdit() || isReadonlyMode) return false;
  await bindCollabPlanDoc();
  if (!collabPlanDoc || !collabSettingsMap || isApplyingCollabPlanRemote) return false;
  const entries = PLAN_SETTING_FIELDS.map((meta) => [meta.field, planSettingValue(state, meta)]);
  const changed = entries.some(([field, value]) => !sameSerialized(collabSettingsMap.get(field), value));
  if (!changed) return true;
  collabPlanDoc.transact(() => {
    entries.forEach(([field, value]) => {
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
  const orderedMerged = desiredStops.map((stop) => {
    const latest = latestById.get(stop.id);
    if (!latest) return stop;
    if (!patchFields.length) return latest;
    const patch = {};
    patchFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(stop, field)) patch[field] = stop[field];
    });
    return normalizeCollaborativeStop({ ...latest, ...patch, id: latest.id });
  });
  const preservedExtras = latestStops.filter((stop) => !desiredIds.has(stop.id));
  const nextStops = [...orderedMerged, ...preservedExtras];
  if (sameSerialized(latestStops, nextStops)) return true;
  collabPlanDoc.transact(() => {
    syncYArrayById(stopArray, nextStops, normalizeCollaborativeStop);
  }, origin);
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

async function updateDayBlockTextInDoc(dayId, blockId, text, origin = "local-day-block-text-crdt") {
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
  let changed = false;
  let nextState = "";
  collabPlanDoc.transact(() => {
    const key = dayBlockTextKey(dayId, blockId);
    let yText = collabDayBlockTextsMap.get(key);
    if (!yText) {
      yText = new Y.Text();
      const initialText = block.text || "";
      if (initialText) yText.insert(0, initialText);
      collabDayBlockTextsMap.set(key, yText);
    }
    changed = applyTextDiff(yText, nextText);
    const yTextValue = yText.toString();
    nextState = bytesToBase64(buildInitialDayBlockTextUpdate(Y, { ...block, id: blockId, text: yTextValue }, dayId));
    collabDayBlockTextStatesMap.set(key, nextState);
  }, origin);
  if (!changed && block.text === nextText && block.textYjs === nextState) return true;
  collabPlanDoc.transact(() => {
    const latestItems = blockArray.toArray();
    const latestIndex = latestItems.findIndex((item) => item?.id === blockId);
    if (latestIndex < 0) return;
    const latest = normalizeDayBlock(latestItems[latestIndex]);
    const next = normalizeDayBlock({
      ...latest,
      id: blockId,
      text: nextText,
      textYjs: nextState,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!next || sameSerialized(latest, next)) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [next]);
  }, origin);
  return { text: nextText, textYjs: nextState };
}

async function addDayBlockToDoc(dayId, block, origin = "local-day-block-add") {
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
    blockArray.insert(blockArray.length, [normalized]);
  }, origin);
  return normalized;
}

async function updateDayBlockInDoc(dayId, blockId, patch = {}, origin = "local-day-block-update") {
  if (!canEdit() || isReadonlyMode || !dayId || !blockId) return false;
  const blockArray = await ensureDayBlockArray(dayId);
  if (!collabPlanDoc || !blockArray || isApplyingCollabPlanRemote) return false;
  const items = blockArray.toArray();
  const index = items.findIndex((block) => block?.id === blockId);
  if (index < 0) return false;
  const next = normalizeDayBlock({
    ...items[index],
    ...patch,
    id: blockId,
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
      ...patch,
      id: blockId,
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    if (!latest || sameSerialized(normalizeDayBlock(latestItems[latestIndex]), latest)) return;
    blockArray.delete(latestIndex, 1);
    blockArray.insert(latestIndex, [latest]);
  }, origin);
  return true;
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

async function replacePlanCollabDoc(origin = "local-plan-replace") {
  if (!canEdit() || isReadonlyMode) return false;
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
      if (dom[meta.domKey]) dom[meta.domKey].value = structDisplayValue(nextValue, meta.type);
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

async function mergePlanYjsStateIntoLiveDoc(planYjs, label = "已合并计划结构协作快照") {
  if (!planYjs) return false;
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
  persistCurrentPlanFromDoc(label);
  return true;
}

async function applyRemoteStructureSnapshot(payload = {}, label = "收到协作者结构快照") {
  if (!payload.planYjs || payload.tripId !== tripId) return false;
  const applied = await mergePlanYjsStateIntoLiveDoc(payload.planYjs, label);
  if (applied) {
    syncGuideStateFromPlan();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 新增地点协作快照`)) {
    if (stopExistsInPlan(payload.stop.id)) {
      logActivity(`${payload.name || "协作者"} 新增地点「${payload.stop.title || "未命名地点"}」`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 新增地点「${payload.stop.title || "未命名地点"}」`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了「${payload.stop.title || "地点"}」`;
  render();
}

async function applyRemoteStopDeleted(payload = {}) {
  if (!payload.stopId || payload.tripId !== tripId) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 删除地点协作快照`)) {
    if (!stopExistsInPlan(payload.stopId)) {
      destroyCollabTextDoc();
      logActivity(`${payload.name || "协作者"} 删除地点「${payload.title || "地点"}」`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 删除地点「${payload.title || "地点"}」`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了「${payload.title || "地点"}」`;
  render();
}

async function applyRemoteStopsReordered(payload = {}) {
  if (!payload.dayId || !Array.isArray(payload.stopOrder) || payload.tripId !== tripId) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 调整地点顺序协作快照`)) {
    if (stopOrderMatches(payload.dayId, payload.stopOrder)) {
      logActivity(`${payload.name || "协作者"} 调整地点顺序`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 调整地点顺序`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了地点顺序`;
  render();
}

async function applyRemoteDayUpdated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 更新当天设置协作快照`)) {
    const day = state.days.find((item) => item.id === payload.day.id);
    if (day) {
      logActivity(`${payload.name || "协作者"} 更新当天设置`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 更新当天设置`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 更新了 ${state.days[index].label}`;
  render();
}

async function applyRemoteDayCreated(payload = {}) {
  if (!payload.day?.id || payload.tripId !== tripId) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 新增一天协作快照`)) {
    if (state.days.some((day) => day.id === payload.day.id)) {
      logActivity(`${payload.name || "协作者"} 新增一天「${payload.day.title || payload.day.label || "新日期"}」`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 新增一天「${payload.day.title || payload.day.label || "新日期"}」`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 新增了 ${payload.day.title || "一天"}`;
  render();
}

async function applyRemoteDayDeleted(payload = {}) {
  if (!payload.dayId || payload.tripId !== tripId || state.days.length <= 1) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 删除一天协作快照`)) {
    if (!state.days.some((day) => day.id === payload.dayId)) {
      destroyCollabTextDoc();
      logActivity(`${payload.name || "协作者"} 删除一天「${payload.title || "当天"}」`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 删除一天「${payload.title || "当天"}」`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 删除了 ${payload.title || "一天"}`;
  render();
}

async function applyRemoteDaysReordered(payload = {}) {
  if (!Array.isArray(payload.dayOrder) || payload.tripId !== tripId) return;
  if (await applyRemoteStructureSnapshot(payload, `${payload.name || "协作者"} 调整日期顺序协作快照`)) {
    if (dayOrderMatches(payload.dayOrder)) {
      logActivity(`${payload.name || "协作者"} 调整日期顺序`, { broadcast: false });
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  logActivity(`${payload.name || "协作者"} 调整日期顺序`, { broadcast: false });
  dom.collabStatus.textContent = `${payload.name || "协作者"} 调整了日期顺序`;
  render();
}

async function applyRemotePlanReplaced(payload = {}) {
  if (payload.tripId !== tripId || (!payload.planYjs && !payload.state?.days?.length)) return;
  const activeDayId = currentDay()?.id || "";
  const activeStopId = currentStop()?.id || "";
  let appliedYjs = false;
  if (payload.planYjs) {
    appliedYjs = await applyPlanYjsStateToCurrentPlan(payload.planYjs, `${payload.name || "协作者"} 更新了整份计划`);
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
  destroyCollabPlanDoc();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  bindCollabPlanDoc();
  logActivity(`${payload.name || "协作者"} ${payload.reason || "更新整份计划"}`, { broadcast: false });
  dom.collabStatus.textContent = appliedYjs ? `${payload.name || "协作者"} 通过协作快照更新了整份计划` : `${payload.name || "协作者"} 更新了整份计划`;
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
  state = ensurePlanDates(clone(remotePlan));
  lastSyncedState = clone(state);
  lastRemoteUpdatedAt = meta.updatedAt || lastRemoteUpdatedAt;
  const remoteTextState = remoteActiveStop?.textYjs || remoteActiveStop?.noteYjs || "";
  if (remoteTextState && remoteTextState !== currentTextState) {
    destroyCollabTextDoc();
  }
  destroyCollabDayTextDoc();
  if (
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
  ) {
    destroyCollabPlanDoc();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  await refreshEditAccessFromUrl();
  isApplyingRemote = false;
}

async function resolveConflict(mode) {
  if (!pendingConflict || !requireEdit("处理协作冲突")) return;
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
    state = mode === "merge" ? mergePlans(localPlan, remotePlan, basePlan) : ensurePlanDates(localPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    lastRemoteUpdatedAt = conflict.updatedAt || lastRemoteUpdatedAt;
    hideConflictPanel();
    logActivity(mode === "merge" ? "合并协作冲突" : "保留本地版本解决冲突");
    await replacePlanCollabDoc(mode === "merge" ? "local-conflict-merge" : "local-conflict-keep");
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

async function handleRemotePlanUpdate(next) {
  if (!next?.data?.days?.length || next.updated_at === lastRemoteUpdatedAt) return;
  persistCurrentPlanFromDoc("收到云端更新前已同步当前协作结构");
  const remotePlan = ensurePlanDates(clone(next.data));
  if (pendingLocalRemoteUpdatedAt && next.updated_at === pendingLocalRemoteUpdatedAt && samePlanContent(state, remotePlan)) {
    lastRemoteUpdatedAt = next.updated_at || lastRemoteUpdatedAt;
    lastSyncedState = clone(remotePlan);
    pendingLocalRemoteUpdatedAt = "";
    hideConflictPanel();
    return;
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
  partySizeInput: document.querySelector("#partySizeInput"),
  budgetLimitInput: document.querySelector("#budgetLimitInput"),
  budgetSettlement: document.querySelector("#budgetSettlement"),
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
  routeDistance: document.querySelector("#routeDistance"),
  routeDuration: document.querySelector("#routeDuration"),
  mapProviderStatus: document.querySelector("#mapProviderStatus"),
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
  addCandidateBtn: document.querySelector("#addCandidateBtn"),
  cancelCandidateEditBtn: document.querySelector("#cancelCandidateEditBtn"),
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
  manualQuoteSubmitBtn: document.querySelector("#manualQuoteSubmitBtn"),
  cancelQuoteEditBtn: document.querySelector("#cancelQuoteEditBtn"),
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
  amapJsKeyInput: document.querySelector("#amapJsKeyInput"),
  amapSecurityCodeInput: document.querySelector("#amapSecurityCodeInput"),
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
let editingTransportQuoteId = "";
let editingCandidateId = "";
let ctripConfig = safeJsonParse(localStorage.getItem(CTRIP_CONFIG_KEY), { endpoint: "", token: "" }) || { endpoint: "", token: "" };
let externalImportConfig = safeJsonParse(localStorage.getItem(EXTERNAL_IMPORT_CONFIG_KEY), { endpoint: "", token: "" }) || { endpoint: "", token: "" };
let lastParsedImport = null;
let serviceConfig = safeJsonParse(localStorage.getItem(SERVICE_CONFIG_KEY), { aiEndpoint: "", aiToken: "", amapEndpoint: "", amapRouteEndpoint: "", amapJsKey: "", amapSecurityCode: "", weatherEndpoint: "" }) || {
  aiEndpoint: "",
  aiToken: "",
  amapEndpoint: "",
  amapRouteEndpoint: "",
  amapJsKey: "",
  amapSecurityCode: "",
  weatherEndpoint: "",
};
let memberProfile = safeJsonParse(sessionStorage.getItem(MEMBER_PROFILE_KEY), null);
let onlineMembers = [];
const sessionId = crypto.randomUUID ? crypto.randomUUID() : uid();
let supabaseClient = null;
let realtimeChannel = null;
const urlParams = new URLSearchParams(window.location.search);
let tripId = urlParams.get("trip") || localStorage.getItem("tripboard-current-trip-id") || "";
const forcedReadonlyMode = urlParams.get("mode") === "readonly";
let editAccessGranted = false;
let editAccessRequired = false;
let isReadonlyMode = forcedReadonlyMode;
let isApplyingRemote = false;
let lastRemoteUpdatedAt = "";
let lastSyncedState = null;
let pendingLocalRemoteUpdatedAt = "";
let pendingConflict = null;
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
let collabPlanTripId = "";
let collabPlanSaveTimer = null;
let isApplyingCollabPlanRemote = false;
let collabPlanBindRequestId = 0;
let dayFieldSyncTimer = null;
let dayBlockEditTimer = null;
let blockReplyingCommentId = "";
let blockCommentFilters = {};
let activeBlockPresenceId = "";
let draggingDayBlockId = "";
let presenceTrackTimer = null;
let lastCommentAnchor = null;
let replyingCommentId = "";
let commentFilter = "all";
let dayReplyingCommentId = "";
let dayCommentFilter = "all";
let commentIndexFilter = "open";
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
  const snapshot = planContentSnapshot(plan);
  const serialized = serializePlan(snapshot);
  if (last?.serialized === serialized) return;
  const entry = {
    id: uid(),
    reason,
    at: new Date().toISOString(),
    by,
    serialized,
    data: snapshot,
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
  pendingVersionRestoreId = "";
  saveVersionSnapshot("恢复前版本");
  state = ensurePlanDates(clone(entry.data));
  activeDay = 0;
  activeStop = 0;
  await replacePlanCollabDoc("local-version-restore");
  logActivity(`恢复历史版本：${entry.reason || "旧版本"}`);
  await saveState("已恢复历史版本");
  await broadcastPlanReplaced("恢复历史版本");
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

function logActivity(text, options = {}) {
  const localActivity = normalizeActivities([{
    id: uid(),
    text,
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
  return {
    memberId: profile?.id || sessionId,
    name: profile?.name || "匿名成员",
    role: profile?.role || "同行成员",
    activeDay: day?.label || "D1",
    activeDayId: day?.id || "",
    activeStopId: stop?.id || "",
    activeBlockId: blockContext?.blockId || "",
    activeBlockText: blockContext?.blockText || "",
    blockSelection: blockContext?.blockSelection || null,
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
    .map((member, index) => `<span class="avatar a${(index % 4) + 1}" title="${member.name} · ${member.role || "同行成员"}">${memberInitial(member.name)}</span>`)
    .join("") + (count ? `<span class="online-dot"></span>` : "");
  dom.memberList.innerHTML =
    members
      .map(
        (member, index) => {
          const textEditing = member.textEditing || (member.textSelection ? textSelectionLabel(member.textSelection) : "");
          const blockEditing = member.blockEditing ? `${member.blockEditing}：${member.activeBlockText || member.editing || "协作块"}` : "";
          const activity = textEditing || blockEditing || `${member.lockMode === "editing" ? "正在编辑" : "浏览"}：${member.editing || "计划"}`;
          return `
          <div class="member-item ${textEditing || blockEditing ? "is-text-editing" : ""}">
            <span class="avatar a${(index % 4) + 1}">${memberInitial(member.name)}</span>
            <p><strong>${escapeHtml(member.name || "匿名成员")}</strong><small>${escapeHtml(member.role || "同行成员")} · ${escapeHtml(member.activeDay || "在线")} · ${escapeHtml(activity)}</small></p>
            ${textEditing || blockEditing ? `<em>${escapeHtml(member.editing || member.activeBlockText || "当前内容")}</em>` : ""}
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
    dom.editAccessStatus.textContent = "已启用编辑口令；复制编辑链接会带上编辑密钥，只读链接仍只能查看。";
    dom.editAccessBtn.innerHTML = `${icon("key-round")}更新口令`;
  } else if (state.editKeyHash) {
    dom.editAccessStatus.textContent = state.editKeyHint ? `需要编辑口令，提示：${state.editKeyHint}` : "需要编辑口令才能修改计划。";
    dom.editAccessBtn.innerHTML = `${icon("unlock-keyhole")}解锁编辑`;
  } else {
    dom.editAccessStatus.textContent = "未设置编辑口令，编辑链接可直接修改。";
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
  dom.copySharedLinkBtn.textContent = isReadonlyMode ? "复制当前只读链接" : "复制编辑链接";
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
    await logActivity(`${actionText}批注「${stop.title || "地点"}」`);
    await syncStopSnapshotToPlanDoc(stop.id, updated ? "comment-index-stop-resolve-snapshot" : "comment-index-stop-resolve-fallback-snapshot");
    if (wasCurrentStop) await saveCollaborativeTextChange(`${actionText}批注「${stop.title || "地点"}」`);
    else await saveCollaborativePlanChange(`${actionText}批注「${stop.title || "地点"}」`);
  } else if (item.scope === "day") {
    const wasCurrentDay = currentDay()?.id === day.id;
    let updated = false;
    if (wasCurrentDay) updated = await updateCollaborativeDayComment(commentId, patch);
    day.comments = commentsWithUpdatedComment(day.comments || [], commentId, patch);
    await logActivity(`${actionText}当天批注「${day.title || day.label}」`);
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
    await logActivity(`${actionText}块级批注「${block.text.slice(0, 18)}」`);
    if (!updated) await syncDayBlocksToDoc(day.id, "comment-index-block-comment-resolve-fallback");
    await saveCollaborativePlanChange(`${actionText}块级批注`);
  }
  render();
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
    await logActivity(`回复批注「${stop.title || "地点"}」`);
    await syncStopSnapshotToPlanDoc(stop.id, reply ? "comment-index-stop-reply-snapshot" : "comment-index-stop-reply-fallback-snapshot");
    if (wasCurrentStop) await saveCollaborativeTextChange(`回复批注「${stop.title || "地点"}」`);
    else await saveCollaborativePlanChange(`回复批注「${stop.title || "地点"}」`);
  } else if (item.scope === "day") {
    const wasCurrentDay = currentDay()?.id === day.id;
    let reply = false;
    if (wasCurrentDay) reply = await addCollaborativeDayCommentReply(item.id, replyText);
    const nextReply = reply || createCommentReply(item.id, replyText);
    day.comments = normalizeComments([...(day.comments || []), nextReply]);
    await logActivity(`回复当天批注「${day.title || day.label}」`);
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
    await logActivity(`回复块级批注「${block.text.slice(0, 18)}」`);
    if (!reply) await syncDayBlocksToDoc(day.id, "comment-index-block-comment-reply-fallback");
    await saveCollaborativePlanChange("已回复块级批注");
  }
  render();
  dom.saveState.textContent = "已回复批注";
  return true;
}

function focusCommentIndexItem(commentId = "") {
  const item = commentIndexItems().find((entry) => entry.id === commentId);
  if (!item) return false;
  const dayIndex = state.days.findIndex((day, index) => (item.dayId && day.id === item.dayId) || index === item.dayIndex);
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

function getShareUrl() {
  if (!tripId) return "";
  const url = new URL(window.location.href);
  url.searchParams.set("trip", tripId);
  url.searchParams.delete("mode");
  const editKey = currentEditKeyValue();
  if (state.editKeyHash && editKey) url.searchParams.set("editKey", editKey);
  else url.searchParams.delete("editKey");
  return url.toString();
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
  if (!options.skipPendingFlush) await flushPendingPlanUpdates("保存前重放离线协作更新");
  await refreshLiveCollabStateBeforeRemoteSave("保存云端前已刷新协作快照");
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
      renderMembers();
      renderDayBlocks(currentDay());
      renderEditorLockState();
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
      renderMembers();
      renderDayBlocks(currentDay());
      renderEditorLockState();
    })
    .on("presence", { event: "join" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      renderMembers();
      renderDayBlocks(currentDay());
      renderEditorLockState();
    })
    .on("presence", { event: "leave" }, () => {
      onlineMembers = uniqueMembersFromPresence(realtimeChannel.presenceState());
      renderMembers();
      renderDayBlocks(currentDay());
      renderEditorLockState();
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
  destroyCollabPlanDoc();
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
  destroyCollabPlanDoc();
  hideConflictPanel();
  localStorage.setItem("tripboard-current-trip-id", tripId);
  editAccessGranted = true;
  editAccessRequired = Boolean(state.editKeyHash);
  isReadonlyMode = false;
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
    amapJsKey: dom.amapJsKeyInput.value.trim(),
    amapSecurityCode: dom.amapSecurityCodeInput.value.trim(),
    weatherEndpoint: dom.weatherEndpointInput.value.trim(),
  };
  localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
  if (!serviceConfig.amapJsKey && amapMap) {
    clearAmapOverlay();
    amapMap.destroy();
    amapMap = null;
    amapLoadedKey = "";
    amapLoaderPromise = null;
  }
  renderServiceStatus();
  renderMap();
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
    serviceConfig.amapJsKey && "高德地图",
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

function weatherForDay(forecastDays, day, index) {
  const datedForecasts = forecastDays.filter((item) => item.date);
  if (day.date && datedForecasts.length) {
    return datedForecasts.find((item) => item.date === day.date) || null;
  }
  return forecastDays[index] || null;
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
      day.weather = match.text || match.weather || match.summary || day.weather;
      weatherPatches.push({ id: day.id, weather: day.weather });
      applied += 1;
    });
    logActivity(`同步天气 ${applied} 天`);
    if (applied) {
      await Promise.all(weatherPatches.map((patch) => patchDayMetaInDoc(patch.id, { weather: patch.weather }, "local-weather-sync-patch")));
      await syncPlanMetaToDoc("local-weather-sync-meta");
    }
    await saveState("已同步天气");
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
    dom.quickAmapKeyword.value = candidate.amapKeyword || `${state.destination || ""} ${candidate.title || ""}`.trim();
    dom.quickTime.value = candidate.time || "";
    dom.quickBudget.value = candidate.budget || "";
    dom.quickAddress.value = candidate.address || "";
    quickAmapPlace = candidate.lng || candidate.lat ? {
      keyword: candidate.amapKeyword || "",
      title: candidate.title || "",
      address: candidate.address || "",
      lng: candidate.lng || "",
      lat: candidate.lat || "",
    } : null;
  }
  if (dom.addCandidateBtn) {
    dom.addCandidateBtn.innerHTML = `${icon(candidate ? "save" : "bookmark-plus")}<span>${candidate ? "更新备选" : "加入备选池"}</span>`;
  }
  if (dom.cancelCandidateEditBtn) dom.cancelCandidateEditBtn.hidden = !candidate;
  refreshIcons();
}

function clearQuickPlaceForm({ keepCandidateEditing = false } = {}) {
  if (!keepCandidateEditing) editingCandidateId = "";
  dom.quickPlaceName.value = "";
  dom.quickAmapKeyword.value = "";
  dom.quickTime.value = "";
  dom.quickBudget.value = "";
  dom.quickAddress.value = "";
  quickAmapPlace = null;
  if (!keepCandidateEditing) setCandidateEditing(null);
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

function manualTransportQuotes() {
  return state.transportQuotes || [];
}

function currentManualQuotes(day) {
  return manualTransportQuotes().filter((item) => item.dayId === day?.id || item.date === day?.date);
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
  const savedQuoteKeys = new Set(manualQuotes.map(transportOptionIdentity));
  const providerOptions = transportProviderItems.filter((item) => !savedQuoteKeys.has(transportOptionIdentity(item)));
  const baseOptions = transportProviderItems.length ? providerOptions : buildTransportOptions(day, activeDay);
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
        (item) => `
          <article class="transport-item ${item.id === editingTransportQuoteId ? "is-editing" : ""}" data-quote="${escapeHtml(item.id || "")}">
            <span class="transport-icon">${icon(item.type === "flight" ? "plane" : "train-front")}</span>
            <div>
              <strong>${escapeHtml(item.code)} · ${escapeHtml(item.from)} → ${escapeHtml(item.to)}</strong>
              <span>${escapeHtml(item.depart)} - ${escapeHtml(item.arrive)} · 约${Math.floor(item.duration / 60)}小时${item.duration % 60}分 · ${escapeHtml(item.source)}</span>
            </div>
            <em>${money(item.price)}</em>
            ${manualQuoteIds.has(item.id) ? `<span class="transport-actions">
              <button type="button" class="icon-btn subtle" data-edit-quote="${escapeHtml(item.id)}" aria-label="编辑报价">${icon("pencil")}</button>
              <button type="button" class="icon-btn subtle danger-icon" data-delete-quote="${escapeHtml(item.id)}" aria-label="删除报价">${icon("trash-2")}</button>
            </span>` : ""}
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
  logActivity(`同步 Google Flights 航班报价 ${transportProviderItems.length} 条，保存 ${savedCount} 条`);
  await saveState("已同步 Google Flights 报价");
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
    logActivity(`比较多人出发地航班 ${matched}/${results.length} 人，保存 ${savedCount} 条推荐报价`);
    await saveState("已保存多人出发地航班比较");
    setCtripStatus(`已完成多人出发地比较：${matched}/${results.length} 人匹配到航班，最低合计 ${money(total)}；已保存 ${savedCount} 条推荐报价到共享计划。`, matched ? "check-circle-2" : "alert-circle");
  } catch (error) {
    setCtripStatus(`多人出发地比较保存失败：${error.message}。已保留当前页面结果，可稍后重试。`, "alert-triangle");
  } finally {
    dom.compareOriginsBtn.disabled = false;
  }
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

function settlementSuggestions() {
  const total = totalBudget();
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
    ${payerRows || "<span>暂无付款记录</span>"}
    <strong>AA 结算建议</strong>
    ${transferRows || "<span>当前无需转账或付款人信息不足</span>"}
    ${settlement.missingPayer ? `<span>未指定付款人 ${money(settlement.missingPayer)}，建议先补充付款人</span>` : ""}
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
  if (collabDayTextDayId !== day.id || !collabDayTextDoc) {
    dom.fieldDayTitle.value = day.title || "";
    dom.fieldDayRoute.value = day.route || "";
    dom.fieldDayWeather.value = day.weather || "";
    dom.fieldDayTransport.value = day.transport || "";
  }
  dom.dayEditorStatus.textContent = isReadonlyMode ? "只读" : tripId ? "实时协作" : "本地保存";
  dom.moveDayUpBtn.disabled = isReadonlyMode || activeDay === 0;
  dom.moveDayDownBtn.disabled = isReadonlyMode || activeDay >= state.days.length - 1;
  dom.deleteDayBtn.disabled = isReadonlyMode || state.days.length <= 1;
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
  renderFallbackMap(day);
  if (hasAmapJsConfig()) scheduleAmapRender(day);
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
  const editable = canEdit();
  if (editingCandidateId && !(state.candidates || []).some((item) => item.id === editingCandidateId)) {
    setCandidateEditing(null);
  }
  dom.candidateGrid.innerHTML = state.candidates
    .map(
      (stop, index) => `
        <article class="candidate ${stop.id === editingCandidateId ? "is-editing" : ""}" data-candidate="${index}" role="button" tabindex="${editable ? "0" : "-1"}" aria-disabled="${editable ? "false" : "true"}">
          ${icon(stop.type === "Market" ? "shopping-bag" : stop.type === "Cafe" ? "coffee" : "landmark")}
          <span class="candidate-title">${escapeHtml(stop.title)}</span>
          <span class="candidate-price">${money(stop.budget)}</span>
          ${editable ? `<span class="candidate-actions">
            <button type="button" class="icon-btn subtle" data-edit-candidate="${escapeHtml(stop.id)}" aria-label="编辑备选">${icon("pencil")}</button>
            <button type="button" class="icon-btn subtle danger-icon" data-delete-candidate="${escapeHtml(stop.id)}" aria-label="移除备选">${icon("trash-2")}</button>
          </span>` : ""}
        </article>
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
  renderCommentIndex();
  applyReadonlyUi();
  renderDayEditor();
  renderDayComments(currentDay());
  renderDayBlocks(currentDay());
  renderEditorLockState();
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
  logActivity(label);
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
  return makeStop({
    time: dom.quickTime.value.trim() || "10:00",
    title: name,
    type: extra.type || "Scenic",
    address: dom.quickAddress.value.trim() || locatedPlace?.address || keyword,
    note: extra.note || `从快速录入加入。高德关键词：${keyword}`,
    tags: extra.tags || ["自定义", "待优化"],
    budget: Number(dom.quickBudget.value || 0),
    amapKeyword: keyword,
    lng: locatedPlace?.lng || "",
    lat: locatedPlace?.lat || "",
    x: extra.x ?? 50,
    y: extra.y ?? 50,
    image: state.cover || images.city,
  });
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

dom.dayForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let updatedDay = null;
  const dayId = currentDay()?.id || "";
  const { draft: dayDraft, patch: dayPatch } = dayEditorDraftChange();
  const changed = mutate("保存当天设置", () => {
    updatedDay = applyDayEditorDraftToState(dayDraft);
  }, { requireUnlocked: false, save: false, render: false });
  if (updatedDay) {
    if (Object.prototype.hasOwnProperty.call(dayPatch, "date")) {
      await syncDayMetasToDoc("local-day-date-update");
    } else {
      await patchDayMetaInDoc(dayId, dayPatch, "local-day-update-patch");
    }
    await syncPlanMetaToDoc("local-day-date-meta");
    await saveState("保存当天设置");
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
  if (!silent) logActivity("同步当天设置");
  if (Object.prototype.hasOwnProperty.call(dayPatch, "date")) {
    await syncDayMetasToDoc("local-day-date-field-change");
  } else {
    await patchDayMetaInDoc(dayId, dayPatch, "local-day-field-change-patch");
  }
  await syncPlanMetaToDoc("local-day-field-change-meta");
  await saveState(silent ? "当天设置正在协作同步" : "已同步当天设置");
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
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (createdDay) {
    if (!(await addDayMetaToDoc(createdDay, createdIndex, "local-day-create"))) {
      await syncDayMetasToDoc("local-day-create-fallback");
    }
    await syncStopListToDoc(createdDay.id, "local-day-create-stops");
    await syncPlanMetaToDoc("local-day-create-meta");
    await saveState("新增一天");
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
  const label = `删除「${deletedDay.title || deletedDay.label}」`;
  if (!mutate(label, () => {
    state.days.splice(activeDay, 1);
    activeDay = Math.max(0, Math.min(activeDay, state.days.length - 1));
    activeStop = 0;
    destroyCollabTextDoc();
    reflowPlanDates();
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (!(await deleteDayFromDoc(deletedDay.id, "local-day-delete"))) {
    await syncDayMetasToDoc("local-day-delete-fallback");
    await syncStopListsToDoc("local-day-delete-stops-fallback");
  }
  await syncPlanMetaToDoc("local-day-delete-meta");
  await saveState(label);
  broadcastDayDeleted(deletedDay);
  render();
});

dom.moveDayUpBtn.addEventListener("click", async () => {
  if (activeDay <= 0) return;
  let changed = false;
  if (!mutate("上移当天", () => {
    [state.days[activeDay - 1], state.days[activeDay]] = [state.days[activeDay], state.days[activeDay - 1]];
    activeDay -= 1;
    activeStop = 0;
    reflowPlanDates();
    changed = true;
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (changed) {
    if (!(await reorderDayMetasInDoc(state.days, "local-day-reorder"))) {
      await syncDayMetasToDoc("local-day-reorder-fallback");
    }
    await syncPlanMetaToDoc("local-day-reorder-meta");
    await saveState("上移当天");
    broadcastDaysReordered();
    render();
  }
});

dom.moveDayDownBtn.addEventListener("click", async () => {
  if (activeDay >= state.days.length - 1) return;
  let changed = false;
  if (!mutate("下移当天", () => {
    [state.days[activeDay + 1], state.days[activeDay]] = [state.days[activeDay], state.days[activeDay + 1]];
    activeDay += 1;
    activeStop = 0;
    reflowPlanDates();
    changed = true;
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (changed) {
    if (!(await reorderDayMetasInDoc(state.days, "local-day-reorder"))) {
      await syncDayMetasToDoc("local-day-reorder-fallback");
    }
    await syncPlanMetaToDoc("local-day-reorder-meta");
    await saveState("下移当天");
    broadcastDaysReordered();
    render();
  }
});

dom.stopForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let dayId = currentDay()?.id || "";
  let savedStopId = currentStop()?.id || "";
  const label = `保存「${dom.fieldTitle.value || "地点"}」`;
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
  }, { save: false, render: false })) return;
  if (!(await syncStopSnapshotToPlanDoc(savedStopId, "local-stop-detail-save"))) {
    await syncStopListToDoc(dayId, "local-stop-detail-save-fallback");
  }
  await saveState(label);
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

dom.addStopBtn.addEventListener("click", async () => {
  let createdStop = null;
  let createdDayId = "";
  if (!mutate("新增地点", () => {
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
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (createdStop) {
    await addStopToDoc(createdDayId, createdStop, "local-stop-create");
    await saveState("新增地点");
    broadcastStopCreated(createdDayId, createdStop);
    render();
  }
});

dom.quickAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const draft = quickPlaceDraft();
  if (!draft) return;
  const name = draft.title;
  let createdStop = null;
  let createdDayId = "";
  const label = `加入景点「${name}」`;
  if (!mutate(label, () => {
    const day = currentDay();
    createdStop = {
      ...draft,
      x: 30 + ((day.stops.length * 17) % 52),
      y: 28 + ((day.stops.length * 13) % 42),
    };
    createdDayId = day.id;
    day.stops.push(createdStop);
    activeStop = day.stops.length - 1;
    clearCurrentAmapRoute();
    clearQuickPlaceForm();
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (createdStop) {
    await addStopToDoc(createdDayId, createdStop, "local-quick-stop-create");
    await saveState(label);
    broadcastStopCreated(createdDayId, createdStop);
    render();
  }
});

dom.addCandidateBtn.addEventListener("click", async () => {
  const draft = quickPlaceDraft({
    note: "从快速录入加入备选池，可稍后安排到任意一天。",
    tags: ["备选", "自定义"],
  });
  if (!draft || !requireEdit("加入备选池")) return;
  if (editingCandidateId) {
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
      time: draft.time,
      amapKeyword: draft.amapKeyword,
      lng: draft.lng,
      lat: draft.lat,
      image: draft.image,
    };
    if (await updateCandidateInDoc(editingCandidateId, patch)) {
      persistCurrentPlanFromDoc("备选池协作内容已实时同步");
      await logActivity(`更新备选池「${draft.title}」`);
      clearQuickPlaceForm();
      await saveCollaborativePlanChange(`更新备选「${draft.title}」`);
      dom.saveState.textContent = `已更新备选「${draft.title}」`;
      refreshRealtimePlanViews();
      return;
    }
    mutate(`更新备选「${draft.title}」`, () => {
      state.candidates = mergedCandidatesWithPatch("update", patch, editingCandidateId);
      clearQuickPlaceForm();
    }, { requireUnlocked: false });
    await syncCandidatesToDoc("local-candidate-update-fallback");
    return;
  }
  if (await addCollaborativeCandidate(draft)) {
    persistCurrentPlanFromDoc("备选池协作内容已实时同步");
    await logActivity(`加入备选池「${draft.title}」`);
    clearQuickPlaceForm();
    await saveCollaborativePlanChange(`加入备选池「${draft.title}」`);
    dom.saveState.textContent = `已加入备选池「${draft.title}」`;
    refreshRealtimePlanViews();
    return;
  }
  mutate(`加入备选池「${draft.title}」`, () => {
    state.candidates = mergedCandidatesWithPatch("add", draft);
    clearQuickPlaceForm();
  }, { requireUnlocked: false });
  await syncCandidatesToDoc("local-candidate-fallback");
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
    if (!(await patchDayMetaInDoc(day.id, { amapRoute: day.amapRoute }, "local-amap-route-day-patch"))) {
      await syncDayMetasToDoc("local-amap-route-day-fallback");
    }
    if (!(await reorderStopListInDoc(day.id, day.stops, "local-amap-route-stops", { patchFields: ["address", "lng", "lat", "amapKeyword"] }))) {
      await syncStopListToDoc(day.id, "local-amap-route-stops-fallback");
    }
    await saveState("已用高德规划路线");
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

dom.deleteStopBtn.addEventListener("click", async () => {
  const day = currentDay();
  if (day.stops.length <= 1) {
    dom.saveState.textContent = "每天至少保留一个地点";
    return;
  }
  const deletedStop = clone(currentStop());
  const label = `删除「${deletedStop.title}」`;
  if (!mutate(label, () => {
    day.stops.splice(activeStop, 1);
    activeStop = Math.max(0, activeStop - 1);
    clearCurrentAmapRoute();
  }, { save: false, render: false })) return;
  await deleteStopFromDoc(day.id, deletedStop.id, "local-stop-delete");
  await saveState(label);
  broadcastStopDeleted(day.id, deletedStop);
  render();
});

dom.moveUpBtn.addEventListener("click", async () => {
  if (activeStop === 0) return;
  let dayId = "";
  let nextStops = [];
  if (!mutate("上移地点", () => {
    const day = currentDay();
    const stops = day.stops;
    [stops[activeStop - 1], stops[activeStop]] = [stops[activeStop], stops[activeStop - 1]];
    activeStop -= 1;
    dayId = day.id;
    nextStops = [...stops];
    clearCurrentAmapRoute();
  }, { save: false, render: false })) return;
  if (!(await reorderStopListInDoc(dayId, nextStops, "local-stop-reorder"))) {
    await syncStopListToDoc(dayId, "local-stop-reorder-fallback");
  }
  await saveState("上移地点");
  broadcastStopsReordered(dayId, nextStops);
  render();
});

dom.moveDownBtn.addEventListener("click", async () => {
  const stops = currentDay().stops;
  if (activeStop >= stops.length - 1) return;
  let dayId = "";
  let nextStops = [];
  if (!mutate("下移地点", () => {
    const day = currentDay();
    const dayStops = day.stops;
    [dayStops[activeStop + 1], dayStops[activeStop]] = [dayStops[activeStop], dayStops[activeStop + 1]];
    activeStop += 1;
    dayId = day.id;
    nextStops = [...dayStops];
    clearCurrentAmapRoute();
  }, { save: false, render: false })) return;
  if (!(await reorderStopListInDoc(dayId, nextStops, "local-stop-reorder"))) {
    await syncStopListToDoc(dayId, "local-stop-reorder-fallback");
  }
  await saveState("下移地点");
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
    const reorderOrigin = serviceConfig.aiEndpoint ? "local-ai-route-reorder" : "local-fallback-route-reorder";
    if (!(await reorderStopListInDoc(day.id, day.stops, reorderOrigin, { patchFields: ["tags"] }))) {
      await syncStopListToDoc(day.id, `${reorderOrigin}-fallback`);
    }
    await saveState(serviceConfig.aiEndpoint ? "已用 AI 优化路径" : "已用本地距离优化路径");
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
  await saveState("更新必去投票");
  render();
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
  await saveState("更新收藏");
  render();
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
      renderStopComments(stop);
      dom.commentCount.textContent = stop.comments.length;
      await logActivity(`回复评论「${stop.title}」`);
      await syncStopSnapshotToPlanDoc(stop.id, "local-comment-reply-snapshot");
      await saveCollaborativeTextChange(`回复评论「${stop.title}」`);
      dom.saveState.textContent = `已回复「${stop.title}」的评论`;
      return;
    }
    const fallbackTitle = currentStop().title;
    if (!mutate(`回复评论「${fallbackTitle}」`, () => {
      currentStop().comments = normalizeComments([...(currentStop().comments || []), createCommentReply(parentId, text)]);
      replyingCommentId = "";
      dom.commentInput.value = "";
      dom.commentInput.placeholder = "添加同行意见或提醒";
    }, { save: false, render: false })) return;
    await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-reply-fallback-snapshot");
    await saveState(`回复评论「${fallbackTitle}」`);
    render();
    return;
  }
  const anchor = currentCommentAnchor("stop");
  const collaborativeComment = await addCollaborativeComment(text, anchor);
  if (collaborativeComment) {
    const stop = currentStop();
    stop.comments = normalizeComments([...(stop.comments || []), collaborativeComment]);
    dom.commentInput.value = "";
    renderStopComments(stop);
    dom.commentCount.textContent = stop.comments.length;
    await logActivity(`评论「${stop.title}」`);
    await syncStopSnapshotToPlanDoc(stop.id, "local-comment-snapshot");
    await saveCollaborativeTextChange(`评论「${stop.title}」`);
    dom.saveState.textContent = `已评论「${stop.title}」`;
    return;
  }
  const fallbackTitle = currentStop().title;
  if (!mutate(`评论「${fallbackTitle}」`, () => {
    currentStop().comments = [...(currentStop().comments || []), { id: uid(), author: getCollabName(), text, at: new Date().toISOString(), ...(anchor ? { anchor } : {}) }];
    dom.commentInput.value = "";
  }, { save: false, render: false })) return;
  await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-fallback-snapshot");
  await saveState(`评论「${fallbackTitle}」`);
  render();
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
      renderStopComments(stop);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`);
      await syncStopSnapshotToPlanDoc(stop.id, "local-comment-resolve-snapshot");
      await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`);
      dom.saveState.textContent = comment.resolved ? "已重新打开评论" : "已标记评论解决";
      return;
    }
    if (!mutate(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`, () => {
      currentStop().comments = commentsWithUpdatedComment(currentStop().comments || [], commentId, nextPatch);
    }, { save: false, render: false })) return;
    await syncStopSnapshotToPlanDoc(currentStop().id, "local-comment-resolve-fallback-snapshot");
    await saveState(`${comment.resolved ? "重新打开" : "解决"}评论「${stop.title}」`);
    render();
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
    renderStopComments(stop);
    dom.commentCount.textContent = stop.comments.length;
    await logActivity(`删除评论「${stop.title}」`);
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
  await saveState(`删除评论「${stop.title}」`);
  render();
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
      renderDayComments(day);
      await logActivity(`回复当天批注「${day.title}」`);
      await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-reply-snapshot");
      await saveCollaborativeTextChange(`回复当天批注「${day.title}」`);
      dom.saveState.textContent = `已回复「${day.title}」的当天批注`;
      return;
    }
    const fallbackTitle = currentDay().title;
    if (!mutate(`回复当天批注「${fallbackTitle}」`, () => {
      currentDay().comments = normalizeComments([...(currentDay().comments || []), createCommentReply(parentId, text)]);
      dayReplyingCommentId = "";
      dom.dayCommentInput.value = "";
      dom.dayCommentInput.placeholder = "给当天标题、路线、天气或交通添加批注";
    }, { requireUnlocked: false, save: false, render: false })) return;
    await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-reply-fallback-snapshot");
    await saveState(`回复当天批注「${fallbackTitle}」`);
    render();
    return;
  }
  const anchor = currentCommentAnchor("day");
  const collaborativeComment = await addCollaborativeDayComment(text, anchor);
  if (collaborativeComment) {
    const day = currentDay();
    day.comments = normalizeComments([...(day.comments || []), collaborativeComment]);
    dom.dayCommentInput.value = "";
    renderDayComments(day);
    await logActivity(`当天批注「${day.title}」`);
    await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-snapshot");
    await saveCollaborativeTextChange(`当天批注「${day.title}」`);
    dom.saveState.textContent = `已批注「${day.title}」`;
    return;
  }
  const fallbackTitle = currentDay().title;
  if (!mutate(`当天批注「${fallbackTitle}」`, () => {
    currentDay().comments = normalizeComments([...(currentDay().comments || []), { id: uid(), author: getCollabName(), text, at: new Date().toISOString(), ...(anchor ? { anchor } : {}) }]);
    dom.dayCommentInput.value = "";
  }, { requireUnlocked: false, save: false, render: false })) return;
  await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-fallback-snapshot");
  await saveState(`当天批注「${fallbackTitle}」`);
  render();
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
      renderDayComments(day);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`);
      await patchDayMetaInDoc(day.id, { comments: day.comments }, "local-day-comment-resolve-snapshot");
      await saveCollaborativeTextChange(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`);
      dom.saveState.textContent = comment.resolved ? "已重新打开当天批注" : "已标记当天批注解决";
      return;
    }
    if (!mutate(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`, () => {
      currentDay().comments = commentsWithUpdatedComment(currentDay().comments || [], commentId, nextPatch);
    }, { requireUnlocked: false, save: false, render: false })) return;
    await patchDayMetaInDoc(currentDay().id, { comments: currentDay().comments }, "local-day-comment-resolve-fallback-snapshot");
    await saveState(`${comment.resolved ? "重新打开" : "解决"}当天批注「${day.title}」`);
    render();
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
    renderDayComments(day);
    await logActivity(`删除当天批注「${day.title}」`);
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
  await saveState(`删除当天批注「${day.title}」`);
  render();
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
    day.blocks = normalizeDayBlocks([...(day.blocks || []), added === true ? block : added]);
    dom.dayBlockInput.value = "";
    renderDayBlocks(day);
    await logActivity(`添加协作块「${day.title}」`);
    await saveCollaborativePlanChange(`添加协作块「${day.title}」`);
    dom.saveState.textContent = "已添加协作块";
    return;
  }
  if (!mutate(`添加协作块「${day.title}」`, () => {
    currentDay().blocks = normalizeDayBlocks([...(currentDay().blocks || []), block]);
    dom.dayBlockInput.value = "";
  }, { requireUnlocked: false, save: false, render: false })) return;
  await syncDayBlocksToDoc(currentDay().id, "local-day-block-add-fallback");
  await saveState(`添加协作块「${day.title}」`);
  render();
});

dom.dayBlockList?.addEventListener("click", async (event) => {
  const day = currentDay();
  if (!day) return;
  const filterBlockCommentButton = event.target.closest("[data-block-comment-filter]");
  if (filterBlockCommentButton) {
    event.preventDefault();
    const blockElement = filterBlockCommentButton.closest("[data-day-block]");
    const blockId = blockElement?.dataset.dayBlock || "";
    if (!blockId) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    blockCommentFilters[blockId] = filterBlockCommentButton.dataset.blockCommentFilter || "all";
    renderDayBlocks(day);
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
  const toggleButton = event.target.closest("[data-toggle-day-block]");
  if (toggleButton) {
    event.preventDefault();
    const blockId = toggleButton.dataset.toggleDayBlock;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || !requireEdit("更新协作块")) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    const nextDone = !block.done;
    if (await updateDayBlockInDoc(day.id, blockId, { done: nextDone }, "local-day-block-toggle")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, done: nextDone, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      renderDayBlocks(day);
      await logActivity(`${nextDone ? "完成" : "重新打开"}协作块「${block.text.slice(0, 18)}」`);
      await saveCollaborativePlanChange("已更新协作块");
      return;
    }
    if (!mutate("更新协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === blockId ? { ...item, done: nextDone } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-toggle-fallback");
    await saveState("已更新协作块");
    render();
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
    renderDayBlocks(day);
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
      renderDayBlocks(day);
      await logActivity(`${comment.resolved ? "重新打开" : "解决"}块级评论「${block.text.slice(0, 18)}」`);
      await saveCollaborativePlanChange("已更新块级评论");
      return;
    }
    if (!mutate("更新块级评论", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithUpdatedComment(item.comments || [], commentId, patch) } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-comment-resolve-fallback");
    await saveState("已更新块级评论");
    render();
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
      renderDayBlocks(day);
      await logActivity(`删除块级评论「${block.text.slice(0, 18)}」`);
      await saveCollaborativePlanChange("已删除块级评论");
      return;
    }
    if (!mutate("删除块级评论", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).map((item) => (item.id === block.id ? { ...item, comments: commentsWithoutThread(item.comments || [], commentId) } : item)));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-comment-delete-fallback");
    await saveState("已删除块级评论");
    render();
    return;
  }
  const moveButton = event.target.closest("[data-move-day-block]");
  if (moveButton) {
    event.preventDefault();
    const blockId = moveButton.dataset.moveDayBlock;
    const direction = moveButton.dataset.direction === "up" ? "up" : "down";
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || !requireEdit("排序协作块")) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    if (await moveDayBlockInDoc(day.id, blockId, direction, "local-day-block-reorder")) {
      day.blocks = moveDayBlockList(day.blocks || [], blockId, direction, {
        updatedBy: getCollabName(),
        updatedAt: new Date().toISOString(),
      });
      renderDayBlocks(day);
      await logActivity(`排序协作块「${block.text.slice(0, 18)}」`);
      await saveCollaborativePlanChange("已排序协作块");
      return;
    }
    if (!mutate("排序协作块", () => {
      currentDay().blocks = moveDayBlockList(currentDay().blocks || [], blockId, direction);
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-reorder-fallback");
    await saveState("已排序协作块");
    render();
    return;
  }
  const deleteButton = event.target.closest("[data-delete-day-block]");
  if (deleteButton) {
    event.preventDefault();
    const blockId = deleteButton.dataset.deleteDayBlock;
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block || !requireEdit("删除协作块")) return;
    activeBlockPresenceId = blockId;
    schedulePresenceTrack(0);
    if (await deleteDayBlockFromDoc(day.id, blockId, "local-day-block-delete")) {
      day.blocks = normalizeDayBlocks((day.blocks || []).filter((item) => item.id !== blockId));
      renderDayBlocks(day);
      await logActivity(`删除协作块「${block.text.slice(0, 18)}」`);
      await saveCollaborativePlanChange("已删除协作块");
      return;
    }
    if (!mutate("删除协作块", () => {
      currentDay().blocks = normalizeDayBlocks((currentDay().blocks || []).filter((item) => item.id !== blockId));
    }, { requireUnlocked: false, save: false, render: false })) return;
    await syncDayBlocksToDoc(currentDay().id, "local-day-block-delete-fallback");
    await saveState("已删除协作块");
    render();
  }
});

dom.dayBlockList?.addEventListener("submit", async (event) => {
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
    renderDayBlocks(day);
    await logActivity(`${parentId ? "回复" : "评论"}协作块「${block.text.slice(0, 18)}」`);
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
  await saveState(parentId ? "已回复块级评论" : "已添加块级评论");
  render();
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
  activeBlockPresenceId = draggedId;
  if (await reorderDayBlockInDoc(day.id, draggedId, targetIndex, "local-day-block-drag-reorder")) {
    day.blocks = reorderDayBlockList(day.blocks || [], draggedId, targetIndex, {
      updatedBy: getCollabName(),
      updatedAt: new Date().toISOString(),
    });
    clearDayBlockDragState();
    renderDayBlocks(day);
    await logActivity(`拖拽排序协作块「${draggedBlock.text.slice(0, 18)}」`);
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
  await saveState("已拖拽排序协作块");
  render();
});

dom.dayBlockList?.addEventListener("dragend", () => {
  clearDayBlockDragState();
  schedulePresenceTrack(120);
});

dom.dayBlockList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-edit-day-block]");
  if (!input || !canEdit() || isReadonlyMode) return;
  activeBlockPresenceId = input.closest("[data-day-block]")?.dataset.dayBlock || activeBlockPresenceId;
  schedulePresenceTrack(0);
  clearTimeout(dayBlockEditTimer);
  dayBlockEditTimer = setTimeout(async () => {
    const day = currentDay();
    const blockId = input.dataset.editDayBlock;
    const text = input.value.trim();
    if (!day || !blockId || !text) return;
    const updatedText = await updateDayBlockTextInDoc(day.id, blockId, text, "local-day-block-text-crdt");
    if (updatedText) {
      day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, ...updatedText, updatedBy: getCollabName(), updatedAt: new Date().toISOString() } : item)));
      const blockElement = dom.dayBlockList.querySelector(`[data-day-block="${CSS.escape(blockId)}"]`);
      const metaElement = blockElement?.querySelector(".day-block-meta");
      if (metaElement) metaElement.textContent = `更新：${getCollabName()}`;
      await saveCollaborativePlanChange("协作块已更新");
      return;
    }
    const block = normalizeDayBlocks(day.blocks || []).find((item) => item.id === blockId);
    if (!block) return;
    day.blocks = normalizeDayBlocks((day.blocks || []).map((item) => (item.id === blockId ? { ...item, text } : item)));
    await syncDayBlocksToDoc(day.id, "local-day-block-text-fallback");
    await saveState("协作块已更新");
  }, 650);
});

["focusin", "click", "keyup", "select"].forEach((eventName) => {
  dom.dayBlockList?.addEventListener(eventName, (event) => {
    const input = event.target.closest?.("[data-edit-day-block]");
    if (!input || isReadonlyMode) return;
    activeBlockPresenceId = input.closest("[data-day-block]")?.dataset.dayBlock || activeBlockPresenceId;
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
      renderDayBlocks(currentDay());
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

dom.candidateGrid.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-candidate]");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const candidate = state.candidates.find((item) => item.id === editButton.dataset.editCandidate);
    if (!candidate || !requireEdit("编辑备选地点")) return;
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
    if (await deleteCandidateFromDoc(candidateId)) {
      if (editingCandidateId === candidateId) clearQuickPlaceForm();
      await saveCollaborativePlanChange(`移除备选「${candidate.title}」`);
      dom.saveState.textContent = `已移除备选「${candidate.title}」`;
      return;
    }
    mutate(`移除备选「${candidate.title}」`, () => {
      state.candidates = mergedCandidatesWithPatch("delete", null, candidateId);
      if (editingCandidateId === candidateId) clearQuickPlaceForm();
    }, { requireUnlocked: false });
    await syncCandidatesToDoc("local-candidate-delete-fallback");
    return;
  }
  const button = event.target.closest("[data-candidate]");
  if (!button) return;
  if (!requireEdit("加入备选地点")) return;
  const candidate = clone(state.candidates[Number(button.dataset.candidate)]);
  candidate.id = uid();
  let createdDayId = "";
  const label = `加入备选「${candidate.title}」`;
  if (!mutate(label, () => {
    const day = currentDay();
    createdDayId = day.id;
    day.stops.push(candidate);
    activeStop = currentDay().stops.length - 1;
  }, { save: false, render: false })) return;
  await addStopToDoc(createdDayId, candidate, "local-candidate-to-stop");
  await saveState(label);
  broadcastStopCreated(createdDayId, candidate);
  render();
});

dom.candidateGrid.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const card = event.target.closest("[data-candidate]");
  if (!card || event.target.closest("[data-delete-candidate], [data-edit-candidate]")) return;
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

dom.transportList.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-quote]");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const quote = (state.transportQuotes || []).find((item) => item.id === editButton.dataset.editQuote);
    if (!quote || !requireEdit("编辑交通报价")) return;
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
  if (await deleteTransportQuoteFromDoc(quoteId)) {
    transportFilterApplied = true;
    if (editingTransportQuoteId === quoteId) clearManualQuoteForm();
    await saveCollaborativePlanChange(`删除报价「${quote.code}」`);
    dom.saveState.textContent = `已删除报价「${quote.code}」`;
    return;
  }
  mutate(`删除报价「${quote.code}」`, () => {
    state.transportQuotes = mergedTransportQuotesWithPatch("delete", null, quoteId);
    transportFilterApplied = true;
    if (editingTransportQuoteId === quoteId) clearManualQuoteForm();
  }, { requireUnlocked: false });
  await syncTransportQuotesToDoc("local-transport-quote-delete-fallback");
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
    if (!existingQuote) {
      clearManualQuoteForm();
      dom.saveState.textContent = "这条报价已被其他成员删除，请重新保存。";
      return;
    }
    if (await updateTransportQuoteInDoc(editingTransportQuoteId, quote)) {
      persistCurrentPlanFromDoc("交通报价协作内容已实时同步");
      await logActivity(`更新交通报价「${code}」`);
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
    }, { requireUnlocked: false });
    await syncTransportQuotesToDoc("local-transport-quote-update-fallback");
    return;
  }
  if (await addCollaborativeTransportQuote(quote)) {
    persistCurrentPlanFromDoc("交通报价协作内容已实时同步");
    await logActivity(`保存交通报价「${code}」`);
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
  }, { requireUnlocked: false });
  await syncTransportQuotesToDoc("local-transport-quote-fallback");
});

dom.partySizeInput.addEventListener("change", async () => {
  if (!requireEdit("更新同行人数")) return;
  if (await syncPlanSettingToDoc("partySize", dom.partySizeInput.value)) {
    await saveCollaborativePlanChange("更新同行人数");
    return;
  }
  mutate("更新同行人数", () => {
    state.partySize = partySize();
  }, { requireUnlocked: false });
});

dom.budgetLimitInput.addEventListener("change", async () => {
  if (!requireEdit("更新预算上限")) return;
  if (await syncPlanSettingToDoc("budgetLimit", dom.budgetLimitInput.value)) {
    await saveCollaborativePlanChange("更新预算上限");
    return;
  }
  mutate("更新预算上限", () => {
    state.budgetLimit = numberValue(dom.budgetLimitInput.value);
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

async function createRecommendedPlan() {
  if (!requireEdit("生成推荐计划")) return;
  const destination = dom.destinationInput.value.trim() || "甘肃";
  const origin = dom.originInput.value.trim() || "上海";
  guideState.destination = destination;
  guideState.origin = origin;
  syncGuideDatesFromInputs();
  const days = guideDayCount();
  if (!mutate(`生成${destination}${days}天计划`, () => {
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
    clearPlanYjsState();
  }, { requireUnlocked: false, save: false, render: false })) return;
  await replacePlanCollabDoc("local-recommended-plan");
  await saveState("已生成推荐计划");
  await broadcastPlanReplaced("生成推荐计划");
  render();
  closeCreateChoice();
}

async function createBlankTemplate() {
  if (!requireEdit("生成空白模板")) return;
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
  await replacePlanCollabDoc("local-blank-plan");
  await saveState("已生成空白模板");
  await broadcastPlanReplaced("生成空白模板");
  render();
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
  state.editKeyHash = hash;
  state.editKeyHint = editKey.length >= 2 ? `${editKey.slice(0, 1)}***${editKey.slice(-1)}` : "已设置";
  setLocalEditAccess(hash);
  setCurrentEditKeyValue(editKey);
  editAccessGranted = true;
  isReadonlyMode = false;
  dom.editAccessInput.value = "";
  await syncPlanMetaToDoc("local-edit-access");
  await saveState("编辑口令已更新");
  dom.collabStatus.textContent = "编辑口令已更新；复制编辑链接会带上编辑密钥。";
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

dom.resetBtn.addEventListener("click", async () => {
  if (!requireEdit("重置计划")) return;
  saveVersionSnapshot("重置前版本");
  state = ensurePlanDates(buildKyotoPlan());
  clearPlanYjsState();
  activeDay = 0;
  activeStop = 0;
  transportFilterApplied = false;
  await replacePlanCollabDoc("local-reset-plan");
  await saveState("已重置示例");
  await broadcastPlanReplaced("重置示例计划");
  render();
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

dom.importForm.addEventListener("submit", async (event) => {
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
  const label = `导入${pendingProvider}记录`;
  if (!mutate(label, () => {
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
  }, { requireUnlocked: false, save: false, render: false })) return;
  if (createdStop) {
    await addStopToDoc(targetDay.id, createdStop, "local-import-stop");
    await saveState(label);
    broadcastStopCreated(targetDay.id, createdStop);
    render();
  }
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
  const isPlaceholderWeatherEndpoint = /your-domain\.com\/api\/weather|your-project\.supabase\.co\/functions\/v1\/amap-weather/.test(serviceConfig.weatherEndpoint || "");
  if ((!serviceConfig.weatherEndpoint || isPlaceholderWeatherEndpoint) && appConfig.amapWeatherProxyUrl) {
    serviceConfig = { ...serviceConfig, weatherEndpoint: appConfig.amapWeatherProxyUrl };
    localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(serviceConfig));
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
  } else {
    saveState();
  }
}

boot();
