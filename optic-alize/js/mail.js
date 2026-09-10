/* ============================================================
   OPTIC ALIZÉ — envoi d'e-mails depuis le site (EmailJS)

   Site statique = pas de serveur mail. Le SDK EmailJS envoie
   directement depuis le navigateur du visiteur via le service e-mail
   connecté sur https://dashboard.emailjs.com/ (Gmail).

   Ces 3 identifiants sont publics (prévus pour être dans le code
   source, comme une clé d'API front-end) :
     - clé publique  : Account → General
     - Service ID    : Email Services
     - Template ID   : Email Templates
   Dans le template EmailJS, utiliser les variables {{subject}} et
   {{message}} (et éventuellement {{from_name}} / {{email}} pour le
   nom et l'adresse de réponse du visiteur).
   ============================================================ */
window.EMAILJS_PUBLIC_KEY = "ArXzZiONApNvyf44M";
window.EMAILJS_SERVICE_ID = "service_nfalcxt";
window.EMAILJS_TEMPLATE_ID = "template_dhqytua";

/* Garde MAIL_DEST pour compatibilité (affiché nulle part côté EmailJS,
   mais utile comme repère de l'adresse de test actuelle). */
window.MAIL_DEST = "daoudazongo737@gmail.com";

var _emailjsAttente = null;
function chargerEmailJS(cb) {
  if (window.emailjs) { cb(); return; }
  if (_emailjsAttente) { _emailjsAttente.push(cb); return; }
  _emailjsAttente = [cb];
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  s.onload = function () {
    window.emailjs.init({ publicKey: window.EMAILJS_PUBLIC_KEY });
    _emailjsAttente.forEach(function (f) { f(); });
    _emailjsAttente = null;
  };
  s.onerror = function () {
    _emailjsAttente.forEach(function (f) { f(); });
    _emailjsAttente = null;
  };
  document.head.appendChild(s);
}

/* Envoie un e-mail. `champs` = objet { "Nom": "...", "Téléphone": "..." }.
   Appelle cb(ok) — ok = true si l'e-mail est parti. */
window.envoyerEmailSite = function (sujet, champs, cb) {
  cb = cb || function () {};
  champs = champs || {};
  var cles = Object.keys(champs);
  var lignes = cles.map(function (k) { return k + " : " + champs[k]; });
  var cleNom = cles.find(function (k) { return /nom/i.test(k); });
  var cleEmail = cles.find(function (k) { return /e-?mail/i.test(k); });

  var params = {
    subject: sujet || "Nouveau message — site Optic Alizé",
    message: lignes.join("\n"),
    from_name: cleNom ? champs[cleNom] : "Site Optic Alizé",
    email: cleEmail ? champs[cleEmail] : "",
  };

  try {
    chargerEmailJS(function () {
      if (!window.emailjs) { cb(false); return; }
      window.emailjs
        .send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, params)
        .then(function () { cb(true); })
        .catch(function () { cb(false); });
    });
  } catch (e) {
    cb(false);
  }
};
