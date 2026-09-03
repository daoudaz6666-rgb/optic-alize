/* ============================================================
   OPTIC ALIZÉ — favoris (liste d'envies)
   Conservés dans le navigateur (localStorage), comme le panier.
   Ce script :
     - ajoute une icône cœur + compteur dans l'en-tête ;
     - injecte un bouton cœur sur chaque fiche produit (.product-card
       et page produit) sans modifier le HTML des pages ;
     - fournit renderFavoris() pour la page favoris.html.
   ============================================================ */

const FAV_KEY = "optic-alize-favoris";

const HEART_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

function getFavoris() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveFavoris(liste) {
  localStorage.setItem(FAV_KEY, JSON.stringify(liste));
  updateFavBadge();
  syncFavButtons();
}

function isFavori(id) {
  return getFavoris().includes(id);
}

function favorisCount() {
  return getFavoris().length;
}

/* Ajoute / retire un produit des favoris. Renvoie le nouvel état (true = favori). */
function toggleFavori(id) {
  const liste = getFavoris();
  const i = liste.indexOf(id);
  let actif;
  if (i === -1) {
    liste.push(id);
    actif = true;
  } else {
    liste.splice(i, 1);
    actif = false;
  }
  saveFavoris(liste);
  const produit = typeof PRODUITS !== "undefined" && PRODUITS.find((p) => p.id === id);
  if (typeof showToast === "function" && produit) {
    showToast(actif ? `${produit.nom} ajouté aux favoris` : `${produit.nom} retiré des favoris`);
  }
  if (typeof renderFavoris === "function") renderFavoris();
  return actif;
}

function updateFavBadge() {
  document.querySelectorAll("[data-fav-count]").forEach((el) => {
    const n = favorisCount();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* Met à jour l'état visuel de tous les boutons cœur présents dans la page. */
function syncFavButtons() {
  document.querySelectorAll(".fav-btn[data-fav-id]").forEach((btn) => {
    const actif = isFavori(btn.dataset.favId);
    btn.classList.toggle("is-active", actif);
    btn.setAttribute("aria-pressed", String(actif));
    btn.setAttribute(
      "aria-label",
      actif ? "Retirer des favoris" : "Ajouter aux favoris"
    );
  });
}

/* Récupère l'identifiant produit d'une carte à partir de son lien produit.html?id=… */
function idProduitDepuisCarte(carte) {
  const lien = carte.querySelector('a[href*="produit.html?id="]');
  if (!lien) return null;
  try {
    return new URLSearchParams(lien.getAttribute("href").split("?")[1]).get("id");
  } catch (e) {
    return null;
  }
}

function creerBoutonFav(id) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fav-btn";
  btn.dataset.favId = id;
  btn.innerHTML = HEART_SVG;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavori(id);
  });
  return btn;
}

/* Ajoute un bouton cœur sur les cartes produit et la page produit. */
function injecterBoutonsFav(racine) {
  (racine || document).querySelectorAll(".product-card").forEach((carte) => {
    if (carte.querySelector(".fav-btn")) return;
    const id = idProduitDepuisCarte(carte);
    const media = carte.querySelector(".product-media");
    if (!id || !media) return;
    media.appendChild(creerBoutonFav(id));
  });

  /* Page produit : bouton à côté de « Ajouter au panier » */
  const addBtn = (racine || document).querySelector("#add-btn");
  if (addBtn && !addBtn.parentNode.querySelector(".fav-btn")) {
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || (typeof produit !== "undefined" && produit.id);
    if (id) {
      const btn = creerBoutonFav(id);
      btn.classList.add("fav-btn--inline");
      btn.insertAdjacentHTML("beforeend", "<span>Favori</span>");
      addBtn.insertAdjacentElement("afterend", btn);
    }
  }

  syncFavButtons();
}

/* Icône cœur dans l'en-tête, insérée avant le panier. */
function injecterIconeEntete() {
  const actions = document.querySelector(".header-actions");
  if (!actions || actions.querySelector('[aria-label="Favoris"]')) return;
  const panier = actions.querySelector('a[href="panier.html"]');
  const lien = document.createElement("a");
  lien.href = "favoris.html";
  lien.className = "icon-btn";
  lien.setAttribute("aria-label", "Favoris");
  lien.innerHTML =
    HEART_SVG.replace("<svg ", '<svg fill="none" stroke="currentColor" stroke-width="2" ') +
    '<span class="cart-count" data-fav-count style="display:none">0</span>';
  actions.insertBefore(lien, panier || actions.firstChild);
}

/* Rendu de la page favoris.html (si le conteneur #favoris-grid est présent). */
function renderFavoris() {
  const grid = document.getElementById("favoris-grid");
  if (!grid || typeof PRODUITS === "undefined") return;
  const items = getFavoris()
    .map((id) => PRODUITS.find((p) => p.id === id))
    .filter(Boolean);

  const compteur = document.getElementById("favoris-count");
  if (compteur)
    compteur.textContent = `${items.length} article${items.length > 1 ? "s" : ""}`;

  const vide = document.getElementById("favoris-vide");
  if (vide) vide.hidden = items.length > 0;

  grid.innerHTML = items
    .map(
      (p) => `
    <div class="product-card reveal in-view">
      <a href="produit.html?id=${p.id}" class="product-media">
        ${p.nouveau ? '<span class="badge">Nouveau</span>' : ""}
        ${typeof getProduitIcon === "function" ? getProduitIcon(p) : ""}
      </a>
      <div class="product-body">
        <span class="product-cat">${p.categorie === "lentilles" ? "Lentilles" : p.type === "soleil" ? "Lunettes de soleil" : "Lunettes de vue"}</span>
        <h3 class="product-name"><a href="produit.html?id=${p.id}">${p.nom}</a></h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="product-price">${formatFCFA(p.prix)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">Ajouter</button>
        </div>
      </div>
    </div>`
    )
    .join("");

  injecterBoutonsFav(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  injecterIconeEntete();
  updateFavBadge();
  injecterBoutonsFav();
  renderFavoris();

  /* Les grilles produit sont rendues par des scripts inline : on réinjecte
     les cœurs quand le DOM change (filtres, carrousels, page produit). */
  const cibles = [
    "#product-grid",
    "#featured-grid",
    "#product-root",
    ".product-grid",
    ".carousel-viewport",
  ]
    .flatMap((sel) => Array.from(document.querySelectorAll(sel)))
    .filter((el, i, arr) => arr.indexOf(el) === i);

  if (cibles.length && "MutationObserver" in window) {
    const obs = new MutationObserver(() => injecterBoutonsFav());
    cibles.forEach((el) => obs.observe(el, { childList: true, subtree: true }));
  }
});
