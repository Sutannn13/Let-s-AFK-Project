alter table events
add constraint volume_only_for_big_afk
check (
  (afk_type = 'Big AFK')
  or
  (afk_type <> 'Big AFK' and volume_number is null)
);
