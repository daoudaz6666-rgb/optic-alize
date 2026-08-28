/* ============================================================
   OPTIC ALIZE - méga-menu "Optique" (2e niveau)

   Sur DESKTOP : au survol de « Optique » apparaît la barre de
   catégories (Montures, Lunettes de vue, …). Un CLIC sur une
   catégorie ouvre un grand panneau avec des colonnes de liens
   (par genre, par forme, marques, etc.) + une image.

   Sur MOBILE : « Optique » se déplie en accordéon, les catégories
   sont de simples liens (pas de 2e niveau).

   Pour modifier le contenu : édite l'objet MEGA ci-dessous.
   ============================================================ */

(function () {
  "use strict";

  // petits pictogrammes de formes de montures
  var SHAPES = {
    ovale: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="11" cy="10" rx="8" ry="6"/><ellipse cx="29" cy="10" rx="8" ry="6"/><path d="M19 9h2"/></svg>',
    carre: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="15" height="13" rx="3"/><rect x="22" y="4" width="15" height="13" rx="3"/><path d="M18 9h4"/></svg>',
    ronde: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="10" r="7"/><circle cx="29" cy="10" r="7"/><path d="M18 10h4"/></svg>',
    papillon: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6 Q10 2 18 8 Q10 16 3 13 Z"/><path d="M37 6 Q30 2 22 8 Q30 16 37 13 Z"/><path d="M18 8h4"/></svg>',
    pilote: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 8 Q3 4 11 4 Q19 4 18 10 Q17 16 10 16 Q3 16 3 8Z"/><path d="M22 8 Q22 4 30 4 Q38 4 37 10 Q36 16 29 16 Q22 16 22 8Z"/><path d="M18 7h4"/></svg>',
  };

  var MEGA = {
    montures: {
      tout: ["Voir toutes les montures", "montures.html"],
      cols: [
        { t: "Par genre", l: [["Femme", "montures.html?genre=femme"], ["Homme", "montures.html?genre=homme"], ["Enfant", "montures.html?genre=enfant"]] },
        { t: "Par forme", shapes: 1, l: [["Ovale", "montures.html?forme=ovale"], ["Carrée", "montures.html?forme=carre"], ["Ronde", "montures.html?forme=ronde"], ["Papillon", "montures.html?forme=papillon"], ["Pilote", "montures.html?forme=pilote"]] },
        { t: "Nos marques", l: [["Optic Alizé", "montures.html"], ["Ray-Ban", "montures.html"], ["Gucci", "montures.html"], ["Hugo Boss", "montures.html"], ["Cartier", "montures.html"], ["Chloé", "montures.html"], ["Persol", "montures.html"], ["Marc Jacobs", "montures.html"]] },
        { t: "Et aussi", l: [["Comment choisir sa monture", "conseils.html"], ["Nos verres correcteurs", "verres.html"], ["Lunettes de soleil", "montures.html?type=soleil"], ["Prendre rendez-vous", "rendez-vous.html"]] },
      ],
      img: ["univers-vue.jpg", "Nos montures pour toute la famille"],
    },
    vue: {
      tout: ["Voir les lunettes de vue", "montures.html?type=vue"],
      cols: [
        { t: "Par genre", l: [["Femme", "montures.html?type=vue&genre=femme"], ["Homme", "montures.html?type=vue&genre=homme"], ["Enfant", "montures.html?type=vue&genre=enfant"]] },
        { t: "Par forme", shapes: 1, l: [["Ovale", "montures.html?type=vue&forme=ovale"], ["Carrée", "montures.html?type=vue&forme=carre"], ["Ronde", "montures.html?type=vue&forme=ronde"], ["Papillon", "montures.html?type=vue&forme=papillon"]] },
        { t: "Vos verres", l: [["Verres unifocaux", "verres.html"], ["Verres progressifs", "verres.html"], ["Anti-lumière bleue", "verres.html"], ["Verres amincis", "verres.html"]] },
        { t: "Et aussi", l: [["Examen de vue offert", "rendez-vous.html"], ["Les types de verres", "verres.html"], ["Nos conseils", "conseils.html"]] },
      ],
      img: ["univers-vue.jpg", "Lunettes de vue"],
    },
    soleil: {
      tout: ["Voir les lunettes de soleil", "montures.html?type=soleil"],
      cols: [
        { t: "Par genre", l: [["Femme", "montures.html?type=soleil&genre=femme"], ["Homme", "montures.html?type=soleil&genre=homme"], ["Enfant", "montures.html?type=soleil&genre=enfant"]] },
        { t: "Par forme", shapes: 1, l: [["Papillon", "montures.html?type=soleil&forme=papillon"], ["Pilote", "montures.html?type=soleil&forme=pilote"], ["Carrée", "montures.html?type=soleil&forme=carre"], ["Ronde", "montures.html?type=soleil&forme=ronde"]] },
        { t: "Protection", l: [["Verres polarisés", "verres.html"], ["Verres teintés", "verres.html"], ["Protection UV400", "verres.html"]] },
        { t: "Et aussi", l: [["Solaires à votre vue", "montures.html?type=soleil"], ["Nos offres solaires", "offres.html"], ["Nos conseils", "conseils.html"]] },
      ],
      img: ["univers-soleil.jpg", "Lunettes de soleil"],
    },
    verres: {
      tout: ["Tout savoir sur nos verres", "verres.html"],
      cols: [
        { t: "Corrections", l: [["Verres unifocaux", "verres.html"], ["Verres progressifs", "verres.html"], ["Verres amincis", "verres.html"]] },
        { t: "Traitements", l: [["Anti-lumière bleue", "verres.html"], ["Antireflet & anti-rayures", "verres.html"], ["Photochromiques", "verres.html"], ["Polarisés", "verres.html"], ["Teintés solaires", "verres.html"]] },
        { t: "Et aussi", l: [["Comment choisir ses verres", "verres.html"], ["Entretien des verres", "conseils.html"], ["Prendre rendez-vous", "rendez-vous.html"]] },
      ],
      img: ["univers-lentilles.jpg", "Le verre fait la moitié de vos lunettes"],
    },
    lentilles: {
      tout: ["Voir les lentilles", "lentilles.html"],
      cols: [
        { t: "Par fréquence", l: [["Journalières", "lentilles.html?frequence=journaliere"], ["Mensuelles", "lentilles.html?frequence=mensuelle"]] },
        { t: "Par correction", l: [["Myopie", "lentilles.html?correction=myopie"], ["Hypermétropie", "lentilles.html?correction=hypermetropie"], ["Astigmatie", "lentilles.html?correction=astigmatie"], ["Presbytie", "lentilles.html?correction=presbytie"]] },
        { t: "Et aussi", l: [["Adaptation de lentilles", "rendez-vous.html"], ["Entretien des lentilles", "conseils.html"], ["Nous contacter", "contact.html"]] },
      ],
      img: ["univers-lentilles.jpg", "Lentilles de contact"],
    },
    connectees: {
      tout: ["Découvrir les lunettes connectées", "connectees.html"],
      cols: [
        { t: "Types", l: [["Lunettes audio", "connectees.html"], ["Montures compatibles", "connectees.html"], ["Sur commande", "connectees.html"]] },
        { t: "À votre vue", l: [["Verres unifocaux", "verres.html"], ["Verres progressifs", "verres.html"], ["Anti-lumière bleue", "verres.html"]] },
        { t: "Et aussi", l: [["Prendre rendez-vous", "rendez-vous.html"], ["Nos conseils", "conseils.html"], ["Nous contacter", "contact.html"]] },
      ],
      img: ["univers-soleil.jpg", "Des lunettes qui font plus que voir"],
    },
    accessoires: {
      tout: ["Voir tous les accessoires", "accessoires.html"],
      cols: [
        { t: "Protection", l: [["Étuis & boîtes rigides", "accessoires.html"], ["Cordons & chaînes", "accessoires.html"]] },
        { t: "Nettoyage", l: [["Spray nettoyant", "accessoires.html"], ["Chiffons microfibre", "accessoires.html"], ["Lingettes nettoyantes", "accessoires.html"]] },
        { t: "Entretien", l: [["Kit de réparation", "accessoires.html"], ["Réglages en agence", "contact.html"], ["Nos conseils d'entretien", "conseils.html"]] },
      ],
      img: ["univers-lentilles.jpg", "Protégez et entretenez vos lunettes"],
    },
    offres: {
      tout: ["Voir toutes les offres", "offres.html"],
      cols: [
        { t: "En ce moment", l: [["Pack Duo : 2ᵉ paire offerte", "offres.html"], ["Jours Prestiges −50 %", "offres.html"], ["Test visuel gratuit", "offres.html"]] },
        { t: "Services inclus", l: [["Réglages gratuits à vie", "contact.html"], ["Réparations rapides", "contact.html"], ["Nettoyage professionnel", "contact.html"]] },
        { t: "Et aussi", l: [["Nos conseils", "conseils.html"], ["Nos actualités", "actualites.html"], ["Prendre rendez-vous", "rendez-vous.html"]] },
      ],
      img: ["univers-soleil.jpg", "Nos offres du moment"],
    },
  };

  function lienListe(col) {
    return (
      '<div class="mega2-col">' +
      '<h4>' + col.t + "</h4>" +
      '<ul>' +
      col.l.map(function (x) {
        var forme = "";
        if (col.shapes) {
          var key = /forme=(\w+)/.exec(x[1]);
          if (key && SHAPES[key[1]]) forme = '<span class="mega2-shape">' + SHAPES[key[1]] + "</span>";
        }
        return "<li>" + forme + '<a href="' + x[1] + '">' + x[0] + "</a></li>";
      }).join("") +
      "</ul></div>"
    );
  }

  function renduPanneau(cat) {
    var d = MEGA[cat];
    if (!d) return "";
    return (
      '<div class="container mega2-inner">' +
      '<div class="mega2-cols">' +
      d.cols.map(lienListe).join("") +
      "</div>" +
      '<a class="mega2-media" href="' + d.tout[1] + '">' +
      '<img src="' + d.img[0] + '" alt="" loading="lazy">' +
      "<span>" + d.img[1] + "</span>" +
      '<span class="mega2-all">' + d.tout[0] + " &rarr;</span>" +
      "</a>" +
      "</div>"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var megaItem = document.getElementById("nav-optique");
    var panel = document.getElementById("mega2");
    var navSub = megaItem && megaItem.querySelector(".nav-sub");
    if (!megaItem || !panel || !navSub) return;

    var tabs = megaItem.querySelectorAll(".nav-sub-tab");
    var mqMobile = window.matchMedia("(max-width: 980px)");
    var actif = null;
    var fermeTimer;

    function ferme() {
      navSub.classList.remove("mega2-on");
      tabs.forEach(function (t) { t.classList.remove("open"); });
      actif = null;
    }
    function ouvre(cat, tab) {
      clearTimeout(fermeTimer);
      if (actif === cat) return;
      panel.innerHTML = renduPanneau(cat);
      navSub.classList.add("mega2-on");
      tabs.forEach(function (t) { t.classList.toggle("open", t === tab); });
      actif = cat;
    }

    tabs.forEach(function (tab) {
      // desktop : le contenu s'affiche au survol de l'onglet
      tab.addEventListener("mouseenter", function () {
        if (!mqMobile.matches) ouvre(tab.dataset.cat, tab);
      });
      tab.addEventListener("focus", function () {
        if (!mqMobile.matches) ouvre(tab.dataset.cat, tab);
      });
      // le clic navigue normalement (mobile comme desktop)
    });

    // se referme quand on quitte tout le menu Optique
    megaItem.addEventListener("mouseleave", function () {
      if (mqMobile.matches) return;
      fermeTimer = setTimeout(ferme, 180);
    });
    megaItem.addEventListener("mouseenter", function () {
      clearTimeout(fermeTimer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") ferme();
    });
  });
})();
