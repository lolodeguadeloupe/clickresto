-- Clickresto Database Schema
-- Run this SQL in Supabase SQL Editor: https://supabase.com/dashboard

-- =============================================================================
-- User Roles Table (admin or affiliate)
-- =============================================================================
create table public.user_roles (
  user_id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('admin', 'affiliate')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Users can read their own role
create policy "Users can read own role"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- =============================================================================
-- Leads Table (demo requests from landing page)
-- =============================================================================
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  restaurant text not null,
  request_type text not null default 'demo',
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source text default 'landing_page',
  affiliate_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on leads
alter table public.leads enable row level security;

-- Anyone can insert leads (public form submission)
create policy "Anyone can insert leads"
  on public.leads
  for insert
  with check (true);

-- Only admins can read all leads (using subquery for RLS performance)
create policy "Admins can read all leads"
  on public.leads
  for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid())
      and role = 'admin'
    )
  );

-- Only admins can update leads
create policy "Admins can update leads"
  on public.leads
  for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid())
      and role = 'admin'
    )
  );

-- =============================================================================
-- Triggers
-- =============================================================================

-- Auto-assign affiliate role to new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'affiliate');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp on leads
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger update_leads_updated_at
  before update on public.leads
  for each row execute procedure public.update_updated_at_column();

-- =============================================================================
-- Indexes for RLS Performance
-- =============================================================================
create index user_roles_user_id_idx on public.user_roles(user_id);
create index leads_status_idx on public.leads(status);
create index leads_created_at_idx on public.leads(created_at desc);
create index leads_affiliate_id_idx on public.leads(affiliate_id);
