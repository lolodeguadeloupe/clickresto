# Requirements: Clickresto Platform

**Defined:** 2026-01-31
**Core Value:** Les restaurateurs peuvent découvrir et demander une demo, et les affiliés peuvent parrainer des restaurants et suivre leurs commissions facilement.

## v1 Requirements

Requirements pour la release initiale. Chaque requirement est mappé aux phases du roadmap.

### Landing Page

- [ ] **LAND-01**: Formulaire de demande demo (nom, email, téléphone, restaurant, message)
- [ ] **LAND-02**: Design mobile-responsive
- [ ] **LAND-03**: Section témoignages et preuves sociales
- [ ] **LAND-04**: Intégration prise de RDV calendrier

### CRM

- [ ] **CRM-01**: Vue pipeline/kanban des leads par statut
- [ ] **CRM-02**: Capture automatique des demandes demo dans le CRM
- [ ] **CRM-03**: Notes et timeline d'activité par lead
- [ ] **CRM-04**: Recherche et filtres sur les leads

### Dashboard Affilié

- [ ] **AFF-01**: Génération de lien de parrainage unique
- [ ] **AFF-02**: Détail des commissions et historique des gains
- [ ] **AFF-03**: Demande de paiement/virement

### Back-Office Admin

- [ ] **ADM-01**: Dashboard vue d'ensemble des leads
- [ ] **ADM-02**: Dashboard affiliés (liste, stats, approbation)
- [ ] **ADM-03**: Workflow validation des demandes de paiement
- [ ] **ADM-04**: Paramétrage (montant commission, textes)

### Authentification

- [ ] **AUTH-01**: Inscription et connexion email/password
- [ ] **AUTH-02**: Connexion magic link (sans mot de passe)
- [ ] **AUTH-03**: Réinitialisation mot de passe par email
- [ ] **AUTH-04**: Séparation des rôles admin/affilié

## v2 Requirements

Différé pour une future release. Tracké mais pas dans le roadmap actuel.

### Dashboard Affilié

- **AFF-04**: Stats temps réel (clics, conversions, taux)
- **AFF-05**: Bibliothèque de matériel marketing (bannières, textes)
- **AFF-06**: Gamification (badges, milestones, leaderboard)

### Authentification

- **AUTH-05**: OAuth login (Google, etc.)

### Paiements

- **PAY-01**: Paiements automatisés des commissions

### CRM

- **CRM-05**: Lead scoring automatique

## Out of Scope

Explicitement exclu. Documenté pour éviter le scope creep.

| Feature | Reason |
|---------|--------|
| Application mobile native | Web-first pour v1 |
| Commission récurrente (% mensuel) | Complexité calculs mensuels, fixe suffit v1 |
| Intégration CRM externe (HubSpot, Salesforce) | CRM intégré suffit |
| Multi-langue | Français uniquement pour v1 |
| Multi-tier affiliate (sous-affiliés) | Ajoute complexité massive sans besoin prouvé |
| Détection fraude IA | Prématuré, validation manuelle suffit |
| Custom reporting builder | 5-10 rapports fixes suffisent |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| LAND-01 | Phase 1 | Pending |
| LAND-02 | Phase 1 | Pending |
| LAND-03 | Phase 1 | Pending |
| LAND-04 | Phase 1 | Pending |
| ADM-01 | Phase 1 | Pending |
| CRM-02 | Phase 1 | Pending |
| AFF-01 | Phase 2 | Pending |
| AFF-02 | Phase 2 | Pending |
| AFF-03 | Phase 2 | Pending |
| ADM-02 | Phase 2 | Pending |
| CRM-01 | Phase 3 | Pending |
| CRM-03 | Phase 3 | Pending |
| CRM-04 | Phase 3 | Pending |
| ADM-03 | Phase 3 | Pending |
| ADM-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-31*
*Last updated: 2026-01-31 after roadmap creation*
