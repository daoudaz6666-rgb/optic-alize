# Génère les visuels de l'app à partir du logo + une photo :
#   - hero-poster.jpg  (remplace la vidéo hero dans l'app)
#   - resources/icon.png   (1024x1024, pour @capacitor/assets)
#   - resources/splash.png (2732x2732, pour @capacitor/assets)
from PIL import Image, ImageOps
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SABLE = (246, 242, 234)

os.makedirs(os.path.join(ROOT, "resources"), exist_ok=True)

# ---- hero-poster.jpg : photo lunettes, cadrée large ----
src = os.path.join(ROOT, "lunette de vue.jpg")
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
poster = ImageOps.fit(im, (1600, 1000), method=Image.LANCZOS, centering=(0.5, 0.4))
poster.save(os.path.join(ROOT, "hero-poster.jpg"), quality=82, optimize=True, progressive=True)
print("hero-poster.jpg", poster.size)

# ---- logo en RVBA ----
logo = Image.open(os.path.join(ROOT, "logo-optic-alize.png")).convert("RGBA")

def compose(canvas_size, logo_ratio):
    canvas = Image.new("RGB", (canvas_size, canvas_size), SABLE)
    target_w = int(canvas_size * logo_ratio)
    scale = target_w / logo.width
    target_h = int(logo.height * scale)
    resized = logo.resize((target_w, target_h), Image.LANCZOS)
    pos = ((canvas_size - target_w) // 2, (canvas_size - target_h) // 2)
    canvas.paste(resized, pos, resized)
    return canvas

compose(1024, 0.70).save(os.path.join(ROOT, "resources", "icon.png"))
compose(2732, 0.34).save(os.path.join(ROOT, "resources", "splash.png"))
print("resources/icon.png + resources/splash.png OK")
