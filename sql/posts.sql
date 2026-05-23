// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations  → organizations.sql
//   - media_assets   → media_assets.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/posts.js (raiz dos objetos do array MOCK_POSTS)
//
// Naming note:
//   `posts` representa cada item publicado no feed por um canal (organization).
//   Distinguir de `pitches`, que é a entidade do creator (vídeo de pitch
//   associado a um produto). Um `post` agrega 1 `media_asset` + counters
//   sociais (likes/comments/shares/views) e pertence a um canal (org).

Enum post_type {
  training     // conteúdo de treinamento / onboarding
  vacancy      // divulgação de vaga
  enterprise   // post institucional (cultura, reconhecimentos)
  content      // conteúdo orgânico / noticioso
}

// ----------------------------------------------------------------------------
// Posts (publicações exibidas no feed — 1 post = 1 mídia + 1 canal + counters)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='2ee1d128-366e-4e8e-821b-d5b0f8e273d5'
//   organization_id=1 (Digix, canal '124e9f9f-…')
//   media_id=1 (media uuid '42df8491-…' — "Visão geral da RealWe")
//   post_type='training'
//   episode=1
//   is_album=false
//   published_at='2025-03-07 21:29:25'
//   likes_count=1247, comments_count=28, shares_count=156, views_count=12589
//
//   id=2
//   uuid='a348561f-bf76-4b9a-a8cf-2b0491f4fd48'
//   post_type='training'
//   organization_id=1
//   media_id=2
//   likes_count=543, comments_count=26, shares_count=76, views_count=7234
//
//   id=3
//   uuid='0a51b6fa-6076-4aa8-b436-49640ef61dbb'
//   post_type='vacancy'
//   ...
//
//   id=4
//   uuid='dbbb73d8-298e-4dce-b75d-293da1b68519'
//   post_type='enterprise'
//   ...
//
Table posts {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]   // canal publicador
  media_id bigint [ref: > media_assets.id, not null]           // mídia exibida no card
  post_type post_type [not null]                                // categoria exibida no feed
  episode integer                                               // número do episódio em uma série / collection
  is_album boolean [not null, default: false]                   // carrossel de várias mídias
  published_at timestamptz [not null, default: `now()`]         // `timestamp` no mock
  likes_count integer [not null, default: 0]                    // counter denormalizado
  comments_count integer [not null, default: 0]                 // counter denormalizado (atualizado por trigger ao inserir em post_comments)
  shares_count integer [not null, default: 0]                   // counter denormalizado
  views_count integer [not null, default: 0]                    // counter denormalizado
  is_reported boolean [not null, default: false]                // flag global de moderação
  is_blocked boolean [not null, default: false]                 // bloqueado pela moderação (não exibir)
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, published_at)
    (post_type, published_at)
    media_id
  }
}
