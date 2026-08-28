/* ============================================================
   OPTIC ALIZÉ — partenaires (bandeau défilant de l'accueil)

   Édite le tableau PARTENAIRES ci-dessous.
   Champs par partenaire :
     nom  : "Essilor"                     (obligatoire — sert aussi de texte de repli)
     logo : "partenaires/essilor.svg"     (optionnel ; PNG ou SVG, fond transparent,
                                            hauteur ~40 px ; sinon le nom s'affiche en texte)

   ⚠️ Remplace ces noms par tes VRAIS partenaires (fournisseurs de
   verres, marques de montures, labos lentilles…) et n'affiche que
   des logos que tu es autorisé à utiliser.

   Le bandeau se dédouble tout seul pour un défilement sans couture ;
   la 1re ligne va vers la gauche, la 2e vers la droite.
   ============================================================ */

const PARTENAIRES = [
  { nom: "Essilor" },
  { nom: "ZEISS" },
  { nom: "Hoya" },
  { nom: "Transitions" },
  { nom: "Varilux" },
  { nom: "Rodenstock" },
  { nom: "Acuvue" },
  { nom: "CooperVision" },
  { nom: "Bausch + Lomb" },
  { nom: "Alcon" },
  { nom: "Ray-Ban" },
  { nom: "Persol" },
];

function elementPartenaire(p) {
  const contenu = p.logo
    ? `<img src="${p.logo}" alt="${p.nom}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.nom}'}))">`
    : `<span>${p.nom}</span>`;
  return `<div class="partner-item">${contenu}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const r1 = document.getElementById("partners-row-1");
  const r2 = document.getElementById("partners-row-2");
  if (!r1 || !r2) return;

  const milieu = Math.ceil(PARTENAIRES.length / 2);
  const groupe1 = PARTENAIRES.slice(0, milieu).map(elementPartenaire).join("");
  const groupe2 = PARTENAIRES.slice(milieu).map(elementPartenaire).join("");

  // répété pour remplir l'écran + boucle sans couture (l'animation décale de 50 %)
  r1.innerHTML = groupe1.repeat(4);
  r2.innerHTML = groupe2.repeat(4);
});
