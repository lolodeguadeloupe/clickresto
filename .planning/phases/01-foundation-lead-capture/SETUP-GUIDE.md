# Clickresto Phase 1 Setup Guide

This guide walks you through setting up and testing all Phase 1 functionality.

## Prerequisites

- Supabase account (free tier is sufficient)
- Node.js 18+ installed
- Browser for testing

## Step 1: Supabase Project Setup

Your Supabase configuration is already in place:
- `js/supabase-config.js` - Landing page config (✓ configured)
- `backoffice/.env.local` - Back-office config (✓ configured)

**Supabase URL:** http://supabasekong-f8ws04sg84wcocwocg88cg8o.37.59.121.40.sslip.io

### 1.1 Deploy Database Schema

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/schema.sql`
4. Paste and run in SQL Editor
5. Verify tables created:

```sql
SELECT * FROM public.user_roles;
SELECT * FROM public.leads;
```

Expected: Both tables exist (may be empty)

### 1.2 Configure Auth Redirect URLs

1. In Supabase Dashboard, go to Authentication > URL Configuration
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/confirm`

### 1.3 Create Admin User

**Option A: Via Back-office Signup**

1. Start back-office: `cd backoffice && npm run dev`
2. Navigate to http://localhost:3000/signup
3. Create account with your email
4. Check email for confirmation link and confirm

**Option B: Direct SQL (if email not working)**

```sql
-- First, sign up via the UI, then run this:
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'your-email@example.com'
);
```

Verify admin role:
```sql
SELECT u.email, r.role
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id;
```

Expected: Your user has role = 'admin'

## Step 2: Install Dependencies

```bash
# Back-office dependencies
cd backoffice
npm install
```

## Step 3: Start Development Servers

**Terminal 1 - Back-office:**
```bash
cd backoffice
npm run dev
```

Expected: Server running at http://localhost:3000

**Terminal 2 - Landing page:**

Choose one option:

```bash
# Option A: Python
python -m http.server 8080

# Option B: Node http-server
npx http-server -p 8080

# Option C: VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

Expected: Landing page at http://localhost:8080

## Step 4: Verification Tests

### Test 1: Landing Page Lead Submission ✓

1. Open http://localhost:8080
2. Scroll to contact form (bottom of page)
3. Fill in all fields:
   - **Prenom:** Test
   - **Nom:** User
   - **Email:** test@example.com
   - **Telephone:** 0612345678
   - **Restaurant:** Le Test Restaurant
   - **Type:** Demande de demo
   - **Message:** Test message from setup guide
4. Click "Envoyer ma demande"
5. **Expected:** Green success message appears for 5 seconds
6. **Verify in Supabase:**
   - Go to Supabase Dashboard > Table Editor > leads
   - Should show new row with your test data

### Test 2: Mobile Responsiveness ✓

1. Open http://localhost:8080
2. Press F12 to open DevTools
3. Click device toolbar icon (mobile view)
4. Set to iPhone 12 (390px width)
5. Scroll through entire page
6. **Expected:**
   - All sections readable
   - No horizontal scroll
   - Text and images properly sized
7. **Test mobile menu:**
   - Click hamburger icon (top right)
   - Navigation menu should appear
   - Click link, should scroll smoothly

### Test 3: Testimonials and Calendar ✓

1. On landing page, scroll to "Temoignages" section
2. **Expected:**
   - 3 testimonial cards visible
   - Social proof stats: "150+ restaurants", "50 000+ commandes", "4.8/5 satisfaction"
3. Scroll to contact section
4. **Expected:**
   - Calendly widget visible (may show "This event type doesn't exist" until configured)

### Test 4: Admin Authentication ✓

1. Open http://localhost:3000
2. Should redirect to /login
3. Enter your admin email and password
4. Click "Se connecter"
5. **Expected:**
   - Redirected to /dashboard
   - Header shows your email
   - Sidebar shows "Dashboard" and "Leads" links

### Test 5: Admin Leads Dashboard ✓

1. Click "Leads" in sidebar (or go to /admin/leads)
2. **Expected:**
   - Stats cards show:
     - Total leads: 1 (or more)
     - Nouveaux: 1 (or more)
     - Taux de conversion: 0%
   - Table shows test lead from Test 1
   - Lead has blue "Nouveau" badge
   - Columns: Restaurant, Contact, Type, Source, Status, Date

### Test 6: Magic Link Authentication (Optional) ✓

1. Log out (click header menu > Deconnexion)
2. On login page, click "Lien magique" tab
3. Enter your email
4. Click "Envoyer le lien"
5. **Expected:** Message "Un lien de connexion a ete envoye"
6. Check your email inbox
7. Click magic link in email
8. **Expected:**
   - Browser opens to /auth/callback
   - Redirected to /dashboard
   - You are logged in

### Test 7: Non-Admin Access Control ✓

1. Create new user:
   - Log out if logged in
   - Go to http://localhost:3000/signup
   - Create account with different email
   - Confirm email
2. Log in as this new user
3. Try to access http://localhost:3000/admin/leads directly
4. **Expected:**
   - Redirected to /dashboard
   - Sidebar does NOT show "Leads" link
   - Only shows "Dashboard" and "Mes parrainages"

## Step 5: Optional Configuration

### Calendly Integration

To replace placeholder with real calendar:

1. Create free Calendly account: https://calendly.com
2. Create event type (e.g., "Demo Clickresto - 30 min")
3. Copy your Calendly link
4. Edit `index.html`:
   - Find: `https://calendly.com/votre-compte`
   - Replace with: Your actual Calendly link

## Troubleshooting

### Form submission doesn't work
- Check browser console (F12 > Console)
- Verify Supabase credentials in `js/supabase-config.js`
- Check CORS settings in Supabase Dashboard

### Back-office won't start
- Run `cd backoffice && npm install`
- Check `.env.local` exists with correct values
- Verify Node.js version: `node -v` (should be 18+)

### Can't log in
- Verify email confirmation (check spam folder)
- Check auth redirect URLs in Supabase Dashboard
- Try password reset flow

### Admin dashboard shows "Forbidden"
- Verify admin role in database:
  ```sql
  SELECT * FROM public.user_roles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'your-email@example.com'
  );
  ```
- Role should be 'admin', not 'affiliate'

## Success Criteria

Phase 1 is complete when all tests pass:

- ✓ Lead submission stores data in Supabase
- ✓ Landing page mobile responsive
- ✓ Testimonials and calendar sections present
- ✓ Auth flows work (signup, login, magic link)
- ✓ Admin dashboard shows leads with stats
- ✓ Role-based access control works

## Next Steps

After verifying all tests pass, you're ready for:
- **Phase 2:** Affiliate registration and referral system
- **Production deployment:** Configure production Supabase project and deploy

## Support

If you encounter issues not covered here, check:
- Supabase logs in Dashboard > Logs
- Browser console errors (F12)
- Terminal output from dev servers
