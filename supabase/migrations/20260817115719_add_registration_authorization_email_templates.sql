insert into public.email_templates (building_id, key, title, subject, body)
values
  (
    '38600000-0000-0000-0000-000000000386',
    'registration-pending-admin',
    'Registrácia čaká na autorizáciu',
    'Nová registrácia čaká na autorizáciu: {{name}}',
    'Dobrý deň,

v aplikácii e - Housing Solutions Licence bola vytvorená nová registrácia, ktorá čaká na autorizáciu predsedom SVB.

Meno: {{name}}
Email: {{email}}
Rola: {{role}}
Byt: {{flat}}
Stav: {{status}}

Prosíme, prihláste sa do aplikácie a registráciu skontrolujte v záložke Vlastníci a byty.

Detail otvoríte kliknutím na tento odkaz:
{{actionUrl}}'
  ),
  (
    '38600000-0000-0000-0000-000000000386',
    'registration-approved-user',
    'Autorizácia účtu potvrdená',
    'Váš účet bol autorizovaný',
    'Dobrý deň {{name}},

predseda SVB potvrdil autorizáciu vášho účtu v aplikácii e - Housing Solutions Licence.

Rola: {{role}}
Byt: {{flat}}
Stav: {{status}}

Od tejto chvíle sa môžete prihlásiť a používať sprístupnené funkcie aplikácie podľa svojej role.

Aplikáciu otvoríte kliknutím na tento odkaz:
{{actionUrl}}'
  )
on conflict (building_id, key) do update
set
  title = excluded.title,
  subject = excluded.subject,
  body = excluded.body;

notify pgrst, 'reload schema';
