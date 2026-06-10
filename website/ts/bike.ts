import { addMarker } from "./map";
import { refreshList } from "./search";
import * as L from "leaflet";

export type Station = {
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
};

export let velibStations: Station[] = [];
let velibLoaded = false;

export function loadVelibStations() {
  if (velibLoaded) {
    renderStations(velibStations);
    refreshList();
    return;
  }

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

      velibLoaded = true;
      renderStations(velibStations);
      refreshList();
    });
}

export function renderStations(list: Station[]) {
  list.forEach(s => {
    const marker = L.marker([s.lat, s.lon], {
      icon: L.icon({
        iconUrl: './assets/location.svg',
        iconSize: [30, 30],
        className: 'station-marker'
      })
    }).bindPopup(
      `<b class="title">${s.name}</b><br><p class="subtitle">${s.address}</p><br><div class="type"><img src="assets/bike.svg"/><p>Capacité : ${s.capacity}</p></div>`
    );

    addMarker(marker);
  });
}