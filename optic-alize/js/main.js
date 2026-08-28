/* ============================================================
   OPTIC ALIZÉ — script principal
   Navigation, animations de mise au point (scroll reveal), hero
   ============================================================ */

/* Si une photo produit est absente (404), on retombe sur le pictogramme SVG */
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (
      img instanceof HTMLImageElement &&
      img.classList.contains("product-photo") &&
      img.dataset.fallback
    ) {
      img.insertAdjacentHTML("afterend", decodeURIComponent(img.dataset.fallback));
      img.remove();
    }
  },
  true
);

document.addEventListener("DOMContentLoaded", () => {
  /* Menu mobile */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
    nav.querySelectorAll("a:not(.nav-mega-trigger)").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* Onglet Optique — méga-menu (survol sur desktop, accordéon sur mobile) */
  const megaItem = document.getElementById("nav-optique");
  const header = document.querySelector(".site-header");
  if (megaItem && header) {
    const trigger = megaItem.querySelector(".nav-mega-trigger");
    const mqMobile = window.matchMedia("(max-width: 980px)");
    let closeTimer;
    const openMega = () => { clearTimeout(closeTimer); header.classList.add("mega-open"); };
    const closeMega = () => { closeTimer = setTimeout(() => header.classList.remove("mega-open"), 160); };

    megaItem.addEventListener("mouseenter", () => { if (!mqMobile.matches) openMega(); });
    megaItem.addEventListener("mouseleave", () => { if (!mqMobile.matches) closeMega(); });
    megaItem.addEventListener("focusin", () => { if (!mqMobile.matches) openMega(); });
    megaItem.addEventListener("focusout", () => { if (!mqMobile.matches) closeMega(); });

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (mqMobile.matches) {
        megaItem.classList.toggle("open");
      } else {
        header.classList.toggle("mega-open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        header.classList.remove("mega-open");
        megaItem.classList.remove("open");
      }
    });
    document.addEventListener("click", (e) => {
      if (!mqMobile.matches && !megaItem.contains(e.target)) header.classList.remove("mega-open");
    });
  }

  /* Mise au point progressive du visuel du hero */
  const focusFrame = document.querySelector(".focus-frame");
  if (focusFrame) {
    requestAnimationFrame(() => {
      setTimeout(() => focusFrame.classList.add("in-focus"), 200);
    });
  }

  /* Effet machine à écrire du titre du hero (écrit / efface en boucle) */
  const twEl = document.querySelector(".typewriter");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (twEl && twEl.dataset.words) {
    const words = twEl.dataset.words.split("|").map((w) => w.trim()).filter(Boolean);
    if (prefersReducedMotion) {
      twEl.textContent = words[0] || "";
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const typeSpeed = 65;
      const deleteSpeed = 35;
      const holdFull = 2200;
      const holdEmpty = 500;

      const tick = () => {
        const current = words[wordIndex];
        if (!deleting) {
          charIndex++;
          twEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            return setTimeout(tick, holdFull);
          }
          return setTimeout(tick, typeSpeed);
        }
        charIndex--;
        twEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          return setTimeout(tick, holdEmpty);
        }
        setTimeout(tick, deleteSpeed);
      };

      setTimeout(tick, 500);
    }
  }

  /* Effet "mise au point" au défilement */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }
});
