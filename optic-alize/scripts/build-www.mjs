/* ============================================================
   OPTIC ALIZÉ — assemble le dossier www/ pour l'app Capacitor
   à partir du site vitrine (fichiers à la racine).

   Lancer :  npm run build:www
   ============================================================ */
import {
  cpSync,
  rmSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, sep, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const WWW = join(ROOT, "www");

/* --- dossiers / fichiers exclus de l'app --- */
const DIRS_EXCLUS = new Set([
  ".git",
  ".vscode",
  ".claude",
  "node_modules",
  "www",
  "android",
  "ios",
  "scripts",
  "resources",
  "mobile-src",
]);
const FICHIERS_EXCLUS = new Set([
  "admin.html",
  "js/admin.js",
  "js/admin-config.js",
  "hero-bg.mp4",
  "logo-optic-alize.jpg",
  "lentille de vue.jpg",
  "lunette de soleil.jpg",
  "lunette de vue.jpg",
  "package.json",
  "package-lock.json",
  "capacitor.config.json",
  "robots.txt",
  ".gitignore",
]);

function garder(src) {
  const rel = relative(ROOT, src);
  if (!rel) return true;
  const parts = rel.split(sep);
  if (DIRS_EXCLUS.has(parts[0])) return false;
  if (parts.includes("_sources")) return false;
  const base = basename(src);
  if (base === "LISEZ-MOI.txt" || base === "README.md") return false;
  if (/^Capture d.?.cran/i.test(base)) return false;
  if (/\.(md|py)$/i.test(base)) return false;
  if (FICHIERS_EXCLUS.has(rel.split(sep).join("/"))) return false;
  return true;
}

/* --- 1. copie (marche récursive manuelle : cpSync refuse ROOT -> ROOT/www) --- */
function copier(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true });
  for (const entree of readdirSync(srcDir)) {
    const src = join(srcDir, entree);
    if (!garder(src)) continue;
    const dst = join(dstDir, entree);
    if (statSync(src).isDirectory()) copier(src, dst);
    else cpSync(src, dst);
  }
}
rmSync(WWW, { recursive: true, force: true });
copier(ROOT, WWW);

/* --- 2. fichiers propres à l'app --- */
cpSync(join(ROOT, "mobile-src", "app.css"), join(WWW, "css", "app.css"));
cpSync(join(ROOT, "mobile-src", "app-shell.js"), join(WWW, "js", "app-shell.js"));

/* --- 3. retouche des pages HTML --- */
const pages = readdirSync(WWW).filter((f) => f.endsWith(".html"));
for (const nom of pages) {
  const chemin = join(WWW, nom);
  let html = readFileSync(chemin, "utf8");

  // viewport plein écran (encoche)
  html = html.replace(
    /(<meta name="viewport" content="width=device-width, initial-scale=1\.0)("\s*\/?>)/,
    '$1, viewport-fit=cover$2'
  );

  // couleur de thème + feuille de style de l'app, juste après style.css
  html = html.replace(
    /(<link rel="stylesheet" href="css\/style\.css">)/,
    '<meta name="theme-color" content="#F6F2EA">\n$1\n<link rel="stylesheet" href="css/app.css">'
  );

  // script du pont natif
  html = html.replace(
    /<\/body>/,
    '<script src="js/app-shell.js"></script>\n</body>'
  );

  // page d'accueil : la vidéo hero (62 Mo) devient un poster statique
  if (nom === "index.html") {
    html = html.replace(
      /<video class="hero-video"[\s\S]*?<\/video>/,
      '<img class="hero-video" src="hero-poster.jpg" alt="" aria-hidden="true">'
    );
  }

  writeFileSync(chemin, html);
}

console.log(`www/ prêt — ${pages.length} pages, vidéo hero remplacée par hero-poster.jpg`);
