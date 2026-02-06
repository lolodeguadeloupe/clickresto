# Phase 3: Firebase Integration - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

**IMPORTANT:** Backend changed from Firebase to Supabase (self-hosted). Config in `.env`.

<domain>
## Phase Boundary

Connect the existing contact form to Supabase to store lead submissions, with loading state, success/error feedback, and basic security. The form HTML and client-side validation already exist from Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Feedback utilisateur
- Loading state: Claude's discretion (spinner bouton ou overlay)
- Succès: message in-place — le formulaire disparaît, remplacé par un message de confirmation
- Contenu succès: simple et direct — "Merci ! Nous vous recontacterons sous 48h."
- Re-soumission: bouton "Envoyer un autre message" après le succès pour réafficher le formulaire vide

### Gestion des erreurs
- Comportement en cas d'échec d'envoi: Claude's discretion
- Détection hors-ligne: vérifier la connexion avant l'envoi, message spécifique si hors-ligne
- Timeout: 10 secondes — afficher un message d'erreur de timeout si pas de réponse
- Double validation: contraintes NOT NULL et formats sur la table Supabase en plus de la validation JS existante

### Données et structure
- Table: "contacts"
- Métadonnées: timestamp (created_at) uniquement
- Champ status: oui, colonne "status" avec valeur par défaut "nouveau" pour le suivi des leads
- Création: script SQL de migration dans le projet (reproductible)
- Champs: nom, email, telephone, etablissement, type, message, status, created_at

### Sécurité et spam
- Anti-spam: Claude's discretion
- RLS: désactivé — pas de Row Level Security, la clé anon suffit pour cette landing page
- Clé Supabase: obfusquer légèrement dans le code source (pas sécurisé mais dissuade les curieux)
- Doublons: tout accepter — chaque soumission crée un nouvel enregistrement

### Claude's Discretion
- État de loading (spinner bouton vs overlay)
- Approche exacte pour la gestion d'erreur d'envoi (message + retry ou message simple)
- Protection anti-spam (honeypot, rate limiting, ou combinaison)
- Méthode d'obfuscation de la clé anon
- Structure exacte du script SQL de migration

</decisions>

<specifics>
## Specific Ideas

- Backend = Supabase self-hosted (pas Firebase) — URL et clé anon dans `.env`
- Landing page HTML statique — pas de framework, pas de build system
- La clé anon Supabase sera dans le code source (obfusquée légèrement)
- Le formulaire de contact existe déjà avec validation JS (Phase 2)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-firebase-integration*
*Context gathered: 2026-02-06*
