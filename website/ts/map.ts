import L from "leaflet";

export const map = L.map("map").setView([48.683, 6.2], 13);

map.zoomControl.remove();

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

L.control.zoom({
  position: "bottomright",
}).addTo(map);

export let overlayMarkers: L.Marker[] = [];

export function clearOverlayMarkers() {
  overlayMarkers.forEach(m => map.removeLayer(m));
  overlayMarkers = [];
}

export function addMarker(marker: L.Marker) {
  overlayMarkers.push(marker);
  marker.addTo(map);
}