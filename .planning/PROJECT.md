# Clickresto

## What This Is

Landing page commerciale pour Clickresto, une offre d'application mobile personnalisée destinée aux restaurateurs. L'application propose le click & collect, un programme de fidélité et des notifications push. Le site doit convertir les visiteurs (restaurateurs et apporteurs d'affaires) en leads qualifiés.

## Core Value

Générer des demandes de contact qualifiées de restaurateurs intéressés par l'application mobile.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Section Affiliation complète avec programme apporteur d'affaires (50€/client)
- [ ] Formulaire de contact unifié (restaurateur ou affilié)
- [ ] Intégration Firebase pour stocker les soumissions
- [ ] Fonctionnalités JS (menu mobile, animations, validation formulaire)

### Out of Scope

- Espace client/dashboard — pas nécessaire pour une landing page
- Paiement en ligne — les ventes se font par entretien
- Multi-langue — marché français uniquement
- Blog/SEO avancé — focus sur la conversion directe

## Context

**Template existant :** `landing_page_5.html` contient le design complet (CSS) avec :
- Header/Navigation
- Hero section
- Section Prestations (fonctionnalités)
- Section Tarifs (500€ + 60€/mois)
- Footer

**Manquant dans le HTML :**
- Section Affiliation (CSS présent, HTML absent)
- Section Contact avec formulaire (CSS présent, HTML absent)
- Scripts JS fonctionnels

**Offre commerciale :**
- Mise en place : 500€
- Abonnement : 60€/mois
- Commission : 0%
- Programme affiliation : 50€ par restaurant signé

**Design :** Style "Gourmet & Luxueux"
- Fond noir charbon (#121212)
- Or vieilli (#C5A47E)
- Typographies : Cormorant Garamond (titres), Lustria (corps)

## Constraints

- **Tech stack** : HTML/CSS/JS vanilla + Firebase (pas de framework)
- **Template** : Respecter le design existant de landing_page_5.html
- **Single page** : Tout sur une seule page avec navigation par ancres

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Firebase pour backend | Gratuit pour démarrer, facile à intégrer côté client | — Pending |
| Formulaire unique | Simplifier l'UX, un seul point d'entrée avec sélecteur de type | — Pending |
| Commission fixe 50€ | Simple à comprendre pour les affiliés | — Pending |

---
*Last updated: 2026-02-05 after initialization*
