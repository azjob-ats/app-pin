// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Table user_profiles {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  first_name varchar
  last_name varchar
  profile_picture varchar
  bio text
  headline varchar
  current_position varchar
  website varchar
  portfolio_url varchar
  date_of_birth date
  gender varchar
  pronoun varchar
  telephone varchar
  is_pcd boolean [not null, default: false]
  pcd_notes varchar
  skills varchar[]
  profile_visibility varchar [not null, default: 'public']
  is_published boolean [not null, default: false]
  is_verified boolean [not null, default: false]
  verified_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
