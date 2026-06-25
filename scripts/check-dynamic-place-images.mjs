import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const constantsSource = readFileSync(new URL("../tripboard-constants.js", import.meta.url), "utf8");
const utilsSource = readFileSync(new URL("../tripboard-utils.js", import.meta.url), "utf8");
const functionSource = readFileSync(new URL("../supabase/functions/place-image-search/index.ts", import.meta.url), "utf8");
const serviceClientSource = readFileSync(new URL("../tripboard-service-client.js", import.meta.url), "utf8");
const start = source.indexOf("const LOCAL_IMAGE_VERSION");
const end = source.indexOf("function hasLocalChanges", start);
const displayStart = source.indexOf("function isPlaceholderStop");
const displayEnd = source.indexOf("function applyPlaceToStop", displayStart);

if (start < 0 || end < 0 || displayStart < 0 || displayEnd < 0) {
  throw new Error("Could not locate plan builder slice in script.js");
}

const sandbox = {
  console,
  AbortController,
  Date,
  fetch,
  Math,
  Number,
  RegExp,
  String,
  setTimeout,
  clearTimeout,
  state: { destination: "" },
  guideState: { destination: "" },
  serviceConfig: { placeImageEndpoint: "" },
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(constantsSource, sandbox, { filename: "tripboard-constants.js" });
vm.runInContext(utilsSource, sandbox, { filename: "tripboard-utils.js" });
vm.runInContext(
  `
  ${source.slice(start, end)}
  globalThis.buildRecommendedPlan = buildRecommendedPlan;
  globalThis.ensurePlanDates = ensurePlanDates;
  `,
  sandbox,
  { filename: "script.js" },
);
vm.runInContext(
  `
  ${source.slice(displayStart, displayEnd)}
  globalThis.markPendingPlaceImages = markPendingPlaceImages;
  globalThis.enrichPlanImagesBeforeSave = enrichPlanImagesBeforeSave;
  globalThis.shouldLookupSpecificStopImage = shouldLookupSpecificStopImage;
  globalThis.displayImageForStop = displayImageForStop;
  globalThis.isDefaultTripboardImage = isDefaultTripboardImage;
  globalThis.displayCoverImage = displayCoverImage;
  globalThis.hasStableDisplayImage = hasStableDisplayImage;
  globalThis.hasVerifiedPlaceImage = hasVerifiedPlaceImage;
  `,
  sandbox,
  { filename: "script-display.js" },
);

const destinations = ["青海", "甘肃", "青岛", "新疆伊犁"];

for (const destination of destinations) {
  const plan = sandbox.buildRecommendedPlan(destination, 4, { budget: "舒适", pace: "轻松" });
  sandbox.state = plan;
  sandbox.markPendingPlaceImages(plan);
  const stops = [
    ...(plan.days || []).flatMap((day) => day.stops || []),
    ...(plan.candidates || []),
  ];
  const scenicStops = stops.filter((stop) => sandbox.shouldLookupSpecificStopImage(stop, destination) || stop.imageStatus === "pending");
  if (!scenicStops.length) {
    throw new Error(`${destination} did not produce dynamic image lookup candidates.`);
  }
  for (const stop of scenicStops) {
    const image = String(stop.image || "");
    if (/assets\/trip-images|assets\/trip-photos|data:image\/svg/i.test(image)) {
      throw new Error(`${destination}/${stop.title} stores a local/static image instead of dynamic lookup state: ${image.slice(0, 80)}`);
    }
    if (!image && stop.imageStatus !== "pending") {
      throw new Error(`${destination}/${stop.title} is missing both a dynamic image and explicit pending state.`);
    }
  }
}

const legacyMissingStop = {
  id: "legacy-missing",
  title: "塔尔寺",
  type: "景点",
  address: "青海省西宁市湟中区",
  amapKeyword: "塔尔寺",
  image: "",
  imageStatus: "missing",
};
sandbox.state = { destination: "青海", days: [{ stops: [legacyMissingStop] }], candidates: [] };
if (!sandbox.shouldLookupSpecificStopImage(legacyMissingStop, "青海")) {
  throw new Error("Legacy missing image stops should be retried by the current dynamic image lookup.");
}

const currentMissingStop = {
  ...legacyMissingStop,
  imageLookupVersion: "real-photos-v2",
};
if (!sandbox.shouldLookupSpecificStopImage(currentMissingStop, "青海")) {
  throw new Error("Current-version missing image stops should remain retryable when the user opens an old plan.");
}
if (sandbox.hasStableDisplayImage(currentMissingStop)) {
  throw new Error("Missing image stops should not be treated as a stable real-photo state.");
}

const unverifiedExternalStop = {
  id: "unverified",
  title: "塔尔寺",
  type: "景点",
  address: "青海省西宁市湟中区",
  image: "https://example.com/random.jpg",
  imageStatus: "",
};
sandbox.state = {
  destination: "青海",
  cover: unverifiedExternalStop.image,
  days: [{ stops: [unverifiedExternalStop] }],
  candidates: [],
};
if (sandbox.displayCoverImage()) {
  throw new Error("Unverified external images must not be accepted as trusted trip covers.");
}
if (!sandbox.shouldLookupSpecificStopImage(unverifiedExternalStop, "青海")) {
  throw new Error("Unverified external stop images should be replaced by verified dynamic real photos.");
}

const requiredFunctionSignals = [
  ["searchAmap", "Amap source"],
  ["searchWikimedia", "Wikimedia Commons source"],
  ["searchOpenverse", "Openverse source"],
  ["verifyImage", "backend image verification"],
  ["content-type", "content-type validation"],
  ["image/", "image MIME validation"],
  ["\\.svg", "SVG rejection"],
  ["testOnly", "testOnly status endpoint"],
];

for (const [needle, label] of requiredFunctionSignals) {
  if (!functionSource.includes(needle)) {
    throw new Error(`place-image-search is missing ${label}.`);
  }
}

const serviceSandbox = {
  window: {},
  URL,
  fetch: async () => ({ json: async () => ({}), ok: true }),
  fetchWithTimeout: async () => ({ json: async () => ({}), ok: true }),
  localStorage: {
    getItem: () => "",
    setItem: () => {},
  },
  safeJsonParse: () => ({}),
};
vm.createContext(serviceSandbox);
vm.runInContext(serviceClientSource, serviceSandbox, { filename: "tripboard-service-client.js" });
const serviceClient = serviceSandbox.window.createTripboardServiceClient({
  fetch: serviceSandbox.fetch,
  fetchWithTimeout: serviceSandbox.fetchWithTimeout,
  localStorage: serviceSandbox.localStorage,
  safeJsonParse: serviceSandbox.safeJsonParse,
  serviceConfigKey: "service",
  transportConfigKey: "transport",
  externalImportConfigKey: "external",
  getAppConfig: () => ({
    supabaseUrl: "https://juicyxqblnrmbhtuujez.supabase.co",
    supabaseAnonKey: "same-project-anon",
  }),
});
const sameProjectHeaders = serviceClient.headers("", "https://juicyxqblnrmbhtuujez.supabase.co/functions/v1/amap-weather");
if (sameProjectHeaders.apikey !== "same-project-anon") {
  throw new Error("Same-project Supabase functions should still receive the configured anon key.");
}
const crossProjectHeaders = serviceClient.headers("", "https://xjieikfcococjvqdqero.supabase.co/functions/v1/place-image-search");
if (crossProjectHeaders.apikey || crossProjectHeaders.Authorization) {
  throw new Error("Cross-project image function requests must not reuse the main Supabase anon key.");
}

console.log("Dynamic place image generation check passed.");

if (process.env.TRIPBOARD_LIVE_IMAGE_CHECK === "1") {
  sandbox.serviceConfig.placeImageEndpoint = "https://xjieikfcococjvqdqero.supabase.co/functions/v1/place-image-search";
  sandbox.serviceClient = {
    headers: () => ({ "Content-Type": "application/json" }),
  };
  sandbox.fetchWithTimeout = (url, options) => fetch(url, options);
  sandbox.Image = function Image() {};
  const livePlan = sandbox.buildRecommendedPlan("青海", 4, { budget: "舒适", pace: "轻松" });
  sandbox.state = livePlan;
  await vm.runInContext(
    `
    markPendingPlaceImages(globalThis.livePlan);
    enrichPlanImagesBeforeSave(globalThis.livePlan, { maxItems: 4, concurrency: 2 });
    `,
    Object.assign(sandbox, { livePlan }),
    { filename: "script-live-image-check.js" },
  );
  if (!/^https:\/\/store\.is\.autonavi\.com\/showpic\//.test(livePlan.cover || "")) {
    throw new Error(`Live Qinghai plan did not receive an Amap real-photo cover: ${livePlan.cover}`);
  }
  console.log("Live dynamic place image cover check passed.");
}
