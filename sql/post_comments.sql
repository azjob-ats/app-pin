// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - posts  → posts.sql
//   - users  → users.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/posts.js → objeto `comment.data[]`
//
// Threading note:
//   O mock usa `replied: null` para comentários de raiz e `replies.totalRecords`
//   como counter denormalizado. Normalizamos para `parent_comment_id` (self-ref)
//   e `replies_count`. Suporta threading em N níveis, mas o feed atual exibe
//   só raiz + 1 nível de respostas.

// ----------------------------------------------------------------------------
// Post comments (comentários em posts do feed)
// ----------------------------------------------------------------------------
//
// Example rows (post_id=1, "Visão geral da RealWe"):
//   id=1
//   uuid='c1-…-a'
//   post_id=1
//   parent_comment_id=NULL                                  // comentário raiz
//   author_user_id=42 (@ana_tech)
//   body='Que vídeo inspirador! Trabalhar no setor público realmente tem essa missão de servir à sociedade.'
//   likes_count=42
//   replies_count=9                                         // 9 respostas filhas
//   created_at='2026-05-22 19:30:00'
//
//   id=2
//   post_id=1
//   parent_comment_id=NULL
//   author_user_id=43 (@pedro_dev)
//   body='Como desenvolvedor, vejo a importância da tecnologia para melhorar os serviços públicos. Parabéns pelo trabalho!'
//   likes_count=31
//   replies_count=4
//
//   id=10
//   post_id=1
//   parent_comment_id=1                                     // resposta ao comentário 1
//   author_user_id=89
//   body='Concordo demais!'
//
Table post_comments {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  post_id bigint [ref: > posts.id, not null]
  parent_comment_id bigint [ref: > post_comments.id]            // NULL = raiz; preenchido = resposta encadeada
  author_user_id bigint [ref: > users.id, not null]             // mock: `user: '@handle'` → resolvido para users.id
  body text [not null]                                          // `text` no mock
  likes_count integer [not null, default: 0]                    // counter denormalizado
  replies_count integer [not null, default: 0]                  // `replies.totalRecords` no mock
  is_reported boolean [not null, default: false]                // flag de moderação
  created_at timestamptz [not null, default: `now()`]           // `time` no mock
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (post_id, created_at)
    parent_comment_id
    author_user_id
  }
}
