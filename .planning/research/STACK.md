# Technology Stack

**Project:** ClickResto - Restaurant SaaS Platform
**Target:** French restaurant owners
**Researched:** 2026-01-31
**Confidence:** HIGH (verified with official documentation and 2026 sources)

---

## Executive Summary

For a SaaS platform with landing page, affiliate/referral management, CRM, and admin back-office targeting French restaurant owners, the recommended stack is:

- **Frontend Framework:** Next.js 16 (App Router)
- **Backend/Database:** Supabase (PostgreSQL + Auth + RLS)
- **UI Components:** shadcn/ui + Tailwind CSS
- **State Management:** TanStack Query + Zustand (minimal)
- **Form Handling:** React Hook Form + Zod
- **Email:** Resend + React Email
- **Deployment:** Vercel

**Why this stack:** Modern, type-safe, cost-effective for MVP, scales to enterprise, excellent DX, strong ecosystem support, and specifically optimized for Next.js + Supabase integration.

---

## Core Framework

### Next.js 16.1+
**Version:** `^16.1.0` (latest stable as of Jan 2026)
**Package:** `next@latest`

**Why:**
- **App Router is now mature** - Next.js 16 includes stable Turbopack (5-10x faster dev builds, 2-5x faster production builds)
- **Built-in React Compiler** - Automatic optimization without manual memoization
- **Native Server Components** - Reduces client JS bundle, improves SEO for landing pages
- **Server Actions** - Simplified form handling and mutations without API routes
- **Layout deduplication** - Optimized routing for dashboard navigation

**Best Practices for This Project:**

#### 1. Use App Router (not Pages Router)
App Router is the default in Next.js 16 and fully supports React Server Components, which are critical for:
- Landing page SEO and performance
- Server-side data fetching for dashboards
- Reduced JavaScript for affiliate/referral pages

#### 2. Project Structure
```
clickresto/
├── app/
│   ├── (marketing)/          # Public pages (landing, pricing)
│   │   ├── layout.tsx         # Marketing layout (different header/footer)
│   │   ├── page.tsx           # Home/landing page
│   │   └── demo/
│   │       └── page.tsx       # Demo request form
│   ├── (auth)/                # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout (sidebar, auth check)
│   │   ├── crm/
│   │   │   ├── page.tsx       # Leads list
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Lead detail
│   │   ├── affiliates/
│   │   │   ├── page.tsx       # Affiliate management
│   │   │   └── dashboard/
│   │   │       └── page.tsx   # Affiliate dashboard
│   │   └── admin/
│   │       └── page.tsx       # Admin back-office
│   ├── api/
│   │   ├── webhooks/          # Supabase webhooks
│   │   └── cron/              # Background jobs (commission calc)
│   ├── layout.tsx             # Root layout
│   └── error.tsx              # Global error boundary
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── forms/                 # Form components (demo request, lead forms)
│   ├── dashboard/             # Dashboard-specific components
│   └── marketing/             # Landing page components
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Client-side Supabase
│   │   ├── server.ts          # Server-side Supabase
│   │   └── middleware.ts      # Auth middleware
│   ├── validations/           # Zod schemas
│   └── utils.ts               # Utilities
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript types
└── emails/                    # React Email templates
```

**Rationale for route groups:**
- `(marketing)` - Excludes "marketing" from URL, allows different layout
- `(auth)` - Separate layout for login/signup (no navigation)
- `(dashboard)` - Shared dashboard layout with sidebar, requires auth

#### 3. Server vs Client Components Strategy

**Server Components (default):**
- Landing page content (SEO benefits)
- Dashboard layouts
- Data fetching pages (leads list, affiliate dashboard)
- Initial CRM data display

**Client Components (`'use client'`):**
- Forms (demo request, lead creation)
- Interactive dashboards (charts, filters)
- Real-time components (live lead notifications)
- State-dependent UI (dropdowns, modals, tabs)

**Key rule:** Keep components Server by default; use Client only for interactivity.

#### 4. Caching Strategy

Next.js 16 changed defaults to **uncached by default** for GET routes and Client Router Cache. This is better for SaaS dashboards with frequently changing data.

For this project:
- **Static:** Landing page, pricing page (`export const revalidate = 3600` - revalidate hourly)
- **Dynamic:** CRM dashboard, affiliate stats (always fresh)
- **ISR:** Blog posts if added later

```tsx
// app/(dashboard)/crm/page.tsx
export const revalidate = 0; // Always fresh for CRM data

// app/(marketing)/page.tsx
export const revalidate = 3600; // Hourly revalidation for landing page
```

---

## Backend & Database

### Supabase
**Version:** Latest (managed service, auto-updated)
**Packages:** `@supabase/supabase-js@^2.39.0`, `@supabase/ssr@^0.1.0`

**Why:**
- **PostgreSQL** - Robust relational DB for CRM, leads, affiliates, commissions
- **Built-in Auth** - Email/password + magic link out of the box
- **Row Level Security (RLS)** - Data isolation between users/organizations
- **Real-time subscriptions** - Live updates for CRM dashboard
- **Edge Functions** - Serverless functions for complex logic
- **Free tier** - Cost-effective for MVP (500MB database, 50K monthly active users)

### Database Schema

#### Tables

```sql
-- Organizations (restaurants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'trial', -- trial, basic, premium
  status TEXT DEFAULT 'active' -- active, suspended, cancelled
);

-- Users (restaurant owners, admins)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  organization_id UUID REFERENCES organizations(id),
  role TEXT DEFAULT 'member', -- admin, member, affiliate
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (CRM)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  restaurant_name TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  source TEXT, -- demo_form, affiliate_referral, organic
  referred_by UUID REFERENCES affiliates(id), -- NULL if not referred
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliates
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL DEFAULT 0, -- Fixed amount per signup (e.g., 50.00)
  total_referrals INT DEFAULT 0,
  total_commissions DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, inactive, suspended
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals (tracks affiliate referrals)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
  lead_id UUID REFERENCES leads(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id), -- NULL until converted
  status TEXT DEFAULT 'pending', -- pending, converted, paid
  commission_amount DECIMAL DEFAULT 0,
  converted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Payments
CREATE TABLE commission_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
  amount DECIMAL NOT NULL,
  referral_ids UUID[] NOT NULL, -- Array of referral IDs included in this payment
  status TEXT DEFAULT 'pending', -- pending, paid, failed
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

**Critical:** RLS must be enabled on ALL tables to prevent data leaks. 83% of Supabase security issues come from RLS misconfigurations.

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own org
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Leads: Users can only see leads for their organization
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert leads to own org"
  ON leads FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Affiliates: Can view own data
CREATE POLICY "Affiliates can view own data"
  ON affiliates FOR SELECT
  USING (id = auth.uid());

-- Admins can view all (add role check)
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Optimization:** Add indexes for RLS policy columns:
```sql
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_leads_organization_id ON leads(organization_id);
CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
```

### Authentication Configuration

**Auth Methods:**
1. **Email/Password** - Primary for restaurant owners
2. **Magic Link** - Passwordless for affiliates (easier onboarding)

**Setup:**
```typescript
// lib/supabase/client.ts (client-side)
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// lib/supabase/server.ts (server-side)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

**Middleware for Auth Protection:**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if accessing dashboard without auth
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/crm/:path*']
}
```

---

## UI & Styling

### shadcn/ui + Tailwind CSS
**Packages:**
- `tailwindcss@^3.4.0`
- `@radix-ui/react-*` (installed via shadcn CLI)
- `class-variance-authority@^0.7.0`
- `clsx@^2.1.0`
- `tailwind-merge@^2.2.0`

**Why shadcn/ui over alternatives:**

| Criterion | shadcn/ui | Tailwind UI | Material UI |
|-----------|-----------|-------------|-------------|
| **Ownership** | Copy components to your codebase | Pre-built, less customizable | Heavy dependency |
| **Bundle Size** | Small (only what you use) | Medium | Large |
| **Customization** | Full control (you own the code) | Limited | Theming only |
| **TypeScript** | Excellent | Good | Good |
| **Accessibility** | Built on Radix UI (excellent) | Good | Good |
| **Cost** | Free | $299 (one-time) | Free |
| **Next.js 16 Support** | Excellent | Good | Fair |
| **AI Compatibility** | Used by v0, Lovable, Bolt | N/A | N/A |

**Decision:** shadcn/ui because you own the code, can customize freely, and it's the 2026 standard for Next.js projects.

**Setup:**
```bash
npx shadcn@latest init
```

**Configuration (components.json):**
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Essential Components for This Project:**
```bash
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add toast
```

**Tailwind Configuration:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors for French restaurant theme
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other colors
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

---

## State Management

### TanStack Query v5 + Zustand (minimal)
**Packages:**
- `@tanstack/react-query@^5.17.0`
- `@tanstack/react-query-devtools@^5.17.0`
- `zustand@^4.5.0`

**Why this combination:**

**TanStack Query** - Primary state management for:
- Server state (leads, affiliates, referrals from Supabase)
- Caching, background refetching, optimistic updates
- Infinite scrolling (leads list)
- Mutations with rollback

**Zustand** - Minimal client state only for:
- UI state (sidebar open/closed, modal visibility)
- User preferences (dashboard view settings)
- Form wizards with multi-step state

**Why NOT Redux/Context API alone:**
- **Redux** - Too heavy for this project, overkill for simple state needs
- **Context API alone** - Re-renders entire tree, poor performance for dashboard

**Why TanStack Query + Zustand is the 2026 pattern:**
> "React Server Components and TanStack Query: The 2026 data-fetching power duo. RSCs for initial render, TanStack Query for client lifecycle. Teams report 40-70% faster initial loads."

**Setup:**

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false, // Don't refetch on tab switch (annoying in dashboards)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Usage Example (Fetching Leads):**
```typescript
// hooks/use-leads.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useLeads(organizationId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['leads', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (newLead: { full_name: string; email: string; /* ... */ }) => {
      const { data, error } = await supabase
        .from('leads')
        .insert(newLead)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch leads
      queryClient.invalidateQueries({ queryKey: ['leads', data.organization_id] })
    },
  })
}
```

**Zustand Store (UI State):**
```typescript
// stores/ui-store.ts
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

---

## Form Handling & Validation

### React Hook Form v7 + Zod
**Packages:**
- `react-hook-form@^7.49.0`
- `zod@^3.22.0`
- `@hookform/resolvers@^3.3.0`

**Why:**
- **React Hook Form** - Best performance (minimal re-renders), great DX, built-in validation
- **Zod** - Type-safe validation, shared client/server schemas, excellent TypeScript inference

**This is the 2026 standard:**
> "React Hook Form combined with Zod has changed how developers approach form validation, making forms actually enjoyable to build."

**Setup:**

```typescript
// lib/validations/lead.ts
import { z } from 'zod'

export const leadSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide').optional(),
  restaurant_name: z.string().min(2, 'Le nom du restaurant est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>
```

**Form Component:**
```typescript
// components/forms/demo-request-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, type LeadFormData } from '@/lib/validations/lead'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function DemoRequestForm() {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      restaurant_name: '',
      message: '',
    },
  })

  async function onSubmit(data: LeadFormData) {
    // Submit to Server Action
    const result = await submitDemoRequest(data)
    if (result.success) {
      form.reset()
      toast.success('Demande envoyée avec succès!')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other fields... */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Envoi...' : 'Demander une démo'}
        </Button>
      </form>
    </Form>
  )
}
```

**Server Action (with same Zod schema):**
```typescript
// app/actions/leads.ts
'use server'

import { leadSchema } from '@/lib/validations/lead'
import { createClient } from '@/lib/supabase/server'
import { sendDemoRequestEmail } from '@/lib/email'

export async function submitDemoRequest(formData: unknown) {
  // Validate on server with same schema
  const parsed = leadSchema.safeParse(formData)

  if (!parsed.success) {
    return { success: false, error: 'Données invalides' }
  }

  const supabase = createClient()

  // Insert lead
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...parsed.data,
      source: 'demo_form',
      status: 'new',
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: 'Erreur lors de l\'enregistrement' }
  }

  // Send email notification
  await sendDemoRequestEmail(data)

  return { success: true, data }
}
```

---

## Email

### Resend + React Email
**Packages:**
- `resend@^3.2.0`
- `react-email@^2.1.0`
- `@react-email/components@^0.0.14`

**Why:**
- **Resend** - Modern email API, generous free tier (100 emails/day), excellent DX
- **React Email** - Build emails with React components (same as your UI), supports all major email clients
- **Integration** - Created by same people, seamless Next.js integration

**Cost:** Free tier sufficient for MVP (3,000 emails/month).

**Setup:**

```bash
npm install resend react-email @react-email/components
```

**.env.local:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@clickresto.com  # Verify domain in Resend
```

**Email Template:**
```typescript
// emails/demo-request.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface DemoRequestEmailProps {
  leadName: string
  email: string
  restaurantName: string
  message?: string
}

export default function DemoRequestEmail({
  leadName,
  email,
  restaurantName,
  message,
}: DemoRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de démo - {restaurantName}</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Nouvelle demande de démo</Heading>
          <Text>Vous avez reçu une nouvelle demande de démo :</Text>
          <Text><strong>Nom :</strong> {leadName}</Text>
          <Text><strong>Email :</strong> {email}</Text>
          <Text><strong>Restaurant :</strong> {restaurantName}</Text>
          {message && (
            <>
              <Text><strong>Message :</strong></Text>
              <Text>{message}</Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  )
}
```

**Sending Email:**
```typescript
// lib/email.ts
import { Resend } from 'resend'
import DemoRequestEmail from '@/emails/demo-request'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendDemoRequestEmail(lead: {
  full_name: string
  email: string
  restaurant_name: string
  message?: string
}) {
  const { data, error } = await resend.emails.send({
    from: 'ClickResto <noreply@clickresto.com>',
    to: 'admin@clickresto.com', // Your admin email
    subject: `Nouvelle demande de démo - ${lead.restaurant_name}`,
    react: DemoRequestEmail({
      leadName: lead.full_name,
      email: lead.email,
      restaurantName: lead.restaurant_name,
      message: lead.message,
    }),
  })

  if (error) {
    console.error('Email send error:', error)
    throw new Error('Failed to send email')
  }

  return data
}
```

**For Affiliate Magic Links:**
```typescript
// lib/email.ts
export async function sendAffiliateMagicLink(email: string, magicLink: string) {
  await resend.emails.send({
    from: 'ClickResto <noreply@clickresto.com>',
    to: email,
    subject: 'Connexion à votre espace affilié',
    react: MagicLinkEmail({ magicLink }),
  })
}
```

---

## Deployment

### Vercel
**Platform:** Vercel (free hobby plan, then $20/month Pro)

**Why Vercel over alternatives:**

| Criterion | Vercel | Netlify | Railway | AWS |
|-----------|--------|---------|---------|-----|
| **Next.js Optimization** | Excellent (built by Vercel) | Good | Fair | Manual |
| **Supabase Integration** | Native marketplace integration | Manual | Manual | Manual |
| **Edge Network** | Global | Global | Limited | Manual |
| **Free Tier** | Generous (100GB bandwidth) | Good | Limited | Complex pricing |
| **DX** | Excellent | Good | Good | Poor |
| **Auto-scaling** | Yes | Yes | Yes | Manual |

**Decision:** Vercel because it's built by Next.js creators, has native Supabase integration, and offers best DX.

### Setup

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Connect to Vercel:**
```bash
vercel login
vercel link
```

**3. Environment Variables:**

Option A: **Supabase Marketplace Integration (Recommended)**
- Go to Vercel Dashboard → Settings → Integrations
- Search for "Supabase" → Add Integration
- Automatically sets all required env vars

Option B: **Manual Setup**
```bash
# In Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # For admin operations
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@clickresto.com
```

**Security:**
- NEVER commit `.env.local` to Git
- Use `NEXT_PUBLIC_*` prefix only for truly public values
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only (bypasses RLS)

**4. Deploy:**
```bash
vercel --prod
```

**5. Custom Domain:**
```bash
vercel domains add clickresto.com
```

### Performance Optimizations

**next.config.ts:**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@react-email/components'],
  },
}

export default nextConfig
```

---

## Development Tools

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint + Prettier
```bash
npm install -D eslint prettier eslint-config-prettier
```

**.eslintrc.json:**
```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

**.prettierrc:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Database Types Generation

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id [project-id] > types/supabase.ts
```

**Usage:**
```typescript
import { Database } from '@/types/supabase'

type Lead = Database['public']['Tables']['leads']['Row']
```

---

## Installation Script

**Complete setup:**
```bash
# Create Next.js app
npx create-next-app@latest clickresto --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd clickresto

# Install core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install resend react-email @react-email/components
npm install class-variance-authority clsx tailwind-merge
npm install date-fns # For date formatting

# Install dev dependencies
npm install -D @types/node
npm install -D prettier eslint-config-prettier

# Initialize shadcn/ui
npx shadcn@latest init

# Add essential shadcn components
npx shadcn@latest add button form input label card table dropdown-menu dialog tabs select badge avatar separator toast

# Initialize Supabase (optional local dev)
# npx supabase init
```

---

## Version Summary

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | ^16.1.0 | Frontend framework |
| React | ^19.0.0 | UI library |
| TypeScript | ^5.3.0 | Type safety |
| Tailwind CSS | ^3.4.0 | Styling |
| @supabase/supabase-js | ^2.39.0 | Supabase client |
| @supabase/ssr | ^0.1.0 | Server-side auth |
| @tanstack/react-query | ^5.17.0 | Server state management |
| zustand | ^4.5.0 | Client state management |
| react-hook-form | ^7.49.0 | Form handling |
| zod | ^3.22.0 | Validation |
| resend | ^3.2.0 | Email API |
| react-email | ^2.1.0 | Email templates |

---

## Migration Notes (If Upgrading)

**From Next.js 13/14 to 16:**
- App Router is now required (Pages Router deprecated)
- Turbopack is default (faster builds)
- Automatic React Compiler (remove manual `useMemo`/`useCallback`)

**From JavaScript to TypeScript:**
- Rename `.js` → `.tsx` for components
- Add type annotations
- Generate Supabase types

---

## Anti-Patterns to Avoid

### ❌ Don't: Use service_role key client-side
```typescript
// NEVER do this - exposes admin access
const supabase = createClient(url, SERVICE_ROLE_KEY)
```

### ✅ Do: Use anon key with RLS
```typescript
const supabase = createClient(url, ANON_KEY) // RLS protects data
```

### ❌ Don't: Fetch data in Client Components
```typescript
'use client'
export default function Page() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/leads').then(/* ... */) // Extra roundtrip
  }, [])
}
```

### ✅ Do: Fetch in Server Components
```typescript
export default async function Page() {
  const leads = await supabase.from('leads').select() // Direct DB access
  return <LeadsList leads={leads} />
}
```

### ❌ Don't: Put sensitive logic in API routes
```typescript
// app/api/leads/route.ts - can be bypassed
export async function GET() {
  // No auth check - anyone can access!
}
```

### ✅ Do: Use RLS policies
```sql
-- Database enforces access control
CREATE POLICY "Users see own leads" ON leads
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));
```

---

## Sources

### Official Documentation (HIGH Confidence)
- [Next.js 16.1 Release](https://nextjs.org/blog/next-16-1)
- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [React Hook Form Documentation](https://react-hook-form.com/docs/useform)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [shadcn/ui](https://ui.shadcn.com)
- [Resend Next.js Guide](https://resend.com/docs/send-with-nextjs)

### Community Best Practices (MEDIUM Confidence)
- [Best Practices for Organizing Your Next.js 15 2025](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [React Hook Form with Zod: Complete Guide for 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [React Server Components + TanStack Query: The 2026 Data-Fetching Power Duo](https://dev.to/krish_kakadiya_5f0eaf6342/react-server-components-tanstack-query-the-2026-data-fetching-power-duo-you-cant-ignore-21fj)
- [State Management in 2025: Context API vs Zustand](https://dev.to/cristiansifuentes/react-state-management-in-2025-context-api-vs-zustand-385m)
- [Supabase RLS Complete Guide 2025](https://vibeappscanner.com/supabase-row-level-security)
- [Next.js SaaS Dashboard Development Best Practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards)

### Version Information (HIGH Confidence)
- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16)
- [Next.js Support Policy](https://nextjs.org/support-policy)
- [Vercel Next.js Releases](https://github.com/vercel/next.js/releases)

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Next.js 16 | HIGH | Official release notes, current stable version |
| Supabase Setup | HIGH | Official documentation, verified examples |
| shadcn/ui | HIGH | Official docs, widely adopted in 2026 |
| State Management | HIGH | TanStack Query + Zustand is proven 2026 pattern |
| Form Handling | HIGH | React Hook Form + Zod is industry standard |
| Email (Resend) | HIGH | Official integration guides |
| Deployment (Vercel) | HIGH | Native Next.js platform |
| RLS Policies | MEDIUM | Community examples, requires project-specific customization |

---

**Next Steps:**
1. Initialize project with installation script
2. Set up Supabase project and configure auth
3. Create database schema and RLS policies
4. Implement landing page with demo form
5. Build dashboard layout and authentication flow
6. Develop CRM and affiliate management features

**Estimated setup time:** 2-3 hours for complete stack configuration.
