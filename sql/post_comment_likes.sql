// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users         → users.sql
//   - post_comments → post_comments.sql
// ----------------------------------------------------------------------------
//
// Fonte de verdade do `post_comments.likes_count`. Manter por trigger.

Table post_comment_likes {
  user_id bigint [ref: > users.id, not null]
  comment_id bigint [ref: > post_comments.id, not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, comment_id) [pk]
    (comment_id, created_at)
  }
}
