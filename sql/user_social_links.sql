// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - user_profiles → user_profiles.sql
// ----------------------------------------------------------------------------

Table user_social_links {
  id bigint [pk, increment]
  user_profile_id bigint [ref: > user_profiles.id, not null]
  platform varchar [not null]
  handle varchar [not null]
  url varchar [not null]
  is_primary boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (user_profile_id, platform) [unique]
  }
}
