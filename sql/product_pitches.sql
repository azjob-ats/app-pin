// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - products → products.sql
//   - pitches  → pitches.sql
// ----------------------------------------------------------------------------

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
