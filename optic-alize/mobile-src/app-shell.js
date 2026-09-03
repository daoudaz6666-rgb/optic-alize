/* ============================================================
   OPTIC ALIZÉ — pont application native (Capacitor)
   Chargé uniquement dans la version app (ajouté par build-www.mjs).
   - ouvre les liens externes dans le navigateur / in-app browser
   - gère le bouton retour Android
   - masque l'écran de démarrage quand la page est prête
   ============================================================ */
(function () {
  var Cap = window.Capacitor || {};
  var P = Cap.Plugins || {};

  /* ---- Liens externes ---- */
  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var isHttp = /^https?:\/\//i.test(href);
      var isTelMail = /^(tel:|mailto:|sms:|whatsapp:)/i.test(href);
      if (!isHttp && !isTelMail) return; // lien interne -> navigation normale
      e.preventDefault();
      if (isHttp && P.Browser) {
        P.Browser.open({ url: href, presentationStyle: "popover" });
      } else {
        window.open(href, "_system");
      }
    },
    true
  );

  /* ---- Bouton retour Android ---- */
  if (P.App && P.App.addListener) {
    P.App.addListener("backButton", function (info) {
      var openNav = document.querySelector(".main-nav.open");
      if (openNav) {
        openNav.classList.remove("open");
        return;
      }
      var chat = document.querySelector(".chat-panel:not([hidden])");
      if (chat) {
        chat.setAttribute("hidden", "");
        return;
      }
      if (info && info.canGoBack) {
        window.history.back();
      } else {
        P.App.exitApp();
      }
    });
  }

  /* ---- Écran de démarrage ---- */
  window.addEventListener("load", function () {
    if (P.SplashScreen) {
      setTimeout(function () {
        P.SplashScreen.hide();
      }, 250);
    }
  });
})();
