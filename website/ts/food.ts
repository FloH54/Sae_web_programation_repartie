import { addMarker } from "./map";
import { refreshList } from "./search";
import * as L from "leaflet";

export type Restaurant = {
  name: string;
  address: string;
  lat: number;
  lon: number;
};

export let restaurants: Restaurant[] = [];

export function loadRestaurants() {
  fetch("http://localhost:8080/restaurants")
    .then(r => r.json())
    .then(res => {

      const apiRestaurants = res.map((i: any) => {
        const [lat, lon] = i.gps.split(",").map((v: string) => v.trim());

        return {
          name: i.nom,
          address: i.adresse,
          lat: +lat,
          lon: +lon,
        };
      });

      restaurants = apiRestaurants;

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
    const marker = L.marker([i.lat, i.lon]).bindPopup(`
          <b>${i.name}</b><br>
          ${i.address}
        `);

    addMarker(marker);
  });
}