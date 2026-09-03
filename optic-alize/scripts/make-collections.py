# Prépare les vignettes des "plus belles collections" (accueil).
# Chaque source -> collections/<slug>.jpg : image ENTIÈRE visible,
# centrée sur un fond blanc uniforme (format paysage 3:2).
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "collections")
SRC_DIR = os.path.join(OUT, "_sources")
os.makedirs(OUT, exist_ok=True)
os.makedirs(SRC_DIR, exist_ok=True)

# slug de marque  ->  fichier source (racine OU collections/_sources)
MAP = {
    "ray-ban": "ray-ban-wayfarer-rbr0502s-6708-3a-53-20-1-1684853590.jpeg",
    "persol": "Capture d'écran 2026-09-02 171021.png",
    "gucci": "Capture d'écran 2026-09-02 171243.png",
    "hugo-boss": "Capture d'écran 2026-09-02 171342.png",
    "randolph": "Capture d'écran 2026-09-02 171418.png",
    "maui-jim": "Capture d'écran 2026-09-02 171502.png",
    "cartier": "Capture d'écran 2026-09-02 171657.png",
    "marc-jacobs": "Capture d'écran 2026-09-02 171813.png",
    "chloe": "Capture d'écran 2026-09-02 171855.png",
    "dior": "Capture d'écran 2026-09-02 171940.png",
    "burberry": "Capture d'écran 2026-09-02 172012.png",
    "louis-vuitton": "luis vuitton.jpg",
}
EXTRA_SOURCES = [
    "Capture d'écran 2026-09-02 171136.png",
    "Capture d'écran 2026-09-02 172028.png",
]

CARD = (660, 440)        # format de la carte (paysage 3:2)
MARGE = 26               # marge blanche autour de la photo
BLANC = (255, 255, 255)


def trouver(nom):
    for d in (ROOT, SRC_DIR):
        p = os.path.join(d, nom)
        if os.path.exists(p):
            return p
    return None


for slug, fichier in MAP.items():
    src = trouver(fichier)
    if not src:
        print("  MANQUE :", fichier)
        continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    # retire d'éventuelles bordures blanches puis recadre au contenu
    zone = im.getbbox()
    if zone:
        im = im.crop(zone)
    dispo = (CARD[0] - 2 * MARGE, CARD[1] - 2 * MARGE)
    im.thumbnail(dispo, Image.LANCZOS)
    carte = Image.new("RGB", CARD, BLANC)
    carte.paste(im, ((CARD[0] - im.width) // 2, (CARD[1] - im.height) // 2))
    dest = os.path.join(OUT, slug + ".jpg")
    carte.save(dest, quality=85, optimize=True, progressive=True)
    print("  OK  collections/%s.jpg" % slug)
    # range la source si elle était à la racine
    if os.path.dirname(src) == ROOT:
        os.replace(src, os.path.join(SRC_DIR, fichier))

for fichier in EXTRA_SOURCES:
    p = os.path.join(ROOT, fichier)
    if os.path.exists(p):
        os.replace(p, os.path.join(SRC_DIR, fichier))

print("\nTermine.")
