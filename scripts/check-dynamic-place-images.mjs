import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const constantsSource = readFileSync(new URL("../tripboard-constants.js", import.meta.url), "utf8");
const utilsSource = readFileSync(new URL("../tripboard-utils.js", import.meta.url), "utf8");
const functionSource = readFileSync(new URL("../supabase/functions/place-image-search/index.ts", import.meta.url), "utf8");
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
