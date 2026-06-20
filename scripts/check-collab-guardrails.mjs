import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(rootDir, "script.js");
const indexPath = path.join(rootDir, "index.html");
const source = fs.readFileSync(scriptPath, "utf8");
const indexSource = fs.readFileSync(indexPath, "utf8");

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
assert(source.includes("function renderConflictPresenceImpact"), "Conflict panel must render online collaborator impact.");
assert(extractFunctionBody("showConflictPanel").includes("renderConflictPresenceImpact()"), "Conflict panel must include online collaborator impact in its diff summary.");
assert(extractFunctionBody("refreshPresenceViews").includes("refreshConflictPresenceImpact()"), "Presence changes must refresh the conflict collaborator impact block.");
assert(source.includes("function conflictValuePreview"), "Conflict overlap summaries must include compact local/remote value previews.");
assert(source.includes("function conflictValueDetail"), "Conflict overlap summaries must include expandable local/remote value details.");
assert(extractFunctionBody("conflictDiffSummary").includes("local: conflictValuePreview"), "Conflict overlap summaries must capture local value previews.");
assert(extractFunctionBody("conflictDiffSummary").includes("remote: conflictValuePreview"), "Conflict overlap summaries must capture remote value previews.");
assert(extractFunctionBody("conflictDiffSummary").includes("localDetail: conflictValueDetail"), "Conflict overlap summaries must capture local value details.");
assert(extractFunctionBody("conflictDiffSummary").includes("remoteDetail: conflictValueDetail"), "Conflict overlap summaries must capture remote value details.");
assert(extractFunctionBody("showConflictPanel").includes("renderOverlapGroup(diff.overlap"), "Conflict panel must render overlap entries with local/remote value previews.");
assert(extractFunctionBody("showConflictPanel").includes("<details>"), "Conflict panel overlap entries must be expandable for detailed review.");
assert(extractFunctionBody("showConflictPanel").includes("conflict-value-compare"), "Conflict panel overlap entries must show detailed local/remote comparisons.");

assert(indexSource.includes('id="planNameInput"'), "Plan name must have an editable input.");
assert(indexSource.includes('id="planNameInputPresence"'), "Plan name input must expose a presence overlay.");
assert(
  source.includes('{ field: "plan:name", planField: "name", domKey: "planNameInput"'),
  "Plan name must be registered as a plan-level collaborative text field.",
);
assert(source.includes('schedulePlanMetaInputSync("name"'), "Plan name input must sync through plan meta collaboration.");
assert(source.includes("async function syncCollabPlanTextFieldToDoc"), "Plan text fields must have a per-input Y.Text sync function.");
assert(source.includes("function setInputValuePreservingSelection"), "Collaborative text refreshes must preserve the local cursor/selection.");
assert(source.includes("function setDomFieldValuePreservingSelection"), "Collaborative dom-key refreshes must preserve the local cursor/selection.");
const preservingInputBody = extractFunctionBody("setInputValuePreservingSelection");
assert(preservingInputBody.includes("scrollTop") && preservingInputBody.includes("scrollLeft"), "Collaborative text refreshes must preserve textarea/input scroll offsets.");
assert(source.includes("let planTextBaselines = {}"), "Plan text fields must track local text baselines.");
assert(source.includes("refreshPlanTextBaselinesFromDoc()"), "Plan text baselines must be refreshed from the live Yjs document.");
const planTextSyncBody = extractFunctionBody("syncCollabPlanTextFieldToDoc");
assert(planTextSyncBody.includes("applyTextDiffFromBase"), "Plan text input must patch Y.Text from a local baseline instead of replacing whole field text.");
assert(source.includes("function mergeTextFieldFromBase"), "Conflict merge must include a text-aware three-way merge helper.");
const textMergeBody = extractFunctionBody("mergeTextFieldFromBase");
assert(textMergeBody.includes("applyTextDiffFromBase"), "Text conflict merge must reuse anchored text patching instead of always keeping local text.");
assert(
  extractFunctionBody("mergePlans").includes("mergeTextScalarField(basePlan?.name") &&
    extractFunctionBody("mergeStopFields").includes("mergeTextScalarField(baseStop?.[field]") &&
    extractFunctionBody("mergeDays").includes("mergeTextScalarField(baseDay.route"),
  "Plan, stop, and day text conflict fields must use text-aware merge.",
);
const anchoredCommentMergeBody = extractFunctionBody("mergeAnchoredCommentsForTextFields");
assert(anchoredCommentMergeBody.includes("textAnchorMergeField") && anchoredCommentMergeBody.includes("textAnchorValueField"), "Text-field comment conflict merge must map anchor fields to their stored value fields.");
assert(anchoredCommentMergeBody.includes("localMoved") && anchoredCommentMergeBody.includes("remoteMoved"), "Text-field comment conflict merge must move local and remote comments from their own text baselines.");
assert(extractFunctionBody("mergeStopFields").includes("mergeAnchoredCommentsForTextFields"), "Stop conflict merge must move anchored comments after text-field merges.");
assert(extractFunctionBody("mergeDays").includes("mergeAnchoredCommentsForTextFields"), "Day conflict merge must move anchored comments after text-field merges.");
const dayBlockMergeBody = extractFunctionBody("mergeDayBlocks");
assert(dayBlockMergeBody.includes("baseBlocks") && dayBlockMergeBody.includes("mergeTextScalarField(baseBlock.text"), "Day block text conflicts must use base-aware text merge.");
assert(dayBlockMergeBody.includes('textYjs: mergedText === block.text ? block.textYjs : ""'), "Merged day block text must discard stale textYjs when text changed.");
assert(dayBlockMergeBody.includes("transformCommentAnchorsForField") && dayBlockMergeBody.includes("`block:${block.id}`"), "Merged day block text must move block comment anchors.");
assert(dayBlockMergeBody.includes("const localComments = transformCommentAnchorsForField") && dayBlockMergeBody.includes("const remoteComments = transformCommentAnchorsForField"), "Merged day block comments must move local and remote anchors from their own text baselines.");
for (const field of ["name", "destination", "origin", "startDate", "endDate", "dateRange"]) {
  assert(source.includes(`syncCollabPlanTextFieldToDoc("${field}"`), `Plan ${field} input must write to plan-level Y.Text before cloud save.`);
}
assert(source.includes("let stopTextBaselines = {}"), "Stop text fields must track local text baselines.");
assert(source.includes("let dayTextBaselines = {}"), "Day text fields must track local text baselines.");
assert(source.includes("refreshStopTextBaselinesFromDoc()"), "Stop text baselines must be refreshed from the live Yjs document.");
assert(source.includes("refreshDayTextBaselinesFromDoc()"), "Day text baselines must be refreshed from the live Yjs document.");
const stopTextSyncBody = extractFunctionBody("syncCollabTextFieldToDoc");
const dayTextSyncBody = extractFunctionBody("syncCollabDayTextFieldToDoc");
assert(stopTextSyncBody.includes("applyTextDiffFromBase"), "Stop text input must patch Y.Text from a local baseline instead of replacing whole field text.");
assert(dayTextSyncBody.includes("applyTextDiffFromBase"), "Day text input must patch Y.Text from a local baseline instead of replacing whole field text.");
const dayEditorDraftBody = extractFunctionBody("dayEditorDraftValues");
assert(dayEditorDraftBody.includes("return value.trim() ? value : fallback;"), "Day text fallback drafts must preserve raw input text and only trim for empty-state checks.");
assert(!dayEditorDraftBody.includes("dom[domKey].value.trim() || fallback"), "Day text fallback drafts must not trim collaborative text content.");
const stopFormHandlerStart = source.indexOf('dom.stopForm.addEventListener("submit"');
const stopFormHandlerEnd = source.indexOf("COLLAB_TEXT_FIELDS.forEach", stopFormHandlerStart);
const stopFormHandlerBody = stopFormHandlerStart >= 0 && stopFormHandlerEnd > stopFormHandlerStart ? source.slice(stopFormHandlerStart, stopFormHandlerEnd) : "";
assert(stopFormHandlerBody.includes('String(dom[domKey].value || "")'), "Stop detail fallback save must preserve raw collaborative text field content.");
assert(!stopFormHandlerBody.includes("dom[domKey].value.trim()"), "Stop detail fallback save must not trim collaborative text field content.");
assert(source.includes("function transformCommentAnchorForTextChange"), "Comment anchors must support text-diff position transforms.");
assert(source.includes("function transformCommentAnchorsForTextValues"), "Comment anchors must update across collaborative text field changes.");
assert(source.includes("function selectionExcerptFromText"), "Comment anchor excerpts must be refreshable without reading from the DOM.");
assert(source.includes("function replaceYArrayContents"), "Transformed comment anchors must be writable back to Yjs comment arrays.");
assert(source.includes("let isTransformingCollabTextCommentAnchors = false;"), "Stop comment anchor transforms must have a local guard flag.");
assert(source.includes("let isTransformingCollabDayCommentAnchors = false;"), "Day comment anchor transforms must have a local guard flag.");
assert(
  extractFunctionBody("transformCommentAnchorForTextChange").includes("selectionExcerptFromText"),
  "Moved comment anchors must refresh their excerpt from the updated text.",
);
assert(
  extractFunctionBody("persistCurrentTextFromDoc").includes("transformCommentAnchorsForTextValues"),
  "Stop text persistence must move anchored comments when collaborative text changes.",
);
assert(
  extractFunctionBody("persistCurrentTextFromDoc").includes("replaceYArrayContents(collabCommentsArray, nextComments)"),
  "Stop text persistence must write moved comment anchors back to the Yjs comments array.",
);
const stopPersistBody = extractFunctionBody("persistCurrentTextFromDoc");
assert(
  stopPersistBody.indexOf("replaceYArrayContents(collabCommentsArray, nextComments)") < stopPersistBody.indexOf("encodeStateAsUpdate(collabTextDoc)"),
  "Stop text persistence must encode Yjs after moved comment anchors are written.",
);
assert(
  extractFunctionBody("persistCurrentDayTextFromDoc").includes("transformCommentAnchorsForTextValues"),
  "Day text persistence must move anchored comments when collaborative text changes.",
);
assert(
  extractFunctionBody("persistCurrentDayTextFromDoc").includes("replaceYArrayContents(collabDayCommentsArray, nextComments)"),
  "Day text persistence must write moved comment anchors back to the Yjs day comments array.",
);
const dayPersistBody = extractFunctionBody("persistCurrentDayTextFromDoc");
assert(
  dayPersistBody.indexOf("replaceYArrayContents(collabDayCommentsArray, nextComments)") < dayPersistBody.indexOf("encodeStateAsUpdate(collabDayTextDoc)"),
  "Day text persistence must encode Yjs after moved comment anchors are written.",
);
const bindStopTextBody = extractFunctionBody("bindCollabTextDoc");
assert(
  bindStopTextBody.includes('origin === "local-comment-anchor-transform"') && bindStopTextBody.includes("isTransformingCollabTextCommentAnchors"),
  "Stop text binding must detect local comment anchor transforms.",
);
assert(
  bindStopTextBody.indexOf('origin === "local-comment-anchor-transform"') < bindStopTextBody.indexOf("broadcastTextUpdate(update)"),
  "Stop comment anchor transforms must return before broadcasting text updates.",
);
const bindDayTextBody = extractFunctionBody("bindCollabDayTextDoc");
assert(
  bindDayTextBody.includes('origin === "local-day-comment-anchor-transform"') && bindDayTextBody.includes("isTransformingCollabDayCommentAnchors"),
  "Day text binding must detect local comment anchor transforms.",
);
assert(
  bindDayTextBody.indexOf('origin === "local-day-comment-anchor-transform"') < bindDayTextBody.indexOf("broadcastDayTextUpdate(update)"),
  "Day comment anchor transforms must return before broadcasting day text updates.",
);
assert(
  extractFunctionBody("updateDayBlockTextInDoc").includes("transformCommentAnchorsForField"),
  "Day block Y.Text writes must move anchored block comments when text changes.",
);
assert(
  extractFunctionBody("updateDayBlockInDoc").includes("transformCommentAnchorsForField"),
  "Day block text patch writes must move anchored block comments when text changes.",
);
assert(
  extractFunctionBody("syncDayBlocksToDoc").includes("transformCommentAnchorsForField(latest.comments || [], `block:${block.id}`"),
  "Day block text fallback patches must move anchored block comments when text changes.",
);
for (const functionName of [
  "syncGuideStateFromPlan",
  "renderGuideResult",
  "renderDayEditor",
  "renderDetail",
  "bindCollabTextDoc",
  "bindCollabDayTextDoc",
  "applyRemoteTextUpdate",
  "applyRemoteDayTextUpdate",
]) {
  const body = extractFunctionBody(functionName);
  assert(body.includes("setInputValuePreservingSelection"), `${functionName} must preserve input cursor/selection when refreshing collaborative fields.`);
}
assert(
  extractFunctionBody("persistCurrentDayTextFromDoc").includes("setDomFieldValuePreservingSelection"),
  "persistCurrentDayTextFromDoc must preserve input cursor/selection when refreshing day text fields.",
);
assert(
  extractFunctionBody("refreshDayBlockTextDom").includes("setInputValuePreservingSelection"),
  "refreshDayBlockTextDom must preserve the current block textarea cursor/selection.",
);
assert(
  extractFunctionBody("syncDayBlockInputText").includes("setInputValuePreservingSelection"),
  "syncDayBlockInputText must preserve the current block textarea cursor/selection after Y.Text sync.",
);
assert(source.includes("function dayBlockActivitySnippet"), "Day block activity labels must trim only display snippets, not collaborative text.");
assert(source.includes("function joinDayBlockTexts"), "Day block keyboard merge must preserve source spacing where possible.");
assert(source.includes("function splitDayBlockCommentsForKeyboard"), "Day block keyboard split must move block comment anchors into the newly split block.");
assert(source.includes("function mergeDayBlockCommentsForKeyboard"), "Day block keyboard merge must move current block comment anchors into the previous block.");
assert(source.includes("function refreshBlockCommentExcerpt"), "Moved block comment anchors must refresh excerpts from their new block text.");
assert(source.includes("function confirmDeleteCommentedDayBlocks"), "Deleting commented day blocks must require an explicit confirmation.");
assert(extractFunctionBody("deleteSelectedDayBlocks").includes("confirmDeleteCommentedDayBlocks(selectedBlocks"), "Bulk day block delete must confirm before removing commented blocks.");
assert(source.includes('confirmDeleteCommentedDayBlocks([block], "删除")'), "Single and keyboard day block deletes must confirm before removing commented blocks.");
assert(source.includes("function confirmDeleteCommentThread"), "Deleting comment threads with replies must require an explicit confirmation helper.");
assert(source.includes("confirmDeleteCommentThread(stop.comments || [], commentId"), "Stop comment deletes must confirm before removing a thread with replies.");
assert(source.includes("confirmDeleteCommentThread(day.comments || [], commentId"), "Day comment deletes must confirm before removing a thread with replies.");
assert(source.includes("confirmDeleteCommentThread(block.comments || [], commentId"), "Block comment deletes must confirm before removing a thread with replies.");
assert(source.includes("function confirmDeleteCommentedStop"), "Deleting a stop with comment threads must require an explicit confirmation helper.");
assert(source.includes("function confirmDeleteCommentedDay"), "Deleting a day with comment threads must require an explicit confirmation helper.");
assert(source.includes("confirmDeleteCommentedStop(deletedStop"), "Stop deletes must confirm before removing a stop with comment threads.");
assert(source.includes("confirmDeleteCommentedDay(deletedDay"), "Day deletes must confirm before removing day, stop, or block comment threads.");
assert(source.includes("function confirmFullPlanReplacement"), "Full plan replacement actions must require an explicit collaboration impact confirmation helper.");
assert(extractFunctionBody("createRecommendedPlan").includes('confirmFullPlanReplacement("生成推荐计划")'), "Recommended plan generation must confirm before replacing the shared plan.");
assert(extractFunctionBody("createBlankTemplate").includes('confirmFullPlanReplacement("生成空白模板")'), "Blank template generation must confirm before replacing the shared plan.");
assert(extractFunctionBody("importPlanJsonFile").includes('confirmFullPlanReplacement("导入 JSON")'), "JSON import must confirm before replacing the shared plan.");
assert(source.includes('confirmFullPlanReplacement("重置示例计划")'), "Resetting the sample plan must confirm before replacing the shared plan.");
assert(source.includes("function confirmRemoteBlockEdit"), "High-risk day block structure edits must confirm when another member is actively editing the same block.");
assert(extractFunctionBody("applyDayBlockTypeChange").includes("confirmRemoteBlockEdit(blockId"), "Day block type changes must confirm when another member is actively editing the block.");
assert(extractFunctionBody("moveDayBlockByDirection").includes("confirmRemoteBlockEdit(blockId"), "Day block sorting must confirm when another member is actively editing the block.");
assert(extractFunctionBody("deleteSelectedDayBlocks").includes("confirmRemoteBlockEdit(selectedBlocks.map"), "Bulk day block delete must confirm when another member is actively editing selected blocks.");
assert(source.includes('confirmRemoteBlockEdit([previousBlock.id, blockId], "合并")'), "Keyboard merge must confirm when another member is actively editing either merged block.");
assert(source.includes("const text = input.value;\n  if (!day || !blockId) return;\n  await syncDayBlockInputText(day, blockId, text, input);"), "Day block input sync must preserve raw textarea text instead of trimming collaborative content.");
assert(source.includes("const hasAfterText = Boolean(afterText.trim());"), "Day block keyboard split must use trim only for empty-state decisions.");
assert(source.includes("text: afterText,"), "Day block keyboard split must preserve raw trailing text in the new block.");
assert(source.includes("const mergedText = joinDayBlockTexts(previousBlock.text || \"\", input.value);"), "Day block keyboard merge must preserve raw current block text.");
assert(source.includes("const splitComments = splitDayBlockCommentsForKeyboard(block, nextBlockId, cursorStart, cursorEnd, day.id);"), "Day block keyboard split must use the selection range when moving block comment anchors.");
assert(source.includes("comments: splitComments.nextComments"), "Day block keyboard split must attach moved comments to the new block.");
assert(source.includes("comments: splitComments.previousComments"), "Day block keyboard split must keep only pre-split comments on the original block.");
assert(source.includes("const mergedComments = mergeDayBlockCommentsForKeyboard(previousBlock, block, mergedText, day.id);"), "Day block keyboard merge must offset current block comments into the merged previous block.");
const dayBlockTextDocBody = extractFunctionBody("updateDayBlockTextInDoc");
assert(dayBlockTextDocBody.includes('const nextText = String(text || "");'), "Day block Y.Text writes must preserve raw text.");
assert(dayBlockTextDocBody.includes('String(options.baseText || "")'), "Day block Y.Text baseline must preserve raw text.");
assert(!dayBlockTextDocBody.includes("String(text || \"\").trim()"), "Day block Y.Text writes must not trim collaborative text.");
const dayBlockPatchBody = extractFunctionBody("updateDayBlockInDoc");
assert(dayBlockPatchBody.includes('const nextText = patchHasText ? String(patch.text || "") : "";'), "Day block text patch writes must preserve raw text.");
assert(!dayBlockPatchBody.includes("String(patch.text || \"\").trim()"), "Day block text patch writes must not trim collaborative text.");

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
