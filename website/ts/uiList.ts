export function setListLoading(message: string) {
  const container = document.querySelector(".list-items")!;
  container.innerHTML = "";

  const loading = document.createElement("div");
  loading.className = "item empty loading";

  loading.innerHTML = `
    <h3>${message}</h3>
    <p>Veuillez patienter</p>
  `;

  container.appendChild(loading);
}

export function setListError(message: string) {
  const container = document.querySelector(".list-items")!;
  container.innerHTML = "";

  const error = document.createElement("div");
  error.className = "item empty";

  error.innerHTML = `
    <h3>Erreur</h3>
    <p>${message}</p>
  `;

  container.appendChild(error);
}

export function setList(items: {
  id?: string | number;
  title: string;
  subtitle: string;
  typeLabel: "velo" | "restaurant" | "incident" | "crous";
}[]) {
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
      i.typeLabel === "restaurant" || i.typeLabel === "crous"
        ? "assets/food.svg"
        : i.typeLabel === "velo"
        ? "assets/bike.svg"
        : "assets/car.svg";

    const label =
      i.typeLabel === "restaurant"
        ? "Restaurant"
        : i.typeLabel === "crous"
        ? "Crous"
        : i.typeLabel === "velo"
        ? "Station de Vélo"
        : "Incident";

    const itemId = i.id ?? "";

    let actionBtn = "";
    if (i.typeLabel === "restaurant") {
      actionBtn = `
        <div class="button">
          <button onclick="openReservationModal('${itemId}')">Réservation</button>
        </div>
      `;
    } else if (i.typeLabel === "crous" && itemId !== "") {
      const safeTitle = i.title.replace(/'/g, "\\'");
      actionBtn = `
        <div class="button">
          <button onclick="openMenuModal('${itemId}', '${safeTitle}')">Menu</button>
        </div>
      `;
    }

    div.innerHTML = `
      <h3>${i.title}</h3>
      <p>${i.subtitle}</p>
      <div class="type">
        <img src="${icon}" alt="${label}">
        <p>${label}</p>
      </div>
      ${actionBtn}
    `;

    container.appendChild(div);
  });
}