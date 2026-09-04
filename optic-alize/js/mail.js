/* ============================================================
   OPTIC ALIZÉ — envoi d'e-mails depuis le site (FormSubmit.co)

   Site statique = pas de serveur mail. On passe par FormSubmit.co :
   les formulaires envoient leurs données à cette adresse.

   ⚠️ ACTIVATION (une seule fois) : au tout premier envoi, FormSubmit
   envoie un e-mail « Activate Form » à l'adresse ci-dessous.
   Il faut cliquer le lien dedans une fois — ensuite tout fonctionne.

   Pour cacher l'adresse du code source : après activation, FormSubmit
   fournit une clé (ex. "abc123..."). Remplacez alors MAIL_DEST par
   cette clé (le reste du code ne change pas).
   ============================================================ */
window.MAIL_DEST = "daoudazongo737@gmail.com";

/* Envoie un e-mail. `champs` = objet { "Nom": "...", "Téléphone": "..." }.
   Appelle cb(ok) — ok = true si l'e-mail est parti. */
window.envoyerEmailSite = function (sujet, champs, cb) {
  cb = cb || function () {};
  var corps = Object.assign(
    {
      _subject: sujet || "Nouveau message — site Optic Alizé",
      _template: "table",
      _captcha: "false",
    },
    champs || {}
  );
  try {
    fetch("https://formsubmit.co/ajax/" + window.MAIL_DEST, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(corps),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) { cb(!!(d && (d.success === true || d.success === "true")), d); })
      .catch(function () { cb(false); });
  } catch (e) {
    cb(false);
  }
};
