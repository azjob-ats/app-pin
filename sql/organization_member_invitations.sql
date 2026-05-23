// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations      → organizations.sql
//   - organization_roles → organization_roles.sql
//   - users              → users.sql
// ----------------------------------------------------------------------------

//
// Example rows (pending invitations for Nubank):
//   id=1 | email='novo.recrutador@nubank.com.br' | role_id=2 (recruiter) | invited_by=10 | token='inv_a1b2…' | expires_at='2026-05-26' | accepted_at=NULL
//   id=2 | email='comercial@nubank.com.br'       | role_id=3 (sales)     | invited_by=10 | token='inv_c3d4…' | expires_at='2026-05-26' | accepted_at=NULL
//
Table organization_member_invitations {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  email varchar [not null]
  role_id bigint [ref: > organization_roles.id, not null]
  invited_by_user_id bigint [ref: > users.id, not null]
  token varchar [unique, not null]
  expires_at timestamptz [not null]                  // default +7 days
  accepted_at timestamptz
  cancelled_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (organization_id, email) [unique]
  }
}
