-- Minimal stand-ins for the parts of Supabase that the migrations rely on, so the schema can be
-- tested on a plain Postgres server (CI, local Docker). NOT used on a real Supabase project.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;

create schema if not exists auth;

create table if not exists auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text
);

-- Supabase reads the caller's id from the JWT claims; the tests set this setting directly.
create or replace function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

grant usage on schema public, auth to anon, authenticated;

-- Supabase grants API roles access to new public objects; row-level security does the filtering.
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant execute on functions to anon, authenticated;
