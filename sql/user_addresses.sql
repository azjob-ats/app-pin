// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------

Table user_addresses {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id, not null]
  label varchar
  street varchar
  number varchar
  complement varchar
  neighborhood varchar
  city varchar
  federal_state varchar
  country varchar
  postal_code varchar
  is_default boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
