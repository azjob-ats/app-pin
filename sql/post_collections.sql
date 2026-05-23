// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
// ----------------------------------------------------------------------------
//
// Mock fonte: api-server/src/data/collection-bundles.js (MOCK_COLLECTION_BUNDLES)
//
// Naming note:
//   `post_collections` é o bundle editorial de posts criado por um canal
//   (ex.: "Treinamento da plataforma Habix" com 7 vídeos sequenciais).
//   Distinto de `pin_boards` (coleções pessoais de pins por usuário).
//   Os itens da coleção estão em `post_collection_items` (junction).

// ----------------------------------------------------------------------------
// Post collections (bundles editoriais de posts agrupados por canal)
// ----------------------------------------------------------------------------
//
// Example rows:
//   id=1
//   uuid='dbbb73d8-4dce-4e7c-0e28-49640ef61dbb'
//   organization_id=1 (Digix)
//   name='Treinamento da plataforma Habix'
//   slug='treinamento-da-plataforma-habix'
//   description='Primeiros passos de como utilizar a plataforma Habix'
//   tags=['Habix','Onboarding','Treinamento','Digix','Educação']
//
//   id=2
//   uuid='tret5rt4-…'
//   organization_id=1 (Digix)
//   name='Cyber Security'
//   slug='cyber-security'
//
Table post_collections {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]    // canal dono da coleção
  name varchar [not null]                                       // `collectionName` no mock
  slug varchar [not null]                                       // `collectionNameKey` no mock — URL slug
  description text
  tags varchar[]                                                // `slang` no mock
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, slug)
    slug
  }
}
