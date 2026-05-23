// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
//   - posts → posts.sql
// ----------------------------------------------------------------------------
//
// Fonte de verdade do `posts.likes_count` e do flag `isLiked` na API
// (presença da linha = true para o user logado). Manter counter por trigger.

Table post_likes {
  user_id bigint [ref: > users.id, not null]
  post_id bigint [ref: > posts.id, not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, post_id) [pk]                                    // unicidade + lookup "user curtiu post?"
    (post_id, created_at)                                       // "últimos likes do post" (rolagem em telas de detalhe)
  }
}
