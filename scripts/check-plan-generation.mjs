import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const constantsSource = readFileSync(new URL("../tripboard-constants.js", import.meta.url), "utf8");
const utilsSource = readFileSync(new URL("../tripboard-utils.js", import.meta.url), "utf8");
const start = source.indexOf("const images = ");
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
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(constantsSource, sandbox, { filename: "tripboard-constants.js" });
vm.runInContext(utilsSource, sandbox, { filename: "tripboard-utils.js" });
vm.runInContext(
  `
  ${source.slice(start, end)}
  globalThis.tripboardImages = images;
  globalThis.buildRecommendedPlan = buildRecommendedPlan;
  globalThis.buildBlankPlan = buildBlankPlan;
  globalThis.ensurePlanDates = ensurePlanDates;
  `,
  sandbox,
  { filename: "script.js" },
);
vm.runInContext(
  `
  ${source.slice(displayStart, displayEnd)}
  globalThis.displayImageForStop = displayImageForStop;
  globalThis.displayCoverImage = displayCoverImage;
  `,
  sandbox,
  { filename: "script-display.js" },
);

const qinghai = sandbox.buildRecommendedPlan("青海", 4, { budget: "舒适", pace: "轻松" });
const qinghaiTitles = qinghai.days.flatMap((day) => day.stops.map((stop) => stop.title));

if (/空白计划/.test(qinghai.name)) {
  throw new Error(`Recommended Qinghai plan used blank title: ${qinghai.name}`);
}

if (qinghaiTitles.includes("待填写地点")) {
  throw new Error("Recommended Qinghai plan still contains placeholder stop");
}

for (const required of ["塔尔寺", "青海湖二郎剑景区", "茶卡盐湖"]) {
  if (!qinghaiTitles.includes(required)) {
    throw new Error(`Recommended Qinghai plan is missing ${required}`);
  }
}

if (/unsplash\.com\/photo-1493976040374/.test(qinghai.cover)) {
  throw new Error("Recommended Qinghai plan used the generic city cover image");
}

const innerMongolia = sandbox.buildRecommendedPlan("内蒙古", 6, { budget: "舒适", pace: "轻松" });
const innerMongoliaTitles = innerMongolia.days.flatMap((day) => day.stops.map((stop) => stop.title));
const innerMongoliaCandidateTitles = innerMongolia.candidates.map((stop) => stop.title);

if (innerMongoliaCandidateTitles.some((title) => /代表性景点|雨天室内备选/.test(title))) {
  throw new Error(`Inner Mongolia candidates are still generic: ${innerMongoliaCandidateTitles.join(", ")}`);
}

for (const required of ["呼伦贝尔大草原", "额尔古纳湿地", "满洲里套娃广场"]) {
  if (![...innerMongoliaTitles, ...innerMongoliaCandidateTitles].includes(required)) {
    throw new Error(`Recommended Inner Mongolia plan is missing ${required}`);
  }
}

if (/unsplash\.com\/photo-1493976040374/.test(innerMongolia.cover)) {
  throw new Error("Recommended Inner Mongolia plan used the generic city cover image");
}

const jilin = sandbox.buildRecommendedPlan("吉林", 6, { budget: "舒适", pace: "轻松" });
const jilinTitles = jilin.days.flatMap((day) => day.stops.map((stop) => stop.title));
const jilinCandidateTitles = jilin.candidates.map((stop) => stop.title);
const jilinFirstStop = jilin.days[0]?.stops?.[0];

if (jilin.cover === sandbox.tripboardImages.city || jilin.cover === sandbox.tripboardImages.kyoto) {
  throw new Error("Recommended Jilin plan used a generic city/Kyoto cover image");
}

if (jilinFirstStop?.image === sandbox.tripboardImages.train || jilinFirstStop?.image === sandbox.tripboardImages.city || jilinFirstStop?.image === sandbox.tripboardImages.kyoto) {
  throw new Error(`Recommended Jilin arrival stop used a generic detail image: ${jilinFirstStop?.image}`);
}

sandbox.state = jilin;
const renderedJilinCover = sandbox.displayCoverImage();
const renderedJilinFirstStopImage = sandbox.displayImageForStop({
  ...jilinFirstStop,
  image: sandbox.tripboardImages.train,
});
const renderedJilinCoverWithBadSavedImage = (() => {
  sandbox.state = {
    ...jilin,
    cover: "8",
  };
  return sandbox.displayCoverImage();
})();
sandbox.state = jilin;

if (renderedJilinCover === sandbox.tripboardImages.city || renderedJilinCover === sandbox.tripboardImages.kyoto) {
  throw new Error(`Rendered Jilin cover still used a generic template image: ${renderedJilinCover}`);
}

if (renderedJilinFirstStopImage === sandbox.tripboardImages.train || renderedJilinFirstStopImage === sandbox.tripboardImages.city || renderedJilinFirstStopImage === sandbox.tripboardImages.kyoto) {
  throw new Error(`Rendered Jilin detail still used a generic transit/template image: ${renderedJilinFirstStopImage}`);
}

if (renderedJilinCoverWithBadSavedImage === "8" || !/^https?:\/\/|^data:image\//.test(renderedJilinCoverWithBadSavedImage)) {
  throw new Error(`Rendered Jilin cover did not recover from a bad saved image: ${renderedJilinCoverWithBadSavedImage}`);
}

const dirtyJilin = sandbox.ensurePlanDates({
  ...sandbox.buildBlankPlan("鍚夋灄", 2, { budget: "鑸掗€?" }),
  cover: "8",
  days: [
    {
      id: "dirty-day",
      label: "D1",
      title: "dirty",
      date: "2026-07-12",
      route: "",
      weather: "",
      transport: "",
      stops: [
        {
          id: "dirty-stop",
          title: "鍚夋灄抵达",
          type: "Transit",
          address: "鍚夋灄",
          image: "8",
        },
      ],
    },
  ],
});

if (dirtyJilin.cover === "8" || dirtyJilin.days[0].stops[0].image === "8") {
  throw new Error("Plan image sanitizer did not remove bad saved image values");
}

for (const required of ["长白山天池", "净月潭国家森林公园"]) {
  if (![...jilinTitles, ...jilinCandidateTitles].includes(required)) {
    throw new Error(`Recommended Jilin plan is missing ${required}`);
  }
}

if (jilinCandidateTitles.some((title) => /代表性景点|雨天室内备选/.test(title))) {
  throw new Error(`Jilin candidates are still generic: ${jilinCandidateTitles.join(", ")}`);
}

const blank = sandbox.buildBlankPlan("青海", 2, { budget: "舒适" });
const blankTitles = blank.days.flatMap((day) => day.stops.map((stop) => stop.title));

if (!/空白计划/.test(blank.name) || !blankTitles.includes("待填写地点")) {
  throw new Error("Blank template no longer produces blank placeholders");
}

const generic = sandbox.buildRecommendedPlan("成都", 3, { budget: "舒适", pace: "轻松" });
const genericTitles = generic.days.flatMap((day) => day.stops.map((stop) => stop.title));

if (/空白计划/.test(generic.name) || genericTitles.includes("待填写地点")) {
  throw new Error("Generic recommended plan fell back to blank template");
}

console.log("Plan generation check passed.");
