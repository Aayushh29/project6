const map = L.map('map').setView([51.0447, -114.0719], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
  draw: {
    polygon: false,
    circle: false,
    rectangle: false,
    marker: false,
    circlemarker: false,
    polyline: true
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

let originalLine = null;
let simplifiedLine = null;

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;

  if (originalLine) {
    drawnItems.removeLayer(originalLine);
  }
  if (simplifiedLine) {
    map.removeLayer(simplifiedLine);
    simplifiedLine = null;
  }

  originalLine = layer;
  drawnItems.addLayer(layer);
});

document.getElementById('simplifyBtn').addEventListener('click', () => {
  if (!originalLine) return;

  const geojson = originalLine.toGeoJSON();

  const simplified = turf.simplify(geojson, { tolerance: 0.001, highQuality: false });

  if (simplifiedLine) {
    map.removeLayer(simplifiedLine);
  }

  simplifiedLine = L.geoJSON(simplified, {
    style: { color: 'blue', weight: 3}
  }).addTo(map);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (originalLine) {
    drawnItems.removeLayer(originalLine);
    originalLine = null;
  }
  if (simplifiedLine) {
    map.removeLayer(simplifiedLine);
    simplifiedLine = null;
  }
});
