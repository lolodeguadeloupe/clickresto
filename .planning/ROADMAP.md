# Roadmap: Clickresto

## Overview

Complete the Clickresto landing page by building out the missing affiliation and contact sections, then connecting Firebase to capture leads. The template design exists; we're adding HTML structure and making it functional.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Affiliation Section** - Build affiliate program HTML with visual steps and reward card
- [ ] **Phase 2: Contact Form** - Add contact section with form validation and basic interactions
- [ ] **Phase 3: Firebase Integration** - Connect backend and complete lead capture workflow

## Phase Details

### Phase 1: Affiliation Section
**Goal**: Visitors can see the affiliate program details and understand how to earn 50€ per referral
**Depends on**: Nothing (first phase)
**Requirements**: AFF-01, AFF-02, AFF-03, AFF-04, AFF-05
**Success Criteria** (what must be TRUE):
  1. Affiliation section is visible on the page with working #affiliation anchor
  2. Program details clearly show 50€ commission per client
  3. Three visual steps explain the referral process (Inscription → Recommandation → Commission)
  4. Reward card displays the 50€ commission amount prominently
  5. CTA button links to contact form section
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 2: Contact Form
**Goal**: Visitors can submit contact requests through a functional form with validation
**Depends on**: Phase 1
**Requirements**: CTT-01, CTT-02, CTT-03, CTT-04, CTT-05, CTT-06, JS-01, JS-02
**Success Criteria** (what must be TRUE):
  1. Contact section is visible with working #contact anchor
  2. Form collects all required fields (nom, email, téléphone, établissement, type, message)
  3. Type selector distinguishes between Restaurateur and Apporteur d'affaires
  4. Client-side validation prevents incomplete submissions
  5. Mobile menu toggle works on small screens
  6. Smooth scroll works when clicking navigation anchors
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 3: Firebase Integration
**Goal**: Lead submissions are stored in Firebase and users receive confirmation
**Depends on**: Phase 2
**Requirements**: BAK-01, BAK-02, BAK-03, JS-03, JS-04
**Success Criteria** (what must be TRUE):
  1. Firebase project is configured with Firestore database
  2. Form submissions save to "contacts" collection in Firestore
  3. Security rules prevent public reads (write-only for public)
  4. Form shows loading state during submission
  5. Success message appears after successful submission
  6. Error state is handled if submission fails
**Plans**: TBD

Plans:
- [ ] TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Affiliation Section | 0/TBD | Not started | - |
| 2. Contact Form | 0/TBD | Not started | - |
| 3. Firebase Integration | 0/TBD | Not started | - |
