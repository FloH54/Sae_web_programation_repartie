import { addMarker } from "./map";
import * as L from "leaflet";

export type Incident = {
  street: string;
  type: string;
  description: string;
  lat: number;
  lon: number;
};

export let incidents: Incident[] = [];

export function loadIncidents() {
  fetch("http://localhost:8080/road")
    .then(r => r.json())
    .then(res => {

      const apiIncidents = (res.incidents ?? []).map((i: any) => {
        const [lat, lon] = i.location.polyline.split(" ");

        return {
          street: i.location.street,
          type: i.type,
          description: i.description,
          lat: +lat,
          lon: +lon,
        };
      });

      incidents = [...apiIncidents];

      renderIncidents(incidents);
    })
    .catch(err => {
      console.error("Erreur API incidents:", err);

      renderIncidents([]);
    });
}

export function renderIncidents(list: Incident[]) {
  list.forEach(i => {
    const marker = L.marker([i.lat, i.lon], {
          icon: L.icon({
            iconUrl: './assets/location.svg',
            iconSize: [30, 30],
            className: 'station-marker'
          })
    }).bindPopup(`
      <b class="title">${i.street}</b><br>
      <p class="subtitle">${i.description}</p>
      <div class="type"><img src="assets/car.svg"/><p>${i.type}</p></div>
    `);

    addMarker(marker);
  });
}