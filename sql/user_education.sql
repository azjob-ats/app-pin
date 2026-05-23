// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - user_profiles → user_profiles.sql
// ----------------------------------------------------------------------------

Table user_education {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  name varchar [not null]
  logo varchar
  course varchar [not null]
  start_date date [not null]
  end_date date
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
