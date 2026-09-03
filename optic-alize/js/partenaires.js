/* ============================================================
   OPTIC ALIZÉ — partenaires (bandeau défilant de l'accueil)

   Édite le tableau PARTENAIRES ci-dessous.
   Champs par partenaire :
     nom  : "Ray-Ban"                  (obligatoire — sert aussi de texte de repli)
     logo : "partners/ray-ban.jpg"     (optionnel ; sinon le nom s'affiche en texte)

   ⚠️ N'affiche que des logos que tu es autorisé à utiliser
   (marques réellement distribuées en agence).

   Le bandeau se dédouble tout seul pour un défilement sans couture.
   Une seule ligne.
   ============================================================ */

const PARTENAIRES = [
  { nom: "Ray-Ban", logo: "partners/ray-ban.jpg" },
  { nom: "Gucci", logo: "partners/gucci.jpg" },
  { nom: "Cartier", logo: "partners/cartier.jpg" },
  { nom: "Christian Dior", logo: "partners/dior.jpg" },
  { nom: "Burberry", logo: "partners/burberry.jpg" },
  { nom: "Hugo Boss", logo: "partners/hugo-boss.jpg" },
  { nom: "Marc Jacobs", logo: "partners/marc-jacobs.jpg" },
  { nom: "Hermès", logo: "partners/hermes.jpg" },
  { nom: "Maybach", logo: "partners/maybach.jpg" },
];

function elementPartenaire(p) {
  const contenu = p.logo
    ? `<img src="${p.logo}" alt="${p.nom}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.nom}'}))">`
    : `<span>${p.nom}</span>`;
  return `<div class="partner-item">${contenu}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const row = document.getElementById("partners-row-1");
  if (!row) return;
  const groupe = PARTENAIRES.map(elementPartenaire).join("");
  // répété pour remplir l'écran + boucle sans couture (l'animation décale de 50 %)
  row.innerHTML = groupe.repeat(4);
});
