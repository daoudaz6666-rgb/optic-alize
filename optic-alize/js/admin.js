/* ============================================================
   OPTIC ALIZE - back-office (demo cote navigateur)

   CE QUE FAIT CETTE PAGE
   - connexion par identifiant + mot de passe (js/admin-config.js)
   - ajouter / modifier / supprimer : montures, lentilles, verres
   - tableau de bord (comptages, repartition)
   - statistiques de visite
   - liste des e-mails collectes (comptes clients + newsletter) + export

   LIMITES (IMPORTANT)
   - Site statique = AUCUN serveur. Tout est stocke dans le
     localStorage du navigateur courant :
       * les modifications ne sont visibles que sur CE navigateur,
         pas pour les autres visiteurs ni sur le site en ligne ;
       * les statistiques ne comptent que CE navigateur ;
       * les identifiants sont dans le code source (non securise).
   - Pour publier les modifications sur le vrai site : bouton
     "Exporter" puis remplacer le tableau correspondant dans
     js/produits.js ou js/verres.js.
   - Pour un vrai back-office : il faut un backend
     (PrestaShop / WooCommerce, ou Supabase / Firebase + hebergement).
   ============================================================ */

(function () {
  "use strict";

  var KEY_P = "optic-alize-admin-produits";
  var KEY_V = "optic-alize-admin-verres";
  var KEY_PUB = "optic-alize-admin-publications";
  var KEY_SES = "optic-alize-admin-session";

  var app = document.getElementById("admin-app");
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------- donnees ---------- */
  function loadProduits() {
    try { var o = JSON.parse(localStorage.getItem(KEY_P)); if (Array.isArray(o)) return o; } catch (e) {}
    return clone(typeof PRODUITS_DEFAUT !== "undefined" ? PRODUITS_DEFAUT : PRODUITS);
  }
  function loadVerres() {
    try { var o = JSON.parse(localStorage.getItem(KEY_V)); if (Array.isArray(o)) return o; } catch (e) {}
    return clone(typeof VERRES_DEFAUT !== "undefined" ? VERRES_DEFAUT : VERRES);
  }
  /* Publications : actualités / conseils / offres (js/publications.js) */
  var PUB_TYPES = {
    actualites: { titre: "Actualités", varJs: "ACTUALITES", dossier: "actualites" },
    conseils: { titre: "Conseils", varJs: "CONSEILS", dossier: "conseils" },
    offres: { titre: "Offres", varJs: "OFFRES", dossier: "offres" },
  };
  function pubDefaut() {
    return {
      actualites: clone(typeof ACTUALITES_DEFAUT !== "undefined" ? ACTUALITES_DEFAUT : (typeof ACTUALITES !== "undefined" ? ACTUALITES : [])),
      conseils: clone(typeof CONSEILS_DEFAUT !== "undefined" ? CONSEILS_DEFAUT : (typeof CONSEILS !== "undefined" ? CONSEILS : [])),
      offres: clone(typeof OFFRES_DEFAUT !== "undefined" ? OFFRES_DEFAUT : (typeof OFFRES !== "undefined" ? OFFRES : [])),
    };
  }
  function loadPubs() {
    var d = pubDefaut();
    try {
      var o = JSON.parse(localStorage.getItem(KEY_PUB));
      if (o && typeof o === "object") {
        ["actualites", "conseils", "offres"].forEach(function (k) {
          if (Array.isArray(o[k])) d[k] = o[k];
        });
      }
    } catch (e) {}
    return d;
  }

  var produits = loadProduits();
  var verres = loadVerres();
  var pubs = loadPubs();

  function saveProduits() { localStorage.setItem(KEY_P, JSON.stringify(produits)); }
  function saveVerres() { localStorage.setItem(KEY_V, JSON.stringify(verres)); }
  function savePubs() {
    try {
      localStorage.setItem(KEY_PUB, JSON.stringify(pubs));
      return true;
    } catch (e) {
      alert("Espace de stockage plein. Utilisez des images plus légères ou supprimez d'anciennes publications.");
      return false;
    }
  }
  function montures() { return produits.filter(function (p) { return p.categorie === "montures"; }); }
  function lentilles() { return produits.filter(function (p) { return p.categorie === "lentilles"; }); }

  function lire(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function statsVisite() { return lire("optic-alize-stats", {}); }
  function newsletter() { return lire("optic-alize-newsletter", []); }
  function comptes() { return lire("optic-alize-comptes", []); }
  function chatLog() { return lire("optic-alize-chat", []); }
  function rappels() { return lire("optic-alize-rappels", []); }

  function tousEmails() {
    var map = {};
    comptes().forEach(function (c) {
      if (c.email) map[c.email] = { email: c.email, source: "compte client", nom: ((c.prenom || "") + " " + (c.nom || "")).trim(), date: c.creeLe || "" };
    });
    newsletter().forEach(function (n) {
      if (n.email && !map[n.email]) map[n.email] = { email: n.email, source: n.source || "newsletter", nom: "", date: n.date || "" };
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  /* ---------- telechargement ---------- */
  function telecharger(nom, contenu, mime) {
    var blob = new Blob([contenu], { type: (mime || "text/plain") + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function exportJsArray(nomVar, arr) {
    var lignes = arr.map(function (o) { return "  " + JSON.stringify(o) + ","; }).join("\n");
    return "const " + nomVar + " = [\n" + lignes + "\n];\n";
  }
  function toCSV(rows, cols) {
    var head = cols.join(",");
    var body = rows.map(function (r) {
      return cols.map(function (c) {
        var v = r[c] == null ? "" : String(r[c]);
        return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(",");
    }).join("\n");
    return head + "\n" + body;
  }

  /* ---------- schemas de formulaire ---------- */
  var CH_MONTURE = [
    { k: "nom", l: "Nom", t: "text", req: 1 },
    { k: "marque", l: "Marque", t: "text", req: 1 },
    { k: "prix", l: "Prix (FCFA)", t: "number", req: 1 },
    { k: "type", l: "Type", t: "select", o: ["vue", "soleil"] },
    { k: "genre", l: "Genre", t: "select", o: ["femme", "homme", "enfant"] },
    { k: "forme", l: "Forme", t: "select", o: ["ovale", "carre", "ronde", "papillon", "pilote"] },
    { k: "couleur", l: "Couleur principale (hex)", t: "text", ph: "#12303D" },
    { k: "couleurs", l: "Couleurs (hex, separees par des virgules)", t: "text", ph: "#12303D, #C79A4B" },
    { k: "desc", l: "Description", t: "textarea" },
    { k: "photo", l: "Photo (chemin, ex. montures/m001.jpg)", t: "text" },
    { k: "nouveau", l: "Afficher le badge « Nouveau »", t: "checkbox" },
  ];
  var CH_LENTILLE = [
    { k: "nom", l: "Nom", t: "text", req: 1 },
    { k: "marque", l: "Marque", t: "text", req: 1 },
    { k: "prix", l: "Prix (FCFA)", t: "number", req: 1 },
    { k: "frequence", l: "Frequence", t: "select", o: ["journaliere", "bi-mensuelle", "mensuelle"] },
    { k: "correction", l: "Correction", t: "select", o: ["myopie", "hypermetropie", "astigmatie", "presbytie"] },
    { k: "desc", l: "Description", t: "textarea" },
    { k: "photo", l: "Photo (chemin, ex. lentilles/l001.jpg)", t: "text" },
  ];
  var CH_VERRE = [
    { k: "titre", l: "Titre", t: "text", req: 1 },
    { k: "resume", l: "Description", t: "textarea", req: 1 },
    { k: "points", l: "Avantages (un par ligne)", t: "textarea" },
    { k: "photo", l: "Photo (chemin, ex. verres/xxx.jpg)", t: "text" },
  ];

  function nouvelId(prefixe, liste) {
    var max = 0;
    liste.forEach(function (p) {
      var m = /(\d+)/.exec(p.id || "");
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefixe + String(max + 1).padStart(3, "0");
  }

  /* ============================================================
     AUTHENTIFICATION
     ============================================================ */
  function estConnecte() { return sessionStorage.getItem(KEY_SES) === "1"; }

  function vueLogin(err) {
    app.innerHTML =
      '<div class="ad-login">' +
      '  <div class="ad-login-card">' +
      '    <img class="ad-logo-img" src="logo-optic-alize.png" alt="Optic Alize">' +
      '    <h1>Administration</h1>' +
      '    <p>Espace reserve. Identifiez-vous pour continuer.</p>' +
      (err ? '<div class="ad-alert">' + esc(err) + "</div>" : "") +
      '    <form id="ad-login-form">' +
      '      <label>Identifiant<input type="text" name="user" autocomplete="username" required></label>' +
      '      <label>Mot de passe<input type="password" name="pass" autocomplete="current-password" required></label>' +
      '      <button type="submit" class="ad-btn ad-btn--primary">Se connecter</button>' +
      "    </form>" +
      '    <p class="ad-hint">Identifiants par defaut : <code>admin</code> / <code>optic-alize-2026</code> &mdash; a changer dans <code>js/admin-config.js</code>.</p>' +
      '    <p class="ad-back"><a href="index.html">&larr; Retour au site</a></p>' +
      "  </div>" +
      "</div>";
    document.getElementById("ad-login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      if (
        typeof ADMIN_CONFIG !== "undefined" &&
        f.user.value.trim() === ADMIN_CONFIG.identifiant &&
        f.pass.value === ADMIN_CONFIG.motDePasse
      ) {
        sessionStorage.setItem(KEY_SES, "1");
        rendre("dashboard");
      } else {
        vueLogin("Identifiant ou mot de passe incorrect.");
      }
    });
  }

  /* ============================================================
     LAYOUT + NAVIGATION
     ============================================================ */
  var ONGLETS = [
    { k: "dashboard", l: "Tableau de bord" },
    { k: "montures", l: "Montures" },
    { k: "lentilles", l: "Lentilles" },
    { k: "verres", l: "Verres" },
    { k: "actualites", l: "Actualités" },
    { k: "conseils", l: "Conseils" },
    { k: "offres", l: "Offres" },
    { k: "promo", l: "Promotions" },
    { k: "visiteurs", l: "Visiteurs" },
    { k: "emails", l: "E-mails" },
    { k: "marketing", l: "Marketing" },
  ];

  function rendre(onglet) {
    if (!estConnecte()) { vueLogin(); return; }
    app.innerHTML =
      '<div class="ad-shell">' +
      '  <aside class="ad-side">' +
      '    <img class="ad-logo-img" src="logo-optic-alize.png" alt="Optic Alize">' +
      '    <nav>' +
      ONGLETS.map(function (o) {
        return '<button data-onglet="' + o.k + '" class="' + (o.k === onglet ? "actif" : "") + '">' + o.l + "</button>";
      }).join("") +
      "    </nav>" +
      '    <div class="ad-side-foot">' +
      '      <a href="index.html" target="_blank">Voir le site &nearr;</a>' +
      '      <button id="ad-logout">Se deconnecter</button>' +
      "    </div>" +
      "  </aside>" +
      '  <main class="ad-main" id="ad-content"></main>' +
      "</div>";

    app.querySelectorAll("[data-onglet]").forEach(function (b) {
      b.addEventListener("click", function () { rendre(b.dataset.onglet); });
    });
    document.getElementById("ad-logout").addEventListener("click", function () {
      sessionStorage.removeItem(KEY_SES);
      vueLogin();
    });

    var c = document.getElementById("ad-content");
    if (onglet === "dashboard") vueDashboard(c);
    else if (onglet === "montures") vueProduits(c, "montures");
    else if (onglet === "lentilles") vueProduits(c, "lentilles");
    else if (onglet === "verres") vueVerres(c);
    else if (PUB_TYPES[onglet]) vuePublications(c, onglet);
    else if (onglet === "promo") vuePromo(c);
    else if (onglet === "visiteurs") vueVisiteurs(c);
    else if (onglet === "emails") vueEmails(c);
    else if (onglet === "marketing") vueMarketing(c);
  }

  /* ============================================================
     TABLEAU DE BORD
     ============================================================ */
  function barres(titre, data) {
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }).concat([1]));
    return (
      '<div class="ad-chart"><h3>' + esc(titre) + "</h3>" +
      data.map(function (d) {
        return (
          '<div class="ad-bar"><span class="ad-bar-l">' + esc(d.l) + "</span>" +
          '<span class="ad-bar-t"><span style="width:' + Math.round((d.v / max) * 100) + '%"></span></span>' +
          '<span class="ad-bar-v">' + d.v + "</span></div>"
        );
      }).join("") +
      "</div>"
    );
  }
  function compter(liste, cle) {
    var m = {};
    liste.forEach(function (x) { var k = x[cle] || "-"; m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).map(function (k) { return { l: k, v: m[k] }; });
  }

  function vueDashboard(c) {
    var st = statsVisite();
    var cartes = [
      { l: "Montures", v: montures().length },
      { l: "Lentilles", v: lentilles().length },
      { l: "Verres", v: verres.length },
      { l: "Actualités", v: pubs.actualites.length },
      { l: "Conseils", v: pubs.conseils.length },
      { l: "Offres", v: pubs.offres.length },
      { l: "Visites (ce navigateur)", v: st.vues || 0 },
      { l: "E-mails collectes", v: tousEmails().length },
      { l: "Comptes clients", v: comptes().length },
      { l: "Messages du chat", v: chatLog().length },
    ];
    var surcharge = !!localStorage.getItem(KEY_P) || !!localStorage.getItem(KEY_V) || !!localStorage.getItem(KEY_PUB);
    c.innerHTML =
      "<h1>Tableau de bord</h1>" +
      (surcharge
        ? '<div class="ad-note">Des modifications locales sont actives sur ce navigateur. Utilisez <b>Exporter</b> dans chaque onglet pour les publier sur le vrai site, ou <b>Reinitialiser</b> pour revenir au catalogue d\'origine.</div>'
        : "") +
      '<div class="ad-cards">' +
      cartes.map(function (k) {
        return '<div class="ad-card"><span class="ad-card-v">' + k.v + '</span><span class="ad-card-l">' + esc(k.l) + "</span></div>";
      }).join("") +
      "</div>" +
      '<div class="ad-charts">' +
      barres("Montures par type", compter(montures(), "type")) +
      barres("Montures par forme", compter(montures(), "forme")) +
      barres("Montures par genre", compter(montures(), "genre")) +
      barres("Lentilles par correction", compter(lentilles(), "correction")) +
      "</div>";
  }

  /* ============================================================
     PRODUITS (montures / lentilles)
     ============================================================ */
  function vueProduits(c, cat) {
    var liste = cat === "montures" ? montures() : lentilles();
    var colonnes =
      cat === "montures"
        ? ["nom", "marque", "type", "genre", "forme", "prix"]
        : ["nom", "marque", "frequence", "correction", "prix"];

    c.innerHTML =
      '<div class="ad-head">' +
      "<h1>" + (cat === "montures" ? "Montures" : "Lentilles") + " <span>(" + liste.length + ")</span></h1>" +
      '<div class="ad-actions">' +
      '<button class="ad-btn" data-exp>Exporter</button>' +
      (localStorage.getItem(KEY_P) ? '<button class="ad-btn ad-btn--ghost" data-reset>Reinitialiser</button>' : "") +
      '<button class="ad-btn ad-btn--primary" data-add>+ Ajouter</button>' +
      "</div></div>" +
      '<div class="ad-table-wrap"><table class="ad-table"><thead><tr>' +
      "<th></th>" +
      colonnes.map(function (k) { return "<th>" + k + "</th>"; }).join("") +
      "<th></th></tr></thead><tbody>" +
      liste.map(function (p) {
        return (
          '<tr data-id="' + esc(p.id) + '">' +
          '<td class="ad-thumb">' + vignette(p) + "</td>" +
          colonnes.map(function (k) {
            return "<td>" + (k === "prix" ? (Number(p.prix) || 0).toLocaleString("fr-FR") + " F" : esc(p[k])) + "</td>";
          }).join("") +
          '<td class="ad-row-act">' +
          '<button data-edit>Modifier</button>' +
          '<button data-del class="danger">Suppr.</button>' +
          "</td></tr>"
        );
      }).join("") +
      "</tbody></table></div>";

    c.querySelector("[data-add]").addEventListener("click", function () {
      formProduit(cat, null);
    });
    var expBtn = c.querySelector("[data-exp]");
    if (expBtn) expBtn.addEventListener("click", function () {
      telecharger("produits-export.js", exportJsArray("PRODUITS", produits), "text/javascript");
    });
    var rs = c.querySelector("[data-reset]");
    if (rs) rs.addEventListener("click", function () {
      if (confirm("Revenir au catalogue d'origine ? Les montures ET lentilles modifiees seront perdues.")) {
        localStorage.removeItem(KEY_P);
        produits = loadProduits();
        rendre(cat);
      }
    });
    c.querySelectorAll("tr[data-id]").forEach(function (tr) {
      var id = tr.dataset.id;
      tr.querySelector("[data-edit]").addEventListener("click", function () { formProduit(cat, id); });
      tr.querySelector("[data-del]").addEventListener("click", function () {
        var p = produits.find(function (x) { return x.id === id; });
        if (p && confirm('Supprimer "' + p.nom + '" ?')) {
          produits = produits.filter(function (x) { return x.id !== id; });
          saveProduits();
          rendre(cat);
        }
      });
    });
  }

  function vignette(p) {
    if (p.photo) return '<img src="' + esc(p.photo) + '" alt="" onerror="this.style.visibility=\'hidden\'">';
    try { return typeof getProduitSvg === "function" ? getProduitSvg(p) : ""; } catch (e) { return ""; }
  }

  function champInput(ch, val) {
    var id = "f_" + ch.k;
    var v = val == null ? "" : val;
    if (ch.t === "textarea")
      return '<label for="' + id + '">' + esc(ch.l) + '</label><textarea id="' + id + '" name="' + ch.k + '"' + (ch.req ? " required" : "") + ">" + esc(v) + "</textarea>";
    if (ch.t === "select")
      return (
        '<label for="' + id + '">' + esc(ch.l) + '</label><select id="' + id + '" name="' + ch.k + '">' +
        ch.o.map(function (o) { return '<option' + (o === v ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
        "</select>"
      );
    if (ch.t === "checkbox")
      return '<label class="ad-check"><input type="checkbox" id="' + id + '" name="' + ch.k + '"' + (v ? " checked" : "") + "> " + esc(ch.l) + "</label>";
    return (
      '<label for="' + id + '">' + esc(ch.l) + '</label><input type="' + ch.t + '" id="' + id + '" name="' + ch.k + '"' +
      (ch.ph ? ' placeholder="' + esc(ch.ph) + '"' : "") + (ch.req ? " required" : "") + ' value="' + esc(v) + '">'
    );
  }

  function modal(titre, corpsHtml, onSubmit) {
    var ov = document.createElement("div");
    ov.className = "ad-modal-ov";
    ov.innerHTML =
      '<div class="ad-modal"><div class="ad-modal-h"><h2>' + esc(titre) + '</h2><button class="ad-modal-x">&times;</button></div>' +
      '<form class="ad-form">' + corpsHtml +
      '<div class="ad-modal-f"><button type="button" class="ad-btn ad-btn--ghost" data-cancel>Annuler</button>' +
      '<button type="submit" class="ad-btn ad-btn--primary">Enregistrer</button></div></form></div>';
    document.body.appendChild(ov);
    var ferme = function () { ov.remove(); };
    ov.querySelector(".ad-modal-x").addEventListener("click", ferme);
    ov.querySelector("[data-cancel]").addEventListener("click", ferme);
    ov.addEventListener("click", function (e) { if (e.target === ov) ferme(); });
    ov.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      new FormData(e.target).forEach(function (v, k) { data[k] = v; });
      e.target.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { data[cb.name] = cb.checked; });
      if (onSubmit(data) !== false) ferme();
    });
  }

  function formProduit(cat, id) {
    var champs = cat === "montures" ? CH_MONTURE : CH_LENTILLE;
    var existant = id ? produits.find(function (p) { return p.id === id; }) : null;
    var vals = existant ? clone(existant) : {};
    if (existant && Array.isArray(existant.couleurs)) vals.couleurs = existant.couleurs.join(", ");
    var corps = champs.map(function (ch) { return '<div class="ad-field">' + champInput(ch, vals[ch.k]) + "</div>"; }).join("");

    modal((id ? "Modifier" : "Ajouter") + (cat === "montures" ? " une monture" : " une lentille"), corps, function (data) {
      var obj = existant ? clone(existant) : {};
      obj.categorie = cat;
      champs.forEach(function (ch) {
        if (ch.k === "couleurs") return;
        if (ch.t === "number") obj[ch.k] = Number(data[ch.k]) || 0;
        else if (ch.t === "checkbox") { if (data[ch.k]) obj[ch.k] = true; else delete obj[ch.k]; }
        else if (data[ch.k] !== undefined && data[ch.k] !== "") obj[ch.k] = data[ch.k];
        else delete obj[ch.k];
      });
      if (cat === "montures") {
        var arr = (data.couleurs || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        if (!arr.length && obj.couleur) arr = [obj.couleur];
        obj.couleurs = arr;
        if (!obj.couleur && arr[0]) obj.couleur = arr[0];
      }
      if (!obj.id) obj.id = nouvelId(cat === "montures" ? "m" : "l", produits);
      var i = produits.findIndex(function (p) { return p.id === obj.id; });
      if (i >= 0) produits[i] = obj; else produits.push(obj);
      saveProduits();
      rendre(cat);
    });
  }

  /* ============================================================
     VERRES
     ============================================================ */
  function vueVerres(c) {
    c.innerHTML =
      '<div class="ad-head"><h1>Verres <span>(' + verres.length + ")</span></h1>" +
      '<div class="ad-actions">' +
      '<button class="ad-btn" data-exp>Exporter</button>' +
      (localStorage.getItem(KEY_V) ? '<button class="ad-btn ad-btn--ghost" data-reset>Reinitialiser</button>' : "") +
      '<button class="ad-btn ad-btn--primary" data-add>+ Ajouter</button>' +
      "</div></div>" +
      '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th></th><th>Titre</th><th>Description</th><th></th></tr></thead><tbody>' +
      verres.map(function (v, i) {
        return (
          '<tr data-i="' + i + '">' +
          '<td class="ad-thumb">' + (v.photo ? '<img src="' + esc(v.photo) + '" alt="" onerror="this.style.visibility=\'hidden\'">' : "") + "</td>" +
          "<td>" + esc(v.titre) + "</td>" +
          '<td class="ad-clip">' + esc((v.resume || "").slice(0, 90)) + "...</td>" +
          '<td class="ad-row-act"><button data-edit>Modifier</button><button data-del class="danger">Suppr.</button></td></tr>'
        );
      }).join("") +
      "</tbody></table></div>";

    c.querySelector("[data-add]").addEventListener("click", function () { formVerre(null); });
    c.querySelector("[data-exp]").addEventListener("click", function () {
      telecharger("verres-export.js", exportJsArray("VERRES", verres), "text/javascript");
    });
    var rs = c.querySelector("[data-reset]");
    if (rs) rs.addEventListener("click", function () {
      if (confirm("Revenir a la liste de verres d'origine ?")) { localStorage.removeItem(KEY_V); verres = loadVerres(); rendre("verres"); }
    });
    c.querySelectorAll("tr[data-i]").forEach(function (tr) {
      var i = Number(tr.dataset.i);
      tr.querySelector("[data-edit]").addEventListener("click", function () { formVerre(i); });
      tr.querySelector("[data-del]").addEventListener("click", function () {
        if (confirm('Supprimer "' + verres[i].titre + '" ?')) { verres.splice(i, 1); saveVerres(); rendre("verres"); }
      });
    });
  }

  function formVerre(i) {
    var existant = i != null ? verres[i] : null;
    var vals = existant ? clone(existant) : {};
    if (existant && Array.isArray(existant.points)) vals.points = existant.points.join("\n");
    var corps = CH_VERRE.map(function (ch) { return '<div class="ad-field">' + champInput(ch, vals[ch.k]) + "</div>"; }).join("");
    modal((i != null ? "Modifier" : "Ajouter") + " un verre", corps, function (data) {
      var obj = existant ? clone(existant) : {};
      obj.titre = data.titre;
      obj.resume = data.resume;
      obj.points = (data.points || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
      if (data.photo) obj.photo = data.photo; else delete obj.photo;
      if (i != null) verres[i] = obj; else verres.push(obj);
      saveVerres();
      rendre("verres");
    });
  }

  /* ============================================================
     PUBLICATIONS (actualités / conseils / offres)
     ============================================================ */
  var PAGES_CTA = [
    "", "contact.html?tab=rdv", "contact.html", "montures.html",
    "montures.html?type=soleil", "lentilles.html", "verres.html",
    "offres.html", "conseils.html", "actualites.html", "a-propos.html",
  ];

  /* Redimensionne une image (fichier) en JPEG compact -> data URI */
  function redimImage(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1100;
        var w = img.width, h = img.height;
        if (w > max || h > max) {
          if (w >= h) { h = Math.round((h * max) / w); w = max; }
          else { w = Math.round((w * max) / h); h = max; }
        }
        var cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        var ctx = cv.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try { cb(cv.toDataURL("image/jpeg", 0.72)); }
        catch (e) { cb(reader.result); }
      };
      img.onerror = function () { cb(reader.result); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function vuePublications(c, type) {
    var meta = PUB_TYPES[type];
    var liste = pubs[type];

    c.innerHTML =
      '<div class="ad-head">' +
      "<h1>" + meta.titre + " <span>(" + liste.length + ")</span></h1>" +
      '<div class="ad-actions">' +
      '<button class="ad-btn" data-exp>Exporter</button>' +
      (localStorage.getItem(KEY_PUB) ? '<button class="ad-btn ad-btn--ghost" data-reset>Réinitialiser</button>' : "") +
      '<button class="ad-btn ad-btn--primary" data-add>+ Ajouter</button>' +
      "</div></div>" +
      '<div class="ad-note">Ajoutez une image, un titre et un texte. La publication apparaît aussitôt sur la page <b>' + meta.titre +
      '</b> du site (dans ce navigateur). Pour la mettre en ligne pour tout le monde : bouton <b>Exporter</b>.</div>' +
      (liste.length
        ? '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th></th><th>Titre</th><th>Texte</th><th>Bouton</th><th></th></tr></thead><tbody>' +
          liste.map(function (p, i) {
            return (
              '<tr data-i="' + i + '">' +
              '<td class="ad-thumb">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" onerror="this.style.visibility=\'hidden\'">' : "") + "</td>" +
              "<td>" + esc(p.titre) + "</td>" +
              '<td class="ad-clip">' + esc((p.texte || "").slice(0, 90)) + ((p.texte || "").length > 90 ? "…" : "") + "</td>" +
              "<td>" + (p.cta && p.cta.label ? esc(p.cta.label) : "—") + "</td>" +
              '<td class="ad-row-act">' +
              (i > 0 ? '<button data-up title="Monter">↑</button>' : "") +
              (i < liste.length - 1 ? '<button data-down title="Descendre">↓</button>' : "") +
              '<button data-edit>Modifier</button>' +
              '<button data-del class="danger">Suppr.</button>' +
              "</td></tr>"
            );
          }).join("") +
          "</tbody></table></div>"
        : '<p class="ad-empty">Aucune publication. Cliquez sur « + Ajouter ».</p>');

    c.querySelector("[data-add]").addEventListener("click", function () { formPublication(type, null); });
    c.querySelector("[data-exp]").addEventListener("click", function () {
      telecharger(type + "-export.js", exportJsArray(meta.varJs, pubs[type]), "text/javascript");
    });
    var rs = c.querySelector("[data-reset]");
    if (rs) rs.addEventListener("click", function () {
      if (confirm("Revenir aux " + meta.titre.toLowerCase() + " d'origine ? Les 3 rubriques (actualités, conseils, offres) modifiées seront perdues.")) {
        localStorage.removeItem(KEY_PUB);
        pubs = loadPubs();
        rendre(type);
      }
    });
    c.querySelectorAll("tr[data-i]").forEach(function (tr) {
      var i = Number(tr.dataset.i);
      tr.querySelector("[data-edit]").addEventListener("click", function () { formPublication(type, i); });
      tr.querySelector("[data-del]").addEventListener("click", function () {
        if (confirm('Supprimer "' + (liste[i].titre || "cette publication") + '" ?')) {
          liste.splice(i, 1); savePubs(); rendre(type);
        }
      });
      var up = tr.querySelector("[data-up]");
      if (up) up.addEventListener("click", function () {
        var t = liste[i]; liste[i] = liste[i - 1]; liste[i - 1] = t; savePubs(); rendre(type);
      });
      var dn = tr.querySelector("[data-down]");
      if (dn) dn.addEventListener("click", function () {
        var t = liste[i]; liste[i] = liste[i + 1]; liste[i + 1] = t; savePubs(); rendre(type);
      });
    });
  }

  function formPublication(type, i) {
    var meta = PUB_TYPES[type];
    var existant = i != null ? pubs[type][i] : null;
    var v = existant ? clone(existant) : {};
    var cta = v.cta || {};

    var corps =
      '<div class="ad-field">' +
      '<label>Image</label>' +
      '<div id="pub-preview" style="margin-bottom:8px;">' +
      (v.image ? '<img src="' + esc(v.image) + '" alt="" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid var(--ligne);">' : '<span class="ad-hint">Aucune image</span>') +
      "</div>" +
      '<input type="file" id="pub-file" accept="image/*">' +
      '<input type="hidden" name="image" value="' + esc(v.image || "") + '">' +
      '<p class="ad-hint">Choisissez une photo (elle est compressée automatiquement). Ou laissez le champ ci-dessous pour un chemin type <code>' + meta.dossier + '/photo.jpg</code>.</p>' +
      '<input type="text" id="pub-path" placeholder="' + meta.dossier + '/ma-photo.jpg" value="' + (v.image && v.image.indexOf("data:") !== 0 ? esc(v.image) : "") + '" style="margin-top:6px;">' +
      "</div>" +
      '<div class="ad-field"><label for="f_titre">Titre</label><input type="text" id="f_titre" name="titre" required value="' + esc(v.titre || "") + '"></div>' +
      '<div class="ad-field"><label for="f_texte">Texte</label><textarea id="f_texte" name="texte" required>' + esc(v.texte || "") + "</textarea></div>" +
      '<div class="ad-field"><label for="f_ctalabel">Bouton (texte) — facultatif</label><input type="text" id="f_ctalabel" name="ctalabel" placeholder="Prendre rendez-vous" value="' + esc(cta.label || "") + '"></div>' +
      '<div class="ad-field"><label for="f_ctahref">Bouton (lien)</label><select id="f_ctahref" name="ctahref">' +
      PAGES_CTA.map(function (h) {
        return '<option value="' + esc(h) + '"' + (h === (cta.href || "") ? " selected" : "") + ">" + (h || "— aucun —") + "</option>";
      }).join("") +
      "</select></div>";

    modal((i != null ? "Modifier" : "Ajouter") + " — " + meta.titre.toLowerCase().replace(/s$/, ""), corps, function (data) {
      var obj = existant ? clone(existant) : {};
      obj.titre = (data.titre || "").trim();
      obj.texte = (data.texte || "").trim();
      var chemin = (data.image || "").trim();
      var pathManuel = document.getElementById("pub-path");
      if (pathManuel && pathManuel.value.trim()) chemin = pathManuel.value.trim();
      obj.image = chemin;
      if (data.ctalabel && data.ctalabel.trim() && data.ctahref) {
        obj.cta = { label: data.ctalabel.trim(), href: data.ctahref };
      } else {
        delete obj.cta;
      }
      if (!obj.image) { alert("Ajoutez une image (photo ou chemin)."); return false; }
      if (i != null) pubs[type][i] = obj;
      else pubs[type].unshift(obj);
      if (!savePubs()) return false;
      rendre(type);
    });

    var fileInput = document.getElementById("pub-file");
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      redimImage(f, function (dataUri) {
        var hidden = document.querySelector('.ad-modal-ov input[name="image"]');
        if (hidden) hidden.value = dataUri;
        var pathField = document.getElementById("pub-path");
        if (pathField) pathField.value = "";
        var prev = document.getElementById("pub-preview");
        if (prev) prev.innerHTML = '<img src="' + dataUri + '" alt="" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid var(--ligne);">';
      });
    });
  }

  /* ============================================================
     PROMOTIONS (campagne site — barre + pastille + compte à rebours)
     ============================================================ */
  var CAMPAGNE_DEFAUT = {
    actif: false,
    titre: "Jours Prestiges",
    message: "Jusqu'à −50 % sur les montures de marques",
    reduction: "−50 %",
    lienLabel: "En profiter",
    lien: "offres.html",
    fin: "",
    pastille: true,
    cibles: [],
    version: "2026-09",
  };
  function loadCampagne() {
    var d = clone(CAMPAGNE_DEFAUT);
    try {
      var c = JSON.parse(localStorage.getItem("optic-alize-campagne"));
      if (c && typeof c === "object") Object.keys(c).forEach(function (k) { d[k] = c[k]; });
    } catch (e) {}
    if (!Array.isArray(d.cibles)) d.cibles = [];
    return d;
  }

  function vuePromo(c) {
    var camp = loadCampagne();
    var act = !!localStorage.getItem("optic-alize-campagne");

    c.innerHTML =
      '<div class="ad-head"><h1>Promotions <span>campagne du site</span></h1>' +
      '<div class="ad-actions">' +
      (act ? '<button class="ad-btn ad-btn--ghost" data-off>Désactiver</button>' : "") +
      '<button class="ad-btn" data-exp>Exporter</button>' +
      '<a class="ad-btn" href="index.html" target="_blank">Voir le site ↗</a>' +
      "</div></div>" +
      '<div class="ad-note">Quand la campagne est <b>active</b>, le visiteur voit automatiquement, dès son arrivée : une <b>barre en haut</b> de toutes les pages, une <b>pastille flottante « PROMO »</b>, un <b>compte à rebours</b> (si une date de fin est indiquée) et un petit <b>ruban sur les articles</b> ciblés. ' +
      "Comme le reste de l'admin, l'aperçu est local à ce navigateur : cliquez <b>Exporter</b> puis envoyez le fichier pour le mettre en ligne.</div>" +
      '<form id="promo-form" class="ad-form" style="max-width:640px;padding:0;">' +
      '<div class="ad-field"><label class="ad-check"><input type="checkbox" name="actif" ' + (camp.actif ? "checked" : "") + "> Campagne active</label></div>" +
      '<div class="ad-field"><label>Titre court (badge)</label><input type="text" name="titre" value="' + esc(camp.titre) + '" placeholder="Jours Prestiges"></div>' +
      '<div class="ad-field"><label>Message</label><input type="text" name="message" value="' + esc(camp.message) + '" placeholder="Jusqu\'à −50 % sur les montures"></div>' +
      '<div class="ad-field"><label>Réduction affichée (ruban)</label><input type="text" name="reduction" value="' + esc(camp.reduction) + '" placeholder="−50 %"></div>' +
      '<div class="ad-field"><label>Texte du bouton</label><input type="text" name="lienLabel" value="' + esc(camp.lienLabel) + '" placeholder="En profiter"></div>' +
      '<div class="ad-field"><label>Lien du bouton</label><select name="lien">' +
      PAGES_CTA.filter(Boolean).map(function (h) {
        return '<option value="' + esc(h) + '"' + (h === camp.lien ? " selected" : "") + ">" + esc(h) + "</option>";
      }).join("") +
      "</select></div>" +
      '<div class="ad-field"><label>Date de fin (compte à rebours) — facultatif</label><input type="date" name="fin" value="' + esc(camp.fin || "") + '"></div>' +
      '<div class="ad-field"><label class="ad-check"><input type="checkbox" name="pastille" ' + (camp.pastille ? "checked" : "") + "> Afficher la pastille flottante « PROMO »</label></div>" +
      '<div class="ad-field"><label>Ruban « promo » sur les articles</label>' +
      '<label class="ad-check"><input type="checkbox" name="c_montures" ' + (camp.cibles.indexOf("montures") >= 0 ? "checked" : "") + "> Montures</label>" +
      '<label class="ad-check"><input type="checkbox" name="c_lentilles" ' + (camp.cibles.indexOf("lentilles") >= 0 ? "checked" : "") + "> Lentilles</label></div>" +
      '<div class="ad-field"><label>Version (change-la pour ré-afficher la barre à ceux qui l\'ont fermée)</label><input type="text" name="version" value="' + esc(camp.version) + '"></div>' +
      '<div class="ad-modal-f" style="justify-content:flex-start;"><button type="submit" class="ad-btn ad-btn--primary">Enregistrer</button></div>' +
      "</form>";

    var offBtn = c.querySelector("[data-off]");
    if (offBtn) offBtn.addEventListener("click", function () {
      if (confirm("Retirer la campagne promo de ce navigateur ?")) {
        localStorage.removeItem("optic-alize-campagne");
        rendre("promo");
      }
    });
    c.querySelector("[data-exp]").addEventListener("click", function () {
      var obj = lireForm();
      telecharger("campagne-export.js",
        "/* Collez cet objet dans js/marketing.js -> MKT.campagne */\n" +
        "const CAMPAGNE = " + JSON.stringify(obj, null, 2) + ";\n", "text/javascript");
    });

    function lireForm() {
      var f = c.querySelector("#promo-form");
      var cibles = [];
      if (f.c_montures.checked) cibles.push("montures");
      if (f.c_lentilles.checked) cibles.push("lentilles");
      return {
        actif: f.actif.checked,
        titre: f.titre.value.trim(),
        message: f.message.value.trim(),
        reduction: f.reduction.value.trim(),
        lienLabel: f.lienLabel.value.trim(),
        lien: f.lien.value,
        fin: f.fin.value,
        pastille: f.pastille.checked,
        cibles: cibles,
        version: f.version.value.trim() || "2026-09",
      };
    }

    c.querySelector("#promo-form").addEventListener("submit", function (e) {
      e.preventDefault();
      localStorage.setItem("optic-alize-campagne", JSON.stringify(lireForm()));
      alert("Campagne enregistrée. Ouvrez le site pour la voir.");
      rendre("promo");
    });
  }

  /* ============================================================
     VISITEURS
     ============================================================ */
  function vueVisiteurs(c) {
    var st = statsVisite();
    var pages = Object.keys(st.pages || {}).map(function (k) { return { l: k, v: st.pages[k] }; }).sort(function (a, b) { return b.v - a.v; });
    var jours = Object.keys(st.jours || {}).sort().slice(-14).map(function (k) { return { l: k, v: st.jours[k] }; });
    c.innerHTML =
      "<h1>Visiteurs</h1>" +
      '<div class="ad-note">Ces chiffres ne comptent que <b>ce navigateur</b>. Pour de vraies statistiques multi-visiteurs, ajoutez un outil d\'analyse (Plausible, Matomo, Google Analytics).</div>' +
      '<div class="ad-cards">' +
      '<div class="ad-card"><span class="ad-card-v">' + (st.vues || 0) + '</span><span class="ad-card-l">Pages vues</span></div>' +
      '<div class="ad-card"><span class="ad-card-v">' + (st.sessions || 0) + '</span><span class="ad-card-l">Sessions</span></div>' +
      '<div class="ad-card"><span class="ad-card-v">' + (st.premiere ? st.premiere.slice(0, 10) : "-") + '</span><span class="ad-card-l">Premiere visite</span></div>' +
      '<div class="ad-card"><span class="ad-card-v">' + (st.derniere ? st.derniere.slice(0, 10) : "-") + '</span><span class="ad-card-l">Derniere visite</span></div>' +
      "</div>" +
      '<div class="ad-charts">' +
      barres("Pages les plus vues", pages) +
      barres("Visites par jour (14 derniers)", jours) +
      "</div>";
  }

  /* ============================================================
     E-MAILS
     ============================================================ */
  function vueEmails(c) {
    var liste = tousEmails();
    c.innerHTML =
      '<div class="ad-head"><h1>E-mails <span>(' + liste.length + ")</span></h1>" +
      '<div class="ad-actions">' +
      (liste.length ? '<button class="ad-btn" data-csv>Exporter CSV</button><button class="ad-btn ad-btn--primary" data-relance>Relancer par e-mail</button>' : "") +
      "</div></div>" +
      '<div class="ad-note">Collectes via les inscriptions de comptes et le formulaire newsletter du pied de page. Stockage local (ce navigateur).</div>' +
      (liste.length
        ? '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>E-mail</th><th>Nom</th><th>Source</th><th>Date</th></tr></thead><tbody>' +
          liste.map(function (e) {
            return "<tr><td>" + esc(e.email) + "</td><td>" + esc(e.nom) + "</td><td>" + esc(e.source) + "</td><td>" + esc(e.date) + "</td></tr>";
          }).join("") +
          "</tbody></table></div>"
        : '<p class="ad-empty">Aucun e-mail collecte pour le moment.</p>');

    var csv = c.querySelector("[data-csv]");
    if (csv) csv.addEventListener("click", function () {
      telecharger("emails-optic-alize.csv", toCSV(liste, ["email", "nom", "source", "date"]), "text/csv");
    });
    var rl = c.querySelector("[data-relance]");
    if (rl) rl.addEventListener("click", function () {
      var adrs = liste.map(function (e) { return e.email; }).join(",");
      var sujet = encodeURIComponent("Optic Alize - nos actualites");
      var corps = encodeURIComponent("Bonjour,\n\n[votre message]\n\nL'equipe Optic Alize");
      window.location.href = "mailto:?bcc=" + adrs + "&subject=" + sujet + "&body=" + corps;
    });
  }

  /* ============================================================
     MARKETING & RELATION CLIENT
     ============================================================ */
  function vueMarketing(c) {
    var st = statsVisite();
    var clics = st.clics || {};
    var rap = rappels().slice().sort(function (a, b) { return (a.echeance || "").localeCompare(b.echeance || ""); });
    var aujourdhui = new Date().toISOString().slice(0, 10);
    var echus = rap.filter(function (r) { return (r.echeance || "") <= aujourdhui; });
    var srcEmails = {};
    tousEmails().forEach(function (e) { srcEmails[e.source] = (srcEmails[e.source] || 0) + 1; });

    var cartes = [
      { l: "Clics WhatsApp", v: clics.whatsapp || 0 },
      { l: "Clics téléphone", v: clics.telephone || 0 },
      { l: "Clics « Rendez-vous »", v: clics["rendez-vous"] || 0 },
      { l: "Inscriptions pop-up", v: clics["inscription-popup"] || 0 },
      { l: "Rappels programmés", v: rap.length },
      { l: "Rappels à relancer", v: echus.length },
    ];

    c.innerHTML =
      '<div class="ad-head"><h1>Marketing <span>relation client</span></h1>' +
      '<div class="ad-actions">' +
      (rap.length ? '<button class="ad-btn" data-csv-rap>Exporter les rappels (CSV)</button>' : "") +
      (echus.length ? '<button class="ad-btn ad-btn--primary" data-relance-rap>Relancer les ' + echus.length + ' rappel(s) échu(s)</button>' : "") +
      "</div></div>" +
      '<div class="ad-note">Suivi local (ce navigateur) : clics sur les boutons de contact, inscriptions au pop-up de bienvenue et rappels de contrôle de vue. ' +
      'Pour des chiffres agrégés sur tous les visiteurs, renseignez <code>ga4Id</code> ou <code>metaPixelId</code> dans <code>js/marketing.js</code>.</div>' +
      '<div class="ad-cards">' +
      cartes.map(function (k) {
        return '<div class="ad-card"><span class="ad-card-v">' + k.v + '</span><span class="ad-card-l">' + esc(k.l) + "</span></div>";
      }).join("") +
      "</div>" +
      '<div class="ad-charts">' +
      barres("Origine des e-mails collectés", Object.keys(srcEmails).map(function (k) { return { l: k, v: srcEmails[k] }; })) +
      barres("Interactions par type", [
        { l: "whatsapp", v: clics.whatsapp || 0 },
        { l: "telephone", v: clics.telephone || 0 },
        { l: "email", v: clics.email || 0 },
        { l: "rendez-vous", v: clics["rendez-vous"] || 0 },
        { l: "rappel-vue", v: clics["rappel-vue"] || 0 },
      ]) +
      "</div>" +
      '<h3 style="margin:28px 0 14px;">Rappels de contrôle de vue</h3>' +
      (rap.length
        ? '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>E-mail</th><th>Échéance</th><th>Programmé le</th><th>Statut</th></tr></thead><tbody>' +
          rap.map(function (r) {
            var echu = (r.echeance || "") <= aujourdhui;
            return "<tr><td>" + esc(r.email) + "</td><td>" + esc(r.echeance || "") + "</td><td>" + esc(r.cree || "") +
              '</td><td>' + (echu ? '<b style="color:var(--corail)">À relancer</b>' : "En attente") + "</td></tr>";
          }).join("") +
          "</tbody></table></div>"
        : '<p class="ad-empty">Aucun rappel programmé pour le moment.</p>');

    var csv = c.querySelector("[data-csv-rap]");
    if (csv) csv.addEventListener("click", function () {
      telecharger("rappels-optic-alize.csv", toCSV(rap, ["email", "echeance", "cree"]), "text/csv");
    });
    var rl = c.querySelector("[data-relance-rap]");
    if (rl) rl.addEventListener("click", function () {
      var adrs = echus.map(function (r) { return r.email; }).join(",");
      var sujet = encodeURIComponent("Optic Alize - il est temps de controler votre vue");
      var corps = encodeURIComponent("Bonjour,\n\nCela fait un moment que nous n'avons pas verifie votre vue. Prenez rendez-vous dans l'une de nos agences : nous vous accueillons du lundi au samedi.\n\nL'equipe Optic Alize");
      window.location.href = "mailto:?bcc=" + adrs + "&subject=" + sujet + "&body=" + corps;
    });
  }

  /* ---------- init ---------- */
  if (estConnecte()) rendre("dashboard");
  else vueLogin();
})();
