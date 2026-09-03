# Optic Alizé — Application mobile (Android)

L'application est une **coquille native Capacitor** qui embarque le site vitrine.
Le même code HTML/CSS/JS sert au site *et* à l'app : on ne maintient qu'une seule base.

```
site vitrine (racine)  ──►  scripts/build-www.mjs  ──►  www/  ──►  Capacitor  ──►  APK / AAB Android
```

---

## 1. Pré-requis (déjà présents sur ce poste)

| Outil | Version installée | Rôle |
|-------|-------------------|------|
| Node.js | 24 | build du dossier `www/` + CLI Capacitor |
| JDK | 21 (`JAVA_HOME` = `C:\Users\HP\Desktop\SIR3\jdk-21`) | compilation Android |
| Android SDK | `C:\Users\HP\AppData\Local\Android\Sdk` | plateforme + build-tools |
| Android Studio | installé | ouverture du projet, émulateur, signature |

> Gradle **doit** tourner avec le JDK 21, pas le 24. `JAVA_HOME` est déjà réglé
> correctement. En cas de doute : `echo $env:JAVA_HOME` dans PowerShell.

---

## 2. Commandes

Depuis `c:\Users\HP\Downloads\optic-alize\optic-alize\` :

```bash
npm install              # une seule fois (déjà fait)

npm run build:www        # (re)génère www/ à partir du site
npm run sync             # build:www + copie dans le projet android/
npm run assets           # régénère icônes + splash depuis resources/icon.png & splash.png

npm run apk:debug        # APK de test (non signé) -> voir chemin ci-dessous
npm run open:android     # ouvre le projet dans Android Studio
```

### APK de test
```
android\app\build\outputs\apk\debug\app-debug.apk
```
Transférable directement sur un téléphone (activer « sources inconnues »).

---

## 3. Ce que `build-www.mjs` fait

- copie tout le site dans `www/` **sauf** :
  - `admin.html`, `js/admin.js`, `js/admin-config.js` (le back-office reste hors de l'app)
  - `hero-bg.mp4` (62 Mo) — remplacé sur l'accueil par `hero-poster.jpg`
  - les dossiers `_sources/`, les `LISEZ-MOI.txt`, captures d'écran, fichiers `.md`/`.py`
- ajoute à chaque page :
  - `viewport-fit=cover` (gestion de l'encoche)
  - `<meta name="theme-color">`
  - `css/app.css` (zones sûres, ajustements tactiles)
  - `js/app-shell.js` (liens externes → navigateur, bouton retour Android, splash)

`apropos-bg.mp4` (5,6 Mo) est conservé pour la page À propos.

Les fichiers modifiables pour l'app se trouvent dans **`mobile-src/`**
(`app.css`, `app-shell.js`). Ne pas éditer `www/` directement : il est recréé à chaque build.

---

## 4. Identité de l'app

| | |
|---|---|
| Nom | Optic Alizé |
| App ID | `bf.opticalize.app` |
| Couleur de fond / splash | `#F6F2EA` (sable) |
| Icône / splash source | `resources/icon.png`, `resources/splash.png` (générés par `scripts/make-assets.py`) |

Pour changer l'icône : remplacer `resources/icon.png` (1024×1024) puis `npm run assets && npm run sync`.

---

## 5. Publier sur le Google Play Store

1. Compte Google Play Console (25 $ une fois).
2. Générer une clé de signature :
   ```bash
   keytool -genkey -v -keystore optic-alize.keystore -alias optic-alize -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Renseigner la clé dans `android/keystore.properties` (voir modèle `android/keystore.properties.example` si présent) et `android/app/build.gradle`.
4. `npm run apk:release` puis, dans Android Studio : **Build > Generate Signed Bundle (AAB)**.
5. Téléverser le `.aab` dans la Play Console, remplir la fiche (captures, description, politique de confidentialité).

> iOS n'est **pas** possible depuis Windows : il faut un Mac avec Xcode.
> Le code est prêt (`npx cap add ios` le moment venu).

---

## 6. Dépannage

| Symptôme | Solution |
|----------|----------|
| `Unsupported class file major version` / erreur Gradle Java | Gradle utilise le JDK 24. Forcer : `$env:JAVA_HOME="C:\Users\HP\Desktop\SIR3\jdk-21"` avant la commande. |
| `SDK location not found` | `android/local.properties` doit contenir `sdk.dir=C\:\\Users\\HP\\AppData\\Local\\Android\\Sdk` (créé automatiquement par `scripts/gradle.mjs`). |
| Page blanche au lancement | `npm run sync` puis relancer. Vérifier que `www/index.html` existe. |
| Les liens WhatsApp / Maps ne s'ouvrent pas | `js/app-shell.js` doit être présent dans les pages `www/`. |
