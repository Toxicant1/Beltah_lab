// modules/geo.js
// Simple geolocation helper for Beltah CyberLab
// Later we can replace with real API or database

export const geoDB = {
  Kenya: { lat: -1.286389, lon: 36.817223, region: "East Africa" },
  Nigeria: { lat: 9.076479, lon: 7.398574, region: "West Africa" },
  Morocco: { lat: 33.573110, lon: -7.589843, region: "North Africa" },
  Egypt: { lat: 30.033333, lon: 31.233334, region: "North Africa" },
  "South Africa": { lat: -25.746111, lon: 28.188056, region: "Southern Africa" }
};

// Returns geo info or null
export function getGeo(node) {
  return geoDB[node] || null;
}

// Returns random node object (future feature)
export function randomNode() {
  const keys = Object.keys(geoDB);
  return keys[Math.floor(Math.random() * keys.length)];
}