-- Certificates schema with globally unique, human-friendly IDs and verification RPCs
create extension if not exists pgcrypto;

-- Certificate issuance records
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  issued_at timestamptz not null default now(),
  pdf_url text,
  metadata jsonb not null default '{}'::jsonb,
  issued_by uuid references auth.users(id),
  hash text
);

-- Sequence keeper per year+course_code (atomic increment)
create table if not exists public.certificate_sequences (
  year int not null,
  course_code text not null,
  seq int not null default 0,
  primary key (year, course_code)
);

-- Ensure certificate_id column exists for legacy installations
alter table if exists public.certificates
  add column if not exists certificate_id text;

create index if not exists idx_certificates_certificate_id on public.certificates(certificate_id);

alter table public.certificates enable row level security;

-- RLS: Owners can read; admins/trainers can read+insert+update
drop policy if exists cert_owner_read on public.certificates;
create policy cert_owner_read on public.certificates
for select using (
  auth.uid() = user_id or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','trainer'))
);

drop policy if exists cert_admin_trainer_insert on public.certificates;
create policy cert_admin_trainer_insert on public.certificates
for insert with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','trainer'))
);

drop policy if exists cert_admin_trainer_update on public.certificates;
create policy cert_admin_trainer_update on public.certificates
for update using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','trainer'))
);

-- Prevent editing immutable fields on certificates
create or replace function public.prevent_certificate_core_update()
returns trigger
as $$
begin
  if new.certificate_id is distinct from old.certificate_id then
    raise exception 'certificate_id is immutable';
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'user_id is immutable';
  end if;
  if coalesce(new.course_id, '00000000-0000-0000-0000-000000000000'::uuid) is distinct from coalesce(old.course_id, '00000000-0000-0000-0000-000000000000'::uuid) then
    raise exception 'course_id is immutable';
  end if;
  if new.issued_at is distinct from old.issued_at then
    raise exception 'issued_at is immutable';
  end if;
  -- allowed to update only pdf_url, metadata, hash
  return new;
end;
$$
language plpgsql;

drop trigger if exists trg_prevent_certificate_core_update on public.certificates;
create trigger trg_prevent_certificate_core_update
before update on public.certificates
for each row execute function public.prevent_certificate_core_update();

-- Helper: derive a 4-char course code from a title (fallback: GEN)
create or replace function public.derive_course_code(title_input text)
returns text
language sql
immutable
as $$
  select coalesce(
    upper(
      regexp_replace(
        string_agg(substr(w,1,1), '' order by ord),
        '[^A-Z0-9]', '', 'g'
      )
    ), 'GEN'
  )
  from (
    select ord, w from unnest(regexp_split_to_array(coalesce(title_input,''), '\s+')) with ordinality as t(w, ord)
  ) s;
$$;

-- RPC: issue_certificate - creates a unique human-friendly ID: KA-<year>-<CODE>-<00001>
create or replace function public.issue_certificate(
  p_user_id uuid,
  p_course_id uuid default null,
  p_course_code text default null,
  p_issued_by uuid default null
)
returns public.certificates
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_year int := extract(year from now());
  v_code text;
  v_next int;
  v_cert_id text;
  v_course_id uuid := p_course_id;
  v_title text;
  result public.certificates%rowtype;
begin
  if p_course_code is not null then
    v_code := upper(regexp_replace(p_course_code, '[^A-Za-z0-9]', '', 'g'));
  elsif v_course_id is not null then
    select title into v_title from public.courses where id = v_course_id;
    v_code := coalesce(derive_course_code(v_title), 'GEN');
  else
    v_code := 'GEN';
  end if;

  insert into public.certificate_sequences(year, course_code, seq)
  values (v_year, v_code, 1)
  on conflict (year, course_code)
  do update set seq = public.certificate_sequences.seq + 1
  returning public.certificate_sequences.seq into v_next;

  v_cert_id := format('KA-%s-%s-%s', v_year, v_code, lpad(v_next::text, 5, '0'));

  insert into public.certificates(certificate_id, user_id, course_id, issued_by)
  values (v_cert_id, p_user_id, v_course_id, coalesce(p_issued_by, auth.uid()))
  returning * into result;

  return result;
end;
$$;

-- Public verification RPC: returns minimal fields for verification by code
create or replace function public.verify_certificate(code_input text)
returns table (
  certificate_id text,
  user_id uuid,
  course_id uuid,
  issued_at timestamptz,
  pdf_url text
)
language sql
security definer
set search_path = public
as $$
  select c.certificate_id, c.user_id, c.course_id, c.issued_at, c.pdf_url
  from public.certificates c
  where c.certificate_id = code_input
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

revoke all on function public.issue_certificate(uuid, uuid, text, uuid) from public;
grant execute on function public.issue_certificate(uuid, uuid, text, uuid) to authenticated;
