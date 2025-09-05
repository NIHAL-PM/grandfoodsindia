-- Extend payments table with payer metadata and optional enrollment link
alter table if exists public.payments add column if not exists payer_email text;
alter table if exists public.payments add column if not exists payer_name text;
alter table if exists public.payments add column if not exists payer_phone text;
alter table if exists public.payments add column if not exists notes text;
alter table if exists public.payments add column if not exists course_id text;
alter table if exists public.payments add column if not exists course_title text;
alter table if exists public.payments add column if not exists plan text;
alter table if exists public.payments add column if not exists enrollment_id text;
