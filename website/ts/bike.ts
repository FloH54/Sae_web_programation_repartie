import { addMarker } from "./map";
import * as L from "leaflet";

export type Station = {
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
};

export let velibStations: Station[] = [];

export function loadVelibStations() {
  const url = "https://api.cyclocity.fr/contracts/nancy/gbfs/v3/station_information.json";

  fetch(url)
    .then(r => r.json())
    .then(res => {
      velibStations = res.data.stations.map((s: any) => ({
        name: s.name[1].text,
        address: s.address ?? "",
        lat: s.lat,
        lon: s.lon,
        capacity: s.capacity,
      }));

      renderStations(velibStations);
    });
}

export function renderStations(list: Station[]) {
  list.forEach(s => {
    const marker = L.marker([s.lat, s.lon]).bindPopup(
      `<b>${s.name}</b><br>${s.address}<br>Capacité : ${s.capacity}`
    );

    addMarker(marker);
  });
}