# Clickresto Platform

## What This Is

Plateforme de services pour restaurants proposant une solution click & collect. Comprend une landing page pour acquisition (demande de demo), un système d'affiliation complet avec back-office admin et espace affilié dédié.

## Core Value

Les restaurateurs peuvent découvrir et demander une demo de la solution, et les affiliés peuvent parrainer des restaurants et suivre leurs commissions facilement.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page améliorée avec formulaire de demande de demo
- [ ] Système d'inscription affilié depuis la landing
- [ ] Back-office admin : gestion des leads (demandes de demo)
- [ ] Back-office admin : gestion des affiliés (approbation, stats)
- [ ] Back-office admin : validation des demandes de paiement
- [ ] Back-office admin : paramétrage (montant commission, textes)
- [ ] Espace affilié : authentification (email/password + magic link)
- [ ] Espace affilié : dashboard avec lien de parrainage unique
- [ ] Espace affilié : statistiques des filleuls (restaurants inscrits)
- [ ] Espace affilié : suivi des commissions et historique
- [ ] Espace affilié : demande de paiement/virement

### Out of Scope

- Application mobile native — web-first pour v1
- Paiement automatique des commissions — validation manuelle pour v1
- Commission récurrente (% mensuel) — fixe par inscription uniquement
- Intégration CRM externe (HubSpot, Salesforce) — CRM intégré suffit
- Multi-langue — français uniquement pour v1

## Context

Landing page existante (`index.html`) en HTML/CSS/JS vanilla pour Clickresto, solution click & collect pour restaurants. Tarification actuelle : 500€ setup + 60€/mois, 0% commission.

Le système d'affiliation doit permettre à des partenaires de recommander Clickresto à des restaurateurs et de gagner une commission fixe par inscription validée.

## Constraints

- **Tech stack**: Next.js (React) pour le back-office + Supabase pour BDD et auth
- **Landing**: Amélioration de l'existante, pas de refonte complète
- **Auth**: Support email/password ET magic link pour les affiliés
- **Commission**: Montant fixe par restaurant inscrit (configurable par l'admin)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase pour BDD + auth | Gratuit au départ, PostgreSQL, auth intégrée, scalable | — Pending |
| Next.js pour back-office | Modern, React-based, bon DX, SSR si besoin | — Pending |
| Commission fixe (pas récurrente) | Simplicité pour v1, évite calculs mensuels complexes | — Pending |
| Validation manuelle des paiements | Contrôle humain avant tout virement, sécurité | — Pending |

---
*Last updated: 2026-01-31 after initialization*
