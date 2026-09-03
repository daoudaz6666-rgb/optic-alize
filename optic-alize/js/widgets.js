/* ============================================================
   OPTIC ALIZÉ — widgets communs à toutes les pages publiques
   - Bouton "retour en haut"
   - Chatbox (assistant + relais WhatsApp)
   - Comptage anonyme des visites (localStorage, pour la page admin)
   - Formulaire newsletter injecté dans le pied de page

   ⚠️ Démo : tout est stocké dans le navigateur du visiteur
   (localStorage). Aucune donnée n'est envoyée à un serveur.
   ============================================================ */

const WA_NUMERO = "22675093939"; // numéro WhatsApp Optic Alizé (format international, sans +)

/* ---------- 1. Comptage des visites ---------- */
(function trackVisite() {
  try {
    const KEY = "optic-alize-stats";
    const stats = JSON.parse(localStorage.getItem(KEY)) || {
      vues: 0,
      pages: {},
      jours: {},
      sessions: 0,
      premiere: null,
      derniere: null,
    };
    const page = location.pathname.split("/").pop() || "index.html";
    const jour = new Date().toISOString().slice(0, 10);
    stats.vues += 1;
    stats.pages[page] = (stats.pages[page] || 0) + 1;
    stats.jours[jour] = (stats.jours[jour] || 0) + 1;
    stats.premiere = stats.premiere || new Date().toISOString();
    stats.derniere = new Date().toISOString();
    if (!sessionStorage.getItem("optic-alize-session-vue")) {
      stats.sessions += 1;
      sessionStorage.setItem("optic-alize-session-vue", "1");
    }
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch (e) {}
})();

/* ---------- 2. Enregistrement d'un e-mail (newsletter / chat) ---------- */
function enregistrerEmail(email, source) {
  email = String(email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;
  try {
    const KEY = "optic-alize-newsletter";
    const liste = JSON.parse(localStorage.getItem(KEY)) || [];
    if (!liste.some((e) => e.email === email)) {
      liste.push({ email, source: source || "newsletter", date: new Date().toISOString().slice(0, 10) });
      localStorage.setItem(KEY, JSON.stringify(liste));
    }
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- Statut d'ouverture (Lun–Sam 8h–19h) ---------- */
const HORAIRES = { ouverture: 8, fermeture: 19 }; // heures, du lundi (1) au samedi (6)
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function heureOuaga() {
  try {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Ouagadougou" }));
  } catch (e) {
    return new Date();
  }
}

function statutBoutique(d) {
  d = d || heureOuaga();
  const j = d.getDay();
  const h = d.getHours() + d.getMinutes() / 60;
  const ouvre = j >= 1 && j <= 6;
  const ouvert = ouvre && h >= HORAIRES.ouverture && h < HORAIRES.fermeture;

  let info;
  if (ouvert) {
    info = "Ferme à " + HORAIRES.fermeture + "h";
  } else if (ouvre && h < HORAIRES.ouverture) {
    info = "Ouvre à " + HORAIRES.ouverture + "h";
  } else {
    // trouver le prochain jour ouvré
    let k = 1;
    while (k <= 7) {
      const jj = (j + k) % 7;
      if (jj >= 1 && jj <= 6) {
        info = k === 1 ? "Ouvre demain à " + HORAIRES.ouverture + "h" : "Ouvre " + JOURS[jj] + " à " + HORAIRES.ouverture + "h";
        break;
      }
      k++;
    }
  }
  return { ouvert, info, jour: j };
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Bouton "Ouvert / Fermé" dans la navbar ---------- */
  const actions = document.querySelector(".header-actions");
  if (actions && !document.querySelector(".shop-status-wrap")) {
    const st = statutBoutique();
    const wrap = document.createElement("div");
    wrap.className = "shop-status-wrap";
    wrap.innerHTML =
      '<button class="shop-status ' + (st.ouvert ? "is-open" : "is-closed") + '" type="button" aria-expanded="false" aria-haspopup="true">' +
      '<span class="dot"></span><span class="shop-status-label">' + (st.ouvert ? "Ouvert" : "Fermé") + "</span>" +
      "</button>" +
      '<div class="shop-pop" hidden>' +
      "<h5>" + (st.ouvert ? "Ouvert &middot; " : "Fermé &middot; ") + st.info + "</h5>" +
      "<ul>" +
      ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(function (nom, i) {
        return '<li class="' + (st.jour === i + 1 ? "today" : "") + '"><span>' + nom + "</span><span>8h – 19h</span></li>";
      }).join("") +
      '<li class="' + (st.jour === 0 ? "today" : "") + '"><span>Dimanche</span><span>Fermé</span></li>' +
      "</ul></div>";
    actions.insertBefore(wrap, actions.firstChild);

    const btn = wrap.querySelector(".shop-status");
    const pop = wrap.querySelector(".shop-pop");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = pop.hidden;
      pop.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- 3. Bouton retour en haut ---------- */
  const haut = document.createElement("button");
  haut.className = "fab fab-top";
  haut.type = "button";
  haut.setAttribute("aria-label", "Retour en haut");
  haut.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 15l-6-6-6 6"/></svg>';
  haut.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(haut);

  const onScroll = () => haut.classList.toggle("show", window.scrollY > 400);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Chatbox ---------- */
  const chat = document.createElement("div");
  chat.className = "chatbox";
  chat.innerHTML = `
    <button class="fab fab-chat" type="button" aria-label="Ouvrir le chat" aria-expanded="false">
      <svg class="ic-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="chat-panel" hidden>
      <div class="chat-head">
        <div>
          <strong>Assistant Optic Alizé</strong>
          <span>En ligne · réponses immédiates</span>
        </div>
        <button class="chat-x" type="button" aria-label="Fermer">&times;</button>
      </div>
      <div class="chat-body" id="chat-body"></div>
      <form class="chat-form" id="chat-form">
        <input type="text" id="chat-input" placeholder="Écrivez votre message…" autocomplete="off">
        <button type="submit" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>
    </div>`;
  document.body.appendChild(chat);

  const fab = chat.querySelector(".fab-chat");
  const panel = chat.querySelector(".chat-panel");
  const body = chat.querySelector("#chat-body");
  const form = chat.querySelector("#chat-form");
  const input = chat.querySelector("#chat-input");
  let ouvertUneFois = false;

  const waLien = (txt) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(txt || "Bonjour Optic Alizé,")}`;

  function bulle(texte, qui) {
    const b = document.createElement("div");
    b.className = "chat-msg chat-msg--" + (qui || "bot");
    b.innerHTML = texte;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }
  function reponses(boutons) {
    const wrap = document.createElement("div");
    wrap.className = "chat-quick";
    boutons.forEach((btn) => {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = btn.label;
      el.addEventListener("click", () => {
        bulle(btn.label, "user");
        btn.action();
      });
      wrap.appendChild(el);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  /* --- moteur de réponses (mots-clés) ---------------------------------
     L'assistant répond directement aux questions sur les produits, les
     services, les offres et les agences. Les questions de prix / paiement
     renvoient vers WhatsApp. Tout le reste : réponse "hors périmètre". */
  const sansAccent = (s) =>
    String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const NB_MONTURES =
    typeof PRODUITS !== "undefined"
      ? PRODUITS.filter((p) => p.categorie === "montures").length
      : 0;

  function correspond(texte, mots) {
    return mots.some((mot) => {
      const m = sansAccent(mot);
      if (m.indexOf(" ") !== -1) return texte.indexOf(m) !== -1;
      return new RegExp("\\b" + m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\w*\\b").test(texte);
    });
  }

  const INTENTIONS = [
    {
      cle: "merci",
      mots: ["merci", "je vous remercie"],
      rep: () => "Avec plaisir ! Autre chose ?",
    },
    {
      cle: "bonjour",
      mots: ["bonjour", "salut", "bonsoir", "coucou", "hello", "bonne journee"],
      rep: () =>
        "Bonjour 👋 Posez-moi une question sur nos lunettes, lentilles, verres, accessoires, nos services, nos offres ou nos agences.",
    },
    {
      cle: "finance",
      mots: [
        "prix", "tarif", "cout", "combien", "coute", "payer", "paiement",
        "espece", "mobile money", "orange money", "moov money", "wave",
        "carte bancaire", "facilite de paiement", "credit", "echelonne",
        "acompte", "devis", "remboursement", "mutuelle", "assurance",
        "prise en charge", "cher", "budget", "facture",
      ],
      rep: () =>
        `Pour les prix, le paiement ou un devis, un conseiller vous répond directement sur WhatsApp : <a href="${waLien("Bonjour, j'ai une question sur les prix / le paiement.")}" target="_blank" rel="noopener">ouvrir WhatsApp</a>.`,
    },
    {
      cle: "rdv",
      mots: ["rendez-vous", "rendez vous", "rdv", "reserver", "prendre rendez", "consultation"],
      rep: () =>
        `Réservez un créneau en ligne : <a href="contact.html?tab=rdv">prendre rendez-vous</a>. On confirme par téléphone ou WhatsApp.`,
    },
    {
      cle: "services",
      mots: [
        "service", "examen", "test de vue", "controle de vue", "prestation",
        "reparation", "reglage", "ajustement", "garantie", "sav", "depannage", "opticien",
      ],
      rep: () =>
        `Nos opticiens assurent : examen de vue, essayage de montures, adaptation de lentilles, réglage et réparation. L'ajustement de vos montures est gratuit à vie. Pour un créneau : <a href="contact.html?tab=rdv">prendre rendez-vous</a>.`,
    },
    {
      cle: "montures",
      mots: [
        "monture", "lunette", "solaire", "soleil", "cadre", "marque",
        "ray-ban", "dior", "gucci", "persol", "pilote", "papillon",
      ],
      rep: () =>
        `Nous avons ${NB_MONTURES || "plusieurs"} modèles de montures de vue et de soleil, pour femme, homme et enfant, toutes formes : <a href="montures.html">voir les montures</a> (filtres par type, genre et forme).`,
    },
    {
      cle: "lentilles",
      mots: ["lentille", "journaliere", "mensuelle", "myopie", "astigmat", "presbytie", "hypermetropie"],
      rep: () =>
        `Lentilles journalières et mensuelles pour myopie, astigmatie, hypermétropie et presbytie : <a href="lentilles.html">voir les lentilles</a>. L'adaptation se fait avec un opticien (<a href="contact.html?tab=rdv">rendez-vous</a>).`,
    },
    {
      cle: "verres",
      mots: [
        "verre", "anti-reflet", "antireflet", "lumiere bleue", "photochromique",
        "aminci", "traitement", "progressif", "teinte",
      ],
      rep: () => {
        let liste = "";
        if (typeof VERRES !== "undefined" && VERRES.length) {
          liste = " : " + VERRES.slice(0, 4).map((v) => v.titre).filter(Boolean).join(", ");
        }
        return `Nous montons plusieurs types de verres${liste}. Détails sur <a href="verres.html">la page Verres</a>.`;
      },
    },
    {
      cle: "connectees",
      mots: ["connectee", "connecte", "audio", "bluetooth", "smart"],
      rep: () => `Découvrez nos lunettes connectées : <a href="connectees.html">voir la sélection</a>.`,
    },
    {
      cle: "accessoires",
      mots: ["accessoire", "etui", "cordon", "spray", "lingette", "nettoyage", "entretien"],
      rep: () => `Étuis, cordons, sprays et produits d'entretien : <a href="accessoires.html">nos accessoires</a>.`,
    },
    {
      cle: "offres",
      mots: ["offre", "promo", "promotion", "solde", "remise", "bon plan", "reduction"],
      rep: () => `Nos offres du moment : <a href="offres.html">voir les offres</a>.`,
    },
    {
      cle: "livraison",
      mots: ["livraison", "livrer", "livre", "commander", "commande", "retrait", "delai", "expedition", "suivi"],
      rep: () =>
        `Vous choisissez en ligne, la commande part vers l'agence la plus proche et vous retirez sur place. Pour suivre une commande : <a href="${waLien("Bonjour, je souhaite suivre ma commande.")}" target="_blank" rel="noopener">écrire sur WhatsApp</a>.`,
    },
    {
      cle: "agences",
      mots: [
        "agence", "adresse", "ou etes", "ou est", "ou se trouve", "magasin",
        "boutique", "ville", "ouaga", "bobo", "koudougou", "carte", "itineraire",
        "localisation", "telephone", "numero", "joindre", "contact", "email",
        "mail", "horaire", "heure", "ouvert", "ferme", "ouverture",
      ],
      rep: () =>
        `Nos agences sont à Ouagadougou, Bobo-Dioulasso et Koudougou, ouvertes du lundi au samedi de 8h à 19h. Adresses, carte et numéros : <a href="contact.html">page Contact</a>. Tél : <a href="tel:+22675093939">+226 75 09 39 39</a>.`,
    },
    {
      cle: "compte",
      mots: ["compte", "connexion", "connecter", "mot de passe", "inscription", "inscrire", "identifiant"],
      rep: () => `Créez un compte ou connectez-vous ici : <a href="compte.html">mon compte</a>.`,
    },
    {
      cle: "humain",
      mots: ["conseiller", "humain", "operateur", "quelqu un", "quelquun"],
      rep: () =>
        `Un conseiller vous répond sur WhatsApp : <a href="${waLien()}" target="_blank" rel="noopener">démarrer la discussion</a>.`,
    },
  ];

  function repondreA(texte) {
    const t = sansAccent(texte);
    for (const it of INTENTIONS) {
      if (correspond(t, it.mots)) return it.rep();
    }
    return null;
  }
  const rep = (cle) => {
    const it = INTENTIONS.find((i) => i.cle === cle);
    return it ? it.rep() : "";
  };
  const HORS_PERIMETRE =
    `Désolé, je ne peux répondre qu'aux questions sur Optic Alizé : lunettes, lentilles, verres, accessoires, nos services, nos offres et nos agences. ` +
    `Pour toute autre demande, écrivez-nous sur <a href="${waLien()}" target="_blank" rel="noopener">WhatsApp</a>.`;

  const MENU = [
    { label: "Nos lunettes & marques", action: () => { bulle(rep("montures")); menu(); } },
    { label: "Lentilles de contact", action: () => { bulle(rep("lentilles")); menu(); } },
    { label: "Nos verres", action: () => { bulle(rep("verres")); menu(); } },
    { label: "Nos offres", action: () => { bulle(rep("offres")); menu(); } },
    { label: "Prix & paiement", action: () => { bulle(rep("finance")); menu(); } },
    { label: "Nos agences", action: () => { bulle(rep("agences")); menu(); } },
    { label: "Prendre rendez-vous", action: () => { bulle(rep("rdv")); menu(); } },
  ];
  function menu() {
    setTimeout(() => reponses(MENU), 250);
  }

  function ouvrir() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    chat.classList.add("open");
    input.focus();
    if (!ouvertUneFois) {
      ouvertUneFois = true;
      bulle("Bonjour 👋 Je suis l'assistant Optic Alizé. Posez-moi une question sur nos lunettes, lentilles, verres, services, offres ou agences.");
      menu();
    }
  }
  function fermer() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    chat.classList.remove("open");
  }
  fab.addEventListener("click", () => (panel.hidden ? ouvrir() : fermer()));
  chat.querySelector(".chat-x").addEventListener("click", fermer);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    bulle(txt, "user");
    input.value = "";
    // capture d'un e-mail éventuel dans le message
    const m = txt.match(/[^@\s]+@[^@\s]+\.[^@\s]+/);
    if (m) enregistrerEmail(m[0], "chat");
    const reponse = repondreA(txt);
    try {
      const KEY = "optic-alize-chat";
      const log = JSON.parse(localStorage.getItem(KEY)) || [];
      log.push({
        message: txt,
        repondu: !!reponse,
        page: location.pathname.split("/").pop(),
        date: new Date().toISOString(),
      });
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (err) {}
    setTimeout(() => {
      bulle(reponse || HORS_PERIMETRE);
      menu();
    }, 400);
  });

  /* ---------- 5. Newsletter dans le pied de page ---------- */
  const footSocialCol = document.querySelector(".site-footer .footer-social");
  if (footSocialCol && !document.querySelector(".nl-form")) {
    const nl = document.createElement("form");
    nl.className = "nl-form";
    nl.innerHTML = `
      <label for="nl-email">Recevez nos offres par e-mail</label>
      <div class="nl-row">
        <input type="email" id="nl-email" placeholder="votre@email.com" required>
        <button type="submit">OK</button>
      </div>
      <p class="nl-msg" hidden></p>`;
    footSocialCol.parentNode.appendChild(nl);
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = nl.querySelector(".nl-msg");
      const ok = enregistrerEmail(nl.querySelector("#nl-email").value, "newsletter");
      msg.hidden = false;
      msg.textContent = ok ? "Merci, vous êtes inscrit·e !" : "Adresse e-mail invalide.";
      msg.className = "nl-msg " + (ok ? "ok" : "err");
      if (ok) nl.querySelector("#nl-email").value = "";
    });
  }
});
