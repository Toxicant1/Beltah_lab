// earthmap.js
// Interactive satellite map using Leaflet.js

// Inject map container
function loadEarthMap() {
  const mapPanel = document.createElement("div");
  mapPanel.id = "earth-map";
  document.body.appendChild(mapPanel);

  // Initialize map
  const map = L.map("earth-map", {
    center: [0, 20], // Center on Africa
    zoom: 3,
    zoomControl: true,
  });

  // Add satellite imagery
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", 
    {
      attribution: "&copy; Esri &mdash; Earth Map"
    }
  ).addTo(map);

  // Add optional dark labels overlay
  const labels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png", 
    {
      attribution: "&copy; CARTO"
    }
  ).addTo(map);

  logToFeed("🌍 Earth map initialized — welcome to planet Beltah!");
}

// Remove map (optional)
function unloadEarthMap() {
  const panel = document.getElementById("earth-map");
  if (panel) panel.remove();
  logToFeed("🛰️ Earth map closed.");
}