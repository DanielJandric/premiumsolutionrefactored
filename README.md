# Premium Solution – portail Next.js

Application marketing et espace collaborateurs pour Premium Solution, société de conciergerie et nettoyage active en Suisse romande. Le mono-repo repose sur Next.js 15 (App Router) avec Tailwind CSS, shadcn/ui, Framer Motion, Puppeteer, Supabase et OpenAI.

---

## Sommaire

- [Fonctionnalités clés](#fonctionnalités-clés)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation et scripts npm](#installation-et-scripts-npm)
- [Variables d'environnement](#variables-denvironnement)
- [Mode sombre et personnalisation](#mode-sombre-et-personnalisation)
- [PDF devis/factures](#pdf-devisfactures)
- [Intégration chatbot](#intégration-chatbot)
- [Déploiement sur Render](#déploiement-sur-render)
- [Utilitaires supplémentaires](#utilitaires-supplémentaires)
- [Bonnes pratiques et prochaines étapes](#bonnes-pratiques-et-prochaines-étapes)

---

## Fonctionnalités clés

- **Landing page complète** : sections Hero, Services, Process, Testimonials, CTA, etc. avec animations Framer Motion.
- **Espace collaborateurs** :
  - Authentification par cookie signé (hash SHA-256 du mot de passe portail).
  - Génération de devis/factures via templates HTML et rendu PDF Puppeteer.
  - Téléversement des documents vers Supabase Storage (à brancher côté actions).
- **Chatbot devis** : endpoint API en streaming (`app/api/chat/route.ts`) connecté à OpenAI (Sophie).
- **Mode sombre** : thème adaptatif via `next-themes`, bascule directe dans le Header.
- **Support multi-support** :
  - Layout responsive (Grid + Flex).
  - Menu mobile accordéon, CTA adaptés.
- **CI/deploy** : configuration Render (`render.yaml`) prête pour un service web Node (build `npm run build` / start `npm run start`).

---

## Stack technique

| Couche | Outils / Librairies |
| ------ | ------------------- |
| Framework | Next.js 15 (App Router, TypeScript strict) |
| UI / Styling | Tailwind CSS 3.4, shadcn/ui, Tailwind Merge, CSS utilitaires, Framer Motion |
| Thème | `next-themes` (mode clair/sombre avec stockage `class`) |
| Backend | Supabase (Postgres + Storage), OpenAI (SDK `openai`) |
| PDFs | Puppeteer 24 (Chromium headless) |
| Utilitaires | Date-fns, clsx, class-variance-authority, lucide-react |
| Qualité | ESLint config Next.js, TypeScript, scripts npm |

---

## Structure du projet

```
.
├─ app/
│  ├─ (pages marketing et formulaires) accueil, gerances-ppe, entreprises, particuliers,
│  │   services, a-propos, contact, devis…
│  ├─ collaborateurs/
│  │   ├─ chat/ (actions, templates PDF)
│  │   ├─ documents/ (upload / listing)
│  │   └─ login/
│  └─ api/
│      └─ chat/route.ts     # endpoint streaming OpenAI
├─ components/
│  ├─ home/                 # sections homepage (Hero, Services, Process, CTA…)
│  ├─ layout/               # Header, Footer, MobileMenu, ThemeToggle
│  ├─ providers/            # ThemeProvider (next-themes)
│  ├─ shared/               # AnimatedSection, ServiceCard, etc.
│  └─ ui/                   # primitives shadcn/ui adaptées (button, card…)
├─ lib/
│  ├─ auth/                 # gestion session collaborateurs (cookie SHA-256)
│  ├─ documents/            # types, helpers PDF
│  ├─ openai/               # client OpenAI + prompts
│  ├─ pdf/                  # rendu Puppeteer
│  └─ supabase/             # client, schéma SQL
├─ public/
│  ├─ logo.png
│  └─ images/               # assets marketing (services, process, CTA…)
├─ scripts/
│  └─ extract-colors.mjs    # extraction palette logo -> Tailwind
├─ render.yaml              # blueprint Render
├─ tailwind.config.ts
└─ package.json
```

---

## Prérequis

- Node.js >= 20 (voir champ `engines` du `package.json`)
- npm (fourni avec Node)
- Supabase projet (URL + clés) si vous activez les actions collaborateur
- Clé OpenAI (chatbot + génération de contenus)
- Chromium sera téléchargé automatiquement par Puppeteer lors de la première génération PDF

---

## Installation et scripts npm

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production Next.js
npm run start    # serveur Next sur le build .next
npm run lint     # ESLint
npm run extract:colors   # met à jour la palette Tailwind à partir du logo
```

> Astuce : si `npm install` échoue pour `next-themes`, vérifiez que la version utilisée est `^0.4.6` (mise à jour dans ce repo).

---

## Variables d'environnement

Copier `.env.example` vers `.env.local`, puis renseigner :

| Clé | Description |
| --- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publique Supabase (interactions client) |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service (actions côté serveur) |
| `OPENAI_API_KEY` | clé OpenAI utilisée par l'API `/api/chat` |
| `COLLAB_PORTAL_PASSWORD` | mot de passe clair du portail collaborateurs (haché à la volée) |

Ne commitez jamais `.env.local`. Les secrets ont déjà été purgés de l'historique (`git filter-repo` appliqué).

---

## Mode sombre et personnalisation

- `ThemeProvider` (dans `components/providers/ThemeProvider.tsx`) enveloppe l'application et gère les classes `light` / `dark`.
- `Header` embarque un `ThemeToggle` :
  - Desktop : bouton supplémentaire à côté du CTA "Obtenir un devis".
  - Mobile : switch associé au menu hamburger.
- Variables CSS dans `app/globals.css` :
  - palette claire et sombre définie via `--background`, `--foreground`, `--primary`, etc.
  - Tailwind est configuré avec `darkMode: ["class"]`.
- Pour ajuster la charte, modifier `:root` et `.dark` dans `globals.css` ou enrichir `tailwind.config.ts`.

---

## PDF devis/factures

- Template HTML : `app/collaborateurs/chat/templates/DocumentTemplate.tsx`
- Rendu : `lib/pdf/renderWithPuppeteer.ts`
  - Encode le logo (`public/logo.png`) en Data URI pour garantir l'inclusion dans le PDF.
  - `headless: true` pour compatibilité builds Linux (Render).
  - Marges A4 (20 mm haut/bas, 18 mm latéral).
- Ajouts récents :
  - Logo en haut à droite du PDF.
  - Footer légal complet avec coordonnées, IBAN, BIC, IDE, etc.
- Pour tester localement :
  ```ts
  import { renderPdfWithPuppeteer } from "@/lib/pdf/renderWithPuppeteer";
  const buffer = await renderPdfWithPuppeteer(payload);
  await fs.promises.writeFile("test.pdf", buffer);
  ```

---

## Intégration chatbot

- Endpoint : `app/api/chat/route.ts` (edge-friendly, streaming `ReadableStream`).
- Prompt principal : `lib/openai/prompts.ts` (Sophie).
- Hooks/actions côté client pour la page `/devis` (TODO : brancher l'interface front `ChatInterface`).
- Vérifier que `OPENAI_API_KEY` est défini avant de lancer `npm run dev`, sinon l'API renverra une erreur 500.

---

## Déploiement sur Render

1. Repo GitHub connecté à Render.
2. Dans Render, choisir **Blueprint** et pointer vers `render.yaml`.
3. Paramètres définis :
   - type `web`, plan `starter`, région `frankfurt`
   - build command : `npm install && npm run build`
   - start command : `npm run start`
   - `NODE_ENV=production` injecté par défaut
4. Ajouter manuellement les variables d'environnement sensibles dans l'UI Render (section Environment).
5. Le mode headless Puppeteer fonctionne sur Render (dépendance `sharp` incluse pour Next Image).

---

## Utilitaires supplémentaires

- **Scripts**
  - `scripts/extract-colors.mjs` : calcule la palette depuis `public/logo.png` et met à jour les variables Tailwind (utile si le logo change).
- **Supabase**
  - Schéma SQL : `lib/supabase/schema.sql`
  - Adapter si vous ajoutez de nouvelles tables (ex. `documents`, `clients`, etc.).
- **Assets**
  - Tous les visuels sont dans `public/images/` (noms descriptifs en kebab case).
  - Pour optimiser, privilégier WebP là où possible (Next.js gère la conversion).

---

## Bonnes pratiques et prochaines étapes

1. **Couverture fonctionnelle**
   - Finaliser l'UI du portail collaborateurs (listing documents, téléchargement, chat).
   - Ajouter des tests d'intégration (Playwright ou Cypress) pour le processus devis -> PDF -> upload.
2. **Qualité**
   - Lancer `npm run lint` avant chaque commit.
   - Configurer Prettier/ESLint dans l'IDE (fichiers `.eslintrc` déjà fournis).
3. **Sécurité**
   - Toujours stocker les secrets en variables d'environnement (Render, GitHub Actions, etc.).
   - Pour partager le projet en local, utiliser `npx localtunnel --port 3000` ou `ngrok`.
4. **CI/CD**
   - Possibilité d'ajouter un workflow GitHub Actions (`.github/workflows`) pour lint + build.
5. **Contenus**
   - Remplacer les textes contenant des caractères mal encodés (actuellement issus d'une exportation) par les versions définitives.

---

### Support

Pour toute question interne (contenus, identifiants Supabase/OpenAI), contacter l'équipe Premium Solution. Pour support technique Next.js/Tailwind, se référer à la documentation officielle ou ouvrir un ticket dans le repo.

