/* ============================================================
   OPTIC ALIZE - Offres & Conseils (visuels reseaux sociaux)

   Ces visuels sont les publications officielles d'Optic Alize.
   Pour AJOUTER une publication : ajoute une entree dans OFFRES
   ou CONSEILS avec :
     image : "offres/xxx.jpg"  ou  "conseils/xxx.jpg"
     titre : "Titre court"
     texte : "Texte affiche sous l'image"
     cta   : { label: "...", href: "..." }   (facultatif)

   Images : format carre conseille (~1080 x 1080 px), < 150 Ko,
   a deposer dans le dossier offres/ ou conseils/.
   ============================================================ */

const OFFRES = [
  {
    image: "offres/pack-duo.jpg",
    titre: "Pack Duo : la 2ᵉ paire offerte",
    texte:
      "Deux paires de lunettes pour le prix d'une : une pour vos activités, une pour vous faire plaisir. Économique, avec la même qualité optique.",
    cta: { label: "Prendre rendez-vous", href: "contact.html?tab=rdv" },
  },
  {
    image: "offres/jours-prestiges.jpg",
    titre: "Les Jours Prestiges : jusqu'à −50 %",
    texte:
      "Jusqu'à −50 % sur nos montures de grandes marques (Gucci, Hugo Boss, Chloé, Marc Jacobs…). Style et qualité à prix d'exception, dans toutes nos agences.",
    cta: { label: "En profiter", href: "contact.html" },
  },
  {
    image: "offres/test-visuel.jpg",
    titre: "Test visuel gratuit",
    texte:
      "Votre vision est floue ? Passez faire votre test visuel gratuitement dans l'une de nos agences de Ouagadougou, Bobo-Dioulasso ou Koudougou.",
    cta: { label: "Réserver mon test", href: "contact.html?tab=rdv" },
  },
  {
    image: "offres/entretien-promo.jpg",
    titre: "Entretien, SAV & −50 %",
    texte:
      "Nettoyage professionnel, réglages gratuits à vie, réparations rapides et conseils personnalisés — et −50 % sur nos montures de marques, offre limitée.",
    cta: { label: "Nous contacter", href: "contact.html" },
  },
];

const CONSEILS = [
  {
    image: "conseils/soins-vue.jpg",
    titre: "4 réflexes pour préserver votre vue",
    texte:
      "Reposez vos yeux 20 secondes toutes les 20 minutes, protégez-vous de la lumière bleue sur écran, clignez et hydratez-vous, et faites contrôler votre vue au moins une fois par an.",
  },
  {
    image: "conseils/entretien.jpg",
    titre: "Comment bien entretenir vos lunettes",
    texte:
      "Eau tiède + savon doux, puis un chiffon microfibre. Un geste simple pour une vision claire et durable.",
  },
  {
    image: "conseils/verres-propres.jpg",
    titre: "Verres propres, vision claire",
    texte:
      "Nettoyez vos lunettes correctement avec un spray pour verres et un chiffon microfibre : cela élimine poussière et traces, et prolonge la vie de vos verres.",
  },
  {
    image: "conseils/erreur-1.jpg",
    titre: "Erreur nº 1 : les nettoyer avec le vêtement",
    texte: "La poussière présente sur le tissu peut rayer vos verres.",
  },
  {
    image: "conseils/erreur-2.jpg",
    titre: "Erreur nº 2 : utiliser des serviettes ou du papier",
    texte: "Ces matériaux abrasifs abîment le traitement de vos verres.",
  },
  {
    image: "conseils/erreur-3.jpg",
    titre: "Erreur nº 3 : utiliser des produits inadaptés",
    texte:
      "Alcool, produits ménagers… ils dégradent les traitements et la qualité de vos verres.",
  },
];

const ACTUALITES = [
  {
    image: "actualites/controle-vue-gratuit.jpg",
    titre: "Contrôle de la vue gratuit — 0 FCFA",
    texte:
      "Bien voir, c'est profiter pleinement de son week-end. Faites contrôler votre vue gratuitement dans nos agences de Ouagadougou, Bobo-Dioulasso et Koudougou.",
    cta: { label: "Prendre rendez-vous", href: "contact.html?tab=rdv" },
  },
  {
    image: "actualites/verres-sales.jpg",
    titre: "Vos lunettes sont sales ? On s'en occupe gratuitement",
    texte:
      "Des verres sales fatiguent les yeux et réduisent le confort visuel. Passez en agence : nous nettoyons vos lunettes gratuitement, pour une vision nette chaque jour.",
    cta: { label: "Nos conseils", href: "conseils.html" },
  },
  {
    image: "actualites/20ans-gateau.jpg",
    titre: "Optic Alizé fête ses 20 ans !",
    texte:
      "20 ans au service de votre vue. Merci à nos clients, nos partenaires et toute l'équipe qui font vivre Optic Alizé depuis deux décennies.",
    cta: { label: "Notre histoire", href: "a-propos.html" },
  },
  {
    image: "actualites/20ans-equipe.jpg",
    titre: "Toute l'équipe réunie",
    texte:
      "Les opticiens et conseillers Optic Alizé de nos agences de Ouagadougou, Bobo-Dioulasso et Koudougou, réunis pour célébrer l'anniversaire.",
  },
  {
    image: "actualites/20ans-trophee.jpg",
    titre: "Une soirée sous le signe de la reconnaissance",
    texte:
      "Remise de distinctions à celles et ceux qui accompagnent Optic Alizé depuis le début.",
  },
  {
    image: "actualites/20ans-scene.jpg",
    titre: "Ambiance festive en agence",
    texte: "Musique, animations et découvertes des nouvelles collections lors de la soirée anniversaire.",
  },
  {
    image: "actualites/vision-priorite.jpg",
    titre: "Votre vision, notre priorité",
    texte:
      "Chez Optic Alizé, nous vous proposons des solutions visuelles adaptées à votre style de vie et à vos exigences. Passez nous voir dans l'une de nos agences.",
    cta: { label: "Prendre rendez-vous", href: "contact.html?tab=rdv" },
  },
  {
    image: "actualites/monture-parfaite.jpg",
    titre: "La monture parfaite pour chaque jour",
    texte:
      "Affirmez votre style avec des montures élégantes et confortables : vue, solaire, métal ou acétate — il y a une Optic Alizé pour chaque envie.",
    cta: { label: "Voir les montures", href: "montures.html" },
  },
  {
    image: "actualites/deux-styles.jpg",
    titre: "2 styles, 2 humeurs",
    texte:
      "Changez de style, adaptez votre vision. Avec le Pack Duo, gardez une paire pour le bureau et une pour le week-end.",
    cta: { label: "Découvrir le Pack Duo", href: "offres.html" },
  },
  {
    image: "actualites/pack-duo-detail.jpg",
    titre: "Le Pack Duo Optic Alizé",
    texte:
      "2 paires de lunettes pour tous vos moments : la semaine et le week-end, le travail et le plaisir, le bricolage et le plein soleil.",
    cta: { label: "En profiter", href: "offres.html" },
  },
  {
    image: "actualites/remise-septembre.jpg",
    titre: "Jusqu'à −50 % sur les montures de marques",
    texte:
      "Notre grande opération sur les montures de marques se poursuit dans toutes nos agences de Ouagadougou, Bobo-Dioulasso et Koudougou.",
    cta: { label: "Nous contacter", href: "contact.html" },
  },
];

function cartedPublication(p) {
  return (
    '<figure class="poster-card reveal">' +
    '<img src="' + p.image + '" alt="' + p.titre + '" loading="lazy">' +
    "<figcaption>" +
    "<h3>" + p.titre + "</h3>" +
    "<p>" + p.texte + "</p>" +
    (p.cta ? '<a href="' + p.cta.href + '" class="btn btn-primary btn-sm">' + p.cta.label + "</a>" : "") +
    "</figcaption></figure>"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  var o = document.getElementById("offres-liste");
  if (o) o.innerHTML = OFFRES.map(cartedPublication).join("");
  var c = document.getElementById("conseils-liste");
  if (c) c.innerHTML = CONSEILS.map(cartedPublication).join("");
  var a = document.getElementById("actualites-liste");
  if (a) a.innerHTML = ACTUALITES.map(cartedPublication).join("");
});
