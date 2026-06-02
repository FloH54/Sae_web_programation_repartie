import { setMode } from "./store";
import { loadVelibStations } from "./bike";
import { loadRestaurants } from "./food";
import { loadIncidents } from "./car";
import { clearOverlayMarkers } from "./map";
import { refreshList, search } from "./search";

document.addEventListener("DOMContentLoaded", () => {
  setMode("velo");

  loadVelibStations();

  setTimeout(() => {
    refreshList();
  }, 300);

  document.querySelector("#search")!
    .addEventListener("input", (e) => {
      search((e.target as HTMLInputElement).value);
    });
});

(window as any).showVelibs = () => {
  setMode("velo");
  clearOverlayMarkers();
  loadVelibStations();
  setTimeout(refreshList, 200);
};

(window as any).showRestaurants = () => {
  setMode("restaurant");
  clearOverlayMarkers();
  loadRestaurants();
  setTimeout(refreshList, 200);
};

(window as any).showAccidents = () => {
  setMode("incident");
  clearOverlayMarkers();
  loadIncidents();
  setTimeout(refreshList, 200);
};