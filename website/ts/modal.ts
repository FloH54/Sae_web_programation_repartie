function openReservationModal(restaurantId: string): void {
  (document.getElementById("res-restaurant-id") as HTMLInputElement).value = restaurantId;

  document.getElementById("reservationModal")!.classList.add("active");

  showReservationForm();
}

function closeReservationModal(): void {
  document.getElementById("reservationModal")!.classList.remove("active");

  (document.getElementById("res-nom") as HTMLInputElement).value = "";
  (document.getElementById("res-prenom") as HTMLInputElement).value = "";
  (document.getElementById("res-tel") as HTMLInputElement).value = "";
  (document.getElementById("res-nb") as HTMLInputElement).value = "";
  (document.getElementById("res-date") as HTMLInputElement).value = "";
  (document.getElementById("res-restaurant-id") as HTMLInputElement).value = "";

  resetModalState();
}

function resetModalState(): void {
  document.getElementById("modal-form-content")!.style.display = "";
  document.getElementById("modal-success-content")!.style.display = "none";
  document.getElementById("modal-error-content")!.style.display = "none";
}

function showReservationForm(): void {
  resetModalState();
}

function showModalSuccess(): void {
  document.getElementById("modal-form-content")!.style.display = "none";
  document.getElementById("modal-error-content")!.style.display = "none";
  document.getElementById("modal-success-content")!.style.display = "";
}

function showModalError(message: string): void {
  document.getElementById("modal-form-content")!.style.display = "none";
  document.getElementById("modal-success-content")!.style.display = "none";

  const errorEl = document.getElementById("modal-error-content")!;
  errorEl.style.display = "";

  const msgEl = document.getElementById("modal-error-message");
  if (msgEl) msgEl.textContent = message;
}

async function submitReservation(): Promise<void> {

  const nom = (document.getElementById("res-nom") as HTMLInputElement).value.trim();
  const prenom = (document.getElementById("res-prenom") as HTMLInputElement).value.trim();
  const telephone = (document.getElementById("res-tel") as HTMLInputElement).value.trim();
  const nb = (document.getElementById("res-nb") as HTMLInputElement).value.trim();
  const date = (document.getElementById("res-date") as HTMLInputElement).value;

  const restaurantId = parseInt(
    (document.getElementById("res-restaurant-id") as HTMLInputElement).value
  );

  if (!nom || !prenom || !telephone || !nb || !date) {
    showModalError("Veuillez remplir tous les champs.");
    return;
  }

  if (isNaN(restaurantId)) {
    showModalError("Identifiant restaurant invalide.");
    return;
  }

  try {

    const res = await fetch("http://localhost:8080/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nom,
        prenom,
        telephone,
        nbPersonnes: parseInt(nb),
        restaurantId,
        date
      })
    });

    const data = await res.json();

    if (res.ok) {
      showModalSuccess();
    } else {
      showModalError(data.error || "Erreur lors de la réservation.");
    }

  } catch {
    showModalError("Impossible de contacter le serveur.");
  }
}

function initModal(): void {
  document.getElementById("reservationModal")!
    .addEventListener("click", function (e: MouseEvent) {
      if (e.target === this) closeReservationModal();
    });
}

export {
  openReservationModal,
  closeReservationModal,
  submitReservation,
  initModal
};