(function () {
  const defaultServiceConfig = {
    aiEndpoint: "",
    aiToken: "",
    amapEndpoint: "",
    amapRouteEndpoint: "",
    amapJsKey: "",
    amapSecurityCode: "",
    weatherEndpoint: "",
  };
  const defaultTokenConfig = {
    endpoint: "",
    token: "",
  };

  function cleanObject(value, defaults = {}) {
    return {
      ...defaults,
      ...(value && typeof value === "object" ? value : {}),
    };
  }

  function readJson(localStorageRef, key, fallback, safeJsonParse) {
    return cleanObject(safeJsonParse(localStorageRef.getItem(key), fallback), fallback);
  }

  function writeJson(localStorageRef, key, value) {
    localStorageRef.setItem(key, JSON.stringify(value));
    return value;
  }

  function createTripboardServiceClient({
    fetch,
    fetchWithTimeout,
    localStorage,
    safeJsonParse,
    serviceConfigKey,
    transportConfigKey,
    externalImportConfigKey,
    getAppConfig = () => ({}),
  }) {
    function headers(token = "", endpoint = "") {
      const requestHeaders = { "Content-Type": "application/json" };
      if (token) requestHeaders.Authorization = `Bearer ${token}`;
      const appConfig = getAppConfig() || {};
      if (!token && String(endpoint || "").includes("supabase.co/functions/v1") && appConfig.supabaseAnonKey) {
        requestHeaders.apikey = appConfig.supabaseAnonKey;
        requestHeaders.Authorization = `Bearer ${appConfig.supabaseAnonKey}`;
      }
      return requestHeaders;
    }

    async function postJson(endpoint, payload, { token = "", timeoutMs = 0, rejectOkFalse = true } = {}) {
      const request = {
        method: "POST",
        headers: headers(token, endpoint),
        body: JSON.stringify(payload),
      };
      const response = timeoutMs
        ? await fetchWithTimeout(endpoint, request, timeoutMs)
        : await fetch(endpoint, request);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || (rejectOkFalse && data.ok === false)) {
        const error = new Error(data.message || data.error || `HTTP ${response.status}`);
        error.data = data;
        error.status = response.status;
        throw error;
      }
      return data;
    }

    return {
      defaultServiceConfig,
      defaultTokenConfig,
      headers,
      postJson,
      loadServiceConfig() {
        return readJson(localStorage, serviceConfigKey, defaultServiceConfig, safeJsonParse);
      },
      saveServiceConfig(config) {
        return writeJson(localStorage, serviceConfigKey, cleanObject(config, defaultServiceConfig));
      },
      loadTransportConfig() {
        return readJson(localStorage, transportConfigKey, defaultTokenConfig, safeJsonParse);
      },
      saveTransportConfig(config) {
        return writeJson(localStorage, transportConfigKey, cleanObject(config, defaultTokenConfig));
      },
      loadExternalImportConfig() {
        return readJson(localStorage, externalImportConfigKey, defaultTokenConfig, safeJsonParse);
      },
      saveExternalImportConfig(config) {
        return writeJson(localStorage, externalImportConfigKey, cleanObject(config, defaultTokenConfig));
      },
    };
  }

  window.createTripboardServiceClient = createTripboardServiceClient;
})();
