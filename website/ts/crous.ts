import { addMarker } from "./map";
import { refreshList } from "./search";
import { setListError, setListLoading } from "./uiList";
import * as L from "leaflet";
import { API_BASE } from "./apiConfig";

export type Crous = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
};

export let crousPlaces: Crous[] = [];
export let crousLoading = false;
let crousLoaded = false;

export function loadCrous() {
  if (crousLoaded) {
    renderCrous(crousPlaces);
    refreshList();
    return;
  }

  crousLoading = true;
  setListLoading("Recherche en cours...");

  fetch(`${API_BASE}/crous`)
    .then(r => {
      if (!r.ok) throw new Error("api error");
      return r.json();
    })
    .then(res => {
      if (res.error) throw new Error(res.error);

      const apiCrous: Crous[] = res.map((i: any) => ({
        id: i.id,
        name: i.nom,
        address: i.adresse,
        lat: i.latitude,
        lon: i.longitude,
      }));

      crousPlaces = apiCrous;
      crousLoaded = true;
      crousLoading = false;
      refreshList();
    })
    .catch(err => {
      crousLoading = false;
      console.error("Erreur API Crous:", err);
      setListError("Impossible de charger les restaurants CROUS.");
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