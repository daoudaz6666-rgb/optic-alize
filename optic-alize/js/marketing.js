/* ============================================================
   OPTIC ALIZÉ — marketing & relation client
   Chargé sur toutes les pages publiques (après widgets.js).

   Tout est côté navigateur (localStorage) + relais WhatsApp.
   Rien n'est envoyé à un serveur.

   ▼▼▼  RÉGLAGES — modifiez librement  ▼▼▼
   ============================================================ */
const MKT = {
  /* Adresse publique du site (pour le partage sur Facebook / WhatsApp). */
  siteUrl: "https://www.opticalize.com",

  /* Barre d'annonce en haut de page. Mettre actif:false pour la masquer. */
  annonce: {
    actif: true,
    texte: "Jours Prestiges : jusqu'à −50 % sur les montures de marques",
    lienLabel: "En profiter",
    lien: "offres.html",
    /* Change cette valeur (ex. \"2026-09\") pour ré-afficher la barre à tous. */
    version: "2026-09",
  },

  /* Pop-up de bienvenue (1ʳᵉ visite). */
  popup: {
    actif: true,
    delaiSecondes: 12,
    titre: "Bienvenue chez Optic Alizé",
    texte:
      "Inscrivez-vous et recevez <strong>−10 % sur votre première paire</strong>, plus nos offres en avant-première.",
    code: "BIENVENUE10",
    version: "2026-09",
  },

  /* Identifiants d'analyse (laisser vide = aucun suivi tiers). */
  ga4Id: "", // ex. "G-XXXXXXX"
  metaPixelId: "", // ex. "123456789012345"

  /* Avis clients affichés sur l'accueil. */
  avis: [
    { nom: "Aminata O.", ville: "Ouagadougou", texte: "Accueil très professionnel, on m'a bien expliqué le choix des verres. Mes lunettes étaient prêtes en 48h." },
    { nom: "Boureima S.", ville: "Bobo-Dioulasso", texte: "Large choix de montures et des prix corrects. L'opticien a pris le temps d'ajuster parfaitement." },
    { nom: "Fatoumata D.", ville: "Koudougou", texte: "J'ai profité du Pack Duo : deux paires, une pour le bureau, une pour le soleil. Très satisfaite." },
    { nom: "Issa K.", ville: "Ouagadougou", texte: "Test de vue rapide et sérieux. Le suivi après-vente est un vrai plus, ils règlent mes lunettes gratuitement." },
  ],
  /* Lien vers votre fiche Google pour laisser un avis (facultatif). */
  avisGoogleUrl: "",
};
/* ▲▲▲  fin des réglages  ▲▲▲ */

(function () {
  const WA = (typeof WA_NUMERO !== "undefined" && WA_NUMERO) || "22675093939";
  const wa = (txt) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(txt || "Bonjour Optic Alizé,");
  const page = location.pathname.split("/").pop() || "index.html";
  const lire = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const enrEmail = (email, src) =>
    typeof enregistrerEmail === "function" ? enregistrerEmail(email, src) : /.+@.+\..+/.test(email);

  /* ---------- Suivi local des clics (pour la page admin) ---------- */
  function trackClic(type) {
    try {
      const KEY = "optic-alize-stats";
      const s = JSON.parse(localStorage.getItem(KEY)) || {};
      s.clics = s.clics || {};
      s.clics[type] = (s.clics[type] || 0) + 1;
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const h = a.getAttribute("href");
      if (/wa\.me|api\.whatsapp|whatsapp:/.test(h)) trackClic("whatsapp");
      else if (h.startsWith("tel:")) trackClic("telephone");
      else if (h.startsWith("mailto:")) trackClic("email");
      else if (/rendez-vous\.html|contact\.html\?tab=rdv/.test(h)) trackClic("rendez-vous");
    },
    true
  );

  /* ---------- Analyse tierce (si configurée) ---------- */
  if (MKT.ga4Id) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + MKT.ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MKT.ga4Id);
  }
  if (MKT.metaPixelId) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", MKT.metaPixelId);
    window.fbq("track", "PageView");
    /* eslint-enable */
  }

  /* ---------- Données structurées (SEO / partage Google) ---------- */
  (function schema() {
    const data = {
      "@context": "https://schema.org",
      "@type": "Optician",
      name: "Optic Alizé",
      description: "Réseau d'opticiens au Burkina Faso : montures, lunettes de soleil et lentilles de contact.",
      url: MKT.siteUrl,
      telephone: "+22675093939",
      email: "contact@opticalize.bf",
      image: MKT.siteUrl + "/hero-poster.jpg",
      areaServed: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Burkina Faso"],
      address: { "@type": "PostalAddress", addressCountry: "BF", addressLocality: "Ouagadougou" },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00", closes: "19:00",
      }],
      sameAs: ["https://www.facebook.com/optic.alize", "https://www.instagram.com/optic.alize"],
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  })();

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------- 1. Barre d'annonce ---------- */
    if (MKT.annonce.actif && lire("optic-alize-annonce", "") !== MKT.annonce.version) {
      const bar = document.createElement("div");
      bar.className = "promo-bar";
      bar.innerHTML =
        '<div class="container promo-bar-in">' +
        "<span>" + MKT.annonce.texte + "</span>" +
        (MKT.annonce.lien ? ' <a href="' + MKT.annonce.lien + '">' + MKT.annonce.lienLabel + " →</a>" : "") +
        '<button class="promo-bar-x" type="button" aria-label="Fermer">&times;</button>' +
        "</div>";
      document.body.insertBefore(bar, document.body.firstChild);
      document.body.classList.add("has-promo-bar");
      bar.querySelector(".promo-bar-x").addEventListener("click", () => {
        bar.remove();
        document.body.classList.remove("has-promo-bar");
        ecrire("optic-alize-annonce", MKT.annonce.version);
      });
    }

    /* ---------- 2. Pop-up de bienvenue ---------- */
    if (MKT.popup.actif && lire("optic-alize-popup", "") !== MKT.popup.version) {
      let affiche = false;
      const montrer = () => {
        if (affiche) return;
        affiche = true;
        const ov = document.createElement("div");
        ov.className = "mkt-popup-ov";
        ov.innerHTML =
          '<div class="mkt-popup" role="dialog" aria-modal="true" aria-labelledby="mkt-popup-t">' +
          '<button class="mkt-popup-x" type="button" aria-label="Fermer">&times;</button>' +
          '<h3 id="mkt-popup-t">' + MKT.popup.titre + "</h3>" +
          "<p>" + MKT.popup.texte + "</p>" +
          '<form class="mkt-popup-form">' +
          '<input type="email" required placeholder="votre@email.com" aria-label="Adresse e-mail">' +
          "<button type=\"submit\">Je m'inscris</button>" +
          "</form>" +
          '<p class="mkt-popup-msg" hidden></p>' +
          '<a class="mkt-popup-wa" href="' + wa("Bonjour Optic Alizé, je voudrais en savoir plus sur vos offres.") + '" target="_blank" rel="noopener">ou discuter sur WhatsApp</a>' +
          "</div>";
        document.body.appendChild(ov);
        const fermer = () => { ov.remove(); ecrire("optic-alize-popup", MKT.popup.version); };
        ov.querySelector(".mkt-popup-x").addEventListener("click", fermer);
        ov.addEventListener("click", (e) => { if (e.target === ov) fermer(); });
        ov.querySelector(".mkt-popup-form").addEventListener("submit", (e) => {
          e.preventDefault();
          const email = e.target.querySelector("input").value;
          const msg = ov.querySelector(".mkt-popup-msg");
          const ok = enrEmail(email, "popup");
          msg.hidden = false;
          if (ok) {
            trackClic("inscription-popup");
            e.target.hidden = true;
            msg.className = "mkt-popup-msg ok";
            msg.innerHTML = "Merci ! Votre code : <strong>" + MKT.popup.code +
              "</strong><br>À présenter en agence pour −10 % sur votre première paire.";
          } else {
            msg.className = "mkt-popup-msg err";
            msg.textContent = "Adresse e-mail invalide.";
          }
        });
      };
      setTimeout(montrer, MKT.popup.delaiSecondes * 1000);
      const onScroll = () => {
        const p = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        if (p > 0.4) { montrer(); window.removeEventListener("scroll", onScroll); }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------- 3. Rappel de contrôle de vue (pied de page) ---------- */
    const footer = document.querySelector(".site-footer .container");
    if (footer && !document.querySelector(".reminder-card")) {
      const card = document.createElement("div");
      card.className = "reminder-card";
      card.innerHTML =
        "<h4>Pensez à votre prochain contrôle</h4>" +
        "<p>Laissez votre e-mail : nous vous rappelons quand il sera temps de refaire un examen de vue.</p>" +
        '<form class="reminder-form">' +
        '<input type="email" required placeholder="votre@email.com" aria-label="E-mail">' +
        '<select aria-label="Délai">' +
        '<option value="6">Dans 6 mois</option>' +
        '<option value="12" selected>Dans 1 an</option>' +
        '<option value="24">Dans 2 ans</option>' +
        "</select>" +
        "<button type=\"submit\">M'inscrire au rappel</button>" +
        "</form>" +
        '<p class="reminder-msg" hidden></p>';
      footer.appendChild(card);
      card.querySelector(".reminder-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        const email = f.querySelector("input").value.trim().toLowerCase();
        const mois = parseInt(f.querySelector("select").value, 10);
        const msg = card.querySelector(".reminder-msg");
        if (!/.+@.+\..+/.test(email)) {
          msg.hidden = false; msg.className = "reminder-msg err"; msg.textContent = "Adresse e-mail invalide.";
          return;
        }
        const d = new Date();
        d.setMonth(d.getMonth() + mois);
        const liste = lire("optic-alize-rappels", []);
        liste.push({ email, echeance: d.toISOString().slice(0, 10), cree: new Date().toISOString().slice(0, 10) });
        ecrire("optic-alize-rappels", liste);
        enrEmail(email, "rappel-vue");
        trackClic("rappel-vue");
        f.hidden = true;
        msg.hidden = false; msg.className = "reminder-msg ok";
        msg.textContent = "C'est noté. Nous vous écrirons vers " +
          d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) + ".";
      });
    }

    /* ---------- 4. Accueil : avis clients + parrainage ---------- */
    if (page === "index.html" || page === "") {
      const ancre = document.querySelector(".site-footer");
      if (ancre && MKT.avis.length && !document.querySelector(".testimonials")) {
        const sec = document.createElement("section");
        sec.className = "testimonials";
        sec.innerHTML =
          '<div class="container">' +
          '<div class="section-head section-head--center"><span class="eyebrow">Ils nous font confiance</span><h2>Avis de nos clients</h2></div>' +
          '<div class="testi-grid">' +
          MKT.avis.map((a) =>
            '<figure class="testi-card">' +
            '<div class="testi-stars">★★★★★</div>' +
            "<blockquote>" + a.texte + "</blockquote>" +
            "<figcaption>" + a.nom + " · <span>" + a.ville + "</span></figcaption>" +
            "</figure>"
          ).join("") +
          "</div>" +
          (MKT.avisGoogleUrl
            ? '<p class="testi-cta"><a class="btn btn-outline" href="' + MKT.avisGoogleUrl + '" target="_blank" rel="noopener">Laisser un avis</a></p>'
            : "") +
          "</div>";
        ancre.parentNode.insertBefore(sec, ancre);

        const refTexte =
          "Bonjour Optic Alizé, je souhaite parrainer un proche. " +
          "Voici comment ça marche : partagez ce message à la personne, elle le présente en agence.";
        const ref = document.createElement("section");
        ref.className = "referral";
        ref.innerHTML =
          '<div class="container referral-in">' +
          "<div><span class=\"eyebrow\">Parrainage</span>" +
          "<h2>Parrainez un proche</h2>" +
          "<p>Votre filleul repart avec un avantage sur sa première paire, et vous aussi lors de votre prochaine visite. Il suffit de le recommander.</p></div>" +
          '<a class="btn btn-primary" href="' + wa(refTexte) + '" target="_blank" rel="noopener">Parrainer sur WhatsApp</a>' +
          "</div>";
        ancre.parentNode.insertBefore(ref, ancre);
      }
    }

    /* ---------- 5. Partage social (offres / conseils / actualités) ---------- */
    if (/^(offres|conseils|actualites)\.html$/.test(page)) {
      const cible = document.querySelector(".page-header, main, .container");
      if (cible && !document.querySelector(".share-row")) {
        const url = MKT.siteUrl + "/" + page;
        const t = document.title;
        const row = document.createElement("div");
        row.className = "container share-row";
        row.innerHTML =
          "<span>Partager :</span>" +
          '<a href="https://wa.me/?text=' + encodeURIComponent(t + " " + url) + '" target="_blank" rel="noopener">WhatsApp</a>' +
          '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '" target="_blank" rel="noopener">Facebook</a>' +
          '<button type="button" data-copy>Copier le lien</button>';
        const ph = document.querySelector(".page-header");
        if (ph) ph.after(row); else cible.prepend(row);
        row.querySelector("[data-copy]").addEventListener("click", (e) => {
          navigator.clipboard && navigator.clipboard.writeText(url);
          e.target.textContent = "Lien copié ✓";
        });
      }
    }
  });
})();
