# Premium Solution – Socle Next.js

Site vitrine premium et plateforme de devis automatisés pour Premium Solution (conciergerie & nettoyage en Suisse romande). Ce dépôt contient l’implémentation Next.js 15 (App Router) avec Tailwind CSS, Framer Motion, shadcn/ui et intégrations Supabase / OpenAI.

## ⚙️ Stack principale

- **Framework** : Next.js 15 (App Router, TypeScript strict)
- **UI** : Tailwind CSS 3.4, shadcn/ui, Framer Motion
- **Back** : Supabase (PostgreSQL + Storage), OpenAI (GPT-4o mini pour chatbot)
- **PDF** : Puppeteer (templates devis/facture à venir)
- **Outils** : ESLint (config Next), npm

## 🗂️ Structure actuelle

```
app/
  ├─ (pages marketing : accueil, gérances, entreprises, particuliers, services, à-propos, contact, devis)
  └─ api/
      └─ chat/route.ts (chatbot streaming)
components/
  ├─ home/… (sections de la homepage)
  ├─ layout/ (Header, Footer, MobileMenu)
  ├─ shared/ (AnimatedSection, PageHeader, ContactForm…)
  └─ ui/ (base shadcn/ui)
lib/
  ├─ openai/ (client + prompt Sophie)
  ├─ supabase/ (clients + schéma SQL)
  └─ utils.ts (helper `cn`)
public/
  ├─ logo.png
  └─ images/ (voir section ci-dessous)
scripts/
  └─ extract-colors.mjs (palette logo -> Tailwind)
```

## 🖼️ Gestion des visuels

- Les visuels fournis sont regroupés dans `public/images/` et déjà distribués sur la homepage + pages de service.
- Nommage adopté : `type-contenu.png` (ex. `service-conciergerie-immeubles.png`, `process-step-1.png`). Pour tout nouvel asset, conserver ce format descriptif en minuscules séparées par des tirets.
- Dimensions : les images sont utilisées via `next/image` avec `fill` et `object-cover` ; prévoir des visuels en 1600×1200 minimum pour un rendu net.
- Placeholder : les sections qui nécessiteront d’autres photos sont signalées (ex. certaines cartes sur `/services`). Ajouter les visuels à `public/images/` puis remplacer le bloc par une `<Image />` lorsque prêt.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Configurez `.env.local` à partir de `.env.example` avec vos clés OpenAI et Supabase.

## ✅ Prochaines étapes clés

1. Intégrer l’interface chatbot (`components/chatbot/ChatInterface.tsx`) sur la page `/devis` et finaliser le flux de génération PDF.
2. Ajouter les contenus détaillés + visuels spécifiques sur les pages marketing si de nouvelles images sont fournies.
3. Compléter la documentation (guide de contribution, checklists de QA, instructions de déploiement Render) lorsque les modules restants seront finalisés.
