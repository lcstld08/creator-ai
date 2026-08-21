# Creator AI

Application web installable (formations, services, outils IA), avec vrais
comptes, vrai système de crédits payants, et vrai paiement Stripe. Aucun mode
démo — tout ce que tu vois est branché sur une vraie base de données.

## Ce qui est réel maintenant

- **Comptes** : email + mot de passe (hashé avec bcrypt, jamais stocké en clair) ou **Google Sign-In**
- **Session persistante** : cookie sécurisé — tu restes connecté à ta prochaine visite, plus besoin de te recréer un compte
- **Notifications** : cloche fonctionnelle, vraies notifications stockées par compte (achat confirmé, crédits ajoutés, bienvenue)
- **Crédits IA** : chaque compte démarre avec 10 crédits offerts, chaque génération en consomme 1, rechargeable par paquets payants via Stripe
- **Accès formations** : débloqué uniquement après un vrai paiement Stripe confirmé côté serveur — jamais depuis le navigateur seul
- **Admin réel** : réservé aux emails listés dans `ADMIN_EMAILS`, plus de bouton "mode démo"

## Lancer en local

```bash
npm install
npm run dev
```

Les fonctions `/api/*` ne tournent pas avec `npm run dev` seul (c'est un
serveur Vite, pas un serveur Vercel). Pour tester l'authentification, les
crédits ou les outils IA en local, utilise `vercel dev` à la place (après
`vercel login`).

## Mise en ligne / mise à jour (Vercel)

1. Pousse les fichiers sur ton dépôt GitHub (remplace les anciens fichiers modifiés)
2. Vercel redéploie automatiquement à chaque push
3. Vérifie que toutes les variables d'environnement ci-dessous sont bien configurées (Settings → Environment Variables), puis redéploie si tu viens d'en ajouter

## Configuration complète (à faire une fois)

### 1. Vercel KV (base de données)
Storage → Create Database → **KV**. Vercel connecte les variables tout seul.

### 2. Comptes & sessions
- `JWT_SECRET` : une longue chaîne aléatoire. Génère-en une sur https://generate-secret.vercel.app/32
- `ADMIN_EMAILS` : ton email (celui avec lequel tu vas t'inscrire), pour avoir accès à `/admin`

### 3. Google Sign-In (optionnel)
1. Va sur https://console.cloud.google.com/apis/credentials
2. Crée un projet (si besoin) → **Create Credentials** → **OAuth client ID** → type **Web application**
3. Dans "Authorized JavaScript origins", ajoute `https://ton-site.vercel.app`
4. Copie le **Client ID** obtenu → ajoute-le dans Vercel comme **deux** variables : `GOOGLE_CLIENT_ID` ET `VITE_GOOGLE_CLIENT_ID` (même valeur dans les deux — l'une est lue côté serveur, l'autre exposée au navigateur)
5. Si tu ne configures pas Google, le bouton "Continuer avec Google" ne s'affiche simplement pas — l'email/mot de passe fonctionne toujours.

### 4. Anthropic (outils IA)
`ANTHROPIC_API_KEY` — https://console.anthropic.com/settings/keys (nécessite un peu de crédit sur le compte)

### 5. Stripe (paiement formations + crédits)
- `STRIPE_SECRET_KEY` — https://dashboard.stripe.com/apikeys (commence par les clés **test**)
- Webhook : Stripe → Developers → Webhooks → Add endpoint → URL `https://ton-site.vercel.app/api/stripe-webhook` → événement `checkout.session.completed` → copie le "Signing secret" dans `STRIPE_WEBHOOK_SECRET`

### 6. Resend (emails de confirmation)
- `RESEND_API_KEY` — https://resend.com/api-keys (gratuit jusqu'à 100 emails/jour)
- `EMAIL_FROM` — laisse `onboarding@resend.dev` pour commencer, ou ton domaine vérifié plus tard

Teste avec la carte Stripe `4242 4242 4242 4242` — aucun vrai argent ne bouge en mode test.

## Comment fonctionne l'accès aux formations

1. Le client doit être connecté (compte ou Google) pour acheter
2. Il clique "Acheter" → redirigé vers Stripe (l'app ne voit jamais son numéro de carte)
3. Une fois payé, **Stripe notifie le serveur** (webhook, infalsifiable), qui débloque immédiatement l'accès sur son compte + envoie un email de confirmation avec un code de secours (utile s'il se connecte depuis un autre appareil avant que la synchronisation de compte ne s'applique)
4. À chaque connexion, l'app recharge la liste des formations possédées depuis le serveur — impossible de débloquer une formation en trafiquant le navigateur

## Comment fonctionnent les crédits IA

- 10 crédits offerts à l'inscription
- Chaque génération (Content Creator, Business Generator, Product Generator, Ad Generator) coûte 1 crédit, vérifié et décompté **côté serveur**
- Rechargeable dans Dashboard → Mes crédits : 30 crédits (4,90 €) / 80 crédits (9,90 €) / 200 crédits (19,90 €) — ajustable dans `api/credits/create-checkout.js`

## Pages légales et assistance IA

- **Pied de page complet** : mentions légales, CGV, CGU, politique de confidentialité, politique de cookies, plus une bannière de consentement cookie basique. ⚠️ Ce sont des **modèles génériques** avec des champs `[à remplir]` — remplace-les par tes vraies informations (SIRET, adresse, email) dans `src/App.jsx` (constante `LEGAL_CONTENT` et composant `Footer`), et fais-les relire par un professionnel du droit avant d'encaisser de vrais paiements. Ce n'est pas un conseil juridique.
- **Assistant IA de support** : bulle de chat en bas à droite, visible par tous (connectés ou non). L'IA connaît en temps réel le catalogue de formations/services, le système de crédits, le fonctionnement des comptes et du paiement (voir `api/support/send.js`). Toi (admin) tu vois toutes les conversations dans Admin → Support, et tu peux répondre toi-même à tout moment — ta réponse apparaît directement dans le chat de la personne.



| Fonction | État actuel |
|---|---|
| Vidéos/PDF de formation | Non hébergés — à brancher sur Mux/Cloudflare Stream + S3/R2 |
| Modification de profil | Champ visible mais pas encore connecté à un endpoint de mise à jour |
| Commandes de services | Toujours suivies localement (navigateur), pas encore dans la base de données partagée comme les formations |
| Emails transactionnels | Fonctionnent via Resend avec le domaine de test `resend.dev` — vérifie ton propre domaine dans Resend avant un vrai lancement pour éviter le dossier spam |
| Mentions légales / CGV | Aucune — obligatoire avant d'encaisser de vrais paiements en France |

## Structure du projet

```
├── api/
│   ├── _lib/
│   │   ├── auth.js          # sessions (cookie signé), vérif admin
│   │   └── notify.js        # écrit les notifications utilisateur
│   ├── auth/
│   │   ├── signup.js, login.js, google.js, me.js, logout.js
│   ├── admin/
│   │   └── stats.js         # réservé aux admins
│   ├── credits/
│   │   └── create-checkout.js
│   ├── catalog.js           # formations/services — lecture publique, écriture admin
│   ├── create-checkout.js   # paiement d'une formation
│   ├── stripe-webhook.js    # confirme les paiements, débloque l'accès, envoie l'email
│   ├── redeem.js            # code de secours reçu par email
│   └── generate.js          # appelle Claude, décompte 1 crédit
├── src/
│   ├── App.jsx
│   ├── storage.js           # préférences locales uniquement (progression, favoris)
│   └── main.jsx
└── public/                  # PWA (manifest, service worker, icônes)
```
