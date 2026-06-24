(function () {
  function createTripboardServiceApi({ serviceClient, fetch }) {
    async function readJsonResponse(response) {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(data.reason || data.message || data.error || `HTTP ${response.status}`);
        error.data = data;
        error.status = response.status;
        throw error;
      }
      return data;
    }

    return {
      amap: {
        lookupPlaces(endpoint, payload, { timeoutMs = 6000 } = {}) {
          return serviceClient.postJson(endpoint, payload, { timeoutMs });
        },
        route(endpoint, payload) {
          return serviceClient.postJson(endpoint, payload);
        },
      },
      ai: {
        optimizeRoute(config, payload) {
          return serviceClient.postJson(config.aiEndpoint, payload, { token: config.aiToken });
        },
      },
      externalImport: {
        parse(config, payload, { timeoutMs = 12000 } = {}) {
          return serviceClient.postJson(config.endpoint, payload, {
            token: config.token,
            timeoutMs,
          });
        },
      },
      transport: {
        quotes(config, payload) {
          return serviceClient.postJson(config.endpoint, payload, {
            token: config.token,
            rejectOkFalse: false,
          });
        },
      },
      weather: {
        proxyForecast(endpoint, payload) {
          return serviceClient.postJson(endpoint, payload);
        },
        async geocode(query) {
          const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=zh&format=json`;
          const data = await readJsonResponse(await fetch(url));
          const result = data.results?.[0];
          if (!result) return null;
          return { latitude: result.latitude, longitude: result.longitude, name: result.name };
        },
        async forecast(place, { forecastDays = 16 } = {}) {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=${forecastDays}`;
          return readJsonResponse(await fetch(url));
        },
      },
    };
  }

  window.createTripboardServiceApi = createTripboardServiceApi;
})();
