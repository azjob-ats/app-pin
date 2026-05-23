// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------
//
// Grafo de follow user → user. Auto-relacionamento em users.id.
// Sem unique reverso: A pode seguir B sem que B siga A.
// Contadores `followers_count` / `following_count` em user_profiles devem
// ser mantidos por trigger AFTER INSERT/DELETE aqui.

Table user_follows {
  follower_user_id bigint [ref: > users.id, not null]           // quem está seguindo
  followee_user_id bigint [ref: > users.id, not null]           // quem está sendo seguido
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (follower_user_id, followee_user_id) [pk]                  // unicidade + lookup "X segue Y?"
    (followee_user_id, created_at)                              // "quem me segue, mais recentes primeiro"
  }
}
