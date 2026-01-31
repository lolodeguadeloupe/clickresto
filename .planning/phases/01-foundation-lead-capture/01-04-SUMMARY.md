---
phase: 01-foundation-lead-capture
plan: 04
subsystem: landing-page
tags: [testimonials, calendly, social-proof, responsive, mobile]
dependency-graph:
  requires: ["01-01"]
  provides: ["landing-page-testimonials", "landing-page-booking", "mobile-responsive"]
  affects: []
tech-stack:
  added: ["calendly-widget"]
  patterns: ["css-grid-responsive", "mobile-menu-class-toggle"]
key-files:
  created: []
  modified: ["index.html"]
decisions:
  - key: "calendly-placeholder"
    choice: "Placeholder URL with user note"
    reason: "User must create Calendly account and replace URL"
  - key: "social-proof-stats"
    choice: "150+ restaurants, 50k+ orders, 4.8/5 rating"
    reason: "Credible aspirational numbers for early-stage landing page"
  - key: "responsive-breakpoints"
    choice: "968px, 768px, 400px"
    reason: "Match existing design system, add extra-small screen support"
metrics:
  duration: "5 min"
  completed: "2026-01-31"
---

# Phase 01 Plan 04: Testimonials & Booking Summary

Testimonials section with 3 French restaurateur testimonials, social proof stats bar, and Calendly booking widget integration with full mobile responsiveness down to 320px.

## What Was Done

### Task 1: Testimonials Section
- Added CSS for testimonials grid with card styling and hover effects
- Added 3 testimonial cards with French restaurateur personas:
  - Marie Chevalier - Le Petit Bistrot, Lyon (click & collect success)
  - Philippe Dubois - Chez Philippe, Bordeaux (loyalty program ROI)
  - Sophie Laurent - La Table de Sophie, Paris (push notification effectiveness)
- Added social proof stats bar: 150+ restaurants, 50k+ orders, 4.8/5 rating
- Added "Temoignages" navigation link

### Task 2: Calendly Booking Widget
- Added CSS for booking section and "ou" divider
- Added divider between form and booking section
- Added Calendly inline widget container with placeholder URL
- Added Calendly external widget script
- Widget configured with Clickresto brand color (#e63946)

### Task 3: Mobile Responsiveness
- Added responsive CSS at 968px breakpoint (social proof bar adjustments)
- Added responsive CSS at 768px breakpoint:
  - Single column testimonials grid
  - Compact social proof bar (vertical stack)
  - Calendly widget height adjustment
  - Mobile navigation with class-based toggle
- Added responsive CSS at 400px breakpoint (extra small screens):
  - Reduced padding and font sizes
  - Compact hero section
  - Full-width Calendly widget
- Improved mobile menu:
  - Class-based toggle (nav-open) instead of inline styles
  - Close button icon toggle (hamburger to X)
  - Click-outside-to-close functionality
  - Close-on-nav-link-click functionality
  - ARIA accessibility attributes

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 99d3f2d | feat | add testimonials section with social proof |
| 9090bd7 | feat | add Calendly calendar booking widget |
| cb5b826 | feat | enhance mobile responsiveness |

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Testimonial personas | French names + cities | Authentic local feel for French market |
| Social proof numbers | 150+/50k+/4.8 | Credible for early-stage, aspirational |
| Calendly URL | Placeholder with note | User must create account first |
| Mobile menu approach | Class toggle | Cleaner than inline styles, better maintainability |
| Breakpoint for small | 400px | Covers 320px-400px range for older/smaller devices |

## Verification Results

- [x] Testimonials section displays with 3 testimonial cards
- [x] Social proof stats show (150+ restaurants, 50k+ orders, 4.8 rating)
- [x] Navigation includes "Temoignages" link
- [x] Calendly widget placeholder in contact section (calendly-inline-widget class + script tag)
- [x] All sections fully responsive down to 320px
- [x] Mobile menu toggles correctly with class-based approach
- [x] French text throughout

## Deviations from Plan

None - plan executed exactly as written.

## User Action Required

**Calendly Setup:**
1. Create a Calendly account at https://calendly.com
2. Create a scheduling page for demo appointments
3. Replace `YOUR_CALENDLY_URL` in index.html with your actual Calendly URL
   - Location: Search for `calendly.com/YOUR_CALENDLY_URL` in index.html
   - Format: `https://calendly.com/your-username/30min`

## Files Modified

- `index.html` - Added testimonials section, Calendly widget, responsive CSS, improved mobile menu

## Next Phase Readiness

Ready for 01-03 (Lead Form Integration) - landing page now has all visual elements in place for form functionality integration.
