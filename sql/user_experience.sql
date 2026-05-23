// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - user_profiles → user_profiles.sql
// ----------------------------------------------------------------------------

Table user_experience {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  position varchar [not null]
  company varchar [not null]
  logo varchar
  employment_type varchar
  work_mode varchar
  location varchar
  start_date date [not null]
  end_date date
  is_current boolean [not null, default: false]
  description varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
