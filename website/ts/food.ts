import { addMarker } from "./map";
import { refreshList } from "./search";
import * as L from "leaflet";
import { API_BASE } from "./apiConfig";

export type Restaurant = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
};

export let restaurants: Restaurant[] = [];
let restaurantsLoaded = false;

export function loadRestaurants() {
  if (restaurantsLoaded) {
    renderRestaurants(restaurants);
    refreshList();
    return;
  }

  fetch(`${API_BASE}/restaurants`)
    .then(r => r.json())
    .then(res => {

      const apiRestaurants = res.map((i: any) => {
        const [lat, lon] = i.gps.split(",").map((v: string) => v.trim());

        return {
          id: i.id,
          name: i.nom,
          address: i.adresse,
          lat: +lat,
          lon: +lon,
        };
      });

      restaurants = apiRestaurants;
      restaurantsLoaded = true;

      renderRestaurants(restaurants);
      refreshList();
    })
    .catch(err => {
      console.error("Erreur API restaurants:", err);
      renderRestaurants([]);
    });
}

export function renderRestaurants(list: Restaurant[]) {
  list.forEach(i => {
    const marker = L.marker([i.lat, i.lon], {
          icon: L.icon({
            iconUrl: './assets/location.svg',
            iconSize: [30, 30],
            className: 'station-marker'
          })
        }).bindPopup(`
          <b class="title">${i.name}</b><br>
          <p class="subtitle">${i.address}</p>
        `);

    addMarker(marker);
  });
}