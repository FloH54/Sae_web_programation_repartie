type MenuPlat = { libelle: string };
type MenuCategory = { libelle: string; plats: MenuPlat[] };
type MenuRepas = { type: string; categories: MenuCategory[] };
type MenuDay = { date: string; repas: MenuRepas[] };

function formatRepasType(type: string): string {
  if (type === "midi") return "Midi";
  if (type === "soir") return "Soir";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function renderMenuHtml(data: MenuDay[]): string {
  if (!data.length) {
    return "<p class=\"menu-empty\">Aucun menu disponible pour ce restaurant.</p>";
  }

  return data
    .map(
      day => `
      <div class="menu-day">
        <h3>${day.date}</h3>
        ${day.repas
          .map(
            repas => `
          <div class="menu-repas">
            <h4>${formatRepasType(repas.type)}</h4>
            ${repas.categories
              .map(
                cat => `
              <div class="menu-category">
                <p class="menu-category-label">${cat.libelle}</p>
                <ul>
                  ${cat.plats.map(plat => `<li>${plat.libelle}</li>`).join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>
    `
    )
    .join("");
}

async function openMenuModal(crousId: string, restaurantName: string): Promise<void> {
  const modal = document.getElementById("menuModal")!;
  const content = document.getElementById("menu-content")!;
  const title = document.getElementById("menu-title")!;

  title.textContent = restaurantName;
  content.innerHTML = "<p class=\"menu-loading\">Recherche en cours...</p>";
  modal.classList.add("active");

  try {
    const res = await fetch(`http://localhost:8080/crous/menu?id=${crousId}`);
    const json = await res.json().catch(() => null);

    if (!res.ok || json?.error) {
      content.innerHTML =
        "<p class=\"menu-empty\">Impossible de charger le menu. Veuillez réessayer.</p>";
      return;
    }

    content.innerHTML = renderMenuHtml(json?.data ?? []);
  } catch {
    content.innerHTML =
      "<p class=\"menu-empty\">Impossible de charger le menu. Veuillez réessayer.</p>";
  }
}

function closeMenuModal(): void {
  document.getElementById("menuModal")!.classList.remove("active");
  const content = document.getElementById("menu-content")!;
  content.innerHTML = "";
}

function initMenuModal(): void {
  document.getElementById("menuModal")!.addEventListener("click", function (e: MouseEvent) {
    if (e.target === this) closeMenuModal();
  });
}

export { openMenuModal, closeMenuModal, initMenuModal };
