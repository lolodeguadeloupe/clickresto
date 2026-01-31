# Phase 1: Foundation & Lead Capture - Research

**Researched:** 2026-01-31
**Domain:** Full-stack authentication, lead management, database integration
**Confidence:** MEDIUM-HIGH

## Summary

Phase 1 establishes the technical foundation for the Clickresto platform by implementing authentication, role-based access control, lead capture forms, and CRM integration. The standard stack for this phase is **Next.js 15 (App Router) + Supabase + vanilla JavaScript** for the existing landing page.

The architecture follows a hybrid approach:
- **Landing page**: Enhance existing static HTML with Supabase JS client via CDN (no build system)
- **Back-office**: New Next.js 15 App Router application with Supabase SSR for admin/affiliate dashboards
- **Database**: Supabase PostgreSQL with Row-Level Security for multi-tenant access control
- **Auth**: Supabase Auth with email/password + magic links, JWT-based RBAC

Key insight: Supabase provides a complete backend-as-a-service eliminating the need for custom auth, API routes for CRUD operations, and database hosting. The @supabase/ssr package is critical for Next.js Server Components integration.

**Primary recommendation:** Use Supabase's official Next.js starter template and enforce RLS policies from day one to avoid security issues in production.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | 2.x (latest: 2.79+) | Supabase client library | Official client, isomorphic (works client/server), 200K+ weekly downloads |
| @supabase/ssr | latest | Server-side auth for Next.js | Official SSR package, handles cookie-based sessions, required for App Router |
| Next.js | 15.x | React framework for back-office | Project requirement, App Router is production-ready, excellent Supabase integration |
| TypeScript | 5.x | Type safety | Industry standard, Supabase provides generated types from database schema |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 3.x | Runtime validation | Form validation, API input validation before database writes |
| jwt-decode | 4.x | JWT token parsing | Reading custom claims (user roles) from Supabase auth tokens |
| @supabase/auth-ui-react | latest | Pre-built auth UI components | Optional - rapid auth UI prototyping, can be replaced with custom forms |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Supabase | Firebase | Firebase has better mobile SDKs, but Supabase offers true PostgreSQL, better pricing at scale |
| Magic links | OAuth (Google/GitHub) | OAuth is faster UX, but magic links work for any email, better for B2B |
| Next.js App Router | Pages Router | Pages Router is more mature/stable, but App Router is the future, better DX with Server Components |

**Installation:**

For Next.js back-office:
```bash
npx create-next-app -e with-supabase clickresto-backoffice
cd clickresto-backoffice
npm install zod jwt-decode
```

For landing page (static HTML):
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## Architecture Patterns

### Recommended Project Structure

**Landing page (existing index.html):**
```
/
├── index.html                # Existing landing page
├── js/
│   └── supabase-init.js     # Supabase client initialization
│   └── lead-form.js         # Form submission handler
└── .env.local               # Supabase public keys (gitignored)
```

**Next.js back-office (new):**
```
clickresto-backoffice/
├── app/
│   ├── (auth)/             # Route group for auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/        # Route group with auth layout
│   │   ├── admin/          # Admin-only pages
│   │   └── affiliate/      # Affiliate-only pages
│   ├── layout.tsx
│   └── middleware.ts       # Auth session refresh
├── lib/
│   └── supabase/
│       ├── client.ts       # Client Components client
│       ├── server.ts       # Server Components client
│       └── middleware.ts   # Middleware client
├── components/
│   ├── auth/
│   └── dashboard/
└── types/
    └── database.types.ts   # Generated from Supabase schema
```

### Pattern 1: Supabase Client Separation (Server vs Client)

**What:** Create different Supabase client instances for different Next.js rendering contexts
**When to use:** Always in Next.js App Router applications with Supabase

**Example:**

```typescript
// lib/supabase/server.ts
// For Server Components, Server Actions, Route Handlers
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component can't write cookies
            // Middleware will handle session refresh
          }
        },
      },
    }
  )
}
```

```typescript
// lib/supabase/client.ts
// For Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Source:** [Supabase Next.js App Router Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Pattern 2: Role-Based Access Control with Custom Claims

**What:** Store user roles in database, inject into JWT via Auth Hooks, enforce with RLS
**When to use:** Multi-tenant applications with different permission levels (admin/affiliate/user)

**Example:**

```sql
-- 1. Create user_roles table
create table public.user_roles (
  user_id uuid references auth.users on delete cascade,
  role text not null check (role in ('admin', 'affiliate')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id)
);

-- 2. Enable RLS
alter table public.user_roles enable row level security;

-- 3. Create RLS policy (users can only read their own role)
create policy "Users can read own role"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- 4. Create Auth Hook function to add role to JWT
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  user_role text;
begin
  -- Fetch user role
  select role into user_role
  from public.user_roles
  where user_id = (event->>'user_id')::uuid;

  -- Add role to JWT claims
  event := jsonb_set(
    event,
    '{claims, user_role}',
    to_jsonb(coalesce(user_role, 'affiliate'))
  );

  return event;
end;
$$;

-- 5. Register hook with Supabase Auth
-- (Done via Dashboard: Authentication > Hooks > Custom Access Token)
```

**Usage in application:**

```typescript
// Check role in Server Component
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  // CRITICAL: Use getUser(), not getSession() in server code
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Decode JWT to get custom claims
  const token = (await supabase.auth.getSession()).data.session?.access_token
  if (token) {
    const decoded = jwtDecode<{ user_role?: string }>(token)
    if (decoded.user_role !== 'admin') {
      redirect('/unauthorized')
    }
  }

  // Render admin dashboard
  return <AdminDashboard />
}
```

**Source:** [Supabase Custom Claims & RBAC Documentation](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

### Pattern 3: Static HTML Form to Supabase (Landing Page Integration)

**What:** Submit lead forms from vanilla HTML/JS directly to Supabase without backend API
**When to use:** Existing static landing pages that need database integration

**Example:**

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // Initialize Supabase client
  const supabase = supabase.createClient(
    'https://your-project.supabase.co',
    'your-anon-key' // Safe to expose in frontend
  )

  // Handle form submission
  document.getElementById('demo-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const lead = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      restaurant: formData.get('restaurant'),
      message: formData.get('message'),
      created_at: new Date().toISOString()
    }

    // Insert into Supabase (RLS allows public inserts)
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()

    if (error) {
      console.error('Error:', error)
      alert('Erreur lors de l\'envoi. Veuillez réessayer.')
    } else {
      // Show success message (existing pattern in index.html)
      document.getElementById('success-message').style.display = 'block'
      setTimeout(() => {
        document.getElementById('success-message').style.display = 'none'
      }, 5000)
      e.target.reset()
    }
  })
</script>
```

```sql
-- RLS policy to allow public inserts to leads table
create policy "Anyone can insert leads"
  on public.leads
  for insert
  with check (true); -- Allow all inserts

-- Only authenticated admins can select leads
create policy "Admins can read all leads"
  on public.leads
  for select
  using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );
```

**Source:** [Medium: Building Auth + To-Do Web App with Supabase (Plain HTML & CDN JavaScript)](https://medium.com/@wahengchang2023/6-steps-building-auth-to-do-web-app-with-supabase-plain-html-cdn-javascript-cdaad65348c8)

### Pattern 4: Database Webhooks for CRM Integration

**What:** Trigger external CRM API calls automatically when new leads are inserted
**When to use:** Auto-sync data to external systems (requirement CRM-02)

**Example:**

```sql
-- Option 1: Create webhook via Supabase Dashboard
-- Navigate to Database > Webhooks > Create a new webhook
-- Table: leads
-- Events: INSERT
-- Type: POST
-- HTTP Request: https://your-crm-api.com/leads
-- HTTP Headers: { "Authorization": "Bearer YOUR_CRM_TOKEN" }

-- Option 2: Create webhook via SQL
select
  net.http_post(
    url:='https://your-crm-api.com/leads',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_CRM_TOKEN"}'::jsonb,
    body:=concat('{"email": "', NEW.email, '", "name": "', NEW.name, '"}')::jsonb
  ) as request_id;
```

**Webhook payload structure (automatic):**

```json
{
  "type": "INSERT",
  "table": "leads",
  "schema": "public",
  "record": {
    "id": "uuid",
    "name": "Restaurant Name",
    "email": "owner@restaurant.com",
    "phone": "+33123456789",
    "restaurant": "Le Bistro",
    "message": "Interested in demo",
    "created_at": "2026-01-31T10:00:00Z"
  },
  "old_record": null
}
```

**Important:** Webhooks are asynchronous (use pg_net extension) and won't block database operations if the external API is slow or down.

**Source:** [Supabase Database Webhooks Documentation](https://supabase.com/docs/guides/database/webhooks)

### Pattern 5: Magic Link Authentication

**What:** Passwordless email login - user clicks link in email to authenticate
**When to use:** Reduce friction for affiliate users, better UX than password management

**Example:**

```typescript
// Send magic link
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'affiliate@example.com',
  options: {
    emailRedirectTo: 'https://clickresto.com/auth/callback',
    shouldCreateUser: false // Don't auto-create accounts
  }
})

// Handle callback in /auth/callback route
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.redirect(new URL('/login?error=invalid_link', request.url))
}
```

**Configuration required:**
- Set Site URL in Supabase Dashboard: Authentication > URL Configuration
- Add redirect URLs (e.g., `https://clickresto.com/auth/callback`)
- Rate limit: 1 request per 60 seconds per email (default)
- Link expiry: 1 hour (default)

**Source:** [Supabase Passwordless Email Login Documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless)

### Anti-Patterns to Avoid

- **Using `auth.getSession()` in Server Components:** This doesn't validate the JWT. Always use `auth.getUser()` for protected server-side operations.
- **Exposing service_role key in frontend:** Service role keys bypass RLS. Only use them in secure server-side contexts (API routes, server actions).
- **Skipping RLS during development:** Enable RLS from day one. Adding it later is error-prone and risks data leaks.
- **Not using middleware for session refresh:** Server Components can't write cookies. Without middleware, user sessions will expire unexpectedly.
- **Dumping everything in page.tsx:** Separate concerns - create client/server utility files as shown in the patterns above.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| User authentication | Custom JWT system, password hashing | Supabase Auth | Handles password reset, email verification, rate limiting, security tokens, session management. Hand-rolling this means reimplementing 50+ edge cases. |
| Role-based permissions | Custom middleware checks | Supabase RLS + Auth Hooks | RLS enforces permissions at database level (defense in depth). Custom middleware can be bypassed if you accidentally expose a direct database endpoint. |
| Form validation | Manual regex/length checks | Zod schemas | Zod provides runtime + TypeScript types from single source of truth. Prevents type/validation drift. |
| Database migrations | Manual SQL file tracking | Supabase CLI migrations | Automatic version tracking, rollback support, applied migrations tracking. |
| Email sending for auth | Custom SMTP setup | Supabase built-in email | Handles templates, rate limiting, deliverability, bounce handling. SMTP is complex and error-prone. |
| Async webhook calls | Synchronous HTTP in triggers | Supabase Webhooks (pg_net) | pg_net is async - won't block database operations if external API is slow/down. Sync calls can cause cascade failures. |
| Calendar booking UI | Custom date/time picker + availability logic | Cal.com or Calendly embed | Handles timezones, conflicts, reminders, cancellations, rescheduling, email invites. Building this well takes months. |

**Key insight:** Supabase provides backend-as-a-service. The value is in integration and business logic, not reinventing infrastructure.

## Common Pitfalls

### Pitfall 1: Row-Level Security Performance Issues

**What goes wrong:** RLS policies with complex joins or subqueries cause massive performance degradation, especially on tables with thousands of rows. Queries that should take 10ms take 10+ seconds.

**Why it happens:** Each RLS policy runs for every row returned. A policy like `exists (select 1 from user_roles where user_id = auth.uid())` executes a subquery per row, causing N+1 query problems.

**How to avoid:**
1. **Add indexes** on all columns used in RLS policies (especially foreign keys):
   ```sql
   create index user_roles_user_id_idx on public.user_roles(user_id);
   ```

2. **Wrap auth functions** to cache results within a query:
   ```sql
   -- Bad: Calls auth.uid() for every row
   create policy "bad" on leads for select using (user_id = auth.uid());

   -- Good: Wraps in function so optimizer can cache
   create policy "good" on leads for select using (user_id = (select auth.uid()));
   ```

3. **Separate read and write operations:** Use RLS for reads (SELECT), route writes through Server Actions with service_role client where you can validate in application code.

**Warning signs:** Query times spike after enabling RLS, database CPU usage increases significantly, N+1 query patterns in logs.

**Source:** [Supabase RLS Performance Best Practices](https://www.leanware.co/insights/supabase-best-practices)

### Pitfall 2: Service Role Key Exposure

**What goes wrong:** Accidentally committing `SUPABASE_SERVICE_ROLE_KEY` to version control or using it in frontend code. This key bypasses ALL RLS policies and grants full database access.

**Why it happens:** Developers use service_role for quick testing and forget to switch back to anon key. Or they add it to `.env.local` which gets committed.

**How to avoid:**
1. **Never use service_role in client code** - only in Server Actions, API Routes, or backend services
2. **Add .env.local to .gitignore** - verify it's ignored before first commit
3. **Use environment variable validation:**
   ```typescript
   // lib/env.ts
   import { z } from 'zod'

   const envSchema = z.object({
     NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
     NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().startsWith('eyJ'), // JWT format
     SUPABASE_SERVICE_ROLE_KEY: z.string().startsWith('eyJ').optional()
   })

   export const env = envSchema.parse(process.env)
   ```

4. **Rotate keys immediately if exposed** - Supabase Dashboard > Settings > API > Generate new key

**Warning signs:** Service role key in client bundle, `.env.local` in git history, anon key not working (forgot to switch back).

**Source:** [Securing Next.js API Calls with Supabase Service Keys](https://medium.com/@zgza778/securing-your-next-js-api-calls-with-supabase-service-keys-1d6f024b3cd2)

### Pitfall 3: Forgotten Middleware Session Refresh

**What goes wrong:** Users get logged out unexpectedly after 1 hour even though they're actively using the app. Server Components throw auth errors.

**Why it happens:** Supabase auth tokens expire after 1 hour. Server Components can't write cookies to refresh the session. Without middleware, expired tokens aren't refreshed.

**How to avoid:**

Create middleware.ts at project root:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRITICAL: This refreshes expired tokens
  const { data: { user } } = await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Warning signs:** Auth errors after ~1 hour of usage, users complaining about frequent logouts, Server Components getting null user when they should be authenticated.

**Source:** [Supabase Next.js App Router Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Pitfall 4: Magic Link Configuration Issues

**What goes wrong:** Magic link emails don't send, or links redirect to wrong URL (localhost in production, production URL in development).

**Why it happens:** Site URL and Redirect URLs not properly configured in Supabase Dashboard.

**How to avoid:**
1. **Set Site URL** in Supabase Dashboard > Authentication > URL Configuration:
   - Production: `https://clickresto.com`
   - Development: `http://localhost:3000`

2. **Add Redirect URLs** (comma-separated list):
   ```
   http://localhost:3000/auth/callback,
   https://clickresto.com/auth/callback
   ```

3. **Use environment-aware redirects:**
   ```typescript
   const redirectTo = process.env.NODE_ENV === 'production'
     ? 'https://clickresto.com/auth/callback'
     : 'http://localhost:3000/auth/callback'

   await supabase.auth.signInWithOtp({
     email,
     options: { emailRedirectTo: redirectTo }
   })
   ```

4. **Check email template variables** - Ensure `{{ .ConfirmationURL }}` is in the Magic Link email template

**Warning signs:** Emails not arriving (check spam), "Invalid redirect URL" errors, production magic links redirecting to localhost.

**Source:** [Supabase Magic Link Documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless)

### Pitfall 5: Not Validating Input Before Database Inserts

**What goes wrong:** Invalid data gets inserted into database (wrong email format, missing required fields, XSS payloads). Later queries fail or security issues emerge.

**Why it happens:** Trusting client-side validation, not validating in Server Actions or API routes.

**How to avoid:**

Use Zod schemas for all user input:

```typescript
// lib/schemas.ts
import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, 'Invalid phone number'),
  restaurant: z.string().min(2).max(200),
  message: z.string().max(1000).optional()
})

export type Lead = z.infer<typeof leadSchema>
```

```typescript
// Server Action
'use server'

import { createClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/schemas'

export async function submitLead(formData: FormData) {
  // Parse and validate
  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    restaurant: formData.get('restaurant'),
    message: formData.get('message')
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Insert validated data
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .insert([parsed.data])

  if (error) {
    return { error: 'Database error' }
  }

  return { success: true }
}
```

**Warning signs:** Database constraint violations, invalid data in production, SQL injection attempts in logs.

**Source:** [Supabase Best Practices](https://www.leanware.co/insights/supabase-best-practices)

## Code Examples

Verified patterns from official sources:

### Example 1: Next.js Server Component Fetching Leads

```typescript
// app/(dashboard)/admin/leads/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LeadsPage() {
  const supabase = await createClient()

  // Verify user is authenticated admin
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch leads (RLS enforces admin-only access)
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (leadsError) {
    console.error('Error fetching leads:', leadsError)
    return <div>Error loading leads</div>
  }

  return (
    <div>
      <h1>Leads Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Restaurant</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leads?.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.restaurant}</td>
              <td>{new Date(lead.created_at).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Source:** [Supabase Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

### Example 2: Email/Password Signup with Role Assignment

```typescript
// app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'affiliate'])
})

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role')
  })

  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const supabase = await createClient()

  // Create user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password
  })

  if (authError) {
    return { error: authError.message }
  }

  // Assign role (this requires service_role key or database trigger)
  // Option 1: Use database trigger (recommended)
  // Option 2: Call with service_role client in API route

  redirect('/dashboard')
}
```

**Database trigger for auto-role assignment:**

```sql
-- Trigger to automatically assign 'affiliate' role to new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'affiliate'); -- Default role
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Source:** [Supabase Next.js Guide](https://medium.com/@iamqitmeeer/supabase-next-js-guide-the-real-way-01a7f2bd140c)

### Example 3: Responsive Mobile-First Form (Landing Page)

```html
<!-- index.html - Enhanced demo request form -->
<section class="contact" id="contact">
  <div class="container">
    <h2>Demandez une démo</h2>
    <form id="demo-form" class="demo-form">
      <div class="form-group">
        <label for="name">Nom complet</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minlength="2"
          autocomplete="name"
          placeholder="Jean Dupont"
        >
      </div>

      <div class="form-group">
        <label for="email">Email professionnel</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="email"
          placeholder="jean@restaurant.fr"
        >
      </div>

      <div class="form-group">
        <label for="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          autocomplete="tel"
          pattern="[0-9+\s\-\(\)]+"
          placeholder="+33 1 23 45 67 89"
        >
      </div>

      <div class="form-group">
        <label for="restaurant">Nom du restaurant</label>
        <input
          type="text"
          id="restaurant"
          name="restaurant"
          required
          placeholder="Le Bistro Parisien"
        >
      </div>

      <div class="form-group">
        <label for="message">Message (optionnel)</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          maxlength="1000"
          placeholder="Parlez-nous de vos besoins..."
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Envoyer la demande
      </button>
    </form>

    <div id="success-message" class="success-message" style="display: none;">
      <p>Merci ! Nous vous contacterons sous 24h.</p>
    </div>
  </div>
</section>

<style>
  /* Mobile-first responsive form design */
  .demo-form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--secondary);
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.875rem; /* 14px - touch-friendly */
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.2s;
    /* Minimum touch target: 44x44px */
    min-height: 44px;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
  }

  .form-group input:invalid:not(:placeholder-shown) {
    border-color: #E63946;
  }

  .btn-primary {
    width: 100%;
    padding: 1rem;
    font-size: 1.125rem;
    min-height: 48px; /* Touch-friendly */
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: #d32f3f;
  }

  .success-message {
    margin-top: 1rem;
    padding: 1rem;
    background: #e8f5e9;
    border-left: 4px solid #4caf50;
    border-radius: 4px;
  }

  /* Tablet breakpoint */
  @media (min-width: 768px) {
    .form-group input,
    .form-group textarea {
      padding: 1rem;
    }

    .btn-primary {
      width: auto;
      padding: 1rem 2rem;
    }
  }
</style>
```

**Best practices applied:**
- Single-column layout (mobile-first)
- Touch-friendly inputs (min 44px height)
- HTML5 input types (`email`, `tel`) trigger appropriate mobile keyboards
- Autocomplete attributes for faster form filling
- Visual feedback (focus states, invalid states)
- Clear labels and placeholder examples
- Max-width container prevents line-length issues on desktop

**Sources:**
- [Mobile Form Design Best Practices](https://www.typeform.com/blog/mobile-form-design-best-practices)
- [Responsive Design Best Practices 2026](https://pxlpeak.com/blog/web-design/responsive-design-best-practices)

### Example 4: Calendar Integration (Cal.com Embed)

```html
<!-- index.html - Add Cal.com scheduling to landing page -->
<section class="schedule-demo">
  <div class="container">
    <h2>Réservez votre démo en ligne</h2>
    <p>Choisissez un créneau qui vous convient</p>

    <!-- Cal.com embed -->
    <div
      data-cal-link="clickresto/demo"
      data-cal-config='{"layout":"month_view", "theme":"light"}'
    ></div>
  </div>
</section>

<script type="text/javascript">
  (function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () {
          p(api, arguments);
        };
        const namespace = ar[1];
        api.q = api.q || [];
        typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", { origin: "https://cal.com" });

  // Optional: Listen to booking events
  Cal("on", {
    action: "bookingSuccessful",
    callback: (e) => {
      console.log("Booking successful:", e.detail);
      // Send booking info to Supabase
      // supabase.from('demo_bookings').insert([{ ... }])
    }
  });
</script>
```

**Alternative: Calendly embed (simpler, no self-hosting needed):**

```html
<!-- Calendly inline widget -->
<div
  class="calendly-inline-widget"
  data-url="https://calendly.com/clickresto/demo?hide_gdpr_banner=1&primary_color=e63946"
  style="min-width:320px;height:700px;"
></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

**Comparison:**
- **Cal.com:** Open-source, self-hostable, free tier available, full API access, more customization
- **Calendly:** Easier setup, better UX out-of-box, paid plans required for API access

**Recommendation:** Start with Calendly for faster launch, migrate to Cal.com if customization needs increase or costs justify self-hosting.

**Sources:**
- [Cal.com GitHub](https://github.com/calcom/cal.com)
- [Calendly Developer API](https://developer.calendly.com/getting-started)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js Pages Router + getServerSideProps | Next.js App Router + Server Components | Next.js 13 (stable in 14-15, 2024-2025) | Simpler data fetching, better performance, streaming SSR |
| @supabase/auth-helpers-nextjs | @supabase/ssr | January 2024 | Unified SSR package, better cookie handling, supports App Router natively |
| Supabase legacy anon keys | Publishable keys (sb_publishable_xxx) | Late 2025 | Improved security, easier key rotation, better DX |
| Manual JWT claims handling | Auth Hooks (Custom Access Token) | Supabase update Q3 2025 | Official way to inject custom claims, no need for custom functions |
| Realtime v1 | Realtime v2 | Supabase Realtime v2 release 2024 | Better performance, lower latency, broadcast + presence channels |

**Deprecated/outdated:**
- **@supabase/auth-helpers-nextjs**: Replaced by @supabase/ssr. Don't use in new projects (as of January 2024).
- **supabase.auth.api.*** methods: Deprecated. Use supabase.auth.*** directly.
- **Row-level security bypassing in Server Components**: Previously recommended for performance. Now considered anti-pattern - use optimized RLS instead.
- **Next.js 12 API Routes for all auth**: App Router Server Actions are now preferred for mutations.

**Current state (2026):**
- Next.js 15 with App Router is production-stable
- Supabase JS client v2.79+ (Node 18 support dropped, Node 20+ required)
- @supabase/ssr is the official package for Next.js SSR
- Auth Hooks are the official way to implement RBAC with custom claims

## Open Questions

Things that couldn't be fully resolved:

1. **CRM Integration Specifics**
   - What we know: Supabase webhooks can POST to external APIs when leads are inserted
   - What's unclear: Which specific CRM will be used? (HubSpot, Salesforce, custom?)
   - Recommendation: Start with generic webhook setup. Document CRM API endpoint requirements (authentication, payload format). Can be configured later without code changes.

2. **Admin User Creation Process**
   - What we know: User roles stored in database, assigned via trigger or manual insert
   - What's unclear: How is the first admin created? Manual database insert? Seed script?
   - Recommendation: Create SQL seed script with first admin user + document process for adding additional admins. Could build admin-only "Invite Admin" UI in Phase 2.

3. **Magic Link vs Email/Password Priority**
   - What we know: Requirements specify both AUTH-01 (email/password) and AUTH-02 (magic link)
   - What's unclear: Should UI prioritize one over the other? Different UX for admin vs affiliate?
   - Recommendation: Admin users: email/password (more familiar, perceived as more secure). Affiliate users: magic link primary with password as option (better UX, less friction).

4. **Email Template Customization**
   - What we know: Supabase provides default email templates for magic links, password reset
   - What's unclear: Should templates be customized with Clickresto branding immediately or use defaults?
   - Recommendation: Use defaults for v1 (faster launch), customize in Phase 2 with brand colors, logo, French copy.

5. **Landing Page Build Process**
   - What we know: Current landing is static HTML, we're adding Supabase JS client via CDN
   - What's unclear: Should environment variables for Supabase keys be injected via build script or hardcoded?
   - Recommendation: For static HTML, hardcoded anon key is safe (it's designed to be public). For production, consider simple env var replacement in CI/CD or move landing to Next.js for consistency.

## Sources

### Primary (HIGH confidence)

Official Supabase Documentation:
- [Use Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Passwordless Email Logins (Magic Links)](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Custom Claims & RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)

### Secondary (MEDIUM confidence)

Verified technical guides:
- [Supabase + Next.js Guide (Medium, Dec 2025)](https://medium.com/@iamqitmeeer/supabase-next-js-guide-the-real-way-01a7f2bd140c)
- [Building Auth + To-Do with Plain HTML & CDN JavaScript (Medium)](https://medium.com/@wahengchang2023/6-steps-building-auth-to-do-web-app-with-supabase-plain-html-cdn-javascript-cdaad65348c8)
- [Best Practices for Supabase - Leanware](https://www.leanware.co/insights/supabase-best-practices)
- [Next.js + Supabase: What I'd Do Differently](https://catjam.fi/articles/next-supabase-what-do-differently)
- [Securing Next.js API Calls with Supabase Service Keys (Medium)](https://medium.com/@zgza778/securing-your-next-js-api-calls-with-supabase-service-keys-1d6f024b3cd2)

Community resources:
- [Cal.com vs Calendly Comparison 2026](https://fluentbooking.com/articles/cal-com-vs-calendly/)
- [Mobile Form Design Best Practices - Typeform](https://www.typeform.com/blog/mobile-form-design-best-practices)
- [Responsive Design Best Practices 2026 - PxlPeak](https://pxlpeak.com/blog/web-design/responsive-design-best-practices)
- [Landing Page Social Proof Best Practices - Nudgify](https://www.nudgify.com/social-proof-landing-pages/)

Developer forums (for pitfalls):
- [GitHub: Supabase Discussions - RBAC Implementation](https://github.com/orgs/supabase/discussions/346)
- [GitHub: Next.js 13 Magic Link Issue](https://github.com/orgs/supabase/discussions/15526)

### Tertiary (LOW confidence - requires validation)

WebSearch findings not yet verified with official sources:
- Specific RLS performance optimization claims (wrapping functions) - source: blog posts
- Service_role key rotation process - not detailed in official docs
- Cal.com API integration specifics for booking webhooks - needs official API docs verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs, npm downloads, established patterns
- Architecture patterns: HIGH - Verified from official Supabase docs and Next.js documentation
- Pitfalls: MEDIUM-HIGH - Combination of official troubleshooting docs + community experiences
- Landing page integration: MEDIUM - CDN approach verified, but static HTML + Supabase has less documentation than Next.js approach
- CRM integration: MEDIUM - Webhook mechanism verified (official docs), but specific CRM endpoints unknown
- Calendar integration: MEDIUM - Both Cal.com and Calendly are established, but integration details based on general docs not Clickresto-specific

**Research date:** 2026-01-31
**Valid until:** ~30 days (Supabase/Next.js are stable, but fast-moving ecosystems)

**Assumptions made:**
- French language requirement for all user-facing text (based on landing page being French)
- Europe/France hosting region for Supabase (GDPR compliance, latency)
- Existing landing page CSS variables will be reused in Next.js back-office for brand consistency
- PostgreSQL version 15+ (Supabase default as of 2026)

**Verification needed before implementation:**
1. Confirm specific CRM system and API endpoint format
2. Verify admin user creation process with stakeholder
3. Test magic link email deliverability in French locale
4. Confirm calendar booking tool choice (Cal.com vs Calendly)
5. Verify Supabase project region (should be EU for French users)
