// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - user_profiles → user_profiles.sql
// ----------------------------------------------------------------------------

Table user_language {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  proficiency varchar [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
