insert into public.email_templates (building_id, key, title, subject, body) values
  (
    '38600000-0000-0000-0000-000000000386',
    'notification-detail',
    'Notifikácia udalosti s odkazom',
    '{{eventType}}: {{title}}',
    'Dobrý deň,

v aplikácii e - Housing Solutions Licence bola vytvorená alebo upravená udalosť.

Typ udalosti: {{eventType}}
Záložka: {{section}}
Názov: {{title}}

{{message}}

Detail otvoríte kliknutím na tento odkaz:
{{actionUrl}}'
  )
on conflict (building_id, key) do update set
  title = excluded.title,
  subject = excluded.subject,
  body = excluded.body;
