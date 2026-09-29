/* ============================================================
   OPTIC ALIZÉ — partenaires assurance (bandeau défilant de l'accueil,
   juste en dessous du bandeau "Nos partenaires")

   Édite le tableau ASSURANCES ci-dessous, même principe que
   js/partenaires.js.
   Champs par partenaire :
     nom  : "Nom de l'assureur"              (obligatoire — sert aussi de texte de repli)
     logo : "assurances/nom-assureur.jpg"    (optionnel ; sinon le nom s'affiche en texte)

   Dépose les fichiers logo dans le dossier assurances/ (à créer),
   au format carré/rectangulaire sur fond blanc ou transparent,
   comme les logos dans partners/.

   Tant que ASSURANCES est vide, tout le bloc (titre + bandeau) reste
   masqué automatiquement — pas besoin de commenter le HTML en
   attendant les logos.
   ============================================================ */

const ASSURANCES = [
  // { nom: "Nom de l'assureur", logo: "assurances/nom-assureur.jpg" },
];

function elementAssurance(a) {
  const contenu = a.logo
    ? `<img src="${a.logo}" alt="${a.nom}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${a.nom}'}))">`
    : `<span>${a.nom}</span>`;
  return `<div class="partner-item">${contenu}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const bloc = document.getElementById("assurances-bloc");
  const row = document.getElementById("assurances-row-1");
  if (!bloc || !row) return;
  if (!ASSURANCES.length) {
    bloc.style.display = "none";
    return;
  }
  const groupe = ASSURANCES.map(elementAssurance).join("");
  // répété pour remplir l'écran + boucle sans couture (l'animation décale de 50 %)
  row.innerHTML = groupe.repeat(4);
});
