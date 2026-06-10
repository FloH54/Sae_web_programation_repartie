import { setMode } from "./store";
import { loadVelibStations } from "./bike";
import { loadRestaurants } from "./food";
import { loadIncidents } from "./car";
import { loadCrous } from "./crous";
import { clearOverlayMarkers } from "./map";
import { search } from "./search";
import {
  openReservationModal,
  closeReservationModal,
  submitReservation,
  initModal,
} from "./modal";
import { openMenuModal, closeMenuModal, initMenuModal } from "./menuModal";
import {marked} from "marked";

document.addEventListener("DOMContentLoaded", () => {
  setMode("velo");

  loadVelibStations();

  document.querySelector("#search")!
    .addEventListener("input", (e) => {
      search((e.target as HTMLInputElement).value);
    });

  initModal();
  initMenuModal();
});

(window as any).showVelibs = () => {
  setMode("velo");
  clearOverlayMarkers();
  loadVelibStations();
};

(window as any).showRestaurants = () => {
  setMode("restaurant");
  clearOverlayMarkers();
  loadRestaurants();
};

(window as any).showAccidents = () => {
  setMode("incident");
  clearOverlayMarkers();
  loadIncidents();
};

(window as any).showCrous = () => {
  setMode("crous");
  clearOverlayMarkers();
  loadCrous();
};

async function afficherCompteRendu() {
  const liste = document.querySelector(".list-items") as HTMLElement;
  const map = document.querySelector(".map") as HTMLElement;
  const compteRendu = document.getElementById("compte-rendu")!;

  liste.style.display = "none";
  map.style.display = "none";
  compteRendu.style.display = "block";

  try {
    const md = await fetch("rendu.md").then(r => {
      if (!r.ok) throw new Error("Fichier introuvable");
      return r.text();
    });
    compteRendu.innerHTML = marked.parse(md).toString();
  } catch (e) {
    compteRendu.innerHTML = "<p>Impossible de charger le compte rendu.</p>";
  }
}

(window as any).showCompteRendu = () => {
  afficherCompteRendu();
};

(window as any).openReservationModal = openReservationModal;
(window as any).closeReservationModal = closeReservationModal;
(window as any).submitReservation = submitReservation;
(window as any).openMenuModal = openMenuModal;
(window as any).closeMenuModal = closeMenuModal;