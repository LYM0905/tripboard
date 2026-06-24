(function () {
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
        throw new Error("请求超时，请稍后重试。");
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

  window.TripboardUtils = {
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
  };
})();
