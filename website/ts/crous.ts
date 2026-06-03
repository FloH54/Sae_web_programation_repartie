import { addMarker } from "./map";
import { refreshList } from "./search";
import * as L from "leaflet";

export type Crous = {
  name: string;
  address: string;
  lat: number;
  lon: number;
};

export let crousPlaces: Crous[] = [];

export function loadCrous() {
  fetch("http://localhost:8080/crous")
    .then(r => r.json())
    .then(res => {
      const apiCrous: Crous[] = res.map((i: any) => ({
        name: i.nom,
        address: i.adresse,
        lat: i.latitude,
        lon: i.longitude,
      }));

      crousPlaces = apiCrous;

      renderCrous(crousPlaces);
      refreshList();
    })
    .catch(err => {
      console.error("Erreur API Crous:", err);
      renderCrous([]);
    });
}

export function renderCrous(list: Crous[]) {
  list.forEach(i => {
    const marker = L.marker([i.lat, i.lon], {
      icon: L.icon({
        iconUrl: "./assets/location.svg",
        iconSize: [30, 30],
        className: "station-marker",
      }),
    }).bindPopup(`
      <b class="title">${i.name}</b><br>
      <p class="subtitle">${i.address}</p>
      <div class="type"><img src="assets/food.svg"/><p>Crous</p></div>
    `);

    addMarker(marker);
  });
}