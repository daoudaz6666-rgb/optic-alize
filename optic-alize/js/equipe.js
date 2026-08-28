/* ============================================================
   OPTIC ALIZÉ — équipe (page À propos)

   Pour AJOUTER ou MODIFIER un membre : édite simplement les
   tableaux CADRES et OPTICIENS ci-dessous.

   Champs par personne :
     nom      : "Prénom NOM"                 (obligatoire)
     fonction : "Directeur général"           (obligatoire)
     ville    : "Ouagadougou"                 (optionnel)
     photo    : "equipe/prenom-nom.jpg"       (optionnel ; sinon
                les initiales s'affichent dans un rond)

   Photos : dépose-les dans le dossier "equipe/", format carré
   (400 x 400 px conseillé), < 120 Ko.
   ============================================================ */

const CADRES = [
  { nom: "Prénom NOM", fonction: "Directeur général" },
  { nom: "Prénom NOM", fonction: "Directrice administrative et financière" },
  { nom: "Prénom NOM", fonction: "Responsable réseau & exploitation" },
  { nom: "Prénom NOM", fonction: "Responsable commercial & marketing" },
  { nom: "Prénom NOM", fonction: "Responsable approvisionnement" },
];

const OPTICIENS = [
  { nom: "Prénom NOM", fonction: "Opticien-optométriste", ville: "Ouagadougou" },
  { nom: "Prénom NOM", fonction: "Opticien-optométriste", ville: "Ouagadougou" },
  { nom: "Prénom NOM", fonction: "Opticien-optométriste", ville: "Bobo-Dioulasso" },
  { nom: "Prénom NOM", fonction: "Opticien-optométriste", ville: "Koudougou" },
];

function initiales(nom) {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0])
    .join("")
    .toUpperCase();
}

function carteMembre(m) {
  const media = m.photo
    ? `<img class="team-avatar" src="${m.photo}" alt="${m.nom}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'team-avatar team-avatar--initials',textContent:'${initiales(m.nom)}'}))">`
    : `<div class="team-avatar team-avatar--initials">${initiales(m.nom)}</div>`;
  return `
    <div class="team-card reveal">
      ${media}
      <div class="team-info">
        <span class="team-name">${m.nom}</span>
        <span class="team-role">${m.fonction}</span>
        ${m.ville ? `<span class="team-city">${m.ville}</span>` : ""}
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const cadres = document.getElementById("equipe-cadres");
  const opticiens = document.getElementById("equipe-opticiens");
  if (cadres) cadres.innerHTML = CADRES.map(carteMembre).join("");
  if (opticiens) opticiens.innerHTML = OPTICIENS.map(carteMembre).join("");
});
