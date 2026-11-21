-- Additive migration: run AFTER setup.sql. Does not reset saves or sessions.
begin;
create table if not exists public.carnival_backups (
 id bigint generated always as identity primary key,
 profile text not null check(profile in ('nayleen','testing')),
 state jsonb not null check(octet_length(state::text)<=200000),
 revision bigint not null, created_at timestamptz not null default now(),
 reason text not null check(reason in ('automatic','before-recovery'))
);
create index if not exists carnival_backups_profile_date on public.carnival_backups(profile,created_at desc,id desc);
alter table public.carnival_backups enable row level security;
revoke all on public.carnival_backups from public,anon,authenticated;
grant all on public.carnival_backups to service_role;
grant usage,select on sequence public.carnival_backups_id_seq to service_role;

create or replace function public.carnival_trim_backups(p_profile text) returns void
language sql security definer set search_path=public as $$
 delete from public.carnival_backups where profile=p_profile and id not in
 (select id from public.carnival_backups where profile=p_profile order by created_at desc,id desc limit 10);
$$;
create or replace function public.carnival_snapshot_save() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.carnival_backups where profile=new.profile and reason='automatic' and created_at>now()-interval '3 days') then
  if tg_op='UPDATE' then
   insert into public.carnival_backups(profile,state,revision,reason) values(old.profile,old.state,old.revision,'automatic');
  else
   insert into public.carnival_backups(profile,state,revision,reason) values(new.profile,new.state,new.revision,'automatic');
  end if;
  perform public.carnival_trim_backups(new.profile);
 end if;
 return new;
end;$$;
drop trigger if exists carnival_snapshot_save on public.carnival_saves;
create trigger carnival_snapshot_save after insert or update on public.carnival_saves for each row execute function public.carnival_snapshot_save();

create or replace function public.carnival_restore_save(p_state jsonb,p_revision bigint,p_profile text)
returns table(state jsonb,revision bigint) language plpgsql security definer set search_path=public as $$
declare previous public.carnival_saves%rowtype;
begin
 if p_profile not in ('nayleen','testing') or octet_length(p_state::text)>200000 then raise exception 'Invalid recovery'; end if;
 select * into previous from public.carnival_saves where profile=p_profile for update;
 if not found then
  if p_revision<>0 then return; end if;
  return query select * from public.carnival_write_save(p_state,0,p_profile); return;
 end if;
 if previous.revision<>p_revision then return; end if;
 insert into public.carnival_backups(profile,state,revision,reason) values(p_profile,previous.state,previous.revision,'before-recovery');
 return query update public.carnival_saves as s set state=p_state,revision=s.revision+1 where s.profile=p_profile returning s.state,s.revision;
 perform public.carnival_trim_backups(p_profile);
end;$$;
revoke all on function public.carnival_trim_backups(text),public.carnival_snapshot_save(),public.carnival_restore_save(jsonb,bigint,text) from public,anon,authenticated;
grant execute on function public.carnival_restore_save(jsonb,bigint,text) to service_role;
commit;
