// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Table user_settings {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  language varchar [not null, default: 'pt-BR']
  theme varchar [not null, default: 'light']
  email_notifications boolean [not null, default: true]
  push_notifications boolean [not null, default: true]
  sms_notifications boolean [not null, default: false]
  allow_marketing_emails boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
