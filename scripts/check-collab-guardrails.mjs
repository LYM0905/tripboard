import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(rootDir, "script.js"), "utf8");
const reasons = ["recommended-plan", "blank-plan", "json-import", "reset-plan", "version-restore", "conflict-merge", "conflict-keep"];
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function findMatching(start, openChar, closeChar) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function functionBody(name) {
  const start = source.indexOf(`function ${name}`);
  const openParen = source.indexOf("(", start);
  const closeParen = findMatching(openParen, "(", ")");
  const openBrace = source.indexOf("{", closeParen);
  const closeBrace = findMatching(openBrace, "{", "}");
  return closeBrace > openBrace ? source.slice(openBrace + 1, closeBrace) : "";
}

function calls(name) {
  const result = [];
  let index = 0;
  const needle = `${name}(`;
  while ((index = source.indexOf(needle, index)) >= 0) {
    if (/function\s+$/.test(source.slice(Math.max(0, index - 40), index))) {
      index += needle.length;
      continue;
    }
    const openParen = index + name.length;
    const closeParen = findMatching(openParen, "(", ")");
    result.push(source.slice(index, closeParen + 1));
    index = closeParen + 1;
  }
  return result;
}

const setMatch = source.match(/const\s+PLAN_REPLACE_REASONS\s*=\s*new\s+Set\(\[([\s\S]*?)\]\);/);
assert(setMatch, "PLAN_REPLACE_REASONS is missing.");
if (setMatch) {
  for (const reason of reasons) assert(setMatch[1].includes(`"${reason}"`), `PLAN_REPLACE_REASONS is missing ${reason}.`);
}

const replaceBody = functionBody("replacePlanCollabDoc");
assert(replaceBody.includes("allowReplace"), "replacePlanCollabDoc must require allowReplace.");
assert(replaceBody.includes("PLAN_REPLACE_REASONS.has(reason)"), "replacePlanCollabDoc must validate reason.");
for (const call of calls("replacePlanCollabDoc")) {
  assert(call.includes("allowReplace: true"), `replacePlanCollabDoc call is missing allowReplace: ${call.slice(0, 120)}`);
  assert(reasons.some((reason) => call.includes(`"${reason}"`)), `replacePlanCollabDoc call is missing known reason: ${call.slice(0, 120)}`);
}

const broadcastBody = functionBody("broadcastPlanReplaced");
assert(broadcastBody.includes("PLAN_REPLACE_REASONS.has(replacementType)"), "broadcastPlanReplaced must validate replacementType.");
for (const call of calls("broadcastPlanReplaced")) {
  assert(call.includes("replacementType"), `broadcastPlanReplaced call is missing replacementType: ${call.slice(0, 120)}`);
  assert(reasons.some((reason) => call.includes(`"${reason}"`)), `broadcastPlanReplaced call is missing known replacementType: ${call.slice(0, 120)}`);
}

const remoteBody = functionBody("applyRemotePlanReplaced");
assert(remoteBody.includes("PLAN_REPLACE_REASONS.has(payload.replacementType || \"\")"), "applyRemotePlanReplaced must reject untrusted replacement types.");

const editorBody = functionBody("renderDayEditor");
assert(editorBody.includes("const editable = canEdit();"), "renderDayEditor must use canEdit for day structure controls.");
assert(editorBody.includes("dom.deleteDayBtn.disabled = !editable"), "Day structure buttons must be disabled for non-editors.");

assert(source.includes("function confirmRemoteCandidateEdit"), "Candidate record edits must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemoteTransportQuoteEdit"), "Transport quote record edits must have a remote active editor confirmation helper.");
assert(source.includes("function remoteRecordEditorNames"), "Record-level remote editor names must be available for visible candidate/quote hints.");
assert(source.includes("let confirmedRemoteRecordEditUntil"), "Record-level remote edit confirmations must be throttled.");

const presenceBody = functionBody("presencePayload");
assert(presenceBody.includes("activeCandidateId"), "Presence payload must publish the candidate currently being edited.");
assert(presenceBody.includes("activeTransportQuoteId"), "Presence payload must publish the transport quote currently being edited.");
assert(functionBody("memberActivityLabel").includes("activeCandidateId"), "Member activity labels must show when someone is editing a candidate.");
assert(functionBody("memberActivityLabel").includes("activeTransportQuoteId"), "Member activity labels must show when someone is editing a transport quote.");

assert(functionBody("setCandidateEditing").includes("schedulePresenceTrack(0)"), "Entering or leaving candidate edit mode must publish presence immediately.");
assert(functionBody("setManualQuoteEditing").includes("schedulePresenceTrack(0)"), "Entering or leaving transport quote edit mode must publish presence immediately.");
assert(functionBody("renderCandidates").includes('remoteRecordEditorNames("candidate"'), "Candidate cards must show remote record editing hints.");
assert(functionBody("renderTransport").includes('remoteRecordEditorNames("transportQuote"'), "Transport quote cards must show remote record editing hints.");
assert(source.includes("function refreshRecordPresenceCards"), "Record-level remote editing hints must have a local card refresh helper.");
assert(functionBody("refreshPresenceViews").includes("refreshRecordPresenceCards()"), "Presence changes must refresh candidate and transport quote card hints.");

assert(functionBody("toggleCandidateSelection").includes("confirmRemoteCandidateEdit(candidateId"), "Candidate selection must confirm when another member is editing that candidate.");
assert(functionBody("toggleTransportQuoteSelection").includes("confirmRemoteTransportQuoteEdit(quoteId"), "Transport quote selection must confirm when another member is editing that quote.");
assert(source.includes('confirmRemoteCandidateEdit(candidate.id, "编辑备选地点")'), "Opening candidate edit mode must confirm when another member is editing that candidate.");
assert(source.includes('confirmRemoteTransportQuoteEdit(quote.id, "编辑交通报价")'), "Opening transport quote edit mode must confirm when another member is editing that quote.");
assert(source.includes('confirmRemoteCandidateEdit(candidateId, "移除备选地点")'), "Deleting a candidate must confirm when another member is editing that candidate.");
assert(source.includes('confirmRemoteTransportQuoteEdit(quoteId, "删除交通报价")'), "Deleting a transport quote must confirm when another member is editing that quote.");
assert(source.includes('confirmRemoteCandidateEdit(editingCandidateId, "更新备选地点")'), "Saving candidate edits must confirm when another member is editing that candidate.");
assert(source.includes('confirmRemoteTransportQuoteEdit(editingTransportQuoteId, "更新交通报价")'), "Saving transport quote edits must confirm when another member is editing that quote.");
assert(functionBody("applyBudgetEstimateFromToken").includes('confirmRemoteCandidateEdit(candidate.id, "采用备选门票估算")'), "Single candidate budget estimate adoption must confirm when another member is editing that candidate.");
assert(functionBody("adoptAllBudgetEstimates").includes('confirmRemoteCandidateEdit(affectedCandidateIds, "批量采用门票估算")'), "Batch budget estimate adoption must confirm when another member is editing affected candidates.");
assert(functionBody("enrichPlacesFromAmap").includes('confirmRemoteCandidateEdit(affectedCandidateIds, "补全备选地点图片和坐标")'), "Batch Amap place enrichment must confirm when another member is editing affected candidates.");

if (failures.length) {
  console.error("Collaboration delivery guardrail check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Collaboration delivery guardrail check passed.");
