// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
//   - posts → posts.sql
// ----------------------------------------------------------------------------
//
// Bloqueio user-específico de post: presença da linha = user não quer ver
// este post no feed. Reaproveita o enum content_block_reason de
// user_organization_blocks.sql.

Table user_post_blocks {
  user_id bigint [ref: > users.id, not null]
  post_id bigint [ref: > posts.id, not null]
  reason content_block_reason [not null, default: 'not_interested']
  notes text
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, post_id) [pk]
  }
}
