const routeVariants = {
  balanced: [
    [-79.4167, 43.6712],
    [-79.4044, 43.6669],
    [-79.3922, 43.6624],
    [-79.3772, 43.6557],
    [-79.3572, 43.6474],
    [-79.3338, 43.6361],
  ],
  pavement: [
    [-79.4167, 43.6712],
    [-79.4052, 43.6744],
    [-79.3892, 43.671],
    [-79.3729, 43.6616],
    [-79.3522, 43.6519],
    [-79.3338, 43.6361],
  ],
  gravel: [
    [-79.4167, 43.6712],
    [-79.3974, 43.657],
    [-79.3812, 43.6472],
    [-79.3619, 43.641],
    [-79.3458, 43.6345],
    [-79.3338, 43.6361],
  ],
  climber: [
    [-79.4167, 43.6712],
    [-79.4075, 43.6842],
    [-79.3893, 43.6811],
    [-79.3712, 43.6684],
    [-79.3522, 43.6519],
    [-79.3338, 43.6361],
  ],
};

const mockSurfaceLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { kind: "bike" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.424, 43.667],
          [-79.398, 43.661],
          [-79.372, 43.652],
          [-79.343, 43.637],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kind: "pavement" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.418, 43.676],
          [-79.392, 43.672],
          [-79.368, 43.663],
          [-79.347, 43.652],
        ],
      },
    },
    {
      type: "Feature",
      properties: { kind: "gravel" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.407, 43.657],
          [-79.386, 43.647],
          [-79.364, 43.641],
          [-79.338, 43.634],
        ],
      },
    },
  ],
};

const mockSlopeLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { grade: "flat" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.421, 43.664],
          [-79.396, 43.659],
          [-79.374, 43.651],
        ],
      },
    },
    {
      type: "Feature",
      properties: { grade: "moderate" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.41, 43.684],
          [-79.39, 43.678],
          [-79.367, 43.666],
        ],
      },
    },
    {
      type: "Feature",
      properties: { grade: "steep" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.391, 43.681],
          [-79.376, 43.671],
          [-79.358, 43.657],
        ],
      },
    },
  ],
};

const defaultActivities = [
  {
    title: "Morning Tempo",
    date: "Today",
    distance: "38.4 km",
    time: "1h 46m",
    gain: "412 m",
    points: routeVariants.pavement,
  },
  {
    title: "Creekside Gravel",
    date: "Yesterday",
    distance: "27.8 km",
    time: "1h 31m",
    gain: "286 m",
    points: routeVariants.gravel,
  },
  {
    title: "Hill Repeat Loop",
    date: "Sunday",
    distance: "19.2 km",
    time: "58m",
    gain: "515 m",
    points: routeVariants.climber,
  },
];

const state = {
  surface: "balanced",
  map: null,
  mapReady: false,
  windVisible: true,
  importedActivities: [],
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  initIcons();
  initWindField();
  initMap();
  bindControls();
  fetchWeather();
  renderActivities();
  updateRoute();
});

function bindElements() {
  [
    "routeForm",
    "climbSlider",
    "gravelSlider",
    "windSlider",
    "climbValue",
    "gravelValue",
    "windValue",
    "headwindToggle",
    "bikeLaneToggle",
    "scenicToggle",
    "distanceMetric",
    "gainMetric",
    "timeMetric",
    "scoreMetric",
    "ringScore",
    "routeName",
    "pavementBreakdown",
    "gravelBreakdown",
    "laneBreakdown",
    "windBreakdown",
    "activityFeed",
    "uploadZone",
    "gpxInput",
    "clearImportsButton",
    "mapFallback",
    "windField",
    "recenterButton",
    "startInput",
    "finishInput",
    "weatherTemp",
    "weatherPrecip",
    "weatherWind",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initMap() {
  if (!window.maplibregl) {
    elements.mapFallback.hidden = false;
    return;
  }

  state.map = new maplibregl.Map({
    container: "map",
    style:
      window.AEROROUTE_CONFIG?.mapStyleUrl ||
      "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    center: [-79.3765, 43.6557],
    zoom: 11.4,
    pitch: 42,
    bearing: -18,
    attributionControl: false,
  });

  state.map.addControl(
    new maplibregl.AttributionControl({ compact: true }),
    "bottom-right",
  );

  state.map.on("load", () => {
    state.mapReady = true;
    addDemoLayers();
    updateRoute();
  });

  state.map.on("error", () => {
    if (!state.mapReady) {
      elements.mapFallback.hidden = false;
    }
  });
}

function addDemoLayers() {
  state.map.addSource("surface-lines", {
    type: "geojson",
    data: mockSurfaceLines,
  });

  state.map.addSource("slope-lines", {
    type: "geojson",
    data: mockSlopeLines,
  });

  state.map.addSource("active-route", {
    type: "geojson",
    data: makeRouteFeature(routeVariants.balanced),
  });

  state.map.addLayer({
    id: "surface-lines",
    type: "line",
    source: "surface-lines",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": 5,
      "line-opacity": 0.82,
      "line-color": [
        "match",
        ["get", "kind"],
        "bike",
        "#00e0b4",
        "gravel",
        "#f2b84b",
        "pavement",
        "#8f77ff",
        "#ffffff",
      ],
    },
  });

  state.map.addLayer({
    id: "slope-lines",
    type: "line",
    source: "slope-lines",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": 7,
      "line-opacity": 0.64,
      "line-color": [
        "match",
        ["get", "grade"],
        "flat",
        "#72e28c",
        "moderate",
        "#f4cf57",
        "steep",
        "#ed665d",
        "#ffffff",
      ],
    },
  });

  state.map.addLayer({
    id: "active-route-shadow",
    type: "line",
    source: "active-route",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": 13,
      "line-opacity": 0.36,
      "line-color": "#000000",
    },
  });

  state.map.addLayer({
    id: "active-route",
    type: "line",
    source: "active-route",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": 7,
      "line-color": "#00e0b4",
    },
  });
}

function bindControls() {
  document.querySelectorAll(".surface-option").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".surface-option")
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.surface = button.dataset.surface;
      updateRoute();
    });
  });

  [
    elements.climbSlider,
    elements.gravelSlider,
    elements.windSlider,
    elements.headwindToggle,
    elements.bikeLaneToggle,
    elements.scenicToggle,
    elements.startInput,
    elements.finishInput,
  ].forEach((control) => {
    control.addEventListener("input", updateRoute);
    control.addEventListener("change", updateRoute);
  });

  elements.routeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateRoute(true);
  });

  document.querySelectorAll(".layer-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleLayer(button));
  });

  elements.recenterButton.addEventListener("click", () => {
    if (!state.mapReady) return;
    state.map.easeTo({
      center: [-79.3765, 43.6557],
      zoom: 11.4,
      pitch: 42,
      bearing: -18,
      duration: 700,
    });
  });

  elements.uploadZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.uploadZone.classList.add("is-dragging");
  });

  elements.uploadZone.addEventListener("dragleave", () => {
    elements.uploadZone.classList.remove("is-dragging");
  });

  elements.uploadZone.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.uploadZone.classList.remove("is-dragging");
    handleFiles(event.dataTransfer.files);
  });

  elements.gpxInput.addEventListener("change", () => {
    handleFiles(elements.gpxInput.files);
    elements.gpxInput.value = "";
  });

  elements.clearImportsButton.addEventListener("click", () => {
    state.importedActivities = [];
    renderActivities();
  });
}

function toggleLayer(button) {
  const layer = button.dataset.layer;
  button.classList.toggle("is-active");

  if (layer === "weather") {
    state.windVisible = button.classList.contains("is-active");
    elements.windField.style.display = state.windVisible ? "block" : "none";
    return;
  }

  if (!state.mapReady) return;
  const id = layer === "surface" ? "surface-lines" : "slope-lines";
  const visibility = button.classList.contains("is-active") ? "visible" : "none";
  state.map.setLayoutProperty(id, "visibility", visibility);
}

async function fetchWeather() {
  const config = window.AEROROUTE_CONFIG || {};
  const apiKey = config.openWeatherMapApiKey;

  if (!apiKey || apiKey.includes("YOUR_")) {
    return;
  }

  const location = config.weatherLocation || {};
  const lat = location.lat ?? 43.85;
  const lon = location.lon ?? -79.38;
  const units = config.weatherUnits || "metric";
  const query = new URLSearchParams({
    lat,
    lon,
    units,
    appid: apiKey,
  });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${query}`,
    );

    if (!response.ok) {
      throw new Error(`Weather request failed with ${response.status}`);
    }

    const forecast = await response.json();
    const current = forecast.list?.[0];
    if (!current) return;

    const tempUnit = units === "imperial" ? "F" : "C";
    const windUnit = units === "imperial" ? "mph" : "km/h";
    const windSpeed =
      units === "imperial" ? current.wind.speed : current.wind.speed * 3.6;
    const windDirection = degreesToCompass(current.wind.deg || 0);

    elements.weatherTemp.textContent = `${Math.round(current.main.temp)} ${tempUnit}`;
    elements.weatherPrecip.textContent = `${Math.round((current.pop || 0) * 100)}%`;
    elements.weatherWind.textContent = `${windDirection} ${Math.round(windSpeed)} ${windUnit}`;
  } catch (error) {
    document.querySelector(".weather-strip").title =
      "Demo weather shown because OpenWeatherMap did not return live data.";
  }
}

function degreesToCompass(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return directions[Math.round(degrees / 22.5) % directions.length];
}

function updateRoute(shouldFly = false) {
  const values = readPreferenceValues();
  elements.climbValue.textContent = values.climb;
  elements.gravelValue.textContent = values.gravel;
  elements.windValue.textContent = values.wind;

  const variant = selectRouteVariant(values);
  const metrics = calculateMetrics(values, variant);
  const routeTitle = makeRouteTitle();

  elements.routeName.textContent = routeTitle;
  elements.distanceMetric.textContent = `${metrics.distance.toFixed(1)} km`;
  elements.gainMetric.textContent = `${metrics.gain} m`;
  elements.timeMetric.textContent = formatMinutes(metrics.minutes);
  elements.scoreMetric.textContent = metrics.score;
  elements.ringScore.textContent = metrics.score;
  elements.pavementBreakdown.textContent = `${metrics.pavement}%`;
  elements.gravelBreakdown.textContent = `${metrics.gravelShare}%`;
  elements.laneBreakdown.textContent = `${metrics.lane}%`;
  elements.windBreakdown.textContent = metrics.windLabel;

  updateScoreRing(metrics.score);

  if (state.mapReady) {
    state.map.getSource("active-route").setData(makeRouteFeature(variant));
    state.map.setPaintProperty("active-route", "line-color", metrics.color);
    if (shouldFly) {
      flyToRoute(variant);
      document.querySelector(".map-workspace").classList.add("route-flash");
      setTimeout(() => {
        document.querySelector(".map-workspace").classList.remove("route-flash");
      }, 580);
    }
  }
}

function readPreferenceValues() {
  return {
    climb: Number(elements.climbSlider.value),
    gravel: Number(elements.gravelSlider.value),
    wind: Number(elements.windSlider.value),
    avoidHeadwinds: elements.headwindToggle.checked,
    preferBikeLanes: elements.bikeLaneToggle.checked,
    scenic: elements.scenicToggle.checked,
    surface: state.surface,
  };
}

function selectRouteVariant(values) {
  if (values.surface === "gravel" || values.gravel > 64) return routeVariants.gravel;
  if (values.surface === "pavement") return routeVariants.pavement;
  if (values.climb > 66) return routeVariants.climber;
  return routeVariants.balanced;
}

function calculateMetrics(values, route) {
  const distance = routeDistance(route) * 3.2 * (values.scenic ? 1.08 : 1);
  const gravelBias = values.surface === "gravel" ? 18 : 0;
  const pavementBias = values.surface === "pavement" ? 20 : 0;
  const laneBoost = values.preferBikeLanes ? 12 : -6;
  const headwindRelief = values.avoidHeadwinds ? values.wind * 0.22 : values.wind * -0.04;
  const climbPenalty = Math.abs(values.climb - 44) * 0.11;
  const windPenalty = Math.max(2, 24 - headwindRelief);

  const score = Math.max(
    52,
    Math.min(98, Math.round(91 - climbPenalty - windPenalty * 0.45 + laneBoost * 0.36)),
  );

  const gain = Math.round(170 + values.climb * 5.4 + (values.scenic ? 72 : 0));
  const gravelShare = clamp(Math.round(22 + values.gravel * 0.48 + gravelBias), 6, 78);
  const lane = clamp(Math.round(20 + laneBoost + values.wind * 0.08), 8, 48);
  const pavement = clamp(100 - gravelShare - lane + pavementBias, 16, 84);
  const minutes = Math.round((distance / 20.5) * 60 + gain / 42 + windPenalty);
  const color = score > 86 ? "#00e0b4" : score > 74 ? "#f2b84b" : "#ed665d";

  return {
    distance,
    gain,
    minutes,
    score,
    gravelShare,
    lane,
    pavement,
    windLabel: windPenalty < 10 ? "Low" : windPenalty < 17 ? "Med" : "High",
    color,
  };
}

function updateScoreRing(score) {
  const degrees = clamp(score / 100, 0, 1) * 360;
  document.querySelector(".score-ring").style.background = `
    radial-gradient(circle at center, var(--panel) 54%, transparent 56%),
    conic-gradient(var(--teal) 0deg, var(--amber) ${degrees}deg, var(--panel-deep) 0deg)
  `;
}

function makeRouteTitle() {
  const start = elements.startInput.value.trim() || "Start";
  const finish = elements.finishInput.value.trim() || "Finish";
  return `${start} to ${finish}`;
}

function makeRouteFeature(coordinates) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      },
    ],
  };
}

function flyToRoute(route) {
  const bounds = route.reduce(
    (currentBounds, point) => currentBounds.extend(point),
    new maplibregl.LngLatBounds(route[0], route[0]),
  );
  state.map.fitBounds(bounds, {
    padding: { top: 140, right: 70, bottom: 110, left: 70 },
    duration: 700,
  });
}

function initWindField() {
  const positions = [
    [17, 20, -24],
    [38, 28, -19],
    [61, 19, -31],
    [79, 34, -22],
    [24, 47, -28],
    [48, 53, -17],
    [72, 55, -26],
    [18, 72, -20],
    [43, 78, -30],
    [66, 74, -21],
    [86, 68, -27],
  ];

  elements.windField.innerHTML = positions
    .map(
      ([left, top, rotation], index) =>
        `<span class="wind-glyph" style="left:${left}%;top:${top}%;--wind-rotation:${rotation}deg;animation-delay:${index * 120}ms"></span>`,
    )
    .join("");
}

function renderActivities() {
  const activities = [...state.importedActivities, ...defaultActivities];
  elements.activityFeed.innerHTML = "";

  activities.forEach((activity) => {
    const card = document.createElement("article");
    card.className = "ride-card";
    card.innerHTML = `
      <canvas class="ride-thumb" width="164" height="136" aria-hidden="true"></canvas>
      <div class="ride-copy">
        <h3>${escapeHtml(activity.title)}</h3>
        <p>${escapeHtml(activity.date)}</p>
        <div class="ride-stats">
          <span>${escapeHtml(activity.distance)}</span>
          <span>${escapeHtml(activity.time)}</span>
          <span>${escapeHtml(activity.gain)}</span>
        </div>
      </div>
    `;
    elements.activityFeed.appendChild(card);
    drawThumbnail(card.querySelector("canvas"), activity.points);
  });
}

function drawThumbnail(canvas, points) {
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 18;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#202124";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(255,255,255,0.08)";
  context.lineWidth = 1;
  for (let x = 18; x < width; x += 24) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x - 42, height);
    context.stroke();
  }

  const bounds = getPointBounds(points);
  const projected = points.map(([lng, lat]) => {
    const x =
      padding +
      ((lng - bounds.minLng) / Math.max(bounds.maxLng - bounds.minLng, 0.0001)) *
        (width - padding * 2);
    const y =
      height -
      padding -
      ((lat - bounds.minLat) / Math.max(bounds.maxLat - bounds.minLat, 0.0001)) *
        (height - padding * 2);
    return [x, y];
  });

  context.strokeStyle = "#00e0b4";
  context.lineWidth = 6;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  projected.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  context.fillStyle = "#f2b84b";
  const [startX, startY] = projected[0];
  const [endX, endY] = projected[projected.length - 1];
  context.beginPath();
  context.arc(startX, startY, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ed665d";
  context.beginPath();
  context.arc(endX, endY, 5, 0, Math.PI * 2);
  context.fill();
}

function handleFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) =>
    /\.(gpx|xml)$/i.test(file.name),
  );
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const activity = parseGpx(String(reader.result), file.name);
        state.importedActivities.unshift(activity);
        renderActivities();
      } catch (error) {
        elements.uploadZone.classList.add("is-dragging");
        setTimeout(() => elements.uploadZone.classList.remove("is-dragging"), 600);
      }
    };
    reader.readAsText(file);
  });
}

function parseGpx(source, fileName) {
  const doc = new DOMParser().parseFromString(source, "application/xml");
  const points = Array.from(doc.getElementsByTagName("trkpt")).map((point) => {
    const lat = Number(point.getAttribute("lat"));
    const lng = Number(point.getAttribute("lon"));
    const ele = Number(point.getElementsByTagName("ele")[0]?.textContent || 0);
    const time = point.getElementsByTagName("time")[0]?.textContent || "";
    return { lat, lng, ele, time };
  });

  if (points.length < 2 || points.some((point) => Number.isNaN(point.lat + point.lng))) {
    throw new Error("No track points found");
  }

  const distanceKm = points
    .slice(1)
    .reduce((sum, point, index) => sum + haversine(points[index], point), 0);
  const gain = Math.round(
    points.slice(1).reduce((sum, point, index) => {
      const delta = point.ele - points[index].ele;
      return sum + (delta > 0 ? delta : 0);
    }, 0),
  );
  const duration = getDuration(points);

  return {
    title: fileName.replace(/\.(gpx|xml)$/i, "").replace(/[-_]+/g, " "),
    date: "Imported just now",
    distance: `${distanceKm.toFixed(1)} km`,
    time: duration || "--",
    gain: `${gain} m`,
    points: points.map((point) => [point.lng, point.lat]),
  };
}

function getDuration(points) {
  const first = Date.parse(points[0].time);
  const last = Date.parse(points[points.length - 1].time);
  if (Number.isNaN(first) || Number.isNaN(last) || last <= first) return "";
  return formatMinutes(Math.round((last - first) / 60000));
}

function routeDistance(points) {
  return points.slice(1).reduce((sum, point, index) => {
    const previous = { lng: points[index][0], lat: points[index][1] };
    const current = { lng: point[0], lat: point[1] };
    return sum + haversine(previous, current);
  }, 0);
}

function haversine(a, b) {
  const radiusKm = 6371;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const value =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return radiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function getPointBounds(points) {
  return points.reduce(
    (bounds, [lng, lat]) => ({
      minLng: Math.min(bounds.minLng, lng),
      maxLng: Math.max(bounds.maxLng, lng),
      minLat: Math.min(bounds.minLat, lat),
      maxLat: Math.max(bounds.maxLat, lat),
    }),
    {
      minLng: Number.POSITIVE_INFINITY,
      maxLng: Number.NEGATIVE_INFINITY,
      minLat: Number.POSITIVE_INFINITY,
      maxLat: Number.NEGATIVE_INFINITY,
    },
  );
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (!hours) return `${remaining}m`;
  return `${hours}h ${remaining}m`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}
