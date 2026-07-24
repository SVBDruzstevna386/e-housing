alter table public.events
  add column if not exists storage_path text,
  add column if not exists youtube_url text;

insert into public.email_templates (building_id, key, title, subject, body)
values (
  '38600000-0000-0000-0000-000000000386',
  'cleaning-event',
  'Nový záznam upratovania',
  'Nový záznam {{eventType}} v kalendári',
  E'Dobrý deň,\n\nv kalendári SVB bol vytvorený nový záznam upratovania.\n\nTyp: {{eventType}}\nDátum: {{eventDate}}\nVytvoril: {{sender}}\n\nDetail záznamu:\n{{message}}\n\nFotku a ďalšie informácie otvoríte v aplikácii:\n{{actionUrl}}'
)
on conflict (building_id, key) do update
set
  title = excluded.title,
  subject = excluded.subject,
  body = excluded.body;
