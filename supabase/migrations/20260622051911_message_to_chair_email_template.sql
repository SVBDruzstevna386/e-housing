insert into public.email_templates (key, title, subject, body) values
  (
    'message-to-chair',
    'Notifikácia predsedovi o správe',
    'Nová správa pre predsedu SVB: {{subject}}',
    'Dobrý deň,

v aplikácii e-housing bola vytvorená správa, ktorú má predseda SVB preveriť.

Typ správy: {{scope}}
Odosielateľ: {{sender}}
Predmet: {{subject}}
Komu: {{recipient}}

Text správy:
{{message}}

Prosíme, prihláste sa do aplikácie e-housing a pozrite si detail komunikácie.'
  )
on conflict (building_id, key) do update
set
  title = excluded.title,
  subject = excluded.subject,
  body = excluded.body;
