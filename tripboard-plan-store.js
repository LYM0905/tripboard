(function () {
  function createTripboardPlanStore(options = {}) {
    const {
      localStorage,
      storageKey,
      libraryKey,
      currentPlanIdKey,
      clone,
      uid,
      safeJsonParse,
      ensurePlanDates,
      buildFallbackPlan,
      getTripId = () => "",
    } = options;

    function newLocalPlanId() {
      return `local-${Date.now()}-${uid()}`;
    }

    function sharedLocalPlanId(id = getTripId()) {
      return id ? `shared-${id}` : "";
    }

    function currentLocalPlanId() {
      const sharedId = sharedLocalPlanId();
      if (sharedId) return sharedId;
      return localStorage.getItem(currentPlanIdKey) || "";
    }

    function setCurrentLocalPlanId(id = "") {
      if (id) localStorage.setItem(currentPlanIdKey, id);
      else localStorage.removeItem(currentPlanIdKey);
    }

    function normalizePlanLibrary(list = []) {
      const seen = new Set();
      return (Array.isArray(list) ? list : [])
        .filter((record) => record?.data?.days?.length)
        .map((record) => {
          const id = String(record.id || newLocalPlanId());
          const data = ensurePlanDates(clone(record.data));
          return {
            id,
            label: String(record.label || data.name || data.destination || "未命名计划"),
            tripId: String(record.tripId || ""),
            createdAt: record.createdAt || new Date().toISOString(),
            updatedAt: record.updatedAt || new Date().toISOString(),
            data,
          };
        })
        .filter((record) => {
          if (seen.has(record.id)) return false;
          seen.add(record.id);
          return true;
        })
        .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    }

    function planLibrary() {
      const list = safeJsonParse(localStorage.getItem(libraryKey), []);
      return normalizePlanLibrary(list);
    }

    function savePlanLibrary(list = []) {
      const normalized = normalizePlanLibrary(list);
      localStorage.setItem(libraryKey, JSON.stringify(normalized));
      return normalized;
    }

    function planRecordFromPlan(plan, id = currentLocalPlanId() || newLocalPlanId(), options = {}) {
      const data = ensurePlanDates(clone(plan));
      const currentTripId = getTripId();
      return {
        id,
        label: options.label || data.name || data.destination || "未命名计划",
        tripId: options.tripId !== undefined ? options.tripId : (id === sharedLocalPlanId() ? currentTripId : data.tripId || ""),
        createdAt: options.createdAt || new Date().toISOString(),
        updatedAt: options.updatedAt || new Date().toISOString(),
        data,
      };
    }

    function ensurePlanLibrary() {
      const library = planLibrary();
      const selectedId = localStorage.getItem(currentPlanIdKey) || "";
      if (library.length) {
        if (!selectedId || !library.some((record) => record.id === selectedId)) setCurrentLocalPlanId(library[0].id);
        return library;
      }

      let migrated = null;
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey));
        if (stored?.days?.length) migrated = stored;
      } catch {
        localStorage.removeItem(storageKey);
      }

      const initialPlan = migrated || buildFallbackPlan();
      const initialId = sharedLocalPlanId() || selectedId || newLocalPlanId();
      const initialRecord = planRecordFromPlan(initialPlan, initialId, {
        label: migrated?.name || initialPlan.name || "本地计划",
        tripId: sharedLocalPlanId() ? getTripId() : "",
      });
      savePlanLibrary([initialRecord]);
      if (!sharedLocalPlanId()) setCurrentLocalPlanId(initialRecord.id);
      localStorage.setItem(storageKey, JSON.stringify(initialRecord.data));
      return [initialRecord];
    }

    function loadState() {
      const library = ensurePlanLibrary();
      const selectedId = currentLocalPlanId();
      const selected = library.find((record) => record.id === selectedId) || library[0];
      if (selected?.data?.days?.length) return clone(selected.data);
      const fallback = buildFallbackPlan();
      savePlanLibrary([planRecordFromPlan(fallback, newLocalPlanId(), { label: "京都示例计划" })]);
      setCurrentLocalPlanId(currentLocalPlanId() || planLibrary()[0]?.id || "");
      localStorage.setItem(storageKey, JSON.stringify(fallback));
      return fallback;
    }

    function persistLocalState(plan, options = {}) {
      const id = options.id || currentLocalPlanId() || newLocalPlanId();
      const library = planLibrary();
      const previous = library.find((record) => record.id === id);
      const record = planRecordFromPlan(plan, id, {
        label: options.label || plan.name || previous?.label,
        tripId: options.tripId !== undefined ? options.tripId : previous?.tripId || (id === sharedLocalPlanId() ? getTripId() : ""),
        createdAt: previous?.createdAt,
      });
      const next = [record, ...library.filter((item) => item.id !== id)];
      savePlanLibrary(next);
      if (!sharedLocalPlanId()) setCurrentLocalPlanId(id);
      localStorage.setItem(storageKey, JSON.stringify(record.data));
      return record;
    }

    return {
      newLocalPlanId,
      sharedLocalPlanId,
      currentLocalPlanId,
      setCurrentLocalPlanId,
      normalizePlanLibrary,
      planLibrary,
      savePlanLibrary,
      planRecordFromPlan,
      ensurePlanLibrary,
      loadState,
      persistLocalState,
    };
  }

  window.createTripboardPlanStore = createTripboardPlanStore;
})();
