-- Supabase Data API grant hardening for upcoming default changes.
--
-- Why:
-- - New Supabase projects (from May 30, 2026) require explicit GRANTs for
--   Data API access (PostgREST / GraphQL / supabase-js).
-- - Existing projects will enforce this behavior for newly created tables
--   starting Oct 30, 2026.
--
-- Strategy:
-- 1) Set explicit default privileges for future tables in schema public.
-- 2) Explicitly grant required privileges for existing tables.

-- Ensure API roles can resolve objects in public schema.
grant usage on schema public to anon, authenticated, service_role;

-- Future tables: no implicit data access for anon/authenticated.
alter default privileges in schema public
  revoke all on tables from anon, authenticated;

-- Future tables/sequences: service_role retains full backend access.
alter default privileges in schema public
  grant all on tables to service_role;

alter default privileges in schema public
  grant all on sequences to service_role;

-- Existing table: waitlist
-- RLS policies already control row-level behavior; table grants allow API access.
revoke all on table public.waitlist from anon, authenticated, service_role;

grant insert on table public.waitlist to anon;
grant insert on table public.waitlist to authenticated;
grant select, insert, update, delete on table public.waitlist to service_role;
