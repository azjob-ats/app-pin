// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - users         → users.sql
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Audit log (supports the rule "Logs de ações por usuário")
// ----------------------------------------------------------------------------
//
// Example rows (Nubank activity):
//   id=1 | actor_user_id=10 | action='member.invited'           | target_type='invitation' | target_id=1 | metadata={"email":"novo.recrutador@nubank.com.br","role":"recruiter"}
//   id=2 | actor_user_id=10 | action='role.permission.updated'  | target_type='role'       | target_id=2 | metadata={"changed":["create_product:true"]}
//   id=3 | actor_user_id=10 | action='department.member.added'  | target_type='department' | target_id=1 | metadata={"member_id":2}
//   id=4 | actor_user_id=11 | action='member.removed'           | target_type='member'     | target_id=5 | metadata={"reason":"left_company"}
//
Table organization_audit_logs {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  actor_user_id bigint [ref: > users.id]
  action varchar [not null]                  // e.g. 'member.invited', 'role.permission.updated'
  target_type varchar                        // e.g. 'member', 'role', 'department', 'invitation'
  target_id bigint
  metadata jsonb
  created_at timestamptz [not null, default: `now()`]
}
