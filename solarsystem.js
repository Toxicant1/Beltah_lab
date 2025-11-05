// solarsystem.js
// Fetch and display solar system planet data in Beltah CyberLab 🔭🪐

const API_URL = "https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true";

async function fetchPlanets() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayPlanets(data.bodies);
  } catch (error) {
    logToFeed(`⚠️ Failed to fetch planet data: ${error.message}`);
  }
}

function displayPlanets(planets) {
  planets.forEach((planet) => {
    const name = planet.englishName;
    const mass = planet.mass?.massValue
      ? `${planet.mass.massValue} x 10^${planet.mass.massExponent} kg`
      : "Unknown";

    const gravity = planet.gravity ? `${planet.gravity} m/s²` : "Unknown";
    const discoveryDate = planet.discoveryDate || "N/A";

    logToFeed(
      `🪐 <strong>${name}</strong><br>` +
      `• Gravity: ${gravity}<br>` +
      `• Mass: ${mass}<br>` +
      `• Discovered: ${discoveryDate}<br><br>`
    );
  });
}

// Optional: auto-fetch planets on load
document.addEventListener("DOMContentLoaded", () => {
  logToFeed("🌌 Fetching data from the solar system...");
  fetchPlanets();
});

// Helper: log messages to feed (reuses existing Beltah CyberLab feed panel UI)
function logToFeed(message) {
  const feed = document.getElementById("feed");
  const now = new Date();
  const timestamp = now.toLocaleTimeString();

  feed.innerHTML += `<div><span class="time">${timestamp}</span>${message}</div>`;
  feed.scrollTop = feed.scrollHeight; // Auto-scroll
}