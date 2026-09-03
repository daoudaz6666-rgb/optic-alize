/* Ajoute à chaque page publique :
   - les balises Open Graph / Twitter (partage Facebook, WhatsApp…)
   - le script js/marketing.js
   Idempotent : relançable sans dupliquer.
   Lancer :  node scripts/add-marketing.mjs
*/
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE_URL = "https://www.opticalize.com";
const OG_IMAGE = SITE_URL + "/hero-poster.jpg";

const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html") && f !== "admin.html");

let n = 0;
for (const nom of pages) {
  const chemin = join(ROOT, nom);
  let html = readFileSync(chemin, "utf8");
  const avant = html;

  const titre = (html.match(/<title>([^<]*)<\/title>/) || [, "Optic Alizé"])[1].trim();
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1].trim();
  const url = SITE_URL + "/" + nom;

  /* --- Open Graph / Twitter --- */
  if (!html.includes('property="og:')) {
    const bloc =
      `<meta property="og:type" content="website">\n` +
      `<meta property="og:site_name" content="Optic Alizé">\n` +
      `<meta property="og:locale" content="fr_FR">\n` +
      `<meta property="og:title" content="${titre.replace(/"/g, "&quot;")}">\n` +
      `<meta property="og:description" content="${desc.replace(/"/g, "&quot;")}">\n` +
      `<meta property="og:url" content="${url}">\n` +
      `<meta property="og:image" content="${OG_IMAGE}">\n` +
      `<meta name="twitter:card" content="summary_large_image">\n` +
      `<meta name="twitter:title" content="${titre.replace(/"/g, "&quot;")}">\n` +
      `<meta name="twitter:description" content="${desc.replace(/"/g, "&quot;")}">\n` +
      `<meta name="twitter:image" content="${OG_IMAGE}">\n`;
    html = html.replace(
      /(<link rel="stylesheet" href="css\/style\.css">)/,
      bloc + "$1"
    );
  }

  /* --- script marketing.js (après widgets.js, sinon avant </body>) --- */
  if (!html.includes("js/marketing.js")) {
    if (html.includes('<script src="js/widgets.js"></script>')) {
      html = html.replace(
        '<script src="js/widgets.js"></script>',
        '<script src="js/widgets.js"></script>\n<script src="js/marketing.js" defer></script>'
      );
    } else {
      html = html.replace(/<\/body>/, '<script src="js/marketing.js" defer></script>\n</body>');
    }
  }

  if (html !== avant) {
    writeFileSync(chemin, html);
    n++;
    console.log("maj  " + nom);
  } else {
    console.log("ok   " + nom + " (déjà à jour)");
  }
}
console.log(`\n${n} page(s) modifiée(s) sur ${pages.length}.`);
