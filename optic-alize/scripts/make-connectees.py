# Prépare les images de la page "Lunettes connectées".
# Chaque image est affichée ENTIÈREMENT (aucun recadrage) :
# on la pose centrée sur un fond blanc au format 16:9.
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "connectees")
SRC = os.path.join(OUT, "_sources")
os.makedirs(SRC, exist_ok=True)

CARD = (960, 540)         # 16:9
MARGE = 24
BLANC = (255, 255, 255)


def charge(nom):
    for d in (ROOT, OUT, SRC):
        p = os.path.join(d, nom)
        if os.path.exists(p):
            return ImageOps.exif_transpose(Image.open(p)).convert("RGB"), p
    return None, None


def ranger(p):
    if p and os.path.dirname(p) in (ROOT, OUT):
        os.replace(p, os.path.join(SRC, os.path.basename(p)))


def trim_sombre(im, seuil=28):
    """Retire les bandes quasi noires (letterbox de capture d'écran)."""
    from PIL import ImageChops
    gris = im.convert("L")
    masque = gris.point(lambda v: 255 if v > seuil else 0)
    z = masque.getbbox()
    return im.crop(z) if z else im


def poser(im, dest, rogne_bas=0.0, recadre_contenu=False, trim=False):
    if rogne_bas:
        w, h = im.size
        im = im.crop((0, 0, w, int(h * (1 - rogne_bas))))
    if trim:
        im = trim_sombre(im)
    if recadre_contenu:
        z = im.getbbox()
        if z:
            im = im.crop(z)
    im.thumbnail((CARD[0] - 2 * MARGE, CARD[1] - 2 * MARGE), Image.LANCZOS)
    carte = Image.new("RGB", CARD, BLANC)
    carte.paste(im, ((CARD[0] - im.width) // 2, (CARD[1] - im.height) // 2))
    carte.save(dest, quality=86, optimize=True, progressive=True)
    print("  OK ", os.path.relpath(dest, ROOT))


im, p = charge("Capture d'écran 2026-09-02 175146.png")
if im:
    poser(im, os.path.join(OUT, "audio.jpg"), rogne_bas=0.13, trim=True)
    ranger(p)

im, p = charge("featured-test-des-meacode-ai-smart-glasses-assistant-vocal-et-capture-hd.jpg")
if im:
    poser(im, os.path.join(OUT, "assistant.jpg"), recadre_contenu=True)
    ranger(p)

_, p = charge("Capture d'écran 2026-09-02 175300.png")
ranger(p)

im, p = charge("Capture d'écran 2026-09-02 180145.png")
if im:
    poser(im, os.path.join(OUT, "lumiere.jpg"), recadre_contenu=True)
    ranger(p)

print("\nTermine.")
