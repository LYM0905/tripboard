import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(rootDir, "script.js"), "utf8");
const constantsSource = fs.readFileSync(path.join(rootDir, "tripboard-constants.js"), "utf8");
const html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
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

const setMatch = constantsSource.match(/const\s+PLAN_REPLACE_REASONS\s*=\s*new\s+Set\(\[([\s\S]*?)\]\);/);
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
assert(source.includes("function confirmRemoteStopEdit"), "Stop structure edits must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemoteDayBlockEdit"), "Day block structure edits must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemoteDayEdit"), "Day-level structure edits must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemotePlanReplace"), "Full plan replacements must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemotePlanSettingEdit"), "Shared plan settings must have a remote active editor confirmation helper.");
assert(source.includes("function confirmRemoteTextFieldEdit"), "Field-level saves must have a remote same-field editor confirmation helper.");
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
assert(functionBody("applyFieldAmapPlace").includes('confirmRemoteStopEdit(stop.id, "选择高德候选")'), "Selecting an Amap place for the active stop must confirm when another member is editing that stop.");
assert(functionBody("applyFieldAmapPlace").includes('confirmRemoteTextFieldEdit(changedFields, "stop", "选择高德候选")'), "Selecting an Amap place must confirm when another member is editing the same changed stop fields.");
assert(functionBody("syncWeather").includes('confirmRemoteDayEdit(weatherPatches.map((patch) => patch.id), "同步天气")'), "Weather sync must confirm when another member is editing affected days.");
assert(functionBody("applyBudgetEstimateFromToken").includes('confirmRemoteStopEdit(stop.id, "采用地点门票估算")'), "Single stop budget estimate adoption must confirm when another member is editing that stop.");
assert(functionBody("applyBudgetEstimateFromToken").includes('confirmRemoteCandidateEdit(candidate.id, "采用备选门票估算")'), "Single candidate budget estimate adoption must confirm when another member is editing that candidate.");
assert(functionBody("adoptAllBudgetEstimates").includes('confirmRemoteCandidateEdit(affectedCandidateIds, "批量采用门票估算")'), "Batch budget estimate adoption must confirm when another member is editing affected candidates.");
assert(functionBody("enrichPlacesFromAmap").includes('confirmRemoteCandidateEdit(affectedCandidateIds, "补全备选地点图片和坐标")'), "Batch Amap place enrichment must confirm when another member is editing affected candidates.");
assert(functionBody("adoptAllBudgetEstimates").includes('confirmRemoteStopEdit(affectedStopIds, "批量采用门票估算")'), "Batch budget estimate adoption must confirm when another member is editing affected stops.");
assert(functionBody("enrichPlacesFromAmap").includes('confirmRemoteStopEdit(affectedStopIds, "补全行程地点图片和坐标")'), "Batch Amap place enrichment must confirm when another member is editing affected stops.");
assert(functionBody("optimizeCurrentDayRoute").includes('confirmRemoteStopEdit(day.stops.map((stop) => stop.id), "优化路径")'), "Route optimization must confirm when another member is editing affected stops.");
assert(functionBody("planAmapRouteForCurrentDay").includes("confirmRemoteStopEdit(day.stops.map((stop) => stop.id)"), "Amap route planning must confirm when another member is editing affected stops.");
assert(source.includes('confirmRemoteStopEdit(deletedStop.id, "删除地点")'), "Deleting a stop must confirm when another member is editing that stop.");
assert(source.includes('confirmRemoteStopEdit(movingStopId, "上移地点")'), "Moving a stop up must confirm when another member is editing that stop.");
assert(source.includes('confirmRemoteStopEdit(movingStopId, "下移地点")'), "Moving a stop down must confirm when another member is editing that stop.");
assert(source.includes('confirmRemoteDayEdit(dayId, "保存当天设置")'), "Saving day settings must confirm when another member is editing that day.");
assert(source.includes('confirmRemoteDayEdit(deletedDay.id, "删除当天")'), "Deleting a day must confirm when another member is editing that day.");
assert(source.includes('confirmRemoteDayEdit([movingDayId, previousDayId], "上移当天")'), "Moving a day up must confirm when another member is editing affected days.");
assert(source.includes('confirmRemoteDayEdit([movingDayId, nextDayId], "下移当天")'), "Moving a day down must confirm when another member is editing affected days.");
assert(functionBody("resolveConflict").includes("confirmRemotePlanReplace("), "Conflict resolution must confirm when another member is actively editing the plan.");
assert(functionBody("restoreVersion").includes('confirmRemotePlanReplace("恢复历史版本")'), "Version restore must confirm when another member is actively editing the plan.");
assert(functionBody("createRecommendedPlan").includes('confirmRemotePlanReplace("生成推荐计划")'), "Recommended plan generation must confirm when another member is actively editing the plan.");
assert(functionBody("createBlankTemplate").includes('confirmRemotePlanReplace("生成空白模板")'), "Blank template generation must confirm when another member is actively editing the plan.");
assert(functionBody("importPlanJsonFile").includes('confirmRemotePlanReplace("导入 JSON")'), "JSON import must confirm when another member is actively editing the plan.");
assert(source.includes("function createNewLocalPlan"), "Creating a separate local plan must remain a distinct flow from deleting a plan.");
assert(source.includes("function deleteCurrentLocalPlan"), "Deleting a local plan must remain a distinct flow from creating a plan.");
assert(!functionBody("createNewLocalPlan").includes("replacePlanCollabDoc("), "Creating a separate local plan must not replace the active shared plan document.");
assert(!functionBody("deleteCurrentLocalPlan").includes("replacePlanCollabDoc("), "Deleting a local plan must not replace the active shared plan document.");
assert(functionBody("deleteCurrentLocalPlan").includes("不会删除 Supabase 云端协作记录"), "Deleting a shared plan from the local library must warn that the remote record is preserved.");
assert(source.includes('confirmRemoteTextFieldEdit(changedDayTextFields, "day", "保存当天设置")'), "Saving day text fields must confirm when another member is editing the same changed day field.");
assert(source.includes('confirmRemoteTextFieldEdit(changedStopFields, "stop", "保存地点详情")'), "Saving stop detail fields must confirm when another member is editing the same changed stop field.");
assert(functionBody("syncPlanMetaFieldInput").includes('confirmRemoteTextFieldEdit(planFieldMeta.field, "plan"'), "Saving a single plan meta text field must confirm when another member is editing the same plan field.");
assert(functionBody("syncPlanMetaPatchInput").includes('confirmRemoteTextFieldEdit(changedPlanFields, "plan"'), "Saving plan meta patches must confirm when another member is editing the same plan fields.");
assert(constantsSource.includes('field: "plan:partySize"') && constantsSource.includes('presenceId: "partySizeInputPresence"'), "Party size must publish plan-level presence.");
assert(constantsSource.includes('field: "plan:budgetLimit"') && constantsSource.includes('presenceId: "budgetLimitInputPresence"'), "Budget limit must publish plan-level presence.");
assert(html.includes('id="partySizeInputPresence"'), "Party size presence container must exist in the UI.");
assert(html.includes('id="budgetLimitInputPresence"'), "Budget limit presence container must exist in the UI.");
assert(source.includes('confirmRemotePlanSettingEdit("更新同行人数")'), "Updating party size must confirm when another member is actively editing the plan.");
assert(source.includes('confirmRemotePlanSettingEdit("更新预算上限")'), "Updating budget limit must confirm when another member is actively editing the plan.");
assert(source.includes('confirmRemotePlanSettingEdit("更新编辑口令")'), "Updating edit access must confirm when another member is actively editing the plan.");
assert(functionBody("applyDayBlockTypeChange").includes("confirmRemoteDayBlockEdit(blockId, presence)"), "Day block type changes must confirm when another member is editing that block.");
assert(functionBody("moveDayBlockByDirection").includes('confirmRemoteDayBlockEdit(blockId, action === "keyboard-move" ? "键盘排序" : "排序")'), "Day block moves must confirm when another member is editing that block.");
assert(functionBody("setSelectedDayBlockType").includes('confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量切换类型")'), "Bulk day block type changes must confirm when another member is editing selected blocks.");
assert(functionBody("setSelectedDayBlockDone").includes("confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), done ?"), "Bulk day block done/open changes must confirm when another member is editing selected blocks.");
assert(functionBody("indentSelectedDayBlocks").includes("confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), delta > 0"), "Bulk day block indent changes must confirm when another member is editing selected blocks.");
assert(functionBody("duplicateSelectedDayBlocks").includes('confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量复制")'), "Bulk day block duplication must confirm when another member is editing selected blocks.");
assert(functionBody("deleteSelectedDayBlocks").includes('confirmRemoteDayBlockEdit(selectedBlocks.map((block) => block.id), "批量删除")'), "Bulk day block deletion must confirm when another member is editing selected blocks.");
assert(source.includes('confirmRemoteDayBlockEdit(sourceBlockId, "复制")'), "Single day block duplication must confirm when another member is editing the source block.");
assert(source.includes('confirmRemoteDayBlockEdit(blockId, "删除")'), "Single day block deletion must confirm when another member is editing that block.");
assert(source.includes('confirmRemoteDayBlockEdit([draggedId, targetBlockId], "拖拽排序")'), "Drag reordering day blocks must confirm when another member is editing affected blocks.");
assert(source.includes('confirmRemoteDayBlockEdit(blockId, event.shiftKey ? "减少缩进" : "增加缩进")'), "Keyboard day block indent changes must confirm when another member is editing that block.");
assert(source.includes('confirmRemoteDayBlockEdit(blockId, afterText ? "拆分" : "新增下方块")'), "Keyboard day block split/add must confirm when another member is editing that block.");
assert(source.includes('confirmRemoteDayBlockEdit(blockId, "删除空白块")'), "Keyboard empty day block deletion must confirm when another member is editing that block.");
assert(source.includes('confirmRemoteDayBlockEdit([blockId, previousBlock.id], "合并")'), "Keyboard day block merge must confirm when another member is editing affected blocks.");
assert(source.includes("function diffValuePreview"), "Conflict panel must be able to preview local and remote field values.");
assert(functionBody("conflictDiffSummary").includes("overlapDetails"), "Conflict diff summary must include field-level overlap details.");
assert(functionBody("showConflictPanel").includes("renderOverlapDetails"), "Conflict panel must render field-level local/remote overlap details.");
assert(functionBody("versionPreviewSummary").includes("details"), "Version restore preview must include field-level impact details.");
assert(functionBody("renderVersionPreview").includes("version-restore-detail"), "Version restore preview must render current/restored field value details.");

if (failures.length) {
  console.error("Collaboration delivery guardrail check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Collaboration delivery guardrail check passed.");
