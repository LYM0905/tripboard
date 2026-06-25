(function () {
const STORAGE_KEY = "tripboard-editable-v1";
const PLAN_LIBRARY_KEY = "tripboard-plan-library-v1";
const CURRENT_PLAN_ID_KEY = "tripboard-current-local-plan-id";
const CTRIP_CONFIG_KEY = "tripboard-ctrip-connector-v1";
const MEMBER_PROFILE_KEY = "tripboard-member-profile-v1";
const SERVICE_CONFIG_KEY = "tripboard-service-connectors-v1";
const EXTERNAL_IMPORT_CONFIG_KEY = "tripboard-external-import-v1";
const EDIT_ACCESS_PREFIX = "tripboard-edit-access:";
const EDIT_KEY_VALUE_PREFIX = "tripboard-edit-key-value:";
const VERSION_PREFIX = "tripboard-version-history:";
const PENDING_PLAN_UPDATES_PREFIX = "tripboard-pending-plan-yjs:";
const COLLAPSED_BLOCKS_PREFIX = "tripboard-collapsed-day-blocks:";
const MAX_VERSION_HISTORY = 12;
const MAX_PENDING_PLAN_UPDATES = 160;
const PLAN_REPLACE_REASONS = new Set([
  "recommended-plan",
  "blank-plan",
  "json-import",
  "reset-plan",
  "version-restore",
  "conflict-merge",
  "conflict-keep",
]);
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
const ACTIVITY_FILTERS = [
  { value: "all", label: "全部" },
  { value: "restore", label: "恢复" },
  { value: "conflict", label: "冲突" },
  { value: "comment", label: "批注" },
  { value: "transport", label: "交通" },
  { value: "map", label: "路线" },
  { value: "edit", label: "编辑" },
];
const ACTIVITY_TYPE_LABELS = {
  restore: "恢复",
  conflict: "冲突",
  comment: "批注",
  transport: "交通",
  map: "路线",
  edit: "编辑",
};
const COLLAB_DAY_TEXT_FIELDS = [
  { field: "day:title", docField: "title", domKey: "fieldDayTitle", label: "当天标题", presenceId: "fieldDayTitlePresence", scope: "day" },
  { field: "day:route", docField: "route", domKey: "fieldDayRoute", label: "当天路线", presenceId: "fieldDayRoutePresence", scope: "day" },
  { field: "day:weather", docField: "weather", domKey: "fieldDayWeather", label: "天气", presenceId: "fieldDayWeatherPresence", scope: "day" },
  { field: "day:transport", docField: "transport", domKey: "fieldDayTransport", label: "交通", presenceId: "fieldDayTransportPresence", scope: "day" },
];
const COLLAB_PLAN_TEXT_PRESENCE_FIELDS = [
  { field: "plan:destination", planField: "destination", domKey: "destinationInput", label: "目的地", presenceId: "destinationInputPresence", scope: "plan" },
  { field: "plan:origin", planField: "origin", domKey: "originInput", label: "出发城市", presenceId: "originInputPresence", scope: "plan" },
  { field: "plan:startDate", planField: "startDate", domKey: "startDateInput", label: "出发日期", presenceId: "startDateInputPresence", scope: "plan" },
  { field: "plan:endDate", planField: "endDate", domKey: "endDateInput", label: "返程日期", presenceId: "endDateInputPresence", scope: "plan" },
  { field: "plan:partySize", planField: "partySize", domKey: "partySizeInput", label: "同行人数", presenceId: "partySizeInputPresence", scope: "plan" },
  { field: "plan:budgetLimit", planField: "budgetLimit", domKey: "budgetLimitInput", label: "预算上限", presenceId: "budgetLimitInputPresence", scope: "plan" },
];
const COLLAB_STRUCT_FIELDS = [
  { field: "time", domKey: "fieldTime", type: "string", label: "时间", presenceId: "fieldTimePresence" },
  { field: "budget", domKey: "fieldBudget", type: "number", label: "预算", presenceId: "fieldBudgetPresence" },
  { field: "paid", domKey: "fieldPaid", type: "number", label: "已付", presenceId: "fieldPaidPresence" },
  { field: "payer", domKey: "fieldPayer", type: "string", label: "付款人", presenceId: "fieldPayerPresence" },
  { field: "budgetSelected", domKey: "fieldBudgetSelected", type: "boolean" },
  { field: "lng", domKey: "fieldLng", type: "string", label: "经度", presenceId: "fieldLngPresence" },
  { field: "lat", domKey: "fieldLat", type: "string", label: "纬度", presenceId: "fieldLatPresence" },
  { field: "image", domKey: "fieldImage", type: "string", label: "图片 URL", presenceId: "fieldImagePresence" },
  { field: "referenceUrl", domKey: "fieldReferenceUrl", type: "string", label: "参考介绍链接" },
  { field: "imageSource", type: "string" },
  { field: "imageLicense", type: "string" },
  { field: "imageCreator", type: "string" },
  { field: "imagePageUrl", type: "string" },
  { field: "imageVerifiedAt", type: "string" },
  { field: "imageStatus", type: "string" },
  { field: "imageCandidates", type: "list" },
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
  ...COLLAB_PLAN_TEXT_PRESENCE_FIELDS,
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
const PLAN_TEXT_SETTING_FIELDS = ["name", "destination", "origin", "dateRange", "startDate", "endDate", "cover", "editKeyHint"];
const DAY_BLOCK_TYPES = ["todo", "note", "decision", "heading", "callout", "quote", "divider", "checklist"];
const DAY_BLOCK_COMMANDS = [
  { type: "todo", command: "/todo", aliases: ["/待办", "/task"], label: "待办", description: "确认事项、清单、办理步骤", keywords: ["待办", "任务", "清单", "todo", "task"] },
  { type: "note", command: "/note", aliases: ["/备注", "/memo"], label: "备注", description: "普通文字、补充信息、想法", keywords: ["备注", "笔记", "文字", "note", "memo"] },
  { type: "decision", command: "/decision", aliases: ["/决定", "/决策"], label: "决定", description: "已经确认的选择和结论", keywords: ["决定", "决策", "选择", "decision"] },
  { type: "heading", command: "/heading", aliases: ["/h", "/h2", "/标题"], label: "标题", description: "分隔当天行程段落", keywords: ["标题", "分组", "heading", "h2"] },
  { type: "callout", command: "/callout", aliases: ["/tip", "/提醒", "/提示", "/注意"], label: "提醒", description: "证件、预约、天气、避峰提示", keywords: ["提醒", "提示", "注意", "callout", "tip"] },
  { type: "quote", command: "/quote", aliases: ["/引用", "/摘录"], label: "引用", description: "资料摘录、攻略原文、参考信息", keywords: ["引用", "摘录", "攻略", "quote"] },
  { type: "divider", command: "/divider", aliases: ["/line", "/hr", "/分隔线", "/分割线"], label: "分隔线", description: "把当天行程拆成清晰段落", keywords: ["分隔", "分割", "段落", "divider", "line", "hr"] },
  { type: "checklist", command: "/checklist", aliases: ["/check", "/清单", "/检查清单"], label: "检查清单", description: "一块内记录多项准备事项", keywords: ["检查", "清单", "子任务", "checklist", "check"] },
];

  window.TripboardConstants = {
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
  };
})();
