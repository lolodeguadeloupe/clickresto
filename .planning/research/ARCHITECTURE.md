# Architecture Patterns

**Domain:** SaaS Platform with Affiliate Program
**Researched:** 2026-01-31
**Confidence:** MEDIUM (verified with official Supabase and Next.js documentation, supplemented with community patterns)

## Recommended Architecture

### High-Level System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Landing Page (Static HTML)  →  Form Submission             │
│         ↓                              ↓                     │
│  Supabase Client API          Next.js Back-office           │
│                                                              │
│                   ┌──────────────────┐                      │
│                   │   Route Groups   │                      │
│                   ├──────────────────┤                      │
│                   │  (admin)/        │  Admin Dashboard     │
│                   │  (affiliate)/    │  Affiliate Portal    │
│                   └──────────────────┘                      │
│                          ↓                                   │
└──────────────────────────┼──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         Next.js API Routes (app/api/)                       │
│              ↓              ↓              ↓                │
│         Middleware      Auth Check     Business Logic       │
│                                                              │
└──────────────────────────┼──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│            Supabase PostgreSQL + RLS                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Leads   │  │Affiliates│  │Referrals │  │Payments  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│            Database Triggers + Edge Functions               │
│                   ↓                                          │
│            Email Notifications (SMTP/SendGrid)              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Style:** Monolithic Next.js application with role-based route groups, backed by Supabase PostgreSQL with Row-Level Security (RLS) for data access control.

## Component Boundaries

### 1. Landing Page (Static HTML with Supabase Client)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `index.html` | Lead capture form, marketing content | Supabase Client API |
| Form Handler (JS) | Validate input, submit to Supabase | `leads` table via Supabase client |
| Supabase Client SDK | Direct database inserts (public access) | Supabase REST API |

**Key Pattern:** Landing page uses Supabase's client library for direct database access to the `leads` table. This table has RLS policies allowing public INSERT but restricting SELECT to authenticated admin users only.

**Benefits:**
- No backend API needed for lead capture
- Instant write to database
- Database trigger handles email notifications automatically

### 2. Next.js Back-office Application

#### Recommended Folder Structure

```
app/
├── (auth)/                    # Route group for auth pages
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── layout.tsx            # Auth layout (centered, no nav)
│
├── (admin)/                   # Route group for admin area
│   ├── dashboard/
│   │   └── page.tsx          # Admin dashboard
│   ├── leads/
│   │   ├── page.tsx          # Leads list
│   │   └── [id]/
│   │       └── page.tsx      # Lead detail
│   ├── affiliates/
│   │   ├── page.tsx          # Affiliate management
│   │   └── [id]/
│   │       └── page.tsx      # Affiliate detail
│   ├── payments/
│   │   └── page.tsx          # Payment requests review
│   ├── settings/
│   │   └── page.tsx          # System settings
│   └── layout.tsx            # Admin layout (full nav, header)
│
├── (affiliate)/               # Route group for affiliate area
│   ├── portal/
│   │   └── page.tsx          # Affiliate dashboard
│   ├── referrals/
│   │   └── page.tsx          # Referral tracking
│   ├── commissions/
│   │   └── page.tsx          # Commission history
│   ├── payouts/
│   │   └── page.tsx          # Payment requests
│   └── layout.tsx            # Affiliate layout (simplified nav)
│
├── api/                       # API routes
│   ├── leads/
│   │   └── route.ts          # GET /api/leads (admin only)
│   ├── affiliates/
│   │   └── route.ts          # GET /api/affiliates (admin)
│   ├── referrals/
│   │   └── route.ts          # GET /api/referrals (filtered by role)
│   ├── payments/
│   │   ├── route.ts          # GET /api/payments
│   │   └── [id]/
│   │       └── route.ts      # PATCH /api/payments/[id] (approve)
│   └── middleware.ts         # Auth + role checking
│
├── _components/               # Shared components (private folder)
│   ├── ui/                   # shadcn/ui components
│   ├── charts/               # Chart components
│   ├── tables/               # Data table components
│   └── forms/                # Form components
│
├── _lib/                      # Utility functions (private folder)
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Supabase client
│   │   └── middleware.ts     # Middleware Supabase client
│   ├── auth.ts               # Auth helpers
│   ├── utils.ts              # General utilities
│   └── constants.ts          # App constants
│
├── _hooks/                    # Custom React hooks (private folder)
│   ├── use-auth.ts
│   ├── use-role.ts
│   └── use-commission.ts
│
└── layout.tsx                 # Root layout (global styles)
```

**Why Route Groups?** Route groups `(folderName)` organize code without affecting URLs. Both admin and affiliate areas can have `/dashboard` routes that render different content based on the route group, with separate layouts for each role.

**Source:** [Next.js Route Groups documentation](https://medium.com/@shrutishende11/next-js-route-groups-organizing-your-app-router-like-a-pro-aa58ca11f963), [Next.js App Router folder structure best practices 2026](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580)

#### Component Organization Strategy

| Component Type | Location | Sharing Strategy |
|---------------|----------|------------------|
| Role-specific pages | Inside route groups | No sharing |
| Role-specific layouts | `layout.tsx` in each route group | No sharing |
| Shared UI components | `_components/ui/` | Imported by both roles |
| Data tables | `_components/tables/` | Configured per role (different columns) |
| Business logic | `_lib/` | Shared utilities, role-checked in API |
| Hooks | `_hooks/` | Shared hooks (role filtering in hook) |

**Pattern:** Build reusable components in `_components/`, but configure them differently for admin vs affiliate. Example: Same `DataTable` component, but admin sees all referrals, affiliate sees only their referrals.

### 3. API Routes Structure

#### Recommended Pattern: Feature-based Organization

```
app/api/
├── leads/
│   ├── route.ts              # GET (admin), POST (public from landing)
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE (admin only)
│
├── affiliates/
│   ├── route.ts              # GET (admin), POST (admin creates)
│   └── [id]/
│       ├── route.ts          # GET, PATCH (admin or self)
│       └── stats/
│           └── route.ts      # GET affiliate stats (self only)
│
├── referrals/
│   ├── route.ts              # GET (filtered by role)
│   └── [id]/
│       └── route.ts          # GET referral detail
│
├── commissions/
│   ├── route.ts              # GET commissions (filtered by role)
│   └── calculate/
│       └── route.ts          # POST recalculate (admin only)
│
├── payments/
│   ├── route.ts              # GET payment requests, POST new request
│   ├── [id]/
│   │   └── route.ts          # PATCH approve/reject (admin)
│   └── request/
│       └── route.ts          # POST payment request (affiliate)
│
└── auth/
    ├── callback/
    │   └── route.ts          # OAuth callback handler
    └── signout/
        └── route.ts          # Sign out handler
```

**API Route Responsibilities:**

1. **Authentication Check** - Verify Supabase session exists
2. **Authorization Check** - Decode JWT, verify role claim
3. **Role-based Filtering** - Apply data filters based on user role
4. **Business Logic** - Commission calculations, status updates
5. **Database Operations** - Call Supabase with RLS enabled

**Example API Route with Role Checking:**

```typescript
// app/api/referrals/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Authentication check
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get role from JWT
  const userRole = session.user.user_metadata?.role || 'affiliate';

  // 3. Role-based query
  let query = supabase.from('referrals').select('*');

  if (userRole === 'affiliate') {
    // Affiliates only see their own referrals
    query = query.eq('affiliate_id', session.user.id);
  }
  // Admins see all referrals (no filter)

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

**Source:** [Next.js API Routes best practices 2026](https://medium.com/@turingvang/best-practices-for-api-routes-for-dynamic-data-fetching-in-next-js-0874c6329070), [Supabase Auth with Next.js](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

### 4. Authentication & Authorization Layer

#### Supabase Auth Setup

**Authentication Methods:**
- Email/Password (primary)
- Magic Link (passwordless, optional)

**User Metadata Schema:**

```typescript
{
  user_id: string,              // Supabase auth.users id
  email: string,
  user_metadata: {
    role: 'admin' | 'affiliate',
    full_name: string
  },
  app_metadata: {
    provider: string,
    providers: string[]
  }
}
```

#### Role-Based Access Control (RBAC) Implementation

**Approach:** Custom JWT Claims via Auth Hooks

Supabase Auth Hooks inject custom claims into the JWT before token issuance, allowing RLS policies to enforce role-based access at the database level.

**Implementation Steps:**

1. **Create User Roles Table:**

```sql
-- Enum for roles
CREATE TYPE app_role AS ENUM ('admin', 'affiliate');

-- User roles table
CREATE TABLE user_roles (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Index for fast lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

2. **Create Auth Hook Function:**

```sql
-- Hook function to inject role into JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims JSONB;
  user_role app_role;
BEGIN
  -- Get user's role
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::UUID;

  -- Inject role into JWT claims
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

-- Grant permission to Supabase Auth
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
GRANT SELECT ON public.user_roles TO supabase_auth_admin;
```

3. **Configure Hook in Supabase Dashboard:**

Navigate to **Authentication → Hooks (Beta)** and enable the "Custom Access Token" hook pointing to `public.custom_access_token_hook`.

4. **Access Role in Client:**

```typescript
import { jwtDecode } from 'jwt-decode';

const { data: { session } } = await supabase.auth.getSession();
if (session) {
  const jwt = jwtDecode(session.access_token);
  const userRole = jwt.user_role; // 'admin' or 'affiliate'
}
```

**Source:** [Supabase Custom Claims & RBAC official documentation](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

## Data Flow

### Flow 1: Lead Submission (Landing → Database → Admin Dashboard)

```
┌─────────────┐
│ Landing Page│
│ (index.html)│
└──────┬──────┘
       │ 1. User fills form
       │ 2. Submit button click
       ↓
┌────────────────────┐
│ JavaScript Handler │
│ - Validate input   │
│ - Create Supabase  │
│   client           │
└─────────┬──────────┘
          │ 3. supabase.from('leads').insert()
          ↓
┌────────────────────────┐
│   Supabase Database    │
│   ┌──────────────┐     │
│   │ leads table  │     │ 4. INSERT allowed (public RLS)
│   └──────┬───────┘     │
│          │             │
│   ┌──────▼───────────┐ │ 5. AFTER INSERT trigger
│   │ Database Trigger │ │
│   │ on_lead_created  │ │
│   └──────┬───────────┘ │
└──────────┼─────────────┘
           │ 6. Invoke Edge Function
           ↓
┌─────────────────────┐
│  Edge Function      │
│  - Get lead data    │ 7. Send email notification
│  - Call SendGrid    │    to admin
└─────────────────────┘
           ↓
┌─────────────────────┐
│   Admin Dashboard   │
│   (admin)/leads     │ 8. Admin views new lead
│   - Real-time sub   │    (via Supabase realtime)
│   - Shows new lead  │
└─────────────────────┘
```

**Implementation Details:**

**Landing Page JavaScript:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY' // Public key, safe to expose
);

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = {
    restaurant_name: event.target.restaurant_name.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
    message: event.target.message.value,
    source: 'landing_page'
  };

  const { data, error } = await supabase
    .from('leads')
    .insert([formData]);

  if (error) {
    console.error('Error:', error);
    alert('Error submitting form');
  } else {
    alert('Thank you! We will contact you soon.');
    event.target.reset();
  }
}
```

**Database Trigger:**
```sql
-- Edge Function trigger
CREATE OR REPLACE FUNCTION trigger_lead_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'lead_created',
    json_build_object(
      'lead_id', NEW.id,
      'restaurant_name', NEW.restaurant_name,
      'email', NEW.email
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_lead_notification();
```

**Source:** [How to trigger email notifications with Supabase](https://medium.com/@DeolaJ/how-to-trigger-email-notifications-on-a-contact-form-with-supabase-210cf245e57e), [Supabase Edge Functions for email](https://bejamas.com/hub/guides/send-emails-supabase-edge-functions-database-triggers)

### Flow 2: Affiliate Signup

```
┌─────────────┐
│Admin creates│
│new affiliate│
└──────┬──────┘
       │ 1. Fill signup form in (admin)/affiliates
       ↓
┌────────────────────┐
│ POST /api/affiliates│
│ - Check admin role │ 2. Verify admin permission
│ - Validate data    │
└─────────┬──────────┘
          │ 3. Create auth user + affiliate record
          ↓
┌────────────────────────────────┐
│   Supabase Auth + Database     │
│                                │
│ 1. supabase.auth.admin         │
│    .createUser({...})          │ 4. Create auth.users entry
│                                │
│ 2. INSERT INTO user_roles      │ 5. Assign 'affiliate' role
│    (user_id, role)             │
│                                │
│ 3. INSERT INTO affiliates      │ 6. Create affiliate profile
│    (user_id, referral_code...) │
└────────────┬───────────────────┘
             │ 7. Generate unique referral code
             ↓
┌────────────────────┐
│ Send welcome email │ 8. Magic link for first login
│ with magic link    │
└────────────────────┘
             ↓
┌────────────────────┐
│ Affiliate receives │
│ email, clicks link │ 9. First login via magic link
│ Sets password      │
└────────────────────┘
```

**Referral Code Generation Strategy:**
```typescript
// _lib/referral-code.ts
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

export function generateReferralCode(affiliateName: string): string {
  const prefix = affiliateName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  const uniqueId = nanoid();

  return `${prefix}-${uniqueId}`;
  // Example: JOH-X7K9M2P4
}
```

**Source:** [Referral code generation architecture](https://medium.com/@siddhusingh/referral-code-generation-architecture-contention-free-scalable-approach-68ea44ee5fb0)

### Flow 3: Commission Tracking

```
┌─────────────────┐
│ Customer signs  │
│ up via referral │ 1. Uses referral link/code
│ link            │
└────────┬────────┘
         │ 2. Redirect to signup with ?ref=CODE
         ↓
┌────────────────────┐
│ Signup page        │
│ - Extract ref code │ 3. Store in session/cookie
│ - Complete signup  │
└────────┬───────────┘
         │ 4. POST /api/signup
         ↓
┌─────────────────────────────┐
│  Backend Processing         │
│                             │
│ 1. Create customer account  │ 5. Insert into customers table
│                             │
│ 2. Look up affiliate        │ 6. SELECT from affiliates WHERE code
│                             │
│ 3. Create referral record   │ 7. INSERT INTO referrals
│    - affiliate_id           │    (affiliate_id, customer_id,
│    - customer_id            │     status: 'pending')
│    - status: 'pending'      │
│                             │
│ 4. Trigger commission calc  │ 8. AFTER INSERT trigger
└─────────────┬───────────────┘
              │
              ↓
┌─────────────────────────────┐
│  Commission Calculation     │
│  (Database Function)        │
│                             │
│ 1. Get affiliate settings   │ 9. SELECT commission_rate
│                             │    FROM affiliate_settings
│ 2. Calculate amount         │
│    - Fixed: €50 per signup  │ 10. INSERT INTO commissions
│    - Status: 'pending'      │     (referral_id, amount,
│                             │      status: 'pending')
│ 3. Update referral status   │
│    → 'converted'            │ 11. Status tracking
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  Admin Validation           │
│  (Manual Payment Approval)  │
│                             │
│ Admin reviews commission    │ 12. Admin sees pending commissions
│ in (admin)/payments         │
│                             │
│ Clicks "Approve Payment"    │ 13. PATCH /api/payments/:id
│                             │     { status: 'approved' }
│                             │
│ Commission status:          │ 14. UPDATE commissions
│ pending → approved → paid   │     SET status = 'approved'
└─────────────────────────────┘
```

**Commission Calculation Function:**
```sql
-- Automatic commission calculation
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  affiliate_rate NUMERIC;
  commission_amount NUMERIC;
BEGIN
  -- Get fixed commission rate (€50 per signup)
  SELECT fixed_commission INTO commission_amount
  FROM settings
  WHERE key = 'commission_per_signup';

  -- Create commission record
  INSERT INTO commissions (
    referral_id,
    affiliate_id,
    amount,
    status,
    created_at
  ) VALUES (
    NEW.id,
    NEW.affiliate_id,
    commission_amount,
    'pending',
    NOW()
  );

  -- Update referral status
  UPDATE referrals
  SET status = 'converted'
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_referral_conversion
  AFTER INSERT ON referrals
  FOR EACH ROW
  WHEN (NEW.status = 'converted')
  EXECUTE FUNCTION calculate_commission();
```

### Flow 4: Payment Request

```
┌─────────────────┐
│ Affiliate views │
│ earned          │ 1. Navigate to (affiliate)/payouts
│ commissions     │
└────────┬────────┘
         │ 2. Click "Request Payment"
         ↓
┌────────────────────┐
│ Payment Request    │
│ Form               │ 3. Enter payment details
│ - Amount to claim  │    (bank info, amount)
│ - Payment method   │
└────────┬───────────┘
         │ 4. POST /api/payments/request
         ↓
┌─────────────────────────────┐
│  Backend Validation         │
│                             │
│ 1. Verify affiliate owns    │ 5. Check user_id matches
│    these commissions        │    commission.affiliate_id
│                             │
│ 2. Check commissions are    │ 6. WHERE status = 'approved'
│    approved                 │    AND NOT already_paid
│                             │
│ 3. Calculate total          │ 7. SUM(amount)
│                             │
│ 4. Create payment request   │ 8. INSERT INTO payment_requests
│    - affiliate_id           │    (affiliate_id, amount,
│    - amount                 │     payment_method, status)
│    - status: 'pending'      │
└─────────────┬───────────────┘
              │
              ↓
┌─────────────────────────────┐
│  Admin Review               │
│  (admin)/payments           │
│                             │
│ Admin sees payment request  │ 9. List all pending requests
│                             │
│ Reviews details             │ 10. Check affiliate history
│                             │
│ Approves and processes      │ 11. Manual bank transfer
│ bank transfer               │
│                             │
│ Marks as paid               │ 12. PATCH /api/payments/:id
│                             │     { status: 'paid' }
│                             │
│ Updates commission records  │ 13. UPDATE commissions
│                             │     SET status = 'paid'
└─────────────────────────────┘
```

**Payment Request Validation:**
```typescript
// app/api/payments/request/route.ts
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const session = await supabase.auth.getSession();

  // 1. Check affiliate role
  if (session.user.user_metadata.role !== 'affiliate') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { commission_ids, payment_method, payment_details } = await request.json();

  // 2. Verify commissions belong to this affiliate
  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .in('id', commission_ids)
    .eq('affiliate_id', session.user.id)
    .eq('status', 'approved');

  if (commissions.length !== commission_ids.length) {
    return NextResponse.json({
      error: 'Invalid commissions'
    }, { status: 400 });
  }

  // 3. Calculate total
  const total = commissions.reduce((sum, c) => sum + c.amount, 0);

  // 4. Create payment request
  const { data: paymentRequest, error } = await supabase
    .from('payment_requests')
    .insert({
      affiliate_id: session.user.id,
      amount: total,
      payment_method,
      payment_details,
      commission_ids,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(paymentRequest);
}
```

## Database Schema

### Recommended Tables

#### 1. Core Tables

```sql
-- ============================================
-- LEADS TABLE
-- Stores restaurant leads from landing page
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  message TEXT,
  source TEXT DEFAULT 'landing_page', -- 'landing_page', 'referral', 'direct'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  assigned_to UUID REFERENCES auth.users(id), -- Admin assigned to follow up
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);

-- ============================================
-- AFFILIATES TABLE
-- Stores affiliate profiles and referral codes
-- ============================================
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  company_name TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payment_method TEXT, -- 'bank_transfer', 'paypal'
  payment_details JSONB, -- Bank account, PayPal email, etc.
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'inactive'
  total_referrals INT DEFAULT 0,
  total_earnings NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_code ON affiliates(referral_code);
CREATE INDEX idx_affiliates_status ON affiliates(status);

-- ============================================
-- REFERRALS TABLE
-- Tracks customer signups via affiliate links
-- ============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id), -- Optional: link to lead if they converted
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  referral_code TEXT NOT NULL, -- Snapshot of code used
  status TEXT DEFAULT 'pending', -- 'pending', 'converted', 'rejected'
  conversion_date TIMESTAMPTZ, -- When lead became paying customer
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created_at ON referrals(created_at DESC);

-- ============================================
-- COMMISSIONS TABLE
-- Tracks earned commissions per referral
-- ============================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE NOT NULL,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'rejected'
  approved_by UUID REFERENCES auth.users(id), -- Admin who approved
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_request_id UUID, -- Link to payment_requests
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_referral_id ON commissions(referral_id);

-- ============================================
-- PAYMENT_REQUESTS TABLE
-- Affiliate payment withdrawal requests
-- ============================================
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'bank_transfer', 'paypal'
  payment_details JSONB NOT NULL, -- Bank account or PayPal email
  commission_ids UUID[] NOT NULL, -- Array of commission IDs being paid out
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  processed_by UUID REFERENCES auth.users(id), -- Admin who processed
  processed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  transaction_reference TEXT, -- Bank transfer reference
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_requests_affiliate_id ON payment_requests(affiliate_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_created_at ON payment_requests(created_at DESC);

-- ============================================
-- SETTINGS TABLE
-- System-wide configuration
-- ============================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('commission_per_signup', '50', 'Fixed commission amount per signup (€)'),
  ('minimum_payout', '100', 'Minimum amount for payment request (€)'),
  ('admin_notification_email', '"admin@clickresto.com"', 'Email for admin notifications');
```

**Source:** Database schema patterns from [SaaS referral tracking systems](https://medium.com/@samsonojugo/building-a-simple-referral-system-api-with-laravel-11-30c1265b2221), [multi-level referral design](https://www.coderbased.com/p/sql-db-design-multi-level-referral-system)

### Key Relationships

```
auth.users (Supabase Auth)
    │
    ├─→ user_roles (role assignment)
    │
    ├─→ affiliates (1:1, affiliate profile)
    │       │
    │       ├─→ referrals (1:N, affiliate generates referrals)
    │       │       │
    │       │       ├─→ commissions (1:1, referral earns commission)
    │       │       │
    │       │       └─→ leads (N:1 optional, referral may link to lead)
    │       │
    │       └─→ payment_requests (1:N, affiliate requests payouts)
    │               │
    │               └─→ commissions (N:N via commission_ids array)
    │
    └─→ leads.assigned_to (N:1, admin manages leads)
```

### Row-Level Security (RLS) Strategy

**Principle:** Deny by default, explicitly allow based on role.

#### RLS Policies by Table

**1. Leads Table**

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (from landing page)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin can view all leads
CREATE POLICY "Admin can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Admin can update leads
CREATE POLICY "Admin can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );
```

**2. Affiliates Table**

```sql
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Admin can view all affiliates
CREATE POLICY "Admin can view all affiliates"
  ON affiliates FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Affiliates can view only their own profile
CREATE POLICY "Affiliates can view own profile"
  ON affiliates FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- Admin can insert/update affiliates
CREATE POLICY "Admin can manage affiliates"
  ON affiliates FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );
```

**3. Referrals Table**

```sql
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Admin can view all referrals
CREATE POLICY "Admin can view all referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Affiliates can view only their referrals
CREATE POLICY "Affiliates can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Only admin can create/update referrals
CREATE POLICY "Admin can manage referrals"
  ON referrals FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );
```

**4. Commissions Table**

```sql
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Admin can view all commissions
CREATE POLICY "Admin can view all commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Affiliates can view their own commissions
CREATE POLICY "Affiliates can view own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Only admin can manage commissions
CREATE POLICY "Admin can manage commissions"
  ON commissions FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );
```

**5. Payment Requests Table**

```sql
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Admin can view all payment requests
CREATE POLICY "Admin can view all payments"
  ON payment_requests FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Affiliates can view their own payment requests
CREATE POLICY "Affiliates can view own payments"
  ON payment_requests FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Affiliates can create payment requests
CREATE POLICY "Affiliates can create payment requests"
  ON payment_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Only admin can update payment requests
CREATE POLICY "Admin can update payment requests"
  ON payment_requests FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );
```

**6. Settings Table**

```sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage settings
CREATE POLICY "Admin can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_role')::app_role = 'admin'
  );

-- Affiliates can read settings (for commission rates)
CREATE POLICY "Affiliates can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);
```

**Source:** [Supabase RLS best practices](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase RBAC implementation](https://medium.com/@lakshaykapoor08/building-role-based-access-control-rbac-with-supabase-row-level-security-c82eb1865dfd)

### Database Triggers & Automation

**1. Update Affiliate Stats on New Referral**

```sql
CREATE OR REPLACE FUNCTION update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE affiliates
  SET total_referrals = total_referrals + 1,
      updated_at = NOW()
  WHERE id = NEW.affiliate_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_referral
  AFTER INSERT ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_stats();
```

**2. Update Affiliate Earnings on Commission Payment**

```sql
CREATE OR REPLACE FUNCTION update_affiliate_earnings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE affiliates
    SET total_earnings = total_earnings + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_commission_paid
  AFTER UPDATE ON commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_earnings();
```

**3. Auto-update Timestamps**

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_leads_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_affiliates_timestamp
  BEFORE UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Repeat for other tables...
```

## Architecture Patterns to Follow

### Pattern 1: Server-First with Progressive Enhancement

**What:** Render as much as possible on the server, enhance with client-side interactivity where needed.

**When:** All dashboard pages, data tables, forms.

**Example:**
```typescript
// app/(admin)/leads/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { LeadsTable } from '@/components/tables/leads-table';

export default async function LeadsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Server-side data fetch (happens on server, not client)
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1>Leads</h1>
      {/* Server-rendered table, client-side filtering/sorting */}
      <LeadsTable data={leads} />
    </div>
  );
}
```

**Why:** Faster initial page load, better SEO, reduced client-side JavaScript.

### Pattern 2: Optimistic Updates with Revalidation

**What:** Update UI immediately on user action, then revalidate from server.

**When:** Updating lead status, approving payments, marking commissions as paid.

**Example:**
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ApprovePaymentButton({ paymentId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  async function handleApprove() {
    // Optimistic update
    setStatus('approved');

    // API call
    const response = await fetch(`/api/payments/${paymentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' })
    });

    if (response.ok) {
      // Revalidate server data
      router.refresh();
    } else {
      // Rollback on error
      setStatus(currentStatus);
    }
  }

  return (
    <button onClick={handleApprove}>
      {status === 'approved' ? 'Approved ✓' : 'Approve Payment'}
    </button>
  );
}
```

### Pattern 3: Role-Based Layout Composition

**What:** Use nested layouts to compose role-specific UI with shared components.

**When:** Admin vs affiliate dashboards.

**Example:**
```typescript
// app/(admin)/layout.tsx
import { AdminNav } from '@/components/admin-nav';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}

// app/(affiliate)/layout.tsx
import { AffiliateNav } from '@/components/affiliate-nav';

export default function AffiliateLayout({ children }) {
  return (
    <div className="affiliate-layout">
      <AffiliateNav />
      <main>{children}</main>
    </div>
  );
}
```

### Pattern 4: Middleware for Auth Gating

**What:** Use Next.js middleware to protect routes before rendering.

**When:** All authenticated routes (`/admin/*`, `/affiliate/*`).

**Example:**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const { data: { session } } = await supabase.auth.getSession();

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = session.user.user_metadata?.role;
  const path = request.nextUrl.pathname;

  // Admin routes restricted to admins
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/affiliate/portal', request.url));
  }

  // Affiliate routes restricted to affiliates
  if (path.startsWith('/affiliate') && userRole !== 'affiliate') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/affiliate/:path*']
};
```

## Architecture Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side Authorization

**What:** Checking user roles or permissions only in React components without server-side enforcement.

**Why bad:** Client-side checks can be bypassed. Security must be enforced at the API/database level.

**Instead:** Always enforce authorization in API routes AND RLS policies. Client-side checks are for UX only.

```typescript
// ❌ BAD: Only checking role in component
'use client';
export function DeleteButton() {
  const { user } = useAuth();
  if (user.role !== 'admin') return null; // Can be bypassed!

  return <button onClick={() => deleteItem()}>Delete</button>;
}

// ✅ GOOD: Enforce in API + RLS
export async function DELETE(request: Request) {
  const session = await getSession();

  // Server-side role check
  if (session.user.user_metadata.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // RLS also prevents unauthorized deletes at database level
  const { error } = await supabase.from('items').delete().eq('id', itemId);

  return NextResponse.json({ success: true });
}
```

### Anti-Pattern 2: Bypass RLS with Service Key

**What:** Using Supabase service key (which bypasses RLS) in client-accessible code or for user-initiated actions.

**Why bad:** Service key bypasses all security policies. If exposed, attackers have full database access.

**Instead:** Use service key ONLY for admin operations in secure server-side code. Use session-based auth for user operations.

```typescript
// ❌ BAD: Using service key for user request
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Never expose this!
);

// ✅ GOOD: Use session-based client
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const supabase = createRouteHandlerClient({ cookies });
// RLS policies enforce access control automatically
```

### Anti-Pattern 3: Storing Sensitive Data in JWT Claims

**What:** Adding sensitive information (bank accounts, SSNs) to JWT custom claims.

**Why bad:** JWTs are decoded client-side. Anyone can read claims. JWTs are also cached and may not update immediately.

**Instead:** Store sensitive data in database tables with RLS. Only store role/user_id in JWT.

```typescript
// ❌ BAD: Sensitive data in JWT
{
  user_role: 'affiliate',
  bank_account: '1234567890', // Readable by anyone!
  commission_rate: 0.15
}

// ✅ GOOD: Only role in JWT
{
  user_role: 'affiliate'
}
// Fetch sensitive data from database with RLS protection
const { data } = await supabase
  .from('affiliates')
  .select('payment_details')
  .eq('user_id', userId)
  .single();
```

### Anti-Pattern 4: Monolithic API Routes

**What:** Creating a single API route that handles all CRUD operations with complex if/else logic.

**Why bad:** Hard to maintain, difficult to add middleware, harder to debug.

**Instead:** Use RESTful route structure with separate files for each resource and HTTP method.

```typescript
// ❌ BAD: Everything in one file
// app/api/data/route.ts
export async function POST(request: Request) {
  const { action, type, data } = await request.json();

  if (action === 'create') {
    if (type === 'lead') {
      // Create lead logic
    } else if (type === 'affiliate') {
      // Create affiliate logic
    }
  } else if (action === 'update') {
    // More nested logic...
  }
}

// ✅ GOOD: Separate routes per resource
// app/api/leads/route.ts
export async function POST(request: Request) { /* Create lead */ }

// app/api/affiliates/route.ts
export async function POST(request: Request) { /* Create affiliate */ }
```

### Anti-Pattern 5: No Data Validation

**What:** Accepting user input directly into database without validation.

**Why bad:** Opens door to SQL injection, data corruption, business logic errors.

**Instead:** Use validation library (Zod, Yup) to validate all inputs before database operations.

```typescript
// ❌ BAD: No validation
export async function POST(request: Request) {
  const data = await request.json();

  // Directly insert user input
  const { error } = await supabase.from('leads').insert(data);
}

// ✅ GOOD: Validate with Zod
import { z } from 'zod';

const leadSchema = z.object({
  restaurant_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  message: z.string().max(1000).optional()
});

export async function POST(request: Request) {
  const body = await request.json();

  // Validate before insert
  const result = leadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({
      error: 'Validation failed',
      details: result.error.issues
    }, { status: 400 });
  }

  const { error } = await supabase.from('leads').insert(result.data);
}
```

## Build Order & Dependencies

### Phase 1: Foundation (Week 1)

**Goal:** Set up core infrastructure and authentication.

**Tasks:**
1. Initialize Next.js project with App Router
2. Set up Supabase project
3. Create database schema (all tables)
4. Set up Supabase Auth with email/password
5. Implement RBAC (user_roles table + auth hook)
6. Create RLS policies for all tables
7. Set up basic folder structure (route groups)

**Deliverables:**
- Next.js app scaffold
- Database with all tables + RLS
- Working authentication flow
- Role-based JWT claims

**No dependencies:** This is the foundation for everything else.

### Phase 2: Landing Page + Lead Capture (Week 1-2)

**Goal:** Enable lead submissions from existing HTML landing page.

**Tasks:**
1. Integrate Supabase client into `index.html`
2. Implement form submission handler
3. Set up database trigger for email notifications
4. Create Edge Function for sending emails
5. Configure SendGrid/SMTP integration
6. Test end-to-end lead flow

**Deliverables:**
- Working lead capture form
- Email notifications on new leads
- Leads stored in database

**Dependencies:**
- Phase 1 complete (database + auth)

### Phase 3: Admin Dashboard - Lead Management (Week 2)

**Goal:** Admins can view and manage leads.

**Tasks:**
1. Create admin layout with navigation
2. Build leads list page (`(admin)/leads/page.tsx`)
3. Create lead detail page (`(admin)/leads/[id]/page.tsx`)
4. Implement lead status updates
5. Add real-time lead notifications (Supabase Realtime)
6. Create API routes for lead CRUD operations

**Deliverables:**
- Admin can view all leads
- Admin can update lead status
- Admin sees new leads in real-time

**Dependencies:**
- Phase 1 (auth + database)
- Phase 2 (leads exist)

### Phase 4: Admin Dashboard - Affiliate Management (Week 3)

**Goal:** Admins can create and manage affiliates.

**Tasks:**
1. Create affiliate list page (`(admin)/affiliates/page.tsx`)
2. Create affiliate creation form
3. Implement affiliate signup flow (create auth.user + affiliate record)
4. Generate unique referral codes
5. Send magic link welcome emails to new affiliates
6. Build affiliate detail/edit page

**Deliverables:**
- Admin can create affiliates
- Affiliates receive welcome emails
- Unique referral codes generated

**Dependencies:**
- Phase 1 (auth + RBAC)

### Phase 5: Affiliate Portal - Dashboard (Week 3-4)

**Goal:** Affiliates can log in and view their dashboard.

**Tasks:**
1. Create affiliate layout with navigation
2. Build affiliate portal/dashboard page
3. Display affiliate stats (total referrals, earnings)
4. Create referral link sharing UI
5. Build referrals list page (affiliate's referrals only)
6. Implement role-based routing in middleware

**Deliverables:**
- Affiliate login and dashboard
- Affiliate sees their stats and referrals
- Referral link sharing

**Dependencies:**
- Phase 1 (auth + RBAC)
- Phase 4 (affiliates exist)

### Phase 6: Referral Tracking & Commission Calculation (Week 4)

**Goal:** Track customer signups via referral codes and calculate commissions.

**Tasks:**
1. Build customer signup flow with referral code capture
2. Implement referral creation logic (affiliate_id from code)
3. Create commission calculation database function
4. Set up database trigger for auto-commission creation
5. Build admin referral approval page
6. Implement commission status workflow (pending → approved)

**Deliverables:**
- Referral tracking works end-to-end
- Commissions auto-calculated on referral conversion
- Admin can approve/reject commissions

**Dependencies:**
- Phase 4 (affiliates with codes)
- Phase 5 (affiliate can see referrals)

### Phase 7: Payment Request & Processing (Week 5)

**Goal:** Affiliates can request payouts, admins can process them.

**Tasks:**
1. Build affiliate payout request form
2. Create payment request validation logic
3. Build admin payment requests list page
4. Implement payment approval workflow
5. Create payment status updates (pending → processing → paid)
6. Send email notifications for payment status changes

**Deliverables:**
- Affiliates can request payments
- Admins can approve and mark payments as paid
- Payment history tracking

**Dependencies:**
- Phase 6 (commissions exist and are approved)

### Phase 8: Admin Settings & Analytics (Week 5-6)

**Goal:** Admin can configure system and view analytics.

**Tasks:**
1. Build settings page (commission rates, minimum payout)
2. Create dashboard analytics (total leads, conversions, payouts)
3. Build charts (referrals over time, top affiliates)
4. Implement export functionality (CSV downloads)
5. Add admin activity logs

**Deliverables:**
- Configurable system settings
- Analytics dashboards
- Data export capability

**Dependencies:**
- All previous phases (data exists to analyze)

### Integration Points

```
Landing Page ──────────────┐
                           │
                           ↓
                    Supabase Database ←──── Admin Dashboard
                           ↑
                           │
                    Affiliate Portal
```

**Critical Integration Points:**

1. **Landing → Database:** Supabase client library for direct inserts
2. **Database → Email:** Database triggers invoke Edge Functions
3. **Admin/Affiliate → Database:** Next.js API routes with RLS enforcement
4. **Auth → Database:** JWT claims enable RLS policy evaluation
5. **Realtime Updates:** Supabase Realtime for live dashboard updates

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Database** | Single Supabase instance | Supabase with connection pooling | Dedicated Supabase instance with read replicas |
| **Authentication** | Supabase Auth (built-in) | Supabase Auth (scales automatically) | Supabase Auth + CDN for static assets |
| **File Storage** | Not applicable (no file uploads) | N/A | N/A |
| **API Routes** | Next.js on Vercel (serverless) | Next.js on Vercel (auto-scales) | Consider Edge Runtime for API routes |
| **Real-time** | Supabase Realtime (10K concurrent) | Supabase Realtime with filtering | Evaluate Postgres LISTEN/NOTIFY limits |
| **Email** | SendGrid free tier | SendGrid paid tier | Dedicated email service (AWS SES) |

**Performance Optimization Strategies:**

1. **Database Indexes:** Already defined on foreign keys and frequently queried columns
2. **RLS Policy Optimization:** Use `(SELECT auth.uid())` pattern for caching
3. **API Route Caching:** Use Next.js unstable_cache for read-heavy endpoints
4. **Server Components:** Render data tables on server, minimize client JS
5. **Incremental Static Regeneration:** For affiliate portal landing/marketing pages

## Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| Next.js Structure | **HIGH** | Official Next.js docs + Vercel guidance on route groups and multi-tenant apps |
| Supabase RLS | **HIGH** | Official Supabase docs on custom claims, RBAC, and RLS best practices |
| Database Schema | **MEDIUM** | Based on SaaS referral system patterns from community examples; validated against common implementations |
| Email Flow | **MEDIUM** | Supabase Edge Functions + triggers documented; specific SendGrid integration requires testing |
| Build Order | **MEDIUM** | Logical dependency order based on system requirements; may need adjustment during implementation |

## Sources

**Official Documentation (HIGH Confidence):**
- [Supabase Custom Claims & RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js Multi-Tenant Guide](https://nextjs.org/docs/app/guides/multi-tenant)

**Community Best Practices (MEDIUM Confidence):**
- [Next.js Route Groups Tutorial](https://medium.com/@shrutishende11/next-js-route-groups-organizing-your-app-router-like-a-pro-aa58ca11f963)
- [Next.js App Router Best Practices 2026](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580)
- [Supabase Email Notifications with Triggers](https://medium.com/@DeolaJ/how-to-trigger-email-notifications-on-a-contact-form-with-supabase-210cf245e57e)
- [Supabase Edge Functions for Email](https://bejamas.com/hub/guides/send-emails-supabase-edge-functions-database-triggers)
- [Next.js API Routes Best Practices](https://medium.com/@turingvang/best-practices-for-api-routes-for-dynamic-data-fetching-in-next-js-0874c6329070)
- [Building Referral System with Node.js and MySQL](https://plainenglish.io/blog/build-a-simple-referral-system-with-nodejs-and-mysql-3164de2e7818)
- [Database Schema for Multi-Level Referral System](https://www.coderbased.com/p/sql-db-design-multi-level-referral-system)
- [Referral Code Generation Architecture](https://medium.com/@siddhusingh/referral-code-generation-architecture-contention-free-scalable-approach-68ea44ee5fb0)
- [Supabase RBAC Implementation Guide](https://medium.com/@lakshaykapoor08/building-role-based-access-control-rbac-with-supabase-row-level-security-c82eb1865dfd)
