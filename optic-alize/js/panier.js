/* ============================================================
   OPTIC ALIZÉ — panier
   Le panier est conservé dans le navigateur (localStorage).
   Comme il n'y a pas de paiement en ligne, la commande est
   envoyée à la boutique par WhatsApp ou par e-mail.
   ============================================================ */

const CART_KEY = "optic-alize-panier";
const BOUTIQUE_WHATSAPP = "22675093939"; // à remplacer par le vrai numéro (format international, sans le +)
const BOUTIQUE_EMAIL = "commandes@opticalize.bf"; // à remplacer par la vraie adresse

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(produitId, options = {}, quantite = 1) {
  const produit = PRODUITS.find((p) => p.id === produitId);
  if (!produit) return;
  const cart = getCart();
  const couleur = options.couleur || produit.couleur || null;
  const ligneExistante = cart.find((l) => l.id === produitId && l.couleur === couleur);
  if (ligneExistante) {
    ligneExistante.quantite += quantite;
  } else {
    cart.push({ id: produitId, couleur, quantite });
  }
  saveCart(cart);
  showToast(`${produit.nom} ajouté au panier`);
}

function removeLigne(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof renderPanier === "function") renderPanier();
}

function updateLigneQty(index, quantite) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].quantite = Math.max(1, quantite);
  saveCart(cart);
  if (typeof renderPanier === "function") renderPanier();
}

function cartLignesDetaillees() {
  return getCart()
    .map((ligne, index) => {
      const produit = PRODUITS.find((p) => p.id === ligne.id);
      if (!produit) return null;
      return { ...ligne, produit, index, sousTotal: produit.prix * ligne.quantite };
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartLignesDetaillees().reduce((sum, l) => sum + l.sousTotal, 0);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.quantite, 0);
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* Construit le message de commande (texte brut, réutilisé pour WhatsApp et e-mail) */
function buildMessageCommande(client) {
  const lignes = cartLignesDetaillees();
  let msg = `Nouvelle commande — Optic Alizé\n\n`;
  msg += `Client : ${client.nom}\nTéléphone : ${client.telephone}\n`;
  if (client.email) msg += `E-mail : ${client.email}\n`;
  if (client.magasin) msg += `Magasin souhaité : ${client.magasin}\n`;
  msg += `\nArticles :\n`;
  lignes.forEach((l) => {
    msg += `- ${l.produit.nom} x${l.quantite}${l.couleur ? ` (couleur ${l.couleur})` : ""} — ${formatFCFA(l.sousTotal)}\n`;
  });
  msg += `\nTotal : ${formatFCFA(cartTotal())}`;
  if (client.notes) msg += `\n\nNotes : ${client.notes}`;
  return msg;
}

function envoyerCommandeWhatsApp(client) {
  const texte = encodeURIComponent(buildMessageCommande(client));
  window.open(`https://wa.me/${BOUTIQUE_WHATSAPP}?text=${texte}`, "_blank");
}

function envoyerCommandeEmail(client) {
  const sujet = encodeURIComponent("Nouvelle commande — Optic Alizé");
  const corps = encodeURIComponent(buildMessageCommande(client));
  window.location.href = `mailto:${BOUTIQUE_EMAIL}?subject=${sujet}&body=${corps}`;
}

function showToast(texte) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = texte;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
