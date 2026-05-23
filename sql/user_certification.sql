// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - user_profiles → user_profiles.sql
// ----------------------------------------------------------------------------

Table user_certification {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  issuer_name varchar [not null]
  issuer_logo varchar
  issued_at date [not null]
  expires_at date
  credential_url varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
