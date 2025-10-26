# UI Modernisation Notes

## Responsive Checks à Réaliser

- ✅ Home (Hero, services, témoignages, CTA) — vérifier sur 360 px, 768 px, 1280 px.
- ☐ Pages sectorielles (`/gerances-ppe`, `/entreprises`, `/particuliers`, `/services`) — appliquer la nouvelle grille `section-inner`.
- ☐ Portail collaborateurs — contrôler les espacements après ajustement des tokens typographiques.
- ☐ Chatbot `/devis` — s'assurer que la typographie fluide ne décale pas les étapes du formulaire.

## Suivi des Micro-Interactions

- Hover/Focus sur boutons principaux — ok (gradient + glow).
- Cartes services/process — conserver l'effet `card-3d`, vérifier performance sur iOS (désactiver si besoin via `prefers-reduced-motion`).
- Marquee certifications — cadence `speed="normal"` validée, prévoir variante `reduced` si perception trop rapide.

## Prochaines Étapes Recommandées

1. Harmoniser les pages secondaires avec `section-shell`/`section-inner` (+ titres `text-hero`).
2. Ajouter scénarios de tests Playwright pour casser moins souvent la mise en page (hero mobile + carte service).
3. Exporter un thème Figma à jour pour aligner l'équipe (variables, grille, exemples d'états hover).
