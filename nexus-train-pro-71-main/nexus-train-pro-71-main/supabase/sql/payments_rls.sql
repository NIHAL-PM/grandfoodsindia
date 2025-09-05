-- Basic RLS policies for payments table
alter table if exists public.payments enable row level security;

-- Admins can read all, others only own rows
create policy payments_read_policy on public.payments
for select using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or user_id = auth.uid()
);

-- Users can insert their own payment rows
create policy payments_insert_policy on public.payments
for insert with check (
  user_id is null or user_id = auth.uid()
);

-- Admins can update status
create policy payments_update_policy on public.payments
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
