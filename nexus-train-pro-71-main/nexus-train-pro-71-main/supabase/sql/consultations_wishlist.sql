-- SQL to create missing tables and basic RLS for consultations and wishlists
-- Run this in Supabase SQL editor

-- Consultations table
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  trainer_id text,
  name text,
  email text,
  phone text,
  message text,
  call_type text check (call_type in ('phone','video','whatsapp')),
  requested_date timestamptz,
  preferred_time text,
  timezone text,
  status text default 'pending' check (status in ('pending','contacted','completed','cancelled')),
  created_at timestamptz default now()
);

alter table public.consultations enable row level security;

create policy "consultations_owner_read" on public.consultations
for select using (
  auth.uid() = user_id or
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','trainer'))
);

create policy "consultations_owner_insert" on public.consultations
for insert with check (
  user_id is null or auth.uid() = user_id
);

create policy "consultations_owner_update" on public.consultations
for update using (
  auth.uid() = user_id or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','trainer'))
);

-- Wishlists table
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  course_title text,
  course_price text,
  created_at timestamptz default now(),
  unique (user_id, course_id)
);

alter table public.wishlists enable row level security;

create policy "wishlists_owner_read" on public.wishlists
for select using (auth.uid() = user_id);

create policy "wishlists_owner_insert" on public.wishlists
for insert with check (auth.uid() = user_id);

create policy "wishlists_owner_delete" on public.wishlists
for delete using (auth.uid() = user_id);

-- Storage buckets (run in Storage policies separately if needed)
-- Buckets suggested: payment_screens, submissions, materials, certificates, avatars
-- DONE ADDED THESE TO SUPABASE