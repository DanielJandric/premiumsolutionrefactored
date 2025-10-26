# Premium Solution Portal (Next.js)

Portail marketing et espace collaborateurs pour Premium Solution, entreprise de conciergerie et de nettoyage bas�e en Suisse romande.  
Le projet rassemble un site vitrine richement anim�, un chatbot de qualification des demandes et un cockpit interne pour g�n�rer des devis et factures.

---

## Sommaire

1. [Fonctionnalit�s principales](#fonctionnalit�s-principales)  
2. [Stack technique](#stack-technique)  
3. [Structure du projet](#structure-du-projet)  
4. [Pr�requis](#pr�requis)  
5. [Installation & scripts](#installation--scripts)  
6. [Variables d'environnement](#variables-denvironnement)  
7. [Design system & th�me](#design-system--th�me)  
8. [Chatbot & automatisation devis](#chatbot--automatisation-devis)  
9. [G�n�ration de PDF](#g�n�ration-de-pdf)  
10. [Int�gration Supabase](#int�gration-supabase)  
11. [D�ploiement Render](#d�ploiement-render)  
12. [Bonnes pratiques & roadmap](#bonnes-pratiques--roadmap)  
13. [Support](#support)

---

## Fonctionnalit�s principales

- **Landing page compl�te** � sections Hero, Services, Process, Testimonials, CTA et FAQ avec animations Framer Motion, patterns SVG et effets de verrerie.
- **Design system premium** � tokens centralis�s (`lib/design-tokens.ts`), utilitaires Tailwind personnalis�s, variantes de couleurs (vert, or, neutres) et animations avanc�es.
- **Th�me clair/sombre** � bascule instantan�e bas�e sur `next-themes`, transitions fluides via View Transitions API et fallbacks CSS.
- **Chatbot devis (Sophie)** � collecte guid�e des informations clients, r�sum� JSON et validation intelligente (surface interpr�t�e m�me si exprim�e en `210m2`).
- **Espace collaborateurs** :
  - Authentification par hash SHA-256 stock� dans un cookie sign�.
  - G�n�ration de devis et factures en PDF avec Puppeteer.
  - Upload vers Supabase Storage (documents PDF).
  - Vue demandes en cours et conversation associ�e.
- **Accessibilit� & performance** :
  - Skip links, focus rings visibles, support safe-area mobile.
  - Optimisations `will-change`, `content-visibility`, animations GPU friendly.
- **Pipelines** � scripts d�di�s (extraction de palette couleurs depuis le logo), d�ploiement automatis� sur Render.

---

## Stack technique

| Couche          | Outils / Librairies                                                       |
|-----------------|---------------------------------------------------------------------------|
| Framework       | Next.js 15 (App Router) + TypeScript strict                               |
| UI / Styling    | Tailwind CSS 3.4, shadcn/ui, Tailwind Merge, Framer Motion, CSS modules   |
| Design system   | Tokens maison (`lib/design-tokens.ts`), container queries, animations     |
| Th�me           | `next-themes`, View Transitions API, fallback CSS                         |
| Backend         | Supabase (Postgres + Storage), OpenAI SDK                                 |
| PDF & documents | Puppeteer 24 (Chromium headless), utilitaires `lib/pdf`                   |
| Utilitaires     | Zod, date-fns, clsx, class-variance-authority, lucide-react               |
| Qualit�         | ESLint (config Next), TypeScript, scripts npm                             |

---

## Structure du projet

```
.
├── app/
│   ├── (marketing)/                 # Pages publiques : accueil, services, secteurs, etc.
│   ├── collaborateurs/              # Portail interne (login, demandes, chat, documents)
│   ├── api/
│   │   └── chat/route.ts            # Endpoint edge stream OpenAI
│   ├── devis/                       # Chatbot frontend + actions serveur
│   └── layout.tsx                   # Layout racine (SkipLinks, CustomCursor, ThemeProvider)
├── components/
│   ├── home/                        # Sections de la landing page
│   ├── shared/                      # Composants transverses (ServiceCard, SVGPatterns, etc.)
│   ├── providers/                   # ThemeProvider (next-themes)
│   └── ui/                          # Primitives shadcn/ui typ�es
├── lib/
│   ├── auth/                        # Gestion des sessions collaborateurs
│   ├── openai/                      # Client OpenAI + prompts
│   ├── pdf/                         # Rendu et helpers Puppeteer
│   ├── quotes/                      # Services Devis/Factures (Supabase)
│   ├── supabase/                    # Client c�t� serveur et sch�ma SQL
│   └── design-tokens.ts             # Source unique du design system
├── public/
│   ├── images/                      # Assets marketing (WebP/PNG)
│   └── logo.png
├── scripts/
│   └── extract-colors.mjs           # G�n�ration palette Tailwind depuis le logo
├── render.yaml                      # Blueprint Render (deployment)
├── tailwind.config.ts               # Config + plugins & tokens
└── package.json
```

---

## Pr�requis

- Node.js **>= 20** (cf. `package.json > engines`)
- npm (fourni avec Node)
- Acc�s � un projet **Supabase** (URL + cl�s) pour persister les demandes et documents
- Cl� **OpenAI** valide (chatbot)
- Pour la g�n�ration PDF locale, Puppeteer t�l�charge automatiquement Chromium (pr�voir ~150 Mo)

---

## Installation & scripts

```bash
git clone https://github.com/DanielJandric/premiumsolutionrefactored.git
cd premiumsolutionrefactored
npm install

npm run dev        # lancement en mode d�veloppement (http://localhost:3000)
npm run build      # build Next.js production
npm run start      # serveur Next sur le build
npm run lint       # ESLint
npm run extract:colors   # recalcul de la palette Tailwind depuis le logo
```

> Le script `postinstall` installe une version headless de Chromium pour Puppeteer, utile pour les builds cold start (Render).

---

## Variables d'environnement

Copier `.env.example` vers `.env.local` puis renseigner :

| Variable                        | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | URL du projet Supabase                                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cl� publique Supabase (utilis�e c�t� client)                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Cl� service Supabase (actions serveur : PDF, insertions, etc.)             |
| `OPENAI_API_KEY`                | Cl� OpenAI pour le chatbot                                                  |
| `COLLAB_PORTAL_PASSWORD`        | Mot de passe en clair du portail collaborateurs (hash� dynamiquement)      |

> Ne jamais commiter `.env.local`. Les secrets historiques ont �t� expurg�s via `git filter-repo`.

---

## Design system & th�me

- **Tokens centralis�s** : `lib/design-tokens.ts` expose couleurs (50-900), typo, espacements, ombres, animations.  
  `tailwind.config.ts` les importe et g�n�re les classes Tailwind.
- **Modes clair/sombre** : ajustables via `ThemeProvider` (`components/providers/ThemeProvider.tsx`), compatible View Transitions API (+ fallback CSS transitions).
- **Utilitaires personnalis�s** :
  - Classes type `text-eyebrow`, `text-hero`, `card-3d`, `glass`, `will-change-*`.
  - `content-visibility` et `contain-intrinsic-size` pour les sections volumineuses.
- **Composants graphiques** : `components/shared/SVGPatterns.tsx` regroupe patterns, blobs anim�s, diviseurs de sections, etc.

---

## Chatbot & automatisation devis

- **Frontend** : `app/devis/_components/QuoteChatBot.tsx` � UI client (hook `useChat`, traitements KYC, normalisation surface).
- **Validation serveur** : `app/devis/actions.ts` (Zod + `parseSurfaceArea`) puis `lib/quotes/service.ts` pour l'insert Supabase.
- **Prompting** : `lib/openai/prompts.ts` d�finit la personnalit� de Sophie et le format JSON attendu.
- **Streaming** : route `/api/chat` (App Router) renvoie un flux SSE pour que la conversation s'affiche au fil de l'eau.

---

## G�n�ration de PDF

- **Templates** : dossiers `app/collaborateurs/chat/templates/` (HTML/React -> string).
- **Rendu** : `lib/pdf/renderWithPuppeteer.ts` encapsule Puppeteer (A4, marges 20 mm, encodage du logo en data URI).
- **Usage** : `lib/quotes/service.ts` appelle le renderer, stocke le PDF dans Supabase Storage et met � jour la base.
- **Tests locaux** :
  ```ts
  import { renderPdfWithPuppeteer } from "@/lib/pdf/renderWithPuppeteer";
  const buffer = await renderPdfWithPuppeteer({ type: "quote", payload });
  await fs.promises.writeFile("test.pdf", buffer);
  ```

---

## Int�gration Supabase

- **Sch�ma** : `lib/supabase/schema.sql` (tables `quote_requests`, `quotes`, `invoices`, `chat_conversations`, `contact_submissions` + policies RLS).
- **Client serveur** : `lib/supabase/server.ts` cr�e un client `@supabase/supabase-js` utilisant les cl�s d'environnement.
- **Logiciels** :
  - `lib/quotes/service.ts` : CRUD demandes/devis/factures, g�n�ration num�ros (`generate_quote_number`).
  - `lib/documents/service.ts` (si pr�sent) pour la gestion des documents.
- **R�gles de validation** : la colonne `surface_area` est num�rique; le code backend interpr�te les cha�nes `xxxm2` via `parseSurfaceArea`.

---

## D�ploiement Render

1. Connecter le repo GitHub � Render.
2. Cr�er un **Blueprint** en pointant vers `render.yaml`.
3. Param�tres pr�d�finis :
   - Type de service : `web`, plan `starter`, r�gion `frankfurt`.
   - Build : `npm install && npm run build`.
   - D�marrage : `npm run start`.
   - Variables d'environnement � ajouter via l'UI Render.
4. Les d�pendances natives (Sharp, Puppeteer) sont compatibles avec l'environnement Render.

---

## Bonnes pratiques & roadmap

1. **Qualit�**
   - Lancer `npm run lint` avant chaque commit.
   - Utiliser Prettier/ESLint dans l'IDE (config fournie).
2. **Tests & monitoring**
   - Ajouter des tests E2E (Playwright) pour la cr�ation d'un devis complet.
   - Monitorer le quota OpenAI (anticiper la facturation).
3. **S�curit�**
   - Rotation r�guli�re des cl�s Supabase/OpenAI.
   - Stockage exclusif des secrets dans l'infra (Render, 1Password).
4. **Roadmap sugg�r�e**
   - Finaliser le cockpit collaborateurs (recherche, filtres, assignation de demandes).
   - Ajouter un module CRM l�ger (contacts, historiques).
   - Int�grer un syst�me de notifications email (Resend / SendGrid).

---

## Support

- **Contenu / acc�s** : �quipe Premium Solution.
- **Technique** :
  - Documentation Next.js � https://nextjs.org/docs
  - Tailwind CSS � https://tailwindcss.com/docs
  - Supabase � https://supabase.com/docs
  - OpenAI SDK � https://platform.openai.com/docs
- Pour remonter un bug ou proposer une �volution, ouvrir une issue GitHub ou contacter l'�quipe dev.

