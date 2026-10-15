update public.email_templates
set subject = 'Problémy SVB: nová dôverná informácia',
    body = 'Dobrý deň,

v aplikácii je pre vás dostupná nová informácia v záložke Problémy SVB.

Obsah, fotografie a video otvoríte až po prihlásení a potvrdení pravidiel dôvernosti:
{{actionUrl}}

Toto upozornenie zámerne neobsahuje podrobnosti udalosti ani osobné údaje dotknutých osôb.

{{sender}}
e - Housing Solutions Licence'
where building_id = '38600000-0000-0000-0000-000000000386'
  and key = 'svb-problem'
  and subject = 'Problémy SVB: {{title}}'
  and body = 'Dobrý deň,

predseda SVB zverejnil dôležitú informáciu týkajúcu sa vlastníkov nehnuteľností.

{{title}}

{{message}}

Podrobnosti, fotografie a prípadné video nájdete v záložke Problémy SVB:
{{actionUrl}}

{{sender}}
e - Housing Solutions Licence';
