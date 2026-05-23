// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
// ----------------------------------------------------------------------------
//
// Naming note:
//   This entity was originally drafted as `video_posts`. Renamed to `pitches`
//   because it carries the **commercial intent** of the creator's video
//   (pitch de vaga, pitch de curso, pitch de serviço). Distinguishes from
//   organic/portfolio content the creator may publish without an associated
//   product. See spec/empresa/Resposta-por que separar produto de vídeo.md.

Enum pitch_format {
  short     // Reels-like (vertical, ≤ 90s) — para feed e descoberta
  long      // horizontal, formato explicativo (1–10 min)
}

Enum pitch_status {
  draft         // creator gravou mas ainda não enviou
  processing    // upload concluído, transcoding/thumbnail em andamento
  ready         // pronto para publicação
  published     // visível ao público
  failed        // falha no processamento
  removed       // tirado do ar (creator removeu ou foi moderado)
}

// ----------------------------------------------------------------------------
// Pitches (vídeo do creator explicando/vendendo um produto)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='9f4b-…-22e3'
//   creator_user_id=20 (Amanda Silva, creator institucionalizada)
//   title='Como é trabalhar com Backend no Nubank'
//   description='Visitei o time de Pagamentos e contei tudo que rolou no dia.'
//   storage_url='https://cdn.realwe/pitches/1/master.mp4'
//   thumbnail_url='https://cdn.realwe/pitches/1/thumb.jpg'
//   duration_seconds=78
//   format='short'
//   status='published'
//   published_at='2026-05-18 10:00:00'
//
//   id=2
//   creator_user_id=21 (Bruno Costa)
//   title='Entrevista com a Engenheira Chefe do Pix'
//   duration_seconds=420
//   format='long'
//   status='published'
//
Table pitches {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  creator_user_id bigint [ref: > users.id, not null]            // autor (creator institucionalizado)
  title varchar [not null]
  description text
  storage_url varchar [not null]                                // ou FK para media_assets quando a tabela existir
  thumbnail_url varchar
  duration_seconds integer
  format pitch_format [not null, default: 'short']
  status pitch_status [not null, default: 'draft']
  published_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (creator_user_id, status)
    (status, published_at)
  }
}
