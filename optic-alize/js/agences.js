/* ============================================================
   OPTIC ALIZÉ — agences + carte (accueil, À propos, Contact)

   Pour AJOUTER ou MODIFIER une agence : édite le tableau AGENCES.

   Champs par agence :
     nom      : "Prestige"                    (obligatoire)
     ville    : "Ouagadougou"                 (obligatoire)
     adresse  : "Avenue Kwame N'Krumah…"      (obligatoire)
     tel      : ["70 21 63 63", "06 20 70 70"] (obligatoire)
     bientot  : "Ouverture en 2026"           (optionnel)
     carte    : "texte cherché sur Google Maps" (optionnel ; sinon
                déduit du nom + de la ville)

   Emplacements :
   - <div data-agences>…</div> : carte + boutons de ville + grille.
     <div data-agences="deroulant"> : carte + un déroulant par ville.
     <div data-agences="menu-mobile"> : grille sur ordinateur ; sur mobile,
       deux menus déroulants (ville, puis agence de cette ville).
     (le contenu du div sert de repli si JavaScript est désactivé).
   - <select data-agences-select> : liste déroulante des agences
     (pour un formulaire ; les agences pas encore ouvertes sont grisées).
   ============================================================ */

const AGENCES = [
  { nom: "Prestige", ville: "Ouagadougou", adresse: "Avenue Kwame N'Krumah, face à l'immeuble CORIS BANK.", tel: ["70 21 63 63", "06 20 70 70"] },
  { nom: "1200 Logements", ville: "Ouagadougou", adresse: "Immeuble el hadji SORE, au feu du rond-point, face à l'université Aube Nouvelle (ancien ISIG).", tel: ["71 24 41 70", "57 47 16 52"] },
  { nom: "Ouaga 2000", ville: "Ouagadougou", adresse: "Avenue de la Jeunesse (ex France Afrique), même alignement que UBA et ECOBANK.", tel: ["72 44 18 18"] },
  { nom: "Tampouy", ville: "Ouagadougou", adresse: "Route de Ouahigouya, sous l'immeuble du lycée privé la référence, face à l'agence SGBF et de l'alimentation bon samaritain.", tel: ["72 82 20 20", "57 47 16 53"] },
  { nom: "Bendogo", ville: "Ouagadougou", adresse: "Route de Fada, au feu du rond-point menant à Quatr Yaar, face pharmacie Hanahim.", tel: ["06 20 50 50"] },
  { nom: "Siao", ville: "Ouagadougou", adresse: "Bld de la circulaire, Immeuble NASSA, face au site du SIAO, sur l'alignement de Coris Bank.", tel: ["05 10 86 04"] },
  { nom: "Kalgondin", ville: "Ouagadougou", adresse: "Avenue des arts, même alignement que bon Samaritain.", tel: ["75 09 39 39"], bientot: "Ouverture en 2026" },
  { nom: "Ouaga Mall", ville: "Ouagadougou", adresse: "Rez-de-chaussée du Centre Commercial Ouaga Mall, à Ouaga 2000.", tel: ["44 41 42 43"] },
  { nom: "Gounghin", ville: "Ouagadougou", adresse: "Avenue Kadiogo, en face de SGBF Gounghin, même alignement que Vista Bank et la boutique DHC Outlet.", tel: ["77 19 05 05"] },
  { nom: "Saphir", ville: "Bobo-Dioulasso", adresse: "Rue Guillaume OUEDRAOGO, face à l'hôtel l'auberge.", tel: ["78 10 82 82", "57 47 16 51"] },
  { nom: "Koudougou", ville: "Koudougou", adresse: "Avenue Dreux, zone industrielle, près de UBA.", tel: ["72 32 46 46", "77 99 11 30"] },
];

const VILLES_AGENCES = ["Ouagadougou", "Bobo-Dioulasso", "Koudougou"];

(function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function telLien(t) {
    return "tel:+226" + t.replace(/\s+/g, "");
  }

  function requeteCarte(a) {
    return a.carte || "Optic Alizé Agence " + a.nom + ", " + a.ville + ", Burkina Faso";
  }

  function urlEmbed(q) {
    return "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
  }

  function urlItineraire(a) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(requeteCarte(a));
  }

  function carteAgence(a, i) {
    return (
      '<article class="agence-card" data-i="' + i + '" tabindex="0" role="button" aria-label="Voir l\'agence ' + esc(a.nom) + ' sur la carte">' +
      '<div class="agence-head"><h4>Agence ' + esc(a.nom) + "</h4>" +
      (a.bientot ? '<span class="agence-badge">' + esc(a.bientot) + "</span>" : "") +
      "</div>" +
      '<p class="agence-adr">' + esc(a.adresse) + "</p>" +
      '<p class="agence-tel">' +
      a.tel.map((t) => '<a href="' + telLien(t) + '">' + esc(t) + "</a>").join(" / ") +
      "</p>" +
      '<a class="agence-iti" href="' + urlItineraire(a) + '" target="_blank" rel="noopener">Itinéraire →</a>' +
      "</article>"
    );
  }

  function monter(conteneur) {
    const deroulant = conteneur.dataset.agences === "deroulant";
    const menuMobile = conteneur.dataset.agences === "menu-mobile";
    const chips =
      '<button type="button" class="agence-chip is-active" data-ville="">Toutes</button>' +
      VILLES_AGENCES.map((v) => '<button type="button" class="agence-chip" data-ville="' + esc(v) + '">' + esc(v) + "</button>").join("");

    const liste = deroulant
      ? '<div class="agences-villes">' +
        VILLES_AGENCES.map((v, k) => {
          const idx = AGENCES.map((a, i) => (a.ville === v ? i : -1)).filter((i) => i >= 0);
          return (
            '<details class="agences-ville" data-ville="' + esc(v) + '"' + (k === 0 ? " open" : "") + ">" +
            "<summary>" + esc(v) + ' <span class="agences-count">' + idx.length + (idx.length > 1 ? " agences" : " agence") + "</span></summary>" +
            '<div class="agences-grid">' + idx.map((i) => carteAgence(AGENCES[i], i)).join("") + "</div>" +
            "</details>"
          );
        }).join("") +
        "</div>"
      : '<div class="agences-chips" role="group" aria-label="Filtrer par ville">' + chips + "</div>" +
        '<div class="agences-grid">' + AGENCES.map(carteAgence).join("") + "</div>";

    const menus = menuMobile
      ? '<div class="agences-menu">' +
        '<label>Ville<select class="filter-select agences-sel-ville"><option value="">Choisir une ville…</option>' +
        VILLES_AGENCES.map((v) => '<option value="' + esc(v) + '">' + esc(v) + "</option>").join("") +
        "</select></label>" +
        '<label>Agence<select class="filter-select agences-sel-agence" disabled><option value="">Choisir d\'abord une ville</option></select></label>' +
        '<div class="agences-detail" aria-live="polite"></div>' +
        "</div>"
      : "";

    conteneur.innerHTML =
      '<div class="agences-loc">' +
      '<div class="map-embed"><iframe src="' + urlEmbed("Optic Alizé, Ouagadougou, Burkina Faso") + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Carte des agences Optic Alizé" allowfullscreen></iframe></div>' +
      (menuMobile ? '<div class="agences-desktop">' + liste + "</div>" + '<div class="agences-mobile">' + menus + "</div>" : liste) +
      "</div>";

    const iframe = conteneur.querySelector("iframe");
    const cartes = conteneur.querySelectorAll(".agence-card");

    function afficher(q) {
      const url = urlEmbed(q);
      if (iframe.src !== url) iframe.src = url;
    }

    function choisir(i) {
      cartes.forEach((c) => c.classList.toggle("is-active", Number(c.dataset.i) === i));
      afficher(requeteCarte(AGENCES[i]));
    }

    conteneur.querySelectorAll(".agences-ville").forEach((d) => {
      d.addEventListener("toggle", () => {
        if (d.open) {
          cartes.forEach((c) => c.classList.remove("is-active"));
          afficher("Optic Alizé, " + d.dataset.ville + ", Burkina Faso");
        }
      });
    });

    conteneur.querySelectorAll(".agence-chip").forEach((b) => {
      b.addEventListener("click", () => {
        const ville = b.dataset.ville;
        conteneur.querySelectorAll(".agence-chip").forEach((x) => x.classList.toggle("is-active", x === b));
        cartes.forEach((c) => {
          c.classList.remove("is-active");
          c.hidden = !!ville && AGENCES[Number(c.dataset.i)].ville !== ville;
        });
        afficher("Optic Alizé, " + (ville || "Ouagadougou") + ", Burkina Faso");
      });
    });

    if (menuMobile) {
      const selVille = conteneur.querySelector(".agences-sel-ville");
      const selAgence = conteneur.querySelector(".agences-sel-agence");
      const detail = conteneur.querySelector(".agences-detail");

      function montrer(i) {
        detail.innerHTML = i === null ? "" : carteAgence(AGENCES[i], i);
        const c = detail.querySelector(".agence-card");
        if (c) {
          c.removeAttribute("role");
          c.removeAttribute("tabindex");
          c.classList.add("is-active");
        }
        if (i !== null) afficher(requeteCarte(AGENCES[i]));
      }

      selVille.addEventListener("change", () => {
        const ville = selVille.value;
        selAgence.innerHTML = "";
        detail.innerHTML = "";
        if (!ville) {
          selAgence.disabled = true;
          selAgence.innerHTML = '<option value="">Choisir d\'abord une ville</option>';
          afficher("Optic Alizé, Ouagadougou, Burkina Faso");
          return;
        }
        const idx = AGENCES.map((a, i) => (a.ville === ville ? i : -1)).filter((i) => i >= 0);
        selAgence.disabled = false;
        selAgence.innerHTML =
          (idx.length > 1 ? '<option value="">Choisir une agence… (' + idx.length + ")</option>" : "") +
          idx.map((i) => '<option value="' + i + '">Agence ' + esc(AGENCES[i].nom) + "</option>").join("");
        afficher("Optic Alizé, " + ville + ", Burkina Faso");
        if (idx.length === 1) montrer(idx[0]);
      });

      selAgence.addEventListener("change", () => {
        montrer(selAgence.value === "" ? null : Number(selAgence.value));
      });
    }

    cartes.forEach((c) => {
      const i = Number(c.dataset.i);
      c.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        choisir(i);
        iframe.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      c.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === c) {
          e.preventDefault();
          choisir(i);
        }
      });
    });
  }

  function remplirSelect(sel) {
    VILLES_AGENCES.forEach((v) => {
      const groupe = document.createElement("optgroup");
      groupe.label = v;
      AGENCES.filter((a) => a.ville === v).forEach((a) => {
        const o = document.createElement("option");
        o.value = "Agence " + a.nom + " — " + a.ville;
        o.textContent = "Agence " + a.nom + (a.bientot ? " (" + a.bientot.toLowerCase() + ")" : "");
        if (a.bientot) o.disabled = true;
        groupe.appendChild(o);
      });
      sel.appendChild(groupe);
    });
  }

  document.querySelectorAll("[data-agences]").forEach(monter);
  document.querySelectorAll("select[data-agences-select]").forEach(remplirSelect);
})();
