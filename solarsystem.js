// solarsystem.js

export async function fetchPlanetData(planetName = "earth") {
    try {
        const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${planetName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`Unable to fetch data for ${planetName}`);
        }

        const data = await response.json();
        return {
            name: data.englishName || data.id,
            isPlanet: data.isPlanet,
            gravity: `${data.gravity} m/s²`,
            meanRadius: `${data.meanRadius} km`,
            mass: data.mass ? `${data.mass.massValue} × 10^${data.mass.massExponent} kg` : "N/A",
            escapeVelocity: data.escape ? `${data.escape / 1000} km/s` : "N/A",
            density: `${data.density} g/cm³`,
            discoveryDate: data.discoveryDate || "Unknown",
            discoveredBy: data.discoveredBy || "Unknown",
        };
    } catch (error) {
        console.error(error);
        return { error: `Failed to retrieve planet data: ${error.message}` };
    }
}