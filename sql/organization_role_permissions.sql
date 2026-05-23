// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organization_roles → organization_roles.sql
//   - permissions        → permissions.sql
// ----------------------------------------------------------------------------

//
// Example rows (recruiter role of Nubank):
//   role_id=2 (recruiter) | permission_id=1  (create_product)              | allowed=true
//   role_id=2 (recruiter) | permission_id=2  (edit_product)                | allowed=true
//   role_id=2 (recruiter) | permission_id=3  (move_product_between_phases) | allowed=true
//   role_id=2 (recruiter) | permission_id=7  (view_triages)                | allowed=true
//   role_id=2 (recruiter) | permission_id=10 (invite_manage_users)         | allowed=false
//   role_id=2 (recruiter) | permission_id=11 (edit_company_settings)       | allowed=false
//   role_id=2 (recruiter) | permission_id=13 (view_metrics)                | allowed=true
//
Table organization_role_permissions {
  role_id bigint [ref: > organization_roles.id, not null]
  permission_id bigint [ref: > permissions.id, not null]
  allowed boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (role_id, permission_id) [pk]
  }
}
