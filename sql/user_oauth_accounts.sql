// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Table user_oauth_accounts {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, not null]
  provider varchar [not null]
  provider_user_id varchar [not null]
  access_token text
  refresh_token text
  expires_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (provider, provider_user_id) [unique]
  }
}
