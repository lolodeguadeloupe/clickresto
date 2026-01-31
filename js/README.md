# JavaScript Configuration

This directory contains the client-side JavaScript files for the Clickresto landing page.

## Files

- **supabase-config.js** - Supabase client initialization
- **lead-form.js** - Contact form submission handler with validation

## Configuration

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key from Project Settings > API

### 2. Configure Credentials

Edit `supabase-config.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. Create Database Table

Run the following SQL in your Supabase SQL Editor (or use the schema from `supabase/schema.sql`):

```sql
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    restaurant_name TEXT NOT NULL,
    request_type TEXT DEFAULT 'demo',
    message TEXT,
    source TEXT DEFAULT 'landing_page',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for landing page form)
CREATE POLICY "Allow public insert" ON leads
    FOR INSERT
    WITH CHECK (true);
```

### 4. Test the Form

1. Open `index.html` in a browser
2. Fill out the contact form with valid data
3. Submit the form
4. Check Supabase Table Editor to verify the lead was created

## Fallback Mode

If Supabase is not configured or unavailable:
- The form will still show success message (for demo purposes)
- Console will log "Form submitted in fallback mode"
- Lead data will be logged to console for debugging

## Form Validation

The form validates:
- **Required fields**: First name, last name, email, restaurant name
- **Email format**: Must be valid email address
- **Phone format** (optional): French format (+33 or 0 followed by 9 digits)

## Troubleshooting

### "Supabase credentials not configured"
- Check that you've replaced the placeholder values in `supabase-config.js`
- Ensure URL format is `https://your-project.supabase.co`

### Form submits but no data in Supabase
- Check browser console for errors
- Verify the `leads` table exists
- Verify RLS policy allows inserts
- Check that column names match (snake_case in database)

### CORS errors
- Ensure your domain is in Supabase allowed origins (Settings > API > CORS)
- For local development, `http://localhost` should work by default
