// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Table user_security {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  password_hash varchar [not null]
  verified_email boolean [not null, default: false]
  verified_phone boolean [not null, default: false]
  email_verified_at timestamptz
  phone_verified_at timestamptz
  two_factor_enabled boolean [not null, default: false]
  failed_login_attempts integer [not null, default: 0]
  locked_until timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
