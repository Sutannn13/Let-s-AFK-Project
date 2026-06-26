alter table participants enable row level security;
alter table events enable row level security;
alter table registrations enable row level security;

create policy "allow all participants" on participants for all using (true) with check (true);
create policy "allow all events" on events for all using (true) with check (true);
create policy "allow all registrations" on registrations for all using (true) with check (true);
