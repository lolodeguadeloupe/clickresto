# Clickresto Setup Guide

This guide covers the complete setup for Clickresto Phase 1: Landing Page + Admin Back-office.

## Prerequisites

- Node.js 18+ (for backoffice)
- A Supabase account (free tier works)
- A Calendly account (for booking widget)
- A static file server (VS Code Live Server, http-server, etc.)

## 1. Supabase Project Setup

### 1.1 Create Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name it "clickresto" (or your preference)
4. Choose a strong database password (save this)
5. Select your preferred region
6. Wait for project to provision (~2 minutes)

### 1.2 Get Your Credentials

1. In your Supabase project, go to **Settings > API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 1.3 Run Database Schema

1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned."

This creates:
- `user_roles` table (admin/affiliate roles)
- `leads` table (demo requests)
- RLS policies for security
- Auto-role assignment trigger (new users get 'affiliate' role)

### 1.4 Configure Auth Redirect URLs

1. In Supabase, go to **Authentication > URL Configuration**
2. Add these to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - Your production backoffice URL (when deployed)

### 1.5 Create Admin User

After running the schema, you need to create at least one admin user:

1. Go to **Authentication > Users** in Supabase
2. Click "Add user" > "Create new user"
3. Enter email and password
4. After user is created, go to **Table Editor > user_roles**
5. Find the row with your user_id (auto-created with role 'affiliate')
6. Edit it: change `role` from `affiliate` to `admin`
7. Save

## 2. Landing Page Configuration

### 2.1 Configure Supabase Client

Edit `js/supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Replace with your actual values from Step 1.2.

### 2.2 Configure Calendly Widget

1. Create a Calendly account at [calendly.com](https://calendly.com)
2. Set up your event type (e.g., "Demo de 30 minutes")
3. Get your Calendly URL (e.g., `https://calendly.com/votre-nom/demo`)

Edit `index.html`, find this line (~line 1792):

```html
<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_CALENDLY_URL?hide_gdpr_banner=1&primary_color=e63946"></div>
```

Replace `YOUR_CALENDLY_URL` with your actual Calendly path (e.g., `votre-nom/demo`).

## 3. Backoffice Configuration

### 3.1 Create Environment File

```bash
cd backoffice
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Install Dependencies

```bash
cd backoffice
npm install
```

## 4. Running the Project

### 4.1 Start the Backoffice (Admin Dashboard)

```bash
cd backoffice
npm run dev
```

The backoffice runs at: `http://localhost:3000`

### 4.2 Serve the Landing Page

**Option A: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` > "Open with Live Server"
- Usually runs at `http://localhost:5500`

**Option B: http-server**
```bash
npx http-server -p 8080
```
Open `http://localhost:8080`

**Option C: Python**
```bash
python -m http.server 8080
```
Open `http://localhost:8080`

## 5. Testing the Setup

### Test 1: Landing Page Form

1. Open landing page in browser
2. Fill in the contact form:
   - Prenom: Test
   - Nom: User
   - Email: test@example.com
   - Telephone: 0612345678
   - Restaurant: Mon Restaurant
3. Submit the form
4. You should see a success message
5. In Supabase > Table Editor > leads, verify the new row appears

### Test 2: Admin Login

1. Open `http://localhost:3000`
2. Click "Se connecter"
3. Enter your admin email/password
4. You should see the dashboard with leads

### Test 3: Leads Dashboard

1. After logging in as admin
2. Click "Leads" in the sidebar
3. You should see:
   - Stats cards (Total, Nouveaux, Taux conversion)
   - Table with the lead you created

## Troubleshooting

### "Form submission failed"
- Check browser console for errors
- Verify `js/supabase-config.js` has correct credentials
- Verify Supabase project is running

### "Cannot read leads"
- Verify user has `admin` role in `user_roles` table
- Check that RLS policies were created (run schema again if needed)

### Auth callback errors
- Verify redirect URLs in Supabase Dashboard
- Check `.env.local` has correct values

### Magic link not arriving
- Check spam folder
- Verify email settings in Supabase > Authentication > Email Templates

## File Structure Overview

```
clickresto/
├── index.html              # Landing page (static)
├── js/
│   └── supabase-config.js  # Supabase client config
├── backoffice/             # Next.js admin app
│   ├── .env.local          # Environment variables (create this)
│   ├── .env.example        # Template for env vars
│   ├── src/app/            # Next.js App Router pages
│   └── src/lib/supabase/   # Supabase client utilities
└── supabase/
    └── schema.sql          # Database schema
```
