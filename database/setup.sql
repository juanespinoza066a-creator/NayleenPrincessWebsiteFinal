-- Run once in Supabase SQL Editor. No personal notes or passcodes belong here.
create table if not exists public.carnival_saves(profile text primary key constraint carnival_saves_profile_check check(profile in ('nayleen','testing')), state jsonb not null, revision bigint not null default 1);
create table if not exists public.carnival_sessions(token_hash text primary key, expires_at timestamptz not null, profile text not null default 'nayleen' check(profile in ('nayleen','testing')));
create table if not exists public.carnival_attempts(bucket text primary key, attempts integer not null, expires_at timestamptz not null);
-- Clear old login lockouts only. Game saves and sessions stay intact.
delete from public.carnival_attempts;
-- Safe upgrades from the earlier single-profile setup; existing progress stays.
alter table public.carnival_saves drop constraint if exists carnival_saves_profile_check;
alter table public.carnival_saves add constraint carnival_saves_profile_check check(profile in ('nayleen','testing'));
alter table public.carnival_sessions add column if not exists profile text not null default 'nayleen';
drop function if exists public.carnival_write_save(jsonb,bigint);
alter table public.carnival_saves enable row level security;
alter table public.carnival_sessions enable row level security;
alter table public.carnival_attempts enable row level security;
revoke all on public.carnival_saves,public.carnival_sessions,public.carnival_attempts from anon,authenticated;
grant all on public.carnival_saves,public.carnival_sessions,public.carnival_attempts to service_role;
create or replace function public.carnival_take_attempt(p_bucket text) returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 delete from public.carnival_attempts where expires_at<now()-interval '1 day';
 delete from public.carnival_sessions where expires_at<now();
 insert into public.carnival_attempts(bucket,attempts,expires_at) values(p_bucket,1,now()+interval '1 minute')
 on conflict(bucket) do update set attempts=case when carnival_attempts.expires_at<now() then 1 else carnival_attempts.attempts+1 end,
 expires_at=case when carnival_attempts.expires_at<now() then now()+interval '1 minute' else carnival_attempts.expires_at end returning attempts into n;
 return n<=30;
end; $$;
create or replace function public.carnival_write_save(p_state jsonb,p_revision bigint,p_profile text) returns table(state jsonb,revision bigint) language plpgsql security definer set search_path=public as $$
begin
 if p_profile not in ('nayleen','testing') then raise exception 'Unknown profile'; end if;
 if p_revision=0 then
  return query insert into public.carnival_saves as s(profile,state,revision) values(p_profile,p_state,1) on conflict do nothing returning s.state,s.revision;
  if found then return; end if;
 end if;
 return query update public.carnival_saves as s set state=p_state,revision=s.revision+1 where s.profile=p_profile and s.revision=p_revision returning s.state,s.revision;
end; $$;
revoke all on function public.carnival_take_attempt(text),public.carnival_write_save(jsonb,bigint,text) from public,anon,authenticated;
grant execute on function public.carnival_take_attempt(text),public.carnival_write_save(jsonb,bigint,text) to service_role;
