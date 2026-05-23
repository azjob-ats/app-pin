// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users         → users.sql
//   - organizations → organizations.sql
// ----------------------------------------------------------------------------
//
// Bloqueio user-específico: presença da linha = user X não quer ver conteúdo
// da org Y no feed. Filtragem ocorre no API layer (NOT EXISTS) — não há
// counter denormalizado.

Enum content_block_reason {
  not_interested      // "Não tenho interesse" — soft filter
  spam                // marcado como spam
  inappropriate       // conteúdo ofensivo / não condiz
  reported            // bloqueio derivado de denúncia formal
  other
}

Table user_organization_blocks {
  user_id bigint [ref: > users.id, not null]
  organization_id bigint [ref: > organizations.id, not null]
  reason content_block_reason [not null, default: 'not_interested']
  notes text                                                    // opcional — texto livre do usuário ao bloquear
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, organization_id) [pk]
  }
}
