// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organization_departments → organization_departments.sql
//   - organization_members     → organization_members.sql
//   - users                    → users.sql
// ----------------------------------------------------------------------------

//
// Example rows (memberships):
//   department_id=1 (RH)        | member_id=2 (Bruno Lima)    | added_by=10
//   department_id=2 (Comercial) | member_id=3 (Carla Mendes)  | added_by=10
//   department_id=3 (Univ.)     | member_id=4 (Daniel Rocha)  | added_by=10
//
Table organization_department_members {
  department_id bigint [ref: > organization_departments.id, not null]
  member_id bigint [ref: > organization_members.id, not null]
  added_by_user_id bigint [ref: > users.id]
  added_at timestamptz [not null, default: `now()`]

  indexes {
    (department_id, member_id) [pk]
  }
}
