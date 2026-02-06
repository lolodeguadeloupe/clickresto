# Requirements: Clickresto

**Defined:** 2026-02-05
**Core Value:** Générer des demandes de contact qualifiées de restaurateurs intéressés par l'application mobile.

## v1 Requirements

### Affiliation (AFF)

- [ ] **AFF-01**: Section affiliation visible avec ancre #affiliation
- [ ] **AFF-02**: Présentation du programme avec montant (50€/client)
- [ ] **AFF-03**: 3 étapes visuelles (Inscription → Recommandation → Commission)
- [ ] **AFF-04**: Reward card avec le montant de la commission
- [ ] **AFF-05**: CTA vers le formulaire de contact

### Contact (CTT)

- [ ] **CTT-01**: Section contact visible avec ancre #contact
- [ ] **CTT-02**: Formulaire avec champs : nom, email, téléphone, établissement
- [ ] **CTT-03**: Sélecteur type de demande (Restaurateur / Apporteur d'affaires)
- [ ] **CTT-04**: Champ message/commentaire
- [ ] **CTT-05**: Validation côté client avant soumission
- [ ] **CTT-06**: Message de succès après soumission

### Backend (BAK)

- [ ] **BAK-01**: Configuration Firebase (projet + Firestore)
- [ ] **BAK-02**: Collection "contacts" pour stocker les soumissions
- [ ] **BAK-03**: Règles de sécurité Firestore (écriture seule, pas de lecture publique)

### JavaScript (JS)

- [ ] **JS-01**: Menu mobile toggle fonctionnel
- [ ] **JS-02**: Scroll smooth vers les ancres
- [ ] **JS-03**: Soumission formulaire vers Firebase
- [ ] **JS-04**: Gestion états (loading, success, error)

## v2 Requirements

### Notifications

- **NOTIF-01**: Email de confirmation automatique au prospect
- **NOTIF-02**: Notification email au commercial pour chaque lead

### Analytics

- **ANA-01**: Tracking des conversions (formulaire soumis)
- **ANA-02**: Heatmap des clics

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dashboard admin | Les leads seront consultés directement dans Firebase Console |
| Paiement en ligne | Les ventes se font par entretien téléphonique |
| Multi-langue | Marché français uniquement |
| Pages séparées | Single page avec navigation par ancres |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AFF-01 | Phase 1 | Complete |
| AFF-02 | Phase 1 | Complete |
| AFF-03 | Phase 1 | Complete |
| AFF-04 | Phase 1 | Complete |
| AFF-05 | Phase 1 | Complete |
| CTT-01 | Phase 2 | Complete |
| CTT-02 | Phase 2 | Complete |
| CTT-03 | Phase 2 | Complete |
| CTT-04 | Phase 2 | Complete |
| CTT-05 | Phase 2 | Complete |
| CTT-06 | Phase 2 | Complete |
| JS-01 | Phase 2 | Complete |
| JS-02 | Phase 2 | Complete |
| BAK-01 | Phase 3 | Pending |
| BAK-02 | Phase 3 | Pending |
| BAK-03 | Phase 3 | Pending |
| JS-03 | Phase 3 | Pending |
| JS-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-05*
*Last updated: 2026-02-06 after phase 2 completion*
