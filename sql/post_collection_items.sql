// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - post_collections → post_collections.sql
//   - posts            → posts.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/collection-bundles.js → bundle.items[]
//
// Junction table que liga posts a coleções, com ordem de exibição.
// Um post pode aparecer em múltiplas coleções (M:N).

// ----------------------------------------------------------------------------
// Post collection items (junção posts ↔ post_collections com ordenação)
// ----------------------------------------------------------------------------
//
// Example rows (collection_id=1 "Treinamento da plataforma Habix"):
//   collection_id=1, post_id=10 (Primeiro acesso),                position=0
//   collection_id=1, post_id=11 (Explorando a busca pelos…),     position=1
//   collection_id=1, post_id=12 (Download dos processos),         position=2
//   collection_id=1, post_id=13 (Busca por pasta atual),          position=3
//   collection_id=1, post_id=14 (Busca pelo conteúdo),            position=4
//   collection_id=1, post_id=15 (Central de ajuda),               position=5
//   collection_id=1, post_id=16 (Como entrar em contato conosco), position=6
//
Table post_collection_items {
  collection_id bigint [ref: > post_collections.id, not null]
  post_id bigint [ref: > posts.id, not null]
  position integer [not null]                                   // ordem de exibição (0-indexed)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (collection_id, post_id) [pk]
    (collection_id, position)
    post_id
  }
}
