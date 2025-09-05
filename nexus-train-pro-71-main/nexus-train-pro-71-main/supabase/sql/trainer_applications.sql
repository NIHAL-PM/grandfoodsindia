-- Trainer applications table and basic RLS
create table if not exists public.trainer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  experience int,
  specializations text[] default '{}',
  cv_url text,
  cover_letter text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  applicant_id uuid references auth.users(id)
);

alter table public.trainer_applications enable row level security;

-- Admins can read all
drop policy if exists trainer_apps_admin_read on public.trainer_applications;
create policy trainer_apps_admin_read on public.trainer_applications
for select using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
-- Owner can read their own application
drop policy if exists trainer_apps_owner_read on public.trainer_applications;
create policy trainer_apps_owner_read on public.trainer_applications
for select using (applicant_id = auth.uid());
-- Anyone authenticated can insert their own application
drop policy if exists trainer_apps_owner_insert on public.trainer_applications;
create policy trainer_apps_owner_insert on public.trainer_applications
for insert with check (applicant_id = auth.uid());
-- Admins can update status
drop policy if exists trainer_apps_admin_update on public.trainer_applications;
create policy trainer_apps_admin_update on public.trainer_applications
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
