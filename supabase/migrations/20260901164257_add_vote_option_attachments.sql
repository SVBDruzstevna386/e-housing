alter table public.vote_question_options
  add column attachment_storage_path text null,
  add column attachment_file_name text null,
  add column attachment_content_type text null,
  add column attachment_size_bytes bigint null;

alter table public.vote_question_options
  add constraint vote_question_options_attachment_metadata_check
  check (
    (
      attachment_storage_path is null
      and attachment_file_name is null
      and attachment_content_type is null
      and attachment_size_bytes is null
    )
    or (
      attachment_storage_path is not null
      and attachment_file_name is not null
      and char_length(attachment_storage_path) <= 1024
      and char_length(attachment_file_name) between 1 and 255
      and attachment_size_bytes between 1 and 20971520
    )
  );

notify pgrst, 'reload schema';
