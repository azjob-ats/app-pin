// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations      → organizations.sql
//   - users              → users.sql
//   - organization_roles → organization_roles.sql
// ----------------------------------------------------------------------------

Enum organization_member_status {
  active
  pending
  inactive
  removed
}

// ----------------------------------------------------------------------------
// Members (user × organization × role + lifecycle)
// ----------------------------------------------------------------------------
//
// Example rows (members of Nubank, organization_id=1):
//   id=1 | user_id=10 (Ana Souza)     | role_id=1 (admin)      | status='active'  | invited_by=NULL | accepted_at='2026-01-12'
//   id=2 | user_id=11 (Bruno Lima)    | role_id=2 (recruiter)  | status='active'  | invited_by=10   | accepted_at='2026-02-05'
//   id=3 | user_id=12 (Carla Mendes)  | role_id=3 (sales)      | status='active'  | invited_by=10   | accepted_at='2026-02-18'
//   id=4 | user_id=13 (Daniel Rocha)  | role_id=4 (education)  | status='pending' | invited_by=10   | accepted_at=NULL
//   id=5 | user_id=14 (Erica Tavares) | role_id=7 (viewer)     | status='removed' | removed_at='2026-04-30'
//
Table organization_members {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  user_id bigint [ref: > users.id, not null]
  role_id bigint [ref: > organization_roles.id, not null]
  status organization_member_status [not null, default: 'pending']
  invited_by_user_id bigint [ref: > users.id]
  invited_at timestamptz [not null, default: `now()`]
  accepted_at timestamptz
  removed_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, user_id) [unique]
  }
}
