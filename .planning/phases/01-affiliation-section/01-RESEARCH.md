# Phase 1: Affiliation Section - Research

**Researched:** 2026-02-05 (Updated for landing_page_4.html template)
**Domain:** HTML/CSS Landing Page Development
**Confidence:** HIGH

## Summary

Research focused on HTML5 semantic structure, CSS component patterns, and accessibility best practices for landing page sections. The template `landing_page_4.html` (now `index.html`) uses a "Pop & Coloré" design with:
- **Colors:** Corail (#FF6B6B), Indigo (#4D4D9A), Turquoise (#4ECDC4), Rose clair (#FFF5F5)
- **Fonts:** Fredoka One (titres), Poppins (corps)
- **Style:** Playful avec ombres décalées (box-shadow: 4-8px), formes arrondies (border-radius: 12-24px)

**Important:** Le CSS pour la section affiliation existe (lignes 197-214) mais le HTML n'est PAS présent. Le travail consiste à AJOUTER le HTML entre la section pricing (#tarifs) et le footer.

Le template inclut les classes CSS nécessaires :
- `.affiliation` - section container
- `.affiliation-container` - grid layout 2 colonnes
- `.affiliation-content` / `.affiliation-steps` - contenu et étapes
- `.affiliation-step` / `.step-number` / `.step-content` - indicateurs d'étapes
- `.reward-card` / `.reward-amount` / `.reward-icon` - carte de récompense

**Primary recommendation:** Ajouter le HTML de la section affiliation en utilisant les classes CSS existantes, avec commission de 50€, 3 étapes visuelles, et CTA vers #contact.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 | - | Semantic markup | Industry standard for web structure, built-in accessibility |
| CSS3 | - | Styling and layout | Native browser support, no dependencies needed |
| CSS Grid | - | 2D layouts (card grids, containers) | Modern layout system, equal-height cards, precise control |
| Flexbox | - | 1D layouts (step indicators) | Perfect for linear flows, space distribution, alignment |
| CSS Custom Properties | - | Theme variables | 96.19% browser support, dynamic theming, maintainability |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Fonts | - | Typography (DM Sans, DM Serif Display) | Already integrated in existing template |
| `scroll-behavior: smooth` | CSS3 | Smooth anchor navigation | Native CSS, accessibility-aware with prefers-reduced-motion |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla CSS | Tailwind CSS | Tailwind adds build step; existing template uses vanilla CSS with custom properties |
| CSS Grid | Flexbox for cards | Grid better for 2D layouts, ensures equal-height cards across rows |
| Native smooth scroll | JavaScript libraries | JS adds complexity; CSS scroll-behavior is sufficient for basic anchor navigation |

**Installation:**
```bash
# No installation required - vanilla HTML/CSS
# Template already includes Google Fonts via CDN
```

## Architecture Patterns

### Recommended Project Structure
```
clickresto/
├── index.html           # Single-page landing (existing)
├── assets/              # Future: images, icons
└── .planning/           # GSD planning docs
```

### Pattern 1: Semantic Section Structure
**What:** Use semantic HTML5 `<section>` elements with headings and ID anchors
**When to use:** Every major content block on a landing page
**Example:**
```html
<!-- Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section -->
<section class="affiliation" id="affiliation">
  <div class="container">
    <h2>Section Heading</h2>
    <p>Content...</p>
    <a href="#contact" class="btn">CTA Button</a>
  </div>
</section>
```

**Key accessibility:**
- Always include a heading (h1-h6) inside `<section>` for screen readers
- Use `id` attribute for anchor navigation
- Section gets implicit ARIA `region` role when it has accessible name

### Pattern 2: CSS Grid for Card Layouts
**What:** Use CSS Grid with `grid-template-rows` for equal-height card components
**When to use:** Reward cards, pricing cards, feature cards
**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Card */
.reward-card {
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  /* Header: sized to content, Content: fills space, Footer: sized to content */
}

/* Container for multiple cards */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
```

### Pattern 3: Flexbox for Step Indicators
**What:** Flexbox for horizontal or vertical process flows with even spacing
**When to use:** Multi-step processes, timelines, progress indicators
**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout */
.affiliation-steps {
  display: flex;
  flex-direction: column;  /* or row for horizontal */
  gap: 1.5rem;
}

.affiliation-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;  /* Prevents shrinking */
}
```

### Pattern 4: CSS Custom Properties for Theming
**What:** Define color variables in `:root` for consistent theme across site
**When to use:** Any project requiring color consistency and maintainability
**Example:**
```css
/* Source: Existing template, verified with MDN */
:root {
  --primary: #E63946;
  --primary-dark: #c41e2d;
  --secondary: #1D3557;
  --accent: #F4A261;
  --background: #F1FAEE;
  --neutral: #457B9D;
  --white: #FFFFFF;
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}
```

### Pattern 5: Mobile-First Responsive Design
**What:** Start with mobile layout, enhance for larger screens with media queries
**When to use:** All modern landing pages (mobile traffic dominates)
**Example:**
```css
/* Mobile first: base styles for small screens */
.affiliation-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* Enhance for tablets and desktop */
@media (min-width: 768px) {
  .affiliation-container {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}
```

### Anti-Patterns to Avoid
- **Overusing `<div>`:** Don't use `<div>` when semantic elements (`<section>`, `<article>`, `<nav>`) provide meaning
- **Missing headings in sections:** Every `<section>` should have a heading (h1-h6) for accessibility and SEO
- **Inline styles:** Existing template uses classes and CSS custom properties; maintain this pattern
- **Removing focus outlines:** Never remove `:focus` states; keyboard users depend on them
- **Vague CTA text:** Don't use "click here" or "learn more"; use action-oriented text like "Devenir partenaire"

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth anchor scroll | Custom JavaScript scroll animation | `scroll-behavior: smooth` in CSS | Native, accessible, respects prefers-reduced-motion, no dependencies |
| Color theming | Hardcoded color values throughout CSS | CSS custom properties (variables) | Single source of truth, easy theme updates, already in template |
| Card equal heights | JavaScript height calculation | CSS Grid with `1fr` rows | Self-balancing, responsive, no reflow calculations |
| Responsive spacing | Manual breakpoint-specific values | `clamp()` for fluid typography | `font-size: clamp(2rem, 4vw, 2.75rem)` scales smoothly |
| Flexbox gaps | Margin on child elements with `:not(:last-child)` | `gap` property | Cleaner syntax, no edge cases, works with Grid and Flex |

**Key insight:** Modern CSS has native solutions for layout, spacing, and animation that are more performant and accessible than JavaScript alternatives. The existing template already uses these patterns correctly.

## Common Pitfalls

### Pitfall 1: Missing Heading in Section
**What goes wrong:** Section without heading reduces accessibility and SEO value
**Why it happens:** Developers use `<section>` as styling container like `<div>`
**How to avoid:** Every `<section>` must have heading (h1-h6) or use `aria-label` if heading not appropriate
**Warning signs:** Section that's purely visual grouping (use `<div>` instead)

**Example:**
```html
<!-- WRONG: No heading -->
<section class="affiliation" id="affiliation">
  <div class="container">
    <p>Content...</p>
  </div>
</section>

<!-- CORRECT: Has heading -->
<section class="affiliation" id="affiliation">
  <div class="container">
    <h2>Devenez apporteur d'affaires</h2>
    <p>Content...</p>
  </div>
</section>
```

### Pitfall 2: Anchor Navigation Without ID
**What goes wrong:** Clicking navigation link doesn't scroll to section or creates broken link
**Why it happens:** Forgot to add `id` attribute to target section
**How to avoid:** Every section linked from navigation must have unique `id` matching `href`
**Warning signs:** Clicking nav link changes URL but doesn't scroll

**Example:**
```html
<!-- Navigation link -->
<a href="#affiliation">Programme partenaire</a>

<!-- Target section MUST have matching id -->
<section class="affiliation" id="affiliation">
  <!-- content -->
</section>
```

### Pitfall 3: Buried Value Proposition Below Fold
**What goes wrong:** Visitors leave before seeing key information (50€ commission amount)
**Why it happens:** Too much content before important details
**How to avoid:** Show commission amount and visual steps in viewport on first load
**Warning signs:** High bounce rate, low scroll depth in analytics

### Pitfall 4: Unclear CTA Text
**What goes wrong:** Generic "Click here" or "Learn more" buttons don't motivate action
**Why it happens:** Vague language doesn't communicate value or outcome
**How to avoid:** Use action-oriented, specific text: "Devenir partenaire →" or "Rejoindre le programme"
**Warning signs:** Low CTA click-through rate

### Pitfall 5: Breaking Smooth Scroll for Users with Motion Sensitivity
**What goes wrong:** Smooth scroll causes discomfort for users with vestibular disorders
**Why it happens:** Not respecting `prefers-reduced-motion` preference
**How to avoid:** Always check user preference before applying animations
**Warning signs:** Accessibility audit flags motion without respect for user preferences

**Example:**
```css
/* WRONG: Forces smooth scroll for everyone */
html {
  scroll-behavior: smooth;
}

/* CORRECT: Respects user preference */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

### Pitfall 6: Too Many CTAs
**What goes wrong:** Multiple competing calls-to-action confuse visitors and reduce conversions
**Why it happens:** Trying to serve multiple goals in one section
**How to avoid:** One primary CTA per section; affiliation section should only link to contact form
**Warning signs:** Decision paralysis, low overall conversion rate

### Pitfall 7: Slow Loading from Unoptimized Assets
**What goes wrong:** Page loads slowly, increasing bounce rate (must load under 3 seconds)
**Why it happens:** Large images, unminified CSS, render-blocking resources
**How to avoid:** Optimize images, use modern formats (WebP), inline critical CSS, defer non-critical resources
**Warning signs:** Lighthouse performance score below 90, high bounce rate on mobile

## Code Examples

Verified patterns from official sources:

### Accessible Section with Anchor Navigation
```html
<!-- Source: W3C WAI https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/ -->
<nav aria-label="Navigation principale">
  <a href="#affiliation">Programme partenaire</a>
  <a href="#contact">Contact</a>
</nav>

<section class="affiliation" id="affiliation">
  <div class="container">
    <h2>Devenez apporteur d'affaires</h2>
    <p>Recommandez Clickresto et gagnez 50€ par client signé.</p>
  </div>
</section>
```

### Step Indicator Pattern
```html
<!-- Source: Existing template (verified pattern) -->
<div class="affiliation-steps">
  <div class="affiliation-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <h4>Inscription</h4>
      <p>Rejoignez gratuitement notre programme d'affiliation</p>
    </div>
  </div>
  <div class="affiliation-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <h4>Recommandation</h4>
      <p>Parlez de Clickresto aux restaurateurs de votre réseau</p>
    </div>
  </div>
  <div class="affiliation-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <h4>Commission</h4>
      <p>Recevez 50€ pour chaque restaurant qui signe</p>
    </div>
  </div>
</div>
```

### Reward Card Component
```html
<!-- Source: Existing template with MDN Grid pattern -->
<div class="reward-card">
  <div class="reward-icon">💰</div>
  <h3>Prime de parrainage</h3>
  <div class="reward-amount">50€</div>
  <p>par restaurant signé grâce à vous</p>
</div>
```

```css
.reward-card {
  background: var(--white);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(29, 53, 87, 0.1);
  position: relative;
}

.reward-amount {
  font-family: 'DM Serif Display', serif;
  font-size: 4rem;
  color: var(--primary);
  line-height: 1;
  margin: 1rem 0;
}
```

### CTA Button with Accessible Focus
```html
<!-- Source: Template pattern -->
<a href="#contact" class="btn btn-secondary">
  Devenir partenaire →
</a>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: var(--secondary);
  color: var(--white);
}

.btn-secondary:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

/* CRITICAL: Never remove focus outline */
.btn:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
}
```

### Responsive Container Pattern
```css
/* Source: Existing template pattern */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.affiliation-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .affiliation-container {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Float layouts | CSS Grid & Flexbox | ~2017 | Simpler responsive layouts, no clearfix hacks |
| Sass/LESS variables | CSS custom properties | ~2018 | Native browser support, dynamic theming, no build step |
| JavaScript smooth scroll | `scroll-behavior: smooth` | ~2019 | Native, accessible, respects motion preferences |
| Fixed pixel spacing | `clamp()` for fluid sizing | ~2020 | Responsive without breakpoints, better UX |
| Media queries only | Container queries | 2023-2024 | Component-level responsiveness, better modularity |
| Pixels for breakpoints | `em`/`rem` units | Ongoing | Respects user font-size preferences, accessibility |

**Deprecated/outdated:**
- **Floats for layout:** Replaced by Grid and Flexbox (keep for text wrapping only)
- **Vendor prefixes for Grid/Flex:** No longer needed for modern browsers (2020+)
- **`<div class="clearfix">`:** Not needed with Grid/Flexbox
- **Polyfills for CSS variables:** 96.19% browser support, legacy browsers (IE11) no longer supported

**Emerging in 2026:**
- **`:has()` selector:** Parent selectors without JavaScript (example: `.card:has(img)` to style cards differently if they contain images)
- **Cascade layers (`@layer`):** Better CSS organization and specificity control
- **Subgrid:** Nested grids that align with parent grid lines
- **View transitions API:** Native page transitions

## Open Questions

1. **Image Assets for Reward Card Icon**
   - What we know: Template uses emoji (💰) as placeholder
   - What's unclear: Should we replace emoji with custom icon/illustration?
   - Recommendation: Keep emoji for Phase 1 (quick launch), add custom icon in future phase if needed

2. **Mobile Menu Toggle Implementation**
   - What we know: Requirement JS-01 (mobile menu) is in Phase 2, not Phase 1
   - What's unclear: Does affiliation section need any mobile-specific behavior?
   - Recommendation: No mobile-specific changes needed for Phase 1; section already responsive

3. **French Language Validation**
   - What we know: Content is in French, commission changed from 100€ to 50€
   - What's unclear: Should step titles match exact wording from requirements?
   - Recommendation: Requirements specify "Inscription → Recommandation → Commission" - verify exact wording in template matches

4. **Accessibility Audit Coverage**
   - What we know: Template uses semantic HTML, proper headings, keyboard navigation
   - What's unclear: Has template been tested with screen readers?
   - Recommendation: Manual verification with NVDA/VoiceOver in Phase 1 testing

## Sources

### Primary (HIGH confidence)
- [MDN - HTML section element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section) - Section structure and accessibility
- [MDN - CSS Card Layout Cookbook](https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Card) - Card component patterns
- [MDN - Flexbox Basic Concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) - Step indicator layouts
- [MDN - aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) - Accessibility labeling
- [MDN - CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Theming
- [W3C WAI - In-Page Navigation](https://www.w3.org/WAI/tutorials/page-structure/in-page-navigation/) - Anchor navigation accessibility

### Secondary (MEDIUM confidence)
- [Landing Page Design Trends 2026](https://graphicdesignjunction.com/2026/01/landing-page-design-trends-2026/) - Visual design patterns
- [Responsive Design Best Practices 2026](https://pxlpeak.com/blog/web-design/responsive-design-best-practices) - Mobile-first approach
- [Modern CSS Toolkit 2026](https://www.nickpaolini.com/blog/modern-css-toolkit-2026) - Container queries, :has() selector
- [10 Landing Page Mistakes to Avoid in 2026](https://moosend.com/blog/landing-page-mistakes/) - Common pitfalls
- [CTA Placement Strategies for 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - Button best practices

### Tertiary (LOW confidence)
- Various CSS step indicator examples (unverified implementations) - Used for pattern discovery only, not code

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vanilla HTML/CSS are stable, well-documented standards
- Architecture: HIGH - MDN documentation verified, existing template follows best practices
- Pitfalls: MEDIUM - Based on multiple sources + 2026 trends, some WebSearch-only findings

**Research date:** 2026-02-05
**Valid until:** ~2026-04-05 (60 days - HTML/CSS standards are stable, longer validity than fast-moving frameworks)

**Special note:** Existing template (index.html) already implements affiliation section with modern patterns. Primary task is content verification and alignment with 50€ commission requirement, not building from scratch.
