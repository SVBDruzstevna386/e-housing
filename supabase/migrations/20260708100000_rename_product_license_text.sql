update public.email_templates
set
  subject = replace(subject, 'e-housing ' || 'solutions', 'e - Housing Solutions Licence'),
  body = replace(body, 'e-housing ' || 'solutions', 'e - Housing Solutions Licence')
where subject like '%' || 'e-housing ' || 'solutions' || '%'
   or body like '%' || 'e-housing ' || 'solutions' || '%';

update public.app_settings
set
  value = replace(value, 'e-housing ' || 'solutions', 'e - Housing Solutions Licence'),
  updated_at = now()
where value like '%' || 'e-housing ' || 'solutions' || '%';
