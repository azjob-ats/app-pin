// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - organizations → organizations.sql
//   - users         → users.sql
// ----------------------------------------------------------------------------
//
// Roster de creators institucionalizados de uma organização.
// Um creator é um `user` que publica pitches dentro do canal corporativo
// (mesmo user de pitches.creator_user_id). Distinto de organization_members,
// que representa o staff interno com permissões administrativas.
//
// Example rows (creators do Nubank, organization_id=1):
//   id=1 | user_id=20 (Amanda Silva) | handle='amanda.silva' | status='active'
//   id=2 | user_id=21 (Bruno Costa)  | handle='bruno.costa'  | status='active'
//   id=4 | user_id=23 (Diego Ramos)  | handle='diego.ramos'  | status='invited'
//
Enum organization_creator_status {
  active        // creator ativo, pode publicar pitches
  invited       // convidado, ainda não aceitou
  inactive      // saiu da organização (portfólio/crédito preservado)
}

Table organization_creators {
  id bigint [pk, increment]
  organization_id bigint [ref: > organizations.id, not null]
  user_id bigint [ref: > users.id, not null]              // creator (mesmo user de pitches.creator_user_id)
  handle varchar                                          // @handle público exibido no "by [creator]"
  status organization_creator_status [not null, default: 'active']
  joined_at timestamptz [not null, default: `now()`]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    (organization_id, user_id) [unique]
    (organization_id, status)
  }
}
