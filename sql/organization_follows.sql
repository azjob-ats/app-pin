// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users         → users.sql
//   - organizations → organizations.sql
// ----------------------------------------------------------------------------
//
// Quem segue qual canal. Fonte de verdade do `organizations.followers_count`
// (denormalizado) — manter alinhado por trigger AFTER INSERT/DELETE.

Table organization_follows {
  user_id bigint [ref: > users.id, not null]
  organization_id bigint [ref: > organizations.id, not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, organization_id) [pk]                            // unicidade + lookup "user segue org?"
    (organization_id, created_at)                              // "seguidores deste canal, mais recentes primeiro"
  }
}
