import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(rootDir, "script.js");
const source = fs.readFileSync(scriptPath, "utf8");

const expectedReplacementReasons = [
  "recommended-plan",
  "blank-plan",
  "json-import",
  "reset-plan",
  "version-restore",
  "conflict-merge",
  "conflict-keep",
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function lineNumberAt(index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function extractStringSet(setName) {
  const match = source.match(new RegExp(`const\\s+${setName}\\s*=\\s*new\\s+Set\\(\\[([\\s\\S]*?)\\]\\);`));
  if (!match) return null;
  return Array.from(match[1].matchAll(/"([^"]+)"/g), (item) => item[1]);
}

function findMatchingParen(startIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function findMatchingBrace(startIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function extractFunctionBody(functionName) {
  const start = source.indexOf(`function ${functionName}`);
  if (start < 0) return "";
  const openParen = source.indexOf("(", start);
  if (openParen < 0) return "";
  const closeParen = findMatchingParen(openParen);
  if (closeParen < 0) return "";
  const openBrace = source.indexOf("{", closeParen);
  if (openBrace < 0) return "";
  const closeBrace = findMatchingBrace(openBrace);
  return closeBrace >= 0 ? source.slice(openBrace + 1, closeBrace) : "";
}

function findCalls(functionName) {
  const calls = [];
  let index = 0;
  const needle = `${functionName}(`;
  while ((index = source.indexOf(needle, index)) >= 0) {
    const before = source.slice(Math.max(0, index - 40), index);
    if (/function\s+$/.test(before)) {
      index += needle.length;
      continue;
    }
    const openParen = index + functionName.length;
    const closeParen = findMatchingParen(openParen);
    if (closeParen < 0) {
      fail(`${functionName} call at line ${lineNumberAt(index)} has no matching closing parenthesis.`);
      index += needle.length;
      continue;
    }
    calls.push({
      line: lineNumberAt(index),
      text: source.slice(index, closeParen + 1),
    });
    index = closeParen + 1;
  }
  return calls;
}

function containsAnyExpectedReason(text) {
  return expectedReplacementReasons.some((reason) => text.includes(`"${reason}"`));
}

const configuredReasons = extractStringSet("PLAN_REPLACE_REASONS");
assert(configuredReasons, "PLAN_REPLACE_REASONS set is missing.");
if (configuredReasons) {
  for (const reason of expectedReplacementReasons) {
    assert(configuredReasons.includes(reason), `PLAN_REPLACE_REASONS is missing "${reason}".`);
  }
  for (const reason of configuredReasons) {
    assert(expectedReplacementReasons.includes(reason), `PLAN_REPLACE_REASONS contains unexpected "${reason}".`);
  }
}

const replacePlanBody = extractFunctionBody("replacePlanCollabDoc");
assert(replacePlanBody.includes("allowReplace"), "replacePlanCollabDoc must require allowReplace.");
assert(replacePlanBody.includes("PLAN_REPLACE_REASONS.has(reason)"), "replacePlanCollabDoc must validate reason against PLAN_REPLACE_REASONS.");

for (const call of findCalls("replacePlanCollabDoc")) {
  assert(call.text.includes("allowReplace: true"), `replacePlanCollabDoc call at line ${call.line} is missing allowReplace: true.`);
  assert(/reason\s*:/.test(call.text), `replacePlanCollabDoc call at line ${call.line} is missing a reason property.`);
  assert(containsAnyExpectedReason(call.text), `replacePlanCollabDoc call at line ${call.line} does not use a known replacement reason.`);
}

const broadcastBody = extractFunctionBody("broadcastPlanReplaced");
assert(broadcastBody.includes("PLAN_REPLACE_REASONS.has(replacementType)"), "broadcastPlanReplaced must validate replacementType.");
for (const call of findCalls("broadcastPlanReplaced")) {
  assert(/replacementType\s*:/.test(call.text), `broadcastPlanReplaced call at line ${call.line} is missing replacementType.`);
  assert(containsAnyExpectedReason(call.text), `broadcastPlanReplaced call at line ${call.line} does not use a known replacementType.`);
}

const remoteReplaceBody = extractFunctionBody("applyRemotePlanReplaced");
assert(remoteReplaceBody.includes("PLAN_REPLACE_REASONS.has(payload.replacementType || \"\")"), "applyRemotePlanReplaced must reject untrusted replacementType values.");

const fullBlockSyncBody = extractFunctionBody("syncAllDayBlocksToDoc");
assert(fullBlockSyncBody.includes("if (!replace) return false;"), "syncAllDayBlocksToDoc must refuse non-replace calls.");

const stopListsBody = extractFunctionBody("syncStopListsToDoc");
assert(stopListsBody.includes("if (!replace && !deletedDayIds.size) return false;"), "syncStopListsToDoc must refuse broad non-replace calls.");

for (const functionName of ["syncTransportQuotesToDoc", "syncCandidatesToDoc", "syncActivitiesToDoc"]) {
  const body = extractFunctionBody(functionName);
  assert(body.includes("hasExplicitYArrayFallbackIntent(options)"), `${functionName} must require explicit fallback intent.`);
}

for (const functionName of [
  "applyRemoteStopCreated",
  "applyRemoteStopDeleted",
  "applyRemoteStopsReordered",
  "applyRemoteDayUpdated",
  "applyRemoteDayCreated",
  "applyRemoteDayDeleted",
  "applyRemoteDaysReordered",
]) {
  const body = extractFunctionBody(functionName);
  assert(body.includes("shouldSkipLegacyStructureFallback(payload"), `${functionName} must skip legacy JSON fallback when planYjs verification fails.`);
}

if (failures.length) {
  console.error("Collaboration guardrail check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Collaboration guardrail check passed.");
