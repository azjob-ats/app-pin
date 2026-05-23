// ----------------------------------------------------------------------------
// External tables referenced by this file:
//   - users → users.sql
//   - posts → posts.sql
// ----------------------------------------------------------------------------
//
// Append-only — 1 linha por compartilhamento. Mesmo user pode compartilhar
// o mesmo post em múltiplos canais. Alimenta `posts.shares_count` por trigger
// (ou job de rollup, dependendo do volume).

Enum share_channel {
  link              // copy link to clipboard
  whatsapp
  email
  twitter
  facebook
  linkedin
  telegram
  internal_dm       // compartilhamento via DM interno do app
  external_other    // canal não classificado
}

Table post_shares {
  id bigint [pk, increment]
  post_id bigint [ref: > posts.id, not null]
  sharer_user_id bigint [ref: > users.id]                       // nullable — share anônimo (raro, mas possível em links públicos)
  channel share_channel [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (post_id, created_at)
    (sharer_user_id, created_at)
    (post_id, channel)                                          // breakdown "qual canal mais compartilhou este post"
  }
}
