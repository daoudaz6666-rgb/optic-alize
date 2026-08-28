/* ============================================================
   OPTIC ALIZÉ — comptes clients (démo front-end)

   ⚠️ IMPORTANT : ceci est une démonstration côté navigateur.
   Les comptes sont enregistrés dans le localStorage du visiteur
   (rien n'est envoyé à un serveur). Pour de vrais comptes
   (connexion depuis n'importe quel appareil, sécurité, e-mails
   de confirmation, mot de passe oublié…), il faut un backend :
   PrestaShop/WooCommerce, ou un service comme Firebase Auth /
   Supabase. Le formulaire ci-dessous est prêt à être rebranché.
   ============================================================ */

const COMPTES_KEY = "optic-alize-comptes";
const SESSION_KEY = "optic-alize-session";

/* Petit hash (non cryptographique) pour ne pas stocker le mot de
   passe en clair. NE PAS considérer comme sécurisé. */
function hashMotDePasse(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return "h" + (h >>> 0).toString(16);
}

function getComptes() {
  try {
    return JSON.parse(localStorage.getItem(COMPTES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveComptes(comptes) {
  localStorage.setItem(COMPTES_KEY, JSON.stringify(comptes));
}

function getSessionEmail() {
  try {
    return localStorage.getItem(SESSION_KEY) || null;
  } catch (e) {
    return null;
  }
}

function currentUser() {
  const email = getSessionEmail();
  if (!email) return null;
  return getComptes().find((c) => c.email === email) || null;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/* Renvoie { ok: true } ou { ok: false, erreurs: {champ: message} } */
function inscrire({ prenom, nom, email, telephone, motDePasse, motDePasse2, cgv }) {
  const erreurs = {};
  email = normaliseEmail(email);

  if (!prenom || !prenom.trim()) erreurs.prenom = "Indiquez votre prénom.";
  if (!nom || !nom.trim()) erreurs.nom = "Indiquez votre nom.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) erreurs.email = "Adresse e-mail invalide.";
  else if (getComptes().some((c) => c.email === email)) erreurs.email = "Un compte existe déjà avec cet e-mail.";
  if (!telephone || telephone.replace(/\D/g, "").length < 8) erreurs.telephone = "Numéro de téléphone invalide.";
  if (!motDePasse || motDePasse.length < 6) erreurs.motDePasse = "6 caractères minimum.";
  if (motDePasse !== motDePasse2) erreurs.motDePasse2 = "Les mots de passe ne correspondent pas.";
  if (!cgv) erreurs.cgv = "Vous devez accepter les conditions.";

  if (Object.keys(erreurs).length) return { ok: false, erreurs };

  const comptes = getComptes();
  comptes.push({
    prenom: prenom.trim(),
    nom: nom.trim(),
    email,
    telephone: telephone.trim(),
    motDePasse: hashMotDePasse(motDePasse),
    creeLe: new Date().toISOString().slice(0, 10),
  });
  saveComptes(comptes);
  localStorage.setItem(SESSION_KEY, email);
  return { ok: true };
}

/* Renvoie { ok: true } ou { ok: false, message } */
function connecter(email, motDePasse) {
  email = normaliseEmail(email);
  const compte = getComptes().find((c) => c.email === email);
  if (!compte || compte.motDePasse !== hashMotDePasse(motDePasse)) {
    return { ok: false, message: "E-mail ou mot de passe incorrect." };
  }
  localStorage.setItem(SESSION_KEY, email);
  return { ok: true };
}

/* ---------- Interface de la page compte.html ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.getElementById("compte-page");
  if (!page) return;

  const vueForms = document.getElementById("auth-forms");
  const vueCompte = document.getElementById("auth-account");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  function afficher() {
    const user = currentUser();
    if (user) {
      vueForms.hidden = true;
      vueCompte.hidden = false;
      vueCompte.querySelector("[data-who]").textContent = `Bonjour ${user.prenom} !`;
      vueCompte.querySelector("[data-email]").textContent = user.email;
    } else {
      vueForms.hidden = false;
      vueCompte.hidden = true;
    }
  }

  function poserErreur(form, champ, message) {
    const el = form.querySelector(`[data-error="${champ}"]`);
    if (el) el.textContent = message || "";
  }
  function viderErreurs(form) {
    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    viderErreurs(loginForm);
    const res = connecter(loginForm.email.value, loginForm.motDePasse.value);
    if (res.ok) {
      showToast("Connexion réussie");
      afficher();
      redirigerApresConnexion();
    } else {
      poserErreur(loginForm, "global", res.message);
    }
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    viderErreurs(registerForm);
    const res = inscrire({
      prenom: registerForm.prenom.value,
      nom: registerForm.nom.value,
      email: registerForm.email.value,
      telephone: registerForm.telephone.value,
      motDePasse: registerForm.motDePasse.value,
      motDePasse2: registerForm.motDePasse2.value,
      cgv: registerForm.cgv.checked,
    });
    if (res.ok) {
      showToast("Compte créé, vous êtes connecté");
      afficher();
      redirigerApresConnexion();
    } else {
      Object.entries(res.erreurs).forEach(([champ, msg]) => poserErreur(registerForm, champ, msg));
    }
  });

  const forgot = document.getElementById("auth-forgot");
  if (forgot) {
    forgot.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Contactez une agence Optic Alizé pour réinitialiser votre mot de passe.");
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      logout();
      showToast("Vous êtes déconnecté");
      afficher();
    });
  }

  function redirigerApresConnexion() {
    const back = new URLSearchParams(location.search).get("back");
    if (back === "panier") setTimeout(() => (location.href = "panier.html"), 700);
  }

  afficher();
});
