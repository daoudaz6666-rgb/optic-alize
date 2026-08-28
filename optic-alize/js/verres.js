/* ============================================================
   OPTIC ALIZÉ — page "Nos verres"

   Pour AJOUTER / MODIFIER un type de verre : édite le tableau VERRES.

   Champs :
     titre  : "Verres progressifs"                (obligatoire)
     resume : "Description courte…"                (obligatoire)
     points : ["avantage 1", "avantage 2", …]      (optionnel)
     photo  : "verres/progressifs.jpg"             (optionnel ; sinon
                                                    visuel dégradé de repli)

   Photos : dossier "verres/", paysage 4:3 (~1000 x 750 px), < 150 Ko.
   ============================================================ */

const VERRES = [
  {
    titre: "Verres unifocaux",
    resume:
      "Une seule correction sur toute la surface du verre, pour la vision de loin ou de près. La solution la plus courante, disponible dans tous les indices.",
    points: ["Vision de loin ou de près", "Traitement antireflet inclus"],
    photo: "verres/unifocaux.jpg",
  },
  {
    titre: "Verres progressifs",
    resume:
      "Vision de loin, intermédiaire et de près dans un seul verre, sans démarcation visible. Idéals à partir de la presbytie pour tout voir sans changer de lunettes.",
    points: ["De loin au près en continu", "Adaptation personnalisée par l'opticien"],
    photo: "verres/progressifs.jpg",
  },
  {
    titre: "Verres anti-lumière bleue",
    resume:
      "Un filtre qui réduit la lumière bleue des écrans (téléphone, ordinateur, télévision) pour limiter la fatigue visuelle et l'inconfort en fin de journée.",
    points: ["Recommandés pour le travail sur écran", "Compatibles avec toutes les corrections"],
    photo: "verres/anti-lumiere-bleue.jpg",
  },
  {
    titre: "Verres photochromiques",
    resume:
      "Ils s'assombrissent automatiquement au soleil et redeviennent clairs à l'intérieur. Une seule paire pour le bureau, la rue et le plein soleil.",
    points: ["Foncent aux UV en quelques secondes", "Protection UV400 permanente"],
    photo: "verres/photochromiques.jpg",
  },
  {
    titre: "Verres polarisés",
    resume:
      "Ils suppriment les reflets éblouissants sur la route, l'eau ou les surfaces brillantes. Le confort maximal pour la conduite et les activités en extérieur.",
    points: ["Élimination de l'éblouissement", "Contraste et couleurs renforcés"],
    photo: "verres/polarises.jpg",
  },
  {
    titre: "Verres amincis (haut indice)",
    resume:
      "Pour les corrections fortes : des verres nettement plus fins et plus légers, plus esthétiques dans la monture et plus confortables à porter toute la journée.",
    points: ["Jusqu'à 40 % plus fins", "Idéals pour les fortes myopies et hypermétropies"],
    photo: "verres/amincis.jpg",
  },
  {
    titre: "Traitement antireflet & anti-rayures",
    resume:
      "Un traitement de surface qui supprime les reflets gênants (phares, écrans, photos) et durcit le verre contre les rayures du quotidien.",
    points: ["Vision plus nette, regard visible", "Verres plus faciles à nettoyer"],
    photo: "verres/antireflet.jpg",
  },
  {
    titre: "Verres teintés solaires",
    resume:
      "Vos verres correcteurs teintés dans la couleur de votre choix, avec protection UV400. La solution pour voir net au soleil sans lentilles ni surlunettes.",
    points: ["Teintes brune, grise, verte…", "Dégradés possibles"],
    photo: "verres/solaires.jpg",
  },
];

const VERRES_DEFAUT = JSON.parse(JSON.stringify(VERRES));

/* Surcharge possible depuis la page d'administration (localStorage). */
(function appliquerAdminVerres() {
  try {
    const o = JSON.parse(localStorage.getItem("optic-alize-admin-verres"));
    if (Array.isArray(o) && o.length) {
      VERRES.length = 0;
      o.forEach((v) => VERRES.push(v));
    }
  } catch (e) {}
})();

function carteVerre(v) {
  const media = v.photo
    ? `<img src="${v.photo}" alt="${v.titre}" loading="lazy"
         onerror="this.closest('.verre-media').classList.add('verre-media--fallback'); this.remove();">`
    : "";
  const points = (v.points || []).map((p) => `<li>${p}</li>`).join("");
  return `
    <article class="verre-card reveal">
      <div class="verre-media${v.photo ? "" : " verre-media--fallback"}">${media}</div>
      <div class="verre-body">
        <h2 class="verre-title">${v.titre}</h2>
        <p class="verre-resume">${v.resume}</p>
        ${points ? `<ul class="verre-points">${points}</ul>` : ""}
      </div>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const liste = document.getElementById("verres-liste");
  if (liste) liste.innerHTML = VERRES.map(carteVerre).join("");
});
