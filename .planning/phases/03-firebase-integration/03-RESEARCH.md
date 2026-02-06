# Phase 3: Firebase Integration - Research

**Researched:** 2026-02-06
**Domain:** Supabase JavaScript client integration for static HTML
**Confidence:** HIGH

## Summary

Phase 3 integrates Supabase (self-hosted) with the existing static HTML contact form to store lead submissions. The research confirms that Supabase's JavaScript client (supabase-js v2) works seamlessly with vanilla JavaScript via CDN, making it ideal for this static landing page project.

The standard approach is to:
1. Load `@supabase/supabase-js@2` via CDN (jsDelivr or unpkg)
2. Initialize the client with URL and anon key
3. Use `.from('table').insert()` for submissions
4. Handle loading/success/error states with vanilla JavaScript
5. Implement basic anti-spam (honeypot) and validation

Key finding: The user has decided to **disable RLS** for this simple landing page, relying only on the anon key for access control. This simplifies implementation but requires granting explicit INSERT permissions to the `anon` role on the `contacts` table.

**Primary recommendation:** Use Supabase JS v2 from CDN with a simple SQL migration script, implement honeypot anti-spam, and provide clear user feedback for all submission states (loading, success, error, offline, timeout).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | 2.x (latest 2.90.1) | Supabase client for browser | Official JavaScript client, supports CDN loading, actively maintained, well-documented |
| PostgreSQL | 14+ | Database (via Supabase) | Supabase's underlying database, provides ACID compliance, constraints, timestamps |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | - | Pure vanilla JS | Static HTML page constraint — no build system, no frameworks |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CDN loading | npm + bundler | Would require build system (violates project constraint) |
| Supabase | Firebase | User decided on Supabase (self-hosted) — decision locked |
| Honeypot | reCAPTCHA | User prefers simpler UX, honeypot sufficient for this use case |

**Installation:**
```html
<!-- Via jsDelivr (recommended) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Via unpkg (alternative) -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
```

## Architecture Patterns

### Recommended Project Structure
```
/home/laurent/mesprojets/clickresto/
├── index.html              # Main landing page with form
├── .env                    # Supabase credentials (gitignored)
├── migrations/
│   └── 001_create_contacts_table.sql  # Reproducible migration
└── js/
    └── contact-form.js     # Form handling logic (optional extraction)
```

### Pattern 1: CDN Client Initialization
**What:** Load Supabase client via CDN and initialize with credentials
**When to use:** Static HTML projects without build systems
**Example:**
```html
<!-- Source: https://supabase.com/docs/reference/javascript/installing -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Access via global supabase object
  const { createClient } = supabase;

  // Obfuscated credentials (mild deterrent, not secure)
  const SUPABASE_URL = atob('aHR0cDovL3N1cGFiYXNla29uZy1mOHdzMDRzZzg0d2Nvd2NvY2c4OGNnOG8uMzcuNTkuMTIxLjQwLnNzbGlwLmlv');
  const SUPABASE_KEY = atob('ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0ltbGhkQ0k2TVRZM09UZzJNalk...');

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
</script>
```

### Pattern 2: Insert Data
**What:** Submit form data to Supabase table
**When to use:** Any form submission to Supabase
**Example:**
```javascript
// Source: https://supabase.com/docs/reference/javascript/insert
async function submitContact(formData) {
  const { data, error } = await supabaseClient
    .from('contacts')
    .insert({
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      etablissement: formData.etablissement,
      type: formData.type,
      message: formData.message
      // status and created_at handled by database defaults
    });

  if (error) {
    console.error('Insert error:', error);
    throw error;
  }

  return data;
}
```

### Pattern 3: Timeout Handling
**What:** Abort fetch requests after timeout using AbortSignal
**When to use:** User specified 10-second timeout requirement
**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
async function submitWithTimeout(formData) {
  try {
    const signal = AbortSignal.timeout(10000); // 10 seconds

    const { data, error } = await supabaseClient
      .from('contacts')
      .insert(formData);

    // Note: Supabase client doesn't directly support AbortSignal
    // Timeout handling happens at PostgREST layer
    // For explicit timeout, wrap in Promise.race with setTimeout

    if (error) throw error;
    return data;
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new Error('La requête a expiré. Vérifiez votre connexion.');
    }
    throw err;
  }
}
```

### Pattern 4: Offline Detection
**What:** Check network status before form submission
**When to use:** User specified offline detection requirement
**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
function checkOnlineStatus() {
  if (!navigator.onLine) {
    throw new Error('Vous êtes hors ligne. Vérifiez votre connexion internet.');
  }
}

// Listen for network changes
window.addEventListener('offline', () => {
  console.log('Network offline');
  // Show offline indicator
});

window.addEventListener('online', () => {
  console.log('Network online');
  // Hide offline indicator
});
```

### Pattern 5: Loading State (Button Spinner)
**What:** Disable button and show spinner during submission
**When to use:** Prevent double submission, provide feedback
**Example:**
```javascript
// Source: https://www.w3schools.com/howto/howto_css_loading_buttons.asp
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span> Envoi...';
    button.classList.add('loading');
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
    button.classList.remove('loading');
  }
}

// CSS for spinner
/*
.btn.loading { opacity: 0.7; cursor: not-allowed; }
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
*/
```

### Pattern 6: Success Feedback
**What:** Replace form with success message, provide reset option
**When to use:** User specified in-place success message requirement
**Example:**
```javascript
function showSuccess(form, successDiv) {
  form.style.display = 'none';
  successDiv.innerHTML = `
    <div class="success-icon">✓</div>
    <p>Merci ! Nous vous recontacterons sous 48h.</p>
    <button type="button" class="btn btn-secondary" onclick="resetForm()">
      Envoyer un autre message
    </button>
  `;
  successDiv.classList.add('show');
}

function resetForm() {
  const form = document.getElementById('contactForm');
  const successDiv = document.querySelector('.form-success');

  form.reset();
  form.style.display = 'block';
  successDiv.classList.remove('show');
}
```

### Pattern 7: Honeypot Anti-Spam
**What:** Hidden field that bots fill but humans don't
**When to use:** Simple anti-spam for public forms
**Example:**
```html
<!-- Source: https://dev.to/felipperegazio/how-to-create-a-simple-honeypot-to-protect-your-web-forms-from-spammers--25n8 -->
<!-- Don't use type="hidden" or inline CSS - bots detect these -->
<div class="form-group" style="position: absolute; left: -9999px;">
  <label for="website">Website (leave blank)</label>
  <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
</div>
```
```javascript
form.addEventListener('submit', (e) => {
  const honeypot = document.getElementById('website');
  if (honeypot.value !== '') {
    e.preventDefault();
    console.warn('Bot detected - honeypot filled');
    return false;
  }
  // Continue with normal submission
});
```

### Anti-Patterns to Avoid
- **Exposing service_role key in client code:** Never use service_role key in browser — it bypasses all security
- **Trusting navigator.onLine alone:** Can give false positives; use as hint only
- **Not validating on server:** Client validation can be bypassed; always validate with PostgreSQL constraints
- **Using inline CSS to hide honeypot:** Modern bots detect this; use external CSS with position: absolute
- **Storing sensitive data without RLS:** User disabled RLS for this project, but typically RLS is mandatory for exposed tables

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database connection | Custom WebSocket/HTTP client | Supabase JS client | Handles auth, connection pooling, retries, error formatting |
| Form validation | Regex-only validation | Client JS + PostgreSQL constraints | Double validation prevents bypassing; DB constraints are source of truth |
| API key obfuscation | Complex encryption in JS | Simple base64 encoding + proxy (future) | Client-side "encryption" is security theater; base64 deters casual viewers |
| Rate limiting | JavaScript timestamp tracking | Server-side rate limiting (future) | Client-side limits easily bypassed; JS honeypot is sufficient for Phase 3 |
| Loading spinners | Complex SVG animations | Simple CSS border animation | Lightweight, works everywhere, no dependencies |

**Key insight:** For database operations, always use the official Supabase client rather than raw fetch() calls. It handles authentication, error formatting, connection management, and TypeScript types. The client is battle-tested and actively maintained.

## Common Pitfalls

### Pitfall 1: Supabase Client Access Pattern with CDN
**What goes wrong:** Trying to use ES6 import syntax with CDN scripts
**Why it happens:** Documentation shows npm examples, developers copy them for CDN
**How to avoid:** With CDN, access via global `supabase` object:
```javascript
// WRONG (ES6 import doesn't work with CDN script tag)
import { createClient } from '@supabase/supabase-js';

// RIGHT (access global object)
const { createClient } = supabase;
```
**Warning signs:** `import` statement in HTML with script tag (not type="module")

### Pitfall 2: Insert Without Response
**What goes wrong:** Assuming `insert()` returns inserted data by default
**Why it happens:** Many ORMs return data automatically; Supabase requires explicit `.select()`
**How to avoid:** Chain `.select()` if you need the inserted record:
```javascript
// Returns nothing by default
const { error } = await supabase.from('contacts').insert(data);

// Returns inserted data
const { data, error } = await supabase.from('contacts').insert(data).select();
```
**Warning signs:** `data` is null after successful insert

### Pitfall 3: RLS Disabled but No Permissions
**What goes wrong:** Table created, RLS disabled, but inserts fail with 403/401
**Why it happens:** Disabling RLS doesn't grant permissions; must explicitly GRANT to anon role
**How to avoid:** After creating table, explicitly grant permissions:
```sql
-- Disable RLS (user decision)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Grant INSERT permission to anon role
GRANT INSERT ON contacts TO anon;
GRANT SELECT ON contacts TO anon; -- If .select() is used
```
**Warning signs:** "permission denied" or 403 errors despite RLS disabled

### Pitfall 4: Timeout Implementation with Supabase Client
**What goes wrong:** Trying to pass AbortSignal to Supabase client methods
**Why it happens:** Supabase client doesn't expose AbortSignal parameter directly
**How to avoid:** Use Promise.race with setTimeout for timeout handling:
```javascript
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
}

try {
  const result = await Promise.race([
    supabase.from('contacts').insert(data),
    timeout(10000)
  ]);
} catch (err) {
  if (err.message === 'Timeout') {
    // Handle timeout
  }
}
```
**Warning signs:** Supabase requests hanging indefinitely

### Pitfall 5: navigator.onLine False Positives
**What goes wrong:** `navigator.onLine === true` but no internet access (local network only)
**Why it happens:** onLine checks device network connection, not internet connectivity
**How to avoid:** Use as hint only, don't block submission. Let Supabase error handle real connectivity issues:
```javascript
// Use as warning, not blocker
if (!navigator.onLine) {
  showWarning('Vous semblez être hors ligne');
  // Still allow submission attempt - might have connectivity
}
```
**Warning signs:** Users complaining they can't submit despite having internet

### Pitfall 6: Honeypot Detection by Bots
**What goes wrong:** Bots still submitting despite honeypot field
**Why it happens:** Using obvious field names like "honeypot" or type="hidden"
**How to avoid:** Use realistic field name, hide with CSS, not HTML:
```html
<!-- BAD: Obvious trap -->
<input type="hidden" name="honeypot">

<!-- BAD: Inline CSS detected by bots -->
<input type="text" name="trap" style="display:none">

<!-- GOOD: Realistic name, external CSS -->
<div class="hp-field"> <!-- CSS: .hp-field { position:absolute; left:-9999px; } -->
  <label for="company_url">Company URL</label>
  <input type="text" name="company_url" tabindex="-1" autocomplete="off">
</div>
```
**Warning signs:** Spam submissions with honeypot field name changing frequently

## Code Examples

Verified patterns from official sources:

### SQL Migration: Create Contacts Table
```sql
-- Source: PostgreSQL docs + Supabase best practices
-- File: migrations/001_create_contacts_table.sql
-- Purpose: Create contacts table for lead submissions

-- Create table with constraints
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  etablissement TEXT, -- Optional for "apporteur" type
  type TEXT NOT NULL CHECK (type IN ('restaurateur', 'apporteur')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add email format constraint
ALTER TABLE contacts ADD CONSTRAINT email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone format constraint (French: 10 digits starting with 0)
ALTER TABLE contacts ADD CONSTRAINT phone_format
  CHECK (telephone ~ '^0[1-9][0-9]{8}$');

-- Disable RLS (user decision - landing page with anon key only)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Grant INSERT permission to anon role
GRANT INSERT ON contacts TO anon;

-- Optional: Grant SELECT if using .select() after insert
-- GRANT SELECT ON contacts TO anon;

-- Create index on created_at for admin queries
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Create index on status for admin filtering
CREATE INDEX idx_contacts_status ON contacts(status);
```

### Complete Form Submission Handler
```javascript
// Source: Combination of Supabase docs + MDN web APIs
// Complete form submission logic with all requirements

(function() {
  'use strict';

  // Initialize Supabase client
  const { createClient } = supabase;

  // Decode obfuscated credentials (mild deterrent)
  const SUPABASE_URL = atob('aHR0cDovL3N1cGFiYXNla29uZy1mOHdzMDRzZzg0d2Nvd2NvY2c4OGNnOG8uMzcuNTkuMTIxLjQwLnNzbGlwLmlv');
  const SUPABASE_KEY = atob('ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0ltbGhkQ0k2TVRZM09UZzJNalk2TUN3aVpYaHdJam8wT1RJMU5UTTJNall3TENKeWIyeGxJam9pWVc1dmJpSjkuZjBDV3ZBVHkwakpmY0pTR3d1SjFROExCUFdYVm5fLXppVkNLQWtLak5Dcw==');

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  // DOM elements
  const form = document.getElementById('contactForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successDiv = document.querySelector('.form-success');

  // Timeout helper
  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), ms)
      )
    ]);
  }

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot (anti-spam)
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value !== '') {
      console.warn('Bot detected');
      return;
    }

    // Check online status (warning only)
    if (!navigator.onLine) {
      showError('Vous êtes hors ligne. Vérifiez votre connexion internet.');
      return;
    }

    // Gather form data
    const formData = {
      nom: document.getElementById('nom').value.trim(),
      email: document.getElementById('email').value.trim(),
      telephone: document.getElementById('telephone').value.replace(/\s/g, ''),
      etablissement: document.getElementById('etablissement').value.trim() || null,
      type: document.querySelector('input[name="type"]').value,
      message: document.getElementById('message').value.trim() || null
    };

    // Set loading state
    setButtonLoading(submitBtn, true);
    clearErrors();

    try {
      // Submit with 10-second timeout
      const { data, error } = await withTimeout(
        supabaseClient.from('contacts').insert(formData),
        10000
      );

      if (error) {
        throw error;
      }

      // Success!
      showSuccess();

    } catch (err) {
      console.error('Submission error:', err);

      if (err.message === 'TIMEOUT') {
        showError('La requête a expiré. Veuillez réessayer.');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        showError('Erreur de connexion. Vérifiez votre internet.');
      } else {
        showError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  // Helper functions
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = '<span class="spinner"></span> Envoi...';
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText;
    }
  }

  function showSuccess() {
    form.style.display = 'none';
    successDiv.innerHTML = `
      <div class="success-icon">✓</div>
      <p>Merci ! Nous vous recontacterons sous 48h.</p>
      <button type="button" class="btn btn-secondary" onclick="window.resetContactForm()">
        Envoyer un autre message
      </button>
    `;
    successDiv.classList.add('show');
  }

  function showError(message) {
    // Display error message (implementation depends on design)
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, submitBtn);

    setTimeout(() => errorDiv.remove(), 5000);
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
  }

  // Global reset function
  window.resetContactForm = function() {
    form.reset();
    form.style.display = 'block';
    successDiv.classList.remove('show');
  };
})();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Firebase SDK v8 (compat) | Supabase JS v2 | User decision 2026-02 | Open source alternative, self-hosted, PostgreSQL instead of Firestore |
| RLS always required | RLS optional for simple use cases | Ongoing | User opted to disable RLS for this simple landing page |
| jQuery for AJAX | Vanilla JS fetch/async-await | 2015+ | Modern JS makes jQuery unnecessary; fetch API standard |
| navigator.onLine as blocker | navigator.onLine as hint | 2020+ | Recognized as unreliable; use for warnings, not blocking |
| Complex obfuscation | Simple encoding + server proxy | Ongoing | Accepted that client keys will be exposed; focus on permissions |
| reCAPTCHA | Honeypot + server-side validation | 2020+ | Better UX; reCAPTCHA often annoying for users |

**Deprecated/outdated:**
- Firebase Realtime Database: Replaced by Firestore, or in this case, Supabase PostgreSQL
- Supabase JS v1: v2 released with improved TypeScript support and better API
- `XMLHttpRequest`: Replaced by fetch API for modern async operations

## Open Questions

1. **Rate limiting implementation**
   - What we know: User specified it as "Claude's discretion", honeypot is standard
   - What's unclear: Whether to implement client-side rate limiting (easily bypassed) or defer to Phase 4 backend work
   - Recommendation: Start with honeypot only; add server-side rate limiting in future phase if spam becomes issue

2. **Obfuscation method effectiveness**
   - What we know: Base64 encoding is simple, provides minimal protection
   - What's unclear: Whether this level of obfuscation meets user's "dissuade les curieux" goal
   - Recommendation: Use base64 (atob/btoa) for anon key; emphasize that real security comes from limited permissions, not hiding the key

3. **Error message specificity**
   - What we know: User wants clear error handling but didn't specify exact messages
   - What's unclear: How detailed to make error messages (e.g., "network error" vs "connection timeout" vs generic "error occurred")
   - Recommendation: Provide 3 specific messages (timeout, network, generic) based on error type; avoid exposing technical details to users

## Sources

### Primary (HIGH confidence)
- [Supabase JavaScript Installing](https://supabase.com/docs/reference/javascript/installing) - CDN installation, current version
- [Supabase JavaScript Insert](https://supabase.com/docs/reference/javascript/insert) - Insert API, syntax, examples
- [Supabase JavaScript Initializing](https://supabase.com/docs/reference/javascript/initializing) - createClient configuration
- [Supabase API Keys Guide](https://supabase.com/docs/guides/api/api-keys) - anon vs service_role key usage and security
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - RLS policies and disabling
- [Supabase Tables Guide](https://supabase.com/docs/guides/database/tables) - Table creation, data types
- [PostgreSQL CREATE TABLE Documentation](https://www.postgresql.org/docs/16/sql-createtable.html) - Table syntax, constraints
- [MDN AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) - Timeout implementation
- [MDN Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) - Network detection

### Secondary (MEDIUM confidence)
- [Medium: Subscription Form with Vanilla JS and Supabase](https://medium.com/@anthony.vdo/how-to-create-a-subscription-form-with-vanilla-javascript-and-supabase-for-free-3f5f992c87ff) - Real-world vanilla JS example
- [DEV: Honeypot Anti-Spam](https://dev.to/felipperegazio/how-to-create-a-simple-honeypot-to-protect-your-web-forms-from-spammers--25n8) - Modern honeypot implementation
- [W3Schools: Loading Buttons](https://www.w3schools.com/howto/howto_css_loading_buttons.asp) - Button loading states
- [Supabase Blog: Postgres Roles and Privileges](https://supabase.com/blog/postgres-roles-and-privileges) - Permission management
- [Bytebase: PostgreSQL TIMESTAMPTZ](https://www.bytebase.com/reference/postgres/how-to/how-to-store-time-postgres/) - Timestamp best practices
- [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations) - Migration file structure and best practices

### Tertiary (LOW confidence)
- WebSearch results on JavaScript obfuscation - Confirmed that client-side key "security" is security theater
- Various tutorial sites for vanilla JavaScript patterns - Cross-referenced for community consensus

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Supabase documentation, well-established library
- Architecture: HIGH - Verified patterns from official docs and MDN
- Pitfalls: MEDIUM - Based on community discussions and GitHub issues, not all officially documented
- Anti-spam: MEDIUM - Honeypot is proven technique but effectiveness varies by implementation

**Research date:** 2026-02-06
**Valid until:** ~30 days (Supabase JS stable, PostgreSQL patterns timeless)

**Key decision drivers:**
- User chose Supabase over Firebase (self-hosted requirement)
- User chose to disable RLS (simplicity over defense-in-depth)
- User chose honeypot approach (UX over reCAPTCHA friction)
- Static HTML constraint (no build system, no frameworks)
- French language context (error messages, phone format)
