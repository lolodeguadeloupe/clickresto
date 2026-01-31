# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-31)

**Core value:** Les restaurateurs peuvent découvrir et demander une demo de la solution, et les affilies peuvent parrainer des restaurants et suivre leurs commissions facilement.
**Current focus:** Phase 1 - Foundation & Lead Capture

## Current Position

Phase: 1 of 3 (Foundation & Lead Capture)
Plan: 2 of 4 in current phase (estimated)
Status: In progress
Last activity: 2026-01-31 - Completed 01-03-PLAN.md (Lead Form Supabase Integration)

Progress: [██░░░░░░░░] 20%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 5 min
- Total execution time: 0.17 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-lead-capture | 2 | 10 min | 5 min |

**Recent Trend:**
- Last 5 plans: 01-01 (7 min), 01-03 (3 min)
- Trend: Faster execution

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Supabase for BDD + auth: Gratuit au depart, PostgreSQL, auth integree, scalable
- Next.js pour back-office: Modern, React-based, bon DX, SSR si besoin
- Commission fixe (pas recurrente): Simplicite pour v1, evite calculs mensuels complexes
- Validation manuelle des paiements: Controle humain avant tout virement, securite
- Next.js 16 proxy.ts: Session refresh via proxy.ts instead of middleware.ts (01-01)
- RLS performance: Wrap auth.uid() in subquery for optimizer caching (01-01)
- CDN for Supabase JS: No build step needed for static landing page (01-03)
- Graceful fallback mode: Form shows success even without Supabase configured (01-03)
- Snake_case DB columns: first_name, restaurant_name per SQL convention (01-03)

### Pending Todos

- User needs to create Supabase project and configure env vars
- User needs to run supabase/schema.sql in SQL Editor
- User needs to update js/supabase-config.js with Supabase credentials

### Blockers/Concerns

None - user setup required before testing.

## Session Continuity

Last session: 2026-01-31 13:12
Stopped at: Completed 01-03-PLAN.md (Lead Form Supabase Integration)
Resume file: None

---
*Last updated: 2026-01-31 after 01-03 plan completion*
