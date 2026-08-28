/* ============================================================
   OPTIC ALIZÉ — carrousel produits (défilement horizontal)

   Sur chaque bloc [data-carousel] :
   - flèches précédent / suivant (masquées sur mobile, on swipe)
   - glisser-déposer à la souris

   [data-carousel-autoplay] en plus :
   - défilement automatique et continu
   - pause dès que le curseur (ou le focus clavier) est sur le carrousel
   - boucle sans couture (le contenu est dupliqué)
   - désactivé si l'utilisateur a demandé "moins d'animations"

   Le contenu de .carousel-viewport peut être rempli après coup
   (rendu JS) : on observe les changements pour (re)configurer.
   ============================================================ */

function initCarousel(root) {
  const viewport = root.querySelector(".carousel-viewport");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  if (!viewport) return;

  const autoplay =
    root.hasAttribute("data-carousel-autoplay") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const VITESSE = 0.6; // pixels par frame (~35 px/s)

  let originauxCount = 0;
  let boucleLargeur = 0;

  function mesurerBoucle() {
    if (!originauxCount || !viewport.children[originauxCount]) return 0;
    return viewport.children[originauxCount].offsetLeft - viewport.children[0].offsetLeft;
  }

  /* Duplique une fois le contenu pour permettre la boucle infinie */
  function doubler() {
    if (viewport.dataset.doubled === "1") return;
    const cartes = Array.from(viewport.children);
    if (!cartes.length) return;
    originauxCount = cartes.length;
    const fragment = document.createDocumentFragment();
    cartes.forEach((c) => {
      const clone = c.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, input, [tabindex]").forEach((el) => (el.tabIndex = -1));
      fragment.appendChild(clone);
    });
    viewport.dataset.doubled = "1"; // avant l'append pour éviter la ré-entrée du MutationObserver
    viewport.appendChild(fragment);
    boucleLargeur = mesurerBoucle();
  }

  function pas() {
    const carte = viewport.firstElementChild;
    const gap = parseFloat(getComputedStyle(viewport).columnGap) || 16;
    const largeurCarte = carte ? carte.getBoundingClientRect().width + gap : viewport.clientWidth * 0.8;
    return Math.max(largeurCarte, viewport.clientWidth * 0.55);
  }

  function majBoutons() {
    if (viewport.dataset.doubled === "1") {
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
      return;
    }
    const max = viewport.scrollWidth - viewport.clientWidth - 2;
    const scrollable = viewport.scrollWidth > viewport.clientWidth + 4;
    if (prev) prev.disabled = !scrollable || viewport.scrollLeft <= 2;
    if (next) next.disabled = !scrollable || viewport.scrollLeft >= max;
  }

  function recadrer() {
    if (!boucleLargeur) boucleLargeur = mesurerBoucle();
    if (!boucleLargeur) return;
    if (viewport.scrollLeft >= boucleLargeur) viewport.scrollLeft -= boucleLargeur;
    else if (viewport.scrollLeft < 0) viewport.scrollLeft += boucleLargeur;
  }

  if (prev)
    prev.addEventListener("click", () => {
      if (boucleLargeur && viewport.scrollLeft < pas()) viewport.scrollLeft += boucleLargeur;
      viewport.scrollBy({ left: -pas(), behavior: "smooth" });
    });
  if (next)
    next.addEventListener("click", () => viewport.scrollBy({ left: pas(), behavior: "smooth" }));

  viewport.addEventListener(
    "scroll",
    () => {
      majBoutons();
      if (boucleLargeur) recadrer();
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    boucleLargeur = mesurerBoucle();
    majBoutons();
  });
  window.addEventListener("load", () => {
    boucleLargeur = mesurerBoucle();
  });

  /* glisser à la souris */
  let down = false,
    startX = 0,
    startScroll = 0,
    moved = false;
  viewport.addEventListener("mousedown", (e) => {
    down = true;
    moved = false;
    startX = e.pageX;
    startScroll = viewport.scrollLeft;
    viewport.classList.add("dragging");
  });
  window.addEventListener("mousemove", (e) => {
    if (!down) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    viewport.scrollLeft = startScroll - dx;
  });
  window.addEventListener("mouseup", () => {
    if (!down) return;
    down = false;
    viewport.classList.remove("dragging");
    majBoutons();
  });
  viewport.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true
  );

  /* ---------- défilement automatique ---------- */
  let rafId = null;
  let enPause = false;

  function tick() {
    if (!enPause && !down) {
      viewport.scrollLeft += VITESSE;
      recadrer();
    }
    rafId = requestAnimationFrame(tick);
  }
  function demarrerAutoplay() {
    if (rafId != null) return;
    doubler();
    viewport.classList.add("autoplaying");
    rafId = requestAnimationFrame(tick);
  }
  const pause = () => (enPause = true);
  const reprise = () => (enPause = false);

  if (autoplay) {
    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", reprise);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", reprise);
    viewport.addEventListener("touchstart", pause, { passive: true });
    viewport.addEventListener("touchend", reprise, { passive: true });
    document.addEventListener("visibilitychange", () => {
      enPause = document.hidden;
    });
  }

  /* (re)configuration quand le contenu arrive */
  function configurer() {
    if (viewport.dataset.doubled === "1") return; // déjà fait
    if (!viewport.children.length) return;
    if (autoplay) demarrerAutoplay();
    boucleLargeur = mesurerBoucle();
    majBoutons();
  }

  if ("MutationObserver" in window) {
    new MutationObserver(configurer).observe(viewport, { childList: true });
  }
  configurer();
  majBoutons();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
});
