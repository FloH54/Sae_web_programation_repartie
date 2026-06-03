export function setList(items: { id?: string | number; title: string; subtitle: string; typeLabel: "velo" | "restaurant" | "incident" }[]) {
  const container = document.querySelector(".list-items")!;
  container.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "item empty";

    empty.innerHTML = `
      <h3>Aucun résultat</h3>
      <p>Aucun lieu ne correspond à la recherche</p>
    `;

    container.appendChild(empty);
    return;
  }

  items.forEach(i => {
    const div = document.createElement("div");
    div.className = "item";

    const icon =
      i.typeLabel === "restaurant"
        ? "assets/food.svg"
        : i.typeLabel === "velo"
        ? "assets/bike.svg"
        : "assets/car.svg";

    const label =
      i.typeLabel === "restaurant"
        ? "Restaurant"
        : i.typeLabel === "velo"
        ? "Station de Vélo"
        : "Incident";

    const restaurantId = i.id ?? "";

    div.innerHTML = `
      <h3>${i.title}</h3>
      <p>${i.subtitle}</p>
      <div class="type">
        <img src="${icon}" alt="${label}">
        <p>${label}</p>
      </div>
      <div class="button">
        <button onclick="openReservationModal('${restaurantId}')">Réservation</button>
      </div>
    `;

    container.appendChild(div);
  });
}