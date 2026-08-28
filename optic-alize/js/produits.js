/* ============================================================
   OPTIC ALIZÉ — catalogue produits
   Données de démonstration : à remplacer par le vrai catalogue
   (photos réelles, prix, stock) lorsque disponible.
   ============================================================ */

const PALETTE = {
  encre: "#12303D",
  turquoise: "#2E9C96",
  or: "#C79A4B",
  corail: "#E2725B",
  sable: "#ECE5D6",
};

/* Génère un pictogramme de lunettes en SVG, paramétré par forme + couleur.
   Sert d'illustration produit tant qu'il n'y a pas de vraies photos. */
function iconLunettes(forme, couleur, options = {}) {
  const c = couleur || PALETTE.encre;
  const stroke = options.stroke ?? 4;
  const shapes = {
    ronde: `<circle cx="60" cy="90" r="42" /><circle cx="164" cy="90" r="42" />`,
    carre: `<rect x="20" y="50" width="80" height="80" rx="10" /><rect x="124" y="50" width="80" height="80" rx="10" />`,
    ovale: `<ellipse cx="60" cy="90" rx="46" ry="36" /><ellipse cx="164" cy="90" rx="46" ry="36" />`,
    papillon: `<path d="M18 60 Q60 30 100 70 Q60 130 18 110 Z" /><path d="M226 60 Q184 30 144 70 Q184 130 226 110 Z" />`,
    pilote: `<path d="M18 90 Q18 45 60 45 Q102 45 102 90 Q102 128 60 128 Q18 128 18 90 Z" /><path d="M142 90 Q142 45 184 45 Q226 45 226 90 Q226 128 184 128 Q142 128 142 90 Z" />`,
  };
  const path = shapes[forme] || shapes.ronde;
  return `<svg viewBox="0 0 244 180" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${c}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    ${path}
    <path d="M102 88 Q122 76 142 88" />
    <path d="M18 82 L2 74" />
    <path d="M226 82 L242 74" />
  </svg>`;
}

/* Pictogramme boîte de lentilles */
function iconLentilles(couleur) {
  const c = couleur || PALETTE.turquoise;
  return `<svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="30" y="40" width="60" height="110" rx="8" />
    <ellipse cx="60" cy="40" rx="30" ry="10" />
    <rect x="110" y="40" width="60" height="110" rx="8" />
    <ellipse cx="140" cy="40" rx="30" ry="10" />
    <circle cx="60" cy="95" r="16" stroke-dasharray="3 5" />
    <circle cx="140" cy="95" r="16" stroke-dasharray="3 5" />
  </svg>`;
}

const PRODUITS = [
  { id: "m001", categorie: "montures", type: "vue", genre: "femme", forme: "ovale", nom: "Alizé Ovale Écaille", marque: "Optic Alizé", prix: 32000, couleur: "#5A3E2B", couleurs: ["#5A3E2B", "#12303D", "#C79A4B"], photo: "montures/m001.jpg", desc: "Monture légère en acétate, charnières flex.", nouveau: true },
  { id: "m002", categorie: "montures", type: "vue", genre: "homme", forme: "carre", nom: "Zéphyr Carrée Noire", marque: "Optic Alizé", prix: 28000, couleur: "#12303D", couleurs: ["#12303D", "#6B7A80"], photo: "montures/m002.jpg", desc: "Ligne droite, esprit urbain, très résistante." },
  { id: "m003", categorie: "montures", type: "soleil", genre: "femme", forme: "papillon", nom: "Mistral Papillon", marque: "Optic Alizé", prix: 35000, couleur: "#C79A4B", couleurs: ["#C79A4B", "#E2725B"], photo: "montures/m003.jpg", desc: "Verres solaires polarisés, protection UV400.", nouveau: true },
  { id: "m004", categorie: "montures", type: "soleil", genre: "homme", forme: "pilote", nom: "Harmattan Pilote", marque: "Optic Alizé", prix: 30000, couleur: "#2E9C96", couleurs: ["#2E9C96", "#12303D"], photo: "montures/m004.jpg", desc: "Monture métal fine, style intemporel." },
  { id: "m005", categorie: "montures", type: "vue", genre: "enfant", forme: "ronde", nom: "Petit Alizé Ronde", marque: "Optic Alizé", prix: 18000, couleur: "#E2725B", couleurs: ["#E2725B", "#2E9C96"], photo: "montures/m005.jpg", desc: "Souple et incassable, pensée pour les enfants." },
  { id: "m006", categorie: "montures", type: "vue", genre: "femme", forme: "ronde", nom: "Brise Ronde Dorée", marque: "Optic Alizé", prix: 33000, couleur: "#C79A4B", couleurs: ["#C79A4B", "#12303D"], photo: "montures/m006.jpg", desc: "Finition dorée, monture fine et élégante." },
  { id: "m007", categorie: "montures", type: "vue", genre: "homme", forme: "ovale", nom: "Sirocco Ovale", marque: "Optic Alizé", prix: 27000, couleur: "#6B7A80", couleurs: ["#6B7A80", "#12303D"], photo: "montures/m007.jpg", desc: "Confort au quotidien, très légère." },
  { id: "m008", categorie: "montures", type: "soleil", genre: "femme", forme: "carre", nom: "Tramontane Carrée", marque: "Optic Alizé", prix: 34000, couleur: "#12303D", couleurs: ["#12303D", "#E2725B"], photo: "montures/m008.jpg", desc: "Verres teintés dégradés, monture acétate." },

  { id: "l001", categorie: "lentilles", frequence: "journaliere", correction: "myopie", nom: "Alizé Day Myopie", marque: "OptiVision", prix: 12000, photo: "lentilles/lentilles-hydratees.jpg", desc: "Boîte de 30 lentilles journalières, confort longue durée." },
  { id: "l002", categorie: "lentilles", frequence: "mensuelle", correction: "astigmatie", nom: "Alizé Tor Mensuelle", marque: "OptiVision", prix: 15000, photo: "lentilles/lentille-doigt.jpg", desc: "Boîte de 6 lentilles pour astigmatie, silicone hydrogel." },
  { id: "l003", categorie: "lentilles", frequence: "journaliere", correction: "hypermetropie", nom: "Alizé Day Hypermétropie", marque: "OptiVision", prix: 12500, photo: "lentilles/paire-lentilles.jpg", desc: "Boîte de 30 lentilles, forte teneur en eau." },
  { id: "l004", categorie: "lentilles", frequence: "mensuelle", correction: "myopie", nom: "Alizé Clear Mensuelle", marque: "OptiVision", prix: 14000, photo: "lentilles/lentille-doigt.jpg", desc: "Boîte de 6 lentilles, respirabilité optimale." },
  { id: "l005", categorie: "lentilles", frequence: "bi-mensuelle", correction: "presbytie", nom: "Alizé Progressive", marque: "OptiVision", prix: 17000, photo: "lentilles/paire-lentilles.jpg", desc: "Boîte de 6, vision de près et de loin." },
  { id: "l006", categorie: "lentilles", frequence: "journaliere", correction: "astigmatie", nom: "Alizé Day Tor", marque: "OptiVision", prix: 13500, photo: "lentilles/lentilles-hydratees.jpg", desc: "Boîte de 30 lentilles journalières pour astigmates." },
];

/* Catalogue d'origine (avant toute modification via la page admin). */
const PRODUITS_DEFAUT = JSON.parse(JSON.stringify(PRODUITS));

/* Surcharge possible depuis la page d'administration (localStorage).
   Permet a l'admin de previsualiser ses modifications sur le site.
   N'affecte que le navigateur de l'admin, pas les autres visiteurs. */
(function appliquerAdminProduits() {
  try {
    const o = JSON.parse(localStorage.getItem("optic-alize-admin-produits"));
    if (Array.isArray(o) && o.length) {
      PRODUITS.length = 0;
      o.forEach((p) => PRODUITS.push(p));
    }
  } catch (e) {}
})();

function formatFCFA(montant) {
  return montant.toLocaleString("fr-FR").replace(/\u202f|,/g, " ") + " FCFA";
}

/* Illustration produit : photo si disponible (p.photo), sinon pictogramme SVG.
   Si la photo est absente/404, le SVG reprend automatiquement le relais
   (voir le gestionnaire délégué dans main.js). */
function getProduitSvg(p) {
  if (p.categorie === "lentilles") return iconLentilles(PALETTE.turquoise);
  return iconLunettes(p.forme, p.couleur);
}

function getProduitIcon(p) {
  const svg = getProduitSvg(p);
  if (p.photo) {
    return `<img class="product-photo" src="${p.photo}" alt="${p.nom}" loading="lazy"
      data-fallback="${encodeURIComponent(svg)}">`;
  }
  return svg;
}
