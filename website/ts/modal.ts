function openReservationModal(restaurantId: string): void {
  (document.getElementById("res-restaurant-id") as HTMLInputElement).value = restaurantId;
  document.getElementById("reservationModal")!.classList.add("active");
}

function closeReservationModal(): void {
  document.getElementById("reservationModal")!.classList.remove("active");
  (document.getElementById("res-nom") as HTMLInputElement).value = "";
  (document.getElementById("res-prenom") as HTMLInputElement).value = "";
  (document.getElementById("res-tel") as HTMLInputElement).value = "";
  (document.getElementById("res-nb") as HTMLInputElement).value = "";
  (document.getElementById("res-restaurant-id") as HTMLInputElement).value = "";
}

async function submitReservation(): Promise<void> {
  const nom = (document.getElementById("res-nom") as HTMLInputElement).value.trim();
  const prenom = (document.getElementById("res-prenom") as HTMLInputElement).value.trim();
  const tel = (document.getElementById("res-tel") as HTMLInputElement).value.trim();
  const nb = (document.getElementById("res-nb") as HTMLInputElement).value.trim();
  const restaurantId = parseInt(
    (document.getElementById("res-restaurant-id") as HTMLInputElement).value
  );

  if (!nom || !prenom || !tel || !nb) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (isNaN(restaurantId)) {
    alert("Identifiant restaurant invalide.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        prenom,
        telephone: tel,
        nbPersonnes: parseInt(nb),
        restaurantId,
      }),
    });

    if (res.ok) {
      closeReservationModal();
      alert("Réservation envoyée avec succès !");
    } else {
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  } catch {
    alert("Impossible de contacter le serveur.");
  }
}

function initModal(): void {
  document.getElementById("reservationModal")!
    .addEventListener("click", function (e: MouseEvent) {
      if (e.target === this) closeReservationModal();
    });
}

export { openReservationModal, closeReservationModal, submitReservation, initModal };