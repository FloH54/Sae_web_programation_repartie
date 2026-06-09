import { addMarker } from "./map";
import { refreshList } from "./search";
import * as L from "leaflet";

export type Incident = {
  street: string;
  type: string;
  description: string;
  lat: number;
  lon: number;
};

export let incidents: Incident[] = [];
let incidentsLoaded = false;

export function loadIncidents() {
  if (incidentsLoaded) {
    renderIncidents(incidents);
    refreshList();
    return;
  }

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
      incidentsLoaded = true;

      renderIncidents(incidents);
      refreshList();
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