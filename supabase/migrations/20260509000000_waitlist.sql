-- Marketing waitlist for dripmatiq.app
-- Insert-only via anon key; reads gated to service_role.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text default 'web',
  user_agent  text,
  referrer    text,
  utm         jsonb,
  created_at  timestamptz not null default now(),
  ip_hash     text
);

create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Anonymous users may only INSERT. They cannot SELECT/UPDATE/DELETE.
drop policy if exists "waitlist_insert_anon" on public.waitlist;
create policy "waitlist_insert_anon"
  on public.waitlist
  for insert
  to anon
  with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(email) <= 254
    and (source is null or char_length(source) <= 32)
  );

-- Authenticated app users may also insert (e.g. from in-app referral).
drop policy if exists "waitlist_insert_auth" on public.waitlist;
create policy "waitlist_insert_auth"
  on public.waitlist
  for insert
  to authenticated
  with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(email) <= 254
  );

-- service_role bypasses RLS by default; explicit read policy not required.

comment on table public.waitlist is 'Pre-launch + ongoing email capture from dripmatiq.app';
