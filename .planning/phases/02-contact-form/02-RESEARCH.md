# Phase 2: Contact Form - Research

**Researched:** 2026-02-05
**Domain:** Client-side form validation, vanilla JavaScript interactions
**Confidence:** HIGH

## Summary

This research covers implementation of a contact form with client-side validation using vanilla JavaScript and HTML5 Constraint Validation API. The standard approach is to leverage native HTML5 validation attributes (required, pattern, type) enhanced with custom JavaScript for conditional logic and improved error messaging.

The existing codebase already has `scroll-behavior: smooth` set on the `<html>` element in index.html, which handles smooth scrolling without JavaScript. For French phone validation, the pattern is 10 digits starting with 0, typically formatted as "01 23 45 67 89". Toggle button groups should use semantic button elements with aria-pressed for accessibility, styled with CSS to match the "Pop & Coloré" template.

Key findings: HTML5 provides robust built-in validation that should be the foundation, JavaScript enhances UX with custom messages and conditional validation (établissement field depends on type selector), and accessibility requires aria-describedby, aria-invalid, and proper focus management.

**Primary recommendation:** Use HTML5 Constraint Validation API as the foundation, enhance with vanilla JavaScript for conditional logic, and implement focus management to scroll to the first error on submission.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 Constraint Validation API | Native | Form validation | Built into browsers, zero dependencies, standardized |
| Vanilla JavaScript | ES6+ | Custom validation logic | No dependencies needed for this scope |
| CSS3 | Native | Visual styling, smooth scroll | Built-in browser features |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | N/A | N/A | Vanilla implementation sufficient |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS | jQuery Validation Plugin | Adds 30KB dependency for features already in browsers |
| Native HTML5 | Third-party validation library (Parsley, Validate.js) | Unnecessary complexity for this phase scope |
| CSS animations | JavaScript animation libraries | Native CSS transitions are simpler and performant |

**Installation:**
```bash
# No installation needed - all native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
index.html
├── <style> section        # Existing CSS with form styles
├── <section id="contact"> # Contact section with form
└── <script> section       # Validation logic at end of body
```

### Pattern 1: HTML5-First Validation
**What:** Use native HTML5 validation attributes as primary validation mechanism
**When to use:** All basic validation (required, email, pattern matching)
**Example:**
```html
<!-- Source: MDN - Client-side form validation -->
<form novalidate>
  <label for="email">
    Email <span class="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-describedby="email-error"
  />
  <span id="email-error" class="error" aria-live="polite"></span>
</form>
```

### Pattern 2: Constraint Validation API Enhancement
**What:** Use JavaScript's Constraint Validation API for custom error messages
**When to use:** When custom error text or conditional validation is needed
**Example:**
```javascript
// Source: MDN - Constraint Validation API
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', (event) => {
  if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Veuillez entrer une adresse email valide');
  } else {
    emailInput.setCustomValidity(''); // Clear custom error
  }
});
```

### Pattern 3: Conditional Field Validation
**What:** Enable/disable validation based on other field values
**When to use:** For the "établissement" field that's required only for "Restaurateur"
**Example:**
```javascript
// Source: Research compilation - conditional validation pattern
const typeSelector = document.querySelectorAll('[name="type"]');
const etablissementInput = document.getElementById('etablissement');

typeSelector.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedType = document.querySelector('[name="type"]:checked').value;

    if (selectedType === 'restaurateur') {
      etablissementInput.setAttribute('required', '');
      etablissementInput.setAttribute('aria-required', 'true');
    } else {
      etablissementInput.removeAttribute('required');
      etablissementInput.removeAttribute('aria-required');
    }
  });
});
```

### Pattern 4: Focus on First Error
**What:** Scroll and focus the first invalid field after submission
**When to use:** Always on form submission when validation fails
**Example:**
```javascript
// Source: Aaron Gustafson - Bring Focus to First Error
form.addEventListener('submit', (event) => {
  const firstInvalid = form.querySelector(':invalid');

  if (firstInvalid) {
    event.preventDefault();

    // Scroll smoothly to element
    firstInvalid.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Focus after scroll completes
    setTimeout(() => {
      firstInvalid.focus();
    }, 300);
  }
});
```

### Pattern 5: Toggle Button Group
**What:** Styled button group for type selection (Restaurateur/Apporteur)
**When to use:** For mutually exclusive options styled as buttons
**Example:**
```html
<!-- Source: Inclusive Components - Toggle Button -->
<fieldset class="toggle-group" role="radiogroup" aria-labelledby="type-label">
  <legend id="type-label">Je suis</legend>
  <button
    type="button"
    role="radio"
    aria-checked="true"
    value="restaurateur"
    class="toggle-btn active"
  >
    Restaurateur
  </button>
  <button
    type="button"
    role="radio"
    aria-checked="false"
    value="apporteur"
    class="toggle-btn"
  >
    Apporteur d'affaires
  </button>
  <input type="hidden" name="type" value="restaurateur" />
</fieldset>
```

```javascript
// Toggle button group interaction
const toggleButtons = document.querySelectorAll('.toggle-btn');
const hiddenInput = document.querySelector('[name="type"]');

toggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update all buttons
    toggleButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });

    // Activate clicked button
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
    hiddenInput.value = btn.value;
  });
});
```

### Pattern 6: Submission States (Loading/Success)
**What:** Manage form state during and after submission
**When to use:** To provide feedback during async operations
**Example:**
```javascript
// Source: Research - Form loading states 2026
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';
  form.classList.add('loading');

  // Success state (for Phase 2, this simulates success)
  setTimeout(() => {
    form.style.display = 'none';
    const successMsg = document.querySelector('.form-success');
    successMsg.classList.add('show');
  }, 1000);
});
```

### Pattern 7: Error Display on Blur
**What:** Clear errors when user corrects input
**When to use:** To provide immediate feedback when errors are fixed
**Example:**
```javascript
// Source: MDN - Form Validation Best Practices
inputs.forEach(input => {
  input.addEventListener('blur', () => {
    if (input.validity.valid) {
      const errorSpan = input.nextElementSibling;
      if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('active');
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
      }
    }
  });
});
```

### Anti-Patterns to Avoid
- **Real-time validation on every keystroke:** Frustrates users before they finish typing; validate on blur or submit instead
- **Using `<a>` tags for toggle buttons:** Links are for navigation; use `<button>` elements with proper ARIA roles
- **Ignoring accessibility attributes:** Always include aria-describedby, aria-invalid, and aria-live for error messages
- **Client-only validation without server-side:** Always validate server-side; client-side is for UX only (Phase 3 will handle this)
- **Removing form on error:** Keep form visible with errors highlighted; only hide on success

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email validation | Custom regex parser | HTML5 `type="email"` + Constraint Validation API | Handles edge cases (internationalized domains, special chars) |
| Phone formatting | Custom input masking | HTML5 `pattern` attribute with regex | Native validation, simpler implementation |
| Smooth scrolling | Custom scroll animation | CSS `scroll-behavior: smooth` (already in codebase) | Hardware-accelerated, respects user preferences |
| Focus management | Manual scroll calculations | `element.scrollIntoView({ behavior: 'smooth' })` | Browser-optimized, handles edge cases |
| Form state management | Custom state machine | Native form properties + classList | Simpler, less buggy |

**Key insight:** HTML5 and modern JavaScript APIs handle 90% of form validation needs. Custom solutions introduce bugs around edge cases (internationalization, accessibility, browser quirks) that native APIs handle automatically.

## Common Pitfalls

### Pitfall 1: Immediate Validation on Input
**What goes wrong:** Showing errors while user is still typing
**Why it happens:** Listening to 'input' event and showing errors immediately
**How to avoid:** Validate on 'blur' (when user leaves field) or on 'submit'
**Warning signs:** Error messages appearing before user finishes typing

### Pitfall 2: Missing aria-describedby Connection
**What goes wrong:** Screen readers don't announce error messages
**Why it happens:** Error span not linked to input via aria-describedby
**How to avoid:** Always connect error messages: `<input aria-describedby="field-error">`
**Warning signs:** Errors visible but not announced by screen readers

### Pitfall 3: Forgetting to Clear Custom Validity
**What goes wrong:** Form won't submit even after fixing errors
**Why it happens:** `setCustomValidity()` called but never cleared with empty string
**How to avoid:** Always call `input.setCustomValidity('')` when valid
**Warning signs:** Input appears valid but form won't submit

### Pitfall 4: Hardcoded Field Requirements
**What goes wrong:** "Établissement" required even for "Apporteur d'affaires"
**Why it happens:** Setting `required` attribute in HTML only
**How to avoid:** Dynamically add/remove required based on type selector value
**Warning signs:** Users unable to submit as "Apporteur" without établissement

### Pitfall 5: Not Preventing Default on Invalid Submit
**What goes wrong:** Form submits with invalid data or page refreshes
**Why it happens:** Not calling `event.preventDefault()` when validation fails
**How to avoid:** Check validity first, preventDefault if invalid
**Warning signs:** Page reloads or form submits with errors

### Pitfall 6: French Phone Format Confusion
**What goes wrong:** Accepting 11+ digits or invalid formats
**Why it happens:** Not validating French-specific format (10 digits starting with 0)
**How to avoid:** Use pattern: `^0[1-9](?:[0-9]{2}){4}$` or with spaces: `^0[1-9](?: ?[0-9]{2}){4}$`
**Warning signs:** Accepting numbers like "12345678901" or "55 12 34 56 78"

### Pitfall 7: Missing novalidate Attribute
**What goes wrong:** Browser's default validation UI appears instead of custom UI
**Why it happens:** Forgetting `novalidate` on `<form>` element
**How to avoid:** Add `novalidate` to form, handle validation manually in JavaScript
**Warning signs:** Browser's generic tooltips appearing instead of custom error messages

### Pitfall 8: Loading State Without Disabled Form
**What goes wrong:** User can submit form multiple times during loading
**Why it happens:** Only disabling button, not preventing clicks on form
**How to avoid:** Disable button AND add pointer-events: none to form during loading
**Warning signs:** Multiple submissions visible in network tab

## Code Examples

Verified patterns from official sources:

### French Phone Number Validation
```javascript
// Source: RegexR - French Phone Validator + Research compilation
const phoneInput = document.getElementById('telephone');

// Pattern accepts: 0123456789 or 01 23 45 67 89
const phonePattern = /^0[1-9](?: ?[0-9]{2}){4}$/;

phoneInput.addEventListener('blur', () => {
  const value = phoneInput.value.trim();

  if (value && !phonePattern.test(value)) {
    phoneInput.setCustomValidity('Format attendu : 10 chiffres (ex: 01 23 45 67 89)');
    phoneInput.setAttribute('aria-invalid', 'true');
  } else {
    phoneInput.setCustomValidity('');
    phoneInput.removeAttribute('aria-invalid');
  }
});
```

### Email Validation (Comprehensive)
```javascript
// Source: MDN - Email Validation + AbstractAPI
const emailInput = document.getElementById('email');

// HTML5 type="email" handles basic validation
// Add custom message for French UX
emailInput.addEventListener('invalid', () => {
  if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Veuillez entrer une adresse email valide (ex: nom@exemple.com)');
  } else if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity('L\'email est requis');
  }
});

emailInput.addEventListener('input', () => {
  emailInput.setCustomValidity('');
});
```

### Complete Form Validation Handler
```javascript
// Source: MDN - Form Validation Guide + Research compilation
const form = document.getElementById('contact-form');
const inputs = form.querySelectorAll('input, textarea, select');

// Validate on blur for each field
inputs.forEach(input => {
  input.addEventListener('blur', () => {
    validateField(input);
  });

  // Clear errors on input after showing them
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) {
      validateField(input);
    }
  });
});

// Validate on submit
form.addEventListener('submit', (event) => {
  event.preventDefault();

  let isValid = true;
  let firstInvalid = null;

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
      if (!firstInvalid) {
        firstInvalid = input;
      }
    }
  });

  if (!isValid && firstInvalid) {
    // Scroll and focus first error
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstInvalid.focus(), 300);
  } else {
    // Form is valid, handle submission
    handleFormSubmit();
  }
});

function validateField(input) {
  const errorSpan = document.getElementById(`${input.id}-error`);

  if (!input.validity.valid) {
    // Show error
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');

    if (errorSpan) {
      errorSpan.textContent = input.validationMessage || getCustomErrorMessage(input);
      errorSpan.classList.add('active');
    }
    return false;
  } else {
    // Clear error
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');

    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('active');
    }
    return true;
  }
}

function getCustomErrorMessage(input) {
  if (input.validity.valueMissing) {
    return 'Ce champ est requis';
  }
  if (input.validity.typeMismatch) {
    return input.type === 'email'
      ? 'Veuillez entrer une adresse email valide'
      : 'Format invalide';
  }
  if (input.validity.patternMismatch) {
    if (input.type === 'tel') {
      return 'Format attendu : 10 chiffres (ex: 01 23 45 67 89)';
    }
    return 'Le format est incorrect';
  }
  return 'Valeur invalide';
}
```

### Mobile Menu Toggle
```javascript
// Source: W3Schools - Mobile Navigation Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  // Update aria for accessibility
  const isExpanded = navLinks.classList.contains('active');
  mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
  mobileMenuBtn.setAttribute('aria-label',
    isExpanded ? 'Fermer le menu' : 'Ouvrir le menu'
  );
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav')) {
    navLinks.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
});
```

### Dynamic Placeholder Update
```javascript
// Source: Research compilation - conditional UX pattern
const typeButtons = document.querySelectorAll('.toggle-btn');
const messageField = document.getElementById('message');

const placeholders = {
  restaurateur: 'Décrivez votre établissement et vos besoins...',
  apporteur: 'Parlez-nous de votre réseau et de vos motivations...'
};

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.value;
    messageField.placeholder = placeholders[type];
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery validation plugins | HTML5 + Constraint Validation API | ~2015-2020 | Native browser support, zero dependencies |
| JavaScript scroll libraries | CSS `scroll-behavior: smooth` | 2019-2021 | Already in codebase, no JS needed |
| Custom email regex | HTML5 `type="email"` | 2014+ | Better edge case handling |
| Real-time validation | Validate on blur/submit | 2020+ | Better UX, less frustration |
| Inline styles for states | CSS classes + classList API | Always current | Maintainable, reusable |

**Deprecated/outdated:**
- **jQuery Validation Plugin**: Still works but adds unnecessary dependency for features native to browsers
- **Parsley.js**: Opinionated validation library; HTML5 API is sufficient for this use case
- **Custom scroll animations with setInterval**: Replaced by native scrollIntoView and CSS scroll-behavior
- **alert() for error messages**: Replaced by inline error messages with ARIA live regions

## Open Questions

Things that couldn't be fully resolved:

1. **Minimum Message Length**
   - What we know: User wants 5-6 visible lines (controlled by CSS rows attribute)
   - What's unclear: Should there be a minimum character count validation?
   - Recommendation: Start without minlength; add only if receiving spam or low-quality submissions

2. **Server Error Handling**
   - What we know: Phase 2 simulates success, Phase 3 adds Firebase
   - What's unclear: Exact error format from Firebase (Phase 3 concern)
   - Recommendation: Prepare error display pattern now, populate with real errors in Phase 3

3. **Illustration/Icon Position**
   - What we know: User wants decorative element, Claude has discretion on placement
   - What's unclear: Above form, beside form, or floating element?
   - Recommendation: Place beside form on desktop (like landing_page_4.html contact section pattern), omit on mobile

## Sources

### Primary (HIGH confidence)
- [MDN - Client-side Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) - HTML5 validation attributes and Constraint Validation API
- [MDN - aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby) - Accessibility for error messages
- Current codebase (index.html, landing_page_4.html) - Existing style patterns

### Secondary (MEDIUM confidence)
- [W3C WAI - Form Validation](https://www.w3.org/WAI/tutorials/forms/validation/) - Validated accessibility patterns
- [Smashing Magazine - Accessible Form Validation](https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/) - Current best practices
- [SitePoint - Smooth Scrolling Vanilla JavaScript](https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/) - Modern scroll patterns
- [Aaron Gustafson - Focus on First Error](https://www.aaron-gustafson.com/notebook/bring-focus-to-the-first-form-field-with-an-error/) - Focus management pattern
- [W3Schools - Mobile Navigation Menu](https://www.w3schools.com/howto/howto_js_mobile_navbar.asp) - Menu toggle pattern

### Tertiary (LOW confidence - general trends)
- [RegexR - French Phone Validator](https://regexr.com/39a2p) - Phone pattern examples
- [AbstractAPI - Email Validation](https://www.abstractapi.com/guides/email-validation/email-address-pattern-validation) - Email regex patterns
- Various 2026 web searches for current state of validation libraries

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - HTML5 Constraint Validation API is well-documented and native
- Architecture: HIGH - MDN provides authoritative patterns, verified with multiple sources
- Pitfalls: HIGH - Common issues well-documented across multiple authoritative sources
- French phone validation: MEDIUM - Pattern verified across multiple sources but not official standard
- Toggle button styling: MEDIUM - Multiple approaches exist, chosen based on accessibility best practices

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable technology domain)
