# Phase 2: Contact Form - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Section de contact avec formulaire de validation et interactions basiques. Collecte : nom, email, téléphone, établissement, type (Restaurateur/Apporteur), message. Inclut validation côté client, menu mobile toggle, et smooth scroll. L'envoi vers Firebase est Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Présentation visuelle
- Layout deux colonnes sur desktop (nom/email côte à côte), une colonne sur mobile
- Labels au-dessus des champs, visibles en permanence
- Bouton de soumission largeur auto (pas pleine largeur)
- Titre + sous-titre au-dessus du formulaire
- Illustration/icône décorative (position au choix de Claude)
- Champ message taille moyenne (5-6 lignes)

### Validation & feedback
- Validation à la soumission (pas en temps réel)
- Messages d'erreur sous chaque champ concerné
- Bordure rouge pour signaler un champ en erreur
- Téléphone : validation format français (10 chiffres)
- Email : validation regex complète
- Établissement : obligatoire pour Restaurateur, optionnel pour Apporteur
- Champs obligatoires marqués avec astérisque rouge (*)
- Erreur disparaît au blur après correction
- Focus automatique sur le premier champ en erreur à la soumission

### Sélecteur de type
- Boutons toggle stylisés (pas radio, pas dropdown)
- Restaurateur pré-sélectionné par défaut
- Placeholder du champ message adapté selon le type sélectionné
- Positionné en haut du formulaire (premier élément)
- Label : "Je suis" (Restaurateur / Apporteur d'affaires)

### États de soumission
- Loading : bouton désactivé + overlay sur le formulaire
- Succès : message inline remplaçant le formulaire
- Message succès : "Merci ! Nous vous recontacterons rapidement."

### Claude's Discretion
- Style des inputs (bordure complète ou autre selon template Pop & Coloré)
- Structure section (formulaire seul ou avec infos contact)
- Position de l'illustration/icône
- Longueur minimale du champ message
- Gestion de l'état d'erreur serveur

</decisions>

<specifics>
## Specific Ideas

- Style "Pop & Coloré" du template landing_page_4.html à respecter
- Ton décontracté avec le "Je suis" pour le sélecteur de type
- Les boutons toggle doivent être visuellement distinctifs et playful

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-contact-form*
*Context gathered: 2026-02-05*
