import { clearOverlayMarkers } from "./map";
import { currentMode } from "./store";
import { velibStations } from "./bike";
import { restaurants } from "./food";
import { incidents } from "./car";
import { crousPlaces } from "./crous";
import { setList } from "./uiList";

export function search(query: string) {
  const q = query.toLowerCase();

  clearOverlayMarkers();

  if (currentMode === "velo") {
    const filtered = velibStations.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );

    setList(filtered.map(s => ({
      title: s.name,
      subtitle: s.address,
      typeLabel: "velo"
    })));
  }

  if (currentMode === "restaurant") {
    const filtered = restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );

    setList(filtered.map(r => ({
      id: r.id,
      title: r.name,
      subtitle: r.address,
      typeLabel: "restaurant"
    })));
  }

  if (currentMode === "incident") {
    const filtered = incidents.filter(i =>
      i.street.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );

    setList(filtered.map(i => ({
      title: i.street,
      subtitle: i.type,
      typeLabel: "incident"
    })));
  }

  if (currentMode === "crous") {
    const filtered = crousPlaces.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );

    setList(filtered.map(c => ({
      title: c.name,
      subtitle: c.address,
      typeLabel: "crous"
    })));
  }
}

export function refreshList() {
  if (currentMode === "velo") {
    setList(velibStations.map(s => ({
      title: s.name,
      subtitle: s.address,
      typeLabel: "velo"
    })));
  }

  if (currentMode === "restaurant") {
    setList(restaurants.map(r => ({
      id: r.id,
      title: r.name,
      subtitle: r.address,
      typeLabel: "restaurant"
    })));
  }

  if (currentMode === "incident") {
    setList(incidents.map(i => ({
      title: i.street,
      subtitle: i.type,
      typeLabel: "incident"
    })));
  }

  if (currentMode === "crous") {
    setList(crousPlaces.map(c => ({
      title: c.name,
      subtitle: c.address,
      typeLabel: "crous"
    })));
  }
}