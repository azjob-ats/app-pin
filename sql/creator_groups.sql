// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - users         → users.sql
// ----------------------------------------------------------------------------
//
// Grupos nomeados de creators dentro de uma organização. Permitem liberar
// produtos em lote (ex.: o produto "Workshop Signals" libera o grupo
// "Webiner Nubank" e todos os creators do grupo passam a poder vendê-lo).
// Os membros ficam em creator_group_members.
//
// Example rows (grupos do Nubank, organization_id=1):
//   id=1 | uuid='…' | name='Webiner Nubank'     | created_by_user_id=10
//   id=2 | uuid='…' | name='Conteúdo Comercial' | created_by_user_id=10
//
Table creator_groups {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]
  name varchar [not null]                                 // ex.: "Webiner Nubank"
  description varchar
  created_by_user_id bigint [ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, name) [unique]
  }
}
