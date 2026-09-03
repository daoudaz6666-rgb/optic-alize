# Optic Alizé — Application mobile native (Flutter)

Application **100 % native** écrite en Flutter/Dart, dans `mobile_flutter/`.
Rien de web à l'intérieur : navigation native, barre d'onglets en bas, transitions natives.

> Le catalogue, les verres, les offres, les conseils et les actualités sont repris
> **à l'identique** du site (portés depuis `js/produits.js`, `js/verres.js`,
> `js/publications.js`). Les photos sont embarquées dans `assets/`.

---

## Écrans

| Onglet | Contenu |
|--------|---------|
| **Accueil** | bandeau, univers, nouveautés, sélection, offres, actualités, contact rapide |
| **Optique** | catalogue montures + lentilles, avec filtres (type, genre, fréquence) → fiche produit → ajout panier |
| **Rendez-vous** | formulaire complet → envoi de la demande par WhatsApp |
| **Panier** | quantités, total, commande par WhatsApp (persisté sur l'appareil) |
| **Infos** | À propos, Nos verres, Nos offres, Conseils, téléphone / WhatsApp / e-mail / carte |

---

## Pré-requis (présents sur ce poste)

| Outil | Emplacement |
|-------|-------------|
| Flutter | `C:\src\flutter` (stable 3.41) |
| JDK 21 | `C:\Users\HP\Desktop\SIR3\jdk-21` (`JAVA_HOME`) |
| Android SDK | `C:\Users\HP\AppData\Local\Android\Sdk` |

Ajouter Flutter au PATH pour la session :
```powershell
$env:PATH += ";C:\src\flutter\bin"
```

---

## Commandes

```bash
cd mobile_flutter

flutter pub get
dart run flutter_launcher_icons      # icône de l'app (logo sur fond sable)
dart run flutter_native_splash:create  # écran de démarrage

flutter run                          # sur téléphone branché (débogage USB) ou émulateur
flutter build apk --release          # APK de production
flutter build appbundle --release    # .aab pour le Google Play Store
```

### Fichiers produits
```
APK   : mobile_flutter\build\app\outputs\flutter-apk\app-release.apk
AAB   : mobile_flutter\build\app\outputs\bundle\release\app-release.aab
```

---

## Identité

| | |
|---|---|
| Nom affiché | Optic Alizé |
| Package | `bf.opticalize.optic_alize` |
| Couleur de marque | `#F6F2EA` (sable) / `#2E9C96` (turquoise) |
| Police | Jost (Google Fonts) — proche de Century Gothic |

---

## Publier sur le Play Store

1. Créer une clé : `keytool -genkey -v -keystore optic-alize.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload`
2. `mobile_flutter/android/key.properties` :
   ```
   storePassword=…
   keyPassword=…
   keyAlias=upload
   storeFile=../../optic-alize.jks
   ```
3. Brancher la signature dans `android/app/build.gradle.kts` (bloc `signingConfigs`).
4. `flutter build appbundle --release` → téléverser le `.aab` dans la Play Console.

iOS : `flutter build ipa` — nécessite un Mac + Xcode.

---

## Faire évoluer le contenu

- **Produits** : `lib/data/products.dart` (liste `kProducts`)
- **Verres** : `lib/data/content.dart` (`kVerres`)
- **Offres / conseils / actualités** : `lib/data/content.dart`
- **Coordonnées** : `lib/data/content.dart` (classe `Contact`)
- **Nouvelles photos** : les déposer dans `mobile_flutter/assets/<dossier>/` puis référencer le chemin `assets/...`

> ⚠️ Deux apps coexistent : celle-ci (Flutter, native) et la version Capacitor
> (`android/`, plus proche du site). Choisir laquelle publier — ne pas publier les deux
> sous le même nom.
