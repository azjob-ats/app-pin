// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users         → users.sql
//   - products      → products.sql
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

// ----------------------------------------------------------------------------
// Product ↔ Pitch (junção: aqui mora o "by [Creator Name]" e o ranking)
// ----------------------------------------------------------------------------
//
// Example rows (a Vaga product_id=1 tem 2 pitches associados):
//   id=1 | product_id=1 (Vaga Eng. Sr.) | pitch_id=1 (Amanda, short)  | is_primary=true  | display_order=0 | attribution_label=NULL
//   id=2 | product_id=1 (Vaga Eng. Sr.) | pitch_id=2 (Bruno, long)    | is_primary=false | display_order=1 | attribution_label='Entrevista institucional'
//
// O mesmo pitch_id=1 (Amanda) pode aparecer em vários products quando a Amanda
// fez um vídeo "como é trabalhar no Nubank" reaproveitado em várias vagas.
//
Table product_pitches {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, not null]
  pitch_id bigint [ref: > pitches.id, not null]
  is_primary boolean [not null, default: false]                 // o "featured" — aparece no card e no topo da página pública
  display_order integer [not null, default: 0]
  attribution_label varchar                                     // sobrescreve "by [creator name]" no card (opcional)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (product_id, pitch_id) [unique]
    (product_id, is_primary)                                    // partial recomendado: WHERE is_primary = true
    (pitch_id)
  }
}
