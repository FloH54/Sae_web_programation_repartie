import { clearOverlayMarkers } from "./map";
import { currentMode } from "./store";
import { velibStations, renderStations } from "./bike";
import { restaurants, renderRestaurants } from "./food";
import { incidents, renderIncidents } from "./car";
import { setList } from "./uiList";

export function search(query: string) {
  const q = query.toLowerCase();

  clearOverlayMarkers();

  if (currentMode === "velo") {
    const filtered = velibStations.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );

    renderStations(filtered);

    setList(filtered.map(s => ({
      title: s.name,
      subtitle: s.address,
      typeLabel: "velo"
    })));

    return;
  }

  if (currentMode === "restaurant") {
    const filtered = restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );

    renderRestaurants(filtered);

    setList(filtered.map(r => ({
      title: r.name,
      subtitle: r.address,
      typeLabel: "restaurant"
    })));

    return;
  }

  if (currentMode === "incident") {
    const filtered = incidents.filter(i =>
      i.street.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );

    renderIncidents(filtered);

    setList(filtered.map(i => ({
      title: i.street,
      subtitle: i.type,
      typeLabel: "incident"
    })));
  }
}

export function refreshList() {
  clearOverlayMarkers();

  if (currentMode === "velo") {
    renderStations(velibStations);

    setList(velibStations.map(s => ({
      title: s.name,
      subtitle: s.address,
      typeLabel: "velo"
    })));

    return;
  }

  if (currentMode === "restaurant") {
    renderRestaurants(restaurants);

    setList(restaurants.map(r => ({
      title: r.name,
      subtitle: r.address,
      typeLabel: "restaurant"
    })));

    return;
  }

  if (currentMode === "incident") {
    renderIncidents(incidents);

    setList(incidents.map(i => ({
      title: i.street,
      subtitle: i.type,
      typeLabel: "incident"
    })));
  }
}