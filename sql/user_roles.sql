// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
//   - roles → roles.sql
// ----------------------------------------------------------------------------

Table user_roles {
  user_id bigint [ref: > users.id, not null]
  role_id bigint [ref: > roles.id, not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, role_id) [pk]
  }
}
